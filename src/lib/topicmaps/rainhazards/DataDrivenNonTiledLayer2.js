import React, { useState } from "react";
import ImageDataLayer from "./ImageDataLayer";

const Layer = ({ data0, data1, data0Weight, data1Weight, bounds, opacity }) => {
  const [weightedMean, setWeightedMean] = useState(undefined);
  console.log("data0", data0);

  return (
    <ImageDataLayer
      data_={weightedMean || data0Weight >= 0.5 ? data0 : data1}
      data={data0}
      bounds={bounds}
      opacity={opacity}
    />
  );
};

export default Layer;
