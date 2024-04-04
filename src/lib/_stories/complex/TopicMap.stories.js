import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import queryString from "query-string";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Control from "react-leaflet-control";
import { Link } from "react-scroll";

import { nordbahntrasse } from "../_data/Demo";
import { kassenzeichen } from "../_data/Editing.Storybook.data";
import uwz from "../_data/UWZ";
import Icon from "../../commons/Icon";
import {
  FeatureCollectionContext,
  FeatureCollectionDispatchContext,
} from "../../contexts/FeatureCollectionContextProvider";
import { TopicMapContextProvider } from "../../contexts/TopicMapContextProvider";
import { TopicMapStylingDispatchContext } from "../../contexts/TopicMapStylingContextProvider";
import { UIContext, UIDispatchContext } from "../../contexts/UIContextProvider";
import FeatureCollection from "../../FeatureCollection";
import FeatureCollectionDisplay from "../../FeatureCollectionDisplay";
import GazetteerHitDisplay from "../../GazetteerHitDisplay";
import GazetteerSearchControl from "../../GazetteerSearchControl";
import {
  FeatureCollectionDisplayWithTooltipLabels,
  MappingConstants,
  RoutedMap,
} from "../../index";
import NonTiledWMSLayer from "../../NonTiledWMSLayer";
import ProjSingleGeoJson from "../../ProjSingleGeoJson";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import { defaultLayerConf } from "../../tools/layerFactory";
import LogConsole from "../../tools/LogConsole";
import ConsoleLog from "../../tools/LogConsole";
import { addSVGToProps, DEFAULT_SVG } from "../../tools/svgHelper";
import { getClusterIconCreatorFunction, getSimpleHelpForTM } from "../../tools/uiHelper";
import { SimpleMenu } from "../../topicmaps/_stories/ModalMenu.stories";
import ConfigurableDocBlocks from "../../topicmaps/ConfigurableDocBlocks";
import getGTMFeatureStyler, { getColorFromProperties } from "../../topicmaps/generic/GTMStyler";
import GenericInfoBoxFromFeature from "../../topicmaps/GenericInfoBoxFromFeature";
import InfoBox from "../../topicmaps/InfoBox";
import InfoBoxFotoPreview from "../../topicmaps/InfoBoxFotoPreview";
import AppMenu from "../../topicmaps/menu/DefaultAppMenu";
import DefaultSettingsPanel from "../../topicmaps/menu/DefaultSettingsPanel";
import FilterPanel from "../../topicmaps/menu/FilterPanel";
import GenericModalApplicationMenu from "../../topicmaps/menu/ModalApplicationMenu";
import Section from "../../topicmaps/menu/Section";
import SecondaryInfo from "../../topicmaps/SecondaryInfo";
import SecondaryInfoPanelSection from "../../topicmaps/SecondaryInfoPanelSection";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import MapLibreLayer from "../../vector/MapLibreLayer";
import { getGazData, getGazData25387, host, storiesCategory } from "./StoriesConf";
import { BroadcastChannel } from "broadcast-channel";
import CrossTabCommunicationContextProvider, {
  CrossTabCommunicationContext,
} from "../../contexts/CrossTabCommunicationContextProvider";
import CrossTabCommunicationControl from "../../CrossTabCommunicationControl";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import CismapLayer from "../../CismapLayer";

export default {
  title: storiesCategory + "TopicMapComponent",
};

