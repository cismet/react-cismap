import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ProjGeoJson from './ProjGeoJson';
import { convertFeatureCollectionToMarkerPositionCollection } from './tools/mappingHelpers';
import { FeatureCollectionDisplayWithTooltipLabels } from '.';
import FeatureCollectionDisplay from './FeatureCollectionDisplay';
import CismapContext from './contexts/CismapContext';
import useFilteredPointFeatureCollection from './hooks/useFilteredPointFeatureCollection';
import { getClusterIconCreatorFunction } from './tools/uiHelper';

// Since this component is simple and static, there's no parent container for it.
const FeatureCollection = (props) => {
	const {
		name,
		itemsUrl,
		itemLoader,
		caching,
		withMD5Check,
		convertItemToFeature,
		style,
		featureHoverer,
		featureClickHandler = () => {},
		mapRef,
		selectionSpiderfyMinZoom,
		clusterOptions,
		clusteringEnabled,
		showMarkerCollection,
		markerCollectionTransformation,
		markerStyle,
		editable = false,
		snappingGuides = false,
		customType,
		editModeStatusChanged,
		featureLabeler,
		featureKeySuffixGenerator = () => {},
		featureCollectionKeyPostfix,
		handleSelectionInternaly = true
	} = props;
	const cismapContext = useContext(CismapContext);
	const boundingBox = cismapContext.boundingBox;
	const _mapRef = mapRef || cismapContext.routedMapRef;

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
		...clusterOptions
	};

	if (_clusterOptions.iconCreateFunction === undefined) {
		_clusterOptions.iconCreateFunction = getClusterIconCreatorFunction(
			_clusterOptions.clusterIconSize,
			_clusterOptions.colorizer
		);
	}

	const [
		features,
		selectedFeature,
		setSelectedFeatureIndex
	] = useFilteredPointFeatureCollection({
		name,
		itemsUrl,
		itemLoader,
		caching,
		withMD5Check,
		convertItemToFeature,
		boundingBox
	});

	let getFeatureCollectionForData = () => {};

	const internalFeatureClickHandler = (event) => {
		const feature = event.sourceTarget.feature;
		console.log('xxx featureClick', feature);

		if (handleSelectionInternaly === true) {
			setSelectedFeatureIndex(feature.index);
		}
		featureClickHandler(event);
	};

	let featureCollection = features;

	if (props.featureLabeler) {
		return (
			<FeatureCollectionDisplayWithTooltipLabels
				key={
					JSON.stringify(featureCollection) +
					featureKeySuffixGenerator() +
					'clustered:' +
					clusteringEnabled +
					'.customPostfix:' +
					featureCollectionKeyPostfix
				}
				featureCollection={featureCollection}
				boundingBox={boundingBox || cismapContext.boundingBox}
				clusterOptions={_clusterOptions}
				clusteringEnabled={clusteringEnabled}
				style={style}
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
					'clustered:' +
					clusteringEnabled +
					'.customPostfix:' +
					featureCollectionKeyPostfix
				}
				featureCollection={featureCollection}
				boundingBox={boundingBox || cismapContext.boundingBox}
				clusteringEnabled={clusteringEnabled}
				clusterOptions={_clusterOptions}
				style={style}
				hoverer={featureHoverer}
				labeler={featureLabeler}
				featureStylerScalableImageSize={32}
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
