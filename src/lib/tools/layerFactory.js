import React from "react";
import { namedStyles } from "../constants/layers";
import objectAssign from "object-assign";
import { TileLayer } from "react-leaflet";
import StyledWMSTileLayer from "../StyledWMSTileLayer";
import NonTiledWMSLayer from "../NonTiledWMSLayer";
import MapLibreLayer from "../vector/MapLibreLayer";
export default function getLayers(
  layerString,
  namedMapStyle = "default",
  config = {
    layerSeparator: "|"
  },
  layerConfig
) {
  let namedStylesConfig = namedStyles;
  const layerArr = (layerString || "").split(config.layerSeparator || "|");
  let namedMapStyleExtension = namedMapStyle;
  if (namedMapStyleExtension === null || namedMapStyleExtension === "") {
    namedMapStyleExtension = "default";
  }
  namedMapStyleExtension = "." + namedMapStyleExtension;
  const getLayer = (layerWithNamedStyleExtension, options = {}) => {
    const layerAndNamedStyleArray = layerWithNamedStyleExtension.split(".");
    let namedStyleOptions = {};

    if (layerAndNamedStyleArray.length > 1) {
      //the last named style is overriding the ones before
      let first = true;
      for (const element of layerAndNamedStyleArray) {
        if (first) {
          first = false;
        } else {
          namedStyleOptions = objectAssign({}, namedStyleOptions, namedStylesConfig[element]);
        }
      }
    }
    let mergedOptions = objectAssign({}, namedStyleOptions, options);
    // const layerGetter = Layers.get(layerAndNamedStyleArray[0]);
    const layerGetter = createLayerFactoryFunction(layerAndNamedStyleArray[0], layerConfig);
    if (layerGetter) {
      return layerGetter(mergedOptions);
    } else {
      return null;
    }
  };

  return (
    <div key={"layer." + layerString}>
      {layerArr.map(layerWithOptions => {
        const layOp = layerWithOptions.split("@");
        if (!isNaN(parseInt(layOp[1], 10))) {
          const layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;

          const layerOptions = {
            opacity: parseInt(layOp[1] || "100", 10) / 100.0
          };
          return getLayer(layerWithNamedStyleExtension, layerOptions);
        }
        if (layOp.length === 2) {
          try {
            let layerOptions = JSON.parse(layOp[1]);
            let layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;
            return getLayer(layerWithNamedStyleExtension, layerOptions);
          } catch (error) {
            console.error(error);
            console.error(
              "Problems during parsing of the layer options. Skip options. You will get the 100% Layer:" +
                layOp[0]
            );
            const layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;
            return getLayer(layerWithNamedStyleExtension);
          }
        } else {
          const layerWithNamedStyleExtension = layOp[0] + namedMapStyleExtension;
          return getLayer(layerWithNamedStyleExtension);
        }
      })}
    </div>
  );
}

const createLayerFactoryFunction = (key, _conf = defaultLayerConf) => {
  let conf = {
    namedStyles: defaultLayerConf.namedStyles,
    defaults: defaultLayerConf.defaults,
    ..._conf
  };

  switch ((conf.namedLayers[key] || {}).type) {
    case "wms":
    case "wmts":
      return options => {
        let params = { ...conf.defaults.wms, ...conf.namedLayers[key] };
        // console.log('params for ' + key, params);
        return (
          <StyledWMSTileLayer
            key={key + JSON.stringify(options)}
            {...params}
            opacity={options.opacity}
            cssFilter={options["css-filter"]}
          />
        );
      };
    case "wms-nt":
    case "wmts-nt":
      return options => {
        let params = { ...conf.defaults.wms, ...conf.namedLayers[key] };
        // console.log('params for ' + key, params);
        return (
          <NonTiledWMSLayer
            key={key + JSON.stringify(options)}
            {...params}
            type={params.type.replace("-nt", "")}
            opacity={options.opacity}
          />
        );
      };
    case "tiles":
      return options => {
        let params = { ...conf.defaults.wms, ...conf.namedLayers[key] };
        console.log("params for " + key, params);

        return (
          <TileLayer
            key={key + JSON.stringify(options)}
            {...params}
            opacity={options.opacity}
            cssFilter={options["css-filter"]}
          />
        );
      };
    case "vector":
      return options => {
        let params = { ...conf.defaults.vector, ...conf.namedLayers[key] };
        // console.log("params for " + key, params);

        return (
          <MapLibreLayer
            key={key + JSON.stringify(options)}
            {...params}
            // opacity={options.opacity}
            // cssFilter={options["css-filter"]}
          />
        );
      };
  }
};

