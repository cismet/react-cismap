import React from "react";
import PropTypes from "prop-types";
import { Map, ZoomControl } from "react-leaflet";
import "proj4leaflet";
import proj4 from "proj4";
import "url-search-params-polyfill";

import * as MappingConstants from "../constants/mapping";

import getLayersByNames from "../tools/layerFactory";

export class RoutedMap extends React.Component {
  constructor(props) {
    super(props);
    this.featureClick = this.featureClick.bind(this);
  }

  // add a handler for detecting map changes
  componentDidMount() {
    this.leafletMap.leafletElement.on("moveend", () => {
      if (typeof this.leafletMap !== "undefined" && this.leafletMap !== null) {
        const zoom = this.leafletMap.leafletElement.getZoom();
        const center = this.leafletMap.leafletElement.getCenter();
        const latFromUrl = parseFloat(this.props.urlSearchParams.get("lat"));
        const lngFromUrl = parseFloat(this.props.urlSearchParams.get("lng"));
        const zoomFromUrl = parseInt(this.props.urlSearchParams.get("zoom"), 10);
        let lat = center.lat;
        let lng = center.lng;
        if (Math.abs(latFromUrl - center.lat) < 0.000001) {
          lat = latFromUrl;
        }
        if (Math.abs(lngFromUrl - center.lng) < 0.000001) {
          lng = lngFromUrl;
        }

        if (lng !== lngFromUrl || lat !== latFromUrl || zoomFromUrl !== zoom) {
          this.props.locationChangedHandler({
            lat: lat,
            lng: lng,
            zoom: zoom
          });
        }
        this.storeBoundingBox(this.leafletMap);
      } else {
        //console.log("this.leafletMap is null");
      }
    });
    this.storeBoundingBox(this.leafletMap);
  }

  //Handle a autoFit Command if needed
  componentDidUpdate() {
    if (typeof this.leafletMap !== "undefined" && this.leafletMap != null) {
      if (this.props.autoFitConfiguration.autoFitBounds) {
        if (
          this.props.autoFitConfiguration.autoFitMode === MappingConstants.AUTO_FIT_MODE_NO_ZOOM_IN
        ) {
          if (
            !this.leafletMap.leafletElement
              .getBounds()
              .contains(this.props.autoFitConfiguration.autoFitBoundsTarget)
          ) {
            this.leafletMap.leafletElement.fitBounds(
              this.props.autoFitConfiguration.autoFitBoundsTarget
            );
          }
        } else {
          if (
            this.props.autoFitConfiguration.autoFitBoundsTarget &&
            this.props.autoFitConfiguration.autoFitBoundsTarget.isValid()
          ) {
            this.leafletMap.leafletElement.fitBounds(
              this.props.autoFitConfiguration.autoFitBoundsTarget
            );
          }
        }
        this.props.autoFitProcessedHandler();
      }
    }
  }

  storeBoundingBox(leafletMap) {
    //store the projected bounds in the store
    const bounds = leafletMap.leafletElement.getBounds();
    const projectedNE = proj4(proj4.defs("EPSG:4326"), this.props.referenceSystemDefinition, [
      bounds._northEast.lng,
      bounds._northEast.lat
    ]);
    const projectedSW = proj4(proj4.defs("EPSG:4326"), this.props.referenceSystemDefinition, [
      bounds._southWest.lng,
      bounds._southWest.lat
    ]);
    const bbox = {
      left: projectedSW[0],
      top: projectedNE[1],
      right: projectedNE[0],
      bottom: projectedSW[1]
    };
    //console.log(getPolygon(bbox));

    this.props.boundingBoxChangedHandler(bbox);
  }

  featureClick(event) {
    this.props.featureClickHandler(event);
  }

  render() {
    const positionByUrl = [
      parseFloat(this.props.urlSearchParams.get("lat")) || this.props.fallbackPosition.lat,
      parseFloat(this.props.urlSearchParams.get("lng")) || this.props.fallbackPosition.lng
    ];
    const zoomByUrl =
      parseInt(this.props.urlSearchParams.get("zoom"), 10) || this.props.fallbackZoom;

    return (
      <Map
        ref={leafletMap => {
          this.leafletMap = leafletMap;
        }}
        key={"leafletMap"}
        crs={this.props.referenceSystem}
        style={this.props.style}
        center={positionByUrl}
        zoom={zoomByUrl}
        zoomControl={false}
        attributionControl={false}
        doubleClickZoom={false}
        ondblclick={this.props.ondblclick}
        minZoom={7}
        maxZoom={18}
      >
        <ZoomControl position="topleft" zoomInTitle="Vergr&ouml;ßern" zoomOutTitle="Verkleinern" />
        {getLayersByNames(this.props.backgroundlayers, this.props.urlSearchParams)}
        {this.props.children}
      </Map>
    );
  }
}

RoutedMap.propTypes = {
  mapping: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  layers: PropTypes.string.isRequired,
  featureClickHandler: PropTypes.func,
  style: PropTypes.object.isRequired,
  ondblclick: PropTypes.func,
  children: PropTypes.array,
  locationChangedHandler: PropTypes.func,

  boundingBoxChangedHandler: PropTypes.func,

  autoFitConfiguration: PropTypes.object,
  autoFitProcessedHandler: PropTypes.func,
  urlSearchParams: PropTypes.object,
  fallbackPosition: PropTypes.object,
  fallbackZoom: PropTypes.number,
  referenceSystem: PropTypes.object,
  referenceSystemDefinition: PropTypes.object,
  backgroundlayers: PropTypes.string
};

RoutedMap.defaultProps = {
  layers: "",
  gazeteerHitTrigger: function() {},
  searchButtonTrigger: function() {},
  featureClickHandler: function() {},
  ondblclick: function() {},
  locationChangedHandler: function() {},
  autoFitConfiguration: {},
  urlSearchParams: new URLSearchParams(""),
  boundingBoxChangedHandler: () => {},
  autoFitProcessedHandler: () => {},
  fallbackPosition: {
    lat: 51.272399,
    lng: 7.199712
  },
  fallbackZoom: 14,
  referenceSystem: MappingConstants.crs25832,
  referenceSystemDefinition: MappingConstants.proj4crs25832def,
  backgroundlayers: "default"
};

export default RoutedMap;
