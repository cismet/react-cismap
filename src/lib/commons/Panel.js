import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";

//Acting like a Bootstrap3 Panel
const Comp = (props) => {
  let headerStyle;
  switch (props.bsStyle) {
    case "primary":
      headerStyle = {
        backgroundColor: "#217CB4",
        color: "#FFFFFF",
      };
      break;
    case "success":
      headerStyle = {
        backgroundColor: "#DFF0DA",
        color: "#3B7742",
      };
      break;
    case "info":
      headerStyle = {
        backgroundColor: "#D8EEF7",
        color: "#27718D",
      };
      break;
    case "warning":
      headerStyle = {
        backgroundColor: "#FDF8E5",
        color: "#8C6C40",
      };
      break;
    case "danger":
      headerStyle = {
        backgroundColor: "#F3DEDE",
        color: "#AC4143",
      };
      break;
    default:
      headerStyle = {
        backgroundColor: "#F5F5F5",
        color: "#333333",
      };
      break;
  }
  return (
    <Card>
      <Card.Header
        style={{
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 8,
          paddingBottom: 8,
          ...headerStyle,
        }}
      >
        <Accordion.Toggle
          style={{ padding: 0, border: 0, textAlign: "left" }}
          as={Button}
          variant="link"
          eventKey={props.eventKey}
        >
          <b style={{ fontWeight: 500, fontSize: 16, margin: 0, ...headerStyle }}>{props.header}</b>
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={props.eventKey}>
        <Card.Body style={{ padding: 15 }}>{props.children}</Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

export default Comp;
