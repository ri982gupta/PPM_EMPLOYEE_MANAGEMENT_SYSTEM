import React, { useRef, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import { CCollapse } from "@coreui/react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import MonthlyForecastRevenuePopUp from "./MonthlyForecastRevenuePopUp";
import MonthlyForecastRevenueTableComponent from "./MonthlyForecastRevenueTableComponent";
import MonthlyForecastRevenueCalenderTable from "./MonthlyForecastRevenueCalenderTable";
import {
  AiOutlineException,
  AiOutlineLeftSquare,
  AiOutlineRightSquare,
} from "react-icons/ai";
import Loader from "../Loader/Loader";
import { RiFileExcel2Line } from "react-icons/ri";
import RevenueForecastBuTable from "./RevenueForecastBuTable";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import RevenueForecastBuCustomer from "./RevenueForecastBuCustomer";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import RevenueForecastHierarchy from "./RevenueForecastHierarchy";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import ExceptionReportsTable from "./ExceptionReportsTable";
import ExcelJS from "exceljs";
import { setTimeout } from "core-js";
import { useLocation } from "react-router-dom";
// import RevenueMarginMultiselect from "./RevenueMarginMultiselect";
import RevenueForecastMultiSelect from "./RevenueForecastMultiSelect";
import ReactTable from "./ReactTable";
import Utils from "../../Utils";

function RevenueForecastFilters(props) {
  const {
    capType,
    hierarchyId,
    mgrId,
    departments,
    customer,
    selectedDepartments,
    selectedEngCompany,
    selectedCsl,
    selectedDp,
    project,
    selectedEngLocation,
    resource,
    projectname,
    resourceName,
    manager,
    pmname,
    summaryBy,
    selectedSummaryBy,
    financialMeasures,
    selectview,
    selectedResLocation,
    selectedContractTerms,
    utilizationSummary,
    benchSummary,
    CustomerName,
    displayState,
    displayStateA,
    displayStateB,
    hierarchydata,
    searchingA,
    setsearchingA,
    addHandler,
    subtractHandler,
    handleDateChange,
    resLocation,
    engCompany,
    formData,
    month,
    contractTerms,
    csl,
    dp,
    selecttype,
    setSelectType,
    actionTable,
    setFormData,
    setCapType,
    setMonth,
    formattedMonth,
    setSelectView,
    engLocation,
    filteredNumbers,
    setSelectedDepartments,
    setSelectedResLocation,
    setSelectedContractorTerms,
    setSelectedEngCompany,
    setSelectedCsl,
    setSelectedDp,
    setSelectedSummaryBy,
    setSelectedEngLocation,
    setValidationMessage,
    abortController,
    loggedResourceId,
    setHierarchyId,
    setLabel,
    label,
    getSearchData,
    loggedUserId,
    displayHierarchy,
    setSearching,
    searching,
    pageurl,
    page_Name,
    setEditAddmsg,
    alloctype,
    setAlloctype,
    setSelectedalloctype,
    selectedalloctype,
    setDisplayHierarchy,
    setFinancialMeasuresFlag,
    // savedSaerchid,
    // filterData,
    allcontractterms,
    allengcompanies,
    allcsl,
    alldp,
    setDisplayState,
    setDisplayStateA,
    setDisplayStateB,
    setActionTable,
    setUtilizationSummary,
    setBenchSummary,
    dataAccess,
    setType,
    visible,
    setvisible,
    cheveronIcon,
    setCheveronIcon,
    managerProjects,
    setFinancialMeasures,
    setSelectedFinancialMeasures,
    selectedFinancialMeasures,
    toggleButton,
    setToggleButton,
    accountOwner,
    setAccountOwner,
    selectedAccountOwner,
    setSelectedAccountOwner,
    reorderFinancialMeasures,
    allAccOwner,
  } = props;

  const ref = useRef([]);
  const [BURegion, setBURegion] = useState([]);
  const [BUCustomer, setBUCustomer] = useState([]);
  const [BUPractice, setBUPractice] = useState([]);
  const [displayStateC, setDisplayStateC] = useState(false);
  const [displayStateD, setDisplayStateD] = useState(false);
  const [displayStateE, setDisplayStateE] = useState(false);
  const [ArrowBack, setArrowBack] = useState(IoIosArrowBack);
  const [visibleA, setvisibleA] = useState(false);
  const [visibleB, setvisibleB] = useState(false);
  const [visibleC, setvisiblec] = useState(false);
  const [cheveronIconA, setCheveronIconA] = useState(FaChevronCircleUp);
  const [cheveronIconB, setCheveronIconB] = useState(FaChevronCircleUp);
  const value = "UpdateBillingRate";
  let rows = 5;
  const [buttonPopup, setButtonPopup] = useState(false);
  const [actionItems, setActionItems] = useState([]);
  const [actionItemsSearching, setActionItemsSearching] = useState(false);
  const [item, setItem] = useState([]);
  const baseUrl = environment.baseUrl;
  const [exceptionReports, setExceptionReports] = useState([]);
  const [displayExceptionReports, setDisplayExceptionReports] = useState(false);
  const [reportsTable, setReportsTable] = useState(false);
  const [excel, setExcel] = useState([]);
  const [actionPopup, setActionPopup] = useState(false);
  const abortControllerRef = useRef(new AbortController());
  const loggedUserName = localStorage.getItem("resName");
  let allcsl1;
  let alldp1;
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const savedSaerchid = searchParams.get("id");
  const [filterData, setFilterData] = useState([]);
  const [typetrue, setTypeTrue] = useState(false);

  const FilterData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/FiltersData?saved_search_id=${
          savedSaerchid === null ? 0 : savedSaerchid
        }`,
    }).then(function (res) {
      const getData = res.data;
      setFilterData(getData);
    });
  };

  // useEffect(() => {
  //   if (savedSaerchid != null) {
  //     setFormData((prevFormData) => {
  //       return {
  //         ...prevFormData,
  //         type: filterData?.type, // Update the 'type' key directly
  //       };
  //     });
  //   }
  // }, [filterData]);
  // console.log(formData?.type);
  useEffect(() => {
    FilterData();
  }, [savedSaerchid]);

  const allocBeyondEndDateResult = exceptionReports[4];
  const projectsWithoutBUResult = exceptionReports[6];
  const resRateLessCostResult = exceptionReports[7];
  const resWithNegGMPerResult = exceptionReports[9];
  const resWithNoEndDateResult = exceptionReports[3];
  const resWithZeroRoleCostResult = exceptionReports[8];
  const resWithZerobillRateResult = exceptionReports[2];
  const resWithoutBUResult = exceptionReports[1];
  const resWithoutDesignationResult = exceptionReports[5];
  const tempMailsResult = exceptionReports[0];
  const resWithLastQbrResult = exceptionReports[9];

  const handleAbort = () => {
    if (abortController.current.length > 0) {
      let abort = abortController.current;
      abort.forEach((d) => d.abort());
      // abortController.abort();
    }
    setsearchingA(false);
    setDisplayHierarchy(false);
    setDisplayExceptionReports(false);
  };

  const columnsOrder =
    "Revenue,AssRevenue,ActRevenue,ApprRevenue,RecRevenue,AvgCost,RRCost,NAvgCost,NRRCost,AcGM,RRGM,NAcGM,NRRGM,capacity,billAppr,billApprNet";

  const selectedFMeasures = formData.Financialmeasures;

  const reorderedFinancialMeasures = reorderFinancialMeasures(
    columnsOrder,
    selectedFMeasures
  );

  const [acoountOwnerData, setAccountOwnerData] = useState([]);
  const [displayAccountOwner, setDisplayAccountOwner] = useState(false);
  const getAccountOwnerData = () => {
    setAccountOwnerData([]);
    setDisplayAccountOwner(false);
    const loaderTime = setTimeout(() => {
      setDisplayExceptionReports(true);
    }, 2000);
    Utils.Log(formData.AccountOwner, "formData.AccountOwner");
    abortController.current[3] = new AbortController();
    const cacheBuster = Math.random();
    axios({
      method: "post",
      url:
        baseUrl +
        `/revenuemetricsms/metrics/accountOwner?cacheBuster=${cacheBuster}`,
      signal: abortController.current[3].signal,
      data: {
        accIds:
          // formData.AccountOwner
          allAccOwner,
        ResType: formData.ResType,
        FromDt: formattedMonth,
        FBy: "country",
        Countries: formData.ResLocation,
        FMeasure: reorderedFinancialMeasures,
        SaltKey: "AAAAB3NzaC1yc2EAAAABJQAAAIEAkwFrmz0JNpn8",
        contTerms: allcontractterms,
        engComps: allengcompanies,
        cslIds: allcsl,
        dpIds: alldp,
        UserId: loggedUserId,
      },
    }).then((response) => {
      Utils.Log(response, "response>>>>>>>>>");
      Utils.Log(response.data, "response.data>>>>>>>>>");
      let TableData = response.data.tableData;
      let TableFilterData = TableData?.filter((d) => d?.id != 999);
      response.data["tableData"] = TableFilterData;
      Utils.Log(TableFilterData, "TableFilterData>>>>>>>>>");
      Utils.Log(response.data, "response.data--------------------->>>>>>>>>");
      setAccountOwnerData([]);
      setAccountOwnerData(response.data);
      setDisplayAccountOwner(true);
      setDisplayExceptionReports(false);
      clearTimeout(loaderTime);
      let valid = GlobalValidation(ref);
      setSearching(false);
      !valid && setvisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };

  const handleBuAbort = () => {
    // Cancel the ongoing requests
    abortControllerRef.current.abort();

    // Reset your searching state and other UI states as needed
    setSearching(false);
  };
  ////////////////----------Exception Reports--------------////////////////////
  const ExceptionReports = () => {
    setExceptionReports([]);
    setReportsTable(false);
    setActionPopup(false);
    const loaderTime = setTimeout(() => {
      setDisplayExceptionReports(true);
    }, 2000);
    setDisplayStateA(false);
    setDisplayState(false);
    setDisplayStateB(false);
    setDisplayStateC(false);
    setDisplayStateE(false);
    setDisplayStateD(false);
    abortController.current[2] = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/revenuemetricsms/metrics/getExceptionReports`,
      signal: abortController.current[2].signal,

      data: {
        filterType:
          formData.type == "Business Unit"
            ? "businessUnit"
            : formData.type == "Primary PM"
            ? "primaryPm"
            : formData.type,
        contextVal:
          selecttype == "Business Unit"
            ? formData.BusinessUnit
            : selecttype == "customer"
            ? formData.Customer
            : selecttype == "project"
            ? formData.Project
            : selecttype == "resource"
            ? formData["Resource Name"]
            : selecttype == "Primary PM"
            ? formData["Primary PM"]
            : "",
        fromDt: formattedMonth,
        countries: formData.ResLocation,
        resType: formData.ResType,
        cslIds: allcsl,
        dpIds: alldp,
        loggedUserId: loggedUserId,
      },
    }).then((response) => {
      setExceptionReports(response.data);
      setReportsTable(true);
      setDisplayExceptionReports(false);
      clearTimeout(loaderTime);
      let valid = GlobalValidation(ref);
      setSearching(false);
      !valid && setvisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };
  const norecords = (obj1FilterData) => {
    const emptyObject = {};
    Object.keys(obj1FilterData[1]).forEach((key, value) => {
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

    obj1FilterData[2] = emptyObject;
  };
  const handleResponse = (obj1, obj2, obj3) => {
    setReportsTable(false);

    if (obj1.data.value?.includes("Region")) {
      let obj1TableData = obj1.data.tableData;
      let obj1FilterData = obj1TableData?.filter((d) => d?.id != 999);
      obj1.data["tableData"] = obj1FilterData;

      if (obj1FilterData.length === 2) {
        norecords(obj1FilterData);
        setBURegion(obj1.data);
      } else {
        setBURegion(obj1.data);
      }

      setDisplayStateC(true);
    } else if (obj1.data.value?.includes("Practice")) {
      let obj1TData = obj1.data.tableData;
      let obj1FilterData = obj1TData?.filter((d) => d?.id != 999);
      obj1.data["tableData"] = obj1FilterData;

      if (obj1FilterData.length === 2) {
        norecords(obj1FilterData);
        setBUPractice(obj1.data);
      } else {
        setBUPractice(obj1.data);
      }
      setDisplayStateD(true);
    } else if (obj1.data.value?.includes("Customer")) {
      let obj1TD = obj1.data.tableData;
      let obj1FilterData = obj1TD?.filter((d) => d?.id != 999);
      obj1.data["tableData"] = obj1FilterData;

      if (obj1FilterData.length === 2) {
        norecords(obj1FilterData);
        setBUCustomer(obj1.data);
      } else {
        setBUCustomer(obj1.data);
      }
      // setToggleButton(true);

      setDisplayStateE(true);
    }
    if (obj2 !== undefined) {
      if (obj2.data.value?.includes("Region")) {
        let obj2TableData = obj2.data.tableData;
        let obj1FilterData = obj2TableData?.filter((d) => d?.id != 999);
        obj2.data["tableData"] = obj1FilterData;
        if (obj1FilterData.length === 2) {
          norecords(obj1FilterData);
          setBURegion(obj2.data);
        } else {
          setBURegion(obj2.data);
        }
        setDisplayStateC(true);
      } else if (obj2.data.value?.includes("Practice")) {
        let obj2TData = obj2.data.tableData;
        let obj1FilterData = obj2TData?.filter((d) => d?.id != 999);
        obj2.data["tableData"] = obj1FilterData;

        if (obj1FilterData.length === 2) {
          norecords(obj1FilterData);
          setBUPractice(obj2.data);
        } else {
          setBUPractice(obj2.data);
        }
        setDisplayStateD(true);
      } else if (obj2.data.value?.includes("Customer")) {
        let obj2TD = obj2.data.tableData;
        let obj1FilterData = obj2TD?.filter((d) => d?.id != 999);
        obj2.data["tableData"] = obj1FilterData;
        if (obj1FilterData.length === 2) {
          norecords(obj1FilterData);
          setBUCustomer(obj2.data);
        } else {
          setBUCustomer(obj2.data);
        }
        // setToggleButton(true);
        setDisplayStateE(true);
      }
    }
    if (obj3 !== undefined) {
      if (obj3.data.value?.includes("Region")) {
        let obj3TableData = obj3.data.tableData;
        let obj1FilterData = obj3TableData?.filter((d) => d?.id != 999);
        obj3.data["tableData"] = obj1FilterData;
        if (obj1FilterData.length === 2) {
          norecords(obj1FilterData);
          setBURegion(obj3.data);
        } else {
          setBURegion(obj3.data);
        }
        setDisplayStateC(true);
      } else if (obj3.data.value?.includes("Practice")) {
        let obj3TData = obj3.data.tableData;
        let obj1FilterData = obj3TData?.filter((d) => d?.id != 999);
        obj3.data["tableData"] = obj1FilterData;
        if (obj1FilterData.length === 2) {
          norecords(obj1FilterData);
          setBUPractice(obj3.data);
        } else {
          setBUPractice(obj3.data);
        }
        setDisplayStateD(true);
      } else if (obj3.data.value?.includes("Customer")) {
        let obj3TD = obj3.data.tableData;
        let obj1FilterData = obj3TD?.filter((d) => d?.id != 999);
        obj3.data["tableData"] = obj1FilterData;
        if (obj1FilterData.length === 2) {
          norecords(obj1FilterData);
          setBUCustomer(obj3.data);
        } else {
          setBUCustomer(obj3.data);
        }
        setDisplayStateE(true);
        // setToggleButton(true);
      }
    }
    let valid = GlobalValidation(ref);
    setSearching(false);
    !valid && setvisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
  };
  ///==============For Saved Search ================================

  const dpArray = filterData?.Dp?.split(",");
  alldp1 = dpArray?.length === dp?.length ? "-1" : filterData?.Dp;
  const cslArray = filterData.Csl?.split(",");
  allcsl1 = cslArray?.length === csl?.length ? "-1" : filterData?.Csl;

  useEffect(() => {
    if (savedSaerchid && filterData) {
      setTimeout(() => {
        handleSavedSearch();
      }, 4000);
    }
  }, [filterData]);
  const handleSavedSearch = () => {
    const updateSelectview = filterData.View;
    setSelectView(updateSelectview);
    setvisibleA(false);
    setvisibleB(false);
    setActionTable([]);
    setUtilizationSummary([]);
    setBenchSummary([]);
    setDisplayStateB(false);
    setDisplayState(false);
    setDisplayStateA(false);
    setBURegion([]);
    setBUPractice([]);
    setBUCustomer([]);
    setDisplayStateC(false);
    setDisplayStateD(false);
    setDisplayStateE(false);
    // Cancel the previous requests before making new ones
    abortControllerRef.current.abort();

    // Create a new AbortController instance for the current search
    abortControllerRef.current = new AbortController();

    setActionPopup(false);
    setReportsTable(false);
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid == true) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
    }

    if (valid) {
      return;
    }
    if (filterData?.type == "Hierarchy") {
      setvisiblec(true);
    }
    if (filterData.View === "consol") {
      let apiArr = [];
      const summary = filterData?.summaryBy;
      const values = selectedSummaryBy.map((item) => {
        switch (item.value) {
          case "Region":
            apiArr.push(
              axios.post(
                baseUrl + `/revenuemetricsms/metrics/postRegionUtilization`,
                {
                  BUIds: filterData?.BusinessUnit,
                  ResType: filterData.ResType,
                  FromDt: formattedMonth,
                  FBy: "country",
                  Countries: filterData.ResLocation,
                  FMeasure: filterData.Financialmeasures,
                  SaltKey: "AAAAB3NzaC1yc2EAAAABJQAAAIEAkwFrmz0JNpn8",
                  contTerms:
                    filterData.ContractTerms ===
                    "28,27,752,606,26,25,1024,612,608,609,610,611,750"
                      ? "-1"
                      : filterData.ContractTerms,
                  engComps: filterData.EngCompany,
                  cslIds: allcsl1,
                  dpIds: alldp1,
                  UserId: loggedUserId,
                },
                { signal: abortControllerRef.current.signal }
              )
            );
            break;

          case "Practice":
            apiArr.push(
              axios.post(
                baseUrl + `/revenuemetricsms/metrics/postBUUtilization`,
                {
                  BUIds: filterData.BusinessUnit,
                  ResType: filterData.ResType,
                  FromDt: formattedMonth,
                  FBy: "country",
                  Countries: filterData.ResLocation,
                  FMeasure: filterData.Financialmeasures,
                  // SaltKey: "AAAAB3NzaC1yc2EAAAABJQAAAIEAkwFrmz0JNpn8",
                  contTerms:
                    filterData.ContractTerms ==
                    "28,27,752,606,26,25,1024,612,608,609,610,611,750"
                      ? "-1"
                      : filterData.ContractTerms,
                  engComps: filterData.EngCompany,
                  cslIds: allcsl1,
                  dpIds: alldp1,
                  UserId: loggedUserId,
                },
                { signal: abortControllerRef.current.signal }
              )
            );
            break;

          case "Customer":
            apiArr.push(
              axios.post(
                baseUrl + `/revenuemetricsms/metrics/postCustomerConsolidation`,
                {
                  BUIds: filterData.BusinessUnit,
                  ResType: filterData.ResType,
                  FromDt: filterData.FromDt,
                  FBy: "country",
                  Countries: filterData.ResLocation,
                  FMeasure: filterData.Financialmeasures,
                  SaltKey: "AAAAB3NzaC1yc2EAAAABJQAAAIEAkwFrmz0JNpn8",
                  contTerms:
                    filterData.ContractTerms ===
                    "28,27,752,606,26,25,1024,612,608,609,610,611,750"
                      ? "-1"
                      : filterData.ContractTerms,
                  engComps: filterData.EngCompany,
                  cslIds: allcsl1,
                  dpIds: alldp1,
                  UserId: loggedUserId,
                },
                { signal: abortControllerRef.current.signal }
              )
            );
            break;

          default:
            break;
        }
        return item.value;
      });

      axios.all(apiArr).then(
        axios.spread((obj1, obj2, obj3) => {
          handleResponse(obj1, obj2, obj3);
        })
      );
    } else {
      getSearchDataSavedSearch();
    }
  };

  const getSearchDataSavedSearch = () => {
    const loaderTime = setTimeout(() => {
      setsearchingA(true);
    }, 2000);
    abortController.current[1] = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/revenuemetricsms/metrics/search`,
      signal: abortController.current[1].signal,
      data: {
        Typ: filterData.captype,
        ObjectId:
          filterData?.type == "Business Unit"
            ? filterData.BusinessUnit
            : filterData?.type == "Hierarchy"
            ? +filterData?.Name
            : filterData?.type == "customer"
            ? filterData.Customer
            : filterData?.type == "project"
            ? filterData.Project
            : filterData?.type == "resource"
            ? filterData["Resource Name"]
            : filterData?.type == "Primary PM"
            ? mgrId
            : "",
        FromDt: formattedMonth,
        AllocType: filterData.AllocType,
        FilterType:
          filterData?.type == "Primary PM" ? "project" : filterData.type,
        FBy: "country",
        Countries: filterData.ResLocation,
        Measure: filterData.measure,
        ResType: filterData.ResType,
        FMeasure: filterData.Financialmeasures,
        PrjSource: filterData.Source,
        EngCountries: filterData.engLocation,
        avgFilterType: filterData.Avg,
        avgFilterVal: filterData.avgtextvalue,
        contTerms:
          filterData.ContractTerms ===
          "28,27,752,606,26,25,1024,612,608,609,610,611,750"
            ? "-1"
            : filterData.ContractTerms,
        engComps: filterData.EngCompany,
        SaltKey: "AAAAB3NzaC1yc2EAAAABJQAAAIEAkwFrmz0JNpn8",
        cslIds: allcsl1,
        dpIds: alldp1,
        UserId: loggedUserId,
      },
    }).then((response) => {
      let rp = response.data;
      setActionTable([]);
      setActionTable(rp[0]);
      setUtilizationSummary(response.data[1]);
      setBenchSummary(response.data[2]);
      setTimeout(() => {
        if (rp.length > 0 && filterData?.type != undefined) {
          setDisplayStateB(true);
          setDisplayState(true);
          setDisplayStateA(true);
          setSearching(false);
          setsearchingA(false);
          let valid = GlobalValidation(ref);
          !valid && setvisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        }
      }, 4000);
    });
  };
  //================================================================
  const handleSearch = () => {
    setvisibleA(false);
    setvisibleB(false);
    setActionTable([]);
    setUtilizationSummary([]);
    setBenchSummary([]);
    setDisplayStateB(false);
    setDisplayState(false);
    setDisplayStateA(false);
    setBURegion([]);
    setBUPractice([]);
    setBUCustomer([]);
    setDisplayStateC(false);
    setDisplayStateD(false);
    setDisplayStateE(false);
    // Cancel the previous requests before making new ones
    abortControllerRef.current.abort();

    // Create a new AbortController instance for the current search
    abortControllerRef.current = new AbortController();

    setActionPopup(false);
    setReportsTable(false);
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid == true) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
    }

    if (valid) {
      return;
    }
    if (selecttype == "Hierarchy") {
      setvisiblec(true);
    }

    // (['a','b','c','d']).includes(condition)
    if (formData.View == "consol") {
      const loaderTime = setTimeout(() => {
        setSearching(true);
      }, 2000);
      let apiArr = [];
      const selectedFinancialMeasures = formData.Financialmeasures;

      const reorderedFinancialMeasures = reorderFinancialMeasures(
        columnsOrder,
        selectedFinancialMeasures
      );
      const RegioncolumnsOrder =
        "Revenue,AssRevenue,ActRevenue,ApprRevenue,RecRevenue,AvgCost,RRCost,NAvgCost,NRRCost,BenchCost,AcGM,RRGM,NAcGM,NRRGM,capacity,billAppr,billApprNet";
      const reorderedRegionFinancialMeasures = reorderFinancialMeasures(
        RegioncolumnsOrder,
        selectedFinancialMeasures
      );
      const values = selectedSummaryBy.map((item) => {
        switch (item.value) {
          case "Region":
            apiArr.push(
              axios.post(
                baseUrl + `/revenuemetricsms/metrics/postRegionUtilization`,
                {
                  BUIds: formData.BusinessUnit,
                  ResType: formData.ResType,
                  FromDt: formattedMonth,
                  FBy: "country",
                  Countries: formData.ResLocation,
                  FMeasure: reorderedRegionFinancialMeasures,
                  SaltKey: "AAAAB3NzaC1yc2EAAAABJQAAAIEAkwFrmz0JNpn8",
                  contTerms: allcontractterms,
                  engComps: allengcompanies,
                  cslIds: allcsl,
                  dpIds: alldp,
                  UserId: loggedUserId,
                },
                { signal: abortControllerRef.current.signal }
              )
            );
            break;

          case "Practice":
            apiArr.push(
              axios.post(
                baseUrl + `/revenuemetricsms/metrics/postBUUtilization`,
                {
                  BUIds: formData.BusinessUnit,
                  ResType: formData.ResType,
                  FromDt: formattedMonth,
                  FBy: "country",
                  Countries: formData.ResLocation,
                  FMeasure: reorderedFinancialMeasures,
                  // SaltKey: "AAAAB3NzaC1yc2EAAAABJQAAAIEAkwFrmz0JNpn8",
                  contTerms: allcontractterms,
                  engComps: allengcompanies,
                  cslIds: allcsl,
                  dpIds: alldp,
                  UserId: loggedUserId,
                },
                { signal: abortControllerRef.current.signal }
              )
            );
            break;

          case "Customer":
            apiArr.push(
              axios.post(
                baseUrl + `/revenuemetricsms/metrics/postCustomerConsolidation`,
                {
                  BUIds: formData.BusinessUnit,
                  ResType: formData.ResType,
                  FromDt: formattedMonth,
                  FBy: "country",
                  Countries: formData.ResLocation,
                  FMeasure: reorderedFinancialMeasures,
                  SaltKey: "AAAAB3NzaC1yc2EAAAABJQAAAIEAkwFrmz0JNpn8",
                  contTerms: allcontractterms,
                  engComps: allengcompanies,
                  cslIds: allcsl,
                  dpIds: alldp,
                  UserId: loggedUserId,
                },
                { signal: abortControllerRef.current.signal }
              )
            );
            break;

          default:
            break;
        }

        return item.value;
      });

      axios.all(apiArr).then(
        axios.spread((obj1, obj2, obj3) => {
          clearTimeout(loaderTime);
          setSearching(false);
          handleResponse(obj1, obj2, obj3);
        })
      );
    } else if (formData.View == "Account Owner") {
      getAccountOwnerData();
    } else {
      getSearchData();
      setDisplayAccountOwner(false);
    }
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setHierarchyId(e.target.value);
    setFormData((prevVal) => ({
      ...prevVal,
      ["Name"]: e.target.value,
    }));
    setSelectType(value);
    setType(value);
    setSelectView(value);
    setValidationMessage(false);
  };

  const handleActionItems = () => {
    const loaderTime = setTimeout(() => {
      setActionItemsSearching(true);
    }, 2000);

    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/revenuemetricsms/metrics/getResourceActionItems`,
      signal: abortController.current.signal,
      data: {
        resIds: "" + filteredNumbers,
        fromDt: moment().startOf("month").format("YYYY-MM-DD"),
        toDt: moment().endOf("month").format("YYYY-MM-DD"),
      },
    }).then(function (response) {
      let tabledata = response.data;
      let headerData = [
        {
          resource: "Resource",
          created_dt: "Entry Dt",
          createdby: "Entry By",
          lkup_name: "Category",
          effective_dt: "Effective Dt",
          completed_dt: "Completed Dt",
          comments: "Comments",
        },
      ];
      setActionItems(headerData.concat(response.data));

      setActionItemsSearching(false);
      clearTimeout(loaderTime);
    });
  };
  const handleOnExport = () => {
    import("xlsx").then((xlsx) => {
      let desiredColumnOrder = [];
      let cols = [];
      let filename = null;
      let finalColumns = null;
      let finalTableData = null;
      if (excel?.value == "resWithMailsTemp") {
        filename = "StaffWithInvalidEmailIDReport";
        finalColumns = tempMailsResult?.columnData;
        finalTableData = tempMailsResult?.tableData;
      } else if (excel?.value == "resourceWithoutBUMappingTemp") {
        filename = "StaffwithoutBUMappingReport";
        finalColumns = resWithoutBUResult?.columnData;
        finalTableData = resWithoutBUResult?.tableData;
      } else if (excel?.value == "resWithZerobillRateResult") {
        filename = "StaffwithnobillrateReport";
        finalColumns = resWithZerobillRateResult?.columnData;
        finalTableData = resWithZerobillRateResult?.tableData;
      } else if (excel?.value == "resWithNoEndDateResult") {
        filename = "InactiveStaffwithMissingStartorEndDateReport";
        finalColumns = resWithNoEndDateResult?.columnData;
        finalTableData = resWithNoEndDateResult?.tableData;
      } else if (excel?.value == "allocBeyondEndDateResult") {
        filename = "InActiveStaffwithAllocationsafterEndDateReport";
        finalColumns = allocBeyondEndDateResult?.columnData;
        finalTableData = allocBeyondEndDateResult?.tableData;
      } else if (excel?.value == "resWithoutDesignationResult") {
        filename = "StaffwithmissingDesignationReport";
        finalColumns = resWithoutDesignationResult?.columnData;
        finalTableData = resWithoutDesignationResult?.tableData;
      } else if (excel?.value == "projectsWithoutBUResult") {
        filename = "ProjectswithmissingBUReport";
        finalColumns = projectsWithoutBUResult?.columnData;
        finalTableData = projectsWithoutBUResult?.tableData;
      } else if (excel?.value == "resRateLessCostResult") {
        filename = "StaffwithBillratelowerthanCostRateReport";
        finalColumns = resRateLessCostResult?.columnData;
        finalTableData = resRateLessCostResult?.tableData;
      } else if (excel?.value == "resWithZeroRoleCostResult") {
        filename = "StaffwithNoCostRateReport";
        finalColumns = resWithZeroRoleCostResult?.columnData;
        finalTableData = resWithZeroRoleCostResult?.tableData;
      } else if (excel?.value == "resWithNegGMPerResult") {
        filename = "StaffWithNegativeGMPercentReport";
        finalColumns = resWithNegGMPerResult?.columnData;
        finalTableData = resWithNegGMPerResult?.tableData;
      } else if (excel == "ResourceCapacity") {
        filename = "ResourceCapacity";
        finalColumns = actionTable?.columns;
        finalTableData = actionTable?.tableData;
      }
      let columns = finalColumns;
      cols = columns?.replaceAll("'", "")?.replaceAll("<br>", "");
      desiredColumnOrder = cols
        ?.split(",")
        .filter((col) => !col.includes("Id") && !col.includes("action_items"));
      let filteredColumns = null;
      if (excel.length !== 0) {
        filteredColumns = desiredColumnOrder?.filter(
          (column) => column !== "resource_id"
        );
      } else {
        filteredColumns = desiredColumnOrder?.filter(
          (column) => column !== "action_items" && column !== "Id"
        );
      }

      let data = finalTableData;

      let filteredData = data?.filter(
        (column) => column !== "action_items" && column !== "Id"
      );
      const splitData = filteredData?.map((obj, index) => {
        const newObj = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (index === 0 && value !== null && typeof value === "string") {
              newObj[key] = value.replace(/[_<]br>/g, " ");
            } else if (
              index !== 0 &&
              value !== null &&
              typeof value === "string" &&
              (value.includes("_") || value.includes("."))
            ) {
              const splitValues = value.split(/[_\.]/)[0];
              newObj[key] = splitValues;
            } else {
              newObj[key] = value;
            }
          }
        }
        return newObj;
      });

      const wantedValues = splitData?.map((item) => {
        const obj = {};
        filteredColumns.forEach((col) => {
          const value = item[col];
          if (typeof value === "string") {
            const [extractedValue, ,] = value.split("^&"); // Extract the value from the key metadata
            obj[col] = extractedValue; // Assign the extracted value to the corresponding column
          } else {
            obj[col] = value;
          }
        });
        return obj;
      });

      // Create an array of objects where each object represents a row
      const rows = wantedValues?.map((item) => {
        const row = [];
        filteredColumns.forEach((col) => {
          row.push(item[col]);
        });
        return row;
      });

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("data");

      wantedValues.forEach((item) => {
        const row = worksheet.addRow(Object.values(item));
      });

      const boldRow = [1];

      boldRow.forEach((index) => {
        const row = worksheet.getRow(index);

        row.font = { bold: true };
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), filename + ".xlsx");
      });
      setExcel([]);
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        module.default.saveAs(
          data,
          fileName + EXCEL_EXTENSION
          // fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };
  useEffect(() => {}, [item]);
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  const HelpPDFName = "MonthlyRevenueForecast.pdf";
  const Headername = "Monthly Revenue Forecast Help";
  const [isOn, setOn] = useState(false);

  const handleToggle = () => {
    setOn(!isOn);
  };
  return (
    <div className="group customCard">
      <div className="col-md-12 "></div>
      <div className="group-content row">
        {selecttype == "Hierarchy" ? (
          //  || dataAccess == 307
          <>
            {visibleC == true ? (
              <span
                className="backArrow"
                onClick={() => {
                  setvisiblec(!visibleC);
                  visibleC
                    ? setArrowBack(IoIosArrowForward)
                    : setArrowBack(IoIosArrowBack);
                }}
              >
                {visibleC ? <IoIosArrowForward /> : <IoIosArrowBack />}
              </span>
            ) : (
              ""
            )}
            <div className={"col-md-2 "}>
              <CCollapse visible={!visibleC} setvisiblec="false">
                {visibleC == false ? (
                  <h2>
                    Resources
                    <span
                      className="backArrow"
                      onClick={() => {
                        setvisiblec(!visibleC);
                        visibleC
                          ? setArrowBack(IoIosArrowForward)
                          : setArrowBack(IoIosArrowBack);
                      }}
                    >
                      {visibleC ? <IoIosArrowForward /> : <IoIosArrowBack />}
                    </span>
                  </h2>
                ) : (
                  ""
                )}
                {
                  <RevenueForecastHierarchy
                    defaultExpandedRows={String(loggedResourceId)}
                    data={hierarchydata}
                    setHierarchyId={setHierarchyId}
                    setLabel={setLabel}
                    setFormData={setFormData}
                  />
                }
              </CCollapse>
            </div>
          </>
        ) : (
          ""
        )}
        <div
          className={
            visibleC == false && selecttype == "Hierarchy"
              ? // dataAccess == 307
                "col-10"
              : "col-12"
          }
        >
          <div className="group customCard">
            {/* <div className="col-md-12 collapseHeader">
              <h2>Search Filters</h2>

              <div
                onClick={() => {
                  setvisible(!visible);
                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                <span>{cheveronIcon}</span>
              </div>
            </div> */}

            <CCollapse visible={!visible} setvisible="false">
              <div>
                <div className="group-content row">
                  <div className="col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Type-select">
                        Type
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <select
                          id="type"
                          onFocus={() => {
                            setTypeTrue(true);
                          }}
                          onChange={(e) => {
                            setFormData((prevVal) => ({
                              ...prevVal,
                              ["type"]: e.target.value,
                            }));
                            setSelectedResLocation(resLocation);
                            setFormData((prevVal) => ({
                              ...prevVal,
                              ["View"]: "detail",
                            }));
                            if (e.target.value === "Hierarchy") {
                              setvisiblec(false);
                            }
                            if (e.target.value !== "Business Unit") {
                              setFormData((prev) => ({
                                ...prev,
                                ["View"]: "detail",
                              }));
                              setSelectView("detail");
                            }
                            setSelectType(e.target.value);
                            setType("Hierarchy");
                            setToggleButton(false);

                            if (e.target.value !== "Account Owner") {
                              setFormData((prev) => ({
                                ...prev,
                                ["AccountOwner"]: "-1",
                              }));
                              setSelectedAccountOwner(accountOwner);
                              setDisplayAccountOwner(false);
                            }
                          }}
                          value={
                            (savedSaerchid !== null && typetrue) ||
                            savedSaerchid === null
                              ? formData?.type
                              : filterData?.type
                          }
                        >
                          {dataAccess === 46 ? (
                            <>
                              <option id="Hierarchy" value="Hierarchy">
                                Hierarchy
                              </option>
                              <option value="project">Project</option>
                            </>
                          ) : dataAccess === 800 ? (
                            <>
                              <option id="" value="">
                                &lt;&lt;Please Select&gt;&gt;
                              </option>
                              <option id="Hierarchy" value="Hierarchy">
                                Hierarchy
                              </option>
                              <option value="customer">Customer</option>
                              <option value="project">Project</option>
                            </>
                          ) : dataAccess === 307 ? (
                            <>
                              <option id="" value="">
                                &lt;&lt;Please Select&gt;&gt;
                              </option>
                              <option id="Hierarchy" value="Hierarchy">
                                Hierarchy
                              </option>
                            </>
                          ) : (
                            <>
                              <option id="" value="">
                                &lt;&lt;Please Select&gt;&gt;
                              </option>
                              <option id="Hierarchy" value="Hierarchy">
                                Hierarchy
                              </option>
                              <option id="Account Owner" value="Account Owner">
                                Account Owner
                              </option>
                              {dataAccess == 686 ||
                              dataAccess == 126 ||
                              dataAccess == 428 ||
                              dataAccess == 250 ||
                              dataAccess == 932 ||
                              dataAccess == 919 ||
                              dataAccess == 646 ||
                              dataAccess == 908 ||
                              dataAccess == 931 ||
                              dataAccess == 1100 ||
                              dataAccess == 700 ||
                              // dataAccess == 690 ||
                              // dataAccess == 641 ||
                              dataAccess == 600 ||
                              // dataAccess == 800 ||
                              // dataAccess == 932 ||
                              dataAccess == 307 ? (
                                <option value="Business Unit">
                                  Business Unit
                                </option>
                              ) : (
                                ""
                              )}
                              <option value="customer">Customer</option>
                              <option value="project">Project</option>
                              {dataAccess == 686 ||
                              dataAccess == 126 ||
                              dataAccess == 428 ||
                              dataAccess == 250 ||
                              dataAccess == 932 ||
                              dataAccess == 908 ||
                              dataAccess == 931 ||
                              dataAccess == 646 ||
                              dataAccess == 919 ? (
                                <option value="resource">Resource</option>
                              ) : (
                                ""
                              )}
                              {dataAccess == 686 ||
                              dataAccess == 126 ||
                              dataAccess == 428 ||
                              dataAccess == 250 ||
                              dataAccess == 932 ||
                              dataAccess == 919 ||
                              dataAccess == 646 ||
                              dataAccess == 908 ||
                              dataAccess == 931 ||
                              // dataAccess == 932 ||
                              dataAccess == 307 ? (
                                <option value="Primary PM">Primary PM</option>
                              ) : (
                                ""
                              )}
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  {(selecttype === "Business Unit" && dataAccess == 686) ||
                  // dataAccess == 908 ||
                  (dataAccess == 126 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "resource" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 428 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "resource" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 250 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "resource" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 919 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "resource" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 646 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "resource" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 307 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "resource" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 1100 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "resource" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 1300 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "resource" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 1200 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "resource" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 932 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "resource" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 908 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "resource" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 931 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "resource" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 800 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "resource" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 600 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "resource" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 700 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "resource" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 690 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "resource" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "Primary PM") ||
                  (dataAccess == 641 &&
                    selecttype != "customer" &&
                    selecttype != "project" &&
                    selecttype != "resource" &&
                    selecttype != "Hierarchy" &&
                    selecttype != "Account Owner" &&
                    selecttype != "Primary PM") ? (
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="Business Unit">
                          Business Unit
                          <span className="required error-text ml-1">*</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div
                          className="multiselect col-6"
                          ref={(ele) => {
                            ref.current[0] = ele;
                          }}
                        >
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            id="BusinessUnit"
                            options={departments}
                            hasSelectAll={true}
                            isLoading={false}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            value={selectedDepartments}
                            valueRenderer={generateDropdownLabel}
                            disabled={false}
                            onChange={(s) => {
                              setSelectedDepartments(s);
                              let filteredValues = [];
                              s.forEach((d) => {
                                filteredValues.push(d.value);
                              });

                              setFormData((prevVal) => ({
                                ...prevVal,
                                ["BusinessUnit"]: filteredValues.toString(),
                              }));
                              setValidationMessage(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : selecttype == "project" || selecttype == "customer" ? (
                    ""
                  ) : (
                    ""
                  )}

                  {selecttype == "Hierarchy" || dataAccess == 307 ? (
                    <div className="col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="Name">
                          Name{" "}
                          <span className="required error-text ml-1"> *</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-6">
                          <input
                            className="disableField"
                            name="Name"
                            type="text"
                            id="Name"
                            placeholder=""
                            value={label}
                            disabled={true}
                            defaultValue={loggedUserId}
                            required
                            readOnly
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {selecttype === "Account Owner" ? (
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor=" Account Owner">
                          Account Owner
                          <span className="required error-text ml-1">*</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div
                          className="multiselect col-6"
                          ref={(ele) => {
                            ref.current[0] = ele;
                          }}
                        >
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            id="AccountOwner"
                            options={accountOwner}
                            hasSelectAll={true}
                            isLoading={false}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            value={selectedAccountOwner}
                            valueRenderer={generateDropdownLabel}
                            disabled={false}
                            onChange={(s) => {
                              setSelectedAccountOwner(s);
                              let filteredValues = [];
                              s.forEach((d) => {
                                filteredValues.push(d.value);
                              });

                              setFormData((prevVal) => ({
                                ...prevVal,
                                ["AccountOwner"]: filteredValues.toString(),
                              }));
                              setValidationMessage(false);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {selecttype == "customer" ? (
                    <div className="col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="customerName">
                          Customer Name
                          <span className="required error-text ml-1"> *</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-6">
                          <div
                            className="autoComplete-container react  reactsearchautocomplete"
                            id="autocomplete reactautocomplete"
                            ref={(ele) => {
                              ref.current[0] = ele;
                            }}
                          >
                            <ReactSearchAutocomplete
                              items={customer}
                              inputSearchString={CustomerName}
                              type="Text"
                              name="Customer"
                              id="Customer"
                              className="err cancel"
                              onClear={() => {
                                setFormData((prevProps) => ({
                                  ...prevProps,
                                  Customer: "",
                                }));
                              }}
                              placeholder="Type minimum 3 characters"
                              fuseOptions={{
                                keys: ["id", "name", "cust_code"],
                              }}
                              resultStringKeyName="name"
                              onSelect={(e) => {
                                setFormData((prevProps) => ({
                                  ...prevProps,
                                  Customer: e.id,
                                }));
                              }}
                              showIcon={false}
                            />
                            <span> {item.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {selecttype == "project" ? (
                    <div className="col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="projectName">
                          Project Name
                          <span className="required error-text ml-1"> *</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className=" col-6">
                          <div
                            className="autoComplete-container react  reactsearchautocomplete"
                            id="autocomplete reactautocomplete"
                            ref={(ele) => {
                              ref.current[0] = ele;
                            }}
                          >
                            <ReactSearchAutocomplete
                              items={project}
                              type="Text"
                              inputSearchString={projectname}
                              name="Project"
                              id="Project"
                              className="err cancel"
                              onClear={() => {
                                setFormData((prevProps) => ({
                                  ...prevProps,
                                  Project: "",
                                }));
                              }}
                              placeholder="Type minimum 3 characters"
                              fuseOptions={{ keys: ["id", "name"] }}
                              resultStringKeyName="name"
                              onSelect={(e) => {
                                setFormData((prevProps) => ({
                                  ...prevProps,
                                  Project: e.id,
                                }));
                              }}
                              showIcon={false}
                            />
                            <span> {item.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {selecttype == "resource" ? (
                    <div className="col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="Resource Name">
                          Resource Name
                          <span className="required error-text ml-1"> *</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-6 ">
                          <div
                            className="autoComplete-container react  reactsearchautocomplete"
                            id="autocomplete reactautocomplete"
                            ref={(ele) => {
                              ref.current[0] = ele;
                            }}
                          >
                            <ReactSearchAutocomplete
                              items={resource}
                              inputSearchString={resourceName}
                              type="Text"
                              name="Resource Name"
                              id="Resource Name"
                              className="err cancel"
                              onClear={() => {
                                setFormData((prevProps) => ({
                                  ...prevProps,
                                  ["Resource Name"]: "",
                                }));
                              }}
                              placeholder="Type minimum 3 characters"
                              fuseOptions={{ keys: ["id", "name"] }}
                              resultStringKeyName="name"
                              onSelect={(e) => {
                                setFormData((prevProps) => ({
                                  ...prevProps,
                                  ["Resource Name"]: e.id,
                                }));
                              }}
                              showIcon={false}
                            />
                            <span> {item.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {selecttype == "Primary PM" ? (
                    <div className="col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="Primary PM">
                          Primary PM
                          <span className="required error-text ml-1"> *</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-6 ">
                          <div
                            className="autoComplete-container react  reactsearchautocomplete"
                            id="autocomplete reactautocomplete"
                            ref={(ele) => {
                              ref.current[0] = ele;
                            }}
                          >
                            <ReactSearchAutocomplete
                              items={manager}
                              inputSearchString={pmname}
                              type="Text"
                              name="Primary PM"
                              id="Primary PM"
                              className="err cancel"
                              onClear={() => {
                                setFormData((prevProps) => ({
                                  ...prevProps,
                                  ["Primary PM"]: "",
                                }));
                              }}
                              placeholder="Type minimum 3 characters"
                              fuseOptions={{ keys: ["id", "name"] }}
                              resultStringKeyName="name"
                              onSelect={(e) => {
                                setFormData((prevProps) => ({
                                  ...prevProps,
                                  ["Primary PM"]: e.id,
                                }));
                              }}
                              showIcon={false}
                            />
                            <span> {item.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className=" col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Res.Location">
                        Res.Location
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <MultiSelect
                          ArrowRenderer={ArrowRenderer}
                          id="ResLocation"
                          options={resLocation}
                          hasSelectAll={true}
                          value={selectedResLocation}
                          disabled={false}
                          valueRenderer={generateDropdownLabel}
                          onChange={(e) => {
                            setSelectedResLocation(e);
                            let filteredCountry = [];
                            e.forEach((d) => {
                              filteredCountry.push(d.value);
                            });
                            setFormData((prevVal) => ({
                              ...prevVal,
                              ["ResLocation"]: filteredCountry.toString(),
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Eng.Company">
                        Eng.Company
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <MultiSelect
                          ArrowRenderer={ArrowRenderer}
                          id="EngCompany"
                          options={engCompany}
                          hasSelectAll={true}
                          isLoading={false}
                          shouldToggleOnHover={false}
                          disableSearch={false}
                          value={selectedEngCompany}
                          valueRenderer={generateDropdownLabel}
                          onChange={(e) => {
                            setSelectedEngCompany(e);
                            let filteredvalue = [];
                            e.forEach((d) => {
                              filteredvalue.push(d.value);
                            });
                            setFormData((prevVal) => ({
                              ...prevVal,
                              ["EngCompany"]: filteredvalue.toString(),
                            }));
                          }}
                          disabled={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="captype">
                        Cap.Type
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        {formData.View == "consol" ? (
                          <select
                            id=" captype"
                            name=" captype"
                            className="disableField"
                            disabled={true}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                ["captype"]: e.target.value,
                                ["capTypeName"]: e.target.lkup_name,
                              }));
                            }}
                            value={formData.captype}
                          >
                            {capType.map((Item) => (
                              <option value={Item.value} key={Item.label}>
                                {Item.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <select
                            id=" captype"
                            name=" captype"
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                ["captype"]: e.target.value,
                              }));
                              if (
                                e.target.value === "capacity" ||
                                e.target.value === "available"
                              ) {
                                setSelectedalloctype(alloctype);
                              }
                            }}
                            value={formData.captype}
                          >
                            {capType.map((Item) => (
                              <option value={Item.value} key={Item.label}>
                                {Item.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Alloc.Type">
                        Alloc.Type{" "}
                        <span className="required error-text ml-1">*</span>
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div
                        className="col-6 multiselect"
                        ref={(ele) => {
                          ref.current[1] = ele;
                        }}
                      >
                        {formData.captype == "capacity" ||
                        formData.captype == "available" ||
                        formData.View == "consol" ||
                        selectview === "consol" ? (
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            id="AllocType"
                            className="disableField"
                            options={alloctype}
                            hasSelectAll={true}
                            value={selectedalloctype}
                            disabled={true}
                            selected={selectedalloctype}
                            valueRenderer={generateDropdownLabel}
                            onChange={(e) => {
                              setSelectedalloctype(e);
                              let filteredvalue = [];
                              e.forEach((d) => {
                                filteredvalue.push(d.value);
                              });
                              setFormData((prevVal) => ({
                                ...prevVal,
                                ["AllocType"]: filteredvalue.toString(),
                              }));
                              setValidationMessage(false);
                            }}
                          />
                        ) : (
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            id="AllocType"
                            className="AllocType"
                            options={alloctype}
                            hasSelectAll={true}
                            value={selectedalloctype}
                            disabled={false}
                            selected={selectedalloctype}
                            valueRenderer={generateDropdownLabel}
                            onChange={(e) => {
                              setSelectedalloctype(e);
                              let filteredvalue = [];
                              e.forEach((d) => {
                                filteredvalue.push(d.value);
                              });
                              setFormData((prevVal) => ({
                                ...prevVal,
                                ["AllocType"]: filteredvalue.toString(),
                              }));
                              setValidationMessage(false);
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-4 mb-1">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="ResType">
                        Res.Type
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <select
                          className="ResType"
                          id="ResType"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              ["ResType"]: e.target.value,
                            }))
                          }
                          value={formData.ResType}
                        >
                          <option value="all">&lt;&lt;ALL&gt;&gt;</option>
                          <option value="fte">Employee</option>
                          <option value="subk">Contractors</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-4 mb-1">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Month">
                        Month
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <DatePicker
                          id="month"
                          selected={month}
                          onChange={handleDateChange}
                          dateFormat="MMM-yyyy"
                          showMonthYearPicker
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="View">
                        View
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6" id="View">
                        <div className="row px-1">
                          <div className="col-7">
                            {selecttype == "Hierarchy" ||
                            selecttype == "project" ||
                            selecttype == "resource" ||
                            selecttype == "Primary PM" ? (
                              <select
                                className="disableField"
                                disabled={true}
                                id="View"
                                onChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    ["View"]: e.target.value,
                                  }));
                                  setSelectView(e.target.value);
                                  setToggleButton(false);
                                }}
                                value={formData.View}
                              >
                                <option value="detail">Resource</option>
                                {selecttype == "Business Unit" ? (
                                  <option value="consol">Business Unit</option>
                                ) : (
                                  ""
                                )}
                                {selecttype == "Account Owner" ? (
                                  <option value="Account Owner">
                                    Account Owner
                                  </option>
                                ) : (
                                  ""
                                )}
                              </select>
                            ) : (
                              <select
                                id="View"
                                onChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    ["View"]: e.target.value,
                                  }));
                                  setSelectView(e.target.value);
                                  setToggleButton(false);
                                }}
                                value={formData.View}
                              >
                                <option value="detail">Resource</option>
                                {selecttype == "Business Unit" ? (
                                  <option value="consol">Business Unit</option>
                                ) : (
                                  ""
                                )}
                                {selecttype == "Account Owner" ? (
                                  <option value="Account Owner">
                                    Account Owner
                                  </option>
                                ) : (
                                  ""
                                )}
                              </select>
                            )}
                          </div>
                          <div className="col-5">
                            {selectview == "consol" ||
                            formData.View == "consol" ? (
                              <select
                                className="measure disableField"
                                id="measure"
                                disabled={true}
                                value={formData.measure}
                              >
                                <option value="hrs">Hrs</option>
                                <option value="percent">%</option>
                              </select>
                            ) : (
                              <select
                                className="measure"
                                id="measure"
                                onChange={(e) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    ["measure"]: e.target.value,
                                  }));
                                }}
                                value={formData.measure}
                              >
                                <option value="hrs">Hrs</option>
                                <option value="percent">%</option>
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Financialmeasures">
                        Financial Measures
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <RevenueForecastMultiSelect
                          formData={formData}
                          setFormData={setFormData}
                          financialMeasures={financialMeasures}
                          setFinancialMeasures={setFinancialMeasures}
                          setSelectedFinancialMeasures={
                            setSelectedFinancialMeasures
                          }
                          dataAccess={dataAccess}
                          selectview={selectview}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Contract Terms">
                        Contract Terms
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <MultiSelect
                          ArrowRenderer={ArrowRenderer}
                          id="ContractTerms"
                          options={contractTerms}
                          hasSelectAll={true}
                          value={selectedContractTerms}
                          isLoading={false}
                          shouldToggleOnHover={false}
                          disableSearch={false}
                          disabled={false}
                          valueRenderer={generateDropdownLabel}
                          onChange={(e) => {
                            setSelectedContractorTerms(e);
                            let filteredCountry = [];
                            e.forEach((d) => {
                              filteredCountry.push(d.value);
                            });
                            setFormData((prevVal) => ({
                              ...prevVal,
                              ["ContractTerms"]: filteredCountry.toString(),
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {selecttype == "project" || selecttype == "customer" ? (
                    <div className="col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="Source">
                          Source
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-6">
                          <select
                            className="Source"
                            id="Source"
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                ["Source"]: e.target.value,
                              }));
                            }}
                            value={formData.Source}
                          >
                            <option value="-1">&lt;&lt;ALL&gt;&gt;</option>
                            <option value="PPM">PPM</option>
                            <option value="Projector">Projector</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {selecttype == "project" || selecttype == "customer" ? (
                    <div className="col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="engLocation">
                          Eng.Location
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            id="engLocation"
                            options={engLocation}
                            hasSelectAll={true}
                            value={selectedEngLocation}
                            valueRenderer={generateDropdownLabel}
                            disabled={false}
                            onChange={(e) => {
                              setSelectedEngLocation(e);
                              let filteredCountry = [];
                              e.forEach((d) => {
                                filteredCountry.push(d.value);
                              });

                              if (filteredCountry.length === 8) {
                                setFormData((prevVal) => ({
                                  ...prevVal,
                                  ["engLocation"]: "-1",
                                }));
                                return;
                              } else {
                                setFormData((prevVal) => ({
                                  ...prevVal,
                                  ["engLocation"]: filteredCountry.toString(),
                                }));
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* {isPmAndAbove.userExists == true ? ( */}
                  <>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="CSL">
                          CSL
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-6">
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            id="Csl"
                            options={csl}
                            hasSelectAll={true}
                            value={selectedCsl}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            selected={selectedCsl}
                            valueRenderer={generateDropdownLabel}
                            disabled={false}
                            onChange={(e) => {
                              setSelectedCsl(e);
                              let filteredCustomer = [];
                              e.forEach((d) => {
                                filteredCustomer.push(d.value);
                              });
                              setFormData((prevVal) => ({
                                ...prevVal,
                                ["Csl"]: filteredCustomer.toString(),
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="DP">
                          DP
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-6">
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            id="Dp"
                            options={dp}
                            hasSelectAll={true}
                            value={selectedDp}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            selected={selectedDp}
                            disabled={false}
                            valueRenderer={generateDropdownLabel}
                            onChange={(e) => {
                              setSelectedDp(e);
                              let filteredCustomer = [];
                              e.forEach((d) => {
                                filteredCustomer.push(d.value);
                              });
                              setFormData((prevVal) => ({
                                ...prevVal,
                                ["Dp"]: filteredCustomer.toString(),
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {formData.View == "consol" &&
                    selecttype == "Business Unit" ? (
                      <div className=" col-md-4 mb-2">
                        <div className="form-group row">
                          <label className="col-5" htmlFor="SummaryBy">
                            Summary By
                            <span className="required error-text ml-1">*</span>
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
                              name="summaryBy"
                              id="summaryBy"
                              options={summaryBy}
                              hasSelectAll={true}
                              value={selectedSummaryBy}
                              selected={selectedSummaryBy}
                              valueRenderer={generateDropdownLabel}
                              disabled={false}
                              onChange={(e) => {
                                setSelectedSummaryBy(e);
                                let filteredType = [];
                                e.forEach((d) => {
                                  filteredType.push(d.value);
                                });
                                setFormData((prevVal) => ({
                                  ...prevVal,
                                  ["summaryBy"]: filteredType.toString(),
                                }));
                                setValidationMessage(false);
                                setToggleButton(false);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                  {/* ) : (
                    ""
                  )} */}
                  <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-1">
                    <button
                      type="submit"
                      id="search"
                      name="search"
                      className="btn btn-primary"
                      onClick={handleSearch}
                    >
                      <FaSearch /> Search
                    </button>
                    {selecttype == "Hierarchy" ? (
                      ""
                    ) : (
                      <button
                        type="submit"
                        id="exceptionReports"
                        name="exceptionReports"
                        className="btn btn-primary"
                        onClick={ExceptionReports}
                      >
                        <AiOutlineException />
                        {/* <FaFileCircleExclamation /> */}
                        Exception Reports
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CCollapse>

            {toggleButton && (
              <div className="mrTableContainer togle-expand-btn-margin">
                <div className="tableViewSwitch">
                  <span className="scrollTxt">Scroll</span>
                  <div
                    className={`switch-container ${isOn ? "on" : "off"}`}
                    onClick={handleToggle}
                  >
                    <div className="switch-slider"></div>
                  </div>
                  <span className="paginationTxt">Pagination</span>
                </div>
              </div>
            )}
            {selectview == "consol" ? (
              <>
                {formData.summaryBy?.includes("Region") && displayStateC ? (
                  <div className="mb-2">
                    <h2 style={{ textAlign: "center" }}>Summary By Region</h2>
                    {/* <RevenueForecastBuTable
                      data={BURegion}
                      expandedCols={[]}
                      colExpandState={[]}
                      isOn={isOn}
                    /> */}
                    {<ReactTable dataProp={BURegion} />}
                  </div>
                ) : (
                  " "
                )}
                {formData.summaryBy?.includes("Practice") && displayStateD ? (
                  <div className="my-2">
                    <h2 style={{ textAlign: "center" }}>Summary By Practice</h2>
                    {/* <RevenueForecastBuTable
                      data={BUPractice}
                      expandedCols={[]}
                      colExpandState={[]}
                      isOn={isOn}
                    /> */}
                    {<ReactTable dataProp={BUPractice} />}
                  </div>
                ) : (
                  " "
                )}
                {formData.summaryBy?.includes("Customer") && displayStateE ? (
                  <div className="my-2">
                    <h2 style={{ textAlign: "center" }}>Summary By Customer</h2>
                    {/* <RevenueForecastBuCustomer
                      data={BUCustomer}
                      expandedCols={[]}
                      colExpandState={[]}
                      isOn={isOn}
                    /> */}
                    {<ReactTable dataProp={BUCustomer} />}
                  </div>
                ) : (
                  " "
                )}
              </>
            ) : selectview == "detail" ? (
              utilizationSummary && benchSummary && actionItems ? (
                <div>
                  {displayState ? (
                    <div className="mb-2">
                      <div className="group customCard">
                        <div className="col-md-12 collapseHeader">
                          <h2>Utilization Summary</h2>
                          <div
                            className="expandable-btn-container"
                            onClick={() => {
                              setvisibleA(!visibleA);
                              visibleA
                                ? setCheveronIconA(FaChevronCircleUp)
                                : setCheveronIconA(FaChevronCircleDown);
                            }}
                          >
                            <span>{cheveronIconA}</span>
                          </div>
                        </div>
                      </div>
                      <CCollapse visible={!visibleA}>
                        <MonthlyForecastRevenueTableComponent
                          data={utilizationSummary}
                          expandedCols={[]}
                          colExpandState={[]}
                        />
                      </CCollapse>
                    </div>
                  ) : (
                    ""
                  )}
                  {displayStateA ? (
                    <div className="mb-2">
                      <div className="group customCard">
                        <div className="col-md-12 collapseHeader">
                          <h2>Bench Summary</h2>
                          <div
                            onClick={() => {
                              setvisibleB(!visibleB);
                              visibleB
                                ? setCheveronIconB(FaChevronCircleUp)
                                : setCheveronIconB(FaChevronCircleDown);
                            }}
                          >
                            <span style={{ cursor: "pointer" }}>
                              {cheveronIconB}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CCollapse visible={!visibleB}>
                        <MonthlyForecastRevenueTableComponent
                          data={benchSummary}
                          expandedCols={[]}
                          colExpandState={[]}
                        />
                      </CCollapse>
                    </div>
                  ) : (
                    ""
                  )}
                  {displayStateB ? (
                    <div className="">
                      <div className="collapseHeader revForcast">
                        <div className="leftSection">
                          <div className="legendContainer">
                            <div className="legend blue">
                              <div className="legendCircle"></div>
                              <div className="legendTxt">Holiday</div>
                            </div>
                            <div className="legend pink">
                              <div className="legendCircle"></div>
                              <div className="legendTxt">Leave</div>
                            </div>
                            <button
                              id="actionItems"
                              name="actionItems"
                              className="btn btn-primary"
                              onClick={() => {
                                setButtonPopup(true);
                                handleActionItems();
                              }}
                            >
                              Action Items
                            </button>
                          </div>
                        </div>
                        <div className="rightSection">
                          <label>Avg :</label>
                          <select
                            id="Avg"
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                ["Avg"]: e.target.value,
                              }))
                            }
                          >
                            <option value="" selected>
                              {/* &lt;&lt;Please Select&gt;&gt; */}
                            </option>
                            <option value="ge">&#8805;</option>
                            <option value="le">&#8804;</option>
                            <option value="gt">&#62;</option>
                            <option value="lt">&#60;</option>
                            <option value="eq">&#9868;</option>
                          </select>
                          <input
                            id="avgtextvalue"
                            name="avgtextvalue"
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                ["avgtextvalue"]: e.target.value,
                              }))
                            }
                          />
                          %
                          <span className="ml-2 chevronContainer">
                            <AiOutlineLeftSquare
                              cursor="pointer"
                              size={"2em"}
                              onClick={subtractHandler}
                            />
                            <span>{moment(month).format("MMM-YYYY")}</span>
                            <AiOutlineRightSquare
                              cursor="pointer"
                              size={"2em"}
                              onClick={addHandler}
                            />
                          </span>
                          <span>
                            <RiFileExcel2Line
                              size="1.5em"
                              title="Export to Excel"
                              style={{ color: "green", float: "right" }}
                              cursor="pointer"
                              onClick={(e) => {
                                setExcel("ResourceCapacity");
                                handleOnExport();
                              }}
                            />
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <MonthlyForecastRevenueCalenderTable
                          data={actionTable}
                          expandedCols={[
                            "emp_cadre",
                            "BusinessUnit",
                            "Supervisor",
                          ]}
                          colExpandState={["0", "1", "Name"]}
                          formData={formData}
                          setFormData={setFormData}
                          setCapType={setCapType}
                          capType={capType}
                          value={value}
                          month={month}
                          setMonth={setMonth}
                          formattedMonth={formattedMonth}
                          setsearchingA={setsearchingA}
                          actionPopup={actionPopup}
                          setActionPopup={setActionPopup}
                          dataAccess={dataAccess}
                          isOn={isOn}
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )
            ) : selectview === "Account Owner" && displayAccountOwner ? (
              <ReactTable dataProp={acoountOwnerData} />
            ) : (
              // "in Account Owner"
              ""
            )}

            {reportsTable ? (
              <div>
                <span>
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green", float: "right" }}
                    cursor="pointer"
                    onClick={(e) => {
                      setExcel(tempMailsResult);
                      handleOnExport();
                    }}
                  />
                </span>
                <div className="mt-2 mb-2">
                  <h2>Staff With Invalid Email ID</h2>
                  <ExceptionReportsTable
                    data={tempMailsResult}
                    expandedCols={[
                      "resType",
                      "bu",
                      "country",
                      "project_mgr",
                      "csl",
                      "dp",
                    ]}
                    colExpandState={["0", "1", "resource_name"]}
                  />
                </div>
                <span>
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green", float: "right" }}
                    cursor="pointer"
                    onClick={(e) => {
                      setExcel(resWithoutBUResult);
                      handleOnExport();
                    }}
                  />
                </span>
                <div className="mt-2 mb-2">
                  <h2>Staff Without BU Mapping</h2>
                  <ExceptionReportsTable
                    data={resWithoutBUResult}
                    expandedCols={[
                      "resType",
                      "bu",
                      "country",
                      "supervisor",
                      "project_mgr",
                      "csl",
                      "dp",
                    ]}
                    colExpandState={["0", "1", "resource_name"]}
                  />
                </div>{" "}
                <span>
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green", float: "right" }}
                    cursor="pointer"
                    onClick={() => {
                      setExcel(resWithZerobillRateResult);
                      handleOnExport();
                    }}
                  />
                </span>
                <div className="mt-2 mb-2">
                  <h2>Staff with non-billable allocations</h2>
                  <ExceptionReportsTable
                    data={resWithZerobillRateResult}
                    expandedCols={[
                      "resType",
                      "bu",
                      "country",
                      "project_mgr",
                      "csl",
                      "dp",
                    ]}
                    colExpandState={["0", "1", "resource_name"]}
                  />
                </div>
                <span>
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green", float: "right" }}
                    cursor="pointer"
                    onClick={() => {
                      setExcel(resWithNoEndDateResult);
                      handleOnExport();
                    }}
                  />
                </span>
                <div className="mt-2 mb-2">
                  <h2>Inactive Staff with missing Start/end Dates</h2>
                  <ExceptionReportsTable
                    data={resWithNoEndDateResult}
                    expandedCols={[
                      "resType",
                      "bu",
                      "country",
                      "supervisor",
                      "project_mgr",
                      "csl",
                      "dp",
                    ]}
                    colExpandState={["0", "1", "resource_name"]}
                  />
                </div>
                <span>
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green", float: "right" }}
                    cursor="pointer"
                    onClick={() => {
                      setExcel(allocBeyondEndDateResult);
                      handleOnExport();
                    }}
                  />
                </span>
                <div className="mt-2 mb-2">
                  <h2>Inactive Staff with Allocations after End Date</h2>
                  <ExceptionReportsTable
                    data={allocBeyondEndDateResult}
                    expandedCols={[
                      "resType",
                      "bu",
                      "country",
                      "supervisor",
                      "project_mgr",
                      "csl",
                      "dp",
                    ]}
                    colExpandState={["0", "1", "resource_name"]}
                  />
                </div>
                <span>
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green", float: "right" }}
                    cursor="pointer"
                    onClick={() => {
                      setExcel(resWithoutDesignationResult);
                      handleOnExport();
                    }}
                  />
                </span>
                <div className="mt-2 mb-2">
                  <h2>Staff with missing Designation</h2>
                  <ExceptionReportsTable
                    data={resWithoutDesignationResult}
                    expandedCols={[
                      "resType",
                      "bu",
                      "country",
                      "supervisor",
                      "project_mgr",
                      "csl",
                      "dp",
                      "designation",
                    ]}
                    colExpandState={["0", "1", "resource_name"]}
                  />
                </div>
                <span>
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green", float: "right" }}
                    cursor="pointer"
                    onClick={() => {
                      setExcel(projectsWithoutBUResult);
                      handleOnExport();
                    }}
                  />
                </span>
                <div className="mt-2 mb-2 ">
                  <h2>Projects with Missing BU</h2>
                  <ExceptionReportsTable
                    data={projectsWithoutBUResult}
                    expandedCols={["bu", "country", "project_mgr", "csl", "dp"]}
                    colExpandState={["0", "0", "project_code"]}
                  />
                </div>
                <span>
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green", float: "right" }}
                    cursor="pointer"
                    onClick={() => {
                      setExcel(resRateLessCostResult);
                      handleOnExport();
                    }}
                  />
                </span>
                <div className="mt-2 mb-2">
                  <h2>Staff with Bill rate lower than Cost Rate</h2>
                  <ExceptionReportsTable
                    data={resRateLessCostResult}
                    expandedCols={[
                      "resType",
                      "bu",
                      "country",
                      "project_mgr",
                      "csl",
                      "dp",
                    ]}
                    colExpandState={["0", "1", "resource_name"]}
                  />
                </div>
                <span>
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green", float: "right" }}
                    cursor="pointer"
                    onClick={() => {
                      setExcel(resWithZeroRoleCostResult);
                      handleOnExport();
                    }}
                  />
                </span>
                <div className="mt-2 mb-2">
                  <h2>Staff with No Cost Rate</h2>
                  <ExceptionReportsTable
                    data={resWithZeroRoleCostResult}
                    expandedCols={[
                      "resType",
                      "bu",
                      "country",
                      "project_mgr",
                      "csl",
                      "dp",
                      "role_type",
                      "designation",
                      "cadre",
                    ]}
                    colExpandState={["0", "1", "resource_name"]}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          {searching ? <Loader handleAbort={handleBuAbort} /> : ""}
          {searchingA ? <Loader handleAbort={handleAbort} /> : ""}
          {actionItemsSearching ? <Loader handleAbort={handleAbort} /> : ""}
          {displayHierarchy &&
          hierarchydata.length === 1 &&
          Object.keys(hierarchydata[0]).length === 0 ? (
            <Loader handleAbort={handleAbort} />
          ) : (
            ""
          )}
          {displayExceptionReports ? <Loader handleAbort={handleAbort} /> : ""}

          {buttonPopup ? (
            <MonthlyForecastRevenuePopUp
              buttonPopup={buttonPopup}
              setButtonPopup={setButtonPopup}
              actionItems={actionItems}
              setActionItems={setActionItems}
              rows={rows}
              actionTable={actionTable}
              handleActionItems={handleActionItems}
            />
          ) : (
            " "
          )}
        </div>
      </div>
    </div>
  );
}
export default RevenueForecastFilters;
