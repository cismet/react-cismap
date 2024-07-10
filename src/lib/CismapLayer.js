import React from "react";
import StyledWMSTileLayer from "./StyledWMSTileLayer";
import NonTiledWMSLayer from "./NonTiledWMSLayer";
import { TileLayer } from "react-leaflet";
import MapLibreLayer from "./vector/MapLibreLayer";
import GraphqlLayer from "./GraphqlLayer";

const defaults = {
  wms: {
    format: "image/png",
    maxZoom: 22,
    opacity: 0.6,
    version: "1.1.1",
    pane: "backgroundLayers",
    tiled: false,
  },
  vector: {},
};

export default function CismapLayer(props) {
  if (props.type === undefined) {
    console.error("CismapLayer: type not set", props);
    return null;
  } else {
    let opacity = props.opacity || 1;
    if (props.opacityFunction) {
      opacity = props.opacityFunction(opacity);
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
      case "graphql": {
        let params = { ...defaults.graphql, ...props, opacity };
        return <GraphqlLayer {...params} />;
      }
    }
  }
}
