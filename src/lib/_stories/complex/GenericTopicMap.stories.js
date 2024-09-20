import React, { useEffect, useState } from "react";
import { TopicMapContextProvider } from "../../contexts/TopicMapContextProvider";
import FeatureCollection from "../../FeatureCollection";
import { getSimpleHelpForGenericTM } from "../../tools/genericTopicMapHelper";
import getGTMFeatureStyler, { getColorFromProperties } from "../../topicmaps/generic/GTMStyler";
import GenericInfoBoxFromFeature from "../../topicmaps/GenericInfoBoxFromFeature";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import DefaultAppMenu from "../../topicmaps/menu/DefaultAppMenu";
import Control from "react-leaflet-control";
import { getGazData, storiesCategory } from "./StoriesConf";
import CismetFooterAcks from "../../topicmaps/wuppertal/CismetFooterAcknowledgements";

//--------  Config Files
import * as wasserstoffConfig from "./config/wasserstoff/";
import { getClusterIconCreatorFunction } from "../../tools/uiHelper";
import IconComp from "../../commons/Icon";

export default {
  title: storiesCategory + "GenericTopicMapComponent",
};

const helpTextBlocks = undefined;

const {
  configFromFile,
  featureDefaultProperties,
  featureDefaults,
  features,
  infoBoxConfig,
  simpleHelp,
} = wasserstoffConfig;

// const {
//   configFromFile,
//   featureDefaultProperties,
//   featureDefaults,
//   features,
//   infoBoxConfig,
//   simpleHelp,
// } = parkscheinautomatenConfig;


async function getConfig(slugName, configType, server, path) {
  try {
    const u = server + path + slugName + "/" + configType + ".json";
    console.log("try to read rconfig at ", u);
    const result = await fetch(u);
    const resultObject = await result.json();
    console.log("config: loaded " + slugName + "/" + configType);
    return resultObject;
  } catch (ex) {
    console.log("error for rconfig", ex);
  }
}
async function getMarkdown(slugName, configType, server, path) {
  try {
    const u = server + path + slugName + "/" + configType + ".md";
    console.log("try to read markdown at ", u);
    const result = await fetch(u);
    const resultObject = await result.text();
    console.log("config: loaded " + slugName + "/" + configType);
    return resultObject;
  } catch (ex) {
    console.log("error for rconfig", ex);
  }
}
// async function initialize({
//   slugName,
//   setConfig,
//   setFeatureCollection,
//   setInitialized,
//   _path = "/dev/",
//   _server = "https://raw.githubusercontent.com/cismet/wupp-generic-topic-map-config",
//   path = "/",
//   server = "",
// }) {
//   const config = await getConfig(slugName, "config", server, path);

//   const featureDefaultProperties = await getConfig(
//     slugName,
//     "featureDefaultProperties",
//     server,
//     path,
//   );
//   const featureDefaults = await getConfig(
//     slugName,
//     "featureDefaults",
//     server,
//     path,
//   );
//   const helpTextBlocks = await getConfig(
//     slugName,
//     "helpTextBlocks",
//     server,
//     path,
//   );
//   const simpleHelpMd = await await getMarkdown(
//     slugName,
//     "simpleHelp",
//     server,
//     path,
//   );
//   const simpleHelp = await await getConfig(
//     slugName,
//     "simpleHelp",
//     server,
//     path,
//   );
//   const infoBoxConfig = await getConfig(slugName, "infoBoxConfig", path);
//   const features = await getConfig(slugName, "features", server, path);

//   if (helpTextBlocks !== undefined) {
//     config.helpTextblocks = helpTextBlocks;
//   } else if (simpleHelpMd !== undefined) {
//     const simpleHelpObject = { type: "MARKDOWN", content: simpleHelpMd };
//     config.helpTextblocks = getSimpleHelpForGenericTM(
//       document.title,
//       simpleHelpObject,
//     );
//   } else {
//     config.helpTextblocks = getSimpleHelpForGenericTM(
//       document.title,
//       simpleHelp,
//     );
//   }
//   if (features !== undefined) {
//     config.features = features;
//   }

//   if (infoBoxConfig !== undefined) {
//     config.info = infoBoxConfig;
//   }

//   const fc = [];
//   let i = 0;
//   for (const f of config.features) {
//     const ef = { ...featureDefaults, ...f };
//     ef.id = i;
//     ef.index = i;
//     i++;
//     ef.properties = { ...featureDefaultProperties, ...ef.properties };
//     fc.push(ef);
//   }
//   config.features = fc;
//   console.log("xxx setConfig", JSON.stringify(config));
//   setConfig(configFromFile);
//   setInitialized(true);

