import React, { useEffect, useState } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CButton } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { AiOutlineWarning } from "react-icons/ai";
import "./CostCss.scss";

function GenerateSecretKey(props) {
  const { open, setGenerateSecretKey } = props;
  const [logged, setLogged] = useState([]);
  console.log(logged);

  const baseUrl = environment.baseUrl;

  const [validationMessage, setValidationMessage] = useState("");
  const [enterSecretKeyValidation, setEnterSecretKeyValidation] = useState("");
  const [reEnterSecretKeyValidation, setReEnterSecretKeyValidation] =
    useState("");

  const getloggeduser = () => {
    axios
      .get(baseUrl + `/ProjectMS/Audit/getloggeduser?loggedId=${loggedUserId}`)
      .then((Response) => {
        let data = Response.data;
        console.log(data);
        setLogged(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getloggeduser();
  }, []);

  const initialValues = {
    resourceId: 513,
    emailOfficial: "bala.peddi@prolifics.com",
    secretKey: "",
  };

  const [secretKeyFormData, setSecretKeyFormData] = useState({
    initialSecretKey: "",
    secondSecretKey: "",
  });

  useEffect(() => {}, []);

  const secretKeyChangeHandler = (e) => {
    const { id, value } = e.target;
    setSecretKeyFormData((prevVal) => ({ ...prevVal, [id]: value }));
  };

  const saveSecretKeyData = () => {
    if (
      secretKeyFormData.initialSecretKey ===
        secretKeyFormData.secondSecretKey &&
      secretKeyFormData.initialSecretKey.length != 0 &&
      secretKeyFormData.secondSecretKey.length != 0
    ) {
      initialValues["secretKey"] = secretKeyFormData.initialSecretKey;
      setEnterSecretKeyValidation("");
      setReEnterSecretKeyValidation("");
      setValidationMessage("");
      axios({
        method: "post",
        url: baseUrl + `/CostMS/cost/generateSecretKey`,
        data: initialValues,
        headers: { "Content-Type": "application/json" },
      })
        .then(function (responseData) {
          //handle success
          setValidationMessage(responseData.data.status);
          setTimeout(() => {
            setValidationMessage("");
          }, 2000);
        })
        .catch((err) => console.log(err));
    } else {
      setValidationMessage(
        <div className="col-md-12 errMsg" style={{ width: "90%" }}>
          <AiOutlineWarning className="confirmMsgIcon" />
          Please Enter Mandatory Fields
        </div>
      );
      setEnterSecretKeyValidation("txtBoxBorderColor");
      setReEnterSecretKeyValidation("txtBoxBorderColor");
    }
  };

  return (
    <div>
      <CModal
        size="lg"
        visible={open}
        onClose={() => setGenerateSecretKey(false)}
      >
        <CModalHeader>
          <CModalTitle>Generate Secret Key</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>{validationMessage}</div>
          <div>
            <div className="col-md-5">
              <label className="p0">Enter secret Key </label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <div className="col-md-1">
              <span className="p25">:</span>
            </div>
            <div className="col-md-6">
              <input
                className="enterSecretKeyValidation"
                style={{ marginLeft: "-40px" }}
                id="initialSecretKey"
                type="text"
                onChange={(e) => {
                  secretKeyChangeHandler(e);
                }}
              />
              <br />
            </div>
            <div className="col-md-5">
              <label className="p0">Re-Enter secret Key </label>
              <span style={{ color: "red" }}>*</span>
            </div>
            <div className="col-md-1">
              <span className="p25">:</span>
            </div>
            <div className="col-md-6">
              <input
                className="reEnterSecretKeyValidation"
                style={{ marginLeft: "-40px", marginTop: "4px" }}
                id="secondSecretKey"
                type="text"
                onChange={(e) => {
                  secretKeyChangeHandler(e);
                }}
              />
              <br />
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="popUpCloseButton"
            color="secondary"
            onClick={() => setGenerateSecretKey(false)}
          >
            <div className="popUpCloseButtonText">Close</div>
          </CButton>
          <CButton
            onClick={() => {
              saveSecretKeyData();
            }}
            color="primary"
          >
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default GenerateSecretKey;
