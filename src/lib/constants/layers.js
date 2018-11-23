import React from 'react';
import { TileLayer } from 'react-leaflet';
import StyledWMSTileLayer from '../components/StyledWMSTileLayer';

const Layers = new Map();
export default Layers;

export const namedStyles = {
	default: { opacity: 0.6 },
	night: {
		opacity: 0.9,
		'css-filter': 'filter:grayscale(0.9)brightness(0.9)invert(1)'
	},
	blue: {
		opacity: 1.0,
		'css-filter': 'filter:sepia(0.5) hue-rotate(155deg) contrast(0.9) opacity(0.9) invert(0)'
	}
};
const DEFAULT_LAYER_OPTIONS=namedStyles.default;

Layers.set('nrwDOP20', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"nrwDOP20"+JSON.stringify(options)}
			url="https://wunda-geoportal-cache.cismet.de/nrwDOP20"
			layers="nw_dop20"
			format="image/png"
			tiled="true"
			//crs={L.CRS.EPSG3857}
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('osm', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"Mundialis OSM"+JSON.stringify(options)}
      url="https://ows.mundialis.de/services/service?"
			layers="OSM-WMS"
			format="image/png"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
			version="1.1.1"
		/>
	);
});

Layers.set('osm2', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"terrestris OSM"+JSON.stringify(options)}
      url="https://ows.terrestris.de/osm/service?"
			layers="OSM-WMS"
			format="image/png"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
			version="1.1.1"
		/>
	);
});


Layers.set('abkf', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"abkf"+JSON.stringify(options)}
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
			layers="abkf"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('nrs', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"nrs"+JSON.stringify(options)}
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
			layers="R102%3Astadtgrundkarte_hausnr"
			format="image/png"
			transparent="true"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('abkg', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"abkf"+JSON.stringify(options)}
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
			layers="abkg"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});
Layers.set('bplan_abkg', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"bplan_abkg"+JSON.stringify(options)}
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
			layers="bplanreihe"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('bplan_abkg', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"bplan_abkg"+JSON.stringify(options)}
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
			layers="bplanreihe"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('bplan_abkg_uncached', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"bplan_abkg_uncached"+JSON.stringify(options)}
      url="https://geoportal.wuppertal.de/deegree/wms"
			layers="bplanreihe"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('bplan_ovl', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"bplan_ovl"+JSON.stringify(options)}
      url="https://geoportal.wuppertal.de/deegree/wms"
			layers="bplanhintergrund"
			format="image/png"
			tiled="true"
			transparent="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('bplan_ovl_cached', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"bplan_ovl_cached"+JSON.stringify(options)}
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
			layers="bplanhintergrund"
			format="image/png"
			tiled="true"
			transparent="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('abkIntra', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"StadtgrundKarteABK"+JSON.stringify(options)}
      url="http://s10221:7098/alkis/services"
			layers="alkomf"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('uwBPlan', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"BPlanreihe auf Umwis"+JSON.stringify(options)}
      url="https://geoportal.wuppertal.de/deegree/wms"
			layers="bplanreihe,bplanhintergrund"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('uwBPlanCached', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"BPlanreihe auf Umwis"+JSON.stringify(options)}
      url="https://wunda-geoportal-cache.cismet.de/geoportal"
			layers="bplanreihe,bplanhintergrund"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('webatlas', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"webatlas"+JSON.stringify(options)}
      url="https://sg.geodatenzentrum.de/wms_webatlasde__60d825c3-a2c2-2133-79c0-48721caab5c3?"
			layers="webatlasde"
			format="image/png"
			tiled="false"
			version="1.1.1"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});


Layers.set('rvrWMS', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
			key={"stadtplan_rvr"+JSON.stringify(options)}
      url="https://rvr.demo.omniscale.net/mapproxy/service"
			layers="stadtplan_rvr"
			format="image/png"
			tiled="false"
			version="1.3.0"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});


Layers.set('ruhrWMS', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"ruhr_stadtplan_rvr"+JSON.stringify(options)}
      url="https://geodaten.metropoleruhr.de/spw2/service"
			layers="stadtplan_rvr"
			format="image/png"
			tiled="false"
			version="1.3.0"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('wupp-plan-live', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"wupp-plan-live"+JSON.stringify(options)}
      url="https://wupp-plan-live.cismet.de"
			layers="stadtplan_rvr"
			format="image/png"
			tiled="false"
			version="1.3.0"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('orthoIntra', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"Ortho2014"+JSON.stringify(options)}
      url="http://s10221:7098/orthofotos/services"
			layers="WO2018"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('trueOrthoIntra', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"trueOrtho2018"+JSON.stringify(options)}
      url="http://s10221:7098/orthofotos/services"
			layers="WTO2018"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('trueOrtho2018', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"trueOrtho2018"+JSON.stringify(options)}
      url="https://geoportal.wuppertal.de/deegree/wms"
			layers="R102:trueortho201810"
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('hillshade', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<StyledWMSTileLayer
      key={"hillshade"+JSON.stringify(options)}
      url="https://geoportal.wuppertal.de/deegree/wms"
			layers="hillshade "
			format="image/png"
			tiled="true"
			maxZoom={19}
			opacity={options.opacity}
			cssFilter={options['css-filter']}
		/>
	);
});

Layers.set('ESRILayer', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<TileLayer
      key={"ESRILayer"+JSON.stringify(options)}
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

Layers.set('CartoLayer', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<TileLayer
      key={"CartoLayer"+JSON.stringify(options)}
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

Layers.set('CartoLayer', (options = DEFAULT_LAYER_OPTIONS) => {
	return (
		<TileLayer
      key={"CartoLayer"+JSON.stringify(options)}
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
