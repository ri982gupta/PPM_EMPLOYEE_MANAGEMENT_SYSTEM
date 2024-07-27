import {
  CCollapse,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
} from "react-icons/fa";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import axios from "axios";
import { BiCheck } from "react-icons/bi";
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
import Loader from "../Loader/Loader";
import { useRef } from "react";
import CustomerDocumentsHierarchy from "./CustomerDocumentsHierarchy";
import CustomerDocumentsTable from "./CustomerDocumentsTable";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function Documents(props) {
  const {
    customerId,
    filteredData,
    mainMenu,
    urlState,
    setButtonState,
    setUrlState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
    buttonState,
  } = props;

  const dataObject = mainMenu.find((item) => item.display_name === "Documents");

  const baseUrl = environment.baseUrl;

  const [docId1, setDocId1] = useState([]);
  const [svn, setSvn] = useState([]);
  const [visible, setVisible] = useState(false);
  const [addVisisble, setAddVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState(false);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [versPopup, setVersPopup] = useState(false);
  const [uid, setUid] = useState(" ");
  const [projectName, setProjectName] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [validationmessage, setValidationMessage] = useState(false);
  const [checkedData, setCheckedData] = useState([]);
  const [hierarchydata, setHierarchyData] = useState([{}]);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [fileName, setFileName] = useState([]);
  const [docId, setDocId] = useState([]);
  const [docFolderId, SetDocFolderId] = useState("");
  const [label, setLabel] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loader, setLoader] = useState(false);
  const [folder, setFolder] = useState([]);
  const [checkboxSelect, setCheckboxSelect] = useState(false);
  const abortController = useRef(null);

  const [defaultExpandedRows, setDefaultExpandedRows] = useState(0);

  const loggedUserId = localStorage.getItem("resId");

  const materialTableElement = document.getElementsByClassName(
    "childTwo"
  );
  const custDocuDyMaxHeight =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  console.log(custDocuDyMaxHeight, "maxHeight1");

  let rows = 25;
  const HierarchyId = Number(docFolderId) - 1;

  const getapiData = () => {
    setLoader(false);
    abortController.current = new AbortController();
    axios({
      url:
        baseUrl +
        `/VendorMS/vendor/getProjectDocuments?DocFolderId=${HierarchyId}`,
      signal: abortController.current.signal,
    }).then((res) => {
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

      setLoader(false);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
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
  }, [HierarchyId]);

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
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);

    axios
      .get(
        baseUrl +
        `/VendorMS/vendor/getFilteredDocuments?ProjectId=${customerId}&SearchVal=${inputValue}`
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
      url:
        baseUrl +
        `/customersms/Customers/getCustomerNames?customerId=${customerId}`,
    }).then(function (response) {
      let resp = response.data;
      setProjectName(resp[0].cust_code);
    });
  };

  useEffect(() => {
    getProjectName();
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

  const handleKeyDown = (event) => {
    if (inputValue.length === 1 && event.keyCode === 8) {
      getapiData();
    } else if (
      inputValue.length === 0 &&
      (event.keyCode === 8 || event.keyCode === 46)
    ) {
      getapiData();
    }
  };

  const downloadEmployeeData = (id, svn_revision) => {
    const link = document.createElement("a");
    link.href =
      baseUrl +
      `/CommonMS/document/downloadFile?documentId=${id}&svnRevision=${svn_revision}`;
    link.click();
  };

  const getProjectDocumentshierarchy = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getCustomerDocumentshierarchy?objectId=${customerId}`,
    }).then(function (response) {
      var resp = response.data;
      if (Array.isArray(resp) && resp.length > 0) {
        setDefaultExpandedRows(resp[0]?.id);
        setHierarchyData(resp);
      } else {
        setHierarchyData();
      }
    });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const getDocumentFileNames = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ContractDocuments/getDocumentFileNames?projectId=${customerId}`,
    }).then(function (response) {
      let resp = response.data;
      setFolder(resp);
    });
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

  useEffect(() => { }, [selectedIds]);

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
          onClick={() =>
            downloadEmployeeData(data.id, data.svn_revision, data.file_name)
          }
        />
        {dataObject.is_write == true ? (
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
        ) : (
          ""
        )}
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
              <span className="">Delete Document</span>
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

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Overview", "Customer Documents"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Financial Plan & Review"
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
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  return (
    <div className="customer-document-screen-margin">
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {validationmessage ? (
        <div className="statusMsg error">
          <AiFillWarning />
          Please enter document name to search
        </div>
      ) : (
        ""
      )}

      {deleteMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          &nbsp; Document Deleted Successfully
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <ul className="tabsContainer">
              <li>
                {/* {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )} */}
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
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
                {/* <span>Planning</span> */}
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
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
                {/* <span>Monitoring</span> */}
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
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
                {/* <span>Financials</span> */}
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
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
            <h2>Customer Documents</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 customCard ">
          <div className="col-md-12">
            <h2>Document Folders</h2>
          </div>

          {
            <CustomerDocumentsHierarchy
              defaultExpandedRows={String(defaultExpandedRows)}
              data={hierarchydata}
              SetDocFolderId={SetDocFolderId}
              setLabel={setLabel}
              customerId={customerId}
              setAddVisible={setAddVisible}
            />
          }
        </div>
        <div className="col-md-9 customCard">
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
                onKeyDown={handleKeyDown}
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

          <CustomerDocumentsTable
            data={data}
            rows={rows}
            custDocuDyMaxHeight={custDocuDyMaxHeight}
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
            dataObject={dataObject}
          />

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
        </div>
      </div>
    </div>
  );
}

export default Documents;
