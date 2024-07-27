import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import AutoComplete from "./ProjectDefectsAutoComplete";
import { environment } from "../../environments/environment";
import ProjectDefectsPopUp from "./ProjectDefectsPopUp";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import Loader from "../Loader/Loader";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import ReactPaginate from "react-paginate";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { BiCheck } from "react-icons/bi";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "ag-grid-community";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function ProjectDefects(props) {
  const loggedUserName = localStorage.getItem("resName");
  const {
    projectId,
    grp4Items,
    urlState,
    setUrlState,
    btnState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp6Items,
    setbtnState,
  } = props;
  // console.log(grp4Items[6]?.is_write);
  const baseUrl = environment.baseUrl;
  const [filterVal, setFilterVal] = useState("");
  const [order, setOrder] = useState("ASC");
  const [searchApi, setSearchApi] = useState([]);
  const [tableData, setTableData] = useState([]);
  console.log(tableData.reported_res_id);
  const [loader, setLoader] = useState(false);
  const [edit, setEdit] = useState([]);
  const [editId, setEditId] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [searching, setSearching] = useState("");
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [phases, setPhases] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [phaseInjected, setPhaseInjected] = useState([]);
  const [assigneTo, setAssigneTo] = useState([]);
  const [assign, setAssign] = useState([]);
  const [projectIssueDetails, setProjectIssueDetails] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const searchdata = {
    projectid: projectId,
    title: null == "" ? null : null,
    defect_project_task_id: null,
    defect_project_injected_task_id: null,
    severity_id: null,
    priority_id: null,
    status_id: null,
    assigned_to: null,
    reported_by: null,
    defect_age: null,
    description: null,
  };
  const [formData, setFormData] = useState(searchdata);
  const [editedData, setEditedData] = useState(searchdata);
  const [type, setType] = useState("add");
  const [editmsg, setEditmsg] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [manager, setManager] = useState([]);
  const [state, setState] = useState("create");
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [issueDetails, setIssueDetails] = useState([]);
  const [resourceid, setResourceId] = useState();
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  useEffect(() => { }, [editedData]);
  useEffect(() => { }, [projectIssueDetails]);

  let rows = 10;
  console.log(tableData);
  const SnoAlign = (tableData) => {
    return <div align="center">{tableData.SNo}</div>;
  };
  const dataObject = grp4Items.find((item) => item.display_name === "Defects");

  const title = (tableData) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={tableData.title}>
        {tableData.title}
      </div>
    );
  };
  const phase = (tableData) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={tableData.phase}>
        {tableData.phase}
      </div>
    );
  };
  const PhaseInjected = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.phaseInjected}
      >
        {tableData.phaseInjected}
      </div>
    );
  };
  const Seviority = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.severity}
      >
        {tableData.severity}
      </div>
    );
  };
  const Priority = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.priority}
      >
        {tableData.priority}
      </div>
    );
  };
  const Status = (tableData) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={tableData.status}>
        {tableData.status}
      </div>
    );
  };
  const Assignedto = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.assignedTo}
      >
        {tableData.assignedTo}
      </div>
    );
  };
  const Reportedby = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.reportedBy}
      >
        {tableData.reportedBy}
      </div>
    );
  };
  const Description = (tableData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={tableData.descriptionClear}
      >
        {tableData.descriptionClear}
      </div>
    );
  };

  // axios call for project name //
  const handleProjectChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getProject`,
    })
      .then(function (resp) {
        let projectIssueDetail = resp.data;
        setProjectIssueDetails(projectIssueDetail);
      })
      .catch(function (err) { });
  };

  const formatResult = (item) => {
    return (
      <div className="result-wrapper">
        <span className="result-span">
          {item.ResName} (<span>{item.employeeNumber}</span>)
        </span>
      </div>
    );
  };
  // axios call for phase //
  const handlePhaseChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getDefectPhases`,
    }).then((res) => {
      let phase = res.data;
      setPhases(phase);
    });
  };

  // axios call for severity //
  const handleSeverityChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getSeverity`,
    }).then((res) => {
      let severty = res.data;
      setSeverity(severty);
    });
  };

  // axios call for priority //
  const handlePriorityChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getPriority`,
    }).then((res) => {
      let priorty = res.data;
      setPriority(priorty);
    });
  };

  // axios call for status //
  const handleStatusChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getStatus`,
    }).then((res) => {
      let stats = res.data;
      setStatus(stats);
    });
  };
  // axios call for phaseInjected //
  const handlePhaseInjectedChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getPhaseInjected`,
    }).then((res) => {
      let phaseInjeted = res.data;
      setPhaseInjected(phaseInjeted);
    });
  };
  // axios call for assignedTo //
  const handleAssigneToChange = () => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/ProjectMS/defectphases/autocomplete?projectId=${projectId}&searchKey=&isAll=0`,
    }).then((res) => {
      let assignTo = res.data;
      setAssigneTo(assignTo);
      console.log(res.data);
    }),
      [];
  };
  /// autocomplete for manager and sales executive
  const handleManager = () => {
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Engagement/getMnagerNameAndId`,
    }).then((res) => {
      let manger = res.data;
      setManager(manger);
      console.log(manager);
    });
  };
  useEffect(() => { }, [assigneTo]);
  useEffect(() => { }, [manager]);

  // breadcrumbs --
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Defect Details"];
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
      //   setData2(sortedSubMenus);
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
        `/CommonMS/security/authorize?url=/projectDefect/defectSearch/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  //---------------------assigned data-------------
  const getData = () => {
    console.log("line no 106");
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
      console.log("assigned data");
      console.log(res);
    });
  };
  useEffect(() => { }, [issueDetails]);

  useEffect(() => {
    getData();
  }, []);

  const [exportData, setExportData] = useState([]);
  useEffect(() => {
    let imp = ["XLS"];
    setExportData(imp);
  }, []);

  useEffect(() => {
    handlePhaseChange();
    handleSeverityChange();
    handlePriorityChange();
    handleStatusChange();
    handlePhaseInjectedChange();
    handleProjectChange();
    getTableData();
    handleAssigneToChange();
    handleManager();
    getProjectOverviewData();
  }, []);

  // axios call for defectDetails  //
  const getTableData = () => {
    setLoader(false);

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/defectphases/getDefectsDetails`,
      data: formData,
    })
      .then((res) => {
        const GetData = res.data;
        console.log(res.data);

        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
          // GetData[i]["description"] = GetData[i]["description"].replace(/<[^>]+>/g, '');

          // GetData[i]["description"] = GetData[i]["description"].innerHTMLTags;
          GetData[i]["descriptionClear"] = GetData[i]["description"].replace(
            /<\/?[^>]+(>|$)/g,
            ""
          );
        }
        let dataHeaders = [
          {
            SNo: "S.No",
            title: "Defect Title",
            phase: "Phase",
            phaseInjected: "Phase Injected",
            severity: "Severity",
            priority: "Priority",
            status: "Status",
            assignedTo: "Assigned To",
            reportedBy: "Reported By",
            descriptionClear: "Defect Description",
            defect_age: "Defect Age",
            Action: "Action",
          },
        ];
        let tableData = ["Action"];
        setLinkColumns(tableData);

        console.log(GetData);

        setTableData(dataHeaders.concat(GetData));
        console.log(res.data);
        // console.log("table data")
        setSearchApi(res.data);
        setEdit(res.data);
        setResourceId(GetData.reported_res_id);
        console.log(GetData.reported_res_id);
        setLoader(false);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .then((error) => {
        console.log("success", error);
      });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value == "null" ? null : value }));
    console.log(formData);
  };
  const handleClick = () => {
    console.log(formData);
    getTableData();
  };
  const LinkTemplate = (tableData) => {
    let rou = linkColumns[0];
    return (
      <>
        {/* <div align="center">
                    {<AiFillEdit color="orange" cursor="pointer" type="edit" size="1.2em" align="center"
                        onClick={() => {
                            setEditedData(tableData);
                            setEditId(tableData.id);
                            setOpenPopup(true);
                            setType("edit")
                        }}
                    />}

                </div> */}
        <div align="center">
          {grp4Items[6]?.is_write == true ? (
            <>
              <AiFillEdit
                title="edit"
                color="orange"
                cursor="pointer"
                type="edit"
                size="1.2em"
                onClick={() => {
                  setEditedData(tableData);
                  setEditId(tableData.id);
                  setOpenPopup(true);
                  setType("edit");
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
            </>
          )}
        </div>
      </>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "SNo" && SnoAlign) ||
          (col == "title" && title) ||
          (col == "phase" && phase) ||
          (col == "phaseInjected" && PhaseInjected) ||
          (col == "severity" && Seviority) ||
          (col == "priority" && Priority) ||
          (col == "status" && Status) ||
          (col == "assignedTo" && Assignedto) ||
          (col == "reportedBy" && Reportedby) ||
          (col == "descriptionClear" && Description) ||
          (col == "Action" && LinkTemplate)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setProjectData(resp);
        //    setPrjName(resp)
      })
      .catch(function (response) {
        console.log(response);
      });
  };
  const handleClear = () => {
    setFormData((prevProps) => ({ ...prevProps, reported_by: null }));
    setFormData((prevProps) => ({ ...prevProps, assigned_to: null }));
    const inputValue = document.getElementById("title").value;
    const titleValue = inputValue.trim() !== "" ? inputValue : null;
    setFormData((prevProps) => ({ ...prevProps, title: titleValue }));
  };
  return (
    <div>
      {addmsg ? (
        <div className="statusMsg success">
          <BiCheck size="1.5em" color="green" /> {"Defect saved Successfully"}
        </div>
      ) : (
        ""
      )}
      {editmsg ? (
        <div className="statusMsg success">
          <BiCheck size="1.5em" color="green" /> {"Defect edited Successfully"}
        </div>
      ) : (
        ""
      )}
      <div>
        <div className="col-md-12 ">
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
              <h2>Defect Details</h2>
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

        <div className="col-md-12  customCard">
          <CCollapse className="group-content row" visible={!visible}>
            <div className="form-group col-md-2" id="title">
              <label htmlFor="form-label">Defect Title</label>
              <label htmlFor="col-md-3 ">
                <input
                  type="text"
                  name="title"
                  id="title"
                  onChange={(e) => {
                    const { id, value } = e.target;
                    setFormData((prev) => ({
                      ...prev,
                      ["title"]: value == "" ? null : value,
                    }));
                  }}
                />{" "}
              </label>
            </div>
            <div className="form-group col-md-2" id="defect_project_task_id">
              <label htmlFor="form-label">Phase</label>
              <select
                className=" "
                id="defect_project_task_id"
                name="defect_project_task_id"
                onChange={(e) => handleChange(e)}
              >
                <option value="null"> &lt;&lt;Please Select&gt;&gt;</option>
                {phases.map((Item) => (
                  <option value={Item.id}> {Item.task_name}</option>
                ))}
              </select>
            </div>
            <div
              className="form-group col-md-2"
              id="defect_project_injected_task_id"
            >
              <label htmlFor="form-label">Phase Injected</label>
              <select
                className=" "
                id="defect_project_injected_task_id"
                name="defect_project_injected_task_id"
                onChange={(e) => handleChange(e)}
              >
                <option value="null"> &lt;&lt;Please Select&gt;&gt;</option>
                {phaseInjected.map((Item) => (
                  <option value={Item.id}> {Item.task_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-2" id="severity_id">
              <label htmlFor="form-label">Severity</label>
              <select
                className=""
                id="severity_id"
                name="severity"
                onChange={(e) => handleChange(e)}
              >
                <option value="null"> &lt;&lt;Please Select&gt;&gt;</option>
                {severity.map((Item) => (
                  <option value={Item.id}> {Item.lkup_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-2" id="priority_id">
              <label htmlFor="form-label">Priority</label>
              <select
                className=" "
                id="priority_id"
                name="priority"
                onChange={(e) => handleChange(e)}
              >
                <option value="null"> &lt;&lt;Please Select&gt;&gt;</option>
                {priority.map((Item) => (
                  <option value={Item.id}> {Item.lkup_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-2" id="status_id">
              <label htmlFor="form-label">Status</label>
              <select
                className=" "
                id="status"
                name="status"
                onChange={(e) => handleChange(e)}
              >
                <option value="null"> &lt;&lt;Please Select&gt;&gt;</option>
                {status.map((Item) => (
                  <option value={Item.id}> {Item.lkup_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-2 mt-1" id="assigned_to">
              <label htmlFor="form-label">Assigned To</label>
              <div className="autoComplete-container">
                <ReactSearchAutocomplete
                  items={assigneTo}
                  type="Text"
                  name="assigned_to"
                  id="assigned_to"
                  assigneTo={assigneTo}
                  handleAssigneToChange={handleAssigneToChange}
                  onChange={(e) => handleChange(e)}
                  fuseOptions={{ keys: ["id", "ResName", "employeeNumber"] }}
                  resultStringKeyName="ResName"
                  formatResult={formatResult}
                  onClear={handleClear}
                  onSelect={(e) => {
                    setFormData((prevProps) => ({
                      ...prevProps,
                      assigned_to: e.id == "" ? null : e.id,
                    }));
                  }}
                  showIcon={false}
                />
              </div>
            </div>
            <div className="form-group col-md-2 mt-1" id="reported_by">
              <label htmlFor="form-label">Reported By</label>
              <div className="autoComplete-container">
                <ReactSearchAutocomplete
                  items={assigneTo}
                  type="Text"
                  name="reported_by"
                  id="reported_by"
                  className="err"
                  assigneTo={assigneTo}
                  onClear={handleClear}
                  // onChange={(e) => handleChange(e)}
                  handleAssigneToChange={handleAssigneToChange}
                  fuseOptions={{ keys: ["id", "ResName", "employeeNumber"] }}
                  resultStringKeyName="ResName"
                  formatResult={formatResult}
                  // onChange={(e) => {  setFormData(prev => ({ ...prev, ["reported_by"]: e.id == "" ? null : e.id })) }}

                  onSelect={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      reported_by: e.id == "" ? null : e.id,
                    }));
                    console.log(e.id);
                  }}
                  showIcon={false}
                />
              </div>
            </div>
            <div className="form-group col-md-2 mt-1" id="description">
              <label htmlFor="form-label">Defect Description</label>
              <label htmlFor="col-md-12 ">
                <input
                  type="text"
                  name="description"
                  id="description"
                  onChange={(e) => {
                    const { id, value } = e.target;
                    setFormData((prev) => ({
                      ...prev,
                      ["description"]: value == "" ? null : value,
                    }));
                  }}
                />
              </label>
            </div>
            <div className="form-group col-md-2 mt-1" id="defect_age">
              <label htmlFor="form-label">Defect Age</label>
              <label className="col-md-12 ">
                <input
                  type="text"
                  name="defect_age"
                  id="defect_age"
                  onChange={(e) => {
                    const { id, value } = e.target;
                    setFormData((prev) => ({
                      ...prev,
                      ["defect_age"]: value == "" ? null : value,
                    }));
                  }}
                />
              </label>
            </div>
            <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                type="button"
                className="btn btn-primary"
                title="Search"
                value={searching}
                onClick={() => handleClick()}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
            {loader ? <Loader handleAbort={handleAbort} /> : ""}
          </CCollapse>
        </div>
        <div className="group mb-3 customCard">
          <div className="">
            <div className="col-md-12 no-padding">
              <CellRendererPrimeReactDataTable
                data={tableData}
                linkColumns={linkColumns}
                linkColumnsRoutes={linkColumnsRoutes}
                dynamicColumns={dynamicColumns}
                headerData={headerData}
                rows={rows}
                setHeaderData={setHeaderData}
                exportData={exportData}
                fileName="Project Defects"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 ">
                <button type="button" className="btn btn-primary"
                    onClick={() => { setOpenPopup(true); setType("add") }}> <MdOutlineSettingsSuggest />
                    Create Defect
                </button>

            </div> */}
      {/* {grp4Items[6].is_write == true ? ( */}
      <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
        {console.log(dataObject)}

        {dataObject?.is_write === true ? (
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
        ) : (
          ""
        )}
      </div>

      {/* ) : (
        ""
      )} */}

      {openPopup ? (
        <ProjectDefectsPopUp
          openPopup={openPopup}
          editId={editId}
          setOpenPopup={setOpenPopup}
          setEditedData={setEditedData}
          getTableData={getTableData}
          editedData={editedData}
          type={type}
          editmsg={editmsg}
          setEditmsg={setEditmsg}
          addmsg={addmsg}
          tableData={tableData}
          setAddmsg={setAddmsg}
          projectIssueDetails={projectIssueDetails}
          projectId={projectId}
          projectData={projectData}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default ProjectDefects;
