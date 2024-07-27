import React, { useState, useEffect, useRef } from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import "./ProjectScopesChanges.scss";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import { environment } from "../../environments/environment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import { FaSave } from "react-icons/fa";

function ProjectScopeChangesAddAndEditPopUP(props) {
  const ref = useRef([]);

  const {
    addAndEditPopup,
    setaddAndEditPopup,
    type,
    editId,
    editedData,
    getScopeChanges,
    projectId,
    setAddmsg,
    setEditAddmsg,
  } = props;

  const [formEditData, setFormEditData] = useState(editedData);
  const [id, setid] = useState(0);
  const [validationmessage, setValidationMessage] = useState(false);
  const [StartDt, setStartDt] = useState(null);
  const baseUrl = environment.baseUrl;

  useEffect(
    () => {
      type == "add"
        ? setStartDt(null)
        : setStartDt(moment(editedData.change_req_date)._d);
    },
    [editedData],
    [formEditData]
  );

  ////////==================Adding the new record in table ==========///////

  const handleAddClick = () => {
    let valid = GlobalValidation(ref);
    if (valid === true) {
      setValidationMessage(true);
    }
    if (valid) {
      return;
    }
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/postScopeChanges`,
      data: {
        id: null,
        projectId: projectId,
        description: formEditData.description,
        changeReqDate: formEditData.change_req_date,
        financialImpact: formEditData.financial_impact,
      },
      headers: { "Content-Type": "application/json" },
    }).then(() => {
      setid();
      setaddAndEditPopup(false);
      getScopeChanges();
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 1000);
    });
  };

  ///////============Editing the recent record in table =======/////////
  const handleEditClick = () => {
    let valid = GlobalValidation(ref);
    if (valid === true) {
      setValidationMessage(true);
    }
    if (valid) {
      return;
    }
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/postScopeChanges`,
      data: {
        id: editId,
        projectId: projectId,
        description: formEditData.description,
        changeReqDate: moment(formEditData.change_req_date).format(
          "yyyy-MM-DD"
        ),
        financialImpact: formEditData.financial_impact,
      },
    }).then((response) => {
      getScopeChanges();
      setid();
      setaddAndEditPopup(false);
      setEditAddmsg(true);
      type = "add";
    });
    setTimeout(() => {
      setEditAddmsg(false);
    }, 1000);
  };

  return (
    <div className="col-md-12">
      <CModal
        alignment="center"
        backdrop="static"
        size="xs"
        visible={addAndEditPopup}
        onClose={() => setaddAndEditPopup(false)}
      >
        <CModalHeader className="">
          <CModalTitle>
            {type == "add" ? (
              <span className=""> Add/Edit New Project Scope</span>
            ) : (
              <span className=""> Add/Edit Project Scope</span>
            )}
          </CModalTitle>
        </CModalHeader>
        <div>
          {validationmessage ? (
            <div className=" ml-2 mr-2 statusMsg error">
              {" "}
              <span className="error-block">
                <AiFillWarning />
                &nbsp;Please enter valid value for highlighted fields.
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
        <CModalBody>
          <div>
            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-5">Description of Changes</label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  {type == "add" ? (
                    <input
                      type="text"
                      placeholder="Description of Change"
                      style={{ fontStyle: "normal" }}
                      name="description"
                      onKeyDown={(event) => {
                        if (event.code === "Space" && !formEditData.description)
                          event.preventDefault();
                      }}
                      required
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["description"]: e.target.value.trim(),
                        }))
                      }
                    ></input>
                  ) : (
                    <input
                      type="text"
                      placeholder="Description of Change"
                      style={{ fontStyle: "normal" }}
                      name="description"
                      onKeyDown={(event) => {
                        if (event.code === "Space" && !formEditData.description)
                          event.preventDefault();
                      }}
                      required
                      defaultValue={editedData.description}
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["description"]: e.target.value.trim(),
                        }))
                      }
                    ></input>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-5">Change Requested Date</label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 datepicker"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  {type == "add" ? (
                    <DatePicker
                      name="change_req_date"
                      selected={StartDt}
                      showMonthDropdown
                      dateFormat={"dd-MMM-yyyy"}
                      showYearDropdown
                      dropdownMode="select"
                      defaultValue={""}
                      onChange={(e) => {
                        setStartDt(e);
                        setFormEditData((prev) => ({
                          ...prev,
                          ["change_req_date"]: moment(e).format("yyyy-MM-DD"),
                        }));
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  ) : (
                    <DatePicker
                      name="change_req_date"
                      dateFormat={"dd-MMM-yyyy"}
                      selected={StartDt}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      defaultValue={moment(editedData.change_req_date)._d}
                      onChange={(e) => {
                        setFormEditData((prev) => ({
                          ...prev,
                          ["change_req_date"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        setStartDt(e);
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-5">Financial Impact</label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  {type == "add" ? (
                    <input
                      type="text"
                      placeholder="Financial Impact"
                      style={{ fontStyle: "normal" }}
                      name="financial_impact"
                      onKeyDown={(event) => {
                        if (
                          event.code === "Space" &&
                          !formEditData.financial_impact
                        )
                          event.preventDefault();
                      }}
                      required
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["financial_impact"]: e.target.value.trim(),
                        }))
                      }
                    ></input>
                  ) : (
                    <input
                      type="text"
                      placeholder="Financial Impact"
                      style={{ fontStyle: "normal" }}
                      name="financial_impact"
                      onKeyDown={(event) => {
                        if (
                          event.code === "Space" &&
                          !formEditData.financial_impact
                        )
                          event.preventDefault();
                      }}
                      required
                      defaultValue={editedData.financial_impact}
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["financial_impact"]: e.target.value.trim(),
                        }))
                      }
                    ></input>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12" align="center">
              {type == "add" ? (
                <button
                  type="button"
                  title="Save"
                  className="btn btn-primary"
                  onClick={handleAddClick}
                >
                  <FaSave />
                  Save
                </button>
              ) : (
                <button
                  type="button"
                  title="Save"
                  className="btn btn-primary"
                  onClick={handleEditClick}
                >
                  <FaSave />
                  Save
                </button>
              )}
            </div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}
export default ProjectScopeChangesAddAndEditPopUP;
