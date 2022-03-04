import React, { useContext, useEffect } from "react";
import MapLibreLayerBaseComponent from "./MapLibreLayerBaseComponent";
import maplibreGl from "maplibre-gl";
import { customOfflineFetch, getBufferedJSON } from "../tools/offlineMapsHelper";
import { OfflineLayerCacheContext } from "../contexts/OfflineLayerCacheContextProvider";

const fetchy = (url, callback) => {
  fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) => {
      callback(null, buf, null, null);
    });
};

const MapLibreLayer = (_props) => {
  const [ready, setReady] = React.useState(!_props.offlineAvailable);
  const [props, setProps] = React.useState(_props);
  const { offlineCacheConfig } = useContext(OfflineLayerCacheContext) || {
    offlineCacheConfig: undefined,
  };

  useEffect(() => {
    (async () => {
      if (props.offlineAvailable) {
        maplibreGl.addProtocol("indexedDB", (params, callback) => {
          let url = params.url.replace("indexedDB://", "");
          if (url.indexOf("______/fonts/") > -1) {
            console.log("no interception for", url);
            fetchy(url, callback);
          } else {
            customOfflineFetch(url, offlineCacheConfig).then((buffer) => {
              if (buffer) {
                callback(null, buffer, null, null);
              } else {
                callback(null, new ArrayBuffer(), null, null);
              }
            });
          }
          return {
            cancel: () => {
              console.log("Cancel not implemented");
            },
          };
        });

        //fetch an manipulate the style and metadata json
        let style;

        try {
          style = await getBufferedJSON(props.style); //(await (await fetch(props.style)).json();
          //add "indexdDB" protocoll to all urls
          style.glyphs = "indexedDB://" + style.glyphs;
          //don't use cache for sprites since the add protocol mechanism doesn't work for sprites
          //   style.sprite = "indexedDB://" + style.sprite;
          for (const datapackage of Object.keys(style.sources)) {
            console.log("offlineStyle datapackage", datapackage);
            const url = style.sources[datapackage].url;
            delete style.sources[datapackage].url;
            const dp = await getBufferedJSON(url); //await (await fetch(url)).json();
            for (let i = 0; i < dp.tiles.length; i++) {
              dp.tiles[i] = "indexedDB://" + dp.tiles[i];
            }
            delete dp.type; // = "vector";
            style.sources[datapackage] = { ...style.sources[datapackage], ...dp };
            const newProps = { ...props };
            newProps.style = style;
            setProps(newProps);
            console.log("offlineStyle", newProps.style);
          }
          setReady(true);
        } catch (e) {
          console.log("offlineStyleException", e);
        }
      }
    })();
  }, []);

  if (ready) {
    return <MapLibreLayerBaseComponent {...props} />;
  } else {
    return null;
  }
};

export default MapLibreLayer;
