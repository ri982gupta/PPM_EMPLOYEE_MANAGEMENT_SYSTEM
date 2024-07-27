import React, { useState, useEffect, useMemo, useRef } from "react";
import MaterialReactTable from "material-react-table";
import { Button, IconButton } from "@mui/material";
import { AiFillRightCircle, AiOutlineInfoCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { environment } from "../../environments/environment";
import axios from "axios";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import moment from "moment";
import Loader from "../Loader/Loader";

import "./Tracker.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MdOutlineExpandMore } from "react-icons/md";
import { MdOutlineExpandLess } from "react-icons/md";
import { CModalHeader } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModal } from "@coreui/react";
import { MdCreate } from "react-icons/md";
import { CModalTitle } from "@coreui/react";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
export default function TrackerAllResCollapsibleTable(props) {
  const {
    data,
    expandedCols,
    colExpandState,
    day,
    openhtmlRes,
    setOpenhtmlRes,
    thresholdData,
    setShowAbbr,
    shoeAbbr,
    Abbrivations,
    depData,
    allResDate,
    endIndex,
    startIndex,
  } = props;
  const Columns = data.columns;
  const data1 = data.tableData;
  const columns = Columns.split(",").map((column) =>
    column.replace(/['"]/g, "").trim()
  );

  const [expandedColumns, setExpandedColumns] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
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
  const loggedUserId = localStorage.getItem("resId");
  const [AllresData, setAllresData] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [additionalDataColumns, setAdditionalDataColumns] = useState([]);

  const columnsSecondTable =
    additionalDataColumns && typeof additionalDataColumns === "string"
      ? additionalDataColumns
          .split(",")
          .map((column) => column.replace(/['"]/g, "").trim())
          .map((column) => ({
            name: column,
            num: parseInt(column.match(/\d+/), 10) || 0,
          }))
          .filter((column) => column.name !== "user_id") // Remove user_id column
          .sort((a, b) => {
            if (a.name === "Total") {
              return 1; // "Total" should come last
            } else if (b.name === "Total") {
              return -1; // "Total" should come last
            } else {
              return a.num - b.num;
            }
          })
          .map((column) => column.name)
      : [];

  useEffect(() => {}, [additionalData, additionalDataColumns]);
  const AllRespaginatedRows = data1.slice(startIndex, endIndex);
  const getAdditionalData = (user_id) => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setLoader(false);
    axios({
      method: "post",
      url: baseUrl + `/administrationms/tracker/GetPageResViewCount`,
      data: {
        resId: user_id,
        screenName: "[" + depData + "]",
        selectedDate: day.fromDate,
        UserId: loggedUserId,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const dataForUser = res.data.tableData;
        const dateForUserColumn = res.data.columns;

        dataForUser.forEach((rowData) => {
          for (const key in rowData) {
            if (rowData[key] === null) {
              rowData[key] = 0;
            }
          }
        });
        setAdditionalData(dataForUser);
        setAdditionalDataColumns(dateForUserColumn);
        setLoader(false);
        clearTimeout(loaderTime);
      })
      .then((error) => {});
  };
  const handleExpandRow = (column, row) => {
    if (expandedRows.includes(row.user_id)) {
      setExpandedRows((prevExpandedRows) =>
        prevExpandedRows.filter((id) => id !== row.user_id)
      );
    } else {
      setExpandedRows([row.user_id]);
    }
    getAdditionalData(row.user_id);
  };

  const [loader, setLoader] = useState(false);
  const handleLinkClick = (rowData, user_id, ScreenName, clickedDate) => {
    const ListScreenName = ScreenName.replace(/\([^)]*\)/, "").trim();
    setResourceName(moment(clickedDate).format("DD MMM YYYY"));
    var logStatement = ScreenName;
    var match = logStatement.match(/\(([^)]+)\)/);
    if (match) {
      var dataWithinParentheses = match[1];
      setClickscreenName(dataWithinParentheses);
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
        toDt: clickedDate,
        resId: user_id,
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
  const AllResPaginator = data1.slice(startIndex, endIndex);
  const AllResLinkPaginator = additionalData.slice(startIndex, endIndex);
  const columnsFirstTable =
    Columns && typeof Columns === "string"
      ? Columns.split(",")
          .map((column) => column.replace(/['"]/g, "").trim())
          .map((column) => ({
            name: column,
            num: parseInt(column.match(/\d+/), 10) || 0,
          }))
          .filter((column) => column.name !== "user_id") // Remove user_id column
          .sort((a, b) => {
            if (a.name === "Total") {
              return 1; // "Total" should come last
            } else if (b.name === "Total") {
              return -1; // "Total" should come last
            } else {
              return a.num - b.num;
            }
          })
          .map((column) => column.name)
      : [];

  const renderRows = (rows, additionalDataExp) => {
    const isRowExpanded = expandedRows.length > 0;
    const thresholdValue = parseInt(thresholdData.Threshold);
    return AllResPaginator.map((row, rowIndex) => {
      const additionalData = additionalDataExp || {};
      const rowValues = columnsFirstTable.map((header) => {
        const modifiedHeader = header.replace(/['"]/g, "").trim();
        return row[modifiedHeader];
      });
      return (
        <React.Fragment key={rowIndex}>
          <tr>
            {rowValues.map((value, columnIndex) => (
              <React.Fragment key={columnIndex}>
                {columnsFirstTable[columnIndex] === "Resource" && (
                  <td>
                    <div className="span-wrapper ellipsis">
                      <span
                        title={value}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleExpandRow(columnsFirstTable[columnIndex], row)
                        }
                      >
                        {expandedRows.includes(row.user_id) ? (
                          <MdOutlineExpandLess />
                        ) : (
                          <MdOutlineExpandMore />
                        )}
                        {value}
                      </span>
                    </div>
                  </td>
                )}
                {expandedColumns.includes("Resource") &&
                  (columnsFirstTable[columnIndex] === "Supervisor" ||
                    columnsFirstTable[columnIndex] === "BusinessUnit") && (
                    <td>
                      <div className="span-wrapper ellipsis">
                        <span
                          className="sup-busin-res supervisor-BUunit"
                          title={value}
                        >
                          {value}
                        </span>
                      </div>
                    </td>
                  )}

                {columnsFirstTable[columnIndex] !== "Supervisor" &&
                  columnsFirstTable[columnIndex] !== "BusinessUnit" &&
                  columnsFirstTable[columnIndex] !== "Resource" &&
                  columnsFirstTable[columnIndex] !== "Total'" && (
                    <td key={columnIndex}>
                      <span>
                        {isNaN(value) ||
                        columnsFirstTable[columnIndex].includes("Total") ? (
                          <span title={value.toLocaleString()}>
                            {value.toLocaleString()}
                          </span>
                        ) : (
                          <span title={value.toLocaleString()}>
                            {value.toLocaleString()}
                          </span>
                        )}
                      </span>
                    </td>
                  )}
              </React.Fragment>
            ))}
          </tr>
          {isRowExpanded && expandedRows.includes(row.user_id) && (
            <>
              {Array.isArray(additionalData) &&
                additionalData.map((rowData, index) => (
                  <tr key={index}>
                    {columnsSecondTable.map((header) => (
                      <td
                        key={header}
                        className={
                          header === "ScreenName"
                            ? "span-wrapper ellipsis expanded-row-cell"
                            : (header === "Supervisor" ||
                                header === "BusinessUnit") &&
                              !(
                                isRowExpanded &&
                                expandedColumns.includes("Resource") &&
                                expandedRows.includes(row.user_id)
                              )
                            ? "hidden-column"
                            : thresholdValue <= parseFloat(rowData[header])
                            ? "Trackerhighlight"
                            : ""
                        }
                      >
                        {isRowExpanded &&
                        expandedColumns.includes("Resource") &&
                        expandedRows.includes(row.user_id) &&
                        (header === "Supervisor" ||
                          header === "BusinessUnit") ? (
                          <div className="span-wrapper ellipsis">
                            <span
                              className="sup-busin-res supervisor-BUunit"
                              title={rowData[header]}
                            >
                              {rowData[header]}
                            </span>
                          </div>
                        ) : header !== "Supervisor" &&
                          header !== "BusinessUnit" &&
                          header !== "ScreenName" &&
                          header !== "Total" ? (
                          <a
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
                                rowData, // Pass the entire 'row' array
                                rowData.user_id,
                                rowData.ScreenName,
                                clickedDate
                              );
                            }}
                          >
                            <span
                              title={rowData[
                                header.replace(/['"]/g, "")
                              ]?.toLocaleString()}
                            >
                              {rowData[
                                header.replace(/['"]/g, "")
                              ]?.toLocaleString()}
                            </span>
                          </a>
                        ) : (
                          <span title={rowData[header]}>{rowData[header]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </>
          )}
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
      "Resource",
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
              {item.header === "Resource" && (
                <th>
                  <span
                    className="sup-busin-res"
                    onClick={() => handleExpandColumn(item.header)}
                  >
                    {item.header}
                    {expandedColumns.includes(item.header) ? (
                      <BiChevronLeft />
                    ) : (
                      <BiChevronRight />
                    )}
                  </span>
                </th>
              )}
              {expandedColumns.includes("Resource") &&
                item.header === "Supervisor" && (
                  <th>
                    <span className="sup-busin-res supervisor-BUunit">
                      Supervisor
                    </span>
                  </th>
                )}
              {expandedColumns.includes("Resource") &&
                item.header === "BusinessUnit" && (
                  <th>
                    <span className="sup-busin-res supervisor-BUunit">
                      BusinessUnit
                    </span>
                  </th>
                )}
              {item.header !== "Supervisor" &&
                item.header !== "BusinessUnit" &&
                item.header !== "Resource" && (
                  <th key={columnIndex}>
                    <span> {formatDay(item.header)}</span>
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
  const startTime = (rowData) => {
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
  const endTime = (rowData) => {
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
            {" "}
            {data1?.length == 0 ? (
              <tr>
                <td colSpan={33} className="text-center">
                  No Records To View
                </td>
              </tr>
            ) : (
              ""
            )}
            {renderRows(data1, additionalData)}
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
                  {resourceName} - {matchingEntry?.description}
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
                    body={startTime}
                  />
                  <Column
                    field="endTime"
                    alignHeader={"center"}
                    header="Last Hit"
                    body={endTime}
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
