import React, { useState, useRef, useEffect } from "react";
import { parkscheinautomatenfeatures, storiesCategory } from "./StoriesConf";
import { RoutedMap, MappingConstants } from "../..";
import TopicMapContextProvider from "../../contexts/TopicMapContextProvider";
import TopicMapComponent from "../TopicMapComponent";
import FeatureCollection from "../../FeatureCollection";
import GenericInfoBoxFromFeature from "../GenericInfoBoxFromFeature";
export default {
  title: storiesCategory + "InfoBox",
};

const mapStyle = {
  height: 600,
  cursor: "pointer",
};

export const SimpleInfoBox = () => <h3>Coming Soon</h3>;

export const SimpleTopicMapWithDefaultInfoBox = () => {
  return (
    <TopicMapContextProvider items={parkscheinautomatenfeatures}>
      <TopicMapComponent infoBox={<GenericInfoBoxFromFeature pixelwidth={300} />}>
        <FeatureCollection />
      </TopicMapComponent>
    </TopicMapContextProvider>
  );
};
