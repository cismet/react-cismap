import React, { useContext, useEffect, useState } from "react";
import StyledWMSTileLayer from "./StyledWMSTileLayer";
import NonTiledWMSLayer from "./NonTiledWMSLayer";
import { TileLayer } from "react-leaflet";
import MapLibreLayer from "./vector/MapLibreLayer";
import GraphqlLayer from "./GraphqlLayer";
import { TopicMapContext } from "./contexts/TopicMapContextProvider";
import { use } from "react";

const defaults = {
  wms: {
    format: "image/png",
    maxZoom: 22,
    opacity: 0.6,
    version: "1.1.1",
    pane: "backgroundLayers",
    tiled: false,
  },
  vector: {},
};

export default function CismapLayer(props) {
  const { routedMapRef } = useContext(TopicMapContext);
  const [additionalLayerUniquePaneCreated, setAdditionalLayerUniquePaneCreated] = useState(false);
  let paneName = props.pane;
  if (props.additionalLayerUniquePane) {
    paneName = "dynamic-additionalLayer-" + props.additionalLayerUniquePane;
  }

  useEffect(() => {
    if (routedMapRef && props.additionalLayerUniquePane) {
      const leafletMap = routedMapRef.leafletMap.leafletElement;
      if (leafletMap && !leafletMap.getPane(paneName)) {
        // console.log('xxx try to createPane(paneName); ', paneName, props.additionalLayersFreeZOrder);
        leafletMap.createPane(paneName);
        //set zIndex to 250 + props.additionalLayersFreeZOrder
        leafletMap.getPane(paneName).style.zIndex = 250 + props.additionalLayersFreeZOrder
        // console.log('xxx tried to createPane(paneName); ', leafletMap.getPane(paneName));
        setAdditionalLayerUniquePaneCreated(true);
      } else if (leafletMap && leafletMap.getPane(paneName)) {
        // console.log('xxx pane already exists', paneName, props.additionalLayersFreeZOrder);
        leafletMap.getPane(paneName).style.zIndex = 250 + props.additionalLayersFreeZOrder;

      }

    }


  }, [routedMapRef, props.additionalLayerUniquePane, props.additionalLayersFreeZOrder]);


  if (props.type === undefined) {
    console.error("CismapLayer: type not set", props);
    return null;
  } else if (routedMapRef && (props.additionalLayerUniquePane === undefined || additionalLayerUniquePaneCreated === true)) {
    let opacity = props.opacity;
    if (opacity === undefined || opacity === null) {
      opacity = 1;
    }
    if (props.opacityFunction) {
      opacity = props.opacityFunction(opacity);
    }
    switch (props.type) {
      case "wms":
      case "wmts": {
        let params = { ...defaults.wms, ...props, opacity, pane: paneName };
        return <StyledWMSTileLayer {...params} />;
      }
      case "wms-nt":
      case "wmts-nt": {
        let params = { ...defaults.wms, ...props, opacity, pane: paneName };
        return <NonTiledWMSLayer {...params} />;
      }

      case "tiles": {
        let params = { ...defaults.wms, ...props, opacity, pane: paneName };
        return <TileLayer {...params} />;
      }
      case "vector": {
        let params = { ...defaults.vector, ...props, opacity, pane: paneName };
        return <MapLibreLayer {...params} />;
      }
      case "graphql": {
        let params = { ...defaults.graphql, ...props, opacity, pane: paneName };
        return <GraphqlLayer {...params} />;
      }
    }
  }
}
