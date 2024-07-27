import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import React from "react";
import Draggable from "react-draggable";

function CustomDashboardDeletePopUp(props) {
  const {
    deletePopup,
    editId,
    deleteid,
    deleteMyDashboardData,
    setDeletePopup,
  } = props;
  return (
    <div>
      <Draggable>
        <CModal
          visible={deletePopup}
          onClose={() => setDeletePopup(false)}
          size="default"
          className=" ui-dialog"
        >
          <CModalHeader className="hgt22">
            <CModalTitle>
              <span className="ft16">Delete Search</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h6>Are you sure you want to delete Search ?</h6>
            <div className="btn-container center my-2">
              <button
                type="delete"
                className="btn btn-primary"
                onClick={() => {
                  deleteMyDashboardData();
                }}
              >
                {" "}
                Delete{" "}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeletePopup(false)}
              >
                {" "}
                Cancel{" "}
              </button>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
}

export default CustomDashboardDeletePopUp;
