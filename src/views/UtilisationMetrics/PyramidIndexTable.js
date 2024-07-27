import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../PrimeReactTableComponent/PrimeReactTable.scss";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import funnel from "highcharts/modules/funnel.js";
import { node } from "prop-types";
import "./PyramidIndexTable.scss";
funnel(Highcharts);

function PyramidIndexTable(props) {
  const { data, Header } = props;
  const [mainData, setMainData] = useState([]);
  const [headerData, setHeaderData] = useState(null);
  const [headerDat, setHeaderDat] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [filter, setFilter] = useState([]);

  const [chartOptions, setChartOptions] = useState([]);

  console.log("Header Data", Header);
  console.log("Table Data", data);

  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  useEffect(() => {
    if (mainData.length > 0) {
      const obj = {};

      for (let i = 0; i < Header.length; i++) {
        let mainDataKeys = JSON.parse(JSON.stringify(Object.keys(mainData[0])));

        let arr = ["cadre", "ideal"];

        if (arr.includes(Header[i]["id"]) == false) {
          setFilter(mainDataKeys);
          let filteredKeys = mainDataKeys.filter((d) =>
            d.includes(Header[i]["id"])
          );

          for (let j = 0; j < filteredKeys.length; j++) {
            obj[filteredKeys[j]] = j == 0 ? Header[i]["value"] : "";
          }
        } else {
          obj[Header[i]["id"]] = Header[i]["value"];
        }
      }

      let headerD = [];
      headerD.push(obj);

      const nObj = {};

      let beforeUnderScore = [];

      Object.keys(obj).forEach((d) => {
        let dd = d.includes("_") && d.split("_");
        dd[0] != undefined && beforeUnderScore.push(dd[0]);

        if (d.includes("pi")) {
          nObj[d] = "pi";
        } else if (d.includes("count")) {
          nObj[d] = "count";
        } else {
          nObj[d] = obj[d];
        }
      });

      let fBefore = [...new Set(beforeUnderScore)];

      let arr = Array.from(fBefore);

      const objct = {};

      objct["cadre"] = nObj["cadre"];
      objct["ideal"] = nObj["ideal"];

      for (let i = 0; i < arr.length; i++) {
        objct[arr[i] + "_pi"] = nObj[arr[i] + "_pi"];
        objct[arr[i] + "_count"] = nObj[arr[i] + "_count"];
      }

      setHeaderDat(objct);

      {
        /*----------------- Extracting Needed Header Data From the *Header* prop -----------------*/
      }

      setHeaderData(() => {
        return (
          <ColumnGroup>
            <Row>
              {Object.keys(objct).map((ele) => {
                if (obj[ele] !== "") {
                  const headerText = obj[ele];
                  const isCadreOrIdeal = ["Cadre", "Ideal"].includes(obj[ele]);
                  const colSpan = isCadreOrIdeal ? "" : 2;
                  const rowSpan = isCadreOrIdeal ? 2 : 1;

                  {
                    console.log(obj[ele]);
                  }
                  return (
                    <Column
                      header={() => <div title={headerText}>{headerText}</div>}
                      colSpan={colSpan}
                      rowSpan={rowSpan}
                    ></Column>
                  );
                }
              })}
            </Row>

            <Row>
              {Object.keys(objct).map(
                (ele) =>
                  ["Cadre", "Ideal"].includes(objct[ele]) == false && (
                    <Column
                      header={() => (
                        <div title={ele.includes("pi") ? "PI" : "Count"}>
                          {ele.includes("pi") ? "PI" : "Count"}
                        </div>
                      )}
                      style={{
                        minWidth: "87px",
                        maxWidth: "87px",
                        textAlign: "center",
                      }}
                    />
                  )
              )}
            </Row>
          </ColumnGroup>
        );
      });

      {
        /*-------------------- Adding Styles in Cells of Data Table --------------------*/
      }

      const updatedBodyData = mainData.map((data) => {
        const updatedData = {};
        for (const key in data) {
          if (key.includes("_pi")) {
            updatedData[key] = (
              <div
                style={{ textAlign: "right", color: "black" }}
                className="piPI"
              >
                <strong title={data[key].toFixed(1) + "%"}>
                  {data[key].toFixed(1)} %
                </strong>
              </div>
            );
          } else if (key.includes("ideal")) {
            updatedData[key] = (
              <div
                style={{ textAlign: "right", color: "black" }}
                title={data[key] + "%"}
                className="piIdeal"
              >
                {data[key]} %
              </div>
            );
          } else if (key.includes("_count")) {
            updatedData[key] = (
              <div
                style={{ textAlign: "right", color: "black" }}
                className="piCount"
                title={data[key] !== 0 ? data[key] : null}
              >
                {data[key]}
              </div>
            );
          } else if (
            key === "cadre" &&
            (data[key] === "Total" || data[key] === "Pyramid Alignment Index")
          ) {
            let displayData = data[key];
            if (data[key] === "Pyramid Alignment Index") {
              displayData = "Pyramid Alignment\nIndex";
            }
            updatedData[key] = (
              <div style={{ whiteSpace: "pre", textAlign: "right" }}>
                <strong title={data[key]}>{displayData}</strong>
              </div>
            );
          } else if (key === "cadre" && data[key] === "Total") {
            <div style={{ textAlign: "right" }}>
              <strong title={data[key]}>{displayData}</strong>
            </div>;
          } else if (
            key == "cadre" &&
            (data[key] == "T1" ||
              data[key] == "E1" ||
              data[key] == "E2" ||
              data[key] == "E3")
          ) {
            updatedData[key] = (
              <div title={data[key]} style={{ color: "black" }}>
                {data[key]}
              </div>
            );
          } else if (key == "cadre" && data[key] == "L") {
            updatedData[key] = (
              <div title={"L1, L2, L3"} style={{ color: "black" }}>
                {data[key]}
              </div>
            );
          } else if (key == "cadre" && data[key] == "M") {
            updatedData[key] = (
              <div title={"M1, M2, M3, A1, A2, A3"} style={{ color: "black" }}>
                {data[key]}
              </div>
            );
          } else if (key == "cadre" && data[key] == "G") {
            updatedData[key] = (
              <div
                title={"G1, G2, G3, EA1, EA2, EA3"}
                style={{ color: "black" }}
              >
                {data[key]}
              </div>
            );
          } else {
            updatedData[key] = data[key];
          }
        }
        return updatedData;
      });
      setBodyData(updatedBodyData);

      {
        /*-------------- Looping the Pyramids data to get the Pyramid Graphs--------------*/
      }
      const chartOption = [];

      for (let i = 0; i < Header.length; i++) {
        const options = getChartOptions(Header[i].value, Header[i].id, data);
        chartOption.push(options);
      }
      setChartOptions(chartOption);
    }
  }, [mainData]);

  {
    /*-------------- Adjusting colSpan,rowSpan and Headers of DataTable --------------*/
  }

  const dynamicColumns = Object.keys(headerDat).map((col, i) => {
    let columnHeader;
    if (col === "cadre") {
      columnHeader = <Column rowSpan={2} key={col} field={col} />;
    } else if (col === "ideal") {
      columnHeader = <Column rowSpan={2} key={col} field={col} />;
    } else if (col.includes("_pi") || col.includes("_count")) {
      columnHeader = <Column key={col} field={col} />;
    }
    return columnHeader;
  });

  ////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="primeReactTable darkHeader my-3">
      {headerData != null && bodyData.length > 0 ? (
        <DataTable
          headerColumnGroup={headerData}
          value={bodyData}
          showGridlines
          rows={15}
          rowHover={true}
          dataKey="id"
          responsiveLayout="scroll"
          emptyMessage="No Records found."
          className="primeReactTable pyramidTable"
        >
          {dynamicColumns}
        </DataTable>
      ) : (
        ""
      )}
      <div className="row">
        <div className="legendContainer mt-3">
          <strong>Legends :</strong>
          <div className="legend skyblue">
            <div className="legendCircle"></div>
            <div className="legendTxt">
              <strong>T1</strong>- Trainees,
            </div>
          </div>
          <div className="legend darkgray">
            <div className="legendCircle"></div>
            <div className="legendTxt">
              <strong>E1</strong>- Associate Engineers,
            </div>
          </div>
          <div className="legend lightgreen">
            <div className="legendCircle"></div>
            <div className="legendTxt">
              <strong>E2</strong>- Engineers,
            </div>
          </div>
          <div className="legend lightorange">
            <div className="legendCircle"></div>
            <div className="legendTxt">
              <strong>E3</strong>- Senior Engineers,
            </div>
          </div>
          <div className="legend purple">
            <div className="legendCircle"></div>
            <div className="legendTxt">
              <strong>L</strong>- Leads,
            </div>
          </div>
          <div className="legend crimson">
            <div className="legendCircle"></div>
            <div className="legendTxt">
              <strong>M</strong>- Managers,
            </div>
          </div>
          <div className="legend golden">
            <div className="legendCircle"></div>
            <div className="legendTxt">
              <strong>G</strong>- Delivery Managers
            </div>
          </div>
        </div>
      </div>

      <div className=" pyramids">
        {Header.map((header, index) => {
          const chartOption = chartOptions[index];
          if (header.id == "ideal") {
            return chartOption ? (
              <HighchartsReact
                key={header.id}
                highcharts={Highcharts}
                options={chartOption}
              />
            ) : null;
          }

          if (
            filter.includes(header.id + "_pi") &&
            header.id !== "cadre" &&
            header.id !== "ideal"
          ) {
            return chartOption ? (
              <HighchartsReact
                key={header.id}
                highcharts={Highcharts}
                options={chartOption}
              />
            ) : null;
          }

          return null;
        })}
      </div>
    </div>
  );
}

