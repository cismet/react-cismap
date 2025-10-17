import React from "react";
import PropTypes from "prop-types";
import ProjGeoJson from "./ProjGeoJson";
import { convertFeatureCollectionToMarkerPositionCollection } from "./tools/mappingHelpers";

// Since this component is simple and static, there's no parent container for it.
const FeatureCollectionDisplay = ({
  featureCollection = [],
  boundingBox,
  style = () => {},
  hoverer,
  featureClickHandler,
  mapRef,
  clusterOptions = {},
  clusteringEnabled = false,
  showMarkerCollection,
  markerCollectionTransformation = convertFeatureCollectionToMarkerPositionCollection,
  markerStyle,
  editable = false,
  snappingGuides = false,
  customType,
  editModeStatusChanged,
  featureStylerScalableImageSize,
  pane,
  className,
}) => {
  let selectionSpiderfyMinZoom = clusterOptions.selectionSpiderfyMinZoom;

  let markers;
  if (showMarkerCollection) {
    markers = (
      <ProjGeoJson
        key={"markers." + JSON.stringify(featureCollection) + "." + JSON.stringify(boundingBox)}
        featureCollection={markerCollectionTransformation(featureCollection, boundingBox)}
        clusteringEnabled={clusteringEnabled}
        clusterOptions={clusterOptions}
        style={markerStyle}
        featureClickHandler={featureClickHandler}
        mapRef={mapRef}
        selectionSpiderfyMinZoom={selectionSpiderfyMinZoom}
        snappingGuides={false}
        customType={customType}
        pane={pane}
        className={className ? className + "-markers" : undefined}
      />
    );
  }
  return (
    <div>
      <ProjGeoJson
        key={JSON.stringify(featureCollection) + "." + JSON.stringify(boundingBox)}
        featureCollection={featureCollection}
        clusteringEnabled={clusteringEnabled}
        clusterOptions={clusterOptions}
        hoverer={hoverer}
        style={style}
        featureClickHandler={featureClickHandler}
        mapRef={mapRef}
        selectionSpiderfyMinZoom={selectionSpiderfyMinZoom}
        editable={editable}
        snappingGuides={snappingGuides}
        customType={customType}
        editModeStatusChanged={editModeStatusChanged}
        featureStylerScalableImageSize={featureStylerScalableImageSize}
        pane={pane}
        className={className}
      />
      {markers}
    </div>
  );
};

export default FeatureCollectionDisplay;

FeatureCollectionDisplay.propTypes = {
  featureCollection: PropTypes.array.isRequired,
  boundingBox: PropTypes.object,
  style: PropTypes.func,
  hoverer: PropTypes.func,
  featureClickHandler: PropTypes.func,
  selectionSpiderfyMinZoom: PropTypes.number,
  clusterOptions: PropTypes.object,
  clusteringEnabled: PropTypes.bool,
  markerStyle: PropTypes.func,
  customType: PropTypes.string,
  markerCollectionTransformation: PropTypes.func,
};
