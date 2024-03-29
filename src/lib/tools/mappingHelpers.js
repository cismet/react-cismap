import polylabel from "polylabel";
import { proj4crs25832def, projectionData } from "../constants/gis";
import proj4 from "proj4";

import intersect from "@turf/intersect";
import * as turfHelpers from "@turf/helpers";
import bboxPolygon from "@turf/bbox-polygon";

export function getPolygonfromBBox(bbox) {
  return (
    "POLYGON((" +
    bbox.left +
    " " +
    bbox.top +
    "," +
    bbox.right +
    " " +
    bbox.top +
    "," +
    bbox.right +
    " " +
    bbox.bottom +
    "," +
    bbox.left +
    " " +
    bbox.bottom +
    "," +
    bbox.left +
    " " +
    bbox.top +
    "))"
  );
}

export function getLabelPosition(feature) {
  if (feature.geometry.type === "Polygon") {
    return getLabelPositionForPolygon(feature.geometry.coordinates);
  }
  if (feature.geometry.type === "MultiPolygon") {
    if (feature.geometry.coordinates.length === 1) {
      return getLabelPositionForPolygon(feature.geometry.coordinates[0]);
    } else {
      return getLabelPositionForPolygon(feature.geometry.coordinates[0]);
    }
  }
}

function getLabelPositionForPolygon(coordinates) {
  return polylabel(coordinates);
}

export function convertBBox2Bounds(bbox, refDef = proj4crs25832def) {
  const projectedNE = proj4(refDef, proj4.defs("EPSG:4326"), [bbox[0], bbox[1]]);
  const projectedSW = proj4(refDef, proj4.defs("EPSG:4326"), [bbox[2], bbox[3]]);
  return [
    [projectedNE[1], projectedSW[0]],
    [projectedSW[1], projectedNE[0]],
  ];
}

export function convertPoint(x, y, refDef = proj4crs25832def) {
  let xval;
  let yval;
  if (typeof x === "string") {
    xval = parseFloat(x);
  }
  if (typeof y === "string") {
    yval = parseFloat(y);
  }
  const projectedPoint = proj4(proj4.defs("EPSG:4326"), refDef, [yval, xval]);
  return projectedPoint;
}

export const convertFeatureCollectionToMarkerPositionCollection = (
  featureCollection,
  boundingBox,
  simplifyProperties = (featureProperties) => {
    return featureProperties;
  }
) => {
  let markerFeatures = [];
  let selectedmarkerFeatures = [];
  let viewBBox;
  if (boundingBox) {
    let bbox = [boundingBox.left, boundingBox.bottom, boundingBox.right, boundingBox.top];
    viewBBox = bboxPolygon(bbox);
  } else {
    // console.log("no viewbox");
  }
  let markerPos = [];

  for (let currentFeature of featureCollection) {
    let marker = JSON.parse(JSON.stringify(currentFeature)); //deep clone
    marker.properties = simplifyProperties(marker.properties);
    marker.id = "mrk." + marker.id;

    if (
      currentFeature.geometry.type === "Polygon" ||
      (currentFeature.geometry.type === "MultiPolygon" &&
        currentFeature.geometry.coordinates.length === 1)
    ) {
      //console.log("Polygon");
      let coordinates = null;
      if (currentFeature.geometry.type === "Polygon") {
        coordinates = currentFeature.geometry.coordinates;
      } else {
        //must currentFeature.geometry.type==='MultiPolygon' && currentFeature.geometry.coordinates.length===1
        coordinates = currentFeature.geometry.coordinates[0];
      }
      marker.geometry = createPolygonMarkerGeometry(coordinates, viewBBox, markerPos);
      if (currentFeature.selected === true) {
        selectedmarkerFeatures.push(marker);
      } else {
        markerFeatures.push(marker);
      }
    } else if (
      currentFeature.geometry.type === "MultiPolygon" &&
      currentFeature.geometry.coordinates.length > 1
    ) {
      //console.log("Multipolygon mit "+currentFeature.geometry.coordinates.length);
      for (let currentsubfeatureIdx in currentFeature.geometry.coordinates) {
        let subMarker = JSON.parse(JSON.stringify(marker)); //deep clone
        subMarker.id = subMarker.id + "." + currentsubfeatureIdx;

        let coordinates = currentFeature.geometry.coordinates[currentsubfeatureIdx];
        subMarker.geometry = createPolygonMarkerGeometry(coordinates, viewBBox, markerPos);
        if (currentFeature.selected === true) {
          selectedmarkerFeatures.push(subMarker);
        } else {
          markerFeatures.push(subMarker);
        }
      }
    } else if (currentFeature.geometry.type === "Point") {
      //don't change the geometry since it is already a point
      if (currentFeature.selected === true) {
        selectedmarkerFeatures.push(marker);
      } else {
        markerFeatures.push(marker);
      }
    }
  }
  //Add the selected mf's at the end
  for (let midx of selectedmarkerFeatures) {
    markerFeatures.push(midx);
  }
  return markerFeatures;
};

const createPolygonMarkerGeometry = (coordinates, viewBBox, markerPos) => {
  //get the subfeature into a polygon

  let polygon = turfHelpers.polygon(coordinates);
  let newPoly;
  if (viewBBox) {
    newPoly = intersect(viewBBox, polygon);
  }
  let pointOnPolygon = null;
  if (newPoly) {
    pointOnPolygon = getLabelPosition(newPoly); //if there is a multipolygon created from the boundingbox intersects use the first
  } else {
    pointOnPolygon = polylabel(coordinates);
  }

  if (isNaN(pointOnPolygon[0])) {
    pointOnPolygon = polylabel(coordinates);
  }
  let offset = [];

  if (markerPos.includes(pointOnPolygon[0] + "-" + pointOnPolygon[1])) {
    offset = [2, 2];
  } else {
    offset = [0, 0]; //check with b-plan regression (it was before [-2,-2])
  }

  markerPos.push(pointOnPolygon[0] + "-" + pointOnPolygon[1]);

  return {
    type: "Point",
    coordinates: [pointOnPolygon[0] - offset[0], pointOnPolygon[1] - offset[1]],
  };
};

export const convertPolygonLatLngsToGeoJson = ({
  id,
  latlngs,
  crs = "25832",
  type = "Feature",
  properties,
}) => {
  const feature = {
    id,
    type,
    geometry: {
      type: "Polygon",
      coordinates: [],
    },
    crs: projectionData[crs].geojson,
    properties,
  };

  for (const firstLevel of latlngs) {
    const resultArray = [];
    for (const latlng of firstLevel) {
      const coord = proj4(proj4.defs("EPSG:4326"), projectionData[crs].def, [
        latlng.lng,
        latlng.lat,
      ]);
      resultArray.push(coord);
    }
    feature.geometry.coordinates.push(resultArray);
  }

  return feature;
};
