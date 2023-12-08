import React, { useContext, useState } from "react";
import { faPause, faPlay, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Control from "react-leaflet-control";
import "./hoverSupport.css";
import {
  CrossTabCommunicationContext,
  CrossTabCommunicationDispatchContext,
} from "./contexts/CrossTabCommunicationContextProvider";

const Hover = ({ onHover, children }) => (
  <div className="hover">
    <div className="hover__no-hover">{children}</div>
    <div className="hover__hover">{onHover}</div>
  </div>
);

export default function CrossTabCommunicationControl({
  showConnectionCount = false,
  hideWhenNoSibblingIsPresent = false,
  enabledTooltip = "Synchronisation stoppen",
  disabledTooltip = "Synchronisation starten",
  leaderVisualization = (isDynamicLeader, isPaused) => {
    return { background: isDynamicLeader && !isPaused ? "#eeeeee" : undefined };
  },
}) {
  const { isDynamicLeader, isPaused, connectedEntities } = useContext(CrossTabCommunicationContext);
  const { setPaused } = useContext(CrossTabCommunicationDispatchContext);
  if (!isPaused && hideWhenNoSibblingIsPresent && connectedEntities.length === 0) {
    return null;
  } else {
    return (
      <>
        <Control className="leaflet-bar leaflet-control hover-control" position="topleft">
          <>
            <span className="hover-control--off">
              <a
                className="leaflet-bar-part"
                title={!isPaused ? enabledTooltip : disabledTooltip}
                style={{
                  outline: "none",
                  ...leaderVisualization(isDynamicLeader, isPaused),
                }}
              >
                <span>
                  <FontAwesomeIcon
                    style={{ color: isPaused ? "#00000022" : "black" }}
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
            <span class="hover-control--on">
              <a
                className="leaflet-bar-part"
                title={!isPaused ? enabledTooltip : disabledTooltip}
                style={{
                  outline: "none",
                  ...leaderVisualization(isDynamicLeader, isPaused),
                }}
                onClick={() => {
                  setPaused(!isPaused);
                }}
              >
                <span>
                  <FontAwesomeIcon
                    style={{ color: "black" }}
                    icon={isPaused ? faPlay : faPause}
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
      </>
    );
  }
}
