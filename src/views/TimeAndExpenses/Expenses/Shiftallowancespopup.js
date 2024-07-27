import { CModal, CModalBody, CModalHeader } from "@coreui/react";
import React from "react";
import Draggable from "react-draggable";

function ShiftAllowncesPopup(props) {
  const {
    handleApprove,
    buttonPopup,
    setButtonPopup,
    setSuccessMsg,
    selectedData,
  } = props;

  return (
    <div className="shiftAllowanceStatusPopup">
      <Draggable>
        <CModal
          size="sm"
          visible={buttonPopup}
          className="ui-dialog shiftAllowanceStatusPopup"
          onClose={() => {
            setButtonPopup(false);
          }}
        >
          <CModalHeader style={{ cursor: "all-scroll" }}>
            <h6>Approve Resource Allownces</h6>
          </CModalHeader>
          <CModalBody>
            <span>Are you sure you want to approve allowances ?</span>
            <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
              <button
                type="delete"
                className="btn btn-primary"
                onClick={(e) => {
                  handleApprove(selectedData);
                  setSuccessMsg(true);

                  setTimeout(() => {
                    setSuccessMsg(false);
                  }, 2000);
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setButtonPopup(false);
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
export default ShiftAllowncesPopup;
