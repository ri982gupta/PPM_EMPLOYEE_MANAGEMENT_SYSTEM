import React, { useState, useEffect, useRef } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AiFillWarning } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import { environment } from "../../environments/environment";
import { FaSave } from "react-icons/fa";
import "./Issue.scss";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import GlobalValidation from "../ValidationComponent/GlobalValidation";

function RiskPopup(props) {
  const {
    openPopup,
    setOpenPopup,
    projectId,
    type,
    editId,
    setEditedData,
    editedData,
    getTableData,
    addmsg,
    setAddmsg,
    setEditmsg,
    tableData,
    projectData,
  } = props;

  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");

  const baseUrl = environment.baseUrl;
  const [value, setValue] = useState("");
  const [risk_occured_date, setOccurredDate] = useState(null);
  const [mitigation_date, setMitigationDate] = useState(null);
  const [risktype, setRiskType] = useState([]);
  const [risksource, setRiskSource] = useState([]);
  const [riskimpact, setRiskImpact] = useState([]);
  const [probabilityofoccurrence, setProbabilityOfOccurrence] = useState([]);
  const [riskstatus, setRiskStatus] = useState([]);
  const [riskoccurredDone, setRiskOccurredDone] = useState("0");

  const [validationMessage, setValidationMessage] = useState(false);
  const [riskDetails, setRiskDetails] = useState([]);

  const data = {
    projectid: projectId,
    risk_occured_date: "",
    assigned_to: "",
    occurence_prob_id: "",
    risk_value: "",
    risk_source: " ",
    risk_type: "",
    is_risk_occured: "0",
    created_by_id: loggedUserId,
    created_by_name: loggedUserName,
    risk_impact: "",
    mitigation_plan: "",
    mitigation_date: "",
    last_updated_by_id: loggedUserId,
  };
  const [formData, setFormData] = useState(data);
  const [formEditData, setFormEditData] = useState(editedData);
  const [assignedid, setAssignedid] = useState();

  const [riskValue, setRiskValue] = useState(0);
  const [riskValueedited, setRiskValueEdited] = useState(0);
  const ref = useRef([]);

  const riskImpactRef = useRef(null);
  const probOfOccurRef = useRef(null);

  const [item, setItem] = useState([]);
  useEffect(() => {}, [item]);

  const editorToolBar = {
    toolbar: [
      [
        { header: [false, 1, 2, 3, 4, 5, 6] },
        { color: [] },
        "bold",
        "italic",
        "underline",
        { list: "ordered" },
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
        "image",
        "code-block",
        "clean",
      ],
    ],
  };
  useEffect(() => {
    getRiskType();
    getRiskSource();
    getRiskImpact();
    getProbabilityOfOccurrence();
    getRiskStatus();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setFormEditData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    let riskimpactValue = null;
    let probabilityValue = null;
    riskimpact.map((risk) => {
      if (risk.id == formData.risk_impact) {
        riskimpactValue = risk.lkup_name.split("-")[0];
      }
    });
    probabilityofoccurrence.map((probability) => {
      if (probability.id == formData.occurence_prob_id) {
        probabilityValue = probability.lkup_name.split("-")[0];
      }
    });
    if (riskimpactValue != null && probabilityValue != null) {
      setRiskValue(parseInt(riskimpactValue) * parseInt(probabilityValue));
    }
  }, [formData]);

  useEffect(() => {
    if (type != "add") {
      setRiskValueEdited(formEditData.risk_value);
    }
  }, [formEditData]);

  useEffect(() => {}, [formEditData.riskValue]);

  const getRiskType = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getRiskType`,
    }).then((res) => {
      var risktype = res.data;
      setRiskType(risktype);
    });
  };

  const getRiskSource = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getRiskSource`,
    }).then((res) => {
      var risksource = res.data;
      setRiskSource(risksource);
    });
  };

  const getRiskImpact = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getRiskImpact`,
    }).then((res) => {
      var riskimpact = res.data;
      setRiskImpact(riskimpact);
    });
  };

  const getProbabilityOfOccurrence = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getProbabilityOfOccurrence`,
    }).then((res) => {
      var probabilityofoccurrence = res.data;
      setProbabilityOfOccurrence(probabilityofoccurrence);
    });
  };

  const getRiskStatus = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getRiskStatus`,
    }).then((res) => {
      var riskstatus = res.data;
      setRiskStatus(riskstatus);
    });
  };

  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setRiskDetails(res);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleAddClick = () => {
    let adddata = document.getElementsByClassName("error");

    for (let i = 0; i < adddata.length; i++) {
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
    let name = formData.risk_name;
    let Value = formData.risk_value;
    let source = formData.risk_source;
    let rsiktype = formData.risk_type;
    let riskimpact = formData.risk_impact;
    let occurence = formData.occurence_prob_id;
    let description1 = formData.description;

    if (
      Object.values({
        name,
        rsiktype,
        source,
        Value,
        riskimpact,
        occurence,
        description1,
      }).includes(" ")
    ) {
      setValidationMessage(true);
      return;
    }
    setValidationMessage(false);

    formData.risk_value = riskValue;

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/risks/postProjectRiskData`,
      // url: `http://localhost:9000/ProjectMS/risks/postProjectRiskData`,
      data: formData,
    }).then((error) => {
      setOpenPopup(false);
      getTableData();
      setValidationMessage(false);
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
    });
  };
  console.log(formEditData);
  const handleEditClick = () => {
    let adddata = document.getElementsByClassName("error");

    for (let i = 0; i < adddata.length; i++) {
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

    let name = formEditData.risk_name;
    let source = formEditData.source_id;
    let status = formEditData.status_id;
    let rsiktype = formEditData.type_id;
    let riskimpact = formEditData.impact_id;
    let occurence = formEditData.occurence_prob_id;
    let description1 = formEditData.description;
    let riskValue1 = formEditData.risk_value;

    if (
      Object.values({
        name,
        source,
        status,
        riskValue1,
        rsiktype,
        riskimpact,
        occurence,
        description1,
      }).includes("")
    ) {
      setValidationMessage(true);

      return;
    }
    setValidationMessage(false);
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/risks/postProjectRiskData`,
      // url: `http://localhost:9000/ProjectMS/risks/postProjectRiskData`,
      data: {
        id: formEditData.id,
        projectid: projectId,
        assigned_to: formEditData.owner_id,
        risk_impact: formEditData.impact_id,
        risk_name: formEditData.risk_name,
        risk_source: formEditData.source_id,
        risk_status: formEditData.status_id,
        risk_type: formEditData.type_id,
        description:
          formEditData.description === "" ? value : formEditData.description,
        is_risk_occured:
          formEditData?.is_risk_occured === true
            ? "1"
            : formEditData?.is_risk_occured === false
            ? "0"
            : formEditData?.is_risk_occured,
        mitigation_date: formEditData.mitigation_date,
        mitigation_plan: formEditData.mitigation_plan,
        risk_value: formEditData.risk_value,
        occurence_prob_id: formEditData.occurence_prob_id,
        last_updated_by_id: loggedUserId,
        risk_occured_date: formEditData.risk_occured_date,
        created_by_id: formEditData.created_by_id,
        created_by_name: formEditData.created_by_name,
        date_created: formEditData.date_created,
      },
    }).then((error) => {
      setOpenPopup(false);
      getTableData();
      setEditmsg(true);
      setTimeout(() => {
        setEditmsg(false);
      }, 3000);
    });
  };

  return (
    <div className="col-md-12 ">
      <CModal
        visible={openPopup}
        size="xl"
        className=" u"
        onClose={() => setOpenPopup(false)}
        backdrop={"static"}
      >
        <CModalHeader className="" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            {type == "add" ? (
              <span className="">Add Risk</span>
            ) : (
              <span className=""> Edit Risk </span>
            )}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="group-content row">
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
            {projectData.map((list) => (
              <div className="col-md-3 mb-2">
                <div className="form-group row" id="project">
                  <label className="col-5">Project</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <input
                      type="Text"
                      className="disableField"
                      name="project_id"
                      id={projectId}
                      disabled={true}
                      value={list.projectName}
                      onChange={(e) => handleChange(e)}
                      style={{ cursor: "not-allowed" }}
                    />
                  </label>
                </div>
              </div>
            ))}
            <div className=" col-md-3 mb-2">
              <div className="form-group row" id="name">
                <label className="col-5">
                  Risk Name&nbsp;<span class="required"> *</span>
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
                      className={`text error unique ${
                        formData.risk_name && formData.risk_name.length >= 50
                          ? "error"
                          : ""
                      }`}
                      type="Text"
                      name="risk_name"
                      id="risk_name"
                      placeholder="Max 50 characters"
                      maxLength={50}
                      value={formData.risk_name || ""}
                      onKeyDown={(event) => {
                        if (event.code === "Space" && !formData.risk_name)
                          event.preventDefault();
                      }}
                      onChange={(e) => handleChange(e)}
                    />
                  ) : (
                    <input
                      className={`text ${
                        formData.risk_name && formData.risk_name.length >= 50
                          ? "error"
                          : ""
                      }`}
                      type="Text"
                      name="risk_name"
                      id="risk_name"
                      placeholder="Max 50 characters"
                      maxLength={50}
                      onKeyDown={(event) => {
                        if (
                          event.code === "Space" &&
                          formData?.risk_name?.length === 0
                        )
                          event.preventDefault();
                      }}
                      defaultValue={editedData?.risk_name}
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["risk_name"]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5">
                  Risk Type&nbsp;
                  <span className="required error-text ml-1"> *</span>
                </label>
                <label className="col-1 p-0">:</label>
                <label className="col-6">
                  {type == "add" ? (
                    <select
                      className="text error"
                      name="risk_type"
                      id="risk_type"
                      onChange={(e) => handleChange(e)}
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {risktype.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="text error"
                      name="risk_type"
                      id="risk_type"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["type_id"]: e.target.value,
                        }))
                      }
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {risktype.map((Item) => (
                        <option
                          value={Item.id}
                          selected={
                            Item.id == editedData?.type_id ? true : false
                          }
                        >
                          {Item.lkup_name}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              </div>
            </div>
            <div className="col-md-3 p0">
              <div className="form-group row">
                <label className="col-5 p0">
                  Risk Source&nbsp;<span class="required">*</span>
                </label>
                <label className="col-1 p-0">:</label>
                <label className="col-6 ">
                  {type == "add" ? (
                    <select
                      className="text error"
                      name="risk_source"
                      id="risk_source"
                      onChange={(e) => handleChange(e)}
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {risksource.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="text error"
                      name="risk_source"
                      id="risk_source"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["source_id"]: e.target.value,
                        }))
                      }
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {risksource.map((Item) => (
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
                </label>
              </div>
            </div>

            <div className="col-md-3 mb-2">
              <div
                className="form-group row"
                name="risk_impact"
                id="risk_impact"
              >
                <label className="col-5">
                  Risk Impact&nbsp;<span class="required"> *</span>
                </label>
                <label className="col-1 p-0">:</label>
                <label className="col-6">
                  {type == "add" ? (
                    <select
                      className="text error"
                      name="risk_impact"
                      id="risk_impact"
                      onChange={(e) => handleChange(e)}
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {riskimpact.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="text error"
                      ref={riskImpactRef}
                      name="risk_impact"
                      id="risk_impact"
                      onChange={(e) => {
                        let opt = riskImpactRef.current.children;

                        let riskImpactVl = null;

                        for (let i = 0; i < opt.length; i++) {
                          if (opt[i].value == e.target.value) {
                            riskImpactVl = opt[i].innerText.split("-")[0];
                            setFormEditData((prev) => ({
                              ...prev,
                              ["risk_impact"]: opt[i].innerText,
                            }));
                          }
                        }

                        setFormEditData((prev) => ({
                          ...prev,
                          ["impact_id"]: e.target.value,
                        }));
                        setFormEditData((prev) => ({
                          ...prev,
                          ["risk_value"]:
                            formEditData["occurence_prob_name"].split("-")[0] *
                            riskImpactVl,
                        }));
                      }}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {riskimpact.map((Item) => (
                        <option
                          value={Item.id}
                          selected={
                            Item.id == editedData?.impact_id ? true : false
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
            <div className="col-md-3 p0">
              <div className="form-group row">
                <label className="col-5">
                  Probability of Occurrence&nbsp;<span class="required">*</span>
                </label>
                <label className="col-1 p-0">:</label>
                <label className="col-6">
                  {type == "add" ? (
                    <select
                      className="text error"
                      name=" occurence_prob_id"
                      id="occurence_prob_id"
                      onChange={(e) => handleChange(e)}
                      ref={(ele) => {
                        ref.current[4] = ele;
                      }}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {probabilityofoccurrence.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="text error"
                      name=" occurence_prob_id"
                      id="occurence_prob_id"
                      ref={probOfOccurRef}
                      onChange={(e) => {
                        setFormEditData((prev) => ({
                          ...prev,
                          ["occurence_prob_id"]: e.target.value,
                        }));
                        let opt = probOfOccurRef.current.children;

                        let probOccurVl = null;

                        for (let i = 0; i < opt.length; i++) {
                          if (opt[i].value == e.target.value) {
                            probOccurVl = opt[i].innerText.split("-")[0];
                            setFormEditData((prev) => ({
                              ...prev,
                              ["occurence_prob_name"]: opt[i].innerText,
                            }));
                          }
                        }

                        setFormEditData((prev) => ({
                          ...prev,
                          ["risk_value"]:
                            formEditData["risk_impact"].split("-")[0] *
                            probOccurVl,
                        }));
                      }}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {probabilityofoccurrence.map((Item) => (
                        <option
                          value={Item.id}
                          selected={
                            Item.id == editedData?.occurence_prob_id
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
                </label>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5">
                  Risk Value&nbsp;<span class="required"> *</span>
                </label>
                <label className="col-1 p-0">:</label>
                <label className="col-6">
                  <input
                    type="Text"
                    className="error"
                    name="risk_value"
                    id="risk_value"
                    value={type == "add" ? riskValue : riskValueedited}
                    disabled={true}
                    style={{ cursor: "not-allowed" }}
                  />
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group row">
                <label className="col-5 ">
                  Risk Status&nbsp;<span class="required"> *</span>
                </label>
                <label className="col-1 p-0">:</label>
                <label className="col-6 ">
                  {type == "add" ? (
                    <select
                      className="text error"
                      name="risk_status"
                      id="risk_status"
                      onChange={(e) => handleChange(e)}
                      ref={(ele) => {
                        ref.current[5] = ele;
                      }}
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {riskstatus.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="error col-md-12"
                      name="risk_status"
                      id="risk_status"
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["status_id"]: e.target.value,
                        }))
                      }
                    >
                      <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                      {riskstatus.map((Item) => (
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
            <div className="col-md-3 mb-2 ">
              <div className="form-group row">
                <label className="col-5">Assigned To</label>
                <label className="col-1 p-0">:</label>
                <label className="col-6 p0">
                  {type == "add" ? (
                    <>
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={riskDetails}
                          type="Text"
                          name="assigned_to"
                          id="assigned_to"
                          riskDetails={riskDetails}
                          getData={getData}
                          onSelect={(e) => {
                            setFormData((prevProps) => ({
                              ...prevProps,
                              assigned_to: e.id,
                            }));
                          }}
                          showIcon={false}
                        />
                      </div>
                      <span>{item.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={riskDetails}
                          type="Text"
                          name="assigned_to"
                          inputSearchString={formEditData?.assigned_to}
                          id="assigned_to"
                          riskDetails={riskDetails}
                          getData={getData}
                          onSelect={(e) => {
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
                        />
                      </div>

                      <span>{item.name}</span>
                    </>
                  )}
                </label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group row">
                <label className="col-5 ">Risk Occurred</label>
                <label className="col-1 p-0">:</label>
                <label className="col-6">
                  {type == "add" ? (
                    <>
                      <div
                        className="col-6"
                        onChange={(e) => {
                          setRiskOccurredDone("1");
                          setFormData((prev) => ({
                            ...prev,
                            ["is_risk_occured"]: "1",
                          }));
                        }}
                      >
                        <input
                          className="form-check-input"
                          htmlFor="yes"
                          type="radio"
                          value="1"
                          name="is_risk_occured"
                          id="is_risk_occured"
                          checked={
                            formData["is_risk_occured"] == "1" ? true : false
                          }
                        />
                        &nbsp;
                        <span className="form-check-label">Yes</span>{" "}
                      </div>
                      <div
                        className="col-6"
                        onChange={(e) => {
                          setRiskOccurredDone("0");
                          setFormData((prev) => ({
                            ...prev,
                            ["is_risk_occured"]: "0",
                          }));
                        }}
                      >
                        <input
                          className="form-check-input"
                          htmlFor="no"
                          type="radio"
                          name="is_risk_occured"
                          id="is_risk_occured"
                          value="0"
                          checked={
                            formData["is_risk_occured"] != "1" ? true : false
                          }
                        />
                        &nbsp;
                        <span className="form-check-label">No</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="col-6 "
                        onChange={(e) => {
                          setFormEditData((prev) => ({
                            ...prev,
                            ["is_risk_occured"]: "1",
                          }));
                        }}
                      >
                        <input
                          className="form-check-input"
                          htmlFor="yes"
                          type="radio"
                          value="1"
                          name="is_risk_occured"
                          id="is_risk_occured"
                          checked={
                            formEditData["is_risk_occured"] == "1"
                              ? true
                              : false
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
                            ["is_risk_occured"]: "0",
                          }));
                        }}
                      >
                        <input
                          className="form-check-input"
                          htmlFor="no"
                          type="radio"
                          name="is_risk_occured"
                          id="is_risk_occured"
                          value="0"
                          checked={
                            formEditData["is_risk_occured"] == "0"
                              ? true
                              : false
                          }
                        />
                        &nbsp;
                        <span>No</span>
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div
                className="form-group row"
                classname="Space"
                id="risk_occured_date"
              >
                <label className="col-5">Occured Date</label>
                <label className="col-1 p-0">:</label>
                <label className="col-md-6">
                  {type == "add" ? (
                    <DatePicker
                      name="risk_occured_date"
                      id="risk_occured_date"
                      selected={risk_occured_date}
                      dateFormat="dd-MMM-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          ["risk_occured_date"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        setOccurredDate(e);
                      }}
                    />
                  ) : (
                    <DatePicker
                      name="risk_occured_date"
                      id="risk_occured_date"
                      selected={
                        formEditData["risk_occured_date"] == undefined || null
                          ? ""
                          : moment(formEditData["risk_occured_date"])._d
                      }
                      dateFormat="dd-MMM-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(e) => {
                        setFormEditData((prev) => ({
                          ...prev,
                          ["risk_occured_date"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        setOccurredDate(e);
                      }}
                    />
                  )}
                </label>
              </div>
            </div>
            <div className="col-md-3" id="created_by_name">
              <div className="form-group row">
                <label className="col-5">Created By</label>
                <label className="col-1 p-0">:</label>
                <label className="col-6 ">
                  <div className="col-md-12 p0 ">
                    {type == "add" ? (
                      <input
                        type="Text"
                        className="disableField"
                        name="created_by_name"
                        id="created_by_name"
                        readOnly
                        defaultValue={loggedUserName}
                        style={{ cursor: "not-allowed" }}
                        disabled={true}
                      />
                    ) : (
                      <input
                        type="Text"
                        name="created_by_name"
                        id="created_by_name"
                        readOnly
                        defaultValue={loggedUserName}
                        style={{ cursor: "not-allowed" }}
                        disabled={true}
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="col-md-3 mb-2">
              <div className="form-group row" id="Risk Description">
                <label className="col-md-12 p0">
                  Risk Description&nbsp;<span class="error-text ml-1"> *</span>
                </label>
              </div>
            </div>
          </div>
          <div
            className="col-md-12 mb-2 text error"
            ref={(ele) => {
              ref.current[6] = ele;
            }}
          >
            {" "}
            {type == "add" ? (
              <div className="">
                <ReactQuill
                  className="error"
                  theme="snow"
                  value={value}
                  name="description"
                  id="description"
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
                {" "}
                <ReactQuill
                  className="error"
                  theme="snow"
                  defaultValue={editedData?.description}
                  name="description"
                  id="description"
                  onChange={(e) => {
                    setValue(e);
                    setFormEditData((prev) => ({
                      ...prev,
                      ["description"]: e,
                    }));
                  }}
                  modules={editorToolBar}
                />
              </>
            )}
          </div>
          <div className="col-md-12">
            <div className="col-md-3" id="mitigation_plan">
              <label className="col-md-12">Mitigation Plan</label>
            </div>
          </div>
          <div className="col-md-12 p0">
            {type == "add" ? (
              <textarea
                maxLength={500}
                rows="4"
                cols={175}
                id="mitigation_plan"
                style={{ padding: "0px" }}
                placeholder="Max 500 characters"
                onChange={(e) => handleChange(e)}
              />
            ) : (
              <textarea
                maxLength={500}
                rows="4"
                cols={175}
                id="mitigation_plan"
                style={{ padding: "0px" }}
                placeholder="Max 500 characters"
                defaultValue={editedData?.mitigation_plan}
                onChange={(e) => handleChange(e)}
              />
            )}{" "}
          </div>
          <div className="col-md-12 col-sm-12 col-xs-12 no-padding center">
            <div className="clearfix" style={{ height: "10px" }}></div>
          </div>

          <div className="col-md-12">
            <div
              className="Space"
              id="mitigation_date"
              style={{ height: "2px" }}
            ></div>
            <div className="col-md-3" id="mitigation_date">
              <label className="col-md-6 p0">Mitigation Date</label>
              {type == "add" ? (
                <DatePicker
                  name="mitigation_date"
                  id="mitigation_date"
                  selected={mitigation_date}
                  dateFormat="dd-MMM-yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      ["mitigation_date"]: moment(e).format("yyyy-MM-DD"),
                    }));
                    setMitigationDate(e);
                  }}
                />
              ) : (
                <DatePicker
                  name="mitigation_date"
                  id="mitigation_date"
                  selected={
                    formEditData["mitigation_date"] == undefined || null
                      ? ""
                      : moment(formEditData["mitigation_date"])._d
                  }
                  dateFormat="dd-MMM-yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  onChange={(e) => {
                    setFormEditData((prev) => ({
                      ...prev,
                      ["mitigation_date"]: moment(e).format("yyyy-MM-DD"),
                    }));
                    setMitigationDate(e);
                  }}
                />
              )}
            </div>
          </div>

          <br />

          <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
            {type == "add" ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddClick}
              >
                <FaSave />
                Save{" "}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEditClick}
              >
                <FaSave />
                Save{" "}
              </button>
            )}
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}
export default RiskPopup;
