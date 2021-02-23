import React, { useEffect, useState, useLayoutEffect } from "react";
import { useImmer } from "use-immer";

const StateContext = React.createContext();
const DispatchContext = React.createContext();
const defaultState = {
  title: "",
  photourls: [],
  caption: "",
  index: 0,
  visible: false,
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
