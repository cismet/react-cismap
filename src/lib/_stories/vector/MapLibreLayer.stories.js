import Dexie from "dexie";
import * as fflate from "fflate";
import React, { useEffect, useRef, useState } from "react";
import { Map } from "react-leaflet";
import { MappingConstants } from "../..";
import TopicMapContextProvider from "../../contexts/TopicMapContextProvider";
import FeatureCollectionDisplay from "../../FeatureCollectionDisplay";
import RoutedMap from "../../RoutedMap";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import MapLibreLayer from "../../vector/MapLibreLayer";
import { getGazData } from "../complex/StoriesConf";
import { kassenzeichen } from "../_data/Editing.Storybook.data";
import { layerStyleObject, offlineConfig } from "./offlineConfig";
import { customOfflineFetch, loadAndCacheOfflineMapData } from "../../tools/offlineMapsHelper";
import maplibreGl from "maplibre-gl";

const DBVERSION = 1;
const DBNAME = "carma";
const BAGNAME = "vectorTilesCache";
export const db = new Dexie(DBNAME);
db.version(DBVERSION).stores({
  vectorTilesCache: "key",
});
const mapStyle = {
  height: 800,
  cursor: "pointer",
};
const testStyle = "http://localhost:888/styles/klokantech-basic/style.json";

export const SimpleMapLibreLayer = () => {
  const position = [51.2720151, 7.2000203134];

  return (
    <Map style={mapStyle} center={position} zoom={18} maxZoom={25}>
      {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        opacity={1}
      /> */}
      {/* {getLayersByNames("ruhrWMSlight@50")} */}
      <MapLibreLayer
        // opacity={0.5}
        // accessToken={"dd"}
        style="https://omt.map-hosting.de/styles/klokantech-basic/style.json"
        _style="http://localhost:888/styles/osm-bright/style.json"
      />
      <StyledWMSTileLayer
        key={"asd"}
        url="https://maps.wuppertal.de/deegree/wms"
        layers="R102:trueortho202010"
        opacity={1}
      />
    </Map>
  );
};

