import React from "react";
// import { getTopicMapVersion } from '../../constants/versions';
import { version } from "../../meta";
// Since this component is simple and static, there's no parent container for it.
const Component = () => {
  return (
    <div>
      <b>TopicMaps Wuppertal</b>:{" "}
      <a href="https://cismet.de/" target="_cismet">
        cismet GmbH
      </a>{" "}
      auf Basis von{" "}
      <a href="http://leafletjs.com/" target="_more">
        Leaflet
      </a>{" "}
      und{" "}
      <a href="https://cismet.de/#refs" target="_cismet">
        cids | react-cismap v{version} | WuNDa
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
  );
};

export default Component;
