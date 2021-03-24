import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";

import "react-bootstrap-typeahead/css/Typeahead.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./lib/topicMaps.css";
import * as TopicMapsExamples from "./lib/_stories/complex/TopicMap.stories";
import * as GenericTopicMapsExamples from "./lib/_stories/complex/GenericTopicMap.stories";
import * as MapLibreExamples from "./lib/_stories/vector/SimpleMapLibreLayer";

const TestContext = React.createContext();

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
    {/* <TopicMapsExamples.TopicMapWithWithFilterDrivenTitleBox /> */}
    {/* <GenericTopicMapsExamples.SimpleStaticGenericTopicMap_Wasserstofftankstelle /> */}
    {/* <TopicMapsExamples.TopicMapWithWithStaticFilter /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayer /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerInRoutedMap /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerInRoutedMapWithFeatureCollectionInAnotherCRS /> */}
    <MapLibreExamples.SimpleTopicMapWithMapLibreLayer />
  </div>,
  document.getElementById("root")
);
