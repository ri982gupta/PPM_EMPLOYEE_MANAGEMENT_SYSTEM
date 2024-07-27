import React, { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton } from "@mui/material";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { AiFillRightCircle } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import "./RevenueForecastBuTable.scss";
import RevenueForecastInfoPopUp from "./RevenueForecastInfoPopUp";
import { Link } from "react-router-dom";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

export default function MonthlyRevenueTable(props) {
  const icons = {
    Employee: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Employee"
      />
    ),
    Contractor: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Contractor"
      />
    ),
    fteActive: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Active Employee"
      />
    ),
    fteNotice: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px" }}
        title="Employee in notice period"
      />
    ),

    subkActive: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Active Contractor"
      />
    ),
    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px" }}
        title="Contractor in notice period"
      />
    ),
  };
  const { data, expandedCols, colExpandState, view, title } = props;
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [object, setObject] = useState({});
  const [infoPopUp, setInfoPopUp] = useState(false);
  const [iconName, setIconName] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const materialTableElement = document.getElementsByClassName(
    "materialReactExpandableTable revenueForecastBuTable-trend-by-region darkHeader"
  );

  const maxHeight = useDynamicMaxHeight(materialTableElement);

  useEffect(() => {}, [maxHeight]);

  const numberWithCommas = (x) => {
    var number = String(x);
    if (number.includes(".")) {
      if (number.includes(".00")) {
        var number = parseFloat(x);
        return number?.toLocaleString();
      } else {
        var decimalNumbers = number;
        var num = Number(decimalNumbers);
        let FdN = num != null && num?.toFixed(2);
        let final = FdN.split(".");
        final[0] = final[0]?.replace(/(\d)(?=(\d{2})+\d$)/g, "$1,");
        final[1] = final[1]?.replace(/(\d{3})(?=\d)/g, "$1,");

        return final.join(".");
      }
    } else {
      var number = parseFloat(x);
      return number?.toLocaleString();
    }
  };
  useEffect(() => {
    numberWithCommas(getData());
  }, [data]);

  useEffect(() => {
    setHeaders(object);
    setObject(object);
  }, [object]);

  const getData = () => {
    let tableData = data?.tableData;
    let columns = null;
    if (data?.columns?.includes("'")) {
      columns = data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.columns;
    }
    let colArr = columns?.split(",");
    let newHeaders = [];
    let hiddenHeaders = [];
    const obj1 = {};
    const obj = {};

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();
      let firstData = tableData[0];
      obj[colVal] = firstData[colVal];
    }
    let headerArray = Object.entries(obj);
    let filteredHeaders = headerArray.filter(
      ([key, value]) => typeof value === "string" && value.includes("^&")
    );

    filteredHeaders.forEach((d) => (obj1[d[1].split("^&")[0]] = d[0]));
    let newObject = Object.entries(obj1);

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let minusOneRow = tableData?.filter((d) => d.id == -1);
    newObject?.map(([key, value], index) => {
      newHeaders.push({
        accessorKey: value,
        header: key,
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => (
          <div
            className={
              value.includes("name")
                ? "mixer"
                : value.includes("rCount") || value.includes("working_days")
                ? "mixer"
                : ""
            }
            title={key}
          >
            {key}{" "}
            {value == colExpandState[2] ? (
              <IconButton
                onClick={() => {
                  setColumnExpFlag((prev) => !prev);
                }}
              >
                <AiFillRightCircle />
              </IconButton>
            ) : value.includes("name") ||
              value.includes("working_days") ||
              value.includes("rCount") ? (
              ""
            ) : (
              <FaInfoCircle
                className="tableInfoIcon"
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                  setIconName(key);
                  setInfoPopUp(true);
                }}
              >
                {""}
              </FaInfoCircle>
            )}
          </div>
        ),
      });
    });

    let subHeaders = minusOneRow ? Object.entries(minusOneRow[0]) : null;
    subHeaders?.sort();

    const revenueOrder = [
      "Revenue",
      "AssRevenue",
      "ActRevenue",
      "ApprRevenue",
      "RecRevenue",
    ];
    if (subHeaders !== null) {
      subHeaders = subHeaders.sort((a, b) => {
        const indexA = revenueOrder.indexOf(a[0]);
        const indexB = revenueOrder.indexOf(b[0]);
        return indexA - indexB;
      });
    }

    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let subArray = [];
      subHeaders.map(([key, value], index) => {
        let subkey = key.includes("GM")
          ? "GM"
          : key.includes("capacity") || key.includes("gross")
          ? "capacity"
          : key.includes("allocations")
          ? "allocations"
          : key.includes("billAlloc")
          ? "billAlloc"
          : key.includes("billAct")
          ? "billAct"
          : key.includes("billAss")
          ? "billAss"
          : key.includes("billAppr")
          ? "billAppr"
          : key.includes("Cost")
          ? "Cost"
          : key.includes("Revenue")
          ? "Revenue"
          : null;
        if (subkey != null) {
          if (data.accessorKey.includes(subkey)) {
            {
              let obj = {
                id: key,
                header:
                  value == null || value == 0 ? (
                    ""
                  ) : (
                    <div className="center-align">
                      {value == "PR (Bill+Ovrh)" ? (
                        <div title={"PR (Role)"}> {"PR (Role)"}</div>
                      ) : value == "RR" ? (
                        <div title={"RR (Role)"}> {"RR (Role)"}</div>
                      ) : (
                        <div title={value}> {value}</div>
                      )}
                    </div>
                  ),
                accessorKey: key,
                enableSorting: true,
                sortingFn: (rowB, rowA, columnId) => {
                  return rowA.id != "0" && rowB.id != "1"
                    ? rowB.getValue(columnId) - rowA.getValue(columnId)
                    : "";
                },
                Cell: ({ cell }) => {
                  return (
                    <span
                      className={
                        (key.includes("summary") ? "" : "") +
                        " " +
                        "lvl-" +
                        cell.row.original.lvl
                      }
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {cell.getValue() != null &&
                      (key.includes("Revenue") || key.includes("Cost")) ? (
                        <>
                          <div title={numberWithCommas(cell.getValue())}>
                            <span>
                              $
                              {cell.row.original.lvl == "2" ? (
                                <div style={{ float: "right" }}>
                                  {numberWithCommas(cell.getValue())}
                                </div>
                              ) : (
                                <b style={{ float: "right" }}>
                                  {numberWithCommas(cell.getValue())}
                                </b>
                              )}
                            </span>
                          </div>
                        </>
                      ) : cell.getValue() != null &&
                        (key.includes("GM") || key.includes("Perc")) ? (
                        <>
                          {cell.row.original.lvl == "2" ? (
                            <div
                              class="align right"
                              title={numberWithCommas(cell.getValue())}
                            >
                              {numberWithCommas(cell.getValue())} %
                            </div>
                          ) : (
                            <b
                              class="align right"
                              title={numberWithCommas(cell.getValue())}
                            >
                              {numberWithCommas(cell.getValue())} %
                            </b>
                          )}
                        </>
                      ) : cell.row.original.lvl == "2" ? (
                        <div
                          class="align right"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </div>
                      ) : (
                        <b
                          class="align right"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </b>
                      )}
                    </span>
                  );
                },
              };
              subArray.push(obj);
              newHeaders[i].columns = subArray;
            }
          }
        } else {
          if (data.accessorKey.includes(key)) {
            let obj = {
              id: key,
              header:
                value == null || value == 0 ? (
                  ""
                ) : (
                  <div
                  // className={
                  //   value.includes(null) ||
                  //   (value.includes("") && "nullCol" && "center-align")
                  // }
                  >
                    {value == "PR (Bill+Ovrh)" ? (
                      <div title={"PR (Role)"}> {"PR (Role)"}</div>
                    ) : value == "RR" ? (
                      <div title={"RR (Role)"}> {"RR (Role)"}</div>
                    ) : (
                      <div title={value}> {value}</div>
                    )}
                  </div>
                ),
              accessorKey: key,
              enableSorting: true,
              sortingFn: (rowB, rowA, columnId) => {
                const nameA = rowB.getValue(columnId).toLowerCase();
                const nameB = rowA.getValue(columnId).toLowerCase();
                return rowA.id != "0" && rowB.id != "1"
                  ? nameA.localeCompare(nameB)
                  : "";
              },
              Cell: ({ cell }) => {
                const originalDate = new Date(cell.row.original.month);
                const formattedDate = `${originalDate.toLocaleString(
                  "default",
                  {
                    month: "short",
                  }
                )}-${originalDate.getFullYear()}`;

                return (
                  <span
                    className={"lvl-" + cell.row.original.lvl}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight:
                        cell.row.original.lvl === "1" ? "bold" : "normal",
                    }}
                  >
                    {cell.row.original.lvl === "1" && key == "name" ? (
                      <span style={{ float: "left" }}>
                        {view === "month"
                          ? cell.row.original.month === " "
                            ? cell.row.original.name
                            : formattedDate
                          : "" || view === "region" || view === "customer"
                          ? cell.row.original.name
                          : ""}
                      </span>
                    ) : cell.row.original.lvl === "1" && key == "rCount" ? (
                      <span
                        style={{ float: "right" }}
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(cell.getValue())}
                      </span>
                    ) : cell.row.original.lvl === "1" &&
                      key == "working_days" ? (
                      <span
                        style={{ float: "right" }}
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(cell.getValue())}
                      </span>
                    ) : cell.row.original.lvl === "1" && key == "month" ? (
                      <span
                        style={{ float: "right" }}
                        title={new Date(cell.row.original.month)
                          .toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                          .replace(/\s/g, "-")
                          .replace(".", "")}
                      >
                        {new Date(cell.row.original.month)
                          .toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                          .replace(/\s/g, "-")
                          .replace(".", "")}
                      </span>
                    ) : (cell.row.original.lvl === "2" &&
                        cell.column.id === "name" &&
                        view == "region") ||
                      key == "month" ||
                      (view == "customer" && key != "rCount") ? (
                      <span
                        style={{ float: "left" }}
                        title={new Date(cell.row.original.month)
                          .toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                          .replace(/\s/g, "-")
                          .replace(".", "")}
                      >
                        {new Date(cell.row.original.month)
                          .toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                          .replace(/\s/g, "-")
                          .replace(".", "")}
                      </span>
                    ) : cell.row.original.lvl === "2" &&
                      cell.column.id === "name" ? (
                      <span
                        style={{ float: "left" }}
                        title={cell.row.original.name}
                      >
                        {cell.row.original.name}
                      </span>
                    ) : (
                      <span
                        style={{ float: "right" }}
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(cell.getValue())}
                      </span>
                    )}
                  </span>
                );
              },
            };
            newHeaders[i].columns = [obj];
          }
        }
      });
    });

    setColumns(newHeaders);
    let values = [];
    tableData?.map((d) => (d.id != -1 && d.id != -2 ? values.push(d) : ""));

    let convertedJsonToTree = jsonToTree(values, { children: "subRows" });
    setNodes(convertedJsonToTree);
  };

  useEffect(() => {
    colExpFlag ? setHiddenColumns({}) : colCollapse();
  }, [colExpFlag]);

  const colCollapse = () => {
    let hiddenHeaders = [];
    headers?.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));
  };

  const jsonToTree = (flatArray, options) => {
    options = {
      id: "uniqueId",
      parentId: "parentId",
      children: "subRows",
      ...options,
    };
    const dictionary = {};
    const tree = [];
    const children = options.children;
    flatArray?.forEach((node) => {
      const nodeId = node[options.id];
      const nodeParentId = node[options.parentId];
      dictionary[nodeId] = {
        [children]: [],
        ...node,
        ...dictionary[nodeId],
      };
      dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] };
      dictionary[nodeParentId][children].push(dictionary[nodeId]);
    });
    Object.values(dictionary).forEach((obj) => {
      if (typeof obj[options.id] === "undefined") {
        tree.push(...obj[children]);
      }
    });
    return tree;
  };

  // Assuming flatData is your data.tableData
  const flatData = data.tableData;
  const treeData = jsonToTree(flatData, {
    parentId: "parentId",
    children: "subRows",
  });

  // const initialSortingState = () => {
  //   let initialSortids = [];
  //   columns?.map((column) => {
  //     column?.columns.map((col) => {
  //       col.accessorKey.includes("Revenue")
  //         ? initialSortids.push({ id: col.accessorKey, desc: true })
  //         : "";
  //     });
  //   });
  //   return initialSortids;
  // };
  return (
    <div className="materialReactExpandableTable revenueForecastBuTable-trend-by-region darkHeader ">
      {nodes.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={true} //hide expand all double arrow in column header
          enableExpanding
          enablePagination={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            columnPinning: { right: ["total"] },
            // sorting: initialSortingState(),
          }} //expand all rows by default
          state={{ columnVisibility: { ...hiddenColumns } }}
          //paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
          defaultColumn={{ minSize: 40, maxSize: 1000, size: 80 }} //units are in px
          muiTableBodyProps={{
            sx: {
              "&": {
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              },
              "& td:first-of-type": {
                borderLeft: "1px solid #ccc",
              },
              "& td": {
                // borderTop: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                height: "22px",
                padding: "0px 5px",
                maxWidth: "150px",
              },
            },
          }}
          muiTableContainerProps={{
            sx: {
              maxHeight: `${maxHeight}px`,
              // width: "auto",
              // maxWidth: "fit-content",
            },
          }}
          muiTableHeadProps={{
            sx: {
              "& th": {
                borderTop: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                background: "#f4f4f4 ",
                padding: "0 5px",
              },
              "& th:first-of-type": {
                borderLeft: "1px solid #ccc",
              },
            },
          }}
        />
      ) : null}
      {infoPopUp ? (
        <RevenueForecastInfoPopUp
          infoPopUp={infoPopUp}
          setInfoPopUp={setInfoPopUp}
          iconName={iconName}
          setIconName={setIconName}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      ) : (
        ""
      )}
    </div>
  );
}
