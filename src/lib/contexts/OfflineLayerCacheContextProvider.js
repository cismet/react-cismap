import React, { useEffect, useState, useLayoutEffect } from "react";
import { useImmer } from "use-immer";
import localforage from "localforage";
import { setFromLocalforage } from "./_helper";
import { loadAndCacheOfflineMapData } from "../tools/offlineMapsHelper";
const StateContext = React.createContext();
const DispatchContext = React.createContext();
const defaultState = { cacheStatus: {} };
const OfflineLayerCacheContextProvider = ({
  offlineCacheConfig,
  enabled = true,
  initialLoadingDelay = 1500,
  children,
}) => {
  const [state, dispatch] = useImmer({ ...defaultState, offlineCacheConfig });
  const contextKey = "lightbox";
  const set = (prop, noTest) => {
    return (x) => {
      dispatch((state) => {
        state[prop] = x;
      });
    };
  };
  useEffect(() => {
    setTimeout(() => {
      loadAndCacheOfflineMapData(offlineCacheConfig, setCacheInfoForKey).then(() => {
        // setReadyToUse(true);
      });
    }, initialLoadingDelay);
  }, []);

  const setCacheInfoForKey = (key, cacheInfo) => {
    dispatch((state) => {
      state.cacheStatus[key] = cacheInfo;
    });
  };

  if (enabled === true) {
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider
          value={{
            dispatch,
            setCacheInfoForKey,
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
  OfflineLayerCacheContextProvider,
  StateContext as OfflineLayerCacheContext,
  DispatchContext as OfflineLayerCacheDispatchContext,
};
