import ScoreCard from "./ScoreCard.json";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);

export default function FETPlannedByLocation({ ftePlanByLoc }) {
  let xAxis = [];
  let target = [];
  let realised = [];
  let variance = [];
  let calls = [];
  let planned = [];
  const [table, settable] = useState([]);
  const [summaryChart, setsummaryChart] = useState({});

  useEffect(() => {
    const tableRenderer = ftePlanByLoc?.map((data) => {
      let tableData = [];
      const keysArray = ["category", "revenue", "planned"];
      keysArray.forEach((keys) => {
        if (data["id"] > -1) {
          switch (keys) {
            case "category":
              xAxis.push(data[keys]);

              break;
            case "planned":
              planned.push(parseFloat(data[keys]));
              break;
            case "revenue":
              realised.push(parseFloat(data[keys]));
              break;

            default:
          }
        }
        tableData.push(
          data.id < 0 ? (
            <th key={keys} style={{ textAlign: "center" }}>
              {data[keys]}
            </th>
          ) : keys == "planned" || keys == "revenue" ? (
            <td key={keys} style={{ textAlign: "right" }}>
              {"$" + parseInt(data[keys]).toLocaleString("en-US")}
            </td>
          ) : (
            <td key={keys}> {data[keys]}</td>
          )
        );
      });
      return <tr key={data.id}>{tableData}</tr>;
    });
    const summaryChart = {
      chart: {
        type: "column",
        width: 500,
        options3d: {
          enabled: true,
          alpha: 8,
          beta: 12,
          viewDistance: 25,
          depth: 70,
        },
      },
      title: {
        text: "FTE Realised, Planned By Location",
        style: {
          fontSize: "15px", // Set font size to 16px
        },
      },
      xAxis: {
        categories: xAxis,
        gridLineWidth: 0.2,
      },
      yAxis: [
        {
          allowDecimals: false,
          min: 0,
          title: {
            text: "Realised / Planned ($)",
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
            parseInt(this.y).toLocaleString("en-US") +
            "<br/>"
          );
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
        },
      },
      series: [
        //     {
        //      name: 'Target',
        //      color: "rgba(34, 167, 240, 1)",
        //      data: target,
        //      stack: 'first',
        //      legendIndex: 1
        //  },
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
  }, [ftePlanByLoc]);

  return (
    <div className="col-12 darkHeader">
      <div className="col-12 ">
        <HighchartsReact highcharts={Highcharts} options={summaryChart} />
      </div>
      <div className="col-12 darkHeader">
        <table className="table table-bordered serviceTable">
          <thead style={{ fontSize: "13px" }}>{table}</thead>
        </table>
      </div>
    </div>
  );
}
