import L from "leaflet";
import "leaflet.nontiledlayer";
import { GridLayer } from "react-leaflet";
import { TileLayer } from "leaflet";
import { isEqual, reduce } from "lodash";
import { EVENTS_RE } from "react-leaflet/lib/MapComponent";

class NonTiledWMSLayer extends GridLayer {
  constructor(props) {
    super(props);
  }
  createLeafletElement(props) {
    const { url, ...params } = props;
    const layer = new L.NonTiledLayer.WMS(url, this.getOptions(params));
    return layer;
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);

    const { url: prevUrl, opacity: _po, zIndex: _pz, ...prevParams } = fromProps;
    const { url, opacity: _o, zIndex: _z, ...params } = toProps;

    if (url !== prevUrl) {
      this.leafletElement.setUrl(url);
    }
    if (!isEqual(params, prevParams)) {
      this.leafletElement.setParams(params);
    }
  }

  getOptions(params) {
    return reduce(
      super.getOptions(params),
      (options, value, key) => {
        if (!EVENTS_RE.test(key)) {
          options[key] = value;
        }
        return options;
      },
      {}
    );
  }
}

export default NonTiledWMSLayer;
