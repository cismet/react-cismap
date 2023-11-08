import React from "react";

import StyledWMSTileLayer from "../../StyledWMSTileLayer";
import { VideoOverlay } from "react-leaflet";
import ProjSingleGeoJson from "../../ProjSingleGeoJson";
import L from "leaflet";
const maskWithBorder = (borderColor = "red") => (
  <ProjSingleGeoJson
    maskingPolygon="POLYGON((653674.603 5986240.643, 653674.603 7372844.430, 1672962.694 7372844.430, 1672962.694 5986240.643, 653674.603 5986240.643))"
    geoJson={printedModelBounds}
    masked={true}
    style={() => {
      return {
        zIndex: 99999990,
        color: borderColor,
        weight: 1,
        opacity: 1,
        fillColor: "black",
        fillOpacity: 1,
      };
    }}
  />
);

export const configs = {
  start: {
    layers: (
      <>
        <StyledWMSTileLayer
          {...{
            type: "wmts",
            url: "https://geodaten.metropoleruhr.de/spw2/service",
            layers: "spw2_light_grundriss",
            version: "1.3.0",
            tileSize: 256,
            transparent: true,
          }}
        ></StyledWMSTileLayer>
        {maskWithBorder("black")}
      </>
    ),
    overridingMapStyle: { backgroundColor: undefined },
  },
  calibrate0: {
    layers: <>{maskWithBorder("red")}</>,
    overridingMapStyle: { backgroundColor: "#000000" },
  },

  experiment: {
    layers: (
      <>
        <StyledWMSTileLayer
          {...{
            type: "wmts",
            url: "https://geodaten.metropoleruhr.de/spw2/service",
            layers: "spw2_light_grundriss",
            version: "1.3.0",
            tileSize: 256,
            transparent: true,
          }}
        ></StyledWMSTileLayer>
        {maskWithBorder("black")}
        <VideoOverlay
          bounds={printedModelBoundsWGS84}
          play={true}
          url="https://www.mapbox.com/bites/00188/patricia_nasa.webm"
        />
      </>
    ),
    overridingMapStyle: { backgroundColor: undefined },
  },
};

export const printedModelBoundsWGS84 = [
  [51.270575, 7.185531],
  [51.2803, 7.213265],
];
export const printedModelBounds25832 = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    crs: { type: "name", properties: { name: "EPSG:25832" } },
    coordinates: [
      [
        [373425.964597719, 5681478.28104491],
        [373452.745943693, 5682561.895509946],
        [375386.872690145, 5682514.456227311],
        [375360.500876119, 5681430.838188204],
        [373425.964597719, 5681478.28104491],
      ],
    ],
  },
  crs: {
    type: "name",
    properties: {
      name: "EPSG:25832",
    },
  },
};

export const printedModelBounds = {
  type: "Feature",
  geometry: {
    type: "Polygon",
    crs: { type: "name", properties: { name: "EPSG:3857" } },
    coordinates: [
      [
        [799889.651999282, 6669295.589044214],
        [799889.651999282, 6671029.681554463],
        [802976.986756942, 6671029.681554463],
        [802976.986756942, 6669295.589044214],
        [799889.651999282, 6669295.589044214],
      ],
    ],
  },
  crs: {
    type: "name",
    properties: {
      name: "EPSG:3857",
    },
  },
};
