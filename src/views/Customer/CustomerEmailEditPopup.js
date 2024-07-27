import React, { useState, useRef, useEffect } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { ImCheckmark, ImCross } from "react-icons/im";
import { FaPlus, FaSave } from "react-icons/fa";
import { BiCheck } from "react-icons/bi";
import Draggable from "react-draggable";

function isValidEmail(email) {
  // Basic email format validation using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const CustomerEmailEditPopup = (props) => {
  const {
    setClickButtonPopUp,
    clickButtonPopUp,
    setFinalState1,
    handleAddEmail,
    finalState1,
    handleChange1,
  } = props;

  const [displayState1, setDisplayState1] = useState(null);
  const [validationmessage, setValidationMessage] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const ref = useRef([]);
  const [emailDeletedMessage, setEmailDeletedMessage] = useState(false);
  useEffect(() => {
    DisplayList();
  }, [finalState1]);

  const DisplayList = () => {
    if (finalState1 === undefined || finalState1 === null) {
      return null;
    }

    setDisplayState1(() => {
      return Object.keys(finalState1).map((d, i) => {
        const emailArray = finalState1[d]
          .split(",")
          .filter((email) => email.trim() !== "");
        return (
          <div key={i}>
            {emailArray.map((email, index) => (
              <div key={index}>
                {email.trim()}
                {email.trim() === "" ? (
                  ""
                ) : (
                  <AiFillDelete
                    style={{ cursor: "pointer" }}
                    onClick={() => showDeleteConfirmationPopup(d, email)}
                  />
                )}
              </div>
            ))}
          </div>
        );
      });
    });
  };

  const addHandler = () => {
    const emailInput = ref.current[0].querySelector("input");
    const email = emailInput.value.trim();

    if (!email) {
      setValidationMessage("Please Provide Email");
      setTimeout(() => {
        setValidationMessage("");
      }, 3000);
      return;
    }

    if (!isValidEmail(email)) {
      setValidationMessage("Please Provide Proper Email");
      setTimeout(() => {
        setValidationMessage("");
      }, 3000);
      return;
    }

    if (finalState1[email]) {
      setValidationMessage("Email already exists");
      setTimeout(() => {
        setValidationMessage("");
      }, 3000);
      return;
    }

    setFinalState1((prev) => ({ ...prev, [email]: email }));
    handleAddEmail();
    DisplayList();
    emailInput.value = "";
  };

  const deleteHandler = (key, email) => {
    setFinalState1((prev) => {
      const newState = { ...prev };
      const emailArray = newState[key]
        .split(",")
        .filter((e) => e.trim() !== email.trim());
      newState[key] = emailArray.join(",");
      return newState;
    });
    setEmailDeletedMessage(true);
    setTimeout(() => setEmailDeletedMessage(false), 3000);
    DisplayList();
    setDeleteConfirmation(null);
  };

  const showDeleteConfirmationPopup = (key, email) => {
    setDeleteConfirmation({ key, email });
  };

  return (
    <div>
      <Draggable>
        <CModal
          alignment="center"
          backdrop="static"
          size="sm"
          visible={clickButtonPopUp}
          onClose={() => {
            setClickButtonPopUp(false);
          }}
        >
          <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
            <CModalTitle>
              <span className="ft16">Client Email</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {emailDeletedMessage ? (
              <div className="statusMsg success">
                <BiCheck />
                {" Email Deleted Successfully"}
              </div>
            ) : (
              ""
            )}

            {validationmessage && (
              <div className="statusMsg error">
                <AiFillWarning /> {validationmessage}
              </div>
            )}
            <div className="group-content row">
              <div className="col-md-12 row mb-2 align-items-center">
                <div className="col-md-8">
                  <div
                    className="textfield"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <input
                      className="col-md-12"
                      type="email"
                      id="customerEmails"
                      name="customerEmails"
                      placeholder="Enter Email"
                      onChange={(e) => {
                        handleChange1(e);
                      }}
                    ></input>
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
                  <FaPlus /> Add
                </button>
              </div>

              <div className="row">{displayState1}</div>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>

      {deleteConfirmation && (
        <Draggable>
          <CModal
            alignment="center"
            backdrop="static"
            size="sm"
            visible={true}
            onClose={() => setDeleteConfirmation(null)}
          >
            <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
              <CModalTitle>
                <span className="ft16">Delete Customer Email</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div>
                <strong> Are you sure you want to delete email ?</strong>
              </div>
              <div className="form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-1">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    deleteHandler(
                      deleteConfirmation.key,
                      deleteConfirmation.email
                    )
                  }
                >
                  <ImCheckmark />
                  Yes
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteConfirmation(null)}
                >
                  <ImCross />
                  No
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      )}
    </div>
  );
};

export default CustomerEmailEditPopup;
