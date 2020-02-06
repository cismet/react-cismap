import PropTypes from 'prop-types';
import { MapControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-editable';

export default class Control extends MapControl {
	createLeafletElement(props) {
		const { map } = this.context;
		L.RemoveControl = L.Control.extend({
			options: {
				position: this.props.position,
				onSelect: this.props.requestForRemoval,
				callback: () => {},
				kind: 'remove',
				html: '<i class="fas fa-eraser"></i>'
			},

			onAdd: function(map) {
				var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
					link = L.DomUtil.create('a', '', container);

				link.href = '#';
				link.title = 'Objekt entfernen';
				link.innerHTML = this.options.html;
				L.DomEvent.on(link, 'click', L.DomEvent.stop).on(
					link,
					'click',
					function() {
						console.log('rmove');

						window.LAYER = this.options.callback.call(map.editTools);
					},
					this
				);

				const that = this;

				return container;
			}
		});

		return new L.RemoveControl();
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
