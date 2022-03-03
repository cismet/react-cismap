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
import { layerStyleObject } from "./offlineConfig";
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

export const SimpleMapLibreLayerWithLocalStyle = () => {
  const position = [51.2720151, 7.2000203134];
  const [initialized, setInititialized] = useState(false);
  const [online, setOnline] = useState(false);
  const vectorLayerRef = useRef();
  const offlineConfig = {
    index: { origin: "https://omt.map-hosting.de/data/v3.json", cachePath: "v3.json" },
    tiles: { origin: "https://omt.map-hosting.de/data/v3", cachePath: "tiles" },
    glyphs: { origin: "https://omt.map-hosting.de/fonts", cachePath: "fonts" },
    styles: { origin: "https://omt.map-hosting.de/styles", cachePath: "styles" },
    block: {
      origin: "https://events.mapbox.com/events/v2?access_token=multipass",
      block: true,
    },
  };

  useEffect(() => {
    // navigator.serviceWorker.controller.postMessage({
    //   type: "SETCARMAOFFLINECONFIG",
    //   offline: !online,
    //   config,
    // });
    // (async () => {
    //   console.log("zzz startup");
    //   const massiveFileBuf = await fetch("/data/wupp.zip").then((res) => res.arrayBuffer());
    //   const massiveFile = new Uint8Array(massiveFileBuf);
    //   const decompressed = fflate.unzipSync(massiveFile);
    //   for (const entryKey of Object.keys(decompressed)) {
    //     if (
    //       !entryKey.startsWith("_") &&
    //       !entryKey.endsWith(".DS_Store") &&
    //       decompressed[entryKey].length !== 0
    //     ) {
    //       console.log("zzz entry", entryKey, decompressed[entryKey]);
    //       await await db["omtCache"].put({ key: entryKey, value: decompressed[entryKey] });
    //     }
    //   }
    //   // console.log("zzz zip", decompressed);
    // })();
  }, []);
  console.log("zzz navigator.serviceWorker.controller", navigator.serviceWorker.controller);

  return (
    <div>
      <Map style={mapStyle} center={position} zoom={15} maxZoom={25}>
        {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        opacity={1}
      /> */}

        {/* <MapLibreLayer style={localKlokantechBasic} /> */}
        {/* <MapLibreLayer style={localOSMBright} /> */}
        {/* <Pane name="backgroundLayers" style={{ zIndex: 1100 }}>
          <StyledWMSTileLayer
            key={"asd"}
            url="https://maps.wuppertal.de/deegree/wms"
            layers="R102:trueortho202010"
            opacity={1}
            maxZoom={25}
          />
        </Pane> */}

        <MapLibreLayer
          key={"MapLibreLayer.online:" + online}
          ref={vectorLayerRef}
          style="https://omt.map-hosting.de/styles/osm-bright/style.json"
          pane="vectorLayers2"
          // opacity={0.01}
          // iconOpacity={1}
          // textOpacity={1}
          offlineConfig={offlineConfig}
          offline={online === false}
          cache={db}
        />
      </Map>
      <br></br>
      <button
        onClick={() => {
          (async () => {
            console.time("zzz fillCache");

            console.log("zzz startup");
            const massiveFileBuf = await fetch(
              "/data/vectortiles/wuppertal/Archive.zip"
            ).then((res) => res.arrayBuffer());
            const massiveFile = new Uint8Array(massiveFileBuf);
            const decompressed = fflate.unzipSync(massiveFile);
            // console.log("___ decompressed", decompressed);

            const items = [];
            for (const entryKey of Object.keys(decompressed)) {
              if (
                !entryKey.startsWith("_") &&
                !entryKey.endsWith(".DS_Store") &&
                decompressed[entryKey].length !== 0
              ) {
                // console.log("zzz entry", entryKey, decompressed[entryKey]);
                //await await db["omtCache"].put({ key: entryKey, value: decompressed[entryKey] });
                // console.log(
                //   "___ FileType.fromBuffer(buffer)",
                //   await FileType.fromBuffer(decompressed[entryKey])
                // );

                items.push({ key: entryKey, value: decompressed[entryKey] });
              }
            }
            await await db["vectorTilesCache"].bulkPut(items);

            console.log("zzz done (" + items.length + ")");
            console.timeEnd("zzz fillCache");
          })();
        }}
      >
        cache initialisieren
      </button>{" "}
      <button
        onClick={() => {
          // (async () => {
          //   try {
          //     const x = await db["vectorTilesCache"].get("sprite/sprite@2x.json");
          //     // var blob = await new Blob(x.value, {
          //     //   type: "application/json",
          //     // });
          //     const r = new Response(x.value);
          //     console.log("zzz hit", r);
          //   } catch (e) {
          //     console.log("error", e);
          //   }
          // })();
          console.log("mapBoxMap", vectorLayerRef?.current?.mapBoxMap);
          // console.log("test", vectorLayerRef?.current?.mapBoxMap.style);
          // vectorLayerRef.current.mapBoxMap.style.update();
        }}
      >
        test
      </button>{" "}
      <button
        onClick={() => {
          const newOnlineStatus = !online;
          setOnline(newOnlineStatus);
          // const message = {
          //   type: "SETCARMAOFFLINECONFIG",
          //   offline: !newOnlineStatus,
          //   config,
          // };
          // console.log("message", JSON.stringify(message, null, 2));

          // navigator.serviceWorker.controller.postMessage(message);
        }}
      >
        {online ? "Online" : "Offline"}
      </button>
      {/* <progress max="100">70 %</progress> */}
    </div>
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
  let re = new RegExp(/customOffline:\/\/(.+)\/(\d+)\/(\d+)\/(\d+)/);

  const position = [51.2720151, 7.2000203134];
  console.log("maplibregl", maplibreGl);
  useEffect(() => {
    maplibreGl.addProtocol("customOffline", (params, callback) => {
      let result = params.url.match(re);
      let url = result[1];

      // if (!pmtiles_instances.has(pmtiles_url)) {
      //     pmtiles_instances.set(pmtiles_url,new pmtiles.PMTiles(pmtiles_url))
      // }
      // let instance = pmtiles_instances.get(pmtiles_url)
      // let z = result[2]
      // let x = result[3]
      // let y = result[4]
      // instance.getZxy(+z,+x,+y).then(val => {
      //     if (val) {
      //         let headers = {'Range':'bytes=' + val[0] + '-' + (val[0]+val[1]-1)}
      //         fetch(pmtiles_url,{headers:headers}).then(resp => {
      //             return resp.arrayBuffer()
      //         }).then(arr => {
      //             callback(null,arr,null,null)
      //         })
      //     } else {
      //         callback(null,new Uint8Array(),null,null)
      //     }
      // })
      return {
        cancel: () => {
          console.log("Cancel not implemented");
        },
      };
    });
  }, []);

  return (
    <Map style={mapStyle} center={position} zoom={18} maxZoom={25}>
      <MapLibreLayer style={layerStyleObject} />
    </Map>
  );
};
