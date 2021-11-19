// import NonTiledLayer from "leaflet.nontiledlayer";
import OwnImageOverlay from "../../leafletExtension/OwnImageOverlay";
import { MapLayer } from "react-leaflet";
import { ImageOverlay } from "leaflet";
import React from "react";
import { getIntermediateImage } from "./helper";
import rainHazardWorker from "workerize-loader!./rainHazardWorker"; // eslint-disable-line import/no-webpack-loader-syntax

let worker = rainHazardWorker();

export class ImageDataLayer extends MapLayer {
  constructor(props) {
    super(props);
    this.canvas = document.createElement("canvas");
  }
  createLeafletElement(props) {
    const layer = new OwnImageOverlay(this.canvas, props.bounds, {});
    this.updateLeafletElement(undefined, props, layer);
    return layer;
  }

  updateLeafletElement(fromProps, toProps, layer) {
    this.canvas.width = toProps.data.width;
    this.canvas.height = toProps.data.height;
    const ctx = this.canvas.getContext("2d");
    console.log("toProps", toProps);

    ctx.putImageData(toProps.data, 0, 0);
    super.updateLeafletElement(fromProps, toProps);
    if (layer) {
      //this is called during createLeafletElement
      layer.setOpacity(toProps.opacity);
    } else {
      this.leafletElement.setOpacity(toProps.opacity);
    }
  }
}

export default ImageDataLayer;
