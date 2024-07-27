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
// import "./EngagementAllocationsTable.scss";

export default function RevenueProjectionMaterialtable(props) {
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

  const numberWithCommas = (x) => {
    var number = String(x);
    if (number.includes(".") == true) {
      var decimalNumbers = number;
      var num = Number(decimalNumbers);
      let FdN = num != null && num?.toFixed(1);
      let final = FdN.split(".");
      final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");

      return final.join(".");
    } else {
      return (
        number != null && number?.replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",")
      );
    }
  };

  useEffect(() => {
    getData();
  }, [data]);

  const getData = () => {
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
                onClick={() => {
                  setColumnExpFlag((prev) => !prev);
                }}
              >
                <AiFillRightCircle />
              </IconButton>
            ) : null}
          </div>
        ),
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
                  ? key.split("_")[2] % 2 == 0
                    ? "even"
                    : "odd"
                  : key.includes("total") && "total"
              }
            >
              {console.log(key)}
              {cell.column.id == "name" &&
              cell.row.original.parentId != null ? (
                <span>
                  {icons[cell.row.original["empStatus"]]}
                  &nbsp;{cell.getValue()}
                </span>
              ) : key.includes("_") && key.split("_")[2] ? (
                numberWithCommas(cell.getValue())
              ) : key.includes("total") ? (
                numberWithCommas(cell.getValue())
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
    tableData?.map((d) => (d.id != -1 ? values.push(d) : ""));

    setNodes(jsonToTree(values, { children: "subRows" }));
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
    <div className="engagementAllocationsTable darkHeader">
      {nodes.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={true} //hide expand all double arrow in column header
          enableExpanding
          enablePagination={false}
          //enableRowVirtualization
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableSorting={false}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            columnPinning: { right: ["total"] },
          }} //expand all rows by default
          state={{ columnVisibility: { ...hiddenColumns } }}
          //paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
          defaultColumn={{ minSize: 40, maxSize: 1000, size: 40 }} //units are in px
          enableStickyHeader
          muiTableContainerProps={{
            sx: { maxHeight: "50vh", width: "auto", maxWidth: "fit-content" },
          }}
          muiTableBodyProps={{
            sx: {
              "&": {
                // borderBottom: "1px solid #ccc",
              },
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
      ) : null}
    </div>
  );
}
