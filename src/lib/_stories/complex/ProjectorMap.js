import React, { useContext, useEffect, useRef, useState } from "react";

import { TopicMapContext } from "../../contexts/TopicMapContextProvider";
import ProjSingleGeoJson from "../../XProjSingleGeoJson";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import { getBoundsForFeatureCollection } from "../../tools/gisHelper";
import { FeatureCollectionDisplay, ProjGeoJson } from "../..";
import { useWindowSize } from "../../contexts/ResponsiveTopicMapContextProvider";
import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import MapLibreLayer from "../../vector/MapLibreLayer";
import { rathaus } from "./ProjectorData";
import "./customLeafletFullscreen.css";
// import streetMask from "./streetMask.json";
// import roofMask from "./roofMask.json";
// import lights from "./lights.json";
import "./blurredPaths.css";
import L from "leaflet";
import { Layer, useProjection } from "react-projection-mapping";
import {
  createDividingLines,
  printedModelBounds,
  printedModelBounds25832,
} from "./projectorHelper";
import Controller from "./ProjectionMappingController";
import { md5FetchJSON } from "../../tools/fetching";

const Map = ({ broadcastChannel, configKey, dynamicMapStyle, inCalibration }) => {
  let fullScreenChange;

  const { routedMapRef } = useContext(TopicMapContext);
  const [streetMask, setStreetMask] = useState();
  const [roofMask, setRoofMask] = useState();
  const [lights, setLights] = useState();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const routedMapLocalRef = useRef();
  const [starter, setStarter] = useState(false);

  const [modelBoundsInPixel, setModelBoundsInPixel] = useState();

  const [width, height] = useWindowSize();

  const zoomToFit = () => {
    const optBounds = getBoundsForFeatureCollection(printedModelBounds);
    const map = routedMapLocalRef?.current?.leafletMap?.leafletElement;
    console.log("xxx routedMapRef", routedMapLocalRef?.current);
    if (map) {
      map.fitBounds(optBounds);
    }
  };

  const calibrationObjects = [];
  calibrationObjects.push(
    printedModelBounds25832,
    ...createDividingLines(printedModelBounds, 1, 3)
  );

  useEffect(() => {
    const streetMask = md5FetchJSON("demo.streetMask", "./data/demo/streetMask.json");
    const roofMask = md5FetchJSON("demo.roofMask", "./data/demo/roofMask.json");
    const lights = md5FetchJSON("demo.lights", "./data/demo/lights.json");
    Promise.all([streetMask, roofMask, lights]).then((values) => {
      setStreetMask(values[0]);
      setRoofMask(values[1]);
      setLights(values[2]);
    });
  }, []);

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

  // Helper function to convert your coordinates to LatLng
  const toLatLng = (x, y) => {
    return L.CRS.EPSG3857.unproject(L.point(x, y));
  };

  // Function to get screen coordinates
  const getScreenCoordinates = (map, coordinates) => {
    return coordinates.map((point) => {
      const latLng = toLatLng(point[0], point[1]);
      return map.latLngToContainerPoint(latLng);
    });
  };

  useEffect(() => {
    if (broadcastChannel !== undefined) {
      console.log("xxx  broadcastChannel in <Map>", broadcastChannel);

      broadcastChannel.onmessage = (event) => {
        const { message, type } = event;

        if (routedMapLocalRef.current !== undefined) {
          switch (type) {
            case "zoomToFit":
              zoomToFit();
              break;

            default:
              break;
          }
        }
      };
    }
  }, [broadcastChannel]);

  useEffect(() => {
    if (routedMapRef !== undefined) {
      routedMapLocalRef.current = routedMapRef;
      zoomToFit();
      const map = routedMapRef?.leafletMap?.leafletElement;
      console.log("xxx map.isFullscreen()", map?.isFullscreen());

      if (map) {
        map.on("re    size", () => {
          zoomToFit();
        });
      }
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
    if (routedMapRef !== undefined && routedMapRef.leafletMap) {
      console.log("xxx routedMapRef", routedMapRef);

      const map = routedMapRef.leafletMap.leafletElement;
      map.doubleClickZoom.disable();

      // if (isFullScreen) {
      //   setTimeout(() => {
      map.dragging.disable();
      map.touchZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      //     if (map.tap) map.tap.disable();
      //   }, 1000);
      // } else {
      //   map.dragging.enable();
      //   map.touchZoom.enable();
      //   map.scrollWheelZoom.enable();
      //   map.boxZoom.enable();
      //   map.keyboard.enable();
      //   if (map.tap) map.tap.enable();
      // }
    }
  }, [isFullScreen, routedMapRef]);

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
            // onclick={(e) => {
            //   console.log("xxx clicked", e);
            // }}
          />

          {/*   */}
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
          {/* <MapLibreLayer
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
            /> */}
          {/* <FeatureCollectionDisplay featureCollection={kassenzeichen} /> */}
          {/* <ProjGeoJson featureCollection={kassenzeichen} /> */}
          {/* <ProjSingleGeoJson
              geoJson={rathaus}
              style={() => {
                return {
                  color: "red",
                  fillColor: "#ffffff00",
                  weight: 8,
                  className: "cismapBlurry",
                };
              }}
            />{" "}
            <ProjSingleGeoJson
              geoJson={rathaus}
              style={() => {
                return {
                  color: "red",
                  fillColor: "#ffffff00",
                  weight: 1,
                };
              }}
            /> */}
          {/* <VFXFeatureCollectionDisplay
              featureCollection={kassenzeichen}
              style={() => {
                return {
                  color: "red",
                  fillColor: "#ffffff00",
                  weight: 1,
                };
              }}
            /> */}

          {/* <ProjSingleGeoJson
              maskingPolygon="POLYGON((653674.603 5986240.643, 653674.603 7372844.430, 1672962.694 7372844.430, 1672962.694 5986240.643, 653674.603 5986240.643))"
              geoJson={printedModelBounds}
              masked={false}
              style={() => {
                return {
                  _zIndex: 99999990,
                  color: "black",
                  weight: 100,
                  opacity: 1,
                  fillColor: "black",
                  fillOpacity: 0.085,
                };
              }}
            /> */}
          {/* <VFXFeatureCollectionDisplay
              featureCollection={lights.features}
              animationDuration={1000}
              style={() => {
                return {
                  color: "#00000000",
                  fillColor: "white",
                  fillOpacity: 1,
                };
              }}
            /> */}
          {/* <VFXAnimated
              animate={(percentage) => {
                return (
                  <FeatureCollectionDisplay
                    featureCollection={lights}
                    style={() => {
                      return {
                        color: "#00000000",
                        fillColor: "white",
                        fillOpacity: percentage,
                      };
                    }}
                  />
                );
              }}
            /> */}
          <FeatureCollectionDisplay
            featureCollection={lights}
            style={() => {
              return {
                color: "#00000000",
                fillColor: "white",
                fillOpacity: 1,
              };
            }}
          />
          {/* <VFXAnimated
              animationDuration={4000}
              animate={(percentage) => {
                return (
                  <StyledWMSTileLayer
                    {...{
                      type: "wms",
                      url: "https://maps.wuppertal.de/deegree/wms",
                      layers: "R102:trueortho2022",
                      tileSize: 256,
                      transparent: true,
                      opacity: percentage,
                      pane: "backgroundLayers",
                      maxZoom: 26,
                      format: "image/png",
                      // _cssFilter: "filter:brightness(0.11)",
                      // _cssFilter:
                      //   "filter:brightness(0.3)contrast(0.9)hue-rotate(200deg) sepia(20%) saturate(80%)",
                      // _cssFilter: "filter:brightness(20%) contrast(90%) sepia(10%) saturate(70%)",
                      onLoad: () => {
                        console.log("xxx loaded");
                      },
                    }}
                  ></StyledWMSTileLayer>
                );
              }}
            /> */}
          <StyledWMSTileLayer
            {...{
              type: "wms",
              url: "https://maps.wuppertal.de/deegree/wms",
              layers: "R102:trueortho2022",
              tileSize: 256,
              transparent: true,
              opacity: 1,
              pane: "backgroundLayers",
              maxZoom: 26,
              format: "image/png",
              // _cssFilter: "filter:brightness(0.11)",
              cssFilter:
                "filter:brightness(0.3)contrast(0.9)hue-rotate(200deg) sepia(20%) saturate(80%)",
              // _cssFilter: "filter:brightness(20%) contrast(90%) sepia(10%) saturate(70%)",
              onLoad: () => {
                console.log("xxx true ortho loaded");
              },
            }}
          />
          {/* <StyledWMSTileLayer
              {...{
                onLoad: () => {
                  console.log("xxx loaded");
                },
                type: "wmts",
                url: " https://www.wms.nrw.de/geobasis/wms_nw_dop",
                layers: "nw_dop_rgb",
                version: "1.3.0",
                tiled: true,
                transparent: true,
              }}
            ></StyledWMSTileLayer> */}

          {maskWithBorder("black")}
        </>
      ),
      overridingMapStyle: { backgroundColor: "black" },
    },
    streetsOnly: {
      layers: (
        <>
          <FeatureCollectionDisplay
            featureCollection={streetMask}
            style={() => {
              return {
                color: "#00000000",
                fillColor: "black",
                fillOpacity: 1,
              };
            }}
          />
          <StyledWMSTileLayer
            {...{
              type: "wms",
              url: "https://maps.wuppertal.de/deegree/wms",
              layers: "R102:trueortho2022",
              tileSize: 256,
              transparent: true,
              opacity: 1,
              pane: "backgroundLayers",
              maxZoom: 26,
              format: "image/png",
              srs: "3857",
            }}
          ></StyledWMSTileLayer>
        </>
      ),
    },
    roofsOnly: {
      layers: (
        <>
          <FeatureCollectionDisplay
            featureCollection={roofMask}
            style={() => {
              return {
                color: "#00000000",
                fillColor: "black",
                fillOpacity: 1,
              };
            }}
          />
          <StyledWMSTileLayer
            {...{
              type: "wms",
              url: "https://maps.wuppertal.de/deegree/wms",
              layers: "R102:trueortho2022",
              tileSize: 256,
              transparent: true,
              opacity: 1,
              pane: "backgroundLayers",
              maxZoom: 26,
              format: "image/png",
              srs: "3857",
            }}
          ></StyledWMSTileLayer>
        </>
      ),
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
  console.log("xxx dynamicMapStyle", dynamicMapStyle);

  return (
    <div>
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
          zoomSnap: 0.1,
          zoomDelta: 0.1,
        }}
        ondblclick={() => {
          console.log("xxx dblclick");
          const elem = document.documentElement;
          if (elem.requestFullscreen) {
            elem.requestFullscreen();
          } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
          } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
          }
        }}
      >
        {configs[configKey]?.layers}
      </TopicMapComponent>
      {inCalibration && <Controller {...{ width, height }} />}
      {/* <Controller {...{ width, height }} /> */}
    </div>
  );
};

export default Map;
