import React, { useContext, useState, useEffect, useRef } from "react";
import Section from "./Section";
import SettingsPanelWithPreviewSection from "./SettingsPanelWithPreviewSection";
import { Map } from "react-leaflet";
import queryString from "query-string";
import { removeQueryPart, modifyQueryPart } from "../../tools/routingHelper";

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
import { getSymbolSVGGetter } from "../../tools/uiHelper";
import { defaultClusteringOptions, getDefaultFeatureStyler } from "../../FeatureCollection";

const SettingsPanel = (props) => {
  const { setAppMenuActiveMenuSection, setAppMenuVisible } = useContext(UIDispatchContext);
  const { activeMenuSection } = useContext(UIContext);
  const { routedMapRef, history } = useContext(TopicMapContext);
  const { setMarkerSymbolSize } = useContext(TopicMapStylingDispatchContext);
  const { markerSymbolSize, additionalLayerConfiguration, activeAdditionalLayerKeys } = useContext(
    TopicMapStylingContext
  );
  const {
    allFeatures,
    getFeatureStyler,
    getColorFromProperties,
    clusteringEnabled,
    clusteringOptions,
    getSymbolSVG: getSymbolSVGFromContext,
    itemFilterFunction,
    filterFunction,
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
    currentMarkerSize,
    getSymbolSVG,
    symbolColor,
    previewMapPosition,
    previewFeatureCollection,
    previewFeatureCollectionCount,
    previewMapClusteringEnabled,
    previewMapClusteringOptions,
    titleCheckBoxlabel,
  } = props;

  const _changeMarkerSymbolSize = changeMarkerSymbolSize || setMarkerSymbolSize;
  const _markerSymbolSize = currentMarkerSize || markerSymbolSize;
  let namedMapStyleFromUrl = new URLSearchParams(window.location.href).get("mapStyle") || "default";
  let _getSymbolSVG = getSymbolSVG || getSymbolSVGFromContext;
  let _symbolColor;
  if (allFeatures && allFeatures[0]) {
    if (getColorFromProperties) {
      _symbolColor = getColorFromProperties(allFeatures[0].properties);
    } else {
      _symbolColor = allFeatures[0].properties.color;
    }
  }
  if (_symbolColor === undefined) {
    _symbolColor = "#2664D8";
  }
  if (_getSymbolSVG === undefined) {
    try {
      if (
        allFeatures?.length > 0 &&
        allFeatures[0]?.properties?.svgBadge &&
        allFeatures[0]?.properties?.svgBadgeDimension
      ) {
        // console.log(
        //   "xxx try to set getSymbolSVG from featurecollection for ",
        //   allFeatures[0]?.properties?.svgBadge,
        //   allFeatures[0]?.properties?.svgBadgeDimension
        // );

        _getSymbolSVG = getSymbolSVGGetter(
          allFeatures[0]?.properties?.svgBadge,
          allFeatures[0]?.properties?.svgBadgeDimension
        );
      }
    } catch (e) {
      // console.log("xxx error when trying to get getSymbolSVG from featurecollection", e);
      //in this case a default Icon is shown
    }
  }
  let previewMapPositionParams = new URLSearchParams(previewMapPosition);
  let previewMapLng = previewMapPositionParams.get("lng") || "7.14534279930707";
  let previewMapLat = previewMapPositionParams.get("lat") || "51.25548256737119";
  let previewMapZoom = previewMapPositionParams.get("zoom") || "12";

  let _urlPathname, _urlSearch, _pushNewRoute;
  const _namedMapStyle = namedMapStyleFromUrl;
  const layers = routedMapRef?.props?.backgroundlayers;
  const [mapPreview, setMapPreview] = useState();
  const qTitle = queryString.parse(history.location.search).title;

  const [titleDisplay, setTitleDisplay] = useState(qTitle !== undefined);
  let backgroundsFromMode;
  try {
    backgroundsFromMode = backgroundConfigurations[selectedBackground].layerkey;
  } catch (e) {}

  useEffect(() => {
    //uglyWinning : with variable using for mapPreveiw there are refresh Problems

    let style;
    if (getFeatureStyler !== undefined) {
      style = getFeatureStyler(_markerSymbolSize, getColorFromProperties);
    } else {
      style = getDefaultFeatureStyler(_markerSymbolSize, getColorFromProperties);
    }
    let previewFeatures;

    if (previewFeatureCollection) {
      previewFeatures = previewFeatureCollection;
    } else {
      if (previewFeatureCollectionCount === -1 || previewFeatureCollectionCount === undefined) {
        previewFeatures = allFeatures;
      } else {
        previewFeatures = allFeatures.slice(0, previewFeatureCollectionCount);
      }
    }
    setMapPreview(
      <Map
        key={"map" + allFeatures?.length + selectedBackground + _namedMapStyle}
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
        <div key={"." + JSON.stringify(activeAdditionalLayerKeys)}>
          {getLayersByName(backgroundsFromMode, _namedMapStyle)}
          {activeAdditionalLayerKeys !== undefined &&
            activeAdditionalLayerKeys.length > 0 &&
            activeAdditionalLayerKeys.map((activekey, index) => {
              const layerConf = additionalLayerConfiguration[activekey];
              if (layerConf.layer) {
                return layerConf.layer;
              } else if (layerConf.layerkey) {
                const layers = getLayersByName(layerConf.layerkey);
                return layers;
              }
            })}
        </div>
        <FeatureCollectionDisplay
          key={"FeatureCollectionDisplayPreview." + _markerSymbolSize + clusteringEnabled}
          featureCollection={previewFeatures}
          clusteringEnabled={previewMapClusteringEnabled || clusteringEnabled}
          clusterOptions={{
            ...defaultClusteringOptions,
            ...(previewMapClusteringOptions || clusteringOptions),
          }}
          style={style}
          featureStylerScalableImageSize={currentMarkerSize}
          //mapRef={previewMapRef} // commented out because there cannot be a ref in a functional comp and it is bnot needed
          showMarkerCollection={false}
        />
      </Map>
    );
  }, [
    allFeatures,
    backgroundsFromMode,
    _namedMapStyle,
    clusteringEnabled,
    _markerSymbolSize,
    activeAdditionalLayerKeys,
  ]);

  let titlePreview = (
    <div
      style={{
        align: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          height: "10px",
        }}
      />
      <table
        style={{
          width: "96%",
          height: "30px",
          margin: "0 auto",
          zIndex: 999655,
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                background: "#ffffff",
                color: "black",
                opacity: "0.9",
                paddingleft: "10px",
              }}
            >
              <b>Kartentitel</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  let marginBottomCorrection = 0;
  if (titleDisplay) {
    marginBottomCorrection = -40;
  }
  const preview = (
    <div>
      <Form.Group>
        <Form.Label>Vorschau:</Form.Label>
        <br />
        <div style={{ marginBottom: marginBottomCorrection }}>
          {mapPreview}
          {titleDisplay === true && (
            <div
              style={{
                position: "relative",
                top: -300,
                zIndex: 100000,
                webkitTransform: "translate3d(0,0,0)",
              }}
            >
              {titlePreview}
            </div>
          )}
        </div>
      </Form.Group>
    </div>
  );

  if (urlPathname) {
    _urlPathname = urlPathname;
  } else {
    _urlPathname = history.location.pathname;
  }
  if (urlSearch) {
    _urlSearch = urlSearch;
  } else {
    _urlSearch = history.location.search;
  }
  if (pushNewRoute) {
    _pushNewRoute = pushNewRoute;
  } else {
    _pushNewRoute = history.push;
  }

  return (
    <Section
      key={"GenericModalMenuSection." + symbolColor}
      sectionKey="settings"
      sectionTitle="Einstellungen"
      sectionBsStyle="success"
      sectionContent={
        <SettingsPanelWithPreviewSection
          width={width}
          preview={preview}
          settingsSections={[
            <Form>
              <Form.Label>Einstellungen:</Form.Label>
              <br />
              {(itemFilterFunction || filterFunction) && (
                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    readOnly={true}
                    id={"title.checkbox"}
                    key={"title.checkbox" + titleDisplay}
                    checked={titleDisplay}
                    onChange={(e) => {
                      if (e.target.checked === false) {
                        _pushNewRoute(_urlPathname + removeQueryPart(_urlSearch, "title"));
                        setTitleDisplay(false);
                      } else {
                        _pushNewRoute(
                          _urlPathname + (_urlSearch !== "" ? _urlSearch : "?") + "&title"
                        );
                        setTitleDisplay(true);
                      }
                    }}
                    label={titleCheckBoxlabel || "Titel bei individueller Filterung anzeigen"}
                  ></Form.Check>
                </Form.Group>
              )}

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  readOnly={true}
                  key={"clustered.checkbox-" + clusteringEnabled}
                  id={"clustered.checkbox"}
                  checked={clusteringEnabled}
                  onClick={(e) => {
                    // console.log("xxx onClick", e);
                  }}
                  onChange={(e) => {
                    if (e.target.checked === false) {
                      setClusteringEnabled(false);
                    } else {
                      setClusteringEnabled(true);
                    }
                  }}
                  label="Objekte maßstabsabhängig zusammenfassen"
                />
              </Form.Group>
            </Form>,
            <NamedMapStyleChooser
              key={"nmsc"}
              currentNamedMapStyle={_namedMapStyle}
              pathname={_urlPathname}
              search={_urlSearch}
              pushNewRoute={_pushNewRoute}
              vertical
              setLayerByKey={setLayerByKey}
              activeLayerKey={activeLayerKey}
            />,
            <SymbolSizeChooser
              changeMarkerSymbolSize={_changeMarkerSymbolSize}
              currentMarkerSize={_markerSymbolSize}
              getSymbolSVG={_getSymbolSVG}
              symbolColor={_symbolColor}
            />,
          ]}
        />
      }
    />
  );
};
export default SettingsPanel;
