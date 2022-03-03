import Dexie from "dexie";
import * as fflate from "fflate";
import { useEffect, useState } from "react";

const DBVERSION = 1;
const DBNAME = "cismap-offline-data";
const OBJECTSTORE = "cismap-offline-data-cache";
const db = new Dexie(DBNAME);

const storeDef = {};
storeDef[OBJECTSTORE] = "key";

db.version(DBVERSION).stores(storeDef);

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const extendSW4OfflineMaps = (sw) => {
  const self = sw;

  self.addEventListener("activate", (evt) => {
    console.log("Extended ServiceWorker with cismap offline maps support activated");
  });

  let globalOfflineConfig;

  self.addEventListener("message", (event) => {
    if (event?.data?.config?.consoleDebug)
      console.log("cismap offline vector map SW messageEvent", event);
    if (event.data && event.data.type === "SET_CISMAP_OFFLINE_CONFIG") {
      globalOfflineConfig = event.data.config;
      console.log("cismap offline vector consfiguration set:", globalOfflineConfig);
    }
  });

  const cachedFetch = async (req) => {
    const CONSOLEDEBUG = globalOfflineConfig?.consoleDebug;
    try {
      for (const rule of globalOfflineConfig.rules) {
        if (req.url.startsWith(rule.origin)) {
          if (rule.block === true) {
            if (CONSOLEDEBUG) console.log("cismap offline vector map SW:: blocked request");

            return new Response();
          } else {
            if (CONSOLEDEBUG) console.log("cismap offline vector map SW:: intercept " + req.url);

            const path = decodeURIComponent(rule.cachePath + req.url.replace(rule.origin, ""));

            const hit = await db[OBJECTSTORE].get(path);
            if (hit) {
              if (CONSOLEDEBUG)
                console.log("cismap offline vector map SW:: found a cache entry for " + path + ".");
              return new Response(hit.value);
            } else {
              if (CONSOLEDEBUG)
                console.log(
                  "cismap offline vector map SW:: missed a cache entry for " +
                    path +
                    " (" +
                    req.url +
                    ")."
                );
              if (rule.realServerFallback === true) {
                console.log("cismap offline vector map SW:: try to fix miss online");
                try {
                  return await fetch(req);
                } catch (e) {
                  console.log(
                    "cismap offline vector map SW:: empty Response because of the exception in retry",
                    e
                  );
                  return new Response();
                }
              } else {
                console.log("cismap offline vector map SW:: empty Response because of the miss");
                return new Response();
              }
            }
          }
        }
      }
      if (CONSOLEDEBUG)
        // console.log(
        //   "cismap offline vector map SW:: non interception for " + req.url,
        //   offlineConfig
        // );
        return await fetch(req);
    } catch (e) {
      if (CONSOLEDEBUG) console.log("cismap offline vector map SW:: Error in cachedFetch", e);
    }
    return await fetch(req);
  };

  self.addEventListener("fetch", (fetchEvent) => {
    fetchEvent.respondWith(cachedFetch(fetchEvent.request));
  });
};

