import React from 'react';
import PropTypes from 'prop-types';
import { Map, ZoomControl } from 'react-leaflet';
import 'proj4leaflet';
import proj4 from 'proj4';
import 'url-search-params-polyfill';

import * as MappingConstants from '../constants/mapping';

import getLayersByNames from '../tools/layerFactory';
import FullscreenControl from './/FullscreenControl';
import NewWindowControl from './NewWindowControl';
import LocateControl from '../components/LocateControl';

export class RoutedMap extends React.Component {
	constructor(props) {
		super(props);
		this.featureClick = this.featureClick.bind(this);
	}

	// add a handler for detecting map changes
	componentDidMount() {
		const leafletMap = this.leafletMap;
		this.leafletMap.leafletElement.on('moveend', () => {
			if (typeof leafletMap !== 'undefined' && leafletMap !== null) {
				const zoom = leafletMap.leafletElement.getZoom();
				const center = leafletMap.leafletElement.getCenter();
				const latFromUrl = parseFloat(this.props.urlSearchParams.get('lat'));
				const lngFromUrl = parseFloat(this.props.urlSearchParams.get('lng'));
				const zoomFromUrl = parseInt(this.props.urlSearchParams.get('zoom'), 10);
				let lat = center.lat;
				let lng = center.lng;
				if (Math.abs(latFromUrl - center.lat) < 0.000001) {
					lat = latFromUrl;
				}
				if (Math.abs(lngFromUrl - center.lng) < 0.000001) {
					lng = lngFromUrl;
				}

				if (lng !== lngFromUrl || lat !== latFromUrl || zoomFromUrl !== zoom) {
					this.props.locationChangedHandler({
						lat: lat,
						lng: lng,
						zoom: zoom
					});
				}
				this.storeBoundingBox(leafletMap);
			} else {
				console.warn('leafletMap ref is null. this could lead to update problems. ');
			}
		});
		this.storeBoundingBox(leafletMap);
	}

	//Handle a autoFit Command if needed
	componentDidUpdate() {
		if (typeof this.leafletMap !== 'undefined' && this.leafletMap != null) {
			if (this.props.autoFitConfiguration.autoFitBounds) {
				if (
					this.props.autoFitConfiguration.autoFitMode ===
					MappingConstants.AUTO_FIT_MODE_NO_ZOOM_IN
				) {
					if (
						!this.leafletMap.leafletElement
							.getBounds()
							.contains(this.props.autoFitConfiguration.autoFitBoundsTarget)
					) {
						this.leafletMap.leafletElement.fitBounds(
							this.props.autoFitConfiguration.autoFitBoundsTarget
						);
					}
				} else {
					if (
						this.props.autoFitConfiguration.autoFitBoundsTarget &&
						this.props.autoFitConfiguration.autoFitBoundsTarget.length === 2
					) {
						try {
							this.leafletMap.leafletElement.fitBounds(
								this.props.autoFitConfiguration.autoFitBoundsTarget
							);
						} catch (e) {
							console.warn('could not zoom', e);

							console.log(
								'this.props.autoFitConfiguration.autoFitBoundsTarget',
								this.props.autoFitConfiguration.autoFitBoundsTarget
							);
						}
					}
				}
				this.props.autoFitProcessedHandler();
			}
		}
	}

	storeBoundingBox(leafletMap) {
		//store the projected bounds in the store
		const bounds = leafletMap.leafletElement.getBounds();
		const projectedNE = proj4(proj4.defs('EPSG:4326'), this.props.referenceSystemDefinition, [
			bounds._northEast.lng,
			bounds._northEast.lat
		]);
		const projectedSW = proj4(proj4.defs('EPSG:4326'), this.props.referenceSystemDefinition, [
			bounds._southWest.lng,
			bounds._southWest.lat
		]);
		const bbox = {
			left: projectedSW[0],
			top: projectedNE[1],
			right: projectedNE[0],
			bottom: projectedSW[1]
		};
		//console.log(getPolygon(bbox));

		this.props.boundingBoxChangedHandler(bbox);
	}

	featureClick(event) {
		this.props.featureClickHandler(event);
	}

