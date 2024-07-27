import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { BiSave } from "react-icons/bi";
import axios from "axios";
import DatePicker from "react-datepicker";
import moment from "moment";
import { environment } from "../../environments/environment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";

export default function ReleaseNotesUpdatePopup(props) {
  const { custName, setCustName, getData, data, loader, setLoader } = props;
  const [successfullymsg, setSuccessfullymsg] = useState(false);

  const [date, setDate] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const loggedUserId = localStorage.getItem("resId");

  const ref = useRef([]);
  const onFileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);

    setFormData1((prev) => ({
      ...prev,
      [e.target.id]: e.target.files[0]?.name,
    }));
  };

  const initialValue = {
    releaseDate: "",
    versionNumber: "",
  };
  const baseUrl = environment.baseUrl;

  const [formData1, setFormData1] = useState(initialValue);
  console.log(formData1);
  const [validationmessage, setValidationMessage] = useState(false);

  const handleUpload = (e) => {
    console.log(data, "datasahid");
    console.log(formData1, "formdata1");
    console.log(selectedFile?.name, "selectedfile");
    let validNw = false;
    for (let i = 1; i < data.length; i++) {
      let versionNum = data[i].version_number;
      let releaseDt = data[i].release_date;
      let fileNm = data[i].file_name;
      if (
        versionNum == formData1.versionNumber &&
        releaseDt == formData1.releaseDate &&
        fileNm == selectedFile?.name
      ) {
        // console.log('match');
        validNw = true;
        break;
      } else {
        //console.log('notmatch');
      }
    }
    console.log(ref);

    let valid = GlobalValidation(ref);
    console.log(valid);
    if (valid) {
      setValidationMessage(true);
      return;
    }
    if (validNw == false) {
      axios
        .postForm(
          baseUrl +
            `/supportms/support/UploadFileAndData?versionNumber=${formData1.versionNumber}&releaseDt=${formData1.releaseDate}&loggedUserId=${loggedUserId}&fileRevision=1.0`,
          {
            file: selectedFile,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          //getData();

          setValidationMessage(false);
          setSuccessfullymsg(true);
          setLoader(true);
          setTimeout(() => {
            setSuccessfullymsg(false);
            setLoader(false);
            setCustName(false);
          }, 3000);

          getData();
        })
        .catch((error) => {
          console.log(error);
          // handle error
        });
      // // setCustName(false);
      // setTimeout(() => {
      //   setCustName(false);
      // }, 3000);
    }
  };

  return (
    <div>
      <CModal
        size="lg"
        visible={custName}
        onClose={() => {
          setCustName(false);
        }}
        backdrop={"static"}
      >
        <CModalHeader className="hgt22" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            <span className="ft16"> Upload Release Notes</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validationmessage == true ? (
            <div className="statusMsg error">
              {" "}
              <AiFillWarning />
              Please select valid values for highlighted fields
            </div>
          ) : (
            ""
          )}
          {successfullymsg == true ? (
            <div className="statusMsg success">
              <span className="errMsg">
                &nbsp; Release Notes saved successfully
              </span>
            </div>
          ) : (
            ""
          )}
          <div className="row">
            <div className="row mb-2">
              <div className=" col-md-3 ">
                <label>
                  Release Date :<span className="error-text">*</span>
                </label>
              </div>
              <div className=" col-md-3 mb-2">
                <div
                  className="datepicker cancel"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <DatePicker
                    id="releaseDate"
                    selected={date}
                    autoComplete="off"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    onChange={(e) => {
                      console.log(e);
                      setDate(e);
                      setFormData1((prev) => ({
                        ...prev,
                        ["releaseDate"]: moment(e).format("yyyy-MM-DD"),
                      }));
                    }}
                    dateFormat="dd-MMM-yyyy"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />{" "}
                </div>
              </div>

              <div className=" col-md-3 ">
                <label>
                  Version :<span className="error-text">*</span>
                </label>{" "}
              </div>

              <div className=" col-md-3 mb-2">
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <input
                    className="form-control"
                    id="versionNumber"
                    type="text"
                    onChange={(e) => {
                      console.log(e);
                      console.log(e.target.value);

                      setFormData1((prev) => ({
                        ...prev,
                        ["versionNumber"]: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-2">
              <div className="textfield col-md-6 p0">
                <div
                  className="textfield"
                  style={{
                    backgroundColor: validationmessage ? "red" : "",
                    border: validationmessage ? "1px solid red" : "",
                  }}
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <input
                    className="fileUpload form-control cancel"
                    type="file"
                    id="fileName"
                    name="fileName"
                    autoComplete="off"
                    accept=".xls, .xlsx"
                    placeholder="Enter Resource Name"
                    onChange={onFileChangeHandler}
                  />
                </div>
              </div>
              <div className="textfield col-md-6">
                <button
                  onClick={() => handleUpload()}
                  id="upload"
                  name="upload"
                  className="btn btn-primary"
                >
                  <BiSave /> Upload
                </button>
              </div>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}
