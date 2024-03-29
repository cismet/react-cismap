import React, { useContext } from "react";
import Icon from "../../commons/Icon";
import { CustomizationContext } from "../../contexts/CustomizationContextProvider";

export default ({ defaultContextValues = {} }) => {
  const customizations = useContext(CustomizationContext) || defaultContextValues;
  let furtherExplanationOfClickableContent =
    customizations?.fachobjekteAuswaehlen?.furtherExplanationOfClickableContent || "";
  return (
    <div>
      <p>
        Bewegen Sie den Mauszeiger im Kartenfenster auf eines der farbigen Symbole
        {furtherExplanationOfClickableContent}, mit denen die Fachobjekte des Kartenthemas in der
        Karte dargestellt werden, um sich den Namen des jeweiligen Fachobjektes anzeigen zu lassen.
        Ein Klick auf das Symbol setzt den Fokus auf dieses Fachobjekt. Es wird dann blau hinterlegt
        und die zugehörigen Informationen (i. d. R. Name, Straße und Hausnummer, Kurzinformation)
        werden unten rechts in der Info-Box angezeigt. (Auf einem Tablet-PC wird der Fokus durch das
        erste Antippen des Fachobjekt-Symbols gesetzt, das zweite Antippen blendet den Namen ein.)
        Außerdem werden Ihnen in der Info-Box weiterführende Funktionen und Kommunikationslinks zu
        diesem Fachobjekt angeboten. Mit der Lupenfunktion <Icon name="search" /> wird die Karte auf
        das aktuelle Fachobjekt zentriert und gleichzeitig ein großer Betrachtungsmaßstab (Zoomstufe
        14) eingestellt. Falls es mehr Informationen zu den Fachobjekten gibt, als in der Info-Box
        dargestellt werden können, können Sie sich diese über die Datenblattfunktion{" "}
        <Icon name="info" /> anzeigen lassen. Die Kommunikationslinks umfassen i. d. R.{" "}
        <Icon name="phone" /> Telefon, <Icon name="envelope-square" /> E-Mail und{" "}
        <Icon name="external-link-square" /> Internet-Homepage.
      </p>
      <p>
        Wenn Sie noch kein Fachobjekt im aktuellen Kartenausschnitt selektiert haben, wird der Fokus
        automatisch auf das nördlichste Objekt gesetzt. Mit den Funktionen{" "}
        <a className="renderAsLink">&lt;&lt;</a> vorheriger Treffer und{" "}
        <a className="renderAsLink">&gt;&gt;</a> nächster Treffer können Sie ausgehend von dem
        Objekt, auf dem gerade der Fokus liegt, in nördlicher bzw. südlicher Richtung alle aktuell
        im Kartenfenster angezeigten Objekte durchmustern. Sofern die Kartenanwendung nur ein
        einziges Fachobjekt umfasst, bleibt der Fokus auf diesem Objekt, auch wenn sich dieses nicht
        im aktuell eingestellten Kartenausschnitt befindet. Die Funktionen{" "}
        <a className="renderAsLink">&lt;&lt;</a> vorheriger Treffer und{" "}
        <a className="renderAsLink">&gt;&gt;</a> nächster Treffer werden Ihnen in diesem Fall nicht
        angeboten. Mit der Funktion <Icon name="search" /> in der Info-Box können Sie jederzeit
        wieder zu diesem Fachobjekt zurückkehren.
      </p>
      <p>
        Mit der Schaltfläche <Icon name="chevron-circle-down" /> im dunkelgrau abgesetzten rechten
        Rand der Info-Box lässt sich diese so verkleinern, dass nur noch die thematische Zuordnung
        und der Name des Fachobjektes sowie die Link-Symbole angezeigt werden - nützlich für
        Endgeräte mit kleinem Display. Mit der Schaltfläche <Icon name="chevron-circle-up" /> an
        derselben Stelle können Sie die Info-Box dann wieder vollständig einblenden.
      </p>
      <p>
        In vielen unserer Kartenanwendungen bieten wir Ihnen zumindest zu einigen Fachobjekten Fotos
        oder Fotoserien an. Sie finden dann ein Vorschaubild direkt über der Info-Box. Klicken Sie
        auf das Vorschaubild, um einen Bildbetrachter (&quot;Leuchtkasten&quot;) mit dem Foto / der
        Fotoserie zu öffnen. Wenn wir hier auf Bildmaterial zugreifen, das der Urheber auch selbst
        im Internet publiziert, finden Sie im Fußbereich des Bildbetrachters einen Link auf dieses
        Angebot.
      </p>
    </div>
  );
};
