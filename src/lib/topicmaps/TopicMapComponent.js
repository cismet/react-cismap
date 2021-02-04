import React, { useState, useEffect, useRef, useContext } from 'react';
import * as MappingConstants from '../constants/gis';
import GazetteerHitDisplay from '../GazetteerHitDisplay';
import ProjSingleGeoJson from '../ProjSingleGeoJson';
import { modifyQueryPart } from '../tools/routingHelper';
import Control from 'react-leaflet-control';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Button from 'react-bootstrap/Button';
import Icon from '../commons/Icon';
import RoutedMap from '../RoutedMap';
import Loadable from 'react-loading-overlay';
import GazetteerSearchControl from '../GazetteerSearchControl';
import { createBrowserHistory, createHashHistory } from 'history';
import CismapContext from '../contexts/CismapContext';
import { TMDispatchContext } from '../contexts/TopicMapContextProvider';
import { useWindowSize } from '@react-hook/window-size';

let history = createHashHistory();

const TopicMapComponent = (props) => {
	const leafletRoutedMapRef = useRef(null);
	const [ windowWidth, windowHeight ] = useWindowSize();
	const infoBoxRef = useRef(null);
	let {
		modalMenu = <div />,
		statusPostfix = '',
		loadingStatus = undefined,
		pendingLoader = 0,
		noInitialLoadingText = false,
		initialLoadingText = 'Laden der Daten ...',
		minZoom = 5,
		maxZoom = 19,
		mapStyle,
		homeCenter = [ 51.25861849982617, 7.15101022370511 ],
		homeZoom = 8,
		ondblclick = () => {},
		onclick = () => {},
		locationChangedHandler = undefined,
		pushToHistory = (url) => {
			history.push(url);
		},
		autoFitBounds = false,
		autoFitMode = MappingConstants.AUTO_FIT_MODE_STRICT,
		autoFitBoundsTarget = null,
		setAutoFit = () => {},
		urlSearchParams,
		mappingBoundsChanged = (boundingbox) => {},
		backgroundlayers = 'ruhrWMSlight@40',
		fullScreenControl = true,
		locatorControl = false,
		// overlayFeature = undefined,
		// setOverlayFeature = () => {},
		// // gazetteerHit = undefined,
		// setGazetteerHit =undefined,
		gazData = [],

		searchControlWidth = 300,
		infoStyle,
		infoBoxBottomMargin,
		infoBox = <div />,
		secondaryInfoBoxElements = [],
		applicationMenuTooltipString = 'Einstellungen | Anleitung',
		showModalApplicationMenu = () => {},
		applicationMenuIconname = 'bars'
	} = props;

	const [ url, setUrl ] = useState(undefined);
	useEffect(() => {
		history.listen(({ action, location }) => {
			setUrl(history.location.search);
		});
	}, []);

	let featureCollectionDisplay;
	let photoLightBox;
	let _urlSearchParams;

	if (urlSearchParams === undefined) {
		_urlSearchParams = new URLSearchParams(url || history.location.search);
	} else {
		_urlSearchParams = urlSearchParams;
	}

	const [ gazetteerHit, setGazetteerHit ] = useState(null);
	const [ overlayFeature, setOverlayFeature ] = useState(null);

	const { setBoundingBox, setLocation, setRoutedMapRef } = useContext(TMDispatchContext);
	if (leafletRoutedMapRef.current !== null) {
		setRoutedMapRef(leafletRoutedMapRef.current);
	}
	const _mapStyle = {
		width: windowWidth,
		height: windowHeight,
		cursor: 'pointer',
		...mapStyle
	};

	//responsive behaviour
	let widthRight = infoBox.props.pixelwidth;
	let width = _mapStyle.width;
	let gap = 25;

	let infoBoxControlPosition = 'bottomright';
	let searchControlPosition = 'bottomleft';
	let widthLeft = searchControlWidth;
	let _infoStyle = {
		opacity: '0.9',
		width: infoBox.props.pixelwidth
	};

	return (
		<div>
			{modalMenu}
			<Loadable
				active={pendingLoader > 0 && !noInitialLoadingText}
				spinner
				text={initialLoadingText + ' ' + statusPostfix + '...'}
			>
				<div>
					{photoLightBox}
					<RoutedMap
						key={'leafletRoutedMap'}
						referenceSystem={MappingConstants.crs25832}
						referenceSystemDefinition={MappingConstants.proj4crs25832def}
						ref={leafletRoutedMapRef}
						minZoom={minZoom}
						maxZoom={maxZoom}
						layers=''
						style={_mapStyle}
						fallbackPosition={{
							lat: homeCenter[0],
							lng: homeCenter[1]
						}}
						ondblclick={ondblclick}
						onclick={onclick}
						locationChangedHandler={(location) => {
							setLocation(location);
							const q = modifyQueryPart(history.location.search, location);
							pushToHistory(q);
							locationChangedHandler(location);
						}}
						autoFitConfiguration={{
							autoFitBounds: autoFitBounds,
							autoFitMode: autoFitMode,
							autoFitBoundsTarget: autoFitBoundsTarget
						}}
						autoFitProcessedHandler={() => setAutoFit(false)}
						urlSearchParams={_urlSearchParams}
						boundingBoxChangedHandler={(bbox) => {
							setBoundingBox(bbox);
							mappingBoundsChanged(bbox);
							//localMappingBoundsChanged(bbox);
						}}
						backgroundlayers={backgroundlayers}
						fallbackZoom={homeZoom}
						fullScreenControlEnabled={fullScreenControl}
						locateControlEnabled={locatorControl}
					>
						{overlayFeature && (
							<ProjSingleGeoJson
								key={JSON.stringify(overlayFeature)}
								geoJson={overlayFeature}
								masked={true}
								mapRef={leafletRoutedMapRef}
							/>
						)}
						<GazetteerHitDisplay
							key={'gazHit' + JSON.stringify(gazetteerHit)}
							gazetteerHit={gazetteerHit}
						/>
						{featureCollectionDisplay}
						<GazetteerSearchControl
							mapRef={leafletRoutedMapRef}
							gazetteerHit={gazetteerHit}
							setGazetteerHit={setGazetteerHit}
							overlayFeature={overlayFeature}
							setOverlayFeature={setOverlayFeature}
							gazData={gazData}
							enabled={gazData.length > 0}
							pixelwidth={searchControlWidth}
						/>

						{infoBox}
						<Control position='topright'>
							<OverlayTrigger
								placement='left'
								overlay={
									<Tooltip style={{ zIndex: 3000000000 }} id='helpTooltip'>
										{applicationMenuTooltipString}
									</Tooltip>
								}
							>
								<Button
									variant='light'
									style={{
										backgroundImage:
											'linear-gradient(to bottom,#fff 0,#e0e0e0 100%)',
										borderColor: '#CCCCCC'
									}}
									id='cmdShowModalApplicationMenu'
									onClick={() => {
										showModalApplicationMenu();
									}}
								>
									<Icon name={applicationMenuIconname} />
								</Button>
							</OverlayTrigger>
						</Control>
						{props.children}
					</RoutedMap>
					{/* </CismapContext.Provider> */}
				</div>
			</Loadable>
		</div>
	);
};
export default TopicMapComponent;
