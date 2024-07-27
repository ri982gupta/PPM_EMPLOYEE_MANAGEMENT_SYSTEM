import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import CSATTable from "./CSATTable";
import TargetRealisedPlanned from "./TargetRealisedPlanned";
import PracticeWiseMetrics from "./PracticeWiseMetrics";
import BUWiseMetrics from "./BUWiseMetrics";
import FeedbackjWiseMetrics from "./FeedbackjWiseMetrics";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import Loader from "../Loader/Loader";
import { useRef } from "react";
import { BiCheck } from "react-icons/bi";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function CSAT() {
  const [startDate, setStartDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [project, setProject] = useState([]);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [item, setItem] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [type, setType] = useState(1);
  const [table, setTable] = useState(1);
  const [dataAr, setDataAr] = useState([]);
  const [data, setData] = useState([{}]);
  const baseUrl = environment.baseUrl;
  const [dataAccess, setDataAccess] = useState([]);
  const [projWise, setProjWise] = useState([]);
  const [practiceWise, setPracticeWise] = useState([]);
  const [BUWise, setBUWise] = useState([]);
  const [feedbackWise, setFeedbackWise] = useState([]);
  const [metric, setMetric] = useState({ metric: -1 });
  const [chart, setChart] = useState(-1);
  const [graph, setGraph] = useState(false);
  const [isPCQA, setIsPCQA] = useState(false);
  console.log(metric.metric);
  const HelpPDFName = "CSATGovernance.pdf";
  const HelpHeaderName = "CSAT Help";
  const today = new Date();
  const loggedUserId = localStorage.getItem("resId");
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  let MonthDate = moment(firstDayOfMonth).format("yyyy-MM-DD");
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Governance";
  let currentScreenName = ["CSAT"];

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const marginSubMenu = data
        .find((item) => item.display_name === "Governance")

        .subMenus.find((subMenu) => subMenu.display_name === "CSAT");
      const accessLevel = marginSubMenu.userRoles.includes("561")
        ? 561
        : marginSubMenu.userRoles.includes("14")
          ? 14
          : marginSubMenu.userRoles.includes("46")
            ? 46
            : marginSubMenu.userRoles.includes("690")
              ? 690
              : marginSubMenu.userRoles.includes("641")
                ? 641
                : null;
      console.log(accessLevel, marginSubMenu);
      setDataAccess(accessLevel);
      if (accessLevel == 690 || accessLevel == 641) {
        axios
          .get(
            baseUrl +
            `/ProjectMS/project/getProjectsbyCslDp?loggedUserId=${Number(loggedUserId) + 1
            }`
          )
          .then((response) => {
            var resp = response.data;
            resp.push({ id: "-1", name: "<<ALL>>" });
            setProject(resp);
          });
      } else if (accessLevel == 46 || accessLevel == 14) {
        axios
          .get(
            baseUrl +
            `/ProjectMS/project/getprojectsforPm?userId=${loggedUserId}`
          )
          // .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
          .then((response) => {
            var resp = response.data;
            resp.push({ id: "-1", name: "<<ALL>>" });
            setProject(resp);
          });
      } else {
        axios({
          method: "get",
          url: baseUrl + `/ProjectMS/Audit/getProjectNameandId`,
        }).then(function (response) {
          var resp = response.data;
          setProject(resp);
        });
      }
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
        `/CommonMS/security/authorize?url=/pcqa/csatProjectSurveys&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  const handleMetric = (e) => {
    const { id, value } = e.target;
    setChart(value);
  };

  const initialValue = {
    action: 1,
    BU: "",
    customer: -1,
    projStg: 1,
    project: -1,
    csatMonth: MonthDate,
    duration: 3,
    status: -1, //1,1028
  };

  const [searchdata, setSearchdata] = useState(initialValue);
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

  const isPCQAorCSATAdmin = () => {
    axios
      .get(
        baseUrl + `/governancems/Csat/isPCQAorCSATAdmin?userId=${loggedUserId}`
      )
      .then((res) => {
        console.log("isPCQA:--", res.data);
        setIsPCQA(res.data);
      })
      .catch((error) => console.log(error));
  };

  {
    /*----------------Handle Change---------------- */
  }
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id == "action") {
      setType(value);
    }
    setSearchdata((prev) => {
      return { ...prev, [id]: value };
    });
  };

  {
    /*----------------Handle Search---------------- */
  }

  const [displayTable, setDisplayTable] = useState(false);
  console.log(displayTable, "displayTable");

  const [loader, setLoader] = useState(false);

  const [searchTrigger, setSearchTrigger] = useState(false);

  useEffect(() => {
    if (displayTable) {
      handleSearch();
    }
  }, [searchTrigger]);

  const handleSearch = () => {
    setLoader(true);
    setDisplayTable(false);
    if (type == "Metrics") {
      {
        /*----------------Project Wise---------------- */
      }

      axios({
        method: "get",
        url:
          baseUrl +
          `/governancems/Csat/GetProjectWiseCsatMetric?selectedMonth=${searchdata.csatMonth}`,
      }).then((res) => {
        console.log("Project Wise Metrics Data:>>>>>>", res.data);
        setProjWise(res.data);
        setLoader(false);
      });

      {
        /*----------------BU Wise---------------- */
      }

      axios({
        method: "get",
        url:
          baseUrl +
          `/governancems/Csat/GetBUWiseCsatMetric?selectedMonth=${searchdata.csatMonth}`,
      }).then((res) => {
        console.log("BU Wise Metrics Data:>>>>>>", res.data);
        setBUWise(res.data);
        setLoader(false);
      });

      {
        /*----------------Practice Wise---------------- */
      }

      axios({
        method: "get",
        url:
          baseUrl +
          `/governancems/Csat/GetPracticeWiseCsatMetric?selectedMonth=${searchdata.csatMonth}`,
      }).then((res) => {
        console.log("Practice Wise Metrics Data:>>>>>>", res.data);
        setPracticeWise(res.data);
        setLoader(false);
      });

      {
        /*----------------Feedback Wise---------------- */
      }

      axios({
        method: "get",
        url:
          baseUrl +
          `/governancems/Csat/GetCsatFeedbackSentRecMetrics?selectedMonth=${searchdata.csatMonth}`,
      }).then((res) => {
        console.log("Feedback Wise Metrics Data:>>>>>>", res.data);
        setFeedbackWise(res.data);
        setLoader(false);
      });
    } else {
      setDisplayTable(false);
      axios({
        method: "post",
        url: baseUrl + `/governancems/Csat/getPcqaCsatData`,
        data: {
          customer: searchdata.customer,
          projects: searchdata.project,
          month: searchdata.csatMonth,
          ProjStatus: searchdata.status == "1,1028" ? -1 : searchdata.status,
          loggedUser: localStorage.getItem("resId"),
          isPCQA: isPCQA,
          prjStage: searchdata.projStg,
          isWhat: "isSearch",
          units:
            searchdata.BU == ""
              ? "170,211,123,82,168,207,212,18,213,49,149,208,243"
              : searchdata.BU,
          type: searchdata.action,
          reportDur: type == 2 ? searchdata.duration : "",
        },
      }).then((res) => {
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setDisplayTable(true);
        const GetData = res.data.data;
        setData(GetData);
        setLoader(false);
      });
    }
    setTable(type);
    if (type == "Metrics") {
      setGraph(true);
      console.log(
        "wrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrronggggggggggggggggggggggggggggggggg"
      );
    } else {
      setGraph(false);
    }
    setMetric((prev) => {
      return { ...prev, metric: chart };
    });
  };

  {
    /*-------------------------Getting Status -------------------------*/
  }
  const [Status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const getStatus = () => {
    let status = [];
    status.push(
      { value: 1025, label: "New" },
      { value: 1028, label: "Sent For Survey" }
    );
    setStatus(status);
    setSelectedStatus(status.filter((ele) => ele.value > 0));
    let filteredType = [];
    status.forEach((data) => {
      if (data.value >= 0) {
        filteredType.push(data.value);
      }
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["status"]: filteredType.toString(),
    }));
  };

  {
    /*----------------Getting BU---------------- */
  }

  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`, //13
    });

    let departments = resp.data;
    departments = departments.filter((ele) => ele.value >= 0);
    setDepartments(departments);
    setSelectedDepartments(departments);
    let filteredDeptData = [];
    departments.forEach((data) => {
      filteredDeptData.push(data.value);
    });
  };

  {
    /*-------------------Getting Project-------------------- */
  }

  {
    /*-------------------Getting Customers-------------------- */
  }

  const getCustomers = () => {
    axios
      .get(
        baseUrl +
        `/governancems/Csat/getBuAccountsByRoleBookings?buIds=${searchdata.BU}`
      )
      .then((resp) => {
        let customers = resp.data;
        setCustomer(customers);
        let filteredCustData = [];

        customers.forEach((data) => {
          filteredCustData.push(data.value);
        });
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getStatus();
    getDepartments();
    // getProjectdata();
    isPCQAorCSATAdmin();
  }, []);

  useEffect(() => {
    getCustomers();
  }, [searchdata.BU]);

  const [saveMsg, setSaveMsg] = useState(false);
  return (
    <div>
      {saveMsg ? (
        <div className="statusMsg success">
          <span>
            <BiCheck style={{ marginTop: "-2px" }} />
            Saved Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>CSAT</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={HelpHeaderName} />
          </div>
        </div>
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="action">
                  Action
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    onChange={handleChange}
                    id="action"
                    disabled={!isPCQA}
                  >
                    <option value={1}>Initiation</option>
                    <option value={2}>Report</option>
                    <option value={"Metrics"}>Metrics</option>
                  </select>
                </div>
              </div>
            </div>
            {type == "Metrics" ? (
              ""
            ) : (
              <>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="businessUnit">
                      Business Unit
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <MultiSelect
                        className="multiselect"
                        id="BU"
                        options={departments}
                        ArrowRenderer={ArrowRenderer}
                        valueRenderer={generateDropdownLabel}
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

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["BU"]: filteredValues.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="customer">
                      Customer
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <select onChange={handleChange} id="customer">
                        <option value={-1}>&lt;&lt; ALL &gt;&gt;</option>
                        {customer?.map((Item) => (
                          <option key={Item.customerId} value={Item.customerId}>
                            {Item.customer}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="projStg">
                      Project Stage
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <select
                        onChange={handleChange}
                        defaultValue={1}
                        id="projStg"
                      >
                        <option value={-1}>&lt;&lt; ALL &gt;&gt;</option>
                        <option value={0}>New</option>
                        <option value={5}>Opportunity</option>
                        <option value={1}>In Progress</option>
                        <option value={3}>Withdrawn</option>
                        <option value={4}>On Hold</option>
                        <option value={6}>Pending Invoice</option>
                        <option value={2}>Completed(Last 1 Year)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="project">
                      Project
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={project}
                          type="Text"
                          name="prjId"
                          id="prjId"
                          className="error AutoComplete"
                          onSelect={(e) => {
                            setSearchdata((prevProps) => ({
                              ...prevProps,
                              project: e.id,
                            }));
                          }}
                          showIcon={false}
                          placeholder="Type minimum 3 characters"
                        />
                        <span> {item.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="csatMonth">
                  CSAT Month
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    id="csatMonth"
                    selected={new Date(searchdata.csatMonth)}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                    onChange={(e) => {
                      setSearchdata((prev) => ({
                        ...prev,
                        ["csatMonth"]: moment(e).format("yyyy-MM-DD"),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            {type == 1 || type == "Metrics" ? (
              ""
            ) : (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="duration">
                    Duration(Month)
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      defaultValue={3}
                      onChange={handleChange}
                      id="duration"
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
            )}

            {type == "Metrics" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="metric">
                    Metric Type
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select onChange={handleMetric} id="metric">
                      <option value={-1}>&lt;&lt; All &gt;&gt;</option>
                      <option value={1}>Project Wise CSAT Metrics</option>
                      <option value={2}>BU Wise CSAT Metrics</option>
                      <option value={3}>Practice Wise CSAT Metrics</option>
                      <option value={4}>Feedback sent vs Received</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="status">
                    Status
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <MultiSelect
                      id="status"
                      className="multiselect"
                      options={Status}
                      hasSelectAll={true}
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      value={selectedStatus}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedStatus(e);
                        let filteredType = [];
                        e.forEach((d) => {
                          filteredType.push(d.value);
                        });
                        setSearchdata((prevVal) => ({
                          ...prevVal,
                          ["status"]: filteredType.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                className="btn btn-primary "
                onClick={() => handleSearch()}
              >
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      {loader && <Loader handleAbort={() => setLoader(false)} />}
      <div>
        {!graph && displayTable ? (
          <CSATTable
            maxHeight1 = {maxHeight1}
            data={data}
            setData={setData}
            isPCQA={isPCQA}
            loggedUserId={loggedUserId}
            setSearchTrigger={setSearchTrigger}
            searchTrigger={searchTrigger}
            type={table}
            dataAccess={dataAccess}
            displayTable={displayTable}
            setSaveMsg={setSaveMsg}
            searchdata={searchdata}
          />
        ) : (
          ""
        )}

        {graph ? (
          <>
            {metric.metric == "1" ? (
              <div className="col-md-6">
                <TargetRealisedPlanned projWise={projWise} />
              </div>
            ) : (
              ""
            )}

            {metric.metric == "2" ? (
              <div className="col-md-6">
                <BUWiseMetrics BUWise={BUWise} />
              </div>
            ) : (
              ""
            )}

            {metric.metric == 3 ? (
              <div className="col-md-6">
                <PracticeWiseMetrics practiceWise={practiceWise} />
              </div>
            ) : (
              ""
            )}

            {metric.metric == 4 ? (
              <div className="col-md-6">
                <FeedbackjWiseMetrics feedbackWise={feedbackWise} />
              </div>
            ) : (
              ""
            )}

            {metric.metric == -1 ? (
              <div className="row">
                {projWise.length > 0 && (
                  <div className="col-md-6">
                    <TargetRealisedPlanned projWise={projWise} />
                  </div>
                )}

                {BUWise.length > 0 && (
                  <div className="col-md-6">
                    <BUWiseMetrics BUWise={BUWise} />
                  </div>
                )}

                {practiceWise.length > 0 && (
                  <div className="col-md-6">
                    <PracticeWiseMetrics practiceWise={practiceWise} />
                  </div>
                )}

                {feedbackWise.length > 0 && (
                  <div className="col-md-6">
                    <FeedbackjWiseMetrics feedbackWise={feedbackWise} />
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default CSAT;
