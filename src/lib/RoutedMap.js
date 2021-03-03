import React from "react";
import PropTypes from "prop-types";
import { Map, ZoomControl } from "react-leaflet";
import "proj4leaflet";
import proj4 from "proj4";
import "url-search-params-polyfill";
import "@fortawesome/fontawesome-free/js/all.js";
import L from "leaflet";
import "leaflet-editable";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import "leaflet-extra-markers/";
import "leaflet.path.drag";
import * as MappingConstants from "./constants/gis";
import { projectionData } from "./tools/mappingHelpers";

import getLayersByNames from "./tools/layerFactory";
import FullscreenControl from "./FullscreenControl";
import NewWindowControl from "./NewWindowControl";
import LocateControl from "./LocateControl";
import { getInternetExplorerVersion } from "./tools/browserHelper";
import "leaflet-snap";
import "leaflet-geometryutil";
import { overrideClosestFromGeometryUtils } from "./tools/leaflet-geometryutil-workaround"; //see https://github.com/makinacorpus/Leaflet.GeometryUtil/issues/59
import { reproject } from "reproject";
import { md5FetchJSON } from "./tools/fetching";
import md5 from "md5";
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
    map.editable = this.props.editable;

    //Do sstuff after panning is over
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
          const zoomFromUrl = parseInt(this.props.urlSearchParams.get("zoom"), 10);
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
    if (this.props.zoomSnap === 1) {
      zoomByUrl = parseInt(this.props.urlSearchParams.get("zoom"), 10) || this.props.fallbackZoom;
    } else {
      zoomByUrl = parseFloat(this.props.urlSearchParams.get("zoom")) || this.props.fallbackZoom;
    }

    let fullscreenControl = <div />;

    let iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    let inIframe = window.self !== window.top;
    let simulateInIframe = false;
    let simulateInIOS = false;
    let iosClass = "no-iOS-device";
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

      if (simulateInIOS || iOS || internetExplorer) {
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
      <div className={iosClass}>
        <Map
          ref={(leafletMap) => {
            this.leafletMap = leafletMap;
          }}
          editable={this.props.editable}
          key={"leafletMap"}
          crs={this.props.referenceSystem}
          style={this.props.style}
          center={positionByUrl}
          zoom={zoomByUrl}
          zoomControl={false}
          attributionControl={false}
          doubleClickZoom={false}
          ondblclick={this.props.ondblclick}
          onclick={this.props.onclick}
          minZoom={this.props.minZoom}
          maxZoom={this.props.maxZoom}
          zoomSnap={this.props.zoomSnap}
          zoomDelta={this.props.zoomDelta}
        >
          <ZoomControl
            position="topleft"
            zoomInTitle="Vergr&ouml;ßern"
            zoomOutTitle="Verkleinern"
          />

          {fullscreenControl}
          {locateControl}
          <div
            key={
              this.props.backgroundlayers +
              "." +
              this.props.urlSearchParams.get("mapStyle") +
              "." +
              md5(this.props.namedLayerConf || "") +
              "." +
              this.props.layerKeyPostfix
            }
          >
            {getLayersByNames(
              this.props.backgroundlayers,
              this.props.urlSearchParams.get("mapStyle"),
              undefined,
              this.props.namedLayerConf
            )}
          </div>

          {this.props.children}
        </Map>
      </div>
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
};

RoutedMap.defaultProps = {
  layers: "",
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
  fallbackZoom: 14,
  referenceSystem: MappingConstants.crs25832,
  referenceSystemDefinition: MappingConstants.proj4crs25832def,
  backgroundlayers: "default",
  minZoom: 7,
  maxZoom: 18,
  zoomSnap: 1,
  zoomDelta: 1,
  editable: false,
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
