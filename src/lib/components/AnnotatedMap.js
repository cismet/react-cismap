import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ProjGeoJson from './ProjGeoJson';
import RoutedMap from './RoutedMap';
import FeatureCollectionDisplay from './FeatureCollectionDisplay';
import EditControl from './editcontrols/NewPolygonControl';
import { convertFeatureCollectionToMarkerPositionCollection } from '../tools/mappingHelpers';

import 'leaflet-editable';
import 'leaflet.path.drag';
import '@fortawesome/fontawesome-free/js/all.js';
import L from 'leaflet';

// Since this component is simple and static, there's no parent container for it.
const Comp = (props) => {
	const [ featuresInActiveEditMode, setFeaturesInActiveEditMode ] = useState([]);
	const mapRef = useRef(null);
	const [ annotations, setAnnotations ] = useState([
		{
			id: '0',
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[ 374416.4917460493, 5681678.77451399 ],
						[ 374424.0583561766, 5681656.480910968 ],
						[ 374423.78805617616, 5681656.3790162485 ],
						[ 374424.4986653592, 5681654.551878816 ],
						[ 374448.3470422178, 5681665.694086005 ],
						[ 374444.01502615237, 5681677.02827118 ],
						[ 374441.8727188524, 5681682.35892816 ],
						[ 374434.4588803425, 5681685.415413512 ],
						[ 374430.287606105, 5681684.2131442875 ],
						[ 374422.97658758296, 5681681.326124269 ]
					]
				]
			},
			crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::25832' } },
			properties: {}
		}
	]);

	useEffect(
		() => {
			const map = mapRef.current.leafletMap.leafletElement;
			for (const layerkey of Object.keys(map._layers)) {
				const layer = map._layers[layerkey];
				if (
					layer.customType === 'annotation' &&
					layer.feature !== undefined &&
					layer.feature.inEditMode === true
				) {
					layer.enableEdit();
				}
			}
		},
		[ annotations ]
	);

	return (
		<RoutedMap ref={mapRef} {...props}>
			{props.children}
			<EditControl
				onSelect={(e) => {
					console.log('onSelect', e);
				}}
				onFeatureCreation={(feature) => {
					setAnnotations((oldAnno) => {
						feature.id = oldAnno.length;
						return [ ...oldAnno, feature ];
					});
				}}
				onFeatureChange={(feature) => {
					setAnnotations((oldAnno) => {
						feature.inEditMode = true;
						oldAnno[feature.id] = feature;
						return [ ...oldAnno ];
					});
				}}
			/>
			<FeatureCollectionDisplay
				editable={true}
				snappingGuides={true}
				customType='annotation'
				key={'annotation'}
				featureCollection={annotations}
				boundingBox={{
					left: 343647.19856823067,
					top: 5695957.177980389,
					right: 398987.6070465423,
					bottom: 5652273.416315537
				}}
				style={(feature) => {
					return {
						color: '#990100',
						weight: 2,
						opacity: 1.0,
						fillColor: '#B90504',
						fillOpacity: 0.6,
						className: 'annotation-' + feature.id
					};
				}}
			/>
		</RoutedMap>
	);
};

export default Comp;
