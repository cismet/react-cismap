import React, { useContext, useEffect, useRef, useState } from "react";

import { TopicMapContext, TopicMapContextProvider } from "../../contexts/TopicMapContextProvider";
import ProjSingleGeoJson from "../../XProjSingleGeoJson";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import { storiesCategory } from "./StoriesConf";
import CrossTabCommunicationContextProvider from "../../contexts/CrossTabCommunicationContextProvider";
import { Button } from "react-bootstrap";
import { getBoundsForFeatureCollection } from "../../tools/gisHelper";
import RoutedMap from "../../RoutedMap";
import { FeatureCollectionDisplay, MappingConstants, ProjGeoJson } from "../..";
import { ResponsiveTopicMapContext } from "../../contexts/ResponsiveTopicMapContextProvider";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import { BroadcastChannel } from "broadcast-channel";
import { VideoOverlay } from "react-leaflet";
import MapLibreLayer from "../../vector/MapLibreLayer";
import { kassenzeichen } from "../_data/Editing.Storybook.data";
import { rathaus } from "./ProjectorData";
import streets from "./layerstyles/streets.json";
import streets2 from "./layerstyles/streets2.json";
import buildings from "./layerstyles/buildings.json";
import "./customLeafletFullscreen.css";
import { addGlowingEffect, brightenHexColor, updateMapStyleColors } from "./layerstyles/helper";
export default {
  title: storiesCategory + "TopicMapComponent",
};

console.log("yyy", buildings);

export const printedModelBoundsWGS84 = [
  [51.270575, 7.185531],
  [51.2803, 7.213265],
];
export const printedModelBounds25832 = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    crs: { type: "name", properties: { name: "EPSG:25832" } },
    coordinates: [
      [
        [373425.964597719, 5681478.28104491],
        [373452.745943693, 5682561.895509946],
        [375386.872690145, 5682514.456227311],
        [375360.500876119, 5681430.838188204],
        [373425.964597719, 5681478.28104491],
      ],
    ],
  },
  crs: {
    type: "name",
    properties: {
      name: "EPSG:25832",
    },
  },
};

export const printedModelBounds = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    crs: { type: "name", properties: { name: "EPSG:3857" } },
    coordinates: [
      [
        [799889.651999282, 6669295.589044214],
        [799889.651999282, 6671029.681554463],
        [802976.986756942, 6671029.681554463],
        [802976.986756942, 6669295.589044214],
        [799889.651999282, 6669295.589044214],
      ],
    ],
  },
  crs: {
    type: "name",
    properties: {
      name: "EPSG:3857",
    },
  },
};
function createDividingLines(geojson, hSep, vSep) {
  const box = geojson.geometry.coordinates[0];
  const minX = box[0][0];
  const maxX = box[2][0];
  const minY = box[0][1];
  const maxY = box[2][1];

  const segmentWidth = (maxX - minX) / (vSep + 1);
  const segmentHeight = (maxY - minY) / (hSep + 1);

  let dividingLines = [];

  // Create vertical lines
  for (let i = 1; i <= vSep; i++) {
    let lineX = minX + i * segmentWidth;
    let lineCoordinates = [
      [lineX, minY],
      [lineX, maxY],
    ];

    dividingLines.push({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: lineCoordinates,
      },
    });
  }

  // Create horizontal lines
  for (let j = 1; j <= hSep; j++) {
    let lineY = minY + j * segmentHeight;
    let lineCoordinates = [
      [minX, lineY],
      [maxX, lineY],
    ];

    dividingLines.push({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: lineCoordinates,
      },
    });
  }

  return dividingLines;
}
const calibrationObjects = [];
calibrationObjects.push(printedModelBounds, ...createDividingLines(printedModelBounds, 1, 3));

