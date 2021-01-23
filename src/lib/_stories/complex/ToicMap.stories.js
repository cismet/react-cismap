import React, { useState, useRef, useEffect } from 'react';
import { RoutedMap, MappingConstants } from '../../index';
import GazetteerSearchControl from '../../GazetteerSearchControl';
import GazetteerHitDisplay from '../../GazetteerHitDisplay';
import { md5FetchText, fetchJSON } from '../../tools/fetching';
import { getGazDataForTopicIds } from '../../tools/gazetteerHelper';
import ProjSingleGeoJson from '../../ProjSingleGeoJson';
import { storiesCategory } from './StoriesConf';
import TopicMapComponent from '../../topicmaps/TopicMapComponent';
import FeatureCollectionDisplay from '../../FeatureCollectionDisplay';
import getGTMFeatureStyler from '../../topicmaps/generic/GTMStyler';
import FeatureCollection from '../../FeatureCollection';
export default {
	title: storiesCategory + 'TopicMapComponent'
};

const getGazData = async (setGazData) => {
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

	setGazData(gazData);
};

export const SimpleTopicMap = () => {
	const mapStyle = {
		height: 700,
		cursor: 'pointer'
	};

	const [ gazData, setGazData ] = useState([]);
	const [ data, setData ] = useState([]);
	useEffect(() => {
		getGazData(setGazData);
		// getData(setData);
	}, []);

	return (
		<div>
			<h3>Simple TopicMap </h3>
			<br />

			<TopicMapComponent mapStyle={mapStyle} gazData={gazData}>
				{/* <FeatureCollectionDisplay
					style={getGTMFeatureStyler()}
					featureCollection={features}
					showMarkerCollection={false}
				/> */}
				<FeatureCollection
					itemsUrl='https://wunda-geoportal.cismet.de/data/parkscheinautomatenfeatures.json'
					style={getGTMFeatureStyler()}
					showMarkerCollection={false}
				/>
			</TopicMapComponent>
		</div>
	);
};