export const loadAndCacheOfflineMapData = async (offlineConfig = {}, setCacheInfoForKey) => {
  configureOfflineMapDataInterceptor(offlineConfig);

  const addCacheInfo = (key, info) => {
    // setCacheInfo((old) => {
    //   let ret = JSON.parse(JSON.stringify(old));
    //   ret[key] = info;
    //   console.log("addCacheInfo", ret);

    //   return ret;
    // });
    setCacheInfoForKey(key, info);
  };
  const CONSOLEDEBUG = offlineConfig?.consoleDebug;
  if (CONSOLEDEBUG) console.log("caching cismap offline vector map data:: startup #2");
  if (offlineConfig?.dataStores && Array.isArray(offlineConfig.dataStores)) {
    for (const dataStore of offlineConfig.dataStores) {
      addCacheInfo(dataStore.key, "loading");
      const hit = await db[OBJECTSTORE].get("md5." + dataStore.key);
      const cacheMD5 = hit?.value;

      if (CONSOLEDEBUG)
        console.log(
          "caching cismap offline vector map data:: md5 for " + dataStore.key + " in cache =",
          cacheMD5
        );
      let serverMD5 = undefined;
      let loadData = false;
      try {
        serverMD5 = await (
          await (await fetch(dataStore.url + ".md5", { method: "GET" })).text()
        ).trim();
      } catch (e) {
        console.log(
          "cismap offline vector map data:: error in fetching md5. will try to use cache."
        );
      }
      if (CONSOLEDEBUG)
        console.log(
          "caching cismap offline vector map data::  " +
            dataStore.url +
            ".md5 for " +
            dataStore.key +
            " on server =",
          serverMD5
        );

      if (serverMD5 !== undefined) {
        if (cacheMD5) {
          loadData = cacheMD5 !== serverMD5;
        } else {
          loadData = true;
        }
      }

      if (loadData) {
        if (CONSOLEDEBUG) console.time("caching cismap offline vector map data " + dataStore.key);
        const massiveFileBuf = await fetch(dataStore.url, {
          method: "GET",
          redirect: "follow",
        }).then((res) => {
          addCacheInfo(dataStore.key, "loaded");
          return res.arrayBuffer();
        });
        const massiveFile = new Uint8Array(massiveFileBuf);
        const decompressed = fflate.unzipSync(massiveFile);

        const items = [];
        for (const entryKey of Object.keys(decompressed)) {
          if (
            !entryKey.startsWith("_") &&
            !entryKey.endsWith(".DS_Store") &&
            decompressed[entryKey].length !== 0
          ) {
            items.push({ key: entryKey, value: decompressed[entryKey] });
          }
        }
        await await db[OBJECTSTORE].bulkPut(items);
        db[OBJECTSTORE].put({ key: "md5." + dataStore.key, value: serverMD5 });
        addCacheInfo(dataStore.key, "cache filled");
        if (CONSOLEDEBUG)
          console.log("caching cismap offline vector map data:: done (" + items.length + ")");

        if (CONSOLEDEBUG)
          console.timeEnd("caching cismap offline vector map data " + dataStore.key);
      } else {
        if (serverMD5) {
          addCacheInfo(dataStore.key, "cached data");
        } else {
          //serverMD% was undefined. propably we are offline. hope that the cache is ok.
          addCacheInfo(dataStore.key, "cache try");
        }

        if (CONSOLEDEBUG)
          console.log(
            "caching cismap offline vector map data:: dataStore for " +
              dataStore.key +
              " is up to date"
          );
      }
    }
  } else {
    console.log("caching cismap offline vector map data:: no dataStores found", offlineConfig);
  }
};

export const configureOfflineMapDataInterceptor = (offlineConfig) => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller && offlineConfig) {
    console.log("cismap offline vector map SW:: will set configuration", offlineConfig);

    navigator.serviceWorker.controller.postMessage({
      type: "SET_CISMAP_OFFLINE_CONFIG",
      config: offlineConfig,
    });
  } else {
    console.log("cismap offline vector map SW:: no service worker or offlineConfig available", {
      offlineConfig,
      navigator_serviceWorker: navigator.serviceWorker,
    });
  }
};

// export const useOfflineMapDataCache = (
//   offlineConfig,
//   delay = 1500,
//   loadingStateChangedNotifier
// ) => {
//   const [cacheInfo, _setCacheInfo] = useState({});
//   const [readyToUse, setReadyToUse] = useState(false);

//   const setCacheInfo = (x) => {
//     loadingStateChangedNotifier();
//     return _setCacheInfo(x);
//   };
//   useEffect(() => {
//     setTimeout(() => {
//       loadAndCacheOfflineMapData(offlineConfig, setCacheInfo).then(() => {
//         setReadyToUse(true);
//       });
//     }, delay);
//   }, []);

//   return { readyToUse, cacheInfo };
// };
