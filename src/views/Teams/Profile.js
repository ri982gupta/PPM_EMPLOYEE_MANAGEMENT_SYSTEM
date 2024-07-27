import React, { useState, useEffect, useRef } from "react";
import InnerOpen from "./InnerOpen";
import InnerSearch from "./InnerSearch";
import ProjectDetails from "../ResourceProfile/ProjectDetails";
import ReporteeDetails from "../ResourceProfile/ReporteeDetails";
import SkillDetails from "../ResourceProfile/SkillDetails";
import TrainingDetails from "../ResourceProfile/TrainingDetails";
import axios from "axios";
import { environment } from "../../environments/environment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Loader from "../Loader/Loader";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { CCollapse } from "@coreui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
  FaDownload,
  FaArrowLeft,
  FaRedo,
} from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { Link, useParams } from "react-router-dom";
import ProfileUtilisation from "../Dashboard/ProfileUtilisation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function Profile() {
  let topMenus = ["Profile", "Search", "Open"];
  const loggedUserId = localStorage.getItem("resId");
  const loggedResId = parseInt(loggedUserId) + 1;
  const [resourceId1, setResourceId1] = useState(loggedResId);
  const [resumeId, setResumeId] = useState(loggedResId);
  const [resDtl, setResDtl] = useState(null);
  const [resper, setResper] = useState([]);
  const resDtlHierarchy = parseInt(resDtl) - 1;
  let url = window.location.href;
  const value = "Teams";
  const [routes, setRoutes] = useState([]);
  const baseUrl = environment.baseUrl;
  const [buttonState, setButtonState] = useState(topMenus[0]);
  const resId = resourceId1;
  const [pep, setPep] = useState([]);

  const materialTableElement = document.getElementsByClassName("childOne");
  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  useEffect(() => {
    if (url.includes("profile")) {
      setButtonState("Profile");
    }

    let teamArr = url.split(":");
    setResourceId1(teamArr[teamArr.length - 1]);
  }, []);

  let textContent = "Teams";
  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const urlPathValue = resp.data[2].subMenus[1].url_path;
      const modifiedUrlPath = urlPathValue.replace(/::/g, "/");
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  {
    /**---------------------Code For Direct Reportees------------------ */
  }
  const [directReportees, setDirectReportees] = useState();
  const getDirectReportees = () => {
    if (resDtl == null || resDtl == undefined) {
      return;
    }
    axios({
      method: "GET",
      url: baseUrl + `/teamms/Hierarchy/getDirectReportees?resId=${resDtl}`,
    }).then((resp) => {
      let data = resp.data;
      setDirectReportees(data);
    });
  };
  const getDirectReporteesInitially = (id) => {
    axios({
      method: "GET",
      url: baseUrl + `/teamms/Hierarchy/getDirectReportees?resId=${id}`,
    }).then((resp) => {
      let data = resp.data;
      setDirectReportees(data);
    });
  };

  {
    /**--------------------------Global Filter------------------------- */
  }
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  {
    /**--------------------For Rendering Global Filter------------------- */
  }

  const renderHeader = () => {
    return (
      <>
        <div className="primeTableSearch" style={{ justifyContent: "center" }}>
          <span style={{ color: "#2e88c5", fontSize: "14px", margin: 0 }}>
            Direct Reportees
          </span>
        </div>

        <span
          style={{ display: "flex", justifyContent: "end", marginTop: "-26px" }}
        >
          <InputText
            className="globalFilter"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </>
    );
  };

  const header = renderHeader();

  {
    /**-------------------------Added Code Ended------------------------- */
  }

  const firstResId = parseInt(loggedUserId) + 1;

  const [bool, setBool] = useState(false);
  const { resourceId } = useParams();
  const updatedResId = resourceId?.replace(":", "") - parseInt(1);
  const FirstProfileId = updatedResId.length == 0 ? firstResId : updatedResId;
  const firstId = isNaN(FirstProfileId + parseInt(1))
    ? firstResId
    : FirstProfileId + parseInt(1);

  const [visible, setVisible] = useState(false);
  const [ArrowBack, setArrowBack] = useState(IoIosArrowBack);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [employeeData, setEmployeeData] = useState([]);
  const [resourceName, setResourceName] = useState([]);
  const [loader, setLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [issueDetails, setIssueDetails] = useState([]);
  const getResProfileData = employeeData?.getResProfile;
  const resName = getResProfileData?.[0]?.resName;
  const [upwardHierarchy, setUpwardHierarchy] = useState(resId - parseInt(1));
  const ref = useRef([]);
  const [searchCheveronIcon, setSearchCheveronIcon] =
    useState(FaChevronCircleUp);
  const [searchVisible, setSearchVisible] = useState(false);
  const [resource, setResource] = useState(loggedUserId);

  const HelpPDFName = "ResourceProfileTeams.pdf";
  const Header = "Resource Profile Help";
  const SearchHelpPDFName = "ResourceSearchViewList.pdf";
  const SearchHeader = "Resource Search View List Help";
  const ResourceHelpPDFName = "ResourceProfileTeams.pdf";
  const ResourceHeaderName = "Resource Profile Help";
  const ReporteeHelpPDFName = "ResourceProfileTeams.pdf";
  const ReporteeHeaderName = "Resource Profile Help";
  const SkillsHelpPDFName = "ResourceProfileTeams.pdf";
  const SkillsHeaderName = "Resource Profile Help";
  const TrainingHelpPDFName = "ResourceProfileTeams.pdf";
  const TrainingHeaderName = "Resource Profile Help";
  const UtilizationHelpPDFName = "AllocationDashboard.pdf";
  const UtilizationHeaderName = "Allocation Dashboard Help";

  const handleToggleClick = () => {
    setSearchVisible(!searchVisible);
    searchVisible
      ? setSearchCheveronIcon(FaChevronCircleUp)
      : setSearchCheveronIcon(FaChevronCircleDown);
  };

  let currentScreenName = ["Insights", " Overview"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  useEffect(() => {
    getMenusNew();
  }, []);

  const getMenusNew = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Profile") {
            return {
              ...submenu,
              display_name: "Insights",
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

  const getData = () => {
    setTimeout(() => {
      document.body.click();
    }, 2000);
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const ResourceID = resper[0]?.id;

  useEffect(() => {
    if (ResourceID !== null) {
      setResDtl(ResourceID);
      getDirectReportees(ResourceID);
    }
  }, [ResourceID]);

  useEffect(() => {
    if (ResourceID != null) {
      getDirectReporteesInitially(ResourceID);
    }
  }, [ResourceID]);

  ///--------------------------------Resource Details
  const getEmployeeData = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getResProfile?rid=${firstId}`,
    }).then(function (response) {
      var resp = response.data;
      setEmployeeData(resp);
    });
  };

  const getEmployeeDataByTable = (id) => {
    if (typeof id !== "undefined") {
      axios({
        method: "get",
        url: baseUrl + `/customersms/Customers/getResProfile?rid=${id}`,
      }).then(function (response) {
        var resp = response.data;
        setEmployeeData(resp);
      });
    }
  };

  ///--------------------------------

  const downloadEmployeeData = async () => {
    try {
      const response = await axios.get(
        baseUrl +
          `/LayoutMS/auth/downloadeResume?userId=${resumeId}&file=${pep?.[0]?.doc_name}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "clearancefrm (25).pdf";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const getResPersonalData = async () => {
    setTimeout(() => {
      document.body.click();
    }, 1);
    await axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getResPerDetails?rid=${firstId}`,
    }).then(function (response) {
      var resp = response.data;
      setResper(resp);
    });
  };

  ///--------------------------------getResProfileUpwardhierarchy
  const [visibleC, setvisiblec] = useState(false);
  const [sortedDataa, setSortedDataa] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selecredResId, setSelectedResId] = useState(Number(loggedUserId) + 1);
  useEffect(() => {
    setSelectedIndex(sortedDataa.length - 1);
  }, [sortedDataa]);

  const getPepProfileDataByDataTable = (id) => {
    axios({
      method: "get",
      url: baseUrl + `/LayoutMS/auth/getPepProfileData?userId=${id}`,
    }).then((res) => {
      let custom = res.data;
      setPep(custom);
    });
  };

  const getUpwardHierarchy = () => {
    setSortedDataa([]);
    setUpwardHierarchy([]);
    setBool(false);
    const loderTime = setTimeout(() => {
      setLoader(true);
    }, 1000);
    abortController.current = new AbortController();
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getResProfileUpwardhierarchy?rid=${
          firstId - parseInt(1)
        }`,
      signal: abortController.current.signal,
    }).then(function (response) {
      if (response.data.length === 0) {
        const defaultValues = {
          department_id: -1,
          full_name: resourceName,
          has_childs: 0,
          id: resource,
          parent_id: -1,
          subRows: [],
        };
        setUpwardHierarchy([defaultValues]);
      } else {
        const uniqueIds = new Set();
        const filteredData = response.data.filter((item) => {
          if ("id" in item && !uniqueIds.has(item.id)) {
            uniqueIds.add(item.id);
            return true;
          }
          return false;
        });
        const hierarchyTree = jsonToTree(filteredData);
        setUpwardHierarchy(hierarchyTree);

        const hierarchy = buildHierarchy(filteredData, null);
        const flattenedResult = [];
        const flattenHierarchy = (items) => {
          for (const item of items) {
            flattenedResult.push(item);
            if (item.children) {
              flattenHierarchy(item.children);
            }
          }
        };

        flattenHierarchy(hierarchy);
        setSortedDataa(flattenedResult.reverse());
      }
      setBool(true);
      getEmployeeData();
      setLoader(false);
      clearTimeout(loderTime);
    });
  };

  const buildHierarchy = (data, parentId) => {
    const result = [];

    for (const item of data) {
      if (item.parent_id === parentId) {
        const children = buildHierarchy(data, item.id);
        if (children.length > 0) {
          item.children = children;
        }
        result.push(item);
      }
    }

    return result;
  };

  const getUpwardHierarchyByAutoComplete = (id) => {
    setSortedDataa([]);
    setUpwardHierarchy([]);
    setBool(false);
    const loderTime = setTimeout(() => {
      setLoader(true);
    }, 1000);
    abortController.current = new AbortController();
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getResProfileUpwardhierarchy?rid=${id}`,
      signal: abortController.current.signal,
    }).then(function (response) {
      if (response.data.length === 0) {
        const defaultValues = {
          department_id: -1,
          full_name: resourceName,
          has_childs: 0,
          id: resource,
          parent_id: -1,
          subRows: [],
        };
        setUpwardHierarchy([defaultValues]);
      } else {
        const uniqueIds = new Set();
        const filteredData = response.data.filter((item) => {
          if ("id" in item && !uniqueIds.has(item.id)) {
            uniqueIds.add(item.id);
            return true;
          }
          return false;
        });
        const hierarchyTree = jsonToTree(filteredData);
        setUpwardHierarchy(hierarchyTree);

        const hierarchy = buildHierarchy(filteredData, null);
        const flattenedResult = [];
        const flattenHierarchy = (items) => {
          for (const item of items) {
            flattenedResult.push(item);
            if (item.children) {
              flattenHierarchy(item.children);
            }
          }
        };

        flattenHierarchy(hierarchy);
        setSortedDataa(flattenedResult.reverse());
      }
      setBool(true);
      getEmployeeDataByTable();
      setLoader(false);
      clearTimeout(loderTime);
    });
  };

  const getPepProfileDataRefresh = () => {
    axios({
      method: "get",
      url: baseUrl + `/LayoutMS/auth/getPepProfileData?userId=${loggedResId}`,
    }).then((res) => {
      let custom = res.data;
      setPep(custom);
    });
  };

  useEffect(() => {
    getUpwardHierarchy();
    getResPersonalData();
    getPepProfileDataRefresh();
  }, [loggedUserId]);

  const jsonToTree = (flatArray, options) => {
    options = {
      id: "id",
      parentId: "parent_id",
      children: "subRows",
      ...options,
    };
    const dictionary = {};
    const tree = [];
    const children = options.children;
    flatArray.forEach((node) => {
      const nodeId = node[options.id];
      const nodeParentId = node[options.parentId];
      dictionary[nodeId] = {
        [children]: [],
        ...node,
        ...dictionary[nodeId],
      };
      dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] };
      dictionary[nodeParentId][children].push(dictionary[nodeId]);
    });

    Object.values(dictionary).forEach((obj) => {
      if (typeof obj[options.id] === "undefined") {
        tree.push(...obj[children]);
      }
    });
    return tree;
  };

  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
    setSortedDataa([]);
    setUpwardHierarchy([]);
  };
  const onSearchClick = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
      }
      return;
    }
    getUpwardHierarchyByAutoComplete(resDtl - 1);
    getDirectReportees(resDtl);
    getEmployeeDataByTable(resDtl);
    getPepProfileDataByDataTable(resDtl);
  };
  const getUrlPathProfile = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${baseUrl}/CommonMS/security/authorize?url=/resource/profile&userId=${loggedUserId}`,
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (buttonState === "Profile") {
      getUrlPathProfile();
    }
  }, [buttonState]);

  return (
    <div>
      <>
        <div className="col-md-12">
          {errorMsg ? (
            <div className="statusMsg error col-12 mb-2">
              <span>
                <IoWarningOutline />
                &nbsp;{`Please enter resource name`}
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="pageTitle">
          <div className="childOne">
            <div className="tabsProject">
              {
                <ul className="tabsContainer">
                  <li>
                    {<span>Profile</span>}
                    <ul>
                      <li
                        className={
                          buttonState === "Profile"
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState("Profile");
                        }}
                      >
                        Overview
                      </li>
                      <li
                        className={
                          buttonState === "Utilization Dashboard"
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState("Utilization Dashboard");
                        }}
                      >
                        Utilisation Dashboard
                      </li>
                      <li
                        className={
                          buttonState === "Resource Allocation"
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState("Resource Allocation");
                        }}
                      >
                        Resource Allocation
                      </li>
                      <li
                        className={
                          buttonState === "Reportee Details"
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState("Reportee Details");
                        }}
                      >
                        Reportee Details
                      </li>
                      <li
                        className={
                          buttonState === "Skills Detalis"
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState("Skills Detalis");
                        }}
                      >
                        Skills Details
                      </li>
                      <li
                        className={
                          buttonState === "Training Details"
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState("Training Details");
                        }}
                      >
                        Training Details
                      </li>
                    </ul>
                  </li>

                  <button
                    className={
                      buttonState === "Search"
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setButtonState("Search");
                    }}
                  >
                    Search
                  </button>
                  <button
                    className={
                      buttonState === "Open"
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setButtonState("Open");
                    }}
                  >
                    Open
                  </button>
                </ul>
              }
            </div>
          </div>
          <div className="childTwo">
            {buttonState === "Profile" ? (
              <h2>
                Overview (
                {resourceName?.length > 0
                  ? resourceName?.split("(")[0]
                  : resper[0]?.name.split("(")[0]}
                )
              </h2>
            ) : buttonState === "Resource Allocation" ? (
              <h2>
                Resource Allocation (
                {resourceName?.length > 0
                  ? resourceName?.split("(")[0]
                  : resper[0]?.name.split("(")[0]}
                )
              </h2>
            ) : buttonState === "Reportee Details" ? (
              <h2>
                Reportee Details (
                {resourceName?.length > 0
                  ? resourceName?.split("(")[0]
                  : resper[0]?.name.split("(")[0]}
                )
              </h2>
            ) : buttonState === "Skills Detalis" ? (
              <h2>
                Skills Details (
                {resourceName?.length > 0
                  ? resourceName?.split("(")[0]
                  : resper[0]?.name.split("(")[0]}
                )
              </h2>
            ) : buttonState === "Training Details" ? (
              <h2>
                Training Details (
                {resourceName?.length > 0
                  ? resourceName?.split("(")[0]
                  : resper[0]?.name.split("(")[0]}
                )
              </h2>
            ) : buttonState === "Utilization Dashboard" ? (
              value === "Teams" ? (
                <h2>
                  Utilisation Dashboard (
                  {resourceName?.length > 0
                    ? resourceName?.split("(")[0]
                    : resper[0]?.name.split("(")[0]}
                  )
                </h2>
              ) : (
                <h2>
                  Allocation Dashboard (
                  {resourceName?.length > 0
                    ? resourceName?.split("(")[0]
                    : resper[0]?.name.split("(")[0]}
                  )
                </h2>
              )
            ) : buttonState === "Search" ? (
              <h2>Resource View List</h2>
            ) : buttonState === "Open" ? (
              <h2>Teams Search History</h2>
            ) : (
              ""
            )}
          </div>
          {buttonState === "Profile" ? (
            <div>
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
                <GlobalHelp pdfname={HelpPDFName} name={Header} />
              </div>
            </div>
          ) : buttonState === "Search" ? (
            <div>
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
                <GlobalHelp pdfname={SearchHelpPDFName} name={SearchHeader} />
              </div>
            </div>
          ) : buttonState === "Open" ? (
            <div>
              <div className="childThree toggleBtns"></div>
            </div>
          ) : buttonState === "Resource Allocation" ? (
            <div>
              <div className="childThree toggleBtns">
                <GlobalHelp
                  pdfname={ResourceHelpPDFName}
                  name={ResourceHeaderName}
                />
              </div>
            </div>
          ) : buttonState === "Reportee Details" ? (
            <div>
              <div className="childThree toggleBtns">
                <GlobalHelp
                  pdfname={ReporteeHelpPDFName}
                  name={ReporteeHeaderName}
                />
              </div>
            </div>
          ) : buttonState === "Skills Detalis" ? (
            <div>
              <div className="childThree toggleBtns">
                <GlobalHelp
                  pdfname={SkillsHelpPDFName}
                  name={SkillsHeaderName}
                />
              </div>
            </div>
          ) : buttonState === "Training Details" ? (
            <div>
              <div className="childThree toggleBtns">
                <GlobalHelp
                  pdfname={TrainingHelpPDFName}
                  name={TrainingHeaderName}
                />
              </div>
            </div>
          ) : buttonState === "Utilization Dashboard" ? (
            <div>
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
          ) : (
            ""
          )}
        </div>
        {buttonState === "Profile" ? (
          <div className="col-md-12 ">
            <div className="group-content row">
              <>
                {visibleC == true ? (
                  <span
                    className="backArrow"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setvisiblec(!visibleC);
                      visibleC
                        ? setArrowBack(IoIosArrowForward)
                        : setArrowBack(IoIosArrowBack);
                    }}
                  >
                    {visibleC ? <IoIosArrowForward /> : <IoIosArrowBack />}
                  </span>
                ) : (
                  ""
                )}
              </>

              <div className="col-12" style={{ padding: "12px" }}>
                <div className="group customCard mb-0 ">
                  <CCollapse visible={!visible}>
                    <div className="group-content customCard row">
                      <div className="col-md-10 mb-2">
                        <div className="form-group row">
                          <label className="col-3" htmlFor="text-input-inline">
                            Resource Name{" "}
                            <span className=" error-text ml-1">*</span>
                          </label>
                          <span className="col-1">:</span>
                          <div
                            className="col-4 autocomplete"
                            ref={(ele) => {
                              ref.current[0] = ele;
                            }}
                          >
                            <div className=" autoComplete-container">
                              <ReactSearchAutocomplete
                                items={issueDetails}
                                type="Text"
                                name="resName"
                                id="resName"
                                className="wrapperauto"
                                issueDetails={issueDetails}
                                getData={getData}
                                inputSearchString={
                                  resourceName?.length > 0
                                    ? resourceName
                                    : resper[0]?.name
                                }
                                onSelect={(e) => {
                                  setResDtl(e.id);
                                  setResumeId(e.id);
                                  setSelectedResId(e.id);
                                  setResourceName(e.name);
                                }}
                                onClear={() => {
                                  setResDtl(null);
                                }}
                                showIcon={false}
                              />
                            </div>
                          </div>
                          <div
                            className="col-1 d-flex justify-content-between"
                            style={{ gap: "10px" }}
                          >
                            <button
                              type="button"
                              className="btn btn-primary"
                              title="Search"
                              onClick={() => {
                                {
                                  onSearchClick();
                                }
                              }}
                            >
                              <FaSearch /> Search
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              title="Reload"
                              onClick={() => {
                                {
                                  window.location.reload();
                                }
                              }}
                            >
                              <FaRedo />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CCollapse>
                </div>

                <div
                  class="pull-left mr10"
                  style={{
                    display: "inline",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {sortedDataa.length !== 0
                    ? sortedDataa
                        .slice()
                        .reverse()
                        .map((a, index, array) => {
                          return (
                            <>
                              <span
                                key={index}
                                style={{
                                  color:
                                    selectedIndex == index
                                      ? "black"
                                      : "#207baf",
                                  fontWeight: "500",
                                }}
                              >
                                <span
                                  style={{
                                    cursor:
                                      selectedIndex == index
                                        ? "auto"
                                        : "pointer",
                                  }}
                                  onClick={() => {
                                    // getUpwardHierarchyByAutoComplete(a.id - 1);
                                    getDirectReporteesInitially(a.id);
                                    getEmployeeDataByTable(a.id);
                                    getPepProfileDataByDataTable(a.id);
                                    setResourceName(a.full_name);
                                    setResDtl(a.id);
                                    setSelectedIndex(index);
                                    setResourceName(
                                      issueDetails.find(
                                        (issue) => issue.id === a.id
                                      )?.name
                                    );
                                  }}
                                >
                                  {a.full_name}
                                </span>
                              </span>{" "}
                              {index !== sortedDataa.length - 1 ? (
                                <span
                                  className="ml10"
                                  style={{
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                  }}
                                >
                                  <FaArrowLeft />
                                </span>
                              ) : (
                                ""
                              )}
                            </>
                          );
                        })
                    : ""}
                </div>

                <div className="group customCard">
                  <div className="darkHeader  mt-2 ">
                    <DataTable
                      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                      currentPageReportTemplate="{first} to {last} of {totalRecords}"
                      rowsPerPageOptions={[10, 25, 50]}
                      value={directReportees}
                      paginator
                      filters={filters}
                      rows={10}
                      header={header}
                      showGridlines
                      className="primeReactDataTable reportsPrimeTable "
                      responsiveLayout="scroll"
                      emptyMessage="No Records found."
                    >
                      <Column
                        sortable
                        style={{ width: "2%" }}
                        field="id"
                        header="S. No"
                        body={(data, options) => (
                          <div style={{ textAlign: "center" }}>
                            {options.rowIndex + 1}
                          </div>
                        )}
                      ></Column>
                      <Column
                        sortable
                        style={{ width: "4%" }}
                        field="empId"
                        header="Emp Id"
                      ></Column>
                      <Column
                        sortable
                        field="empName"
                        header="Employee Name"
                        body={(data) => (
                          <div
                            style={{
                              color: "#15a7ea",
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.textDecoration = "underline")
                            }
                            onMouseOut={(e) =>
                              (e.target.style.textDecoration = "none")
                            }
                            onClick={() => {
                              setResDtl(data.resourceId);
                              getEmployeeDataByTable(data.resourceId);
                              getPepProfileDataByDataTable(data.resourceId);
                              getDirectReporteesInitially(data.resourceId);
                              getUpwardHierarchyByAutoComplete(data.userId);
                              setSelectedResId(data.resourceId);
                              setResourceName(
                                issueDetails.find(
                                  (issue) => issue.id === data.resourceId
                                )?.name
                              );
                            }}
                          >
                            {data.empName}
                          </div>
                        )}
                      ></Column>
                      <Column
                        sortable
                        field="deptName"
                        header="Department"
                      ></Column>
                      <Column sortable field="jobTitle" header="Title"></Column>
                      <Column
                        sortable
                        style={{ width: "10%" }}
                        field="ofcExtension"
                        header="Office Extn."
                        body={(data) =>
                          data.ofcExtension ? data.ofcExtension : "N/A"
                        }
                      ></Column>
                      <Column
                        sortable
                        style={{ width: "10%" }}
                        field="mobile"
                        header="Mobile"
                        body={(data) => (data.mobile ? data.mobile : "N/A")}
                      ></Column>
                    </DataTable>
                  </div>
                </div>
                {employeeData?.getResProfile ? (
                  <div>
                    <div className="group mb-3 customCard">
                      <h2>
                        Resource Details ({getResProfileData?.[0]?.resName})
                      </h2>
                      <div className="group-content row">
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Resource Name
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.resName}
                              >
                                {getResProfileData?.[0]?.resName == null
                                  ? ""
                                  : getResProfileData?.[0]?.resName}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Designation
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.designation}
                              >
                                {getResProfileData?.[0]?.designation == null
                                  ? ""
                                  : getResProfileData?.[0]?.designation}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Employment Type
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.empType}
                              >
                                {getResProfileData?.[0]?.empType == null
                                  ? ""
                                  : getResProfileData?.[0]?.empType}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Gender
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.gender}
                              >
                                {getResProfileData?.[0]?.gender == null
                                  ? ""
                                  : getResProfileData?.[0]?.gender}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Email ID
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className="ellipsis"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.emailID}
                              >
                                {getResProfileData?.[0]?.emailID}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Citizenship
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.citizenship}
                              >
                                {getResProfileData?.[0]?.citizenship == null
                                  ? ""
                                  : getResProfileData?.[0]?.citizenship}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Business Unit
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.businessUnit}
                              >
                                {getResProfileData?.[0]?.businessUnit == null
                                  ? ""
                                  : getResProfileData?.[0]?.businessUnit}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Supervisor
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.supervisor}
                              >
                                {getResProfileData?.[0]?.supervisor == null
                                  ? "-"
                                  : getResProfileData?.[0]?.supervisor}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Gross Capacity
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.gCapacity}
                              >
                                {getResProfileData?.[0]?.gCapacity == null
                                  ? ""
                                  : getResProfileData?.[0]?.gCapacity}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Joining Date
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.joiningDate}
                              >
                                {getResProfileData?.[0]?.joiningDate == null
                                  ? ""
                                  : getResProfileData?.[0]?.joiningDate}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              End Date
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.res_endDate}
                              >
                                {getResProfileData?.[0]?.res_endDate == null
                                  ? ""
                                  : getResProfileData?.[0]?.res_endDate}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Employee Status
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.user_status}
                              >
                                {getResProfileData?.[0]?.user_status == null
                                  ? ""
                                  : getResProfileData?.[0]?.user_status}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Net Capacity
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.nCapacity}
                              >
                                {getResProfileData?.[0]?.nCapacity == null
                                  ? ""
                                  : getResProfileData?.[0]?.nCapacity}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Country
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.country}
                              >
                                {getResProfileData?.[0]?.country == null
                                  ? ""
                                  : getResProfileData?.[0]?.country}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Sf Sales Division
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.SfOwnerDivision}
                              >
                                {getResProfileData?.[0]?.SfOwnerDivision == null
                                  ? ""
                                  : getResProfileData?.[0]
                                      ?.SfOwnerDivision}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Renewal Date
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={getResProfileData?.[0]?.renewalDate}
                              >
                                {getResProfileData?.[0]?.renewalDate == null
                                  ? ""
                                  : getResProfileData?.[0]?.renewalDate}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Resume
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <>
                                <div
                                  className="link-and-download-logo-container"
                                  style={{ display: "flex", gap: "2px" }}
                                >
                                  <div className="ellipsis">
                                    {pep?.[0]?.doc_name ? (
                                      <Link
                                        title={pep?.[0]?.doc_name}
                                        data-toggle="tooltip"
                                        style={{ cursor: "auto" }}
                                      >
                                        {pep?.[0]?.doc_name}
                                      </Link>
                                    ) : (
                                      "NA"
                                    )}
                                  </div>
                                  <div
                                    style={{
                                      color: "#1890ff",
                                      marginTop: "-2px",
                                    }}
                                  >
                                    {pep?.[0]?.doc_name == null ? (
                                      ""
                                    ) : (
                                      <FaDownload
                                        title="Download Resume"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          pep?.[0]?.doc_name == null
                                            ? ""
                                            : downloadEmployeeData();
                                        }}
                                      />
                                    )}
                                  </div>
                                </div>
                              </>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              LinkedIn
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7 ellipsis">
                              <a
                                href={pep?.[0]?.linkdin_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={
                                  pep?.[0]?.linkdin_link == null
                                    ? "NA"
                                    : pep?.[0]?.linkdin_link
                                }
                              >
                                {" "}
                                {pep?.[0]?.linkdin_link == null
                                  ? "NA"
                                  : pep?.[0]?.linkdin_link}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {employeeData?.getResProfileSubContract?.length > 0 ? (
                      <div className="group mb-3 customCard">
                        <h2>Sub Contract Details</h2>

                        <div className="group-content row">
                          <div className="col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-4"
                                htmlFor="text-input-inline"
                              >
                                External Email
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={
                                    employeeData?.getResProfileSubContract[0]
                                      ?.external_email
                                  }
                                >
                                  {employeeData?.getResProfileSubContract[0]
                                    ?.external_email == null
                                    ? ""
                                    : employeeData?.getResProfileSubContract[0]
                                        ?.external_email}{" "}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-4"
                                htmlFor="text-input-inline"
                              >
                                Resource Manager
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={
                                    employeeData?.getResProfileSubContract[0]
                                      ?.resource_manager
                                  }
                                >
                                  {employeeData?.getResProfileSubContract[0]
                                    ?.resource_manager == null
                                    ? ""
                                    : employeeData?.getResProfileSubContract[0]
                                        ?.resource_manager}{" "}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-4"
                                htmlFor="text-input-inline"
                              >
                                Cost Rate
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={
                                    employeeData?.getResProfileSubContract[0]
                                      ?.cost_rate
                                  }
                                >
                                  {employeeData?.getResProfileSubContract[0]
                                    ?.cost_rate == null
                                    ? ""
                                    : employeeData?.getResProfileSubContract[0]
                                        ?.cost_rate}{" "}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-4"
                                htmlFor="text-input-inline"
                              >
                                Company Category
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={
                                    employeeData?.getResProfileSubContract[0]
                                      ?.comp_category
                                  }
                                >
                                  {employeeData?.getResProfileSubContract[0]
                                    ?.comp_category == null
                                    ? ""
                                    : employeeData?.getResProfileSubContract[0]
                                        ?.comp_category}{" "}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-4"
                                htmlFor="text-input-inline"
                              >
                                Eligibility Rehire
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={
                                    employeeData?.getResProfileSubContract[0]
                                      ?.eligibility_rehire
                                  }
                                >
                                  {employeeData?.getResProfileSubContract[0]
                                    ?.eligibility_rehire == null
                                    ? ""
                                    : employeeData?.getResProfileSubContract[0]
                                        ?.eligibility_rehire}{" "}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-4"
                                htmlFor="text-input-inline"
                              >
                                Ext. Company Name
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={
                                    employeeData?.getResProfileSubContract[0]
                                      ?.external_comp_name
                                  }
                                >
                                  {employeeData?.getResProfileSubContract[0]
                                    ?.external_comp_name == null
                                    ? ""
                                    : employeeData?.getResProfileSubContract[0]
                                        ?.external_comp_name}{" "}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            {loader ? <Loader handleAbort={handleAbort} /> : ""}
          </div>
        ) : (
          ""
        )}
      </>
      {buttonState === "Resource Allocation" && (
        <ProjectDetails
          selecredResId={selecredResId}
          resDtl={resDtl}
          resper={resper}
          routes={routes}
          textContent={textContent}
          maxHeight1={maxHeight1}
        />
      )}
      {buttonState === "Reportee Details" && (
        <ReporteeDetails
          resDtl={resDtl}
          routes={routes}
          textContent={textContent}
          maxHeight1={maxHeight1}
        />
      )}
      {buttonState === "Skills Detalis" && (
        <SkillDetails
          resDtl={resDtl}
          routes={routes}
          textContent={textContent}
          maxHeight1={maxHeight1}
        />
      )}
      {buttonState === "Training Details" && (
        <TrainingDetails
          resDtlHierarchy={resDtlHierarchy}
          routes={routes}
          textContent={textContent}
          maxHeight1={maxHeight1}
        />
      )}
      {buttonState === "Utilization Dashboard" && (
        <ProfileUtilisation
          resDtl={resDtl}
          selecredResId={selecredResId}
          value={value}
          visibleProp={searchVisible}
          searchCheveronIcon={searchCheveronIcon}
          setSearchCheveronIcon={setSearchCheveronIcon}
          buttonState={buttonState}
          setSearchVisible={setSearchVisible}
        />
      )}

      {buttonState === "Search" && (
        <InnerSearch
          visibleProp={searchVisible}
          searchCheveronIcon={searchCheveronIcon}
          setSearchCheveronIcon={setSearchCheveronIcon}
          buttonState={buttonState}
          setSearchVisible={setSearchVisible}
          maxHeight1={maxHeight1}
        />
      )}
      {buttonState === "Open" && <InnerOpen setButtonState={setButtonState} />}
    </div>
  );
}

export default Profile;
