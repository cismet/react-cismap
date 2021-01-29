import React from 'react';
import { useImmer } from 'use-immer';
import FeatureCollectionContextProvider from './FeatureCollectionContextProvider';
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
					...convenienceFunctions
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
