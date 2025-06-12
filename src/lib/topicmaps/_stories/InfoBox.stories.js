import React from "react";
import TopicMapContextProvider from "../../contexts/TopicMapContextProvider";
import FeatureCollection from "../../FeatureCollection";
import GenericInfoBoxFromFeature from "../GenericInfoBoxFromFeature";
import TopicMapComponent from "../TopicMapComponent";
import { parkscheinautomatenfeatures, storiesCategory } from "./StoriesConf";
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
