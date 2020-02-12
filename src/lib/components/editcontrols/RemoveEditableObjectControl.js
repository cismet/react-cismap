import PropTypes from 'prop-types';
import { MapControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-editable';

export default class Control extends MapControl {
	createLeafletElement(props) {
		const { map } = this.context;

		L.NewPolygonControl = L.EditControl.extend({
			options: {
				position: this.props.position,
				onSelect: this.props.onSelect,
				callback: (editTools) => {},
				kind: 'eraser',
				html: '<i class="fas fa-eraser"></i>'
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
