import React from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import Draggable from "react-draggable";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { useEffect, useRef, useState } from "react";
import { BiSave, BiSearch, BiSelection } from "react-icons/bi";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

export default function Qbrslpopup(props) {
  const {
    clickButtonPopUp,
    setClickButtonPopUp,
    setFormEditData,
    formEditData,
    handleAddEmail,
    details,
    setDetails,
    finalState1,
    setDisplayTextEmails,
    issueDetails,
    editedData,
    displayTextEmails,
  } = props;
  const [displayState1, setDisplayState1] = useState(null);
  const [validationmessage, setValidationMessage] = useState(false);
  const ref = useRef([]);
  const addHandler = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      return;
    }
    handleAddEmail();
    DisplayList();
    document.getElementById("prolificsParticipants").value = "";
    setDetails(details.prolificsParticipants);
  };

  const handleSubmit = () => {
    setClickButtonPopUp(false);
  };

  useEffect(() => {
    DisplayList();
  }, [finalState1]);

  const checkedData = (e, data) => {
    let initialData = displayTextEmails;
    if (e.target.checked) {
      initialData.push(data);
    } else {
      let index = initialData.indexOf(data);
      initialData.splice(index, 1);
    }

    setDisplayTextEmails(initialData);
  };

  const DisplayList = () => {
    setDisplayState1(() => {
      return Object.keys(finalState1).map((d, i) => {
        return (
          <div key={i}>
            <input
              type="checkbox"
              onClick={(e) => {
                checkedData(e, finalState1[d]);
              }}
            />{" "}
            {finalState1[d]}{" "}
            <AiFillDelete
              onClick={() => {
                delete finalState1[d];
                DisplayList();
              }}
            />
          </div>
        );
      });
    });
  };
  return (
    <div>
      <Draggable>
        <CModal
          size="sm"
          visible={clickButtonPopUp}
          onClose={() => {
            setClickButtonPopUp(false);
          }}
        >
          <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
            <CModalTitle>
              <span className="ft16"> prolifics Participants</span>
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
            <div className="group-content row">
              <div className=" col-md-12 row mb-2">
                <div className="col-md-8">
                  <div
                    className="textfield"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <div className="autoComplete-container">
                      <ReactSearchAutocomplete
                        items={issueDetails}
                        type="Text"
                        name="prolifics_participants"
                        id="prolifics_participants"
                        placeholder="Enter Resource Name"
                        issueDetails={issueDetails}
                        className="AutoComplete"
                        onSelect={(e) => {
                          setFormEditData((prevProps) => ({
                            ...prevProps,
                            prolificsParticipants: e.id,
                          }));
                        }}
                        inputSearchString={editedData?.prolificsParticipants}
                        showIcon={false}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary col-4"
                  onClick={() => {
                    addHandler();
                  }}
                >
                  <i className="fa fa-plus" aria-hidden="true"></i>
                  <MdOutlinePlaylistAdd /> Add
                </button>
              </div>
              <div className="row">{displayState1}</div>
              <div className="col-md-1"></div>
              <button
                className=" col-md-4 btn btn-primary"
                onClick={handleSubmit}
              >
                <BiSave /> Select
              </button>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
}
