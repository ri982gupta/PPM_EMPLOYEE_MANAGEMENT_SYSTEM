import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { environment } from "../../environments/environment";
import axios from "axios";
import { AiFillWarning } from "react-icons/ai";
import DatePicker from "react-datepicker";
import { CModalHeader } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CButton } from "@coreui/react";
import { CModal } from "@coreui/react";
import Draggable from "react-draggable";
import moment from "moment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import SaveIcon from "@mui/icons-material/Save";
import { MdCreate } from "react-icons/md";
import { CModalTitle } from "@coreui/react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import Qbrslpopup from "./Qbrslpopup";
export default function QbrUpdate(props) {
  const {
    buttonPopups,
    setButtonPopups,
    data1,
    setSearchdates,
    customerId,
    getData,
    issueDetails,
    editId,
    type,
    editedData,
    setAddmsg,
    setEditAddmsg,
  } = props;
  const [details, setDetails] = useState();
  const [formEditData, setFormEditData] = useState(details);
  const [ToDate, setToDate] = useState(null);
  const [predate, setpreDate] = useState();
  const [id, setid] = useState(0);
  const [validationMessage, setValidationMessage] = useState(false);
  const ref = useRef([]);
  const [clickButtonPopUp, setClickButtonPopUp] = useState(false);
  const intialOnChangeState1 = {
    prolifics_participants: "",
  };
  const [assignedid, setAssignedid] = useState();
  const [onChangeState1, setOnChangeState1] = useState(intialOnChangeState1);
  const clickButtonHandlerPopUp = () => {
    setClickButtonPopUp(true);
  };
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setOnChangeState1((prev) => ({ ...prev, [id]: value }));
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const [finalState1, setFinalState1] = useState({});
  const [addList1, setAddList1] = useState([{}]);
  const handleAddEmail = () => {
    let data1 = finalState1;
    data1[Object.keys(data1).length] = onChangeState1["prolifics_participants"];
    setFinalState1(data1);
    setAddList1([...addList1, { prolifics_participants: "" }]);
    setDetails(data1);
  };
  useEffect(() => {}, [addList1]);
  const [displayTextEmails, setDisplayTextEmails] = useState([]);
  //-------post data
  const handleSaveClick = () => {
    let valid = GlobalValidation(ref);
    if (valid == true) {
      setValidationMessage(true);
    }
    if (valid) {
      return;
    }
    axios({
      method: "post",
      url: `http://localhost:8092/customersms/Qbr/postqbrdata`,
      data: {
        customer_id: customerId,
        qbr_dt: details.qbr_dt,
        lead_presenter: details.lead_presenter,
        prolifics_participants: details.prolifics_participants,
        customer_participants: details.customer_participants,
        presentation_dt: details.presentation_dt,
        doc_id: 115168044,
        meeting_notes: details.meeting_notes,
      },
    }).then((error) => {
      getData();
      setid();
      setButtonPopups(false);
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
    });
  };

  //----------put data
  const handleEditClick = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMessage(true);
      return;
    }
    axios({
      method: "post",
      url: `http://localhost:8092/customersms/Qbr/postqbrdata`,
      data: {
        id: editId,
        customer_id: parseInt(customerId),
        qbr_dt: formEditData.qbrDt,
        lead_presenter: formEditData.leadPresenter,
        prolifics_participants: formEditData.prolificsParticipants,
        customer_participants: formEditData.customerParticipants,
        presentation_dt: formEditData.presentationDt,
        doc_id: 115168044,
        meeting_notes: editedData.meetingNotes,
      },
    }).then((error) => {
      getData();
      setid();
      setButtonPopups(false);
      setEditAddmsg(true);
      setTimeout(() => {
        setEditAddmsg(false);
      }, 3000);
    });
  };
  return (
    <>
      <Draggable>
        <CModal
          size="xs"
          visible={buttonPopups}
          onClose={() => {
            setButtonPopups(false);
          }}
        >
          <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
            <CModalTitle>
              {type == "add" ? (
                <span className="ft16"> Add QBR</span>
              ) : (
                <span className="ft16"> Edit QBR</span>
              )}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {validationMessage ? (
              <div className="statusMsg error">
                <span className="error-block">
                  <AiFillWarning /> &nbsp; Please select the valid values for
                  highlighted fields
                </span>
              </div>
            ) : (
              ""
            )}
            <div className="col-md-12">
              <div className="form-group row mb-2 ">
                <label className="col-5" htmlFor="">
                  QBR Date<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="datepicker"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    {type == "add" ? (
                      <DatePicker
                        name="qbr_dt"
                        selected={predate}
                        id="qbr_dt"
                        autoComplete="off"
                        dateFormat="dd-MMM-yyyy"
                        onChange={(e) => {
                          setDetails((prev) => ({
                            ...prev,
                            ["qbr_dt"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setpreDate(e);
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    ) : (
                      <DatePicker
                        name="qbr_dt"
                        id="qbr_dt"
                        autoComplete="off"
                        // selected={(editedData?.qbr_dt == "") ? " " : new Date(editedData?.qbr_dt)}
                        selected={
                          editedData.qbrDt == ""
                            ? ""
                            : new Date(editedData.qbrDt)
                        }
                        dateFormat="dd-MMM-yyyy"
                        onChange={(e) => {
                          setpreDate(e);
                          setFormEditData((prev) => ({
                            ...prev,
                            ["qbrDt"]: moment(e).format("yyyy-MM-DD"),
                          }));
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-5">
                  Lead Presenter<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="autocomplete"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    {type == "add" ? (
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={issueDetails}
                          type="Text"
                          name="lead_presenter"
                          id="lead_presenter"
                          placeholder="Type minimum 3 Characters"
                          issueDetails={issueDetails}
                          getData={getData}
                          className="AutoComplete"
                          onSelect={(e) => {
                            setDetails((prevProps) => ({
                              ...prevProps,
                              lead_presenter: e.id,
                            }));
                          }}
                          showIcon={false}
                        />
                      </div>
                    ) : (
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={issueDetails}
                          type="Text"
                          name="lead_presenter"
                          id="lead_presenter"
                          placeholder="Type minimum 3 Characters"
                          issueDetails={issueDetails}
                          getData={getData}
                          className="AutoComplete"
                          onSelect={(e) => {
                            setFormEditData((prev) => ({
                              ...prev,
                              leadPresenter: e.id,
                            }));
                            setAssignedid(e.id);
                          }}
                          inputSearchString={editedData?.leadPresenter}
                          showIcon={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="">
                  Prolifics Participants<span className="error-text"></span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div className="autocomplete">
                    {type == "add" ? (
                      <>
                        <input
                          type="text"
                          name="prolifics_participants"
                          id="prolifics_participants"
                          placeholder="Enter Resource Name"
                          autoComplete="off"
                          required
                          value={displayTextEmails.toString()}
                          onChange={handleChange}
                        />
                        <div className="col-md-1">
                          <button className="btn">
                            {" "}
                            <MdCreate
                              onClick={() => {
                                clickButtonHandlerPopUp();
                              }}
                            />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          name="prolifics_participants"
                          id="prolifics_participants"
                          autoComplete="off"
                          placeholder="Enter Resource Name"
                          required
                          value={displayTextEmails.toString()}
                          onChange={handleChange}
                        />
                        <div className="col-md-1">
                          <button className="btn">
                            <MdCreate
                              onClick={() => {
                                clickButtonHandlerPopUp();
                              }}
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="Date">
                  Customer Participants<span className="error-text"></span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 textfield">
                  <div className="autocomplete">
                    {type == "add" ? (
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={issueDetails}
                          type="Text"
                          name="customer_participants"
                          id="customer_participants"
                          placeholder="Type minimum 3 Characters"
                          issueDetails={issueDetails}
                          getData={getData}
                          className="AutoComplete"
                          onSelect={(e) => {
                            setDetails((prevProps) => ({
                              ...prevProps,
                              customer_participants: e.id,
                            }));
                          }}
                          showIcon={false}
                        />
                      </div>
                    ) : (
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={issueDetails}
                          type="Text"
                          name="customer_participants"
                          id="customer_participants"
                          placeholder="Type minimum 3 Characters"
                          issueDetails={issueDetails}
                          getData={getData}
                          className="AutoComplete"
                          onSelect={(e) => {
                            setFormEditData((prevProps) => ({
                              ...prevProps,
                              customerParticipants: e.id,
                            }));
                          }}
                          inputSearchString={editedData?.customerParticipants}
                          showIcon={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="Date">
                  Presentation Date<span className="error-text"></span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 textfield">
                  {type == "add" ? (
                    <DatePicker
                      name="presentation_dt"
                      selected={predate}
                      id="presentation_dt"
                      autoComplete="off"
                      dateFormat="dd-MMM-yyyy"
                      onChange={(e) => {
                        setDetails((prev) => ({
                          ...prev,
                          ["presentation_dt"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        setpreDate(e);
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  ) : (
                    <DatePicker
                      name="presentation_dt"
                      selected={
                        editedData?.presentationDt == ""
                          ? " "
                          : new Date(editedData?.presentationDt)
                      }
                      id="presentation_dt"
                      autoComplete="off"
                      dateFormat="dd-MMM-yyyy"
                      onChange={(e) => {
                        setpreDate(e);
                        setFormEditData((prev) => ({
                          ...prev,
                          ["presentationDt"]: moment(e).format("yyyy-MM-DD"),
                        }));
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
                <label className="col-5" htmlFor="">
                  Upload Documents
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  {type == "add" ? (
                    <input
                      type="text"
                      name="doc_id"
                      placeholder="Choose File"
                      id="doc_id"
                      onChange={(e) =>
                        setDetails((prev) => ({
                          ...prev,
                          ["doc_id"]: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <input
                      type="text"
                      name="doc_id"
                      id="doc_id"
                      placeholder="Choose File"
                      onChange={(e) =>
                        setDetails((prev) => ({
                          ...prev,
                          ["doc_id"]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="">
                  Meeting Notes & Next Steps
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  {type == "add" ? (
                    <textarea
                      type="meeting_notes"
                      name="meeting_notes"
                      id="meeting_notes"
                      onChange={(e) => handleChange(e)}
                    />
                  ) : (
                    <textarea
                      type="meeting_notes"
                      name="meeting_notes"
                      id="meeting_notes"
                      defaultValue={editedData?.meetingNotes}
                      onChange={(e) =>
                        setFormEditData((prev) => ({
                          ...prev,
                          ["meeting_notes"]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
              {type == "add" ? (
                <button className="btn btn-primary " onClick={handleSaveClick}>
                  <SaveIcon />
                  Save
                </button>
              ) : (
                <button className="btn btn-primary " onClick={handleEditClick}>
                  <SaveIcon />
                  Save
                </button>
              )}
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
      {clickButtonPopUp ? (
        <Qbrslpopup
          editedData={editedData}
          clickButtonPopUp={clickButtonPopUp}
          setFormEditData={setFormEditData}
          formEditData={formEditData}
          setClickButtonPopUp={setClickButtonPopUp}
          handleChange={handleChange}
          handleAddEmail={handleAddEmail}
          addList1={addList1}
          setAddList1={setAddList1}
          finalState1={finalState1}
          issueDetails={issueDetails}
          details={details}
          getData={getData}
          setDetails={setDetails}
          setDisplayTextEmails={setDisplayTextEmails}
          displayTextEmails={displayTextEmails}
        />
      ) : (
        ""
      )}
    </>
  );
}