//   // config.features = fc;
//   // console.log("xxx setConfig", JSON.stringify(config));

//   // setConfig(config);
//   // // if (setFeatureCollection !== undefined) {
//   // //   setFeatureCollection(fc);
//   // // }
//   // setInitialized(true);
// }

export const SimpleStaticGenericTopicMap_Wasserstofftankstelle = () => {
  const {
    configFromFile,
    featureDefaultProperties,
    featureDefaults,
    features,
    infoBoxConfig,
    simpleHelp,
  } = wasserstoffConfig;

  const [gazData, setGazData] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [config, setConfig] = useState({});
  useEffect(() => {
    const simpleHelpMd = undefined;
    if (helpTextBlocks !== undefined) {
      config.helpTextblocks = helpTextBlocks;
    } else if (simpleHelpMd !== undefined) {
      const simpleHelpObject = { type: "MARKDOWN", content: simpleHelpMd };
      config.helpTextblocks = getSimpleHelpForGenericTM(document.title, simpleHelpObject);
    } else {
      config.helpTextblocks = getSimpleHelpForGenericTM(document.title, simpleHelp);
    }
    if (features !== undefined) {
      config.features = features;
    }

    if (infoBoxConfig !== undefined) {
      config.info = infoBoxConfig;
    }

    const fc = [];
    let i = 0;
    for (const f of config.features) {
      const ef = { ...featureDefaults, ...f };
      ef.id = i;
      i++;
      ef.properties = { ...featureDefaultProperties, ...ef.properties };
      fc.push(ef);
    }
    config.features = fc;

    //Backwards conmpatibility
    config.tm.gazetteerSearchPlaceholder = config.tm.gazetteerSearchBoxPlaceholdertext;
    config.info.city = config.city;
    getGazData(setGazData, config.tm.gazetteerTopicsList);
    setConfig(config);
    setInitialized(true);
  }, []);

  if (initialized === true) {
    return (
      <TopicMapContextProvider
        items={config.features}
        getFeatureStyler={getGTMFeatureStyler}
        getColorFromProperties={getColorFromProperties}
        clusteringEnabled={config?.tm?.clusteringEnabled}
        clusteringOptions={{
          iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
          ...config.tm.clusterOptions,
        }}
      >
        <TopicMapComponent
          {...config.tm}
          gazData={gazData}
          infoBox={
            <GenericInfoBoxFromFeature
              config={infoBoxConfig}
              captionFactory={(linkUrl, feature) => {
                console.log("xxx feature", feature);

                return (
                  <a
                    href={"https://www.wuppertal.de/microsite/WMG/impressum_431218.php"}
                    target="_fotos"
                  >
                    <IconComp name="copyright" /> {feature.properties.urheber_foto}
                  </a>
                );
              }}
            />
          }
          modalMenu={
            <DefaultAppMenu
              simpleHelp={simpleHelp}
              previewMapPosition={config?.tm?.previewMapPosition}
              previewFeatureCollectionCount={config?.tm?.previewFeatureCollectionCount}
              introductionMarkdown={`Über **Einstellungen** können Sie die Darstellung der
              Hintergrundkarte und ${config?.tm?.applicationMenuIntroductionTerm || " der Objekte"
                } an Ihre 
              Vorlieben anpassen. Wählen Sie **Kompaktanleitung** 
              für detailliertere Bedienungsinformationen.`}
              menuIcon={config?.tm?.applicationMenuIconname}
              menuFooter={
                <div style={{ fontSize: "11px" }}>
                  <b>Hintergrundkarten</b>: Stadtkarte 2.0 © RVR | True Orthophoto 2022 © Stadt
                  Wuppertal <br />
                  <CismetFooterAcks />
                </div>
              }
            ></DefaultAppMenu>
          }
        >
          <FeatureCollection />
          {/* <Control position={"bottomleft"}>
            <a href="">Config-Dateien speichern</a>
          </Control> */}
        </TopicMapComponent>
      </TopicMapContextProvider>
    );
  } else return <div>not initialized</div>;
};

