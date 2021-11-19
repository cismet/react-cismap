export async function doubleString(string) {
  try {
    return string + "..." + string;
  } catch (err) {
    console.log("worker error", err);
  }
}

// export async function getImageDataFromCanvas(canvas) {
//   try {
//     const ctx = canvas.getContext("2d");
//     const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     e.canvas = null;
//     return data;
//   } catch (err) {
//     console.log("worker error", err);
//   }
// }

// const getImageUrl = (wmsParams, width, height) => {
//   wmsParams.width = width;
//   wmsParams.height = height;
//   var nw = this._crs.project(bounds.getNorthWest());
//   var se = this._crs.project(bounds.getSouthEast());
//   var url = this._wmsUrl;
//   var bbox = (this._wmsVersion >= 1.3 && this._crs === CRS.EPSG4326
//     ? [se.y, nw.x, nw.y, se.x]
//     : [nw.x, se.y, se.x, nw.y]
//   ).join(",");
//   return (
//     url +
//     Util.getParamString(this.wmsParams, url, this.options.uppercase) +
//     (this.options.uppercase ? "&BBOX=" : "&bbox=") +
//     bbox
//   );
//   const url = `${wmsParams.url}?${wmsParams.params}`;
//   return url;
// };

export async function getImageDataForUrl(url, width, height) {
  const offscreen = new OffscreenCanvas(width, height);
  const blob = await fetch(url).then((r) => r.blob());
  const img = await createImageBitmap(blob);
  const ctx = offscreen.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, width, height);
  return data;
}

export async function getWeightedMean(data0, data1, data0Weight, data1Weight) {
  let weightedMean;
  let red, green, blue, alpha;
  if (data0Weight === 0) {
    weightedMean = data1;
  } else if (data1Weight === 0) {
    weightedMean = data0;
  } else {
    weightedMean = new Uint8ClampedArray(data0.length);
    for (let i = 0; i < data0.length; i += 4) {
      if (data0[i + 3] === 0) {
        red = 255 * data0Weight + data1[i] * data1Weight;
        green = 255 * data0Weight + data1[i + 1] * data1Weight;
        blue = 255 * data0Weight + data1[i + 2] * data1Weight;
      } else if (data1[i + 3] === 0) {
        red = data0[i] * data0Weight + 255 * data1Weight;
        green = data0[i + 1] * data0Weight + 255 * data1Weight;
        blue = data0[i + 2] * data0Weight + 255 * data1Weight;
      } else {
        red = data0[i] * data0Weight + data1[i] * data1Weight;
        green = data0[i + 1] * data0Weight + data1[i + 1] * data1Weight;
        blue = data0[i + 2] * data0Weight + data1[i + 2] * data1Weight;
      }

      alpha = data0[i + 3] * data0Weight + data1[i + 3] * data1Weight;

      weightedMean[i] = red;
      weightedMean[i + 1] = green;
      weightedMean[i + 2] = blue;
      weightedMean[i + 3] = alpha;
    }
  }
  return weightedMean;
}
