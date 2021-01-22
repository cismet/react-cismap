import React, { useState, useEffect, useRef } from 'react';
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
let history = createHashHistory();

const TopicMapComponent = (props) => {
	const leafletRoutedMapRef = useRef(null);
	let {
		modalMenu = <div />,
		statusPostfix = '',
		loadingStatus = undefined,
		pendingLoader = 0,
		noInitialLoadingText = false,
		initialLoadingText = 'Laden der Daten ...',
		minZoom = 5,
		maxZoom = 19,
		mapStyle = {
			height: 600,
			cursor: 'pointer'
		},
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
		mappingBoundsChanged = () => {},
		backgroundlayers = 'ruhrWMSlight@40',
		fullScreenControl = true,
		locatorControl = false,
		// overlayFeature = undefined,
		// setOverlayFeature = () => {},
		// // gazetteerHit = undefined,
		// setGazetteerHit =undefined,
		gazData = [],
		infoBoxControlPosition = 'bottomright',
		searchControlPosition = 'bottomleft',
		searchControlWidth = 300,
		infoStyle,
		infoBoxBottomMargin,
		infoBox = <div />,
		secondaryInfoBoxElements = [],
		applicationMenuTooltipString = 'Einstellungen | Anleitung',
		showModalApplicationMenu = () => {},
		applicationMenuIconname = 'bars',
		clusterOptions = {
			spiderfyOnMaxZoom: false,
			showCoverageOnHover: false,
			zoomToBoundsOnClick: false,
			maxClusterRadius: 40,
			disableClusteringAtZoom: 19,
			animate: false,
			cismapZoomTillSpiderfy: 12,
			selectionSpiderfyMinZoom: 12
		}
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
						style={mapStyle}
						fallbackPosition={{
							lat: homeCenter[0],
							lng: homeCenter[1]
						}}
						ondblclick={ondblclick}
						onclick={onclick}
						locationChangedHandler={(location) => {
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

						<Control
							key={
								'InfoBoxElements.' +
								infoBoxControlPosition +
								'.' +
								searchControlPosition
							}
							id={
								'InfoBoxElements.' +
								infoBoxControlPosition +
								'.' +
								searchControlPosition
							}
							position={infoBoxControlPosition}
						>
							<div style={{ ...infoStyle, marginBottom: infoBoxBottomMargin }}>
								{infoBox}
							</div>
						</Control>

						{secondaryInfoBoxElements.map((element, index) => (
							<Control
								key={
									'secondaryInfoBoxElements.' +
									index +
									infoBoxControlPosition +
									'.' +
									searchControlPosition
								}
								position={infoBoxControlPosition}
							>
								<div style={{ opacity: 0.9 }}>{element}</div>
							</Control>
						))}

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
				</div>
			</Loadable>
		</div>
	);
};
export default TopicMapComponent;
