export const allBlack = {
    "version": 8,
    "name": "Blackout Style",
    "sources": {
        "empty": {
            "type": "vector",
            "tiles": [],
            "minzoom": 0,
            "maxzoom": 22
        }
    },
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "#000000"
            }
        }
    ]
}


export const alkis_flurstuecke_style =
{
    "version": 8,
    "metadata": {
        "carmaConf": {
            "layerInfo": {
                "title": "ALKIS Flurstücke / Gebäude (gelb)",
                "description": "Inhalt: Tagesaktuelle Vektordaten der Flurstücke und Gebäude aus dem Amtlichen Liegenschaftskataster-Informationssystem ALKIS der Stadt Wuppertal; frei definierte gelbe Strichdarstellung ohne Bezug zum Signaturenkatalog NRW, geeignet als Überlagerung einer Luftbildkarte. Nutzung: Frei innerhalb der Grenzen des Urheberrechtsgesetzes; die zugrunde liegenden Datensätze sind mit Wochenaktualität unter einer Open-Data-Lizenz (dl-zero-de/2.0) verfügbar.",
                "tags": [
                    "Basis",
                    "Liegenschaftskataster"
                ],
                "keywords": [
                    "carmaconf://infoBoxMapping:headerColor: '#F8FF16'",
                    "carmaconf://infoBoxMapping:header:(p.flurstueck_kz_voll!=undefined)?'Flurstück': 'Gebäude'",
                    "carmaconf://infoBoxMapping:title:(p.flurstueck_kz_voll!=undefined)?p.flur_flst_nr: p.geb_fkt",
                    "carmaconf://infoBoxMapping:additionalInfo:(p.flurstueck_kz_voll!=undefined)?'Flur '+ p.flurnummer: ''",
                    "carmaconf://infoBoxMapping:subtitle:(p.flurstueck_kz_voll!=undefined)?'in der Gemarkung '+ p.gemarkungsnummer: p.strname+' ' + p.hnr",
                    "carmaconf://blockLegacyGetFeatureInfo",
                    "carmaConf://opendata:https://offenedaten-wuppertal.de/search/topic/layer-flurst%C3%BCcke-und-geb%C3%A4ude-1175"
                ],
                "id": "wuppDev:expg",
                "name": "expg",
                "type": "layer",
                "layerType": "vector",
                "queryable": true,
                "maxZoom": 24,
                "minZoom": 14,
                "path": "Basis",
                "pictureBoundingBox": [
                    784874.5156892611,
                    6655868.893474152,
                    821182.1041247197,
                    6679927.448126909
                ],
                "icon": "basis/Expresskarte_Strichkarte_gelb",
                "thumbnail": "https://www.wuppertal.de/geoportal/geoportal_vorschau/karten_expg.png",
                "vectorStyle": "https://tiles.cismet.de/alkis/flurstuecke.style.json"
            }
        }
    },
    "sprite": "https://tiles.cismet.de/alkis/sprites",
    "glyphs": "https://tiles.cismet.de/fonts/{fontstack}/{range}.pbf",
    "sources": {
        "alkis_data": {
            "type": "vector",
            "tiles": [
                "https://tiles.cismet.de/alkis_laak_3857_17/{z}/{x}/{y}.pbf"
            ],
            "minzoom": 9,
            "maxzoom": 17
        }
    },
    "layers": [
        {
            "id": "landparcel_fill",
            "type": "fill",
            "source": "alkis_data",
            "source-layer": "landparcel",
            "metadata": {
                "carmaConf": {
                    "selectionForwardingTo": [
                        "landparcel",
                        "landparcel_point",
                        "landparcel_arrows",
                        "landparcel_arrows_tips"
                    ],
                    "staticProps": {}
                }
            },
            "paint": {
                "fill-color": "#FAFF13",
                "fill-opacity": 0.000001
            }
        },
        {
            "id": "gebaeude_outlines",
            "type": "line",
            "source": "alkis_data",
            "source-layer": "building",
            "paint": {
                "line-color": "#FAFF13",
                "line-width": {
                    "stops": [
                        [
                            13,
                            0.05
                        ],
                        [
                            21,
                            2
                        ]
                    ]
                }
            }
        },
        {
            "id": "gebaeudstruktur_outlines",
            "type": "line",
            "source": "alkis_data",
            "source-layer": "buildingstructure",
            "paint": {
                "line-color": "#FAFF13",
                "line-width": {
                    "stops": [
                        [
                            13,
                            0.05
                        ],
                        [
                            21,
                            2
                        ]
                    ]
                }
            }
        },
        {
            "id": "gebaeude_hatched_cross",
            "type": "fill",
            "source": "alkis_data",
            "source-layer": "building",
            "minzoom": 13,
            "filter": [
                "in",
                "geb_fkt_code",
                3012,
                3021,
                3040,
                3041,
                3042
            ],
            "paint": {
                "fill-pattern": [
                    "step",
                    [
                        "zoom"
                    ],
                    "hatch_cross_faff13_s1",
                    16,
                    "hatch_cross_faff13_s2",
                    17,
                    "hatch_cross_faff13_s3",
                    18,
                    "hatch_cross_faff13_s4",
                    19,
                    "hatch_cross_faff13_s4",
                    22,
                    "hatch_cross_faff13_s4"
                ],
                "fill-opacity": 1
            }
        },
        {
            "id": "gebaeude_hatched_cross_selection",
            "type": "fill",
            "source": "alkis_data",
            "source-layer": "building",
            "minzoom": 13,
            "filter": [
                "in",
                "geb_fkt_code",
                3012,
                3021,
                3040,
                3041,
                3042
            ],
            "paint": {
                "fill-pattern": [
                    "step",
                    [
                        "zoom"
                    ],
                    "hatch_cross_3a7ceb_s1",
                    16,
                    "hatch_cross_3a7ceb_s2",
                    17,
                    "hatch_cross_3a7ceb_s3",
                    18,
                    "hatch_cross_3a7ceb_s4",
                    19,
                    "hatch_cross_3a7ceb_s4",
                    22,
                    "hatch_cross_3a7ceb_s4"
                ],
                "fill-opacity": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "selected"
                        ],
                        false
                    ],
                    1,
                    0
                ]
            }
        },
        {
            "id": "gebaeude_hatched_diag",
            "type": "fill",
            "source": "alkis_data",
            "source-layer": "building",
            "minzoom": 13,
            "filter": [
                "!in",
                "geb_fkt_code",
                3012,
                3021,
                3040,
                3041,
                3042
            ],
            "paint": {
                "fill-pattern": [
                    "step",
                    [
                        "zoom"
                    ],
                    "hatch_diag45_faff13_s1",
                    16,
                    "hatch_diag45_faff13_s2",
                    17,
                    "hatch_diag45_faff13_s3",
                    18,
                    "hatch_diag45_faff13_s4",
                    19,
                    "hatch_diag45_faff13_s4",
                    22,
                    "hatch_diag45_faff13_s4"
                ],
                "fill-opacity": 1
            }
        },
        {
            "id": "gebaeude_hatched_diag_selection",
            "type": "fill",
            "source": "alkis_data",
            "source-layer": "building",
            "minzoom": 13,
            "filter": [
                "!in",
                "geb_fkt_code",
                3012,
                3021,
                3040,
                3041,
                3042
            ],
            "paint": {
                "fill-pattern": [
                    "step",
                    [
                        "zoom"
                    ],
                    "hatch_diag45_3a7ceb_s1",
                    16,
                    "hatch_diag45_3a7ceb_s2",
                    17,
                    "hatch_diag45_3a7ceb_s3",
                    18,
                    "hatch_diag45_3a7ceb_s4",
                    19,
                    "hatch_diag45_3a7ceb_s4",
                    22,
                    "hatch_diag45_3a7ceb_s4"
                ],
                "fill-opacity": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "selected"
                        ],
                        false
                    ],
                    1,
                    0
                ]
            }
        },
        {
            "id": "gebaeudestructure_hatched_diag",
            "type": "fill",
            "source": "alkis_data",
            "source-layer": "buildingstructure",
            "minzoom": 13,
            "paint": {
                "fill-pattern": [
                    "step",
                    [
                        "zoom"
                    ],
                    "hatch_diag135_faff13_s1",
                    16,
                    "hatch_diag135_faff13_s2",
                    17,
                    "hatch_diag135_faff13_s3",
                    18,
                    "hatch_diag135_faff13_s4",
                    19,
                    "hatch_diag135_faff13_s4",
                    22,
                    "hatch_diag135_faff13_s4"
                ],
                "fill-opacity": 1
            }
        },
        {
            "id": "gebaeudestructure_hatched_diag_selection",
            "type": "fill",
            "source": "alkis_data",
            "source-layer": "buildingstructure",
            "minzoom": 13,
            "paint": {
                "fill-pattern": [
                    "step",
                    [
                        "zoom"
                    ],
                    "hatch_diag135_3a7ceb_s1",
                    16,
                    "hatch_diag135_3a7ceb_s2",
                    17,
                    "hatch_diag135_3a7ceb_s3",
                    18,
                    "hatch_diag135_3a7ceb_s4",
                    19,
                    "hatch_diag135_3a7ceb_s4",
                    22,
                    "hatch_diag135_3a7ceb_s4"
                ],
                "fill-opacity": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "selected"
                        ],
                        false
                    ],
                    1,
                    0
                ]
            }
        },
        {
            "id": "landparcel_outlines",
            "type": "line",
            "source": "alkis_data",
            "source-layer": "landparcel",
            "metadata": {
                "carmaConf": {
                    "selectionForwardingTo": [
                        "landparcel",
                        "landparcel_point",
                        "landparcel_arrows",
                        "landparcel_arrows_tips"
                    ],
                }
            },
            "paint": {
                "line-color": "#FAFF13",
                "line-width": {
                    "stops": [
                        [
                            13,
                            0.05
                        ],
                        [
                            21,
                            2
                        ]
                    ]
                }
            }
        },
        {
            "id": "landparcel_selection",
            "type": "line",
            "source": "alkis_data",
            "source-layer": "landparcel",
            "minzoom": 0,
            "maxzoom": 22,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#3A7CEB",
                "line-opacity": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "selected"
                        ],
                        false
                    ],
                    1,
                    0
                ],
                "line-width": 3
            }
        },
        {
            "id": "gebaeude_selection",
            "type": "line",
            "source": "alkis_data",
            "source-layer": "building",
            "minzoom": 0,
            "maxzoom": 22,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#3A7CEB",
                "line-opacity": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "selected"
                        ],
                        false
                    ],
                    1,
                    0
                ],
                "line-width": 3
            }
        },
        {
            "id": "gebaeudestruktur_selection",
            "type": "line",
            "source": "alkis_data",
            "source-layer": "buildingstructure",
            "minzoom": 0,
            "maxzoom": 22,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#3A7CEB",
                "line-opacity": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "selected"
                        ],
                        false
                    ],
                    1,
                    0
                ],
                "line-width": 3
            }
        },
        {
            "id": "lanparcel_arrows",
            "type": "line",
            "source": "alkis_data",
            "source-layer": "landparcel_arrows",
            "metadata": {
                "carmaConf": {
                    "selectionForwardingTo": [
                        "landparcel",
                        "landparcel_point",
                        "landparcel_arrows",
                        "landparcel_arrows_tips"
                    ],
                    "propertyTarget": "alkis_data.landparcel"
                }
            },
            "minzoom": 18,
            "maxzoom": 24,
            "paint": {
                "line-color": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "selected"
                        ],
                        false
                    ],
                    "#3A7CEB",
                    "#FAFF13"
                ],
                "line-width": {
                    "stops": [
                        [
                            13,
                            0.05
                        ],
                        [
                            21,
                            2
                        ]
                    ]
                },
                "line-opacity": 1
            }
        },
        {
            "id": "landparcel_arrows_tips",
            "type": "symbol",
            "source": "alkis_data",
            "source-layer": "landparcel_arrows_tips",
            "metadata": {
                "carmaConf": {
                    "selectionForwardingTo": [
                        "landparcel",
                        "landparcel_point",
                        "landparcel_arrows",
                        "landparcel_arrows_tips"
                    ],
                    "propertyTarget": "alkis_data.landparcel"
                }
            },
            "minzoom": 18,
            "maxzoom": 24,
            "layout": {
                "icon-image": "arrow_faff13_s1",
                "icon-rotation-alignment": "map",
                "icon-rotate": [
                    "+",
                    [
                        "get",
                        "angle"
                    ],
                    -90
                ],
                "icon-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    0.02,
                    14,
                    0.18,
                    18,
                    0.2,
                    22,
                    1.12
                ],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                "icon-anchor": "right"
            },
            "paint": {
                "icon-opacity": 1
            }
        },
        {
            "id": "landparcel_arrows_tips_selected",
            "type": "symbol",
            "source": "alkis_data",
            "source-layer": "landparcel_arrows_tips",
            "metadata": {
                "carmaConf": {
                    "selectionForwardingTo": [
                        "landparcel",
                        "landparcel_point",
                        "landparcel_arrows",
                        "landparcel_arrows_tips"
                    ],
                    "propertyTarget": "alkis_data.landparcel"
                }
            },
            "minzoom": 18,
            "maxzoom": 24,
            "layout": {
                "icon-image": "arrow_3a7ceb_s1",
                "icon-rotation-alignment": "map",
                "icon-rotate": [
                    "+",
                    [
                        "get",
                        "angle"
                    ],
                    -90
                ],
                "icon-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    0.02,
                    14,
                    0.18,
                    18,
                    0.2,
                    22,
                    1.12
                ],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                "icon-anchor": "right"
            },
            "paint": {
                "icon-opacity": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "selected"
                        ],
                        false
                    ],
                    1,
                    0
                ]
            }
        },
        {
            "id": "landparcel_arrows_tips_point",
            "type": "circle",
            "source": "alkis_data",
            "source-layer": "landparcel_arrows_tips",
            "layout": {
                "visibility": "none"
            },
            "paint": {
                "circle-radius": 2,
                "circle-color": "#000000"
            }
        },
        {
            "id": "landparcel_point",
            "type": "circle",
            "source": "alkis_data",
            "source-layer": "landparcel_point",
            "layout": {
                "visibility": "none"
            }
        },
        {
            "id": "landparcel_label",
            "type": "symbol",
            "source": "alkis_data",
            "source-layer": "landparcel_point",
            "metadata": {
                "carmaConf": {
                    "selectionForwardingTo": [
                        "landparcel",
                        "landparcel_point",
                        "landparcel_arrows",
                        "landparcel_arrows_tips"
                    ],
                    "propertyTarget": "alkis_data.landparcel"
                }
            },
            "minzoom": 18,
            "maxzoom": 24,
            "layout": {
                "text-field": [
                    "case",
                    [
                        "any",
                        [
                            "!",
                            [
                                "has",
                                "nen"
                            ]
                        ],
                        [
                            "==",
                            [
                                "get",
                                "nen"
                            ],
                            null
                        ],
                        [
                            "==",
                            [
                                "to-string",
                                [
                                    "get",
                                    "nen"
                                ]
                            ],
                            ""
                        ]
                    ],
                    [
                        "to-string",
                        [
                            "get",
                            "zae"
                        ]
                    ],
                    [
                        "format",
                        [
                            "to-string",
                            [
                                "get",
                                "zae"
                            ]
                        ],
                        {},
                        "\n",
                        {},
                        "—",
                        {
                            "font-scale": 0.8
                        },
                        "\n",
                        {},
                        [
                            "to-string",
                            [
                                "get",
                                "nen"
                            ]
                        ],
                        {}
                    ]
                ],
                "text-font": [
                    "Open Sans Regular"
                ],
                "text-size": [
                    "interpolate",
                    [
                        "linear"
                    ],
                    [
                        "zoom"
                    ],
                    10,
                    1,
                    22,
                    26
                ],
                "text-line-height": 1,
                "text-anchor": [
                    "coalesce",
                    [
                        "get",
                        "text_anchor"
                    ],
                    "center"
                ],
                "text-allow-overlap": false
            },
            "paint": {
                "text-color": [
                    "case",
                    [
                        "boolean",
                        [
                            "feature-state",
                            "selected"
                        ],
                        false
                    ],
                    "#3A7CEB",
                    "#FAFF13"
                ]
            }
        }
    ]
};
