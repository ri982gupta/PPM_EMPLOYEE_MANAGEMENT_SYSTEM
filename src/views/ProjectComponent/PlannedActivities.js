import React, { useState, useEffect } from "react";
import axios from "axios";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader, CModalTitle } from "@coreui/react";
import { environment } from "../../environments/environment";
import moment from "moment";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import Draggable from "react-draggable";
import { AiFillEdit } from "react-icons/ai";
import { DataTable } from "primereact/datatable";
import { Column } from "ag-grid-community";
import { MdOutlineAdd } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { ImCross } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import { FaPlus, FaSave } from "react-icons/fa";
function PlannedActivities(props) {
  const {
    setMessage,
    setPlannedAddMessage,
    projectId,
    validation,
    setValidation,
    grp4Items,
  } = props;
  console.log(grp4Items[1].is_write);
  const dataObject = grp4Items.find(
    (item) => item.display_name === "Planned Activities"
  );
  const [category, setCategory] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [uid, setUid] = useState(0);
  const [plannedActivities, setPlannedActivities] = useState("");
  const [clicked, setClicked] = useState(false);
  const [saveCliked, setSaveClicked] = useState(true);
  const [cancelClicked, setCancelClicked] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [editEnabled, setEditEnabled] = useState(false);
  const [actiondisable, setActiondisable] = useState(false);

  ///////////////////////////////////////////////////////////////////////

  const dates = {
    fromDate: moment().startOf("week").add("days", 8).format("YYYY-MM-DD"),
    toDate: moment().startOf("week").add("days", 14).format("YYYY-MM-DD"),
  };
  const [dt, setDt] = useState(dates);

  const addHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate).add("days", 7).format("YYYY-MM-DD"),
    }));

    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.fromDate).add("days", 13).format("YYYY-MM-DD"),
    }));
    setCancelClicked(true);
    setSaveClicked(true);
    setClicked(false);
  };

  const subtracHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate)
        .subtract("days", 7)
        .format("YYYY-MM-DD"),
    }));

    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).subtract("days", 7).format("YYYY-MM-DD"),
    }));
    setCancelClicked(true);
    setSaveClicked(true);
    setClicked(false);
  };

  //////axios for getting the details in to the table////////

  const baseUrl = environment.baseUrl;
  const getPlannedActivitiesData = () => {
    axios({
      url:
        baseUrl +
        `/ProjectMS/PlannedActivities/getProjectPlannedActivities?pid=${projectId}&fromDate=${dt.fromDate}&toDate=${dt.toDate}`,
    }).then((res) => {
      setCategory(res.data);
    });
  };

  useEffect(() => {
    getPlannedActivitiesData();
  }, [dt]);

  //////axios for posting the details in to the table////////
  const handleSave = () => {
    if (plannedActivities === "") {
      setValidation(true);
      if (validation === true) {
        setCancelClicked(true);
        setSaveClicked(true);
        setClicked(false);
      } else {
        setCancelClicked(false);
        setSaveClicked(false);
        setClicked(true);
      }
      return;
    } else {
      let data;
      if (category.find((item) => item.id === inputValue)) {
        data = {
          id: inputValue,
          ProjectId: projectId,
          plannedActivity: plannedActivities,
          fromDate: moment(dt.fromDate).format("YYYY-MM-DD"),
        };
      } else {
        data = {
          ProjectId: projectId,
          plannedActivity: plannedActivities,
          fromDate: moment(dt.fromDate).format("YYYY-MM-DD"),
        };
      }
      axios({
        method: "post",
        url:
          baseUrl + `/ProjectMS/PlannedActivities/postProjectPlannedActivities`,
        data: data,
      }).then((error) => {
        getPlannedActivitiesData();
        setValidation(false);
        setClicked(false);
        setSaveClicked(true);
        setCancelClicked(true);
        setPlannedAddMessage(true);
        setTimeout(() => {
          setPlannedAddMessage(false);
        }, 3000);
        setPlannedActivities("");
      });

      setEditEnabled(false);
    }
  };

  //////axios for deleting the details from the table////////

  const plannedactivitiesdelete = () => {
    axios({
      method: "delete",
      url:
        baseUrl +
        `/ProjectMS/PlannedActivities/deleteProjectPlannedActivities?id=${uid}`,
      data: uid,
    }).then((error) => {
      setUid(0);
      getPlannedActivitiesData();
      setButtonPopup(false);
      setMessage(true);
      setTimeout(() => {
        setMessage(false);
      }, 3000);
    });
  };
  ////////////Functions///////////////////////
  const renderRowActions = (rowData) => {
    return (
      <div style={{ paddingLeft: "40px" }}>
        {grp4Items[1].is_write != true ? (
          ""
        ) : (
          <label cursor="pointer">
            <AiFillEdit
              title="Edit"
              style={{
                backgroundColor: actiondisable ? "#eee" : "",
                cursor: actiondisable ? "not-allowed" : "pointer",
                opacity: actiondisable ? ".7" : "",
              }}
              className="mr-1"
              color="orange"
              onClick={() => {
                setInputValue(rowData.id);
                setSaveClicked(false);
                setCancelClicked(false);
                setClicked(true);
                plannedactivitiestextfiled();
                setEditEnabled(true);
              }}
            />
            &nbsp;
            <AiFillDelete
              title="Delete"
              style={{
                backgroundColor: actiondisable ? "#eee" : "",
                cursor: actiondisable ? "not-allowed" : "pointer",
                opacity: actiondisable ? ".7" : "",
              }}
              color="orange"
              onClick={() => {
                setButtonPopup(true);
                setUid(rowData.id);
              }}
            />
          </label>
        )}
      </div>
    );
  };
  const plannedactivitiestextfiled = (category, rowData) => {
    const handleChange = (e) => {
      setPlannedActivities(e.target.value);
    };
    const handleKeyDown = (event) => {
      if (event.keyCode === 32) {
        // Check if the key pressed is the space key
        const value = event.target.value;
        const selectionStart = event.target.selectionStart;

        // Prevent space if it's at the beginning of the input
        if (selectionStart === 0) {
          event.preventDefault();
          return;
        }

        // Allow the space if it follows a non-space character
        if (value[selectionStart - 1] !== " ") {
          return;
        }

        event.preventDefault(); // Prevent the space from being entered
      }
    };
    return (
      <>
        {category?.id === inputValue && editEnabled === true ? (
          <input
            className={
              validation === true ? "error-block ellipsis" : "ellipsis"
            }
            type="text"
            id="plannedActivities"
            name="plannedActivities"
            title={category.plannedActivities}
            defaultValue={category?.plannedActivities}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        ) : (
          category?.plannedActivities !== "" && (
            <p className="ellipsis" title={category?.plannedActivities}>
              {category?.plannedActivities}
            </p>
          )
        )}
        {category?.plannedActivities === "" && (
          <input
            className={`error ${
              validation && !category?.rowData?.accomplishment
                ? "error-block ellipsis"
                : "ellipsis"
            }`}
            type="text"
            id="plannedActivities"
            name="plannedActivities"
            title={category.plannedActivities}
            value={category.rowData?.plannedActivities}
            onChange={(e) => setPlannedActivities(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
      </>
    );
  };
  useEffect(() => {
    if (category[0]?.plannedActivities == "") {
      document.getElementsByClassName("p-row-editor-init p-link")[0]?.click();
      setTimeout(() => {
        document
          .getElementsByClassName("p-row-editor-cancel p-link")[0]
          ?.addEventListener(
            "click",
            function (e) {
              if (category[0]?.plannedActivities == "") {
                setPlannedActivities(category.slice(2, category.length));
                setValidation(false);
              }
            },
            true
          );
      }, 200);
    }
  }, [category]);
  const addRow = () => {
    let daa = document.getElementsByClassName(
      "p-paginator-first p-paginator-element p-link"
    )[1];

    daa.click();
    const data = {
      plannedActivities: "",
      Actions: "",
    };
    let dt = [];
    dt.push(data);
    setCategory([...dt, ...category]);

    setClicked(true);
    setCancelClicked(false);
    setSaveClicked(false);
  };

  const Reset = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    getPlannedActivitiesData();
    setEditEnabled(false);
    setClicked(false);
    setCancelClicked(true);
    setSaveClicked(true);
    setValidation(false);
    setActiondisable(false);
  };
  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
    handleSave();
    if (validation === true) {
      setCancelClicked(true);
      setSaveClicked(true);
      setClicked(false);
    } else {
      setCancelClicked(false);
      setSaveClicked(false);
      setClicked(true);
    }
  };
  const onRowEditComplete = (e) => {
    let _category = [category];
    let { newData, index } = e;
    _category[index] = newData;
    setCategory(_category);
    postData(e.newData);
    setClicked(true);
  };

  ////////////////////////////////////////////
  function PlannedActivitiesDeletePopUp(props) {
    const { plannedactivitiesdelete, buttonPopup, setButtonPopup } = props;
    return (
      <div>
        <Draggable>
          <CModal
            alignment="center"
            backdrop="static"
            size="default"
            visible={buttonPopup}
            className="ui-dialog"
            onClose={() => setButtonPopup(false)}
          >
            <CModalHeader style={{ cursor: "all-scroll" }}>
              <CModalTitle>
                <span className="">Delete Planned Activity</span>
              </CModalTitle>
            </CModalHeader>
            <CModalBody>
              <h6>Are you sure to delete Planned Activity ?</h6>
              <div className="btn-container center my-2">
                <button
                  type="button"
                  title="Delete"
                  className="btn btn-primary"
                  onClick={() => {
                    plannedactivitiesdelete();
                  }}
                >
                  <TfiSave />
                  Delete
                </button>

                <button
                  type="button"
                  title="Cancel"
                  className="btn btn-secondary"
                  onClick={() => {
                    setButtonPopup(false);
                  }}
                >
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

  return (
    <div>
      <div>
        <div>
          <span style={{ fontWeight: "600" }}>
            {moment(dt.fromDate).format("DD-MMM-YYYY")} to &nbsp;
            {moment(dt.toDate).format("DD-MMM-YYYY")}
          </span>
          <span className="float-end">
            <AiOutlineLeftSquare
              cursor="pointer"
              size={"2em"}
              onClick={subtracHandler}
            ></AiOutlineLeftSquare>
            <AiOutlineRightSquare
              cursor="pointer"
              size={"2em"}
              onClick={addHandler}
            ></AiOutlineRightSquare>
          </span>
        </div>
        <br />

        <div className="darkHeader">
          <DataTable
            value={category}
            editMode="row"
            showGridlines
            emptyMessage="No Records To View"
            scrollDirection="both"
            paginator
            stripedRows
            rows={25}
            onRowEditComplete={onRowEditComplete}
            className="primeReactDataTable "
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            rowsPerPageOptions={[10, 25, 50]} // //------------->
          >
            <Column
              className="ellipsis"
              body={plannedactivitiestextfiled}
              field="plannedActivities"
              header="Planned Activities"
              editor={(options) => plannedactivitiestextfiled(options)}
              sortable
            />
            {grp4Items[1].is_write == true && (
              <Column
                body={renderRowActions}
                header="Action"
                bodyStyle={{ textAlign: "align center" }}
                sortable
                style={{ width: " 135px" }}
              ></Column>
            )}
          </DataTable>
          {dataObject?.is_write != true ? (
            ""
          ) : (
            <div className="form-group col-md-2 btn-container-events center my-3">
              <button
                className="btn btn-primary"
                disabled={clicked}
                onClick={() => {
                  addRow();
                  setActiondisable(true);
                }}
                variant="contained"
              >
                <FaPlus /> Add
              </button>
              <button
                className="btn btn-primary"
                disabled={saveCliked}
                variant="contained"
                onClick={() => {
                  Save();
                  if (validation == true) {
                    setClicked(true);
                    setCancelClicked(false);
                    setSaveClicked(false);
                  }
                  setActiondisable(false);
                }}
              >
                <FaSave /> Save
              </button>
              <button
                className="btn btn-primary"
                disabled={cancelClicked}
                onClick={() => {
                  Reset();
                  setClicked(false);
                  setPlannedActivities("");
                }}
                variant="contained"
              >
                <ImCross fontSize={"11px"} /> Cancel
              </button>
            </div>
          )}
        </div>
        {buttonPopup ? (
          <PlannedActivitiesDeletePopUp
            plannedactivitiesdelete={plannedactivitiesdelete}
            buttonPopup={buttonPopup}
            setButtonPopup={setButtonPopup}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default PlannedActivities;
