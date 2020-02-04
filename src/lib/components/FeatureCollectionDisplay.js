import React from 'react';
import PropTypes from 'prop-types';
import ProjGeoJson from './ProjGeoJson';
import { convertFeatureCollectionToMarkerPositionCollection } from '../tools/mappingHelpers';

// Since this component is simple and static, there's no parent container for it.
const FeatureCollectionDisplay = ({
	featureCollection,
	boundingBox,
	style,
	hoverer,
	featureClickHandler,
	mapRef,
	selectionSpiderfyMinZoom,
	clusterOptions,
	clusteringEnabled,
	showMarkerCollection,
	markerCollectionTransformation,
	markerStyle,
	editable = false,
	snappingGuides = false
}) => {
	let markers;
	if (showMarkerCollection) {
		markers = (
			<ProjGeoJson
				key={
					'markers.' +
					JSON.stringify(featureCollection) +
					'.' +
					JSON.stringify(boundingBox)
				}
				featureCollection={markerCollectionTransformation(featureCollection, boundingBox)}
				clusteringEnabled={clusteringEnabled}
				clusterOptions={clusterOptions}
				style={markerStyle}
				featureClickHandler={featureClickHandler}
				mapRef={mapRef}
				selectionSpiderfyMinZoom={selectionSpiderfyMinZoom}
				snappingGuides={false}
			/>
		);
	}
	return (
		<div>
			<ProjGeoJson
				key={JSON.stringify(featureCollection) + '.' + JSON.stringify(boundingBox)}
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
			/>
			{markers}
		</div>
	);
};

export default FeatureCollectionDisplay;

FeatureCollectionDisplay.propTypes = {
	featureCollection: PropTypes.array.isRequired,
	boundingBox: PropTypes.object,
	clusteredMarkers: PropTypes.object,
	selectionSpiderfyMinZoom: PropTypes.number,
	style: PropTypes.func.isRequired,
	labeler: PropTypes.func,
	hoverer: PropTypes.func,
	featureClickHandler: PropTypes.func.isRequired,
	mapRef: PropTypes.object,
	clusterOptions: PropTypes.object,
	clusteringEnabled: PropTypes.bool,
	showMarkerCollection: PropTypes.bool,
	markerCollectionTransformation: PropTypes.func,
	markerStyle: PropTypes.func
};

FeatureCollectionDisplay.defaultProps = {
	featureCollection: [],
	selectionSpiderfyMinZoom: 7,
	style: () => {},
	// hoverer: () => {},
	featureClickHandler: () => {},
	clusterOptions: {},
	clusteringEnabled: false,
	showMarkerCollection: false,
	markerCollectionTransformation: convertFeatureCollectionToMarkerPositionCollection
};
