import React, { useState, useRef, useEffect, useContext } from "react";
import { RoutedMap, MappingConstants } from "../../index";
import GazetteerSearchControl from "../../GazetteerSearchControl";
import GazetteerHitDisplay from "../../GazetteerHitDisplay";
import { md5FetchText, fetchJSON } from "../../tools/fetching";
import { getGazDataForTopicIds } from "../../tools/gazetteerHelper";
import ProjSingleGeoJson from "../../ProjSingleGeoJson";
import { storiesCategory } from "./StoriesConf";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import GenericInfoBoxFromFeature from "../../topicmaps/GenericInfoBoxFromFeature";
import FeatureCollectionDisplay from "../../FeatureCollectionDisplay";
import getGTMFeatureStyler, { getColorFromProperties } from "../../topicmaps/generic/GTMStyler";
import FeatureCollection from "../../FeatureCollection";
import InfoBox from "../../topicmaps/InfoBox";
import Control from "react-leaflet-control";
import { TopicMapContextProvider } from "../../contexts/TopicMapContextProvider";
import {
  FeatureCollectionContext,
  FeatureCollectionDispatchContext,
} from "../../contexts/FeatureCollectionContextProvider";
import AppMenu from "../../topicmaps/menu/DefaultAppMenu";
import { getClusterIconCreatorFunction } from "../../tools/uiHelper";
import { Form } from "react-bootstrap";
import { addSVGToProps, DEFAULT_SVG } from "../../tools/svgHelper";
export default {
  title: storiesCategory + "TopicMapComponent",
};

const getGazData = async (setGazData) => {
  const prefix = "GazDataForStories";
  const sources = {};

  sources.adressen = await md5FetchText(
    prefix,
    "https://wunda-geoportal.cismet.de/data/adressen.json"
  );
  sources.bezirke = await md5FetchText(
    prefix,
    "https://wunda-geoportal.cismet.de/data/bezirke.json"
  );
  sources.quartiere = await md5FetchText(
    prefix,
    "https://wunda-geoportal.cismet.de/data/quartiere.json"
  );
  sources.pois = await md5FetchText(prefix, "https://wunda-geoportal.cismet.de/data/pois.json");
  sources.kitas = await md5FetchText(prefix, "https://wunda-geoportal.cismet.de/data/kitas.json");

  const gazData = getGazDataForTopicIds(sources, [
    "pois",
    "kitas",
    "bezirke",
    "quartiere",
    "adressen",
  ]);

  setGazData(gazData);
};

export const MostSimpleTopicMap = () => {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent gazData={[]} />
    </TopicMapContextProvider>
  );
};

export const MostSimpleTopicMapWithGazetteerData = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);
  return (
    <TopicMapContextProvider>
      <TopicMapComponent gazData={gazData} />
    </TopicMapContextProvider>
  );
};

