import { CModal, CModalBody, CModalHeader } from "@coreui/react";
import React from "react";
import Draggable from "react-draggable";

function ShiftAllowanceRejectPopup(props) {
  const {
    handleReject,
    rejectbuttonPopup,
    setRejectButtonPopup,

    setRejectMsg,
    selectedData,
  } = props;
  return (
    <div>
      <Draggable>
        <CModal
          size="Default"
          visible={rejectbuttonPopup}
          className="ui-dialog"
          onClose={() => {
            setRejectButtonPopup(false);
          }}
        >
          <CModalHeader style={{ cursor: "all-scroll" }}>
            <h6>Reject Resource Allownces</h6>
          </CModalHeader>
          <CModalBody>
            <span>Are you sure you want to reject allowances ?</span>
            <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
              <button
                type="delete"
                className="btn btn-primary"
                onClick={(e) => {
                  handleReject(selectedData);
                  // setRejectMsg(true);
                  setRejectMsg(true);

                  setTimeout(() => {
                    setRejectMsg(false);
                  }, 2000);
                }}
              >
                Yes
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setRejectButtonPopup(false);
                }}
              >
                No
              </button>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
}

export default ShiftAllowanceRejectPopup;
