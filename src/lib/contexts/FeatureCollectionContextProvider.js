import { useImmer } from 'use-immer';
import React, { useState, useEffect, useContext } from 'react';
import { fetchJSON, md5FetchJSON } from '../tools/fetching';
import Flatbush from 'flatbush';
import KDBush from 'kdbush';
import { TMStateContext } from './TopicMapContextProvider';
const defaultState = {
	items: undefined,
	allFeatures: undefined,
	shownFeatures: undefined,
	selectedFeature: undefined,
	featureIndex: undefined,
	selectedIndexState: {
		selectedIndex: 0,
		forced: false
	}
};

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const getItems = async ({
	setItems,
	setAllFeatures,
	setFeatureIndex,
	itemsUrl,
	convertItemToFeature = (itemIsFeature) => itemIsFeature,
	name = 'cachedFeatureCollection',
	caching = true,
	withMD5Check = true
}) => {
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

const FeatureCollectionContextProvider = ({ children, enabled = true }) => {
	const [ state, dispatch ] = useImmer({ ...defaultState });
	const { boundingBox } = useContext(TMStateContext);
	const set = (prop) => {
		return (x) => {
			dispatch((state) => {
				state[prop] = x;
			});
		};
	};
	const { featureIndex, allFeatures, shownFeatures, selectedIndexState, selectedFeature } = state;
	const selectedIndex = selectedIndexState.selectedIndex;

	const setX = {
		setItems: set('items'),
		setAllFeatures: set('allFeatures'),
		setShownFeatures: set('shownFeatures'),
		setSelectedFeature: set('selectedFeature'),
		setFeatureIndex: set('featureIndex'),
		setSelectedIndexState: set('selectedIndexState')
	};

	const setSelectedFeatureIndex = (selectedIndex) => {
		setX.setSelectedIndexState({ selectedIndex, forced: true }); //overrules keep index when boundingbox is changed
	};

	const setSelectedIndex = (selectedIndex) => {
		setX.setSelectedIndexState({ selectedIndex, forced: false });
	};

	const next = () => {
		const newIndex = (selectedFeature.index + 1) % shownFeatures.length;
		setSelectedFeatureIndex(newIndex);
	};
	const prev = () => {
		let newIndex = (selectedFeature.index - 1) % shownFeatures.length;
		if (newIndex === -1) {
			newIndex = shownFeatures.length - 1;
		}
		setSelectedFeatureIndex(newIndex);
	};

	useEffect(
		() => {
			console.log('boundingBox changed in FeatureCollection', boundingBox);
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

			let _shownFeatures = [];
			for (const f of features || []) {
				const nf = {
					selected: false,
					index: i++,
					...f
				};
				_shownFeatures.push(nf);
			}

			if (selectedIndexState.forced === false) {
				if (selectedFeature === undefined && selectedIndex !== 0) {
					setSelectedIndex(0);
				} else if (selectedFeature !== undefined) {
					const found = _shownFeatures.find(
						(testfeature) => selectedFeature.id === testfeature.id
					);

					if (found !== undefined) {
						if (found.index !== selectedIndex) {
							setSelectedIndex(found.index);
						}
					} else {
						if (0 !== selectedIndex) {
							setSelectedIndex(0);
						}
					}
				}
			}

			let sf;
			try {
				sf = _shownFeatures[selectedIndex];
				sf.selected = true;
			} catch (e) {}
			setX.setSelectedFeature(sf);

			setX.setShownFeatures(_shownFeatures);
		},
		[ boundingBox, featureIndex, allFeatures, selectedIndexState ]
	);

	const load = (url) => {
		getItems({ itemsUrl: url, ...setX });
	};
	useEffect(() => {
		load('https://wunda-geoportal.cismet.de/data/parkscheinautomatenfeatures.json');
	}, []);

	console.log('zzz FeatureCollectionState', state);

	if (enabled === true) {
		return (
			<StateContext.Provider value={state}>
				<DispatchContext.Provider
					value={{
						dispatch,
						...setX,
						load,
						setSelectedFeatureIndex,
						next,
						prev
					}}
				>
					{children}
				</DispatchContext.Provider>
			</StateContext.Provider>
		);
	} else {
		return (
			<StateContext.Provider value={undefined}>
				<DispatchContext.Provider
					value={{
						undefined
					}}
				>
					{children}
				</DispatchContext.Provider>
			</StateContext.Provider>
		);
	}
};

export default FeatureCollectionContextProvider;

export {
	FeatureCollectionContextProvider,
	StateContext as FeatureCollectionContext,
	DispatchContext as FeatureCollectionDispatchContext
};
