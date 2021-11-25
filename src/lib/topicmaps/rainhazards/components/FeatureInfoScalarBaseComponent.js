import React from "react";
const Comp = ({ featureInfoValue, featureValueProcessor, noValueText }) => {
  return (
    <div>
      {featureInfoValue !== undefined && (
        <h2
          style={{
            marginTop: 0,
            marginBottom: 0,
            textAlign: "center",
          }}
        >
          {featureValueProcessor(featureInfoValue)}
        </h2>
      )}
      {featureInfoValue === undefined && <p>{noValueText}</p>}
    </div>
  );
};
export default Comp;
