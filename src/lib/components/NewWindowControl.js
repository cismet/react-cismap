import PropTypes from "prop-types";
import "leaflet-easybutton";
import "leaflet-easybutton/src/easy-button.css";
import "./EasyButtonOverrides.css";

import { MapControl } from "react-leaflet";
import L from "leaflet";

class NewWindowControl extends MapControl {
  componentWillMount() {
    let that = this;
    this.leafletElement = L.easyButton(
      "fa-external-link-square",
      function(btn, map) {
        window.open(window.location.href);
      },
      this.props.title,
      {
        position: this.props.position
      }
    );
  }
}

NewWindowControl.propTypes = {
  position: PropTypes.string,
  title: PropTypes.string,
  routing: PropTypes.object
};

export default NewWindowControl;
