import React from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import Draggable from "react-draggable";
import axios from "axios";
import { environment } from "../../environments/environment";

function TaskPlanResDeletePopUp(props) {
  const {
    deletePopUp,
    setDeletePopUp,
    roleId,
    setDeletedSuccess,
    setDeleteFailed,
  } = props;
  const baseUrl = environment.baseUrl;

  const deleteRecord = () => {
    console.log("hello...");

    axios({
      method: "delete",
      // url: `http://localhost:8092/ProjectMS/taskPlan/deleteTaskResource?id=${roleId}`,
      url: `${baseUrl}/ProjectMS/taskPlan/deleteTaskResource?id=${roleId}`,
    })
      .then((response) => {
        console.log("Delete Clicked...");
        if (response.data == false) {
          setDeletePopUp(false);
          setDeleteFailed(true);
          setTimeout(() => {
            setDeleteFailed(false);
          }, 3000);
          return;
        }
        setDeletePopUp(false);
        setDeletedSuccess(true);
        setTimeout(() => {
          setDeletedSuccess(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error deleting record:", error);
        setDeletePopUp(false);
        setDeletedSuccess(false);
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
            <span> Are you sure you want to delete resource ?</span>
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
export default TaskPlanResDeletePopUp;
