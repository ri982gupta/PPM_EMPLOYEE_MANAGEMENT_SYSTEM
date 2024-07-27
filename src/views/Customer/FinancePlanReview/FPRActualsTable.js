import React, { useEffect, useState } from "react";
import MaterialReactTable from "material-react-table";
// import { v4 as uuidv4 } from "uuid";
import { Button } from "bootstrap";
import { Box, IconButton } from "@mui/material";
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import FPRGoalsandNotes from "./FPRGoalsandNotes";
import axios from "axios";
import { environment } from "../../../environments/environment";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoMdInformationCircleOutline } from "react-icons/io";
import moment from "moment";

// import PlRevTable
import PlRevTable from "./PlRevTable";
import { Column } from "primereact/column";

import useDynamicMaxHeight from "../../PrimeReactTableComponent/useDynamicMaxHeight";
import { Link } from "react-router-dom";

export const FPRActualsTable = (props) => {
  const {
    tableData,
    reportRunId,
    servicesPayload,
    goalsPopup,
    setGoalsPopup,
    exportExcel,
  } = props;
  const [columns, setColumns] = useState([]);
  let row = 25;
  const [headerData, setHeaderData] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [dataPR, setDataPR] = useState([{}]);
  const [showPRFlag, setShowPRFlag] = useState(false);
  const [newMonth, setNewMonth] = useState([]);

  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [rows, setRows] = useState([]);
  const [initialHiddenCols, setInitialHiddenCols] = useState({});
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [initialHiddenColsTwo, setInitialHiddenColsTwo] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [colExpFlagOne, setColumnExpFlagOne] = useState(false);
  const [colExpFlagTwo, setColumnExpFlagTwo] = useState(false);
  const [colExpFlagThree, setColumnExpFlagThree] = useState(false);
  const [colExpFlagFour, setColumnExpFlagFour] = useState(false);
  // const [check, setChek] = useState(false);
  const [goalData, setGoalData] = useState();
  const [noteData, setNoteData] = useState();
  const [colId, setColumnId] = useState("");
  const baseUrl = environment.baseUrl;
  console.log(showPRFlag);
  // ===================useEffect start=====================

  // console.log(tableData, 'tableData');

  useEffect(() => {
    if (tableData) {
      defineColumns();
    }
  }, [tableData]);

  const materialTableElement = document.getElementsByClassName(
    "materialReactExpandableTable darkHeader toHead timesheetTable actualTable PAC-FPR-Table"
  );

  const maxHeight = useDynamicMaxHeight(materialTableElement) - 94;

  useEffect(() => {
    if (colId != "") {
      if (
        (colExpFlag == false && colId == "customer") ||
        (colId?.includes("Q1") && colExpFlagOne == true) ||
        (colId?.includes("Q2") && colExpFlagTwo == true) ||
        (colId?.includes("Q3") && colExpFlagThree == true) ||
        (colId?.includes("Q4") && colExpFlagFour == true)
      ) {
        expandT();
      } else {
        expandF();
      }
      defineColumnsTwo();
    }
  }, [
    colExpFlag,
    colExpFlagOne,
    colExpFlagTwo,
    colExpFlagThree,
    colExpFlagFour,
  ]);
  const getAccountPlanRevenue = (row, key) => {
    let month = key.split("_").slice(0, 3);
    month = month.join("-");
    // Extracting year using regular expression
    console.log(row);
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
    const NewmeasureType = key.split("_")[2].split("^")[0];
    console.log(NewmeasureType);
    console.log("Year:", year);
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
      cslId: row.CSLPartnerId == null ? "0" : row.CSLPartnerId,
      measureType: NewmeasureType == "rev2024" ? "rev" : NewmeasureType,
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
      let dataHeader;
      if (NewmeasureType == "rev2024") {
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

  const expandT = () => {
    count++;
    let finalHiddenCols = {};
    if (colId == "customer") {
      let filteredKeys = Object.keys(initialHiddenCols).filter((key) => {
        return (
          key != "salesPartner" && key != "delPartner" && key != "CSLPartner"
        );
      });
      filteredKeys.forEach((key) => {
        finalHiddenCols[key] = initialHiddenCols[key];
      });
      setInitialHiddenCols(finalHiddenCols);
    } else {
      let parts = colId.split("_");
      parts.pop();
      let resultString = parts.join("_");
      let filteredKeys = Object.keys(initialHiddenCols).filter(
        (key) => !key.includes(resultString)
      );
      filteredKeys.forEach((key) => {
        finalHiddenCols[key] = initialHiddenCols[key];
      });
      setInitialHiddenCols(finalHiddenCols);
    }
  };
  const expandF = () => {
    countNw++;
    let finalHiddenCols = {};
    let tempHiddenCols = {};
    if (colId == "customer") {
      count++;
      finalHiddenCols = { ...initialHiddenColsTwo, ...initialHiddenCols };
      setInitialHiddenCols(finalHiddenCols);
    } else {
      let parts = colId.split("_");
      parts.pop();
      let resultString = parts.join("_");
      let filteredKeys = Object.keys(hiddenColumns).filter((key) =>
        key.includes(resultString)
      );
      filteredKeys.forEach((key) => {
        tempHiddenCols[key] = hiddenColumns[key];
      });
      finalHiddenCols = { ...initialHiddenCols, ...tempHiddenCols };
      setInitialHiddenCols(finalHiddenCols);
    }
  };

  // // =====================useEffect end=========================
  var count = 0;
  var countNw = 0;
  const defineColumns = () => {
    const updatedInitialHiddenCols = {};
    const fprCompareDataCopy = [...tableData];
    const columnsDetails = fprCompareDataCopy.slice(0, 3);
    // console.log(fprCompareDataCopy.slice(4), "fprCompareDataCopy.slice(4)");
    setRows(fprCompareDataCopy.slice(3));
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

    const levelThreeSubH = columnsDetails[2];
    const updatedColumns = [];
    const goalsButtonCol = {
      id: "Goals",
      header: "Goals",
      Header: () => <div className="mixerCustom">Goals</div>,
      Cell: ({ cell }) =>
        cell.row.original.id != 0 && (
          <div className="normalCols ">
            <button
              className="btn "
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
    let hiddenHeaders = [];
    let initialHiddenHeaders = [];
    myHeaderMap.forEach((value, key) => {
      if (key.includes("_")) {
        const searchKeyArray = key.split("_");
        searchKeyArray.pop();
        const searchKey = searchKeyArray.join("_");
        const filteredSubHeadKeys = Object.keys(levelThreeSubH).filter((k) =>
          k.includes(searchKey)
        );
        const levelThreeCols = [];
        filteredSubHeadKeys.forEach((subhead) => {
          const searchValue = value.split("^&");
          let lastPart = searchValue[searchValue.length - 1];
          let subheadNw = subhead + lastPart;
          !subhead.toString().includes("Q") &&
          !subhead.toString().includes("total")
            ? initialHiddenHeaders.push({ [subheadNw]: false })
            : "";
          let colObj = {
            id: subheadNw,
            header: levelThreeSubH[subhead],
            accessorKey: subhead,
            enableHiding: true,
            enableSorting: true,
            sortingFn: (rowB, rowA, columnId) => {
              return rowA.id != "0" && rowB.id != "1"
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
                {!cell.column.id.includes("_cm") &&
                !cell.column.id.includes("_gm") &&
                !cell.column.id.includes("total") &&
                cell.getValue() != 0 &&
                cell.row.original.id != 0 ? (
                  <Link
                    data-toggle="tooltip"
                    title={parseInt(cell.getValue()).toLocaleString("en-US")}
                    // to={`/vendor/vendorDoc/:${}`}
                    // to={`/vendor/vendorDoc/:${cell.row.original.vendorId}`}
                    onClick={() => {
                      // console.log(key.split("_")[1], "key.split[2]");
                      getAccountPlanRevenue(cell.row.original, cell.column.id);
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
          levelThreeCols.push(colObj);
        });
        const mainCol = {
          id: key,
          header: value.split("^&")[0],
          accessorKey: key,
          columns: levelThreeCols,
          Header: ({ column }) => (
            <div>
              <span className="" title={value.split("^&")[0]}>
                {value.split("^&")[0]}
              </span>
              {/* {value}{" "} */}
              {key.toString().includes("Q") ? (
                <span
                  title={value.split("^&")[0]}
                  className={key == colId ? `expandIcon ${expandClass}` : ""}
                >
                  <IconButton
                    onClick={() => {
                      column.id.includes("Q1")
                        ? setColumnExpFlagOne((prev) => !prev)
                        : column.id.includes("Q2")
                        ? setColumnExpFlagTwo((prev) => !prev)
                        : column.id.includes("Q3")
                        ? setColumnExpFlagThree((prev) => !prev)
                        : column.id.includes("Q4")
                        ? setColumnExpFlagFour((prev) => !prev)
                        : "";
                      setColumnId(column.id);
                    }}
                  >
                    <AiFillRightCircle size="0.7em"/>
                  </IconButton>
                </span>
              ) : null}
            </div>
          ),
        };
        updatedColumns.push(mainCol);
      } else {
        if (
          key == "salesPartner" ||
          key == "CSLPartner" ||
          key == "delPartner"
        ) {
          hiddenHeaders.push({ [key]: false });
        }
        let colObj = {
          id: key,
          header: value.split("^&")[0],
          accessorKey: key,
          enableColumnActions: false,
          enableHiding: true,
          Header: ({ column }) => (
            <div
              className={
                key == "salesPartner" ||
                key == "CSLPartner" ||
                key == "delPartner"
                  ? "expandable-column mixerCustom"
                  : "mixerCustom"
              }
            >
              <span>
                {/* {console.log(value.split("^&")[0], "---title")} */}
                {value.split("^&")[0]}
              </span>
              {key == "customer" ? (
                <span>
                  <IconButton
                    onClick={() => {
                      setColumnExpFlag((prev) => !prev);
                      setColumnId(column.id);
                    }}
                  >
                    <AiFillLeftCircle size="0.7em"/>
                  </IconButton>
                </span>
              ) : null}
            </div>
          ),
          enableSorting: true,
          sortingFn: (rowB, rowA, columnId) => {
            return rowA.id != "0" && rowB.id != "1"
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
              {cell.row.original.id == 0 && key == "class"
                ? ""
                : cell.getValue()}
            </div>
          ),
        };
        updatedColumns.push(colObj);
      }
    });

    setColumns(updatedColumns);
    setInitialHiddenCols(Object.assign({}, ...initialHiddenHeaders));
    setInitialHiddenColsTwo(Object.assign({}, ...hiddenHeaders));
    setHiddenColumns(
      Object.assign({}, ...hiddenHeaders, ...initialHiddenHeaders)
    );
  };

  const defineColumnsTwo = () => {
    let expandClass = "";
    if (
      (colExpFlag == true ||
        colExpFlagOne == true ||
        colExpFlagTwo == true ||
        colExpFlagThree == true ||
        colExpFlagFour == true) &&
      count > 0
    ) {
      expandClass = "expanded";
    } else {
      expandClass = "";
    }

    setColumns((prevData) => {
      const updatedColumnsTwo = [...prevData];
      const index = updatedColumnsTwo.findIndex(
        (obj) => obj.accessorKey === colId
      );
      const updatedObject =
        colId == "customer"
          ? {
              ...updatedColumnsTwo[index],
              Header: ({ column }) => (
                <div>
                  <span className="mixerCustom">
                    {updatedColumnsTwo[index].header}
                  </span>
                  <span >
                    <IconButton
                      onClick={() => {
                        setColumnExpFlag((prev) => !prev);
                        setColumnId(column.id);
                      }}
                    >
                      <AiFillLeftCircle size="0.7em"/>
                    </IconButton>
                  </span>
                </div>
              ),
            }
          : {
              ...updatedColumnsTwo[index],
              Header: ({ column }) => (
                <div>
                  <span className="afridi">
                    {updatedColumnsTwo[index].header}
                  </span>
                  <span className={`expandIcon ${expandClass}`}>
                    <IconButton
                      onClick={() => {
                        column.id.includes("Q1")
                          ? setColumnExpFlagOne((prev) => !prev)
                          : column.id.includes("Q2")
                          ? setColumnExpFlagTwo((prev) => !prev)
                          : column.id.includes("Q3")
                          ? setColumnExpFlagThree((prev) => !prev)
                          : column.id.includes("Q4")
                          ? setColumnExpFlagFour((prev) => !prev)
                          : "";
                        setColumnId(column.id);
                      }}
                    >
                      <AiFillRightCircle size="0.7em"/>
                    </IconButton>
                  </span>
                </div>
              ),
            };
      updatedColumnsTwo[index] = { ...updatedObject };
      return updatedColumnsTwo;
    });
  };

  // console.log(hiddenColumns, 'hiddenColumns');
  // console.log(initialHiddenCols, 'initialHiddenCols');
  useEffect(() => {
    dataPR[0] && setHeaderData(JSON.parse(JSON.stringify(dataPR[0])));
  }, [dataPR]);
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
        <div className="materialReactExpandableTable darkHeader toHead timesheetTable actualTable PAC-FPR-Table">
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
              enableHiding={false}
              // enableFilters
              enableFullScreenToggle={false}
              enableGlobalFilter={true}
              enableTopToolbar={true}
              filterFromLeafRows //apply filtering to all rows instead of just parent rows
              //expand all rows by default

              // defaultColumn={{ minSize: 10, maxSize: 100, size: 10 }} //units are in px
              // localization={{
              //     noRecordsToDisplay: (
              //         <span style={{ fontWeight: "bold" }}>No records found</span>
              //     ),
              // }}
              // muiTableContainerProps={{
              //     sx: {
              //         maxHeight: rows.length === 0 ? "30vh" : "60vh", // Adjust the maxHeight value as needed
              //         width: "auto",
              //         maxWidth: "fit-content",
              //         marginBottom: "10px",
              //     },
              // }}
              muiTableContainerProps={{
                sx: {
                  maxHeight: `${maxHeight}px`,
                },
              }}
              initialState={{
                pagination: { pageSize: 25 },
                showGlobalFilter: true,
                expanded: false,
                density: "compact",
                columnVisibility: {
                  ...initialHiddenCols,
                },
                enablePinning: true,
              }}
              // positionGlobalFilter="left"
              paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
              state={{
                columnVisibility: {
                  ...initialHiddenCols,
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
              enableHiding={false}
              // enableFilters
              enableFullScreenToggle={false}
              enableGlobalFilter={true}
              enableTopToolbar={true}
              filterFromLeafRows //apply filtering to all rows instead of just parent rows
              //expand all rows by default

              // defaultColumn={{ minSize: 10, maxSize: 100, size: 10 }} //units are in px
              localization={{
                noRecordsToDisplay: (
                  <span style={{ fontWeight: "bold" }}>No records found</span>
                ),
              }}
              // muiTableContainerProps={{
              //     sx: {
              //         maxHeight: rows.length === 0 ? "30vh" : "60vh", // Adjust the maxHeight value as needed
              //         width: "auto",
              //         maxWidth: "fit-content",
              //         marginBottom: "10px",
              //     },
              // }}
              muiTableContainerProps={{
                sx: {
                  maxHeight: `${maxHeight}px`,
                },
              }}
              initialState={{
                pagination: { pageSize: 25 },
                showGlobalFilter: true,
                expanded: false,
                density: "compact",
                columnVisibility: {
                  ...initialHiddenCols,
                },
                enablePinning: true,
              }}
              // positionGlobalFilter="left"
              paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
              state={{
                columnVisibility: {
                  ...initialHiddenCols,
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
