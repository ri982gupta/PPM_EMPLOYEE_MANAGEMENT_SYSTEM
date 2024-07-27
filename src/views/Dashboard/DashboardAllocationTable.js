import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Button, IconButton } from "@mui/material";

import { AiFillRightCircle } from "react-icons/ai";
import { CListGroup } from "@coreui/react";
import { Link } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import DashboardPopup from "./DashboardPopup";
import "./DashboardAllocationTable.scss";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export default function DashboardAllocationTable(props) {
  const { data, expandedCols, colExpandState, viewBy, value, maxHeight1 } =
    props;
  console.log(maxHeight1, "maxHeight1");
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [resName, setResName] = useState();
  const [resid, setResId] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [dummyNodesForSearchFilter, setDummyNodesForSearchFilter] = useState([])

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

  useEffect(() => {
    getData();
     setColumnExpFlag(false)
  }, [data]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    // Perform filtering based on the search query
    const filteredNodes = dummyNodesForSearchFilter.filter((node) =>
      node.name.toLowerCase().includes(value.toLowerCase())
    );
    setNodes(filteredNodes);
  };

  const getData = () => {
    let tableData = data[1]?.tableData;
    let columns = null;
    if (data[0]?.columns?.includes("'")) {
      columns = data[0]?.columns?.replaceAll("'", "");
    } else {
      columns = data[0]?.columns;
    }

    let colArr = columns?.split(",");

    let newHeaders = [];
    let hiddenHeaders = [];

    const obj = {};

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();

      let firstData = tableData[0];
      obj[colVal] = firstData[colVal];
    }

    let headerArray = Object.entries(obj);
    let unWantedCols = [];

    let filteredHeadersTotal = headerArray.filter(([key, value]) =>
      key.includes("total")
    );
    let totalElement = filteredHeadersTotal[0];
    console.log(headerArray, "filteredHeaders");

    let filteredHeaders = headerArray.filter(
      ([key, value]) =>
        typeof value === "string" &&
        value.includes("^&") &&
        !key.includes("others") &&
        !key.includes("nBillUtil") &&
        !key.includes("billUtil") &&
        !key.includes("innov")
    );
    let totalPosition = filteredHeaders.length - 1;
    filteredHeaders.length >=2
      ? filteredHeaders.splice(totalPosition, 0, totalElement)
      : null;

    if (viewBy == "bu") {
      let totalIndex = filteredHeaders.findIndex(([key, value]) =>
        key.includes("total")
      );
      if (totalIndex !== -1) {
        const totalElement = filteredHeaders.splice(totalIndex, 1)[0]; // Remove the element
        filteredHeaders.push(totalElement); // Add it to the end
      }
    }
    setHeaders(filteredHeaders);
    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let minusOneRow = tableData?.filter((d) => d.id === -1);
    filteredHeaders.map(([key, value], index) => {
      newHeaders.push({
        accessorKey: key.includes("total")
          ? "total"
          : key.lastIndexOf("_") >= 7
          ? key.split("_")[0] +
            "_" +
            key.split("_")[1] +
            "_" +
            key.split("_")[2]
          : key.includes("action")
          ? "action"
          : key,
        header: value.split("^&")[0],
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => (
          <div
            className={
              key.includes("empId") || key.includes("name")
                ? "mixer"
                : key.includes("emp_cadre")
                ? "sm mixer"
                : (key.includes("department") ? "md mixer" : "") ||
                  (key.includes("supervisor") ? "md mixer" : "")
            }
            title={value.split("^&")[0]}
          >
            {value.split("^&")[0]}{" "}
            {key == colExpandState[2] && viewBy != "bu" ? (
              <IconButton
                className="expandIcon"
                onClick={() => {
                  setColumnExpFlag((prev) => !prev);
                }}
                style={{ color: "black" }}
              >
                {colExpFlag ? <BiChevronLeft /> : <BiChevronRight />}
              </IconButton>
            ) : null}
          </div>
        ),
      });
    });

    let subHeaders = minusOneRow ? Object.entries(minusOneRow[0]) : null;

    subHeaders?.sort();

    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let subArray = [];
      subHeaders.map(([key, value], index) => {
        if (!key.includes("greyout") && value != null && key != "id") {
          if (key.includes(data.accessorKey) && key !== data.accessorKey) {
            let obj = {
              id: key,
              header: (
                <div
                  className={key.includes("department") ? "md" : "sm"}
                  title={value}
                >
                  {value}
                </div>
              ),
              accessorKey: key,
              enableSorting: true,
              sortingFn: (rowB, rowA, columnId) => {
                const isRowTotal = (row) => row.original.name === "Total";

                const commonSorting = () => {
                  if (isRowTotal(rowA) || isRowTotal(rowB)) {
                    return 0;
                  }
                  const valueA = rowB.getValue(columnId).toLowerCase();
                  const valueB = rowA.getValue(columnId).toLowerCase();
                  return valueA.localeCompare(valueB);
                };

                const dateSorting = () => {
                  const valueA = rowB.getValue(columnId);
                  const valueB = rowA.getValue(columnId);

                  // Handle empty values
                  if (!valueA && !valueB) {
                    return 0;
                  } else if (!valueA) {
                    return 1; // Move empty value to the beginning
                  } else if (!valueB) {
                    return -1; // Move empty value to the end
                  }

                  const dateA = new Date(valueA);
                  const dateB = new Date(valueB);
                  return dateA - dateB;
                };

                if (
                  columnId === "actionComments" ||
                  columnId === "actionDate"
                ) {
                  return columnId === "actionDate"
                    ? dateSorting()
                    : commonSorting();
                } else {
                  return isRowTotal(rowA) || isRowTotal(rowB)
                    ? 0
                    : rowB.getValue(columnId) - rowA.getValue(columnId);
                }
              },

              Cell: ({ cell }) => {
                return (
                  <div
                    className={
                      key.includes("_")
                        ? key.split("_")[0] == "total"
                          ? "sm total"
                          : key.split("_")[1][1] % 2 == 0
                          ? "sm even"
                          : "sm odd"
                        : key.includes("emp_cadre")
                        ? "sm mixer"
                        : cell.row.original.name == "Total"
                        ? "rowTotal"
                        : ""
                    }
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={cell.getValue()}
                  >
                    {viewBy != "bu" &&
                    cell.column.id == "name" &&
                    cell.row.original != null ? (
                      <div className="openTable">
                        {icons[cell.row.original["empStatus"]]}
                        <Link
                          title={cell.getValue()}
                          to={`/resource/profile/:${cell.row.original.id}`}
                          target="_blank"
                          className="ellipsis"
                          style={{ textDecoration: "underline" }}
                        >
                          {cell.getValue()}
                        </Link>
                        {cell.row.original.actionDate != "" && (
                          <IoWarningOutline
                            title="Show Action Items"
                            onClick={() => {
                              setOpenPopup(true);
                              setResId(cell.row.original.id);
                              setResName(cell.row.original.name);
                            }}
                            style={{ color: "orange", cursor: "pointer" }}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        className={
                          viewBy == "bu" && cell.column.id == "name"
                            ? "businessUnit"
                            : cell.column.id == "actionComments"
                            ? "ellipsis"
                            : ""
                        }
                      >
                        {cell.getValue()}
                      </div>
                    )}
                  </div>
                );
              },
            };
            subArray.push(obj);

            newHeaders[i].columns = subArray;
          }
        } else {
          if (key == data.accessorKey) {
            let obj = {
              id: key,

              header: (
                <div
                  className={
                    key.includes("supervisor") || key.includes("department") 
                      ? "md"
                      : "sm"
                     || key.includes("cadre") ? "cadre-sm" : " "
                  }
                >
                  {" "}
                  {value}
                </div>
              ),
              accessorKey: key,
              enableSorting: true,
              sortingFn: (rowB, rowA, columnId) => {
                const isRowTotal = (row) => row.original.name === "Total";

                if (
                  (viewBy == "bu" && columnId == "name") ||
                  columnId != "name"
                ) {
                  if (isRowTotal(rowA) || isRowTotal(rowB)) {
                    return 0;
                  }

                  const nameA = rowB.getValue(columnId).toLowerCase();
                  const nameB = rowA.getValue(columnId).toLowerCase();

                  return nameA.localeCompare(nameB);
                } else {
                  return isRowTotal(rowA) || isRowTotal(rowB) ? 0 : 1;
                }
              },

              Cell: ({ cell }) => {
                return (
                  <div
                    className={
                      key.includes("emp_cadre")
                        ? "sm emp-cadre"
                        : key.includes("department") ||
                          key.includes("supervisor")
                        ? "md"
                        : cell.row.original.name == "Total"
                        ? "rowTotal"
                        : ""
                    }
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={cell.getValue()}
                  >
                    {viewBy != "bu" &&
                    cell.column.id == "name" &&
                    cell.getValue() != "Total" &&
                    cell.row.original != null ? (
                      <div className="openTable">
                        {icons[cell.row.original["empStatus"]]}
                        <Link
                          className="empName ellipsis"
                          title={cell.getValue()}
                          to={`/resource/profile/:${cell.row.original.id}`}
                          target="_blank"
                        >
                          {cell.getValue()}
                        </Link>
                        {cell.row.original.actionDate != "" && (
                          <IoWarningOutline
                            title="Show Action Items"
                            onClick={() => {
                              setOpenPopup(true);
                              setResId(cell.row.original.id);
                              setResName(cell.row.original.name);
                            }}
                            style={{ color: "orange", cursor: "pointer" }}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        className={
                          viewBy == "bu" && cell.column.id == "name"
                            ? "businessUnit"
                            : cell.column.id == "empId"
                            ? "ellipsis"
                            : ""
                        }
                      >
                        {cell.getValue()}
                      </div>
                    )}
                  </div>
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
    tableData?.map((d) => (d.id !== -1 && d.id !== -2 ? values.push(d) : ""));

    setNodes(jsonToTree(values, { children: "subRows" }));
    setDummyNodesForSearchFilter(jsonToTree(values, { children: "subRows" }))
  };

  useEffect(() => {
    getData();
    colExpFlag ? setHiddenColumns({}) : colCollapse();
    // setColumnExpFlag(false)
  }, [colExpFlag]);

  const colCollapse = () => {
    let hiddenHeaders = [];
    // refactor this
    headers.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));
  };

  const jsonToTree = (flatArray, options) => {
    options = {
      id: "id",
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
      // set up current node data in dictionary
      dictionary[nodeId] = {
        [children]: [], // init a children property
        ...node, // add other propertys
        ...dictionary[nodeId], // children will be replaced if this node already has children property which was set below
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
    <div
      className={
        value === "Teams"
          ? "materialReactExpandableTable dashboardAllocationTable teamsUtilization darkHeader toHead"
          : value != "Teams" && viewBy == "bu"
          ? "materialReactExpandableTable businessUnitTable darkHeader toHead"
          : "materialReactExpandableTable dashboardAllocationTable darkHeader toHead"
      }
    >
      {columns?.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={false}
          enableExpanding={false}
          enablePagination={true}
          enableRowVirtualization
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          enableHiding={false}
          enableGlobalFilter={value != "Teams" ? true : false}
          enableBottomToolbar={true}
          enableTopToolbar={value != "Teams" ? true : false}
          enableColumnActions={false}
          enablePinning={false}
          enableColumnFilters={false}
          filterFromLeafRows
          initialState={{
            showGlobalFilter: true,
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            columnPinning: { left: ["empId", "name"] },
            pagination: { pageSize: 30 },
          }} //expand all rows by default
          muiTablePaginationProps={{
            rowsPerPageOptions: [10, 25, 50],
            showFirstButton: false,
            showLastButton: false,
          }}
          state={{
            columnVisibility: { ...hiddenColumns },
            showProgressBars: false,
          }}
          paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
          defaultColumn={{ minSize: 30, maxSize: 1000, size: 30 }} //units are in px
          muiSearchTextFieldProps={{
            variant: "outlined",
            placeholder: `Search ${nodes.length} rows`,
            sx: { minWidth: '300px' },
            onChange: handleSearchChange,
            value: searchQuery,
          }}
          muiTableContainerProps={{
            sx: {
              width: "auto",
              maxWidth: "fit-content",
              maxHeight: `${maxHeight1}px`,
            },
          }}
          muiTableBodyProps={{
            sx: {
              "&": {
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              },
              "& td:first-of-type": {
                borderLeft: "1px solid #ccc",
                minWidth: "100px",
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
                minWidth: "100px",
              },
            },
          }}
          // emptyMessage="No data found"
        />
      ) : null}
      {openPopup && (
        <DashboardPopup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          resid={resid}
          resName={resName}
        />
      )}
    </div>
  );
}
