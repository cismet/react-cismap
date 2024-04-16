import React, { useState, useRef, useEffect } from "react";
import { storiesCategory } from "./StoriesConf";
import { RoutedMap, MappingConstants } from "../..";
import { DEFAULTLAYERKEYS } from "../../constants/layers";
export default {
  title: storiesCategory + "MapBackgrounds",
};

const mapStyle = {
  height: 600,
  cursor: "pointer",
};

export const Simple = () => (
  <div>
    <div>Simple Map with fixed Background</div>
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
      backgroundlayers={"ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100"}
      fullScreenControlEnabled={false}
      locateControlEnabled={false}
      minZoom={7}
      maxZoom={18}
      zoomSnap={0.5}
      zoomDelta={0.5}
    />
  </div>
);

export const DefaultBackgrounds = (args) => {
  return (
    <div>
      <div>Select the Layer to change the Background</div>

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
        backgroundlayers={args.backgroundlayers}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
      />
    </div>
  );
};
let defaultLayerKeys = [];
let x = [];
for (let layerkey of DEFAULTLAYERKEYS) {
  x.push(layerkey);
  defaultLayerKeys.push(layerkey);
}
console.log("layerkeys", JSON.stringify(x));

DefaultBackgrounds.args = {
  backgroundlayers: "trueOrtho2020@100",
  // The remaining args get passed to the `Table` component
};
DefaultBackgrounds.argTypes = {
  backgroundlayers: {
    control: {
      type: "radio",
      options: defaultLayerKeys,
    },
  },
};

export const CustomBackgrounds = (args) => {
  return (
    <div>
      <div>Select the Layer to change the Background</div>

      <br />
      <RoutedMap
        baseLayerConf={args.layerConfiguration}
        editable={false}
        style={mapStyle}
        key={"leafletRoutedMap"}
        referenceSystem={MappingConstants.crs25832}
        referenceSystemDefinition={MappingConstants.proj4crs25832def}
        doubleClickZoom={false}
        onclick={(e) => console.log("click", e)}
        ondblclick={(e) => console.log("doubleclick", e)}
        backgroundlayers={args.backgroundlayers}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
      />
    </div>
  );
};

CustomBackgrounds.args = {
  layerConfiguration: {
    namedLayers: {
      first: {
        type: "wms",
        url: "https://maps.wuppertal.de/karten",
        layers: "R102:trueortho2020",
      },
    },
  },
  backgroundlayers: "first@100",
  // The remaining args get passed to the `Table` component
};
let customLayerKeys = [];

CustomBackgrounds.argTypes = {
  layerConfiguration: {
    control: {
      type: "object",
    },
  },
};

export const Opacity = (args) => {
  let backgroundlayers = args.layer + "@" + args.opacity;
  return (
    <div>
      <div>Select the Layer and play with the slider to change the Background</div>

      <code>backgroundlayers={backgroundlayers}</code>

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
        backgroundlayers={backgroundlayers}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
      />
      <br />
    </div>
  );
};

Opacity.args = {
  layer: "trueOrtho2020",
  opacity: 100,
  // The remaining args get passed to the `Table` component
};

Opacity.argTypes = {
  layer: {
    control: {
      type: "select",
      options: defaultLayerKeys,
    },
  },
  opacity: {
    control: {
      type: "range",
      min: 0,
      max: 100,
    },
  },
};

export const DynamicLayerString = (args) => {
  return (
    <div>
      <div>Change the layer String to change the Background</div>
      <div>
        (Combine the Layers with a <code>|</code>-Symbol)
      </div>
      <div>
        (Example: <code>backgroundLayer@100|ColorLayerInTheMiddle@50|Textlayer@100</code>)
      </div>

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
        backgroundlayers={args.backgroundlayers}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
      />
      <br />
      <h5>All Layer Keys</h5>
      <code>
        {DEFAULTLAYERKEYS.map((key, index) => {
          return <span>{key}, </span>;
        })}
      </code>
    </div>
  );
};

DynamicLayerString.args = {
  backgroundlayers: "trueOrtho2020@50|rvrSchrift@100",
  // The remaining args get passed to the `Table` component
};
