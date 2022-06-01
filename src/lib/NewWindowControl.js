import PropTypes from "prop-types";
import "./custom/easy-button";
import "leaflet-easybutton/src/easy-button.css";
import "./EasyButtonOverrides.css";

import { MapControl } from "react-leaflet";
import L from "leaflet";

class NewWindowControl extends MapControl {
  componentWillMount() {
    let that = this;
    this.leafletElement = L.customEasyButton(
      "fa-external-link-square-alt",
      function (btn, map) {
        window.open(window.location.href);
      },
      this.props.title,
      {
        position: this.props.position || "topleft",
      }
    );
  }
}

NewWindowControl.propTypes = {
  position: PropTypes.string,
  title: PropTypes.string,
  routing: PropTypes.object,
};

export default NewWindowControl;
