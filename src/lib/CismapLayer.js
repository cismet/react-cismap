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
export default function CismapLayer(props) {
  switch (props.type) {
    case "wms":
    case "wmts": {
      let params = { ...defaults.wms, ...props };
      return <StyledWMSTileLayer {...params} />;
    }
    case "wms-nt":
    case "wmts-nt": {
      let params = { ...defaults.wms, ...props };
      return <NonTiledWMSLayer {...params} />;
    }

    case "tiles": {
      let params = { ...defaults.wms, ...props };
      return <TileLayer {...params} />;
    }
    case "vector": {
      let params = { ...defaults.vector, ...props };
      return <MapLibreLayer {...params} />;
    }
  }
}
