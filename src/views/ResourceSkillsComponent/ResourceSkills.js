import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaStar, FaPlus } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import Resources from "./Resources";
import moment from "moment";
import { SettingsRemoteSharp, WifiLock } from "@mui/icons-material";
// import getResourceData from "./ResourceSkillData";
// import { getTableData } from "./ResourceSkillData";
import { environment } from "../../environments/environment";
import DisplayStar from "./DisplayStar";
import { Pagination } from "@mui/lab";

import Loader from "../Loader/Loader";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import HierarchyView from "../Common/HierarchyView";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import ProjectHierarchyTree from "../ProjectComponent/ProjectHierarchyTree";
import ResourceSkillHierarchy from "./ResourceSkillHierarchy";
function ResourceSkills() {
  const [employeeData, setEmployeeData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loader1, setLoader1] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [hierarchydata, setHierarchyData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [bool, setBool] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);
  const [pageCount, setpageCount] = useState(1);
  const [itemOffSet, setItemOffSet] = useState(0);
  const itemPerPage = 10;
  const initialPage = 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(itemPerPage);
  const [finalRow, setFinalRow] = useState(itemPerPage);
  const totalRows = tableData.length;
  const Firstrow = itemOffSet + 1;
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    setItemOffSet(startIndex);
    setStartIndex(startIndex);
    setEndIndex(endIndex);
  }, [currentPage, itemPerPage]);
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const newOffSet = (currentPage - 1) * itemPerPage;
    setItemOffSet(newOffSet);
  }, [currentPage, itemPerPage]);

  useEffect(() => {
    const endOffset = itemOffSet + itemPerPage;
    const length = tableData.slice(itemOffSet, endOffset);

    if (endOffset > totalRows) {
      setFinalRow(totalRows);
    } else {
      setFinalRow(endOffset);
    }
    setCurrentItem(length);
    setpageCount(Math.ceil(tableData.length / itemPerPage));
    // displayTableFnc(length);
  }, [tableData, itemOffSet, itemPerPage, pageCount]);
  useEffect(() => {
    const endOffset = itemOffSet + itemPerPage;
    const length = tableData.slice(itemOffSet, endOffset);

    if (endOffset > totalRows) {
      setFinalRow(totalRows);
    } else {
      setFinalRow(endOffset);
    }
    setCurrentItem(length);
    setpageCount(Math.ceil(tableData.length / itemPerPage));
    // displayTableFnc(length);
  }, [tableData, itemOffSet, itemPerPage, pageCount]);

  let children = loggedUserId;
  const baseUrl = environment.baseUrl;
  const data = [];
  const nodeData = [];
  const directReportee = [];
  const HelpPDFName = "ResourceSkillTeams.pdf";
  const Header = "Resource Skill Help";
  const [routes, setRoutes] = useState([]);
  let textContent = "Teams";
  let currentScreenName = ["Resource Skills"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({ routes: routes, currentScreenName: currentScreenName, textContent: textContent })
  );

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {




    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/resource/hierarchy";
      getUrlPath(modifiedUrlPath);
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
  const getUrlPath = (modifiedUrlPath) => {
    console.log(modifiedUrlPath);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => { })
      .catch((error) => { });
  };
  const abortController = useRef(null);
  const [resourceClickId, setResourceClickId] = useState(loggedUserId);
  useEffect(() => { }, [resourceClickId]);
  console.log(resourceClickId);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
    setLoader1(false);
  };
  useEffect(() => {
    getEmployeeData();
    getEmployeeTableData();
  }, [resourceClickId]);
  useEffect(() => {
    getResourcehierarchy();
  }, []);
  const [showTables, setShowTables] = useState(false);
  const getEmployeeData = async () => {
    const loaderTime = setTimeout(() => {
      setLoader1(true);
    }, 3000);

    await axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getResourceDetails?rid=${resourceClickId}`,
    }).then(function (response) {
      var resp = response.data;
      setEmployeeData(resp);
      clearTimeout(loaderTime);
      setLoader1(false);
    });
  };

  const getEmployeeTableData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getSkillTableDetails?rid=${resourceClickId}`,
    }).then(function (response) {
      var resp = response.data;
      setTableData(resp);
    });
  };
  const [hierarchyCount, setHierarchyCount] = useState(0);

  const getResourcehierarchy = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    const loaderTime1 = setTimeout(() => {
      setLoader1(true);
    }, 2000);
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getResourcehierarchy?rid=${loggedUserId}`,
    }).then(function (response) {
      let dd = jsonToTree(response.data);
      setHierarchyData(dd);
      setHierarchyCount((prev) => prev + 1);
      setBool(true);
      // setLoader(false);
      clearTimeout(loaderTime);
      setLoader(false);
      setShowTables(true);
      clearTimeout(loaderTime1);

      setLoader1(false);
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
  const displayIssues = tableData.map((list, index) => {
    return (
      // tableData.length > 0 &&
      <tr className="table-fields" key={index}>
        <td className="ellipsis" title={list.group_name}>
          {list.group_name}
        </td>

        <td className="ellipsis" title={list.display_name}>
          {list.display_name}
        </td>
        <td className="ellipsis">
          <span>
            <DisplayStar skillRating={list.skill_rating_id} />
          </span>
        </td>
        <td className="ellipsis" title={list.experience}>
          {list.experience == null ? "NA" : list.experience}
        </td>
        <td
          className="ellipsis"
          title={list.skill_status == 1 ? "Approved" : "Requested"}
        >
          {list.skill_status == 1 ? "Approved" : "Requested"}
        </td>
        <td
          className="ellipsis"
          title={
            list.last_used == null
              ? ""
              : moment(list.last_used).format("DD-MMM-yyyy")
          }
        >
          {list.last_used == null
            ? "NA"
            : moment(list.last_used).format("DD-MMM-yyyy")}
        </td>
        <td className="ellipsis" title={list.skill_category}>
          {list.skill_category}
        </td>
      </tr>
    );
  });
  const currentData = displayIssues.slice(startIndex, endIndex);
  return (
    <>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Resource Skills</h2>
          </div>
          <div className="childThree toggleBtns">

            <GlobalHelp pdfname={HelpPDFName} name={Header} />
          </div>
        </div>
      </div>


      <div className="col-md-12  ">
        {showTables == true ? (
          <div className="group-content row">
            <div className="customCard col-md-3">
              <div className="childTwo">
                <h2>Resource</h2>
              </div>
              <div
                style={{
                  minHeight: "calc(100vh - 225px)",
                  maxHeight: "calc(100vh - 225px)",
                  overflow: "auto",
                  border: "1px solid #ccc", // Add border style here
                  padding: "10px",
                }}
              >
                {bool && (
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <ResourceSkillHierarchy
                      defaultExpandedRows={""}
                      data={hierarchydata}
                      setResourceClickId={setResourceClickId}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-9 ">
              {employeeData.map((ele) => {
                return (
                  <>
                    <h2
                      style={{
                        color: "#297AB0",
                        fontSize: "14px",
                        paddingTop: "7px",
                      }}
                    >
                      Resource Details
                    </h2>
                    <div className="customCard card mb-2">
                      <div>
                        <div className=" group-content row">
                          <div className="col-md-4 mb-2">
                            <div className="form-group row">
                              <label
                                className="col-4"
                                htmlFor="text-input-inline"
                              >
                                Name
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={ele.fullName}
                                >
                                  {ele.fullName == null ? "NA" : ele.fullName}{" "}
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
                                  title={ele.name}
                                >
                                  {ele.name == null ? "NA" : ele.name}{" "}
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
                                Title
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={ele.long_title}
                                >
                                  {ele.long_title == null
                                    ? "NA"
                                    : ele.long_title}{" "}
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
                                Official Email
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={ele.email_official}
                                >
                                  {ele.email_official == null
                                    ? "NA"
                                    : ele.email_official}{" "}
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
                                  title={ele.supervisorName}
                                >
                                  {ele.supervisorName == null
                                    ? "NA"
                                    : ele.supervisorName}{" "}
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
                                Office Ext.
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={ele.office_extn}
                                >
                                  {ele.office_extn == null ||
                                    ele.office_extn == ""
                                    ? "NA"
                                    : ele.office_extn}{" "}
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
                                Mobile Phone
                              </label>
                              <span className="col-1 p-0">:</span>
                              <div className="col-7">
                                <p
                                  className=" ellipsis tooltip-ex"
                                  data-toggle="tooltip"
                                  title={ele.office_phone}
                                >
                                  {(ele.office_phone == "-") |
                                    (ele.office_phone == "")
                                    ? "NA"
                                    : ele.office_phone}{" "}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
              <div className="col-md-12 darkHeader">
                <table
                  className="table table-bordered table-striped expenseTypeTable"
                  role="grid"
                >
                  <thead>
                    <tr>
                      <th>
                        <center>Skill Group</center>
                      </th>
                      <th>
                        <center>Skill</center>
                      </th>
                      <th>
                        <center>Rating</center>
                      </th>
                      <th>
                        <center>Exp(Months)</center>
                      </th>
                      <th>
                        <center>Status</center>
                      </th>
                      <th>
                        <center>Last Used</center>
                      </th>
                      <th>
                        <center>Type</center>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData
                    ) : (
                      <tr>
                        <td align="center" colSpan="7">
                          No Records Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div
                className="col-md-6 pagination justify-content-center"
                style={{ marginLeft: "283px" }}
              >
                <label style={{ align: "left" }}>
                  <Pagination
                    count={Math.ceil(displayIssues.length / itemPerPage)}
                    page={currentPage}
                    onChange={handlePageClick}
                    showFirstButton
                    showLastButton
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* <div className="group-content row">
          <div className="customCard col-md-3">
            <div className="childTwo">
              <h2>Resource</h2>
            </div>

            <div
              style={{
                minHeight: "calc(100vh - 225px)",
                maxHeight: "calc(100vh - 225px)",
                overflow: "auto",
                border: "1px solid #ccc", // Add border style here
                padding: "10px",
              }}
            >
              {bool && (
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <ResourceSkillHierarchy
                    defaultExpandedRows={""}
                    data={hierarchydata}
                    setResourceClickId={setResourceClickId}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="col-md-9 ">
            {employeeData.map((ele) => {
              return (
                <>
                  <h2
                    style={{
                      color: "#297AB0",
                      fontSize: "14px",
                      paddingTop: "7px",
                    }}
                  >
                    Resource Details
                  </h2>
                  <div className="customCard card mb-2">
                    <div>
                      <div className=" group-content row">
                        <div className="col-md-4 mb-2">
                          <div className="form-group row">
                            <label
                              className="col-4"
                              htmlFor="text-input-inline"
                            >
                              Name
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={ele.fullName}
                              >
                                {ele.fullName == null ? "NA" : ele.fullName}{" "}
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
                                title={ele.name}
                              >
                                {ele.name == null ? "NA" : ele.name}{" "}
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
                              Title
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={ele.long_title}
                              >
                                {ele.long_title == null ? "NA" : ele.long_title}{" "}
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
                              Official Email
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={ele.email_official}
                              >
                                {ele.email_official == null
                                  ? "NA"
                                  : ele.email_official}{" "}
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
                                title={ele.supervisorName}
                              >
                                {ele.supervisorName == null
                                  ? "NA"
                                  : ele.supervisorName}{" "}
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
                              Office Ext.
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={ele.office_extn}
                              >
                                {ele.office_extn == null ||
                                ele.office_extn == ""
                                  ? "NA"
                                  : ele.office_extn}{" "}
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
                              Mobile Phone
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-7">
                              <p
                                className=" ellipsis tooltip-ex"
                                data-toggle="tooltip"
                                title={ele.office_phone}
                              >
                                {(ele.office_phone == "-") |
                                (ele.office_phone == "")
                                  ? "NA"
                                  : ele.office_phone}{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            <div className="col-md-12 darkHeader">
              <table
                className="table table-bordered table-striped expenseTypeTable"
                role="grid"
              >
                <thead>
                  <tr>
                    <th>
                      <center>Skill Group</center>
                    </th>
                    <th>
                      <center>Skill</center>
                    </th>
                    <th>
                      <center>Rating</center>
                    </th>
                    <th>
                      <center>Exp(Months)</center>
                    </th>
                    <th>
                      <center>Status</center>
                    </th>
                    <th>
                      <center>Last Used</center>
                    </th>
                    <th>
                      <center>Type</center>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData
                  ) : (
                    <tr>
                      <td align="center" colSpan="7">
                        No Records Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div
              className="col-md-6 pagination justify-content-center"
              style={{ marginLeft: "283px" }}
            >
              <label style={{ align: "left" }}>
                <Pagination
                  count={Math.ceil(displayIssues.length / itemPerPage)}
                  page={currentPage}
                  onChange={handlePageClick}
                  showFirstButton
                  showLastButton
                />
              </label>
            </div>
          
          </div>
        </div> */}
      </div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {loader1 ? <Loader handleAbort={handleAbort} /> : ""}
    </>
  );
}

export default ResourceSkills;
