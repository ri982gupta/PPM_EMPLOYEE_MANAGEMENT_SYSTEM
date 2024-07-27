import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect } from "react";

export default function WOWChart({ yAxisAmt, xAxis, executive, WOW }) {
  const summaryChart = {
    lang: {
      thousandsSep: ",",
      decimalPoint: ".",
    },
    chart: {
      type: "line",
      width: 670,
    },
    title: {
      text:
        "WoW Summary Analysis " + (executive === "" ? "" : "of ") + executive,
    },
    xAxis: {
      categories: xAxis,
      crosshair: true,
      title: {
        text: "Weeks",
      },
    },
    yAxis: {
      allowDecimals: true,
      padding: 1,
      title: {
        text: "Amount",
      },
    },

    tooltip: {
      formatter: function () {
        const formattedValue = Highcharts.numberFormat(this.y, 0, ".", ",");
        return `${this.x} <br/>${this.series.name} ${formattedValue} `;
      },
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
      },
    },
    series: yAxisAmt,
  };

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 customCard">
      <HighchartsReact highcharts={Highcharts} options={summaryChart} />
    </div>
  );
}
