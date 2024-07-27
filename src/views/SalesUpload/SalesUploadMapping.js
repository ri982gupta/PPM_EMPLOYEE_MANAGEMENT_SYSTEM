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
const SalesUploadMapping = (props) => {
  const {
    setMessageSoftware,
    setMessageMapping,
    setMessage,
    setMessageMappingWrong,
    setUploadMessageMapping,
    setUploadMessageTarget,
    setUploadMessageSigning,
    setUploadMessageSoftware,
    setMessage1,
    setMessageSignings,
    setMessageSigningsWrong,
    setMessageSoftwareWrong,
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
      baseUrl + `/CommonMS/document/downloadFile?documentId=64452520`;

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
        `Sales Mapping Upload Template${extension}`
      );
      document.body.appendChild(link);
      link.click();
    });
  };
  const handleSaveClick = () => {
    setMessageMapping(false);
    setUploadMessageTarget(false);
    axios
      .postForm(
        baseUrl +
          `/SalesMS/pmo/uploadSalesTargets/?loggedUserId=${loggedUserId}&type=custForecast&upload=1`,
        {
          fileUpload: selectedFile,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setMessageMapping(true);
        setMessageMappingWrong(false);
        setUploadMessageMapping(false);
        setTimeout(() => {
          setMessageMapping(false);
        }, 3000);
        setKey((prevKey) => prevKey + 1);
        setSelectedFile([]);
      });
  };
  const handleCancelClick = () => {
    setKey((prevKey) => prevKey + 1);
  };

  const errorDisp = () => {
    setMessageMappingWrong(true);
    setMessageMapping(false);
    setUploadMessageMapping(false);
    setUploadMessageTarget(false);
    setUploadMessageSigning(false);
    setUploadMessageSoftware(false);
    setTimeout(() => {
      setMessageMappingWrong(false);
    }, 3000);
    setKey((prevKey) => prevKey + 1);
    setSelectedFile([]);
  };
  const noFile = () => {
    setMessageSignings(false);
    setMessageSoftware(false);
    setUploadMessageMapping(true);
    setMessage(false);
    setMessage1(false);
    setMessageSigningsWrong(false),
      setMessageSoftwareWrong(false),
      setMessageMappingWrong(false);
    setMessageMapping(false);
    setUploadMessageTarget(false);
    setUploadMessageSigning(false);
    setUploadMessageSoftware(false);
    setTimeout(() => {
      setUploadMessageMapping(false);
    }, 3000);
  };

  return (
    <>
      <div className="group customCard">
        <div className="col-md-12 collapseHeader">
          <h2
            style={{ cursor: "pointer" }}
            onClick={() => {
              setVisible(!visible);
            }}
          >
            Mappings
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
                  Upload Mappings <span className="error-text">*</span>
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
                    selectedFile.name?.includes("Sales Mapping Upload Template")
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
                  <ImCross /> Cancel
                </button>
                <button
                  style={{ marginLeft: "auto" }}
                  className="btn btn-primary"
                  title={"Dowload Upload Mappings Template "}
                  onClick={() => {
                    downloadEmployeeData();
                  }}
                >
                  <FaDownload />
                  Download Template
                </button>
              </div>
              <div></div>
            </div>
          </div>
        </CCollapse>
      </div>
    </>
  );
};

export default SalesUploadMapping;
