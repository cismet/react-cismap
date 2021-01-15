import React, { useState, useRef, useEffect } from 'react';
import { storiesCategory } from './StoriesConf';
import { RoutedMap, MappingConstants } from '../..';

export default {
	title: storiesCategory + 'WMS Backgrounds'
};

const mapStyle = {
	height: 600,
	cursor: 'pointer'
};

export const Simple = () => (
	<div>
		<div>Simple Map</div>
		<br />

		<RoutedMap
			editable={false}
			style={mapStyle}
			key={'leafletRoutedMap'}
			referenceSystem={MappingConstants.crs25832}
			referenceSystemDefinition={MappingConstants.proj4crs25832def}
			doubleClickZoom={false}
			onclick={(e) => console.log('click', e)}
			ondblclick={(e) => console.log('doubleclick', e)}
			backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
			fullScreenControlEnabled={false}
			locateControlEnabled={false}
			minZoom={7}
			maxZoom={18}
			zoomSnap={0.5}
			zoomDelta={0.5}
		/>
	</div>
);
export const WithTrueOrtho2018 = () => (
	<div>
		<div>With TrueOrtho2018</div>
		<br />

		<RoutedMap
			editable={false}
			style={mapStyle}
			key={'leafletRoutedMap'}
			referenceSystem={MappingConstants.crs25832}
			referenceSystemDefinition={MappingConstants.proj4crs25832def}
			doubleClickZoom={false}
			onclick={(e) => console.log('click', e)}
			ondblclick={(e) => console.log('doubleclick', e)}
			backgroundlayers={'trueOrtho2018@100'}
			fullScreenControlEnabled={false}
			locateControlEnabled={false}
			minZoom={7}
			maxZoom={18}
			zoomSnap={0.5}
			zoomDelta={0.5}
		/>
	</div>
);
export const WithTrueOrtho2020 = () => (
	<div>
		<div>With TrueOrtho2018</div>
		<br />

		<RoutedMap
			editable={false}
			style={mapStyle}
			key={'leafletRoutedMap'}
			referenceSystem={MappingConstants.crs25832}
			referenceSystemDefinition={MappingConstants.proj4crs25832def}
			doubleClickZoom={false}
			onclick={(e) => console.log('click', e)}
			ondblclick={(e) => console.log('doubleclick', e)}
			backgroundlayers={'trueOrtho2020@100'}
			fullScreenControlEnabled={false}
			locateControlEnabled={false}
			minZoom={7}
			maxZoom={18}
			zoomSnap={0.5}
			zoomDelta={0.5}
		/>
	</div>
);
export const WithSimulatedUrl = () => <h3>Coming Soon</h3>;
export const ManipulatingHashUrl = () => <h3>Coming Soon</h3>;
