import React, { useEffect, useState } from "react";

// Component receives initial configuration as props
const ProjectorControlPanel = ({
  config = {
    position: { x: 0, y: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    skew: { x: 0, y: 0 },
    scale: 1,
    perspective: 1000,
    steps: {
      position: 1,
      rotation: 0.1,
      skew: 0.1,
      scale: 0.001,
      perspective: 100,
    },
  },
  transformStringChanged = (transformString) => {
    console.log("transformStringChanged", transformString);
  },
}) => {
  const [position, setPosition] = useState(config.position);
  const [rotation, setRotation] = useState(config.rotation);
  const [skew, setSkew] = useState(config.skew);
  const [scale, setScale] = useState(config.scale);
  const [perspective, setPerspective] = useState(config.perspective);
  const [steps, setSteps] = useState(config.steps);

  useEffect(() => {
    const transformString = `perspective(${perspective}px) translate(${position.x}px, ${position.y}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg) skew(${skew.x}deg, ${skew.y}deg) scale(${scale})`;
    console.log("xxxx ts", transformString);

    transformStringChanged(transformString);
  }, [position, rotation, skew, scale, perspective]);

  const increment = (field, axis, delta) => {
    if (field === "position") {
      setPosition((prev) => ({ ...prev, [axis]: prev[axis] + delta }));
    } else if (field === "skew") {
      setSkew((prev) => ({ ...prev, [axis]: prev[axis] + delta }));
    }
  };

  const incrementRotation = (axis, delta) => {
    setRotation((prev) => ({ ...prev, [axis]: prev[axis] + delta }));
  };

  const incrementScale = (delta) => {
    setScale((prev) => prev + delta);
  };

  const updateStep = (field, value) => {
    setSteps((prev) => ({ ...prev, [field]: parseFloat(value) }));
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Current Values */}
        <p>
          Position: ({position.x}px, {position.y}px)
        </p>
        <p>
          Rotation: ({rotation.x}deg, {rotation.y}deg, {rotation.z}deg)
        </p>
        <p>
          Skew: ({skew.x}deg, {skew.y}deg)
        </p>
        <p>Scale: {scale}</p>
        <p>Perspective: {perspective}px</p>

        {/* Position Buttons */}
        <button onClick={() => increment("position", "y", -steps.position)}>Up</button>
        <div>
          <button onClick={() => increment("position", "x", -steps.position)}>Left</button>
          <button onClick={() => increment("position", "y", steps.position)}>Down</button>
          <button onClick={() => increment("position", "x", steps.position)}>Right</button>
        </div>

        {/* Rotation Buttons */}
        <div>
          <button onClick={() => incrementRotation("x", -steps.rotation)}>Rotate X Left</button>
          <button onClick={() => incrementRotation("x", steps.rotation)}>Rotate X Right</button>
          <button onClick={() => incrementRotation("y", -steps.rotation)}>Rotate Y Left</button>
          <button onClick={() => incrementRotation("y", steps.rotation)}>Rotate Y Right</button>
          <button onClick={() => incrementRotation("z", -steps.rotation)}>Rotate Z Left</button>
          <button onClick={() => incrementRotation("z", steps.rotation)}>Rotate Z Right</button>
        </div>

        {/* Skew Buttons */}
        <div>
          <button onClick={() => increment("skew", "x", -steps.skew)}>Skew X Left</button>
          <button onClick={() => increment("skew", "x", steps.skew)}>Skew X Right</button>
          <button onClick={() => increment("skew", "y", -steps.skew)}>Skew Y Up</button>
          <button onClick={() => increment("skew", "y", steps.skew)}>Skew Y Down</button>
        </div>

        {/* Scale Buttons */}
        <div>
          <button onClick={() => incrementScale(steps.scale)}>Scale Up</button>
          <button onClick={() => incrementScale(-steps.scale)}>Scale Down</button>
        </div>

        {/* Perspective Buttons */}
        <div>
          <button onClick={() => setPerspective(perspective + steps.perspective)}>
            Increase Perspective
          </button>
          <button onClick={() => setPerspective(perspective - steps.perspective)}>
            Decrease Perspective
          </button>
        </div>

        {/* Step Inputs */}
        <div>
          <label>
            Position Step:
            <input
              type="number"
              value={steps.position}
              onChange={(e) => updateStep("position", e.target.value)}
            />
          </label>
          <label>
            Rotation Step:
            <input
              type="number"
              value={steps.rotation}
              onChange={(e) => updateStep("rotation", e.target.value)}
            />
          </label>
          <label>
            Skew Step:
            <input
              type="number"
              value={steps.skew}
              onChange={(e) => updateStep("skew", e.target.value)}
            />
          </label>
          <label>
            Scale Step:
            <input
              type="number"
              step="0.1"
              value={steps.scale}
              onChange={(e) => updateStep("scale", e.target.value)}
            />
          </label>
          <label>
            Perspective Step:
            <input
              type="number"
              value={steps.perspective}
              onChange={(e) => updateStep("perspective", e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProjectorControlPanel;
