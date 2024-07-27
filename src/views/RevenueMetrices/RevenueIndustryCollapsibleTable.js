import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Button, IconButton } from "@mui/material";

import { AiFillRightCircle } from "react-icons/ai";
import { CListGroup } from "@coreui/react";
import { GoPerson } from "react-icons/go";
import "./RevenueIndustryCollapsibleTable.scss";
import { CellComp } from "ag-grid-community";
export default function RevenueIndustryCollapsibleTable(props) {
  const { data, expandedCols, colExpandState } = props;

  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  let newHeaders = [];
  let summaryHeaders = [];

  const numberWithCommas = (x) => {
    return x?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    getData();
  }, [data]);

  const getData = () => {
    let tableData = data?.tableData;
    let columns = null;

    if (data?.columns?.includes("'")) {
      columns = data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.columns;
    }

    let colArr = columns?.split(",");

    let hiddenHeaders = [];

    const obj = {};

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();

      let firstData = tableData[0];
      obj[colVal] = firstData[colVal];
    }
    let headerArray = Object.entries(obj);

    // =====================removing unwanted headers==============================

    let unWantedCols = [
      "id",
      "industryId",
      "industry",
      "customerId",
      "customer",
      "lvl",
      "keyAttr",
      "parentAttr",
      "total_rr_sort",
    ];
    let filteredHeaders = headerArray.filter(
      (d) =>
        !unWantedCols.includes(d[0]) &&
        !d[0]?.includes("gmperc") &&
        !d[0]?.includes("rr")
    );

    // ======================================================================================

    setHeaders(filteredHeaders);

    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let minusOneRoww = tableData?.filter((d) => d.id == -1);
    let summaryRow = tableData?.filter((d) => d.id == 0);

    filteredHeaders.map(([key, value], index) => {
      newHeaders.push({
        accessorKey: key,
        header: value,
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => (
          <div className={key.includes("dispName") && "mixer"}>
            {value}
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
      });
    });

    let subHeaders = minusOneRoww ? Object.entries(minusOneRoww[0]) : null;
    summaryHeaders = summaryRow ? Object.entries(summaryRow[0]) : null;

    subHeaders?.sort();
    summaryHeaders?.sort();

    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let subArray = [];
      subHeaders.map(([key, value], index) => {
        let a = /\d/.test(key.split("_")[0]);

        if (
          (key.includes("_") &&
            (a == true || (a == false && key.split("_")[0] == "total"))) ||
          (a == false && key.includes("action"))
        ) {
          let subkey = key.includes("action") ? "action" : key.split("_");
          subkey = key.includes("action")
            ? "action"
            : subkey.slice(0, -1).join("_");
          if (data.accessorKey.includes(subkey)) {
            let obj = {
              id: key,
              header: value == null || value == 0 ? "" : value,
              accessorKey: key,
              enableSorting: true,
              sortDescFirst:
                key.includes("rr") && !key.includes("perc") ? true : false,
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
              enableSorting: true,
              sortDescFirst:
                key.includes("rr") && !key.includes("perc") ? true : false,
            };
            newHeaders[i].columns = [obj];
          }
        }
      });
    });

    const renderValue = (value, key) => {
      return (
        <div title={numberWithCommas(value)}>
          <div className="ParentExpandedTxt">
            {key.includes("gmperc") ? (
              <b className="RevByIndustryFonts">
                {numberWithCommas(value) + "%"}
              </b>
            ) : key.includes("rrperc") ? (
              <b className="RevByIndustryFonts">
                {numberWithCommas(value) + "%"}
              </b>
            ) : key.includes("gmperc") || key.includes("rrperc") ? (
              numberWithCommas(value) + "%"
            ) : key == "dispName" && value == "Summary" ? (
              <b className="RevByIndustryFonts">{value}</b>
            ) : (
              numberWithCommas(value)
            )}
          </div>
        </div>
      );
    };

    newHeaders.map((headers) => {
      headers.columns.map((column) => {
        summaryHeaders.map(([key, value]) => {
          if (key == column.accessorKey) {
            column.columns = [
              {
                id: key,
                header: renderValue(value, key),
                accessorKey: key,
                Cell: ({ cell }) => {
                  return (
                    <div
                      style={{
                        justifyContent: key == "dispName" ? "left" : "right",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={numberWithCommas(cell.getValue())}
                    >
                      {cell.column.id == "name" &&
                      cell.row.original.parentId != null ? (
                        <span>
                          <div className="ChildExpandedTxt">
                            {numberWithCommas(cell.getValue())}
                          </div>
                        </span>
                      ) : (
                        <div
                          className={
                            cell.row.original.parentId != null
                              ? "ChildExpandedTxt"
                              : "ParentExpandedTxt"
                          }
                        >
                          {key.includes("gmperc") &&
                          cell.row.original.dispName == "Summary" ? (
                            <b className="RevByIndustryFonts">
                              {numberWithCommas(cell.getValue()) + "%"}
                            </b>
                          ) : key.includes("rrperc") &&
                            cell.row.original.dispName == "Summary" ? (
                            <b className="RevByIndustryFonts">
                              {numberWithCommas(cell.getValue()) + "%"}
                            </b>
                          ) : key.includes("gmperc") ||
                            key.includes("rrperc") ? (
                            numberWithCommas(cell.getValue()) + "%"
                          ) : key == "dispName" &&
                            cell.getValue() == "Summary" ? (
                            <b
                              className="RevByIndustryFonts"
                              style={{ textAlign: "left", color: "red" }}
                            >
                              {cell.getValue()}
                            </b>
                          ) : cell.row.original.dispName == "Summary" ? (
                            <b className="RevByIndustryFonts">
                              {numberWithCommas(cell.getValue())}
                            </b>
                          ) : (
                            numberWithCommas(cell.getValue())
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              },
            ];
          }
        });
      });
    });

    setColumns(newHeaders);
    let values = [];
    let minusOneRow = [];

    tableData?.map((d) =>
      d.id !== -1 && d.id !== 0 ? values.push(d) : minusOneRow.push(d)
    );

    let tempData = jsonToTree(values, { children: "subRows" });

    let finalData = [...tempData.slice(2, tempData.length)];
    setNodes(finalData);
    // =================================================================================
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
      id: "id",
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

  const initialSortingState = () => {
    let initialSortids = [];
    columns?.map((column) => {
      column?.columns.map((col) => {
        col.accessorKey.includes("total_rr") &&
        !col?.accessorKey.includes("perc")
          ? initialSortids.push({ id: col.accessorKey, desc: true })
          : "";
      });
    });
    return initialSortids;
  };

  const sortColumns = (cols) => {
    let sortedColumns = cols;

    let sort_key = ["Rec. Rev ($)", "GM ($)", "GM (%)", "Rec.Rev (%)"];
    let topHeaders = summaryHeaders;
    sortedColumns.map((column) => {
      column.columns.sort(
        (a, b) => sort_key.indexOf(a.header) - sort_key.indexOf(b.header)
      );
    });
    return sortedColumns;
  };

  return (
    <div className="RevByIndustryTable darkHeader toHead">
      {nodes.length ? (
        <MaterialReactTable
          columns={sortColumns(columns)}
          data={nodes}
          enableExpandAll={true}
          enableExpanding
          enablePagination={false}
          enableSortingRemoval={true}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableSorting={true}
          filterFromLeafRows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            enablePinning: true,
            columnPinning: { left: ["mrt-row-expand", "dispName"] },
            sorting: initialSortingState(),
          }}
          state={{ columnVisibility: { ...hiddenColumns } }}
          defaultColumn={{ minSize: 40, maxSize: 1000, size: 40 }}
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
              "& td:first-of-type": {
                borderLeft: "1px solid #ccc",
                minWidth: "60px",
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
              },
              "& th:first-of-type": {
                borderLeft: "1px solid #ccc",
                minWidth: "60px",
              },
            },
          }}
        />
      ) : null}
    </div>
  );
}
