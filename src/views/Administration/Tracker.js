import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";
import Loader from "../Loader/Loader";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import TrackerCollapsibleTable from "./TrackerCollapsibleTable";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import "./Tracker.scss";
import {
  FaSearch,
  FaCaretDown,
  FaChevronCircleUp,
  FaChevronCircleDown,
} from "react-icons/fa";
import TrackerResCollapsibleTable from "./TrackerResCollapsibleTable";
import { CCollapse } from "@coreui/react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import TrackerAllResCollapsibleTable from "./TrackerAllResCollapsibleTable";
export default function Tracker() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [ToDate, setToDate] = useState(null);
  const [depData, setDepData] = useState("");
  const [data, setData] = useState({});
  const [isShow, setIsShow] = useState(false);
  const [hideContents, setHideContents] = useState(false);

  const [resisShow, setResIsShow] = useState(false);
  const [openhtml, setOpenhtml] = useState(false);
  const [openhtmlRes, setOpenhtmlRes] = useState(false);
  const [issueDetails, setIssueDetails] = useState([]);
  const [selectType, setSelectType] = useState("All Reportees");
  const [details, setDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const [resourceId, setResourceId] = useState([]);
  const [shoeAbbr, setShowAbbr] = useState(false);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const ref = useRef([]);
  const dates = {
    fromDate: moment().format("YYYY-MM-DD"),
    toDate: moment().add("days", 0).format("YYYY-MM-DD"),
  };
  const [dt, setDt] = useState(dates);
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);
    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  const abortController = useRef(null);
  const [routes, setRoutes] = useState([]);

  let textContent = "Teams";
  let currentScreenName = ["Tracker"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const [expandandCollapse, setExpandandCollapse] = useState(false);

  const getData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        // `/administrationms/tracker/loggedUserId?userId=${
        //   parseInt(loggedUserId) + 1
        // }`,
        `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      res.push({ id: 9999, name: "<<ALL>>", user_id: "" });
      setIssueDetails(res);
    });
  };
  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/administrationms/tracker/getnames`,
    });
    let departments = resp.data;
    setDepartments(departments);
    setSelectedDepartments(departments.filter((ele) => ele.value != 0));
    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 0) {
        filteredDeptData.push(data.value);
      }
    });
    setDepData((prevVal) => ({
      ...prevVal,
      ["screenName"]: filteredDeptData,
    }));
  };
  const curDate = dt.toDate;
  const getPageviewcountdetails = (dt) => {
    let valid = GlobalValidation(ref);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setLoader(false);
    const date = curDate;
    const date1 = dt == undefined ? date : dt;
    axios({
      method: "post",
      url: baseUrl + `/administrationms/tracker/getpageviewcountdetails`,
      data: {
        screenName: "[" + depData + "]",
        dateStr: date1,
        loggedUser: parseInt(loggedUserId) + 1,
        reportType: selectType,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        let detail = res.data.tableData;
        let fdata = res.data;
        let columnsArray = fdata.columns.split(",");
        const columnIndexToRemove = columnsArray.indexOf("user_id");
        if (columnIndexToRemove !== -1) {
          columnsArray.splice(columnIndexToRemove, 1);
        }
        fdata.columns = columnsArray.join(",");
        fdata.tableData.forEach((rowData) => {
          for (const key in rowData) {
            if (rowData[key] === null) {
              rowData[key] = 0;
            }
          }
        });
        fdata.tableData.forEach((rowData) => {
          if (rowData.BusinessUnit === 0) {
            rowData.BusinessUnit = "NA";
          }
          if (rowData.Supervisor === 0) {
            rowData.Supervisor = "NA";
          }
        });

        setDetails(detail);
        setData(fdata);
        setLoader(false);
        clearTimeout(loaderTime);
        setIsShow(true);
        {
          hideContents === true && !valid && setVisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        }
      })
      .then((error) => {});
  };
  const [resourcedate, setResourceDate] = useState(new Date());
  let formattedMonth = moment(resourcedate).format("yyyy-MM-01");
  const datesFirst = {
    fromDate: moment(formattedMonth).startOf("month").format("YYYY-MM-01"),
    toDate: moment(formattedMonth)
      .startOf("month")
      .add("month", 0)
      .format("YYYY-MM-01"),
  };
  const [day, setDay] = useState(datesFirst);

  const getPageResViewCount = (dt) => {
    let valid = GlobalValidation(ref);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setLoader(false);
    const date = moment(new Date()).format("YYYY-MM-01");
    const date1 = dt == undefined ? date : dt;

    axios({
      method: "post",
      url: baseUrl + `/administrationms/tracker/GetPageResViewCount`,
      data: {
        resId: resourceId.resId,
        screenName: "[" + depData + "]",
        selectedDate: date1,
        UserId: resourceId.resId + parseInt(1),
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        let detail = res.data.tableData;
        let fdata = res.data;
        let columnsArray = fdata.columns.split(",");
        const columnIndexToRemove = columnsArray.indexOf("user_id");
        if (columnIndexToRemove !== -1) {
          columnsArray.splice(columnIndexToRemove, 1);
        }
        fdata.columns = columnsArray.join(",");
        fdata.tableData.forEach((rowData) => {
          for (const key in rowData) {
            if (rowData[key] === null) {
              rowData[key] = 0;
            }
          }
        });
        fdata.tableData.forEach((rowData) => {
          if (rowData.BusinessUnit === 0) {
            rowData.BusinessUnit = "NA";
          }
          if (rowData.Supervisor === 0) {
            rowData.Supervisor = "NA";
          }
        });
        setDetails(detail);
        setData(fdata);
        setLoader(false);
        clearTimeout(loaderTime);
        setResIsShow(true);
        {
          hideContents === true && !valid && setVisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        }
      })
      .then((error) => {});
  };
  const [AllResIsShow, setAllResIsShow] = useState(false);
  const getAllResPageCountTmp = (dt) => {
    let valid = GlobalValidation(ref);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setLoader(false);
    const date = moment(new Date()).format("YYYY-MM-01");
    const date1 = dt == undefined ? date : dt;
    axios({
      method: "post",
      url: baseUrl + `/administrationms/tracker/getAllResPageCount`,
      data: {
        screenName: "[" + depData + "]",
        selectedDate: date1,
        UserId: loggedUserId,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        let detail = res.data.tableData;
        let fdata = res.data;
        let columnsArray = fdata.columns.split(",");
        const columnIndexToRemove = columnsArray.indexOf("user_id");
        if (columnIndexToRemove !== -1) {
          columnsArray.splice(columnIndexToRemove, 1);
        }
        fdata.columns = columnsArray.join(",");
        fdata.tableData.forEach((rowData) => {
          for (const key in rowData) {
            if (rowData[key] === null) {
              rowData[key] = 0;
            }
          }
        });
        fdata.tableData.forEach((rowData) => {
          if (rowData.BusinessUnit === 0) {
            rowData.BusinessUnit = "NA";
          }
          if (rowData.Supervisor === 0) {
            rowData.Supervisor = "NA";
          }
        });
        setDetails(detail);
        setData(fdata);
        setLoader(false);
        clearTimeout(loaderTime);
        setAllResIsShow(true);
        setLoader(false);
        {
          hideContents === true && !valid && setVisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        }
      })
      .then((error) => {});
  };
  useEffect(() => {}, [data]);

  const handleChangedata = (e) => {
    const { id, value } = e.target;
    setSelectType(value);
    setHideContents(true);
  };
  useEffect(() => {
    if (
      selectType == "All Reportees" ||
      selectType == "Direct Reportees" ||
      selectType == "InDirect Reportees" ||
      selectType == "Resource Search"
    ) {
      let deptData = selectedDepartments
        .map((d) => d.label)
        .reduce(
          (accumulator, currentValue, index) =>
            index == 0
              ? "'" + currentValue + "'"
              : accumulator + ",'" + currentValue + "'",
          initialValue
        );
      setDepData(deptData);
      setHideContents(true);
    }
  }, [selectType, selectedDepartments]);
  const initialValue = {
    screenName: "",
  };
  const [errorMsg, setErrorMsg] = useState(false);

  const handleClick = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
      }
      return;
    }
    if (selectType == "Resource Search" && resourceId.resId != 9999) {
      setHideContents(true);

      getPageResViewCount();

      setAllResIsShow(false);
      setIsShow(false);

      setOpenhtml(false);
    } else if (
      selectType == "All Reportees" ||
      selectType == "Direct Reportees" ||
      selectType == "InDirect Reportees"
    ) {
      setHideContents(true);

      getPageviewcountdetails();

      setResIsShow(false);
      setAllResIsShow(false);
      setOpenhtmlRes(false);
    } else if (resourceId.resId === 9999) {
      getAllResPageCountTmp();
      setHideContents(true);

      setIsShow(false);
      setResIsShow(false);
      setOpenhtmlRes(false);
    }
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/resource/usageReport&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };
  useEffect(() => {
    getDepartments();
    getData();
    getUrlPath();
  }, []);
  const addHandler = () => {
    setOpenhtml(false);

    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate).add("days", 1).format("YYYY-MM-DD"),
    }));
    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).add("days", 1).format("YYYY-MM-DD"),
    }));
    const date = moment(dt.toDate).add("days", 1).format("YYYY-MM-DD");
    getPageviewcountdetails(date);
  };
  const subtracHandler = () => {
    setOpenhtml(false);
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate)
        .subtract("days", 1)
        .format("YYYY-MM-DD"),
    }));
    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).subtract("days", 1).format("YYYY-MM-DD"),
    }));
    const date = moment(dt.toDate).subtract("days", 1).format("YYYY-MM-DD");
    getPageviewcountdetails(date);
  };
  const addHandler1 = () => {
    setOpenhtmlRes(false);

    const newFromDate = moment(day.fromDate)
      .add(1, "month")
      .format("YYYY-MM-01");
    const newToDate = moment(newFromDate).endOf("month").format("YYYY-MM-01");
    setDay({
      fromDate: newFromDate,
      toDate: newToDate,
    });
    const date = moment(newFromDate).endOf("month").format("YYYY-MM-01");

    getPageResViewCount(date);
  };

  const AllResaddHandler1 = () => {
    setAllResIsShow(false);
    const newFromDate = moment(day.fromDate)
      .add(1, "month")
      .format("YYYY-MM-01");
    const newToDate = moment(newFromDate).endOf("month").format("YYYY-MM-01");
    setDay({
      fromDate: newFromDate,
      toDate: newToDate,
    });
    const date = moment(newFromDate).endOf("month").format("YYYY-MM-01");

    getAllResPageCountTmp(date);
  };
  const subtracHandler1 = () => {
    const newFromDate = moment(day.fromDate)
      .subtract(1, "month")
      .format("YYYY-MM-01");
    const newToDate = moment(newFromDate).endOf("month").format("YYYY-MM-01");
    setDay({
      fromDate: newFromDate,
      toDate: newToDate,
    });
    const date = moment(newFromDate).endOf("month").format("YYYY-MM-01");

    getPageResViewCount(date);
  };
  const AllRessubtracHandler1 = () => {
    setAllResIsShow(false);
    const newFromDate = moment(day.fromDate)
      .subtract(1, "month")
      .format("YYYY-MM-01");
    const newToDate = moment(newFromDate).endOf("month").format("YYYY-MM-01");
    setDay({
      fromDate: newFromDate,
      toDate: newToDate,
    });
    const date = moment(newFromDate).endOf("month").format("YYYY-MM-01");

    getAllResPageCountTmp(date);
  };
  const handleClear2 = () => {
    setResourceId((prev) => ({ ...prev, resId: "" }));
    setHideContents(true);
  };
  useEffect(() => {}, [day.toDate, dt]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [thresholdData, setThresholdData] = useState([]);
  const handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    const regex = /^[0-9]*$/;
    if (!regex.test(keyValue)) {
      e.preventDefault();
    }
  };
  const Abbrivations = [
    { code: "AUR", description: "Add User Role" },
    { code: "Allocation DB", description: "Allocation Dashboard" },
    { code: "Audit CP Setup", description: "Audit CP Setup" },
    { code: "Bank Details", description: "Bank Details" },
    { code: "BA", description: "Bench Analysis" },
    { code: "BR", description: "Bench Report" },
    {
      code: "Billable Utilization Trend",
      description: "Billable Utilization Trend",
    },
    { code: "Calendars", description: "Calendars" },

    { code: "CP", description: "Capacity Plan" },
    { code: "Common Comp", description: "Common Components" },
    { code: "Competency DB", description: "Competency Dashboard" },
    { code: "Contract Documents", description: "Contract Documents" },
    { code: "Contractor Costs", description: "Contractor Costs" },
    { code: "CSAT", description: "CSAT" },
    { code: "CSAT Survey Questions", description: "CSAT Survey Questions" },
    { code: "Custom DB", description: "Custom Dashboard" },
    { code: "Customer Account Plan", description: "Customer Account Plan" },
    { code: "CC", description: "Customer Create" },
    { code: "CustOverview", description: "Customer Overview" },
    { code: "CD", description: "Customer Documents" },
    { code: "CS", description: "Customer Search" },
    { code: "CE", description: "Customer Edit" },
    { code: "CEng", description: "Customer Engagements" },
    { code: "Customer Financials", description: "Customer Financials" },
    { code: "Customer Initiatives", description: "Customer Initiatives" },
    { code: "CSH", description: "Customer Search History" },
    { code: "Customer Projects", description: "customer Projects" },
    { code: "qbr", description: "Customer QBR" },
    { code: "Expense Create", description: "Expense Create" },
    { code: "Expense Search", description: "Expense Search" },
    { code: "CustGMA", description: "Customer Gross Margin Analysis" },

    {
      code: "Customer Relationship Heatmap",
      description: "Customer Relationship Heatmap",
    },
    { code: "CR", description: "Customer Risks" },
    { code: "Customer Technology", description: "Customer Technology" },
    { code: "Customers", description: "Customers" },
    { code: "Resource Approvals", description: "Resource Approvals" },

    { code: "DS", description: "Demand & Supply" },
    { code: "Engagement Allocations", description: "Engagement Allocations" },
    { code: "EC", description: "Engagement Create" },
    { code: "ES", description: "Engagement Search" },
    { code: "ED", description: "Engagement Details" },
    { code: "EngSH", description: "Engagement Search History" },
    { code: "Engagements", description: "Engagements" },
    { code: "EO", description: "Engagements Overview" },
    { code: "EE", description: "Engagements Edit" },
    { code: "EP", description: "Engagements Projects" },
    { code: "Error Logs", description: "Error Logs" },
    { code: "Vendor Overview", description: "Vendor Overview" },

    {
      code: "Add Foreign Exchange Value",
      description: "Add Foreign Exchange Value Create",
    },
    {
      code: "View Foreign Exchange Rates",
      description: "View Foreign Exchange Rates",
    },

    { code: "Expense Search", description: "Expense Search" },
    { code: "Expense Types", description: "Expense Types" },
    { code: "ExpSH", description: "Expense Search History" },

    { code: "VFER", description: "View Foreign Exchange Rates" },
    { code: "Fill Timesheets", description: "Fill Timesheets" },
    { code: "ExpenseTS", description: "Expnese Timesheets" },
    { code: "Trending", description: "Trending" },
    { code: "Historical", description: "Historical" },

    { code: "FPR", description: "Financial Plan and Review" },
    { code: "Fixed Price - Create", description: "Fixed Price - Create" },
    { code: "Fixed Price - Open", description: "Fixed Price - Open" },
    { code: "FS", description: "Forecast and Supply" },
    { code: "Generate", description: "Generate Invoice" },
    { code: "GR", description: "GMA Report" },
    { code: "HC&MT", description: "Headcount & Margins Trend" },
    { code: "h & f", description: "Header & Footer" },
    { code: "Hierarchy", description: "Hierarchy" },
    { code: "IS", description: "Inside Sales" },
    { code: "Investment", description: "Investment" },
    { code: "Invoice Details", description: "Invoice Details" },
    { code: "IO", description: "Invoice Open" },
    { code: "ISS", description: "Invoice Services" },
    { code: "Jobs Daily Status", description: "Jobs Daily Status" },
    { code: "Lock Timesheets", description: "Lock Timesheets" },
    {
      code: "Monthly PR Changes by Day",
      description: "Monthly PR Changes by Day",
    },
    { code: "MRF", description: "Monthly Revenue Forecast" },
    { code: "roleGrid", description: "roleGrid" },
    { code: "Resource Skills", description: "Resource Skills" },
    { code: "Stakeholder Mapping", description: "Stakeholder Mapping" },

    { code: "Monthly Revenue Trend", description: "Monthly Revenue Trend" },
    { code: "MD", description: "My Dashboard" },
    { code: "NBW", description: "NB Work - 4 Prev. Weeks" },
    { code: "NPS", description: "NPS" },
    { code: "PCQA DB", description: "PCQA Dashboard" },
    { code: "PC", description: "Practice Calls" },
    { code: "Profile", description: "Profile" },
    { code: "Project Accomplishments", description: "project Accomplishments" },
    { code: "Project Audit log", description: "project Audit log" },
    { code: "Project Baselines", description: "project Baselines" },
    {
      code: "Project Contract Documents",
      description: "project Contract Documents",
    },
    { code: "Project Create", description: "Project Create" },
    { code: "Project Defects", description: "project Defects" },
    { code: "Project Dependencies", description: "project Dependencies" },
    { code: "Project Documents", description: "project documents" },
    { code: "Project Edit", description: "project edit" },
    { code: "Project Events", description: "project Events" },
    { code: "Project Expenses", description: "project Expenses" },
    { code: "PrjHealth", description: "Project Health" },
    { code: "Project Hierarchy", description: "project hierarchy" },
    { code: "Project Issues", description: "project issues" },
    { code: "Project Milestones", description: "project Milestones" },
    { code: "Project Overview", description: "project overview" },
    { code: "qcr", description: "qcr" },
    { code: "Project review log", description: "project review log" },
    { code: "Project Reviews", description: "project Reviews" },
    { code: "PR", description: "project Risks" },
    { code: "SC&HI", description: "Scope Change and History Indicator" },
    { code: "PSH", description: "Projects Search History" },
    { code: "Project Stakeholders", description: "project stakeholders" },
    { code: "GD", description: "Global Dashboard" },
    {
      code: "Project Timesheet (Deprecated)",
      description: "Project Timesheet (Deprecated)",
    },
    { code: "Projector AES", description: "Projector AES" },
    { code: "Projects", description: "Projects" },
    { code: "Pyramid Index", description: "Pyramid Index" },
    { code: "QMS", description: "QMS" },
    { code: "RO", description: "Resource Overview" },
    { code: "Resource Request", description: "Resource Request" },
    { code: "RT", description: "Resource Trending" },
    { code: "Resource View List", description: "Resource View List" },
    { code: "Revenue", description: "Revenue" },
    { code: "RMA", description: "Revenue & Margin Analysis" },
    { code: "RMV", description: "Revenue And Margin Variance" },
    { code: "RAM", description: "Revenue Attainment Metrics" },
    { code: "NPS Survey Questions", description: "NPS Survey Questions" },

    {
      code: "Recognized Revenue By Industry",
      description: "Recognized Revenue By Industry",
    },
    { code: "RP", description: "Revenue Projections" },
    { code: "TR", description: "Target Reviews" },
    { code: "Forecast", description: "RMG Forecast" },
    { code: "Role Appr", description: "Role Approvals" },
    { code: "Bench Report", description: "Bench Report" },
    { code: "Roll Offs", description: "Roll Offs" },
    { code: "Teams Open", description: "Teams Open" },

    { code: "Role Costs", description: "Role Costs" },
    { code: "Role Grid", description: "Role Grid" },
    { code: "Role Mapping", description: "Role Mapping" },
    { code: "Role View", description: "Role View" },
    { code: "Roles Permissions", description: "Roles Permissions" },
    { code: "ROff", description: "RollOff" },
    { code: "S/W- PR", description: "S/W Plan and Review" },
    { code: "Oppt", description: "Sales - Opportunities" },
    { code: "SPM", description: "Sales Performance" },
    { code: "Sales Permissions", description: "Sales Permissions" },
    { code: "SPT", description: "Sales Pipeline Trending" },
    { code: "SSC", description: "Sales ScoreCard" },
    { code: "SSO", description: "Sales Solutions" },
    { code: "Saved Searches", description: "Saved Searches" },
    { code: "Search", description: "Search" },
    { code: "SPR", description: "Services Plan and Review" },
    { code: "Shift Allowances", description: "Shift Allowances" },
    { code: "Skills", description: "Skills" },
    { code: "Solution Mapping", description: "Solution Mapping" },
    { code: "Subk-CT", description: "Subk Conversion Trend" },
    { code: "T&M", description: "T&M - Open" },
    { code: "TP", description: "Task Plan" },
    { code: "Teams Search History", description: "Teams Search History" },
    { code: "Timesheet", description: "Timesheet" },
    { code: "Tracker", description: "Tracker" },
    { code: "TSA", description: "Tracker Screens Adder" },
    { code: "UBR", description: "Update Billing Rate" },
    { code: "UBS", description: "Update Billing Status" },
    { code: "UTS", description: "Update Task Status" },
    { code: "Upload", description: "Upload" },
    { code: "Upload Resource Fte", description: "Upload Resource Fte" },
    { code: "Upload Role Costs", description: "Upload Role Costs" },
    { code: "Utilisation - FY", description: "Utilisation - FY" },
    { code: "Vendor Create", description: "Vendor Create" },
    { code: "Accounting", description: "Accounting" },

    { code: "Vendor Dashboard", description: "Vendor Dashboard" },
    { code: "Vendor Documents", description: "Vendor Documents" },
    { code: "Create Project", description: "Create Project" },
    { code: "Project Search", description: "Project Search" },
    { code: "Project Reviews", description: "Project Reviews" },
    { code: "Admin Fill TS", description: "Admin Fill TimeSheet" },
    { code: "Reports", description: "Reports" },

    { code: "VE", description: "Vendor Edit" },
    { code: "VSH", description: "Vendor Search History" },
    { code: "Vp", description: "Vendor Performance" },
    { code: "VR", description: "Vendor Resources" },
    { code: "Vendor Reviews", description: "Vendor Reviews" },
    { code: "Vendor Search", description: "Vendor Search" },
    { code: "V&U", description: "View And Upload" },
    { code: "jobsdailystatus", description: "jobsdailystatus" },

    { code: "Management", description: " VMG-Management" },
    { code: "Performance", description: "VMG-Performance" },
    { code: "WPP", description: "Weekly Pipeline Progress" },
  ];
  const itemsPerPage = 25;
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const pageCount = Math.ceil(details.length / itemsPerPage);
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, details.length);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = details.slice(startIndex, endIndex);

  const paginationButtons = [];
  for (let i = 0; i < pageCount; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={i === currentPage ? "active" : ""}
      >
        {i + 1}
      </button>
    );
  }
  const hasNextPage = currentPage < pageCount - 1;
  const hasPrevPage = currentPage > 0;
  const handlePrevPage = () => {
    if (hasPrevPage) {
      handlePageChange(Math.max(currentPage - 1, 0));
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      handlePageChange(Math.min(currentPage + 1, pageCount - 1));
    }
  };
  return (
    <div>
      <div>
        {errorMsg ? (
          <div className="statusMsg error">
            <IoWarningOutline /> Please select the valid values for highlighted
            fields
          </div>
        ) : (
          ""
        )}
        <div className="col-md-12">
          <div className="pageTitle">
            <div className="childOne"></div>
            <div className="childTwo">
              <h2>Tracker</h2>
            </div>
            <div className="childThree toggleBtns">
              <button
                className="searchFilterButton btn btn-primary"
                onClick={() => {
                  setVisible(!visible);

                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                Search Filters
                <span className="serchFilterText">{cheveronIcon}</span>
              </button>
            </div>
          </div>
        </div>
        <div className="group mb-3 customCard">
          <div className="col-md-12 collapseHeader"></div>
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-3 ">
                <div className="form-group row">
                  <label
                    className="col-5 tracker-screen-filter"
                    htmlFor="ResourceType"
                  >
                    Resource Type&nbsp;
                    <span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      id="SelectType"
                      name="SelectType"
                      onChange={handleChangedata}
                    >
                      <option value="All Reportees">All Reportees</option>
                      <option value="Direct Reportees">Direct Reportees</option>
                      <option value="InDirect Reportees">
                        InDirect Reportees
                      </option>
                      <option value="Resource Search">Resource Search</option>
                    </select>
                  </div>
                </div>
              </div>
              {selectType == "Resource Search" ? (
                <div className=" col-md-6">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="text-input-inline">
                      Resource&nbsp;
                      <span className="col-1 p-0 error-text">*</span>
                    </label>
                    <span className="col-1 p-0" style={{ marginLeft: "-98px" }}>
                      :
                    </span>
                    <div className="col-6">
                      <div
                        className="autocomplete"
                        ref={(ele) => {
                          ref.current[0] = ele;
                        }}
                      >
                        <div className=" autoComplete-container">
                          <ReactSearchAutocomplete
                            items={issueDetails}
                            type="Text"
                            name="resId"
                            id="resId"
                            issueDetails={issueDetails}
                            onClear={handleClear2}
                            className="AutoComplete"
                            placeholder="Type minimum 3 characters"
                            onSelect={(e) => {
                              setResourceId((prevProps) => ({
                                ...prevProps,
                                resId: e.id,
                              }));
                              setHideContents(true);
                            }}
                            showIcon={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className=" col-md-3 ">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Date">
                      Date&nbsp;<span className="col-1 p-0 error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6 tracker-date-picker">
                      <DatePicker
                        name="Date"
                        selected={ToDate}
                        id="Date"
                        dropdownMode="select"
                        className="err cancel"
                        dateFormat="dd-MMM-yyyy"
                        value={moment(dt.toDate).format("DD-MMM-YYYY")}
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        onChange={(e) => {
                          setDt((prev) => ({
                            ...prev,
                            ["toDate"]: moment(e).format("YYYY-MM-DD"),
                          }));
                          setHideContents(true);
                        }}
                        autoComplete="false"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className=" col-md-3 ">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Screen">
                    Screen&nbsp;<span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <div
                      className="multiselect"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        id="screenName"
                        ArrowRenderer={ArrowRenderer}
                        options={departments}
                        hasSelectAll={true}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedDepartments}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedDepartments(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.label);
                          });
                          setDepData((prevVal) => ({
                            ...prevVal,
                            ["screenName"]: filteredValues.toString(),
                          }));
                          setHideContents(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {selectType == "Resource Search" ? (
                <div className="col-md-3">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Threshold">
                      Threshold
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6 p-2">
                      <input
                        type="text"
                        autoComplete="off"
                        id="Threshold"
                        onChange={(e) =>
                          setThresholdData((prev) => ({
                            ...prev,
                            ["Threshold"]: e.target.value,
                          }))
                        }
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className=" col-md-3">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Threshold">
                      Threshold&nbsp;
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <input
                        type="text"
                        autoComplete="off"
                        id="Threshold"
                        onChange={(e) =>
                          setThresholdData((prev) => ({
                            ...prev,
                            ["Threshold"]: e.target.value,
                          }))
                        }
                        onKeyPress={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 ">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  handleClick();
                  setHideContents(false);
                  setIsShow(false);
                  setResIsShow(false);
                  setOpenhtml(false);
                  setOpenhtmlRes(false);
                  setAllResIsShow(false);
                }}
              >
                <FaSearch /> Search
              </button>
            </div>
          </CCollapse>
          <div className="col-12"></div>
        </div>
      </div>
      <div>
        {loader ? <Loader handleAbort={handleAbort} /> : ""}
        {isShow == true ? (
          <>
            <div className="col-12 pagination-date-btn-wrapper">
              <div className="tracker-pagination">
                <div className="span-wrapper">
                  <span>View </span> <span>{startItem} </span>
                  <span>- </span>
                  <span>{endItem}</span>
                  <span>of</span> <span>{details.length}</span>
                </div>
                <RxDoubleArrowLeft
                  onClick={() => handlePageChange(0)}
                  className={`cursor ${hasPrevPage ? "enable" : "disabled"}`}
                />
                <MdKeyboardArrowLeft
                  onClick={handlePrevPage}
                  className={`cursor ${hasPrevPage ? "enable" : "disabled"}`}
                />
                <MdKeyboardArrowRight
                  onClick={handleNextPage}
                  className={`cursor ${hasNextPage ? "enable" : "disabled"}`}
                />
                <RxDoubleArrowRight
                  onClick={() => handlePageChange(pageCount - 1)}
                  className={`cursor ${hasNextPage ? "enable" : "disabled"}`}
                />
              </div>

              <div className="date-btn">
                <span>
                  <AiOutlineLeftSquare
                    cursor="pointer"
                    size={"2em"}
                    onClick={subtracHandler}
                  ></AiOutlineLeftSquare>
                  <span style={{ fontWeight: "600" }}>
                    {moment(dt.toDate).format("DD-MMM-YYYY") ===
                    moment(new Date()).format("DD-MMM-YYYY") ? (
                      <>
                        {moment(dt.toDate).format("DD-MMM-YYYY")}
                        <AiOutlineRightSquare
                          cursor="not-allowed"
                          size={"2em"}
                          disabled={true}
                        ></AiOutlineRightSquare>
                      </>
                    ) : (
                      <>
                        {moment(dt.toDate).format("DD-MMM-YYYY")}
                        <AiOutlineRightSquare
                          cursor="pointer"
                          size={"2em"}
                          onClick={addHandler}
                        ></AiOutlineRightSquare>
                      </>
                    )}
                  </span>
                </span>
              </div>
              <div className="abbreviation-btn">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowAbbr(true);
                  }}
                >
                  Abbreviations
                </button>
              </div>
            </div>
            <div className="col-12 mt-2">
              <TrackerCollapsibleTable
                data={data}
                expandedCols={["BusinessUnit", "Supervisor"]}
                colExpandState={["0", "0", "name"]}
                dt={dt}
                setOpenhtml={setOpenhtml}
                openhtml={openhtml}
                departments={departments}
                thresholdData={thresholdData}
                setShowAbbr={setShowAbbr}
                shoeAbbr={shoeAbbr}
                Abbrivations={Abbrivations}
                paginatedRows={paginatedRows}
              />
            </div>
          </>
        ) : (
          ""
        )}
        {resisShow == true ? (
          <>
            <div className="col-12 pagination-date-btn-wrapper">
              <div className="tracker-pagination">
                <div className="span-wrapper">
                  <span>View </span> <span>{startItem} </span>
                  <span>- </span>
                  <span>{endItem}</span>
                  <span>of</span> <span>{details.length}</span>
                </div>
                <RxDoubleArrowLeft
                  onClick={() => handlePageChange(0)}
                  className={`cursor ${hasPrevPage ? "enable" : "disabled"}`}
                />
                <MdKeyboardArrowLeft
                  onClick={handlePrevPage}
                  className={`cursor ${hasPrevPage ? "enable" : "disabled"}`}
                />
                <MdKeyboardArrowRight
                  onClick={handleNextPage}
                  className={`cursor ${hasNextPage ? "enable" : "disabled"}`}
                />
                <RxDoubleArrowRight
                  onClick={() => handlePageChange(pageCount - 1)}
                  className={`cursor ${hasNextPage ? "enable" : "disabled"}`}
                />
              </div>
              <div className="date-btn">
                <span>
                  <AiOutlineLeftSquare
                    cursor="pointer"
                    size={"2em"}
                    onClick={subtracHandler1}
                  ></AiOutlineLeftSquare>
                  <span style={{ fontWeight: "600" }}>
                    {moment(day.toDate).format("MMM-YYYY") ===
                    moment(new Date()).format("MMM-YYYY") ? (
                      <>
                        {moment(day.toDate).format("MMM-YYYY")}
                        <AiOutlineRightSquare
                          cursor="not-allowed"
                          size={"2em"}
                          disabled={true}
                        ></AiOutlineRightSquare>
                      </>
                    ) : (
                      <>
                        {moment(day.toDate).format("MMM-YYYY")}
                        <AiOutlineRightSquare
                          cursor="pointer"
                          size={"2em"}
                          onClick={addHandler1}
                        ></AiOutlineRightSquare>
                      </>
                    )}
                  </span>
                </span>
              </div>
              <div className="abbreviation-btn">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowAbbr(true);
                  }}
                >
                  Abbreviations
                </button>
              </div>
            </div>
            <div className="col-12 mt-2">
              <TrackerResCollapsibleTable
                data={data}
                expandedCols={["BusinessUnit", "Supervisor"]}
                colExpandState={["0", "0", "name"]}
                day={day}
                setOpenhtmlRes={setOpenhtmlRes}
                openhtmlRes={openhtmlRes}
                thresholdData={thresholdData}
                setShowAbbr={setShowAbbr}
                shoeAbbr={shoeAbbr}
                Abbrivations={Abbrivations}
                paginatedRows={paginatedRows}
              />
            </div>
          </>
        ) : (
          ""
        )}
        {AllResIsShow == true ? (
          <>
            <div className="col-12 pagination-date-btn-wrapper">
              <div className="tracker-pagination">
                <div className="span-wrapper">
                  <span>View </span> <span>{startItem} </span>
                  <span>- </span>
                  <span>{endItem}</span>
                  <span>of</span> <span>{details.length}</span>
                </div>
                <RxDoubleArrowLeft
                  onClick={() => handlePageChange(0)}
                  className={`cursor ${hasPrevPage ? "enable" : "disabled"}`}
                />
                <MdKeyboardArrowLeft
                  onClick={handlePrevPage}
                  className={`cursor ${hasPrevPage ? "enable" : "disabled"}`}
                />
                <MdKeyboardArrowRight
                  onClick={handleNextPage}
                  className={`cursor ${hasNextPage ? "enable" : "disabled"}`}
                />
                <RxDoubleArrowRight
                  onClick={() => handlePageChange(pageCount - 1)}
                  className={`cursor ${hasNextPage ? "enable" : "disabled"}`}
                />
              </div>
              <div className="date-btn">
                <span>
                  <AiOutlineLeftSquare
                    cursor="pointer"
                    size={"2em"}
                    onClick={AllRessubtracHandler1}
                  ></AiOutlineLeftSquare>
                  <span style={{ fontWeight: "600" }}>
                    {moment(day.toDate).format("MMM-YYYY") ===
                    moment(new Date()).format("MMM-YYYY") ? (
                      <>
                        {moment(day.toDate).format("MMM-YYYY")}
                        <AiOutlineRightSquare
                          cursor="not-allowed"
                          size={"2em"}
                          disabled={true}
                        ></AiOutlineRightSquare>
                      </>
                    ) : (
                      <>
                        {moment(day.toDate).format("MMM-YYYY")}
                        <AiOutlineRightSquare
                          cursor="pointer"
                          size={"2em"}
                          onClick={AllResaddHandler1}
                        ></AiOutlineRightSquare>
                      </>
                    )}
                  </span>
                </span>
              </div>
              <div className="abbreviation-btn">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setShowAbbr(true);
                  }}
                >
                  Abbreviations
                </button>
              </div>
            </div>
            <div className="col-12 mt-2">
              <TrackerAllResCollapsibleTable
                data={data}
                expandedCols={["BusinessUnit", "Supervisor"]}
                colExpandState={["0", "0", "name"]}
                day={day}
                setOpenhtmlRes={setOpenhtmlRes}
                openhtmlRes={openhtmlRes}
                thresholdData={thresholdData}
                setShowAbbr={setShowAbbr}
                shoeAbbr={shoeAbbr}
                Abbrivations={Abbrivations}
                depData={depData}
                startIndex={startIndex}
                endIndex={endIndex}
              />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
