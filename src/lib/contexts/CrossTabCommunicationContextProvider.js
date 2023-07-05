import React, { useEffect, useState } from "react";
import localforage from "localforage";
import { setFromLocalforage } from "./_helper";
import { useImmer } from "use-immer";
const StateContext = React.createContext();
const DispatchContext = React.createContext();

const defaultState = {
  zoomfactor: 1,
};
export const TYPES = {
  LEADER: "LEADER",
  FOLLOWER: "FOLLOWER",
};
const CrossTabCommunicationContextProvider = ({ children, appKey, persistenceSettings }) => {
  const contextKey = "crosstabcommunication";

  const [state, dispatch] = useImmer({ ...defaultState });
  const set = (prop, noTest) => {
    return (x) => {
      dispatch((state) => {
        if (JSON.stringify(state[prop]) !== JSON.stringify(x)) {
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
  useEffect(() => {
    console.log("xxx ", window.location);
    const url = window.location.href;
    const query = url.substring(url.indexOf("?") + 1); // Remove '...?' from the start of the string

    const urlSearchParams = new URLSearchParams(query);
    const leader = urlSearchParams.get("leader");
    const follower = urlSearchParams.get("follower");
    const channel = leader || follower;
    console.log("xxx leaderFollowerChannel ", urlSearchParams, { leader, follower });
    let type;
    if (leader) {
      console.log("xxx you are a leader");
      type = TYPES.LEADER;
    } else if (follower) {
      console.log("xxx you are a follower");
      type = TYPES.FOLLOWER;
    }
    const leaderChannel = new BroadcastChannel("leader:" + channel);
    const followerChannel = new BroadcastChannel("follower:" + channel);
    setX.setChannels({ leader: leaderChannel, follower: followerChannel }, type);
  }, []);

  const setX = {
    setZoomFactor: set("zoomfactor"),
    setChannels: (channels, type) => {
      dispatch((state) => {
        state.channels = channels;
      });
    },
    setAll: (all) => {
      dispatch((state) => {
        state.zoomfactor = all.zoomfactor;
      });
    },
  };

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
};
export default CrossTabCommunicationContextProvider;
export {
  CrossTabCommunicationContextProvider,
  StateContext as CrossTabCommunicationContext,
  DispatchContext as CrossTabCommunicationDispatchContext,
};
