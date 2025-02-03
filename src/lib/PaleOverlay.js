import L from "leaflet";
import { GridLayer } from "react-leaflet";

class PaleOverlay extends GridLayer {
  createLeafletElement(props) {
    const opacity = this.props.opacity || 1;
    const EEE = L.GridLayer.extend({
      createTile: function (coords) {
        var tile = document.createElement("div");
        tile.style.background = `rgba(255, 255, 255, ${opacity})`;
        return tile;
      },
    });
    const layer = new EEE({
      pane: "additionalLayers0",
    });

    return layer;
  }

  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
  }
}

export default PaleOverlay;