export const ControllerView = () => {
  const App = () => {
    const { routedMapRef } = useContext(TopicMapContext);
    const [routedMap, setRoutedMap] = useState();
    const [toProjectorChannel, setToProjectorChannel] = useState();
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
              console.log("xxx toProjectorChanne", toProjectorChannel);

              toProjectorChannel.postMessage({ type: "zoomToFit" });
            }}
          >
            zoomToFit (remote)
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
  const Map = () => {
    let fullScreenChange;

    const { routedMapRef } = useContext(TopicMapContext);

    const [configKey, setConfigKey] = useState("calibrate0");
    const [dynamicMapStyle, setDynamicMapStyle] = useState({});
    const [isFullScreen, setIsFullScreen] = useState(false);
    const routedMapLocalRef = useRef();
    const [starter, setStarter] = useState(false);
    const zoomToFit = () => {
      const optBounds = getBoundsForFeatureCollection(printedModelBounds);
      const map = routedMapLocalRef.current.leafletMap.leafletElement;
      console.log("xxx routedMapRef", routedMapLocalRef.current);

      map.fitBounds(optBounds);
    };

    const maskWithBorder = (borderColor = "red") => (
      <ProjSingleGeoJson
        maskingPolygon="POLYGON((653674.603 5986240.643, 653674.603 7372844.430, 1672962.694 7372844.430, 1672962.694 5986240.643, 653674.603 5986240.643))"
        geoJson={printedModelBounds}
        masked={true}
        style={() => {
          return {
            zIndex: 99999990,
            color: borderColor,
            weight: 1,
            opacity: 1,
            fillColor: "black",
            fillOpacity: 1,
          };
        }}
      />
    );
    useEffect(() => {
      const channel = new BroadcastChannel("projector");
      console.log("xxx created channel", channel);

      channel.onmessage = (event) => {
        const { message, type } = event;
        console.log("xxx received event", event);

        if (routedMapLocalRef.current !== undefined) {
          zoomToFit();
          const map = routedMapLocalRef.current.leafletMap.leafletElement;
          switch (type) {
            case "zoomToFit":
              zoomToFit();
              break;
            case "activeConfig":
              setConfigKey(message);
              break;
            case "mapStyle":
              setDynamicMapStyle(message);
              break;
            case "toggleFullscreen":
              console.log("xxx toggleFullscreen", map);
              map.toggleFullscreen();
              // const elem = document.documentElement;
              // if (elem.requestFullscreen) {
              //   elem.requestFullscreen();
              // } else if (elem.webkitRequestFullscreen) {
              //   /* Safari */
              //   elem.webkitRequestFullscreen();
              // } else if (elem.msRequestFullscreen) {
              //   /* IE11 */
              //   elem.msRequestFullscreen();
              // }

              // if (routedMapLocalRef.current !== undefined) {
              //   const map = routedMapLocalRef.current.leafletMap.leafletElement;
              //   console.log("xxx map", map);

              //   map.toggleFullscreen();
              // }

              break;
            default:
              break;
          }
        }
      };
    }, [routedMapLocalRef]);

    useEffect(() => {
      if (routedMapRef !== undefined) {
        routedMapLocalRef.current = routedMapRef;
        zoomToFit();
        const map = routedMapRef.leafletMap.leafletElement;

        map.on("resize", () => {
          zoomToFit();
        });

        //fullscreen detection

        if ("onfullscreenchange" in window.document) {
          fullScreenChange = "fullscreenchange";
        } else if ("onmozfullscreenchange" in window.document) {
          fullScreenChange = "mozfullscreenchange";
        } else if ("onwebkitfullscreenchange" in window.document) {
          fullScreenChange = "webkitfullscreenchange";
        } else if ("onmsfullscreenchange" in window.document) {
          fullScreenChange = "MSFullscreenChange";
        }

        function onFullscreenChange() {
          setIsFullScreen(map?.isFullscreen() || false);
        }

        window.document.addEventListener(fullScreenChange, onFullscreenChange);
      }
    }, [routedMapRef]);

    useEffect(() => {
      if (routedMapRef !== undefined) {
        const map = routedMapRef.leafletMap.leafletElement;
        map.doubleClickZoom.disable();

        if (isFullScreen) {
          map.dragging.disable();
          map.touchZoom.disable();
          map.scrollWheelZoom.disable();
          map.boxZoom.disable();
          map.keyboard.disable();
          if (map.tap) map.tap.disable();
        } else {
          map.dragging.enable();
          map.touchZoom.enable();
          map.scrollWheelZoom.enable();
          map.boxZoom.enable();
          map.keyboard.enable();
          if (map.tap) map.tap.enable();
        }
      }
    }, [isFullScreen, routedMapRef]);

    console.log("xxx is Fullscreen", isFullScreen);

    const configs = {
      start: {
        layers: (
          <>
            <StyledWMSTileLayer
              {...{
                type: "wmts",
                url: "https://geodaten.metropoleruhr.de/spw2/service",
                layers: "spw2_light_grundriss",
                version: "1.3.0",
                tileSize: 256,
                transparent: true,
              }}
            ></StyledWMSTileLayer>
            {maskWithBorder("black")}
          </>
        ),
        overridingMapStyle: { backgroundColor: undefined },
      },
      calibrate0: {
        layers: (
          <>
            <ProjGeoJson
              featureCollection={calibrationObjects}
              style={() => {
                return {
                  color: "red",
                  fillColor: "#ffffff00",
                  weight: 1,
                };
              }}
            />
          </>
        ),
        overridingMapStyle: { backgroundColor: "#000000" },
      },

      map2: {
        layers: (
          <>
            {/* <StyledWMSTileLayer
              {...{
                type: "wmts",
                url: "https://geodaten.metropoleruhr.de/spw2/service",
                layers: "spw2_light_grundriss",
                version: "1.3.0",
                tileSize: 256,
                transparent: true,
              }}
            ></StyledWMSTileLayer> */}
            {maskWithBorder("black")}
            {/* <VideoOverlay
              opacity={0.6}
              bounds={printedModelBoundsWGS84}
              play={starter}
              loop={false}
              url="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
            /> */}
            <MapLibreLayer
              keyIn={"sdf"}
              style="https://omt.map-hosting.de/styles/klokantech-basic/style.json"
              opacity={1}

              // cssFilter={options["css-filter"]}
            />
          </>
        ),
        overridingMapStyle: { backgroundColor: undefined },
      },
      experiments: {
        layers: (
          <>
            {/* <StyledWMSTileLayer
              {...{
                type: "wmts",
                url: "https://geodaten.metropoleruhr.de/spw2/service",
                layers: "spw2_light_grundriss",
                version: "1.3.0",
                tileSize: 256,
                transparent: true,
                opacity: 1,
                pane: "additionalLayers0",
                maxZoom: 26,
              }}
            ></StyledWMSTileLayer> */}
            {/* <StyledWMSTileLayer
              {...{
                type: "wms",
                url: "https://maps.wuppertal.de/deegree/wms",
                layers: "R102:trueortho2022",
                tileSize: 256,
                transparent: true,
                opacity: 0.1,
                pane: "backgroundLayers",
                maxZoom: 26,
                format: "image/png",
                srs: "3857",
              }}
            ></StyledWMSTileLayer> */}
            {maskWithBorder("black")}
            {/* <VideoOverlay
              opacity={0.6}
              bounds={printedModelBoundsWGS84}
              play={starter}
              loop={false}
              url="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
            /> */}
            {/* <MapLibreLayer
              keyIn={"sdf"}
              style="https://omt.map-hosting.de/styles/klokantech-basic/style.json"
              _style="https://omt.map-hosting.de/styles/glow/style.json"
              opacity={1}
              pane="backgroundvectorLayers"

              // cssFilter={options["css-filter"]}
              />*/}
            {/* <MapLibreLayer
              keyIn={"sdf"}
              style={updateMapStyleColors(streets, ["#F90050"])}
              opacity={1}
              pane="additionalLayers0"

              // cssFilter={options["css-filter"]}
            /> */}
            <MapLibreLayer
              keyIn={"sdf"}
              _style={streets2} //updateMapStyleColors(buildings, ["#F90050"])}
              style={addGlowingEffect(
                updateMapStyleColors(streets2, ["#F90050"]),
                (c) => brightenHexColor(c, -50),
                3
              )}
              // style={buildings} //updateMapStyleColors(buildings, ["#F90050"])}
              // style={updateMapStyleColors(buildings, ["#DF19FB"])}
              opacity={1}
              pane="additionalLayers0"

              // cssFilter={options["css-filter"]}
            />
            {/* <FeatureCollectionDisplay featureCollection={kassenzeichen} /> */}
            {/* <ProjGeoJson featureCollection={kassenzeichen} /> */}
            <ProjSingleGeoJson
              geoJson={rathaus}
              style={() => {
                return {
                  color: "red",
                  fillColor: "#ffffff00",
                  weight: 1,
                };
              }}
            />
          </>
        ),
        overridingMapStyle: { backgroundColor: "black" },
      },
      experiments2: {
        layers: (
          <>
            {/* <StyledWMSTileLayer
              {...{
                type: "wmts",
                url: "https://geodaten.metropoleruhr.de/spw2/service",
                layers: "spw2_light_grundriss",
                version: "1.3.0",
                tileSize: 256,
                transparent: true,
                opacity: 1,
                pane: "additionalLayers0",
                maxZoom: 26,
              }}
            ></StyledWMSTileLayer> */}
            {maskWithBorder("black")}
            {/* <VideoOverlay
              opacity={0.6}
              bounds={printedModelBoundsWGS84}
              play={starter}
              loop={false}
              url="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
            /> */}
            <MapLibreLayer
              keyIn={"sdddf"}
              style="https://omt.map-hosting.de/styles/klokantech-basic/style.json"
              _style="https://omt.map-hosting.de/styles/glow/style.json"
              opacity={1}
              pane="backgroundvectorLayers"

              // cssFilter={options["css-filter"]}
            />
            {/* <FeatureCollectionDisplay featureCollection={kassenzeichen} /> */}
            {/* <ProjGeoJson featureCollection={kassenzeichen} /> */}
            <ProjSingleGeoJson
              geoJson={rathaus}
              style={() => {
                return {
                  color: "red",
                  fillColor: "#ffffff00",
                  weight: 1,
                };
              }}
            />
          </>
        ),
        overridingMapStyle: { backgroundColor: undefined },
      },
    };

    return (
      <>
        <TopicMapComponent
          key={"TopicMapComponent." + configKey}
          mapStyle={{
            ...dynamicMapStyle,
            ...configs[configKey]?.overridingMapStyle,
            // transform: "perspective(1500px) rotateX(-6deg) skewY(-2deg) skewX(-2deg)",
            //transform:
            //"perspective(1600px) rotateX(0deg) rotateY(5deg) rotateZ(0deg) skewX(0deg) skewY(0deg) scaleX(1.02) scaleY(1.02) translateX(-10px) translateY(5px)",
            //"perspective(1500px) rotateX(5deg) rotateY(10deg) rotateZ(-2deg) skewX(5deg) skewY(0deg) scaleX(0.98) scaleY(0.98) translateX(20px) translateY(-10px)",
          }} //perspective(0px) rotateX(0deg) perspective(10px) rotateX(-1deg)
          gazData={[]}
          backgroundlayers="none"
          outerLocationChangedHandlerExclusive={true}
          locationChangedHandler={() => {}}
          {...{
            hamburgerMenu: false,
            zoomControls: false,
            gazetteerSearchControl: false,
            fullScreenControl: true,
            locatorControl: false,
            infoBox: undefined,
          }}
          leafletMapProps={{
            zoomSnap: 0.5,
            zoomDelta: 0.5,
          }}
          ondblclick={() => {
            console.log("xxx dblclick");
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
              elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
              /* Safari */
              elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
              /* IE11 */
              elem.msRequestFullscreen();
            }
          }}
        >
          {configs[configKey]?.layers}
        </TopicMapComponent>
      </>
    );
  };

  return (
    <TopicMapContextProvider>
      <Map />
    </TopicMapContextProvider>
  );
};
