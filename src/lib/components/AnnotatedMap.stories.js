import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { AnnotatedMap, MappingConstants, FeatureCollectionDisplay } from '../../lib';

import {
	kassenzeichen,
	flaechenStyle,
	getMarkerStyleFromFeatureConsideringSelection
} from './editcontrols/Editing.Storybook.data';

storiesOf('AnnotatedMap', module)
	// .addDecorator(withInfo) // At your stories directly.
	.add('Simple', () => {
		const mapStyle = {
			height: window.innerHeight - 100,
			cursor: 'pointer',
			clear: 'both'
		};

		let urlSearchParams = new URLSearchParams('');

		return (
			<div>
				<div>Simple Map</div>
				<br />

				<AnnotatedMap
					style={mapStyle}
					editable={true}
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
				>
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
				</AnnotatedMap>
			</div>
		);
	});
