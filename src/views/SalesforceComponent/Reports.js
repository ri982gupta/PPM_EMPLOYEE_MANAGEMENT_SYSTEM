import ReactDOMServer from "react-dom/server";
import { renderToString } from "react-dom/server";
import ReactDOM from "react-dom";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@material-ui/core";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FaFileExcel,
  FaSearch,
  FaChevronCircleUp,
  FaChevronCircleDown,
} from "react-icons/fa";
import Loader from "../Loader/Loader";
import { CCollapse } from "@coreui/react";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";

function ReportTable() {
  const [data, setData] = useState([]);
  const [reportName, setReportName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [reportData, setReportData] = useState({ columns: [], rows: [] });
  const [viewReportId, setViewReportId] = useState(null);
  const [viewMain, setViewMain] = useState(true);

  const [loader, setLoader] = useState(false);
  const [searching, setSearching] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editmsg, setEditAddmsg] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [loaderState, setLoaderState] = useState(false);

  const getReports = (reportID) => {
    console.log(reportID);
    setViewReportId(reportID);
    setIsLoading(true);
    setViewMain(false);

    if (reportID !== undefined && reportID !== null) {
      axios
        .get(
          "https://d300000000qxieam--gpp.sandbox.my.salesforce.com/services/data/v42.0/analytics/reports/" +
            reportID,
          { headers: { Authorization: token } }
        )
        .then((response) => {
          console.log("response data:", response.data);
          const reportMetadata = response.data.reportMetadata;
          const reportName = response.data.attributes.reportName;
          console.log(reportName);
          const headers =
            response?.data?.reportExtendedMetadata?.detailColumnInfo;
          const columnMetadata = Object.values(headers).map(
            (column) => column.label
          );
          const reportFilters = reportMetadata.reportFilters;
          console.log(reportFilters);
          const factMap = response.data.factMap["T!T"];
          const newReportData = {
            columns: columnMetadata,
            rows: factMap.rows,
            filters: reportFilters,
          };
          setReportData(newReportData);
          setIsLoading(false);

          //window.scrollTo(0, document.body.scrollHeight);

          const newWindow = window.open("", "_blank");
          newWindow.document.title = "Report Overview"; // Set the title of the new tab
          const tableContent = renderTable(newReportData); // Pass the newReportData to renderTable
          if (tableContent) {
            ReactDOM.render(tableContent, newWindow.document.body);
          }
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  };

  const renderTable = (reportData) => {
    if (viewReportId !== null) {
      if (
        !reportData ||
        !reportData.columns ||
        !reportData.rows ||
        !reportData.filters
      ) {
        return null;
      }

      return (
        <>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "#2e88c5", fontSize: "16px", margin: "0" }}>
              Report Filters
            </h1>
          </div>
          {reportData.filters.length > 0 ? (
            <>
              <br></br>
              <div
                style={{
                  maxHeight: "200px",
                  overflow: "auto",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                }}
              >
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead
                    style={{
                      textAlign: "center",
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#eeeeee",
                    }}
                  >
                    <tr>
                      <th
                        className="text-center"
                        style={{
                          fontSize: "12px",
                          padding: "8px 16px",
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                          borderLeft: "1px solid #ccc",
                          borderTop: "1px solid #ccc",
                        }}
                      >
                        Column
                      </th>
                      <th
                        className="text-center"
                        style={{
                          fontSize: "12px",
                          padding: "8px 16px",
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                          borderTop: "1px solid #ccc",
                        }}
                      >
                        Operator
                      </th>
                      <th
                        className="text-center"
                        style={{
                          fontSize: "12px",
                          padding: "8px 16px",
                          borderBottom: "1px solid #ccc",
                          borderTop: "1px solid #ccc",
                        }}
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody class="context-menu">
                    {reportData.filters.map((filter, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            fontSize: "12px",
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          {filter.column}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            fontSize: "12px",
                            padding: "8px",
                          }}
                        >
                          {filter?.operator}
                        </td>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            fontSize: "12px",
                            padding: "8px",
                          }}
                        >
                          {filter?.value.replace(",", "")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p>No filters applied</p>
            </div>
          )}
          <br />
          <div
            className="col-12 text-center"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2
              style={{ color: "#2e88c5", fontSize: "16px", margin: "0 auto" }}
            >
              Report Overview
            </h2>
            <FaFileExcel
              style={{ color: "#3498db" }}
              title="Export to Excel"
              onClick={() => exportExcel()}
              size={22}
            />
          </div>
          <br></br>

          <div style={{ maxHeight: "500px", overflow: "auto" }}>
            {reportData.columns && reportData.columns.length > 0 && (
              <table
                id="report-table"
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                }}
              >
                <colgroup>
                  {reportData.columns.map((_, index) => (
                    <col
                      key={index}
                      style={{
                        width: `${100 / reportData.columns.length}%`,
                      }}
                    />
                  ))}
                </colgroup>
                <thead
                  style={{
                    textAlign: "center",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "#eeeeee",
                  }}
                >
                  <tr>
                    {reportData.columns.map((column, index) => (
                      <th
                        className="text-center"
                        key={index}
                        style={{
                          fontSize: "12px",
                          padding: "8px 16px",
                          borderBottom: "1px solid #ccc",
                          borderRight: "1px solid #ccc",
                          borderLeft: "1px solid #ccc",
                          borderTop: "1px solid #ccc",
                        }}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody class="context-menu">
                  {reportData.rows && reportData.rows.length > 0 ? (
                    reportData.rows.map((row, index) => (
                      <tr key={index}>
                        {row.dataCells.map((dataCell, index) => (
                          <td
                            className="text-center"
                            key={index}
                            style={{
                              fontSize: "12px",
                              border: "1px solid #ccc",
                              padding: 8,
                            }}
                          >
                            {dataCell.label}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="text-center"
                        colSpan={reportData.columns.length}
                        style={{
                          textAlign: "center",
                          padding: 8,
                        }}
                      >
                        <p style={{ margin: 0 }}>No data found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <div style={{ height: "70px" }}></div>
        </>
      );
    }
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        module.default.saveAs(data, fileName + EXCEL_EXTENSION);
      }
    });
  };

  const exportExcel = (reportName) => {
    import("xlsx").then((xlsx) => {
      const table = document.getElementById("report-table");
      const tableData = [];
      for (let i = 0; i < table.rows.length; i++) {
        const rowData = [];
        for (let j = 0; j < table.rows[i].cells.length; j++) {
          const cellValue = table.rows[i].cells[j].textContent; // Use textContent instead of innerText
          rowData.push(cellValue);
        }
        tableData.push(rowData);
      }
      const worksheet = xlsx.utils.aoa_to_sheet(tableData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Report");
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      console.log(reportName)
      const fileName = `${reportName}.xlsx`;

      const excelData = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(excelData, fileName);
    });
  };

  const firstRender = (e) => {
    setLoader(true);
    setViewMain(false);

    const body = {
      grant_type: "password",
      client_id:
        "3MVG9qhihEtB2oji0xzq54v_fwp4ru5OYRmdtsp.TLhyaIwsZPmeRYgCw1TToYie3eF4to96rvuUUEqCd6VaT",
      client_secret:
        "B98616F846811E4FBE7EB4DBBA0404183171FDD3B873AF3746E5C884C57A38AE",
      username: "lakshmi.mula@prolifics.com.gpp",
      password: "lakshmi@1004q3HVu0qrlZLm72ygfOIqtn21q",
    };
    axios
      .post(
        "https://d300000000qxieam--gpp.sandbox.my.salesforce.com/services/oauth2/token",
        body,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(function (response) {
        const accToken = "Bearer " + response.data.access_token;
        setToken(accToken);

        const query =
          "SELECT Id, Name, Description, FolderName, CreatedBy.Name, CreatedDate FROM Report WHERE Name LIKE 'PPM%'";
        const encodedQuery = encodeURIComponent(query);

        axios
          .get(
            `https://d300000000qxieam--gpp.sandbox.my.salesforce.com/services/data/v42.0/query?q=${encodedQuery}`,
            { headers: { Authorization: accToken } }
          )
          .then(function (response1) {
            console.log(response1.data);
            setData(response1.data.records);
            setIsLoading(false); // Hide loading screen after data is fetched
          })
          .catch(function (error) {
            console.error(error);
            setIsLoading(false); // Hide loading screen on error
          });
      })
      .catch(function (error) {
        console.error(error);
        setIsLoading(false); // Hide loading screen on error
      });
  };

  useEffect(() => {
    firstRender();
  }, []);

  const handleSearch = (e) => {
    setLoader(true);
    setSearching(false);
    //e.preventDefault();
    setViewMain(true);
    setViewReportId(null);

    const body = {
      grant_type: "password",
      client_id:
        "3MVG9qhihEtB2oji0xzq54v_fwp4ru5OYRmdtsp.TLhyaIwsZPmeRYgCw1TToYie3eF4to96rvuUUEqCd6VaT",
      client_secret:
        "B98616F846811E4FBE7EB4DBBA0404183171FDD3B873AF3746E5C884C57A38AE",
      username: "lakshmi.mula@prolifics.com.gpp",
      password: "lakshmi@1004q3HVu0qrlZLm72ygfOIqtn21q",
    };
    axios
      .post(
        "https://d300000000qxieam--gpp.sandbox.my.salesforce.com/services/oauth2/token",
        body,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then(function (response) {
        const accToken = "Bearer " + response.data.access_token;
        setToken(accToken);
        const encodedReportName = reportName
          .replace(/'\s*/g, "''")
          .replace(/\\\s*/g, "\\\\");
        const encodedCreatedBy = createdBy
          .replace(/'\s*/g, "''")
          .replace(/\\\s*/g, "\\\\");

        let query =
          "SELECT Id, Name, Description, FolderName, CreatedBy.Name, CreatedDate FROM Report WHERE";

        if (encodedReportName && encodedCreatedBy) {
          query += ` Name LIKE '${encodedReportName}' AND CreatedBy.Name LIKE '${encodedCreatedBy}' LIMIT 100`;
        } else if (encodedReportName) {
          query += ` Name LIKE '${encodedReportName}' LIMIT 100`;
        } else if (encodedCreatedBy) {
          query += ` CreatedBy.Name LIKE '${encodedCreatedBy}' LIMIT 100`;
        } else {
          // If no filters are provided, return all records
          query =
            "SELECT Id, Name, Description, FolderName, CreatedBy.Name, CreatedDate FROM Report WHERE Name LIKE 'PPM%'";
        }

        axios
          .get(
            `https://d300000000qxieam--gpp.sandbox.my.salesforce.com/services/data/v42.0/query?q=${encodeURIComponent(
              query
            )}`,
            { headers: { Authorization: accToken } }
          )
          .then(function (response1) {
            console.log(response1.data);
            setData(response1.data.records);
            setIsLoading(false); // Hide loading screen after data is fetched
          })
          .catch(function (error) {
            console.error(error);
            setIsLoading(false); // Hide loading screen on error
          });
        setLoader(false);
        setSearching(true);
      })
      .catch(function (error) {
        console.error(error);
        setIsLoading(false); // Hide loading screen on error
      });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Salesforce Reports</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {loaderState ? <Loader handleAbort={handleAbort} /> : ""}
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader">
          <h2>Search Filters</h2>
          <div className="helpBtn">
            <GlobalHelp />
          </div>
          &nbsp;
          <div
            onClick={() => {
              setVisible(!visible);
              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            <span>{cheveronIcon}</span>
          </div>
        </div>

        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-6 mb-2">
              <div className="form-group row">
                <label className="col-3" htmlFor="email-input">
                  Report Name
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    value={reportName}
                    className="search-input form-control"
                    placeholder="Enter Report Name"
                    onChange={(e) => setReportName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-2">
              <div className="form-group row">
                <label className="col-3" htmlFor="createdby-input">
                  Created By
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    value={createdBy}
                    className="search-input form-control"
                    placeholder="Enter Created By"
                    onChange={(e) => setCreatedBy(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                type="submit"
                className="btn btn-primary"
                title="Search"
                onClick={() => handleSearch()}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      <br></br>
      <div>
        {searching ? (
          <div className="list" align="center">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <>
                {data.length > 0 ? (
                  <table
                    className="table table-bordered  "
                    style={{ border: "1px solid #ddd", width: "60%" }}
                  >
                    <thead style={{ backgroundColor: "#eeeeee" }}>
                      <tr>
                        <th className="text-center">Report Name</th>
                        <th className="text-center">Created By</th>
                        <th className="text-center">Created Date</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((record) => (
                        <tr key={record.Id}>
                          <td className="text-left">{record.Name}</td>
                          <td className="text-left">{record.CreatedBy.Name}</td>
                          <td className="text-left">
                            {formatDate(record.CreatedDate)}
                          </td>
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-primary viewreport"
                              onClick={() => {
                                getReports(record.Id);
                              }}
                            >
                              View
                            </button>
                          </div>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p></p>
                )}
                <br />
                {renderTable()}
              </>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ReportTable;
