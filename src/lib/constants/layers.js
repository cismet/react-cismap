import React from "react";
import { TileLayer } from "react-leaflet";
import StyledWMSTileLayer from "../components/StyledWMSTileLayer";
import objectAssign from "object-assign";

const Layers = new Map();
export default Layers;

export const DEFAULT_LAYER_OPTIONS = { opacity: 1.0 };
export const DEFAULT_NIGHT_LAYER_OPTIONS = {
  opacity: 0.9,
  "css-filter": "filter:grayscale(0.9)brightness(0.9)invert(1)"
};
export const DEFAULT_BLUE_LAYER_OPTIONS = {
  opacity: 0.9,
  "css-filter": "filter:sepia(1.0) hue-rotate(150deg) contrast(0.9) opacity(1) invert(0) saturate(1)"
};
Layers.set("nrwDOP20", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="nrwDOP20"
      url="https://wunda-geoportal-cache.cismet.de/nrwDOP20"
      layers="nw_dop20"
      format="image/png"
      tiled="true"
      //crs={L.CRS.EPSG3857}
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("osm", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="Mundialis OSM"
      url="https://ows.mundialis.de/services/service?"
      layers="OSM-WMS"
      format="image/png"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
      version="1.1.1"
    />
  );
});
Layers.set("osm.night", (options = DEFAULT_NIGHT_LAYER_OPTIONS) => {
  let mergedOptions = objectAssign({}, defaultNightOptions, options);
  return (
    <StyledWMSTileLayer
      key="Mundialis OSM.night"
      url="https://ows.mundialis.de/services/service?"
      layers="OSM-WMS"
      format="image/png"
      maxZoom={19}
      opacity={mergedOptions.opacity}
      cssFilter={mergedOptions["css-filter"]}
      version="1.1.1"
    />
  );
});

Layers.set("osm2", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="terrestris OSM"
      url="https://ows.terrestris.de/osm/service?"
      layers="OSM-WMS"
      format="image/png"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
      version="1.1.1"
    />
  );
});
Layers.set("osm2.night", (options = DEFAULT_NIGHT_LAYER_OPTIONS) => {
  let mergedOptions = objectAssign({}, DEFAULT_NIGHT_LAYER_OPTIONS, options);
  return (
    <StyledWMSTileLayer
      key="terrestris OSM.night"
      url="https://ows.terrestris.de/osm/service?"
      layers="OSM-WMS"
      format="image/png"
      maxZoom={19}
      opacity={mergedOptions.opacity}
      cssFilter={mergedOptions["css-filter"]}
      version="1.1.1"
    />
  );
});

