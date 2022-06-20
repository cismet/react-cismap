import React, { useState, useRef, useEffect } from "react";

import GenericModalApplicationMenu from "../menu/ModalApplicationMenu";
import GenericModalMenuSection from "../menu/Section";
import { storiesCategory } from "./StoriesConf";
import { Link } from "react-scroll";
import Button from "react-bootstrap/Button";
import GenericHelpTextForMyLocation from "../docBlocks/GenericHelpTextForMyLocation";

export default {
  title: storiesCategory + "ModalMenu",
};
export const SimpleMenu = () => {
  const [activeSectionKey, setActiveActionKey] = useState("A");
  const [visible, setVisible] = useState(true);
  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Button
          size="lg"
          variant="outline-primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          Click to open again
        </Button>
      </div>
      <GenericModalApplicationMenu
        height={500}
        visible={visible}
        setVisible={setVisible}
        menuIntroduction={
          <span>
            Menu Introduction Menu Introduction Menu Introduction Menu Introduction Menu
            Introduction Menu Introduction
          </span>
        }
        menuTitle="Einstellungen und Kompaktanleitung"
        menuSections={[
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="A"
            sectionTitle="Section Content A (primary)"
            sectionBsStyle="primary"
            sectionContent={
              <div>
                Section Content A Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="B"
            sectionTitle="Section Content B (success)"
            sectionBsStyle="success"
            sectionContent={
              <div>
                Section Content B Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="C"
            sectionTitle="Section Content C (info)"
            sectionBsStyle="info"
            sectionContent={
              <div>
                Section Content C Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="D"
            sectionTitle="Section Content D (warning)"
            sectionBsStyle="warning"
            sectionContent={
              <div>
                Section Content D Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="E"
            sectionTitle="Section Content E (danger)"
            sectionBsStyle="danger"
            sectionContent={
              <div>
                Section Content E Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="F"
            sectionTitle="Section Content F (default)"
            sectionBsStyle="default"
            sectionContent={
              <div>
                Section Content A Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="G"
            sectionTitle="Section Content F (GenericHelpTextForMyLocation)"
            sectionBsStyle="default"
            sectionContent={
              <GenericHelpTextForMyLocation
                defaultContextValues={{
                  genericHelpTextForMyLocation: { addendum: <span>ssdf</span> },
                }}
              />
            }
          />,
        ]}
        menuFooter={
          <span>
            Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer{" "}
          </span>
        }
      />
    </div>
  );
};
export const SimpleMenuWithLinksToSections1 = () => {
  const [activeSectionKey, setActiveActionKey] = useState("A");
  const [visible, setVisible] = useState(true);
  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Button
          size="lg"
          variant="outline-primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          Click to open again
        </Button>
      </div>
      <GenericModalApplicationMenu
        height={500}
        visible={true}
        setVisible={setVisible}
        menuIntroduction={
          <span>
            Menu Introduction Menu Introduction Menu Introduction Menu Introduction Menu
            Introduction Menu Introduction{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkA"
              // to='A'
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("A")}
            >
              Link to A
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkB"
              // to='B'
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("B")}
            >
              Link to B
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkC"
              // to='C'
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("C")}
            >
              Link to C
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkD"
              // to='D'
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("D")}
            >
              Link to D
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkE"
              // to='E'
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("E")}
            >
              Link to E
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkF"
              // to='F'
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("F")}
            >
              Link to F
            </Link>{" "}
            (stays on top)
          </span>
        }
        menuTitle="Einstellungen und Kompaktanleitung"
        menuSections={[
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="A"
            sectionTitle="Section Content A (primary)"
            sectionBsStyle="primary"
            sectionContent={
              <div>
                Section Content A Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="B"
            sectionTitle="Section Content B (success)"
            sectionBsStyle="success"
            sectionContent={
              <div>
                Section Content B Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="C"
            sectionTitle="Section Content C (info)"
            sectionBsStyle="info"
            sectionContent={
              <div>
                Section Content C Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="D"
            sectionTitle="Section Content D (warning)"
            sectionBsStyle="warning"
            sectionContent={
              <div>
                Section Content D Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="E"
            sectionTitle="Section Content E (danger)"
            sectionBsStyle="danger"
            sectionContent={
              <div>
                Section Content E Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="F"
            sectionTitle="Section Content F (default)"
            sectionBsStyle="default"
            sectionContent={
              <div>
                Section Content A Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
        ]}
        menuFooter={
          <span>
            Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer{" "}
          </span>
        }
      />
    </div>
  );
};

export const SimpleMenuWithLinksToSections2 = () => {
  const [activeSectionKey, setActiveActionKey] = useState("A");
  const [visible, setVisible] = useState(true);
  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Button
          size="lg"
          variant="outline-primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          Click to open again
        </Button>
      </div>
      <GenericModalApplicationMenu
        height={500}
        visible={visible}
        setVisible={setVisible}
        menuIntroduction={
          <span>
            Menu Introduction Menu Introduction Menu Introduction Menu Introduction Menu
            Introduction Menu Introduction{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkA"
              to="A"
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("A")}
            >
              Link to A
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkB"
              to="B"
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("B")}
            >
              Link to B
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkC"
              to="C"
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("C")}
            >
              Link to C
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkD"
              to="D"
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("D")}
            >
              Link to D
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkE"
              to="E"
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("E")}
            >
              Link to E
            </Link>{" "}
            <Link
              className="needstobesetotherwise nobluecolorinbootstrap4"
              id="lnkF"
              to="F"
              containerId="myMenu"
              smooth={true}
              delay={100}
              onClick={() => setActiveActionKey("F")}
            >
              Link to F
            </Link>{" "}
            (scrolls down to optimal position)
          </span>
        }
        menuTitle="Einstellungen und Kompaktanleitung"
        menuSections={[
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="A"
            sectionTitle="Section Content A (primary)"
            sectionBsStyle="primary"
            sectionContent={
              <div>
                Section Content A Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="B"
            sectionTitle="Section Content B (success)"
            sectionBsStyle="success"
            sectionContent={
              <div>
                Section Content B Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="C"
            sectionTitle="Section Content C (info)"
            sectionBsStyle="info"
            sectionContent={
              <div>
                Section Content C Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="D"
            sectionTitle="Section Content D (warning)"
            sectionBsStyle="warning"
            sectionContent={
              <div>
                Section Content D Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="E"
            sectionTitle="Section Content E (danger)"
            sectionBsStyle="danger"
            sectionContent={
              <div>
                Section Content E Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
          <GenericModalMenuSection
            activeSectionKey={activeSectionKey}
            setActiveSectionKey={setActiveActionKey}
            sectionKey="F"
            sectionTitle="Section Content F (default)"
            sectionBsStyle="default"
            sectionContent={
              <div>
                Section Content A Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content Section Content Section Content Section Content
                Section Content Section Content
              </div>
            }
          />,
        ]}
        menuFooter={
          <span>
            Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer Footer{" "}
          </span>
        }
      />{" "}
    </div>
  );
};
// export const SingleInvertedGeoJSONInTheMap = () => <h3>Coming Soon</h3>;
