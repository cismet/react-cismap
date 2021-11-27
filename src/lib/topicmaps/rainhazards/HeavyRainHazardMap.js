import React, { useContext, useEffect, useRef, useState } from "react";

import localforage from "localforage";
import { setFromLocalforage } from "../../contexts/_helper";
import { TopicMapContext } from "../../contexts/TopicMapContextProvider";
import { UIDispatchContext } from "../../contexts/UIContextProvider";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import { md5FetchJSON } from "../../tools/fetching";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import { useImmer } from "use-immer";

import Animation from "./components/Animation";
import InfoBox from "./components/ControlInfoBox";

import { starkregenConstants } from "./constants";
import {
  checkUrlAndSetStateAccordingly,
  createGetFeatureInfoControls,
  getFeatureInfoRequest,
  getIntermediateImageUrl,
  setAnimationEnabled,
  setBackgroundIndex,
  getMapUrl,
  getImageDataFromUrl,
  getIntermediateImage,
  opacityCalculator,
  getTsMeta,
} from "./helper";
import ModeSwitcher from "./components/ModeSwitcher";
import FeatureInfoLLayerVis from "./components/FeatureInfoLayerVisualization";
import ContactButton from "./components/ContactButton";

import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "../../topicMaps.css";
import NonTiledWMSLayer from "../../NonTiledWMSLayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faCircleNotch,
  faFile,
  faFileMedical,
  faFilm,
  faPause,
  faPlay,
  faRandom,
  faSpider,
  faSpinner,
  faTimes,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import { Slider, Button } from "antd";
import ProgressBar from "react-bootstrap/ProgressBar";

import rainHazardWorker from "workerize-loader!./rainHazardWorker"; // eslint-disable-line import/no-webpack-loader-syntax
import { ImageOverlay } from "react-leaflet";
import { convertLength } from "@turf/helpers";

const persistenceSettings = [
  "displayMode",
  // "featureInfoModeActivated",
  "selectedSimulation",
  "backgroundLayer",
  "selectedBackground",
  "animationEnabled",
  "valueMode",
  "featureInfoModeActivated",
];

