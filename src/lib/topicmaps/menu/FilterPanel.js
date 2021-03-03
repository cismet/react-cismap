import React, { useContext, useState } from "react";
import Icon from "../../commons/Icon";
import Color from "color";
import { Form, Checkbox, Radio, Button, Badge, Tabs, Tab } from "react-bootstrap";
import { ResponsiveTopicMapContext } from "../../contexts/ResponsiveTopicMapContextProvider";
import {
  FeatureCollectionContext,
  FeatureCollectionDispatchContext,
} from "../../contexts/FeatureCollectionContextProvider";
import FilterPieChart from "./FilterPieChart";

const FilterPanel = ({ filterConfiguration }) => {
  const { windowSize } = useContext(ResponsiveTopicMapContext);
  const { setFilterState, setFilterMode } = useContext(FeatureCollectionDispatchContext);
  const { filterState, filterMode, filteredItems } = useContext(FeatureCollectionContext);

  const width = windowSize.width;
  const pieChart = (
    <FilterPieChart
      filteredItems={filteredItems}
      itemGetClassKey={(item) => item?.thema?.name}
      getColor={(item) => item?.thema?.farbe || "red"}
    ></FilterPieChart>
  );
  let widePieChartPlaceholder = null;
  let narrowPieChartPlaceholder = null;

  const resetFilter = () => {};
  if (width < 995) {
    narrowPieChartPlaceholder = (
      <div>
        <br />
        {pieChart}
      </div>
    );
  } else {
    widePieChartPlaceholder = <td>{pieChart}</td>;
  }

  //   let injectQueryParameter =
  //     "&inject=" + window.btoa(JSON.stringify([{ action: "setFilterAndApply", payload: filter }]));
  //   if (new URLSearchParams(window.location.href).get("getinjectorstring")) {
  //     console.log(injectQueryParameter);
  //   }
  const removeFilterFor = (filterKey, itemkey) => {
    const newFilterState = { ...filterState };
    newFilterState[filterKey] = filterState[filterKey].filter((itemIn) => itemIn !== itemkey);
    setFilterState(newFilterState);
  };
  const addFilterFor = (filterKey, itemkey) => {
    const newFilterState = JSON.parse(JSON.stringify(filterState));
    newFilterState[filterKey].push(itemkey);
    console.log("newFilterState", newFilterState);

    setFilterState(newFilterState);
  };

  const getFilterElements = (filterConf) => {
    switch (filterConf.type) {
      case "tags":
        return (
          <div style={{ margin: 10 }}>
            {filterConf.values.map((item, index) => {
              let style;
              const isSelected = () => filterState[filterConf.key].includes(item.key);

              let backgroundColorSelected,
                backgroundColorUnselected,
                backgroundColor,
                foregroundColor;
              if (item.color !== undefined) {
                backgroundColorSelected = item.color;
              } else {
                backgroundColorSelected = "#2664D8";
              }
              if (item.colorUnselected !== undefined) {
                backgroundColorUnselected = item.colorUnselected;
              } else {
                backgroundColorUnselected = "#eeeeee";
              }

              if (isSelected()) {
                backgroundColor = backgroundColorSelected;
              } else {
                backgroundColor = backgroundColorUnselected;
              }
              if (new Color(backgroundColor).isDark()) {
                foregroundColor = "white";
              } else {
                foregroundColor = "black";
              }

              style = { color: foregroundColor, backgroundColor };

              return (
                <span style={{ cursor: "pointer" }}>
                  <Badge
                    onClick={() => {
                      if (isSelected()) {
                        removeFilterFor(filterConf.key, item.key);
                      } else {
                        addFilterFor(filterConf.key, item.key);
                      }
                    }}
                    style={style}
                  >
                    {item.title || item.key}
                  </Badge>{" "}
                </span>
              );
            })}
          </div>
        );

      case "radioButtons":
        break;
      case "checkBoxes":
      default:
        return (
          <div style={{ margin: 10 }}>
            {filterConf.values.map((item, index) => {
              return (
                <div key={"div.chk." + index} style={{ margin: 2 }}>
                  <Form.Group controlId={"div.chk." + index}>
                    <Form.Check
                      type="checkbox"
                      readOnly={true}
                      key={"filter." + filterConf.key + index}
                      onClick={(e) => {
                        if (e.target.checked === false) {
                          removeFilterFor(filterConf.key, item.key);
                        } else {
                          addFilterFor(filterConf.key, item.key);
                        }
                      }}
                      checked={filterState[filterConf.key].includes(item.key)}
                      inline
                      label={
                        <span>
                          {item.title || item.key}
                          {item.color !== undefined && (
                            <Icon
                              style={{
                                color: item.color,
                                width: "30px",
                                textAlign: "center",
                              }}
                              name={"circle"}
                            />
                          )}
                        </span>
                      }
                    ></Form.Check>
                  </Form.Group>
                </div>
              );
            })}
          </div>
        );
        break;
    }
  };

  return (
    <div>
      <table border={0} width="100%">
        <tbody>
          <tr>
            {filterConfiguration.mode === "tabs" && (
              <td style={{ width: "330px" }}>
                <div style={{ width: "100%" }}>
                  <div>
                    <h4> Filtern nach</h4>
                    <Tabs
                      style={{ width: "100%" }}
                      id="controlled-tab-example"
                      defaultActiveKey={filterMode}
                      onSelect={(key) => {
                        setFilterMode(key);
                      }}
                    >
                      {filterConfiguration.filters.map((filterConf, indexy) => {
                        return (
                          <Tab
                            eventKey={filterConf.key}
                            title={filterConf.title}
                            style={{ paddingTop: 10 }}
                          >
                            <table border={0} style={{ width: "100%", margin: 5 }}>
                              <tbody>
                                <tr>
                                  <td align="center">
                                    <a
                                      className="showLinkColor"
                                      style={{
                                        margin: 4,
                                      }}
                                      onClick={() => {
                                        filterConf.setAll();
                                      }}
                                    >
                                      alle
                                    </a>
                                  </td>
                                  <td align="center">
                                    <a
                                      className="showLinkColor"
                                      style={{
                                        margin: 4,
                                      }}
                                      onClick={() => {
                                        filterConf.setNone();
                                      }}
                                    >
                                      keine
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            {getFilterElements(filterConf)}
                          </Tab>
                        );
                      })}
                    </Tabs>
                  </div>
                </div>
              </td>
            )}
            {filterConfiguration.mode === "list" && (
              <td valign="center" style={{ width: "330px" }}>
                {filterConfiguration.filters.map((filterConf, index) => {
                  return (
                    <Form.Group>
                      <Form.Label>
                        {filterConf.title}
                        {"  "}
                        <Icon
                          style={{
                            color: "grey",
                            width: "30px",
                            textAlign: "center",
                          }}
                          size="2x"
                          name={filterConf.icon}
                        />
                      </Form.Label>
                      {getFilterElements(filterConf)}
                    </Form.Group>
                  );
                })}

                <br />
                <br />
                <p>
                  <Button size="sm" variant="outline-secondary" onClick={() => resetFilter()}>
                    Filter zurücksetzen
                  </Button>
                </p>
              </td>
            )}
            {widePieChartPlaceholder}
          </tr>
        </tbody>
      </table>
      {narrowPieChartPlaceholder}
    </div>
  );
};

export default FilterPanel;