Layers.set("abkf", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="abkf"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="abkf"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("nrs", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="nrs"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="R102%3Astadtgrundkarte_hausnr"
      format="image/png"
      transparent="true"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("abkg", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="abkf"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="abkg"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});
Layers.set("bplan_abkg", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="bplan_abkg"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="bplanreihe"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("bplan_abkg", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="bplan_abkg"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="bplanreihe"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("bplan_abkg_uncached", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="bplan_abkg_uncached"
      url="https://geoportal.wuppertal.de/deegree/wms"
      layers="bplanreihe"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("bplan_ovl", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="bplan_ovl"
      url="https://geoportal.wuppertal.de/deegree/wms"
      layers="bplanhintergrund"
      format="image/png"
      tiled="true"
      transparent="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("bplan_ovl_cached", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="bplan_ovl_cached"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="bplanhintergrund"
      format="image/png"
      tiled="true"
      transparent="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("abkIntra", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="StadtgrundKarteABK"
      url="http://s10221:7098/alkis/services"
      layers="alkomf"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("uwBPlan", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="BPlanreihe auf Umwis"
      url="https://geoportal.wuppertal.de/deegree/wms"
      layers="bplanreihe,bplanhintergrund"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("uwBPlanCached", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="BPlanreihe auf Umwis"
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
      layers="bplanreihe,bplanhintergrund"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("webatlas", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="webatlas"
      url="https://sg.geodatenzentrum.de/wms_webatlasde__60d825c3-a2c2-2133-79c0-48721caab5c3?"
      layers="webatlasde"
      format="image/png"
      tiled="false"
      version="1.1.1"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("webatlas.night", (options = DEFAULT_NIGHT_LAYER_OPTIONS) => {
  let mergedOptions = objectAssign({}, DEFAULT_NIGHT_LAYER_OPTIONS, options);
  return (
    <StyledWMSTileLayer
      key="webatlas"
      url="https://sg.geodatenzentrum.de/wms_webatlasde__60d825c3-a2c2-2133-79c0-48721caab5c3?"
      layers="webatlasde"
      format="image/png"
      tiled="false"
      version="1.1.1"
      maxZoom={19}
      opacity={mergedOptions.opacity}
      cssFilter={mergedOptions["css-filter"]}
    />
  );
});

Layers.set("rvrWMS", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="stadtplan_rvr"
      url="https://rvr.demo.omniscale.net/mapproxy/service"
      layers="stadtplan_rvr"
      format="image/png"
      tiled="false"
      version="1.3.0"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("rvrWMS.night", (options = DEFAULT_NIGHT_LAYER_OPTIONS) => {
  let mergedOptions = objectAssign({}, DEFAULT_NIGHT_LAYER_OPTIONS, options);
  return (
    <StyledWMSTileLayer
      key="stadtplan_rvr.night"
      url="https://rvr.demo.omniscale.net/mapproxy/service"
      layers="stadtplan_rvr"
      format="image/png"
      tiled="false"
      version="1.3.0"
      maxZoom={19}
      opacity={mergedOptions.opacity}
      cssFilter={mergedOptions["css-filter"]}
    />
  );
});

Layers.set("rvrWMS.blue", (options = DEFAULT_BLUE_LAYER_OPTIONS) => {
  let mergedOptions = objectAssign({}, DEFAULT_BLUE_LAYER_OPTIONS, options);
  return (
    <StyledWMSTileLayer
      key="stadtplan_rvr.blue"
      url="https://rvr.demo.omniscale.net/mapproxy/service"
      layers="stadtplan_rvr"
      format="image/png"
      tiled="false"
      version="1.3.0"
      maxZoom={19}
      opacity={mergedOptions.opacity}
      cssFilter={mergedOptions["css-filter"]}
    />
  );
});

Layers.set("ruhrWMS", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="ruhr_stadtplan_rvr"
      url="https://geodaten.metropoleruhr.de/spw2/service"
      layers="stadtplan_rvr"
      format="image/png"
      tiled="false"
      version="1.3.0"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("ruhrWMS.night", (options = DEFAULT_NIGHT_LAYER_OPTIONS) => {
  let mergedOptions = objectAssign({}, DEFAULT_NIGHT_LAYER_OPTIONS, options);
  // console.log(mergedOptions);
  return (
    <StyledWMSTileLayer
      key="ruhr_stadtplan_rvr.night"
      url="https://geodaten.metropoleruhr.de/spw2/service"
      layers="stadtplan_rvr"
      format="image/png"
      tiled="false"
      version="1.3.0"
      maxZoom={19}
      opacity={mergedOptions.opacity}
      cssFilter={mergedOptions["css-filter"]}
    />
  );
});
Layers.set("ruhrWMS.blue", (options = DEFAULT_BLUE_LAYER_OPTIONS) => {
  let mergedOptions = objectAssign({}, DEFAULT_BLUE_LAYER_OPTIONS, options);
  return (
    <StyledWMSTileLayer
      key="ruhr_stadtplan_rvr.blue"
      url="https://geodaten.metropoleruhr.de/spw2/service"
      layers="stadtplan_rvr"
      format="image/png"
      tiled="false"
      version="1.3.0"
      maxZoom={19}
      opacity={mergedOptions.opacity}
      cssFilter={mergedOptions["css-filter"]}
    />
  );
});
Layers.set("wupp-plan-live", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="wupp-plan-live"
      url="https://wupp-plan-live.cismet.de"
      layers="stadtplan_rvr"
      format="image/png"
      tiled="false"
      version="1.3.0"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("wupp-plan-live.night", (options = DEFAULT_NIGHT_LAYER_OPTIONS) => {
  let mergedOptions = objectAssign({}, DEFAULT_NIGHT_LAYER_OPTIONS, options);
  // console.log(mergedOptions);
  return (
    <StyledWMSTileLayer
      key="wupp-plan-live.night"
      url="https://wupp-plan-live.cismet.de"
      layers="stadtplan_rvr"
      format="image/png"
      tiled="false"
      version="1.3.0"
      maxZoom={19}
      opacity={mergedOptions.opacity}
      cssFilter={mergedOptions["css-filter"]}
    />
  );
});

Layers.set("orthoIntra", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <StyledWMSTileLayer
      key="Ortho2014"
      url="http://s10221:7098/orthofotos/services"
      layers="WO2014"
      format="image/png"
      tiled="true"
      maxZoom={19}
      opacity={options.opacity}
      cssFilter={options["css-filter"]}
    />
  );
});

Layers.set("ESRILayer", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <TileLayer
      key="ESRILayer"
      urlX="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      urlNRW="http://localhost:8080/geowebcache/service/tms/1.0.0/nrw:ortho/{z}/{y}/{x}.jpg"
      urlC="http://localhost:8080/geowebcache/service/tms/1.0.0/OSM-WMS/{x}/{y}/{z}.png"
      attribution="&copy; <a href=&quot;http://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors, &copy; <a href=&quot;https://carto.com/attributions&quot;>CARTO</a>"
      maxZoom={22}
      maxNativeZoom={18}
      opacity={options.opacity}
    />
  );
});

Layers.set("CartoLayer", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <TileLayer
      key="CartoLayer"
      urlBW="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      urlE="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      urlH="http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
      url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href=&quot;http://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors, &copy; <a href=&quot;https://carto.com/attributions&quot;>CARTO</a>"
      maxNativeZoom={19}
      maxZoom={22}
      opacity={options.opacity}
    />
  );
});

Layers.set("CartoLayer", (options = DEFAULT_LAYER_OPTIONS) => {
  return (
    <TileLayer
      key="CartoLayer"
      urlBW="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      urlE="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      urlH="http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png"
      url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; <a href=&quot;http://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors, &copy; <a href=&quot;https://carto.com/attributions&quot;>CARTO</a>"
      maxNativeZoom={19}
      maxZoom={22}
      opacity={options.opacity}
    />
  );
});
