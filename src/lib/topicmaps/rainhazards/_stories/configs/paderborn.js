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
  rasterfariURL: "https://rasterfari-paderborn.cismet.de",
  modelWMS: "https://starkregen-paderborn.cismet.de/geoserver/wms?SERVICE=WMS",
  hideMeasurements: false,
  simulations: [
    {
      depthLayer: "starkregen:depth_14_max",
      depthTimeDimensionLayers: [
        "starkregen:depth_14_00h_05m",
        "starkregen:depth_14_00h_10m",
        "starkregen:depth_14_00h_15m",
        "starkregen:depth_14_00h_20m",
        "starkregen:depth_14_00h_25m",
        "starkregen:depth_14_00h_30m",
        "starkregen:depth_14_00h_35m",
        "starkregen:depth_14_00h_40m",
        "starkregen:depth_14_00h_45m",
        "starkregen:depth_14_00h_50m",
        "starkregen:depth_14_00h_55m",
        "starkregen:depth_14_01h_00m",
        "starkregen:depth_14_01h_05m",
        "starkregen:depth_14_01h_09m",
        "starkregen:depth_14_01h_15m",
        "starkregen:depth_14_01h_20m",
        "starkregen:depth_14_01h_24m",
        "starkregen:depth_14_01h_30m",
        "starkregen:depth_14_01h_35m",
        "starkregen:depth_14_01h_40m",
        "starkregen:depth_14_01h_44m",
        "starkregen:depth_14_01h_50m",
        "starkregen:depth_14_01h_55m",
        "starkregen:depth_14_02h_00m",
      ],
      velocityLayer: "starkregen:velocity_14_max",
      velocityTimeDimensionLayers: [
        "starkregen:velocity_14_00h_05m",
        "starkregen:velocity_14_00h_10m",
        "starkregen:velocity_14_00h_15m",
        "starkregen:velocity_14_00h_20m",
        "starkregen:velocity_14_00h_25m",
        "starkregen:velocity_14_00h_30m",
        "starkregen:velocity_14_00h_35m",
        "starkregen:velocity_14_00h_40m",
        "starkregen:velocity_14_00h_45m",
        "starkregen:velocity_14_00h_50m",
        "starkregen:velocity_14_00h_55m",
        "starkregen:velocity_14_01h_00m",
        "starkregen:velocity_14_01h_05m",
        "starkregen:velocity_14_01h_09m",
        "starkregen:velocity_14_01h_15m",
        "starkregen:velocity_14_01h_20m",
        "starkregen:velocity_14_01h_24m",
        "starkregen:velocity_14_01h_30m",
        "starkregen:velocity_14_01h_35m",
        "starkregen:velocity_14_01h_40m",
        "starkregen:velocity_14_01h_44m",
        "starkregen:velocity_14_01h_50m",
        "starkregen:velocity_14_01h_55m",
        "starkregen:velocity_14_02h_00m",
      ],
      directionsLayer: "starkregen:direction_14_max",
      depthStyle: "starkregen:depth-blue",
      velocityStyle: "starkregen:velocity",
      directionStyle: "starkregen:direction",
      animationPrefix: "",
      animationPostfix: "_14_max",
      name: "Stärke 7",
      title: "Starkregen SRI 7 (52,10 l/m² in 1h",
      icon: "bar-chart",
      subtitle:
        "Simulation eines einstündigen Starkregens mit 52,10 Liter/m² Niederschlag (Starkregenindex SRI 7) in ganz Paderborn, statistische Wiederkehrzeit 100 Jahre",
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
  valueMode: starkregenConstants.SHOW_MAXVALUES,
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
