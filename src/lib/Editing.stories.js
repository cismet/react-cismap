import React, { useEffect, useRef, useState } from 'react';
import { storiesOf } from '@storybook/react';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import L from 'leaflet';
import 'leaflet-editable';
import 'leaflet.path.drag';
import { RoutedMap, MappingConstants } from './index';
import NewMarkerControl from './editcontrols/NewMarkerControl';
import NewPolyControl from './editcontrols/NewPolygonControl';
import RemoveControl from './editcontrols/RemoveEditableObjectControl';
import FeatureCollectionDisplay from './FeatureCollectionDisplay';

storiesOf('Deprecated/Editing', module)
	// .addDecorator(withInfo) // At your stories directly.
	.add('Simple+', () => {
		return React.createElement(() => {
			const mapStyle = {
				height: window.innerHeight - 100,
				cursor: 'pointer',
				clear: 'both'
			};
			const editable = true,
				allAnnotationsInEditModeOverride = undefined;
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
					geometry: {
						type: 'Point',
						coordinates: [ 374343.0779387644, 5681734.414827559 ]
					},
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
				<div>
					<RoutedMap
						ref={mapRef}
						editable={true}
						style={mapStyle}
						key={'leafletRoutedMap'}
						referenceSystem={MappingConstants.crs25832}
						referenceSystemDefinition={MappingConstants.proj4crs25832def}
						layers=''
						doubleClickZoom={false}
						onclick={(e) => console.log('click', e)}
						ondblclick={(e) => console.log('doubleclick', e)}
						backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10'}
						fullScreenControlEnabled={false}
						locateControlEnabled={false}
						minZoom={7}
						maxZoom={18}
						zoomSnap={0.5}
						zoomDelta={0.5}
					>
						{editable && <NewPolyControl />}
						{editable && <NewMarkerControl />}
						{editable && <RemoveControl />}
						{true && (
							<FeatureCollectionDisplay
								editable={true}
								//snappingGuides={true}
								//editModeStatusChanged={onFeatureChange}
								customType='annotation'
								key={'annotations_' + JSON.stringify(annotations)}
								featureCollection={annotations}
								boundingBox={{
									left: 343647.19856823067,
									top: 5695957.177980389,
									right: 398987.6070465423,
									bottom: 5652273.416315537
								}}
								featureClickHandler={(event, feature) => {
									// console.log('click', event, feature);
									// if (feature.selected === undefined || feature.selected === false) {
									// 	feature.selected = true;
									// } else {
									// 	feature.selected = false;
									// }
									// onFeatureChange(feature);
								}}
								style={(feature) => {
									console.log('style feature', feature);
									const currentColor = '#ffff00';

									let opacity,
										lineColor,
										fillColor = '#B90504',
										markerColor,
										weight = 2;

									if (feature.selected === true) {
										opacity = 0.9;
										lineColor = '#0C7D9D';
										markerColor = 'blue';
									} else {
										opacity = 1;
										lineColor = '#990100';
										markerColor = 'red';
									}

									return {
										color: lineColor,
										radius: 8,
										weight,
										opacity,
										fillColor,
										fillOpacity: 0.6,
										className: 'annotation-' + feature.id,
										defaultMarker: true,
										customMarker: L.ExtraMarkers.icon({
											icon:
												feature.inEditMode === true
													? 'fa-square'
													: undefined,
											markerColor,
											shape: 'circle',
											prefix: 'fa'
										})
									};
								}}
							/>
						)}
					</RoutedMap>
				</div>
			);
		});
	});
