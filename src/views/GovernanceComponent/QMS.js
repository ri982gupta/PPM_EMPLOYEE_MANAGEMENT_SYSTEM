import React, { useState, useEffect } from "react";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import axios from "axios";
import { BiCheck, BiSave } from "react-icons/bi";
import moment from "moment";
import { Column } from "ag-grid-community";
import {
  BsCheck,
  BsCheckLg,
  BsFileEarmarkPdf,
  BsFillFileEarmarkPptFill,
  BsFillFileEarmarkWordFill,
} from "react-icons/bs";
import {
  AiFillDelete,
  AiFillFileImage,
  AiFillHtml5,
  AiFillWarning,
  AiOutlineFile,
  AiOutlineFileExcel,
} from "react-icons/ai";
import { VscFile, VscNewFolder } from "react-icons/vsc";
import Loader from "../Loader/Loader";
import { IoDocumentOutline } from "react-icons/io5";
import { TbFileText } from "react-icons/tb";
import { BsFileEarmarkZip } from "react-icons/bs";
import { environment } from "../../environments/environment";
import DocumentsPopUp from "../ProjectComponent/DocumentsPopUp";
import { Link } from "react-router-dom";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { useRef } from "react";
import QMSTable from "./QMSTable";
import QMSHierarchy from "./QMSHierarchy";
import { FaFileAlt, FaFileCsv, FaPlus } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

// import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

