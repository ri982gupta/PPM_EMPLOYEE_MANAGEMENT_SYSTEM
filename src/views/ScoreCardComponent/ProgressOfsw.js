import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";

export default function ProgressOfsw({ scoreCardData }) {
  let yServCreated = [];
  let ySwCreated = [];
  let yServClosed = [];
  let ySwClosed = [];
  let yServLost = [];
  let ySwLost = [];
  let yServCreatedCnt = [];
  let ySwCreatedCnt = [];
  let yServClosedCnt = [];
  let ySwClosedCnt = [];
  let yServLostCnt = [];
  let ySwLostCnt = [];
  let xAxis = [];
  let servCreated = 0,
    swCreated = 0,
    servClosed = 0,
    SwClosed = 0,
    servLost = 0,
    SwLost = 0;
  let servCreatedCntGraph = 0,
    swCreatedCntGraph = 0,
    servClosedCntGraph = 0,
    SwClosedCntGraph = 0,
    servLostCntGraph = 0,
    SwLostCntGraph = 0;
  const [table, settable] = useState([]);
  const [summaryChart, setsummaryChart] = useState({});

  useEffect(() => {
    const tableRenderer =
      Object.keys(scoreCardData).length > 0 &&
      scoreCardData.custWOWRecRev.map((data) => {
        let tableData = [];
        const keysArray = [
          "week_no",
          "serv_crated",
          "soft_created",
          "serv_closed",
          "soft_closed",
          "serv_lost",
          "soft_lost",
        ];
        keysArray.forEach((keys) => {
          if (keys == "week_no" && data.id > "0") xAxis.push(data[keys]);

          if (keys == "serv_crated" && data.id > "0") {
            servCreated = parseFloat(servCreated) + parseFloat(data[keys]);
            yServCreated.push(parseFloat(servCreated));
            yServCreatedCnt.push(parseInt(servCreatedCntGraph));
          }
          if (keys == "soft_created" && data.id > "0") {
            swCreated = parseFloat(swCreated) + parseFloat(data[keys]);
            ySwCreated.push(parseFloat(swCreated));
            ySwCreatedCnt.push(parseInt(swCreatedCntGraph));
          }
          if (keys == "serv_closed" && data.id > "0") {
            servClosed = parseFloat(servClosed) + parseFloat(data[keys]);
            yServClosed.push(parseFloat(servClosed));
            yServClosedCnt.push(parseInt(servClosedCntGraph));
          }
          if (keys == "soft_closed" && data.id > "0") {
            SwClosed = parseFloat(SwClosed) + parseFloat(data[keys]);
            ySwClosed.push(parseFloat(SwClosed));
            ySwClosedCnt.push(parseInt(SwClosedCntGraph));
          }
          if (keys == "serv_lost" && data.id > "0") {
            servLost = parseFloat(servLost) + parseFloat(data[keys]);
            yServLost.push(parseFloat(servLost));
            yServLostCnt.push(parseInt(servLostCntGraph));
          }
          if (keys == "soft_lost" && data.id > "0") {
            SwLost = parseFloat(SwLost) + parseFloat(data[keys]);
            ySwLost.push(parseFloat(SwLost));
            ySwLostCnt.push(parseInt(SwLostCntGraph));
          }
          keys !== "week_date" &&
            typeof data[keys] === "string" &&
            !keys.includes("_cnt") &&
            data[keys] !== "" &&
            data[keys] !== "#" &&
            data[keys] !== null &&
            tableData.push(
              data.id < 0 ? (
                <th
                  key={keys}
                  colSpan={data[keys].split("^&")[1]}
                  style={{ textAlign: "center" }}
                >
                  {data[keys].split("^&")[0]}
                </th>
              ) : keys !== "week_no" ? (
                <td key={keys} style={{ textAlign: "right" }}>
                  {"$" +
                    parseInt(data[keys]).toLocaleString("en-US") +
                    "(" +
                    data[keys + "_cnt"] +
                    ")"}{" "}
                </td>
              ) : (
                <td className="ellipsis" title={data[keys]}>
                  {" "}
                  {data[keys]}
                </td>
              )
            );
        });
        return <tr key={data.id}>{tableData}</tr>;
      });

    const yAxisAmt = [];
    const xAxisWeeks = [];

    yAxisAmt.push({
      name: "Serv Created",
      data: yServCreated,
      description: yServCreatedCnt,
    });
    yAxisAmt.push({
      name: "S/W Created",
      data: ySwCreated,
      description: ySwCreatedCnt,
    });
    yAxisAmt.push({
      name: "Serv Closed",
      data: yServClosed,
      description: yServClosedCnt,
    });
    yAxisAmt.push({
      name: "S/W Closed",
      data: ySwClosed,
      description: ySwClosedCnt,
    });
    yAxisAmt.push({
      name: "Serv Lost",
      data: yServLost,
      description: yServLostCnt,
    });
    yAxisAmt.push({
      name: "S/W Lost",
      data: ySwLost,
      description: ySwLostCnt,
    });

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
        text: "Progress of Service/Software",
        style: {
          fontSize: "15px", // Set font size to 16px
        },
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
          return (
            "<b>" +
            this.x +
            "</b><br/>" +
            this.series.name +
            ": " +
            this.y?.toLocaleString("en-US") +
            "<br/>"
          );
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

    settable(tableRenderer);
    setsummaryChart(summaryChart);
  }, [scoreCardData]);

  return (
    <div className="col-md-12  customCard card graph darkHeader">
      <div className="col-12 row">
        <div className="col-6 pr-0">
          <HighchartsReact highcharts={Highcharts} options={summaryChart} />
        </div>
        <div className="col-6 p-0 mt-5">
          <div style={{ maxWidth: "700px", overflowX: "auto" }}>
            <table className="table table-bordered progressOfswTable">
              <thead>{table}</thead>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
