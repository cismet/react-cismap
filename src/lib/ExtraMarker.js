import L from "leaflet";

import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import { Marker } from "react-leaflet";

// need to have this import because of CSS sziss
// eslint-disable-next-line

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
