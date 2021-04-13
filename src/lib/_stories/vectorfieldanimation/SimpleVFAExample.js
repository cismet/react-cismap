import React, { useContext, useEffect, useRef, useState } from "react";
import { MappingConstants } from "../..";
import { Map, Marker, Popup, TileLayer, WMSTileLayer } from "react-leaflet";

import RoutedMap from "../../RoutedMap";

import MapLibreLayer from "../../vector/MapLibreLayer";
import getLayersByNames from "../../tools/layerFactory";
import { kassenzeichen } from "../_data/Editing.Storybook.data";
import FeatureCollectionDisplay from "../../FeatureCollectionDisplay";
import { getGazData } from "../complex/StoriesConf";
import TopicMapContextProvider, { TopicMapContext } from "../../contexts/TopicMapContextProvider";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import FeatureCollection from "../../FeatureCollection";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import VectorFieldAnimation from "../../commons/canvaslayerfield/VectorFieldAnimation";
import bboxPolygon from "@turf/bbox-polygon";
import area from "@turf/area";

const mapStyle = {
  height: 800,
  cursor: "pointer",
};
export const SimpleWuppertal25832 = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  const Animation = () => {
    const MIN_ANIMATION_ZOOM = 13;

    const { routedMapRef } = useContext(TopicMapContext);
    const mapRef = routedMapRef?.leafletMap?.leafletElement;
    const currentZoom = mapRef?.getZoom();
    if (currentZoom > MIN_ANIMATION_ZOOM) {
      let vectorFieldAnimationSettings, currentBBox, currentMapArea;

      const settingsForZoom = {
        13: { paths: 3000, velocityScale: 1 / 200, fade: 80 / 100, age: 50 },
        14: { paths: 2560, velocityScale: 1 / 400, fade: 83 / 100, age: 80 },
        15: { paths: 2120, velocityScale: 1 / 800, fade: 86 / 100, age: 110 },
        16: { paths: 1680, velocityScale: 1 / 1600, fade: 89 / 100, age: 140 },
        17: { paths: 1240, velocityScale: 1 / 3200, fade: 92 / 100, age: 170 },
        18: { paths: 800, velocityScale: 1 / 4000, fade: 95 / 100, age: 200 },
      };
      if (mapRef !== undefined) {
        const bounds = mapRef.getBounds();

        if (currentZoom >= MIN_ANIMATION_ZOOM) {
          currentBBox = [
            bounds._southWest.lng,
            bounds._northEast.lat,
            bounds._northEast.lng,
            bounds._southWest.lat,
          ];
          const bboxpoly = bboxPolygon(currentBBox);
          currentMapArea = area(bboxpoly);

          const paths = Math.sqrt(currentMapArea) * 8;

          vectorFieldAnimationSettings = {
            paths, // settingsForZoom[currentZoom].paths, //-- default 800
            fade: settingsForZoom[currentZoom].fade, // 0 to 1 -- default 0.96
            velocityScale: settingsForZoom[currentZoom].velocityScale, // -- default 1/ 5000
            maxAge: settingsForZoom[currentZoom].age, // number of maximum frames per path  -- default 200
            width: 1.0, // number | function widthFor(value)  -- default 1.0
            duration: 20, // milliseconds per 'frame'  -- default 20,
            color: "#326C88", // html-color | function colorFor(value) [e.g. chromajs.scale]   -- default white
            uvCorrection: { u: -1, v: -1 },
          };
        }
      }

      // return <div></div>;
      return (
        <VectorFieldAnimation
          key={
            "VFA:" + currentZoom + "."
            // JSON.stringify(currentBBox) +
            // '.' +
            // this.props.starkregen.selectedSimulation +
            // "." +
            // JSON.stringify(
            //   // this.props.match.params.layers ||
            //   this.props.starkregen.backgrounds[validBackgroundIndex].layerkey
            // ) +
            // "." +
            // this.props.uiState.applicationMenuVisible +
            // "." +
            // this.props.starkregen.minifiedInfoBox +
            // "." +
            // this.props.starkregen.featureInfoModeActivated +
            // "." +
            // this.props.starkregen.currentFeatureInfoPosition +
            // "." +
            // this.props.mapping.gazetteerHit +
            // "." +
            // this.props.mapping.overlayFeature +
            // "." +
            // this.props.starkregen.displayMode +
            // "." +
            // dirOpac
          }
          layerPrefix={"11_T50/"}
          bbox={currentBBox}
          settings={vectorFieldAnimationSettings}
          service="https://starkregen-rasterfari-wuppertal.cismet.de"
        />
      );
    } else {
      return null;
    }
  };

  return (
    <TopicMapContextProvider>
      <TopicMapComponent gazData={gazData}>
        <Animation />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const SimpleWuppertal3857 = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  const Animation = () => {
    const MIN_ANIMATION_ZOOM = 13;

    const { routedMapRef } = useContext(TopicMapContext);
    const mapRef = routedMapRef?.leafletMap?.leafletElement;
    const currentZoom = mapRef?.getZoom();
    if (currentZoom > MIN_ANIMATION_ZOOM) {
      let vectorFieldAnimationSettings, currentBBox, currentMapArea;

      const settingsForZoom = {
        13: { paths: 3000, velocityScale: 1 / 200, fade: 80 / 100, age: 50 },
        14: { paths: 2560, velocityScale: 1 / 400, fade: 83 / 100, age: 80 },
        15: { paths: 2120, velocityScale: 1 / 800, fade: 86 / 100, age: 110 },
        16: { paths: 1680, velocityScale: 1 / 1600, fade: 89 / 100, age: 140 },
        17: { paths: 1240, velocityScale: 1 / 3200, fade: 92 / 100, age: 170 },
        18: { paths: 2560, velocityScale: 1 / 400, fade: 83 / 100, age: 80 },
        19: { paths: 2560, velocityScale: 1 / 800, fade: 86 / 100, age: 120 },
        "18_old": { paths: 800, velocityScale: 1 / 4000, fade: 95 / 100, age: 200 },
      };
      if (mapRef !== undefined) {
        const bounds = mapRef.getBounds();

        if (currentZoom >= MIN_ANIMATION_ZOOM) {
          currentBBox = [
            bounds._southWest.lng,
            bounds._northEast.lat,
            bounds._northEast.lng,
            bounds._southWest.lat,
          ];
          const bboxpoly = bboxPolygon(currentBBox);
          currentMapArea = area(bboxpoly);

          const paths = Math.sqrt(currentMapArea) * 8;

          vectorFieldAnimationSettings = {
            paths, // settingsForZoom[currentZoom].paths, //-- default 800
            fade: settingsForZoom[currentZoom].fade, // 0 to 1 -- default 0.96
            velocityScale: settingsForZoom[currentZoom].velocityScale, // -- default 1/ 5000
            maxAge: settingsForZoom[currentZoom].age, // number of maximum frames per path  -- default 200
            width: 1.0, // number | function widthFor(value)  -- default 1.0
            duration: 20, // milliseconds per 'frame'  -- default 20,
            color: "#326C88", // html-color | function colorFor(value) [e.g. chromajs.scale]   -- default white
            uvCorrection: { u: -1, v: -1 },
          };
        }
      }

      // return <div></div>;
      return (
        <VectorFieldAnimation
          key={"VFA:" + currentZoom + "."}
          layerPrefix={"11_T50/"}
          bbox={currentBBox}
          settings={vectorFieldAnimationSettings}
          service="https://starkregen-rasterfari-wuppertal.cismet.de"
        />
      );
    } else {
      return null;
    }
  };

  return (
    <TopicMapContextProvider
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
    >
      <TopicMapComponent gazData={gazData}>
        <Animation />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const SimpleHaltern = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    // getGazData(setGazData);
  }, []);
  //Haltern ?lat=51.7394797334744&lng=7.193347074074905&zoom=9

  const Animation = () => {
    const MIN_ANIMATION_ZOOM = 13;

    const { routedMapRef } = useContext(TopicMapContext);
    const mapRef = routedMapRef?.leafletMap?.leafletElement;
    const currentZoom = mapRef?.getZoom() - 3;
    if (currentZoom > MIN_ANIMATION_ZOOM) {
      let vectorFieldAnimationSettings, currentBBox, currentMapArea;

      const settingsForZoom = {
        13: { paths: 3000, velocityScale: 1 / 200, fade: 80 / 100, age: 50 },
        14: { paths: 2560, velocityScale: 1 / 400, fade: 83 / 100, age: 80 },
        15: { paths: 2120, velocityScale: 1 / 800, fade: 86 / 100, age: 110 },
        16: { paths: 1680, velocityScale: 1 / 1600, fade: 89 / 100, age: 140 },
        17: { paths: 2560, velocityScale: 1 / 400, fade: 83 / 100, age: 80 },
        18: { paths: 2560, velocityScale: 1 / 400, fade: 83 / 100, age: 80 },
        19: { paths: 2560, velocityScale: 1 / 800, fade: 86 / 100, age: 120 },
      };
      if (mapRef !== undefined) {
        const bounds = mapRef.getBounds();

        if (currentZoom >= MIN_ANIMATION_ZOOM) {
          currentBBox = [
            bounds._southWest.lng,
            bounds._northEast.lat,
            bounds._northEast.lng,
            bounds._southWest.lat,
          ];
          const bboxpoly = bboxPolygon(currentBBox);
          currentMapArea = area(bboxpoly);

          const paths = Math.sqrt(currentMapArea) * 8;

          vectorFieldAnimationSettings = {
            paths, // settingsForZoom[currentZoom].paths, //-- default 800
            fade: settingsForZoom[currentZoom].fade, // 0 to 1 -- default 0.96
            velocityScale: settingsForZoom[currentZoom].velocityScale, // -- default 1/ 5000
            maxAge: settingsForZoom[currentZoom].age, // number of maximum frames per path  -- default 200
            width: 1.0, // number | function widthFor(value)  -- default 1.0
            duration: 20, // milliseconds per 'frame'  -- default 20,
            color: "#326C88", // html-color | function colorFor(value) [e.g. chromajs.scale]   -- default white
            uvCorrection: { u: -1, v: -1 },
          };
        }
      }

      // return <div></div>;
      return (
        <VectorFieldAnimation
          key={"VFA:" + currentZoom + "."}
          layerPrefix={"11_T50/"}
          bbox={currentBBox}
          settings={vectorFieldAnimationSettings}
          service="https://demo-rasterfari-haltern.map-hosting.de"
        />
      );
    } else {
      return null;
    }
  };
  //Haltern ?lat=51.7394797334744&lng=7.193347074074905&zoom=9
  return (
    <TopicMapContextProvider
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      maxZoom={22}
    >
      <TopicMapComponent
        home={[51.7394797334744, 7.193347074074905]}
        homeZoom={9}
        maxZoom={22}
        gazData={gazData}
      >
        <Animation />

        <WMSTileLayer
          key={
            "rainHazardMap.velocityLayer"

            // +
            // this.props.match.params.layers
          }
          url="https://geodaten.metropoleruhr.de/dop/dop"
          layers={"DOP"}
          version="1.1.1"
          transparent="true"
          format="image/png"
          tiled="true"
          styles="default"
          // _sld='https://gist.githubusercontent.com/helllth/d922f098870fd8097b4e2659ea005f49/raw/c7fca5ddb2c64aea29e1d0463df73522dd53ed3b/velocity.sld'
          maxZoom={22}
          opacity={0.31}
          caching={false}
        />
        <WMSTileLayer
          key={
            "rainHazardMap.velocityLayer"

            // +
            // this.props.match.params.layers
          }
          url="https://demo-starkregen-haltern.map-hosting.de/geoserver/wms?SERVICE=WMS"
          layers={"S11_T50_velocity"}
          version="1.1.1"
          transparent="true"
          format="image/png"
          tiled="true"
          styles="starkregen:velocity"
          // _sld='https://gist.githubusercontent.com/helllth/d922f098870fd8097b4e2659ea005f49/raw/c7fca5ddb2c64aea29e1d0463df73522dd53ed3b/velocity.sld'
          maxZoom={22}
          opacity={1}
          caching={false}
        />
        {/* <WMSTileLayer
          key={
            "rainHazardMap.velocityLayer"

            // +
            // this.props.match.params.layers
          }
          url="https://demo-starkregen-haltern.map-hosting.de/geoserver/wms?SERVICE=WMS"
          layers={"S11_T50_depth"}
          version="1.1.1"
          transparent="true"
          format="image/png"
          tiled="true"
          styles="starkregen:depth"
          // _sld='https://gist.githubusercontent.com/helllth/d922f098870fd8097b4e2659ea005f49/raw/c7fca5ddb2c64aea29e1d0463df73522dd53ed3b/velocity.sld'
          maxZoom={19}
          opacity={1}
          caching={false}
        /> */}
        <WMSTileLayer
          key={
            "rainHazardMap.velocityLayer"

            // +
            // this.props.match.params.layers
          }
          url="https://demo-starkregen-haltern.map-hosting.de/geoserver/wms?SERVICE=WMS"
          layers={"S11_T50_direction"}
          version="1.1.1"
          transparent="true"
          format="image/png"
          tiled="true"
          styles="starkregen:direction"
          // _sld='https://gist.githubusercontent.com/helllth/d922f098870fd8097b4e2659ea005f49/raw/c7fca5ddb2c64aea29e1d0463df73522dd53ed3b/velocity.sld'
          maxZoom={22}
          opacity={1}
          caching={false}
        />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};
