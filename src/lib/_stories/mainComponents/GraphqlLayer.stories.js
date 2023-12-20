import React, { useRef } from "react";
import { useState } from "react";
import GraphqlLayer, { createQueryGeomFromBB } from "../../GraphqlLayer";
import { storiesCategory } from "./StoriesConf";
import RoutedMap from "../../RoutedMap";
import bboxPolygon from "@turf/bbox-polygon";
import { reproject } from "reproject";
import { projectionData } from "../../constants/gis";
import { concat, flatten } from "lodash";
import { MappingConstants } from "../..";
import getArea from "@turf/area";
import proj4 from "proj4";
import CismapLayer from "../../CismapLayer";

export default {
  title: storiesCategory + "GraphqlLayer",
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
const jwt =
  "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIxMSIsInN1YiI6ImNpc21ldCIsImRvbWFpbiI6IkxBR0lTIiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1kZWZhdWx0LXJvbGUiOiJ1c2VyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJlZGl0b3IiLCJ1c2VyIiwibW9kIl19fQ.KgMq9vmhZOe7dPlbdDphxxRKkB3dfKxoaNcrkc5ZybFsgb4NqLR3DmLaNeqpSPJIC7VJoudkoILbkryXZqIiWMe6vSQUl-EvHZxlxsuJWsBrQ0FEjUrtpek6PAEiwZfnpxylSSDShZ4CErrHK9nCKed5Um8IBOGnf1SsIhodDk53TJfLTXIBQBdy7S7P_XafPMvgxMchoodyzre9cSDZNJZoUB6Aq1m3-ZPxmZdiAY0_oow5l3TbLBaiAmLyPsainFBRK1jywKzA6Dh84fQxfmwsUAAI4Sk9-M-lXVyF43iWnKfCLIOQWX3dBZT7t-MHrbkd0ZPwFS1-WPoeJD_1DA";
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

export const Landparcels = (args) => {
  const [hoveredProperties, setHoveredProperties] = useState({});
  const [bbPoly, setBBPoly] = useState();
  const mapRef = useRef(null);

  return (
    <div>
      <div>Simple Map with Graphql Hover Layer</div>

      <div>
        {hoveredProperties?.gemarkung}, {hoveredProperties?.flur},{" "}
        {hoveredProperties?.fstck_zaehler}
      </div>

      <br />
      <RoutedMap
        ref={mapRef}
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
        fallbackZoom={18}
      >
        <GraphqlLayer
          jwt={jwt}
          referenceSystemDefinition={MappingConstants.proj4crs3857def}
          mapRef={mapRef}
          query={query}
          endpoint={ENDPOINT}
          fetchAllowed={(bbPoly) => {
            const area = getArea25832(bbPoly);
            const maxAreaForSearch = 130000;
            return area < maxAreaForSearch && area !== 0;
          }}
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
          // ---- Events ----
          onMouseOver={(feature) => {
            setHoveredProperties(feature.properties);
          }}
          onMouseOut={() => {
            setHoveredProperties({});
          }}
          onStatus={(status) => {
            console.log("status", status);
          }}
        />
      </RoutedMap>
    </div>
  );
};

export const LandparcelsFromCismapLayer = (args) => {
  const [hoveredProperties, setHoveredProperties] = useState({});
  const [bbPoly, setBBPoly] = useState();

  const mapRef = useRef(null);

  return (
    <div>
      <div>Simple Map with Graphql Hover Layer</div>

      <div>
        {hoveredProperties?.gemarkung}, {hoveredProperties?.flur},{" "}
        {hoveredProperties?.fstck_zaehler}
      </div>

      <br />
      <RoutedMap
        ref={mapRef}
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
        fallbackZoom={18}
      >
        <CismapLayer
          type="graphql"
          jwt={jwt}
          referenceSystemDefinition={MappingConstants.proj4crs3857def}
          mapRef={mapRef}
          query={query}
          endpoint={ENDPOINT}
          fetchAllowed={(bbPoly) => {
            const area = getArea25832(bbPoly);
            const maxAreaForSearch = 130000;
            return area < maxAreaForSearch && area !== 0;
          }}
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
          // ---- Events ----
          onMouseOver={(feature) => {
            setHoveredProperties(feature.properties);
          }}
          onMouseOut={() => {
            setHoveredProperties({});
          }}
          onStatus={(status) => {
            console.log("status", status);
          }}
        />
      </RoutedMap>
    </div>
  );
};
