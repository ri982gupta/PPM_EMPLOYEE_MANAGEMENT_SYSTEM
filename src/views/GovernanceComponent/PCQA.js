import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import {
  FaCaretDown,
  FaDownload,
  FaPlus,
  FaSave,
  FaSearch,
} from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { environment } from "../../environments/environment";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import "./PCQA.scss";
import { FilterMatchMode } from "primereact/api";
import Loader from "../Loader/Loader";
import { CCollapse } from "@coreui/react";
import moment from "moment";
import { useEffect } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiCheck } from "react-icons/bi";
import PCQAChart from "./PCQAChart";
import { InputText } from "primereact/inputtext";
import { ColumnGroup } from "primereact/columngroup";
import { Column } from "ag-grid-community";
import { DataTable } from "primereact/datatable";
import { Checkbox } from "primereact/checkbox";
import { useRef } from "react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import { AiFillWarning } from "react-icons/ai";
function PCQA() {
  var date = new Date();
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  var BillingFirstDate = moment(startDate).format("yyyy-MM-DD");
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedProjectSource, setSelectedProjectSource] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const HelpPDFName = "PCQAGovernance.pdf";
  const Header = "PCQA Help";
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectedProjectStage, setSelectedProjectStage] = useState([
    { label: "In progress", value: 1 },
  ]);
  const [loader, setLoader] = useState(false);
  const [dateHighlight, setDateHighlight] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [coustomOptions, setCoustomOptions] = useState([]);
  const [contractOptions, setContractOptions] = useState([]);
  const [auditTypes, setAuditTypes] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedAuditStatus, setSelectedAuditStatus] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [savemsg, setSavemsg] = useState(false);
  const [files, setFiles] = useState(null);
  const [schduleData, setSchduleData] = useState({});
  const [resource, setResource] = useState([]);
  const [openTrend, setOpenTrend] = useState(false);
  const [projectId, setProjectId] = useState(0);
  const [graphData, setGraphData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [validator, setValidator] = useState(false);
  const [fileUploadMessage, setFileUploadMessage] = useState(false);
  const [showtable, setShowTable] = useState(false);
  const [validateId, setValidDateID] = useState([]);
  const [dat, setDat] = useState(0);
  const [project, setProject] = useState([]);
  // const [isInitialLoad, setIsInitialLoad] = useState(true);
  const projectSourceOptions = [
    { label: "PPM", value: "PPM" },
    { label: "Projector", value: "Projector" },
  ];

  const resourceFnc = async () => {
    await axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then((res) => {
      let manger = res.data;
      setResource(manger);
    });
  };

  //State variable to set the selected row
  const [selectedRow, setSelectedRow] = useState(null);

  const [showCompletedPopUp, setCompletedPopUp] = useState(true);

  const handleClose = () => setCompletedPopUp(false);
  const handleShow = () => setCompletedPopUp(true);

  const handleCheckboxChange = () => {
    setRowChecked(!rowChecked);
    setRowData((prev) => {
      const updatedRowData = { ...prev };
      if (!rowChecked) {
        updatedRowData[rowData.id] = {
          ...updatedRowData[rowData.id],
          id: rowData.id,
          auditType: rowData.liveAuditType,
          auditStatus: rowData.status,
          auditedDt: rowData.liveAuditedDate,
        };
      }
      return updatedRowData;
    });
    convertToSchduleData(rowData);
  };

  const checkBoxTooltip = (rowData) => {
    const pastVal = rowData.id;
    const auditVal = rowData.auditType;
    const statusVal = rowData.auditStatus;

    const shouldCheckCheckbox =
      auditVal !== undefined || statusVal !== undefined;
    const [rowChecked, setRowChecked] = useState(shouldCheckCheckbox);

    useEffect(() => {
      setRowChecked(shouldCheckCheckbox);
    }, [shouldCheckCheckbox, auditVal, statusVal]);
    return <Checkbox checked={rowChecked} onChange={handleCheckboxChange} />;
  };

  const projectDetailsTooltip = (rowData) => {
    return (
      <div className="d-flex">
        <div className="legendContainer">
          <div
            className={
              rowData.status == 483 || rowData.status == 581
                ? "legend orange"
                : "legend lightgreen"
            }
          >
            <div className="legendCircle"></div>
          </div>
          <div className=" yellowColorPCQA">
            <div className="legendCircle"></div>
          </div>
        </div>
        <div className="ellipsis">
          <Link
            target="_blank"
            to={`/project/Overview/:${rowData.id}`}
            className="linkSty"
            title={rowData.projectName}
            style={{ cursor: "pointer" }}
          >
            {rowData.projectName}
          </Link>
        </div>
      </div>
    );
  };

  const customerNameTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.customer}
      >
        {rowData.customer}
      </div>
    );
  };

  const auditTypeTooltip = (rowData) => {
    const title = scheduleTypes.map((val) => {
      if (rowData.pastAuditType == val.value) {
        return val.label;
      } else {
        return "";
      }
    });

    const nonNullValue = title.filter((value) => value !== "");
    return (
      <div className="ellipsis" data-toggle="tooltip" title={nonNullValue}>
        {scheduleTypes.map((val) => {
          if (rowData.pastAuditType == val.value) {
            return val.label;
          }
        })}
      </div>
    );
  };

  const plannedDateTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={
          rowData.plandStartDate != null
            ? moment(rowData.plandStartDate).format("DD-MMM-YYYY")
            : ""
        }
      >
        {rowData.plandStartDate != null
          ? moment(rowData.plandStartDate).format("DD-MMM-YYYY")
          : ""}
      </div>
    );
  };

  const actualDateTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={
          rowData.actualStartDate != null
            ? moment(rowData.actualStartDate).format("DD-MMM-YYYY")
            : ""
        }
      >
        {rowData.actualStartDate != null
          ? moment(rowData.actualStartDate).format("DD-MMM-YYYY")
          : ""}
      </div>
    );
  };

  const auditedDateTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={
          rowData.pastAuditedDate != null
            ? moment(rowData.pastAuditedDate).format("DD-MMM-YYYY")
            : ""
        }
      >
        {rowData.pastAuditedDate != null
          ? moment(rowData.pastAuditedDate).format("DD-MMM-YYYY")
          : ""}
      </div>
    );
  };

  const auditorNameTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.auditName}
      >
        {rowData.auditName}
      </div>
    );
  };

  const trendClickHander = (projectId, pastAuditType) => {
    setDat(pastAuditType);
    setOpenTrend(true);
    setProjectId(projectId);
  };

  const trendTooltip = (rowData) => {
    return (
      <div>
        <b>
          <Link
            onClick={() => {
              trendClickHander(rowData.projectId, rowData.liveAuditType);
            }}
          >
            {rowData.Result === null
              ? ""
              : rowData.liveAuditType === 477
              ? `${rowData.Result}%`
              : rowData.Result}
          </Link>
        </b>
      </div>
    );
  };

  const reportsTooltip = (rowData) => {
    return rowData.documentId ? (
      <FaDownload
        color="blue"
        cursor="pointer"
        onClick={() => downloadEmployeeData(rowData.documentId)}
      />
    ) : (
      <FaDownload style={{ opacity: 0.5 }} disabled /> // Disabled (boolean value is false)
    );
  };

  const scheduleTypes = [
    { label: "CMMI", value: "1285" },
    { label: "IQA", value: "478" },
    { label: "ISMS", value: "1272" },
    { label: "ISO", value: "1284" },
    { label: "QCR", value: "477" },
  ];

  const handleDropdownChange = (rowData, selectedAudit) => {
    setRowData((prev) => {
      const updatedRowData = { ...prev };
      // Check if 'auditStatus' is not present or undefined
      if (!updatedRowData[rowData.id]?.auditStatus) {
        updatedRowData[rowData.id] = {
          ...updatedRowData[rowData.id],
          id: rowData.id,
          auditType: +selectedAudit.value,
          auditStatus: rowData.status,
          auditedDt:
            rowData.scheduledDate === null ? "" : rowData.scheduledDate,
        };
      } else {
        updatedRowData[rowData.id] = {
          ...updatedRowData[rowData.id],
          id: rowData.id,
          auditType: selectedAudit.value,
        };
      }
      return updatedRowData;
    });
  };

  const typeTooltip = (rowData) => {
    const matchingType = scheduleTypes.find(
      (val) => rowData.liveAuditType == val.value
    );
    const [selectedAudit, setSelectedAudit] = useState(
      matchingType ? matchingType.label : "QCR"
    );
    return (
      <select
        id={`auditType-${rowData.id}`}
        onChange={(e) => {
          const matchingTypeValue = scheduleTypes.find(
            (val) => e.target.value == val.label
          );
          setSelectedAudit(matchingTypeValue ? matchingTypeValue.label : "");
          handleDropdownChange(rowData, matchingTypeValue);
        }}
        onClick={(e) => e.stopPropagation()}
        value={selectedAudit}
        style={{ width: "100%" }}
      >
        {scheduleTypes?.map((Item, index) => (
          <option key={index} value={Item.id}>
            {Item.label}
          </option>
        ))}
      </select>
    );
  };

  const statusOptions = [
    { label: "To be Scheduled", value: "480" },
    { label: "Scheduled", value: "482" },
    { label: "Audited", value: "1283" },
    { label: "Delayed", value: "483" },
    { label: "Completed", value: "479" },
    { label: "Out of Scope", value: "581" },
  ];
  const [dateId1, setDateId] = useState("");

  const statusTooltip = (rowDatainfo) => {
    const [rowCompletedData, setRowCompletedData] = useState({});
    const [qcrRowCompletedData, setQcrRowCompletedData] = useState({});
    const selectedStat = statusOptions.find(
      (val) => rowDatainfo.status == val.value
    );
    const [selectedStatus, setSelectedStatus] = useState(
      selectedStat ? selectedStat.label : ""
    );
    const [showCompletedPopUp, setCompletedPopUp] = useState(false);
    var selectedFile;

    const handleClose = () => {
      setCompletedPopUp(false);
      setRowCompletedData({});
    };
    const handleShow = () => setCompletedPopUp(true);
    const [show, setShow] = useState(false);
    const handleQcrClose = () => setShow(false);
    const handleQcrShow = () => setShow(true);

    function isObjectEmpty(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          return false;
        }
      }
      return true;
    }
    const handleDropdownChange = (rowinfo, e) => {
      const numericPart = e.target.id.split("-")[1];
      const selectedValue = e.target.value;
      let statusValue;
      switch (selectedValue) {
        case "Out of Scope":
          statusValue = "581";
          break;
        case "Delayed":
          statusValue = "483";
          break;
        case "Audited":
          statusValue = "1283";
          break;
        case "To be Scheduled":
          statusValue = "480";
          break;
        case "Scheduled":
          statusValue = "482";
          break;
        case "Completed":
          statusValue = "479";
          break;
      }
      const updatedTableData = tableData.map((row) => {
        if (
          row.id === parseInt(numericPart) &&
          e.target.value === "Completed"
        ) {
          return {
            ...row,
            liveAuditedDate: moment(new Date()).format(
              "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
            ),
            scheduledDate: moment(new Date()).format(
              "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
            ),
            status: 479,
          };
        } else {
          return {
            ...row,
            status: statusValue,
          };
        }
      });

      setTableData([...updatedTableData]);
      setDateId(rowinfo.id);
      setSelectedStatus(e.target.value);
      const selectedStatus = statusOptions.find(
        (val) => val.label === e.target.value
      );
      const status = selectedStatus?.value;
      setRowData((prev) => {
        const updatedRowData = { ...prev };
        // Check if 'auditStatus' is not present or undefined
        if (!updatedRowData[rowinfo.id]?.auditType) {
          updatedRowData[rowinfo.id] = {
            ...updatedRowData[rowinfo.id],
            id: rowinfo.id,
            auditType:
              rowinfo.liveAuditType === null ? 477 : +rowinfo.liveAuditType,
            auditStatus: status,
            auditedDt:
              rowinfo.scheduledDate === null ? "" : rowinfo.scheduledDate,
            // auditDate: e.target.value === "Completed" ? moment(new Date()).format("DD-MMM-YYYY") : "",
          };
        } else {
          updatedRowData[rowinfo.id] = {
            ...updatedRowData[rowinfo.id],
            id: rowinfo.id,
            auditStatus: status,
            // auditDate: e.target.value === "Completed" ? moment(new Date()).format("DD-MMM-YYYY") : "",
          };
        }
        if (e.target.value === "Completed") {
          if (updatedRowData[rowinfo.id]?.auditType == 477) {
            handleQcrShow();
          } else {
            if (
              isObjectEmpty(rowinfo)
                ? rowinfo.liveAuditType == 477
                : updatedRowData[rowinfo.id]?.auditType == 477
            ) {
              handleQcrShow();
            } else {
              handleShow();
            }
          }
        }
        return updatedRowData;
      });
    };

    const handleCompletedChange = (event) => {
      if (event.target.name === "fileName") {
        selectedFile = event.target.files[0];
        setFiles(selectedFile);
        setRowCompletedData((prev) => {
          const updatedRowData = { ...prev };
          updatedRowData[rowDatainfo.id] = {
            ...updatedRowData[rowDatainfo.id],
            [event.target.name]: selectedFile,
          };
          return updatedRowData;
        });
      } else {
        setRowCompletedData((prev) => {
          const updatedRowData = { ...prev };
          updatedRowData[rowDatainfo.id] = {
            ...updatedRowData[rowDatainfo.id],
            auditId: "1",
            projectId: rowDatainfo?.projectId,
            auditType: rowDatainfo?.liveAuditType,
            auditStatus: "479",
            auditDate: moment(new Date()).format("DD-MM-yyyy"),
            [event.target.name]: event.target.value,
          };
          return updatedRowData;
        });
      }
    };

    const handleQCRCompletedChange = (event) => {
      if (event.target.name === "fileName") {
        selectedFile = event.target.files[0];
        setFiles(selectedFile);
        setQcrRowCompletedData((prev) => {
          const updatedRowData = { ...prev };
          updatedRowData[rowDatainfo.id] = {
            ...updatedRowData[rowDatainfo.id],
            [event.target.name]: selectedFile,
          };
          return updatedRowData;
        });
      } else {
        setQcrRowCompletedData((prev) => {
          const updatedRowData = { ...prev };
          updatedRowData[rowDatainfo.id] = {
            ...updatedRowData[rowDatainfo.id],
            auditId: "1",
            projectId: rowDatainfo.projectId,
            auditType: rowDatainfo.liveAuditType,
            auditStatus: "479",
            auditDate: moment(new Date()).format("DD-MM-yyyy"),
            [event.target.name]: event.target.value,
          };
          return updatedRowData;
        });
      }
    };

    // Function to handle the save of Audit details
    const saveHandler = () => {
      var data = [];

      if (
        rowData[rowDatainfo.id]?.auditType === "477" ||
        rowData[rowDatainfo.id]?.auditType === 477
      ) {
        data = {
          auditHistory: {
            0: {
              auditId: qcrRowCompletedData[rowDatainfo.id].auditId,
              projectId: qcrRowCompletedData[rowDatainfo.id].projectId,
              auditorName: qcrRowCompletedData[rowDatainfo.id].auditorName,
              percentage: qcrRowCompletedData[rowDatainfo.id].percentage,
              auditee: qcrRowCompletedData[rowDatainfo.id].auditee,
              auditType: qcrRowCompletedData[rowDatainfo.id].auditType,
              auditStatus: qcrRowCompletedData[rowDatainfo.id].auditStatus,
              auditDate: moment(
                qcrRowCompletedData[rowDatainfo.id].auditDate,
                "DD-MM-YYYY"
              ).format("YYYY-MMM-DD"),
              fileName: qcrRowCompletedData[rowDatainfo.id].fileName?.name
                ? qcrRowCompletedData[rowDatainfo.id].fileName?.name
                : "",
            },
          },
        };
      } else {
        data = {
          auditHistory: {
            0: {
              auditId: rowCompletedData[rowDatainfo.id].auditId,
              projectId: rowCompletedData[rowDatainfo.id].projectId,
              major: rowCompletedData[rowDatainfo.id].major,
              recom: rowCompletedData[rowDatainfo.id].recom,
              minor: rowCompletedData[rowDatainfo.id].minor,
              medium: rowCompletedData[rowDatainfo.id].medium,
              auditorName: rowCompletedData[rowDatainfo.id].auditorName,
              auditee: rowCompletedData[rowDatainfo.id].auditee,
              auditType: rowCompletedData[rowDatainfo.id].auditType,
              auditStatus: rowCompletedData[rowDatainfo.id].auditStatus,
              auditDate: moment(
                rowCompletedData[rowDatainfo.id].auditDate,
                "DD-MM-YYYY"
              ).format("YYYY-MMM-DD"),
              fileName: rowCompletedData[rowDatainfo.id].fileName?.name
                ? rowCompletedData[rowDatainfo.id].fileName?.name
                : "",
            },
          },
        };
      }
      axios
        .postForm(
          baseUrl +
            `/governancems/PCQA/saveAuditHistory?userId=${loggedUserId}`,
          {
            data: JSON.stringify(data),
            files:
              rowData[rowDatainfo.id]?.auditType === "477" ||
              rowData[rowDatainfo.id]?.auditType === 477
                ? qcrRowCompletedData[rowDatainfo.id].fileName
                  ? qcrRowCompletedData[rowDatainfo.id].fileName
                  : ""
                : rowCompletedData[rowDatainfo.id].fileName
                ? rowCompletedData[rowDatainfo.id].fileName
                : "",
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          if (res.data.Msg === "An unexpected error occurred") {
            setFileUploadMessage(true);
            setTimeout(() => {
              setFileUploadMessage(false);
            }, 3000);
            return;
          }
          const responseData = res.data;
          setRowCompletedData([]);
          setQcrRowCompletedData([]);
          selectedFile = [];
          setTimeout(() => {
            setCompletedPopUp(false);
            handleClose();
            handleQcrClose();
          }, 1000);
        });
    };

    return (
      <>
        <select
          id={`auditStatus-${rowDatainfo.id}`}
          onChange={(e) => handleDropdownChange(rowDatainfo, e)}
          onClick={(e) => e.stopPropagation()}
          value={selectedStatus}
          style={{ width: "100%" }}
        >
          {statusOptions?.map((Item, index) => (
            <option key={index} value={Item.id}>
              {Item.label}
            </option>
          ))}
        </select>
        <Modal
          show={showCompletedPopUp}
          onHide={handleClose}
          size="xl"
          style={{ paddingTop: "25px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Audit Details :</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {fileUploadMessage ? (
                <div className="statusMsg error">
                  <span>
                    <IoWarningOutline /> File is already exist. Please upload
                    another file
                  </span>
                </div>
              ) : (
                ""
              )}
              <table className="darkHeader toHead PopUP-table-type-ISMS">
                <thead>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Major</th>
                    <th scope="col">Minor</th>
                    <th scope="col">Observations</th>
                    <th scope="col">Recommendations</th>
                    <th scope="col">Auditor Name</th>
                    <th scope="col">Auditee</th>
                    <th scope="col">Reports</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>
                      <input
                        type="text"
                        name="major"
                        onKeyDown={(e) => {
                          const key = e.key;
                          const isNumber = /^[0-9]$/.test(key);
                          const isDecimal = key === ".";
                          if (!isNumber && !isDecimal && key !== "Backspace") {
                            e.preventDefault();
                          }
                        }}
                        onChange={handleCompletedChange}
                        value={rowCompletedData[rowDatainfo.id]?.major}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="minor"
                        onKeyDown={(e) => {
                          const key = e.key;
                          const isNumber = /^[0-9]$/.test(key);
                          const isDecimal = key === ".";
                          if (!isNumber && !isDecimal && key !== "Backspace") {
                            e.preventDefault();
                          }
                        }}
                        onChange={handleCompletedChange}
                        value={rowCompletedData[rowDatainfo.id]?.minor}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="medium"
                        onKeyDown={(e) => {
                          const key = e.key;
                          const isNumber = /^[0-9]$/.test(key);
                          const isDecimal = key === ".";
                          if (!isNumber && !isDecimal && key !== "Backspace") {
                            e.preventDefault();
                          }
                        }}
                        onChange={handleCompletedChange}
                        value={rowCompletedData[rowDatainfo.id]?.medium}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="recom"
                        onKeyDown={(e) => {
                          const key = e.key;
                          const isNumber = /^[0-9]$/.test(key);
                          const isDecimal = key === ".";

                          if (!isNumber && !isDecimal && key !== "Backspace") {
                            e.preventDefault();
                          }
                        }}
                        onChange={handleCompletedChange}
                        value={rowCompletedData[rowDatainfo.id]?.recom}
                      />
                    </td>
                    <td>
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          className="AutoComplete"
                          items={resource}
                          type="text"
                          name="auditorName"
                          id="auditorName"
                          disabled
                          fuseOptions={{ keys: ["id", "name"] }}
                          resultStringKeyName="name"
                          resource={resource}
                          placeholder="Type minimum 3 characters"
                          resourceFnc={resourceFnc}
                          onSelect={(e) => {
                            setRowCompletedData((prev) => {
                              const updatedRowData = { ...prev };
                              updatedRowData[rowDatainfo.id] = {
                                ...updatedRowData[rowDatainfo.id],
                                auditorName: e.name,
                              };
                              return updatedRowData;
                            });
                          }}
                          onClear={handleClearAe}
                          showIcon={false}
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="auditee"
                        onChange={handleCompletedChange}
                        value={rowCompletedData[rowDatainfo.id]?.auditName}
                      />
                    </td>
                    <td>
                      <input
                        type="file"
                        name="fileName"
                        onChange={handleCompletedChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="btn btn-container center">
              <Button
                onClick={() => {
                  saveHandler();
                }}
              >
                <FaSave />
                Save{" "}
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </div>
          </Modal.Body>
        </Modal>

        <div>
          <Modal
            show={show}
            onHide={handleQcrClose}
            size="xl"
            style={{ paddingTop: "25px" }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Audit Details :</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <>
                {fileUploadMessage ? (
                  <div className="statusMsg error">
                    <span>
                      <IoWarningOutline /> File is already exist. Please upload
                      another file
                    </span>
                  </div>
                ) : (
                  ""
                )}
                <table class="darkHeader toHead PopUP-table-type-QCR">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">QCR%</th>
                      <th scope="col">Auditor Name</th>
                      <th scope="col">Auditee</th>
                      <th scope="col">Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>
                        <input
                          type="text"
                          name="percentage"
                          onKeyDown={(e) => {
                            const key = e.key;
                            const isNumber = /^[0-9]$/.test(key);
                            const isDecimal = key === ".";
                            if (
                              !isNumber &&
                              !isDecimal &&
                              key !== "Backspace"
                            ) {
                              e.preventDefault();
                            }
                          }}
                          onChange={handleQCRCompletedChange}
                          value={rowCompletedData[rowDatainfo.id]?.percentage}
                        />
                      </td>
                      <td>
                        <div className="autoComplete-container">
                          <ReactSearchAutocomplete
                            className="AutoComplete"
                            items={resource}
                            type="text"
                            name="auditorName"
                            id="auditorName"
                            disabled
                            fuseOptions={{ keys: ["id", "name"] }}
                            resultStringKeyName="name"
                            resource={resource}
                            placeholder="Type minimum 3 characters"
                            resourceFnc={resourceFnc}
                            onSelect={(e) => {
                              setQcrRowCompletedData((prev) => {
                                const updatedRowData = { ...prev };
                                updatedRowData[rowDatainfo.id] = {
                                  ...updatedRowData[rowDatainfo.id],
                                  auditorName: e.name,
                                };
                                return updatedRowData;
                              });
                            }}
                            onClear={handleClearAe}
                            showIcon={false}
                          />
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="auditee"
                          onChange={handleQCRCompletedChange}
                          value={rowCompletedData[rowDatainfo.id]?.minor}
                        />
                      </td>
                      <td>
                        <input
                          type="file"
                          name="fileName"
                          onChange={handleQCRCompletedChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            </Modal.Body>
            <div
              className="btn btn-container center"
              style={{ padding: "0 30px 30px" }}
            >
              <Button onClick={saveHandler}>
                <FaSave />
                Save{" "}
              </Button>
              <Button onClick={handleQcrClose}>Cancel</Button>
            </div>
          </Modal>
        </div>
      </>
    );
  };

  const ref = useRef([]);
  const dateTooltip = (data) => {
    let initialVal;
    if (data.status === 1283 || data.status === "1283") {
      initialVal =
        data.liveAuditedDate == null ? "" : new Date(data.liveAuditedDate);
    } else {
      initialVal =
        data.scheduledDate == null ? "" : new Date(data.scheduledDate);
    }
    const [rowStartDate, setRowStartDate] = useState(() => {
      if (data.status === 1283 || data.status === "1283") {
        return data.liveAuditedDate == null
          ? ""
          : new Date(data.liveAuditedDate);
      } else {
        return data.scheduledDate == null ? "" : new Date(data.scheduledDate);
      }
    });

    // const [dateHighlight, setDateHighlight] = useState(false); // State for error highlighting
    const handleMonthDropdownClick = (e) => {
      e.stopPropagation(); // Prevent the event from reaching higher levels
      // Your existing code for handling the dropdown click
    };
    let filteredData = [];

    if (selectedRows.length > 0) {
      filteredData = Object.values(rowData).filter((val) =>
        selectedRows.some((dat) => val.id === dat.id)
      );
    }
    const [shouldUpdateRowStartDate, setShouldUpdateRowStartDate] =
      useState(false);
    // let selectedDate =
    //   data.status === 479 ? new Date(data.scheduledDate) : rowStartDate;
    useEffect(() => {
      if (
        (data.id && data.status === 479) ||
        (data.status === "479" && shouldUpdateRowStartDate)
      ) {
        let date = new Date(data.scheduledDate);
        setRowStartDate(date);
      }
      // Reset the flag to prevent unnecessary updates
      setShouldUpdateRowStartDate(false);
    }, [data.id, data.status, data.scheduledDate, shouldUpdateRowStartDate]);

    const hasError = validateId.includes(data?.id) && validationMessage;
    return (
      <div>
        <DatePicker
          ref={(ele) => {
            ref.current[data.id] = ele;
          }}
          className={`date-tooltip ${
            validateId.includes(data?.id) && validationMessage
              ? "error-block"
              : ""
          }`}
          id={`auditDate-${data.id}`}
          selected={rowStartDate}
          onChange={(e) => {
            setRowStartDate(e);
            setRowData((prev) => {
              const updatedRowData = { ...prev };
              if (
                !updatedRowData[data.id]?.auditStatus &&
                !updatedRowData[data.id]?.auditType
              ) {
                updatedRowData[data.id] = {
                  ...updatedRowData[data.id],
                  id: data.id,
                  auditType: data.liveAuditType,
                  auditStatus: data.status,
                  auditedDt: moment(e).format("DD-MMM-yyyy"),
                };
              } else {
                updatedRowData[data.id] = {
                  ...updatedRowData[data.id],
                  id: data.id,
                  auditedDt: moment(e).format("DD-MMM-yyyy"),
                };
              }
              return updatedRowData;
            });
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
          dateFormat="dd-MMM-yyyy"
          showMonthDropdown
          showYearDropdown
          onChangeRaw={handleMonthDropdownClick}
        />
      </div>
    );
  };

  const actionTooltip = (rowData) => {
    const [show, setShow] = useState(false);
    const [addmsg, setAddmsg] = useState(false);
    const [facilitatorId, setFacilitatorId] = useState(
      rowData.pcqaFac == null ? "" : rowData.pcqaFac + 1
    );
    const selectedFacName = resource.find(
      (val) => val.userId == rowData.pcqaFac
    );
    const facName = selectedFacName ? selectedFacName.name : "";
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSave = () => {
      axios
        .post(
          baseUrl +
            `/governancems/PCQA/savePcqaFacilitatorDetails?selPrjId=${rowData.projectId}&userId=${loggedUserId}&resourceId=${facilitatorId}`
        )
        .then((res) => {
          setAddmsg(res.data);
          const responseData = res.data;
          pcqaDashboard();
          setTimeout(() => {
            setAddmsg(false);
            handleClose();
          }, 1000);
        });
    };
    return (
      <>
        <FaPlus cursor="pointer" onClick={handleShow} />
        <Modal show={show} onHide={handleClose} style={{ paddingTop: "25px" }}>
          <Modal.Header closeButton>
            <Modal.Title>Project Name: {rowData.projectName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              {addmsg ? (
                <div className="statusMsg success">
                  <span className="errMsg">
                    <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} />{" "}
                    &nbsp;Facilitator Details Saved Successfully
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="d-flex facilitator-autocomplete-wrapper">
              <span className="Facilitator-box">Facilitator </span>{" "}
              <span>:</span>
              <div className="autoComplete-container">
                <ReactSearchAutocomplete
                  className="AutoComplete"
                  inputSearchString={facName}
                  items={resource}
                  type="Text"
                  name="AeId"
                  id="AeId"
                  disabled
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  resource={resource}
                  placeholder="Type minimum 3 characters"
                  resourceFnc={resourceFnc}
                  onSelect={(e) => {
                    setFacilitatorId(e.id != null || e.id != "" ? e.id : "");
                  }}
                  onClear={handleClearAe}
                  showIcon={false}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="footer-btn">
              <Button onClick={handleSave}>
                <FaSave />
                Save{" "}
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const initialValue = {
    userId: loggedUserId,
    unit: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    // account: selectedCustomer.map((option) => option.value).join(","),
    account: "-1",
    projects: "-1",
    facilitator: "-1",
    prjStageList: "1",
    prjSource: "-1",
    auditStatusList: "486",
    fromDt: BillingFirstDate,
    auditType: "484",
    isSubmit: true,
    engType: "-1",
    contractModel: "-1",
    curAlloc: "1",
    prjId: "-1",
    isPcqa: "-1",
  };

  const [searchdata, setSearchdata] = useState(initialValue);
  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });
    let departments = resp.data;
    departments = departments.filter((ele) => ele.value >= 0);
    setDepartments(departments);
    setSelectedDepartments(departments);
    let filteredDeptData = [];
    departments.forEach((data) => {
      filteredDeptData.push(data.value);
    });
  };

  let apiUrl;
  apiUrl = baseUrl + `/governancems/PCQA/getAccounts`;
  const getAccounts = async () => {
    const requestBody = {
      userId: loggedUserId,
      units: selectedDepartments.map((item) => item.value.toString()),
      status: selectedProjectStage.map((i) => i.value.toString()),
    };
    await axios
      .post(baseUrl + `/governancems/PCQA/getAccounts`, requestBody)
      .then((res) => {
        const responseData = res.data;
        if (Array.isArray(responseData)) {
          const formattedData = responseData.map((i) => ({
            label: i.name,
            value: i.id.toString(),
          }));
          setCoustomOptions(formattedData);
          setSelectedCustomer(formattedData);
          let filteredValues = [];
          formattedData.forEach((d) => {
            filteredValues.push(d.value);
          });
          setSearchdata((prevVal) => ({
            ...prevVal,
            ["account"]: formattedData.map((option) => option.value).join(","),
          }));
        } else {
          console.error("Invalid response data format");
        }
      });
  };

  const downloadEmployeeData = (id) => {
    const link = document.createElement("a");
    link.href = baseUrl + `/CommonMS/document/downloadFile?documentId=${id}`;
    link.click();
  };

  const dashboardClickHandler = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidator(true);
      return;
    }
    setValidator(false);
    pcqaDashboard();
  };
  const pcqaDashboard = () => {
    setShowTable(false);
    setLoader(true);
    if (searchdata.account.length > 0) {
      axios
        .post(baseUrl + `/governancems/PCQA/pcqaDashboard`, searchdata)
        .then((res) => {
          const responseData = res.data;
          setTableData(responseData.pcqa);
          setShowTable(true);
          setTimeout(() => {
            setLoader(false);
          }, 1000);
          setVisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        });
    }
  };

  const handleClearAe = () => {
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["facilitator"]: "",
    }));
    // setFormData((prev) => ({ ...prev, awId: "" }));
  };

  const projectStageOptions = [
    { value: 1, label: "In progress" },
    { value: 2, label: "Completed" },
    { value: 4, label: "On hold" },
  ];

  const auditStatusOptions = [
    { value: 480, label: "To be Scheduled" },
    { value: 482, label: "Scheduled" },
    { value: 1283, label: "Audited" },
    { value: 483, label: "Delayed" },
    { value: 479, label: "Completed" },
    { value: 581, label: "Out Of Scope" },
  ];

  const [engagementOptions, setEngagementOptions] = useState([]);
  const [selectedEngagementType, setSelectedEngagementType] = useState([]);
  const [selectedContractTerms, setSelectedContractTerms] = useState([]);

  const enguagementTypeFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getEnguagementType`,
    }).then((res) => {
      let engmentType = [];
      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let engmentObj = {
            label: e.lkup_name,
            value: e.id,
          };
          if (!(e.id === 355 || e.id === 356)) {
            engmentType.push(engmentObj);
          }
        });
      setEngagementOptions(engmentType);
      setSelectedEngagementType(engmentType);
    });
  };

  const getcontractTerms = () => {
    axios
      .get(baseUrl + `/ProjectMS/ProjectScopeChange/getContractTerms`)
      .then((Response) => {
        let terms = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let termsObj = {
              label: e.lkup_name,
              value: e.id,
            };
            terms.push(termsObj);
          });
        setContractOptions(terms);
        setSelectedContractTerms(terms);
      });
  };

  // Create a function to convert rowData to schduleData format
  function convertToSchduleData(rowData) {
    const schduleData = {
      resMap: {},
    };
    let index = 0;

    if (rowData.length > 0) {
      // Iterate through the keys in rowData and transform the data
      Object.keys(rowData).forEach((key) => {
        if (
          ([482, 479, 1283].includes(rowData[key].auditStatus) ||
            ["482", "479", "1283"].includes(rowData[key].auditStatus)) &&
          (rowData[key].auditedDt ?? "") === ""
        ) {
          // let valid = GlobalValidation(ref);
          // if (valid) {
          // {
          //   scrollToTop();
          //   setDateHighlight(true);
          //   setValidationMessage(true);
          //   setTimeout(() => {
          //     setValidationMessage(false);
          //   }, 3000);
          //   return;
          // }
          // }
        }
        if (
          rowData[key].auditStatus === 1283 ||
          rowData[key].auditStatus === "1283"
        ) {
          schduleData.resMap[index] = {
            id: rowData[key].id.toString(), // Convert id to a string if needed
            auditStatus:
              rowData[key].auditStatus === null
                ? "480"
                : rowData[key].auditStatus,
            auditedDt:
              rowData[key].auditedDt === null
                ? ""
                : moment(rowData[key].auditedDt).format("DD-MMM-YYYY"),
            auditType:
              rowData[key].auditType === null ? "477" : rowData[key].auditType,
          };
        } else {
          schduleData.resMap[index] = {
            id: rowData[key].id.toString(), // Convert id to a string if needed
            auditStatus:
              rowData[key].auditStatus === null
                ? "480"
                : rowData[key].auditStatus,
            plannedStartDt:
              rowData[key].auditedDt === null || rowData[key].auditedDt === ""
                ? ""
                : moment(rowData[key].auditedDt).format("DD-MMM-YYYY"),
            auditType:
              rowData[key].auditType === null ? "477" : rowData[key].auditType,
          };
        }
        index++;
      });
    } else {
      Object.keys(selectedRows).forEach((key) => {
        if (
          [482, 479, 1283].includes(
            selectedRows[key].status ||
              ["482", "479", "1283"].includes(selectedRows[key].status)
          ) &&
          (selectedRows[key].scheduledDate ?? "") === ""
        ) {
          {
            scrollToTop();
            setDateHighlight(true);
            setValidationMessage(true);
            setTimeout(() => {
              setValidationMessage(false);
            }, 3000);
          }
          return;
          // }
        }
        if (
          selectedRows[key].status === 1283 ||
          selectedRows[key].status === "1283"
        ) {
          schduleData.resMap[index] = {
            id: selectedRows[key].id.toString(), // Convert id to a string if needed
            auditStatus:
              selectedRows[key].status === null
                ? "480"
                : selectedRows[key].status,
            auditedDt:
              selectedRows[key].scheduledDate === null
                ? ""
                : moment(selectedRows[key].scheduledDate).format("DD-MMM-YYYY"),
            auditType:
              selectedRows[key].liveAuditType === null
                ? "477"
                : selectedRows[key].liveAuditType,
          };
        } else {
          schduleData.resMap[index] = {
            id: selectedRows[key].id.toString(), // Convert id to a string if needed
            auditStatus:
              selectedRows[key].status === null
                ? "480"
                : selectedRows[key].status,
            plannedStartDt:
              selectedRows[key].scheduledDate === null
                ? ""
                : moment(selectedRows[key].scheduledDate).format("DD-MMM-YYYY"),
            auditType:
              selectedRows[key].liveAuditType === null
                ? "477"
                : selectedRows[key].liveAuditType,
          };
        }
        index++;
      });
    }
    if (Object.keys(schduleData.resMap).length == selectedRows.length) {
      setDateHighlight(false);
      return schduleData;
    } else {
      return;
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
  console.log(selectedRows);
  const scheduleDates = () => {
    let data = [];
    data = Object.values(rowData).filter((val) =>
      selectedRows.some((dat) => val.id === dat.id)
    );
    const allIds = [];
    data.forEach((item) => {
      if (
        (item.auditStatus === 482 ||
          item.auditStatus === "482" ||
          item.auditStatus === 1283 ||
          item.auditStatus === "1283" ||
          item.auditStatus === 483 ||
          item.auditStatus === "483") &&
        item.auditedDt === ""
      ) {
        allIds.push(item.id);
      }
    });

    setValidDateID(allIds);
    if (allIds.length > 0) {
      setValidationMessage(true);
      scrollToTop();
      return;
    } else {
      setValidationMessage(false);
    }
    const formatedSchduleData = convertToSchduleData(data);
    for (const key in formatedSchduleData?.resMap) {
      if (formatedSchduleData.resMap.hasOwnProperty(key)) {
        const item = formatedSchduleData?.resMap[key];
        if (item.auditStatus === "479") {
          item.plannedStartDt = moment(new Date()).format("DD-MMM-YYYY");
        }
      }
    }
    axios
      .post(baseUrl + `/governancems/PCQA/scheduled`, formatedSchduleData)
      .then((res) => {
        const responseData = res.data;
        setSavemsg(true);
        setSchduleData(responseData);
        setSelectedRows([]);
        scrollToTop();
        // setRowChecked(false);
        setTimeout(() => {
          setSavemsg(false);
          setTableData([]);
          pcqaDashboard();
        }, 2000);
      });
  };

  const auditMonthHandler = (e) => {
    setStartDate(new Date(e.getFullYear(), e.getMonth(), 1));
  };

  const getName = () => {
    axios
      .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
      .then((response) => {
        var resp = response.data;
        resp.push({ id: "-1", name: "<<ALL>>" });
        setProject(resp);
      });
  };

  const getGraphData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/getGraphDetailsByProjectId?projectid=${projectId}`,
    })
      .then((response) => {
        let resp = response.data;
        setGraphData(resp);
      })
      .then((error) => {});
  };
  useEffect(() => {
    setTableData(tableData);
    tableData[0] && setHeaderData(JSON.parse(JSON.stringify(tableData[0])));
  }, [tableData]);

  // =========Search Filters Code=============

  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  const [filters1, setFilters1] = useState({
    global: filtersData["contains"],
  });

  useEffect(() => {
    setFilters1({
      global: filtersData["contains"],
    });
  }, [headerData]);

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };

    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <span></span>
        <span className="p-input-icon-left tableGsearch">
          <i className="pi pi-search" />
          <InputText
            defaultValue={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
            style={{ textAlign: "center", verticalAlign: "middle" }}
          />
        </span>
      </div>
    );
  };

  const header1 = renderHeader1();

  // =============================== END of Filter code ==================================

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header=""
          style={{ textAlign: "center", width: "45px" }}
          rowSpan={2}
        />
        <Column
          colSpan={2}
          header="Project Details"
          style={{ textAlign: "center", width: "400px" }}
        />
        <Column
          colSpan={7}
          header="Last Audit Details"
          style={{ textAlign: "center" }}
        />
        <Column
          colSpan={3}
          header="Schedule Details"
          style={{ textAlign: "center", width: "350px" }}
        />
        <Column
          header="Action"
          style={{ textAlign: "center", width: "45px" }}
          rowSpan={2}
        ></Column>
      </Row>
      <Row>
        <Column header="RAG/Prj Status/Name"></Column>
        <Column header="Customer"></Column>
        <Column header="Audit Type"></Column>
        <Column header="Planned Date"></Column>
        <Column header="Actual Date"></Column>
        <Column header="Audited Date"></Column>
        <Column header="Auditor Name"></Column>
        <Column header="Trend" style={{ width: "65px" }}></Column>
        <Column header="Reports"></Column>
        <Column header="Types"></Column>
        <Column header="Audit Status"></Column>
        <Column header="Date"></Column>
      </Row>
    </ColumnGroup>
  );

  const handleSelection = (e) => {
    setSelectedRows(e.value);
  };

  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const fetchData = async () => {
    try {
      // Step 1: Make the first API call
      const departmentResponse = await axios.get(
        baseUrl + `/CostMS/cost/getDepartments`
      );

      // Extract the necessary data for the second API call
      const units = departmentResponse.data.map((item) =>
        item.value.toString()
      );

      // Step 2: Make the second API call
      const requestBody = {
        userId: loggedUserId,
        units: units,
        status: selectedProjectStage.map((i) => i.value.toString()),
      };
      const accountsResponse = await axios.post(
        baseUrl + `/governancems/PCQA/getAccounts`,
        requestBody
      );

      // Extract the necessary data for the third API call
      const accountValues = accountsResponse.data
        .map((option) => option.id)
        .join(",");
      // Step 3: Make the third API call
      const data = {
        userId: loggedUserId,
        unit: "170,211,123,82,168,207,212,18,213,49,149,208,243",
        account: accountValues,
        projects: "-1",
        facilitator: "-1",
        prjStageList: "1",
        prjSource: "-1",
        auditStatusList: "486",
        fromDt: BillingFirstDate,
        auditType: "484",
        isSubmit: true,
        engType: "-1",
        contractModel: "-1",
        curAlloc: "1",
        prjId: "-1",
        isPcqa: "-1",
      };
      if (accountValues.length > 0) {
        const pcqaDashboardResponse = await axios.post(
          baseUrl + `/governancems/PCQA/pcqaDashboard`,
          data
        );
        // Handle the third API response
        const responseData = pcqaDashboardResponse.data;
        setTableData(responseData.pcqa);
        setShowTable(true);
        setLoader(false);
      }
    } catch (error) {
      // console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, [selectedProjectStage, selectedDepartments]);

  useEffect(() => {
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["fromDt"]: moment(startDate).format("yyyy-MM-DD"),
    }));
  }, [startDate]);

  useEffect(() => {
    getGraphData();
    getAccounts();
    getName();
    resourceFnc();
    getDepartments();
    enguagementTypeFnc();
    getcontractTerms();
    setSelectedProjectSource(projectSourceOptions);
    setSelectedAuditStatus(auditStatusOptions);
    fetchData();
  }, []);

  return (
    <>
      <div>
        <div>
          {validator ? (
            <div className="statusMsg error">
              <AiFillWarning /> &nbsp; Please select valid values for
              highlighted fields
            </div>
          ) : (
            ""
          )}
          {savemsg ? (
            <div className="statusMsg success">
              <span className="errMsg">
                <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
                Audit details saved Successfully
              </span>
            </div>
          ) : (
            ""
          )}
          {validationMessage ? (
            <div className="statusMsg error">
              <span>
                <IoWarningOutline /> Please fill the highlighted field(s)
              </span>
            </div>
          ) : (
            ""
          )}
          <div className="col-md-12">
            <div className="pageTitle">
              <div className="childOne"></div>
              <div className="childTwo">
                <h2>PCQA Dashboard</h2>
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
                <GlobalHelp pdfname={HelpPDFName} name={Header} />
              </div>
            </div>
          </div>
          <div className="group mb-3 customCard">
            <div className="col-md-12 collapseHeader"></div>
            <CCollapse visible={!visible}>
              <div className="group-content row">
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="businessUnit">
                      Business Unit&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="unit"
                        options={departments}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        value={selectedDepartments}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedDepartments(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["unit"]: filteredValues.toString(),
                          }));
                        }}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return "Select";
                          } else {
                            return `${selected.length} selected`;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="projectStage">
                      Project Stage&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        id="status"
                        ArrowRenderer={ArrowRenderer}
                        options={projectStageOptions}
                        value={selectedProjectStage}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        onChange={(selectedOptions) => {
                          setSelectedProjectStage(selectedOptions);
                          const allOptionsSelected =
                            selectedOptions.length ===
                            projectStageOptions.length;
                          const selectedValues = allOptionsSelected
                            ? "-1"
                            : selectedOptions
                                .map((option) => option.value)
                                .join(",");
                          setSearchdata((prev) => ({
                            ...prev,
                            prjStageList: selectedValues,
                          }));
                        }}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return "Select";
                          } else {
                            return `${selected.length} selected`;
                          }
                        }}
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="customer">
                      Customer&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <MultiSelect
                        id="account"
                        ArrowRenderer={ArrowRenderer}
                        options={coustomOptions}
                        value={selectedCustomer}
                        onChange={(s) => {
                          setSelectedCustomer(s);
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["account"]: s
                              .map((option) => option.value)
                              .join(","),
                          }));
                        }}
                        labelledBy="customer"
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return "Select";
                          } else {
                            return `${selected.length} selected`;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="projectName">
                      Project Name
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <div
                        className="autoComplete-container react  reactsearchautocomplete"
                        id="autocomplete reactautocomplete"
                      >
                        <ReactSearchAutocomplete
                          items={project}
                          type="Text"
                          value={selectedProject}
                          name="Project"
                          id="Project"
                          className="err cancel"
                          onClear={() => {
                            setSearchdata((prevProps) => ({
                              ...prevProps,
                              ["prjId"]: "",
                            }));
                            setSearchdata((prevProps) => ({
                              ...prevProps,
                              ["projects"]: "-1",
                            }));
                          }}
                          placeholder="Type minimum 3 characters"
                          fuseOptions={{ keys: ["id", "name"] }}
                          resultStringKeyName="name"
                          onSelect={(e) => {
                            setSelectedProject(e);
                            setSearchdata((prevProps) => ({
                              ...prevProps,
                              ["prjId"]: e.id,
                            }));
                            setSearchdata((prevProps) => ({
                              ...prevProps,
                              ["projects"]: e.name,
                            }));
                          }}
                          showIcon={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="projectSource">
                      Project Source&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                    >
                      <MultiSelect
                        id="roles"
                        ArrowRenderer={ArrowRenderer}
                        options={projectSourceOptions}
                        value={selectedProjectSource}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        disabled={false}
                        onChange={(selectedOptions) => {
                          setSelectedProjectSource(selectedOptions);
                          const allOptionsSelected =
                            selectedOptions.length ===
                            projectSourceOptions.length;
                          const selectedValues = allOptionsSelected
                            ? "-1"
                            : selectedOptions
                                .map((option) => option.value)
                                .join(",");
                          setSearchdata((prev) => ({
                            ...prev,
                            prjSource: selectedValues,
                          }));
                        }}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return "Select";
                          } else {
                            return `${selected.length} selected`;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="auditType">
                      Audit Type
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <select
                        id="auditType"
                        onChange={(e) => {
                          setAuditTypes(e.target.value);
                          setSearchdata((prev) => ({
                            ...prev,
                            auditType: e.target.value,
                          }));
                        }}
                        value={auditTypes}
                        disabled={
                          searchdata.prjId === "" || searchdata.prjId === "-1"
                            ? false
                            : true
                        }
                      >
                        <option value="484"> &lt;&lt;ALL &gt;&gt;</option>
                        <option value="1285">CMMI</option>
                        <option value="478">IQA</option>
                        <option value="1272">ISMS</option>
                        <option value="1284">ISO</option>
                        <option value="477">QCR</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="auditStatus">
                      Audit Status
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <MultiSelect
                        id="roles"
                        ArrowRenderer={ArrowRenderer}
                        options={auditStatusOptions}
                        value={selectedAuditStatus}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        disabled={
                          searchdata.prjId === "" || searchdata.prjId === "-1"
                            ? false
                            : true
                        }
                        onChange={(selectedOptions) => {
                          setSelectedAuditStatus(selectedOptions);
                          const allOptionsSelected =
                            selectedOptions.length ===
                            auditStatusOptions.length;
                          const selectedValues = allOptionsSelected
                            ? 486
                            : selectedOptions
                                .map((option) => option.value)
                                .join(",");
                          setSearchdata((prev) => ({
                            ...prev,
                            auditStatusList: selectedValues,
                          }));
                        }}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return "Select";
                          } else {
                            return `${selected.length} selected`;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="auditMonth">
                      Audit Month
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <DatePicker
                        selected={startDate}
                        onChange={auditMonthHandler}
                        dateFormat="MMM-yyyy"
                        showMonthYearPicker
                        disabled={
                          searchdata.prjId === "" || searchdata.prjId === "-1"
                            ? false
                            : true
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="engagementType">
                      Engagement Type&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[4] = ele;
                      }}
                    >
                      <MultiSelect
                        id="roles"
                        ArrowRenderer={ArrowRenderer}
                        options={engagementOptions}
                        value={selectedEngagementType}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        onChange={(selectedOptions) => {
                          setSelectedEngagementType(selectedOptions);
                          const allOptionsSelected =
                            selectedOptions.length === engagementOptions.length;
                          const selectedValues = allOptionsSelected
                            ? "-1"
                            : selectedOptions
                                .map((option) => option.value)
                                .join(",");
                          setSearchdata((prev) => ({
                            ...prev,
                            engType: selectedValues,
                          }));
                        }}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return "Select";
                          } else {
                            return `${selected.length} selected`;
                          }
                        }}
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="contractTerms">
                      Contract Terms&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[5] = ele;
                      }}
                    >
                      <MultiSelect
                        id="roles"
                        ArrowRenderer={ArrowRenderer}
                        options={contractOptions}
                        value={selectedContractTerms}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        onChange={(selectedOptions) => {
                          setSelectedContractTerms(selectedOptions);
                          const allOptionsSelected =
                            selectedOptions.length === contractOptions.length;
                          const selectedValues = allOptionsSelected
                            ? "-1"
                            : selectedOptions
                                .map((option) => option.value)
                                .join(",");
                          setSearchdata((prev) => ({
                            ...prev,
                            contractModel: selectedValues,
                          }));
                        }}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return "Select";
                          } else {
                            return `${selected.length} selected`;
                          }
                        }}
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="currentAllocation">
                      Current Allocation
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <select
                        id="curAlloc"
                        onChange={(e) => {
                          const { value, id } = e.target;
                          const selectedValue = value === "null" ? -1 : value;
                          setSearchdata((prev) => ({
                            ...prev,
                            curAlloc: selectedValue,
                          }));
                        }}
                        value={searchdata.curAlloc}
                      >
                        <option value="null">&lt;&lt;ALL&gt;&gt;</option>
                        <option value="1">Active</option>
                        <option value="2">InActive</option>
                        <option value="3">No Allocation</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="facilitator">
                      Facilitator
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6 autoComplete-container">
                      <ReactSearchAutocomplete
                        className="AutoComplete"
                        items={resource}
                        type="Text"
                        name="AeId"
                        id="AeId"
                        disabled
                        fuseOptions={{ keys: ["id", "name"] }}
                        resultStringKeyName="name"
                        resource={resource}
                        placeholder="Type minimum 3 characters"
                        resourceFnc={resourceFnc}
                        onSelect={(e) => {
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["facilitator"]: e.id,
                          }));
                        }}
                        onClear={handleClearAe}
                        showIcon={false}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      dashboardClickHandler();
                    }}
                  >
                    <FaSearch />
                    Search
                  </button>
                </div>
              </div>
            </CCollapse>
          </div>
        </div>
        {loader ? <Loader handleAbort={handleAbort} /> : ""}
        <div></div>
        <div className="PCQA-react-table Project-detail-Table  darkHeader toHead">
          <div className="group customCard">
            <div className="group-content row">
              <div className="col-md-12">
                {showtable && (
                  <DataTable
                    className="primeReactDataTable invoicingSearchTable"
                    value={tableData}
                    showGridlines
                    paginator
                    rows={20}
                    paginationperpage={5}
                    paginationrowsperpageoptions={[5, 15, 20, 25, 50]}
                    paginationcomponentoptions={{
                      rowsPerPageText: "Records per page:",
                      rangeSeparatorText: "out of",
                    }}
                    currentPageReportTemplate="View {first} - {last} of {totalRecords} "
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    rowsPerPageOptions={[10, 20, 25, 50]}
                    selectionMode="checkbox"
                    selection={selectedRows}
                    onSelectionChange={(e) => handleSelection(e)}
                    headerColumnGroup={headerGroup}
                    filters={filters1}
                    header={header1}
                    selectablerows="true"
                    onCellSelect
                    globalFilterFields={[
                      "projectName",
                      "customer",
                      "pastAuditType",
                      "plandStartDate",
                      "actualStartDate",
                      "pastAuditedDate",
                      "auditName",
                      "liveAuditType",
                      "pastStatus",
                      "date",
                      "liveAuditedDate",
                      "startdate",
                      "actualStartDate",
                    ]}
                  >
                    <Column
                      selectionMode="multiple"
                      headerStyle={{ width: "3rem", padding: "0px 15px" }}
                      bodyStyle={{ textAlign: "center" }}
                      body={checkBoxTooltip}
                    ></Column>
                    <Column
                      field="projectName"
                      body={projectDetailsTooltip}
                    ></Column>
                    <Column
                      field="customer"
                      body={customerNameTooltip}
                    ></Column>
                    <Column
                      field="pastAuditType"
                      body={auditTypeTooltip}
                      bodyStyle={{ textAlign: "center" }}
                    ></Column>
                    <Column
                      field="plandStartDate"
                      body={plannedDateTooltip}
                      headerStyle={{ width: "80px" }}
                      bodyStyle={{ textAlign: "right" }}
                    ></Column>
                    <Column
                      field="actualStartDate"
                      body={actualDateTooltip}
                      headerStyle={{ width: "80px" }}
                      bodyStyle={{ textAlign: "right" }}
                    ></Column>
                    <Column
                      field="pastAuditedDate"
                      body={auditedDateTooltip}
                      headerStyle={{ width: "80px" }}
                      bodyStyle={{ textAlign: "right" }}
                    ></Column>
                    <Column
                      field="auditName"
                      body={auditorNameTooltip}
                    ></Column>
                    <Column
                      field="Result"
                      body={trendTooltip}
                      headerStyle={{ width: "60px" }}
                      bodyStyle={{ textAlign: "center" }}
                    ></Column>
                    <Column
                      field="documentId"
                      body={reportsTooltip}
                      headerStyle={{ width: "60px" }}
                      bodyStyle={{ textAlign: "center" }}
                    ></Column>
                    <Column field="liveAuditType" body={typeTooltip}></Column>
                    <Column field="pastStatus" body={statusTooltip}></Column>
                    <Column field="date" body={dateTooltip}></Column>
                    <Column
                      field="action"
                      body={actionTooltip}
                      headerStyle={{ width: "80px" }}
                      bodyStyle={{ textAlign: "center" }}
                    ></Column>
                  </DataTable>
                )}
              </div>

              <div className="btn-container center my-3 mb-2">
                {showtable && (
                  <button
                    type="button"
                    className="btn"
                    style={{
                      width: "80px",
                      fontWeight: "bold",
                      backgroundColor: "#428bca",
                      color: "white",
                    }}
                    onClick={scheduleDates}
                    disabled={selectedRows.length > 0 ? false : true}
                  >
                    <FaSave />
                    Save{" "}
                  </button>
                )}
              </div>
              {openTrend ? (
                <PCQAChart
                  getGraphData={getGraphData}
                  openTrend={openTrend}
                  setOpenTrend={setOpenTrend}
                  graphData={graphData}
                  setGraphData={setGraphData}
                  dat={dat}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PCQA;
