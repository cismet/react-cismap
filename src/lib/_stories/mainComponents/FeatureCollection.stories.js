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
	title: storiesCategory + 'FeatureCollectionDisplay'
};
import { Icon } from 'leaflet';
const mapStyle = {
	height: 600,
	cursor: 'pointer'
};
const psas = [];
for (let psa of parkscheinautomaten) {
	psa = { ...featureDefaults, ...psa };
	psas.push(psa);
}
export const Points = () => {
	return (
		<div>
			<div>Simple Map with projected FeatureCollectionDisplay</div>

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
				<FeatureCollectionDisplay
					style={(feature) => {
						return { radius: 15 };
					}}
					featureCollection={psas}
					showMarkerCollection={true}
					hoverer={(feature) => {
						return feature.text;
					}}
					markerStyle={(feature) => {
						let opacity = 0.6;
						let linecolor = '#000000';
						let weight = 1;

						const style = {
							radius: 2,
							color: linecolor,
							weight: weight,
							opacity: 1.0,
							fillOpacity: opacity,
							svgSize: 100,
							className:
								'classNameForMarkerToAvoidDoubleSVGclassbehaviour-' + feature.text,
							svg: `<svg height="100" width="100">
							<style>
								.flaeche { font: bold 12px sans-serif; }
							</style>
					
							<text 
								x="50" y="50" 
								class="flaeche" 
								text-anchor="middle" 
								alignment-baseline="central" 
								fill="#0B486B">${feature.text}</text>
						  </svg>`
						};

						return style;
					}}
				/>
			</RoutedMap>
		</div>
	);
};

export const ClusteringWithDefaultOptions = () => {
	return (
		<div>
			<div>Simple Map with projected FeatureCollectionDisplay</div>

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
				<FeatureCollectionDisplay
					clusteringEnabled={true}
					style={(feature) => {
						return { radius: 15 };
					}}
					featureCollection={psas}
					showMarkerCollection={true}
					hoverer={(feature) => {
						return feature.text;
					}}
					markerStyle={(feature) => {
						let opacity = 0.6;
						let linecolor = '#000000';
						let weight = 1;

						const style = {
							radius: 2,
							color: linecolor,
							weight: weight,
							opacity: 1.0,
							fillOpacity: opacity,
							svgSize: 100,
							className:
								'classNameForMarkerToAvoidDoubleSVGclassbehaviour-' + feature.text,
							svg: `<svg height="100" width="100">
							<style>
								.flaeche { font: bold 12px sans-serif; }
							</style>
					
							<text 
								x="50" y="50" 
								class="flaeche" 
								text-anchor="middle" 
								alignment-baseline="central" 
								fill="#0B486B">${feature.text}</text>
						  </svg>`
						};

						return style;
					}}
				/>
			</RoutedMap>
		</div>
	);
};

export const ClusteringWithCircles = (args) => {
	const mapRef = useRef(null);
	const clusterOptions = args;
	console.log('mapRef', mapRef);

	return (
		<div>
			<RoutedMap
				ref={mapRef}
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
				<FeatureCollectionDisplay
					key={'FeatureCollectionDisplay' + JSON.stringify(clusterOptions)}
					clusteringEnabled={true}
					clusterOptions={clusterOptions}
					selectionSpiderfyMinZoom={clusterOptions.selectionSpiderfyMinZoom}
					style={(feature) => {
						return { radius: 15 };
					}}
					mapRef={(mapRef.current || {}).leafletMap}
					featureCollection={psas}
					showMarkerCollection={true}
					hoverer={(feature) => {
						return feature.text + '----';
					}}
					markerStyle={(feature) => {
						let opacity = 0.6;
						let linecolor = '#000000';
						let weight = 1;

						const style = {
							radius: 2,
							color: linecolor,
							weight: weight,
							opacity: 1.0,
							fillOpacity: opacity,
							svgSize: 100,
							className:
								'classNameForMarkerToAvoidDoubleSVGclassbehaviour-' + feature.text,
							svg: `<svg height="100" width="100">
							<style>
								.flaeche { font: bold 12px sans-serif; }
							</style>
					
							<text 
								x="50" y="50" 
								class="flaeche" 
								text-anchor="middle" 
								alignment-baseline="central" 
								fill="#0B486B">${feature.text}</text>
						  </svg>`
						};

						return style;
					}}
				/>
			</RoutedMap>
		</div>
	);
};
ClusteringWithCircles.args = {
	spiderfyOnMaxZoom: true,
	spiderfyDistanceMultiplier: 1.4,
	showCoverageOnHover: false,
	zoomToBoundsOnClick: true,
	maxClusterRadius: 40,
	disableClusteringAtZoom: 19,
	animate: true,
	cismapZoomTillSpiderfy: 12,
	selectionSpiderfyMinZoom: 12
};

ClusteringWithCircles.argTypes = {
	spiderfyDistanceMultiplier: {
		control: {
			type: 'range',
			min: 0.7,
			max: 3,
			step: 0.1
		}
	},
	maxClusterRadius: {
		control: {
			type: 'range',
			min: 1,
			max: 100,
			step: 1
		}
	},
	disableClusteringAtZoom: {
		control: {
			type: 'range',
			min: 5,
			max: 20,
			step: 1
		}
	},
	cismapZoomTillSpiderfy: {
		control: {
			type: 'range',
			min: 4,
			max: 20,
			step: 1
		}
	},
	selectionSpiderfyMinZoom: {
		control: {
			type: 'range',
			min: 4,
			max: 20,
			step: 1
		}
	}
};
