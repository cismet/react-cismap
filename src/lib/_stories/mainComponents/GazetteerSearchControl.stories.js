import React, { useState, useRef, useEffect } from 'react';
import { RoutedMap, MappingConstants } from '../../index';
import GazetteerSearchControl from '../../GazetteerSearchControl';
import GazetteerHitDisplay from '../../GazetteerHitDisplay';
import { md5FetchText } from '../../tools/fetching';
import { getGazDataForTopicIds } from '../../tools/gazetteerHelper';
import ProjSingleGeoJson from '../../ProjSingleGeoJson';
import { storiesCategory } from './StoriesConf';
export default {
	title: storiesCategory + 'GazetteerSearchControl'
};

const getGazData = async (setData) => {
	const prefix = 'GazDataForStories';
	const sources = {};

	// gazData.push(await md5FetchJSON(prefix, 'https://updates.cismet.de/test/adressen.json'));
	sources.adressen = await md5FetchText(
		prefix,
		'https://wunda-geoportal.cismet.de/data/adressen.json'
	);
	sources.bezirke = await md5FetchText(
		prefix,
		'https://wunda-geoportal.cismet.de/data/bezirke.json'
	);
	sources.quartiere = await md5FetchText(
		prefix,
		'https://wunda-geoportal.cismet.de/data/quartiere.json'
	);
	sources.pois = await md5FetchText(prefix, 'https://wunda-geoportal.cismet.de/data/pois.json');
	sources.kitas = await md5FetchText(prefix, 'https://wunda-geoportal.cismet.de/data/kitas.json');

	const gazData = getGazDataForTopicIds(sources, [
		'pois',
		'kitas',
		'bezirke',
		'quartiere',
		'adressen'
	]);

	setData(gazData);
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
	const [ gazData, setGazData ] = useState([]);
	useEffect(() => {
		getGazData(setGazData);
	}, []);

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
				{overlayFeature && (
					<ProjSingleGeoJson
						key={JSON.stringify(overlayFeature)}
						geoJson={overlayFeature}
						masked={true}
						mapRef={mapRef}
					/>
				)}
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
					gazData={gazData}
					enabled={gazData.length > 0}
				/>
			</RoutedMap>
		</div>
	);
};
