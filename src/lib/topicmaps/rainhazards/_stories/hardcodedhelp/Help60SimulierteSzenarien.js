import React from "react";
import GenericModalMenuSection from "../../../../topicmaps/menu/Section";

const Component = ({ uiState, uiStateActions }) => {
  return (
    <GenericModalMenuSection
      uiState={uiState}
      uiStateActions={uiStateActions}
      sectionKey="szenarien"
      sectionTitle="Simulierte Szenarien"
      sectionBsStyle="info"
      sectionContent={
        <div>
          <p>
            Die berechneten Simulationen wurden mit "künstlichen" Modellregen durchgeführt. Der
            extreme Starkregen (SRI 10) basiert dabei auf den Regenmessungen eines wirklich
            aufgetretenen Starkregenereignisses in Lippramsdorf. Dieser lokal aufgetretene extreme
            Starkregen wurde im Modell für die Beregnung des Stadtgebietes angesetzt.{" "}
          </p>

          <p>
            Die verwendeten <strong>Modellregen</strong> werden durch die Dauer (in Stunden,
            abgekürzt "h"), die in dieser Zeit fallende Regenmenge (in Liter pro Quadratmeter,
            abgekürzt "l/m²") und den zeitlichen Verlauf der Regenintensität beschrieben. Für den
            Intensitätsverlauf des Starkregens SRI 6 wurde ein sogenannter{" "}
            <strong>Eulerregen Typ II</strong> genutzt. Dabei werden in 5 Minuten-Abschnitten
            unterschiedliche Intensitäten angenommen, die bis zur maximalen Intensität schnell
            ansteigen, dann stark abfallen und danach allmählich abklingen.
          </p>

          <p>
            Zur Einteilung der Starkregen dient der ortsbezogene{" "}
            <strong>Starkregenindex (SRI)</strong> nach Schmitt, der Niederschläge in eine Skala von
            1 bis 12 einteilt, vergleichbar mit der Klassifizierung von Erdbeben nach Mercalli. Das
            Ereignis in Lippramsdorf entsprach im Zentrum des Unwetters dem Index SRI 10. Der
            Starkregenindex wird durch eine statistische Auswertung von sehr langen vorliegenden
            Regenmessungen an die örtlichen Gegebenheiten angepasst.Starkregen mit SRI 6 bis 7 (
            <strong>außergewöhnliche Starkregen</strong>) haben statistische Wiederkehrzeiten von 50
            bis 100 Jahren. Für noch stärkere <strong>extreme Starkregen</strong> lässt sich aus der
            Statistik kein verlässliches Wiederkehrintervall mehr ableiten (seltener als einmal in
            100 Jahren). Aus den Messungen in Lippramsdorf wurde für das Modell ein Starkregen mit
            112 l/m² (Dauer 180 min). Die Regensumme in dem maßgeblichen 60-Min-Abschnitt beträgt
            82,5 mm (SRI = 10). Der Niederschlag, der in Münster 2014 mit insgesamt 292 mm gemessen
            wurde und starke Schäden verursachte, gehört z. B. zu der Stufe SRI 12.
          </p>

          <p>
            Mit diesen Erläuterungen lassen sich die zwei simulierten Szenarien wie folgt
            zusammenfassen:
          </p>

          <ul>
            <li>
              <strong>Stärke 6</strong>: außergewöhnliches Starkregenereignis, Dauer 1 h,
              Niederschlag 38,4 l/m², Eulerregen Typ II, SRI 6, 50-jährliche Wiederkehrzeit nach
              KOSTRA-2010
            </li>

            <li>
              <strong>Stärke 10</strong>: extremes Starkregenereignis - abgeleitet aus gemessenem
              Niederschlag 112 l/m² mit ungleichmäßiger Verteilung über 3h, Wiederkehrzeit deutlich
              größer als 100 Jahre
            </li>
          </ul>
        </div>
      }
    />
  );
};
export default Component;
