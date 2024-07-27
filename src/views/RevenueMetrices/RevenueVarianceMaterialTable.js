import React, { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton } from "@mui/material";

import { AiFillRightCircle } from "react-icons/ai";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import "./RevenueVarianceMaterialTable.scss";
import { Done, Block, Warning } from "@mui/icons-material";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
export default function RevenueVarianceMaterialTable(props) {
  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Employee"
      />
    ),
    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Active Employee"
      />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px" }}
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Contractor"
      />
    ),
    subk1: (
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

  const {
    data,
    expandedCols,
    colExpandState,
    setRowCount,
    type,
    formData,
    isOn,
    setColumnExpFlag,
    colExpFlag,
  } = props;
  const materialTableElement = document.getElementsByClassName(
    "materialReactExpandableTable RevenueVarianceTable darkHeader toHead"
  );

  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  // const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [headers1, setHeaders1] = useState([]);

  const maxHeight1 = useDynamicMaxHeight(materialTableElement);
  const [maxHeight, setMaxHeight] = useState();
  useEffect(() => {
    if (isOn) {
      setMaxHeight(maxHeight1 - 30);
    } else {
      setMaxHeight(maxHeight1);
    }
  }, [isOn, nodes]);

  const columnName = "name";
  const nameRowCount = nodes.filter(
    (row) => row[columnName] !== null && row[columnName] !== ""
  ).length;
  setRowCount(nameRowCount > 0 ? nameRowCount - 1 : 0);

  useEffect(() => {
    getData();
  }, [data]);
  const expandT = () => {
    count++;
    getData();
    // setHiddenColumns({});
  };
  const expandF = () => {
    getData();
    // colCollapse()
  };
  useEffect(() => {
    colExpFlag ? expandT() : expandF();
  }, [colExpFlag]);
  var count = 0;
  const getData = () => {
    let expandColumnClass = "";
    let IconExpand = "";

    if (colExpFlag == true && count > 0) {
      expandColumnClass = "expandedColumns mixer";
      IconExpand = "expanded";
    } else {
      expandColumnClass = "";
      IconExpand = "";
    }
    let tableData = data.tableData;
    setHeaders1(data.columns?.replaceAll("'", "").split(","));
    let columns = null;
    let secondHeaders = tableData?.filter((d) => d.id == "-2");
    let thirdHeaders = tableData?.filter((d) => d.id === "-1");

    if (data?.columns?.includes("'")) {
      columns = data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.columns;
    }
    let colArr = columns?.split(",");
    let newHeaders = [];
    let hiddenHeaders = [];
    const obj = {};
    const obj1 = {};
    const obj2 = {};

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();
      let firstData = tableData[0];
      obj[colVal] = firstData[colVal];
    }
    let headerArray = Object.entries(obj);
    let filteredHeaders = headerArray.filter(
      ([key, value]) => typeof value === "string" && value.includes("^&")
    );
    setHeaders(filteredHeaders);
    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });
    filteredHeaders.forEach((d) => (obj1[d[1]] = d[0]));
    let newObject = Object.entries(obj1);

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    const getLegendIcon = (empStatus) => {
      if (empStatus === "active") {
        return <Done style={{ fontSize: 12 }} />;
      } else if (empStatus === "inactive") {
        return <Block style={{ fontSize: 12 }} />;
      } else if (empStatus === "notice") {
        return <Warning style={{ fontSize: 12 }} />;
      }
      return null;
    };

    newObject.map(([value, key], index) => {
      newHeaders.push({
        accessorKey:
          key.lastIndexOf("_") > 7
            ? key.split("_")[0] +
              "_" +
              key.split("_")[1] +
              "_" +
              key.split("_")[2]
            : key?.includes("total")
            ? "total"
            : key,
        header: value.split("^&")[0],
        enableColumnActions: false,
        enableHiding: true,
        enableSorting: true,
        Header: ({ column }) => (
          <div
            className={
              key.includes("name")
                ? "mixer ellipsis"
                : key === "project_ct" ||
                  key === "emp_cadre" ||
                  key === "supervisor"
                ? expandColumnClass
                : "hello ellipsis"
            }
            title={value.split("^&")[0]}
          >
            {value.split("^&")[0]}{" "}
            {key == colExpandState[2] ? (
              <span className={`expandIcon ${IconExpand}`}>
                <IconButton
                  //className="expandIcon"
                  onClick={() => {
                    setColumnExpFlag((prev) => !prev);
                  }}
                >
                  <AiFillRightCircle />
                </IconButton>
              </span>
            ) : null}
          </div>
        ),
        Cell: ({ cell, row }) => {
          const cellValue = cell.getValue();

          const formattedValue = isNaN(cellValue) ? "N/A" : cellValue;
          const icn = icons[row["empStatus"]];
          return (
            <div
              className={value + "-" + key + "ellipsis"}
              title={cell.getValue()}
            >
              {getLegendIcon(cell.row.original["empStatus"])}{" "}
              {cell.column.id === "name" &&
              cell.row.original.parentId !== null ? (
                <span className="ellipsis">{formattedValue}</span>
              ) : (
                formattedValue
              )}
            </div>
          );
        },
      });
    });

    let subHeaders = secondHeaders ? Object.entries(secondHeaders[0]) : null;
    let perSubHeaders = thirdHeaders ? Object.entries(thirdHeaders[0]) : null;
    let filteredSubHeaders = subHeaders?.filter(
      ([key, value]) => typeof value === "string" && value.includes("^&")
    );

    let filteredThirdHeaders = perSubHeaders?.filter(
      ([key, value]) => typeof value === "string" && key.includes("_")
    );
    if (type === "0") {
      filteredSubHeaders?.sort();
    }

    let newSecondRow = [];
    newHeaders.map((data) => {
      filteredSubHeaders.map(([key, value]) => {
        if (key.includes(data.accessorKey)) {
          newSecondRow.push([data.accessorKey, value]);
        }
      });
    });

    let obj3 = [];
    let finalObj = [];

    newSecondRow.map((d) => {
      if (obj3[d[0]] == undefined) {
        let ar = [];

        if (ar.includes(d[1]) == false) {
          ar.push(d[1]);

          finalObj.push(d);
        }

        obj3[d[0]] = ar;
      } else {
        let ar = obj3[d[0]];

        if (ar.includes(d[1]) == false) {
          ar.push(d[1]);

          finalObj.push(d);
        }
      }
    });

    if (props.formData.View === "0") {
      if (finalObj.length === 12) {
        for (let i = 0, j = 2; i < finalObj.length; i = i + 3, j = j + 3) {
          let temp = finalObj[i];
          finalObj[i] = finalObj[j];
          finalObj[j] = temp;
        }
      } else if (finalObj.length === 8) {
        let thirdVal = finalObj[2][1];
        if (thirdVal === "Margin^&1^&4") {
          for (let i = 0, j = 1; i < finalObj.length; i += 2, j = i + 1) {
            let temp = finalObj[i];
            finalObj[i] = finalObj[j];
            finalObj[j] = temp;
          }
        }
      }
    }

    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let subArray = [];
      let count = 0;
      finalObj?.map(([key, value]) => {
        if (key.includes(data.accessorKey)) {
          let obj = {
            id: key + "_" + value,
            header: value.split("^&")[0],
            accessorKey: key + "_" + value,
            enableSorting: true,
            sortingFn: (rowB, rowA, columnId) => {
              console.log(rowB);
              return rowA.id != "0" && rowB.id != "1"
                ? rowB.getValue(columnId) - rowA.getValue(columnId)
                : "";
            },
            Cell: ({ cell }) => {
              return (
                <>
                  <div
                    className={
                      key.split("_")[0] == "total ellipsis"
                        ? "total ellipsis"
                        : parseInt(key.split("_")[1]) % 2 == 0
                        ? "even ellipsis"
                        : "odd ellipsis"
                    }
                    title={cell.getValue()}
                    style={{ textAlign: "end" }}
                  >
                    <span>
                      {cell.column.id == "name" ? (
                        <span title={cell.getValue()}>
                          {icons[cell.row.original["name"]]} {cell.getValue()}
                        </span>
                      ) : value.includes("") ? (
                        <>
                          <div
                            className="align right ellipsis"
                            title={numberWithCommas(cell.getValue())}
                            style={{ textAlign: "end" }}
                          >
                            {/* {numberWithCommas(Math.round(cell.getValue()))} */}
                            {numberWithCommas(cell.getValue())}
                          </div>
                        </>
                      ) : (
                        <div
                          className="align right"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}{" "}
                          {/* {cell.getValue()} */}
                        </div>
                      )}
                    </span>
                    {cell.getValue()}
                  </div>
                </>
              );
            },
          };
          subArray.push(obj);
          newHeaders[i].columns = subArray;
        } else {
          if (!(data.accessorKey.split("_").length > 2)) {
            let obj = {
              id: data.accessorKey,
              header: "",
              accessorKey: data.accessorKey,
              enableSorting: true,
              sortingFn: (rowB, rowA, columnId) => {
                return rowA.id != "0" && rowB.id != "1" ? rowA.id - rowB.id : 0;
              },

              columns: [
                {
                  id: data.accessorKey,
                  header: "",
                  accessorKey: data.accessorKey,
                  enableSorting: true,
                  sortingFn: (rowB, rowA, columnId) => {
                    const nameA = rowB.getValue(columnId).toLowerCase();
                    const nameB = rowA.getValue(columnId).toLowerCase();
                    return rowA.id != "0" && rowB.id != "1"
                      ? nameA.localeCompare(nameB)
                      : "";
                  },
                  Cell: ({ cell }) => {
                    return (
                      <>
                        <div
                          className={
                            key.split("_")[0] == "total ellipsis"
                              ? "total ellipsis"
                              : parseInt(key.split("_")[1]) % 2 == 0
                              ? "even ellipsis"
                              : "odd"
                          }
                          title={cell.getValue()}
                        >
                          {cell.getValue()}
                        </div>
                      </>
                    );
                  },
                },
              ],
            };
            newHeaders[i].columns = [obj];
          }
        }
      });
    });

    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let count = 0;
      data.columns?.map((param) => {
        let j = newHeaders[i].columns.indexOf(param);
        newHeaders[i].columns[j].columns = [];
        count++;
        filteredThirdHeaders.map(([key, value], index) => {
          if (key.includes(data.accessorKey)) {
            if (
              param.header == "Margin" &&
              (key.includes("GM") || key.includes("marVariance"))
            ) {
              let obj1 = {
                id: key + "_" + value + "_" + count,
                header: value,
                accessorKey: key,
                enableSorting: true,
                sortingFn: (rowB, rowA, columnId) => {
                  return rowA.id != "0" && rowB.id != "1"
                    ? rowB.getValue(columnId) - rowA.getValue(columnId)
                    : "";
                },
                Cell: ({ cell, column, row }) => {
                  return (
                    <>
                      <div
                        className={
                          row.original.lvl < 4 && column.id.includes("total")
                            ? "total textright"
                            : row.original.lvl >= 4 &&
                              column.id.includes("total")
                            ? "totalFaded textright"
                            : cell.row.original.lvl === "4" &&
                              parseInt(key.split("_")[1]) % 2 === 0
                            ? "evenFaded textright "
                            : cell.row.original.lvl === "4" &&
                              parseInt(key.split("_")[1]) % 2 !== 0
                            ? "oddFaded textright"
                            : parseInt(key.split("_")[1]) % 2 == 0
                            ? "even textright"
                            : "odd textright"
                        }
                        title={numberWithCommas(cell.getValue())}
                        style={{ textAlign: "end" }}
                      >
                        {numberWithCommas(cell.getValue())}
                      </div>
                    </>
                  );
                },
              };
              newHeaders[i].columns[j].columns.push(obj1);
            }
            if (
              param.header == "Revenue" &&
              (key.includes("Rev") || key.includes("revVariance"))
            ) {
              let obj2 = {
                id: key + "_" + value + "_" + count,
                header: value,
                accessorKey: key,
                enableSorting: true,
                sortingFn: (rowB, rowA, columnId) => {
                  return rowA.id != "0" && rowB.id != "1"
                    ? rowB.getValue(columnId) - rowA.getValue(columnId)
                    : "";
                },
                Cell: ({ cell, column, row }) => {
                  return (
                    <>
                      <div
                        className={
                          row.original.lvl < 4 && column.id.includes("total")
                            ? "total textright"
                            : row.original.lvl >= 4 &&
                              column.id.includes("total")
                            ? "totalFaded textright"
                            : cell.row.original.lvl === "4" &&
                              parseInt(key.split("_")[1]) % 2 === 0
                            ? "evenFaded textright"
                            : cell.row.original.lvl === "4" &&
                              parseInt(key.split("_")[1]) % 2 !== 0
                            ? "oddFaded textright"
                            : // index % 2 === 0
                            // ? "even"
                            // : "odd"
                            parseInt(key.split("_")[1]) % 2 == 0
                            ? "even textright"
                            : "odd textright"
                        }
                        title={numberWithCommas(cell.getValue())}
                        style={{ textAlign: "end" }}
                      >
                        {numberWithCommas(cell.getValue())}
                      </div>
                    </>
                  );
                },
              };
              newHeaders[i].columns[j].columns.push(obj2);
            }
            if (
              param.header == "Hours" &&
              (key.includes("bill") || key.includes("_variance"))
            ) {
              let obj3 = {
                id: key + "_" + value + "_" + count,
                header: value,
                accessorKey: key,
                enableSorting: true,
                sortingFn: (rowB, rowA, columnId) => {
                  return rowA.id != "0" && rowB.id != "1"
                    ? rowB.getValue(columnId) - rowA.getValue(columnId)
                    : "";
                },

                Cell: ({ cell, column, row }) => {
                  const originalValue = parseFloat(cell.getValue());
                  const roundedValue =
                    Math.round(originalValue).toLocaleString();

                  return (
                    <>
                      <div
                        className={
                          row.original.lvl < 4 && column.id.includes("total")
                            ? "total textright"
                            : row.original.lvl >= 4 &&
                              column.id.includes("total")
                            ? "totalFaded textright"
                            : cell.row.original.lvl === "4" &&
                              parseInt(key.split("_")[1]) % 2 === 0
                            ? "evenFaded textright"
                            : cell.row.original.lvl === "4" &&
                              parseInt(key.split("_")[1]) % 2 !== 0
                            ? "oddFaded textright"
                            : parseInt(key.split("_")[1]) % 2 === 0
                            ? "even textright"
                            : "odd textright"
                        }
                        title={numberWithCommas(cell.getValue())}
                        style={{ textAlign: "end" }}
                      >
                        {numberWithCommas(cell.getValue())}
                      </div>
                    </>
                  );
                },
              };
              newHeaders[i].columns[j].columns.push(obj3);
            }
          }
        });
      });
    });

    setColumns(newHeaders);
    let values = [];

    tableData?.map((d) => {
      if (d.id != -1 && d.id != -3 && d.id != -2) {
        let classNameColor = "";
        Object.keys(d).forEach((key) => {
          d[key] =
            (["null", "undefined"].includes("" + d[key]) == false &&
              isNaN(d[key])) ||
            d[key] === "" ||
            d[key] === null
              ? d[key]
              : d[key];

          if (
            d.lvl === "1" &&
            (key === "emp_cadre" ||
              key === "supervisor" ||
              key === "project_ct")
          ) {
            classNameColor = "ColExpandClass";
            d[key] = (
              <div title={d[key]} className={classNameColor}>
                {d[key]}
              </div>
            );
          }
        });
        // if (d.key === "Summary") {
        //   d.Summary = (
        //     <div
        //       title={d.Summary}
        //       className={classNameColor + "ellipsis" + "summary"}
        //     >
        //       {d.Summary}
        //     </div>
        //   );
        // }
        if (
          formData.Summary === "resource" &&
          d.empStatus != null &&
          d.empStatus != "" &&
          d.lvl != "4"
        ) {
          d.name = (
            <div title={d.resource} className={classNameColor + "ellipsis"}>
              {icons[d.empStatus]}
              {d.resource}
            </div>
          );
        } else if (
          (formData.Summary === "bu" || formData.Summary === "customer") &&
          d.empStatus != null &&
          d.empStatus != ""
        ) {
          d.name = (
            <div
              title={d.resource}
              className={classNameColor}
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                // fontWeight: "bold",
                paddingLeft: "25px",
              }}
            >
              {icons[d.empStatus]}
              {d.resource}
            </div>
          );
        } else {
          d.name = (
            <div
              title={d.name}
              className={classNameColor}
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",

                paddingLeft: d.lvl == "2" ? "7px" : d.lvl == "3" ? "15px" : "",
              }}
            >
              {d.name}
            </div>
          );
        }
        if (d.project_ct) {
          d.project_ct = (
            <div
              title={d.project_ct}
              className="ellipsis"
              style={{ textOverflow: "ellipsis", overflow: "hidden" }}
            >
              {d.project_ct}
            </div>
          );
        }
        if (d.emp_cadre) {
          d.emp_cadre = (
            <div title={d.emp_cadre} className="ellipsis">
              {d.emp_cadre}
            </div>
          );
        }
        if (d.supervisor) {
          d.supervisor = (
            <div title={d.supervisor} className="ellipsis">
              {d.supervisor}
            </div>
          );
        }
        values.push(d);
      }
    });

    let C = tableData?.filter((d) => d.id == -2 && d.id == -3);
    let noData = tableData?.filter((d) => d.id == 999);
    let A = jsonToTree(values, { children: "subRows" });
    setNodes(jsonToTree(values, { children: "subRows" }));
  };

  useEffect(() => {}, [headers1]);

  const reorderedThirdHeaders =
    headers1 && typeof headers1 === "Array"
      ? Object.keys(headers1)
          .filter((key) => thirdHeaders.hasOwnProperty(key))
          .reduce((acc, key) => ({ ...acc, [key]: thirdHeaders[key] }), [])
      : [];

  const numberWithCommas = (x) => {
    var number = String(x);
    if (number.includes(".") == true) {
      if (number.includes(".00") == true) {
        var decimalNumbers = number;
        var num = Math.round(parseFloat(decimalNumbers)); // Round to the nearest integer

        return num.toLocaleString(); // Add commas as thousands separators
      } else {
        var decimalNumbers = number;
        var num = Math.round(parseFloat(decimalNumbers)); // Round to the nearest integer

        return num.toLocaleString(); // Add commas as thousands separators
      }
    } else {
      return number.replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");
    }
  };

  useEffect(() => {
    colExpFlag ? setHiddenColumns({}) : colCollapse();
  }, [colExpFlag]);

  const colCollapse = () => {
    let hiddenHeaders = [];
    headers.map(([key, value]) => {
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
    const dictionary = {}; // a hash table mapping to the specific array objects with their ids as key
    const tree = [];
    const children = options.children;
    flatArray.forEach((node) => {
      const nodeId = node[options.id];
      const nodeParentId = node[options.parentId];

      dictionary[nodeId] = {
        [children]: [],
        ...node,
        ...dictionary[nodeId],
      };
      dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] }; // if it's not exist in dictionary, init an object with children property
      dictionary[nodeParentId][children].push(dictionary[nodeId]); // add reference to current node object in parent node object
    });
    // find root nodes
    Object.values(dictionary).forEach((obj) => {
      if (typeof obj[options.id] === "undefined") {
        tree.push(...obj[children]);
      }
    });
    return tree;
  };

  return (
    <div className="materialReactExpandableTable RevenueVarianceTable darkHeader toHead ">
      {nodes?.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={false}
          enableExpanding
          enablePagination={isOn}
          paginateExpandedRows={true}
          enableBottomToolbar={isOn}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableRowVirtualization={true}
          filterFromLeafRows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            pagination: { pageSize: 15 },
            columnPinning: {
              left: [
                "mrt-row-expand",
                "name",
                "project_ct",
                "emp_cadre",
                "supervisor",
              ],
            },
          }}
          state={{ columnVisibility: { ...hiddenColumns } }}
          defaultColumn={{ minSize: 80, size: 120, maxSize: 120 }}
          muiTablePaginationProps={{
            rowsPerPageOptions: [10, 15, 20, 50],
            showFirstButton: true,
            showLastButton: true,
          }}
          muiTableContainerProps={{
            sx: {
              maxHeight: `${maxHeight}px`,
            },
          }}
          muiTableBodyProps={{
            sx: {
              "& td": {
                borderRight: "1px solid #ccc",
                height: "22px",
                fontSize: "11px",
                paddingTop: "0px",
                paddingBottom: "0px",
              },
            },
          }}
          muiTableHeadProps={{
            sx: {
              "& th": {
                borderTop: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                background: "#f4f4f4 ",
                fontSize: "11px",
                padding: "0px 8px",
              },
            },
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
}
