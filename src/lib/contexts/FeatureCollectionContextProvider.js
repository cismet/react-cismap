import { useImmer } from "use-immer";
import React, { useState, useEffect, useContext } from "react";
import { fetchJSON, md5FetchJSON } from "../tools/fetching";
import KDBush from "kdbush";
import { TopicMapContext, TopicMapDispatchContext } from "./TopicMapContextProvider";
import { getSymbolSVGGetter } from "../tools/uiHelper";
import bboxPolygon from "@turf/bbox-polygon";
import booleanIntersects from "@turf/boolean-intersects";
import localforage from "localforage";
import { setFromLocalforage } from "./_helper";
import proj4 from "proj4";
import { projectionData } from "../constants/gis";
import { findInFlatbush, createFlatbushIndex } from "../tools/gisHelper";
import envelope from "@turf/envelope";
import { featureCollection } from "@turf/helpers";
const defaultState = {
  items: undefined,
  itemsDictionary: undefined,
  createItemsDictionary: () => {},
  metaInformation: undefined,
  filteredItems: undefined,
  filterState: undefined,
  filterMode: undefined,
  itemFilterFunction: undefined,
  filterFunction: undefined,
  allFeatures: undefined,
  pointFeatures: undefined,
  otherFeatures: undefined,
  shownFeatures: undefined,
  selectedFeature: undefined,
  pointFeatureIndex: undefined,
  polyFeatureIndex: undefined,
  featureTooltipFunction: undefined,
  selectedIndexState: {
    selectedIndex: 0,
    forced: false,
  },
  clusteringEnabled: false,
  clusteringOptions: undefined,
  classKeyFunction: undefined,
  getColorFromProperties: undefined,
  epsgCode: undefined,
};

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const getItems = async ({
  setItems,
  itemsUrl,
  convertItemToFeature,
  name = "cachedFeatureCollection",
  caching = true,
  withMD5Check = true,
}) => {
  const prefix = name;
  let items;

  if (caching === true && withMD5Check === true) {
    items = await md5FetchJSON(prefix, itemsUrl);
  } else {
    // else if () {
    //     //need to impl the other stuff
    // }
    items = await fetchJSON(itemsUrl);
  }

  setItems(items);
};

