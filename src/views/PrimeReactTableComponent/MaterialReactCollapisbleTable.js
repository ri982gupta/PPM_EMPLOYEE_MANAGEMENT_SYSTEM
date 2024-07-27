import React, { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton } from "@mui/material";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import "./EngagementAllocationsTable.scss";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import useDynamicMaxHeight from "./useDynamicMaxHeight";

export default function MaterialReactCollapisbleTable(props) {
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

  const materialTableElement = document.getElementsByClassName(
    "materialReactExpandableTable engagementAllocationsTable darkHeader"
  );

  const maxHeight = useDynamicMaxHeight(materialTableElement) - 2;

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

  useEffect(() => {
    getData();
  }, [data]);
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
              <IconButton
                className="expandIcon"
                title="Show Details"
                onClick={() => {
                  setColumnExpFlag((prev) => !prev);
                }}
              >
                {colExpFlag ? <BiChevronLeft /> : <BiChevronRight />}
              </IconButton>
            ) : (
              ""
            )}
          </div>
        ),
        enableSorting: true,
        sortingFn: (rowB, rowA, columnId) => {
          console.log(
            "rowA.id",
            rowB.getValue(columnId).toLowerCase(),
            columnId
          );
          return columnId != "name"
            ? rowA.id != "0" && rowB.id != "1"
              ? rowB.getValue(columnId) - rowA.getValue(columnId)
              : ""
            : rowA.id != "0" && rowB.id != "1"
            ? rowB
                .getValue(columnId)
                .toLowerCase()
                .localeCompare(rowA.getValue(columnId).toLowerCase())
            : "";
        },
        Cell: ({ cell }) => {
          return (
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={cell.getValue()}
              className={
                key.includes("_")
                  ? key.split("_")[1] % 2 == 0
                    ? ""
                    : "odd"
                  : key.includes("total")
                  ? "total"
                  : (key == "roleName" || key == "prjMgr") && "projManager"
              }
            >
              {cell.column.id == "name" &&
              cell.row.original.parentId != null ? (
                <span className="rescolor">
                  {icons[cell.row.original["empStatus"]]}
                  &nbsp;{cell.getValue()}
                </span>
              ) : key.includes("_") && key.split("_")[2] ? (
                <span title={numberWithCommas(cell.getValue())}>
                  {numberWithCommas(cell.getValue())}
                </span>
              ) : key.includes("total") ? (
                <span title={numberWithCommas(cell.getValue())}>
                  {numberWithCommas(cell.getValue())}
                </span>
              ) : (
                cell.getValue()
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

  const expandF = () => {
    getData();
  };

  const expandT = () => {
    count++;
    getData();
    setHiddenColumns({});
  };

  useEffect(() => {
    colExpFlag ? expandT() : expandF();
    // getData();
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
    const dictionary = {};
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

  return (
    <div className="materialReactExpandableTable engagementAllocationsTable darkHeader">
      {columns?.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={true}
          enableExpanding
          enablePagination={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableSorting={true}
          filterFromLeafRows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            columnPinning: { right: ["total"] },
          }}
          state={{ columnVisibility: { ...hiddenColumns } }}
          defaultColumn={{ minSize: 40, maxSize: 1000, size: 40 }}
          enableStickyHeader
          muiTableContainerProps={{
            sx: {
              maxHeight: `${maxHeight}px`,
              width: "auto",
              maxWidth: "fit-content",
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
              },
            },
          }}
        ></MaterialReactTable>
      ) : null}
    </div>
  );
}
