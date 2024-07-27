import React, { useEffect, useState, useRef } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaChevronCircleRight,
  FaChevronCircleLeft,
  FaSave,
  FaCaretDown,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import MaterialReactTable from "material-react-table";
import { Box, IconButton } from "@mui/material";

import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { Popover, Button, Select, MenuItem } from "@mui/material";
import { ImCross } from "react-icons/im";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import Loader from "../Loader/Loader";
import ExcelJS from "exceljs";
import { BiCheck, BiErrorCircle } from "react-icons/bi";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import "./T&MOpen.scss";

function TMOpen() {
  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [cancelClicked, setCancelClicked] = useState(false);
  const [message, setMessage] = useState();
  const abortControllerRef = useRef(new AbortController());
  const [loader, setLoader] = useState(false);
  const [tableDetails, setTableDetails] = useState(null); //response is an object with tsDates, tsDtls,tsInfo properties
  const [startDate, setStartDate] = useState(startOfMonth);
  const [endDate, setEndDate] = useState(null);
  const [globalReportRunId, setGlobalReportRunId] = useState();
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [projectData, setProjectData] = useState([]);
  const [projectIds, setProjectIds] = useState([]);

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [firstSelProject, setFirstSelProject] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [columnData, setColumnData] = useState([]);
  const [isFM, setIsFM] = useState(null);
  const [approvalStates, setApprovalStates] = useState([]);
  const [initialHiddenColumns, setInitialHiddenColumns] = useState({});
  const [projectWiseRows, setProjectWiseRows] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [clickedCellIds, setClickedCellIds] = useState([]);
  const [clickedCellStates, setClickedCellStates] = useState([]);
  const [clickedRow, setClickedRow] = useState(null);
  const [isPMPrjIds, setIsPMPrjIds] = useState([]);
  const [cheveronIconHeader, setChevronIconHeader] =
    useState(FaChevronCircleRight);
  const [hiddenColumns, setHiddenColumns] = useState(initialHiddenColumns);
  const [approvalIDs, setApprovalIDs] = useState([]);
  const [rejectedIDs, setRejectedIDs] = useState([]);
  const [weekBasedColExpFlags, setWeekBasedColExpFlags] = useState([]);
  const [updatedWeekBasedCols, setUpdatedWeekBasedCols] = useState();
  const [initialProjectSelectChange, setInitialProjectSelectChange] =
    useState(true);
  const [appStatusOptions, setAppStatusOptions] = useState([
    //Values ate dynamic, fetch from tsStates of table data
    { label: "FM approved", value: "756" },
    { label: "FM rejected", value: "757" },
    { label: "Invoiced", value: "759", disabled: false },
    {
      label: "Ready for finance review",
      value: "755",
      disabled: false,
    },
    {
      label: "Ready for Invoice",
      value: "758",
      disabled: false,
    },
  ]);

  const selectBoxStyle = {
    width: "200px", // Adjust the width as needed
  };
  const [selectedAppStats, setSelectedAppStats] = useState([]);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Time & Expenses";
  let currentScreenName = ["T&M - Open"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const [prjStates, setPrjStates] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    prjSource: "PPM",
    prjStatus: "1",
    appStatus: [],
    period: "",
  });
  const [dataAccess, setDataAccess] = useState([]);

  // ====================================useEffect start===============================

  useEffect(() => {}, [cancelClicked]);
  useEffect(() => {
    getProjectByStatus();
  }, [searchFilters, selectedAppStats, startDate, dataAccess]);

  useEffect(() => {
    if (!initialProjectSelectChange) {
      getInvoicePeriod();
    }
  }, [firstSelProject, initialProjectSelectChange]);

  useEffect(() => {
    defineColumns();
  }, [weekBasedColExpFlags]);

  useEffect(() => {
    setHiddenColumns(initialHiddenColumns);
  }, [initialHiddenColumns]);

  useEffect(() => {
    defineTableData(); //Whenever the table details are changed, all my data pertaining to the new table should be refreshed
    defWkBasedFlagsForExpCol(); //To track week expand button state
    defineColumns();
    setApprovalIDs([]); //Refresh approvalIds
    setRejectedIDs([]); //Refresh rejectedIds
    isPMThenPrjIds(); //If user is PM, then fetch the project ids he can approve
    isUserFM(); //Check if user is FM
  }, [tableDetails]);

  //Refresh prjStates based on projectWiseRows
  useEffect(() => {
    const updatedPrjStates = {};
    projectWiseRows?.forEach((projectRow) => {
      let newObj = {};
      newObj["id"] = projectRow["project_id"];
      newObj["state"] = projectRow["billing_status_id"];
      newObj["invOldAmt"] = 0;
      updatedPrjStates[projectRow["project_id"]] = newObj;
    });
    setPrjStates(updatedPrjStates);
  }, [projectWiseRows]);

  useEffect(() => {
    getMenus();
  }, []);

  // ====================================useEffect end===============================

  // ====================================Function calls Start===============================

  //For enabling/disabling approvals dropdown in TMOpen table
  const getIsContractTermsType = (projectId) => {
    axios({
      method: "GET",
      url: `${baseUrl}/timeandexpensesms/tmOpen/contractTermsType?id=${projectId}`,
    })
      .then((resp) => {
        return resp?.data;
      })
      .catch((error) => {
        console.log("error:", error);
      });
  };

  const getProjectByStatus = () => {
    const requestBody = {
      userId: loggedUserId,
      prjSource: searchFilters.prjSource,
      prjStatus: searchFilters.prjStatus,
      appStatus: searchFilters.appStatus,
      stDate: moment(startDate).format("YYYY-MM-DD"),
    };
    if (dataAccess === 500) {
      axios
        .get(baseUrl + `/timeandexpensesms/getProjectsForAdmin`)
        .then((Response) => {
          let data = Response.data;
          const updatedData = data.map((obj) => {
            const { id, projectName, ...rest } = obj;
            return { label: projectName, value: id, ...rest };
          });
          // console.log(updatedData)
          const projectValues = updatedData.map((obj) => obj.value);

          setProjectIds(projectValues);
          setProjectData(updatedData);
        });
    } else {
      axios
        .post(
          // (dataAccess === 250) ?
          //   baseUrl + `/dashboardsms/allocationDashboard/getProjects?userId=${loggedUserId}`
          //   :
          baseUrl + `/timeandexpensesms/tmOpen/getProjectsByStatus`,
          requestBody
        )
        .then(function (res) {
          const data = res.data;
          //changing the object property from 'text'->'label'
          const updatedData = data.map((obj) => {
            const { text, ...rest } = obj;
            return { label: text, ...rest };
          });

          const projectValues = updatedData.map((obj) => obj.value);

          setProjectIds(projectValues);
          setProjectData(updatedData);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleAbort = () => {
    abortControllerRef.current.abort();
    setLoader(false);
  };

  const defWkBasedFlagsForExpCol = () => {
    const updatedWkBasedFlagsForExpCols = [];
    tableDetails?.tsDtls.tsInfo.forEach((columnObj) => {
      let obj = {};
      columnObj.week_no ? (obj[columnObj.week_no] = false) : "";
      columnObj.week_no ? updatedWkBasedFlagsForExpCols.push(obj) : "";
    });
    // Convert the array to a set to remove duplicates
    const uniqueSet = new Set(
      updatedWkBasedFlagsForExpCols.map(JSON.stringify)
    );
    //Set(5) {'{"18":false}', '{"19":false}', '{"20":false}', '{"21":false}', '{"22":false}'}

    // Convert the set back to an array of objects
    const newUpdatedWkBasedFlagsForExpCols = Array.from(uniqueSet).map(
      JSON.parse
    );
    setWeekBasedColExpFlags(newUpdatedWkBasedFlagsForExpCols);
  };

  const handlePopOver = (clickedRow, wkNoOrColDteVal, isWkNoOrColDte) => {
    // Filtering the mainRow for project based on project id and fetching billing_status_id
    const projectMainRow = tableDetails.tsDates.find(
      (obj) =>
        obj["level"] === 0 && obj["project_id"] === clickedRow["project_id"]
    );

    const billingStatus = projectMainRow["billing_status_id"];

    const foundId = isPMPrjIds?.find(
      (obj) => obj.id === clickedRow["project_id"]
    );

    const isContractTermType = getIsContractTermsType(clickedRow.project_id);
    if (
      (foundId &&
        (billingStatus === null || billingStatus === "757") &&
        !isContractTermType) ||
      (isFM && billingStatus === "755" && !isContractTermType)
    ) {
      if (isWkNoOrColDte === "week" || isWkNoOrColDte === "logged_hours") {
        clickedRow["Wk_" + wkNoOrColDteVal + "_state"] === null
          ? setPopoverOpen(false)
          : setPopoverOpen(true);
      } else {
        clickedRow["ts_state_" + wkNoOrColDteVal] === null
          ? setPopoverOpen(false)
          : setPopoverOpen(true);
      }
    }
  };

  const defineColumns = () => {
    const getClickedCellWkDetails = (weekNum, rowData) => {
      /**
       * 
          Level Info
          0 : Project
          1 : Resource
          2 : Billable Category
          3 : Billable Tasks
          4 : Non Billable Category					
          5 : Non Billable Tasks
        */
      setClickedRow(rowData);
      const updatedApprIds = [];
      if (rowData.level === 0) {
        rowData.subRows?.forEach((resourceRow) => {
          resourceRow.subRows?.forEach((billOrNonBillTasks) => {
            if (billOrNonBillTasks.subRows.length > 1) {
              billOrNonBillTasks.subRows.forEach((task) => {
                const billOrNonBillRow = task;
                //Fetching the cell ids for approve/reject- WeekBased
                updatedWeekBasedCols[weekNum].forEach((id) => {
                  billOrNonBillRow[id] !== null
                    ? updatedApprIds.push(billOrNonBillRow[id])
                    : "";
                });
              });
            } else {
              const billOrNonBillRow = billOrNonBillTasks.subRows[0];
              //Fetching the cell ids for approve/reject- WeekBased
              updatedWeekBasedCols[weekNum].forEach((id) => {
                billOrNonBillRow[id] !== null
                  ? updatedApprIds.push(billOrNonBillRow[id])
                  : "";
              });
            }
            const billOrNonBillRow = billOrNonBillTasks.subRows[0];
            //Fetching the cell ids for approve/reject- WeekBased
            updatedWeekBasedCols[weekNum].forEach((id) => {
              billOrNonBillRow[id] !== null
                ? updatedApprIds.push(billOrNonBillRow[id])
                : "";
            });
          });
        });
      } else if (rowData.level === 1) {
        rowData.subRows?.forEach((billOrNonBillTasks) => {
          const billOrNonBillRow = billOrNonBillTasks.subRows[0];
          //Fetching the cell ids for approve/reject- WeekBased
          updatedWeekBasedCols[weekNum].forEach((id) => {
            billOrNonBillRow[id] !== null
              ? updatedApprIds.push(billOrNonBillRow[id])
              : "";
          });
        });
      } else if (rowData.level === 2) {
        const billOrNonBillRow = rowData.subRows[0];
        //Fetching the cell ids for approve/reject- WeekBased
        updatedWeekBasedCols[weekNum].forEach((id) => {
          billOrNonBillRow[id] !== null
            ? updatedApprIds.push(billOrNonBillRow[id])
            : "";
        });
      } else {
        updatedWeekBasedCols[weekNum].forEach((id) => {
          rowData[id] !== null ? updatedApprIds.push(rowData[id]) : "";
        });
      }

      //Changing the ts_id--->ts_state for state update on approve/reject
      const updatedWeekBasedColStates = updatedWeekBasedCols[weekNum].map(
        (element) => {
          return element.replace("ts_id", "ts_state");
        }
      );

      setClickedCellIds(updatedApprIds);
      setClickedCellStates(updatedWeekBasedColStates);
    };

    const getClickedCellDetails = (colID, rowData) => {
      /**
          Level Info
          0 : Project
          1 : Resource
          2 : Billable Category
          3 : Billable Tasks
          4 : Non Billable Category					
          5 : Non Billable Tasks
        */
      setClickedRow(rowData);
      const updatedApprIds = [];
      const updatedCellStates = []; //To change color on approve/reject
      //If the rowData is project level, we need to send all the ids of its child row
      if (rowData["level"] === 0) {
        rowData.subRows?.forEach((resourceRow) => {
          resourceRow.subRows?.forEach((billOrNonBillTasks) => {
            const billOrNonBillRow = billOrNonBillTasks.subRows[0];
            //Fetching the cell ids for approve/reject- WeekBased
            billOrNonBillRow["ts_id_" + colID] !== null
              ? updatedApprIds.push(billOrNonBillRow["ts_id_" + colID])
              : "";

            //Fetching the cell states
            updatedCellStates.push("ts_state_" + colID);
          });
        });
      } //If the level is of Resource, we need to send the ids of billable and non billable tasks
      else if (rowData["level"] === 1) {
        rowData.subRows?.forEach((billOrNonBillTasks) => {
          const billOrNonBillRow = billOrNonBillTasks.subRows[0];
          //Fetching the cell ids for approve/reject- WeekBased
          billOrNonBillRow["ts_id_" + colID] !== null
            ? updatedApprIds.push(billOrNonBillRow["ts_id_" + colID])
            : "";

          //Fetching the cell states
          updatedCellStates.push("ts_state_" + colID);
        });
      } else if (rowData["level"] === 2 || rowData["level"] === 4) {
        //If the level is of billable/non billable tasks we need to send only the id of its child row
        const billOrNonBillRow = rowData.subRows[0];
        //Fetching the cell ids for approve/reject- WeekBased
        billOrNonBillRow["ts_id_" + colID] !== null
          ? updatedApprIds.push(billOrNonBillRow["ts_id_" + colID])
          : "";

        //Fetching the cell states
        updatedCellStates.push("ts_state_" + colID);
      } else {
        //else send the id of the rowData itself
        updatedApprIds.push(rowData["ts_id_" + colID]);
        //Fetching the cell states
        updatedCellStates.push("ts_state_" + colID);
      }

      setClickedCellIds(updatedApprIds);
      setClickedCellStates(updatedCellStates);
    };
    const getClickedCellloggedhrsDetails = (rowData) => {
      const wkColumnNames = Object.keys(rowData).filter((key) =>
        key.toLowerCase().includes("wk")
      );
      const extractedWkNumbers = wkColumnNames
        .map((element) => {
          const match = element.match(/^Wk_(\d+)$/);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((number) => number !== null);

      const sortedWKArray = extractedWkNumbers.sort((a, b) => a - b);

      /**
          Level Info
          0 : Project
          1 : Resource
          2 : Billable Category
          3 : Billable Tasks
          4 : Non Billable Category					
          5 : Non Billable Tasks
        */
      setClickedRow(rowData);
      const updatedApprIds = [];

      sortedWKArray.forEach((weekNum) => {
        if (rowData.level === 0) {
          rowData.subRows?.forEach((resourceRow) => {
            resourceRow.subRows?.forEach((billOrNonBillTasks) => {
              if (billOrNonBillTasks.subRows.length > 1) {
                billOrNonBillTasks.subRows.forEach((task) => {
                  const billOrNonBillRow = task;
                  //Fetching the cell ids for approve/reject- WeekBased
                  updatedWeekBasedCols[weekNum].forEach((id) => {
                    billOrNonBillRow[id] !== null
                      ? updatedApprIds.push(billOrNonBillRow[id])
                      : "";
                  });
                });
              } else {
                const billOrNonBillRow = billOrNonBillTasks.subRows[0];
                //Fetching the cell ids for approve/reject- WeekBased
                updatedWeekBasedCols[weekNum].forEach((id) => {
                  billOrNonBillRow[id] !== null
                    ? updatedApprIds.push(billOrNonBillRow[id])
                    : "";
                });
              }
              const billOrNonBillRow = billOrNonBillTasks.subRows[0];
              //Fetching the cell ids for approve/reject- WeekBased
              updatedWeekBasedCols[weekNum].forEach((id) => {
                billOrNonBillRow[id] !== null
                  ? updatedApprIds.push(billOrNonBillRow[id])
                  : "";
              });
            });
          });
        } else if (rowData.level === 1) {
          rowData.subRows?.forEach((billOrNonBillTasks) => {
            const billOrNonBillRow = billOrNonBillTasks.subRows[0];
            //Fetching the cell ids for approve/reject- WeekBased
            updatedWeekBasedCols[weekNum].forEach((id) => {
              billOrNonBillRow[id] !== null
                ? updatedApprIds.push(billOrNonBillRow[id])
                : "";
            });
          });
        } else if (rowData.level === 2) {
          const billOrNonBillRow = rowData.subRows[0];
          //Fetching the cell ids for approve/reject- WeekBased
          updatedWeekBasedCols[weekNum].forEach((id) => {
            billOrNonBillRow[id] !== null
              ? updatedApprIds.push(billOrNonBillRow[id])
              : "";
          });
        } else {
          updatedWeekBasedCols[weekNum].forEach((id) => {
            rowData[id] !== null ? updatedApprIds.push(rowData[id]) : "";
          });
        }
      });

      // Changing the ts_id--->ts_state for state update on approve/reject
      const updatedWeekBasedColStates = sortedWKArray.map((weekNum) =>
        updatedWeekBasedCols[weekNum].map((element) =>
          element.replace("ts_id", "ts_state")
        )
      );

      const flattenedArray = [].concat(...updatedWeekBasedColStates);

      setClickedCellIds(updatedApprIds);
      setClickedCellStates(flattenedArray);
    };
    //Defining columns for material react table
    let columns = [];

    tableDetails?.tsDtls.tsInfo.forEach((columnObj, index) => {
      let newColumnObject = null;
      if (
        (columnObj.week_day === "" || columnObj.week_day === null) &&
        columnObj.week_no !== null
      ) {
        const splitHeaderArray = columnObj.display_date.split("<br/>");

        const foundWeekObject = weekBasedColExpFlags.find((weekObj) =>
          weekObj.hasOwnProperty(columnObj.week_no)
        );

        newColumnObject = {
          id: index + "_" + columnObj.week_no,
          Header: ({ column }) => (
            <div>
              <span
                className={index + "_" + columnObj.week_no}
                onClick={() => {
                  updateHiddenColumns(columnObj.week_no);
                }}
              >
                {foundWeekObject && foundWeekObject[columnObj.week_no] ? (
                  <FaChevronCircleLeft />
                ) : (
                  <FaChevronCircleRight />
                )}
              </span>
            </div>
          ),
          enableColumnActions: false,
          enableHiding: true,
          columns: [
            {
              id: index + "_WK_" + columnObj.week_no,
              accessorKey: "Wk_" + columnObj.week_no,
              Header: ({ column }) => (
                <div>
                  <span title={"Wk_" + columnObj.week_no}>
                    {splitHeaderArray[0]} <br />
                    to
                    <br />
                    {splitHeaderArray[2]}
                  </span>
                </div>
              ),
              enableColumnActions: false,
              enableHiding: true,
              minSize: 10,
              maxSize: 10,
              size: 10,
              // "rgba(52, 210, 235, 0.1)"- light blue color
              muiTableBodyCellProps: ({ row }) => ({
                sx: {
                  backgroundColor:
                    row.original["Wk_" + columnObj.week_no + "_state"] === 2
                      ? "rgba(255, 0, 0, 0.5)"
                      : row.original["Wk_" + columnObj.week_no + "_state"] === 4
                      ? "rgba(22, 184, 44, 0.5)"
                      : row.original.row_type === "Billable Tasks" ||
                        row.original.row_type === "Non Billable Tasks"
                      ? "rgba(52, 210, 235, 0.1)"
                      : "white",
                  borderRight: "2px solid #e0e0e0",
                  fontSize: "13px",
                  borderTop: "1px solid #ccc",
                  padding: "2px 8px",
                  verticalAlign: "middle",
                  textAlign: "right",
                  fontWeight: 550,
                },
              }),
              Cell: ({ cell }) => (
                <div
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                    handlePopOver(cell.row.original, columnObj.week_no, "week");
                    getClickedCellWkDetails(
                      columnObj.week_no,
                      cell.row.original
                    );
                  }}
                >
                  <span title={cell.getValue().toFixed(1)}>
                    {cell.getValue().toFixed(1)}
                  </span>
                </div>
              ),
            },
          ],
        };
        columns.push(newColumnObject);
      } else if (columnObj.week_day !== null && columnObj.week_no !== null) {
        newColumnObject = {
          id: index + "_" + columnObj.format_date,
          header: columnObj.week_day,
          muiTableHeadCellProps: {
            sx: {
              textAlign: "center",
            },
          },
          columns: [
            {
              accessorKey: "ts_" + columnObj.format_date,
              header: columnObj.display_date,
              enableColumnActions: false,
              enableHiding: true,
              minSize: 10,
              maxSize: 10,
              size: 10,
              muiTableBodyCellProps: ({ row }) => ({
                sx: {
                  backgroundColor:
                    row.original["ts_state_" + columnObj.format_date] === 2
                      ? "rgba(255, 0, 0, 0.5)"
                      : row.original["ts_state_" + columnObj.format_date] === 4
                      ? "rgba(22, 184, 44, 0.5)"
                      : row.original.row_type === "Billable Tasks" ||
                        row.original.row_type === "Non Billable Tasks"
                      ? "rgba(52, 210, 235, 0.1)"
                      : "white",
                  borderRight: "2px solid #e0e0e0",
                  fontSize: "13px",
                  borderTop: "1px solid #ccc",
                  padding: "2px 8px",
                  verticalAlign: "middle",
                  textAlign: "right",
                  fontWeight: 550,
                },
              }),
              muiTableHeadCellProps: {
                sx: {
                  textAlign: "center",
                },
              },
              Cell: ({ cell }) => (
                <div
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                    handlePopOver(
                      cell.row.original,
                      columnObj.format_date,
                      "col"
                    );
                    getClickedCellDetails(
                      columnObj.format_date,
                      cell.row.original
                    );
                  }}
                >
                  <span title={cell.getValue().toFixed(1)}>
                    {cell.getValue().toFixed(1)}
                  </span>
                </div>
              ),
            },
          ],
        };
        columns.push(newColumnObject);
      } else {
        const columnKey = getAccessorKey(columnObj.display_date);
        newColumnObject = {
          id: index + "_" + columnKey,
          accessorKey: columnKey,
          header: columnObj.display_date,
          enableColumnActions: false,
          enableHiding: true,
          minSize: 10,
          maxSize: 200,
          size:
            columnKey === "approvals"
              ? 200
              : columnKey === "total_amount"
              ? 120
              : 10,
          muiTableHeadCellProps: {
            sx: {
              textAlign: "center",
            },
          },
          Cell: ({ cell }) =>
            columnKey.includes("hours") ||
            columnKey.includes("hrs") ||
            columnKey === "invoiced" ||
            columnKey === "to_invoice" ? (
              <div>
                <span
                  onClick={(event) => {
                    if (columnKey.includes("logged_hours")) {
                      setAnchorEl(event.currentTarget);
                      handlePopOver(
                        cell.row.original,
                        columnObj.week_no,
                        "logged_hours"
                      );
                      getClickedCellloggedhrsDetails(cell.row.original);
                    }
                  }}
                  title={
                    cell.getValue()
                      ? cell.getValue()?.toFixed(1)
                      : (0.0).toFixed(1)
                  }
                >
                  {cell.getValue()
                    ? cell.getValue()?.toFixed(1)
                    : (0.0).toFixed(1)}
                </span>
              </div>
            ) : columnKey.includes("amount") || columnKey.includes("rate") ? (
              <div>
                <span
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ textAlign: "left" }}>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: cell.row.original["currency"],
                      }}
                    />
                  </span>
                  <span style={{ textAlign: "right" }}>
                    {cell.getValue()
                      ? cell.getValue()?.toLocaleString("en-IN", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })
                      : (0.0).toFixed(1)}
                  </span>
                </span>
              </div>
            ) : (
              <div>
                <span title={cell.getValue()}>{cell.getValue()}</span>
              </div>
            ),
          muiTableBodyCellProps: ({ row }) => ({
            sx: {
              backgroundColor:
                columnKey === "rejected_hours"
                  ? "#faf0f0"
                  : columnKey === "pending_hours"
                  ? "#f7f1ea"
                  : columnKey === "to_invoice"
                  ? "#eff8eb"
                  : row.original.row_type === "Billable Tasks" ||
                    row.original.row_type === "Non Billable Tasks"
                  ? "rgba(52, 210, 235, 0.1)"
                  : "white",
              borderRight: "2px solid #e0e0e0",
              fontSize: "13px",
              borderTop: "1px solid #ccc",
              borderRight: "2px solid #e0e0e0",
              padding: "2px 8px",
              verticalAlign: "middle",
              textAlign: columnKey === "name" ? "left" : "right",
              fontWeight: 550,
            },
          }),
        };
        columns.push(newColumnObject);
      }
    });
    setColumnData(columns);
  };

  const defineTableData = () => {
    //creating this for approval/rejection of time sheets
    //25:[ts_id_01_Feb_2023,ts_id_02_Feb_2023]
    const updatedWeekBasedColumns = tableDetails?.tsDtls.tsInfo.reduce(
      (result, item) => {
        // Ignore items where week_day and week_no are null
        if (
          item.week_day !== null &&
          item.week_no !== null &&
          item.format_date !== null
        ) {
          // Check if week_no exists in result object
          if (!result[item.week_no]) {
            // Initialize an empty array for the week_no if it doesn't exist
            result[item.week_no] = [];
          }

          // Push the format_date value to the week_no array
          result[item.week_no].push("ts_id_" + item.format_date);
        }

        return result;
      },
      {}
    );
    setUpdatedWeekBasedCols(updatedWeekBasedColumns);

    //Setting initial hidden colums
    const updatedInitialHiddenCols = {};

    tableDetails?.tsDtls.tsInfo.forEach((obj) => {
      if (obj.week_no && obj.week_day) {
        updatedInitialHiddenCols["ts_" + obj.format_date] = false;
      }
    });

    setInitialHiddenColumns(updatedInitialHiddenCols);
    //New row data with subRows mapping
    let rowObjectsArray = tableDetails?.tsDates;
    const groupedRowObjects = rowObjectsArray?.reduce(
      (acc, obj) => {
        const projectId = obj.project_id;
        if (!acc.projectIds.includes(projectId)) {
          acc.projectIds.push(projectId);
          acc.groupedRowsByProject[projectId] = [];
        }
        acc.groupedRowsByProject[projectId].push(obj);
        return acc;
      },
      { projectIds: [], groupedRowsByProject: {} }
    );
    //Fetching states from tableData and customizing for MultiSelect tag
    const updatedApprovalStates = [];
    tableDetails?.tsStates.forEach((e) => {
      let approvalObj = {
        label: e.name,
        value: e.id,
      };
      updatedApprovalStates.push(approvalObj);
    });

    setApprovalStates(updatedApprovalStates);

    const updatedProjectWiseRows = [];

    const handleInvoiceSelect = (event, row) => {
      const isChecked = event.target.checked;

      setPrjStates((prevPrjStates) => ({
        ...prevPrjStates,
        [row["project_id"]]: {
          ...prevPrjStates[row["project_id"]],
          invOldAmt: isChecked ? 1 : 0,
        },
      }));
    };

    groupedRowObjects?.projectIds.forEach((id) => {
      //For each project- fetching all child rows
      let arrayOfRowObjects = groupedRowObjects?.groupedRowsByProject[id];
      let mainRow = arrayOfRowObjects[0]; //Fetching main row(project parent row)
      mainRow.subRows = []; //adding subRows property for mterial react table
      let billingStatus = mainRow["billing_status_id"];
      const foundId = isPMPrjIds?.find(
        (obj) => obj.id === mainRow["project_id"]
      );
      const isStateEnable = () => {
        if (
          (foundId &&
            (billingStatus === null || billingStatus === "757") &&
            !getIsContractTermsType(mainRow.project_id)) ||
          (isFM &&
            billingStatus !== null &&
            !getIsContractTermsType(mainRow.project_id))
        ) {
          return true;
        } else return false;
      };
      // adding the checkbox for invoicing functionality
      mainRow.prjInvoiceAmount = (
        <input
          type="checkbox"
          className="prjInvoiceAmount"
          // disabled={!isStateEnable()} //disable if the user is not FM
          disabled={
            dataAccess === 100 || dataAccess === 500 ? false : !isStateEnable()
          }
          onChange={(event) => {
            handleInvoiceSelect(event, mainRow);
          }}
        />
      );
      //Approval dropdown
      const approvals = tableDetails?.tsStates.map((obj) => {
        if (obj.id === 758)
          return {
            ...obj,
            name: "Ready for Invoice",
          };
        else return obj;
      });
      const handleOnChangeForSelect = (event) => {
        const selectedOption = event.target.value;
        setPrjStates((prevPrjStates) => ({
          ...prevPrjStates,
          [mainRow["project_id"]]: {
            ...prevPrjStates[mainRow["project_id"]],
            state: selectedOption,
          },
        }));
      };

      if (foundId) {
        if (billingStatus === null) {
          const option = approvals.find((obj) => obj.id === 755);
          mainRow.approvals = (
            <div>
              <select
                defaultValue={billingStatus}
                className="approvals"
                id="approvals"
                // disabled={!isStateEnable()}
                disabled={
                  dataAccess === 100 || dataAccess === 500
                    ? false
                    : !isStateEnable()
                }
                onChange={handleOnChangeForSelect}
                style={selectBoxStyle}
              >
                <option key="0" value="0" selected>
                  &lt;&lt;Please Select&gt;&gt;
                </option>
                {
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                }
              </select>
            </div>
          );
        } else if (billingStatus === "757") {
          mainRow.approvals = (
            <div>
              <select
                defaultValue={billingStatus}
                className="approvals"
                id="approvals"
                // disabled={!isStateEnable()}
                disabled={
                  dataAccess === 100 || dataAccess === 500
                    ? false
                    : !isStateEnable()
                }
                onChange={handleOnChangeForSelect}
                style={selectBoxStyle}
              >
                {approvals.map((option) => (
                  <option
                    key={option.id}
                    value={option.id}
                    disabled={option.id !== 755}
                    hidden={
                      option.id == 756 || option.id == 758 || option.id == 759
                    }
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          );
        } else {
          mainRow.approvals = (
            <div>
              <select
                defaultValue={billingStatus}
                className="approvals"
                id="approvals"
                // disabled={!isStateEnable()}
                disabled={
                  dataAccess === 100 || dataAccess === 500
                    ? false
                    : !isStateEnable()
                }
                onChange={handleOnChangeForSelect}
                style={selectBoxStyle}
              >
                {approvals.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          );
        }
      } else if (isFM) {
        if (isStateEnable()) {
          mainRow.approvals = (
            <div>
              <select
                defaultValue={billingStatus}
                className="approvals"
                id="approvals"
                disabled={
                  dataAccess === 100 || dataAccess === 500
                    ? false
                    : !isStateEnable()
                }
                onChange={handleOnChangeForSelect}
                style={selectBoxStyle}
              >
                {approvals.map((option) => (
                  <option
                    key={option.id}
                    value={option.id}
                    disabled={option.id === 755}
                    hidden={option.id === 759}
                  >
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          );
        } else {
          mainRow.approvals = (
            <div>
              <select
                defaultValue={billingStatus}
                className="approvals"
                id="approvals"
                disabled={
                  dataAccess === 100 || dataAccess === 500
                    ? false
                    : !isStateEnable()
                }
                onChange={handleOnChangeForSelect}
                style={selectBoxStyle}
              >
                <option key="0" value="0">
                  &lt;&lt;Please Select&gt;&gt;
                </option>
              </select>
            </div>
          );
        }
      } else {
        mainRow.approvals = (
          <div>
            <select
              defaultValue={billingStatus}
              className="approvals"
              id="approvals"
              disabled={!isStateEnable()}
              onChange={handleOnChangeForSelect}
              style={selectBoxStyle}
            >
              <option key="0" value="0">
                &lt;&lt;Please Select&gt;&gt;
              </option>
            </select>
          </div>
        );
      }
      //Building subRows for material react table
      const resourceRows = arrayOfRowObjects.filter(
        (row) => row.row_type == "Resource"
      );

      const billableTasks = arrayOfRowObjects.filter(
        (row) => row.row_type == "Billable Tasks"
      );

      const nonBillableTasks = arrayOfRowObjects.filter(
        (row) => row.row_type == "Non Billable Tasks"
      );

      const billableRows = arrayOfRowObjects.filter(
        (row) => row.row_type == "Billable"
      );

      const nonBillableRows = arrayOfRowObjects.filter((row) =>
        row.type?.includes("Non Billable")
      );

      resourceRows?.forEach((resourceRow) => {
        //Billable or Non billable task row for resource will always be ONE.
        const resourceBillableTasks = billableTasks.filter(
          (task) =>
            task.resource_id == resourceRow.resource_id &&
            task.project_role_id == resourceRow.project_role_id
        );
        const resourceNonBillableTasks = nonBillableTasks
          .filter((task) => task.resource_id == resourceRow.resource_id)
          ?.slice(0, 1);

        //Under billable or non billable task, the rows will be multiple.
        const resourceBillableRows = billableRows.filter(
          (row) =>
            row.resource_id == resourceRow.resource_id &&
            row.project_role_id == resourceRow.project_role_id
        );
        const resourceNonBillableRows = nonBillableRows.filter(
          (row) => row.resource_id == resourceRow.resource_id
        );

        //Add billableRows under billable tasks
        if (resourceBillableTasks && resourceBillableTasks[0]) {
          resourceBillableRows
            ? (resourceBillableTasks[0]["subRows"] = resourceBillableRows)
            : "";
        }
        if (resourceNonBillableTasks && resourceNonBillableTasks[0]) {
          resourceNonBillableRows
            ? (resourceNonBillableTasks[0]["subRows"] = resourceNonBillableRows)
            : "";
        }
        resourceRow.subRows = [
          ...resourceBillableTasks,
          ...resourceNonBillableTasks,
        ];
        arrayOfRowObjects[0].subRows.push(resourceRow);
      });
      updatedProjectWiseRows.push(arrayOfRowObjects[0]);
    });
    setProjectWiseRows(updatedProjectWiseRows);
  };

  const updateHiddenColumns = (weekNo) => {
    let columnsByWeekNo = [];
    const weekBasedColumns = [];
    tableDetails?.tsDtls.tsInfo.forEach((obj) => {
      if (obj.week_no === weekNo && obj.week_day) {
        let newObj = {};
        newObj[obj.week_no] = "ts_" + obj.format_date;
        weekBasedColumns.push(newObj);
      }
    });
    weekBasedColumns.forEach((obj) => {
      if (obj[weekNo]) columnsByWeekNo.push(obj[weekNo]);
    });
    setHiddenColumns((prevHiddenColumns) => {
      const updatedHiddenCols = { ...prevHiddenColumns }; // Create a new object
      columnsByWeekNo.forEach((column) => {
        if (updatedHiddenCols.hasOwnProperty(column)) {
          updatedHiddenCols[column] = !updatedHiddenCols[column];
        }
      });

      return updatedHiddenCols; // Return the updated object
    });
    setChevronIconHeader((prevIcon) =>
      prevIcon === FaChevronCircleRight
        ? FaChevronCircleLeft
        : FaChevronCircleRight
    );
    setWeekBasedColExpFlags((prevState) => {
      const newState = prevState.map((obj) => {
        if (obj.hasOwnProperty(weekNo)) {
          return { [weekNo]: !obj[weekNo] };
        }
        return obj;
      });
      return newState;
    });
  };

  function getInvoicePeriod() {
    const apiUrl = baseUrl + `/timeandexpensesms/tmOpen/getInvoicePeriod`;
    const requestBody = {
      data: { selectedvalue: firstSelProject, projects: projectIds },
    };
    axios
      .post(apiUrl, requestBody.data)
      .then(function (response) {
        setSelectedPeriod(
          response?.data.invoiceCycle ? response?.data.invoiceCycle : "653"
        );
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/timesheet/teamTimesheet";
      getUrlPath(modifiedUrlPath);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Shift Allownaces"
        ),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });

      const TMExpensesSubMenu = data
        .find((item) => item.display_name === "Time & Expenses")
        .subMenus.find((subMenu) => subMenu.display_name === "T&M - Open");

      // Extract the access_level value
      const accessLevel = TMExpensesSubMenu
        ? TMExpensesSubMenu.access_level
        : null;
      setDataAccess(accessLevel);
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

  const savePtjTsReportRuns = async () => {
    let apiUrl;

    apiUrl = baseUrl + `/timeandexpensesms/tmOpen/savePtjTsReportRuns`;

    const requestData = {
      filterName: selectedPeriod.toString(),
      UserId: loggedUserId,
      projects: selectedProjectIds,
    };

    await axios
      .post(apiUrl, requestData, { signal: abortControllerRef.current.signal })
      .then((response) => {
        //Using the response to call another api
        const reportRunId = response?.data.reportRunId;
        setGlobalReportRunId(reportRunId);
        const month = moment(startDate).format("YYYY-MM-DD");
        const calculatedEndDate = moment(startDate)
          .endOf("month")
          .format("YYYY-MM-DD");
        const endDate = calculatedEndDate;
        getPrjTeamTimesheet(reportRunId, month, endDate);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  const getPrjTeamTimesheet = async (reportRunId, month, endDate) => {
    // Cancel the previous requests before making new ones
    abortControllerRef.current.abort();

    // Create a new AbortController instance for the current search
    abortControllerRef.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    const apiUrl = baseUrl + `/timeandexpensesms/tmOpen/getPrjTeamTimeSheet`;
    const requestData = {
      month: month,
      reportRunId: reportRunId,
      endDate: endDate,
    };

    await axios
      .post(apiUrl, requestData, { signal: abortControllerRef.current.signal })
      .then((response) => {
        setTableDetails(response.data);
        setLoader(false);
        clearTimeout(loaderTime);
      })
      .catch((error) => {
        console.log(error);
      });
    setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
  };

  const handleSearch = () => {
    if (selectedProjects !== null || selectedProjects.length !== 0) {
      if (selectedProjectIds.length === 0) {
        setMessage("Please select projects !!");
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Use "auto" for instant scrolling
        });
        setTimeout(() => {
          setMessage();
        }, 3000);
      } else {
        savePtjTsReportRuns();
      }
    }
  };

  const handleProjectSelectChange = (selected) => {
    setSelectedProjects(selected);
    const selectedProjIds = selected.map((option) => option.value);
    setSelectedProjectIds(selectedProjIds);

    if (initialProjectSelectChange) {
      //Api call to invoice period happens only on initial selection
      setInitialProjectSelectChange(false);
      setFirstSelProject(selectedProjIds[0]);
    }
  };

  const handleDateChange = (selectedDate) => {
    setStartDate(selectedDate);
    setSelectedProjects([]);
    setSelectedProjectIds([]);
    setFirstSelProject("");
    setInitialProjectSelectChange(true);
    // Calculate the end date as the last day of the month
    const calculatedEndDate = moment(selectedDate)
      .endOf("month")
      .format("YYYY-MM-DD");
    setEndDate(calculatedEndDate);
  };

  //Handling prev month icon click on top left of table
  const handlePrevMonthIcon = () => {
    const currentStDte = tableDetails?.tsDtls.startDate;
    const prevStDate = moment(currentStDte)
      .subtract(1, "months")
      .format("YYYY-MM-DD");
    const prevEdDate = moment(prevStDate).endOf("month").format("YYYY-MM-DD");
    getPrjTeamTimesheet(globalReportRunId, prevStDate, prevEdDate);
  };

  //Handling next month icon click on top left of table
  const handleNextMonthIcon = () => {
    const currentStDte = tableDetails?.tsDtls.startDate;
    const nextStDate = moment(currentStDte)
      .add(1, "months")
      .format("YYYY-MM-DD");
    const nextEdDate = moment(nextStDate).endOf("month").format("YYYY-MM-DD");
    getPrjTeamTimesheet(globalReportRunId, nextStDate, nextEdDate);
  };

  //Handling save button for table
  const handleSave = async () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    const apiUrl = baseUrl + `/timeandexpensesms/tmOpen/saveTeamTs`;
    const postData = {
      startDate: tableDetails.tsDtls.startDate,
      endDate: tableDetails.tsDtls.endDate,
      Approved: approvalIDs,
      Rejected: rejectedIDs,
      prjStates: prjStates,
      ApprovedBy: loggedUserId,
    };
    await axios
      .post(apiUrl, postData)
      .then((response) => {
        setMessage("Timesheet saved successfully!!");
        setTimeout(() => {
          setMessage();
        }, 3000);
        setLoader(false);
        clearTimeout(loaderTime);
      })
      .catch((error) => {
        console.log(error);
      });

    const month = moment(tableDetails?.tsDtls.startDate).format("YYYY-MM-DD");
    const calculatedEndDate = moment(tableDetails?.tsDtls.startDate)
      .endOf("month")
      .format("YYYY-MM-DD");
    getPrjTeamTimesheet(globalReportRunId, month, calculatedEndDate);
  };

  const updateStatus = (nestedRows, clickedRow, statusCode) => {
    nestedRows.forEach((projectRow) => {
      if (projectRow.project_id === clickedRow.project_id) {
        if (clickedRow.level === 0) {
          clickedCellStates.forEach((stateId) => {
            projectRow[stateId] ? (projectRow[stateId] = statusCode) : "";
          });
          projectRow.subRows.forEach((resourceRow) => {
            clickedCellStates.forEach((stateId) => {
              resourceRow[stateId] ? (resourceRow[stateId] = statusCode) : "";
            });
            resourceRow.subRows?.forEach((billOrNonBillTasks) => {
              clickedCellStates.forEach((stateId) => {
                billOrNonBillTasks[stateId]
                  ? (billOrNonBillTasks[stateId] = statusCode)
                  : "";
              });
              billOrNonBillTasks.subRows.forEach((billOrNonBillRow) => {
                clickedCellStates.forEach((stateId) => {
                  billOrNonBillRow[stateId]
                    ? (billOrNonBillRow[stateId] = statusCode)
                    : "";
                });
              });
            });
          });
        } else if (clickedRow.level === 3 || clickedRow.level === 4) {
          projectRow.subRows.forEach((resourceRow) => {
            if (resourceRow.resource_id == clickedRow.resource_id) {
              const rowType =
                clickedRow.row_type == "Billable"
                  ? "Billable Tasks"
                  : "Non Billable Tasks";
              const billNonBillTaskRows = resourceRow.subRows.filter(
                (billNonBillRow) => billNonBillRow.row_type == rowType
              );
              if (billNonBillTaskRows[0].subRows?.length > 1) {
                const billNonBillRow = billNonBillTaskRows[0].subRows.find(
                  (row) => row.project_task_id == clickedRow.project_task_id
                );
                clickedCellStates.forEach((stateId) => {
                  billNonBillRow[stateId]
                    ? (billNonBillRow[stateId] = statusCode)
                    : "";
                });
              } else {
                projectRow.subRows.forEach((resourceRow) => {
                  if (resourceRow.resource_id === clickedRow.resource_id) {
                    clickedCellStates.forEach((stateId) => {
                      resourceRow[stateId]
                        ? (resourceRow[stateId] = statusCode)
                        : "";
                    });
                    resourceRow.subRows?.forEach((billOrNonBillTasks) => {
                      clickedCellStates.forEach((stateId) => {
                        billOrNonBillTasks[stateId]
                          ? (billOrNonBillTasks[stateId] = statusCode)
                          : "";
                      });
                      billOrNonBillTasks.subRows.forEach((billOrNonBillRow) => {
                        clickedCellStates.forEach((stateId) => {
                          billOrNonBillRow[stateId]
                            ? (billOrNonBillRow[stateId] = statusCode)
                            : "";
                        });
                      });
                    });
                  }
                });
              }
            }
          });
        } else {
          projectRow.subRows.forEach((resourceRow) => {
            if (resourceRow.resource_id === clickedRow.resource_id) {
              clickedCellStates.forEach((stateId) => {
                resourceRow[stateId] ? (resourceRow[stateId] = statusCode) : "";
              });
              resourceRow.subRows?.forEach((billOrNonBillTasks) => {
                clickedCellStates.forEach((stateId) => {
                  billOrNonBillTasks[stateId]
                    ? (billOrNonBillTasks[stateId] = statusCode)
                    : "";
                });
                billOrNonBillTasks.subRows.forEach((billOrNonBillRow) => {
                  clickedCellStates.forEach((stateId) => {
                    billOrNonBillRow[stateId]
                      ? (billOrNonBillRow[stateId] = statusCode)
                      : "";
                  });
                });
              });
            }
          });
        }
      }
    });
  };

  //Handing approve onClick event
  const handleApprove = () => {
    const statusCode = 4;
    updateStatus([...projectWiseRows], clickedRow, statusCode);
    setProjectWiseRows([...projectWiseRows]); // Trigger state update to re-render the component

    const updatedRejectedIDs = rejectedIDs.filter(
      (id) => !clickedCellIds.includes(id)
    );
    setRejectedIDs(updatedRejectedIDs);
    setApprovalIDs((prevIds) => {
      // Create a new Set from the previous IDs array to easily check for duplicates
      const existingIds = new Set(prevIds);
      // Filter out any clicked cell IDs that already exist in the set
      const uniqueClickedCellIds = clickedCellIds.filter(
        (id) => !existingIds.has(id)
      );

      // Concatenate the unique clicked cell IDs with the previous IDs array
      return [...prevIds, ...uniqueClickedCellIds];
    });
  };

  //Handing reject onClick event
  const handleReject = () => {
    const statusCode = 2;
    updateStatus([...projectWiseRows], clickedRow, statusCode);
    setProjectWiseRows([...projectWiseRows]); // Trigger state update to re-render the component

    const updatedApprovalIDs = approvalIDs.filter(
      (id) => !clickedCellIds.includes(id)
    );
    setApprovalIDs(updatedApprovalIDs);
    setRejectedIDs((prevIds) => {
      // Create a new Set from the previous IDs array to easily check for duplicates
      const existingIds = new Set(prevIds);

      // Filter out any clicked cell IDs that already exist in the set
      const uniqueClickedCellIds = clickedCellIds.filter(
        (id) => !existingIds.has(id)
      );

      // Concatenate the unique clicked cell IDs with the previous IDs array
      return [...prevIds, ...uniqueClickedCellIds];
    });
  };

  const handleCancel = () => {
    const currStDte = tableDetails?.tsDtls.startDate;
    const currEdDate = moment(currStDte).endOf("month").format("YYYY-MM-DD");
    getPrjTeamTimesheet(globalReportRunId, currStDte, currEdDate);
  };

  const isUserFM = async () => {
    await axios
      .get(baseUrl + `/timeandexpensesms/tmOpen/fmUserRole`, {
        params: {
          userId: loggedUserId,
          source: searchFilters.prjSource,
        },
      })
      .then((response) => {
        setIsFM(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isPMThenPrjIds = () => {
    axios
      .get(baseUrl + `/timeandexpensesms/tmOpen/userRole`, {
        params: {
          userId: loggedUserId,
          source: searchFilters.prjSource,
        },
      })
      .then((response) => {
        // Handle the response data
        setIsPMPrjIds(response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
      });
  };

  //Switch statement to fetch the header associated value.
  let getHeaderValueForExcel = (header, rowData) => {
    const taskRow = tableDetails.tsDates.find(
      (obj) =>
        obj.resource_id === rowData.resource_id &&
        (obj.level === 3 || obj.level === 4)
    );
    const projectRow = tableDetails.tsDates.find(
      (obj) => obj.project_id === rowData.project_id && obj.level === 0
    );
    let headerAssociatedValue = "";
    let headerAssociatedValueTemp = "";
    switch (header) {
      case "Task Name":
        headerAssociatedValue = taskRow?.name;
        break;

      case "Project Name":
        headerAssociatedValue = projectRow?.name;
        break;
      case "Resource Name":
        headerAssociatedValue = rowData?.name;
        break;

      case "Task Type":
        headerAssociatedValue = taskRow?.row_type;
        break;

      case "Role Name":
        headerAssociatedValue = rowData?.type;
        break;

      case "Rate":
        if (rowData["rate"] === null)
          headerAssociatedValueTemp =
            rowData["currency"] + " " + (0.0).toFixed(2);
        else
          headerAssociatedValueTemp =
            rowData["currency"] + " " + rowData["rate"].toFixed(2);
        headerAssociatedValue = new DOMParser().parseFromString(
          headerAssociatedValueTemp,
          "text/html"
        ).body.textContent;

        break;

      case "Logged Hours":
        headerAssociatedValue =
          rowData["logged_hours"] !== null
            ? rowData["logged_hours"].toFixed(1)
            : (0.0).toFixed(1);
        break;

      case "Rejected Hours":
        headerAssociatedValue =
          rowData["rejected_hours"] !== null
            ? rowData["rejected_hours"].toFixed(1)
            : (0.0).toFixed(1);
        break;

      case "Pending Hours":
        headerAssociatedValue =
          rowData["pending_hours"] !== null
            ? rowData["pending_hours"].toFixed(1)
            : (0.0).toFixed(1);
        break;

      case "Invoiced":
        headerAssociatedValue =
          rowData["invoiced"] !== null
            ? rowData["invoiced"].toFixed(1)
            : (0.0).toFixed(1);
        break;

      case "To Invoice":
        headerAssociatedValue =
          rowData["to_invoice"] !== null
            ? rowData["to_invoice"].toFixed(1)
            : (0.0).toFixed(1);
        break;

      case "Invoice Amount":
        if (rowData["invoice_amount"] === null) {
          headerAssociatedValueTemp =
            rowData["currency"] + " " + (0.0).toFixed(2);
        } else {
          headerAssociatedValueTemp =
            rowData["currency"] + " " + rowData["invoice_amount"].toFixed(2);
        }
        headerAssociatedValue = new DOMParser().parseFromString(
          headerAssociatedValueTemp,
          "text/html"
        ).body.textContent;
        break;

      case "Yet To Invoice Hours":
        headerAssociatedValue =
          rowData["yet_to_invoice_hrs"] !== null
            ? rowData["yet_to_invoice_hrs"].toFixed(1)
            : (0.0).toFixed(1);
        break;

      case "Yet To Invoice Amount":
        if (rowData["yet_to_invoice_amount"] === null) {
          headerAssociatedValueTemp =
            rowData["currency"] + " " + (0.0).toFixed(2);
        } else {
          headerAssociatedValueTemp =
            rowData["currency"] +
            " " +
            rowData["yet_to_invoice_amount"].toFixed(2);
        }

        headerAssociatedValue = new DOMParser().parseFromString(
          headerAssociatedValueTemp,
          "text/html"
        ).body.textContent;
        break;

      default:
        break;
    }
    return headerAssociatedValue;
  };

  const handleOnExport = () => {
    const resourcesData = tableDetails.tsDates.filter(
      (obj) => obj.row_type == "Resource"
    );

    //Giving the header values static. Dates are the dynamic values, hence adding them using tableDetails
    const headerRow = [
      "Resource Name",
      "Project Name",
      "Role Name",
      "Task Name",
      "Task Type",
      "Rate",
      "Logged Hours",
      "Rejected Hours",
      "Pending Hours",
      "To Invoice",
      "Invoiced",
      "Invoice Amount",
      "Yet To Invoice Hours",
      "Yet To Invoice Amount",
    ];
    tableDetails?.tsDtls?.tsInfo?.forEach((obj) => {
      if (obj.format_date) headerRow.push(obj.format_date);
    });

    const updatedRowData = [];

    //Iterating over resource rows to build rows for excel
    resourcesData.forEach((row) => {
      let newArray = [];
      headerRow.forEach((header) => {
        if (!header.includes("_")) {
          //Fetching the header associated value for excel
          const headerAssocialtedVal = getHeaderValueForExcel(header, row);
          headerAssocialtedVal
            ? newArray.push("" + headerAssocialtedVal)
            : header.includes("Amount") ||
              header === "Rate" ||
              header === "To Invoice"
            ? newArray.push((0.0).toFixed(1))
            : newArray.push("" + headerAssocialtedVal);
        } else {
          row["ts_" + header]
            ? newArray.push(row["ts_" + header].toFixed(1))
            : newArray.push((0.0).toFixed(1));
        }
      });
      updatedRowData.push(newArray);
    });

    const workbook = new ExcelJS.Workbook();

    //Create new worksheet
    const worksheet = workbook.addWorksheet("Timesheet");

    //Replacing "_" with "-" in the headers
    const updatedHeaderRow = headerRow.map((row) => {
      if (row.includes("_")) return row.replace(/_/g, "-");
      else return row;
    });
    worksheet.addRow(updatedHeaderRow);

    //Adding rows to the worksheet
    updatedRowData.forEach((row) => {
      worksheet.addRow(row);
    });

    //Bolding the first row which contains headers
    worksheet.getRow(1).font = { bold: true };

    //Saving the sheet
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "Timesheet.xlsx");
    });
  };

  //Switch statement to fetch the accessor key based on table details data
  let getAccessorKey = (header) => {
    let columnKey = "";
    switch (header) {
      case "Project":
        columnKey = "name";
        break;

      case "Task Type/Role":
        columnKey = "type";
        break;

      case "Billing Rate":
        columnKey = "rate";
        break;

      case "Logged Hrs":
        columnKey = "logged_hours";
        break;

      case "Rejected Hrs":
        columnKey = "rejected_hours";
        break;

      case "Pending Approval Hrs":
        columnKey = "pending_hours";
        break;

      case "Already Invoiced Hrs":
        columnKey = "invoiced";
        break;

      case "To be Invoiced Hrs":
        columnKey = "to_invoice";
        break;

      case "Invoiceable Amount":
        columnKey = "invoice_amount";
        break;

      case "Approvals":
        columnKey = "approvals";
        break;

      case "Total Invoice Hrs":
        columnKey = "yet_to_invoice_hrs";
        break;

      case "Yet to be Invoiced":
        columnKey = "yet_to_invoice_amount";
        break;

      case "Total Amount":
        columnKey = "total_amount";
        break;

      case "Invoice Amount":
        columnKey = "prjInvoiceAmount";
        break;

      default:
        break;
    }
    return columnKey;
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
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    const allValues = allOptions.map((item) => item.value);

    if (
      selectedValues.length != 0 &&
      selectedValues.length === allValues.length
    ) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  //==========Help Document=======================
  const HelpPDFName = "TMOpen.pdf";
  const Headername = "Project Timesheet Help";
  // ====================================Function calls End===============================

  return (
    <div>
      {message && message.includes("projects") ? (
        <div className="statusMsg error">
          <span>
            <BiErrorCircle className="error-icon" />
            {message}
          </span>
        </div>
      ) : message ? (
        <div className="statusMsg success">
          <span>
            <BiCheck />
            {message}
          </span>
        </div>
      ) : null}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Project Timesheet</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  Source<span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    id="project-select"
                    onChange={(event) => {
                      const selectedValue = event.target.value;
                      setSelectedProjects([]);
                      setSelectedProjectIds([]);
                      setFirstSelProject("");
                      setInitialProjectSelectChange(true);
                      setSearchFilters((prevSearchFilters) => ({
                        ...prevSearchFilters,
                        prjSource: selectedValue,
                      }));
                    }}
                    style={selectBoxStyle}
                  >
                    <option value="PPM">PPM</option>
                    <option value="Projector">Projector</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  Status<span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    id="status-select"
                    onChange={(event) => {
                      const selectedValue = event.target.value;
                      setSelectedProjects([]);
                      setSelectedProjectIds([]);
                      setFirstSelProject("");
                      setInitialProjectSelectChange(true);
                      setSearchFilters((prevSearchFilters) => ({
                        ...prevSearchFilters,
                        prjStatus: selectedValue,
                      }));
                    }}
                    style={selectBoxStyle}
                  >
                    <option value="">All</option>
                    <option value="1" selected>
                      In progress
                    </option>
                    <option value="2">Completed</option>
                    <option value="3">On hold</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country-select">
                  Approval Status
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="appStatus"
                    options={appStatusOptions}
                    value={selectedAppStats}
                    valueRenderer={generateDropdownLabel}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    onChange={(selected) => {
                      setSelectedProjects([]);
                      setSelectedProjectIds([]);
                      setFirstSelProject("");
                      setInitialProjectSelectChange(true);
                      setSelectedAppStats(selected);
                      const selectedValues = selected.map(
                        (option) => option.value
                      );
                      setSearchFilters((prevSearchFilters) => ({
                        ...prevSearchFilters,
                        appStatus: selectedValues,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  Month
                </label>
                <span className="col-1">:</span>
                <div className="col-6 z-4">
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  Period
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    id="country-select"
                    value={selectedPeriod}
                    disabled={selectedPeriod == "653"}
                    style={selectBoxStyle}
                  >
                    <option
                      value="biweekly"
                      disabled={selectedPeriod !== "biweekly"}
                    >
                      {" "}
                      Biweekly
                    </option>
                    <option
                      value="custom"
                      disabled={selectedPeriod !== "custom"}
                    >
                      Custom
                    </option>
                    <option value="653" disabled={selectedPeriod !== "653"}>
                      Monthly
                    </option>
                    <option
                      value="special1"
                      disabled={selectedPeriod !== "special1"}
                    >
                      Special 1
                    </option>
                    <option
                      value="weekly"
                      disabled={selectedPeriod !== "weekly"}
                    >
                      Weekly
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="project_select">
                  Project<span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="project_select"
                    ArrowRenderer={ArrowRenderer}
                    options={projectData}
                    hasSelectAll={false}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    value={selectedProjects}
                    valueRenderer={generateDropdownLabel}
                    onChange={handleProjectSelectChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12 col-sm-12 col-xs-12 no-padding d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-primary"
                title="Search"
                onClick={handleSearch}
              >
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      {loader && <Loader handleAbort={handleAbort} />}
      {tableDetails && (
        <>
          <div className="materialReactExpandableTable darkHeader toHead timesheetTable">
            <MaterialReactTable
              enableExpanding
              // enableStickyHeader
              enablePagination={false}
              enableBottomToolbar={false}
              enableColumnFilterModes={false}
              enableDensityToggle={false}
              enableColumnActions={false}
              enableFilters={false}
              enableSorting={false}
              enableFullScreenToggle={false}
              enableHiding={false}
              filterFromLeafRows //apply filtering to all rows instead of just parent rows
              initialState={{
                expanded: false,
                density: "compact",
                columnVisibility: { ...hiddenColumns },
                enablePinning: true,
              }} //expand all rows by default
              state={{ columnVisibility: { ...hiddenColumns } }}
              // defaultColumn={{ minSize: 10, maxSize: 100, size: 10 }} //units are in px
              localization={{
                noRecordsToDisplay: <label>No records found</label>,
              }}
              columns={columnData}
              data={projectWiseRows}
              muiTableContainerProps={{
                sx: {
                  maxHeight: projectWiseRows.length === 0 ? "30vh" : "50vh", // Adjust the maxHeight value as needed
                  width: "auto",
                  maxWidth: "fit-content",
                  marginBottom: "10px",
                },
              }}
              muiTableBodyCellProps={({ row }) => ({
                sx: {
                  backgroundColor:
                    row.original.row_type === "Billable Tasks" ||
                    row.original.row_type === "Non Billable Tasks"
                      ? "rgba(52, 210, 235, 0.1)"
                      : "white",
                  borderRight: "2px solid #e0e0e0",
                  fontSize: "13px",
                  borderTop: "1px solid #ccc",
                  borderRight: "2px solid #e0e0e0",
                  padding: "2px 8px",
                  verticalAlign: "middle",
                  textAlign: "center",
                  fontWeight: 550,
                },
              })}
              muiTableHeadProps={{
                sx: {
                  "&": {
                    position: "sticky",
                    top: "0",
                    zIndex: "5",
                  },
                  "& th": {
                    borderTop: "1px solid #ccc",
                    borderRight: "2px solid #e0e0e0",
                    background: "#f4f4f4 ",
                    fontSize: "13px",
                    padding: "2px 8px",
                    verticalAlign: "middle",
                    textAlign: "center",
                  },
                },
              }}
              renderTopToolbarCustomActions={({ table }) => (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.1rem",
                      p: "0.1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        handlePrevMonthIcon();
                      }}
                    >
                      <AiFillLeftCircle />
                    </IconButton>
                    <b style={{ margin: 0 }}>
                      {moment(tableDetails?.tsDtls?.startDate).format("MMM")}
                    </b>
                    <IconButton
                      onClick={() => {
                        handleNextMonthIcon();
                      }}
                    >
                      <AiFillRightCircle />
                    </IconButton>
                  </Box>
                </div>
              )}
              renderToolbarInternalActions={({ table }) => (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.1rem",
                      p: "0.1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <RiFileExcel2Line
                      size="1.5em"
                      title="Export to Excel"
                      style={{ color: "green" }}
                      cursor="pointer"
                      onClick={handleOnExport}
                    />
                  </Box>
                </div>
              )}
            />
          </div>

          {(dataAccess === 1000 || dataAccess === 250) && (
            <div
              className="col-md-12 col-sm-12 col-xs-12 no-padding d-flex justify-content-center"
              style={{ paddingTop: "10px" }}
            >
              <button
                type="button"
                className="btn btn-primary mr-2"
                title="save"
                onClick={handleSave}
              >
                <FaSave /> Save
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                title="cancel"
                onClick={handleCancel}
              >
                <ImCross size={"10px"} /> Cancel
              </button>
            </div>
          )}

          <div>
            <Popover
              className="approvalBtns"
              open={isPopoverOpen}
              anchorEl={anchorEl}
              onClose={() => setPopoverOpen(false)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <div>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  style={{ fontSize: "10px" }}
                  onClick={() => {
                    handleApprove();
                    setPopoverOpen(false);
                  }}
                >
                  Approve &#10004;
                </Button>
                <br />
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ fontSize: "10px", width: "82px" }}
                  onClick={() => {
                    handleReject();
                    setPopoverOpen(false);
                  }}
                >
                  Reject &#10006;
                </Button>
              </div>
            </Popover>
          </div>
        </>
      )}
    </div>
  );
}

export default TMOpen;
