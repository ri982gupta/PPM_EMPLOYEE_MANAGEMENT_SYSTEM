import React from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import Draggable from "react-draggable";

function Invoicedeletepopup(props) {
  const { openIQA, setOpenIQA } = props;

  return (
    <div>
      Invoicedeletepopup
      <Draggable>
        <CModal
          alignment="center"
          visible={openIQA}
          size="sm"
          className="ui-dialog"
          onClose={() => setOpenIQA(false)}
        >
          <CModalHeader>
            <CModalTitle>
              <span>Delete Confirmation</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="center">
              Are you sure you want to delete this Invoice ?
            </div>
            <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setOpenIQA(false);
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setOpenIQA(false);
                }}
              >
                &nbsp; No
              </button>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
}

export default Invoicedeletepopup;
