import React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { Hook, Console, Decode, Unhook } from "@nicksrandall/console-feed";
import { ResponsiveTopicMapContext } from "../contexts/ResponsiveTopicMapContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faExclamationTriangle,
  faGhost,
  faAlignLeft,
  faExclamationCircle,
  faInfo,
  faComment,
  faBug,
} from "@fortawesome/free-solid-svg-icons";
import useComponentSize from "@rehooks/component-size";
import localforage from "localforage";

const ALL = ["log", "debug", "info", "warn", "error"];
const CONF = {
  visible: true,
  ghost: false,
  trans: 0.7,
  categoryFilter: [],
  keywordFilter: "",
};
const ConsoleLog = ({ ghostModeAvailable = false, minifyAvailable = false }) => {
  const [log, setLog] = useState([]);
  const localforagekey = "@cismet.in.browser.log.console.state";

  useEffect(() => {
    (async () => {
      const value = await localforage.getItem(localforagekey);
      if (value) {
        setConf(value);
      } else {
        setConf(CONF);
      }
    })();
  }, []);
  const [conf, setConf] = useState();

  const myconsole = useRef(null);
  const theend = useRef(null);
  const { windowSize } = useContext(ResponsiveTopicMapContext);

  const size = windowSize || { width: 1000, height: 1000 };

  let toolbarRef = useRef(null);
  let toolbarSize = useComponentSize(toolbarRef);
  useEffect(() => {
    Hook(console, (newlog) => {
      setLog((oldlogs) => {
        setTimeout(() => {
          if (theend.current) {
            theend.current.scrollIntoView({ behavior: "smooth" });
          }
        }, 20);
        return [...oldlogs, Decode(newlog)];
      });
    });
    console.log("initialized");
    return () => Unhook(window.console);
  }, []);

  useEffect(() => {
    if (conf && conf.categoryFilter.length === 0) {
      setConf((oldconf) => ({ ...oldconf, categoryFilter: ALL }));
    }
  }, [conf]);
  if (conf) {
    const isDark = false;
    const logsShown = !minifyAvailable || conf.visible;
    const alphaBG = parseInt(conf.trans * 0.8 * 255).toString(16);
    const alpha = parseInt(conf.trans * 255).toString(16);
    const toggleConf = (key) => {
      setConf((oldConf) => {
        const toggleValue = !oldConf[key];
        const newConf = { ...oldConf };
        newConf[key] = toggleValue;
        localforage.setItem(localforagekey, newConf);
        return newConf;
      });
    };
    const toggleInConfArray = (key, value) => {
      setConf((oldConf) => {
        const newConf = { ...oldConf };
        if (newConf[key].includes(value)) {
          newConf[key] = newConf[key].filter((k) => k !== value);
        } else {
          newConf[key] = [...newConf[key], value];
        }
        localforage.setItem(localforagekey, newConf);
        return newConf;
      });
    };
    const changeConf = (key, value) => {
      setConf((oldConf) => {
        const newConf = { ...oldConf };
        newConf[key] = value;
        localforage.setItem(localforagekey, newConf);
        return newConf;
      });
    };

    const TransparencyButton = ({ confValue, value }) => {
      return (
        <a
          onClick={() => {
            changeConf("trans", value);
            setTimeout(() => {
              if (theend.current) {
                theend.current.scrollIntoView({ behavior: "auto" });
              }
            }, 20);
          }}
        >
          <span style={{ borderBottom: confValue === value ? "2px solid" : undefined }}>
            <FontAwesomeIcon
              style={{ marginRight: "3px ", marginLeft: "3px ", opacity: value }}
              icon={faAlignLeft}
            />
          </span>
        </a>
      );
    };
    const CategoryFilterButton = ({ confValue, value, icon }) => {
      return (
        <a
          onClick={() => {
            toggleInConfArray("categoryFilter", value);
            setTimeout(() => {
              if (theend.current) {
                theend.current.scrollIntoView({ behavior: "auto" });
              }
            }, 20);
          }}
        >
          <span
            style={{
              borderBottom:
                confValue.includes(value) || confValue.length === 0 ? "2px solid" : undefined,
            }}
          >
            <FontAwesomeIcon style={{ marginRight: "3px ", marginLeft: "3px " }} icon={icon} />
          </span>
        </a>
      );
    };

    const toolbar = (
      <div
        style={{
          backgroundColor: "#FFFBE5",
          color: "#5C3C00",
          left: 320,
          bottom: 6,
          border: "1px solid #cfd4d9",
          borderRadius: "2px",
          _width: size.width - 320 - 12 - 38 - 12 - 300,
          width: "100%",
          _height: "30px",
          zIndex: 999999,
          _position: "absolute",
          display: "flex",
          alignItems: "center",
          _pointerEvents: "none",
          padding: "0px 10px",
        }}
      >
        <div>
          {minifyAvailable && (
            <a
              onClick={() => {
                toggleConf("visible");
              }}
            >
              <FontAwesomeIcon
                style={{
                  marginRight: "25px ",
                  borderBottom: logsShown ? "2px solid" : undefined,
                }}
                icon={faEye}
              />
            </a>
          )}
          {ghostModeAvailable && (
            <a
              onClick={() => {
                toggleConf("ghost");
                setTimeout(() => {
                  if (theend.current) {
                    theend.current.scrollIntoView({ behavior: "auto" });
                  }
                }, 20);
              }}
            >
              <FontAwesomeIcon
                style={{
                  marginRight: "25px ",
                  borderBottom: conf.ghost === true ? "2px solid" : "undefined",
                }}
                icon={faGhost}
              />
            </a>
          )}
          <span style={{ marginRight: "5px ", marginLeft: "25px" }}>Transparency:</span>

          <TransparencyButton confValue={conf.trans} value={1} />
          <TransparencyButton confValue={conf.trans} value={0.7} />
          <TransparencyButton confValue={conf.trans} value={0.5} />
          <TransparencyButton confValue={conf.trans} value={0.2} />

          <span style={{ marginRight: "5px ", marginLeft: "25px" }}>Level:</span>
          <span style={{ marginRight: "5px " }} />

          <CategoryFilterButton
            confValue={conf.categoryFilter}
            value="error"
            icon={faExclamationTriangle}
          />
          <CategoryFilterButton
            confValue={conf.categoryFilter}
            value="warn"
            icon={faExclamationCircle}
          />
          <CategoryFilterButton confValue={conf.categoryFilter} value="info" icon={faInfo} />
          <CategoryFilterButton confValue={conf.categoryFilter} value="log" icon={faComment} />
          <CategoryFilterButton confValue={conf.categoryFilter} value="debug" icon={faBug} />

          <span style={{ marginRight: "5px " }}>Filter:</span>
          <input
            value={conf.keywordFilter}
            onChange={(e) => {
              changeConf("keywordFilter", e.target.value);
            }}
            type="text"
            id="fname"
            name="fname"
          />
        </div>
      </div>
    );

    const brightStyle = {
      BASE_LINE_HEIGHT: 1.2,
      BASE_FONT_FAMILY: "menlo, monospace",
      BASE_FONT_SIZE: "10px",
      LOG_ICON_WIDTH: 10,
      LOG_ICON_HEIGHT: 11,
      // Light mode override since the variant doesn't seem to do anything
      LOG_COLOR: "#000000" + alpha,
      LOG_BORDER: "#FOFOFO" + alpha,
      LOG_WARN_BACKGROUND: "#FFFBE5" + alphaBG,
      LOG_WARN_BORDER: "#FFF5C2" + alpha,
      LOG_WARN_COLOR: "#5C3C00" + alpha,
      LOG_ERROR_BACKGROUND: "#FFF0F0" + alphaBG,
      LOG_ERROR_BORDER: "#FFD6D6" + alpha,
      LOG_ERROR_COLOR: "#ff0000" + alpha,
      LOG_AMOUNT_COLOR: "#fffffff" + alpha,
    };

    const darkStyle = {
      BASE_LINE_HEIGHT: 1.2,
      BASE_FONT_FAMILY: "menlo, monospace",
      BASE_FONT_SIZE: "11px",
      LOG_ICON_WIDTH: 11,
      LOG_ICON_HEIGHT: 12,
    };

    const outerkeyConf = { ...conf };
    delete outerkeyConf.keywordFilter;

    return (
      <>
        <div
          key={"outerdivkey" + JSON.stringify(outerkeyConf)}
          style={{
            opacity: 1,
            backgroundColor: "#ffffff" + alphaBG,
            left: 54,
            top: 80,
            width: size.width - 54 - 12 - 38 - 12,
            height: logsShown ? size.height - 80 - 42 : toolbarSize.height,
            zIndex: 9999,
            position: "absolute",
            _overflow: "scroll",
            pointerEvents: conf.ghost === true ? "none" : "auto",
          }}
        >
          <div style={{ pointerEvents: "auto" }} ref={toolbarRef}>
            {toolbar}
          </div>
          {logsShown && (
            <div style={{ overflow: "scroll", height: size.height - 80 - 42 - toolbarSize.height }}>
              <Console
                styles={isDark ? darkStyle : brightStyle}
                ref={myconsole}
                variant="light"
                logs={log}
                searchKeywords={conf.keywordFilter}
                filter={conf.categoryFilter}
              />
              <div ref={theend} />
            </div>
          )}
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default ConsoleLog;
