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
import "./BillableUtilizationTrendCollapsibleTable.scss";
import "./../RevenueMetrices/RevenueIndustrySecondTable.scss";
import { BiChevronRight } from "react-icons/bi";

export default function BillableUtilizationTrendCollapsibleTable(props) {
  // icons

  let unWantedCols = ["id"];

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
  const { data, expandedCols, colExpandState } = props;

  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const currentYear = new Date().getFullYear();
  const numberWithCommas = (x) => {
    var number = String(x);
    if (number.includes(".") == true) {
      var decimalNumbers = number;
      var num = Number(decimalNumbers);
      let FdN = num != null && num?.toFixed(2);
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

      let firstData = tableData[0];
      obj[colVal] = firstData[colVal];
    }

    let headerArray = Object.entries(obj);

    let filteredHeaders = headerArray.filter(
      ([key, value]) =>
        typeof value === "string" &&
        value.includes("^&") &&
        !key.includes("billAmt")
    );

    setHeaders(filteredHeaders);

    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let C = tableData?.filter((d) => d.id == -1);
    filteredHeaders.map(([key, value], index) => {
      newHeaders.push({
        accessorKey: key,
        header: value.split("^&")[0],
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => (
          <div
            className={
              key.includes("name") ||
              key.includes("csl") ||
              key.includes("dp") ||
              key.includes("customer") ||
              key.includes("projects") ||
              key.includes("empId") ||
              key.includes("doj") ||
              // key.includes("cader") ||
              key.includes("deptName") ||
              key.includes("supervisor") ||
              key.includes("prjMgr") ||
              key.includes("supervisor") ||
              key.includes("net_capacity") ||
              key.includes("billable_alloc") ||
              key.includes("billable_alloc_per")
                ? "mixer"
                : key.includes("cader")
                ? "mixer cader"
                : ""
            }
          >
            {key == "prjMgr" ? (
              <span>Project Manager</span>
            ) : (
              <> {value.split("^&")[0]} </>
            )}
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
            ) : null}
          </div>
        ),
      });
    });
    // Cell: ({cell}) => (
    //  <div>
    //   {key === "empStatus" && cell.getValues("fte1")? <GoPerson/>:""}
    //  </div>
    // )
    // for icons display
    let subHeaders = C
      ? Object.entries(C[0])?.filter((d) => !unWantedCols?.includes(d[0]))
      : null;
    // subHeaders?.sort();
    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let subArray = [];
      subHeaders.map(([key, value], index) => {
        let a = /\d/.test(key.split("_")[0]);
        if (key.includes("_") && a == true) {
          let subkey = key.split("_");
          subkey = subkey.slice(0, -1).join("_");
          if (data.accessorKey.includes(subkey)) {
            let obj = {
              id: key,
              header: value == null || value == 0 ? "" : value,
              accessorKey: key,
              Cell: ({ cell }) => {
                return (
                  <>
                    <div title={cell.getValue()}>
                      {cell.column.id == "name" && cell.row.original != null ? (
                        <div>
                          {icons[cell.row.original["empStatus"]]}
                          <span>{cell.getValue()}</span>
                        </div>
                      ) : key == "net_capacity" ||
                        key == "billable_alloc" ||
                        key == "billable_alloc_per" ? (
                        <div
                          className="numData toHead"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </div>
                      ) : key == "doj" ? (
                        <div className="align center doj">
                          {numberWithCommas(cell.getValue())}
                        </div>
                      ) : key.includes("billAmt") ? (
                        <div
                          className="align right doj revenueInd red"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </div>
                      ) : key.includes("nCap") ? (
                        <div
                          className="revenueInd green"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </div>
                      ) : key.includes("cader") ? (
                        <div className="align center cader">
                          {cell.getValue()}
                        </div>
                      ) : (
                        cell.getValue()
                      )}
                    </div>
                  </>
                ); // <div>
                //     <p>i&nbsp;{cell.getValue()}</p>

                // </div>
              },
            };
            subArray.push(obj);
            newHeaders[i].columns = subArray;
          }
        } else {
          if (key == data.accessorKey) {
            let obj = {
              id: key,
              header: value == null || value == 0 ? "" : value,
              accessorKey: key,
              Header: ({ column }) => (
                <div className={key.includes("cader") ? "cader" : ""}>
                  {value}
                </div>
              ),
              Cell: ({ cell }) => {
                return (
                  <>
                    <div title={cell.getValue()}>
                      {cell.column.id == "name" && cell.row.original != null ? (
                        <div>
                          {icons[cell.row.original["empStatus"]]}
                          <span>{cell.getValue()}</span>
                        </div>
                      ) : key == "net_capacity" ||
                        key == "billable_alloc" ||
                        key == "billable_alloc_per" ? (
                        <div
                          className="numData"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </div>
                      ) : key == "doj" ? (
                        <div class="align center doj">{cell.getValue()}</div>
                      ) : key.includes("cader") ? (
                        <div className="align left cader">
                          {cell.getValue()}
                        </div>
                      ) : key.includes("billAmt") ? (
                        <div
                          className="align center doj blue revenueInd red"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </div>
                      ) : key.includes("nCap") ? (
                        <div
                          className="revenueInd green"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </div>
                      ) : (
                        <div title={cell.getValue()}>{cell.getValue()}</div>
                      )}
                    </div>
                  </>
                ); // <div>
                //     <p>i&nbsp;{cell.getValue()}</p>

                // </div>
              },
            };

            newHeaders[i].columns = [obj];
          }
        }
      });
    });

    setColumns(newHeaders);

    let values = [];
    let minusOneRow = [];

    tableData?.map((d) => (d.id !== -1 ? values.push(d) : minusOneRow.push(d)));

    console.log(values, "values");

    let tempData = jsonToTree(values, { children: "subRows" });

    let finalData = [...tempData.slice(2, tempData.length)];
    setNodes(finalData);
    // console.log(finalData);
    // console.log(jsonToTree(values, { children: "subRows" }), "nodes");

    //   setColumns(resp.data.tableData);
    // });
  };

  // useEffect(() => {
  //   colExpFlag ? setHiddenColumns({}) : colCollapse();
  // }, [colExpFlag]);

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
  useEffect(() => {
    colExpFlag ? expandT() : expandF();
    // getData();
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
      className="materialReactExpandableTable billableUtilTrendTable darkHeader"
      style={{ marginTop: "20px" }}
    >
      {nodes.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={true} //hide expand all double arrow in column header
          enableExpanding={false}
          enablePagination={false}
          enableRowVirtualization
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableSorting={false}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          enablePinning
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            columnPinning: { right: ["total"], left: ["name"] },
          }} //expand all rows by default
          state={{ columnVisibility: { ...hiddenColumns } }}
          //paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
          defaultColumn={{ minSize: 40, maxSize: 1000, size: 130 }} //units are in px
          muiTableContainerProps={{
            sx: { maxHeight: "75vh", width: "auto", maxWidth: "fit-content" },
          }}
          muiTableBodyProps={{
            sx: {
              "&": {
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              },
              "& td": {
                borderRight: "1px solid #ccc",
                height: "22px",
                padding: "0px 5px",
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
            },
          }}
        />
      ) : null}
    </div>
  );
}
