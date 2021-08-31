import React, { useState, useRef, useEffect } from "react";
import { RoutedMap, MappingConstants } from "../../index";
import GazetteerSearchComponent from "../../GazetteerSearchComponent";
import GazetteerHitDisplay from "../../GazetteerHitDisplay";
import { md5FetchText } from "../../tools/fetching";
import { getGazDataForTopicIds } from "../../tools/gazetteerHelper";
import ProjSingleGeoJson from "../../ProjSingleGeoJson";
import { storiesCategory } from "./StoriesConf";
import TopicMapContextProvider from "../../contexts/TopicMapContextProvider";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import IconComp from "../../commons/Icon";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

import { faBars } from "@fortawesome/free-solid-svg-icons";

export default {
  title: storiesCategory + "GazetteerSearchControl",
};

const getGazData = async (setData) => {
  const prefix = "GazDataForStories";
  const sources = {};

  // gazData.push(await md5FetchJSON(prefix, 'https://updates.cismet.de/test/adressen.json'));
  sources.adressen = await md5FetchText(
    prefix,
    "https://wunda-geoportal.cismet.de/data/3857/adressen.json"
  );
  sources.bezirke = await md5FetchText(
    prefix,
    "https://wunda-geoportal.cismet.de/data/3857/bezirke.json"
  );
  sources.quartiere = await md5FetchText(
    prefix,
    "https://wunda-geoportal.cismet.de/data/3857/quartiere.json"
  );
  sources.pois = await md5FetchText(
    prefix,
    "https://wunda-geoportal.cismet.de/data/3857/pois.json"
  );
  sources.kitas = await md5FetchText(
    prefix,
    "https://wunda-geoportal.cismet.de/data/3857/kitas.json"
  );

  const gazData = getGazDataForTopicIds(sources, [
    "pois",
    "kitas",
    "bezirke",
    "quartiere",
    "adressen",
  ]);

  setData(gazData);
};

export const SimpleMapWithDetachedGazetteerSearchBox = () => {
  const mapStyle = {
    height: 600,
    cursor: "pointer",
  };
  let urlSearchParams = new URLSearchParams(window.location.href);
  const mapRef = useRef(null);
  const [gazetteerHit, setGazetteerHit] = useState(null);
  const [overlayFeature, setOverlayFeature] = useState(null);
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <div>
      <div>Simple Map with detached GazetteerSearchControl</div>

      <br />
      <TopicMapContextProvider featureItemsURL="/data/parkscheinautomatenfeatures.json">
        <div>
          <GazetteerSearchComponent
            mapRef={mapRef}
            gazetteerHit={gazetteerHit}
            setGazetteerHit={setGazetteerHit}
            overlayFeature={overlayFeature}
            setOverlayFeature={setOverlayFeature}
            gazData={gazData}
            enabled={gazData.length > 0}
            dropup={false}
            referenceSystem={MappingConstants.crs3857}
            referenceSystemDefinition={MappingConstants.proj4crs3857def}
          />
        </div>
        <div style={{ height: 50 }}></div>
        <RoutedMap
          style={mapStyle}
          key={"leafletRoutedMap"}
          referenceSystem={MappingConstants.crs3857}
          referenceSystemDefinition={MappingConstants.proj4crs3857def}
          ref={mapRef}
          layers=""
          doubleClickZoom={false}
          onclick={(e) => console.log("gazetteerHit", gazetteerHit)}
          ondblclick={(e) => console.log("doubleclick", e)}
          autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
          backgroundlayers={"ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100"}
          urlSearchParams={urlSearchParams}
          fullScreenControlEnabled={false}
          locateControlEnabled={false}
          minZoom={7}
          maxZoom={18}
          zoomSnap={0.5}
          zoomDelta={0.5}
        >
          {overlayFeature && (
            <ProjSingleGeoJson
              key={JSON.stringify(overlayFeature)}
              geoJson={overlayFeature}
              masked={true}
              mapRef={mapRef}
            />
          )}
          <GazetteerHitDisplay
            key={"gazHit" + JSON.stringify(gazetteerHit)}
            gazetteerHit={gazetteerHit}
          />
        </RoutedMap>
      </TopicMapContextProvider>
    </div>
  );
};

