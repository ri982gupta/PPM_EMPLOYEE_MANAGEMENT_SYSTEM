import React, { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { undoSaveSelectSE } from "../../reducers/SelectedSEReducer";
import SelectSE from "./SelectSE";

export default function SelectSEDialogBox({
  value,
  setVisible,
  setGrpId,
  dataAccess,
  SetBulkIds,
  visible,
  pipelinePermission,
  accessData,
  salesfullAccess,
  selectedSE,
  setselectedSE,
  seOptions,
  setSelectedItems,
  selectedItems,
  accessBased,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();

  const selectSERef = useRef(null);

  const handleClose = () => {
    if (selectedSERedux.length != selectedSELocal.length)
      setShowConfirmation(true);
    else setVisible(false);
  };

  const handleSaveChanges = () => {
    dispatch(undoSaveSelectSE("save"));
    setShowConfirmation(false);
    setVisible(false);
  };

  const handleCancel = () => {
    // Close the confirmation dialog
    setShowConfirmation(false);
    setVisible(false);
  };

  const selectedSERedux = useSelector(
    (state) => state.selectedSEState.selectedSEProp
  );
  const selectedSELocal =
    localStorage.getItem("selectedSELocal") === null
      ? []
      : JSON.parse(localStorage.getItem("selectedSELocal"));

  return (
    <>
      <Modal show={visible} onHide={handleClose} size="xl" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>
            {value === "EngagementS" ? "Select Customers" : "Select Executives"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SelectSE
            ref={selectSERef}
            accessData={accessData}
            value={value}
            setGrpId={setGrpId}
            salesfullAccess={salesfullAccess}
            selectedSE={selectedSE}
            setselectedSE={setselectedSE}
            dataAccess={dataAccess}
            SetBulkIds={SetBulkIds}
            seOptions={seOptions}
            setSelectedItems={setSelectedItems}
            pipelinePermission={pipelinePermission}
            selectedItems={selectedItems}
            accessBased={accessBased}
            setVisible={setVisible}
          />
        </Modal.Body>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal show={showConfirmation} onHide={handleCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do you want to save your changes before closing?</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={handleCancel}>
            No, Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Yes, Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
