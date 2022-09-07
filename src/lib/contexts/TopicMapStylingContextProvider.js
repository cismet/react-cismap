import React, { useEffect, useState, useLayoutEffect } from "react";
import { useImmer } from "use-immer";
import { getInternetExplorerVersion } from "../tools/browserHelper";
import localforage from "localforage";
import { setFromLocalforage } from "./_helper";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

let defaultBackgroundModes;
if (getInternetExplorerVersion() === -1) {
  defaultBackgroundModes = [
    {
      title: "Stadtplan (Tag)",
      mode: "default",
      layerKey: "stadtplan"
    },
    {
      title: "Stadtplan (Nacht)",
      mode: "night",
      layerKey: "stadtplan"
    },
    { title: "Luftbildkarte", mode: "default", layerKey: "lbk" }
  ];
} else {
  defaultBackgroundModes = [
    {
      title: "Stadtplan",
      mode: "default",
      layerKey: "stadtplan"
    },
    { title: "Luftbildkarte", mode: "default", layerKey: "lbk" }
  ];
}

const defaultBackgroundConfigurations = {
  topo: {
    layerkey: "hillshade|bplan_abkg@30|wupp-plan-live@20",
    src: "/images/rain-hazard-map-bg/topo.png",
    title: "Top. Karte"
  },
  lbk: {
    // layerkey: "rvrGrundriss@100|trueOrtho2020@75|rvrSchrift@100",
    layerkey: "rvrGrundriss@100|trueOrtho2022@75|rvrSchriftNT@100",
    src: "/images/rain-hazard-map-bg/ortho.png",
    title: "Luftbildkarte"
  },
  stadtplan: {
    layerkey: "wupp-plan-live@90",
    src: "/images/rain-hazard-map-bg/citymap.png",
    title: "Stadtplan"
  }
};
const defaultState = {
  additionalLayerConfiguration: {},
  baseLayerConf: {},
  activeAdditionalLayerKeys: [],
  namedMapStyle: "default",
  selectedBackground: "stadtplan",
  backgroundModes: defaultBackgroundModes,
  markerSymbolSize: 35,
  backgroundConfigurations: defaultBackgroundConfigurations,
  additionalStylingInfo: {}
};
const TopicMapStylingContextProvider = ({
  children,
  enabled = true,
  additionalLayerConfiguration,
  baseLayerConf,
  namedMapStyle,
  markerSymbolSize,
  appKey,
  persistenceSettings,
  backgroundConfigurations,
  backgroundModes,
  additionalStylingInfo
}) => {
  const activeAdditionalLayerKeys = [];
  if (additionalLayerConfiguration) {
    for (const adLayerConfKey of Object.keys(additionalLayerConfiguration)) {
      const adLayerConf = additionalLayerConfiguration[adLayerConfKey];
      if (adLayerConf.initialActive === true || adLayerConf.initialActive === undefined) {
        activeAdditionalLayerKeys.push(adLayerConfKey);
      }
    }
  }
  const [state, dispatch] = useImmer({
    ...defaultState,
    activeAdditionalLayerKeys,
    additionalLayerConfiguration,
    baseLayerConf,
    namedMapStyle,
    backgroundConfigurations: backgroundConfigurations || defaultBackgroundConfigurations,
    backgroundModes: backgroundModes || defaultBackgroundModes,
    updater: 0
  });

  const contextKey = "styling";
  const set = (prop, noTest) => {
    return x => {
      dispatch(state => {
        if (noTest === true || JSON.stringify(state[prop]) !== JSON.stringify(x)) {
          if (persistenceSettings[contextKey]?.includes(prop)) {
            localforage.setItem("@" + appKey + "." + contextKey + "." + prop, x);
          }
          state[prop] = x;
        }
      });
    };
  };
  useEffect(() => {
    if (persistenceSettings && persistenceSettings[contextKey]) {
      for (const prop of persistenceSettings[contextKey]) {
        const localforagekey = "@" + appKey + "." + contextKey + "." + prop;
        const setter = set(prop, true);
        setFromLocalforage(localforagekey, setter);
      }
    }
  }, []);
  const setX = {
    setUpdater: set("updater"),
    setNamedMapStyle: set("namedMapStyle"),
    setMarkerSymbolSize: set("markerSymbolSize"),
    setSelectedBackground: set("selectedBackground"),
    setActiveAdditionalLayerKeys: set("activeAdditionalLayerKeys"),
    setAdditionalStylingInfo: set("additionalStylingInfo")
  };

  if (enabled === true) {
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider
          value={{
            dispatch,
            ...setX
          }}
        >
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  } else {
    return (
      <StateContext.Provider value={undefined}>
        <DispatchContext.Provider
          value={{
            undefined
          }}
        >
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  }
};
export default TopicMapStylingContextProvider;

export {
  TopicMapStylingContextProvider,
  StateContext as TopicMapStylingContext,
  DispatchContext as TopicMapStylingDispatchContext
};
