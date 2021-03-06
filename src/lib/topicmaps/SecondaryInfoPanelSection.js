import React from "react";
import { Accordion } from "react-bootstrap";
import Panel from "../commons/Panel";
// Since this component is simple and static, there's no parent container for it.
const Comp = ({ header = "Header", bsStyle = "success", content, children }) => {
  return (
    <Accordion style={{ marginBottom: 6 }} defaultActiveKey={"X"}>
      <Panel header={header} eventKey={"X"} bsStyle={bsStyle}>
        {content || children}
      </Panel>
    </Accordion>
  );
};

export default Comp;
