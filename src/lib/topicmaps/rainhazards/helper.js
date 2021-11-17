import React from "react";
import { proj4crs3857def } from "../../constants/gis";
import proj4 from "proj4";
import { starkregenConstants } from "./constants";
import queryString from "query-string";
import { modifyQueryPart } from "../../tools/routingHelper";
import FeatureInfoModeBoxForHeights from "./components/FeatureInfoModeBoxForHeights";
import FeatureInfoModeBoxForVelocityAndDirection from "./components/FeatureInfoModeBoxForVelocityAndDirection";
import FeatureInfoModeButton from "./components/FeatureInfoModeButton";
export const getRoundedValueStringForValue = (featureValue) => {
  if (featureValue > 1.5) {
    return `> 150 cm`;
  } else if (featureValue < 0.1) {
    return `< 10 cm`;
  } else {
    return `ca. ${Math.round(featureValue * 10.0) * 10.0} cm`;
  }
};

export const getFeatureInfoRequest = (mapEvent, state, setX, config) => {
  let pos;
  if (!mapEvent) {
    if (
      state.currentFeatureInfoPosition &&
      state.currentFeatureInfoSelectedSimulation !== state.selectedSimulation
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
  if (state.displayMode === starkregenConstants.SHOW_HEIGHTS) {
    const minimalBoxSize = 0.0001;
    const selectedSimulation = config.simulations[state.selectedSimulation].depthLayer;
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
      `layers=${selectedSimulation}&` +
      `QUERY_LAYERS=${selectedSimulation}&` +
      `INFO_FORMAT=application/vnd.ogc.gml`;
    let valueKey = "starkregen:depth";
    if (/Edge/.test(navigator.userAgent)) {
      valueKey = "value";
    }
    fetch(getFetureInfoRequestUrl)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Server response wasn't OK");
        }
      })
      .then((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const value = parseFloat(xmlDoc.getElementsByTagName(valueKey)[0].textContent, 10);

        setX.setCurrentFeatureInfoSelectedSimulation(state.selectedSimulation);
        setX.setCurrentFeatureInfoValue(value);
        setX.setCurrentFeatureInfoPosition(pos);
      })
      .catch((error) => {
        console.log("error during fetch", error);
      });
  } else {
    const minimalBoxSize = 0.0001;
    const selectedSimulation = config.simulations[state.selectedSimulation].velocityLayer;

    const getFetureInfoRequestUrl =
      config.modelWMS +
      `&VERSION=1.1.1&REQUEST=GetFeatureInfo&` +
      `format=image%2Fpng&transparenttrue&` +
      `version=1.1.1&tiled=true&` +
      `width=1&height=1&srs=EPSG%3A3857&` +
      `bbox=` +
      `${pos[0] - minimalBoxSize},` +
      `${pos[1] - minimalBoxSize},` +
      `${pos[0] + minimalBoxSize},` +
      `${pos[1] + minimalBoxSize}&` +
      `x=0&y=0&` +
      `layers=${selectedSimulation}&` +
      `QUERY_LAYERS=${selectedSimulation}&` +
      `INFO_FORMAT=application/vnd.ogc.gml`;

    let valueKey = "starkregen:velocity";
    if (/Edge/.test(navigator.userAgent)) {
      valueKey = "value";
    }

    fetch(getFetureInfoRequestUrl)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Server response wasn't OK");
        }
      })
      .then((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const value = parseFloat(xmlDoc.getElementsByTagName(valueKey)[0].textContent, 10);
        setX.setCurrentFeatureInfoSelectedSimulation(state.selectedSimulation);
        setX.setCurrentFeatureInfoValue(value);
        setX.setCurrentFeatureInfoPosition(pos);
      })
      .catch((error) => {
        console.log("error during fetch", error);
      });
  }
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
  setX.setFeatureInfoModeActivated(activated);
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
      if (state.displayMode === starkregenConstants.SHOW_HEIGHTS) {
        return [
          <FeatureInfoModeBoxForHeights
            setFeatureInfoModeActivation={(activated) =>
              setFeatureInfoModeActivation(activated, setX, currentZoom, state, history, config)
            }
            featureInfoValue={state.currentFeatureInfoValue}
            showModalMenu={showModalMenu}
            legendObject={config.heightsLegend}
          />,
        ];
      } else {
        return [
          <FeatureInfoModeBoxForVelocityAndDirection
            setFeatureInfoModeActivation={(activated) =>
              setFeatureInfoModeActivation(activated, setX, currentZoom, state, history, config)
            }
            featureInfoValue={state.currentFeatureInfoValue}
            showModalMenu={showModalMenu}
            legendObject={config.velocityLegend}
          />,
        ];
      }
    } else {
      return [
        <FeatureInfoModeButton
          setFeatureInfoModeActivation={(activated) =>
            setFeatureInfoModeActivation(activated, setX, currentZoom, state, history, config)
          }
          title={
            state.displayMode === starkregenConstants.SHOW_HEIGHTS
              ? "Maximalen Wasserstand abfragen"
              : "Maximale Fließgeschwindigkeit abfragen"
          }
        />,
      ];
    }
  } else {
    return [];
  }
};

export const getIntermediateImageUrl = ({ imageData0, imageData1, data0Weight, data1Weight }) => {
  // console.log("getIntermediateImageUrl{ data0, data1, data0Weight, data1Weight }", {
  //   imageData0,
  //   imageData1,
  //   data0Weight,
  //   data1Weight,
  // });

  const data0 = imageData0.data;
  const data1 = imageData1.data;

  const weightedMean = new Uint8ClampedArray(data0.length);
  let red, green, blue, alpha;
  const canvas = document.createElement("canvas");
  for (let i = 0; i < data0.length; i += 4) {
    if (data0[i + 3] === 0) {
      red = 255 * data0Weight + data1[i] * data1Weight;
      green = 255 * data0Weight + data1[i + 1] * data1Weight;
      blue = 255 * data0Weight + data1[i + 2] * data1Weight;
    } else if (data1[i + 3] === 0) {
      red = data0[i] * data0Weight + 255 * data1Weight;
      green = data0[i + 1] * data0Weight + 255 * data1Weight;
      blue = data0[i + 2] * data0Weight + 255 * data1Weight;
    } else {
      red = data0[i] * data0Weight + data1[i] * data1Weight;
      green = data0[i + 1] * data0Weight + data1[i + 1] * data1Weight;
      blue = data0[i + 2] * data0Weight + data1[i + 2] * data1Weight;
    }

    alpha = data0[i + 3] * data0Weight + data1[i + 3] * data1Weight;

    weightedMean[i] = red;
    weightedMean[i + 1] = green;
    weightedMean[i + 2] = blue;
    weightedMean[i + 3] = alpha;
  }
  // console.log("weightedMean", weightedMean);

  const idata = new ImageData(weightedMean, imageData0.width, imageData0.height);
  const ctx = canvas.getContext("2d");
  ctx.putImageData(idata, 0, 0);

  const dataURL = canvas.toDataURL();

  return dataURL;
};
