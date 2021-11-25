import React from "react";
import { proj4crs3857def } from "../../constants/gis";
import proj4 from "proj4";
import { starkregenConstants } from "./constants";
import queryString from "query-string";
import { modifyQueryPart } from "../../tools/routingHelper";
import FeatureInfoModeBoxBaseComponent from "./components/FeatureInfoModeBoxBaseComponent";
import FeatureInfoModeButton from "./components/FeatureInfoModeButton";
import rainHazardWorker from "workerize-loader!./rainHazardWorker"; // eslint-disable-line import/no-webpack-loader-syntax
import Spliner from "cubic-spline";
const worker = new rainHazardWorker();

const xs = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const ys = [0.85, 0.9, 0.96, 1.01, 1.04, 1.05, 1.04, 1.01, 0.96, 0.9, 0.85];
const spline = new Spliner(xs, ys);

export const getRoundedValueStringForValue = (featureValue) => {
  if (featureValue > 1.5) {
    return `> 150 cm`;
  } else if (featureValue < 0.1) {
    return `< 10 cm`;
  } else {
    return `ca. ${Math.round(featureValue * 10.0) * 10.0} cm`;
  }
};

export const getFeatureInfoRequest = (mapEvent, state, setX, config, forced = false) => {
  let pos;
  if (!mapEvent) {
    if (
      state.currentFeatureInfoPosition &&
      (forced ||
        state.currentFeatureInfoSelectedSimulation !== state.selectedSimulation ||
        state.currentFeatureInfoSelectedDisplayMode !== state.displayMode ||
        state.currentFeatureInfoSelectedValueMode !== state.valueMode)
    ) {
      pos = state.currentFeatureInfoPosition;
    } else {
      return;
    }
  } else {
    pos = proj4(proj4.defs("EPSG:4326"), proj4crs3857def, [
      mapEvent.latlng.lng,
      mapEvent.latlng.lat,
    ]);
  }

  // if (state.displayMode === starkregenConstants.SHOW_HEIGHTS) {
  const minimalBoxSize = 0.0001;
  let layersString;
  if (state.valueMode === starkregenConstants.SHOW_MAXVALUES) {
    if (state.displayMode === starkregenConstants.SHOW_HEIGHTS) {
      valueAttributeName = "depth";
      layersString = config.simulations[state.selectedSimulation].depthLayer;
    } else {
      valueAttributeName = "velocity";
      layersString = config.simulations[state.selectedSimulation].velocityLayer;
    }
  } else {
    if (state.displayMode === starkregenConstants.SHOW_HEIGHTS) {
      valueAttributeName = "depth";
      layersString = config.simulations[state.selectedSimulation].depthTimeDimensionLayers.join(
        ","
      );
    } else {
      valueAttributeName = "velocity";
      layersString = config.simulations[state.selectedSimulation].velocityTimeDimensionLayers.join(
        ","
      );
    }
  }
  let valueAttributeName;
  if (state.displayMode === starkregenConstants.SHOW_HEIGHTS) {
    valueAttributeName = "depth";
  } else {
    valueAttributeName = "velocity";
  }

  const getFetureInfoRequestUrl =
    config.modelWMS +
    `&request=GetFeatureInfo&` +
    `format=image%2Fpng&transparenttrue&` +
    `version=1.1.1&tiled=true&` +
    `width=1&height=1&srs=EPSG%3A3857&` +
    `bbox=` +
    `${pos[0] - minimalBoxSize},` +
    `${pos[1] - minimalBoxSize},` +
    `${pos[0] + minimalBoxSize},` +
    `${pos[1] + minimalBoxSize}&` +
    `x=0&y=0&` +
    `layers=${layersString}&` +
    `feature_count=100&` +
    `QUERY_LAYERS=${layersString}&` +
    `INFO_FORMAT=application/json`;

  fetch(getFetureInfoRequestUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Server response wasn't OK");
      }
    })
    .then((data) => {
      let value;
      if (state.valueMode === starkregenConstants.SHOW_MAXVALUES) {
        setX.setCurrentFeatureInfoSelectedSimulation(state.selectedSimulation);
        value = data.features[0].properties[valueAttributeName];
      } else {
        const valueArray = data.features.map((f) => f.properties[valueAttributeName]);
        const dataContainer = [];
        let i = 0;
        for (const layer of config.simulations[state.selectedSimulation].depthTimeDimensionLayerX) {
          dataContainer.push({
            time: layer,
            value: valueArray[i] !== -1 ? valueArray[i] : undefined,
          });
          i++;
        }

        value = dataContainer;
      }
      // console.log("value of featureInfoRequest", value);

      setX.setCurrentFeatureInfoSelectedSimulation(state.selectedSimulation);
      setX.setCurrentFeatureInfoValue(value);
      setX.setCurrentFeatureInfoPosition(pos);
      setX.setCurrentFeatureInfoSelectedDisplayMode(state.displayMode);
      setX.setCurrentFeatureInfoSelectedValueMode(state.valueMode);
    })
    .catch((error) => {
      console.log("error during fetch", error);
    });
};

