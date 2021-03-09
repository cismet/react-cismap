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

//--------  Config Files
import * as wasserstoffConfig from "./config/wasserstoff/";
import * as parkscheinautomatenConfig from "./config/parkscheinautomaten/";
import { getClusterIconCreatorFunction } from "../../tools/uiHelper";

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

export const SimpleStaticGenericTopicMap = () => {
  const [gazData, setGazData] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [config, setConfig] = useState(configFromFile);
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
          infoBox={<GenericInfoBoxFromFeature config={infoBoxConfig} />}
          modalMenu={
            <DefaultAppMenu
              simpleHelp={simpleHelp}
              previewMapPosition={config?.tm?.previewMapPosition}
              previewFeatureCollectionCount={config?.tm?.previewFeatureCollectionCount}
              introductionMarkdown={`Über **Einstellungen** können Sie die Darstellung der
              Hintergrundkarte und ${
                config?.tm?.applicationMenuIntroductionTerm || " der Objekte"
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
