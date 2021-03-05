import React, { useEffect, useState, useLayoutEffect } from "react";
import { useImmer } from "use-immer";
import localforage from "localforage";
import { setFromLocalforage } from "./_helper";

const StateContext = React.createContext();
const DispatchContext = React.createContext();
const defaultState = {
  title: "",
  photourls: [],
  caption: "",
  index: 0,
  visible: false,
};
const UIContextProvider = ({ children, enabled = true, appKey, persistenceSettings }) => {
  const [state, dispatch] = useImmer({ ...defaultState });
  const contextKey = "lightbox";
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
    if (persistenceSettings && persistenceSettings[contextKey]) {
      for (const prop of persistenceSettings[contextKey]) {
        const localforagekey = "@" + appKey + "." + contextKey + "." + prop;
        const setter = set(prop, true);
        setFromLocalforage(localforagekey, setter);
      }
    }
  }, []);
  const setX = {
    setTitle: set("title"),
    setPhotoUrls: set("photourls"),
    setCaption: set("caption"),
    setIndex: set("index"),
    setVisible: set("visible"),
    setAll: (all) => {
      dispatch((state) => {
        state.title = all.title;
        state.photourls = all.photourls;
        state.caption = all.caption;
        state.index = all.index;
        state.visible = true;
      });
    },
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

export {
  UIContextProvider,
  StateContext as LightBoxContext,
  DispatchContext as LightBoxDispatchContext,
};
