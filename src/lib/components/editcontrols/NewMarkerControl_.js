import PropTypes from 'prop-types';
import 'leaflet-easybutton';
import 'leaflet-easybutton/src/easy-button.css';
import '../EasyButtonOverrides.css';

import { MapControl } from 'react-leaflet';
import L from 'leaflet';

class Control extends MapControl {
	componentWillMount() {
		let that = this;
		this.leafletElement = L.easyButton({
			states: [
				{
					stateName: 'marker', // name the state
					icon: 'fas fa-map-marker', // and define its properties
					title: undefined, //'zoom to a forest', // like its title
					onClick: function(btn, map) {
						// and its callback
						map.editTools.stopDrawing();
						map.editTools.startMarker();
						btn.state('marker-off'); // change state on click!
					}
				},
				{
					stateName: 'marker-off', // name the state
					icon: 'fas fa-draw-polygon', // and define its properties
					title: undefined, // like its title
					onClick: function(btn, map) {
						// and its callback
						map.editTools.stopDrawing();
						btn.state('marker'); // change state on click!
					}
				}
			]
		});
	}
}

Control.propTypes = {
	position: PropTypes.string,
	title: PropTypes.string,
	routing: PropTypes.object
};

export default Control;
