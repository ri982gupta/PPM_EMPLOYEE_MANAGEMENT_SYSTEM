import React from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import Draggable from "react-draggable";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { useEffect, useRef, useState } from "react";
import { BiSave, BiSearch, BiSelection } from "react-icons/bi";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import QbrUpdate from "./QbrUpdate";

export default function Qbrslpopup(props) {
  const {
    clickButtonPopUp,
    setValueID,
    valueID,
    sethideSelectbutton,
    hideSelectbutton,
    setprolificspartId,
    prolificspartId,
    setClickButtonPopUp,
    setFormEditData,
    formEditData,
    handleAddEmail,
    details,
    handleChange,
    type,
    onChangeState1,
    finalState1,
    setDisplayTextEmails,
    setProlificsparticipantdata,
    prolificsparticipantdata,
    issueDetails,
    editedData,
    setValue,
    value,
  } = props;
  const [message, setMessage] = useState(false);
  console.log(value);
  console.log(valueID);
  console.log(editedData?.prolificsParticipants);
  const [displayState1, setDisplayState1] = useState(
    editedData?.prolificsParticipants
  );
  console.log(displayState1);
  const [validationmessage, setValidationMessage] = useState(false);
  const ref = useRef([]);
  const [storeprolificparticipantid, setStoreprolificparticipantid] = useState(
    []
  );

  const addHandler = () => {
    const newValue = prolificsparticipantdata.prolifics_participants
      ? prolificsparticipantdata.prolifics_participants.name
      : undefined;

    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMessage(true);
      return;
    }

    setValidationMessage(false);
    sethideSelectbutton(false);
    handleAddEmail();

    const newValueID = prolificsparticipantdata.prolifics_participants
      ? prolificsparticipantdata.prolifics_participants.id
      : undefined;
    console.log(newValueID);

    // Check if the ID already exists in the array
    if (newValueID && valueID.includes(newValueID)) {
      // ID already exists, show validation message
      setMessage(true);
      return;
    } else {
      setMessage(false);
    }

    // Add the new value to the array
    setValue((prevValue) => [...prevValue, newValue]);
    setValueID((prevValue) => [...prevValue, newValueID]);

    DisplayList();
  };

  useEffect(() => {}, [value]);
  useEffect(() => {
    DisplayList();
  }, [value]);

  useEffect(() => {
    DisplayList();
  }, [finalState1]);

  const DisplayList = () => {
    if (value === undefined || value === null) {
      return null; // or handle the case where value is undefined/null
    }
    const deleteItem = (index) => {
      // Assuming valueID is the state variable and setValueID is the corresponding state updater function
      setValueID(
        (prevValueID) => {
          const newValueID = [...prevValueID];
          newValueID.splice(index, 1);
          return newValueID;
        },
        () => {
          // This callback is executed after the state has been updated
          console.log(valueID);
        }
      );
    };

    setDisplayState1(() => {
      return Object.keys(value).map((d, i) => {
        console.log(value[d]);
        console.log(i);
        return (
          <div key={i}>
            {value[d]}
            {value[d] !== undefined && value[d] !== "" ? (
              <AiFillDelete
                onClick={() => {
                  delete value[d];
                  deleteItem(i);
                  DisplayList();
                }}
              />
            ) : (
              ""
            )}
          </div>
        );
      });
    });
  };
  const [isChecked, setIsChecked] = useState(
    !!editedData?.prolificsParticipants
  );
  const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
  };
  const handleClear = () => {
    setFormEditData((prevProps) => ({
      ...prevProps,
      prolifics_participants: null,
    }));
  };

  return (
    <div>
      {/* <Draggable> */}
      <CModal
        size="sm"
        backdrop={"static"}
        alignment="center"
        visible={clickButtonPopUp}
        onClose={() => {
          setClickButtonPopUp(false);
        }}
      >
        <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            <span className="ft16">Prolifics Participants</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validationmessage == true ? (
            <div className="statusMsg error">
              {" "}
              <AiFillWarning /> Please Provide Resource
            </div>
          ) : (
            ""
          )}

          {message == true ? (
            <div className="statusMsg error">
              {" "}
              <AiFillWarning /> Participant already exist
            </div>
          ) : (
            ""
          )}
          <div className="group-content row">
            <div className=" col-md-12 row mb-2">
              <div className="col-md-8">
                <div
                  className="autocomplete"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  {type == "add" ? (
                    <div className="autoComplete-container">
                      <ReactSearchAutocomplete
                        items={issueDetails}
                        type="Text"
                        name="prolifics_participants"
                        id="prolifics_participants"
                        placeholder="Enter Resource Name"
                        issueDetails={issueDetails}
                        className="AutoComplete"
                        onClear={handleClear}
                        onSelect={(e) => {
                          setProlificsparticipantdata((prevProps) => ({
                            ...prevProps,
                            prolifics_participants: e,
                          }));
                          setFormEditData((prevProps) => ({
                            ...prevProps,
                            prolifics_participants: e.id,
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
                        name="prolifics_participants"
                        id="prolifics_participants"
                        placeholder="Enter Resource Name"
                        issueDetails={issueDetails}
                        className="AutoComplete"
                        onClear={handleClear}
                        onSelect={(e) => {
                          setProlificsparticipantdata((prevProps) => ({
                            ...prevProps,
                            prolifics_participants: e,
                          }));
                          setFormEditData((prevProps) => ({
                            ...prevProps,
                            prolifics_participants: e.id,
                          }));
                        }}
                        // inputSearchString={editedData?.prolificsParticipants}
                        showIcon={false}
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary col-4"
                onClick={() => {
                  addHandler();
                }}
                title="Add"
              >
                <i className="fa fa-plus" aria-hidden="true"></i>
                <MdOutlinePlaylistAdd /> Add
              </button>
            </div>
            {type == "edit" ? (
              <div className="row">{displayState1}</div>
            ) : (
              <div className="row">{displayState1}</div>
            )}
            <div className="col-md-1"></div>
          </div>
        </CModalBody>
      </CModal>
      <QbrUpdate
        prolificspartId={prolificspartId}
        storeprolificparticipantid={storeprolificparticipantid}
      />
    </div>
  );
}
