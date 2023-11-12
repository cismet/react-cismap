import FeatureCollectionDisplay from "../FeatureCollectionDisplay";
import React, { useEffect, useState } from "react";
import Easing from "easing";

export default function (props) {
  const {
    animationSteps = undefined,
    animationDuration = 4000,
    easing = "linear",
    easingOptions = {},
    animate = (percentage) => {
      return <div>{percentage}</div>;
    },
    start = false,
  } = props;
  const [percentage, setPercentage] = useState(0);

  const defaultStepsPerSecond = 10;
  const steps = animationSteps || (animationDuration / 1000) * defaultStepsPerSecond;

  useEffect(() => {
    const x = Easing.event(steps, easing, { duration: animationDuration, ...easingOptions });
    x.on("data", (data) => {
      setPercentage(data);
    });
  }, []);

  return animate(percentage);
}
