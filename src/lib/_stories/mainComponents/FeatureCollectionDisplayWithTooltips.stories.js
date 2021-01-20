import React, { useState, useRef, useEffect } from 'react';
import { storiesCategory } from './StoriesConf';
import {
	RoutedMap,
	MappingConstants,
	FeatureCollectionDisplay,
	FeatureCollectionDisplayWithTooltipLabels
} from '../..';
import { parkscheinautomaten, featureDefaults } from '../_data/Demo';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowIconPng from 'leaflet/dist/images/marker-shadow.png';
export default {
	title: storiesCategory + 'FeatureCollectionDisplayWithTooltips'
};
import { Icon } from 'leaflet';
const mapStyle = {
	height: 600,
	cursor: 'pointer'
};

export const Simple = () => {
	const psas = [];
	let i = 0;
	for (let psa of parkscheinautomaten) {
		psa = { ...featureDefaults, ...psa };
		psa.id = i++;
		psas.push(psa);
	}

	return (
		<div>
			<h5>Simple Map with projected FeatureCollectionDisplayWithTooltipLabels</h5>
			<div>
				We used Tooltips in this component to show alphanumerical information. While it is
				ok for polygons, it is a little bit tricky for points. better use{' '}
				<code>FeatureCollectionDisplay</code> to show a FeatureCollection
			</div>

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
				<FeatureCollectionDisplayWithTooltipLabels
					style={(feature) => {
						return {
							radius: 2,
							customMarker: new Icon({
								iconUrl: markerIconPng,
								shadowUrl: markerShadowIconPng,
								iconSize: [ 25, 41 ],
								iconAnchor: [ 12, 41 ]
							})
						};
					}}
					boundingBox={{
						left: 343647.19856823067,
						top: 5695957.177980389,
						right: 398987.6070465423,
						bottom: 5652273.416315537
					}}
					labeler={(feature) => {
						// console.log('feature labeler', feature);

						return (
							<h3
								style={{
									color: '#111111',
									fontSize: 20,
									opacity: 0.7,
									paddingLeft: 15
								}}
							>
								{feature.text}
							</h3>
						);
					}}
					hoverer={(feature) => {
						return feature.text;
					}}
					featureCollection={psas}
				/>
			</RoutedMap>
		</div>
	);
};
