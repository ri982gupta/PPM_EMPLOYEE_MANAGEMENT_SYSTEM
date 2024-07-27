import React, { useState } from "react";
import { useRef } from "react";

import SelectS from "./SelectS";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CButton } from "@coreui/react";
import { useDispatch } from "react-redux";
import { undoSaveSelectSE } from "../../reducers/SelectedSEReducer";

export default function Modal({ open, children, onClose }) {
  if (!open) return null;
  const selectSERef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  return (
    <>
      <div className="box">
        {/* {children} 
      <button onClick={onClose}>Close</button> */}

        <CModal visible={open} onClose={() => setIsOpen(false)} size="xl">
          <CModalHeader>
            <CModalTitle>Select Customers/Prospects</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <SelectS ref={selectSERef} />
          </CModalBody>
          <CModalFooter>
            <CButton
              onClick={() => {
                dispatch(undoSaveSelectSE("undo"));
                selectSERef.current.resetTOlocalState();
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
          </CModalFooter>
        </CModal>
      </div>
    </>
  );
}