export const defaultLayerConf = {
  namedStyles: {
    default: { opacity: 0.6 },
    night: {
      opacity: 0.9,
      "css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)"
    },
    blue: {
      opacity: 1.0,
      "css-filter": "filter:sepia(0.5) hue-rotate(155deg) contrast(0.9) opacity(0.9) invert(0)"
    }
  },
  defaults: {
    wms: {
      format: "image/png",
      tiled: "true",
      maxZoom: 22,
      opacity: 0.6,
      version: "1.1.1",
      pane: "backgroundLayers"
    }
  },
  namedLayers: {
    osm: {
      type: "wms",
      url: "https://ows.mundialis.de/services/service?",
      layers: "OSM-WMS",
      tiled: false
    },
    osm2: {
      type: "wms",
      url: "https://ows.terrestris.de/osm/service?",
      layers: "OSM-WMS",
      tiled: false
    },
    abkf: {
      type: "wms",
      url: "https://wunda-geoportal-cache.cismet.de/geoportal",
      layers: "abkf"
    },
    nrs: {
      type: "wms",
      url: "https://wunda-geoportal-cache.cismet.de/geoportal",
      layers: "R102%3Astadtgrundkarte_hausnr",
      transparent: "true"
    },
    abkg: {
      type: "wms",
      url: "https://wunda-geoportal-cache.cismet.de/geoportal",
      layers: "abkg"
    },
    bplan_abkg: {
      type: "wms",
      url: "https://maps.wuppertal.de/deegree/wms",
      layers: "bplanreihe"
    },
    bplan_abkg_cached: {
      type: "wms",
      url: "https://wunda-geoportal-cache.cismet.de/geoportal",
      layers: "bplanreihe"
    },
    bplan_abkg_uncached: {
      type: "wms",
      url: "https://maps.wuppertal.de/deegree/wms",
      layers: "bplanreihe"
    },
    bplan_ovl: {
      type: "wms",
      url: "https://maps.wuppertal.de/deegree/wms",
      layers: "bplanhintergrund"
    },
    bplan_ovl_cached: {
      type: "wms",
      url: "https://wunda-geoportal-cache.cismet.de/geoportal",
      layers: "bplanhintergrund"
    },
    abkIntra: {
      type: "wms",
      url: "http://s10221:7098/alkis/services",
      layers: "alkomf"
    },
    uwBPlan: {
      type: "wms",
      url: "https://maps.wuppertal.de/deegree/wms",
      layers: "bplanreihe,bplanhintergrund"
    },
    uwBPlanCached: {
      type: "wms",
      url: "https://wunda-geoportal-cache.cismet.de/geoportal",
      layers: "bplanreihe,bplanhintergrund"
    },
    webatlas: {
      type: "wms",
      url: "https://sg.geodatenzentrum.de/wms_webatlasde__60d825c3-a2c2-2133-79c0-48721caab5c3?",
      layers: "webatlasde",
      tiled: "false"
    },
    rvrSchriftNT: {
      type: "wmts-nt",
      url: "https://geodaten.metropoleruhr.de/dop/dop_overlay?language=ger",
      layers: "dop_overlay",
      version: "1.3.0",
      tiled: false,
      transparent: true,
      buffer: 50
    },
    rvrSchrift: {
      type: "wmts",
      url: "https://geodaten.metropoleruhr.de/dop/dop_overlay?language=ger",
      layers: "dop_overlay",
      version: "1.3.0",
      tiled: false,
      transparent: true
    },
    rvrSchrift2: {
      type: "wms",
      url: "https://geodaten.metropoleruhr.de/spw2/service",
      layers: "spw2_schrift",
      version: "1.3.0",
      tiled: false,
      transparent: true
    },
    rvrGrundriss: {
      type: "wmts",
      url: "https://geodaten.metropoleruhr.de/spw2/service",
      layers: "spw2_light_grundriss",
      version: "1.3.0",
      transparent: true,
      tiled: false
    },
    ruhrWMS: {
      type: "wms",
      url: "https://geodaten.metrotadtpoleruhr.de/spw2/service",
      layers: "spw2_light",
      tiled: "false",
      version: "1.3.0"
    },
    rvrGrau: {
      type: "wms",
      url: "https://geodaten.metropoleruhr.de/spw2/service",
      layers: "spw2_graublau",
      tiled: "false",
      version: "1.3.0"
    },
    empty: {
      type: "wms",
      url: "-",
      layers: "-",
      tiled: "false",
      version: "1.3.0"
    },
    "wupp-plan-live": {
      type: "wms",
      url: "https://geodaten.metropoleruhr.de/spw2/service",
      layers: "spw2_light",
      tiled: "false",
      version: "1.3.0"
    },

    orthoIntra: {
      type: "wms",
      url: "http://s10221:7098/orthofotos/services",
      layers: "WO2018",
      transparent: true
    },
    trueOrthoIntra: {
      type: "wms",
      url: "http://s10221:7098/orthofotos/services",
      layers: "WTO2018",
      transparent: true
    },
    trueOrtho2018: {
      type: "wms",
      url: "https://maps.wuppertal.de/deegree/wms",
      layers: "R102:trueortho201810",
      transparent: true
    },
    trueOrtho2020: {
      type: "wms",
      url: "https://maps.wuppertal.de/deegree/wms",
      layers: "R102:trueortho202010",
      transparent: true
    },
    hillshade: {
      type: "wms",
      url: "https://maps.wuppertal.de/deegree/wms",
      layers: "hillshade"
    },
    trueOrtho2018Cached: {
      type: "wms",
      url: "https://wunda-geoportal-cache.cismet.de/geoportal",
      layers: "R102:trueortho201810"
    },
    trueOrtho2020Cached: {
      type: "wms",
      url: "https://wunda-geoportal-cache.cismet.de/geoportal",
      layers: "R102:trueortho202010"
    },
    hillshadeCached: {
      type: "wms",
      url: "https://wunda-geoportal-cache.cismet.de/geoportal",
      layers: "hillshade"
    },
    ESRILayer: {
      type: "tiles",
      url:
        "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      maxZoom: 22,
      maxNativeZoom: 18
    },
    CartoLayer: {
      type: "tiles",
      url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        "&copy; <a href=&quot;http://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors, &copy; <a href=&quot;https://carto.com/attributions&quot;>CARTO</a>",
      maxNativeZoom: 19,
      maxZoom: 22
    },
    LocalOMT_Klokantech_basic: {
      type: "vector",
      style: "http://localhost:888/styles/klokantech-basic/style.json"
    },
    LocalOMT_OSM_bright: {
      type: "vector",
      style: "http://localhost:888/styles/osm-bright/style.json"
    },
    OMT_Klokantech_basic: {
      type: "vector",
      style: "https://omt.map-hosting.de/styles/klokantech-basic/style.json"
    },
    OMT_OSM_bright: {
      type: "vector",
      style: "https://omt.map-hosting.de/styles/osm-bright/style.json"
    }
  }
};
