import React, { useContext, useEffect, useRef, useState } from "react";

import { TopicMapContext, TopicMapContextProvider } from "../../contexts/TopicMapContextProvider";
import ProjSingleGeoJson from "../../XProjSingleGeoJson";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import { storiesCategory } from "./StoriesConf";
import { Button } from "react-bootstrap";
import { getBoundsForFeatureCollection } from "../../tools/gisHelper";
import { BroadcastChannel } from "broadcast-channel";

import "./customLeafletFullscreen.css";

import "./blurredPaths.css";

import { Layer, Projection } from "react-projection-mapping";
import Map from "./ProjectorMap";
import { printedModelBounds } from "./projectorHelper";
export default {
  title: storiesCategory + "TopicMapComponent",
};

export const printedModelBoundsWGS84 = [
  [51.270575, 7.185531],
  [51.2803, 7.213265],
];

export const ControllerView = () => {
  const App = () => {
    const { routedMapRef } = useContext(TopicMapContext);
    const [routedMap, setRoutedMap] = useState();
    const [toProjectorChannel, setToProjectorChannel] = useState();

    const [transformString, setTransformString] = useState("");

    useEffect(() => {
      if (toProjectorChannel) {
        toProjectorChannel.postMessage({
          type: "mapStyle",
          message: { transform: transformString },
        });
      }
    }, [transformString, toProjectorChannel]);

    useEffect(() => {
      console.log("xxx routedMapRef", routedMapRef);
      if (routedMapRef !== undefined) {
        setRoutedMap(routedMapRef);
      }
    }, [routedMapRef]);

    useEffect(() => {
      const toProjectorChannel = new BroadcastChannel("projector");
      setToProjectorChannel(toProjectorChannel);
    }, []);
    return (
      <>
        <TopicMapComponent
          gazData={[]}
          backgroundlayers="wupp-plan-live@100"
          mapStyle={{ height: "80vh" }}
          leafletMapProps={{
            zoomSnap: 1,
            zoomDelta: 1,
          }}
        >
          <ProjSingleGeoJson
            maskingPolygon="POLYGON((653674.603 5986240.643, 653674.603 7372844.430, 1672962.694 7372844.430, 1672962.694 5986240.643, 653674.603 5986240.643))"
            geoJson={printedModelBounds}
            masked={true}
            style={{
              zIndex: 99999990,
              color: "#ff0000",
              weight: 1,
              opacity: 1,
              fillColor: "#ff0000",
              fillOpacity: 0.2,
            }}
          />
        </TopicMapComponent>

        <div style={{ background: "lightgrey", width: "100%", height: "20vh", padding: 30 }}>
          {/* <ProjectorControlPanel
            transformStringChanged={(ts) => {
              setTransformString(ts);
            }}
          />
          <br></br> */}

          <Button
            onClick={() => {
              const optBounds = getBoundsForFeatureCollection(printedModelBounds);
              console.log("xxx getBounds", optBounds);
              console.log("xxx routedMap", routedMap.leafletMap.leafletElement);
              routedMap.leafletMap.leafletElement.fitBounds(optBounds);
            }}
          >
            zoomToFit (local)
          </Button>
          <Button
            onClick={() => {
              toProjectorChannel.postMessage({ type: "reload" });
            }}
          >
            reload
          </Button>
          <Button
            onClick={() => {
              toProjectorChannel.postMessage({ type: "deleteProjection" });
            }}
          >
            deleteStoredProjection
          </Button>
          <Button
            onClick={() => {
              toProjectorChannel.postMessage({ type: "calibrationCompleted" });
            }}
          >
            calibrationCompleted
          </Button>
          <Button
            onClick={() => {
              toProjectorChannel.postMessage({ type: "editCalibration" });
            }}
          >
            editCalibration
          </Button>
          <Button
            onClick={() => {
              toProjectorChannel.postMessage({ type: "startCalibration" });
            }}
          >
            startCalibration
          </Button>

          <Button
            onClick={() => {
              console.log("xxx toProjectorChanne", toProjectorChannel);

              toProjectorChannel.postMessage({ type: "zoomToFit" });
            }}
          >
            zoomToFit
          </Button>
          <Button
            onClick={() => {
              console.log("xxx toggleFullscreen", toProjectorChannel);

              toProjectorChannel.postMessage({ type: "toggleFullscreen" });
            }}
          >
            toggle Fullscreen
          </Button>
          <Button
            onClick={() => {
              console.log("xxx toProjectorChanne", toProjectorChannel);

              toProjectorChannel.postMessage({ type: "activeConfig", message: "calibrate0" });
            }}
          >
            Calibrate
          </Button>
          <Button
            onClick={() => {
              console.log("xxxx toProjectorChanne", toProjectorChannel);

              toProjectorChannel.postMessage({ type: "activeConfig", message: "start" });
            }}
          >
            1st Map
          </Button>
          <Button
            onClick={() => {
              console.log("xxxx toProjectorChanne", toProjectorChannel);

              toProjectorChannel.postMessage({ type: "activeConfig", message: "map2" });
            }}
          >
            2nd Map
          </Button>
          <Button
            onClick={() => {
              console.log("xxxx toProjectorChanne", toProjectorChannel);

              toProjectorChannel.postMessage({ type: "activeConfig", message: "experiments" });
            }}
          >
            Experiments
          </Button>
          <Button
            onClick={() => {
              console.log("xxxx toProjectorChanne", toProjectorChannel);

              toProjectorChannel.postMessage({ type: "activeConfig", message: "experiments2" });
            }}
          >
            Experiments 2
          </Button>
        </div>
        <br></br>
      </>
    );
  };

  return (
    <TopicMapContextProvider>
      <App />
    </TopicMapContextProvider>
  );
};

