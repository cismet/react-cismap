import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useWindowSize } from '@react-hook/window-size';

const StateContext = React.createContext();
const DispatchContext = React.createContext();
const defaultState = {
	windowSize: undefined,
	infoBoxPixelWidth: 300,
	searchBoxPixelWidth: 300,
	infoBoxControlPosition: 'bottomright',
	searchBoxControlPosition: 'bottomleft',
	responsiveState: 'normal',
	gap: 25
};
const ResponsiveTopicMapContextProvider = ({ children, enabled = true }) => {
	const [ state, dispatch ] = useImmer({ ...defaultState });
	const [ width, height ] = useWindowSize();
	const windowSize = { width, height };
	const set = (prop) => {
		return (x) => {
			dispatch((state) => {
				if (JSON.stringify(state[prop]) !== JSON.stringify(x)) {
					state[prop] = x;
				}
			});
		};
	};

	const setX = {
		setWindowSize: set('windowSize'),
		setInfoBoxPixelWidth: set('infoBoxPixelWidth'),
		setSearchBoxPixelWidth: set('searchBoxPixelWidth'),
		setInfoBoxControlPosition: set('infoBoxControlPosition'),
		setSearchBoxControlPosition: set('searchBoxControlPosition'),
		setResponsiveState: set('responsiveState')
	};

	useEffect(
		() => {
			setX.setWindowSize(windowSize);
		},
		[ windowSize ]
	);

	useEffect(
		() => {
			let widthRight = state.infoBoxPixelWidth;
			let width = windowSize.width;
			let gap = 25;
			let widthLeft = state.searchBoxPixelWidth;

			if (width - gap - widthLeft - widthRight <= 0) {
				setX.setResponsiveState('small');
			} else {
				setX.setResponsiveState('normal');
			}
		},
		[ state.windowSize, state.searchBoxPixelWidth, state.infoBoxPixelWidth ]
	);

	if (enabled === true) {
		return (
			<StateContext.Provider value={state}>
				<DispatchContext.Provider
					value={{
						dispatch,
						...setX
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
export default ResponsiveTopicMapContextProvider;

export {
	ResponsiveTopicMapContextProvider,
	StateContext as ResponsiveTopicMapContext,
	DispatchContext as ResponsiveTopicMapDispatchContext
};
