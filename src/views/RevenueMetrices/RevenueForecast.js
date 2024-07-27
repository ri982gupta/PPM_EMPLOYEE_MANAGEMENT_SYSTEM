import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import moment from "moment";
import axios from "axios";
import { environment } from "../../environments/environment";
import RevenueForecastFilters from "./RevenueForecastFilters";
import { AiFillWarning } from "react-icons/ai";
import { json, useLocation } from "react-router-dom";
import { BiCheck } from "react-icons/bi";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { parseISO } from "date-fns";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import Utils from "../../Utils.js";
function RevenueForecast() {
  const HelpPDFName = "MonthlyRevenueForecast.pdf";
  const Headername = "Monthly Revenue Forecast Help";
  const [dataAccess, setDataAccess] = useState(690);
  const [data2, setData2] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const loggedResourceId = Number(loggedUserId) + 1;
  const [selecttype, setSelectType] = useState(
    dataAccess === "126" ||
      dataAccess === "919" ||
      dataAccess === "690" ||
      dataAccess === "642" ||
      dataAccess === "641"
      ? "Business Unit"
      : "customer"
  );
  console.log(selecttype);
  const [type, setType] = useState("Hierarchy");
  const [capType, setCapType] = useState([
    { value: "actualHrs", label: "Actual Hrs" },
    { value: "allocations", label: "Allocation Hrs" },
    { value: "approvedHrs", label: "Approved Hrs" },
    { value: "assigned", label: "Assigned Hrs" },
    { value: "available", label: "Available Hrs" },
    { value: "capacity", label: "Net Capacity Hrs" },
    { value: "unapprovedHrs", label: "Unapproved Hrs" },
    { value: "actAppr", label: "Variance: Actual - Approved Hrs" },
    { value: "unassigned", label: "Variance: Allocation - Assigned Hrs" },
    { value: "allocAct", label: "Variance: Allocation - Actual Hrs" },
    { value: "allocAppr", label: "Variance: Allocation - Approved Hrs" },
    { value: "assAct", label: "Variance: Assigned - Actual Hrs" },
    { value: "assAppr", label: "Variance: Assigned - Approved Hrs" },
  ]);
  const [country, setCountry] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [engCompany, setEngCompany] = useState([{}]);
  const [selectedEngCompany, setSelectedEngCompany] = useState([]);
  const [csl, setCsl] = useState([]);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [dp, setDp] = useState([]);
  const [selectedDp, setSelectedDp] = useState([]);
  const [project, setProject] = useState([]);
  const [engLocation, setEngLocation] = useState([]);
  const [selectedEngLocation, setSelectedEngLocation] = useState([]);
  const [resource, setResource] = useState([]);
  const [resourceName, setResourceName] = useState("");
  const [manager, setManager] = useState([]);
  const [pmname, setPmName] = useState("");
  const [accountOwner, setAccountOwner] = useState([]);
  const [selectedAccountOwner, setSelectedAccountOwner] = useState([]);
  const [actionTable, setActionTable] = useState([]);
  const [summaryBy, setSummaryBy] = useState([
    { value: "Region", label: "Region" },
    { value: "Practice", label: "Practice" },
    { value: "Customer", label: "Customer" },
  ]);
  const [selectedSummaryBy, setSelectedSummaryBy] = useState([
    {
      label: "Region",
      value: "Region",
    },
  ]);

  const [financialMeasures, setFinancialMeasures] = useState([
    {
      groupId: 1,
      id: "Revenue",
      rolename: 1,
      value: "Revenue",
      isChecked: true,
    },
    {
      groupId: 1,
      id: "NAvgCost",
      rolename: 1,
      value: "PR Cost",
      isChecked: false,
    },
    {
      groupId: 1,
      id: "NAcGM",
      rolename: 1,
      value: "PR GM %  ",
      isChecked: false,
    },
    {
      groupId: 1,
      id: "AvgCost",
      rolename: 1,
      value: "PR Cost Adjusted",
      isChecked: false,
    },

    {
      groupId: 1,
      id: "AcGM",
      rolename: 1,
      value: "PR GM % Adjusted",
      isChecked: false,
    },

    {
      groupId: 2,
      id: "AssRevenue",
      rolename: 1,
      value: "Revenue",

      isChecked: false,
    },
    {
      groupId: 3,
      id: "ActRevenue",
      rolename: 1,
      value: "Revenue",

      isChecked: false,
    },
    {
      groupId: 4,
      id: "ApprRevenue",
      rolename: 1,
      value: "Revenue",
      isChecked: false,
    },
    {
      groupId: 5,
      id: "RecRevenue",
      rolename: 1,
      value: "Revenue",
      isChecked: false,
    },
    {
      groupId: 5,
      id: "NRRCost",
      rolename: 1,
      value: "RR Cost ",
      isChecked: false,
    },
    {
      groupId: 5,
      id: "NRRGM",
      rolename: 1,
      value: "RR GM % ",
      isChecked: false,
    },
    {
      groupId: 5,
      id: "RRCost",
      rolename: 1,
      value: "RR Cost Adjusted",
      isChecked: false,
    },
    {
      groupId: 5,
      id: "RRGM",
      rolename: 1,
      value: "RR GM % Adjusted",
      isChecked: false,
    },

    {
      groupId: 6,
      id: "capacity",
      rolename: 1,
      value: "Net Capacity",
      isChecked: false,
    },
    {
      groupId: 7,
      id: "billAppr",
      rolename: 1,
      value: "Hrs",
      isChecked: false,
    },
    {
      groupId: 7,
      id: "billApprNet",
      rolename: 1,
      value: "%",
      isChecked: false,
    },
  ]);
  const [selectedFinancialMeasures, setSelectedFinancialMeasures] = useState([
    {
      label: "Planned Revenue",
      value: "Revenue",
      id: "Revenue",
    },
  ]);

  const [selectview, setSelectView] = useState("consol");

  const [toggleButton, setToggleButton] = useState(false);
  const [resLocation, setResLocation] = useState([{}]);
  const [selectedResLocation, setSelectedResLocation] = useState([]);
  const [contractTerms, setContractTerms] = useState([{}]);
  const [selectedContractTerms, setSelectedContractorTerms] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [utilizationSummary, setUtilizationSummary] = useState([]);
  const [benchSummary, setBenchSummary] = useState([]);
  const [displayState, setDisplayState] = useState(false);
  const [displayStateA, setDisplayStateA] = useState(false);
  const [displayStateB, setDisplayStateB] = useState(false);
  const [searching, setSearching] = useState(false);
  const [displayHierarchy, setDisplayHierarchy] = useState(false);
  const [hierarchydata, setHierarchyData] = useState([{}]);
  const abortController = useRef([]);
  const [managerProjects, setManagerProject] = useState([]);
  const [hierarchyId, setHierarchyId] = useState(loggedResourceId);
  const loggedUserName = localStorage.getItem("resName");
  const [label, setLabel] = useState(loggedUserName);
  const [alloctype, setAlloctype] = useState([
    { value: "billable", label: "Billable" },
    { value: "nonBillUtil", label: "Non Billable Utilized" },
    { value: "nonBillShad", label: "Non Billable Shadow" },
    { value: "nonBillEnb", label: "Non Billable Enabled" },
    { value: "nonBillCliPrep", label: "Non Billable Client Prep" },
    { value: "nonBillNonUtil", label: "Non Billable Non Utilized" },
    { value: "nonBillInnov", label: "Non-billable Innovation" },
  ]);
  const [selectedalloctype, setSelectedalloctype] = useState(alloctype);
  const [projectname, setProjectName] = useState("");
  const [visible, setvisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const ref = useRef([]);

  const pageurl = "http://10.11.12.149:3000/#/resource/capacity";
  const page_Name = "Utilization Analysis";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Revenue Metrics";
  let currentScreenName = ["Monthly Revenue Forecast"];
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
    getUrlPath();
  }, []);
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/resource/capacity&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getMenus = () => {
    // setMenusData

    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        // const getData = resp.data;

        let getData = resp.data.map((menu) => {
          if (menu.subMenus) {
            menu.subMenus = menu.subMenus.filter(
              (subMenu) =>
                subMenu.display_name !== "Revenue & Margin Variance" &&
                subMenu.display_name !== "Rev. Projections" &&
                subMenu.display_name !== "Project Timesheet (Deprecated)" &&
                subMenu.display_name !== "Financial Plan & Review"
            );
          }
          return menu;
        });
        const updatedMenuData = getData.map((category) => ({
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
        setData2(getData);

        updatedMenuData.forEach((item) => {
          if (item.display_name === textContent) {
            setRoutes([item]);
            sessionStorage.setItem("displayName", item.display_name);
          }
        });

        const revenueForcastSubMenu = getData
          .find((item) => item.display_name === "Revenue Metrics")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Monthly Revenue Forecast"
          );

        const accessLevel = revenueForcastSubMenu
          ? revenueForcastSubMenu.userRoles.includes("919")
            ? 919
            : revenueForcastSubMenu.userRoles.includes("126")
            ? 126
            : revenueForcastSubMenu.userRoles.includes("646")
            ? 646
            : revenueForcastSubMenu.userRoles.includes("428")
            ? 428
            : revenueForcastSubMenu.userRoles.includes("686")
            ? 686
            : revenueForcastSubMenu.userRoles.includes("908")
            ? 908
            : revenueForcastSubMenu.userRoles.includes("690")
            ? 690
            : revenueForcastSubMenu.userRoles.includes("910")
            ? 910
            : revenueForcastSubMenu.userRoles.includes("919") &&
              revenueForcastSubMenu.userRoles.includes("46")
            ? 1100
            : revenueForcastSubMenu.userRoles.includes("307") &&
              revenueForcastSubMenu.userRoles.includes("932")
            ? 250
            : revenueForcastSubMenu.userRoles.includes("690") &&
              revenueForcastSubMenu.userRoles.includes("919")
            ? 1200
            : revenueForcastSubMenu.userRoles.includes("641") &&
              revenueForcastSubMenu.userRoles.includes("919")
            ? 1300
            : revenueForcastSubMenu.userRoles.includes("690") &&
              revenueForcastSubMenu.userRoles.includes("46")
            ? 800
            : revenueForcastSubMenu.userRoles.includes("641") &&
              revenueForcastSubMenu.userRoles.includes("46")
            ? 700
            : revenueForcastSubMenu.userRoles.includes("690") &&
              revenueForcastSubMenu.userRoles.includes("641")
            ? 600
            : revenueForcastSubMenu.userRoles.includes("690") &&
              revenueForcastSubMenu.userRoles.includes("930")
            ? 500
            : revenueForcastSubMenu.userRoles.includes("641") &&
              revenueForcastSubMenu.userRoles.includes("930")
            ? 400
            : revenueForcastSubMenu.userRoles.includes("690")
            ? 690
            : revenueForcastSubMenu.userRoles.includes("641")
            ? 641
            : revenueForcastSubMenu.userRoles.includes("932")
            ? 932
            : revenueForcastSubMenu.userRoles.includes("46")
            ? 46
            : revenueForcastSubMenu.userRoles.includes("686")
            ? 686
            : revenueForcastSubMenu.userRoles.includes("930")
            ? 930
            : revenueForcastSubMenu.userRoles.includes("307") && 307
          : null;

        setDataAccess(accessLevel);

        if (accessLevel == 600 || accessLevel == 500 || accessLevel == 400) {
          axios
            .get(
              baseUrl +
                `/dashboardsms/allocationDashboard/getCustomers?loggedUserId=${loggedUserId}`
            )
            .then((resp) => {
              setCustomer(resp.data);
            });
        } else if (accessLevel == 641 || accessLevel == 700) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getCustomersByCsl?loggedUserId=${loggedUserId}`
            )
            .then((resp) => {
              setCustomer(resp.data);
            });
        } else if (accessLevel == 690 || accessLevel == 800) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getCustomersByDP?loggedUserId=${loggedUserId}`
            )
            .then((resp) => {
              setCustomer(resp.data);
            });
        } else if (accessLevel == 930) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getCustomersbyAe?loggedUserId=${loggedUserId}`
            )
            .then((resp) => {
              setCustomer(resp.data);
            });
        } else {
          axios
            .get(baseUrl + `/revenuemetricsms/metrics/customers`)
            .then((resp) => {
              setCustomer(resp.data);
            });
        }
        if (accessLevel == 641 || accessLevel == 600) {
          axios
            .get(
              // dataAccess == 641
              //   ?
              baseUrl +
                `/SalesMS/MasterController/getCslDropDownData?userId=102007130`
              // : baseUrl +
              //     `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`
            )
            .then((res) => {
              let custom = [];
              let data = res.data;
              const seenPersonNames = new Set();

              data.length > 0 &&
                // data.forEach((e) => {
                //   let cslObj = {
                //     label: e.PersonName,
                //     value: e.id,
                //   };
                //   custom.push(cslObj);
                // });

                data.forEach((e) => {
                  if (!seenPersonNames.has(e.PersonName)) {
                    let cslObj = {
                      label: e.PersonName,
                      value: e.id,
                    };
                    custom.push(cslObj);
                    seenPersonNames.add(e.PersonName);
                  }
                });
              // dataAccess == 641
              //   ? ""
              custom.push({ label: "UnAssigned", value: 999 });
              setCsl(custom);
              if (id == null) {
                setSelectedCsl(custom);
              }
            });
        } else {
          axios
            .get(
              baseUrl +
                `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`
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

              // dataAccess == 641
              //   ? ""
              custom.push({ label: "UnAssigned", value: 999 });
              setCsl(custom);
              if (id == null) {
                setSelectedCsl(custom);
              }
            });
        }
        if (accessLevel == 600) {
          axios
            .get(
              baseUrl +
                `/CommonMS/master/getDPDropDownData?userId=${loggedUserId}`
            )
            .then((res) => {
              let custom = [];

              let data = res.data;

              // const seenPersonNames = new Set();

              data.length > 0 &&
                data.forEach((e) => {
                  let dpObj = {
                    label: e.PersonName,
                    value: e.delivery_partner_id,
                  };
                  custom.push(dpObj);
                });

              // data.forEach((e) => {
              //   if (!seenPersonNames.has(e.PersonName)) {
              //     let cslObj = {
              //       label: e.PersonName,
              //       value: e.id,
              //     };
              //     custom.push(cslObj);
              //     seenPersonNames.add(e.PersonName);
              //   }
              // });
              // dataAccess == 690
              //   ? ""
              custom.push({ label: "UnAssigned", value: 999 });
              setDp(custom);
              if (id == null) {
                setSelectedDp(custom);
              }
              // if (id == null) {
              // {
              //   dataAccess != 600 ? "" : setSelectedDp(custom);
              // }
              // }
            });
        } else if (accessLevel == 690) {
          axios
            .get(
              baseUrl +
                `/CommonMS/master/getDPDropDownData?userId=${loggedUserId}`
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
              // dataAccess == 690
              //   ? ""
              custom.push({ label: "UnAssigned", value: 999 });
              setDp(custom);
              if (id == null) {
                setSelectedDp(custom);
              }
            });
        } else {
          axios
            .get(
              baseUrl +
                `/CommonMS/master/getDPDropDownData?userId=${loggedUserId}`
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
              // dataAccess == 690
              //   ? ""
              custom.push({ label: "UnAssigned", value: 999 });
              setDp(custom);
              if (id == null) {
                setSelectedDp(custom);
              }
            });
        }

        if (accessLevel == 600) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsbyCslDp?loggedUserId=${
                  Number(loggedUserId) + 1
                }`
            )
            // .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
            .then((response) => {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
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
            // .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
            .then((response) => {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
              setProject(resp);
            });
        } else if (accessLevel == 46) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getprojectsforPm?userId=${loggedUserId}`
            )
            // .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
            .then((response) => {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
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
            // .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
            .then((response) => {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
              setProject(resp);
            });
        } else if (accessLevel === 930) {
          // Call the second API
          axios
            .get(
              baseUrl +
                `/CommonMS/master/getProjectsforAE?loggedUserId=${
                  Number(loggedUserId) + 1
                }`
            )
            // .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
            .then((response) => {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
              setProject(resp);
            });
        } else if (accessLevel == 690) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsbyDp?loggedUserId=${
                  Number(loggedUserId) + 1
                }`
            )
            // .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
            .then((response) => {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
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
            // .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
            .then((response) => {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
              setProject(resp);
            });
        } else if (accessLevel == 800) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsforDPPM?userId=${loggedUserId}&resId=${
                  Number(loggedUserId) + 1
                }`
            )

            .then(function (response) {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
              setProject(resp);
            });
        } else if (accessLevel == 700) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsforCSLPM?userId=${loggedUserId}&resId=${
                  Number(loggedUserId) + 1
                }`
            )

            .then(function (response) {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
              setProject(resp);
            });
        } else {
          axios
            .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
            .then((response) => {
              var resp = response.data;
              if (resp.length > 0) {
                resp.push({ id: "-1", name: "<<ALL>>" });
              }
              setProject(resp);
            });
        }
        if (
          // accessLevel == 700 ||
          // accessLevel == 800 ||
          accessLevel == 307 ||
          accessLevel == 931
        ) {
          setSelectType("Hierarchy");
          setFormData((prevData) => ({
            ...prevData,
            type: "Hierarchy",
          }));
        }
        if (
          // accessLevel == 641 ||
          accessLevel == 690 ||
          accessLevel == 641 ||
          accessLevel == 700
          // accessLevel == 690
        ) {
          setSelectType("customer");
          setFormData((prevData) => ({
            ...prevData,
            type: "customer",
          }));
        }
        if (accessLevel == 46) {
          setSelectType("project");
          setFormData((prevData) => ({
            ...prevData,
            type: "project",
          }));
        }
        if (
          // accessLevel == 641 ||
          // accessLevel == 690 ||
          accessLevel == 930
          // accessLevel == 800
          // accessLevel == 690
        ) {
          setSelectType("Business Unit");
          setFormData((prevData) => ({
            ...prevData,
            type: "Business Unit",
          }));
        }
        if (
          accessLevel == 126 ||
          accessLevel == 686 ||
          accessLevel == 428 ||
          accessLevel == 919 ||
          accessLevel == 646 ||
          accessLevel == 932 ||
          accessLevel == 1100 ||
          accessLevel == 1200 ||
          accessLevel == 1300 ||
          accessLevel == 908 ||
          accessLevel == 910 ||
          // accessLevel == 700 ||
          // accessLevel == 641 ||
          // accessLevel == 800 ||
          accessLevel == 600 ||
          // accessLevel == 690 ||
          accessLevel == 250
        ) {
          setSelectType("Business Unit");
          setFormData((prevData) => ({
            ...prevData,
            type: "Business Unit",
          }));
        }
      });
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
  }, [id]);

  //================
  const [formData, setFormData] = useState({});
  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          type: filterData.type,
          BusinessUnit: filterData?.BusinessUnit,
          ResLocation: filterData.ResLocation,
          EngCompany: filterData.EngCompany,
          captype: filterData.captype,
          AllocType: filterData.AllocType,
          ResType: filterData.ResType,
          View: filterData.View,
          measure: filterData.measure,
          Financialmeasures: filterData.Financialmeasures,
          ContractTerms: filterData.ContractTerms,
          Csl: filterData.Csl,
          Dp: filterData?.Dp,
          summaryBy: filterData.summaryBy,
          Source: filterData.Source,
          engLocation: filterData.engLocation,
          Customer: filterData.customer,
          Project: filterData.Project,
          "Resource Name": filterData["Resource Name"],
          "Primary PM": filterData["Primary PM"],
          Name: filterData.Name,
          hierarchyId: filterData.hierarchyId,
          Avg: filterData.Avg,
          avgtextvalue: filterData.avgtextvalue,
          capTypeName: filterData.capTypeName,
          managerProjects: filterData.managerProjects,
          FromDt: filterData.fromDate,
        };
      } else {
        return {
          type:
            id == null
              ? dataAccess == 641 || dataAccess == 690 || dataAccess == 600
                ? "customer"
                : selecttype
              : "Business Unit",
          BusinessUnit: "170,211,123,82,168,207,212,18,213,49,149,208,243,999",
          ResLocation: "6,5,3,8,7,1,2",
          EngCompany: "-1",
          captype: "capacity",
          AllocType:
            "billable,nonBillUtil,nonBillShad,nonBillEnb,nonBillCliPrep,nonBillNonUtil,nonBillInnov",
          ResType: "all",
          View: selecttype === "Business Unit" ? "consol" : "detail",
          measure: "hrs",
          Financialmeasures: "Revenue",
          ContractTerms: "-1",
          Csl: "-1",
          Dp: "-1",
          summaryBy: "Region",
          Source: "-1",
          engLocation: "-1",
          Customer: "",
          Project: "",
          "Resource Name": "",
          "Primary PM": "",
          AccountOwner: "-1",
          Name: hierarchyId,
          hierarchyId: loggedUserId,
          Avg: "",
          avgtextvalue: "",
          capTypeName: "",
          managerProjects: "",
          FromDt: "",
        };
      }
    });
  }, [filterData]);

  useEffect(() => {
    setSelectView(
      selecttype === "Business Unit"
        ? "consol"
        : selecttype === "Account Owner"
        ? "Account Owner"
        : "detail"
    );
    setFormData(() => {
      if (id != null) {
        return;
      } else {
        return {
          type: selecttype,
          BusinessUnit: "170,211,123,82,168,207,212,18,213,49,149,208,243,999",
          ResLocation: "6,5,3,8,7,1,2",
          EngCompany: "-1",
          captype: "capacity",
          AllocType:
            "billable,nonBillUtil,nonBillShad,nonBillEnb,nonBillCliPrep,nonBillNonUtil,nonBillInnov",
          ResType: "all",
          View:
            selecttype === "Business Unit"
              ? "consol"
              : selecttype === "Account Owner"
              ? "Account Owner"
              : "detail",
          measure: "hrs",
          Financialmeasures: selectedFinancialMeasures
            .map((item) => item.id)
            .toString(),
          ContractTerms: "-1",
          Csl: "-1",
          Dp: "-1",
          summaryBy: "Region",
          Source: "-1",
          engLocation: "-1",
          Customer: "",
          Project: "",
          "Resource Name": "",
          "Primary PM": "",
          AccountOwner: "-1",
          Name: hierarchyId,
          hierarchyId: loggedUserId,
          Avg: "",
          avgtextvalue: "",
          capTypeName: "",
          managerProjects: "",
          FromDt: "",
        };
      }
    });
  }, [selecttype]);

  Utils.Log(formData, "formData");
  Utils.Log(type, "type");
  Utils.Log(selecttype, "selecttype");
  Utils.Log(dataAccess, "dataAccess");

  useEffect(() => {
    if (
      (dataAccess === 919 || dataAccess === 126) &&
      selectview === "consol" &&
      formData.summaryBy.includes("Region")
    ) {
      // Check if "Bench Cost" already exists in financialMeasures
      const benchCostExists = financialMeasures.some(
        (measure) => measure.id === "BenchCost"
      );

      // Add "Bench Cost" only if it doesn't exist
      if (!benchCostExists) {
        const newBenchCost = {
          groupId: 8,
          id: "BenchCost",
          rolename: 1,
          value: "Bench Cost",
          isChecked: false,
        };

        setFinancialMeasures((prevMeasures) =>
          prevMeasures.concat(newBenchCost)
        );
      }
    }
  }, [dataAccess, selectview, formData.summaryBy, financialMeasures]);

  const [CustomerName, setCustomerName] = useState("");
  useEffect(() => {
    if (id != null) {
      const updatedepartments = departments.filter((values) =>
        filterData.BusinessUnit?.includes(values.value)
      );
      const updateResLocation = resLocation.filter((values) =>
        filterData.ResLocation?.includes(values.value)
      );
      const updateengCompany = engCompany.filter((values) =>
        filterData.EngCompany?.includes(values.value)
      );
      const updatecapType = capType.filter(
        (values) => filterData.captype === values.value
      );

      const updateAllocType = alloctype?.filter((values) =>
        filterData.AllocType?.includes(values.value)
      );

      setSelectedalloctype(updateAllocType);
      const selectedValues = filterData.Financialmeasures?.split(",");

      // const updateFinancialMeasures = financialMeasures?.filter(
      //   (values) => +formData.Financialmeasures?.includes(values.value)
      // );

      const updateContractTerms = contractTerms.filter((values) =>
        filterData.ContractTerms?.includes(values.value)
      );

      const updateDp = dp.filter(
        (values) => +filterData.Dp?.includes(values.value)
      );
      const updatecsl = csl.filter((values) =>
        filterData?.Csl?.includes(values.value)
      );

      const updateSummary = summaryBy.filter((values) =>
        filterData.summaryBy?.includes(values.value)
      );

      const updateCustomerName = customer?.filter((values) =>
        filterData?.Customer?.includes(values.id)
      );

      const CustomerNameData = JSON.stringify(
        updateCustomerName[0]?.name
      )?.replace(/"/g, "");

      const updatePorjectName = project?.filter((values) =>
        filterData?.Project?.includes(values.id)
      );
      const updatePorjectNameData = JSON.stringify(
        updatePorjectName[0]?.name
      )?.replace(/"/g, "");

      const UpdateResourceName = resource.filter(
        (values) => parseInt(filterData["Resource Name"]) === values.id
      );
      const UpdateResourceData = JSON.stringify(
        UpdateResourceName[0]?.name
      )?.replace(/"/g, "");

      const updatemanager = manager.filter((values) =>
        filterData["Primary PM"]?.includes(values.id)
      );

      const updatePMName = JSON.stringify(updatemanager[0]?.name)?.replace(
        /"/g,
        ""
      );

      const updatename = resource.filter(
        (values) => parseInt(filterData?.Name) === values.id
      );

      const updateResName = JSON.stringify(updatename[0]?.name)?.replace(
        /"/g,
        ""
      );

      setLabel(updateResName);
      setPmName(updatePMName);
      if (filterData.FromDt !== undefined && filterData.FromDt !== "") {
        const updatedate = filterData.FromDt;
        // setStartDate2(parseISO(updatedate));
        setMonth(parseISO(updatedate));
      }

      const updateengLocation = engLocation.filter((values) =>
        filterData.engLocation?.includes(values.value)
      );

      const updateFinancialMeasures = financialMeasures?.filter(
        (values) =>
          +filterData.Financialmeasures?.split(",").includes(values.value)
      );
      setSelectedFinancialMeasures(updateFinancialMeasures);
      const updateSelectview =
        filterData.type == "Business Unit" ||
        "Hierarchy" ||
        "customer" ||
        "project" ||
        "resource" ||
        "Primary PM"
          ? "detail"
          : "consol";
      setSelectView(updateSelectview);
      if (filterData?.engLocation == "-1") {
        setSelectedEngLocation(engLocation);
      } else {
        setSelectedEngLocation(updateengLocation);
      }
      setCustomerName(CustomerNameData);
      setProjectName(updatePorjectNameData);
      setResourceName(UpdateResourceData);

      const updaetselecttpe = filterData?.type;

      setSelectedSummaryBy(updateSummary);

      if (filterData.Csl == "-1") {
        setSelectedCsl(csl);
      } else {
        setSelectedCsl(updatecsl);
      }

      if (filterData.Dp === "-1") {
        setSelectedDp(dp);
      } else {
        setSelectedDp(updateDp);
      }

      if (filterData.BusinessUnit == "-1") {
        setSelectedDepartments(departments);
      } else {
        setSelectedDepartments(updatedepartments);
      }
      setSelectedResLocation(updateResLocation);

      if (filterData.EngCompany == "-1") {
        setSelectedEngCompany(engCompany);
      } else {
        setSelectedEngCompany(updateengCompany);
      }

      // setSelectedFinancialMeasures(updateFinancialMeasures);
      if (filterData.ContractTerms == "-1") {
        setSelectedContractorTerms(contractTerms);
      } else {
        setSelectedContractorTerms(updateContractTerms);
      }
      setSelectType(updaetselecttpe);
      setType("Hierarchy");
    }
  }, [
    id,
    alloctype,

    departments,

    resLocation,

    engCompany,

    capType,
    filterData.captype,

    financialMeasures,

    contractTerms,
    filterData.contractTerms,

    filterData.Dp,

    filterData?.Project,
    project,
    filterData.type,

    filterData?.Name,
    filterData.BusinessUnit,
  ]);
  const [financialMeasuresflag, setFinancialMeasuresFlag] = useState(false);

  const [searchingA, setsearchingA] = useState(false);
  const [validationmessage, setValidationMessage] = useState(false);
  const baseUrl = environment.baseUrl;
  let alldepartments;
  let allResLocation;
  let allengcompanies;
  let allcontractterms;
  let allcsl;
  let alldp;
  let allAccOwner;
  const [flag, setFlag] = useState(0);

  const dates = {
    fromDate: moment().startOf("month").format("YYYY-MM-DD"),
    toDate: moment().startOf("month").add("month", 0).format("YYYY-MM-DD"),
  };
  const [dt, setDt] = useState(dates);
  const [month, setMonth] = useState(moment(dt.toDate).toDate());
  let formattedMonth = moment(month).format("YYYY-MM-DD");
  const newLoggeduserId = Number(loggedUserId) + 1;

  const addHandler = () => {
    setFlag(1);
    const newFromDate = moment(dt.fromDate)
      .add("month", 1)
      .format("YYYY-MM-DD");
    const newToDate = moment(dt.toDate).add("month", 1).format("YYYY-MM-DD");
    setDt({
      fromDate: newFromDate,
      toDate: newToDate,
    });
    setMonth(moment(newToDate).toDate());
  };
  const subtractHandler = () => {
    setFlag(1);
    const newFromDate = moment(dt.fromDate)
      .subtract("month", 1)
      .format("YYYY-MM-DD");
    const newToDate = moment(dt.toDate)
      .subtract("month", 1)
      .format("YYYY-MM-DD");
    setDt({
      fromDate: newFromDate,
      toDate: newToDate,
    });
    setMonth(moment(newToDate).toDate());
  };

  const handleDateChange = (date) => {
    setFlag(0);
    setMonth(date);
    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(date).format("YYYY-MM-DD"),
    }));
    setFormData((prev) => ({
      ...prev,
      ["FromDt"]: moment(date).format("YYYY-MM-DD"),
    }));
    formattedMonth = moment(date).format("YYYY-MM-DD");
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (flag === 1) {
      getSearchData();
    }
  }, [flag, dt, month]);

  const departmentsArray = formData?.BusinessUnit?.split(",");
  alldepartments =
    departmentsArray?.length === departments?.length
      ? "-1"
      : formData?.BusinessUnit;

  const ResLocationArray = formData.ResLocation?.split(",");

  allResLocation =
    ResLocationArray?.length === resLocation.length
      ? "-1"
      : formData?.ResLocation;
  const engCompanyArray = formData?.EngCompany?.split(",");

  const contracttermsArray = formData?.ContractTerms?.split(",");

  allcontractterms =
    contracttermsArray?.length === contractTerms?.length
      ? "-1"
      : formData?.ContractTerms;

  allengcompanies =
    engCompanyArray?.length === engCompany.length ? "-1" : formData?.EngCompany;

  const cslArray = formData.Csl?.split(",");
  allcsl = cslArray?.length === csl?.length ? "-1" : formData?.Csl;

  const dpArray = formData?.Dp?.split(",");
  alldp = dpArray?.length === dp?.length ? "-1" : formData?.Dp;

  const allAccOwnerArray = formData?.AccountOwner?.split(",");
  allAccOwner =
    allAccOwnerArray?.length === accountOwner?.length
      ? "-1"
      : formData?.AccountOwner;

  ////-----------------Axios for BusinessUnit----------------------------//////
  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments.push({ value: 999, label: "Non-Revenue Units" });
    setDepartments(departments);
    if (id == null) {
      setSelectedDepartments(departments.filter((ele) => ele.value >= 0));
    }

    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value >= 0) {
        filteredDeptData.push(data.value);
      }
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["BusinessUnit"]: filteredDeptData.toString(),
    }));
  };

  ////--------------------Axios for Eng.Company--------------------------//////
  const getEngCompany = () => {
    axios({
      url: baseUrl + `/revenuemetricsms/metrics/getCompany`,
    }).then((resp) => {
      let EngCompany = resp.data;
      setEngCompany(resp.data);
      setSelectedEngCompany(EngCompany.filter((ele) => ele.value >= 0));
      let filteredCompanyData = [];
      EngCompany.forEach((data) => {
        if (data.value >= 0) {
          filteredCompanyData.push(data.value);
        }
      });
      setFormData((prevVal) => ({
        ...prevVal,
        ["EngagementCompany"]: filteredCompanyData.toString(),
      }));
    });
  };
  ////----------------Axios for Customers---------------------------//////////
  // const getCustomers = () => {
  //   axios
  //     .get(
  //       dataAccess == 690 || dataAccess == 641 || dataAccess == 909
  //         ? baseUrl +
  //             `/dashboardsms/allocationDashboard/getCustomers?loggedUserId=${loggedUserId}`
  //         : baseUrl + `/revenuemetricsms/metrics/customers`
  //     )
  //     .then((resp) => {
  //       setCustomer(resp.data);
  //     });
  // };

  // const getCSL = () => {
  //   axios
  //     .get(
  //       dataAccess == 641
  //         ? baseUrl + `/CommonMS/master/getCSLDPAE?loggedUserId=${loggedUserId}`
  //         : baseUrl +
  //             `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`
  //     )
  //     .then((res) => {
  //       let custom = [];
  //       let data = res.data;
  //       data.length > 0 &&
  //         data.forEach((e) => {
  //           let cslObj = {
  //             label: e.PersonName,
  //             value: e.id,
  //           };
  //           custom.push(cslObj);
  //         });

  //       dataAccess == 641
  //         ? ""
  //         : custom.push({ label: "UnAssigned", value: 999 });
  //       setCsl(custom);
  //       if (id == null) {
  //         setSelectedCsl(custom);
  //       }
  //     });
  // };
  //////-------------Axios for DP-----------------------//////
  // const getDP = () => {
  //   axios
  //     .get(
  //       dataAccess == 690
  //         ? baseUrl + `/CommonMS/master/getDP?loggedUserId=${loggedUserId}`
  //         : baseUrl +
  //             `/CommonMS/master/getDPDropDownData?userId=${loggedUserId}`
  //     )
  //     .then((res) => {
  //       let custom = [];

  //       let data = res.data;
  //       data.length > 0 &&
  //         data.forEach((e) => {
  //           let dpObj = {
  //             label: e.PersonName,
  //             value: e.id,
  //           };
  //           custom.push(dpObj);
  //         });
  //       dataAccess == 690
  //         ? ""
  //         : custom.push({ label: "UnAssigned", value: 999 });
  //       setDp(custom);
  //       // if (id == null) {
  //       setSelectedDp(custom);
  //       // }
  //     });
  // };

  //////---------------Axios for Projects-------------------///////////

  // useEffect(() => {
  //   getCslDPProjectsData();
  // }, []);

  ///////-----------Axios for EngLocation--------------------//////////
  const getEngLocation = () => {
    axios
      .get(baseUrl + `/dashboardsms/Dashboard/getCountry`)
      .then((Response) => {
        let countries = [];
        countries.push({ value: 0, label: "Others" });
        let data = Response.data;

        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            countries.push(countryObj);
          });

        //////////--Alphabetical Sorting--//////////
        const sortedcities = countries.sort(function (a, b) {
          var nameA = a.label.toUpperCase();
          var nameB = b.label.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        //////////------------------------//////////
        setEngLocation(sortedcities);
        if (id == null) {
          setSelectedEngLocation(countries);
        }
      });
  };

  useEffect(() => {
    let countryList = [];
    country.forEach((d) => {
      countryList.push(d.value);
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["Country"]: countryList.toString(),
    }));
  }, [engLocation]);
  /////////-----------Aios for Resource Name-------------////////////
  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      res.push({ id: "-1", name: "<<ALL>>" });

      setResource(res);
    });
  };
  ////////------------Axios for Primary PM------------/////////////
  const getManagerdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/dashboardsms/allocationDashboard/getManagers`,
    }).then(function (response) {
      var resp = response.data;
      setManager(resp);
    });
  };

  ///////-----------Axios for Res.Location------------///////////
  const getResLocation = () => {
    axios({
      method: "get",
      url: baseUrl + `/revenuemetricsms/metrics/getreslocation`,
    }).then(function (response) {
      let ResLocation = response.data;
      setResLocation(response.data);
      if (id == null) {
        setSelectedResLocation(ResLocation.filter((ele) => ele.value >= 0));
      }
      let filteredlocationData = [];
      ResLocation.forEach((data) => {
        if (data.value >= 0) {
          filteredlocationData.push(data.value);
        }
      });
      setFormData((prevVal) => ({
        ...prevVal,
        ["ResLocation"]: filteredlocationData.toString(),
      }));
    });
  };
  ////////////---------------Axios for ContractorTerms--------------////////////
  const getContractTerms = () => {
    axios({
      method: "get",
      url: baseUrl + `/revenuemetricsms/metrics/getcontractterms`,
    }).then(function (response) {
      let ResLocation = response.data;
      setContractTerms(response.data);
      if (id == null) {
        setSelectedContractorTerms(ResLocation.filter((ele) => ele.value >= 0));
      }
      let filteredcontracttermsData = [];
      ResLocation.forEach((data) => {
        if (data.value >= 0) {
          filteredcontracttermsData.push(data.value);
        }
      });
      if (id == null) {
        setFormData((prevVal) => ({
          ...prevVal,
          ["ContractTerms"]: filteredcontracttermsData.toString(),
        }));
      }
    });
  };

  ////////----------Axios for ProjectId's of PM-------------/////////
  const getProjectsByPrimaryMgr = () => {
    axios
      .get(
        baseUrl +
          `/revenuemetricsms/metrics/getProjectsByPrimaryMgr?mgrId=${
            id == null ? formData["Primary PM"] : filterData["Primary PM"]
          }`
      )
      .then((response) => {
        var resp = response.data;
        setManagerProject(resp);
      });
  };

  const d = managerProjects?.map((a) => {
    a?.object_id;
    return a.object_id;
  });
  const mgrId = d.toString();

  useEffect(() => {
    if (selecttype == "Hierarchy" && id == null) {
      getResourcehierarchy();
    }
  }, [selecttype]);

  useEffect(() => {
    if (filterData.type == "Hierarchy" && id != null) {
      getResourcehierarchySavedSearch();
    }
  }, [filterData.type]);
  const getResourcehierarchy = () => {
    const loaderTime = setTimeout(() => {
      setDisplayHierarchy(true);
    }, 2000);
    axios(
      baseUrl +
        `/customersms/Customers/getResourcehierarchy?rid=${loggedUserId}`
    ).then(function (response) {
      var resp = response.data;
      setHierarchyData(response.data);
      setDisplayHierarchy(false);
      clearTimeout(loaderTime);
    });
  };

  //////////////----------Axios for Account Owner-----------------/////////

  const getAccountOwner = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getAccountOwner`,
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
      setAccountOwner(custom);
      Utils.Log(custom, "custom--------------------------------");
      setSelectedAccountOwner(custom);
    });
  };
  //================For Saved Search========
  const getResourcehierarchySavedSearch = () => {
    const loaderTime = setTimeout(() => {
      setDisplayHierarchy(true);
    }, 2000);
    const id = filterData.Name - 1;
    axios(
      baseUrl + `/customersms/Customers/getResourcehierarchy?rid=${id}`
    ).then(function (response) {
      var resp = response.data;
      setHierarchyData(response.data);
      setDisplayHierarchy(false);
      clearTimeout(loaderTime);
    });
  };

  const reorderFinancialMeasures = (columnsOrder, selectedFMeasures) => {
    const orderedColumns = columnsOrder.split(",");
    Utils.Log(orderedColumns, "orderedColumns");
    Utils.Log(selectedFMeasures, "financialMeasures");

    const measuresArray =
      selectedFMeasures && selectedFMeasures.length > 0
        ? selectedFMeasures.split(",")
        : [];
    Utils.Log(measuresArray, "measuresArray");

    const reorderedMeasures = orderedColumns
      .map((column) =>
        measuresArray.includes(column)
          ? measuresArray[measuresArray.indexOf(column)]
          : null
      )
      .filter((value) => value !== null);

    return reorderedMeasures.join(",");
  };
  const columnsOrder =
    "Revenue,AssRevenue,ActRevenue,ApprRevenue,RecRevenue,AvgCost,RRCost,NAvgCost,NRRCost,AcGM,RRGM,NAcGM,NRRGM,capacity,billAppr,billApprNet";

  const getSearchData = () => {
    const selectedFMeasures = formData.Financialmeasures;

    const reorderedFinancialMeasures = reorderFinancialMeasures(
      columnsOrder,
      selectedFMeasures
    );
    const loaderTime = setTimeout(() => {
      setsearchingA(true);
    }, 2000);
    abortController.current[1] = new AbortController();
    const cacheBuster = Math.random();
    axios({
      method: "post",
      url:
        baseUrl + `/revenuemetricsms/metrics/search?cacheBuster=${cacheBuster}`,
      signal: abortController.current[1].signal,
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
      data: {
        Typ: formData.captype,
        ObjectId:
          selecttype == "Business Unit"
            ? formData.BusinessUnit
            : selecttype == "Hierarchy"
            ? hierarchyId
            : selecttype == "customer"
            ? formData.Customer
            : selecttype == "project"
            ? formData.Project
            : selecttype == "resource"
            ? formData["Resource Name"]
            : selecttype == "Primary PM"
            ? mgrId
            : selecttype == "Account Owner"
            ? allAccOwner
            : "",
        FromDt: formattedMonth,
        AllocType: formData.AllocType,
        FilterType:
          selecttype == "Primary PM"
            ? "project"
            : selecttype == "Account Owner"
            ? "AccOwner"
            : formData.type,
        FBy: "country",
        Countries: formData.ResLocation,
        Measure: formData.measure,
        ResType: formData.ResType,
        FMeasure: reorderedFinancialMeasures,
        PrjSource: formData.Source,
        EngCountries: formData.engLocation,
        avgFilterType: formData.Avg,
        avgFilterVal: formData.avgtextvalue,
        contTerms: allcontractterms,
        engComps: allengcompanies,
        SaltKey: "AAAAB3NzaC1yc2EAAAABJQAAAIEAkwFrmz0JNpn8",
        cslIds: allcsl,
        dpIds: alldp,
        UserId: loggedUserId,
      },
    })
      .then((response) => {
        let rp = response.data;
        setsearchingA(false);
        clearTimeout(loaderTime);
        setActionTable([]);
        setDisplayStateB(true);
        setActionTable(rp[0]);
        setUtilizationSummary(response.data[1]);
        setBenchSummary(response.data[2]);
        if (rp.length > 0) {
          setDisplayStateB(true);
          setDisplayState(true);
          setDisplayStateA(true);
        }
        setToggleButton(true);
        let valid = GlobalValidation(ref);
        setSearching(false);
        !valid && setvisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };
  const ActionIds = actionTable.tableData?.map((item) => item.Id);

  const filteredNumbers = ActionIds?.filter(
    (ActionIds) => ![-1, -2, 999].includes(ActionIds)
  );

  useEffect(() => {
    if (dataAccess == 690 || dataAccess == 641 || dataAccess == 930) {
      // getCustomers();
      // getNewProjects();
      // getProjectdata();
      // getCSL();
      // getDP();
    }
  }, [dataAccess]);

  useEffect(() => {
    getDepartments();
    getEngCompany();
    // getCustomers();
    // getNewProjects();
    // getCSL();
    // getDP();
    // getProjectdata();
    getEngLocation();
    getData();
    getManagerdata();
    getResLocation();
    getContractTerms();
    getAccountOwner();
    // getResourcehierarchy();
    // getIsPmAndAbove();
  }, []);

  useEffect(() => {
    getProjectsByPrimaryMgr();
  }, [formData["Primary PM"], filterData["Primary PM"]]);

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
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Search created successfully.
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Monthly Revenue Forecast</h2>
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
                payload={formData}
              />
            </span>
          </div>

          <GlobalHelp pdfname={HelpPDFName} name={Headername} />
        </div>
      </div>

      <RevenueForecastFilters
        capType={capType}
        country={country}
        setCountry={setCountry}
        customer={customer}
        departments={departments}
        selectedDepartments={selectedDepartments}
        selectedEngCompany={selectedEngCompany}
        selectedCsl={selectedCsl}
        selectedDp={selectedDp}
        project={project}
        resourceName={resourceName}
        pmname={pmname}
        selectedEngLocation={selectedEngLocation}
        resource={resource}
        manager={manager}
        summaryBy={summaryBy}
        selectedSummaryBy={selectedSummaryBy}
        financialMeasures={financialMeasures}
        selectview={selectview}
        selectedResLocation={selectedResLocation}
        selectedContractTerms={selectedContractTerms}
        tableData={tableData}
        utilizationSummary={utilizationSummary}
        benchSummary={benchSummary}
        displayState={displayState}
        displayStateA={displayStateA}
        displayStateB={displayStateB}
        hierarchydata={hierarchydata}
        searchingA={searchingA}
        setsearchingA={setsearchingA}
        alldepartments={alldepartments}
        addHandler={addHandler}
        subtractHandler={subtractHandler}
        handleDateChange={handleDateChange}
        setDisplayHierarchy={setDisplayHierarchy}
        resLocation={resLocation}
        engCompany={engCompany}
        formData={formData}
        month={month}
        contractTerms={contractTerms}
        csl={csl}
        hierarchyId={hierarchyId}
        dp={dp}
        projectname={projectname}
        selecttype={selecttype}
        setSelectType={setSelectType}
        setType={setType}
        type={type}
        actionTable={actionTable}
        setActionTable={setActionTable}
        setUtilizationSummary={setUtilizationSummary}
        setBenchSummary={setBenchSummary}
        setFormData={setFormData}
        setCapType={setCapType}
        setMonth={setMonth}
        formattedMonth={formattedMonth}
        setSelectView={setSelectView}
        engLocation={engLocation}
        filteredNumbers={filteredNumbers}
        setSearching={setSearching}
        searching={searching}
        setSelectedDepartments={setSelectedDepartments}
        setSelectedResLocation={setSelectedResLocation}
        setSelectedContractorTerms={setSelectedContractorTerms}
        setSelectedEngCompany={setSelectedEngCompany}
        setSelectedCsl={setSelectedCsl}
        setSelectedDp={setSelectedDp}
        setSelectedSummaryBy={setSelectedSummaryBy}
        setSelectedEngLocation={setSelectedEngLocation}
        loggedUserId={loggedUserId}
        validationmessage={validationmessage}
        setValidationMessage={setValidationMessage}
        abortController={abortController}
        loggedResourceId={loggedResourceId}
        setHierarchyId={setHierarchyId}
        setLabel={setLabel}
        label={label}
        getSearchData={getSearchData}
        displayHierarchy={displayHierarchy}
        visible={visible}
        setvisible={setvisible}
        page_Name={page_Name}
        setFinancialMeasures={setFinancialMeasures}
        CustomerName={CustomerName}
        pageurl={pageurl}
        setEditAddmsg={setEditAddmsg}
        alloctype={alloctype}
        setAlloctype={setAlloctype}
        setSelectedalloctype={setSelectedalloctype}
        selectedalloctype={selectedalloctype}
        selectedFinancialMeasures={selectedFinancialMeasures}
        setSelectedFinancialMeasures={setSelectedFinancialMeasures}
        savedSaerchid={id}
        filterData={filterData}
        allcontractterms={allcontractterms}
        allengcompanies={allengcompanies}
        allcsl={allcsl}
        alldp={alldp}
        setDisplayState={setDisplayState}
        setDisplayStateA={setDisplayStateA}
        setDisplayStateB={setDisplayStateB}
        dataAccess={dataAccess}
        cheveronIcon={cheveronIcon}
        setCheveronIcon={setCheveronIcon}
        mgrId={mgrId}
        managerProjects={managerProjects}
        setFinancialMeasuresFlag={setFinancialMeasuresFlag}
        toggleButton={toggleButton}
        setToggleButton={setToggleButton}
        accountOwner={accountOwner}
        setAccountOwner={setAccountOwner}
        selectedAccountOwner={selectedAccountOwner}
        setSelectedAccountOwner={setSelectedAccountOwner}
        reorderFinancialMeasures={reorderFinancialMeasures}
        allAccOwner={allAccOwner}
      />
    </div>
  );
}

export default RevenueForecast;
