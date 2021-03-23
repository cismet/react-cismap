import L from 'leaflet';
import PropTypes from 'prop-types';

import { Marker } from 'react-leaflet';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';

// need to have this import because of CSS sziss
// eslint-disable-next-line
import ExtraMarkers from 'leaflet-extra-markers';

export class ExtraMarker extends Marker {
	createLeafletElement(props) {
		let marker = super.createLeafletElement(props);
		var redMarker = L.ExtraMarkers.icon(props.markerOptions);
		marker.options.icon = redMarker;
		return marker;
	}

	componentWillMount() {
		super.componentWillMount();
	}

	updateLeafletElement(fromProps, toProps) {
		return super.updateLeafletElement(fromProps, toProps);
	}
	render() {
		return super.render();
	}
}

export default ExtraMarker;
