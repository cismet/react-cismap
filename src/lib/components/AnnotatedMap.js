import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ProjGeoJson from './ProjGeoJson';
import RoutedMap from './RoutedMap';
import FeatureCollectionDisplay from './FeatureCollectionDisplay';
import NewPolyControl from './editcontrols/NewPolygonControl';
import NewMarkerControl from './editcontrols/NewMarkerControl';
import { convertFeatureCollectionToMarkerPositionCollection } from '../tools/mappingHelpers';
import { convertPolygonLatLngsToGeoJson, projectionData } from '../tools/mappingHelpers';
import { reproject } from 'reproject';
import 'leaflet-editable';
import 'leaflet.path.drag';
import proj4 from 'proj4';
import '@fortawesome/fontawesome-free/js/all.js';
import L from 'leaflet';

// Since this component is simple and static, there's no parent container for it.
const Comp = (props) => {
	const { editable } = props;
	const [ featuresInActiveEditMode, setFeaturesInActiveEditMode ] = useState([]);
	const mapRef = useRef(null);
	const [ annotations, setAnnotations ] = useState([
		{
			id: '0',
			type: 'Feature',
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[ 374416.4917460493, 5681678.77451399 ],
						[ 374424.0583561766, 5681656.480910968 ],
						[ 374423.78805617616, 5681656.3790162485 ],
						[ 374424.4986653592, 5681654.551878816 ],
						[ 374448.3470422178, 5681665.694086005 ],
						[ 374444.01502615237, 5681677.02827118 ],
						[ 374441.8727188524, 5681682.35892816 ],
						[ 374434.4588803425, 5681685.415413512 ],
						[ 374430.287606105, 5681684.2131442875 ],
						[ 374422.97658758296, 5681681.326124269 ]
					]
				]
			},
			crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::25832' } },
			properties: {}
		},
		{
			id: '1',
			type: 'Feature',
			properties: {},
			geometry: { type: 'Point', coordinates: [ 374343.0779387644, 5681734.414827559 ] },
			crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::25832' } }
		}
	]);

	useEffect(
		() => {
			console.log('annotations', annotations);

			const map = mapRef.current.leafletMap.leafletElement;
			for (const layerkey of Object.keys(map._layers)) {
				const layer = map._layers[layerkey];
				if (
					layer.customType === 'annotation' &&
					layer.feature !== undefined &&
					layer.feature.inEditMode === true
				) {
					if (layer.enableEdit !== undefined) {
						layer.enableEdit();
					}
				}
			}
		},
		[ annotations ]
	);

	const onFeatureCreation = (feature) => {
		setAnnotations((oldAnno) => {
			feature.id = oldAnno.length;
			return [ ...oldAnno, feature ];
		});
	};
	const onFeatureChange = (feature) => {
		setAnnotations((oldAnno) => {
			//feature.inEditMode = true;
			oldAnno[feature.id] = feature;
			return [ ...oldAnno ];
		});
	};

	return (
		<RoutedMap
			ref={mapRef}
			{...props}
			mapReady={(map) => {
				const createFeature = (id, layer) => {
					const wgs84geoJSON = layer.toGeoJSON();
					const reprojectedGeoJSON = reproject(
						wgs84geoJSON,
						proj4.WGS84,
						projectionData['25832'].def
					);
					// console.log('wgs84geoJSON', JSON.stringify(wgs84geoJSON));
					console.log('reprojectedGeoJSON', JSON.stringify(reprojectedGeoJSON));

					reprojectedGeoJSON.id = id;
					return reprojectedGeoJSON;
				};

				//moved whole object
				map.on('editable:dragend', (e) => {
					onFeatureChange(createFeature(e.layer.feature.id, e.layer));
				});

				//moved only the handles of an object
				map.on('editable:vertex:dragend', (e) => {
					onFeatureChange(createFeature(e.layer.feature.id, e.layer));
				});

				//created a new object
				map.on('editable:drawing:end', (e) => {
					const feature = createFeature(-1, e.layer);
					//if you wannt to keep the edit handles on just do
					// feature.inEditMode = true;

					onFeatureCreation(feature);
					{
						//switch off editing
						//e.layer.toggleEdit();
						// e.layer.on('dblclick', L.DomEvent.stop).on('dblclick', e.layer.toggleEdit);
						// e.layer.on('click', L.DomEvent.stop).on('click', () => {
						// 	console.log('e.layer', e);
						// 	props.onSelect(e.layer);
						// });
						//remove the object since it is stored in a feature collection
					}
					e.layer.remove();
				});
				map.on('editable:drawing:click', () => {
					console.log('click');
				});
			}}
		>
			{props.children}

			{editable && <NewPolyControl />}
			{editable && <NewMarkerControl />}
			{editable && (
				<FeatureCollectionDisplay
					editable={true}
					snappingGuides={true}
					customType='annotation'
					key={'annotation'}
					featureCollection={annotations}
					boundingBox={{
						left: 343647.19856823067,
						top: 5695957.177980389,
						right: 398987.6070465423,
						bottom: 5652273.416315537
					}}
					style={(feature) => {
						console.log('feature.inEditMode', feature.inEditMode);

						const borderColor = '#990100';
						const fillColor = '#B90504';
						return {
							color: borderColor,
							radius: 8,
							weight: 2,
							opacity: 1.0,
							fillColor,
							fillOpacity: 0.6,
							className: 'annotation-' + feature.id,
							defaultMarker: true,
							svg_: `
              <?xml version="1.0" encoding="UTF-8" standalone="no"?>
              <svg
                 xmlns:dc="http://purl.org/dc/elements/1.1/"
                 xmlns:cc="http://creativecommons.org/ns#"
                 xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                 xmlns:svg="http://www.w3.org/2000/svg"
                 xmlns="http://www.w3.org/2000/svg"
                 xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                 xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                 width="30"
                 height="30"
                 viewBox="0 0 24 24"
                 version="1.1"
                 id="svg3037"
                 inkscape:version="0.48.3.1 r9886"
                 sodipodi:docname="marker.svg">
                <metadata
                   id="metadata3049">
                  <rdf:RDF>
                    <cc:Work
                       rdf:about="">
                      <dc:format>image/svg+xml</dc:format>
                      <dc:type
                         rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
                      <dc:title></dc:title>
                    </cc:Work>
                  </rdf:RDF>
                </metadata>
                <defs
                   id="defs3047" />
                <sodipodi:namedview
                   pagecolor="#ffffff"
                   bordercolor="#666666"
                   borderopacity="1"
                   objecttolerance="10"
                   gridtolerance="10"
                   guidetolerance="10"
                   inkscape:pageopacity="0"
                   inkscape:pageshadow="2"
                   inkscape:window-width="1280"
                   inkscape:window-height="750"
                   id="namedview3045"
                   showgrid="false"
                   inkscape:zoom="11.313708"
                   inkscape:cx="-1.9846567"
                   inkscape:cy="10.262487"
                   inkscape:window-x="0"
                   inkscape:window-y="0"
                   inkscape:window-maximized="1"
                   inkscape:current-layer="svg3037" />
                <path
                   sodipodi:type="arc"
                   style="fill:${fillColor};fill-opacity:0.6"
                   id="path3055"
                   sodipodi:cx="14.976165"
                   sodipodi:cy="12.322564"
                   sodipodi:rx="6.1573091"
                   sodipodi:ry="5.0450211"
                   d="m 21.133474,12.322564 a 6.1573091,5.0450211 0 1 1 -12.3146182,0 6.1573091,5.0450211 0 1 1 12.3146182,0 z"
                   transform="matrix(1.9489033,0,0,2.3785827,-17.187097,-17.310238)" />
                <path
                   sodipodi:type="arc"
                   style="fill:#ffffff;fill-opacity:1"
                   id="path3057"
                   sodipodi:cx="14.49947"
                   sodipodi:cy="13.990996"
                   sodipodi:rx="2.7409956"
                   sodipodi:ry="1.7876059"
                   d="m 17.240465,13.990996 a 2.7409956,1.7876059 0 1 1 -5.481991,0 2.7409956,1.7876059 0 1 1 5.481991,0 z"
                   transform="matrix(1.4593237,0,0,2.2376297,-9.1594199,-19.306669)" />
              </svg>
              `,
							svgSize: 30
						};
					}}
				/>
			)}
		</RoutedMap>
	);
};

export default Comp;
