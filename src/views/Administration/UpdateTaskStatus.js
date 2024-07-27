import React, { useState, useEffect, useRef } from "react";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import axios from "axios";
import { environment } from "../../environments/environment";
import { CCollapse, CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import Draggable from "react-draggable";
import { Fragment } from "react";
import { VscSave } from "react-icons/vsc";
import { VscChromeClose } from "react-icons/vsc";
import { VscCircleSlash } from "react-icons/vsc";
import { BiCheck } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { FaSave } from "react-icons/fa";
import { AiFillWarning } from "react-icons/ai";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { AiOutlineCheck } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
} from "react-icons/fa";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function UpdateTaskStatus({ urlPath, visible, setVisible, setCheveronIcon }) {
  const [riskDetails, setRiskDetails] = useState([]);
  const [formData, setFormData] = useState({
    assigned_to: "",
    project_id: "",
    task_id: "",
    task_status: "",
    prj_id: "",
    statusId: "",
  });
  const [projects, setProjects] = useState([]);
  console.log(formData);
  const [projectId, setProjectId] = useState(0);
  const [tasklist, setTaskList] = useState([]);

  const [taskstatus, setTaskStatus] = useState([]);
  // console.log(taskstatus)
  const baseUrl = environment.baseUrl;
  // const projectmsbaseUrl = environment.projectmsbaseUrl;
  // const baseUrl = environment.admmsbaseUrl;
  const [buttonPopup, setButtonPopup] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [get, setGet] = useState("");

  const [sourceStatus, setSourceStatus] = useState([]);
  const [destinationStatus, setDestinationStatus] = useState([]);
  const [addVisisble, setAddVisible] = useState(false);

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Hammer Tool","Timesheet", "Update Task Status"];
  let textContent = "Administration";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({ routes: routes, currentScreenName: currentScreenName, textContent: textContent })
  );
  const ref = useRef([]);

  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setRiskDetails(res);
    });
  };
  useEffect(() => { }, []);

  useEffect(() => {
    getData();
    getMenus();
    getUrlPath();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let getData = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Roles Permissions" &&
              subMenu.display_name !== "Sales Permissions" &&
              subMenu.display_name !== "Jobs Daily Status" &&
              subMenu.display_name !== "Error Logs" &&
              subMenu.id != 27 &&
              subMenu.display_name !== "Tracker" &&
              subMenu.display_name !== "Role Costs" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents"
          );
        }
        return menu;
      });

      getData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name)

        }
      });
    }
    )
  }
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/admin/updateTaskStatus&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  console.log(formData);

  const onChangeHandler = (e) => {
    console.log("onChange Handler");
    const { id, value } = e.target;
    console.log("in line 53");
    console.log(id, value);
    setFormData((prev) => ({ ...prev, [e.target.id]: value }));
    setProjects();
    setTaskList();

    // setId();
  };

  //-----Project

  const handleProjects = (e) => {
    console.log(e?.target);
    axios({
      method: "post",
      url: baseUrl + `/administrationms/updatetask/getproject `,
      data: {
        res_id: formData.assigned_to,
      },
    }).then((res) => {
      let pro = res.data;
      console.log("in line 104");
      console.log(pro);
      setProjects(pro);
      // setProjectId(res[0].data.id);
      console.log(pro.project_name);
      // setId();
      // console.log(id)
    });
  };

  const handleTask = (e) => {
    console.log(e?.target);
    //const {setProjects,projects} = props

    axios({
      method: "post",
      url: baseUrl + `/administrationms/updatetask/getTaskList `,
      data: {
        res_id: formData.assigned_to,
        prj_id: e?.target?.value,
      },
      // console.log(first)
    }).then((res) => {
      let tsk = res.data;
      setTaskList(tsk);
      console.log(tsk);
    });
  };

  const handleTaskStatus = (e) => {
    axios({
      method: "post",
      url: baseUrl + `/administrationms/updatetask/getStatusID `,
      data: {
        res_id: formData.assigned_to,
        prj_id: formData.project_id,
        task_id: e?.target?.value,
      },
    }).then((res) => {
      let sts = res.data;
      setTaskStatus(sts);
      console.log(sts);
    });
  };

  useEffect(() => {
    // handleTaskStatus();
    handleProjects();
  }, [formData.assigned_to]);

  useEffect(() => {
    handleTask();
  }, [projectId]);

  //--------------StatusID-------------

  const [statusname, setStatusName] = useState([]);

  const StatusID = () => {
    axios({
      method: "get",
      url: baseUrl + `/administrationms/updatetask/getstatus`,
    }).then(function (response) {
      var res = response.data;
      setStatusName(res);
    });
  };
  useEffect(() => {
    StatusID();
  }, []);

  //------Post--------------

  const handleSaveClick = (e) => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/administrationms/updatetask/getresource?ResId=${formData.assigned_to
        }&PrjId=${formData.project_id}&PrjTaskId=${formData.task_id}&StatusId=${destinationStatus[0]?.id == undefined
          ? sourceStatus[0]?.id
          : destinationStatus[0]?.id
        }`,

      // `/administrationms/updatetask/getresource?ResId=${formData.assigned_to}&PrjId=${formData.project${formData.task_id}&StatusId=${formData.statusId}_id}&PrjTaskId=`,
      // data:
      // {
      //   "res_id": formData.assigned_to,
      //   "PrjId": formData.project_id,
      //   "PrjTaskId": formData.task_id,
      //   "StatusId": e?.target?.value,
      // },
    }).then((error) => {
      // setTaskStatus();

      setButtonPopup(false);
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
    });
    handleCancel();
  };

  const handleCancel = (e) => {
    let ele = document.getElementsByClassName("cancel");
    setProjects([]);
    setTaskList([]);
    setTaskStatus([]);

    console.log(ref);
    GlobalCancel(ref);

    console.log(ref);

    for (let index = 0; index < ele.length; index++) {
      console.log(ele[index]);
      console.log(ele[index].id);
      console.log(ele[index].value);
      ele[index].value = "";
      setValidationMessage(false);
      setAddmsg(false);
      console.log(ele[index].classList);
      console.log(ele[index].classList.contains("reactautocomplete"));

      if (ele[index].classList.contains("reactautocomplete")) {
        console.log(
          ele[index].children[0].children[0].children[0].children[0].children[0]
            .children[0].value
        );
        ele[
          index
        ].children[0].children[0].children[0].children[0].children[0].children[1].click();

        console.log(
          ele[index].children[0].children[0].children[0].children[0].children[0]
            .children[0]
        );

        console.log(ele[index]);
      }
    }
  };

  // let b = document.getElementsByClassName("autoComplete")
  // b.reset();

  //-----SAVE POPUP-------------

  function UpdateTaskStatusSave(props) {
    const {
      handleSaveClick,
      buttonPopup,
      setButtonPopup,
      sourceStatus,
      destinationStatus,
    } = props;

    return (
      <div>
        <Draggable>
          <CModal
            size="Default"
            visible={buttonPopup}
            className="ui-dialog"
            onClose={() => {
              setButtonPopup(false);
            }}
          >
            <CModalHeader style={{ cursor: "all-scroll" }}>
              <h6 style={{ color: "#297AB0" }}>Confirmation</h6>
            </CModalHeader>
            <CModalBody>
              <span>{`Are You Sure...you are updating task status from ${sourceStatus[0]?.description
                } to ${destinationStatus[0]?.description == undefined
                  ? sourceStatus[0]?.description
                  : destinationStatus[0]?.description
                } ?`}</span>
              <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
                <button
                  type="delete"
                  className="btn btn-primary"
                  onClick={(e) => {
                    handleSaveClick(e);
                    setFormData((prev) => ({
                      ...prev,
                      [e.target.id]: e.target.value,
                    }));
                  }}
                >
                  {/* <VscSave size="1.2em" />&nbsp;  */}
                  <AiOutlineCheck />
                  Yes
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setButtonPopup(false);
                  }}
                >
                  {/* <VscChromeClose size="1.2em" />&nbsp; */}
                  <AiOutlineClose />
                  No
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }

  const handleClick = () => {
    console.log("in  line 286----");

    console.log(ref);

    let valid = GlobalValidation(ref);

    console.log(valid);

    if (valid) {
      setValidationMessage(true);

      // setTimeout(() => {
      //   setValidationMessage(false);
      // }, 3000);

      return;
    }

    setButtonPopup(true);
    console.log(formData);
    console.log(taskstatus);
    console.log();
    let taskSttus = taskstatus[0]?.statusId;

    let selectedTaskStatus = formData["task_status"];
    let sourceData = JSON.parse(JSON.stringify(statusname));
    console.log(sourceData);
    let destinationData = JSON.parse(JSON.stringify(statusname));
    console.log(sourceData);
    let source = sourceData.filter((d) => d.id == taskSttus);
    let destination = destinationData.filter((d) => d.id == selectedTaskStatus);

    console.log("in line 274-----");
    console.log(source);
    console.log(destination);
    console.log(destination);
    setSourceStatus(source);
    setDestinationStatus(destination);
  };

  //--------------------------------

  return (
    <div>
      <div className="">
        {addmsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck
                size="1.4em"
              // color="green"
              // strokeWidth={{ width: "100px" }}
              />{" "}
              &nbsp; Task Status Updated Successfully
            </span>
          </div>
        ) : (
          ""
        )}
        {validationMessage ? (
          <div className="statusMsg error">
            <span className="error-block">
              <AiFillWarning /> &nbsp; Please select valid values for
              highlighted fields
            </span>
          </div>
        ) : (
          ""
        )}

        <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label
                    className="col-5"
                    htmlFor="Resource Name"
                    title="Resource Name"
                  >
                    Resource Name&nbsp; <span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div
                      className="autoComplete-container cancel  reactautocomplete"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <RiskAutoComplete
                        name="assigned_to"
                        id="assigned_to"
                        placeholder="Type minimum 3 characters"
                        value="0"
                        riskDetails={riskDetails}
                        // setState={setState}
                        getData={getData}
                        setFormData={setFormData}
                        onChangeHandler={onChangeHandler}
                      // refArr = {ref}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Projects" title="Project">
                    Project&nbsp;<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      className="error enteredDetails cancel text"
                      id="project_id"
                      onChange={(e) => {
                        handleTask(e);
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.id]: e.target.value,
                        }));
                      }}
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {projects.map((Item) => (
                        <option value={Item.id} key={Item.id}>
                          {Item.project_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label
                    className="col-5"
                    htmlFor="Task List"
                    title="Task List"
                  >
                    Task List&nbsp;<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      className="error enteredDetails cancel text"
                      name="task_id"
                      id="task_id"
                      onChange={(e) => {
                        handleTaskStatus(e);
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.id]: e.target.value,
                        }));
                      }}
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {tasklist.map((Item) => (
                        <option
                          value={Item.project_task_id}
                          key={Item.project_task_id}
                        >
                          {Item.task_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label
                    className="col-5"
                    htmlFor="Task Status"
                    title="Task Status"
                  >
                    Task Status&nbsp;<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      className="error enteredDetails  cancel text"
                      name="task_status"
                      id="task_status"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.id]: e.target.value,
                        }));
                      }}
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {statusname.map((Item) => (
                        <option
                          value={Item.id}
                          key={Item.id}
                          selected={
                            taskstatus[0]?.statusId == Item.id ? true : false
                          }
                        >
                          {Item.lkup_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleClick();
                  }}
                >
                  <FaSave /> Save{" "}
                </button>
                <button
                  className="btn btn-primary"
                  type="reset"
                  onClick={handleCancel}
                >
                  <ImCross /> Cancel{" "}
                </button>
              </div>
            </div>
          </CCollapse>
        </div>
        {buttonPopup ? (
          <UpdateTaskStatusSave
            handleSaveClick={handleSaveClick}
            buttonPopup={buttonPopup}
            setButtonPopup={setButtonPopup}
            setAddmsg={setAddmsg}
            setValidationMessage={setValidationMessage}
            sourceStatus={sourceStatus}
            destinationStatus={destinationStatus}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default UpdateTaskStatus;
