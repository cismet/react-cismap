import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Color from "color";
import CollapsibleWell from "../commons/CollapsibleWell";
import { ResponsiveTopicMapContext } from "../contexts/ResponsiveTopicMapContextProvider";
import Control from "react-leaflet-control";
import {
  FeatureCollectionContext,
  FeatureCollectionDispatchContext,
} from "../contexts/FeatureCollectionContextProvider";
import { UIContext, UIDispatchContext } from "../contexts/UIContextProvider";
import ResponsiveInfoBox from "./ResponsiveInfoBox";
import parseHtml from "html-react-parser";
import { TopicMapStylingContext } from "../contexts/TopicMapStylingContextProvider";

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const InfoBox = ({
  currentFeature,
  featureCollection,
  selectedIndex,
  next,
  previous,
  fitAll,
  panelClick,
  pixelwidth,
  header,
  headerColor,
  links,
  title,
  subtitle,
  additionalInfo,
  zoomToAllLabel,
  currentlyShownCountLabel,
  collapsedInfoBox,
  setCollapsedInfoBox,
  noCurrentFeatureTitle,
  noCurrentFeatureContent,
  isCollapsible = true,
  hideNavigator = false,
  handleResponsiveDesign = true,
  infoStyle = {},
  fixedRow = true,
  secondaryInfoBoxElements = [],

  colorizer = (props) => ((props || {}).properties || {}).color, //
  defaultContextValues = {},
}) => {
  const featureCollectionContext = useContext(FeatureCollectionContext) || defaultContextValues;
  const { fitBoundsForCollection } =
    useContext(FeatureCollectionDispatchContext) || defaultContextValues;
  const { shownFeatures = [], selectedFeature, items = [] } =
    featureCollectionContext || defaultContextValues;
  const featureCollectionDispatchContext =
    useContext(FeatureCollectionDispatchContext) || defaultContextValues;
  const { responsiveState, searchBoxPixelWidth, gap, windowSize } =
    useContext(ResponsiveTopicMapContext) || defaultContextValues;
  const { collapsedInfoBox: collapsedInfoBoxFromContext } =
    useContext(UIContext) || defaultContextValues;
  const { setCollapsedInfoBox: setCollapsedInfoBoxFromContext } =
    useContext(UIDispatchContext) || defaultContextValues;
  const { additionalStylingInfo } = useContext(TopicMapStylingContext);

  const gotoPrevious = featureCollectionDispatchContext.prev;
  const gotoNext = featureCollectionDispatchContext.next;
  // Use this line to enable the collabsible modus even when no object is visible
  // isCollapsible = true;
  let _fitAll;
  if (fitAll === undefined) {
    _fitAll = fitBoundsForCollection;
  } else {
    _fitAll = fitAll;
  }
  let _next, _previous, infoBoxBottomMargin;
  if (handleResponsiveDesign === true) {
    if (responsiveState === "small") {
      infoBoxBottomMargin = 5;
    } else {
      infoBoxBottomMargin = 0;
    }
  }
  let _currentFeature = currentFeature;
  if (!_currentFeature) {
    if (featureCollectionContext != undefined) {
      _currentFeature = selectedFeature;
      if (next === undefined) {
        _next = () => {
          gotoNext();
        };
      } else {
        _next = next;
      }
      if (previous === undefined) {
        _previous = () => {
          gotoPrevious();
        };
      } else {
        _previous = previous;
      }
    } else {
      _currentFeature = featureCollection[selectedIndex];
    }
  }
  let infoBoxStyle = {
    opacity: "0.9",
    width: responsiveState === "normal" ? pixelwidth : windowSize.width - gap,
    ...infoStyle,
  };

  const [localMinified, setLocalMinify] = useState(false);
  const minified = collapsedInfoBox || collapsedInfoBoxFromContext || localMinified;
  const minify = setCollapsedInfoBox || setCollapsedInfoBoxFromContext || setLocalMinify;
  let featureRenderingOption = additionalStylingInfo?.featureRenderingOption;
  let headerBackgroundColor = Color(headerColor || colorizer(_currentFeature, featureRenderingOption));

  let textColor = "black";
  if (headerBackgroundColor.isDark()) {
    textColor = "white";
  }
  let llVis = (
    <table style={{ width: "100%" }}>
      <tbody>
        <tr>
          <td
            style={{
              textAlign: "left",
              verticalAlign: "top",
              background: headerBackgroundColor,
              color: textColor,
              opacity: "0.9",
              paddingLeft: "3px",
              paddingTop: "0px",
              paddingBottom: "0px",
            }}
          >
            {header}
          </td>
        </tr>
      </tbody>
    </table>
  );

  let alwaysVisibleDiv, collapsibleDiv;

  if (_currentFeature) {
    alwaysVisibleDiv = (
      <table border={0} style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td
              style={{
                textAlign: "left",
                padding: "5px",
                maxWidth: "160px",
                overflowWrap: "break-word",
              }}
            >
              <h5>
                <b>{title}</b>
              </h5>
            </td>
            <td style={{ textAlign: "right", paddingRight: 7 }}>{[links]}</td>
          </tr>
        </tbody>
      </table>
    );
    collapsibleDiv = (
      <div style={{ marginRight: 9 }}>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ textAlign: "left", verticalAlign: "top" }}>
                <table style={{ width: "100%" }}>
                  <tbody>
                    <tr>
                      <td style={{ textAlign: "left" }}>
                        <h6>
                          {additionalInfo &&
                            additionalInfo.startsWith &&
                            additionalInfo.startsWith("<html>") && (
                              <div>{parseHtml(additionalInfo.match(/<html>(.*?)<\/html>/)[1])}</div>
                            )}
                          {additionalInfo &&
                            (!additionalInfo.startsWith || !additionalInfo.startsWith("<html>")) &&
                            additionalInfo.split("\n").map((item, key) => {
                              return (
                                <span key={key}>
                                  {item}
                                  <br />
                                </span>
                              );
                            })}
                        </h6>
                        {subtitle && subtitle.startsWith && subtitle.startsWith("<html>") && (
                          <div> {parseHtml(subtitle.match(/<html>(.*?)<\/html>/)[1])}</div>
                        )}
                        {subtitle && (!subtitle.startsWith || !subtitle.startsWith("<html>")) && (
                          <p>{subtitle}</p>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        {hideNavigator === false && (
          <div>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td />
                  <td style={{ textAlign: "center", verticalAlign: "center" }}>
                    <a
                      className="renderAsProperLink"
                      onClick={() => {
                        _fitAll();
                      }}
                    >
                      {zoomToAllLabel}
                    </a>
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
            <table style={{ width: "100%", marginBottom: 9 }}>
              <tbody>
                <tr>
                  <td
                    title="vorheriger Treffer"
                    style={{ textAlign: "left", verticalAlign: "center" }}
                  >
                    <a className="renderAsProperLink" onClick={_previous}>
                      &lt;&lt;
                    </a>
                  </td>
                  <td style={{ textAlign: "center", verticalAlign: "center" }}>
                    {currentlyShownCountLabel}
                  </td>

                  <td
                    title="nächster Treffer"
                    style={{ textAlign: "right", verticalAlign: "center" }}
                  >
                    <a className="renderAsProperLink" onClick={_next}>
                      &gt;&gt;
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  } else {
    alwaysVisibleDiv = noCurrentFeatureTitle;
    collapsibleDiv = <div style={{ paddingRight: 2 }}>{noCurrentFeatureContent}</div>;
  }

  return (
    <ResponsiveInfoBox
      panelClick={panelClick}
      pixelwidth={pixelwidth}
      header={llVis}
      collapsedInfoBox={collapsedInfoBox}
      setCollapsedInfoBox={setCollapsedInfoBox}
      isCollapsible={isCollapsible}
      handleResponsiveDesign={handleResponsiveDesign}
      infoStyle={infoStyle}
      secondaryInfoBoxElements={secondaryInfoBoxElements}
      alwaysVisibleDiv={alwaysVisibleDiv}
      collapsibleDiv={collapsibleDiv}
      fixedRow={fixedRow}
    />
  );
};

export default InfoBox;
// InfoBox.propTypes = {
// 	featureCollection: PropTypes.array.isRequired,
// 	filteredPOIs: PropTypes.array.isRequired,
// 	selectedIndex: PropTypes.number.isRequired,
// 	next: PropTypes.func.isRequired,
// 	previous: PropTypes.func.isRequired,
// 	fitAll: PropTypes.func.isRequired,
// 	showModalMenu: PropTypes.func.isRequired,
// 	panelClick: PropTypes.func.isRequired
// };

// InfoBox.defaultProps = {
// 	featureCollection: [],
// 	filteredPOIs: [],
// 	selectedIndex: 0,
// 	fitAll: () => {},
// 	showModalMenu: () => {}
// };
