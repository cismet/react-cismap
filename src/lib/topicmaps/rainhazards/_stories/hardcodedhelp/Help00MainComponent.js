import React from "react";
import Datengrundlage from "./Help10Datengrundlage";
import Introduction from "./Help05Introduction";
import Karteninhalt from "./Help20Karteninhalt";
import InKartePositionieren from "./Help30InKartePositionieren";
import MeinStandort from "./Help40MeinStandort";
import WasserstandAbfragen from "./Help50WasserstandAbfragen";
import SimulierteSzenarien from "./Help60SimulierteSzenarien";
import Aussagekraft from "./Help70AussagekraftDerSimulationen";
import ModellfehlerMelden from "./Help80ModellfehlerMelden";

import GenericModalApplicationMenu from "../../../../topicmaps/menu/ModalApplicationMenu";
import Footer from "./Help99Footer";
const ModalHelpAndInfo = ({ version, footerLogoUrl }) => {
  return (
    <GenericModalApplicationMenu
      menuIntroduction={<Introduction />}
      menuIcon="info"
      menuTitle="Kompaktanleitung und Hintergrundinformationen"
      menuSections={[
        <Datengrundlage key="Datengrundlage" />,
        <Karteninhalt key="Karteninhalt" />,
        <InKartePositionieren key="InKartePositionieren" />,
        <MeinStandort key="MeinStandort" />,
        <WasserstandAbfragen key="WasserstandAbfragen" />,
        <SimulierteSzenarien key="SimulierteSzenarien" />,
        <Aussagekraft key="Aussagekraft" />,
        <ModellfehlerMelden key="ModellfehlerMelden" />,
      ]}
      menuFooter={<Footer version={version} logoUrl={footerLogoUrl} />}
    />
  );
};
export default ModalHelpAndInfo;
