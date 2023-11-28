import React from "react";
import StyledWMSTileLayer from "./StyledWMSTileLayer";
import NonTiledWMSLayer from "./NonTiledWMSLayer";
import { TileLayer } from "leaflet";
import MapLibreLayer from "./vector/MapLibreLayer";

const defaults = {
  wms: {
    format: "image/png",
    tiled: "true",
    maxZoom: 22,
    opacity: 0.6,
    version: "1.1.1",
    pane: "backgroundLayers",
  },
  vector: {},
};

export default function CismapLayer(_props) {
  const props = JSON.parse(JSON.stringify(_props));
  //function gets not copied
  if (props.type === undefined) {
    console.error("CismapLayer: type not set", props);
    return null;
  } else {
    let opacity = props.opacity || 1;
    if (_props.opacityFunction) {
      opacity = _props.opacityFunction(opacity);
    }
    switch (props.type) {
      case "wms":
      case "wmts": {
        let params = { ...defaults.wms, ...props, opacity };
        return <StyledWMSTileLayer {...params} />;
      }
      case "wms-nt":
      case "wmts-nt": {
        let params = { ...defaults.wms, ...props, opacity };
        return <NonTiledWMSLayer {...params} />;
      }

      case "tiles": {
        let params = { ...defaults.wms, ...props, opacity };
        return <TileLayer {...params} />;
      }
      case "vector": {
        let params = { ...defaults.vector, ...props, opacity };
        return <MapLibreLayer {...params} />;
      }
    }
  }
}
