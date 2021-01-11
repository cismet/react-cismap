import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import L from 'leaflet';
import { MappingConstants } from './lib';
import AnnotatedMap from './lib/AnnotatedMap';
import RoutedMap from './lib/RoutedMap';
import NewPoly from './lib/editcontrols/NewPolygonControl';
import GazetteerSearchControl from './lib/GazetteerSearchControl';

const mapStyle = {
	height: window.innerHeight,
	cursor: 'crosshair'
};
let urlSearchParams = new URLSearchParams(window.location.href);

const projectedFC = L.Proj.geoJson(
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
);
console.log('projectedFC', projectedFC);

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
			<GazetteerSearchControl />
		</AnnotatedMap>
	</div>,
	document.getElementById('root')
);
