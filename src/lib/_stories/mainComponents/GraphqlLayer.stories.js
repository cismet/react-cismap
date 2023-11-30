import { useState } from "react";
import GraphqlLayer from "../../GraphqlLayer";
import { storiesCategory } from "./StoriesConf";
import RoutedMap from "../../RoutedMap";
import bboxPolygon from "@turf/bbox-polygon";
import reproject from "reproject";
import { projectionData } from "../../constants/gis";
import { concat, flatten } from "lodash";

export default {
  title: storiesCategory + "GraphqlLayer",
};

export const TestLayer = (args) => {
  const [hoveredProperties, setHoveredProperties] = useState({});
  const [bbPoly, setBBPoly] = useState();
  const jwt = "";
  const query = `
    query MyQuery($bbPoly: geometry) {
      alkis_landparcel(where: {geom: {geo_field: {_st_intersects: $bbPoly}}}) {
        gemarkung
        flur
        fstck_nenner
        fstck_zaehler
        id
        geom {
          geo_field
        }
      }
    }`;
  const ENDPOINT = "https://wunda-cloud.cismet.de/wunda/api/graphql/WUNDA_BLAU/execute";

  const createQueryGeomFromBB = (boundingBox) => {
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

  const createFeatureArray = (data) => {
    const result = [];

    data.alkis_landparcel.forEach((landparcel) => {
      const feature = {
        type: "Feature",
        featureType: "flaeche",
        id: landparcel.id,
        hovered: false,
        weight: 0.5,
        geometry: {
          type: "Polygon",
          coordinates: [],
        },
        properties: {
          gemarkung: landparcel.gemarkung,
          flur: landparcel.flur,
          fstck_zaehler: landparcel.fstck_zaehler,
          fstck_nenner: landparcel.fstck_nenner,
        },
        crs: {
          type: "name",
          properties: {
            name: "urn:ogc:def:crs:EPSG::25832",
          },
        },
      };

      let coordinates = [];

      coordinates = concat(coordinates, flatten(landparcel.geom.geo_field.coordinates));
      feature.geometry.coordinates = coordinates;
      result.push(feature);
    });

    return result;
  };

  return (
    <div>
      <div>Simple Map with Graphql Hover Layer</div>

      <br />
      <RoutedMap
        boundingBoxChangeHandler={(boundingBox) => setBBPoly(createQueryGeomFromBB(boundingBox))}
      >
        <GraphqlLayer
          jwt={jwt}
          query={query}
          variables={{ bbPoly: bbPoly }}
          endpoint={ENDPOINT}
          style={{
            color: "#00000040",
            fillColor: "#00000020",
            weight: 2,
          }}
          hoveredStyle={{
            color: "#00000040",
            fillColor: "#00000020",
            weight: 4,
          }}
          useHover={true}
          createFeature={createFeatureArray}
          onMouseOver={(feature) => {
            setHoveredProperties(feature.properties);
          }}
          onMouseOut={() => {
            setHoveredProperties({});
          }}
        />
      </RoutedMap>
    </div>
  );
};
