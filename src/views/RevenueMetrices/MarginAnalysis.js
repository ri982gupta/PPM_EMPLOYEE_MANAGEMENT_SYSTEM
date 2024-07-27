import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { parseISO } from "date-fns";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { HiUserAdd } from "react-icons/hi";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import MarginAnalysisTable from "./MarginAnalysisTable";
import MarginAnalysisCustIndustry from "./MarginAnalysisCustIndustry";
import MarginAnalysisDP from "./MarginAnalysisDP";
import MarginAnalysisCSL from "./MarginAnalysisCSL";
import MarginAnalysisSE from "./MarginAnalysisSE";
import MarginAnalysisCustomer from "./MarginAnalysisCustomer";
import MarginAnalysisProject from "./MarginAnalysisProject";
import MarginAnalysisPopUp from "./MarginAnalysisPopUp";
import MarginAnalysisResource from "./MarginAnalysisResource";
import Loader from "../Loader/Loader";
import { CCollapse } from "@coreui/react";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import { AiFillWarning } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { BiCheck } from "react-icons/bi";

function MarginAnalysis() {
  const baseUrl = environment.baseUrl;

  const [customer, setCustomer] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [month, setMonth] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [custIndustry, setCustIndustry] = useState([]);
  const [selectedCustIndustry, setSelectedCustIndustry] = useState([]);
  const [country, setCountry] = useState([]);
  const [engCustLocation, setEngCustLocation] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedCustCountry, setSelectedCustCountry] = useState([]);
  const [selectedEngCountry, setSelectedEngCountry] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [selectedMeasures, setSelectedMeasures] = useState([]);
  const [contractTerms, setContractTerms] = useState([]);
  const [selectedContractTerms, setSelectedContractTerms] = useState([]);
  const [SalesExe, setSalesExe] = useState([]);
  const [selectedSalesExe, setSelectedSalesExe] = useState([]);
  const [ownerDivision, setOwnerDivision] = useState([]);
  const [selectedOwnerDivision, setSelectedOwnerDivision] = useState([]);
  const [engCompany, setEngCompany] = useState([]);
  const [selectedEngCompany, setSelectedEngCompany] = useState([]);
  const [cslList, setCslList] = useState([]);
  const [allCsl, setAllCsl] = useState([]);
  const [selectedCslList, setSelectedCslList] = useState([]);
  const [dpList, setDpList] = useState([]);
  const [selectedDpList, setSelectedDpList] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  const [allDP, setAllDPs] = useState([]);
  const [activeCustomers, setActiveCustomers] = useState([]);
  const [selectType, setSelectType] = useState("BusinessUnit");
  const [project, setProject] = useState([]);
  const [resources, setResources] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [displayTableState, setDisplayTableState] = useState(false);
  const ref = useRef([]);
  const [tableData, setTableData] = useState(null);
  const [tableKeys, setTableKeys] = useState([]);
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const [dataAccess, setDataAccess] = useState();
  const [typetrue, setTypeTrue] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [custVisible, setCustVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState(-1);
  const [projectname, setProjectName] = useState("");
  const [data, setData] = useState("Select Resource");
  const [resourceData, setResourceData] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  let flag = 3;
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
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

  const getHierarchyData1 = () => {
    axios({
      method: "get",
      url:
        baseUrl + "/revenuemetricsms/RevenueMarginAnalysis/getResourceFullName",
    })
      .then(function (response) {
        const resp = response.data;
        setResourceData(resp);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getHierarchyData1();
  }, [selectedResource]);

  useEffect(() => {
    setSelectedCslList(cslList);
  }, [selectType]);

  const getHierarchyData = () => {
    axios({
      method: "get",
      url: baseUrl + "/revenuemetricsms/RevenueMarginAnalysis/getReportees2",
    })
      .then(function (response) {
        const resp = response.data;

        const filteredData = resp.filter((item) => {
          if (item.parent_id !== null) {
            return resp.some(
              (parentItem) =>
                parentItem &&
                parentItem !== "null" &&
                parentItem.id === item.parent_id
            );
          } else {
            return true;
          }
        });
        if (selectedResource !== -1) {
          for (let i = 0; i < filteredData.length - 1; i++) {
            if (filteredData[i].id == selectedResource) {
              // setData(filteredData[i].full_name);
              break;
            }
          }
        }

        setSearchdata((prev) => {
          return { ...prev, resId: selectedResource };
        });
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getHierarchyData();
  }, [selectedResource]);

  {
    /*-------------------Getting Customer-------------------- */
  }

  const getCustomerdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getNewCustomerList`,
    }).then(function (response) {
      var resp = response.data;
      setCustomer(resp);
    });
  };

  useEffect(() => {
    getCustomerdata();
  }, []);

  useEffect(() => {
    if (tableData && tableData[0]) {
      const keysToInclude = ["name", "kpi"].concat(
        Object.keys(tableData[0]).filter((key) =>
          key.match(/\d{4}_\d{2}_\d{2}/)
        )
      );
      const sortedKeys = keysToInclude.sort((a, b) => {
        if (a === "Total") return 1;
        if (b === "Total") return -1;
        const dateA = new Date(a.replace("_", "-"));
        const dateB = new Date(b.replace("_", "-"));
        const formattedDateA = dateA.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        });
        const formattedDateB = dateB.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        });
        return formattedDateA.localeCompare(formattedDateB);
      });
      if (!sortedKeys.includes("Total")) {
        sortedKeys.push("Total");
      }
      setTableKeys(sortedKeys);
    }
  }, [tableData]);

  const Data = moment(month).startOf("month").format("yyyy-MM-DD");
  const pageurl = "http://10.11.12.149:3000/#/pmo/financials";
  const page_Name = "Gross Margin Analysis";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Revenue Metrics";
  let currentScreenName = ["Revenue & Margin Analysis"];
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
        const modifiedUrlPath = "/pmo/financials";
        getUrlPath(modifiedUrlPath);

        let getData = resp.data.map((menu) => {
          if (menu.subMenus) {
            menu.subMenus = menu.subMenus.filter(
              (subMenu) =>
                subMenu.display_name !== "Monthly Revenue Trend" &&
                subMenu.display_name !== "Revenue & Margin Variance" &&
                subMenu.display_name !== "Rev. Projections" &&
                subMenu.display_name !== "Project Timesheet (Deprecated)" &&
                subMenu.display_name !== "Financial Plan & Review"
            );
          }
          return menu;
        });
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

        const marginSubMenu = getData
          .find((item) => item.display_name === "Revenue Metrics")

          .subMenus.find(
            (subMenu) => subMenu.display_name === "Revenue & Margin Analysis"
          );
        const accessLevel = marginSubMenu
          ? marginSubMenu.userRoles.includes("919")
            ? 919
            : marginSubMenu.userRoles.includes("126")
            ? 126
            : marginSubMenu.userRoles.includes("646")
            ? 646
            : marginSubMenu.userRoles.includes("932")
            ? 932
            : marginSubMenu.userRoles.includes("931")
            ? 931
            : marginSubMenu.userRoles.includes("690") &&
              marginSubMenu.userRoles.includes("641")
            ? 600
            : marginSubMenu.userRoles.includes("690") &&
              marginSubMenu.userRoles.includes("930")
            ? 500
            : marginSubMenu.userRoles.includes("641") &&
              marginSubMenu.userRoles.includes("930")
            ? 400
            : marginSubMenu.userRoles.includes("641")
            ? 641
            : marginSubMenu.userRoles == 690 && marginSubMenu.userRoles == 641
            ? 620
            : marginSubMenu.userRoles.includes("690")
            ? 690
            : marginSubMenu.userRoles.includes("930") && 930
          : null;
        setDataAccess(accessLevel);
        if (accessLevel == 641 || accessLevel == 690 || accessLevel == 930) {
          setSearchdata((prevData) => ({
            ...prevData,
            type: "customer",
          }));
        }

        if (
          // accessLevel == 641 ||
          accessLevel == 690 ||
          accessLevel == 641
          // accessLevel == 700
          // accessLevel == 690
        ) {
          setSelectType("Customer");
          // setFormData((prevData) => ({
          //   ...prevData,
          //   type: "Customer",
          // }));
        }
        if (accessLevel == 690) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsbyDp?loggedUserId=${
                  Number(loggedUserId) + 1
                }`
            )

            .then(function (response) {
              var resp = response.data;
              setProject(resp);
            });
        } else if (accessLevel == 500) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsdpae?loggedUserId=${
                  Number(loggedUserId) + 1
                }`
            )
            .then((response) => {
              var resp = response.data;
              resp.push({ id: "-1", name: "<<ALL>>" });
              setProject(resp);
            });
        } else if (accessLevel == 400) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectscslae?loggedUserId=${
                  Number(loggedUserId) + 1
                }`
            )
            .then((response) => {
              var resp = response.data;
              resp.push({ id: "-1", name: "<<ALL>>" });
              setProject(resp);
            });
        } else if (accessLevel == 600) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsbyCslDp?loggedUserId=${
                  Number(loggedUserId) + 1
                }`
            )
            .then((response) => {
              var resp = response.data;

              setProject(resp);
            });
        } else if (accessLevel == 641) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsbycsl?loggedUserId=${
                  Number(loggedUserId) + 1
                }`
            )

            .then(function (response) {
              var resp = response.data;
              setProject(resp);
            });
        } else if (accessLevel == 930) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsbyAE?loggedUserId=${
                  Number(loggedUserId) + 1
                }`
            )

            .then(function (response) {
              var resp = response.data;
              setProject(resp);
            });
        } else {
          axios
            .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)

            .then(function (response) {
              var resp = response.data;
              setProject(resp);
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
  }, [id, SalesExe]);
  const [searchdata, setSearchdata] = useState({});
  useEffect(() => {
    setSearchdata(() => {
      if (id != null) {
        return {
          ownerDivisions: filterData.ownerDivisions,
          month: filterData.month,
          duration: filterData?.duration,
          countries: filterData.countries,
          searchType: filterData.searchType,
          busUnits: filterData.busUnits,
          customers: filterData.customers,
          srcType: filterData.srcType,
          srcTypeId: filterData.srcTypeId,
          tarType: filterData.tarType,
          busUnitId: filterData.busUnitId,
          custId: filterData.custId,
          prjId: filterData.prjId,
          resId: filterData.resId,
          measures: filterData.measures,
          salesExecId: filterData.salesExecId,
          salesExecs: filterData.salesExecs,
          sortBy: filterData.sortBy,
          custCountries: filterData.custCountries,
          resTyp: filterData.resTyp,
          source: filterData.source,
          engCountries: filterData.engCountries,
          contTerms: filterData.contTerms,
          engComp: filterData.engComp,
          cslRes:
            dataAccess == 641 || dataAccess == 690
              ? Number(loggedUserId) + 1
              : filterData.cslRes,
          cslResId: filterData.cslResId,
          dpRes:
            dataAccess == 641 || dataAccess == 690
              ? Number(loggedUserId) + 1
              : filterData.dpRes,
          dpResId: filterData.dpResId,
          indTypes: filterData.indTypes,
          indTypesId: filterData.indTypesId,
          activeCustomers: filterData.activeCustomers,
        };
      } else {
        return {
          ownerDivisions: -1,
          month: "",
          duration: "",
          countries: "6,5,3,8,7,1,2",
          searchType: "BusinessUnit",
          busUnits: "170,211,123,82,168,207,212,18,213,49,149,208,243",
          customers: -1,
          srcType: -1,
          srcTypeId: -1,
          tarType: "BusinessUnit",
          busUnitId: -1,
          custId: -1,
          prjId: -1,
          resId: -1,
          measures: "1350,638,965,639,640,641,643,644,872,761",
          salesExecId: -1,
          salesExecs: SalesExe.map((item) => item.value).join(","),
          sortBy: -1,
          custCountries: -1,
          resTyp: -1,
          source: -1,
          engCountries: -1,
          contTerms: -1,
          engComp: -1,
          cslRes:
            dataAccess == 641 || dataAccess == 690
              ? Number(loggedUserId) + 1
              : -1,
          cslResId: -1,
          dpRes:
            dataAccess == 641 || dataAccess == 690
              ? Number(loggedUserId) + 1
              : allDP,
          dpResId: -1,
          indTypes: -1,
          indTypesId: -1,
          activeCustomers: activeCustomers,
        };
      }
    });
  }, [filterData, id, allDP]);

  useEffect(() => {
    setSelectedResource(-1);
    setData("Select Resource");
    setSearchdata((prev) => ({
      ...prev,
      resId: -1,
    }));
  }, [selectType]);

  // }, [filterData, id, allDP, selectedResource]);

  useEffect(() => {
    if (id != null) {
      const updatebusiness = departments.filter((values) =>
        filterData.busUnits?.includes(values.value)
      );
      const updatecountry = country.filter((values) =>
        filterData.countries?.includes(values.value)
      );
      const updatecontractTerms = contractTerms.filter((values) =>
        filterData.contTerms?.includes(values.value)
      );

      const updateengCompany = engCompany.filter((values) =>
        filterData.engComp?.includes(values.value)
      );

      const updatemeasures = measures.filter((values) =>
        filterData.measures?.includes(values.value)
      );

      const updatecustenglocation = engCustLocation.filter((values) =>
        filterData.custCountries?.includes(values.value)
      );

      const updateengCustLocation = engCustLocation.filter((values) =>
        filterData.engCountries?.includes(values.value)
      );
      const updateselecttype = filterData?.searchType;
      const updateprojectname = project?.filter((values) =>
        filterData.prjId?.includes(values.id)
      );

      const projectnamedata = JSON.stringify(
        updateprojectname[0]?.name
      )?.replace(/"/g, "");

      const updateSalesExecutive = SalesExe?.filter(
        (values) => +filterData?.salesExecs?.includes(values?.value)
      );

      const progressDataDivisions = filterData.ownerDivisions;

      const divisionsToFilter = progressDataDivisions
        ? progressDataDivisions.split(",").map(Number)
        : [];

      const updateownerDivision = ownerDivision.filter((values) =>
        filterData.ownerDivisions?.includes(values.value)
      );

      const updateDivisionsdata = updateownerDivision.filter((values) =>
        divisionsToFilter.includes(values.value)
      );

      const updatecslList = cslList.filter((values) =>
        filterData.cslRes?.includes(values.value)
      );

      const updatedpList = dpList.filter((values) =>
        filterData.dpRes?.includes(values.value)
      );

      const updatecustIndustry = custIndustry.filter((values) =>
        filterData.indTypes?.includes(values.value)
      );

      const updateResource = resourceData.filter((values) =>
        filterData.resId?.includes(values.id)
      );
      const updateResource1 = updateResource.filter(
        (values) => values.id === +filterData.resId
      );

      const ResourceName = updateResource1[0]?.full_name;

      setData(ResourceName);
      if (filterData?.month !== undefined && filterData?.month !== "") {
        const updatedate = filterData?.month;

        setMonth(parseISO(updatedate));
      }

      setSelectedCustIndustry(updatecustIndustry);
      setSelectedDpList(updatedpList);
      setSelectedCslList(updatecslList);
      if (filterData.ownerDivisions == "-1") {
        setSelectedOwnerDivision(ownerDivision);
      } else {
        setSelectedOwnerDivision(updateDivisionsdata);
      }
      setSelectedSalesExe(updateSalesExecutive);

      if (filterData.engCountries == "-1") {
        setSelectedEngCountry(engCustLocation);
      } else {
        setSelectedEngCountry(updateengCustLocation);
      }
      if (filterData.custCountries == "-1") {
        setSelectedCustCountry(engCustLocation);
      } else {
        setSelectedCustCountry(updatecustenglocation);
      }
      setSelectedDepartments(updatebusiness);
      setSelectedCountry(updatecountry);

      if (filterData.contTerms === "-1") {
        setSelectedContractTerms(contractTerms);
      } else {
        setSelectedContractTerms(updatecontractTerms);
      }

      if (filterData.engComp === "-1") {
        setSelectedEngCompany(engCompany);
      } else {
        setSelectedEngCompany(updateengCompany);
      }
      setSelectedMeasures(updatemeasures);
      setSelectType(updateselecttype);
      setProjectName(projectnamedata);
    }
  }, [
    id,
    filterData.measures,
    measures,
    parseInt(filterData.duration),
    departments,
    selectType,
    engCustLocation,
    project,
    filterData.prjId,
    engCompany,
    SalesExe,
    filterData.countries,
    filterData?.source,
    filterData?.month,
    filterData.contTerms,
    country,
    filterData?.searchType,
    filterData.busUnits,
    filterData.countries,
    filterData?.salesExecs,
    filterData.measures,
    filterData.resId,
    filterData.ownerDivisions,
    filterData.indTypes,
    filterData?.duration,
  ]);

  useEffect(() => {
    if (id != null) {
      setTimeout(() => {
        handleSearchSavedSearch();
      }, 4000);
    }
  }, [filterData]);

  //============================ Handle Change ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name == "duration") {
      setSelectedDuration(value);
    }

    if (name == "searchType") {
      setDisplayTableState(false);
      setSelectType(value);
    }
    setSearchdata((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const [selectedItems, setSelectedItems] = useState([{}]);
  const customers = selectedItems?.map((d) => d?.id).toString();

  useEffect(() => {}, [customers], [searchdata.searchType]);

  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();

  const handleCust = (e) => {
    const { id, name, value } = e.target;
    if (name == "customers" && value === "select") {
      setCustVisible(true);
    }
    setSearchdata((prev) => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    setSearchdata((prev) => {
      return { ...prev, customers: -1 };
    });
  }, [searchdata.searchType]);

  {
    /*--------------Handel Search--------------- */
  }

  const findLaterMeasureLabel = (measures, selectedMeasures) => {
    const selectedLabels = selectedMeasures.map((measure) => measure.label);
    const laterMeasures = measures.filter((measure) =>
      selectedLabels.includes(measure.label)
    );
    const lastLaterMeasure = laterMeasures[laterMeasures.length - 1];
    return lastLaterMeasure ? lastLaterMeasure.label : "";
  };

  const DefaultMeasureLabel = (measures, selectedMeasures) => {
    const selectedLabels = selectedMeasures.map((measure) => measure.label);

    if (selectedLabels.includes("Planned Revenue")) {
      return "Planned Revenue";
    }

    const laterMeasures = measures.filter((measure) =>
      selectedLabels.includes(measure.label)
    );
    const firstSelectedMeasure = laterMeasures[0];

    return firstSelectedMeasure ? firstSelectedMeasure.label : "";
  };

  const laterMeasureLabel = findLaterMeasureLabel(measures, selectedMeasures);
  const defaultMeasureLabel = DefaultMeasureLabel(measures, selectedMeasures);

  const handleSearch = (e) => {
    let filteredData = ref.current.filter((d) => d != null);
    ref.current = filteredData;
    let valid = GlobalValidation(ref);

    if (valid) {
      setValidationMessage(true);
      if (selectType === "Resource" && data === "Select Resource") {
        var poBtnElement = document.querySelector(".poBtn");
        if (poBtnElement) {
          poBtnElement.style.color = "red";
        }
      }
      return;
    }

    if (selectType === "Resource" && data === "Select Resource") {
      setValidationMessage(true);
      var poBtnElement = document.querySelector(".poBtn");
      if (poBtnElement) {
        poBtnElement.style.color = "red";
      }
      return;
    } else if (selectType === "Resource" && data !== "Select Resource") {
      setValidationMessage(false);
      var poBtnElement = document.querySelector(".poBtn");
      if (poBtnElement) {
        poBtnElement.style.color = "#187fde";
      }
    }
    setValidationMessage(false);
    setDisplayTableState(false);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url:
        baseUrl +
        (selectType == "CustIndustry"
          ? `/revenuemetricsms/RevenueMarginAnalysis/GetGMACustIndustryFinancialsFinalData`
          : selectType == "DP"
          ? "/revenuemetricsms/RevenueMarginAnalysis/GetGMADPFinancialsFinalData"
          : selectType == "CSL"
          ? "/revenuemetricsms/RevenueMarginAnalysis/GetGMACSLFinancialsFinalData"
          : selectType == "Sales Executive"
          ? "/revenuemetricsms/RevenueMarginAnalysis/GetGMASalesExecutiveFinancialsFinalData"
          : selectType == "Customer" ||
            selectType == "Project" ||
            selectType == "Resource"
          ? "/revenuemetricsms/RevenueMarginAnalysis/GetFinancialsFinalData"
          : selectType == "BusinessUnit" &&
            searchdata?.contTerms === -1 &&
            searchdata?.engComp === -1
          ? "/revenuemetricsms/RevenueMarginAnalysis/getFinancialsBUSummarytFinalData"
          : "/revenuemetricsms/RevenueMarginAnalysis/getFinancialsBUSummaryByCTFinalData"),
      data: {
        ownerDivisions:
          selectType == "Sales Executive" ? searchdata.ownerDivisions : -1,
        month:
          searchdata.month === "" || searchdata.month === "Invalid date"
            ? Data
            : searchdata.month,

        duration: id !== null ? filterData.duration : selectedDuration,

        countries: searchdata.countries,
        searchType: selectType,
        busUnits:
          selectType == "BusinessUnit" || selectType == "Customer"
            ? searchdata.busUnits
            : -1,
        customers:
          searchdata.customers == "select"
            ? selectedCust
            : searchdata.customers == 0
            ? activeCustomers
            : searchdata.customers,
        srcType: searchdata.srcType,
        srcTypeId: searchdata.srcTypeId,
        tarType: selectType,
        busUnitId: searchdata.busUnitId,
        custId: searchdata.custId,
        prjId: selectType != "Project" ? -1 : searchdata.prjId,
        resId: selectType != "Resource" ? -1 : searchdata.resId,
        measures: searchdata.measures,
        salesExecId: searchdata.salesExecId,
        salesExecs:
          selectType != "Sales Executive" ? -1 : searchdata.salesExecs,
        sortBy: searchdata.sortBy,
        custCountries: searchdata.custCountries,
        source: searchdata.source,
        resTyp: searchdata.resTyp,
        engCountries: searchdata.engCountries,
        contTerms: searchdata.contTerms,
        engComp: searchdata.engComp,
        cslRes:
          dataAccess == 641 || dataAccess == 690 || dataAccess == 600
            ? Number(loggedUserId) + 1
            : searchdata.cslRes,
        cslResId: searchdata.cslResId,
        // dpRes: selectType != "DP" ? -1 : searchdata.dpRes,
        dpRes:
          dataAccess == 641 || dataAccess == 690 || dataAccess == 600
            ? Number(loggedUserId) + 1
            : selectType != "DP"
            ? -1
            : searchdata.dpRes,
        dpResId: searchdata.dpResId,
        indTypes: selectType != "CustIndustry" ? -1 : searchdata?.indTypes,
        indTypesId: searchdata?.indTypesId,
      },
      signal: abortController.current.signal,
    })
      .then((res) => {
        let respData = res.data;
        setLoader(false);
        clearTimeout(loaderTime);
        respData.data.forEach((item) => {
          item.uniqueId = item.id;
        });

        setTableData(respData.data);
        setDisplayTableState(true);
        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((e) => {
        setLoader(false);
        clearTimeout(loaderTime);
      });
  };
  //----------------For Saved Search---------------------

  const handleSearchSavedSearch = (e) => {
    let filteredData = ref.current.filter((d) => d != null);
    ref.current = filteredData;
    let valid = GlobalValidation(ref);

    if (valid) {
      setValidationMessage(true);
      if (filterData?.searchType === "Resource" && data === "Select Resource") {
        var poBtnElement = document.querySelector(".poBtn");
        if (poBtnElement) {
          poBtnElement.style.color = "red";
        }
      }
      return;
    }

    if (filterData?.searchType === "Resource" && data === "Select Resource") {
      setValidationMessage(true);
      var poBtnElement = document.querySelector(".poBtn");
      if (poBtnElement) {
        poBtnElement.style.color = "red";
      }
      return;
    } else if (
      filterData?.searchType === "Resource" &&
      data !== "Select Resource"
    ) {
      setValidationMessage(false);
      var poBtnElement = document.querySelector(".poBtn");
      if (poBtnElement) {
        poBtnElement.style.color = "#187fde";
      }
    }
    setValidationMessage(false);
    setDisplayTableState(false);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url:
        baseUrl +
        (filterData?.searchType == "CustIndustry"
          ? `/revenuemetricsms/RevenueMarginAnalysis/GetGMACustIndustryFinancialsFinalData`
          : filterData?.searchType == "DP"
          ? "/revenuemetricsms/RevenueMarginAnalysis/GetGMADPFinancialsFinalData"
          : filterData?.searchType == "CSL"
          ? "/revenuemetricsms/RevenueMarginAnalysis/GetGMACSLFinancialsFinalData"
          : filterData?.searchType == "Sales Executive"
          ? "/revenuemetricsms/RevenueMarginAnalysis/GetGMASalesExecutiveFinancialsFinalData"
          : filterData?.searchType == "Customer" ||
            filterData?.searchType == "Project" ||
            filterData?.searchType == "Resource"
          ? "/revenuemetricsms/RevenueMarginAnalysis/GetFinancialsFinalData"
          : filterData?.searchType == "BusinessUnit" &&
            (filterData.engComp != -1 || filterData.contTerms != -1)
          ? `/revenuemetricsms/RevenueMarginAnalysis/getFinancialsBUSummaryByCTFinalData`
          : `/revenuemetricsms/RevenueMarginAnalysis/getFinancialsBUSummarytFinalData`),
      data: {
        ownerDivisions:
          filterData?.searchType == "Sales Executive"
            ? filterData.ownerDivisions
            : -1,
        month: filterData.month,

        duration: filterData.duration,

        countries: filterData.countries,
        searchType: filterData.searchType,
        busUnits:
          filterData?.searchType == "BusinessUnit" ||
          filterData?.searchType == "Customer"
            ? filterData.busUnits
            : -1,
        customers:
          filterData.customers == "select"
            ? selectedCust
            : filterData.customers == 0
            ? filterData.activeCustomers
            : filterData.customers,
        srcType: filterData.srcType,
        srcTypeId: filterData.srcTypeId,
        tarType: filterData.searchType,
        busUnitId: filterData.busUnitId,
        custId: filterData.custId,
        prjId: filterData.searchType != "Project" ? -1 : filterData.prjId,
        resId: filterData.searchType != "Resource" ? -1 : filterData.resId,
        measures: filterData.measures,
        salesExecId: filterData.salesExecId,
        salesExecs:
          filterData.searchType != "Sales Executive"
            ? -1
            : filterData.salesExecs,
        sortBy: filterData.sortBy,
        custCountries: filterData.custCountries,
        source: filterData.source,
        resTyp: filterData.resTyp,
        engCountries: filterData.engCountries,
        contTerms: filterData.contTerms,
        engComp: filterData.engComp,
        cslRes:
          dataAccess == 641 || dataAccess == 690 || dataAccess == 600
            ? Number(loggedUserId) + 1
            : filterData.cslRes,
        cslResId: filterData.cslResId,
        dpRes:
          dataAccess == 641 || dataAccess == 690 || dataAccess == 600
            ? Number(loggedUserId) + 1
            : filterData.searchType != "DP"
            ? -1
            : filterData.dpRes,
        dpResId: filterData.dpResId,
        indTypes:
          filterData.searchType != "CustIndustry" ? -1 : filterData?.indTypes,
        indTypesId: filterData?.indTypesId,
      },
      signal: abortController.current.signal,
    })
      .then((res) => {
        let respData = res.data;
        setLoader(false);
        clearTimeout(loaderTime);
        respData.data.forEach((item) => {
          item.uniqueId = item.id;
        });

        setTableData(respData.data);
        setDisplayTableState(true);
        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((e) => {
        setLoader(false);
        clearTimeout(loaderTime);
      });
  };
  /*----------------Getting BU---------------- */

  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`, //13
    });

    let departments = resp.data;
    departments = departments.filter((ele) => ele.value >= 0);
    setDepartments(departments);
    if (id == null) {
      setSelectedDepartments(departments.filter((ele) => ele.value >= 0));
    }

    let filteredDeptData = [];
    departments.forEach((data) => {
      filteredDeptData.push(data.value);
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["busUnits"]: filteredDeptData.toString(),
    }));
  };

  {
    /*----------------Getting Customer Industries---------------- */
  }

  const getCustIndustry = async () => {
    const resp = await axios({
      url:
        baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getCustomerIndustry`, //34
    });

    let departments = resp.data;
    departments = departments.filter((ele) => ele.value >= 0);
    setCustIndustry(departments);
    if (id == null) {
      setSelectedCustIndustry(departments.filter((ele) => ele.value >= 0));
    }
    let filteredDeptData = [];
    departments.forEach((data) => {
      filteredDeptData.push(data.value);
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["indTypes"]: filteredDeptData.toString(),
    }));
  };

  {
    /*-------------------------Getting Countries-------------------------*/
  }
  const getCountries = () => {
    axios.get(baseUrl + `/CostMS/cost/getCountries`).then((Response) => {
      let countries = [];
      let data = Response.data;

      data.length > 0 &&
        data.forEach((e) => {
          if (e && e.id !== 4) {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            countries.push(countryObj);
          }
        });
      //////////--Alphabetical Sorting--//////////
      const sortedcities = countries.sort(function (a, b) {
        var nameA = a.label.toUpperCase();
        var nameB = b.label.toUpperCase();
        if (nameA < nameB) {
          return -1; //nameA comes first
        }
        if (nameA > nameB) {
          return 1; // nameB comes first
        }
        return 0; // names must be equal
      });
      //////////------------------------//////////
      let engCustCountries = countries.concat({
        label: "Others",
        value: 999,
      });
      setCountry(sortedcities);
      setEngCustLocation(engCustCountries);
      if (id == null) {
        setSelectedCountry(countries);
        setSelectedCustCountry(engCustCountries);
        setSelectedEngCountry(engCustCountries);
      }
    });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  useEffect(() => {
    let countryList = [];
    country.forEach((d) => {
      countryList.push(d.value);
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["countries"]: countryList.toString(),
    }));
  }, [country]);

  {
    /*-------------------------Getting Measure and Sort By-------------------------*/
  }

  const getMeasure = async () => {
    const resp = await axios({
      url: baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getMeasures`,
    });

    let measures = [];
    let data = resp.data;

    data.length > 0 &&
      data.forEach((e) => {
        let measuresObj = {
          label: e.measures,
          value: e.id,
        };

        measures.push(measuresObj);
        setMeasures(measures);
        if (id == null) {
          setSelectedMeasures(measures.filter((ele) => ele.value != 0));
        }

        let filteredMeasuresData = [];
        measures.forEach((data) => {
          if (data.value != 0) {
            filteredMeasuresData.push(data.value);
          }
        });
        setSearchdata((prevVal) => ({
          ...prevVal,
          ["measures"]: filteredMeasuresData.toString(),
        }));
      });
  };

  const getSortBy = () => {
    axios({
      method: "get",
      url: baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getMeasures`,
    })
      .then(function (response) {
        let resp = response.data;
        setSortBy(resp);
      })
      .catch(function (response) {});
  };

  {
    /*-------------------------Getting Contract Terms-------------------------*/
  }
  const getContractTerms = async () => {
    const resp = await axios({
      url: baseUrl + `/revenuemetricsms/headCountAndTrend/getContractTerms`,
    });

    let terms = [];
    let data = resp.data;

    data.length > 0 &&
      data.forEach((e) => {
        let termsObj = {
          label: e.label,
          value: e.value,
        };

        terms.push(termsObj);
        setContractTerms(terms);
        if (id == null) {
          setSelectedContractTerms(terms.filter((ele) => ele.value != 0));
        }

        let filteredContractTermData = [];
        terms.forEach((data) => {
          if (data.value != 0) {
            filteredContractTermData.push(data.value);
          }
        });
        setSearchdata((prevVal) => ({
          ...prevVal,
          ["contractTerm"]: filteredContractTermData.toString(),
        }));
      });
  };

  {
    /*-------------------------Getting Eng. Company-------------------------*/
  }
  const getEngCompany = async () => {
    const resp = await axios({
      url: baseUrl + `/revenuemetricsms/headCountAndTrend/getEngCompany`,
    });

    let EngComp = [];
    let data = resp.data;

    data.length > 0 &&
      data.forEach((e) => {
        let EngCompObj = {
          label: e.label,
          value: e.value,
        };

        EngComp.push(EngCompObj);
        let filteredEngCompany = EngComp.filter(
          (ele) => ![0, 10, 11, 12, 13].includes(ele.value)
        );
        setEngCompany(filteredEngCompany);
        if (id == null) {
          setSelectedEngCompany(filteredEngCompany);
        }

        let filteredEngComp = [];
        EngComp.forEach((data) => {
          if (data.value != 0) {
            filteredEngComp.push(data.value);
          }
        });
        setSearchdata((prevVal) => ({
          ...prevVal,
          ["engCompany"]: filteredEngComp.toString(),
        }));
      });
  };

  {
    /*-------------------Getting Project-------------------- */
  }
  const [allProjects, setAllProjects] = useState([]);

  const getAllProjects = () => {
    axios({
      method: "get",
      url: baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getProjects`,
    }).then(function (response) {
      var resp = response.data;
      setAllProjects(resp);
    });
  };
  useEffect(() => {
    getAllProjects();
    getAllDPList();
  }, []);

  const getAllDPList = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/revenuemetricsms/RevenueMarginAnalysis/getCustomerDelParatnerList`,
    }).then(function (response) {
      var resp = response.data;
      setAllDPs(resp.map((item) => item.id).join(","));
    });
  };

  const getActiveCustomers = () => {
    console.log(searchdata);
    axios({
      method: "get",
      url:
        baseUrl +
        `/revenuemetricsms/projections/geActiveCustomerList?BuIds=${
          searchdata.busUnitId == -1
            ? searchdata.busUnits
            : searchdata.busUnitId
        }`,
    }).then(function (response) {
      var resp = response.data;
      setActiveCustomers(resp.map((item) => item.id).join(","));
    });
  };
  useEffect(() => {
    getActiveCustomers();
  }, [searchdata]);
  useEffect(() => {
    getAllProjects();
    getAllDPList();
  }, []);

  {
    /*-------------------Getting Resources-------------------- */
  }

  const getResourcesdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getResources`,
    }).then(function (response) {
      var resp = response.data;
      setResources(resp);
    });
  };

  const [resourceIdData, setResourceIdData] = useState([]);
  const getResourcesIDdata = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getResourceIDName`,
    }).then(function (response) {
      var resp = response.data;
      setResourceIdData(resp);
    });
  };
  useEffect(() => {
    getResourcesIDdata();
  }, []);

  {
    /*-------------------Getting Sales Executive---------------*/
  }

  const [allSE, setAllSE] = useState([]);
  const getEngSalesExecutiveList = async () => {
    const resp = await axios({
      url:
        baseUrl +
        `/revenuemetricsms/RevenueMarginAnalysis/getEngSalesExecutiveList`,
    });

    let SalesExe = resp.data;

    let sE = [];

    sE.push({ value: 999999, label: "Unassigned" });

    SalesExe.length > 0 &&
      SalesExe.forEach((e) => {
        let SalesObj = {
          label: e.salesPersonName,
          value: e.id,
        };

        sE.push(SalesObj);

        //////////--Alphabetical Sorting--//////////
        const sEE = sE.sort(function (a, b) {
          var nameA = a.label.toUpperCase();
          var nameB = b.label.toUpperCase();
          if (nameA < nameB) {
            return -1; //nameA comes first
          }
          if (nameA > nameB) {
            return 1; // nameB comes first
          }
          return 0; // names must be equal
        });
        //////////------------------------//////////

        setAllSE(sEE.map((item) => item.value).join(","));
        setSalesExe(sEE);
        if (id == null) {
          setSelectedSalesExe(sEE.filter((ele) => ele.value >= 0));
        }
        let filteredSalesExeData = [];
        sEE.forEach((data) => {
          if (data.value != 0) {
            filteredSalesExeData.push(data.value);
          }
        });
        setSearchdata((prevVal) => ({
          ...prevVal,
          ["SalesExe"]: filteredSalesExeData.toString(),
        }));
      });
  };

  {
    /*-------------------------Getting Contract Terms-------------------------*/
  }
  const getSFOwnerDivisions = async () => {
    const resp = await axios({
      url:
        baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getSFOwnerDivisions`,
    });

    let terms = [];
    let data = resp.data;

    data.length > 0 &&
      data.forEach((e) => {
        let termsObj = {
          label: e.owner_division,
          value: e.id,
        };

        terms.push(termsObj);
        setOwnerDivision(terms);
        if (id == null) {
          setSelectedOwnerDivision(terms.filter((ele) => ele.value != 0));
        }
        let filteredOwnerData = [];
        terms.forEach((data) => {
          if (data.value != 0) {
            filteredOwnerData.push(data.value);
          }
        });
        setSearchdata((prevVal) => ({
          ...prevVal,
          ["OwnerDivision"]: filteredOwnerData.toString(),
        }));
      });
  };

  {
    /*-------------------------Getting Csl List-------------------------*/
  }
  const getCustomerCSLList = async () => {
    const resp = await axios.get(
      dataAccess == 641 || dataAccess == 690 || dataAccess == 600
        ? baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getCustomerCSLList`
        : baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getCustomerCSLList`
    );

    let terms = [];
    let data = resp.data;

    data.length > 0 &&
      data.forEach((e) => {
        let termsObj = {
          label: e.PersonName,
          value: e.id,
        };

        terms.push(termsObj);

        setCslList(terms);
        setAllCsl(terms.map((item) => item.value).join(","));
        if (id == null) {
          setSelectedCslList(terms.filter((ele) => ele.value != 0));
        }
        let filteredCslList = [];
        terms.forEach((data) => {
          if (data.value != 0) {
            filteredCslList.push(data.value);
          }
        });
        setSearchdata((prevVal) => ({
          ...prevVal,
          ["CslList"]: filteredCslList.toString(),
        }));
      });
  };

  {
    /*-------------------------Getting Delivery Partner List-------------------------*/
  }
  const getCustomerDelParatnerList = () => {
    axios
      .get(
        dataAccess == 690 || dataAccess == 641 || dataAccess == 600
          ? baseUrl + `/administrationms/subkconversiontrend/getdeliverypartner`
          : baseUrl + `/administrationms/subkconversiontrend/getdeliverypartner`
      )
      .then(function (response) {
        let terms = [];
        let data = response.data;

        data.length > 0 &&
          data.forEach((e) => {
            let termsObj = {
              label: e.PersonName,
              value: e.id,
            };

            terms.push(termsObj);

            setDpList(terms);
            if (id == null) {
              setSelectedDpList(terms.filter((ele) => ele.value != 0));
            }
            let filteredDpList = [];
            terms.forEach((data) => {
              if (data.value != 0) {
                filteredDpList.push(data.value);
              }
            });
            setSearchdata((prevVal) => ({
              ...prevVal,
              ["DpList"]: filteredDpList.toString(),
            }));
          });
      });
  };

  useEffect(() => {
    if (
      dataAccess == 641 ||
      dataAccess == 690 ||
      dataAccess == 930 ||
      dataAccess == 600
    ) {
      getCustomerCSLList();
      getCustomerDelParatnerList();
    }
  }, [dataAccess]);

  useEffect(() => {
    getCustomerDelParatnerList();
    getCustomerCSLList();
    getSFOwnerDivisions();
    getEngSalesExecutiveList();
    getDepartments();
    getCountries();
    getMeasure();
    getSortBy();
    getContractTerms();
    getEngCompany();
    getResourcesdata();
    getCustIndustry();
  }, []);
  const HelpPDFName = "MarginAnalysis.pdf";
  const Headername = "Revenue Analysis Help";
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
      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Revenue &amp; Margin Analysis</h2>
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
                payload={searchdata}
              />
            </div>
          </div>

          <GlobalHelp pdfname={HelpPDFName} name={Headername} />
        </div>
      </div>
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
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Month">
                  Start Month{" "}
                  <span className="required">
                    &nbsp;<span className="required error-text">*</span>
                  </span>
                </label>
                <span className="col-1">:</span>
                <div
                  className="col-6 datepicker"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <DatePicker
                    selected={month}
                    id="month"
                    onChange={(date) => {
                      setMonth(date);
                      setSearchdata((prev) => {
                        return {
                          ...prev,
                          ["month"]: moment(date)
                            .startOf("month")
                            .format("yyyy-MM-DD"),
                        };
                      });
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                    placeholderText="Start Month"
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration
                  <span className="required">
                    &nbsp;<span className="required error-text">*</span>
                  </span>
                </label>

                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    id="duration"
                    name="duration"
                    className="text"
                    onFocus={() => {
                      setTypeTrue(true);
                    }}
                    onChange={handleChange}
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                    value={
                      (id !== null && typetrue) || id === null
                        ? selectedDuration
                        : filterData?.duration
                    }
                  >
                    <option value="">&lt;&lt;Please Select&gt;&gt;</option>
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
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Seacrh Type">
                  Search Type
                  <span className="required">
                    &nbsp;<span className="required error-text">*</span>
                  </span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  {dataAccess == 919 ||
                  dataAccess == 646 ||
                  dataAccess == 931 ||
                  dataAccess == 932 ||
                  dataAccess == 126 ? (
                    <select
                      id="searchType"
                      onChange={handleChange}
                      name="searchType"
                      className="text"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                      value={selectType}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      <option value="BusinessUnit">Business Unit</option>
                      <option value="Customer">Customer</option>
                      <option value="Project">Project</option>
                      <option value="Resource">Resource</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="CSL">CSL</option>
                      <option value="DP">Delivery Partner</option>
                      <option value="CustIndustry">Customer Industry</option>
                    </select>
                  ) : dataAccess == 641 ? (
                    <select
                      id="searchType"
                      onChange={handleChange}
                      name="searchType"
                      className="text"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                      value={selectType}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {/* <option value="BusinessUnit">Business Unit</option> */}

                      <option value="Customer">Customer</option>
                      <option value="Project">Project</option>
                      <option value="CSL">CSL</option>
                    </select>
                  ) : dataAccess == 690 ? (
                    <select
                      id="searchType"
                      onChange={handleChange}
                      name="searchType"
                      className="text"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                      value={selectType}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {/* <option value="BusinessUnit">Business Unit</option> */}

                      <option value="Customer">Customer</option>
                      <option value="Project">Project</option>
                      <option value="DP">Delivery Partner</option>
                    </select>
                  ) : dataAccess == 930 ? (
                    <select
                      id="searchType"
                      onChange={handleChange}
                      name="searchType"
                      className="text"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                      value={searchdata.searchType}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>

                      <option value="Customer">Customer</option>
                      <option value="Project">Project</option>
                      <option value="Sales Executive">Sales Executive</option>
                    </select>
                  ) : (
                    <select
                      id="searchType"
                      onChange={handleChange}
                      name="searchType"
                      className="text"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                      value={searchdata.searchType}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      <option value="BusinessUnit">Business Unit</option>
                      <option value="Customer">Customer</option>
                      <option value="Project">Project</option>
                      <option value="Resource">Resource</option>
                      <option value="Sales Executive">Sales Executive</option>
                      <option value="CSL">CSL</option>
                      <option value="DP">Delivery Partner</option>
                      <option value="CustIndustry">Customer Industry</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row"></div>
            </div>
            {selectType == "CSL" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="CSL">
                    CSL{" "}
                    <span className="required">
                      &nbsp;<span className="required error-text">*</span>
                    </span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="cslRes"
                      options={cslList}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedCslList}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedCslList(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });

                        setSearchdata((prevVal) => ({
                          ...prevVal,
                          ["cslRes"]: filteredValues.toString(),
                        }));
                      }}
                      valueRenderer={generateDropdownLabel}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {selectType == "DP" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="DP">
                    Delivery Partner{" "}
                    <span className="required">
                      &nbsp;<span className="required error-text">*</span>
                    </span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="dpRes"
                      options={dpList}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedDpList}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedDpList(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });

                        setSearchdata((prevVal) => ({
                          ...prevVal,
                          ["dpRes"]: filteredValues.toString(),
                        }));
                      }}
                      valueRenderer={generateDropdownLabel}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {selectType == "Sales Executive" ? (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Sales Executive">
                      Sales Executive{" "}
                      <span className="required">
                        &nbsp;<span className="required error-text">*</span>
                      </span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="salesExecs"
                        options={SalesExe.sort((a, b) =>
                          a.label.localeCompare(b.label)
                        )}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedSalesExe}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedSalesExe(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["salesExecs"]: filteredValues.toString(),
                          }));
                        }}
                        valueRenderer={generateDropdownLabel}
                      />
                    </div>
                  </div>
                </div>

                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Owner Division">
                      Sales Division{" "}
                      <span className="required">
                        &nbsp;<span className="required error-text">*</span>
                      </span>
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
                        id="ownerDivisions"
                        options={ownerDivision}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedOwnerDivision}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedOwnerDivision(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["ownerDivisions"]: filteredValues.toString(),
                          }));
                        }}
                        valueRenderer={generateDropdownLabel}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}

            {(dataAccess == 919 &&
              selectType != "Project" &&
              selectType != "Resource" &&
              selectType != "Sales Executive" &&
              selectType != "CSL" &&
              selectType != "DP" &&
              selectType != "CustIndustry") ||
            (dataAccess == 646 &&
              selectType != "Project" &&
              selectType != "Resource" &&
              selectType != "Sales Executive" &&
              selectType != "CSL" &&
              selectType != "DP" &&
              selectType != "CustIndustry") ||
            (dataAccess == 932 &&
              selectType != "Project" &&
              selectType != "Resource" &&
              selectType != "Sales Executive" &&
              selectType != "CSL" &&
              selectType != "DP" &&
              selectType != "CustIndustry") ||
            (dataAccess == 931 &&
              selectType != "Project" &&
              selectType != "Resource" &&
              selectType != "Sales Executive" &&
              selectType != "CSL" &&
              selectType != "DP" &&
              selectType != "CustIndustry") ||
            (dataAccess == 126 &&
              selectType != "Project" &&
              selectType != "Resource" &&
              selectType != "Sales Executive" &&
              selectType != "CSL" &&
              selectType != "DP" &&
              selectType != "CustIndustry") ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Business Unit">
                    Business Unit{" "}
                    <span className="required">
                      &nbsp;<span className="required error-text">*</span>
                    </span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="busUnits"
                      options={departments}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedDepartments}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedDepartments(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });

                        setSearchdata((prevVal) => ({
                          ...prevVal,
                          ["busUnits"]: filteredValues.toString(),
                        }));
                      }}
                      valueRenderer={generateDropdownLabel}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {selectType == "Project" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="email-input">
                    Project&nbsp;<span className="error-text ml-1">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div
                      className="autoComplete-container react  reactsearchautocomplete"
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                    >
                      <ReactSearchAutocomplete
                        items={project}
                        inputSearchString={projectname}
                        type="Text"
                        name="prjId"
                        id="prjId"
                        className="error AutoComplete"
                        onSelect={(e) => {
                          setSearchdata((prevProps) => ({
                            ...prevProps,
                            prjId: e.id,
                          }));
                        }}
                        showIcon={false}
                        placeholder="Type minimum 3 characters"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : selectType == "Resource" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">Resource</label>
                  <div className="col-1">:</div>
                  <div
                    className="col-6"
                    name="Resource"
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className="Resource poBtn"
                      onClick={() => setShowPopup(true)}
                      style={{
                        cursor: "pointer",
                        display: "flow-root",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                      title={data}
                    >
                      <HiUserAdd />
                      {data}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {selectType == "Customer" ? (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Customer">
                      Customer{" "}
                      <span className="required">
                        &nbsp;<span className="required error-text">*</span>
                      </span>
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      {dataAccess == 690 ||
                      dataAccess == 641 ||
                      dataAccess == 930 ||
                      dataAccess == 600 ||
                      dataAccess == 500 ||
                      dataAccess == 400 ? (
                        <select
                          id="customers"
                          name="customers"
                          onChange={handleCust}
                          value={searchdata.customers}
                        >
                          {selectedItems.length + "selected"}
                          <option value="">
                            {" "}
                            &lt;&lt;Please Select&gt;&gt;
                          </option>

                          <option value="select">Select</option>
                        </select>
                      ) : (
                        <select
                          id="customers"
                          name="customers"
                          onChange={handleCust}
                          value={searchdata.customers}
                        >
                          {selectedItems.length + "selected"}
                          <option value={-1}> &lt;&lt;All&gt;&gt;</option>
                          <option value={0} selected>
                            Active Customers
                          </option>
                          <option value="select">Select</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Cust.Location">
                      Cust.Location{" "}
                      <span className="required">
                        &nbsp;<span className="required error-text">*</span>
                      </span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[selectType == "Customer" ? 4 : ""] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="custCountries"
                        name="custCountries"
                        options={engCustLocation}
                        hasSelectAll={true}
                        value={selectedCustCountry}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedCustCountry(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["custCountries"]: filteredCountry.toString(),
                          }));
                        }}
                        valueRenderer={generateDropdownLabel}
                      />
                    </div>
                  </div>
                </div>

                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Eng.Location">
                      Eng.Location{" "}
                      <span className="required">
                        &nbsp;<span className="required error-text">*</span>
                      </span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[selectType == "Customer" ? 5 : ""] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="engCountries"
                        name="engCountries"
                        options={engCustLocation}
                        hasSelectAll={true}
                        value={selectedEngCountry}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedEngCountry(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["engCountries"]: filteredCountry.toString(),
                          }));
                        }}
                        valueRenderer={generateDropdownLabel}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            {selectType == "CustIndustry" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Customer Industry">
                    Customer Industry{" "}
                    <span className="required">
                      &nbsp;<span className="required error-text">*</span>
                    </span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="indTypes"
                      options={custIndustry}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedCustIndustry}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedCustIndustry(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });

                        setSearchdata((prevVal) => ({
                          ...prevVal,
                          ["indTypes"]: filteredValues.toString(),
                        }));
                      }}
                      valueRenderer={generateDropdownLabel}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resTyp">
                  Res.Type
                  <span className="required">
                    &nbsp;<span className="required error-text">*</span>
                  </span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    id="resTyp"
                    name="resTyp"
                    className="text"
                    onChange={handleChange}
                    value={searchdata.resTyp}
                  >
                    <option value="-1">&lt;&lt;All&gt;&gt;</option>
                    <option value="subK">Contractor</option>
                    <option value="fte">Employee</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Res.Location">
                  Res.Location{" "}
                  <span className="required">
                    &nbsp;<span className="required error-text">*</span>
                  </span>
                </label>
                <span className="col-1">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[
                      selectType == "BusinessUnit" ||
                      selectType == "Project" ||
                      selectType == "CSL" ||
                      selectType == "DP" ||
                      selectType == "CustIndustry"
                        ? 4
                        : selectType == "Customer"
                        ? 6
                        : selectType == "Resource"
                        ? 2
                        : selectType == "Sales Executive"
                        ? 5
                        : 3
                    ] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="countries"
                    name="countries"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setSearchdata((prevVal) => ({
                        ...prevVal,
                        ["countries"]: filteredCountry.toString(),
                      }));
                    }}
                    valueRenderer={generateDropdownLabel}
                  />
                </div>
              </div>
            </div>
            {selectType == "BusinessUnit" ||
            selectType == "Customer" ||
            selectType == "Project" ? (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Contract Terms">
                      Contract Terms{" "}
                      <span className="required">
                        &nbsp;<span className="required error-text">*</span>
                      </span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[
                          selectType == "BusinessUnit" ||
                          selectType == "Project"
                            ? 5
                            : selectType == "Customer"
                            ? 7
                            : ""
                        ] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="contTerms"
                        name="contTerms"
                        options={contractTerms}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedContractTerms}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedContractTerms(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["contTerms"]: filteredValues.toString(),
                          }));
                        }}
                        valueRenderer={generateDropdownLabel}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Eng.Company">
                      Eng.Company{" "}
                      <span className="required">
                        &nbsp;<span className="required error-text">*</span>
                      </span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[
                          selectType == "BusinessUnit" ||
                          selectType == "Project"
                            ? 6
                            : selectType == "Customer"
                            ? 8
                            : ""
                        ] = ele;
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

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["engComp"]: filteredValues.toString(),
                          }));
                        }}
                        valueRenderer={generateDropdownLabel}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Measures">
                  Measures{" "}
                  <span className="required">
                    &nbsp;<span className="required error-text">*</span>
                  </span>
                </label>
                <span className="col-1">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[
                      selectType == "BusinessUnit" || selectType == "Project"
                        ? 7
                        : selectType == "Customer"
                        ? 9
                        : selectType == "Resource"
                        ? 3
                        : selectType == "Sales Executive"
                        ? 6
                        : selectType == "CSL" ||
                          selectType == "DP" ||
                          selectType == "CustIndustry"
                        ? 5
                        : 4
                    ] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="measures"
                    name="measures"
                    options={measures.sort((a, b) =>
                      a.label.localeCompare(b.label)
                    )}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedMeasures}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedMeasures(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });

                      setSearchdata((prevVal) => ({
                        ...prevVal,
                        ["measures"]: filteredValues.toString(),
                      }));
                    }}
                    valueRenderer={generateDropdownLabel}
                  />
                </div>
              </div>
            </div>
            {selectType == "Customer" ||
            selectType == "Project" ||
            selectType == "Sales Executive" ||
            selectType == "CSL" ||
            selectType == "DP" ||
            selectType == "CustIndustry" ? (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Source">
                      Source{" "}
                      <span className="required">
                        &nbsp;<span className="required error-text">*</span>
                      </span>
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="source"
                        name="source"
                        defaultValue={searchdata?.source}
                        onChange={handleChange}
                      >
                        <option value={-1}>&lt;&lt;All&gt;&gt;</option>
                        <option value="PPM">PPM</option>
                        <option value="Projector">Projector</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Sort By">
                  Sort By
                  <span className="required">
                    &nbsp;<span className="required error-text">*</span>
                  </span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    onChange={handleChange}
                    name="sortBy"
                    id="sortBy"
                    value={searchdata.sortBy}
                  >
                    <option value="-1">Default</option>
                    {selectedMeasures.map((Item) => (
                      <option value={Item.value}> {Item.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 btn-container center my-3">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  handleSearch();
                }}
              >
                <FaSearch /> Search{" "}
              </button>
              {loader ? <Loader handleAbort={handleAbort} /> : ""}
            </div>
          </div>
        </CCollapse>
        {displayTableState &&
          (selectType == "BusinessUnit" ? (
            <MarginAnalysisTable
              searchdata={searchdata}
              tableData={tableData}
              column={tableKeys}
              selectType={selectType}
              month={month}
              departments={departments}
              customer={customer}
              resources={resourceIdData}
              project={allProjects}
              sortBy={sortBy}
              laterMeasureLabel={laterMeasureLabel}
              defaultMeasureLabel={defaultMeasureLabel}
            />
          ) : selectType == "CustIndustry" ? (
            <MarginAnalysisCustIndustry
              searchdata={searchdata}
              tableData={tableData}
              column={tableKeys}
              selectType={selectType}
              month={month}
              customer={customer}
              resources={resourceIdData}
              project={allProjects}
              custIndustry={custIndustry}
              sortBy={sortBy}
              laterMeasureLabel={laterMeasureLabel}
              defaultMeasureLabel={defaultMeasureLabel}
            />
          ) : selectType == "DP" ? (
            <MarginAnalysisDP
              searchdata={searchdata}
              tableData={tableData}
              column={tableKeys}
              selectType={selectType}
              month={month}
              customer={customer}
              resources={resourceIdData}
              project={allProjects}
              dpList={dpList}
              sortBy={sortBy}
              laterMeasureLabel={laterMeasureLabel}
              defaultMeasureLabel={defaultMeasureLabel}
            />
          ) : selectType == "CSL" ? (
            <MarginAnalysisCSL
              allCsl={allCsl}
              searchdata={searchdata}
              tableData={tableData}
              column={tableKeys}
              selectType={selectType}
              month={month}
              customer={customer}
              resources={resourceIdData}
              project={allProjects}
              cslList={cslList}
              sortBy={sortBy}
              laterMeasureLabel={laterMeasureLabel}
              defaultMeasureLabel={defaultMeasureLabel}
            />
          ) : selectType == "Sales Executive" ? (
            <MarginAnalysisSE
              allSE={allSE}
              searchdata={searchdata}
              tableData={tableData}
              column={tableKeys}
              selectType={selectType}
              month={month}
              customer={customer}
              resources={resourceIdData}
              project={allProjects}
              SalesExe={SalesExe}
              sortBy={sortBy}
              selectedCust={selectedCust}
              laterMeasureLabel={laterMeasureLabel}
              defaultMeasureLabel={defaultMeasureLabel}
            />
          ) : selectType == "Customer" ? (
            <MarginAnalysisCustomer
              searchdata={searchdata}
              tableData={tableData}
              column={tableKeys}
              selectType={selectType}
              month={month}
              customer={customer}
              resources={resourceIdData}
              project={allProjects}
              departments={departments}
              sortBy={sortBy}
              selectedCust={selectedCust}
              laterMeasureLabel={laterMeasureLabel}
              defaultMeasureLabel={defaultMeasureLabel}
            />
          ) : selectType == "Project" ? (
            <MarginAnalysisProject
              searchdata={searchdata}
              tableData={tableData}
              column={tableKeys}
              selectType={selectType}
              month={month}
              resources={resourceIdData}
              project={allProjects}
              sortBy={sortBy}
              laterMeasureLabel={laterMeasureLabel}
              defaultMeasureLabel={defaultMeasureLabel}
            />
          ) : selectType == "Resource" ? (
            <MarginAnalysisResource
              searchdata={searchdata}
              tableData={tableData}
              column={tableKeys}
              selectType={selectType}
              month={month}
              resourceData={resourceIdData}
              sortBy={sortBy}
              laterMeasureLabel={laterMeasureLabel}
              defaultMeasureLabel={defaultMeasureLabel}
            />
          ) : (
            ""
          ))}
      </div>
      <SelectCustDialogBox
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        flag={flag}
        dataAccess={dataAccess}
      />
      {showPopup ? (
        <MarginAnalysisPopUp
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          setSelectedResource={setSelectedResource}
          setResName={setData}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default MarginAnalysis;
