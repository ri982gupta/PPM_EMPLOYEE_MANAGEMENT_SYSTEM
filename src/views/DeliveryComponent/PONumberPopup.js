import { MdOutlinePlaylistAdd } from "react-icons/md";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { useEffect, useRef, useState } from "react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";

function PONumberPopup(props) {
  const {
    buttonPopup,
    setButtonPopup,
    handleChange2,
    handleAdd,
    finalState,
    details,
  } = props;

  const [displayState, setDisplayState] = useState(null);
  const [validationmessage, setValidationMessage] = useState(false);

  const addHandler = async () => {
    let valid = GlobalValidation(ref);

    if (valid) {
      setValidationMessage(true);
      return;
    }

    await handleAdd();
    DisplayList();
    document.getElementById("poNumber").value = "";
  };

  useEffect(() => {
    DisplayList();
  }, [finalState]);

  const DisplayList = () => {
    setDisplayState(() => {
      return Object.keys(finalState).map((d, i) => {
        return (
          <div key={i}>
            <AiFillDelete
              cursor={"Pointer"}
              onClick={() => {
                delete finalState[d];
                DisplayList();
              }}
            />
            {finalState[d]}
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
        visible={buttonPopup}
        onClose={() => {
          setButtonPopup(false);
        }}
      >
        <CModalHeader className="" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            <span className=""> PO Numbers</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validationmessage === true ? (
            <div className="statusMsg error">
              {" "}
              <AiFillWarning /> Please enter PO Number
            </div>
          ) : (
            ""
          )}

          <div className="group-content row">
            <div className=" col-md-12 row mb-2">
              <div
                className="textfield col-md-8"
                ref={(ele) => {
                  ref.current[0] = ele;
                }}
              >
                <input
                  className="col-md-12"
                  type="text"
                  id="poNumber"
                  name="poNumber"
                  placeholder="Enter PO"
                  onChange={(e) => {
                    handleChange2(e);
                  }}
                  onKeyDown={(event) => {
                    if (event.code == "Space" && !details.poNumber)
                      event.preventDefault();
                  }}
                  required
                />
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
            <div className="row">{displayState}</div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}

export default PONumberPopup;
