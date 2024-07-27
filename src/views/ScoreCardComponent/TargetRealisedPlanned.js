import React, { useLayoutEffect, useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import TargetCharts from "./TargetCharts";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);

function TargetRealisedPlanned(props) {
  const { targetData, type } = props;

  const categoryData = useRef([]);
  const [chartData, setChartData] = useState({});
  const [displayTableData, setDisplayTableData] = useState(null);

  const HandleTableData = () => {
    let headerTitles = [
      "#",
      "Target",
      "Realised",
      "Planned",
      "Upside",
      "Call",
      "Variance",
    ];
    let headerTitlesKeys = [];
    setDisplayTableData(() => {
      return targetData.map((d, oIndex) => {
        let header = [];
        let dollar = "$";
        headerTitles.forEach((element, index) => {
          if (d.id == -1) {
            headerTitlesKeys.push(
              Object.keys(d).find((key) => d[key] === element)
            );
            header.push(
              <th style={{ textAlign: "center", position: "sticky", top: 0 }}>
                {element}
              </th>
            );
          } else {
            if (headerTitlesKeys[index] != "category") {
              header.push(
                <td
                  style={{ textAlign: "right" }}
                  title={
                    dollar +
                    "" +
                    parseInt(d[headerTitlesKeys[index]]).toLocaleString("en-US")
                  }
                >
                  {dollar +
                    "" +
                    parseInt(d[headerTitlesKeys[index]]).toLocaleString(
                      "en-US"
                    )}
                </td>
              );
            } else {
              header.push(
                <td title={d[headerTitlesKeys[index]]}>
                  {d[headerTitlesKeys[index]]}
                </td>
              );
            }
          }
        });
        return (
          <tr key={d.id} className={`${d.id === 0 && "trLvl0"}`}>
            {header}
          </tr>
        );
      });
    });
  };

  const HandleChartData = () => {
    let categoryTempData = [];

    let target = [];
    let realised = [];
    let planned = [];
    let upside = [];
    let variance = [];

    targetData.map((d) => {
      if (d.id != -1) {
        categoryTempData.push(d.category);
        for (let i in d) {
          switch (i) {
            case "target":
              target.push(parseInt(d[i]));
              break;
            case "revenue":
              realised.push(parseInt(d[i]));
              break;
            case "planned":
              planned.push(parseInt(d[i]));
              break;
            case "upside":
              upside.push(parseInt(d[i]));
              break;
            case "variance":
              variance.push(parseInt(d[i]));
              break;
            default:
          }
        }
      }
    });

    categoryData.current = categoryTempData;

    const chart = {
      credits: {
        enabled: false,
      },
      chart: {
        type: "column",
        width: 600,
        options3d: {
          enabled: true,
          alpha: 8,
          beta: 12,
          viewDistance: 25,
          depth: 70,
        },
      },

      title: {
        text: `Target, Realised, Planned , Calls and Variance By ${type}`,
        style: {
          fontSize: "15px", // Set font size to 16px
        },
      },

      xAxis: {
        categories: categoryData.current,
        gridLineWidth: 0.2,
      },

      yAxis: {
        // reversed: true,
        allowDecimals: false,
        min: 0,
        title: {
          text: "Target/Realised/Planned/Upside/Variance ($)",
        },
        gridLineWidth: 0.2,
      },

      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            parseInt(this.y).toLocaleString("en-US") +
            "<br/>"
          );
          // 'Total: ' + this.point.stackTotal;
        },
      },

      plotOptions: {
        column: {
          stacking: "normal",
        },
      },

      series: [
        {
          name: "Target",
          color: "rgba(34, 167, 240, 1)",
          data: target,
          stack: "first",
          legendIndex: 1,
        },
        {
          name: "Variance",
          color: "#ff6666",
          data: variance,
          stack: "second",
          legendIndex: 5,
        },
        {
          name: "Planned",
          color: "#ffc966",
          data: planned,
          stack: "second",
          legendIndex: 3,
        },
        {
          name: "Realised",
          color: "#66ff66",
          data: realised,
          stack: "second",
          legendIndex: 2,
        },
        {
          name: "Upside",
          color: "#b3b3b3",
          data: upside,
          stack: "second",
          legendIndex: 4,
        },
      ],
      exporting: {
        buttons: {
          contextButton: {
            symbolStrokeWidth: 1,
            symbolFill: "#a4edba",
            symbolStroke: "#330033",
          },
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 2000,
            },
          },
        ],
      },
    };
    setChartData(chart);
  };

  useEffect(() => {
    HandleChartData();
    HandleTableData();
  }, []);

  return (
    <div>
      <div className="col-12 mt-3 customCard card graph darkHeader">
        <HighchartsReact highcharts={Highcharts} options={chartData} />

        {/* <div><TargetCharts chartData={chartData} /></div> */}
        {displayTableData != null ? (
          <div
            className="mt-2 border border-white"
            style={{ maxHeight: "114px", overflowY: "auto" }}
          >
            <table
              style={{ width: "100%" }}
              className="table table-bordered serviceTable"
            >
              <thead style={{ fontSize: "13px" }}>{displayTableData}</thead>
            </table>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default TargetRealisedPlanned;
