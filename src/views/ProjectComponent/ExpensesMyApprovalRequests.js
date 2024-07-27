import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import { environment } from "../../environments/environment";
import { FaSave } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import Draggable from "react-draggable";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { BsFillCircleFill } from "react-icons/bs";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { BiCheck } from "react-icons/bi";
import Loader from "../Loader/Loader";
import { Dropdown } from "primereact/dropdown";
import ProjectExpensePopOver from "./ProjectExpensePopOver";
import { ImCross } from "react-icons/im";
import { IoWarningOutline } from "react-icons/io5";
import './ExpensesMyApprovalRequests.scss'

function ExpensesMyApprovalRequests(props) {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState({});
  const [resourceid, setResourceId] = useState(0);
  const [loader, setLoader] = useState(false);
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [popUpLoader, setPopUpLoader] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [editRowData, setEditRowData] = useState({});
  const [selectedOptionTwo, setSelectedOptionTwo] = useState(null);
  const [message, setMessage] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(true);
  const [isCheckedList, setIsCheckedList] = useState([]);
  const [loaderOne, setLoaderOne] = useState(false);
  const [paymentInitial, setPaymentInitial] = useState(false);
  const [options, setOptions] = useState([]);
  const [headerChecked, setHeaderChecked] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [table, setTable] = useState(false);

  const [count, setCount] = useState(0);

  const baseUrl = environment.baseUrl;
  const projectId = props.projectId;
  const handleAbort = props.handleAbort;
  const grp3Items = props.grp3Items;
  const dataObject = grp3Items.find((item) => item.display_name === "Expenses");

  // console.log(grp3Items[3].is_write);
  console.log("projectId:", projectId);
  console.log(grp3Items);
  const loggedUserId = localStorage.getItem("resId");

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(props.maxHeight1 -138) + "px"
  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(false);
  };

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
      .catch((error) => console.log(error));
  };

  let projectName = projectData[0]?.projectName;

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

  console.log("resourceid: ", resourceid);
  const getData = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios
      .get(
        baseUrl +
          `/ProjectMS/projectExpenses/expenseApprovals?resourceid=${resourceid}&projectid=${projectId}`
      )
      .then((res) => {
        setData(res.data);
        setLoader(false);
        clearTimeout(loaderTime);
        setTable(true);
      })
      .catch((e) => console.log(e));
  };

  const amountFormat = (rowData) => {
    let container = document.createElement("div");
    container.innerHTML = rowData.clientCurrencyCode;
    return container.innerHTML;
  };

  const allowExpansion = (rowData) => {
    return rowData.subrows.length >= 0;
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
      amountFormat(rowData) + " " + numberWithCommas(rowData.disbursed_amount)
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
      amountFormat(rowData) + " " + numberWithCommas(rowData.client_amount)
    );
  };

  const paymentStatus = (rowData) => {
    return editRowData.stackId == rowData.stackId ? (
      <div>
        <select onChange={(e) => setSelectedOptionTwo(e.target.value)}>
          {rowData.dropDown.map((item) => {
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
          ? !updatedSelectedRowsData[index].is_billable
          : updatedSelectedRowsData[index].is_billable,
      Payment:
        e.target.id === "dropDown"
          ? e.target.value
          : updatedSelectedRowsData[index].Payment,
    };
    setSelectedRowsData(updatedSelectedRowsData);
  };

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
    setSelectedRows(() => newSelection);
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
            //checked={selectedRows.some(it=>it.stackId === subRowsData[0].id)}
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
      <div title={rowData.comments}>{rowData.comments}</div>
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

  const sendSelectedRowsData = (datas) => {
    let data = selectedRowsData.filter((u) => u.id === datas.stackId);
    const formattedData = data.map((rowData) => ({
      expenseId: rowData.expense_id,
      isBillable: rowData.is_billable == false ? 0 : 1,
      disbursedAmount: parseFloat(rowData.disbursed_amount),
      clientAmmount: parseFloat(rowData.client_amount),
      payment: parseInt(rowData.Payment),
      comments: rowData.comments,
      resId: resourceid,
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
        setSelectedRows([]);
        getData();
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
        getData();
      })
      .catch((error) => console.log(error));
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

  const [documentFail, setDocumentFail] = useState(false);
  const [documentLoader, setDocumentLoader] = useState(false);

  const downloadExpenseStack = async (stackId) => {
    const setLoader = setTimeout(() => {
      setDocumentLoader(true);
    }, 2000);
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
      setDocumentLoader(false);
      setDocumentFail(true);
      setTimeout(() => {
        setDocumentFail(false);
      }, 3000);
    }
    setDocumentLoader(false);
  };

  const actionField = (rowData) => {
    return (
      <>
        <BsFileEarmarkPdf
          size={"1.8em"}
          style={{ color: "#428bca", cursor: "pointer", marginRight: "20px" }}
          onClick={() => downloadExpenseStack(rowData.stackId)}
        />
        {grp3Items[3]?.is_write == true ? (
          <>
            {(rowData.approval == "PM Approved" ||
              rowData.approval == "Approved To Pay") && (
              <AiFillEdit
                size={"1.5em"}
                style={{ cursor: "pointer", marginRight: "-20px" }}
                color="orange"
                onClick={(e) => {
                  setIsEditClicked(false);
                  setEditRowData(rowData);
                  paymentStatus(rowData);
                  setSelectedOptionTwo(Object.keys(rowData.dropDown[0])[0]);
                }}
              />
            )}
          </>
        ) : (
          ""
        )}
      </>
    );
  };

  function ExpensePopup(props) {
    const { popUp, setPopUp, data, totalData } = props;

    const [downloadFail, setDownloadFail] = useState(false);

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
                {downloadFail ? (
                  <div className="statusMsg error">
                    <span>
                      <IoWarningOutline /> Document is not available.
                    </span>
                  </div>
                ) : (
                  ""
                )}
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
                      <div className="col-5 ellipses" title={data.fullName}>
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
                      <div className="col-5 ellipsis" title={data.description}>
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
                        <a
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
                        </a>
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

  const cancelRowEdit = (datas) => {
    const updatedList = selectedRows.filter(
      (item) => item.id !== datas.stackId
    );
    setSelectedRows(updatedList);
    setlist(updatedList);
  };

  const cancelRowEditOuter = () => {
    setIsEditClicked(true);
    setEditRowData({});
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

  const isRowDisabled = (rowData) => (rowData.isEdit ? false : true);

  const rowExpansionTemplate = (data) => {
    return (
      <div className="darkHeader ExpensesMyApprovalRequests-second-table">
        <DataTable
          value={data.subrows}
          className="primeReactDataTable"
          stripedRows
          sortOrder={1}
        >
          {/* {grp3Items[3]?.is_write == true ? ( */}
          <Column
            style={{ textAlign: "center" }}
            header={(rowData, index) =>
              Checkboxheader(rowData, index, data.subrows)
            }
            body={(rowData, index) => Checkbox(rowData, index)}
          />
          {/* ) : (
            ""
          )} */}

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
            body={(rowData) =>
              moment(rowData.expense_date).format("DD-MMM-YYYY")
            }
          />
          <Column sortable field="Payee" header="Payee" />
          <Column
            sortable
            field="is_billable"
            header="Billable"
            style={{ textAlign: "center" }}
            body={isBillable}
          />
          <Column
            sortable
            field="Incurred"
            header="Incurred"
            style={{ textAlign: "right" }}
            body={(rowData) =>
              amountFormat(rowData) + " " + numberWithCommas(rowData.Incurred)
            }
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
            style={{ textAlign: "right" }}
            header="Client"
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
          <Column header="Details" body={viewDetails} />
        </DataTable>
        {dataObject?.is_write == true ? (
          <div style={{ display: "flex", border: "1px solid #ddd" }}>
            <button
              style={{ height: "25px" }}
              className="btn btn-primary ms-1 p-1"
              data-toggle="tooltip"
              title="Save row"
              disabled={
                selectedRowsData.filter((u) => u.id === data.stackId).length ===
                0
              }
              onClick={() => sendSelectedRowsData(data)}
            >
              <FaSave />
            </button>
            <button
              style={{ height: "25px" }}
              className="btn btn-primary ms-1 p-1 cancel"
              data-toggle="tooltip"
              title="Cancel row editing"
              disabled={
                selectedRowsData.filter((u) => u.id === data.stackId).length ===
                0
              }
              onClick={() => cancelRowEdit(data)}
            >
              <ImCross />
            </button>
          </div>
        ) : (
          ""
        )}
        {loaderOne ? "" : ""}
      </div>
    );
  };

  return (
    <div className="expense-my-approval-screen-margin">
      &nbsp;
      {documentLoader ? (
        <Loader handleAbort={() => setDocumentLoader(false)} />
      ) : (
        ""
      )}
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
      {documentFail ? (
        <div className="statusMsg error">
          <span>
            <IoWarningOutline /> Document is not available.
          </span>
        </div>
      ) : (
        ""
      )}
      {table == true ? (
        <div className="customCard darkHeader ExpensesMyApprovalRequests">
          <DataTable
            value={data}
            className="primeReactDataTable"
            showGridlines
            stripedRows
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
          >
            <Column expander={allowExpansion} style={{ width: "5rem" }} />
            <Column
              sortable
              field="stackName"
              header="Stack"
              body={(rowData) => (
                <div title={rowData.stackName}>{rowData.stackName}</div>
              )}
            />
            <Column
              sortable
              field="resource"
              header="Resource"
              body={(rowData) => (
                <div className="ellipsis" title={rowData.resource}>
                  {rowData.resource}
                </div>
              )}
            />
            <Column
              sortable
              field="approval"
              header="Approval Status"
              body={(rowData) => (
                <div title={rowData.approval}>{rowData.approval}</div>
              )}
            />
            <Column
              sortable
              field="payment"
              header="Payment Status"
              body={paymentStatus}
            />
            <Column
              sortable
              field="amt"
              header="Incurred"
              style={{ textAlign: "right" }}
              body={(rowData) => (
                <div
                  title={
                    amountFormat(rowData) + " " + numberWithCommas(rowData.amt)
                  }
                >
                  {amountFormat(rowData) + " " + numberWithCommas(rowData.amt)}
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
                <div title={moment(rowData.createdOn).format("DD-MMM-YYYY")}>
                  {moment(rowData.createdOn).format("DD-MMM-YYYY")}
                </div>
              )}
            />
            <Column
              field=""
              header="Actions"
              style={{ textAlign: "center" }}
              body={actionField}
            />
          </DataTable>

          {dataObject?.is_write == true ? (
            <div className="d-flex justify-content-center mt-2 mb-2">
              <button
                className="btn btn-primary ms-1 p-1"
                data-toggle="tooltip"
                title="Save row"
                onClick={saveRowData}
                disabled={isEditClicked}
              >
                <FaSave />
                Save
              </button>
              <button
                className="btn btn-primary ms-1 p-1"
                data-toggle="tooltip"
                title="Cancel row editing"
                onClick={cancelRowEditOuter}
                disabled={isEditClicked}
              >
                <ImCross size={"11px"} />
                Cancel
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
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
      {loader ? <Loader handleAbort={() => setLoader(false)} /> : ""}
    </div>
  );
}
export default ExpensesMyApprovalRequests;
