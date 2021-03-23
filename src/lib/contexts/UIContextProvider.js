import React, { useEffect, useState, useLayoutEffect } from "react";
import { useImmer } from "use-immer";
import localforage from "localforage";
import { setFromLocalforage } from "./_helper";
const StateContext = React.createContext();
const DispatchContext = React.createContext();
const defaultState = {
  appMenuVisible: false,
  appMenuActiveMenuSection: "settings",
  secondaryInfoVisible: false,
  collapsedInfoBox: false,
};

const UIContextProvider = ({ children, enabled = true, appKey, persistenceSettings }) => {
  const contextKey = "ui";
  const set = (prop, noTest) => {
    return (x) => {
      if (noTest === true || JSON.stringify(state[prop]) !== JSON.stringify(x)) {
        dispatch((state) => {
          if (persistenceSettings[contextKey]?.includes(prop)) {
            localforage.setItem("@" + appKey + "." + contextKey + "." + prop, x);
          }
          state[prop] = x;
        });
      }
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

  const [state, dispatch] = useImmer({ ...defaultState });

  const setX = {
    setAppMenuVisible: set("appMenuVisible"),
    setAppMenuActiveMenuSection: set("appMenuActiveMenuSection"),
    setSecondaryInfoVisible: set("secondaryInfoVisible"),
    setCollapsedInfoBox: set("collapsedInfoBox"),
  };

  if (enabled === true) {
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider
          value={{
            dispatch,
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
export default UIContextProvider;

export { UIContextProvider, StateContext as UIContext, DispatchContext as UIDispatchContext };
