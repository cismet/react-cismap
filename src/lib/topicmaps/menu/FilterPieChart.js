import React from "react";

import ReactChartkick, { PieChart } from "react-chartkick";
import Chart from "chart.js";

ReactChartkick.addAdapter(Chart);

const FilterPieChart = ({
  filteredItems,
  itemGetClassKey = () => "noclassavailable",
  getColor = (item) => "red",
  visible = true,
}) => {
  if (visible) {
    let stats = {};
    let colormodel = {};
    let piechartData = [];
    let piechartColor = [];
    if (filteredItems) {
      for (let item of filteredItems) {
        const itemClassKey = itemGetClassKey(item);

        if (stats[itemClassKey] === undefined) {
          stats[itemClassKey] = 1;
          colormodel[itemClassKey] = getColor(item);
        } else {
          stats[itemClassKey] += 1;
        }
      }

      for (let key in stats) {
        piechartData.push([key, stats[key]]);
        piechartColor.push(colormodel[key]);
      }
    }
    return (
      <PieChart
        data={piechartData}
        donut={true}
        title="Verteilung"
        legend={false}
        colors={piechartColor}
      />
    );
  } else {
    return null;
  }
};

export default FilterPieChart;
