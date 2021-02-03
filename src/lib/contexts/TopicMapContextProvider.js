import React from 'react';
import { useImmer } from 'use-immer';
import FeatureCollectionContextProvider from './FeatureCollectionContextProvider';
import proj4 from 'proj4';
import { proj4crs25832def } from '../constants/gis';
const defaultState = {
	location: undefined,
	boundingBox: undefined,
	routedMapRef: undefined
};

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const TopicMapContextProvider = ({ children, featureCollectionEnabled = true }) => {
	const [ state, dispatch ] = useImmer({ ...defaultState });

	const set = (prop) => {
		return (x) => {
			dispatch((state) => {
				state[prop] = x;
			});
		};
	};

	const convenienceFunctions = {
		setBoundingBox: set('boundingBox'),
		setLocation: set('location'),
		setRoutedMapRef: set('routedMapRef')

	};
	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider
				value={{
					dispatch,
					...convenienceFunctions,
					zoomToFeature: (feature) => {
						if (state.routedMapRef !== undefined) {
							const pos = proj4(proj4crs25832def, proj4.defs('EPSG:4326'), [
								feature.geometry.coordinates[0],
								feature.geometry.coordinates[1]
							]);
							state.routedMapRef.leafletMap.leafletElement.setView(
								[ pos[1], pos[0] ],
								15
							);
						}
					},
					
					gotoHome: ()=>{
						if (state.routedMapRef !== undefined) {
							console.log("state.routedMapRef",state.routedMapRef.props)
							state.routedMapRef.leafletMap.leafletElement.setView(
								[ state.routedMapRef.props.fallbackPosition.lat, state.routedMapRef.props.fallbackPosition.lng ],
								state.routedMapRef.props.fallbackZoom
							);
						}
					}

				}}
			>
				<FeatureCollectionContextProvider enabled={featureCollectionEnabled}>
					{children}
				</FeatureCollectionContextProvider>
			</DispatchContext.Provider>
		</StateContext.Provider>
	);
};

export default TopicMapContextProvider;

export {
	TopicMapContextProvider,
	StateContext as TMStateContext,
	DispatchContext as TMDispatchContext
};
