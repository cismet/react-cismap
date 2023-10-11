import L from "leaflet";
import md5 from "md5";
import proj4 from "proj4";
import PropTypes from "prop-types";
import React from "react";
import { Map, ScaleControl, ZoomControl } from "react-leaflet";
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
      const leader = this.crossTabCommunicationContext?.type === TYPES.LEADER;
      const follower = this.crossTabCommunicationContext?.type === TYPES.FOLLOWER;
      const leaderFollowerChannel = leader || follower;
      console.log("xxx leaderOrFollower", { leader, follower }, this.crossTabCommunicationContext);
      console.log("xxx 2nd this.contextSet", this.contextSet);
      const crossTabCommunicationDispatch = this.crossTabCommunicationDispatchContext;
      if (leader) {
        // this is a leader
        // do stuff for leader
        // create a channel for the leader
        crossTabCommunicationDispatch.scopedMessage(CROSSTABCOMMUNICATION_SCOPE, {
          type: "mapState",
          mapState: { zoom: map.getZoom(), center: map.getCenter() },
        });
        // listen to changes of the map state
        map.on("move zoom moveend resize", (e) => {
          crossTabCommunicationDispatch.scopedMessage(CROSSTABCOMMUNICATION_SCOPE, {
            type: "mapState",
            mapState: { zoom: map.getZoom(), center: map.getCenter() },
          });
        });
      } else if (follower) {
        // this is a follower
        crossTabCommunicationDispatch.follow(CROSSTABCOMMUNICATION_SCOPE, (data) => {
          map.setView(data.mapState.center, data.mapState.zoom);
        });
        setTimeout(() => {
          crossTabCommunicationDispatch.sendFeedback(CROSSTABCOMMUNICATION_SCOPE, {
            type: "bounds",
            bounds: map.getBounds(),
          });
        }, 100);
        //here we will send the bounds of the map back to display ist in the leader map
        map.on("resize move zoom moveend", (e) => {
          crossTabCommunicationDispatch.sendFeedback(CROSSTABCOMMUNICATION_SCOPE, {
            type: "bounds",
            bounds: e.target.getBounds(),
          });
        });
      }
    }, 10);

    //Do stuff after panning is over
    map.on("moveend", () => {
      if (
        typeof leafletMap !== "undefined" &&
        leafletMap !== null &&
        leafletMap.leafletElement !== undefined &&
        leafletMap.leafletElement !== null
      ) {
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
      } else {
        console.warn("leafletMap ref is null. this could lead to update problems. ");
      }
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
          orderManipulatable
          key="fullscreenControl"
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
          key="locateControl"
          orderManipulatable
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

              const children = [];
              //add ^children here
              if (this.props.zoomControlEnabled) {
                children.push(
                  <ZoomControl
                    key="zoomControl"
                    _order="0000000"
                    orderManipulatable
                    position="topleft"
                    zoomInTitle="Vergr&ouml;ßern"
                    zoomOutTitle="Verkleinern"
                  />
                );
              }
              children.push(fullscreenControl);
              children.push(locateControl);

              if (this.props.children && Array.isArray(this.props.children)) {
                children.push(...this.props.children);
              }

              // flatten the children array. that means if there is an array as a child
              // add the children of the array to the children array
              const flatchildren = [];

              const flatten = (arr) => {
                for (const el of arr) {
                  if (Array.isArray(el)) {
                    flatten(el);
                  } else {
                    if (el) {
                      flatchildren.push(el);
                    }
                  }
                }
              };

              flatten(children);
              // go through the flatchildren and remove the ones that have a prop orderManipulatbale
              // and add them to the orderManipulatedChildren array
              const _children = [];
              const orderManipulationCandidates = [];
              console.log("xxxx flatchildren", flatchildren);

              for (const child of flatchildren || []) {
                console.log("xxx child", child);
                console.log("xxx child.props.orderManipulatbale", child?.props?.orderManipulatable);

                if (child?.props?.orderManipulatable) {
                  orderManipulationCandidates.push(child);
                } else {
                  _children.push(child);
                }
              }

              console.log("xxx children", _children);

              // Helper function to determine the order of two elements
              // const determineOrder = (a, b) => {
              //   const orderA = a.props.order || "";
              //   const orderB = b.props.order || "";

              //   // If a should be before b
              //   if (orderA === `before::${b.key}`) return -1;

              //   // If a should be after b
              //   if (orderA === `after::${b.key}`) return 1;

              //   // If b should be before a
              //   if (orderB === `before::${a.key}`) return 1;

              //   // If b should be after a
              //   if (orderB === `after::${a.key}`) return -1;

              //   // If neither have order props, or if the order props don't specify the other element, keep original order
              //   return 0;
              // };
              const determineOrder = (a, b) => {
                const orderA = a.props.order || "";
                const orderB = b.props.order || "";

                if (orderA < orderB) return -1;
                if (orderA > orderB) return 1;

                return 0;
              };
              console.log(
                "xxx orderManipulationCandidates",
                orderManipulationCandidates.map((c) => c.props.order + "..." + c.key)
              );

              const orderedChildren = orderManipulationCandidates.sort(determineOrder);
              const defaults = {
                maxWidth: 200,
                metric: true,
                imperial: false,
                updateWhenIdle: false,
                position: "bottomleft",
              };
              console.log(
                "xxx orderedChildren",
                orderedChildren.map((c) => c.props.order + "..." + c.key)
              );

              return (
                <div className={iosClass}>
                  <Map
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
                    {orderedChildren}
                    {_children}
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