	render() {
		const positionByUrl = [
			parseFloat(this.props.urlSearchParams.get('lat')) || this.props.fallbackPosition.lat,
			parseFloat(this.props.urlSearchParams.get('lng')) || this.props.fallbackPosition.lng
		];

		let zoomByUrl;
		if (this.props.zoomSnap === 1) {
			zoomByUrl =
				parseInt(this.props.urlSearchParams.get('zoom'), 10) || this.props.fallbackZoom;
		} else {
			zoomByUrl =
				parseFloat(this.props.urlSearchParams.get('zoom')) || this.props.fallbackZoom;
		}

		let fullscreenControl = <div />;

		let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
		let inIframe = window.self !== window.top;
		let simulateInIframe = false;
		let simulateInIOS = false;
		let iosClass = 'no-iOS-device';

		if (this.props.fullScreenControlEnabled) {
			fullscreenControl = (
				<FullscreenControl
					title='Vollbildmodus'
					forceSeparateButton={true}
					titleCancel='Vollbildmodus beenden'
					position='topleft'
					container={document.documentElement}
				/>
			);

			if (simulateInIOS || iOS) {
				iosClass = 'iOS-device';
				if (simulateInIframe || inIframe) {
					fullscreenControl = (
						// <OverlayTrigger placement="left" overlay={(<Tooltip>Maximiert in neuem Browser-Tab öffnen.</Tooltip>)}>
						<NewWindowControl
							position='topleft'
							routing={this.props.routing}
							title='Maximiert in neuem Browser-Tab öffnen.'
						/>
					);
					// </OverlayTrigger>
				} else {
					fullscreenControl = <div />;
				}
			}
		}
		let locateControl = <div />;
		if (this.props.locateControlEnabled) {
			locateControl = (
				<LocateControl
					setView='once'
					flyTo={true}
					strings={{
						title: 'Mein Standort',
						metersUnit: 'Metern',
						feetUnit: 'Feet',
						popup:
							'Sie befinden sich im Umkreis von {distance} {unit} um diesen Punkt.',
						outsideMapBoundsMsg:
							'Sie gefinden sich wahrscheinlich außerhalb der Kartengrenzen.'
					}}
				/>
			);
		}
		return (
			<div className={iosClass}>
				<Map
					ref={(leafletMap) => {
						this.leafletMap = leafletMap;
					}}
					key={'leafletMap'}
					crs={this.props.referenceSystem}
					style={this.props.style}
					center={positionByUrl}
					zoom={zoomByUrl}
					zoomControl={false}
					attributionControl={false}
					doubleClickZoom={false}
					ondblclick={this.props.ondblclick}
					onclick={this.props.onclick}
					minZoom={this.props.minZoom}
					maxZoom={this.props.maxZoom}
					zoomSnap={this.props.zoomSnap}
					zoomDelta={this.props.zoomDelta}
				>
					<ZoomControl
						position='topleft'
						zoomInTitle='Vergr&ouml;ßern'
						zoomOutTitle='Verkleinern'
					/>
					{fullscreenControl}
					{locateControl}
					{getLayersByNames(
						this.props.backgroundlayers,
						this.props.urlSearchParams.get('mapStyle')
					)}
					{this.props.children}
				</Map>
			</div>
		);
	}
}

RoutedMap.propTypes = {
	mapping: PropTypes.object,
	height: PropTypes.number,
	width: PropTypes.number,
	layers: PropTypes.string.isRequired,
	featureClickHandler: PropTypes.func,
	style: PropTypes.object.isRequired,
	ondblclick: PropTypes.func,
	onclick: PropTypes.func,
	children: PropTypes.array,
	locationChangedHandler: PropTypes.func,
	boundingBoxChangedHandler: PropTypes.func,
	autoFitConfiguration: PropTypes.object,
	autoFitProcessedHandler: PropTypes.func,
	urlSearchParams: PropTypes.object,
	fallbackPosition: PropTypes.object,
	fallbackZoom: PropTypes.number,
	referenceSystem: PropTypes.object,
	referenceSystemDefinition: PropTypes.string,
	backgroundlayers: PropTypes.string,
	fullScreenControlEnabled: PropTypes.bool,
	locateControlEnabled: PropTypes.bool,
	minZoom: PropTypes.number,
	maxZoom: PropTypes.number,
	zoomSnap: PropTypes.number,
	zoomDelta: PropTypes.number
};

RoutedMap.defaultProps = {
	layers: '',
	gazeteerHitTrigger: function() {},
	searchButtonTrigger: function() {},
	featureClickHandler: function() {},
	ondblclick: function() {},
	onclick: function() {},
	locationChangedHandler: function() {},
	autoFitConfiguration: {},
	urlSearchParams: new URLSearchParams(''),
	boundingBoxChangedHandler: () => {},
	autoFitProcessedHandler: () => {},
	fallbackPosition: {
		lat: 51.272399,
		lng: 7.199712
	},
	fallbackZoom: 14,
	referenceSystem: MappingConstants.crs25832,
	referenceSystemDefinition: MappingConstants.proj4crs25832def,
	backgroundlayers: 'default',
	minZoom: 7,
	maxZoom: 18,
	zoomSnap: 1,
	zoomDelta: 1
};

export default RoutedMap;
