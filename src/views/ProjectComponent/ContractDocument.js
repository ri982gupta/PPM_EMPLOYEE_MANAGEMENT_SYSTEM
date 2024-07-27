import React, { useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { VscSave } from "react-icons/vsc";
import { ImCross } from "react-icons/im";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Column } from "primereact/column";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import { BiCheck, BiDownload } from "react-icons/bi";
import { AiFillWarning } from "react-icons/ai";
import { makeStyles } from "@material-ui/core";
import RiskAutoComplete from "./RiskAutocomplete";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { Link } from "react-router-dom";
import "../ProjectComponent/ContractDocument.scss";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import ContractDocumentTable from "./ContractDocumentTable";
import { FaSave } from "react-icons/fa";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function ContractDocument(props) {
  const [documnetFolderId, setDocumentFolderId] = useState([]);
  const [key, setKey] = useState(0);
  const {
    projectId,
    grp3Items,
    grp1Items,
    grp2Items,
    grp4Items,
    grp6Items,
    urlState,
    btnState,
    setUrlState,
    setbtnState,
  } = props;
  const dataObject = grp3Items.find(
    (item) => item.display_name === "Contract Documents"
  );
  console.log(grp3Items[1].is_write);
  const baseUrl = environment.baseUrl;
  const [data, setData] = useState([]);
  const [StartDt, setStartDt] = useState();
  const [EndDt, setEndDt] = useState();
  const [resource, setResource] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [logged, setlogged] = useState([]);
  const ref = useRef([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [addMessage, setAddMessage] = useState(false);
  const [uniqueMessage, setUniqueMessage] = useState(false);
  const [vendorNamesArr, setVendorNamesArr] = useState();
  const [fileNamesArr, setFileNamesArr] = useState();
  const [fileName, setFileName] = useState([]);
  let rows = 10;
  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  const [selectedFile, setSelectedFile] = useState([]);
  const [docPopId, setDocPopId] = useState("");
  const [data2, setData2] = useState([]);
  const [orgFileValid, setOrgFileValid] = useState([]);
  const [uniqueMessage1, setUniqueMessage1] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [docId, setDocId] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [docFolderId, setDocFolderId] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [fileVisible, setFileVisible] = useState(false);

  //// -------breadcrumbs-----

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = [
    "Projects",
    "Financials",
    "Contract Documents",
  ];
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
    // setMenusData

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
     // console.log(sortedSubMenus);
      setData2(sortedSubMenus);
      
      data.forEach((item) => {
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
        `/CommonMS/security/authorize?url=/project/sow/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  const getloggeduser = () => {
    axios
      .get(baseUrl + `/ProjectMS/Audit/getloggeduser?loggedId=${loggedUserId}`)
      .then((Response) => {
        let data = Response.data;
        setlogged(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getDocumentFolderId();
  }, []);

  const getDocumentFolderId = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/ContractDocuments/getFolderId?projectId=${projectId}`
      )
      .then((Response) => {
        let data = Response.data;
        setDocumentFolderId(data);
      })
      .catch((error) => console.log(error));
  };

  const initialValue = {
    projectId: projectId,
    frmDt: "",
    toDt: "",
    amount: "",
    documentType: "",
    legalEntityType: "",
    poNumber: "",
    docSignedBy: "",
    ObjectTypeCode: "ProjectSow",
    isActive: "1",
    CreatedBy: loggedUserName,
    CreatedById: loggedUserId,
    lastUpdatedBy: "",
  };

  const [formData, setFormData] = useState(initialValue);

  const getData = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/ContractDocuments/getContractDocuments?projectId=${projectId}`
      )
      .then((res) => {
        const GetData = res.data;
        let dataHeader = [
          {
            lkup_name: "Document Type",
            sow_name: "Document Name",
            date_created: "Created Date",
            created_by: "Uploaded By",
            frm_dt: "Start Date",
            to_dt: "End Date",
            amount: "Amount",
            po_number: "PO Number",
          },
        ];
        setData(dataHeader.concat(GetData));
        setDocId(GetData);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };

  let container = document.createElement("div");
  container.innerHTML = projectData[0]?.currency;

  const resourceFnc = async () => {
    await axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    })
      .then((res) => {
        let manger = res.data;

        setResource(manger);
      })
      .catch((error) => {
        console.log("error :" + error);
      });
  };

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    setFormData((prev) => {
      return { ...prev, [id]: value };
    });
  };

  const issueDeleteHandler = () => {
    setDeletePopup(true);
  };

  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectData(resp);
      })
      .catch(function (response) {});
  };

  const getPONumber = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ContractDocuments/getPONumber?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setVendorNamesArr(resp);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getFileNames = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ContractDocuments/getFileNames?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setFileNamesArr(resp);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    getFileNames();
  }, [projectId]);

  const CreatedDate = (data) => {
    setDocPopId(data?.document_id);

    setDocFolderId(data.doc_folder_id);
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={moment(data.date_created).format("DD-MMM-yyyy-hh:mm:ss A")}
      >
        {data.date_created == null
          ? ""
          : data.date_created == ""
          ? ""
          : moment(data.date_created).format("DD-MMM-yyyy-hh:mm:ss A")}
      </div>
    );
  };

  const DocumentType = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.lkup_name}
      >
        {data.lkup_name}
      </div>
    );
  };
  const UploadedBy = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.created_by}
      >
        {data.created_by}
      </div>
    );
  };
  const FromDate = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={moment(data.frm_dt).format("DD-MMM-yyyy")}
      >
        {data.frm_dt == null
          ? ""
          : data.frm_dt == ""
          ? ""
          : moment(data.frm_dt).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const ToDate = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={moment(data.to_dt).format("DD-MMM-yyyy")}
      >
        {data.to_dt == null
          ? ""
          : data.to_dt == ""
          ? ""
          : moment(data.to_dt).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const Amount = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={
          data.amount === null
            ? ""
            : container.innerHTML + " " + data.amount.toLocaleString("en-IN")
        }
      >
        <span>
          {data.amount === null
            ? ""
            : container.innerHTML + " " + data.amount.toLocaleString("en-IN")}
        </span>
      </div>
    );
  };
  const PONumber = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.po_number}
      >
        {data.po_number}
      </div>
    );
  };
  const DocumentName = (data, docId) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.sow_name}
        style={{ cursor: "pointer", color: "#2E88C5" }}
        onClick={() => {
          issueDeleteHandler();
          setDocId(data);
          setIsTableVisible(false);
          setFileVisible(false);
        }}
      >
        {data.sow_name}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "date_created"
            ? CreatedDate
            : col == "lkup_name"
            ? DocumentType
            : col == "sow_name"
            ? DocumentName
            : col == "created_by"
            ? UploadedBy
            : col == "frm_dt"
            ? FromDate
            : col == "to_dt"
            ? ToDate
            : col == "amount"
            ? Amount
            : col == "po_number"
            ? PONumber
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  const onFileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setFileName(e.target.files[0]?.name);

    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.files[0]?.name,
    }));
  };

  const formData1 = new FormData();
  formData1.append("file", selectedFile);

  const handleClick = (e) => {
    if (
      selectedFile === 0 ||
      selectedFile.length === 0 ||
      selectedFile == undefined
    ) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 5000);
      setUniqueMessage(false);
      setUniqueMessage1(false);
    }

    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidationMessage(true);
        setTimeout(() => {
          setValidationMessage(false);
        }, 5000);
      }
      return;
    }

    let nonNullVendorNamesArr = vendorNamesArr.filter((d) => d !== null);
    let someDataa = nonNullVendorNamesArr.some(
      (d) => d.po_number == formData.poNumber
    );

    let nonNullVendorNamesArr1 = fileNamesArr.filter((d) => d !== null);
    let someDataa1 = nonNullVendorNamesArr1.some((d) => d.sow_name == fileName);

    if (someDataa) {
      let ele = document.getElementsByClassName("unique");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }

      setUniqueMessage(true);
      setValidationMessage(false);
      setTimeout(() => {
        setUniqueMessage(false);
      }, 3000);
      return;
    }

    if (someDataa1) {
      let ele = document.getElementsByClassName("unique1");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }

      setUniqueMessage1(true);
      setValidationMessage(false);
      setTimeout(() => {
        setUniqueMessage1(false);
      }, 3000);
      return;
    }

    axios
      .postForm(
        baseUrl +
          `/ProjectMS/ContractDocuments/SaveAndUpload?docFolderId=${documnetFolderId[0]?.id}&loggedUserId=${loggedUserId}&commitMessage=projectDocuments`,
        {
          file: selectedFile,
          ProjectSow: JSON.stringify({
            projectId: projectId,
            sowName: fileName,
            frmDt: formData.frmDt,
            toDt: formData.toDt,
            amount:
              formData.amount == null || formData.amount == ""
                ? 0
                : formData.amount,
            documentType: formData.documentType,
            poNumber: formData.poNumber,
            legalEntityType: formData.legalEntityType,
            docSignedBy: formData.docSignedBy,
          }),
        },

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        setAddMessage(true);
        setValidationMessage(false);
        getFileNames();
        setSelectedFile(fileName);
        setTimeout(() => {
          setAddMessage(false);
          setUniqueMessage(false);
        }, 3000);
        getData();
        GlobalCancel(ref);
        setStartDt("");
        setEndDt("");
      });
    handleCancel();
    setKey((prevKey) => prevKey + 1);
  };

  function ReviewReport(props) {
    const {
      docId,
      deletePopup,
      setDeletePopup,
      tableData,
      isTableVisible,
      setIsTableVisible,
      fileVisible,
      setFileVisible,
      documnetFolderId,
    } = props;
    const [headerData, setHeaderData] = useState([]);
    const [data, setData] = useState([]);
    const [docFileName, setDocFileName] = useState([]);
    const [docdata, setdocData] = useState([]);
    const [selectedFile1, setSelectedFile1] = useState([]);
    const [filName, setFilName] = useState([]);
    const [updateMessage, setUpdateMessage] = useState(false);
    const [key, setKey] = useState(0);

    const [revision, setRevision] = useState([]);
    const handleClick1 = () => {
      axios
        .get(
          baseUrl + `/ProjectMS/ContractDocuments/getPopupData?docid=${docdata}`
        )
        .then((response) => {
          let headerData = [
            {
              app_revision: "Older Versions",
              updatedBy: "Updated By",
            },
          ];
          setTableData(headerData.concat(response.data));
          setIsTableVisible(!isTableVisible);
        })
        .catch((error) => {
          console.error("Error fetching table data:", error);
        });
    };

    const downloadEmployeeData = (docId) => {
      const docUrl =
        baseUrl +
        `/VendorMS/vendor/downloadFile?documentId=${data}&svnRevision=${revision}`;

      axios({
        url: docUrl,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", docFileName); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    };

    useEffect(() => {
      setData(docId.document_id);
      setdocData(docId.document_id);
      setRevision(docId.svn_revision);
      setDocFileName(docId.file_name);
    }, [docId]);

    const useStyles = makeStyles({
      dialog: {
        position: "absolute",
        top: "250px",
        minHeight: "18%",
      },
      textField: {
        border: "1px solid rgb(159 13 13)",
      },
    });

    const classes = useStyles();

    const AppRevisionAlign = (tableData) => {
      const downloadEmployeeData1 = (tableData) => {
        const docUrl =
          baseUrl +
          `/VendorMS/vendor/downloadFile?documentId=${tableData.document_id}&svnRevision=${tableData.svn_revision}`;

        axios({
          url: docUrl,
          method: "GET",
          responseType: "blob",
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", tableData.file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      };
      return (
        <div align="center">
          <a
            className="linkSty"
            onClick={() => downloadEmployeeData1(tableData)}
          >
            <ul style={{ textDecoration: "underLine", marginBottom: "0px" }}>
              {tableData.app_revision.toFixed(1)}
            </ul>
          </a>
        </div>
      );
    };

    const updatedByAllign = (tableData) => {
      return <div align="center">{tableData.updatedBy}</div>;
    };

    const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
      return (
        <Column
          key={col}
          body={
            col == "app_revision"
              ? AppRevisionAlign
              : col == "updatedBy"
              ? updatedByAllign
              : ""
          }
          field={col}
          header={headerData[col]}
        />
      );
    });

    useEffect(() => {
      if (data && data.length > 0) {
        setHeaderData(JSON.parse(JSON.stringify(data[0])));
      }
    }, [data]);

    const [docValidation, setDocValidation] = useState(false);
    const [fileValidation, setFileValidation] = useState(false);

    const onFileChangeHandler1 = (e) => {
      setSelectedFile1(e.target.files[0]);
      setFilName(e.target.files[0].name);
    };

    const handleClick2 = () => {
      if (selectedFile1.length === 0) {
        setDocValidation(false);
        setFileValidation(true);
        setTimeout(() => {
          setFileValidation(false);
        }, 3000);
      } else if (selectedFile1 && docFileName !== filName) {
        setDocValidation(true);
        setTimeout(() => {
          setDocValidation(false);
        }, 3000);
        setFileValidation(false);
      } else {
        axios
          .postForm(
            baseUrl +
              `/ProjectMS/ContractDocuments/upload?fileRevision=1.0&folderId=${documnetFolderId[0]?.id}&loggedUserId=${loggedUserId}`,

            { files: selectedFile1 },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            setUpdateMessage(true);
            setDocValidation(false);
            setTimeout(() => {
              setUpdateMessage(false);
            }, 3000);
            setKey((prevKey) => prevKey + 1);
            setSelectedFile1([]);
          });
      }
    };

    return (
      <div className="reviewLogDeletePopUp">
        <CModal
          backdrop="static"
          visible={deletePopup}
          alignment="center"
          size="md"
          className="reviewLogDeletePopUp"
          onClose={() => setDeletePopup(false)}
          classes={{
            paper: classes.dialog,
          }}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Contract Document Details</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody
            style={{
              border: "1px solid #ccc",
              padding: "5px 10px 20px",
            }}
          >
            {fileValidation ? (
              <div className="statusMsg error">
                <AiFillWarning />
                {"Please Select a file to update"}
              </div>
            ) : (
              ""
            )}
            {docValidation ? (
              <div className="statusMsg error">
                <AiFillWarning />
                {"Please Select the same file to update"}
              </div>
            ) : (
              ""
            )}
            {updateMessage ? (
              <div className="statusMsg success">
                <BiCheck />
                {filName} {"updated successfully."}
              </div>
            ) : (
              ""
            )}
            <div style={{ border: "1px solid #cdcdcd" }}>
              <h3
                style={{
                  fontSize: "initial",
                  border: "1px solid #cdcdcd",
                  color: "#297AB0",
                  padding: "5px",
                }}
              >
                Document
              </h3>
              <div>
                <a
                  className="linkSty"
                  onClick={() => {
                    downloadEmployeeData(docId);
                  }}
                >
                  <ul
                    style={{
                      textDecoration: "underLine",
                      marginBottom: "0px",
                      padding: "5px",
                    }}
                    key={docId.document_id}
                  >
                    <BiDownload />
                    &nbsp;{docId.sow_name}
                  </ul>
                </a>
                <div style={{ padding: "5px", marginTop: "-14px" }}>
                  <a className="linkSty">
                    <ul
                      style={{
                        textDecoration: "underLine",
                        marginBottom: "0px",
                        display: "inline",
                      }}
                    >
                      {grp3Items[1].is_write == true ? (
                        <span
                          onClick={() => {
                            setIsTableVisible(false);

                            setFileVisible(true);
                          }}
                        >
                          Update{" "}
                        </span>
                      ) : (
                        ""
                      )}
                    </ul>
                  </a>
                  {dataObject?.is_write == true ? (
                    <span style={{ color: "black" }}> &nbsp;|&nbsp;</span>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => {
                      handleClick1();
                      setIsTableVisible(false);
                      setFileVisible(false);
                    }}
                    style={{
                      display: "inline",
                      fontSize: "11px",
                      padding: "0px 7px",
                      // boarder: "1px solid black",
                      borderRadius: "3px",
                      textDecoration: "none !important",
                      border: "1px solid black",
                    }}
                  >
                    Version History
                  </button>
                </div>
                {isTableVisible ? (
                  <div className="document">
                    <ContractDocumentTable
                      rows={10}
                      data={tableData}
                      dynamicColumns={dynamicColumns}
                      headerData={headerData}
                      setHeaderData={setHeaderData}
                    />
                  </div>
                ) : (
                  ""
                )}
                {fileVisible && (
                  <div
                    className="row mb-1"
                    style={{
                      border: "1px solid #cdcdcd",
                      padding: "8px",
                      marginLeft: "3px",
                      marginRight: "3px",
                      marginTop: "-1px",
                    }}
                  >
                    <div className="col-3">
                      <input
                        key={key}
                        type="file"
                        name="file"
                        className="contractDocument"
                        id="file"
                        onChange={onFileChangeHandler1}
                      />
                    </div>
                    <div className="col-2">
                      <input
                        type="text"
                        style={{
                          marginTop: "4px",
                          marginLeft: "18px",
                          width: "69px !important;",
                        }}
                        placeholder="version"
                      />
                    </div>
                    <div className="col-3">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        title="Update"
                        style={{
                          marginLeft: "16px",
                          height: "23px",
                          marginTop: "4px",
                        }}
                        onClick={handleClick2}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }

  const handleCancel = () => {
    setKey((prevKey) => prevKey + 1);
    setFormData("");
    setSelectedFile(0);
    setStartDt("");
    setEndDt("");
    let ele = document.getElementsByClassName("cancel");

    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";

      if (ele[index].classList.contains("reactautocomplete")) {
        ele[
          index
        ].children[0].children[0].children[0].children[0].children[0].children[1]?.click();
      }
    }
    GlobalCancel(ref);
  };

  const handleClear = () => {
    setFormData((prev) => ({ ...prev, docSignedBy: null }));
  };

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const onChangeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, docSignedBy: value }));
  };

  useEffect(() => {
    getData();
    resourceFnc();
    getloggeduser();
    getProjectOverviewData();
    getPONumber();
    // getDocumentFolderId();
  }, []);

  return (
    <div>
      {uniqueMessage1 ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> {fileName} already exists in Project/{projectId}
          /SOW/
        </div>
      ) : (
        ""
      )}
      {validationMessage ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Please select the valid values for highlighted
            fields{" "}
          </span>
        </div>
      ) : (
        ""
      )}
      {addMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Project Contract Document saved successfully."}
        </div>
      ) : (
        ""
      )}
      {uniqueMessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please Give Unique PO Number
        </div>
      ) : (
        ""
      )}

      <div className="col-md-12 ">
        <div className="pageTitle">
          <div className="childOne">
            {/* <h2>{list.projectName}</h2> */}
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

          {projectData.map((list) => (
            <div className="childTwo">
              <h2>Contract Documents</h2>
            </div>
          ))}
          <div className="childThree"></div>
        </div>
      </div>

      {grp3Items[1].is_write == true ? (
        <div className="group mb-3 customCard">
          <h2>Add Contract Document</h2>
          <div className="group-content row">
            <div className="form-group col-md-8 mb-2" id="UploadDocument">
              <label htmlFor="updateDocument">
                Upload Document&nbsp;
                <span className="required error-text">*</span>
              </label>
              <input
                key={key}
                type="file"
                name="file"
                className="fileUpload unique1 form-control"
                id="file"
                onChange={onFileChangeHandler}
              />
            </div>
            <div className="form-group col-md-4 mb-2">
              <label htmlFor="documentType">
                Document Type&nbsp;
                <span className="required error-text">*</span>
              </label>
              <select
                className="text cancel"
                id="documentType"
                name="documentType"
                onChange={(e) => {
                  const { value, id } = e.target;
                  value == "386" ||
                  value == "387" ||
                  value == "384" ||
                  value == "385"
                    ? GlobalCancel(ref)
                    : "";
                  setFormData({ ...formData, [id]: value });
                }}
                ref={(ele) => {
                  ref.current[formData.documentType == 385 ? "" : 0] = ele;
                }}
              >
                <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                <option value="386">Email</option>
                <option value="387">Others</option>
                <option value="385">PO</option>
                <option value="384">SOW</option>
              </select>
            </div>
            {formData.documentType == 385 ? (
              <div className="form-group col-md-2 mb-2">
                <label htmlFor="startDate">
                  PO Number&nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield cancel"
                  ref={(ele) => {
                    ref.current[formData.documentType == 385 ? 0 : ""] = ele;
                  }}
                >
                  <input
                    type="text"
                    name="poNumber"
                    id="poNumber"
                    className="unique cancel"
                    // maxLength={30}
                    // onKeyPress={(e) => {
                    //   const charCode = e.which || e.keyCode;
                    //   const char = String.fromCharCode(charCode);
                    //   const isNumeric = /^\d$/.test(char);
                    //   if (!isNumeric) {
                    //     e.preventDefault();
                    //   }
                    // }}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="form-group col-md-2 mb-2">
              <label htmlFor="startDate">
                Start Date{" "}
                {formData.documentType == "384" ||
                formData.documentType == "" ||
                formData.documentType == undefined ||
                formData.documentType == "385" ? (
                  <span className="required error-text">&nbsp;*</span>
                ) : (
                  ""
                )}
              </label>
              <div
                className="datepicker"
                ref={(ele) => {
                  ref.current[
                    formData.documentType == 385
                      ? 1
                      : formData.documentType == 386
                      ? ""
                      : formData.documentType == 387
                      ? ""
                      : 1
                  ] = ele;
                }}
              >
                <DatePicker
                  name="frmDt"
                  selected={StartDt}
                  id="frmDt"
                  className="err cancel"
                  dateFormat="dd-MMM-yyyy"
                  placeholderText="Start Date"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      ["frmDt"]: moment(e).format("yyyy-MM-DD"),
                    }));
                    setStartDt(e);
                  }}
                  onKeyDown={(e) => {}}
                  autoComplete="false"
                />
              </div>
            </div>
            <div className="form-group col-md-2 mb-2">
              <label htmlFor="endDate">
                End Date{" "}
                {formData.documentType == "384" ||
                formData.documentType == "" ||
                formData.documentType == undefined ||
                formData.documentType == "385" ? (
                  <span className="required error-text">&nbsp;*</span>
                ) : (
                  ""
                )}
              </label>
              <div
                className="datepicker cancel"
                ref={(ele) => {
                  ref.current[
                    formData.documentType == 385
                      ? 2
                      : formData.documentType == 386
                      ? ""
                      : formData.documentType == 387
                      ? ""
                      : 2
                  ] = ele;
                }}
              >
                <DatePicker
                  name="toDt"
                  selected={EndDt}
                  id="toDt"
                  minDate={new Date(formData.frmDt)}
                  className="err cancel"
                  dateFormat="dd-MMM-yyyy"
                  placeholderText="End Date"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      ["toDt"]: moment(e).format("yyyy-MM-DD"),
                    }));
                    setEndDt(e);
                  }}
                  onKeyDown={(e) => {}}
                  autoComplete="false"
                />
              </div>
            </div>
            <div className="form-group col-md-2 mb-2">
              <label htmlFor="amount">
                Amount{" "}
                {formData.documentType == "384" ||
                formData.documentType == "" ||
                formData.documentType == undefined ||
                formData.documentType == "385" ? (
                  <span className="required error-text">&nbsp;*</span>
                ) : (
                  ""
                )}
              </label>
              <div
                className="textfield cancel"
                ref={(ele) => {
                  ref.current[
                    formData.documentType == 385
                      ? 3
                      : formData.documentType == 386
                      ? ""
                      : formData.documentType == 387
                      ? ""
                      : 3
                  ] = ele;
                }}
              >
                <input
                  name="amount"
                  type="text"
                  className="cancel"
                  id="amount"
                  placeholder="Amount"
                  required
                  maxLength={10}
                  onKeyDown={(e) =>
                    e.keyCode &&
                    (e.keyCode <= 47 || e.keyCode >= 58) &&
                    e.keyCode != 8 &&
                    e.preventDefault()
                  }
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group col-md-2 mb-2">
              <label htmlFor="legalEntityType">Legal Entity</label>
              <select
                id="legalEntityType"
                name="legalEntityType"
                className="cancel"
                onChange={(e) => {
                  const { value, id } = e.target;
                  setFormData({ ...formData, [id]: value });
                }}
              >
                <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                <option value="3">Prolifics Corporation Limited</option>
                <option value="4">Prolifics Inc</option>
                <option value="5">Prolifics Testing Inc.</option>
                <option value="6">Prolifics Canada Inc.</option>
                <option value="7">Prolifics Application Services Inc.</option>
              </select>
            </div>
            <div className="form-group col-md-4 mb-2">
              <label htmlFor="signedBy">Signed By [Company Side]</label>
              <div
                className="autoComplete-container cancel error autocomplete reactautocomplete"
                id="autocomplete reactautocomplete"
              >
                <RiskAutoComplete
                  name="docSignedBy"
                  id="docSignedBy"
                  value="0"
                  riskDetails={resource}
                  getData={resourceFnc}
                  setFormData={setFormData}
                  onChangeHandler={onChangeHandler}
                  onClear={handleClear}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* ///////////////////////////////////Save & Cancel///////////////////////////////////// */}
      {dataObject?.is_write == true ? (
        <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
          <button
            className="btn btn-primary"
            type="submit"
            onClick={() => handleClick()}
          >
            <FaSave /> Save
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            <ImCross fontSize={"11px"} /> Cancel
          </button>
        </div>
      ) : (
        ""
      )}
      <div className="row group mb-2 customCard">
        <h2 className="col-md-12 mx-3">Contract Document List</h2>
        <div className="col-md-12">
          <CellRendererPrimeReactDataTable
            data={data}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            rows={rows}
          />
        </div>
      </div>
      {deletePopup ? (
        <ReviewReport
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
          docId={docId}
          tableData={tableData}
          isTableVisible={isTableVisible}
          setIsTableVisible={setIsTableVisible}
          fileVisible={fileVisible}
          setFileVisible={setFileVisible}
          documnetFolderId={documnetFolderId}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default ContractDocument;
