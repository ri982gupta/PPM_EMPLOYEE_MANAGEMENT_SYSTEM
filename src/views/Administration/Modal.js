import React, { useState } from "react";
import { useRef } from "react";

// import SelectS from "./SelectS"
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CButton } from "@coreui/react";
import { useDispatch } from "react-redux";
import { undoSaveSelectSE } from "../../reducers/SelectedSEReducer";

export default function Modal({ open, children, onClose }) {
  const dispatch = useDispatch();
  if (!open) return null;
  const selectSERef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="box">
        <CModal visible={open} onClose={() => setIsOpen(false)} size="xl">
          <CModalHeader>
            <CModalTitle>Select Customers/Prospects</CModalTitle>
          </CModalHeader>
          <CModalBody>{/* <SelectS ref={selectSERef}/> */}</CModalBody>
          <CModalFooter>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <CButton
                onClick={() => {
                  selectSERef.current.resetTOlocalState();
                  dispatch(undoSaveSelectSE("undo"));
                }}
              >
                Undo
              </CButton>
              <CButton
                onClick={() => {
                  selectSERef.current.setGlobalState();
                  dispatch(undoSaveSelectSE("save"));
                  setIsOpen(false);
                }}
              >
                Save
              </CButton>
            </div>
          </CModalFooter>
        </CModal>
      </div>
    </>
  );
}
