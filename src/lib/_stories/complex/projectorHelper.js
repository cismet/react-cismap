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
export function createDividingLines(geojson, hSep, vSep) {
  const box = geojson.geometry.coordinates[0];
  const minX = box[0][0];
  const maxX = box[2][0];
  const minY = box[0][1];
  const maxY = box[2][1];

  const segmentWidth = (maxX - minX) / (vSep + 1);
  const segmentHeight = (maxY - minY) / (hSep + 1);

  let dividingLines = [];

  // Create vertical lines
  for (let i = 1; i <= vSep; i++) {
    let lineX = minX + i * segmentWidth;
    let lineCoordinates = [
      [lineX, minY],
      [lineX, maxY],
    ];

    dividingLines.push({
      type: "Feature",
      properties: {},
      crs: { type: "name", properties: { name: "EPSG:3857" } },

      geometry: {
        type: "LineString",
        coordinates: lineCoordinates,
      },
    });
  }

  // Create horizontal lines
  for (let j = 1; j <= hSep; j++) {
    let lineY = minY + j * segmentHeight;
    let lineCoordinates = [
      [minX, lineY],
      [maxX, lineY],
    ];

    dividingLines.push({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: lineCoordinates,
      },
    });
  }

  return dividingLines;
}
function createCalibratingSquares(geojson, squareSize) {
  const box = geojson.geometry.coordinates[0];
  const minX = box[0][0];
  const maxX = box[2][0];
  const minY = box[0][1];
  const maxY = box[2][1];

  // This will hold the GeoJSON features for the calibrating squares
  let calibratingSquares = [];

  // Function to create a square based on the starting x and y coordinates
  const createSquare = (centerX, centerY, size, type) => {
    const halfSize = size / 2;
    return {
      type: "Feature",
      properties: { type },
      crs: { type: "name", properties: { name: "EPSG:3857" } },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [centerX - halfSize, centerY - halfSize],
            [centerX + halfSize, centerY - halfSize],
            [centerX + halfSize, centerY + halfSize],
            [centerX - halfSize, centerY + halfSize],
            [centerX - halfSize, centerY - halfSize], // Closing the loop
          ],
        ],
      },
    };
  };

  // Create squares at each corner
  // Top-left corner
  calibratingSquares.push(createSquare(minX, maxY, squareSize, "top-left"));
  // Top-right corner
  calibratingSquares.push(createSquare(maxX, maxY, squareSize, "top-right"));
  // Bottom-left corner
  calibratingSquares.push(createSquare(minX, minY, squareSize, "bottom-left"));
  // Bottom-right corner
  calibratingSquares.push(createSquare(maxX, minY, squareSize, "bottom-right"));

  return calibratingSquares;
}

export const createTiles = (numRows, numCols, width, height) => {
  const upperLeft = [0, 0];
  const upperRight = [width, 0];
  const lowerLeft = [0, height];
  const lowerRight = [width, height];

  // Calculate width and height of each tile
  const tileWidth = width / numCols;
  const tileHeight = height / numRows;

  // Generate tiles
  const tiles = {};

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const tileName = `tile-${row * numCols + col}`;
      const tileUpperLeftX = upperLeft[0] + col * tileWidth;
      const tileUpperLeftY = upperLeft[1] + row * tileHeight;
      const tileUpperRightX = tileUpperLeftX + tileWidth;
      const tileUpperRightY = tileUpperLeftY;
      const tileLowerLeftX = tileUpperLeftX;
      const tileLowerLeftY = tileUpperLeftY + tileHeight;
      const tileLowerRightX = tileUpperRightX;
      const tileLowerRightY = tileLowerLeftY;

      tiles[tileName] = {
        corners: [
          ...[tileUpperLeftX, tileUpperLeftY],
          ...[tileUpperRightX, tileUpperRightY],
          ...[tileLowerLeftX, tileLowerLeftY],
          ...[tileLowerRightX, tileLowerRightY],
        ],
      };
    }
  }
  return tiles;
};
