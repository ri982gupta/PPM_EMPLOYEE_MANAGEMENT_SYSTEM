import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ResourceOverviewGraphs from "./ResourceOverviewGraphs";
import { format, parseISO, parse } from "date-fns";
import { SlExclamation } from "react-icons/sl";
import { FaInfoCircle } from "react-icons/fa";
import ResourceOverviewPopover from "./ResourceOverviewPopover";
import "./ResourceOverviewTable.scss";

export default function ResourceOverviewDisplayTable(props) {
  const {
    tableData,
    column,
    onClickHandler,
    setId,
    setHeaderDate,
    setTotaldata,
    setEmpTable,
  } = props;
  console.log(props.id);
  var nf = new Intl.NumberFormat();
  const currentDate = new Date();
  const handleClose = () => {
    setAnchorEl(false);
  };

  const [infoMessage, setInfoMessage] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  console.log(anchorEl);
  if (!tableData || !tableData.data) {
    return <div></div>;
  }

  // Create a new array without the unwanted kpi_id values

  let allHeaders = [];
  console.log(allHeaders);

  let alldata = [];

  const filteredData = tableData.data?.reduce((acc, element) => {
    const { kpi_id, ...rest } = element;
    if (kpi_id !== -1 && kpi_id !== "#") {
      acc.push({ ...rest, kpi_id });
    } else {
      acc.push(element);
    }
    return acc;
  }, []);

  let headerDates = {};

  tableData.data?.forEach((data) => {
    if (data["kpi"].includes("Deployable Bench - Actual")) {
      Object.keys(data).forEach((key) => {
        if (key.includes("count")) {
          const dateKey = key.substring(0, 10);
          const date = parseISO(dateKey.replace(/_/g, "-"));
          const formattedDateKey = format(date, "dd-MMM-yyyy");
          headerDates[formattedDateKey] = data[key];
        }
      });
    }
  });

  const handleInfoClick = (kpi) => {
    console.log(kpi);
    const cleanedKpi = kpi.replace(/<\/?span.*?>/gi, "");
    console.log(cleanedKpi);
    let message = "";
    if (cleanedKpi.includes("Total Resources")) {
      message = "=Sum(Employee+Contractors)";
    } else if (cleanedKpi.includes("Total Overhead")) {
      message = "=Sum(Org Overhead+Delivery Overhead)";
    } else if (cleanedKpi.includes("Total Billable Resources ")) {
      message = "=Total resources-(Total Overhead+Gardening leave)";
    } else if (cleanedKpi.includes("Enablement")) {
      message =
        "*Head Count  is combination of Billable & Non Billable Resources";
    } else if (cleanedKpi.includes("Serving Notice Period")) {
      message =
        "=Billable+NBL on projects+Bench (Zero Allocation)+Gardening Leave+Org Overhead+Delivery Overhead";
    } else if (
      cleanedKpi.includes("Deployable Bench - Actual") ||
      cleanedKpi.includes("Deployable Bench (Resource Type)")
    ) {
      message =
        "= NBL on projects+Bench (Zero Allocation)+Innovation+Partial Bench";
    } else {
      message = "No information available for this KPI.";
    }
    setInfoMessage(message);
  };

  return (
    <div className="col-md-12 my-1 ">
      <div className="statusMsg warning">
        <span className="bold">
          <SlExclamation />
        </span>
        &nbsp; For past weeks there is no option to click.
      </div>
      <b style={{ color: "#297ab0", fontSize: "15px" }}> HC Overview </b>
      <div className="darkHeader">
        <div className="col-md-12 row " style={{ paddingLeft: "10px" }}>
          <table
            className="table table-bordered table-striped col-6 htmlTable resourceOverview "
            style={{ width: "51%" }}
          >
            <thead>
              {column?.length > 0 &&
                filteredData.map((acc, index) => {
                  let tabData = [];
                  column.forEach((inEle, columnIndex) => {
                    if (inEle === "kpi_id") {
                      return;
                    }
                    let temp = acc[inEle];
                    let data = null;
                    if (
                      temp != -1 &&
                      acc.kpi_id == -1 &&
                      temp?.includes("^&")
                    ) {
                      data = acc[inEle].split("^&");
                    } else if (temp == "#") {
                      acc[inEle] = "";
                    } else if (acc.kpi_id === 0 && temp === 0) {
                      acc[inEle] = "";
                    } else {
                      data = acc[index];
                    }
                    if (acc.kpi_id === -1) {
                      tabData.push(
                        data?.length > 0 ? (
                          <th
                            colspan={columnIndex === 1 ? 1 : 2}
                            rowspan={
                              temp === "Resource Category^&0^&2" ? "2" : ""
                            }
                            style={{
                              textAlign:
                                temp === "Resource Category^&0^&2"
                                  ? "center"
                                  : "left",
                              paddingLeft: columnIndex === 1 ? "14px" : "",
                            }}
                          >
                            {" "}
                            {data?.length > 0 ? data[0] : data}
                          </th>
                        ) : null
                      );
                      allHeaders.push(acc.kpi);
                    } else if (acc[inEle]) {
                      const { kpi_id, ...rest } = acc;

                      const backgroundColor =
                        index > 1 &&
                        columnIndex > 1 &&
                        (Math.floor(columnIndex / 2) % 2 === 0
                          ? columnIndex % 2 === 0
                            ? "#F3D6D6"
                            : "#F3D6D6"
                          : columnIndex % 2 === 0
                            ? "#BFF5F5"
                            : "#BFF5F5");

                      tabData.push(
                        <td
                          style={{
                            backgroundColor,
                            textAlign:
                              index > 1 && columnIndex > 1 ? "right" : "left",
                          }}
                          className={rest[inEle] === 0 ? "label"
                            : rest[inEle] === "FTE" ? "fteStyle"
                              : rest[inEle] === "Count" ? "countStyle"
                                : ""}
                        >
                          <span
                            // className={columnIndex > 1 && rest[inEle] != 0 ? "yourClassName" : ""}
                            style={
                              columnIndex > 1 &&
                                rest[inEle] != 0 &&
                                !rest[inEle].includes("FTE") &&
                                !rest[inEle].includes("Count")
                                ? {
                                  color: "#15a7ea",
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }
                                : {}
                            }
                            dangerouslySetInnerHTML={{
                              __html:
                                rest[inEle].includes("FTE") ||
                                  rest[inEle].includes("Count")
                                  ? `<b>${rest[inEle]}</b>`
                                  : nf.format(parseInt(rest[inEle])) == "NaN"
                                    ? rest[inEle]
                                    : nf.format(parseInt(rest[inEle])),
                            }}
                            onClick={(e) => {
                              if (columnIndex > 1 && rest[inEle] != 0) {
                                const inEleArray = inEle
                                  .replace("_fte", "")
                                  .replace("_count", "");
                                onClickHandler(
                                  acc.kpi_id,
                                  setId(acc.kpi_id),
                                  setEmpTable(false)
                                );

                                setHeaderDate(inEleArray);
                                setTotaldata(acc.kpi);
                              }
                            }}


                          ></span>

                          {(acc.kpi.includes("Total Resources") ||
                            acc.kpi.includes("Total Overhead") ||
                            acc.kpi.includes("Total Billable Resources") ||
                            acc.kpi.includes("Enablement") ||
                            acc.kpi.includes("Serving Notice Period") ||
                            acc.kpi.includes("Deployable Bench - Actual") ||
                            acc.kpi.includes(
                              "Deployable Bench (Resource Type)"
                            )) &&
                            columnIndex === 1 && (
                              <FaInfoCircle
                                className="tableInfoIcon"
                                onClick={(e) => {
                                  handleInfoClick(acc.kpi);
                                  // setTotaldata(acc.kpi);
                                  setAnchorEl(e.currentTarget);
                                }}

                              />
                            )}
                        </td>
                      );
                      alldata.push(acc[inEle]);
                    }
                  });

                  return <tr key={index}>{tabData}</tr>;
                })}
            </thead>
          </table>

          <div className="col-6" style={{ width: "49%" }}>
            <ResourceOverviewGraphs
              filteredData={filteredData}
              allHeaders={allHeaders}
              alldata={alldata}
            />
          </div>
        </div>
      </div>
      {anchorEl && (
        <ResourceOverviewPopover
          handleClose={handleClose}
          anchorEl={anchorEl}
          infoMessage={infoMessage}
        />
      )}
    </div>
  );
}
