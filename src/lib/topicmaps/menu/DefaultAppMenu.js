import React, { useContext } from "react";
import GenericModalApplicationMenu from "./ModalApplicationMenu";
import GenericMenuIntroduction from "./Introduction";
import DefaultSettingsPanel from "./DefaultSettingsPanel";
import { getSimpleHelpForTM } from "../../tools/uiHelper";
import Section from "./Section";
import ConfigurableDocBlocks from "../ConfigurableDocBlocks";
const AppMenu = (props) => {
  const {
    menuIcon = "bars",
    menuTitle = "Applikationsmenu",
    introductionMarkdown,
    introductionTerm = "der Objekte",
    sections = {},
    visible = true,
    simpleHelp = {
      content: undefined,
    },
    topicMapTitle = "",
    previewMapPosition,
    previewFeatureCollectionCount,
  } = props;

  let _menuIntroduction;
  _menuIntroduction = (
    <GenericMenuIntroduction
      markdown={
        introductionMarkdown ||
        `Über **Einstellungen** können Sie die Darstellung der
       Hintergrundkarte und ${introductionTerm} an Ihre 
       Vorlieben anpassen. Wählen Sie **Kompaktanleitung** 
       für detailliertere Bedienungsinformationen.`
      }
    />
  );

  let _sections = {
    _00settings: (
      <DefaultSettingsPanel
        previewMapPosition={previewMapPosition}
        previewFeatureCollectionCount={previewFeatureCollectionCount}
        key="settings"
      />
    ),
    _99help: (
      <Section
        key="help"
        sectionKey="HelpSection"
        sectionTitle="Kompaktanleitung"
        sectionBsStyle="default"
        sectionContent={
          <ConfigurableDocBlocks configs={getSimpleHelpForTM(topicMapTitle, simpleHelp)} />
        }
      />
    ),

    ...sections,
  };

  let keys = Object.keys(_sections).sort();
  let _menuSections = [];

  for (const key of keys) {
    _menuSections.push(_sections[key]);
  }

  return (
    <GenericModalApplicationMenu
      menuIcon={menuIcon}
      menuTitle={menuTitle}
      menuIntroduction={_menuIntroduction}
      menuSections={_menuSections}
    />
  );
};

export default AppMenu;
