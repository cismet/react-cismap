import PropTypes from 'prop-types';

import { MapControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-editable';
import { convertPolygonLatLngsToGeoJson } from '../../tools/mappingHelpers';

export default class Control extends MapControl {
	createLeafletElement(props) {
		const { map } = this.context;
		L.EditControl = L.Control.extend({
			options: {
				position: 'topleft',
				callback: null,
				kind: '',
				html: ''
			},

			onAdd: function(map) {
				var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
					link = L.DomUtil.create('a', '', container);

				link.href = '#';
				link.title = 'Create a new ' + this.options.kind;
				link.innerHTML = this.options.html;
				L.DomEvent.on(link, 'click', L.DomEvent.stop).on(
					link,
					'click',
					function() {
						window.LAYER = this.options.callback.call(map.editTools);
					},
					this
				);

				const that = this;

				// map.on('editable:editing', (e) => {
				// 	console.log('editing', e);
				// });

				const createFeature = (id, layer) => {
					const x = {
						id: id,
						latlngs: layer.getLatLngs(),
						properties: {}
					};
					return convertPolygonLatLngsToGeoJson(x);
				};

				//Ganzes Objekt verschoben
				map.on('editable:dragend', (e) => {
					props.onFeatureChange(createFeature(e.layer.feature.id, e.layer));
				});

				map.on('editable:vertex:dragend', (e) => {
					props.onFeatureChange(createFeature(e.layer.feature.id, e.layer));
				});

				map.on('editable:drawing:end', (e) => {
					props.onFeatureCreation(createFeature(-1, e.layer));

					//switch off editing
					//e.layer.toggleEdit();

					// e.layer.on('dblclick', L.DomEvent.stop).on('dblclick', e.layer.toggleEdit);

					// e.layer.on('click', L.DomEvent.stop).on('click', () => {
					// 	console.log('e.layer', e);

					// 	props.onSelect(e.layer);
					// });

					//remove the object since it is stored in a feature collection
					e.layer.remove();
				});
				// map.on('editable:drawing:click', () => {
				// 	console.log('click');
				// });

				return container;
			}
		});

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
