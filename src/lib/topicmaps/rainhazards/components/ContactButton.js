import React from "react";
import ContactButton from "../../../ContactButton";

const Comp = () => {
  return (
    <ContactButton
      id="329487"
      key="dsjkhfg"
      position="topleft"
      title="Fehler im Geländemodell melden"
      action={() => {
        let link = document.createElement("a");
        link.setAttribute("type", "hidden");
        const br = "\n";
        const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

        let normalMailToHref =
          "mailto:starkregen@haltern.de?subject=eventueller Fehler im Geländemodell&body=" +
          encodeURI(`Sehr geehrte Damen und Herren,${br}${br} in der Starkregengefahrenkarte `) +
          encodeURI(`auf${br}${br}`) +
          `${window.location.href.replace(/&/g, "%26").replace(/#/g, "%23")}` +
          encodeURI(
            `${br}` +
              `${br}` +
              `ist mir folgendes aufgefallen:${br}` +
              `${br}${br}${br}${br}` +
              `Mit freundlichen Grüßen${br}` +
              `${br}` +
              `${br}`
          );
        let iosMailToHref =
          "mailto:starkregen@haltern.de?subject=eventueller Fehler im Geländemodell&body=" +
          encodeURI(`Sehr geehrte Damen und Herren, in der Starkregengefahrenkarte `) +
          encodeURI(`auf `) +
          `${window.location.href.replace(/&/g, "%26").replace(/#/g, "%23")}` +
          encodeURI(` ist mir folgendes aufgefallen:`);
        document.body.appendChild(link);
        if (iOS) {
          link.href = iosMailToHref;
        } else {
          link.href = normalMailToHref;
        }

        link.click();
      }}
    />
  );
};
export default Comp;
