import React, { useEffect, useState, useLayoutEffect } from "react";
import { useImmer } from "use-immer";

const StateContext = React.createContext();
const DispatchContext = React.createContext();
const defaultState = {
  appMenuVisible: false,
  activeMenuSection: undefined,
  secondaryInfoVisible: false,
};
const UIContextProvider = ({ children, enabled = true }) => {
  const [state, dispatch] = useImmer({ ...defaultState });
  const set = (prop) => {
    return (x) => {
      dispatch((state) => {
        if (JSON.stringify(state[prop]) !== JSON.stringify(x)) {
          state[prop] = x;
        }
      });
    };
  };

  const setX = {
    setAppMenuVisible: set("appMenuVisible"),
    setAppMenuActiveMenuSection: set("appMenuActiveMenuSection"),
    setSecondaryInfoVisible: set("secondaryInfoVisible"),
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
