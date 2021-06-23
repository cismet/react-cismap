import L from "leaflet";
import {} from "maplibre-gl";
import {} from "./mapbox-gl-leaflet";

import { GridLayer } from "react-leaflet";
import { defaultProps } from "react-svg-inline";

class MapboxGlLayer extends GridLayer {
  constructor(props) {
    super(props);

    this._addLayer = this._addLayer.bind(this);
    this._removeLayer = this._removeLayer.bind(this);
  }

  createLeafletElement(props) {
    console.log("xxxx createleafletElement", props);

    if (navigator.serviceWorker && navigator.serviceWorker.controller && props.offlineConfig) {
      navigator.serviceWorker.controller.postMessage({
        type: "SETCARMAOFFLINECONFIG",
        offline: props.offline,
        config: props.offlineConfig,
      });
    }

    const { map } = props.leaflet || this.context;

    map.on("layeradd", (e) => {
      this._addLayer(e);
    });

    map.on("layerremove", (e) => {
      this._removeLayer(e);
    });
    const layer = L.mapboxGL({ id: "xxx", accessToken: "multipass", pane: "xxx", ...props });
    // console.log("xxx layer", layer);
    setTimeout(() => {
      const map = layer.getMapboxMap();
      this.mapBoxMap = map;
      if (props.opacity || props.textOpacity || props.iconOpacity) {
        map.getStyle().layers.map((layer) => {
          if (layer.type === "symbol") {
            map.setPaintProperty(layer.id, `icon-opacity`, props.iconOpacity || props.opacity || 1);
            map.setPaintProperty(layer.id, `text-opacity`, props.textOpacity || props.opacity || 1);
          } else {
            map.setPaintProperty(layer.id, `${layer.type}-opacity`, props.opacity || 1);
          }
        });
      }
    }, 400);

    return layer;
  }

  _addLayer({ layer }) {
    this._layer = layer;
    const { _map } = this._layer;

    if (_map) {
      // Force a resize calculation on the map so that
      // Mapbox GL layer correctly repaints its height after it has been added.
      setTimeout(_map._onResize, 200);
    }
  }

  _removeLayer() {
    this._layer = null;
  }
}

export default MapboxGlLayer;
