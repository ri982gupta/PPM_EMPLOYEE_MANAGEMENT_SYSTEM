import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { parseISO } from "date-fns";

import SelectSEDialogBox from "../SelectSE/SelectSEDialogBox";
import { MultiSelect } from "react-multi-select-component";
import { CCollapse } from "@coreui/react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import moment from "moment";
import Loader from "../Loader/Loader";
import { BiCheck } from "react-icons/bi";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { AiFillWarning } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import ViewTable from "./ViewTable";
import Service from "./Service";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import SelectSESalesDialogBox from "../ReveiwsComponent/SelectSESalesDialogBox";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
// import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { array } from "prop-types";
import { useSelector } from "react-redux";
export default function ServiceSearchFilters(props) {
  const {
    setreportRunId,
    setcoloumnArray,
    setserviceData,
    SfPipeline,
    setSfPipeline,
    setshowSFpipeline,
    hirarchy,
    setSummary,
    setcomponentSelector,
    serviceDataCall,
    setViewBy,
    ViewBy,
    setSearch,
    reportRunId,
    refreshButton,
    setRefreshButton,
  } = props;
  const loggedUserId = localStorage.getItem("resId");
  const [custVisible, setCustVisible] = useState(false);
  const [collectedProspect, setCollectedProspect] = useState([]);
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
  };
  const [selectedItems, setSelectedItems] = useState([{}]);
  const Customer = selectedItems?.map((d) => d?.id).toString();
  const [selectedProspects, setSelectedProspects] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState("0");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const savedSearchId = searchParams.get("id");
  const value = "select";
  const [popupIsLoading, setPopupIsLoading] = useState(false);
  const [resCountry, setResCountry] = useState([]);
  const baseUrl = environment.baseUrl;
  const pageurl = "http://10.11.12.149:3000/#/pmo/salesTargets";
  const page_Name = "Sales";
  const defaultDate = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    return firstDate.toLocaleDateString("en-CA");
  };
  //======Saved Search=======
  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );

  const [filterData, setFilterData] = useState([]);
  const [onchange, setOnchange] = useState(false);
  const [change, SetChange] = useState(false);

  const FilterData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/FiltersData?saved_search_id=${
          savedSearchId === null ? 0 : savedSearchId
        }`,
    }).then(function (res) {
      const getData = res.data;
      setFilterData(getData);
    });
  };

  useEffect(() => {
    FilterData();
    setSelectedProspects(
      JSON.parse(localStorage.getItem("selectedEngCust"))
        ?.map((d) => d.id)
        ?.toString()
    );
    setSelectedCustomers(
      JSON.parse(localStorage.getItem("selectedEngCustOne"))
        ?.map((d) => d.id)
        ?.toString()
    );
  }, []);
  const [servicesPayload, setservicesPayload] = useState({});
  useEffect(() => {
    setservicesPayload(() => {
      if (savedSearchId != null) {
        return {
          mode: filterData?.mode,
          from: filterData?.from,
          duration: filterData?.duration,
          measures:
            filterData?.measures == "" ? "target,call" : filterData?.measures,
          viewByTime: filterData?.viewByTime,
          Divisions: filterData?.Divisions,
          monthsel: filterData?.monthsel,
          executives: filterData?.executives,
          isActive: filterData?.isActive,
          isIndividual: filterData?.isIndividual,
          customers: filterData?.customers == "" ? "-1" : filterData?.customers,
          customerType: filterData?.customerType,
          prospects: filterData?.prospects,
          practices: filterData?.practices,
          countries: filterData?.countries,
          type: filterData?.type,
          summary: filterData?.summary,
          aelocation: filterData?.aelocation,
          engComp: filterData?.engComp,
          key: filterData?.key,
          selectExecs: filterData?.selectExecs,
          fyear: filterData?.fyear,
          accType: filterData?.accType,
          accOwner: filterData?.accOwner,
          newCust: filterData?.newCust,
          showBy: filterData?.showBy,
          vendors: filterData?.vendors,
          optType: filterData?.optType,
          quarter: filterData?.quarter,
          status: filterData?.status,
          duration2: filterData?.duration2,
          divisions: filterData?.divisions,
        };
      } else {
        return {
          mode: "view",
          from: moment(defaultDate()).format("yyyy-MM-DD"),
          duration: "4",
          measures: "target,call",
          viewByTime: "quarter",
          Divisions: "-1",
          monthsel: moment(new Date()).startOf("month").format("YYYY-MM-DD"),
          executives: "-2",
          isActive: "true",
          isIndividual: "false",
          customers: "-1",
          customerType: "-1",
          prospects: "-1",
          practices: "1,3,4,6,999",
          countries: "6,5,3,8,7,1,2,4",
          type: "analytics",
          summary: "Executive",
          aelocation: "-1",
          engComp: "-1",
          key: String(new Date().getTime()),
          selectExecs: "",
          accType: "-1",
          accOwner: "-1",
          newCust: "-1",
          showBy: "-1",
          vendors: "-1",
          optType: "-1",
          quarter: "-1",
          status: "-1",
          duration2: "-1",
          divisions: "-1",
        };
      }
    });
  }, [filterData, savedSearchId]);

  //=======
  const [editmsg, setEditAddmsg] = useState(false);

  const localSE =
    localStorage.getItem("selectedSELocal") === null
      ? []
      : JSON.parse(localStorage.getItem("selectedSELocal"));

  const isIndividualChecked =
    localStorage.getItem("isIndividualCheckedLocal") === null
      ? false
      : JSON.parse(localStorage.getItem("isIndividualCheckedLocal"));
  const [visible, setVisible] = useState(false);
  const [visiblepopup, setVisiblepopup] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const ref = useRef([]);
  const [date, SetDate] = useState(new Date());
  const loggedUser = "0";
  const [dp, setDp] = useState([]);

  const [selectedDp, setSelectedDp] = useState([]);

  const [errorMsg, setErrorMsg] = useState(false);
  const [actionSelector, setActionSelector] = useState("analytics");
  const [action, setAction] = useState(false);
  const [newMemberDropdown, setnewMemberDropdown] = useState([]);
  const [selectedSE, setselectedSE] = useState("<< All SE >>");

  const [selectedSEVal, setSelectedSEVal] = useState(-2);
  const [accessData, setAccessData] = useState([]);
  const [salesExecutiveDropdown, setsalesExecutiveDropdown] = useState([]);
  const [sFOwnerDivisionsDropdown, setSFOwnerDivisionsDropdown] = useState([]);
  const [selectesFOwnerDivison, setselectesFOwnerDivison] = useState(
    sFOwnerDivisionsDropdown
  );
  const [engComp, setengComp] = useState([]);

  const [selectedengComp, setselectedengComp] = useState([]);
  const [salesfullAccess, setSalesfullAccess] = useState([]);
  const [country, setcountry] = useState([]);
  const [selectedcountry, setselectedcountry] = useState([]);
  const [cData, setCData] = useState([]);
  const [selectCDData, setSelectCDData] = useState([]);
  const [selectCusData, setselectCusData] = useState([]);
  const [resSelectedCountry, setResSelectedCountry] = useState([]);
  const [practice, setpractice] = useState([]);
  const [loader, setLoader] = useState(false);
  const [account, setAccount] = useState([]);
  const [selectedpractice, setselectedpractice] = useState([]);
  const [searching, setsearching] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(date.getMonth() - 3);
    return date;
  });

  const measures = [
    { value: "target", label: "Revenue Targets" },
    { value: "sgtrgt", label: "Signings target" },
    { value: "custForecast", label: "Customer Targets" },
    { value: "call", label: "Calls" },
    { value: "estRev", label: "Est. Revenue" },
    { value: "sf", label: "Sf Revenue" },
    { value: "pl", label: "Planned Revenue" },
    { value: "rr", label: "Recognized Revenue" },
    { value: "at", label: "Attainment %" },
    { value: "sgns", label: "Signings" },
  ];

  const [selectedmeasures, setselectedmeasures] = useState([
    { value: "target", label: "Targets" },
    { value: "call", label: "Calls" },
  ]);

  //// -------breadcrumbs-----

  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["Services Plan and Review"];
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
      console.log(data[0].role_type_id.includes("920") && 920);
      const salesAccess = data[0].role_type_id.includes("920") && 920;
      setSalesfullAccess(salesAccess);
    });
  };
  useEffect(() => {
    userRoles();
  }, []);
  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/pmo/salesTargets";
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
      // setAccessData(data);
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
      const projectStatusReportSubMenu = data
        .find((item) => item.display_name === "Sales")
        .subMenus.find(
          (subMenu) => subMenu.display_name === "Services Plan & Review"
        );
      setAccessData(projectStatusReportSubMenu.access_level);
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
      .then((res) => {})
      .catch((error) => {});
  };
  //////-------------Axios for Account owner-----------------------//////
  const getDP = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getAccountOwner`,
      // http://10.11.12.149:8090/ProjectMS/Engagement/getAccountOwner
    }).then((res) => {
      let custom = [];

      let data = res.data;

      data.length > 0 &&
        data.forEach((e) => {
          let dpObj = {
            label: e.Name,
            value: e.account_owner_id,
          };
          custom.push(dpObj);
        });
      custom.push({ label: "UnAssigned", value: 999 });
      setDp(custom);
      setSelectedDp(custom);
    });
  };
  //==================================================

  useEffect(() => {
    if (savedSearchId != null) {
      const updatedValues = sFOwnerDivisionsDropdown.filter((values) =>
        filterData.Divisions?.includes(parseInt(values.value))
      );

      const progressDataDivisions = filterData.Divisions;
      const divisionsToFilter = progressDataDivisions
        ? progressDataDivisions.split(",").map(Number)
        : [];

      const updateDivisionsdata = sFOwnerDivisionsDropdown.filter((values) =>
        divisionsToFilter.includes(values.value)
      );

      const updateCountry = country.filter((values) =>
        filterData?.countries?.includes(parseInt(values.value))
      );
      const updateeng = engComp.filter((values) =>
        filterData.engComp?.includes(parseInt(values.value))
      );

      const updatemeasures = measures.filter((values) =>
        filterData.measures?.includes(values.value)
      );

      const updatePractice = practice?.filter((values) =>
        filterData?.practices?.includes(values.value)
      );

      const updateaelocation = country.filter((values) =>
        filterData?.aelocation?.includes(values.value)
      );

      if (filterData.from !== undefined && filterData.from !== "") {
        const updatequarter = new Date(filterData.from);
        updatequarter.setMonth(updatequarter.getMonth() - 3);
        updatequarter.setFullYear(updatequarter.getFullYear() + 1);
        setStartDate(updatequarter);
      }

      const updateSE = filterData?.executives;
      const updateAction = filterData?.type;
      const updateAccounttype = filterData.accType;
      if (filterData.from !== undefined && filterData.from !== "") {
        const updatedate = filterData.from;
        console.log(updatedate);
        SetDate(parseISO(updatedate));
      }

      setActionSelector(updateAction);
      setAccount(updateAccounttype);
      if (filterData.executives?.length > 3) {
        setSelectedSEVal("1");
      } else {
        setSelectedSEVal(updateSE);
      }

      const updateAccountOwner = dp?.filter((values) =>
        filterData?.accOwner?.includes(values.value)
      );

      const viewByvalue = filterData?.viewByTime;
      setViewByVal(viewByvalue);
      if (filterData?.accOwner == "-1") {
        setSelectedDp(dp);
      } else {
        setSelectedDp(updateAccountOwner);
      }
      setselectedpractice(updatePractice);
      if (filterData.Divisions == "-1") {
        setselectesFOwnerDivison(sFOwnerDivisionsDropdown);
      } else {
        setselectesFOwnerDivison(updateDivisionsdata);
      }
      if (
        servicesPayload?.type === "analytics" &&
        servicesPayload?.aelocation != "-1"
      ) {
        setselectedcountry(updateaelocation);
        setResSelectedCountry(resCountry);
      } else {
        setResSelectedCountry(resCountry);
        setselectedcountry(country);
      }
      if (
        filterData.type == "custTarget" &&
        filterData?.countries != "6,5,3,8,7,1,2"
      ) {
        setselectedcountry(updateCountry);
      }

      if (servicesPayload.type == "target") {
        setResSelectedCountry(updateCountry);
      }

      setcomponentSelector(actionSelector);
      setselectedmeasures(updatemeasures);

      if (filterData?.engComp == -1) {
        setselectedengComp(engComp);
      } else {
        setselectedengComp(updateeng);
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
      } else if (filterData?.executives?.length > 3) {
        const dataAllSe = "<< Select SE >>";
        setselectedSE(dataAllSe);
      }
    }
  }, [
    savedSearchId,
    filterData.Divisions,
    (filterData.aelocation == filterData.aelocation) == "1,2,3,5,6,7,8,4"
      ? "-1"
      : filterData.aelocation,
    filterData.engComp,
    sFOwnerDivisionsDropdown,
    country,
    engComp,
    filterData.countries,
    practice,
    filterData?.type,
    filterData.type,
    filterData?.from,
    filterData.practices,
    filterData.accOwner,
    filterData.accOwner,
    dp,
    filterData?.viewByTime,
    // selectedDp,
  ]);

  useEffect(() => {
    if (savedSearchId != null) {
      setTimeout(() => {
        serviceSearchValidatorSavedSearch();
      }, 4000);
    }
  }, [filterData]);

  //================================================

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  //------------------------methods----------------------------------
  const [viewByVal, setViewByVal] = useState();
  const onFilterChange = ({ id, value }) => {
    console.log(value);
    if (id == "summary") {
      setservicesPayload((prevState) => {
        return {
          ...prevState,
          [id]: "aelocation",
          aelocation: -1,
        };
      });
    }
    if (id == "viewByTime") {
      setViewByVal(value);

      setservicesPayload((prevState) => {
        return {
          ...prevState,
          [id]: value,
          duration: value === "quarter" ? "4" : "6",
        };
      });
    }
    setservicesPayload((prevState) => {
      return { ...prevState, [id]: value };
    });

    if (id === "executives" && value === "1") {
      setVisiblepopup(true);
    }

    if (id === "from") {
      setservicesPayload((prevState) => {
        return { ...prevState, fyear: moment(value).format("yyyy-MM-DD") };
      });
    }

    if (id === "type") {
      setservicesPayload((prevState) => {
        return {
          ...prevState,
          viewByTime: "quarter",
          countries: "6,5,3,8,7,1,2",
          customers: "-1",
          customerType: "-1",
          practices: "1,3,4,6",
          aelocation: "-1",
          engComp: "-1",
          executives: "-2",
          duration: "4",
          aelocation: "-1",
        };
      });
      switch (value) {
        case "target":
          setservicesPayload((prevState) => {
            return {
              ...prevState,
              mode: "edit",
              summary: "none",
              measures: "",
              prospects: "",
              from: moment(defaultDate()).format("yyyy-MM-DD"),
              aelocation: "-1",
            };
          });

          break;
        case "sgtarget":
          setservicesPayload((prevState) => {
            return {
              ...prevState,
              mode: "sgtargets",
              summary: "Executive",
              measures: -1,
              countries: -1,
              practices: -1,
              monthsel: moment(new Date())
                .startOf("month")
                .format("YYYY-MM-DD"),
              from: "2023-04-01",
              fyear: "2023-04-01",
              aelocation: "-1",
              // from: moment(defaultDate()).format("yyyy-MM-DD"),
              // fyear: moment(defaultDate()).format("yyyy-MM-DD"),
              prospects: -1,
            };
          });

          break;
        case "custForecast":
          setservicesPayload((prevState) => {
            return {
              ...prevState,
              mode: "edit",
              summary: "none",
              measures: "custForecast,target",
              prospects: "0",
            };
          });
          break;
        case "custTarget":
          setservicesPayload((prevState) => {
            return {
              ...prevState,
              mode: "edit",
              summary: "none",
              measures: "ccustForecast",
              // customerType: "1",
              from: moment(defaultDate()).format("yyyy-MM-DD"),
              prospects: selectedProspects,
              // customers:-1,
              customers: selectedCustomers == "" ? "" : selectedCustomers,
              selectExecs: localSE
                .map((item) => item.salesPersonName)
                .join(", "),
            };
          });
          break;
        case "analytics":
          setservicesPayload((prevState) => {
            return {
              ...prevState,
              mode: "view",
              summary: "Executive",
              measures: selectedmeasures.map((item) => item.value).join(","),
              prospects: "-1",
            };
          });

          break;

        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (refreshButton == "success") {
      getserviceData();
      setRefreshButton("");
    }
  }, [refreshButton]);

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const serviceSearchValidator = () => {
    setViewBy(viewByVal);
    setLoader(true);
    let payload = servicesPayload;

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
    // !valid && setVisible(!visible);

    payload.executives === "0" ||
    (payload.executives === "1" &&
      (localStorage.getItem("selectedSELocal") === null ||
        localStorage.getItem("selectedSELocal") === undefined ||
        localStorage.getItem("selectedSELocal") === "[]")) ||
    (payload.customers === "1" &&
      (localStorage.getItem("selectedCust") === null ||
        localStorage.getItem("selectedCust") === undefined ||
        localStorage.getItem("selectedCust") === "[]"))
      ? setErrorMsg(true)
      : getserviceData(payload);

    setTimeout(() => {
      setLoader(false);
    }, 2000);
  };

  const serviceSearchValidatorSavedSearch = () => {
    // setViewBy(filterData.viewByTime);
    setLoader(true);
    const payload = {
      mode: filterData?.mode,
      from: filterData?.from,
      duration: filterData?.duration,
      measures:
        filterData?.measures == "" ? "target,call" : filterData?.measures,
      viewByTime: filterData?.viewByTime,
      Divisions: filterData?.Divisions,
      monthsel: filterData?.monthsel,
      executives: filterData?.executives,
      isActive: filterData?.isActive,
      isIndividual: filterData?.isIndividual,
      customers: filterData?.customers == "" ? "-1" : filterData?.customers,
      customerType: filterData?.customerType,
      prospects: filterData?.prospects,
      practices: filterData?.practices,
      countries: filterData?.countries,
      type: filterData?.type,
      summary: filterData?.summary,
      aelocation: filterData?.aelocation,
      engComp: filterData?.engComp,
      key: filterData?.key,
      selectExecs: filterData?.selectExecs,
      fyear: filterData?.fyear,
      accType: filterData?.accType,
      accOwner: filterData?.accOwner,
      newCust: filterData?.newCust,
      showBy: filterData?.showBy,
      vendors: filterData?.vendors,
      optType: filterData?.optType,
      quarter: filterData?.quarter,
      status: filterData?.status,
      duration2: filterData?.duration2,
      divisions: filterData?.divisions,
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
    // !valid && setVisible(!visible);

    payload.executives === "0" ||
    (payload.executives === "1" &&
      (localStorage.getItem("selectedSELocal") === null ||
        localStorage.getItem("selectedSELocal") === undefined ||
        localStorage.getItem("selectedSELocal") === "[]")) ||
    (payload.customers === "1" &&
      (localStorage.getItem("selectedCust") === null ||
        localStorage.getItem("selectedCust") === undefined ||
        localStorage.getItem("selectedCust") === "[]"))
      ? setErrorMsg(true)
      : getserviceDataSavedSearch(payload);

    setTimeout(() => {
      setLoader(false);
    }, 2000);
    setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
  };

  // -----------------------calls----------------------------------

  const getnewMemberDropdown = () => {
    axios
      .get(baseUrl + "/SalesMS/MasterController/getResources?isActive=0")
      .then((resp) => {
        const data = resp.data;
        data.sort((a, b) => a.resourceName > b.resourceName);
        const dropdownOptions = data.map((item) => {
          return (
            <option key={item.userId} value={item.resourcesId}>
              {item.resourceName}
            </option>
          );
        });
        setnewMemberDropdown(dropdownOptions);
      })
      .catch((err) => {});
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
      .catch((err) => {});
  };

  const getSFOwnerDivisionsDropdown = () => {
    axios
      .get(baseUrl + `/SalesMS/MasterController/SFOwnerDivisions`)
      .then((resp) => {
        const data = resp.data;
        const idToRemove = 109;
        const newData = data.filter((item) => item.id !== idToRemove);
        const dropdownOptions = newData.map((item) => {
          return {
            value: item.id,
            label: item.owner_Division,
          };
        });
        setSFOwnerDivisionsDropdown(dropdownOptions);
        if (savedSearchId == null) {
          setselectesFOwnerDivison(dropdownOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getengCompanyDropdown = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getCompany`)
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          return {
            value: item.id,
            label: item.company_name,
          };
        });
        setengComp(dropdownOptions);
        if (savedSearchId == null) {
          setselectedengComp(dropdownOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getcountryDropdown = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getCountries`)
      .then((resp) => {
        const data = resp.data;
        data.push({ id: 4, country_name: "Others" });
        const filteredData = data
          .filter((item) => item.country_name !== "NM")
          .sort((a, b) => {
            if (a.country_name === "Others") return 1;
            if (b.country_name === "Others") return -1;
            return a.country_name.localeCompare(b.country_name);
          });

        const dropdownOptions = filteredData.map((item) => {
          return {
            value: item.id,
            label: item.country_name,
          };
        });

        setResCountry(dropdownOptions.filter((item) => item.label != "Others"));
        setcountry(dropdownOptions);
        if (savedSearchId == null) {
          setselectedcountry(dropdownOptions);
          setCData(dropdownOptions);
          setSelectCDData(dropdownOptions);
          setselectCusData(dropdownOptions);
          setResSelectedCountry(
            dropdownOptions.filter((item) => item.label != "Others")
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPracticeDropdown = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getDepartments`)
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          return {
            value: item.id,
            label: item.group_name,
          };
        });
        setpractice(dropdownOptions);
        if (savedSearchId == null) {
          setselectedpractice(dropdownOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getserviceData = () => {
    setSearch(false);
    setserviceData([]);
    let payload = null;
    payload = servicesPayload;
    const loaderTime = setTimeout(() => {
      if (savedSearchId == null) {
        setsearching(true);
      }
    }, 2000);
    setErrorMsg(false);
    if (savedSearchId == null) {
      payload["aelocation"] =
        payload.summary === "Account Owner"
          ? -1
          : // : payload.summary == "Customer" && change == false && onchange == true
          // ? -1
          payload.aelocation === "6,5,3,8,7,1,2,4"
          ? -1
          : payload.aelocation;

      payload.executives =
        payload.executives == "1" ? SelectSEData : payload.executives;
    }

    payload.prospects =
      JSON.parse(localStorage.getItem("selectedEngCust"))
        ?.map((d) => d.id)
        .toString() == ""
        ? "-1"
        : JSON.parse(localStorage.getItem("selectedEngCust"))
            ?.map((d) => d.id)
            .toString();
    payload.customers =
      JSON.parse(localStorage.getItem("selectedEngCustOne"))
        ?.map((d) => d.id)
        .toString() == ""
        ? "0"
        : JSON.parse(localStorage.getItem("selectedEngCustOne"))
            ?.map((d) => d.id)
            .toString();

    axios
      .post(baseUrl + `/SalesMS/services/getSalesTargets`, payload)
      .then((resp) => {
        const data = resp.data.data;
        setSearch(true);
        const reportRunId = resp.data.reportRunId;
        let array = [];
        setsearching(false);

        switch (actionSelector) {
          case "target":
            array = resp.data.SalesTargets?.split(",");
            // array = Object.keys(data[0])
            break;

          case "sgtarget":
            array = resp.data.SalesSigningTargets?.split(",");
            break;

          case "custForecast":
            array = resp.data.CustomerForecasts?.split(",");
            break;

          case "custTarget":
            array = resp.data.CustomerTargets?.split(",");
            break;

          case "analytics":
            array = resp.data.analytics?.split(",");
            break;

          default:
            break;
        }
        setcoloumnArray(array);
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });
        setSummary(payload.summary);
        setcomponentSelector(actionSelector);
        setserviceData(newArray);
        setsearching(false);
        clearTimeout(loaderTime);
        setreportRunId(reportRunId);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setVisible(!visible);
        !valid && visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setsearching(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //=========================Saved Search=====================
  const getserviceDataSavedSearch = () => {
    setSearch(false);
    setserviceData([]);
    const payload = {
      mode: filterData?.mode,
      from: filterData?.from,
      duration: filterData?.duration,
      measures:
        filterData?.measures == "" ? "target,call" : filterData?.measures,
      viewByTime: filterData?.viewByTime,
      Divisions: filterData?.Divisions,
      monthsel: filterData?.monthsel,
      executives: filterData?.executives,
      isActive: filterData?.isActive,
      isIndividual: filterData?.isIndividual,
      customers: filterData?.customers == "" ? "-1" : filterData?.customers,
      customerType: filterData?.customerType,
      prospects: filterData?.prospects,
      practices: filterData?.practices,
      countries: filterData?.countries,
      type: filterData?.type,
      summary: filterData?.summary,
      aelocation: filterData?.aelocation,
      engComp: filterData?.engComp,
      key: filterData?.key,
      selectExecs: filterData?.selectExecs,
      fyear: filterData?.fyear,
      accType: filterData?.accType,
      accOwner: filterData?.accOwner,
      newCust: filterData?.newCust,
      showBy: filterData?.showBy,
      vendors: filterData?.vendors,
      optType: filterData?.optType,
      quarter: filterData?.quarter,
      status: filterData?.status,
      duration2: filterData?.duration2,
      divisions: filterData?.divisions,
    };

    setsearching(true);

    setErrorMsg(false);

    payload["aelocation"] =
      payload.summary === "Account Owner"
        ? -1
        : // : payload.summary == "Customer" && change == false && onchange == true
        // ? -1
        payload.aelocation === "6,5,3,8,7,1,2,4"
        ? -1
        : payload.aelocation;

    payload.executives =
      payload.executives == "1" ? SelectSEData : payload?.executives;

    payload.prospects =
      filterData.prospects == "" ? "-1" : filterData.prospects;
    payload.customers = filterData.customers == "" ? "0" : filterData.customers;

    axios
      .post(baseUrl + `/SalesMS/services/getSalesTargets`, payload)
      .then((resp) => {
        const data = resp.data.data;
        const reportRunId = resp.data.reportRunId;
        setSearch(true);
        let array = [];
        setsearching(false);
        switch (filterData?.type) {
          case "target":
            array = resp.data.SalesTargets?.split(",");
            // array = Object.keys(data[0])
            break;

          case "sgtarget":
            array = resp.data.SalesSigningTargets?.split(",");
            break;

          case "custForecast":
            array = resp.data.CustomerForecasts?.split(",");
            break;

          case "custTarget":
            array = resp.data.CustomerTargets?.split(",");
            break;

          case "analytics":
            array = resp.data.analytics?.split(",");
            break;

          default:
            break;
        }
        setcoloumnArray(array);
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });

        setSummary(filterData?.summary);
        setcomponentSelector(filterData?.type);
        setserviceData(newArray);
        setsearching(false);
        clearTimeout(loaderTime);
        setreportRunId(reportRunId);
        setVisible(!visible);
        !valid && visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setsearching(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // -----------------------------useEffect---------------------------------

  useEffect(() => {
    getsalesExecutiveDropdown();
    getSFOwnerDivisionsDropdown();
    getengCompanyDropdown();
    getcountryDropdown();
    getPracticeDropdown();
    getnewMemberDropdown();
    getDP();
  }, []);

  useEffect(() => {
    serviceDataCall.current = getserviceData;
  }, [servicesPayload]);

  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    if (name == "Select Customer" && value === "1") {
      setCustVisible(true);
      setPopupIsLoading(true);
      setservicesPayload((prevState) => {
        return {
          ...prevState,
          customerType: "1",
          prospects: JSON.parse(localStorage.getItem("selectedEngCust"))
            ?.map((d) => d.id)
            .toString(),
          customers: JSON.parse(localStorage.getItem("selectedEngCustOne"))
            ?.map((d) => d.id)
            .toString(),
        };
      });
      //GlobalCancel(ref);
    } else {
      setservicesPayload((prevState) => {
        return {
          ...prevState,
          customerType: "-1",
          customers: "",
          prospects: "",
        };
      });
    }
  };

  const HelpPDFName = "Services Plan and Review.pdf";
  const Headername = "Services Plan and Review Help";

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Services Plan and Review</h2>
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
                  payload={servicesPayload}
                />
              </span>
            </div>
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      {errorMsg ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
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
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-4 mb-2" id="execSelDiv">
              <div className="form-group row">
                <label className="col-5">Action</label>
                <span className="col-1 p-0">:</span>
                <span className="col-6">
                  <select
                    id="type"
                    className="col-md-12 col-sm-12 col-xs-12 "
                    value={actionSelector}
                    onChange={(e) => {
                      setselectedSE("<< All SE >>");
                      onFilterChange(e.target);
                      setActionSelector(e.target.value);
                      setSelectedSEVal(-2);
                    }}
                  >
                    <option value={"custTarget"}>{"Customer Targets"}</option>
                    <option value={"sgtarget"}>{"Signings Targets"}</option>
                    <option value={"target"}>{"Targets"}</option>
                    <option value={"analytics"}>{"View"}</option>
                  </select>
                </span>
              </div>
            </div>

            {["analytics"].includes(actionSelector) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">View By</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6">
                    <select
                      id="viewByTime"
                      name="duration"
                      className="col-md-12 col-sm-12 col-xs-12 "
                      value={servicesPayload.viewByTime}
                      onChange={(e) => {
                        onFilterChange(e.target);
                      }}
                    >
                      <option value="month">Month</option>
                      <option value="quarter">Quarter</option>
                    </select>
                  </span>
                </div>
              </div>
            )}

            {["sgtarget"].includes(actionSelector) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row" id="week-picker-wrapper">
                  <label className="col-5">Financial Year</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6">
                    <DatePicker
                      selected={startDate}
                      onChange={(e) => {
                        setStartDate(e);
                        const date = new Date(e.getTime());
                        date.setFullYear(date.getFullYear());
                        date.setMonth(date.getMonth() + 3);
                        const selectedYear = e.getFullYear();
                        const nextYear = selectedYear + 1;
                        const nextYearDate = new Date(e.getTime());
                        nextYearDate.setFullYear(nextYear);

                        setStartDate(nextYearDate); // Update the startDate state to display the next year
                        onFilterChange({
                          id: "from",
                          value: moment(date).format("yyyy-MM-DD"),
                          //  date.toLocaleDateString('en-US')
                        });
                      }}
                      dateFormat="'FY' yyyy"
                      showYearPicker
                    />
                  </span>
                </div>
              </div>
            )}

            {[
              "target",
              "custForecast",
              "custTarget",
              "custTarget",
              "analytics",
            ].includes(actionSelector) &&
              servicesPayload.viewByTime == "quarter" && (
                <div className="col-md-4 mb-2">
                  <div className="form-group row" id="week-picker-wrapper">
                    <label className="col-5">
                      From Quarter
                      <span className="required error-text ml-1"> *</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <span
                      className="col-6 datepicker "
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <DatePicker
                        className="disabledFieldLook"
                        selected={startDate}
                        onChange={(e) => {
                          setStartDate(e);
                          const date = new Date(e.getTime());
                          date.setFullYear(date.getFullYear() - 1);
                          date.setMonth(date.getMonth() + 3);
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

            {servicesPayload.viewByTime == "month" && (
              <div className="col-md-4 mb-2">
                <div className="form-group row ">
                  <label className="col-5" htmlFor="email-input">
                    From Month
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6 datepicker" style={{ zIndex: 4 }}>
                    <DatePicker
                      onChange={(e) => {
                        setStartDate(e);
                        const date = new Date(e.getTime());
                        date.setFullYear(date.getFullYear());
                        date.setMonth(date.getMonth());
                        onFilterChange({
                          id: "monthsel",
                          value: date.toLocaleDateString("en-CA"),
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

            {["target", "custForecast", "custTarget", "analytics"].includes(
              actionSelector
            ) &&
              servicesPayload.viewByTime === "quarter" && (
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5">Duration</label>
                    <span className="col-1 p-0">:</span>

                    <span className="col-6">
                      <select
                        id="duration"
                        name="duration"
                        className="col-md-12 col-sm-12 col-xs-12 "
                        defaultValue={"4"}
                        value={servicesPayload.duration}
                        onChange={(e) => {
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
            {servicesPayload.viewByTime === "month" && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Duration</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6">
                    <select
                      id="duration"
                      name="duration"
                      className="col-md-12 col-sm-12 col-xs-12 "
                      // defaultValue={"6"}
                      onChange={(e) => {
                        onFilterChange(e.target);
                      }}
                      value={servicesPayload.duration}
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

            {["target", "sgtarget", "custTarget", "analytics"].includes(
              actionSelector
            ) && (
              <div className="col-md-4 mb-2" id="execSelDiv">
                <div className="form-group row">
                  <label className="col-5">
                    Sales Executive
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6 ">
                    <div>
                      {accessData === 1000 ||
                      accessData === 500 ||
                      salesfullAccess == 920 ? (
                        <select
                          id="executives"
                          className="col-md-12 col-sm-12 col-xs-12 text"
                          value={selectedSEVal}
                          onChange={(e) => {
                            onFilterChange(e.target);
                            setselectedSE(
                              e.target.options[e.target.selectedIndex].text
                            );

                            setSelectedSEVal(e.target.value);
                          }}
                          ref={(ele) => {
                            ref.current[1] = ele;
                          }}
                          disabled={servicesPayload.summary == "Account Owner"}
                        >
                          <option value="null">{"<< Please select>> "}</option>
                          {salesExecutiveDropdown}
                        </select>
                      ) : (
                        <select
                          id="executives"
                          className="col-md-12 col-sm-12 col-xs-12 text"
                          value={selectedSEVal}
                          onChange={(e) => {
                            onFilterChange(e.target);
                            setselectedSE(
                              e.target.options[e.target.selectedIndex].text
                            );

                            setSelectedSEVal(e.target.value);
                          }}
                          ref={(ele) => {
                            ref.current[1] = ele;
                          }}
                          disabled={servicesPayload.summary == "Account Owner"}
                        >
                          <option value="null">{"<< Please select>> "}</option>
                          <option value="1">Select SE</option>
                        </select>
                      )}
                    </div>
                  </span>
                </div>
              </div>
            )}

            {["target", "custForecast", "custTarget", "analytics"].includes(
              actionSelector
            ) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row ">
                  <label className="col-5">
                    Practice<span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect "
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <MultiSelect
                      className="disableField"
                      ArrowRenderer={ArrowRenderer}
                      options={practice.sort((a, b) =>
                        a.label.localeCompare(b.label)
                      )}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedpractice}
                      valueRenderer={generateDropdownLabel}
                      disabled={servicesPayload.mode == "view"}
                      onChange={(s) => {
                        setselectedpractice(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "practices",
                          value: selected.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            {["target", "custForecast", "analytics"].includes(
              actionSelector
            ) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Res Location
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      className="disableField"
                      ArrowRenderer={ArrowRenderer}
                      options={resCountry}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      // value={selectedcountry}
                      value={resSelectedCountry}
                      valueRenderer={generateDropdownLabel}
                      disabled={servicesPayload.mode == "view"}
                      onChange={(s) => {
                        setResSelectedCountry(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "countries",
                          value: selected.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            {["custForecast", "custTarget"].includes(actionSelector) && (
              <div className="col-md-4 mb-2" id="execSelDiv">
                <div className="form-group row">
                  <label className="col-5">Customer</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6">
                    <select
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                      className="text cancel"
                      name="Select Customer"
                      id="searchType"
                      onChange={handleChange1}
                      value={servicesPayload?.customerType}
                    >
                      {selectedItems.length + "selected"}
                      <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>

                      <option value="1">Select</option>
                    </select>
                  </span>
                </div>
              </div>
            )}

            {["target", "custForecast", "analytics"].includes(
              actionSelector
            ) && (
              <div className="col-md-4 mb-2" id="execSelDiv">
                <div className="form-group row">
                  <label className="col-5">Summary</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6 ">
                    <select
                      id="summary"
                      className="col-md-12 col-sm-12 col-xs-12 "
                      value={servicesPayload.summary}
                      onChange={(e) => {
                        setOnchange(true);
                        onFilterChange(e.target);
                        setSelectCDData(cData);
                        setselectCusData(cData);
                      }}
                      // disabled={servicesPayload.summary === "aelocation"}
                    >
                      {(actionSelector === "analytics" ||
                        actionSelector === "custForecast") && (
                        <option value="Account Owner">Account Owner</option>
                      )}
                      {(actionSelector === "analytics" ||
                        actionSelector === "custForecast") && (
                        <option value="Customer">Customer</option>
                      )}
                      {actionSelector === "analytics" && (
                        <option value="Executive">Executive</option>
                      )}
                      {(actionSelector === "target" ||
                        actionSelector === "custForecast") && (
                        <option value="none">&lt;&lt; None &gt;&gt;</option>
                      )}
                      {(actionSelector === "target" ||
                        actionSelector === "custForecast") && (
                        <option value="country"> Country </option>
                      )}

                      {/* {actionSelector === "analytics" && <option value="Practice">Practice</option>} */}
                      {/* {<option value="Country">Country</option>} */}
                    </select>
                  </span>
                </div>
              </div>
            )}

            {["analytics"].includes(actionSelector) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Measures<span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[4] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      options={measures.sort((a, b) =>
                        a.label.localeCompare(b.label)
                      )}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedmeasures}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(s) => {
                        setselectedmeasures(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "measures",
                          value: selected.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            {[
              "target",
              "sgtarget",
              "custForecast",
              "custTarget",
              "analytics",
            ].includes(actionSelector) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Sales Division
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[5] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      options={sFOwnerDivisionsDropdown}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectesFOwnerDivison}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(s) => {
                        setselectesFOwnerDivison(s);
                        // setSelectAllOwnerDivisions(false);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "Divisions",
                          value:
                            selected.toString() ==
                            sFOwnerDivisionsDropdown
                              .map((item) => item.value)
                              .join(",")
                              ? "-1"
                              : selected.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            {["custTarget"].includes(actionSelector) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Country</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6">
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      options={country}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedcountry}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(s) => {
                        setselectedcountry(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "countries",
                          value: selected.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            {["custForecast"].includes(actionSelector) && (
              <div className="col-md-4 mb-2" id="execSelDiv">
                <div className="form-group row">
                  <label className="col-5">Sales Executive</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6 ">
                    <select
                      id="executives"
                      className="col-md-12 col-sm-12 col-xs-12"
                      onChange={(e) => {
                        onFilterChange(e.target);
                        setselectedSE(
                          e.target.options[e.target.selectedIndex].text
                        );
                      }}
                    >
                      <option value={0}>{"<< Please select>> "}</option>
                      {newMemberDropdown}
                    </select>
                  </span>
                </div>
              </div>
            )}

            {["analytics"].includes(actionSelector) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    AE Location
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[6] = ele;
                    }}
                  >
                    <MultiSelect
                      className="disableField"
                      ArrowRenderer={ArrowRenderer}
                      options={country}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={
                        savedSearchId === null
                          ? servicesPayload.summary === "Account Owner"
                            ? cData
                            : servicesPayload.summary === "Executive" &&
                              onchange
                            ? selectCDData
                            : servicesPayload.summary === "Customer" && onchange
                            ? selectCusData
                            : selectedcountry
                          : selectedcountry
                      }
                      valueRenderer={generateDropdownLabel}
                      disabled={servicesPayload.summary == "Account Owner"}
                      onChange={(s) => {
                        SetChange(true);
                        setselectedcountry(s);
                        setSelectCDData(s);
                        setselectCusData(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "aelocation",
                          value:
                            selected.toString() ==
                            country.map((item) => item.value).join(",")
                              ? "-1"
                              : selected.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            {["analytics"].includes(actionSelector) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Eng.Company
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[7] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      options={engComp.sort((a, b) =>
                        a.label.localeCompare(b.label)
                      )}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedengComp}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(s) => {
                        setselectedengComp(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "engComp",
                          value:
                            selected.toString() ==
                            engComp.map((item) => item.value).join(",")
                              ? "-1"
                              : selected.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}
            {servicesPayload?.summary == "Account Owner" && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Account Owner
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[8] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="accOwner"
                      options={dp}
                      hasSelectAll={true}
                      value={selectedDp}
                      valueRenderer={generateDropdownLabel}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      // selected={selectedDp}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedDp(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        console.log(selected, "selected");
                        onFilterChange({
                          id: "accOwner",
                          value:
                            selected.toString() ==
                            dp.map((item) => item.value).join(",")
                              ? "-1"
                              : selected.toString(),
                        });
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            {["analytics"].includes(actionSelector) && (
              <div className="col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Account Type</label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6 ">
                    <select
                      id="accType"
                      className="col-md-12 col-sm-12 col-xs-12 "
                      value={account}
                      onChange={(e) => {
                        onFilterChange(e.target);
                        setAccount(e.target.value);
                      }}
                    >
                      <option value={-1}>{"ALL"}</option>
                      <option value={1}>{"Current Account"}</option>
                      <option value={2}>{"New Logo"}</option>
                    </select>
                  </span>
                </div>
              </div>
            )}

            <div className="col-md-12 no-padding section">
              <div className="seFooter" style={{ borderTop: "1px solid #CCC" }}>
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
              </div>
            </div>

            <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  serviceSearchValidator();
                  setshowSFpipeline(false);
                }}
              >
                <FaSearch /> Search
              </button>
            </div>
            <SelectCustDialogBox
              visible={custVisible}
              setVisible={setCustVisible}
              value={value}
              setCollectedProspect={setCollectedProspect}
              setPopupIsLoading={setPopupIsLoading}
              executiveIds={localSE.map((item) => item.id)}
            />
            <SelectSEDialogBox
              visible={visiblepopup}
              setVisible={setVisiblepopup}
              salesfullAccess={salesfullAccess}
              accessData={accessData}
            />
          </div>
        </CCollapse>
      </div>
      {searching && <Loader handleAbort={() => setsearching(false)} />}

      <>
        {popupIsLoading == true ? (
          <div className="loader">
            <div className="loader-animation" style={{ textAlign: "center" }}>
              <>
                <Loader handleAbort={handleAbort} />
              </>
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    </div>
  );
}
