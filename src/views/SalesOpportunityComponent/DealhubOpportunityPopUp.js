import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Column } from "primereact/column";
import { BiCheck } from "react-icons/bi";
import { Dropdown } from "primereact/dropdown";
import { environment } from "../../environments/environment";
import axios from "axios";
import { HiXCircle } from "react-icons/hi2";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillSave,
  AiFillWarning,
} from "react-icons/ai";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import DatePicker from "react-datepicker";
import { MdOutlineAdd } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { TfiSave } from "react-icons/tfi";
import { useRef } from "react";
import Loader from "../Loader/Loader";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";
import OpportunityDeleteDhub from "./OpportunityDeleteDhub";
import { InputTextarea } from "primereact/inputtextarea";
import _debounce from "lodash/debounce";
import { FaHistory } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import "./DealhubOpportunityPopUp.scss";
import { MdNoteAlt } from "react-icons/md";
import { ReactComponent as ListCheckSolid } from "./ListCheckSolid.svg";
import {
  OPEN,
  IN_PROGRESS,
  SIGNED_OFF,
  CLOSED,
  REVIEW,
  ON_HOLD,
  OWNER,
  SCOPING,
  SOLUTION,
  ESTIMATION,
  SUPPORT,
  OPEN_STATUS,
  IN_PROGRESS_STATUS,
  SIGNED_OFF_STATUS,
  CLOSED_STATUS,
  ON_HOLD_STATUS,
} from "./LukUpConstantsDealHub.js";

