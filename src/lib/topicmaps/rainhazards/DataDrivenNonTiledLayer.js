// import NonTiledLayer from "leaflet.nontiledlayer";
import OwnImageOverlay from "../../leafletExtension/OwnImageOverlay";
import { MapLayer } from "react-leaflet";
import { ImageOverlay } from "leaflet";
import React from "react";
import { getIntermediateImage } from "./helper";
import rainHazardWorker from "workerize-loader!./rainHazardWorker"; // eslint-disable-line import/no-webpack-loader-syntax

let worker = rainHazardWorker();

// import "./leafletExtension/CanvasLayer";
// import L from "leaflet";

// input. props.data0
// input. props.data1

export class DataDrivenNonTiledLayer extends MapLayer {
  constructor(props) {
    super(props);
    this.canvas = document.createElement("canvas");
  }
  // createLeafletElement(props) {
  //   console.log("createLeafletElement", props);

  //   const layer = new OwnImageOverlay(this.canvas, props.bounds, {});
  //   // this.updateLeafletElement(undefined, props);
  //   return layer;
  // }

  createLeafletElement(props) {
    //calculate the average of the two data arrays that are contained in props.data0.data and props.data1.data
    // weighted with the two weights in props.data0Weight and props.data1Weight

    const data0 = props.data0.data;
    const data1 = props.data1.data;

    const data0Weight = props.data0Weight;
    const data1Weight = props.data1Weight;

    let weightedMean;
    let red, green, blue, alpha;
    if (data0Weight === 0) {
      weightedMean = data1;
    } else if (data1Weight === 0) {
      weightedMean = data0;
    } else {
      weightedMean = new Uint8ClampedArray(data0.length);
      for (let i = 0; i < data0.length; i += 4) {
        if (data0[i + 3] === 0) {
          red = 255 * data0Weight + data1[i] * data1Weight;
          green = 255 * data0Weight + data1[i + 1] * data1Weight;
          blue = 255 * data0Weight + data1[i + 2] * data1Weight;
        } else if (data1[i + 3] === 0) {
          red = data0[i] * data0Weight + 255 * data1Weight;
          green = data0[i + 1] * data0Weight + 255 * data1Weight;
          blue = data0[i + 2] * data0Weight + 255 * data1Weight;
        } else {
          red = data0[i] * data0Weight + data1[i] * data1Weight;
          green = data0[i + 1] * data0Weight + data1[i + 1] * data1Weight;
          blue = data0[i + 2] * data0Weight + data1[i + 2] * data1Weight;
        }

        alpha = data0[i + 3] * data0Weight + data1[i + 3] * data1Weight;

        weightedMean[i] = red;
        weightedMean[i + 1] = green;
        weightedMean[i + 2] = blue;
        weightedMean[i + 3] = alpha;
      }
    }
    const idata = new ImageData(weightedMean, props.data0.width, props.data0.height);
    // const idata = new ImageData(props.data0.data, props.data0.width, props.data0.height);

    this.canvas.width = props.data0.width;
    this.canvas.height = props.data0.height;
    const ctx = this.canvas.getContext("2d");
    ctx.putImageData(idata, 0, 0);

    const dataURL = this.canvas.toDataURL();

    const layer = new ImageOverlay(dataURL, props.bounds);

    //vielleicht noch etwas schneller mit putIMagedata auf canvas ???

    // const layer = new NonTiledLayer({ ...props });
    // const ctx = this.canvas.getContext("2d");
    // ctx.putImageData(idata, 0, 0);
    // layer._ctx.putImageData(idata, 0, 0);
    // console.log("layer", layer._ctx, layer);

    layer.setOpacity(props.opacity);
    return layer;
  }
  componentDidMount() {
    super.componentDidMount();
  }
  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
    // this.leafletElement.setOpacity(toProps.opacity);
  }
}

export default DataDrivenNonTiledLayer;
