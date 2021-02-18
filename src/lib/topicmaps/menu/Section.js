import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Panel from "../../commons/Panel";
import Card from "react-bootstrap/Card";

const GenericModalMenuSection = ({
  sectionKey,
  sectionTitle,
  sectionBsStyle,
  sectionContent,
  // uiState,
  // uiStateActions,
  //new
  activeSectionKey,
  setActiveSectionKey = () => {},
}) => {
  return (
    <Accordion
      key={sectionKey + "." + activeSectionKey}
      name={sectionKey}
      style={{ marginBottom: 6 }}
      defaultActiveKey={activeSectionKey || sectionKey}
      onSelect={() => {
        if (activeSectionKey === sectionKey) {
          console.log("onSelect", "					setActiveSectionKey('none')        ");

          setActiveSectionKey("none");
        } else {
          console.log("onSelect", "					setActiveSectionKey('" + sectionKey + "')        ");
          setActiveSectionKey(sectionKey);
        }
      }}
    >
      <Panel header={sectionTitle} eventKey={sectionKey} bsStyle={sectionBsStyle}>
        {sectionContent}
      </Panel>
    </Accordion>
  );
};
export default GenericModalMenuSection;
