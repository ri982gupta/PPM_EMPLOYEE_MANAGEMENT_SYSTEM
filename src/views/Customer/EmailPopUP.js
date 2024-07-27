import React, { useEffect, useRef, useState } from "react";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { BiSave } from "react-icons/bi";

function isValidEmail(email) {
  // Basic email format validation using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function EmailPopUp(props) {
  const {
    clickButtonPopUp,
    setClickButtonPopUp,
    handleChange1,
    handleAddEmail,
    setDetails,
    addList,
    setAddList,
    finalState1,
    setDisplayTextEmails,
    displayTextEmails,
    setFinalState1,
  } = props;

  const [displayState1, setDisplayState1] = useState(null);
  const [validationmessage, setValidationMessage] = useState("");

  const [mailObjState, setMailObjState] = useState({});

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

    setMailObjState((prev) => ({ ...prev, [email]: email }));
    setFinalState1((prev) => ({ ...prev, [email]: email }));

    handleAddEmail();
    DisplayList();
    emailInput.value = "";
  };

  const handleSubmit = () => {
    setClickButtonPopUp(false);
  };

  useEffect(() => {
    DisplayList();
  }, [finalState1]);

  // const checkedData = (e, data) => {
  //   let initialData = displayTextEmails;
  //   if (e.target.checked) {
  //     initialData.push(data);
  //   } else {
  //     let index = initialData.indexOf(data);
  //     initialData.splice(index, 1);
  //   }

  //   setDisplayTextEmails(initialData);
  // };

  const DisplayList = () => {
    if (finalState1 === undefined || finalState1 === null) {
      return null;
    }

    setDisplayState1(() => {
      return Object.keys(finalState1).map((d, i) => {
        return (
          <div key={i}>
            {/* <input
              // type="checkbox"
              onClick={(e) => {
                checkedData(e, finalState1[d]);
              }}
            /> */}
            {finalState1[d]}
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

  const ref = useRef([]);
  return (
    <div>
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
            <span className="ft16"> Client Email </span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validationmessage && (
            <div className="statusMsg error">
              <AiFillWarning /> {validationmessage}
            </div>
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
                <MdOutlinePlaylistAdd /> Add
              </button>
            </div>
            {/* {Object.keys(mailObjState).map((d) => d)} */}
            <div className="row">{displayState1}</div>
            {/* <div className="col-md-1"></div> */}
            {/* <button
              className=" col-md-4 btn btn-primary"
              onClick={handleSubmit}
            >
              <BiSave /> Select
            </button> */}
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}

export default EmailPopUp;
