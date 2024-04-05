import * as MappingHelpers from "./tools/mappingHelpers";
import * as MappingConstants from "./constants/gis";

import ProjGeoJson from "./ProjGeoJson";
import FeatureCollectionDisplay from "./FeatureCollectionDisplay";
import FeatureCollectionDisplayWithTooltipLabels from "./FeatureCollectionDisplayWithTooltipLabels";
import RoutedMap from "./RoutedMap";
import getLayersByName from "./tools/layerFactory";
import FullscreenControl from "./FullscreenControl";
import LocateControl from "./LocateControl";
import NewPolyControl from "./editcontrols/NewPolygonControl";
import NewMarkerControl from "./editcontrols/NewMarkerControl";
import * as TransitiveReactLeaflet from "react-leaflet";
import * as TransitiveLeaflet from "leaflet";

const ID = 3;
export {
  MappingHelpers,
  MappingConstants,
  FeatureCollectionDisplay,
  FeatureCollectionDisplayWithTooltipLabels,
  RoutedMap,
  ProjGeoJson,
  getLayersByName,
  FullscreenControl,
  LocateControl,
  NewPolyControl,
  NewMarkerControl,
  TransitiveReactLeaflet,
  TransitiveLeaflet,
};

export { ID };