export const MostSimpleTopicMap = () => {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent
        _fullScreenControl={false}
        _zoomControls={false}
        homeZoom={19}
        gazData={undefined}
        gazetteerSearchControl={false}
      ></TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const MostSimpleTopicMapWithInfoBoxComponent = () => {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent
        infoBox={<GenericInfoBoxFromFeature pixelwidth={300} />}
      ></TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const MostSimpleTopicMapWithCustomLayer = () => {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent gazData={[]} backgroundlayers="empty">
        <StyledWMSTileLayer
          {...{
            type: "wmts",
            url: "https://geodaten.metropoleruhr.de/spw2/service",
            layers: "spw2_light_grundriss",
            version: "1.3.0",
            tileSize: 512,
            transparent: true,
            opacity: 0.3,
          }}
        ></StyledWMSTileLayer>
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const MostSimpleTopicMapWithCismapLayer = () => {
  const layerConfigs = [
    {
      type: "wmts",
      url: "https://geodaten.metropoleruhr.de/spw2/service",
      layers: "spw2_light_grundriss",
      version: "1.3.0",
      tileSize: 512,
      transparent: true,
      opacity: 0.3,
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:8099/abt9_flst/services",
      layers: "abt9",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:7098/alkis/services",
      layers: "alkomgw",
      styles: "default",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:7098/alkis/services",
      layers: "alkomf",
      styles: "default",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:7098/stadt-flurstuecke/services",
      layers: "stadt_flurst",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:8056/baulasten/services",
      layers: "baul",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de/bebauungsplanung/services",
      layers: "bverfahren-r",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:8056/baulasten/services",
      layers: "baul",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:7098/alkis/services",
      layers: "hausnr,hausnrne,hausnrplm,hausnrplo",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:7098/stadt-flurstuecke/services",
      layers: "stadt_flurst",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:8099/esw/services",
      layers: "esw",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:7098/hoehen/services",
      layers: "hoehenu",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:7098/alkis/services",
      layers: "expsw",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url: "http://s10221.wuppertal-intra.de:7098/alkis/services",
      layers: "expg",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url:
        "http://s102w284.stadt.wuppertal-intra.de:6080/arcgis/services/PRODUKTION/AGS_ORTHOPHOTO_WUP/MapServer/WMSServer",
      layers: "13",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url:
        "http://s102w284.stadt.wuppertal-intra.de:6080/arcgis/services/PRODUKTION/AGS_ORTHOPHOTO_WUP20_D/MapServer/WMSServer",
      layers: "2",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      type: "wmts",
      url:
        "http://s102w284.stadt.wuppertal-intra.de:6080/arcgis/services/PRODUKTION/AGS_ORTHOPHOTO_WUP/MapServer/WMSServer",
      layers: "9",
      version: "1.1.1",
      tileSize: 256,
      transparent: true,
      format: "image/png",
    },
    {
      title: "Stadtplan (grau)",

      type: "vector",
      style: "https://omt.map-hosting.de/styles/cismet-light/style.json",
      //   offlineAvailable: true,
      //   offlineDataStoreKey: "wuppBasemap",
      pane: "backgroundvectorLayers",
    },
    //layerConfigs[18]
    {
      title: "Stadtplan (bunt)",
      type: "vector",
      style: "https://omt.map-hosting.de/styles/osm-bright-grey/style.json",
      //   offlineAvailable: true,
      //   offlineDataStoreKey: "wuppBasemap",
      pane: "backgroundvectorLayers",
    },
    {
      title: "OSM tile",
      type: "tiles",
      //   _url: layer.layerUrl,
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      //   bounds: layer.layerBounds,
      // minNativeZoom: 1,
      tms: true,
      noWrap: true,
      // maxNativeZoom: 12,
      key: "tileLayer",
    },
  ];

  //create a state for the layer index and click through with the >> button
  const [layerIndex, setLayerIndex] = useState(0);

  return (
    <TopicMapContextProvider>
      <TopicMapComponent gazData={[]} backgroundlayers="empty">
        <CismapLayer key={layerIndex + "CL"} {...layerConfigs[layerIndex]} />

        {layerConfigs.map((layerConfig, index) => {
          return (
            <Control
              style={{ width: 500 }}
              className="leaflet-bar leaflet-control"
              position="topleft"
            >
              <a
                onClick={() => {
                  setLayerIndex(index);
                }}
              >
                <span style={{ whiteSpace: "nowrap" }}>
                  <span style={{ margin: 10, marginRight: 20 }}>🌍</span>
                  {layerConfigs[index].title ||
                    layerConfigs[index].url ||
                    layerConfigs[index].style ||
                    layerConfigs[index].endpoint}
                </span>
              </a>
            </Control>
          );
        })}
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const MostSimpleTopicMapWithCismapTiledLayer = () => {
  return (
    <TopicMapContextProvider
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      mapEPSGCode="3857"
    >
      <TopicMapComponent
        homeZoom={9}
        maxZoom={22}
        minZoom={1}
        gazData={[]}
        backgroundlayers="empty"
        homeCenter={[49.14, 6.9735074]}
      >
        <CismapLayer
          {...{
            type: "tiles",
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            key: "tileLayer",
          }}
        />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const MostSimpleTopicMapWithNonTiledLayer = () => {
  return (
    <TopicMapContextProvider>
      <TopicMapComponent gazData={[]} backgroundlayers="empty">
        <NonTiledWMSLayer
          {...{
            type: "wmts",
            url: "https://geodaten.metropoleruhr.de/spw2/service",
            layers: "spw2_light_grundriss",
            version: "1.3.0",
            tileSize: 256,
            transparent: true,
          }}
        ></NonTiledWMSLayer>
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const MostSimpleTopicMapWithGazetteerData = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);
  return (
    <TopicMapContextProvider _maskingPolygon="POLYGON((668010.063156992 6750719.23021889,928912.612468322 6757273.20343972,930494.610325512 6577553.43685138,675236.835570551 6571367.64964125,668010.063156992 6750719.23021889))">
      <TopicMapComponent maxZoom={22} gazData={gazData}></TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const MostSimpleTopicMapWithGazetteerDataWithTertiaryAction = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);
  return (
    <TopicMapContextProvider _maskingPolygon="POLYGON((668010.063156992 6750719.23021889,928912.612468322 6757273.20343972,930494.610325512 6577553.43685138,675236.835570551 6571367.64964125,668010.063156992 6750719.23021889))">
      <TopicMapComponent
        maxZoom={22}
        gazData={gazData}
        gazetteerSearchControlProps={{
          tertiaryAction: () => {
            console.log("Tertiary Action");
            window.alert("Tertiary Action");
          },
          tertiaryActionIcon: faComment,
          tertiaryActionTooltip: "Tertiary Action Tooltip",
          teriaryActionDisabled: undefined, //defaultValue is false
        }}
      ></TopicMapComponent>
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
      <TopicMapComponent locatorControl={true} gazData={gazData}>
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const SimpleTopicMapWithCustomMenu = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider featureItemsURL="/data/parkscheinautomatenfeatures.json">
      <TopicMapComponent modalMenu={<SimpleMenu></SimpleMenu>} gazData={gazData}>
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

export const SimpleTopicMapWithAdditiopnalStylingInfo = () => {
  const [gazData, setGazData] = useState([]);
  const [additionalStylingInfo, setAdditionalStylingInfo] = useState({ first: "this" });

  useEffect(() => {
    getGazData(setGazData);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      console.log("xxx re set additionalStylingInfo");
      setAdditionalStylingInfo({ then: "that" });
    }, 2000);
  }, []);
  console.log("render with local additionalStylingInfo", additionalStylingInfo);

  return (
    <TopicMapContextProvider
      key={JSON.stringify(additionalStylingInfo)}
      getFeatureStyler={(
        markerSymbolSize,
        getColorFromProperties,
        appMode,
        secondarySelection,
        additionalStylingInfo
      ) => {
        console.log("xxx getFeatureStyler with additionalStylingInfo", additionalStylingInfo);
        return getGTMFeatureStyler(
          markerSymbolSize,
          getColorFromProperties,
          appMode,
          secondarySelection,
          additionalStylingInfo
        );
      }}
      getColorFromProperties={getColorFromProperties}
      clusteringEnabled={true}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, getColorFromProperties),
      }}
      featureItemsURL="/data/parkscheinautomatenfeatures.json"
      additionalStylingInfo={additionalStylingInfo}
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
  if (item.bild) {
    item.foto = "https://www.wuppertal.de/geoportal/standort_klima/fotos/" + item.bild;
  }

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

const InfoPanel = () => {
  const { selectedFeature, items } = useContext(FeatureCollectionContext);

  const angebot = selectedFeature?.properties;

  if (angebot !== undefined) {
    let foto;
    if (angebot.bild !== undefined) {
      foto = "https://www.wuppertal.de/geoportal/standort_klima/fotos/" + angebot.bild;
    }

    const weitereAngebote = (items || []).filter(
      (testItem) => testItem?.standort.id === angebot.standort.id && testItem.id !== angebot.id
    );
    //data structure for "weitere Angebote"
    // gruppenwechsel for thema

    const addOffers = {};
    for (const ang of weitereAngebote || []) {
      if (addOffers[ang.thema.name] === undefined) {
        addOffers[ang.thema.name] = [];
      }
      addOffers[ang.thema.name].push(ang.kategorien);
    }

    const subSections = [
      <SecondaryInfoPanelSection
        key="standort"
        bsStyle="info"
        header={"Standort: " + angebot?.standort?.name}
      >
        <div style={{ fontSize: "115%", padding: "10px", paddingTop: "0px" }}>
          {angebot?.standort && (
            <b>
              {angebot?.standort?.strasse} {angebot?.standort?.hausnummer}
              <br />
              {angebot?.standort?.plz} {angebot?.standort?.stadt}
              <br />
            </b>
          )}

          {angebot?.standort?.beschreibung && (
            <div>
              {angebot?.standort?.beschreibung}
              <br />
            </div>
          )}
          {angebot?.standort?.bemerkung && (
            <div>
              {angebot?.standort?.bemerkung} <br />
            </div>
          )}
          {angebot?.standort?.kommentar && (
            <div>
              {angebot?.standort?.kommentar} <br />
            </div>
          )}
        </div>
      </SecondaryInfoPanelSection>,
    ];

    if (weitereAngebote.length > 0) {
      subSections.push(
        <SecondaryInfoPanelSection
          key="weitereAngebote"
          header="Weitere Angebote an diesem Standort:"
          bsStyle="success"
        >
          <div style={{ fontSize: "115%", padding: "10px", paddingTop: "0px" }}>
            <table border={0} style={{ xwidth: "100%" }}>
              <tbody>
                {Object.keys(addOffers).map((key, index) => {
                  return (
                    <tr style={{ paddingBottom: 10 }} key={"addAng" + index}>
                      <td style={{ verticalAlign: "top", padding: 5 }} key={"addAng.L." + index}>
                        {key}:
                      </td>
                      <td style={{ verticalAlign: "top", padding: 5 }} key={"addAng.R." + index}>
                        {addOffers[key].map((val, index) => {
                          return <div key={"kategorien." + index}>{val.join(", ")}</div>;
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* <pre>{JSON.stringify(addOffers, null, 2)}</pre> */}
        </SecondaryInfoPanelSection>
      );
    }

    let minHeight4MainSextion = undefined;
    if (foto !== undefined) {
      minHeight4MainSextion = 250;
    }
    return (
      <SecondaryInfo
        titleIconName="info-circle"
        title={"Datenblatt: " + angebot.kategorien.join(", ")}
        mainSection={
          <div style={{ width: "100%", minHeight: minHeight4MainSextion }}>
            {foto !== undefined && (
              <img
                alt="Bild"
                style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  float: "right",
                  paddingBottom: "5px",
                }}
                src={foto}
                width="250"
              />
            )}
            <div style={{ fontSize: "115%", padding: "10px", paddingTop: "0px" }}>
              {angebot.beschreibung && (
                <b>
                  {angebot.beschreibung}
                  <br />
                </b>
              )}
              {angebot.bemerkung && (
                <div>
                  {angebot.bemerkung} <br />
                </div>
              )}
              {angebot.kommentar && (
                <div>
                  {angebot.kommentar} <br />
                </div>
              )}
            </div>
          </div>
        }
        subSections={subSections}
      />
    );
  } else {
    return null;
  }
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
      itemFilterFunction={(item) => item?.thema?.id === 2}
    >
      <TopicMapComponent
        gazData={gazData}
        gazetteerSearchPlaceholder="Stadtteil | Adresse | POI | Standorte"
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
        secondaryInfo={<InfoPanel />}
        // secondaryInfoBoxElements={[<InfoBoxFotoPreview />]}
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

const MyMenu = () => {
  const { setAppMenuActiveMenuSection } = useContext(UIDispatchContext);
  const { filterState, filterMode, filteredItems, shownFeatures } = useContext(
    FeatureCollectionContext
  );
  const { setFilterState, setFilterMode } = useContext(FeatureCollectionDispatchContext);

  const { items } = useContext(FeatureCollectionContext);

  const kategorien = [];
  const katValues = [];
  const themen = [];
  const themenValues = [];

  for (const item of items || []) {
    for (const kat of item.kategorien) {
      if (!kategorien.includes(kat)) {
        katValues.push({ key: kat });
        kategorien.push(kat);
      }
    }
    if (!themen.includes(item.thema.id)) {
      themen.push(item.thema.id);
      themenValues.push({ key: item.thema.id, title: item.thema.name, color: item.thema.farbe });
    }
  }

  const filterConfiguration = {
    mode: "tabs", // list or tabs
    filters: [
      {
        title: "Themen",
        key: "themen",
        icon: "folder",
        type: "tags", //"checkBoxes",
        values: themenValues,
        setAll: () => {
          setFilterState({ ...filterState, themen });
        },
        setNone: () => {
          setFilterState({ ...filterState, themen: [] });
        },
        colorizer: (item, selected) => (selected ? item.color : "#eeeeee"),
      },
      {
        title: "Kategorien",
        key: "kategorien",
        icon: "tags",
        type: "tags",
        values: katValues,
        setAll: () => {
          setFilterState({ ...filterState, kategorien });
        },
        setNone: () => {
          setFilterState({ ...filterState, kategorien: [] });
        },
      },
    ],
  };

  if ((filterState === undefined) & (items !== undefined)) {
    setFilterState({ kategorien, themen });
  }
  if ((filterMode === undefined) & (items !== undefined)) {
    setFilterMode("themen");
  }
  const topicMapTitle = "Best Practice Klimaschutz";
  const simpleHelp = undefined;
  return (
    <GenericModalApplicationMenu
      menuIcon={"bars"}
      menuTitle={"Filter, Einstellungen und Kompaktanleitung"}
      menuIntroduction={
        <span>
          Benutzen Sie die Auswahlmöglichkeiten unter{" "}
          <Link
            className="useAClassNameToRenderProperLink"
            to="filter"
            containerId="myMenu"
            smooth={true}
            delay={100}
            onClick={() => setAppMenuActiveMenuSection("filter")}
          >
            Filter
          </Link>
          , um die in der Karte angezeigten vorbildlichen Klimastandorte auf die für Sie relevanten
          Themen zu beschränken. Über Einstellungen{" "}
          <Link
            className="useAClassNameToRenderProperLink"
            to="settings"
            containerId="myMenu"
            smooth={true}
            delay={100}
            onClick={() => setAppMenuActiveMenuSection("settings")}
          >
            Einstellungen
          </Link>{" "}
          können Sie die Darstellung der Hintergrundkarte und der klimarelevanten Themen an Ihre
          Interesse anpassen. Wählen Sie die Kompaktanleitung{" "}
          <Link
            className="useAClassNameToRenderProperLink"
            to="help"
            containerId="myMenu"
            smooth={true}
            delay={100}
            onClick={() => setAppMenuActiveMenuSection("help")}
          >
            Kompaktanleitung
          </Link>{" "}
          für detailliertere Bedienungsinformationen.
        </span>
      }
      menuSections={[
        <Section
          key="filter"
          sectionKey="filter"
          sectionTitle={`Meine Klimastandorte (${
            filteredItems?.length || "0"
          } Standorte gefunden, davon ${shownFeatures?.length || "0"} in der Karte)`}
          sectionBsStyle="primary"
          sectionContent={<FilterPanel filterConfiguration={filterConfiguration} />}
        />,
        <DefaultSettingsPanel key="settings" />,
        <Section
          key="help"
          sectionKey="help"
          sectionTitle="Kompaktanleitung"
          sectionBsStyle="default"
          sectionContent={
            <ConfigurableDocBlocks configs={getSimpleHelpForTM(topicMapTitle, simpleHelp)} />
          }
        />,
      ]}
    />
  );
};

export const TopicMapWithWithCustomSettings = () => {
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
      itemFilterFunction={({ filterState, filterMode }) => {
        return (item) => {
          if (filterMode === "themen") {
            return filterState?.themen?.includes(item.thema.id);
          } else if (filterMode === "kategorien") {
            for (const cat of item.kategorien) {
              if (filterState?.kategorien?.includes(cat)) {
                return true;
              }
            }
            return false;
          } else {
            return true;
          }
        };
      }}
    >
      <TopicMapComponent
        modalMenu={<MyMenu />}
        gazData={gazData}
        gazetteerSearchPlaceholder="Stadtteil | Adresse | POI | Standorte"
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
        secondaryInfo={<InfoPanel />}
        // secondaryInfoBoxElements={[<InfoBoxFotoPreview />]}
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const TopicMapWithAdditionalLayers = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);
  const currentZoom = 14;
  return (
    <TopicMapContextProvider
      featureItemsURL="/data/bpklima.data.json"
      getFeatureStyler={getGTMFeatureStyler}
      convertItemToFeature={convertBPKlimaItemsToFeature}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
      }}
      referenceSystemDefinition={MappingConstants.proj4crs25832def}
      mapEPSGCode="25832"
      referenceSystem={MappingConstants.crs25832}
      clusteringEnabled={true}
      additionalLayerConfiguration={{
        hillshade: {
          title: "Schummerung",
          initialActive: false,
          layerkey: "hillshade@20",
          pane: "additionalLayers1",
        },

        fernwaerme: {
          title: (
            <span>
              Fernwärme{" "}
              <Icon
                style={{
                  color: "#EEB48C",
                  width: "30px",
                  textAlign: "center",
                }}
                name={"circle"}
              />
            </span>
          ),
          initialActive: true,
          layer: (
            <StyledWMSTileLayer
              key={"fernwaermewsw"}
              url="https://maps.wuppertal.de/deegree/wms"
              layers="fernwaermewsw "
              format="image/png"
              tiled="true"
              transparent="true"
              pane="additionalLayers0"
              maxZoom={19}
              opacity={0.7}
            />
          ),
        },
        uwz: {
          title: "Umweltzone",
          initialActive: true,
          layer: (
            <FeatureCollectionDisplayWithTooltipLabels
              key={"ds"}
              featureCollection={uwz}
              // boundingBox={this.props.mapping.boundingBox}
              style={(feature) => {
                const style = {
                  color: "#155317",
                  weight: 3,
                  opacity: 0.5,
                  fillColor: "#155317",
                  fillOpacity: 0.15,
                };
                return style;
              }}
              featureClickHandler={() => {}}
            />
          ),
        },
      }}
    >
      <TopicMapComponent
        gazData={gazData}
        gazetteerSearchPlaceholder="Stadtteil | Adresse | POI | Standorte"
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
        secondaryInfo={<InfoPanel />}
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const TopicMapWithCrossTabCommunicationContextProvider = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);
  const currentZoom = 14;

  // console.log("xxx layer", JSON.stringify(remoteConfig));
  const [followerBounds, setFollowerBounds] = useState(undefined);
  return (
    <CrossTabCommunicationContextProvider
      followerConfigOverwrites={{
        RoutedMap: {
          zoomSnap: 0.1, //does not work atm
        },
      }}
      messageManipulation={(scope, message) => {
        if (scope === "RoutedMap" && message.type === "mapState") {
          const manipulatedMessage = { ...message };
          manipulatedMessage.mapState = {
            ...message.mapState,
            zoom: message.mapState.zoom, // +1
          };
          // console.log("xxx manipulatedMessage", manipulatedMessage);
          return manipulatedMessage;
        }
        return message;
      }}
      role="sync"
      token="myToken"
    >
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
          homeZoom={17}
          maxZoom={22}
          gazData={gazData}
          gazetteerSearchPlaceholder="Stadtteil | Adresse | POI | Standorte"
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
          secondaryInfo={<InfoPanel />}
        >
          <FeatureCollection />
          <ProjSingleGeoJson
            key={"blacky"}
            geoJson={uwz[0]}
            style={{
              zIndex: 999999910000000,
              color: "black",
              weight: 1,
              opacity: 1,
              fillColor: "black",
              fillOpacity: 0.3,
            }}
            masked={false}
            // _maskingPolygon={maskingPolygon}
            // _mapRef={leafletRoutedMapRef}
          />

          <CrossTabCommunicationControl key="crosstabcomcontr" hideWhenNoSibblingIsPresent={true} />
        </TopicMapComponent>
      </TopicMapContextProvider>
    </CrossTabCommunicationContextProvider>
  );
};

export const TopicMapWithCrossTabCommunicationContextProviderProblem = () => {
  function WuppNight() {
    //const [loaded, setLoaded] = useState(false);

    //   const x = () => {};
    console.log("render", new Error());

    return (
      <StyledWMSTileLayer
        url="https://maps.wuppertal.de/deegree/wms"
        layers="R102:trueortho2022"
        type="wms"
        format="image/png"
        xxx={() => {
          console.log("xxx true ortho loaded");
          //setLoaded(true);
        }}
      />
    );
  }

  return (
    <TopicMapContextProvider>
      <CrossTabCommunicationContextProvider
        token="projectorDemo"
        withoutHeartbeat={true}
        role="follower"
        leaderblocklist={["RoutedMap"]}
        messageManipulation={(scope, message) => {
          if (scope === "RoutedMap" && message.type === "mapState") {
            return;
          } else {
            return message;
          }
        }}
        followerConfigOverwrites={{
          RoutedMap: {
            zoomSnap: 0.1, //does not work atm
          },
        }}
      >
        <TopicMapComponent>
          <WuppNight />
        </TopicMapComponent>
      </CrossTabCommunicationContextProvider>
    </TopicMapContextProvider>
  );
};

export const RemoteControledTopicMap = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);
  const currentZoom = 14;
  const channel = new BroadcastChannel("leader/QUIRKS");
  channel.onmessage = (msg) => console.dir(msg);
  channel.postMessage("I am not alone, but shouldnt be speak to myself");

  let remoteConfig = {
    topicMap: {
      hamburgerMenu: false,
      zoomControls: false,
      gazetteerSearchControl: false,
      fullScreenControl: false,
      locatorControl: false,
      infoBox: undefined,
      mapStyle: { transform: "skey(1.1)" },
      featureCollection: undefined,
    },
    topicMapContextProvider: {},
  };

  // console.log("xxx layer", JSON.stringify(remoteConfig));

  return (
    <TopicMapContextProvider
      featureItemsURL="/data/bpklima.data.json"
      getFeatureStyler={getGTMFeatureStyler}
      convertItemToFeature={convertBPKlimaItemsToFeature}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
      }}
      referenceSystemDefinition={MappingConstants.proj4crs25832def}
      mapEPSGCode="25832"
      referenceSystem={MappingConstants.crs25832}
      clusteringEnabled={true}
    >
      <TopicMapComponent
        gazData={gazData}
        gazetteerSearchPlaceholder="Stadtteil | Adresse | POI | Standorte"
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
        secondaryInfo={<InfoPanel />}
        {...remoteConfig.topicMap}
      >
        {/* <FeatureCollection /> */}
        <ProjSingleGeoJson
          key={"blacky"}
          geoJson={uwz[0]}
          style={{
            zIndex: 999999910000000,
            color: "black",
            weight: 1,
            opacity: 1,
            fillColor: "black",
            fillOpacity: 0.3,
          }}
          masked={false}
          // _maskingPolygon={maskingPolygon}
          // _mapRef={leafletRoutedMapRef}
        />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const TopicMapWithWithCustomSettingsAndOneAdditionlLayer = () => {
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
      itemFilterFunction={({ filterState, filterMode }) => {
        return (item) => {
          if (filterMode === "themen") {
            return filterState?.themen?.includes(item.thema.id);
          } else if (filterMode === "kategorien") {
            for (const cat of item.kategorien) {
              if (filterState?.kategorien?.includes(cat)) {
                return true;
              }
            }
            return false;
          } else {
            return true;
          }
        };
      }}
      additionalLayerConfiguration={{
        fernwaerme: {
          title: (
            <span>
              Fernwärme{" "}
              <Icon
                style={{
                  color: "#EEB48C",
                  width: "30px",
                  textAlign: "center",
                }}
                name={"circle"}
              />
            </span>
          ),
          initialActive: true,
          layer: (
            <StyledWMSTileLayer
              key={"fernwaermewsw"}
              url="https://maps.wuppertal.de/deegree/wms"
              layers="fernwaermewsw "
              format="image/png"
              tiled="true"
              transparent="true"
              maxZoom={19}
              opacity={0.7}
            />
          ),
        },
      }}
    >
      <TopicMapComponent
        modalMenu={<MyMenu />}
        gazData={gazData}
        gazetteerSearchPlaceholder="Stadtteil | Adresse | POI | Standorte"
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
        secondaryInfo={<InfoPanel />}
        // secondaryInfoBoxElements={[<InfoBoxFotoPreview />]}
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const TopicMapWithCustomLayerSetAndAdditionalOverlayLayers = () => {
  const backgroundModes = [
    {
      title: "Stadtplan",
      mode: "default",
      layerKey: "stadtplan",
    },
    {
      title: "Stadtplan (Vektordaten light)",
      mode: "default",
      layerKey: "vector",
    },

    { title: "Luftbildkarte", mode: "default", layerKey: "lbk" },
  ];
  const backgroundConfigurations = {
    lbk: {
      layerkey: "_cismetText|trueOrtho2020@80",
      layerkey_: "wupp-plan-live@100|trueOrtho2020@75|rvrSchrift@100",
      src: "/images/rain-hazard-map-bg/ortho.png",
      title: "Luftbildkarte",
    },
    stadtplan: {
      layerkey: "wupp-plan-live@60",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    vector: {
      layerkey: "cismetLight",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
  };
  const baseLayerConf = { ...defaultLayerConf };

  baseLayerConf.namedLayers.cismetLight = {
    type: "vector",
    style: "https://omt.map-hosting.de/styles/cismet-light/style.json",
    pane: "backgroundvectorLayers",
  };
  baseLayerConf.namedLayers.cismetText = {
    type: "vector",
    style: "http://localhost:888/styles/cismet-text/style.json",
    pane: "backgroundlayerTooltips",
  };

  // baseLayerConf.namedLayers.cismetLight = {
  //   type: "vector",
  //   style_: "http://bender.local:888/styles/cismet-light/style.json",
  //   style__: "https://omt.map-hosting.de/styles/cismet-light/style.json",
  //   style: "http://localhost:888/styles/umweltalarm/style.json",
  //   pane: "backgroundvectorLayers",
  // };
  // baseLayerConf.namedLayers.cismetText = {
  //   type: "vector",
  //   style_: "http://omt.map-hosting.de/styles/klokantech-basic/style.json",
  //   style: "http://localhost:888/styles/cismet-text/style.json",

  //   Xopacity: 0.005,
  //   XiconOpacity: 0.7,
  //   XtextOpacity: 0.7,
  //   pane: "backgroundlayerTooltips",
  // };

  return (
    <TopicMapContextProvider
      persistenceSettings={{
        ui: ["XappMenuVisible", "appMenuActiveMenuSection", "collapsedInfoBox"],
        featureCollection: ["filterState", "filterMode", "clusteringEnabled"],
        responsive: [],
        styling: [
          "activeAdditionalLayerKeys",
          "namedMapStyle",
          "selectedBackground",
          "markerSymbolSize",
        ],
      }}
      baseLayerConf={baseLayerConf}
      backgroundConfigurations={backgroundConfigurations}
      backgroundModes={backgroundModes}
      referenceSystem={MappingConstants.crs3857}
      mapEPSGCode="3857"
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      maskingPolygon="POLYGON((668010.063156992 6750719.23021889,928912.612468322 6757273.20343972,930494.610325512 6577553.43685138,675236.835570551 6571367.64964125,668010.063156992 6750719.23021889))"
      additionalLayerConfiguration={{
        brunnen: {
          title: <span>Trinkwasserbrunnen</span>,
          initialActive: true,
          layer: (
            <MapLibreLayer
              key={"brunnen"}
              style_="http://localhost:888/styles/brunnen/style.json"
              style="https://omt.map-hosting.de/styles/brunnen/style.json"
              pane="additionalLayers0"
            />
          ),
        },

        kanal: {
          title: <span>Kanalnetzyy</span>,
          initialActive: true,
          layer: (
            <MapLibreLayer
              key={"kanal"}
              style="http://localhost:888/styles/kanal/style.json"
              style_="https://omt.map-hosting.de/styles/kanal/style.json"
              pane="additionalLayers1"
            />
          ),
        },

        gewaesser: {
          title: <span>Gewässernetz</span>,
          initialActive: true,
          layer: (
            <MapLibreLayer
              key={"gewaesser"}
              style_="http://localhost:888/styles/gewaesser/style.json"
              style="https://omt.map-hosting.de/styles/gewaesser/style.json"
              pane="additionalLayers2"
            />
          ),
        },
      }}
    >
      <TopicMapComponent
        homeZoom={13}
        maxZoom={22}
        locatorControl={true}
        modalMenu={
          <AppMenu
            x={99}
            previewMapPosition="lat=51.25508899597954&lng=7.155737656576095&zoom=17"
          />
        }
      >
        {/* <MapLibreLayer
          key={"umweltalarm"}
          style="http://localhost:888/styles/umweltalarm/style.json"
          pane="additionalLayers"
        /> */}
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const TopicMapTholey = () => {
  const backgroundModes = [
    {
      title: "Stadtplan",
      mode: "default",
      layerKey: "stadtplan",
    },
    {
      title: "Stadtplan (Vektordaten light)",
      mode: "default",
      layerKey: "vector",
    },

    { title: "Luftbildkarte", mode: "default", layerKey: "lbk" },
  ];
  const backgroundConfigurations = {
    lbk: {
      layerkey: "slDOPlicSingle@80|cismetBasic",
      layerkey_: "wupp-plan-live@100|trueOrtho2020@75|rvrSchrift@100",
      src: "/images/rain-hazard-map-bg/ortho.png",
      title: "Luftbildkarte",
    },
    stadtplan: {
      layerkey: "cismetBasic",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    vector: {
      layerkey: "cismetLight",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
  };
  const baseLayerConf = { ...defaultLayerConf };

  baseLayerConf.namedLayers.cismetLight = {
    type: "vector",
    style: "https://omt.map-hosting.de/styles/cismet-light/style.json",
    pane: "backgroundvectorLayers",
  };

  baseLayerConf.namedLayers.cismetBasic = {
    type: "vector",
    opacity: 1,
    attribution:
      'Hintergrundkarte basierend auf &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> Vektorkarte',
    style: "https://omt.map-hosting.de/styles/cismet-basic/style.json",
    pane: "backgroundvectorLayers",
  };
  baseLayerConf.namedLayers.slDOPlic = {
    type: "wms",
    url:
      "https://dop-sl-tholey-usage-only-allowed-with-rainhazardmap-tholey.cismet.de?REQUEST=GetCapabilities&VERSION=1.1.1&SERVICE=WMS&forceBasicAuth=true",
    layers: "sl_dop20_rgb",
    tiled: false,
    version: "1.1.1",
  };
  baseLayerConf.namedLayers.slDOPlicSingle = {
    type: "wms-nt",
    url:
      "https://dop-sl-tholey-usage-only-allowed-with-rainhazardmap-tholey.cismet.de?REQUEST=GetCapabilities&VERSION=1.1.1&SERVICE=WMS&forceBasicAuth=true",
    layers: "sl_dop20_rgb",
    tiled: false,
    version: "1.1.1",
  };

  return (
    <TopicMapContextProvider
      persistenceSettings={{
        ui: ["XappMenuVisible", "appMenuActiveMenuSection", "collapsedInfoBox"],
        featureCollection: ["filterState", "filterMode", "clusteringEnabled"],
        responsive: [],
        styling: [
          "activeAdditionalLayerKeys",
          "namedMapStyle",
          "selectedBackground",
          "markerSymbolSize",
        ],
        crosstabcommunication: [],
      }}
      baseLayerConf={baseLayerConf}
      backgroundConfigurations={backgroundConfigurations}
      backgroundModes={backgroundModes}
      referenceSystem={MappingConstants.crs3857}
      mapEPSGCode="3857"
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      homeZoom={13}
    >
      <TopicMapComponent
        homeZoom={16}
        homeCenter={[49.481343565241936, 7.033912385813893]}
        maxZoom={22}
        locatorControl={true}
        modalMenu={
          <AppMenu
            x={99}
            previewMapPosition="lat=51.25508899597954&lng=7.155737656576095&zoom=17"
          />
        }
      ></TopicMapComponent>
    </TopicMapContextProvider>
  );
};
export const TopicMapWithWithFilterDrivenTitleBoxWithActivatedOverlayConsole = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData25387(setGazData);
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
  };

  return (
    <TopicMapContextProvider
      referenceSystemDefinition={MappingConstants.proj4crs25832def}
      mapEPSGCode="25832"
      referenceSystem={MappingConstants.crs25832}
      featureItemsURL="/data/bpklima.data.json"
      getFeatureStyler={getGTMFeatureStyler}
      convertItemToFeature={convertBPKlimaItemsToFeature}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
      }}
      clusteringEnabled={true}
      itemFilterFunction={({ filterState, filterMode }) => {
        return (item) => {
          if (filterMode === "themen") {
            return filterState?.themen?.includes(item.thema.id);
          } else if (filterMode === "kategorien") {
            for (const cat of item.kategorien) {
              if (filterState?.kategorien?.includes(cat)) {
                return true;
              }
            }
            return false;
          } else {
            return true;
          }
        };
      }}
      additionalLayerConfiguration={{
        fernwaerme: {
          title: (
            <span>
              Fernwärme{" "}
              <Icon
                style={{
                  color: "#EEB48C",
                  width: "30px",
                  textAlign: "center",
                }}
                name={"circle"}
              />
            </span>
          ),
          initialActive: true,
          layer: (
            <StyledWMSTileLayer
              key={"fernwaermewsw"}
              url="https://maps.wuppertal.de/deegree/wms"
              layers="fernwaermewsw "
              format="image/png"
              tiled="true"
              transparent="true"
              maxZoom={19}
              opacity={0.7}
            />
          ),
          additionalControls: (
            <a
              className="renderAsLink"
              onClick={() => {
                console.log("yksjdfhdskljfhldfkashj");
              }}
            >
              <FontAwesomeIcon icon={faSync}></FontAwesomeIcon>
            </a>
          ),
        },
      }}
      backgroundConfigurations={backgroundConfigurations}
      backgroundModes={[
        {
          title: "Stadtplan (Tag)",
          mode: "default",
          layerKey: "stadtplan",
          additionalControls: (
            <a
              className="renderAsLink"
              onClick={() => {
                console.log("yksjdfhdskljfhldfkashj");
              }}
            >
              <FontAwesomeIcon icon={faSync}></FontAwesomeIcon>
            </a>
          ),
        },
        {
          title: "Stadtplan (Nacht)",
          mode: "night",
          layerKey: "stadtplan",
        },
        { title: "Luftbildkarte", mode: "default", layerKey: "lbk" },
      ]}
      titleFactory={({ featureCollectionContext }) => {
        const getThemaById = (id) => {
          const result = featureCollectionContext?.items?.find((item) => item?.thema?.id === id);
          return result?.thema?.name;
        };

        let themenstadtplanDesc = "?";
        if (
          featureCollectionContext?.filteredItems?.length ===
          featureCollectionContext?.items?.length
        ) {
          themenstadtplanDesc = undefined;
        } else if (featureCollectionContext?.filterMode === "themen") {
          if (featureCollectionContext?.filterState?.themen?.length <= 2) {
            const themenIds = featureCollectionContext?.filterState?.themen;
            const themen = [];
            for (const id of themenIds) {
              themen.push(getThemaById(id));
            }

            themenstadtplanDesc = "nach Themen gefiltert (nur " + themen.join(", ") + ")";
          } else {
            themenstadtplanDesc =
              "nach Themen gefiltert (" +
              featureCollectionContext?.filterState?.themen?.length +
              " Themen)";
          }
        } else if (featureCollectionContext?.filterMode === "kategorien") {
          if (featureCollectionContext?.filterState?.kategorien?.length <= 3) {
            themenstadtplanDesc =
              "nach Kategorien gefiltert (nur " +
              featureCollectionContext?.filterState?.kategorien?.join(", ") +
              ")";
          } else {
            themenstadtplanDesc =
              "nach Kategorien gefiltert (" +
              featureCollectionContext?.filterState?.kategorien?.length +
              " Kategorien)";
          }
        }

        if (featureCollectionContext?.filteredItems?.length === 0) {
          return (
            <div>
              <b>Keine Klimastandorte gefunden!</b> Bitte überprüfen Sie Ihre Filtereinstellungen.
            </div>
          );
        }

        if (themenstadtplanDesc) {
          return (
            <div>
              <b>Meine Klimastandorte:</b> {themenstadtplanDesc}
            </div>
          );
        } else {
          return undefined;
        }
      }}
    >
      <LogConsole ghostModeAvailable={true} minifyAvailable={true} />
      <TopicMapComponent
        modalMenu={<MyMenu />}
        gazData={gazData}
        gazetteerSearchPlaceholder="Stadtteil | Adresse | POI | Standorte"
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
        secondaryInfo={<InfoPanel />}
        // secondaryInfoBoxElements={[<InfoBoxFotoPreview />]}
        // gazetteerHitTrigger={(hits) => {
        //   if (Array.isArray(hits) && hits[0]?.more?.id) {
        //     setSelectedFeatureByPredicate((feature) => {
        //       try {
        //         const check = parseInt(feature.properties.standort.id) === hits[0].more.id;
        //         if (check === true) {
        //           zoomToFeature(feature);
        //         }
        //         return check;
        //       } catch (e) {
        //         return false;
        //       }
        //     });
        //   }
        // }}
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const TopicMapWithWithFilterDrivenTitleBox = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData25387(setGazData);
  }, []);

  const backgroundConfigurations = {
    topo: {
      layerkey: "hillshade|bplan_abkg@30|wupp-plan-live@20",
      src: "/images/rain-hazard-map-bg/topo.png",
      title: "Top. Karte",
    },
    lbk: {
      layerkey: "rvrGrundriss@100|trueOrtho2022@75|rvrSchriftNT@100",
      src: "/images/rain-hazard-map-bg/ortho.png",
      title: "Luftbildkarte",
    },
    stadtplan: {
      layerkey: "wupp-plan-live@90",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
  };

  return (
    <TopicMapContextProvider
      referenceSystemDefinition={MappingConstants.proj4crs25832def}
      mapEPSGCode="25832"
      referenceSystem={MappingConstants.crs25832}
      featureItemsURL="/data/bpklima.data.json"
      getFeatureStyler={getGTMFeatureStyler}
      convertItemToFeature={convertBPKlimaItemsToFeature}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
      }}
      clusteringEnabled={true}
      itemFilterFunction={({ filterState, filterMode }) => {
        return (item) => {
          if (filterMode === "themen") {
            return filterState?.themen?.includes(item.thema.id);
          } else if (filterMode === "kategorien") {
            for (const cat of item.kategorien) {
              if (filterState?.kategorien?.includes(cat)) {
                return true;
              }
            }
            return false;
          } else {
            return true;
          }
        };
      }}
      additionalLayerConfiguration={{
        fernwaerme: {
          title: (
            <span>
              Fernwärme{" "}
              <Icon
                style={{
                  color: "#EEB48C",
                  width: "30px",
                  textAlign: "center",
                }}
                name={"circle"}
              />
            </span>
          ),
          initialActive: true,
          layer: (
            <StyledWMSTileLayer
              key={"fernwaermewsw"}
              url="https://maps.wuppertal.de/deegree/wms"
              layers="fernwaermewsw "
              format="image/png"
              tiled="true"
              transparent="true"
              maxZoom={19}
              opacity={0.7}
            />
          ),
          additionalControls: (
            <a
              className="renderAsLink"
              onClick={() => {
                console.log("yksjdfhdskljfhldfkashj");
              }}
            >
              <FontAwesomeIcon icon={faSync}></FontAwesomeIcon>
            </a>
          ),
        },
      }}
      backgroundConfigurations={backgroundConfigurations}
      backgroundModes={[
        {
          title: "Stadtplan (Tag)",
          mode: "default",
          layerKey: "stadtplan",
          additionalControls: (
            <a
              className="renderAsLink"
              onClick={() => {
                console.log("yksjdfhdskljfhldfkashj");
              }}
            >
              <FontAwesomeIcon icon={faSync}></FontAwesomeIcon>
            </a>
          ),
        },
        {
          title: "Stadtplan (Nacht)",
          mode: "night",
          layerKey: "stadtplan",
        },
        { title: "Luftbildkarte", mode: "default", layerKey: "lbk" },
      ]}
      titleFactory={({ featureCollectionContext }) => {
        const getThemaById = (id) => {
          const result = featureCollectionContext?.items?.find((item) => item?.thema?.id === id);
          return result?.thema?.name;
        };

        let themenstadtplanDesc = "?";
        if (
          featureCollectionContext?.filteredItems?.length ===
          featureCollectionContext?.items?.length
        ) {
          themenstadtplanDesc = undefined;
        } else if (featureCollectionContext?.filterMode === "themen") {
          if (featureCollectionContext?.filterState?.themen?.length <= 2) {
            const themenIds = featureCollectionContext?.filterState?.themen;
            const themen = [];
            for (const id of themenIds) {
              themen.push(getThemaById(id));
            }

            themenstadtplanDesc = "nach Themen gefiltert (nur " + themen.join(", ") + ")";
          } else {
            themenstadtplanDesc =
              "nach Themen gefiltert (" +
              featureCollectionContext?.filterState?.themen?.length +
              " Themen)";
          }
        } else if (featureCollectionContext?.filterMode === "kategorien") {
          if (featureCollectionContext?.filterState?.kategorien?.length <= 3) {
            themenstadtplanDesc =
              "nach Kategorien gefiltert (nur " +
              featureCollectionContext?.filterState?.kategorien?.join(", ") +
              ")";
          } else {
            themenstadtplanDesc =
              "nach Kategorien gefiltert (" +
              featureCollectionContext?.filterState?.kategorien?.length +
              " Kategorien)";
          }
        }

        if (featureCollectionContext?.filteredItems?.length === 0) {
          return (
            <div>
              <b>Keine Klimastandorte gefunden!</b> Bitte überprüfen Sie Ihre Filtereinstellungen.
            </div>
          );
        }

        if (themenstadtplanDesc) {
          return (
            <div>
              <b>Meine Klimastandorte:</b> {themenstadtplanDesc}
            </div>
          );
        } else {
          return undefined;
        }
      }}
    >
      <TopicMapComponent
        modalMenu={<MyMenu />}
        gazData={gazData}
        gazetteerSearchPlaceholder="Stadtteil | Adresse | POI | Standorte"
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
        secondaryInfo={<InfoPanel />}
        // secondaryInfoBoxElements={[<InfoBoxFotoPreview />]}
        // gazetteerHitTrigger={(hits) => {
        //   if (Array.isArray(hits) && hits[0]?.more?.id) {
        //     setSelectedFeatureByPredicate((feature) => {
        //       try {
        //         const check = parseInt(feature.properties.standort.id) === hits[0].more.id;
        //         if (check === true) {
        //           zoomToFeature(feature);
        //         }
        //         return check;
        //       } catch (e) {
        //         return false;
        //       }
        //     });
        //   }
        // }}
      >
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
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
const mapTitle = "Corona-Präventionskarte";
export const TopicMapWithWithStaticFilter = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
    document.title = mapTitle;
  }, []);

  return (
    <TopicMapContextProvider
      //host=https://wupp-topicmaps-data.cismet.de
      //appKey='CoronaPraeventionskarteWuppertal.TopicMap'

      featureItemsURL={host + "/data/poi.data.json"}
      referenceSystem={MappingConstants.crs25832}
      mapEPSGCode="25832"
      referenceSystemDefinition={MappingConstants.proj4crs25832def}
      getFeatureStyler={getGTMFeatureStyler}
      featureTooltipFunction={(feature) => feature?.text}
      convertItemToFeature={convertPOIItemsToFeature}
      clusteringOptions={{
        iconCreateFunction: getClusterIconCreatorFunction(30, (props) => props.color),
      }}
      clusteringEnabled={true}
      itemFilterFunction={() => {
        return (item) => item?.mainlocationtype?.name?.toLowerCase().includes("corona");
        // item?.name?.toLowerCase().includes("test");
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

export const TopicMapWithLineFeatureCollection = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider
      items={[nordbahntrasse]}
      featureTooltipFunction={(feature) => feature?.text}
    >
      <TopicMapComponent gazData={gazData}>
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};

export const TopicMapWithPolygonFeatureCollection = () => {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <TopicMapContextProvider
      items={kassenzeichen}
      featureTooltipFunction={(feature) => feature?.properties?.bez}
    >
      <TopicMapComponent gazData={gazData}>
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};
