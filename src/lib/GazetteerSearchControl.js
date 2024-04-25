import L from "leaflet";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useRef } from "react";
import Control from "react-leaflet-control";

import { ResponsiveTopicMapContext } from "./contexts/ResponsiveTopicMapContextProvider";
import { TopicMapContext } from "./contexts/TopicMapContextProvider";
import GazetteerSearchComponent from "./GazetteerSearchComponent";

const COMP = ({
  mapRef,
  searchAfterGazetteer,
  searchInProgress,
  searchAllowed,
  searchIcon,
  overlayFeature,
  gazetteerHit,
  setGazetteerHit,
  searchButtonTrigger,
  setOverlayFeature,
  gazSearchMinLength,
  enabled,
  placeholder,
  searchControlPosition,
  gazData,
  gazetteerHitAction,
  gazeteerHitTrigger,
  gazetteerHitTrigger,
  searchTooltipProvider,
  gazClearTooltipProvider,
  renderMenuItemChildren,
  pixelwidth = 300,
  autoFocus,
  tertiaryAction = undefined,
  tertiaryActionIcon = undefined,
  tertiaryActionTooltip = undefined,
  teriaryActionDisabled = undefined,
  gazetteerSearchComponent: CustomGazetteerSearchComponent, // New prop for custom component
}) => {
  const { responsiveState, searchBoxPixelWidth, gap, windowSize } = useContext(
    ResponsiveTopicMapContext
  );
  const controlRef = useRef(null);

  useEffect(() => {
    if (controlRef.current !== null) {
      L.DomEvent.disableScrollPropagation(controlRef.current.leafletElement._container);
    }
  });
  let _searchControlPosition;
  if (searchControlPosition === undefined) {
    _searchControlPosition = responsiveState === "normal" ? "bottomleft" : "bottomright";
  } else {
    _searchControlPosition = searchControlPosition;
  }
  const { referenceSystem, referenceSystemDefinition } = useContext(TopicMapContext);

  const _pixelwidth = responsiveState === "normal" ? pixelwidth : windowSize.width - gap;

  const SearchComponent = CustomGazetteerSearchComponent || GazetteerSearchComponent;

  return (
    <Control
      ref={controlRef}
      pixelwidth={pixelwidth}
      position={_searchControlPosition}
      style={{ outline: 0 }}
    >
      <SearchComponent
        {...{
          mapRef,
          searchAfterGazetteer,
          searchInProgress,
          searchAllowed,
          searchIcon,
          overlayFeature,
          gazetteerHit,
          setGazetteerHit,
          searchButtonTrigger,
          setOverlayFeature,
          gazSearchMinLength,
          enabled,
          placeholder,
          searchControlPosition,
          gazData,
          gazetteerHitAction,
          gazeteerHitTrigger,
          gazetteerHitTrigger,
          searchTooltipProvider,
          gazClearTooltipProvider,
          renderMenuItemChildren,
          pixelwidth: _pixelwidth,
          referenceSystem,
          referenceSystemDefinition,
          autoFocus,
          tertiaryAction,
          tertiaryActionIcon,
          tertiaryActionTooltip,
          teriaryActionDisabled,
        }}
      />
    </Control>
  );
};

export default COMP;
