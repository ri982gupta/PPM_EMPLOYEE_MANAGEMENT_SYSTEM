import React, { useEffect, useState, useRef } from "react";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import VendorPerformanceTable from "./VendorPerformanceTable";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import "./VendorManagement.scss";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import Loader from "../Loader/Loader";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import ParentVendorTabs from "./ParentVendorTabs";

function VendorPerformanceFilters(props) {
  const { vendorId, urlState, btnState, setbtnState, setUrlState } = props;
  console.log(urlState, "urlState");
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [date, setDate] = useState(new Date());
  const [performanceData, setPerformanceData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [dp, setDp] = useState([]);
  const [selectedDp, setSelectedDp] = useState([]);
  const [csl, setCsl] = useState([]);
  const [contarctorNames, setContarctorNames] = useState([]);
  const [selectedContractornames, setSelectedContractorNames] = useState([]);
  const ref = useRef([]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [validator, setValidator] = useState(false);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Vendors";
  let currentScreenName = ["Vendors", "Resource Vendor Performance"];
  const [countname, setCountName] = useState("");
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  let allCountry;

  const customValueRenderer = (selected, _options) => {
    return selected.length === country.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };
  // const[duration,setDuration]=useState([])
  // const[viewBy,setViewBy]=useState([])
  //var date = new Date();
  let converteddate = moment(date).startOf("month").format("yyyy-MM-DD");
  const initialValue = {
    vendorList: vendorId,
    month: converteddate,
    duration: "6",
    countryIds: "-1",
    summary: "vendor",
    dpIds: "-1",
    cslIds: "-1",
    subkIds: "-1",
  };

  const [formData, setFormData] = useState(initialValue);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Management") {
            return {
              ...submenu,
              display_name: "Subk Management",
            };
          }
          if (submenu.display_name === "Performance") {
            return {
              ...submenu,
              display_name: "Subk GM Analysis",
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
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/vmg/vendorperformance&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getCsl = () => {
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

        custom.push({ label: "UnAssigned", value: 999 });
        setCsl(custom);
        setSelectedCsl(custom);
      });
  };
  const getDp = () => {
    axios
      .get(
        baseUrl + `/CommonMS/master/getDPDropDownData?userId=${loggedUserId}`
      )
      .then((res) => {
        let custom = [];

        let data = res.data;

        // const seenPersonNames = new Set();

        data.length > 0 &&
          data.forEach((e) => {
            let dpObj = {
              label: e.PersonName,
              value: e.id,
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
        custom.push({ label: "UnAssigned", value: 999 });
        setDp(custom);
        setSelectedDp(custom);
      });
  };
  const getSubkData = () => {
    axios({
      method: "get",
      url: baseUrl + `/VendorMS/vendor/vendorContarctors`,
    }).then(function (response) {
      let countries = [];
      var res = response.data;
      res.length > 0 &&
        res.forEach((e) => {
          let countryObj = {
            label: e.name,
            value: Number(e.id) + 1,
          };
          countries.push(countryObj);
        });
      setContarctorNames(countries);
      setSelectedContractorNames(countries);
      setRiskDetails(res);
    });
  };
  const handleChangeDate = (date) => {
    setDate(date);
  };

  const FilterChangeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prevVal) => ({ ...prevVal, [id]: value }));
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
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    const allValues = allOptions.map((item) => item.value);

    if (
      selectedValues.length !== 0 &&
      selectedValues.length === allValues.length
    ) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  useEffect(() => {
    let countryList = [];
    country.forEach((d) => {
      countryList.push(d.value);
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["country"]: countryList.toString(),
    }));
  }, [country]);

  useEffect(() => {
    setFormData((prevVal) => ({
      ...prevVal,
      vendorList: vendorId,
    }));
  }, [vendorId]);

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  useEffect(() => {
    getCountries();
    getMenus();
    getUrlPath();
    getCsl();
    getDp();
    getSubkData();
  }, []);

  const handlesearch = (e) => {
    const data =
      formData.summary == "customer"
        ? "Customers"
        : formData.summary == "vendor"
        ? "Vendors"
        : formData.summary == "bu"
        ? "BUs"
        : formData.summary;
    setCountName(data);
    setFormData((prevVal) => ({
      ...prevVal,
      month: converteddate,
    }));
    setOpen(true);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    let valid = GlobalValidation(ref);

    if (valid) {
      setValidator(true);
      return;
    }
    allCountry =
      selectedCountry.length === country.length ? "-1" : formData.countryIds;
    axios({
      method: "post",
      url: baseUrl + `/VendorMS/performance/getVendorperformanceSubTab`,
      data: {
        month: converteddate,
        duration: formData.duration,
        countryIds: allCountry,
        summary: formData.summary,
        vendorList: formData.vendorList,
        dpIds: formData.dpIds,
        cslIds: formData.cslIds,
        subkIds: formData.subkIds,
      },

      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        var resp = response.data;
        setPerformanceData([]);
        setOpen(true);
        setLoader(false);
        console.log(resp, "resp---------------------");
        setPerformanceData(resp);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        clearTimeout(loaderTime);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    // setLoader(false);
  }, [performanceData]);

  return (
    <div>
      {validator ? (
        <div className="statusMsg error">
          <span>Please Select Mandatory Fields</span>
        </div>
      ) : (
        ""
      )}

      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <ParentVendorTabs
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          </div>
          <div className="childTwo">
            <h2>Subk GM Analysis</h2>
          </div>
          <div className="childThree toggleBtns">
            <div>
              <p className="searchFilterHeading">Search Filters</p>
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
            </div>
          </div>
        </div>
      </div>

      <div class="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <>
            <div className="group-content row mt-2">
              <div className="col-md-3 mb-2">
                <div className="row">
                  <label className="col-5">Month </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6 vendorperformanceDatepicker">
                    <DatePicker
                      id="month"
                      selected={moment(date)._d}
                      onChange={(e) => {
                        handleChangeDate(e);
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

              <div className="col-md-3 mb-2">
                <div className="row">
                  <label className="col-md-5">Duration </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      id="duration"
                      onChange={(e) => FilterChangeHandler(e)}
                      name="duration"
                      className="col-md-12 col-sm-12 col-xs-12 "
                      defaultValue={"6"}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2 " style={{ paddingLeft: "17px" }}>
                <div className="row">
                  <label className="col-5 ">
                    SubK<span className="required error-text ml-1"> *</span>{" "}
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    id="Vendors"
                  >
                    {/* <RiskAutoComplete
                      id="assigned_to"
                      name="assigned_to"
                      riskDetails={riskDetails}
                      // setState={setState}
                      setFormData={setFormData}
                      onChangeHandler={onChangeHandler}
                      // onChange={setDefaultRoleState}
                      setUsername={setUsername}
                    /> */}
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="subkIds"
                      options={contarctorNames}
                      hasSelectAll={true}
                      value={selectedContractornames}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      selected={selectedContractornames}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedContractorNames(e);
                        let filteredCustomer = [];
                        e.forEach((d) => {
                          filteredCustomer.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["subkIds"]: filteredCustomer.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="CSL">
                    CSL<span className="required error-text ml-1"> *</span>{" "}
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
                      id="cslIds"
                      options={csl}
                      hasSelectAll={true}
                      value={selectedCsl}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      selected={selectedCsl}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedCsl(e);
                        let filteredCustomer = [];
                        e.forEach((d) => {
                          filteredCustomer.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["cslIds"]: filteredCustomer.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="DP">
                    DP<span className="required error-text ml-1"> *</span>{" "}
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="dpIds"
                      options={dp}
                      hasSelectAll={true}
                      value={selectedDp}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      selected={selectedDp}
                      disabled={false}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => {
                        setSelectedDp(e);
                        let filteredCustomer = [];
                        e.forEach((d) => {
                          filteredCustomer.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["dpIds"]: filteredCustomer.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="row">
                  <label className="col-5 ">
                    Country<span className="required error-text ml-1"> *</span>{" "}
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                    id="countryids"
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="country"
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
                      labelledBy={"countries"}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-2">
                <div className="row">
                  <label className="col-5 ">ViewBy </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      id="summary"
                      onChange={(e) => FilterChangeHandler(e)}
                      name="summary"
                      defaultValue={"vendor"}
                    >
                      <option value="vendor">Vendor</option>
                      <option value="customer">Customer</option>
                      <option value="bu">BU</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handlesearch();
                  setOpen(false);
                }}
              >
                <FaSearch />
                Search
              </button>
            </div>
          </>
        </CCollapse>
      </div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {open === true ? (
        <VendorPerformanceTable
          performanceData={performanceData}
          formData={formData}
          countname={countname}
          vendorId={vendorId}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default VendorPerformanceFilters;
