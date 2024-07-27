import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import { environment } from "../../environments/environment";
import { BsFillCircleFill } from "react-icons/bs";
import Loader from "../Loader/Loader";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import Draggable from "react-draggable";
import ProjectExpensePopOver from "./ProjectExpensePopOver";
import "./ExpensesTeamRequest.scss"

function ExpensesTeamRequest(props) {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState({});
  const [resourceid, setResourceId] = useState(0);
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [popUpLoader, setPopUpLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loaderOne, setLoaderOne] = useState(false);
  const [table, setTable] = useState(false);

  const baseUrl = environment.baseUrl;
  const projectId = props.projectId;
  const handleAbort = props.handleAbort;
  const loggedUserId = localStorage.getItem("resId");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(false);
  };

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(props.maxHeight1 -92) + "px"
  );


  const getResourceid = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getresourceid?id=${loggedUserId}`,
    }).then(function (response) {
      var res = response.data;
      setResourceId(res);
    });
  };

  useEffect(() => {
    getResourceid();
  }, []);

  useEffect(() => {
    getProjectOverviewData();
    if (resourceid !== 0) {
      getData();
    }
  }, [resourceid]);

  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;

        setProjectData(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const amountFormat = (rowData) => {
    let container = document.createElement("div");
    container.innerHTML = rowData.clientCurrencyCode;
    return container.innerHTML;
  };

  let name = projectData[0]?.projectName;

  const numberWithCommas = (x) => {
    var number = String(x);

    if (number.includes(".")) {
      var parts = number.split(".");
      var integerPart = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      var decimalPart = parts[1].padEnd(2, "0");
      return integerPart + "." + decimalPart;
    } else {
      return number.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + ".00";
    }
  };

  const getData = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios
      .get(
        baseUrl +
          `/ProjectMS/projectExpenses/teamExpenses?resourceid=${resourceid}&projectid=${projectId}`
      )
      .then((res) => {
        setData(res.data);
        setLoader(false);
        clearTimeout(loaderTime);
        setTable(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const approvalIcon = (rowData) => {
    if (rowData.includes("Submitted")) {
      return (
        <span>
          <BsFillCircleFill style={{ color: "#ccc" }} />
        </span>
      );
    } else if (
      rowData.includes("PM Approved") ||
      rowData.includes("Pending") ||
      rowData.includes("IT Approved") ||
      rowData.includes("HR Approved")
    ) {
      return (
        <span>
          <BsFillCircleFill style={{ color: "#CDE6FE" }} />
        </span>
      );
    } else if (rowData.includes("PM Rejected")) {
      return (
        <span>
          <BsFillCircleFill style={{ color: "#e54c53" }} />
        </span>
      );
    } else if (rowData.includes("Drafted")) {
      return (
        <span>
          <BsFillCircleFill style={{ color: "#EDD4A2" }} />
        </span>
      );
    } else if (rowData.includes("Paid")) {
      return (
        <span>
          <BsFillCircleFill style={{ color: "#D9FBB3" }} />
        </span>
      );
    } else if (rowData.includes("Approved To Pay")) {
      return (
        <span>
          <BsFillCircleFill style={{ color: "#0080ff" }} />
        </span>
      );
    } else if (
      rowData.includes("FM Rejected") ||
      rowData.includes("IT Rejected") ||
      rowData.includes("HR Rejected")
    ) {
      return (
        <span>
          <BsFillCircleFill style={{ color: "#e54c53" }} />
        </span>
      );
    } else {
      return <span></span>;
    }
  };
  const [popoverdata, setPopoverData] = useState("");
  const approvalField = (rowData) => {
    return (
      <>
        <div
          onMouseOver={(e) => {
            setAnchorEl(e?.currentTarget);
            setPopoverData(
              rowData.approvalFlow.split(",").join(" >> ").slice(0, -4)
            );
          }}
          onMouseLeave={handleClose}
          className="ellipsis"
        >
          {approvalIcon(rowData.Approval)} {rowData.Approval}
        </div>
      </>
    );
  };

  const viewDetails = (rowData) => {
    return (
      <a
        className="linkSty"
        onClick={() => {
          expenseDetails(rowData.expense_id);
          setPopUpData(rowData);
        }}
      >
        View
      </a>
    );
  };

  const expenseDetails = (expenseId) => {
    const loaderTime = setTimeout(() => {
      setPopUpLoader(true);
      setPopUp(true);
    }, 2000);
    axios
      .get(
        baseUrl +
          `/ProjectMS/projectExpenses/expenseHistory?expenseId=${expenseId}`
      )
      .then((res) => {
        setExpenseHistory(res.data);
        clearTimeout(loaderTime);
        setPopUpLoader(false);
      })
      .catch((error) => console.log(error));
  };

  function ExpensePopup(props) {
    const { popUp, setPopUp, data, totalData } = props;

    const downloadFile = async (document_id, svn_revision, file_name) => {
      try {
        const response = await axios.get(
          baseUrl +
            `/CommonMS/document/downloadFile?documentId=${document_id}&svnRevision=${svn_revision}`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = file_name;

        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    return (
      <div>
        {popUpLoader ? (
          <Loader
            handleAbort={() => {
              handleAbort;
              setPopUpLoader(false);
            }}
          />
        ) : (
          <CModal
            visible={popUp}
            backdrop="static"
            size="lg"
            onClose={() => setPopUp(false)}
          >
            <CModalHeader style={{ cursor: "all-scroll" }}>
              <CModalTitle>
                <span className="ft16">Expense Details</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="container">
                <div className="form-group content">
                  <div className="col-12 row">
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Project</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div
                        className="col-5 ellipsis"
                        title={totalData[0].projectName}
                      >
                        {totalData[0].projectName}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Resource</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5 ellipsis" title={data.fullName}>
                        {data.fullName}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Expense Category</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5" title={data.Expense_Type}>
                        {data.Expense_Type}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Description</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5" title={data.description}>
                        {data.description}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Incurred Amount</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div
                        className="col-5"
                        title={
                          amountFormat(data) +
                          " " +
                          numberWithCommas(data.Incurred)
                        }
                      >
                        {amountFormat(data) +
                          " " +
                          numberWithCommas(data.Incurred)}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Disbursed Amount</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div
                        className="col-5"
                        title={
                          amountFormat(data) +
                          " " +
                          numberWithCommas(data.disbursed_amount)
                        }
                      >
                        {amountFormat(data) +
                          " " +
                          numberWithCommas(data.disbursed_amount)}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Paid By</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5" title={data.Payee}>
                        {data.Payee}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Status</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div
                        className="col-5"
                        title={
                          data.Payment == null || data.Payment == ""
                            ? data.Approval
                            : data.Payment
                        }
                      >
                        {data.Payment == null || data.Payment == ""
                          ? data.Approval
                          : data.Payment}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Receipt(s)</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5 ellipsis">
                        <span
                          className="linkSty"
                          onClick={(e) =>
                            downloadFile(
                              data.document_id,
                              data.svn_revision,
                              data.file_name
                            )
                          }
                          title={data.file_name}
                        >
                          {data.file_name}
                        </span>
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Approval Workflow</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div
                        className="col-5"
                        title={data.approvalFlow
                          .split(",")
                          .join(" >> ")
                          .slice(0, -4)}
                      >
                        {data.approvalFlow.split(",").join(" >> ").slice(0, -4)}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Expense History</strong>
                      </div>
                      <div className="col-1">:</div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#eee",
                  border: "1px solid #ddd",
                  minHeight: "40px",
                  maxHeight: "100px",
                  padding: "5px 7px",
                  overflowY: "auto",
                }}
                className="row h-50"
              >
                {expenseHistory
                  .filter((d) => d.state != "Drafted")
                  .map((dat) => (
                    <div>
                      <strong>
                        {dat.state} by {dat.firstName} {dat.lastName} on{" "}
                        {moment(dat.dateCreated).format("DD-MMM-YYYY")}
                      </strong>
                      <br />
                      <div className="col-12 row">
                        <div className="col-6 row">
                          <div className="col-6">
                            <span>Disbursed Amount</span>
                          </div>
                          <div className="col-1">:</div>
                          <div
                            className="col-5"
                            title={
                              amountFormat(data) +
                              " " +
                              numberWithCommas(dat.disbursedAmount)
                            }
                          >
                            {amountFormat(data) +
                              " " +
                              numberWithCommas(dat.disbursedAmount)}
                          </div>
                        </div>
                        <div className="col-6 row">
                          <div className="col-6">
                            <span>Comment</span>
                          </div>
                          <div className="col-1">:</div>
                          <div
                            className="col-5"
                            title={
                              dat.comments == "" || dat.comments == null
                                ? "NA"
                                : dat.comments
                            }
                          >
                            {dat.comments == "" || dat.comments == null
                              ? "NA"
                              : dat.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CModalBody>
            <CModalFooter>
              <button
                className="btn btn-outline-secondary mx-auto"
                onClick={() => setPopUp(false)}
              >
                Close
              </button>
            </CModalFooter>
          </CModal>
        )}
      </div>
    );
  }

  const allowExpansion = (rowData) => {
    return rowData.subrows.length >= 0;
  };

  const onRowExpand = (e) => {
    const loaderTime = setTimeout(() => {
      setLoaderOne(true);
    }, 100);
    axios
      .get(
        baseUrl +
          `/ProjectMS/projectExpenses/stackExpenses?stackId=${e.data.stackId}&userId=${loggedUserId}&raisedBy=${e.data.raised_by}&projectId=${projectId}&statusId=${e.data.status_id}`
      )
      .then((res) => {
        data.find((u) => u.stackId === e.data.stackId).subrows = res.data;
        setLoaderOne(false);
        clearTimeout(loaderTime);
      })
      .catch((error) => console.log(error));
  };

  const rowExpansionTemplate = (data) => {
    return (
      <div className="darkHeader ExpensesTeamRequest-second-table">
        {loaderOne ? "" : ""}
        <DataTable
          value={data.subrows}
          className="primeReactDataTable"
          stripedRows
          sortOrder={1}
        >
          <Column
            sortable
            field="Expense_Type"
            header="Expense Type"
            body={(rowData) => (
              <div className="ellipsis" title={rowData.Expense_Type}>
                {rowData.Expense_Type}
              </div>
            )}
          />
          <Column
            sortable
            field="expense_date"
            header="Date"
            body={(rowData) => (
              <div title={moment(rowData.expense_date).format("DD-MMM-YYYY")}>
                {moment(rowData.expense_date).format("DD-MMM-YYYY")}
              </div>
            )}
          />
          <Column
            sortable
            field="Payee"
            header="Payee"
            body={(rowData) => <div title={rowData.Payee}>{rowData.Payee}</div>}
          />
          <Column
            sortable
            field="is_billable"
            header="Billable"
            body={(rowData) => (rowData.is_billable ? "Yes" : "No")}
          />
          <Column
            sortable
            field="Incurred"
            header="Incurred"
            style={{ textAlign: "right" }}
            body={(rowData) => (
              <div
                title={
                  amountFormat(rowData) +
                  " " +
                  numberWithCommas(rowData.Incurred)
                }
              >
                {amountFormat(rowData) +
                  " " +
                  numberWithCommas(rowData.Incurred)}
              </div>
            )}
          />
          <Column
            sortable
            field="disbursed_amount"
            header="Disbursed"
            style={{ textAlign: "right" }}
            body={(rowData) => (
              <div
                title={
                  amountFormat(rowData) +
                  " " +
                  numberWithCommas(rowData.disbursed_amount)
                }
              >
                {amountFormat(rowData) +
                  " " +
                  numberWithCommas(rowData.disbursed_amount)}
              </div>
            )}
          />
          <Column
            sortable
            field="client_amount"
            header="Client"
            style={{ textAlign: "right" }}
            body={(rowData) => (
              <div
                title={
                  amountFormat(rowData) +
                  " " +
                  numberWithCommas(rowData.client_amount)
                }
              >
                {amountFormat(rowData) +
                  " " +
                  numberWithCommas(rowData.client_amount)}
              </div>
            )}
          />
          <Column
            sortable
            field="Approval"
            header="Approval"
            body={approvalField}
          />
          <Column
            sortable
            field="Payment"
            header="Payment"
            body={(rowData) => (
              <div title={rowData.Payment}>
                {approvalIcon(rowData.Payment)}
                {rowData.Payment}
              </div>
            )}
          />
          <Column
            sortable
            field="comments"
            header="Comments"
            body={(rowData) => (
              <div title={rowData.comments}>{rowData.comments}</div>
            )}
          />
          <Column header="Details" body={viewDetails} />
        </DataTable>
      </div>
    );
  };

  const expenseDate = (rowData) => {
    if (
      moment(rowData.minDt).format("DD-MMM-YYYY") !==
      moment(rowData.maxDt).format("DD-MMM-YYYY")
    ) {
      return (
        <div
          title={`${moment(rowData.minDt).format("DD-MMM-YYYY")} - ${moment(
            rowData.maxDt
          ).format("DD-MMM-YYYY")}`}
        >
          {`${moment(rowData.minDt).format("DD-MMM-YYYY")} - ${moment(
            rowData.maxDt
          ).format("DD-MMM-YYYY")}`}
        </div>
      );
    } else {
      return (
        <div title={moment(rowData.minDt).format("DD-MMM-YYYY")}>
          {moment(rowData.minDt).format("DD-MMM-YYYY")}
        </div>
      );
    }
  };

  return (
    <div className="ExpensesTeamRequest-screen-margin">
      <div className="customCard darkHeader ExpensesTeamRequest">
        {loader ? <Loader handleAbort={() => setLoader(false)} /> : ""}
        &nbsp;
        <div class="form-group">
          {table == true ? (
            <DataTable
              value={data}
              showGridlines
              stripedRows
              className="primeReactDataTable"
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              onRowExpand={onRowExpand}
              rowExpansionTemplate={rowExpansionTemplate}
              paginator
              rows={25}
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 15, 25, 50]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
              currentPageReportTemplate="View {first} - {last} of {totalRecords} "
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              rowsPerPageOptions={[10, 25, 50]}
              sortMode="multiple"
            >
              <Column expander={allowExpansion} style={{ width: "5rem" }} />
              <Column
                sortable
                field="stackName"
                header="Expense"
                body={(rowData) => (
                  <div title={rowData.stackName}>{rowData.stackName}</div>
                )}
              />
              <Column
                sortable
                field="resource"
                header="Created By"
                body={(rowData) => (
                  <div className="ellipsis" title={rowData.resource}>
                    {rowData.resource}
                  </div>
                )}
              />
              <Column
                sortable
                field="createdOn"
                header="Expense Date"
                body={(rowData) => expenseDate(rowData)}
              />
              <Column
                sortable
                field="lastUpdated"
                header="Modified Date"
                body={(rowData) => (
                  <div
                    title={moment(rowData.lastUpdated).format("DD-MMM-YYYY")}
                  >
                    {" "}
                    {moment(rowData.lastUpdated).format("DD-MMM-YYYY")}
                  </div>
                )}
              />
              <Column
                sortable
                field="amount"
                header="Due Amount"
                style={{ textAlign: "right" }}
                body={(rowData) => (
                  <div
                    title={
                      amountFormat(rowData) +
                      " " +
                      numberWithCommas(rowData.amount)
                    }
                  >
                    {amountFormat(rowData) +
                      " " +
                      numberWithCommas(rowData.amount)}
                  </div>
                )}
              />
              <Column
                sortable
                field="approval"
                header="Status"
                body={(rowData) => (
                  <div title={rowData.approval}>{rowData.approval}</div>
                )}
              />
            </DataTable>
          ) : (
            ""
          )}
        </div>
      </div>
      {popUp ? (
        <ExpensePopup
          setPopUp={setPopUp}
          data={popUpData}
          popUp={popUp}
          totalData={data}
        />
      ) : (
        ""
      )}
      {anchorEl && (
        <ProjectExpensePopOver
          handleClose={handleClose}
          anchorEl={anchorEl}
          rowData={popoverdata}
        />
      )}
    </div>
  );
}
export default ExpensesTeamRequest;
