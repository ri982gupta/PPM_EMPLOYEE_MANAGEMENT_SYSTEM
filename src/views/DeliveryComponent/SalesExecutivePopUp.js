import React from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import Draggable from "react-draggable";

export default function SalesExecutivePopUp(props) {
  const { visibleSEPU, setVisibleSEPU, setIsReplace, setIsAdd, setDetails } =
    props;
  return (
    <div>
      <Draggable>
        <CModal
          alignment="center"
          backdrop="static"
          visible={visibleSEPU}
          onClose={() => {
            setVisibleSEPU(false);
          }}
          size="sm"
          className="ui-dialog"
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Manager</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p>
              Do you want to replace the existing sales executive or add as new?
            </p>
            <div
              className="btn-container center my-3"
              style={{ borderTop: "1px solid grey" }}
            >
              <button
                type="Replace"
                className="btn btn-primary mt-2"
                onClick={() => {
                  setIsReplace(true);
                  setVisibleSEPU(false);
                  setDetails((prev) => ({
                    ...prev,
                    isReplaceAdd: "Replace",
                  }));
                }}
              >
                Replace
              </button>
              &nbsp; &nbsp;
              <button
                type="Add"
                className="btn btn-primary mt-2"
                onClick={() => {
                  setIsAdd(true);
                  setVisibleSEPU(false);
                  setDetails((prev) => ({
                    ...prev,
                    isReplaceAdd: "Add",
                  }));
                }}
              >
                Add
              </button>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
}
