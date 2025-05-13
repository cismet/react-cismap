import L from "leaflet";
import { GridLayer } from "react-leaflet";
import { } from "./leaflet-maplibre-gl";


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
      if (
        this.mapLibreMap &&
        this.props.selectionEnabled === false &&
        this.props.onSelectionChanged !== undefined
      ) {
        // Deselect all features first
        this.mapLibreMap.queryRenderedFeatures().forEach((feature) => {
          this.mapLibreMap.setFeatureState(
            { source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id },
            { selected: false }
          );
        });
        this.props.onSelectionChanged({ hits: undefined, hit: undefined, latlng: undefined });
      }
    }

    // Detect opacity change

    if (prevProps.opacity !== this.props.opacity) {
      // console.log('xxx props did change', this, this._layer._container);
      this._layer._container.style.opacity = this.props.opacity;
    }
  }

  createLeafletElement(props) {
    const { map } = props.leaflet || this.context;

    this.selectedFeatures = new Set();
    map.on("layeradd", (e) => {
      // only call _addLayer if the layer being added is this layer
      if (e.layer === this.leafletElement) {
        this._addLayer(e, props);
        map.on("click", myClickListener);
      }
    });

    this.myLayerRemoveListener = (e) => {
      // only call _removeLayer if the layer being removed is this layer
      if (e.layer === this.leafletElement) {
        this._removeLayer(e);
        map.off("layerremove", this.myLayerRemoveListener);
        // selectedFeatures.clear();

        //clean up the local click listener
        map.off("click", myClickListener);
      }
    };

    map.on("layerremove", this.myLayerRemoveListener);
    // map.on("moveend", (e) => {
    //   console.log("xxx moveend", new Error().stack);
    //   this._onViewChanged();
    // });

    // Add maxSelectionCount with a default value of 1
    const maxSelectionCount = props.maxSelectionCount || 1;
    const normalizeFeatureHitsById = props.normalizeFeatureHitsById || false;
    const manualSelectionManagement = props.manualSelectionManagement || false;
    const myClickListener = (e) => {
      if (true || this.selectionLayerExists || manualSelectionManagement) {
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

          if (this.mapLibreMap && this.props.selectionEnabled === true) {
            const hits = this.mapLibreMap.queryRenderedFeatures(rect);
            const filteredHits = hits.filter((hit) => {
              //hit.layer.id should not contain selection
              return !hit.layer.id.includes("selection");
            });
            // console.log("xxx filteredHits", filteredHits);

            // Deselect all selected features first
            this.selectedFeatures.forEach((feature) => {
              try {
                this.mapLibreMap.setFeatureState(
                  { source: feature.source, sourceLayer: feature.sourceLayer, id: feature.id },
                  { selected: false }
                );
              } catch (e) {
                console.error("xxx deselect error", e);
              }
            });

            this.selectedFeatures.clear();

            if (filteredHits.length > 0) {
              // Limit the selection to maxSelectionCount

              const limitedHits = filteredHits.slice(0, maxSelectionCount);

              const normalizedLimitedHits = [];
              limitedHits.forEach((hit) => {
                const setSelection = (selected) => {
                  this.mapLibreMap.setFeatureState(
                    { source: hit.source, sourceLayer: hit.sourceLayer, id: hit.id },
                    { selected }
                  );
                  this.selectedFeatures.add({
                    source: hit.source,
                    sourceLayer: hit.sourceLayer,
                    id: hit.id,
                  });
                };

                if (manualSelectionManagement === false) {
                  setSelection(true);
                } else {
                  hit.setSelection = setSelection;
                  hit.selectionLayerExists = this.selectionLayerExists;
                }

                //add hit to normalizedLimitedHits if an object with the id isn't already in the array
                if (!normalizedLimitedHits.some((e) => e.id === hit.id)) {
                  normalizedLimitedHits.push(hit);
                }
              });

              if (normalizeFeatureHitsById) {
                props.onSelectionChanged({
                  hits: normalizedLimitedHits,
                  hit: normalizedLimitedHits[0],
                  latlng: e.latlng,
                });
              } else {
                props.onSelectionChanged({
                  hits: limitedHits,
                  hit: limitedHits[0],
                  latlng: e.latlng,
                });
              }
            } else {
              props.onSelectionChanged({ hits: undefined, hit: undefined, latlng: e.latlng });
              // console.log("No features found at the click location.");
            }
          }
        } else {
          console.log("xxx no mapLibreMap set");
        }
      }
    };
    if (props.onSelectionChanged) {
      map.on("click", myClickListener);
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
    mlMap.showTileBoundaries = props.showTileBoundaries || false;
    // mlMap.showCollisionBoxes = true;

    if (props.onStyleIdle) {
      mlMap.on("idle", (e) => {
        props.onStyleIdle(e);
      });
    }
    this._layer = layer;
    const { _map } = this._layer;

    //handle opacity prop to set the native css opacity of the layer container
    this._layer._container.style.opacity = props.opacity;

    mlMap.on("load", () => {
      this.mapLibreMap = mlMap;
      const style = mlMap.getStyle();


      if (this.props.initialVisualSelection) {
        this.mapLibreMap.setFeatureState(
          this.props.initialVisualSelection,
          { selected: true }
        );
        this.selectedFeatures.add(this.props.initialVisualSelection);
        // this.props.onSelectionChanged({
        //   hits: [this.props.initialVisualSelection],
        //   hit: this.props.initialVisualSelection,
        // });
      }


      //check if a layer in the style has the word "selection" in its id
      this.selectionLayerExists = style.layers.some((layer) => {
        return layer.id.includes("selection");
      });

      this._onViewChanged();

      if ((props.textOpacity || props.iconOpacity) && mlMap) {
        try {
          const layers = style.layers;
          layers.map((layer) => {
            if (layer.type === "symbol") {
              const existingIconOpacity = mlMap.getPaintProperty(layer.id, "icon-opacity") || 1;
              const existingTextOpacity = mlMap.getPaintProperty(layer.id, "text-opacity") || 1;
              mlMap.setPaintProperty(
                layer.id,
                `icon-opacity`,
                (props.iconOpacity || 1) * existingIconOpacity
              );
              mlMap.setPaintProperty(
                layer.id,
                `text-opacity`,
                (props.textOpacity || 1) * existingTextOpacity
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
    // if (this.mapLibreMap) {
    //   const visibleFeatures = this.mapLibreMap.queryRenderedFeatures({
    //     layers: ["poi-images"],
    //   });
    //   const visibleFeatureCount = visibleFeatures.length;
    //   if (this.props.onViewMetaDataChanged) {
    //     this.props.onViewMetaDataChanged(visibleFeatureCount);
    //   }
    // }
  }
}

export default MaplibreGlLayer;
