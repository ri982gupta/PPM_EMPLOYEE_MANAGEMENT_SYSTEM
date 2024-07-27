import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment";
import Loader from "../../Loader/Loader";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaSave,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import Draggable from "react-draggable";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { environment } from "../../../environments/environment";
import { BsFillCircleFill } from "react-icons/bs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { RiFileExcel2Line } from "react-icons/ri";
import { SlExclamation } from "react-icons/sl";
import { CheckBox, SelectAll } from "@material-ui/icons";
import { BiCheck, BiTrash } from "react-icons/bi";
import ProjectExpensePopOver from "../../ProjectComponent/ProjectExpensePopOver";
import GlobalHelp from "../../PrimeReactTableComponent/GlobalHelp";
import { ImCross } from "react-icons/im";
import { updateExpenseButtonState } from "../../../reducers/SelectedSEReducer";
import { useDispatch } from "react-redux";
import './ExpensesSearch.scss'

function ExpensesSearch(props) {
  const { setCheveronIcon, setVisible, visible, maxHeight1 } = props;
  //const setbtnState = props.setbtnState;
  const currentDate = new Date();
  const initialStartDate = new Date();
  initialStartDate.setMonth(currentDate.getMonth() - 1);
  initialStartDate.setDate(initialStartDate.getDate());
  console.log(initialStartDate);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(new Date());
  const [stateDropdown, setStateDropdown] = useState([]);
  const [paymentDropdown, setPaymentDropdown] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [loader, setLoader] = useState(false);
  const [loaderOne, setLoaderOne] = useState(false);
  const dispatch = useDispatch();
  // const [visible, setVisible] = useState(false);
  // const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    stackName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    resource: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    approval: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    projectCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    projectName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    amt: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    payment: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    disbursedAmt: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    clientAmt: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    createdOn: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [selectedOptionTwo, setSelectedOptionTwo] = useState();
  const [isEditClicked, setIsEditClicked] = useState(true);
  const [editRowData, setEditRowData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [popUpData, setPopUpData] = useState({});
  const [expenseHistory, setExpenseHistory] = useState([]);
  const [popUpLoader, setPopUpLoader] = useState(false);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [resourceId, setResourceId] = useState(0);
  const [isCheckedList, setIsCheckedList] = useState([]);
  const [headerChecked, setHeaderChecked] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [message, setMessage] = useState(false);
  const [count, setCount] = useState(0);

  const loggedUserId = localStorage.getItem("resId");
  const handleAbort = props.handleAbort;
  const baseUrl = environment.baseUrl;
  const urlState = props.urlState;
  const dropdownRef = useRef();
  const HelpPDFName = "SearchExpense.pdf";
  const Headername = "Search Expense Help";
  const navigate = useNavigate();
  const paymentUsers = props.paymentUsers;

  const initialSelectedState = paymentUsers.includes(parseInt(loggedUserId))
    ? [{ label: "PM Approved", value: 628 }]
    : [];
  const initialSelectedPayment = paymentUsers.includes(parseInt(loggedUserId))
    ? [
      { label: "Approved To Pay", value: 631 },
      { label: "Paid", value: 636 },
      { label: "Received", value: 637 },
      { label: "Pending", value: 844 },
    ]
    : [];

  const [selectedState, setSelectedState] = useState(initialSelectedState);
  const [selectedPayment, setSelectedPayment] = useState(
    initialSelectedPayment
  );

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(false);
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Time & Expenses";
  let currentScreenName = ["Expenses", "Search Expense"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 254) + "px"
  );

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) =>
            submenu.display_name !== "Shift Allownaces" &&
            // submenu.display_name !== "Fill Timesheets" &&
            submenu.display_name !== "Project Timesheet (Deprecated)"
        ),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
        }
      });
    });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/projectExpense/expenseReport/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const [dataAccess, setDataAccess] = useState([]);
  console.log(dataAccess);

  const getDocumentsPermission = () => {
    axios({
      method: "GET",
      url:
        baseUrl +
        // `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
        `/CommonMS/master/getBenchMtericsMenus?loggedUserId=${loggedUserId}&Cont=Expense`,
    }).then((resp) => {
      let data = resp.data;
      console.log(data);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) =>
            submenu.display_name !== "Shift Allownaces" &&
            submenu.display_name !== "Lock Timesheets"
        ),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });

      const ExpenseSubMenu = data.find(
        (item) => item.display_name === "Search"
      );

      const accessLevel = ExpenseSubMenu ? ExpenseSubMenu.access_level : null;
      console.log(accessLevel);
      setDataAccess(accessLevel);
    });
  };
  useEffect(() => {
    getDocumentsPermission();
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
    getMenus();
    getUrlPath();
  }, []);

  useEffect(() => {
    getDropdownOptions();
  }, []);

  const getDropdownOptions = () => {
    axios
      .get(baseUrl + `/timeandexpensesms/expensesSearch/dropdowns`)
      .then((res) => {
        let states = [];
        let paymentStates = [];
        res.data.state?.forEach((e) => {
          let stateObj = {
            label: e.lkup_name,
            value: e.id,
          };
          states.push(stateObj);
        });
        res.data.paymentState?.forEach((e) => {
          let paymentObj = {
            label: e.lkup_name,
            value: e.id,
          };
          paymentStates.push(paymentObj);
        });
        setStateDropdown(states);
        setPaymentDropdown(paymentStates);
      })
      .catch((error) => console.log(error));
  };

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

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

  const getExpenseReport = () => {
    const formattedData = {
      state: selectedState.map((item) => item.value).join(","),
      paymentState: selectedPayment.map((item) => item.value).join(","),
      fromDt: moment(startDate).format("YYYY-MM-DD"),
      toDt: moment(endDate).format("YYYY-MM-DD"),
      searchString: searchString,
      userId: loggedUserId,
    };
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios
      .post(
        baseUrl + `/timeandexpensesms/expensesSearch/expenseReport`,
        formattedData
      )
      .then((res) => {
        const res1 = res.data;
        for (let i = 0; i < res1.length; i++) {
          res1[i]["createdOn"] =
            res1[i]["createdOn"] == null
              ? ""
              : moment(res1[i]["createdOn"]).format("DD-MMM-YYYY");
        }
        setData(res1);
        clearTimeout(loaderTime);
        setLoader(false);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getExpenseReport();
  }, []);

  const allowExpansion = (rowData) => {
    return rowData.subrows.length >= 0;
  };

  const onRowExpand = (e) => {
    let cid = e.data.projectId;
    setLoaderOne(false);
    axios
      .get(
        baseUrl +
        `/ProjectMS/projectExpenses/stackExpenses?stackId=${e.data.stackId}&userId=${loggedUserId}&raisedBy=${e.data.raised_by}&projectId=${cid}&statusId=${e.data.status_id}`
      )
      .then((res) => {
        data.find((u) => u.stackId === e.data.stackId).subrows = res.data;
        setLoaderOne(false);
      })
      .catch((error) => console.log(error));
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleOnExport = () => {
    const labels = {
      stackName: "Stack",
      resource: "Resource",
      approval: "Approval Status",
      payment: "Payment Status",
      projectName: "Project",
      projectCode: "Project Code",
      amt: "Incurred",
      disbursedAmt: "Disbursed",
      clientAmt: "Client",
      createdOn: "Created On",
    };

    const dataInTable = data.map((item) => {
      const row = {};
      Object.keys(labels).forEach((key) => {
        row[labels[key]] = item[key];
      });
      return row;
    });

    const ExcelJS = require("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("ExpenseReport");

    const headerRow = worksheet.addRow(Object.values(labels));
    headerRow.font = { bold: true };

    dataInTable.forEach((rowData) => {
      worksheet.addRow(Object.values(rowData));
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAsExcelFile(buffer, "ExpenseReport.xlsx");
    });
  };

  const addCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const blobData = new Blob([buffer], { type: "application/octet-stream" });
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(blobData, fileName);
    } else {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blobData);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    }
  };

  const paymentStatus = (rowData) => {
    return editRowData.stackId === rowData.stackId &&
      paymentUsers.includes(parseInt(loggedUserId)) ? (
      <div>
        <select
          value={selectedOptionTwo}
          onChange={(e) => setSelectedOptionTwo(e.target.value)}
        >
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
      <div title={rowData.payment}>{rowData.payment}</div>
    );
  };

  const approvalStatus = (rowData) => {
    return editRowData.stackId === rowData.stackId &&
      !paymentUsers.includes(parseInt(loggedUserId)) ? (
      <div>
        <select
          value={selectedOptionTwo}
          onChange={(e) => setSelectedOptionTwo(e.target.value)}
        >
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
      <div title={rowData.approval}>{rowData.approval}</div>
    );
  };

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
          style={{
            color: "#428bca",
            marginRight: "10px",
            marginLeft: "-10px",
            cursor: "pointer",
          }}
          onClick={() => downloadExpenseStack(rowData.stackId)}
        />
        {(paymentUsers.includes(parseInt(loggedUserId)) &&
          (rowData.approval === "PM Approved" ||
            rowData.approval === "Approved To Pay")) ||
          (!paymentUsers.includes(parseInt(loggedUserId)) &&
            !rowData.subrows.length > 0 &&
            rowData.approval === "Submitted") ? (
          <AiFillEdit
            size={"1.5em"}
            style={{ cursor: "pointer", marginRight: "-15px" }}
            color="orange"
            onClick={(e) => {
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

  const cancelRowEditOuter = () => {
    setIsEditClicked(true);
    setEditRowData({});
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
                        title={totalData
                          .filter((d) => d.stackId === data.id)
                          .map((d) => d.projectName)}
                      >
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
                          : data.Payment}{" "}
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
                          <div
                            className="col-5"
                            title={
                              d.comments == "" || d.comments == null
                                ? "NA"
                                : d.comments
                            }
                          >
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
                className="btn btn-primary mx-auto"
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
    ) : rowData.is_billable == false || rowData.is_billable == null ? (
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
  console.log(paymentUsers?.includes(parseInt(loggedUserId)));
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
      <div title={rowData.comments} className="ellipsis">
        {rowData.comments}
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
          ? !updatedSelectedRowsData[index].is_billable
          : updatedSelectedRowsData[index].is_billable,
      Payment:
        e.target.id === "dropDown"
          ? e.target.value
          : updatedSelectedRowsData[index].Payment,
    };
    setSelectedRowsData(updatedSelectedRowsData);
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
        setSelectedRows([]);
        getExpenseReport();
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
        getExpenseReport();
      })
      .catch((error) => console.log(error));
  };

  const cancelRowEdit = (datas) => {
    const updatedList = selectedRows.filter(
      (item) => item.id !== datas.stackId
    );
    setSelectedRows(updatedList);
    setlist(updatedList);
  };

  const handleSelection = (e) => {
    setSelectedRows(e.value);
  };

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const isRowDisabled = (rowData) => (rowData.isEdit ? false : true);

  const rowExpansionTemplate = (data) => {
    return (
      <>
        {loaderOne ? <Loader handleAbort={() => setLoaderOne(false)} /> : ""}
        <div className="ExpensesSearch-second-table">
          <DataTable
            value={data.subrows}
            className="primeReactDataTable"
            stripedRows
            sortOrder={1}
          >
            {/* {(dataAccess === 1000 || dataAccess === 250) && ( */}
            <Column
              style={{ textAlign: "center" }}
              header={(rowData, index) =>
                Checkboxheader(rowData, index, data.subrows)
              }
              body={(rowData, index) => Checkbox(rowData, index)}
            />
            {/* )} */}
            <Column
              sortable
              field=""
              header="Name"
              body={(rowData) => (
                <div
                  title={
                    data.stackId === rowData.id
                      ? `${data.projectName}(${data.projectCode})`
                      : ""
                  }
                  className="ellipsis"
                >
                  {data.stackId === rowData.id
                    ? `${data.projectName}(${data.projectCode})`
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
                  style={{ textAlign: "center" }}
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
        </div>

        {/* {(dataAccess === 1000 || dataAccess === 250) && ( */}
        <div style={{ display: "flex", border: "1px solid #ECF0F1" }}>
          <button
            style={{ height: "25px" }}
            className="btn btn-primary"
            data-toggle="tooltip"
            title="Save row"
            disabled={
              selectedRowsData.filter((u) => u.id === data.stackId).length === 0
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
              selectedRowsData.filter((u) => u.id === data.stackId).length === 0
            }
            onClick={() => cancelRowEdit(data)}
          >
            <ImCross />
          </button>
        </div>
        {/* )} */}
      </>
    );
  };

  return (
    <div>
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
      <>
        <div className="float-end my-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/stackView")}
            title="View"
          >
            Stack View
          </button>
        </div>
        <div className="group mb-3 customCard">
          <div className="col-md-12 collapseHeader"></div>
          <CCollapse visible={!visible}>
            <div className="group-content row ">
              <div className="col-md-12 mb-2">
                <div className="form-group row">
                  <label className="col-3">
                    Search String
                    <p style={{ fontWeight: "100" }}>
                      (Searches in stack name, project and resource)
                    </p>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-8">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      onChange={(e) => setSearchString(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="country-select">
                    Approval Workflow
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="roleTypes"
                      options={stateDropdown}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedState}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => setSelectedState(e)}
                      disabled={false}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="country-select">
                    Payment Workflow
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="roleTypes"
                      options={paymentDropdown}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedPayment}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => setSelectedPayment(e)}
                      disabled={false}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-2 mt-1">
                <div className="form-group row ">
                  <label className="col-5" htmlFor="email-input">
                    From Date
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="dd-MMM-yyyy"
                      placeholderText={"Billing Start Date"}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      maxDate={endDate}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2 mt-1">
                <div className="form-group row ">
                  <label className="col-5" htmlFor="email-input">
                    To Date
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <DatePicker
                      selected={endDate}
                      dateFormat="dd-MMM-yyyy"
                      onChange={(date) => setEndDate(date)}
                      placeholderText={"Billing Start Date"}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      minDate={startDate}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 col-sm-12 col-xs-12 d-flex align-items-center justify-content-center no-padding center">
                <button
                  type="button"
                  className="btn btn-primary"
                  title="Search"
                  onClick={() => getExpenseReport()}
                >
                  <FaSearch /> Search{" "}
                </button>
              </div>
            </div>
          </CCollapse>
        </div>
        <div
          style={{
            border: " 1px solid #fff",
            borderRadius: "5px",
            margin: " 5px 0",
            padding: "2px",
            backgroundColor: "rgba(215, 174, 9, 0.1)",
            borderColor: "#d7ae09",
            color: "#d7ae09",
            alignItems: "center",
            gap: "2px",
            fontSize: "13px",
          }}
        >
          <span className="bold">
            <SlExclamation /> Note : <br />
          </span>
          <div>
            <li style={{ marginLeft: "20px" }}>
              Hover mouse on expense name to view description.
            </li>
            <li style={{ marginLeft: "20px" }}>
              To change status expand the Stack and select checkbox.
            </li>
          </div>
        </div>
        <div>
          <div className="group customCard">
            <div className="group-content row">
              <div className="col-md-12">
                <div className="flex justify-content-end m-2">
                  <label>Search &nbsp;:&nbsp; </label>
                  <input
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                  />
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    cursor="pointer"
                    style={{
                      color: "green",
                      marginLeft: "10px",
                      marginRight: "-10px",
                    }}
                    onClick={handleOnExport}
                  />
                </div>
                <div className="darkHeader Expense-Search">
                  <DataTable
                    value={data}
                    className="primeReactDataTable "
                    showGridlines
                    stripedRows
                    expandedRows={expandedRows}
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    onRowExpand={onRowExpand}
                    rowExpansionTemplate={rowExpansionTemplate}
                    filters={filters}
                    globalFilterFields={[
                      "stackName",
                      "resource",
                      "approval",
                      "projectCode",
                      "projectName",
                      "amt",
                      "payment",
                      "disbursedAmt",
                      "clientAmt",
                      "createdOn",
                    ]}
                    emptyMessage="No Expenses"
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
                    <Column
                      expander={allowExpansion}
                      style={{ width: "5rem" }}
                    />
                    <Column
                      sortable
                      field="stackName"
                      header="Stack"
                      body={(rowData) => (
                        <div title={rowData.stackName}>
                          <Link
                            data-toggle="tooltip"
                            title={rowData.stackName}
                            to={`/expense/Create/${rowData.stackId}`}
                            target="_blank"
                            className="linkSty"
                            onClick={() => {
                              //navigate(`/expense/Create/${rowData.stackId}`);
                              //setbtnState("Create");
                              dispatch(updateExpenseButtonState("Create"));
                            }}
                          >
                            {rowData.stackName}
                          </Link>
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
                      field="amt"
                      header="Incurred"
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
                          style={{ textAlign: "center" }}
                          title={moment(rowData.createdOn).format(
                            "DD-MMM-yyyy"
                          )}
                        >
                          {moment(rowData.createdOn).format("DD-MMM-yyyy")}
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
                </div>
                {/* {(dataAccess === 1000 || dataAccess === 250) && ( */}
                <div style={{ display: "flex", border: "1px solid #ECF0F1" }}>
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
                    <ImCross fontSize={"11px"} />
                    Cancel
                  </button>
                </div>
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      </>
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
      {documentLoader ? (
        <Loader handleAbort={() => setDocumentLoader(false)} />
      ) : (
        ""
      )}
    </div>
  );
}

export default ExpensesSearch;
