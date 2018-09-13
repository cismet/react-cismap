import React from "react";
import ReactDOM from "react-dom";
import './index.css';

import { RoutedMap, MappingConstants } from "./lib";
const mapStyle = {
  height: 500
};
ReactDOM.render(
  <div>
    <div>Simple Map</div>
    <br/>
    <RoutedMap
      style={mapStyle}
      key={"leafletRoutedMap"}
      referenceSystem={MappingConstants.crs25832}
      referenceSystemDefinition={MappingConstants.proj4crs25832def}
      ref={leafletMap => {
        this.leafletRoutedMap = leafletMap;
      }}
      layers=""
      doubleClickZoom={false}
      autoFitProcessedHandler={() =>
        this.props.mappingActions.setAutoFit(false)
      }
      backgroundlayers={"bplan_abkg@30"}
    />
  </div>,
  document.getElementById("root")
);
