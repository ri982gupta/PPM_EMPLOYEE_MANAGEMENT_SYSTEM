import React from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { TiTickOutline } from "react-icons/ti";
import axios from "axios";
import { environment } from "../../environments/environment";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";

function CapacityPlanDeletePopup(props) {
  const {
    //  deleteIssue,
    approvalStatus,
    deletePopup,
    setDeletePopup,
    deleteData,
    setUid,
    uid,
    getTableData,
    setStatus,
    setDeleteMessage,
    setDeleteResourceMessage,
    permissions,
    addErrMsg,
    setaddErrMsg,
  } = props;
  const includeData = Object.assign({}, deleteData);

  const baseUrl = environment.baseUrl;

  const deleteRole = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/ProjectMS/CapacityPlan/deleteOuterProjectRoleList?Roleid=${uid}`,
      data: uid,
    }).then(function (response) {
      console.log(response);
      let res = response.data.type;
      console.log(res);
      setStatus(res);

      setUid(0);
      getTableData();
      setDeletePopup(false);
      setDeleteMessage(true);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 3000);
    });
  };
  console.log(approvalStatus, "approvalStatus");
  const deleteRes = () => {
    console.log("Resource delet");
    axios({
      method: "delete",
      url:
        baseUrl +
        `/ProjectMS/CapacityPlan/deleteInnerProjectRoleResource?ProjectRoleBookId=${uid}&approvalStatus=${approvalStatus}`,
      //   data: uid,
    }).then(function (response) {
      console.log(response);
      let res = response.data.type;
      console.log(res);
      res == undefined ? setStatus(false) : setStatus(res);

      setUid(0);
      getTableData();
      setDeletePopup(false);
      setDeleteResourceMessage(true);
      setTimeout(() => {
        setDeleteResourceMessage(false);
      }, 3000);
    });
  };

  const handleClick = () => {
    {
      deleteData?.hasOwnProperty("resource_id") ? deleteRes() : deleteRole();
    }
  };

  return (
    <div>
      {console.log(
        deleteData?.hasOwnProperty("subrows"),
        deleteData.subrows?.length,
        "resource_id"
      )}
      <CModal
        visible={deletePopup}
        size="sm"
        className="ui-dialog"
        onClose={() => setDeletePopup(false)}
        backdrop={"static"}
      >
        <CModalHeader className="">
          <CModalTitle>
            <span className="">
              {deleteData?.hasOwnProperty("resource_id")
                ? "Delete Role Resource"
                : "Delete Project Role"}
            </span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {deleteData?.hasOwnProperty("resource_id") ? (
            <h6>Are you sure you want to delete Resource ?</h6>
          ) : (
            <h6>Are you sure you want to delete project role ?</h6>
          )}
          <div className="btn-container center my-2">
            <button
              type="delete"
              className="btn btn-primary"
              onClick={() => {
                handleClick();
              }}
            >
              <TiTickOutline size={"1.5em"} />
              Delete{" "}
            </button>{" "}
            &nbsp; &nbsp;
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setDeletePopup(false);
              }}
            >
              {" "}
              <ImCross /> Cancel{" "}
            </button>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}
export default CapacityPlanDeletePopup;
