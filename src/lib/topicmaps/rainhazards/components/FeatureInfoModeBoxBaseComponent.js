import React from "react";
import Color from "color";
import Icon from "../../../commons/Icon";
import Well from "../../../commons/Well";
import FeatureInfoScalarBaseComponent from "./FeatureInfoScalarBaseComponent";
import { getRoundedValueStringForValue } from "../helper";
import FeatureInfoLineChartBaseComponent from "./FeatureInfoLineChartBaseComponent";
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
  noValueText = "noValueText nicht gestezt",
  footerLink,
  valueUI,
  ytitle,
  xtitle,
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

  if (!_valueUI) {
    //check if featureInfoValue is a number or an array of numbers

    if (Array.isArray(featureInfoValue)) {
      _valueUI = (
        <FeatureInfoLineChartBaseComponent
          {...{ featureInfoValue, featureValueProcessor, noValueText, xtitle, ytitle }}
        />
      );
    } else {
      _valueUI = (
        <FeatureInfoScalarBaseComponent
          {...{ featureInfoValue, featureValueProcessor, noValueText }}
        />
      );
    }
  }
  let headerColor = "#7e7e7e";
  if (featureInfoValue) {
    for (const item of legendObject) {
      if (featureInfoValue > item.lt) {
        headerColor = item.bg;
      }
    }
  }
  let textColor = "black";
  let backgroundColor = new Color(headerColor);
  if (backgroundColor.isDark()) {
    textColor = "white";
  }
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
