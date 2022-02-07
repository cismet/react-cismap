import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import { removeQueryPart, modifyQueryPart } from "../../tools/routingHelper";
import { TopicMapContext } from "../../contexts/TopicMapContextProvider";
import {
  TopicMapStylingContext,
  TopicMapStylingDispatchContext,
} from "../../contexts/TopicMapStylingContextProvider";

// Since this component is simple and static, there's no parent container for it.
const NamedMapStyleChooser = ({
  title = "Hintergrundkarte:",
  currentNamedMapStyle,
  pathname,
  search,
  pushNewRoute,
  setLayerByKey,
  activeLayerKey,
  modes,
  vertical = false,
  children,
  defaultContextValues = {},
}) => {
  const { history } = useContext(TopicMapContext) || defaultContextValues;
  const {
    backgroundModes,
    selectedBackground,
    additionalLayerConfiguration,
    activeAdditionalLayerKeys,
  } = useContext(TopicMapStylingContext) || defaultContextValues;
  const { setSelectedBackground, setNamedMapStyle, setActiveAdditionalLayerKeys } =
    useContext(TopicMapStylingDispatchContext) || defaultContextValues;
  let beforelayerradios = false;
  //keep false when its undefined
  if (
    children !== undefined &&
    children.props !== undefined &&
    children.props.beforelayerradios === true
  ) {
    beforelayerradios = true;
  }
  const _pushNewRoute =
    pushNewRoute ||
    ((url) => {
      history.push(url);
    });
  let location = history?.location?.pathname;

  if (location === "undefined") {
    location = "/";
  }

  const _pathname = pathname || location;
  const _search = search || history?.location?.search;
  const _activeLayerKey = activeLayerKey || selectedBackground;
  const _setLayerByKey = setLayerByKey || setSelectedBackground;

  const _modes = modes || backgroundModes;
  return (
    <Form.Group>
      <Form.Label>{title}</Form.Label>
      <br />
      {additionalLayerConfiguration !== undefined && (
        <div style={{ marginBottom: 10 }}>
          {Object.keys(additionalLayerConfiguration).map((layerConfKey, index) => {
            const layerConf = additionalLayerConfiguration[layerConfKey];

            return (
              <Form.Group
                key={"div.layerConf.chkGrp." + index}
                controlId={"div.layerConf.chkGrp." + index}
              >
                <Form.Check
                  type="checkbox"
                  readOnly={true}
                  key={"div.layerConf.chk." + index}
                  onClick={(e) => {
                    let newActiveAdditionalLayerKeys;
                    if (e.target.checked === false) {
                      //remove key from array
                      newActiveAdditionalLayerKeys = activeAdditionalLayerKeys.filter(
                        (key) => key !== layerConfKey
                      );
                    } else {
                      //add key to array
                      newActiveAdditionalLayerKeys = [...activeAdditionalLayerKeys];
                      newActiveAdditionalLayerKeys.push(layerConfKey);
                    }
                    setActiveAdditionalLayerKeys(newActiveAdditionalLayerKeys);
                  }}
                  checked={activeAdditionalLayerKeys?.includes(layerConfKey)}
                  inline
                  label={
                    <span>
                      {layerConf.title}
                      {layerConf.additionalControls ? layerConf.additionalControls : null}
                    </span>
                  }
                ></Form.Check>
              </Form.Group>
            );
          })}
        </div>
      )}
      {children !== undefined && beforelayerradios === true && children}
      {_modes.map((item, key) => {
        return (
          <span key={"radiobutton.nr." + key}>
            <Form.Check
              type="radio"
              id={"cboMapStyleChooser_" + key}
              key={key}
              readOnly={true}
              onClick={(e) => {
                if (e.target.checked === true) {
                  if (item.layerKey) {
                    _setLayerByKey(item.layerKey);
                  }
                  if (item.mode === "default") {
                    _pushNewRoute(_pathname + removeQueryPart(_search, "mapStyle"));
                    setNamedMapStyle("default");
                  } else {
                    _pushNewRoute(
                      _pathname +
                        modifyQueryPart(_search, {
                          mapStyle: item.mode,
                        })
                    );
                    setNamedMapStyle(item.mode);
                  }
                }
              }}
              checked={
                currentNamedMapStyle === item.mode && _activeLayerKey === (item.layerKey || "none")
              }
              name="mapBackground"
              inline
              label={item.title + " "}
            />
            {item.additionalControls}
            {vertical !== false && <br />}
          </span>
        );
      })}
      {children !== undefined && beforelayerradios === false && children}
    </Form.Group>
  );
};

export default NamedMapStyleChooser;
