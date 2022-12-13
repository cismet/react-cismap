import React, { useEffect, useRef, useState } from "react";

import { featureDefaults, parkscheinautomaten } from "../_data/Demo";
import { uwz } from "../_data/Demo";
import { MappingConstants, RoutedMap } from "../..";
import ProjGeoJson from "../../ProjGeoJson";
import ProjSingleGeoJson from "../../ProjSingleGeoJson";
import { storiesCategory } from "./StoriesConf";

export default {
  title: storiesCategory + "ProjGeoJson",
};

const mapStyle = {
  height: 600,
  cursor: "pointer",
};
console.log("parkscheinautomaten", parkscheinautomaten);

export const GeoJSONCollectionInTheMap = () => {
  const psas = [];
  for (let psa of parkscheinautomaten) {
    psa = { ...featureDefaults, ...psa };
    psas.push(psa);
  }
  console.log("uwz", uwz);

  return (
    <div>
      <div>Simple Map with projected GeoJSON Collection</div>
      <div>(Hint: better use the FeatureCollectionDisplay)</div>

      <br />

      <RoutedMap
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap"}
        referenceSystem={MappingConstants.crs25832}
        referenceSystemDefinition={MappingConstants.proj4crs25832def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={"ruhrWMSlight@35"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        fallbackPosition={{
          lat: 51.25921139902955,
          lng: 7.174172824023925,
        }}
        fallbackZoom={9}
      >
        <ProjGeoJson
          style={(feature) => {
            return { radius: 10 };
          }}
          featureCollection={uwz}
        />
      </RoutedMap>
    </div>
  );
};

export const SingleGeoJSONInTheMap = () => {
  return (
    <div>
      <div>Simple Map with single projected GeoJSON </div>

      <br />

      <RoutedMap
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap"}
        referenceSystem={MappingConstants.crs25832}
        referenceSystemDefinition={MappingConstants.proj4crs25832def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={"ruhrWMSlight@35"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        fallbackPosition={{
          lat: 51.232514081338664,
          lng: 7.079167379960522,
        }}
        fallbackZoom={10}
      >
        <ProjSingleGeoJson
          masked={false}
          style={(feature) => {
            return { radius: 10 };
          }}
          geoJson={uwz[0]}
        />
      </RoutedMap>
    </div>
  );
};

export const SingleInvertedGeoJSONInTheMap = () => {
  return (
    <div>
      <div>Simple Map with inverted single projected GeoJSON </div>

      <br />

      <RoutedMap
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap"}
        referenceSystem={MappingConstants.crs25832}
        referenceSystemDefinition={MappingConstants.proj4crs25832def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={"ruhrWMSlight@35"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        fallbackPosition={{
          lat: 51.232514081338664,
          lng: 7.079167379960522,
        }}
        fallbackZoom={10}
      >
        <ProjSingleGeoJson
          masked={true}
          style={(feature) => {
            return { color: "red" };
          }}
          geoJson={uwz[0]}
        />
      </RoutedMap>
    </div>
  );
};