export const SimpleStaticGenericTopicMap_Parkscheinautomaten = () => {





  const [gazData, setGazData] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [config, setConfig] = useState({});
  useEffect(() => {

    (async () => {


      // const {
      //   configFromFile,
      //   featureDefaultProperties,
      //   featureDefaults,
      //   features,
      //   infoBoxConfig,
      //   simpleHelp,
      // } = parkscheinautomatenConfig;

      const path = "/";
      const server = "";
      const slugName = "park";
      const config = await getConfig(slugName, "config", server, path);


      const featureDefaultProperties = await getConfig(
        slugName,
        "featureDefaultProperties",
        server,
        path,
      );
      const featureDefaults = await getConfig(
        slugName,
        "featureDefaults",
        server,
        path,
      );
      const helpTextBlocks = await getConfig(
        slugName,
        "helpTextBlocks",
        server,
        path,
      );
      const simpleHelpMd = await await getMarkdown(
        slugName,
        "simpleHelp",
        server,
        path,
      );
      const simpleHelp = await await getConfig(
        slugName,
        "simpleHelp",
        server,
        path,
      );
      const infoBoxConfig = await getConfig(slugName, "infoBoxConfig", path);
      const features = await getConfig(slugName, "features", server, path);
      // const config = configFromFile;


      // if (helpTextBlocks !== undefined) {
      //   config.helpTextblocks = helpTextBlocks;
      // } else if (simpleHelpMd !== undefined) {
      //   const simpleHelpObject = { type: "MARKDOWN", content: simpleHelpMd };
      //   config.helpTextblocks = getSimpleHelpForGenericTM(document.title, simpleHelpObject);
      // } else {
      //   config.helpTextblocks = getSimpleHelpForGenericTM(document.title, simpleHelp);
      // }
      // if (features !== undefined) {
      //   config.features = features;
      // }

      // if (infoBoxConfig !== undefined) {
      //   config.info = infoBoxConfig;
      // }


      if (helpTextBlocks !== undefined) {
        config.helpTextblocks = helpTextBlocks;
      } else if (simpleHelpMd !== undefined) {
        const simpleHelpObject = { type: "MARKDOWN", content: simpleHelpMd };
        config.helpTextblocks = getSimpleHelpForGenericTM(
          document.title,
          simpleHelpObject,
        );
      } else {
        config.helpTextblocks = getSimpleHelpForGenericTM(
          document.title,
          simpleHelp,
        );
      }
      if (features !== undefined) {
        config.features = features;
      }

      if (infoBoxConfig !== undefined) {
        config.info = infoBoxConfig;
      }


      const fc = [];
      let i = 0;
      for (const f of config.features) {
        const ef = { ...featureDefaults, ...f };
        ef.id = i;
        i++;
        ef.properties = { ...featureDefaultProperties, ...ef.properties };
        fc.push(ef);
      }
      config.features = fc;

      // //Backwards conmpatibility
      // config.tm.gazetteerSearchPlaceholder = config.tm.gazetteerSearchBoxPlaceholdertext;
      // config.info.city = config.city;
      getGazData(setGazData, config.tm.gazetteerTopicsList);
      setConfig(config);
      setInitialized(true);

      // await initialize({ slugName: "park", setConfig, setInitialized });
      // getGazData(setGazData, config.tm.gazetteerTopicsList);

      // setConfig(config);
    })();
  }, []);

  if (initialized === true) {
    return (
      <TopicMapContextProvider
        items={config.features}
        getFeatureStyler={getGTMFeatureStyler}
        getColorFromProperties={getColorFromProperties}
        clusteringEnabled={config?.tm?.clusteringEnabled}
        clusteringOptions={{
          iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
          ...config.tm.clusterOptions,
        }}
      >
        <TopicMapComponent
          key={JSON.stringify(config)}
          {...config.tm}
          gazData={gazData}
          infoBox={<GenericInfoBoxFromFeature config={infoBoxConfig} />}
          modalMenu={
            <DefaultAppMenu
              simpleHelp={simpleHelp}
              previewMapPosition={config?.tm?.previewMapPosition}
              previewFeatureCollectionCount={config?.tm?.previewFeatureCollectionCount}
              introductionMarkdown={`Über **Einstellungen** können Sie die Darstellung der
              Hintergrundkarte und ${config?.tm?.applicationMenuIntroductionTerm || " der Objekte"
                } an Ihre 
              Vorlieben anpassen. Wählen Sie **Kompaktanleitung** 
              für detailliertere Bedienungsinformationen.`}
              menuIcon={config?.tm?.applicationMenuIconname}
            ></DefaultAppMenu>
          }
        >
          <FeatureCollection />
          {/* <Control position={"bottomleft"}>
            <a href="">Config-Dateien speichern</a>
          </Control> */}
        </TopicMapComponent>
      </TopicMapContextProvider>
    );
  } else return <div>not initialized</div>;
};
