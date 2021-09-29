import Icon from "../../../commons/Icon";
import React from "react";
import { Button } from "react-bootstrap";

const Comp = ({ setFeatureInfoModeActivation, title = "Maximalen Wasserstand abfragen" }) => {
  return (
    <div
      key="featureInfoModeButton"
      style={{ marginBottom: 5, textAlign: "right", pointerEvents: "auto" }}
    >
      <Button
        style={{
          color: "#343434",
          backgroundImage: "linear-gradient(to bottom,#fff 0,#e0e0e0 100%)",
        }}
        variant="secondary"
        id="cmdShowGetFeatureInfo"
        title={title}
        onClick={(e) => {
          e.stopPropagation();
          setFeatureInfoModeActivation(true);
        }}
      >
        <Icon name="crosshairs" />
      </Button>
    </div>
  );
};

export default Comp;
