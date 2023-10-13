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

export default function () {
  const { isDynamicLeader, isPaused, connectedEntities } = useContext(CrossTabCommunicationContext);
  const { setPaused } = useContext(CrossTabCommunicationDispatchContext);

  console.log("xxx connectedEntities", connectedEntities);

  return (
    <>
      <Control className="leaflet-bar leaflet-control hover-control" position="topleft">
        <>
          <span class="hover-control--off">
            <a
              className="leaflet-bar-part"
              title="Vollbildmodus"
              style={{ outline: "none", background: isDynamicLeader ? "lightgrey" : undefined }}
            >
              <FontAwesomeIcon icon={faSync} size="lg" />
            </a>
          </span>
          <span class="hover-control--on">
            <a
              className="leaflet-bar-part"
              title="Vollbildmodus"
              style={{ outline: "none", background: isDynamicLeader ? "lightgrey" : undefined }}
              onClick={() => {
                setPaused(!isPaused);
              }}
            >
              <FontAwesomeIcon icon={isPaused ? faPlay : faPause} size="lg" />
            </a>
          </span>
        </>
      </Control>
    </>
  );
}
