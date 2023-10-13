import L from "leaflet";
import md5 from "md5";
import proj4 from "proj4";
import PropTypes from "prop-types";
import React from "react";
import { Map, ZoomControl } from "react-leaflet";
//see https://github.com/makinacorpus/Leaflet.GeometryUtil/issues/59
import { reproject } from "reproject";

import * as MappingConstants from "./constants/gis";
import { projectionData } from "./constants/gis";
import FullscreenControl from "./FullscreenControl";
import LocateControl from "./LocateControl";
import NewWindowControl from "./NewWindowControl";
import { getInternetExplorerVersion } from "./tools/browserHelper";
import getLayersByNames from "./tools/layerFactory";
import { overrideClosestFromGeometryUtils } from "./tools/leaflet-geometryutil-workaround";

import "@fortawesome/fontawesome-free/js/all.js";
import "leaflet-editable";
import "leaflet-extra-markers/";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-geometryutil";
import "leaflet-snap";
import "leaflet.path.drag";
import "proj4leaflet";
import "url-search-params-polyfill";

import {
  CrossTabCommunicationContext,
  CrossTabCommunicationDispatchContext,
  TYPES,
} from "./contexts/CrossTabCommunicationContextProvider";
const CROSSTABCOMMUNICATION_SCOPE = "RoutedMap";

