import React, { useState, useRef, useEffect, useContext } from "react";
import {
  RoutedMap,
  MappingConstants,
  FeatureCollectionDisplayWithTooltipLabels,
} from "../../index";
import GazetteerSearchControl from "../../GazetteerSearchControl";
import GazetteerHitDisplay from "../../GazetteerHitDisplay";
import ProjSingleGeoJson from "../../ProjSingleGeoJson";
import { storiesCategory, getGazData, host } from "./StoriesConf";
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
import { getClusterIconCreatorFunction, getSimpleHelpForTM } from "../../tools/uiHelper";
import { Form } from "react-bootstrap";
import { addSVGToProps, DEFAULT_SVG } from "../../tools/svgHelper";
import SecondaryInfo from "../../topicmaps/SecondaryInfo";
import SecondaryInfoPanelSection from "../../topicmaps/SecondaryInfoPanelSection";
import { UIContext, UIDispatchContext } from "../../contexts/UIContextProvider";
import InfoBoxFotoPreview from "../../topicmaps/InfoBoxFotoPreview";
import GenericModalApplicationMenu from "../../topicmaps/menu/ModalApplicationMenu";
import DefaultSettingsPanel from "../../topicmaps/menu/DefaultSettingsPanel";
import Section from "../../topicmaps/menu/Section";

import { Link } from "react-scroll";
import ConfigurableDocBlocks from "../../topicmaps/ConfigurableDocBlocks";
import FilterPanel from "../../topicmaps/menu/FilterPanel";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import Icon from "../../commons/Icon";
import uwz from "../_data/UWZ";
import queryString from "query-string";
import { nordbahntrasse } from "../_data/Demo";
import { defaultLayerConf } from "../../tools/layerFactory";
import MapLibreLayer from "../../vector/MapLibreLayer";

export default {
  title: storiesCategory + "TopicMapComponent",
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
      <TopicMapComponent maxZoom={22} gazData={gazData} />
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
      clusteringEnabled={true}
      additionalLayerConfiguration={{
        hillshade: {
          title: "Schummerung",
          initialActive: false,
          layerkey: "hillshade@20",
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
      layerkey: "cismetText|trueOrtho2020@70",
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
    style_: "http://bender.local:888/styles/cismetplus/style.json",
    style: "https://omt.map-hosting.de/styles/cismet-light/style.json",
    xpane: "backgroundvectorLayers",
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
      baseLayerConf={baseLayerConf}
      backgroundConfigurations={backgroundConfigurations}
      backgroundModes={backgroundModes}
      referenceSystem={MappingConstants.crs3857}
      mapEPSGCode="3857"
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      maskingPolygon="POLYGON((668010.063156992 6750719.23021889,928912.612468322 6757273.20343972,930494.610325512 6577553.43685138,675236.835570551 6571367.64964125,668010.063156992 6750719.23021889))"
      additionalLayerConfiguration={{
        umweltalarm: {
          title: (
            <span>
              Umweltalarm{" "}
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
          initialActive: false,
          layer: (
            <MapLibreLayer
              key={"umweltalarm"}
              style="http://localhost:888/styles/umweltalarm/style.json"
              pane="additionalLayers"
            />
          ),
        },
      }}
    >
      <TopicMapComponent
        homeZoom={13}
        maxZoom={22}
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

export const TopicMapWithWithFilterDrivenTitleBox = () => {
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
