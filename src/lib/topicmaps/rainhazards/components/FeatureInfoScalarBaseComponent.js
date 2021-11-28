import React from "react";
const Comp = ({ featureInfoValue, featureValueProcessor }) => {
  return (
    <div>
      <h2
        style={{
          marginTop: 0,
          marginBottom: 0,
          textAlign: "center",
        }}
      >
        {featureInfoValue !== -10 && featureValueProcessor(featureInfoValue)}
        {featureInfoValue === -10 && "..."}
      </h2>
    </div>
  );
};
export default Comp;