export const checkUrlAndSetStateAccordingly = (
  state,
  setX,
  history,
  resetTimeSeriesStates = () => {}
) => {
  //background
  const urlBgIndex = queryString.parse(history.location.search).bg;
  if (urlBgIndex) {
    let urlBackgroundIndex = parseInt(urlBgIndex, 10);
    if (urlBackgroundIndex !== state.selectedBackground) {
      setX.setBackgroundIndex(urlBackgroundIndex);
    }
  }

  //selected model
  const urlModelIndex = queryString.parse(history.location.search).selectedSimulation;
  if (urlModelIndex !== undefined && urlModelIndex !== null && urlModelIndex !== "") {
    let selectedSimulationFromUrl = parseInt(urlModelIndex, 10);
    if (selectedSimulationFromUrl !== state.selectedSimulation) {
      setX.setSelectedSimulation(selectedSimulationFromUrl);
    }
  }

  //appMode
  if (history.location.pathname === "/fliessgeschwindigkeiten") {
    resetTimeSeriesStates();
    setX.setDisplayMode(starkregenConstants.SHOW_VELOCITY);
  } else if (history.location.pathname === "/hoehen") {
    resetTimeSeriesStates();
    setX.setDisplayMode(starkregenConstants.SHOW_HEIGHTS);
  } else {
    resetTimeSeriesStates();
    setX.setDisplayMode(starkregenConstants.SHOW_HEIGHTS);
  }
};

export const setSimulationStateInUrl = (index, history) => {
  history.push(
    history.location.pathname +
      modifyQueryPart(history.location.search, { selectedSimulation: index })
  );
};

export const setAnimationEnabled = (enabled, currentZoom, state, history, setX, config) => {
  if (currentZoom < config.minAnimationZoom) {
    history.push(
      history.location.pathname +
        modifyQueryPart(history.location.search, {
          zoom: config.minAnimationZoom,
        })
    );
    setTimeout(() => {
      setX.setAnimationEnabled(true);
    }, 50);
  } else {
    setX.setAnimationEnabled(enabled);
  }
};

export const setBackgroundIndex = (index, history, setX) => {
  const urlBgIndex = queryString.parse(history.location.search).bg;
  let urlBackgroundIndex;
  if (urlBgIndex) {
    urlBackgroundIndex = parseInt(urlBgIndex, 10);
  } else {
    urlBackgroundIndex = -1;
  }
  if (urlBackgroundIndex !== index) {
    history.push(
      history.location.pathname +
        modifyQueryPart(history.location.search, {
          bg: index,
        })
    );
  }
  setX.setBackgroundIndex(index);
};

