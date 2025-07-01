import React, { useState } from "react";
import { storiesCategory } from "./StoriesConf";

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
            "https://images.unsplash.com/photo-1481988535861-271139e06469?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1460627390041-532a28402358?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
            "https://images.unsplash.com/photo-1481988535861-271139e06469?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1460627390041-532a28402358?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          ],
          captions: [
            <div>
              Simple Demo 1 (
              <a
                href="https://images.unsplash.com/photo-1481988535861-271139e06469?q=80&w=3580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
