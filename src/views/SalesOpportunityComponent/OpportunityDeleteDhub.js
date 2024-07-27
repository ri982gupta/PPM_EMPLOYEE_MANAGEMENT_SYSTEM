import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiFillWarning } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { TfiSave } from "react-icons/tfi";
import { environment } from "../../environments/environment";

const OpportunityDeleteDhub = (props) => {
  const {
    setDeleteDhubPopUp,
    deleteDhubPopUp,
    opportunityId,
    fetchData,
    // displayTableData,
    dataVar,
    setDealHubDelete,
    setVersPopup,
    DHubPush,
    setButtonDisabledState,
    setInitialOpen,
    setCurrentOn,
    handleClick,
  } = props;
  const [comment, setComment] = useState("");
  const [commentErrMsg, setCommentErrMsg] = useState(false);
  const baseUrl = environment.baseUrl;
  const DeleteRole = () => {
    if (!comment.trim()) {
      setCommentErrMsg(true);
      setTimeout(() => {
        // setCommentErrMsg(false);
      }, 3000);
      return;
    }
    axios({
      method: "Post",
      url:
        baseUrl +
        `/SalesMS/sales/deleteDHubOpportunity?opportunityId=${opportunityId}`,
      data: {
        comments: comment,
      },
    }).then((res) => {
      handleClick();
      setDeleteDhubPopUp(false);
      // DHubPush(opportunityId);
      setButtonDisabledState([]);
      setCurrentOn([]);
      setVersPopup(false);
      setDealHubDelete(true);
      fetchData();
      setTimeout(() => {
        setDealHubDelete(false);
      }, 2000);
    });
  };

  // useEffect(() => {
  //   displayTableData();
  // }, [dataVar]);

  useEffect(() => {
    if (deleteDhubPopUp) {
      const textarea = document.getElementById("comments");
      textarea && textarea.focus();
    }
  }, [deleteDhubPopUp]);
  return (
    <div>
      <CModal
        alignment="center"
        backdrop="static"
        visible={deleteDhubPopUp}
        size="sm"
        className="ui-dialog"
      >
        <CModalHeader className="" closeButton={false}>
          <CModalTitle>
            <span className="">Delete from DealHub</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {commentErrMsg && (
            <div className="statusMsg error">
              <span>
                <AiFillWarning />
                &nbsp;
                {"Please Provide Comment"}
              </span>
            </div>
          )}
          <div className=" col-md-12 mb-2">
            <strong> Are you sure to delete Opportunity from DealHub ?</strong>

            <div className=" col-md-12 ">
              <label>
                Comments&nbsp;
                <span className="error-text">*</span>
              </label>
              <textarea
                id="comments"
                type="text"
                // value={comment}
                onChange={(e) => setComment(e.target.value)}
                // ref={(textarea) => textarea && textarea.focus()}
                rows={4}
                cols={20}
                className={commentErrMsg ? "error-block commentsError" : ""}
                style={{
                  // resize: "both",
                  // overflow: "auto",
                  // outline: "none"
                  border: commentErrMsg,
                  outline: "none", // This line removes the outline on focus
                  borderColor: commentErrMsg ? "red" : "#ced4da",
                }}
              />
            </div>
          </div>
          <div className="btn-container center my-2">
            <button
              className="btn btn-primary"
              title="Delete"
              onClick={() => {
                DeleteRole();
              }}
            >
              <TfiSave /> Delete
            </button>
            <button
              className="btn btn-secondary"
              title="Cancel"
              onClick={() => {
                setDeleteDhubPopUp(false);
              }}
            >
              <ImCross /> Cancel{" "}
            </button>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default OpportunityDeleteDhub;
