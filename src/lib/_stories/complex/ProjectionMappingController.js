import React from "react";

import "./customLeafletFullscreen.css";
import "./blurredPaths.css";
import { useProjection } from "react-projection-mapping";

const Controller = ({ width, height }) => {
  const projection = useProjection();
  console.log("projection", projection);
  const { selectedCorner, setSelectedCorner } = projection;
  return (
    <div
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "absolute",
        top: (height - 100) / 2,
        left: (width - 100) / 2,
        width: "150px",
        height: "150px",
        zIndex: 99999999999,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr", // Two columns
          gridTemplateRows: "1fr 1fr 1fr", // Two rows
          gridGap: "10px", // Space between buttons
          width: "150px", // Adjust as needed
          height: "150px", // Adjust as needed
          opacity: 1,
          // Add other styles as needed
        }}
      >
        <button
          onClick={() => {
            const element = document.querySelector(".react-projection-mapping__corner");
            console.log("zzz el", element);
            setSelectedCorner(0);
          }}
          style={{ gridArea: "1 / 1" }}
        >
          UL
        </button>{" "}
        {/* Upper Left */}
        <button
          onClick={() => {
            const element = document.querySelector(".react-projection-mapping__corner");
            console.log("zzz el", element);

            if (element) {
              element.click();
            }
            setSelectedCorner(1);
          }}
          style={{ gridArea: "1 / 3" }}
        >
          UR
        </button>{" "}
        {/* Upper Right */}
        <button
          onClick={() => {
            setSelectedCorner(2);
          }}
          style={{ gridArea: "3 / 1" }}
        >
          LL
        </button>{" "}
        {/* Lower Left */}
        <button
          onClick={() => {
            setSelectedCorner(3);
          }}
          style={{ gridArea: "3 / 3" }}
        >
          LR
        </button>{" "}
        {/* Lower Right */}
        <div
          style={{
            color: "red",
            gridArea: "2 / 2",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          {selectedCorner}
        </div>
      </div>
    </div>
  );
};

export default Controller;
