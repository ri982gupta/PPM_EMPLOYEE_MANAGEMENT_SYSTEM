import React, { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { AiFillDelete, AiFillWarning, AiOutlineHistory } from "react-icons/ai";
import { TfiSave } from "react-icons/tfi";
import { ImCross } from "react-icons/im";
import { BiCheck } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { FileUpload } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import "./SalaryBand.scss";
import "primeicons/primeicons.css";
import Draggable from "react-draggable";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { environment } from "../../environments/environment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import FlatPrimeReactTableRevenue from "../RevenueMetrices/FlatPrimeReactTableRevenue";
import UploadExcelSheet from "../CostComponent/UploadExcelSheet";
import Loader from "../Loader/Loader";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import Utils from "../../Utils.js";
function SalaryBandTable(props) {
  const baseUrl = environment.baseUrl;

  const {
    popUp,
    tableData,
    setTableData,
    getSearch,
    SetPopUp,
    resLocation,
    setResLocation,
    departments,
    setDepartments,
    roletype,
    formData,
    setLoaderTimer,
    loaderTimer,
    abortController,
  } = props;

  const [deletePopUp, setDeletePopUp] = useState(false);
  const [deleteid, setDeleteId] = useState("");
  const [updatedMessage, setUpdateMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [validMessage, setValidMessage] = useState(false);
  const [addrow, setAddRow] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyPopUp, setHistoryPopUp] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [stateValue, setStateValue] = useState("UploadRoleTypeCost");
  const [salValidation, SetSalValidation] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const loggedUserId = localStorage.getItem("resId");

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderTimer(false);
  };

  const uploadExcelSheet = async () => {
    let link = baseUrl + "/CostMS/SalaryBand/uploadDocs";
    const response = await axios.post(link, excelFile, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  };
  const onRowEditComplete = (e) => {
    setValidMessage(false);
    let _category = [...tableData];
    let { newData, index } = e;
    _category[index] = newData;
    setTableData(_category);
    if (e.newData.max_salary == "" || e.newData.min_salary == "") {
      // editor;
      setValidMessage(true);
      e.editor.closeEditor();
      return;
    } else {
      setValidMessage(false);
      postData(e.newData);
    }
  };

  const getHistory = (data) => {
    setHistoryPopUp(true);
    abortController.current = new AbortController();
    axios({
      url:
        baseUrl +
        `/CostMS/SalaryBand/getHistory?country=${data.Country_id}&department=${data.department_id}&roleType=${data.role_type_id}`,
      signal: abortController.current.signal,
    }).then((response) => {
      let headerData = [
        {
          country: "Country",
          department: "Department",
          roleType: "Role Type",
          min_salary: "Min Salary",
          max_salary: "Max Salary",
          month: "Month",
          userName: "Updated By",
          updated_date: "Updated Date",
        },
      ];
      setHistoryData(headerData.concat(response.data));
    });
  };

  const postData = (rowData) => {
    let adddata = document.getElementsByClassName("error");
    for (let i = 0; i < adddata.length; i++) {
      if (
        rowData.min_salary == "" ||
        rowData.min_salary == null ||
        rowData.max_salary == "" ||
        adddata[i].value === "" ||
        adddata[i].value === "null" ||
        adddata[i].value === "All" ||
        adddata[i].value === undefined
      ) {
        adddata[i].classList.add("error-block");
        setValidMessage(true);
        // classList.add("error-block");
      } else {
        adddata[i].classList.remove("error-block");
        setValidMessage(false);
        // classList.remove("error-block")
      }
    }
    if (rowData.max_salary == "" || rowData.min_salary == "") {
      setValidMessage(true);
    } else if (Number(rowData.max_salary) < Number(rowData.min_salary)) {
      SetSalValidation(true);
      return;
    } else {
      let data = {
        id: rowData.Id,
        countryId: "" + rowData.Country_id,
        department: "" + rowData.department_id,
        roleType: "" + rowData.role_type_id,
        roleCost: "" + rowData.role_cost,
        minSal: "" + rowData.min_salary,
        maxSal: "" + rowData.max_salary,

        month:
          rowData.id == "" || rowData.id == null
            ? moment(new Date()).startOf("month").format("YYYY-MM-DD")
            : rowData.month,

        createdBy:
          rowData.id == "" || rowData.id == null
            ? loggedUserId
            : rowData.created_by,

        createdDate:
          rowData.id == "" || rowData.id == null
            ? moment(new Date()).format("YYYY-MM-DD")
            : moment(rowData.created_date).format("YYYY-MM-DD"),

        updatedBy: loggedUserId,

        updatedDate: moment(new Date()).format("YYYY-MM-DD"),
      };
      axios({
        url: baseUrl + `/CostMS/SalaryBand/Post`,
        method: "post",
        data: data,
      }).then((response) => {
        setUpdateMessage(true);
        SetSalValidation(false);
        getSearch();
        setTimeout(() => {
          setUpdateMessage(false);
        }, 3000);
      });
    }
  };

  const deleteRecord = () => {
    setLoaderTimer(true);
    abortController.current = new AbortController();
    axios({
      method: "delete",
      url: baseUrl + `/CostMS/SalaryBand/delete?Id=${deleteid}`,
      signal: abortController.current.signal,
    }).then((response) => {
      setDeletePopUp(false);
      getSearch();
      setDeleteMessage(true);
      setLoaderTimer(false);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 300);
    });
  };

  const handleHistory = (data) => {
    return (
      <div
        className="align center"
        onClick={(e) => {
          getHistory(data);
        }}
      >
        <AiOutlineHistory
          size={"1.5em"}
          title="History"
          style={{ cursor: "pointer" }}
          color="grey"
        />
      </div>
    );
  };
  const handleAction = (data) => {
    return (
      <div className="align center">
        <AiFillDelete
          size={"1.5em"}
          title="Delete"
          style={{ cursor: "pointer" }}
          color="orange"
          onClick={() => {
            setDeletePopUp(true);
            setDeleteId(data.Id);
          }}
        />
      </div>
    );
  };
  const cancelIconCancel = document.getElementsByClassName(
    `p-row-editor-cancel p-link`
  );

  useEffect(() => {
    // Check if the element is found before trying to attach the onclick function
    if (cancelIconCancel) {
      cancelIconCancel.onclick = function () {
        // Add your functionality or call your function here
        // For example, you can log a message when the cancel button is clicked
        // You can also call another function here if needed
        // yourFunction();
      };
    }
  }, [cancelIconCancel]);

  useEffect(() => {
    tableData.forEach((rowData, rowIndex) => {
      if (rowData?.min_salary === "" || rowData?.max_salary === "") {
        const icon = document.getElementsByClassName(
          `p-row-editor-init p-link-${rowIndex}`
        )[0];
        icon?.setAttribute("title", `Edit row ${rowIndex}`);
        icon?.click();

        setTimeout(() => {
          const cancelIcon = document.getElementsByClassName(
            `p-row-editor-cancel p-link-${rowIndex}`
          )[0];
          cancelIcon?.setAttribute("title", `Cancel editing row ${rowIndex}`);
          cancelIcon?.addEventListener(
            "click",
            function (e) {
              if (rowData.min_salary === "" || rowData.max_salary === "") {
                // Update the tableData and other state variables accordingly for row rowIndex
                const updatedTableData = [...tableData];
                updatedTableData.splice(rowIndex, 1);
                setTableData(updatedTableData);
                setValidMessage(false);
                // componentRef.current.forceUpdate(); // Note: componentRef is not defined in your code
              }
            },
            true
          );
        }, 200);
      }
    });
  }, [tableData]);

  const handleMinSal = (data) => {
    const Value = Number(data.min_salary);
    const formattedValue = Value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <div data-toggle="tooltip" title={formattedValue}>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          $ <span className="align right">{formattedValue}</span>
        </span>
      </div>
    );
  };
  const Cancel = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
  };
  let sideEditIcons = document.getElementsByClassName(
    "p-row-editor-cancel p-link"
  );
  function handleClickOnce() {
    setValidMessage(false);
    getSearch();
  }
  Array.from(sideEditIcons).forEach((icon) => {
    let hasEventListener = false;

    icon.addEventListener("click", function () {
      if (!hasEventListener) {
        hasEventListener = true;
        handleClickOnce();
      }
    });
  });

  const textEditorMinSal = (rowData) => {
    return (
      <>
        <div className="error-block error">
          <input
            className={`error ${
              validMessage && !rowData.rowData.min_salary ? "error-block" : ""
            }`}
            type="text"
            id="min_salary"
            name="min_salary"
            defaultValue={rowData.rowData.min_salary}
            onChange={(e) => {
              rowData.editorCallback(e.target.value);
            }}
          />
        </div>
      </>
    );
  };
  const onRowEditorInit = () => {
    setValidMessage(false); // Set the validation message to false when the row editor is initialized
  };

  const handleMaxSal = (data) => {
    const Value = Number(data.max_salary);
    const formattedValue = Value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <div data-toggle="tooltip" title={formattedValue}>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          $ <span className="align right">{formattedValue}</span>
        </span>
      </div>
    );
  };
  const textEditorMaxSal = (rowData) => {
    return (
      <>
        <input
          className={`error ${
            validMessage && !rowData.rowData.max_salary ? "error-block" : ""
          }`}
          type="text"
          id="max_salary"
          name="max_salary"
          value={rowData.rowData.max_salary}
          onChange={(e) => {
            rowData.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const handleRoleCost = (data) => {
    const Value = Number(data.role_cost);
    const formattedValue = Value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <div data-toggle="tooltip" title={formattedValue}>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          $ <span className="align right">{formattedValue}</span>
        </span>
      </div>
    );
  };

  const handleDepartment = (data) => {
    return (
      <div data-toggle="tooltip" title={data.department} className="ellipsis">
        {data.department}
      </div>
    );
  };

  const handleCountry = (data) => {
    return (
      <div data-toggle="tooltip" title={data.country} className="ellipsis">
        {data.country}
      </div>
    );
  };

  const handleRoleType = (data) => {
    return (
      <div data-toggle="tooltip" title={data.role_type} className="ellipsis">
        {data.role_type}
      </div>
    );
  };

  const handleResourceCount = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={data.resource_cnt}
        className="align right"
      >
        {data.resource_cnt}
      </div>
    );
  };
  function HistoryTable(props) {
    const { setHistoryPopUp, historyPopUp, historyData } = props;
    return (
      <div>
        <Draggable>
          <CModal
            size="xl"
            visible={historyPopUp}
            className="ui-dialog "
            onClose={() => setHistoryPopUp(false)}
          >
            <CModalHeader className="hgt22">
              <CModalTitle>
                <span className="ft16">Salary Band History</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="row">
                <div className="col-md-12">
                  <FlatPrimeReactTableRevenue
                    data={historyData}
                    rows={10}
                  ></FlatPrimeReactTableRevenue>
                </div>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }

  function DeletePopUp(props) {
    const { deletePopUp, setDeletePopUp, deleteRecord } = props;

    return (
      <div>
        <Draggable>
          <CModal
            alignment="center"
            backdrop="static"
            size="sm"
            visible={deletePopUp}
            className="ui-dialog"
            onClose={() => {
              setDeletePopUp(false);
            }}
          >
            <CModalHeader style={{ cursor: "all-scroll" }}>
              <CModalTitle>
                <span>Delete SalaryBand</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure you want to delete SalaryBand?</h6>
              <div className="btn-container center my-2">
                <button
                  type="button"
                  title="Delete"
                  className="btn btn-primary"
                  onClick={() => {
                    deleteRecord();
                  }}
                >
                  <TfiSave />
                  Delete
                </button>
                <button
                  type="button"
                  title="Cancel"
                  className="btn btn-primary"
                  onClick={() => {
                    setDeletePopUp(false);
                  }}
                >
                  {" "}
                  <ImCross />
                  Cancel
                </button>
              </div>
            </CModalBody>
          </CModal>
        </Draggable>
      </div>
    );
  }

  function AddRow(props) {
    const {
      addrow,
      setAddRow,
      resLocation,
      departments,
      roletype,
      setSuccessMessage,
      formData,
      setLoaderTimer,
    } = props;
    const initialvalue = {
      country: "",
      department: "",
      roleType: "",
      minSal: "",
      maxSal: "",
      month: formData.month,
      createdBy: loggedUserId,
      createdDate: moment(new Date()).format("YYYY-MM-DD"),
      updatedBy: loggedUserId,
      updatedDate: moment(new Date()).format("YYYY-MM-DD"),
    };
    const [addformData, setAddFormData] = useState(initialvalue);
    const [validationMessage, setValidationMessage] = useState(false);
    const [salaryvalidation, setSalaryValidation] = useState(false);
    // const [addValidation, setAddvalidation] = useState();
    const [duplicatevalidation, setDuplicatevalidation] = useState(false);
    const [validMsg, setValidMsg] = useState();
    const ref = useRef([]);

    const handleChange = (event) => {
      const { name, value } = event.target;
      setAddFormData((prevprops) => ({ ...prevprops, [name]: value }));
      axios({
        url:
          baseUrl +
          `/CostMS/SalaryBand/addValidation?country=${addformData.country}&department=${addformData.department}&roleType=${addformData.roleType}&createdDate=${addformData.month}`,
        signal: abortController.current.signal,
      }).then((response) => {
        setValidMsg(response.data);
      });
    };

    const getAddValidation = () => {
      axios({
        url:
          baseUrl +
          `/CostMS/SalaryBand/addValidation?country=${addformData.country}&department=${addformData.department}&roleType=${addformData.roleType}&createdDate=${addformData.month}`,
        signal: abortController.current.signal,
      }).then((response) => {
        setValidMsg(response.data);
        let Validation = response.data.Validation;
        if (Validation === "false") {
          postNewRecord();
          return;
        } else {
          setDuplicatevalidation(true);
          setTimeout(() => {
            setDuplicatevalidation(false);
          }, 3000);
          return;
        }
      });
    };

    const post = () => {
      abortController.current = new AbortController();
      axios({
        url: baseUrl + `/CostMS/SalaryBand/Post`,
        signal: abortController.current.signal,
        method: "post",
        data: addformData,
      }).then((response) => {
        setAddRow(false);
        setSuccessMessage(true);

        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
        getSearch();
      });
    };

    const postNewRecord = async () => {
      let valid = GlobalValidation(ref);
      if (valid) {
        setValidationMessage(true);
        return;
      } else if (Number(addformData.maxSal) < Number(addformData.minSal)) {
        setSalaryValidation(true);
        setTimeout(() => {
          setSalaryValidation(false);
        }, 3000);
        return;
      } else if (validMsg.Validation == "true") {
        setDuplicatevalidation(true);
        setTimeout(() => {
          setDuplicatevalidation(false);
        }, 3000);
        return;
      }
      post();
    };

    return (
      <div>
        <CModal
          alignment="center"
          backdrop="static"
          size="xs"
          visible={addrow}
          className="ui-dialog"
          onClose={() => {
            setAddRow(false);
          }}
        >
          <CModalHeader style={{ cursor: "all-scroll" }}>
            <CModalTitle>
              <span>Add Salary Band</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="col-md-12">
              {validationMessage ? (
                <div className="statusMsg error">
                  <AiFillWarning />{" "}
                  {"Please select the valid values for highlighted fields"}
                </div>
              ) : (
                ""
              )}
              {salaryvalidation ? (
                <div className="statusMsg error">
                  <AiFillWarning />{" "}
                  {"Maximum Salary Should be greater than Minimum Salary"}
                </div>
              ) : (
                ""
              )}
              {duplicatevalidation ? (
                <div className="statusMsg error">
                  <AiFillWarning />
                  {
                    "Data for selected Country,Department,RoleType and Month Already Exists"
                  }
                </div>
              ) : (
                ""
              )}
              <div className="group-content row mb-2">
                <div className="form-group row mb-2">
                  <label className="col-5">
                    Country<span className="required error-text ml-1">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6 error text">
                    <select
                      id="country"
                      name="country"
                      className="error text"
                      onChange={handleChange}
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {resLocation.map((Item, index) => (
                        <option key={index} value={Item.value}>
                          {Item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-2">
                  <label className="col-5">
                    Department
                    <span className="required error-text ml-1">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6 error text">
                    <select
                      id="department"
                      name="department"
                      className="error text"
                      onChange={handleChange}
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {departments.map((Item, index) => (
                        <option key={index} value={Item.value}>
                          {Item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-2">
                  <label className="col-5">
                    Role Type
                    <span className="required error-text ml-1">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6 error text">
                    <select
                      id="roleType"
                      name="roleType"
                      className="error text"
                      onChange={handleChange}
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {roletype.map((Item, index) => (
                        <option key={index} value={Item.value}>
                          {Item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group row mb-2">
                  <label className="col-5">
                    Min Salary
                    <span className="required error-text ml-1">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 error textfield"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <input
                      type="text"
                      id="minSal"
                      name="minSal"
                      placeholder="Enter Salary in $"
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "Tab",
                          "Enter",
                          "ArrowLeft",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowDown",
                          ".",
                          "0",
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ];

                        if (!allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-5">
                    Max Salary
                    <span className="required error-text ml-1">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 error textfield"
                    ref={(ele) => {
                      ref.current[4] = ele;
                    }}
                  >
                    <input
                      type="text"
                      id="maxSal"
                      name="maxSal"
                      placeholder="Enter Salary in $"
                      onKeyDown={(e) => {
                        const allowedKeys = [
                          "Backspace",
                          "Delete",
                          "Tab",
                          "Enter",
                          "ArrowLeft",
                          "ArrowRight",
                          "ArrowUp",
                          "ArrowDown",
                          ".",
                          "0",
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                        ];

                        if (!allowedKeys.includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      getAddValidation();
                    }}
                  >
                    <SaveIcon title="Save" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="primeTableSearch-upload-add-btn-container">
        <div className="upload-add-btn">
          <button
            className="btn btn-primary mr-2"
            title="Save"
            onClick={() => {
              SetPopUp(true);
            }}
          >
            <FileUpload /> Upload
          </button>
          <button
            className="btn btn-primary"
            title="Add"
            onClick={() => {
              setAddRow(true);
            }}
          >
            <FaPlus />
            Add
          </button>
        </div>
        <div className="primeTableSearch-filter">
          <span className="pi pi-search"></span>
          <InputText
            className="globalFilter"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </div>
      </div>
    );
  };
  const header = renderHeader();

  return (
    <div>
      {updatedMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Updated Successfully "}
        </div>
      ) : (
        ""
      )}
      {deleteMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Deleted Successfully "}
        </div>
      ) : (
        ""
      )}
      {validMessage ? (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please Enter the valid values for highlighted fields"}
        </div>
      ) : (
        ""
      )}
      {successMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Saved Successfully "}
        </div>
      ) : (
        ""
      )}
      {salValidation ? (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Maximum Salary Should be greater than min Salary"}
        </div>
      ) : (
        ""
      )}
      <div>
        <DataTable
          value={tableData}
          showGridlines
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          onRowEditorInit={onRowEditorInit}
          dataKey="id"
          stripedRows
          className="primeReactDataTable salaryBandTable darkHeader"
          paginator
          pagination="true"
          rows={25}
          paginationperpage={5}
          rowsPerPageOptions={[10, 25, 50]}
          sortMode="multiple"
          filters={filters}
          header={header}
          emptyMessage="No Data Found"
        >
          <Column
            field="country"
            header="Country"
            sortable
            body={handleCountry}
          ></Column>
          <Column
            field="department"
            header="Department"
            sortable
            body={handleDepartment}
          ></Column>
          <Column
            field="role_type"
            header="Role Type"
            sortable
            body={handleRoleType}
          ></Column>

          <Column
            field="min_salary"
            header="Min.Salary"
            body={handleMinSal}
            sortable
            editor={(options) => textEditorMinSal(options)}
          ></Column>
          <Column
            field="max_salary"
            header="Max.Salary"
            body={handleMaxSal}
            sortable
            editor={(options) => textEditorMaxSal(options)}
          ></Column>
          <Column
            field="role_cost"
            header="Role cost"
            sortable
            body={handleRoleCost}
          ></Column>
          <Column
            field="resource_cnt"
            header="Current Count"
            sortable
            body={handleResourceCount}
          ></Column>
          <Column
            field="StandardDeviation"
            header="Standard Deviation"
            sortable
          ></Column>
          <Column
            header="History"
            body={handleHistory}
            bodyStyle={{ textAlign: "align center" }}
          ></Column>
          <Column rowEditor />
          <Column
            header="Action"
            body={handleAction}
            bodyStyle={{ textAlign: "align center" }}
          ></Column>
        </DataTable>
      </div>
      {deletePopUp ? (
        <DeletePopUp
          deletePopUp={deletePopUp}
          setDeletePopUp={setDeletePopUp}
          deleteRecord={deleteRecord}
        />
      ) : (
        ""
      )}
      {addrow ? (
        <AddRow
          setAddRow={setAddRow}
          addrow={addrow}
          resLocation={resLocation}
          setResLocation={setResLocation}
          departments={departments}
          setDepartments={setDepartments}
          roletype={roletype}
          setSuccessMessage={setSuccessMessage}
          formData={formData}
          setLoaderTimer={setLoaderTimer}
        />
      ) : (
        ""
      )}
      {historyPopUp ? (
        <HistoryTable
          historyData={historyData}
          setHistoryPopUp={setHistoryPopUp}
          historyPopUp={historyPopUp}
          setLoaderTimer={setLoaderTimer}
        />
      ) : (
        ""
      )}
      {popUp ? (
        <UploadExcelSheet
          excelUploadPopUp={popUp}
          setExcelUploadPopUp={SetPopUp}
          excelFile={excelFile}
          setExcelFile={setExcelFile}
          uploadExcelSheet={uploadExcelSheet}
          getResourcesCostData={getSearch}
          formData={formData}
          stateValue={stateValue}
          setLoaderTimer={setLoaderTimer}
          updateMsg={updateMsg}
          setUpdateMsg={setUpdateMsg}
        />
      ) : (
        ""
      )}
      {loaderTimer ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}

export default SalaryBandTable;
