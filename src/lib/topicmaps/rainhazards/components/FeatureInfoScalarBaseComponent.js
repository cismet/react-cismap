import React from "react";
const Comp = ({ featureInfoValue, featureValueProcessor, noValueText }) => {
  return (
    <div>
      <h2
        style={{
          marginTop: 0,
          marginBottom: 0,
          textAlign: "center",
        }}
      >
        {featureValueProcessor(featureInfoValue)}
      </h2>
    </div>
  );
};
export default Comp;
