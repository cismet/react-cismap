import React, { useContext } from "react";
import { UIDispatchContext } from "../../../../contexts/UIContextProvider";
import GenericModalMenuSection from "../../../../topicmaps/menu/Section";
/* eslint-disable jsx-a11y/anchor-is-valid */

const Component = () => {
  const { setAppMenuActiveMenuSection } = useContext(UIDispatchContext);

  return (
    <GenericModalMenuSection
      sectionKey="aussagekraft"
      sectionTitle="Aussagekraft der Simulationen"
      sectionBsStyle="info"
      sectionContent={
        <div>
          <p>
            Die Starkregengefahrenkarte zeigt die Ergebnisse von Simulationen, die dem heutigen
            Stand der Technik entsprechen. Die Berechnungen basieren auf einem vereinfachten Modell
            der tatsächlichen Verhältnisse, mit dem sich kritischere Bereich jedoch gut bestimmen
            lassen. Für eine noch differenziertere Modellierung fehlen derzeit noch genauere
            Geländedaten und Daten kleiner Strukturen (Gartenmauern etc.).{" "}
          </p>

          <p>Was sind die wichtigsten Annahmen, die getroffen wurden?</p>

          <ul>
            <li>
              Das abfließende Regenwasser findet in Kellergeschossen ein Rückhaltevolumen, das nicht
              berücksichtigt werden konnte. Hierzu fehlen weitergehende Daten. Die Verhältnisse in
              den Gebäuden sind aufgrund der unbekannten Ein- und Austrittspunkte auch noch nicht
              modellierbar.
            </li>

            <li>
              Variable Anteile des Regenwassers versickern oder verdunsten in der Realität. Mittlere
              variable Versickerungseffekte wurden in den dargestellten Berechnungen angesetzt.
              Verdunstung spielt bei den kurzen Niederschlägen nur eine untergeordnete Rolle. Die
              Versickerung ist stark von den Ausgangsbedingungen abhängig. Hat es vor einem
              Starkregen bereits etwas geregnet, versickert weniger Wasser. Gerade in den nicht
              befestigten Außenbereichen sind diese Variationen daher zu betrachten.
            </li>

            <li>
              Die unterschiedlichen Rauheiten wurden in Abhängigkeit der Flächennutzung
              berücksichtigt. Dies führt z. B. dazu, dass Oberflächenwasser von land- und
              forstwirtschaftlichen Flächen sowie Grünflächen langsamer abläuft, dafür schneller auf
              befestigten Flächen wie Straßen.
            </li>

            <li>
              In der Simulation wird das Kanalnetz derzeit durch einen pauschalen Verlustabzug
              berücksichtigt. Zu der detaillierten Wirkung von Abflüssen innerhalb des Kanalnetzes
              hat die Stadt Haltern am See gesonderte Fachberechnungen vorliegen (Zentraler
              Abwasserplan). Die dargestellten Starkregen zeichnen sich durch hohe Regenintensitäten
              oberhalb der Bemessungsgrenze des Kanalnetzes aus. Über das Kanalnetz kann zwar eine
              gewisse Menge an Regenwasser abgeführt werden, allerdings fließen bei den
              dargestellten Starkregen große Anteile oberirdisch ab oder können nicht mehr in das
              Kanalnetz eintreten.
            </li>
          </ul>

          <p>
            <strong>
              Die Modellannahmen, eine variable Vorfeuchte des Bodens und damit
              Versickerungseigenschaften und die gleichmäßige Niederschlagsbelastung führen dazu,
              dass es zu Abweichungen zwischen den Simulationsergebnissen und beobachteten
              Starkregen kommen kann. Niederschläge der Stufe SRI 6 bzw. 10 können daher je nach
              Randbedingungen in der Realität auch etwas geringere oder höhere Wasserstände zur
              Folge haben.{" "}
            </strong>{" "}
            Mit den Ergebnisdarstellungen in der online-Karte lassen sich unterschiedliche
            Betroffenheiten im Stadtgebiet aber sehr gut darstellen. Die beiden Szenarien zeigen
            eine mögliche Spannweite der Überflutungen im Modell auf. Je nach Betroffenheit und
            Schadenspotential lassen sich auf dieser Grundlage Vorsorgemaßnahmen bewerten.
          </p>

          <p>
            Auch das Digitale Geländemodell (DGM1), das vom Land NRW zur Verfügung gestellt und für
            die Simulationen verwendet wird, kann vereinzelt noch Fehler aufweisen oder kleinste
            Strukturen nicht richtig erfassen. Helfen Sie dabei, das DGM sukzessive zu verbessern,
            indem Sie vermutete{" "}
            <a
              className="renderAsLink"
              onClick={() => setAppMenuActiveMenuSection("modellfehlermelden")}
            >
              Fehler im Geländemodell melden
            </a>
            ! Zuletzt kann es sein, dass ein neues Gebäude in den Simulationen nicht berücksichtigt
            wurde, weil es zum Zeitpunkt der Datenbereitstellung für die Simulationsberechnungen
            noch nicht im Liegenschaftskataster nachgewiesen war oder ggf. ein Gebäude inzwischen
            abgerissen wurde.
          </p>
        </div>
      }
    />
  );
};
export default Component;
