import {
  CCollapse,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import { ImCopy, ImCross } from "react-icons/im";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import axios from "axios";
import { BiCheck, BiSave } from "react-icons/bi";
import { VscNewFolder } from "react-icons/vsc";
import DocumentsPopUp from "./DocumentsPopUp";
import moment from "moment";
import { Column } from "ag-grid-community";
import { BsFileEarmarkPdf, BsFillFileEarmarkPptFill } from "react-icons/bs";
import {
  AiFillDelete,
  AiFillWarning,
  AiOutlineFile,
  AiOutlineFileExcel,
} from "react-icons/ai";
import { IoDocumentOutline } from "react-icons/io5";
import { TbFileText } from "react-icons/tb";
import { Link } from "react-router-dom";
import { BsFileEarmarkZip } from "react-icons/bs";
import { environment } from "../../environments/environment";
import DocumentsTable from "./DocumentsTable";
import DocumentHierarchy from "./DocumentHierarchy";
import Loader from "../Loader/Loader";
import { useRef } from "react";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function Documents(props) {
  const baseUrl = environment.baseUrl;

  const [docId1, setDocId1] = useState([]);
  const [svn, setSvn] = useState([]);
  const [visible, setVisible] = useState(false);
  const [addVisisble, setAddVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [data, setData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState(false);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [versPopup, setVersPopup] = useState(false);
  const [uid, setUid] = useState(" ");
  const [projectName, setProjectName] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [folderName, setFolderName] = useState("");
  const [validationmessage, setValidationMessage] = useState(false);
  const [validationmessage1, setValidationMessage1] = useState(false);
  const [validationmessage2, setValidationMessage2] = useState(false);
  const [moveCopyValidationMsg, setMoveCopyValidationMsg] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const [hierarchydata, setHierarchyData] = useState([{}]);
  const [upload, setUpload] = useState([]);
  const [successfullymsg, setSuccessfullymsg] = useState(false);
  const [copysuccessmsg, setCopySuccessmsg] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [movesuccessmsg, setMoveSuccessmsg] = useState(false);
  const [successmsg, setSuccessmsg] = useState(false);
  const [fileNamesArr, setFileNamesArr] = useState();
  const [fileName, setFileName] = useState([]);
  const [docId, setDocId] = useState([]);
  const [docFolderId, SetDocFolderId] = useState("");
  const [label, setLabel] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [createFolder, setCrteateFolder] = useState("");
  const [loader, setLoader] = useState(false);
  const [uniqueMessage, setUniqueMessage] = useState(false);
  const [folder, setFolder] = useState([]);
  const [checkboxSelect, setCheckboxSelect] = useState(false);
  const abortController = useRef(null);
  const [data2, setData2] = useState([]);
  const [defaultExpandedRows, setDefaultExpandedRows] = useState(0);

  const loggedUserId = localStorage.getItem("resId");
  const {
    projectId,
    grp1Items,
    urlState,
    setbtnState,
    btnState,
    setUrlState,
    grp2Items,
    grp3Items,
    grp4Items,
    grp6Items,
  } = props;

  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Projects", "Project", "Documents"];
  let textContent = "Delivery";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/project/documents/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const getData1 = resp.data;
      const deliveryItem = getData1[7]; // Assuming "Delivery" item is at index 7

      const desiredOrder = [
        "Engagements",
        "Projects",
        "Engagement Allocations",
        "Project Health",
        "Project Status Report",
      ];

      const sortedSubMenus = deliveryItem.subMenus.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.display_name);
        const indexB = desiredOrder.indexOf(b.display_name);
        return indexA - indexB;
      });
      deliveryItem.subMenus = sortedSubMenus;
      setData2(sortedSubMenus);

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  let rows = 25;

  const projectName1 = label;
  const staticText = " Create Folder Under";
  const completeName = `${staticText}  ${projectName1}`;

  const getapiData = () => {
    axios
      .get(
        baseUrl +
          `/VendorMS/vendor/getProjectDocuments?DocFolderId=${docFolderId}`
      )
      .then((res) => {
        let dataa = res.data;

        const GetData = dataa.map((item) => {
          if (item.last_updated_by === "") {
            return { ...item, last_updated_by: "NA" };
          }
          return item;
        });

        const Headerdata = [
          {
            file_name: "File Name",
            file_size: "File Size",
            app_revision: "Version",
            file_type: "File Type",
            date_created: "Created On",
            created_by: "Created By",
            last_updated: "Updated On",
            last_updated_by: "Updated By",
            Action: "Action",
          },
        ];

        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["file_name"] =
            GetData[i]["file_name"] == null
              ? ""
              : GetData[i]["file_name"].split(".")[0];
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment
                  .utc(GetData[i]["date_created"])
                  .format("DD-MMM-yyyy hh:mm:ss A");

          GetData[i]["last_updated"] =
            GetData[i]["last_updated"] == null
              ? ""
              : moment
                  .utc(GetData[i]["last_updated"])
                  .format("DD-MMM-yyyy hh:mm:ss A");
          GetData[i]["app_revision"] =
            GetData[i]["app_revision"] == null
              ? ""
              : parseFloat(GetData[i]["app_revision"]).toFixed(1);
        }
        let data = ["app_revision"];
        let linkRoutes = [""];
        setLinkColumns(data);
        setLinkColumnsRoutes(linkRoutes);
        setData(Headerdata.concat(GetData));

        let a1 = [];
        let b1 = [];
        data?.forEach((e) => {
          let dpObj = {
            label: e.id,
          };
          a1.push(dpObj);
          setDocId1(a1);
        });

        data?.forEach((e) => {
          let dpObj = {
            label: e.svn_revision,
          };
          b1.push(dpObj);
          setSvn(b1);
        });
        setDocId(GetData);
      });
  };

  useEffect(() => {
    getapiData();
  }, [docFolderId, inputValue]);

  const validateInputValue = () => {
    if (inputValue.trim() === "") {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      return false;
    }
    return true;
  };

  const getFilteredDocuments = () => {
    if (!validateInputValue()) {
      return;
    }
    validateInputValue() && setVisible(!visible);

    axios
      .get(
        baseUrl +
          `/VendorMS/vendor/getFilteredDocuments?ProjectId=${projectId}&SearchVal=${inputValue}`
      )
      .then((res) => {
        let dataa = res.data;
        const GetData = dataa.map((item) => {
          if (item.last_updated_by === "") {
            return { ...item, last_updated_by: "NA" };
          }
          return item;
        });
        const Headerdata = [
          {
            file_name: "File Name",
            file_size: "File Size",
            app_revision: "Version",
            file_type: "File Type",
            date_created: "Created On",
            created_by: "Created By",
            last_updated: "Updated On",
            last_updated_by: "Updated By",
            Action: "Action",
          },
        ];

        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["file_name"] =
            GetData[i]["file_name"] == null
              ? ""
              : GetData[i]["file_name"].split(".")[0];
          GetData[i]["date_created"] =
            GetData[i]["date_created"] == null
              ? ""
              : moment
                  .utc(GetData[i]["date_created"])
                  .format("DD-MMM-yyyy hh:mm:ss A");
          GetData[i]["last_updated"] =
            GetData[i]["last_updated"] == null
              ? ""
              : moment
                  .utc(GetData[i]["last_updated"])
                  .format("DD-MMM-yyyy hh:mm:ss A");
          GetData[i]["app_revision"] =
            GetData[i]["app_revision"] == null
              ? ""
              : parseFloat(GetData[i]["app_revision"]).toFixed(1);
        }
        let data = ["app_revision"];
        let linkRoutes = [""];
        setLinkColumns(data);
        setLinkColumnsRoutes(linkRoutes);
        setData(Headerdata.concat(GetData));
      });
  };

  const getProjectName = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectName?projectId=${projectId}`,
    }).then(function (response) {
      let resp = response.data;
      setProjectName(resp);
    });
  };

  useEffect(() => {
    getProjectName();
    getUploadSuccessFileNames();
    getProjectDocumentshierarchy();
    getDocumentFileNames();
  }, []);

  const deleteDocument = () => {
    setDeleteMessage(true);
    axios({
      method: "delete",
      url: baseUrl + `/VendorMS/vendor/deleteDocumentById?id=${uid}`,
    }).then((res) => {
      getapiData();
      setDeletePopup(false);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 1000);
    });
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
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

  const downloadEmployeeData = async (id, svn_revision, file_name) => {
    try {
      const response = await axios.get(
        baseUrl +
          `/CommonMS/document/downloadFile?documentId=${id}&svnRevision=${svn_revision}`,

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

  const getProjectDocumentshierarchy = () => {
    setLoader(false);
    abortController.current = new AbortController();

    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getProjectDocumentshierarchy?objectId=${projectId}`,
      signal: abortController.current.signal,
    }).then(function (response) {
      var resp = response.data;

      // Filter and remove duplicates based on folder_name
      const uniqueFolders = resp.filter((item, index, self) => {
        return (
          index === self.findIndex((t) => t.folder_name === item.folder_name)
        );
      });

      setDefaultExpandedRows(uniqueFolders[0].id);
      setHierarchyData(uniqueFolders);
      setLoader(false);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
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
      const formData = new FormData();
      formData.append("file", selectedFile);
      axios({
        method: "post",
        url:
          baseUrl +
          `/ProjectMS/ContractDocuments/uploadFile?docFolderId=${docFolderId}&loggedUserId=${loggedUserId}&commitMessage="uploaded"`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then(function (response) {
        var resp = response.data;
        setUpload(resp);
        getapiData();
        setSuccessfullymsg(true);
        setAddVisible(false);
        setValidationMessage2(false);
        setTimeout(() => {
          setSuccessfullymsg(false);
        }, 1000);
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

    let customerNamesArr = folder.filter((d) => d !== null);
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
          `/ProjectMS/ContractDocuments/createFolder?parentId=${docFolderId}&loggedUserId=${loggedUserId}&folderName=${folderName}`,
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

  const getDocumentFileNames = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ContractDocuments/getDocumentFileNames?projectId=${projectId}`,
    }).then(function (response) {
      let resp = response.data;
      setFolder(resp);
    });
  };

  const [selectedFile, setSelectedFile] = useState([]);
  const [formData, setFormData] = useState([]);

  const onFileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setFileName(e.target.files[0]?.name);
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.files[0]?.name,
    }));
  };

  const handleCancel = (e) => {
    let ele = document.getElementsByClassName("cancel");
    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";
    }
  };

  useEffect(() => {
    if (docId) {
    }
  }, []);

  useEffect(() => {
    setDocId1(data.id);
    setSvn(data.svn_revision);
    setFileName(data.file_name);
  }, [data]);

  useEffect(() => {}, [selectedIds]);

  const LinkTemplate = (data) => {
    setDocId1(data.id);
    setSvn(data.svn_revision);
    setFileName(data.file_name);

    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          data-toggle="tooltip"
          title={data.app_revision}
          style={{
            float: "right",
            color: "#428bca",
            textDecorationLine: "underline",
          }}
          onClick={() => {
            setVersPopup(true);
          }}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };

  const Template = (data) => {
    return (
      <>
        <div align="center" data-toggle="tooltip" title={data.file_type}>
          {data.file_type == ".pdf" ? (
            <BsFileEarmarkPdf size={"1.5em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".xlsx" ? (
            <AiOutlineFileExcel size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".html" ? (
            <IoDocumentOutline size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".pptx" ? (
            <BsFillFileEarmarkPptFill
              size={"1.5em"}
              style={{ color: "#428bca" }}
            />
          ) : data.file_type == ".txt" ? (
            <TbFileText size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".zip" ? (
            <BsFileEarmarkZip size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".xml" ? (
            <TbFileText size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".jpeg" ? (
            <AiOutlineFile size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".PNG" ? (
            <AiOutlineFile size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".jpg" ? (
            <AiOutlineFile size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".png" ? (
            <AiOutlineFile size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".4" ? (
            <AiOutlineFile size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".xls" ? (
            <AiOutlineFileExcel size={"1.8em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".md" ? (
            <TbFileText size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".csv" ? (
            <TbFileText size={"2.0em"} style={{ color: "#428bca" }} />
          ) : data.file_type == ".docx" ? (
            <TbFileText size={"2.0em"} style={{ color: "#428bca" }} />
          ) : (
            ""
          )}
        </div>
      </>
    );
  };

  const Action = (data) => {
    return (
      <div align="center " data-toggle="tooltip" title="Download Document">
        <DownloadForOfflineRoundedIcon
          className="linkSty"
          style={{ cursor: "pointer", color: "#86b558" }}
          onClick={() => {
            downloadEmployeeData(
              data.id,
              data.svn_revision,
              `${data.file_name}${data.file_type}`
            );
            console.log(data, "data");
          }}
        />
        {grp1Items[4].is_write === true ? (
          <AiFillDelete
            data-toggle="tooltip"
            title="Delete"
            size={"1.3em"}
            style={{ cursor: "pointer", color: "orange" }}
            onClick={() => {
              setDeletePopup(true);
              setUid(data.id);
            }}
          />
        ) : null}
      </div>
    );
  };

  const fName = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.file_name}>
        {data.file_name}
      </div>
    );
  };
  const fSize = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.file_size}
        style={{ fontStyle: "italic" }}
      >
        {data.file_size}
      </div>
    );
  };
  const fCreatedBy = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.created_by}>
        {data.created_by}
      </div>
    );
  };
  const fCreatedOn = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.date_created}>
        {data.date_created}
      </div>
    );
  };
  const fUpdatedOn = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.last_updated}>
        {data.last_updated}
      </div>
    );
  };
  const fUpdatedBy = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.last_updated_by}
      >
        {data.last_updated_by}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "file_name"
            ? fName
            : col == "file_type"
            ? Template
            : col == "app_revision"
            ? LinkTemplate
            : (col == "Action" && Action) ||
              (col == "file_size" && fSize) ||
              (col == "created_by" && fCreatedBy) ||
              (col == "date_created" && fCreatedOn) ||
              (col == "last_updated" && fUpdatedOn) ||
              (col == "last_updated_by" && fUpdatedBy)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  function DocumentDeletePopUP(props) {
    const { deletePopup, setDeletePopup } = props;

    return (
      <div>
        <CModal
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
                Ok{" "}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setDeletePopup(false);
                }}
              >
                Cancel{" "}
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
          backdrop="static"
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
  return (
    <div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
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
          Please select a file
        </div>
      ) : (
        ""
      )}
      {successfullymsg ? (
        <div className="statusMsg success">
          <BiCheck />
          &nbsp; Project {fileName} uploaded Successfully
        </div>
      ) : (
        ""
      )}
      {moveCopyValidationMsg ? (
        <div className="statusMsg error">
          <AiFillWarning />
          Please Select Documents
        </div>
      ) : (
        ""
      )}
      {deleteMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          &nbsp; document deleted Successfully
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            {/* <h2>{projectName} </h2> */}
            <ul className="tabsContainer">
              <li>
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp2Items[0]?.display_name != undefined ? (
                  <span>{grp2Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp3Items[0]?.display_name != undefined ? (
                  <span>{grp3Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp4Items[0]?.display_name != undefined ? (
                  <span>{grp4Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp6Items[0]?.display_name != undefined ? (
                  <span>{grp6Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp6Items.slice(1).map((button) => (
                    <li
                      className={
                        btnState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
          <div className="childTwo">
            <h2>Documents</h2>
          </div>
          <div className="childThree toggleBtns">
          <button
              className="searchFilterButton btn btn-primary"
              onClick={() => {
                setVisible(!visible);

                visible
                  ? setCheveronIcon(FaChevronCircleUp)
                  : setCheveronIcon(FaChevronCircleDown);
              }}
            >
              Search Filters
              <span className="serchFilterText">{cheveronIcon}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="row">
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
          {copysuccessmsg ? (
            <div className="statusMsg success">
              <BiCheck />
              Document Copied Successfully
            </div>
          ) : (
            ""
          )}
          {movesuccessmsg ? (
            <div className="statusMsg success">
              <BiCheck />
              Document Moved Successfully
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
              <AiFillWarning /> Folder is already exist with this name
            </div>
          ) : (
            ""
          )}
          {grp1Items[4]?.is_write === true ? (
            <div className="inline-form singleFeild left">
              <input
                type="text"
                id="Document"
                placeholder={"" + completeName}
                className="unique"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
              <button
                type="button"
                title="Create Folder"
                className="btn btn-primary"
                onClick={() => {
                  handleCreateFolder();
                  setFolderName("");
                  getcreateFolder();
                }}
              >
                <VscNewFolder />
                New
              </button>
            </div>
          ) : null}

          {
            <DocumentHierarchy
              defaultExpandedRows={String(defaultExpandedRows)}
              data={hierarchydata}
              SetDocFolderId={SetDocFolderId}
              setLabel={setLabel}
              projectId={projectId}
              setAddVisible={setAddVisible}
            />
          }
        </div>
        <div className="col-md-9 customCard">
          <CCollapse visible={!visible}>
            <div className="col-md-12 my-1">
              <div
                className="statusMsg warning"
                style={{
                  fontStyle: "italic",
                  color: "#746d26",
                  fontSize: "12px",
                }}
              >
                <b>Note :</b> Search will be applied for complete project
                documents...
              </div>
            </div>

            <div className="inline-form singleFeild">
              <label htmlFor="Document">Document Name:</label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                id="Document"
                placeholder={""}
                className="textfield"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  getFilteredDocuments();
                }}
              >
                <FaSearch /> Search
              </button>
            </div>
          </CCollapse>

          <h2 className="mt-2">Document Repository</h2>

          <DocumentsTable
            maxHeight1={maxHeight1}
            data={data}
            rows={rows}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            setCheckedData={setCheckedData}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            checkboxSelect={checkboxSelect}
            setCheckboxSelect={setCheckboxSelect}
            grp1Items={grp1Items}
          />
          <div className=" form-group col-12 btn-container center mt-3">
            {grp1Items[4]?.is_write === true ? (
              <button
                className="btn btn-primary"
                type="Add"
                onClick={() => setAddVisible(true)}
                disabled={addVisisble}
              >
                <FaPlus /> Add
              </button>
            ) : null}

            <button
              className="btn btn-primary"
              type="Move/Copy Files"
              onClick={() => {
                if (selectedIds.length === 0) {
                  setMoveCopyValidationMsg(true);
                  setTimeout(() => {
                    setMoveCopyValidationMsg(false);
                  }, 1000);
                } else {
                  setOpenPopup(true);
                  setTimeout(() => {
                    setMoveCopyValidationMsg(false);
                  }, 1000);
                }
              }}
            >
              <ImCopy /> Move/Copy Files
            </button>
          </div>

          {openPopup ? (
            <DocumentsPopUp
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              projectId={projectId}
              hierarchydata={hierarchydata}
              docFolderId={docFolderId}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              SetDocFolderId={SetDocFolderId}
              setCopySuccessmsg={setCopySuccessmsg}
              setMoveSuccessmsg={setMoveSuccessmsg}
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
                  <div
                    className="statusMsg warning"
                    style={{
                      fontStyle: "italic",
                      color: "#746d26",
                      fontSize: "12px",
                    }}
                  >
                    <b>Note :</b> You can select 10 files at max.
                  </div>
                </div>
                <div className="col-12 p-0">
                  <table
                    className="table table-bordered table-striped"
                    role="grid"
                  >
                    <tbody>
                      <tr>
                        <th style={{ color: "#297AB0" }}>Browse Document</th>
                      </tr>
                      <tr>
                        <td>
                          <input
                            type="file"
                            name="file"
                            id="file"
                            onChange={onFileChangeHandler}
                            accept=".jpg,.jpeg,.xlsx,.pdf,.docx,.txt,.png,.html"
                          />
                          <label className="documenttypes col-md-12">
                            <p className="error-text">
                              Supported file types
                              .pdf,.doc,.csv,.txt,.xlsx,.html,.png{" "}
                            </p>
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
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
