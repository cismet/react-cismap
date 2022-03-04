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

export const customOfflineFetch = async (url, options, callback) => {
  const CONSOLEDEBUG = options?.consoleDebug;

  try {
    for (const rule of options.rules) {
      if (url.startsWith(rule.origin)) {
        if (CONSOLEDEBUG) console.log("cismap offline vector map helper:: intercept " + url);
        if (url.indexOf("sprite") > -1) {
          console.log("XXXX sprite");
        }

        const path = decodeURIComponent(rule.cachePath + url.replace(rule.origin, ""));

        const hit = await db[OBJECTSTORE].get(path);
        if (hit) {
          if (CONSOLEDEBUG)
            console.log("cismap offline vector map helper:: found a cache entry for " + path + ".");

          callback(null, hit.value.buffer, null, null);
          return;
        } else {
          if (CONSOLEDEBUG)
            console.log(
              "cismap offline vector map helper:: missed a cache entry for " +
                path +
                " (" +
                url +
                ")."
            );
          if (rule.realServerFallback === true) {
            console.log("cismap offline vector map helper:: try to fix miss online");
            try {
              fetch(url)
                .then((res) => res.arrayBuffer())
                .then((buf) => {
                  callback(null, buf, null, null);
                  return;
                });
            } catch (e) {
              console.log(
                "cismap offline vector map helper:: empty Response because of the exception in retry",
                e
              );
            }
          } else {
            console.log("cismap offline vector map helper:: empty Response because of the miss");
          }
        }
      }
    }
    if (CONSOLEDEBUG) console.log("cismap offline vector map helper:: non interception for " + url);
  } catch (e) {
    if (CONSOLEDEBUG) console.log("cismap offline vector map helper:: Error in cachedFetch", e);
  }
};

export const getBufferedJSON = async (url) => {
  const prefix = "_bufferedJSON4Url.";
  try {
    const response = await fetch(url);
    const obj = await response.json();
    db[OBJECTSTORE].put({ key: prefix + url, value: JSON.stringify(obj) });
    return obj;
  } catch (e) {
    // probably offline
    const buffered = await db[OBJECTSTORE].get(prefix + url);
    if (buffered) {
      console.log("probably offline. will server stuff from cache fro url ", url);
      return JSON.parse(buffered.value);
    } else {
      console.log("Error during getting buffered JSON (" + url + ")", e);
    }
  }
};

export const loadAndCacheOfflineMapData = async (offlineConfig = {}, setCacheInfoForKey) => {
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
  if (CONSOLEDEBUG) console.log("caching cismap offline vector map data:: startup");
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
