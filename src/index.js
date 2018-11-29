import React from "react";
import ReactDOM from "react-dom";
import './index.css';

import { RoutedMap, MappingConstants } from "./lib";
const mapStyle = {
  height: 500,
cursor:'crosshair'
};
let urlSearchParams = new URLSearchParams(window.location.href);
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
      onclick={(e)=>console.log('click',e)}
      ondblclick={(e)=>console.log('doubleclick',e)}
      autoFitProcessedHandler={() =>
        this.props.mappingActions.setAutoFit(false)
      }
      backgroundlayers={"trueOrtho2018@70|rvrSchrift@100"}
      urlSearchParams={urlSearchParams}
      fullScreenControlEnabled={true}
      locateControlEnabled={true}
      minZoom= {7}
      maxZoom= {18}
      zoomSnap= {0.5}
      zoomDelta= {0.5}
      />
  </div>,
  document.getElementById("root")
);
