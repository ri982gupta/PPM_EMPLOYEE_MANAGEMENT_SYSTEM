import { CCollapse } from "@coreui/react";
import React, { useState } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
  FaDownload,
} from "react-icons/fa";
import axios from "axios";
import { environment } from "../../environments/environment";
import { FileUpload } from "@mui/icons-material";
import { ImCross } from "react-icons/im";
function SalesUploadSoftwareTargets(props) {
  const {
    setMessageSigningsWrong,
    setMessageSoftware,
    setMessage,
    setMessageSoftwareWrong,
    setMessageMappingWrong,
    setUploadMessageSoftware,
    setMessageSignings,
    setMessage1,
    uploadMessageSoftware,
    uploadMessageTarget,
    uploadMessageMapping,
    uploadMessageSigning,
    setUploadMessageSigning,
    setMessageMapping,
  } = props;
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const onFileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const [selectedFile, setSelectedFile] = useState([]);
  const [key, setKey] = useState(0);
  const downloadEmployeeData = () => {
    const docUrl =
      baseUrl + `/CommonMS/document/downloadFile?documentId=97855677`;

    axios({
      url: docUrl,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const contentType = response.headers["content-type"];
      const extension = ".xlsx";
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Sales Software Target Upload Template${extension}`
      );
      document.body.appendChild(link);
      link.click();
    });
  };
  const handleSaveClick = () => {
    setMessageSoftware(false);
    axios
      .postForm(
        baseUrl +
          `/SalesMS/pmo/uploadSalesTargets/?loggedUserId=${loggedUserId}&type=swTargets&upload=1`,
        {
          // .postForm(
          //   `http://localhost:8098/SalesMS/pmo/uploadSalesTargets/?loggedUserId=${loggedUserId}&type=swTargets&upload=1`,
          //   {
          fileUpload: selectedFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setMessageSoftware(true);
        setMessageSoftwareWrong(false);
        setUploadMessageSoftware(false);
        setTimeout(() => {
          setMessageSoftware(false);
        }, 3000);
        setKey((prevKey) => prevKey + 1);
        setSelectedFile([]);
      });
  };
  const handleCancelClick = () => {
    setKey((prevKey) => prevKey + 1);
    setSelectedFile([]);
  };
  const errorDisp = () => {
    setMessageSoftwareWrong(true);
    setMessageSoftware(false);

    setMessage1(false);
    setTimeout(() => {
      setMessageSoftwareWrong(false);
    }, 3000);

    setKey((prevKey) => prevKey + 1);
    setSelectedFile([]);
  };

  const noFile = () => {
    setMessageSigningsWrong(false);
    setMessageSoftware(false);
    setUploadMessageSigning(false);
    setMessage(false);
    setUploadMessageSoftware(true);
    setMessageSoftwareWrong(false);
    setMessageSoftware(false);
    setMessageSignings(false);
    setMessage1(false);
    setMessageMappingWrong(false);
    setMessageMapping(false);
    setMessageSignings(false);
    setTimeout(() => {
      setUploadMessageSoftware(false);
    }, 3000);
  };
  return (
    <>
      <div className="group mb-5 customCard">
        <div className="col-md-12 collapseHeader">
          <h2
            style={{ cursor: "pointer" }}
            onClick={() => {
              setVisible(!visible);
            }}
          >
            Software Targets
          </h2>

          <div
            onClick={() => {
              setVisible(!visible);

              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            <span>{cheveronIcon}</span>
          </div>
        </div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-12 mb-2 row">
              <label className="col-2" htmlFor="text-input-inline">
                <strong>
                  Upload Software Targets<span className="error-text">*</span>
                </strong>
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-2">
                <input
                  key={key}
                  type="file"
                  name="file"
                  className="fileUpload unique1 form-control"
                  id="file"
                  onChange={onFileChangeHandler}
                />
              </div>
              <div className="col-7 d-flex align-items-center">
                <button
                  className="btn btn-primary mr-2"
                  title="Save"
                  onClick={() => {
                    selectedFile.name?.includes(
                      "Sales Software Target Upload Template"
                    ) ||
                    selectedFile.name?.includes("Sales Signings Target Upload")
                      ? handleSaveClick()
                      : selectedFile.name == undefined
                      ? noFile()
                      : errorDisp();
                  }}
                >
                  <FileUpload /> Upload
                </button>
                <button
                  className="btn btn-secondary"
                  title="cancel"
                  onClick={handleCancelClick}
                >
                  <ImCross />
                  Cancel
                </button>
                <button
                  style={{ marginLeft: "auto" }}
                  className="btn btn-primary float-end"
                  title={"Downlod Upload Software Targets Template"}
                  onClick={() => {
                    downloadEmployeeData();
                  }}
                >
                  <FaDownload /> Download Template
                </button>
              </div>
              <div></div>
            </div>
          </div>
        </CCollapse>
      </div>
    </>
  );
}

export default SalesUploadSoftwareTargets;
