import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaSave,
  FaDownload,
  FaCaretDown,
} from "react-icons/fa";
import { getTableData } from "./AuditCpSetupTable";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { CCollapse, CModalTitle } from "@coreui/react";
import axios from "axios";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import Draggable from "react-draggable";
import DatePicker from "react-datepicker";
import moment from "moment";
import { environment } from "../../environments/environment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "ag-grid-community";
import { AiFillDelete, AiFillEdit, AiFillWarning } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { BiCheck } from "react-icons/bi";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { RiAddLine, RiInformationLine } from "react-icons/ri";
import { MdOutlineFileUpload } from "react-icons/md";
import { FileUpload, Height } from "@mui/icons-material";
import Loader from "../Loader/Loader";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { IoInformationCircleOutline } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
const DeletePopUp = (props) => {
  const {
    deletePopup,
    setDeletePopup,
    setEditedData,
    editedData,
    handleClick,
    setDeleteMessage,
    setDelMsg,
  } = props;



  const baseUrl = environment.baseUrl;


  const deleteFnc = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/governancems/AuditCPSetup/deleteAuditCheckPointsById?id=${editedData.id}`,
    }).then((res) => {
      handleClick();
      setDeletePopup(false);
      console.log(res.data.status, "response");
      console.log(res.data.message, "message");
      res.data.status == true ? setDeleteMessage(true) : setDelMsg(true);
      setTimeout(() => {
        setDeleteMessage(false);
        setDelMsg(false);
      }, 3000);
    });
  };
  return (
    <div>
      {/* <Draggable> */}
      <CModal
        visible={deletePopup}
        size="xs"
        className="ui-dialog"
        onClose={() => setDeletePopup(false)}
      >
        <CModalHeader className="">
          <CModalTitle>
            <span className="">Delete Audit Checkpoint</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h6>Are you sure you want delete Audit Checkpoint ?</h6>
          <div className="btn-container center my-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                deleteFnc();
              }}
            >
              <AiFillDelete /> Delete{" "}
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
      {/* </Draggable> */}
    </div>
  );
};
const EditPopUp = (props) => {
  const {
    editPopup,
    setEditPopup,
    editId,
    handleClick,
    editedData,
    setEditAddmsg,
  } = props;

  const [fromDate, SetfromDate] = useState(null);
  const [from, Setfrom] = useState(null);
  const [tillDate, SetTillDate] = useState(null);
  const [editData, setEditData] = useState(null);
  const [validationMessage, setValidationMessage] = useState(false);
  const ref = useRef([]);
  const baseUrl = environment.baseUrl;
  const [formData, setFormData] = useState(editedData);

  const handleAddClick = () => {
    GlobalCancel(ref);

    if (editedData.project_type == "" || editedData.project_phase == "") {
      let valid = GlobalValidation(ref);
      if (valid) {
        {
          setValidationMessage(true);
        }
        return;
      }
    } else {
      console.log(editedData, "editedData");
      console.log(formData, "formData");
      setValidationMessage(false);
      axios({
        method: "post",
        // url: `http://localhost:8090/governancems/AuditCPSetup/postAuditCheckPoints`,
        url: baseUrl + `/governancems/AuditCPSetup/postAuditCheckPoints`,
        data: {
          id: editedData.id,
          projectType: editedData.project_type,
          projectPhase: editedData.project_phase,
          checkPoint: editedData.check_point,
          initiationWeightage: editedData.initiation_weightage,
          steadyStateWeightage: editedData.steady_state_weightage,
          closureWeightage: editedData.closure_weightage,
          isoDetails: editedData.iso_details,
          isActive: 1,
          validFrom:
            formData.validFrom == null
              ? moment(editedData.valid_from).format("yyyy-MM-DD")
              : formData.validFrom == ""
              ? ""
              : formData.validFrom,
          validTill:
            formData.validTill == null
              ? moment(editedData.valid_till).format("yyyy-MM-DD")
              : formData.validTill == ""
              ? ""
              : formData.validTill,
          // formData.validTill !== " "
          //   ? formData.validTill
          //   : moment(editedData.valid_till).format("yyyy-MM-DD"),
        },
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        const data = response.data;
        console.log("success", data);
        setEditData(data);
        setEditPopup(false);
        handleClick();
        setEditAddmsg(true);
        setTimeout(() => {
          setEditAddmsg(false);
        }, 3000);
      });
    }
  };
  useEffect(
    () => {
      SetfromDate(moment(editedData.valid_from)._d);
      SetTillDate(
        editedData.valid_till == "" ? "" : moment(editedData.valid_till)._d
      );
    },
    [editedData],
    [formData],
    [formData.validFrom]
  );

  return (
    <div>
      {/* <Draggable> */}
      <CModal
        visible={editPopup}
        size="lg"
        className="ui-dialog "
        backdrop="static"
        onClose={() => setEditPopup(false)}
        style={{ border: "0px" }}
      >
        <CModalHeader className="hgt22">
          <CModalTitle>
            <span className="ft16">Edit Check Point Dates</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            {validationMessage ? (
              <div className="statusMsg error">
                {" "}
                <AiFillWarning /> Please select the valid values for highlighted
                fields{" "}
              </div>
            ) : (
              ""
            )}
            <div className="group-content row">
              <div className="col-6">
                <div className="form-group row ">
                  <label className="col-5">
                    Valid From<span className="error-text">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <span className="col-6">
                    <div
                      className="datepicker cancel"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <DatePicker
                        id="validFrom"
                        className="cancel"
                        selected={fromDate}
                        showMonthDropdown
                        dateFormat="MMM-yyyy"
                        showMonthYearPicker
                        defaultValue={moment(editedData.valid_from)._d}
                        dropdownMode="select"
                        onChange={(e) => {
                          Setfrom(e);
                          console.log(from, "line no-----------------date");
                          SetfromDate(e);
                          setFormData((prev) => ({
                            ...prev,
                            ["validFrom"]: moment(e).format("yyyy-MM-DD"),
                          }));
                        }}
                        onKeyDown={(e) => {}}
                      />
                    </div>
                  </span>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group row ">
                  <label className="col-5">Valid Till</label>
                  <span className="col-1">:</span>
                  <span className="col-6">
                    <div className="datepicker cancel">
                      <DatePicker
                        id="validTill"
                        className="cancel"
                        selected={tillDate}
                        showMonthDropdown
                        showMonthYearPicker
                        dateFormat="MMM-yyyy"
                        // minDate={formData.validFrom}
                        minDate={fromDate}
                        defaultValue={moment(editedData.valid_till)._d}
                        dropdownMode="select"
                        onChange={(e) => {
                          SetTillDate(e);
                          setFormData((prev) => ({
                            ...prev,
                            ["validTill"]: moment(e).format("yyyy-MM-DD"),
                          }));
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                className="btn btn-primary "
                onClick={() => {
                  handleAddClick();
                }}
              >
                <FaSave />
                &nbsp;Save{" "}
              </button>
              <button
                className="btn btn-primary "
                onClick={() => {
                  setEditPopup(false);
                }}
              >
                <ImCross />
                Cancel
              </button>
            </div>
          </div>
        </CModalBody>
      </CModal>
      {/* </Draggable> */}
    </div>
  );
};
const AddPopUp = (props) => {
  const {
    addPopup,
    projectType,
    projectPhase,
    setaddPopup,
    handleClick,
    setAddmsg,
  } = props;
  const [fromDate, SetfromDate] = useState(null);
  const [tillDate, SetTillDate] = useState(null);
  const [addData, setAddData] = useState([]);
  const [monthFrom, setMonthFrom] = useState(new Date());
  const [monthTill, setMonthTill] = useState(new Date());
  const [validationMessage, setValidationMessage] = useState(false);

  const ref = useRef([]);
  const initialValue = {
    projectType: "",
    projectPhase: "",
    checkPoint: "",
    initiationWeightage: "",
    steadyStateWeightage: "",
    closureWeightage: "",
    isoDetails: "",
    isActive: 1,
    validFrom: "",
    validTill: "",
  };
  const [formData, setFormData] = useState(initialValue);

  const baseUrl = environment.baseUrl;

  const handleAddClick = () => {
    console.log(formData);
    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidationMessage(true);
      }
      return;
    }
    axios({
      method: "post",
      url: baseUrl + `/governancems/AuditCPSetup/postAuditCheckPoints`,
      // url: `http://localhost:8090/governancems/AuditCPSetup/postAuditCheckPoints`,
      data: {
        projectType: formData.projectType,
        projectPhase: formData.projectPhase,
        checkPoint: formData.checkPoint,
        initiationWeightage: formData.initiationWeightage,
        steadyStateWeightage: formData.steadyStateWeightage,
        closureWeightage: formData.closureWeightage,
        isoDetails: formData.isoDetails,
        isActive: 1,
        validFrom: formData.validFrom,
        validTill: formData.validTill,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const data = response.data;
      console.log("success", data);
      setAddData(data);
      setaddPopup(false);
      handleClick();
      setAddmsg(true);
      setTimeout(() => {
        setAddmsg(false);
      }, 3000);
      setValidationMessage(false);
    });
  };

  console.log(formData, "popup");
  const getName = (e) => {
    const { value, id } = e.target;

    setFormData({ ...formData, value });
  };
  return (
    <div>
      {/* <Draggable> */}
      <CModal
        visible={addPopup}
        size="md"
        className="ui-dialog "
        backdrop="static"
        onClose={() => setaddPopup(false)}
        style={{ border: "0px" }}
      >
        <CModalHeader className="hgt22">
          <CModalTitle>
            <span className="ft16">Add Check Point</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div>
            {validationMessage ? (
              <div className="statusMsg error">
                {" "}
                <AiFillWarning /> Please select the valid values for highlighted
                fields{" "}
              </div>
            ) : (
              ""
            )}
            <div className="group-content row">
              <div className="form-group row mb-2">
                <label className="col-5">
                  Type<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6">
                  <select
                    className="text textfield"
                    id="projectType"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {projectType.map((Item) => (
                      <option value={Item.value}> {Item.label}</option>
                    ))}
                  </select>
                </span>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5">
                  Phase<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6">
                  <select
                    className="text textfield"
                    id="projectPhase"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {projectPhase.map((Item) => (
                      <option value={Item.value}> {Item.label}</option>
                    ))}
                  </select>
                </span>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5">
                  Audit Checkpoints<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <input
                    type="Text"
                    id="checkPoint"
                    placeholder="Check Point"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["checkPoint"]: value,
                      }));
                    }}
                  />
                </span>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5">
                  ISO 9001:2015<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  <input
                    type="Text"
                    id="isoDetails"
                    placeholder="ISO Details"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["isoDetails"]: value,
                      }));
                    }}
                  />
                </span>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5">
                  Initiation Weightage <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[4] = ele;
                  }}
                >
                  <input
                    type="Text"
                    id="initiationWeightage"
                    placeholder="Initiation Weightage"
                    onChange={(e) => {
                      const input = e.target.value;
                      const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                      if (!regex.test(input)) {
                        e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                      }
                      // onChangetext(e);
                      // const { value, id } = e.target;

                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["initiationWeightage"]: input,
                      }));
                    }}
                  />
                </span>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5">
                  Steady State Weightage<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[5] = ele;
                  }}
                >
                  <input
                    type="Text"
                    id="steadyStateWeightage"
                    placeholder="Steady State Weightage"
                    // onChange={(e) => {
                    //   const { value, id } = e.target;
                    onChange={(e) => {
                      const input = e.target.value;
                      const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                      if (!regex.test(input)) {
                        e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                      }
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["steadyStateWeightage"]: input,
                      }));
                    }}
                  />
                </span>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5">
                  Closure Weightage<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[6] = ele;
                  }}
                >
                  <input
                    type="Text"
                    id="closureWeightage"
                    placeholder="Closure Weightage"
                    // onChange={(e) => {
                    //   const { value, id } = e.target;
                    onChange={(e) => {
                      const input = e.target.value;
                      const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                      if (!regex.test(input)) {
                        e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                      }

                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["closureWeightage"]: input,
                      }));
                    }}
                  />
                </span>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5">
                  Valid From<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span
                  className="col-6 datepicker"
                  ref={(ele) => {
                    ref.current[7] = ele;
                  }}
                >
                  <DatePicker
                    name="validFrom"
                    id="validFrom"
                    selected={fromDate}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                    onChange={(e) => {
                      SetfromDate(e);
                      setFormData((prev) => ({
                        ...prev,
                        ["validFrom"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setMonthFrom(e);
                    }}
                    placeholderText="Valid From"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </span>
              </div>
              <div className="form-group row mb-2">
                <label className="col-5">Valid Till</label>
                <span className="col-1 p-0">:</span>
                <span className="col-6">
                  <DatePicker
                    name="validTill"
                    id="validTill"
                    selected={tillDate}
                    minDate={fromDate}
                    onChange={(e) => {
                      SetTillDate(e);
                      setFormData((prev) => ({
                        ...prev,
                        ["validTill"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setMonthTill(e);
                    }}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                    placeholderText="Valid Till"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </span>
              </div>
              <div className="col-md-12" align="center">
                {" "}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddClick}
                >
                  <FaSave />
                  &nbsp;Save{" "}
                </button>{" "}
              </div>
            </div>
          </div>
        </CModalBody>
      </CModal>
      {/* </Draggable> */}
    </div>
  );
};
function UploadPopUp(props) {
  const { setUploadPopUp, uploadpopUp, handleClick } = props;
  const baseUrl = environment.baseUrl;
  const [dupliMsg, setDupliMsg] = useState([]);
  const [dupDisplay, setDupDisplay] = useState(false);
  const [tbaleData, setTbaleData] = useState([]);
  console.log(tbaleData, "tbaleData");

  const [selectedFile, setSelectedFile] = useState([]);
  const onFileChangeHandler = (e) => {
    console.log("in on file change handler");
    console.log(e.target.files[0], "e.target.files[0]");
    setSelectedFile(e.target.files[0]);
    console.log(e.target.files[0], "data");
  };
  const [key, setKey] = useState(0);
  const [message, setMessage] = useState(false);
  const [message1, setMessage1] = useState(false);
  const loggedUserId = localStorage.getItem("resId");
  const [tblDis, setTblDis] = useState(false);
  const [selctErr, setSelctErr] = useState(false);
  const [empty, setempty] = useState(false);
  const downloadEmployeeData = () => {
    const docUrl =
      baseUrl + `/CommonMS/document/downloadFile?documentId=74755190`;

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
      link.setAttribute("download", `Audit CheckPoints${extension}`);
      document.body.appendChild(link);
      link.click();
    });
  };
  const handleSaveClick = () => {
    setMessage(false);

    axios
      .postForm(
        baseUrl +
          `/SalesMS/pmo/uploadAuditCheckpoints?loggedUserId=${loggedUserId}`,
        // `http://localhost:8091/SalesMS/pmo/uploadAuditCheckpoints?loggedUserId=${loggedUserId}`,
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
        const data = res.data;
        console.log(data);

        setKey((prevKey) => prevKey + 1);
        setSelectedFile([]);

        if (data.status == "success") {
          setMessage(true);
          handleClick();
          setTimeout(() => {
            setUploadPopUp(false);
          }, 3000);
        } else if (data.message == "Please select a valid file") {
          setempty(true);
          setTimeout(() => {
            setempty(false);
          }, 2000);
          setSelctErr(false);
          setMessage(false);
          setDupDisplay(false);
          setTblDis(false);
        } else if (
          data.message == "Please remove the Duplicates" &&
          data.status == "error"
        ) {
          setDupDisplay(true);
          setTimeout(() => {
            setDupDisplay(false);
          }, 2000);
          setempty(false);
          setSelctErr(false);
          setMessage(false);
          setDupliMsg(data.message);
          setTbaleData(data?.data[0]?.data);
          setTblDis(true);
        } else if (data.status == "error") {
          setSelctErr(true);
          setTimeout(() => {
            setSelctErr(false);
          }, 2000);
          setMessage(false);
          setempty(false);
          setDupDisplay(false);
          setTblDis(false);
        } else if (
          data.message == "Some maps in the dataList are missing required keys."
        ) {
          setempty(true);
          setTimeout(() => {
            setempty(false);
          }, 2000);
          setSelctErr(false);
          setMessage(false);
          setDupDisplay(false);
          setTblDis(false);
        } else {
          setDupliMsg("");
        }
        setTimeout(() => {
          setMessage(false);
        }, 2000);
      });
  };

  return (
    <div>
      {/* <Draggable> */}
      <CModal
        alignment="center"
        backdrop="static"
        size="lg"
        visible={uploadpopUp}
        className="ui-dialog"
        onClose={() => {
          setUploadPopUp(false);
        }}
      >
        <CModalHeader style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            <span>Add Check Points</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {message && (
            <div className="statusMsg success">
              <BiCheck />
              {"Data Uploaded successfully"}
            </div>
          )}
          {dupDisplay && (
            <div className="statusMsg error">
              <AiFillWarning />
              {dupliMsg}
            </div>
          )}
          {selctErr && (
            <div className="statusMsg error">
              <AiFillWarning />
              {"Please select a file to upload"}
            </div>
          )}
          {empty && (
            <div className="statusMsg error">
              <AiFillWarning />
              {"Please select a valid file"}
            </div>
          )}

          <div className="mod-md-12 row">
            <div className="col-8">
              <div
                className="statusMsg warning mb-3"
                style={{
                  color: "#746d26",
                  fontSize: "12px",
                }}
              >
                <RiInformationLine /> Click on Template Button to download the
                audit check list template.
              </div>
            </div>
            <div className="col-2"></div>
            <div className="group-content col-2 row">
              <button
                style={{ marginLeft: "auto" }}
                className="btn btn-primary float-end mt-1"
                onClick={() => {
                  downloadEmployeeData();
                }}
              >
                <FaDownload /> Template
              </button>
            </div>
          </div>
          <div className="mod-md-12 row">
            <div className="col-md-6">
              <input
                key={key}
                type="file"
                name="file"
                className="fileUpload unique1 form-control"
                id="file"
                onChange={onFileChangeHandler}
              />
            </div>
            <div className="group-content col-2 row mb-2">
              <button
                style={{ marginLeft: "auto" }}
                className="btn btn-primary float-end"
                onClick={() => {
                  handleSaveClick();
                }}
              >
                <FileUpload /> Upload
              </button>
            </div>
          </div>
          <div className="mod-md-1"></div>
          <div className="mod-md-10 row">
            <div style={{ width: "100%", overflowX: "auto" }}>
              {tblDis && (
                <table
                  className="table table-bordered table-striped attainTable darkHeader toHead"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr
                      className="fs10 "
                      style={{ backgroundColor: "#f2f5f6" }}
                    >
                      <th style={{ textAlign: "center" }} className="ellipsis">
                        S. No
                      </th>
                      <th style={{ textAlign: "center" }} className="ellipsis">
                        Phase
                      </th>
                      <th style={{ textAlign: "center" }} className="ellipsis">
                        Type
                      </th>
                      <th style={{ textAlign: "center" }} className="ellipsis">
                        Checkpoints
                      </th>
                      <th style={{ textAlign: "center" }} className="ellipsis">
                        ISO Details
                      </th>
                      <th style={{ textAlign: "center" }} className="ellipsis">
                        Initiation Weightage
                      </th>
                      <th style={{ textAlign: "center" }} className="ellipsis">
                        Steady State Weightage
                      </th>
                      <th style={{ textAlign: "center" }} className="ellipsis">
                        Closure Weightage{" "}
                      </th>
                      <th style={{ textAlign: "center" }} className="ellipsis">
                        Comments
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tbaleData?.map((item, index) => (
                      <tr
                        key={index}
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }}
                      >
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td style={{ width: "200px !important" }}>
                          {item.project_type}
                        </td>
                        <td>{item.project_phase}</td>
                        <td>{item.checkpoint}</td>
                        <td style={{ textAlign: "right" }}>
                          {item.iso_details}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {item.initiation_weightage}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {item.steady_state_weightage}
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {item.closure_weightage}
                        </td>
                        <td>{item.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <div className="mod-md-1 ml-2"></div>
        </CModalBody>
      </CModal>
      {/* </Draggable> */}
    </div>
  );
}
function AuditCpSetup() {
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [dataAr, setDataAr] = useState([]);
  const [data, setData] = useState([]);
  const [projectPhase, setProjectPhase] = useState([]);
  const [selectedProjectPhase, setSelectedProjectPhase] = useState([]);
  const [addPopup, setaddPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [projectType, setProjectType] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [type, setType] = useState("add");
  const [editedData, setEditedData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [dataAccess, setDataAccess] = useState([]);
  const [loader, setLoader] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [accessLevel, setAccessLevel] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [editmsg, setEditAddmsg] = useState(false);
  const [editId, setEditId] = useState();
  const [validationMessage, setValidationMessage] = useState(false);
  const baseUrl = environment.baseUrl;
  const [loaderState, setLoaderState] = useState(false);
  const [uploadpopUp, setUploadPopUp] = useState(false);
  const abortController = useRef(null);
  const [delMsg, setDelMsg] = useState(false);

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight = useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  const loggedUserId = localStorage.getItem("resId");

  const ref = useRef([]);
  // let valid = GlobalValidation(ref);

  const [routes, setRoutes] = useState([]);
  let textContent = "Governance";
  let currentScreenName = ["Audit Check Points List"];

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
  }, []);

  const getMenus = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        // setAccessLevel(revenueForcastSubMenu);
        const revenueForcastSubMenu = resp.data
          .find((item) => item.display_name === "Governance")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Audit CP Setup"
          );
        const accessLevel = revenueForcastSubMenu?.userRoles.includes("561")
          ? 561
          : revenueForcastSubMenu?.userRoles.includes("911")
          ? 911
          : revenueForcastSubMenu?.userRoles.includes("908")
          ? 908
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
        `/CommonMS/security/authorize?url=/pcqa/auditCheckPointLists&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  const initialValue = {
    prjType: "-1",
    prjPhase: "-1",
    isSearch: "1",
  };
  const [formData, setFormData] = useState(initialValue);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  useEffect(() => {}, [editedData]);
  const getprojectTypeFnc = () => {
    axios
      .get(baseUrl + `/governancems/AuditCPSetup/getProjectTypes`)
      .then((Response) => {
        let types = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.lkup_name,
              value: e.id,
            };
            types.push(countryObj);
          });
        setProjectType(types);

        setSelectedProjectType(types);
      })
      .catch((error) => console.log(error));
  };
  console.log(data, "lione no---------------------322");
  const getprojectPhaseFnc = () => {
    axios
      .get(baseUrl + `/governancems/AuditCPSetup/getProjectPhase`)
      .then((Response) => {
        let phases = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.lkup_name,
              value: e.id,
            };
            phases.push(countryObj);
          });
        setProjectPhase(phases);
        setSelectedProjectPhase(phases);
      })
      .catch((error) => console.log(error));
  };

  const handleClick = () => {
    GlobalCancel(ref);
    if (formData.prjType == "" || formData.prjPhase == "") {
      let valid = GlobalValidation(ref);

      if (valid) {
        {
          setValidationMessage(true);
        }
        return;
      }
    } else {
      setValidationMessage(false);
      // setLoaderState(true);
      abortController.current = new AbortController();
      const loaderTime = setTimeout(() => {
        setLoaderState(true);
      }, 2000);
      axios
        .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
        .then((resp) => {
          // setAccessLevel(revenueForcastSubMenu);
          const revenueForcastSubMenu = resp.data
            .find((item) => item.display_name === "Governance")
            .subMenus.find(
              (subMenu) => subMenu.display_name === "Audit CP Setup"
            );

          const accessLevel = revenueForcastSubMenu?.userRoles.includes("561")
            ? 561
            : revenueForcastSubMenu?.userRoles.includes("911")
            ? 911
            : revenueForcastSubMenu?.userRoles.includes("908")
            ? 908
            : null;
          console.log(accessLevel);
          setDataAccess(accessLevel);
        });
      console.log(accessLevel, dataAccess);
      axios({
        method: "post",
        url: baseUrl + `/governancems/AuditCPSetup/getCustProjects`,
        signal: abortController.current.signal,

        data: {
          prjType: formData.prjType,
          prjPhase: formData.prjPhase,
          isSearch: 1,
        },
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        const data = response.data;
        clearTimeout(loaderTime);
        getMenus();
        console.log(data, "line no------48");

        const Headerdata = [
          {
            sno: "SNo",
            proj_type: "Type",
            proj_phase: "Phase",
            check_point: "Audit Checkpoints",
            iso_details: "ISO 9001:2015",
            initiation_weightage: "Initiation Weightage",
            steady_state_weightage: "Steady State Weightage",
            closure_weightage: "Closure Weightage",
            valid_from: "Valid From",
            valid_till: "Valid Till",
            Action: "Action",
            // Action: "Action",
          },
        ];
        // console.log(accessLevel);
        // if (accessLevel == 908) {
        //   Headerdata.forEach((header) => {
        //     delete header.Action;
        //   });
        // }
        console.log(headerData);
        setLinkColumns(data);
        var tempData = [];
        data.forEach(function (d, index) {
          d["sno"] = index + 1;
          tempData.push(d);
        });
        setData(Headerdata.concat(tempData));
        setValidationMessage(false);
        setLoaderState(false);

        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      });
    }
  };
  console.log(dataAccess);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };
  console.log(dataAccess);
  useEffect(() => {
    let tdata = getTableData();
    setDataAr(tdata);
    handleClick();
    getprojectPhaseFnc();
    getprojectTypeFnc();
  }, []);
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  const AddPopUPFnc = () => {
    setaddPopup(true);
  };
  const LinkTemplate = (data) => {
    let rou = linkColumns[0];
    return (
      <div>
        {dataAccess == 908 ? (
          <div style={{ cursor: "not-allowed", textAlign: "center" }}>
            <>
              {
                <AiFillEdit
                  data-toggle="tooltip"
                  title="Edit"
                  color="grey"
                  style={{ cursor: "not-allowed" }}
                  type="edit"
                  size="1.2em"
                />
              }{" "}
              &nbsp;
              {
                <AiFillDelete
                  className="ellipsis"
                  data-toggle="tooltip"
                  title="Delete"
                  color="grey"
                  style={{ cursor: "not-allowed", pointerEvents: "none" }}
                  type="delete"
                />
              }
            </>
          </div>
        ) : (
          <div align="center">
            <div>
              <>
                {
                  <AiFillEdit
                    data-toggle="tooltip"
                    title="Edit"
                    color="orange"
                    cursor="pointer"
                    type="edit"
                    size="1.2em"
                    onClick={() => {
                      setEditedData(data),
                        setEditId(data.id),
                        setEditPopup(true),
                        setType("edit");
                    }}
                  />
                }{" "}
                &nbsp;
                {
                  <AiFillDelete
                    className="ellipsis"
                    data-toggle="tooltip"
                    title="Delete"
                    color="orange"
                    cursor="pointer"
                    type="delete"
                    onClick={() => {
                      setEditedData(data), setDeletePopup(true);
                      setType("delete");
                    }}
                  />
                }
              </>
            </div>
          </div>
        )}
      </div>
    );
  };
  // const HelpPDFName = "";
  // const Header = "";
  const SNo = (data) => {
    return (
      <div
        className="ellipsis"
        align="center"
        data-toggle="tooltip"
        title={data.sno}
      >
        {data.sno}
      </div>
    );
  };
  const typeToolip = (data) => {
    return (
      <div className="ellipsis" align="left" title={data.check_point}>
        {data.check_point}
      </div>
    );
  };
  const typeToolipProjType = (data) => {
    return (
      <div className="ellipsis" align="left" title={data.proj_type}>
        {data.proj_type}
      </div>
    );
  };
  const typeToolipProjPhase = (data) => {
    return (
      <div className="ellipsis" align="left" title={data.proj_phase}>
        {data.proj_phase}
      </div>
    );
  };
  const typeTooltipIsoDetails = (data) => {
    return (
      <div className="ellipsis" align="right" title={data.iso_details}>
        {data.iso_details}
      </div>
    );
  };
  const typeToolipinitiationWeightage = (data) => {
    return (
      <div className="ellipsis" align="right" title={data.initiation_weightage}>
        {data.initiation_weightage}
      </div>
    );
  };
  const typeToolipSteadyStateWeightage = (data) => {
    return (
      <div
        className="ellipsis"
        align="right"
        title={data.steady_state_weightage}
      >
        {data.steady_state_weightage}
      </div>
    );
  };
  const typeToolipClosureWeightage = (data) => {
    return (
      <div className="ellipsis" align="right" title={data.closure_weightage}>
        {data.closure_weightage}
      </div>
    );
  };
  const typeToolipValidFrom = (data) => {
    return (
      <div className="ellipsis" align="Center" title={data.valid_from}>
        {data.valid_from}
      </div>
    );
  };
  console.log(dataAccess);
  const typeToolipValidTill = (data) => {
    return (
      <div className="ellipsis" align="Center" title={data.valid_till}>
        {data.valid_till}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "sno"
            ? SNo
            : col == "iso_details"
            ? typeTooltipIsoDetails
            : col == "proj_type"
            ? typeToolipProjType
            : col == "proj_phase"
            ? typeToolipProjPhase
            : col == "initiation_weightage"
            ? typeToolipinitiationWeightage
            : col == "steady_state_weightage"
            ? typeToolipSteadyStateWeightage
            : col == "closure_weightage"
            ? typeToolipClosureWeightage
            : col == "valid_from"
            ? typeToolipValidFrom
            : col == "valid_till"
            ? typeToolipValidTill
            : col == "Action"
            ? LinkTemplate
            : col == "check_point" && typeToolip
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  console.log(formData, "line no--------134");

  return (
    <>
      <div>
        {loader ? <Loader /> : ""}

        {deleteMessage ? (
          <div className="statusMsg success">
            <BiCheck /> Audit Checkpoint deleted successfully !
          </div>
        ) : (
          ""
        )}
        {delMsg ? (
          <div className="statusMsg error">
            <AiFillWarning /> You cannot delete the checkpoint as it is tagged
            to a project in compliance audit checklist.
          </div>
        ) : (
          ""
        )}

        {addmsg ? (
          <div className="statusMsg success">
            <BiCheck /> Check Point Saved Successfully
          </div>
        ) : (
          ""
        )}

        {editmsg ? (
          <div className="statusMsg success">
            <BiCheck /> Checkpoint updated successfully
          </div>
        ) : (
          ""
        )}

        {update ? (
          <div className="statusMsg success">
            <BiCheck /> Project Scope Updated successfully
          </div>
        ) : (
          ""
        )}
        {validationMessage ? (
          <div className="statusMsg error">
            {" "}
            <AiFillWarning /> Please select the valid values for highlighted
            fields{" "}
          </div>
        ) : (
          ""
        )}

        <div>
          <div className="col-md-12">
            <div className="pageTitle">
              <div className="childOne"></div>
              <div className="childTwo">
                <h2>Audit Check Points List</h2>
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
          <div className="group mb-3 customCard">
            <div className="col-md-12 collapseHeader"></div>
            <CCollapse visible={!visible}>
              <div className="group-content row">
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="projectType">
                      Project Type<span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        id="prjType"
                        options={projectType}
                        hasSelectAll={true}
                        value={selectedProjectType}
                        disabled={false}
                        ArrowRenderer={ArrowRenderer}
                        valueRenderer={generateDropdownLabel}
                        overrideStrings={{
                          selectAllFiltered: "Select All",
                          selectSomeItems: "<<Please Select>>",
                        }}
                        onChange={(e) => {
                          setSelectedProjectType(e);
                          let filteredTypes = [];
                          e.forEach((d) => {
                            filteredTypes.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["prjType"]: filteredTypes.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="projectPhase">
                      Project Phase <span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        id="prjPhase"
                        options={projectPhase}
                        hasSelectAll={true}
                        ArrowRenderer={ArrowRenderer}
                        valueRenderer={generateDropdownLabel}
                        value={selectedProjectPhase}
                        disabled={false}
                        overrideStrings={{
                          selectAllFiltered: "Select All",
                          selectSomeItems: "<<Please Select>>",
                        }}
                        onChange={(e) => {
                          setSelectedProjectPhase(e);
                          let filteredPhases = [];
                          e.forEach((d) => {
                            filteredPhases.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["prjPhase"]: filteredPhases.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 btn-container center">
                  <button
                    className="btn btn-primary "
                    onClick={() => {
                      handleClick();
                      let valid = GlobalValidation(ref);
                      !valid && setVisible(!visible);
                      visible
                        ? setCheveronIcon(FaChevronCircleUp)
                        : setCheveronIcon(FaChevronCircleDown);
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

        <div className="col-md-12">
          {loaderState ? (
            <div className="loaderBlock">
              <Loader handleAbort={handleAbort} />
            </div>
          ) : (
            ""
          )}
          {validationMessage == false && (
            <CellRendererPrimeReactDataTable
              CustomersFileName = "AuditCpSetup"
              AuditCpSetupMaxHeight = {maxHeight}
              data={data}
              headerData={headerData}
              dynamicColumns={dynamicColumns}
              setHeaderData={setHeaderData}
              linkColumns={linkColumns}
              linkColumnsRoutes={linkColumnsRoutes}
              rows={25}
            />
          )}
          {validationMessage == false && dataAccess != 908 && (
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center">
              <button
                className="btn btn-primary "
                onClick={() => {
                  AddPopUPFnc();
                }}
              >
                <RiAddLine /> Add
              </button>
              <button
                className="btn btn-primary "
                onClick={() => {
                  setUploadPopUp(true);
                }}
              >
                <MdOutlineFileUpload /> Upload
              </button>
            </div>
          )}
        </div>
        {addPopup ? (
          <AddPopUp
            addPopup={addPopup}
            handleChange={handleChange}
            setaddPopup={setaddPopup}
            type={type}
            editedData={editedData}
            setEditedData={setEditedData}
            editId={editId}
            initialValue={initialValue}
            data={data}
            formData={formData}
            setFormData={formData}
            projectType={projectType}
            setProjectType={setProjectType}
            selectedProjectType={selectedProjectType}
            setSelectedProjectType={setSelectedProjectType}
            projectPhase={projectPhase}
            selectedProjectPhase={selectedProjectPhase}
            setSelectedProjectPhase={setSelectedProjectPhase}
            handleClick={handleClick}
            setAddmsg={setAddmsg}
          />
        ) : (
          ""
        )}
        {editPopup ? (
          <EditPopUp
            editPopup={editPopup}
            setEditPopup={setEditPopup}
            editId={editId}
            handleClick={handleClick}
            data={data}
            setEditedData={setEditedData}
            editedData={editedData}
            setEditAddmsg={setEditAddmsg}
          />
        ) : (
          ""
        )}
        {deletePopup ? (
          <DeletePopUp
            deletePopup={deletePopup}
            setDeletePopup={setDeletePopup}
            setEditedData={setEditedData}
            editedData={editedData}
            handleClick={handleClick}
            setDeleteMessage={setDeleteMessage}
            setDelMsg={setDelMsg}
          />
        ) : (
          ""
        )}
        {uploadpopUp ? (
          <UploadPopUp
            setUploadPopUp={setUploadPopUp}
            uploadpopUp={uploadpopUp}
            handleClick={handleClick}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default AuditCpSetup;
