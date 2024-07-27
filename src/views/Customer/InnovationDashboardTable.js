import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Button, IconButton } from "@mui/material";

import { AiFillRightCircle } from "react-icons/ai";
import { CListGroup } from "@coreui/react";
import { GoPerson } from "react-icons/go";

export default function InnovationDashboardTable(props) {
  const { data, expandedCols, colExpandState } = props;
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);

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

    let unWantedCols = [
      "id",
      "theme",
      "solution",
      "project",
      "gitURL",
      "resource",
      "solutionId",
      "themeId",
      "projectId",
      "empStatus",
      "lvl",
      "count",
      "keyAttr",
    ];

    let filteredHeaders = headerArray.filter(
      (d) => !unWantedCols.includes(d[0])
    );

    // let filteredHeaders = headerArray.filter(
    //   ([key, value]) => typeof value === "string" && value.includes("^&")
    // );

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
        // header: value.split("^&")[0],
        header: value,
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => (
          <div>
            {/* {value.split("^&")[0]} */}
            {value}{" "}
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
        // Cell: ({cell}) => (
        //  <div>
        //   {key === "empStatus" && cell.getValues("fte1")? <GoPerson/>:""}
        //  </div>
        // )
      });
    });

    setColumns(newHeaders);

    let values = [];
    tableData?.map((d) =>
      d.id !== -1 && d.parentId != null && d.parentId != undefined
        ? values.push(d)
        : ""
    );

    let A = jsonToTree(values, { children: "subRows" });
    let B =
      tableData != undefined
        ? JSON.parse(JSON.stringify(tableData))?.filter(
            (d) => d.id == -1 || d.parentId == null || d.parentId == undefined
          )
        : [];

    // setNodes(jsonToTree(values, { children: "subRows" }));
    setNodes([...A, ...B]);

    //   setColumns(resp.data.tableData);
    // });
  };

  useEffect(() => {
    colExpFlag ? setHiddenColumns({}) : colCollapse();
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
    <div className="expandableTable">
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
          muiTableBodyProps={{
            sx: {
              "&": {
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              },
              "& td": {
                borderTop: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                fontSize: "12px",
                height: "10px",
                lineHeight: "1",
                paddingTop: "0px",
                paddingBottom: "0px",
              },
              "& td:nth-of-type(2)": {
                width: "230px",
                maxWidth: "230px",
              },
              "& tr:first-of-type td": {
                background: "#f5d5a7 ",
              },
              // "& td:nth-of-type(odd)": {
              //   background: "#c5e8e8 ",
              // },
              // "& td:nth-of-type(even)": {
              //   background: "#facbcb ",
              // },
              // "& td:nth-of-type(1), & td:nth-of-type(2),& td:nth-of-type(3), & td:nth-of-type(4),& td:nth-of-type(5), & td:nth-of-type(6),& td:nth-of-type(7), & td:nth-of-type(8), & td:nth-of-type(9), & td:nth-of-type(10)":
              //   {
              //     background: "#D4E7FB ",
              //   },
              // "& td:last-of-type": {
              //   background: "#f2f29f ",
              // },
            },
          }}
          muiTableHeadProps={{
            sx: {
              "& th": {
                borderTop: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                background: "#f4f4f4 ",
                fontSize: "12px",
              },
              "& th:nth-of-type(2)": {
                width: "230px",
                maxWidth: "230px",
              },
            },
          }}
        />
      ) : null}
    </div>
  );
}
