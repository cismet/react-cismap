import React, { useEffect, useRef, useState } from "react";
import localforage from "localforage";
import { setFromLocalforage } from "./_helper";
import { useImmer } from "use-immer";
const StateContext = React.createContext();
const DispatchContext = React.createContext();

const defaultState = {
  zoomfactor: 1,
  channels: undefined,
  type: undefined,
  follower: {},
  followerConfigOverwrites: {},
};
const TYPES = {
  LEADER: "LEADER",
  FOLLOWER: "FOLLOWER",
};

const CrossTabCommunicationContextProvider = ({
  children,
  appKey = "GenericCrossTabCommunicationContextProviderKey",
  persistenceSettings,
  role = "fromurl",
  token = "genericCrossTabCommunicationContextProviderToken",
  blocklist = [], // will block every scope that starts with the strings in this list
  passlist = [], // will only allow scopes that start with the strings in this list, if empty allow all
  leaderBlocklist = [], // will block every scope that starts with the strings in this list. still keeps the connection so the feedback will come through
  leaderPasslist = [], // will only allow scopes that start with the strings in this list, if empty allow all. for the others still keep the connection so the feedback will come through
  feedbackBlocklist = [], // will block the feedback from every scope that starts with the strings in this list.
  feedbackPasslist = [], // will only allow the feedback from scopes that start with the strings in this list, if empty allow all
  feedbackListener = (scope, message) => console.log("feedbackListener", scope, message),
  messageManipulation = (scope, message) => message,
  followerConfigOverwrites = {},
}) => {
  const contextKey = "crosstabcommunication";
  const [state, dispatch] = useImmer({
    ...defaultState,
    appKey,
    persistenceSettings,
  });
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
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

  const isBlocked = (scope) => {
    // Checks if the scope starts with any string in the block list
    const isInBlocklist = blocklist.some((blockItem) => scope.startsWith(blockItem));

    // Checks if passlist is not empty and the scope does not start with any string in the pass list
    const notInPasslist =
      passlist.length > 0 && !passlist.some((passItem) => scope.startsWith(passItem));

    // A scope is considered blocked if it's in the block list or if the pass list is used and it's not in the pass list
    return isInBlocklist || notInPasslist;
  };

  // New block functions for leader messages and feedback messages
  const isLeaderBlocked = (scope) => {
    // Check if the scope is blocked by the general blocklist and passlist
    const isGenerallyBlocked = isBlocked(scope);

    // Check if the scope is blocked by the leader specific blocklist and passlist
    const isInLeaderBlocklist = leaderBlocklist.some((blockItem) => scope.startsWith(blockItem));
    const notInLeaderPasslist =
      leaderPasslist.length > 0 && !leaderPasslist.some((passItem) => scope.startsWith(passItem));

    // A scope is considered blocked if it's blocked by either the general blocklist/passlist or the leader specific blocklist/passlist
    return isGenerallyBlocked || isInLeaderBlocklist || notInLeaderPasslist;
  };

  const isFeedbackBlocked = (scope) => {
    // Check if the scope is blocked by the general blocklist and passlist
    const isGenerallyBlocked = isBlocked(scope);

    // Check if the scope is blocked by the feedback specific blocklist and passlist
    const isInFeedbackBlocklist = feedbackBlocklist.some((blockItem) =>
      scope.startsWith(blockItem)
    );
    const notInFeedbackPasslist =
      feedbackPasslist.length > 0 &&
      !feedbackPasslist.some((passItem) => scope.startsWith(passItem));

    // A scope is considered blocked if it's blocked by either the general blocklist/passlist or the feedback specific blocklist/passlist
    return isGenerallyBlocked || isInFeedbackBlocklist || notInFeedbackPasslist;
  };

  useEffect(() => {
    let leader, follower;
    if (role === "fromurl") {
      const url = window.location.href;
      // Remove '...?' from the start of the string
      const query = url.substring(url.indexOf("?") + 1);
      const urlSearchParams = new URLSearchParams(query);
      leader = urlSearchParams.get("leader");
      follower = urlSearchParams.get("follower");
    } else if (role === "leader") {
      leader = token;
    } else if (role === "follower") {
      follower = token;
    }
    const channelToken = leader || follower;
    let type;
    if (leader) {
      console.log("xxx you are a leader");
      type = TYPES.LEADER;
    } else if (follower) {
      console.log("xxx you are a follower");
      type = TYPES.FOLLOWER;
      setFollowerConfigOverwrites(followerConfigOverwrites);
    }
    const leaderChannel = new BroadcastChannel("leader:" + channelToken);
    const followerChannel = new BroadcastChannel("follower:" + channelToken);
    setX.setChannels({ leader: leaderChannel, follower: followerChannel }, type);
    console.log("xxx setChannels");

    leaderChannel.onmessage = (event) => {
      const state = stateRef.current;

      // Block messages with scopes in the blocklist
      if (isLeaderBlocked(event.data.scope)) {
        return;
      }

      // Check if there are any callbacks registered for this message's scope
      // and if so, call them with the message data

      // be aware:
      // this code is getting called in a follower
      // dont be confused
      // a follower is following a leader
      // therefore leaderChannel.onmessage

      if (state.follower && state.follower[event.data.scope]) {
        for (let callback of state.follower[event.data.scope]) {
          callback(messageManipulation(event.data.scope, event.data.message));
        }
      }
    };

    followerChannel.onmessage = (event) => {
      // Block messages with scopes in the blocklist
      if (isFeedbackBlocked(event.data.scope)) {
        return;
      }

      feedbackListener(event.data.scope, event.data.message);
    };

    // Clean up by closing channels when component unmounts
    return () => {
      leaderChannel.close();
      followerChannel.close();
    };
  }, []);
  const setFollowerConfigOverwrites = (overwrites) => {
    dispatch((state) => {
      state.followerConfigOverwrites = overwrites;
    });
  };

  const setX = {
    setZoomFactor: set("zoomfactor"),
    setChannels: (channels, type) => {
      dispatch((state) => {
        state.channels = channels;
        state.type = type;
      });
    },
    follow: (scope, callback) => {
      // This function will register a callback for the specified scope.
      dispatch((state) => {
        state.follower[scope] = state.follower[scope] || [];
        state.follower[scope].push(callback);
      });
    },
    scopedMessage: (scope, message) => {
      // This function will send a message to all followers.
      if (state.channels && state.channels["leader"]) {
        state.channels["leader"].postMessage({ scope, message });
      }
    },

    sendFeedback: (scope, message) => {
      // This function will send a message back to the leader.
      if (state.channels && state.channels["follower"]) {
        state.channels["follower"].postMessage({ scope, message });
      }
    },
  };

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider
        value={{
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
  TYPES,
};
