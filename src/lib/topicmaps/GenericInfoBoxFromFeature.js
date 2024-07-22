import React, { useContext, useEffect } from "react";
import InfoBox from "./InfoBox";
import { getActionLinksForFeature } from "../tools/uiHelper";
import Icon from "../commons/Icon";
import {
  FeatureCollectionContext,
  FeatureCollectionDispatchContext,
} from "../contexts/FeatureCollectionContextProvider";
import { TopicMapDispatchContext } from "../contexts/TopicMapContextProvider";
import { ResponsiveTopicMapDispatchContext } from "../contexts/ResponsiveTopicMapContextProvider";
import { LightBoxContext, LightBoxDispatchContext } from "../contexts/LightBoxContextProvider";

import { UIDispatchContext } from "../contexts/UIContextProvider";
import InfoBoxFotoPreview from "./InfoBoxFotoPreview";
export const getColorForProperties = (props = { color: "#dddddd" }) => {
  return props.color;
};

const defaultConfig = {
  city: "gesamtem Bereich verfügbar",
  header: "Information zum Objekt",
  navigator: {
    noun: {
      singular: "Objekt",
      plural: "Objekte",
    },
  },
  noCurrentFeatureTitle: "Keine Objekte gefunden",
  noCurrentFeatureContent: "",
  displaySecondaryInfoAction: false,
  getTotalNumberOfItems: (items) => items.length,
  getNumberOfShownFeatures: (featureCollection) => featureCollection.length,
};

const Component = (props) => {
  let {
    config,
    pixelwidth = 300,
    setSecondaryInfoVisible,
    secondaryInfoBoxElements,
    defaultContextValues = {},
    getPhotoUrl,
    getPhotoSeriesUrl,
    getPhotoSeriesArray,
    photoUrlManipulation,
    captionFactory,
    photoPreviewWidth,
    openLightBox,
    overrideFeatureCollectionContext,
  } = props;
  let featureCollectionContext = useContext(FeatureCollectionContext) || defaultContextValues;
  if (overrideFeatureCollectionContext !== undefined) {
    featureCollectionContext = overrideFeatureCollectionContext;
  }
  const { zoomToFeature, gotoHome } = useContext(TopicMapDispatchContext) || defaultContextValues;
  const lightBoxDispatchContext = useContext(LightBoxDispatchContext) || defaultContextValues;
  const { setInfoBoxPixelWidth } =
    useContext(ResponsiveTopicMapDispatchContext) || defaultContextValues;
  const {
    shownFeatures = [],
    selectedFeature,
    allFeatures = 0,
    filteredItems = [],
  } = featureCollectionContext;
  const { fitBoundsForCollection } =
    useContext(FeatureCollectionDispatchContext) || defaultContextValues;
  const { setSecondaryInfoVisible: setSecondaryInfoVisibleFromContext } =
    useContext(UIDispatchContext) || defaultContextValues;

  const _setSecondaryInfoVisible = setSecondaryInfoVisible || setSecondaryInfoVisibleFromContext;
  config = { ...defaultConfig, ...config };

  let currentFeature, featureCollection;

  if (featureCollectionContext !== undefined) {
    currentFeature = selectedFeature;
    featureCollection = shownFeatures || [];
  }
  let links = [];
  useEffect(() => {
    setInfoBoxPixelWidth(pixelwidth);
  }, [pixelwidth]);

  let header, title, subtitle, additionalInfo;

  const funcOrContent = (property, feature = currentFeature) => {
    if (property !== undefined) {
      if (typeof property === "function") {
        return property(feature);
      } else {
        return property;
      }
    }
  };

  if (currentFeature !== undefined) {
    links = getActionLinksForFeature(currentFeature, {
      entityClassName: config.navigator.noun.singular,
      displayZoomToFeature: true,
      zoomToFeature,
      displaySecondaryInfoAction:
        config.displaySecondaryInfoAction === true ||
        config.displaySecondaryInfoAction === undefined,
      setVisibleStateOfSecondaryInfo: (vis) => _setSecondaryInfoVisible(vis),
    });
    header = (
      <span>{funcOrContent(currentFeature?.properties?.info?.header) || config.header}</span>
    );
    title = funcOrContent(currentFeature?.properties?.info?.title);
    subtitle = funcOrContent(currentFeature?.properties?.info?.subtitle);
    additionalInfo = funcOrContent(currentFeature?.properties?.info?.additionalInfo);
  }
  const headerColor = getColorForProperties((currentFeature || {}).properties);

  const minified = undefined;
  const minify = undefined;
  const { getNumberOfShownFeatures, getTotalNumberOfItems } = config;
  return (
    <InfoBox
      isCollapsible={currentFeature !== undefined}
      items={filteredItems} //?
      // selectedIndex={selectedIndex} //?
      showModalMenu={() => {}}
      colorize={getColorForProperties}
      pixelwidth={pixelwidth}
      header={header}
      // headerColor={headerColor}
      links={links}
      title={title}
      next={config.next}
      previous={config.previous}
      subtitle={subtitle}
      additionalInfo={additionalInfo}
      zoomToAllLabel={
        config.zoomToAllLabel ||
        `${getTotalNumberOfItems(filteredItems)} ${
          getTotalNumberOfItems(filteredItems) === 1
            ? config.navigator.noun.singular
            : config.navigator.noun.plural
        } in ${config.city}`
      }
      fitAll={config.fitAll}
      currentlyShownCountLabel={
        config.currentlyShownCountLabel ||
        `${getNumberOfShownFeatures(featureCollection)} ${
          getNumberOfShownFeatures(featureCollection) === 1
            ? config.navigator.noun.singular
            : config.navigator.noun.plural
        } angezeigt`
      }
      collapsedInfoBox={minified}
      setCollapsedInfoBox={minify}
      noCurrentFeatureTitle={<h5>{config.noFeatureTitle}</h5>}
      noCurrentFeatureContent={
        <div style={{ marginRight: 9 }}>
          {(config.noCurrentFeatureContent === undefined ||
            config.noCurrentFeatureContent === "") && (
            <p>
              Für mehr {config.navigator.noun.plural} Ansicht mit <Icon name="minus-square" />{" "}
              verkleinern oder mit dem untenstehenden Link alle {config.navigator.noun.plural}{" "}
              anzeigen.
            </p>
          )}
          {config.noCurrentFeatureContent !== undefined &&
            config.noCurrentFeatureContent !== "" && <p>{config.noCurrentFeatureContent}</p>}

          <div align="center">
            <a
              className="pleaseRenderLikeALinkEvenWithoutAnHrefAttribute"
              onClick={() => {
                fitBoundsForCollection();
              }}
            >
              {getTotalNumberOfItems(filteredItems)}{" "}
              {getTotalNumberOfItems(filteredItems) === 1
                ? config.navigator.noun.singular
                : config.navigator.noun.plural}{" "}
              in {config.city}
            </a>
          </div>
        </div>
      }
      hideNavigator={allFeatures?.length === 1}
      fixedRow={true}
      secondaryInfoBoxElements={
        secondaryInfoBoxElements || [
          <InfoBoxFotoPreview
            lightBoxDispatchContext={lightBoxDispatchContext}
            getPhotoUrl={getPhotoUrl}
            getPhotoSeriesUrl={getPhotoSeriesUrl}
            getPhotoSeriesArray={getPhotoSeriesArray}
            urlManipulation={photoUrlManipulation}
            captionFactory={captionFactory}
            width={photoPreviewWidth}
            openLightBox={openLightBox}
            currentFeature={currentFeature}
          />,
        ]
      }
    />
  );
};

export default Component;
