import L from "leaflet";
import { GridLayer } from "react-leaflet";

// import {} from "maplibre-gl";
// import {} from "./mapbox-gl-leaflet";
import {} from "./leaflet-maplibre-gl";

class MaplibreGlLayer extends GridLayer {
  constructor(props) {
    super(props);

    this._addLayer = this._addLayer.bind(this);
    this._removeLayer = this._removeLayer.bind(this);
  }

  createLeafletElement(props) {
    const { map } = props.leaflet || this.context;

    map.on("layeradd", (e) => {
      // only call _addLayer if the layer being added is this layer
      if (e.layer === this.leafletElement) {
        this._addLayer(e, props);
      }
    });

    map.on("layerremove", (e) => {
      // only call _removeLayer if the layer being removed is this layer
      if (e.layer === this.leafletElement) {
        this._removeLayer(e);
        map.off("layerremove");
      }
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

    const layer = L.maplibreGL({
      id: "id_not_set___should_not_happen",
      pane: "pane_not_set___should_not_happen",
      ...props,
    });

    return layer;
  }

  _addLayer({ layer }, props) {
    const mlMap = layer.getMaplibreMap();
    this._layer = layer;
    const { _map } = this._layer;
    mlMap.on("load", () => {
      this.mapLibreMap = mlMap;
      if ((props.opacity || props.textOpacity || props.iconOpacity) && mlMap) {
        try {
          const style = mlMap.getStyle();
          const layers = style.layers;
          layers.map((layer) => {
            if (layer.type === "symbol") {
              mlMap.setPaintProperty(
                layer.id,
                `icon-opacity`,
                props.iconOpacity || props.opacity || 1
              );
              mlMap.setPaintProperty(
                layer.id,
                `text-opacity`,
                props.textOpacity || props.opacity || 1
              );
            } else {
              mlMap.setPaintProperty(layer.id, `${layer.type}-opacity`, props.opacity || 1);
            }
          });
          // console.log("vectorLayerOpacitySetter: looks good");
        } catch (e) {
          console.log("vectorLayerOpacitySetter: map not ready error", e);
        }
      }

      if (_map) {
        // Force a resize calculation on the map so that
        // Mapbox GL layer correctly repaints its height after it has been added.
        // _map._onResize();
      }
    });
  }

  _removeLayer() {
    this._layer = null;
  }
}

export default MaplibreGlLayer;
