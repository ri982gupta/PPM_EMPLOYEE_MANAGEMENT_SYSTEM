import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { environment } from "../../environments/environment";
import axios from "axios";
import { AiFillWarning } from "react-icons/ai";
import DatePicker from "react-datepicker";
import { CModalHeader } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModal } from "@coreui/react";
import Draggable from "react-draggable";
import moment from "moment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import SaveIcon from "@mui/icons-material/Save";
import { MdCreate } from "react-icons/md";
import { CModalTitle } from "@coreui/react";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";

import GlobalValidation from "../ValidationComponent/GlobalValidation";
import Qbrslpopup from "./Qbrslpopup";
import { FaSave } from "react-icons/fa";
export default function QbrUpdate(props) {
  const {
    buttonPopups,
    documentId,
    setDcoumentId,
    setButtonPopups,
    customerId,
    storeprolificparticipantid,
    issueDetails,
    editId,
    type,
    data,
    editedData,
    setEditedData,
    setAddmsg,
    selectedId,
    setEditAddmsg,
    setData,
  } = props;
  console.log(editedData?.prolifics_participants);
  const baseUrl = environment.baseUrl;
  const [prevData, setPrevData] = useState([]);
  const [prevNumData, setPrevNumData] = useState([]);
  const prolificsParticipants = editedData?.prolificsParticipants;
  const prolificsParticipantIds = editedData?.prolifics_participants;
  useEffect(() => {
    if (
      prolificsParticipantIds &&
      typeof prolificsParticipantIds === "string"
    ) {
      const commaSeparatedString = prolificsParticipantIds;
      const numberArray = commaSeparatedString.split(",").map(Number);
      // console.log(numberArray);
      setPrevNumData(numberArray);
    } else {
      console.log("No valid string found in editedData?.prolificsParticipants");
    }
  }, [prolificsParticipantIds]);

  useEffect(() => {
    if (prolificsParticipants && typeof prolificsParticipants === "string") {
      const regex = /\b(\w+\s+\w+)\b/g;
      const matches = prolificsParticipants.match(regex);
      setPrevData(matches);
    } else {
      console.log("No valid string found in editedData?.prolificsParticipants");
    }
  }, [prolificsParticipants]);
  useEffect(() => {
    console.log(prevData);
    if (type == "add") {
      setValue([]);
      setValueID([]);
    } else {
      setValue(prevData);
      setValueID(prevNumData);
    }

    // Log the state outside the useEffect
  }, [prevData, prevNumData]);

  ///------------
  const getData = () => {
    axios
      .get(baseUrl + `/customersms/Qbr/getQbrDetails?cid=${customerId}`)

      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["SNo"] = i + 1;
        }
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["qbr_dt"] =
            GetData[i]["qbr_dt"] == null
              ? ""
              : moment(GetData[i]["qbr_dt"]).format("DD-MMM-YYYY");

          GetData[i]["presentation_dt"] =
            GetData[i]["presentation_dt"] == null
              ? ""
              : moment(GetData[i]["presentation_dt"]).format("DD-MMM-YYYY");
        }

        let dataHeader = [
          {
            SNo: "S.No",
            qbr_dt: "QBR Date",
            leadPresenter: "Lead Presenter",
            prolificsParticipants: "Prolifics Participants",
            customerParticipants: "Customer Participant",
            presentation_dt: "Presentation Date",
            meeting_notes: "Meeting Notes & Next Steps",
            doc_id: "Presentation File",
            Action: "Action",
          },
        ];
        // let data = ["Action"];
        // setLinkColumns(data);
        setData(dataHeader.concat(GetData));
      });
  };
  useEffect(() => {
    getData();
  }, []);
  const [selectedFile, setSelectedFile] = useState(0);
  const [key, setKey] = useState(0);
  console.log(selectedFile);
  const [presentationdate, setPresentationdate] = useState(null);
  const [postpresentationdate, setPostpresentationdate] = useState(null);
  const onFileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const [formEditData, setFormEditData] = useState(editedData);
  const [ToDate, setToDate] = useState(null);
  const [QBRdate, setQBRDate] = useState();
  const [predate, setpreDate] = useState(null);

  const [id, setid] = useState(0);
  const [validationMessage, setValidationMessage] = useState(false);
  const ref = useRef([]);
  const [clickButtonPopUp, setClickButtonPopUp] = useState(false);
  const [finalState1, setFinalState1] = useState({});
  const [addList1, setAddList1] = useState([{}]);

  const [hideSelectbutton, sethideSelectbutton] = useState(false);
  const intialOnChangeState1 = {
    prolifics_participants: "",
  };
  const [onChangeState1, setOnChangeState1] = useState(intialOnChangeState1);
  const clickButtonHandlerPopUp = () => {
    setClickButtonPopUp(true);
    sethideSelectbutton(true);
  };
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    // setOnChangeState1((prev) => ({ ...prev, [id]: value }));
    setFormEditData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const [prolificspartId, setprolificspartId] = useState({});
  const [value, setValue] = useState([]);
  console.log(value);
  const [valueID, setValueID] = useState([]);
  console.log(valueID);
  const filteredValues = Array.isArray(value)
    ? value.filter((item) => item !== null && item !== undefined)
    : [];

  filteredValues.forEach((value) => {
    // Check if there are commas in the value
    if (value.includes(",")) {
      console.log(value);
    } else {
      // Remove commas and log
      const valueWithoutCommas = value.replace(/,/g, "");
      console.log(valueWithoutCommas);
    }
  });
  console.log(filteredValues);
  const handleAddEmail = () => {
    let data1 = finalState1 || [];
    data1[Object.keys(data1).length] = onChangeState1["prolifics_participants"];
    setFinalState1(data1);

    setAddList1([...addList1, { prolifics_participants: "" }]);
  };

  useEffect(() => {}, []);

  useEffect(() => {}, [selectedId]);

  useEffect(() => {}, [addList1]);
  const [prolificsparticipantdata, setProlificsparticipantdata] = useState([]);

  const [displayTextEmails, setDisplayTextEmails] = useState([]);
  console.log(formEditData?.prolificsParticipants);
  //-------post data
  const loggedUserId = localStorage.getItem("resId");
  var participantsArray = formEditData?.prolificsParticipants || [];
  var emailsArray = Array.isArray(displayTextEmails) ? displayTextEmails : [];
  // var combinedString = [participantsArray, ...emailsArray].join(",");
  // var combinedString;

  var combinedString = [participantsArray, ...emailsArray];
  // var combinedString = [participantsArray, ...emailsArray];

  if (combinedString.length > 1) {
    combinedString = [].concat.apply([], combinedString).join(", ");
  }

  ////for  payload

  var participantsArray1 = editedData?.prolifics_participants || [];
  var emailsArray = Array.isArray(displayTextEmails) ? displayTextEmails : [];
  var combinedString1 = [participantsArray1, ...emailsArray].join(",");

  var prolificsparticipantdata1 = prolificsparticipantdata;
  var id1 = prolificsparticipantdata1.prolifics_participants?.id;

  var filteredArray = valueID.filter((num) => num !== 0 && num !== "");
  var combinedIds = filteredArray.join(",");
  console.log(combinedIds);

  var prolificsparticipantdata1 = prolificsparticipantdata;
  var ProlificPartID1 = prolificsparticipantdata1.prolifics_participants?.id;
  var valueID1 = valueID;
  var joinedValues = valueID1.join(",");

  const handleSaveClick = () => {
    let valid = GlobalValidation(ref);
    if (valid == true) {
      setValidationMessage(true);
    }
    if (valid) {
      return;
    }
    if (selectedFile !== 0) {
      axios
        .postForm(
          baseUrl +
            `/customersms/Qbr/SaveAndUpload?loggedUserId=${loggedUserId}&fileRevision=1.0`,

          {
            file: selectedFile,
            data: JSON.stringify({
              customer_id: customerId,
              qbr_dt: formEditData.qbr_dt,
              lead_presenter: formEditData.leadPresenterID,
              prolifics_participants: joinedValues,
              customer_participants: formEditData.customer_participants,
              presentation_dt: formEditData.presentation_dt,
              doc_id: formEditData.doc_id,
              meeting_notes: formEditData.meeting_notes,
            }),
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((error) => {
          getData();
          setid();
          setButtonPopups(false);
          setAddmsg(true);
          setTimeout(() => {
            setAddmsg(false);
          }, 3000);
          setKey((prevKey) => prevKey + 1);
        });
    } else {
      setValidationMessage(true);
    }
  };
  //----------put data

  const handleEditClick = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMessage(true);
      return;
    }

    const qbrDateformat = moment(formEditData.qbr_dt).format("yyyy-MM-DD");
    const presentationdtaeformat = moment(formEditData.presentation_dt).format(
      "yyyy-MM-DD"
    );

    axios
      .postForm(
        baseUrl +
          `/customersms/Qbr/SaveAndUpload?loggedUserId=${loggedUserId}&fileRevision=1.0`,

        {
          file: selectedFile.length < 0 ? "" : selectedFile,
          data: JSON.stringify({
            id: formEditData.id,
            customer_id: customerId.toString(),
            qbr_dt:
              qbrDateformat == "" ||
              qbrDateformat == null ||
              qbrDateformat == undefined
                ? formEditData.qbr_dt
                : qbrDateformat,
            lead_presenter:
              formEditData.leadPresenterID == "" ||
              formEditData.leadPresenterID == null
                ? editedData.lead_presenter
                : formEditData.leadPresenterID,
            prolifics_participants: combinedIds === "[]" ? "" : combinedIds,
            customer_participants:
              formEditData.customerParticipantsID == undefined ||
              formEditData.customerParticipantsID == null
                ? editedData.customer_participants
                : formEditData.customerParticipantsID,
            presentation_dt:
              presentationdtaeformat == "" ||
              presentationdtaeformat == null ||
              presentationdtaeformat == undefined ||
              presentationdtaeformat == "Invalid date"
                ? formEditData.presentation_dt
                : presentationdtaeformat,
            doc_id: editedData.doc_id,
            meeting_notes:
              formEditData.meeting_notes == "" ||
              formEditData.meeting_notes == null
                ? editedData.meetingNotes
                : formEditData.meeting_notes,
          }),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((error) => {
        getData();
        setid();
        setButtonPopups(false);
        setEditAddmsg(true);
        setTimeout(() => {
          setEditAddmsg(false);
        }, 3000);
      });
  };
  const handleClear1 = () => {
    setFormEditData((prevProps) => ({ ...prevProps, leadPresenterID: "" }));
  };

  const handleClear2 = () => {
    setFormEditData((prev) => ({ ...prev, customerParticipantsID: "" }));
  };
  return (
    <div>
      {/* <Draggable> */}
      <CModal
        size="xs"
        backdrop={"static"}
        alignment="center"
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
        <CModalBody className="mx-3">
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
              <label className="col-4" htmlFor="Date">
                QBR Date<span className="error-text">&nbsp;&nbsp;*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6 textfield">
                <div
                  className="datepicker"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  {type == "add" ? (
                    <DatePicker
                      name="qbr_dt"
                      selected={QBRdate}
                      id="qbr_dt"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className="err cancel"
                      dateFormat="dd-MMM-yyyy"
                      onChange={(e) => {
                        setFormEditData((prev) => ({
                          ...prev,
                          ["qbr_dt"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        setQBRDate(e);
                      }}
                      onKeyDown={(e) => {}}
                      autoComplete="false"
                    />
                  ) : (
                    <DatePicker
                      name="qbr_dt"
                      selected={predate}
                      id="qbr_dt"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      className="err cancel"
                      value={formEditData?.qbr_dt}
                      dateFormat="dd-MMM-yyyy"
                      onChange={(e) => {
                        const formattedDate = moment(e).format("DD-MMM-yyyy");
                        setFormEditData((prev) => ({
                          ...prev,
                          qbr_dt: formattedDate,
                        }));

                        // setpreDate(e);
                      }}
                      onKeyDown={(e) => {}}
                      autoComplete="false"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group row mb-2">
              <label className="col-4">
                Lead Presenter
                <span className="error-text">&nbsp;&nbsp;*</span>
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
                        onClear={handleClear1}
                        className="AutoComplete"
                        onSelect={(e) => {
                          setFormEditData((prevProps) => ({
                            ...prevProps,
                            leadPresenterID: e.id,
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
                        onClear={handleClear1}
                        className="AutoComplete"
                        onSelect={(e) => {
                          setFormEditData((prevProps) => ({
                            ...prevProps,
                            leadPresenterID: e.id,
                          }));
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
              <label className="col-4" htmlFor="">
                Prolifics Participants<span className="error-text"></span>
              </label>
              <span className="col-1 p-0">:</span>

              {type == "add" ? (
                <>
                  <div className="col-6">
                    <div className="autocomplete">
                      <input
                        type="text"
                        placeholder="Enter Resource Name"
                        autoComplete="off"
                        required
                        disabled
                        value={filteredValues}
                      />
                    </div>
                  </div>
                  <div className="col-1 p-0">
                    <button className="btn">
                      {" "}
                      <MdCreate
                        onClick={() => {
                          clickButtonHandlerPopUp();
                        }}
                        title="Edit"
                      />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-6">
                    <div className="autocomplete">
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="Enter Resource Name"
                        required
                        disabled
                        value={filteredValues}
                      />
                    </div>
                  </div>
                  <div className="col-1 p-0">
                    <button className="btn">
                      <MdCreate
                        onClick={() => {
                          clickButtonHandlerPopUp();
                        }}
                        title="Edit"
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group row mb-2">
              <label className="col-4" htmlFor="customer_participants">
                Customer Participant<span className="error-text"></span>
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
                        // onClear={handleClear2}
                        className="AutoComplete"
                        onSelect={(e) => {
                          setFormEditData((prevProps) => ({
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
                        onClear={handleClear2}
                        className="AutoComplete"
                        onSelect={(e) => {
                          setFormEditData((prevProps) => ({
                            ...prevProps,
                            customerParticipantsID: e.id,
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
              <label className="col-4" htmlFor="Date">
                Presentation Date<span className="error-text"></span>
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6 textfield">
                {type == "add" ? (
                  <DatePicker
                    name="presentation_dt"
                    selected={postpresentationdate}
                    id="presentation_dt"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="err cancel"
                    dateFormat="dd-MMM-yyyy"
                    onChange={(e) => {
                      setFormEditData((prev) => ({
                        ...prev,
                        ["presentation_dt"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setPostpresentationdate(e);
                    }}
                    onKeyDown={(e) => {}}
                    autoComplete="false"
                  />
                ) : (
                  <DatePicker
                    name="presentation_dt"
                    selected={presentationdate}
                    id="presentation_dt"
                    value={formEditData?.presentation_dt}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className="err cancel"
                    dateFormat="dd-MMM-yyyy"
                    onChange={(e) => {
                      const formattedDate = moment(e).format("DD-MMM-yyyy");

                      setFormEditData((prev) => ({
                        ...prev,
                        presentation_dt: formattedDate,
                      }));

                      // setpreDate(e);
                    }}
                    onKeyDown={(e) => {}}
                    autoComplete="false"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group row mb-2" id="UploadDocument">
              <label className="col-4" htmlFor="updateDocument">
                Upload Documents&nbsp;<span className="error-text">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                {type == "add" ? (
                  <input
                    key={key}
                    type="file"
                    name="file"
                    className="fileUpload unique1 form-control"
                    id="file"
                    onChange={onFileChangeHandler}
                  />
                ) : (
                  <input
                    key={key}
                    type="file"
                    name="doc_id"
                    className="fileUpload unique1 form-control"
                    id="doc_id"
                    onChange={onFileChangeHandler}
                  />
                )}
              </div>
              {/* {formEditData.doc_id == "" ? (
                ""
              ) : (
                <div className="col-1 p-0">
                  <DownloadForOfflineRoundedIcon
                    style={{ cursor: "pointer", color: "#86b558" }}
                    onClick={() => {
                      downloadEmployeeData();
                    }}
                  />
                </div>
              )} */}
              <div className="col-12">
                <div className="col-5"> </div>
                <div className="col-7" style={{ float: "right" }}>
                  <span style={{ color: "red", fontSize: "12px" }}>
                    Supported types jpg, jpeg, xlsx, docx, txt, pdf
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-group row ">
              <label className="col-4 mb-4" htmlFor="">
                Meeting Notes & Next Steps
              </label>
              <span className="col-1 p-0 mb-6">:</span>
              <div className="col-6">
                {type == "add" ? (
                  <textarea
                    type="meeting_notes"
                    name="meeting_notes"
                    id="meeting_notes"
                    rows={3}
                    onChange={(e) => handleChange(e)}
                  />
                ) : (
                  <textarea
                    type="meeting_notes"
                    name="meeting_notes"
                    id="meeting_notes"
                    rows={3}
                    defaultValue={editedData?.meeting_notes}
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
              <button
                className="btn btn-primary "
                title="Save"
                onClick={handleSaveClick}
              >
                <FaSave />
                Save
              </button>
            ) : (
              <button
                className="btn btn-primary "
                title="Save"
                onClick={handleEditClick}
              >
                <FaSave />
                Save
              </button>
            )}
          </div>
        </CModalBody>
      </CModal>
      {/* </Draggable> */}
      {clickButtonPopUp ? (
        <Qbrslpopup
          setprolificspartId={setprolificspartId}
          prolificspartId={prolificspartId}
          type={type}
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
          getData={getData}
          setDisplayTextEmails={setDisplayTextEmails}
          displayTextEmails={displayTextEmails}
          hideSelectbutton={hideSelectbutton}
          sethideSelectbutton={sethideSelectbutton}
          setProlificsparticipantdata={setProlificsparticipantdata}
          prolificsparticipantdata={prolificsparticipantdata}
          setValue={setValue}
          setValueID={setValueID}
          valueID={valueID}
          value={value}
        />
      ) : (
        ""
      )}
    </div>
  );
}
