import React from "react";
import { useImmer } from "use-immer";
import FeatureCollectionContextProvider from "./FeatureCollectionContextProvider";
import ResponsiveTopicMapContextProvider from "./ResponsiveTopicMapContextProvider";
import TopicMapStylingContextProvider from "./TopicMapStylingContextProvider";
import LightBoxContextProvider from "./LightBoxContextProvider";

import UIContextProvider from "./UIContextProvider";
import proj4 from "proj4";
import { proj4crs25832def } from "../constants/gis";
import { createBrowserHistory, createHashHistory } from "history";
import localforage from "localforage";

const defaultState = {
  location: undefined,
  boundingBox: undefined,
  routedMapRef: undefined,
};

const StateContext = React.createContext();
const DispatchContext = React.createContext();
const history = createHashHistory();

const TopicMapContextProvider = ({
  children,
  featureCollectionEnabled = true,
  lightBoxEnabled = true,
  responsiveContextEnabled = true,
  stylingContextEnabled = true,
  uiContextEnabled = true,
  getFeatureStyler,
  getColorFromProperties,
  clusteringEnabled = true,
  clusteringOptions,
  getSymbolSVG,
  featureItemsURL,
  convertItemToFeature,
  featureCollectionName,
  itemFilterFunction,
  filterFunction,
  additionalLayerConfiguration,
  appKey = "TopicMapBaseLibrary",
  persistenceSettings = {
    ui: ["appMenuVisible", "appMenuActiveMenuSection"],
    featureCollection: ["filterState", "filterMode", "clusteringEnabled"],
    responsive: [],
    styling: [
      "activeAdditionalLayerKeys",
      "namedMapStyle",
      "selectedBackground",
      "markerSymbolSize",
    ],
  },
}) => {
  const [state, dispatch] = useImmer({ ...defaultState, history });
  const contextKey = "topicmap";
  const set = (prop, noTest) => {
    return (x) => {
      dispatch((state) => {
        if (noTest === true || JSON.stringify(state[prop]) !== JSON.stringify(x)) {
          if (persistenceSettings[contextKey]?.includes(prop)) {
            localforage.setItem("@" + appKey + "." + contextKey + "." + prop, x);
          }
          state[prop] = x;
        }
      });
    };
  };

  const convenienceFunctions = {
    setBoundingBox: set("boundingBox"),
    setLocation: set("location"),
    setRoutedMapRef: set("routedMapRef", true),
  };
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider
        value={{
          dispatch,
          ...convenienceFunctions,
          zoomToFeature: (feature) => {
            if (state.routedMapRef !== undefined) {
              const pos = proj4(proj4crs25832def, proj4.defs("EPSG:4326"), [
                feature.geometry.coordinates[0],
                feature.geometry.coordinates[1],
              ]);
              state.routedMapRef.leafletMap.leafletElement.setView([pos[1], pos[0]], 15);
            }
          },

          gotoHome: () => {
            if (state.routedMapRef !== undefined) {
              state.routedMapRef.leafletMap.leafletElement.setView(
                [
                  state.routedMapRef.props.fallbackPosition.lat,
                  state.routedMapRef.props.fallbackPosition.lng,
                ],
                state.routedMapRef.props.fallbackZoom
              );
            }
          },
        }}
      >
        <TopicMapStylingContextProvider
          enabled={stylingContextEnabled}
          additionalLayerConfiguration={additionalLayerConfiguration}
          appKey={appKey}
          persistenceSettings={persistenceSettings}
        >
          <FeatureCollectionContextProvider
            enabled={featureCollectionEnabled}
            getFeatureStyler={getFeatureStyler}
            getColorFromProperties={getColorFromProperties}
            clusteringEnabled={clusteringEnabled}
            clusteringOptions={clusteringOptions}
            getSymbolSVG={getSymbolSVG}
            itemsURL={featureItemsURL}
            convertItemToFeature={convertItemToFeature}
            featureCollectionName={featureCollectionName}
            itemFilterFunction={itemFilterFunction}
            filterFunction={filterFunction}
            appKey={appKey}
            persistenceSettings={persistenceSettings}
          >
            <ResponsiveTopicMapContextProvider
              enabled={responsiveContextEnabled}
              appKey={appKey}
              persistenceSettings={persistenceSettings}
            >
              <UIContextProvider
                enabled={uiContextEnabled}
                appKey={appKey}
                persistenceSettings={persistenceSettings}
              >
                <LightBoxContextProvider
                  enabled={lightBoxEnabled}
                  appKey={appKey}
                  persistenceSettings={persistenceSettings}
                >
                  {children}
                </LightBoxContextProvider>
              </UIContextProvider>
            </ResponsiveTopicMapContextProvider>
          </FeatureCollectionContextProvider>
        </TopicMapStylingContextProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default TopicMapContextProvider;

export {
  TopicMapContextProvider,
  StateContext as TopicMapContext,
  DispatchContext as TopicMapDispatchContext,
};