// Helper function to throttle events
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export class RoutedMap extends React.Component {
  constructor(props) {
    super(props);
    this.featureClick = this.featureClick.bind(this);
    this.storeBoundingBox = this.storeBoundingBox.bind(this);
    this.getBoundingBoxForLeafletMap = this.getBoundingBoxForLeafletMap.bind(this);
  }

  // add a handler for detecting map changes
  componentDidMount() {
    const leafletMap = this.leafletMap;
    // this.leafletMap.editable = true;
    overrideClosestFromGeometryUtils();

    const map = leafletMap.leafletElement;

    // when the window is resized very fast (easiest reproducibe via a os function e.g. full size view),
    // the map does not resize correctly
    // this is a workaround for this issue
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    });
    resizeObserver.observe(document.body);
    // -end workaround

    // <Pane name="backgroundvectorLayers" style={{ zIndex: 90 }}></Pane>
    // <Pane name="backgroundLayers" style={{ zIndex: 100 }} />
    // <Pane name="additionalLayers" style={{ zIndex: 150 }} />
    // <Pane name="backgroundlayerTooltips" style={{ zIndex: 250 }} />
    // <Pane name="featurecollection" style={{ zIndex: 600 }} />

    map.createPane("backgroundvectorLayers");
    map.getPane("backgroundvectorLayers").style.zIndex = 90;

    map.createPane("backgroundLayers");
    map.getPane("backgroundLayers").style.zIndex = 100;

    map.createPane("additionalLayers0");
    map.getPane("additionalLayers0").style.zIndex = 250;
    map.createPane("additionalLayers1");
    map.getPane("additionalLayers1").style.zIndex = 250;
    map.createPane("additionalLayers2");
    map.getPane("additionalLayers2").style.zIndex = 250;
    map.createPane("additionalLayers3");
    map.getPane("additionalLayers3").style.zIndex = 250;
    map.createPane("additionalLayers4");
    map.getPane("additionalLayers4").style.zIndex = 250;
    map.createPane("backgroundlayerTooltips");
    map.getPane("backgroundlayerTooltips").style.zIndex = 550;

    map.editable = this.props.editable;

    // leader Follower Stuff
    // check whether the map is a leader or follwer
    // this is done by checking whether thhere is a queryparam leader or follower is set
    // the payload of the param will be the channel name with a "leader" or "follower" prefix

    setTimeout(() => {
      let leader = this.crossTabCommunicationContext?.type === TYPES.LEADER;
      let follower = this.crossTabCommunicationContext?.type === TYPES.FOLLOWER;
      const sync = this.crossTabCommunicationContext?.type === TYPES.SYNC;
      if (sync) {
        leader = true;
        follower = true;
      }
      // console.log("xxx leaderOrFollower", { leader, follower }, this.crossTabCommunicationContext);
      // console.log("xxx 2nd this.contextSet", this.contextSet);
      const crossTabCommunicationDispatch = this.crossTabCommunicationDispatchContext;
      if (leader) {
        // this is a leader
        // do stuff for leader
        // create a channel for the leader
        // crossTabCommunicationDispatch.scopedMessage(CROSSTABCOMMUNICATION_SCOPE, {
        //   type: "mapState",
        //   mapState: { zoom: map.getZoom(), center: map.getCenter() },
        // });
        // listen to changes of the map state

        //make it a real leader with storing the id of the leader and sending it to the followers
        //on mouseover will even fire when the map is not the active window
        //this is needed beacause of the mousewheel zoom that can be aplied to the map when the window is inactive
        map.on("mouseover", (e) => {
          this.leaderMap = this.crossTabCommunicationContext.id;
          crossTabCommunicationDispatch.setIsDynamicLeader(true);
          //send the good news to the world
          crossTabCommunicationDispatch.scopedMessage(CROSSTABCOMMUNICATION_SCOPE, {
            type: "leaderMap",
            id: this.crossTabCommunicationContext.id,
          });
        });

        map.on(
          "move",
          // only fire 4 events per second
          throttle((e) => {
            // only send the message if the map is the leader
            if (this.leaderMap === this.crossTabCommunicationContext.id) {
              crossTabCommunicationDispatch.scopedMessage(CROSSTABCOMMUNICATION_SCOPE, {
                type: "mapState",
                source: "move",
                mapState: { zoom: map.getZoom(), center: map.getCenter() },
              });
            }
          }, 250)
        );
        map.on("zoom", (e) => {
          // only send the message if the map is the leader
          if (this.leaderMap === this.crossTabCommunicationContext.id) {
            crossTabCommunicationDispatch.scopedMessage(CROSSTABCOMMUNICATION_SCOPE, {
              type: "mapState",
              source: "zoom",
              mapState: { zoom: map.getZoom(), center: map.getCenter() },
            });
          }
        });

        map.on("moveend", (e) => {
          // only send the message if the map is the leader
          if (this.leaderMap === this.crossTabCommunicationContext.id) {
            crossTabCommunicationDispatch.scopedMessage(CROSSTABCOMMUNICATION_SCOPE, {
              type: "mapState",
              source: "moveend",

              mapState: { zoom: map.getZoom(), center: map.getCenter() },
            });
          }
        });
        map.on("resize", (e) => {
          // only send the message if the map is the leader
          if (this.leaderMap === this.crossTabCommunicationContext.id) {
            crossTabCommunicationDispatch.scopedMessage(CROSSTABCOMMUNICATION_SCOPE, {
              type: "mapState",
              source: "resize",
              mapState: { zoom: map.getZoom(), center: map.getCenter() },
            });
          }
        });
      }
      if (follower) {
        // this is a follower

        crossTabCommunicationDispatch.follow(CROSSTABCOMMUNICATION_SCOPE, (data) => {
          switch (data.type) {
            case "mapState":
              switch (data.source) {
                case "move":
                case "zoom":
                  //setting the view without adjusting the url params
                  map.setView(data.mapState.center, data.mapState.zoom, { duration: 1 });
                  break;
                case "moveend":
                  //setting the view and adjusting the url params
                  map.setView(data.mapState.center, data.mapState.zoom, { duration: 1 });
                  generalMoveendHandler(true);
                  break;
                case "resize":
                  break;

                default:
                  break;
              }
              break;
            case "leaderMap":
              this.leaderMap = data.id;
              if (this.leaderMap !== this.crossTabCommunicationContext.id) {
                crossTabCommunicationDispatch.setIsDynamicLeader(false);
              }

              break;
          }
        });

        // this happens only once when a follower

        //todo: check if i can call this when in sync mode
        setTimeout(() => {
          crossTabCommunicationDispatch.sendFeedback(CROSSTABCOMMUNICATION_SCOPE, {
            type: "bounds",
            bounds: map.getBounds(),
          });
        }, 100);
        //here we will send the bounds of the map back to display it in the leader map
        map.on("resize move zoom moveend", (e) => {
          crossTabCommunicationDispatch.sendFeedback(CROSSTABCOMMUNICATION_SCOPE, {
            type: "bounds",
            bounds: e.target.getBounds(),
          });
        });
      }
    }, 10);

    const generalMoveendHandler = (forced) => {
      if (
        typeof leafletMap !== "undefined" &&
        leafletMap !== null &&
        leafletMap.leafletElement !== undefined &&
        leafletMap.leafletElement !== null
      ) {
        if ((this.leaderMap === this.crossTabCommunicationContext.id) === true || forced === true) {
          try {
            const zoom = leafletMap.leafletElement.getZoom();
            const center = leafletMap.leafletElement.getCenter();
            const latFromUrl = parseFloat(this.props.urlSearchParams.get("lat"));
            const lngFromUrl = parseFloat(this.props.urlSearchParams.get("lng"));
            let zoomFromUrl;
            if (leafletMap.leafletElement.options.zoomSnap === 1) {
              zoomFromUrl = parseInt(this.props.urlSearchParams.get("zoom"), 10);
            } else {
              zoomFromUrl = parseFloat(this.props.urlSearchParams.get("zoom"));
            }

            let lat = center.lat;
            let lng = center.lng;
            if (Math.abs(latFromUrl - center.lat) < 0.000001) {
              lat = latFromUrl;
            }
            if (Math.abs(lngFromUrl - center.lng) < 0.000001) {
              lng = lngFromUrl;
            }

            if (lng !== lngFromUrl || lat !== latFromUrl || zoomFromUrl !== zoom) {
              this.props.locationChangedHandler({
                lat: lat,
                lng: lng,
                zoom: zoom,
              });
            }
            this.storeBoundingBox(leafletMap);
          } catch (e) {}
        }
      } else {
        console.warn("leafletMap ref is null. this could lead to update problems. ");
      }
    };

    //Do stuff after panning is over
    map.on("moveend", () => {
      generalMoveendHandler();
    });

    if (map.editable === true) {
      if (map.editTools.mode === undefined) {
        map.editTools.mode = {
          name: undefined,
          locked: false,
          callback: null,
        };
      }

      //Do stuff for snapping
      // console.log('this.props.snappingEnabled', this.props.snappingEnabled);

      this.snap = new L.Handler.MarkerSnap(map);
      const snap = this.snap;
      var snapMarker = L.marker(map.getCenter(), {
        icon: map.editTools.createVertexIcon({
          className: "leaflet-div-icon leaflet-drawing-icon",
        }),
        opacity: 1,
        zIndexOffset: 1000,
      });
      snap.watchMarker(snapMarker);
      map.mysnap = snap;
      const that = this;

      //Snapping
      map.on("editable:dragstart", function (e) {
        if (that.props.snappingEnabled && e.layer.feature.geometry.type === "Point") {
          //remove the the layer from the guides if it is in there
          // no need to add it, because of the conversion ot a feature after editing

          const hitIndex = snap._guides.indexOf(e.layer);
          if (hitIndex !== -1) {
            snap._guides.splice(hitIndex, 1);
          }

          //snapMarker.addTo(map);
          snap.watchMarker(e.layer);
        }
      });
      map.on("editable:drag", function (e) {
        if (that.props.snappingEnabled && e.layer.feature.geometry.type === "Point") {
          snapMarker.setLatLng(e.latlng);
        }
      });

      map.on("editable:dragend", function (e) {
        if (that.props.snappingEnabled && e.layer.feature.geometry.type === "Point") {
          snap.unwatchMarker(e.layer);
          snapMarker.remove();

          //
          //need to add it here again if it would not be converted to a feature
          // snap.addGuideLayer(e.layer);
        }
      });

      map.on("editable:vertex:dragstart", function (e) {
        if (that.props.snappingEnabled) {
          //remove the the layer from the guides if it is in there
          // no need to add it, because of the conversion ot a feature after editing
          const hitIndex = snap._guides.indexOf(e.layer);
          if (hitIndex !== -1) {
            snap._guides.splice(hitIndex, 1);
          }
          console.log("snap.watchMarker(e.vertex)", e);

          snap.watchMarker(e.vertex);
        }
      });
      map.on("editable:vertex:dragend", function (e) {
        if (that.props.snappingEnabled) {
          snap.unwatchMarker(e.vertex);
          // need to add it here again if it would not be converted to a feature
          // snap.addGuideLayer(e.layer);
        }
      });
      map.on("editable:drawing:start", function () {
        if (that.props.snappingEnabled) {
          this.on("mousemove", followMouse);
        }
      });
      map.on("editable:drawing:end", function () {
        if (that.props.snappingEnabled) {
          this.off("mousemove", followMouse);
          snapMarker.remove();
        }
        console.log("map.editTools.mode", map.editTools.mode);
      });
      map.on("editable:drawing:click", function (e) {
        if (that.props.snappingEnabled) {
          // Leaflet copy event data to another object when firing,
          // so the event object we have here is not the one fired by
          // Leaflet.Editable; it's not a deep copy though, so we can change
          // the other objects that have a reference here.
          var latlng = snapMarker.getLatLng();
          e.latlng.lat = latlng.lat;
          e.latlng.lng = latlng.lng;
        }
      });
      snapMarker.on("snap", function (e) {
        if (that.props.snappingEnabled) {
          snapMarker.addTo(map);
        }
      });
      snapMarker.on("unsnap", function (e) {
        if (that.props.snappingEnabled) {
          snapMarker.remove();
        }
      });
      var followMouse = function (e) {
        if (that.props.snappingEnabled) {
          snapMarker.setLatLng(e.latlng);
        }
      };

      map.on("layeradd", function (e) {
        if (e.layer.snappingGuide === true) {
          snap.addGuideLayer(e.layer);
        }
      });
      map.on("layerremove", function (e) {
        if (e.layer.snappingGuide === true) {
          const hitIndex = snap._guides.indexOf(e.layer);
          if (hitIndex !== -1) {
            snap._guides.splice(hitIndex, 1);
            // console.log('removeGuideLayer');
          }

          //snap.removeGuideLayer(e.layer);
        }
      });
      // Snapping End

      //regular editing and creation
      //moved whole object
      map.on("editable:dragend", (e) => {
        this.props.onFeatureChangeAfterEditing(
          this.props.createFeatureFromEditLayer(e.layer.feature.id, e.layer)
        );
      });

      //moved only the handles of an object
      map.on("editable:vertex:dragend", (e) => {
        this.props.onFeatureChangeAfterEditing(
          this.props.createFeatureFromEditLayer(e.layer.feature.id, e.layer)
        );
      });

      map.on("editable:drawing:click", (e) => {
        e.editTools.validClicks = e.editTools.validClicks + 1;
      });

      //created a new object
      map.on("editable:drawing:end", (e) => {
        if (e.editTools.validClicks > 0) {
          const feature = this.props.createFeatureFromEditLayer(-1, e.layer);
          //if you wannt to keep the edit handles on just do
          // feature.inEditMode = true;
          if (feature !== undefined) {
            this.props.onFeatureCreation(feature);
          }

          if (map.editTools.mode.locked === false) {
            map.editTools.mode.name = undefined;
          } else {
            map.editTools.validClicks = 0;
            if (map.editTools.mode.callback !== null && map.editTools.mode.callback !== undefined) {
              map.editTools.mode.callback.call(map.editTools);
            }
          }
        }
        e.layer.remove();
      });
    } else {
      //   console.log("RoutedMap not editable", map);
    }
    this.storeBoundingBox(leafletMap);
    this.props.mapReady(map);
  }

  //Handle a autoFit Command if needed
  componentDidUpdate() {
    if (typeof this.leafletMap !== "undefined" && this.leafletMap != null) {
      if (this.props.autoFitConfiguration.autoFitBounds) {
        if (
          this.props.autoFitConfiguration.autoFitMode === MappingConstants.AUTO_FIT_MODE_NO_ZOOM_IN
        ) {
          if (
            !this.leafletMap.leafletElement
              .getBounds()
              .contains(this.props.autoFitConfiguration.autoFitBoundsTarget)
          ) {
            this.leafletMap.leafletElement.fitBounds(
              this.props.autoFitConfiguration.autoFitBoundsTarget
            );
          }
        } else {
          if (
            this.props.autoFitConfiguration.autoFitBoundsTarget &&
            this.props.autoFitConfiguration.autoFitBoundsTarget.length === 2
          ) {
            try {
              this.leafletMap.leafletElement.fitBounds(
                this.props.autoFitConfiguration.autoFitBoundsTarget
              );
            } catch (e) {
              console.warn("could not zoom", e);

              console.log(
                "this.props.autoFitConfiguration.autoFitBoundsTarget",
                this.props.autoFitConfiguration.autoFitBoundsTarget
              );
            }
          }
        }
        this.props.autoFitProcessedHandler();
      }
    }

    // //this code would be done with a useEffect it would be a functional component
    // //we need to check whether the width and the height of the map has changed
    // //if so we need to invalidate the size of the map

    // // if (this.props.width !== this.state.width || this.props.height !== this.state.height) {

    // console.log(
    //   "this.leafletMap width",
    //   this.props.style.width,
    //   this.leafletMap?.leafletElement?._mapPane.scrollWidth
    // );

    // if (this.leafletMap?.leafletElement) {
    //   // this.leafletMap.leafletElement.invalidateSize();
    // }
    // console.log("this.leafletMap", this.leafletMap?.leafletElement);
  }

  getBoundingBox() {
    return this.getBoundingBoxForLeafletMap(this.leafletMap);
  }

  getBoundingBoxForLeafletMap(leafletMap) {
    const bounds = leafletMap.leafletElement.getBounds();
    const projectedNE = proj4(proj4.defs("EPSG:4326"), this.props.referenceSystemDefinition, [
      bounds._northEast.lng,
      bounds._northEast.lat,
    ]);
    const projectedSW = proj4(proj4.defs("EPSG:4326"), this.props.referenceSystemDefinition, [
      bounds._southWest.lng,
      bounds._southWest.lat,
    ]);
    return {
      left: projectedSW[0],
      top: projectedNE[1],
      right: projectedNE[0],
      bottom: projectedSW[1],
    };
  }

  storeBoundingBox(leafletMap) {
    //store the projected bounds in the store
    //console.log(getPolygon(bbox));

    const bbox = this.getBoundingBoxForLeafletMap(leafletMap);
    this.props.boundingBoxChangedHandler(bbox);
  }

  featureClick(event) {
    this.props.featureClickHandler(event);
  }

  render() {
    const positionByUrl = [
      parseFloat(this.props.urlSearchParams.get("lat")) || this.props.fallbackPosition.lat,
      parseFloat(this.props.urlSearchParams.get("lng")) || this.props.fallbackPosition.lng,
    ];

    let zoomByUrl;
    let fallbackZoomFallback;
    if (this.props.referenceSystem === MappingConstants.crs25832) {
      fallbackZoomFallback = 14;
    } else {
      fallbackZoomFallback = 17;
    }
    const zoomSnap =
      this.crossTabCommunicationContext?.followerConfigOverwrites[CROSSTABCOMMUNICATION_SCOPE]
        ?.zoomSnap || this.props.zoomSnap;

    if (zoomSnap === 1) {
      zoomByUrl =
        parseInt(this.props.urlSearchParams.get("zoom"), 10) ||
        this.props.fallbackZoom ||
        fallbackZoomFallback;
    } else {
      zoomByUrl =
        parseFloat(this.props.urlSearchParams.get("zoom")) ||
        this.props.fallbackZoom ||
        fallbackZoomFallback;
    }

    let fullscreenControl = <div />;

    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    let inIframe = window.self !== window.top;
    let simulateInIframe = false;
    let simulateInIOS = false;
    let iosClass = "no-iOS-device";
    let fullscreenCapable =
      document.fullscreenEnabled === true ||
      document.webkitFullscreenEnabled === true ||
      document.mozFullScreenEnabled === true ||
      document.msFullscreenEnabled === true;
    let internetExplorer = getInternetExplorerVersion() !== -1;
    if (this.props.fullScreenControlEnabled) {
      fullscreenControl = (
        <FullscreenControl
          title="Vollbildmodus"
          forceSeparateButton={true}
          titleCancel="Vollbildmodus beenden"
          position="topleft"
          container={document.documentElement}
        />
      );

      if (simulateInIOS || iOS || internetExplorer || !fullscreenCapable) {
        iosClass = "iOS-device";
        if (simulateInIframe || inIframe) {
          fullscreenControl = (
            // <OverlayTrigger placement="left" overlay={(<Tooltip>Maximiert in neuem Browser-Tab öffnen.</Tooltip>)}>
            <NewWindowControl
              position="topleft"
              routing={this.props.routing}
              title="Maximiert in neuem Browser-Tab öffnen."
            />
          );
          // </OverlayTrigger>
        } else {
          fullscreenControl = <div />;
        }
      }
    }
    let locateControl = <div />;
    if (this.props.locateControlEnabled) {
      locateControl = (
        <LocateControl
          setView="once"
          flyTo={true}
          strings={{
            title: "Mein Standort",
            metersUnit: "Metern",
            feetUnit: "Feet",
            popup: "Sie befinden sich im Umkreis von {distance} {unit} um diesen Punkt.",
            outsideMapBoundsMsg: "Sie gefinden sich wahrscheinlich außerhalb der Kartengrenzen.",
          }}
        />
      );
    }

    return (
      <CrossTabCommunicationContext.Consumer>
        {(crossTabCommunicationContext) => (
          <CrossTabCommunicationDispatchContext.Consumer>
            {(crossTabCommunicationDispatchContext) => {
              // Check if the context values are already set
              this.crossTabCommunicationContext = crossTabCommunicationContext;
              this.crossTabCommunicationDispatchContext = crossTabCommunicationDispatchContext;
              return (
                <div className={iosClass}>
                  <Map
                    id="routedMap"
                    ref={(leafletMap) => {
                      this.leafletMap = leafletMap;
                    }}
                    editable={this.props.editable}
                    key={"leafletMap"}
                    crs={this.props.referenceSystem}
                    style={this.props.style}
                    // style={{ ...this.props.style, border: "1px solid red" }}
                    center={positionByUrl}
                    zoom={zoomByUrl}
                    zoomControl={false}
                    doubleClickZoom={false}
                    ondblclick={this.props.ondblclick}
                    onclick={this.props.onclick}
                    minZoom={this.props.minZoom}
                    maxZoom={this.props.maxZoom}
                    zoomSnap={this.props.zoomSnap}
                    zoomDelta={this.props.zoomDelta}
                    attributionControl={this.props.attributionControl}
                    {...this.props.leafletMapProps}
                    //this doesnt work like expected bc the map will not take the overwrites
                    {...(this.crossTabCommunicationContext?.followerConfigOverwrites[
                      CROSSTABCOMMUNICATION_SCOPE
                    ] || [])}
                  >
                    {this.props.zoomControlEnabled && (
                      <ZoomControl
                        position="topleft"
                        zoomInTitle="Vergr&ouml;ßern"
                        zoomOutTitle="Verkleinern"
                      />
                    )}

                    {fullscreenControl}
                    {locateControl}
                    <div
                      key={
                        this.props.backgroundlayers +
                        "." +
                        this.props.urlSearchParams.get("mapStyle") +
                        "." +
                        md5(this.props.baseLayerConf || "") +
                        "."
                        //  +
                        // this.props.layerKeyPostfix +
                        // "."
                        // +
                        // this.props.offlineReadyToUse
                      }
                    >
                      {getLayersByNames(
                        this.props.backgroundlayers,
                        this.props.urlSearchParams.get("mapStyle"),
                        undefined,
                        this.props.baseLayerConf
                      )}
                    </div>

                    {this.props.children}
                  </Map>
                </div>
              );
            }}
          </CrossTabCommunicationDispatchContext.Consumer>
        )}
      </CrossTabCommunicationContext.Consumer>
    );
  }
}

