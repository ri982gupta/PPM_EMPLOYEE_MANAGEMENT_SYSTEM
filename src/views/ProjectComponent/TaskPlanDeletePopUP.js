import React from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import Draggable from "react-draggable";
import axios from "axios";
import { environment } from "../../environments/environment";

function TaskPlanDeletePopUp(props) {
  const {
    deletePopUp,
    setDeletePopUp,
    selectedTaskId,
    setDeletedSuccess,
    setDeletedFailed,
  } = props;
  const baseUrl = environment.baseUrl;

  const deleteRecord = () => {
    console.log("hello...");

    axios({
      method: "delete",
      url: `${baseUrl}/ProjectMS/taskPlan/deletePrjTask?taskId=${selectedTaskId}`,
      params: {
        taskId: selectedTaskId,
      },
    })
      .then((response) => {
        console.log("Delete Clicked...");
        setDeletePopUp(false);
        if (response.data == false) {
          setDeletedFailed(true);
          setTimeout(() => {
            setDeletedFailed(false);
          }, 3000);
          return;
        }
        setDeletedSuccess(true);
        setTimeout(() => {
          setDeletedSuccess(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error deleting record:", error);
      });
  };

  const handleDelete = () => {
    console.log("hi...");
    deleteRecord();
  };

  return (
    <div className="col-md-12">
      <Draggable>
        <CModal
          style={{ cursor: "all-scroll" }}
          alignment="center"
          backdrop="static"
          visible={deletePopUp}
          size="sm"
          className=" ui-dialog"
          onClose={() => setDeletePopUp(false)}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Delete Task</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <span> Are you sure you want to delete Task ?</span>
            <div className="btn-container center mb-1 mt-4">
              <button className="btn btn-secondary" onClick={handleDelete}>
                Delete
              </button>
              <button className="btn btn-secondary">Cancel</button>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
}
export default TaskPlanDeletePopUp;
