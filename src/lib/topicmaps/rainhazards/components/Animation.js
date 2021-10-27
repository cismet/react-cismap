import area from "@turf/area";
import bboxPolygon from "@turf/bbox-polygon";
import React, { useContext } from "react";
import VectorFieldAnimation from "../../../commons/canvaslayerfield/VectorFieldAnimation";
import { TopicMapContext } from "../../../contexts/TopicMapContextProvider";

const Animation = ({ rasterfariURL, layerPrefix, layerPostfix = "", minAnimationZoom = 17 }) => {
  const { routedMapRef } = useContext(TopicMapContext);
  const mapRef = routedMapRef?.leafletMap?.leafletElement;
  const currentZoom = mapRef?.getZoom();
  if (currentZoom >= minAnimationZoom) {
    let vectorFieldAnimationSettings, currentBBox, currentMapArea;
    const settingsForZoom = {
      17: { paths: 1700, velocityScale: 1 / 200, fade: 80 / 100, age: 50 },
      18: { paths: 1750, velocityScale: 1 / 400, fade: 83 / 100, age: 80 },
      19: { paths: 1800, velocityScale: 1 / 800, fade: 86 / 100, age: 110 },
      20: { paths: 1850, velocityScale: 1 / 1600, fade: 89 / 100, age: 140 },
      21: { paths: 1800, velocityScale: 1 / 3200, fade: 92 / 100, age: 170 },
      22: { paths: 800, velocityScale: 1 / 4000, fade: 95 / 100, age: 200 },
    };
    if (mapRef !== undefined) {
      const bounds = mapRef.getBounds();

      if (currentZoom >= minAnimationZoom) {
        currentBBox = [
          bounds._southWest.lng,
          bounds._northEast.lat,
          bounds._northEast.lng,
          bounds._southWest.lat,
        ];
        const bboxpoly = bboxPolygon(currentBBox);
        currentMapArea = area(bboxpoly);

        const paths = Math.sqrt(currentMapArea) * 8;

        vectorFieldAnimationSettings = {
          paths, //: settingsForZoom[currentZoom].paths, //-- default 800
          fade: settingsForZoom[currentZoom].fade, // 0 to 1 -- default 0.96
          velocityScale: settingsForZoom[currentZoom].velocityScale, // -- default 1/ 5000
          maxAge: settingsForZoom[currentZoom].age, // number of maximum frames per path  -- default 200
          width: 1.0, // number | function widthFor(value)  -- default 1.0
          duration: 20, // milliseconds per 'frame'  -- default 20,
          color: "#326C88", // html-color | function colorFor(value) [e.g. chromajs.scale]   -- default white
          uvCorrection: { u: -1, v: -1 },
        };
      }
    }
    return (
      <VectorFieldAnimation
        key={"VFA:" + currentZoom + "."}
        layerPrefix={layerPrefix}
        layerPostfix={layerPostfix}
        bbox={currentBBox}
        settings={vectorFieldAnimationSettings}
        service={rasterfariURL}
      />
    );
  } else {
    return null;
  }
};

export default Animation;
