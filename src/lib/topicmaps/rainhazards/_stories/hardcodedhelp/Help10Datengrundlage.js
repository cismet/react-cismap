import React, { useContext } from "react";
import GenericModalMenuSection from "../../../../topicmaps/menu/Section";
import LicenseStadtplanTagNacht from "../../../../topicmaps/wuppertal/LicenseStadtplanTagNacht";
import LicenseLBK from "../../../../topicmaps/wuppertal/LicenseLuftbildkarte";
import { UIDispatchContext } from "../../../../contexts/UIContextProvider";
/* eslint-disable jsx-a11y/anchor-is-valid */

const Component = () => {
  const { setAppMenuActiveMenuSection } = useContext(UIDispatchContext);

  return (
    <GenericModalMenuSection
      sectionKey="datengrundlage"
      sectionTitle="Datengrundlagen"
      sectionBsStyle="warning"
      sectionContent={
        <div>
          <img
            alt="aislogo"
            src="/images/Signet_AIS_RZ.png"
            style={{ width: 300, margin: 20 }}
            align="right"
          />

          <p>
            Die Starkregengefahrenkarte im AIS Starkregenvorsorge Haltern am See stellt in zwei
            umschaltbaren Kartenansichten maximale Wasserstände bzw. maximale Fließgeschwindigkeiten
            im gesamten Stadtgebiet dar, die im Verlauf von zwei simulierten Starkregenereignissen
            berechnet wurden. Dazu wurde ein Raster der Geländeoberfläche mit einer Kantenlänge von
            1 m genutzt. Die Wasserstände und Fließgeschwindigkeiten werden jeweils mit einem
            Farbverlauf visualisiert. Der Farbverlauf für die <strong>Wasserstände</strong> nutzt
            die Eckwerte 10 cm (hellblau), 30 cm (blau), 50 cm (dunkelblau) und 100 cm (violett).
            Wasserstände unter 5 cm werden nicht mehr farbig ausgeprägt (transparente Darstellung).
            Zur Visualisierung der <strong>Fließgeschwindigkeiten</strong>, angegeben in Meter pro
            Sekunde (m/s), werden die Eckwerte 0,25 m/s (gelb), 0,5 m/s (orange), 2,0 m/s (hellrot)
            und 4 m/s (dunkelrot) verwendet. Der untere Grenzwert für die farbige Anzeige einer
            Fließgeschwindigkeit liegt bei 0,2 m/s. Die Simulationsberechnungen wurden im Auftrag
            der Stadt Haltern am See durch das Ingenieurbüro Dr. Pecher AG (Gelsenkirchen/Erkrath)
            durchgeführt. Im Modell werden unterschiedliche Geländerauheiten und zeitlich variable
            Versickerungsansätze je nach Flächennutzung genutzt. Der Abfluss im Kanalnetz und durch
            Überstau aus dem Kanalnetz austretendes Wasser wurden nicht explizit als Quellen
            berücksichtigt. Die Ableitungs- und Speicherwirkung des Kanalnetzes wurde über einen
            pauschalen Verlustansatz berücksichtigt. Die Berechnungsergebnisse haben daher je nach
            Berechnungsannahme immer einen Variationsbereich und spiegeln in der Regel mittlere
            Verhältnisse wieder. Je nach Regen und Randbedingungen in der Realität können in
            Teilgebieten die Wasserstände auf dem Gelände höher oder geringer ausfallen. Um diese
            Variationen zu verstehen und besser einschätzen zu können, sind die zwei
            unterschiedlichen Szenarien dargestellt.{" "}
          </p>

          <p>
            Die Simulationen basieren auf einem Digitalen Geländemodell (DGM1) von Haltern am See.
            Grundlage hierfür sind flächenhafte Höhenmessungen, die das Land NRW turnusmäßig mit
            einem Laserscanner aus einem Flugzeug heraus durchführt (verfügbarer Datenstand 2016).
            Das DGM1 wurde um die Gebäude aus dem Liegenschaftskataster von Haltern am See (10/2017)
            und wichtige verrohrte Gewässerabschnitte sowie Geländedurchlässe ergänzt, um eine
            hydrologisch korrekte Abflussberechnung zu gewährleisten. Sehr neue Gebäude, die nach
            dem Modellaufbau fertiggestellt wurden (z. B. Neubaugebiete) sind daher noch nicht im
            Datenbestand erfasst. Hier lassen sich aus dem angrenzenden Gelände dennoch wichtige
            Hinweise zur möglichen Überflutung ableiten (s. auch Schaltfläche: Fehler im
            Geländemodell melden).
          </p>

          <p>
            Darüber hinaus ist das Ergebnis der Simulation von der Dauer und Intensität des Regens
            abhängig, der für die Simulation angenommen wird. Wir bieten Ihnen hierzu zwei
            unterschiedliche{" "}
            <a className="renderAsLink" onClick={() => setAppMenuActiveMenuSection("szenarien")}>
              simulierte Szenarien
            </a>{" "}
            an, einen Starkregen (SRI 6) als "Modellregen" sowie einen extremen Starkregen
            abgeleitet aus gemessenen Regenhöhen in Lippramsdorf (SRI 10), die dann auf ganz Haltern
            am See angewendet wurden.{" "}
          </p>

          <p>
            Das Auskunfts- und Informationssystem (AIS) Starkregenvorsorge ist im Rahmen des
            DBU-Projektes KLAS in Bremen entwickelt und seitdem ergänzt worden.
          </p>

          <p>
            Zur Betrachtung der Ergebnisse stellen wir Ihnen drei verschiedene Hintergrundkarten
            bereit, die auf den folgenden Geodatendiensten und Geodaten basieren:
          </p>

          <ul>
            <li>
              <strong>Stadtplan (grau)</strong>: Kartendienst (vektorbasiert) der cismet GmbH.
              Datengrundlage: <strong>cismet light</strong>. Wöchentlich in einem automatischen
              Prozess aktualisierte Bereitstellung der OpenStreetMap als Vektorlayers mit der
              OpenMapTiles-Server-Technologie. Lizenzen der Ausgangsprodukte:{" "}
              <a
                target="_legal"
                href="https://github.com/openmaptiles/openmaptiles/blob/master/LICENSE.md"
              >
                Openmaptiles
              </a>{" "}
              und{" "}
              <a target="_legal" href="https://www.opendatacommons.org/licenses/odbl/1.0/">
                ODbL
              </a>{" "}
              (OpenStreetMap contributors).
            </li>
            <LicenseStadtplanTagNacht stylesDesc="" />
            <li>
              <strong>Luftbildkarte</strong>: (1) Kartendienst (WMS) des RVR. Datengrundlage:{" "}
              <strong>Digitale Orthophotos (DOP) des RVR</strong> WMS-Dienst für farbige, digitale,
              georeferenzierte, lagegenaue, entzerrte Luftbilder des Regionalverband Ruhr
              (Verbandsgebiet). (
              <a target="_legal" href="https://www.rvr.ruhr/daten-digitales/geodaten/luftbilder/">
                weiter Informationen
              </a>
              ). (2) Kartendienste (WMS) des Regionalverbandes Ruhr (RVR). Datengrundlagen:{" "}
              <strong>Stadtkarte 2.0</strong> und{" "}
              <strong>Kartenschrift aus der Stadtkarte 2.0</strong>. (Details s. Hintergrundkarte
              Stadtplan).
            </li>
          </ul>
        </div>
      }
    />
  );
};
export default Component;
