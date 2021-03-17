import React from 'react';
import PropTypes from 'prop-types';
import ExtraMarker from './ExtraMarker';
import { proj4crs25832def } from './constants/gis';
import proj4 from 'proj4';

const GazetteerHitDisplay = ({ gazetteerHit }) => {
	let gazMarker = null;

	if (gazetteerHit != null) {
		const pos = proj4(proj4crs25832def, proj4.defs('EPSG:4326'), [
			gazetteerHit.x,
			gazetteerHit.y
		]);
		let markerOptions = {
			icon: (gazetteerHit.glyphPrefix||'') +'fa-' + gazetteerHit.glyph,
			markerColor: 'cyan',
			spin: false,
			prefix: 'fas'
		};
		gazMarker = (
			<ExtraMarker
				key={'gazmarker.' + JSON.stringify(gazetteerHit)}
				markerOptions={markerOptions}
				position={[ pos[1], pos[0] ]}
			/>
		);
	}
	return gazMarker;
};

export default GazetteerHitDisplay;
GazetteerHitDisplay.propTypes = {
	gazetteerHit: PropTypes.object,
	mapRef: PropTypes.object
};
