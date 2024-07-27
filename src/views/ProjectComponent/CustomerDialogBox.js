// import SelectSE from "./SelectSE";
import SelectCustomer from "./SelectCutomer";
import { useRef } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CButton } from "@coreui/react";
import { useDispatch } from "react-redux";
import { undoSaveSelectSE } from "../../reducers/SelectedSEReducer";

export default function SelectSEDialogBox({
  value,
  visible,
  setVisible,
  setSelectedItems,
  newMemberDropdown,
  selectedItems,
}) {
  const vars = {
    "--cui-modal-color": "red",
  };

  const selectSERef = useRef(null);
  const dispatch = useDispatch();
  return (
    <>
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        size="xl"
        // style={vars}
      >
        <CModalHeader>
          <CModalTitle>
            {value == "EngagementS" ? "Select Customers" : "Select Executives"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <SelectCustomer
            ref={selectSERef}
            value={value}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            newMemberDropdown={newMemberDropdown}
          />
        </CModalBody>
        {value == "EngagementS" ? (
          ""
        ) : (
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
                setVisible(false);
              }}
            >
              Save
            </CButton>
          </CModalFooter>
        )}
      </CModal>
    </>
  );
}
