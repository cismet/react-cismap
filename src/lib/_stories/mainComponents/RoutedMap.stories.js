import React, { useState, useRef, useEffect } from 'react';
import { storiesCategory } from './StoriesConf';
import { RoutedMap, MappingConstants } from '../..';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Button, Modal } from 'react-bootstrap';
import { removeQueryPart, modifyQueryPart } from '../../tools/routingHelper';

export default {
	title: storiesCategory + 'RoutedMap'
};

const mapStyle = {
	height: 600,
	cursor: 'pointer'
};

export const Simple = () => (
	<div>
		<div>Simple Map</div>
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
			backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
			fullScreenControlEnabled={false}
			locateControlEnabled={false}
			minZoom={7}
			maxZoom={18}
			zoomSnap={0.5}
			zoomDelta={0.5}
		/>
	</div>
);

export const InACustomLayout = () => (
	<div>
		<div>With Own Layout</div>
		<br />

		<Container>
			<Row className='justify-content-md-center'>
				<Col xs lg='2'>
					1 of 3
				</Col>
				<Col md='auto'>
					<RoutedMap
						editable={false}
						style={{ width: 700, height: 300 }}
						key={'leafletRoutedMap'}
						referenceSystem={MappingConstants.crs25832}
						referenceSystemDefinition={MappingConstants.proj4crs25832def}
						doubleClickZoom={false}
						onclick={(e) => console.log('click', e)}
						ondblclick={(e) => console.log('doubleclick', e)}
						backgroundlayers={'trueOrtho2020@100'}
						fullScreenControlEnabled={false}
						locateControlEnabled={false}
						minZoom={7}
						maxZoom={18}
						zoomSnap={0.5}
						zoomDelta={0.5}
					/>
				</Col>
				<Col xs lg='2'>
					3 of 3
				</Col>
			</Row>
			<Row>
				<Col>1 of 3</Col>
				<Col md='auto'>Variable width content</Col>
				<Col xs lg='2'>
					3 of 3
				</Col>
			</Row>
		</Container>
	</div>
);

export const WithSimulatedUrl = (args) => {
	const [ urlSearch, setUrlSearch ] = useState(undefined);
	let urlSearchParams = new URLSearchParams(args.simulatedUrlInput);
	console.log('');

	return (
		<div>
			<code>Urlparameter:#{urlSearch}</code>
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
				backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
				fullScreenControlEnabled={false}
				locateControlEnabled={false}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
				locationChangedHandler={(location) => {
					let us = modifyQueryPart(urlSearch, location);
					setUrlSearch(us);
				}}
				urlSearchParams={urlSearchParams}
			/>
		</div>
	);
};
WithSimulatedUrl.args = {
	simulatedUrlInput: ''
};

export const ManipulatingHashUrl = () => {
	const [ urlSearch, setUrlSearch ] = useState(undefined);
	const urlSearchParams = new URLSearchParams(urlSearch || window.top.location.href);
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
				doubleClickZoom={false}
				onclick={(e) => console.log('click', e)}
				ondblclick={(e) => console.log('doubleclick', e)}
				backgroundlayers={'ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100'}
				fullScreenControlEnabled={false}
				locateControlEnabled={false}
				minZoom={7}
				maxZoom={18}
				zoomSnap={0.5}
				zoomDelta={0.5}
				locationChangedHandler={(location) => {
					console.log('window.top.location', window.top.location);
					let us = modifyQueryPart(urlSearch, location);
					console.log('new hash', us);
					window.top.location.hash = us;
					setUrlSearch(us);
				}}
				urlSearchParams={urlSearchParams}
			/>
		</div>
	);
};
