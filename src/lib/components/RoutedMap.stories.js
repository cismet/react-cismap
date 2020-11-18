import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import 'leaflet-editable';
import 'leaflet.path.drag';
import { RoutedMap, MappingConstants } from '../../lib';

storiesOf('RoutedMap', module)
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

				<RoutedMap
					editable={false}
					style={mapStyle}
					key={'leafletRoutedMap'}
					referenceSystem={MappingConstants.crs25832}
					referenceSystemDefinition={MappingConstants.proj4crs25832def}
					ref={(leafletMap) => {
						// this.leafletRoutedMap = leafletMap;
					}}
					layers=''
					doubleClickZoom={false}
					onclick={(e) => console.log('click', e)}
					ondblclick={(e) => console.log('doubleclick', e)}
					autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
					backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
					urlSearchParams={urlSearchParams}
					fullScreenControlEnabled={false}
					locateControlEnabled={false}
					minZoom={7}
					maxZoom={18}
					zoomSnap={0.5}
					zoomDelta={0.5}
				/>
			</div>
		);
	})
	.add('True Ortho 2018', () => {
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

				<RoutedMap
					editable={false}
					style={mapStyle}
					key={'leafletRoutedMap'}
					referenceSystem={MappingConstants.crs25832}
					referenceSystemDefinition={MappingConstants.proj4crs25832def}
					ref={(leafletMap) => {
						// this.leafletRoutedMap = leafletMap;
					}}
					layers=''
					doubleClickZoom={false}
					onclick={(e) => console.log('click', e)}
					ondblclick={(e) => console.log('doubleclick', e)}
					autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
					backgroundlayers={'trueOrtho2018@100'}
					urlSearchParams={urlSearchParams}
					fullScreenControlEnabled={false}
					locateControlEnabled={false}
					minZoom={7}
					maxZoom={18}
					zoomSnap={0.5}
					zoomDelta={0.5}
				/>
			</div>
		);
	})
	.add('True Ortho 2020', () => {
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

				<RoutedMap
					editable={false}
					style={mapStyle}
					key={'leafletRoutedMap'}
					referenceSystem={MappingConstants.crs25832}
					referenceSystemDefinition={MappingConstants.proj4crs25832def}
					ref={(leafletMap) => {
						// this.leafletRoutedMap = leafletMap;
					}}
					layers=''
					doubleClickZoom={false}
					onclick={(e) => console.log('click', e)}
					ondblclick={(e) => console.log('doubleclick', e)}
					autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
					backgroundlayers={'trueOrtho2020@100'}
					urlSearchParams={urlSearchParams}
					fullScreenControlEnabled={false}
					locateControlEnabled={false}
					minZoom={7}
					maxZoom={18}
					zoomSnap={0.5}
					zoomDelta={0.5}
				/>
			</div>
		);
	})
	.add('With simulated Url', () => {
		const mapStyle = {
			height: window.innerHeight - 100,
			cursor: 'pointer',
			clear: 'both'
		};

		const [ location, setLocation ] = useState(
			'?lat=51.26915496491071&lng=7.220860064241877&selectedSimulation=0&zoom=14'
		);

		let urlSearchParams = new URLSearchParams(location);

		return (
			<div>
				<div>Simple Map</div>
				<br />

				<span style={{ fontSize: '18px' }}>
					<label style={{ float: 'left', paddingRight: 10 }} for='url'>
						Simulated Url:{' '}
					</label>
					<input
						id='url'
						style={{ width: '70%', float: 'left', fontSize: '16px' }}
						type='text'
						value={location}
						onChange={(e) => {
							setLocation(e.target.value);
						}}
					/>
				</span>
				<br />
				<br />

				<RoutedMap
					style={mapStyle}
					key={'leafletRoutedMap'}
					referenceSystem={MappingConstants.crs25832}
					referenceSystemDefinition={MappingConstants.proj4crs25832def}
					ref={(leafletMap) => {
						// this.leafletRoutedMap = leafletMap;
					}}
					layers=''
					doubleClickZoom={false}
					onclick={(e) => console.log('click', e)}
					ondblclick={(e) => console.log('doubleclick', e)}
					autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
					backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
					urlSearchParams={urlSearchParams}
					fullScreenControlEnabled={false}
					locateControlEnabled={false}
					minZoom={7}
					maxZoom={18}
					zoomSnap={0.5}
					zoomDelta={0.5}
				/>
			</div>
		);
	})
	.add('test getBoundingBox', () => {
		const mapStyle = {
			height: window.innerHeight - 100,
			cursor: 'pointer',
			clear: 'both'
		};

		const [ location, setLocation ] = useState(
			'?lat=51.26915496491071&lng=7.220860064241877&selectedSimulation=0&zoom=14'
		);

		let urlSearchParams = new URLSearchParams(location);
		let leafletRoutedMapRef;
		return (
			<div>
				<div>Click to get BoundingBox</div>
				<br />

				<span style={{ fontSize: '18px' }}>
					<label style={{ float: 'left', paddingRight: 10 }} for='url'>
						Simulated Url:{' '}
					</label>
					<input
						id='url'
						style={{ width: '70%', float: 'left', fontSize: '16px' }}
						type='text'
						value={location}
						onChange={(e) => {
							setLocation(e.target.value);
						}}
					/>
				</span>
				<br />
				<br />

				<RoutedMap
					style={mapStyle}
					key={'leafletRoutedMap'}
					referenceSystem={MappingConstants.crs25832}
					referenceSystemDefinition={MappingConstants.proj4crs25832def}
					ref={(leafletMap) => {
						leafletRoutedMapRef = leafletMap;
					}}
					layers=''
					doubleClickZoom={false}
					onclick={(e) => console.log('click', leafletRoutedMapRef.getBoundingBox())}
					ondblclick={(e) => console.log('doubleclick', e)}
					autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
					backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
					urlSearchParams={urlSearchParams}
					fullScreenControlEnabled={false}
					locateControlEnabled={false}
					minZoom={7}
					maxZoom={18}
					zoomSnap={0.5}
					zoomDelta={0.5}
				/>
			</div>
		);
	});
