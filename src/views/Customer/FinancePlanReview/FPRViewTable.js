import React, { useEffect, useState } from "react";
import MaterialReactTable from "material-react-table";
// import prDataMonthly from "./MonthlyPRData";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { IoMdInformationCircleOutline } from "react-icons/io";

import { environment } from "../../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import moment from "moment";
import { FaInfoCircle } from "react-icons/fa";
import { Column } from "primereact/column";
// import CellRendererPrimeReactDataTable from "../../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Link } from "react-router-dom";
import PlRevTable from "./PlRevTable";
import "./FPRViewTable.scss";
import { RiFileExcel2Line } from "react-icons/ri";
import useDynamicMaxHeight from "../../PrimeReactTableComponent/useDynamicMaxHeight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

export const FPRViewTable = (props) => {
  const { tableData, reportRunId, exportExcel, servicesPayload } = props;

  const baseUrl = environment.baseUrl;

  const [data, setData] = useState();
  const [dataPR, setDataPR] = useState([{}]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [columnsPR, setColumnsPR] = useState([]);
  const [rowsPR, setRowsPR] = useState([]);
  const [showPRFlag, setShowPRFlag] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);

  let row = 25;

  useEffect(() => {
    const updatedData = [...tableData];

    const objIndex = tableData.findIndex(
      (obj) => obj.name === "CSL/Account/Country/Resource Type^&1^&1"
    );

    // If the object is found, update its name
    if (objIndex !== -1) {
      // const updatedData = [...tableData];
      updatedData[objIndex].name = "CSL/Account/Country/Resource Type";
      // Set the state with the updated data
      // setData(updatedData); // Assuming setData is a function to update the state
    }
    if (tableData) setData(updatedData);
  }, [tableData]);

  const materialTableElement = document.getElementsByClassName(
    "materialReactExpandableTable darkHeader toHead timesheetTable financial-viewTable"
  );

  const maxHeight = useDynamicMaxHeight(materialTableElement) - 58;

  useEffect(() => {
    if (data) {
      defineColumns();
      defineRows();
    }
  }, [data]);

  useEffect(() => {
    if (dataPR) {
      defineColumnsPR();
      defineRowsPR();
    }
  }, [dataPR]);

  const defineColumnsPR = () => {
    const columnsObject = dataPR[0];
    const updatedColumnsPR = [];
    Object.entries(columnsObject).forEach(([prop, value]) => {
      if (prop != "id") {
        let newObject = {
          id: uuidv4(),
          header: value,
          accessorKey: prop,
        };
        updatedColumnsPR.push(newObject);
      }
    });
    setColumnsPR(updatedColumnsPR);
  };

  const defineRowsPR = () => {
    const updatedRowsPR = dataPR.slice(1);
    setRowsPR(updatedRowsPR);
  };

  const numberWithCommas = (x) => {
    var number = String(x);

    if (number.includes(".")) {
      var decimalNumbers = number;
      var num = Number(decimalNumbers);
      let FdN = num != null && num.toFixed(2);
      let final = FdN.split(".");
      final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");
      return final.join(".");
    } else {
      // Add ".00" to non-decimal values
      return number != null
        ? number.replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",") + ".00"
        : "";
    }
  };

  const number = 198600;
  const formattedNumber = number.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  console.log(formattedNumber); // Output: 1,98,600.00

  const cleanNumericValue = (value) => {
    // Remove commas from the value and convert it to an integer
    return parseInt(value.replace(/,/g, ""), 10);
  };
  const getAccountPlanRevenue = (row, key) => {
    let month = key.split("_").slice(0, 3);
    month = month.join("-");

    const date = new Date(key.split("_")[0], key.split("_")[1] - 1, 1);
    // Get the month name from the Date object
    setMonth(date.toLocaleString("default", { month: "short" }));
    setYear(key.split("_")[0]);
    const postData = {
      month: month,
      customerId: cleanNumericValue(row.customerId.props.children[1]),
      countryId: cleanNumericValue(row.countryId.props.children[1]),
      reportRunId: reportRunId,
      userType: row.userType,
      cslId: cleanNumericValue(row.CSLPartnerId.props.children[1]),
      measureType: "plRev",
      isQrtr: "0",
      option: "view",
    };

    axios({
      method: "POST",
      url:
        baseUrl + `/customersms/financialPlanandReview/getAccountPlanRevenue`,
      data: postData,
    }).then((response) => {
      const GetData = response.data?.filter((d) => d.id != -1);
      let dataHeader = [
        {
          project: "Project",
          csl: "Start Date",
          start_dt: "End Date",
          end_dt: "CSL",
          customer: "Account",
          country: "Country",
          revenue: "Revenue",
        },
      ];

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
  console.log(data);
  const defineColumns = () => {
    const headersObj = data?.find((obj) => obj.id == -2);
    console.log(headersObj, "headersObj");
    const subHeaderObj = data?.find((obj) => obj.id == -1);
    console.log(subHeaderObj, "subHeaderObj");

    const myHeaderMap = new Map();

    Object.entries(headersObj)?.forEach(([key, value]) => {
      if (value?.toString().includes("^")) {
        const myKeyArray = key.split("_");
        console.log(myKeyArray, "myjetArrr");

        let myKey = null;
        let myValue = null;
        if (myKeyArray.length > 1) {
          myKeyArray.pop();
          myKey = myKeyArray.join("_");
          myValue = value.split("^")[0];
          console.log(myValue, "myValue");
        } else if (myKeyArray.includes("name")) {
          myKey = myKeyArray[0];
          myValue = value.split("^")[0];
          console.log(myValue, "myValue in else if");
        } else {
          myKey = myKeyArray[0];
          myValue = value.split(" ")[0];
          // console.log(myValue, "myValue in else");
        }

        myHeaderMap.set(myKey, myValue);
      }
    });
    console.log(myHeaderMap);
    const updatedColumns = [];
    // debugger;
    myHeaderMap?.forEach((value, key, index) => {
      let newObject = null;

      if (key != "name") {
        const headerColumns = [];
        const subHeaderKeys = Object.keys(subHeaderObj).filter((obj) =>
          obj.includes(key)
        );
        subHeaderKeys.forEach((k, index) => {
          let obj = {
            id: uuidv4(),
            accessorKey: k,
            header: subHeaderObj[k],
            enableSorting: true,
            sortingFn: (rowB, rowA, columnId) => {
              const numericValueRowB = parseFloat(
                rowB.original[k].props.title.replace(/,/g, "")
              );
              const numericValueRowA = parseFloat(
                rowA.original[k].props.title.replace(/,/g, "")
              );
              return rowA.id !== "0" && rowB.id !== "1"
                ? numericValueRowB - numericValueRowA
                : 0;
            },
          };
          headerColumns.push(obj);
        });

        newObject = {
          id: uuidv4(),
          header: value,
          accessorKey: key,
          columns: headerColumns,
          enableSorting: true,
          sortingFn: (rowB, rowA, columnId) => {
            const numericValueRowB = parseFloat(
              rowB.original[k].props.title.replace(/,/g, "")
            );
            const numericValueRowA = parseFloat(
              rowA.original[k].props.title.replace(/,/g, "")
            );
            return rowA.id !== "0" && rowB.id !== "1"
              ? numericValueRowB - numericValueRowA
              : 0;
          },
        };
      } else {
        newObject = {
          id: uuidv4(),
          header: value,
          accessorKey: key,
          enableSorting: true,
          sortingFn: (rowB, rowA, columnId) => {
            return rowA.id != "0" && rowB.id != "1"
              ? rowA.getValue(columnId).localeCompare(rowB.getValue(columnId))
              : "";
          },
        };
      }
      updatedColumns.push(newObject);
    });
    setColumns(updatedColumns);
    console.log(updatedColumns);
  };
  // const value = 192300;
  // const formattedValue = value.toLocaleString("en-IN", {
  //   maximumFractionDigits: 2,
  //   style: "currency",
  //   currency: "INR",
  // });

  // console.log(formattedValue); // Output: ₹1,92,300.00

  const defineRows = () => {
    const rowData = data?.slice(3);
    const mainRows = rowData?.filter((obj) => obj.lvl == 0 || obj.lvl == 1);
    const mainRowChildren = new Map();
    mainRows?.forEach((row) => {
      const filteredRows = rowData.filter(
        (obj) => obj.CSLPartnerId == row.CSLPartnerId && obj.lvl != 1
      );
      const levelTwoRows = filteredRows.filter((obj) => obj.lvl == 2);
      const levelThreeRows = filteredRows.filter((obj) => obj.lvl == 3);
      const levelFourRows = filteredRows.filter((obj) => obj.lvl == 4);

      //Adding children for levelthree rows if any
      levelThreeRows.map((row) => {
        const children = levelFourRows.filter(
          (obj) => obj.parentAttr == row.keyAttr
        );
        row["subRows"] = children;
      });

      //Adding children for leveltwo rows if any
      levelTwoRows.map((row) => {
        const children = levelThreeRows.filter(
          (obj) => obj.parentAttr == row.keyAttr
        );
        row["subRows"] = children;
      });

      //Adding children for levelone rows if any

      const children = levelTwoRows.filter(
        (obj) => obj.parentAttr == row.keyAttr
      );
      row["subRows"] = children;

      mainRowChildren.set(row.id, filteredRows);
    });

    // Create a function to process rows and their children recursively

    const processRows = (rows) => {
      for (const row of rows) {
        for (const key in row) {
          const value = row[key];
          if (
            row.id?.props?.children[1] != 0.0 &&
            key.includes("_") &&
            key.split("_")[3] == "plRev" &&
            value != 0
          ) {
            const link = (
              <a
                className={
                  "lvl:" +
                  cleanNumericValue(row.lvl.props.children[1]) +
                  " " +
                  (key.split("_")[1] % 2 == 0 ? "even" : "odd")
                }
                onClick={() => {
                  getAccountPlanRevenue(row, key);
                  setShowPRFlag(true);
                }}
                title={numberWithCommas(value)}
              >
                {/* {numberWithCommas(value)} */}
                {Number(value).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
                {/* {value.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })} */}
              </a>
            );
            // Update the value in the row with the link
            row[key] = link;
          } else if (
            (row.id?.props?.children[1] != 0.0 &&
              key.includes("_") &&
              value != 0 &&
              key.split("_")[3] == "sfRev") ||
            (row.id?.props?.children[1] != 0.0 &&
              key.includes("_") &&
              value != 0 &&
              key.split("_")[3] == "sfPipeRev") ||
            (row.id?.props?.children[1] != 0.0 &&
              key.includes("_") &&
              value != 0 &&
              key.split("_")[3] == "recRev")
          ) {
            const link = (
              <a
                className={
                  "lvl:" +
                  cleanNumericValue(row.lvl.props.children[1]) +
                  " " +
                  (key.split("_")[1] % 2 == 0 ? "even" : "odd")
                }
                onClick={() => {
                  getAccountPlanRevenue(row, key);
                  showPRFlag(true);
                }}
                title={numberWithCommas(value)}
              >
                {/* {numberWithCommas(value)} */}
                {Number(value).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </a>
            );
            // Update the value in the row with the link
            row[key] = link;
          } else if (!isNaN(parseFloat(value))) {
            // Process other numeric values (if they can be parsed to a number)
            const numeric = (
              <div
                className={
                  "lvl:" +
                  row.lvl.toString() +
                  " " +
                  (key.split("_")[0] == "total"
                    ? "total"
                    : key.split("_")[1] % 2 == 0
                    ? "even"
                    : "odd")
                }
                title={numberWithCommas(parseFloat(value))}
              >
                {" "}
                {/* {numberWithCommas(parseFloat(value))} */}
                {Number(value).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </div>
            );
            row[key] = numeric; // Parse to number before formatting
          } else if (key == "name") {
            console.log(value);
            const hiarachy = (
              <div
                className={
                  row?.lvl == 1
                    ? "cslLevel"
                    : row?.lvl == 2
                    ? "accountLevel"
                    : row?.lvl == 3
                    ? "countryLevel"
                    : row?.lvl == 4 && "resourceLevel"
                }
                title={value}
              >
                {" "}
                {value}{" "}
              </div>
            );
            row[key] = hiarachy; // Parse to number before formatting
          }
        }

        // Recursively process child rows
        if (row.subRows && row.subRows.length > 0) {
          processRows(row.subRows);
        }
      }
    };

    // Apply link creation logic to the mainRows and their children
    processRows(mainRows);
    setRows(mainRows);
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
  const probTemplate = (data) => {
    return (
      <>
        <div style={{ textAlign: "right" }}>
          {data.probability} {"%"}
        </div>
      </>
    );
  };

  const revenueTemp = (data) => {
    let formattedAmount = String(data.revenue).split(".")[0];

    // Add commas for every three digits
    formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ textAlign: "left" }}>{"$"}</div>
        <div style={{ textAlign: "right" }}>{formattedAmount}</div>
      </div>
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
            : col == "revenue"
            ? revenueTemp
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    dataPR[0] && setHeaderData(JSON.parse(JSON.stringify(dataPR[0])));
  }, [dataPR]);

  return (
    <>
      <div className="materialReactExpandableTable darkHeader toHead timesheetTable financial-viewTable">
        {tableData.length > 0 && reportRunId != 0 && (
          // (viewTable || planTable || actualTable || compareTable) &&
          <>
            <div className="FPR-screen-note" style={{ marginBottom: "-5px" }}>
              <span>
                <IoMdInformationCircleOutline />
                {/* <i className="icon-information-white"></i> */}
                For updating DP/CSL information, navigate to Customer Edit
                screen
              </span>
            </div>
            <div className="FPR_view-excel-icon-container">
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
            enableExpanding
            // enableStickyHeader
            enablePagination={true}
            enableBottomToolbar={true}
            enableColumnFilterModes={false}
            enableDensityToggle={false}
            enableColumnActions={false}
            enableFilters={false}
            enableTopToolbar={false}
            enableFullScreenToggle={false}
            enableHiding={false}
            filterFromLeafRows //apply filtering to all rows instead of just parent rows
            initialState={{
              pagination: { pageSize: 25 },
              expanded: false,
              density: "compact",
              enablePinning: true,
            }} //expand all rows by default
            defaultColumn={{ minSize: 40, maxSize: 120, size: 80 }} //units are in px
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
            muiTableBodyProps={{
              sx: {
                "& td": {
                  height: "22px",
                  padding: "0px 5px",
                },
              },
            }}
            columns={columns}
            data={rows}
          />
        ) : (
          <MaterialReactTable
            enableExpanding
            // enableStickyHeader
            enablePagination={true}
            enableBottomToolbar={true}
            enableColumnFilterModes={false}
            enableDensityToggle={false}
            enableColumnActions={false}
            enableFilters={false}
            enableTopToolbar={false}
            enableFullScreenToggle={false}
            enableHiding={false}
            filterFromLeafRows //apply filtering to all rows instead of just parent rows
            initialState={{
              pagination: { pageSize: 25 },
              expanded: false,
              density: "compact",
              enablePinning: true,
            }} //expand all rows by default
            defaultColumn={{ minSize: 40, maxSize: 120, size: 80 }} //units are in px
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
            muiTableBodyProps={{
              sx: {
                "& td": {
                  height: "22px",
                  padding: "0px 5px",
                },
              },
            }}
            columns={columns}
            data={[]}
          />
        )}
      </div>

      {showPRFlag && (
        <div>
          <span>
            Planned Revenue For {month}-{year}
          </span>
          <div className="darkHeader toHead secondTable">
            <PlRevTable
              data={dataPR}
              rows={row}
              linkColumns={linkColumns}
              linkColumnsRoutes={linkColumnsRoutes}
              dynamicColumns={dynamicColumns}
              servicesPayload={servicesPayload}
              headerData={headerData}
              setHeaderData={setHeaderData}
            />
          </div>
        </div>
      )}
    </>
  );
};