export const setFeatureInfoModeActivation = (
  activated,
  setX,
  currentZoom,
  state,
  history,
  config
) => {
  if (!activated) {
    setX.setCurrentFeatureInfoValue(undefined);
    setX.setCurrentFeatureInfoPosition(undefined);
  } else {
    if (currentZoom < config.minFeatureInfoZoom) {
      history.push(
        history.location.pathname +
          modifyQueryPart(history.location.search, {
            zoom: config.minFeatureInfoZoom,
          })
      );
    }
  }
  setX.setFeatureInfoModeActivation(activated);
};

export const createGetFeatureInfoControls = (
  state,
  setX,
  currentZoom,
  history,
  showModalMenu,
  config
) => {
  if (state) {
    if (state.featureInfoModeActivated === true) {
      if (
        state.displayMode === starkregenConstants.SHOW_HEIGHTS &&
        state.valueMode === starkregenConstants.SHOW_MAXVALUES
      ) {
        return [
          <FeatureInfoModeBoxBaseComponent
            setFeatureInfoModeActivation={(activated) =>
              setFeatureInfoModeActivation(activated, setX, currentZoom, state, history, config)
            }
            featureInfoValue={state.currentFeatureInfoValue}
            showModalMenu={showModalMenu}
            legendObject={config.heightsLegend}
            header="Maximaler Wasserstand"
            featureValueProcessor={getRoundedValueStringForValue}
            noValueText="Klick in die Karte zur Abfrage des simulierten max. Wasserstandes"
          />,
        ];
      } else if (
        state.displayMode === starkregenConstants.SHOW_HEIGHTS &&
        state.valueMode === starkregenConstants.SHOW_TIMESERIES
      ) {
        return [
          <FeatureInfoModeBoxBaseComponent
            setFeatureInfoModeActivation={(activated) =>
              setFeatureInfoModeActivation(activated, setX, currentZoom, state, history, config)
            }
            featureInfoValue={state.currentFeatureInfoValue}
            showModalMenu={showModalMenu}
            legendObject={config.heightsLegend}
            featureValueProcessor={(featureValue) => {
              return Math.round(featureValue * 100);
            }}
            header="Wasserstände im zeitlichen Verlauf"
            width={"250px"}
            noValueText="Klick in die Karte zur Abfrage der Wasserstände im zeitlichen Verlauf"
            ytitle="Tiefe in cm"
          />,
        ];
      } else if (
        state.displayMode === starkregenConstants.SHOW_VELOCITY &&
        state.valueMode === starkregenConstants.SHOW_MAXVALUES
      ) {
        return [
          <FeatureInfoModeBoxBaseComponent
            setFeatureInfoModeActivation={(activated) =>
              setFeatureInfoModeActivation(activated, setX, currentZoom, state, history, config)
            }
            featureInfoValue={state.currentFeatureInfoValue}
            showModalMenu={showModalMenu}
            legendObject={config.velocityLegend}
            header="Maximale Fließgeschwindigkeit"
            featureValueProcessor={(featureValue) => {
              if (featureValue > 6) {
                return `> 6 m/s`;
              } else if (featureValue < 0.2) {
                return `< 0,2 m/s`;
              } else {
                return `ca. ${(Math.round(featureValue * 10) / 10)
                  .toString()
                  .replace(".", ",")} m/s`;
              }
            }}
            noValueText="Klick in die Karte zur Abfrage der simulierten max. Fließgeschwindigkeit"
          />,
        ];
      } else if (
        state.displayMode === starkregenConstants.SHOW_VELOCITY &&
        state.valueMode === starkregenConstants.SHOW_TIMESERIES
      ) {
        return [
          <FeatureInfoModeBoxBaseComponent
            setFeatureInfoModeActivation={(activated) =>
              setFeatureInfoModeActivation(activated, setX, currentZoom, state, history, config)
            }
            featureInfoValue={state.currentFeatureInfoValue}
            showModalMenu={showModalMenu}
            legendObject={config.velocityLegend}
            featureValueProcessor={(featureValue) => {
              return Math.round(featureValue * 100) / 100;
            }}
            header="Maximale Fließgeschwindigkeit"
            width={"250px"}
            noValueText="Klick in die Karte zur Abfrage der simulierten Fließgeschwindigkeiten im zeitlichen Verlau"
            ytitle="Geschwindigkeit in m/s"
          />,
        ];
      }
    } else {
      return [
        <FeatureInfoModeButton
          setFeatureInfoModeActivation={(activated) =>
            setFeatureInfoModeActivation(activated, setX, currentZoom, state, history, config)
          }
          title={(() => {
            if (state.displayMode === starkregenConstants.SHOW_HEIGHTS) {
              if (state.valueMode === starkregenConstants.SHOW_MAXVALUES) {
                return "Maximalen Wasserstand abfragen";
              } else {
                return "Wasserstände im zeitlichen Verlauf abfragen";
              }
            } else if (state.displayMode === starkregenConstants.SHOW_VELOCITY) {
              if (state.valueMode === starkregenConstants.SHOW_MAXVALUES) {
                return "Maximale Fließgeschwindigkeit abfragen";
              } else {
                return "Fließgeschwindigkeit im zeitlichen Verlauf abfragen";
              }
            }
          })()}
        />,
      ];
    }
  } else {
    return [];
  }
};

