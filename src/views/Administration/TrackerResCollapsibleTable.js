import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { environment } from "../../environments/environment";
import axios from "axios";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import moment from "moment";
import Loader from "../Loader/Loader";
import "./Tracker.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CModalHeader } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModal } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
export default function TrackerResCollapsibleTable(props) {
  const {
    data,
    day,
    openhtmlRes,
    setOpenhtmlRes,
    thresholdData,
    setShowAbbr,
    shoeAbbr,
    Abbrivations,
    paginatedRows,
  } = props;
  const Columns = data.columns;
  const data1 = data.tableData;
  const columns = Columns.split(",").map((column) =>
    column.replace(/['"]/g, "").trim()
  );
  const [expandedColumns, setExpandedColumns] = useState([]);
  const baseUrl = environment.baseUrl;
  const [tabledata, setTabledata] = useState([{}]);
  const [resourceName, setResourceName] = useState([]);
  const [clickscreenName, setClickscreenName] = useState([]);
  const handleExpandColumn = (column) => {
    setExpandedColumns((prevExpandedColumns) =>
      prevExpandedColumns.includes(column)
        ? prevExpandedColumns.filter((col) => col !== column)
        : [...prevExpandedColumns, column]
    );
  };
  const [loader, setLoader] = useState(false);
  const handleLinkClick = (
    header,
    row,
    userId,
    ScreenName,
    clickedDate,
    clickDateForm
  ) => {
    const ListScreenName = ScreenName.replace(/\s*\([^)]*\)\s*/, "");
    setResourceName(moment(clickDateForm).format("DD MMM YYYY"));
    var logStatement = ScreenName;
    if (typeof logStatement === "string") {
      var match = logStatement.match(/\(([^)]+)\)/);
      if (match) {
        var dataWithinParentheses = match[1];
        setClickscreenName(dataWithinParentheses);
      } else {
      }
    } else {
    }

    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setLoader(false);
    axios({
      method: "post",
      url: baseUrl + `/administrationms/tracker/getpagenamedata`,
      data: {
        page_name: ListScreenName,
        toDt: clickDateForm,
        resId: userId,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const GetData = res.data;
        setTabledata(GetData);
        setLoader(false);
        clearTimeout(loaderTime);
        setOpenhtmlRes(true);
      })
      .catch((error) => {});
  };
  const renderRows = (rows) => {
    return paginatedRows.map((row, rowIndex) => {
      const thresholdValue = parseInt(thresholdData.Threshold);
      const sortedColumns = columns.slice().sort((a, b) => {
        const numA = (a.match(/\d+/) || [])[0]; // Added null check
        const numB = (b.match(/\d+/) || [])[0]; // Added null check
        return parseInt(numA) - parseInt(numB);
      });
      const orderedColumns = [...sortedColumns];
      return (
        <React.Fragment key={rowIndex}>
          <tr>
            {orderedColumns.map((header, columnIndex) => {
              return (
                <React.Fragment key={columnIndex}>
                  {header == "ScreenName" && (
                    <td>
                      <div className="span-wrapper ellipsis">
                        <span title={row.ScreenName}>{row.ScreenName}</span>
                      </div>
                    </td>
                  )}
                  {expandedColumns.includes("ScreenName") &&
                    header === "Supervisor" && (
                      <td>
                        <div className="span-wrapper ellipsis">
                          <span
                            className="sup-busin-res supervisor-BUunit"
                            title={row.Supervisor}
                          >
                            {row.Supervisor}
                          </span>
                        </div>
                      </td>
                    )}
                  {expandedColumns.includes("ScreenName") &&
                    header === "BusinessUnit" && (
                      <td>
                        <div className="span-wrapper ellipsis">
                          <span
                            className="sup-busin-res supervisor-BUunit"
                            title={row.BusinessUnit}
                          >
                            {row.BusinessUnit}
                          </span>
                        </div>
                      </td>
                    )}
                  {header !== "Supervisor" &&
                    header !== "BusinessUnit" &&
                    header !== "ScreenName" &&
                    header !== "Total'" && (
                      <td key={columnIndex}>
                        <span>
                          {isNaN(row[header.replace(/['"]/g, "")]) ||
                          header.includes("Total") ? (
                            <span
                              title={row[
                                header.replace(/['"]/g, "")
                              ]?.toLocaleString()}
                            >
                              {row[
                                header.replace(/['"]/g, "")
                              ]?.toLocaleString()}
                            </span>
                          ) : (
                            <a
                              className={
                                thresholdValue <=
                                row[header.replace(/['"]/g, "")]
                                  ? "Trackerhighlight"
                                  : ""
                              }
                              onClick={() => {
                                const weeks = parseInt(
                                  header.replace(/['"]/g, "")
                                );
                                const startDate = new Date(day?.toDate);
                                startDate.setDate(
                                  startDate.getDate() + weeks - 1
                                );
                                const clickedDate = startDate
                                  .toISOString()
                                  .split("T")[0];
                                handleLinkClick(
                                  header.replace(/['"]/g, ""),
                                  row[header.replace(/['"]/g, "")],
                                  row.user_id,
                                  row.ScreenName,
                                  row,
                                  clickedDate
                                );
                              }}
                            >
                              <span
                                title={row[
                                  header.replace(/['"]/g, "")
                                ]?.toLocaleString()}
                              >
                                {row[
                                  header.replace(/['"]/g, "")
                                ]?.toLocaleString()}
                              </span>
                            </a>
                          )}
                        </span>
                      </td>
                    )}
                </React.Fragment>
              );
            })}
          </tr>
        </React.Fragment>
      );
    });
  };
  function formatDay(day) {
    if (day === "Total") {
      return <span>{day}</span>;
    } else if (day >= 11 && day <= 13) {
      return (
        <span>
          {day}
          <sup>th</sup>
        </span>
      );
    } else {
      const lastDigit = day % 10;
      const suffix =
        lastDigit === 1 ? (
          <sup>st</sup>
        ) : lastDigit === 2 ? (
          <sup>nd</sup>
        ) : lastDigit === 3 ? (
          <sup>rd</sup>
        ) : (
          <sup>th</sup>
        );
      return (
        <span>
          {day}
          {suffix}
        </span>
      );
    }
  }
  const getHeaderRows = () => {
    const headerRows = columns.map((header) => ({
      header: header.replace(/['"]/g, "").replace(/_(F|S|M|T|W|T)$/, ""),
      num: parseInt(header.match(/\d+/), 10) || 0,
    }));
    const unsortableHeaders = [
      "ScreenName",
      "Supervisor",
      "BusinessUnit",
      "Total",
    ];
    const sortableHeaders = headerRows.filter(
      (item) => !unsortableHeaders.includes(item.header)
    );
    sortableHeaders.sort((a, b) => a.num - b.num);
    const sortedHeaderRows = headerRows.map((item) =>
      unsortableHeaders.includes(item.header) ? item : sortableHeaders.shift()
    );
    return (
      <React.Fragment>
        <tr>
          {sortedHeaderRows.map((item, columnIndex) => (
            <React.Fragment key={columnIndex}>
              {item.header === "ScreenName" && (
                <th>
                  <span
                    className="sup-busin-res"
                    onClick={() => handleExpandColumn(item.header)}
                  >
                    <span title={item.header}> {item.header}</span>
                    {expandedColumns.includes(item.header) ? (
                      <BiChevronLeft />
                    ) : (
                      <BiChevronRight />
                    )}
                  </span>
                </th>
              )}
              {expandedColumns.includes("ScreenName") &&
                item.header === "Supervisor" && (
                  <th>
                    <span
                      title={"Supervisor"}
                      className="sup-busin-res supervisor-BUunit"
                    >
                      Supervisor
                    </span>
                  </th>
                )}
              {expandedColumns.includes("ScreenName") &&
                item.header === "BusinessUnit" && (
                  <th>
                    <span
                      title={"Business Unit"}
                      className="sup-busin-res supervisor-BUunit"
                    >
                      Business Unit
                    </span>
                  </th>
                )}
              {item.header !== "Supervisor" &&
                item.header !== "BusinessUnit" &&
                item.header !== "ScreenName" && (
                  <th key={columnIndex}>
                    <span>{formatDay(item.header)}</span>
                  </th>
                )}
            </React.Fragment>
          ))}
        </tr>
      </React.Fragment>
    );
  };
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const [globalFilter, setGlobalFilter] = useState("");
  const filteredData = Abbrivations
    ? Abbrivations.filter((item) => {
        const codeLowerCase = item.code ? item.code.toLowerCase() : "";
        const descriptionLowerCase = item.description
          ? item.description.toLowerCase()
          : "";
        return (
          codeLowerCase.includes(globalFilter) ||
          descriptionLowerCase.includes(globalFilter)
        );
      })
    : [];
  const onGlobalFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setGlobalFilter(value);
  };
  const matchingEntry = Abbrivations.find(
    (entry) => entry.code === clickscreenName
  );
  const screenCode = (rowData) => {
    return (
      <>
        <div style={{ width: "300px" }} title={rowData.code}>
          {rowData.code}
        </div>
      </>
    );
  };
  const screenName = (rowData) => {
    return (
      <>
        <div style={{ width: "500px" }} title={rowData.description}>
          {rowData.description}
        </div>
      </>
    );
  };
  const ResstartTime = (rowData) => {
    return (
      <>
        <div
          className="text-center"
          title={moment(rowData.startTime, "HH:mm:ss").format("hh:mm:ss A")}
        >
          {moment(rowData.startTime, "HH:mm:ss").format("hh:mm:ss A")}
        </div>
      </>
    );
  };
  const ResendTime = (rowData) => {
    return (
      <>
        <div
          className="text-center"
          title={moment(rowData.endTime, "HH:mm:ss").format("hh:mm:ss A")}
        >
          {moment(rowData.endTime, "HH:mm:ss").format("hh:mm:ss A")}
        </div>
      </>
    );
  };
  return (
    <>
      <div className="darkHeader team-tracker-collapsible-table team-tracker-resource-search">
        <table>
          <thead>{getHeaderRows()}</thead>
          <tbody>
            {data1?.length == 0 ? (
              <tr>
                <td colSpan={33} className="text-center">
                  No Records To View
                </td>
              </tr>
            ) : (
              ""
            )}
            {renderRows(data1)}
          </tbody>
        </table>
      </div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {openhtmlRes == true ? (
        <div className="col-14 " style={{ marginTop: "10px" }}>
          <CModal
            size="sl"
            backdrop={"static"}
            visible={openhtmlRes}
            onClose={() => {
              setOpenhtmlRes(false);
            }}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <b style={{ fontSize: "13px", paddingLeft: "2px" }}>
                  {resourceName}-{matchingEntry.description}
                </b>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div
                style={{
                  padding: "10px",
                  justifyContent: "space-between",
                }}
                className="container darkHeader"
              >
                <DataTable
                  className="primeReactDataTable eventsTable "
                  value={tabledata}
                  editMode="row"
                  showGridlines
                  emptyMessage="No Data Found"
                  scrollDirection="both"
                  rows={10}
                  rowHover
                >
                  <Column
                    field="startTime"
                    alignHeader={"center"}
                    header="First Hit"
                    body={ResstartTime}
                  />
                  <Column
                    field="endTime"
                    alignHeader={"center"}
                    header="Last Hit"
                    body={ResendTime}
                  />
                </DataTable>
              </div>
            </CModalBody>
          </CModal>
        </div>
      ) : (
        ""
      )}
      {shoeAbbr == true ? (
        <>
          <CModal
            size="sl"
            backdrop={"static"}
            visible={shoeAbbr}
            onClose={() => {
              setShowAbbr(false);
            }}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Screen Name Abbreviations</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div style={{ width: "150px", marginLeft: "10px" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={globalFilter}
                  onChange={onGlobalFilter}
                  style={{ fontWeight: "bold" }}
                />
              </div>
              <div
                style={{
                  padding: "10px",
                  justifyContent: "space-between",
                }}
                className="container darkHeader"
              >
                <DataTable
                  className="primeReactDataTable eventsTable "
                  value={filteredData}
                  editMode="row"
                  showGridlines
                  emptyMessage="No Data Found"
                  scrollDirection="both"
                  paginator
                  rows={10}
                  rowHover
                  paginationPerPage={5}
                  rowsPerPageOptions={[10, 25, 50]}
                  paginationRowsPerPageOptions={[5, 15, 25, 50]}
                  paginationComponentOptions={{
                    rowsPerPageText: "Records per page:",
                    rangeSeparatorText: "out of",
                  }}
                  paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                  currentPageReportTemplate="View {first} - {last} of {totalRecords} "
                >
                  <Column
                    field="code"
                    alignHeader={"center"}
                    header="Screen Code"
                    body={screenCode}
                  />
                  <Column
                    field="description"
                    alignHeader={"center"}
                    header="Screen Name"
                    body={screenName}
                  />
                </DataTable>
              </div>
            </CModalBody>
          </CModal>
        </>
      ) : (
        ""
      )}
    </>
  );
}
