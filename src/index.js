import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import L from 'leaflet';
import 'leaflet-toolbar';
import 'leaflet-toolbar/dist/leaflet.toolbar.css';
import { MappingConstants } from './lib';
import AnnotatedMap from './lib/components/AnnotatedMap';
import RoutedMap from './lib/components/RoutedMap';
const mapStyle = {
	height: window.innerHeight,
	cursor: 'crosshair'
};
let urlSearchParams = new URLSearchParams(window.location.href);

ReactDOM.render(
	<div>
		<div>Simple Map with Annotations</div>
		<br />

		<AnnotatedMap
			style={mapStyle}
			editable={true}
			snappingEnabled={true}
			key={'leafletRoutedMap'}
			referenceSystem={MappingConstants.crs25832}
			referenceSystemDefinition={MappingConstants.proj4crs25832def}
			layers=''
			doubleClickZoom={false}
			onclick={(e) => {
				console.log();
			}}
			ondblclick={(e) => {
				console.log();
			}}
			autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
			backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|_rvrSchrift@100'}
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
			mapReady={() => {}}
		>
			}
		</AnnotatedMap>
	</div>,
	document.getElementById('root')
);
