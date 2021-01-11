import React, { useState, useRef } from 'react';
import { RoutedMap, MappingConstants } from './index';
import GazetteerSearchControl from './GazetteerSearchControl';
import Icon from './commons/Icon';
import GazetteerHitDisplay from './topicmaps/GazetteerHitDisplay';
export default {
	title: 'Mapping Components/GazetteerSearchControl'
};
export const SimpleMapWithGazetteerSearchBox = () => {
	const mapStyle = {
		height: 600,
		cursor: 'pointer'
	};
	let urlSearchParams = new URLSearchParams(window.location.href);
	const mapRef = useRef(null);
	const [ gazetteerHit, setGazetteerHit ] = useState(null);
	const [ overlayFeature, setOverlayFeature ] = useState(null);
	// const setGazetteerHit = (x) => {
	// 	console.log('calledsetGazetteerHit ', x);
	// 	setGazetteerHitX(x);
	// };
	return (
		<div>
			<div>Simple Map with GazetteerSearchControl</div>
			<br />
			<RoutedMap
				style={mapStyle}
				key={'leafletRoutedMap'}
				referenceSystem={MappingConstants.crs25832}
				referenceSystemDefinition={MappingConstants.proj4crs25832def}
				ref={mapRef}
				layers=''
				doubleClickZoom={false}
				onclick={(e) => console.log('gazetteerHit', gazetteerHit)}
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
			>
				<GazetteerHitDisplay
					key={'gazHit' + JSON.stringify(gazetteerHit)}
					gazetteerHit={gazetteerHit}
				/>
				<GazetteerSearchControl
					mapRef={mapRef}
					gazetteerHit={gazetteerHit}
					setGazetteerHit={setGazetteerHit}
					overlayFeature={overlayFeature}
					setOverlayFeature={setOverlayFeature}
					gazData={[
						{
							sorter: 0,
							string: '3D-Schwarzlicht-Indoor-Minigolfanlage',
							glyph: 'tags',
							x: 369458.39,
							y: 5679559.05,
							more: { zl: 14, pid: 300 },
							type: 'pois'
						},
						{
							sorter: 1,
							string: 'Abendgymnasium Bergisches Kolleg',
							glyph: 'tags',
							x: 370554.53,
							y: 5678929.84,
							more: { zl: 14, pid: 61 },
							type: 'pois'
						},
						{
							sorter: 2,
							string: 'Ada',
							glyph: 'tags',
							x: 370700.1,
							y: 5680936.19,
							more: { zl: 14, pid: 665 },
							type: 'pois'
						},
						{
							sorter: 3,
							string: 'Adventure Golf',
							glyph: 'tags',
							x: 374526,
							y: 5680470.57,
							more: { zl: 14, pid: 375 },
							type: 'pois'
						},
						{
							sorter: 4,
							string: 'Agaplesion Bethesda Krankenhaus Wuppertal gGmbH',
							glyph: 'tags',
							x: 369585.25,
							y: 5681302.91,
							more: { zl: 14, pid: 116 },
							type: 'pois'
						},
						{
							sorter: 5,
							string: 'Alfred-Henkels-Halle',
							glyph: 'tags',
							x: 369248.6,
							y: 5674857.08,
							more: { zl: 14, pid: 253 },
							type: 'pois'
						},
						{
							sorter: 6,
							string: 'Alfred-Panke-Bad',
							glyph: 'tag',
							x: 371806,
							y: 5679161.12,
							more: { zl: 14, pid: 650 },
							type: 'pois'
						},
						{
							sorter: 7,
							string: 'Alte Feuerwache',
							glyph: 'tag',
							x: 370699.68,
							y: 5680848.63,
							more: { zl: 14, pid: 282 },
							type: 'pois'
						},
						{
							sorter: 8,
							string: 'Alte lutherische Kirche am Kolk',
							glyph: 'tag',
							x: 370792.14,
							y: 5680097.75,
							more: { zl: 14, pid: 198 },
							type: 'pois'
						},
						{
							sorter: 9,
							string: 'Alte Lutherkirche',
							glyph: 'tags',
							x: 375225.56,
							y: 5681136.38,
							more: { zl: 14, pid: 207 },
							type: 'pois'
						},
						{
							sorter: 10,
							string: 'Alte luth. Kirche am Kolk',
							glyph: 'tags',
							x: 370792.14,
							y: 5680097.75,
							more: { zl: 14, pid: 198 },
							type: 'pois'
						},
						{
							sorter: 11,
							string: 'Altenzentrum Wuppertaler Hof',
							glyph: 'tag',
							x: 374066.51,
							y: 5681180.8,
							more: { zl: 14, pid: 284 },
							type: 'pois'
						},
						{
							sorter: 12,
							string: 'Alte Papierfabrik',
							glyph: 'tags',
							x: 369458.39,
							y: 5679559.05,
							more: { zl: 14, pid: 300 },
							type: 'pois'
						},
						{
							sorter: 13,
							string: 'Alte Papierfabrik',
							glyph: 'tags',
							x: 369421.2,
							y: 5679530.06,
							more: { zl: 14, pid: 647 },
							type: 'pois'
						},
						{
							sorter: 14,
							string: 'alter Bahnhof Beyenburg',
							glyph: 'tags',
							x: 380713.93,
							y: 5678873.28,
							more: { zl: 14, pid: 416 },
							type: 'pois'
						},
						{
							sorter: 15,
							string: 'alte reformierte Friedhöfe auf der Barmer Gemarke',
							glyph: 'tags',
							x: 374246.92,
							y: 5681561.58,
							more: { zl: 14, pid: 604 },
							type: 'pois'
						},
						{
							sorter: 16,
							string: 'Alte reformierte Kirche Elberfeld',
							glyph: 'tags',
							x: 370724.16,
							y: 5679987.64,
							more: { zl: 14, pid: 197 },
							type: 'pois'
						},
						{
							sorter: 17,
							string:
								'alter evangelischer Friedhof Odoakerstraße, Wuppertal-Langerfeld',
							glyph: 'tags',
							x: 377621.14,
							y: 5681798.68,
							more: { zl: 14, pid: 609 },
							type: 'pois'
						},
						{
							sorter: 18,
							string: 'alter evangelisch-reformierter Friedhof Elberfeld',
							glyph: 'tags',
							x: 371024.38,
							y: 5680426.6,
							more: { zl: 14, pid: 601 },
							type: 'pois'
						},
						{
							sorter: 19,
							string: 'alter katholischer Friedhof Elberfeld',
							glyph: 'tags',
							x: 370440.74,
							y: 5680578.36,
							more: { zl: 14, pid: 602 },
							type: 'pois'
						}
					]}
				/>
			</RoutedMap>
		</div>
	);
};
