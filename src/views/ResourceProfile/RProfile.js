import React, { useState, useEffect, useRef } from "react";
import CutomerRoles from "./CutomerRoles";
import ProjectDetails from "./ProjectDetails";
import ProjectRoles from "./ProjectRoles";
import ReporteeDetails from "./ReporteeDetails";
import SkillDetails from "./SkillDetails";
import TrainingDetails from "./TrainingDetails";
import ResourceHierarchy from "./ResourceHierarchy";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Loader from "../Loader/Loader";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { CCollapse } from "@coreui/react";
import { environment } from "../../environments/environment";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import axios from "axios";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
} from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import HierarchyViewTP from "./HierarchyViewTP";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import TeamsProfileHierarchy from "./TeamsProfileHierarchy";
import { useParams } from "react-router-dom";

function RProfile(props) {
  const { resId } = props;
  const loggedUserId = localStorage.getItem("resId");
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
  // //console.log(employeeData);
  const [resourceName, setResourceName] = useState([]);
  //console.log(resourceName);
  const [loader, setLoader] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [resper, setResper] = useState([]);
  const [issueDetails, setIssueDetails] = useState([]);
  //console.log(resper, "----resper");
  //console.log(employeeData);
  const getResProfileData = employeeData?.getResProfile;

  console.log(getResProfileData);
  const resName = getResProfileData?.[0]?.resName;
  //console.log(resName);

  const [upwardHierarchy, setUpwardHierarchy] = useState(resId - parseInt(1));
  console.log(upwardHierarchy);
  const ref = useRef([]);

  const [resource, setResource] = useState(loggedUserId);
  const HelpPDFName = "ResourceProfileTeams.pdf";
  const Header = "Resource Profile Help";
  const baseUrl = environment.baseUrl;

  const [routes, setRoutes] = useState([]);
  let textContent = "Teams";
  let currentScreenName = ["Profile", " Overview"];
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

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          console.log(item, "item");
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  const getData = () => {
    //console.log("line no 106");
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

  useEffect(() => {}, [issueDetails]);
  const [resDtl, setResDtl] = useState(null);
  const ResourceID = resper[0]?.id;
  useEffect(() => {
    if (ResourceID !== null) {
      setResDtl(ResourceID);
    }
  }, [ResourceID]);
  const resDtlHierarchy = parseInt(resDtl) - 1;
  const resHierarchyId = parseInt(loggedUserId) + 1;
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

  ///--------------------------------

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
      console.log(resp);
    });
  };
  const getEmployeeData1 = () => {
    let valid = GlobalValidation(ref);

    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getResProfile?rid=${resDtl}`,
    }).then(function (response) {
      var resp = response.data;
      setEmployeeData(resp);
      !valid && setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };

  const getResPersonalData1 = async () => {
    let valid = GlobalValidation(ref);

    setTimeout(() => {
      document.body.click();
    }, 1);
    await axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getResPerDetails?rid=${resDtl}`,
    }).then(function (response) {
      var resp = response.data;
      setResper(resp);
      !valid && setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      //console.log(resp);
    });
  };
  ///--------------------------------getResProfileUpwardhierarchy
  // const HierarchyId = Number(upwardHierarchy) - 1;
  console.log(firstId - parseInt(1));
  const [visibleC, setvisiblec] = useState(false);
  const getUpwardHierarchy = () => {
    setBool(false);
    setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getResProfileUpwardhierarchy?rid=${
          firstId - parseInt(1)
        }`,
    }).then(function (response) {
      console.log(response.data);
      if (response.data.length === 0) {
        const defaultValues = {
          department_id: -1,
          full_name: resourceName,
          has_childs: 0,
          id: resource,
          parent_id: -1,
          subRows: [],
        };
        console.log(defaultValues);
        setUpwardHierarchy([defaultValues]);
      } else {
        const hierarchyTree = jsonToTree(response.data);
        setUpwardHierarchy(hierarchyTree);
      }
      setBool(true);
      setLoader(false);
    });
  };
  console.log(">>visibleC", visibleC);
  useEffect(() => {
    getEmployeeData();
    getData();
    getResPersonalData();
    getUpwardHierarchy();
  }, []);

  const getUpwardHierarchy1 = () => {
    let valid = GlobalValidation(ref);

    setBool(false);
    setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getResProfileUpwardhierarchy?rid=${resDtlHierarchy}`,
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
        //console.log(defaultValues);
        setUpwardHierarchy([defaultValues]);
      } else {
        const hierarchyTree = jsonToTree(response.data);
        //console.log(hierarchyTree);
        setUpwardHierarchy(hierarchyTree);
      }
      setBool(true);
      setLoader(false);
      !valid && setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };

  const jsonToTree = (flatArray, options) => {
    options = {
      id: "id",
      parentId: "parent_id",
      children: "subRows",
      ...options,
    };
    const dictionary = {}; // a hash table mapping to the specific array objects with their ids as key
    const tree = [];
    const children = options.children;
    flatArray.forEach((node) => {
      const nodeId = node[options.id];
      const nodeParentId = node[options.parentId];
      // set up current node data in dictionary
      dictionary[nodeId] = {
        [children]: [], // init a children property
        ...node, // add other propertys
        ...dictionary[nodeId], // children will be replaced if this node already has children property which was set below
      };
      dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] }; // if it's not exist in dictionary, init an object with children property
      dictionary[nodeParentId][children].push(dictionary[nodeId]); // add reference to current node object in parent node object
    });
    // find root nodes
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
  };
  const onSearchClick = () => {
    let valid = GlobalValidation(ref);
    //console.log(valid);

    if (valid) {
      {
        setErrorMsg(true);
        setTimeout(() => {
          setErrorMsg(false);
        }, 3000);
      }
      return;
    }

    getEmployeeData1();
    getUpwardHierarchy1();
    getResPersonalData1();
  };

  return (
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
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Overview</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={Header} />
          </div>
        </div>
      </div>

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
            <div className={"col-md-2 "}>
              <CCollapse visible={!visibleC} setvisiblec="false">
                {visibleC == false ? (
                  <div className="childTwo">
                    <h2
                      style={{
                        textAlign: "left",
                        color: "#297AB0",
                        fontSize: "14px",
                        paddingTop: "7px",
                        cursor: "pointer",
                      }}
                    >
                      Reporting Hierarchy
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
                    </h2>
                  </div>
                ) : (
                  ""
                )}
                <div
                  style={{
                    minHeight: "calc(100vh - 225px)",
                    maxHeight: "calc(100vh - 225px)",
                    overflow: "auto",
                    border: "1px solid #ccc", // Add border style here
                    padding: "10px", // Optional padding for spacing
                  }}
                >
                  {bool ? (
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <TeamsProfileHierarchy
                        data={upwardHierarchy}
                        resId={resId}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </CCollapse>
            </div>
          </>
          <div className={visibleC == false ? "col-10" : "col-12"}>
            <div className="group  customCard mb-0">
              <CCollapse visible={!visible}>
                <div className="group-content row">
                  <div className="col-md-8 mb-2">
                    <div className="form-group row">
                      <label className="col-3" htmlFor="text-input-inline">
                        Resource Name{" "}
                        <span className=" error-text ml-1">*</span>
                      </label>
                      <span className="col-1">:</span>
                      <div
                        className="col-6 autocomplete"
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
                            inputSearchString={resper[0]?.name}
                            onSelect={(e) => {
                              setResDtl(e.id);
                              setResourceName(e.name);
                              const cleanedName = e.name.replace(
                                /\s*\(.*?\)\s*/g,
                                ""
                              );
                              setResourceName(cleanedName);
                              // setResource(parseInt(e.id) - parseInt(1));
                            }}
                            onClear={() => {
                              setResDtl(null);
                            }}
                            showIcon={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      title="Search"
                      onClick={() => {
                        onSearchClick();
                      }}
                    >
                      <FaSearch /> Search
                    </button>
                  </div>
                </div>
              </CCollapse>
            </div>
            <div>
              <div className="group mb-3 customCard">
                <h2>Resource Details</h2>
                <div className="group-content row">
                  <div className="col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-4" htmlFor="text-input-inline">
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
                      <label className="col-4" htmlFor="text-input-inline">
                        Designation
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-7">
                        {/* <p className="col-12" id="text-input-inline">
                          {getResProfileData?.[0]?.designation}
                        </p> */}
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
                      <label className="col-4" htmlFor="text-input-inline">
                        Employment Type
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-7">
                        {/* <p className="col-12" id="text-input-inline">
                          {getResProfileData?.[0]?.empType}
                        </p> */}
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
                      <label className="col-4" htmlFor="text-input-inline">
                        Gender
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-7">
                        {/* <p className="col-12" id="text-input-inline">
                          {getResProfileData?.[0]?.gender}
                        </p> */}
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
                      <label className="col-4" htmlFor="text-input-inline">
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
                      <label className="col-4" htmlFor="text-input-inline">
                        Citizenship
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-7">
                        {/* <p className="col-12" id="text-input-inline">
                          {getResProfileData?.[0]?.citizenship}
                        </p> */}
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
                      <label className="col-4" htmlFor="text-input-inline">
                        Business Unit
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-7">
                        {/* <p className="col-12" id="text-input-inline">
                          {getResProfileData?.[0]?.businessUnit}
                        </p> */}
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
                      <label className="col-4" htmlFor="text-input-inline">
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
                      <label className="col-4" htmlFor="text-input-inline">
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
                      <label className="col-4" htmlFor="text-input-inline">
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
                      <label className="col-4" htmlFor="text-input-inline">
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
                      <label className="col-4" htmlFor="text-input-inline">
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
                      <label className="col-4" htmlFor="text-input-inline">
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
                      <label className="col-4" htmlFor="text-input-inline">
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
                      <label className="col-4" htmlFor="text-input-inline">
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
                            : getResProfileData?.[0]?.SfOwnerDivision}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-2">
                    <div className="form-group row">
                      <label className="col-4" htmlFor="text-input-inline">
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
                </div>
              </div>
              {/* ) : (
                ""
              )} */}
              {employeeData?.getResProfileSubContract?.length > 0 ? (
                <div className="group mb-3 customCard">
                  <h2>Sub Contract Details</h2>

                  <div className="group-content row">
                    <div className="col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-4" htmlFor="text-input-inline">
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
                        <label className="col-4" htmlFor="text-input-inline">
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
                        <label className="col-4" htmlFor="text-input-inline">
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
                        <label className="col-4" htmlFor="text-input-inline">
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
                        <label className="col-4" htmlFor="text-input-inline">
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
                        <label className="col-4" htmlFor="text-input-inline">
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

              {/* <div className="classContent col-md-12">
                <div>
                  <CutomerRoles resDtl={resDtl} />
                </div>
                <div>
                  <ProjectRoles resDtl={resDtl} />
                </div>
                <div>
                  <ProjectDetails resDtl={resDtl} resper={resper} />
                </div>
                <div>
                  <ReporteeDetails resDtl={resDtl} />
                </div>
                <div>
                  <SkillDetails resDtl={resDtl} />
                </div>
                <div>
                  <TrainingDetails resDtlHierarchy={resDtlHierarchy} />
                </div>
              </div> */}
            </div>
            {/* ) : (
              ""
            )} */}
          </div>
        </div>
      </div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </>
  );
}

export default RProfile;