export const SimpleMapWithDetachedGazetteerSearchBoxAndNoTopicMapContextProvider = () => {
  const mapStyle = {
    height: 600,
    cursor: "pointer",
  };
  let urlSearchParams = new URLSearchParams(window.location.href);
  const mapRef = useRef(null);
  const [gazetteerHit, setGazetteerHit] = useState(null);
  const [overlayFeature, setOverlayFeature] = useState(null);
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <div>
      <div>Simple Map with detached GazetteerSearchControl</div>

      <br />
      <div>
        <GazetteerSearchComponent
          mapRef={mapRef}
          gazetteerHit={gazetteerHit}
          setGazetteerHit={setGazetteerHit}
          overlayFeature={overlayFeature}
          setOverlayFeature={setOverlayFeature}
          gazData={gazData}
          enabled={gazData.length > 0}
          dropup={false}
          referenceSystem={MappingConstants.crs3857}
          referenceSystemDefinition={MappingConstants.proj4crs3857def}
        />
      </div>
      <div style={{ height: 50 }}></div>
      <RoutedMap
        style={mapStyle}
        key={"leafletRoutedMap"}
        referenceSystem={MappingConstants.crs3857}
        referenceSystemDefinition={MappingConstants.proj4crs3857def}
        ref={mapRef}
        layers=""
        doubleClickZoom={false}
        onclick={(e) => console.log("gazetteerHit", gazetteerHit)}
        ondblclick={(e) => console.log("doubleclick", e)}
        autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
        backgroundlayers={"ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100"}
        urlSearchParams={urlSearchParams}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
      >
        {overlayFeature && (
          <ProjSingleGeoJson
            key={JSON.stringify(overlayFeature)}
            geoJson={overlayFeature}
            masked={true}
            mapRef={mapRef}
          />
        )}
        <GazetteerHitDisplay
          key={"gazHit" + JSON.stringify(gazetteerHit)}
          gazetteerHit={gazetteerHit}
        />
      </RoutedMap>
    </div>
  );
};

export const SimpleMapWithDetachedGazetteerSearchBoxInABootstrapMenu = () => {
  const mapStyle = {
    height: 600,
    cursor: "pointer",
  };
  let urlSearchParams = new URLSearchParams(window.location.href);
  const mapRef = useRef(null);
  const [gazetteerHit, setGazetteerHit] = useState(null);
  const [overlayFeature, setOverlayFeature] = useState(null);
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);

  return (
    <div>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Nav className="mr-auto">
          <Navbar.Brand href="#home">Simple Map with detached GazetteerSearchControl</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Nav className="mr-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="mr-auto text-primary">
            {/* <Nav className="mr-auto justify-content-end"> */}
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
            </Nav.Link>
          </Nav>
        </Nav>
        <Form>
          <GazetteerSearchComponent
            mapRef={mapRef}
            gazetteerHit={gazetteerHit}
            setGazetteerHit={setGazetteerHit}
            overlayFeature={overlayFeature}
            setOverlayFeature={setOverlayFeature}
            gazData={gazData}
            enabled={gazData.length > 0}
            dropup={false}
            referenceSystem={MappingConstants.crs3857}
            referenceSystemDefinition={MappingConstants.proj4crs3857def}
          />
        </Form>
        <Button onClick={() => {}}>
          <Icon icon={faBars} />
        </Button>
      </Navbar>

      <div style={{ height: 5 }}></div>
      <RoutedMap
        style={mapStyle}
        key={"leafletRoutedMap"}
        referenceSystem={MappingConstants.crs3857}
        referenceSystemDefinition={MappingConstants.proj4crs3857def}
        ref={mapRef}
        layers=""
        doubleClickZoom={false}
        onclick={(e) => console.log("gazetteerHit", gazetteerHit)}
        ondblclick={(e) => console.log("doubleclick", e)}
        autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
        backgroundlayers={"ruhrWMSlight@40|trueOrtho2018@10|rvrSchrift@100"}
        urlSearchParams={urlSearchParams}
        fullScreenControlEnabled={false}
        locateControlEnabled={false}
        minZoom={7}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
      >
        {overlayFeature && (
          <ProjSingleGeoJson
            key={JSON.stringify(overlayFeature)}
            geoJson={overlayFeature}
            masked={true}
            mapRef={mapRef}
          />
        )}
        <GazetteerHitDisplay
          key={"gazHit" + JSON.stringify(gazetteerHit)}
          gazetteerHit={gazetteerHit}
        />
      </RoutedMap>
    </div>
  );
};
