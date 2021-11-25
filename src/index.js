import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";

import "react-bootstrap-typeahead/css/Typeahead.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./lib/topicMaps.css";
import "antd/dist/antd.css";
import "./index.css";
import * as TopicMapsExamples from "./lib/_stories/complex/TopicMap.stories";
import * as GenericTopicMapsExamples from "./lib/_stories/complex/GenericTopicMap.stories";
import * as MapLibreExamples from "./lib/_stories/vector/SimpleMapLibreLayer";
import * as AnimationExamples from "./lib/_stories/vectorfieldanimation/SimpleVFAExample";
import * as InfoBoxExamples from "./lib/topicmaps/_stories/InfoBox.stories";
import * as GazetteerSearchBoxExamples from "./lib/_stories/mainComponents/GazetteerSearchControl.stories";
import * as PhotoLightBoxExamples from "./lib/topicmaps/_stories/PhotoLightbox.stories";
import * as RainHazardMapExamples from "./lib/topicmaps/rainhazards/_stories/HeavyRainHazardMap.stories";

const TestContext = React.createContext();

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", function () {
//     navigator.serviceWorker
//       .register("/offlineVectorTilesServiceWorker.js")
//       .then((res) => console.log("zzz service worker registered", res))
//       .catch((err) => console.log("service worker not registered", err));
//   });
// }

const ContextDisplay = () => {
  const testContextValue = useContext(TestContext);
  return (
    <div
      onClick={() => {
        if (testContextValue !== undefined) {
          testContextValue.setCounter((old) => old + 1);
        }
      }}
    >
      {(testContextValue || {}).counter}
    </div>
  );
};

const TestComponent = ({ display }) => {
  const [counter, setCounter] = useState(0);
  return (
    <TestContext.Provider value={{ counter, setCounter }}>
      <h1>Test</h1>
      <h5>{display}</h5>
      {/* <h5>
				<ContextDisplay />
			</h5> */}
    </TestContext.Provider>
  );
};

ReactDOM.render(
  <div>
    {/* <TopicMapsExamples.MostSimpleTopicMap /> */}
    {/* <TopicMapsExamples.MostSimpleTopicMapWithGazetteerData /> */}
    {/* <TopicMapsExamples.SimpleTopicMap /> */}
    {/* <TopicMapsExamples.SimpleTopicMapWithDefaultInfoBox /> */}
    {/* <TopicMapsExamples.SimpleTopicMapWithInfoBox /> */}
    {/* <TopicMapsExamples.SimpleTopicMapWithCustomStyling /> */}
    {/* <TopicMapsExamples.SimpleTopicMapWithFullClusteringOptionsAndStyling /> */}
    {/* <TopicMapsExamples.TopicMapWithWithSecondaryInfoSheet /> */}
    {/* <TopicMapsExamples.TopicMapWithWithCustomSettings /> */}
    {/* <TopicMapsExamples.TopicMapWithAdditionalLayers /> */}
    {/* <TopicMapsExamples.TopicMapWithWithCustomSettingsAndOneAdditionlLayer /> */}
    {/* <TopicMapsExamples.TopicMapWithCustomLayerSetAndAdditionalOverlayLayers /> */}
    {/* <TopicMapsExamples.TopicMapWithWithFilterDrivenTitleBox /> */}
    {/* <GenericTopicMapsExamples.SimpleStaticGenericTopicMap_Wasserstofftankstelle /> */}
    {/* <TopicMapsExamples.TopicMapWithWithStaticFilter /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayer /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerInRoutedMap /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerInRoutedMapWithFeatureCollectionInAnotherCRS /> */}
    {/* <MapLibreExamples.SimpleTopicMapWithMapLibreLayer /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerWithLocalStyle /> */}
    {/* <AnimationExamples.SimpleWuppertal25832 /> */}
    {/* <AnimationExamples.SimpleWuppertal3857 /> */}
    {/* <AnimationExamples.SimpleHaltern /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerWithAttribution /> */}
    {/* <TopicMapsExamples.TopicMapWithLineFeatureCollection /> */}
    {/* <GazetteerSearchBoxExamples.SimpleMapWithDetachedGazetteerSearchBox /> */}
    {/* <GazetteerSearchBoxExamples.SimpleMapWithDetachedGazetteerSearchBoxAndNoTopicMapContextProvider /> */}
    {/* <GazetteerSearchBoxExamples.SimpleMapWithDetachedGazetteerSearchBoxInABootstrapMenu /> */}
    {/* <PhotoLightBoxExamples.SimplePhotoLightBox /> */}
    {/* <PhotoLightBoxExamples.SimplePhotoLightcode BoxWithMultipleCaptions /> */}
    {/* <PhotoLightBoxExamples.SimplePhotoLightBoxWithMultipleCaptionsAndExternalLinks /> */}
    {/* <RainHazardMapExamples.RainHazardMapHaltern /> */}
    {/* <RainHazardMapExamples.RainHazardMapOlpe /> */}
    {/* <RainHazardMapExamples.RainHazardMapWuppertal /> */}
    <RainHazardMapExamples.RainHazardMapPaderborn />
    {/* <RainHazardMapExamples.TimeSeriesChart /> */}
  </div>,
  document.getElementById("root")
);
