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
		L.NewPolygonControl = L.EditControl.extend({
			options: {
				position: this.props.position,
				onSelect: this.props.onSelect,
				callback: map.editTools.startPolygon,
				kind: 'polygon',
				html: '<i class="fas fa-draw-polygon"></i>'
			}
		});

		return new L.NewPolygonControl();
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
