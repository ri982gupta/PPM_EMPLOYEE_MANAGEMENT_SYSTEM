import { Dialog, DialogContent, DialogTitle, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { environment } from "../../environments/environment";
import axios from "axios";
import ReactQuill from "react-quill";
import AutoComplete from "./ProjectDefectsAutoComplete";
import { AiFillWarning, AiOutlinePaperClip } from "react-icons/ai";
import { MdOutlinePlaylistAdd, MdOutlineSettingsSuggest } from "react-icons/md";
import { AiFillFileAdd } from "react-icons/ai";
import { VscChromeClose } from "react-icons/vsc";
import "./Defects.css";
import { IoWarningOutline } from "react-icons/io5";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { FaPlus } from "react-icons/fa";

function ProjectDefectsPopUp(props) {
  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  const [resourceid, setResourceId] = useState(0);
  const baseUrl = environment.baseUrl;
  const [value, setValue] = useState("");
  const {
    openPopup,
    setOpenPopup,
    getTableData,
    tableData,
    type,
    editedData,
    setAddmsg,
    setEditmsg,
    projectId,
    editId,
    projectData,
  } = props;
  const [phases, setPhases] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [priority, setPriority] = useState([]);
  const [status, setStatus] = useState([]);
  const [phaseInjected, setPhaseInjected] = useState([]);
  const [assigneTo, setAssigneTo] = useState([]);
  const [assign, setAssign] = useState({
    project: "",
    title: "",
    defect_project_task_id: "",
    defect_project_injected_task_id: "",
    requirement: "",
    severity_id: "",
    priority_id: "",
    status_id: "",
    assigned_to: "",
    description: "",
    review_method_id: "",
  });
  const [reviewMethod, setReviewMethod] = useState([]);
  const [projectIssueDetails, setProjectIssueDetails] = useState([]);
  const [attachmentDoc, setAttachmentDoc] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);

  const [visible, setVisible] = useState(false);
  const [issueDetails, setIssueDetails] = useState([]);
  const ref = useRef([]);
  const [item, setItem] = useState([]);
  const [uniqueMessage, setUniqueMessage] = useState(false);
  const [initialformEditData, initialsetFormEditData] = useState(editedData);

  useEffect(() => {
    console.log(item);
  }, [item]);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (event) => {
    const files = event.target.files;
    const selectedFilesArray = Array.from(files);
    if (selectedFilesArray.length <= 10) {
      setSelectedFiles(selectedFilesArray);
    } else {
      alert("You can only upload a maximum of 10 files.");
      event.target.value = null; // clear the selected files
    }
  };

  const getResourceid = () => {
    console.log("line no 106");
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getresourceid?id=${loggedUserId}`,
    }).then(function (response) {
      var res = response.data;
      setResourceId(res);
    });
  };
  useEffect(() => {
    getResourceid();
  }, [resourceid]);

  const data = {
    projectid: projectId,
    title: "",
    priority_id: "",
    severity_id: "",
    status_id: "",
    assigned_to: "",
    description: "",
    defect_project_task_id: "",
    defect_project_injected_task_id: "",
    review_method_id: "",
    reported_by: "",
    description: "",
    comment: "",
  };
  const [formData, setFormData] = useState(data);
  const [formEditData, setFormEditData] = useState(editedData);

  useEffect(() => {}, [formEditData]);
  // axios call for phase //
  const handlePhaseChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getDefectPhases`,
    }).then((res) => {
      var phase = res.data;
      setPhases(phase);
    });
  };

  // axios call for severity //
  const handleSeverityChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getSeverity`,
    }).then((res) => {
      var severity = res.data;
      setSeverity(severity);
    });
  };

  // axios call for priority //
  const handlePriorityChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getPriority`,
    }).then((res) => {
      var priority = res.data;
      setPriority(priority);
      // setAssign((prevProps) => ({ ...prevProps, ["Priority"]: value }));
    });
  };

  // axios call for status //
  const handleStatusChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getStatus`,
    }).then((res) => {
      var status = res.data;
      setStatus(status);
      // setAssign((prevProps) => ({ ...prevProps, ["Status"]: value }));
    });
  };

  // axios call for phaseInjected //
  const handlePhaseInjectedChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getPhaseInjected`,
    }).then((res) => {
      var phaseInjected = res.data;
      setPhaseInjected(phaseInjected);
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
      var assigneTo = res.data;
      setAssigneTo(assigneTo);
      console.log(assigneTo);
    });
  };

  // axios call for project //
  const handleProjectChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getProject`,
    }).then((res) => {
      var projectIssueDetails = res.data;
      setProjectIssueDetails(projectIssueDetails);
    });
  };

  // axios call for reviewMethod //
  const handleReviewMethodChange = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getReviewMethod`,
    }).then((res) => {
      var reviewMethod = res.data;
      setReviewMethod(reviewMethod);
    });
  };

  const handleOpen = () => {
    setCreate(true);
  };

  const handleInputchange = () => {
    setAttachmentDoc(true);
  };
  //-------------ASSIGEND TO---------------
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
  useEffect(() => {}, [issueDetails]);

  useEffect(() => {
    getData();
  }, []);

  const editorToolBar = {
    toolbar: [
      [
        { header: [false, 1, 2, 3, 4, 5, 6] },
        { color: [] },
        "bold",
        "italic",
        "underline",
        { list: "ordered", title: "ordered" },
        { list: "bullet", title: "Bullet" },
        { script: "sub" },
        { script: "super" },
        { indent: "-1" },
        { indent: "+1" },
        { align: null },
        { align: "center" },
        { align: "right" },
        "strike",
        "link",
        "image",
        "code-block",
        "clean",
      ],
    ],
  };

  const handleBlur = () => {
    // validate the content
    if (!value || value.trim().length === 0) {
      console.log("The content is empty or contains only whitespace.");
    }
  };
  // axios call for Creating New Record //
  const handleAddData = () => {
    console.log(formData);
    console.log(editedData);
    console.log(tableData);
    let adddata = document.getElementsByClassName("error");

    let someDataa = tableData.some((d) => d.title === formData.title);
    console.log(someDataa);
    // if (formData == undefined) {
    if (someDataa) {
      console.log("1234567");
      let ele = document.getElementsByClassName("unique");
      console.log(ele.length);
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }
      console.log(ele);

      setUniqueMessage(true);
      setValidationMessage(false);
      // setValidationMessage(false);
      setTimeout(() => {
        // setValidationMessage(false);
      }, 3000);
      return;
    }
    if (someDataa) return;
    for (let i = 0; i < adddata.length; i++) {
      if (
        adddata[i].value == "" ||
        adddata[i].value == "null" ||
        adddata[i].value == "All" ||
        adddata[i].value == undefined
      ) {
        adddata[i].classList.add("error-block");
        // textdata[0].classList.add("ErrMS")
        setValidationMessage(true);
        setUniqueMessage(false);
      } else {
        adddata[i].classList.remove("error-block");

        setValidationMessage(false);
      }
    }

    // if (formData.description == "" || undefined || null) {
    //     // setDespValidation(true);
    //     setValidationMessage(true);

    // } else {
    //     setDespValidation("");
    // }

    let name = formData.title;
    let Phase = formData.defect_project_task_id;
    let Review = formData.review_method_id;
    let description = formData.description;
    let status = formData.status_id;

    if (
      Object.values({ name, Phase, Review, description, status }).includes("")
    ) {
      setValidationMessage(true);
      adddata[i].classList.remove("error-block");
      return;
    }

    let valid = GlobalValidation(ref);

    console.log(valid);

    if (valid) {
      setValidationMessage(true);

      return;
    }
    setValidationMessage(false);
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/defectphases/postDefectsData`,
      data: formData,
    }).then((error) => {
      setValidationMessage(false);
      console.log("success", error);
      setOpenPopup(false);
      getTableData();
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
    });
  };
  const [flag, setFlag] = useState(true);

  const handleEditData = () => {
    console.log(editedData);
    let adddata = document.getElementsByClassName("error");

    let someDataa = tableData.some((d) => d.title === formEditData.title);
    console.log(someDataa);
    // if (formData == undefined) {

    if (
      someDataa &&
      flag == false &&
      formEditData.title != initialformEditData.title
    ) {
      console.log("1234567");
      let ele = document.getElementsByClassName("unique");
      console.log(ele.length);
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }
      console.log(ele);

      setUniqueMessage(true);
      setValidationMessage(false);
      // setValidationMessage(false);
      setTimeout(() => {
        // setValidationMessage(false);
      }, 3000);
      return;
    }
    for (let i = 0; i < adddata.length; i++) {
      if (
        adddata[i].value == "" ||
        adddata[i].value == "null" ||
        adddata[i].value == "All" ||
        adddata[i].value == undefined
      ) {
        adddata[i].classList.add("error-block");

        setValidationMessage(true);
        setUniqueMessage(false);
      } else {
        adddata[i].classList.remove("error-block");

        setValidationMessage(false);
      }
    }
    let name = formEditData.title;
    let Phase = formEditData.defect_project_task_id;
    let Review = formEditData.review_method_id;
    let descriptiontext = formEditData.descriptionClear;
    let description1 = formEditData.description;

    if (Object.values({ name, Phase, Review, description1 }).includes("")) {
      return;
    }

    console.log(formEditData);
    console.log(formEditData.projectId);

    setValidationMessage(false);
    // if (Object.values({ description }).includes("")) {

    //     return;
    // }
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/defectphases/postDefectsData`,
      data: {
        id: formEditData.id,
        projectid: projectId,
        title: formEditData.title,
        defect_project_task_id: formEditData.defect_project_task_id,
        defect_project_injected_task_id:
          formEditData.defect_project_injected_task_id,
        priority_id: formEditData.priority_id,
        severity_id: formEditData.severity_id,
        status_id: formEditData.status_id,
        assigned_to:
          formEditData.assigned_to === ""
            ? editedData?.assignedTo
            : formEditData.assigned_to,
        // ,=== ""?  :  formEditData.assigned_to,
        reported_by: resourceid,
        description:
          formEditData.description == "" ? value : formEditData.description,
        defect_age: formEditData.defect_age,
        review_method_id: formEditData.review_method_id,
      },
    }).then((error) => {
      setValidationMessage(false);
      setOpenPopup(false);
      console.log("success", error);
      setOpenPopup(false);
      getTableData();
      setEditmsg(true);
      setTimeout(() => {
        setEditmsg(false);
      }, 3000);
      // getTableData();
    });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFormData((prev) => ({ ...prev, ["reported_by"]: resourceid }));
    setFormEditData((prev) => ({ ...prev, ["reported_by"]: resourceid }));
  };
  useEffect(() => {}, [assigneTo]);
  useEffect(() => {
    handleAssigneToChange();
  }, []);

  useEffect(() => {
    handlePhaseChange();
    handleSeverityChange();
    handlePriorityChange();
    handleStatusChange();
    handlePhaseInjectedChange();
    handleProjectChange();
    handleReviewMethodChange();
  }, []);

  console.log(editedData.assignedTo);
  console.log(formEditData);
  const formatResult = (item) => {
    return (
      <div className="result-wrapper">
        <span className="result-span">
          {item.ResName} (<span>{item.employeeNumber}</span>)
        </span>
      </div>
    );
  };

  return (
    <div className="col-md-12">
      <CModal
        visible={openPopup}
        size="xl"
        onClose={() => setOpenPopup(false)}
        backdrop={"static"}
      >
        <CModalHeader>
          <CModalTitle>
            {type == "add" ? (
              <span>Create Defect</span>
            ) : (
              <span>Edit Defect</span>
            )}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="group-content row">
            <div>
              {uniqueMessage ? (
                <div className="statusMsg error">
                  <AiFillWarning size="1.4em" />
                  <span>Please select unique name</span>
                </div>
              ) : (
                ""
              )}
              {validationMessage ? (
                <div className="statusMsg error">
                  <span>
                    {" "}
                    <AiFillWarning /> Please select the valid values for
                    highlighted fields
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
            {projectData.map((list) => (
              <div className=" col-md-2 mb-2">
                <div className="form-group row " id="project">
                  <label htmlFor="col-5 ">Project</label>

                  <label className=" ">
                    <input
                      type="Text"
                      className="disableField"
                      id={projectId}
                      disabled={true}
                      value={list.projectName}
                      onChange={(e) => handleChange(e)}
                    />
                  </label>
                </div>
              </div>
            ))}
            <div className="form-group col-md-2 " id="title">
              <label htmlFor="form-label">
                {" "}
                Defect Title&nbsp;<span className="required"> *</span>
              </label>
              {type == "add" ? (
                <input
                  className="error unique "
                  type="Text"
                  name="title"
                  id="title"
                  placeholder="Title"
                  onChange={(e) => handleChange(e)}
                />
              ) : (
                <>
                  {editedData.status_id != 345 ? (
                    <input
                      className="error "
                      type="Text"
                      defaultValue={editedData?.title}
                      onChange={(e) => {
                        setFormEditData((prev) => ({
                          ...prev,
                          ["title"]: e.target.value,
                        })),
                          setFlag(false);
                      }}
                    />
                  ) : (
                    <input
                      className="error "
                      disabled={true}
                      type="Text"
                      defaultValue={editedData?.title}
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["title"]: e.target.value,
                        }))
                      }
                    />
                  )}
                </>
              )}
            </div>
            <div className="form-group col-md-2 " id="defect_project_task_id">
              <label htmlFor="form-label">
                Phase&nbsp;<span className="error-text"> *</span>
              </label>
              <label htmlFor="col-md-12 ">
                {type == "add" ? (
                  <div className="col-md-12">
                    <select
                      className="error enteredDetails cancel text"
                      name="defect_project_task_id"
                      id="defect_project_task_id"
                      onChange={(e) => handleChange(e)}
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <option value="All">
                        {" "}
                        &lt;&lt;Please Select&gt;&gt;
                      </option>
                      {phases.map((Item) => (
                        <option value={Item.id}> {Item.task_name}</option>
                      ))}
                    </select>{" "}
                  </div>
                ) : (
                  <>
                    {editedData.status_id != 345 ? (
                      <select
                        className="error"
                        id="defect_project_task_id"
                        name="defect_project_task_id"
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["defect_project_task_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {phases.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.defect_project_task_id
                                ? true
                                : false
                            }
                          >
                            {" "}
                            {Item.task_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="error"
                        disabled={true}
                        id="defect_project_task_id"
                        name="defect_project_task_id"
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["defect_project_task_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {phases.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.defect_project_task_id
                                ? true
                                : false
                            }
                          >
                            {" "}
                            {Item.task_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </label>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="form-label">Phase Injected</label>
              <label htmlFor="form-label">
                {type == "add" ? (
                  <div className="col-md-12">
                    <select
                      className="col-md-12"
                      id="defect_project_injected_task_id"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="All">
                        {" "}
                        &lt;&lt;Please Select&gt;&gt;
                      </option>
                      {phaseInjected.map((Item) => (
                        <option value={Item.id}> {Item.task_name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    {editedData.status_id != 345 ? (
                      <select
                        className="col-md-12"
                        name="defect_project_injected_task_id"
                        id="defect_project_injected_task_id"
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["defect_project_injected_task_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {phaseInjected.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id ==
                              editedData?.defect_project_injected_task_id
                                ? true
                                : false
                            }
                          >
                            {" "}
                            {Item.task_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="col-md-12"
                        disabled={true}
                        name="defect_project_injected_task_id"
                        id="defect_project_injected_task_id"
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["defect_project_injected_task_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {phaseInjected.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id ==
                              editedData?.defect_project_injected_task_id
                                ? true
                                : false
                            }
                          >
                            {" "}
                            {Item.task_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </label>
            </div>
            <div className="form-group col-md-2" id="review_method_id">
              <label htmlFor="form-label">
                Review/Testing Method&nbsp;<span className="required"> *</span>
              </label>
              <label htmlFor="form-label">
                {type == "add" ? (
                  <div className="col-md-12">
                    <select
                      className=" error col-md-12"
                      name="review_method_id"
                      id="review_method_id"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="All">
                        {" "}
                        &lt;&lt;Please Select&gt;&gt;
                      </option>
                      {reviewMethod.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>{" "}
                  </div>
                ) : (
                  <>
                    {editedData.status_id != 345 ? (
                      <select
                        className=" error col-md-12"
                        name="review_method_id"
                        id="review_method_id"
                        defaultValue={editedData?.review_method_id}
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["review_method_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {reviewMethod.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.review_method_id
                                ? true
                                : false
                            }
                          >
                            {" "}
                            {Item.lkup_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="  error col-md-12"
                        disabled={true}
                        name="review_method_id"
                        id="review_method_id"
                        defaultValue={editedData?.review_method_id}
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["review_method_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {reviewMethod.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.review_method_id
                                ? true
                                : false
                            }
                          >
                            {" "}
                            {Item.lkup_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </label>
            </div>
            <div className="form-group col-md-2" id="severity_id">
              <label htmlFor="form-label">Severity </label>
              <label htmlFor="form-label">
                {type == "add" ? (
                  <div className="col-md-12">
                    <select
                      className="col-md-12"
                      name="severity_id"
                      id="severity_id"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="All">
                        {" "}
                        &lt;&lt;Please Select&gt;&gt;
                      </option>
                      {severity.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>{" "}
                  </div>
                ) : (
                  <>
                    {editedData.status_id != 345 ? (
                      <select
                        className="col-md-12"
                        name="severity_id"
                        id="severity_id"
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["severity_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {severity.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.severity_id ? true : false
                            }
                          >
                            {" "}
                            {Item.lkup_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="col-md-12"
                        disabled={true}
                        name="severity_id"
                        id="severity_id"
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["severity_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {severity.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.severity_id ? true : false
                            }
                          >
                            {" "}
                            {Item.lkup_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </label>
            </div>
            <div className="form-group col-md-2" id="priority_id">
              <label htmlFor="form-label">Priority </label>
              <label htmlFor="form-label">
                {type == "add" ? (
                  <div className="col-md-12">
                    <select
                      className="col-md-12"
                      name="priority_id"
                      id="priority_id"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="All">
                        {" "}
                        &lt;&lt;Please Select&gt;&gt;
                      </option>
                      {priority.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <>
                    {editedData.status_id != 345 ? (
                      <select
                        className="col-md-12"
                        id="priority_id"
                        name="priority_id"
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["priority_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {priority.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.priority_id ? true : false
                            }
                          >
                            {" "}
                            {Item.lkup_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="col-md-12"
                        disabled={true}
                        id="priority_id"
                        name="priority_id"
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["priority_id"]: e.target.value,
                          }))
                        }
                      >
                        <option value="All">
                          {" "}
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        {priority.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.priority_id ? true : false
                            }
                          >
                            {" "}
                            {Item.lkup_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </label>
            </div>
            <div className="form-group col-md-2" id="status_id">
              <label htmlFor="form-label">
                Status&nbsp;<span className="required"> *</span>
              </label>
              <label htmlFor="form-label" id="status_id">
                {type == "add" ? (
                  <div className="col-md-12">
                    <select
                      className=" error col-md-12 "
                      name="status_id"
                      id="status_id"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="All">
                        {" "}
                        &lt;&lt;Please Select&gt;&gt;
                      </option>
                      {status.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>{" "}
                  </div>
                ) : (
                  <>
                    {editedData.status_id != 345 ? (
                      <select
                        className="error col-md-12"
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["status_id"]: e.target.value,
                          }))
                        }
                      >
                        {status.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.status_id ? true : false
                            }
                          >
                            {" "}
                            {Item.lkup_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <select
                        className="error col-md-12"
                        disabled={true}
                        onChange={(e) =>
                          setFormEditData((prev) => ({
                            ...prev,
                            ["status_id"]: e.target.value,
                          }))
                        }
                      >
                        {status.map((Item) => (
                          <option
                            value={Item.id}
                            selected={
                              Item.id == editedData?.status_id ? true : false
                            }
                          >
                            {" "}
                            {Item.lkup_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </label>
            </div>
            <div className="form-group col-md-2" id="assigned_to">
              <label htmlFor="form-label">Assigned To</label>
              {type == "add" ? (
                <>
                  <div className="autoComplete-container">
                    <div>
                      <ReactSearchAutocomplete
                        items={assigneTo}
                        type="Text"
                        name="assigned_to"
                        id="assigned_to"
                        className="AutoComplete"
                        assigneTo={assigneTo}
                        handleAssigneToChange={handleAssigneToChange}
                        fuseOptions={{
                          keys: ["id", "ResName", "employeeNumber"],
                        }}
                        resultStringKeyName="ResName"
                        formatResult={formatResult}
                        onSelect={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            assigned_to: e.id,
                          }));
                        }}
                        showIcon={false}
                      />
                    </div>
                  </div>
                  <span>{item.ResName}</span>{" "}
                </>
              ) : (
                <>
                  {editedData.status_id != 345 ? (
                    <div className="autoComplete-container">
                      <ReactSearchAutocomplete
                        items={assigneTo}
                        type="Text"
                        name="assigned_to"
                        id="assigned_to"
                        className="wrapperauto"
                        assigneTo={assigneTo}
                        handleAssigneToChange={handleAssigneToChange}
                        fuseOptions={{
                          keys: ["id", "ResName", "employeeNumber"],
                        }}
                        resultStringKeyName="ResName"
                        formatResult={formatResult}
                        onSelect={(e) => {
                          setFormEditData((prev) => ({
                            ...prev,
                            assigned_to: e.id,
                          }));
                          console.log(e.id);
                        }}
                        onChange={(e) => {
                          setFormEditData((prev) => ({
                            ...prev,
                            assigned_to: e.id,
                          }));
                        }}
                        showIcon={false}
                        inputSearchString={
                          editedData?.assignedTo == null
                            ? ""
                            : editedData?.assignedTo
                        }
                      />
                    </div>
                  ) : (
                    // <span >{item.ResName}</span>
                    <div className="autocomplete-wrapper">
                      <input
                        items={assigneTo}
                        type="Text"
                        name="assigned_to"
                        id="assigned_to"
                        defaultValue={
                          editedData?.assignedTo == null
                            ? ""
                            : editedData?.assignedTo
                        }
                        className="wrapperauto"
                        assigneTo={assigneTo}
                        disabled={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="form-group col-md-12">
              <div className="Space"></div>
              <div className="col-md-3 mt-1" id="description">
                <label htmlFor="form-label">
                  Defect Description&nbsp;
                  <span class="error-text required"> *</span>
                </label>
              </div>
            </div>
            <div
              className="col-md-12 text error "
              ref={(ele) => {
                ref.current[1] = ele;
              }}
            >
              {type == "add" ? (
                <div>
                  <ReactQuill
                    className=""
                    theme="snow"
                    id="description"
                    value={value}
                    name="description"
                    onChange={(e) => {
                      setValue(e);
                      setFormData((prev) => ({
                        ...prev,
                        ["description"]: value,
                      }));
                    }}
                    modules={editorToolBar}
                    // onBlur={handleBlur}
                  />
                </div>
              ) : (
                <>
                  {editedData.status_id != 345 ? (
                    <div>
                      <ReactQuill
                        className=""
                        theme="snow"
                        // value={value}
                        defaultValue={editedData?.description}
                        name="description"
                        id="editor-container"
                        onChange={(e) => {
                          setValue(e);
                          setFormEditData((prev) => ({
                            ...prev,
                            ["description"]: e,
                          }));
                        }}
                        modules={editorToolBar}
                      />
                    </div>
                  ) : (
                    <div style={{ cursor: "no-drop" }}>
                      <ReactQuill
                        className=""
                        theme="snow"
                        disabled={true}
                        readOnly={true}
                        defaultValue={editedData?.description}
                        name="description"
                        id="editor-container"
                        onChange={(e) => {
                          setValue(e);
                          setFormEditData((prev) => ({
                            ...prev,
                            ["description"]: e,
                          }));
                        }}
                        modules={editorToolBar}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 no-padding">
              <div className="col-sm-12">
                <div className="uploadFiles customCard">
                  <h2>
                    <AiOutlinePaperClip />
                    Attachments
                  </h2>
                </div>
              </div>

              <div className="col-md-12 left">
                {editedData.status_id != 345 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    title="Add"
                    onClick={() => setVisible(true)}
                  >
                    {" "}
                    <FaPlus />
                    Add{" "}
                  </button>
                ) : (
                  <button
                    type="button"
                    style={{ cursor: "no-drop" }}
                    className="btn btn-primary"
                    title="Add"
                  >
                    {" "}
                    <FaPlus />
                    Add{" "}
                  </button>
                )}

                {visible && (
                  <>
                    <label>Note: You can select 10 files at max.</label>
                    <label>Browse Document</label>
                    <input
                      type="file"
                      multiple
                      name="docId"
                      id="docId"
                      accept=".jpg,.jpeg,.xlsx,.pdf,.docx,.txt"
                      onChange={handleFileSelect}
                    />
                    <ul>
                      {selectedFiles.map((file) => (
                        <li key={file.name}>{file.name}</li>
                      ))}
                    </ul>
                    <label className="documenttypes col-md-12">
                      <p className="error-text">
                        Supported file types
                        .pdf,.doc,.csv,.txt,.xlsx,.html,.png{" "}
                      </p>
                    </label>
                  </>
                )}

                <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
                  {type == "add" ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        handleAddData();
                      }}
                    >
                      <MdOutlineSettingsSuggest />
                      &nbsp;Create{" "}
                    </button>
                  ) : (
                    <>
                      {" "}
                      {editedData.status_id != 345 ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleEditData}
                        >
                          <MdOutlineSettingsSuggest />
                          Update{" "}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ cursor: "no-drop" }}
                        >
                          <MdOutlineSettingsSuggest />
                          Update{" "}
                        </button>
                      )}
                    </>
                  )}
                  {/* {type == "add" ? <button type="button" className="btn btn-primary" onClick={() => { handleAddData(); }} ><AiFillFileAdd />&nbsp;Create and Continue</button> :
                                        <button type="button" className="btn btn-primary" onClick={handleEditData}
                                        ><AiFillFileAdd />&nbsp;Create and Continue</button>} */}
                  {/* <button type="reset" title="Cancel" className="btn btn-secondary" > <VscChromeClose /> Cancel</button> */}
                </div>
              </div>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}
export default ProjectDefectsPopUp;
