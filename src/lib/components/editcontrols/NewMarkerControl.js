import PropTypes from 'prop-types';

import { MapControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-editable';
import 'leaflet.path.drag';
import { createEditControlBaseClass } from './createEditControlBaseClass';

export default class Control extends MapControl {
	createLeafletElement(props) {
		const { map } = this.context;
		if (L.EditControl === undefined) {
			createEditControlBaseClass();
		}
		return new L.EditControl({
			position: this.props.position,
			onSelect: this.props.onSelect,
			callback: map.editTools.startMarker,
			kind: 'marker',
			html: '<i class="fas fa-map-marker"></i>'
		});
	}
}

Control.propTypes = {
	position: PropTypes.string,
	onSelect: PropTypes.func,
	onFeatureCreation: PropTypes.func,
	onFeatureChange: PropTypes.func
};

Control.defaultProps = {
	position: 'topleft',
	onSelect: (editable) => {},
	onFeatureCreation: (editable) => {},
	onFeatureChange: (editable) => {}
};
