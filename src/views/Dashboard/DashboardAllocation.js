import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaCaretDown,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CCollapse } from "@coreui/react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import axios from "axios";
import Loader from "../Loader/Loader";
import { environment } from "../../environments/environment";
import moment from "moment";
import { Column } from "primereact/column";
import MaterialReactCollapisbleTable from "../PrimeReactTableComponent/MaterialReactCollapisbleTable";
import "./DashboardAllocationTable.scss";
import ExcelJS from "exceljs";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import DashboardAllocationTable from "./DashboardAllocationTable";
import { AiFillWarning } from "react-icons/ai";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import { RiFileExcel2Line } from "react-icons/ri";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";

import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function DashboardAllocation() {
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [item, setItem] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [month, setMonth] = useState();
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [departments, setDepartments] = useState([]);
  const [dataAccess, setDataAccess] = useState([]);
  const [selectType, setSelectType] = useState(
    dataAccess == 46
      ? "project"
      : dataAccess == 690
        ? "customer"
        : dataAccess == 126 && "bu"
  );
  const [selectFilter, setSelectFilter] = useState("-1");
  const [msg, setMsg] = useState(false);
  const [country, setCountry] = useState([]);
  const [measure, setMeasure] = useState([
    { value: "bill", label: "Billable Utilization" },
    { value: "nBill", label: "Non-Billable Utilization" },
    { value: "innovation", label: "Innovation" },
    { value: "others", label: "Others" },
  ]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedMeasure, setSelectedMeasure] = useState(measure);
  const [duration, setDuration] = useState([]);
  const [date, SetDate] = useState(new Date());
  const [customer, setCustomer] = useState([]);
  const [project, setProject] = useState([]);
  const [resource, setResource] = useState([]);
  const [manager, setManager] = useState([]);
  const [details, setDetails] = useState([]);
  const [searching, setsearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [roles, setRoles] = useState([]);
  const ref = useRef([]);
  const abortController = useRef(null);
  const baseUrl = environment.baseUrl;
  const [changeCnt, setChangeCnt] = useState([]);
  const HelpPDFName = "AllocationDashboard.pdf";
  const HelpHeader = "Allocation Dashboard Help";
  const [viewBy, setViewBy] = useState("");
  const [showDashboardTable, setShowDashboardTable] = useState(false);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const cumonth = currentDate.getMonth() + 1;
  const firstDay = new Date(year, cumonth - 1, 1);

  const initialValue = {
    type:
      dataAccess == 46
        ? "project"
        : dataAccess == 641 ||
          dataAccess == 600 ||
          dataAccess == 800 ||
          dataAccess == 700
          ? "customer"
          : "customer",
    buId: "",
    countryIds: "",
    resType: "-1",
    month: moment(firstDay.toDateString()).format("yyyy-MM-DD"),
    duration: "3",
    customerId: "-1",
    projectId: "-1",
    resourceId: "-1",
    pmId: "-1",
    measures: "bill,nBill,innovation,others",
    filterMeasure: "-1",
    operator: "ge",
    filterVal: "-1",
    viewType: "resource",
  };

  const [formData, setFormData] = useState(initialValue);

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Allocation Dashboard"];
  let textContent = "Dashboards";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 124;

  useEffect(() => {
    getDepartments();
    getCountries();
    getResourcedata();
    getManagerdata();
  }, []);

  useEffect(() => {
    getMenus();
  }, []);

  useEffect(() => { }, [item]);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/executive/utilizationDashboard";
      getUrlPath(modifiedUrlPath);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Custom Dashboard"
        ),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });

      const allocationDashboardSubMenu = updatedMenuData
        .find((item) => item.display_name === "Dashboards")
        .subMenus.find(
          (subMenu) => subMenu.display_name === "Allocation Dashboard"
        );

      // const accessLevel = allocationDashboardSubMenu
      //   ? allocationDashboardSubMenu.access_level
      //   : null;
      const accessLevel = allocationDashboardSubMenu.userRoles.includes("686")
        ? 686
        : allocationDashboardSubMenu.userRoles.includes("428")
          ? 428
          : allocationDashboardSubMenu.userRoles.includes("690") &&
            allocationDashboardSubMenu.userRoles.includes("46")
            ? 800
            : allocationDashboardSubMenu.userRoles.includes("641") &&
              allocationDashboardSubMenu.userRoles.includes("46")
              ? 700
              : allocationDashboardSubMenu.userRoles.includes("690") &&
                allocationDashboardSubMenu.userRoles.includes("930")
                ? 500
                : allocationDashboardSubMenu.userRoles.includes("641") &&
                  allocationDashboardSubMenu.userRoles.includes("930")
                  ? 400
                  : allocationDashboardSubMenu.userRoles.includes("690") &&
                    allocationDashboardSubMenu.userRoles.includes("641")
                    ? 600
                    : allocationDashboardSubMenu.userRoles.includes("126") &&
                      allocationDashboardSubMenu.userRoles.includes("46")
                      ? 126
                      : allocationDashboardSubMenu.userRoles.includes("126")
                        ? 126
                        : allocationDashboardSubMenu.userRoles.includes("690")
                          ? 690
                          : allocationDashboardSubMenu.userRoles.includes("641")
                            ? 641
                            : allocationDashboardSubMenu.userRoles.includes("46")
                              ? 46
                              : allocationDashboardSubMenu.userRoles.includes("919")
                                ? 919
                                : null;
      setDataAccess(accessLevel);
      if (accessLevel == 600) {
        axios
          .get(
            baseUrl +
            `/dashboardsms/allocationDashboard/getCustomers?loggedUserId=${loggedUserId}`
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
      } else if (accessLevel == 641 || accessLevel == 700) {
        axios
          .get(
            baseUrl +
            `/ProjectMS/project/getCustomersByCsl?loggedUserId=${loggedUserId}`
          )
          .then((resp) => {
            setCustomer(resp.data);
          });
      } else {
        axios
          .get(baseUrl + `/customersms/Customers/getCustomers`)
          .then((resp) => {
            setCustomer(resp.data);
          });
      }
      if (accessLevel == 600) {
        axios
          .get(
            baseUrl +
            `/ProjectMS/project/getProjectsbyCslDp?loggedUserId=${Number(loggedUserId) + 1
            }`
          )
          // .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
          .then((response) => {
            var resp = response.data;

            setProject(resp);
          });
      } else if (accessLevel == 690) {
        axios
          .get(
            baseUrl +
            `/ProjectMS/project/getProjectsbyDp?loggedUserId=${Number(loggedUserId) + 1
            }`
          )

          .then(function (response) {
            var resp = response.data;
            setProject(resp);
          });
      } else if (accessLevel == 641) {
        axios
          .get(
            baseUrl +
            `/ProjectMS/project/getProjectsbycsl?loggedUserId=${Number(loggedUserId) + 1
            }`
          )

          .then(function (response) {
            var resp = response.data;
            setProject(resp);
          });
      } else if (accessLevel == 800) {
        axios
          .get(
            baseUrl +
            `/ProjectMS/project/getProjectsforDPPM?userId=${loggedUserId}&resId=${Number(loggedUserId) + 1
            }`
          )

          .then(function (response) {
            var resp = response.data;
            setProject(resp);
          });
      } else if (accessLevel == 700) {
        axios
          .get(
            baseUrl +
            `/ProjectMS/project/getProjectsforCSLPM?userId=${loggedUserId}&resId=${Number(loggedUserId) + 1
            }`
          )

          .then(function (response) {
            var resp = response.data;
            setProject(resp);
          });
      } else if (accessLevel == 930) {
        axios
          .get(
            // dataAccess == 690 || dataAccess == 641 || dataAccess == 46
            //   ?
            baseUrl +
            `/ProjectMS/project/getProjectsbyAE?loggedUserId=${Number(loggedUserId) + 1
            }`
            // : baseUrl + `/ProjectMS/Audit/getProjectNameandId`
          )

          .then(function (response) {
            var resp = response.data;
            setProject(resp);
          });
      } else if (accessLevel == 46) {
        axios
          .get(
            // dataAccess == 690 || dataAccess == 641 || dataAccess == 46
            //   ?
            baseUrl +
            `/ProjectMS/project/getProjectsForAlloc?loggedUserId=${loggedUserId}`

            // : baseUrl + `/ProjectMS/Audit/getProjectNameandId`
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

      if (accessLevel === 46) {
        setSelectType("project");
        setFormData((prevData) => ({
          ...prevData,
          type: "project",
        }));
      }
      if (
        accessLevel === 126 ||
        accessLevel == 919 ||
        accessLevel == 428 ||
        accessLevel == 686
      ) {
        setSelectType("bu");
        setFormData((prevData) => ({
          ...prevData,
          type: "bu",
        }));
      }
      if (accessLevel === 641 || accessLevel == 700 || accessLevel == 800) {
        setSelectType("customer");
        setFormData((prevData) => ({
          ...prevData,
          type: "customer",
        }));
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
      .then((res) => { })
      .catch((error) => { });
  };

  useEffect(() => {
    getDepartments();
  }, [selectType]);
  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments.push({ value: 999, label: "Non-Revenue Units" });
    setDepartments(departments);
    setSelectedDepartments(departments.filter((ele) => ele.value != 999));
    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 999) {
        filteredDeptData.push(data.value);
      }
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["buId"]: filteredDeptData.toString(),
    }));
  };

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)

      .then((Response) => {
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
        setCountry(countries);
        setChangeCnt(countries);
        setSelectedCountry(countries);
      });
  };

  useEffect(() => {
    let countryList = [];
    country.forEach((d) => {
      countryList.push(d.value);
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["countryIds"]: countryList.toString(),
    }));
  }, [country]);

  const customValueRenderer = (selected, _options) => {
    return selected.length === country.length ||
      selected.length === departments.length ||
      selected.length === measure.length
      ? "<< ALL >>"
      : selected.length === 0
        ? "<< Please Select >>"
        : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };

  useEffect(() => {
    if (dataAccess == 690 || dataAccess == 641 || dataAccess == 46) {
      // getProjectdata();
      getManagerdata();
      getResourcedata();
      // getCustomerdata();
    }
  }, [dataAccess]);

  // const getProjectdata = () => {
  //   {
  //     axios
  //       .get(
  //         dataAccess == 690 || dataAccess == 641 || dataAccess == 46
  //           ? baseUrl +
  //           `/dashboardsms/allocationDashboard/getProjects?userId=${loggedUserId}`
  //           : baseUrl + `/ProjectMS/Audit/getProjectNameandId`
  //       )

  //       .then(function (response) {
  //         var resp = response.data;
  //         setProject(resp);
  //       });
  //   }
  // };

  const getResourcedata = () => {
    axios
      .get(
        dataAccess == 690 || dataAccess == 641 || dataAccess == 46
          ? baseUrl +
          `/dashboardsms/allocationDashboard/getResources?userId=${loggedUserId}`
          : baseUrl + `/dashboardsms/allocationDashboard/getAllResources`
      )
      .then(function (response) {
        var resp = response.data;
        setResource(resp);
      });
  };

  const getManagerdata = () => {
    axios
      .get(
        dataAccess == 690 || dataAccess == 641 || dataAccess == 46
          ? baseUrl +
          `/CommonMS/master/getprimaryPm?loggedUserId=${loggedUserId}`
          : baseUrl + `/dashboardsms/allocationDashboard/getManagers`
      )
      .then(function (response) {
        var resp = response.data;
        setManager(resp);
      });
  };

  const handleClick = () => {
    setViewBy(formData.viewType);
    setTableData([]);

    setShowWarning(parseInt(formData.filterVal, 10) > 100);
    let filteredData = ref.current.filter((d) => d != null);
    // const loaderTime = setTimeout(() => {
    //   setsearching(parseInt(formData.filterVal, 10) > 100 ? false : true);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);
    if (
      // (formData.filterMeasure != "-1"
      //   && formData.filterVal == "-1"
      // ) ||
      // formData.filterVal == ""
      (formData.filterMeasure !== "-1" && formData.filterVal === "-1") ||
      (formData.filterVal === "" && formData.filterMeasure === "-1")
    ) {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 1000);

      // setsearching(false);
      return;
    }
    if (valid == true) {
      setsearching(false);
      // setShowWarning(true)
      setErrorMsg(true);
      setTimeout(() => {
        setShowWarning(false);
        setErrorMsg(false);
      }, 1000);
    }

    if (valid || showWarning) {
      return;
    }

    if (parseInt(formData.filterVal) > 100) {
      return;
    }

    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      // setsearching(true)
      setsearching(parseInt(formData.filterVal, 10) > 100 ? false : true);
    }, 2000);
    // setsearching(parseInt(formData.filterVal, 10) > 100 ? false : true);
    axios({
      method: "post",
      url: baseUrl + `/dashboardsms/allocationDashboard/getAllocationDashboard`,
      data: formData,
      signal: abortController.current.signal,
    })
      .then((res) => {
        // setTableData(res.data)
        // const GetData = res.data;

        let tabData = res.data.data;
        //let tabData = detail.filter(data => data.id !== -1)
        // let cols = res.data.columns.replaceAll("'", "").split(",");
        setDetails(tabData);
        setsearching(false);
        clearTimeout(loaderTime);
        let responseObject = {
          tabData: tabData,
          reportRunId: res.data.reportRunId,
        };
        setMsg(true);
        return responseObject;
      })
      .then((responseObject) => {
        axios({
          method: "get",
          url:
            baseUrl +
            `/dashboardsms/allocationDashboard/getColumnsData?reportRunId=${responseObject.reportRunId}`,
        }).then((res1) => {
          let header = res1.data.val;

          setColumns(header);
          let fData = [
            { columns: header },
            { tableData: [...responseObject.tabData] },
          ];
          setsearching(false);
          clearTimeout(loaderTime);
          (!valid || !showWarning) && setVisible(!visible);

          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
          setTableData(fData);
          setShowDashboardTable(true)
        });
      })
      .then((error) => { });
  };

  // const exportExcel = () => {
  //   import("xlsx").then((xlsx) => {
  //     let wantedCols = Object.keys(details[0]);
  //     let wantedValues = [];
  //     let dd = JSON.parse(JSON.stringify(details)).slice(1);
  //     for (let i = 0; i < dd.length; i++) {
  //       const obj = {};
  //       Object.keys(details[i]).forEach((d) => {
  //         if (wantedCols.includes(d)) {
  //           obj[details[0][d]] = details[i][d];
  //         }
  //       });
  //       wantedValues.push(obj);
  //     }
  //     const worksheet = xlsx.utils.json_to_sheet(wantedValues.slice(1));
  //     const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
  //     const excelBuffer = xlsx.write(workbook, {
  //       bookType: "xlsx",
  //       type: "array",
  //     });
  //     saveAsExcelFile(excelBuffer, "data");
  //   });
  // };
  const exportExcel = () => {
    // import("xlsx").then((xlsx) => {
    let desiredColumnOrder = [];
    let cols = [];
    cols = columns.replaceAll("'", "");
    desiredColumnOrder = cols
      .split(",")
      .filter((col) => !col.includes("_greyout"));

    const wantedValues = details.map((item) => {
      const obj = {};
      desiredColumnOrder.forEach((col) => {
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
    const rows = wantedValues.map((item) => {
      const row = [];
      desiredColumnOrder.forEach((col) => {
        row.push(item[col]);
      });
      return row;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");
    wantedValues.forEach((item) => {
      const row = worksheet.addRow(Object.values(item));
    });

    const boldRow = [1, 2];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "AllocationDashboard.xlsx");
    });
  };

  // const saveAsExcelFile = (buffer, fileName) => {
  //   import("file-saver").then((module) => {
  //     if (module && module.default) {
  //       let EXCEL_TYPE =
  //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  //       let EXCEL_EXTENSION = ".xlsx";
  //       const data = new Blob([buffer], { type: EXCEL_TYPE });
  //       module.default.saveAs(
  //         data,
  //         fileName + EXCEL_EXTENSION
  //         // fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
  //       );
  //     }
  //   });
  // };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setShowDashboardTable(false);
    setSelectType(value);
    setFormData((prev) => ({ ...prev, ["type"]: e.target.value }));
    setFormData((prev) => ({ ...prev, ["countryIds"]: "6,5,3,8,4,7,1,2" }));

    setSelectedCountry(changeCnt);
    // setSelectFilter(value)
    // setFormData((prev) => ({ ...prev, [id]: value }))
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
  const handleClear = () => {
    setFormData((prev) => ({ ...prev, customerId: "-1" }));
    setFormData((prev) => ({ ...prev, projectId: "-1" }));
    setFormData((prev) => ({ ...prev, resourceId: "-1" }));
    setFormData((prev) => ({ ...prev, pmId: "-1" }));
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  useEffect(() => { }, [selectType]);

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Allocation Dashboard</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={HelpHeader} />
          </div>
        </div>
      </div>
      {showWarning ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please enter a value less than or equal to 100
        </div>
      ) : (
        ""
      )}

      {errorMsg ? (
        <div className="statusMsg error col-12 mb-2">
          <span>
            <IoWarningOutline />
            &nbsp;{`Please select valid values for highlighted fields`}
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="select">
                  Type
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-7">
                  <select id="type" onChange={handleChange}>
                    {dataAccess == 690 ||
                      dataAccess == 641 ||
                      dataAccess == 600 ||
                      dataAccess == 930 ||
                      dataAccess == 800 ||
                      dataAccess == 700 ? (
                      <>
                        <option value="customer" selected>
                          Customer
                        </option>
                        <option value="project">Project</option>
                        {/* <option value="resource">Resource</option> */}
                      </>
                    ) : (
                      <>
                        {dataAccess == 46 ? (
                          ""
                        ) : (
                          <option value="bu" selected>
                            Business Unit
                          </option>
                        )}
                        {dataAccess == 46 ? (
                          ""
                        ) : (
                          <option value="customer">Customer</option>
                        )}
                        <option value="project">Project</option>
                        {dataAccess == 46 ? (
                          ""
                        ) : (
                          <option value="resource">Resource</option>
                        )}
                        {dataAccess == 686 ||
                          dataAccess == 932 ||
                          dataAccess == 126 ||
                          dataAccess == 919 ||
                          dataAccess == 428 ||
                          dataAccess == 46 ? (
                          <option value="primaryPm">Primary PM</option>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                    { }
                  </select>
                </div>
              </div>
            </div>
            {dataAccess == 690 ||
              dataAccess == 641 ||
              dataAccess == 930 ||
              dataAccess == 600 ||
              dataAccess == 46 ||
              dataAccess == 800 ||
              dataAccess == 700 ||
              selectType == "primaryPm" ||
              selectType == "project"
              ? ""
              : (selectType == "bu" ||
                selectType == "customer" ||
                (dataAccess == 686 && selectType == "bu") ||
                (dataAccess == 428 && selectType == "bu") ||
                (dataAccess == 686 && selectType != "project") ||
                selectType != "resource") && (
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="email-input">
                      BU<span className="error-text ml-1">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-7 multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="buId"
                        options={departments}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedDepartments}
                        valueRenderer={customValueRenderer}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedDepartments(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });

                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["buId"]: filteredValues.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            {/* {(selectType == "customer" && dataAccess == 641) ||
            dataAccess == 600 ||
            dataAccess == 641 ||
            dataAccess == 909 ||
            dataAccess == 690 ||
            (selectType == "customer" && dataAccess == 690) ||
            (selectType == "customer" && dataAccess == 600) ||
            (selectType == "customer" && dataAccess == 900) ? ( */}
            {selectType == "customer" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="email-input">
                    Customer<span className="error-text ml-1">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-7 autocomplete"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <div className="autoComplete-container">
                      <ReactSearchAutocomplete
                        items={[...customer,  { id: -1, name: "<<All>>" }]}
                        type="Text"
                        name="customerId"
                        id="customerId"
                        className="AutoComplete"
                        onSelect={(e) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            customerId: e.id,
                            viewType: "resource"
                          }));
                        }}
                        showIcon={false}
                        onClear={handleClear}
                        placeholder="Type minimum 3 characters"
                      />
                      <span> {item.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {selectType == "project" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="email-input">
                    Project<span className="error-text ml-1">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-7 autocomplete"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <div className="autoComplete-container ">
                      <ReactSearchAutocomplete
                        items={[...project, { id: -1, name: "<<All>>" }]}
                        type="Text"
                        name="projectId"
                        id="projectId"
                        className="error AutoComplete"
                        onSelect={(e) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            projectId: e.id,
                            viewType: "resource"
                          }));
                        }}
                        showIcon={false}
                        onClear={handleClear}
                        placeholder="Type minimum 3 characters"
                      />
                      <span> {item.name}</span>
                    </div>
                    {/* <input type="text" /> */}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {selectType == "resource" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="email-input">
                    Resource<span className="error-text ml-1">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-7 autocomplete"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <div className="autoComplete-container ">
                      <ReactSearchAutocomplete
                        items={[...resource, { id: -1, name: "<<All>>" }]} // Add "All" option to the list if no results found or if there's already an "All" option
                        type="Text"
                        name="resourceId"
                        id="resourceId"
                        className="error AutoComplete"
                        onSelect={(selectedItem) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            resourceId: selectedItem.id,
                            viewType: "resource"
                          }));
                        }}
                        showIcon={false}
                        onClear={handleClear}
                        placeholder="Type minimum 3 characters"
                      />
                      <span> {item.name}</span>
                    </div>
                    {/* <input type="text" /> */}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {selectType == "primaryPm" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="email-input">
                    Primary PM<span className="error-text ml-1">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-7 autocomplete"
                    ref={(ele) => {
                      ref.current[4] = ele;
                    }}
                  >
                    <div className="autoComplete-container ">
                      <ReactSearchAutocomplete
                        items={manager}
                        type="Text"
                        name="pmId"
                        id="pmId"
                        className="error AutoComplete"
                        onSelect={(e) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            pmId: e.id,
                            viewType: "resource"
                          }));
                        }}
                        showIcon={false}
                        onClear={handleClear}
                        placeholder="Type minimum 3 characters"
                      />
                      <span> {item.name}</span>
                    </div>
                    {/* <input type="text" /> */}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="email-input">
                  Country<span className="error-text ml-1">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-7 multiselect"
                  ref={(ele) => {
                    ref.current[5] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="countryIds"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    disabled={false}
                    valueRenderer={customValueRenderer}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["countryIds"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="select">
                  Res. Type
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-7">
                  <select
                    id="resType"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ["resType"]: e.target.value,
                      }))
                    }
                  >
                    <option value="-1">&lt;&lt;ALL&gt;&gt;</option>
                    <option value="fte">Employee</option>
                    <option value="subk">Contractors</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-2">
              <div className="form-group row ">
                <label className="col-4" htmlFor="email-input">
                  Month
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-7 datepicker" style={{ zIndex: 4 }}>
                  <DatePicker
                    name="month"
                    id="month"
                    onChange={(e) => {
                      SetDate(e);
                      setFormData((prev) => ({
                        ...prev,
                        ["month"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setMonth(e);
                    }}
                    selected={date}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                  // onKeyDown={(e) => {
                  //   e.preventDefault();
                  // }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="select">
                  Duration
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-7">
                  <select
                    id="duration"
                    onSelect={(e) => setDuration(e.target.value)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ["duration"]: e.target.value,
                      }))
                    }
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3" selected>
                      3
                    </option>
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
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="email-input">
                  Measures<span className="error-text ml-1">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-7 multiselect"
                  ref={(ele) => {
                    ref.current[6] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="measures"
                    options={measure}
                    hasSelectAll={true}
                    value={selectedMeasure}
                    disabled={false}
                    valueRenderer={customValueRenderer}
                    onChange={(e) => {
                      setSelectedMeasure(e);
                      let filteredvalue = [];
                      e.forEach((d) => {
                        filteredvalue.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["measures"]: filteredvalue.toString(),
                      }));
                      setFormData((prev) => ({ ...prev, ["filterVal"]: "-1" }));
                      setSelectFilter("-1");
                    }}
                  />
                </div>
              </div>
            </div>
            {selectType == "bu" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="select">
                    View By
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-7">
                    <select
                      id="viewType"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ["viewType"]: e.target.value,
                        }))
                      }
                    >
                      <option value="resource" selected>
                        Resource
                      </option>
                      <option value="bu">BU</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="select">
                  Filter By
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-3 pr-0">
                  <select
                    id="filterMeasure"
                    value={selectFilter}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        ["filterMeasure"]: e.target.value,
                      }));
                      setFormData((prev) => ({ ...prev, ["filterVal"]: "-1" }));
                      setSelectFilter(e.target.value);
                    }}
                  >
                    <option value="-1">&lt;&lt;Please Select&gt;&gt;</option>
                    {selectedMeasure.map((Item) => (
                      <option value={Item.value}> {Item.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-2 pl-1 pr-0">
                  <select
                    id="operator"
                    className={selectFilter == -1 ? "disabledFieldStyles" : ""}
                    disabled={selectFilter == -1}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ["operator"]: e.target.value,
                      }))
                    }
                  >
                    <option value="ge" selected>
                      &ge;
                    </option>
                    <option value="le">&le;</option>
                    <option value="gt">&gt;</option>
                    <option value="lt">&lt;</option>
                    <option value="eq">=</option>
                  </select>
                </div>
                <div className="col-2">
                  <input
                    type="text"
                    className={
                      selectFilter == -1
                        ? "disabledFieldStyles"
                        : showWarning
                          ? "warning"
                          : ""
                    }
                    disabled={selectFilter == -1 ? true : false}
                    value={
                      selectFilter == -1
                        ? ""
                        : formData.filterVal == "-1"
                          ? ""
                          : formData.filterVal
                    }
                    onChange={(e) => {
                      const inputValue = e.target.value;

                      const isValidInput = /^\d*$/.test(inputValue);
                      // && !inputValue.startsWith("0");
                      if (isValidInput) {
                        setFormData((prev) => ({
                          ...prev,
                          ["filterVal"]: e.target.value,
                        }));
                      }
                    }}
                    id="filterVal"
                    maxLength={3}
                    onKeyPress={(e) => {
                      e.key === "";
                    }}
                    onKeyDown={(e) =>
                      e.keyCode &&
                      (e.keyCode <= 47 || e.keyCode >= 58) &&
                      (e.keyCode < 96 || e.keyCode > 105) &&
                      e.keyCode != 8 &&
                      e.preventDefault()
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>

            {/* <div className="col-md-12">
              <FlatPrimeReactTable data={employeeData} />
            </div> */}
          </div>
        </CCollapse>
        {searching ? <Loader handleAbort={handleAbort} /> : ""}
      </div>
      <div className="col-12 p-0">
        <div className="col-12 row mr-0 pr-0 alloc-dash-excel-container">
          {msg && (
            <div className="sub-heading">
              <span style={{ fontWeight: "bold" }}>B </span>- Billable,{" "}
              <span style={{ fontWeight: "bold" }}>NB </span>- Non - Billable,{" "}
              <span style={{ fontWeight: "bold" }}>I</span> - Innovation,{" "}
              <span style={{ fontWeight: "bold" }}>O</span> - Others
            </div>
          )}
          {msg && (
            <div className="excel-container" align=" right ">
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
          )}
        </div>
        {
          showDashboardTable  ?  <DashboardAllocationTable
          maxHeight1={maxHeight1}
          viewBy={viewBy}
          data={tableData}
          expandedCols={["emp_cadre", "department", "supervisor"]}
          colExpandState={["0", "1", "name"]}
        />:null
        }
      </div>
    </div>
  );
}

export default DashboardAllocation;
