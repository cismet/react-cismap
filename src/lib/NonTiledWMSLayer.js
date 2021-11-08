// import NonTiledLayer from "leaflet.nontiledlayer";
import NonTiledLayer from "./leafletExtension/NonTiledLayer";
import { MapLayer } from "react-leaflet";

export class StyledWMSLayer extends MapLayer {
  constructor(props) {
    super(props);
  }

  createLeafletElement(props) {
    const layer = new NonTiledLayer.WMS(props.url, props);
    return layer;
  }
  componentDidMount() {
    super.componentDidMount();
  }
  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
    this.leafletElement.setOpacity(toProps.opacity);
  }
}

export default StyledWMSLayer;
