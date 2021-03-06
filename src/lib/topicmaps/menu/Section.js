import React, { useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Panel from "../../commons/Panel";
import Card from "react-bootstrap/Card";
import { UIContext, UIDispatchContext } from "../../contexts/UIContextProvider";

const GenericModalMenuSection = ({
  sectionKey,
  sectionTitle,
  sectionBsStyle,
  sectionContent,
  //new
  activeSectionKey,
  setActiveSectionKey,
}) => {
  let _activeSectionKey, _setActiveSectionKey;

  const { appMenuActiveMenuSection } = useContext(UIContext);
  const { setAppMenuActiveMenuSection } = useContext(UIDispatchContext);
  if (activeSectionKey === undefined) {
    _activeSectionKey = appMenuActiveMenuSection;
  } else {
    _activeSectionKey = activeSectionKey;
  }
  if (setActiveSectionKey === undefined) {
    _setActiveSectionKey = setAppMenuActiveMenuSection;
  } else {
    _setActiveSectionKey = setActiveSectionKey;
  }

  return (
    <Accordion
      key={sectionKey + "." + _activeSectionKey}
      name={sectionKey}
      style={{ marginBottom: 6 }}
      defaultActiveKey={_activeSectionKey || sectionKey}
      onSelect={() => {
        if (_activeSectionKey === sectionKey) {
          _setActiveSectionKey("none");
        } else {
          _setActiveSectionKey(sectionKey);
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
