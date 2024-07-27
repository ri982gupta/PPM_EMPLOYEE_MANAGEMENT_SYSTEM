import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AiFillWarning } from "react-icons/ai";
import { FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import Loader from "../Loader/Loader";
import { CCollapse } from "@coreui/react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { FaCaretDown } from "react-icons/fa";
import moment from "moment";
import { environment } from "../../environments/environment";
import { FaSearch } from "react-icons/fa";
import SelectSEDialogBox from "../SelectSE/SelectSEDialogBox";
import { MultiSelect } from "react-multi-select-component";
import { BiCheck } from "react-icons/bi";
import TargetTable from "./TargetTable.js";
import { useDispatch } from "react-redux";
import {
  setReportRunIdRedux,
  updateQuaterDate,
  updatedOwnerDivisions,
  updatedSalesExectiveId,
  updatedVedorNameWithId,
  updatedVendorId,
} from "../../reducers/SelectedSEReducer";
import { useSelector } from "react-redux";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { useLocation } from "react-router-dom";
export default function SoftwareSearchFilters({
  softwareData,
  setTargetReviewsData,
  setTableFlag,
  setSelector,
  showDetails,
  setShowDetails,
  setSoftwareData,
  setWowDisplay,
  fdate,
  setFdate,
  reportRunId,
  setreportRunId,
  setwowtype,
  qdate,
  setQdate,
  setTargetDataKeys,
  viewDisplay,
  setViewDisplay,
  wowDate,
  setWOwDate,
  setData,
  data,
  tableData,
  setTableData,
  headerData,
  setHeaderData,
  setViewSlesId,
}) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [p1data, setp1Data] = useState([]);
  const [selectedp1, setSelectedp1] = useState([]);
  const [resetVendor, setResetVendor] = useState([]);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [visibleC, setVisibleC] = useState(false);
  const [salesfullAccess, setSalesfullAccess] = useState([]);

  const [vendor1, setVendor1] = useState("");
  const [filterData, setFilterData] = useState([]);
  const FilterData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/FiltersData?saved_search_id=${
          id === null ? 0 : id
        }`,
    }).then(function (res) {
      const getData = res.data;
      setFilterData(getData);
    });
  };
  useEffect(() => {
    FilterData();
  }, []);
  const [softwarePayload, setSoftwarePayload] = useState({});
  useEffect(() => {
    setSoftwarePayload(() => {
      if (id != null) {
        return {
          mode: filterData?.mode,
          from: filterData.from,
          duration: filterData?.duration,
          vendors: filterData.vendors,
          divisions: filterData.divisions,
          // executives: salesSE,
          executives: filterData.executives,
          salesId: filterData.salesId,
          isActive: filterData.isActive,
          isIndividual: filterData.isIndividual,
          type: filterData?.type,
          key: "1662974432015",
          selectExecs: filterData.selectExecs,
          saveSE: "true",
          optType: filterData.optType,
          quarter: filterData.quarter,
          status: filterData.status,
          duration2: filterData.duration2,
          measures: filterData.measures,
          monthsel: filterData.monthsel,
          viewByTime: filterData.viewByTime,
          fyear: filterData.fyear,
          customers: filterData.customers,
          prospects: filterData.prospects,
          practices: filterData.practices,
          countries: filterData.countries,
          customerType: filterData.customerType,
          summary: filterData.summary,
          showBy: filterData.showBy,
          aelocation: filterData.aelocation,
          engComp: filterData.engComp,
          Divisions: filterData.Divisions,
          accOwner: filterData.accOwner,
          newCust: filterData.newCust,
          accType: filterData.accType,
        };
      } else {
        return {
          mode: "view",
          from: moment(quarterdate).format("YYYY-MM-DD"),
          duration: duration,
          vendors: vendor1,
          divisions: division,
          // executives: salesSE,
          executives: salesEx == 1 ? executiveIdPayload : salesEx,
          salesId: salesexecutiveid,
          isActive: "true",
          isIndividual:
            isIndividualChecked.length == 0 ? "false" : isIndividualChecked,
          type: "view",
          key: "1662974432015",
          selectExecs: Salesexecutivename,
          saveSE: "true",
          optType: -1,
          quarter: -1,
          status: -1,
          duration2: -1,
          measures: -1,
          monthsel: -1,
          viewByTime: -1,
          fyear: -1,
          customers: -1,
          prospects: -1,
          practices: -1,
          countries: -1,
          customerType: -1,
          summary: -1,
          showBy: -1,
          aelocation: -1,
          engComp: -1,
          Divisions: -1,
          accOwner: -1,
          newCust: -1,
          accType: -1,
        };
      }
    });
  }, [filterData]);

  // Function to format the date
  function formatDate(date) {
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      // Change to "numeric" to remove leading zeros
      year: "numeric",
    };
    // const formattedDate = date
    //   .toLocaleString("en-IN", options)
    //   .replace(",", "");
    // return `${formattedDate} 00:00:00 GMT+0530 (India Standard Time)`;
    const formattedDate = date?.toLocaleString("en-IN", options);
    return `${formattedDate} 00:00:00 GMT+0530 (India Standard Time)`;
  }

  useEffect(() => {
    if (id != null) {
      const updateAction = filterData?.type;
      const updateSalesExcetive = filterData?.executives;
      const excludedValues = filterData?.vendors; // Trim each value

      const updateVendors = p1data?.filter((item) => {
        // Check if item.value is included in the excludedValues array
        return excludedValues?.includes(item.value);
      });
      const progressDataDivisions = filterData.divisions;
      const divisionsToFilter = progressDataDivisions
        ? progressDataDivisions?.split(",").map(Number)
        : [];
      const updatedOwnerDivisions = sFOwnerDivisionsDropdown.filter(
        (values) => {
          return divisionsToFilter?.includes(values.value);
        }
      );
      if (filterData.from !== undefined && filterData.from !== "") {
        const updatequarter = new Date(filterData.from);
        updatequarter.setMonth(updatequarter.getMonth() - 3);
        updatequarter.setFullYear(updatequarter.getFullYear() + 1);
        setStartDate(updatequarter);
      }
      const updateDuration = softwarePayload.duration;
      const integerValues = updatedOwnerDivisions.map((item) =>
        parseInt(item.value)
      );
      const commaSeparatedValues = filterData.divisions;
      const vendorvalues = filterData.vendors;
      const fromDateView = filterData.from;
      if (filterData.type != "target") {
        setVendor1(vendorvalues);
        setDivision(commaSeparatedValues);
        setDuration(updateDuration);
        setSelectedp1(updateVendors);
      }
      if (filterData.type == "view") {
        setQuarterDate(fromDateView);
      }
      const showby = filterData.showBy;
      const financeYearTarget = filterData?.from;
      const inputDate = filterData?.from;
      const fiscalYearStartDate = moment(inputDate)
        .startOf("year")
        .month(3) // April is month 3 (0-indexed)
        .date(1); // Set the day to 1st
      fiscalYearStartDate.subtract(1, "years");
      const From = fiscalYearStartDate.format("YYYY-MM-DD");
      const finalDate = moment(financeYearTarget).format("ddd MMM DD YYYY");
      const addinst = `${finalDate} 00:00:00 GMT+0530 (India Standard Time)`;
      const FinalDate = moment(addinst).toDate();
      const oneYearLater = moment(FinalDate).add(1, "year").toDate();
      if (filterData.type == "target") {
        setStDate(From);
        setSalesEx(updateSalesExcetive);
        setFinancialYearDate(oneYearLater);
      }

      if (filterData.divisions == "-1") {
        setselectesFOwnerDivison(sFOwnerDivisionsDropdown);
      } else {
        setselectesFOwnerDivison(updatedOwnerDivisions);
      }

      if (filterData.executives === "-1") {
        const dataExActive = "<< Active SE >>";
        setselectedSE(dataExActive);
      } else if (filterData.executives === "-3") {
        const dataExInactive = "<< InActive SE >>";
        setselectedSE(dataExInactive);
      } else if (filterData.executives === "1") {
        const dataSelectSe = "<< Select SE >>";
        setselectedSE(dataSelectSe);
      } else if (filterData.executives === "-2") {
        const dataAllSe = "<< All SE >>";
        setselectedSE(dataAllSe);
      } else if (filterData.executives?.length > 3) {
        const dataSelectSe = "<< Select SE >>";
        setselectedSE(dataSelectSe);
      }

      setActionSelector(updateAction);
      console.log(updateSalesExcetive);
      console.log(filterData?.executives);
      if (filterData.executives?.length > 3) {
        setSelectedSEVal("1");
      } else {
        setSelectedSEVal(updateSalesExcetive);
      }
      setShowByValue(showby);
    }
  }, [
    id,
    filterData?.type,
    filterData?.executives,
    filterData?.vendors,
    filterData.divisions,
    p1data,
    filterData?.from,
    filterData?.showBy,
  ]);
  useEffect(() => {
    if (id != null) {
      const data = filterData.type;
      setActionSelector(data);
    }
  }, [id, filterData.type]);
  const [wirteData, setWriteData] = useState([]);
  const [salesEx, setSalesEx] = useState(-2);
  const [division, setDivision] = useState(-1);
  const abortController = useRef(null);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [salesSE, setSalesSE] = useState(-2);
  const [reportId, setReportId] = useState([]);
  const [fydata, setFydata] = useState("2023-04-01");
  const [grpId, setGrpId] = useState([]);
  const [accessData, setAccessData] = useState([]);
  const [financeYear, setFinanceYear] = useState([]);
  const [targetOpen, setTargetOpen] = useState(false);
  const [duration, setDuration] = useState("4");
  const controller = new AbortController();
  const ref = useRef([]);
  const dispatch = useDispatch();
  const [viewsalesexectiveid, setViewSalesExectiveId] = useState(salesEx);

  useEffect(() => {
    setViewSalesExectiveId(formattedIds);
  }, [salesEx]);

  const [financeYears, setFinanceYears] = useState(new Date(financeYear));

  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );
  const localSE =
    localStorage.getItem("selectedSELocal") === null
      ? []
      : JSON.parse(localStorage.getItem("selectedSELocal"));

  const isSalesPresentThenId = localSE.findIndex((obj) => obj.key);
  const [salesexecutiveid, setsalesExecutiveId] = useState("");
  const [Salesexecutivename, setsalesExecutiveName] = useState("");
  const [salesindividualid, setSalesIndividualId] = useState(0);
  const [salesindividualName, setSalesIndividualName] = useState("");
  useEffect(() => {
    if (isSalesPresentThenId !== -1) {
      const salesId = localSE[isSalesPresentThenId].id;
      const salespersonname = localSE[isSalesPresentThenId].text + ` & Team`;
      if (salesEx == 1) {
        setsalesExecutiveName(salespersonname);
        setsalesExecutiveId(salesId);
      }
    }
  }, [isSalesPresentThenId, salesEx]); // Run this effect only when isSalesPresentThenId changes

  const idsWithoutDirectSalesEx = localSE.map((item) => item.id);
  const idDirectSalesEx = localSE
    .filter((item) => item.key === "directsalesEx")
    .map((item) => item.id);
  const nameWithoutDirectSalesEx = localSE
    .filter((item) => !item.key || item.key !== "directsalesEx")
    .map((item) => item.salesPersonName);
  const formattedIds = idsWithoutDirectSalesEx.join(",");
  const formattedName = nameWithoutDirectSalesEx.join(",");
  const SalesExecutiveNames = Salesexecutivename + formattedName;
  useEffect(() => {
    if (salesEx === 1) {
      setSalesIndividualId(formattedIds);
      setViewSalesExectiveId(formattedIds);
      setSalesIndividualName(SalesExecutiveNames);
    }
  }, [salesEx]);

  useEffect(() => {
    dispatch(updatedSalesExectiveId(salesEx));
  }, [salesEx]);

  const isIndividualChecked = useSelector(
    (state) => state.selectedSEState.isIndividualChecked
  );
  function transformObjects(data) {
    return localSE.map((item) => {
      if (Array.isArray(item)) {
        const [obj] = item;
        if (
          obj &&
          obj.id &&
          obj.text &&
          obj.type === "fte1" &&
          obj.parent === "id"
        ) {
          return {
            salesPersonName: obj.text,
            type: obj.type,
            id: parseInt(obj.id),
            status: JSON.parse(obj.li_attr).sestatus || "empActive",
          };
        }
      }
      return item;
    });
  }

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const transformedData = transformObjects(data);
  const filteredData = transformedData
    .filter((obj, index) => {
      return index === transformedData.findIndex((o) => obj.id === o.id);
    })
    .filter((item) => !Array.isArray(item) || item.length === 0);
  const idArray = transformedData.map((item) => item.id);
  const filteredIds = idArray.filter((id) => typeof id === "number");
  const updatedIds = filteredIds.map((id) =>
    id === "1717" || "3887" || "3887" || "3977" || "4895" || "4872942"
      ? grpId
      : id
  );
  const salesPersonNames = filteredData.map((item) => {
    if (
      (item.salesPersonName && item.salesPersonName === "Kirsten Craft") ||
      "Sarat Addanki" ||
      "Satyanarayana Bolli" ||
      "Supervisor Orphans" ||
      "Michelle Shuler"
    ) {
      return `${item.salesPersonName}`;
    }
    return item.salesPersonName;
  });

  const commaSeparatedNames = salesPersonNames.join(",");
  const salesPersonNamesBulk = filteredData.map((item) => {
    if (
      item.salesPersonName === "Kirsten Craft" &&
      "Sarat Addanki" &&
      "Satyanarayana Bolli" &&
      "Supervisor Orphans" &&
      "Michelle Shuler"
    ) {
      return `${item.salesPersonName} & team`;
    }
    return item.salesPersonName;
  });

  const commaSeparatedNamesBulk = salesPersonNamesBulk.join(",");
  const salesPersonIds = filteredData.map((item) => item.id);
  const commaSeparatedIds = salesPersonIds.join(",");
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [buttonAction, setButtonAction] = useState(false);
  const pageurl = "http://10.11.12.149:3000/#/pmo/salesSoftwares";
  const page_Name = "Sales";
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(date.getMonth() - 3);
    return date;
  });
  const [selectedSEVal, setSelectedSEVal] = useState(-2);
  const [editmsg, setEditAddmsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [actionSelector, setActionSelector] = useState("view");
  const [selectedVendorData, setSelectedVendorData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [vendors, setVendors] = useState("");
  const [vendorDropdown, setvendorDropdown] = useState([]);
  const [selectedvendor, setselectedvendor] = useState([]);
  const [selectedSE, setselectedSE] = useState("<< All SE >>");
  const [salesExecutiveDropdown, setsalesExecutiveDropdown] = useState([]);
  const [sFOwnerDivisionsDropdown, setSFOwnerDivisionsDropdown] = useState([]);
  const [selectesFOwnerDivison, setselectesFOwnerDivison] = useState([]);
  const [searching, setsearching] = useState(false);
  const selectedDate = new Date();
  const [showbyvalue, setShowByValue] = useState("week");
  const nextYearDate = moment(startDate).clone().add(1, "year").toDate();
  const currentDate = new Date();
  const oneYearLater = new Date(
    currentDate.getFullYear() + 1,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  useEffect(() => {
    dispatch(updatedVendorId(vendor1));
    dispatch(updatedVedorNameWithId(selectedp1));
    dispatch(updatedOwnerDivisions(selectesFOwnerDivison));
  }, [vendor1, selectedp1, selectesFOwnerDivison]);
  const [FinancialYearDate, setFinancialYearDate] = useState(oneYearLater);
  const year = moment(startDate).format("yyyy-MM-DD").split("-")[0];
  const month = 1;
  const dd = moment({ year, month: month - 1 })
    .startOf("month")
    .format("YYYY-MM-DD");
  const [stDate, setStDate] = useState("2023-04-01");
  const DateChange = ({ id, value }) => {
    const year = moment(value).format("yyyy-MM-DD").split("-")[0];
    const month = 4;
    const dd = moment({ year, month: month - 1 })
      .startOf("month")
      .format("YYYY-MM-DD");

    setStDate(dd);
    setWOwDate(dd);
    setSoftwarePayload((prevState) => {
      return { ...prevState, ["from"]: moment(dd).format("yyyy-MM-DD") };
    });
    if (id === "executives" && value === "1") {
      setVisible(true);
    }
  };
  const defaultDate = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    return firstDate.toLocaleDateString("en-CA");
  };

  // Create a new Date object with the initial date
  let initialDate = financeYears; // Replace this with your desired initial date

  let daysToSubtract = 9;
  initialDate.setDate(initialDate.getDate() - daysToSubtract);
  let monthsToSubtract = 4;
  initialDate.setMonth(initialDate.getMonth() - monthsToSubtract);
  let yearsToSubtract = 0;
  initialDate.setFullYear(initialDate.getFullYear() - yearsToSubtract);

  const [wowadata, setwowDatapaylaod] = useState([]);
  const [viewwData, setviewDataPayload] = useState([]);
  const [targetDataaPayload, settargetDataPayload] = useState([]);

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const getWriteAcess = () => {
    axios.get(baseUrl + `/SalesMS/software/getSalesVendors`).then((res) => {
      const data = res.data;
      let custom = [];

      data.forEach((e) => {
        let dpObj = {
          label: e.vendor,
          // value: e.id,
        };
        custom.push(dpObj);
      });

      setVendorData(custom);
      setSelectedVendorData(custom);
      // setAdata(data);
    });
  };

  const practice1 = () => {
    axios.get(baseUrl + `/SalesMS/software/getSalesVendors`).then((res) => {
      const data = res.data;
      let custom = [];

      data.forEach((e) => {
        let dpObj = {
          label: e.vendor,
          value: e.vendor,
        };
        custom.push(dpObj);
      });
      // Check if the item with the label "Prolifics - Jam/Panther/XMLink" exists in the options
      const initialSelection = custom.some(
        (item) => item.value === "Prolifics - Jam/Panther/XMLink"
      )
        ? custom.filter(
            (item) => item.value !== "Prolifics - Jam/Panther/XMLink"
          )
        : custom;
      let valuesArray = custom.map((item) => item.value);
      let valuesString = initialSelection.map((item) => item.value).join(",");

      setVendor1(valuesString);
      setp1Data(custom);
      setSelectedp1(initialSelection);
      setResetVendor(initialSelection);
    });
  };

  //// -------breadcrumbs-----

  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["S/W Plan and Review"];
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
      const modifiedUrlPath = "/pmo/salesSoftwares";
      getUrlPath(modifiedUrlPath);

      let data = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Project Timesheet (Deprecated)" &&
              subMenu.display_name !== "Invoice Details" &&
              subMenu.display_name !== "Accounting" &&
              subMenu.display_name !== "Upload" &&
              subMenu.display_name !== "Practice Calls [Deprecated]"
          );
        }

        return menu;
      });

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
      const projectStatusReportSubMenu = data
        .find((item) => item.display_name === "Sales")
        .subMenus.find(
          (subMenu) => subMenu.display_name === "S/W Plan & Review"
        );
      setAccessData(projectStatusReportSubMenu.access_level);
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

  useEffect(() => {
    getWriteAcess();
    practice1();
  }, []);
  {
    wirteData == loggedUserId ? "sai Bandhavi" : "sai Teja";
  }

  const array = wirteData;

  const arrayToString = array.join(",");

  const firstData = "a,b,c,d";
  const secondData = "e,f,g,a";
  const dataArray = wirteData;
  const isIdPresent = dataArray.some((item) => item.user_id === +loggedUserId);
  const isAnyElementPresent = () => {
    const firstDataElements = firstData.split(",");
    const secondDataElements = secondData.split(",");

    for (let i = 0; i < secondDataElements.length; i++) {
      if (firstDataElements.includes(secondDataElements[i])) {
        return true;
      }
    }
    return false;
  };

  const [quarterdate, setQuarterDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const quarter = Math.floor((today.getMonth() + 3) / 3); // Calculate current quarter
    const startMonth = (quarter - 1) * 3; // Start month of the quarter
    const startDate = new Date(year, startMonth, 1); // Start date of the quarter
    return startDate;
  });
  //---------------------------------------Values----------------------------------------------

  const executiveIdPayload = SelectSEData;
  const targetDataPayload = {
    mode: "edit",
    from: fydata,
    duration: "4",
    vendors: "-1",
    divisions: "-1",
    executives: "0",
    isActive: "true",
    isIndividual:
      isIndividualChecked.length == 0 ? "false" : isIndividualChecked,
    type: "target",
    key: "1662978029003",
    selectExecs: "-2",
    saveSE: "true",
    customers: -1,
    prospects: -1,
    practices: -1,
    countries: -1,
    customerType: -1,
    summary: -1,
    showBy: -1,
    optType: -1,
    quarter: -1,
    status: -1,
    duration2: -1,
    monthsel: -1,
    viewByTime: -1,
    fyear: -1,
    aelocation: -1,
    engComp: -1,
    Divisions: -1,
    accOwner: -1,
    newCust: -1,
    accType: -1,
    measures: -1,
  };

  const wowDataPayload = {
    mode: "wow",
    from: moment(quarterdate).format("YYYY-MM-DD"),
    duration: duration,
    vendors: vendor1,
    divisions: division,
    executives: salesEx == 1 ? formattedIds : salesEx,
    type: "wow",
    subType: "detail",
    isActive: "true",
    isIndividual:
      isIndividualChecked.length == 0 ? "false" : isIndividualChecked,
    saveSE: "false",
    selectExecs: "",
    showBy: showbyvalue,
    optType: -1,
    quarter: -1,
    status: -1,
    duration2: -1,
    measures: -1,
    monthsel: -1,
    viewByTime: -1,
    fyear: -1,
    customers: -1,
    prospects: -1,
    practices: -1,
    countries: -1,
    customerType: -1,
    summary: -1,
    aelocation: -1,
    engComp: -1,
    Divisions: -1,
    accOwner: -1,
    newCust: -1,
    accType: -1,
  };
  const newStartDate = moment(startDate);

  const viewDataPayload = {
    mode: "view",
    from: moment(quarterdate).format("YYYY-MM-DD"),
    duration: duration,
    vendors: vendor1,
    divisions: division,
    // executives: salesSE,
    executives: salesEx == 1 ? executiveIdPayload : salesEx,
    salesId: salesexecutiveid,
    isActive: "true",
    isIndividual:
      isIndividualChecked.length == 0 ? "false" : isIndividualChecked,
    type: "view",
    key: "1662974432015",
    selectExecs: Salesexecutivename,
    saveSE: "true",
    optType: -1,
    quarter: -1,
    status: -1,
    duration2: -1,
    measures: -1,
    monthsel: -1,
    viewByTime: -1,
    fyear: -1,
    customers: -1,
    prospects: -1,
    practices: -1,
    countries: -1,
    customerType: -1,
    summary: -1,
    showBy: -1,
    aelocation: -1,
    engComp: -1,
    Divisions: -1,
    accOwner: -1,
    newCust: -1,
    accType: -1,
  };
  //------------------------methods---------------------------------

  const onFilterChange = ({ id, value }) => {
    setQdate(value);
    setFdate(value);

    // switch (id) {
    //   case "executives":
    //     settargetDataPayload((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     setwowDatapaylaod((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     setviewDataPayload((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });

    //     break;
    //   case "vendors":
    //     setwowDatapaylaod((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     setviewDataPayload((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     break;
    //   case "division":
    //     setwowDatapaylaod((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     setviewDataPayload((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     break;
    //   case "from":
    //     settargetDataPayload((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     setwowDatapaylaod((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     setviewDataPayload((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });

    //     break;
    //   case "duration":
    //     setviewDataPayload((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     break;
    //   case "showBy":
    //     setwowDatapaylaod((prevState) => {
    //       return { ...prevState, [id]: value };
    //     });
    //     break;

    //   default:
    //     break;
    // }

    setSoftwarePayload((prevState) => {
      return { ...prevState, [id]: value };
    });

    let SelectSEData1 = SelectSEData.slice(0, -1);
    switch (value) {
      case "view":
        setSoftwarePayload((prevState) => {
          return {
            ...prevState,
            mode: "view",
            from: moment(quarterdate).format("YYYY-MM-DD"),
            duration: duration,
            vendors: vendor1,
            divisions: division,
            executives: salesEx == 1 ? executiveIdPayload : salesEx,
            salesId: salesexecutiveid,
            isIndividual:
              isIndividualChecked.length == 0 ? "false" : isIndividualChecked,
            type: "view",
            selectExecs: Salesexecutivename,
          };
        });
        break;

      case "target":
        setSoftwarePayload((prevState) => {
          return {
            ...prevState,
            mode: "edit",
            from: stDate,
            duration: "4",
            vendors:
              "AllSight,AWS,Azure,BIGID,Breakwater,Cleanslate,Collibra,Data Bricks,Data Sentinel,Data.World,DataRobot,dbt Labs,Denodo,DiscoverAlpha,EDB,Evolveware,HCL America Inc,IBM,IBM - IM&A,IBM - SI,IBM – AWS,IBM – Azure,IBM – SI,IM&A Other SW,IM&A-Data Fabric,ImageAccess,Informatica,Intellective/Vega,Jedox,Manta,Manta MS Purview Bridge,Mendix,Meta Integration (Miti),Microsoft,MongoDB,MQAttach,MuleSoft,myInvenio,New Relic,Okta,OneTrust,Prolifics - Effecta/SLA/BA360,Prolifics - Jam/Panther/XMLink,Prolifics - PPMweb,Qlik,Quest,RedHat,Rocket,Senzing,SI - Other SW,Snowflake,SWOne,Talend,Testing Other (HP),Tricentis,UiPath,Unassigned",
            divisions: "-1",
            // executives: "-2",
            executives: salesEx == 1 ? SelectSEData1 : salesEx,
            isActive: "true",
            isIndividual:
              isIndividualChecked.length == 0 ? "false" : isIndividualChecked,
            type: "target",
            key: "1662978029003",
            selectExecs: SalesExecutiveNames,
            salesId: salesexecutiveid,
          };
        });

        break;
      case "wow":
        setSoftwarePayload((prevState) => {
          return {
            ...prevState,
            mode: "wow",
            from: moment(quarterdate).format("YYYY-MM-DD"),
            duration: duration,
            vendors: vendor1,
            divisions: division,
            executives: salesEx == 1 ? formattedIds : salesEx,
            type: "wow",
            subType: "detail",
            isActive: "true",
            isIndividual:
              isIndividualChecked.length == 0 ? "false" : isIndividualChecked,
            saveSE: "false",
            selectExecs: "",
            showBy: showbyvalue,
          };
        });
    }

    if (id === "executives" && value === "1") {
      setVisible(true);
    }
  };

  const softwareSearchValidator = () => {
    setShowDetails(false);
    let payload = id != null ? softwarePayload : viewDataPayload;
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid == true) {
      setsearching(false);
      setErrorMsg(true);
    }

    if (valid) {
      // setValidator(true);
      // setErrorMsg(true)
      return;
    }
    switch (actionSelector) {
      case "target":
        payload = targetDataPayload;
        break;

      case "view":
        payload = viewDataPayload;
        break;

      case "wow":
        payload = wowDataPayload;
        break;

      default:
        break;
    }
    payload.executives === "1"
      ? (payload.executives = String(
          JSON.parse(localStorage.getItem("selectedSELocal")).map((item) => {
            return item.id;
          })
        ))
      : "";
    payload.executives === "1"
      ? (payload.isActive = JSON.parse(
          localStorage.getItem("isIndividualCheckedLocal")
        ))
      : "";
    payload.customers === "1" &&
    (localStorage.getItem("selectedCust") === null ||
      localStorage.getItem("selectedCust") === undefined ||
      localStorage.getItem("selectedCust") === "[]")
      ? setErrorMsg(true)
      : getSoftwareData();
    setShowDetails(true);
  };

  // -----------------------calls----------------------------------
  const softwareSearchValidatorSavedSearch = () => {
    // setShowDetails(false);
    const payload = {
      mode: filterData?.mode,
      from: filterData.from,
      duration: filterData?.duration,
      vendors: filterData.vendors,
      divisions: filterData.divisions,
      // executives: salesSE,
      executives: filterData.executives,
      salesId: filterData.salesId,
      isActive: filterData.isActive,
      isIndividual: filterData.isIndividual,
      type: filterData?.type,
      key: "1662974432015",
      selectExecs: filterData.selectExecs,
      saveSE: "true",
      optType: filterData.optType,
      quarter: filterData.quarter,
      status: filterData.status,
      duration2: filterData.duration2,
      measures: filterData.measures,
      monthsel: filterData.monthsel,
      viewByTime: filterData.viewByTime,
      fyear: filterData.fyear,
      customers: filterData.customers,
      prospects: filterData.prospects,
      practices: filterData.practices,
      countries: filterData.countries,
      customerType: filterData.customerType,
      summary: filterData.summary,
      showBy: filterData.showBy,
      aelocation: filterData.aelocation,
      engComp: filterData.engComp,
      Divisions: filterData.Divisions,
      accOwner: filterData.accOwner,
      newCust: filterData.newCust,
      accType: filterData.accType,
    };
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid == true) {
      setsearching(false);
      setErrorMsg(true);
    }

    if (valid) {
      // setValidator(true);
      // setErrorMsg(true)
      return;
    }
    // switch (actionSelector) {
    //   case "target":
    //     payload = targetDataPayload;
    //     break;

    //   case "view":
    //     payload = viewDataPayload;
    //     break;

    //   case "wow":
    //     payload = wowDataPayload;
    //     break;

    //   default:
    //     break;
    // }
    payload.executives === "1"
      ? (payload.executives = String(
          JSON.parse(localStorage.getItem("selectedSELocal")).map((item) => {
            return item.id;
          })
        ))
      : "";
    payload.executives === "1"
      ? (payload.isActive = JSON.parse(
          localStorage.getItem("isIndividualCheckedLocal")
        ))
      : "";
    payload.customers === "1" &&
    (localStorage.getItem("selectedCust") === null ||
      localStorage.getItem("selectedCust") === undefined ||
      localStorage.getItem("selectedCust") === "[]")
      ? setErrorMsg(true)
      : getSoftwareDataSavedSearch();
    setShowDetails(true);
  };

  const getSoftwareDataSavedSearch = () => {
    setLoader(true);
    const payload = {
      mode: filterData?.mode,
      from: filterData?.from,
      duration: filterData?.duration,
      vendors: filterData?.vendors,
      divisions: filterData?.divisions,
      // executives: salesSE,
      executives: filterData?.executives,
      salesId: filterData.salesId,
      isActive: filterData?.isActive,
      isIndividual: filterData?.isIndividual,
      type: filterData?.type,
      key: "1662974432015",
      selectExecs: filterData?.selectExecs,
      saveSE: "true",
      optType: filterData?.optType,
      quarter: filterData?.quarter,
      status: filterData?.status,
      duration2: filterData?.duration2,
      measures: filterData.measures,
      monthsel: filterData?.monthsel,
      viewByTime: filterData?.viewByTime,
      fyear: filterData?.fyear,
      customers: filterData?.customers,
      prospects: filterData?.prospects,
      practices: filterData?.practices,
      countries: filterData?.countries,
      customerType: filterData?.customerType,
      summary: filterData?.summary,
      showBy: filterData?.showBy,
      aelocation: filterData?.aelocation,
      engComp: filterData?.engComp,
      Divisions: filterData?.Divisions,
      accOwner: filterData?.accOwner,
      newCust: filterData?.newCust,
      accType: filterData?.accType,
    };

    setsearching(false);
    // setTableFlag(false)
    setErrorMsg(false);
    payload.executives === "1"
      ? (payload.executives = String(
          JSON.parse(localStorage.getItem("selectedSELocal")).map((item) => {
            return item.id;
          })
        ))
      : "";
    payload.customers === "1"
      ? (payload.customers = String(
          JSON.parse(localStorage.getItem("selectedCust")).map((item) => {
            return item.id;
          })
        ))
      : "";

    axios
      .post(
        baseUrl + `/SalesMS/software/getSalesSoftwareData`,

        payload
      )
      .then((resp) => {
        setLoader(false);
        const data = resp.data.data;
        const reportRunId = resp.data.reportRunId;

        if (filterData?.type == "view") {
          const allQuarter = data
            ?.filter((item) => item.lvl === 1)
            .map((item) => {
              return { quat: item.quarter, date: item.date };
            });
          const Date = allQuarter[0]?.quat; // Assuming allQuarter is an array of quarter strings
          const formattedDate = calculateStartDate(Date);
          const updatedDate = subtractYearFromDate(formattedDate);
          dispatch(updateQuaterDate(updatedDate));
        }

        dispatch(setReportRunIdRedux(reportRunId));
        let array = [];
        switch (filterData?.type) {
          case "target":
            array = resp.data.swTargets?.split(",");
            break;
          case "view":
            array = [
              "id",
              "quarter",
              "executive",
              "execStatus",
              "country",
              // "date",
              "target",
              "oppAmount",
              "calls",
              "upside",
              "gap",
              "lvl",
              "closedAmount",
              "isActive",
            ];
            break;
          case "wow":
            array =
              filterData?.showBy === "week"
                ? [
                    "id",
                    "weekno",
                    "date",
                    "executive",
                    "execStatus",
                    "supervisor",
                    "target",
                    "oppAmount",
                    "calls",
                    "upside",
                    "gap",
                    "closedAmount",
                    "lvl",
                    "count",
                  ]
                : [
                    "id",
                    "executive",
                    "weekno",
                    "date",
                    "execStatus",
                    "target",
                    "oppAmount",
                    "clls",
                    "upside",
                    "gap",
                    "closedAmount",
                    "lvl",
                    "count",
                    "supervisor",
                  ];
            setwowtype(filterData?.showBy);
            break;

          default:
            break;
        }
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });
        setSoftwareData(newArray);
        setreportRunId(reportRunId);
        setsearching(false);
        setWowDisplay(true);
        setViewDisplay(true);
        setShowDetails(true);

        setTargetDataKeys(resp.data.swTargets);
        setVisibleC(!visibleC);
        visibleC
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getData1SavedSearch = () => {
    let valid = GlobalValidation(ref);

    if (valid == true) {
      setsearching(false);
      setErrorMsg(true);
    }
    setErrorMsg(false);
    setLoader(true);
    setButtonAction(false);
    let SelectSEData1 = SelectSEData.slice(0, -1);
    let date = "";

    const fromDate = filterData?.from; // Use provided date or stDate if id is null
    const fromDateObj = new Date(fromDate);

    // Add one year
    fromDateObj.setFullYear(fromDateObj.getFullYear());
    // Calculate the quarter month
    const currentMonth = fromDateObj.getMonth();
    if (currentMonth < 0 || currentMonth > 11) {
      // Handle invalid month, e.g., set it to January
      fromDateObj.setMonth(0);
    } else {
      const nextQuarterMonth = Math.ceil((currentMonth + 1) / 3) * 3;
      fromDateObj.setMonth(nextQuarterMonth);
    }

    const resultDate = fromDateObj.toISOString().slice(0, 10);
    date = resultDate;
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/services/getSalesTargetsSW`,
      data: {
        mode: "edit",
        from: filterData.from,
        duration: "4",
        vendors:
          "AllSight,AWS,Azure,BIGID,Breakwater,Cleanslate,Collibra,Data Bricks,Data Sentinel,Data.World,DataRobot,dbt Labs,Denodo,DiscoverAlpha,EDB,Evolveware,HCL America Inc,IBM,IBM - IM&A,IBM - SI,IBM – AWS,IBM – Azure,IBM – SI,IM&A Other SW,IM&A-Data Fabric,ImageAccess,Informatica,Intellective/Vega,Jedox,Manta,Manta MS Purview Bridge,Mendix,Meta Integration (Miti),Microsoft,MongoDB,MQAttach,MuleSoft,myInvenio,New Relic,Okta,OneTrust,Prolifics - Effecta/SLA/BA360,Prolifics - Jam/Panther/XMLink,Prolifics - PPMweb,Qlik,Quest,RedHat,Rocket,Senzing,SI - Other SW,Snowflake,SWOne,Talend,Testing Other (HP),Tricentis,UiPath,Unassigned",
        divisions: filterData.division,
        // executives: "-2",
        executives: filterData.executives,
        isActive: "true",
        isIndividual: filterData.isIndividualChecked,
        type: "target",
        key: "1662978029003",
        selectExecs: filterData.selectExecs,
        salesId: filterData.salesId,
        saveSE: "true",
        customers: -1,
        prospects: -1,
        practices: -1,
        countries: -1,
        customerType: -1,
        summary: -1,
        showBy: -1,
        optType: -1,
        quarter: -1,
        status: -1,
        duration2: -1,
        monthsel: -1,
        viewByTime: -1,
        fyear: -1,
        aelocation: -1,
        engComp: -1,
        Divisions: -1,
        accOwner: -1,
        newCust: -1,
        accType: -1,
        measures: -1,
      },

      headers: { "Content-Type": "application/json" },
      // signal: abortController.current.signal,
    }).then((response) => {
      const data = response.data;
      setTableData(data);
      setReportId(data.reportRunId);
      setHeaderData(data.summary[0]);
      setData(data.data);
      setTargetOpen(true);
      setLoader(false);
      setVisibleC(!visibleC);
      visibleC
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      setButtonAction(true);
    });
  };
  useEffect(() => {
    if ((id !== null) & (filterData.type != "target")) {
      setTimeout(() => {
        softwareSearchValidatorSavedSearch();
      }, 3000);
    }
  }, [filterData]);

  useEffect(() => {
    if (id != null && filterData.type === "target") {
      setTimeout(() => {
        getData1SavedSearch();
      }, 3000);
    }
  }, [filterData]);
  // -----------------------calls----------------------------------

  const getvendor = () => {
    axios
      .get(baseUrl + "/CommonMS/master/getSalesVendors")
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        setvendorDropdown(dropdownOptions);
        setselectedvendor(dropdownOptions);
        setwowDatapaylaod((prevState) => {
          return {
            ...prevState,
            ["vendors"]: String(dropdownOptions.map((item) => item.value)),
          };
        });
        setviewDataPayload((prevState) => {
          return {
            ...prevState,
            ["vendors"]: String(dropdownOptions.map((item) => item.value)),
          };
        });
        settargetDataPayload((prevState) => {
          return {
            ...prevState,
            ["vendors"]: String(dropdownOptions.map((item) => item.value)),
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getsalesExecutiveDropdown = () => {
    axios
      .get(baseUrl + "/SalesMS/MasterController/salesExecutiveData")
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data
          .filter((item) => item.isActive === 1)
          .map((item) => {
            return (
              <option key={item.id} value={item.val}>
                {item.lkupName}
              </option>
            );
          });
        setsalesExecutiveDropdown(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const getSFOwnerDivisionsDropdown = () => {
    axios
      .get(baseUrl + `/SalesMS/MasterController/SFOwnerDivisions`)
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          return {
            value: item.id,
            label: item.owner_Division,
          };
        });
        setSFOwnerDivisionsDropdown(dropdownOptions);
        setselectesFOwnerDivison(dropdownOptions);
        setwowDatapaylaod((prevState) => {
          return {
            ...prevState,
            ["divisions"]: String(dropdownOptions.map((item) => item.value)),
          };
        });
        setviewDataPayload((prevState) => {
          return {
            ...prevState,
            ["divisions"]: String(dropdownOptions.map((item) => item.value)),
          };
        });
        settargetDataPayload((prevState) => {
          return {
            ...prevState,
            ["divisions"]: String(dropdownOptions.map((item) => item.value)),
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const quarterToMonth = {
    Q1: "04",
    Q2: "07",
    Q3: "10",
    Q4: "01",
  };

  function calculateStartDate(quarterString) {
    const match = quarterString?.match(/^(\d{4})-Q(\d)$/);
    if (match) {
      let year = parseInt(match[1], 10);
      const quarter = parseInt(match[2], 10);

      // Handle Q4, incrementing the year
      if (quarter === 4) {
        year++;
      }

      const month = quarterToMonth[`Q${quarter}`];
      const day = "01";
      return `${year}-${month}-${day}`;
    }
    return null; // Handle invalid input gracefully
  }

  function subtractYearFromDate(dateString) {
    const currentDate = new Date(dateString);
    currentDate.setFullYear(currentDate.getFullYear() - 1);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const userRoles = () => {
    // axios.get({
    //   `/timeandexpensesms/ShiftAllownces/getuserroleid?user_id=${loggedUserId}`
    // )}.then((response)=>{
    axios({
      method: "GET",
      url:
        baseUrl +
        `/timeandexpensesms/ShiftAllownces/getuserroleid?user_id=${loggedUserId}`,
    }).then((resp) => {
      const data = resp.data;
      const salesAccess = data[0].role_type_id.includes("920") && 920;
      setSalesfullAccess(salesAccess);
    });
  };
  useEffect(() => {
    userRoles();
  }, []);

  const getSoftwareData = () => {
    let payload = id != null ? softwarePayload : viewDataPayload;
    switch (actionSelector) {
      case "target":
        payload = id != null ? softwarePayload : targetDataPayload;
        break;

      case "view":
        payload = id != null ? softwarePayload : viewDataPayload;
        break;

      case "wow":
        payload = id != null ? softwarePayload : wowDataPayload;
        break;

      default:
        break;
    }
    setsearching(false);
    // setTableFlag(false)
    setErrorMsg(false);
    payload.executives === "1"
      ? (payload.executives = String(
          JSON.parse(localStorage.getItem("selectedSELocal")).map((item) => {
            return item.id;
          })
        ))
      : "";
    payload.customers === "1"
      ? (payload.customers = String(
          JSON.parse(localStorage.getItem("selectedCust")).map((item) => {
            return item.id;
          })
        ))
      : "";

    axios
      .post(baseUrl + `/SalesMS/software/getSalesSoftwareData`, payload)
      .then((resp) => {
        setLoader(false);
        const data = resp.data.data;
        const reportRunId = resp.data.reportRunId;

        if (actionSelector == "view") {
          const allQuarter = data
            ?.filter((item) => item.lvl === 1)
            .map((item) => {
              return { quat: item.quarter, date: item.date };
            });
          const Date = allQuarter[0]?.quat; // Assuming allQuarter is an array of quarter strings
          const formattedDate = calculateStartDate(Date);
          const updatedDate = subtractYearFromDate(formattedDate);
          dispatch(updateQuaterDate(updatedDate));
        }

        dispatch(setReportRunIdRedux(reportRunId));
        let array = [];
        switch (actionSelector) {
          case "target":
            array = resp.data.swTargets?.split(",");
            break;
          case "view":
            array = [
              "id",
              "quarter",
              "executive",
              "execStatus",
              "country",
              // "date",
              "target",
              "oppAmount",
              "calls",
              "upside",
              "gap",
              "lvl",
              "closedAmount",
              "isActive",
            ];
            break;
          case "wow":
            array =
              wowDataPayload.showBy === "week"
                ? [
                    "id",
                    "weekno",
                    "date",
                    "executive",
                    "execStatus",
                    "supervisor",
                    "target",
                    "oppAmount",
                    "calls",
                    "upside",
                    "gap",
                    "closedAmount",
                    "lvl",
                    "count",
                  ]
                : [
                    "id",
                    "executive",
                    "weekno",
                    "date",
                    "execStatus",
                    "target",
                    "oppAmount",
                    "clls",
                    "upside",
                    "gap",
                    "closedAmount",
                    "lvl",
                    "count",
                    "supervisor",
                  ];
            setwowtype(wowDataPayload.showBy);
            break;

          default:
            break;
        }
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });
        setSoftwareData(newArray);
        setreportRunId(reportRunId);
        setsearching(false);
        setWowDisplay(true);
        setViewDisplay(true);
        setTargetDataKeys(resp.data.swTargets);
        setVisibleC(!visibleC);
        visibleC
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getData1 = () => {
    let valid = GlobalValidation(ref);

    if (valid == true) {
      setsearching(false);
      setErrorMsg(true);
    }
    setErrorMsg(false);
    setLoader(true);
    setButtonAction(false);
    let SelectSEData1 = SelectSEData.slice(0, -1);
    let date = "";
    if (id != null) {
      const fromDate = filterData?.from; // Use provided date or stDate if id is null
      const fromDateObj = new Date(fromDate);

      // Add one year
      fromDateObj.setFullYear(fromDateObj.getFullYear());
      // Calculate the quarter month
      const currentMonth = fromDateObj.getMonth();
      if (currentMonth < 0 || currentMonth > 11) {
        // Handle invalid month, e.g., set it to January
        fromDateObj.setMonth(0);
      } else {
        const nextQuarterMonth = Math.ceil((currentMonth + 1) / 3) * 3;
        fromDateObj.setMonth(nextQuarterMonth);
      }
      const resultDate = fromDateObj.toISOString().slice(0, 10);
      date = resultDate;
    }
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/services/getSalesTargetsSW`,
      data: {
        mode: "edit",
        from: id == null ? stDate : date,
        duration: "4",
        vendors:
          "AllSight,AWS,Azure,BIGID,Breakwater,Cleanslate,Collibra,Data Bricks,Data Sentinel,Data.World,DataRobot,dbt Labs,Denodo,DiscoverAlpha,EDB,Evolveware,HCL America Inc,IBM,IBM - IM&A,IBM - SI,IBM – AWS,IBM – Azure,IBM – SI,IM&A Other SW,IM&A-Data Fabric,ImageAccess,Informatica,Intellective/Vega,Jedox,Manta,Manta MS Purview Bridge,Mendix,Meta Integration (Miti),Microsoft,MongoDB,MQAttach,MuleSoft,myInvenio,New Relic,Okta,OneTrust,Prolifics - Effecta/SLA/BA360,Prolifics - Jam/Panther/XMLink,Prolifics - PPMweb,Qlik,Quest,RedHat,Rocket,Senzing,SI - Other SW,Snowflake,SWOne,Talend,Testing Other (HP),Tricentis,UiPath,Unassigned",
        divisions: division,
        // executives: "-2",
        executives: salesEx == 1 ? SelectSEData1 : salesEx,
        isActive: "true",
        isIndividual:
          isIndividualChecked.length == 0 ? "false" : isIndividualChecked,
        type: "target",
        key: "1662978029003",
        selectExecs: SalesExecutiveNames,
        salesId: salesexecutiveid,
        saveSE: "true",
        customers: -1,
        prospects: -1,
        practices: -1,
        countries: -1,
        customerType: -1,
        summary: -1,
        showBy: -1,
        optType: -1,
        quarter: -1,
        status: -1,
        duration2: -1,
        monthsel: -1,
        viewByTime: -1,
        fyear: -1,
        aelocation: -1,
        engComp: -1,
        Divisions: -1,
        accOwner: -1,
        newCust: -1,
        accType: -1,
        measures: -1,
      },

      headers: { "Content-Type": "application/json" },
      // signal: abortController.current.signal,
    }).then((response) => {
      const data = response.data;
      setTableData(data);
      setReportId(data.reportRunId);
      setHeaderData(data.summary[0]);
      setData(data.data);
      setTargetOpen(true);
      setLoader(false);
      !valid && setVisibleC(!visibleC);
      visibleC
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      setButtonAction(true);
    });
  };

  // -----------------------------useEffect---------------------------------
  useEffect(() => {
    getsalesExecutiveDropdown();
    getSFOwnerDivisionsDropdown();
    // getSoftwareData();
    getvendor();
  }, []);

  useEffect(() => {
    setSelector(actionSelector);
  }, [softwareData]);
  // const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [errormessage, setErrorMessage] = useState(false);
  const HelpPDFName = "SW Plan and Review.pdf";
  const Headername = "S/W Plan and Review Help";
  // const [editmsg, setEditAddmsg] = useState(false);

  const resetFilters = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(date.getMonth() - 3);
    // Reset the values of all filters to their initial values here
    setStartDate(date); // Reset start date to initial value
    setFinancialYearDate(oneYearLater);

    const data = -2;

    setSelectedSEVal(data); // Reset selected sales executive value to initial value
    // setSelectedp1(vendor1);
    setSelectedp1(resetVendor);
    setselectedSE("<< All SE >>");
    setSalesEx(data);
    setVendor1(
      "AllSight,AWS,Azure,BIGID,Boomi,Breakwater,Cleanslate,Collibra,Cyberark,Data Bricks,Data Sentinel,Data.World,DataRobot,dbt Labs,Delinea,Denodo,DiscoverAlpha,EDB,Evolveware,HCL America Inc,IBM,IBM - IM&A,IBM - SI,IBM – AWS,IBM – Azure,IBM – SI,IM&A Other SW,IM&A-Data Fabric,ImageAccess,Informatica,Intellective/Vega,Jedox,Manta,Manta MS Purview Bridge,Mendix,Meta Integration (Miti),Microsoft,MongoDB,MQAttach,MuleSoft,myInvenio,New Relic,Okta,OneTrust,Prolifics - Effecta/SLA/BA360,Prolifics - PPMweb,Qlik,Quest,RedHat,Rocket,Senzing,SI - Other SW,Snowflake,SoftwareAG,SWOne,Talend,Testing Other (HP),Tricentis,UiPath,Unassigned"
    );

    setselectesFOwnerDivison(sFOwnerDivisionsDropdown);
    const dropdown = sFOwnerDivisionsDropdown.label;
    setDivision(dropdown);
  };

  return (
    <div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>S/W Plan and Review</h2>
          </div>
          <div className="childThree toggleBtns">
            <div>
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
              <span className="saveBtn">
                <SavedSearchGlobal
                  setEditAddmsg={setEditAddmsg}
                  pageurl={pageurl}
                  page_Name={page_Name}
                  payload={softwarePayload}
                />
              </span>
            </div>
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      <div>{}</div>

      {errorMsg ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}
      {errormessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning />
          No Modifications to Save
        </div>
      ) : (
        ""
      )}
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Search created successfully.
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="group customCard">
        <CCollapse visible={!visibleC}>
          <div className="group-content row">
            <div className="col-md-4 mb-2" id="execSelDiv">
              <div className="form-group row">
                <label className="col-5">Action</label>
                <span className="col-1 p-0">:</span>
                <span className={`col-6 `} style={{ height: "23px" }}>
                  <select
                    id="type"
                    value={actionSelector}
                    className="col-md-12 col-sm-12 col-xs-12 "
                    onChange={(e) => {
                      resetFilters();
                      onFilterChange(e.target);
                      setActionSelector(e.target.value);
                      {
                        e.target.value === "";
                      }
                    }}
                  >
                    <option value={"target"}>{"Targets"}</option>
                    <option value={"view"}>{"View"}</option>
                    <option value={"wow"}>{"WoW"}</option>
                  </select>
                </span>
              </div>
            </div>

            <div className="col-md-4 mb-2" id="execSelDiv">
              <div className="form-group row">
                <label className="col-5 ">
                  Sales Executive{" "}
                  <span className="required error-text ml-1"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6 textfield">
                  {accessData === 1000 ||
                  accessData === 500 ||
                  loggedUserId == 114598021 ||
                  salesfullAccess == 920 ? (
                    <select
                      id="executives"
                      className="text"
                      value={selectedSEVal}
                      onChange={(e) => {
                        onFilterChange({
                          id: "executives",
                          value: e.target.value,
                        });
                        setSelectedSEVal(e.target.value);
                        setSalesEx(e.target.value);
                        setViewSlesId(e.target.value);
                        setselectedSE(
                          e.target.options[e.target.selectedIndex].text
                        );
                      }}
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <option value={""}>{"<< Please select>> "}</option>
                      {salesExecutiveDropdown}
                    </select>
                  ) : (
                    <select
                      id="executives"
                      className="text"
                      value={selectedSEVal}
                      onChange={(e) => {
                        onFilterChange({
                          id: "executives",
                          value: e.target.value,
                        });
                        setSelectedSEVal(e.target.value);
                        setSalesEx(e.target.value);
                        setViewSlesId(e.target.value);
                        setselectedSE(
                          e.target.options[e.target.selectedIndex].text
                        );
                      }}
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <option value={""}>{"<< Please select>> "}</option>
                      <option value="1">Select SE</option>
                    </select>
                  )}
                </span>
              </div>
            </div>

            {actionSelector === "target" && (
              <div className="col-md-4 mb-2">
                <div className="form-group row" id="week-picker-wrapper">
                  <label className="col-5">
                    Financial Year{" "}
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 datepicker targetDatepicker"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <DatePicker
                      id="startDate"
                      selected={FinancialYearDate}
                      onChange={(e) => {
                        const oneYearLater = new Date(
                          e.getFullYear() + 1,
                          e.getMonth(),
                          e.getDate()
                        );
                        setStartDate(e);
                        setFinancialYearDate(oneYearLater);
                        DateChange({
                          id: "from",
                          value: e.toLocaleDateString("en-CA"),
                        });
                        onFilterChange({
                          id: "from",
                          value: e.toLocaleDateString("en-CA"),
                        });
                      }}
                      dateFormat="'FY' yyyy"
                      showYearPicker
                      yearDropdownItemNumber={4}
                    />
                  </span>
                </div>
              </div>
            )}

            {(actionSelector === "view" || actionSelector === "wow") && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Vendors <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect"
                    style={{ height: "23px" }}
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="vendors"
                      options={p1data}
                      hasSelectAll={true}
                      value={selectedp1}
                      disabled={false}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => {
                        setSelectedp1(e);
                        let filterPractice = [];
                        e.forEach((d) => {
                          filterPractice.push(d.value);
                        });
                        setVendor1(filterPractice.toString());
                        onFilterChange({
                          id: "vendors",
                          value: filterPractice.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            {(actionSelector === "view" || actionSelector === "wow") && (
              <div className="col-md-4 mb-2">
                <div className="clearfix" style={{ height: "12px" }}></div>
                <div className="form-group row">
                  <label className="col-5">
                    Sales Division{" "}
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect"
                    style={{ height: "23px" }}
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      options={sFOwnerDivisionsDropdown}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectesFOwnerDivison}
                      disabled={false}
                      onChange={(e) => {
                        setselectesFOwnerDivison(e);
                        let filterPractice = [];
                        e.forEach((d) => {
                          filterPractice.push(d.value);
                        });
                        setDivision(filterPractice.toString());
                        onFilterChange({
                          id: "divisions",
                          value: filterPractice.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            {(actionSelector === "view" || actionSelector === "wow") && (
              <div className="col-md-4 mb-2">
                <div className="clearfix" style={{ height: "10px" }}></div>
                <div className="form-group row" id="week-picker-wrapper">
                  <label className="col-5">
                    From Quarter{" "}
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 datepicker"
                    style={{ height: "23px" }}
                    ref={(ele) => {
                      ref.current[4] = ele;
                    }}
                  >
                    <DatePicker
                      selected={startDate}
                      onChange={(e) => {
                        setStartDate(e);
                        const date = new Date(e.getTime());
                        date.setFullYear(date.getFullYear() - 1);
                        date.setMonth(date.getMonth() + 3);
                        setQuarterDate(date);
                        onFilterChange({
                          id: "from",
                          value: date.toLocaleDateString("en-CA"),
                        });
                      }}
                      dateFormat="'FY' yyyy-QQQ"
                      showQuarterYearPicker
                    />
                  </span>
                </div>
              </div>
            )}
            {actionSelector === "view" && (
              <div className="col-md-4 mb-2">
                <div className="clearfix" style={{ height: "12px" }}></div>
                <div className="form-group row">
                  <label className="col-5">Duration</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6" style={{ height: "23px" }}>
                    <select
                      id="duration"
                      name="duration"
                      className="col-md-12 col-sm-12 col-xs-12 "
                      // defaultValue={"4"}
                      value={softwarePayload?.duration}
                      onChange={(e) => {
                        setDuration(e.target.value);
                        onFilterChange(e.target);
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

            {actionSelector === "wow" && (
              <div className="col-md-4 mb-2">
                <div className="clearfix" style={{ height: "12px" }}></div>
                <div className="form-group row">
                  <label className="col-5">Show By</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6" style={{ height: "23px" }}>
                    <select
                      id="showBy"
                      name="showBy"
                      className="col-md-12 col-sm-12 col-xs-12 "
                      value={showbyvalue}
                      onChange={(e) => {
                        setShowByValue(e.target.value);
                        onFilterChange({
                          id: "showBy",
                          value: e.target.value,
                        });
                      }}
                    >
                      <option value="week">Week</option>
                      <option value="exec">Sales Executive</option>
                    </select>
                  </span>
                </div>
              </div>
            )}

            <div className="col-md-12 no-padding section">
              <div className="seFooter" style={{ borderTop: "1px solid #CCC" }}>
                {" "}
                <span className="selectedSE">
                  <b>Selected SE : </b>
                  <span className="dynText">
                    {selectedSE === "<< Select SE >>"
                      ? localSE.map((item, index) => (
                          <span key={item.id}>
                            {isIndividualChecked
                              ? item.salesPersonName
                                ? item.salesPersonName
                                : item.text
                              : item.salesPersonName
                              ? item.salesPersonName
                              : item.text + ` & Team`}
                            {index === localSE.length - 1 ? "" : ", "}
                          </span>
                        ))
                      : selectedSE}
                  </span>
                </span>
                <div className="clearfix " style={{ height: "5px" }}></div>
              </div>
            </div>

            {actionSelector == "target" ? (
              <div className="col-md-12 col-sm-12 col-xs-12 my-2 search btn-container center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => {
                    getData1();
                    setTargetOpen(false);
                    setWowDisplay(false);
                    setShowDetails(false);
                  }}
                >
                  <FaSearch /> Search{" "}
                </button>
              </div>
            ) : (
              <div className="col-md-12 col-sm-12 col-xs-12 my-2 search btn-container center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={(e) => {
                    softwareSearchValidator();
                    setWowDisplay(false);
                    setTargetOpen(false);
                    setViewDisplay(false);
                  }}
                >
                  <FaSearch /> Search{" "}
                </button>
              </div>
            )}
            <SelectSEDialogBox
              visible={visible}
              setVisible={setVisible}
              setGrpId={setGrpId}
              salesfullAccess={salesfullAccess}
              accessData={accessData}
            />
          </div>
        </CCollapse>
        <br />
        {targetOpen && (
          <>
            {/* <span>
              <b style={{ color: "#297ab0", fontSize: "15px" }}>Targets</b>
            </span> */}
            <TargetTable
              data={data}
              setData={setData}
              tableData={tableData}
              buttonAction={buttonAction}
              reportId={reportId}
              setTableData={setTableData}
              headerData={headerData}
              loader={loader}
              setHeaderData={setHeaderData}
              setErrorMessage={setErrorMessage}
              getData1={getData1}
              accessData={accessData}
            />
          </>
        )}
      </div>
    </div>
  );
}
