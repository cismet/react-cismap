import React, { useContext } from "react";
import PropTypes from "prop-types";
import ProjGeoJson from "./ProjGeoJson";
import { convertFeatureCollectionToMarkerPositionCollection } from "./tools/mappingHelpers";
import { FeatureCollectionDisplayWithTooltipLabels } from ".";
import FeatureCollectionDisplay from "./FeatureCollectionDisplay";
import { TopicMapContext } from "./contexts/TopicMapContextProvider";
import useFilteredPointFeatureCollection from "./hooks/useFilteredPointFeatureCollection";
import { getClusterIconCreatorFunction } from "./tools/uiHelper";
import {
  FeatureCollectionContext,
  FeatureCollectionDispatchContext,
} from "./contexts/FeatureCollectionContextProvider";
import {
  TopicMapStylingContext,
  TopicMapStylingDispatchContext,
} from "./contexts/TopicMapStylingContextProvider";

// Since this component is simple and static, there's no parent container for it.
const FeatureCollection = (props) => {
  const {
    name,
    itemsUrl,
    itemLoader,
    caching,
    withMD5Check,
    convertItemToFeature,
    styler,
    featureHoverer,
    featureClickHandler = () => {},
    mapRef,
    selectionSpiderfyMinZoom,
    clusteringOptions,
    clusteringEnabled,
    showMarkerCollection = false,
    markerCollectionTransformation,
    markerStyle,
    editable = false,
    snappingGuides = false,
    customType,
    editModeStatusChanged,
    featureLabeler,
    featureKeySuffixGenerator = () => {},
    featureCollectionKeyPostfix,
    handleSelectionInternaly = true,
  } = props;
  const { routedMapRef, boundingBox } = useContext(TopicMapContext);
  const { markerSymbolSize } = useContext(TopicMapStylingContext);
  const {
    shownFeatures,
    clusteringOptions: clusteringOptionsFromContext,
    clusteringEnabled: clusteringEnabledFromContext,
    getFeatureStyler,
    getColorFromProperties,
  } = useContext(FeatureCollectionContext);

  const { setSelectedFeatureIndex } = useContext(FeatureCollectionDispatchContext);

  const _mapRef = mapRef || routedMapRef;

  let _style = getFeatureStyler(markerSymbolSize, getColorFromProperties);

  const _clusterOptions = {
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
    maxClusterRadius: 40,
    disableClusteringAtZoom: 19,
    animate: false,
    cismapZoomTillSpiderfy: 12,
    selectionSpiderfyMinZoom: 12,
    colorizer: (props) => props.color,
    clusterIconSize: 30,
    ...clusteringOptionsFromContext,
    ...clusteringOptions,
  };

  if (_clusterOptions.iconCreateFunction === undefined) {
    _clusterOptions.iconCreateFunction = getClusterIconCreatorFunction(
      _clusterOptions.clusterIconSize,
      _clusterOptions.colorizer
    );
  }
  let _clusteringEnabled = clusteringEnabled || clusteringEnabledFromContext;

  let getFeatureCollectionForData = () => {};

  const internalFeatureClickHandler = (event) => {
    const feature = event.sourceTarget.feature;
    if (handleSelectionInternaly === true) {
      setSelectedFeatureIndex(feature.index);
    }
    featureClickHandler(event);
  };

  let featureCollection = shownFeatures;

  if (props.featureLabeler) {
    return (
      <FeatureCollectionDisplayWithTooltipLabels
        key={
          JSON.stringify(featureCollection) +
          featureKeySuffixGenerator() +
          "clustered:" +
          _clusteringEnabled +
          ".customPostfix:" +
          featureCollectionKeyPostfix
        }
        featureCollection={featureCollection}
        boundingBox={boundingBox}
        clusterOptions={_clusterOptions}
        clusteringEnabled={_clusteringEnabled}
        style={_style}
        labeler={featureLabeler}
        hoverer={featureHoverer}
        featureClickHandler={internalFeatureClickHandler}
        mapRef={(_mapRef || {}).leafletMap}
      />
    );
  } else {
    return (
      <FeatureCollectionDisplay
        key={
          JSON.stringify(featureCollection) +
          featureKeySuffixGenerator() +
          "clustered:" +
          _clusteringEnabled +
          markerSymbolSize +
          ".customPostfix:" +
          featureCollectionKeyPostfix
        }
        featureCollection={featureCollection}
        boundingBox={boundingBox}
        clusteringEnabled={_clusteringEnabled}
        clusterOptions={_clusterOptions}
        style={_style}
        hoverer={featureHoverer}
        labeler={featureLabeler}
        featureStylerScalableImageSize={markerSymbolSize}
        featureClickHandler={internalFeatureClickHandler}
        mapRef={(_mapRef || {}).leafletMap}
        showMarkerCollection={showMarkerCollection}
        markerStyle={markerStyle}
      />
    );
  }
  return <div />;
};

export default FeatureCollection;
