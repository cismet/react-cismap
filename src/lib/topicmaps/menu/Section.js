import React, { useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import Panel from "../../commons/Panel";
import { UIContext, UIDispatchContext } from "../../contexts/UIContextProvider";

const GenericModalMenuSection = ({
  sectionKey,
  sectionTitle,
  sectionBsStyle,
  sectionContent,
  //new
  activeSectionKey,
  setActiveSectionKey,
  defaultContextValues = {},
}) => {
  let _activeSectionKey, _setActiveSectionKey;

  const { appMenuActiveMenuSection } = useContext(UIContext) || defaultContextValues;
  const { setAppMenuActiveMenuSection } = useContext(UIDispatchContext) || defaultContextValues;
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