export const ProjectorView3857 = () => {
  const [windowsSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const { width, height } = windowsSize;
  const upperLeft = [0, 0];
  const upperRight = [width, 0];
  const lowerLeft = [0, height];
  const lowerRight = [width, height];

  // const tiles = createTiles(1, 2, width, height);
  const defaultProjectionConfData = {
    projectedMap: {
      corners: [...upperLeft, ...upperRight, ...lowerLeft, ...lowerRight],
    },
    // ...tiles,
  };
  console.log("xxx defaultData", defaultProjectionConfData);

  const [items, setItems] = useState();
  const [localStorageRead, setLocalStorageRead] = useState(false);

  const [configKey, setConfigKey] = useState("experiments2" || "calibrate0");
  const [dynamicMapStyle, setDynamicMapStyle] = useState({});
  // const [broadcastChannel, setBroadcastChannel] = useState();
  // const broadcastChannelRef = useRef();
  const [inCalibration, setInCalibration] = useState(false);
  const [projectionConfData, setProjectionConfData] = useState(defaultProjectionConfData);
  const [initialProjectionConfData, setinitialProjectionConfData] = useState(
    defaultProjectionConfData
  );

  const projectionConfDataRef = useRef();

  useEffect(() => {
    projectionConfDataRef.current = projectionConfData;
  }, [projectionConfData]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("projectionData"));
    if (data && data.projectedMap) {
      console.log("xxx initial loading of projectionData", data?.projectedMap.corners[0]);

      setProjectionConfData(data);
    }
    const mapStyle = JSON.parse(localStorage.getItem("projectionMapStyle"));
    if (mapStyle) {
      setDynamicMapStyle(mapStyle);
    }

    setTimeout(() => {
      setLocalStorageRead(true);
    }, 1000);
  }, []);

  // useEffect(() => {
  let broadcastChannel;
  if (!broadcastChannel) {
    broadcastChannel = new BroadcastChannel("projector");
  }
  if (!broadcastChannel.onmessage) {
    console.log("registering broadcastChannel.onmessage");

    broadcastChannel.onmessage = (event) => {
      console.log("xxx received event", event);

      const { message, type } = event;
      switch (type) {
        case "reload":
          window.location.reload(true);
          break;
        case "deleteProjection":
          console.log("xxx deleteProjection");
          localStorage.setItem("projectionMapStyle", "{}");
          localStorage.setItem("projectionData", "{}");

          window.location.reload(true);
          break;
        case "activeConfig":
          setConfigKey(message);
          break;
        case "mapStyle":
          setDynamicMapStyle(message);
          break;
        case "calibrationCompleted":
          const divElement = document.querySelector(".react-projection-mapping__distort");
          if (divElement) {
            const style = window.getComputedStyle(divElement);
            // console.log("xxx transformationStyle", style);

            const pms = {
              transform: style.transform,
              transformOrigin: style.transformOrigin,
              transformStyle: style.transformStyle,
              transformBox: style.transformBox,
              perspective: style.perspective,
              perspectiveOrigin: style.perspectiveOrigin,
            };
            localStorage.setItem("projectionMapStyle", JSON.stringify(pms));
            setDynamicMapStyle(pms);
            setInCalibration(false);
          }
          break;
        case "editCalibration":
          setConfigKey("calibrate0");
          setDynamicMapStyle({});
          setInCalibration(true);
          break;
        case "startCalibration":
          setConfigKey("calibrate0");
          console.log("xxxxx startCalibration");
          localStorage.setItem("projectionData", JSON.stringify(defaultProjectionConfData));
          localStorage.setItem("projectionMapStyle", "{}");
          setProjectionConfData(defaultProjectionConfData);
          setDynamicMapStyle({});
          setInCalibration(true);
          break;
        default:
          break;
      }
    };
  }
  console.log("xxxprojectionConfData", projectionConfData);

  if (localStorageRead) {
    return (
      <Projection
        style={{ backgroundColor: "black", zIndex: 999999999999999999 }}
        data={projectionConfData}
        onChange={(e) => {
          if (e.isEnd) {
            console.log("xxx store projectionData", e.layers);
            localStorage.setItem("projectionData", JSON.stringify(e.layers));
          }
        }}
        edit={inCalibration}
        enabled={inCalibration}
      >
        <TopicMapContextProvider>
          <Layer id="projectedMap">
            <Map {...{ broadcastChannel, configKey, dynamicMapStyle, inCalibration }} />
          </Layer>
        </TopicMapContextProvider>
      </Projection>
    );
  } else {
    return <div> </div>;
  }
};
