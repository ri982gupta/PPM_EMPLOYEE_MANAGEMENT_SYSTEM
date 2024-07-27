import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import Draggable from "react-draggable";
import { environment } from "../../environments/environment";

function SavedSearchPopup(props) {
  const { deletePopup, setDeletePopup, editId, deleteid, deletedata } = props;

  return (
    <div>
      <Draggable>
        <CModal
          visible={deletePopup}
          size="sm"
          className=" ui-dialog"
          onClose={() => setDeletePopup(false)}
          style={{ width: "max-content" }}
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
                  deletedata();
                }}
              >
                {" "}
                Delete{" "}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={setDeletePopup(false)}
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
export default SavedSearchPopup;
