import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ProjGeoJson from './ProjGeoJson';
import RoutedMap from './RoutedMap';
import FeatureCollectionDisplay from './FeatureCollectionDisplay';
import NewPolyControl from './editcontrols/NewPolygonControl';
import NewMarkerControl from './editcontrols/NewMarkerControl_';
import RemoveControl from './editcontrols/RemoveEditableObjectControl';
import { convertFeatureCollectionToMarkerPositionCollection } from '../tools/mappingHelpers';
import { convertPolygonLatLngsToGeoJson, projectionData } from '../tools/mappingHelpers';
import { reproject } from 'reproject';
import 'leaflet-editable';
import 'leaflet.path.drag';
import proj4 from 'proj4';
import '@fortawesome/fontawesome-free/js/all.js';
import L from 'leaflet';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import ExtraMarkers from 'leaflet-extra-markers';

// Since this component is simple and static, there's no parent container for it.
const Comp = (props) => {
	const { editable, allAnnotationsInEditModeOverride } = props;
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
		},
		{
			id: '1',
			type: 'Feature',
			properties: {},
			geometry: { type: 'Point', coordinates: [ 374343.0779387644, 5681734.414827559 ] },
			crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::25832' } }
		}
	]);

	useEffect(
		() => {
			console.log('annotations', annotations);

			const map = mapRef.current.leafletMap.leafletElement;
			for (const layerkey of Object.keys(map._layers)) {
				const layer = map._layers[layerkey];
				if (
					layer !== undefined &&
					layer.customType === 'annotation' &&
					layer.feature !== undefined
				) {
					if (layer.enableEdit !== undefined) {
						if (
							(layer.feature.inEditMode === true &&
								allAnnotationsInEditModeOverride === undefined) ||
							allAnnotationsInEditModeOverride === true
						) {
							layer.enableEdit();
							if (layer.feature.inEditMode !== true) {
								layer.feature.inEditMode = true;
								onFeatureChange(layer.feature);
							}
						} else {
							layer.disableEdit();
							if (layer.feature.inEditMode !== false) {
								layer.feature.inEditMode = false;
								onFeatureChange(layer.feature);
							}
						}
					}
				}
			}
		},
		[ annotations, allAnnotationsInEditModeOverride ]
	);

	const onFeatureCreation = (feature) => {
		setAnnotations((oldAnno) => {
			feature.id = oldAnno.length;
			return [ ...oldAnno, feature ];
		});
	};
	const onFeatureChange = (feature) => {
		setAnnotations((oldAnno) => {
			//feature.inEditMode = true;
			oldAnno[feature.id] = feature;
			return [ ...oldAnno ];
		});
	};

	return (
		<RoutedMap
			ref={mapRef}
			{...props}
			mapReady={(map) => {
				const createFeature = (id, layer) => {
					const wgs84geoJSON = layer.toGeoJSON();
					const reprojectedGeoJSON = reproject(
						wgs84geoJSON,
						proj4.WGS84,
						projectionData['25832'].def
					);
					// console.log('wgs84geoJSON', JSON.stringify(wgs84geoJSON));
					console.log('reprojectedGeoJSON', JSON.stringify(reprojectedGeoJSON));

					reprojectedGeoJSON.id = id;
					return reprojectedGeoJSON;
				};

				//moved whole object
				map.on('editable:dragend', (e) => {
					onFeatureChange(createFeature(e.layer.feature.id, e.layer));
				});

				//moved only the handles of an object
				map.on('editable:vertex:dragend', (e) => {
					onFeatureChange(createFeature(e.layer.feature.id, e.layer));
				});

				//created a new object
				map.on('editable:drawing:end', (e) => {
					const feature = createFeature(-1, e.layer);
					//if you wannt to keep the edit handles on just do
					// feature.inEditMode = true;

					onFeatureCreation(feature);
					{
						//switch off editing
						//e.layer.toggleEdit();
						// e.layer.on('dblclick', L.DomEvent.stop).on('dblclick', e.layer.toggleEdit);
						// e.layer.on('click', L.DomEvent.stop).on('click', () => {
						// 	console.log('e.layer', e);
						// 	props.onSelect(e.layer);
						// });
						//remove the object since it is stored in a feature collection
					}
					e.layer.remove();
				});
				map.on('editable:drawing:click', () => {
					console.log('click');
				});
			}}
		>
			{props.children}

			{editable && <NewPolyControl />}
			{editable && <NewMarkerControl />}
			{editable && <RemoveControl />}
			{editable && (
				<FeatureCollectionDisplay
					editable={true}
					snappingGuides={true}
					editModeStatusChanged={onFeatureChange}
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
						console.log('feature.inEditMode', feature.inEditMode);
						const currentColor = '#ffff00';

						const borderColor = '#990100';
						const fillColor = '#B90504';
						return {
							color: borderColor,
							radius: 8,
							weight: 2,
							opacity: 1.0,
							fillColor,
							fillOpacity: 0.6,
							className: 'annotation-' + feature.id,
							defaultMarker: true,
							customMarker: L.ExtraMarkers.icon({
								icon: feature.inEditMode === true ? 'fa-square' : undefined,
								markerColor: 'red',
								shape: 'circle',
								prefix: 'fa'
							})
						};
					}}
				/>
			)}
		</RoutedMap>
	);
};

export default Comp;
