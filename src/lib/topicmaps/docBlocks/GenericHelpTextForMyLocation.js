import React from "react";
import Icon from "../../commons/Icon";
import meinStandpunktMarkerDoppel from "./MeinStandpunktMarkerDoppel.jpg";
import meinStandpunktMarker from "./MeinStandpunktMarker.jpg";
const GenericHelpTextForMyLocation = () => {
  return (
    <p>
      Mit der Funktion Mein Standort <Icon name="map-marker" /> können Sie Ihren aktuellen Standort
      mit einem blauen Kreissymbol <img alt="MeinStandpunktMarker" src={meinStandpunktMarker} /> in
      der Karte anzeigen. Das Standortsymbol ist umgeben von einem zweiten Kreis mit transparenter,
      blauer Füllung, dessen Radius die Unsicherheit der Positionsbestimmung angibt{" "}
      <img alt="MeinStandpunktMarkerDoppel" src={meinStandpunktMarkerDoppel} />. Die Richtigkeit der
      Positionsanzeige ist dabei nicht garantiert, ihre Genauigkeit hängt davon ab, mit welcher
      Methode Ihr Endgerät und der von Ihnen verwendete Browser die Position bestimmen. Smartphones
      und Tablet-PC's sind i. d. R. mit einer GPS-Antenne ausgestattet, sodass Sie bei diesen
      Geräten eine Positionsgenauigkeit in der Größenordnung von 10 Metern erwarten können. Die
      Markierung Ihrer Position wird laufend automatisch aktualisiert. Ein weiterer Klick auf "Mein
      Standort" schaltet die Anzeige Ihrer Position wieder ab.
    </p>
  );
};

export default GenericHelpTextForMyLocation;
