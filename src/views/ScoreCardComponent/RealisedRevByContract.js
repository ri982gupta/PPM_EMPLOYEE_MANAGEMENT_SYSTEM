import ScoreCard from "./ScoreCard.json";
import TargetCharts from "./TargetCharts";
import React, { useEffect, useRef, useState, Fragment } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
highcharts3d(Highcharts);

export default function RealisedRevByContract(props) {
  console.log("props-------------");
  console.log(props);
  const { custContRecRev, custContRecRevTable } = props;
  // const {custContRecRevTable} = props.tableData
  const [chartDataProp, setChartDataProp] = useState({});
  const [expanded, setexpanded] = useState([]);

  const bms = useRef(0);
  const bne = useRef(0);
  const bsa = useRef(0);
  const btm = useRef(0);
  const fp = useRef(0);
  const nbe = useRef(0);
  let angle = 180;
  const onclickchanger = "category";
  const allExecutives = custContRecRevTable
    .filter((item) => item.lvl == 1)
    .map((item) => item[onclickchanger]);
  let toggler = 0;

  const clickExpand = (exec) => {
    if (exec == "Total") {
      setexpanded((prevState) => {
        return prevState.length == allExecutives.length ? [] : allExecutives;
      });
    } else {
      setexpanded((prevState) => {
        return prevState.includes(exec)
          ? prevState.filter((item) => item !== exec)
          : [...prevState, exec];
      });
    }
  };
  // console.log(custContRecRevTable)
  useEffect(() => {
    handleChartData();
    // console.log("relRevByCon")
    // console.log(relRevByCon)
  }, []);

  const handleDisplaySubData = (e, d) => {
    let clsNm = d.lvl + 1 + "_" + d.sales_executive;
    let elements = document.getElementsByClassName(clsNm);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains("displayRow")) {
        elements[i].classList.remove("displayRow");
      } else {
        elements[i].classList.add("displayRow");
      }
    }
  };

  const custContRecRevTableData = custContRecRevTable?.map((data) => {
    const conditions = ["catId", "id", "lvl"];
    let header = [];
    let checks = "category,project,revenue,planned,total";
    toggler =
      data["lvl"] == 2
        ? toggler
        : expanded.includes(data[onclickchanger])
        ? 1
        : 0;

    const custContRecRevArr = checks.split(",");
    for (let ia = 0; ia < custContRecRevArr.length; ia++) {
      let keys = custContRecRevArr[ia];
      // for (const keys in data) {
      data[keys] !== null &&
        !conditions.some((el) => keys.includes(el)) &&
        header.push(
          data.id < 0 ? (
            <th
              className={"pipeth"}
              style={{ textAlign: "center", position: "sticky", top: "0" }}
              key={keys}
              colSpan={data[keys].split("^&")[2]}
              rowSpan={data[keys].split("^&")[1]}
            >
              {data[keys].split("^&")[0]}
            </th>
          ) : keys != "category" && keys != "project" ? (
            <td
              className={data.lvl === "2" ? "clear " : " "}
              style={{ textAlign: "right" }}
              key={keys}
              colSpan={data[keys].split("^&")[2]}
              rowSpan={data[keys].split("^&")[1]}
            >
              <Fragment>
                {data.lvl === "1" &&
                (data.name === "Closed Amount" ||
                  data.name === "Unclosed Calls" ||
                  data.name === "Upside" ||
                  data.name === "Other Pipeline") ? (
                  <FiChevronRight onClick={expCollapse} />
                ) : (
                  ""
                )}
                {/* {data[keys].replaceAll("&" + "nbsp;", " ")}&nbsp; */}
              </Fragment>
              {"$" + parseInt(data[keys]).toLocaleString("en-US")}
            </td>
          ) : keys == "category" || keys == "project" ? (
            <td
              className={data.lvl == "2" ? " clear " : "ellipsis"}
              key={keys}
              colSpan={data[keys].split("^&")[2]}
              rowSpan={data[keys].split("^&")[1]}
              style={{
                display: toggler == 0 && data["lvl"] == 2 ? "none" : "",
              }}
            >
              <Fragment>
                {((keys == onclickchanger && data["lvl"] < 2) ||
                  (data["category"] == null && data["lvl"] < 2)) && (
                  <>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        clickExpand(data[onclickchanger]);
                        console.log("expanded");
                      }}
                    >
                      {expanded.includes(data[onclickchanger]) ||
                      expanded.length == allExecutives.length ? (
                        <FaAngleDown />
                      ) : (
                        <FaAngleRight />
                      )}
                    </span>
                  </>
                )}
                {data["category"] == null
                  ? "null"
                  : data[keys].replaceAll("&" + "nbsp;", " ")}
                &nbsp;
              </Fragment>
            </td>
          ) : (
            ""
          )
        );
    }
    return (
      <tr
        key={data.id}
        id={data.id}
        lvl={data.lvl}
        style={{ display: data["lvl"] == 2 && toggler == 0 ? "none" : "" }}
        onClick={(e) => {
          handleDisplaySubData(e, data);
        }}
      >
        {header}
      </tr>
    );
  });

  const handleChartData = () => {
    custContRecRev?.map((d) => {
      //Graph Data
      // if (d.id > 0) {
      switch (d.contterm) {
        case "BMS":
          bms.current = parseInt(d.total);
          break;
        case "BNE":
          bne.current = parseInt(d.total);
          break;
        case "BSA":
          bsa.current = parseInt(d.total);
          break;
        case "BTM":
          btm.current = parseInt(d.total);
          break;
        case "FP":
          fp.current = parseInt(d.total);
          break;
        case "NB-E":
          nbe.current = parseInt(d.total);
        default:
      }
      // }
    });

    const chartData = {
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
        text: "Realised Revenue By Contract Terms",
        style: {
          fontSize: "15px", // Set font size to 16px
        },
      },
      tooltip: {
        formatter: function () {
          // console.log(this.point, this.point.name, this.point.project, "this.point")
          // return `<b>${this.point.name}</b>: <br /> ${this.point.value} ({this.point.percentage:.1f}%)`
          return `${this.point.name}<br /><li style="color: ${
            this.point.color
          }">&#9679;</li> Rec. Revenue: <b>$${Highcharts.numberFormat(
            this.point.y,
            0,
            ",",
            ","
          )}</b> (${Math.round(this.point.percentage * 10) / 10})%`;
        },
        // pointFormat: "{point.description}: $ {point.value} (<b>{point.percentage:.1f}%)</b>",
      },
      xAxis: {
        categories: ["BMS", "BNE", "BSA", "BTM", "FP", "NB-E"],
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

          dataLabels: {
            enabled: true,
            // format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            formatter: function () {
              return `<b>${point.name}</b>:<br/>$${Highcharts.numberFormat(
                this.point.y,
                0,
                ",",
                ","
              )} (${Math.round(this.point.percentage * 10) / 10})%`;
            },
          },
        },
      },
      series: [
        {
          // name: 'Rec. Revenue',
          data: custContRecRev.map((item) => ({
            name: item.category,
            y: parseInt(item.revenue),
            color: item.color,
            customer: item.customer,
          })),
          colorByPoint: true,
          data: [
            {
              name: "BMS",
              y: bms.current,
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
              name: "BNE",
              y: bne.current,
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
              name: "BSA",
              y: bsa.current,
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
              name: "BTM",
              y: btm.current,
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
              name: "FP",
              y: fp.current,
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
              name: "NB-E",
              y: nbe.current,
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
          ],
        },
      ],
    };
    console.log("line 146");
    console.log(bms.current);
    console.log(bne.current);
    setChartDataProp(chartData);
  };

  return (
    <div className="mt-2 col-md-12 no-padding darkHeader customCard card graph">
      <div className="col-12 row">
        <div className="mt-2 col-md-6 ">
          <HighchartsReact highcharts={Highcharts} options={chartDataProp} />

          {/* <TargetCharts chartData={chartDataProp} /> */}
        </div>
        <div
          className="mt-2 col-md-6"
          style={{ maxHeight: "384px", overflow: "auto" }}
        >
          <table className="table table-bordered serviceTable ">
            <thead style={{ fontSize: "13px" }}>
              {custContRecRevTableData}
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
}
