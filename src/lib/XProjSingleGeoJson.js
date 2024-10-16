import L from "leaflet";
import { isFunction } from "lodash";
import PropTypes from "prop-types";
import "proj4leaflet";

import { Path } from "react-leaflet";

import Terraformer from "terraformer-wkt-parser";

import "react-leaflet-markercluster/dist/styles.min.css";

export class ProjSingleGeoJson extends Path {
  componentWillMount() {
    super.componentWillMount();
    const { geoJson, ...props } = this.props;

    props.onEachFeature = function (feature, layer) {
      //TODO set a offset so that the Tooltip is shown in the current map
      layer._leaflet_id = feature.id;
      layer.feature = feature;
      if (props.featureClickHandler) {
        layer.on("click", props.featureClickHandler);
      }
    };
    let geojson;
    if (props.masked === true) {
      const big = Terraformer.parse(this.props.maskingPolygon);
      const geoJsonIverted = JSON.parse(JSON.stringify(geoJson));
      const polyCoords = geoJsonIverted.geometry.coordinates[0];
      const bigCoords = big.coordinates[0];
      geoJsonIverted.geometry.coordinates = [bigCoords, polyCoords];
      geojson = L.Proj.geoJson(geoJsonIverted, props);
    } else {
      geojson = L.Proj.geoJson(geoJson, props);
    }
    this.leafletElement = geojson;
  }

  createLeafletElement() {}

  componentDidUpdate(prevProps) {
    if (isFunction(this.props.style)) {
      this.setStyle(this.props.style);
    } else {
      this.setStyleIfChanged(prevProps, this.props);
    }
  }

  render() {
    return super.render();
  }
}

export default ProjSingleGeoJson;

ProjSingleGeoJson.propTypes = {
  geoJson: PropTypes.object.isRequired,
  masked: PropTypes.bool,
  maskingPolygon: PropTypes.string,
  style: PropTypes.func,
  mapRef: PropTypes.object.isRequired,
};
ProjSingleGeoJson.defaultProps = {
  masked: false,
  maskingPolygon:
    "POLYGON((292872.70820260537 5734812.567828996,454766.33411074313 5734812.567828996,454766.33411074313 5622450.136249692,292872.70820260537 5622450.136249692,292872.70820260537 5734812.567828996))",
  style: (feature) => {
    const style = {
      color: "black",
      weight: 3,
      opacity: 0.6,
      fillColor: "black",
      fillOpacity: 0.2,
    };
    return style;
  },
};
