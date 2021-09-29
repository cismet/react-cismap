import React, { useContext } from "react";
import { UIDispatchContext } from "../../../../contexts/UIContextProvider";
/* eslint-disable jsx-a11y/anchor-is-valid */
import { version as reactCismapVersion } from "../../../../meta";
const Comp = ({ version, logoUrl }) => {
  const { setAppMenuActiveMenuSection } = useContext(UIDispatchContext);
  return (
    <div style={{ fontSize: "11px" }}>
      {logoUrl && (
        <img alt="aislogo" src={logoUrl} style={{ width: 150, margin: 5 }} align="right" />
      )}
      <b>Hintergrundkarten</b>: DOP © RVR | Stadtkarte 2.0 © RVR | WebAtlasDE © BKG{" "}
      <a className="renderAsLink" onClick={() => setAppMenuActiveMenuSection("datengrundlage")}>
        (Details und Nutzungsbedingungen)
      </a>
      <br />
      <b>Modellierung und AIS Starkregenvorsorge</b> (Version 1.0 | 04/2021):{" "}
      <a target="_wsw" href="https://www.haltern-am-see.de/">
        Stadt Haltern am See
      </a>{" "}
      |{" "}
      <a target="_pecher" href="https://www.pecher.de/">
        Dr. Pecher AG (Gelsenkirchen/Erkrath)
      </a>
      <div>
        <b>AIS Haltern v{version}</b> powered by{" "}
        <a href="https://cismet.de/" target="_cismet">
          cismet GmbH
        </a>{" "}
        auf Basis von{" "}
        <a href="http://leafletjs.com/" target="_more">
          Leaflet
        </a>{" "}
        und{" "}
        <a href="https://cismet.de/#refs" target="_cismet">
          cids | react-cismap v{reactCismapVersion}
        </a>{" "}
        |{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://cismet.de/datenschutzerklaerung.html"
        >
          Datenschutzerklärung (Privacy Policy)
        </a>
      </div>
    </div>
  );
};

export default Comp;
