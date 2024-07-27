
import { useRef, useState } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CButton } from "@coreui/react";
import { RiSave3Line } from "react-icons/ri";
import { FaUndo } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import SalesReviewsCustomer from "./SalesReviewsCustomer";


export default function SelectSESalesDialogBox({
  visible,
  setVisible,
  setSelectedItems,
  selectedItems,
  value,
  buttonPopup,
  setButtonPopup,
  buttonPopup1,
  setButtonPopup1,
}) {
  const CustomerRef = useRef(null);

  function CustomerPopUp(props) {
    const { setVisible, buttonPopup, setButtonPopup } = props;
    return (
      <div>
        <CModal
          visible={buttonPopup}
          alignment="center"
          backdrop="static"
          size="sm"
        >
          <CModalHeader closeButton={false}>
            <div className="row">
              <CModalTitle>
                <div>Confirmation</div>
              </CModalTitle>
            </div>
            <div>
              {" "}
              <button
                className="btn float end"
                type="popup"
                onClick={() => setButtonPopup(() => false)}
              >
                <ImCross />
              </button>
            </div>
          </CModalHeader>
          <CModalBody>
            <h6>Save changes ?</h6>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button
                type="delete"
                className="btn btn-primary"
                onClick={() => {
                  setVisible(false);
                  setButtonPopup(() => true);
                }}
              >
                Yes
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setVisible(false);
                  setButtonPopup(() => false);
                }}
              >
                No
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }

  return (
    <>
      <div>
        <CModal
          alignment="center"
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
          size="xl"
        >
          <CModalHeader closeButton={false}>
            <div className="row">
              <CModalTitle>
                {" "}
                {value == "SalesReviews" ? (
                  <div style={{ fontSize: "15px" }}>Select Customers</div>
                ) : (
                  <div>Select Customers / Prospects</div>
                )}
              </CModalTitle>{" "}
            </div>
            {value == "SalesReviews" ? (
              <div>
                {" "}
                <button
                  className="btn float end"
                  type="popup"
                  onClick={() => setVisible(false)}
                >
                  <ImCross />
                </button>
              </div>
            ) : (
              <div>
                {" "}
                <button
                  className="btn float end"
                  type="popup"
                  onClick={() => {
                    setButtonPopup((prev) => !prev);
                  }}
                >
                  <ImCross />
                </button>
              </div>
            )}
          </CModalHeader>
          <CModalBody>
            <SalesReviewsCustomer
              ref={CustomerRef}
              setSelectedItems={setSelectedItems}
              selectedItems={selectedItems}
            />
          </CModalBody>

          <CModalFooter>
            <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <CButton
                color="primary"
                title="Save Changes"
                onClick={() => {
                  CustomerRef.current.setGlobalState();
                  setVisible(false);
                  setButtonPopup1(() => true);
                }}
              >
                <RiSave3Line />
                Save
              </CButton>
              <CButton
                color="primary"
                title="Undo Changes"
                onClick={() => {
                  CustomerRef.current.resetTOlocalState();
                }}
              >
                <FaUndo size="1.0em" title="Undo Chages" />
                Undo
              </CButton>
            </div>
          </CModalFooter>
        </CModal>
      </div>

      {buttonPopup && value !== "SalesReviews" ? (
        <CustomerPopUp
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          setVisible={setVisible}
        />
      ) : (
        ""
      )}
    </>
  );
}
