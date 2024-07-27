import React, { useState, useRef, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import { getTableData } from "./RollsOffsTable";
import axios from "axios";
import moment from "moment/moment";
import { environment } from "../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { GoPerson } from "react-icons/go";
import Loader from "../Loader/Loader";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";

import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { CCollapse } from "@coreui/react";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Link } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";
import "../FullfimentComponent/RollOffs.scss";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function RollOffs(props) {
  const {
    permission,
    urlState,
    buttonState,
    setButtonState,
    setUrlState,
    permissionNew,
  } = props;
  const baseUrl = environment.baseUrl;
  const [exportData, setExportData] = useState([]);
  const ref = useRef([]);
  const [loaderState, setLoaderState] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [dataAr, setDataAr] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [monthval, setMonthval] = useState(new Date());
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [columnData2, setColumnData2] = useState([]);
  const [searching, setsearching] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const abortController = useRef(null);
  const HelpPDFName = "RollOffs.pdf";
  const HelpHeader = "Roll Off Help";

  const filterMondays = (date) => {
    return date.getDay() === 6; // 0-sunday,1-monday,2-tuesday,3-wednesday,4-thursday,5-friday,6-saturday,7-sunday
  };

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;

  const getCurrentMonday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : -1); // If today is Sunday, subtract 6 days to get previous Monday, otherwise add 1 day to get current Monday
    return new Date(now.setDate(diff));
  };
  const defaultDate = getCurrentMonday();

  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const Data = moment(monthval).startOf("month").format("yyyy-MM-DD");
  const Data1 = moment(startDate).format("yyyy-MMM-DD");
  const [open, setOpen] = useState(false);
  let rows = 25;

  useEffect(() => {
    let imp = ["XLS"];
    setExportData(imp);
  }, []);

  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          data-toggle="tooltip"
          title={data.project}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };

  const LinkTemplateAction = (data) => {
    let rou = linkColumnsRoutes[1]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          data-toggle="tooltip"
          title={data.customer}
        >
          {data[linkColumns[1]]}
        </Link>
      </>
    );
  };
  const rolenameToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.role_name}
      >
        {data.role_name}
      </div>
    );
  };
  const cslToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.csl}
      >
        {data.csl}
      </div>
    );
  };
  const dpToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.dp}
      >
        {data.dp}
      </div>
    );
  };
  const projectcodeToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.project_code}
      >
        {data.project_code}
      </div>
    );
  };
  const resourceToolip = (data) => {
    console.log(data, "dataforicons");
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.resource}
      >
        <div className="legendContainer" title={data.resource}>
          {data.resStatus == "fte1" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
            >
              <GoPerson className="icon" />
              <span title={data.resource} className="ellipsis">
                {data.resource}
              </span>
            </div>
          ) : data.resStatus == "subk1" ? (
            <div
              className="rollOffTableIcon amber ellipsis"
              title="Active Contractor"
            >
              <GoPerson className="icon" />
              <span title={data.resource}>{data.resource}</span>
            </div>
          ) : data.resStatus == "subk0" ? (
            <div className="rollOffTableIcon amber">
              <img
                className="rollOffTableIcon "
                src={subk_inactive}
                alt="(fte_inactive_icon)"
                style={{
                  height: "12px",
                  float: "left",
                  marginTop: "3px",
                  marginRight: "5px",
                }}
                title="Ex-Contractor"
              />
              <span title={data.resource}>
                <span>{data.resource}</span>
              </span>
            </div>
          ) : data.resStatus == "fte0" ? (
            <div className="ellipsis">
              <img
                src={fte_inactive}
                alt="(fte_inactive_icon)"
                style={{
                  height: "12px",
                  float: "left",
                  marginTop: "3px",
                  marginRight: "5px",
                }}
                title="Ex-Employee"
              ></img>

              <span title={data.resource}>
                <span>{data.resource}</span>
              </span>
            </div>
          ) : data.resStatus == "fte2" ? (
            <div className="ellipsis">
              <img
                src={fte_notice}
                alt="(fte_notice_icon)"
                style={{
                  height: "12px",
                  float: "left",
                  marginTop: "3px",
                  marginRight: "5px",
                }}
                title="Employee in notice period"
              />

              <span title={data.resource}>
                <span>{data.resource}</span>
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };
  const departmentToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.department}
      >
        {data.department}
      </div>
    );
  };
  const citizenshipToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.citizenship}
      >
        {data.citizenship}
      </div>
    );
  };
  const executiveToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.executive}
      >
        {data.executive}
      </div>
    );
  };

  const countryToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.country}
      >
        {data.country}
      </div>
    );
  };
  const allocenddateTooltip = (data) => {
    return (
      <div
        className="ellipsis "
        align="left"
        data-toggle="tooltip"
        title={moment(data.alloc_end_date).format("DD-MMM-yyyy")}
      >
        {data.alloc_end_date == null
          ? ""
          : data.alloc_end_date == ""
          ? ""
          : data.alloc_end_date == "No Data Found^&1^&13"
          ? "No Data Found"
          : moment(data.alloc_end_date).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const NextAllocTooltip = (data) => {
    return (
      <div
        className="ellipsis "
        align="left"
        data-toggle="tooltip"
        title={moment(data.nxt_alloc_date).format("DD-MMM-yyyy")}
      >
        {data.nxt_alloc_date == null
          ? ""
          : data.nxt_alloc_date == ""
          ? ""
          : data.nxt_alloc_date == "No Data Found^&1^&13"
          ? "No Data Found"
          : moment(data.nxt_alloc_date).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const managerTooltip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.manager}
      >
        {data.manager}
      </div>
    );
  };
  const actionCommentsTooltip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.actionComments}
      >
        {data.actionComments}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "project"
            ? LinkTemplate
            : col == "customer"
            ? LinkTemplateAction
            : col == "csl"
            ? cslToolip
            : col == "dp"
            ? dpToolip
            : col == "project_code"
            ? projectcodeToolip
            : col == "resource"
            ? resourceToolip
            : col == "department"
            ? departmentToolip
            : col == "citizenship"
            ? citizenshipToolip
            : col == "executive"
            ? executiveToolip
            : col == "country"
            ? countryToolip
            : col == "alloc_end_date"
            ? allocenddateTooltip
            : col == "nxt_alloc_date"
            ? NextAllocTooltip
            : col == "manager"
            ? managerTooltip
            : col == "actionComments"
            ? actionCommentsTooltip
            : col == "role_name" && rolenameToolip
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  // const customValueRenderer = (selected, _options) => {
  //   return selected.length === country.length ||
  //     selected.length === departments.length
  //     ? "<< ALL >>"
  //     : selected.length === 0
  //     ? "<< Please Select >>"
  //     : selected.map((label) => {
  //         return selected.length > 1 ? label.label + "," : label.label;
  //       });
  // };
  const initialValue = {
    BuIds: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    CountryIds: "6,5,3,8,7,1,2",
    type: "1",
    FromDate: moment(selectedDate).format("yyyy-MM-DD"),
    Duration: "1",
    FutureAlloc: "0",
  };
  const [formData, setFormData] = useState(initialValue);

  useEffect(() => {
    let tdata = getTableData();

    setDataAr(tdata);
  }, []);

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
            e.country_name == "NM" ? "" : countries.push(countryObj);
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

  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
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
      ["BuIds"]: filteredDeptData.toString(),
    }));
  };

  useEffect(() => {
    getDepartments();
    getCountries();
  }, []);

  var data = {
    BuIds: formData.BuIds,
    CountryIds: formData.CountryIds,
    FromDate: moment(selectedDate).format("yyyy-MM-DD"),
    Duration: formData.Duration,
    FutureAlloc: formData.FutureAlloc,
    isExport: "0",
    type: formData.type,
    monthVal: Data,
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };

  const postData = () => {
    setVisible(!visible);
    setsearching(true);
    let valid = GlobalValidation(ref);

    if (formData.BuIds == "" || formData.CountryIds == "") {
      if (valid) {
        {
          setValidationMessage(true);
          setTimeout(() => {
            setValidationMessage(false);
          }, 3000);
          setsearching(false);
        }
        return;
      }
    }
    setLoaderState(false);
    abortController.current = new AbortController();
    !valid && setVisible(!visible);

    axios
      .post(
        baseUrl + `/fullfilmentms/rolloffs/postRollOffs`,

        data,
        {
          signal: abortController.current.signal,
        }
      )
      .then((res) => {
        const GetData =
          res.data[1].alloc_end_date === "No Data Found^&1^&13"
            ? res.data.slice(2)
            : res.data.slice(1);
        GlobalCancel(ref);

        let Headerdata1 = [
          {
            alloc_end_date: "Alloc Ends",
            resource: "Resource",
            role_name: "Role",
            department: "Department",
            citizenship: "Citizenship",
            country: "Country",
            project: "Project",
            customer: "Customer",
            csl: "CSL",
            dp: "DP",
            project_code: "Project Code",
            manager: "Project Manager",
            executive: "Eng. Executive",
            actionComments: "Recent Action Item",
          },
        ];
        let Headerdata2 = [
          {
            alloc_end_date: "Alloc Ends",
            nxt_alloc_date: "Next Alloc",
            resource: "Resource",
            role_name: "Role",
            department: "Department",
            citizenship: "Citizenship",
            country: "Country",
            project: "Project",
            customer: "Customer",
            csl: "CSL",
            dp: "DP",
            project_code: "Project Code",
            manager: "Project Manager",
            executive: "Eng. Executive",
            actionComments: "Recent Action Item",
          },
        ];

        let data = ["project", "customer"];
        let linkRoutes = [
          "/project/Overview/:projectId",
          "/search/customerSearch/customer/dashboard/:custId",
        ];
        setLinkColumns(data);
        setLinkColumnsRoutes(linkRoutes);

        setColumnData(Headerdata1.concat(GetData));
        setColumnData2(Headerdata2.concat(GetData));

        setLoaderState(false);
        setsearching(false);
        setTimeout(() => {
          setLoaderState(false);
        }, 1000);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      });
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
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);

  let textContent = "Fullfilment";
  let currentScreenName = ["Bench Metrics", "Roll Offs"];
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

      data.forEach((item) => {
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
        `/CommonMS/security/authorize?url=/rmg/rollOff&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
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
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <div className="tabsProject">
              <ul className="tabsContainer">
                <button
                  className={
                    buttonState === "Bench Report"
                      ? "buttonDisplayClick"
                      : "buttonDisplay"
                  }
                  onClick={() => {
                    setButtonState("Bench Report");
                    setUrlState(
                      permission[3]?.display_name.url_path
                        ?.toString()
                        ?.replace(/::/g, "/")
                    );
                  }}
                >
                  Bench Report
                </button>{" "}
              </ul>
              <ul className="tabsContainer">
                <li>
                  <span>Deployment</span>
                  <ul>
                    {permissionNew.map((button) => (
                      <li
                        className={
                          buttonState === button.display_name
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState(button.display_name);
                          console.log(button.display_name);
                          setUrlState(
                            button.url_path?.toString()?.replace(/::/g, "/")
                          );
                        }}
                      >
                        {button.display_name}
                      </li>
                    ))}
                  </ul>
                </li>{" "}
              </ul>
              <ul className="tabsContainer">
                <button
                  className={
                    buttonState === "Roll Offs"
                      ? "buttonDisplayClick"
                      : "buttonDisplay"
                  }
                  onClick={() => {
                    setButtonState("Roll Offs");
                    setUrlState(
                      permission[3]?.display_name.url_path
                        ?.toString()
                        ?.replace(/::/g, "/")
                    );
                  }}
                >
                  <span>{"Roll Offs"}</span>
                </button>{" "}
              </ul>
            </div>
          </div>
          <div className="childTwo">
            <h2>Roll Offs</h2>
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
          </div>{" "}
        </div>
      </div>

      <div className="col-md-12  mt-2">
        {validationMessage ? (
          <div className="statusMsg error">
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
      </div>
      <div className="group mb-5 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="BuIds">
                  Business Unit&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      id="BuIds"
                      ArrowRenderer={ArrowRenderer}
                      options={departments}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedDepartments}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedDepartments(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });

                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["BuIds"]: filteredValues.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="CountryIds">
                  Country&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <MultiSelect
                      id="CountryIds"
                      options={country}
                      ArrowRenderer={ArrowRenderer}
                      hasSelectAll={true}
                      value={selectedCountry}
                      disabled={false}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => {
                        setSelectedCountry(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["CountryIds"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="type">
                  Type&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="type"
                    name="type"
                    defaultValue={1}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="1" selected="selected">
                      Week
                    </option>
                    <option value="2">Month</option>
                  </select>
                </div>
              </div>
            </div>
            {formData.type == "2" ? (
              <>
                {" "}
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="StartDt">
                      Month&nbsp;<span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <DatePicker
                        className="monthval"
                        id="monthval"
                        selected={monthval}
                        dateFormat="MMM-yyyy"
                        showMonthYearPicker
                        onChange={(date) => setMonthval(date)}
                        // isClearable={true}
                        // onCalendarClose={handleClear}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="week">
                      Week&nbsp;<span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <DatePicker
                        className="FromDate"
                        id="FromDate"
                        selected={selectedDate}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            ["FromDate"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setSelectedDate(e);
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        filterDate={filterMondays}
                        dateFormat="dd-MMM-yy"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Duration">
                  Duration&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="Duration"
                    name="Duration"
                    // value={1}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
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
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="FutureAlloc">
                  Future Alloc.
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="FutureAlloc"
                    name="FutureAlloc"
                    defaultValue={0}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="-1">&lt;&lt; Please Select &gt;&gt;</option>

                    <option value="0">No</option>

                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-1">
              <button
                type="submit"
                className="btn btn-primary"
                title="Search"
                onClick={postData}
              >
                <FaSearch />
                Search
              </button>
            </div>
            {loaderState ? <Loader handleAbort={handleAbort} /> : ""}
          </div>
        </CCollapse>
      </div>
      <div className="col-md-12 resourceOverviewEmp">
        <CellRendererPrimeReactDataTable
          className="primeReactDataTable"
          CustomersFileName = "RollOffs"
          rollOffDynaMaxHgt = {maxHeight1}
          data={columnData}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          exportData={exportData}
          rows={rows}
          fileName="RollOffs"
        />
      </div>
      {formData.FutureAlloc == "0" && searching ? (
        <div className="col-md-12 resourceOverviewEmp">
          <CellRendererPrimeReactDataTable
            className="primeReactDataTable"
            CustomersFileName = "RollOffs"
            rollOffDynaMaxHgt = {maxHeight1}
            data={columnData}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            exportData={exportData}
            rows={rows}
            fileName="RollOffs"
          />
        </div>
      ) : formData.FutureAlloc != "0" && searching ? (
        <div className="col-md-12 resourceOverviewEmp">
          <CellRendererPrimeReactDataTable
            className="primeReactDataTable"
            CustomersFileName = "RollOffs"
            rollOffDynaMaxHgt = {maxHeight1}
            data={columnData2}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            exportData={exportData}
            rows={rows}
            fileName="RollOffs"
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default RollOffs;
