import React, { useEffect, useState, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VendorManagSummaryTable from "./VendorManagSummaryTable";
import moment from "moment";
import "./VendorManagement.scss";
import { CCollapse } from "@coreui/react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import Loader from "../Loader/Loader";
import { AiFillWarning } from "react-icons/ai";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { useLocation } from "react-router-dom";
import InitialParentVendorTabs from "./IntialParentVendorTabs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
// function VendorManagementFilters({ urlState, buttonState, setButtonState, setUrlState }) {
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import SubkTimsheet from "./SubkTimesheet";

function VendorManagementFilters({
  urlState,
  buttonState,
  setButtonState,
  setUrlState,
}) {
  var sdate = moment().subtract(7, "days").format("DD-MMM-YYYY");

  const [startDate, setStartDate] = useState(moment(sdate)._d);
  const [validator, setValidator] = useState(false);
  const [endDate, setendDate] = useState(new Date());
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [visible, setVisible] = useState(false);

  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [formDataNew, setFormDataNew] = useState();
  const [message, setMessage] = useState(false);
  const [validation, setValidation] = useState(false);
  const [allDept, setAllDept] = useState([]);
  const [allCountry, setAllCountry] = useState([]);
  const [viewType, setViewType] = useState("Vendor");
  const targetElementRef = useRef(null);
  const ref = useRef([]);
  const flags = 1;
  const loggedUserId = localStorage.getItem("resId");
  const [cslList, setCslList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [allCsl, setAllCsl] = useState([]);
  const [allVendor, setAllVendor] = useState([]);
  const [allCustomer, setAllCustomer] = useState([]);
  const [allProject, setAllProject] = useState([]);
  const [allDP, setAllDP] = useState([]);
  const [selectedCslList, setSelectedCslList] = useState([]);
  const [selectedVendorList, setSelectedVendorList] = useState([]);
  const [selectedCustomerList, setSelectedCustomerList] = useState([]);
  const [selectedProjectList, setSelectedProjectList] = useState([]);
  const [dpList, setDpList] = useState([]);
  const [selectedDpList, setSelectedDpList] = useState([]);
  const [checked, setChecked] = useState(false);
  const [vendorStatusOptions, setVendorStatusOptions] = useState([]);
  const [manageTabs, setManageTabs] = useState("SubkManagement");
  const location = useLocation();
  const currentURL = location.pathname.toString();
  let alldepartments;
  let allcountries;
  let allcsls;
  let alldps;
  let allcustomers;
  let allprojects;
  let allvendors;
  const [selectedVendorid, setSelectedVendorId] = useState(-1);
  const [custVisible, setCustVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([{}]);
  const vendorSelectBox = "VendorSelect";
  let flag = 3;
  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"));
  const idList = selectedCust?.map((item) => item.id);
  const idString = idList?.join(",");
  const [routes, setRoutes] = useState([]);
  let textContent = "Vendors";
  let currentScreenName = [" Subk Management"];
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
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
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

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const customValueRenderer = (selected, _options) => {
    return selected.length === country.length ||
      selected.length === departments.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };

  const initialValue = {
    viewType: viewType,
    buIds: "",
    cslIds: "",
    dpIds: "",
    country: allcountries,
    fromDate: moment(startDate).format("YYYY-MM-DD"),
    toDate: moment(endDate).format("YYYY-MM-DD"),
    viewBy: "view",
    vendorStatus: "",
    customerIds: "0",
  };
  useEffect(() => {
    if (
      viewType == "Customer" ||
      viewType == "BU" ||
      viewType == "CSL" ||
      viewType == "DP"
    ) {
      setSelectedVendorId(-1);
    }
  }, [viewType]);

  const [formData, setFormData] = useState(initialValue);
  const baseUrl = environment.baseUrl;
  const handleClear = () => {
    // setFormData((prevProps) => ({ ...prevProps, full_name: null }));
    setFormData((prevVal) => ({
      ...prevVal,
      ["customerIds"]: null,
    }));
  };
  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)

      .then((Response) => {
        let countries = [];

        let data = Response.data;
        data.length > 0 &&
          data?.forEach((e) => {
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

  const getName = () => {
    axios
      .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
      .then((resp) => {
        let terms = [];
        let filteredProjectList = [];
        resp.data.forEach((e) => {
          let termsObj = {
            label: e.name,
            value: e.id,
          };
          terms.push(termsObj);
          if (e.id !== 0) {
            filteredProjectList.push(e.id);
          }
        });
        setProjectList(terms);
        if (id == null) {
          setSelectedProjectList(terms.filter((ele) => ele.value !== 0));
        }
        setFormData((prevVal) => ({
          ...prevVal,
          projectIds: filteredProjectList.toString(),
        }));
      })
      .catch((error) => console.log(error));
  };

  const getCustomers = () => {
    axios({
      url: baseUrl + `/customersms/Customersearch/getcustomer`,
    })
      .then((resp) => {
        let terms = [];
        let filteredCustomerList = [];
        resp.data.forEach((e) => {
          let termsObj = {
            name: e.name,
            id: e.id,
          };
          terms.push(termsObj);

          if (e.id !== 0) {
            filteredCustomerList.push(e.id);
          }
        });
        setCustomerList(terms);
        if (id == null) {
          setSelectedCustomerList(terms.filter((ele) => ele.value !== 0));
        }
        // setFormData((prevVal) => ({
        //   ...prevVal,
        //   customerIds: filteredCustomerList.toString(),
        // }));
      })
      .catch((error) => console.log(error));
  };

  const getVendorneName = () => {
    axios
      .get(baseUrl + `/VendorMS/vendor/getVendorNames`)
      .then((resp) => {
        let terms = [];
        let data = resp.data;
        data.length > 0 &&
          data.forEach((e) => {
            let termsObj = {
              label: e.name,
              value: e.id,
            };
            terms.push(termsObj);
            setVendorList(terms);
            // setAllCsl(terms.map((item) => item.value).join(","));
            if (id == null) {
              setSelectedVendorList(terms.filter((ele) => ele.value != 0));
            }
            let filteredVendorList = [];
            terms.forEach((data) => {
              if (data.value != 0) {
                filteredVendorList.push(data.value);
              }
            });
            setFormData((prevVal) => ({
              ...prevVal,
              ["vendorIds"]: filteredVendorList.toString(),
            }));
          });
      })
      .catch((error) => console.log(error));
  };

  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments.push({ value: 0, label: "Non-Revenue Units" });
    setDepartments(departments);
    setSelectedDepartments(departments.filter((ele) => ele.value != 0));
    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 0) {
        filteredDeptData.push(data.value);
      }
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["buIds"]: filteredDeptData.toString(),
    }));
  };

  const getCustomerCSLList = async () => {
    try {
      const resp = await axios.get(
        baseUrl + `/revenuemetricsms/RevenueMarginAnalysis/getCustomerCSLList`
      );

      let terms = [];
      let data = resp.data;

      if (data && data.length > 0) {
        data.forEach((e) => {
          let termsObj = {
            label: e.PersonName,
            value: e.id,
          };
          terms.push(termsObj);
        });

        terms.push({ label: "UnAssigned", value: 99 });
        setCslList(terms);
        if (id === null) {
          setSelectedCslList(terms.filter((ele) => ele.value !== 0));
        }

        let filteredCslList = terms
          .filter((data) => data.value !== 0)
          .map((data) => data.value);

        setFormData((prevVal) => ({
          ...prevVal,
          cslIds: filteredCslList.toString(),
        }));
      }
    } catch (error) {
      // Handle errors here
      console.error("Error fetching customer CSL list:", error);
    }
  };

  {
    /*-------------------------Getting Delivery Partner List-------------------------*/
  }
  const getCustomerDelParatnerList = () => {
    axios
      .get(baseUrl + `/administrationms/subkconversiontrend/getdeliverypartner`)
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
          });

        terms.push({ label: "UnAssigned", value: 99 }); // Move it outside the loop

        setDpList(terms);

        if (id === null) {
          setSelectedDpList(terms.filter((ele) => ele.value !== 0));
        }

        let filteredDpList = terms
          .filter((data) => data.value !== 0)
          .map((data) => data.value);

        setFormData((prevVal) => ({
          ...prevVal,
          dpIds: filteredDpList.toString(),
        }));
      })
      .catch(function (error) {
        // Handle errors here
        console.error("Error fetching delivery partner list:", error);
      });
  };

  // Call the function to get customer delivery partner list

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/vmg/vmg";
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
    // getName();
    // getCustomers();
    getVendorneName();
    getDepartments();
    getCountries();
    getMenus();
    getCustomerDelParatnerList();
    getCustomerCSLList();
    getVendorStatusOptions();
  }, []);

  useEffect(() => {
    getName();
    getCustomers();
  }, [id]);

  const FromDateChangeHandler = (value, e) => {
    setStartDate(value);
    let frmdate = value;
    let currdate = new Date();

    frmdate > currdate ? setendDate(frmdate) : setendDate(currdate);
  };
  const ToDateChangeHandler = (value) => {
    setendDate(value);
  };
  let formattedFromDate = moment(startDate).format("YYYY-MM-DD");
  let toDateFromDate = moment(endDate).format("YYYY-MM-DD");

  useEffect(() => {
    if (selectedDepartments.length === departments) {
      document.getElementsByClassName(
        "dropdown-heading-value"
      )[0].children[0].innerText = "<<All>>";
    }
  }, []);

  useEffect(() => {
    setChecked(false);
  }, [summaryData]);

  useEffect(() => {
    if (checked == true) {
      setFormDataNew((prevVal) => ({
        ...prevVal,
        ["viewBy"]: "Edit",
      }));
    } else {
      setFormDataNew((prevVal) => ({
        ...prevVal,
        ["viewBy"]: "view",
      }));
    }
  }, [checked]);

  const getVendorStatusOptions = () => {
    axios({
      url: baseUrl + `/VendorMS/vendor/getVendorStatus`,
    }).then((resp) => {
      resp.data.unshift({
        lkup_name: "<< ALL >>",
        id: -1,
        lkup_type_group_id: 0,
      });
      setVendorStatusOptions(resp.data);
      setFormData((prevVal) => ({
        ...prevVal,
        ["vendorStatus"]: resp.data[0].id,
      }));
    });
  };

  const handleChange1 = (e) => {
    setSelectedVendorId(e.target.value);
    const { id, name, value } = e.target;
    if (name == "vendorId" && value == "select") {
      setFormData((prev) => {
        return { ...prev, [name]: value };
      });
      setCustVisible(true);
    }
  };
  console.log(selectedVendorid);
  const getData = () => {
    {
      currentURL.includes("/vmg/vmg")
        ? axios({
            method: "post",
            url:
              baseUrl + `/VendorMS/management/getVendManagementResourceDtlsNew`,
            // `http://localhost:8090/VendorMS/management/getVendManagementResourceDtlsNew`,
            signal: abortController.current.signal,
            data: {
              buIds: formData.viewType === "BU" ? alldepartments : "-1",
              country: formData?.country,
              fromDate: formattedFromDate,
              toDate: toDateFromDate,
              isExport: 0,
              vendorId: selectedVendorid == -1 ? -1 : idString,
              page: "vmg",
              custId:
                formData.viewType === "Customer" ? formData.customerIds : "0",
              projId: "0",
              buId: "0",
              cslId: formData.viewType === "CSL" ? allcsls : "-1",
              dpId: formData.viewType === "DP" ? alldps : "-1",
              vendorStatus: formData.vendorStatus,
              resource_id: -1,
            },
            headers: { "Content-Type": "application/json" },
          }).then((response) => {
            var resp = response.data;
            setSummaryData(resp);
            setLoader(false);
            setTimeout(() => {
              setValidation(false);
            }, 3000);
            setVisible(!visible);
            visible
              ? setCheveronIcon(FaChevronCircleUp)
              : setCheveronIcon(FaChevronCircleDown);
            setOpen(true);
          })
        : axios({
            method: "post",
            url: baseUrl + `/VendorMS/management/getVendManagementSummary`,
            // url: `http://localhost:8090/VendorMS/management/getVendManagementSummary`,
            signal: abortController.current.signal,
            data: {
              viewtype: formData.viewType,
              buIds:
                formData.viewType === "BU"
                  ? alldepartments
                  : formData.viewType === "CSL"
                  ? allcsls
                  : alldps,
              country: allcountries,
              fromDate: formattedFromDate,
              toDate: toDateFromDate,
              isExport: 0,
              vendorStatus: formData.vendorStatus,
            },

            headers: { "Content-Type": "application/json" },
          }).then((response) => {
            const unclassifiedObject = {
              name: "Unclassified",
              lvl: "1", // Assuming lvl is a string, adjust accordingly if it's a number
              total_hc: String(
                Number(response.data[1].total_hc) -
                  (Number(response.data[2].total_hc) +
                    Number(response.data[3].total_hc))
              ),
              awaiting_conv: String(
                Number(response.data[1].awaiting_conv) -
                  (Number(response.data[2].awaiting_conv) +
                    Number(response.data[3].awaiting_conv))
              ),
              contract: String(
                Number(response.data[1].contract) -
                  (Number(response.data[2].contract) +
                    Number(response.data[3].contract))
              ),
              contract_hire: String(
                Number(response.data[1].contract_hire) -
                  (Number(response.data[2].contract_hire) +
                    Number(response.data[3].contract_hire))
              ),
              conv_in_prog: String(
                Number(response.data[1].conv_in_prog) -
                  (Number(response.data[2].conv_in_prog) +
                    Number(response.data[3].conv_in_prog))
              ),
              fixed_bid: String(
                Number(response.data[1].fixed_bid) -
                  (Number(response.data[2].fixed_bid) +
                    Number(response.data[3].fixed_bid))
              ),
              freelancer: String(
                Number(response.data[1].freelancer) -
                  (Number(response.data[2].freelancer) +
                    Number(response.data[3].freelancer))
              ),
              id: 0,
              offered: String(
                Number(response.data[1].offered) -
                  (Number(response.data[2].offered) +
                    Number(response.data[3].offered))
              ),
              on_exit_path: String(
                Number(response.data[1].on_exit_path) -
                  (Number(response.data[2].on_exit_path) +
                    Number(response.data[3].on_exit_path))
              ),
            };

            // Add the "Unclassified" object to the array
            response.data.push(unclassifiedObject);
            setSummaryData(response.data);
            setLoader(false);
            setTimeout(() => {
              setValidation(false);
            }, 3000);
            setVisible(!visible);
            visible
              ? setCheveronIcon(FaChevronCircleUp)
              : setCheveronIcon(FaChevronCircleDown);
            setOpen(true);
          });
    }
  };
  const searchHandle = () => {
    setValidation("");
    setFormDataNew(formData);
    GlobalCancel(ref);
    let valid = GlobalValidation(ref);
    if (
      valid ||
      (selectedVendorid == "select" && idString == "" && viewType == "Vendor")
    ) {
      {
        setValidator(true);
      }
      return;
    }
    setValidator(false);
    // setLoader(true);
    setOpen(false);
    setTimeout(() => {
      setLoader(true);
      setTimeout(() => {
        getData();
      }, 1000); // 2-second delay for data fetching
    }, 1000);

    const departmentArray = formData.buIds.split(",");
    alldepartments =
      departmentArray.length === departments.length ? "-1" : formData.buIds;
    setAllDept(alldepartments);

    const cslArray = formData.cslIds.split(",");
    allcsls = cslList.length === cslArray.length ? "-1" : formData.cslIds;
    setAllCsl(allcsls);

    const countryArray = formData.country.split(",");
    allcountries =
      countryArray.length === country.length ? "-1" : formData.country;
    setAllCountry(allcountries);

    const dpArray = formData.dpIds.split(",");
    alldps = dpList.length === dpArray.length ? "-1" : formData.dpIds;
    setAllDP(alldps);

    const customerArray = formData.customerIds;
    allcustomers = formData.customerIds;
    setAllCustomer(allcustomers);

    const projectArray = formData.projectIds.split(",");
    allprojects =
      projectList.length === projectArray.length ? "0" : formData.projectIds;
    setAllProject(allprojects);

    const vendorArray = formData.vendorIds.split(",");
    allvendors =
      vendorList.length === vendorArray.length ? -1 : formData.vendorIds;
    setAllVendor(allvendors);

    abortController.current = new AbortController();
  };
  const validationMs = (v) => {
    setValidation(v);
    scrollToTarget(targetElementRef);
  };

  const scrollToTarget = (targetElementRef) => {
    var body = document.body,
      html = document.documentElement;
    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    if (targetElementRef.current) {
      targetElementRef.current.scrollIntoView({
        top: 0,
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
    }
  };
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setRefresh(false);
    setLoader(false);
  };
  const HelpPDFName = "Resource Vendor Management.pdf";
  const Headername = "Resource Vendor Management Help";
  return (
    <div>
      <div ref={targetElementRef}>
        {validation == "noChange" ? (
          <div className="statusMsg error">
            <AiFillWarning />
            No Modifications found to save
          </div>
        ) : validation == "notValid" ? (
          <div className="statusMsg error">
            <AiFillWarning />
            Please select valid values for highlighted fields
          </div>
        ) : (
          validation == "save" && (
            <div className="statusMsg success">
              <FaCheck /> Proposal saved successfully
            </div>
          )
        )}
      </div>
      {validator ? (
        <div className="statusMsg error">
          <AiFillWarning /> &nbsp; Please select valid values for highlighted
          fields
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className={manageTabs != "Timesheet" ? "pageTitle" : ""}>
          {buttonState === "Performance" ? (
            <>
              <div className="childOne">
                <div className="tabsProject">
                  <InitialParentVendorTabs
                    buttonState={buttonState}
                    setButtonState={setButtonState}
                    setUrlState={setUrlState}
                  />
                </div>
              </div>
              <div className="childTwo">
                <h2>Vendor Performance</h2>
              </div>
            </>
          ) : (
            manageTabs != "Timesheet" && (
              <>
                <div className="childOne">
                  <div className="tabsProject">
                    <button
                      className={
                        manageTabs === "SubkManagement"
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setManageTabs("SubkManagement");
                      }}
                    >
                      Subk Management
                    </button>
                    {loggedUserId === "4452475" ||
                    loggedUserId === "5200" ||
                    loggedUserId === "3494" ||
                    loggedUserId === "1850" ||
                    loggedUserId === "658045" ? (
                      <button
                        className={
                          manageTabs === "Timesheet"
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setManageTabs("Timesheet");
                        }}
                      >
                        Subk Timesheets
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="childTwo">
                  <h2>Subk Management</h2>
                </div>
              </>
            )
          )}

          {manageTabs != "Timesheet" && (
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
          )}
        </div>
      </div>

      {manageTabs != "Timesheet" && (
        <div class="group customCard">
          <div className="col-md-12 collapseHeader"></div>
          <CCollapse visible={!visible}>
            <div class="group-content row mb-2">
              <>
                <div className="form-group row mt-2">
                  <div className="col-md-3 mb-2 ">
                    <div className=" form-group row">
                      <label className="col-5 ">
                        View Type&nbsp;
                        <span className="required error-text">*</span>{" "}
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6 ">
                        <select
                          onChange={(e) => {
                            setViewType(e.target.value);
                            setFormData((prevVal) => ({
                              ...prevVal,
                              ["viewType"]: e.target.value,
                            }));
                          }}
                        >
                          <option value="Vendor">Vendor</option>
                          <option value="Customer">Customer</option>
                          <option value="BU">BU</option>
                          <option value="CSL">CSL</option>
                          <option value="DP">DP</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {viewType == "Vendor" ? (
                    <div className="col-md-3 mb-2 ">
                      <div className="row">
                        <label className="col-5 ">
                          Vendor Name&nbsp;
                          <span className="required error-text">*</span>{" "}
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-6 multiselect" id="Vendors">
                          <select
                            className={
                              validator &&
                              selectedVendorid == "select" &&
                              viewType == "Vendor" &&
                              idString == ""
                                ? "error-block cancel Text"
                                : "cancel Text"
                            }
                            name="vendorId"
                            id="vendorId"
                            onChange={handleChange1}
                          >
                            {selectedItems.length + "selected"}
                            <option value={-1} selected>
                              {" "}
                              &lt;&lt;ALL&gt;&gt;
                            </option>
                            <option value="select">Select</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {viewType == "Customer" ? (
                    <div className="col-md-3 mb-2 ">
                      <div className="row">
                        <label className="col-5 ">Customer Name</label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-6">
                          <div className="autocomplete">
                            <div className="autoComplete-container">
                              <ReactSearchAutocomplete
                                items={customerList}
                                type="Text"
                                name="customerIds"
                                id="customerIds"
                                customerList={customerList}
                                className="AutoComplete"
                                onClear={handleClear}
                                onSelect={(e) => {
                                  setFormData((prevVal) => ({
                                    ...prevVal,
                                    ["customerIds"]: e.id,
                                  }));
                                }}
                                showIcon={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {viewType == "CSL" ? (
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
                            ref.current[0] = ele;
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

                              setFormData((prevVal) => ({
                                ...prevVal,
                                ["cslIds"]: filteredValues.toString(),
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
                  {viewType == "DP" ? (
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
                            ref.current[0] = ele;
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

                              setFormData((prevVal) => ({
                                ...prevVal,
                                ["dpIds"]: filteredValues.toString(),
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

                  {viewType == "BU" ? (
                    <div className="col-md-3 mb-2 ">
                      <div className="row">
                        <label className="col-5 ">
                          BU&nbsp;
                          <span className="required error-text">*</span>{" "}
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div
                          className="col-6 multiselect"
                          ref={(ele) => {
                            ref.current[0] = ele;
                          }}
                        >
                          <MultiSelect
                            id="buIds"
                            ArrowRenderer={ArrowRenderer}
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

                              setFormData((prevVal) => ({
                                ...prevVal,
                                ["buIds"]: filteredValues.toString(),
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
                  <div className="col-md-3 mb-2">
                    <div className="form-group row ">
                      <label className="col-5  ">
                        Country &nbsp;
                        <span className="required error-text">*</span>
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
                          id="country"
                          ArrowRenderer={ArrowRenderer}
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
                              ["country"]: filteredCountry.toString(),
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2 ">
                    <div className="form-group row">
                      <label className="col-5 ">
                        Vendor Status &nbsp;
                        <span className="required error-text">*</span>
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6 " id="status">
                        <select
                          id="statusId"
                          onChange={(e) => {
                            setFormData((prevVal) => ({
                              ...prevVal,
                              ["vendorStatus"]: e.target.value,
                            }));
                          }}
                          className="text cancel "
                          ref={(ele) => {
                            ref.current[2] = ele;
                          }}
                          name="vendorStatus"
                        >
                          {vendorStatusOptions.map((option) => (
                            <option
                              key={option.id}
                              value={option.id}
                              selected={formData?.vendorStatus === option.id}
                            >
                              {option.lkup_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5 ">
                        From &nbsp;
                        <span className="required error-text">*</span>
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6 ">
                        <div
                          className="datepicker"
                          ref={(ele) => {
                            ref.current[3] = ele;
                          }}
                        >
                          <DatePicker
                            dateFormat="dd-MMM-yyyy"
                            selected={startDate}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            style={{ textAlign: "center" }}
                            onChange={(value) => FromDateChangeHandler(value)}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5 ">
                        To&nbsp;<span className="required error-text">*</span>{" "}
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <div
                          className="datepicker"
                          ref={(ele) => {
                            ref.current[4] = ele;
                          }}
                        >
                          <DatePicker
                            dateFormat="dd-MMM-yyyy"
                            minDate={startDate}
                            selected={endDate}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            onChange={(value) => ToDateChangeHandler(value)}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 mb-2" align="center">
                  <button className="btn btn-primary" onClick={searchHandle}>
                    <FaSearch />
                    Search
                  </button>
                </div>
              </>
            </div>{" "}
          </CCollapse>

          {loader ? <Loader handleAbort={handleAbort} /> : ""}
          {refresh ? <Loader handleAbort={handleAbort} /> : ""}

          <SelectCustDialogBox
            visible={custVisible}
            setVisible={setCustVisible}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            flag={flag}
            vendorSelectBox={vendorSelectBox}
          />

          {open === true ? (
            <VendorManagSummaryTable
              loader={loader}
              maxHeight1={maxHeight1}
              fileName="ResourceVendorManagement"
              setLoader={setLoader}
              setRefresh={setRefresh}
              refresh={refresh}
              formData={formDataNew}
              flags={flags}
              setFormData={setFormData}
              summaryDataNw={summaryData}
              formattedFromDate={formattedFromDate}
              toDateFromDate={toDateFromDate}
              validationM={validationMs}
              setValidation={setValidation}
              alldepartments={allDept}
              allcountries={allCountry}
              allcsls={allCsl}
              allDPs={allDP}
              allVendors={allVendor}
              allcustomers={allCustomer}
              abortController={abortController}
              setCheveronIcon={setCheveronIcon}
              visible={visible}
              setVisible={setVisible}
              checked={checked}
              setChecked={setChecked}
              buttonState={buttonState}
            />
          ) : (
            ""
          )}
        </div>
      )}
      {manageTabs == "Timesheet" && (
        <SubkTimsheet
          urlState={urlState}
          buttonState={buttonState}
          setButtonState={setButtonState}
          setUrlState={setUrlState}
          manageTabs={manageTabs}
          setManageTabs={setManageTabs}
        />
      )}
    </div>
  );
}

export default VendorManagementFilters;
