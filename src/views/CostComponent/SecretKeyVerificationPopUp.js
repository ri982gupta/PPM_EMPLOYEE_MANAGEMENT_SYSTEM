import React from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CButton } from "@coreui/react";
import "./CostCss.scss";
import { GoKey } from "react-icons/go";

function SecretKeyVerificationPopUp(props) {
  const {
    secretKeyValidationPopUp,
    setSecretKeyValidationPopUp,
    loginStatus,
    setLoginStatus,
    secretKeysDataSize,
    onChangeHandler,
    validateSecretKey,
    handleGenerateSecretKey,
    confirmationMessageClass,
    borderColor,
  } = props;
  return (
    <div>
      <CModal
        size="sm"
        visible={secretKeyValidationPopUp}
        onClose={() => setSecretKeyValidationPopUp(false)}
      >
        <CModalHeader className="hgt22">
          <CModalTitle>
            <span className="ft16">Secret Key Verification</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className={confirmationMessageClass}>{loginStatus}</div>
          <div className="col-md-12">
            {/* <div>
                            <h6>Secret Key Verification</h6>
                        </div> */}
            <input
              id="secretKey"
              type="text"
              autoComplete="off"
              className={`${borderColor} hideCharacters`}
              style={{ width: "60%" }}
              onChange={(e) => {
                onChangeHandler(e);
              }}
            />
            <button
              className="btn btn-primary mt-2"
              onClick={() => {
                validateSecretKey();
              }}
            >
              Submit
            </button>
            <br />
            {secretKeysDataSize.length == 0 ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleGenerateSecretKey();
                }}
              >
                <GoKey className="genarateKeyIcon" />
                Generate Secret Key
              </button>
            ) : (
              ""
            )}
          </div>
        </CModalBody>
        {/* <CModalFooter>
                    <CButton color="secondary" onClick={() => setSecretKeyValidationPopUp(false)}>
                        Close
                    </CButton>
                    <CButton onClick={() => { saveSecretKeyData() }} color="primary">Save changes</CButton>
                </CModalFooter> */}
      </CModal>
    </div>
  );
}

export default SecretKeyVerificationPopUp;
