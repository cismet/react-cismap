import { starkregenConstants } from "../../constants";

const overridingBaseLayerConf = {
  namedStyles: {
    default: { opacity: 0.6 },
    night: {
      opacity: 0.9,
      "css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)",
    },
    blue: {
      opacity: 1.0,
      "css-filter": "filter:sepia(0.5) hue-rotate(155deg) contrast(0.9) opacity(0.9) invert(0)",
    },
  },
  defaults: {
    wms: {
      format: "image/png",
      tiled: "true",
      maxZoom: 22,
      opacity: 0.6,
      version: "1.1.1",
    },
  },
  namedLayers: {
    rvr: {
      type: "wms",
      url: "https://geodaten.metropoleruhr.de/spw2/service",
      layers: "spw2_light",
      tiled: "false",
      version: "1.3.0",
    },
    nrwDOP: {
      type: "wms",
      url: "https://www.wms.nrw.de/geobasis/wms_nw_dop",
      layers: "nw_dop_rgb",
      tiled: "false",
      version: "1.1.1",
    },
    cismetLight: {
      type: "vector",
      attribution:
        'Hintergrundkarte basierend auf &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> Vektorkarte',
      style: "https://omt-germany.cismet.de/styles/cismet-light/style.json",
    },
  },
};

const config = {
  upperleftX: 868414.213,
  upperleftY: 6637094.997,
  pixelsize: 1.58951027354417,
  minAnimationZoom: 17,
  minFeatureInfoZoom: 19,
  rasterfariURL: "https://rasterfari-olpe.cismet.de",
  modelWMS: "https://starkregen-olpe.cismet.de/geoserver/wms?SERVICE=WMS",
  hideMeasurements: true,
  simulations: [
    {
      depthLayer: "starkregen:ST100_depth",
      velocityLayer: "starkregen:ST100_velocity",
      directionsLayer: "starkregen:ST100_direction",
      depthStyle: "starkregen:depth-blue",
      velocityStyle: "starkregen:velocity",
      directionStyle: "starkregen:direction",
      animation: "90mm/",
      name: "Stärke 7",
      title: "Starkregen SRI 7 (52,10 l/m² in 1h",
      icon: "bar-chart",
      subtitle:
        "Simulation eines einstündigen Starkregens mit 52,10 Liter/m² Niederschlag (Starkregenindex SRI 7) in ganz Olpe, statistische Wiederkehrzeit 100 Jahre",
    },

    {
      depthLayer: "starkregen:S90mm_depth ",
      velocityLayer: "starkregen:S90mm_velocity",
      directionsLayer: "starkregen:S90mm_direction",
      depthStyle: "starkregen:depth-blue",
      velocityStyle: "starkregen:velocity",
      directionStyle: "starkregen:direction",
      animation: "T100/",
      name: "Stärke 10",
      icon: "bitbucket",
      title: "Starkregen SRI 10 (90 l/m² in 1h)",
      subtitle:
        "Simulation eines einstündigen Starkregens mit 90 Liter/m² Niederschlag (Starkregenindex SRI 10) in ganz Olpe",
    },
  ],
  backgrounds: [
    {
      layerkey: "cismetLight@100",
      src: "/images/rain-hazard-map-bg/citymapGrey.png",
      title: "Stadtplan (grau)",
    },
    {
      layerkey: "nrwDOP@60|rvr@30",
      src: "/images/rain-hazard-map-bg/ortho.png",
      title: "Luftbildkarte",
    },
    {
      layerkey: "rvr@50",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan (bunt)",
    },
  ],
  heightsLegend: [
    { title: "20 cm", lt: 0.1, bg: "#88B2EA" },
    { title: "40 cm", lt: 0.3, bg: "#508CE0" },
    { title: "75 cm", lt: 0.5, bg: "#3266B4" },
    { title: "100 cm", lt: 1.0, bg: "#5018B3" },
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
