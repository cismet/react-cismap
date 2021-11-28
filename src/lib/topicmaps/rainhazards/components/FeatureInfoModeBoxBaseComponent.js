import React from "react";
import Color from "color";
import Icon from "../../../commons/Icon";
import Well from "../../../commons/Well";
import FeatureInfoScalarBaseComponent from "./FeatureInfoScalarBaseComponent";
// import FeatureInfoLineChartBaseComponent from "./FeatureInfoLineChartBaseComponentChartkick";
import FeatureInfoLineChartBaseComponent from "./FeatureInfoLineChartBaseComponentRecharts";
/* eslint-disable jsx-a11y/anchor-is-valid */

const Comp = ({
  setFeatureInfoModeActivation,
  featureInfoValue,
  showModalMenu,
  legendObject,
  width = "205px",
  innerHeight = undefined,
  header = "Header nicht gesetzt",
  featureValueProcessor = (value) => value,
  featureSingleValueProcessor = (value) => value,
  chartValueProcessor = (value) => value,

  noValueText = "noValueText nicht gesetzt",
  footerLink,
  valueUI,
  ytitle,
  xtitle,
  activeTimeSeriesPoint,
  intermediateValuesCount,
  setActiveTimeSeriesPoint,
  valueMode,
  displayMode,
  currentFeatureInfoSelectedDisplayMode,
  currentFeatureInfoSelectedValueMode,
}) => {
  let _footerLink = footerLink;
  if (!_footerLink) {
    _footerLink = (
      <a style={{ color: "#337ab7" }} onClick={() => showModalMenu("aussagekraft")}>
        Information zur Aussagekraft
      </a>
    );
  }
  let _valueUI = valueUI;

  if (!featureInfoValue) {
    _valueUI = <p>{noValueText}</p>;
  }

  let headerColor = "#7e7e7e";
  let currentFeatureInfoValue;

  if (
    valueMode &&
    currentFeatureInfoSelectedDisplayMode &&
    displayMode &&
    currentFeatureInfoSelectedDisplayMode &&
    valueMode === currentFeatureInfoSelectedValueMode &&
    displayMode === currentFeatureInfoSelectedDisplayMode
  ) {
    let currentindex;
    if (Array.isArray(featureInfoValue)) {
      currentindex = Math.round(activeTimeSeriesPoint / intermediateValuesCount);
      currentFeatureInfoValue = featureInfoValue[currentindex]?.value;
    } else {
      currentFeatureInfoValue = featureInfoValue;
    }
    if (currentFeatureInfoValue) {
      for (const item of legendObject) {
        if (currentFeatureInfoValue > item.lt) {
          headerColor = item.bg;
        }
      }
    }
  }

  let textColor = "black";
  let backgroundColor = new Color(headerColor);
  if (backgroundColor.isDark()) {
    textColor = "white";
  }

  if (!_valueUI) {
    //check if featureInfoValue is a number or an array of numbers
    if (Array.isArray(featureInfoValue)) {
      _valueUI = (
        <FeatureInfoLineChartBaseComponent
          {...{
            featureInfoValue,
            currentFeatureInfoValue,
            featureValueProcessor,
            featureSingleValueProcessor,
            noValueText,
            xtitle,
            ytitle,
            activeTimeSeriesPoint,
            intermediateValuesCount,
            headerColor,
            textColor,
            setActiveTimeSeriesPoint,
            chartValueProcessor,
          }}
        />
      );
    } else {
      _valueUI = (
        <FeatureInfoScalarBaseComponent
          {...{ featureInfoValue, featureValueProcessor, noValueText, headerColor, textColor }}
        />
      );
    }
  }
  console.log("");

  if (featureInfoValue <= 0) {
    featureInfoValue = 0;
  }
  return (
    <div
      //onClick={(e) => e.stopPropagation()}
      key="featureInfoModeBox"
      id="featureInfoModeBox"
      style={{
        pointerEvents: "auto",
        marginBottom: 5,
        float: "right",
        width: width,
      }}
    >
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td
              style={{
                opacity: "0.9",
                paddingLeft: "2px",
                paddingRight: "15px",
                paddingTop: "0px",
                paddingBottom: "0px",
                background: headerColor,
                color: textColor,

                textAlign: "left",
              }}
            >
              {header}
            </td>
            <td
              style={{
                opacity: "0.9",
                paddingLeft: "0px",
                paddingTop: "0px",
                paddingRight: "2px",
                paddingBottom: "0px",
                background: headerColor,
                color: textColor,

                textAlign: "right",
              }}
            >
              <a
                onClick={() => {
                  setFeatureInfoModeActivation(false);
                }}
                style={{ color: textColor }}
              >
                <Icon name="close" />{" "}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <Well
        bsSize="small"
        style={{
          opacity: "0.9",
          paddingBottom: "0px",
          height: innerHeight,
        }}
      >
        <table style={{ width: "100%", paddingBottom: "0px" }}>
          <tbody>
            <tr>
              <td
                style={{
                  opacity: "0.9",
                  paddingLeft: "0px",
                  paddingTop: "0px",
                  paddingBottom: "0px",
                }}
              >
                {_valueUI}
              </td>
            </tr>
            {featureInfoValue !== undefined && (
              <tr>
                <td
                  style={{
                    opacity: "0.9",
                    paddingLeft: "0px",
                    paddingTop: "0px",
                    paddingBottom: "2px",
                    textAlign: "center",
                  }}
                >
                  {_footerLink}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Well>
    </div>
  );
};

export default Comp;
