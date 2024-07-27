import React, { useRef, useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import moment from "moment";
import axios from "axios";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import { AiFillWarning } from "react-icons/ai";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import MaterialReactCollapisbleTable from "../PrimeReactTableComponent/MaterialReactCollapisbleTable";
import { RiFileExcel2Line } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
import ExcelJS from "exceljs";

function EngagementAllocations() {
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [business, setBusiness] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [details, setDetails] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [columns, setColumns] = useState([]);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState(false);
  const [dataAccess, setDataAccess] = useState([]);
  const [data2, setData2] = useState([]);
  const [accessdata, setAccessdata] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [tableVisible, setTableVisible] = useState(false);
  console.log(loader, "loader");
  console.log(tableVisible, "tableVisible");
  const ref = useRef([]);
  let flag = 1;
  const abortController = useRef(null);

  const filterMondays = (date) => {
    return date.getDay() === 1;
  };

  const getCurrentMonday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  };
  const defaultDate = getCurrentMonday();

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const initialValue = {
    businessUnit: "-1",
    customer: "",
    StartDt: moment(selectedDate).format("yyyy-MM-DD"),
    duration: "1",
    isExport: "0",
  };

  const [state, setState] = useState(initialValue);
  const [tableData, setTableData] = useState([]);

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const getBusinessUnit = () => {
    axios.get(baseUrl + `/CostMS/cost/getDepartments`).then((Response) => {
      let countries = [];
      let data = Response.data;
      data.length > 0 &&
        data.forEach((e) => {
          let countryObj = {
            label: e.label,
            value: e.value,
          };
          countries.push(countryObj);
        });
      setBusiness(countries);
      setSelectedBusiness(countries);
    });
  };

  const dropdown = document.getElementById("customer");
  if (dropdown) {
    const handleChange = () => {
      const selectedOption = dropdown.options[dropdown.selectedIndex];
      if (selectedOption) {
        const selectedOptionTitle = selectedOption.getAttribute("title");
        dropdown.setAttribute("title", selectedOptionTitle);
      } else {
        dropdown.removeAttribute("title");
      }
    };

    dropdown.addEventListener("change", handleChange);
  }

  const getTableData = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setValidationMessage(true);
      }
      return;
    }
    if (valid) {
      return;
    }
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    setSearch(true);
    setTableVisible(false);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url:
        baseUrl +
        `/administrationms/engagementallocation/getengagementallocationtable?bu=${state.businessUnit}&customerId=${state.customer}&fromWeek=${state.StartDt}&dur=${state.duration}&isExport=0&userId=${loggedUserId}`,
      signal: abortController.current.signal,
    }).then((res) => {
      let detail = res.data.tableData;
      let cols = res.data.columns?.replaceAll("'", "").split(",");
      setDetails(detail);
      setTableData(res.data);
      setColumns(cols);
      setLoader(false);
      clearTimeout(loaderTime);
      setTableVisible(true);
      setValidationMessage(false);

      !valid && setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Engagement Allocations"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const getMenus = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const modifiedUrlPath = "/executive/engagementDashboard";
        getUrlPath(modifiedUrlPath);

        const getData = resp.data;
        const deliveryItem = getData[7]; // Assuming "Delivery" item is at index 7

        const desiredOrder = [
          "Engagements",
          "Projects",
          "Engagement Allocations",
          "Project Health",
          "Project Status Report",
        ];

        const sortedSubMenus = deliveryItem.subMenus.sort((a, b) => {
          const indexA = desiredOrder.indexOf(a.display_name);
          const indexB = desiredOrder.indexOf(b.display_name);
          return indexA - indexB;
        });
        deliveryItem.subMenus = sortedSubMenus;
        console.log(sortedSubMenus);
        //  setData2(sortedSubMenus);

        const filteredItems = getData.filter((item) => {
          if (item.subMenus) {
            return item.subMenus.some(
              (subItem) => subItem.display_name === "Engagement Allocations"
            );
          }
          return false;
        });
        getData.forEach((item) => {
          if (item.display_name === textContent) {
            setRoutes([item]);
            sessionStorage.setItem("displayName", item.display_name);
          }
        });

        const engagementAllocationSubMenu = getData
          .find((item) => item.display_name === "Delivery")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Engagement Allocations"
          );

        setAccessdata(engagementAllocationSubMenu.access_level);
        // Extract the access_level value
        const accessLevel = engagementAllocationSubMenu
          ? engagementAllocationSubMenu.userRoles.includes("919")
            ? 919
            : engagementAllocationSubMenu.userRoles.includes("126")
            ? 126
            : engagementAllocationSubMenu.userRoles.includes("686")
            ? 686
            : engagementAllocationSubMenu.userRoles.includes("690")
            ? 690
            : engagementAllocationSubMenu.userRoles.includes("641")
            ? 641
            : engagementAllocationSubMenu.userRoles.includes("428")
            ? 428
            : engagementAllocationSubMenu.userRoles.includes("46")
            ? 46
            : engagementAllocationSubMenu.userRoles.includes("930") && 930
          : null;
        console.log(accessLevel);
        if (accessLevel == 690 || accessLevel == 641 || accessLevel == 930) {
          axios
            .get(
              baseUrl +
                `/dashboardsms/allocationDashboard/getCustomers?loggedUserId=${loggedUserId}`
            )
            .then((res) => {
              let custom = res.data;
              const filteredData = custom.filter(
                (item) => item.id !== 81084541
              );
              setCustomer(filteredData);
            });
        } else if (accessLevel == 428) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsforProjectCoordinate?userId=${loggedUserId}`
            )
            .then((res) => {
              let custom = res.data;
              const filteredData = custom.filter(
                (item) => item.id !== 81084541
              );
              setCustomer(filteredData);
            });
        } else if (flag == 1 && accessLevel == 46) {
          axios
            .get(
              baseUrl +
                `/ProjectMS/project/getProjectsforProjectCoordinate?userId=${loggedUserId}`
            )
            .then((res) => {
              let custom = res.data;
              const filteredData = custom.filter(
                (item) => item.id !== 81084541
              );
              setCustomer(filteredData);
            });
        } else {
          axios
            .get(baseUrl + `/customersms/Customers/getCustomers`)
            .then((res) => {
              let custom = res.data;
              const filteredData = custom.filter(
                (item) => item.id !== 81084541
              );
              setCustomer(filteredData);
            });
        }
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

  useEffect(() => {
    getBusinessUnit();
    getMenus();
    // handleCustomer();
  }, []);

  // const handleCustomer = () => {
  //   axios
  //     .get(
  //       dataAccess == 641 || dataAccess == 690 || dataAccess == 930
  //         ? baseUrl +
  //             `/dashboardsms/allocationDashboard/getCustomers?loggedUserId=${loggedUserId}`
  //         : dataAccess == 428
  //         ? baseUrl +
  //           `/ProjectMS/project/getProjectsforProjectCoordinate?userId=${loggedUserId}`
  //         : flag == 1 && dataAccess == 46
  //         ? baseUrl +
  //           `/CommonMS/master/getPMCustomers?loggedUserId=${loggedUserId}`
  //         : baseUrl + `/customersms/Customers/getCustomers`
  //     )
  //     .then((res) => {
  //       let custom = res.data;
  //       const filteredData = custom.filter((item) => item.id !== 81084541);
  //       setCustomer(filteredData);
  //     });
  // };
  useEffect(() => {}, []);
  useEffect(() => {
    if (
      dataAccess == 641 ||
      dataAccess == 690 ||
      dataAccess == 930 ||
      dataAccess == 46
    ) {
      // handleCustomer();
    }
  }, [dataAccess]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => {
      return { ...prev, [name]: value };
    });
  };
  console.log("------");
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const exportExcel = () => {
    let desiredColumnOrder = [];

    let cols = columns.join(",");
    desiredColumnOrder = cols.split(",");
    const wantedValues = details.map((item) => {
      const obj = {};
      desiredColumnOrder.forEach((col) => {
        const value = item[col];
        if (typeof value === "string") {
          const [extractedValue, ,] = value.split("^&");
          obj[col] = extractedValue;
        } else {
          obj[col] = value;
        }
      });
      return obj;
    });

    const rows = wantedValues.map((item) => {
      const row = [];
      desiredColumnOrder.forEach((col) => {
        row.push(item[col]);
      });

      return row;
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Engagement Dashboard");
    wantedValues.forEach((item) => {
      const row = worksheet.addRow(Object.values(item));
    });

    const boldRow = [1];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "Engagement Dashboard.xlsx");
    });
  };

  const CustomDatePickerInput = ({ value, onClick }) => {
    const restrictedPlaceholder = "";

    return (
      <input
        type="text"
        className=""
        value={value}
        placeholder={restrictedPlaceholder}
        readOnly
        onClick={onClick}
      />
    );
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
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Engagement Allocations</h2>
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

      <div className="group mb-3 customCard ">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="businessunit">
                  Business Unit&nbsp;
                  <span className="error-text"> *</span>
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
                    id="businessUnit"
                    options={business}
                    // hasSelectAll={true}
                    value={selectedBusiness}
                    disabled={false}
                    valueRenderer={generateDropdownLabel}
                    onChange={(e) => {
                      setSelectedBusiness(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setState((prevVal) => ({
                        ...prevVal,
                        ["businessUnit"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customers ">
                  Customers&nbsp;
                  <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                    className="cancel text ellipsis title"
                    name="customer"
                    id="customer"
                    onChange={handleChange}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {customer?.map((Item, index) => (
                      <option
                        key={index}
                        value={Item.id}
                        title={Item.full_name}
                      >
                        {Item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2 ">
              <div className="form-group row ">
                <label className="col-5" htmlFor="StartDt">
                  Start Week&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div style={{ position: "relative", zIndex: "999" }}>
                    <DatePicker
                      selected={selectedDate}
                      showMonthDropdown
                      showYearDropdown
                      onChange={(date) => {
                        setState((prev) => ({
                          ...prev,
                          ["StartDt"]: moment(date).format("yyyy-MM-DD"),
                        }));
                        setSelectedDate(date);
                      }}
                      filterDate={filterMondays}
                      dateFormat="dd-MMM-yyyy"
                      dropdownMode="select"
                      customInput={<CustomDatePickerInput />}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-3">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration&nbsp;
                  <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select name="duration" id="duration" onChange={handleChange}>
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
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={getTableData}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
        {loader ? <Loader handleAbort={handleAbort} /> : ""}
      </div>

      {search === true ? (
        <div className="col-md-12 clearfix" style={{ height: "5px" }}>
          <div>
            <span>
              <span style={{ color: "#9d7c42", fontStyle: "italic" }}>
                <BsInfoCircle style={{ marginTop: "-5px" }} /> All numbers are
                in hours
              </span>
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
      {search === true ? (
        <div className="mb-2" align=" right ">
          <RiFileExcel2Line
            size="1.5em"
            title="Export to Excel"
            style={{ color: "green" }}
            cursor="pointer"
            onClick={exportExcel}
          />
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12 ">
        {loader == false && tableVisible == true ? (
          <MaterialReactCollapisbleTable
            data={tableData}
            expandedCols={[
              "engStatus",
              "prjStatus",
              "prjStartDt",
              "prjEndDt",
              "roleName",
              "roleStDt",
              "roleEdDt",
              "prjMgr",
            ]}
            colExpandState={["0", "0", "name"]}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default EngagementAllocations;
