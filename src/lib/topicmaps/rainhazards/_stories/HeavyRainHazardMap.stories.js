import React, { useEffect, useState } from "react";
import { MappingConstants } from "../../..";
import TopicMapContextProvider from "../../../contexts/TopicMapContextProvider";
import { md5FetchJSON, md5FetchText } from "../../../tools/fetching";
import { starkregenConstants } from "../constants";
import HeavyRainHazardMap from "../HeavyRainHazardMap";

import halternConfig from "./configs/haltern";
import wuppertalConfig from "./configs/wuppertal";
import olpeConfig from "./configs/olpe";
import paderbornConfig from "./configs/paderborn";
import { getGazDataForTopicIds } from "../../../tools/gazetteerHelper";
import AppMenuHaltern from "./hardcodedhelp/Help00MainComponent";
import ReactChartkick, { LineChart } from "react-chartkick";
import Chart from "chart.js";

ReactChartkick.addAdapter(Chart);

export const appKey = "Starkregengefahrenkarte.Story";

export const RainHazardMapHaltern = () => {
  const [gazData, setGazData] = useState([]);

  const getGazData = async (setGazData, url) => {
    const prefix = "GazDataForStarkregengefahrenkarteByCismet";
    const data = await md5FetchJSON(prefix, url);

    setGazData(data);
  };
  useEffect(() => {
    getGazData(setGazData, "https://adhocdata.cismet.de/data/adressen_haltern.json");
  }, []);
  return (
    <TopicMapContextProvider
      appKey={appKey + ".Haltern"}
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      baseLayerConf={halternConfig.overridingBaseLayerConf}
      infoBoxPixelWidth={370}
    >
      <HeavyRainHazardMap
        appMenu={<AppMenuHaltern version="Storymode" footerLogoUrl="/images/Signet_AIS_RZ.png" />}
        emailaddress="starkregen@haltern.de"
        initialState={halternConfig.initialState}
        config={halternConfig.config}
        homeZoom={17}
        homeCenter={[51.742081808761874, 7.1898638262064205]}
        modeSwitcherTitle="AIS Starkregenvorsorge Haltern am See"
        documentTitle="Starkregengefahrenkarte Haltern am See"
        gazData={gazData}
      />
    </TopicMapContextProvider>
  );
};

export const RainHazardMapOlpe = () => {
  const [gazData, setGazData] = useState([]);

  const getGazData = async (setGazData, url) => {
    const prefix = "GazDataForStarkregengefahrenkarteByCismet";
    const data = await md5FetchJSON(prefix, url);

    setGazData(data);
  };
  useEffect(() => {
    getGazData(setGazData, "https://adhocdata.cismet.de/data/adressen_olpe.json");
  }, []);
  return (
    <TopicMapContextProvider
      appKey={appKey + ".Olpe"}
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      baseLayerConf={olpeConfig.overridingBaseLayerConf}
      infoBoxPixelWidth={370}
    >
      <HeavyRainHazardMap
        appMenu={undefined}
        emailaddress="starkregen@olpe.de"
        initialState={olpeConfig.initialState}
        config={olpeConfig.config}
        homeZoom={14}
        homeCenter={[51.0301991586838, 7.850940702483058]}
        modeSwitcherTitle="AIS Starkregenvorsorge Olpe"
        documentTitle="Starkregengefahrenkarte Olpe"
        gazData={gazData}
      />
    </TopicMapContextProvider>
  );
};

