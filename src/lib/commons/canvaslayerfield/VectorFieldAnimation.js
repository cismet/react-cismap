import { MapLayer } from "react-leaflet";
import L from "leaflet";

import "./_main";

import "./layer/L.CanvasLayer.Field";
import * as d3 from "d3v4";
window.d3 = d3;
const NO_DATA_GRID = L.VectorField.fromASCIIGrids(
  `ncols        1
	nrows        1
	xllcorner    7.195475301563
	yllcorner    51.270322489917
	cellsize     0.000012217020
	NODATA_value  -1
	 -1.0`,
  `ncols        1
	 nrows        1
	 xllcorner    7.195475301563
	 yllcorner    51.270322489917
	 cellsize     0.000012217020
	 NODATA_value  -1
	  -1.0`,
  0.001
);

const getBBoxForBounds = (bounds) => {
  return [
    bounds._southWest.lng,
    bounds._northEast.lat,
    bounds._northEast.lng,
    bounds._southWest.lat,
  ];
};
// const service = 'http://127.0.0.1:8881';
// const worker = new Worker();

class VectorFieldAnimation extends MapLayer {
  constructor(props, context) {
    super(props, context);
    window.d3 = d3;
    this.context = context;
    this.timers = [];
    this.state = { isLoadingAnimationData: true };
  }

  setLoadingAnimationData(isLoadingAnimationData) {
    //this.setState({ isLoadingAnimationData });
  }
  createLeafletElement() {
    // console.log('VFA: createleafletElement');

    let vf = NO_DATA_GRID;

    // let vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], scaleFactor);
    let that = this;
    setTimeout(() => {
      // console.log('VFA: createleafletElement: updateLayer()');

      that.updateLayer(that.props.bbox);
      // that.leafletElement.initialized = true;
    }, 10);
    const l = L.canvasLayer.vectorFieldAnim(vf, this.props.settings);
    l.bbox = "NO_DATA";
    return l;
  }
  updateLeafletElement(fromProps, toProps) {
    if (this.leafletElement) {
      if (this.leafletElement.timer && this.leafletElement.initialized === true) {
        this.leafletElement.timer.stop();
      }
      const bounds = this.context.map.getBounds();
      const bbox = getBBoxForBounds(bounds);
      if (this.leafletElement.bbox === JSON.stringify(bbox)) {
        // console.log('VFA: same bbox: do nothing');
      } else {
        // console.log('VFA: componentDidUpdate: call updateLayer');
        this.updateLayer(toProps.bbox);
      }
    }
  }

  updateLayer(bbox) {
    this.leafletElement.bbox = JSON.stringify(bbox);

    if (this.leafletElement.timer && this.leafletElement.initialized === true) {
      this.leafletElement.timer.stop();
      console.log("VFA: stop timer");
    }
    this.setLoadingAnimationData(true);

    let format = "image/tiff";

    let url_u = `${this.props.service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&LAYERS=docs/${this.props.layerPrefix}u84.tif&FORMAT=${format}`;
    let url_v = `${this.props.service}/gdalProcessor?REQUEST=translate&SRS=EPSG:4326&BBOX=${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]}&LAYERS=docs/${this.props.layerPrefix}v84.tif&FORMAT=${format}`;

    var urls = [url_u, url_v];

    // var promises = urls.map((url) => fetch(url).then((r) => r.text()));
    let promises;
    if (format === "image/tiff") {
      promises = urls.map((url) => fetch(url).then((r) => r.arrayBuffer()));
    } else {
      //text
      promises = urls.map((url) => fetch(url).then((r) => r.text()));
    }
    let that = this;

    setTimeout(() => {
      Promise.all(promises).then(function (arrays) {
        let scaleFactor = 0.001; // to m/s

        //let
        let vf;
        if (format === "image/tiff") {
          vf = L.VectorField.fromGeoTIFFs(arrays[0], arrays[1], scaleFactor);
        } else {
          //text
          vf = L.VectorField.fromASCIIGrids(arrays[0], arrays[1], scaleFactor);
        }

        // console.log('VFA: updateLayer: after vectorfield creation', vf);

        // console.log('VFA: updateLayer: before vectorfield update');
        that.leafletElement._field = vf;

        //that.leafletElement = layer;
        that.leafletElement.initialized = true;
        // console.log(
        // 	'VFA: updateLayer: vectorfield updated',
        // 	that.leafletElement.initialized
        // );

        // fromASCIIGridsWithWorker(arrays[0], arrays[1], scaleFactor, (vf) => {
        // 	console.log('parallel:VFA: updateLayer: after vectorfield creation', vf);

        // 	var range = vf.range;
        // 	var scale = chroma.scale('OrRd').domain(range);

        // 	console.log('VFA: updateLayer: before vectorfield update');
        // 	that.leafletElement._field = vf;

        // 	//that.leafletElement = layer;
        // 	that.leafletElement.initialized = true;
        // 	console.log(
        // 		'VFA: updateLayer: vectorfield updated',
        // 		that.leafletElement.initialized
        // 	);
        // });
      });
    }, 1);
  }
}

export default VectorFieldAnimation;
