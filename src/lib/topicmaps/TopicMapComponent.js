import React, { useState, useEffect, useRef, useContext } from "react";
import { Pane } from "react-leaflet";

import * as MappingConstants from "../constants/gis";
import GazetteerHitDisplay from "../GazetteerHitDisplay";
import ProjSingleGeoJson from "../ProjSingleGeoJson";
import { modifyQueryPart } from "../tools/routingHelper";
import Control from "react-leaflet-control";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import Icon from "../commons/Icon";
import RoutedMap from "../RoutedMap";
import Loadable from "react-loading-overlay";
import GazetteerSearchControl from "../GazetteerSearchControl";
import { TopicMapContext, TopicMapDispatchContext } from "../contexts/TopicMapContextProvider";
import { ResponsiveTopicMapContext } from "../contexts/ResponsiveTopicMapContextProvider";
import { UIContext, UIDispatchContext } from "../contexts/UIContextProvider";
import {
  TopicMapStylingContext,
  TopicMapStylingDispatchContext,
} from "../contexts/TopicMapStylingContextProvider";
import DefaultAppMenu from "./menu/DefaultAppMenu";
import PhotoLightBox from "./PhotoLightbox";
import getLayers from "../tools/layerFactory";
import md5 from "md5";
import TitleBox from "./TitleBox";

