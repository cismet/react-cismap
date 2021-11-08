import React, { useContext } from "react";
import GenericModalMenuSection from "../../../../topicmaps/menu/Section";
import Icon from "../../../../commons/Icon";
import { UIDispatchContext } from "../../../../contexts/UIContextProvider";
/* eslint-disable jsx-a11y/anchor-is-valid */

const Component = () => {
  const { setAppMenuActiveMenuSection } = useContext(UIDispatchContext);

  return (
    <GenericModalMenuSection
      sectionKey="wasserstand"
      sectionTitle="Max. Wasserstand oder Fließgeschwindigkeit abfragen"
      sectionBsStyle="success"
      sectionContent={
        <div>
          <p>
            Durch Anklicken der Schaltfläche <Icon name="crosshairs" /> oberhalb des Kontrollfeldes
            aktivieren Sie abhängig von der eingestellten Kartenansicht (Wasserstände vs.
            Fließgeschwindigkeiten) den Modus zur Abfrage des maximalen Wasserstandes bzw. der
            maximalen Fließgeschwindigkeit. Diese Maximalwerte sind im Verlauf jeder Simulation für
            eine jede 1m x 1m Rasterzelle berechnet worden. Anstelle der Schaltfläche erscheint in
            diesem Modus das Anzeigefeld "Maximaler Wasserstand" bzw. "Maximale
            Fließgeschwindigkeit", zunächst mit einem kurzen Bedienungshinweis. Ein Klick auf eine
            beliebige Position in der Karte bewirkt jetzt, dass die Zelle in der Karte markiert und
            der zugehörige Maximalwert des Wasserstandes bzw. der Fließgeschwindigkeit in diesem
            Feld angezeigt wird. Die Anzeige der maximalen Wasserstände wird dabei auf volle 10 cm
            gerundet (z. B. "ca. 20 cm"), um eine mögliche{" "}
            <a className="renderAsLink" onClick={() => setAppMenuActiveMenuSection("aussagekraft")}>
              Varianz der Simulationsergebnisse
            </a>{" "}
            zu verdeutlichen. Aus demselben Grund werden berechnete Wasserstände von mehr als 100 cm
            nur als "> 100 cm" angezeigt. Bitte beachten Sie, dass in der online-Karte Wasserstände
            kleiner als 5 cm transparent dargestellt sind, um die Aufmerksamkeit auf die
            kritischeren Bereiche zu lenken. Die Anzeige der maximalen Fließgeschwindigkeiten
            erfolgt in der Einheit "Meter pro Sekunde" (m/s), gerundet auf eine Nachkommastelle.
            Fließgeschwindigkeiten von mehr als 4 Meter pro Sekunde werden als "> 4 m/s" angezeigt.
          </p>
          <p>
            <b>Tipp für die Abfrage der maximalen Fließgeschwindigkeiten:</b> Deaktivieren Sie die{" "}
            <a className="renderAsLink" nClick={() => setAppMenuActiveMenuSection("karteninhalt")}>
              Animation
            </a>{" "}
            und stellen Sie einen sehr großen Betrachtungsmaßstab ein (Zoomstufe 21 oder 22). Dann
            wird Ihnen in der Kartendarstellung auch die zu der maximalen Fließgeschwindigkeit
            gehörende Fließrichtung zellenscharf angezeigt.
          </p>
          <p>
            Auch im Abfragemodus können Sie die Karte mit gedrückter linker Maustaste verschieben.
            Wenn Sie auf diese Weise oder durch{" "}
            <a
              className="renderAsLink"
              onClick={() => setAppMenuActiveMenuSection("positionieren")}
            >
              Positionierung über einen Suchbegriff
            </a>{" "}
            einen Kartenausschnitt auswählen, in dem die zuletzt abgefragte Zelle nicht mehr
            enthalten ist, wird das Anzeigefeld auf seinen Startzustand zurückgesetzt. Mit einem
            Klick auf das <Icon name="close" /> Symbol rechts oben im Anzeigefeld beenden Sie den
            Abfragemodus.
          </p>
        </div>
      }
    />
  );
};
export default Component;
