import React, { useState, useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import EditControl from './NewPolygonControl';
import {
	RoutedMap,
	MappingConstants,
	LocateControl,
	FeatureCollectionDisplayWithTooltipLabels,
	FeatureCollectionDisplay
} from '../..';
import 'leaflet-editable';
import 'leaflet.path.drag';
import '@fortawesome/fontawesome-free/js/all.js';
import {
	kassenzeichen,
	flaechenStyle,
	getMarkerStyleFromFeatureConsideringSelection
} from './Editing.Storybook.data';

import L from 'leaflet';
storiesOf('EditControl', module)
	// .addDecorator(withInfo) // At your stories directly.
	.add('Simple Editing', () => {
		const mapStyle = {
			height: window.innerHeight,
			cursor: 'pointer'
		};
		let urlSearchParams = new URLSearchParams(window.location.href);

		return (
			<div>
				<div>Simple Polygon creation in cismap.React </div>

				<br />
				<RoutedMap
					style={mapStyle}
					editable={true}
					key={'leafletRoutedMap'}
					referenceSystem={MappingConstants.crs25832}
					referenceSystemDefinition={MappingConstants.proj4crs25832def}
					ref={(leafletMap) => {
						// this.leafletRoutedMap = leafletMap;
					}}
					layers=''
					doubleClickZoom={false}
					onclick={undefined /*(e) => console.log('click', e)*/}
					ondblclick={undefined /*(e) => /*console.log('doubleclick', e)*/}
					autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
					backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
					urlSearchParams={urlSearchParams}
					fullScreenControlEnabled={false}
					locateControlEnabled={false}
					minZoom={7}
					maxZoom={18}
					zoomSnap={0.5}
					zoomDelta={0.5}
				>
					<EditControl
						onSelect={action('onSelectAction')}
						onCreation={action('onCreationAction')}
					/>
				</RoutedMap>
			</div>
		);
	})
	.add('Edit GeoJson', () => {
		const mapStyle = {
			height: window.innerHeight,
			cursor: 'pointer'
		};
		let urlSearchParams = new URLSearchParams(window.location.href);

		return (
			<div>
				<div>Simple editing of a given GeoJSON with doubleclick </div>

				<br />
				<RoutedMap
					style={mapStyle}
					editable={true}
					key={'leafletRoutedMap'}
					referenceSystem={MappingConstants.crs25832}
					referenceSystemDefinition={MappingConstants.proj4crs25832def}
					ref={(leafletMap) => {
						// this.leafletRoutedMap = leafletMap;
					}}
					layers=''
					doubleClickZoom={false}
					onclick={undefined /*(e) => console.log('click', e)*/}
					ondblclick={undefined /*(e) => /*console.log('doubleclick', e)*/}
					autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
					backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
					urlSearchParams={urlSearchParams}
					fullScreenControlEnabled={false}
					locateControlEnabled={false}
					minZoom={7}
					maxZoom={18}
					zoomSnap={0.5}
					zoomDelta={0.5}
					fallbackZoom={15}
					fallbackPosition={{
						lat: 51.27278821188484,
						lng: 7.19929425724872
					}}
				>
					<FeatureCollectionDisplay
						editable={true}
						key={'ds'}
						featureCollection={kassenzeichen}
						boundingBox={{
							left: 343647.19856823067,
							top: 5695957.177980389,
							right: 398987.6070465423,
							bottom: 5652273.416315537
						}}
						style={flaechenStyle}
						showMarkerCollection={true}
						markerStyle={getMarkerStyleFromFeatureConsideringSelection}
					/>
				</RoutedMap>
			</div>
		);
	})
	.add('Simple Editing with GeoJson Background', () => {
		const mapStyle = {
			height: window.innerHeight,
			cursor: 'pointer'
		};
		const mapRef = useRef();

		let urlSearchParams = new URLSearchParams(window.location.href);
		const [ snappingLayers, setSnappingLayers ] = useState([]);
		return (
			<div>
				<div>Simple Annotation creation with a GeoJSON background in cismap.React </div>
				<br />
				<br />
				<button
					onClick={() => {
						console.log('map', mapRef.current.leafletMap.leafletElement._layers);
						const map = mapRef.current.leafletMap.leafletElement;
						var snap = new L.Handler.MarkerSnap(map);
						// var line = L.polyline([
						// 	[ 51.27278821188484, 7.19929425724872 ],
						// 	[ 51.37278821188484, 7.29929425724872 ]
						// ]).addTo(map);
						//snap.addGuideLayer(line);

						for (const lkey of Object.keys(map._layers)) {
							const l = map._layers[lkey];
							//console.log('l', l);

							if (l.customtype === 'ProjGeoJsonLayer') {
								snap.addGuideLayer(l);
								console.log('lxxx', l);
							}
						}

						var snapMarker = L.marker(map.getCenter(), {
							icon: map.editTools.createVertexIcon({
								className: 'leaflet-div-icon leaflet-drawing-icon'
							}),
							opacity: 1,
							zIndexOffset: 1000
						});
						snap.watchMarker(snapMarker);

						map.on('editable:vertex:dragstart', function(e) {
							snap.watchMarker(e.vertex);
						});
						map.on('editable:vertex:dragend', function(e) {
							snap.unwatchMarker(e.vertex);
						});
						map.on('editable:drawing:start', function() {
							this.on('mousemove', followMouse);
						});
						map.on('editable:drawing:end', function() {
							this.off('mousemove', followMouse);
							snapMarker.remove();
						});
						map.on('editable:drawing:click', function(e) {
							// Leaflet copy event data to another object when firing,
							// so the event object we have here is not the one fired by
							// Leaflet.Editable; it's not a deep copy though, so we can change
							// the other objects that have a reference here.
							var latlng = snapMarker.getLatLng();
							e.latlng.lat = latlng.lat;
							e.latlng.lng = latlng.lng;
						});
						snapMarker.on('snap', function(e) {
							snapMarker.addTo(map);
						});
						snapMarker.on('unsnap', function(e) {
							snapMarker.remove();
						});
						var followMouse = function(e) {
							snapMarker.setLatLng(e.latlng);
						};
					}}
				>
					Snapping
				</button>
				<br />
				<br />
				<RoutedMap
					style={mapStyle}
					editable={true}
					key={'leafletRoutedMap' + JSON.stringify(snappingLayers)}
					referenceSystem={MappingConstants.crs25832}
					referenceSystemDefinition={MappingConstants.proj4crs25832def}
					ref={mapRef}
					layers=''
					doubleClickZoom={false}
					onclick={undefined /*(e) => console.log('click', e)*/}
					ondblclick={undefined /*(e) => /*console.log('doubleclick', e)*/}
					autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
					backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
					urlSearchParams={urlSearchParams}
					fullScreenControlEnabled={false}
					locateControlEnabled={false}
					minZoom={7}
					maxZoom={18}
					zoomSnap={0.5}
					zoomDelta={0.5}
					fallbackZoom={15}
					fallbackPosition={{
						lat: 51.27278821188484,
						lng: 7.19929425724872
					}}
					snaplayersX={snappingLayers}
				>
					<EditControl
						onSelect={action('onSelectAction')}
						onCreation={action('onCreationAction')}
					/>
					<FeatureCollectionDisplay
						editable={false}
						key={'ds'}
						featureCollection={kassenzeichen}
						boundingBox={{
							left: 343647.19856823067,
							top: 5695957.177980389,
							right: 398987.6070465423,
							bottom: 5652273.416315537
						}}
						style={flaechenStyle}
						showMarkerCollection={true}
						markerStyle={getMarkerStyleFromFeatureConsideringSelection}
						reportForSnapping={(layer) => {
							const sl = snappingLayers;
							sl.push(layer);
							setSnappingLayers(sl);
						}}
					/>
				</RoutedMap>
			</div>
		);
	});
