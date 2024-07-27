import React, { useRef, useState } from "react";
import "../../App.scss";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { useEffect } from "react";
import { environment } from "../../environments/environment";
import AutoComplete from "./IssuesAutocomplete";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";

import axios from "axios";
import AddPopup from "./AddPopup";
import { CCollapse } from "@coreui/react";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import Loader from "../Loader/Loader";
import { Column } from "ag-grid-community";
import { BiCheck } from "react-icons/bi";
import moment from "moment";
import ErrorLogTable from "../Administration/ErrorLogsTable";
import { ImCross } from "react-icons/im";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function ProjectIssues(props) {
  const {
    projectId,
    grp4Items,
    urlState,
    btnState,
    setbtnState,
    setUrlState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp6Items,
  } = props;
  console.log(grp4Items);
  console.log(grp4Items[5]?.is_write);
  let rows = 25;
  const baseUrl = environment.baseUrl;
  const [uid, setUid] = useState(0);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [editmsg, setEditmsg] = useState(false);
  const [searching, setSearching] = useState("");
  const [criticality, setCriticality] = useState([]);
  const [issueSource, setIssueSource] = useState([]);
  const [status, setStatus] = useState([]);
  const [searchApi, setSearchApi] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [issueDetails, setIssueDetails] = useState([]);
  const [issueDetails1, setIssueDetails1] = useState([]);
  console.log(issueDetails1);
  const [edit, setEdit] = useState([]);
  const [type, setType] = useState("add");
  const [projectIssueDetails, setProjectIssueDetails] = useState([]);
  const searchdata = {
    projectid: projectId,
    criticality: null,
    source: null,
    status: null,
    name: null,
    rca: null,
    assignedto: null,
    createdby: null,
    duedate: null,
  };
  const [editedData, setEditedData] = useState(searchdata);
  const [formData, setFormData] = useState(searchdata);
  const [editId, setEditId] = useState();
  const loggedUserName = localStorage.getItem("resName");
  const [projectData, setProjectData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [item, setItem] = useState([]);
  // const [permissions, setPermissions] = useState([]);
  const loggedUserId = localStorage.getItem("resId");

  // breadcrumbs --
  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Issues"];
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
      const getData1 = resp.data;
      const deliveryItem = getData1[7]; // Assuming "Delivery" item is at index 7

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
        `/CommonMS/security/authorize?url=/ProjectIssue/viewPrjIssues/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  console.log(routes);
  const dataObject = grp4Items.find((item) => item.display_name === "Issues");
  console.log(dataObject?.is_write, "****");
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const SnoAlign = (tableData) => {
    return <div align="center">{tableData.SNo}</div>;
  };
  const IssueName = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.Issue_Name}
      >
        {tableData.Issue_Name}
      </div>
    );
  };
  const Criticality = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.Criticality}
      >
        {tableData.Criticality}
      </div>
    );
  };
  const Status = (tableData) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={tableData.Status}>
        {tableData.Status}
      </div>
    );
  };
  const IssueSource = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.Issue_Source}
      >
        {tableData.Issue_Source}
      </div>
    );
  };
  const AssignedTo = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.Assigned_To}
      >
        {tableData.Assigned_To}
      </div>
    );
  };
  const RCADone = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.RCA_Done}
      >
        {tableData.RCA_Done == true ? "Yes" : "No"}
      </div>
    );
  };
  const CreatedBy = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.Created_By}
      >
        {tableData.Created_By}
      </div>
    );
  };
  const Comments = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.Comments}
      >
        {tableData.Comments}
      </div>
    );
  };
  const DueDate = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={moment(tableData.Due_Date).format("DD-MMM-yyyy")}
      >
        {tableData.Due_Date == null
          ? ""
          : moment(tableData.Due_Date).format("DD-MMM-yyyy")}
      </div>
    );
  };

  useEffect(() => {}, [item]);

  useEffect(() => {
    getIssueDetails();
  }, []);

  useEffect(() => {}, [editedData]);

  const getIssueDetails = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/issues/getDetails`,
    })
      .then(function (response) {
        var response = response.data;
        setProjectIssueDetails(response);
      })
      .catch(function (response) {});
  };
  useEffect(() => {}, [projectIssueDetails]);
  useEffect(() => {
    getCriticality();
    getIssueSource();
    getStatus();
    getTableData();
    getProjectOverviewData();
  }, []);

  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
    });
  };
  useEffect(() => {}, [issueDetails]);

  useEffect(() => {
    getData();
  }, []);

  const getData1 = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getAssignedData1`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails1(res);
    });
  };
  useEffect(() => {
    getData1();
  }, []);

  const getTableData = () => {
    setLoader(false);

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Issues/getIssuesTableData`,
      // url: `http://localhost:9000/ProjectMS/Issues/getIssuesTableData`,
      data: formData,
    })
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            Issue_Name: "Issue Name",
            Criticality: "Criticality",
            Status: "Status",
            Due_Date: "Due Date",
            Issue_Source: "Issue Source",
            Assigned_To: "Assigned To",
            RCA_Done: "RCA Done",
            Created_By: "Created By",
            Comments: "Comments",
            Action: "Action",
          },
        ];

        let dataHeaders1 = [
          {
            ...dataHeaders[0],
            date_created: "date_created",
          },
        ];

        let tableData = ["Action"];

        setLinkColumns(tableData);
        setTableData(dataHeaders.concat(GetData));
        setEditedData(dataHeaders1.concat(GetData));
        setSearchApi(res.data);
        setEdit(res.data);
        setLoader(false);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .then((error) => {});
  };

  const getCriticality = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getCriticality`,
    }).then((res) => {
      var criticality = res.data;
      setCriticality(criticality);
    });
  };
  const getIssueSource = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getIssueSource`,
    }).then((res) => {
      var issueSource = res.data;
      setIssueSource(issueSource);
    });
  };
  const getStatus = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatus`,
    }).then((res) => {
      var status = res.data;
      setStatus(status);
    });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value == "null" ? null : value }));
  };
  const handleClick = () => {
    getTableData();
  };
  const LinkTemplate = (tableData) => {
    let rou = linkColumns[0];

    return (
      <div align="center">
        {grp4Items[5]?.is_write == true ? (
          <>
            <AiFillEdit
              color="orange"
              type="edit"
              size="1.2em"
              align="center"
              onClick={() => {
                setEditedData(tableData);
                setEditId(tableData.id);
                setOpenPopup(true);
                setType("edit");
              }}
            />
            &nbsp;
            <AiFillDelete
              color="orange"
              title={"Delete"}
              onClick={() => {
                issueDeleteHandler(tableData.id);
              }}
            />
          </>
        ) : (
          <>
            <AiFillEdit
              color="orange"
              type="edit"
              size="1.2em"
              align="center"
              style={{ cursor: "not-allowed" }}
            />
            &nbsp;
            <AiFillDelete
              color="orange"
              title={"Delete"}
              className="pointerCursor disableField"
              disabled={true}
              style={{ cursor: "not-allowed", opacity: "0.35" }}
            />
          </>
        )}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "SNo"
            ? SnoAlign
            : (col == "RCA_Done" && RCADone) ||
              (col == "Criticality" && Criticality) ||
              (col == "Status" && Status) ||
              (col == "Criticality" && Criticality) ||
              (col == "Issue_Source" && IssueSource) ||
              (col == "Created_By" && CreatedBy) ||
              (col == "Comments" && Comments) ||
              (col == "Assigned_To" && AssignedTo) ||
              (col == "Issue_Name" && IssueName) ||
              (col == "Due_Date" && DueDate) ||
              (col == "Action" && LinkTemplate)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    tableData[0] && setHeaderData(JSON.parse(JSON.stringify(tableData[0])));
  }, [tableData]);
  //-------Projects Names---------------------

  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectData(resp);
        //    setPrjName(resp)
      })
      .catch(function (response) {});
  };
  const deleteIssue = () => {
    axios({
      method: "delete",
      url: baseUrl + `/ProjectMS/Issues/deleteIssueDetails?id=${uid}`,
      data: uid,
    }).then((error) => {
      setUid(0);
      getTableData();
      setDeletePopup(false);
      setDeleteMessage(true);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 3000);
    });
  };
  const issueDeleteHandler = (id) => {
    setDeletePopup(true);
    setUid(id);
  };
  const [exportData, setExportData] = useState([]);
  useEffect(() => {
    let imp = ["XLS"];
    setExportData(imp);
  }, []);

  const handleClear = () => {
    setFormData((prev) => ({ ...prev, createdby: null }));
  };
  function DeletePopup(props) {
    const { deleteIssue, deletePopup, setDeletePopup } = props;
    return (
      <div>
        <CModal
          visible={deletePopup}
          size="xs"
          className="ui-dialog"
          onClose={() => setDeletePopup(false)}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Delete Project Issue</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h6>Are you sure you want to delete Issue ?</h6>
            <div className="btn-container center my-2">
              <button
                type="delete"
                className="btn btn-primary"
                onClick={() => {
                  deleteIssue();
                }}
              >
                <AiFillDelete /> Delete{" "}
              </button>{" "}
              &nbsp; &nbsp;
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                {" "}
                <ImCross /> Cancel{" "}
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }
  return (
    <div>
      {deleteMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Issue Deleted Successfully"}
        </div>
      ) : (
        ""
      )}
      {addmsg ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Issue added Successfully"}
        </div>
      ) : (
        ""
      )}
      {editmsg ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Issue edited Successfully"}
        </div>
      ) : (
        ""
      )}
      <div>
        <div className="col-md-12">
          <div className="pageTitle">
            <div className="childOne">
              <ul className="tabsContainer">
                <li>
                  {grp1Items[0]?.display_name != undefined ? (
                    <span>{grp1Items[0]?.display_name}</span>
                  ) : (
                    ""
                  )}
                  <ul>
                    {grp1Items.slice(1).map((button) => (
                      <li
                        className={
                          btnState === button.display_name
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setbtnState(button.display_name);
                          setUrlState(
                            button.url_path.toString().replace(/::/g, "/")
                          );
                        }}
                      >
                        {button.display_name}
                      </li>
                    ))}
                  </ul>
                </li>{" "}
                <li>
                  {grp2Items[0]?.display_name != undefined ? (
                    <span>{grp2Items[0]?.display_name}</span>
                  ) : (
                    ""
                  )}
                  <ul>
                    {grp2Items.slice(1).map((button) => (
                      <li
                        className={
                          btnState === button.display_name
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setbtnState(button.display_name);
                          setUrlState(
                            button.url_path.toString().replace(/::/g, "/")
                          );
                        }}
                      >
                        {button.display_name}
                      </li>
                    ))}
                  </ul>
                </li>{" "}
                <li>
                  {grp3Items[0]?.display_name != undefined ? (
                    <span>{grp3Items[0]?.display_name}</span>
                  ) : (
                    ""
                  )}
                  <ul>
                    {grp3Items.slice(1).map((button) => (
                      <li
                        className={
                          btnState === button.display_name
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setbtnState(button.display_name);
                          setUrlState(
                            button.url_path.toString().replace(/::/g, "/")
                          );
                        }}
                      >
                        {button.display_name}
                      </li>
                    ))}
                  </ul>
                </li>{" "}
                <li>
                  {grp4Items[0]?.display_name != undefined ? (
                    <span>{grp4Items[0]?.display_name}</span>
                  ) : (
                    ""
                  )}
                  <ul>
                    {grp4Items.slice(1).map((button) => (
                      <li
                        className={
                          btnState === button.display_name
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setbtnState(button.display_name);
                          setUrlState(
                            button.url_path.toString().replace(/::/g, "/")
                          );
                        }}
                      >
                        {button.display_name}
                      </li>
                    ))}
                  </ul>
                </li>{" "}
                <li>
                  {grp6Items[0]?.display_name != undefined ? (
                    <span>{grp6Items[0]?.display_name}</span>
                  ) : (
                    ""
                  )}
                  <ul>
                    {grp6Items.slice(1).map((button) => (
                      <li
                        className={
                          btnState === button.display_name
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setbtnState(button.display_name);
                          setUrlState(
                            button.url_path.toString().replace(/::/g, "/")
                          );
                        }}
                      >
                        {button.display_name}
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>

            <div className="childTwo">
              <h2>Issues</h2>
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
            </div>
          </div>
        </div>

        <div className="col-md-12 customCard">
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-3 mb-2">
                <div className=" form-group row" id="criticality">
                  <label className="col-5">Criticality </label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      className="col-md-12 p0"
                      id="criticality"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      {criticality.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row" id="source">
                  <label className="col-5">Issue Source</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      className="col-md-12 p0"
                      id="source"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      {issueSource.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className=" form-group row" id="status">
                  <label className="col-5">Status </label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      className="col-md-12 p0"
                      id="status"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      {status.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row" id="name">
                  <label className="col-5">Issue Name</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <input
                      type="Text"
                      name="name"
                      id="name"
                      onChange={(e) => {
                        const { id, value } = e.target;
                        setFormData((prev) => ({
                          ...prev,
                          ["name"]: value == "" ? null : value,
                        }));
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row" id="rca">
                  <label className="col-5">RCA Done</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      className="col-md-12 p0"
                      id="rca"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      <option value="1" id="1">
                        {" "}
                        Yes{" "}
                      </option>
                      <option value="0" id="0">
                        {" "}
                        No{" "}
                      </option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row" id="assignedto">
                  <label className="col-5">Assigned To</label>
                  <label className="col-1 p-0">:</label>
                  <div className="col-6 ">
                    <div className="autoComplete-container">
                      <AutoComplete
                        id="assignedto"
                        name="assignedto"
                        issueDetails={issueDetails}
                        setFormData={setFormData}
                        getData={getData}
                        onChange={(e) => {
                          const { id, value } = e.target;
                          setFormData((prev) => ({
                            ...prev,
                            ["assignedto"]: id == "" ? null : id,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row" id="createdby">
                  <label className="col-5">Created By </label>
                  <label className="col-1 p-0">:</label>
                  <div className="col-6">
                    <div className="autoComplete-container">
                      <ReactSearchAutocomplete
                        items={issueDetails1}
                        id="createdby"
                        name="createdby"
                        onSelect={(selectedItem) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            createdby: selectedItem.id,
                          }));
                        }}
                        showIcon={false}
                        onClear={handleClear}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-2 btn-container center">
                <button
                  type="button"
                  className="btn btn-primary"
                  value={searching}
                  onClick={() => handleClick()}
                >
                  <FaSearch /> Search{" "}
                </button>
              </div>
            </div>
            {loader ? <Loader handleAbort={handleAbort} /> : ""}
          </CCollapse>
        </div>
        <div className="customCard">
          <div className="">
            <div className="col-md-12 no-padding">
              <ErrorLogTable
                data={tableData}
                rows={rows}
                linkColumns={linkColumns}
                linkColumnsRoutes={linkColumnsRoutes}
                dynamicColumns={dynamicColumns}
                headerData={headerData}
                setHeaderData={setHeaderData}
                exportData={exportData}
                fileName="Project Issues"
                maxHeight1={maxHeight1}
              />
              {dataObject?.is_write === true ? (
                <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setOpenPopup(true);
                      setType("add");
                    }}
                  >
                    <FaPlus />
                    Add
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {openPopup ? (
          <AddPopup
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            projectIssueDetails={projectIssueDetails}
            type={type}
            getTableData={getTableData}
            editId={editId}
            addmsg={addmsg}
            setAddmsg={setAddmsg}
            editmsg={editmsg}
            setEditmsg={setEditmsg}
            setEditedData={setEditedData}
            editedData={editedData}
            projectData={projectData}
            projectId={projectId}
          />
        ) : (
          ""
        )}
        {deletePopup ? (
          <DeletePopup
            deleteIssue={deleteIssue}
            deletePopup={deletePopup}
            setDeletePopup={setDeletePopup}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default ProjectIssues;
