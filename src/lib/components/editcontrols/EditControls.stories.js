import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import EditControl from './NewPolygonControl';
import { RoutedMap, MappingConstants, LocateControl } from '../..';
import 'leaflet-editable';
import 'leaflet.path.drag';
import '@fortawesome/fontawesome-free/js/all.js';

storiesOf('EditControl', module)
	// .addDecorator(withInfo) // At your stories directly.
	.add('Simple', () => {
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
	.add('GeoJson', () => {
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
	});
