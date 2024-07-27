import React, { useEffect, useState } from "react";
import MaterialReactTable from "material-react-table";
import { v4 as uuidv4 } from "uuid";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import FPRGoalsandNotes from "./FPRGoalsandNotes";
import axios from "axios";
import { environment } from "../../../environments/environment";
import { RiFileExcel2Line } from "react-icons/ri";
import useDynamicMaxHeight from "../../PrimeReactTableComponent/useDynamicMaxHeight";
import { Link } from "react-router-dom";
import { IoMdInformationCircleOutline } from "react-icons/io";
import PlRevTable from "./PlRevTable";
import { Column } from "primereact/column";
import moment from "moment";
export const FPRCompareTable = ({
  tableData,
  reportRunId,
  servicesPayload,
  goalsPopup,
  setGoalsPopup,
  exportExcel,
}) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [initialHiddenCols, setInitialHiddenCols] = useState({});
  const [flagBasedKeys, setFlagBasedKeys] = useState({});
  const [clickedColumn, setClickedColumn] = useState();
  const [goalData, setGoalData] = useState();
  const [noteData, setNoteData] = useState();
  const baseUrl = environment.baseUrl;
  const [showPRFlag, setShowPRFlag] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [dataPR, setDataPR] = useState([{}]);
  const [newMonth, setNewMonth] = useState([]);

  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);

  let row = 25;
  const [flags, setFlags] = useState({
    account: false,
    Q1: false,
    Q2: false,
    Q3: false,
    Q4: false,
  });
  // ===================useEffect start=====================
  const materialTableElement = document.getElementsByClassName(
    "materialReactExpandableTable darkHeader toHead timesheetTable compareTable PAC-FPR-Table"
  );

  const maxHeight = useDynamicMaxHeight(materialTableElement) - 91;

  useEffect(() => {
    if (tableData) {
      defineFlagBasedKeys();
      defineColumns();
    }
  }, [tableData]);

  useEffect(() => {
    //Whenever a flag changes, below function should be called
    handleExpandOrCollapse();
  }, [flags]);

  // =====================useEffect end=========================

  //Unhiding or hiding columns and flipping the icon
  function handleExpandOrCollapse() {
    //Hide or unhide cols
    const hiddenColsToBeChanged = {};
    const flagMappedCols = flagBasedKeys[clickedColumn];
    flagMappedCols?.forEach((key) => {
      hiddenColsToBeChanged[key] = !initialHiddenCols[key];
    });
    setInitialHiddenCols((prevHiddenCols) => {
      return Object.assign({}, prevHiddenCols, hiddenColsToBeChanged);
    });

    //Flip the expand/Collapse button
    let clickedColIndex = null;
    if (clickedColumn == "account") {
      clickedColIndex = columns.findIndex((column) => column.id == "customer");
    } else {
      clickedColIndex = columns.findIndex((column) =>
        column.id.includes(clickedColumn)
      );
    }
    if (clickedColIndex != -1) {
      setColumns((prevColumns) => {
        const prevColumnsCopy = [...prevColumns];
        const updatedObject = {
          ...prevColumnsCopy[clickedColIndex],
          Header: () => (
            <div className={clickedColumn == "account" && "mixerCustomthree"}>
              <span>{prevColumnsCopy[clickedColIndex].header}</span>
              &nbsp;&nbsp;
              {flags[clickedColumn] == true ? (
                <span
                  onClick={() =>
                    toggleFlag(
                      prevColumnsCopy[clickedColIndex].accessorKey
                        ? prevColumnsCopy[clickedColIndex].accessorKey
                        : prevColumnsCopy[clickedColIndex].id
                    )
                  }
                >
                  <span>{<FaChevronCircleLeft />}</span>
                </span>
              ) : (
                <span
                  onClick={() =>
                    toggleFlag(
                      prevColumnsCopy[clickedColIndex].accessorKey
                        ? prevColumnsCopy[clickedColIndex].accessorKey
                        : prevColumnsCopy[clickedColIndex].id
                    )
                  }
                >
                  <span>{<FaChevronCircleRight />}</span>
                </span>
              )}
            </div>
          ),
        };
        prevColumnsCopy[clickedColIndex] = { ...updatedObject };
        return prevColumnsCopy;
      });
    }
  }

  //Called when expand-collapse button is clicked.
  const toggleFlag = (key) => {
    let flag = null;
    key.includes("Q1")
      ? (flag = "Q1")
      : key.includes("Q2")
      ? (flag = "Q2")
      : key.includes("Q3")
      ? (flag = "Q3")
      : key.includes("Q4")
      ? (flag = "Q4")
      : (flag = "account");
    setClickedColumn(flag);
    setFlags((prevFlags) => ({
      ...prevFlags,
      [flag]: !prevFlags[flag],
    }));
  };

  //Initializing expand/collapse flags
  const defineFlagBasedKeys = () => {
    const columnDetails = tableData[0];
    // Initialize property arrays
    const account = [];
    const Q1 = [];
    const Q2 = [];
    const Q3 = [];
    const Q4 = [];

    // Iterate through the object and populate the property arrays
    Object.entries(columnDetails).forEach(([key, value]) => {
      if (value && value.toString().includes("Q1") && value.includes("Month")) {
        Q1.push(key.toString());
      } else if (
        value &&
        value.toString().includes("Q2") &&
        value.includes("Month")
      ) {
        Q2.push(key.toString());
      } else if (
        value &&
        value.toString().includes("Q3") &&
        value.includes("Month")
      ) {
        Q3.push(key.toString());
      } else if (
        value &&
        value.toString().includes("Q4") &&
        value.includes("Month")
      ) {
        Q4.push(key.toString());
      } else if (key == "customer") {
        account.push("salesPartner");
        account.push("delPartner");
        account.push("CSLPartner");
      }
    });

    // Create key-value pairs for the properties
    const keyValuePair = {
      account: account,
      Q1: Q1,
      Q2: Q2,
      Q3: Q3,
      Q4: Q4,
    };

    setFlagBasedKeys(keyValuePair);
  };
  const getAccountPlanRevenue = (row, key) => {
    let month = key.split("_").slice(0, 3);
    month = month.join("-");
    // Extracting year using regular expression

    // const yearRegex = /(\d{4})_/;
    // const yearMatch = key.match(yearRegex);
    // const year = yearMatch ? yearMatch[1] : null;

    let year;
    let monthNew;

    const quarter = key.split("_")[1];
    switch (quarter) {
      case "Q1":
        year = "2024-04-01";
        monthNew = "April";
        break;
      case "Q2":
        year = "2024-07-01";
        monthNew = "July";

        break;
      case "Q3":
        year = "2024-10-01";
        monthNew = "October";

        break;
      case "Q4":
        year = "2024-01-01";
        monthNew = "January";

        break;
      default:
        year = null; // Handle invalid quarter
    }
    setNewMonth(monthNew);

    // switch (quarter) {
    //   case "Q1":
    //     year = "2024-04-01";
    //     break;
    //   case "Q2":
    //     year = "2024-07-01";
    //     break;
    //   case "Q3":
    //     year = "2024-10-01";
    //     break;
    //   case "Q4":
    //     year = "2024-01-01";
    //     break;
    //   default:
    //     year = null; // Handle invalid quarter
    // }
    const NewmeasureType = key.split("_")[2].split("^")[0];
    console.log(NewmeasureType);
    console.log("Year:", year);
    console.log(row);
    console.log(key);
    const date = new Date(key.split("_")[0], key.split("_")[1] - 1, 1);
    // Get the month name from the Date object
    setMonth(date.toLocaleString("default", { month: "short" }));
    setYear(key.split("_")[0]);
    const postData = {
      month: year,
      customerId: row.id,
      countryId: row.countryId,
      reportRunId: reportRunId,
      userType: row.userType,
      cslId: "0",
      measureType: NewmeasureType == "act" ? "rev" : NewmeasureType,
      isQrtr: "1",
      option: "ntview",
    };

    axios({
      method: "POST",
      url:
        baseUrl + `/customersms/financialPlanandReview/getAccountPlanRevenue`,
      data: postData,
    }).then((response) => {
      const GetData = response.data?.filter((d) => d.id != -1);
      const dynamicKeys = response.data.includes("_rev");
      const revKeys = {};
      const nonRevData = {};

      Object.entries(response.data).forEach(([key, value]) => {
        if (key.includes("_rev")) {
          revKeys[key] = value;
        } else {
          nonRevData[key] = value;
        }
      });

      console.log("Data with '_rev' keys:", revKeys);
      console.log("Data without '_rev' keys:", nonRevData);
      let dataHeader;

      if (NewmeasureType == "act") {
        dataHeader = [
          {
            project: "Project",
            start_dt: "Start Date",
            end_dt: "End Date",
            customer: "Account",
            country: "Country",
          },
        ];
      } else {
        dataHeader = [
          {
            opportunity: "Opportunity",
            created_dt: "Created Date",
            closed_dt: "Closed Date",
            customer: "Account",
            country: "Country",
            probability: "Probability",
            amount: "Amount",
          },
        ];
      }

      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["csl"] =
          GetData[i]["csl"] == null
            ? ""
            : moment(GetData[i]["csl"]).format("DD-MMM-yyyy");

        GetData[i]["start_dt"] =
          GetData[i]["start_dt"] == null
            ? ""
            : moment(GetData[i]["start_dt"]).format("DD-MMM-yyyy");
      }

      let data = ["project"];
      let linkRoutes = ["/project/Overview/:id"];
      setLinkColumns(data);
      setLinkColumnsRoutes(linkRoutes);

      let fData = [...dataHeader, ...GetData];
      setDataPR(fData);
      setShowPRFlag(true);
    });
  };

  const getGoalsandNotes = (data) => {
    const postData = {
      customerId: data.id,
      countryId: data.countryId,
      plan: servicesPayload.viewtype,
      month: servicesPayload.quarter,
      duration: servicesPayload.duration,
      pageReq: "",
      isp: 0,
    };

    axios({
      method: "POST",
      url: baseUrl + `/customersms/financialPlanandReview/getAccountGoals`,
      data: postData,
    }).then((response) => {
      //   let goalData = response.data.goals?.filter((d) => d.id != -1);
      setGoalData(response.data.goals);
      setNoteData(response.data.notes);
    });
  };
  //Initializing columns
  const defineColumns = () => {
    const updatedInitialHiddenCols = {};
    const fprCompareDataCopy = [...tableData];
    const columnsDetails = fprCompareDataCopy.slice(0, 4);
    setRows(fprCompareDataCopy.slice(4));
    const headerObj = columnsDetails[1];
    const myHeaderMap = new Map();
    for (const key in headerObj) {
      if (
        headerObj[key]?.toString().includes("^") &&
        !key.includes("client") &&
        !key.includes("engPartner")
      )
        myHeaderMap.set(key, headerObj[key]);
    }

    const levelThreeSubH = columnsDetails[3];
    const updatedColumns = [];
    const goalsButtonCol = {
      id: uuidv4(),
      header: "Goals",
      Header: () => <div className="mixerCustomthree">Goals</div>,
      sortingFn: (rowB, rowA, columnId) => {
        return rowA.original.customer != "Summary" &&
          rowB.original.customer != "Summary"
          ? rowB.getValue(columnId) - rowA.getValue(columnId)
          : "";
      },
      Cell: ({ cell }) =>
        cell.row.original.id != 0 && (
          <div className="normalCols">
            <button
              className="btn"
              style={{
                fontWeight: "bold",
                backgroundColor:
                  cell.row.original.btnCls == "green" ? "#92c564" : "#428bca",
              }}
              onClick={() => {
                setGoalsPopup(true);
                getGoalsandNotes(cell.row.original);
              }}
            >
              Goals
            </button>
          </div>
        ),
    };
    updatedColumns.push(goalsButtonCol);
    myHeaderMap.forEach((value, key) => {
      if (key.includes("_")) {
        const searchKeyArray = key.split("_");
        searchKeyArray.pop();
        const searchKey = searchKeyArray.join("_");
        const filteredSubHeadKeys = Object.keys(levelThreeSubH).filter((k) =>
          k.includes(searchKey)
        );
        const levelThreeCols = [];
        const normalColObj = {
          id: uuidv4(),
          header: "",
          columns: [],
        };
        const estPlannedColObj = {
          id: uuidv4(),
          header: "Est. Planned",
          columns: [],
        };
        const recognizedColObj = {
          id: uuidv4(),
          header: "Recognized",
          columns: [],
        };
        filteredSubHeadKeys.forEach((subhead) => {
          !subhead.toString().includes("Q") &&
          !subhead.toString().includes("total")
            ? (updatedInitialHiddenCols[subhead] = false)
            : "";
          if (subhead.includes("pl")) {
            let colObj = {
              id: subhead,
              header: levelThreeSubH[subhead],
              accessorKey: subhead,
              sortingFn: (rowB, rowA, columnId) => {
                return rowA.original.customer != "Summary" &&
                  rowB.original.customer != "Summary"
                  ? rowB.getValue(columnId) - rowA.getValue(columnId)
                  : "";
              },
              Cell: ({ cell }) => (
                <div
                  className={
                    key.includes("_")
                      ? key.split("_")[0] == "total"
                        ? " total"
                        : key.split("_")[1][1] % 2 == 0
                        ? " even"
                        : "odd"
                      : ""
                  }
                  title={parseInt(cell.getValue()).toLocaleString("en-US")}
                >
                  {parseInt(cell.getValue()).toLocaleString("en-US")}
                </div>
              ),
            };
            estPlannedColObj.columns.push(colObj);
          } else if (subhead.includes("act")) {
            let colObj = {
              id: subhead,
              header: levelThreeSubH[subhead],
              accessorKey: subhead,
              sortingFn: (rowB, rowA, columnId) => {
                return rowA.original.customer != "Summary" &&
                  rowB.original.customer != "Summary"
                  ? rowB.getValue(columnId) - rowA.getValue(columnId)
                  : "";
              },
              Cell: ({ cell }) => (
                <div
                  className={
                    key.includes("_")
                      ? key.split("_")[0] == "total"
                        ? " total"
                        : key.split("_")[1][1] % 2 == 0
                        ? " even"
                        : "odd"
                      : ""
                  }
                  title={parseInt(cell.getValue()).toLocaleString("en-US")}
                >
                  {!cell.column.id.includes("total") &&
                  cell.column.id.includes("rev") &&
                  cell.getValue() != 0 &&
                  cell.row.original.id != 0 ? (
                    <Link
                      data-toggle="tooltip"
                      title={parseInt(cell.getValue()).toLocaleString("en-US")}
                      // to={`/vendor/vendorDoc/:${}`}
                      // to={`/vendor/vendorDoc/:${cell.row.original.vendorId}`}
                      onClick={() => {
                        // console.log(key.split("_")[1], "key.split[2]");
                        // getAccountPlanRevenue(
                        //   cell.row.original,
                        //   cell.column.id
                        // );
                        getAccountPlanRevenue(
                          cell.row.original,
                          cell.column.id
                        );
                        setShowPRFlag(true);
                      }}
                      // target="_blank"
                    >
                      {parseInt(cell.getValue()).toLocaleString("en-US")}
                    </Link>
                  ) : (
                    parseInt(cell.getValue()).toLocaleString("en-US")
                  )}
                </div>
              ),
            };
            recognizedColObj.columns.push(colObj);
          } else {
            let colObj = {
              id: subhead,
              header: levelThreeSubH[subhead],
              accessorKey: subhead,
              sortingFn: (rowB, rowA, columnId) => {
                return rowA.original.customer != "Summary" &&
                  rowB.original.customer != "Summary"
                  ? rowB.getValue(columnId) - rowA.getValue(columnId)
                  : "";
              },
              Cell: ({ cell }) => (
                <div
                  className={
                    key.includes("_")
                      ? key.split("_")[0] == "total"
                        ? " total"
                        : key.split("_")[1][1] % 2 == 0
                        ? " even"
                        : "odd"
                      : ""
                  }
                  title={parseInt(cell.getValue()).toLocaleString("en-US")}
                >
                  {!cell.column.id.includes("total") &&
                  !cell.column.id.includes("cm") &&
                  cell.getValue() != 0 &&
                  cell.row.original.id != 0 ? (
                    <Link
                      data-toggle="tooltip"
                      title={parseInt(cell.getValue()).toLocaleString("en-US")}
                      // to={`/vendor/vendorDoc/:${}`}
                      // to={`/vendor/vendorDoc/:${cell.row.original.vendorId}`}
                      onClick={() => {
                        // console.log(key.split("_")[1], "key.split[2]");
                        getAccountPlanRevenue(
                          cell.row.original,
                          cell.column.id
                        );
                        setShowPRFlag(true);
                      }}
                      // target="_blank"
                    >
                      {parseInt(cell.getValue()).toLocaleString("en-US")}
                    </Link>
                  ) : (
                    parseInt(cell.getValue()).toLocaleString("en-US")
                  )}
                </div>
              ),
            };
            normalColObj.columns.push(colObj);
          }
        });
        levelThreeCols.push(normalColObj);
        levelThreeCols.push(estPlannedColObj);
        levelThreeCols.push(recognizedColObj);
        const mainCol = {
          id: key,
          header: value.split("^&")[0],
          Header: () => (
            <div>
              <span>{value.split("^&")[0]}</span>
              &nbsp;&nbsp;
              {key.includes("Q") ? (
                <span onClick={() => toggleFlag(key)}>
                  <span>{<FaChevronCircleRight />}</span>
                </span>
              ) : null}
            </div>
          ),
          columns: levelThreeCols,
          enableHiding: true,
        };
        updatedColumns.push(mainCol);
      } else {
        key == "salesPartner" || key == "CSLPartner" || key == "delPartner"
          ? (updatedInitialHiddenCols[key] = false)
          : "";
        let colObj = {
          id: key,
          header: value.split("^&")[0],
          Header: ({ column }) => (
            <div
              className={
                key == "salesPartner" ||
                key == "CSLPartner" ||
                key == "delPartner"
                  ? "expandable-column mixerCustomthree"
                  : "mixerCustomthree"
              }
            >
              <span>{value.split("^&")[0]}</span>
              &nbsp;&nbsp;
              {key == "customer" ? (
                <span
                  onClick={() => {
                    toggleFlag(key);
                    setClickedColumn("account");
                  }}
                >
                  <span>{<FaChevronCircleRight />}</span>
                </span>
              ) : null}
            </div>
          ),
          accessorKey: key,
          enableColumnActions: false,
          enableHiding: true,
          sortingFn: (rowB, rowA, columnId) => {
            return rowA.original.customer != "Summary" &&
              rowB.original.customer != "Summary"
              ? rowA.getValue(columnId).localeCompare(rowB.getValue(columnId))
              : "";
          },
          Cell: ({ cell }) => (
            <div
              title={cell.getValue()}
              style={{ textAlign: "left" }}
              className={
                key == "salesPartner" ||
                key == "CSLPartner" ||
                key == "delPartner"
                  ? "expandable-column ellipsis"
                  : "noramalCols ellipsis"
              }
            >
              {cell.getValue()}
            </div>
          ),
        };
        updatedColumns.push(colObj);
      }
    });
    setColumns(updatedColumns);
    setInitialHiddenCols(updatedInitialHiddenCols);
  };
  useEffect(() => {
    dataPR[0] && setHeaderData(JSON.parse(JSON.stringify(dataPR[0])));
  }, [dataPR]);
  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          data-toggle="tooltip"
          title={data.project}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };
  const probTemplate = (data) => {
    return (
      <>
        <div style={{ textAlign: "right" }}>
          {data.probability} {"%"}
        </div>
      </>
    );
  };

  const amountTemplate = (data) => {
    let formattedAmount = String(data.amount).split(".")[0];

    // Add commas for every three digits
    formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ textAlign: "left" }}>{"$"}</div>
        <div style={{ textAlign: "right" }}>{formattedAmount}</div>
      </div>
    );
  };
  const accountTemp = (data) => {
    return <div style={{ textAlign: "center" }}>{data.customer}</div>;
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "project"
            ? LinkTemplate
            : col == "probability"
            ? probTemplate
            : col == "amount"
            ? amountTemplate
            : col == "customer"
            ? accountTemp
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  return (
    <>
      {rows && (
        <div className="materialReactExpandableTable darkHeader toHead timesheetTable compareTable PAC-FPR-Table">
          {tableData.length > 0 && reportRunId != 0 && (
            // (viewTable || planTable || actualTable || compareTable) &&
            <>
              <div className="FPR-screen-note">
                <span>
                  <IoMdInformationCircleOutline />
                  {/* <i className="icon-information-white"></i> */}
                  For updating DP/CSL information, navigate to Customer Edit
                  screen
                </span>
              </div>
              <div className="FPR-Excel-icon-container">
                <RiFileExcel2Line
                  size="1.5em"
                  title="Export to Excel"
                  style={{ color: "green" }}
                  cursor="pointer"
                  onClick={() => {
                    exportExcel();
                  }}
                />
              </div>
            </>
          )}
          {rows.length > 1 ? (
            <MaterialReactTable
              enableExpanding={false}
              enableStickyHeader
              enablePagination={true}
              enableBottomToolbar={true}
              enableColumnFilterModes={false}
              enableDensityToggle={false}
              enableColumnActions={false}
              enableFullScreenToggle={false}
              enableHiding={false}
              enableGlobalFilter={true}
              filterFromLeafRows //apply filtering to all rows instead of just parent rows
              enableSorting={true}
              initialState={{
                pagination: { pageSize: 25 },
                showGlobalFilter: true,
                expanded: false,
                density: "compact",
                columnVisibility: {
                  salesPartner: false,
                  CSLPartner: false,
                  delPartner: false,
                },
                enablePinning: true,
              }} //expand all rows by default
              state={{
                columnVisibility: {
                  ...initialHiddenCols,
                },
              }}
              // defaultColumn={{ minSize: 10, maxSize: 100, size: 10 }} //units are in px
              localization={{
                noRecordsToDisplay: (
                  <span style={{ fontWeight: "bold" }}>No records found</span>
                ),
              }}
              muiTableContainerProps={{
                sx: {
                  maxHeight: `${maxHeight}px`,
                },
              }}
              muiSearchTextFieldProps={{
                placeholder: `Search `,
                sx: { minWidth: "200px" },
                variant: "outlined",
              }}
              columns={columns}
              data={rows}
            />
          ) : (
            <MaterialReactTable
              enableExpanding={false}
              enableStickyHeader
              enablePagination={true}
              enableBottomToolbar={true}
              enableColumnFilterModes={false}
              enableDensityToggle={false}
              enableColumnActions={false}
              enableFullScreenToggle={false}
              enableHiding={false}
              enableGlobalFilter={true}
              filterFromLeafRows //apply filtering to all rows instead of just parent rows
              enableSorting={true}
              initialState={{
                pagination: { pageSize: 25 },
                showGlobalFilter: true,
                expanded: false,
                density: "compact",
                columnVisibility: {
                  salesPartner: false,
                  CSLPartner: false,
                  delPartner: false,
                },
                enablePinning: true,
              }} //expand all rows by default
              state={{
                columnVisibility: {
                  ...initialHiddenCols,
                },
              }}
              // defaultColumn={{ minSize: 10, maxSize: 100, size: 10 }} //units are in px
              localization={{
                noRecordsToDisplay: (
                  <span style={{ fontWeight: "bold" }}>No records found</span>
                ),
              }}
              muiTableContainerProps={{
                sx: {
                  maxHeight: `${maxHeight}px`,
                },
              }}
              muiSearchTextFieldProps={{
                placeholder: `Search `,
                sx: { minWidth: "200px" },
                variant: "outlined",
              }}
              columns={columns}
              data={[]}
            />
          )}
        </div>
      )}
      {showPRFlag && (
        <div>
          <span>
            Planned Revenue For {newMonth}-{year}
          </span>
          <div className="darkHeader toHead secondTable">
            <PlRevTable
              data={dataPR}
              rows={row}
              linkColumns={linkColumns}
              linkColumnsRoutes={linkColumnsRoutes}
              dynamicColumns={dynamicColumns}
              headerData={headerData}
              servicesPayload={servicesPayload}
              setHeaderData={setHeaderData}
            />
          </div>
        </div>
      )}
      {goalsPopup && (
        <FPRGoalsandNotes
          goalsPopup={goalsPopup}
          setGoalsPopup={setGoalsPopup}
          goalData={goalData}
          setGoalData={setGoalData}
          noteData={noteData}
          servicesPayload={servicesPayload}
          setNoteData={setNoteData}
        />
      )}
    </>
  );
};
