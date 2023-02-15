import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";

import * as GenericTopicMapsExamples from "./lib/_stories/complex/GenericTopicMap.stories";
import * as MoreTopicMapsExamples from "./lib/_stories/complex/MoreTopicMap.stories";
import * as TopicMapsExamples from "./lib/_stories/complex/TopicMap.stories";
import * as LeafletExamples from "./lib/_stories/mainComponents/Map.stories";
import * as GeojsonExamples from "./lib/_stories/mainComponents/ProjGeoJSON.stories";
import * as MapLibreExamples from "./lib/_stories/vector/MapLibreLayer.stories";
import PlaygroundApp from "./playground/App";

import "./index.css";
import "./lib/topicMaps.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

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
    {/* <PlaygroundApp /> */}
    <TopicMapsExamples.MostSimpleTopicMap />
    {/* <TopicMapsExamples.MostSimpleTopicMapWithCustomLayer /> */}
    {/* <TopicMapsExamples.MostSimpleTopicMapWithNonTiledLayer /> */}

    {/* <TopicMapsExamples.MostSimpleTopicMapWithGazetteerData /> */}
    {/* <TopicMapsExamples.SimpleTopicMap /> */}
    {/* <TopicMapsExamples.SimpleTopicMapWithAdditiopnalStylingInfo /> */}
    {/* <TopicMapsExamples.SimpleTopicMapWithCustomMenu /> */}
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
    {/* <TopicMapsExamples.TopicMapWithWithFilterDrivenTitleBoxWithActivatedOverlayConsole /> */}
    {/* <MoreTopicMapsExamples.TopicMapWithOfflineDataConfiguration /> */}
    {/* <GenericTopicMapsExamples.SimpleStaticGenericTopicMap_Wasserstofftankstelle /> */}
    {/* <TopicMapsExamples.TopicMapWithWithStaticFilter /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayer /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerRedrawingitself /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerInRoutedMap /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerInRoutedMapWithFeatureCollectionInAnotherCRS /> */}
    {/* <MapLibreExamples.SimpleTopicMapWithMapLibreLayer /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerWithLocalStyle /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerWithAttribution /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerWithCustomProtocol /> */}
    {/* <AnimationExamples.SimpleWuppertal25832 /> */}
    {/* <AnimationExamples.SimpleWuppertal3857 /> */}
    {/* <AnimationExamples.SimpleHaltern /> */}
    {/* <MapLibreExamples.SimpleMapLibreLayerWithAttribution /> */}
    {/* <TopicMapsExamples.TopicMapWithLineFeatureCollection /> */}
    {/* <TopicMapsExamples.TopicMapWithLineFeatureCollection /> */}
    {/* <TopicMapsExamples.TopicMapWithPolygonFeatureCollection /> */}
    {/* <GazetteerSearchBoxExamples.SimpleMapWithDetachedGazetteerSearchBox /> */}
    {/* <GazetteerSearchBoxExamples.SimpleMapWithDetachedGazetteerSearchBoxAndNoTopicMapContextProvider /> */}
    {/* <GazetteerSearchBoxExamples.SimpleMapWithDetachedGazetteerSearchBoxInABootstrapMenu /> */}
    {/* <PhotoLightBoxExamples.SimplePhotoLightBox /> */}
    {/* <PhotoLightBoxExamples.SimplePhotoLightBoxWithMultipleCaptions /> */}
    {/* <PhotoLightBoxExamples.SimplePhotoLightBoxWithMultipleCaptionsAndExternalLinks /> */}

    {/* <GazetteerSearchBoxExamples.SimpleMapWithRemoteControlledGazetteerSearchBox /> */}

    {/* <LeafletExamples.Simple /> */}
    {/* <LeafletExamples.SimpleWMS /> */}
    {/* <LeafletExamples.SimpleTrueOrtho /> */}
    {/* <LeafletExamples.SimpleNonTiledTrueOrtho /> */}

    {/* <GeojsonExamples.GeoJSONCollectionInTheMap /> */}
    {/* <GeojsonExamples.SingleInvertedGeoJSONInTheMap /> */}
    {/* <GeojsonExamples.SingleInvertedGeoJSONInTheMapIn3852 /> */}

    {/* <GeojsonExamples.SingleGeoJSONInTheMap /> */}

    {/* <LeafletExamples.SimpleTrueOrthoWithText /> */}
    {/* <LeafletExamples.SimpleTrueOrthoWithTextIn25832 /> */}
    {/* <LeafletExamples. />*/}
    {/* <LeafletExamples. />*/}
    {/* <LeafletExamples. />*/}
    {/* <LeafletExamples. />*/}
    {/* <LeafletExamples. />*/}
    {/* <LeafletExamples. />*/}
    {/* <LeafletExamples. />*/}
    {/* <LeafletExamples. />*/}
  </div>,
  document.getElementById("root")
);
