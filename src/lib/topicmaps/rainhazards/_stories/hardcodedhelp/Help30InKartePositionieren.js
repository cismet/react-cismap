import React from "react";
import GenericModalMenuSection from "../../../../topicmaps/menu/Section";
import Icon from "../../../../commons/Icon";

const Component = () => {
  return (
    <GenericModalMenuSection
      sectionKey="positionieren"
      sectionTitle="In Karte positionieren"
      sectionBsStyle="success"
      sectionContent={
        <div>
          <p>
            Um die Gefährdung durch Starkregen in einem bestimmten Bereich des Stadtgebietes zu
            erkunden, geben Sie den Anfang (mindestens zwei Zeichen) einer Adresse im Eingabefeld
            links unten ein. In der inkrementellen Auswahlliste werden Ihnen passende Treffer
            angeboten. (Wenn Sie weitere Zeichen eingeben, wird der Inhalt der Auswahlliste
            angepasst.)
          </p>
          <p>
            Nach der Auswahl eines Treffers aus der Liste wird die Karte auf die zugehörige Position
            zentriert. Bei Suchbegriffen mit Punktgeometrie (Adresse, Straße) wird außerdem ein
            großer Maßstab (Zoomstufe 14) eingestellt und ein Marker <Icon name="map-marker" /> auf
            der Zielposition platziert.
          </p>
          <p>
            Durch Anklicken des Werkzeuges <Icon name="close" /> links neben dem Eingabefeld können
            Sie die Suche zurücksetzen (Entfernung von Marker bzw. Abdunklung, Löschen des Textes im
            Eingabefeld).
          </p>
        </div>
      }
    />
  );
};
export default Component;
