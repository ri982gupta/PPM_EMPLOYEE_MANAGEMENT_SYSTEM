import React, { useState } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CButton } from "@coreui/react";
import "./CostCss.scss";
import resourcesCostListSampleFile from "../../assets/files/resourcesCostListSampleFile.xlsx";
import SalaryBandUploadSampleFile from "../../assets/files/SalaryBandUploadSampleFile.xlsx";
import { AiOutlineWarning } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import moment from "moment";
import { FileUpload } from "@mui/icons-material";
import { ImCross } from "react-icons/im";
function UploadExcelSheet(props) {
  const {
    excelUploadPopUp,
    setExcelUploadPopUp,
    excelFile,
    setExcelFile,
    uploadExcelSheet,
    getResourcesCostData,
    formData,
    stateValue,
    setLoaderTimer,
    updateMsg,
    setUpdateMsg,
    getComputedCostData,
    setStateValue,
    date,
  } = props;

  const [excelSheetValidation, setExcelSheetValidation] = useState("");
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [disable, setDisabled] = useState(false);
  const resourceId = localStorage.getItem("resId");
  let month = formData.month;
  const formattedDate = moment(date).format("yyyy-MM-DD HH:mm:ss");
  const formattedMonth = moment(date).startOf("month").format("YYYY-MM-DD");
  const onFileChangeHandler = (e) => {
    let fileName = e.target.files[0];
    let fileType = fileName.name.split(".");
    if (fileType[fileType.length - 1].includes("xlsx")) {
      setExcelSheetValidation("");
      setConfirmationMsg("");
      var excelFormData = new FormData();
      excelFormData.append("file", e.target.files[0]);

      if (stateValue !== "UploadRoleTypeCost") {
        excelFormData.append("secretKey", formData.secretKey);
        excelFormData.append("createdDate", formattedDate);
        excelFormData.append("month", formattedMonth);
      } else {
        excelFormData.append("createdDate", month);
      }
      excelFormData.append("resourceId", resourceId);
      setExcelFile(excelFormData);
    } else {
      setExcelSheetValidation("txtBoxBorderColor");
      setConfirmationMsg(
        <span className="statusMsg error col-md-12">
          <AiOutlineWarning className="confirmMsgIcon" />
          Please Upload Supported File Type
        </span>
      );
    }
  };

  const uploadFileHandler = async () => {
    if (excelFile != null) {
      setDisabled(true);

      const loaderTime = setTimeout(() => {
        setLoaderTimer(true);
      }, 2000);
      setExcelSheetValidation("");
      setConfirmationMsg("");

      const response = await uploadExcelSheet();
      // setStateValue("Calculate");

      const message = response?.data;

      const keysSet = new Set();
      message?.forEach((item) => keysSet.add(Object.keys(item)[0]));
      const keys = Array.from(keysSet);

      // getResourcesCostData("Calculate");
      if (
        stateValue == "UploadRoleTypeCost" &&
        !keys.includes("Successfull Save")
      ) {
        setDisabled(false);
        setExcelSheetValidation("txtBoxBorderColor");
        setConfirmationMsg(
          <span className="statusMsg error col-md-12">
            <AiOutlineWarning className="confirmMsgIcon" />
            {"Please check the Data "}
          </span>
        );
        return;
      } else {
        setConfirmationMsg(
          <span className="successMsg statusMsg success col-md-12">
            <BiCheck className="confirmMsgIcon" />
            {"File Uploaded Successfully"}
          </span>
        );
      }

      setLoaderTimer(false);
      clearTimeout(loaderTime);

      // else {
      // await getComputedCostData();
      setLoaderTimer(false);
      setTimeout(() => {
        setConfirmationMsg("");
        setExcelUploadPopUp(false);
        setExcelFile(null);
      }, 2000);
      setDisabled(false);

      await getResourcesCostData();

      // }
    } else {
      setExcelSheetValidation("txtBoxBorderColor");
      setConfirmationMsg(
        <span className="statusMsg error col-md-12">
          <AiOutlineWarning className="confirmMsgIcon" />
          Please select file before uploading
        </span>
      );
    }
  };

  return (
    <div>
      <CModal
        size="m"
        visible={excelUploadPopUp}
        onClose={() => {
          setExcelUploadPopUp(false);
        }}
      >
        <CModalHeader className="hgt22">
          <CModalTitle>
            <span className="ft16">
              {stateValue == "UploadRoleTypeCost" ? (
                "   Upload SalaryBand"
              ) : (
                <>{stateValue + " "} Resources Cost List</>
              )}
            </span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>{confirmationMsg}</div>
          <div className="col-md-12 p0">
            <span>Please download sample excel before uploading</span>

            <i style={{ marginLeft: "35px" }}>
              <a
                class="pull-right"
                href={
                  stateValue == "UploadRoleTypeCost"
                    ? SalaryBandUploadSampleFile
                    : resourcesCostListSampleFile
                }
                style={{ textDecoration: "underline" }}
              >
                Download Sample Excel
              </a>
            </i>
          </div>
          <div>
            <div class="Upload-Resources-Cost-List-popup">
              <label for="formFile" class="form-label">
                Upload File :
              </label>
              <input
                className={`form-control ${excelSheetValidation}`}
                type="file"
                id="formFile"
                onChange={(e) => {
                  onFileChangeHandler(e);
                }}
              />
              <b className="formate-indicator">
                <span>{"(XLXS Format Only)"}</span>
              </b>
              {stateValue == "UploadRoleTypeCost" && (
                <div>
                  <b>Note:</b>
                  <p>1.Please refrain from uploading existing data again.</p>
                  <p>
                    2.Ensure that the maximum salary offered is greater than the
                    minimum salary.
                  </p>
                  <p>
                    3.Verify that there are no empty cells present in the Excel
                    sheet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <span className="popUpCloseButton">
            <CButton
              color="secondary"
              onClick={() => {
                setExcelUploadPopUp(false);
              }}
            >
              <ImCross />
              Close
            </CButton>
          </span>
          <CButton
            onClick={() => {
              uploadFileHandler();
            }}
            color="primary"
            disabled={disable}
          >
            <FileUpload /> Upload
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
}

export default UploadExcelSheet;