// import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function Documents() {
  const baseUrl = environment.baseUrl;
  const [successmsg, setSuccessmsg] = useState(false);
  const [addVisisble, setAddVisible] = useState(false);
  const [data, setData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState(false);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState(false);
  const [loader, setLoader] = useState(false);
  const [versPopup, setVersPopup] = useState(false);
  const [fileNamesArr, setFileNamesArr] = useState();
  const [checkedData, setCheckedData] = useState([]);
  const [hierarchydata, setHierarchyData] = useState([{}]);
  console.log(hierarchydata, "hierarchydata????????????");
  const [id, setId] = useState("41");
  const [deletePopup, setDeletePopup] = useState(false);
  const [uid, setUid] = useState(" ");
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [validationmessage, setValidationMessage] = useState(false);
  const [validationmessage1, setValidationMessage1] = useState(false);
  const [validationmessage2, setValidationMessage2] = useState(false);
  const [successfullymsg, setSuccessfullymsg] = useState(false);
  const [dataAccess, setDataAccess] = useState([]);
  const [uniqueMessage, setUniqueMessage] = useState(false);
  const [label, setLabel] = useState("");
  const [folderName, setFolderName] = useState("");
  const [accessLevel, setAccessLevel] = useState([]);
  const [docFolderId, SetDocFolderId] = useState("");
  const abortController = useRef(null);
  const [folder, setFolder] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [fileName, setFileName] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState([]);
  const [uploadFileName, setuploadFileName] = useState([]);
  console.log(uploadedFileName);
  const [defaultExpandedRows, setDefaultExpandedRows] = useState(0);
  const [createFolder, setCrteateFolder] = useState("");
  let rows = 25;
  const [selectedFile, setSelectedFile] = useState([]);
  const [formData, setFormData] = useState([]);
  const [upload, setUpload] = useState([]);
  const moment = require("moment");
  const [docNames, setDocNames] = useState([]);

  const [labelName, setLabelName] = useState([]);
  const [key, setKey] = useState(0);
  const [filterFileNames, setFilterFileNames] = useState([]);
  const [validation, setValidation] = useState(false);

  const projectName1 = labelName;
  console.log(labelName);
  const staticText = " Create Folder Under";
  const completeName = `${staticText}  ${projectName1}`;
  const fileInputRef = useRef(null);

  const [routes, setRoutes] = useState([]);
  let textContent = "Governance";
  let currentScreenName = ["QMS Document List"];

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getBreadCrumbs = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const qmsData = data;
      //   .find((item) => item.display_name === "Governance")
      //   .subMenus.find((subMenu) => subMenu.display_name === "QMS");
      // const accessLevel = qmsData.userRoles.includes("561")
      //   ? 561
      //   : qmsData.userRoles.includes("919")
      //   ? 919
      //   : null;
      // setDataAccess(accessLevel);
      // console.log(accessLevel, "-----------&&&&&----------");
      // const accesslevel =qmsData.userRoles.imcludes("561") && 561 :qmsData.userRoles.imcludes("919") && 919:null
      console.log(qmsData);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) =>
            submenu.display_name == "QMS" ||
            submenu.display_name == "Audit CP Setup"
        ),
      }));

      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  useEffect(() => {
    getBreadCrumbs();
  }, [dataAccess]);

  const getapiData = () => {
    // setLoader(true);
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "get",
      url: baseUrl + `/governancems/QMS/getQMSDocumentsBySp?pid=${id}`,
      signal: abortController.current.signal,
    })
      .then((res) => {
        setAddVisible(false);
        let dataa = res.data;
        setFilterFileNames(dataa.map((item) => item.FileName));
        const GetData = dataa.map((item) => {
          if (item.LastUpdatedBy === "") {
            return { ...item, LastUpdatedBy: "NA" };
          }
          return item;
        });
        const Headerdata = [
          {
            FileName: "File Name",
            FileSize: "File Size",
            Version: "Version",
            FileType: "File Type",
            CreatedOn: "Created On",
            CreatedBy: "Created By",
            lastUpdatedOn: "Updated On",
            LastUpdatedBy: "Updated By",
            Action: "Action",
          },
        ];

        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["FileName"] =
            GetData[i]["FileName"] == null
              ? ""
              : GetData[i]["FileName"].split(".")[0];
          GetData[i]["CreatedOn"] =
            GetData[i]["CreatedOn"] == null
              ? ""
              : moment(GetData[i]["CreatedOn"]).format(
                  "DD-MMM-yyyy hh:mm:ss A"
                );
          GetData[i]["lastUpdatedOn"] =
            GetData[i]["lastUpdatedOn"] == null
              ? ""
              : moment(GetData[i]["lastUpdatedOn"]).format(
                  "DD-MMM-yyyy hh:mm:ss A"
                );
          GetData[i]["Version"] =
            GetData[i]["Version"] == null
              ? ""
              : parseFloat(GetData[i]["Version"]).toFixed(1);
        }

        let data = ["Version"];

        let linkRoutes = [""];
        setLinkColumns(data);
        setLinkColumnsRoutes(linkRoutes);
        setLoader(false);

        setData(Headerdata.concat(GetData));
        clearTimeout(loaderTime);
        setLoader(false);
      })

      .catch((error) => {});
  };

  const getMenus = () => {
    // setMenusData

    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const revenueForcastSubMenu = resp.data
          .find((item) => item.display_name === "Governance")
          .subMenus.find((subMenu) => subMenu.display_name === "QMS");
        console.log(revenueForcastSubMenu.is_write);
        setAccessLevel(revenueForcastSubMenu.is_write);
        const accessLevel = revenueForcastSubMenu?.userRoles.includes("561")
          ? 561
          : revenueForcastSubMenu?.userRoles.includes("919")
          ? 919
          : revenueForcastSubMenu?.userRoles.includes("932")
          ? 932
          : null;
        console.log(accessLevel);
        setDataAccess(accessLevel);
      });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/qms/docList&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);
  console.log(dataAccess);
  const downloadEmployeeData = async (document_id, svn_revision, file_name) => {
    try {
      const response = await axios.get(
        baseUrl +
          `/CommonMS/document/downloadFile?documentId=${document_id}&svnRevision=${svn_revision}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file_name;

      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  // const downloadEmployeeData = (uid, svn_revision) => {
  //   const link = document.createElement("a");
  //   link.href =
  //     baseUrl +
  //     `/CommonMS/document/downloadFile?documentId=${uid}&svnRevision=${svn_revision}`;
  //   link.click();
  // };

  const getProjectDocumentshierarchy = () => {
    axios({
      method: "get",
      url: baseUrl + `/governancems/QMS/getQMSDocumentsFolder`,
    }).then(function (response) {
      var resp = response.data;
      setHierarchyData(resp);
    });
  };
  const handleCreateFolder = () => {
    if (folderName.trim() === "") {
      setValidationMessage1(true);
      setSuccessmsg(false);
      setTimeout(() => {
        setValidationMessage1(false);
      }, 3000);
      return;
    }
  };

  const uploadFile = () => {
    if (selectedFile.length == 0) {
      setValidationMessage2(true);
      setAddVisible(true);
      setTimeout(() => {
        setValidationMessage2(false);
      }, 3000);
      setSuccessfullymsg(false);
    } else {
      const loaderTime = setTimeout(() => {
        setLoader(true);
      }, 2000);

      setFileName([]);
      const formData = new FormData();
      selectedFile.forEach((file) => {
        formData.append("file", file);
      });
      axios({
        method: "post",
        url:
          baseUrl +
          `/ProjectMS/ContractDocuments/QMSuploadFile?docFolderId=${id}&loggedUserId=${loggedUserId}&commitMessage="uploaded"`,
        // `/ProjectMS/ContractDocuments/QMsupload?files=${selectedFile?.name}&folderId=${id}&loggedUserId=${loggedUserId}&fileRevision=1.0`,
        data: formData,
        // headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          setLoader(false);
          clearTimeout(loaderTime);
          var resp = response.data;
          setKey((prevKey) => prevKey + 1);
          getapiData();
          setSelectedFile([]);
          setUploadedFileName([]);
          setUpload(resp);
          setSuccessfullymsg(true);
          setAddVisible(false);
          setValidationMessage2(false);
          setTimeout(() => {
            setSuccessfullymsg(false);
          }, 3000);
        })
        .catch((error) => {
          setLoader(false);
        });
    }
  };

  const getUploadSuccessFileNames = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ContractDocuments/getUploadSuccessFileNames?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setFileNamesArr(resp);
      })
      .catch(function (error) {});
  };

  const getcreateFolder = () => {
    if (folderName.length === 0) {
      return;
    }
    if (folderName.length > 0) {
      setValidationMessage1(false);
      setSuccessmsg(true);
    }
    let customerNamesArr = docNames.filter((d) => d !== null);
    let someDataa = customerNamesArr.some((d) => d.folder_name == folderName);
    if (someDataa) {
      let ele = document.getElementsByClassName("unique");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }
      setUniqueMessage(true);
      setSuccessmsg(false);
      setTimeout(() => {
        setUniqueMessage(false);
      }, 3000);
    } else {
      let ele = document.getElementsByClassName("unique");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.remove("error-block");
      }
      setUniqueMessage(false);
      axios({
        method: "post",
        url:
          baseUrl +
          `/ProjectMS/ContractDocuments/createFolder?parentId=${id}&loggedUserId=${loggedUserId}&folderName=${folderName}`,
      })
        .then(function (response) {
          let resp = response.data;
          setCrteateFolder(resp);
          getProjectDocumentshierarchy();
          setSuccessmsg(true);
          setTimeout(() => {
            setSuccessmsg(false);
          }, 1000);
        })
        .catch(function (error) {});
    }
  };

  useEffect(() => {
    // getUploadSuccessFileNames();
    getProjectDocumentshierarchy();
    // getDocumentFileNames();
  }, []);

  const getChildFolders = () => {
    axios({
      method: "GET",
      url: baseUrl + `/governancems/QMS/getQMSChildFolderNames?pid=${id}`,
    }).then((resp) => {
      let data = resp.data;
      setDocNames(data);
    });
  };

  const deleteDocument = (data) => {
    setDeleteMessage(true);
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/ContractDocuments/deletefile?docId=${uid}`,

      // url: baseUrl + `/ProjectMS/ContractDocuments/delete file?docId=${uid}`,
    }).then((res) => {
      getapiData();
      setDeletePopup(false);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 1000);
    });
  };

  useEffect(() => {
    getapiData();
    getProjectDocumentshierarchy();
    getChildFolders();
  }, [id]);

  const onFileChangeHandler = (event) => {
    const inputFiles = event.target.files;
    console.log(inputFiles, "inputFiles");
    const newSelectedFiles = Array.from(inputFiles).filter((file) => {
      const fileName = file.name;
      if (filterFileNames.includes(fileName)) {
        setValidation(true);
        setTimeout(() => {
          setValidation(false);
        }, 6000);
        return false;
      }
      return true;
    });
    setSelectedFile((prevFiles) => [...prevFiles, ...newSelectedFiles]);
    const existedFilesArr = Array.from(inputFiles).filter((ele) =>
      filterFileNames.includes(ele.name)
    );
    const existedFiles = existedFilesArr.map((ele) => ele.name);
    console.log(existedFiles);
    setFileName(existedFiles);
    console.log(newSelectedFiles, "newSelectedFiles");
    const nonExistFileNames = newSelectedFiles.map((ele) => ele.name);
    const formattedFileNames = nonExistFileNames.map(
      (fileName) => `"${fileName}"`
    );
    const concatenatedString = formattedFileNames.join(", ");

    console.log(concatenatedString);
    setUploadedFileName(concatenatedString);
    setuploadFileName(concatenatedString);
  };
  const handleCancel = (e) => {
    let ele = document.getElementsByClassName("cancel");
    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";
    }
  };

  const Template = (data) => {
    return (
      <>
        <div align="center" data-toggle="tooltip" title={data.FileType}>
          {data.FileType == ".pdf" ? (
            <BsFileEarmarkPdf size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".xlsx" ? (
            <AiOutlineFileExcel size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".html" ? (
            <IoDocumentOutline size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".pptx" ? (
            <BsFillFileEarmarkPptFill
              size={"1.5em"}
              style={{ color: "#428bca" }}
            />
          ) : data.FileType == ".txt" ? (
            <TbFileText size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".zip" ? (
            <BsFileEarmarkZip size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".xml" ? (
            <BsFiletypeXml size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".jpeg" ? (
            <AiFillFileImage size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".PNG" ? (
            <AiFillFileImage size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".jpg" ? (
            <AiOutlineFile size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".png" ? (
            <AiFillFileImage size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".4" ? (
            <AiOutlineFile size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".docx" ? (
            <FaFileAlt size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".doc" ? (
            <FaFileAlt size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".xls" ? (
            <AiOutlineFileExcel size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".xlsm" ? (
            <AiOutlineFileExcel size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".mpp" ? (
            <VscFile size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".ppt" ? (
            <BsFillFileEarmarkPptFill
              size={"1.5em"}
              style={{ color: "#428bca" }}
            />
          ) : data.FileType == ".html" ? (
            <AiFillHtml5 size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".htm" ? (
            <AiFillHtml5 size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.FileType == ".PPT" ? (
            <BsFillFileEarmarkPptFill
              size={"1.5em"}
              style={{ color: "#428bca" }}
            />
          ) : data.FileType == ".csv" ? (
            <FaFileCsv size={"1.5em"} style={{ color: "#428bca" }} />
          ) : (
            ""
          )}
        </div>
      </>
    );
  };
  console.log(dataAccess);

  const Action = (data) => {
    return (
      <div>
        {dataAccess == 919 || dataAccess == 561 ? (
          <div align="center " data-toggle="tooltip" title="Download Document">
            <DownloadForOfflineRoundedIcon
              className="linkSty"
              style={{ cursor: "pointer", color: "#86b558" }}
              onClick={() =>
                downloadEmployeeData(
                  data.docId,
                  data.svn_revision,
                  `${data.FileName}'${data.FileType}`
                )
              }
            />
            <AiFillDelete
              data-toggle="tooltip"
              title="Delete"
              size={"1.3em"}
              style={{ cursor: "pointer", color: "orange" }}
              onClick={(e) => {
                setDeletePopup(true);
                setUid(data.docId);
              }}
            />
          </div>
        ) : (
          <div
            align="center "
            data-toggle="tooltip"
            title="Download Document"
            style={{ cursor: "pointer" }}
            onClick={() =>
              downloadEmployeeData(
                data.docId,
                data.svn_revision,
                `${data.FileName}'${data.FileType}`
              )
            }
          >
            <DownloadForOfflineRoundedIcon
              className="linkSty"
              style={{ cursor: "pointer", color: "#86b558" }}
            />
            <AiFillDelete
              data-toggle="tooltip"
              title="Delete"
              size={"1.3em"}
              style={{ cursor: "not-allowed", color: "orange" }}
            />
          </div>
        )}
      </div>
    );
  };

  const fName = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.FileName}>
        {data.FileName}
      </div>
    );
  };
  const fSize = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.FileSize}
        style={{ fontStyle: "italic" }}
      >
        {data.FileSize}
      </div>
    );
  };
  const fCreatedBy = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.CreatedBy}>
        {data.CreatedBy}
      </div>
    );
  };
  const fUpdatedBy = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.LastUpdatedBy}
      >
        {data.LastUpdatedBy}
      </div>
    );
  };
  const fCreatedOn = (data) => {
    var formattedDate = moment(data.CreatedOn).format("DD - MM - YYYY"); // Replace the format pattern as needed

    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.CreatedOn}>
        {data.CreatedOn}

        {/* {data.CreatedOn?.format("DD - MM - YYYY")} */}
      </div>
    );
  };
  const fUpdatedOn = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.lastUpdatedOn}
      >
        {data.lastUpdatedOn}
      </div>
    );
  };

  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          data-toggle="tooltip"
          title={data.Version}
          style={{ textDecoration: "underline", float: "right" }}
          onClick={() => {
            setVersPopup(true);
          }}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };

  const LinkTemplateAction = (data) => {
    return (
      <>
        <div>
          <input type="checkbox"></input>
        </div>
      </>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        key={col}
        sortable
        body={
          col == "FileName"
            ? fName
            : col == "checkbox"
            ? LinkTemplateAction
            : col == "FileType"
            ? Template
            : col == "Version"
            ? LinkTemplate
            : (col == "Action" && Action) ||
              (col == "FileSize" && fSize) ||
              (col == "CreatedBy" && fCreatedBy) ||
              (col == "CreatedOn" && fCreatedOn) ||
              (col == "lastUpdatedOn" && fUpdatedOn) ||
              (col == "LastUpdatedBy" && fUpdatedBy)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  function DocumentDeletePopUP(props) {
    const { deletePopup, setDeletePopup } = props;

    return (
      <div>
        <CModal
          alignment="center"
          visible={deletePopup}
          backdrop="static"
          size="xs"
          className="ui-dialog"
          onClose={() => setDeletePopup(false)}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Delete</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <h6>Are you sure you want to permanently remove this item ?</h6>
            <div className="btn-container center my-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  deleteDocument();
                }}
              >
                <BsCheckLg /> OK{" "}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                <ImCross /> Cancel{" "}
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }

  function VersionPopUP(props) {
    const { versPopup, setVersPopup } = props;

    return (
      <div>
        <CModal
          visible={versPopup}
          size="xs"
          className="ui-dialog"
          onClose={() => setVersPopup(false)}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Version History</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="col-12 p-0">
              <table className="table table-bordered table-striped" role="grid">
                <tbody>
                  <tr>
                    <th>Older Versions</th>
                    <th>Updated By</th>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <center>No Older Versions</center>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }

  useEffect(() => {
    if (validationmessage2) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [validationmessage2]);
  useEffect(() => {
    if (validation) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [validation]);

  return (
    <div>
      {validationmessage ? (
        <div className="statusMsg error">
          <AiFillWarning />
          Please enter document name to search
        </div>
      ) : (
        ""
      )}
      {validationmessage2 ? (
        <div className="statusMsg error">
          <AiFillWarning />
          Please select file(s) to upload
        </div>
      ) : (
        ""
      )}
      {successfullymsg ? (
        <div className="statusMsg success">
          <BiCheck />
          &nbsp;{uploadFileName} uploaded successfully
        </div>
      ) : (
        ""
      )}
      {validation && (
        <div className="statusMsg error">
          <AiFillWarning />
          {fileName} file(s) already exists in {labelName}
        </div>
      )}
      {deleteMessage ? (
        <div className="statusMsg success">
          <BsCheckLg />
          &nbsp; File deleted successfully
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>QMS Document List</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {/* <ScreenBreadcrumbs
        routes={routes}
        currentScreenName={currentScreenName}
      /> */}
      {}{" "}
      <div className="row">
        {/* {dataAccess == 919 ||
          (dataAccess == 561 && ( */}
        <div className="col-md-3 customCard ">
          <div className="col-md-12">
            <h2>Document Folders</h2>
          </div>
          {validationmessage1 ? (
            <div className="statusMsg error">
              <AiFillWarning />
              Please enter the folder name to be created
            </div>
          ) : (
            ""
          )}

          {successmsg ? (
            <div className="statusMsg success">
              <BiCheck />
              &nbsp;Folder {"::" + folderName} Successfully Created
            </div>
          ) : (
            ""
          )}
          {uniqueMessage ? (
            <div className="statusMsg error">
              {" "}
              <AiFillWarning />
              Folder:: {folderName} already exists
            </div>
          ) : (
            ""
          )}

          <div className="inline-form singleFeild left">
            <input
              type="text"
              id="Document"
              placeholder={"" + completeName}
              // placeholder={completeName ? { __html: completeName } : ""}
              className="unique"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
            {dataAccess == 919 && (
              <button
                type="button"
                title="Create Folder"
                className="btn btn-primary"
                // placeholder="Create Folder Under {hierarchydata.folder_name}."
                placeholder={`Create Folder Under ${hierarchydata.folder_name}.`}
                onClick={() => {
                  handleCreateFolder();
                  setFolderName("");
                  getcreateFolder();
                }}
              >
                <VscNewFolder />
                New
              </button>
            )}
            {dataAccess == 561 && (
              <button
                type="button"
                title="Create Folder"
                className="btn btn-primary"
                // placeholder="Create Folder Under {hierarchydata.folder_name}."
                placeholder={`Create Folder Under ${hierarchydata.folder_name}.`}
                onClick={() => {
                  handleCreateFolder();
                  setFolderName("");
                  getcreateFolder();
                }}
              >
                <VscNewFolder />
                New
              </button>
            )}
          </div>

          <div
            style={{
              minHeight: "calc(100vh - 225px)",
              maxHeight: "calc(100vh - 225px)",
              overflow: "auto",
              border: "1px solid #ccc", // Add border style here
              padding: "10px", // Optional padding for spacing
              overflowX: "hidden",
              // maxHeight: "450px",
              // overflowY: "auto",
              // overflowX: "hidden",
            }}
          >
            <QMSHierarchy
              defaultExpandedRows={String(defaultExpandedRows)}
              data={hierarchydata}
              setId={setId}
              SetDocFolderId={SetDocFolderId}
              setLabel={setLabel}
              setAddVisible={setAddVisible}
              setLabelName={setLabelName}
              setKey={setKey}
              setSelectedFile={setSelectedFile}
              completeName={completeName}
            />
          </div>
        </div>
        {/* ))} */}
        {/* {loader ? <Loader handleAbort={handleAbort} /> : ""} */}

        {/* {dataAccess == 919 || dataAccess == 561 ? ( */}
        <div className="col-md-9 customCard">
          <h2>Document Repository</h2>
          <QMSTable
            maxHeight1 = {maxHeight1}
            data={data}
            rows={rows}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            setCheckedData={setCheckedData}
            dataAccess={dataAccess}
          />

          {dataAccess == 561 ? (
            <div className=" form-group col-12 btn-container center">
              <button
                className="btn btn-primary"
                type="Add"
                onClick={() => {
                  setAddVisible(true);
                  setTimeout(() => {
                    window.scrollTo({ top: 10000, behavior: "smooth" });
                  }, 500);
                }}
                disabled={addVisisble}
              >
                <FaPlus /> Add
              </button>
            </div>
          ) : dataAccess == 919 ? (
            <div className=" form-group col-12 btn-container center ">
              <button
                className="btn btn-primary"
                type="Add"
                onClick={() => {
                  setAddVisible(true);
                  setTimeout(() => {
                    window.scrollTo({ top: 10000, behavior: "smooth" });
                  }, 500);
                }}
                disabled={addVisisble}
              >
                <FaPlus /> Add
              </button>
            </div>
          ) : (
            ""
          )}

          {openPopup ? (
            <DocumentsPopUp
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              hierarchydata={hierarchydata}
              docFolderId={docFolderId}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              SetDocFolderId={SetDocFolderId}
              getapiData={getapiData}
              setCheckboxSelect={setCheckboxSelect}
            />
          ) : (
            ""
          )}

          {deletePopup ? (
            <DocumentDeletePopUP
              deletePopup={deletePopup}
              setDeletePopup={setDeletePopup}
            />
          ) : (
            ""
          )}

          {versPopup ? (
            <VersionPopUP versPopup={versPopup} setVersPopup={setVersPopup} />
          ) : (
            ""
          )}

          {addVisisble && (
            <div>
              <div>
                <div className="col-md-12 my-1">
                  <div className="statusMsg warning">
                    <b>Note :</b> You can select 10 files at max.
                  </div>
                </div>
                <div className="col-12 p-0">
                  <div style={{ border: "1px solid #cdcdcd" }}>
                    <h3
                      style={{
                        fontSize: "initial",
                        border: "1px solid #cdcdcd",
                        color: "black",
                        padding: "5px",
                        backgroundColor: "#f4f4f4",
                      }}
                    >
                      Browse Document
                    </h3>
                    <input
                      key={key}
                      ref={fileInputRef}
                      type="file"
                      className="fileUpload unique1 form-control"
                      name="file"
                      id="file"
                      onChange={onFileChangeHandler}
                      multiple
                      accept=".jpg,.jpeg,.xlsx,.pdf,.docx,.txt,.doc,.csv,.html,.png,.ppt"
                    />
                    <label className="documenttypes col-md-12 ml-1">
                      Non Duplicate Files Select are:
                      <p style={{ color: "red" }}>
                        {uploadedFileName.length == 0 ? 0 : null}{" "}
                        {uploadedFileName.toString()}
                      </p>
                    </label>
                    <label className="documenttypes col-md-12 ml-1">
                      <p className="error-text">
                        Supported file types
                        .pdf,.ppt,.doc,.csv,.txt,.xlsx,.html,.png{" "}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          {loader ? <Loader handleAbort={handleAbort} /> : null}
          {addVisisble && (
            <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={() => {
                  // setAddVisible(!addVisisble);
                  uploadFile();
                }}
              >
                <BiSave /> Save
              </button>
              <button
                className="btn btn-secondary"
                type="cancel"
                onClick={() => {
                  setAddVisible(!addVisisble);
                  handleCancel();
                }}
              >
                <ImCross /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;
