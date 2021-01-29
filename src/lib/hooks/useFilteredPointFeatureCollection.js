import React, { useState, useEffect } from 'react';
import { fetchJSON, md5FetchJSON } from '../tools/fetching';
import Flatbush from 'flatbush';
import KDBush from 'kdbush';

const getItems = async (
	setItems,
	setAllFeatures,
	setFeatureIndex,
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
	let id = 0;
	for (const item of items) {
		const f = convertItemToFeature(item);
		f.selected = false;
		f.id = id++;

		features.push(f);
	}
	setItems(items);

	setAllFeatures(features);

	setFeatureIndex(
		new KDBush(features, (p) => p.geometry.coordinates[0], (p) => p.geometry.coordinates[1])
	);
};

const useFilteredPointFeatureCollection = ({
	name = 'cachedFeatureCollection',
	itemsUrl,
	itemLoader,
	caching = true,
	withMD5Check = true,
	convertItemToFeature = (item) => item,
	boundingBox,
	mapContext
}) => {
	const [ items, setItems ] = useState(undefined);
	const [ allFeatures, setAllFeatures ] = useState(undefined);
	const [ shownFeatures, setShownFeatures ] = useState(undefined);
	const [ selectedFeature, setSelectedFeature ] = useState(undefined);
	const [ featureIndex, setFeatureIndex ] = useState(undefined);
	const [ selectedIndexState, setSelectedIndexState ] = useState({
		selectedIndex: 0,
		forced: false
	});
	const setSelectedFeatureIndex = (selectedIndex) => {
		setSelectedIndexState({ selectedIndex, forced: true }); //overrules keep index when boundingbox is changed
	};

	const setSelectedIndex = (selectedIndex) => {
		setSelectedIndexState({ selectedIndex, forced: false });
	};
	const selectedIndex = selectedIndexState.selectedIndex;
	useEffect(
		() => {
			getItems(
				setItems,
				setAllFeatures,
				setFeatureIndex,
				itemsUrl,
				convertItemToFeature,
				name,
				caching,
				withMD5Check
			);
		},
		[ setItems, itemsUrl, name, caching, withMD5Check ]
	);

	useEffect(
		() => {
			if (mapContext !== undefined) {
				if (mapContext.setItems !== undefined) {
					mapContext.setItems(items);
				}
				if (mapContext.setFeatures !== undefined) {
					mapContext.setFeatures(shownFeatures);
				}
				if (mapContext.setSelectedFeature !== undefined) {
					mapContext.setSelectedFeature(selectedFeature);
				}
				if (
					mapContext.setFeatureIndexSelector !== undefined &&
					mapContext.featureIndexSelector === undefined
				) {
					// mapContext.setFeatureIndexSelector(setSelectedFeatureIndex);
				}
			}
		},
		[ items, shownFeatures, selectedFeature, setSelectedFeatureIndex ]
	);

	let features = [];

	if (boundingBox !== undefined && featureIndex !== undefined) {
		let resultIds = featureIndex.range(
			boundingBox.left,
			boundingBox.bottom,
			boundingBox.right,
			boundingBox.top
		);
		for (const id of resultIds) {
			const f = allFeatures[id];
			features.push(allFeatures[id]);
		}

		features.sort((a, b) => {
			if (a.geometry.coordinates[1] === b.geometry.coordinates[1]) {
				return a.geometry.coordinates[0] - b.geometry.coordinates[0];
			} else {
				return b.geometry.coordinates[1] - a.geometry.coordinates[1];
			}
		});
	} else {
		features = allFeatures;
	}

	let i = 0;
	for (const f of features || []) {
		f.selected = false;
		f.index = i++;
	}

	if (selectedIndexState.forced === false) {
		if (selectedFeature === undefined && selectedIndex !== 0) {
			setSelectedIndex(0);
		} else if (selectedFeature !== undefined) {
			const found = features.find((testfeature) => selectedFeature.id === testfeature.id);

			if (found !== undefined) {
				if (found.index !== selectedIndex) {
					setSelectedIndex(found.index);
					return [ features, selectedFeature, setSelectedIndex ];
				}
			} else {
				if (0 !== selectedIndex) {
					setSelectedIndex(0);
					return [ features, selectedFeature, setSelectedIndex ];
				}
			}
		}
	}

	let sf;
	try {
		sf = features[selectedIndex];
		sf.selected = true;
	} catch (e) {}

	if (
		(selectedFeature === undefined && sf !== undefined) ||
		(selectedFeature !== undefined && sf !== undefined && selectedFeature.id !== sf.id)
	) {
		setSelectedFeature(sf);
		setSelectedIndex(sf.index);
	}

	const ret = [ features, selectedFeature, setSelectedFeatureIndex ];
	if (JSON.stringify(features) !== JSON.stringify(shownFeatures)) {
		setShownFeatures(features);
	}
	return ret;
};

export default useFilteredPointFeatureCollection;