export const SimpleMapLibreLayerInRoutedMap = () => {
  const position = [51.2720151, 7.2000203134];
  const [showMapLibre, setShowMapLibre] = useState(true);
  const mapRef = useRef(null);

  return (
    <div>
      <div>SimpleMapLibreLayerInRoutedMap</div>
      <a
        onClick={() => {
          setShowMapLibre(!showMapLibre);
        }}
      >
        Toggle
      </a>
      <br />

      <RoutedMap
        ref={mapRef}
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap"}
        referenceSystem={MappingConstants.crs3857}
        referenceSystemDefinition={MappingConstants.proj4crs3857def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={showMapLibre ? "" : "ruhrWMSlight@100"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={22}
        zoomSnap={0.5}
        zoomDelta={0.5}
      >
        {showMapLibre && (
          <MapLibreLayer
            accessToken={"dd"}
            _style="http://localhost:888/styles/klokantech-basic/style.json"
            style="http://localhost:888/styles/osm-bright/style.json"
          />
        )}
      </RoutedMap>
    </div>
  );
};

export const SimpleMapLibreLayerInRoutedMapWithFeatureCollectionInAnotherCRS = () => {
  const position = [51.2720151, 7.2000203134];
  const [showMapLibre, setShowMapLibre] = useState(true);
  const mapRef = useRef(null);

  return (
    <div>
      <div>SimpleMapLibreLayerInRoutedMap</div>
      <a
        onClick={() => {
          setShowMapLibre(!showMapLibre);
        }}
      >
        Toggle
      </a>
      <br />

      <RoutedMap
        ref={mapRef}
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap"}
        referenceSystem={MappingConstants.crs3857}
        referenceSystemDefinition={MappingConstants.proj4crs3857def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={showMapLibre ? "" : "ruhrWMSlight@100"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={22}
        zoomSnap={0.5}
        zoomDelta={0.5}
      >
        {showMapLibre && (
          <MapLibreLayer
            _style="http://localhost:888/styles/klokantech-basic/style.json"
            style="http://localhost:888/styles/osm-bright/style.json"
          />
        )}

        <FeatureCollectionDisplay
          key={"FeatureCollectionDisplay"}
          style={(feature) => {
            return {};
          }}
          mapRef={(mapRef.current || {}).leafletMap}
          featureCollection={kassenzeichen}
          showMarkerCollection={true}
          markerStyle={(feature) => {
            let opacity = 0.6;
            let linecolor = "#000000";
            let weight = 1;

            const style = {
              color: linecolor,
              weight: weight,
              opacity: 1.0,
              fillOpacity: opacity,
              svgSize: 100,
              className:
                "classNameForMarkerToAvoidDoubleSVGclassbehaviour-" + feature.properties.bez,
              svg: `<svg height="100" width="100">
                              <style>
                                  .flaeche { font: bold 12px sans-serif; }
                              </style>
                      
                              <text 
                                  x="50" y="50" 
                                  class="flaeche" 
                                  text-anchor="middle" 
                                  alignment-baseline="central" 
                                  fill="#0B486B">${feature.properties.bez}</text>
                            </svg>`,
            };

            return style;
          }}
        />
      </RoutedMap>
    </div>
  );
};

export const SimpleTopicMapWithMapLibreLayer = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);
  const backgroundConfigurations = {
    stadtplan: {
      layerkey: "wupp-plan-live@90",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    lbk: {
      layerkey: "trueOrtho2020@75|OMT_Klokantech_basic@50",
      src: "/images/rain-hazard-map-bg/ortho.png",
      title: "Luftbildkarte",
    },
    Lvector1: {
      layerkey: "LocalOMT_Klokantech_basic@100",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    Lvector2: {
      layerkey: "LocalOMT_OSM_bright@100",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    vector1: {
      layerkey: "trueOrtho2020@60|OMT_Klokantech_basic@100",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    vector2: {
      layerkey: "OMT_OSM_bright@100",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
  };
  const backgroundModes = [
    {
      title: "Vektorbasierter Layer (Klokantech Basic)",
      mode: "default",
      layerKey: "vector1",
    },
    {
      title: "Vektorbasierter Layer (OSM bright)",
      mode: "default",
      layerKey: "vector2",
    },
    {
      title: "Stadtplan (RVR, zum Vergleich)",
      mode: "default",
      layerKey: "stadtplan",
    },
  ];
  return (
    <TopicMapContextProvider
      backgroundConfigurations={backgroundConfigurations}
      backgroundModes={backgroundModes}
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
    >
      <TopicMapComponent maxZoom={22} gazData={gazData}></TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const SimpleMapLibreLayerWithAttribution = () => {
  const position = [51.2720151, 7.2000203134];

  return (
    <Map style={mapStyle} center={position} zoom={18} maxZoom={25}>
      {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        opacity={1}
      /> */}
      {/* {getLayersByNames("ruhrWMSlight@50")} */}
      <MapLibreLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        // opacity={0.5}
        // accessToken={"dd"}
        style="https://omt.map-hosting.de/styles/klokantech-basic/style.json"
        _style="http://localhost:888/styles/osm-bright/style.json"
      />
      {/* <StyledWMSTileLayer
        key={"asd"}
        url="https://maps.wuppertal.de/deegree/wms"
        layers="R102:trueortho202010"
        opacity={1}
      /> */}
    </Map>
  );
};

export const SimpleMapLibreLayerWithCustomProtocol = () => {
  const position = [51.2720151, 7.2000203134];
  console.log("maplibregl", maplibreGl);

  const layerConf = { ...layerStyleObject };
  layerConf.glyphs = "indexedDB://" + layerConf.glyphs;
  layerConf.sources.openmaptiles.tiles[0] =
    "indexedDB://" + layerConf.sources.openmaptiles.tiles[0];

  // because we are not using OfflineLayerCacheContext we nee to load the stuff manually
  useEffect(() => {
    loadAndCacheOfflineMapData(offlineConfig, (key, info) => {
      console.log("loadAndCacheOfflineMapData", key, info);
    });

    const fetchy = (url, callback) => {
      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((buf) => {
          console.log("fetched bufX", buf);
          callback(null, buf, null, null);
        });
    };

    maplibreGl.addProtocol("indexedDB", (params, callback) => {
      let url = params.url.replace("indexedDB://", "");
      console.log("indexedDB:: url", url);

      // fetchy(url, callback);

      // customOfflineFetch(url, offlineConfig, callback);

      if (url.indexOf("ausnahmeregel_im_moment_gibts_da_nix") > -1) {
        fetchy(url, callback);
      } else {
        customOfflineFetch(url, offlineConfig, callback);
      }

      return {
        cancel: () => {
          console.log("Cancel not implemented");
        },
      };
    });
  }, []);

  return (
    <Map style={mapStyle} center={position} zoom={18} maxZoom={25}>
      <MapLibreLayer style={layerConf} />
    </Map>
  );
};
