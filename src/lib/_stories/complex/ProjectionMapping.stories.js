import React from "react";

import { TopicMapContextProvider } from "../../contexts/TopicMapContextProvider";
import TopicMapComponent from "../../topicmaps/TopicMapComponent";
import { storiesCategory } from "./StoriesConf";
import { Layer, Projection, useProjection } from "react-projection-mapping";
import { useWindowSize } from "../../contexts/ResponsiveTopicMapContextProvider";

export default {
  title: storiesCategory + "TopicMapComponent",
};
const update = ({ layers, isEnd }) => {
  console.log("update", layers, isEnd);
};
export const MostSimpleTopicMapWithProjectionMapping = () => {
  const [width, height] = useWindowSize();
  const upperLeft = [-100, -100];
  const upperRight = [width, 0];
  const lowerLeft = [0, height];
  const lowerRight = [width, height];

  const data = {
    projectedMap: {
      corners: [...upperLeft, ...upperRight, ...lowerLeft, ...lowerRight],
    },
  };

  const Controller = () => {
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
          width: "100px",
          height: "100px",
        }}
      >
        <div
          style={{
            zIndex: 99999999999,
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
              setSelectedCorner(0);
            }}
            style={{ gridArea: "1 / 1" }}
          >
            UL
          </button>{" "}
          {/* Upper Left */}
          <button style={{ gridArea: "1 / 3" }}>UR</button> {/* Upper Right */}
          <button style={{ gridArea: "3 / 1" }}>LL</button> {/* Lower Left */}
          <button style={{ gridArea: "3 / 3" }}>LR</button> {/* Lower Right */}
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

  return (
    <Projection data={data} onChange={update} edit={true} enabled={true}>
      <Layer id="projectedMap">
        <TopicMapContextProvider>
          <TopicMapComponent
            mapStyle={{ backgroundColor: "black" }}
            backgroundlayers="empty"
            _fullScreenControl={false}
            _zoomControls={false}
            homeZoom={19}
            gazData={undefined}
            gazetteerSearchControl={false}
          ></TopicMapComponent>
          <Controller />
        </TopicMapContextProvider>
      </Layer>
    </Projection>
  );
};
