import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import L from "leaflet";
import { MappingConstants } from "./lib";
import AnnotatedMap from "./lib/components/AnnotatedMap";
import RoutedMap from "./lib/components/RoutedMap";
import NewPoly from "./lib/components/editcontrols/NewPolygonControl";

const mapStyle = {
  height: window.innerHeight,
  cursor: "crosshair",
};
let urlSearchParams = new URLSearchParams(window.location.href);

ReactDOM.render(
  <div>
    <div>Simple Routed Map</div>
    <br />
    <RoutedMap
      editable={false}
      style={mapStyle}
      key={"leafletRoutedMap"}
      referenceSystem={MappingConstants.crs25832}
      referenceSystemDefinition={MappingConstants.proj4crs25832def}
      ref={(leafletMap) => {
        // this.leafletRoutedMap = leafletMap;
      }}
      layers=""
      doubleClickZoom={false}
      onclick={(e) => console.log("click", e)}
      ondblclick={(e) => console.log("doubleclick", e)}
      autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
      //   backgroundlayers={"ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100"}
      backgroundlayers={"rvrGrundriss@100|trueOrtho2020@75|rvrSchriftNT@100"}
      urlSearchParams={urlSearchParams}
      fullScreenControlEnabled={false}
      locateControlEnabled={false}
      minZoom={7}
      maxZoom={18}
      zoomSnap={0.5}
      zoomDelta={0.5}
    />
  </div>,

  document.getElementById("root")
);
