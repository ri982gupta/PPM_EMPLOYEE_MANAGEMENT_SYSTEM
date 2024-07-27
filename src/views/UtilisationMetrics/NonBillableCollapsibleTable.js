import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton } from "@mui/material";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { CListGroup } from "@coreui/react";
import "./NonBillableCollapsibleTable.scss";
import { BiChevronRight, BiChevronUp } from "react-icons/bi";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

export default function NonBillableCollapsibleTable(props) {
  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px", float: "left" }}
        title="Ex-Employee"
      />
    ),
    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px", float: "left" }}
        title="Active Employee"
      />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px", float: "left" }}
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px", float: "left" }}
        title="Ex-Contractor"
      />
    ),
    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px", width: "auto", float: "left" }}
        title="Active Contractor"
        size="1em"
      />
    ),
    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px", float: "left" }}
        title="Contractor in notice period"
      />
    ),
  };
  const { data, expandedCols, colExpandState } = props;
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);

  const materialTableElement = document.getElementsByClassName("materialReactExpandableTable nbWorkTable darkHeader toHead");
const maxHeight = useDynamicMaxHeight(materialTableElement, "fixedcreate");

  
  const numberWithCommas = (x) => {
    var number = String(x);
    if (number.includes(".")) {
      var decimalNumbers = number;
      var num = Number(decimalNumbers);
      let FdN =
        num != null &&
        num.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 20,
        });
      let final = FdN.split(".");
      final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");

      // Ensure exactly two decimal places
      final[1] = final[1].padEnd(2, "0"); // Add zeros if necessary
      return final.join(".");
    } else {
      return (
        number != null &&
        parseFloat(number)
          .toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 20,
          })
          .replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",")
      );
    }
  };
  const formatValue = (value) => {
    if (typeof value === "number") {
      const num = Number(value);
      return num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 20,
      });
    } else if (typeof value === "string") {
      return value;
    } else {
      return value; // For other types, return as-is
    }
  };

  useEffect(() => {
    getData();
  }, [data.tableData]);
  var count = 0;
  const getData = () => {
    let expandClass = "";
    if (colExpFlag == true && count > 0) {
      expandClass = "expanded";
    } else {
      expandClass = "";
    }
    let tableData = data.tableData;
    let columns = null;

    if (data?.columns?.includes("'")) {
      columns = data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.columns;
    }

    let colArr = columns?.split(",");

    let newHeaders = [];
    let hiddenHeaders = [];
    const obj = {};

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();

      let firstData = data.tableData[0];

      obj[colVal] = firstData[colVal];
    }
    let headerArray = Object.entries(obj);

    let filteredHeaders = headerArray
      .map(([key, value]) => {
        if (typeof value === "string" && value.includes("^&")) {
          return [key, value];
        } else if (key === "Total^&1^&1") {
          return ["total", "Total"];
        }
        return null; // Remove this key-value pair from the filtered array
      })
      .filter((pair) => pair !== null);

    setHeaders(filteredHeaders);

    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    filteredHeaders.map(([key, value], index) => {
      newHeaders.push({
        accessorKey: key,
        header: value.split("^&")[0],
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => (
          <div>
            {value.split("^&")[0]}{" "}
            {key == colExpandState[2] ? (
              <span className={`expandIcon ${expandClass}`}>
                <IconButton
                  onClick={() => {
                    setColumnExpFlag((prev) => !prev);
                  }}
                >
                  <BiChevronRight />
                </IconButton>
              </span>
            ) : (
              ""
            )}
          </div>
        ),

        Cell: ({ cell }) => {
          const cellValue = cell.getValue() !== null ? cell.getValue() : "";
          const nameWithoutSpecialChars = cellValue.replace(
            /\^&\d+\^&\d+/g,
            ""
          );
          return (
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={
                cell.column.id === "name" && cell.row.original.projectId === 0
                  ? nameWithoutSpecialChars // Use the modified name here
                  : key.includes("_") && key.split("_")[2]
                  ? numberWithCommas(nameWithoutSpecialChars) // Use cellValue here
                  : key.includes("total")
                  ? numberWithCommas(cell.row.original.total)
                  : formatValue(nameWithoutSpecialChars) // Use cellValue here
              }
              className={
                key.includes("_wk")
                  ? key.split("_wk")[3] % 2 === 0
                    ? "even"
                    : "odd"
                  : key.includes("total")
                  ? "total"
                  : ""
              }
            >
              {cell.column.id == "name" && cell.row.original.lvl == 0 ? (
                <>{cell.getValue()}</>
              ) : cell.column.id == "name" && cell.row.original.lvl == 1 ? (
                <div className="rescolor">
                  <>{cell.getValue()}</>
                </div>
              ) : cell.column.id == "name" && cell.row.original.lvl == 2 ? (
                <div className="childRow">
                  {icons[cell.row.original["empStatus"]]}
                  <>{cell.getValue()}</>
                </div>
              ) : key.includes("_") &&
                key.split("_")[2] &&
                cell.row.original.projectId === 0 ? (
                <>{formatValue(numberWithCommas(cell.getValue()))}</>
              ) : key.includes("total") && cell.row.original.projectId === 0 ? (
                <> {numberWithCommas(cell.row.original.total)}</>
              ) : cell.row.original.emp_cadre &&
                cell.row.original.lvl === 2 &&
                cell.row.original.projectId === 0 ? (
                <div>
                  <>{cell.getValue()}</>
                </div>
              ) : cell.column.id == "emp_cadre" &&
                cell.row.original.projectId === 0 ? (
                <div className="cadreColor">
                  <>{cell.getValue()}</>
                </div>
              ) : cell.column.id == "supervisor" &&
                cell.row.original.projectId == 0 ? (
                <div className="supervisorColor">
                  <>{cell.getValue()}</>
                </div>
              ) : (
                <div className="gChildRow">{nameWithoutSpecialChars}</div>
              )}
            </div>
          );
        },
      });
    });

    setColumns(newHeaders);
    let values = [];
    tableData?.map((d, i) => (i > 0 && d.id != -1 ? values.push(d) : ""));
    setNodes(jsonToTree(values, { children: "subRows" }));
  };

  // useEffect(() => {
  //   getData();
  //   colExpFlag ? setHiddenColumns({}) : colCollapse();
  // }, [colExpFlag]);

  const colCollapse = () => {
    let hiddenHeaders = [];
    headers.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));
  };
  useEffect(() => {
    colExpFlag ? expandT() : expandF();
  }, [colExpFlag]);

  const expandT = () => {
    count++;
    getData();
    setHiddenColumns({});
  };

  const expandF = () => {
    getData();
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
  console.log(nodes);
  return (
    <div className="materialReactExpandableTable nbWorkTable darkHeader toHead">
      {nodes.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={true}
          enableExpanding
          enablePagination={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableSorting={false}
          filterFromLeafRows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            enablePinning: true,
          }}
          state={{ columnVisibility: { ...hiddenColumns } }}
          defaultColumn={{ minSize: 40, maxSize: 1000, size: 40 }}
          enableStickyHeader
          muiTableContainerProps={{
            sx: {
              maxHeight: `${maxHeight-15}px`,
              // width: "auto",
              // maxWidth: "fit-content",
            },
          }}
          muiTableBodyProps={{
            sx: {
              "&": {},
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
                fontSize: "13px",
                padding: "0px 8px",
                fontWeight: "bold",
              },
            },
          }}
        />
      ) : null}
    </div>
  );
}
