import { CCollapse } from "@coreui/react";
import React, { useEffect, useState } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
  FaArrowLeft,
  FaDownload,
} from "react-icons/fa";
import SalesUploadMapping from "./SalesUploadMapping";
import SalesUploadSigningsTargets from "./SalesUploadSigningsTargets";
import SalesUploadSoftwareTargets from "./SalesUploadSoftwareTargets";
import axios from "axios";
import { environment } from "../../environments/environment";
import { FileUpload } from "@mui/icons-material";
import { ImCross, ImDownload3 } from "react-icons/im";
import { BiCheck, BiLeftArrowAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { MdWarning } from "react-icons/md";
import { AiFillWarning } from "react-icons/ai";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function SalesUploadParent() {
  const [message, setMessage] = useState(false);
  const [message1, setMessage1] = useState(false);
  const [messageMappingWrong, setMessageMappingWrong] = useState(false);
  const [messageSigningsWrong, setMessageSigningsWrong] = useState(false);
  const [messageSoftwareWrong, setMessageSoftwareWrong] = useState(false);
  const [messageMapping, setMessageMapping] = useState(false);
  const [messageSignings, setMessageSignings] = useState(false);
  const [messageSoftware, setMessageSoftware] = useState(false);
  const [uploadMessageTarget, setUploadMessageTarget] = useState(false);
  const [uploadMessageMapping, setUploadMessageMapping] = useState(false);
  const [uploadMessageSigning, setUploadMessageSigning] = useState(false);
  const [uploadMessageSoftware, setUploadMessageSoftware] = useState(false);

  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const onFileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const [selectedFile, setSelectedFile] = useState([]);
  const [key, setKey] = useState(0);

  //-----------breadcrumbs------------
  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["Upload"];

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/pmo/uploadSalesTargets";
      getUrlPath(modifiedUrlPath);

      let data = resp.data;

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    console.log(modifiedUrlPath);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };

  const downloadEmployeeData = () => {
    const docUrl =
      baseUrl + `/CommonMS/document/downloadFile?documentId=64452521`;

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
      link.setAttribute("download", `Sales Target Upload Template${extension}`);
      document.body.appendChild(link);
      link.click();
    });
  };
  const handleSaveClick = () => {
    setMessage(false);

    axios
      .postForm(
        baseUrl +
          `/SalesMS/pmo/uploadSalesTargets/?loggedUserId=${loggedUserId}&type=target&upload=1`,
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
        setKey((prevKey) => prevKey + 1);
        setSelectedFile([]);
        setMessage(true);
        setMessage1(false);
        setUploadMessageTarget(false);
        setTimeout(() => {
          setMessage(false);
        }, 2000);
      });
  };
  const handleCancelClick = () => {
    setKey((prevKey) => prevKey + 1);
  };

  const errorDisp = () => {
    setMessage1(true);
    setMessage(false);
    setUploadMessageTarget(false);
    setTimeout(() => {
      setMessage1(false);
    }, 3000);

    setKey((prevKey) => prevKey + 1);
    setSelectedFile([]);
  };

  const noFile = () => {
    setUploadMessageTarget(true);
    setMessageMappingWrong(false);
    setMessageSigningsWrong(false);
    setMessageSoftwareWrong(false);
    setMessageMapping(false);
    setMessageSignings(false);
    setMessageSoftware(false);
    setMessage(false);
    setMessage1(false);
    setUploadMessageMapping(false);
    setUploadMessageSigning(false);
    setUploadMessageSoftware(false);
    setTimeout(() => {
      setUploadMessageTarget(false);
    }, 3000);
  };

  return (
    <>
      {message && (
        <div className="statusMsg success">
          <BiCheck />
          {"Data Uploaded successfully"}
        </div>
      )}
      {message1 && (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Data Uploading failed"}
        </div>
      )}
      {uploadMessageTarget && (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please Select a file to Upload"}
        </div>
      )}
      {messageMapping && (
        <div className="statusMsg success">
          <BiCheck />
          {"Data Uploaded successfully"}
        </div>
      )}
      {messageMappingWrong && (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Unsupported file template"}
        </div>
      )}
      {uploadMessageMapping && (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please Select a file to Upload"}
        </div>
      )}
      {messageSignings && (
        <div className="statusMsg success">
          <BiCheck />
          {"Data Uploaded successfully"}
        </div>
      )}
      {messageSigningsWrong && (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Data Uploading failed"}
        </div>
      )}
      {uploadMessageSigning && (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please Select a file to Upload"}
        </div>
      )}
      {messageSoftware && (
        <div className="statusMsg success">
          <BiCheck />
          {"Data Uploaded successfully"}
        </div>
      )}
      {messageSoftwareWrong && (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Data Uploading failed"}
        </div>
      )}
      {uploadMessageSoftware && (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please Select a file to Upload"}
        </div>
      )}
      <div className="col-md-12 ">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2> Sales Upload</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <ScreenBreadcrumbs
        routes={routes}
        currentScreenName={currentScreenName}
      />

      <div className="group  customCard">
        <div className="col-md-12">
          <button
            className="btn btn-primary mb-2 mt-2"
            title="Go Back"
            onClick={() => {
              window.location.href = "/#/pmo/salesTargets";
            }}
          >
            <FaArrowLeft /> Go Back
          </button>
        </div>
        <div className="col-md-12 collapseHeader">
          <div className="col-md-10">
            <h2
              style={{ cursor: "pointer", align: "left" }}
              onClick={() => {
                setVisible(!visible);
              }}
            >
              Targets
            </h2>
          </div>
          <div
            className="col-md-2"
            style={{ textAlign: "end" }}
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
            {/* <div className="col-md-12">
             
            </div> */}
            <div className="col-md-12 mb-2 row">
              <label className="col-2" htmlFor="text-input-inline">
                <strong>
                  Upload Targets<span className="error-text">*</span>
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
                    selectedFile.name?.includes("Sales Target Upload Template")
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
                  title={"Dowload Sales Upload Targets Template"}
                  onClick={() => {
                    downloadEmployeeData();
                  }}
                >
                  <FaDownload /> Download Template
                </button>
                {/* <button
                  style={{ marginLeft: "auto" }}
                  title={"Dowload Sales Upload Targets Template "}
                  className="btn btn-primary"
                  onClick={() => {
                    downloadEmployeeData();
                  }}
                >
                  <FaDownload />
                  Download <br></br>Template
                </button> */}
              </div>
              <div></div>
            </div>
          </div>
        </CCollapse>
      </div>
      <SalesUploadMapping
        setMessageSoftware={setMessageSoftware}
        setMessageSignings={setMessageSignings}
        setMessage1={setMessage1}
        setMessage={setMessage}
        setMessageMapping={setMessageMapping}
        setUploadMessageMapping={setUploadMessageMapping}
        setUploadMessageSigning={setUploadMessageSigning}
        setUploadMessageSoftware={setUploadMessageSoftware}
        setUploadMessageTarget={setUploadMessageTarget}
        setMessageMappingWrong={setMessageMappingWrong}
        setMessageSigningsWrong={setMessageSigningsWrong}
        setMessageSoftwareWrong={setMessageSoftwareWrong}
      />
      <SalesUploadSigningsTargets
        setMessageSoftware={setMessageSoftware}
        setMessageSignings={setMessageSignings}
        setMessageMapping={setMessageMapping}
        setMessage={setMessage}
        setUploadMessageTarget={setUploadMessageTarget}
        setUploadMessageMapping={setUploadMessageMapping}
        setUploadMessageSigning={setUploadMessageSigning}
        setUploadMessageSoftware={setUploadMessageSoftware}
        uploadMessageSoftware={uploadMessageSoftware}
        setMessage1={setMessage1}
        setMessageSigningsWrong={setMessageSigningsWrong}
        setMessageMappingWrong={setMessageMappingWrong}
        setMessageSoftwareWrong={setMessageSoftwareWrong}
      />
      <SalesUploadSoftwareTargets
        setMessage1={setMessage1}
        setMessage={setMessage}
        setMessageMapping={setMessageMapping}
        setMessageSoftware={setMessageSoftware}
        setUploadMessageMapping={setUploadMessageMapping}
        setUploadMessageSigning={setUploadMessageSigning}
        setUploadMessageSoftware={setUploadMessageSoftware}
        setUploadMessageTarget={setUploadMessageTarget}
        uploadMessageSoftware={uploadMessageSoftware}
        uploadMessageTarget={uploadMessageTarget}
        uploadMessageMapping={uploadMessageMapping}
        uploadMessageSigning={uploadMessageSigning}
        setMessageSoftwareWrong={setMessageSoftwareWrong}
        setMessageSigningsWrong={setMessageSigningsWrong}
        setMessageMappingWrong={setMessageMappingWrong}
        setMessageSignings={setMessageSignings}
      />
    </>
  );
}

export default SalesUploadParent;
