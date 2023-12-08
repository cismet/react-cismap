import React from "react";
import { useState } from "react";
import GraphqlLayer from "../../GraphqlLayer";
import { storiesCategory } from "./StoriesConf";
import RoutedMap from "../../RoutedMap";
import bboxPolygon from "@turf/bbox-polygon";
import { reproject } from "reproject";
import { projectionData } from "../../constants/gis";
import { concat, flatten } from "lodash";
import { MappingConstants } from "../..";
import getArea from "@turf/area";
import proj4 from "proj4";

export default {
  title: storiesCategory + "GraphqlLayer",
};

export const Lanparcels = (args) => {
  const [hoveredProperties, setHoveredProperties] = useState({});
  const [bbPoly, setBBPoly] = useState();
  const jwt =
    "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIxMyIsInN1YiI6ImNpc21ldCIsImRvbWFpbiI6IkxBR0lTIiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJlZGl0b3IiLCJ1c2VyIiwibW9kIl19fQ.WpuNOtRRaH4Z4Cnx3UvavDe2McuAk8sdrl_vpGllTo37dAqDZ7k1CcTcpdKEvAxFnr3-RjXA-9kZlacu2Fo12yOkc8rGIZBvnnXZca_QQbEdDfE6ZgH3gBvuLnqk4W6kNW6TxP0UxPDKvu7Ly4Q8BbdpKVgrstCbzd8uGVVLlhGHaIA8vM76k1zQ5ozsEBllfuHQl3YdvgA6v_Aq3ib2I5li_B4IPj54_rwBYq4ZQRacjQGnoXA4h9vCTyftpqQtqO_pXZFFJri0NrNQkYauBKTSvh801YVwVyHHr1lKs9yRxqQs4yl1nqyn2TvvwFF2_-mTh0Eso2GwqB4auuUYTw";
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

  const getWGS84GeoJSON = (geoJSON) => {
    try {
      const reprojectedGeoJSON = reproject(geoJSON, projectionData["25832"].def, proj4.WGS84);

      return reprojectedGeoJSON;
    } catch (e) {
      return undefined;
    }
  };

  const getArea25832 = (geoJSON) => {
    const wGS84GeoJSON = getWGS84GeoJSON(geoJSON);
    if (wGS84GeoJSON !== undefined) {
      return getArea(wGS84GeoJSON);
    }
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

  const mapStyle = {
    height: 600,
    cursor: "pointer",
  };
  return (
    <div>
      <div>Simple Map with Graphql Hover Layer</div>

      <br />
      <RoutedMap
        style={mapStyle}
        referenceSystem={MappingConstants.crs3857}
        referenceSystemDefinition={MappingConstants.proj4crs3857def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={"ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={25}
        zoomSnap={0.5}
        zoomDelta={0.5}
        boundingBoxChangedHandler={(boundingBox) => {
          const bbPoly = createQueryGeomFromBB(boundingBox);
          const area = getArea25832(bbPoly);
          const maxAreaForSearch = 130000;
          if (area < maxAreaForSearch && area !== 0) {
            setBBPoly(bbPoly);
          }
        }}
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
