import React from "react";
import { ImSearch } from "react-icons/im";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { BsInfoCircle } from "react-icons/bs";
import { AiFillWarning } from "react-icons/ai";
import BillableUtilizationTrendCollapsibleTable from "./BillableUtilizationTrendCollapsibleTable";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import "../../App.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CCollapse } from "@coreui/react";
import Loader from "../Loader/Loader";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";

function BillableUtilisationTrend() {
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [loader, setLoader] = useState(false);
  const [searchp1, setSearchp1] = useState([]);
  const [details, setDetails] = useState([]);
  const ref = useRef([]);
  const [routes, setRoutes] = useState([]);
  let textContent = "Utilisation Metrics";
  let currentScreenName = ["Billable Utilization Trend"];

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getBreadCrumbs = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  useEffect(() => {
    getBreadCrumbs();
  }, []);

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  var d = new Date();
  var year = d.getFullYear();
  var month1 = d.getMonth();
  const [business, setBusiness] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [bunit, setBunit] = useState([]);
  const [countryids, setcountryids] = useState("6,5,3,8,7,1,2");
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [csl, setCsl] = useState([]);
  const [selectedcsl, setSelectedcsl] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [selectedcustomer, setSelectedcustomer] = useState([]);
  const [dp, setDp] = useState([]);
  const [selecteddp, setSelecteddp] = useState([]);
  const [columns, setColumns] = useState([]);
  const initialMonth = new Date();
  initialMonth.setFullYear(initialMonth.getFullYear() - 1);
  const [month, setMonth] = useState(initialMonth);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [durationOptions, setDurationOptions] = useState(12);
  const [Dmonth, setDmonth] = useState(moment(moment().startOf("month"))._d);
  var maxDate = new Date();
  const [dataAccess, setDataAccess] = useState([]);
  var year = maxDate.getFullYear();
  var month1 = maxDate.getMonth();
  var minDate = new Date(year, month1 - 11);
  var maxDate = new Date(year, month1 + 11);
  const [searchType, SetSearchType] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [resType, setRestype] = useState("-1");
  const [country, setCountry] = useState([]);
  const [respdata, setRespdata] = useState([]);
  const abortController = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState([]);

  // const[nextmonth,setnextmonth] = useState()
  const currentYear = new Date().getFullYear();
  // for table display

  let rows = 10;
  const previousYear = currentYear - 1;

  const initialValue = {
    BuIds: "",
    CountryIds: "",
    FromDate: "",
    Duration: "",
    searchType: "",
    resType: "-1",
    serarchVals: "",
    isExport: "0",
    UserId: loggedUserId,
  };
  const [formData, setFormData] = useState(initialValue);
  const FilterChangeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prevVal) => ({ ...prevVal, [id]: value }));
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
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

  const [data, setData] = useState({});
  const [isShow, setIsShow] = useState(false);
  const baseUrl = environment.baseUrl;

  const getMenus = () => {
    // setMenusData

    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const revenueForcastSubMenu = resp.data
          .find((item) => item.display_name === "Revenue Metrics")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Monthly Revenue Forecast"
          );
        const modifiedUrlPath = "/pmo/trend";
        getUrlPath(modifiedUrlPath);

        const accessLevel =
          revenueForcastSubMenu.userRoles.includes("690") &&
          revenueForcastSubMenu.userRoles.includes("641")
            ? 500
            : revenueForcastSubMenu.userRoles.includes("690")
            ? 690
            : revenueForcastSubMenu.userRoles.includes("641")
            ? 641
            : null;
        if (accessLevel == 690) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getCustomersByDP?loggedUserId=${loggedUserId}`
            )
            .then((Response) => {
              let CustomersList = [];
              let data = Response.data;
              data.length > 0 &&
                data.forEach((e) => {
                  let customerobj = {
                    label: e.fullName,
                    value: e.id,
                  };
                  CustomersList.push(customerobj);
                });

              setCustomer(CustomersList);
              setSelectedcustomer(CustomersList);
            })
            .catch((error) => console.log(error));
        } else if (accessLevel == 641) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getCustomersByCsl?loggedUserId=${loggedUserId}`
            )
            .then((Response) => {
              let CustomersList = [];
              let data = Response.data;
              data.length > 0 &&
                data.forEach((e) => {
                  let customerobj = {
                    label: e.fullName,
                    value: e.id,
                  };
                  CustomersList.push(customerobj);
                });

              setCustomer(CustomersList);
              setSelectedcustomer(CustomersList);
            })
            .catch((error) => console.log(error));
        } else {
          axios
            .get(baseUrl + `/ProjectMS/Engagement/customerdata`)
            .then((Response) => {
              let CustomersList = [];
              let data = Response.data;
              data.length > 0 &&
                data.forEach((e) => {
                  let customerobj = {
                    label: e.fullName,
                    value: e.id,
                  };
                  CustomersList.push(customerobj);
                });

              setCustomer(CustomersList);
              setSelectedcustomer(CustomersList);
            })
            .catch((error) => console.log(error));
        }

        if (accessLevel == 690 || accessLevel == 500) {
          axios
            .get(
              baseUrl + `/CommonMS/master/getDP?loggedUserId=${loggedUserId}`
            )

            .then((Response) => {
              let dpList = [];
              let data = Response.data;
              data.length > 0 &&
                data.forEach((e) => {
                  let dpobj = {
                    label: e.PersonName,
                    value: e.id,
                  };
                  dpList.push(dpobj);
                });
              setDp(dpList);
              setSelecteddp(dpList);
            });
        } else {
          axios
            .get(
              baseUrl +
                `/CommonMS/master/getDPDropDownData?userId=${loggedUserId}`
            )
            .then((Response) => {
              let dpList = [];
              let data = Response.data;
              data.length > 0 &&
                data.forEach((e) => {
                  let dpobj = {
                    label: e.PersonName,
                    value: e.id,
                  };
                  dpList.push(dpobj);
                });
              setDp(dpList);
              setSelecteddp(dpList);
            });
        }
        if (accessLevel == 641 || accessLevel == 500) {
          axios
            .get(
              baseUrl +
                `/CommonMS/master/getCSLDPAE?loggedUserId=${loggedUserId}`
            )

            .then((Response) => {
              let CSlList = [];
              let data = Response.data;
              data.length > 0 &&
                data.forEach((e) => {
                  let cslobj = {
                    label: e.PersonName,
                    value: e.id,
                  };
                  CSlList.push(cslobj);
                });
              setCsl(CSlList);
              setSelectedcsl(CSlList);
            })
            .catch((error) => console.log(error));
        } else {
          axios
            .get(
              baseUrl +
                `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`
            )
            .then((Response) => {
              let CSlList = [];
              let data = Response.data;
              data.length > 0 &&
                data.forEach((e) => {
                  let cslobj = {
                    label: e.PersonName,
                    value: e.id,
                  };
                  CSlList.push(cslobj);
                });
              setCsl(CSlList);
              setSelectedcsl(CSlList);
            })
            .catch((error) => console.log(error));
        }
        // baseUrl + `/CommonMS/master/getCSLDPAE?loggedUserId=${loggedUserId}`
        setDataAccess(accessLevel);
        console.log(accessLevel);
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
  const getBusinessUnit = () => {
    axios
      .get(
        baseUrl + `/CostMS/cost/getDepartments`
        // `http://localhost:8090/CostMS/cost/getDepartments`
      )
      .then((Response) => {
        let bussinessunits = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.label,
              value: e.value,
            };
            bussinessunits.push(countryObj);
          });
        setBusiness(bussinessunits);
        setBunit(bussinessunits);
        setSelectedBusiness(bussinessunits);
      })
      .catch((error) => console.log(error));
  };

  // const getcsl = () => {
  //   axios
  //     .get(
  //       baseUrl +
  //         `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`
  //     )
  //     .then((Response) => {
  //       let CSlList = [];
  //       let data = Response.data;
  //       data.length > 0 &&
  //         data.forEach((e) => {
  //           let cslobj = {
  //             label: e.PersonName,
  //             value: e.id,
  //           };
  //           CSlList.push(cslobj);
  //         });
  //       setCsl(CSlList);
  //       setSelectedcsl(CSlList);
  //     })
  //     .catch((error) => console.log(error));
  // };

  const getCountry = () => {
    axios.get(baseUrl + `/CommonMS/master/getCountries`).then((Response) => {
      let countryList = [];
      let data = Response.data;
      data.length > 0 &&
        data.forEach((e) => {
          let countryobj = {
            label: e.country_name,
            value: e.id,
          };
          countryList.push(countryobj);
        });
      const sortedCountryList = countryList.slice().sort((a, b) => {
        return a.label.localeCompare(b.label);
      });

      setCountry(sortedCountryList);
      setSelectedCountry(sortedCountryList);
    });
  };

  const handleClick = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setValidationMessage(true);
        setTimeout(() => {
          setValidationMessage(false);
        }, 3000);
      }
      return;
    }
    if (valid) {
      return;
    }

    getData();
  };

  const lastYearDate = moment().subtract(1, "year");

  const currentDate = lastYearDate.date(1).format("YYYY-MM-DD");

  // const currentDate = moment(new Date()).format("YYYY-MM-01");
  const getData = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setLoader(false);
    const data = {
      BuIds: bunit.map((d) => d.value).toString(),
      CountryIds: countryids,
      FromDate:
        formData.month == "" || formData.month == undefined
          ? currentDate
          : formData.month,
      Duration: selectedDuration,
      searchType: searchType,
      resType: resType,
      serarchVals: searchp1,
      isExport: "0",
      UserId: loggedUserId,
    };

    // for searchvals
    if (searchType == "CSL") {
      data["serarchVals"] = selectedcsl.map((d) => d.value).toString();
    } else if (searchType == "DP") {
      data["serarchVals"] = selecteddp.map((d) => d.value).toString();
    } else {
      data["serarchVals"] = selectedcustomer.map((d) => d.value).toString();
    }
    setIsShow(false);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url:
        baseUrl +
        `/UtilityMS/BillableUtilizationTrend/getbilliableUtilizationTrend`,
      data: data,
      signal: abortController.current.signal,
    })
      .then((res) => {
        let detail = res.data.tableData;
        let cols = res.data.columns?.replaceAll("'", "").split(",");
        let fdata = res.data;
        setDetails(detail);
        setData(res.data);
        setColumns(cols);
        setLoader(false);
        clearTimeout(loaderTime);
        setIsShow(true);
        let valid = GlobalValidation(ref);
        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  useEffect(() => {}, [data]);

  useEffect(() => {
    getBusinessUnit();
    getMenus();
    // getCustomer();
    // getcsl();
    // getdp();
    getCountry();
  }, []);

  const handleMonthChange = (selectedMonth) => {
    const currentMonth = new Date();
    const monthsDiff =
      (selectedMonth.getFullYear() - currentMonth.getFullYear()) * 12 +
      (selectedMonth.getMonth() - currentMonth.getMonth());

    if (monthsDiff < 0) {
      setDurationOptions(12);
    } else {
      setDurationOptions(12 - monthsDiff);
    }
    setFormData((prev) => ({
      ...prev,
      ["month"]: moment(selectedMonth).format("yyyy-MM-DD"),
    }));
    setMonth(selectedMonth);
    setSelectedDuration("");
  };
  var d = new Date();
  var year = d.getFullYear();
  var month1 = d.getMonth();
  var c = new Date(year + 1, month1);
  var E = new Date(year - 5, month1);
  const handleOnExport = () => {
    import("exceljs").then((ExcelJS) => {
      let desiredColumnOrder = [];
      let cols = [];
      cols = columns;
      if (!desiredColumnOrder.length) {
        desiredColumnOrder = cols;
      }
      const columnsToExclude = [
        "id",
        "empStatus",
        "resourceId",
        "cslId",
        "DpId",
        "customerId",
        "projectId",
        "lvl",
        "keyAttr",
      ];
      desiredColumnOrder = desiredColumnOrder.filter(
        (col) => !columnsToExclude.includes(col)
      );
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
            console.log(value === null);
            obj[col] = value === null ? "" : parseFloat(value);
            console.log(obj[col]);
          }
        });
        return obj;
      });
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("ResourceAllocationTrendTable");
      const uniqueRows = new Set();
      wantedValues.forEach((row) => {
        const key = JSON.stringify(row);
        if (!uniqueRows.has(key)) {
          uniqueRows.add(key);
          worksheet.addRow(Object.values(row));
        }
      });
      const boldRows = [1];
      boldRows.forEach((rowNumber) => {
        const row = worksheet.getRow(rowNumber);
        row.font = { bold: true };
      });
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAsExcelFile(buffer, "ResourceAllocationTrendTable");
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
          <AiFillWarning />
          Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Billable Utilization Trend</h2>
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

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 ">
              <div className="form-group row">
                <label className="col-5" htmlFor="searchType">
                  Business Unit&nbsp;
                  <span className="col-1 p-0 error-text"> *</span>
                </label>
                <span className="col-1 ">:</span>

                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="BuIds"
                    value={bunit}
                    options={business}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    valueRenderer={generateDropdownLabel}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedBusiness(s);
                      setBunit(s);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="searchType">
                  Search Type&nbsp;<span className=" error-text"> *</span>
                </label>
                <span className="col-1 ">:</span>
                <div className=" col-6">
                  <select
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                    className="error enteredDetails cancel text"
                    onChange={(e) => {
                      SetSearchType(e.target.value);
                    }}
                  >
                    <option value="">{"<<Please Select>>"}</option>
                    <option value="Customer">Customer</option>
                    {dataAccess == 690 ? "" : <option value="CSL">CSL</option>}
                    {dataAccess == 641 ? (
                      ""
                    ) : (
                      <option value="DP">Delivery Partner</option>
                    )}
                  </select>
                </div>
                {/* <div className=" col-6">
                  <select
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                    className="error enteredDetails cancel text"
                    id="SearchType"
                    name="searchType"
                    onChange={(e) => {
                      SetSearchType(e.target.value);
                    }}
                  >
                    <option value="">{"<<Please Select>>"}</option>
                    <option value="Customer" selected>
                      Customer
                    </option>
                    <option value="CSL">CSL</option>
                    <option value="DP">Delivery Partner</option>
                  </select>
                </div> */}
              </div>
            </div>
            {searchType == "CSL" ? (
              <div className=" col-md-3 ">
                <div className="form-group row">
                  <label className="col-5" htmlFor="searchType">
                    CSL&nbsp;
                    <span className="col-1 p-0 error-text"> *</span>
                  </label>
                  <span className="col-1 ">:</span>
                  <div className="col-6">
                    <div
                      className="multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="CSL"
                        value={selectedcsl}
                        options={csl}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedcsl(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });
                          setSearchp1(filteredValues.toString());
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {searchType == "DP" ? (
              <div className=" col-md-3 ">
                <div className="form-group row">
                  <label className="col-5" htmlFor="searchType">
                    Delivery Partner&nbsp;
                    <span className="col-1 p-0 error-text"> *</span>
                  </label>
                  <span className="col-1 ">:</span>
                  <div className="col-6">
                    <div
                      className="multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="dp"
                        value={selecteddp}
                        valueRenderer={generateDropdownLabel}
                        options={dp}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        disabled={false}
                        onChange={(s) => {
                          setSelecteddp(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });
                          setSearchp1(filteredValues.toString());
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {searchType == "Customer" ? (
              <div className=" col-md-3 ">
                <div className="form-group row">
                  <label className="col-5" htmlFor="searchType">
                    Customer&nbsp;
                    <span className="col-1 p-0 error-text"> *</span>
                  </label>
                  <span className="col-1 ">:</span>
                  <div className="col-6">
                    <div
                      className="multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="Customer"
                        valueRenderer={generateDropdownLabel}
                        value={selectedcustomer}
                        options={customer}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedcustomer(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });
                          setSearchp1(filteredValues.toString());
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5 " htmlFor="resType">
                  Res. Type
                </label>
                <span className="col-1  p-0">:</span>
                <div className="col-6">
                  <select
                    id="resType"
                    onChange={(e) => {
                      setRestype(e.target.value);
                    }}
                  >
                    <option value="null">&lt;&lt; All &gt;&gt;</option>
                    <option value="fte">Employee</option>
                    <option value="subK">Contractor</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resLocation">
                  Res. Location&nbsp;
                  <span className=" error-text"> *</span>
                </label>
                <span className="col-1">:</span>
                <div
                  className=" multiselect col-6"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="CountryIds"
                    valueRenderer={generateDropdownLabel}
                    value={selectedCountry}
                    options={country}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedCountry(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });
                      setcountryids(filteredValues.toString());
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="startMonth">
                  Start Month
                </label>
                <span className="col-1">:</span>
                <div className="col-6" style={{ zIndex: "3" }}>
                  <DatePicker
                    id="month"
                    selected={month}
                    maxDate={c}
                    minDate={E}
                    onChange={handleMonthChange}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration&nbsp; <span className="error-text"> *</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                    className="error enteredDetails cancel text"
                    id="duration"
                    name="duration"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {[...Array(durationOptions)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/*--------------------------- Save Button --------------------------*/}
          <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
            <button
              className="btn btn-primary"
              type="submit"
              onClick={handleClick}
            >
              <ImSearch /> Search
            </button>
          </div>
        </CCollapse>
        {loader ? <Loader handleAbort={handleAbort} /> : ""}
      </div>
      {isShow == true ? (
        <div className="col-12">
          <>
            {/* {"" + Object.keys(data).length} */}
            <div className="col-mt-12" style={{ height: "10px" }}>
              <div>
                <span>
                  <span
                    style={{ color: "#9d7c42", fontStyle: "italic" }}
                    className="mb-5"
                  >
                    <BsInfoCircle /> All numbers are in hours
                  </span>
                </span>
              </div>
            </div>
            <div className="mb-2" align="right">
              <RiFileExcel2Line
                size="1.5em"
                title="Export to Excel"
                style={{ color: "green", float: "right" }}
                cursor="pointer"
                onClick={handleOnExport}
              />
              <br />
            </div>
            <BillableUtilizationTrendCollapsibleTable
              data={data}
              expandedCols={["csl", "dp", "customer", "projects"]}
              colExpandState={["0", "0", "name"]}
            />
          </>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
export default BillableUtilisationTrend;