export const getIntermediateImageUrl = async ({
  i,
  imageData0,
  imageData1,
  data0Weight,
  data1Weight,
}) => {
  // if (i) {
  //   console.log("getIntermediateImageUrl", i);
  // }
  const canvas = document.createElement("canvas");
  canvas.width = imageData0.width;
  canvas.height = imageData0.height;
  const idata = await getIntermediateImage({ imageData0, imageData1, data0Weight, data1Weight, i });
  const ctx = canvas.getContext("2d");
  ctx.putImageData(idata, 0, 0);

  const dataURL = canvas.toDataURL();

  return dataURL;
};

export const getIntermediateImage = async ({
  i,
  imageData0,
  imageData1,
  data0Weight,
  data1Weight,
}) => {
  // if (i) {
  //   console.log("getIntermediateImage", i);
  // }

  // console.log("getIntermediateImage{ data0, data1, data0Weight, data1Weight }", {
  //   i,
  //   imageData0,
  //   imageData1,
  //   data0Weight,
  //   data1Weight,
  // });

  const data0 = imageData0?.data;
  const data1 = imageData1?.data;
  // console.log("data0", JSON.stringify(imageData0?.data));

  // let weightedMean;
  // let red, green, blue, alpha;
  // if (data0Weight === 0) {
  //   weightedMean = data1;
  // } else if (data1Weight === 0) {
  //   weightedMean = data0;
  // } else {
  //   weightedMean = new Uint8ClampedArray(data0.length);
  //   for (let i = 0; i < data0.length; i += 4) {
  //     if (data0[i + 3] === 0) {
  //       red = 255 * data0Weight + data1[i] * data1Weight;
  //       green = 255 * data0Weight + data1[i + 1] * data1Weight;
  //       blue = 255 * data0Weight + data1[i + 2] * data1Weight;
  //     } else if (data1[i + 3] === 0) {
  //       red = data0[i] * data0Weight + 255 * data1Weight;
  //       green = data0[i + 1] * data0Weight + 255 * data1Weight;
  //       blue = data0[i + 2] * data0Weight + 255 * data1Weight;
  //     } else {
  //       red = data0[i] * data0Weight + data1[i] * data1Weight;
  //       green = data0[i + 1] * data0Weight + data1[i + 1] * data1Weight;
  //       blue = data0[i + 2] * data0Weight + data1[i + 2] * data1Weight;
  //     }

  //     alpha = data0[i + 3] * data0Weight + data1[i + 3] * data1Weight;

  //     weightedMean[i] = red;
  //     weightedMean[i + 1] = green;
  //     weightedMean[i + 2] = blue;
  //     weightedMean[i + 3] = alpha;
  //   }
  // }

  let weightedMean = await worker.getWeightedMean(data0, data1, data0Weight, data1Weight);

  // console.log("weightedMean", weightedMean);

  const idata = new ImageData(weightedMean, imageData0.width, imageData0.height);
  return idata;
};

