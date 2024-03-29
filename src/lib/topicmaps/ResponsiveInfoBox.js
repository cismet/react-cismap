import React, { useContext, useState } from "react";
import CollapsibleWell from "../commons/CollapsibleWell";
import CollapsibleABWell from "../commons/CollapsibleABWell";
import { ResponsiveTopicMapContext } from "../contexts/ResponsiveTopicMapContextProvider";
import Control from "react-leaflet-control";
import { FeatureCollectionContext } from "../contexts/FeatureCollectionContextProvider";
import { UIContext, UIDispatchContext } from "../contexts/UIContextProvider";

/* eslint-disable jsx-a11y/anchor-is-valid */

export const MODES = { DEFAULT: "DEFAULT", AB: "AB" };

// Since this component is simple and static, there's no parent container for it.
const InfoBox = ({
  panelClick,
  pixelwidth,
  header,
  collapsedInfoBox,
  setCollapsedInfoBox,
  isCollapsible = true,
  handleResponsiveDesign = true,
  infoStyle = {},
  secondaryInfoBoxElements = [],
  alwaysVisibleDiv,
  collapsibleDiv,
  collapsibleStyle,
  fixedRow,
  defaultContextValues = {},
  divWhenCollapsed,
  divWhenLarge,
  mode = MODES.DEFAULT,
}) => {
  const featureCollectionContext = useContext(FeatureCollectionContext) || defaultContextValues;
  const { responsiveState, searchBoxPixelWidth, gap, windowSize } =
    useContext(ResponsiveTopicMapContext) || defaultContextValues;
  const { collapsedInfoBox: collapsedInfoBoxFromContext } =
    useContext(UIContext) || defaultContextValues;
  const { setCollapsedInfoBox: setCollapsedInfoBoxFromContext } =
    useContext(UIDispatchContext) || defaultContextValues;

  let infoBoxBottomMargin;
  if (handleResponsiveDesign === true) {
    if (responsiveState === "small") {
      infoBoxBottomMargin = 5;
    } else {
      infoBoxBottomMargin = 0;
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

  let collapseButtonAreaStyle;
  if (fixedRow === false) {
    collapseButtonAreaStyle = {
      opacity: "0.9",
      width: 25,
    };
  } else {
    collapseButtonAreaStyle = {
      background: "#cccccc",
      opacity: "0.9",
      width: 25,
    };
  }

  return (
    <div>
      <Control
        key={"InfoBoxElements." + responsiveState}
        id={"InfoBoxElements." + responsiveState}
        position={responsiveState === "normal" ? "bottomright" : "bottomright"}
      >
        <div style={{ ...infoBoxStyle, marginBottom: infoBoxBottomMargin }}>
          {header}
          {mode === MODES.DEFAULT && (
            <CollapsibleWell
              collapsed={minified}
              setCollapsed={minify}
              style={{
                pointerEvents: "auto",
                padding: 0,
                paddingLeft: 9,
                ...collapsibleStyle,
              }}
              debugBorder={0}
              tableStyle={{ margin: 0 }}
              fixedRow={fixedRow}
              alwaysVisibleDiv={alwaysVisibleDiv}
              collapsibleDiv={collapsibleDiv}
              collapseButtonAreaStyle={collapseButtonAreaStyle}
              onClick={panelClick}
              pixelwidth={pixelwidth}
              isCollapsible={isCollapsible}
            />
          )}
          {mode === MODES.AB && (
            <CollapsibleABWell
              collapsed={minified}
              setCollapsed={minify}
              style={{
                pointerEvents: "auto",
                padding: 0,
                paddingLeft: 9,
                ...collapsibleStyle,
              }}
              debugBorder={0}
              tableStyle={{ margin: 0 }}
              fixedRow={fixedRow}
              divWhenCollapsed={divWhenCollapsed}
              divWhenLarge={divWhenLarge}
              collapseButtonAreaStyle={collapseButtonAreaStyle}
              onClick={panelClick}
              pixelwidth={pixelwidth}
              isCollapsible={isCollapsible}
            />
          )}
        </div>
      </Control>
      {secondaryInfoBoxElements.map((element, index) => (
        <Control
          key={"secondaryInfoBoxElements." + index + "." + responsiveState}
          position={responsiveState === "normal" ? "bottomright" : "bottomright"}
        >
          <div style={{ opacity: 0.9 }}>{element}</div>
        </Control>
      ))}
    </div>
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
