import Icon from "../commons/Icon";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import CismetFooterAcks from "./wuppertal/CismetFooterAcknowledgements";
import GenericRVRStadtplanwerkMenuFooter from "./wuppertal/GenericRVRStadtplanwerkMenuFooter";
import { UIContext, UIDispatchContext } from "../contexts/UIContextProvider";
import { ResponsiveTopicMapContext } from "../contexts/ResponsiveTopicMapContextProvider";

const Comp = ({
  visible,
  uiHeight,
  setVisibleState,
  modalBodyStyle,
  title,
  titleIconName,
  mainSection,
  subSections,
  imageUrl,
  imageStyle,
}) => {
  const { secondaryInfoVisible } = useContext(UIContext);
  const { setSecondaryInfoVisible } = useContext(UIDispatchContext);
  const { windowSize } = useContext(ResponsiveTopicMapContext);
  let _visible, _setVisibleState;

  if (visible === undefined) {
    _visible = secondaryInfoVisible;
  } else {
    _visible = visible;
  }

  if (setVisibleState === undefined) {
    _setVisibleState = setSecondaryInfoVisible;
  } else {
    _setVisibleState = setVisibleState;
  }
  const close = () => {
    _setVisibleState(false);
  };
  if (modalBodyStyle === undefined) {
    modalBodyStyle = {
      overflowY: "auto",
      overflowX: "hidden",
      maxHeight: (uiHeight || windowSize.height) - 200,
    };
  }

  return (
    <Modal
      style={{
        zIndex: 2900000000,
      }}
      height="100%"
      size="xl"
      show={_visible}
      onHide={close}
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          {titleIconName !== undefined && <Icon name={titleIconName} />} {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle} id="myMenu">
        <div style={{ width: "100%", minHeight: 250 }}>
          {imageUrl !== undefined && (
            <img
              alt="Bild"
              style={
                imageStyle || {
                  paddingLeft: 10,
                  paddingRight: 10,
                  float: "right",
                  paddingBottom: "5px",
                }
              }
              src={imageUrl}
              width="250"
            />
          )}
          {mainSection}
        </div>
        {subSections || []}
      </Modal.Body>
      <Modal.Footer>
        <table
          style={{
            width: "100%",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  verticalAlign: "bottom",
                  paddingRight: "30px",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px" }}>
                    <CismetFooterAcks />
                  </span>
                </div>
              </td>
              <td>
                <Button
                  id="cmdCloseModalApplicationMenu"
                  bsStyle="primary"
                  type="submit"
                  onClick={close}
                >
                  Ok
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Modal.Footer>
    </Modal>
  );
};

export default Comp;
Comp.propTypes = {
  menuIcon: PropTypes.string,
  menuTitle: PropTypes.string,
  menuIntroduction: PropTypes.object,
  menuSections: PropTypes.array,
  menuFooter: PropTypes.object,

  uiStateActions: PropTypes.object,
  uiState: PropTypes.object,
  kitasState: PropTypes.object,
  kitasActions: PropTypes.object,
  mappingState: PropTypes.object,
  mappingActions: PropTypes.object,
};

Comp.defaultProps = {
  menuIcon: "bars",
  menuTitle: "Einstellungen und Hilfe",
  menuSections: [],
  menuFooter: <GenericRVRStadtplanwerkMenuFooter />,
};