const TopicMapComponent = (props) => {
  const leafletRoutedMapRef = useRef(null);
  const infoBoxRef = useRef(null);
  let {
    modalMenu,
    showModalMenuOverride = false,
    statusPostfix = "",
    loadingStatus = undefined,
    pendingLoader = 0,
    noInitialLoadingText = false,
    initialLoadingText = "Laden der Daten ...",
    minZoom = 5,
    maxZoom = 19,
    mapStyle,
    homeCenter,
    homeZoom,
    home,
    ondblclick = () => {},
    onclick = () => {},
    locationChangedHandler = undefined,
    pushToHistory,
    autoFitBounds = false,
    autoFitMode = MappingConstants.AUTO_FIT_MODE_STRICT,
    autoFitBoundsTarget = null,
    setAutoFit = () => {},
    urlSearchParams,
    mappingBoundsChanged = (boundingbox) => {},
    backgroundlayers,
    fullScreenControl = true,
    locatorControl = false,
    // overlayFeature = undefined,
    // setOverlayFeature = () => {},
    // // gazetteerHit = undefined,
    // setGazetteerHit =undefined,
    gazData = [],

    searchControlWidth = 300,
    infoStyle,
    infoBoxBottomMargin,
    infoBox = <div />,
    secondaryInfoBoxElements = [],
    secondaryInfoBoxControlPosition,
    applicationMenuTooltipString = "Einstellungen | Anleitung",
    showModalApplicationMenu = undefined,
    applicationMenuIconname = "bars",
    secondaryInfo,
    gazetteerSearchPlaceholder,
    photoLightBox = true,
    attributionControl = false,
    gazetteerHitTrigger,
  } = props;
  const { history, referenceSystem, referenceSystemDefinition, maskingPolygon } = useContext(
    TopicMapContext
  );
  const {
    backgroundModes,
    selectedBackground,
    baseLayerConf,
    backgroundConfigurations,
    additionalLayerConfiguration,
    activeAdditionalLayerKeys,
  } = useContext(TopicMapStylingContext);

  const [url, setUrl] = useState(undefined);
  useEffect(() => {
    history.listen(({ action, location }) => {
      setUrl(history.location.search);
    });
  }, []);

  let featureCollectionDisplay;

  let _urlSearchParams;
  let _pushToHistory =
    pushToHistory ||
    ((url) => {
      history.push(url);
    });
  if (urlSearchParams === undefined) {
    _urlSearchParams = new URLSearchParams(url || history.location.search);
  } else {
    _urlSearchParams = urlSearchParams;
  }
  let backgroundsFromMode;
  try {
    backgroundsFromMode = backgroundConfigurations[selectedBackground].layerkey;
  } catch (e) {}

  const _backgroundLayers = backgroundlayers || backgroundsFromMode || "rvrGrau@40";

  const [gazetteerHit, setGazetteerHit] = useState(null);
  const [overlayFeature, setOverlayFeature] = useState(null);

  const { setBoundingBox, setLocation, setRoutedMapRef } = useContext(TopicMapDispatchContext);
  const { responsiveState, searchBoxPixelWidth, gap, windowSize } = useContext(
    ResponsiveTopicMapContext
  );

  const uiContext = useContext(UIContext);
  const { appMenuVisible, appMenuActiveMenuSelection } = uiContext;
  const { setAppMenuVisible, setAppMenuActiveMenuSection } = useContext(UIDispatchContext);

  useEffect(() => {
    if (leafletRoutedMapRef.current !== null) {
      setRoutedMapRef(leafletRoutedMapRef.current);
    }
  }, [leafletRoutedMapRef, setRoutedMapRef]);

  const _mapStyle = {
    cursor: "pointer",
    ...mapStyle,
  };

  if (windowSize) {
    _mapStyle.width = windowSize.width;
    _mapStyle.height = windowSize.height;
  } else {
    _mapStyle.width = window.innerWidth;
    _mapStyle.height = window.innerHeight;
  }

  let _showModalApplicationMenu;
  if (showModalApplicationMenu !== undefined) {
    _showModalApplicationMenu = showModalApplicationMenu;
  } else {
    _showModalApplicationMenu = () => {
      setAppMenuVisible(true);
    };
  }

  //responsive behaviour
  let widthRight = infoBox.props.pixelwidth;
  let width = _mapStyle.width;

  let widthLeft = searchControlWidth;
  let _infoStyle = {
    opacity: "0.9",
    width: infoBox.props.pixelwidth,
  };

  let _homeCenter, _homeZoom;

  if (homeCenter) {
    _homeCenter = homeCenter;
  } else if (home?.center) {
    _homeCenter = home.center;
  } else {
    _homeCenter = [51.25861849982617, 7.15101022370511];
  }

  if (homeZoom) {
    _homeZoom = homeZoom;
  } else if (home?.zoom) {
    _homeZoom = home.zoom;
  } else {
    _homeZoom = 8;
  }

  const _modalMenu = modalMenu || <DefaultAppMenu />;

  return (
    <div>
      {_modalMenu}
      {secondaryInfo !== undefined && secondaryInfo}
      <Loadable
        active={pendingLoader > 0 && !noInitialLoadingText}
        spinner
        text={initialLoadingText + " " + statusPostfix + "..."}
      >
        <div>
          {photoLightBox && <PhotoLightBox />}
          <TitleBox />
          <RoutedMap
            key={"leafletRoutedMap"}
            layerKeyPostfix={
              md5(additionalLayerConfiguration || "") +
              "." +
              JSON.stringify(activeAdditionalLayerKeys)
            }
            referenceSystem={referenceSystem || MappingConstants.crs25832}
            referenceSystemDefinition={
              referenceSystemDefinition || MappingConstants.proj4crs25832def
            }
            ref={leafletRoutedMapRef}
            baseLayerConf={baseLayerConf}
            minZoom={minZoom}
            maxZoom={maxZoom}
            layers=""
            style={_mapStyle}
            fallbackPosition={{
              lat: _homeCenter[0],
              lng: _homeCenter[1],
            }}
            ondblclick={ondblclick}
            onclick={onclick}
            locationChangedHandler={(location) => {
              setLocation(location);
              const q = modifyQueryPart(history.location.search, location);
              _pushToHistory(q);
              locationChangedHandler(location);
            }}
            autoFitConfiguration={{
              autoFitBounds: autoFitBounds,
              autoFitMode: autoFitMode,
              autoFitBoundsTarget: autoFitBoundsTarget,
            }}
            autoFitProcessedHandler={() => setAutoFit(false)}
            urlSearchParams={_urlSearchParams}
            boundingBoxChangedHandler={(bbox) => {
              setBoundingBox(bbox);
              mappingBoundsChanged(bbox);
              //localMappingBoundsChanged(bbox);
            }}
            backgroundlayers={_backgroundLayers}
            fallbackZoom={_homeZoom}
            fullScreenControlEnabled={fullScreenControl}
            locateControlEnabled={locatorControl}
            attributionControl={attributionControl}
          >
            {overlayFeature && (
              <ProjSingleGeoJson
                key={JSON.stringify(overlayFeature)}
                geoJson={overlayFeature}
                masked={true}
                maskingPolygon={maskingPolygon}
                mapRef={leafletRoutedMapRef}
              />
            )}
            <GazetteerHitDisplay
              key={"gazHit" + JSON.stringify(gazetteerHit)}
              gazetteerHit={gazetteerHit}
            />
            {featureCollectionDisplay}
            <GazetteerSearchControl
              mapRef={leafletRoutedMapRef}
              gazetteerHit={gazetteerHit}
              setGazetteerHit={setGazetteerHit}
              gazeteerHitTrigger={gazetteerHitTrigger}
              overlayFeature={overlayFeature}
              setOverlayFeature={setOverlayFeature}
              gazData={gazData}
              enabled={gazData.length > 0}
              pixelwidth={searchControlWidth}
              placeholder={gazetteerSearchPlaceholder}
            />

            {infoBox}

            <Control position="topright">
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip style={{ zIndex: 3000000000 }} id="helpTooltip">
                    {applicationMenuTooltipString}
                  </Tooltip>
                }
              >
                <Button
                  variant="light"
                  style={{
                    backgroundImage: "linear-gradient(to bottom,#fff 0,#e0e0e0 100%)",
                    borderColor: "#CCCCCC",
                  }}
                  id="cmdShowModalApplicationMenu"
                  onClick={() => {
                    _showModalApplicationMenu();
                  }}
                >
                  <Icon name={applicationMenuIconname} />
                </Button>
              </OverlayTrigger>
            </Control>
            <div
              key={
                _backgroundLayers +
                "." +
                _urlSearchParams.get("mapStyle") +
                "." +
                JSON.stringify(activeAdditionalLayerKeys || "")
              }
            >
              {activeAdditionalLayerKeys !== undefined &&
                activeAdditionalLayerKeys.length > 0 &&
                activeAdditionalLayerKeys.map((activekey, index) => {
                  const layerConf = additionalLayerConfiguration[activekey];
                  if (layerConf.layer) {
                    return layerConf.layer;
                  } else if (layerConf.layerkey) {
                    const layers = getLayers(layerConf.layerkey);
                    return layers;
                  }
                })}
            </div>
            {props.children}
          </RoutedMap>
        </div>
      </Loadable>
    </div>
  );
};
export default TopicMapComponent;
