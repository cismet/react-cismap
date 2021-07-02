import "@fortawesome/fontawesome-free/js/all.js";
import "leaflet-editable";
import "leaflet-extra-markers/";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-geometryutil";
import "leaflet-snap";
import "leaflet.path.drag";
import proj4 from "proj4";
import "proj4leaflet";
import PropTypes from "prop-types";
import React from "react";
import { Map } from "react-leaflet";
import { reproject } from "reproject";
import "url-search-params-polyfill";
import * as MappingConstants from "../../constants/gis";
import { projectionData } from "../../constants/gis";

export class RoutedMap extends React.Component {
  constructor(props) {
    super(props);
  }

  // add a handler for detecting map changes
  componentDidMount() {
    const leafletMap = this.leafletMap;

    const map = leafletMap.leafletElement;

    const panes = [];
    // <Pane name="backgroundvectorLayers" style={{ zIndex: 90 }}></Pane>
    // <Pane name="backgroundLayers" style={{ zIndex: 100 }} />
    // <Pane name="additionalLayers" style={{ zIndex: 150 }} />
    // <Pane name="backgroundlayerTooltips" style={{ zIndex: 250 }} />
    // <Pane name="featurecollection" style={{ zIndex: 600 }} />

    map.createPane("backgroundvectorLayers");
    map.getPane("backgroundvectorLayers").style.zIndex = 90;

    map.createPane("backgroundLayers");
    map.getPane("backgroundLayers").style.zIndex = 100;

    map.createPane("additionalLayers0");
    map.getPane("additionalLayers0").style.zIndex = 250;
    map.createPane("additionalLayers1");
    map.getPane("additionalLayers1").style.zIndex = 250;
    map.createPane("additionalLayers2");
    map.getPane("additionalLayers2").style.zIndex = 250;

    map.createPane("backgroundlayerTooltips");
    map.getPane("backgroundlayerTooltips").style.zIndex = 550;

    map.editable = this.props.editable;
  }

  //Handle a autoFit Command if needed
  componentDidUpdate() {}

  render() {
    return (
      <div>
        <Map
          ref={(leafletMap) => {
            this.leafletMap = leafletMap;
          }}
          editable={false}
          key={"leafletPreviewMap"}
          crs={this.props.referenceSystem}
          style={this.props.style}
          center={this.props.center}
          zoom={this.props.zoom}
          minZoom={this.props.zoom}
          maxZoom={this.props.zoom}
          zoomControl={false}
          doubleClickZoom={false}
        >
          {this.props.children}
        </Map>
      </div>
    );
  }
}

RoutedMap.propTypes = {
  mapping: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  layers: PropTypes.string.isRequired,
  layerKeyPostfix: PropTypes.string,
  featureClickHandler: PropTypes.func,
  style: PropTypes.object.isRequired,
  ondblclick: PropTypes.func,
  onclick: PropTypes.func,
  children: PropTypes.array,
  locationChangedHandler: PropTypes.func,
  boundingBoxChangedHandler: PropTypes.func, //gets called with the projected boundingbox
  autoFitConfiguration: PropTypes.object,
  autoFitProcessedHandler: PropTypes.func,
  urlSearchParams: PropTypes.object,
  fallbackPosition: PropTypes.object,
  fallbackZoom: PropTypes.number,
  referenceSystem: PropTypes.object,
  referenceSystemDefinition: PropTypes.string,
  backgroundlayers: PropTypes.string,
  fullScreenControlEnabled: PropTypes.bool,
  locateControlEnabled: PropTypes.bool,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  zoomSnap: PropTypes.number,
  zoomDelta: PropTypes.number,
  editable: PropTypes.bool,
  mapReady: PropTypes.func,
  onFeatureCreation: PropTypes.func,
  onFeatureChangeAfterEditing: PropTypes.func,
  createFeatureFromEditLayer: PropTypes.func,
  attributionControl: PropTypes.bool,
};

RoutedMap.defaultProps = {
  layers: "",
  gazeteerHitTrigger: function () {},
  searchButtonTrigger: function () {},
  featureClickHandler: function () {},
  onFeatureCreation: function () {},
  onFeatureChangeAfterEditing: function () {},
  ondblclick: function () {},
  onclick: function () {},
  locationChangedHandler: function () {},
  autoFitConfiguration: {},
  urlSearchParams: new URLSearchParams(""),
  boundingBoxChangedHandler: () => {},
  autoFitProcessedHandler: () => {},
  fallbackPosition: {
    lat: 51.272399,
    lng: 7.199712,
  },
  fallbackZoom: 14,
  referenceSystem: MappingConstants.crs25832,
  referenceSystemDefinition: MappingConstants.proj4crs25832def,
  backgroundlayers: "default",
  minZoom: 7,
  maxZoom: 18,
  zoomSnap: 1,
  zoomDelta: 1,
  editable: false,
  attributionControl: false,
  mapReady: (map) => {},
  createFeatureFromEditLayer: (id, layer) => {
    try {
      const wgs84geoJSON = layer.toGeoJSON();
      const reprojectedGeoJSON = reproject(wgs84geoJSON, proj4.WGS84, projectionData["25832"].def);
      console.log("reprojectedGeoJSON", JSON.stringify(reprojectedGeoJSON));

      reprojectedGeoJSON.id = id;
      return reprojectedGeoJSON;
    } catch (e) {
      console.log("excepotion in create feature", e);
      return undefined;
    }
  },
};

export default RoutedMap;
