import L from "leaflet";
import { GridLayer } from "react-leaflet";

// import {} from "maplibre-gl";
// import {} from "./mapbox-gl-leaflet";
import { } from "./leaflet-maplibre-gl";
import { Point } from "maplibre-gl";

// import {} from "@maplibre/maplibre-gl-leaflet";

class MaplibreGlLayer extends GridLayer {
  constructor(props) {
    super(props);
    this._addLayer = this._addLayer.bind(this);
    this._removeLayer = this._removeLayer.bind(this);
    this._onViewChanged = this._onViewChanged.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Check if any props have changed
    if (prevProps !== this.props) {
      if (this.mapLibreMap && this.props.selectionEnabled === false && this.props.onSelectionChanged !== undefined) {
        // Deselect all features first
        this.mapLibreMap.queryRenderedFeatures().forEach((feature) => {
          this.mapLibreMap.setFeatureState(
            { source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id },
            { selected: false }
          );
        });
        this.props.onSelectionChanged({ hits: undefined, hit: undefined });
      }

    }
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
    // map.on("moveend", (e) => {
    //   console.log("xxx moveend", new Error().stack);
    //   this._onViewChanged();
    // });

    // Add maxSelectionCount with a default value of 1
    const maxSelectionCount = props.maxSelectionCount || 1;
    const normalizeFeatureHitsById = props.normalizeFeatureHitsById || false;
    if (props.onSelectionChanged) {
      map.on("click", (e) => {
        if (this.mapLibreMap?.project) {
          // Project the clicked point to map coordinates
          const point = this.mapLibreMap.project([e.latlng.lng, e.latlng.lat]);

          // Create a small bounding box around the clicked point
          const size = 0;
          const rect = [
            [point.x - size, point.y - size],
            [point.x + size, point.y + size],
          ];

          // Convert the bounding box points back to latitude and longitude
          const queryRect = rect.map((p) => this.mapLibreMap.unproject(p));

          // console.log("xxx adjusted point:", point.x, point.y);
          // console.log("xxx this.mapLibreMap", this.mapLibreMap);

          if (this.mapLibreMap && this.props.selectionEnabled === true) {
            const hits = this.mapLibreMap.queryRenderedFeatures(rect);

            // Deselect all features first
            this.mapLibreMap.queryRenderedFeatures().forEach((feature) => {
              this.mapLibreMap.setFeatureState(
                { source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id },
                { selected: false }
              );
            });

            if (hits.length > 0) {
              // Limit the selection to maxSelectionCount
              const limitedHits = hits.slice(0, maxSelectionCount);

              const normalizedLimitedHits = [];
              limitedHits.forEach((hit) => {
                // console.log("xxx -> ", hit.layer.id, hit.properties.id, hit);
                this.mapLibreMap.setFeatureState(
                  { source: hit.source, sourceLayer: hit.sourceLayer, id: hit.id },
                  { selected: true }
                );

                //add hit to normalizedLimitedHits if an object with the id isn't already in the array
                if (
                  !normalizedLimitedHits.some((e) => e.id === hit.id)
                ) {
                  normalizedLimitedHits.push(hit);
                }

                // console.log(`State set for feature ID ${hit.id}`);
              });
              // console.log('limitedHits', limitedHits);
              // console.log('normalizedLimitedHits', normalizedLimitedHits);

              if (normalizeFeatureHitsById) {
                props.onSelectionChanged({ hits: normalizedLimitedHits, hit: normalizedLimitedHits[0] });

              } else {
                props.onSelectionChanged({ hits: limitedHits, hit: limitedHits[0] });

              }
            } else {
              props.onSelectionChanged({ hits: undefined, hit: undefined });
              // console.log("No features found at the click location.");
            }
          }
        } else {
          console.log("xxx no mapLibreMap set");
        }
      });
    }

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
      this._onViewChanged();

      if ((props.opacity || props.textOpacity || props.iconOpacity) && mlMap) {
        try {
          const style = mlMap.getStyle();
          const layers = style.layers;
          layers.map((layer) => {
            if (layer.type === "symbol") {
              const existingIconOpacity = mlMap.getPaintProperty(layer.id, "icon-opacity") || 1;
              const existingTextOpacity = mlMap.getPaintProperty(layer.id, "text-opacity") || 1;
              mlMap.setPaintProperty(
                layer.id,
                `icon-opacity`,
                (props.iconOpacity || props.opacity || 1) * existingIconOpacity
              );
              mlMap.setPaintProperty(
                layer.id,
                `text-opacity`,
                (props.textOpacity || props.opacity || 1) * existingTextOpacity
              );
            } else {
              const existingOpacity =
                mlMap.getPaintProperty(layer.id, `${layer.type}-opacity`) || 1;
              mlMap.setPaintProperty(
                layer.id,
                `${layer.type}-opacity`,
                (props.opacity || 1) * existingOpacity
              );
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

      //check if the onLayerClick function is set and if it is a function

      // if (props.onLayerClick) {
      //   mlMap.on("click", "kanal", (e) => {
      //     console.log("xxx inner click  e", e);
      //     console.log("xxx inner click  props", props);
      //     // const features = mlMap.queryRenderedFeatures(e.point);
      //     props.onLayerClick(e);
      //   });
      // }
      // if (this.mapLibreMap) {
      //   this.mapLibreMap.on("click", "kanal", (e) => {
      //     console.log("xxx inner click  e", e);
      //     // console.log("xxx inner click  props", props);
      //     // // const features = mlMap.queryRenderedFeatures(e.point);
      //     // props.onLayerClick(e);
      //   });
      // }
    });
  }

  _removeLayer() {
    this._layer = null;
  }
  _onViewChanged() {
    if (this.mapLibreMap) {
      const visibleFeatures = this.mapLibreMap.queryRenderedFeatures({
        layers: ["poi-images"],
      });
      const visibleFeatureCount = visibleFeatures.length;
      if (this.props.onViewMetaDataChanged) {
        this.props.onViewMetaDataChanged(visibleFeatureCount);
      }
    }
  }
}

export default MaplibreGlLayer;
