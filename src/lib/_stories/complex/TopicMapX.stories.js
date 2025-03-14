import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import {
  TopicMapContextProvider
} from "../../contexts/TopicMapContextProvider";

import FeatureCollection from "../../FeatureCollection";
import {
  MappingConstants
} from "../../index";
import { addSVGToProps } from "../../tools/svgHelper";
import {
  getClusterIconCreatorFunction
} from "../../tools/uiHelper";
import getGTMFeatureStyler from "../../topicmaps/generic/GTMStyler";
import GenericInfoBoxFromFeature from "../../topicmaps/GenericInfoBoxFromFeature";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import { getGazData, host, storiesCategory } from "./StoriesConf";



export default {
  title: storiesCategory + "TopicMapComponent",
};

const convertPOIItemsToFeature = async (itemIn) => {
  let item = await addSVGToProps(
    itemIn,
    (i) => i.signatur || i?.mainlocationtype?.signatur || "Platz.svg"
  );
  const text = item?.name || "Kein Name";
  const type = "Feature";
  const selected = false;
  const geometry = item?.geojson;
  item.color = "#CB0D0D";
  const info = {
    header: item?.mainlocationtype?.lebenslagen?.join(","),
    title: text,
    additionalInfo: item?.info,
    subtitle: <span>{item?.adresse}</span>,
  };
  item.info = info;

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

const mapTitle = "TopicMap";
export const XTopicMap = () => {
  const [gazData, setGazData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  useEffect(() => {
    getGazData(setGazData);
    document.title = mapTitle;
  }, []);

  return (
    <TopicMapContextProvider
      //host=https://wupp-topicmaps-data.cismet.de
      //appKey='CoronaPraeventionskarteWuppertal.TopicMap'
      persistenceSettings={{
        ui: ["appMenuVisible", "appMenuActiveMenuSection", "collapsedInfoBox"],
        _featureCollection: ["filterState", "filterMode", "clusteringEnabled", "allfeatures", "pointFeatures"],
        responsive: [],
        styling: [
          "activeAdditionalLayerKeys",
          "namedMapStyle",
          "selectedBackground",
          "markerSymbolSize",
        ],
        offlinelayers: ["vectorLayerOfflineEnabled"],
      }}
      featureItemsURL={host + "/data/poi.data.json"}
      referenceSystem={MappingConstants.crs25832}
      mapEPSGCode="25832"
      referenceSystemDefinition={MappingConstants.proj4crs25832def}
      getFeatureStyler={getGTMFeatureStyler}
      featureTooltipFunction={(feature) => feature?.text}
      convertItemToFeature={convertPOIItemsToFeature}
      convertItemToFeatureProgressCallback={(e) => {
        const newProgress = Math.round((e.current / e.total) * 100);
        setProgress(newProgress);
        setShowProgress(newProgress < 100);
        console.log(`xxx Progress: ${newProgress}%`, e);
      }}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
      }}
      clusteringEnabled={true}
      itemFilterFunction={() => {
        return (item) => true;

      }}
      getColorFromProperties={(props) => props.color}
      titleFactory={() => {
        return (
          <div>
            <b>{mapTitle}</b>
          </div>
        );
      }}
    >
      {showProgress && (
        <div style={{
          position: 'absolute',
          zIndex: 1000,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          padding: '25px 30px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(0,0,0,0.05)',
          width: '350px',
          border: '1px solid rgba(0,0,0,0.1)',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            fontSize: '14px',
            marginBottom: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Daten werden geladen und gecached ...
          </div>
          <ProgressBar
            now={progress}
            // label={`${progress}%`}
            style={{
              height: '20px',
              borderRadius: '10px',
              overflow: 'hidden'
            }}
            variant="secondary"
            animated
          />
        </div>
      )}
      <TopicMapComponent
        locatorControl={true}
        gazData={gazData}
        gazetteerSearchPlaceholder="Stadtteil | Adresse | POI "
        infoBox={
          <GenericInfoBoxFromFeature
            pixelwidth={400}
            config={{
              city: "Wuppertal",
              navigator: {
                noun: {
                  singular: "Zentrum",
                  plural: "Zentren",
                },
              },
              noCurrentFeatureTitle: "Keine Zentren gefunden",
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
