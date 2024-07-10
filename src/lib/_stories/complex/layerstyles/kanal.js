const style = {
  version: 8,
  name: "Kanalnetz in Wuppertal",
  metadata: {
    "mapbox:autocomposite": false,
    "mapbox:type": "template",
    "mapbox:groups": {
      b6371a3f2f5a9932464fa3867530a2e5: {
        name: "Transportation",
        collapsed: false,
      },
      a14c9607bc7954ba1df7205bf660433f: {
        name: "Boundaries",
      },
      "101da9f13b64a08fa4b6ac1168e89e5f": {
        name: "Places",
        collapsed: false,
      },
    },
    "openmaptiles:version": "3.x",
    "openmaptiles:mapbox:owner": "openmaptiles",
    "openmaptiles:mapbox:source:url": "mapbox://openmaptiles.4qljc88t",
  },
  sources: {
    kanal: {
      type: "vector",
      url: "https://omt.map-hosting.de/data/kanal2.json",
    },
  },
  sprite: "https://omt.map-hosting.de/styles/kanal/sprite",
  glyphs: "https://omt.map-hosting.de/fonts/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "mischwasser-dir",
      type: "line",
      source: "kanal",
      "source-layer": "haltungen",
      minzoom: 14,
      filter: ["all", ["==", "symfb", 100]],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "#e15989",
        "line-width": {
          stops: [
            [16, 4],
            [20, 20],
            [22, 40],
          ],
        },
        "line-pattern": "arrow_mag",
      },
    },
    {
      id: "mischwasser",
      type: "line",
      source: "kanal",
      "source-layer": "haltungen",
      minzoom: 14,
      filter: ["all", ["==", "symfb", 100]],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "#e15989",
        "line-dasharray": [10, 1, 3, 1],
        "line-width": {
          stops: [
            [16, 1],
            [20, 4],
            [22, 8],
          ],
        },
      },
    },
    {
      id: "deckel_mischwasser-o",
      type: "circle",
      source: "kanal",
      "source-layer": "deckel",
      minzoom: 19,
      filter: ["all", ["==", "symfbparen", 100]],
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-color": "#fff",
        "circle-stroke-color": "#e15989",
        "circle-stroke-width": 2,
        "circle-opacity": 0,
        "circle-radius": 6,
      },
    },
    {
      id: "deckel_mischwasser-i",
      type: "circle",
      source: "kanal",
      "source-layer": "deckel",
      minzoom: 19,
      filter: ["all", ["==", "symfbparen", 100]],
      layout: {
        visibility: "visible",
      },
      paint: {
        "circle-color": "#fff",
        "circle-stroke-color": "#e15989",
        "circle-stroke-width": 2,
        "circle-opacity": 0,
        "circle-radius": 3,
      },
    },
    {
      id: "abwasser-dir",
      type: "line",
      source: "kanal",
      "source-layer": "haltungen",
      minzoom: 14,
      filter: ["all", ["==", "symfb", 300]],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "#d85433",
        "line-width": {
          stops: [
            [16, 4],
            [20, 20],
            [22, 40],
          ],
        },
        "line-pattern": "arrow_red",
      },
    },
    {
      id: "abwasser",
      type: "line",
      source: "kanal",
      "source-layer": "haltungen",
      minzoom: 14,
      filter: ["all", ["==", "symfb", 300]],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "#d85433",
        "line-width": {
          stops: [
            [16, 1],
            [20, 4],
            [22, 8],
          ],
        },
      },
    },
    {
      id: "deckel_abwasser-i",
      type: "circle",
      source: "kanal",
      "source-layer": "deckel",
      minzoom: 19,
      filter: ["all", ["==", "symfbparen", 300]],
      paint: {
        "circle-color": "#fff",
        "circle-stroke-color": "#d85433",
        "circle-stroke-width": 2,
        "circle-opacity": 0,
        "circle-radius": 3,
      },
    },
    {
      id: "deckel_abwasser-o",
      type: "circle",
      source: "kanal",
      "source-layer": "deckel",
      minzoom: 19,
      filter: ["all", ["==", "symfbparen", 300]],
      paint: {
        "circle-color": "#fff",
        "circle-stroke-color": "#d85433",
        "circle-stroke-width": 2,
        "circle-opacity": 0,
        "circle-radius": 6,
      },
    },
    {
      id: "regenwasser-dir",
      type: "line",
      source: "kanal",
      "source-layer": "haltungen",
      minzoom: 14,
      filter: ["all", ["==", "symfb", 200]],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "#4f85cf",
        "line-width": {
          stops: [
            [16, 4],
            [20, 20],
            [22, 40],
          ],
        },
        "line-pattern": "arrow_blue",
      },
    },
    {
      id: "regenwasser",
      type: "line",
      source: "kanal",
      "source-layer": "haltungen",
      minzoom: 14,
      filter: ["all", ["==", "symfb", 200]],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "#4f85cf",
        "line-dasharray": [6, 3],
        "line-width": {
          stops: [
            [16, 1],
            [20, 4],
            [22, 8],
          ],
        },
      },
    },
    {
      id: "sonstigeHaltungen-dir",
      type: "line",
      source: "kanal",
      "source-layer": "haltungen",
      minzoom: 14,
      filter: ["none", ["==", "symfb", 100], ["==", "symfb", 200], ["==", "symfb", 300]],
      layout: {
        visibility: "visible",
      },
      paint: {
        "line-color": "#000000",
        "line-width": {
          stops: [
            [16, 4],
            [20, 20],
            [22, 40],
          ],
        },
        "line-pattern": "arrow_black",
      },
    },
    {
      id: "sonstigeHaltungen",
      type: "line",
      source: "kanal",
      "source-layer": "haltungen",
      minzoom: 14,
      filter: ["none", ["==", "symfb", 100], ["==", "symfb", 200], ["==", "symfb", 300]],
      layout: {
        visibility: "visible",
      },
      paint: {
        // "line-color": "#000000",
        //test whether hover is possible -> it is not
        "line-color": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          "#DFE312",
          "#000000",
        ],
        "line-width": {
          stops: [
            [16, 1],
            [20, 4],
            [22, 8],
          ],
        },
        "line-dasharray": [6, 3],
      },
    },
    {
      id: "deckel_regenwasser-i",
      type: "circle",
      source: "kanal",
      "source-layer": "deckel",
      minzoom: 19,
      filter: ["all", ["==", "symfbparen", 200]],
      paint: {
        "circle-color": "#fff",
        "circle-stroke-color": "#4f85cf",
        "circle-stroke-width": 2,
        "circle-opacity": 0,
        "circle-radius": 3,
      },
    },
    {
      id: "deckel_regenwasser-o",
      type: "circle",
      source: "kanal",
      "source-layer": "deckel",
      minzoom: 19,
      filter: ["all", ["==", "symfbparen", 200]],
      paint: {
        "circle-color": "#fff",
        "circle-stroke-color": "#4f85cf",
        "circle-stroke-width": 2,
        "circle-opacity": 0,
        "circle-radius": 6,
      },
    },
    {
      id: "deckel_sonstige-o",
      type: "circle",
      source: "kanal",
      "source-layer": "deckel",
      minzoom: 19,
      filter: [
        "none",
        ["==", "symfbparen", 100],
        ["==", "symfbparen", 200],
        ["==", "symfbparen", 300],
      ],
      paint: {
        "circle-color": "#fff",
        "circle-stroke-color": "#000",
        "circle-stroke-width": 2,
        "circle-opacity": 0,
        "circle-radius": 6,
      },
    },
    {
      id: "deckel_sonstige-i",
      type: "circle",
      source: "kanal",
      "source-layer": "deckel",
      minzoom: 19,
      filter: [
        "none",
        ["==", "symfbparen", 100],
        ["==", "symfbparen", 200],
        ["==", "symfbparen", 300],
      ],
      paint: {
        "circle-color": "#fff",
        "circle-stroke-color": "#000",
        "circle-stroke-width": 2,
        "circle-opacity": 0,
        "circle-radius": 3,
      },
    },
  ],
  id: "kanal",
};

export default style;