const FeatureCollectionContextProvider = ({
  children,
  enabled = true,
  getFeatureStyler,
  getColorFromProperties,
  getSymbolSVG,
  clusteringEnabled = false,
  clusteringOptions,
  alwaysShowAllFeatures = false,
  itemsURL,
  items,
  featureCollectionName,
  featureTooltipFunction,
  convertItemToFeature = (itemIsFeature) => JSON.parse(JSON.stringify(itemIsFeature || {})),
  itemFilterFunction,
  filterFunction,
  appKey,
  persistenceSettings,
  filterState,
  classKeyFunction,
  createItemsDictionary = () => {},
}) => {
  const [state, dispatch] = useImmer({
    ...defaultState,
    items,
    getFeatureStyler,
    getColorFromProperties,
    clusteringEnabled,
    clusteringOptions,
    getSymbolSVG,
    itemFilterFunction,
    filterFunction,
    filterState,
    classKeyFunction,
    featureTooltipFunction,
    createItemsDictionary,
  });
  // console.log(" featureCollectionState", state);

  const { boundingBox, mapEPSGCode, appMode } = useContext(TopicMapContext);
  const { fitBBox } = useContext(TopicMapDispatchContext);
  const contextKey = "featureCollection";
  const set = (prop, noTest) => {
    return (x) => {
      dispatch((state) => {
        if (noTest === true || JSON.stringify(state[prop]) !== JSON.stringify(x)) {
          if (persistenceSettings[contextKey]?.includes(prop)) {
            localforage.setItem("@" + appKey + "." + contextKey + "." + prop, x);
          }
          state[prop] = x;
        }
      });
    };
  };
  useEffect(() => {
    if (persistenceSettings && persistenceSettings[contextKey]) {
      for (const prop of persistenceSettings[contextKey]) {
        const localforagekey = "@" + appKey + "." + contextKey + "." + prop;
        const setter = set(prop, true);
        setFromLocalforage(localforagekey, setter);
      }
    }
  }, []);
  const {
    pointFeatureIndex,
    polyFeatureIndex,
    allFeatures,
    pointFeatures,
    otherFeatures,
    shownFeatures,
    selectedIndexState,
    selectedFeature,
  } = state;
  const selectedIndex = selectedIndexState.selectedIndex;

  const setX = {
    setItems: (items) => {
      set("itemsDictionary")(createItemsDictionary(items));
      set("items")(items);
    },
    setMetaInformation: set("metaInformation"),
    setEPSGCode: set("epsgCode"),
    setFilteredItems: set("filteredItems"),
    setFilterState: set("filterState"),
    setFilterMode: set("filterMode"),
    setFilterFunction: set("filterFunction"),
    setItemFilterFunction: set("itemFilterFunction"),
    setAllFeatures: set("allFeatures"),
    setPointFeatures: set("pointFeatures"),
    setOtherFeatures: set("otherFeatures"),
    setShownFeatures: set("shownFeatures"),
    setSelectedFeature: set("selectedFeature"), //don't call from outside
    setPointFeatureIndex: set("pointFeatureIndex"),
    setPolyFeatureIndex: set("polyFeatureIndex"),
    setSelectedIndexState: set("selectedIndexState"),
    setClusteringEnabled: set("clusteringEnabled"),
    setFeatureTooltipFunction: set("featureTooltipFunction"),
  };

  const setSelectedFeatureIndex = (selectedIndex) => {
    setX.setSelectedIndexState({ selectedIndex, forced: true }); //overrules keep index when boundingbox is changed
  };

  const setSelectedIndex = (selectedIndex) => {
    setX.setSelectedIndexState({ selectedIndex, forced: false });
  };

  const setSelectedFeatureByPredicate = (predicate) => {
    dispatch((state) => {
      let index = 0;
      for (const feature of state.shownFeatures) {
        // console.log("predicate loop. will check ", feature.properties.id);
        if (predicate(feature) === true) {
          // console.log("predicate hit. will select ", feature);

          setSelectedFeatureIndex(index);

          return;
        }
        index++;
      }
    });
  };

  const fitBoundsForCollection = (featuresToZoomTo) => {
    dispatch((state) => {
      let fc = featuresToZoomTo || state.allFeatures;
      if (fc.length > 0) {
        let refDef;
        //find out crs
        if (Array.isArray(fc) && fc.length > 0) {
          const firstFeature = fc[0];
          const code = firstFeature?.crs?.properties?.name?.split("EPSG::")[1];
          refDef = projectionData[code].def;
        }

        let bbox = envelope(featureCollection(fc)).bbox;
        fitBBox(bbox, refDef);
      } else {
        // in case no feature is in the allFeatures collection (filtersettings)
        // then zoom to the beautiful city of wuppertal
        const bbox = [365438.691, 5673053.061, 381452.618, 5682901.164];
        fitBBox(bbox, projectionData[25832].def);
      }
    });
  };

  const next = () => {
    const newIndex = (selectedFeature.index + 1) % shownFeatures.length;
    setSelectedFeatureIndex(newIndex);
  };
  const prev = () => {
    let newIndex = (selectedFeature.index - 1) % shownFeatures.length;
    if (newIndex === -1) {
      newIndex = shownFeatures.length - 1;
    }
    setSelectedFeatureIndex(newIndex);
  };

  useEffect(() => {
    if (state.allFeatures?.length > 0) {
      const first = state.allFeatures[0];
      const epsgCode = first.crs.properties.name.split("urn:ogc:def:crs:EPSG::")[1];
      setX.setEPSGCode(epsgCode);
    }
  }, [state.allFeatures]);

  // if (state?.items) {
  //   console.log("FeatureCollectionContextProvider items", state?.items);
  //   console.log("xxx FeatureCollectionContextProvider items", state?.shownFeatures);
  // }
  // effect when items are changed
  useEffect(() => {
    //async start
    (async () => {
      if (state.filteredItems) {
        let id = 0;

        const points = [];
        const others = [];

        for (const item of state.filteredItems || []) {
          const f = await convertItemToFeature(item);
          // check if it is an array of features
          const doFeature = (f) => {
            f.selected = false;
            f.id = id++;
            if (f?.geometry?.type === "Point") {
              points.push(f);
            } else {
              others.push(f);
            }
            return f;
          };

          if (Array.isArray(f)) {
            for (const subfeature of f) {
              doFeature(subfeature);
            }
          } else {
            doFeature(f);
          }
        }
        // console.log("xxx points", points);
        // console.log("xxx others", others);

        setX.setAllFeatures([...points, ...others]);
        setX.setPointFeatures(points);
        setX.setOtherFeatures(others);

        // points
        setX.setPointFeatureIndex(
          new KDBush(
            points,
            (p) => p.geometry.coordinates[0],
            (p) => p.geometry.coordinates[1]
          )
        );
        // other geometries
        const polyindex = createFlatbushIndex(others);
        setX.setPolyFeatureIndex(polyindex);
      }
    })();
    //async end
  }, [state.filteredItems]);

  // effect on filter change
  useEffect(() => {
    if (state.items) {
      let filteredItems;
      if (state.filterFunction !== undefined) {
        filteredItems = state.filterFunction();
      } else if (state.itemFilterFunction !== undefined) {
        filteredItems = state.items.filter(
          state.itemFilterFunction({
            filterState: state.filterState,
            filterMode: state.filterMode,
            appMode: appMode,
            itemsDictionary: state.itemsDictionary,
          })
        );
      } else {
        filteredItems = state.items;
      }
      setX.setFilteredItems(filteredItems);
    }
  }, [state.filterState, state.filterMode, state.filterFunction, state.items, appMode]);

  //effect when boundingBox or selection changed
  useEffect(() => {
    let pointFeaturesHits = [];
    let otherFeaturesHits = [];
    let featureHits;
    let projectedBoundingBox;
    if (boundingBox !== undefined && alwaysShowAllFeatures === false) {
      //reproject bounding box if map CRS is not FeatureCollection CRS
      if (state.epsgCode && mapEPSGCode && mapEPSGCode !== state.epsgCode) {
        const projectedNE = proj4(
          projectionData[mapEPSGCode].def,
          projectionData[state.epsgCode].def,
          [boundingBox.left, boundingBox.bottom]
        );

        const projectedSW = proj4(
          projectionData[mapEPSGCode].def,
          projectionData[state.epsgCode].def,
          [boundingBox.right, boundingBox.top]
        );
        projectedBoundingBox = {};
        projectedBoundingBox.left = projectedNE[0];
        projectedBoundingBox.bottom = projectedNE[1];
        projectedBoundingBox.right = projectedSW[0];
        projectedBoundingBox.top = projectedSW[1];
      } else {
        projectedBoundingBox = boundingBox;
      }

      if (pointFeatureIndex !== undefined) {
        let resultIds = pointFeatureIndex.range(
          projectedBoundingBox.left,
          projectedBoundingBox.bottom,
          projectedBoundingBox.right,
          projectedBoundingBox.top
        );
        for (const id of resultIds) {
          const f = allFeatures[id];
          pointFeaturesHits.push(allFeatures[id]);
        }

        pointFeaturesHits.sort((a, b) => {
          if (a.geometry.coordinates[1] === b.geometry.coordinates[1]) {
            return a.geometry.coordinates[0] - b.geometry.coordinates[0];
          } else {
            return b.geometry.coordinates[1] - a.geometry.coordinates[1];
          }
        });
      }

      if (polyFeatureIndex !== undefined) {
        otherFeaturesHits = findInFlatbush(
          polyFeatureIndex,
          bboxPolygon([
            projectedBoundingBox.left,
            projectedBoundingBox.bottom,
            projectedBoundingBox.right,
            projectedBoundingBox.top,
          ]),
          otherFeatures
        );
      }

      featureHits = [...pointFeaturesHits, ...otherFeaturesHits];
    } else {
      featureHits = allFeatures;
    }
    let _shownFeatures = [];
    let i = 0;

    for (const f of featureHits || []) {
      const nf = {
        selected: false,
        index: i++,
        ...f,
      };
      _shownFeatures.push(nf);
    }

    if (selectedIndexState.forced === false) {
      if (selectedFeature === undefined && selectedIndex !== 0) {
        setSelectedIndex(0);
      } else if (selectedFeature !== undefined) {
        const found = _shownFeatures.find((testfeature) => selectedFeature.id === testfeature.id);

        if (found !== undefined) {
          if (found.index !== selectedIndex) {
            setSelectedIndex(found.index);
            return;
          }
        } else {
          if (0 !== selectedIndex) {
            setSelectedIndex(0);
            return;
          }
        }
      }
    }

    let sf;
    try {
      sf = _shownFeatures[selectedIndex];
      sf.selected = true;
    } catch (e) {}
    setX.setSelectedFeature(sf);
    if (selectedIndexState.forced === true) {
      setSelectedIndex(selectedIndex); //set forced=false
    }
    setX.setShownFeatures(_shownFeatures);
  }, [
    state.epsgCode,
    boundingBox,
    pointFeatureIndex,
    polyFeatureIndex,
    allFeatures,
    selectedIndexState,
  ]);

  const load = (url) => {
    getItems({ itemsUrl: url, ...setX, name: featureCollectionName, convertItemToFeature });
  };

  // effect on start
  useEffect(() => {
    if (itemsURL) {
      load(itemsURL);
    }
  }, []);

  if (enabled === true) {
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider
          value={{
            dispatch,
            ...setX,
            load,
            setSelectedFeatureIndex,
            setSelectedFeatureByPredicate,
            next,
            prev,
            fitBoundsForCollection,
          }}
        >
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  } else {
    return (
      <StateContext.Provider value={undefined}>
        <DispatchContext.Provider
          value={{
            undefined,
          }}
        >
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  }
};

export default FeatureCollectionContextProvider;

export {
  FeatureCollectionContextProvider,
  StateContext as FeatureCollectionContext,
  DispatchContext as FeatureCollectionDispatchContext,
};
