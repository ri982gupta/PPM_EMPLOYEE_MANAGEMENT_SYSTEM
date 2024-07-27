import React from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import "./ProjectScopesChanges.scss";
import Draggable from "react-draggable";
import { FaSave } from "react-icons/fa";

function ProjectScopeChangesDeletePopUP(props) {
  const { deletePopup, setDeletePopup } = props;

  return (
    <div>
      <Draggable>
        <CModal
          visible={deletePopup}
          size="xs"
          className="ui-dialog"
          onClose={() => setDeletePopup(false)}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Delete Scope</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h6>Are you sure to delete Scope Change ?</h6>
            <div className="btn-container center my-2">
              <button
                type="delete"
                className="btn btn-primary"
                onClick={() => {
                  deleteIssue();
                }}
              >
                <FaSave /> Delete
              </button>
              &nbsp; &nbsp;
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                Cancel
              </button>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
}
export default ProjectScopeChangesDeletePopUP;
