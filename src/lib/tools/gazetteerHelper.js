import bboxCreator from '@turf/bbox';
import * as turfHelpers from '@turf/helpers';
import objectAssign from 'object-assign';
import proj4 from 'proj4';
import { proj4crs25832def } from '../constants/gis';
import * as gisHelpers from './gisHelper';

export const builtInGazetteerHitTrigger = (
	hit,
	leafletElement,
	setGazetteerHit,
	setOverlayFeature,
	furtherGazeteerHitTrigger,
	suppressMarker = false
) => {
	if (
		hit !== undefined &&
		hit.length !== undefined &&
		hit.length > 0 &&
		hit[0].x !== undefined &&
		hit[0].y !== undefined
	) {
		let logGazetteerHit = new URLSearchParams(window.location.href).get('logGazetteerHits');
		if (logGazetteerHit === '' || logGazetteerHit === true) {
			let url = window.location.href.split('?')[0];

			console.log(url + '?gazHit=' + window.btoa(JSON.stringify(hit[0])));
		}

		const pos = proj4(proj4crs25832def, proj4.defs('EPSG:4326'), [ hit[0].x, hit[0].y ]);
		//console.log(pos)
		leafletElement.panTo([ pos[1], pos[0] ], {
			animate: false
		});

		let hitObject = objectAssign({}, hit[0]);

		//Change the Zoomlevel of the map
		if (hitObject.more.zl) {
			leafletElement.setZoom(hitObject.more.zl, {
				animate: false
			});

			if (suppressMarker === false) {
				//show marker
				setGazetteerHit(hitObject);
				setOverlayFeature(null);
			}
		} else if (hitObject.more.g) {
			var feature = turfHelpers.feature(hitObject.more.g);
			if (!feature.crs) {
				feature.crs = {
					type: 'name',
					properties: { name: 'urn:ogc:def:crs:EPSG::25832' }
				};
			}
			var bb = bboxCreator(feature);
			if (suppressMarker === false) {
				setGazetteerHit(null);
				setOverlayFeature(feature);
			}
			leafletElement.fitBounds(gisHelpers.convertBBox2Bounds(bb));
		}
		setTimeout(() => {
			if (furtherGazeteerHitTrigger !== undefined) {
				furtherGazeteerHitTrigger(hit);
			}
		}, 200);
	} else {
		//console.log(hit);
	}
};

export const getGazDataForTopicIds = (sources, topics) => {
	let sorter = 0;

	let gazData = [];
	for (let topic of topics) {
		if (topic === 'pois') {
			let pois = JSON.parse(sources.pois);
			for (let i = 0; i < pois.length; ++i) {
				let topicItem = pois[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'pois'
				};
				gazData.push(g);
			}
		}
		if (topic === 'quartiere') {
			let quartiere = JSON.parse(sources.quartiere);
			for (let i = 0; i < quartiere.length; ++i) {
				let topicItem = quartiere[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'quartiere'
				};
				gazData.push(g);
			}
		}
		if (topic === 'bezirke') {
			let bezirke = JSON.parse(sources.bezirke);
			for (let i = 0; i < bezirke.length; ++i) {
				let topicItem = bezirke[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'bezirke'
				};
				gazData.push(g);
			}
		}
		if (topic === 'kitas') {
			let kitas = JSON.parse(sources.kitas);
			for (let i = 0; i < kitas.length; ++i) {
				let topicItem = kitas[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'kitas'
				};
				gazData.push(g);
			}
		}
		if (topic === 'adressen') {
			let adressen = JSON.parse(sources.adressen);
			for (let i = 0; i < adressen.length; ++i) {
				let topicItem = adressen[i];
				let string = topicItem.s;
				if (topicItem.nr !== '' && topicItem.nr !== 0) {
					string = string + ' ' + topicItem.nr;
				}
				if (topicItem.z !== '') {
					string = string + ' ' + topicItem.z;
				}
				let g = {
					sorter: sorter++,
					string: string,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'adressen'
				};
				gazData.push(g);
			}
		}
		if (topic === 'bplaene') {
			let bplaene = JSON.parse(sources.bplaene);

			for (let i = 0; i < bplaene.length; ++i) {
				let topicItem = bplaene[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					overlay: 'B',
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'bplaene'
				};
				gazData.push(g);
			}
		}
		if (topic === 'aenderungsv') {
			let aev = JSON.parse(sources.aenderungsv);
			for (let i = 0; i < aev.length; ++i) {
				let topicItem = aev[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: topicItem.g,
					overlay: 'F',
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'aenderungsv'
				};
				gazData.push(g);
			}
		}
		if (topic === 'prbr') {
			let anlagen = JSON.parse(sources.prbr);

			for (let i = 0; i < anlagen.length; ++i) {
				let topicItem = anlagen[i];
				let g = {
					sorter: sorter++,
					string: topicItem.n,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'prbr'
				};
				gazData.push(g);
			}
		}
		if (topic === 'emob') {
			let tankstellen = JSON.parse(sources.emob);

			for (let i = 0; i < tankstellen.length; ++i) {
				let topicItem = tankstellen[i];
				let g = {
					sorter: sorter++,
					string: topicItem.n,
					glyph: topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'emob'
				};
				gazData.push(g);
			}
		}
		if (topic === 'ebikes') {
			let stationen = JSON.parse(sources.ebikes);

			for (let i = 0; i < stationen.length; ++i) {
				let topicItem = stationen[i];
				let verleihstation = topicItem.m.id.startsWith('V');

				let g = {
					sorter: sorter++,
					string: topicItem.n,
					glyph: verleihstation ? 'bicycle' : 'charging-station',
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'ebikes'
				};
				gazData.push(g);
			}
		}
		if (topic === 'geps') {
			let geps = JSON.parse(sources.geps);
			for (let i = 0; i < geps.length; ++i) {
				let topicItem = geps[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: 'code-fork', //topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'geps'
				};
				gazData.push(g);
			}
		}
		if (topic === 'geps_reverse') {
			let geps_reverse = JSON.parse(sources.geps_reverse);
			for (let i = 0; i < geps_reverse.length; ++i) {
				let topicItem = geps_reverse[i];
				let g = {
					sorter: sorter++,
					string: topicItem.s,
					glyph: 'code-fork', //topicItem.g,
					x: topicItem.x,
					y: topicItem.y,
					more: topicItem.m,
					type: 'geps_reverse'
				};
				gazData.push(g);
			}
		}
	}
	return gazData;
};
