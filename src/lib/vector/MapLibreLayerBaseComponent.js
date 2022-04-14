import L from "leaflet";
// import {} from "maplibre-gl";
// import {} from "./mapbox-gl-leaflet";
import {} from "./leaflet-maplibre-gl";
import { GridLayer } from "react-leaflet";

class MaplibreGlLayer extends GridLayer {
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
      map.off("layerremove");
    });

    // if (props.offlineAvailable) {
    //   //fetch an manipulate the style and metadata json
    //   let style;
    //   fetch(props.style)
    //     .then((response) => {
    //       return response.json();
    //     })
    //     .then((json) => {
    //       style = json;
    //     });
    // }

    const layer = L.maplibreGL({ id: "xxx", pane: "xxx", ...props });

    setTimeout(() => {
      const map = layer.getMaplibreMap();
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

export default MaplibreGlLayer;
