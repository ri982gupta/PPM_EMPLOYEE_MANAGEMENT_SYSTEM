import React from "react";
import { VscSave } from "react-icons/vsc";
import { VscChromeClose } from "react-icons/vsc";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { environment } from "../../environments/environment";
import { eachDayOfInterval, isWeekend, parse } from "date-fns";
import TaskPlanDeletePopUp from "./TaskPlanDeletePopUP";
import TaskPlanResourcePopUp from "./TaskPlanResourcePopUp";
import { BiCheck } from "react-icons/bi";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { AiFillWarning } from "react-icons/ai";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function TaskPlan(props) {
  const {
    projectId,
    grp2Items,
    urlState,
    btnState,
    setbtnState,
    grp1Items,
    grp3Items,
    grp4Items,
    grp6Items,
  } = props;
  const dataObject = grp2Items.find(
    (item) => item.display_name === "Task Plan"
  );
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;

  {
    /*------------------------------UseState's------------------------------*/
  }

  const [roleType, setRoleType] = useState([]);
  const [deletedSuccess, setDeletedSuccess] = useState(false);
  const [deletedFailed, setDeletedFailed] = useState(false);
  const [taskType, setTaskType] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [projName, setProjName] = useState([]);
  const [originalTaskList, setOriginalTaskList] = useState([]);
  const [initialTaskList, setInitialTaskList] = useState([]);
  const [selectedRow, setSelectedRow] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [taskToCopy, setTaskToCopy] = useState([]);
  const [resourcePopUp, setResourcePopUp] = useState(false);
  const [taskSaved, setTaskSaved] = useState(false);
  const [projectEndDate, setProjectEndDate] = useState(new Date());
  const [projectStartDate, setProjectStartDate] = useState(new Date());
  const [expandedRows, setExpandedRows] = useState(null);
  const [expandedRows1, setExpandedRows1] = useState(null);
  const [data2, setData2] = useState([]);
  const numberOfDays = (startDate, endDate) => {
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });
    const businessDates = allDates.filter((date) => !isWeekend(date));
    return businessDates.length;
  };

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 112) + "px"
  );

  const addBusinessDays = (startDate, numberOfDays) => {
    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    let currentDate = new Date(startDate);
    let remainingDays = numberOfDays;

    while (remainingDays > 0) {
      currentDate = addDays(currentDate, 1);
      if (!isWeekend(currentDate)) {
        remainingDays--;
      }
    }

    return currentDate;
  };

  //////////////////////

  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Projects", "Planning", "Task Plan"];
  let textContent = "Delivery";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

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
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/projectTaskPlan/wbs/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  {
    /*-------Axios Call To Get the Project Details & Project End Date-------*/
  }
  useEffect(() => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectEndDate(new Date(resp[0].plandEndDate));
        setProjectStartDate(new Date(resp[0].plandStartDate));
      })
      .catch(function (response) {
        console.log(response);
      });
  }, []);

  {
    /*--------------------Axios Call To Get the Task List-------------------*/
  }
  function isMonday() {
    const today = new Date();
    return today.getDay() === 1; // Sunday is 0, Monday is 1, ..., Saturday is 6
  }
  const getTaskList = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/taskPlan/projectTask?projectId=${projectId}&userId=${loggedUserId}`
      )
      .then((response) => {
        const data = response.data;
        data.spData.forEach((item) => {
          item.finish = moment(item.finish)
            .subtract(1, "day")
            .format("YYYY-MM-DD");
        });
        setOriginalTaskList(data);
        const dataWithSNo = data.spData.map((item, index) => ({
          sno: index + 1,
          duration: numberOfDays(new Date(item.start), new Date(item.finish)),
          finish: moment(item.finish).subtract(1, "day").format("YYYY-MM-DD"),
          ...item,
        }));

        setTaskList(dataWithSNo);
        setInitialTaskList(dataWithSNo);
        setTaskType(data.taskTypes);
        setRoleType(data.roleTypes);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getTaskList();
  }, [deletePopUp, resourcePopUp]);

  {
    /*--------------------Code to Add New Column in Table-------------------*/
  }
  const addTask = () => {
    const NewDuration = () => {
      const startDate = projectStartDate;
      const endDate = projectEndDate;
      return numberOfDays(startDate, endDate);
    };

    const newData = {
      sno: taskList.length + 1,
      content: "New Task",
      start: taskList[initialTaskList.length - 1].start,
      finish: moment(projectEndDate).format("YYYY-MM-DD"),
      indentation: lowestIndentation,
      duration: NewDuration(),
      roleName: null,
      estimatedHrs: 0,
      assignmentsContent: "",
      actualHrs: taskList[initialTaskList.length - 1].actualHrs,
      approvedHrs: taskList[initialTaskList.length - 1].approvedHrs,
      status: "New",
      taskType: 236,
    };

    setTaskList((prevTaskList) => [...prevTaskList, newData]);
  };

  {
    /*--------------------Code to Insert New Column in Table-------------------*/
  }
  const insertTask = () => {
    const NewDuration = () => {
      const startDate = projectStartDate;
      const endDate = projectEndDate;
      return numberOfDays(startDate, endDate);
    };
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    const newData = {
      sno: selectedRow,
      content: "New Task",
      start: formatDate(projectStartDate),
      indentation: taskList[parseInt(selectedRow) - 1].indentation,
      finish: formatDate(projectEndDate),
      duration: NewDuration(),
      roleName: null,
      estimatedHrs: 0,
      assignmentsContent: "",
      actualHrs: 0,
      approvedHrs: 0,
      status: "New",
      taskType: 236,
    };
    setTaskList((prevTaskList) => {
      const updatedTaskList = [...prevTaskList];
      updatedTaskList.splice(parseInt(selectedRow) - 1, 0, newData);

      for (let i = parseInt(selectedRow); i < updatedTaskList.length; i++) {
        updatedTaskList[i].sno = i + 1;
      }

      return updatedTaskList;
    });
  };

  {
    /*-----------------------Code to Reset the Table-----------------------*/
  }

  const resetTaskList = () => {
    setToDoPaste(false);
    setSelectedRow("");
    const dataWithSNo = originalTaskList.spData.map((item, index) => ({
      sno: index + 1,
      duration: numberOfDays(new Date(item.start), new Date(item.finish)),
      ...item,
    }));
    setTaskList([...dataWithSNo]);
  };

  {
    /*----------------------Code to Save the Updates----------------------*/
  }
  const saveTaskList = (data) => {
    const result = {
      Tasks: {
        Task: [],
      },
    };

    Object.keys(data).forEach((key) => {
      const value = data[key];
      const task = {
        rowIndex: value.sno,
        TaskId: value.taskId == "" || value.taskId == null ? 1 : value.taskId,
        TaskName: value.content,
        LeafId:
          value.indentation == "" || value.indentation == null
            ? 0
            : value.indentation,
        Start: value.start,
        Finish: value.finish,
        Duration: value.duration,
        TaskType:
          value.taskType == "" || value.taskType == null
            ? "null"
            : value.taskType,
        roleId:
          value.roleId == "" ||
          value.roleId == null ||
          value.roleId == undefined ||
          value.roleId == "<<All>>"
            ? "null"
            : value.roleId,
        EstimatedHours: value.estimatedHrs,
      };

      result.Tasks.Task.push(task);
    });

    //saveTaskPlan
    let toBeSavedTaskList = JSON.stringify(result);
    const formData = new FormData();
    formData.append("taskParams", toBeSavedTaskList);
    axios
      .post(
        baseUrl + `/ProjectMS/taskPlan/saveTaskPlan?projectId=${projectId}`,

        formData
      )
      .then((response) => {
        const Data = response.data;
        getTaskList();
        setTaskSaved(true);
        setTimeout(() => {
          setTaskSaved(false);
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  {
    /*-----------------Code to Handle the Updates of Table-----------------*/
  }
  const handleChange = (rowData, field, value) => {
    const updatedData = [...taskList];
    const rowIndex = updatedData.findIndex((item) => item === rowData);
    updatedData[rowIndex] = { ...rowData, [field]: value };
    setTaskList(updatedData);
  };

  {
    /*---------------------Axios Call to add side Header--------------------*/
  }
  const getData = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/projectinfo?ProjectId=${projectId}`)
      .then((res) => {
        const GetData = res.data;
        setProjName(GetData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  {
    /*-----------------------Code for Move Up Button-----------------------*/
  }

  const moveUp = () => {
    if (selectedRow > 1) {
      setTaskList((prevTaskList) => {
        const updatedTaskList = prevTaskList.map((task) => ({ ...task }));

        const temp = updatedTaskList[selectedRow - 1];
        updatedTaskList[selectedRow - 1] = updatedTaskList[selectedRow - 2];
        updatedTaskList[selectedRow - 2] = temp;

        updatedTaskList[selectedRow - 1].sno = selectedRow - 0;
        updatedTaskList[selectedRow - 2].sno = selectedRow - 1;

        return updatedTaskList;
      });

      setSelectedRow(selectedRow - 1);
    }
  };

  {
    /*----------------------Code for Move Down Button----------------------*/
  }

  const moveDown = () => {
    if (selectedRow < taskList.length) {
      setTaskList((prevTaskList) => {
        const updatedTaskList = prevTaskList.map((task) => ({ ...task }));

        const temp = updatedTaskList[selectedRow - 1];
        updatedTaskList[selectedRow - 1] = updatedTaskList[selectedRow];
        updatedTaskList[selectedRow] = temp;

        updatedTaskList[selectedRow - 1].sno = selectedRow;
        updatedTaskList[selectedRow].sno = selectedRow + 1;

        return updatedTaskList;
      });

      setSelectedRow(selectedRow + 1);
    }
  };

  {
    /*------------------------Code for Copy & Paste-------------------------*/
  }
  const [toDoPaste, setToDoPaste] = useState(false);
  const copyTask = () => {
    setToDoPaste(true);
    selectedRow == "" ? "" : setTaskToCopy(taskList[selectedRow - 1]);
  };

  useEffect(() => {
    copyTask;
  }, [selectedRow]);

  const pasteTask = () => {
    const newData = {
      sno: selectedRow,
      content: taskToCopy.content,
      start: taskToCopy.start,
      finish: taskToCopy.finish,
      indentation: taskList[selectedRow - 1].indentation,
      duration: taskToCopy.duration,
      roleName: null,
      estimatedHrs: taskToCopy.estimatedHrs,
      assignmentsContent: "",
      actualHrs: 0,
      approvedHrs: 0,
      status: "New",
      taskType: taskToCopy.taskType,
    };
    setTaskList((prevTaskList) => {
      const updatedTaskList = [...prevTaskList];
      updatedTaskList.splice(parseInt(selectedRow), 0, newData);

      for (let i = parseInt(selectedRow); i < updatedTaskList.length; i++) {
        updatedTaskList[i].sno = i + 1;
      }

      return updatedTaskList;
    });
  };

  {
    /*------------Code For Increasing Indentation (Indent Task)------------ */
  }

  const increaseIndentation = () => {
    if (selectedRow === null || selectedRow === 0) {
      return;
    }

    const updatedTaskList = [...taskList];
    const selectedTask = updatedTaskList[selectedRow - 1];
    const previousTask = updatedTaskList[selectedRow - 2];

    if (!selectedTask) {
      return;
    }

    if (previousTask.indentation < selectedTask.indentation) {
      return;
    }

    selectedTask.indentation += 1;
    setTaskList(updatedTaskList);
  };

  {
    /*------------Code For Increasing Indentation (Unindent Task)------------ */
  }

  const decreaseIndentation = () => {
    if (selectedRow === null || selectedRow === 0) {
      return;
    }

    const updatedTaskList = [...taskList];
    const selectedTask = updatedTaskList[selectedRow - 1];

    if (!selectedTask) {
      return;
    }
    if (!allowExpansion(selectedTask)) {
      selectedTask.indentation -= 1;
      setTaskList(updatedTaskList);
    }
  };

  {
    /* ------Recusring the Rows for proper Parent-Childeren Alingment------ */
  }

  const getRowsWithIndentation = (sno, indentation) => {
    const childRows = [];

    for (let i = sno; i < taskList.length; i++) {
      const row = taskList[i];
      if (row.indentation === indentation + 1) {
        childRows.push(row);
        i += getRowsWithIndentation(i, indentation + 1).length; // Recursively find children
      } else if (row.indentation <= indentation) {
        break;
      }
    }

    return childRows;
  };

  {
    /*----------------Row Expansion Template for showing the Data after Expansion---------------- */
  }

  const rowExpansionTemplate = (rowData) => {
    const currentIndentation = rowData.indentation;
    const childRows = getRowsWithIndentation(rowData.sno, currentIndentation);
    return (
      <DataTable
        expandAll
        value={childRows}
        showGridlines
        expandedRows={expandedRows1}
        onRowToggle={(e) => setExpandedRows1(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        className="primeReactDataTable taskPlanInnerTable"
        collapseAll
        emptyMessage
      >
        <Column feild="expand" expander={allowExpansion} />
        <Column
          key={"content"}
          field={"content"}
          header={"Task"}
          body={(rowData) => (
            <input
              className={`lvl-${rowData.indentation}`}
              style={{
                fontWeight: allowExpansion(rowData) ? "bolder" : "normal",
              }}
              disabled={grp2Items[2].is_write == true ? false : true}
              type="text"
              value={rowData.content}
              onChange={(e) => {
                handleChange(rowData, "content", e.target.value);
              }}
              onClick={() => {
                const selectedSno = rowData.sno;
                setSelectedRow(selectedSno);
                setSelectedTaskId(rowData.taskId);
              }}
            />
          )}
        />
        <Column
          key={"start"}
          field={"start"}
          header={"Start"}
          body={(rowData) => (
            <span
              onClick={() => {
                const selectedSno = rowData.sno;
                setSelectedRow(selectedSno);
                setSelectedTaskId(rowData.taskId);
              }}
            >
              <DatePicker
                portalId="root-portal"
                disabled={
                  (grp2Items[2].is_write == true ? false : true) ||
                  allowExpansion(rowData)
                }
                dateFormat="dd-MMM-yyyy"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                filterDate={(date) => {
                  return date.getDay() !== 0 && date.getDay() !== 6;
                }}
                selected={moment(rowData.start).toDate()}
                showMonthDropdown={true}
                showYearDropdown={true}
                onChange={(date) => {
                  const updatedData = [...taskList];
                  const value = numberOfDays(date, new Date(rowData.finish));
                  updatedData[rowData.sno - 1] = {
                    ...rowData,
                    duration: value,
                    start: moment(date).format("YYYY-MM-DD"),
                  };
                  setTaskList(updatedData);
                }}
              />
            </span>
          )}
        />
        <Column
          key={"finish"}
          field={"finish"}
          header={"Finish"}
          body={(rowData) => (
            <span
              onClick={() => {
                const selectedSno = rowData.sno;
                setSelectedRow(selectedSno);
                setSelectedTaskId(rowData.taskId);
              }}
            >
              <DatePicker
                portalId="root-portal"
                disabled={
                  (grp2Items[2].is_write == true ? false : true) ||
                  allowExpansion(rowData)
                }
                dateFormat="dd-MMM-yyyy"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                selected={moment(rowData.finish).toDate()}
                showMonthDropdown={true}
                showYearDropdown={true}
                filterDate={(date) => {
                  return date.getDay() !== 0 && date.getDay() !== 6;
                }}
                onClick={() => {
                  const selectedSno = rowData.sno;
                  setSelectedRow(selectedSno);
                  setSelectedTaskId(rowData.taskId);
                }}
                onChange={(date) => {
                  const updatedData = [...taskList];
                  const value = numberOfDays(new Date(rowData.start), date);
                  updatedData[rowData.sno - 1] = {
                    ...rowData,
                    duration: value,
                    finish: moment(date).format("YYYY-MM-DD"),
                  };
                  setTaskList(updatedData);
                }}
              />
            </span>
          )}
        />
        <Column
          key={"duration"}
          field={"duration"}
          header={"Duration(d)"}
          body={(rowData) => (
            <input
              style={{
                fontWeight: allowExpansion(rowData) ? "bolder" : "normal",
              }}
              disabled={
                (grp2Items[2].is_write == true ? false : true) ||
                allowExpansion(rowData)
              }
              type="text"
              value={parseInt(rowData.duration)}
              onClick={() => {
                const selectedSno = rowData.sno;
                setSelectedRow(selectedSno);
                setSelectedTaskId(rowData.taskId);
              }}
              onChange={(e) => {
                handleChange(rowData, "duration", e.target.value);
              }}
              onBlur={(e) => {
                const formatDate = (date) => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  return `${year}-${month}-${day}`;
                };
                const finishDate = formatDate(
                  addBusinessDays(rowData.start, e.target.value - 1)
                );

                handleChange(rowData, "finish", finishDate);
              }}
            ></input>
          )}
        />
        <Column
          key={"roleName"}
          field={"roleName"}
          header={"Role"}
          body={(rowData) =>
            allowExpansion(rowData) ? (
              <></>
            ) : (
              <select
                disabled={grp2Items[2].is_write == true ? false : true}
                onClick={() => {
                  const selectedSno = rowData.sno;
                  setSelectedRow(selectedSno);
                  setSelectedTaskId(rowData.taskId);
                }}
                title={rowData.roleName}
                onChange={(e) => {
                  const selectedRoleName =
                    e.target.options[e.target.selectedIndex].getAttribute(
                      "selectedRoleName"
                    );
                  handleChange(
                    rowData,
                    "roleId",
                    e.target.value,
                    (rowData.roleName = selectedRoleName)
                  );
                }}
              >
                <option value={null}>&lt;&lt;All&gt;&gt;</option>
                {roleType.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    selected={rowData.roleId == item.id}
                    selectedRoleName={item.name}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            )
          }
        />
        <Column
          key={"estimatedHrs"}
          field={"estimatedHrs"}
          header={"Estimated Hrs"}
          body={(rowData) =>
            allowExpansion(rowData) ? (
              <></>
            ) : (
              <input
                disabled={grp2Items[2].is_write == true ? false : true}
                type="text"
                value={rowData.estimatedHrs}
                onClick={() => {
                  const selectedSno = rowData.sno;
                  setSelectedRow(selectedSno);
                  setSelectedTaskId(rowData.taskId);
                }}
                onChange={(e) =>
                  // handleChange(rowData, "estimatedHrs", e.target.value)
                  {
                    const inputValue = e.target.value;
                    const isValidInput = /^\d*$/.test(inputValue);

                    if (isValidInput || inputValue === "") {
                      handleChange(rowData, "estimatedHrs", inputValue);
                    }
                  }
                }
                style={{ textAlign: "right" }}
              ></input>
            )
          }
        />
        <Column
          key={"assignmentsContent"}
          field={"assignmentsContent"}
          header={"Assignments"}
          body={(rowData) => (
            <input
              type="text"
              value={rowData.assignmentsContent}
              style={{ textDecoration: "underline" }}
              onClick={() => {
                const selectedSno = rowData.sno;
                const checkFinishDate = rowData.finish;
                const currentDate = moment(new Date()).format("YYYY-MM-DD");

                setResourcePopUp(checkFinishDate >= currentDate ? true : false);
                if (currentDate > checkFinishDate) {
                  setResourcePopUp(false);
                  alert("Change the task end date for resource allocations");
                }
                if (rowData.estimatedHrs == 0) {
                  setResourcePopUp(false);
                  alert("Please enter Estimated Hrs");
                } else if (rowData.assignmentsContent == "") {
                  setResourcePopUp(false);
                  alert("Please save Task");
                }
                setSelectedRow(selectedSno);
                setSelectedTaskId(rowData.taskId);
              }}
              onChange={(e) =>
                handleChange(rowData, "assignmentsContent", e.target.value)
              }
            ></input>
          )}
        />
        <Column
          key={"actualHrs"}
          field={"actualHrs"}
          header={"Actual Hrs"}
          body={(rowData, column) => {
            const value = rowData[column.field];
            const formattedValue = value == null ? "0.0" : value.toFixed(1);
            const formattedAmount =
              typeof parseFloat(value) === "number"
                ? parseFloat(value).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })
                : value;
            return allowExpansion(rowData) ? (
              <></>
            ) : (
              <span
                onClick={() => {
                  const selectedSno = rowData.sno;
                  setSelectedRow(selectedSno);
                  setSelectedTaskId(rowData.taskId);
                }}
              >
                {formattedAmount}
              </span>
            );
          }}
        />
        <Column
          key={"approvedHrs"}
          field={"approvedHrs"}
          header={"Approved Hrs"}
          body={(rowData, column) => {
            const value = rowData[column.field];
            const formattedValue = value == null ? "0.0" : value.toFixed(1);
            return allowExpansion(rowData) ? (
              <></>
            ) : (
              <span
                onClick={() => {
                  const selectedSno = rowData.sno;
                  setSelectedRow(selectedSno);
                  setSelectedTaskId(rowData.taskId);
                }}
                title={formattedValue}
              >
                {formattedValue}
              </span>
            );
          }}
        />
        <Column
          key={"status"}
          field={"status"}
          header={"Status"}
          body={(rowData) =>
            allowExpansion(rowData) ? (
              <></>
            ) : (
              <span
                onClick={(e) => {
                  const selectedSno = rowData.sno;
                  setSelectedRow(selectedSno);
                  setSelectedTaskId(rowData.taskId);
                }}
                style={{
                  display: "block", // This ensures the span takes up full width
                  textAlign: "center",
                  margin: "0 auto", // This centers the content horizontally
                }}
              >
                {rowData.status}
              </span>
            )
          }
        />
        <Column
          key={"taskType"}
          field={"taskType"}
          header={"Task Type"}
          body={(rowData) =>
            allowExpansion(rowData) ? (
              <></>
            ) : (
              <select
                disabled={grp2Items[2].is_write == true ? false : true}
                onClick={() => {
                  const selectedSno = rowData.sno;
                  setSelectedRow(selectedSno);
                  setSelectedTaskId(rowData.taskId);
                }}
                onChange={(e) =>
                  handleChange(rowData, "taskType", e.target.value)
                }
              >
                {taskType.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                    selected={rowData.taskType == item.value}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            )
          }
        />
      </DataTable>
    );
  };

  const allowExpansion = (rowData) => {
    const currentIndentation = rowData.indentation;

    for (let i = rowData.sno; i < taskList.length; i++) {
      const nextRow = taskList[i];
      if (nextRow.indentation > currentIndentation) {
        return true; // Allow expansion
      } else if (nextRow.indentation <= currentIndentation) {
        break;
      }
    }

    return false;
  };

  const lowestIndentation = taskList.reduce((minIndentation, nextRow) => {
    if (nextRow.indentation !== null) {
      return Math.min(minIndentation, nextRow.indentation);
    }
    // If nextRow.indentation is null, return null instead of comparing
    return null;
  }, Infinity); // Start with Infinity to ensure the first value is always smaller

  return (
    <div className="group-content ">
      <div className="pageTitle mb-2">
        <div className="childOne">
          {/* {projName.map((Details) => (
            <h2>{Details.project_name}</h2>
          ))} */}
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
          <h2>Task Plan</h2>
        </div>
        <div className="childThree"></div>
      </div>

      {deletedSuccess ? (
        <div className="statusMsg success">
          {" "}
          <BiCheck /> Task Deleted Successfully
        </div>
      ) : (
        ""
      )}

      {deletedFailed ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Task cannot be deleted as resources are assigned to
          this task.
        </div>
      ) : (
        ""
      )}

      {taskSaved ? (
        <div className="statusMsg success">
          {" "}
          <BiCheck /> Task Saved Successfully
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12 mb-2 grayBg ">
        <div className="row taskPln ">
          <div className="col-9 mt-2">
            <pre>
              {grp2Items[2].is_write == true ? (
                <div>
                  <img
                    src="ia_support_icons/new_item.png"
                    title="Add new item"
                  />
                  <span
                    onClick={addTask}
                    className="newItem"
                    style={{ cursor: "pointer" }}
                    title="Add new item"
                  >
                    {" "}
                    New item{" "}
                  </span>
                  <img
                    src="ia_support_icons/insert_new.png"
                    title="Insert new item before selection"
                  />
                  <span
                    onClick={selectedRow == "" ? "" : insertTask}
                    className="Insert New"
                    style={{ cursor: "pointer" }}
                    title="Insert new item before selection"
                  >
                    {" "}
                    Insert New{" "}
                  </span>
                  <img src="ia_support_icons/unindent_task.png" />
                  <span
                    onClick={() =>
                      selectedRow === "" ? "" : decreaseIndentation()
                    }
                    className="Unindent Task"
                    style={{ cursor: "pointer" }}
                    title="Decrease seleced item indentation"
                  >
                    {" "}
                    Unindent Task{" "}
                  </span>
                  <img src="ia_support_icons/indent_task.png" />
                  <span
                    onClick={() =>
                      selectedRow === "" ? "" : increaseIndentation()
                    }
                    className="Indent Task"
                    style={{ cursor: "pointer" }}
                    title="Increase seleced item indentation"
                  >
                    {" "}
                    Indent Task{" "}
                  </span>
                  <img
                    src="ia_support_icons/delete.png"
                    title="Delete selected item"
                  />
                  <span
                    onClick={() =>
                      selectedRow == "" ? "" : setDeletePopUp(true)
                    }
                    className="Delete"
                    style={{ cursor: "pointer" }}
                    title="Delete selected item"
                  >
                    {" "}
                    Delete{" "}
                  </span>
                  <img
                    src="ia_support_icons/copy.png"
                    title="Copy selected item"
                  />
                  <span
                    onClick={selectedRow == "" ? "" : copyTask}
                    className="Copy"
                    style={{ cursor: "pointer" }}
                    title="Copy selected item"
                  >
                    {" "}
                    Copy{" "}
                  </span>
                  <img
                    src="ia_support_icons/paste.png"
                    title="Paste after selected item"
                  />
                  <span
                    onClick={
                      selectedRow == ""
                        ? ""
                        : toDoPaste == true
                        ? pasteTask
                        : ""
                    }
                    className="Paste"
                    style={{ cursor: "pointer" }}
                    title="Paste after selected item"
                  >
                    {" "}
                    Paste{" "}
                  </span>
                  <img
                    src="ia_support_icons/move_up.png"
                    title="Move selected item up"
                  />
                  <span
                    onClick={selectedRow == "" ? "" : moveUp}
                    className="Move Up"
                    style={{ cursor: "pointer" }}
                    title="Move selected item up"
                  >
                    {" "}
                    Move Up{" "}
                  </span>
                  <img
                    src="ia_support_icons/move_down.png"
                    title="Move selected item down"
                  />
                  <span
                    onClick={selectedRow == "" ? "" : moveDown}
                    className="Move Down"
                    style={{ cursor: "pointer" }}
                    title="Move selected item down"
                  >
                    {" "}
                    Move Down{" "}
                  </span>
                </div>
              ) : (
                ""
              )}
            </pre>
          </div>
        </div>
      </div>

      <div className="group mt-3 customCard taskPlanTable darkHeader">
        <div className="col-md-12 no-padding">
          <div className="card p-fluid mb-2 ">
            <DataTable
              value={taskList.filter(
                (rowData) => rowData.indentation === lowestIndentation
              )}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              showGridlines
              className="primeReactDataTable taskPlanTable"
            >
              <Column feild="expand" expander={allowExpansion} />
              <Column
                key={"content"}
                field={"content"}
                header={"Task"}
                sortable
                body={(rowData) => (
                  <input
                    className={`lvl-${rowData.indentation}`}
                    style={{
                      fontWeight: allowExpansion(rowData) ? "bolder" : "normal",
                    }}
                    disabled={grp2Items[2].is_write == true ? false : true}
                    type="text"
                    value={rowData.content}
                    onChange={(e) => {
                      handleChange(rowData, "content", e.target.value);
                    }}
                    onClick={() => {
                      const selectedSno = rowData.sno;
                      setSelectedRow(selectedSno);
                      setSelectedTaskId(rowData.taskId);
                    }}
                  />
                )}
              />
              <Column
                key={"start"}
                field={"start"}
                header={"Start"}
                sortable
                body={(rowData) => (
                  <span
                    onClick={() => {
                      const selectedSno = rowData.sno;
                      setSelectedRow(selectedSno);
                      setSelectedTaskId(rowData.taskId);
                    }}
                    title={moment(rowData.start).format("DD-MMM-yyyy")}
                  >
                    <DatePicker
                      portalId="root-portal"
                      disabled={
                        (grp2Items[2].is_write == true ? false : true) ||
                        allowExpansion(rowData)
                      }
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      filterDate={(date) => {
                        return date.getDay() !== 0 && date.getDay() !== 6;
                      }}
                      selected={moment(rowData.start).toDate()}
                      showMonthDropdown={true}
                      showYearDropdown={true}
                      onClick={() => {
                        const selectedSno = rowData.sno;
                        setSelectedRow(selectedSno);
                        setSelectedTaskId(rowData.taskId);
                      }}
                      onChange={(date) => {
                        const updatedData = [...taskList];
                        const value = numberOfDays(
                          date,
                          new Date(rowData.finish)
                        );
                        updatedData[rowData.sno - 1] = {
                          ...rowData,
                          duration: value,
                          start: moment(date).format("YYYY-MM-DD"),
                        };
                        setTaskList(updatedData);
                      }}
                    />
                  </span>
                )}
              />
              <Column
                key={"finish"}
                field={"finish"}
                header={"Finish"}
                sortable
                body={(rowData) => (
                  <span
                    onClick={() => {
                      const selectedSno = rowData.sno;
                      setSelectedRow(selectedSno);
                      setSelectedTaskId(rowData.taskId);
                    }}
                    title={moment(rowData.finish).format("DD-MMM-yyyy")}
                  >
                    <DatePicker
                      portalId="root-portal"
                      disabled={
                        (grp2Items[2].is_write == true ? false : true) ||
                        allowExpansion(rowData)
                      }
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      selected={moment(rowData.finish).toDate()}
                      showMonthDropdown={true}
                      showYearDropdown={true}
                      filterDate={(date) => {
                        return date.getDay() !== 0 && date.getDay() !== 6;
                      }}
                      onClick={() => {
                        const selectedSno = rowData.sno;
                        setSelectedRow(selectedSno);
                        setSelectedTaskId(rowData.taskId);
                      }}
                      onChange={(date) => {
                        const updatedData = [...taskList];
                        const value = numberOfDays(
                          new Date(rowData.start),
                          date
                        );
                        updatedData[rowData.sno - 1] = {
                          ...rowData,
                          duration: value,
                          finish: moment(date).format("YYYY-MM-DD"),
                        };
                        setTaskList(updatedData);
                      }}
                    />
                  </span>
                )}
              />

              <Column
                key={"duration"}
                field={"duration"}
                header={"Duration(d)"}
                sortable
                body={(rowData) => (
                  <input
                    style={{
                      fontWeight: allowExpansion(rowData) ? "bolder" : "normal",
                    }}
                    title={parseInt(
                      rowData.duration == "" ? "0" : rowData.duration
                    )}
                    disabled={
                      (grp2Items[2].is_write == true ? false : true) ||
                      allowExpansion(rowData)
                    }
                    type="text"
                    value={parseInt(
                      rowData.duration == "" ? "0" : rowData.duration
                    )}
                    onClick={() => {
                      const selectedSno = rowData.sno;
                      setSelectedRow(selectedSno);
                      setSelectedTaskId(rowData.taskId);
                    }}
                    onChange={(e) => {
                      handleChange(rowData, "duration", e.target.value);
                    }}
                    onBlur={(e) => {
                      const formatDate = (date) => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        return `${year}-${month}-${day}`;
                      };
                      const finishDate = formatDate(
                        addBusinessDays(rowData.start, e.target.value - 1)
                      );

                      handleChange(rowData, "finish", finishDate);
                    }}
                  ></input>
                )}
              />
              <Column
                key={"roleName"}
                field={"roleName"}
                header={"Role"}
                sortable
                body={(rowData) =>
                  allowExpansion(rowData) ? (
                    <></>
                  ) : (
                    <select
                      disabled={grp2Items[2].is_write == true ? false : true}
                      onClick={() => {
                        const selectedSno = rowData.sno;
                        setSelectedRow(selectedSno);
                        setSelectedTaskId(rowData.taskId);
                      }}
                      onChange={(e) => {
                        const selectedRoleName =
                          e.target.options[e.target.selectedIndex].getAttribute(
                            "selectedRoleName"
                          );
                        handleChange(
                          rowData,
                          "roleId",
                          e.target.value,
                          (rowData.roleName = selectedRoleName)
                        );
                      }}
                    >
                      <option value={null}>&lt;&lt;All&gt;&gt;</option>
                      {roleType.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                          selected={rowData.roleId == item.id}
                          selectedRoleName={item.name}
                          title={item.roleName}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )
                }
              />
              <Column
                key={"estimatedHrs"}
                field={"estimatedHrs"}
                header={"Estimated Hrs"}
                sortable
                body={(rowData) =>
                  allowExpansion(rowData) ? (
                    <></>
                  ) : (
                    <input
                      disabled={grp2Items[2].is_write == true ? false : true}
                      type="text"
                      value={rowData.estimatedHrs}
                      title={rowData.estimatedHrs}
                      onClick={() => {
                        const selectedSno = rowData.sno;
                        setSelectedRow(selectedSno);
                        setSelectedTaskId(rowData.taskId);
                      }}
                      onChange={(e) =>
                        // handleChange(rowData, "estimatedHrs", e.target.value)
                        {
                          const inputValue = e.target.value;
                          const isValidInput = /^\d*$/.test(inputValue);

                          if (isValidInput || inputValue === "") {
                            handleChange(rowData, "estimatedHrs", inputValue);
                          }
                        }
                      }
                      style={{ textAlign: "right" }}
                    ></input>
                  )
                }
              />
              <Column
                key={"assignmentsContent"}
                field={"assignmentsContent"}
                header={"Assignments"}
                sortable
                body={(rowData) => (
                  <input
                    type="text"
                    title={rowData.assignmentsContent}
                    value={rowData.assignmentsContent}
                    style={{ textDecoration: "underline" }}
                    onClick={() => {
                      const selectedSno = rowData.sno;
                      const checkFinishDate = rowData.finish;
                      const currentDate = moment(new Date()).format(
                        "YYYY-MM-DD"
                      );

                      setResourcePopUp(
                        checkFinishDate >= currentDate ? true : false
                      );
                      if (currentDate > checkFinishDate) {
                        setResourcePopUp(false);
                        alert(
                          "Change the task end date for resource allocations"
                        );
                      }
                      if (rowData.estimatedHrs == 0) {
                        setResourcePopUp(false);
                        alert("Please enter Estimated Hrs");
                      } else if (rowData.assignmentsContent == "") {
                        setResourcePopUp(false);
                        alert("Please save Task");
                      }
                      setSelectedRow(selectedSno);
                      setSelectedTaskId(rowData.taskId);
                    }}
                    onChange={(e) =>
                      handleChange(
                        rowData,
                        "assignmentsContent",
                        e.target.value
                      )
                    }
                  ></input>
                )}
              />
              <Column
                key={"actualHrs"}
                field={"actualHrs"}
                header={"Actual Hrs"}
                sortable
                body={(rowData, column) => {
                  const value = rowData[column.field];
                  const formattedValue =
                    value == null ? "0.0" : value.toFixed(1);
                  return allowExpansion(rowData) ? (
                    <></>
                  ) : (
                    <span
                      onClick={() => {
                        const selectedSno = rowData.sno;
                        setSelectedRow(selectedSno);
                        setSelectedTaskId(rowData.taskId);
                      }}
                      title={formattedValue}
                    >
                      {formattedValue}
                    </span>
                  );
                }}
              />
              <Column
                key={"approvedHrs"}
                field={"approvedHrs"}
                header={"Approved Hrs"}
                sortable
                body={(rowData, column) => {
                  const value = rowData[column.field];
                  const formattedValue =
                    value == null ? "0.0" : value.toFixed(1);
                  return allowExpansion(rowData) ? (
                    <></>
                  ) : (
                    <span
                      onClick={() => {
                        const selectedSno = rowData.sno;
                        setSelectedRow(selectedSno);
                        setSelectedTaskId(rowData.taskId);
                      }}
                      title={formattedValue}
                    >
                      {formattedValue}
                    </span>
                  );
                }}
              />
              <Column
                key={"status"}
                field={"status"}
                header={"Status"}
                sortable
                body={(rowData) =>
                  allowExpansion(rowData) ? (
                    <></>
                  ) : (
                    <span
                      onClick={(e) => {
                        const selectedSno = rowData.sno;
                        setSelectedRow(selectedSno);
                        setSelectedTaskId(rowData.taskId);
                      }}
                      title={rowData.status}
                      style={{
                        display: "block", // This ensures the span takes up full width
                        textAlign: "center",
                        margin: "0 auto", // This centers the content horizontally
                      }}
                    >
                      {rowData.status}
                    </span>
                  )
                }
              />
              <Column
                key={"taskType"}
                field={"taskType"}
                header={"Task Type"}
                sortable
                body={(rowData) =>
                  allowExpansion(rowData) ? (
                    <></>
                  ) : (
                    <select
                      disabled={grp2Items[2].is_write == true ? false : true}
                      onClick={() => {
                        const selectedSno = rowData.sno;
                        setSelectedRow(selectedSno);
                        setSelectedTaskId(rowData.taskId);
                      }}
                      onChange={(e) =>
                        handleChange(rowData, "taskType", e.target.value)
                      }
                      title={
                        taskType.find((item) => item.value === rowData.taskType)
                          ?.name || ""
                      }
                    >
                      {taskType.map((item) => (
                        <option
                          key={item.value}
                          value={item.value}
                          selected={rowData.taskType == item.value}
                          title={item.name}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )
                }
              />
            </DataTable>
          </div>

          {dataObject?.is_write == true ? (
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn-container center mt-3">
              <button
                className="btn btn-primary"
                name="save"
                id="save"
                type="save"
                onClick={() => {
                  saveTaskList(taskList);
                  setTaskSaved(true);
                }}
              >
                <VscSave />
                Save
              </button>
              <button
                className="btn btn-secondary"
                id="cancel"
                type="reset"
                onClick={resetTaskList}
              >
                <VscChromeClose />
                Cancel
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {deletePopUp ? (
        <TaskPlanDeletePopUp
          setDeletedSuccess={setDeletedSuccess}
          setDeletedFailed={setDeletedFailed}
          deletePopUp={deletePopUp}
          setDeletePopUp={setDeletePopUp}
          selectedTaskId={selectedTaskId}
        />
      ) : (
        ""
      )}

      {resourcePopUp ? (
        <TaskPlanResourcePopUp
          resourcePopUp={resourcePopUp}
          setResourcePopUp={setResourcePopUp}
          taskList={taskList}
          selectedRow={selectedRow}
          grp2Items={grp2Items}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default TaskPlan;