export const SimpleTopicMap = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider featureItemsURL="/data/parkscheinautomatenfeatures.json">
      <TopicMapComponent gazData={gazData}>
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const SimpleTopicMapWithDefaultInfoBox = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider featureItemsURL="/data/parkscheinautomatenfeatures.json">
      <TopicMapComponent gazData={gazData} infoBox={<GenericInfoBoxFromFeature pixelwidth={300} />}>
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const SimpleTopicMapWithInfoBox = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider featureItemsURL="/data/parkscheinautomatenfeatures.json">
      <TopicMapComponent
        gazData={gazData}
        infoBox={
          <GenericInfoBoxFromFeature
            config={{
              city: "Wuppertal",
              header: "Parkscheinautomat",
              navigator: {
                noun: {
                  singular: "Parkscheinautomat",
                  plural: "Parkscheinautomaten",
                },
              },
              noCurrentFeatureTitle: "Keine Parkscheinautomaten gefunden",
              noCurrentFeatureContent: "",
            }}
          />
        }
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const SimpleTopicMapWithCustomStyling = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider
      getFeatureStyler={getGTMFeatureStyler}
      getColorFromProperties={getColorFromProperties}
      clusteringEnabled={true}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, getColorFromProperties),
      }}
      featureItemsURL="/data/parkscheinautomatenfeatures.json"
    >
      <TopicMapComponent
        gazData={gazData}
        infoBox={
          <GenericInfoBoxFromFeature
            config={{
              city: "Wuppertal",
              header: "Parkscheinautomat",
              navigator: {
                noun: {
                  singular: "Parkscheinautomat",
                  plural: "Parkscheinautomaten",
                },
              },
              noCurrentFeatureTitle: "Keine Parkscheinautomaten gefunden",
              noCurrentFeatureContent: "",
            }}
          />
        }
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const SimpleTopicMapWithFullClusteringOptionsAndStyling = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider
      getFeatureStyler={getGTMFeatureStyler}
      getColorFromProperties={getColorFromProperties}
      clusteringEnabled={true}
      clusteringOptions={{
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
        maxClusterRadius: 40,
        disableClusteringAtZoom: 19,
        animate: false,
        cismapZoomTillSpiderfy: 12,
        selectionSpiderfyMinZoom: 12,
        colorizer: getColorFromProperties,
        clusterIconSize: 30,
        iconCreateFunction: getClusterIconCreatorFunction(30, getColorFromProperties),
      }}
      featureItemsURL="/data/parkscheinautomatenfeatures.json"
    >
      <TopicMapComponent gazData={gazData} infoBox={<GenericInfoBoxFromFeature pixelwidth={400} />}>
        <FeatureCollection itemsUrl="/data/parkscheinautomatenfeatures.json" />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

const convertBPKlimaItemsToFeature = async (itemIn) => {
  let item = await addSVGToProps(itemIn, (i) => i.thema.icon);
  const text = item?.standort?.name || "Kein Standort";
  const type = "Feature";
  const selected = false;
  const geometry = item?.standort?.geojson;
  const color = item?.thema?.farbe;
  // item.svg=DEFAULT_SVG.code;
  item.color = item?.thema.farbe;
  const info = {
    header: item.thema.name,
    title: text,
    additionalInfo: item?.beschreibung,
    subtitle: (
      <span>
        {item?.standort?.strasse} {item?.standort?.hausnummer}
        <br />
        {item?.standort?.plz} {item?.standort?.stadt}
      </span>
    ),
  };
  item.info = info;
  item.url = item?.website;

  return {
    text,
    type,
    selected,
    geometry,
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:EPSG::25832",
      },
    },
    properties: item,
  };
};

export const TopicMapWithWithItemConverter = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider
      featureItemsURL="/data/bpklima.data.json"
      getFeatureStyler={getGTMFeatureStyler}
      convertItemToFeature={convertBPKlimaItemsToFeature}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
      }}
      clusteringEnabled={true}
    >
      <TopicMapComponent
        gazData={gazData}
        infoBox={
          <GenericInfoBoxFromFeature
            pixelwidth={400}
            config={{
              city: "Wuppertal",
              navigator: {
                noun: {
                  singular: "Standort",
                  plural: "Standorte",
                },
              },
              noCurrentFeatureTitle: "Keine Standorte gefunden",
              noCurrentFeatureContent: "",
            }}
          />
        }
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const TopicMapWithWithSecondaryInfoSheet = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider
      featureItemsURL="/data/bpklima.data.json"
      getFeatureStyler={getGTMFeatureStyler}
      convertItemToFeature={convertBPKlimaItemsToFeature}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
      }}
      clusteringEnabled={true}
    >
      <TopicMapComponent
        gazData={gazData}
        infoBox={
          <GenericInfoBoxFromFeature
            pixelwidth={400}
            config={{
              displaySecondaryInfoAction: true,
              city: "Wuppertal",
              navigator: {
                noun: {
                  singular: "Standort",
                  plural: "Standorte",
                },
              },
              noCurrentFeatureTitle: "Keine Standorte gefunden",
              noCurrentFeatureContent: "",
            }}
          />
        }
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};
