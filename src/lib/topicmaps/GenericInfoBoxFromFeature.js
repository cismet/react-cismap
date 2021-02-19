import React, { useContext, useEffect } from "react";
import InfoBox from "./InfoBox";
import { getActionLinksForFeature } from "../tools/uiHelper";
import Icon from "../commons/Icon";
import { FeatureCollectionContext } from "../contexts/FeatureCollectionContextProvider";
import { TopicMapDispatchContext } from "../contexts/TopicMapContextProvider";
import { ResponsiveTopicMapDispatchContext } from "../contexts/ResponsiveTopicMapContextProvider";
import { UIDispatchContext } from "../contexts/UIContextProvider";
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
  let { config, pixelwidth = 300, setSecondaryInfoVisible } = props;
  const featureCollectionContext = useContext(FeatureCollectionContext);
  const { zoomToFeature, gotoHome } = useContext(TopicMapDispatchContext);
  const { setInfoBoxPixelWidth } = useContext(ResponsiveTopicMapDispatchContext);
  const {
    shownFeatures = [],
    selectedFeature,
    allFeatures = 0,
    items = [],
  } = featureCollectionContext;
  const { setSecondaryInfoVisible: setSecondaryInfoVisibleFromContext } = useContext(
    UIDispatchContext
  );

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

  //TODO

  return (
    <InfoBox
      isCollapsible={currentFeature !== undefined}
      items={items} //?
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
      zoomToAllLabel={`${items.length} ${
        items.length === 1 ? config.navigator.noun.singular : config.navigator.noun.plural
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
            <a className="pleaseRenderLikeALinkEvenWithoutAnHrefAttribute" onClick={gotoHome}>
              {items.length}{" "}
              {items.length === 1 ? config.navigator.noun.singular : config.navigator.noun.plural}{" "}
              in {config.city}
            </a>
          </div>
        </div>
      }
      hideNavigator={allFeatures?.length === 1}
      fitAll={gotoHome}
    />
  );
};

export default Component;
