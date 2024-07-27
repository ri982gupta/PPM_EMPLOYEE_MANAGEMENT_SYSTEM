import moment from "moment";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import DatePicker from "react-datepicker";
import MaterialReactTable from "material-react-table";
import { environment } from "../../environments/environment";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "../../App.scss";
import { grey } from "@mui/material/colors";
import SvgIcon from "@mui/material/SvgIcon";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Menu from "@mui/material/Menu";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Stack } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import Tooltip from "@mui/material/Tooltip";
import Loader from "../Loader/Loader";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";
import "./myDashboard.scss";
import PopoverDialog from "./PopoverDialog";
import MyDashboardInfoPopOver from "./MyDashboardInfoPopOver";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

function MyDashboard() {
  let estimatedSum = 0;
  const baseUrl = environment.baseUrl;
  const [timesheet, setTimesheet] = useState([]);
  const [timesheetDone, setTimesheetDone] = useState([]);
  const [timesheetCopy, setTimeSheetCopy] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [billingHistoryDone, setBillingHistoryDone] = useState([]);
  const [headings, setHeadings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [nextWeekDates, setNextWeekDates] = useState([]);
  const [weekDates, setWeekDates] = useState([]);
  const [upcomingMondays, setUpcomingMondays] = useState([]);
  const [mday, setMday] = useState();
  const [sday, setSday] = useState();
  const abortController = useRef(null);
  const [actuals, setactuals] = useState();
  const [helpDialogVisible, setHelpDialogVisible] = useState(false);
  const [lastTableData, setLasttableData] = useState([]);
  const [lastTableDataDone, setLasttableDataDone] = useState([]);
  const [issuesTableData, setIssuesTableData] = useState([]);
  const [issuesTableDataDone, setIssuesTableDataDone] = useState([]);
  const [tabState, setTabState] = useState(false);
  const [resNotes, setResNotes] = useState("");
  const [taskStatusId, setTaskStatusId] = useState("");
  const [estimatedVal, setEstimatedVal] = useState(0);
  const [assignedVal, setAssignedVal] = useState(0);
  const [actualVal, setActualVal] = useState(0);
  const [actualV, setActualV] = useState(0);
  const [approvedVal, setApprovedVal] = useState(0);
  const [rejectedVal, setRejectedVal] = useState(0);
  const [pendingVal, setPendingVal] = useState(0);
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [info, setInfo] = useState("");
  const [enteredHoursData, setEnteredHoursData] = useState([]);
  const [resourceId, setResourceId] = useState(
    Number(localStorage.getItem("resId")) + 1
  );
  const [loader, setLoader] = useState(false);
  const [approvedLeavesCount, setApprovedLeavesCount] = useState(0.0);
  const [totalAggregation, setTotalAggregation] = useState(false);
  const [addHours, setAddhours] = useState(false);
  const [timeEntry, setTimeEntry] = useState([]);
  const [successMsg, setSuccessMsg] = useState(false);
  const [infoPop, setInfoPop] = useState("");
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [enteredHoursDataArr, setEnteredHoursDataArr] = useState([]);
  const [shouldOpenIndexesArr, setShouldOpenIndexesArr] = useState([]);
  const [enableonModify, setEnableOnModify] = useState(false);

  const [initialStateExpand, setInitialStateExpand] = useState({});
  const [totalHoursCheck, setTotalHoursCheck] = useState([]);
  const [leaveDates, setLeaveDates] = useState([]);
  const [resdate, setResdate] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isPopOpen, setIsPopOpen] = useState(false);
  const [popoverTaskId, setPopoverTaskId] = useState(null);
  const [popoverColumnId, setPopoverColumnId] = useState(null);
  let result = 0;

  const [routes, setRoutes] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  let currentScreenName = ["My Dashboard"];
  const HelpPDFName = "MyDashboard.pdf";
  const Headername = "My Dashboard Help";
  const [cnt, setCnt] = useState(0);
  const [exceedHoursDates, setExceedHoursDates] = useState([]);
  const myArray = [];
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const today = new Date();
  const previousDays = [];
  let firstday = [];
  const secday = [];
  const thirdday = [];
  const fourthday = [];
  const fifthday = [];
  const [refreshFlag, setRefreshFlag] = useState(false);
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay()
  );
  const endOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    startOfWeek.getDate() + 6
  );
  const [currentWeek, setCurrentWeek] = useState(() => {
    const week = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      week.push(date.toDateString());
    }
    setMday(week[0]);
    setSday(week[6]);
    return week;
  });
  let paletteHeadings = [
    { heading: "Leave", color: "#ee6fa0" },
    { heading: "Pending Approval", color: "#e17658" },
    { heading: "Approved", color: "#50b179d9" },
    { heading: "Rejected", color: "#e54c53" },
    { heading: "Holiday", color: "#5399c7" },
  ];
  let count = 14 + today.getDay();
  let currday = today.getDay();
  const day = today.getDay(); // 0 is Sunday, 6 is Saturday
  const weekStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - day
  );
  const weekEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + (6 - day)
  );

  const navigate = useNavigate();
  const allDates = [...weekDates, ...nextWeekDates, ...upcomingMondays];
  const dates = [];
  const mdays = [firstday];
  for (let i = count; i >= 1; i--) {
    const previousDay = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    if (previousDay.getDay() != 0 && previousDay.getDay() != 6 && i > currday) {
      if (previousDay.getDay() == 1) {
        {
          moment(previousDay).format("DD-MMM");
        }
        firstday.push(previousDay);
      } else if (previousDay.getDay() == 2) {
        {
          moment(previousDay).format("DD-MMM");
        }
        secday.push(previousDay);
      } else if (previousDay.getDay() == 3) {
        {
          moment(previousDay).format("DD-MMM");
        }
        thirdday.push(previousDay);
      } else if (previousDay.getDay() == 4) {
        {
          moment(previousDay).format("DD-MMM");
        }
        fourthday.push(previousDay);
      } else if (previousDay.getDay() == 5) {
        {
          moment(previousDay).format("DD-MMM");
        }
        fifthday.push(previousDay);
      }
      {
        moment(previousDay).format("DD-MMM");
      }
      previousDays.push(previousDay);
    }
  }

  for (
    let date = weekStart;
    date <= weekEnd;
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      if (date.getDay() == 1) {
        firstday.push(new Date(date));
      } else if (date.getDay() == 2) {
        secday.push(new Date(date));
      } else if (date.getDay() == 3) {
        thirdday.push(new Date(date));
      } else if (date.getDay() == 4) {
        fourthday.push(new Date(date));
      } else if (date.getDay() == 5) {
        fifthday.push(new Date(date));
      }

      dates.push(new Date(date));
    }
  }

  const threeWeeks = [firstday, secday, thirdday, fourthday, fifthday];

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const getTimeEntry = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/Dashboard/getTimeEntry?resourceId=${+loggedUserId}&startDate=${moment(
          threeWeeks[0][0]
        ).format("YYYY-MM-DD")}&endDate=${moment(threeWeeks[4][2]).format(
          "YYYY-MM-DD"
        )}`,
    }).then((res) => {
      let result = res.data;
      setTimeEntry(result);
    });
  };

  const timeEntryClass = (date) => {
    const found = timeEntry.find(
      (entry) => entry.timesheet_dt == moment(date).format("YYYY-MM-DD")
    );

    if (found) {
      return found.status;
    } else return "";
  };

  const getRightTableData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/Dashboard/getResIssues?resourceId=${+loggedUserId}&fromDt=${moment(
          currentWeek[0]
        ).format("YYYY-MM-DD")}`,
    }).then((res) => {
      let result = res.data;
      setIssuesTableData(result);
      setIssuesTableDataDone(["Done"]);
    });
  };
  const projectTimesheet = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/Dashboard/getResAssignedHrs?resourceId=${+loggedUserId}&fromDt=${moment(
          currentWeek[0]
        ).format("YYYY-MM-DD")}`,
    }).then((res) => {
      let result = res.data;
      let formattedResult = [];
      let d = new Date();
      let nextMonth = month[d.getMonth() + 1];
      result.map((values) => {
        let temp1 = Object.entries(values).sort();
        let temp2 = [];
        temp1.forEach(([key, value]) => {
          temp2.push([
            key != "Name" ? key.split("_")[0] + " " + key.split("_")[1] : key,
            isNaN(value) ? value : Number(value).toFixed(2),
          ]);
        });
        formattedResult.push(Object.fromEntries(temp2));
      });
      setLasttableData(formattedResult);
      setLasttableDataDone(["Done"]);
    });
  };

  const timeEntryLeaves = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/Dashboard/getLeaves?resourceId=${+loggedUserId}&startDate=${moment(
          threeWeeks[0][0]
        ).format("YYYY-MM-DD")}&endDate=${moment(threeWeeks[4][2]).format(
          "YYYY-MM-DD"
        )}`,
    }).then((res) => {
      let result = res.data;
      setLeaveDates(result);
    });
  };
  const approvedLeavesData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/Dashboard/getLeaves?resourceId=${+loggedUserId}&startDate=${moment(
          currentWeek[0]
        ).format("YYYY-MM-DD")}&endDate=${moment(
          currentWeek[currentWeek.length - 1]
        ).format("YYYY-MM-DD")}`,
    }).then((res) => {
      let result = res.data;
      let totalLeaves = 0;

      setApprovedLeaves(result);
      result?.map((d) => (totalLeaves += Number(d.leave_hours)));
      setApprovedLeavesCount(totalLeaves);
      setCnt(0);
    });
  };

  let classNameForIcon = document.getElementsByClassName(
    "MuiTableRow-root MuiTableRow-hover"
  );
  if (classNameForIcon.length > 0) {
    let finalClassNameForIcon =
      classNameForIcon[0].children[1].classList.toString();
    let collapseIcon = document.getElementsByClassName(finalClassNameForIcon);
    if (collapseIcon.length > 0) {
      for (let i = 0; i < collapseIcon.length; i++) {
        collapseIcon[i].addEventListener(
          "click",
          function (params) {
            setTimeout(() => {
              let angle =
                collapseIcon[i].children[0].children[0].children[0].style
                  .transform;

              let projectName =
                collapseIcon[i].previousSibling.children[0].children[0]
                  .innerHTML;

              if (angle == "rotate(0deg)") {
                Object.keys(initialStateExpand).forEach((d) => {
                  let keyy = d.split(":");

                  if (keyy[1] == projectName) {
                    delete initialStateExpand[d];
                  }
                });
              } else {
                setInitialStateExpand((prev) => ({
                  ...prev,
                  ["projectName:" + projectName]: true,
                }));
              }
            }, 100);
          },
          true
        );
      }
    }
  }

  const weekHoursData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/Dashboard/getHours?resourceId=${+loggedUserId}&startDate=${moment(
          currentWeek[0]
        ).format("YYYY-MM-DD")}&endDate=${moment(
          currentWeek[currentWeek.length - 1]
        ).format("YYYY-MM-DD")}`,
    }).then((res) => {
      let result = res.data;
      setEnteredHoursData(result);
      setTimeout(() => {
        // setLoader(false);
      }, 300);
    });
  };

  const getResourceTimesheet = async () => {
    setTabState(false);
    await axios({
      method: "post",
      url: baseUrl + `/dashboardsms/Dashboard/getResourceTimesheet`,
      // url: `http://localhost:8090/dashboardsms/Dashboard/getResourceTimesheet`,
      data: {
        ResId: +loggedUserId,
        WkStDt: `${moment(currentWeek[0]).format("YYYY-MM-DD")}`,
        WkEndDt: `${moment(currentWeek[currentWeek.length - 1]).format(
          "YYYY-MM-DD"
        )}`,
        PrjId: 0,
      },
    }).then((res) => {
      let result = res.data;
      let formattedResult = [...Object.entries(result)];
      let finalResult = [];
      formattedResult.reverse().map((data) => {
        data[1].map((d) => {
          finalResult.push(d);
        });
      });
      const filteredResult = finalResult.filter((item) => {
        if (item.projectPlannedEndDt) {
          const plannedEndDate = item.projectPlannedEndDt;
          return (
            moment(plannedEndDate).format("YYYY-MM-DD") >
            moment(monday).format("YYYY-MM-DD")
          );
        }
        return false;
      });

      const othersData = finalResult.filter(
        (item) => item.projectName === "Others"
      );

      const filteredData = finalResult.filter(
        (item) => item.projectName !== "Others"
      );

      const finalData = [...filteredData, ...othersData];
      setTimesheet(finalData);
      // setLoader(false);
      setTimesheetDone(["Done"]);

      setTimeSheetCopy(finalData);
      let estimated = 0;
      let assigned = 0;
      let actual = 0;
      let approved = 0;
      let rejected = 0;
      let pending = 0;

      let notes = "";
      let rDate = "";
      let TaskStatusId = "";
      finalResult?.forEach((d) => {
        estimated += d.estimatedHours;
        assigned += d.allocatedHours;
        actual += Number(d.taskTotalHours);
        approved += d.taskApprovedHours;
        rejected += d.taskRejectedHours;
        pending += d.taskPendingApprovalHours;
        notes = d.resourceNotes;
        rDate = d.timesheetDt;
        TaskStatusId = d.taskStatusId;
      });
      setResdate(rDate);
      setEstimatedVal(estimated);
      setAssignedVal(assigned);
      setActualVal(actual);
      setApprovedVal(approved);
      setRejectedVal(rejected);
      setPendingVal(pending);
      setResNotes(notes);
      setTaskStatusId(TaskStatusId);
    });
  };

  useEffect(() => {
    currWeekHandler();
  }, [
    estimatedVal,
    assignedVal,
    actualVal,
    approvedVal,
    rejectedVal,
    pendingVal,
    approvedLeavesCount,
    totalAggregation,
    addHours,
    resNotes,
    resdate,
    taskStatusId,
  ]);

  const getBillingHistory = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/Dashboard/getBillingHistory?resourceId=${+loggedUserId}&monthFromDate=${moment()
          .subtract("months", 1)
          .format("YYYY-MM-DD")}&yearFromDate=${moment()
          .subtract("year", 1)
          .format("YYYY-MM-DD")}&toDate=${moment().format("YYYY-MM-DD")}`,
    }).then((res) => {
      let result = res.data;
      setBillingHistory(result);
      setBillingHistoryDone(["Done"]);
    });
  };

  const statusChange = (row, e) => {
    let timeSheet = timesheetCopy;
    let index;
    timeSheet.map((sheet) => {
      if (
        sheet.projectId == row.original.projectId &&
        sheet.taskId == row.original.taskId
      ) {
        index = timeSheet.indexOf(sheet);
      }
    });
    timeSheet[index].taskStatusId = e.target.value;
    setTimeSheetCopy(timeSheet);
  };

  const showpopover = (e) => {
    if (popoverAnchorEl) {
      setIsPopOpen(false);
    } else {
      setIsOpenInfo(true);
      setIsPopOpen(true);
      setInfoPop(e);
    }
  };

  const headers = [
    {
      id: "projectName",
      accessorKey: "projectName",
      header: <div className="mixer">{"Project"}</div>,
      enableGrouping: true,
      Tooltip: "abc",

      columns: [
        {
          id: "projectName",
          accessorKey: "projectName",
          Cell: ({ cell, row }) => (
            <div className="ellipsis projName">
              <Link
                target="_blank"
                to={`/project/Overview/:${row.original.projectId}`}
                style={{ color: "blue", textDecoration: "none" }}
              >
                {cell.getValue()}
              </Link>
            </div>
          ),
          Footer: () => <p>Approved Leaves</p>,
        },
      ],
    },
    {
      id: "taskName",
      accessorKey: "taskName",
      header: <div className="mixer">{"Task"}</div>,
      columns: [
        {
          id: "taskName",
          accessorKey: "taskName",
          Cell: ({ cell, row }) => (
            <div
              className="projName"
              aria-label={cell.row.original.projectPlannedEndDt}
            >
              {row.original.projectName != "Others" ? (
                <InfoOutlinedIcon
                  className="infoCircle"
                  onClick={(e) => {
                    showpopover(cell);
                    setPopoverAnchorEl(e.currentTarget);
                  }}
                />
              ) : null}
              <span title={cell.getValue()}>{cell.getValue()}</span>
            </div>
          ),
        },
      ],
    },
    {
      id: "taskTypeId",
      accessorKey: "taskTypeId",
      header: <div className="mixer">{"Type"}</div>,
      columns: [
        {
          id: "taskTypeId",
          accessorKey: "taskTypeId",
          Cell: ({ cell }) => (
            <p>
              {cell.getValue() == 237
                ? "Non Billable Utilized"
                : cell.getValue() == 807
                ? "Non Billable Non Utilized"
                : cell.getValue() == 236
                ? "Billable"
                : cell.getValue() == 582
                ? "Non Billable Shadow"
                : cell.getValue() == 583
                ? "Non Billable Enablement"
                : cell.getValue() == 806
                ? "Non Billable Client Prep"
                : null}
            </p>
          ),
        },
      ],
    },
    {
      id: "taskStatusId",
      accessorKey: "taskStatusId",
      enableEditiing: true,
      header: <div className="mixer">{"Status"}</div>,
      columns: [
        {
          id: "taskStatusId",
          accessorKey: "taskStatusId",
          enableEditiing: true,
          Cell: ({ cell, row, table }) => (
            <div className="projStatus">
              {cell.getValue() && row.original.projectName != "Others" ? (
                <Select
                  defaultValue={cell.getValue()}
                  onChange={(e) => statusChange(row, e)}
                >
                  {cell.getValue() == 232 ? (
                    <MenuItem value={232}>New</MenuItem>
                  ) : null}
                  {cell.getValue() == 235 || cell.getValue() == 234 ? null : (
                    <MenuItem value={233}>In Progress</MenuItem>
                  )}
                  {cell.getValue() == 234 ? (
                    <MenuItem value={234}>Withdrawn</MenuItem>
                  ) : null}
                  {cell.getValue() == 234 || cell.getValue() == 232 ? null : (
                    <MenuItem value={235}>Completed</MenuItem>
                  )}
                </Select>
              ) : null}
            </div>
          ),
        },
      ],
      Footer: () => <p>Totals:</p>,
    },
    {
      id: "estimatedHours",
      accessorKey: "estimatedHours",
      header: <div className="mixer">{"Estimated"}</div>,
      columns: [
        {
          id: "estimatedHours",
          accessorKey: "estimatedHours",
          aggregationFn: "sum",
          AggregatedCell: ({ cell }) => (
            <div>{parseFloat(cell.getValue()).toFixed(2)} </div>
          ),
          Cell: ({ cell, column, row, table }) => (
            <div>
              {cell.getValue() != null
                ? parseFloat(cell.getValue()).toFixed(2)
                : null}
            </div>
          ),
        },
      ],
      Footer: () => (
        <Stack>
          <Box>{parseFloat(estimatedVal).toFixed(2)}</Box>
        </Stack>
      ),
    },

    {
      id: "allocatedHours",
      accessorKey: "allocatedHours",
      header: <div className="mixer">{"Assigned"}</div>,
      columns: [
        {
          id: "allocatedHours",
          accessorKey: "allocatedHours",
          AggregatedCell: ({ cell }) => (
            <div>{parseFloat(cell.getValue()).toFixed(2)} </div>
          ),
          Cell: ({ cell }) => (
            <div>
              {cell.getValue() != null
                ? parseFloat(cell.getValue()).toFixed(2)
                : null}
            </div>
          ),
        },
      ],
      Footer: () => (
        <Stack>
          <Box>{parseFloat(assignedVal).toFixed(2)}</Box>
        </Stack>
      ),
    },

    {
      id: "taskTotalHours",
      accessorKey: "taskTotalHours",
      header: <div className="mixer">{"Actual"}</div>,
      columns: [
        {
          id: "taskTotalHours",
          accessorKey: "taskTotalHours",
          AggregatedCell: ({ cell }) => (
            <div>{parseFloat(cell.getValue()).toFixed(2)} </div>
          ),
          Cell: ({ cell }) => (
            <div>
              {parseFloat(cell.getValue()).toFixed(2)}
              {setactuals(parseFloat(cell.getValue()).toFixed(2))}
            </div>
          ),
          Footer: () => <div>{parseFloat(approvedLeavesCount).toFixed(2)}</div>,
        },
      ],
      Footer: () => (
        <Stack>
          <Box>{parseFloat(actualVal).toFixed(2)}</Box>
        </Stack>
      ),
    },
    {
      id: "projectApprovedHours",
      accessorKey: "projectApprovedHours",
      header: <div className="mixer">{"Approved"}</div>,
      columns: [
        {
          id: "projectApprovedHours",
          accessorKey: "projectApprovedHours",
          AggregatedCell: ({ cell }) => (
            <div>{parseFloat(Number(cell.getValue())).toFixed(2)}</div>
          ),
          Cell: ({ cell, row }) => (
            <div>{parseFloat(cell.getValue()).toFixed(2)}</div>
          ),
        },
      ],
      Footer: () => (
        <Stack>
          <Box>{parseFloat(approvedVal).toFixed(2)}</Box>
        </Stack>
      ),
    },
    {
      id: "taskRejectedHours",
      accessorKey: "taskRejectedHours",
      header: <div className="mixer">{"Rejected"}</div>,
      columns: [
        {
          id: "taskRejectedHours",
          accessorKey: "taskRejectedHours",
          AggregatedCell: ({ cell }) => (
            <div>{parseFloat(cell.getValue()).toFixed(2)} </div>
          ),
          Cell: ({ cell }) => (
            <div>{parseFloat(cell.getValue()).toFixed(2)}</div>
          ),
        },
      ],
      Footer: () => (
        <Stack>
          <Box>{parseFloat(rejectedVal).toFixed(2)}</Box>
        </Stack>
      ),
    },
    {
      id: "taskPendingApprovalHours",
      accessorKey: "taskPendingApprovalHours",
      header: <div className="mixer">{"Pending Approval"}</div>,
      columns: [
        {
          id: "taskPendingApprovalHours",
          accessorKey: "taskPendingApprovalHours",
          AggregatedCell: ({ cell }) => (
            <div>{parseFloat(cell.getValue()).toFixed(2)} </div>
          ),
          Cell: ({ cell }) => (
            <div>
              {cell.getValue() != null
                ? parseFloat(cell.getValue()).toFixed(2)
                : parseFloat(0).toFixed(2)}
            </div>
          ),
        },
      ],
      Footer: () => (
        <Stack>
          <Box>{parseFloat(pendingVal).toFixed(2)}</Box>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    getRightTableData();
    projectTimesheet();
    getBillingHistory();
    let dates = [];
    let currentDateCopy = new Date(currentDate);
    for (let i = 1; i <= 7; i++) {
      let first = currentDateCopy.getDate() - currentDateCopy.getDay() + i;
      let day = new Date(currentDateCopy.setDate(first)).toLocaleString(
        "en-us",
        { day: "2-digit", month: "short" }
      );
      dates.push(day);
    }
    setWeekDates(dates);
    let nextDates = [];
    let nextDateCopy = new Date(currentDate);
    nextDateCopy.setDate(nextDateCopy.getDate() + 7);
    for (let i = 1; i <= 7; i++) {
      let first = nextDateCopy.getDate() - nextDateCopy.getDay() + i;
      let day = new Date(nextDateCopy.setDate(first)).toLocaleString("en-us", {
        day: "2-digit",
        month: "short",
      });
      nextDates.push(day);
    }
    setNextWeekDates(nextDates);
    let upcomingMondays = [];
    let nextWeekStartDate = new Date(nextDateCopy);
    while (upcomingMondays.length < 4) {
      let upcomingMondayDate = new Date(nextWeekStartDate);
      upcomingMondayDate.setDate(
        upcomingMondayDate.getDate() +
          ((1 + 7 - upcomingMondayDate.getDay()) % 7)
      );
      let day = upcomingMondayDate.toLocaleString("en-us", {
        day: "2-digit",
        month: "short",
      });
      upcomingMondays.push(day);
      nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7);
    }
    setUpcomingMondays(upcomingMondays);
  }, [currentDate]);

  const checkCurrentWeek = (allocatedDates, taskEndDt, column) => {
    let dateValid;
    const dateParts = allocatedDates.split(" to ");
    const startDate = new Date(dateParts[0]);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    let lastDayOfMonth = new Date(year, month + 1, 0);
    let endDate = new Date(dateParts[1]);

    if (lastDayOfMonth <= endDate) {
      endDate = lastDayOfMonth;
    }

    currentWeek.map((day) => {
      if (
        moment(column.id).format("YYYY-MM-DD") ==
        moment(day).format("YYYY-MM-DD")
      ) {
        dateValid =
          new Date(day) >= new Date(startDate) &&
          new Date(day) <= new Date(endDate);
      }
    });
    return dateValid;
  };

  // useEffect(() => {
  //   setLoader(true);
  // }, []);

  useEffect(() => {
    getTimeEntry();
    weekHoursData();
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, [currentWeek, timesheetCopy]);

  useEffect(() => {
    currWeekHandler();
  }, [enteredHoursData]);

  useEffect(() => {
    currWeekHandler();
  }, [enteredHoursDataArr]);

  const searchEnteredHours = (day, row, column) => {
    let result;
    let hours = enteredHoursData;
    hours.map((d) => {
      if (row.original.projectId == 0) {
        if (
          new Date(d.timesheet_dt).toDateString() == day &&
          d.other_task_item_id == row.original.taskId
        ) {
          result = d.entered_hours;
        }
      }
      if (
        new Date(d.timesheet_dt).toDateString() == day &&
        d.project_task_id == row.original.taskId
      ) {
        result = d.entered_hours;
      }
    });
    return result;
  };

  const modifyEnteredHours = (day, row, e) => {
    const defaultValue = searchEnteredHours(day, row);
    let b = e.target.value;
    let a = 0;
    let hour = enteredHoursData;
    let d = actualV;
    if (actualV == 0) {
      d = row.original.timesheetHours;
    }
    hour.forEach((d) => {
      if (
        new Date(d.timesheet_dt).toDateString() == day &&
        row.original.taskId == d.project_task_id
      ) {
        count++;
        result = d.entered_hours;
        a = result;
        if (a < b) {
          let c = 0;
          c = b - a;
          d.actual_hours = c;
          setActualV(actualV + c);
        } else if (a > b) {
          let c = 0;
          c = b - a;
          d.actual_hours = c;
          setActualV(actualV + c);
        }
      }
    });

    setInitialStateExpand((prev) => ({
      ...prev,
      ["projectName:" + row.original.projectName]: true,
    }));
    let hours = enteredHoursData;
    e.target.value = parseFloat(e.target.value).toFixed(2);
    let check = hours.some((d) => {
      return (
        (d.other_task_item_id == row.original.taskId ||
          d.project_task_id == row.original.taskId) &&
        d.timesheet_dt == moment(day).format("YYYY-MM-DD")
      );
    });
    if (row.original.projectId != 0) {
      e.target.style.backgroundColor =
        Number(e.target.value) > 0 ? "rgb(225, 118, 88)" : "";
      e.target.parentElement.parentElement.style.backgroundColor =
        Number(e.target.value) > 0 ? "rgb(225, 118, 88)" : "";
    }
    if (check && Number(e.target.value)) {
      hours.map((d) => {
        if (row.original.projectId == 0) {
          if (
            new Date(d.timesheet_dt).toDateString() == day &&
            d.other_task_item_id == row.original.taskId
          ) {
            d.entered_hours = parseFloat(e.target.value).toFixed(2);
          }
        } else {
          if (
            new Date(d.timesheet_dt).toDateString() == day &&
            d.project_task_id == row.original.taskId
          ) {
            d.entered_hours = parseFloat(e.target.value).toFixed(2);
          }
        }
      });
    } else if (check && Number(e.target.value) == 0) {
      hours.map((d) => {
        if (row.original.projectId == 0) {
          if (
            new Date(d.timesheet_dt).toDateString() == day &&
            d.other_task_item_id == row.original.taskId
          ) {
            d.entered_hours = 0;
          }
        } else {
          if (
            new Date(d.timesheet_dt).toDateString() == day &&
            d.project_task_id == row.original.taskId
          ) {
            d.entered_hours = 0;
          }
        }
      });

      hour.map((ele) =>
        ele.id == row.original.projectId ? (ele.entered_hours = 0) : null
      );
    } else {
      hours.push({
        entered_hours: Number(parseFloat(e.target.value).toFixed(2)),
        project_id: row.original.projectId,
        project_task_id:
          row.original.projectId != 0 ? row.original.taskId : null,
        resource_id: resourceId,
        submitted_dt: moment(new Date()).format("YYYY-MM-DD"),
        timesheet_dt: moment(day).format("YYYY-MM-DD"),
        other_task_item_id:
          row.original.projectId == 0 ? row.original.taskId : null,
        typ_status_id: 174,
        actual_hours: Number(parseFloat(e.target.value).toFixed(2)),
        id: null,
      });
    }
    setEnteredHoursData(hours);
    setEnableOnModify(true);
    let dt = hours.map((d) => d.entered_hours);

    if (dt.length > 0) {
      let data = document.getElementsByClassName(
        "MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium"
      );
      let shouldOpenIndexes = [];
      for (let i = 1; i < data.length; i++) {
        let angle = data[i].children[0].style.transform;
        if (data[i].children[0].style.transform == "rotate(0deg)") {
          data[i].children[0].style.transform == "rotate(-180deg)";
        }
        if (angle == "rotate(-180deg)") {
          shouldOpenIndexes.push(i);
        }
      }
      setShouldOpenIndexesArr(shouldOpenIndexes);
    }
    setEnteredHoursDataArr(dt);
  };

  const checkTypeStatusId = (row, column) => {
    let status = "";
    enteredHoursData.map((hours) => {
      let a = [hours.other_task_item_id, hours.project_task_id];
      if (row.id.includes("projectName")) {
        if (
          (hours.timesheet_dt == moment(column.id).format("YYYY-MM-DD") &&
            row.original.projectId == hours.project_id &&
            hours.entered_hours >= 0) ||
          (hours.timesheet_dt == moment(column.id).format("YYYY-MM-DD") &&
            hours.status == "holiday")
        ) {
          status =
            hours.typ_status_id == 174
              ? "enteredHours"
              : hours.typ_status_id == 173
              ? "ApprovedHours"
              : hours.typ_status_id == 172
              ? "RejectedHours"
              : hours.status == "holiday"
              ? "holidayTimesheet"
              : "";
        }
      } else if (
        hours.timesheet_dt == moment(column.id).format("YYYY-MM-DD") &&
        row.original.projectId == hours.project_id &&
        (row.original.taskId == hours.other_task_item_id ||
          row.original.taskId == hours.project_task_id) &&
        hours.entered_hours > 0
      ) {
        status =
          hours.typ_status_id == 174
            ? "enteredHours"
            : hours.typ_status_id == 173
            ? "ApprovedHours"
            : hours.typ_status_id == 172
            ? "RejectedHours"
            : "";
      } else if (
        hours.timesheet_dt == moment(column.id).format("YYYY-MM-DD") &&
        hours.status == "holiday"
      ) {
        status = "holidayTimesheet";
      }
    });
    return status;
  };

  const hoursAggregation = (row, column) => {
    let sum = 0;

    enteredHoursData.map((hours) => {
      if (
        hours.timesheet_dt == moment(column.id).format("YYYY-MM-DD") &&
        row.original.projectId == hours.project_id
      ) {
        sum += Number(hours.entered_hours);
        if (sum > 24) {
          setCnt(sum);
          const newExceedDate = moment(column.id).format("YYYY-MM-DD");
          if (!myArray.includes(newExceedDate)) {
            myArray.push(newExceedDate);
          }
        }
      }
    });
    setExceedHoursDates(myArray);
    return sum > 0 ? parseFloat(sum).toFixed(2) : "";
  };

  const totalHoursAggregation = (day) => {
    let totalHours = totalHoursCheck;
    let sum = 0;
    enteredHoursData.map((hours) => {
      if (hours.timesheet_dt == moment(day).format("YYYY-MM-DD")) {
        sum += Number(hours.entered_hours == null ? 0 : hours.entered_hours);
      }
    });
    approvedLeaves.map((leaves) => {
      if (leaves.timesheet_dt == moment(day).format("YYYY-MM-DD")) {
        sum += Number(leaves.leave_hours);
      }
    });
    totalHours.push(sum);
    setTotalHoursCheck(totalHours);
    return parseFloat(sum).toFixed(2);
  };

  const checkStatus = (taskId) => {
    let status = 0;
    timesheet.map((sheet) => {
      if (sheet.taskId == taskId) {
        status = sheet.taskStatusId;
      }
    });
    return status != 233 ? true : false;
  };

  const handleDoubleClick = (taskId, columnId) => {
    const rdate = moment(columnId, "ddd MMM DD YYYY").format("YYYY-MM-DD");
    setPopoverTaskId(taskId);
    setPopoverColumnId(rdate);
  };

  const closePopover = () => {
    setIsOpen(false);
    setIsPopoverOpen(false);
    setCnt(0);
  };
  const commentsDialog = (taskId, columnId, notes) => {
    let dialog = document.getElementById(taskId + " " + columnId);
    handleDoubleClick(taskId, columnId);
  };

  const currWeekHandler = () => {
    let weekHeaders = [];

    if (currentWeek.length > 0) {
      currentWeek.map((day) => {
        let d = moment(day).format("MM-YYYY");
        let c = moment(new Date()).format("MM-YYYY");
        let currday = moment(day).format("DD-MM-YYYY");

        let obj = {
          id: day,
          accessorKey: day,
          header: day.split(" ")[0],
          columns: [
            {
              accessorKey: day,
              header: day.split(" ")[2] + "-" + day.split(" ")[1],
              id: day,
              aggregationFn: "sum",
              AggregatedCell: ({ cell, row, column }) => (
                <div
                  className={
                    row.original.projectId != 0
                      ? Number(hoursAggregation(row, column)) != 0
                        ? checkTypeStatusId(row, column)
                        : ""
                      : ""
                  }
                >
                  {hoursAggregation(row, column)}
                </div>
              ),
              Cell: ({ cell, row, column, table }) => (
                <div>
                  <input
                    className={
                      row.original.projectId != 0
                        ? Number(searchEnteredHours(day, row, column)) != 0
                          ? checkTypeStatusId(row, column)
                          : ""
                        : "zombie"
                    }
                    type="number"
                    inputMode="numeric"
                    onDoubleClick={() =>
                      commentsDialog(row.original.taskId, column.id)
                    }
                    disabled={
                      row.original.projectName == "Others"
                        ? false
                        : checkStatus(row.original.taskId)
                        ? true
                        : !checkCurrentWeek(
                            row.original.allocatedDates,
                            row.original.taskPlannedEndDt,
                            column
                          )
                        ? true
                        : d > c
                        ? false
                        : // :
                          // (currday < moment(row.original.taskPlannedStartDt).format("DD-MM-YYYY")) ? false
                          checkTypeStatusId(row, column) == "ApprovedHours" ||
                          checkTypeStatusId(row, column) == "RejectedHours"
                    }
                    defaultValue={
                      Number(searchEnteredHours(day, row)) >= 0
                        ? parseFloat(searchEnteredHours(day, row)).toFixed(2)
                        : ""
                    }
                    dataranges="[[0, 16]]"
                    min="1"
                    max="5"
                    pattern="^[0-9]{1,2}$"
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;

                      // Allow numeric characters (0-9) and the dot (.)
                      if (
                        (charCode >= 48 && charCode <= 57) ||
                        charCode === 46
                      ) {
                        // Allow the input
                      } else {
                        // Prevent the input for other characters
                        e.preventDefault();
                      }
                    }}
                    onBlur={(e) => {
                      e.target.value
                        ? modifyEnteredHours(day, row, e, table)
                        : "";
                    }}
                  ></input>
                </div>
              ),
            },
          ],
          Footer: (day) => <p>{totalHoursAggregation(day.column.id)}</p>,
        };
        weekHeaders.push(obj);
      });
      approvedLeavesData();
      timeEntryLeaves();
      if (approvedLeaves.length == 0) {
        weekHeaders.map((week) => {
          week.columns[0]["Footer"] = <p>0.00</p>;
        });
      } else {
        weekHeaders.map((week) => {
          week.columns[0]["Footer"] = <p>0.00</p>;
        });
        weekHeaders.map((week) => {
          approvedLeaves.map((d) => {
            if (new Date(d.timesheet_dt).toDateString() == week.accessorKey) {
              week.columns[0]["Footer"] = (
                <p className={d.leave_status}>
                  {parseFloat(d.leave_hours).toFixed(2)}
                </p>
              );
            }
          });
        });
      }

      headers.splice(6, 0, ...weekHeaders);

      setTabState(false);
      setHeadings(headers);
      setEnableOnModify(false);
    }

    if (shouldOpenIndexesArr.length > 0) {
      setTimeout(() => {
        let open = document.getElementsByClassName(
          "MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium"
        );

        for (let i = 0; i < shouldOpenIndexesArr.length; i++) {}
      }, 0);
    }
  };

  useEffect(() => {
    setTabState(true);
  }, [headings]);

  useEffect(() => {
    getResourceTimesheet();
  }, [actualVal, currentDate, mday]);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const tableData = [];
  for (let i = 0; i < 1; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) {
      const currentDate = new Date(
        startOfWeek.getFullYear(),
        startOfWeek.getMonth(),
        startOfWeek.getDate() + j
      );
      const date = currentDate.getDate();
      row.push(
        <td key={j} style={{ border: "1px solid black", padding: "5px" }}>
          <div style={{ fontSize: "12px" }}>{daysOfWeek[j]}</div>
          <div style={{ fontSize: "18px" }}>{date}</div>
        </td>
      );
    }
    tableData.push(<tr key={i}>{row}</tr>);
  }

  const [columnValues, setColumnValues] = useState([0, 0, 0, 0]); // sample initial values
  const [total, setTotal] = useState(0);

  firstday.map((day) => {});

  const getCurrentWeek = (value) => {
    let today = "";
    {
      value != null ? (today = value) : (today = new Date());
    }
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    );
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      week.push(date.toDateString());
    }
    setMday(week[0]);
    setSday(week[6]);
    setCurrentWeek(week);
  };

  const monday = new Date(mday);

  monday.setDate(monday.getDate() - ((monday.getDay() + 7) % 7) + 1);
  const sunday = new Date(monday);

  sunday.setDate(sunday.getDate() + 6);
  const handleClick = (value) => {
    getCurrentWeek(value);
  };
  function handlePrevWeek() {
    let currentMondayDate = new Date(mday);
    let prevMondayDate = new Date(
      currentMondayDate.getFullYear(),
      currentMondayDate.getMonth(),
      currentMondayDate.getDate() - 7
    );
    setMday(prevMondayDate);
    getCurrentWeek(prevMondayDate);
  }

  function handleNextWeek() {
    let currentMondayDate = new Date(mday);
    let nextMondayDate = new Date(
      currentMondayDate.getFullYear(),
      currentMondayDate.getMonth(),
      currentMondayDate.getDate() + 7
    );
    setMday(nextMondayDate);
    getCurrentWeek(nextMondayDate);
  }

  const data = [
    { name: "John", age: 25 },
    { name: "Jane", age: 30 },
    { name: "Bob", age: 40 },
  ];

  const columns = [
    { title: "Name", field: "name" },
    { title: "Age", field: "age", type: "numeric" },
  ];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dashboardMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setPopoverAnchorEl(false);
  };

  const renderHelpHeader = () => {
    return <div className="pageTitle">Help</div>;
  };

  const secondHeaderGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header="Billing History"
          field="allocation_type"
          rowSpan={2}
          style={{ width: "35.5%" }}
        ></Column>
        <Column header="Past 1 Month" colSpan={2}></Column>
        <Column header="Past 1 Year" colSpan={2}></Column>
      </Row>
      <Row>
        <Column header="Hrs" field="month_hours"></Column>
        <Column header="%" field="month_per"></Column>
        <Column header="Hrs" field="year_hours"></Column>
        <Column header="%" field="year_per"></Column>
      </Row>
    </ColumnGroup>
  );

  const days = ["M", "T", "W", "Th", "F", "S", "Su"];
  const weeks = ["Wk3", "Wk4", "Wk5", "Wk6"];
  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Assignments" style={{ width: "15.5%" }}></Column>
        <Column header="Current Week" colSpan={7}></Column>
        <Column header="Next Week" colSpan={7}></Column>
        <Column header="Following Weeks" colSpan={4}></Column>
      </Row>
      <Row>
        <Column header="Project" field="Name" rowSpan={2}></Column>
        {days.map((d) => (
          <Column header={d} colSpan={1}></Column>
        ))}
        {days.map((d) => (
          <Column header={d} colSpan={1}></Column>
        ))}
        {weeks.map((w) => (
          <Column header={w} colSpan={1}></Column>
        ))}
      </Row>
      <Row>
        {allDates.map((date, index) => (
          <Column
            header={date.split(" ")[1] + "-" + date.split(" ")[0]}
            field={date.split(" ")[1] + " " + date.split(" ")[0]}
            colSpan={1}
          ></Column>
        ))}
      </Row>
    </ColumnGroup>
  );
  const summation = (date) => {
    let sum = 0;
    lastTableData.map((data) =>
      Object.entries(data).map(([d, value]) => {
        if (d == date.split(" ")[1] + " " + date.split(" ")[0]) {
          sum += parseFloat(value);
        }
      })
    );
    return sum.toFixed(2);
  };
  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          style={{ fontSize: "13px", textAlign: "left" }}
          footer={<b>Total</b>}
        ></Column>
        {allDates.map((date) => (
          <Column
            style={{ fontSize: "13px" }}
            footer={<b>{summation(date)}</b>}
          ></Column>
        ))}
      </Row>
    </ColumnGroup>
  );

  const renderlkup = (rowData) => {
    return (
      <div>
        {rowData.lkup_name == "Criticality" ? (
          ""
        ) : (
          <Tooltip title={rowData.lkup_name}>
            <CircleIcon className={rowData.lkup_name} />
          </Tooltip>
        )}
      </div>
    );
  };

  const extraHoursErrorDialog = () => {
    return alert("extra hours entered! Should not exceed 24 in a day");
  };

  const showSuccessMsg = (message) => {
    setSuccessMsg(true);
    setInfo(message.data);
    setSuccess(message.flag);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 3000);
  };

  const saveTimeSheet = () => {
    let extraHoursCheck = totalHoursCheck.some((hours) => {
      hours > 24;
    });

    if (extraHoursCheck) {
      extraHoursErrorDialog();
    }

    let projectIds = [];
    let newTimesheet = {
      ResId: +loggedUserId,
      timesheetDate: moment(new Date()).format("YYYY-MM-DD"),
      projects: [],
    };
    timesheetCopy.map((sheet) => {
      projectIds.push(sheet.projectId);
    });

    projectIds = projectIds.filter(
      (item, index) => projectIds.indexOf(item) === index
    );

    projectIds.map((projectId) =>
      newTimesheet.projects.push({ projectId: projectId, tasks: [] })
    );

    timesheetCopy.map((sheet) => {
      newTimesheet.projects.map((project) => {
        if (sheet.projectId == project.projectId) {
          project.tasks.push({
            taskId: sheet.taskId,
            TaskStatusId: sheet.taskStatusId,
            hours: [],
          });
        }
      });
    });
    enteredHoursData.map((hours) => {
      newTimesheet.projects.map((project) => {
        if (hours.project_id == project.projectId) {
          project.tasks.map((task) => {
            if (
              task.taskId == hours.project_task_id ||
              task.taskId == hours.other_task_item_id
            ) {
              task.hours.push({
                enteredHours: +parseFloat(hours.entered_hours).toFixed(2),
                date: hours.timesheet_dt,
                id: hours.id == null ? 0 : hours.id,
                typStatusId: hours.typ_status_id,
                actualHours: hours.actual_hours,
              });
            }
          });
        }
      });
    });
    abortController.current = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/dashboardsms/Dashboard/SaveTimesheet`,
      // url: `http://localhost:8090/dashboardsms/Dashboard/SaveTimesheet`,
      data: newTimesheet,
      signal: abortController.current.signal,
    }).then((res) => {
      if (res.status == 200) {
        showSuccessMsg(res.data);
        getResourceTimesheet();
        // window.location.reload()
        weekHoursData();
        setActualV(0);
      }
    });
  };

  const formatYearHours = (data) => {
    return parseFloat(data.year_hours).toFixed(2);
  };

  const formatMonthHours = (data) => {
    return parseFloat(data.month_hours).toFixed(2);
  };

  const formatYearPer = (data) => {
    if (
      data.allocation_type == "Leave" ||
      data.allocation_type == "Total Utilization"
    ) {
      return data.year_per == 0 ? "" : data.year_per;
    } else {
      return data.year_per;
    }
  };

  const formatMonthPer = (data) => {
    if (
      data.allocation_type == "Leave" ||
      data.allocation_type == "Total Utilization"
    ) {
      return data.month_per == 0 ? "" : data.month_per;
    } else if (
      data.allocation_type == "Billable" ||
      data.allocation_type == "Productive Utilization"
    ) {
      return data.month_per == null ? 0 : data.month_per;
    } else data.month_per;
  };

  useEffect(() => {
    getMenus();
  }, []);
  let textContent = "Dashboards";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Custom Dashboard"
        ),
      }));

      // Update the state with the modified menu data

      const modifiedUrlPath = "/resource/dashboard";
      getUrlPath(modifiedUrlPath);

      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };

  return (
    <div>
      {successMsg ? (
        <div className="alertsStyle">
          <div className={success ? "alert alertSuccess" : "alert alertDanger"}>
            <span className="message">
              <strong>
                {success ? (
                  <CheckIcon style={{ fontSize: "large" }}></CheckIcon>
                ) : (
                  <WarningIcon style={{ fontSize: "large" }}></WarningIcon>
                )}
              </strong>
              &nbsp;{info}
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>My Dashboard</h2>
        </div>
        <div className="childThree">
          <div className="helpBtn ">
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      {/* <div className="topRow">
        <div>
          <HomeIcon sx={{ color: grey[500], fontSize: 17 }} />
          <ArrowRightIcon sx={{ color: grey[500], fontSize: 20 }} />
          <span
            onClick={dashboardMenu}
            style={{
              verticalAlign: "text-top",
              color: "#187fde",
              cursor: "pointer",
              position: "relative",
            }}
          >
            Dashboards
          </span>
          <Menu
            className="myDashPopover"
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            style={{ left: "50px" }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: -10,
                  left: 10,
                  width: 0,
                  height: 0,
                  borderBottom: "10px solid #bab6b6",
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose} style={{ fontSize: "13px" }}>
              <Link
                to={`/resource/dashboard`}
                target="_blank"
                style={{ textDecoration: "none", color: "black" }}
              >
                {" "}
                My Dashboard{" "}
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} style={{ fontSize: "13px" }}>
              <Link
                to={`/executive/customDashboard`}
                target="_blank"
                style={{ textDecoration: "none", color: "black" }}
              >
                Custom Dashboard
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} style={{ fontSize: "13px" }}>
              <Link
                to={`/executive/utilizationDashboard`}
                target="_blank"
                style={{ textDecoration: "none", color: "black" }}
              >
                Allocation Dashboard
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} style={{ fontSize: "13px" }}>
              <Link
                to={`/executive/competencyDashboard`}
                target="_blank"
                style={{ textDecoration: "none", color: "black" }}
              >
                Competency Dashboard
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose} style={{ fontSize: "13px" }}>
              <Link
                to={`/search/savedSearches`}
                target="_blank"
                style={{ textDecoration: "none", color: "black" }}
              >
                Saved Searches
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </div> */}

      {lastTableDataDone.length > 0 &&
      timesheetDone.length > 0 &&
      issuesTableDataDone.length > 0 &&
      billingHistoryDone.length > 0 &&
      threeWeeks.length > 0 ? (
        <>
          <br></br>
          <div className="col-xs-12">
            <div className="row">
              <div className="col-2 dash-box darkHeader toHead">
                <table className="table table-bordered TimeEntry">
                  <thead>
                    <tr>
                      <th colSpan={3}>
                        <center>Time Entry</center>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {threeWeeks.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={
                              timeEntryClass(cell) != ""
                                ? timeEntryClass(cell)
                                : moment(cell) > moment(new Date())
                                ? "greyBlock"
                                : leaveDates.some(
                                    (item1) =>
                                      moment(item1.timesheet_dt).format(
                                        "DD-MMM"
                                      ) === moment(cell).format("DD-MMM")
                                  )
                                ? "ApprovedLeaves"
                                : "redBlock"
                            }
                          >
                            <span
                              onClick={() => handleClick(cell)}
                              style={{ textAlign: "center" }}
                            >
                              {moment(cell).format("DD-MMM")}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-3 ">
                <DataTable
                  value={billingHistory}
                  className="primeReactDataTable billingHistoryTable darkHeader"
                  showGridlines
                  emptyMessage={
                    <div style={{ textAlign: "center" }}>No Data Found</div>
                  }
                  headerColumnGroup={secondHeaderGroup}
                >
                  <Column
                    field="allocation_type"
                    body={(rowData) => {
                      return (
                        <div
                          className="ellipsis"
                          title={rowData["allocation_type"]}
                        >
                          <b>{rowData["allocation_type"]}</b>
                        </div>
                      );
                    }}
                  ></Column>
                  <Column field="month_hours" body={formatMonthHours}></Column>
                  <Column field="month_per" body={formatMonthPer}></Column>
                  <Column field="year_hours" body={formatYearHours}></Column>
                  <Column field="year_per" body={formatYearPer}></Column>
                </DataTable>
              </div>
              <div className="col-7">
                <DataTable
                  className="primeReactDataTable myDashboardProjTable MyDashboardDataTable darkHeader"
                  showGridlines
                  emptyMessage={
                    <div style={{ textAlign: "center" }}>No Data Found</div>
                  }
                  value={issuesTableData}
                  paginator
                  rows={3}
                  paginatorTemplate=" PrevPageLink CurrentPageReport NextPageLink  "
                  currentPageReportTemplate=" {first} to {last} of {totalRecords} "
                >
                  <Column
                    header=""
                    field="lkup_name"
                    body={renderlkup}
                    style={{ width: "33px" }}
                  ></Column>
                  <Column header="Projects" field="project_name"></Column>
                  <Column header="Type" field="type"></Column>
                  <Column header="Name" field="name"></Column>
                  <Column
                    header="Due Date"
                    field="due_date"
                    body={(rowData) => {
                      return (
                        <div>
                          {rowData["due_date"] === null
                            ? ""
                            : moment(rowData["due_date"]).format("DD-MMM-YYYY")}
                        </div>
                      );
                    }}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
          <div className="dashboardMessage note">
            <i className="pi pi-info-circle"></i>
            Note: Please make the task Status to In-progress to enter the
            efforts. By making the task status to Completed cells will be
            disabled.
          </div>
          <div className="materialReactExpandableTable myDashboardTable darkHeader">
            {tabState && (
              <MaterialReactTable
                columns={headings}
                autoResetExpanded={false}
                enableGrouping
                enableExpanding
                enableRowOrdering={false}
                getRowId={(originalRow) => originalRow.id}
                initialState={{
                  grouping: ["projectName"],
                  expanded: initialStateExpand,
                }}
                state={{ enableExpansion: enableonModify }}
                enableTopToolbar={true}
                enablePagination={false}
                enableToolbarInternalActions={false}
                enableRowVirtualization
                enableGlobalFilter={false}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enableHiding={false}
                enableColumnFilters={false}
                enableBottomToolbar={false}
                enableColumnActions={false}
                enableSorting={false}
                filterFromLeafRows
                options={{
                  paging: false,
                }}
                data={timesheet}
                muiTableContainerProps={{ sx: { width: "auto" } }}
                muiTableBodyProps={{
                  sx: {
                    "&": {
                      borderRight: "1px solid #ccc",
                      borderBottom: "1px solid #ccc",
                    },
                    "& td": {
                      borderRight: "1px solid #ccc",
                      height: "30px",
                      padding: "5px",
                    },
                  },
                }}
                muiTableFooterProps={{
                  sx: {
                    "&": {
                      borderRight: "1px solid #ccc",
                      borderBottom: "1px solid #ccc",
                    },
                    "& td": {
                      borderRight: "1px solid #ccc",
                      height: "30px",
                      padding: "5px",
                    },
                  },
                }}
                muiTableHeadProps={{
                  sx: {
                    "& th": {
                      borderTop: "1px solid #ccc",
                      borderRight: "1px solid #ccc",
                      padding: "0 5px",
                    },
                  },
                }}
                renderTopToolbarCustomActions={() => (
                  <div className="attendanceTopSection">
                    <div></div>
                    <div>
                      <p>
                        <span>{moment(monday).format("DD-MMM-YYYY")}</span>{" "}
                        <span>to</span>
                        <span>{moment(sunday).format("DD-MMM-YYYY")}</span>
                      </p>
                    </div>
                    <div>
                      <DatePicker
                        className="datepicker"
                        placeholderText="Select Date"
                        onChange={(date) => handleClick(date)}
                        popperClassName="datepickerPopper"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        yearDropdownItemNumber={5}
                        scrollableYearDropdown
                        yearDropdownInScrollMode
                        maxDate={currentDate}
                        minDate={new Date(currentDate.getFullYear() - 5, 0, 1)}
                      />
                      <span onClick={() => handlePrevWeek()}>
                        <ArrowLeftIcon className="arrow" />
                      </span>
                      <span onClick={() => handleNextWeek()}>
                        <ArrowRightIcon className="arrow" />
                      </span>
                    </div>
                  </div>
                )}
              />
            )}
          </div>
          <div className="mydashboardTableBottom">
            <div></div>
            <div className="tableBtns">
              <button
                onClick={
                  cnt === 0
                    ? () => saveTimeSheet()
                    : () => {
                        setIsPopoverOpen(true);
                        setIsOpen(true);
                      }
                }
                className="btn btn-primary"
              >
                <i className="pi pi-save"></i>
                Save
              </button>

              <button onClick={() => window.location.reload()}>
                <i className="pi pi-times"></i>
                Cancel
              </button>
            </div>
            <div className="tablePalette">
              {paletteHeadings.map((colorGuide) => {
                return (
                  <div>
                    <i
                      className="pi pi-circle-fill"
                      style={{
                        color: colorGuide.color,
                      }}
                    ></i>
                    <span>{colorGuide.heading}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ margin: "0", transition: "all 0.5s ease-in-out" }}>
            <div>
              <DataTable
                className="primeReactDataTable myDashboardAssingTable darkHeader"
                showGridlines
                emptyMessage={
                  <div style={{ textAlign: "center" }}>No Data Found</div>
                }
                value={lastTableData}
                headerColumnGroup={headerGroup}
                footerColumnGroup={footerGroup}
              >
                <Column field="Name"></Column>
                {allDates.map((date) => (
                  <Column
                    field={date.split(" ")[1] + " " + date.split(" ")[0]}
                    body={(rowData) => {
                      return (
                        <span style={{ float: "right" }}>
                          {
                            rowData[
                              date.split(" ")[1] + " " + date.split(" ")[0]
                            ]
                          }
                        </span>
                      );
                    }}
                  ></Column>
                ))}
              </DataTable>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <Dialog
        header={renderHelpHeader}
        visible={helpDialogVisible}
        style={{ width: "50vw" }}
        onHide={() => setHelpDialogVisible(false)}
      >
        <p className="m-0">TBD //TBD</p>
      </Dialog>
      {isPopoverOpen && (
        <PopoverDialog
          onClose={closePopover}
          isOpen={isOpen}
          exceedHoursDates={exceedHoursDates}
        />
      )}
      {isPopOpen && (
        <MyDashboardInfoPopOver
          projectData={infoPop}
          anchorEl={popoverAnchorEl}
          isOpenInfo={isOpenInfo}
          handleClose={handleClose}
        />
      )}
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}
export default MyDashboard;
