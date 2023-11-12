import FeatureCollectionDisplay from "../FeatureCollectionDisplay";
import React, { useEffect, useState } from "react";
import Easing from "easing";

function splicePercentage(array, percentage) {
  const validPercentage = Math.min(Math.max(percentage, 0), 1);
  const count = Math.round(validPercentage * array.length);
  return array.slice(0, count);
}

export default function (props) {
  const {
    featureCollection,
    featureVisitor = (f) => f,
    animationSteps = undefined,
    animationDuration = 4000,
    easing = "linear",
  } = props;
  const [vfxFeatureCollection, setVfxFeatureCollection] = useState([]);

  const steps = animationSteps || featureCollection.length;

  useEffect(() => {
    setVfxFeatureCollection([]);

    if (featureCollection.length === 0) {
      return;
    }
    const x = Easing.event(steps, easing, { duration: animationDuration });
    x.on("data", (data) => {
      setVfxFeatureCollection(splicePercentage(featureCollection, data));
    });
  }, []);

  return <FeatureCollectionDisplay {...props} featureCollection={vfxFeatureCollection} />;
}
