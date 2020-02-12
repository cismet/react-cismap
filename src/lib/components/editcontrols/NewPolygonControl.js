import PropTypes from 'prop-types';
import { MapControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-editable';

export default class Control extends MapControl {
	createLeafletElement(props) {
		const { map } = this.context;
		// L.EditControl = L.Control.extend({
		// 	options: {
		// 		position: 'topleft',
		// 		callback: null,
		// 		kind: '',
		// 		html: ''
		// 	},

		// 	onAdd: function(map) {
		// 		var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
		// 			link = L.DomUtil.create('a', '', container);

		// 		link.href = '#';
		// 		link.title = 'Create a new ' + this.options.kind;
		// 		link.innerHTML = this.options.html;
		// 		L.DomEvent.on(link, 'click', L.DomEvent.stop).on(
		// 			link,
		// 			'click',
		// 			function() {
		// 				window.LAYER = this.options.callback.call(map.editTools);
		// 			},
		// 			this
		// 		);

		// 		const that = this;

		// 		return container;
		// 	}
		// });

		L.NewPolygonControl = L.EditControl.extend({
			options: {
				position: this.props.position,
				onSelect: this.props.onSelect,
				callback: map.editTools.startPolygon,
				kind: 'polygon',
				html: '<span style="color: black;"><i class="fas fa-draw-polygon"></i></span>'
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
