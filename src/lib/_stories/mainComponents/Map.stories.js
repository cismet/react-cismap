import React, { useState, useRef, useEffect } from "react";

import { MappingConstants } from "../..";
import NonTiledWMSLayer from "../../NonTiledWMSLayer";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
// import { Map, TileLayer } from "react-leaflet"; //use the original import
import { TransitiveReactLeaflet } from "../../"; // use the import from the index.js file
const { Map, TileLayer } = TransitiveReactLeaflet;

const conf = {
  lat: 51.25,
  lng: 7.150764,
  zoom: 19,
};

export const Simple = () => {
  return (
    <div>
      <div>Simple Map</div>
      <Map style={{ width: "100%", height: 800 }} center={[conf.lat, conf.lng]} zoom={conf.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
      <br />
    </div>
  );
};

export const SimpleWMS = () => {
  return (
    <div>
      <div>Simple Map</div>
      <Map style={{ width: "100%", height: 800 }} center={[conf.lat, conf.lng]} zoom={conf.zoom}>
        <StyledWMSTileLayer
          {...{
            type: "wmts",
            url: "https://geodaten.metropoleruhr.de/spw2/service",
            layers: "spw2_light_grundriss",
            version: "1.3.0",
            tileSize: 256,
            transparent: true,
          }}
        ></StyledWMSTileLayer>
      </Map>
      <br />
    </div>
  );
};

export const SimpleTrueOrtho = () => {
  return (
    <div>
      <div>Simple Map</div>
      <Map style={{ width: "100%", height: 800 }} center={[conf.lat, conf.lng]} zoom={conf.zoom}>
        <StyledWMSTileLayer
          {...{
            type: "wms",
            url: "https://maps.wuppertal.de/deegree/wms",
            layers: "R102:trueortho202010",
            tileSize: 256,
            transparent: true,
          }}
        ></StyledWMSTileLayer>
      </Map>
      <br />
    </div>
  );
};

export const SimpleNonTiledTrueOrtho = () => {
  return (
    <div>
      <div>Simple Map</div>
      <Map style={{ width: "100%", height: 800 }} center={[conf.lat, conf.lng]} zoom={conf.zoom}>
        <NonTiledWMSLayer
          {...{
            type: "wms",
            url: "https://maps.wuppertal.de/deegree/wms",
            layers: "R102:trueortho202010",
            tileSize: 256,
            transparent: true,
          }}
        ></NonTiledWMSLayer>
      </Map>
      <br />
    </div>
  );
};

export const SimpleTrueOrthoWithText = () => {
  return (
    <div>
      <div>Simple Map</div>
      <Map style={{ width: "100%", height: 800 }} center={[conf.lat, conf.lng]} zoom={conf.zoom}>
        <StyledWMSTileLayer
          {...{
            type: "wms",
            url: "https://maps.wuppertal.de/deegree/wms",
            layers: "R102:trueortho202010",
            tileSize: 256,
            transparent: true,
          }}
        ></StyledWMSTileLayer>
        <NonTiledWMSLayer
          {...{
            type: "wms",
            url: "https://geodaten.metropoleruhr.de/dop/dop_overlay?language=ger",
            layers: "dop_overlay",
            tileSize: 256,
            transparent: true,
            format: "image/png",
          }}
        ></NonTiledWMSLayer>
      </Map>
      <br />
    </div>
  );
};

export const SimpleTrueOrthoWithTextIn25832 = () => {
  const [opacity0, setOpacity0] = useState(0.5);
  const [opacity1, setOpacity1] = useState(1);
  return (
    <div>
      <div>Simple Map</div>
      <Map
        style={{ width: "100%", height: 800 }}
        center={[conf.lat, conf.lng]}
        zoom={11}
        crs={MappingConstants.crs25832}
      >
        {/* <StyledWMSTileLayer
          {...{
            type: "wms",
            url: "https://maps.wuppertal.de/deegree/wms",
            layers: "R102:trueortho202010",
            tileSize: 256,
            transparent: true,
            opacity: opacity0,
          }}
        ></StyledWMSTileLayer> */}
        <StyledWMSTileLayer
          {...{
            type: "wms",
            url: "https://geodaten.metropoleruhr.de/dop/dop_overlay?language=ger",
            layers: "dop_overlay",
            tileSize: 256,
            transparent: true,
            format: "image/png",
            opacity: opacity0,
          }}
        ></StyledWMSTileLayer>
        <NonTiledWMSLayer
          {...{
            type: "wms",
            url: "https://geodaten.metropoleruhr.de/dop/dop_overlay?language=ger",
            layers: "dop_overlay",
            tileSize: 256,
            transparent: true,
            format: "image/png",
            opacity: opacity1,
            buffer: 50,
          }}
        ></NonTiledWMSLayer>
        {/* <StyledWMSTileLayer
          {...{
            type: "wms",
            url: "https://geodaten.metropoleruhr.de/spw2/service",
            layers: "spw2_light_grundriss",
            version: "1.3.0",
            tileSize: 256,
            transparent: true,
            opacity: opacity0,
          }}
        ></StyledWMSTileLayer>xe
        <NonTiledWMSLayer
          {...{
            type: "wms",
            url: "https://geodaten.metropoleruhr.de/spw2/service",
            layers: "spw2_light_grundriss",
            version: "1.3.0",
            tileSize: 256,
            transparent: true,
            opacity: opacity1,
          }}
        ></NonTiledWMSLayer> */}
      </Map>
      TiledLayer:{" "}
      <input
        value={opacity0}
        type="range"
        min="0"
        max="1"
        step="0.01"
        onChange={(e) => {
          setOpacity0(e.target.value);
        }}
      ></input>
      <br></br>
      <br></br>
      NonTiledLayer:{" "}
      <input
        value={opacity1}
        type="range"
        min="0"
        max="1"
        onChange={(e) => {
          setOpacity1(e.target.value);
        }}
        step="0.01"
      ></input>
      <br></br>
      <br />
    </div>
  );
};
