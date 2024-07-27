import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);

export default function TargetTable({ targets }) {
  let xAxis = [];
  let target = [];
  let realised = [];
  let variance = [];
  let calls = [];
  let planned = [];
  const [table, settable] = useState([]);
  const [summaryChart, setsummaryChart] = useState({});

  useEffect(() => {
    const tableRenderer =
      Object.keys(targets).length > 0 &&
      targets.targets.map((data) => {
        let tableData = [];
        const keysArray = [
          "category",
          "target",
          "realised",
          "planned",
          "upside",
          "calls",
          "variance",
        ];
        keysArray.forEach((keys) => {
          if (data["id"] > -1) {
            switch (keys) {
              case "category":
                xAxis.push(data[keys]);
                break;
              case "target":
                target.push(parseFloat(data[keys]));
                break;
              case "realised":
                realised.push(parseFloat(data[keys]));
                break;
              case "planned":
                planned.push(parseFloat(Math.abs(data[keys])));
                break;
              case "upside":
                calls.push(parseFloat(Math.abs(data[keys])));
                break;
              case "variance":
                if (data[keys] > 0) variance.push(parseFloat(data[keys]));
                else variance.push(0);
                break;
              default:
            }
          }
          // console.log(parseInt(data[keys]) < 0 && data[keys].split('-')[1])
          tableData.push(
            data.id < 0 ? (
              <th key={keys} style={{ textAlign: "center" }}>
                {data[keys]}
              </th>
            ) : keys != "category" ? (
              <td
                style={{ textAlign: "right" }}
                data-toggle="tooltip"
                title={parseInt(data[keys]).toLocaleString("en-US")}
              >
                {data[keys] == null
                  ? "$"
                  : parseInt(data[keys]) >= 0
                  ? "$" + parseInt(data[keys]).toLocaleString("en-US")
                  : "-$" +
                    parseInt(data[keys]?.split("-")[1]).toLocaleString("en-US")}
              </td>
            ) : (
              <td key={keys}>
                {data[keys] == null
                  ? "$"
                  : keys === "category"
                  ? data[keys]
                  : "$" + parseInt(data[keys]).toLocaleString("en-US")}
              </td>
            )
          );
        });
        return <tr key={data.id}>{tableData}</tr>;
      });
    const summaryChart = {
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
        text: "Target, Realised/Closed, Planned/Upside, Calls and Variance",
        style: {
          fontSize: "15px", // Set font size to 16px
        },
      },
      xAxis: {
        categories: xAxis,
        labels: { style: { fontSize: "12px" } },
        gridLineWidth: 0.2,
      },
      yAxis: [
        {
          allowDecimals: false,
          min: 0,
          title: {
            text: "Target/Realised/Planned/Upside/Variance ($)",
          },
          gridLineWidth: 0.2,
        },
      ],
      tooltip: {
        formatter: function () {
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y.toLocaleString("en-US") +
            "<br/>"
          );
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        itemStyle: {
          fontSize: "12px", // Set font size to 12px
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
          name: "Upside",
          color: "#b3b3b3",
          data: calls,
          stack: "second",
          legendIndex: 4,
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
      ],
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

    settable(tableRenderer);
    setsummaryChart(summaryChart);
    console.log(targets);
  }, [targets]);

  return (
    <div className="col-md-12 row">
      <div className="col-md-6 mt-2 ">
        <HighchartsReact highcharts={Highcharts} options={summaryChart} />

        {/* <HighchartsReact
                    highcharts={Highcharts}
                    options={summaryChart}
                /> */}
      </div>
      <div className="col-md-6 pt-5 mt-5">
        <div
          style={{ backgroundColor: "#ffffff", padding: "2px" }}
          className="alert alert-warning"
        >
          <span className="ml-2">
            {" "}
            <FaInfoCircle size={"0.8em"} />
          </span>
          <span style={{ fontSize: "13px" }}>
            {" "}
            When Realised Revenue Considered, Upsided &amp; Planned Revenue are
            not considered
          </span>
        </div>
        <div className="darkHeader">
          <table className="table table-bordered  targetTable">
            <thead style={{ fontSize: "13px" }}>{table}</thead>
          </table>
        </div>
      </div>
    </div>
  );
}
