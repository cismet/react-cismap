// import NonTiledLayer from "leaflet.nontiledlayer";
import OwnImageOverlay from "../../leafletExtension/OwnImageOverlay";
import { MapLayer } from "react-leaflet";
import { ImageOverlay } from "leaflet";
import React from "react";
import { getIntermediateImage } from "./helper";
import rainHazardWorker from "workerize-loader!./rainHazardWorker"; // eslint-disable-line import/no-webpack-loader-syntax
import { getWeightedMean } from "./rainHazardWorker";

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
  createLeafletElement(props) {
    const layer = new OwnImageOverlay(this.canvas, props.bounds, {});
    this.updateLeafletElement(undefined, props);
    return layer;
  }

  componentDidMount() {
    super.componentDidMount();
  }
  async updateLeafletElement(fromProps, toProps) {
    const props = toProps;

    const data0 = props.data0.data;
    const data1 = props.data1.data;

    const data0Weight = props.data0Weight;
    const data1Weight = props.data1Weight;

    //Alternative 0: naive impl : funzt
    // let weightedMean;
    // let red, green, blue, alpha;
    // if (data0Weight === 0) {
    //   weightedMean = data1;
    // } else if (data1Weight === 0) {
    //   weightedMean = data0;
    // } else {
    //   weightedMean = new Uint8ClampedArray(data0.length);
    //   for (let i = 0; i < data0.length; i += 4) {
    //     if (data0[i + 3] === 0) {
    //       red = 255 * data0Weight + data1[i] * data1Weight;
    //       green = 255 * data0Weight + data1[i + 1] * data1Weight;
    //       blue = 255 * data0Weight + data1[i + 2] * data1Weight;
    //     } else if (data1[i + 3] === 0) {
    //       red = data0[i] * data0Weight + 255 * data1Weight;
    //       green = data0[i + 1] * data0Weight + 255 * data1Weight;
    //       blue = data0[i + 2] * data0Weight + 255 * data1Weight;
    //     } else {
    //       red = data0[i] * data0Weight + data1[i] * data1Weight;
    //       green = data0[i + 1] * data0Weight + data1[i + 1] * data1Weight;
    //       blue = data0[i + 2] * data0Weight + data1[i + 2] * data1Weight;
    //     }

    //     alpha = data0[i + 3] * data0Weight + data1[i + 3] * data1Weight;

    //     weightedMean[i] = red;
    //     weightedMean[i + 1] = green;
    //     weightedMean[i + 2] = blue;
    //     weightedMean[i + 3] = alpha;
    //   }
    // }

    //Alternative 1 (der code des workers wird genutzt, aber nicht als worker): vorteil keine duplication : funzt
    let weightedMean = await getWeightedMean(data0, data1, data0Weight, data1Weight);
    const idata = new ImageData(weightedMean, props.data0.width, props.data0.height);

    this.canvas.width = props.data0.width;
    this.canvas.height = props.data0.height;
    const ctx = this.canvas.getContext("2d");
    ctx.putImageData(idata, 0, 0);
    this.leafletElement.setOpacity(toProps.opacity);

    super.updateLeafletElement(fromProps, toProps);

    //Worker alternative 1 (kein "async" vor updateleaflet nötig): flackert stark
    // worker.getWeightedMean(data0, data1, data0Weight, data1Weight).then((weightedMean) => {
    //   const idata = new ImageData(weightedMean, props.data0.width, props.data0.height);

    //   this.canvas.width = props.data0.width;
    //   this.canvas.height = props.data0.height;
    //   const ctx = this.canvas.getContext("2d");
    //   ctx.putImageData(idata, 0, 0);
    //   this.leafletElement.setOpacity(toProps.opacity);

    //   super.updateLeafletElement(fromProps, toProps);
    // });

    //Worker alternative 2 (muss "async" vor updateleaflet ): flackert stark
    // const weightedMean = await worker.getWeightedMean(data0, data1, data0Weight, data1Weight);
    // const idata = new ImageData(weightedMean, props.data0.width, props.data0.height);

    // this.canvas.width = props.data0.width;
    // this.canvas.height = props.data0.height;
    // const ctx = this.canvas.getContext("2d");
    // ctx.putImageData(idata, 0, 0);
    // this.leafletElement.setOpacity(toProps.opacity);

    // super.updateLeafletElement(fromProps, toProps);
  }
}

export default DataDrivenNonTiledLayer;
