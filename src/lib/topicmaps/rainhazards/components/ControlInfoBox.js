import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import Label from "react-bootstrap/Badge";
import Icon from "../../../commons/Icon";
import { TopicMapContext } from "../../../contexts/TopicMapContextProvider";
import { UIContext, UIDispatchContext } from "../../../contexts/UIContextProvider";
import ResponsiveInfoBox from "../../../topicmaps/ResponsiveInfoBox";

import { setSimulationStateInUrl } from "../helper";
import Legend from "./Legend";

/* eslint-disable jsx-a11y/anchor-is-valid */

// Since this component is simple and static, there's no parent container for it.
const ControlInfoBox = ({
  pixelwidth,
  selectedSimulation,
  legendObject,
  featureInfoModeActivated = false,
  featureInfoModeBlocked = false,
  setFeatureInfoModeActivation,
  featureInfoValue,
  setSelectedSimulation,
  simulations,
  animationEnabled,
  setAnimationEnabled,
  backgrounds,
  selectedBackgroundIndex,
  setBackgroundIndex,
  secondaryInfoBoxElements,
}) => {
  const simObject = simulations[selectedSimulation];

  const legend = <Legend legendObjects={legendObject} />;

  //contextStuff
  const { setAppMenuVisible, setAppMenuActiveMenuSection } = useContext(UIDispatchContext);
  const { history } = useContext(TopicMapContext);

  const showModalMenu = (section) => {
    setAppMenuVisible(true);
    setAppMenuActiveMenuSection(section);
  };

  let mapCursor;
  if (featureInfoModeActivated) {
    mapCursor = "crosshair";
  } else {
    mapCursor = "grabbing";
  }

  const legendTable = (
    <table onClick={(e) => e.stopPropagation()} key="legendTable" style={{ width: "100%" }}>
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
            {legend}
          </td>
        </tr>
      </tbody>
    </table>
  );

  let simulationLabels = [];
  simulations.forEach((item, index) => {
    let bsStyle;
    if (selectedSimulation === index) {
      bsStyle = "primary";
    } else {
      bsStyle = "secondary";
    }
    let label = (
      <a
        style={{ textDecoration: "none" }}
        onClick={() => {
          setSimulationStateInUrl(index, history);
          setSelectedSimulation(index);
        }}
      >
        <Label style={{ padding: 4 }} variant={bsStyle}>
          {item.name}
        </Label>
      </a>
    );
    simulationLabels.push(label);
  });

  let alwaysVisibleDiv = (
    <h4 style={{ margin: 0 }}>
      <Icon name={simObject.icon} /> {simObject.title} {"   "}
    </h4>
  );

  const collapsibleDiv = (
    <div>
      <p style={{ marginBottom: 5 }}>
        {simObject.subtitle}{" "}
        <a style={{ color: "#337ab7" }} onClick={() => showModalMenu("szenarien")}>
          (mehr)
        </a>
      </p>
      <table border={0} style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td
              style={{
                textAlign: "center",
                paddingLeft: "0px",
                paddingTop: "0px",
                paddingBottom: "0px",
              }}
            >
              <h5
                style={{
                  textAlign: "center",
                  margin: "4px",
                }}
              >
                <b>Simulation</b>
              </h5>
            </td>
            <td
              style={{
                textAlign: "center",
                paddingLeft: "0px",
                paddingTop: "0px",
                paddingBottom: "5px",
              }}
            >
              <h5
                style={{
                  textAlign: "center",
                  margin: "4px",
                }}
              >
                <b>Karte</b>
              </h5>
            </td>
            <td
              style={{
                textAlign: "center",
                paddingLeft: "0px",
                paddingTop: "0px",
                paddingBottom: "5px",
              }}
            >
              <h5
                style={{
                  textAlign: "center",
                  margin: "4px",
                }}
              >
                <b>Animation</b>
              </h5>
            </td>
          </tr>
          <tr>
            <td
              style={{
                textAlign: "center",
                paddingLeft: "0px",
                paddingTop: "0px",
                paddingBottom: "0px",
              }}
            >
              <table
                border={0}
                style={{
                  width: "100%",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "center",
                      }}
                    >
                      {simulationLabels[0]} {simulationLabels[1]}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "center",
                      }}
                    />
                  </tr>
                  <tr>
                    <td>
                      {simulationLabels[2]} {simulationLabels[3]}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td
              key={"bgprev" + selectedBackgroundIndex}
              style={{
                textAlign: "center",
                paddingLeft: "0px",
                paddingTop: "0px",
                paddingBottom: "0px",
              }}
            >
              {backgrounds.map((item, index) => {
                let style;
                if (selectedBackgroundIndex === index) {
                  style = {
                    border: "3px solid #5f83b8",
                    marginLeft: 7,
                  };
                } else {
                  style = {
                    //border: '3px solid #818180',
                    marginLeft: 7,
                  };
                }
                return (
                  <a
                    key={"backgroundChanger." + index}
                    title={item.title}
                    onClick={() => {
                      setBackgroundIndex(index);
                    }}
                  >
                    <img alt="" style={style} width="36px" src={item.src} />
                  </a>
                );
              })}
            </td>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "center",

                paddingLeft: "0px",
                paddingTop: "0px",
                paddingBottom: "0px",
              }}
            >
              <table
                border={0}
                style={{
                  width: "100%",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        verticalAlign: "center",
                      }}
                    >
                      <a
                        style={{ textDecoration: "none" }}
                        onClick={() => {
                          setAnimationEnabled(!(animationEnabled === true));
                        }}
                        title={
                          animationEnabled === true
                            ? "Fließgeschehen ausblenden"
                            : "Fließgeschehen darstellen"
                        }
                      >
                        <Label
                          style={{ padding: 4, width: 39 }}
                          variant={animationEnabled === true ? "primary" : "secondary"}
                        >
                          <FontAwesomeIcon
                            className="fa-1x"
                            icon={animationEnabled === true ? faToggleOn : faToggleOff}
                          />
                          {animationEnabled === true ? " An" : " Aus"}{" "}
                        </Label>
                        {/* <img
													style={
														animationEnabled === true ? (
															{
																border: '3px solid #5f83b8',
																marginLeft: 7
															}
														) : (
															{
																//border: '3px solid #818180',
																marginLeft: 7
															}
														)
													}
													src='images/animationEnabled.1.png'
													width='36px'
												/> */}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
  return (
    <ResponsiveInfoBox
      // style={{ cursor: mapCursor }}
      secondaryInfoBoxElements={secondaryInfoBoxElements}
      header={legendTable}
      fixedRow={false}
      pixelwidth={pixelwidth}
      alwaysVisibleDiv={alwaysVisibleDiv}
      collapsibleDiv={collapsibleDiv}
    />
  );
};

export default ControlInfoBox;