RoutedMap.propTypes = {
  mapping: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
  layers: PropTypes.string.isRequired,
  layerKeyPostfix: PropTypes.string,
  featureClickHandler: PropTypes.func,
  style: PropTypes.object.isRequired,
  ondblclick: PropTypes.func,
  onclick: PropTypes.func,
  children: PropTypes.array,
  locationChangedHandler: PropTypes.func,
  boundingBoxChangedHandler: PropTypes.func, //gets called with the projected boundingbox
  autoFitConfiguration: PropTypes.object,
  autoFitProcessedHandler: PropTypes.func,
  urlSearchParams: PropTypes.object,
  fallbackPosition: PropTypes.object,
  fallbackZoom: PropTypes.number,
  referenceSystem: PropTypes.object,
  referenceSystemDefinition: PropTypes.string,
  backgroundlayers: PropTypes.string,
  fullScreenControlEnabled: PropTypes.bool,
  locateControlEnabled: PropTypes.bool,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  zoomSnap: PropTypes.number,
  zoomDelta: PropTypes.number,
  editable: PropTypes.bool,
  mapReady: PropTypes.func,
  onFeatureCreation: PropTypes.func,
  onFeatureChangeAfterEditing: PropTypes.func,
  createFeatureFromEditLayer: PropTypes.func,
  attributionControl: PropTypes.bool,
};

