import React, { useEffect, useRef, useState } from "react";
import localforage from "localforage";
import { setFromLocalforage } from "./_helper";
import { useImmer } from "use-immer";
import { BroadcastChannel } from "broadcast-channel";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const HEARTBEAT_INTERVAL = 500;

const defaultState = {
  zoomfactor: 1,
  channels: undefined,
  type: undefined,
  follower: {},
  followerConfigOverwrites: {},
  isDynamicLeader: false,
  isPaused: false,
  connectedEntities: [],
};
const TYPES = {
  LEADER: "LEADER",
  FOLLOWER: "FOLLOWER",
  SYNC: "SYNC",
};

const CrossTabCommunicationContextProvider = ({
  withoutHeartbeat,
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
  feedbackListener = (scope, message) => console.debug("feedbackListener", scope, message),
  messageManipulation = (scope, message) => message,
  followerConfigOverwrites = {},
  name = "unnamed",
}) => {
  const contextKey = "crosstabcommunication";
  const [state, dispatch] = useImmer({
    ...defaultState,
    appKey,
    persistenceSettings,
    id: appKey + "." + Math.random(),
    name,
  });
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const set = (prop, noTest) => {
    return (x) => {
      dispatch((state) => {
        if (JSON.stringify(state[prop]) !== JSON.stringify(x)) {
          if (persistenceSettings && persistenceSettings[contextKey]?.includes(prop)) {
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
    } else if (role === "sync") {
      leader = token;
      follower = token;
    }
    const channelToken = leader || follower;
    let type;
    if (leader) {
      // console.log("xxx you are a leader");
      type = TYPES.LEADER;
    }
    if (follower) {
      // console.log("xxx you are a follower");
      type = TYPES.FOLLOWER;
      setFollowerConfigOverwrites(followerConfigOverwrites);
    }
    if (leader && follower) {
      // console.log("xxx you are a sync");
      type = TYPES.SYNC;
    }
    const leaderChannel = new BroadcastChannel("leader:" + channelToken);
    const followerChannel = new BroadcastChannel("follower:" + channelToken);
    setX.setChannels({ leader: leaderChannel, follower: followerChannel }, type);
    // console.log("xxx setChannels");

    leaderChannel.onmessage = (event) => {
      const state = stateRef.current;
      if (state.isPaused && type !== "heartbeat") return; // don't process messages when paused

      // Block messages with scopes in the blocklist
      console.debug("event", event);

      const { scope, message, type } = event;

      if (isLeaderBlocked(scope) && type !== "heartbeat") {
        return;
      }

      if (type === "heartbeat") {
        dispatch((state) => {
          const index = state.connectedEntities.findIndex((entity) => entity.id === message.id);
          if (index > -1) {
            // Update an existing entity's last heartbeat timestamp
            state.connectedEntities[index].lastHeartbeat = Date.now();
          } else {
            // Add a new entity to the list of connected entities
            state.connectedEntities.push({
              name: message.name,
              id: message.id,
              lastHeartbeat: Date.now(),
            });
          }
        });
        return;
      }

      // Check if there are any callbacks registered for this message's scope
      // and if so, call them with the message data

      // be aware:
      // this code is getting called in a follower
      // dont be confused
      // a follower is following a leader
      // therefore leaderChannel.onmessage

      if (state.follower && state.follower[scope]) {
        for (let callback of state.follower[scope]) {
          callback(messageManipulation(scope, message));
        }
      }
    };
  }, []);

  // useEffect(() => {
  //   // Announce presence
  //   console.log("xxx announce presence", state?.channels);
  //   if (state.channels && state.channels["leader"]) {
  //     state.channels["leader"].postMessage({
  //       type: "presence",
  //       message: { name: state.name, id: state.id },
  //     });
  //   }
  // }, [state.channels]);
  useEffect(() => {
    if (withoutHeartbeat === true) {
      return;
    }
    const heartbeatInterval = setInterval(() => {
      if (state.channels && state.channels["leader"]) {
        state.channels["leader"].postMessage({
          type: "heartbeat",
          message: { name: state.name, id: state.id },
        });
      }
    }, HEARTBEAT_INTERVAL); // Send a heartbeat every 5 seconds
    return () => clearInterval(heartbeatInterval); // Clear the interval when the component unmounts
  }, [state.channels]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      dispatch((state) => {
        const now = Date.now();
        state.connectedEntities = state.connectedEntities.filter((entity) => {
          return now - entity.lastHeartbeat < HEARTBEAT_INTERVAL * 2; // Keep entities that have sent a heartbeat in the last 15 seconds
        });
      });
    }, HEARTBEAT_INTERVAL); // Check for stale entities every 5 seconds

    return () => clearInterval(cleanupInterval); // Clear the interval when the component unmounts
  }, []);

  const setFollowerConfigOverwrites = (overwrites) => {
    dispatch((state) => {
      state.followerConfigOverwrites = overwrites;
    });
  };

  const setX = {
    setZoomFactor: set("zoomfactor"),
    setIsDynamicLeader: set("isDynamicLeader"),
    setPaused: set("isPaused"),
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
      const state = stateRef.current;
      if (state.isPaused) return; // don't process messages when paused

      // This function will send a message to all followers.
      if (state.channels && state.channels["leader"]) {
        state.channels["leader"].postMessage({ scope, message });
      }
    },

    sendFeedback: (scope, message) => {
      const state = stateRef.current;

      if (state.isPaused) return; // don't process messages when paused

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
