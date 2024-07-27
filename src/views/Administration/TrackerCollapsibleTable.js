import React, { useState, useRef } from "react";
import { environment } from "../../environments/environment";
import axios from "axios";
import Loader from "../Loader/Loader";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import moment from "moment";
import "./Tracker.scss";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CModalHeader } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModal } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { MdOutlineExpandMore } from "react-icons/md";
import { MdOutlineExpandLess } from "react-icons/md";

function TrackerCollapsibleTable(props) {
  const {
    data,
    dt,
    openhtml,
    setOpenhtml,
    setShowAbbr,
    shoeAbbr,
    thresholdData,
    Abbrivations,
    paginatedRows,
  } = props;
  const Columns = data.columns;
  const data1 = data.tableData;
  const [expandedColumns, setExpandedColumns] = useState([]);
  const baseUrl = environment.baseUrl;
  const [tabledata, setTabledata] = useState([]);
  const [resourceName, setResourceName] = useState([]);
  const [clickscreenName, setClickscreenName] = useState([]);
  const handleExpandColumn = (column) => {
    setExpandedColumns((prevExpandedColumns) =>
      prevExpandedColumns.includes(column)
        ? prevExpandedColumns.filter((col) => col !== column)
        : [...prevExpandedColumns, column]
    );
  };

  const columns = Columns.split(",").map((column) => column.trim());
  const [loader, setLoader] = useState(false);
  const handleLinkClick = (
    columnName,
    rowIndex,
    clickedDigit,
    userId,
    Resource
  ) => {
    setResourceName(Resource);
    setClickscreenName(columnName);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setLoader(false);
    axios({
      method: "post",
      url: baseUrl + `/administrationms/tracker/getpagenamedata`,
      data: {
        page_name: columnName,
        toDt: dt.toDate,
        resId: userId,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const GetData = res.data;
        setTabledata(GetData);
        setLoader(false);
        clearTimeout(loaderTime);
        setOpenhtml(true);
      })
      .catch((error) => {});
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
          {" "}
          {moment(rowData.endTime, "HH:mm:ss").format("hh:mm:ss A")}
        </div>
      </>
    );
  };
  const renderRows = (rows) => {
    const thresholdValue = parseInt(thresholdData.Threshold);

    return paginatedRows.map((row, rowIndex) => {
      return (
        <React.Fragment key={rowIndex}>
          <tr>
            {columns.map((header, columnIndex) => {
              return (
                <React.Fragment key={columnIndex}>
                  {header === "Resource" && (
                    <td>
                      <span onClick={() => handleExpandColumn(header)}>
                        {expandedColumns.includes(header) ? (
                          <MdOutlineExpandLess />
                        ) : (
                          <MdOutlineExpandMore />
                        )}
                        <span title={row.Resource}>{row.Resource}</span>
                      </span>
                      <span className="sup-busin-res"></span>
                    </td>
                  )}
                  {expandedColumns.includes("Resource") &&
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
                  {expandedColumns.includes("Resource") &&
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
                    header !== "Resource" &&
                    header !== "Total" && (
                      <td key={columnIndex}>
                        <div className="span-wrapper ellipsis">
                          <span
                            title={row[
                              header.replace(/['"]/g, "")
                            ].toLocaleString()}
                          >
                            {isNaN(row[header.replace(/['"]/g, "")]) ||
                            header.includes("Total") ? (
                              row[header.replace(/['"]/g, "")].toLocaleString()
                            ) : (
                              <a
                                className={
                                  thresholdValue <=
                                  row[header.replace(/['"]/g, "")]
                                    ? "Trackerhighlight"
                                    : ""
                                }
                                onClick={() =>
                                  handleLinkClick(
                                    header.replace(/['"]/g, ""),
                                    rowIndex,
                                    row[header.replace(/['"]/g, "")],
                                    row.user_id,
                                    row.Resource
                                  )
                                }
                              >
                                <span
                                  title={row[
                                    header.replace(/['"]/g, "")
                                  ].toLocaleString()}
                                >
                                  {row[
                                    header.replace(/['"]/g, "")
                                  ].toLocaleString()}
                                </span>
                              </a>
                            )}
                          </span>
                        </div>
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

  const getHeaderRows = () => {
    const headerRows = columns.map((header) => header.replace(/['"]/g, ""));
    return (
      <React.Fragment>
        <tr>
          {headerRows.map((header, columnIndex) => (
            <React.Fragment key={columnIndex}>
              {header === "Resource" && (
                <th>
                  <span
                    className="sup-busin-res"
                    onClick={() => handleExpandColumn(header)}
                  >
                    <span title={header}>{header}</span>
                    {expandedColumns.includes(header) ? (
                      <BiChevronLeft />
                    ) : (
                      <BiChevronRight />
                    )}
                  </span>
                </th>
              )}
              {expandedColumns.includes("Resource") && header === "Supervisor" && (
                <th>
                  <span
                    title={"Supervisor"}
                    className="sup-busin-res supervisor-BUunit"
                  >
                    Supervisor
                  </span>
                </th>
              )}
              {expandedColumns.includes("Resource") &&
                header === "BusinessUnit" && (
                  <th>
                    <span
                      title={"Business Unit"}
                      className="sup-busin-res supervisor-BUunit"
                    >
                      Business Unit
                    </span>
                  </th>
                )}
              {header !== "Supervisor" &&
                header !== "BusinessUnit" &&
                header !== "Resource" && (
                  <th key={columnIndex}>
                    <span
                      title={
                        Abbrivations.find((item) => item.code === header)
                          ?.description || header
                      }
                    >
                      {header}
                    </span>
                  </th>
                )}
            </React.Fragment>
          ))}
        </tr>
      </React.Fragment>
    );
  };

  return (
    <>
      <div className="darkHeader team-tracker-collapsible-table team-tracker-all-reportee">
        <table>
          <thead>{getHeaderRows()}</thead>
          <tbody>
            {data1?.length == 0 ? (
              <tr>
                <td colSpan={20} className="text-center">
                  No Records To View
                </td>
              </tr>
            ) : (
              ""
            )}

            {renderRows(data1)}
          </tbody>
        </table>
        {loader ? <Loader handleAbort={handleAbort} /> : ""}
        {openhtml == true ? (
          <div className="col-14 " style={{ marginTop: "10px" }}>
            <CModal
              size="sl"
              backdrop={"static"}
              visible={openhtml}
              onClose={() => {
                setOpenhtml(false);
              }}
            >
              <CModalHeader className="hgt22">
                <CModalTitle>
                  <b style={{ fontSize: "13px", paddingLeft: "2px" }}>
                    {resourceName} - {matchingEntry.description}
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
      </div>
    </>
  );
}
export default TrackerCollapsibleTable;
