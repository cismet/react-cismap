import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";

import * as GenericTopicMapsExamples from "./lib/_stories/complex/GenericTopicMap.stories";
import * as MoreTopicMapsExamples from "./lib/_stories/complex/MoreTopicMap.stories";
import * as TopicMapsExamples from "./lib/_stories/complex/TopicMap.stories";
import * as ProjectorExamples from "./lib/_stories/complex/Projector.stories";
import * as LeafletExamples from "./lib/_stories/mainComponents/Map.stories";
import * as GeojsonExamples from "./lib/_stories/mainComponents/ProjGeoJSON.stories";
import * as FeatureCollectionExamples from "./lib/_stories/mainComponents/FeatureCollection.stories";
import * as MapLibreExamples from "./lib/_stories/vector/MapLibreLayer.stories";
import * as ProjectionMappingExamples from "./lib/_stories/complex/ProjectionMapping.stories";
import * as RoutedMapExamples from "./lib/_stories/mainComponents/RoutedMap.stories";
import * as GraphqlLayerExamples from "./lib/_stories/mainComponents/GraphqlLayer.stories";
import * as PhotoLightBoxExamples from "./lib/topicmaps/_stories/PhotoLightbox.stories";
import * as GazetteerSearchBoxExamples from "./lib/_stories/mainComponents/GazetteerSearchControl.stories";
// import PlaygroundApp from "./playground/App";

import "./index.css";
import "./lib/topicMaps.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const TestContext = React.createContext();

const originalWarn = console.warn.bind(console);
const originalError = console.error.bind(console);
console.warn = (message, ...args) => {
  try {
    if (message && !message.includes("ReactDOM.render is no longer supported in React 18")) {
      originalWarn(message, ...args);
    }
  } catch (e) { }
};
console.error = (message, ...args) => {
  try {
    if (message && !message.includes("ReactDOM.render is no longer supported in React 18")) {
      originalError(message, ...args);
    }
  } catch (e) { }
};

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

if (window.location.pathname === "/follower") {
  root.render(
    <div>
      <TopicMapsExamples.RemoteControledTopicMap />
    </div>
  );
} else if (window.location.pathname === "/projector") {
  root.render(
    <div style={{ backgroundColor: "black" }}>
      <ProjectorExamples.ProjectorView3857 />
    </div>
  );
} else if (window.location.pathname === "/projector3857") {
  root.render(
    <div style={{ backgroundColor: "black" }}>
      <ProjectorExamples.ProjectorView3857 />
    </div>
  );
} else if (window.location.pathname === "/controller") {
  root.render(
    <div>
      <ProjectorExamples.ControllerView />
    </div>
  );
} else {
  root.render(
    <div>
      {/* <PlaygroundApp /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMap /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMapWithZoomSnapAndZoomDelta /> */}

      {/* <TopicMapsExamples.SimpleTopicMapWMSBBoxDisplay /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMapWithCismapLayer /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMapWithInfoBoxComponent /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMapWithCustomLayer /> */}
      {/* <TopicMapsExamples.SimpleTopicMapWithVectoprLayerAndSelectionInfoBox /> */}
      <TopicMapsExamples.MostSimpleTopicMapWithCustomLayerAndEmptyTopicMapbackgroundLayer />

      {/* <TopicMapsExamples.MostSiprojmpleTopicMapWithCustomLayer25832 /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMapWithCustomLayerAnPaleOverlay /> */}

      {/* <TopicMapsExamples.MostSimpleTopicMapWithCismapTiledLayer /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMapWithNonTiledLayer /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMapWithGazetteerData /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMapWithCustomGazetteerSearchBox /> */}
      {/* <TopicMapsExamples.MostSimpleTopicMapWithGazetteerDataWithTertiaryAction /> */}
      {/* <TopicMapsExamples.SimpleTopicMap /> */}
      {/* <TopicMapsExamples.SimpleTopicMapWithAdditiopnalStylingInfo /> */}
      {/* <TopicMapsExamples.SimpleTopicMapWithCustomMenu /> */}
      {/* <TopicMapsExamples.SimpleTopicMapWithDefaultInfoBox /> */}
      {/* <TopicMapsExamples.SimpleTopicMapWithInfoBox /> */}
      {/* <TopicMapsExamples.SimpleTopicMapWithCustomStyling /> */}
      {/* <TopicMapsExamples.SimpleTopicMapWithCustomInfoBox /> */}
      {/* <TopicMapsExamples.SimpleTopicMapWithFullClusteringOptionsAndStyling /> */}
      {/* <TopicMapsExamples.TopicMapWithWithSecondaryInfoSheet /> */}
      {/* <TopicMapsExamples.TopicMapWithWithCustomSettings /> */}
      {/* <TopicMapsExamples.TopicMapWithAdditionalLayers /> */}
      {/* <TopicMapsExamples.TopicMapWithDynamicAdditionalLayers /> */}
      {/* <TopicMapsExamples.TopicMapWithCrossTabCommunicationContextProvider /> */}
      {/* <TopicMapsExamples.TopicMapWithCrossTabCommunicationContextProviderProblem /> */}
      {/* <TopicMapsExamples.RemoteControledTopicMap /> */}
      {/* <TopicMapsExamples.TopicMapWithWithCustomSettingsAndOneAdditionlLayer /> */}
      {/* <TopicMapsExamples.TopicMapWithCustomLayerSetAndAdditionalOverlayLayers /> */}
      {/* <TopicMapsExamples.TopicMapTholey /> */}
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
      {/* <LeafletExamples.Simple /> */}
      {/* <LeafletExamples.SimpleWMS /> */}
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
      {/* <FeatureCollectionExamples.Points /> */}
      {/* <FeatureCollectionExamples.ClusteringWithDefaultOptions /> */}
      {/* <FeatureCollectionExamples.ClusteringWithCircles /> */}
      {/* <FeatureCollectionExamples.PolygonsNoStyling /> */}
      {/* <FeatureCollectionExamples.PolygonsWithStyling /> */}
      {/* {<ProjectionMappingExamples.MostSimpleTopicMapWithProjectionMapping />} */}
      {/* <RoutedMapExamples.Simple /> */}
      {/* <GraphqlLayerExamples.Landparcels /> */}
      {/* <GraphqlLayerExamples.LandparcelsFromCismapLayer /> */}
      {/* <TopicMapsExamples.TopicMapWithWithSetSelectedFeatureByPredicate /> */}
      {/* <GenericTopicMapsExamples.SimpleStaticGenericTopicMap_Parkscheinautomaten /> */}
    </div>
  );
}
