import React, { useState, useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import NewPoly from './NewPolygonControl';
import {
	RoutedMap,
	MappingConstants,
	LocateControl,
	FeatureCollectionDisplayWithTooltipLabels,
	FeatureCollectionDisplay
} from '../../index';
import 'leaflet-editable';
import 'leaflet.path.drag';
import '@fortawesome/fontawesome-free/js/all.js';
import {
	kassenzeichen,
	flaechenStyle,
	getMarkerStyleFromFeatureConsideringSelection
} from './Editing.Storybook.data';
import { convertPolygonLatLngsToGeoJson } from '../../tools/mappingHelpers';

import L from 'leaflet';

storiesOf('Deprecated/EditControl', module)
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
					<NewPoly
						tooltip='neues Polygon anlegen'
						onSelect={() => {
							console.log('onSelect');
						}}
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
	.add('Simple Editing with GeoJson Background ', () => {
		const mapStyle = {
			height: window.innerHeight,
			cursor: 'pointer'
		};
		const mapRef = useRef();

		let urlSearchParams = new URLSearchParams(window.location.href);
		const [ snappingLayers, setSnappingLayers ] = useState([]);
		const [ annotations, setAnnotations ] = useState([]);
		console.log('annotations annotations', annotations);

		return (
			<div>
				<div>
					Simple Annotation creation with a GeoJSON background ({kassenzeichen.length}{' '}
					features) in cismap.React{' '}
				</div>
				<br />
				<br />
				<button
					onClick={() => {
						const map = mapRef.current.leafletMap.leafletElement;

						const snap = mapRef.current.snap;
						console.log('mapRef.current.leafletMap', snap);

						// const line = L.polyline([
						// 	[ 51.27278821188484, 7.19929425724872 ],
						// 	[ 51.37278821188484, 7.29929425724872 ]
						// ]).addTo(map);
						// snap.addGuideLayer(line);

						let guideCount = 0;
						for (const lkey of Object.keys(map._layers)) {
							const l = map._layers[lkey];
							//console.log('l', l);

							if (l.snappingGuide === true) {
								snap.addGuideLayer(l);
								console.log('snapLayer', l);

								guideCount++;
							}
						}
						console.log('Added ' + guideCount + ' guides.');
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
				>
					<NewPoly
						onSelect={(e) => {
							action('onSelectAction')(e);
							const x = {
								id: '-1',
								latlngs: e.getLatLngs(),
								properties: {}
							};
							const f = convertPolygonLatLngsToGeoJson(x);
							const aFC = annotations;
							annotations.push(f);
							setAnnotations(aFC);
							console.log('event on select', f);
							console.log('annotations', annotations, JSON.stringify(annotations));
						}}
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
						snappingGuides={true}
					/>
					<FeatureCollectionDisplay
						editable={false}
						key={'ds+' + JSON.stringify(annotations)}
						featureCollection={annotations}
						boundingBox={{
							left: 343647.19856823067,
							top: 5695957.177980389,
							right: 398987.6070465423,
							bottom: 5652273.416315537
						}}
						showMarkerCollection={false}
					/>
				</RoutedMap>
			</div>
		);
	});
