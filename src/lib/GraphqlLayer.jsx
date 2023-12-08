import React, { useEffect, useState } from "react";
import FeatureCollectionDisplay from "./FeatureCollectionDisplay";

const GraphqlLayer = ({
  useHover,
  onMouseOver,
  onMouseOut,
  style,
  hoveredStyle,
  featureClickHandler,
  query,
  variables,
  endpoint,
  jwt,
  createFeature,
  loadingStateUpdated = (e) => {
    console.log("loadingStateUpdated:", e);
  },
}) => {
  const [feature, setFeature] = useState();
  const [hoveredFeature, setHoveredFeature] = useState(undefined);

  const myVirtHoverer = () => {
    const mouseoverHov = (feature) => {
      setHoveredFeature(feature);
      if (onMouseOver) {
        onMouseOver(feature);
      }
    };

    const mouseoutHov = () => {
      setHoveredFeature(undefined);
      if (onMouseOut) {
        onMouseOut();
      }
    };

    return { mouseoverHov, mouseoutHov };
  };
  myVirtHoverer.virtual = true;

  const fetchFeatureCollection = () => {
    loadingStateUpdated(true);
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          loadingStateUpdated(false);
          setFeature(undefined);
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        setFeature(createFeature(result.data));
        loadingStateUpdated(false);
      })
      .catch((error) => {
        loadingStateUpdated(false);
        setFeature(undefined);
        console.log("error", error);

        throw new Error("There was a problem with the fetch operation:", error);
      });
  };

  useEffect(() => {
    fetchFeatureCollection();
  }, [variables]);

  return (
    <FeatureCollectionDisplay
      featureCollection={feature}
      hoverer={useHover ? myVirtHoverer : null}
      style={(feature) => {
        if (feature?.id === hoveredFeature?.id) {
          return hoveredStyle;
        } else {
          return style;
        }
      }}
      featureClickHandler={featureClickHandler}
    />
  );
};

export default GraphqlLayer;
