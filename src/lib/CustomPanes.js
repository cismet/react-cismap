import React from "react";
import { Pane } from "react-leaflet";

const CustomPanes = () => {
  return (
    <div>
      <Pane name="backgroundvectorLayers" style={{ zIndex: 90 }}></Pane>
      <Pane name="backgroundLayers" style={{ zIndex: 100 }} />
      <Pane name="additionalLayers" style={{ zIndex: 150 }} />
      <Pane name="backgroundlayerTooltips" style={{ zIndex: 250 }} />
      <Pane name="featurecollection" style={{ zIndex: 600 }} />
    </div>
  );
};

export default CustomPanes;
