import React, { useEffect, useState, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment, { duration } from "moment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
// import { useRef } from "react";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { FPRViewTable } from "./FinancePlanReview/FPRViewTable";
import { FPRActualsTable } from "./FinancePlanReview/FPRActualsTable";
import FPRGoalsandNotes from "./FinancePlanReview/FPRGoalsandNotes";
import { FPRCompareTable } from "./FinancePlanReview/FPRCompareTable";
import { FPRPlanningTable } from "./FinancePlanReview/FPRPlanningTable";
import { RiFileExcel2Line } from "react-icons/ri";
import { AiFillWarning } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import ExcelJS from "exceljs";
import GlobalValidation from "../ValidationComponent/GlobalValidation";

function FinancialPlanService() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(date.getMonth() - 3);
    return date;
  });
  const [value, onChange] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const baseUrl = environment.baseUrl;
  const ref = useRef([]);

  const [validationmessage, setValidationMessage] = useState(false);

  //// -------breadcrumbs-----
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Financial Plan and Review"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const Classifications = [
    { value: "1097", label: "Key" },
    { value: "1098", label: "Strategic" },
    { value: "1099", label: "Growth" },
    { value: "1100", label: "Invest" },
    { value: "1101", label: "Others" },
  ];

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const cumonth = currentDate.getMonth() + 1;
  const firstDay = new Date(year, cumonth - 1, 1);
  const [dataAcess, setDataAcess] = useState([]);
  const [selectedcountry, setselectedcountry] = useState([]);
  const [selectedClassifications, setSelectedClassifications] =
    useState(Classifications);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState([]);
  const [viewType, setViewType] = useState("plan");
  // const [classification, setClassification] = useState([]);
  const [quarterDuration, setQuarterDuration] = useState("4");
  const [monthDuration, setMonthDuration] = useState("6");
  const [country, setcountry] = useState([]);
  const [cslList, setCslList] = useState(selectedCsl);
  const [delivery, setDelivery] = useState(selectedDelivery);
  const [engComp, setengComp] = useState([]);
  const [resource, setResource] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [viewTable, setViewTable] = useState(false);
  const [planTable, setPlanTable] = useState(false);
  const [actualTable, setActualTable] = useState(false);
  const [compareTable, setCompareTable] = useState(false);

  const [goalsPopup, setGoalsPopup] = useState(false);
  const [resource1, setResource1] = useState([]);
  const [selectedengComp, setselectedengComp] = useState([]);
  const [dropCslId, setDropCslId] = useState([]);
  const [dpIds, setDpIds] = useState([]);
  const [date, SetDate] = useState(new Date());
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const [back, setBack] = useState([]);
  const targetElementRef = useRef(null);
  const [validation, setValidation] = useState("");
  const [searchTable, setSearchTable] = useState(false);
  const defaultDate = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    return firstDate.toLocaleDateString("en-CA");
  };

  const [servicesPayload, setservicesPayload] = useState({
    viewtype: viewType,
    Classification: "",
    countries: "",
    quarter: moment(defaultDate()).format("yyyy-MM-DD"),
    duration: viewType == "view" ? "6" : "4",
    // status: "active",
    monthsel: moment(firstDay.toDateString()).format("yyyy-MM-DD"),
    custstatus: "active",
    customerId: "-1",
    accountExecutiveId: "-1",
    CslId: "",
    DpId: "",
    engComp: "-1",
    cpId: "-1",
    epId: "-1",
    isExport: "0",
    isCSL: false,
    isLimitedAccess: false,
    key: "1698211090178",
    cslResId: "-1",
  });
  const [showtable, setShowtable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [reportRunId, setReportRunId] = useState(0);

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const onFilterChange = ({ id, value }) => {
    if (id === "countries") {
      setservicesPayload((prevState) => {
        return {
          ...prevState,
          [id]: value.length == 8 ? -1 : value.toString(),
        };
      });
    } else if (id === "Classification") {
      setservicesPayload((prevState) => {
        return {
          ...prevState,
          [id]: value.length == 5 ? -1 : value.toString(),
        };
      });
    } else if (id === "viewtype") {
      if (value == "view") {
        setservicesPayload((prevState) => {
          return { ...prevState, duration: "6" };
        });
      } else {
        setservicesPayload((prevState) => {
          return { ...prevState, duration: quarterDuration };
        });
      }
    } else {
      setservicesPayload((prevState) => {
        return { ...prevState, [id]: value };
      });
    }

    // if (id === "from") {
    //   setservicesPayload((prevState) => {
    //     return { ...prevState, fyear: moment(value).format("yyyy-MM-DD") };
    //   });
    // }
  };
  const handleClearCustomer = () => {
    setservicesPayload((prevProps) => ({ ...prevProps, customerId: "-1" }));
  };

  const handleClearAccountExecutive = () => {
    setservicesPayload((prevProps) => ({
      ...prevProps,
      accountExecutiveId: "-1",
    }));
  };

  const financeHandleClick = () => {
    setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const headers = Object.keys(tableData[0]);
      const columnsToExclude =
        servicesPayload.viewtype == "plan"
          ? [
              "id",
              "userType",
              "customerId",
              "lvl",
              "keyAttr",
              "parentAttr",
              "engPartner",
              "clientPartner",
              "is_prospect",
              "btnCls",
              "classId",
              "countryId",
              "salesPartnerId",
              "clientPartnerId",
              "CSLPartnerId",
              "delPartnerId",
              "engPartnerId",
            ]
          : [
              "id",
              "userType",
              "customerId",
              // "customer",
              // "country",
              "lvl",
              "keyAttr",
              "parentAttr",
              // "CSLPartner",
              "engPartner",
              "clientPartner",
              "is_prospect",
              "btnCls",
              "classId",
              "countryId",
              "salesPartnerId",
              "clientPartnerId",
              "CSLPartnerId",
              "delPartnerId",
              "engPartnerId",
            ]; // Add other columns to exclude

      // Filter out excluded columns
      const filteredHeaders = headers.filter(
        (header) => !columnsToExclude.includes(header)
      );

      const uniqueHeaders = [...new Set(filteredHeaders)];
      let tabData =
        servicesPayload.viewtype == "actual"
          ? tableData?.filter((cols) => cols.id != "-2")
          : servicesPayload.viewtype == "compare"
          ? tableData?.filter((cols) => cols.id != "-2" && cols.id != "-3")
          : (servicesPayload.viewtype == "view" ||
              servicesPayload.viewtype == "plan") &&
            tableData?.filter((cols) => cols.id != "-2");

      const worksheetData = tabData.map((item) =>
        uniqueHeaders.map((header) => {
          const value = item[header];

          if (typeof value === "string") {
            // Split the value and take the first part
            return value?.split("^")[0];
          }
          if (typeof value === "object") {
            return value?.props?.children[1];
          } else {
            return value;
          }
        })
      );

      const dataRows = worksheetData.map((item) => Object.values(item));

      const workbook = new ExcelJS.Workbook();
      let fileName =
        servicesPayload.viewtype == "actual"
          ? "AccountPlan(actuals).xlsx"
          : servicesPayload.viewtype == "compare"
          ? "AccountPlan(compare).xlsx"
          : servicesPayload.viewtype == "view"
          ? "AccountPlan(view).xlsx"
          : "AccountPlan(plan).xlsx";
      const worksheet = workbook.addWorksheet("Data");
      for (let i = 0; i < dataRows.length; i++) {
        const row = worksheet.addRow(dataRows[i]);
      }
      const boldRow = [1, 2];
      boldRow.forEach((index) => {
        const row = worksheet.getRow(index);
        row.font = { bold: true };
      });
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
      });
      //   workbook.xlsx.writeBuffer().then((buffer) => {
      //     saveAs(new Blob([buffer]), fileName.xlsx);
      //   });
    });
  };

  useEffect(() => {
    getMenus();
    getcountryDropdown();
    getengCompanyDropdown();
    handleCsl();
    getDeliveryPartners();
    resourceFnc();
    // getCustomers();
  }, [dataAcess]);
  //============================ API Calls ==============================
  const getcountryDropdown = () => {
    axios.get(baseUrl + `/CommonMS/master/getCountries`).then((resp) => {
      const data = resp.data;

      const dropdownOptions = data.map((item) => {
        return {
          value: item.id,
          label: item.country_name,
        };
      });

      setcountry(dropdownOptions);
      // if (id !== null) {
      setselectedcountry(dropdownOptions);
      // }
    });
  };

  useEffect(() => {
    let countryList = [];
    country.forEach((d) => {
      countryList.push(d.value);
    });
    setservicesPayload((prevVal) => ({
      ...prevVal,
      ["countries"]: countryList.length == 8 ? "-1" : countryList.toString(),
    }));
  }, [country]);

  useEffect(() => {
    let classification = [];
    selectedClassifications.forEach((d) => {
      classification.push(d.value);
    });
    setservicesPayload((prev) => ({
      ...prev,
      ["Classification"]:
        classification.length == 5 ? "-1" : classification.toString(),
    }));
  }, []);

  const getengCompanyDropdown = () => {
    axios.get(baseUrl + `/CommonMS/master/getCompany`).then((resp) => {
      const data = resp.data;
      const dropdownOptions = data.map((item) => {
        return {
          value: item.id,
          label: item.company_name,
        };
      });
      setengComp(dropdownOptions);
      // if (id == null) {
      setselectedengComp(dropdownOptions);
      // }
      // setviewDataPayload(prevState => {
      //     return {...prevState,["Divisions"]:String(dropdownOptions.map(item=> item.value))}
      // });
      // settargetDataPayload(prevState => {
      //     return {...prevState,["Divisions"]:String(dropdownOptions.map(item=> item.value))}
      // });
    });
  };

  const handleCsl = () => {
    // const loggedUser = "0";
    axios({
      method: "get",
      url:
        baseUrl +
        `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`,
    }).then((Response) => {
      let departments = [];
      let deptIds = [];
      let data = Response.data;
      data.push({ id: 0, PersonName: "UnAssigned" });
      data.length > 0 &&
        data.forEach((e) => {
          let countryObj = {
            label: e.PersonName,
            value: e.id,
          };
          departments.push(countryObj);
          deptIds.push(countryObj.value);
        });
      setCslList(departments);
      setSelectedCsl(departments);
      const formattedString = deptIds.join(",");
      setDropCslId(formattedString);
      setservicesPayload((prevVal) => ({
        ...prevVal,
        ["CslId"]:
          data.length == departments.length ? "-1" : departments.toString(),
      }));
    });
  };

  const getDeliveryPartners = () => {
    axios
      .get(baseUrl + `/administrationms/subkconversiontrend/getdeliverypartner`)
      .then((Response) => {
        let deliver = [];
        let deliveryId = [];
        let data = Response.data;
        data.push({ id: 0, PersonName: "UnAssigned" });
        data.length > 0 &&
          data.forEach((e) => {
            let deliverObj = { label: e.PersonName, value: e.id };
            deliver.push(deliverObj);
            deliveryId.push(deliverObj.value);
          });
        setDelivery(deliver);
        setSelectedDelivery(deliver);
        const formattedDelIds = deliveryId.join(",");
        setDpIds(formattedDelIds);
        setservicesPayload((prevVal) => ({
          ...prevVal,
          ["DpId"]: data.length == deliver.length ? "-1" : deliver.toString(),
        }));
      });
  };

  const resourceFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then((res) => {
      let manger = res.data;
      setResource(manger);
      setResource1(manger);
    });
  };

  // const getCustomers = () => {
  //   axios.get(baseUrl + `/customersms/Customers/getCustomers`).then((resp) => {
  //     setCustomer(resp.data);
  //   });
  // };

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const urlPathValue = resp.data[6].subMenus[1].url_path;
      const modifiedUrlPath = urlPathValue.replace(/::/g, "/");
      getUrlPath(modifiedUrlPath);
      let data = resp.data;

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
      const fianacialplan = data
        .find((item) => item.display_name === "Customers")
        .subMenus.find(
          (subMenu) => subMenu.display_name === "Financial Plan & Review"
        );
      const accessLevel = fianacialplan.userRoles.includes("919")
        ? 919
        : fianacialplan.userRoles.includes("126")
        ? 126
        : fianacialplan.userRoles.includes("932")
        ? 932
        : fianacialplan.userRoles.includes("690")
        ? 690
        : fianacialplan.userRoles.includes("641")
        ? 641
        : fianacialplan.userRoles.includes("307")
        ? 307
        : null;

      setDataAcess(accessLevel);
      if (
        accessLevel == 126 ||
        accessLevel == 919 ||
        accessLevel == 307 ||
        accessLevel == 932
      ) {
        axios
          .get(baseUrl + `/customersms/Customers/getCustomers`)
          .then((resp) => {
            setCustomer(resp.data);
          });
      } else if (accessLevel == 690) {
        axios
          .get(
            baseUrl +
              `/ProjectMS/project/getCustomersByDP?loggedUserId=${loggedUserId}`
          )
          .then((resp) => {
            setCustomer(resp.data);
          });
      } else if (accessLevel == 641) {
        axios
          .get(
            baseUrl +
              `/ProjectMS/project/getCustomersByCsl?loggedUserId=${loggedUserId}`
          )
          .then((resp) => {
            setCustomer(resp.data);
          });
      }
    });
  };

  const getUrlPath = (modifiedUrlPath) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };
  const handleSaveClick = () => {
    const postData = {
      type: servicesPayload.viewtype,
      classificationIds: servicesPayload.Classification,
      countryIds: servicesPayload.countries,
      month: servicesPayload.quarter,
      duration: servicesPayload.duration,
      status: servicesPayload.custstatus,
      customer: servicesPayload.customerId,
      aeId: servicesPayload.accountExecutiveId,
      cpId: "-1",
      dpId: servicesPayload.DpId,
      epId: "-1",
      engComp: servicesPayload.engComp,
      monthpick: servicesPayload.monthsel,
      isExport: "0",
      isCSL: false,
      isLimitedAccess: false,
      key: "1698211090178",
      cslResId: servicesPayload.CslId,
    };

    setValidation("");
    setTableData([]);

    let valid = GlobalValidation(ref);

    if (valid === true) {
      setValidationMessage(true);
      setLoader(false);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      return;
    } else {
      abortController.current = new AbortController();
      const loaderTime = setTimeout(() => {
        setLoader(true);
      }, 2000);
      axios({
        method: "POST",
        url: baseUrl + `/customersms/financialPlanandReview/getAccountPlan`,
        data: postData,
      }).then((response) => {
        servicesPayload.viewtype == "compare"
          ? setCompareTable(true)
          : servicesPayload.viewtype == "actual"
          ? setActualTable(true)
          : servicesPayload.viewtype == "plan"
          ? setPlanTable(true)
          : servicesPayload.viewtype == "view" && setViewTable(true);
        setTableData(response.data.data);
        setSearchTable(true);
        setReportRunId(response.data.reportRunId);
        setLoader(false);
        clearTimeout(loaderTime);

        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setValidationMessage(false);
        setTimeout(() => {
          setValidationMessage(false);
        }, 3000);
      });
    }
  };

  const validationMs = (v) => {
    setValidation(v);
    setTimeout(() => {
      setValidation("");
    }, 2000);
    scrollToTarget(targetElementRef);
  };
  const scrollToTarget = (targetElementRef) => {
    var body = document.body,
      html = document.documentElement;
    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    if (targetElementRef.current) {
      targetElementRef.current.scrollIntoView({
        top: 0,
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
    }
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
  const HelpPDFName = "Financial Plan and Review.pdf";
  const Headername = "Financial Plan and Review Help";
  return (
    <div>
      <div ref={targetElementRef}>
        {validation == "noChange" ? (
          <div className="statusMsg error">
            <AiFillWarning />
            No Modifications found to save
          </div>
        ) : (
          validation == "save" && (
            <div className="statusMsg success">
              <FaCheck /> "Data saved successfully"
            </div>
          )
        )}
        {validationmessage ? (
          <div className="statusMsg error">
            {" "}
            <AiFillWarning /> Please select valid values for highlighted fields
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Financial Plan and Review</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader">
          {/* <h2>Search Filters</h2> */}

          <div onClick={() => financeHandleClick()}></div>
        </div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="viewtype">
                  View Type
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="viewtype"
                    className="col-md-12 col-sm-12 col-xs-12 "
                    value={viewType}
                    onChange={(e) => {
                      onFilterChange({
                        id: "viewtype",
                        value: e.target.value,
                      });
                      setservicesPayload((prev) => ({
                        ...prev,
                        ["viewtype"]: e.target.value,
                      }));
                      setViewType(e.target.value);
                      setSearchTable(false)
                    }}
                  >
                    <option value="plan">Planning</option>
                    <option value="actual">Actuals</option>
                    <option value="compare">Compare</option>
                    <option value="view">View</option>
                  </select>
                </div>
              </div>
            </div>
            {["plan", "actual", "compare"].includes(viewType) && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Classification">
                    Classification &nbsp;
                    <span className="col-1 p-0 error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      options={Classifications}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      disabled={false}
                      ArrowRenderer={ArrowRenderer}
                      value={selectedClassifications}
                      valueRenderer={generateDropdownLabel}
                      onChange={(s) => {
                        setSelectedClassifications(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });

                        onFilterChange({
                          id: "Classification",
                          value: selected,
                        });
                        setservicesPayload((prev) => ({
                          ...prev,
                          ["Classification"]:
                            selectedClassifications.length == 5
                              ? "-1"
                              : selected.toString(),
                        }));
                        // setClassification(selected.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="reslocation">
                  Res. Location &nbsp;
                  <span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    options={country}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedcountry}
                    disabled={false}
                    valueRenderer={generateDropdownLabel}
                    onChange={(s) => {
                      setselectedcountry(s);
                      let selected = s.map((item) => {
                        return item.value;
                      });
                      onFilterChange({
                        id: "countries",
                        value: selected,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            {["plan", "actual", "compare"].includes(viewType) && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Quarter">
                    Quarter{" "}
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <DatePicker
                      className="disabledFieldLook"
                      selected={startDate}
                      onChange={(e) => {
                        setStartDate(e);
                        const date = new Date(e.getTime());
                        date.setFullYear(date.getFullYear() - 1);
                        date.setMonth(date.getMonth() + 3);
                        onFilterChange({
                          id: "quarter",
                          value: date.toLocaleDateString("en-CA"),
                        });
                      }}
                      dateFormat="'FY' yyyy-QQQ"
                      showQuarterYearPicker
                    />
                  </div>
                </div>
              </div>
            )}
            {["plan", "compare"].includes(viewType) && (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">Duration</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6">
                    <select
                      id="duration"
                      name="duration"
                      className="col-md-12 col-sm-12 col-xs-12 "
                      defaultValue={"4"}
                      value={quarterDuration}
                      onChange={(e) => {
                        setQuarterDuration(e.target.value);
                        onFilterChange({
                          id: "duration",
                          value: e.target.value,
                        });
                      }}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </span>
                </div>
              </div>
            )}
            {["view"].includes(viewType) && (
              <div className="col-md-3 mb-2">
                <div className="form-group row ">
                  <label className="col-5" htmlFor="email-input">
                    From Month
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 datepicker"
                    style={{ zIndex: 4 }}
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <DatePicker
                      onChange={(e) => {
                        // setStartDate(e);
                        //   const date = new Date(e.getTime());
                        //   date.setFullYear(date.getFullYear() - 1);
                        //   date.setMonth(date.getMonth() + 3);
                        onFilterChange({
                          id: "monthsel",
                          value:
                            // date.toLocaleDateString("en-CA")
                            moment(e).format("yyyy-MM-DD"),
                        });

                        SetDate(e);
                      }}
                      selected={date}
                      dateFormat="MMM-yyyy"
                      showMonthYearPicker
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {["view"].includes(viewType) && (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">Duration</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6">
                    <select
                      id="duration"
                      name="duration"
                      className="col-md-12 col-sm-12 col-xs-12 "
                      defaultValue={"6"}
                      onChange={(e) => {
                        setMonthDuration(e.target.value);
                        onFilterChange({
                          id: "duration",
                          value: e.target.value,
                        });
                      }}
                      value={monthDuration}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </span>
                </div>
              </div>
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="custstatus">
                  Cust. Status
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="custstatus"
                    name="custstatus"
                    className="col-md-12 col-sm-12 col-xs-12 "
                    onChange={(e) => {
                      onFilterChange(e.target);
                    }}
                    value={servicesPayload.custstatus}
                  >
                    <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="active">Having Allocations</option>
                    <option value="inactive">No Allocations</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customer">
                  Customer{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 autoComplete-container react  cancel  reactsearchautocomplete">
                  <ReactSearchAutocomplete
                    items={customer}
                    type="Text"
                    name="resource"
                    id="customer"
                    className="err text cancel nochange"
                    fuseOptions={{ keys: ["id", "name"] }}
                    resultStringKeyName="name"
                    placeholder="Type minimum 3 characters to get the list"
                    // resource={resource}
                    onClear={handleClearCustomer}
                    // resourceFnc={resourceFnc}
                    onSelect={(e) => {
                      onFilterChange({
                        id: "customerId",
                        value: e.id,
                      });
                      // setservicesPayload((prevProps) => ({
                      //   ...prevProps,
                      //   customerId: e.id,
                      // }));
                    }}
                    showIcon={false}
                  />
                </div>
              </div>
            </div>
            {["plan", "actual", "compare"].includes(viewType) && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="accountexecutive">
                    Account Executive{" "}
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6 autoComplete-container react  cancel  reactsearchautocomplete">
                    <ReactSearchAutocomplete
                      items={resource1}
                      type="Text"
                      name="resource"
                      id="accountExecutive"
                      className="err text cancel nochange"
                      fuseOptions={{ keys: ["id", "name"] }}
                      resultStringKeyName="name"
                      placeholder="Type minimum 3 characters to get the list"
                      resource1={resource1}
                      onClear={handleClearAccountExecutive}
                      resourceFnc={resourceFnc}
                      onSelect={(e) => {
                        onFilterChange({
                          id: "accountExecutiveId",
                          value: e.id,
                        });
                        // setservicesPayload((prevProps) => ({
                        //   ...prevProps,
                        //   accountExecutiveId: e.id,
                        // }));
                      }}
                      showIcon={false}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="csl">
                  CSL
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="CslId"
                    options={cslList}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedCsl}
                    valueRenderer={generateDropdownLabel}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedCsl(s);
                      let filteredCsl = [];
                      s.forEach((d) => {
                        filteredCsl.push(d.value);
                      });
                      onFilterChange({
                        id: "CslId",
                        value: filteredCsl.toString(),
                      });
                      setservicesPayload((prevVal) => ({
                        ...prevVal,
                        ["CslId"]: filteredCsl.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            {["plan", "actual", "compare"].includes(viewType) && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="deliverypartner">
                    Delivery Partner
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="DpId"
                      options={delivery}
                      hasSelectAll={true}
                      isLoading={false}
                      value={selectedDelivery}
                      valueRenderer={generateDropdownLabel}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedDelivery(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        onFilterChange({
                          id: "DpId",
                          value: filteredCountry.toString(),
                        });
                        setservicesPayload((prevVal) => ({
                          ...prevVal,
                          ["DpId"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="engcompany">
                  Eng.Company
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    options={engComp}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedengComp}
                    disabled={false}
                    valueRenderer={generateDropdownLabel}
                    onChange={(s) => {
                      setselectedengComp(s);
                      let selected = s.map((item) => {
                        return item.value;
                      });
                      onFilterChange({
                        id: "engComp",
                        value: selected.toString(),
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
              <button className="btn btn-primary " onClick={handleSaveClick}>
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {showtable == true
        ? // <FixedPriceOpenFirstTable
          //   formData={formData}
          // />
          ""
        : ""}

      <div className="col-12" style={{ padding: "0" }}>
        {/* {tableData.length > 0 &&
          reportRunId != 0 &&
          (viewTable || planTable || actualTable || compareTable) && (
            <div className="col-2 div-excel" align=" right ">
              <RiFileExcel2Line
                size="1.5em"
                title="Export to Excel"
                style={{ color: "green" }}
                cursor="pointer"
                onClick={() => {
                  exportExcel();
                }}
              />
            </div>
          )} */}

        {tableData.length > 0 &&
          reportRunId != 0 &&
          viewTable &&
          servicesPayload.viewtype == "view" && searchTable === true&& (
            <FPRViewTable
              tableData={tableData}
              reportRunId={reportRunId}
              exportExcel={exportExcel}
              servicesPayload={servicesPayload}
            />
          )}

        {tableData.length > 0 &&
          reportRunId != 0 &&
          actualTable &&
          servicesPayload.viewtype == "actual" && searchTable === true &&(
            <FPRActualsTable
              tableData={tableData}
              servicesPayload={servicesPayload}
              reportRunId={reportRunId}
              goalsPopup={goalsPopup}
              setGoalsPopup={setGoalsPopup}
              exportExcel={exportExcel}
            />
          )}
        {tableData.length > 0 &&
          reportRunId != 0 &&
          planTable &&
          servicesPayload.viewtype == "plan" && searchTable === true &&(
            <FPRPlanningTable
              tableData={tableData}
              reportRunId={reportRunId}
              goalsPopup={goalsPopup}
              setGoalsPopup={setGoalsPopup}
              servicesPayload={servicesPayload}
              loggedUserId={loggedUserId}
              handleSaveClick={handleSaveClick}
              validationMs={validationMs}
              exportExcel={exportExcel}
            />
          )}
        {tableData.length > 0 &&
          reportRunId != 0 &&
          compareTable &&
          servicesPayload.viewtype == "compare" && searchTable === true &&(
            <FPRCompareTable
              tableData={tableData}
              reportRunId={reportRunId}
              goalsPopup={goalsPopup}
              servicesPayload={servicesPayload}
              setGoalsPopup={setGoalsPopup}
              exportExcel={exportExcel}
            />
          )}
      </div>
    </div>
  );
}

export default FinancialPlanService;
