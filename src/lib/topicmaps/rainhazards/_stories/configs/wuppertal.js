import { starkregenConstants } from "../../constants";

const overridingBaseLayerConf = {};
// {
//   namedStyles: {
//     default: { opacity: 0.6 },
//     night: {
//       opacity: 0.9,
//       "css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)",
//     },
//     blue: {
//       opacity: 1.0,
//       "css-filter": "filter:sepia(0.5) hue-rotate(155deg) contrast(0.9) opacity(0.9) invert(0)",
//     },
//   },
//   defaults: {
//     wms: {
//       format: "image/png",
//       tiled: "true",
//       maxZoom: 22,
//       opacity: 0.6,
//       version: "1.1.1",
//     },
//   },
//   namedLayers: {
//     rvr: {
//       type: "wms",
//       url: "https://geodaten.metropoleruhr.de/spw2/service",
//       layers: "spw2_light",
//       tiled: "false",
//       version: "1.3.0",
//     },
//     nrwDOP: {
//       type: "wms",
//       url: "https://geodaten.metropoleruhr.de/dop/dop",
//       layers: "DOP",
//       tiled: "false",
//       version: "1.1.1",
//     },
//     cismetLight: {
//       type: "vector",
//       attribution:
//         'Hintergrundkarte basierend auf &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> Vektorkarte',
//       style: "https://omt-germany.cismet.de/styles/cismet-light/style.json",
//     },
//   },
// };

const config = {
  upperleftX: 780160.203, //take a depth3857.tif and run gdalinfo on it get the pixelsize and upperleftcorner info from there
  upperleftY: 6678245.042,
  pixelsize: 1.595781324768881,
  minAnimationZoom: 17,
  minFeatureInfoZoom: 19,
  // rasterfariURL: "https://starkregen-rasterfari-wuppertal.cismet.de",
  // modelWMS: "https://starkregen-maps-wuppertal.cismet.de/geoserver/wms?SERVICE=WMS",
  rasterfariURL: "https://rasterfari-wuppertal.cismet.de",
  modelWMS: "https://starkregen-wuppertal.cismet.de/geoserver/wms?SERVICE=WMS",
  simulations: [
    {
      depthLayer: "starkregen:S11_T50_depth",

      velocityLayer: "starkregen:S11_T50_velocity",
      directionsLayer: "starkregen:S11_T50_direction",
      depthStyle: "starkregen:depth",
      velocityStyle: "starkregen:velocity",
      directionStyle: "starkregen:direction",

      animation: "11_T50/",
      name: "Stärke 6",
      title: "Starkregen SRI 6 (38,5 l/m² in 2h)",
      icon: "bar-chart",
      subtitle:
        "Simulation eines zweistündigen Starkregens mit 38,5 Liter/m² Niederschlag (Starkregenindex SRI 6) in ganz Wuppertal, statistische Wiederkehrzeit 50 Jahre",
    },
    {
      depthLayer: "starkregen:S12_T100_depth",
      velocityLayer: "starkregen:S12_T100_velocity",
      directionsLayer: "starkregen:S12_T100_direction",
      depthStyle: "starkregen:depth",
      velocityStyle: "starkregen:velocity",
      directionStyle: "starkregen:direction",
      animation: "12_T100/",
      name: "Stärke 7",
      icon: "bar-chart",
      title: "Starkregen SRI 7 (42 l/m² in 2h)",
      subtitle:
        "Simulation eines zweistündigen Starkregens mit 42 Liter/m² Niederschlag (Starkregenindex SRI 7) in ganz Wuppertal, statistische Wiederkehrzeit 100 Jahre",
    },
    {
      depthLayer: "starkregen:S13_hN90mm_depth",
      velocityLayer: "starkregen:S13_hN90mm_velocity",
      directionsLayer: "starkregen:S13_hN90mm_direction",
      depthStyle: "starkregen:depth",
      velocityStyle: "starkregen:velocity",
      directionStyle: "starkregen:direction",
      animation: "13_hN90mm/",
      name: "Stärke 10",
      icon: "bitbucket",
      title: "Starkregen SRI 10 (90 l/m² in 1h)",
      subtitle:
        "Simulation eines einstündigen Starkregens mit 90 Liter/m² Niederschlag (Starkregenindex SRI 10) in ganz Wuppertal",
    },
    {
      depthLayer: "starkregen:S14_Naturregen_depth",
      velocityLayer: "starkregen:S14_Naturregen_velocity",
      directionsLayer: "starkregen:S14_Naturregen_direction",
      depthStyle: "starkregen:depth",
      velocityStyle: "starkregen:velocity",
      directionStyle: "starkregen:direction",
      animation: "14_Naturregen/",
      name: "29.05.18",
      icon: "calendar",
      title: "Regen vom 29.05.2018 (SRI 11)",
      subtitle:
        "Simulation des Starkregens vom 29.05.2018 (Starkregenindex SRI 11) für das gesamte Stadtgebiet anhand gemessener Niederschlagsmengen",
    },
  ],
  backgrounds: [
    {
      layerkey: "hillshade|bplan_abkg@30|wupp-plan-live@20",
      src: "/images/rain-hazard-map-bg/topo.png",
      title: "Top. Karte",
    },
    {
      layerkey: "trueOrtho2020@50|rvrSchrift@100|wupp-plan-live@20",
      src: "/images/rain-hazard-map-bg/ortho.png",
      title: "Luftbildkarte",
    },
    {
      layerkey: "wupp-plan-live@40",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
  ],
  heightsLegend: [
    { title: "20 cm", lt: 0.1, bg: "#AFCFF9" },
    { title: "40 cm", lt: 0.3, bg: "#FED27B" },
    { title: "75 cm", lt: 0.5, bg: "#E9B279" },
    { title: "100 cm", lt: 1.0, bg: "#DD8C7B" },
  ],
  velocityLegend: [
    { title: "0.5 m/s", lt: 0.1, bg: "#BEC356" },
    { title: "2 m/s", lt: 1, bg: "#DA723E" },
    { title: "4 m/s", lt: 3, bg: "#D64733" },
    { title: "6 m/s", lt: 5, bg: "#8F251B" },
  ],
};

const initialState = {
  displayMode: starkregenConstants.SHOW_HEIGHTS,
  modelLayerProblem: false,
  featureInfoModeActivated: false,
  currentFeatureInfoValue: undefined,
  currentFeatureInfoSelectedSimulation: undefined,
  currentFeatureInfoPosition: undefined,
  minifiedInfoBox: false,
  selectedSimulation: 0,
  backgroundLayer: undefined,
  selectedBackground: 0,
  animationEnabled: true,
};

export default { config, overridingBaseLayerConf, initialState };
