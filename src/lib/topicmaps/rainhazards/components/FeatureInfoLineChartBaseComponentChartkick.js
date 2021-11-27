import React from "react";
import { LineChart } from "react-chartkick";
const Comp = ({ featureInfoValue, featureValueProcessor, noValueText, xtitle, ytitle }) => {
  const data = {};
  for (const value of featureInfoValue) {
    data[value.time] = featureValueProcessor(value.value);
  }
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <LineChart
        library={{
          tooltips: { enabled: false },
          scales: {
            yAxes: [
              {
                scaleLabel: { fontSize: 11 },
              },
            ],
            xAxes: [
              {
                scaleLabel: { fontSize: 11 },
              },
            ],
            annotation: {
              annotations: [
                {
                  type: "line",
                  mode: "vertical",
                  scaleID: "x-axis-0",
                  value: "50",
                  label: {
                    content: "My Vertical Line",
                    enabled: true,
                  },
                },
              ],
            },
          },
        }}
        xtitle={xtitle}
        ytitle={ytitle}
        width="230px"
        height="150px"
        data={data}
      />
    </div>
  );
};
export default Comp;
