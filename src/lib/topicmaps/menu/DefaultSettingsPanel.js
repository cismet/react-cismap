import React, { useContext, useState, useEffect, useRef } from "react";
import Section from "./Section";
import SettingsPanelWithPreviewSection from "./SettingsPanelWithPreviewSection";
import { Map } from "react-leaflet";

import { UIContext, UIDispatchContext } from "../../contexts/UIContextProvider";
import { TopicMapContext } from "../../contexts/TopicMapContextProvider";
import {
  FeatureCollectionContext,
  FeatureCollectionDispatchContext,
} from "../../contexts/FeatureCollectionContextProvider";
import { MappingConstants } from "../..";
import getLayersByName from "../../tools/layerFactory";
import { Form, ToggleButton } from "react-bootstrap";
import NamedMapStyleChooser from "./NamedMapStyleChooser";
import SymbolSizeChooser from "./SymbolSizeChooser";
import FeatureCollectionDisplay from "../../FeatureCollectionDisplay";
import { ResponsiveTopicMapContext } from "../../contexts/ResponsiveTopicMapContextProvider";
import {
  TopicMapStylingContext,
  TopicMapStylingDispatchContext,
} from "../../contexts/TopicMapStylingContextProvider";

const SettingsPanel = (props) => {
  const { setAppMenuActiveMenuSection, setAppMenuVisible } = useContext(UIDispatchContext);
  const { activeMenuSection } = useContext(UIContext);
  const { routedMapRef } = useContext(TopicMapContext);
  const {
    allFeatures,
    getFeatureStyler,
    getColorFromProperties,
    clusteringEnabled,
    clusteringOptions,
  } = useContext(FeatureCollectionContext);
  const { setClusteringEnabled } = useContext(FeatureCollectionDispatchContext);
  const { windowSize } = useContext(ResponsiveTopicMapContext);

  const {
    backgroundModes: backgroundModesFromContext,
    selectedBackground,
    backgroundConfigurations,
  } = useContext(TopicMapStylingContext);

  const {
    namedMapStyle,
    urlPathname,
    urlSearch,
    pushNewRoute,
    width = windowSize?.width,
    setLayerByKey,
    activeLayerKey,
    backgroundModes,
    changeMarkerSymbolSize,
    currentMarkerSize = 24,
    getSymbolSVG = () => {},
    symbolColor = "#2664D8",

    // previewMapLat = 51.25910046459786,
    // previewMapLng = 7.1810811127858925,
    // previewMapZoom = 8,
    previewMapLat = 51.25548256737119,
    previewMapLng = 7.14534279930707,
    previewMapZoom = 12,

    previewFeatureCollection,
    previewMapClusteringEnabled,
    previewMapClusteringOptions,
  } = props;
  let namedMapStyleFromUrl = new URLSearchParams(window.location.href).get("mapStyle") || "default";

  const _namedMapStyle = namedMapStyleFromUrl;
  const layers = routedMapRef?.props?.backgroundlayers;
  const [mapPreview, setMapPreview] = useState();

  let backgroundsFromMode;
  try {
    backgroundsFromMode = backgroundConfigurations[selectedBackground].layerkey;
  } catch (e) {}

  useEffect(() => {
    //uglyWinning : with variable using for mapPreveiw there are refresh Problems
    setMapPreview(
      <Map
        key={"map" + allFeatures.length + selectedBackground + _namedMapStyle}
        crs={MappingConstants.crs25832}
        style={{ height: 300 }}
        center={{
          lat: Number(previewMapLat),
          lng: Number(previewMapLng),
        }}
        zoomControl={false}
        doubleClickZoom={false}
        attributionControl={false}
        dragging={false}
        keyboard={false}
        zoom={Number(previewMapZoom)}
        minZoom={Number(previewMapZoom)}
        maxZoom={Number(previewMapZoom)}
      >
        {getLayersByName(backgroundsFromMode, _namedMapStyle)}
        <FeatureCollectionDisplay
          key={
            "FeatureCollectionDisplayPreview." + currentMarkerSize + clusteringEnabled
            // +
            //   this.props.featureKeySuffixCreator() +
            //   "clustered:" +
            //   this.props.clustered +
            //   ".customPostfix:" +
            //   this.props.featureCollectionKeyPostfix
          }
          featureCollection={previewFeatureCollection || allFeatures}
          clusteringEnabled={previewMapClusteringEnabled || clusteringEnabled}
          clusterOptions={previewMapClusteringOptions || clusteringOptions}
          style={getFeatureStyler(currentMarkerSize, getColorFromProperties)}
          featureStylerScalableImageSize={currentMarkerSize}
          //mapRef={previewMapRef} // commented out because there cannot be a ref in a functional comp and it is bnot needed
          showMarkerCollection={false}
        />
      </Map>
    );
  }, [backgroundsFromMode, _namedMapStyle, clusteringEnabled]);

  const preview = (
    <div>
      <Form.Group>
        <Form.Label>Vorschau:</Form.Label>
        <br />
        {mapPreview}
      </Form.Group>
    </div>
  );

  return (
    <Section
      key={"GenericModalMenuSection." + symbolColor}
      sectionKey="settings"
      sectionTitle="Einstellungen"
      sectionBsStyle="primary"
      sectionContent={
        <SettingsPanelWithPreviewSection
          width={width}
          preview={preview}
          settingsSections={[
            <Form>
              <Form.Label>Einstellungen :</Form.Label>
              <br />
              {/* <Form.Check
                type="check"
                readOnly={true}
                key={"title.checkbox" + titleDisplay}
                checked={titleDisplay}
                onClick={(e) => {
                  if (e.target.checked === false) {
                    pushNewRoute(urlPathname + removeQueryPart(urlSearch, "title"));
                  } else {
                    pushNewRoute(urlPathname + (urlSearch !== "" ? urlSearch : "?") + "&title");
                  }
                }}
                inline
              >
                Titel bei individueller Filterung anzeigen
              </Form.Check>
              <br /> */}
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  readOnly={true}
                  key={"clustered.checkbox-" + clusteringEnabled}
                  id={"clustered.checkbox"}
                  checked={clusteringEnabled}
                  onClick={(e) => {
                    console.log("xxx onClick", e);
                  }}
                  onChange={(e) => {
                    console.log("xxx e", e);

                    if (e.target.checked === false) {
                      console.log("xxx  setClusteringEnabled(false)");
                      setClusteringEnabled(false);
                    } else {
                      console.log("xxx  setClusteringEnabled(false)");

                      setClusteringEnabled(true);
                    }
                  }}
                  label="Objekte maßstabsabhängig zusammenfassen"
                />
              </Form.Group>
            </Form>,
            <NamedMapStyleChooser
              key={"nmsc++ backgroundsFromMode + _namedMapStyle"}
              currentNamedMapStyle={_namedMapStyle}
              pathname={urlPathname}
              search={urlSearch}
              pushNewRoute={pushNewRoute}
              vertical
              setLayerByKey={setLayerByKey}
              activeLayerKey={activeLayerKey}
            />,
            <SymbolSizeChooser
              changeMarkerSymbolSize={changeMarkerSymbolSize}
              currentMarkerSize={currentMarkerSize}
              getSymbolSVG={getSymbolSVG}
              symbolColor={symbolColor}
            />,
          ]}
        />
      }
    />
  );
};
export default SettingsPanel;
