import PropTypes from 'prop-types';
import 'leaflet-easybutton';
import 'leaflet-easybutton/src/easy-button.css';
import '../EasyButtonOverrides.css';

import { MapControl } from 'react-leaflet';
import L from 'leaflet';

class Control extends MapControl {
	componentWillMount() {
		let that = this;
		this.leafletElement = L.easyButton(
			'fa-external-link-square',
			function(btn, map) {
				map.editTools.startMarker();
			},
			this.props.title,
			{
				position: this.props.position
			}
		);
	}
}

Control.propTypes = {
	position: PropTypes.string,
	title: PropTypes.string
};

export default Control;
