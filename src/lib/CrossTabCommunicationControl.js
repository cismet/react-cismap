import React, { useContext, useState } from "react";
import { faPause, faPlay, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Control from "react-leaflet-control";
import "./hoverSupport.css";
import {
  CrossTabCommunicationContext,
  CrossTabCommunicationDispatchContext,
} from "./contexts/CrossTabCommunicationContextProvider";

export default function CrossTabCommunicationControl({
  showConnectionCount = false,
  hideWhenNoSibblingIsPresent = false,
  enabledTooltip = "Synchronisation stoppen",
  disabledTooltip = "Synchronisation starten",
  forbiddenTooltip = "kein Synchronisatspartner gefunden",
  leaderVisualization = (isDynamicLeader, isPaused) => {
    return { background: isDynamicLeader && !isPaused ? "#eeeeee" : undefined };
  },
}) {
  const { isDynamicLeader, isPaused, connectedEntities } = useContext(CrossTabCommunicationContext);
  const { setPaused } = useContext(CrossTabCommunicationDispatchContext);
  // if (!isPaused && hideWhenNoSibblingIsPresent && connectedEntities.length === 0) {
  //   console.log("xxx hideWhenNoSibblingIsPresent");
  //   return null;
  // } else {
  return (
    <Control
      key="CrossTabCommunicationControl"
      className="leaflet-bar leaflet-control hover-control"
      position="topleft"
      style={{ display: "none!important" }}
    >
      <>
        <span className="hover-control--off">
          <a
            className="leaflet-bar-part"
            title={
              connectedEntities.length === 0
                ? forbiddenTooltip
                : !isPaused
                ? enabledTooltip
                : disabledTooltip
            }
            style={{
              outline: "none",
              ...leaderVisualization(isDynamicLeader, isPaused),
            }}
          >
            <span>
              <FontAwesomeIcon
                style={{
                  color: isPaused || connectedEntities.length === 0 ? "#00000022" : "black",
                  pointer: connectedEntities.length === 0 ? "not-allowed!important" : "pointer",
                }}
                icon={faSync}
                size="lg"
              />
              {!isPaused && showConnectionCount && (
                <span
                  className="fa-layers-counter  fa-layers-bottom-right"
                  style={{
                    fontSize: 50 + "px",
                    position: "absolute",
                    bottom: -8,
                    right: -10,
                    backgroundColor: "#555555",
                  }}
                >
                  {connectedEntities.length + 1}
                </span>
              )}
            </span>
          </a>
        </span>
        <span className="hover-control--on">
          <a
            className="leaflet-bar-part"
            title={
              connectedEntities.length === 0
                ? forbiddenTooltip
                : !isPaused
                ? enabledTooltip
                : disabledTooltip
            }
            style={{
              outline: "none",
              ...leaderVisualization(isDynamicLeader, isPaused),
            }}
            onClick={() => {
              if (connectedEntities.length === 0) {
                return;
              }
              setPaused(!isPaused);
            }}
          >
            <span>
              <FontAwesomeIcon
                style={{
                  color: connectedEntities.length === 0 ? "#00000022" : "black",
                  cursor: connectedEntities.length === 0 ? "not-allowed" : "pointer",
                }}
                icon={connectedEntities.length === 0 ? faSync : isPaused ? faPlay : faPause}
                size="lg"
              />
              {!isPaused && showConnectionCount && (
                <span
                  className="fa-layers-counter  fa-layers-bottom-right"
                  style={{
                    fontSize: 50 + "px",
                    position: "absolute",
                    bottom: -10,
                    right: -10,
                    backgroundColor: "#555555",
                  }}
                >
                  {connectedEntities.length + 1}
                </span>
              )}
            </span>
          </a>
        </span>
      </>
    </Control>
  );
  // }
}
