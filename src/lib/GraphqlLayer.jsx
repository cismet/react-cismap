import React, { useEffect, useState } from "react";
import FeatureCollectionDisplay from "./FeatureCollectionDisplay";
import { isEqual } from "lodash";
import { getBoundingBoxForLeafletMap } from "./tools/gisHelper";
import { proj4crs25832def, projectionData } from "./constants/gis";
import bboxPolygon from "@turf/bbox-polygon";
import { reproject } from "reproject";

export const STATUS = {
  LOADING: "LOADING",
  LOADED: "LOADED",
  ERROR: "ERROR",
  NOT_ALLOWED: "NOT_ALLOWED",
};
const GraphqlLayer = ({
  useHover,
  onMouseOver,
  onMouseOut,
  style,
  referenceSystemDefinition,
  hoveredStyle,
  featureClickHandler,
  query,
  generateVariables = (bbPoly) => {
    return { bbPoly: bbPoly };
  },
  endpoint,
  jwt,
  createFeature,
  opacity = 1,
  mapRef,
  fetchAllowed,
  onStatus,
}) => {
  const [feature, setFeature] = useState();
  const [hoveredFeature, setHoveredFeature] = useState(undefined);
  const [bbPoly, setBBPoly] = useState({ bbPoly: null });

  const getBBPoly = (leafletElement) => {
    const bbox = getBoundingBoxForLeafletMap(leafletElement, referenceSystemDefinition);
    const bbPoly = createQueryGeomFromBB(bbox);
    return bbPoly;
  };

  useEffect(() => {
    //add listener to map
    const map = mapRef?.current?.leafletMap;
    if (map && map.leafletElement) {
      const bbPoly = getBBPoly(map);
      setBBPoly(bbPoly);
      const moveendListener = () => {
        const bbPoly = getBBPoly(map);
        setBBPoly(bbPoly);
      };
      const listener = map.leafletElement.on("moveend", moveendListener);
      return () => {
        map.leafletElement.off("moveend", moveendListener);
      };
    }
  }, [mapRef]);

  const myVirtHoverer = () => {
    const mouseoverHov = (feature) => {
      setHoveredFeature(feature);
      if (onMouseOver) {
        onMouseOver(feature);
      }
    };

    const mouseoutHov = () => {
      setHoveredFeature(undefined);
      if (onMouseOut) {
        onMouseOut();
      }
    };

    return { mouseoverHov, mouseoutHov };
  };
  myVirtHoverer.virtual = true;

  const fetchFeatureCollection = () => {
    const bodyO = {
      query: query,
      variables: generateVariables(bbPoly),
    };
    onStatus(STATUS.LOADING);

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(bodyO),
    })
      .then((response) => {
        if (!response.ok) {
          setFeature(undefined);
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        setFeature(createFeature(result.data));
        onStatus(STATUS.LOADED);
      })
      .catch((error) => {
        onStatus(STATUS.ERROR);
        setFeature(undefined);
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    if (fetchAllowed(bbPoly)) {
      fetchFeatureCollection();
    } else {
      setFeature(undefined);
      onStatus(STATUS.NOT_ALLOWED);
    }
  }, [bbPoly]);

  return (
    <FeatureCollectionDisplay
      featureCollection={feature}
      hoverer={useHover ? myVirtHoverer : null}
      style={(feature) => {
        if (feature?.id === hoveredFeature?.id) {
          return { fillOpacity: opacity, ...hoveredStyle };
        } else {
          return { fillOpacity: opacity, ...style };
        }
      }}
      featureClickHandler={featureClickHandler}
    />
  );
};

export default GraphqlLayer;

export const createQueryGeomFromBB = (boundingBox) => {
  const geom = bboxPolygon([
    boundingBox.left,
    boundingBox.top,
    boundingBox.right,
    boundingBox.bottom,
  ]).geometry;
  geom.crs = {
    type: "name",
    properties: {
      name: "urn:ogc:def:crs:EPSG::25832",
    },
  };
  const reprojectedGeoJSON = reproject(
    {
      type: "Feature",
      geometry: geom,
      properties: {},
    },
    projectionData["3857"].def,
    projectionData["25832"].def
  );
  const updatedGeom = reprojectedGeoJSON.geometry;
  updatedGeom.crs = {
    type: "name",
    properties: {
      name: "urn:ogc:def:crs:EPSG::25832",
    },
  };

  return updatedGeom;
};
