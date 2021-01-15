import React, { useState, useRef, useEffect } from 'react';
import { storiesCategory } from './StoriesConf';
import { RoutedMap, MappingConstants } from '../..';
import ProjGeoJson from '../../ProjGeoJson';
import { parkscheinautomaten, featureDefaults } from '../_data/Demo';
import { uwz } from '../_data/Demo';
import ProjSingleGeoJson from '../../ProjSingleGeoJson';
import { text, boolean, number, object } from '@storybook/addon-knobs';

export default {
	title: storiesCategory + 'ProjGeoJson'
};

const mapStyle = {
	height: 600,
	cursor: 'pointer'
};
console.log('parkscheinautomaten', parkscheinautomaten);

export const GeoJSONCollectionInTheMap = () => {
	const psas = [];
	for (let psa of parkscheinautomaten) {
		psa = { ...featureDefaults, ...psa };
		psas.push(psa);
	}
	let data = object('TestData', {});
	return (
		<div>
			<div>Simple Map with projected GeoJSON Collection</div>
			<div>(Hint: better use the FeatureCollectionDisplay)</div>

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
				backgroundlayers={'ruhrWMSlight@35'}
				fullScreenControlEnabled={false}
				locateControlEnabled={false}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
				fallbackPosition={{
					lat: 51.25921139902955,
					lng: 7.174172824023925
				}}
				fallbackZoom={9}
			>
				<ProjGeoJson
					style={(feature) => {
						return { radius: 10 };
					}}
					featureCollection={psas}
				/>
			</RoutedMap>
		</div>
	);
};

export const SingleGeoJSONInTheMap = () => {
	return (
		<div>
			<div>Simple Map with single projected GeoJSON </div>

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
				backgroundlayers={'ruhrWMSlight@35'}
				fullScreenControlEnabled={false}
				locateControlEnabled={false}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
				fallbackPosition={{
					lat: 51.232514081338664,
					lng: 7.079167379960522
				}}
				fallbackZoom={10}
			>
				<ProjSingleGeoJson
					masked={false}
					style={(feature) => {
						return { radius: 10 };
					}}
					geoJson={uwz[0]}
				/>
			</RoutedMap>
		</div>
	);
};

export const SingleInvertedGeoJSONInTheMap = () => {
	return (
		<div>
			<div>Simple Map with inverted single projected GeoJSON </div>

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
				backgroundlayers={'ruhrWMSlight@35'}
				fullScreenControlEnabled={false}
				locateControlEnabled={false}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
				fallbackPosition={{
					lat: 51.232514081338664,
					lng: 7.079167379960522
				}}
				fallbackZoom={10}
			>
				<ProjSingleGeoJson
					masked={true}
					style={(feature) => {
						return { radius: 10 };
					}}
					geoJson={uwz[0]}
				/>
			</RoutedMap>
		</div>
	);
};
