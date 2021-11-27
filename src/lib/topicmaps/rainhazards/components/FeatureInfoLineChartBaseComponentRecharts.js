import { random } from "chroma-js";
import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
} from "recharts";
const Comp = ({
  featureInfoValue,
  featureValueProcessor,
  featureSingleValueProcessor,
  xtitle,
  ytitle,
  activeTimeSeriesPoint,
  intermediateValuesCount,
  headerColor,
  textColor,
  currentFeatureInfoValue,
  setActiveTimeSeriesPoint,
}) => {
  const map = {};
  const data = [];
  for (const value of featureInfoValue) {
    const entry = {};
    entry.time = value.time;
    if (value.value) {
      entry.value = featureValueProcessor(value.value);
    }
    data.push(entry);
    map[entry.time] = entry.value;
  }

  const [hoveringValue, setHoveringValue] = React.useState();
  const hoveringValueRef = React.useRef(hoveringValue);
  useEffect(() => {
    hoveringValueRef.current = hoveringValue;
  }, [hoveringValue]);

  const maxTimePoint = data[data.length - 1].time;
  const minTimePoint = data[0].time;
  const initialOffset = maxTimePoint / data.length;

  const maxTimeSeriesPoint = (data.length - 1) * intermediateValuesCount;
  const activeTimeSeriesPointPosition =
    (activeTimeSeriesPoint / maxTimeSeriesPoint) * (maxTimePoint - minTimePoint) + initialOffset;

  const [dragActive, setDragActive] = React.useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LineChart
        key={"LineChart" + currentFeatureInfoValue + "." + hoveringValueRef.current === undefined}
        margin={{
          top: 1,
          right: 1,
          left: 1,
          bottom: 1,
        }}
        style={{
          fontFamily: "Roboto, sans-serif",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          KhtmlUserSelect: "none",
          MozUserSelect: "none",
          MsUserSelect: "none",
          userSelect: "none",
        }}
        width={230}
        height={160}
        data={data}
        onClick={() => {
          if (hoveringValueRef.current) {
            const newActiveTimeSeriesPoint =
              ((hoveringValueRef.current.time - minTimePoint) / (maxTimePoint - minTimePoint)) *
              maxTimeSeriesPoint;
            setActiveTimeSeriesPoint(newActiveTimeSeriesPoint);
          }
        }}
      >
        <XAxis
          tick={{ fontSize: 10 }}
          dataKey="time"
          type="number"
          height={xtitle !== undefined ? 35 : undefined}
        >
          {xtitle && (
            <Label
              style={{ marginTop: 10 }}
              fontSize={12}
              value={xtitle}
              position="insideBottom"
              xangle={-90}
              style={{ textAnchor: "middle", fill: "grey" }} //needs to be fill because its a svg node
            />
          )}
        </XAxis>
        <YAxis tick={{ fontSize: 10 }} width={ytitle !== undefined ? 40 : undefined}>
          {ytitle && (
            <Label
              fontSize={12}
              value={ytitle}
              position="insideLeft"
              angle={-90}
              style={{ textAnchor: "middle", fill: "grey" }} //needs to be fill because its a svg node
            />
          )}
        </YAxis>
        <CartesianGrid strokeDasharray="2 3" />
        <Line type="monotone" dataKey="value" stroke="#7995C5" isAnimationActive={false} />
        <ReferenceLine
          key={"refLine" + currentFeatureInfoValue + "." + hoveringValueRef.current === undefined}
          x={activeTimeSeriesPointPosition}
          stroke="grey"
          label=""
        >
          {currentFeatureInfoValue && hoveringValue === undefined && (
            <Label
              fontSize={12}
              value={featureSingleValueProcessor(currentFeatureInfoValue)}
              position="insideBottomRight"
              style={{
                fill: "#000000B3",
              }}
            />
          )}
        </ReferenceLine>

        <Tooltip
          content={(e) => {
            const { active, payload, label } = e;
            let hovVal = payload[0]?.payload;

            if (hovVal === undefined && active === true && label) {
              hovVal = { time: label };
            }

            if (hovVal && JSON.stringify(hoveringValueRef.current) !== JSON.stringify(hovVal)) {
              setHoveringValue(hovVal);
            } else if (hovVal === undefined && hoveringValueRef.current !== undefined) {
              setHoveringValue(undefined);
            }

            if (hovVal && hovVal.value) {
              return (
                <div
                  style={{
                    borderRadius: "7px",
                    background: "white",
                    opacity: 0.7,
                    color: "black",
                    paddingTop: "5px",

                    paddingBottom: "5px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                  }}
                >
                  {featureSingleValueProcessor(hovVal.value / 100)}
                </div>
              );
            } else {
              return <div />;
            }
          }}
        />
      </LineChart>
    </div>
  );
};
export default Comp;
