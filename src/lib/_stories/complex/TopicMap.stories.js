import React, { useState, useRef, useEffect, useContext } from "react";
import { RoutedMap, MappingConstants } from "../../index";
import GazetteerSearchControl from "../../GazetteerSearchControl";
import GazetteerHitDisplay from "../../GazetteerHitDisplay";
import { md5FetchText, fetchJSON } from "../../tools/fetching";
import { getGazDataForTopicIds } from "../../tools/gazetteerHelper";
import ProjSingleGeoJson from "../../ProjSingleGeoJson";
import { storiesCategory } from "./StoriesConf";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import GenericInfoBoxFromfeature from "../../topicmaps/GenericInfoBoxFromFeature";
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

export const SimpleTopicMap = () => {
  const [gazData, setGazData] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
    // getData(setData);
  }, []);

  const MyInfoBox = () => {
    const featureCollectionContext = useContext(FeatureCollectionContext);
    const { shownFeatures, selectedFeature, items } = featureCollectionContext;
    if (featureCollectionContext !== undefined) {
      return (
        <GenericInfoBoxFromfeature
          title={(selectedFeature || {}).text}
          isCollabsible={false}
          header="Parkscheinautomat"
          pixelwidth={300}
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
      );
    } else {
      return null;
    }
  };
  return (
    <TopicMapContextProvider
      // getFeatureStyler={getGTMFeatureStyler}
      // getColorFromProperties={getColorFromProperties}
      // clusteringEnabled={true}
      clusteringOptions={{
        // spiderfyOnMaxZoom: false,
        // showCoverageOnHover: false,
        // zoomToBoundsOnClick: false,
        // maxClusterRadius: 40,
        // disableClusteringAtZoom: 19,
        // animate: false,
        // cismapZoomTillSpiderfy: 12,
        // selectionSpiderfyMinZoom: 12,
        // colorizer: getColorFromProperties,
        // clusterIconSize: 30,
        iconCreateFunction: getClusterIconCreatorFunction(30, getColorFromProperties),
      }}
    >
      <TopicMapComponent
        gazData={gazData}
        infoBox={<MyInfoBox pixelwidth={300} />}
        modalMenu={<AppMenu />}
      >
        <FeatureCollection itemsUrl="https://wunda-geoportal.cismet.de/data/parkscheinautomatenfeatures.json" />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};
