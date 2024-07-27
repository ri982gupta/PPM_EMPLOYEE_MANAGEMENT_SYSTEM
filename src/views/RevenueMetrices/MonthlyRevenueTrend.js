import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { environment } from "../../environments/environment";
import MaterialReactTable from "material-react-table";
import MaterialReactCollapisbleTable from "../PrimeReactTableComponent/MaterialReactCollapisbleTable";
import MonthlyRevenueTable from "./MonthlyRevenueTable";
import { LensTwoTone } from "@material-ui/icons";
import Loader from "../Loader/Loader";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import "./MonthlyRevenueTrend.scss";
import { AiFillWarning } from "react-icons/ai";
import { Settings } from "@mui/icons-material";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import RevenueForecastBuCustomer from "./RevenueForecastBuCustomer";
import MonthlyForecastRevenueTableComponent from "./MonthlyForecastRevenueTableComponent";
import RevenueForecastBuTable from "./RevenueForecastBuTable";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { CCollapse } from "@coreui/react";
import MonthlyRevenueCDTable from "./MonthlyRevenueCDTable";

const MonthlyRevenueTrend = () => {
  const initialValueForCus = {
    FMeasures: "-1",
  };
  const [searchdata, setSearchdata] = useState(initialValueForCus);
  console.log(searchdata, "searchdata");

  const [shouldRenderTable, setShouldRenderTable] = useState(false);
  const [change, setChange] = useState(false);
  console.log(shouldRenderTable);
  const baseUrl = environment.baseUrl;
  const ref = useRef([]);
  const [loader, setLoader] = useState(false);
  const currentDate = new Date();
  const [month, setMonth] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [dataAccess, setDataAccess] = useState([]);

  const [selectedDuration, setSelectedDuration] = useState("");
  console.log(selectedDuration, "selectedDuration");
  const [view, setView] = useState("");
  const [viewBy, setViewBy] = useState("region");
  const [title, setTitle] = useState("");
  const [Measures, setMeasures] = useState([]);
  const [selectedMeasures, setSelectedMeasures] = useState([]);
  console.log(
    selectedMeasures.map((item) => item.value).join(","),
    "selectedMeasures"
  );
  const [cdMeasures, setcdMeasures] = useState([]);
  const [selectedcdMeasures, setSelectedcdMeasures] = useState([]);
  const [tableKey, setTableKey] = useState(0);

  let commaSeparatedValues; // Define the variable here

  if (Array.isArray(selectedcdMeasures)) {
    const selectedValues = selectedcdMeasures.map((item) => item.value);
    commaSeparatedValues = selectedValues.join(",");
    console.log(commaSeparatedValues);
  } else {
    console.log("selectedcdMeasures is not an array.");
  }
  console.log(dataAccess);
  const abortController = useRef(null);
  const [customer, setCustomer] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [custId, setCustId] = useState("");
  const [engCompany, setEngCompany] = useState([]);
  const [selectedEngCompany, setSelectedEngCompany] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [custVisible, setCustVisible] = useState(false);
  const loggedUserId = localStorage.getItem("resId");
  const [customerIds, setCustomerIds] = useState(-1);
  const [validationmessage, setValidationMessage] = useState(false);
  const [revenue, setRevenue] = useState();
  const [sort, setSort] = useState();
  const [sortChange, setSortChange] = useState(false);
  const [dp, setDp] = useState([]);
  const [dpOptions, setDpOptions] = useState([]);
  const [accountExecutive, setAccountExecutive] = useState([]);
  const [selectedAccountExecutive, setSelectedAccountExecutive] = useState([]);
  console.log(dp, "dp");
  const [selectedDp, setSelectedDp] = useState([]);
  const [selectDelivery, setSelectedDelivery] = useState([]);
  console.log(selectedDp.map((item) => item.value).join(","), "selectedDp");
  const [csl, setCsl] = useState([]);
  console.log(csl.map((item) => item.value).join(","), "cslData");
  const [search, setSearch] = useState(false);
  const [columns, setColumns] = useState([]);
  const [details, setDetails] = useState([]);
  const [editmsg, setEditAddmsg] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [accountOwner, setAccountOwner] = useState([]);
  const [selectedAccountOwner, setSelectedAccountOwner] = useState([]);
  console.log(selectedAccountOwner, "selectedAccountOwner");
  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();
  let flag = 1;

  const [routes, setRoutes] = useState([]);
  let textContent = "Revenue Metrics";
  let currentScreenName = ["Monthly Revenue Trend"];
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
  console.log(view);
  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/resource/monthlyRevenueTrend";
      getUrlPath(modifiedUrlPath);

      let getData = resp.data.map((menu) => {
        const marginSubMenu = resp.data
          .find((item) => item.display_name === "Revenue Metrics")

          .subMenus.find(
            (subMenu) => subMenu.display_name === "Monthly Revenue Trend"
          );
        // 686,908,126,911
        const accessLevel = marginSubMenu.userRoles.includes("126")
          ? 126
          : marginSubMenu.userRoles.includes("686")
            ? 686
            : marginSubMenu.userRoles.includes("911")
              ? 911
              : marginSubMenu.userRoles.includes("908")
                ? 908
                : marginSubMenu.userRoles.includes("641")
                  ? 641
                  : marginSubMenu.userRoles.includes("690")
                    ? 690
                    : null;
        console.log(accessLevel);
        setDataAccess(accessLevel);
        accessLevel == 690 || accessLevel == 641
          ? setView("customer")
          : setView("region");
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              // subMenu.display_name !== "Monthly Revenue Trend" &&
              subMenu.display_name !== "Revenue & Margin Variance" &&
              subMenu.display_name !== "Rev. Projections" &&
              subMenu.display_name !== "Project Timesheet (Deprecated)" &&
              subMenu.display_name !== "Financial Plan & Review"
          );
        }
        return menu;
      });
      // setData2(getData);
      const updatedMenuData = resp.data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Revenue By Industry") {
            return {
              ...submenu,
              display_name: "Recognized Revenue By Industry",
            };
          }

          return submenu;
        }),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    console.log(modifiedUrlPath);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => { })
      .catch((error) => { });
  };
  useEffect(() => {
    getEngCompany();
    getCustomerData();
    if (view === "customerdelta") {
      getcdMeasures(); // Call the function if view is "customerdelta"
    } else {
      getMeasures();
    }
    handleDp();
    handleCsl();
  }, [view]);

  const getDP = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getAccountOwner`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      console.log(data, "account");
      data.length > 0 &&
        data.forEach((e) => {
          let dpObj = {
            label: e.Name,
            value: e.account_owner_id,
          };
          custom.push(dpObj);
        });
      custom.push({ label: "UnAssigned", account_owner_id: 999 });
      setAccountOwner(custom);
      setSelectedAccountOwner(custom);
    });
  };

  const getAccountExecutive = () => {
    axios({
      method: "get",
      url: baseUrl + `/SalesMS/sales/getSalesExecutive`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      console.log(data, "accountExe");
      data.length > 0 &&
        data.forEach((e) => {
          let dpObj = {
            label: e.Name,
            value: e.id,
          };
          custom.push(dpObj);
        });
      setAccountExecutive(custom);
      setSelectedAccountExecutive(custom);
    });
  };
  useEffect(() => {
    getDP();
    getAccountExecutive();
  }, []);
  const getEngCompany = async () => {
    try {
      const response = await axios.get(
        baseUrl + `/revenuemetricsms/headCountAndTrend/getEngCompany`
      );
      const data = response.data;
      const filteredEngCompany = data.filter(
        (ele) => ![0, 10, 11, 12, 13].includes(ele.value)
      );
      setEngCompany(filteredEngCompany);
      setSelectedEngCompany(filteredEngCompany);
    } catch (error) { }
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

  const handleCsl = () => {
    const loggedUser = "0";
    axios({
      method: "get",
      url:
        baseUrl +
        `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUser}`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let cslObj = {
            label: e.PersonName,
            value: e.id,
          };
          custom.push(cslObj);
        });
      console.log(custom, "CSL");
      custom.push({ label: "UnAssigned", value: 999 });

      setCsl(custom);
      // setSelectedCsl(custom);
      setFormData((prevVal) => ({
        ...prevVal,
        ["csl"]: custom,
      }));
    });
  };

  const handleDp = () => {
    const loggedUser = "0";
    axios({
      method: "get",
      url: baseUrl + `/CommonMS/master/getDPDropDownData?userId=${loggedUser}`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let dpObj = {
            label: e.PersonName,
            value: e.id,
          };
          custom.push(dpObj);
        });
      custom.push({ label: "UnAssigned", value: 999 });

      console.log(custom.map((item) => item.value).join(","), "custom");
      console.log(custom, "dpcustomdata");
      setDp(custom);
      setDpOptions(custom);
      setSelectedDp(custom);
      setSelectedDelivery(custom);
      setFormData((prevVal) => ({
        ...prevVal,
        ["Dp"]: custom,
      }));
    });
  };

  const getCustomerData = () => {
    axios
      .get(`${baseUrl}/CommonMS/master/geActiveCustomerList`)
      .then((response) => {
        const data = response.data;
        const customers = data.map((e) => ({
          label: e.fullName,
          value: e.id,
        }));
        setCustomer(customers);
      })
      .catch((error) => { });
  };

  const getMeasures = () => {
    let data = [];
    data.push(
      // { label: "<<All>>", value: "-1" },
      { value: "capacity", label: "Capacity" },
      { value: "Financial", label: "Financial" }
    );
    setMeasures(data);
    console.log(data);
    console.log(data.filter((ele) => ele.value != ""));
    setSelectedMeasures(data.filter((ele) => ele.value == "Financial"));
    let filteredType = [];
    data.forEach((data) => {
      if (data.value >= 0) {
        filteredType.push(data.value);
      }
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["FMeasures"]: filteredType.toString(),
    }));
  };

  const getcdMeasures = () => {
    const data = [
      { label: "Planned Revenue", value: "pl" },
      { label: "Recognized Revenue", value: "rr" },
      { label: "Actual Revenue", value: "ar" },
    ];
    setcdMeasures(data);
    setSelectedcdMeasures(data);
  };

  const initialValue = {
    custIds: "-1",
    revenueType: "-1",
    DpId: "-1",
    csl: "-1",
    accountOwner: "-1",
    accountExecutive: "-1",
  };
  const [formData, setFormData] = useState(initialValue);
  console.log(formData.DpId, "formDatadpId");
  console.log(formData.custIds, "custIds");
  const norecords = (data) => {
    console.log(data.tableData, "data");
    const emptyObject = {};
    console.log(data.tableData[1], "data[1]");

    Object.keys(data.tableData[1]).forEach((key, value) => {
      emptyObject[key] = "0";

      if (
        key == "name" ||
        key == "id" ||
        key == "uniqueId" ||
        key == "lvl" ||
        key == "parentId"
      ) {
        emptyObject["name"] = "No Records Found";
        emptyObject["id"] = "999";
        emptyObject["uniqueId"] = "3";
        emptyObject["lvl"] = "1";
        emptyObject["parentId"] = null;
      }
    });

    data.tableData[2] = emptyObject;
    console.log(emptyObject, "emptyObject");
  };
  const handleSubmit = () => {
    setOpen(false);
    setShouldRenderTable(false);
    setTableData([]);

    let valid = GlobalValidation(ref);

    if (valid === true) {
      setLoader(false);
      setValidationMessage(true);
      return;
    }

    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setSearch(true);
    abortController.current = new AbortController();

    const commonFilters = {
      FromDt: moment(month).format("yyyy-MM-DD"),
      dur: parseInt(selectedDuration, 10),
      ViewBy: view,
      FMeasures:
        selectedMeasures.length === 1 ? selectedMeasures[0].value : "-1",
      UserId: parseInt(loggedUserId, 10),
      selViewType: viewBy,
      // selViewVal: "-1",
      selViewVal:
        viewBy == "engComp"
          ? selectedEngCompany.map((option) => option.value).toString() ==
            "8,9,7,6,5,4,3,2,16,14"
            ? -1
            : selectedEngCompany.map((option) => option.value).toString()
          : viewBy == "csl"
            ? formData.csl.map((option) => option.value).toString() ==
              csl.map((item) => item.value).join(",")
              ? -1
              : formData.csl.map((option) => option.value).toString()
            : viewBy == "dp"
              ? selectDelivery.map((item) => item.value).toString() ==
                dpOptions.map((item) => item.value).toString()
                ? -1
                : selectDelivery.map((item) => item.value).join(",")
              : "",
      UserId: parseInt(loggedUserId, 10),
      revenue: "-1",
    };

    let url = "";
    let filters = { ...commonFilters };

    if (view === "customer") {
      url = baseUrl + `/revenuemetricsms/MonthlyRevenueTrend/getCustomerData`; // Replace with the actual customer API endpoint
      filters = {
        // ...filters,
        FromDt: moment(month).format("yyyy-MM-DD"),
        dur: parseInt(selectedDuration, 10),
        ViewBy: view,
        custIds:
          formData.custIds == "-1"
            ? "-1"
            : formData.custIds == "0"
              ? "0"
              : selectedCust,
        FMeasures:
          selectedMeasures.map((item) => item.value).join(",") ==
            "capacity,Financial"
            ? "-1"
            : selectedMeasures.map((item) => item.value).join(","),
        revenueType: change == false ? "-1" : revenue,
        SortBy: sortChange == false ? "cust" : sort,
        UserId: parseInt(loggedUserId, 10),
        engComp:
          selectedEngCompany.map((option) => option.value).toString() ==
            "8,9,7,6,5,4,3,2,16,14"
            ? "-1"
            : selectedEngCompany.map((option) => option.value).toString(),
      };
    } else if (view === "customerdelta") {
      url =
        baseUrl + `/revenuemetricsms/MonthlyRevenueTrend/getCustomerDeltaData`; // Replace with the actual customer delta API endpoint
      filters = {
        FromDt: moment(month).format("yyyy-MM-DD"),
        dur: parseInt(selectedDuration, 10),
        ViewBy: view,
        custIds:
          formData.custIds == "-1"
            ? "-1"
            : formData.custIds == "active"
              ? "0"
              : selectedCust,
        revenueType: formData.revenueType,
        FMeasures:
          selectedcdMeasures.length > 0 && commaSeparatedValues == "pl,rr,ar"
            ? "-1"
            : selectedcdMeasures.length > 0 && selectedcdMeasures.length == "3"
              ? "-1"
              : commaSeparatedValues,
        engComp:
          selectedEngCompany.map((option) => option.value).toString() ==
            "8,9,7,6,5,4,3,2,16,14"
            ? -1
            : selectedEngCompany.map((option) => option.value).toString(),

        CSL:
          Object.keys(formData.csl).length === csl.length
            ? "-1"
            : formData.csl.map((d) => d.value).toString(),
        DP:
          selectedDp.map((item) => item.value).toString() ==
            dp.map((item) => item.value).toString()
            ? "-1"
            : selectedDp.map((item) => item.value).toString(),

        AccExe:
          selectedAccountExecutive.map((item) => item.value).toString() ==
            accountExecutive.map((item) => item.value).toString()
            ? "-1"
            : selectedAccountExecutive.map((item) => item.value).toString(),
        AccOwner:
          selectedAccountOwner.map((item) => item.value).toString() ==
            accountOwner.map((item) => item.value).toString()
            ? "-1"
            : selectedAccountOwner.map((item) => item.value).toString(),
        UserId: parseInt(loggedUserId, 10),
      };
    } else {
      url = baseUrl + `/revenuemetricsms/MonthlyRevenueTrend/getData`;
    }

    axios({
      method: "post",
      url: url,
      data: filters,
      signal: abortController.current.signal,
    })
      .then((response) => {
        console.log(response, "response");
        setLoader(false);
        clearTimeout(loaderTime);
        setShouldRenderTable(true);
        const data = response.data;
        console.log(data.tableData);

        if (view === "region") {
          setTitle("Summary By Region");
        } else if (view === "month") {
          setTitle("Summary By Month");
        } else if (view === "customer") {
          setTitle("Summary By Customer");
        } else if (view === "customerdelta") {
          // setTitle("Summary By Customer Delta");
        }
        setOpen(true);
        console.log("in line 449");
        if (data.tableData.length === 2) {
          console.log("in no records");
          norecords(data);
          setTableData(data);
        }
        console.log(data, "data>>>>>>>>>>>");
        setTableData(data);
        setShowTable(true);
        setValidationMessage(false);
        let detail = response.data.tableData;
        let cols = response.data.columns?.replaceAll("'", "").split(",");
        setColumns(cols);
        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setTableKey((prevKey) => prevKey + 1);

        setDetails(detail);
      })
      .catch((error) => {
        setValidationMessage(false);
        setLoader(false);
      });
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

  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    if (name == "custIds" && value === "0") {
      setCustomerIds(value);
    }
    if (name == "custIds" && value === "1") {
      setCustomerIds(value);
    }
    if (name == "custIds" && value === "select") {
      // setCustomerIds(selectedCust);
      setCustVisible(true);
    }
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  console.log(formData, "formData");

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  // Excel
  const extractValue = (value) => {
    if (typeof value === "string") {
      const [extractedValue, ,] = value.split("^&");
      return extractedValue;
    } else if (typeof value === "object") {
      if (value.props && value.props.children) {
        if (Array.isArray(value.props.children)) {
          return value.props.children
            .map((child) => {
              if (typeof child === "string") {
                const [extractedChild, ,] = child.split("^&");
                return extractedChild;
              }
              return "";
            })
            .join(", ");
        } else if (typeof value.props.children === "string") {
          const [extractedValue, ,] = value.props.children.split("^&");
          return extractedValue;
        } else {
          return "";
        }
      }
    } else {
      return "";
    }
  };

  const exportExcel = () => {
    import("exceljs").then((ExcelJS) => {
      const columnsToExclude = [
        "id",
        "lvl",
        "keyAttr",
        "parentAttr",
        "region_id",
        "customerId",
        "dispName",
        "keyterm",
      ];

      const filteredColumns = columns.filter(
        (col) => !columnsToExclude.includes(col)
      );

      const wantedValues = details
        .slice(0)
        .filter((item) => item.id !== -2)
        .map((item) => {
          const obj = {};
          filteredColumns.forEach((col) => {
            const value = item[col];
            obj[col] = extractValue(value);
          });
          return obj;
        });

      const rows = wantedValues.map((item, index) => {
        const row = [];
        filteredColumns.forEach((col) => {
          console.log(col, index, "item,row")
          // row.push(item[col]);

          if (index === 1 && (col === "RRCost" || col === "RRGM")) {
            row.push("RR(Role)");
          }
          else {
            row.push(item[col]);
          }
        });
        return row;
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Monthly Revenue Trend Report");


      // let temp = rows
      // temp[0][1] = "ttt"
      rows.forEach((row) => {
        console.log(row, "row")
        worksheet.addRow(row);
      });

      const boldRows = [1];
      boldRows.forEach((rowNumber) => {
        const row = worksheet.getRow(rowNumber);
        row.font = { bold: true };
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAsExcelFile(buffer, "Monthly Revenue Trend Report");
      });
    });
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

  return (
    <div>
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Monthly Revenue Trend</h2>
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
      {/* <ScreenBreadcrumbs

      <div className="group mb-3 customCard mt-2">
      /> */}

      <div className="group customCard mt-2">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Month">
                  Month&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div
                  className="datepicker col-6"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <DatePicker
                    name="month"
                    id="StartDt"
                    selected={month}
                    onChange={(date) => setMonth(date)}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                    placeholderText="Select Month"
                  />
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Duration">
                  Duration&nbsp;
                  <span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    id="duration"
                    name="duration"
                    className="text"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <option value="">{"<<Please Select>>"}</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => (
                      <option
                        key={value}
                        value={value}
                        disabled={view === "customerdelta" && value === 1}
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="Type">
                  View&nbsp;
                  <span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="Type"
                    name="Type"
                    value={view}
                    onChange={(e) => {
                      setView(e.target.value);
                      setOpen(false);
                      if (e.target.value === "customerdelta") {
                        // setSelectedDuration("2");
                      }
                    }}
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    {dataAccess == 690 || dataAccess == 641 ? (
                      ""
                    ) : (
                      <option value="region" selected>
                        Region
                      </option>
                    )}
                    <option value="customer">Customer</option>
                    {dataAccess == 690 || dataAccess == 641 ? (
                      ""
                    ) : (
                      <option value="month">Month</option>
                    )}
                    <option value="customerdelta">Customer Delta</option>
                  </select>
                </div>
              </div>
            </div>

            {view === "region" || view === "month" || view === "customer" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="Type">
                    Measures&nbsp;
                    <span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="multiselect col-6"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="FMeasures"
                      name="FMeasures"
                      options={Measures}
                      hasSelectAll={true} // Remove select all option
                      disabled={false}
                      value={selectedMeasures}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => {
                        setSelectedMeasures(e);
                        let filteredType = [];
                        e.forEach((d) => {
                          filteredType.push(d.value);
                        });
                        setSearchdata((prevVal) => ({
                          ...prevVal,
                          ["FMeasures"]: filteredType.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {view === "region" && (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Type">
                    View By&nbsp;
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <select
                      className="text cancel"
                      id="Type"
                      name="Type"
                      value={viewBy}
                      onChange={(e) => setViewBy(e.target.value)}
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <option value="region" selected>
                        Region
                      </option>
                      <option value="csl">CSL</option>
                      <option value="dp">DP</option>
                      <option value="engComp">Eng Company</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {view === "customer" && (
              <>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Type">
                      Revenue&nbsp;
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="Type"
                        name="Type"
                        className="text"
                        value={revenue}
                        onChange={(e) => {
                          setRevenue(e.target.value);
                          setChange(true);
                        }}
                        ref={(ele) => {
                          ref.current[2] = ele;
                        }}
                      >
                        <option value="-1">ALL</option>
                        <option value="500k">500K And Above</option>
                        <option value="400k">400K And Above</option>
                        <option value="300k">300K And Above</option>
                        <option value="200k">200K And Above</option>
                        <option value="100k">Above 100K</option>
                        <option value="100">100K And Below</option>
                        <option value="50k">50K And Below</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="customers">
                      Customer&nbsp;
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      {dataAccess == 690 || dataAccess == 641 ? (
                        <select
                          className="text cancel"
                          name="custIds"
                          id="searchType"
                          onChange={handleChange1}
                          ref={(ele) => {
                            ref.current[4] = ele;
                          }}
                        >
                          <option value="">
                            &lt;&lt; Please Select &gt;&gt;
                          </option>

                          <option value="select">Select</option>
                        </select>
                      ) : (
                        <select
                          className="text cancel"
                          name="custIds"
                          id="searchType"
                          onChange={handleChange1}
                          ref={(ele) => {
                            ref.current[4] = ele;
                          }}
                        >
                          {selectedItems.length + "selected"}
                          <option value="-1">&lt;&lt; ALL &gt;&gt;</option>
                          <option value="0">Active Customers</option>
                          <option value="select">Select</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="Dropdown2">
                      Eng.Company&nbsp;
                      <span className="col-1 p-0 error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[4] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="engComp"
                        name="engComp"
                        options={engCompany}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedEngCompany}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedEngCompany(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });

                          // setSearchdata((prevVal) => ({
                          //   ...prevVal,
                          //   ["engComp"]: filteredValues.toString(),
                          // }));
                        }}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return "Select";
                          } else if (selected.length === engCompany.length) {
                            return <>&lt;&lt; ALL &gt;&gt;</>;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="Type">
                      Sort By&nbsp;
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        className="text"
                        id="Type"
                        name="Type"
                        value={sort}
                        onChange={(e) => {
                          setSort(e.target.value);
                          setSortChange(true);
                        }}
                        ref={(ele) => {
                          ref.current[2] = ele;
                        }}
                      >
                        <option value="cust">Customer</option>
                        <option value="pr">Planned Revenue</option>
                        <option value="rr">Recognized Revenue</option>
                        <option value="prgm">PR GM%</option>
                        <option value="rrgm">RR GM%</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {view === "customerdelta" && (
              <>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="Type">
                      Measures&nbsp;
                      <span className="col-1 p-0 error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                    >
                      <MultiSelect
                        id="cdmeasures"
                        name="cdmeasures"
                        options={cdMeasures}
                        hasSelectAll={true} // Remove select all option
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false} // Disable search input
                        value={selectedcdMeasures}
                        onChange={(s) => {
                          setSelectedcdMeasures(s);
                        }}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return "Select";
                          } else if (selected.length === cdMeasures.length) {
                            return <>&lt;&lt; ALL &gt;&gt;</>;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Type">
                      Revenue&nbsp;
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="revenueType"
                        name="revenueType"
                        className="text"
                        value={revenue}
                        onChange={handleChange1}
                      >
                        <option value="-1">&lt;&lt; ALL &gt;&gt;</option>
                        <option value="500k">500K And Above</option>
                        <option value="400k">400K And Above</option>
                        <option value="300k">300K And Above</option>
                        <option value="200k">200K And Above</option>
                        <option value="100k">Above 100K</option>
                        <option value="100k below">100K And Below</option>
                        <option value="50k">50K And Below</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="customers">
                      Customer
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      {dataAccess == 690 || dataAccess == 641 ? (
                        <select
                          className="text cancel"
                          name="custIds"
                          id="searchType"
                          onChange={handleChange1}
                          ref={(ele) => {
                            ref.current[4] = ele;
                          }}
                        >
                          <option value="">
                            &lt;&lt; Please Select &gt;&gt;
                          </option>

                          <option value="select">Select</option>
                        </select>
                      ) : (
                        <select
                          className="text cancel"
                          name="custIds"
                          id="searchType"
                          onChange={handleChange1}
                        >
                          {selectedItems.length + "selected"}
                          <option value="-1">&lt;&lt; ALL &gt;&gt;</option>
                          <option value="active">Active Customers</option>
                          <option value="select">Select</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="Dropdown2">
                      Eng.Company&nbsp;
                      <span className="error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[4] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="engComp"
                        name="engComp"
                        options={engCompany}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedEngCompany}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedEngCompany(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });
                        }}
                        valueRenderer={(selected) => {
                          if (selected?.length === 0) {
                            return "Select";
                          } else if (selected?.length === engCompany?.length) {
                            return <>&lt;&lt; ALL &gt;&gt;</>;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="Dropdown2">
                      CSL&nbsp;
                      <span className="col-1 p-0 error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[5] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="csl"
                        options={csl}
                        hasSelectAll={true}
                        value={formData.csl}
                        valueRenderer={generateDropdownLabel}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        disabled={false}
                        onChange={(e) => {
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["csl"]: e,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Dropdown2">
                      DP&nbsp;
                      <span className="error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[6] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="dp"
                        options={dp}
                        hasSelectAll={true}
                        value={selectedDp}
                        valueRenderer={generateDropdownLabel}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedDp(e);

                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["dp"]: filteredCountry.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5 ellipsis" htmlFor="Dropdown2">
                      Account Executive&nbsp;
                      <span className="error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[7] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="accountExecutive"
                        options={accountExecutive}
                        hasSelectAll={true}
                        value={selectedAccountExecutive}
                        valueRenderer={generateDropdownLabel}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedAccountExecutive(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["accountExecutive"]: filteredCountry.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-4 ellipsis" htmlFor="Dropdown2">
                      Account Owner&nbsp;
                      <span className="error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[8] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="accountOwner"
                        options={accountOwner}
                        hasSelectAll={true}
                        value={selectedAccountOwner}
                        // selected={accountOwner}
                        valueRenderer={generateDropdownLabel}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedAccountOwner(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.account_owner_id);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["accountOwner"]: filteredCountry.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {viewBy === "csl" && view === "region" && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Dropdown2">
                    CSL&nbsp;
                    <span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[4] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="csl"
                      options={csl}
                      hasSelectAll={true}
                      value={formData.csl}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      disabled={false}
                      onChange={(e) => {
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["csl"]: e,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {viewBy === "dp" && view === "region" && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Dropdown2">
                    DP&nbsp;
                    <span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[5] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="DpId"
                      options={dpOptions}
                      hasSelectAll={true}
                      value={selectDelivery}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedDelivery(e);
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["DpId"]: e,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {viewBy === "engComp" && view === "region" && (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Dropdown2">
                    Eng.Company&nbsp;
                    <span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[5] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="engComp"
                      name="engComp"
                      options={engCompany}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedEngCompany}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedEngCompany(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });
                      }}
                      valueRenderer={(selected) => {
                        if (selected?.length === 0) {
                          return "Select";
                        } else if (selected?.length === engCompany?.length) {
                          return <>&lt;&lt; ALL &gt;&gt;</>;
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div
              className="col-md-12 col-sm-12 col-xs-12 search-btn-container"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                <FaSearch />
                Search
              </button>
            </div>
          </div>
        </CCollapse>

        <SelectCustDialogBox
          flag={flag}
          variance={1}
          visible={custVisible}
          setVisible={setCustVisible}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          dataAccess={dataAccess}
        />
      </div>

      {showTable && open && (
        <>
          <div className="col-md-12 d-flex justify-content-between mb-1 mt-1">
            {view !== "customerdelta" && (
              <div className="headerstructure-wrapper">
                {" "}
                <div className="headerStructure">
                  <span>{title}</span>
                </div>
              </div>
            )}
            {search && (
              <div className="MRT-summary-by-region-screen-excel-logo">
                <RiFileExcel2Line
                  size="1.5em"
                  title="Export to Excel"
                  style={{ color: "green", cursor: "pointer" }}
                  onClick={exportExcel}
                />
              </div>
            )}
          </div>

          {["region", "customer", "month"].includes(view) && open && (
            <MonthlyRevenueTable
              view={view}
              data={tableData}
              expandedCols={[]}
              colExpandState={[]}
              title={title}
            />
          )}
          {view === "customerdelta" && open && (
            <MonthlyRevenueCDTable
              setTableKey={setTableKey}
              shouldRenderTable={shouldRenderTable}
              tableKey={tableKey}
              selectedDuration={selectedDuration}
              view={view}
              data={tableData}
              expandedCols={["csl", "dp", "acc_exe", "acc_own"]}
              colExpandState={["0", "1", "dispName"]}
            />
          )}
        </>
      )}
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
};

export default MonthlyRevenueTrend;
