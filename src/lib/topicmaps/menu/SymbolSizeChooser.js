import objectAssign from "object-assign";
import PropTypes from "prop-types";
import React from "react";
import { Form } from "react-bootstrap";

import { getSymbolSVGGetter } from "../../tools/uiHelper";

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const SymbolSizeChooser = ({
  title,
  changeMarkerSymbolSize,
  currentMarkerSize,
  getSymbolSVG,
  symbolColor,
  additionalConfig,
  sizeMulitplier,
}) => {
  const defaultConfig = {
    smallSize: 25,
    midSize: 35,
    largeSize: 45,
  };

  const config = objectAssign({}, defaultConfig, additionalConfig);

  let _getSymbolSVG = getSymbolSVG || getSymbolSVGGetter();

  return (
    <Form.Group>
      <Form.Label>{title}</Form.Label>
      <br />

      <table border={0}>
        <tbody>
          <tr>
            <td
              style={{
                width: "50px",
                textAlign: "center",
              }}
            >
              <a onClick={() => changeMarkerSymbolSize(config.smallSize)}>
                {_getSymbolSVG(config.smallSize * sizeMulitplier, symbolColor)}
              </a>
            </td>
            <td
              style={{
                width: "50px",
                textAlign: "center",
              }}
            >
              <a onClick={() => changeMarkerSymbolSize(config.midSize)}>
                {_getSymbolSVG(config.midSize * sizeMulitplier, symbolColor)}
              </a>
            </td>
            <td
              style={{
                width: "50px",
                textAlign: "center",
              }}
            >
              <a onClick={() => changeMarkerSymbolSize(config.largeSize)}>
                {_getSymbolSVG(config.largeSize * sizeMulitplier, symbolColor)}
              </a>
            </td>
          </tr>
          <tr border={0} style={{ verticalAlign: "top" }}>
            <td style={{ textAlign: "center" }}>
              <Form.Check
                type="radio"
                id="symbolSizeSmall"
                style={{ marginTop: "0px", marginLeft: "0px" }}
                readOnly={true}
                onClick={() => changeMarkerSymbolSize(config.smallSize)}
                name="symbolSizeSmall"
                checked={currentMarkerSize <= config.smallSize}
              />
            </td>
            <td style={{ textAlign: "center" }}>
              <Form.Check
                type="radio"
                id="symbolSizeMid"
                style={{ marginTop: "0px", marginLeft: "0px" }}
                readOnly={true}
                onClick={() => changeMarkerSymbolSize(config.midSize)}
                name="symbolSizeMid"
                checked={
                  currentMarkerSize > config.smallSize && currentMarkerSize < config.largeSize
                }
              />
            </td>
            <td style={{ textAlign: "center" }}>
              <Form.Check
                type="radio"
                id="symbolSizeLarge"
                style={{ marginTop: "0px", marginLeft: "0px" }}
                readOnly={true}
                onClick={() => changeMarkerSymbolSize(config.largeSize)}
                name="symbolSizeLarge"
                checked={currentMarkerSize >= config.largeSize}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </Form.Group>
  );
};

export default SymbolSizeChooser;
SymbolSizeChooser.propTypes = {
  title: PropTypes.string,
  changeMarkerSymbolSize: PropTypes.func.isRequired,
  currentMarkerSize: PropTypes.number.isRequired,
  getSymbolSVG: PropTypes.func,
  config: PropTypes.object,
  sizeMulitplier: PropTypes.number,
};

SymbolSizeChooser.defaultProps = {
  title: "Symbolgröße:",
  config: {},
  symbolColor: "#00A0B0",
  sizeMulitplier: 0.9,
};
