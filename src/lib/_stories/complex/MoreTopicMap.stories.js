import React, { useEffect, useState } from "react";
import { TopicMapContextProvider } from "../../contexts/TopicMapContextProvider";
import FeatureCollection from "../../FeatureCollection";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import MapLibreLayer from "../../vector/MapLibreLayer";
import { getGazData } from "./StoriesConf";
import { defaultLayerConf } from "../../tools/layerFactory";

export const TopicMapWithOfflineDataConfiguration = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  const offlineConfig = {
    rules: [
      {
        origin: "https://omt.map-hosting.de/fonts/Metropolis Medium Italic,Noto",
        cachePath: "fonts/Open",
      },
      {
        origin: "https://omt.map-hosting.de/fonts/Klokantech Noto",
        cachePath: "fonts/Open",
      },
      {
        origin: "https://omt.map-hosting.de/fonts",
        cachePath: "fonts",
      },
      {
        origin: "https://omt.map-hosting.de/styles",
        cachePath: "styles",
      },

      {
        origin: "https://omt.map-hosting.de/data/v3",
        cachePath: "tiles",
      },

      {
        origin: "https://omt.map-hosting.de/data/gewaesser",
        cachePath: "tiles.gewaesser",
      },

      {
        origin: "https://omt.map-hosting.de/data/kanal",
        cachePath: "tiles.kanal",
      },

      {
        origin: "https://omt.map-hosting.de/data/brunnen",
        cachePath: "tiles.brunnen",
        // realServerFallback: true, //this can override the globalsetting
      },
    ],
    dataStores: [
      {
        name: "Vektorkarte für Wuppertal",
        key: "wuppBasemap",
        url: "https://offline-data.cismet.de/offline-data/wupp.zip",
      },

      {
        name: "Gewässer, Kanal und Brunnendaten",
        key: "umweltalarm",
        url: "https://offline-data.cismet.de/offline-data/umweltalarm.zip",
      },
    ],
    offlineStyles: [
      "https://omt.map-hosting.de/styles/cismet-light/style.json",
      "https://omt.map-hosting.de/styles/osm-bright-grey/style.json",
      "https://omt.map-hosting.de/styles/brunnen/style.json",
      "https://omt.map-hosting.de/styles/kanal/style.json",
      "https://omt.map-hosting.de/styles/gewaesser/style.json",
    ],
    realServerFallback: true, //should be true in production
    consoleDebug: false,
    optional: true,
    initialActive: true,
  };

  const backgroundConfigurations = {
    lbk: {
      layerkey: "rvrGrau@50|trueOrtho2020@40",
      src: "/images/rain-hazard-map-bg/ortho.png",
      title: "Luftbildkarte",
    },

    vectorCityMap2: {
      layerkey: "cismetLight",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },

    vectorCityMap: {
      layerkey: "osmBrightOffline",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },

    abkg: {
      layerkey: "bplan_abkg@70",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Amtliche Basiskarte",
    },
    stadtplan: {
      layerkey: "wupp-plan-live@90",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    nix: {
      layerkey: "empty",
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
      title: "Stadtplan (bunt)",
      mode: "default",
      layerKey: "vectorCityMap",
      offlineDataStoreKey: "wuppBasemap",
    },
    {
      title: "Stadtplan (light)",
      mode: "default",
      layerKey: "vectorCityMap2",
      offlineDataStoreKey: "wuppBasemap",
    },

    { title: "Luftbildkarte", mode: "default", layerKey: "lbk" },
    { title: "-", mode: "default", layerKey: "nix" },
  ];

  const baseLayerConf = { ...defaultLayerConf };
  if (!baseLayerConf.namedLayers.cismetLight) {
    baseLayerConf.namedLayers.cismetLight = {
      type: "vector",
      style: "https://omt.map-hosting.de/styles/cismet-light/style.json",
      offlineAvailable: true,
      offlineDataStoreKey: "wuppBasemap",
      pane: "backgroundvectorLayers",
    };
  }
  if (!baseLayerConf.namedLayers.osmBrightOffline) {
    baseLayerConf.namedLayers.osmBrightOffline = {
      type: "vector",
      style: "https://omt.map-hosting.de/styles/osm-bright-grey/style.json",
      offlineAvailable: true,
      offlineDataStoreKey: "wuppBasemap",
      pane: "backgroundvectorLayers",
    };
  }

  return (
    <TopicMapContextProvider
      backgroundModes={backgroundModes}
      backgroundConfigurations={backgroundConfigurations}
      baseLayerConf={baseLayerConf}
      offlineCacheConfig={offlineConfig} //will Handle the filling of the offline cache
      additionalLayerConfiguration={{
        brunnen: {
          title: <span>Trinkwasserbrunnen</span>,
          initialActive: false,
          layer: (
            <MapLibreLayer
              id="brunnen"
              key={"brunnen"}
              style="https://omt.map-hosting.de/styles/brunnen/style.json"
              pane="additionalLayers0"
              offlineAvailable={true}
              offlineDataStoreKey="umweltalarm"
            />
          ),
          offlineDataStoreKey: "umweltalarm",
        },
        kanal: {
          title: <span>Kanalnetz</span>,
          initialActive: false,
          layer: (
            <MapLibreLayer
              key={"kanal"}
              style="https://omt.map-hosting.de/styles/kanal/style.json"
              pane="additionalLayers1"
              offlineAvailable={true}
              offlineDataStoreKey="umweltalarm"
            />
          ),
          offlineDataStoreKey: "umweltalarm",
        },
        gewaesser: {
          title: <span>Gewässernetz</span>,
          initialActive: false,
          layer: (
            <MapLibreLayer
              key={"gewaesser"}
              style="https://omt.map-hosting.de/styles/gewaesser/style.json"
              pane="additionalLayers2"
              offlineAvailable={true}
              offlineDataStoreKey="umweltalarm"
            />
          ),
          offlineDataStoreKey: "umweltalarm",
        },
      }}
    >
      {/* <ConsoleLog ghostModeAvailable={true} minifyAvailable={true} /> */}
      <TopicMapComponent key={"tmc"} gazData={gazData}>
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};
