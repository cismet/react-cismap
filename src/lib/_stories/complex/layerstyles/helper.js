export function interpolateColor(color, factor) {
  let colorHex = color.replace("#", "");
  let r = parseInt(colorHex.substring(0, 2), 16);
  let g = parseInt(colorHex.substring(2, 4), 16);
  let b = parseInt(colorHex.substring(4, 6), 16);

  r = Math.floor(r + (255 - r) * factor);
  g = Math.floor(g + (255 - g) * factor);
  b = Math.floor(b + (255 - b) * factor);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
    .toString(16)
    .padStart(2, "0")}`;
}

export function generateExtraColors(colors, requiredNumber) {
  let extraColors = [];
  let factorStep = 1 / (requiredNumber + 1);
  let factor = factorStep;

  for (let i = colors.length; i < requiredNumber; i++) {
    extraColors.push(interpolateColor(colors[i % colors.length], factor));
    factor += factorStep;
  }

  return extraColors;
}

export function updateMapStyleColors(styleJson, colorArray) {
  let updatedStyle = { ...styleJson };
  let colorIndex = 0;
  let colorUsageCount = {};

  // Generate enough colors if necessary
  if (colorArray.length < updatedStyle.layers.length) {
    colorArray = [
      ...colorArray,
      ...generateExtraColors(colorArray, updatedStyle.layers.length - colorArray.length),
    ];
  }

  // Update colors in layers
  updatedStyle.layers = updatedStyle.layers.map((layer) => {
    if (layer.paint && layer.paint["fill-color"]) {
      let color = colorArray[colorIndex % colorArray.length];
      colorIndex++;

      // Record usage of color
      colorUsageCount[color] = (colorUsageCount[color] || 0) + 1;

      return {
        ...layer,
        paint: {
          ...layer.paint,
          "fill-color": color,
        },
      };
    } else if (layer.paint && layer.paint["line-color"]) {
      let color = colorArray[colorIndex % colorArray.length];
      colorIndex++;

      // Record usage of color
      colorUsageCount[color] = (colorUsageCount[color] || 0) + 1;

      return {
        ...layer,
        paint: {
          ...layer.paint,
          "line-color": color,
        },
      };
    } else {
      return layer;
    }
  });

  console.log("Color usage:", colorUsageCount);
  return updatedStyle;
}

export function addGlowingEffect(styleJson, glowColorFn, glowWidthMultiplier, glowWidthOffset = 0) {
  let styleClone = JSON.parse(JSON.stringify(styleJson)); // Deep clone to avoid mutation

  // Helper function to multiply line width appropriately
  function multiplyLineWidth(width, multiplier) {
    if (typeof width === "number") {
      return width * multiplier + glowWidthOffset;
    } else if (typeof width === "object" && width.stops) {
      return {
        stops: width.stops.map((stop) => [stop[0], stop[1] * multiplier + glowWidthOffset]),
      };
    }
    // Default or fallback line width if none is specified
    return multiplier * 1; // Assuming a default width of 1 if not specified
  }

  // Helper function to create a glow color
  const getGlowColor = (color) => {
    const derivedGlowColor =
      typeof glowColorFn === "function" ? glowColorFn(color) : glowColorFn || "#FFFFFF";
    return derivedGlowColor;
  };

  // Function to add glow to a fill layer
  const addFillGlow = (layer) => {
    // Create a duplicate of the layer with an 'outer glow' effect
    let glowLayer = JSON.parse(JSON.stringify(layer));
    glowLayer.id = `${layer.id}-glow`;
    glowLayer.paint = { ...glowLayer.paint };
    // Set a translucent fill color for the glow
    glowLayer.paint["fill-color"] = getGlowColor(glowLayer.paint["fill-color"]);
    glowLayer.paint["fill-opacity"] = 0.5; // Adjust for desired glow strength
    glowLayer.paint["fill-outline-color"] = getGlowColor(glowLayer.paint["fill-color"]);
    // Insert the glow layer below the original layer to create the effect of a glow behind
    let layerIndex = styleClone.layers.findIndex((l) => l.id === layer.id);
    styleClone.layers.splice(layerIndex, 0, glowLayer);
  };

  styleClone.layers = styleClone.layers.reduce((acc, layer) => {
    // Add a glow effect for line layers

    if (layer.type === "line" && layer.paint && layer.paint["line-color"]) {
      // Determine the glow color based on the original color
      const originalColor = layer.paint["line-color"];
      const derivedGlowColor = getGlowColor(originalColor);

      // Clone the original layer for the glow effect
      let glowLayer = JSON.parse(JSON.stringify(layer));
      glowLayer.id = `${layer.id}-glow`;
      glowLayer.paint["line-color"] = derivedGlowColor;
      glowLayer.paint["line-width"] = multiplyLineWidth(
        glowLayer.paint["line-width"],
        glowWidthMultiplier
      );
      glowLayer.paint["line-blur"] =
        typeof glowLayer.paint["line-width"] === "number"
          ? glowLayer.paint["line-width"] / 2
          : multiplyLineWidth(glowLayer.paint["line-width"], 0.5);
      glowLayer.paint["line-opacity"] = 0.5; // Set a default glow opacity

      // Add the glow layer before the original line layer
      acc.push(glowLayer);
    }

    // Add the original layer
    acc.push(layer);
    return acc;
  }, []);

  console.log("xxx", { styleJson, updatedStyle: styleClone });

  return styleClone;
}

export function brightenHexColor(hex, percent) {
  // Ensure the hex color is properly formatted
  hex = hex.replace(/^\s*#|\s*$/g, "");

  // Convert hex to RGB
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  // Increase the RGB values by the percentage
  r = parseInt((r * (100 + percent)) / 100);
  g = parseInt((g * (100 + percent)) / 100);
  b = parseInt((b * (100 + percent)) / 100);

  // Make sure the new values are within the RGB bounds
  r = r < 255 ? r : 255;
  g = g < 255 ? g : 255;
  b = b < 255 ? b : 255;

  // Convert the numbers to hex
  let rr = r.toString(16).length === 1 ? "0" + r.toString(16) : r.toString(16);
  let gg = g.toString(16).length === 1 ? "0" + g.toString(16) : g.toString(16);
  let bb = b.toString(16).length === 1 ? "0" + b.toString(16) : b.toString(16);

  // Return the modified hex color
  return `#${rr}${gg}${bb}`;
}
