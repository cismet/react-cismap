import React from "react";
import FeatureCollectionDisplay from "../../../FeatureCollectionDisplay";

const Layer = ({
  currentFeatureInfoPosition,
  currentFeatureInfoValue,
  upperleftX,
  upperleftY,
  pixelsize,
}) => {
  if (currentFeatureInfoPosition) {
    let x, y;

    const size = pixelsize || 1.613669350976827;
    const half = size / 2;

    const clickX = currentFeatureInfoPosition[0];
    const clickY = currentFeatureInfoPosition[1];

    const xCorrection = (clickX - upperleftX) % size;
    const yCorrection = (clickY - upperleftY) % size;

    x = clickX - xCorrection + half;
    y = clickY - yCorrection - half;

    const geoJsonObject = {
      id: 0,
      type: "Feature",
      geometry_: {
        type: "Point",
        coordinates: [x, y],
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [x - half, y - half],
            [x + half, y - half],
            [x + half, y + half],
            [x - half, y + half],
            [x - half, y - half],
          ],
        ],
      },
      crs: {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:EPSG::3857",
        },
      },
      properties: {
        value: currentFeatureInfoValue,
      },
    };

    return (
      <FeatureCollectionDisplay
        featureCollection={[geoJsonObject]}
        clusteringEnabled={false}
        // style={getFeatureStyler(currentMarkerSize, getColorForProperties)}
        style={() => ({
          color: "black",
          fillColor: "black",
          weight: "0.75",
          opacity: 1,
          fillOpacity: 0.3,
        })}
        featureStylerScalableImageSize={30}
        showMarkerCollection={true}
        //markerCollectionTransformation={}
        //markerStyle={getMarkerStyleFromFeatureConsideringSelection}
      />
    );
  } else {
    return null;
  }
};
export default Layer;
