import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { environment } from "../../environments/environment";
import moment from "moment";
import * as XLSX from "xlsx";
import { RiFileExcel2Line } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
import "./RevenueVarianceMaterialTable.scss";
import ExcelJS from "exceljs";
import { parseISO } from "date-fns";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaCaretDown,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import Loader from "../Loader/Loader";
import RevenueVarianceMaterialTable from "./RevenueVarianceMaterialTable";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import RevenueMarginMultiselect from "./RevenueMarginMultiselect";
import { BiCheck, BiError } from "react-icons/bi";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { useLocation } from "react-router-dom";

function RevenueVariance() {
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;

  const [ActualDate, setActualDate] = useState(new Date());
  const [measuresValidation, setMeasuresValidation] = useState(false);
  const [csl, setCsl] = useState([]);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [Company, setCompany] = useState([]);
  const [month, setMonth] = useState(moment(moment()).startOf("month")._d);
  const [engCompany, setEngCompany] = useState([]);
  const [dataAccess, setDataAccess] = useState();
  const [data2, setData2] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [resourceName, setResourceName] = useState("");
  const [toggleButton, setToggleButton] = useState(false);
  const [colExpFlag, setColumnExpFlag] = useState(false);

  const abortController = useRef(null);
  let variance = 1;

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const [filterData, setFilterData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const pageurl = "http://10.11.12.149:3000/#/pmo/revenueLeak";
  const page_Name = "Plan Variance";
  const [editmsg, setEditAddmsg] = useState(false);
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

  // const initialValue = {
  //   resBusinessUnit: [],
  //   resType: "-1",
  //   location: [],
  //   resBillableType: "0,1,2",
  //   loggedUser: loggedUserId,
  //   contractterms: [],
  //   Customer: "-1",
  //   csl: [],
  //   Dp: [],
  //   assignedto: "-1",
  //   eng: [],
  //   View: "0",
  //   Duration: "3",
  //   FromDate: "",
  //   actualdate: moment(ActualDate).format("YYYY-MM-DD"),
  //   Summary: "bu",
  //   measures: [],
  // };
  const [selectedNo, setSelectedNo] = useState("");
  const [formData, setFormData] = useState({});
  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          resBusinessUnit: [],
          resType: filterData.resType,
          location: filterData.location,
          resBillableType: filterData.resBillableType,
          loggedUser: +filterData.loggedUser,
          contractterms: filterData.contractterms,
          Customer: filterData?.Customer,
          csl: filterData.csl,
          Dp: filterData.Dp,
          assignedto: filterData.assignedto,
          eng: filterData.eng,
          View: filterData.View,
          Duration: filterData.Duration,
          FromDate: filterData.FromDate,
          actualdate: filterData.actualdate,
          Summary: filterData.Summary,
          measures: filterData.measures,
        };
      } else {
        return {
          resBusinessUnit: "170,211,123,82,168,207,212,18,213,49,149,243",
          resType: "-1",
          location: "6,5,3,8,7,1,2",
          resBillableType: "0,1,2",
          loggedUser: loggedUserId,
          contractterms: "-1",
          Customer: "-1",
          csl: "-1",
          Dp: "-1",
          assignedto: "-1",
          eng: "-1",
          View: "0",
          Duration: "3",
          FromDate: "",
          actualdate: moment(ActualDate).format("YYYY-MM-DD"),
          Summary: "bu",
          measures:
            "billAlloc,billAct,variance,variancePer,plRev,actRev,revVariance,revVariancePer,plMOM,plMOMPerc,plGM,actGM,marVariance,marVariancePer",
          month: moment(ActualDate).format("YYYY-MM-DD"),
        };
      }
    });
  }, [filterData]);

  const [type, setType] = useState("0");
  const [contractterms, setContractTerms] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedcountry, setSelectedCountry] = useState([]);
  const [selectcontractterms, setSelectContractTerms] = useState([]);
  const [dp, setDp] = useState([]);
  const [selectedDp, setSelectedDp] = useState([]);
  const [issueDetails, setIssueDetails] = useState([]);
  const [details, setDetails] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [columns, setColumns] = useState([]);
  const [searching, setsearching] = useState(false);
  const [loader, setLoader] = useState(false);
  const [custVisible, setCustVisible] = useState(false);
  const [custData, setcustData] = useState([]);
  const [item, setItem] = useState([]);

  const groupedCities = [
    {
      label: "Hours",
      code: "Hou",
      items: [
        { label: "Bill Alloc", value: "billAlloc" },
        { label: "Bill Actual", value: "billAct" },
        { label: "Variance", value: "variance" },
        { label: "Variance %", value: "variancePer" },
      ],
    },
    {
      label: "Revenue",
      code: "Rev",
      items: [
        { label: "Planned", value: "plRev" },
        { label: "Actual", value: "actRev" },
        { label: "Variance", value: "revVariance" },
        { label: "Variance %", value: "revVariancePer" },
        { label: "MOM", value: "plMOM" },
        { label: "MOM %", value: "plMOMPerc" },
      ],
    },
    {
      label: "Margin",
      code: "Mar",
      items: [
        { label: "Planned GM", value: "plGM" },
        { label: "Actual GM", value: "actGM" },
        { label: "Variance", value: "marVariance" },
        { label: "Variance %", value: "marVariancePer" },
      ],
    },
  ];

  const [selectedCities, setSelectedCities] = useState("");
  const [financialMeasures, setFinancialMeasures] = useState([
    {
      groupId: 1,
      id: "billAlloc",
      rolename: 1,
      value: "Bill Alloc",
      isChecked: true,
    },
    {
      groupId: 1,
      id: "billAct",
      rolename: 1,
      value: "Bill Actual",
      isChecked: true,
    },
    {
      groupId: 1,
      id: "variance",
      rolename: 1,
      value: "Variance",
      isChecked: true,
    },

    {
      groupId: 1,
      id: "variancePer",
      rolename: 1,
      value: "Variance %",
      isChecked: true,
    },

    {
      groupId: 2,
      id: "plRev",
      rolename: 1,
      value: "Planned",
      isChecked: true,
    },
    {
      groupId: 2,
      id: "actRev",
      rolename: 1,
      value: "Actual",
      isChecked: true,
    },
    {
      groupId: 2,
      id: "revVariance",
      rolename: 1,
      value: "Variance",
      isChecked: true,
    },
    {
      groupId: 2,
      id: "revVariancePer",
      rolename: 1,
      value: "Variance %",
      isChecked: true,
    },
    {
      groupId: 2,
      id: "plMOM",
      rolename: 1,
      value: "MOM",
      isChecked: true,
    },
    {
      groupId: 2,
      id: "plMOMPerc",
      rolename: 1,
      value: "MOM %",
      isChecked: true,
    },

    {
      groupId: 3,
      id: "plGM",
      rolename: 1,
      value: "Planned GM",
      isChecked: true,
    },
    {
      groupId: 3,
      id: "actGM",
      rolename: 1,
      value: "Actual GM",
      isChecked: true,
    },

    {
      groupId: 3,
      id: "marVariance",
      rolename: 1,
      value: "Variance",
      isChecked: true,
    },
    {
      groupId: 3,
      id: "marVariancePer",
      rolename: 1,
      value: "Variance %",
      isChecked: true,
    },
  ]);
  // useEffect(() => {
  //   const custom = groupedCities
  //     .map((group) => group.items.map((item) => item.value))
  //     .reduce((acc, val) => acc.concat(val), []);
  //   setSelectedCities(custom);
  // }, []);

  const [activeCustomers, setActiveCustomers] = useState([]);
  const [activeCustomersList, setActiveCustomersList] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [warnMsg, setWarnMsg] = useState("");
  let flag = 0;
  const ref = useRef([]);
  const tableCoulmns = tableData.columns;
  const regex = /\d{4}_\d{2}_\d{2}_(billWkAlloc)/g;
  const regexp = /\d{4}_\d{2}_\d{2}_(billWkAct)/g;
  const matches = tableCoulmns?.match(regex);
  const matchess = tableCoulmns?.match(regexp);
  const data = details?.[2];
  const keysToCheck = ["Allocs Wk Var", "Actuals Wk Var"];
  let isAllocsAndActualsPresent = false;
  const dynamicKeyPattern = /(\d{4}_\d{2}_\d{2})_(billWkAlloc|billWkAct)/;
  for (const key in data) {
    const match = key.match(dynamicKeyPattern);
    if (match && keysToCheck?.includes(data[key])) {
      isAllocsAndActualsPresent = true;
      break;
    }
  }
  //---------------Saved Search-------------------------------

  useEffect(() => {
    if (id != null) {
      const updatedepartments = business.filter((values) =>
        filterData.resBusinessUnit?.includes(values.value)
      );
      const updateCountry = country.filter((values) =>
        filterData?.location?.includes(values.value)
      );
      const updateContractTerms = contractterms.filter((values) =>
        filterData?.contractterms?.includes(values.value)
      );

      const updateCsl = csl.filter((values) =>
        filterData?.csl?.includes(values.value)
      );
      const updateDp = dp.filter((values) =>
        filterData?.Dp?.includes(values.value)
      );

      const UpdateResourceName = issueDetails.filter(
        (values) => parseInt(filterData?.assignedto) === values.id
      );
      const UpdateResourceData = JSON.stringify(
        UpdateResourceName[0]?.name
      )?.replace(/"/g, "");

      const updateEng = Company.filter((values) =>
        filterData?.eng?.includes(values.value)
      );

      if (filterData.eng == "-1") {
        setEngCompany(Company);
      } else {
        setEngCompany(updateEng);
      }

      setResourceName(UpdateResourceData);
      if (filterData.Dp == "-1") {
        setSelectedDp(dp);
      } else {
        setSelectedDp(updateDp);
      }
      if (filterData.csl == "-1") {
        setSelectedCsl(csl);
      } else {
        setSelectedCsl(updateCsl);
      }

      if (filterData.actualdate !== undefined && filterData.actualdate !== "") {
        const updatedate = filterData.actualdate;
        setActualDate(parseISO(updatedate));
      }
      if (filterData.contractterms == "-1") {
        setSelectContractTerms(contractterms);
      } else {
        setSelectContractTerms(updateContractTerms);
      }
      if (filterData.location == "6,5,3,8,7,1,2") {
        setSelectedCountry(country);
      } else {
        setSelectedCountry(updateCountry);
      }
      setSelectedBusiness(updatedepartments);
    }
  }, [filterData, business, country, dp, csl, issueDetails, Company]);

  //----------------------breadcrumbs----------------------

  const [routes, setRoutes] = useState([]);
  let textContent = "Revenue Metrics";
  let currentScreenName = ["Revenue and Margin Variance"];
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
    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const getData = resp.data;
        const modifiedUrlPath = "/pmo/revenueLeak";
        getUrlPath(modifiedUrlPath);

        setData2(getData);
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
        const revenueVarianceSubMenu = getData
          .find((item) => item.display_name === "Revenue Metrics")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Revenue & Margin Variance"
          );

        const accessLevel = revenueVarianceSubMenu
          ? revenueVarianceSubMenu.userRoles
          : null;
        setDataAccess(accessLevel);
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
    if (dataAccess == 641 || dataAccess == 690) {
      handleCsl();
      handleDp();
    }
  }, [dataAccess]);

  const resourceData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
    });
  };
  const handleCsl = () => {
    const loggedUser = "0";
    axios
      .get(
        dataAccess == 641
          ? baseUrl + `/CommonMS/master/getCSLDPAE?loggedUserId=${loggedUserId}`
          : baseUrl +
              `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUser}`
      )
      .then((res) => {
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

        setCsl(custom);
        if (id == null) {
          setSelectedCsl(custom);
        }
      });
  };
  const handleDp = () => {
    const loggedUser = "0";
    axios
      .get(
        dataAccess == 690
          ? baseUrl + `/CommonMS/master/getDP?loggedUserId=${loggedUserId}`
          : baseUrl + `/CommonMS/master/getDPDropDownData?userId=${loggedUser}`
      )
      .then((res) => {
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
        setDp(custom);
        if (id == null) {
          setSelectedDp(custom);
        }

        // setFormData((prevVal) => ({
        //   ...prevVal,
        //   ["Dp"]: custom,
        // }));
      });
  };

  const getContractterms = () => {
    axios
      .get(baseUrl + `/customersms/Customersearch/getInvoicecontractterms`)
      .then((Response) => {
        let countries = [];
        let fdata = Response.data;
        fdata.length > 0 &&
          fdata.forEach((e) => {
            let contractobj = {
              label: e.lkup_name,
              value: e.id,
            };
            countries.push(contractobj);
          });
        countries.sort((a, b) => a.label.localeCompare(b.label));
        setContractTerms(countries);
        if (id == null) {
          setSelectContractTerms(countries);
        }
        // setSelectContractTerms(countries);
        // setFormData((prevVal) => ({
        //   ...prevVal,
        //   ["contractterms"]: countries,
        // }));
      });
  };
  const getCountries = () => {
    axios.get(baseUrl + `/CostMS/cost/getCountries`).then((Response) => {
      let countries = [];
      let data = Response.data;
      data.length > 0 &&
        data.forEach((e) => {
          let countryObj = {
            label: e.country_name,
            value: e.id,
          };
          countries.push(countryObj);
        });
      countries.sort((a, b) => a.label.localeCompare(b.label));
      setCountry(countries);
      const filteredCountries = countries.filter(
        (country) => country.value !== 4
      );
      // setFormData((prevVal) => ({
      //   ...prevVal,
      //   ["location"]: filteredCountries,
      // }));
      if (id == null) {
        setSelectedCountry(countries);
      }
    });
  };
  const getBusinessUnit = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments = departments.filter((department) => department.value !== 208);
    departments.push({ value: 999, label: "Non-Revenue Units" });

    setBusiness(departments);
    const selectedBusiness1 = departments
      .filter((ele) => ele.value !== 999)
      .map((item) => {
        return {
          value: item.value,
          label: item.label,
        };
      });
    if (id == null) {
      setSelectedBusiness(selectedBusiness1);
    }

    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 999) {
        filteredDeptData.push(data.value);
      }
    });
  };

  const handleEngCompany = () => {
    axios
      .get(baseUrl + `/ProjectMS/Engagement/getEngagementCompanay`)
      .then((Response) => {
        let comp = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let compObj = {
              label: e.Company,
              value: e.id,
            };
            comp.push(compObj);
          });
        comp.sort((a, b) => a.label.localeCompare(b.label));
        if (id == null) {
          setEngCompany(comp);
        }

        setCompany(comp);
        // setFormData((prevVal) => ({
        //   ...prevVal,
        //   ["eng"]: comp,
        // }));
      });
  };

  const getActiveCustomers = () => {
    axios
      .get(
        baseUrl +
          `/revenuemetricsms/projections/geActiveCustomerList?BuIds=${
            id == null
              ? formData["resBusinessUnit"]
              : filterData.resBusinessUnit
          }`
      )
      .then((res) => {
        let customersObj = [];
        setActiveCustomersList(res.data);
        let customers = res.data;
        customers.length > 0 &&
          customers.forEach((e) => {
            let custObj = {
              label: e.fullName,
              value: e.id,
            };
            customersObj.push(custObj);
          });
        let activeCustomerValues = customersObj.map((customer) =>
          customer.value.toString()
        );
        setActiveCustomers(activeCustomerValues);
      });
  };

  useEffect(() => {
    getBusinessUnit();
    getCountries();
    getContractterms();
    resourceData();
    handleCsl();
    handleDp();
    handleEngCompany();
  }, []);
  useEffect(() => {
    getActiveCustomers();
  }, [formData["resBusinessUnit"], filterData?.Customer]);
  const customValueRenderer = (selected) => {
    return selected?.length === business?.length ||
      selected?.length === country?.length ||
      selected?.length === Company?.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  //No Records Found==============

  const norecords = (detail) => {
    const emptyObject = {};
    if (detail?.length === 3) {
      Object.keys(detail[2]).forEach((key, value) => {
        emptyObject[key] = "0";

        if (
          key === "resource" ||
          key === "id" ||
          key === "uniqueId" ||
          key === "lvl" ||
          key === "parentId"
        ) {
          emptyObject["resource"] = "No Records Found";
          emptyObject["id"] = "999";
          emptyObject["uniqueId"] = "3";
          emptyObject["lvl"] = "1";
          emptyObject["parentId"] = null;
        }
      });
      detail[3] = emptyObject;
    }
  };

  //================

  const getTableData = () => {
    setTableData([]);
    let bool = GlobalValidation(ref);
    if (bool) {
      setWarnMsg(
        <div class="statusMsg error">
          <BiError />
          {"Please select valid values for highlighted fields"}
        </div>
      );
      return;
    }

    !bool ? measuresValidation && setVisible(!visible) : "";

    setWarnMsg("");

    const obj = {};
    // JSON.parse(JSON.stringify(formData));

    obj["buIds"] = formData["resBusinessUnit"];

    obj["countryIds"] = formData["location"];

    obj["resTyp"] = formData["resTyp"];
    obj["month"] =
      formData["View"] == 0
        ? // moment(formData["month"]).startOf("month").format("YYYY-MM-DD")
          moment(month).format("YYYY-MM-DD")
        : null;
    obj["duration"] = formData["View"] == 0 ? formData["Duration"] : null;
    obj["atd"] = formData["View"] == 1 ? formData["actualdate"] : null;
    // formData["actualdate"];
    // obj["measures"] = formData["measures"]?.map((d) => d.value).toString();
    obj["measures"] = formData["measures"];
    obj["resType"] = formData["resType"];
    obj["customerIds"] =
      formData["Customer"] == "select"
        ? selectedCust
        : formData["Customer"] == "0"
        ? activeCustomers.toString()
        : formData["Customer"];
    obj["resourceId"] = formData["assignedto"];
    obj["summary"] = formData["Summary"];
    obj["cslIds"] =
      dataAccess === 641
        ? Number(loggedUserId) + 1
        : formData["csl"].length == csl.length
        ? "-1"
        : formData["csl"];
    obj["dpIds"] =
      dataAccess == 690
        ? Number(loggedUserId) + 1
        : Object.keys(formData["Dp"]).length == dp.length
        ? "-1"
        : formData["Dp"];
    obj["contTerms"] =
      Object.keys(formData["contractterms"]).length == contractterms.length
        ? "-1"
        : formData["contractterms"];
    obj["engComp"] =
      Object.keys(formData["eng"]).length == Company.length
        ? "-1"
        : formData["eng"];
    obj["isExport"] = 0;
    obj["userId"] = loggedUserId;

    if (
      formData.measures == "" ||
      formData.measures == 0 ||
      formData.measures == []
    ) {
      setMeasuresValidation(true);
    } else {
      setMeasuresValidation(false);
      const loaderTime = setTimeout(() => {
        setsearching(true);
      }, 2000);
      setLoader(false);
      axios({
        method: "post",
        url: baseUrl + `/revenuemetricsms/projections/postRevenueMargin`,
        // url: `http://localhost:8090/revenuemetricsms/projections/postRevenueMargin`,
        data: obj,
      }).then((res) => {
        setsearching(false);
        let detail = res.data.tableData;
        let data = res.data;
        if (detail.length === 3) {
          norecords(detail);
          setTableData(data);
          setsearching(false);
        }
        setTableData(data);
        let cols = res.data.columns?.replaceAll("'", "").split(",");
        setDetails(detail);

        setColumns(cols);
        setValidationMessage(false);
        // setTimeout(() => {
        //   // setsearching(false);
        //   setLoader(true);
        // }, 1000);
        setsearching(false);
        setShowTable(true);
        setToggleButton(true);

        clearTimeout(loaderTime);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      });
    }
  };
  //----------Saved Search API--------------------
  const getTableDataSavedSearch = () => {
    setTableData([]);
    let bool = GlobalValidation(ref);
    if (bool) {
      setWarnMsg(
        <div class="statusMsg error">
          <BiError />
          {"Please select valid values for highlighted fields"}
        </div>
      );
      return;
    }

    !bool ? measuresValidation && setVisible(!visible) : "";

    setWarnMsg("");

    const obj = {};
    // JSON.parse(JSON.stringify(formData));

    obj["buIds"] = filterData?.resBusinessUnit;

    obj["countryIds"] = filterData["location"];

    obj["resTyp"] = filterData["resTyp"];
    obj["month"] =
      filterData["View"] == 0
        ? // moment(formData["month"]).startOf("month").format("YYYY-MM-DD")
          moment(filterData.month).startOf("month").format("YYYY-MM-DD")
        : null;
    obj["duration"] = filterData["View"] == 0 ? filterData["Duration"] : null;
    obj["atd"] = filterData["View"] == 1 ? filterData["actualdate"] : null;
    // formData["actualdate"];
    // obj["measures"] = formData["measures"]?.map((d) => d.value).toString();
    obj["measures"] = filterData["measures"];
    obj["resType"] = filterData["resType"];
    obj["customerIds"] =
      filterData["Customer"] == "select"
        ? selectedCust
        : filterData["Customer"] == "0"
        ? activeCustomers.toString()
        : filterData["Customer"];
    obj["resourceId"] = filterData["assignedto"];
    obj["summary"] = filterData["Summary"];
    obj["cslIds"] =
      dataAccess === 641
        ? Number(loggedUserId) + 1
        : filterData["csl"].length == csl.length
        ? "-1"
        : filterData["csl"];
    obj["dpIds"] =
      dataAccess == 690
        ? Number(loggedUserId) + 1
        : Object.keys(filterData["Dp"]).length == dp.length
        ? "-1"
        : filterData["Dp"];
    obj["contTerms"] =
      Object.keys(filterData["contractterms"]).length == contractterms.length
        ? "-1"
        : filterData["contractterms"];
    obj["engComp"] =
      Object.keys(filterData["eng"]).length == Company.length
        ? "-1"
        : filterData["eng"];
    obj["isExport"] = 0;
    obj["userId"] = loggedUserId;

    if (
      filterData.measures == "" ||
      filterData.measures == 0 ||
      filterData.measures == []
    ) {
      setMeasuresValidation(true);
    } else {
      setMeasuresValidation(false);
      const loaderTime = setTimeout(() => {
        setsearching(true);
      }, 2000);
      setLoader(false);
      axios({
        method: "post",
        url: baseUrl + `/revenuemetricsms/projections/postRevenueMargin`,
        // url: `http://localhost:8090/revenuemetricsms/projections/postRevenueMargin`,
        data: obj,
      }).then((res) => {
        let detail = res.data.tableData;
        let cols = res.data.columns?.replaceAll("'", "").split(",");

        setTimeout(() => {
          // setsearching(false);
          setLoader(true);
        }, 1000);

        setTimeout(() => {
          setDetails(detail);
          norecords(detail);
          setTableData(res.data);
          setColumns(cols);
          setValidationMessage(false);
          setToggleButton(true);

          setsearching(false);
          setShowTable(true);
          clearTimeout(loaderTime);
          setVisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        }, 4000);
      });
    }
  };
  useEffect(() => {
    if (id != null) {
      setTimeout(() => {
        getTableDataSavedSearch();
      }, 4000);
    }
  }, [filterData]);
  //-------------------------------

  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    if (name == "Customer" && value === "select") {
      setCustVisible(true);
      // setFormData((prev) => {
      //   return { ...prev, [name]: selectedCust };
      // });
    }
    setcustData();
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
    // selectedCust();
  };
  const [selectedItems, setSelectedItems] = useState([{}]);
  const Customer = selectedItems?.map((d) => d?.id).toString();
  useEffect(() => {}, [item], [Customer], [formData.serarchVals]);

  const getcustData1 = () => {
    axios
      .get(baseUrl + `/CommonMS/master/geActiveCustomerList`)
      .then((resp) => {
        const data = resp.data;
        setcustData(data);
      })
      .catch((resp) => {});
  };

  useEffect(() => {
    getcustData1();
  }, [item]);

  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const excludedKeys = [
        "id",
        "customerId",
        "projectId",
        "departmentId",
        "empStatus",
        "lvl",
        "count",
        "uniqueId",
        "parentId",
        "keyAttr",
        "name",
      ];
      const filteredColumns = columns.filter((col) => col);
      const wantedValues = details.map((item) => {
        const obj = {};
        filteredColumns.forEach((col) => {
          if (!excludedKeys.includes(col)) {
            const value = item[col];

            if (
              typeof value === "object" &&
              value !== null &&
              "props" in value &&
              "children" in value.props
            ) {
              const childrenValue = value.props.children;
              obj[col] =
                typeof childrenValue === "string" ? childrenValue.trim() : "";
            } else if (
              typeof value === "object" &&
              value !== null &&
              "children" in value
            ) {
              const childrenValue = value.children;
              obj[col] =
                typeof childrenValue === "string" ? childrenValue.trim() : "";
            } else if (typeof value === "string") {
              const [extractedValue, ,] = value.split("^&");
              obj[col] = extractedValue;
            } else {
              obj[col] = value;
            }
          }
        });
        return obj;
      });

      const rows = wantedValues.map((item) => {
        const row = [];
        filteredColumns.forEach((col) => {
          const value = item[col];
          if (value !== undefined) {
            row.push(value);
          }
        });
        return row;
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("RevenueLeakage");

      for (let i = 0; i < rows.length; i++) {
        const row = worksheet.addRow(rows[i]);
      }

      const boldRows = [1];
      boldRows.forEach((rowNumber) => {
        const row = worksheet.getRow(rowNumber);
        row.font = { bold: true };
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), "Revenue and Margin Variance.xlsx");
      });
    });
  };

  const HelpPDFName = "RevenueMarginVariance.pdf";
  const Headername = "Revenue And Margin Variance Help";
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions?.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const [isOn, setOn] = useState(false);

  const handleToggle = () => {
    setOn(!isOn);
  };
  const lastDayOfMonth = moment().endOf("month").toDate();
  const startDayOfMonth = moment().startOf("month").toDate();

  return (
    <div>
      {measuresValidation ? (
        <div className="statusMsg error "> Please select Measures</div>
      ) : (
        ""
      )}
      {warnMsg}

      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Search created successfully.
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Revenue and Margin Variance</h2>
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
              <div className="saveBtn">
                <SavedSearchGlobal
                  setEditAddmsg={setEditAddmsg}
                  pageurl={pageurl}
                  page_Name={page_Name}
                  payload={formData}
                  activeCustomers={activeCustomers}
                />
              </div>
            </div>
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="BU">
                  BU <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="resBusinessUnit"
                    options={business}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedBusiness}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedBusiness(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["resBusinessUnit"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Country">
                  Country <span className="required error-text">*</span>
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
                    valueRenderer={generateDropdownLabel}
                    id="location"
                    options={country}
                    hasSelectAll={true}
                    value={selectedcountry}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["location"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Customer">
                  Customer<span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    name="Customer"
                    id="searchType"
                    onChange={handleChange1}
                    className="text"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                    value={formData.Customer}
                  >
                    {selectedItems.length + "selected"}
                    <option value="-1">{"<< ALL >>"}</option>
                    <option value="0">Active Customers</option>
                    <option value="select">Select</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Res.Type">
                  Res.Type<span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="resType"
                    className="text"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["resType"]: e.target.value,
                      }));
                    }}
                    value={formData.resType}
                  >
                    <option value="-1">{"<< ALL >>"}</option>
                    <option value="fte">Employee</option>
                    <option value="subk">Contractor</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="View">
                  View<span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="View"
                    onChange={(e) => {
                      setType(e.target.value);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["View"]: e.target.value,
                      }));
                    }}
                    value={formData.View}
                  >
                    <option value="0">By Month</option>
                    <option value="1">Actual Till Date</option>
                  </select>
                </div>
              </div>
            </div>

            {formData.View == "1" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Actual Till">
                    Actual Till
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 ActualTillRevenue"
                    style={{ zIndex: "4" }}
                  >
                    <DatePicker
                      className="ActualTillRevenue"
                      id="actualdate"
                      autoComplete="off"
                      selected={ActualDate}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          ["actualdate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        setActualDate(e);
                      }}
                      dateFormat="dd-MMM-yyyy"
                      placeholderText="Begin Date"
                      maxDate={lastDayOfMonth}
                      minDate={startDayOfMonth}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Month">
                    Month
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6 ">
                    <DatePicker
                      id="month"
                      selected={month}
                      onChange={(e) => {
                        setMonth(e);
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["month"]: e,
                        }));
                      }}
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
            {formData.View != "1" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Duration">
                    Duration
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      id="Duration"
                      onChange={(e) => {
                        setType("1");
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["Duration"]: e.target.value,
                        }));
                      }}
                      value={formData.Duration}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                      <option value={7}>7</option>
                      <option value={8}>8</option>
                      <option value={9}>9</option>
                      <option value={10}>10</option>
                      <option value={11}>11</option>
                      <option value={12}>12</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Measures">
                  Measures <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className=" col-6">
                  <RevenueMarginMultiselect
                    formData={formData}
                    setFormData={setFormData}
                    financialMeasures={financialMeasures}
                    setFinancialMeasures={setFinancialMeasures}
                    measuresValidation={measuresValidation}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Summary">
                  Summary
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="Summary"
                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["Summary"]: e.target.value,
                      }));
                    }}
                    value={formData.Summary}
                  >
                    <option value="bu">BU</option>
                    <option value="customer">Customer</option>
                    <option value="resource">Resource</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Contact Terms">
                  Contract Terms <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="contractterms"
                    options={contractterms}
                    hasSelectAll={true}
                    value={selectcontractterms}
                    disabled={false}
                    onChange={(e) => {
                      setSelectContractTerms(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["contractterms"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="CSL">
                  CSL <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[4] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="csl"
                    options={csl}
                    hasSelectAll={true}
                    value={selectedCsl}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    // selected={selectedCsl}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCsl(e);
                      let filteredCustomer = [];
                      e.forEach((d) => {
                        filteredCustomer.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["csl"]: filteredCustomer.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="DP">
                  DP <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[5] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="Dp"
                    options={dp}
                    hasSelectAll={true}
                    value={selectedDp}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    // selected={selectedDp}
                    disabled={false}
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
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Resource">
                  Resource
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div className="autoComplete-container">
                    <ReactSearchAutocomplete
                      items={issueDetails}
                      inputSearchString={resourceName}
                      type="text"
                      name="assignedto"
                      id="assignedto"
                      placeholder="Type minimum 3 characters"
                      issueDetails={issueDetails}
                      resourceData={resourceData}
                      className="AutoComplete"
                      onSelect={(e) => {
                        setFormData((prevVal) => ({
                          ...prevVal,
                          assignedto: e.id,
                        }));
                      }}
                      onClear={() => {
                        setFormData((prevVal) => ({
                          ...prevVal,
                          assignedto: -1, // Clear the assignedto field by setting it to an empty value
                        }));
                      }}
                      showIcon={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Eng.Company">
                  Eng.Company <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[6] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="eng"
                    options={Company}
                    hasSelectAll={true}
                    value={engCompany}
                    disabled={false}
                    shouldToggleOnHover={false}
                    onChange={(e) => {
                      setEngCompany(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["eng"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  getTableData();
                  setShowTable(false);
                  setColumnExpFlag(false);
                  const data =
                    formData.Summary == "bu"
                      ? "BUs"
                      : formData.Summary == "customer"
                      ? "Customers"
                      : formData.Summary == "resource"
                      ? "Resources"
                      : "";
                  setSelectedNo(data);
                }}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
        {searching ? (
          <Loader setsearching={setsearching} handleAbort={handleAbort} />
        ) : (
          ""
        )}
      </div>
      {showTable ? (
        <div
          className="col-md-12 "
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="highlightHeading-and-note">
            <div className="highlightHeading">
              <span>
                No. of {selectedNo}: <b>{rowCount}</b>
              </span>
            </div>

            <span>
              {isAllocsAndActualsPresent ? (
                <span
                  style={{
                    color: "#9d7c42",
                    fontStyle: "italic",
                    fontSize: "13px",
                  }}
                >
                  <BsInfoCircle /> Allocs Wk Var and Actuals Wk Var: Indicates
                  the variance from recent Saturday numbers, Month Over Month
                  (MOM) = Month - Prev Month
                </span>
              ) : (
                ""
              )}
            </span>
          </div>
          {toggleButton && (
            <div className="mrTableContainer" style={{ width: "50%" }}>
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
          {/* <div className="col-md-12 "> */}
          <div
            align=" right "
            style={{ marginTop: "5px", marginRight: "15px" }}
          >
            <RiFileExcel2Line
              size="1.5em"
              title="Export to Excel"
              style={{ color: "green" }}
              cursor="pointer"
              onClick={exportExcel}
            />
          </div>
          <br /> <br />
          {/* </div> */}
        </div>
      ) : (
        ""
      )}

      <div className="col-md-12 EngagementDetails">
        <RevenueVarianceMaterialTable
          data={tableData}
          expandedCols={["emp_cadre", "supervisor", "project_ct"]}
          colExpandState={["0", "0", "name"]}
          formData={formData}
          setFormData={setFormData}
          setRowCount={setRowCount}
          type={type}
          isOn={isOn}
          colExpFlag={colExpFlag}
          setColumnExpFlag={setColumnExpFlag}
        />
      </div>

      <SelectCustDialogBox
        flag={flag}
        variance={variance}
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        dataAccess={dataAccess}
        activeCustomersList={activeCustomersList}
      />
    </div>
  );
}

export default RevenueVariance;
