import React, { useContext, useEffect, useState } from "react";

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

const persistenceSettings = [
  "displayMode",
  // "featureInfoModeActivated",
  "selectedSimulation",
  "backgroundLayer",
  "selectedBackground",
  "animationEnabled",
];

function Map({
  appMenu,
  initialState,
  config,
  homeZoom,
  homeCenter,
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
    setCurrentFeatureInfoValue: set("currentFeatureInfoValue"),
    setCurrentFeatureInfoPosition: set("currentFeatureInfoPosition"),
    setFeatureInfoModeActivated: set("featureInfoModeActivated"),
    setCurrentFeatureInfoSelectedSimulation: set("currentFeatureInfoSelectedSimulation"),
  };

  //effects

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
    checkUrlAndSetStateAccordingly(state, setX, history);
  }, []);

  //check for changes in url and set appMode accordingly
  useEffect(() => {
    history.listen((location) => {
      checkUrlAndSetStateAccordingly(state, setX, history);
    });
  }, [history]);

  let cursor;
  if (state.featureInfoModeActivated) {
    cursor = "crosshair";
  } else {
    cursor = "grabbing";
  }

  if (state) {
    //development purpose cannot happen on a normal instance

    if (state.selectedSimulation > config.simulations.length - 1) {
      setX.setSelectedSimulation(0);
      return;
    }
    return (
      <div>
        <ModeSwitcher titleString={modeSwitcherTitle} displayMode={state.displayMode} />
        <TopicMapComponent
          key={"TM"}
          locatorControl={true}
          gazData={gazData}
          attributionControl={true}
          gazetteerSearchPlaceholder="Adresssuche"
          maxZoom={22}
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
              animationEnabled={state.animationEnabled && currentZoom >= config.minAnimationZoom}
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
          {state.displayMode === starkregenConstants.SHOW_HEIGHTS && (
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
          {state.displayMode === starkregenConstants.SHOW_VELOCITY && (
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
          {state.displayMode === starkregenConstants.SHOW_VELOCITY &&
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
          {state.animationEnabled && (
            <Animation
              key={JSON.stringify(state)}
              rasterfariURL={config.rasterfariURL}
              minAnimationZoom={config.minAnimationZoom}
              layerPrefix={config.simulations[state.selectedSimulation].animation}
            />
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
