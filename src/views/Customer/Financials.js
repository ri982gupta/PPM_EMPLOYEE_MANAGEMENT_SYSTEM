import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import "../FullfimentComponent/ResourceOverviewTable.scss";
import {
  FaChevronCircleDown,
  FaChevronCircleLeft,
  FaChevronCircleRight,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import FinancialsTable from "./FinancialsTable";
import { SystemUpdateOutlined } from "@material-ui/icons";
import MaterialReactTable from "material-react-table";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Loader from "../Loader/Loader";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
function Financials(props) {
  const {
    customerId,
    urlState,
    setUrlState,
    setButtonState,
    buttonState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
  } = props;
  const ref = useRef([]);
  const [validationMessage, setValidationMessage] = useState(false);

  const baseUrl = environment.baseUrl;
  const currentYear = new Date().getFullYear();
  const [loader, setLoader] = useState(false);
  const firstDayOfYear = new Date(currentYear, 0, 1);
  var firstmonth = firstDayOfYear.getMonth() + 1;

  var currmonth = new Date().getMonth() + 1;
  const diff = currmonth - 6;
  var smonth;

  if (diff < 0) {
    smonth = new Date(currentYear, 0, 1);
  } else {
    smonth = new Date(currentYear, diff, 1);
  }

  const [startDate, setStartDate] = useState(smonth);
  const [duration, setDuration] = useState();
  const currentMonth = new Date().getMonth() + 1;
  const [durationn, setDurationn] = useState(6);

  // useEffect(() => {
  //   setDurationn()
  // }, [durationn])
  const [TabData, setTabData] = useState();
  const [NoTabData, setNoTabData] = useState();
  // const calculateDuration = (e) => {
  //   let startMonths = getAbsoluteMonths(e);
  //   const year = startMonths.year;
  //   let endMonths = getAbsoluteMonths(moment());

  //   if (year !== endMonths.year) {
  //     const startOfYear = moment().startOf('year');
  //     const startOfYearMonths = getAbsoluteMonths(startOfYear);
  //     let monthDifference = endMonths - startOfYearMonths;
  //   }
  //   let monthDifference = endMonths - startMonths;
  //   monthDifference += 1;
  //   let dr = [];
  //   for (let i = 1; i <= monthDifference; i++) {
  //     dr.push(i);
  //   }
  //   setDuration(dr);
  // };

  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Financials", "Customer Gross Margin Analysis"];
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

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Financial Plan & Review"
        ),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const calculateDuration = (e) => {
    const startMonths = getAbsoluteMonths(e);
    const endMonths = getAbsoluteMonths(moment());
    const givenDate = new Date(e);
    const givenYear = givenDate.getFullYear();

    const currentYear = new Date().getFullYear();

    let monthDifference;
    if (givenYear !== currentYear) {
      monthDifference = 5;
    } else if (endMonths.totalMonths - startMonths.totalMonths > 5) {
      // monthDifference = endMonths.totalMonths - startMonths.totalMonths;
      monthDifference = 5;
    } else {
      monthDifference = endMonths.totalMonths - startMonths.totalMonths;
    }

    monthDifference += 1;
    let dr = [];
    for (let i = 1; i <= monthDifference; i++) {
      dr.push(i);
    }

    setDuration(dr);
  };
  const initialValue = {
    ownerDivisions: -1,
    month: moment(startDate).format("yyyy-MM-DD"),
    duration: duration,
    countries: -1,
    searchType: "Customer",
    busUnits: -1,
    customers: customerId,
    srcType: -1,
    srcTypeId: -1,
    tarType: "Customer",
    busUnitId: -1,
    custId: -1,
    prjId: -1,
    resId: -1,
    measures: -1,
    salesExecId: -1,
    salesExecs: -1,
    sortBy: -1,
    custCountries: -1,
    resTyp: -1,
    source: -1,
    engCountries: -1,
    contTerms: -1,
    engComp: -1,
    cslRes: -1,
    cslResId: -1,
    dpRes: -1,
    dpResId: -1,
    indTypes: -1,
    indTypesId: -1,
  };
  const [searchdata, setSearchdata] = useState(initialValue);
  const [project, setProject] = useState([]);
  const abortController = useRef(null);
  const [value, onChange] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [visibleFilters, setVisibleFilters] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [month, setMonth] = useState(moment(moment().subtract(5, "months"))._d);
  const [tableData, setTableData] = useState(null);
  const [displayTableState, setDisplayTableState] = useState(false);
  const [tableKeys, setTableKeys] = useState([]);
  const [resources, setResources] = useState([]);
  const [resources1, setResources1] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [vendorData, setvendorData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const getAbsoluteMonths = (momentDate) => {
    let mont = Number(moment(momentDate).format("MM"));
    let yea = Number(moment(momentDate).format("YYYY"));
    let totalMonths = mont + yea * 12;

    return {
      totalMonths: totalMonths,
      year: Math.floor(totalMonths / 12),
      month: totalMonths % 12,
    };
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  // useEffect(() => {
    // setLoader(false);
    // setTimeout(() => {
    //   setDurationn(6);
    //   handleSearch();
    // }, 3000);
  // }, []);

  useEffect(() => {
    calculateDuration(month);
  }, []);

  const getCustomerdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getNewCustomerList`,
    }).then(function (response) {
      var resp = response.data;
      setCustomer(resp);
    });
  };

  const getResourcesdata1 = () => {
    axios({
      method: "get",

      url: baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getResources`,
    }).then(function (response) {
      var resp = response.data;

      setResources1(resp);
    });
  };

  const getResourcesdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getResources`,
    }).then(function (response) {
      var resp = response.data;
      setResources(resp);
    });
  };

  const getProjectdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getProjects`,
    }).then(function (response) {
      var resp = response.data;
      setProject(resp);
    });
  };

  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`, //13
    });

    let departments = resp.data;
    departments = departments.filter((ele) => ele.value >= 0);

    setDepartments(departments);

    // setSelectedDepartments(departments.filter((ele) => ele.value >= 0));

    let filteredDeptData = [];

    departments.forEach((data) => {
      filteredDeptData.push(data.value);
    });

    setSearchdata((prevVal) => ({
      ...prevVal,

      ["busUnits"]: filteredDeptData.toString(),
    }));
  };

  useEffect(() => {
    getCustomerdata();
    getResourcesdata();
    getProjectdata();
    getDepartments();
    getResourcesdata1();
  }, []);

  const handleSearch = (e) => {
    setTableData([]);
    setDisplayTableState(false)
    // setTableKeys([])
    abortController.current = new AbortController();
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMessage(true);

      // setTimeout(() => {
      //   setValidationMessage(false);
      // }, 3000);

      return;
    }

    setValidationMessage(false);
    // !valid && setVisible(!visible);
    // visible
    //   ? setCheveronIcon(FaChevronCircleUp)
    //   : setCheveronIcon(FaChevronCircleDown);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + "/customersms/Financials/getFinancials",
      //url: 'http://localhost:8099/customersms/Financials/getFinancials',
      data: {
        ownerDivisions: -1,
        month: moment(startDate).format("yyyy-MM-DD"),
        duration: durationn,
        countries: -1,
        searchType: "Customer",
        busUnits: -1,
        customers: customerId,
        srcType: -1,
        srcTypeId: -1,
        tarType: "Customer",
        busUnitId: -1,
        custId: -1,
        prjId: -1,
        resId: -1,
        measures: -1,
        salesExecId: -1,
        salesExecs: -1,
        sortBy: -1,
        custCountries: -1,
        resTyp: -1,
        source: -1,
        engCountries: -1,
        contTerms: -1,
        engComp: -1,
        cslRes: -1,
        cslResId: -1,
        dpRes: -1,
        dpResId: -1,
        indTypes: -1,
        indTypesId: -1,
      },
    })
      .then((res) => {
        let respData = res.data.data;
        const plannedRevenueData = respData.filter(
          (obj) => obj.descr === "Planned Revenue" && obj.name !== ""
        );

        setTableData(plannedRevenueData);
        setDisplayTableState(true);
        setResources(respData);
        setNoTabData(res.data.data);
        // plset();
        clearTimeout(loaderTime);
        setLoader(false);
        // !valid && setVisible(!visible);
        // visible
        //   ? setCheveronIcon(FaChevronCircleUp)
        //   : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((e) => {
        setLoader(false);
      });

    axios({
      method: "post",
      url: baseUrl + "/customersms/Financials/getvendors",
      data: {
        month: moment(startDate).format("yyyy-MM-DD"),
        duration: durationn,
        customers: customerId,
      },
    })
      .then((response) => {
        const apiData = response.data;
        // const tabData = [
        //   {
        //     vendor: apiData.vendor_name,
        //     id: apiData.id,
        //     total: apiData.Total,
        //     ...Object.entries(apiData).reduce((acc, [key, value]) => {
        //       if (key !== "vendor_name" && key !== "closed_amount") {
        //         acc[key] = value;
        //       }
        //       return acc;
        //     }, {})
        //   },
        // ];
        setTabData(apiData ? [apiData] : []);
        setvendorData("");
      })
      .catch();
  };

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
        });
        const formattedDateB = dateB.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
        return formattedDateA.localeCompare(formattedDateB);
      });
      if (!sortedKeys.includes("Total")) {
        sortedKeys.push("Total");
      }
      setTableKeys(sortedKeys);
    } else if (NoTabData && NoTabData[0]) {
      const keysToInclude = ["name", "kpi"].concat(
        Object.keys(NoTabData[0]).filter((key) =>
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
        });
        const formattedDateB = dateB.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
        return formattedDateA.localeCompare(formattedDateB);
      });
      if (!sortedKeys.includes("Total")) {
        sortedKeys.push("Total");
      }
      setTableKeys(sortedKeys);
    }
  }, [tableData, NoTabData]);
  const maxDate = new Date();
  const renderColumns = () => {
    if (TabData.length === 0) {
      return null;
    }

    const dateKeys = Object.keys(TabData[0])
      .filter((key) => key.match(/^\d{4}_\d{2}_\d{2}$/)) // Filter date keys in the format 'YYYY_MM_DD'
      .sort(); // Sort date keys in ascending order

    const columns = [];

    // Check if all cells have null values

    columns.push(<Column key="vendor" header="Vendor" />);

    // Add blank column
    columns.push(<Column key="blank" field="" header="" />);

    dateKeys.forEach((dateKey, index) => {
      const columnStyle = {
        minWidth: "60px",
        maxWidth: "60px",
        backgroundColor:
          index === dateKeys.length - 1 ? "aliceblue" : "transparent",
      };
      columns.push(
        <Column
          key={dateKey}
          field={dateKey}
          header={formatDateKey(dateKey)}
          style={columnStyle}
        />
      );
    });

    // Add Total column
    columns.push(<Column key="total" field="Total" header="Total" />);

    return columns;
  };

  const formatDateKey = (dateKey) => {
    const parts = dateKey.split("_");
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const monthName = new Date(year, month - 1, 1).toLocaleString("default", {
      month: "short",
    });
    return `${monthName}-${year}`;
  };

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <ul className="tabsContainer">
              <li>
                {/* {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )} */}
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp2Items[0]?.display_name != undefined ? (
                  <span>{grp2Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Planning</span> */}
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp3Items[0]?.display_name != undefined ? (
                  <span>{grp3Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Monitoring</span> */}
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp4Items[0]?.display_name != undefined ? (
                  <span>{grp4Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Financials</span> */}
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
          <div className="childTwo">
            <h2>Customer Gross Margin Analysis</h2>
          </div>
          <div className="childThree toggleBtns">
            <button
              className="searchFilterButton btn btn-primary"
              onClick={() => {
                setVisibleFilters(!visibleFilters);

                visibleFilters
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

      {validationMessage ? (
        <div className="statusMsg error">
          <span className="error-block">
            <AiFillWarning /> &nbsp; Please select valid values for highlighted
            fields
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visibleFilters}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="fy">
                  Start Month <span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                  // className=" datepicker col-6"
                  // ref={(ele) => {
                  //   ref.current[0] = ele;
                  // }}
                  >
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        calculateDuration(date);
                        setMonth(date);
                        setDurationn("");
                        setSearchdata((prev) => ({
                          ...prev,
                          duration: "",
                        }));
                      }}
                      maxDate={maxDate}
                      dateFormat="MMM-yyyy"
                      showMonthYearPicker
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration <span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="error enteredDetails cancel text"
                    id="duration"
                    value={durationn}
                    onChange={(event) => {
                      setDurationn(event.target.value);
                    }}
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <option value="">&lt;&lt; Please Select &gt;&gt;</option>
                    {duration?.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  handleSearch();
                }}
              >
                <FaSearch /> Search{" "}
              </button>
              <div>{loader ? <Loader handleAbort={handleAbort} /> : ""}</div>
            </div>
          </div>
        </CCollapse>
        {/* <div> <FaChevronCircleRight style={{ float: "right" }}
          onClick={() => {

            handleSearch("plus");
          }}
        />
          <FaChevronCircleLeft style={{ float: "right" }}
            onClick={() => {

              handleSearch("minus");
            }}
          />

        </div> */}
      </div>
      <div>
        {" "}
        {displayTableState && (
          <FinancialsTable
            startDate={moment(startDate).format("yyyy-MM-DD")}
            duration={durationn}
            customerId={customerId}
            tableData={tableData}
            column={tableKeys}
            month={month}
            searchdata={searchdata}
            customer={customer}
            resources={resources1}
            departments={departments}
            project={project}
          />
        )}
      </div>
      <br></br>
      <div className="primeReactDataTable darkHeader">
        {displayTableState && (
          <div className=" primeReactDataTable financialSecondTable">
            <DataTable
              className="resourceOverviewEmp"
              stripedRows
              showGridlines
              value={vendorData}
              emptyMessage="No Data Found"
            >
              {renderColumns()}
            </DataTable>
          </div>
        )}
      </div>
    </div>
  );
}

export default Financials;
