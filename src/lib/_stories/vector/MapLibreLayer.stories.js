import Dexie from "dexie";
import * as fflate from "fflate";
import maplibreGl from "maplibre-gl";
import React, { useEffect, useRef, useState } from "react";
import { Map } from "react-leaflet";

import { kassenzeichen } from "../_data/Editing.Storybook.data";
import { MappingConstants } from "../..";
import TopicMapContextProvider from "../../contexts/TopicMapContextProvider";
import FeatureCollectionDisplay from "../../FeatureCollectionDisplay";
import RoutedMap from "../../RoutedMap";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import { customOfflineFetch, loadAndCacheOfflineMapData } from "../../tools/offlineMapsHelper";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import MapLibreLayer from "../../vector/MapLibreLayer";
import { getGazData } from "../complex/StoriesConf";
import { layerStyleObject, offlineConfig } from "./offlineConfig";

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
      {/* <StyledWMSTileLayer
        key={"asd"}
        url="https://maps.wuppertal.de/deegree/wms"
        layers="R102:trueortho202010"
        opacity={1}
      /> */}
    </Map>
  );
};

export const SimpleMapLibreLayerRedrawingitself = () => {
  const position = [51.2720151, 7.2000203134];
  const [counter, setCounter] = useState(0);
  const [active, setActive] = useState(false);
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    setInterval(() => {
      if (activeRef.current) {
        setCounter((counter) => {
          console.log("counter", counter);

          return counter + 1;
        });
      }
    }, 500);
  }, []);

  return (
    <div>
      <div>
        <input
          onChange={() => {
            setActive((a) => !a);
            console.log("changed");
          }}
          type="checkbox"
          name="d"
          checked={active}
        ></input>
        <label style={{ paddingLeft: 10 }} htmlFor="d">
          Destroy and recreate
        </label>
      </div>
      <Map style={mapStyle} center={position} zoom={18} maxZoom={25}>
        {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        opacity={1}
      /> */}
        {/* {getLayersByNames("ruhrWMSlight@50")} */}
        {counter % 2 === 0 && (
          <MapLibreLayer
            // opacity={0.5}
            // accessToken={"dd"}
            style="https://omt.map-hosting.de/styles/klokantech-basic/style.json"
            _style="http://localhost:888/styles/osm-bright/style.json"
          />
        )}
        {/* <StyledWMSTileLayer
        key={"asd"}
        url="https://maps.wuppertal.de/deegree/wms"
        layers="R102:trueortho202010"
        opacity={1}
      /> */}
      </Map>
    </div>
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
          <MapLibreLayer style="https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_col.jsonn" />
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
            opacity={0.2}
            style="https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/styles/bm_web_col.json"
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
      // layerkey: "trueOrtho2020@60|OMT_Klokantech_basic@100",
      layerkey: "basemap_grey@10",
      src: "/images/rain-hazard-map-bg/citymap.png",
      opacity: 0.5,
      title: "Basemap.de (Grau)",
    },
    vector2: {
      // layerkey: "OMT_OSM_bright@100",
      layerkey: "basemap_color@20",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Basemap.de (Farbe)",
    },
    vector3: {
      layerkey: "basemap_relief@40",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Basemap.de (Relief)",
    },
  };
  const backgroundModes = [
    {
      title: "Basemap.de (Grau)",
      mode: "default",
      layerKey: "vector1",
    },
    {
      title: "Basemap.de (Farbe)",
      mode: "default",
      layerKey: "vector2",
    },
    {
      title: "Basemap.de (Relief)",
      mode: "default",
      layerKey: "vector3",
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
      additionalLayerConfiguration={{
        depth2018: {
          title: "Starkregen 2018 (max. Wassertiefe)",
          initialActive: false,
          layer: (
            <StyledWMSTileLayer
              key={"depth"}
              url="https://starkregenwms-wuppertal.cismet.de/geoserver/wms?SERVICE=WMS"
              layers="starkregen:L_Extrem2018_depth3857"
              styles="starkregen:depth"
              format="image/png"
              tiled="true"
              transparent="true"
              pane="additionalLayers3"
              opacity={1}
              maxZoom={19}
            />
          ),
        },
      }}
    >
      <TopicMapComponent maxZoom={22} gazData={gazData}>
        {/* <StyledWMSTileLayer
          key={"fernwaermewsw"}
          url="https://maps.wuppertal.de/deegree/wms"
          layers="fernwaermewsw"
          format="image/png"
          tiled="true"
          transparent="true"
          pane="additionalLayers3"
          maxZoom={19}
          opacity={0.7}
        /> */}

        {/* <StyledWMSTileLayer
          key={"ortho22"}
          url="https://maps.wuppertal.de/deegree/wms"
          layers="R102:trueortho2022"
          format="image/png"
          tiled="true"
          transparent="true"
          pane="additionalLayers3"
          maxZoom={19}
          opacity={0.7}
        /> */}
        {/* <StyledWMSTileLayer
          key={"ortho22"}
          url="https://starkregenwms-wuppertal.cismet.de/geoserver/wms?SERVICE=WMS"
          layers="starkregen:L_Extrem2018_depth3857"
          styles="starkregen:depth"
          format="image/png"
          tiled="true"
          transparent="true"
          pane="additionalLayers3"
          opacity={0.01}
          maxZoom={19}
          opacity={0.7}
        /> */}
        {/* <StyledWMSTileLayer
          key={"depth"}
          url="https://starkregenwms-wuppertal.cismet.de/geoserver/wms?SERVICE=WMS"
          layers="starkregen:L_Extrem2018_depth3857"
          styles="starkregen:depth"
          format="image/png"
          tiled="true"
          transparent="true"
          pane="additionalLayers3"
          opacity={01}
          maxZoom={25}
        /> */}
      </TopicMapComponent>
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
      //let url = params.url.replace("indexedDB://", "");
      let url = params.url;
      console.log("indexedDB:: url", url);

      // fetchy(url, callback);
      // return;
      // customOfflineFetch(url, offlineConfig, callback);

      if (url.indexOf("ausnahmeregel_im_moment_gibts_da_nix") > -1) {
        fetchy(url, callback);
      } else {
        customOfflineFetch(url, offlineConfig).then((buffer) => {
          if (buffer) {
            callback(null, buffer, null, null);
          } else {
            callback(null, new ArrayBuffer(), null, null);
          }
        });
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
