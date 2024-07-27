import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import Draggable from "react-draggable";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { useEffect, useRef, useState } from "react";
import { BiSave, BiSearch, BiSelection } from "react-icons/bi";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { Details } from "@mui/icons-material";

function EmailPopUp(props) {
  const {
    clickButtonPopUp,
    setClickButtonPopUp,
    handleChange1,
    handleAddEmail,
    details,
    setDetails,
    addList,
    setAddList,
    finalState1,
    setDisplayTextEmails,
    displayTextEmails,
  } = props;

  const [displayState1, setDisplayState1] = useState(null);
  const [validationmessage, setValidationMessage] = useState(false);
  // console.log(validationmessage);

  const addHandler = () => {
    // console.log(ref);
    let valid = GlobalValidation(ref);
    // console.log(valid);

    if (valid) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      return;
    }
    handleAddEmail();
    DisplayList();
    document.getElementById("customerEmails").value = "";
    // setDetails(details.customerEmails);
    // setDetails(details.customerEmails["customerEmails"]);
  };

  const handleSubmit = () => {
    // console.log(displayTextEmails);au
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
      // initialData = initialData;
    }
    // console.log(initialData);

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
                // console.log("in line 48------");
                // console.log(e.target.checked);
                checkedData(e, finalState1[d]);
                // console.log(d);
              }}
            />{" "}
            {/* {console.log([d])} */}
            {finalState1[d]}{" "}
            <AiFillDelete
              onClick={() => {
                delete finalState1[d];
                DisplayList();
              }}
            />
            {/* </input> */}
          </div>
        );
      });
    });
  };
  const ref = useRef([]);
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
              <span className="ft16"> Client Email </span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {validationmessage == true ? (
              <div className="statusMsg error">
                {" "}
                <AiFillWarning /> Please Provide Email
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
                    <input
                      className="col-md-12"
                      type="email"
                      id="customerEmails"
                      name="customerEmails"
                      placeholder="Enter Email"
                      onChange={(e) => {
                        handleChange1(e);
                        // setDetails(details.customerEmails);
                      }}
                      // onChange={(e) => {
                      //   setDetails((prev) => {
                      //     return { ...prev, ["customerEmails"]: e.target.value };
                      //   });
                      // }}
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
      {/* <CusCreate value={value} /> */}
    </div>
  );
}

export default EmailPopUp;
