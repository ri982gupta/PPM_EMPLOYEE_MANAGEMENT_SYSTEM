import React from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import Draggable from "react-draggable";
import { environment } from "../../environments/environment";
import moment from "moment";
import TaskPlanResourceTable from "./TaskPlanResourceTable";
import { useState } from "react";

function TaskPlanResourcePopUp(props) {
  const { resourcePopUp, setResourcePopUp, taskList, selectedRow, grp2Items } =
    props;
  const [assignedHrs, setAssignedHrs] = useState(0);
  const baseUrl = environment.baseUrl;
  const estimatedHrs = taskList[selectedRow - 1].estimatedHrs;

  /////////////////////////////////////////
  const difference = estimatedHrs - assignedHrs;
  console.log(difference.toLocaleString());
  /////////////////////////////////////////

  return (
    <div className="col-md-12">
      <CModal
        alignment="center"
        backdrop="static"
        visible={resourcePopUp}
        size="xl"
        className=" ui-dialog"
        onClose={() => setResourcePopUp(false)}
      >
        <CModalHeader className="">
          <CModalTitle>
            <span className="">Resource Allocation</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody style={{ cursor: "auto" }}>
          <div
            className="projGlance col-12 "
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div className="col-12 row">
              <div className="col-md-8 row mb-2">
                <div className="form-group">
                  <div className="row">
                    <label className="col-3  no-padding" title="Task Name">
                      Task Name
                    </label>
                    <span className="col-1 p0">:</span>
                    <span
                      className="col-6 "
                      title={taskList[selectedRow - 1].content}
                    >
                      {taskList[selectedRow - 1].content}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <div className="row">
                    <label
                      className="col-3  no-padding"
                      title="Task Start Date"
                    >
                      Task Start Date
                    </label>
                    <span className="col-1 p0">:</span>
                    <span
                      className="col-6 "
                      title={moment(taskList[selectedRow - 1].start).format(
                        "DD-MMM-YYYY"
                      )}
                    >
                      {moment(taskList[selectedRow - 1].start).format(
                        "DD-MMM-YYYY"
                      )}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <div className="row">
                    <label className="col-3  no-padding" title="Task End Date">
                      Task End Date
                    </label>
                    <span className="col-1 p0">:</span>
                    <span
                      className="col-6 "
                      title={moment(taskList[selectedRow - 1].finish).format(
                        "DD-MMM-YYYY"
                      )}
                    >
                      {moment(taskList[selectedRow - 1].finish).format(
                        "DD-MMM-YYYY"
                      )}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <div className="row">
                    <label className="col-3  no-padding" title="Role">
                      Role
                    </label>
                    <span className="col-1 p0">:</span>
                    <span
                      className="col-6 "
                      title={
                        taskList[selectedRow - 1].roleName == null
                          ? "All"
                          : taskList[selectedRow - 1].roleName
                      }
                    >
                      {taskList[selectedRow - 1].roleName == null
                        ? "All"
                        : taskList[selectedRow - 1].roleName}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-4 row">
                <div className="form-group">
                  <div
                    className="row"
                    style={{ borderLeft: "1.5px solid #ddd" }}
                  >
                    <label className="col-6  no-padding" title="Estimated Hrs">
                      Estimated Hrs
                    </label>
                    <span className="col-1 p0">:</span>
                    <span
                      className="col-5 "
                      title={
                        taskList[selectedRow - 1].estimatedHrs !== null
                          ? taskList[
                              selectedRow - 1
                            ].estimatedHrs.toLocaleString()
                          : 0
                      }
                    >
                      {taskList[selectedRow - 1].estimatedHrs !== null
                        ? taskList[
                            selectedRow - 1
                          ].estimatedHrs.toLocaleString()
                        : 0}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <div
                    className="row"
                    style={{ borderLeft: "1.5px solid #ddd" }}
                  >
                    <label className="col-6  no-padding" title="Assigned Hrs">
                      Assigned Hrs
                    </label>
                    <span className="col-1 p0">:</span>
                    <span
                      className="col-5 "
                      title={assignedHrs.toLocaleString()}
                    >
                      {assignedHrs.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <div
                    className="row"
                    style={{ borderLeft: "1.5px solid #ddd" }}
                  >
                    <label className="col-6  no-padding" title="Unassigned Hrs">
                      Unassigned Hrs
                    </label>
                    <span className="col-1 p0">:</span>
                    <span
                      className="col-5 "
                      title={difference.toLocaleString()}
                    >
                      {" "}
                      {difference.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <div
                    className="row"
                    style={{ borderLeft: "1.5px solid #ddd" }}
                  >
                    <label className="col-6  no-padding" title="Actual Hrs">
                      Actual Hrs
                    </label>
                    <span className="col-1 p0">:</span>
                    <span
                      className="col-5 "
                      title={
                        taskList[selectedRow - 1].actualHrs == null
                          ? 0
                          : taskList[selectedRow - 1].actualHrs.toLocaleString()
                      }
                    >
                      {taskList[selectedRow - 1].actualHrs == null
                        ? 0
                        : taskList[selectedRow - 1].actualHrs.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <TaskPlanResourceTable
              setAssignedHrs={setAssignedHrs}
              assignedHrs={assignedHrs}
              taskList={taskList}
              selectedRow={selectedRow}
              grp2Items={grp2Items}
            />
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}
export default TaskPlanResourcePopUp;
