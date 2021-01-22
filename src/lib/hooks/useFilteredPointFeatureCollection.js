import React, { useState, useEffect } from 'react';
import { fetchJSON, md5FetchJSON } from '../tools/fetching';

const getItems = async (
	setItems,
	setFeatures,
	itemsUrl,
	convertItemToFeature,
	name,
	caching,
	withMD5Check
) => {
	const prefix = name;
	let items;

	if (caching === true && withMD5Check === true) {
		items = await md5FetchJSON(prefix, itemsUrl);
	} else {
		// else if () {
		//     //need to impl the other stuff
		// }
		items = await fetchJSON(itemsUrl);
	}

	const features = [];
	for (const i of items) {
		const f = convertItemToFeature(i);
		features.push(f);
	}
	setItems(items);
	setFeatures(features);
	console.log('xxx features', features);
};

const useFilteredPointFeatureCollection = ({
	name = 'unknowfeatureCollectionName',
	itemsUrl,
	itemLoader,
	caching = true,
	withMD5Check = true,
	convertItemToFeature = (item) => item
}) => {
	const [ selectedIndex, setSelectedFeatureIndex ] = useState(0);
	const [ items, setItems ] = useState(undefined);
	const [ features, setFeatures ] = useState(undefined);
	useEffect(
		() => {
			getItems(
				setItems,
				setFeatures,
				itemsUrl,
				convertItemToFeature,
				name,
				caching,
				withMD5Check
			);
		},
		[ setItems, itemsUrl, name, caching, withMD5Check ]
	);

	let selectedFeature;
	try {
		selectedFeature = features[selectedIndex];

		for (const f of features) {
			f.selected = false;
		}
		selectedFeature.selected = true;
	} catch (e) {}
	return [ features, selectedFeature, setSelectedFeatureIndex ];
};

export default useFilteredPointFeatureCollection;
