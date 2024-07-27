import React, { useEffect, useState, useRef } from "react";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import DatePicker from "react-datepicker";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
// import SelectVendorDialogBox from "./SelectVendorDialogBox";
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
import { AiFillWarning } from "react-icons/ai";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
//import VendorPerformanceResourceTable from "./VendorPerformanceResourceTableSahid";

function VendorPerformanceFilters(props) {
  const [vendor, setVendor] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  // const [date, setDate] = useState(new Date());
  const [date, setDate] = useState(moment().subtract(5, "months").toDate());
  const [custVisible, setCustVisible] = useState(false);
  let flag = 3;
  const tableDisplayView = "VendorPerformanceFilter";
  const [toggleButton, setToggleButton] = useState(false);
  const vendorSelectBox = "VendorSelect";
  const [performanceData, setPerformanceData] = useState([]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(-1);
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const subKGmAnalysis = "subkGmAnalysisScreen";
  const [csl, setCsl] = useState([]);
  const [hirarchy, setHirarchy] = useState([]);
  const ref = useRef([]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [riskDetails, setRiskDetails] = useState([]);
  const [username, setUsername] = useState([]);
  const [selectedItems, setSelectedItems] = useState([{}]);
  const [custData, setcustData] = useState([]);
  const [selectedVendorid, setSelectedVendorId] = useState(-1);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [dp, setDp] = useState([]);
  const [selectedDp, setSelectedDp] = useState([]);
  const [validator, setValidator] = useState(false);
  const [openNw, setOpenNw] = useState(false);
  const [contarctorNames, setContarctorNames] = useState([]);
  const [selectedContractornames, setSelectedContractorNames] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  const hirarchyLevels = [
    { label: "Vendor", value: "vendor" },
    { label: "Customer", value: "customer" },
    { label: "BU", value: "bu" },
    { label: "Project", value: "project" },
    { label: "Resource", value: "resource" },
  ];
  const [selectedHirarchy, setselectedHirarchy] = useState([
    { label: "Vendor", value: "vendor" },
    { label: "Customer", value: "customer" },
    { label: "BU", value: "bu" },
    { label: "Project", value: "project" },
    { label: "Resource", value: "resource" },
  ]);
  console.log(username);
  let textContent = "Vendors";
  let currentScreenName = ["Subk GM Analysis"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const baseUrl = environment.baseUrl;
  let allCountry;
  let allVendor;

  const customValueRenderer = (selected, _options) => {
    //console.log(selected);
    //console.log(country.length);
    return selected.length === country.length ||
      selected.length === vendor.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };
  const [isOn, setOn] = useState(false);

  const handleToggle = () => {
    setOn(!isOn);
  };
  // const[duration,setDuration]=useState([])
  // const[viewBy,setViewBy]=useState([])
  //var date = new Date();
  let converteddate = moment(date).startOf("month").format("yyyy-MM-DD");
  const initialValue = {
    vendorList: "",
    month: converteddate,
    duration: "6",
    countryIds: "",
    summary: "vendor",
    subkIds: "",
    cslIds: -1,
    dpIds: -1,
    Vendorstatus: status,
  };

  const [formData, setFormData] = useState(initialValue);

  //const baseUrl = environment.baseUrl;
  const handleChangeDate = (date) => {
    setDate(date);
    const sixMonthsBefore = moment(date).subtract(6, "months").toDate();
    console.log(sixMonthsBefore);
  };

  const FilterChangeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prevVal) => ({ ...prevVal, [id]: value }));
  };
  console.log(selectedVendorid);
  const handleChange1 = (e) => {
    console.log(e.target.value);
    setSelectedVendorId(e.target.value);
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
  const getData = () => {
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
  console.log(contarctorNames);
  const getCustomers = () => {
    axios
      .get(
        // dataAccess == 641 || dataAccess == 690
        //   ? baseUrl + `/CommonMS/master/geActiveCustomerList`
        //   :
        baseUrl + `/CommonMS/master/getCustomers?loggedUserId=${loggedUserId}`
      )
      .then((resp) => {
        const data = resp.data;
        setcustData(data);
      });
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

  const getVendors = () => {
    axios
      .get(baseUrl + `/VendorMS/vendor/getVendorsNameandId`)

      .then((Response) => {
        let vendors = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let vendorObj = {
              label: e.name,
              value: e.id,
            };
            vendors.push(vendorObj);
          });
        setVendor(vendors);
        setSelectedVendor(vendors);
      })
      .catch((error) => console.log(error));
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

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/vmg/performance";
      getUrlPath(modifiedUrlPath);

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
    let vendorsList = [];
    vendor.forEach((d) => {
      vendorsList.push(d.value);
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["vendor"]: vendorsList.toString(),
    }));
  }, [vendor]);

  useEffect(() => {
    getCountries();
    getVendors();
    getMenus();
    getCsl();
    getDp();
    getData();
    getCustomers();
  }, []);
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

  const date1 = new Date(); // Replace this with your actual date value
  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"));
  const idList = selectedCust?.map((item) => item.id);
  console.log(selectedCust);
  const idString = idList?.join(",");
  console.log(selectedCountry);
  console.log(formData.subkIds.length);
  const handlesearch = (e) => {
    // setValidator(true);
    //console.log(converteddate, "converteddate");

    setFormData((prevVal) => ({
      ...prevVal,
      month: converteddate,
    }));

    // console.log(formData.month, "formData.monthafterclick");
    setOpen(true);
    setToggleButton(true);

    let valid = GlobalValidation(ref);
    //console.log(valid);

    if (valid) {
      setValidator(true);
      return;
    }
    // const countryArray = formData.country.split(",");
    allCountry =
      selectedCountry.length === country.length ? "-1" : formData.countryIds;
    // const vendorArray = formData.vendor.split(",");
    //console.log(formData.countryIds, "insidevpafclcountry");
    //console.log(formData.vendorList, "formData.vendorList");
    allVendor =
      selectedVendor.length === vendor.length ? "-1" : formData.vendorList;
    // console.log(selectedVendor);
    //console.log(formData.summary, "formData.summary");
    abortController.current = new AbortController();
    setValidator(false);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + `/VendorMS/performance/getVendorperformance`,
      signal: abortController.current.signal,
      data: {
        // vendorList: allVendor,
        vendorList: selectedVendorid == -1 ? -1 : idString,
        month: converteddate,
        duration: formData.duration,
        countryIds: allCountry,
        summary: formData.summary,
        subkIds:
          formData.subkIds === ""
            ? -1
            : formData.subkIds.length == 14687
            ? -1
            : formData.subkIds,
        cslIds: formData.cslIds,
        dpIds: formData.dpIds,
        Vendorstatus: status,
        // subkIds: formData.assigned_to == undefined ? -1 : formData.assigned_to,
        // status: formData.status,
        // hirarchy: -1,
        // status: 3,
      },

      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        var resp = response.data;
        setOpen(true);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setPerformanceData(resp);
        clearTimeout(loaderTime);
        setOpenNw(true);
      })
      .catch((e) => {
        console.log(e);
      });
    // setLoader(true);
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
  useEffect(() => {
    if (openNw == true) {
      setLoader(false);
    }
  }, [openNw]);
  const [usersId, setUsersId] = useState([]);
  console.log(formData.assigned_to);

  const onChangeHandler = (e) => {
    const { id, value } = e.target;
    // setIsVisible(true);
    console.log("on Change Handler");
    console.log(e.target.id);
    setFormData((prev) => ({ ...prev, [e.target.id]: id }));

    setUsersId(formData);
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const HelpPDFName = "Vendor Performance.pdf";
  const Headername = "Vendor Performance Help";
  const [countname, setCountName] = useState("");
  return (
    <div>
      {validator ? (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please select valid values for highlighted Fields"}
        </div>
      ) : (
        ""
      )}

      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Subk GM Analysis</h2>
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
      </div>

      <div class="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <>
            <div className="group-content row mt-2">
              <div className="col-md-3 mb-2 ">
                <div className="row">
                  <label className="col-5 ">
                    Vendors<span className="required error-text ml-1"> *</span>{" "}
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    // ref={(ele) => {
                    //   ref.current[0] = ele;
                    // }}
                    id="Vendors"
                  >
                    <select
                      className="cancel Text"
                      name="customerIds"
                      id="customerIds"
                      onChange={handleChange1}
                    >
                      {selectedItems.length + "selected"}
                      <option value={-1} selected>
                        {" "}
                        &lt;&lt;ALL&gt;&gt;
                      </option>
                      {/* <option value={0}>Active Customers</option> */}
                      <option value="select">Select</option>
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
                      ref.current[3] = ele;
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
                  <label className="col-md-5">Month </label>
                  <span style={{ marginLeft: "-5px" }} className="col-1">
                    :
                  </span>
                  <div
                    className="col-6 vendorperformanceDatepicker"
                    style={{ marginLeft: "5px" }}
                  >
                    <DatePicker
                      id="month"
                      selected={moment(date)._d}
                      // selected={julyDate.toDate()}

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
                  <label className="col-5">Duration </label>
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
                      {/* <option value="project">Project</option> */}
                      <option value="bu">BU</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="col-md-3 mb-2">
                <div className="row">
                  <label className="col-5 ">
                    Status<span className="required error-text ml-1"> *</span>{" "}
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 "
                    // ref={(ele) => {
                    //   ref.current[4] = ele;
                    // }}
                  >
                    <select
                      id="status"
                      value={status}
                      className="text cancel "
                      ref={(ele) => {
                        ref.current[4] = ele;
                      }}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      <option value="-1">&lt;&lt;ALL&gt;&gt;</option>
                      <option value="1444">Active</option>
                      <option value="1445">In Active</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-3 mb-2">
                <div className="row">
                  <label className="col-5 ">Hierarchy </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      id="hirarchy"
                      options={hirarchyLevels}
                      hasSelectAll={true}
                      value={selectedHirarchy}
                      disabled={false}
                      onChange={(e) => {
                        setselectedHirarchy(e);
                        let filterPractice = [];
                        e.forEach((d) => {
                          filterPractice.push(d.value);
                        });

                        setHirarchy(filterPractice.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="row">
                  <label className="col-5 ">Status </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select>
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      <option value="0">Active</option>
                      <option value="1">In Active</option>
                      <option value="3">Black List</option>
                    </select>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setOpenNw(false);
                  handlesearch();
                  setOpen(false);

                  const data =
                    formData.summary == "customer"
                      ? "Customers"
                      : formData.summary == "vendor"
                      ? "Vendors"
                      : formData.summary == "bu"
                      ? "BUs"
                      : formData.summary == "csl"
                      ? "csl"
                      : formData.summary == "dp"
                      ? "dp"
                      : formData.summary;
                  setCountName(data);
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
      <SelectCustDialogBox
        // dataAccess={dataAccess}
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        flag={flag}
        vendorSelectBox={vendorSelectBox}
      />

      {open === true && openNw == true ? (
        <div>
          {toggleButton && (
            <div className="mrTableContainer analysis-screen-toggle-btn">
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
          <VendorPerformanceTable
            open={open}
            performanceData={performanceData}
            formData={formData}
            countname={countname}
            isOn={isOn}
            openNw={openNw}
            subKGmAnalysis={subKGmAnalysis}
            tableDisplayView={tableDisplayView}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default VendorPerformanceFilters;
