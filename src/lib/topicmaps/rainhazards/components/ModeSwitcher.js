import React from "react";
import { starkregenConstants } from "../constants";
import { faRandom } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { TopicMapContext } from "../../../contexts/TopicMapContextProvider";
import { ResponsiveTopicMapContext } from "../../../contexts/ResponsiveTopicMapContextProvider";

const Comp = ({
  displayMode,
  titleString = "cismet Starkregenkarte",
  additionalControls,
  additionalControlsShown,
  additionalControlsToggle,
}) => {
  let titleContent;
  const { history } = useContext(TopicMapContext);
  const { windowSize } = useContext(ResponsiveTopicMapContext);

  if (displayMode === starkregenConstants.SHOW_HEIGHTS) {
    titleContent = (
      <div>
        {additionalControlsToggle && (
          <div style={{ float: "left", paddingLeft: 10 }}>{additionalControlsToggle}</div>
        )}
        <b>{titleString}: </b> max. Wasserstände
        <div style={{ float: "right", paddingRight: 10 }}>
          <a
            style={{ color: "#337ab7" }}
            // onClick={() => {
            //   setX.setDisplayMode(starkregenConstants.SHOW_VELOCITY);
            // }}
            href={"/#/fliessgeschwindigkeiten" + history.location.search}
          >
            <FontAwesomeIcon icon={faRandom} style={{ marginRight: 5 }} />
            Fließgeschwindigkeiten
          </a>
        </div>
      </div>
    );
  } else {
    titleContent = (
      <div>
        <b>{titleString}: </b> max. Fließgeschwindigkeiten
        <div style={{ float: "right", paddingRight: 10 }}>
          <a
            style={{ color: "#337ab7" }}
            // onClick={() => {
            //   setX.setDisplayMode(starkregenConstants.SHOW_HEIGHTS);
            // }}
            href={"/#/hoehen" + history.location.search}
          >
            <FontAwesomeIcon icon={faRandom} style={{ marginRight: 5 }} />
            Wasserstände
          </a>
        </div>
      </div>
    );
  }

  let title = null;
  title = (
    <table
      border="0"
      style={{
        width: (windowSize?.width || 300) - 54 - 12 - 38 - 12 + "px",
        height: "30px",
        position: "absolute",
        left: 54,
        top: 12,
        zIndex: 555,
      }}
    >
      <tbody>
        <tr>
          <td
            style={{
              textAlign: "center",
              verticalAlign: "middle",
              background: "#ffffff",
              color: "black",
              opacity: "0.9",
              paddingLeft: "10px",
            }}
          >
            {titleContent}
          </td>
        </tr>
        {additionalControls && additionalControlsShown && (
          <tr>
            <td
              style={{
                textAlign: "center",
                verticalAlign: "middle",
                background: "#ffffff",
                color: "black",
                opacity: "0.9",
                paddingLeft: "10px",
                paddingTop: "10px",
              }}
            >
              {additionalControls}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
  return title;
};

export default Comp;
