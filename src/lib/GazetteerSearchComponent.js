import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import Icon from "./commons/Icon";
import { builtInGazetteerHitTrigger } from "./tools/gazetteerHelper";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faSun } from '@fortawesome/free-solid-svg-icons';

import Control from "react-leaflet-control";
import { Form, FormGroup, InputGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { TopicMapContext } from "./contexts/TopicMapContextProvider";
import { FeatureCollectionDispatchContext } from "./contexts/FeatureCollectionContextProvider";

const COMP = ({
  mapRef,
  dropup = true,
  searchAfterGazetteer = false,
  searchInProgress = false,
  searchAllowed = false,
  searchIcon = <Icon name="search" />,
  overlayFeature = null,
  gazetteerHit = null,
  setGazetteerHit = () => {},
  searchButtonTrigger = () => {},
  setOverlayFeature = () => {},
  gazSearchMinLength = 2,
  enabled = true,

  placeholder = "Geben Sie einen Suchbegriff ein",
  pixelwidth = 300,
  searchControlPosition,
  gazData = [],
  gazetteerHitAction = () => {},
  gazeteerHitTrigger,
  gazetteerHitTrigger,
  tooltipPlacement = "top",
  searchTooltipProvider = function () {
    return (
      <Tooltip
        style={{
          zIndex: 20000000,
        }}
        id="searchTooltip"
      >
        Objekte suchen
      </Tooltip>
    );
  },
  gazClearTooltipProvider = () => (
    <Tooltip
      style={{
        zIndex: 20000000,
      }}
      id="gazClearTooltip"
    >
      Suche zurücksetzen
    </Tooltip>
  ),
  renderMenuItemChildren = (option, props, index) => {
    // console.log('option.glyph', option.glyph);
    // console.log('faSun', faSun);
    return (
      <div key={option.sorter}>
        <Icon
          style={{
            marginRight: "10px",
            width: "18px",
          }}
          name={option.glyph}
          overlay={option.overlay}
          size={"lg"}
        />

        <span>{option.string}</span>
      </div>
    );
  },
  referenceSystem,
  referenceSystemDefinition,
  autoFocus = true,
}) => {
  const _gazetteerHitTrigger = gazetteerHitTrigger || gazeteerHitTrigger;

  const internalGazetteerHitTrigger = (hit) => {
    builtInGazetteerHitTrigger(
      hit,
      mapRef.current.leafletMap.leafletElement,
      referenceSystem,
      referenceSystemDefinition,
      setGazetteerHit,
      setOverlayFeature,
      _gazetteerHitTrigger
    );
  };

  const typeaheadRef = useRef(null);
  const searchOverlay = useRef(null);
  const controlRef = useRef(null);
  useEffect(() => {
    if (controlRef.current !== null) {
      L.DomEvent.disableScrollPropagation(controlRef.current.leafletElement._container);
    }
  });

  const internalSearchButtonTrigger = (event) => {
    if (searchOverlay) {
      searchOverlay.current.hide();
    }
    if (searchInProgress === false && searchButtonTrigger !== undefined) {
      clear();
      setGazetteerHit(null);
      gazetteerHitAction(null);
      searchButtonTrigger(event);
    } else {
      //console.log("search in progress or no searchButtonTrigger defined");
    }
  };
  const internalClearButtonTrigger = (event) => {
    if (overlayFeature !== null) {
      setOverlayFeature(null);
    }

    clear();
    setGazetteerHit(null);
    gazetteerHitAction(null);
  };

  const clear = () => {
    typeaheadRef.current.clear();
  };
  let firstbutton;

  const buttonDisabled = overlayFeature === null && gazetteerHit === null;
  return (
    <Form
      style={{
        width: pixelwidth + "px",
      }}
      action="#"
    >
      <FormGroup>
        <InputGroup>
          {/* {firstbutton} */}
          <InputGroup.Prepend onClick={internalClearButtonTrigger}>
            <OverlayTrigger
              placement={tooltipPlacement}
              rootClose={true}
              overlay={gazClearTooltipProvider()}
            >
              <Button
                style={
                  buttonDisabled === false
                    ? {
                        backgroundImage: "linear-gradient(to bottom,#fff 0,#e0e0e0 100%)",
                      }
                    : { backgroundColor: "#e0e0e0", borderColor: "#ffffff00" }
                }
                //style={{ backgroundColor: 'grey', border: 0 }}
                disabled={buttonDisabled}
              >
                <Icon style={{ color: "black" }} name="times" />
              </Button>
            </OverlayTrigger>
          </InputGroup.Prepend>
          <Typeahead
            id="haz-search-typeahead"
            ref={typeaheadRef}
            style={{ width: `${pixelwidth}px` }}
            labelKey="string"
            options={gazData}
            onChange={internalGazetteerHitTrigger}
            paginate={true}
            dropup={dropup}
            disabled={!enabled}
            placeholder={placeholder}
            minLength={gazSearchMinLength}
            filterBy={(option, props) => {
              return option.string.toLowerCase().startsWith(props.text.toLowerCase());
            }}
            onInputChange={(text, event) => {}}
            align={"justify"}
            emptyLabel={"Keine Treffer gefunden"}
            paginationText={"Mehr Treffer anzeigen"}
            autoFocus={autoFocus}
            submitFormOnEnter={true}
            searchText={"suchen ..."}
            renderMenuItemChildren={renderMenuItemChildren}
          />
        </InputGroup>
      </FormGroup>
    </Form>
  );
};

export default COMP;

COMP.propTypes = {
  enabled: PropTypes.bool,
  placeholder: PropTypes.string,
  pixelwidth: PropTypes.number,
  searchControlPosition: PropTypes.string,
  firstbutton: PropTypes.object,
  gazData: PropTypes.array,
  gazeteerHitTrigger: PropTypes.func,
  renderMenuItemChildren: PropTypes.func,
  gazClearTooltipProvider: PropTypes.func,
  gazSearchMinLength: PropTypes.number,
};
