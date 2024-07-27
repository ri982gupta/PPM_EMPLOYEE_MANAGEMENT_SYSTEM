import Modal from "./Modal";
import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";

import MonthlyPRMaterialTable from "./MonthlyPRMaterialTable";
import Loader from "../Loader/Loader";
import { BiSearch } from "react-icons/bi";
import { CCollapse } from "@coreui/react";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import ExcelJS from "exceljs";

import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { environment } from "../../environments/environment";
import { SlExclamation } from "react-icons/sl";
import { AiFillWarning } from "react-icons/ai";
import { addMonths, startOfMonth, endOfMonth, isAfter } from "date-fns";
import { RiFileExcel2Line } from "react-icons/ri";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function MonthlyPRChangesByDay() {
  const baseUrl = environment.baseUrl;
  let flag = 3;
  var d = new Date();
  var year = d.getFullYear();
  var month1 = d.getMonth();
  var month = d.getMonth() - 1;
  const currentDate = new Date();
  const currentMonth = startOfMonth(currentDate);
  const [details, setDetails] = useState([]);
  // Determine the previous and next months based on the current date
  const [accountOwner, setAccountOwner] = useState([]);
  const [selectedAccountOwner, setSelectedAccountOwner] = useState([]);
  const [accountExecutive, setAccountExecutive] = useState([]);
  const [selectedAccountExecutive, setSelectedAccountExecutive] = useState([]);
  const dayOfMonth = currentDate.getDate();
  const previousMonth =
    dayOfMonth <= 10 ? addMonths(currentMonth, -1) : currentMonth;
  const nextMonth = dayOfMonth > 10 ? addMonths(currentMonth, 1) : currentMonth;
  const minDate = startOfMonth(previousMonth);
  const maxDate = endOfMonth(nextMonth);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const type = "roleWiseView";
  const [cslMultiselectDropdown, setcslMultiselectDropdown] = useState([]);
  const [dpMultiselectDropdown, setDpMultiselectDropdown] = useState([]);
  const [selectedCSL, setselectedCSL] = useState([]);
  const [searchDataCus, setSearchDataCus] = useState(-1);
  const [selectedDp, setselectedDp] = useState([]);
  const [engcompanyMultiselectDropdown, setEngcompanyMultiselectDropdown] =
    useState([]);
  const [search, setSearch] = useState(false);

  const [date, SetDate] = useState(new Date());
  const [selectedEngcompany, setEngcompany] = useState([]);
  const [scoreCardDataPayload, setscoreCardDataPayload] = useState({});
  const [columns, setColumns] = useState([]);
  const [resp, setResp] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const results1 = [];
  const loggedUserId = localStorage.getItem("resId");
  const abortController = useRef(null);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [custVisible, setCustVisible] = useState(false);
  const [custData, setcustData] = useState([]);
  const [show, setShow] = useState(false);
  const [dataAccess, setDataAccess] = useState([]);
  const [data2, setData2] = useState([]);
  const materialTableElement = document.getElementsByClassName("pageTitle");

  const maxHeight = useDynamicMaxHeight(materialTableElement);
  const obj = {
    customerIds: "-1",
    FromDate: new Date(),
    CSL: "-1",
    DP: "-1",
    EngCompany: "-1",
    showDelta: true,
    UserId: 512,
    ACC_OWN: -1,
    ACC_EXE: "-1",
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Revenue Metrics";
  let currentScreenName = ["Monthly PR Changes By Day"];

  useEffect(() => {
    getMenus();
  }, []);
  console.log(dataAccess);
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getMenus = () => {
    // setMenusData

    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const modifiedUrlPath = "/pmo/custPlRevProgress";
        getUrlPath(modifiedUrlPath);

        let getData = resp.data.map((menu) => {
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
        console.log(getData);
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
        const monthlyPRChnagesPerDaySubMenu = getData
          .find((item) => item.display_name === "Revenue Metrics")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Monthly PR Changes by Day"
          );
        console.log(monthlyPRChnagesPerDaySubMenu);
        // const marginSubMenu = getData
        // .find((item) => item.display_name === "Revenue Metrics")
        // .subMenus.find(
        //   (subMenu) => subMenu.display_name === "Revenue & Margin Analysis"
        // );
        // console.log(marginSubMenu.userRoles);
        // setMultiRoles(marginSubMenu.userRoles);
        const accessLevel = monthlyPRChnagesPerDaySubMenu
          ? monthlyPRChnagesPerDaySubMenu.userRoles.includes("919")
            ? 919
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("126")
            ? 126
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("686")
            ? 686
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("932")
            ? 932
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("690") &&
              monthlyPRChnagesPerDaySubMenu.userRoles.includes("46")
            ? 800
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("641") &&
              monthlyPRChnagesPerDaySubMenu.userRoles.includes("46")
            ? 700
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("690") &&
              monthlyPRChnagesPerDaySubMenu.userRoles.includes("641")
            ? 600
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("930") &&
              monthlyPRChnagesPerDaySubMenu.userRoles.includes("641")
            ? 500
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("930") &&
              monthlyPRChnagesPerDaySubMenu.userRoles.includes("690")
            ? 400
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("641")
            ? 641
            : monthlyPRChnagesPerDaySubMenu.userRoles == 690 &&
              monthlyPRChnagesPerDaySubMenu.userRoles == 641
            ? 620
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("690")
            ? 690
            : monthlyPRChnagesPerDaySubMenu.userRoles.includes("930") && 930
          : null;
        console.log(accessLevel, "----------------------&&&&&&7");
        if (accessLevel == 641) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getCustomersByCsl?loggedUserId=${loggedUserId}`
            )
            .then((resp) => {
              setcustData(resp.data);
            });
        } else if (accessLevel == 600) {
          axios
            .get(
              // dataAccess == 641 || dataAccess == 690
              //   ? baseUrl + `/CommonMS/master/geActiveCustomerList`
              //   :
              baseUrl +
                `/CommonMS/master/getCustomers?loggedUserId=${loggedUserId}`
            )
            .then((resp) => {
              const data = resp.data;
              setcustData(data);
            });
        } else if (accessLevel == 690) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getCustomersByDP?loggedUserId=${loggedUserId}`
            )
            .then((resp) => {
              setcustData(resp.data);
            });
        } else {
          axios
            .get(
              // dataAccess == 641 || dataAccess == 690
              baseUrl + `/CommonMS/master/geActiveCustomerList`
              //   :
              // baseUrl +
              //     `/CommonMS/master/getCustomers?loggedUserId=${loggedUserId}`
            )
            .then((resp) => {
              const data = resp.data;
              setcustData(data);
            });
        }
        // getProjectdata(accessLevel);
        setDataAccess(accessLevel);
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

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const [formData, setFormData] = useState(obj);
  const ref = useRef([]);

  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    if (name == "customerIds" && value == "select") {
      setFormData((prev) => {
        return { ...prev, [name]: value };
      });
      setCustVisible(true);
    }
    setcustData();
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  console.log(dataAccess);

  const handlesearch = () => {
    console.log(dataAccess);
    setTableData([]);
    setShow(false);
    let valid = GlobalValidation(ref);
    if (valid == true) {
      setValidationMessage(true);
    }
    if (valid) {
      return;
    }

    setValidationMessage(false);
    setOpen(true);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setSearch(true);
    // !valid && setVisible(!visible);
    // visible
    //   ? setCheveronIcon(FaChevronCircleUp)
    //   : setCheveronIcon(FaChevronCircleDown);
    abortController.current = new AbortController();
    console.log(formData.FromDate, "formData.FromDate.............");
    axios({
      method: "post",
      // url: baseUrl + `/ProjectMS/Engagement/getDPDropDownData?userId=19042`,
      url: baseUrl + `/ProjectMS/PlannedActivities/getPrChangesByDay`,
      // url: `http://localhost:8090/ProjectMS/PlannedActivities/getCustPlRevProgress`,
      signal: abortController.current.signal,
      data: {
        customerIds:
          formData.customerIds == 0
            ? 0
            : formData.customerIds == -1
            ? -1
            : selectedCust,
        FromDate: moment(formData.FromDate).format("yyyy-MM-DD"),
        // FromDate: "2023-06-28",
        // CSL: formData.CSL,
        CSL: formData.CSL,
        DP: searchDataCus,
        EngCompany: formData.EngCompany,
        showDelta: formData.showDelta,
        UserId: +loggedUserId,
        ACC_OWN: formData.ACC_OWN,
        ACC_EXE: allAccExe,
      },
    })
      .then((resp) => {
        setShow(true);
        setResp(resp.data);
        console.log("resp.data.tableData>", resp.data.tableData[2]);

        // Function to format the day as "1st", "2nd", "3rd", etc.
        // Function to format the day as "1st", "2nd", "3rd", "4th", etc.
        function formatDay(day) {
          if (day >= 11 && day <= 13) {
            return (
              <span>
                {day}
                <sup>th</sup>
              </span>
            );
          } else {
            const lastDigit = day % 10;
            const suffix =
              lastDigit === 1 ? (
                <sup>st</sup>
              ) : lastDigit === 2 ? (
                <sup>nd</sup>
              ) : lastDigit === 3 ? (
                <sup>rd</sup>
              ) : (
                <sup>th</sup>
              );
            return (
              <span>
                {day}
                {suffix}
              </span>
            );
          }
        }

        // Assuming resp.data.tableData[2] is an object
        if (typeof resp.data.tableData[2] === "object") {
          const objToTransform = resp.data.tableData[2];

          for (const key in objToTransform) {
            if (
              key.match(/\d{4}_\d{2}_\d{2}_plRev/) &&
              objToTransform[key] !== "Delta"
            ) {
              // Extract the day from the key
              const day = parseInt(objToTransform[key]);

              // Format the day as "1st", "2nd", "3rd", "4th", etc.
              const formattedDay = formatDay(day);

              // Update the value within the object, but only if it's not "Delta"
              objToTransform[key] = formattedDay;
            }
          }
        }

        // Now, resp.data.tableData[2] contains the updated values with formatted days
        console.log(resp.data.tableData[2]);
        setDetails(resp.data.tableData);
        const data = resp.data;
        let cols = resp.data.columns.replaceAll("'", "").split(",");
        setTableData(data);
        setColumns(cols);
        console.log(cols, "cols227");
        console.log(data, "data228");

        setLoader(false);
        clearTimeout(loaderTime);
        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (dataAccess == 641 || dataAccess == 690 || dataAccess == 600) {
      // getCsl();
      // getDp();
    }
  }, [dataAccess]);
  const [cslSpecific, setCslSpecific] = useState([]);
  const getCslSpecific = () => {
    axios
      .get(
        // ? baseUrl + `/CommonMS/master/getCSLDPAE?loggedUserId=${loggedUserId}`
        baseUrl + `/CommonMS/master/getCSLDPAE?loggedUserId=${loggedUserId}`
      )
      .then((resp) => {
        setCslSpecific(resp.data);
      });
  };
  useEffect(() => {
    getCslSpecific();
    getAccountOwner();
  }, []);

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
      setSelectedAccountOwner(custom);
    });
  };
  let allAccExe;
  const allAccExeArray = formData?.ACC_EXE?.split(",");
  allAccExe =
    allAccExeArray?.length === accountExecutive?.length
      ? "-1"
      : formData?.ACC_EXE;
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
  const getCsl = () => {
    console.log(dataAccess);
    axios
      .get(
        baseUrl + `/CommonMS/master/getCslDropDownData?userId=${loggedUserId}`
      )
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          let obj = {
            value: item.id,
            label: item.PersonName,
          };
          return obj;
        });
        dropdownOptions.push({ value: 999, label: "UnAssigned" });
        setcslMultiselectDropdown(dropdownOptions);
        setselectedCSL(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(dataAccess);

  const getDp = () => {
    console.log(dataAccess);
    axios
      .get(
        baseUrl + `/CommonMS/master/getDPDropDownData?userId=${loggedUserId}`
      )
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          let obj = {
            value: item.id,
            label: item.PersonName,
          };
          return obj;
        });
        dropdownOptions.push({ value: 999, label: "UnAssigned" });
        setDpMultiselectDropdown(dropdownOptions);
        setselectedDp(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getEngCompany();
    // getcustData();
    getCsl();
    getDp();
    getAccountExecutive();
  }, []);

  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();
  const getEngCompany = () => {
    axios({
      method: "get",
      // url: baseUrl + `/ProjectMS/Engagement/EngCompany`,
      url: baseUrl + "/ProjectMS/Engagement/EngCompany",
    })
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          let obj = {
            value: item.value,
            label: item.label,
          };
          return obj;
        });
        // dropdownOptions.unshift({ value: -1, label: "All" });
        setEngcompanyMultiselectDropdown(dropdownOptions);
        setEngcompany(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(columns, "columns.............");

  const [selectedItems, setSelectedItems] = useState([{}]);
  const customerIds = selectedItems?.map((d) => d?.id).toString();
  console.log(customerIds);
  useEffect(() => {}, [customerIds]);
  const onFilterChange = ({ id, value }) => {
    console.log(id + " " + value);
    setscoreCardDataPayload((prevState) => {
      return { ...prevState, [id]: value };
    });
    console.log(resp);
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  console.log(formData, "FormData.................");

  const exportExcel = () => {
    import("exceljs").then((ExcelJS) => {
      let desiredColumnOrder = [];
      let cols = [];
      cols = columns;

      if (!desiredColumnOrder.length) {
        desiredColumnOrder = cols;
      }

      const headers = Object.keys(details[0]);
      const detailsWithoutFirstLine = details.slice(1); // Remove the first line

      const wantedValues = detailsWithoutFirstLine.map((item) => {
        const obj = {};
        desiredColumnOrder.forEach((col) => {
          const value = item[col];
          if (typeof value === "string") {
            const [extractedValue, ,] = value.split("^&");
            obj[col] = extractedValue;
          } else if (value instanceof Object) {
            obj[col] = value.props.children[0];
          } else {
            obj[col] = parseFloat(value);
          }
        });
        return obj;
      });

      // Create an array of arrays where each array represents a row
      const rows = wantedValues.map((item) => {
        const row = [];
        desiredColumnOrder.forEach((col) => {
          const cell = item[col];
          row.push(cell);
        });
        return row;
      });

      rows.forEach((row, index) => {
        console.log(rows);
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        "Monthly Planned Revenue Changes By Day"
      );

      rows.forEach((row) => {
        console.log(row, "row");
        worksheet.addRow(row);
      });

      const boldRows = [1];
      boldRows.forEach((rowNumber) => {
        const row = worksheet.getRow(rowNumber);
        row.font = { bold: true };
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAsExcelFile(buffer, "Monthly Planned Revenue Changes By Day");
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
  const HelpPDFName = "MonthlyPRChangesByDay.pdf";
  const Headername = "Monthly PR Changes By Day";

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  return (
    <>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}></Modal>
      <div>
        {validationmessage ? (
          <div className="  statusMsg error">
            {" "}
            &nbsp;
            <span className="error-block">
              <AiFillWarning size="1.4em" strokeWidth={{ width: "100px" }} />{" "}
              &nbsp; Please select the valid values for highlighted fields.
            </span>
          </div>
        ) : (
          ""
        )}
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Monthly Planned Revenue Changes By Day</h2>
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

        <div className="group customCard">
          <div className="col-md-12 collapseHeader"></div>
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="customerIds">
                    Customer &nbsp;
                    <span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    {dataAccess == 919 ||
                    dataAccess == 126 ||
                    dataAccess == 686 ||
                    dataAccess == 930 ||
                    dataAccess == 932 ||
                    dataAccess == 931 ? (
                      <select
                        className="cancel Text"
                        name="customerIds"
                        id="customerIds"
                        onChange={handleChange1}
                      >
                        {selectedItems.length + "selected"}
                        <option value={-1} selected>
                          {" "}
                          &lt;&lt;All&gt;&gt;
                        </option>
                        <option value={0}>Active Customers</option>
                        <option value="select">Select</option>
                      </select>
                    ) : (
                      <select
                        className="cancel Text"
                        name="customerIds"
                        id="customerIds"
                        onChange={handleChange1}
                      >
                        {selectedItems.length + "selected"}
                        <option value="" selected>
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>

                        <option value="select">Select</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    CSL <span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6">
                    <div
                      style={{ zIndex: "6" }}
                      id="roleTypes"
                      className="multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      {/* {dataAccess == 641 ? (
                        <select>
                          <otion>123</otion>
                        </select>
                      ) : ( */}
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        options={cslMultiselectDropdown}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedCSL}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(s) => {
                          setselectedCSL(s);
                          let selected = s.map((item) => {
                            return item.value;
                          });
                          setFormData({
                            ...formData,
                            ["CSL"]: selected.toString(),
                          });
                          onFilterChange({
                            id: "CSL",
                            value: selected.toString(),
                          });
                        }}
                        ref={(ele) => {
                          ref.current[0] = ele;
                        }}
                      />
                      {/* )} */}
                    </div>
                  </span>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    DP<span className="error-text">*</span>{" "}
                  </label>
                  <span className="col-1 p-0">:</span>

                  <div className="col-6">
                    <div
                      id="businessUnit"
                      className=" multiselect"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="businessUnit"
                        options={dpMultiselectDropdown}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedDp}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setselectedDp(e);
                          let filterB = [];
                          e.forEach((d) => {
                            filterB.push(d.value);
                          });
                          // setFormData((prevVal) => ({
                          //     ...prevVal,
                          //     ["practiceId"]: filterPractice.toString(),
                          // }));
                          setSearchDataCus(filterB.toString());
                        }}
                        // onChange={(s) => {
                        //   setselectedDp(s);
                        //   let selected = s.map((item) => {
                        //     return item.value;
                        //   });
                        //   setFormData({
                        //     ...formData,
                        //     ["DP"]: selected.toString(),
                        //   });
                        //   onFilterChange({
                        //     id: "DP",
                        //     value: selected.toString(),
                        //   });
                        // }}
                      />
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    {" "}
                    Eng. Company<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>

                  <span className="col-6">
                    <div
                      id="businessUnit"
                      className="multiselect"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="businessUnit"
                        options={engcompanyMultiselectDropdown}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedEngcompany}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(s) => {
                          setEngcompany(s);
                          let selected = s.map((item) => {
                            return item.value;
                          });
                          setFormData({
                            ...formData,
                            ["EngCompany"]: selected.toString(),
                          });
                          onFilterChange({
                            id: "EngCompany",
                            value: selected.toString(),
                          });
                        }}
                      />
                    </div>
                  </span>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
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
                      id="ACC_OWN"
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
                          ["ACC_OWN"]: filteredValues.toString(),
                        }));
                        setValidationMessage(false);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor=" Account Executive">
                    Account Executive
                    <span className="required error-text ml-1">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="multiselect col-6"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="ACC_EXE"
                      options={accountExecutive}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedAccountExecutive}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedAccountExecutive(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });

                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["ACC_EXE"]: filteredValues.toString(),
                        }));
                        setValidationMessage(false);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    {" "}
                    Month<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span className="col-6" style={{ zIndex: "5" }}>
                    {console.log(date, "date...................")}
                    <DatePicker
                      dateFormat="MMM-yyyy"
                      showMonthYearPicker // Add this prop
                      minDate={minDate}
                      maxDate={maxDate}
                      selected={date}
                      onChange={(e) => {
                        const selectedDate = moment(e);
                        const currentDate = moment();

                        if (selectedDate.month() === currentDate.month()) {
                          selectedDate.date(currentDate.date());
                        }

                        SetDate(selectedDate.toDate());
                        setFormData((prev) => ({
                          ...prev,
                          ["FromDate"]: selectedDate.format("yyyy-MM-DD"),
                        }));
                      }}
                    />
                  </span>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center">
                <button className="btn btn-primary" onClick={handlesearch}>
                  <FaSearch /> Search
                </button>
              </div>
              {loader ? <Loader handleAbort={handleAbort} /> : ""}
            </div>
          </CCollapse>
          <div></div>

          <SelectCustDialogBox
            // dataAccess={dataAccess}
            visible={custVisible}
            setVisible={setCustVisible}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            flag={flag}
            dataAccess={dataAccess}
          />
        </div>

        <div>
          {open === true ? (
            <div style={{ position: "relative" }}>
              <div
                className="legendContainer mb-3"
                style={{
                  fontSize: "11px",
                  backgroundColor: "#ffffff",
                  paddingLeft: "5px",
                  paddingBottom: "5px",
                  paddingTop: "5px",
                  marginBottom: "0px",
                  border: "1px solid #f8e6c3",
                }}
              >
                <SlExclamation style={{ color: "#9d7c42" }} />
                <span
                  className="font-weight-bold"
                  style={{ color: "#9d7c42", fontSize: "13px" }}
                >
                  Delta = Current PR - Previous PR
                </span>
                <div className="legend green">
                  <div className="legendCircle" title="Positive Delta"></div>
                  <div
                    className="legendTxt"
                    style={{ color: "#9d7c42", fontSize: "13px" }}
                  >
                    Positive Delta
                  </div>
                  <div className="legend red">
                    <div className="legendCircle " title="Negative Delta"></div>
                    <div
                      className="legendTxt"
                      style={{ color: "#9d7c42", fontSize: "13px" }}
                    >
                      Negative Delta
                    </div>
                  </div>
                </div>
              </div>
              {search == true && (
                <div
                  className="excelIconContainer"
                  style={{ position: "absolute", top: 0, right: 0 }}
                >
                  {/* <div align="right"> */}
                  <RiFileExcel2Line
                    size="1.5em"
                    title="Export to Excel"
                    style={{ color: "green" }}
                    cursor="pointer"
                    onClick={exportExcel}
                  />
                </div>
              )}
              {/* </div> */}
              {show && (
                <MonthlyPRMaterialTable
                  data={tableData}
                  dataAccess={dataAccess}
                  expandedCols={["csl", "dp", "pm"]}
                  colExpandState={["0", "0", "dispName"]}
                  materialTableElement={materialTableElement}
                />
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default MonthlyPRChangesByDay;
