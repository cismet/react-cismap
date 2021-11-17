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
  faFile,
  faFileMedical,
  faFilm,
  faPause,
  faPlay,
  faRandom,
  faTimes,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

import { Slider, Progress, Button } from "antd";
import ProgressBar from "react-bootstrap/ProgressBar";
import DataDrivenNonTiledLayer from "../../DataDrivenNonTiledLayer";

const persistenceSettings = [
  "displayMode",
  // "featureInfoModeActivated",
  "selectedSimulation",
  "backgroundLayer",
  "selectedBackground",
  "animationEnabled",
  "valueMode",
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
}) {
  const { history, appKey } = useContext(TopicMapContext);
  const { routedMapRef } = useContext(TopicMapContext);

  const { setAppMenuVisible, setAppMenuActiveMenuSection } = useContext(UIDispatchContext);

  const showModalMenu = (section) => {
    setAppMenuVisible(true);
    setAppMenuActiveMenuSection(section);
  };

  const mapRef = routedMapRef?.leafletMap?.leafletElement;
  const currentZoom = mapRef?.getZoom();

  const [state, dispatch] = useImmer({
    ...initialState,
  });
  const set = (prop, noTest) => {
    return (x) => {
      dispatch((state) => {
        if (noTest === true || JSON.stringify(state[prop]) !== JSON.stringify(x)) {
          if (persistenceSettings.includes(prop)) {
            localforage.setItem("@" + appKey + ".starkregen." + prop, x);
          }
          state[prop] = x;
        }
      });
    };
  };

  const setX = {
    setFeatureInfoModeActivation: set("featureInfoModeActivated"),
    setAnimationEnabled: set("animationEnabled"),
    setBackgroundIndex: set("selectedBackground"),
    setSelectedSimulation: set("selectedSimulation"),
    setDisplayMode: set("displayMode"),
    setValueMode: set("valueMode"),
    setCurrentFeatureInfoValue: set("currentFeatureInfoValue"),
    setCurrentFeatureInfoPosition: set("currentFeatureInfoPosition"),
    setFeatureInfoModeActivated: set("featureInfoModeActivated"),
    setCurrentFeatureInfoSelectedSimulation: set("currentFeatureInfoSelectedSimulation"),
  };

  const [loadingTimeSeriesLayers, setLoadingTimeSeriesLayers] = useState(new Set());
  const [autoplay, setAutoplay] = useState(false);
  const [numberOfLoadedTimeSeriesLayers, setNumberOfLoadedTimeSeriesLayers] = useState(0);
  const [loadedTimeSeriesLayerImageData, setLoadedTimeSeriesLayerImageData] = useState({});
  const numberOfloadedTimeSeriesLayersRef = useRef();

  const resetTimeSeriesStates = () => {
    setLoadingTimeSeriesLayers(new Set());
    setNumberOfLoadedTimeSeriesLayers(0);
  };

  useEffect(() => {
    numberOfloadedTimeSeriesLayersRef.current = numberOfLoadedTimeSeriesLayers;
  }, [numberOfLoadedTimeSeriesLayers]);

  const layerLoadingStarted = (e) => {
    setLoadingTimeSeriesLayers((old) => {
      old.add(e.target.wmsParams.layers);
      setNumberOfLoadedTimeSeriesLayers(timeSeriesWMSLayers.length - old.size);
      return old;
    });
    setLoadedTimeSeriesLayerImageData((old) => {
      delete old[e.target.wmsParams.layers];
      return old;
    });
  };
  const layerLoaded = (e) => {
    // console.log("layer loaded", e.target.wmsParams.layers); //, e.canvas);
    setLoadingTimeSeriesLayers((old) => {
      // console.log("layer loaded set ", old);
      // console.log("layer loaded", e.target.wmsParams.layers);
      old.delete(e.target.wmsParams.layers);
      // console.log("old", old);
      setNumberOfLoadedTimeSeriesLayers(timeSeriesWMSLayers.length - old.size);
      return old;
    });

    const canvas = e.canvas;
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    e.canvas = null;

    setLoadedTimeSeriesLayerImageData((old) => {
      return {
        ...old,
        [e.target.wmsParams.layers]: data,
      };
    });
  };

  const errorDuringLayerLoading = (e) => {
    console.log("layer onerror", e.target.wmsParams.layers);
    setLoadingTimeSeriesLayers((old) => {
      old.delete(e.target.wmsParams.layers);
      setNumberOfLoadedTimeSeriesLayers(timeSeriesWMSLayers.length - old.size);
      return old;
    });
  };

  useEffect(() => {
    if (persistenceSettings) {
      for (const prop of persistenceSettings) {
        const localforagekey = "@" + appKey + ".starkregen." + prop;
        const setter = set(prop, true);
        setFromLocalforage(localforagekey, setter);
      }
    }
  }, []); //[set]);

  useEffect(() => {
    if (mapRef && mapRef.attributionControl) {
      mapRef.attributionControl.setPrefix("");
    }
  }, [mapRef]);

  useEffect(() => {
    document.title = documentTitle;
    checkUrlAndSetStateAccordingly(state, setX, history, resetTimeSeriesStates);
  }, []);

  //check for changes in url and set appMode accordingly
  useEffect(() => {
    history.listen((location) => {
      checkUrlAndSetStateAccordingly(state, setX, history, resetTimeSeriesStates);
    });
  }, [history]);

  let cursor;
  if (state.featureInfoModeActivated) {
    cursor = "crosshair";
  } else {
    cursor = "grabbing";
  }

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

  const intermediateValuesCount = 25;
  const maxValue = timeSeriesWMSLayers.length * intermediateValuesCount;
  const frames = 500 / intermediateValuesCount;
  const [autoplayUpdater, setAutoplayUpdater] = useState();
  const [activeTimeSeriesPoint, setActiveTimeSeriesPoint] = useState(1 * intermediateValuesCount);

  const setNextPoint = async () => {
    return new Promise((resolve) => {
      setActiveTimeSeriesPoint((oldPoint) => {
        // console.log("loadedTimeSeriesLayers", numberOfLoadedTimeSeriesLayers);

        if (numberOfloadedTimeSeriesLayersRef.current === timeSeriesWMSLayers.length) {
          const newPoint = oldPoint + 1;
          if (newPoint <= maxValue) {
            // console.log("done", new Date().getTime());

            return newPoint;
          } else {
            // console.log("done", new Date().getTime());
            return 0;
          }
        } else {
          // console.log("done", new Date().getTime());
          return oldPoint;
        }
      });
    });
  };

  useEffect(() => {
    if (autoplay) {
      if (!autoplayUpdater) {
        console.log("setInterval", setInterval);

        const updater = setInterval(() => {
          (async () => {
            setNextPoint();
          })();
        }, frames);
        setAutoplayUpdater(updater);
      }
    } else {
      clearInterval(autoplayUpdater);
      setAutoplayUpdater(undefined);
    }
  }, [autoplay, autoplayUpdater, timeSeriesWMSLayers.length]);

  if (state) {
    //development purpose cannot happen on a normal instance

    if (state.selectedSimulation > config.simulations.length - 1) {
      setX.setSelectedSimulation(0);
      return;
    }

    const bounds = mapRef?.getBounds();

    // console.log('loadedTimeSeriesLayerImageData[
    //   timeSeriesWMSLayers[
    //     Math.round(activeTimeSeriesPoint - intermediateValuesCount / 2) *
    //       intermediateValuesCount
    //   ]
    // ]',loadedTimeSeriesLayerImageData[
    //   timeSeriesWMSLayers[
    //     Math.round(activeTimeSeriesPoint - intermediateValuesCount / 2) *
    //       intermediateValuesCount
    //   ]
    // ]);

    const layerIndex0 = Math.round(
      (activeTimeSeriesPoint - intermediateValuesCount / 2) / intermediateValuesCount
    );
    const layerIndex1 =
      Math.round((activeTimeSeriesPoint - intermediateValuesCount / 2) / intermediateValuesCount) +
      1;

    const marks = {};
    for (let i = 0; i < timeSeriesWMSLayers.length; i++) {
      marks[i * intermediateValuesCount] = "";
    }
    return (
      <div>
        <ModeSwitcher
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
                <div style={{ display: "flex", width: "90%" }}>
                  {/* <Button>
                    <FontAwesomeIcon icon={faPlay} />
                  </Button> */}
                  <span style={{ marginRight: 10, alignSelf: "center" }}>
                    {/* {timeSeriesLayerDescriptions[activeTimeSeriesPoint]} */}
                  </span>
                  <Slider
                    marks={marks}
                    style={{ flex: "1 0 auto" }}
                    disabled={numberOfLoadedTimeSeriesLayers !== timeSeriesWMSLayers.length}
                    min={0}
                    max={(timeSeriesWMSLayers.length - 1) * intermediateValuesCount}
                    value={activeTimeSeriesPoint}
                    tipFormatter={null}
                    onChange={(value) => {
                      // console.log("value", value);

                      setActiveTimeSeriesPoint(parseInt(value));
                    }}
                    onAfterChange={(value) => {
                      console.log("value", value);
                      const snapped =
                        Math.round(value / intermediateValuesCount) * intermediateValuesCount;
                      console.log("snapped", snapped);
                      setActiveTimeSeriesPoint(parseInt(snapped));
                    }}
                  />
                  <Button
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      setAutoplay((oldValue) => {
                        return !oldValue;
                      });
                    }}
                  >
                    {!autoplay && <FontAwesomeIcon icon={faPlay} />}
                    {autoplay && <FontAwesomeIcon icon={faPause} />}
                  </Button>
                </div>
                <span style={{ float: "right", paddingRight: 10 }}></span>
              </div>
              <div
                key={"numberOfLoadedTimeSeriesLayersPB" + numberOfLoadedTimeSeriesLayers}
                style={{ marginTop: 5 }}
              >
                {/* <Progress
                  percent={(loadedLayers / timeSeriesLayers.length) * 100}
                  showInfo={false}
                  strokeWidth={2}
                /> */}
                {numberOfLoadedTimeSeriesLayers !== timeSeriesWMSLayers.length && (
                  <ProgressBar
                    style={{ height: 2 }}
                    now={(numberOfLoadedTimeSeriesLayers / timeSeriesWMSLayers.length) * 100}
                    strokeWidth={2}
                  />
                )}

                {/* {loadedLayers}
                <br />
                {timeSeriesLayers.length}
                <br />
                {(loadedLayers / timeSeriesLayers.length) * 100} */}
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
                  ? createGetFeatureInfoControls(
                      state,
                      setX,
                      currentZoom,
                      history,
                      showModalMenu,
                      config
                    )
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
            bounds &&
            activeTimeSeriesPoint % intermediateValuesCount !== 0 &&
            loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[layerIndex0]] &&
            loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[layerIndex1]] && (
              <DataDrivenNonTiledLayer
                key={"datadrivenLayer." + activeTimeSeriesPoint}
                data0={loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[layerIndex0]]}
                data1={loadedTimeSeriesLayerImageData[timeSeriesWMSLayers[layerIndex1]]}
                data0Weight={
                  1 -
                  (activeTimeSeriesPoint - layerIndex0 * intermediateValuesCount) /
                    intermediateValuesCount
                }
                data1Weight={
                  1 -
                  (layerIndex1 * intermediateValuesCount - activeTimeSeriesPoint) /
                    intermediateValuesCount
                }
                bounds={bounds}
                opacity={activeTimeSeriesPoint % intermediateValuesCount !== 0 ? 0.8 : 0}
              />
            )}
          {state.valueMode === starkregenConstants.SHOW_TIMESERIES &&
            timeSeriesWMSLayers.map((layerName, index) => {
              return (
                <NonTiledWMSLayer
                  key={"timeserieslayer" + index + state.displayMode}
                  {...{
                    type: "wms",
                    url: "https://starkregen-paderborn.cismet.de/geoserver/wms?SERVICE=WMS",
                    layers: layerName,
                    styles:
                      state.displayMode === starkregenConstants.SHOW_HEIGHTS
                        ? "starkregen:depth-blue"
                        : "starkregen:velocity",
                    __zIndex: 10000000,
                    minZoom: 0,
                    maxZoom: 100,
                    opacity: index * intermediateValuesCount === activeTimeSeriesPoint ? 0.8 : 0,
                    transparent: "true",
                    crossOrigin: "anonymous",
                    format: "image/png",
                    version: "1.1.1",

                    onload: layerLoaded,
                    onloading: layerLoadingStarted,
                    onerror: errorDuringLayerLoading,
                  }}
                />
              );
            })}

          <ContactButton emailaddress={emailaddress} />
        </TopicMapComponent>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Map;
