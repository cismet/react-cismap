import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import { withKnobs, text, boolean, number, select } from '@storybook/addon-knobs';
import 'leaflet-editable';
import 'leaflet.path.drag';
import { MappingConstants, FeatureCollectionDisplay } from '../';
import AnnotatedMap from './AnnotatedMap';
import {
	kassenzeichen,
	flaechenStyle,
	getMarkerStyleFromFeatureConsideringSelection
} from './editcontrols/Editing.Storybook.data';
import L from 'leaflet';

const stories = storiesOf('AnnotatedMap', module).add('Simple', () => {
	const mapStyle = {
		height: window.innerHeight - 100,
		cursor: 'pointer',
		clear: 'both'
	};

	const allAnnotationsInEditModeOverride = select(
		'allAnnotationsInEditModeOverride',
		{
			true: true,
			false: false,
			undefined: undefined
		},
		undefined
	);
	const editableAnnotations = boolean('Editable', true);
	const snappingEnabled = boolean('Snapping', true);
	let urlSearchParams = new URLSearchParams(window.location.href);

	return (
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
stories.addDecorator((story, context) => withInfo('common info')(story)(context));
stories.addDecorator(withKnobs);
// stories.addDecorator(withInfo);