function Map({
  appMenu,
  initialState,
  config,
  homeZoom,
  homeCenter,
  minZoom,
  modeSwitcherTitle,
  gazData = [],
  documentTitle,
  emailaddress,
  customFeatureInfoUIs,
}) {
  const { history, appKey } = useContext(TopicMapContext);
  const { routedMapRef } = useContext(TopicMapContext);
  const { setAppMenuVisible, setAppMenuActiveMenuSection } = useContext(UIDispatchContext);
  const mapRef = routedMapRef?.leafletMap?.leafletElement;
  const currentZoom = mapRef?.getZoom();

  const [mapSize, setMapSize] = useState();
  const [mapBounds, setMapBounds] = useState();
  const mapBoundsRef = useRef();
  useEffect(() => {
    mapBoundsRef.current = mapBounds;
  }, [mapBounds]);

  useEffect(() => {
    setMapSize((old) => {
      if (JSON.stringify(old) !== JSON.stringify(mapRef?.getSize())) {
        old = mapRef?.getSize();
      }
      return old;
    });
    setMapBounds((old) => {
      if (JSON.stringify(old) !== JSON.stringify(mapRef?.getBounds())) {
        old = mapRef?.getBounds();
      }
      return old;
    });
  }, [mapRef?.getBounds(), mapRef?.getSize()]);

  const showModalMenu = (section) => {
    setAppMenuVisible(true);
    setAppMenuActiveMenuSection(section);
  };

  const [state, dispatch] = useImmer({
    ...initialState,
  });
  const stateRef = useRef();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const set = (prop, noTest = false, onChange = () => {}) => {
    return (x) => {
      dispatch((state) => {
        const changed = JSON.stringify(state[prop]) !== JSON.stringify(x);
        if (noTest === true || changed) {
          if (persistenceSettings.includes(prop)) {
            localforage.setItem("@" + appKey + ".starkregen." + prop, x);
          }
          state[prop] = x;

          if (changed) {
            setTimeout(() => {
              onChange();
            }, 10);
          }
        }
      });
    };
  };

  const setX = {
    setAnimationEnabled: set("animationEnabled"),
    setBackgroundIndex: set("selectedBackground"),
    //SWITCH between simulations
    setSelectedSimulation: set("selectedSimulation", false, () => {
      if (stateRef.current.featureInfoModeActivated) {
        getFeatureInfoRequest(undefined, stateRef.current, setX, config, true);
      }
    }),

    //displayMode can be SHOW_HEIGHTS or SHOW_VELOCITY
    setDisplayMode: set("displayMode", false, () => {
      setSnappedLayer(undefined);
      setLoadedTimeSeriesLayerImageData({});
      setAutoplay(false);
      if (stateRef.current.featureInfoModeActivated) {
        getFeatureInfoRequest(undefined, stateRef.current, setX, config, true);
      }
    }),
    //valueMode can be SHOW_MAXVALUES or SHOW_TIMESERIES
    setValueMode: set("valueMode", false, () => {
      if (stateRef.current.featureInfoModeActivated) {
        getFeatureInfoRequest(undefined, stateRef.current, setX, config, true);
      }
    }),
    setCurrentFeatureInfoValue: set("currentFeatureInfoValue"),
    setCurrentFeatureInfoPosition: set("currentFeatureInfoPosition"),
    setFeatureInfoModeActivation: set("featureInfoModeActivated"),
    setCurrentFeatureInfoSelectedSimulation: set("currentFeatureInfoSelectedSimulation"),
    setCurrentFeatureInfoSelectedDisplayMode: set("currentFeatureInfoSelectedDisplayMode"),
    setCurrentFeatureInfoSelectedValueMode: set("currentFeatureInfoSelectedValueMode"),
  };

  //Startup
  useEffect(() => {
    if (persistenceSettings) {
      for (const prop of persistenceSettings) {
        const localforagekey = "@" + appKey + ".starkregen." + prop;
        const setter = set(prop, true);
        setFromLocalforage(localforagekey, setter);
      }
    }
    document.title = documentTitle;
    checkUrlAndSetStateAccordingly(state, setX, history, resetTimeSeriesStates);
    setFromLocalforage(
      "@" + appKey + ".starkregen.activeTimeSeriesPoint",
      setActiveTimeSeriesPoint
    );
  }, []);

  let { timeSeriesWMSLayers, timeSeriesLayerDescriptions } = getTsMeta(state, config);

  const [refreshTS, setRefreshTS] = useState();
  const refreshTSRef = useRef(undefined);
  useEffect(() => {
    refreshTSRef.current = refreshTS;
  }, [refreshTS]);

  const [autoplay, setAutoplay] = useState(false);
  const [loadedTimeSeriesLayerImageData, setLoadedTimeSeriesLayerImageData] = useState({});
  const loadedTimeSeriesLayerImageDataRef = useRef();
  const [
    numberOfLoadedTimeSeriesLayerImageData,
    setNumberOfLoadedTimeSeriesLayerImageData,
  ] = useState(0);
  useEffect(() => {
    loadedTimeSeriesLayerImageDataRef.current = loadedTimeSeriesLayerImageData;
    const count = Object.keys(loadedTimeSeriesLayerImageData).length;
    setNumberOfLoadedTimeSeriesLayerImageData(count);
    if (count === timeSeriesWMSLayers.length) {
      //lastlayer loaded
      //snap to a layer to fill the snapped layer state
      snapValue(activeTimeSeriesPointRef.current);
    }
  }, [loadedTimeSeriesLayerImageData]);
  const [snappedLayer, setSnappedLayer] = useState();

  const resetTimeSeriesStates = () => {
    //not needed atm
  };
  const [blockLoading, setBlockLoading] = useState(false);

  let timeoutHandler;

  useEffect(() => {
    if (mapRef) {
      if (mapRef.attributionControl) {
        mapRef.attributionControl.setPrefix("");
      }
      mapRef.on("movestart", () => {
        setBlockLoading(true);
        setAutoplay(false);
      });
      mapRef.on("moveend", () => {
        setBlockLoading(true);
        window.clearTimeout(timeoutHandler);
        timeoutHandler = window.setTimeout(() => {
          setBlockLoading(false);
        }, 500);
      });
      mapRef.on("zoomstart", () => {
        setBlockLoading(true);
        setAutoplay(false);
      });
      mapRef.on("zoomend", () => {
        setBlockLoading(true);
        window.clearTimeout(timeoutHandler);
        timeoutHandler = window.setTimeout(() => {
          setBlockLoading(false);
        }, 500);
      });
    }
  }, [mapRef]);

  //check for changes in url and set appMode accordingly
  useEffect(() => {
    history.listen((location) => {
      checkUrlAndSetStateAccordingly(state, setX, history, resetTimeSeriesStates);
    });
  }, [history]);

  const setSnappedLayerByIndex = (index) => {
    const snappedLayer = {
      mapBounds: mapBoundsRef?.current,
      snappedTimeSeriesPoint: index * intermediateValuesCount,
      snappedIndex: index,
      layerkey: timeSeriesWMSLayers[index],
      layervalue: loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[index]],
      snappedDisplayMode: state.displayMode,
    };
    setSnappedLayer(snappedLayer);
  };

  const snapValue = (value) => {
    const snappedIndex = Math.round(value / intermediateValuesCount);
    const snapped = snappedIndex * intermediateValuesCount;
    setActiveTimeSeriesPoint(parseInt(snapped));
    setSnappedLayerByIndex(snappedIndex);
  };

  let cursor;
  if (state.featureInfoModeActivated) {
    cursor = "crosshair";
  } else {
    cursor = "grabbing";
  }

  const initialLayerIndex =
    state?.timeseriesInitialIndex !== undefined ? state?.timeseriesInitialIndex : 2;
  const intermediateValuesCount = state?.timeseriesIntermediateValuesCount || 20;

  const maxValue =
    (config.simulations[state.selectedSimulation].depthTimeDimensionLayers.length - 1) *
    intermediateValuesCount;
  const frames = state?.timeseriesAninationNumerator || 20 / intermediateValuesCount;

  const [autoplayUpdater, setAutoplayUpdater] = useState();
  const [activeTimeSeriesPoint, setActiveTimeSeriesPoint] = useState(
    initialLayerIndex * intermediateValuesCount
  );

  const activeTimeSeriesPointRef = useRef();
  const [tsLayerProps, setTsLayerProps] = useState({});

  useEffect(() => {
    activeTimeSeriesPointRef.current = activeTimeSeriesPoint;
    const layerIndex0 = Math.round(
      (activeTimeSeriesPoint - intermediateValuesCount / 2) / intermediateValuesCount
    );
    const layerIndex1 =
      Math.round((activeTimeSeriesPoint - intermediateValuesCount / 2) / intermediateValuesCount) +
      1;

    const opacity0 = opacityCalculator(
      activeTimeSeriesPoint,
      layerIndex0 - 1,
      intermediateValuesCount
    );
    const opacity1 = opacityCalculator(
      activeTimeSeriesPoint,
      layerIndex1 - 1,
      intermediateValuesCount
    );

    setTsLayerProps({
      layerIndex0: layerIndex0,
      layerIndex1: layerIndex1,
      opacity0: opacity0,
      opacity1: opacity1,
    });

    (async () => {
      localforage.setItem(
        "@" + appKey + ".starkregen.activeTimeSeriesPoint",
        activeTimeSeriesPoint
      );
    })();
  }, [activeTimeSeriesPoint]);

  const setNextPoint = async () => {
    await setActiveTimeSeriesPoint((oldPoint) => {
      const loadedTSCount = Object.keys(loadedTimeSeriesLayerImageDataRef.current || { length: 0 })
        .length;
      if (loadedTSCount === timeSeriesWMSLayers.length) {
        const newPoint = oldPoint + 1;
        if (newPoint <= maxValue) {
          return newPoint;
        } else {
          return 0;
        }
      } else {
        return oldPoint;
      }
    });
  };

  // ____                      _                 _   __  __           _      _   ____                 _ _
  // |  _ \  _____      ___ __ | | ___   __ _  __| | |  \/  | ___   __| | ___| | |  _ \ ___  ___ _   _| | |_ ___
  // | | | |/ _ \ \ /\ / / '_ \| |/ _ \ / _` |/ _` | | |\/| |/ _ \ / _` |/ _ \ | | |_) / _ \/ __| | | | | __/ __|
  // | |_| | (_) \ V  V /| | | | | (_) | (_| | (_| | | |  | | (_) | (_| |  __/ | |  _ <  __/\__ \ |_| | | |_\__ \
  // |____/ \___/ \_/\_/ |_| |_|_|\___/ \__,_|\__,_| |_|  |_|\___/ \__,_|\___|_| |_| \_\___||___/\__,_|_|\__|___/
  useEffect(() => {
    if (blockLoading === false) {
      if (mapBounds && mapSize && state.valueMode === starkregenConstants.SHOW_TIMESERIES) {
        const conf = {
          url: "https://starkregen-paderborn.cismet.de/geoserver/wms?SERVICE=WMS",
          styles:
            state.displayMode === starkregenConstants.SHOW_HEIGHTS
              ? config.simulations[state.selectedSimulation].depthStyle
              : config.simulations[state.selectedSimulation].velocityStyle,
          transparent: "true",
          crossOrigin: "anonymous",
          format: "image/png",
          version: "1.1.1",
        };
        const now = new Date().getTime();
        setRefreshTS(now);
        setTimeout(() => {
          setLoadedTimeSeriesLayerImageData({});
        }, 1);

        setTimeout(() => {
          for (const layer of timeSeriesWMSLayers) {
            const wmsParams = {
              ...conf,
              layers: layer,
            };
            const url = getMapUrl(wmsParams, mapBounds, mapSize);

            setTimeout(() => {
              getImageDataFromUrl(url, mapSize.x, mapSize.y, now, refreshTSRef).then(
                (imageData) => {
                  if (now === refreshTSRef.current) {
                    setLoadedTimeSeriesLayerImageData((old) => {
                      return {
                        ...old,
                        [layer]: imageData,
                      };
                    });
                  }
                }
              );
            }, 1);
          }
        }, 10);
      }
    }
  }, [
    mapBounds,
    mapSize,
    state.valueMode === starkregenConstants.SHOW_TIMESERIES,
    state.displayMode,
    blockLoading,
  ]);

  useEffect(() => {
    if (autoplay) {
      if (!autoplayUpdater) {
        const updater = setInterval(() => {
          setNextPoint();
        }, frames);
        setAutoplayUpdater(updater);
      }
    } else {
      clearInterval(autoplayUpdater);
      setAutoplayUpdater(undefined);
      snapValue(activeTimeSeriesPointRef.current);
    }
  }, [autoplay, autoplayUpdater, timeSeriesWMSLayers?.length]);

  // layer handling for progressbar

  if (state && timeSeriesWMSLayers) {
    if (state.selectedSimulation > config.simulations.length - 1) {
      setX.setSelectedSimulation(0);
      return;
    }

    const marks = {};
    for (let i = 0; i < timeSeriesWMSLayers.length; i++) {
      marks[i * intermediateValuesCount] = "";
    }

    // console.log({
    //   layerIndex0,
    //   opacity0,
    //   layerIndex1,
    //   opacity1,
    // });

    return (
      <div>
        <ModeSwitcher
          key={"ModeSwitcher"}
          titleString={modeSwitcherTitle}
          displayMode={state.displayMode}
          valueMode={state.valueMode}
          setValueMode={setX.setValueMode}
          additionalControlsToggle={
            <a
              style={{ color: "#337ab7" }}
              className="renderAsLink"
              onClick={() => {
                if (state.valueMode === starkregenConstants.SHOW_MAXVALUES) {
                  setX.setValueMode(starkregenConstants.SHOW_TIMESERIES);
                } else {
                  setAutoplay(false);
                  setX.setValueMode(starkregenConstants.SHOW_MAXVALUES);
                }
              }}
            >
              <FontAwesomeIcon style={{ marginRight: 5 }} icon={faRandom} />{" "}
              {state.valueMode === starkregenConstants.SHOW_MAXVALUES
                ? "zeitlicher Verlauf"
                : "Maximalwerte"}
            </a>
          }
          additionalControlsShown={state.valueMode === starkregenConstants.SHOW_TIMESERIES}
          additionalControls={
            <div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <span style={{ float: "left", paddingLeft: 10 }}></span>
                <div style={{ display: "flex", width: "60%" }}>
                  {/* <Button>
                    <FontAwesomeIcon icon={faPlay} />
                  </Button> */}
                  <span style={{ marginRight: 10, alignSelf: "center" }}>
                    {(activeTimeSeriesPoint / intermediateValuesCount) % 1 <= 0.5
                      ? timeSeriesLayerDescriptions[tsLayerProps.layerIndex0]
                      : timeSeriesLayerDescriptions[tsLayerProps.layerIndex1]}
                  </span>
                  <Slider
                    _marks={marks}
                    style={{ flex: "1 0 auto" }}
                    disabled={numberOfLoadedTimeSeriesLayerImageData !== timeSeriesWMSLayers.length}
                    min={0}
                    max={(timeSeriesWMSLayers.length - 1) * intermediateValuesCount}
                    value={activeTimeSeriesPoint}
                    tipFormatter={null}
                    onChange={(value) => {
                      // console.log("value", value);
                      setTimeout(() => {
                        setActiveTimeSeriesPoint(parseInt(value));
                      }, 1);
                    }}
                    onAfterChange={(value) => {
                      snapValue(value);
                    }}
                  />
                  <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      if (numberOfLoadedTimeSeriesLayerImageData === timeSeriesWMSLayers.length) {
                        setAutoplay((oldValue) => {
                          return !oldValue;
                        });
                      }
                    }}
                  >
                    {numberOfLoadedTimeSeriesLayerImageData !== timeSeriesWMSLayers.length &&
                      !autoplay && <FontAwesomeIcon icon={faSpinner} className="fa-spin" />}
                    {numberOfLoadedTimeSeriesLayerImageData === timeSeriesWMSLayers.length &&
                      !autoplay && <FontAwesomeIcon icon={faPlay} />}
                    {numberOfLoadedTimeSeriesLayerImageData === timeSeriesWMSLayers.length &&
                      autoplay && <FontAwesomeIcon icon={faPause} />}
                  </Button>
                  <span style={{ marginRLeft: 100, alignSelf: "center" }}></span>
                </div>

                <span style={{ float: "right", paddingRight: 10 }}></span>
              </div>
              <div
                key={"loadedTSCountdiv" + numberOfLoadedTimeSeriesLayerImageData}
                style={{ marginTop: 5 }}
              >
                {numberOfLoadedTimeSeriesLayerImageData !== timeSeriesWMSLayers.length && (
                  <ProgressBar
                    key={"loadedTSCount" + numberOfLoadedTimeSeriesLayerImageData}
                    style={{ height: 2 }}
                    now={
                      (numberOfLoadedTimeSeriesLayerImageData / timeSeriesWMSLayers.length) * 100
                    }
                    strokeWidth={2}
                  />
                )}
                {/* <span
                  onClick={() => {
                    console.log(
                      "numberOfLoadedTimeSeriesLayerImageData",
                      numberOfLoadedTimeSeriesLayerImageData
                    );
                  }}
                >
                  {numberOfLoadedTimeSeriesLayerImageData}
                </span> */}
              </div>
            </div>
          }
        />
        <TopicMapComponent
          key={"TM"}
          locatorControl={true}
          gazData={gazData}
          attributionControl={true}
          gazetteerSearchPlaceholder="Adresssuche"
          maxZoom={22}
          minZoom={minZoom}
          onclick={(event) => {
            if (state.featureInfoModeActivated) {
              getFeatureInfoRequest(event, state, setX, config);
            }
          }}
          mapStyle={{ backgroundColor: "#EEEEEE", cursor }}
          infoBox={
            <InfoBox
              key={"InfoBox" + state.selectedSimulation}
              pixelwidth={370}
              selectedSimulation={state.selectedSimulation}
              legendObject={
                state.displayMode === starkregenConstants.SHOW_HEIGHTS
                  ? config.heightsLegend
                  : config.velocityLegend
              }
              featureInfoModeBlocked={config.hideMeasurements}
              featureInfoModeActivated={state.featureInfoModeActivated}
              setFeatureInfoModeActivation={setX.setFeatureInfoModeActivation}
              featureInfoValue={state.currentFeatureInfoValue}
              animationEnabled={
                state.valueMode === starkregenConstants.SHOW_MAXVALUES &&
                state.animationEnabled &&
                currentZoom >= config.minAnimationZoom
              }
              setAnimationEnabled={(enabled) =>
                setAnimationEnabled(enabled, currentZoom, state, history, setX, config)
              } //including correction of the zoomlevel
              setBackgroundIndex={(index) => setBackgroundIndex(index, history, setX)}
              simulations={config.simulations}
              setSelectedSimulation={setX.setSelectedSimulation}
              backgrounds={config.backgrounds}
              selectedBackgroundIndex={state.selectedBackground}
              secondaryInfoBoxElements={
                !config.hideMeasurements
                  ? createGetFeatureInfoControls({
                      state,
                      setX,
                      currentZoom,
                      history,
                      showModalMenu,
                      config,
                      activeTimeSeriesPoint,
                      intermediateValuesCount,
                      customFeatureInfoUIs,
                      setActiveTimeSeriesPoint,
                    })
                  : []
              }
            />
          }
          modalMenu={appMenu}
          backgroundlayers={config.backgrounds[state.selectedBackground].layerkey}
          homeZoom={homeZoom}
          homeCenter={homeCenter}
        >
          {!config.hideMeasurements && (
            <FeatureInfoLLayerVis
              upperleftX={config.upperleftX}
              upperleftY={config.upperleftY}
              pixelsize={config.pixelsize}
              currentFeatureInfoPosition={state.currentFeatureInfoPosition}
              currentFeatureInfoValue={state.currentFeatureInfoValue}
            />
          )}
          {state.displayMode === starkregenConstants.SHOW_HEIGHTS &&
            state.valueMode === starkregenConstants.SHOW_MAXVALUES && (
              <StyledWMSTileLayer
                key={
                  "rainHazardMap.depthLayer" +
                  config.simulations[state.selectedSimulation].depthLayer +
                  "." +
                  state.selectedBackground
                }
                url={config.modelWMS}
                layers={config.simulations[state.selectedSimulation].depthLayer}
                version="1.1.1"
                transparent="true"
                format="image/png"
                tiled="true"
                styles={config.simulations[state.selectedSimulation].depthStyle}
                maxZoom={22}
                opacity={0.8}
              />
            )}
          {state.displayMode === starkregenConstants.SHOW_VELOCITY &&
            state.valueMode === starkregenConstants.SHOW_MAXVALUES && (
              <StyledWMSTileLayer
                key={
                  "rainHazardMap.velocityLayer." +
                  config.simulations[state.selectedSimulation].velocityLayer +
                  "." +
                  state.selectedBackground
                }
                url={config.modelWMS}
                layers={config.simulations[state.selectedSimulation].velocityLayer}
                version="1.1.1"
                transparent="true"
                format="image/png"
                tiled="true"
                styles={config.simulations[state.selectedSimulation].velocityStyle}
                maxZoom={22}
                opacity={0.8}
                caching={false}
              />
            )}
          {state.valueMode === starkregenConstants.SHOW_MAXVALUES &&
            state.displayMode === starkregenConstants.SHOW_VELOCITY &&
            currentZoom >= 14 &&
            (state.animationEnabled === false || currentZoom < config.minAnimationZoom) && (
              <StyledWMSTileLayer
                key={
                  "rainHazardMap.directionLayer" +
                  config.simulations[state.selectedSimulation].velocityLayer +
                  "." +
                  state.selectedBackground
                }
                url={config.modelWMS}
                layers={config.simulations[state.selectedSimulation].directionsLayer}
                version="1.1.1"
                transparent="true"
                format="image/png"
                tiled="true"
                styles="starkregen:direction"
                maxZoom={22}
                opacity={0.8}
                caching={false}
              />
            )}
          {state.valueMode === starkregenConstants.SHOW_MAXVALUES && state.animationEnabled && (
            <Animation
              key={"Animation.likes.a.key.that.changes.often." + JSON.stringify(state)}
              rasterfariURL={config.rasterfariURL}
              minAnimationZoom={config.minAnimationZoom}
              layerPrefix={
                config.simulations[state.selectedSimulation].animation ||
                config.simulations[state.selectedSimulation].animationPrefix
              }
              layerPostfix={config.simulations[state.selectedSimulation].animationPostfix}
            />
          )}

          {state.valueMode === starkregenConstants.SHOW_TIMESERIES &&
            snappedLayer?.layervalue &&
            snappedLayer?.mapBounds &&
            activeTimeSeriesPoint % intermediateValuesCount === 0 &&
            activeTimeSeriesPoint === snappedLayer?.snappedTimeSeriesPoint && (
              <ImageOverlay
                // key={"datadrivenLayer." + activeTimeSeriesPoint}
                key={"snappedLayer."}
                url={snappedLayer.layervalue}
                bounds={snappedLayer.mapBounds}
                opacity={0.85}
              />
            )}

          {state.valueMode === starkregenConstants.SHOW_TIMESERIES &&
            mapBounds &&
            (activeTimeSeriesPoint % intermediateValuesCount !== 0 ||
              (activeTimeSeriesPoint % intermediateValuesCount === 0 &&
                activeTimeSeriesPoint !== snappedLayer?.snappedTimeSeriesPoint)) &&
            loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[tsLayerProps.layerIndex0]] &&
            (loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[tsLayerProps.layerIndex1]] ||
              tsLayerProps.layerIndex1 === timeSeriesWMSLayers.length) && (
              <>
                <ImageOverlay
                  // key={"datadrivenLayer." + activeTimeSeriesPoint}
                  key={"datadrivenLayer0. + activeTimeSeriesPoint0"}
                  url={
                    loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[tsLayerProps.layerIndex0]]
                  }
                  bounds={mapBounds}
                  opacity={tsLayerProps.opacity0}
                />
                {tsLayerProps.layerIndex1 < timeSeriesWMSLayers.length && (
                  <ImageOverlay
                    // key={"datadrivenLayer." + activeTimeSeriesPoint}
                    key={"datadrivenLayer1. + activeTimeSeriesPoint1"}
                    url={
                      loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[tsLayerProps.layerIndex1]]
                    }
                    bounds={mapBounds}
                    opacity={tsLayerProps.opacity1}
                  />
                )}
              </>
            )}

          <ContactButton emailaddress={emailaddress} />
        </TopicMapComponent>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Map;
