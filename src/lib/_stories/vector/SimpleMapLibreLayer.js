import React, { useEffect, useRef, useState } from "react";
import { MappingConstants } from "../..";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import RoutedMap from "../../RoutedMap";

import MapLibreLayer from "../../vector/MapLibreLayer";
import getLayersByNames from "../../tools/layerFactory";
import { kassenzeichen } from "../_data/Editing.Storybook.data";
import FeatureCollectionDisplay from "../../FeatureCollectionDisplay";
import { getGazData } from "../complex/StoriesConf";
import TopicMapContextProvider from "../../contexts/TopicMapContextProvider";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import FeatureCollection from "../../FeatureCollection";

const mapStyle = {
  height: 800,
  cursor: "pointer",
};
const testStyle = "http://localhost:888/styles/klokantech-basic/style.json";
export const SimpleMapLibreLayer = () => {
  const position = [51.2720151, 7.2000203134];

  return (
    // <div>
    //   <div>SimpleMapLibreLayer</div>
    //   <br />

    //   <RoutedMap
    //     editable={false}
    //     style={mapStyle}
    //     key={"leafletRoutedMap"}
    //     // referenceSystem={MappingConstants.crs25832}
    //     // referenceSystemDefinition={MappingConstants.proj4crs25832def}
    //     doubleClickZoom={false}
    //     onclick={(e) => console.log("click", e)}
    //     ondblclick={(e) => console.log("doubleclick", e)}
    //     backgroundlayers={"ruhrWMSlight@10"}
    //     fullScreenControlEnabled={false}
    //     locateControlEnabled={false}
    //     minZoom={7}
    //     maxZoom={18}
    //     zoomSnap={0.5}
    //     zoomDelta={0.5}
    //   >
    //     {/* <MapLibreLayer /> */}
    //   </RoutedMap>
    // </div>
    <Map style={mapStyle} center={position} zoom={18} maxZoom={25}>
      {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        opacity={1}
      /> */}
      {/* {getLayersByNames("ruhrWMSlight@50")} */}
      {/* {getLayersByNames("trueOrtho2020@50")} */}
      <MapLibreLayer
        opacity={0.5}
        accessToken={"dd"}
        style="http://localhost:888/styles/klokantech-basic/style.json"
        _style="http://localhost:888/styles/osm-bright/style.json"
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
    topo: {
      layerkey: "hillshade|bplan_abkg@30|wupp-plan-live@20",
      src: "/images/rain-hazard-map-bg/topo.png",
      title: "Top. Karte",
    },
    lbk: {
      layerkey: "wupp-plan-live@100|trueOrtho2020@75|rvrSchrift@100",
      src: "/images/rain-hazard-map-bg/ortho.png",
      title: "Luftbildkarte",
    },
    stadtplan: {
      layerkey: "wupp-plan-live@90",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    vector1: {
      layerkey: "LocalOMT_Klokantech_basic@100",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    vector2: {
      layerkey: "LocalOMT_OSM_bright@100",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
  };
  const backgroundModes = [
    {
      title: "Stadtplan",
      mode: "default",
      layerKey: "stadtplan",
    },
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
  ];
  return (
    <TopicMapContextProvider
      backgroundConfigurations={backgroundConfigurations}
      backgroundModes={backgroundModes}
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
    >
      <TopicMapComponent gazData={gazData}></TopicMapComponent>
    </TopicMapContextProvider>
  );
};
