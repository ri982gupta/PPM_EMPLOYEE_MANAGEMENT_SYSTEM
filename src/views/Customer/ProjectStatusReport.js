import React, { useState, useEffect, useRef } from "react";
// import "./Search.scss";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { MultiSelect } from "react-multi-select-component";
import SearchDefaultTableProject from "./SearchDefaultTableProject";
import DatePicker from "react-datepicker";
import moment from "moment/moment";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import Loader from "../Loader/Loader";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { useLocation } from "react-router-dom";
import { BiCheck } from "react-icons/bi";
import "./ProjectStatusReport.scss";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
// import { environment } from "../../environments/environment";
function SearchVendor() {
  const baseUrl = environment.baseUrl;
  // const [searchdata, setSearchdata] = useState("1145,1146,1147");
  const [searchdata1, setSearchdata1] = useState("1145,1146");
  const [deleteid, setDeleteId] = useState("");
  const [linkColumns, setLinkColumns] = useState([]);
  const [checkboxSelect, setCheckboxSelect] = useState([]);

  const [loaderTimer, setLoaderTimer] = useState(false);
  const [dateTo, SetDateTo] = useState();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [country, setCountry] = useState([]);
  const [todate, SettoDate] = useState();
  const abortController = useRef(null);
  const controller = new AbortController();
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [operator, setOperator] = useState([]);
  const [VendorName, setVendorName] = useState([]);
  const [date, SetDate] = useState(null);
  const [data, SetData] = useState([]);
  const [searchapidata, setSearchApiData] = useState([]);
  const [disable, setDisable] = useState(true);
  const [validationMessage, setValidationMessage] = useState(false);
  const ref = useRef([]);
  const [deptarr, setdeptarr] = useState([]);
  const [displayState, setDisplayState] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const [allocateTypes, setAllocatTypes] = useState([]);
  const [bussinessUnitSeelect, setBussinessUnitSeelect] = useState(null);
  const [customerSelect, setCustomerSelect] = useState(null);
  const [projectallocateSelect, setProjectallocateSelect] = useState([]);
  const [projectHealthSelect, setProjectHealthSelect] = useState(null);
  const [businessUnit, setBussinessUnit] = useState([]);
  const [customerSource, setCustomerSource] = useState(null);
  const [data2, setData2] = useState([]);

  //.log("--------------------------------", businessUnit);

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;

  const loggedUserId = localStorage.getItem("resId");
  const initialValue = {
    logUserId: +loggedUserId,
    businessunit: null,
    assignedto: null,
    "Project Health": null,
    projectStatus: "1145,1146",
    projectsource: null,
    projectId: null,
    toDate,
    startDate,
  };
  const [customerName, setCustomerName] = useState([]);
  const [custname, setCustName] = useState("");
  const [projectsource, setProjectSource] = useState("");
  const currentDate = new Date();

  let rows = 4;
  const [endDate, setEndDate] = useState(new Date());
  const [datainfo, setDatainfo] = useState([]);
  const allocTypes = [
    // {value:"null",label:"ALL"},
    { value: "1145", label: "Projects With Allocations" },
    { value: "1146", label: "Projects Without Allocations" },
    { value: "1147", label: "Complete(Last 90 Days)" },
  ];
  const [selectedDepartments, setSelectedDepartments] = useState([
    { value: "1145", label: "Projects With Allocations" },
    { value: "1146", label: "Projects Without Allocations" },
  ]);
  //===========================
  const pageurl = "http://10.11.12.149:3000/#/executive/globalDashboard";
  const page_Name = "Global Dashboard";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [dataAccess, setDataAccess] = useState([]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Project Status Report"];

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
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
  }, []);
  const [formData, setFormData] = useState({});
  console.log(formData);
  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          logUserId: +filterData.logUserId,
          businessunit: filterData.businessunit,
          assignedto: +filterData.assignedto,
          "Project Health":
            filterData["Project Health"] == "null"
              ? null
              : filterData["Project Health"],
          projectStatus: filterData.projectStatus,
          projectsource:
            filterData.projectsource == "null"
              ? null
              : filterData.projectsource,
          projectId: +filterData.projectId,
          projectname: filterData.projectname,
        };
      } else {
        return {
          logUserId: +loggedUserId,
          businessunit: null,
          assignedto: null,
          "Project Health": null,
          projectStatus: "1145,1146",
          projectsource: null,
          projectId: null,
          projectname: "",
        };
      }
    });
  }, [filterData]);
  //.log(formData.assignedto);
  //.log(customerName);
  useEffect(() => {
    if (id != null) {
      const updatebusiness = businessUnit.filter((values) =>
        formData.businessunit?.includes(values.value)
      );
      const assignedToArray = Array.isArray(formData.assignedto)
        ? formData.assignedto
        : [formData.assignedto];
      const updatecustomer = customerName?.filter((values) =>
        assignedToArray.includes(values.id)
      );
      const customerNamedata = JSON.stringify(
        updatecustomer[0]?.full_name
      )?.replace(/"/g, "");
      const updateallocTypes = allocTypes.filter((values) =>
        formData.projectStatus?.includes(values.value)
      );
      const updateSource = formData.projectsource;

      setProjectSource(updateSource);
      setSelectedDepartments(updateallocTypes);
      setCustName(customerNamedata);
      setBussinessUnitSeelect(updatebusiness);
    }
  }, [
    id,
    formData.assignedto,
    customerName,
    formData.projectsource,
    formData.businessunit,
    formData.projectStatus,
  ]);

  useEffect(() => {
    if (id != null) {
      setTimeout(() => {
        handleClickSavedSerch();
      }, 4000);
    }
  }, [filterData]);

  //=======================================
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderTimer(false);
  };
  const bussinessUnit = () => {
    axios({
      method: "get",
      url: baseUrl + `/CostMS/cost/getDepartments`,
    }).then((res) => {
      var bunit = res.data;
      setBussinessUnit(bunit);
      //.log(bunit);
      // setAssign((prevProps) => ({ ...prevProps, ["Phase"]: value }));
    });
  };

  const getDocumentsPermission = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const modifiedUrlPath = "/executive/globalDashboard";
        getUrlPath(modifiedUrlPath);

        const getData = resp.data;
        console.log(getData);
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

        const filteredMenuItem = getData.find((item) => item.id === "533");

        setData2(sortedSubMenus);

        getData.forEach((item) => {
          if (item.display_name === textContent) {
            setRoutes([item]);
            sessionStorage.setItem("displayName", item.display_name);
          }
        });
        // Find the "Project Status Report" submenu
        const projectStatusReportSubMenu = getData
          .find((item) => item.display_name === "Delivery")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Project Status Report"
          );

        // Extract the access_level value
        const accessLevel = projectStatusReportSubMenu
          ? projectStatusReportSubMenu.access_level
          : null;

        setDataAccess(accessLevel);
      });
  };
  useEffect(() => {
    getDocumentsPermission();
  }, []);
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

  const resourceFnc = () => {
    axios
      .get(
        dataAccess === 500
          ? baseUrl + `/ProjectMS/Engagement/getCustomerName`
          : baseUrl +
              `/CommonMS/master/getCustomersList?loggedUserId=${loggedUserId}`
      )
      .then((res) => {
        let custom = res.data;
        const filteredData = custom.filter((item) => item.id !== 81084541);
        setCustomerName(filteredData);
      });
  };
  useEffect(() => {
    if (dataAccess === 500) {
      resourceFnc();
    }
  }, [dataAccess]);

  useEffect(() => {}, []);
  const removeFirstEntry = () => {
    SetData((prevDataList) => prevDataList.filter((_, index) => index !== 0));
  };
  useEffect(() => {
    removeFirstEntry();
  }, []);
  const handleClick = async () => {
    let countryIds = [];
    setTimeout(() => {
      setLoaderTimer(true);
    }, 2000);
    setLoading(true);

    await axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/getProjectDetailsinfo`,
      data: {
        logUserId: formData.logUserId,
        projectId: formData.projectId,
        unitId:
          formData.businessunit === null
            ? formData.businessunit
            : +formData.businessunit,
        accountId: formData.assignedto,
        healthId:
          formData["Project Health"] == "null"
            ? null
            : formData["Project Health"],
        stageId: formData.projectStatus,
        prjSource:
          formData.projectsource == "null" ? null : formData.projectsource,
      },
      // signal: abortController.current.signal,

      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      setLoaderTimer(false);

      let data = response.data;
      setCheckboxSelect([]);

      //.log(data);
      //.log(data?.id);

      //  let headerData = [{ checkbox: "checkbox", Analytics: "Analytics", prj_health: "Health", project_name: "Name", prj_manager: "Manager", business_unit: "Bussiness Ubit", customer: "Customer", del_manager: "Delivery Manager", ct_title: "Billing Model",category:"Project Type" ,prj_exe: "Exec Meth", planned_start_dt: "Pln St Dt",pln_end_dt:"Pln End Dt",prj_status:"Status",team_size:"Team Size" }]

      const Headerdata = [
        {
          Checkbox: "Checkbox",
          Analytics: "Analytics",
          prj_health: "Health",
          project_name: "Name",
          prj_manager: "Manager",
          business_unit: "Business Unit",
          customer: "Customer",
          del_manager: "Delivery Manager",
          ct_title: "Billing Model",
          category: "Project Type",
          prj_exe: "Exec Meth",
          planned_start_dt: "Pln St Dt",
          pln_end_dt: "Pln End Dt",
          prj_status: "Status",
          team_size: "Team Size",
        },
      ];

      SetData(Headerdata.concat(data));

      let data1 = ["project_name"];
      // let linkRoutes = ["/vendor/vendorDoc/:id"];/project/overview/789027
      let linkRoutes = ["/project/Overview/:projectId}"];
      setLinkColumns(data1);
      setLinkColumnsRoutes(linkRoutes);
      setLoading(false);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      setLoaderTimer(false);
      setDisplayState(false);

      setSearching(true);
    });
  };
  //========================================For Saved Search===============================
  const handleClickSavedSerch = async () => {
    let countryIds = [];
    setTimeout(() => {
      setLoaderTimer(true);
    }, 2000);
    setLoading(true);

    await axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/getProjectDetailsinfo`,
      data: {
        logUserId: +filterData.logUserId,
        projectId: +filterData.projectId,
        unitId:
          filterData.businessunit === null
            ? filterData.businessunit
            : +filterData.businessunit,
        accountId: +filterData.assignedto,
        healthId:
          filterData["Project Health"] == "null"
            ? null
            : filterData["Project Health"],
        stageId: filterData.projectStatus,
        prjSource:
          filterData.projectsource == "null" ? null : filterData.projectsource,
      },
      // signal: abortController.current.signal,

      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      let data = response.data;
      setCheckboxSelect([]);

      //.log(data);
      //.log(data?.id);

      //  let headerData = [{ checkbox: "checkbox", Analytics: "Analytics", prj_health: "Health", project_name: "Name", prj_manager: "Manager", business_unit: "Bussiness Ubit", customer: "Customer", del_manager: "Delivery Manager", ct_title: "Billing Model",category:"Project Type" ,prj_exe: "Exec Meth", planned_start_dt: "Pln St Dt",pln_end_dt:"Pln End Dt",prj_status:"Status",team_size:"Team Size" }]

      const Headerdata = [
        {
          Checkbox: "Checkbox",
          Analytics: "Analytics",
          prj_health: "Health",
          project_name: "Name",
          prj_manager: "Manager",
          business_unit: "Business Unit",
          customer: "Customer",
          del_manager: "Delivery Manager",
          ct_title: "Billing Model",
          category: "Project Type",
          prj_exe: "Exec Meth",
          planned_start_dt: "Pln St Dt",
          pln_end_dt: "Pln End Dt",
          prj_status: "Status",
          team_size: "Team Size",
        },
      ];

      SetData(Headerdata.concat(data));

      let data1 = ["project_name"];
      // let linkRoutes = ["/vendor/vendorDoc/:id"];/project/overview/789027
      let linkRoutes = ["/project/Overview/:projectId}"];
      setLinkColumns(data1);
      setLinkColumnsRoutes(linkRoutes);
      setLoading(false);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      setLoaderTimer(false);
      setDisplayState(false);

      setSearching(true);
    });
  };
  //=================================================================
  // useEffect(() => {}, [data]);

  console.log(startDate);
  const handleStartDateChange = (date) => {
    setStartDate(date);
    // Disable dates before the selected start date
    setToDate(null); // Reset the to date when the start date changes
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const minDate = startDate ? new Date(startDate) : null;
  const getCountries = () => {
    axios.get(baseUrl + `/CostMS/cost/getCountries`).then((Response) => {
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
    });
  };

  useEffect(() => {
    getCountries();
    bussinessUnit();
  }, []);
  const practice = [
    { id: "-1", value: "<Please Select>" },
    { id: "le", value: "≤" },
    { id: "ge", value: "≥" },
    { id: "eq", value: "=" },
  ];

  const onChangePractice = (e) => {
    const { value, id } = e.target;

    setOperator(id);
    if (e.target.value == "select") {
      setDisable(e.target.value);
      SetDate(null);
    } else {
      setDisable(false);
    }

    setFormData({ ...formData, [id]: value });
  };

  const DateChange = (e) => {
    SetDate(e);
    let formattedFromDate = moment(e).format("YYYY-MM-DD");
    setFormData({ ...formData, date: formattedFromDate });
  };

  const getName = (e) => {
    const { value, id } = e.target;
    setVendorName(value);
    setFormData({ ...formData, VendoreName: value });
  };
  //.log(formData, "line no----178");

  const HelpPDFName = "ProjectStatusReport.pdf";
  const Headername = "Project Status Report Help";

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
  return (
    <div>
      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Project Status Report</h2>
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
            <div className="saveBtn">
              <SavedSearchGlobal
                setEditAddmsg={setEditAddmsg}
                pageurl={pageurl}
                page_Name={page_Name}
                payload={formData}
              />
            </div>
          </div>
          <GlobalHelp pdfname={HelpPDFName} name={Headername} />
        </div>
      </div>
      <div className="col-md-12  mt-2">
        {validationMessage ? (
          <div
            className="errMsg"
            style={{ backgroundColor: "#F2DEDE", color: " #B94A48" }}
            timeout
          >
            {" "}
            <span>
              {" "}
              <IoWarningOutline /> Please select the valid values for
              highlighted fields{" "}
            </span>
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
      </div>

      <div className="group mb-3 customCard ">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="businessunit">
                  Business Unit
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="businessunit"
                    onChange={(e) => {
                      setBussinessUnitSeelect(e.target.value);
                      //.log(bussinessUnitSeelect);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["businessunit"]: e.target.value,
                      }));
                    }}
                    value={formData.businessunit}
                  >
                    <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                    {businessUnit.map((Item) => (
                      <option value={Item.value}> {Item.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customer">
                  Customer
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div className="autoComplete-container ">
                    <span className="auto" id="auto">
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={customerName}
                          inputSearchString={custname}
                          type="Text"
                          name="assignedto"
                          id="assignedto"
                          customerName={customerName}
                          // customerNames={customerNames}
                          fuseOptions={{ keys: ["id", "full_name"] }}
                          resultStringKeyName="full_name"
                          resourceFnc={resourceFnc}
                          // className="AutoComplete"
                          // onChange={(e) => { setCustomerSelect(e.target.value)
                          //   //.log(customerSelect)

                          // }}

                          onSelect={(e) => {
                            // setCustomerSelect((prevProps) => ({
                            //   ...prevProps,
                            //   "accountId": e.id,
                            // }));
                            setCustomerSelect(e.id);
                            setFormData((prevProps) => ({
                              ...prevProps,
                              assignedto: e.id,
                            }));
                          }}
                          showIcon={false}
                        />
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectname">
                  Project Name
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    className="form-control"
                    id="projectname"
                    placeholder
                    value={formData.projectname}
                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["projectname"]: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Project Health ">
                  Project Health{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="Project Health "
                    onChange={(e) => {
                      setProjectHealthSelect(e.target.value);
                      //.log(projectHealthSelect);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["Project Health"]: e.target.value,
                      }));
                    }}
                    value={formData["Project Health"]}
                  >
                    <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="498">On Schedule</option>
                    <option value="499">Potential Issues</option>
                    <option value="500">Serious Issues</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="prjalloc">
                  Prj Alloc
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="projectStatus"
                    options={allocTypes}
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

                      setSearchdata1(filteredValues.toString());
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["projectStatus"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectsource">
                  Project Source
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="projectsource"
                    onChange={(e) => {
                      setCustomerSource(e.target.value);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["projectsource"]: e.target.value,
                      }));
                    }}
                    value={formData.projectsource}
                  >
                    <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="ppm">PPM</option>
                    <option value="Projector">Projector</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="drf">
                  Data Range From{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  {/* <DatePicker
                    // selected={selectedDate}
                    showMonthDropdown
                    showYearDropdown
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd-MMM-yyyy"
                    maxDate={maxDate}
                    dropdownMode="select"
                    placeholderText="From Date"
                    disabledKeyboardNavigation
                  /> */}
                  <DatePicker
                    id="toDate"
                    showMonthDropdown
                    showYearDropdown
                    selected={startDate}
                    onChange={handleStartDateChange}
                    dateFormat="dd-MMM-yyyy"
                    dropdownMode="select"
                    placeholderText="From Date"
                    disabledKeyboardNavigation
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="to">
                  To{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    showMonthDropdown
                    showYearDropdown
                    dateFormat="dd-MMM-yyyy"
                    selected={toDate}
                    onChange={handleToDateChange}
                    minDate={minDate}
                    dropdownMode="select"
                    placeholderText="To Date"
                  />
                  {/* <DatePicker
                    name="toDate"
                    id="toDate"
                    selected={todate}
                    onChange={(e) => {
                      SettoDate(e);
                      //.log(moment(date).format("yyyy-MM-DD"));
                      setFormData((prev) => ({
                        ...prev,
                        ["toDate"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      // setMonth(e);
                    }}
                    locale="en-GB"
                    placeholderText="To Date"
                    // onChange={(date) => setStartDate(date)}
                    dateFormat="dd-MMM-yyyy"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  /> */}
                </div>
              </div>
            </div>
            {/* <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">

              <button type="submit" className="btn btn-primary"
            
            onClick={handleClick}
              >

                Search{" "}

              </button>

            </div> */}

            <center>
              <button
                type="button"
                className="btn btn-primary"
                title="Search"
                // onClick={handleClick}
                onClick={() => {
                  handleClick();
                  setCheckboxSelect([]);
                }}
              >
                <FaSearch /> Search{" "}
              </button>
            </center>
          </div>
        </CCollapse>
      </div>
      {searching ? (
        <SearchDefaultTableProject
          maxHeight1 = {maxHeight1}
          data={data}
          deleteid={deleteid}
          setDeleteId={setDeleteId}
          SetData={SetData}
          setDisplayState={setDisplayState}
          displayState={displayState}
          handleClick={handleClick}
          // datainfo={datainfo}
          searchapidata={searchapidata}
          deptarr={deptarr}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          checkboxSelect={checkboxSelect}
          setCheckboxSelect={setCheckboxSelect}
          // getDetailsInfo={getDetailsInfo}
        />
      ) : (
        " "
      )}
      {loaderTimer ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}

export default SearchVendor;
