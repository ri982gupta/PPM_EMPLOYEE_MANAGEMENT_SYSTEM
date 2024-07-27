import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import "./SelectedSE.scss";
import axios from "axios";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import { Details } from "@mui/icons-material";
import { RiFileExcel2Line } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
import RevenueProjectionMaterialtable from "./RevenueProjectionMaterialtable";
// import RevenueProjectionByCustomer from "./RevenueProjectionByCustomer";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { useLocation } from "react-router-dom";
import { CCollapse } from "@coreui/react";
import { BiCheck } from "react-icons/bi";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { parseISO } from "date-fns";

function RevenueProjections() {
  const [startDate, setStartDate] = useState(() => new Date());
  const [searching, setsearching] = useState(false);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const baseUrl = environment.baseUrl;
  const [month, setMonth] = useState(moment(moment()).startOf("month")._d);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  // const [details, setDetails] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const HelpPDFName = "REVPROJECTIONS.pdf";
  const Header = "Revenue Projections Help";
  const [tableComponent, setTableComponent] = useState(null);
  const [tableMSG, setTableMSG] = useState(null);

  const initialValue = {
    BU: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    fromQuater: moment().format("YYYY-MM-DD"),
    Geolocation: "4,3,5,1,2",
    duration: "1",
    Summary: "BU",
    isExport: 0,
    // loggedUser: loggedUserId,
  };
  const pageurl = "http://10.11.12.149:3000/#/operational/projections";
  const page_Name = "Revenue Projections";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Revenue Metrics";
  let currentScreenName = ["Revenue Projections"];
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
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/operational/projections";
      getUrlPath(modifiedUrlPath);
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
      console.log(getData + "in line 881...");
    });
  };

  useEffect(() => {
    FilterData();
  }, []);
  const [formData, setFormData] = useState({
    // BU: "170,211,123,82,168,207,212,18,213,49,149,208",
    // fromQuater: moment().format("YYYY-MM-DD"),
    // Geolocation: "4,3,5,1,2",
    // duration: "1",
    // Summary: "BU",
    // isExport: 0,
  });

  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          BU: filterData.BU,
          fromQuater: filterData.fromQuater,
          Geolocation: filterData.Geolocation,
          duration: filterData.duration,
          Summary: filterData.Summary,
          isExport: filterData.isExport,
        };
      } else {
        return {
          BU: "170,211,123,82,168,207,212,18,213,49,149,208,243",
          fromQuater: moment().format("YYYY-MM-DD"),
          Geolocation: "4,3,5,1,2",
          duration: "1",
          Summary: "BU",
          isExport: 0,
        };
      }
    });
  }, [filterData]);

  useEffect(() => {
    if (id != null) {
      const progressDataDivisions = filterData?.BU;
      const BUFilters = progressDataDivisions
        ? progressDataDivisions.split(",").map(Number)
        : [];

      const updatebusiness = business.filter((values) =>
        BUFilters?.includes(values?.value)
      );

      const updateGeoLocation = country.filter((values) =>
        filterData.Geolocation?.includes(values.value)
      );

      if (
        filterData?.fromQuater !== undefined &&
        filterData.fromQuater !== ""
      ) {
        const updatedate = filterData.fromQuater;
        console.log(updatedate + " in line 189....");
        setMonth(parseISO(updatedate));
      }
      setSelectedBusiness(updatebusiness);
      setSelectedCountry(updateGeoLocation);

      console.log(updateGeoLocation);
    }
  }, [
    id,
    business,
    filterData.fromQuater,
    filterData.Geolocation,
    filterData?.BU,
    country,
  ]);

  useEffect(() => {
    if (id != null) {
      setTimeout(() => {
        getTableDataSavedSearch();
      }, 3000);
    }
  }, [filterData]);
  const getBusinessUnit = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments.push({ value: 0, label: "Non-Revenue Units" });
    setBusiness(departments);
    if (id == null) {
      setSelectedBusiness(departments.filter((ele) => ele.value != 0));
    }
    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 0) {
        filteredDeptData.push(data.value);
      }
    });
  };
  console.log(business);
  const getGeoLocation = () => {
    axios
      .get(baseUrl + `/revenuemetricsms/projections/getGeolocation`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.location_name,
              value: e.id,
            };
            countries.push(countryObj);
          });
        setCountry(countries);
        if (id == null) {
          setSelectedCountry(countries);
        }
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getBusinessUnit();
    getGeoLocation();
  }, []);
  const customValueRenderer = (selected, _options) => {
    return selected.length === business.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };
  console.log(startDate);
  console.log(formData);
  const loggedUserId = localStorage.getItem("resId");
  useEffect(() => {
    console.log(columns);
  }, [columns]);

  const getTableData = () => {
    console.log("in line 94...........");
    // let valid = GlobalValidation(ref);
    // if (valid) {
    //   {
    //     setValidationMessage(true);
    //   }
    //   return;
    // }
    // if (valid) {
    //   return;
    // }
    const loaderTime = setTimeout(() => {
      setsearching(true);
    }, 2000);

    axios({
      method: "post",
      url:
        baseUrl +
        `/revenuemetricsms/projections/postRevenueProjectionsss?Builds=${
          formData.BU
        }&GeolocationIds=${formData.Geolocation}&FromDate=${moment(
          month
        ).format("YYYY-MM-DD")}&Duration=${formData.duration}&Summary=${
          formData.Summary
        }&isExport=0&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res);
      // let detail = res.data.tableData;
      console.log(res.data.tableData);
      // console.log(detail + "in line 111...........");

      console.log(columns);
      // setValidationMessage(false);
      setsearching(false);
      clearTimeout(loaderTime);
    });
  };

  const getTableDataSavedSearch = () => {
    console.log("in line 94...........");
    // let valid = GlobalValidation(ref);
    // if (valid) {
    //   {
    //     setValidationMessage(true);
    //   }
    //   return;
    // }
    // if (valid) {
    //   return;
    // }
    // const loaderTime = setTimeout(() => {
    //   setsearching(true);
    // }, 2000);
    setsearching(true);

    axios({
      method: "post",
      url:
        baseUrl +
        `/revenuemetricsms/projections/postRevenueProjectionsss?Builds=${
          filterData.BU
        }&GeolocationIds=${filterData.Geolocation}&FromDate=${moment(
          month
        ).format("YYYY-MM-DD")}&Duration=${filterData.duration}&Summary=${
          filterData.Summary
        }&isExport=0&userId=${loggedUserId}`,
    }).then((res) => {
      let cols = res.data.columns?.replaceAll("'", "").split(",");

      // setDetails(res.data.tableData);
      // console.log(details);
      setTableData(res.data);
      console.log(tableData);
      setColumns(cols);

      console.log(columns);
      // setValidationMessage(false);
      setsearching(false);
      // clearTimeout(loaderTime);
    });
  };
  const ref = useRef([]);
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  useEffect(() => {
    if (formData.Summary === "customer") {
      setTableMSG(
        <>
          <BsInfoCircle /> All numbers are in $. Call is irrespective of BU.
        </>
      );

      setTableComponent(
        <RevenueProjectionByCustomer
          data={tableData}
          expandedCols={["emp_cadre", "supervisor"]}
          colExpandState={["0", "0", "name"]}
        />
      );
    } else if (formData.Summary === "BU") {
      setTableMSG(
        <>
          <BsInfoCircle /> All numbers are in $.
        </>
      );
      setTableComponent(
        <RevenueProjectionMaterialtable
          data={tableData}
          expandedCols={["emp_cadre", "supervisor"]}
          colExpandState={["0", "0", "name"]}
        />
      );
    }
  }, [tableData]);

  return (
    <div>
      <div>
        <div className="col-md-12">
          <div className="pageTitle">
            <div className="childOne"></div>
            <div className="childTwo">
              <h2>Revenue Projections</h2>
            </div>

            <div className="childThree toggleBtns">
              <div>
                <p className="searchFilterHeading">Search Filters</p>
              </div>
              <span
                onClick={() => {
                  setVisible(!visible);

                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                {cheveronIcon}
              </span>
              <div className="saveBtn">
                <SavedSearchGlobal
                  setEditAddmsg={setEditAddmsg}
                  pageurl={pageurl}
                  page_Name={page_Name}
                  payload={formData}
                />
              </div>
              <GlobalHelp pdfname={HelpPDFName} name={Header} />
            </div>
          </div>
        </div>

        <div className="group customCard">
          <div className="col-md-12 collapseHeader"></div>
          {editmsg ? (
            <div className="statusMsg success">
              <span className="errMsg">
                <BiCheck size="1.4em" /> &nbsp; Search created successfully.
              </span>
            </div>
          ) : (
            ""
          )}

          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="BU">
                    BU <span className="required">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <MultiSelect
                      id="BU"
                      options={business}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedBusiness}
                      valueRenderer={customValueRenderer}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedBusiness(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });

                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["BU"]: filteredValues.toString(),
                        }));
                      }}
                    />
                    {/* <MultiSelect
                    id="BU"
                    options={[]}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    //   valueRenderer={customValueRenderer}
                    //   value={selectedRoleTypes}
                    disabled={false}
                  /> */}
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Geolocation">
                    Geolocation <span className="required">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <MultiSelect
                      id="Geolocation"
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
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["Geolocation"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="From Quater">
                    From Quater <span className="required">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <DatePicker
                      id="month"
                      selected={month}
                      onChange={(e) => {
                        setMonth(e);
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["fromQuater"]: moment(e).format("YYYY-MM-DD"),
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
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="duration">
                    Duration
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <select
                      id="duration"
                      onChange={(e) => {
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["duration"]: e.target.value,
                        }));
                      }}
                      value={formData.duration}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Summary">
                    Summary
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <select
                      id="Summary"
                      onChange={(e) => {
                        console.log(e.target.value);
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["Summary"]: e.target.value,
                        }));
                      }}
                      value={formData.Summary}
                    >
                      <option value="BU">BU</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={getTableData}
                >
                  Search{" "}
                </button>
              </div>
            </div>
          </CCollapse>

          {searching ? <Loader handleAbort={handleAbort} /> : ""}

          <div className="col-md-12 clearfix" style={{ height: "10px" }}>
            <div>
              <span>
                <span style={{ color: "#9d7c42", fontStyle: "italic" }}>
                  {tableMSG}
                </span>
              </span>
            </div>
          </div>
          <div align=" right ">
            <RiFileExcel2Line
              size="1.5em"
              title="Export to Excel"
              style={{ color: "green" }}
              cursor="pointer"
              // onClick={handleOnExport}
            />
          </div>

          <div className="">{tableComponent}</div>
        </div>
      </div>
    </div>
  );
}
export default RevenueProjections;
