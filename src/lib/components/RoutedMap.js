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
import { getInternetExplorerVersion } from '../tools/browserHelper';
import L from 'leaflet';
import 'leaflet-snap';
import 'leaflet-geometryutil';
export class RoutedMap extends React.Component {
	constructor(props) {
		super(props);
		this.featureClick = this.featureClick.bind(this);
	}

	// add a handler for detecting map changes
	componentDidMount() {
		const leafletMap = this.leafletMap;
		// this.leafletMap.editable = true;

		console.log('this.leafletMap.leafletElement', this.leafletMap.leafletElement);
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

			// for (const layer of this.props.snaplayers) {
			// 	snap.addGuideLayer(layer);
			// 	console.log('xxx', layer);
			// }
			// var snapMarker = L.marker(map.getCenter(), {
			// 	icon: map.editTools.createVertexIcon({
			// 		className: 'leaflet-div-icon leaflet-drawing-icon'
			// 	}),
			// 	opacity: 1,
			// 	zIndexOffset: 1000
			// });
			// snap.watchMarker(snapMarker);
			// map.on('editable:vertex:dragstart', function(e) {
			// 	snap.watchMarker(e.vertex);
			// });
			// map.on('editable:vertex:dragend', function(e) {
			// 	snap.unwatchMarker(e.vertex);
			// });
			// map.on('editable:drawing:start', function() {
			// 	this.on('mousemove', followMouse);
			// });
			// map.on('editable:drawing:end', function() {
			// 	this.off('mousemove', followMouse);
			// 	snapMarker.remove();
			// });
			// map.on('editable:drawing:click', function(e) {
			// 	// Leaflet copy event data to another object when firing,
			// 	// so the event object we have here is not the one fired by
			// 	// Leaflet.Editable; it's not a deep copy though, so we can change
			// 	// the other objects that have a reference here.
			// 	var latlng = snapMarker.getLatLng();
			// 	e.latlng.lat = latlng.lat;
			// 	e.latlng.lng = latlng.lng;
			// });
			// snapMarker.on('snap', function(e) {
			// 	snapMarker.addTo(map);
			// });
			// snapMarker.on('unsnap', function(e) {
			// 	snapMarker.remove();
			// });
			// var followMouse = function(e) {
			// 	snapMarker.setLatLng(e.latlng);
			// };
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
		// if (typeof this.leafletMap !== 'undefined' && this.leafletMap != null) {
		// 	if (this.props.snaplayers !== undefined) {
		// 		console.log('this.props.snaplayers', this.props.snaplayers);

		// 		const map = this.leafletMap.leafletElement;
		// 		var snap = new L.Handler.MarkerSnap(map);
		// 		for (const layer of this.props.snaplayers) {
		// 			snap.addGuideLayer(layer);
		// 			console.log('xxx', layer);
		// 		}
		// 		var snapMarker = L.marker(map.getCenter(), {
		// 			icon: map.editTools.createVertexIcon({
		// 				className: 'leaflet-div-icon leaflet-drawing-icon'
		// 			}),
		// 			opacity: 1,
		// 			zIndexOffset: 1000
		// 		});
		// 		snap.watchMarker(snapMarker);
		// 		map.on('editable:vertex:dragstart', function(e) {
		// 			snap.watchMarker(e.vertex);
		// 		});
		// 		map.on('editable:vertex:dragend', function(e) {
		// 			snap.unwatchMarker(e.vertex);
		// 		});
		// 		map.on('editable:drawing:start', function() {
		// 			this.on('mousemove', followMouse);
		// 		});
		// 		map.on('editable:drawing:end', function() {
		// 			this.off('mousemove', followMouse);
		// 			snapMarker.remove();
		// 		});
		// 		map.on('editable:drawing:click', function(e) {
		// 			// Leaflet copy event data to another object when firing,
		// 			// so the event object we have here is not the one fired by
		// 			// Leaflet.Editable; it's not a deep copy though, so we can change
		// 			// the other objects that have a reference here.
		// 			var latlng = snapMarker.getLatLng();
		// 			e.latlng.lat = latlng.lat;
		// 			e.latlng.lng = latlng.lng;
		// 		});
		// 		snapMarker.on('snap', function(e) {
		// 			snapMarker.addTo(map);
		// 		});
		// 		snapMarker.on('unsnap', function(e) {
		// 			snapMarker.remove();
		// 		});
		// 		var followMouse = function(e) {
		// 			snapMarker.setLatLng(e.latlng);
		// 		};
		// 	}
		// }

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
		let internetExplorer = getInternetExplorerVersion() !== -1;
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

			if (simulateInIOS || iOS || internetExplorer) {
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
					editable={this.props.editable}
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
	zoomDelta: PropTypes.number,
	editable: PropTypes.bool,
	snaplayers: PropTypes.array
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
	zoomDelta: 1,
	editable: false
};

export default RoutedMap;
