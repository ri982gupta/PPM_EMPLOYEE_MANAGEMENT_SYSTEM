import React, { useState, useEffect, useRef } from "react";
import { FaSave } from "react-icons/fa";
import axios from "axios";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import "../../App.scss";
import { environment } from "../../environments/environment";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import moment from "moment";
import { AiFillWarning } from "react-icons/ai";
import GlobalValidation from "../ValidationComponent/GlobalValidation";

function AddPopup(props) {
  const {
    openPopup,
    setOpenPopup,
    projectIssueDetails,
    type,
    editId,
    setEditedData,
    editedData,
    getTableData,
    addmsg,
    setAddmsg,
    setEditmsg,
    projectData,
    projectId,
  } = props;
  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  console.log(editedData.Due_Date);
  const [edate, setEdate] = useState(new Date(editedData?.Due_Date));
  const [projectName, setProjectName] = useState([]);
  const [criticality1, setCriticality] = useState([]);
  const [issueSource, setIssueSource] = useState([]);
  const [status, setStatus] = useState([]);
  const [newStatus, setNewStatus] = useState([]);
  const [issueDetails, setIssueDetails] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [value, setValue] = useState("");
  const [assignedid, setAssignedid] = useState();
  const [rcaDone, setRcaDone] = useState();
  const [validationMessage, setValidationMessage] = useState(false);
  const [despValidation, setDespValidation] = useState("");
  const baseUrl = environment.baseUrl;
  const data = {
    projectid: projectId,
    criticality: "",
    source: "",
    status: 426,
    name: "",
    duedate: "",
    RCA_Done: null,
    assignedto: null,
    createdbyid: loggedUserId,
    createdbyname: loggedUserName,
    description: "",
    comments: "",
    last_updated_by_id: loggedUserId,
  };

  const defaultFormData =
    editedData["RCA_Done"] == undefined ||
    editedData["RCA_Done"] == null ||
    editedData["RCA_Done"] == ""
      ? { ...data, rca: 0 }
      : { ...data, rca: editedData["RCA_Done"] ? 0 : 1 };

  const [formData, setFormData] = useState(defaultFormData);

  console.log(formData.rca);
  const [isOpen, setIsOpen] = useState(false);
  const [formEditData, setFormEditData] = useState(editedData);
  const [initialformEditData, initialsetFormEditData] = useState(editedData);
  const [flag, setFlag] = useState(true);
  console.log(flag);
  // console.log(formEditData.RCA_Done)
  const [issueName, setIssueName] = useState([]);
  const [deferred, setDeferred] = useState([]);
  const [resolved, setResolved] = useState([]);
  const [review, setReview] = useState([]);
  const [inwaiting, setInwaiting] = useState([]);
  const [withdraw, setWithdraw] = useState([]);
  const [new1, setNew1] = useState([]);
  const [newassaigned, setNewAssigned] = useState([]);
  const [inprogress, setInprogress] = useState([]);
  const [closed, setClosed] = useState([]);
  const [followup, setFollowup] = useState([]);
  console.log(editedData);
  const ref = useRef([]);
  // const currentDate = new Date();
  // const currentMonthStartDate = startOfMonth(currentDate);
  // const currentMonthEndDate = endOfMonth(currentDate);
  const handleDateChange = (date) => {
    setEdate(date);
  };

  var maxDate = moment(moment().toString()).format("yyyy-MM-DD");
  const [item, setItem] = useState([]);
  useEffect(() => {
    console.log(item);
  }, [item]);

  //  console.log(edit[0]?.Issue_Name)
  useEffect(() => {
    getCriticality();
    getIssueSource();
    getEditStatus();
    getEditNewStatus();
    getProject();
    getIssueName();
    getStatusdeferrred();
    getStatusresolved();
    getStatusreview();
    getStatusInwaiting();
    getStatuswithdraw();
    getStatusNew();
    getStatusassigned();
    getStatusInprogress();
    getStatusFollowup();
  }, []);

  // axios call for criticality
  const getCriticality = (e) => {
    console.log("popup criticality");
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getCriticality`,
    }).then((res) => {
      var criticality = res.data;
      setCriticality(criticality);
    });
  };

  // axios call for issue source
  const getIssueSource = (e) => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getIssueSource`,
    }).then((res) => {
      var issueSource = res.data;
      setIssueSource(issueSource);
    });
  };

  // axios call for status
  const getEditStatus = (e) => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getEditStatus`,
    }).then((res) => {
      var status = res.data;
      setStatus(status);
      console.log(status);
    });
  };

  // axios call for New status
  const getEditNewStatus = (e) => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getEditNewStatus`,
    }).then((res) => {
      var status = res.data;
      setNewStatus(status);
      console.log(status);
    });
  };

  // axios call to get the emp details for autocomplete
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

  /// axios call to get project name
  const getProject = (e) => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getProjectName`,
    }).then((res) => {
      var project = res.data;
      setProjectName(project);
    });
  };

  // var Size = Quill.import('attributors/style/size');
  // Size.whitelist = ['10px', '12px', '16px', '18px', '20px', '24px', '28px'];
  // Quill.register(Size, true);
  // const customSize = () => (
  //     <div id='sizing'>
  //         <select className="ql-size">
  //             <option value="10px">Abcdefgh...</option>
  //             <option value="12px">Abcdefgh...</option>
  //             <option value="16px" selected>Abcdefgh...</option>
  //             <option value="18px">Abcdefgh...</option>
  //             <option value="20px">Abcdefgh...</option>
  //             <option value="24px">Abcdefgh...</option>
  //             <option value="28px">Abcdefgh...</option>
  //         </select>
  //     </div>
  // )
  const getIssueName = (e) => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getIssueName?project_id=${projectId}`,
    }).then((res) => {
      var issuename = res.data;
      setIssueName(issuename);
    });
  };

  const getStatusdeferrred = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatusdeferrred`,
    }).then((res) => {
      var Statusdeferrred = res.data;
      setDeferred(Statusdeferrred);
    });
  };

  const getStatusresolved = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatusresolved`,
    }).then((res) => {
      var Statusresolved = res.data;
      setResolved(Statusresolved);
    });
  };

  const getStatusreview = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatusreview`,
    }).then((res) => {
      var Statusreview = res.data;
      setReview(Statusreview);
    });
  };

  const getStatusInwaiting = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatusInwaiting`,
    }).then((res) => {
      var StatusInwaiting = res.data;
      setInwaiting(StatusInwaiting);
    });
  };

  const getStatuswithdraw = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatuswithdraw`,
    }).then((res) => {
      var Statuswithdraw = res.data;
      setWithdraw(Statuswithdraw);
    });
  };

  const getStatusNew = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatusNew`,
    }).then((res) => {
      var StatusNew = res.data;
      setNew1(StatusNew);
    });
  };

  const getStatusassigned = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatusassigned`,
    }).then((res) => {
      var Statusassigned = res.data;
      setNewAssigned(Statusassigned);
    });
  };

  const getStatusInprogress = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatusInprogress`,
    }).then((res) => {
      var StatusInprogress = res.data;
      setInprogress(StatusInprogress);
    });
  };

  const getStatusClosed = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatusClosed`,
    }).then((res) => {
      var StatusClosed = res.data;
      // setClosed(StatusInprogress)
    });
  };

  const getStatusFollowup = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Issues/getStatusFollowup`,
    }).then((res) => {
      var StatusFollowup = res.data;
      setFollowup(StatusFollowup);
    });
  };
  const editorToolBar = {
    toolbar: [
      [
        { header: [false, 1, 2, 3, 4, 5, 6] },
        // {tooltip:["ee"]},
        // { size: [] },
        { font: [] },
        { color: [] },
        { bold: { tooltip: "Bold (Ctrl+B)" } },
        "italic",
        "underline",
        { list: "ordered", tooltip: "Numbered List" },
        { list: "bullet" },
        { script: "sub" },
        { script: "super" },
        { indent: "-1" },
        { indent: "+1" },
        { align: null },
        { align: "center" },
        { align: "right" },
        "strike",
        "link",
        "code-block",
        "clean",
      ],
    ],
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const [uniqueMessage, setUniqueMessage] = useState(false);

  // axios call to create new record.

  const handleAddClick = () => {
    console.log(formData);
    let someDataa = issueName.some((d) => d.name == formData.name);
    console.log(someDataa);
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
      setTimeout(() => {}, 3000);
      return;
    }
    if (someDataa) return;
    //
    let adddata = document.getElementsByClassName("error");

    for (let i = 0; i < adddata.length; i++) {
      console.log(adddata[i].value);
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
    let name = formData.name;
    let criticality = formData.criticality;
    let source = formData.source;
    let description = formData.description;

    if (
      Object.values({ name, criticality, source, description }).includes("")
    ) {
      setValidationMessage(true);
      adddata[i].classList.remove("error-block");
      return;
    }
    setValidationMessage(false);
    let valid = GlobalValidation(ref);
    setValidationMessage(false);
    console.log(valid);

    if (valid) {
      setValidationMessage(true);

      return;
    }

    setValidationMessage(false);

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Issues/postProjectIssuesData`,
      // url: `http://localhost:9000/ProjectMS/Issues/postProjectIssuesData`,
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

  const handleEditClick = () => {
    console.log(formEditData);

    let someDataa = issueName.some((d) => d.name == formEditData.Issue_Name);

    console.log(
      someDataa &&
        flag == false &&
        formEditData.Issue_Name != initialformEditData.Issue_Name,
      flag
    );
    if (
      someDataa &&
      flag == false &&
      formEditData.Issue_Name != initialformEditData.Issue_Name
    ) {
      let ele = document.getElementsByClassName("unique");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }
      setUniqueMessage(true);
      setTimeout(() => {}, 3000);
      return;
    }

    console.log(formEditData);
    console.log(projectId);

    let adddata = document.getElementsByClassName("error");

    for (let i = 0; i < adddata.length; i++) {
      console.log(adddata[i].value);
      if (
        adddata[i].value == "" ||
        adddata[i].value == "null" ||
        adddata[i].value == "All" ||
        adddata[i].value == undefined
      ) {
        adddata[i].classList.add("error-block");
        setValidationMessage(true);
      } else {
        adddata[i].classList.remove("error-block");

        setValidationMessage(false);
      }
    }
    let name = formEditData.name;
    let criticality = formEditData.criticality;
    let source = formEditData.source;
    let description = formEditData.description;

    if (
      Object.values({ name, criticality, source, description }).includes("") ||
      description === "<p><br></p>"
    ) {
      setValidationMessage(true);
      return;
    }
    setValidationMessage(false);
    let valid = GlobalValidation(ref);

    console.log(valid);

    if (valid) {
      setValidationMessage(true);

      return;
    }
    setValidationMessage(false);
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Issues/postProjectIssuesData`,
      // url: `http://localhost:9000/ProjectMS/Issues/postProjectIssuesData`,
      data: {
        id: formEditData.id,
        projectid: projectId,
        createdbyname: formEditData.Created_By,
        duedate: formEditData.Due_Date,
        name: formEditData.Issue_Name,
        comments: formEditData.Comments,
        createdbyid: formEditData.created_by_id,
        description: formEditData.description,
        assignedto: formEditData.owner_id,
        criticality: formEditData.priority_id,
        source: formEditData.source_id,
        date_created: formEditData.date_created,
        last_updated_by_id: loggedUserId,
        status:
          formEditData.status_id == 426 && formEditData.owner_id != null
            ? 427
            : formEditData.status_id,
        rca:
          formEditData.RCA_Done === true
            ? "1"
            : formEditData.RCA_Done === false
            ? "0"
            : formEditData.RCA_Done,
      },
    }).then((error) => {
      console.log("success", error);
      setOpenPopup(false);
      getTableData();
      setEditmsg(true);
      setTimeout(() => {
        setEditmsg(false);
      }, 3000);
    });
  };

  const handleKeyDown = (event) => {
    // Regular expression pattern to match alphanumeric characters
    const alphanumericRegex = /^[0-9a-zA-Z]+$/;

    if (!alphanumericRegex.test(event.key)) {
      // If the pressed key is not alphanumeric, prevent it from being entered in the input field
      event.preventDefault();
    }
  };

  console.log(editedData?.status_id);

  return (
    <div className="col-md-12">
      {/* <Draggable> */}
      <CModal
        visible={openPopup}
        size="xl"
        onClose={() => setOpenPopup(false)}
        backdrop={"static"}
      >
        <CModalHeader className="" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            {" "}
            {""}
            {type == "add" ? (
              <span className="">Add Issue</span>
            ) : (
              <span className=""> Edit Issue </span>
            )}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="group-content row ">
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
                  <AiFillWarning size="1.4em" />
                  <span>
                    Please select the valid values for highlighted fields
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
            {projectData.map((list) => (
              <div className=" col-md-3 mb-2">
                <div className="form-group row" id="project">
                  <label className="col-5">Project</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    {editedData?.status_id != 432 ? (
                      <input
                        type="Text"
                        className="disableField"
                        name="project"
                        id={projectId}
                        disabled={true}
                        value={list.projectName}
                        onChange={(e) => handleChange(e)}
                      />
                    ) : (
                      <input
                        type="Text"
                        className="disableField"
                        name="project"
                        id={projectId}
                        disabled={true}
                        value={list.projectName}
                        onChange={(e) => handleChange(e)}
                      />
                    )}
                  </label>
                </div>
              </div>
            ))}
            <div className=" col-md-3 mb-2">
              <div className="form-group row" id="name">
                <label className="col-5">
                  Issue Name<span className=" error-text ml-1">*</span>
                </label>
                <label className="col-1 p-0">:</label>
                <div
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  {type == "add" ? (
                    <input
                      className="error unique"
                      type="text"
                      id="name"
                      placeholder="Max 50 characters"
                      maxLength={50}
                      onKeyDown={(event) => {
                        handleKeyDown;
                        if (event.code == "Space" && !formData.name)
                          event.preventDefault();
                      }}
                      // onKeyDown={handleKeyDown}
                      name="name"
                      required
                      onChange={(e) => handleChange(e)}
                    />
                  ) : (
                    <>
                      {" "}
                      {editedData?.status_id != 432 ? (
                        <input
                          className="error unique "
                          type="Text"
                          name="name"
                          id="name"
                          // onKeyDown={(event) => {
                          //     handleKeyDown
                          //     if ((event.code == 'Space') && (!(formData.name))) event.preventDefault()

                          // }}
                          defaultValue={editedData?.Issue_Name}
                          onChange={(e) => {
                            setFormEditData((prev) => ({
                              ...prev,
                              ["Issue_Name"]: e.target.value,
                            })),
                              setFlag(false);
                          }}
                        />
                      ) : (
                        <input
                          type="Text"
                          disabled={true}
                          placeholder="max 50 characters"
                          defaultValue={editedData?.Issue_Name}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row" id="criticality">
                <label className="col-5 ">
                  Criticality<span className="error-text ml-1">*</span>
                </label>
                <label className="col-1 p-0">:</label>
                <label className="col-6 ">
                  {type == "add" ? (
                    <select
                      className="error  col-md-12 p0"
                      name="criticality"
                      id="criticality"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="All">
                        {" "}
                        &lt;&lt;Please Select&gt;&gt;
                      </option>
                      {criticality1.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  ) : (
                    <>
                      {editedData?.status_id != 432 ? (
                        <select
                          className="error  col-md-12 p0 "
                          name="criticality"
                          id="criticality"
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
                          {criticality1.map((Item) => (
                            <option
                              value={Item.id}
                              selected={
                                Item.id == editedData?.priority_id
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
                          className="  col-md-12 p0 "
                          disabled={true}
                          name="criticality"
                          id="criticality"
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
                          {criticality1.map((Item) => (
                            <option
                              value={Item.id}
                              selected={
                                Item.id == editedData?.priority_id
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
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row" id="source">
                <label className="col-5">
                  Issue Source<span className="error-text ml-1">*</span>
                </label>
                <label className="col-1 p-0">:</label>
                <label className="col-6 ">
                  {type == "add" ? (
                    <select
                      className="error col-md-12 p0 "
                      name="source"
                      id="source"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="All">
                        {" "}
                        &lt;&lt;Please Select&gt;&gt;
                      </option>
                      {issueSource.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  ) : (
                    <>
                      {editedData?.status_id != 432 ? (
                        <select
                          className="error col-md-12 p0 "
                          name="source"
                          id="source"
                          onChange={(e) =>
                            setFormEditData((prev) => ({
                              ...prev,
                              ["source_id"]: e.target.value,
                            }))
                          }
                        >
                          <option value="All">
                            {" "}
                            &lt;&lt;Please Select&gt;&gt;
                          </option>
                          {issueSource.map((Item) => (
                            <option
                              value={Item.id}
                              selected={
                                Item.id == editedData?.source_id ? true : false
                              }
                            >
                              {" "}
                              {Item.lkup_name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select
                          className=" col-md-12 p0 "
                          disabled={true}
                          name="source"
                          id="source"
                          onChange={(e) =>
                            setFormEditData((prev) => ({
                              ...prev,
                              ["source_id"]: e.target.value,
                            }))
                          }
                        >
                          <option value="All">
                            {" "}
                            &lt;&lt;Please Select&gt;&gt;
                          </option>
                          {issueSource.map((Item) => (
                            <option
                              value={Item.id}
                              selected={
                                Item.id == editedData?.source_id ? true : false
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
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row" id="status">
                <label className="col-5">Status</label>
                <label className="col-1 p-0">:</label>
                <label className="col-6">
                  {type == "add" ? (
                    <select
                      className="col-md-12 disableField"
                      name="status"
                      id="status"
                      onChange={(e) => handleChange(e)}
                      disabled={true}
                    >
                      <option value="{426}" id="{426}">
                        {" "}
                        New
                      </option>
                    </select>
                  ) : editedData?.status_id == 426 ? (
                    <select
                      className="col-md-12 "
                      name="status"
                      id="status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      {newStatus.map((Item) => (
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
                  ) : editedData?.status_id == 430 ? (
                    <select
                      className="col-md-12 "
                      name="status"
                      id="status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      {deferred.map((Item) => (
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
                  ) : editedData?.status_id == 810 ? (
                    <select
                      className="col-md-12 "
                      name="status"
                      id="status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      {review.map((Item) => (
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
                  ) : editedData?.status_id == 811 ? (
                    <select
                      className="col-md-12 "
                      name="status"
                      id="status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      {inwaiting.map((Item) => (
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
                  ) : editedData?.status_id == 429 ? (
                    <select
                      className="col-md-12 "
                      name="status"
                      id="status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      {withdraw.map((Item) => (
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
                  ) : editedData?.status_id == 427 ? (
                    <select
                      className="col-md-12 "
                      name="status"
                      id="status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      {newassaigned.map((Item) => (
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
                  ) : editedData?.status_id == 812 ? (
                    <select
                      className="col-md-12 "
                      name="status"
                      id="status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      {followup.map((Item) => (
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
                  ) : editedData?.status_id == 428 ? (
                    <select
                      className="col-md-12 "
                      name="status"
                      id="status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      {inprogress.map((Item) => (
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
                  ) : editedData?.status_id == 431 ? (
                    <select
                      className="col-md-12 "
                      name="status"
                      id="status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      {resolved.map((Item) => (
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
                  ) : editedData?.status_id == 432 ? (
                    <select
                      className="col-md-12 "
                      disabled={true}
                      name="status"
                      id="status"
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
                      className="col-md-12 "
                      name="status"
                      id="status"
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
                </label>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row" id="duedate">
                <label className="col-5">Due Date</label>
                <label className="col-1 p-0">:</label>
                <div className="col-6 ">
                  <div className="datepicker">
                    {type == "add" ? (
                      <DatePicker
                        name="duedate"
                        id="duedate"
                        selected={dueDate}
                        dateFormat="dd-MMM-yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={new Date()}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            ["duedate"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          console.log(e);
                          setDueDate(e);
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                          if (e.keyCode != 8) {
                            e.preventDefault();
                          }
                        }}
                      />
                    ) : (
                      <>
                        {editedData?.status_id != 432 ? (
                          <DatePicker
                            name="duedate"
                            id="duedate"
                            selected={
                              formEditData["Due_Date"] == undefined || null
                                ? ""
                                : moment(formEditData["Due_Date"])._d
                            }
                            dateFormat="dd-MMM-yyyy"
                            openToDate={moment().toDate()}
                            showMonthDropdown
                            showYearDropdown
                            minDate={new Date()}
                            dropdownMode="select"
                            // onChange={handleDateChange}
                            onChange={(e) => {
                              setFormEditData((prev) => ({
                                ...prev,
                                ["Due_Date"]: moment(e).format("yyyy-MM-DD"),
                              }));
                              console.log(e);
                            }}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        ) : (
                          <DatePicker
                            name="duedate"
                            id="duedate"
                            selected={
                              formEditData["Due_Date"] == undefined || null
                                ? ""
                                : moment(formEditData["Due_Date"])._d
                            }
                            dateFormat="dd-MMM-yyyy"
                            showMonthDropdown
                            disabled={true}
                            showYearDropdown
                            minDate={new Date()}
                            dropdownMode="select"
                            // onChange={handleDateChange}
                            onChange={(e) => {
                              setFormEditData((prev) => ({
                                ...prev,
                                ["Due_Date"]: moment(e).format("yyyy-MM-DD"),
                              }));
                              console.log(e);
                            }}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5">Assigned To</label>
                <label className="col-1 p-0">:</label>
                <div className="col-6">
                  {type == "add" ? (
                    <>
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={issueDetails}
                          type="Text"
                          name="assignedto"
                          id="assignedto"
                          placeholder="Type minimum 3 characters"
                          className="AutoComplete"
                          onKeyDown={handleKeyDown}
                          issueDetails={issueDetails}
                          getData={getData}
                          onSelect={(e) => {
                            {
                              setFormData((prevProps) => ({
                                ...prevProps,
                                assignedto: e.id,
                              }));
                            }
                            {
                              setFormData((prevProps) => ({
                                ...prevProps,
                                status: 427,
                              }));
                            }
                          }}
                          showIcon={false}
                        />
                      </div>
                      <span>{item.name}</span>
                    </>
                  ) : (
                    <>
                      {editedData?.status_id != 432 ? (
                        <div className="autoComplete-container">
                          <ReactSearchAutocomplete
                            items={issueDetails}
                            type="Text"
                            name="assignedto"
                            id="assignedto"
                            className="wrapperauto"
                            issueDetails={issueDetails}
                            getData={getData}
                            onKeyDown={handleKeyDown}
                            // setSelectEmployee={setSelectEmployee}
                            onSelect={(e) => {
                              console.log(e);
                              setFormEditData((prev) => ({
                                ...prev,
                                ["owner_id"]: e.id,
                              }));
                              setAssignedid(e.id);
                            }}
                            onChange={(e) => {
                              setFormEditData((prev) => ({
                                ...prev,
                                ["owner_id"]: e.id,
                              }));
                            }}
                            showIcon={false}
                            inputSearchString={editedData?.Assigned_To}
                          />
                        </div>
                      ) : (
                        <div className="autoComplete-container">
                          <div className="autocomplete-wrapper disabled">
                            <input
                              defaultValue={editedData?.Assigned_To}
                              items={issueDetails}
                              type="Text"
                              disabled={true}
                              name="assignedto"
                              id="assignedto"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row" id="rca">
                <label className="col-5">RCA Done</label>
                <label className="col-1 p-0">:</label>
                <div className="col-6 ">
                  <div className="row">
                    {type == "add" ? (
                      <>
                        <div
                          className="col-6"
                          onChange={(e) => {
                            setRcaDone("1");
                            setFormData((prev) => ({ ...prev, ["rca"]: "1" }));
                          }}
                        >
                          <input
                            className="form-check-input"
                            htmlFor="yes"
                            type="radio"
                            value="1"
                            name="rca"
                            id="rca"
                            checked={formData["rca"] == "1" ? true : false}
                          />
                          &nbsp;
                          <span className="form-check-label">Yes</span>{" "}
                        </div>
                        <div
                          className="col-6"
                          onChange={(e) => {
                            setRcaDone("0");
                            setFormData((prev) => ({ ...prev, ["rca"]: "0" }));
                          }}
                        >
                          <input
                            className="form-check-input"
                            htmlFor="no"
                            type="radio"
                            name="rca"
                            id="rca"
                            value="0"
                            checked={formData["rca"] != "1" ? true : false}
                          />
                          &nbsp;
                          <span className="form-check-label">No</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {editedData?.status_id != 432 ? (
                          <>
                            <div
                              className="col-6 "
                              onChange={(e) => {
                                setFormEditData((prev) => ({
                                  ...prev,
                                  ["RCA_Done"]: "1",
                                }));
                              }}
                            >
                              <input
                                className="form-check-input"
                                htmlFor="yes"
                                type="radio"
                                value="1"
                                name="RCA_Done"
                                id="RCA_Done"
                                checked={
                                  formEditData["RCA_Done"] == "1" ? true : false
                                }
                              />
                              &nbsp;
                              <span>Yes</span>{" "}
                            </div>
                            <div
                              className="col-6 "
                              onChange={(e) => {
                                setFormEditData((prev) => ({
                                  ...prev,
                                  ["RCA_Done"]: "0",
                                }));
                              }}
                            >
                              <input
                                className="form-check-input"
                                htmlFor="no"
                                type="radio"
                                name="RCA_Done"
                                id="RCA_Done"
                                value="0"
                                checked={
                                  formEditData["RCA_Done"] == "0" ? true : false
                                }
                              />
                              &nbsp;
                              <span>No</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-6 " disabled={true}>
                              <input
                                className="form-check-input"
                                htmlFor="yes"
                                type="radio"
                                value="1"
                                name="RCA_Done"
                                id="RCA_Done"
                                checked={
                                  formEditData["RCA_Done"] == "1" ? true : false
                                }
                              />
                              &nbsp;
                              <span>Yes</span>
                            </div>
                            <div className="col-6 " disabled={true}>
                              <input
                                className="form-check-input"
                                htmlFor="no"
                                type="radio"
                                name="RCA_Done"
                                id="RCA_Done"
                                value="0"
                                checked={
                                  formEditData["RCA_Done"] == "0" ? true : false
                                }
                              />
                              &nbsp;
                              <span>No</span>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2 ">
              <div className="form-group row" id="createdby">
                <label className="col-5">Created By</label>
                <label className="col-1 p-0">:</label>
                <label className="col-6 ">
                  {type == "add" ? (
                    <input
                      className="disableField"
                      type="Text"
                      id="createdby"
                      readOnly
                      defaultValue={loggedUserName}
                      disabled={true}
                    />
                  ) : (
                    <input
                      type="Text"
                      className="disableField"
                      name="createdby"
                      id="createdby"
                      readOnly
                      defaultValue={editedData?.Created_By}
                      disabled={true}
                    />
                  )}
                </label>
              </div>
            </div>

            <div className="col-md-12 ">
              <div className="col-md-3 mb-2 ">
                <div className="form-group row" id="description">
                  <label className="col-md-12 p0 ">
                    Issue Description<span className="error-text ml-1">*</span>
                  </label>
                </div>
              </div>
            </div>
            <div
              className="col-md-12 mb-2 text error"
              ref={(ele) => {
                ref.current[1] = ele;
              }}
            >
              {type == "add" ? (
                <div className="">
                  <ReactQuill
                    className=""
                    theme="snow"
                    value={value}
                    name="description"
                    id="editor-container"
                    onChange={(e) => {
                      setValue(e);
                      setFormData((prev) => ({
                        ...prev,
                        ["description"]: e,
                      }));
                    }}
                    modules={editorToolBar}
                  />
                </div>
              ) : (
                <>
                  {editedData?.status_id != 432 ? (
                    <div>
                      <ReactQuill
                        className=""
                        theme="snow"
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
                    <div disabled={true}>
                      <ReactQuill
                        className=""
                        theme="snow"
                        disabled={true}
                        readOnly={true}
                        name="description"
                        id="description"
                        defaultValue={editedData?.description}
                        modules={editorToolBar}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="col-md-12 ">
              <div className="col-md-3 ">
                <div className="form-group row" id="comments">
                  <label className="col-md-12 ">Comments</label>
                </div>
              </div>
            </div>
            <div className="col-md-12 p0">
              {type == "add" ? (
                <textarea
                  maxLength={500}
                  rows="4"
                  cols={180}
                  name="comments"
                  id="comments"
                  placeholder="Max 500 characters"
                  onChange={(e) => handleChange(e)}
                />
              ) : (
                <>
                  {editedData?.status_id != 432 ? (
                    <textarea
                      maxLength={500}
                      rows="4"
                      cols={180}
                      name="comments"
                      id="comments"
                      placeholder="Max 500 characters"
                      defaultValue={editedData?.Comments}
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["Comments"]: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <textarea
                      maxLength={500}
                      rows="4"
                      cols={180}
                      name="comments"
                      id="comments"
                      placeholder="Max 500 characters"
                      disabled={true}
                      defaultValue={editedData?.Comments}
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["Comments"]: e.target.value,
                        }))
                      }
                    />
                  )}
                </>
              )}
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
              {type == "add" ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleAddClick();
                  }}
                >
                  <FaSave />
                  Save{" "}
                </button>
              ) : (
                <>
                  {editedData?.status_id != 432 ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        handleEditClick();
                      }}
                    >
                      <FaSave />
                      Save{" "}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ cursor: "no-drop" }}
                    >
                      <FaSave />
                      Save{" "}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}
export default AddPopup;