export const getMapUrl = (conf, bounds, size) => {
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  const url =
    conf.url +
    "&request=GetMap" +
    "&bbox=" +
    sw.lng +
    "," +
    sw.lat +
    "," +
    ne.lng +
    "," +
    ne.lat +
    "&width=" +
    size.x +
    "&height=" +
    size.y +
    "&layers=" +
    conf.layers +
    "&styles=" +
    conf.styles +
    "&format=" +
    conf.format +
    "&transparent=" +
    conf.transparent +
    "&version=" +
    conf.version;

  return url;
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const _getImageDataFromUrl = async (url, width, height) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const img = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const dataURL = canvas.toDataURL();
  return dataURL;

  // const idata = ctx.getImageData(0, 0, img.width, img.height);
  // return idata;
};

function asyncImageLoader(url, now, refreshTSRef) {
  return new Promise((resolve, reject) => {
    var image = new Image();
    image.src = url;
    image.crossOrigin = "Anonymous";
    const aborter = setInterval(() => {
      if (now !== refreshTSRef.current) {
        image.src = null;
        clearInterval(aborter);
        resolve(undefined);
      }
    }, 10);
    image.onload = () => {
      clearInterval(aborter);
      resolve(image);
    };
    image.onerror = () => {
      clearInterval(aborter);
      reject(new Error("could not load image"));
    };
  });
}

export const getImageDataFromUrl = async (url, width, height, now, refreshTSRef) => {
  const img = await asyncImageLoader(url, now, refreshTSRef);
  if (now !== refreshTSRef.current) return;
  // const response = await fetch(url);
  // const blob = await response.blob();
  // const img = await createImageBitmap(blob);
  // const imageObjectURL = URL.createObjectURL(blob);
  // console.log("imageObjectURL", imageObjectURL);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (now !== refreshTSRef.current) return;
  ctx.drawImage(img, 0, 0);
  if (now !== refreshTSRef.current) return;
  const dataURL = canvas.toDataURL();
  if (now !== refreshTSRef.current) return;
  return dataURL;

  // const idata = ctx.getImageData(0, 0, img.width, img.height);
  // return idata;
  // if you want to use this function, you need to add the following to your html:
  //   <ImageDataLayer
  //
  //   key={"datadrivenLayer. + activeTimeSeriesPoint1"}
  //   // url={loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[layerIndex1]]}
  //   data={loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[layerIndex1]]}
  //   bounds={mapBounds}
  //   opacity={opacity1}
  // />
};

export const opacityCalculator = (value, layerindex, intermediateValuesCount) => {
  const sub = layerindex * intermediateValuesCount;
  let ret = 0;
  const result = (value - sub) / intermediateValuesCount;
  if (result < 0) {
    ret = 0;
  } else if (result <= 1) {
    ret = result;
    // console.log("right opacity", ret, "*", spline.at(ret), "=", ret * spline.at(ret));
  } else if (result <= 2) {
    ret = 1 - (result - 1);
    // console.log("left opacity", ret, "*", spline.at(ret), "=", ret * spline.at(ret));
  } else {
    ret = 0;
  }

  return ret * spline.at(ret);
};

export const getTsMeta = (state, config) => {
  let timeSeriesWMSLayers, timeSeriesLayerDescriptions;
  if (state.displayMode === starkregenConstants.SHOW_HEIGHTS) {
    timeSeriesWMSLayers = config.simulations[state.selectedSimulation].depthTimeDimensionLayers;
    timeSeriesLayerDescriptions =
      config.simulations[state.selectedSimulation].depthTimeDimensionLayerDescriptions;
  } else {
    timeSeriesWMSLayers = config.simulations[state.selectedSimulation].velocityTimeDimensionLayers;
    timeSeriesLayerDescriptions =
      config.simulations[state.selectedSimulation].velocityTimeDimensionLayerDescriptions;
  }
  return { timeSeriesWMSLayers, timeSeriesLayerDescriptions };
};
