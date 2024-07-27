import React, { useEffect, useRef, useState } from "react";
import TargetCharts from "./TargetCharts";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);

function TopCustByRealRev(props) {
  const { topCustomerByRealRev, cusRecRev, scoreCardDataPayload } = props;
  const [chartDataProp, setChartDataProp] = useState({});
  const [displayTableData, setDisplayTableData] = useState(null);
  const top1 = useRef(0);
  const top2to5 = useRef(0);
  const top6to10 = useRef(0);
  const top11to20 = useRef(0);
  const rest = useRef(0);
  let angle = 180;

  useEffect(() => {
    handleChartData();
    handleTableData();
  }, []);

  const handleTableData = () => {
    let headerTitles =
      scoreCardDataPayload.viewby === "cust"
        ? ["Rank", "Project", "Realised", "Planned", "GM", "GM%"]
        : ["Rank", "Customer", "Realised", "Planned", "Upside", "Call"];
    let headerTitlesKeys = [];
    setDisplayTableData(() => {
      return topCustomerByRealRev.map((d, index) => {
        let headerData = [];
        headerTitles.forEach((element, index1) => {
          if (d.id == -1) {
            headerTitlesKeys.push(
              Object.keys(d).find((key) => d[key] === element)
            );

            headerData.push(
              <th
                style={{
                  textAlign: "center",
                  backgroundColor: "#f4f4f4",
                  position: "sticky",
                  top: 0,
                }}
              >
                {element}
              </th>
            );
          } else {
            console.log(
              headerTitlesKeys[index1] == "customer" &&
                headerTitles[index1] == "Project" &&
                d[headerTitlesKeys[index1]],
              element,
              "headerTitles[index1] "
            );

            headerData.push(
              <td
                style={{
                  textAlign:
                    (index1 > 1 && "right") ||
                    (headerTitles[index1] == "Rank" && "center"),
                }}
              >
                {headerTitles[index1] == "Rank"
                  ? index
                  : headerTitlesKeys[index1] == "customer" &&
                    element == "Project"
                  ? d[headerTitlesKeys[index1]]
                  : headerTitles[index1] != "Customer" &&
                    headerTitles[index1] == "Project"
                  ? `${index1 > 1 ? "$" : ""}` +
                    parseInt(d[headerTitlesKeys[index1]]).toLocaleString(
                      "en-US"
                    )
                  : `${
                      index1 > 1
                        ? "$" +
                          parseInt(d[headerTitlesKeys[index1]]).toLocaleString(
                            "en-Us"
                          )
                        : d[headerTitlesKeys[index1]]
                    }`}
              </td>
            );
          }
        });
        return index === 1 ? (
          <>
            <tr>
              <td
                style={{ textAlign: "center", backgroundColor: "#f4f4f4" }}
                colSpan={"6"}
              >
                {"Top 1 to 10"}
              </td>
            </tr>
            <tr style={{ backgroundColor: d.color }}>{headerData}</tr>
          </>
        ) : index === 11 ? (
          <>
            <tr>
              <td colSpan={"6"}></td>
            </tr>
            <tr>
              <td
                style={{ textAlign: "center", backgroundColor: "#f4f4f4" }}
                colSpan={"6"}
              >
                {"Top 11 to 20"}
              </td>
            </tr>
            <tr style={{ backgroundColor: d.color }}>{headerData}</tr>
          </>
        ) : (
          <tr style={{ backgroundColor: d.color }}>{headerData}</tr>
        );
      });
    });
  };

  const handleChartData = () => {
    cusRecRev?.map((d) => {
      switch (d.category) {
        case "Top 1":
          top1.current = parseInt(d.revenue);
          break;
        case "Top 2-5":
          top2to5.current = parseInt(d.revenue);
          break;
        case "Top 6-10":
          top6to10.current = parseInt(d.revenue);
          break;
        case "Top 11-20":
          top11to20.current = parseInt(d.revenue);
          break;
        case "Rest":
          rest.current = parseInt(d.revenue);
          break;
        default:
      }
    });

    const chartData = {
      credits: {
        enabled: false,
      },
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0,
        },
      },
      title: {
        text: "Top Customers By Realised Revenue",
        style: {
          fontSize: "15px", // Set font size to 16px
        },
      },
      tooltip: {
        formatter: function () {
          return `${this.point.name}<br /><li style="color: ${
            this.point.color
          }">&#9679;</li> Rec. Revenue: <b>$${Highcharts.numberFormat(
            this.point.y,
            0,
            ",",
            ","
          )}</b> (${Math.round(this.point.percentage * 10) / 10})%`;
        },
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      xAxis: {
        categories: ["Top 1", "Top 2-5", "Top 6-10", "Top 11-20", "Rest"],
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          shadow: true,
          startAngle: angle,
          cursor: "pointer",
          depth: 55,
          size: "100%",
          showInLegend: true,
          // dataLabels: {
          //     enabled: true,
          //     format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          // }
        },
      },
      series: [
        {
          // name: 'Rec. Revenue',
          colorByPoint: true,
          data: [
            {
              name: "Top 1",
              y: top1.current,
              /* sliced: true, */
              selected: true,
              dataLabels: {
                enabled: true,
                distance: 10,
                formatter: function () {
                  return `<b>${
                    this.point.name
                  }</b>:<br/>$${Highcharts.numberFormat(
                    this.point.y,
                    0,
                    ",",
                    ","
                  )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
                // format: '<b>{point.name}</b>: <br/>${point.y:,.0f} ({point.percentage:.1f})%'
              },
            },
            {
              name: "Top 2-5",
              y: top2to5.current,
              color: "#e4d354",
              dataLabels: {
                enabled: true,
                distance: 10,
                // format: '<b>{point.name}</b>: <br/>${point.y:,.0f} ({point.percentage:.1f})%'
                formatter: function () {
                  return `<b>${
                    this.point.name
                  }</b>:<br/>$${Highcharts.numberFormat(
                    this.point.y,
                    0,
                    ",",
                    ","
                  )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
            {
              name: "Top 6-10",
              y: top6to10.current,
              dataLabels: {
                enabled: true,
                distance: 10,
                // format: '<b>{point.name}</b>: <br/>${point.y:,.0f} ({point.percentage:.1f})%'
                formatter: function () {
                  return `<b>${
                    this.point.name
                  }</b>:<br/>$${Highcharts.numberFormat(
                    this.point.y,
                    0,
                    ",",
                    ","
                  )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
            {
              name: "Top 11-20",
              y: top11to20.current,
              dataLabels: {
                enabled: true,
                distance: 10,
                // format: '<b>{point.name}</b>: <br/>${point.y:,.0f} ({point.percentage:.1f})%'
                formatter: function () {
                  return `<b>${
                    this.point.name
                  }</b>:<br/>$${Highcharts.numberFormat(
                    this.point.y,
                    0,
                    ",",
                    ","
                  )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
            {
              name: "Rest",
              y: rest.current,
              dataLabels: {
                enabled: true,
                distance: 10,
                // format: '<b>{point.name}</b>: <br/>${point.y:,.0f} ({point.percentage:.1f})%'
                formatter: function () {
                  return `<b>${
                    this.point.name
                  }</b>:<br/>$${Highcharts.numberFormat(
                    this.point.y,
                    0,
                    ",",
                    ","
                  )} (${Math.round(this.point.percentage * 10) / 10})%`;
                },
              },
            },
          ],
        },
      ],
    };
    setChartDataProp(chartData);
  };

  return (
    <div className="col-12 mt-2 customCard card graph darkHeader">
      <div className="mr-0">
        <HighchartsReact highcharts={Highcharts} options={chartDataProp} />
      </div>
      {/* <div><TargetCharts chartData={chartDataProp} /></div> */}
      {displayTableData != null ? (
        <div style={{ maxHeight: "111px", overflowY: "auto" }}>
          <table className=" table table-bordered serviceTable1">
            <thead style={{ fontSize: "13px" }}>{displayTableData}</thead>
          </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default TopCustByRealRev;
