import React, { useContext } from "react";
import queryString from "query-string";
import { TopicMapContext } from "../contexts/TopicMapContextProvider";
import { ResponsiveTopicMapContext } from "../contexts/ResponsiveTopicMapContextProvider";
import { FeatureCollectionContext } from "../contexts/FeatureCollectionContextProvider";
import { TopicMapStylingContext } from "../contexts/TopicMapStylingContextProvider";

const Box = () => {
  const { history, titleFactory } = useContext(TopicMapContext);
  const responsiveTopicMapContext = useContext(ResponsiveTopicMapContext);
  const featureCollectionContext = useContext(FeatureCollectionContext);
  const topicMapStylingContext = useContext(TopicMapStylingContext);

  const width = responsiveTopicMapContext.windowSize?.width || 0;
  let title = null;
  let themenstadtplanDesc = "";
  let titleContent;
  let qTitle = queryString.parse(history.location.search).title;
  if (qTitle !== undefined) {
    if (qTitle === null || qTitle === "") {
      if (titleFactory !== undefined) {
        titleContent = titleFactory({
          featureCollectionContext,
          responsiveTopicMapContext,
          topicMapStylingContext,
        });
      }
    } else {
      themenstadtplanDesc = qTitle;
      titleContent = <div>{themenstadtplanDesc}</div>;
    }
    if (titleContent) {
      title = (
        <table
          style={{
            width: width - 54 - 12 - 38 - 12 + "px",
            height: "30px",
            position: "absolute",
            left: 54,
            top: 12,
            zIndex: 555,
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  textAlign: "center",
                  verticalAlign: "middle",
                  background: "#ffffff",
                  color: "black",
                  opacity: "0.9",
                  paddingLeft: "10px",
                }}
              >
                {titleContent}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
  }

  return title;
};

export default Box;
