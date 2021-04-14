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
    const { map } = props.leaflet || this.context;

    map.on("layeradd", (e) => {
      this._addLayer(e);
    });

    map.on("layerremove", (e) => {
      this._removeLayer(e);
    });
    const layer = L.mapboxGL({ id: "xxx", accessToken: "multipass", ...props });
    console.log("xxx layer", layer);
    setTimeout(() => {
      const map = layer.getMapboxMap();
      console.log("xxx layer testing", layer.getMapboxMap().style);
      // map.getStyle().layers.map((layer) => {
      //   if (layer.type === "symbol") {
      //     map.setPaintProperty(layer.id, `icon-opacity`, 0.9);
      //     map.setPaintProperty(layer.id, `text-opacity`, 0.9);
      //   } else {
      //     map.setPaintProperty(layer.id, `${layer.type}-opacity`, 0.1);
      //   }
      // });
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
