import React, { useState, useRef, useEffect } from "react";
import { parkscheinautomatenfeatures, storiesCategory } from "./StoriesConf";
import { RoutedMap, MappingConstants } from "../..";
import TopicMapContextProvider from "../../contexts/TopicMapContextProvider";
import TopicMapComponent from "../TopicMapComponent";
import FeatureCollection from "../../FeatureCollection";
import GenericInfoBoxFromFeature from "../GenericInfoBoxFromFeature";

import PhotoLightbox from "../PhotoLightbox";
export default {
  title: storiesCategory + "InfoBox",
};

const mapStyle = {
  height: 600,
  cursor: "pointer",
};

export const SimplePhotoLightBox = () => {
  const [lightBoxIndex, setLightBoxIndex] = useState(0);
  const [lightBoxVisible, setLightBoxVisible] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <p style={{ margin: 100 }}>
        click{" "}
        <a
          className="renderAsLink"
          onClick={() => {
            setLightBoxVisible(true);
          }}
        >
          here
        </a>{" "}
        to open again
      </p>
      <PhotoLightbox
        defaultContextValues={{
          title: "Title",
          photourls: [
            "https://cismet.de/images/personal/thorsten.jpg",
            "https://cismet.de/images/personal/sabine.jpg",
            "https://cismet.de/images/personal/jean.jpg",
            "https://cismet.de/images/personal/thorstenherter.jpg",
          ],
          caption: "Simple Demo",
          index: lightBoxIndex,
          visible: lightBoxVisible,
          setVisible: (vis) => {
            setLightBoxVisible(vis);
          },
          setIndex: (i) => {
            setLightBoxIndex(i);
          },
        }}
      />
    </div>
  );
};

export const SimplePhotoLightBoxWithMultipleCaptions = () => {
  const [lightBoxIndex, setLightBoxIndex] = useState(0);
  const [lightBoxVisible, setLightBoxVisible] = useState(true);
  return (
    <div style={{ position: "relative" }}>
      <p style={{ margin: 100 }}>
        click{" "}
        <a
          className="renderAsLink"
          onClick={() => {
            setLightBoxVisible(true);
          }}
        >
          here
        </a>{" "}
        to open again
      </p>
      <PhotoLightbox
        defaultContextValues={{
          title: "Title",
          photourls: [
            "https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ",
            "https://i.picsum.photos/id/1/5616/3744.jpg?hmac=kKHwwU8s46oNettHKwJ24qOlIAsWN9d2TtsXDoCWWsQ",
            "https://i.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
          ],
          captions: ["Simple Demo 1", "Simple Demo 2", "Simple Demo 3"],
          index: lightBoxIndex,
          visible: lightBoxVisible,
          setVisible: (vis) => {
            setLightBoxVisible(vis);
          },
          setIndex: (i) => {
            setLightBoxIndex(i);
          },
        }}
      />
    </div>
  );
};

export const SimplePhotoLightBoxWithMultipleCaptionsAndExternalLinks = () => {
  const [lightBoxIndex, setLightBoxIndex] = useState(0);
  const [lightBoxVisible, setLightBoxVisible] = useState(true);
  return (
    <div style={{ position: "relative" }}>
      <p style={{ margin: 100 }}>
        click{" "}
        <a
          className="renderAsLink"
          onClick={() => {
            setLightBoxVisible(true);
          }}
        >
          here
        </a>{" "}
        to open again
      </p>
      <PhotoLightbox
        defaultContextValues={{
          title: "Title",
          photourls: [
            "https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ",
            "https://i.picsum.photos/id/1/5616/3744.jpg?hmac=kKHwwU8s46oNettHKwJ24qOlIAsWN9d2TtsXDoCWWsQ",
            "https://i.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
          ],
          captions: [
            <div>
              Simple Demo 1 (
              <a
                href="https://i.picsum.photos/id/0/5616/3744.jpg?hmac=3GAAioiQziMGEtLbfrdbcoenXoWAW-zlyEAMkfEdBzQ"
                target="_externalView"
              >
                open in external Tab
              </a>
              )
            </div>,
            "Simple Demo 2",
            "Simple Demo 3",
          ],
          index: lightBoxIndex,
          visible: lightBoxVisible,
          setVisible: (vis) => {
            setLightBoxVisible(vis);
          },
          setIndex: (i) => {
            setLightBoxIndex(i);
          },
        }}
      />
    </div>
  );
};
