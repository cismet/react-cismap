import React, { useState, useRef, useEffect } from "react";
import { storiesCategory } from "./StoriesConf";
import { RoutedMap, MappingConstants, FeatureCollectionDisplay } from "../..";
import { parkscheinautomaten, featureDefaults } from "../_data/Demo";
import { modifyQueryPart } from "../../tools/routingHelper";
import { kassenzeichen } from "../_data/Editing.Storybook.data";
export default {
  title: storiesCategory + "FeatureCollectionDisplay",
};

const mapStyle = {
  height: 600,
  marginTop: 50,
  cursor: "pointer",
};
const psas = [];
for (let psa of parkscheinautomaten) {
  psa = { ...featureDefaults, ...psa };
  psas.push(psa);
}
export const Points = () => {
  return (
    <div>
      <div>Simple Map with projected FeatureCollectionDisplay</div>

      <br />

      <RoutedMap
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap"}
        referenceSystem={MappingConstants.crs25832}
        referenceSystemDefinition={MappingConstants.proj4crs25832def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={"rvrGrau@35"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        fallbackPosition={{
          lat: 51.25921139902955,
          lng: 7.174172824023925,
        }}
        fallbackZoom={9}
      >
        <FeatureCollectionDisplay
          style={(feature) => {
            return { radius: 15 };
          }}
          featureCollection={psas}
          showMarkerCollection={true}
          hoverer={(feature) => {
            return feature.text;
          }}
          markerStyle={(feature) => {
            let opacity = 0.6;
            let linecolor = "#000000";
            let weight = 1;

            const style = {
              radius: 2,
              color: linecolor,
              weight: weight,
              opacity: 1.0,
              fillOpacity: opacity,
              svgSize: 100,
              className: "classNameForMarkerToAvoidDoubleSVGclassbehaviour-" + feature.text,
              svg: `<svg height="100" width="100">
							<style>
								.flaeche { font: bold 12px sans-serif; }
							</style>
					
							<text 
								x="50" y="50" 
								class="flaeche" 
								text-anchor="middle" 
								alignment-baseline="central" 
								fill="#0B486B">${feature.text}</text>
						  </svg>`,
            };

            return style;
          }}
        />
      </RoutedMap>
    </div>
  );
};

export const ClusteringWithDefaultOptions = () => {
  const mapRef = useRef(null);
  const [urlSearch, setUrlSearch] = useState("");
  const [initialized, setInitialized] = useState(false);
  setTimeout(() => {
    setInitialized(true);
  }, 200);
  return (
    <div>
      <div>Simple Map with projected FeatureCollectionDisplay</div>
      <br />

      <RoutedMap
        key={"RoutedMap" + initialized}
        ref={mapRef}
        editable={false}
        style={mapStyle}
        referenceSystem={MappingConstants.crs25832}
        referenceSystemDefinition={MappingConstants.proj4crs25832def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={"ruhrWMSlight@35"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        fallbackPosition={{
          lat: 51.25921139902955,
          lng: 7.174172824023925,
        }}
        fallbackZoom={9}
        locationChangedHandler={(location) => {
          setUrlSearch(modifyQueryPart(urlSearch, location));
        }}
      >
        <FeatureCollectionDisplay
          key={"FeatureCollectionDisplay" + urlSearch}
          mapRef={(mapRef.current || {}).leafletMap}
          clusteringEnabled={true}
          style={(feature) => {
            return { radius: 15 };
          }}
          featureCollection={psas}
          showMarkerCollection={true}
          hoverer={(feature) => {
            return feature.text;
          }}
          boundingBox={{
            left: 343647.19856823067,
            top: 5695957.177980389,
            right: 398987.6070465423,
            bottom: 5652273.416315537,
          }}
          markerStyle={(feature) => {
            let opacity = 0.6;
            let linecolor = "#000000";
            let weight = 1;

            const style = {
              radius: 2,
              color: linecolor,
              weight: weight,
              opacity: 1.0,
              fillOpacity: opacity,
              svgSize: 100,
              className: "classNameForMarkerToAvoidDoubleSVGclassbehaviour-" + feature.text,
              svg: `<svg height="100" width="100">
							<style>
								.flaeche { font: bold 12px sans-serif; }
							</style>
					
							<text 
								x="50" y="50" 
								class="flaeche" 
								text-anchor="middle" 
								alignment-baseline="central" 
								fill="#0B486B">${feature.text}</text>
						  </svg>`,
            };

            return style;
          }}
        />
      </RoutedMap>
    </div>
  );
};

export const ClusteringWithCircles = (args) => {
  const mapRef = useRef(null);
  const clusterOptions = args;
  const [urlSearch, setUrlSearch] = useState("");
  const [initialized, setInitialized] = useState(false);
  setTimeout(() => {
    setInitialized(true);
  }, 200);
  console.log("mapRef.current", mapRef.current);

  return (
    <div>
      <br />
      <code>Urlparameter:#{urlSearch}</code>
      <br />
      <code>
        initialized:
        {initialized + "(" + mapRef.current !== null
          ? "mapRef.current!==null"
          : "mapRef.current===null"}
      </code>
      <RoutedMap
        ref={mapRef}
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap." + initialized}
        referenceSystem={MappingConstants.crs25832}
        referenceSystemDefinition={MappingConstants.proj4crs25832def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={"rvrGrau@35"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        fallbackPosition={{
          lat: 51.25921139902955,
          lng: 7.174172824023925,
        }}
        fallbackZoom={9}
        locationChangedHandler={(location) => {
          setUrlSearch(modifyQueryPart(urlSearch, location));
        }}
      >
        <FeatureCollectionDisplay
          key={"FeatureCollectionDisplay" + JSON.stringify(clusterOptions) + urlSearch}
          clusteringEnabled={true}
          clusterOptions={clusterOptions}
          selectionSpiderfyMinZoom={clusterOptions.selectionSpiderfyMinZoom}
          style={(feature) => {
            return { radius: 15 };
          }}
          mapRef={(mapRef.current || {}).leafletMap}
          featureCollection={psas}
          showMarkerCollection={true}
          hoverer={(feature) => {
            return feature.text + "----";
          }}
          markerStyle={(feature) => {
            let opacity = 0.6;
            let linecolor = "#000000";
            let weight = 1;

            const style = {
              radius: 2,
              color: linecolor,
              weight: weight,
              opacity: 1.0,
              fillOpacity: opacity,
              svgSize: 100,
              className: "classNameForMarkerToAvoidDoubleSVGclassbehaviour-" + feature.text,
              svg: `<svg height="100" width="100">
							<style>
								.flaeche { font: bold 12px sans-serif; }
							</style>
					
							<text 
								x="50" y="50" 
								class="flaeche" 
								text-anchor="middle" 
								alignment-baseline="central" 
								fill="#0B486B">${feature.text}</text>
						  </svg>`,
            };

            return style;
          }}
        />
      </RoutedMap>
    </div>
  );
};
ClusteringWithCircles.args = {
  spiderfyOnMaxZoom: true,
  spiderfyDistanceMultiplier: 1.4,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: false,
  maxClusterRadius: 40,
  disableClusteringAtZoom: 19,
  animate: true,
  cismapZoomTillSpiderfy: 12,
  selectionSpiderfyMinZoom: 12,
};

ClusteringWithCircles.argTypes = {
  spiderfyDistanceMultiplier: {
    control: {
      type: "range",
      min: 0.7,
      max: 3,
      step: 0.1,
    },
  },
  maxClusterRadius: {
    control: {
      type: "range",
      min: 1,
      max: 100,
      step: 1,
    },
  },
  disableClusteringAtZoom: {
    control: {
      type: "range",
      min: 5,
      max: 20,
      step: 1,
    },
  },
  cismapZoomTillSpiderfy: {
    control: {
      type: "range",
      min: 4,
      max: 20,
      step: 1,
    },
  },
  selectionSpiderfyMinZoom: {
    control: {
      type: "range",
      min: 4,
      max: 20,
      step: 1,
    },
  },
};

export const PolygonsNoStyling = (args) => {
  const mapRef = useRef(null);
  const [urlSearch, setUrlSearch] = useState("");
  const [initialized, setInitialized] = useState(false);
  setTimeout(() => {
    setInitialized(true);
  }, 200);
  console.log("mapRef.current", mapRef.current);

  return (
    <div>
      <br />
      <code>Urlparameter:#{urlSearch}</code>
      <br />
      <code>
        initialized:
        {initialized + "(" + mapRef.current !== null
          ? "mapRef.current!==null"
          : "mapRef.current===null"}
      </code>
      <RoutedMap
        ref={mapRef}
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap." + initialized}
        referenceSystem={MappingConstants.crs25832}
        referenceSystemDefinition={MappingConstants.proj4crs25832def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={"rvrGrau@35"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        fallbackPosition={{
          lat: 51.272797593330914,
          lng: 7.19936135692104,
        }}
        fallbackZoom={14.5}
        locationChangedHandler={(location) => {
          setUrlSearch(modifyQueryPart(urlSearch, location));
        }}
      >
        <FeatureCollectionDisplay
          key={"FeatureCollectionDisplay" + JSON.stringify(args) + urlSearch}
          style={(feature) => {
            return {};
          }}
          mapRef={(mapRef.current || {}).leafletMap}
          featureCollection={kassenzeichen}
          showMarkerCollection={true}
          markerStyle={(feature) => {
            let opacity = 0.6;
            let linecolor = "#000000";
            let weight = 1;

            const style = {
              color: linecolor,
              weight: weight,
              opacity: 1.0,
              fillOpacity: opacity,
              svgSize: 100,
              className:
                "classNameForMarkerToAvoidDoubleSVGclassbehaviour-" + feature.properties.bez,
              svg: `<svg height="100" width="100">
							<style>
								.flaeche { font: bold 12px sans-serif; }
							</style>
					
							<text 
								x="50" y="50" 
								class="flaeche" 
								text-anchor="middle" 
								alignment-baseline="central" 
								fill="#0B486B">${feature.properties.bez}</text>
						  </svg>`,
            };

            return style;
          }}
        />
      </RoutedMap>
    </div>
  );
};

export const PolygonsWithStyling = (args) => {
  const mapRef = useRef(null);
  const [urlSearch, setUrlSearch] = useState("");
  const [initialized, setInitialized] = useState(false);
  setTimeout(() => {
    setInitialized(true);
  }, 200);

  const [toolbar, setToolbar] = useState("");
  const myVirtHoverer = (feature) => {
    const mouseoverHov = (feature, e) => {
      setToolbar("id=" + feature.id);
      console.log("xxx  mouseoverHov", feature, e);
    };

    const mouseoutHov = (feature, e) => {
      setToolbar("");
      console.log("xxx  mouseoutHov", feature, e);
    };

    return { mouseoverHov, mouseoutHov };
  };
  myVirtHoverer.virtual = true;

  const myRegularHoverer = (feature) => {
    return "id=" + feature.id;
  };

  return (
    <div>
      <br />
      <code>Urlparameter:#{urlSearch}</code>
      <br />
      <code>Toolbar: {toolbar}</code>
      <br />
      <code>
        initialized:
        {initialized + "(" + mapRef.current !== null
          ? "mapRef.current!==null"
          : "mapRef.current===null"}
      </code>
      <RoutedMap
        ref={mapRef}
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap." + initialized}
        referenceSystem={MappingConstants.crs25832}
        referenceSystemDefinition={MappingConstants.proj4crs25832def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={"rvrGrau@35"}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        fallbackPosition={{
          lat: 51.272797593330914,
          lng: 7.19936135692104,
        }}
        fallbackZoom={14.5}
        locationChangedHandler={(location) => {
          setUrlSearch(modifyQueryPart(urlSearch, location));
        }}
      >
        <FeatureCollectionDisplay
          key={"FeatureCollectionDisplay" + JSON.stringify(args) + urlSearch}
          style={(feature) => {
            return {
              color: "#00000040", // stroke
              fillColor: "#00000010", //fill
              weight: 0.5,
            };
          }}
          hoverer={myVirtHoverer}
          //   hoverer={myRegularHoverer}
          mapRef={(mapRef.current || {}).leafletMap}
          featureCollection={kassenzeichen}
        />
      </RoutedMap>
    </div>
  );
};
