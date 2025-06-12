import localforage from "localforage";
import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { deleteOfflineMapData, loadAndCacheOfflineMapData } from "../tools/offlineMapsHelper";
import { setFromLocalforage } from "./_helper";
const StateContext = React.createContext();
const DispatchContext = React.createContext();
const defaultState = { cacheStatus: {} };
const OfflineLayerCacheContextProvider = ({
  offlineCacheConfig,
  enabled = true,
  initialLoadingDelay = 1,
  persistenceSettings,
  appKey,
  children,
}) => {
  let _vectorLayerOfflineEnabled = true;
  if (offlineCacheConfig?.optional === true) {
    _vectorLayerOfflineEnabled =
      offlineCacheConfig?.initialActive !== undefined
        ? offlineCacheConfig?.initialActive || false
        : false;
  } else {
    _vectorLayerOfflineEnabled = true;
  }

  const contextKey = "offlinelayers";

  const [state, dispatch] = useImmer({
    ...defaultState,
    offlineCacheConfig,
    vectorLayerOfflineEnabled: undefined, //_vectorLayerOfflineEnabled,
    readyToUse: false,
  });

  useEffect(() => {
    if (persistenceSettings && persistenceSettings[contextKey]) {
      for (const prop of persistenceSettings[contextKey]) {
        const localforagekey = "@" + appKey + "." + contextKey + "." + prop;
        const setter = set(prop, true);
        if (prop === "vectorLayerOfflineEnabled") {
          setFromLocalforage(localforagekey, setter, _vectorLayerOfflineEnabled);
        } else {
          setFromLocalforage(localforagekey, setter);
        }
      }
    }
  }, []);
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
  useEffect(() => {
    if (state.vectorLayerOfflineEnabled !== undefined) {
      if (state.vectorLayerOfflineEnabled) {
        loadAndCacheOfflineMapData(offlineCacheConfig, setCacheInfoForKey).then(() => {
          setX.setReadyToUse(true);
        });
      } else {
        //delete the stuff
        setX.setReadyToUse(false);
        deleteOfflineMapData(offlineCacheConfig, setCacheInfoForKey);
      }
    }
  }, [state.vectorLayerOfflineEnabled]);

  const setCacheInfoForKey = (key, cacheInfo) => {
    dispatch((state) => {
      state.cacheStatus[key] = cacheInfo;
    });
  };
  const setX = {
    setVectorLayerOfflineEnabled: set("vectorLayerOfflineEnabled"),
    setReadyToUse: set("readyToUse"),
  };
  if (enabled === true) {
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider
          value={{
            dispatch,
            setCacheInfoForKey,
            ...setX,
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
            undefined,
          }}
        >
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  }
};
export default OfflineLayerCacheContextProvider;

export {
  StateContext as OfflineLayerCacheContext,
  OfflineLayerCacheContextProvider,
  DispatchContext as OfflineLayerCacheDispatchContext,
};
