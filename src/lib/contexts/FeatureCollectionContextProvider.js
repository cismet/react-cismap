import { useImmer } from "use-immer";
import React, { useState, useEffect, useContext } from "react";
import { fetchJSON, md5FetchJSON } from "../tools/fetching";
import Flatbush from "flatbush";
import KDBush from "kdbush";
import { TopicMapContext } from "./TopicMapContextProvider";
import { getSymbolSVGGetter } from "../tools/uiHelper";
import bboxPolygon from "@turf/bbox-polygon";
import booleanIntersects from "@turf/boolean-intersects";
const defaultState = {
  items: undefined,
  filteredItems: undefined,
  filterState: undefined,
  filterMode: undefined,
  itemFilterFunction: undefined,
  filterFunction: undefined,
  allFeatures: undefined,
  shownFeatures: undefined,
  selectedFeature: undefined,
  featureIndex: undefined,
  selectedIndexState: {
    selectedIndex: 0,
    forced: false,
  },
  clusteringEnabled: false,
  clusteringOptions: undefined,
};

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const getItems = async ({
  setItems,
  itemsUrl,
  convertItemToFeature = (itemIsFeature) => itemIsFeature,
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
  itemsURL,
  featureCollectionName,
  convertItemToFeature,
  itemFilterFunction,
  filterFunction,
}) => {
  const [state, dispatch] = useImmer({
    ...defaultState,
    getFeatureStyler,
    getColorFromProperties,
    clusteringEnabled,
    clusteringOptions,
    getSymbolSVG,
    itemFilterFunction,
    filterFunction,
  });

  const { boundingBox } = useContext(TopicMapContext);
  const set = (prop) => {
    return (x) => {
      dispatch((state) => {
        state[prop] = x;
      });
    };
  };
  const { featureIndex, allFeatures, shownFeatures, selectedIndexState, selectedFeature } = state;
  const selectedIndex = selectedIndexState.selectedIndex;

  const setX = {
    setItems: set("items"),
    setFilteredItems: set("filteredItems"),
    setFilterState: set("filterState"),
    setFilterMode: set("filterMode"),
    setFilterFunction: set("filterFunction"),
    setItemFilterFunction: set("itemFilterFunction"),
    setAllFeatures: set("allFeatures"),
    setShownFeatures: set("shownFeatures"),
    setSelectedFeature: set("selectedFeature"),
    setFeatureIndex: set("featureIndex"),
    setSelectedIndexState: set("selectedIndexState"),
    setClusteringEnabled: set("clusteringEnabled"),
  };

  const setSelectedFeatureIndex = (selectedIndex) => {
    setX.setSelectedIndexState({ selectedIndex, forced: true }); //overrules keep index when boundingbox is changed
  };

  const setSelectedIndex = (selectedIndex) => {
    setX.setSelectedIndexState({ selectedIndex, forced: false });
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
  // console.log("FeatureCollectionContextProvider state", state);

  // effect when items are changed
  useEffect(() => {
    //async start
    (async () => {
      if (state.filteredItems) {
        const features = [];
        let id = 0;
        for (const item of state.filteredItems) {
          const f = await convertItemToFeature(item);
          f.selected = false;
          f.id = id++;

          features.push(f);
        }

        setX.setAllFeatures(features);
        setX.setFeatureIndex(
          new KDBush(
            features,
            (p) => p.geometry.coordinates[0],
            (p) => p.geometry.coordinates[1]
          )
        );
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
          state.itemFilterFunction({ filterState: state.filterState, filterMode: state.filterMode })
        );
      } else {
        filteredItems = state.items;
      }
      setX.setFilteredItems(filteredItems);
      // console.log("filteredItems", filteredItems);
    }
  }, [state.filterState, state.filterMode, state.filterFunction, state.items]);

  //effect when boundingBox or selection changed
  useEffect(() => {
    let features = [];
    if (boundingBox !== undefined && featureIndex !== undefined) {
      let resultIds = featureIndex.range(
        boundingBox.left,
        boundingBox.bottom,
        boundingBox.right,
        boundingBox.top
      );
      for (const id of resultIds) {
        const f = allFeatures[id];
        features.push(allFeatures[id]);
      }

      features.sort((a, b) => {
        if (a.geometry.coordinates[1] === b.geometry.coordinates[1]) {
          return a.geometry.coordinates[0] - b.geometry.coordinates[0];
        } else {
          return b.geometry.coordinates[1] - a.geometry.coordinates[1];
        }
      });
    } else {
      features = allFeatures;
    }
    let i = 0;

    let _shownFeatures = [];
    let bbPoly;
    if (boundingBox) {
      bbPoly = bboxPolygon([
        boundingBox.left,
        boundingBox.bottom,
        boundingBox.right,
        boundingBox.top,
      ]);
    }

    const nonPoints = allFeatures?.filter((test) => {
      if (bbPoly !== undefined && test?.geometry?.type !== "Point") {
        return booleanIntersects(test, bbPoly);
      }
      return false;
    });
    if (features && nonPoints) {
      features = [...features, ...nonPoints];
    }

    for (const f of features || []) {
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
  }, [boundingBox, featureIndex, allFeatures, selectedIndexState]);

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
            next,
            prev,
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