RoutedMap.defaultProps = {
  layers: "",
  zoomControlEnabled: true,
  gazeteerHitTrigger: function () {},
  searchButtonTrigger: function () {},
  featureClickHandler: function () {},
  onFeatureCreation: function () {},
  onFeatureChangeAfterEditing: function () {},
  ondblclick: function () {},
  onclick: function () {},
  locationChangedHandler: function () {},
  autoFitConfiguration: {},
  urlSearchParams: new URLSearchParams(""),
  boundingBoxChangedHandler: () => {},
  autoFitProcessedHandler: () => {},
  fallbackPosition: {
    lat: 51.272399,
    lng: 7.199712,
  },
  referenceSystem: MappingConstants.crs3857,
  referenceSystemDefinition: MappingConstants.proj4crs3857def,
  backgroundlayers: "default",
  minZoom: 8,
  maxZoom: 22,
  zoomSnap: 1,
  zoomDelta: 1,
  editable: false,
  attributionControl: false,
  mapReady: (map) => {},
  createFeatureFromEditLayer: (id, layer) => {
    try {
      const wgs84geoJSON = layer.toGeoJSON();
      const reprojectedGeoJSON = reproject(wgs84geoJSON, proj4.WGS84, projectionData["25832"].def);
      console.log("reprojectedGeoJSON", JSON.stringify(reprojectedGeoJSON));

      reprojectedGeoJSON.id = id;
      return reprojectedGeoJSON;
    } catch (e) {
      console.log("excepotion in create feature", e);
      return undefined;
    }
  },
};

export default RoutedMap;
