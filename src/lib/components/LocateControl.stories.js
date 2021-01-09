import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import { RoutedMap, MappingConstants } from '../index';

storiesOf('Deprecated/LocateControl', module)
	// .addDecorator(withInfo) // At your stories directly.
	.add('Simple', () => {
		const mapStyle = {
			height: window.innerHeight,
			cursor: 'pointer'
		};
		let urlSearchParams = new URLSearchParams(window.location.href);

		return (
			<div>
				<div>Simple Map with Locate Control</div>
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
					locateControlEnabled={true}
					minZoom={7}
					maxZoom={18}
					zoomSnap={0.5}
					zoomDelta={0.5}
				/>
			</div>
		);
	});
