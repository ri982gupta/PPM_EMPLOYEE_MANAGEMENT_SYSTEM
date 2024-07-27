import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { environment } from "../../../environments/environment";
import moment from "moment";
import Loader from "../../Loader/Loader";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { BsFillCircleFill } from "react-icons/bs";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { TiCancel } from "react-icons/ti";
import { FaSave } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import { Link } from "react-router-dom";
import ProjectExpensePopOver from "../../ProjectComponent/ProjectExpensePopOver";
import { updateExpenseButtonState } from "../../../reducers/SelectedSEReducer";
import { useDispatch } from "react-redux";
import GlobalHelp from "../../PrimeReactTableComponent/GlobalHelp";

function ExpenseStackView(props) {
  const [approvalData, setApprovalData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [resourceId, setResourceId] = useState(0);
  const [expandedRows, setExpandedRows] = useState(null);
  const [loaderOne, setLoaderOne] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState({});
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [popUpLoader, setPopUpLoader] = useState(false);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [isEditClicked, setIsEditClicked] = useState(true);
  const [editRowData, setEditRowData] = useState({});
  const [selectedOptionTwo, setSelectedOptionTwo] = useState();
  const [isCheckedList, setIsCheckedList] = useState([]);
  const [headerChecked, setHeaderChecked] = useState(true);
  const [message, setMessage] = useState(false);
  const [count, setCount] = useState(0);
  const [paymentStatusDropdown, setPaymentStatusDropdown] = useState([]);

  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  const { setIsClassicView } = props;
  const handleAbort = props.handleAbort;
  const SearchHelpPDFName = "SearchExpense.pdf";
  const SearchHeadername = "Search Expense Help";

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(false);
  };
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [paymentUsers, setPaymentUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          baseUrl + `/ProjectMS/projectExpenses/paymentUsers`
        );
        const paymentUsers = response.data;
        setPaymentUsers(paymentUsers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

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
    if (resourceId != 0) {
      teamRequestsData();
      resourceExpenseData();
      approvalRequestsData();
    }
  }, [resourceId]);

  const teamRequestsData = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/projectExpenses/teamExpenses?resourceid=${resourceId}&projectid=-1`
      )
      .then((res) => {
        setTeamData(res.data);
      })
      .catch((error) => console.log(error));
  };

  const resourceExpenseData = () => {
    axios
      .get(
        baseUrl +
          `/timeandexpensesms/expensesSearch/myRequests?resId=${resourceId}`
      )
      .then((res) => {
        setResourceData(res.data);
      })
      .catch((error) => console.log(error));
  };

  const approvalRequestsData = () => {
    setLoader(false);
    axios
      .get(
        `${baseUrl}/timeandexpensesms/expensesSearch/expenseApprovals?resId=${resourceId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        let response = res.data.map((obj) => ({ ...obj, subrows: [] }));
        setApprovalData(response);
        setLoader(false);
      })
      .catch((error) => console.log(error));
  };

  const teamDataWithSerial = teamData.map((item, index) => {
    return { ...item, serial: index + 1 };
  });

  const reourceDataWithSerial = resourceData.map((item, index) => {
    return { ...item, serial: index + 1 };
  });

  const datesFomat = (rowData) => {
    const commonStyle = {
      textAlign: "center",
    };

    if (rowData.minDt === rowData.maxDt) {
      return (
        <div
          title={`${moment(rowData.minDt).format("DD MMM")}`}
          style={commonStyle}
        >{`${moment(rowData.minDt).format("DD MMM")}`}</div>
      );
    }
    return (
      <div
        title={`${moment(rowData.minDt).format("DD MMM")} - ${moment(
          rowData.maxDt
        ).format("DD MMM")}`}
      >{`${moment(rowData.minDt).format("DD MMM")} - ${moment(
        rowData.maxDt
      ).format("DD MMM")}`}</div>
    );
  };

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

  const amountFormat = (rowData) => {
    let container = document.createElement("div");
    container.innerHTML = rowData.clientCurrencyCode;
    return container.innerHTML;
  };

  const allowExpansion = (rowData) => {
    return true;
  };

  const onRowExpand = (e) => {
    let cid = e.data.projectCode;

    setLoaderOne(false);
    axios
      .get(
        baseUrl +
          `/customersms/Customers/getProjectCode?cid=` +
          encodeURIComponent(cid)
      )
      .then((response) => {
        axios
          .get(
            baseUrl +
              `/ProjectMS/projectExpenses/stackExpenses?stackId=${e.data.stackId}&userId=${loggedUserId}&raisedBy=${e.data.raised_by}&projectId=${response.data.id}&statusId=${e.data.status_id}`
          )
          .then((res) => {
            approvalData.find((u) => u.stackId === e.data.stackId).subrows =
              res.data;
            setLoaderOne(false);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const handleSelection = (e) => {
    setSelectedRows(e.value);
  };

  const isRowSelectable = (event) => (event.data.isEdit ? true : false);

  const rowClassName = (data) => {
    data.isEdit ? "" : "not-allowed";
  };

  const expenseDetails = (expenseId) => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/projectExpenses/expenseHistory?expenseId=${expenseId}`
      )
      .then((res) => {
        setExpenseHistory(res.data);
        setPopUpLoader(false);
      })
      .catch((error) => console.log(error));
  };

  const viewDetails = (rowData) => {
    return (
      <a
        className="linkSty"
        onClick={() => {
          setPopUpLoader(true);
          expenseDetails(rowData.expense_id);
          setPopUp(true);
          setPopUpData(rowData);
        }}
      >
        View
      </a>
    );
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
    return selectedRows.map((d) => d.expense_id).includes(rowData.expense_id) &&
      !paymentUsers.includes(parseInt(loggedUserId)) ? (
      <div>
        <select onChange={(e) => onchange(e, rowData)} id="dropDown">
          {rowData.drop_down.map((item) => {
            const key = Object.keys(item)[0];
            const label = item[key];
            return <option value={key}>{label}</option>;
          })}
        </select>
      </div>
    ) : (
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
    );
  };
  console.log(paymentUsers.includes(parseInt(loggedUserId)));
  const paymentsField = (rowData) => {
    return selectedRows.map((d) => d.expense_id).includes(rowData.expense_id) &&
      paymentUsers.includes(parseInt(loggedUserId)) ? (
      <div>
        <select onChange={(e) => onchange(e, rowData)} id="dropDown">
          {rowData.drop_down.map((item) => {
            const key = Object.keys(item)[0];
            const label = item[key];
            return <option value={key}>{label}</option>;
          })}
        </select>
      </div>
    ) : typeof rowData.Payment === "string" &&
      rowData.Payment.trim().length > 0 &&
      /[a-zA-Z]/.test(rowData.Payment) ? (
      <span title={rowData.Payment} className="ellipsis">
        {approvalIcon(rowData.Payment)} {rowData.Payment}
      </span>
    ) : (
      ""
    );
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  const Checkbox = (rowData, index) => {
    return (
      <>
        <div>
          <input
            className="form-check-input"
            type="checkbox"
            id={rowData.id}
            style={{ height: "20px", width: "20px", marginLeft: "5px" }}
            checked={selectedRows.some(
              (item) => item.expense_id === rowData.expense_id
            )}
            onChange={(e) => {
              const newCheckedList = [...isCheckedList];
              newCheckedList[index] = e.target.checked;
              setIsCheckedList(newCheckedList);

              rowData.Payment = Object.keys(rowData.drop_down[0])[0];
              const newSelection = [...selectedRows];
              if (e.target.checked) {
                newSelection.push(rowData);
              } else {
                const selectionIndex = newSelection.findIndex(
                  (selectedRowData) =>
                    selectedRowData.expense_id === rowData.expense_id
                );
                if (selectionIndex !== -1) {
                  newSelection.splice(selectionIndex, 1);
                }
              }
              handleSelectionChange(newSelection);
            }}
            disabled={isRowDisabled(rowData)}
          />
        </div>
      </>
    );
  };
  //var list  = [];
  var [list, setlist] = useState([]);
  const Checkboxheader = (rowData, index, subRowsData) => {
    const handleCheckboxChange = (e) => {
      const isChecked = e.target.checked;
      setHeaderChecked(isChecked);

      let id = e.target.id;

      let dcc = null;

      if (isChecked) {
        let isEditData = subRowsData.filter((item) => item.isEdit);

        let ll = list;

        if (isEditData.length != 0) {
          for (let i = 0; i < isEditData.length; i++) {
            isEditData[i].Payment = Object.keys(isEditData[i].drop_down[0])[0];
            ll.push(isEditData[i]);
            setlist(ll);
          }
        }

        let finalLL = ll.map((d) => "" + d.id);

        if (count > 0) {
          if (id.includes(",")) {
            let spltArr = id.split(",");

            for (let i = 0; i < spltArr.length; i++) {
              let ddc = document.getElementById(spltArr[i]);
              ddc.checked = finalLL.includes("" + spltArr[i]);
            }
          } else {
            dcc = document.getElementById(id);
            dcc.checked = finalLL.includes("" + id);
          }
        }

        setSelectedRows(() => list);
      } else {
        const updatedList = selectedRows.filter(
          (item) => !subRowsData.includes(item)
        );
        setlist(updatedList);
        setSelectedRows(() => updatedList);
      }
      setCount((prev) => prev + 1);

      // Checkbox(rowData, index);
    };

    return (
      <>
        <div className="form-check pl-4">
          <input
            className="form-check-input"
            type="checkbox"
            id={subRowsData
              .filter((d) => d.isEdit)
              .map((d) => d.id)
              .toString()}
            style={{ height: "20px", width: "20px" }}
            checked={
              selectedRowsData
                .filter((u) => u.id === subRowsData[0]?.id)
                .filter((i) => i.isEdit == true).length ===
                subRowsData.filter((it) => it.isEdit == true).length &&
              subRowsData.filter((it) => it.isEdit == true).length !== 0
            }
            onChange={handleCheckboxChange}
            disabled={subRowsData.every(isRowDisabled)}
          />
        </div>
      </>
    );
  };
  const commentsField = (rowData) => {
    return selectedRows
      .map((d) => d.expense_id)
      .includes(rowData.expense_id) ? (
      <textarea
        id="comment"
        style={{ resize: "none" }}
        defaultValue={rowData.comments}
        onChange={(e) => onchange(e, rowData)}
      />
    ) : (
      <div title={rowData.comments} className="ellipsis">
        {rowData.comments}
      </div>
    );
  };

  const paymentStatus = (rowData) => {
    return editRowData.stackId === rowData.stackId &&
      paymentUsers.includes(parseInt(loggedUserId)) ? (
      <div>
        <select onChange={(e) => setSelectedOptionTwo(e.target.value)}>
          {paymentStatusDropdown?.map((item) => {
            const key = Object.keys(item)[0];
            const label = item[key];
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
    ) : (
      rowData.payment
    );
  };

  const approvalStatus = (rowData) => {
    return editRowData.stackId === rowData.stackId &&
      !paymentUsers.includes(parseInt(loggedUserId)) ? (
      <div>
        <select onChange={(e) => setSelectedOptionTwo(e.target.value)}>
          {paymentStatusDropdown?.map((item) => {
            const key = Object.keys(item)[0];
            const label = item[key];
            return (
              <option key={key} value={key}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
    ) : (
      <div title={rowData.approval}>{rowData.approval}</div>
    );
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
                      <div className="col-5">
                        {totalData
                          .filter((d) => d.stackId === data.id)
                          .map((d) => d.projectName)}
                      </div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Resource</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5">{data.fullName}</div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Expense Category</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5">{data.Expense_Type}</div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Description</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5">{data.description}</div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Incurred Amount</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5">
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
                      <div className="col-5">
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
                      <div className="col-5">{data.Payee}</div>
                    </div>
                    <div className="col-6 row">
                      <div className="col-6">
                        <strong>Status</strong>
                      </div>
                      <div className="col-1">:</div>
                      <div className="col-5">
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
                          onClick={() =>
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
                      <div className="col-5">
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
                  .map((d) => (
                    <div>
                      <strong>
                        {d.state} by {d.firstName} {d.lastName} on{" "}
                        {moment(d.dateCreated).format("DD-MMM-YYYY")}
                      </strong>
                      <br />
                      <div className="col-12 row">
                        <div className="col-6 row">
                          <div className="col-6">
                            <span>Disbursed Amount</span>
                          </div>
                          <div className="col-1">:</div>
                          <div className="col-5">
                            {amountFormat(data) +
                              " " +
                              numberWithCommas(d.disbursedAmount)}
                          </div>
                        </div>
                        <div className="col-6 row">
                          <div className="col-6">
                            <span>Comment</span>
                          </div>
                          <div className="col-1">:</div>
                          <div className="col-5">
                            {d.comments == "" || d.comments == null
                              ? "NA"
                              : d.comments}
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

  const isBillable = (rowData) => {
    return selectedRows
      .map((d) => d.expense_id)
      .includes(rowData.expense_id) ? (
      <input
        type="checkbox"
        id="billable"
        defaultChecked={rowData.is_billable}
        onChange={(e) => onchange(e, rowData)}
      />
    ) : rowData.is_billable == false ? (
      "No"
    ) : (
      "Yes"
    );
  };

  const disbursedAmountField = (rowData) => {
    return selectedRows
      .map((d) => d.expense_id)
      .includes(rowData.expense_id) ? (
      <input
        type="text"
        id="disbursed"
        defaultValue={rowData.disbursed_amount}
        onChange={(e) => onchange(e, rowData)}
        onKeyDown={(e) => {
          const key = e.key;
          const isNumber = /^[0-9]$/.test(key);
          const isDecimal = key === ".";

          if (!isNumber && !isDecimal && key !== "Backspace") {
            e.preventDefault();
          }
        }}
      />
    ) : (
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
    );
  };

  const clientAmountField = (rowData) => {
    return selectedRows
      .map((d) => d.expense_id)
      .includes(rowData.expense_id) ? (
      <input
        type="text"
        id="client"
        defaultValue={rowData.client_amount}
        onChange={(e) => onchange(e, rowData)}
        onKeyDown={(e) => {
          const key = e.key;
          const isNumber = /^[0-9]$/.test(key);
          const isDecimal = key === ".";

          if (!isNumber && !isDecimal && key !== "Backspace") {
            e.preventDefault();
          }
        }}
      />
    ) : (
      <div
        title={
          amountFormat(rowData) + " " + numberWithCommas(rowData.client_amount)
        }
      >
        {amountFormat(rowData) + " " + numberWithCommas(rowData.client_amount)}
      </div>
    );
  };

  useEffect(() => {
    setSelectedRowsData((prev) => selectedRows);
  }, [selectedRows]);

  const onchange = (e, rowData) => {
    const index = selectedRowsData.findIndex(
      (selectedRowData) => selectedRowData.expense_id === rowData.expense_id
    );

    const updatedSelectedRowsData = [...selectedRowsData];
    updatedSelectedRowsData[index] = {
      ...updatedSelectedRowsData[index],
      disbursed_amount:
        e.target.id === "disbursed"
          ? e.target.value
          : updatedSelectedRowsData[index].disbursed_amount,
      client_amount:
        e.target.id === "client"
          ? e.target.value
          : updatedSelectedRowsData[index].client_amount,
      comments:
        e.target.id === "comment"
          ? e.target.value
          : updatedSelectedRowsData[index].comments,
      is_billable:
        e.target.id === "billable"
          ? e.target.value
          : updatedSelectedRowsData[index].is_billable,
      Payment:
        e.target.id === "dropDown"
          ? e.target.value
          : updatedSelectedRowsData[index].Payment,
    };
    setSelectedRowsData(updatedSelectedRowsData);
  };

  const downloadExpenseStack = async (stackId) => {
    try {
      const response = await axios.get(
        baseUrl + `/ProjectMS/projectExpenses/downloadStack?stackId=${stackId}`,
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
      link.download = "Expense.pdf";

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      clearTimeout(setLoader);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const actionField = (rowData) => {
    console.log(
      "first",
      approvalData.find((item) => item.stackId == rowData.stackId)?.isEdit
    );
    return (
      <>
        <BsFileEarmarkPdf
          size={"1.8em"}
          style={{
            color: "#428bca",
            marginRight: "4px",
            marginLeft: "-15px",
            cursor: "pointer",
          }}
          onClick={() => downloadExpenseStack(rowData.stackId)}
        />
        {(paymentUsers.includes(parseInt(loggedUserId)) &&
          (rowData.approval === "PM Approved" ||
            rowData.approval == "Approved To Pay")) ||
        (!paymentUsers.includes(parseInt(loggedUserId)) &&
          !rowData.subrows.length > 0 &&
          rowData.approval === "Submitted") ? (
          <AiFillEdit
            size={"1.5em"}
            style={{ cursor: "pointer", marginRight: "-15px" }}
            color="orange"
            onClick={(e) => {
              getPaymentStatusDropdown(rowData.status_id);
              setIsEditClicked(false);
              setEditRowData(rowData);
              // paymentStatus(rowData);
              setSelectedOptionTwo(Object.keys(rowData.dropDown[0])[0]);
            }}
          />
        ) : (
          ""
        )}
      </>
    );
  };

  const getPaymentStatusDropdown = (statusId) => {
    axios
      .get(
        baseUrl +
          `/timeandexpensesms/expensesSearch/paymentStatus?statusId=${statusId}`
      )
      .then((res) => {
        setPaymentStatusDropdown(res.data);
        setSelectedOptionTwo(Object.keys(res.data[0])[0]);
      })
      .catch((error) => console.log(error));
  };

  const sendSelectedRowsData = (datas) => {
    let data = selectedRowsData.filter((u) => u.id === datas.stackId);
    const formattedData = data.map((rowData) => ({
      expenseId: rowData.expense_id,
      isBillable: rowData.is_billable == false ? 0 : 1,
      disbursedAmount: parseFloat(rowData.disbursed_amount),
      clientAmmount: parseFloat(rowData.client_amount),
      payment: parseInt(rowData.Payment),
      comments: rowData.comments,
      resId: resourceId,
      stackId: rowData.id,
    }));

    axios
      .post(
        baseUrl + `/ProjectMS/projectExpenses/saveExpenses`,
        formattedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        setMessage(true);
        setTimeout(() => {
          setMessage(false);
        }, 3000);
        teamRequestsData();
        resourceExpenseData();
        approvalRequestsData();
        setSelectedRows([]);
      })
      .catch((error) => console.log(error));
  };

  const saveRowData = () => {
    const formattedData = {
      stackId: editRowData.stackId,
      newStatusId: parseInt(selectedOptionTwo),
    };

    axios
      .post(
        baseUrl + `/ProjectMS/projectExpenses/saveStackExpenses`,
        formattedData,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        setMessage(true);
        setTimeout(() => {
          setMessage(false);
        }, 3000);
        setEditRowData({});
        teamRequestsData();
        resourceExpenseData();
        approvalRequestsData();
      })
      .catch((error) => console.log(error));
  };

  const cancelRowEditOuter = () => {
    setIsEditClicked(true);
    setEditRowData({});
  };

  const cancelRowEdit = (datas) => {
    const updatedList = selectedRows.filter(
      (item) => item.id !== datas.stackId
    );
    setSelectedRows(updatedList);
    setlist(updatedList);
  };

  const isRowDisabled = (rowData) => (rowData.isEdit ? false : true);

  const rowExpansionTemplate = (approvalData) => {
    return (
      <>
        {loaderOne ? <Loader handleAbort={() => setLoaderOne(false)} /> : ""}
        <DataTable
          value={approvalData.subrows}
          className="primeReactDataTable"
          stripedRows
        >
          <Column
            style={{ textAlign: "center" }}
            header={(rowData, index) =>
              Checkboxheader(rowData, index, approvalData?.subrows)
            }
            body={(rowData, index) => Checkbox(rowData, index)}
          />
          <Column
            sortable
            field=""
            header="Name"
            body={(rowData) => (
              <div
                title={
                  approvalData.stackId === rowData.id
                    ? `${approvalData.projectName}`
                    : ""
                }
                className="ellipsis"
              >
                {approvalData.stackId === rowData.id
                  ? `${approvalData.projectName}`
                  : ""}
              </div>
            )}
          />
          <Column
            sortable
            field="expense_date"
            header="Date"
            body={(rowData) => (
              <div
                title={moment(rowData.expense_date).format("DD-MMM-yyyy")}
                className="ellipsis"
              >
                {moment(rowData.expense_date).format("DD-MMM-yyyy")}
              </div>
            )}
          />
          <Column
            sortable
            field="Payee"
            header="Payee"
            body={(rowData) => (
              <div title={rowData.Payee} className="ellipsis">
                {rowData.Payee}
              </div>
            )}
          />
          <Column
            sortable
            field="Expense_Type"
            header="Expense Type"
            body={(rowData) => (
              <div title={rowData.Expense_Type} className="ellipsis">
                {rowData.Expense_Type}
              </div>
            )}
          />
          <Column
            sortable
            field="is_billable"
            style={{ textAlign: "center" }}
            header="Billable"
            body={isBillable}
          />
          <Column
            sortable
            field="Incurred"
            style={{ textAlign: "right" }}
            header="Incurred"
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
            body={disbursedAmountField}
          />
          <Column
            sortable
            field="client_amount"
            header="Client"
            style={{ textAlign: "right" }}
            body={clientAmountField}
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
            body={paymentsField}
          />
          <Column
            sortable
            field="comments"
            header="Comments"
            body={commentsField}
          />
          <Column field="" header="Details" body={viewDetails} />
        </DataTable>
        <div style={{ display: "flex", border: "1px solid #ECF0F1" }}>
          <button
            className="btn btn-primary ms-1 p-1"
            data-toggle="tooltip"
            title="Save row"
            disabled={
              selectedRowsData.filter((u) => u.id === approvalData.stackId)
                .length === 0
            }
            onClick={() => sendSelectedRowsData(approvalData)}
          >
            <FaSave />
          </button>
          <button
            className="btn btn-primary ms-1 p-1 cancel"
            data-toggle="tooltip"
            title="Cancel row editing"
            disabled={
              selectedRowsData.filter((u) => u.id === approvalData.stackId)
                .length === 0
            }
            onClick={() => cancelRowEdit(approvalData)}
          >
            <TiCancel size={"1em"} />
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <div style={{ overflowX: "hidden" }}>
        {message ? (
          <div className="statusMsg success">
            <span>
              <BiCheck />
              Expense(s) Saved successfully
            </span>
          </div>
        ) : (
          ""
        )}
        <div className="col-md-12">
          <div className="pageTitle">
            <div className="childOne"></div>
            <div className="childTwo">
              <h2>Expense Report of {loggedUserName}</h2>
            </div>
            <div className="childThree">
              <GlobalHelp pdfname={SearchHelpPDFName} name={SearchHeadername} />
            </div>
          </div>
          <div className="float-end my-2">
            <button
              type="button"
              className="btn btn-primary"
              title="View"
              onClick={() => {
                navigate(`/search/userExpenseHistory`, {
                  state: { btnState: "Search" },
                });
                dispatch(updateExpenseButtonState("Search"));
                setIsClassicView(true);
              }}
            >
              Classic View
            </button>
          </div>
        </div>
        {loader ? (
          <Loader handleAbort={() => setLoader(false)} />
        ) : (
          <>
            <div className="w-100 mt-5 ml-4">
              <div
                className="col-md-12 childTwo"
                style={{
                  border: "1px solid #ECF0F1",
                  marginTop: "50px",
                  backgroundColor: "#e9ecef",
                }}
              >
                <h6
                  style={{
                    color: "#02277f",
                    marginLeft: "10px",
                    marginTop: "2px",
                  }}
                >
                  My Approval Requests
                </h6>
              </div>
              <DataTable
                value={approvalData}
                className="primeReactDataTable darkHeader"
                showGridlines
                stripedRows
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                onRowExpand={onRowExpand}
                rowExpansionTemplate={rowExpansionTemplate}
                paginator
                rows={10}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                paginationComponentOptions={{
                  rowsPerPageText: "Records per page:",
                  rangeSeparatorText: "out of",
                }}
                currentPageReportTemplate="View {first} - {last} of {totalRecords} "
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                rowsPerPageOptions={[10, 25, 50]}
              >
                <Column expander={allowExpansion} style={{ width: "5rem" }} />
                <Column
                  sortable
                  field="stackName"
                  header="Stack"
                  body={(rowData) => (
                    <div title={rowData.stackName}>
                      <span
                        className="linkSty"
                        onClick={() => {
                          navigate(`/expense/Create/${rowData.stackId}`);
                          window.location.reload();
                          dispatch(updateExpenseButtonState("Create"));
                        }}
                      >
                        {rowData.stackName}
                      </span>
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="resource"
                  header="Resource"
                  body={(rowData) => (
                    <div title={rowData.resource} className="ellipsis">
                      {rowData.resource}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="approval"
                  header="Approval Status"
                  body={approvalStatus}
                />
                <Column
                  sortable
                  field="payment"
                  header="Payment Status"
                  body={paymentStatus}
                />
                <Column
                  sortable
                  field="projectCode"
                  header="Code"
                  body={(rowData) => (
                    <div title={rowData.projectCode} className="ellipsis">
                      {rowData.projectCode}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="projectName"
                  header="Name"
                  body={(rowData) => (
                    <div title={rowData.projectName} className="ellipsis">
                      {rowData.projectName}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="amt"
                  header="Incurred"
                  style={{ textAlign: "right" }}
                  body={(rowData) => (
                    <div
                      title={
                        amountFormat(rowData) +
                        " " +
                        numberWithCommas(rowData.amt)
                      }
                    >
                      {amountFormat(rowData) +
                        " " +
                        numberWithCommas(rowData.amt)}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="disbursedAmt"
                  header="Disbursed"
                  style={{ textAlign: "right" }}
                  body={(rowData) => (
                    <div
                      title={
                        amountFormat(rowData) +
                        " " +
                        numberWithCommas(rowData.disbursedAmt)
                      }
                    >
                      {amountFormat(rowData) +
                        " " +
                        numberWithCommas(rowData.disbursedAmt)}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="clientAmt"
                  header="Client"
                  style={{ textAlign: "right" }}
                  body={(rowData) => (
                    <div
                      title={
                        amountFormat(rowData) +
                        " " +
                        numberWithCommas(rowData.clientAmt)
                      }
                    >
                      {amountFormat(rowData) +
                        " " +
                        numberWithCommas(rowData.clientAmt)}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="createdOn"
                  header="Created On"
                  body={(rowData) => (
                    <div
                      title={moment(rowData.createdOn).format("DD-MMM-yyyy")}
                      style={{ textAlign: "center" }}
                    >
                      {moment(rowData.createdOn).format("DD-MMM-yyyy")}
                    </div>
                  )}
                />
                <Column
                  field=""
                  header="Actions"
                  style={{ textAlign: "center", width: "6rem" }}
                  body={actionField}
                />
              </DataTable>
              <div style={{ display: "flex", border: "1px solid #ECF0F1" }}>
                <button
                  className="btn btn-primary ms-1 p-1"
                  data-toggle="tooltip"
                  title="Save row"
                  onClick={saveRowData}
                  disabled={isEditClicked}
                >
                  <FaSave />
                </button>
                <button
                  className="btn btn-primary ms-1 p-1"
                  data-toggle="tooltip"
                  title="Cancel row editing"
                  onClick={cancelRowEditOuter}
                  disabled={isEditClicked}
                >
                  <TiCancel size={"1em"} />
                </button>
              </div>
            </div>

            <div className="w-100 mt-5 ml-4">
              <div
                className="col-md-12 childTwo"
                style={{
                  border: "1px solid #ECF0F1",
                  marginTop: "50px",
                  backgroundColor: "#e9ecef",
                }}
              >
                <h6
                  style={{
                    color: "#02277f",
                    marginLeft: "10px",
                    marginTop: "2px",
                  }}
                >
                  My Requests
                </h6>
              </div>
              <DataTable
                value={reourceDataWithSerial}
                className="primeReactDataTable darkHeader"
                showGridlines
                stripedRows
                paginator
                rows={10}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                paginationComponentOptions={{
                  rowsPerPageText: "Records per page:",
                  rangeSeparatorText: "out of",
                }}
                currentPageReportTemplate="View {first} - {last} of {totalRecords} "
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                rowsPerPageOptions={[10, 25, 50]}
              >
                <Column
                  field="serial"
                  style={{ width: "50px", textAlign: "center" }}
                  header="S.No"
                />
                <Column
                  sortable
                  field="stackName"
                  header="Expense #"
                  body={(rowData) => (
                    <div title={rowData.stackName}>
                      <span
                        className="linkSty"
                        onClick={() => {
                          navigate(`/expense/Create/${rowData.stackId}`);
                          window.location.reload();
                          dispatch(updateExpenseButtonState("Create"));
                        }}
                      >
                        {rowData.stackName}
                      </span>
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="projectName"
                  header="Project"
                  body={(rowData) => (
                    <div title={rowData.projectName} className="ellipsis">
                      {rowData.projectName}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="maxDt"
                  header="Dates"
                  body={datesFomat}
                />
                <Column
                  sortable
                  field="dateCreated"
                  header="Saved On"
                  body={(rowData) => (
                    <div
                      title={moment(rowData.dateCreated).format("DD-MMM-yyyy")}
                      style={{ textAlign: "center" }}
                    >
                      {moment(rowData.dateCreated).format("DD-MMM-yyyy")}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="amount"
                  style={{ textAlign: "right" }}
                  header="Due Amount"
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
                  field="stackStatus"
                  header="Status"
                  body={(rowData) => (
                    <div title={rowData.stackStatus}>{rowData.stackStatus}</div>
                  )}
                />
              </DataTable>
            </div>
            <div className="w-100 mt-5 ml-4">
              <div
                className="col-md-12 childTwo"
                style={{
                  border: "1px solid #ECF0F1",
                  marginTop: "50px",
                  backgroundColor: "#e9ecef",
                }}
              >
                <h6
                  style={{
                    color: "#02277f",
                    marginLeft: "10px",
                    marginTop: "2px",
                  }}
                >
                  Team Requests
                </h6>
              </div>
              <DataTable
                value={teamDataWithSerial}
                className="primeReactDataTable darkHeader"
                showGridlines
                stripedRows
                paginator
                rows={10}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                paginationComponentOptions={{
                  rowsPerPageText: "Records per page:",
                  rangeSeparatorText: "out of",
                }}
                currentPageReportTemplate="View {first} - {last} of {totalRecords} "
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                rowsPerPageOptions={[10, 25, 50]}
              >
                <Column
                  field="serial"
                  style={{ width: "50px", textAlign: "center" }}
                  header="S.No"
                />
                <Column
                  sortable
                  field="stackName"
                  header="Expense #"
                  body={(rowData) => (
                    <div title={rowData.stackName}>
                      <span
                        className="linkSty"
                        onClick={() => {
                          navigate(`/expense/Create/${rowData.stackId}`);
                          window.location.reload();
                          dispatch(updateExpenseButtonState("Create"));
                        }}
                      >
                        {rowData.stackName}
                      </span>
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="projectName"
                  header="Project"
                  body={(rowData) => (
                    <div title={rowData.projectName} className="ellipsis">
                      {rowData.projectName}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="resource"
                  header="Created By"
                  body={(rowData) => (
                    <div title={rowData.resource} className="ellipsis">
                      {rowData.resource}
                    </div>
                  )}
                />
                <Column
                  sortable
                  field="maxDt"
                  header="Dates"
                  body={datesFomat}
                />
                <Column
                  sortable
                  field="createdOn"
                  header="Saved On"
                  body={(rowData) => (
                    <div
                      title={moment(rowData.createdOn).format("DD-MMM-yyyy")}
                      style={{ textAlign: "center" }}
                    >
                      {moment(rowData.createdOn).format("DD-MMM-yyyy")}
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
            </div>
          </>
        )}
        {popUp ? (
          <ExpensePopup
            setPopUp={setPopUp}
            data={popUpData}
            popUp={popUp}
            totalData={approvalData}
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
    </>
  );
}

export default ExpenseStackView;
