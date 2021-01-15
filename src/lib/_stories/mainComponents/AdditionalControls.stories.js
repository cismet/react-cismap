import React, { useState, useRef, useEffect } from 'react';
import { storiesCategory } from './StoriesConf';
import { RoutedMap, MappingConstants } from '../../';
import NewWindowControl from '../../NewWindowControl';
import ContactButton from '../../ContactButton';
import { text, boolean, number } from '@storybook/addon-knobs';

export default {
	title: storiesCategory + 'AdditionalControls'
};

const mapStyle = {
	height: 600,
	cursor: 'pointer'
};

export const Contact_Button = () => {
	return (
		<div>
			<div>Simple Map with Contact Button</div>
			<br />
			<RoutedMap
				style={mapStyle}
				key={'leafletRoutedMap'}
				referenceSystem={MappingConstants.crs25832}
				referenceSystemDefinition={MappingConstants.proj4crs25832def}
				layers=''
				doubleClickZoom={false}
				onclick={(e) => console.log('click', e)}
				ondblclick={(e) => console.log('doubleclick', e)}
				autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
				backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
				fullScreenControlEnabled={false}
				locateControlEnabled={false}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
			>
				<ContactButton
					title='Cooltip ;-)'
					action={() => {
						window.alert('contact button pushed');
					}}
				/>
			</RoutedMap>
		</div>
	);
};
export const FullscreenControl = () => {
	return (
		<div>
			<div>Simple Map with Fullscreen Control</div>
			<br />
			<RoutedMap
				style={mapStyle}
				key={'leafletRoutedMap'}
				referenceSystem={MappingConstants.crs25832}
				referenceSystemDefinition={MappingConstants.proj4crs25832def}
				layers=''
				doubleClickZoom={false}
				onclick={(e) => console.log('click', e)}
				ondblclick={(e) => console.log('doubleclick', e)}
				autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
				backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
				fullScreenControlEnabled={true}
				locateControlEnabled={false}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
			/>
		</div>
	);
};
export const LocateControl = () => {
	return (
		<div>
			<div>Simple Map with Locate Control</div>
			<br />
			<RoutedMap
				style={mapStyle}
				key={'leafletRoutedMap'}
				referenceSystem={MappingConstants.crs25832}
				referenceSystemDefinition={MappingConstants.proj4crs25832def}
				layers=''
				doubleClickZoom={false}
				onclick={(e) => console.log('click', e)}
				ondblclick={(e) => console.log('doubleclick', e)}
				autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
				backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
				fullScreenControlEnabled={false}
				locateControlEnabled={true}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
			/>
		</div>
	);
};
export const New_Window_Control = () => {
	return (
		<div>
			<div>Simple Map with New Window Control</div>
			<br />
			<RoutedMap
				style={mapStyle}
				key={'leafletRoutedMap'}
				referenceSystem={MappingConstants.crs25832}
				referenceSystemDefinition={MappingConstants.proj4crs25832def}
				layers=''
				doubleClickZoom={false}
				onclick={(e) => console.log('click', e)}
				ondblclick={(e) => console.log('doubleclick', e)}
				autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
				backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
				fullScreenControlEnabled={false}
				locateControlEnabled={false}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
			>
				<NewWindowControl />
			</RoutedMap>
		</div>
	);
};
export const Combination = (args) => {
	return (
		<div>
			<div>Simple Map with New Window Control</div>
			<br />

			<RoutedMap
				style={mapStyle}
				key={'leafletRoutedMap'}
				referenceSystem={MappingConstants.crs25832}
				referenceSystemDefinition={MappingConstants.proj4crs25832def}
				layers=''
				doubleClickZoom={false}
				onclick={(e) => console.log('click', e)}
				ondblclick={(e) => console.log('doubleclick', e)}
				autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
				backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
				fullScreenControlEnabled={boolean('FullScreen', false)}
				locateControlEnabled={boolean('LocateControl', false)}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
			>
				{boolean('NewWindowControl', false) && <NewWindowControl />}
				{boolean('ContactButton', false) && (
					<ContactButton
						title='Cooltip ;-)'
						action={() => {
							window.alert('contact button pushed');
						}}
					/>
				)}
			</RoutedMap>
		</div>
	);
};
