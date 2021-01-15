import React, { useState, useRef, useEffect, useCallback } from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { RoutedMap, MappingConstants, FeatureCollectionDisplayWithTooltipLabels } from './index';
import EditControl from './editcontrols/NewPolygonControl';
import 'leaflet-editable';
import 'leaflet.path.drag';
import '@fortawesome/fontawesome-free/js/all.js';
import { uwz } from './_stories/_data/Demo';

import L from 'leaflet';

console.log('uwz', uwz);

storiesOf('Deprecated/FeatureCollectionDisplayWithTooltipLabels', module)
	// .addDecorator(withInfo) // At your stories directly.
	.add('Simple FCD in 25832', () =>
		React.createElement(() => {
			const mapStyle = {
				height: window.innerHeight - 100,
				cursor: 'pointer',
				clear: 'both'
			};

			let urlSearchParams = new URLSearchParams('');

			return (
				<div>
					<div>Simple small FeatureCollection in a metric reference system</div>
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
						backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10'}
						urlSearchParams={urlSearchParams}
						fullScreenControlEnabled={false}
						locateControlEnabled={false}
						minZoom={7}
						maxZoom={18}
						zoomSnap={0.5}
						zoomDelta={0.5}
						fallbackZoom={8}
					>
						<FeatureCollectionDisplayWithTooltipLabels
							key={'ds'}
							featureCollection={uwz}
							boundingBox={{
								left: 343647.19856823067,
								top: 5695957.177980389,
								right: 398987.6070465423,
								bottom: 5652273.416315537
							}}
							style={(feature) => {
								// console.log('feature styler', feature);

								const style = {
									color: '#155317',
									weight: 3,
									opacity: 0.5,
									fillColor: '#155317',
									fillOpacity: 0.15
								};
								return style;
							}}
							labeler={(feature) => {
								// console.log('feature labeler', feature);

								return (
									<h3
										style={{
											color: '#155317',
											opacity: 0.7,
											textShadow:
												'1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000'
										}}
									>
										Umweltzone
									</h3>
								);
							}}
						/>
					</RoutedMap>
				</div>
			);
		})
	)
	.add('Simple editable FCD in 25832 ', () =>
		React.createElement(() => {
			const [ editable, setEditable ] = useState(false);
			const map = useRef();
			const fc = useRef();
			const mapStyle = {
				height: window.innerHeight - 100,
				cursor: 'pointer',
				clear: 'both'
			};

			// useEffect(() => {
			// 	// Update the document title using the browser API
			// 	console.log('map ref', map);
			// 	console.log('fc  ref', fc);
			// });

			let urlSearchParams = new URLSearchParams('');

			return (
				<div>
					<div>
						Simple small editable FeatureCollection in a metric reference system (Start
						editing with double-click)
					</div>
					<br />
					<button onClick={() => setEditable(!editable)}>
						{editable === true ? 'Turn off EditMode' : 'Turn on EditMode'}
					</button>
					<br />
					<br />

					<RoutedMap
						ref={map}
						editable={editable}
						style={mapStyle}
						key={'leafletRoutedMap' + editable}
						referenceSystem={MappingConstants.crs25832}
						referenceSystemDefinition={MappingConstants.proj4crs25832def}
						layers=''
						doubleClickZoom={false}
						onclick={(e) => console.log('click', e)}
						ondblclick={(e) => console.log('doubleclick', e)}
						autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
						backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10'}
						urlSearchParams={urlSearchParams}
						fullScreenControlEnabled={false}
						locateControlEnabled={false}
						minZoom={7}
						maxZoom={18}
						zoomSnap={0.5}
						zoomDelta={0.5}
						fallbackZoom={8}
					>
						<FeatureCollectionDisplayWithTooltipLabels
							ref={fc}
							editable={editable}
							key={'ds'}
							featureCollection={uwz}
							boundingBox={{
								left: 343647.19856823067,
								top: 5695957.177980389,
								right: 398987.6070465423,
								bottom: 5652273.416315537
							}}
							style={(feature) => {
								// console.log('feature styler', feature);

								const style = {
									color: '#155317',
									weight: 3,
									opacity: 0.5,
									fillColor: '#155317',
									fillOpacity: 0.15
								};
								return style;
							}}
							labeler={(feature) => {
								// console.log('feature labeler', feature);

								return (
									<h3
										style={{
											color: '#155317',
											opacity: 0.7,
											textShadow:
												'1px 1px 0px  #000000,-1px 1px 0px  #000000, 1px -1px 0px  #000000, -1px -1px 0px  #000000, 2px 2px 15px #000000'
										}}
									>
										Umweltzone
									</h3>
								);
							}}
						/>
					</RoutedMap>
				</div>
			);
		})
	);