export const RainHazardMapWuppertal = () => {
  const [gazData, setGazData] = useState([]);

  const getGazData = async (setData) => {
    const prefix = "GazDataForStories";
    const sources = {};

    // gazData.push(await md5FetchJSON(prefix, 'https://updates.cismet.de/test/adressen.json'));
    sources.adressen = await md5FetchText(
      prefix,
      "https://wunda-geoportal.cismet.de/data/3857/adressen.json"
    );
    sources.bezirke = await md5FetchText(
      prefix,
      "https://wunda-geoportal.cismet.de/data/3857/bezirke.json"
    );
    sources.quartiere = await md5FetchText(
      prefix,
      "https://wunda-geoportal.cismet.de/data/3857/quartiere.json"
    );
    sources.pois = await md5FetchText(
      prefix,
      "https://wunda-geoportal.cismet.de/data/3857/pois.json"
    );
    sources.kitas = await md5FetchText(
      prefix,
      "https://wunda-geoportal.cismet.de/data/3857/kitas.json"
    );

    const gazData = getGazDataForTopicIds(sources, [
      "pois",
      "kitas",
      "bezirke",
      "quartiere",
      "adressen",
    ]);

    setData(gazData);
  };

  useEffect(() => {
    getGazData(setGazData);
  }, []);
  return (
    <TopicMapContextProvider
      appKey={appKey + ".Wuppertal"}
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      // baseLayerConf={wuppertalConfig.overridingBaseLayerConf}
      infoBoxPixelWidth={370}
    >
      <HeavyRainHazardMap
        appMenu={undefined}
        initialState={wuppertalConfig.initialState}
        emailaddress="starkregen@stadt.wuppertal.de"
        config={wuppertalConfig.config}
        homeZoom={18}
        homeCenter={[51.27202324060668, 7.20162372978018]}
        modeSwitcherTitle="Starkregenkarte Wuppertal"
        documentTitle="Starkregenkarte Wuppertal"
        gazData={gazData}
      />
    </TopicMapContextProvider>
  );
};

export const RainHazardMapPaderborn = () => {
  const [gazData, setGazData] = useState([]);

  const getGazData = async (setGazData, url) => {
    const prefix = "GazDataForStarkregengefahrenkarteByCismet";
    const data = await md5FetchJSON(prefix, url);

    setGazData(data);
  };
  useEffect(() => {
    getGazData(setGazData, "https://adhocdata.cismet.de/data/adressen_paderborn.json");
  }, []);
  return (
    <TopicMapContextProvider
      appKey={appKey + ".Paderborn"}
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      baseLayerConf={paderbornConfig.overridingBaseLayerConf}
      infoBoxPixelWidth={370}
    >
      <HeavyRainHazardMap
        appMenu={undefined}
        emailaddress="starkregen@paderborn.de"
        initialState={paderbornConfig.initialState}
        config={paderbornConfig.config}
        homeZoom={14}
        homeCenter={[51.71905, 8.75439]}
        modeSwitcherTitle="AIS Starkregenvorsorge Paderborn"
        documentTitle="Preview Starkregengefahrenkarte Paderborn"
        gazData={gazData}
        customFeatureInfoUIs={{
          maxDepth: undefined,
          maxVelocity: undefined,
          tsDepths: undefined,
          tsVelocities: undefined,
        }}
      />
    </TopicMapContextProvider>
  );
};

export const TimeSeriesChart = () => {
  const getFeatureInfoData = [
    { time: 5 },
    { time: 10 },
    { time: 15 },
    { time: 25 },
    { time: 30 },
    { time: 35, value: 20 },
    { time: 40, value: 52 },
    { time: 45, value: 76 },
    { time: 50, value: 96 },
    { time: 55, value: 111 },
    { time: 60, value: 123 },
    { time: 65, value: 133 },
    { time: 69, value: 141 },
    { time: 75, value: 146 },
    { time: 80, value: 150 },
    { time: 84, value: 152 },
    { time: 90, value: 154 },
    { time: 95, value: 154 },
    { time: 100, value: 154 },
    { time: 104, value: 152 },
    { time: 110, value: 149 },
    { time: 115, value: 146 },
    { time: 120, value: 142 },
  ];

  const data = {};
  for (const value of getFeatureInfoData) {
    data[value.time] = value.value;
  }

  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 100 }}
    >
      <div style={{ height: 250, width: 300, background_: "red" }}>
        <LineChart data={data} />
      </div>
    </div>
  );
};