{
  /*---------------------------Function for Pyramid Graph------------------------- */
}

function getChartOptions(cadre, key, data) {
  const yValues = data
    .filter(
      (item) =>
        item.cadre !== "Total" && item.cadre !== "Pyramid Alignment Index"
    )
    .map((item) =>
      key == "ideal" ? parseFloat(item[key]) : parseFloat(item[key + "_pi"])
    );

  if (yValues.every((y) => y === 0)) {
    return "";
  }

  return {
    chart: {
      type: "pyramid",
    },
    title: {
      text: cadre,
      align: "center",
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Arial",
      },
      verticalAlign: "top",
      y: 10,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      pyramid: {
        reversed: true,
      },
      series: {
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}({point.y:,.1f})%</b>",
          softConnector: true,
        },
        center: ["35px", "50%"],
        width: "60px",
        margin: "0",
        showInLegend: true,
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
      verticalAlign: "bottom",
      align: "center",
    },
    series: [
      {
        data: data
          .filter(
            (item) =>
              item.cadre !== "Total" && item.cadre !== "Pyramid Alignment Index"
          )
          .map((item) => ({
            name: item.cadre,
            y:
              key == "ideal"
                ? parseFloat(item[key])
                : parseFloat(item[key + "_pi"]),
          }))
          .reverse(),
      },
    ],
  };
}

export default PyramidIndexTable;
