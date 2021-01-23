import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ProjGeoJson from './ProjGeoJson';
import { convertFeatureCollectionToMarkerPositionCollection } from './tools/mappingHelpers';
import { FeatureCollectionDisplayWithTooltipLabels } from '.';
import FeatureCollectionDisplay from './FeatureCollectionDisplay';
import CismapContext from './contexts/CismapContext';
import useFilteredPointFeatureCollection from './hooks/useFilteredPointFeatureCollection';

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
				clusterOptions={clusterOptions}
				clusteringEnabled={clusteringEnabled}
				style={style}
				labeler={featureLabeler}
				hoverer={featureHoverer}
				featureClickHandler={internalFeatureClickHandler}
				mapRef={(mapRef || {}).leafletMap}
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
				style={style}
				hoverer={featureHoverer}
				labeler={featureLabeler}
				featureStylerScalableImageSize={32}
				featureClickHandler={internalFeatureClickHandler}
				mapRef={(mapRef || {}).leafletMap}
				showMarkerCollection={showMarkerCollection}
				markerStyle={markerStyle}
				clusterOptions={clusterOptions}
			/>
		);
	}
	return <div />;
};

export default FeatureCollection;