function DealHubOpportunityPopUp(props) {
  const {
    versPopup,
    setVersPopup,
    opportunityId,
    setCheckedDhub,
    opportunityName,
    // displayTableData,
    salesExecutiveId,
    dataVar,
    rrId,
    fetchData,
    handleClick,
  } = props;
  const [mainData, setMainData] = useState("");
  const [validationmsg, setValidationmsg] = useState(false);
  const [savebutton, setSavebutton] = useState("save");
  const [userName, setUserName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [tableData, setOppoHistoryData] = useState([]);
  const [buttonDisabledState, setButtonDisabledState] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [initialOpen, setInitialOpen] = useState(0);
  const [dealHubId, setDealHubId] = useState("");
  const [dealHuGetId, setdealHuGetId] = useState("");
  const [trueValue, setTrueValue] = useState("");
  const [closeAllStatus, setCloseAllStatus] = useState([]);
  const [successmessage, setSuccessmessage] = useState(false);
  const [currentOn, setCurrentOn] = useState("");
  let tData = tableData.length > 0 ? tableData : "";
  const today = new Date();
  const formattedToday = moment(today).format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(formattedToday);
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [contractTerms, setContractTerms] = useState([]);
  const [contractTypeId, setContractTypeId] = useState([]);
  useEffect(() => {
    setContractTypeId(tableData[0]?.id);
  }, [tableData]);
  const [successmsg, setSuccessMsg] = useState(false);
  const [deletemsg, setDeletemsg] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resource, setResource] = useState([]);
  const [resourceId, setResourcseId] = useState([]);
  const [StartDt, setStartDt] = useState(null);
  const [signDate, setSignDate] = useState(null);
  const [signEditDate, setSignEditDate] = useState(null);
  const [valid, setValid] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [products, setProducts] = useState([]);
  const [editFields, setEditFields] = useState([]);

  const [backupData, setBackupData] = useState([]);
  const [roleId, setRoleId] = useState([]);
  const [effectiveHrs, setEffectiveHrs] = useState("");
  const [actualHrs, setActualHrs] = useState("");
  const [signedOffsValue, setSignedOffsValue] = useState(null);
  const [signedOffsEditValue, setSignedOffsEditValue] = useState(null);
  const [editor, setEditor] = useState(false);
  const [enableDropDown, setEnableDropDown] = useState(false);
  const [rowId, setRowId] = useState([]);
  const [isDeleteId, setIsDeleteId] = useState("");
  const [sfDocs, setSfDocs] = useState([]);
  const [open, setOpen] = useState(false);
  const [docDisplay, setDocDisplay] = useState(false);
  const [todayDate, setTodayDate] = useState("");
  const abortController = useRef(null);
  const [editEstimateHrs, setEditEstimateHrs] = useState([]);
  const [editActualHrs, setEditActualHrs] = useState([]);
  const [editSignedOff, setEditSignedOff] = useState([]);
  const [editResourceId, setEditResourceId] = useState([]);
  const [addMsg, setAddMsg] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [roleDeletePopup, setRoleDeletePopup] = useState(false);
  const [dhubId, setDhubId] = useState("");
  const [disInprogId, setdisInprogId] = useState("");
  const [chnage, setCghange] = useState(false);
  const isFirstRender = useRef(true);
  const [closedDate, setClosedDate] = useState([]);
  const [deleteDhubPopUp, setDeleteDhubPopUp] = useState(false);
  const [dealHubDelete, setDealHubDelete] = useState(false);
  const [signedState, setSignedState] = useState([]);
  const [notesPopUp, setNotesPopUP] = useState(false);
  const [notesData, setNotesData] = useState([]);
  const [backUpNotesdata, setBackUpNoptesData] = useState([]);
  const [notesComments, setNotesComments] = useState("");
  const [buttonDisabledNotes, setButtonDisabledNotes] = useState(true);
  const [validNotes, setValidNotes] = useState(false);
  const [notessuccessmessage, setNotesSuccessMessage] = useState(false);
  const [notesValidation, setNotesValidation] = useState(false);
  const [validationMsg, setValidationMsg] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyPopUp, setHistoryPopUp] = useState(false);
  const [onholdId, setOnholdId] = useState([]);
  const [toggleButton, setToggleButton] = useState(false);
  const [holdSuccessMsg, setHoldSuccessMsg] = useState(false);
  const [restartSuccessMsg, setRestartSuccessMsg] = useState(false);
  const [closedSuccessMsg, setclosedSuccessMsg] = useState(false);
  const [push, setPush] = useState("");
  const getAllRolesHistoryDetails = () => {
    if (dealHuGetId) {
      axios({
        url:
          baseUrl +
          `/SalesMS/sales/getAllAssignedDetails?participantId=${dealHuGetId}`,
      }).then((res) => {
        let dataa = res.data;
        setHistoryData(dataa);
      });
    }
  };
  useEffect(() => {
    if (tableData[0]?.dhub_status_id === IN_PROGRESS_STATUS) {
      setSelectedStatus(IN_PROGRESS_STATUS);
    } else {
      setSelectedStatus(OPEN_STATUS);
    }
  }, []);

  useEffect(() => {
    getAllRolesHistoryDetails();
  }, [dealHuGetId]);

  useEffect(() => {
    setMainData(tableData);
  }, [tableData]);
  useEffect(() => {
    selectedStatus == CLOSED_STATUS ? opportunityHistory(opportunityId) : "";
  }, [selectedStatus]);

  useEffect(() => {
    opportunityHistory(opportunityId);
  }, [opportunityId]);

  const opportunityHistory = (opportunityId) => {
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setOpen(true);
    }, 2000);
    axios
      .get(
        baseUrl +
          `/SalesMS/sales/getDhubDetailsPopUp?OpportunityId=${opportunityId}&reportId=${rrId}`
      )
      .then(function (response) {
        const data = response.data;
        setOpen(false);
        clearTimeout(loaderTime);
        setdealHuGetId(data[0]?.dhubId);
        setOppoHistoryData(data);
        setCloseAllStatus(data[0]?.dhub_status_id);
        setInitialOpen(data[0]?.isActive);
        setPush(data[0]?.pushed);
        setCurrentOn(data[0]?.CreatedDate);
      });
  };

  const DHubPush = async (opportunityId) => {
    try {
      if (selectedStatus === CLOSED) {
        const specialResponse = await axios({
          method: "post",
          url: baseUrl + `/SalesMS/sales/postStatusChangestoDHub`,
          data: {
            opportunityId: opportunityId,
            lastUpdatedById: loggedUserId,
            dhubStatusId: CLOSED,
          },
        });
        setclosedSuccessMsg(true);
        setTimeout(() => {
          setclosedSuccessMsg(false);
        }, 2000);
        setTrueValue(specialResponse.data.type);
        opportunityHistory(opportunityId);
        fetchData();
      } else {
        const response = await axios({
          method: "post",
          url: baseUrl + `/SalesMS/sales/postOppoToDhubTable`,
          data: {
            id: salesExecutiveId,
            opportunityId: opportunityId,
            customerId: "",
            customerProspectId: "",
            contractTypeId: "",
            createdById:
              salesExecutiveId != 9999 ? salesExecutiveId : loggedUserId,
            createdByDate: selectedDate,
            dhubStatusId: OPEN,
            lastUpdatedByDate: "",
            lastUpdatedById: loggedUserId,
            loggedId:
              salesExecutiveId != 9999 ? salesExecutiveId : loggedUserId,
          },
        });
        const resp = response.data;
        fetchData();
        handleAddRolesDetails();
        setSuccessmessage(true);
        setTimeout(() => {
          setSuccessmessage(false);
        }, 2000);
        setDealHubId(resp[0]?.id);
        setButtonDisabledState(resp[0]?.isActive);
        opportunityHistory(opportunityId);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      }
    } catch (error) {
      console.error("Error in DHubPush:", error);
    }
  };

  const OpenHistoryPopUp = (props) => {
    const { historyPopUp, setHistoryPopUp } = props;
    return (
      <div>
        <CModal
          alignment="top"
          backdrop="static"
          visible={historyPopUp}
          size="m"
          className="ui-dialog"
          onClose={() => {
            setHistoryPopUp(false);
          }}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">History</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <DataTable
              value={historyData}
              className="primeReactDataTable darkHeader"
              editMode="row"
              rows={25}
              showGridlines
              dataKey="id"
              emptyMessage="No Data Found"
              paginator
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 15, 25, 50]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
              currentPageReportTemplate="View {first} - {last} of {totalRecords} "
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            >
              <Column
                field="action_name"
                header="Status"
                body={(rowData) => {
                  return (
                    <div className="ellipsis" title={rowData.action_name}>
                      {rowData.action_name}
                    </div>
                  );
                }}
              ></Column>
              <Column
                field="actionBy_name"
                header="Action By"
                body={(rowData) => {
                  return (
                    <div className="ellipsis" title={rowData.actionBy_name}>
                      {rowData.actionBy_name}
                    </div>
                  );
                }}
              ></Column>
              <Column
                field="action_dt"
                header="Action On"
                sortable
                body={(rowData) => {
                  return (
                    <div
                      title={moment(rowData.action_dt).format("DD-MMM-yyyy")}
                      style={{ textAlign: "center" }}
                    >
                      {moment(rowData.action_dt).format("DD-MMM-yyyy")}
                    </div>
                  );
                }}
              ></Column>
            </DataTable>
          </CModalBody>
        </CModal>
      </div>
    );
  };

  useEffect(() => {
    if (mainData[0]?.dhub_status_id === null) {
      setSelectedStatus(OPEN);
    }
    if (
      mainData[0]?.Closed != "" ||
      mainData[0]?.Closed != null ||
      mainData[0]?.Closed != "null" ||
      mainData[0]?.Closed != undefined
    ) {
      setSelectedStatus(CLOSED);
    }
    if (chnage === false) {
      setSelectedStatus(signedState);
    } else {
      setSelectedStatus(CLOSED);
      setSignedState(CLOSED);
    }
  }, [mainData, tableData, signedState]);

  const handleStatusChange = (e) => {
    setCghange(true);
    const newStatus = parseInt(e.target.value, 10);
    setSelectedStatus(newStatus);
    if (newStatus === CLOSED_STATUS) {
      const todaysDate = new Date();
      setClosedDate(moment(todaysDate).format("DD-MMM-YYYY"));
    } else {
      setClosedDate([]);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      setDhubId(products[0]?.id);
    }

    if (dhubId == undefined) {
    } else {
      getSignedOffToDHub(dhubId, products);
    }
  }, [dhubId, products]);
  const getSignedOffToDHub = async (mainData, products) => {
    try {
      if (products[0]?.id) {
        const response = await axios.get(
          baseUrl + `/SalesMS/sales/getSignedOffToDHub?Id=${products[0]?.id}`
        );
        const result = response.data;
        if (mainData[0]?.dhub_status === "Closed") {
          setSignedState(CLOSED);
        } else {
          setSignedState(result[0]?.all_signed_off);
        }
      }
    } catch (error) {
      console.error("Error making API call:", error);
    }
  };

  const OppRoleDeletePopUp = (props) => {
    const [comment, setComment] = useState("");
    const [commentErrMsg, setCommentErrMsg] = useState(false);
    const {
      roleDeletePopup,
      setRoleDeletePopup,
      deleteId,
      deletemsg,
      setDeletemsg,
      isDeleteId,
      setIsDeleteId,
      setDhubId,
      handleAddRolesDetails,
      Reset,
      opportunityHistory,
      opportunityId,
    } = props;

    const DeleteRole = () => {
      if (!comment.trim()) {
        setCommentErrMsg(true);
        setTimeout(() => {
          setCommentErrMsg(false);
        }, 2000);
        return;
      }
      setDeletemsg(false);
      axios({
        method: "Post",
        url:
          baseUrl +
          `/SalesMS/sales/deleteRoleFromParticipants?id=${isDeleteId}`,
        data: {
          comments: comment,
        },
      }).then((res) => {
        setDeletemsg(true);
        // setDhubId("");
        handleAddRolesDetails();
        setInitialOpen([]);
        setButtonDisabledState([]);
        Reset();
        setRoleDeletePopup(false);
        opportunityHistory(opportunityId);
        setTimeout(() => {
          setDeletemsg(false);
        }, 2000);
      });
    };

    useEffect(() => {
      if (roleDeletePopup) {
        const textarea = document.getElementById("comments");
        textarea && textarea.focus();
      }
    }, [roleDeletePopup]);
    return (
      <div>
        <CModal
          alignment="center"
          backdrop="static"
          visible={roleDeletePopup}
          size="sm"
          className="ui-dialog"
          closeButton={false}
        >
          <CModalHeader className="" closeButton={false}>
            <CModalTitle>
              <span className="">Delete Role</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {commentErrMsg && (
              <div className="statusMsg error">
                <span>
                  <AiFillWarning />
                  &nbsp;
                  {"Please Provide Comment"}
                </span>
              </div>
            )}
            <div className=" col-md-12 mb-2">
              <strong> Are you sure to delete Role ?</strong>
              <div className=" col-md-12">
                <label>
                  Comments&nbsp;
                  <span className="error-text">*</span>
                </label>

                <textarea
                  id="comments"
                  type="text"
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  cols={20}
                  autoFocus
                  className={commentErrMsg ? "error-block commentsError" : ""}
                  style={{
                    resize: "both",
                    overflow: "auto",
                  }}
                />
              </div>
            </div>
            <div className="btn-container center my-2">
              <button
                className="btn btn-primary"
                title="Delete"
                onClick={(e) => {
                  e.preventDefault();
                  DeleteRole();
                }}
              >
                <TfiSave /> Delete
              </button>
              <button
                className="btn btn-secondary"
                title="Cancel"
                onClick={() => {
                  setRoleDeletePopup(false);
                }}
              >
                <ImCross /> Cancel{" "}
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  };

  useEffect(() => {
    setDetails((prev) => ({
      ...prev,
      id: rowId,
      effortHrs: editEstimateHrs,
      actualHrs: editActualHrs,
      signedOff: signedOffsEditValue == null ? 0 : signedOffsEditValue,
      signedOffDate:
        signEditDate == null ||
        signEditDate == "" ||
        signEditDate == "Invalid date"
          ? ""
          : moment(signEditDate).format("YYYY-MM-DD"),
      ownerId: editResourceId,
    }));
  }, [
    editEstimateHrs,
    editActualHrs,
    signedOffsEditValue,
    signEditDate,
    editResourceId,
  ]);

  const [details, setDetails] = useState({
    id: rowId,
    effortHrs: editEstimateHrs,
    actualHrs: editActualHrs,
    signedOff: signedOffsEditValue == null ? 0 : signedOffsEditValue,
    signedOffDate:
      signEditDate == null ||
      signEditDate == "" ||
      signEditDate == "Invalid date"
        ? ""
        : moment(signEditDate).format("YYYY-MM-DD"),
    ownerId: editResourceId,
  });

  const Reset = () => {
    setEditFields([]);
    setProducts(backupData);
    setButtonDisabled(true);
    setValid(false);
    setIsModified(false);
    setTodayDate([]);
    setSignDate(null);
    setEditor(false);
    setValidationmsg(false);
  };
  const closeNotes = () => {
    setNotesData(backUpNotesdata);
    setButtonDisabledNotes(true);
    setValidNotes(false);
  };
  const handleSaveClick = (dhubId) => {
    let data;

    function hasDuplicates(array, roleId, userId) {
      const count = array.filter(
        (item) => item.Resource_id === userId && item.roleId === roleId
      )?.length;
      setValidationMsg(count >= 1);
      return count >= 1;
    }

    if (hasDuplicates(products, roleId, resourceId)) {
      return;
    } else {
    }

    if (
      !roleId ||
      roleId.length === 0 ||
      !resourceId ||
      resourceId?.length === 0
    ) {
      setValidationmsg(true);
      return;
    }

    setValidationmsg(false);

    if (rowId == "" || rowId == []) {
      data = {
        opportunityId: opportunityId,
        assignDt: moment(todayDate).format("YYYY-MM-DD"),
        roleId: roleId,
        ownerId: resourceId,
        effortHrs: effectiveHrs == [] ? "" : effectiveHrs,
        actualHrs: actualHrs == [] ? "" : actualHrs,
        createdById: loggedUserId,
        createdDate: selectedDate,
        lastUpdatedById: loggedUserId,
        lastUpdatedDate: selectedDate,
        signedOff:
          signedOffsValue == null || signedOffsValue === ""
            ? 0
            : signedOffsValue,
        signedOffDate:
          signDate == null || signDate === ""
            ? ""
            : moment(signDate).format("YYYY-MM-DD"),
      };
    } else {
      data = details;
    }

    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/postChangesToDhubParticipants`,
      data: data,
    }).then((response) => {
      const result = response.data.status;
      handleAddRolesDetails();
      setAddMsg(result);
      setValidationMsg(false);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 2000);
      getSignedOffToDHub(dhubId, tableData);
      opportunityHistory(opportunityId);
      setRoleId([]);
      setResourcseId([]);
      setActualHrs("");
      setEffectiveHrs("");
      fetchData();
      setStartDt(null);
      setTodayDate([]);
      setSignDate(null);
      setRowId([]);
      setSignedOffsValue(null);
      getAllRolesHistoryDetails();
    });

    setButtonDisabled(true);
    setValid(false);
    setEnableDropDown(false);
    setEditor(false);
  };

  const handleSaveEditClick = (dhubId) => {
    let data;

    if (rowId == "" || rowId == []) {
      data = {
        opportunityId: opportunityId,
        assignDt: moment(todayDate).format("YYYY-MM-DD"),
        roleId: roleId,
        ownerId: resourceId,
        effortHrs: effectiveHrs == [] ? "" : effectiveHrs,
        actualHrs: actualHrs == [] ? "" : actualHrs,
        createdById: loggedUserId,
        createdDate: selectedDate,
        lastUpdatedById: loggedUserId,
        lastUpdatedDate: selectedDate,
        signedOff:
          signedOffsValue == null || signedOffsValue == ""
            ? 0
            : signedOffsValue,
        signedOffDate:
          signDate == null || signDate == ""
            ? ""
            : moment(signDate).format("YYYY-MM-DD"),
      };
    } else {
      data = details;
    }
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/postChangesToDhubParticipants`,
      data: data,
    }).then((response) => {
      const result = response.data.status;
      setAddMsg(result);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 2000);
      handleAddRolesDetails();
      getSignedOffToDHub(dhubId, tableData);
      opportunityHistory(opportunityId);
      setRoleId([]);
      setResourcseId([]);
      setActualHrs("");
      setEffectiveHrs("");
      fetchData();
      setStartDt(null);
      setTodayDate([]);
      setSignDate(null);
      setRowId([]);
    });
    setButtonDisabled(true);
    setValid(false);
    setEnableDropDown(false);
    setEditor(false);
  };

  const handleClear = () => {
    setResourcseId([]);
    setTodayDate([]);
  };

  const owner = (tableData[0]?.owner || "").trim();

  let roles = [
    { label: "Estimation", value: 1450 },
    { label: "Scoping", value: 1448 },
    { label: "Solution", value: 1449 },
    { label: "SOW", value: 1463 },
    { label: "Support", value: 1451 },
  ];

  // Conditionally add "Owner" role if trimmed owner is an empty string
  if (owner === "") {
    roles.unshift({ label: "Owner", value: 1447 });
  }
  roles.sort((a, b) => a.label.localeCompare(b.label));

  const renderDropdown = (rowData, column) => {
    const index = products.indexOf(rowData);
    const isLastRow = index === products.length - 1;
    if (rowData.ui === "new" && closeAllStatus === ON_HOLD_STATUS) {
      return "";
    }
    return (
      <div className="d-flex gap-1">
        {rowData.ui == "new" ? (
          <Dropdown
            className={
              validationmsg && (!roleId || roleId?.length === 0)
                ? "error-block Role-dropdown"
                : "Role-dropdown"
            }
            optionLabel="label"
            optionValue="value"
            value={roleId}
            options={roles}
            placeholder="<<Please Select>>"
            onChange={(e) => handleDropdownChange(e, rowData)}
          />
        ) : (
          rowData.lkup_name
        )}
      </div>
    );
  };

  const resourceFnc = async () => {
    await axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then((res) => {
      let manger = res.data;
      setResource(manger);
    });
  };

  const resourceAutocomplete = (rowData) => {
    if (rowData.ui === "new" && closeAllStatus === ON_HOLD_STATUS) {
      return "";
    }
    if (rowData.ui == "new") {
      return (
        <div
          className={
            validationmsg && (!resourceId || resourceId?.length === 0)
              ? "error-block  autoComplete-container inTable"
              : "autoComplete-container inTable"
          }
        >
          <ReactSearchAutocomplete
            items={resource}
            className={
              validationmsg && (!resourceId || resourceId?.length === 0)
                ? "error-block "
                : ""
            }
            id="resource_id"
            name="resourceId"
            placeholder="Press space for resource list"
            inputSearchString={
              rowData.lkup_name == null ? "" : rowData.lkup_name
            }
            onSelect={(selectedItem) => {
              setResourcseId(selectedItem.id);
              const currentDate = new Date();
              const newTodayDate = selectedItem.id
                ? `${currentDate
                    .getDate()
                    .toString()
                    .padStart(2, "0")}-${currentDate.toLocaleString("default", {
                    month: "short",
                  })}-${currentDate.getFullYear()}`
                : "";
              setTodayDate(newTodayDate);
            }}
            onClear={handleClear}
            showIcon={false}
          />
        </div>
      );
    } else if (enableDropDown && editor && rowData.partId === rowId) {
      setEditResourceId(rowData.Resource_id);
      return (
        <div className="autoComplete-container react  cancel  reactsearchautocomplete">
          <ReactSearchAutocomplete
            items={resource}
            id="resourceId"
            name="resourceId"
            inputSearchString={rowData.Name == null ? "" : rowData.Name}
            onSelect={(e) => {
              setDetails((prev) => ({
                ...prev,
                ownerId: e.id,
              }));
            }}
            showIcon={false}
          />
        </div>
      );
    } else {
      return (
        <div
          className="ellipsis"
          title={rowData.Name == "" || rowData.Name == null ? "" : rowData.Name}
        >
          {rowData.Name == "" || rowData.Name == null ? "" : rowData.Name}
        </div>
      );
    }
  };

  const assignedDate = (rowData) => {
    if (rowData.ui === "new" && closeAllStatus === ON_HOLD_STATUS) {
      return "";
    }
    if (rowData.ui == "new") {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <DatePicker
            name="assign_dt"
            id="assign_dt"
            value={
              todayDate == [] || todayDate == "" || todayDate == null
                ? ""
                : todayDate
            }
            disabled
            readOnly
          />
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
          title={
            rowData.assign_dt == "" || rowData.assign_dt == null
              ? ""
              : moment(rowData.assign_dt).format("DD-MMM-yyyy")
          }
        >
          {rowData.assign_dt == "" || rowData.assign_dt == null
            ? ""
            : moment(rowData.assign_dt).format("DD-MMM-yyyy")}
        </div>
      );
    }
  };
  const effectiveHours = (rowData) => {
    const handleChange = (e) => {
      setEffectiveHrs(e.target.value);
    };
    if (rowData.ui === "new" && closeAllStatus === ON_HOLD_STATUS) {
      return "";
    }
    if (rowData.ui == "new") {
      return (
        <input
          type="text"
          maxLength={10}
          onKeyDown={(e) => {
            const isNumericKey = /^[0-9]$/.test(e.key);

            if (!isNumericKey && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
          value={effectiveHrs}
          onChange={handleChange}
        />
      );
    } else if (enableDropDown && editor && rowData.partId === rowId) {
      setEditEstimateHrs(rowData.effort_hrs);
      return (
        <>
          <input
            type="text"
            id="editEstimateHrs"
            name="editEstimateHrs"
            defaultValue={rowData.effort_hrs == "" ? "" : rowData.effort_hrs}
            onChange={(e) => {
              setDetails((prev) => ({
                ...prev,
                effortHrs: e.target.value,
              }));
            }}
          />
        </>
      );
    } else {
      return (
        <div
          style={{ textAlign: "right" }}
          title={rowData.effort_hrs == "" ? "" : rowData.effort_hrs}
        >
          {rowData.effort_hrs == "" ? "" : rowData.effort_hrs}
        </div>
      );
    }
  };

  const actualHours = (rowData) => {
    const handleChange = (e) => {
      setActualHrs(e.target.value);
    };
    if (rowData.ui === "new" && closeAllStatus === ON_HOLD_STATUS) {
      return "";
    }
    if (rowData.ui == "new") {
      return (
        <input
          type="text"
          maxLength={10}
          onKeyDown={(e) => {
            const isNumericKey = /^[0-9]$/.test(e.key);

            if (!isNumericKey && e.key !== "Backspace") {
              e.preventDefault();
            }
          }}
          value={actualHrs}
          onChange={handleChange}
        />
      );
    } else if (enableDropDown && editor && rowData.partId === rowId) {
      setEditActualHrs(rowData.actual_hrs);
      return (
        <>
          <input
            type="text"
            id="actualHrs"
            name="actualHrs"
            defaultValue={rowData.actual_hrs == "" ? "" : rowData.actual_hrs}
            onChange={(e) => {
              setDetails((prev) => ({
                ...prev,
                actualHrs: e.target.value,
              }));
            }}
          />
        </>
      );
    } else {
      return (
        <div
          style={{ textAlign: "right" }}
          title={rowData.actual_hrs == "" ? "" : rowData.actual_hrs}
        >
          {" "}
          {rowData.actual_hrs}
        </div>
      );
    }
  };

  const signedDate = (rowData) => {
    const signedOffDate = new Date(rowData.signed_off_date);
    if (rowData.ui === "new" && closeAllStatus === ON_HOLD_STATUS) {
      return "";
    }
    if (rowData.ui == "new") {
      return (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <DatePicker
              name="signed_off_date"
              id="signed_off_date"
              selected={signDate}
              disabled
              readOnly
              dateFormat="dd-MMM-yyyy"
            />
          </div>
        </>
      );
    } else if (
      enableDropDown &&
      editor &&
      rowData.partId === rowId &&
      rowData.signedOff == 1
    ) {
      return (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <DatePicker
              name="signed_off_date"
              id="signed_off_date"
              selected={signedOffDate}
              disabled
              readOnly
              dateFormat="dd-MMM-yyyy"
            />
          </div>
        </>
      );
    } else if (
      enableDropDown &&
      editor &&
      rowData.partId === rowId &&
      rowData.signedOff == 0
    ) {
      return (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <DatePicker
              name="signed_off_date"
              id="signed_off_date"
              selected={signEditDate}
              disabled
              readOnly
              dateFormat="dd-MMM-yyyy"
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
            title={
              rowData.signed_off_date == "" || rowData.signed_off_date == null
                ? ""
                : moment(rowData.signed_off_date).format("DD-MMM-yyyy")
            }
          >
            {rowData.signed_off_date == "" || rowData.signed_off_date == null
              ? ""
              : moment(rowData.signed_off_date).format("DD-MMM-yyyy")}
          </div>
        </>
      );
    }
  };

  const signedOff = (rowData) => {
    const handleCheckboxChange = (e) => {
      const newValue = e.target.checked;
      if (newValue) {
        setSignDate(new Date());
      } else {
        setSignDate(null);
      }
      setSignedOffsValue(newValue == true ? 1 : 0);
    };

    const handleEditCheckboxChange = (e) => {
      const newValue = e.target.checked;
      if (newValue) {
        setSignEditDate(new Date());
      } else {
        setSignEditDate(null);
      }
      setSignedOffsEditValue(newValue == true ? 1 : 0);
    };
    if (rowData.ui === "new" && closeAllStatus === ON_HOLD_STATUS) {
      return "";
    }
    if (rowData.ui == "new") {
      return (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              style={{ alignItems: "center", transform: "scale(1.4)" }}
              onChange={handleCheckboxChange}
            />
          </div>
        </>
      );
    } else if (
      enableDropDown &&
      editor &&
      rowData.partId === rowId &&
      rowData.signedOff == 0
    ) {
      setEditSignedOff(rowData.signedOff);
      return (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input
              type="checkbox"
              id="editSignedOff"
              name="editSignedOff"
              style={{ alignItems: "center", transform: "scale(1.4)" }}
              onChange={handleEditCheckboxChange}
            />
          </div>
        </>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            type="checkbox"
            disabled
            checked={rowData.signedOff == 1 ? true : false}
            style={{ alignItems: "center", transform: "scale(1.4)" }}
          />
        </div>
      );
    }
  };
  const Comments = (rowData) => {
    return (
      <div className="ellipsis" title={rowData.Notes}>
        {rowData.Notes}
      </div>
    );
  };
  const handleDropdownChange = (e, rowData) => {
    setRoleId(e.value);
  };

  const getSfDocuments = () => {
    abortController.current = new AbortController();
    // const loaderTime = setTimeout(() => {
    //   setOpen(true);
    // }, 2000);

    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/getSFOppDocs`,
      data: {
        oppId: opportunityId,
      },
    }).then((resp) => {
      const data = resp.data;
      setSfDocs(data.data);
      setDocDisplay(true);
      // setOpen(false);
      // clearTimeout(loaderTime);
      window.scrollTo({ top: 1500, behavior: "smooth" });
    });
  };

  useEffect(() => {
    getSfDocuments();
  }, [opportunityId]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setOpen(false);
  };

  const handleCostContract = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getContractTerms`,
    }).then((res) => {
      let contact = res.data;
      setContractTerms(contact);
    });
  };
  useEffect(() => {
    handleCostContract();
    handleAddRolesDetails();
    resourceFnc();
  }, []);

  const handleSaveRows = () => {
    if (isModified == false) {
      setErrorMessage(
        <div>
          <AiFillWarning style={{ marginTop: "-3px" }} />
          &nbsp;No Modifications found to save
        </div>
      );

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }
    setSuccessMsg(false);
    setDeletemsg(false);
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/postStatusChangestoDHub`,
      data: {
        opportunityId: opportunityId,
        contractTypeId: contractTypeId,
        lastUpdatedById: loggedUserId,
      },
    }).then((res) => {
      setIsModified(false);
      let contact = res.data;
      setSuccessMsg(true);
      opportunityHistory(opportunityId);
      setTimeout(() => {
        setSuccessMsg(false);
      }, 2000);
    });
  };

  const handleAddRolesDetails = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/SalesMS/sales/getRolesAssignedDetails?OpportunityId=${opportunityId}`,
    }).then((res) => {
      let contact = res.data;
      const dataWithSNo = contact.map((item) => ({
        ui: "1",
        ...item,
      }));
      setProducts(dataWithSNo);
      setBackupData(contact);
      // setHistoryId(contact[0]?.id);
    });
  };
  const getNotesData = (Id) => {
    axios({
      method: "get",
      url:
        baseUrl + `/SalesMS/sales/getDhubParticipantNote?participantId=${Id}`,
    }).then((res) => {
      let data = res.data;
      data = data.map((item) => {
        return {
          ui: "1",
          ...item,
          date:
            item.date === null ||
            item.date === "Invalid date" ||
            item.date === ""
              ? ""
              : item.date,
        };
      });

      setUserName(data[0]?.name);
      setRoleName(data[0]?.lkup_name);
      const dataWithSNo = data.map((item) => ({
        ui: "1",
        ...item,
      }));
      setNotesData(dataWithSNo);
      setBackUpNoptesData(data);
      setTimeout(() => {
        setNotesSuccessMessage(false);
      }, 2000);
    });
  };
  const postnotes = (notesData) => {
    let Id = notesData[0].dhub_participants_id;

    if (!notesComments || notesComments.length == 0) {
      setNotesValidation(true);
      return;
    }
    setNotesValidation(false);

    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/addDhubParticipantNote`,
      data: {
        comments: notesComments,
        participantId: Id,
      },
    }).then((res) => {
      let data = res.data;
      getNotesData(Id);
      setButtonDisabledNotes(true);
      setValidNotes(false);
      if (data.status == "success") {
        setNotesSuccessMessage(true);
      }
      handleAddRolesDetails();
    });
  };
  const renderdate = (notesData) => {
    if (notesData.ui == "new") {
      return (
        <div className="align center">
          <input
            type="text"
            title={
              notesData.date == "" || notesData.date == "Invalid date"
                ? ""
                : moment(notesData.date).format("DD-MMM-yyyy")
            }
            value={
              notesData.date == "" || notesData.date == "Invalid date"
                ? ""
                : moment(notesData.date).format("DD-MMM-yyyy")
            }
            style={{ textAlign: "center" }}
            disabled
            readOnly
          />
        </div>
      );
    } else {
      return (
        <div
          className="align center"
          title={
            notesData.date == "" || notesData.date == "Invalid date"
              ? ""
              : moment(notesData.date).format("DD-MMM-yyyy")
          }
        >
          {notesData.date == "" || notesData.date == "Invalid date"
            ? ""
            : moment(notesData.date).format("DD-MMM-yyyy")}
        </div>
      );
    }
  };

  const rendernotescomments = (notesData) => {
    const handleChange = (e) => {
      setNotesComments(e.target.value);
    };

    if (notesData.ui == "new") {
      return (
        <textarea
          type="comments"
          name="notesComments"
          autoFocus
          className={
            notesValidation && (!notesComments || notesComments.length == 0)
              ? "error-block"
              : ""
          }
          id="notesComments"
          title={notesData.NotesComments}
          value={notesData.NotesComments}
          onChange={handleChange}
        />
      );
    } else {
      return (
        <div className="ellipsis" title={notesData.NotesComments}>
          {notesData.NotesComments}
        </div>
      );
    }
  };

  const addHandler1 = () => {
    if (!valid) {
      setValid(true);
      setButtonDisabled(false);
    }
    const newRow = {
      Name: "",
      lkup_name: "",
      assign_dt: "",
      effort_hrs: "",
      actual_hrs: "",
      signedOff: "",
      signed_off_date: "",
      Action: 0,
      ui: "new",
    };

    setProducts((prevTaskResources) => [...prevTaskResources, newRow]);
  };
  const addHandlernotes = () => {
    if (!validNotes) {
      setValidNotes(true);
      setButtonDisabledNotes(false);
    }
    const newRow = {
      comments: "",
      date: moment(new Date()).format("YYYY-MM-DD"),
      dhub_participants_id: rowId,
      ui: "new",
    };

    setNotesData((prevcomments) => [newRow, ...prevcomments]);
  };

  const renderRowActions = (rowData, setEditFields, editFields) => {
    if (rowData.ui === "new" && closeAllStatus === ON_HOLD_STATUS) {
      return <></>;
    }
    return (
      <>
        <div>
          {(initialOpen === 1 &&
            !buttonDisabled &&
            rowData.signedOff !== 1 &&
            rowData.partId === rowId) ||
          rowData.partId === undefined ? (
            <>
              {onholdId === ON_HOLD_STATUS ||
              closeAllStatus === "1454" ||
              closeAllStatus === "1500" ? (
                ""
              ) : (
                <div>
                  <span>
                    <AiFillSave
                      cursor="pointer"
                      color="var(--accent, #15a7ea)"
                      disabled={
                        buttonDisabled || onholdId === ON_HOLD_STATUS
                        //  ||
                        // closeAllStatus === CLOSED
                      }
                      title={"Save row"}
                      onClick={() => {
                        savebutton === "edit"
                          ? handleSaveEditClick(dhubId)
                          : handleSaveClick(dhubId);
                        getAllRolesHistoryDetails();
                        getSignedOffToDHub(tableData);
                        getAllRolesHistoryDetails();
                      }}
                    />
                  </span>
                  <span>
                    <HiXCircle
                      cursor="pointer"
                      color="#9da5b1"
                      disabled={
                        buttonDisabled || onholdId === ON_HOLD_STATUS
                        // ||
                        // closeAllStatus === CLOSED
                      }
                      title={"Cancel row editing"}
                      onClick={() => {
                        Reset();
                        setValidationmsg(false);
                      }}
                    />
                  </span>
                </div>
              )}
            </>
          ) : (
            ""
          )}

          {rowData.signedOff == 1 ||
          onholdId == ON_HOLD_STATUS ||
          closeAllStatus === ON_HOLD_STATUS ||
          closeAllStatus === "1454" ||
          closeAllStatus === "1500" ? (
            // ||
            // closeAllStatus === CLOSED
            <>
              <AiFillEdit
                color="orange"
                disabled={
                  onholdId === ON_HOLD_STATUS
                  // || closeAllStatus === CLOSED
                }
                style={{
                  cursor: "not-allowed",
                  opacity: 0.5,
                  marginRight: "8px",
                }}
              />
              <span
                style={{
                  cursor: "not-allowed",
                  opacity: 0.5,
                  marginRight: "8px",
                }}
              >
                <AiFillDelete
                  disabled={
                    onholdId === ON_HOLD_STATUS
                    // || closeAllStatus === CLOSED
                  }
                  color="orange"
                />
              </span>
              {onholdId === ON_HOLD_STATUS ||
              closeAllStatus === ON_HOLD_STATUS ? (
                <span>
                  <MdNoteAlt
                    color="orange"
                    cursor="not-allowed"
                    title="Notes"
                    disabled
                  />
                </span>
              ) : (
                <span>
                  <MdNoteAlt
                    color="orange"
                    cursor="pointer"
                    title="Notes"
                    disabled={
                      onholdId === ON_HOLD_STATUS
                      // || closeAllStatus === CLOSED
                    }
                    onClick={() => {
                      let Id = rowData.partId;
                      setRowId(rowData.partId);
                      getNotesData(Id);
                      setNotesPopUP(true);
                    }}
                  />
                </span>
              )}
            </>
          ) : rowData?.ui == "new" || onholdId == ON_HOLD_STATUS ? (
            //  ||
            // closeAllStatus === CLOSED
            ""
          ) : (
            <>
              <AiFillEdit
                color="orange"
                cursor="pointer"
                title="Edit"
                disabled={
                  onholdId === ON_HOLD_STATUS
                  // || closeAllStatus === CLOSED
                }
                onClick={() => {
                  setEditFields((prev) => [...prev, rowData.partId]);
                  setRowId(rowData.partId);
                  setSavebutton("edit");
                  setEnableDropDown(true);
                  setEditor(true);
                  setValid(true);
                  setButtonDisabled(false);
                }}
              />
              {editFields.includes(rowData.partId) ? (
                <AiFillDelete
                  color="orange"
                  cursor="not-allowed"
                  title="Delete"
                  disabled={
                    onholdId === ON_HOLD_STATUS
                    //  || closeAllStatus === CLOSED
                  }
                />
              ) : rowData.roleId == 1447 ? (
                ""
              ) : (
                <AiFillDelete
                  color="orange"
                  cursor="pointer"
                  title="Delete"
                  disabled={
                    onholdId === ON_HOLD_STATUS
                    //  || closeAllStatus === CLOSED
                  }
                  onClick={() => {
                    setRoleDeletePopup(true);
                    setIsDeleteId(rowData.partId);
                  }}
                />
              )}
              <MdNoteAlt
                color="orange"
                cursor="pointer"
                disabled={
                  onholdId === ON_HOLD_STATUS
                  // || closeAllStatus === CLOSED
                }
                title="Notes"
                onClick={() => {
                  let Id = rowData.partId;
                  setRowId(rowData.partId);
                  getNotesData(Id);
                  setNotesPopUP(true);
                }}
              />
            </>
          )}
        </div>
      </>
    );
  };

  const handleDownload = async (doc) => {
    const loaderTime = setTimeout(() => {
      setOpen(true);
    }, 2000);

    try {
      const response = await axios.get(`${baseUrl}/SalesMS/sales/downloadDoc`, {
        params: { docId: doc.docId, type: doc.type },
        responseType: "blob",
      });

      clearTimeout(loaderTime);
      setOpen(false);

      if (response.status === 200) {
        const fileName = doc.name + "." + doc.extension;
        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.download = fileName;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      clearTimeout(loaderTime);
      setOpen(false);
      console.error("Error downloading the file:", error);
    }
  };

  const handleButtonClick = async () => {
    setToggleButton(!toggleButton);
    try {
      if (closeAllStatus == "1452") {
        const loaderTime = setTimeout(() => {
          setOpen(true);
        }, 2000);
        const responseFalse = await axios.post(
          baseUrl + `/SalesMS/sales/postOnhold`,
          {
            dhubId: dealHuGetId,
            loggedUserId: loggedUserId,
            lastUpdatedDate: selectedDate,
          }
        );
        setOnholdId(responseFalse.data[0]?.dhubStatusId);
        opportunityHistory(opportunityId);
        fetchData();
        handleAddRolesDetails();
        setHoldSuccessMsg(true);
        setRestartSuccessMsg(false);
        setOpen(false);
        clearTimeout(loaderTime);
        setTimeout(() => {
          setHoldSuccessMsg(false);
        }, 2000);
      } else {
        const loaderTime = setTimeout(() => {
          setOpen(true);
        }, 2000);
        const responseTrue = await axios.post(
          baseUrl + `/SalesMS/sales/postOnholdToRestart`,
          {
            dhubId: dealHuGetId,
            loggedUserId: loggedUserId,
            lastUpdatedDate: selectedDate,
          }
        );
        setOnholdId(responseTrue.data[0]?.dhubStatusId);
        opportunityHistory(opportunityId);
        fetchData();
        setRestartSuccessMsg(true);
        setOpen(false);
        clearTimeout(loaderTime);
        setHoldSuccessMsg(false);
        setTimeout(() => {
          setRestartSuccessMsg(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error making Axios POST request:", error);
    }
  };

  const SfDocsTable = ({ sfDocs, onholdId }) => {
    return (
      <div className="darkHeader">
        <table className="table table-bordered table-striped attainTable ">
          <thead>
            <tr className="fs10" style={{ height: "32.76px" }}>
              <th className="">Document Name</th>
              <th style={{ textAlign: "center", width: "30%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {sfDocs?.data && sfDocs.data.length > 0 ? (
              sfDocs.data.map((doc) => (
                <tr key={doc.docId}>
                  <td>{doc.name}</td>
                  <td style={{ textAlign: "center" }}>
                    {doc.type == "DocLInk" && (
                      <div title="Download Document">
                        {onholdId === ON_HOLD_STATUS ||
                        closeAllStatus === ON_HOLD_STATUS ||
                        closeAllStatus == "1454" ||
                        closeAllStatus === "1500" ? (
                          <DownloadForOfflineRoundedIcon
                            style={{ color: "#6c9842", cursor: "not-allowed" }}
                          />
                        ) : (
                          <DownloadForOfflineRoundedIcon
                            style={{ color: "#6c9842", cursor: "pointer" }}
                            onClick={() => handleDownload(doc)}
                          />
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  No Document Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <CModal
        visible={versPopup}
        backdrop="static"
        className="ui-dialog Opportunity-Details-pop-table-wrapper"
        alignment="top"
        onClose={() => {
          setVersPopup(false);
        }}
      >
        <CModalHeader className="">
          <CModalTitle>
            <span className="">({opportunityName})</span>
          </CModalTitle>
        </CModalHeader>
        {validationmsg && (
          <div className="statusMsg error">
            <IoWarningOutline /> Please select the valid values for highlighted
          </div>
        )}
        {successmsg ? (
          <div className="statusMsg success">
            <BiCheck />
            Opportunity Saved Successfully
          </div>
        ) : (
          ""
        )}
        {dealHubDelete && (
          <div className="statusMsg success">
            <BiCheck />
            DealHub Deleted Successfully
          </div>
        )}
        {errorMessage && <div className="statusMsg error">{errorMessage}</div>}
        <CModalBody>
          <div className="col-12 p-0">
            {successMessage ? (
              <div className="statusMsg success">
                <BiCheck />
                {addMsg}
              </div>
            ) : (
              ""
            )}
            {deletemsg ? (
              <div className="statusMsg success">
                <BiCheck />
                Role Deleted Successfully
              </div>
            ) : (
              ""
            )}
            {initialOpen === 1 ? (
              ""
            ) : (
              <div
                className="statusMsg warning"
                style={{
                  fontStyle: "italic",
                  color: "#746d26",
                  fontSize: "12px",
                }}
              >
                <b>Note :</b> Click save to push Opportunity to DealHub
              </div>
            )}
            <div className="customCard  mt-2 mb-2">
              <div className="group mb-1 customCard ">
                <div className="col-md-12  collapseHeader dhtop px-2">
                  <h2>Opportunity Details</h2>
                  <div className="dhTextGroup">
                    <label htmlFor="dhub_status">DealHub Status</label>
                    <span>:</span>
                    <div>
                      <select
                        name="dhub_status"
                        id="dhub_status"
                        disabled={selectedStatus !== SIGNED_OFF_STATUS}
                        value={selectedStatus}
                        onChange={handleStatusChange}
                      >
                        {selectedStatus == CLOSED_STATUS ||
                        selectedStatus == SIGNED_OFF_STATUS ? (
                          <>
                            <option value="1453">Signed Off</option>
                            {/* <option value="1454">Closed</option> */}
                          </>
                        ) : (
                          <>
                            <option value="1455">Open</option>
                            <option value="1452">In Progress</option>
                            <option value="1453">Signed Off</option>
                            {/* <option value="1454">Closed</option> */}
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="dhTextGroup">
                    <label htmlFor="dhub_status">Last Action By</label>
                    <span>:</span>
                    <span title={push || "NA"}>{push || "NA"}</span>
                  </div>

                  <div className="dhTextGroup">
                    <label htmlFor="dhub_status">Last Action On</label>
                    <span>:</span>
                    <span
                      title={moment(currentOn).format("DD-MMM-yyyy") || "NA"}
                    >
                      {currentOn == null || currentOn == ""
                        ? "NA"
                        : moment(currentOn).format("DD-MMM-yyyy") || "NA"}
                    </span>
                  </div>
                  <div className="dhTextGroup">
                    <button
                      className="btn btn-primary"
                      title="Show History"
                      onClick={() => {
                        setHistoryPopUp(true);
                        getAllRolesHistoryDetails();
                      }}
                    >
                      <FaHistory />
                    </button>
                  </div>
                </div>
                {successmessage ? (
                  <div className="statusMsg success">
                    <span>
                      <BiCheck />
                      Opportunity moved to DealHub Successfully
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {holdSuccessMsg ? (
                  <div className="statusMsg success">
                    <span>
                      <BiCheck />
                      Opportunity moved to On hold Successfully
                    </span>
                  </div>
                ) : (
                  ""
                )}
                {closedSuccessMsg ? (
                  <div className="statusMsg success">
                    <span>
                      <BiCheck />
                      Opportunity Closed Successfully
                    </span>
                  </div>
                ) : (
                  ""
                )}

                {restartSuccessMsg ? (
                  <div className="statusMsg success">
                    <span>
                      <BiCheck />
                      Opportunity put back to restart Successfully
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="group-content row">
                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      Customer Name
                    </label>
                    <span className="col-1 p-0">: </span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.customer_name || "NA"}
                        >
                          {Details.customer_name || "NA"}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      Contract Type
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.contract_type || "NA"}
                        >
                          {Details.contract_type || "NA"}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      Amount
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p className="col-6 ellipsis" title={Details.amount}>
                          $&nbsp;
                          {Details.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                          })}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      Probability
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.probability || 0}
                        >
                          {Details.probability || 0} %
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      Add To Call
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.addToCall || "NA"}
                        >
                          {Details.addToCall || "NA"}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      Offering
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.offering_name || "NA"}
                        >
                          {Details.offering_name || "NA"}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      CSL
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.opp_csl || "NA"}
                        >
                          {Details.opp_csl || "NA"}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      DP
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.opp_dp || "NA"}
                        >
                          {Details.opp_dp || "NA"}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>

                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="name-input-inline">
                      DealHub Owner
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.owner || "NA"}
                        >
                          {Details.owner || "NA"}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>

                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      Primary Competitor
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.primary_competitor || "NA"}
                        >
                          {Details.primary_competitor || "NA"}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-md-4">
                  <div className="form-group row flexStart">
                    <label className="col-5" htmlFor="name-input-inline">
                      Is Global Delivery Included?
                    </label>
                    <span className="col-1 p-0">:</span>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <p
                          className="col-6 ellipsis"
                          title={Details.is_global_delivery_included || "NA"}
                        >
                          {Details.is_global_delivery_included || "NA"}
                        </p>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row ellipsis">
                    <label className="col-5" htmlFor="name-input-inline">
                      Opportunity Closed Date
                    </label>
                    <span className="col-1 p-0">:</span>
                    {(tableData?.length > 0 && tableData[0]?.Closed !== null) ||
                    tableData[0]?.Closed == ""
                      ? tableData.map((Details, index) => (
                          <p
                            key={index}
                            className="col-6 ellipsis"
                            title={moment(Details.Closed).format("DD-MMM-yyyy")}
                          >
                            {Details.Closed == null || Details.Closed === ""
                              ? "NA"
                              : moment(Details.Closed).format("DD-MMM-yyyy")}
                          </p>
                        ))
                      : closedDate.length > 0 && (
                          <p className="col-6 ellipsis">
                            {moment(closedDate).format("DD-MMM-yyyy")}
                          </p>
                        )}
                  </div>
                </div>
                <div>
                  <div className="form-group  row">
                    <label
                      className="col-12 ellipsis"
                      htmlFor="name-input-inline"
                    >
                      Opportunity Description
                    </label>
                    {tableData?.length > 0 ? (
                      tableData.map((Details) => (
                        <div className="col-12 readonlyTxt">
                          <span readOnly title={Details.description || "NA"}>
                            {Details.description || "NA"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="col-6 ellipsis" title={"NA"}>
                        {"NA"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center ">
                {initialOpen !== 1 ||
                (selectedStatus == CLOSED_STATUS &&
                  closeAllStatus !== CLOSED_STATUS &&
                  trueValue !== "true") ? (
                  <button
                    className="btn btn-primary"
                    title={"Save"}
                    onClick={() => {
                      DHubPush(opportunityId);
                      getSignedOffToDHub(dhubId, tableData);
                      opportunityHistory(opportunityId);
                    }}
                  >
                    <TfiSave size="1.2em" /> Save
                  </button>
                ) : (
                  ""
                )}
                <button
                  className="btn btn-primary"
                  title={"Cancel"}
                  onClick={() => {
                    setVersPopup(false);
                    setCheckedDhub(false);
                    setButtonDisabledState("");
                    // fetchData();
                  }}
                >
                  <ImCross /> Cancel
                </button>
                {(buttonDisabledState === 1 || initialOpen === 1) &&
                closeAllStatus !== CLOSED &&
                closeAllStatus !== "1500" ? (
                  <button
                    className="btn btn-primary"
                    title={"Delete"}
                    onClick={() => {
                      setDeleteDhubPopUp(true);
                    }}
                  >
                    <TfiSave /> Delete
                  </button>
                ) : (
                  ""
                )}
                {initialOpen !== 1 ||
                closeAllStatus === CLOSED_STATUS ||
                closeAllStatus == "1454" ||
                closeAllStatus == "1500" ? (
                  ""
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      handleButtonClick();
                      // fetchData();
                    }}
                  >
                    <TfiSave />
                    {/* {(toggleButton === true &&
                      closeAllStatus === ON_HOLD_STATUS) ||
                    closeAllStatus !== OPEN_STATUS
                      ? //  ||closeAllStatus === CLOSED
                        "Restart"
                      : "On hold"} */}

                    {closeAllStatus !== "1452" ? "Restart" : "On hold"}
                  </button>
                )}
              </div>
            </div>
          </div>
          {validationMsg && (
            <div className="statusMsg error">
              {"Duplicate Participants are not allowed"}
            </div>
          )}

          {initialOpen === 1 ? (
            <div className="col-12 p-0 roleMappingTable darkHeader">
              <div
                className="col-md-12"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "1px",
                  backgroundColor: " rgb(236, 235, 235)",
                  width: "100%",
                  marginLeft: "0px",
                  height: "30px",
                }}
              >
                <tr>
                  <th>
                    <h2
                      style={{ color: "#2e88c5", fontSize: "14px", margin: 0 }}
                    >
                      Participants
                    </h2>
                  </th>
                </tr>
              </div>
              <DataTable
                value={products}
                className="primeReactDataTable"
                editMode="row"
                rows={25}
                showGridlines
                dataKey="id"
                emptyMessage={addHandler1}
                paginator
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 15, 25, 50]}
                paginationComponentOptions={{
                  rowsPerPageText: "Records per page:",
                  rangeSeparatorText: "out of",
                }}
                currentPageReportTemplate="View {first} - {last} of {totalRecords} "
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
              >
                <Column
                  field="Name"
                  header={(rowData) => {
                    return (
                      <>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          {initialOpen === 1 &&
                          closeAllStatus !== CLOSED_STATUS ? (
                            <button
                              className="btn btn-primary me-2"
                              disabled={
                                rowData.props.value.find(
                                  (item) => item.ui === "new"
                                ) !== undefined ||
                                onholdId == ON_HOLD_STATUS ||
                                closeAllStatus === ON_HOLD_STATUS ||
                                closeAllStatus == "1454" ||
                                closeAllStatus === "1500"
                              }
                              title={"Add new row"}
                              onClick={() => {
                                addHandler1();
                                setSavebutton("save");
                              }}
                            >
                              <MdOutlineAdd size="1.2em" />
                            </button>
                          ) : (
                            ""
                          )}
                          Roles
                        </div>
                      </>
                    );
                  }}
                  body={(rowData, column) => renderDropdown(rowData, column)}
                ></Column>

                <Column
                  field="lkup_name"
                  header="Resource Name"
                  body={resourceAutocomplete}
                ></Column>
                <Column
                  field="assign_dt"
                  header="Assgn.Date"
                  body={assignedDate}
                ></Column>
                <Column
                  field="effort_hrs"
                  header="Est.hrs"
                  body={effectiveHours}
                ></Column>
                <Column
                  field="actual_hrs"
                  header="Act.hrs"
                  body={actualHours}
                ></Column>
                <Column
                  field="signedOff"
                  header="Sign Off"
                  body={signedOff}
                ></Column>
                <Column
                  field="signed_off_date"
                  header="Sign Off Date"
                  body={signedDate}
                ></Column>
                <Column
                  field="Notes"
                  header="Comments"
                  body={Comments}
                  style={{ width: "25%" }}
                ></Column>
                <Column
                  key={"Action"}
                  field="Action"
                  header="Action"
                  headerStyle={{ width: "100px", backgroundColor: "#eeecec" }}
                  bodyStyle={{ textAlign: "center" }}
                  body={(rowData) => {
                    return renderRowActions(rowData, setEditFields, editFields);
                  }}
                />
              </DataTable>
            </div>
          ) : (
            ""
          )}

          <div className="col-md-12" style={{ display: "flex", gap: "5px" }}>
            {open ? <Loader handleAbort={handleAbort} /> : ""}
            <>
              {docDisplay && (
                <div style={{ width: "50%" }}>
                  <div
                    className="col-md-12"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                      width: "100%",
                      marginLeft: "4px",
                      height: "30px",
                    }}
                  >
                    <tr>
                      <th>
                        <h2
                          style={{
                            color: "#2e88c5",
                            fontSize: "14px",
                            margin: 0,
                          }}
                        >
                          SF Documents
                        </h2>
                      </th>
                    </tr>
                  </div>
                  <SfDocsTable sfDocs={sfDocs} onholdId={onholdId} />
                </div>
              )}
            </>
            {notesPopUp && (
              <div className="col-md-6 darkHeader mt-1">
                {notessuccessmessage ? (
                  <div className="statusMsg success">
                    <BiCheck />
                    {"Notes Saved Successfully"}
                  </div>
                ) : (
                  ""
                )}
                {notesValidation && (
                  <div className="statusMsg error">
                    <AiFillWarning />
                    {"Please enter the comments"}
                  </div>
                )}
                <h2
                  style={{
                    color: "rgb(46, 136, 197)",
                    fontSize: "14px",
                    margin: "0px",
                    height: "26px",
                  }}
                >
                  Notes : &nbsp; {userName} &nbsp;({roleName})
                </h2>
                <DataTable
                  value={notesData}
                  className="primeReactDataTable"
                  editMode="row"
                  rows={10}
                  showGridlines
                  dataKey="id"
                  emptyMessage="No Data Found"
                  paginator
                  paginationPerPage={5}
                  paginationRowsPerPageOptions={[5, 15, 25, 50]}
                  paginationComponentOptions={{
                    rowsPerPageText: "Records per page:",
                    rangeSeparatorText: "out of",
                  }}
                  currentPageReportTemplate="View {first} - {last} of {totalRecords} "
                  paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                  rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
                >
                  <Column
                    field="date"
                    header="Date"
                    style={{ width: "15%" }}
                    body={renderdate}
                  ></Column>
                  <Column
                    field="NotesComments"
                    header="Comments"
                    body={rendernotescomments}
                  ></Column>
                </DataTable>
                <div className="form-group col-md-2 btn-container-events center my-3">
                  <button
                    className="btn btn-primary"
                    disabled={
                      validNotes ||
                      closeAllStatus === CLOSED_STATUS ||
                      closeAllStatus === "1454" ||
                      closeAllStatus === "1500"
                    }
                    title={"Add new row"}
                    onClick={() => {
                      addHandlernotes();
                    }}
                  >
                    <MdOutlineAdd size="1.2em" /> Add
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={buttonDisabledNotes}
                    title={"Save row"}
                    onClick={() => {
                      postnotes(notesData);
                    }}
                  >
                    <TfiSave size="0.9em" /> Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    disabled={buttonDisabledNotes}
                    title={"Cancel"}
                    onClick={() => {
                      closeNotes();
                    }}
                  >
                    <ImCross /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </CModalBody>
      </CModal>
      {roleDeletePopup ? (
        <OppRoleDeletePopUp
          roleDeletePopup={roleDeletePopup}
          setRoleDeletePopup={setRoleDeletePopup}
          deleteId={isDeleteId}
          deletemsg={deletemsg}
          setDeletemsg={setDeletemsg}
          isDeleteId={isDeleteId}
          setIsDeleteId={setIsDeleteId}
          setDhubId={setDhubId}
          handleAddRolesDetails={handleAddRolesDetails}
          Reset={Reset}
          opportunityHistory={opportunityHistory}
          opportunityId={opportunityId}
        />
      ) : (
        ""
      )}
      {deleteDhubPopUp && (
        <OpportunityDeleteDhub
          deleteDhubPopUp={deleteDhubPopUp}
          setDeleteDhubPopUp={setDeleteDhubPopUp}
          opportunityId={opportunityId}
          fetchData={fetchData}
          // displayTableData={displayTableData}
          dataVar={dataVar}
          setDealHubDelete={setDealHubDelete}
          setVersPopup={setVersPopup}
          DHubPush={DHubPush}
          setButtonDisabledState={setButtonDisabledState}
          setCurrentOn={setCurrentOn}
          handleClick={handleClick}
        />
      )}
      {historyPopUp && (
        <OpenHistoryPopUp
          historyPopUp={historyPopUp}
          setHistoryPopUp={setHistoryPopUp}
        />
      )}
    </div>
  );
}
export default DealHubOpportunityPopUp;
