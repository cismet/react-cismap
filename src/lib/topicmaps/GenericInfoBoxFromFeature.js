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
};

const Component = (props) => {
  let {
    config,
    pixelwidth = 300,
    setSecondaryInfoVisible,
    secondaryInfoBoxElements,
    defaultContextValues = {},
  } = props;
  const featureCollectionContext = useContext(FeatureCollectionContext) || defaultContextValues;
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
    header = <span>{currentFeature?.properties?.info?.header || config.header}</span>;
    title = currentFeature?.properties?.info?.title;
    subtitle = currentFeature?.properties?.info?.subtitle;
    additionalInfo = currentFeature?.properties?.info?.additionalInfo;
  }
  const headerColor = getColorForProperties((currentFeature || {}).properties);

  const minified = undefined;
  const minify = undefined;

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
      subtitle={subtitle}
      additionalInfo={additionalInfo}
      zoomToAllLabel={`${filteredItems.length} ${
        filteredItems.length === 1 ? config.navigator.noun.singular : config.navigator.noun.plural
      } in ${config.city}`}
      currentlyShownCountLabel={`${featureCollection.length} ${
        featureCollection.length === 1
          ? config.navigator.noun.singular
          : config.navigator.noun.plural
      } angezeigt`}
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
              {filteredItems.length}{" "}
              {filteredItems.length === 1
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
            currentFeature={currentFeature}
          />,
        ]
      }
    />
  );
};

export default Component;
