import Dexie from "dexie";
import maplibreGl from "maplibre-gl";
import React, { useEffect, useRef, useState } from "react";
import { Map } from "react-leaflet";

import { MappingConstants } from "../..";
import TopicMapContextProvider from "../../contexts/TopicMapContextProvider";
import FeatureCollectionDisplay from "../../FeatureCollectionDisplay";
import RoutedMap from "../../RoutedMap";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import { customOfflineFetch, loadAndCacheOfflineMapData } from "../../tools/offlineMapsHelper";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import MapLibreLayer from "../../vector/MapLibreLayer";
import { kassenzeichen } from "../_data/Editing.Storybook.data";
import { getGazData } from "../complex/StoriesConf";
import { layerStyleObject, offlineConfig } from "./offlineConfig";
import CismapLayer from "../../CismapLayer";

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
    <Map style={mapStyle} center={position} zoom={14} maxZoom={25}>
      {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        opacity={1}
      /> */}
      {/* {getLayersByNames("ruhrWMSlight@50")} */}
      <MapLibreLayer
        // opacity={0.5}
        // accessToken={"dd"}
        showTileBoundaries={true}
        style="https://omt.map-hosting.de/styles/klokantech-basic/style.json"
        _style="http://localhost:888/styles/osm-bright/style.json"
      />
      {/* <StyledWMSTileLayer
        key={"asd"}
        url="https://maps.wuppertal.de/karten"
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
        url="https://maps.wuppertal.de/karten"
        layers="R102:trueortho2020"
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
export const SimpleTopicMapWithMapLibreLayerToTestHidingForwarding = () => {
  const [gazData, setGazData] = useState([]);

  return (
    <TopicMapContextProvider

      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}

    >
      <TopicMapComponent maxZoom={22} gazData={gazData}>
        <CismapLayer
          {...{
            type: "vector",
            //style: "https://tiles.cismet.de/alkis/flurstuecke.yellow.style.json",
            // style: "https://tiles.cismet.de/alkis/flurstuecke.str.hsnr.yellow.style.json",
            style: "https://tiles.cismet.de/alkis/xxx.flurstuecke.yellow.style.json",
            additionalLayerUniquePane: "bplan",
            opacity: 1,
            additionalLayersFreeZOrder: 9,
            logMapLibreErrors: true,
            logMapLibreDebugLogs: true,
          }} />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
}
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
          url="https://maps.wuppertal.de/infra"
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
          url="https://maps.wuppertal.de/karten"
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
        url="https://maps.wuppertal.de/karten"
        layers="R102:trueortho2020"
        opacity={1}
      /> */}
    </Map>
  );
};

export const SimpleMapLibreLayerWithMapLibreCallback = () => {
  const position = [51.2720151, 7.2000203134];
  const [radius, setRadius] = useState(5);
  const radiusRef = useRef(radius);
  const mapRef = useRef(null);

  // Keep ref in sync with state
  useEffect(() => {
    radiusRef.current = radius;
  }, [radius]);

  return (
    <div>
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        background: 'white',
        padding: '10px 15px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Query Radius: {radius}px
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ width: '200px' }}
        />
      </div>

      <Map ref={mapRef} style={mapStyle} center={position} zoom={18} maxZoom={25}>

        <MapLibreLayer
          style="https://omt.map-hosting.de/styles/klokantech-basic/style.json"
          onMapLibreCoreMapReady={(maplibreMap) => {
            console.log("xxx maplibreMap", maplibreMap);

            // Get the Leaflet map from the ref
            const leafletMap = mapRef.current?.leafletElement;

            // Add a source for highlighting features
            maplibreMap.addSource('highlight', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: []
              }
            });

            // Add a source for the radius circle
            maplibreMap.addSource('radius-circle', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: []
              }
            });

            // Add layers for different geometry types
            // Highlight polygons/fills
            maplibreMap.addLayer({
              id: 'highlight-fill',
              type: 'fill',
              source: 'highlight',
              filter: ['==', ['geometry-type'], 'Polygon'],
              paint: {
                'fill-color': '#ff0000',
                'fill-opacity': 0.3
              }
            });

            // Highlight lines
            maplibreMap.addLayer({
              id: 'highlight-line',
              type: 'line',
              source: 'highlight',
              filter: ['==', ['geometry-type'], 'LineString'],
              paint: {
                'line-color': '#ff0000',
                'line-width': 3
              }
            });

            // Highlight points
            maplibreMap.addLayer({
              id: 'highlight-point',
              type: 'circle',
              source: 'highlight',
              filter: ['==', ['geometry-type'], 'Point'],
              paint: {
                'circle-radius': 8,
                'circle-color': '#ff0000',
                'circle-opacity': 0.5,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }
            });

            // Add radius circle visualization layer
            maplibreMap.addLayer({
              id: 'radius-circle-layer',
              type: 'circle',
              source: 'radius-circle',
              paint: {
                'circle-radius': radiusRef.current,
                'circle-color': '#ffffff',
                'circle-opacity': 0.2,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-stroke-opacity': 0.5
              }
            });

            leafletMap.on('mousemove', (e) => {
              // Get the MapLibre canvas position relative to the page
              const canvas = maplibreMap.getCanvas();
              const rect = canvas.getBoundingClientRect();

              // Calculate the mouse position relative to the MapLibre canvas
              const point = {
                x: e.originalEvent.clientX - rect.left,
                y: e.originalEvent.clientY - rect.top
              };

              // Get current radius from ref
              const currentRadius = radiusRef.current;

              // Update radius circle position
              maplibreMap.getSource('radius-circle').setData({
                type: 'FeatureCollection',
                features: [{
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [e.latlng.lng, e.latlng.lat]
                  }
                }]
              });

              // Update circle radius
              maplibreMap.setPaintProperty('radius-circle-layer', 'circle-radius', currentRadius);

              // Query features using the current radius
              const bbox = [
                [point.x - currentRadius, point.y - currentRadius],
                [point.x + currentRadius, point.y + currentRadius]
              ];

              // Query features but exclude our highlight and radius layers to avoid feedback loop
              let features = maplibreMap.queryRenderedFeatures(bbox, {
                layers: maplibreMap.getStyle().layers
                  .map(layer => layer.id)
                  .filter(id => !id.startsWith('highlight-') && !id.startsWith('radius-'))
              });
              console.log("xxx features found:", features.length);

              // Update the highlight source with the features under the cursor
              if (features.length > 0) {
                maplibreMap.getCanvas().style.cursor = 'pointer';

                // Update the highlight layer with the queried features
                maplibreMap.getSource('highlight').setData({
                  type: 'FeatureCollection',
                  features: features
                });
              } else {
                maplibreMap.getCanvas().style.cursor = '';
                // Clear highlights
                maplibreMap.getSource('highlight').setData({
                  type: 'FeatureCollection',
                  features: []
                });
              }
            });

            // Clear highlights and radius circle when mouse leaves
            leafletMap.on('mouseout', () => {
              maplibreMap.getCanvas().style.cursor = '';
              maplibreMap.getSource('highlight').setData({
                type: 'FeatureCollection',
                features: []
              });
              maplibreMap.getSource('radius-circle').setData({
                type: 'FeatureCollection',
                features: []
              });
            });
          }}
        />

      </Map>
    </div>
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
