import axios from "axios";
import React, { useEffect, useState } from "react";
import CostViewAndUpload from "./CostViewAndUpload";
import GenerateSecretKey from "./GenerateSecretKey";
import { environment } from "../../environments/environment";
import SecretKeyVerificationPopUp from "./SecretKeyVerificationPopUp";
import { AiOutlineWarning } from "react-icons/ai";
import { TiTickOutline } from "react-icons/ti";
import moment from "moment";
//comments
function SecretKeyVerification(props) {
  const { country, departments, selectedDepartments, setSelectedDepartments } =
    props;

  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");

  const initialValues = {
    resourceId: loggedUserId,
    emailOfficial: "bala.peddi@prolifics.com",
    secretKey: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [validateKeyResponse, setValidateKeyResponse] = useState();
  const [generateSecretKey, setGenerateSecretKey] = useState(false);
  const [loginStatus, setLoginStatus] = useState("");
  const [secretKeyValidationPopUp, setSecretKeyValidationPopUp] =
    useState(true);
  const [secretKeysDataSize, setSecretKeysDataSize] = useState([]);
  const [confirmationMessageClass, setConfirmationMessageClass] = useState("");
  const [borderColor, setBorderColor] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const [date, setDate] = useState(() => {
    const date = new Date();
    return date;
  });

  const [filtersData, setfiltersData] = useState({
    legalEntityName: "a",
    country: "3",
    businessUnit: "",
    fromDate: moment(date).startOf("month").format("yyyy-MM-DD"),
    toDate: moment(date).endOf("month").format("yyyy-MM-DD"),
    duration: "1",
    secretKey: formData.secretKey,
  });

  const onChangeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prevVal) => ({ ...prevVal, [id]: value }));
  };

  useEffect(() => {
    filtersData["secretKey"] = formData.secretKey;
  }, [formData]);

  const validateSecretKey = async () => {
    const finalFormData = formData;
    finalFormData["ipAddress"] = ipAddress;
    const responseData = await axios({
      method: "post",
      url: baseUrl + `/CostMS/cost/validateSecretKey`,
      data: finalFormData,
      headers: { "Content-Type": "application/json" },
    });
    //handle success
    setValidateKeyResponse(responseData.data);
    if (Object.keys(responseData.data).length == 0) {
      setConfirmationMessageClass("errMsg");
      setLoginStatus(
        <span className="statusMsg error">
          <AiOutlineWarning className="confirmMsgIcon" />
          Authentication Failed.......!
        </span>
      );
      setBorderColor("txtBoxBorderColor");
      setTimeout(() => {
        setLoginStatus("");
        setBorderColor("");
        setConfirmationMessageClass("");
      }, 4000);
    } else {
      setConfirmationMessageClass("successMsg");
      setLoginStatus(
        <span>
          <TiTickOutline className="confirmMsgIcon" />
          Logged In Successfully
        </span>
      );
      // setTimeout(() => {
      setLoginStatus("");
      setSecretKeyValidationPopUp(false);
      setConfirmationMessageClass("");
      // }, 3000);
    }
  };

  const getIpAddressData = async () => {
    fetch("https://geolocation-db.com/json/")
      .then((response) => {
        return response.json();
      }, "jsonp")
      .then((res) => {
        setIpAddress(res.IPv4);
      })
      .catch((err) => console.log(err));
  };

  const handleGenerateSecretKey = () => {
    setGenerateSecretKey(!generateSecretKey);
  };

  const secretKeysDataSizeHandler = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CostMS/cost/findSecretKeysDataSize`,
    })
      .then(function (responseData) {
        //handle success
        setSecretKeysDataSize(responseData.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    secretKeysDataSizeHandler();
    getIpAddressData();
  }, []);

  return (
    <div>
      {/* <SecretKeyVerificationPopUp
        secretKeyValidationPopUp={secretKeyValidationPopUp}
        setSecretKeyValidationPopUp={setSecretKeyValidationPopUp}
        loginStatus={loginStatus}
        setLoginStatus={setLoginStatus}
        secretKeysDataSize={secretKeysDataSize}
        onChangeHandler={onChangeHandler}
        validateSecretKey={validateSecretKey}
        handleGenerateSecretKey={handleGenerateSecretKey}
        confirmationMessageClass={confirmationMessageClass}
        borderColor={borderColor}
      /> */}
      <div>
        {/* {validateKeyResponse?.status && secretKeyValidationPopUp == false ? ( */}
        <CostViewAndUpload
          formData={formData}
          country={country}
          departments={departments}
          selectedDepartments={selectedDepartments}
          filtersData={filtersData}
          setfiltersData={setfiltersData}
          date={date}
          setDate={setDate}
          setSelectedDepartments={setSelectedDepartments}
        />
        {/* ) : (
          ""
        )} */}
      </div>
      <div>
        {generateSecretKey ? (
          <GenerateSecretKey
            open={generateSecretKey}
            setGenerateSecretKey={setGenerateSecretKey}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default SecretKeyVerification;
