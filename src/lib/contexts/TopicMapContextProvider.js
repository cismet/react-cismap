import React from "react";
import { useImmer } from "use-immer";
import FeatureCollectionContextProvider from "./FeatureCollectionContextProvider";
import ResponsiveTopicMapContextProvider from "./ResponsiveTopicMapContextProvider";
import TopicMapStylingContextProvider from "./TopicMapStylingContextProvider";
import LightBoxContextProvider from "./LightBoxContextProvider";

import UIContextProvider from "./UIContextProvider";
import proj4 from "proj4";
import { proj4crs25832def, projectionData } from "../constants/gis";
import { createBrowserHistory, createHashHistory } from "history";
import localforage from "localforage";
import { getType } from "@turf/invariant";
import envelope from "@turf/envelope";
import { convertBBox2Bounds } from "../tools/gisHelper";
import { MappingConstants } from "..";
import { OfflineLayerCacheContextProvider } from "./OfflineLayerCacheContextProvider";

const defaultState = {
  location: undefined,
  boundingBox: undefined,
  routedMapRef: undefined,
  titleFactory: undefined,
};

const StateContext = React.createContext();
const DispatchContext = React.createContext();
const history = createHashHistory();

const TopicMapContextProvider = ({
  referenceSystem = MappingConstants.crs3857,
  referenceSystemDefinition = projectionData[3857].def,
  mapEPSGCode = "3857",
  maskingPolygon,
  children,
  featureCollectionEnabled = true,
  lightBoxEnabled = true,
  responsiveContextEnabled = true,
  stylingContextEnabled = true,
  uiContextEnabled = true,
  offlineLayerCacheContextEnabled = true,
  getFeatureStyler,
  featureTooltipFunction,
  getColorFromProperties,
  alwaysShowAllFeatures = false,
  clusteringEnabled = true,
  clusteringOptions,
  getSymbolSVG,
  featureItemsURL,
  items,
  convertItemToFeature,
  featureCollectionName,
  itemFilterFunction,
  filterFunction,
  filterState,
  classKeyFunction,
  additionalLayerConfiguration,
  baseLayerConf,
  appKey = "TopicMapBaseLibrary",
  persistenceSettings = {
    ui: ["appMenuVisible", "appMenuActiveMenuSection", "collapsedInfoBox"],
    featureCollection: ["filterState", "filterMode", "clusteringEnabled"],
    responsive: [],
    styling: [
      "activeAdditionalLayerKeys",
      "namedMapStyle",
      "selectedBackground",
      "markerSymbolSize",
    ],
    offlinelayers: ["vectorLayerOfflineEnabled"],
  },
  titleFactory = ({ featureCollectionContext }) => {
    let themenstadtplanDesc = "?";
    if (
      featureCollectionContext?.filteredItems?.length === featureCollectionContext?.items?.length
    ) {
      themenstadtplanDesc = undefined;
    }
    if (featureCollectionContext?.filteredItems?.length === 0) {
      return (
        <div>
          <b>Keine Objekte gefunden!</b> Bitte überprüfen Sie Ihre Filtereinstellungen.
        </div>
      );
    }
    if (themenstadtplanDesc) {
      return (
        <div>
          <b>gefilterte Objektdarstellung</b>
        </div>
      );
    } else {
      return undefined;
    }
  },
  backgroundConfigurations,
  backgroundModes,
  infoBoxPixelWidth,
  searchBoxPixelWidth,
  offlineCacheConfig,
  initialLoadingDelay,
}) => {
  const [state, dispatch] = useImmer({
    ...defaultState,
    history,
    appKey,
    titleFactory,
    referenceSystem,
    referenceSystemDefinition,
    maskingPolygon,
    mapEPSGCode,
  });
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

  const fitBBox = (bbox, refDefOfBBox) => {
    dispatch((state) => {
      if (state?.routedMapRef?.leafletMap?.leafletElement?.fitBounds && bbox) {
        state.routedMapRef.leafletMap.leafletElement.fitBounds(
          convertBBox2Bounds(bbox, refDefOfBBox || referenceSystemDefinition)
        );
      }
    });
  };

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider
        value={{
          dispatch,
          ...convenienceFunctions,
          zoomToFeature: (feature) => {
            let zoomlevel;
            if (referenceSystem === MappingConstants.crs25832) {
              zoomlevel = 15;
            } else {
              zoomlevel = 18;
            }
            let refDef;
            if (feature.crs) {
              const code = feature?.crs?.properties?.name?.split("EPSG::")[1];
              refDef = projectionData[code].def;
            } else {
              refDef = referenceSystemDefinition;
            }

            if (state.routedMapRef !== undefined) {
              const type = getType(feature);
              if (type === "Point") {
                const pos = proj4(refDef, proj4.defs("EPSG:4326"), [
                  feature.geometry.coordinates[0],
                  feature.geometry.coordinates[1],
                ]);

                state.routedMapRef.leafletMap.leafletElement.setView([pos[1], pos[0]], zoomlevel);
              } else {
                state.routedMapRef.leafletMap.leafletElement.fitBounds(
                  convertBBox2Bounds(envelope(feature).bbox, refDef)
                );
              }
            }
          },
          fitBBox,

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
          baseLayerConf={baseLayerConf}
          backgroundConfigurations={backgroundConfigurations}
          backgroundModes={backgroundModes}
          appKey={appKey}
          persistenceSettings={persistenceSettings}
        >
          <FeatureCollectionContextProvider
            enabled={featureCollectionEnabled}
            getFeatureStyler={getFeatureStyler}
            getColorFromProperties={getColorFromProperties}
            alwaysShowAllFeatures={alwaysShowAllFeatures}
            clusteringEnabled={clusteringEnabled}
            clusteringOptions={clusteringOptions}
            getSymbolSVG={getSymbolSVG}
            itemsURL={featureItemsURL}
            items={items}
            convertItemToFeature={convertItemToFeature}
            featureCollectionName={featureCollectionName}
            itemFilterFunction={itemFilterFunction}
            filterFunction={filterFunction}
            filterState={filterState}
            classKeyFunction={classKeyFunction}
            appKey={appKey}
            persistenceSettings={persistenceSettings}
            featureTooltipFunction={featureTooltipFunction}
          >
            <ResponsiveTopicMapContextProvider
              enabled={responsiveContextEnabled}
              appKey={appKey}
              persistenceSettings={persistenceSettings}
              infoBoxPixelWidth={infoBoxPixelWidth}
              searchBoxPixelWidth={searchBoxPixelWidth}
            >
              <OfflineLayerCacheContextProvider
                enabled={offlineLayerCacheContextEnabled}
                appKey={appKey}
                persistenceSettings={persistenceSettings}
                offlineCacheConfig={offlineCacheConfig}
                initialLoadingDelay={initialLoadingDelay}
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
              </OfflineLayerCacheContextProvider>
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
