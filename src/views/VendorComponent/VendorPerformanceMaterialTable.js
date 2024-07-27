import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Button, IconButton } from "@mui/material";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { AiFillRightCircle } from "react-icons/ai";
import { CListGroup } from "@coreui/react";
import { GoPerson } from "react-icons/go";

import "./VendorPerformance.scss";

export default function VendorPerformanceMaterialTable(props) {
  const { data, expandedCols, colExpandState } = props;
  console.log(data);
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
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
  }, [data]);

  const getData = () => {
    let tableData = data.tableData;
    let columns = null;

    if (data?.vmgPerformance?.includes("'")) {
      columns = data?.vmgPerformance?.replaceAll("'", "");
    } else {
      columns = data?.vmgPerformance;
    }

    console.log();
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
    console.log(headerArray);

    let unWantedCols = [
      "id",
      "department",
      "customer",
      "vendor",
      "country",
      "project",
      "resource",
      "departmentId",
      "customerId",
      "projectId",
      "vendorId",
      "empStatus",
      "lvl",
      "count",
      "keyAttr",
    ];

    let filteredHeaders = headerArray.filter(
      (d) =>
        !unWantedCols.includes(d[0]) &&
        !d[0].includes("billAmt") &&
        !d[0].includes("gm") &&
        !d[0].includes("rcount")
    );

    // let filteredHeaders = headerArray.filter(
    //   ([key, value]) => typeof value === "string" && value.includes("^&")
    // );

    console.log("in line 69----");
    console.log(filteredHeaders);

    setHeaders(filteredHeaders);

    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let minusOneRow = tableData?.filter((d) => d.id == -1);
    console.log(tableData, "tableData");
    console.log(minusOneRow, "---------minusonerow");
    filteredHeaders.map(([key, value], index) => {
      console.log(filteredHeaders);
      newHeaders.push({
        accessorKey: key,
        // header: value?.split("^&")[0],
        header: value,
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => (
          <div>
            {/* {value.split("^&")[0]} */}
            {value?.split("^&")[0]}{" "}
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

    console.log("in line 176------");
    console.log(newHeaders);

    let subHeaders = minusOneRow && Object.entries(minusOneRow[0]);

    subHeaders?.sort();
    // subHeaders?.filter(([key, value], index) => value != "");

    console.log(subHeaders, "subHeaders");
    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let subArray = [];
      subHeaders.map(([key, value], index) => {
        let a = /\d/.test(key.split("_")[0]);
        if (
          key.includes("_") &&
          (a == true || (a == false && key.split("_")[0] == "total"))
        ) {
          let subkey = key.includes("action") ? "action" : key.split("_");
          subkey = key.includes("action")
            ? "action"
            : subkey.slice(0, -1).join("_");

          if (data.accessorKey.includes(subkey)) {
            console.log(subkey, "key matched!");
            let obj = {
              id: key,
              header:
                value == null || value == 0 ? (
                  ""
                ) : (
                  <div
                    className={
                      !key.includes("actionDate") &&
                      !key.includes("actionComments")
                        ? "sm"
                        : key.includes("department") && "nullCol"
                    }
                  >
                    {value}
                  </div>
                ),
              accessorKey: key,
              Cell: ({ cell }) => {
                {
                  cell.row.original.resource != "" &&
                    console.log(cell.row.original.name, "----res");
                }
                return (
                  <div
                    className={
                      key.includes("_")
                        ? key.split("_")[0] == "total"
                          ? "total"
                          : key.split("_")[1][1] % 2 == 0
                          ? "even"
                          : "odd"
                        : key.includes("cadre") && "name"
                    }
                  >
                    {cell.column.id == "name" &&
                    cell.row.original != null &&
                    (cell.row.original.name != null ||
                      cell.row.original.name != "Summary") ? (
                      <>
                        {icons[cell.row.original["empStatus"]]}

                        {cell.getValue()}
                      </>
                    ) : (
                      cell.getValue()
                    )}
                  </div>
                );
              },
            };
            subArray.push(obj);
            // console.log(obj["header"], "---line 165")
            // console.log(obj[index]?.filter((d) => d.includes("NB %")), "=====obj")
            newHeaders[i].columns = subArray;
          }
        } else {
          //console.log("key matched!");
          if (key == data.accessorKey) {
            let obj = {
              id: key,
              header: value == null || value == 0 ? "" : <div>{value}</div>,
              accessorKey: key,
              Cell: ({ cell }) => {
                // { cell.row.original.resource != "" && console.log(cell.row.original.name, "----res") }

                return (
                  <div
                    className={
                      key.includes("_")
                        ? key.split("_")[0] == "total"
                          ? "total"
                          : key.split("_")[1][1] % 2 == 0
                          ? "even"
                          : "odd"
                        : "name"
                    }
                  >
                    {cell.column.id == "name" &&
                    cell.row.original != null &&
                    (cell.row.original.name != null ||
                      cell.row.original.name != "Summary") ? (
                      <>
                        {icons[cell.row.original["empStatus"]]}

                        {cell.getValue()}
                      </>
                    ) : (
                      cell.getValue()
                    )}
                  </div>
                );
                // <div>
                //     <p>i&nbsp;{cell.getValue()}</p>

                // </div>
              },
            };
            newHeaders[i].columns = [obj];
          }
        }
      });
    });

    console.log("in line 315----");
    console.log(newHeaders);

    setColumns(newHeaders);

    let values = [];
    tableData?.map((d) => (d.id != -2 && d.id != -3 ? values.push(d) : ""));
    console.log(values, "-------values");
    console.log(tableData);

    let A = jsonToTree(values, { children: "subRows" });
    // let B =
    //     tableData != undefined
    //         ? JSON.parse(JSON.stringify(tableData))?.filter(
    //             (d) => d.id == -1 || d.parentId == null || d.parentId == undefined
    //         )
    //         : [];

    // setNodes(jsonToTree(values, { children: "subRows" }));
    setNodes(A.slice(1, A.length));

    console.log(jsonToTree(values, { children: "subRows" }), "nodes");

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
    <div className="VendorPerformance">
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
