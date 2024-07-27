import React from "react";
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { environment } from "../../environments/environment";
import { AiFillDelete, AiFillEdit, AiFillWarning } from "react-icons/ai";
import "./TaskPlan.scss";
import { MdOutlineAdd } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { ImCross } from "react-icons/im";
import TaskPlanResDeletePopUp from "./TaskPlanResDeletePopUp";
import { BiCheck } from "react-icons/bi";
import Loader from "../Loader/Loader";

function TaskPlanResourceTable(props) {
  const { selectedRow, taskList, setAssignedHrs, assignedHrs, grp2Items } =
    props;
  const baseUrl = environment.baseUrl;
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const [deleteFailed, setDeleteFailed] = useState(false);
  const [holidays, setHolidays] = useState(0);
  console.log("holidays>", holidays);

  const calculateWeekdays = (startDate, endDate, resId, multiplier) => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/taskPlan/holidays?resId=${resId}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((resp) => {
        const data = resp.data;
        console.log(data.holidays);
        setHolidays(data.holidays);
      })
      .catch((error) => {
        console.error(error);
      });

    const weekdays = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      const dayOfWeek = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

      // Count weekdays (Monday to Friday)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        weekdays.push(new Date(currentDate));
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return (weekdays.length - holidays) * multiplier;
  };

  /////////////////////////////////////////////////////

  {
    /*---------------------------------UseState's----------------------------------- */
  }
  const [projectNewResource, setProjectNewResource] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [projectOldResource, setProjectOldResource] = useState([]);
  const [taskResources, setTaskResources] = useState([]);
  const [enableDropDown, setEnableDropDown] = useState(false);
  const [enableAddDropDown, setEnableAddDropDown] = useState(false);
  const [reAssToDate, setReAssToDate] = useState(new Date());
  const [reAssFromDate, setReAssFromDate] = useState(new Date());
  const [reAssDailyHrs, setReAssDailyHrs] = useState("");
  const [editor, setEditor] = useState(false);
  const [rowResourceId, setRowResourceId] = useState("");
  const [resAssingedHrs, setResAssingedHrs] = useState(0);
  const [resAllocationsHrs, setResAllocationsHrs] = useState(0);
  const [backUpTaskResource, setBackUpTaskResource] = useState([]);
  const [rowToBeEdited, setRowToBeEdited] = useState();
  const [resourceSaved, setResourceSaved] = useState(false);
  const [AddorEdit, setAddorEdit] = useState(false);
  const [disableAdd, setDisableAdd] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);
  const [resAllocData, setResAllocData] = useState({
    roleId: "",
    resId: "",
    fromDt: moment(new Date()).format("YYYY-MM-DD"),
    toDt: moment(new Date()).format("YYYY-MM-DD"),
    newVal: "",
    taskId: "",
  });
  const dataObject = grp2Items.find(
    (item) => item.display_name === "Task Plan"
  );
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const [toBeAddedRowData, setToBeAddedRowData] = useState({
    fromDt: moment(new Date()).format("YYYY-MM-DD"),
    toDt: moment(new Date()).format("YYYY-MM-DD"),
    taskId: "",
    taskRoleId: "",
    resId: "",
    dailyHrs: 0,
    resource: "",
  });

  {
    /*----------Axios call for default date on dropdown xhanges on add Button----------*/
  }

  const getResDate1 = () => {
    let ID = toBeAddedRowData.resource.split("_");
    axios
      .get(
        baseUrl +
          `/ProjectMS/taskPlan/resDates?taskId=${
            taskList[selectedRow - 1].taskId
          }&roleId=${ID[0]}&resId=${ID[1]}`
      )
      .then((response) => {
        const data = response.data;
        setReAssToDate(data.toDt);
        setReAssFromDate(data.fromDt);
        setResAllocData((prev) => ({
          ...prev,
          toDt: data.toDt,
          fromDt: data.fromDt,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getResDate1();
  }, [toBeAddedRowData.resource]);

  console.log("taskList", taskList);

  console.log("taskResources>>", taskResources);
  console.log("projectNewResource>>", projectNewResource);

  {
    /*--------------------Axios Call To Get the Task Resource List-------------------*/
  }

  const getResList = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/taskPlan/taskResources?taskId=${
            taskList[selectedRow - 1].taskId
          }`
      )
      .then((response) => {
        const data = response.data;
        setTaskResources(data);
        const totalHrsSum = data.reduce(
          (acc, current) => acc + current.totalHrs,
          0
        );
        setAssignedHrs(totalHrsSum);
        console.log("totalHrsSum>>", totalHrsSum);
        setBackUpTaskResource(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getResList();
  }, [deletePopUp]);

  useEffect(() => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/taskPlan/projectResources?taskId=${
            taskList[selectedRow - 1].taskId
          }`
      )
      .then((response) => {
        const data = response.data;
        setProjectNewResource(data.newOptions);
        setProjectOldResource(data.editOptions);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  {
    /*--------------------Code for Header's Col-Span & Row-span-------------------*/
  }

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          sortable
          field="resource"
          style={{ width: "12rem" }}
          header="Resource"
          rowSpan={2}
        />
        <Column
          header="Assignments : Task level"
          colSpan={3}
          style={{ width: "16rem" }}
        />
        <Column header="Project levels (Hrs)" colSpan={2} />
        <Column header="Re-Assignments : Task level" colSpan={4} />
        <Column header="Project levels (Hrs)" colSpan={2} />
        {grp2Items[2].is_write == true && (
          <Column
            header="Actions"
            style={{ width: "6rem", textAlign: "center" }}
            rowSpan={2}
          />
        )}
      </Row>
      <Row>
        <Column field="fromDt" header="From Dt" />
        <Column field="toDt" header="To Dt" />
        <Column sortable field="totalHrs" header="Total Hrs" />
        <Column sortable field="allocatedHrs" header="Allocated" />
        <Column sortable field="assgnedHrs" header="Assigned" />
        <Column header="From Date" />
        <Column header="To Date" />
        <Column header="Daily Hrs" />
        <Column header="Total Hrs" />
        <Column header="Allocated" />
        <Column header="Assigned" />
      </Row>
    </ColumnGroup>
  );

  {
    /*---------------------Axios for getting Re-Assignment Dates-------------------*/
  }
  const getResDates = (taskId, resId, roleId) => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/taskPlan/resDates?taskId=${taskId}&roleId=${roleId}&resId=${resId}`
      )
      .then((response) => {
        const data = response.data;
        setReAssToDate(data.toDt);
        setReAssFromDate(data.fromDt);
        setResAllocData((prev) => ({
          ...prev,
          toDt: data.toDt,
          fromDt: data.fromDt,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  {
    /*---------------------Axios for getting Re-Assis. Daily Hours-------------------*/
  }
  const getResHours = () => {
    axios
      .get(`${baseUrl}/ProjectMS/taskPlan/resHours`, {
        params: resAllocData,
      })
      .then((response) => {
        const data = response.data;
        setResAllocationsHrs(data[0].allocationHrs);
        setResAssingedHrs(data[0].assignedHrs);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  {
    /*---------------------Editors for Re-Assignment Dates & Daily Hours-------------------*/
  }
  const textEditortoDt = (rowData, options) => {
    return (
      <DatePicker
        name="to_dt"
        id="to_dt"
        dateFormat="dd-MMM-yyyy"
        selected={
          toBeAddedRowData.resource
            ? new Date(reAssToDate)
            : rowData.resourceId == "New"
            ? ""
            : new Date(reAssToDate)
        }
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        onSelect={(date) => {
          setResAllocData((prev) => ({
            ...prev,
            toDt: moment(date).format("YYYY-MM-DD"),
          }));
          setReAssToDate(moment(date).format("YYYY-MM-DD"));
        }}
        showMonthDropdown={true}
        showYearDropdown={true}
      />
    );
  };

  const textEditorFromDt = (rowData) => {
    return (
      <DatePicker
        name="form_dt"
        id="form_dt"
        selected={
          toBeAddedRowData.resource
            ? new Date(reAssFromDate)
            : new Date(rowData.toDt) >= new Date()
            ? new Date()
            : rowData.resourceId == "New"
            ? ""
            : new Date(reAssFromDate)
        }
        dateFormat="dd-MMM-yyyy"
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        onSelect={(date) => {
          setResAllocData((prev) => ({
            ...prev,
            fromDt: moment(date).format("YYYY-MM-DD"),
          }));
          setReAssFromDate(moment(date).format("YYYY-MM-DD"));
        }}
        showMonthDropdown={true}
        showYearDropdown={true}
      />
    );
  };

  const textEditorDailyhrs = (rowData) => {
    return (
      <>
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              return;
            }
            if (!(e.key >= "0" && e.key <= "9")) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setResAllocData((prev) => ({
              ...prev,
              newVal: e.target.value,
            }));
          }}
          id="daily_hours"
        />
      </>
    );
  };

  {
    /*---------------------------Editors Button in Action Column----------------------------*/
  }

  const renderRowActions = (rowData) => {
    return (
      <div style={{ paddingLeft: "20px" }}>
        <label>
          <AiFillEdit
            title="Edit"
            className="mr-1"
            color="orange"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setDisableAdd(true);
              setEnableDropDown(true);
              if (
                resAllocData.resId != rowData.resourceId &&
                resAllocData.newVal == ""
              ) {
                getResDates(rowData.taskId, rowData.resourceId, rowData.roleId);
                setEditor(true);
                setRowResourceId(rowData.resourceId);
                setRowToBeEdited(rowData);
                setResAllocData((prev) => ({
                  ...prev,
                  roleId: rowData.roleId,
                  resId: rowData.resourceId,
                  taskId: rowData.taskId,
                }));
              } else {
                getResHours();
              }
            }}
          />
          &nbsp;
          <span
            onClick={() => {
              setDeletePopUp(true);
              setRoleId(rowData.taskRoleId);
            }}
          >
            <AiFillDelete
              title="Delete"
              color="orange"
              style={{ cursor: "pointer" }}
            />
          </span>
        </label>
      </div>
    );
  };

  {
    /*---------------------------Code for Add Button to add the Row----------------------------*/
  }

  const addRow = () => {
    setDisableAdd(true);
    setAddorEdit(true);
    setEditor(true);
    setEnableAddDropDown(true);
    const newRow = {
      resource: "",
      fromDt: "",
      toDt: "",
      totalHrs: 0,
      allocatedHrs: 0,
      assgnedHrs: 0,
      resourceId: "New",
    };

    setTaskResources((prevTaskResources) => [newRow, ...prevTaskResources]);
  };

  {
    /*---------------------------Code for Cancel Button to revert the Row's----------------------------*/
  }
  const removeChanges = () => {
    setDisableAdd(false);
    setEditor(false);
    setTaskResources(backUpTaskResource);
  };

  {
    /*-----------------------------Code for Save or Edit the table Row's------------------------------*/
  }
  const [loading, setLoading] = useState(false);
  const loggedUserId = localStorage.getItem("resId");
  const saveChanges = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setDisableAdd(false);
    setEditor(false);

    axios
      .post(
        // `http://localhost:8092/ProjectMS/taskPlan/saveTaskResource`,
        `${baseUrl}/ProjectMS/taskPlan/saveTaskResource`,
        AddorEdit
          ? {
              fromDt: moment(reAssFromDate).format("YYYY-MM-DD"),
              toDt: moment(reAssToDate).format("YYYY-MM-DD"),
              taskId: taskList[selectedRow - 1].taskId,
              taskRoleId: "null",
              resId: toBeAddedRowData.resource.split("_")[1],
              dailyHrs: resAllocData.newVal == "" ? 0 : resAllocData.newVal,
              resource: toBeAddedRowData.resource,
              createdById: loggedUserId,
            }
          : {
              fromDt: moment(rowToBeEdited.fromDt).format("YYYY-MM-DD"),
              toDt: moment(rowToBeEdited.toDt).format("YYYY-MM-DD"),
              taskId: rowToBeEdited.taskId,
              taskRoleId: rowToBeEdited.taskRoleId,
              resId: rowToBeEdited.resourceId,
              dailyHrs: resAllocData.newVal == "" ? 0 : resAllocData.newVal,
              resource: rowToBeEdited.roleId + "_" + rowToBeEdited.resourceId,
              lastUpdatedById: loggedUserId,
            }
      )
      .then((response) => {
        const data = response.data;
        clearTimeout(loaderTime);
        setLoader(false);
        if (data.id == null || data.id == "") {
          setResourceSaved(false);
          getResList();
          return;
        }
        setAddorEdit(false);
        setEditor(false);
        setEnableAddDropDown(false);
        setEnableDropDown(false);
        setResourceSaved(true);
        setTimeout(() => {
          setResourceSaved(false);
        }, 3000);
        getResList();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const resourceFromdate = (rowData) => {
    return (
      <React.Fragment>
        <span title={rowData.fromDt}>{rowData.fromDt}</span>
      </React.Fragment>
    );
  };
  const resourceToDt = (rowData) => {
    return (
      <React.Fragment>
        <span title={rowData.toDt}>{rowData.toDt}</span>
      </React.Fragment>
    );
  };
  return (
    <div>
      {resourceSaved ? (
        <div className="statusMsg success">
          {" "}
          <BiCheck /> Resource saved successfully.
        </div>
      ) : (
        ""
      )}
      {deletedSuccess ? (
        <div className="statusMsg success">
          {" "}
          <BiCheck /> Task Deleted Successfully
        </div>
      ) : (
        ""
      )}
      {deleteFailed ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> you cannot delete resource.
        </div>
      ) : (
        ""
      )}
      <div className="darkHeader">
        <DataTable
          value={taskResources}
          showGridlines
          headerColumnGroup={headerGroup}
          editMode="row"
          dataKey="id"
          className=" primeReactDataTable" ////customerEngament
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          rowsPerPageOptions={[10, 25, 50]}
          paginator
          rows={25}
        >
          <Column
            key={"resource"}
            field={"resource"}
            header={"Resource"}
            body={(options) => {
              return enableDropDown &&
                options.resourceId == rowResourceId &&
                editor ? (
                <select disabled>
                  {projectOldResource
                    .filter((item) => item.label === options.resource)
                    .map((item, index) => (
                      <option key={index} value={item.label}>
                        {item.label}
                      </option>
                    ))}
                </select>
              ) : options.resourceId == "New" && editor ? (
                <select
                  onChange={(e) => {
                    setToBeAddedRowData((prev) => ({
                      ...prev,
                      resource: e.target.value,
                    }));
                  }}
                >
                  {projectNewResource.map((item, index) => (
                    <option key={item} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span title={options.resource}>{options.resource}</span>
              );
            }}
          ></Column>
          <Column
            key={"fromDt"}
            field={"fromDt"}
            style={{ whiteSpace: "normal" }}
            body={resourceFromdate}
            title="From Dt"
          ></Column>
          <Column
            key={"toDt"}
            field={"toDt"}
            style={{ whiteSpace: "normal" }}
            body={resourceToDt}
          ></Column>
          <Column
            key={"totalHrs"}
            field={"totalHrs"}
            body={(options) => {
              const formattedAmount =
                typeof parseFloat(options.totalHrs) === "number"
                  ? parseFloat(options.totalHrs).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })
                  : options.totalHrs;

              return (
                <span
                  style={{
                    display: "block",
                    float: "right",
                  }}
                  title={formattedAmount}
                >
                  {formattedAmount}
                </span>
              );
            }}
          ></Column>
          <Column
            key={"allocatedHrs"}
            field={"allocatedHrs"}
            body={(options) => {
              const formattedAmount =
                typeof parseFloat(options.allocatedHrs) === "number"
                  ? parseFloat(options.allocatedHrs).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })
                  : options.allocatedHrs;
              return (
                <span
                  style={{
                    display: "block",
                    float: "right",
                  }}
                  title={formattedAmount == null ? "0.00" : formattedAmount}
                >
                  {formattedAmount == null ? "0.00" : formattedAmount}
                </span>
              );
            }}
          ></Column>
          <Column
            key={"assgnedHrs"}
            field={"assgnedHrs"}
            body={(options) => {
              const formattedAmount =
                typeof parseFloat(options.assgnedHrs) === "number"
                  ? parseFloat(options.assgnedHrs).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })
                  : options.assgnedHrs;
              return (
                <span
                  style={{
                    display: "block",
                    float: "right",
                  }}
                  title={formattedAmount == null ? "0.00" : formattedAmount}
                >
                  {formattedAmount == null ? "0.00" : formattedAmount}
                </span>
              );
            }}
          ></Column>
          <Column
            key={""}
            field={""}
            body={(options) => {
              return options.resourceId == rowResourceId && editor
                ? textEditorFromDt(options)
                : options.resourceId == "New" && editor
                ? textEditorFromDt(options)
                : "";
            }}
          ></Column>
          <Column
            key={""}
            field={""}
            body={(options) => {
              return options.resourceId == rowResourceId && editor
                ? textEditortoDt(options)
                : options.resourceId == "New" && editor
                ? textEditortoDt(options)
                : "";
            }}
          ></Column>
          <Column
            key={""}
            field={""}
            body={(options) => {
              return options.resourceId == rowResourceId && editor
                ? textEditorDailyhrs(options)
                : options.resourceId == "New" && editor
                ? textEditorDailyhrs(options)
                : "";
            }}
          ></Column>
          <Column
            key={""}
            field={""}
            body={(options) => {
              return options.resourceId == rowResourceId ? (
                <span style={{ display: "block", float: "left" }}>
                  {parseInt(resAllocationsHrs).toFixed(2) == 0.0 ||
                  parseInt(resAssingedHrs).toFixed(2) == null
                    ? ""
                    : calculateWeekdays(
                        reAssFromDate,
                        reAssToDate,
                        options.resourceId,
                        resAllocData.newVal
                      ).toFixed(2)}
                </span>
              ) : (
                ""
              );
            }}
          ></Column>
          <Column
            key={""}
            field={""}
            body={(options) => {
              return options.resourceId == rowResourceId ? (
                <span
                  style={{
                    display: "block",
                    float: "right",
                  }}
                  title={
                    parseInt(resAllocationsHrs).toFixed(2) == 0.0 ||
                    parseInt(resAssingedHrs).toFixed(2) == null
                      ? ""
                      : parseInt(resAllocationsHrs).toFixed(2)
                  }
                >
                  {parseInt(resAllocationsHrs).toFixed(2) == 0.0 ||
                  parseInt(resAssingedHrs).toFixed(2) == null
                    ? ""
                    : parseInt(resAllocationsHrs).toFixed(2)}
                </span>
              ) : (
                ""
              );
            }}
          ></Column>
          <Column
            key={""}
            field={""}
            body={(options) => {
              return options.resourceId == rowResourceId ? (
                <span
                  style={{
                    display: "block",
                    float: "right",
                  }}
                  title={
                    parseInt(resAssingedHrs).toFixed(2) == 0.0 ||
                    parseInt(resAssingedHrs).toFixed(2) == null
                      ? ""
                      : parseInt(resAssingedHrs).toFixed(2)
                  }
                >
                  {parseInt(resAssingedHrs).toFixed(2) == 0.0 ||
                  parseInt(resAssingedHrs).toFixed(2) == null
                    ? ""
                    : parseInt(resAssingedHrs).toFixed(2)}
                </span>
              ) : (
                ""
              );
            }}
          ></Column>
          {grp2Items[2].is_write == true && (
            <Column
              bodyStyle={{ textAlign: "align center" }}
              body={renderRowActions}
            ></Column>
          )}
        </DataTable>
      </div>
      {dataObject?.is_write == true ? (
        <div className="form-group col-md-2 btn-container-events center my-3">
          <button
            className="btn btn-primary"
            onClick={() => {
              addRow();
            }}
            variant="contained"
            disabled={!disableAdd ? false : true}
          >
            <MdOutlineAdd size="1.2em" /> Add
          </button>
          <button
            className="btn btn-primary"
            variant="contained"
            onClick={() => {
              saveChanges();
            }}
            disabled={disableAdd ? false : true}
          >
            <TfiSave size="0.9em" /> Save
          </button>
          <button
            className="btn btn-primary"
            variant="contained"
            onClick={() => {
              removeChanges();
            }}
            disabled={disableAdd ? false : true}
          >
            <ImCross /> Cancel
          </button>
        </div>
      ) : (
        ""
      )}
      {deletePopUp ? (
        <TaskPlanResDeletePopUp
          setDeleteFailed={setDeleteFailed}
          deletePopUp={deletePopUp}
          setDeletePopUp={setDeletePopUp}
          roleId={roleId}
          setDeletedSuccess={setDeletedSuccess}
        />
      ) : (
        ""
      )}
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}
export default TaskPlanResourceTable;
