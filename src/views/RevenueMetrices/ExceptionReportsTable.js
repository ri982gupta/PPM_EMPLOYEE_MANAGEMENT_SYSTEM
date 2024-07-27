import React, { useState, useEffect, useRef } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton } from "@mui/material";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { BiChevronRight, BiChevronUp } from "react-icons/bi";

export default function ExceptionReportsTable(props) {
  const { data, expandedCols, colExpandState } = props;

  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);

  const numberWithCommas = (x) => {
    var number = String(x);
    if (number.includes(".")) {
      if (number.includes(".00")) {
        // var number = parseFloat(x);
        return number;
      } else {
        var decimalNumbers = number;
        var num = Number(decimalNumbers);
        let FdN = num != null && num?.toFixed(2);
        // let final = FdN.split(".");
        // final[0] = final[0]?.replace(/(\d)(?=(\d{2})+\d$)/g, "$1,");
        // final[1] = final[1]?.replace(/(\d{3})(?=\d)/g, "$1,");

        return FdN;
      }
    } else {
      // var number = parseFloat(x);
      return number;
    }
  };

  useEffect(() => {
    getData();
  }, [data?.tableData]);
  var count = 0;
  const getData = () => {
    let expandClass = "";
    if (colExpFlag == true && count > 0) {
      expandClass = "expanded";
    } else {
      expandClass = "";
    }

    let tableData = data?.tableData;

    let columns = null;

    if (data?.columnData?.includes("'")) {
      columns = data?.columnData?.replaceAll("'", "");
    } else {
      columns = data?.columnData?.replaceAll("'", "");
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
      ([key, value]) => typeof value === "string"
    );

    tableData = tableData?.filter((data, index) => index !== 0);

    //setHeaders(filteredHeaders);

    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));
    setHeaders(columns);

    filteredHeaders.map(([key, value], index) => {
      newHeaders.push({
        accessorKey: key,
        header: value,
        enableColumnActions: false,
        enableHiding: true,
        rowspan: 5,

        Header: ({ column }) => (
          <div>
            {value}
            {key == colExpandState[2] ? (
              <span className={`expandIcon ${expandClass}`}>
                <IconButton
                  //title="expandIcon"
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
        Cell: ({ cell }) => {
          return (
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={cell.getValue()}
            >
              {cell.column.id.includes("gmper") ||
              cell.column.id.includes("billrate") ||
              cell.column.id.includes("bill_rate") ||
              cell.column.id.includes("cost") ? (
                <div className="align right">
                  {numberWithCommas(cell.getValue())}
                </div>
              ) : cell.getValue() != null ? (
                cell.getValue().split("^")[0]
              ) : (
                cell.getValue()
              )}
            </div>
          );
        },
      });
    });

    setColumns(newHeaders);
    setNodes(tableData);
  };

  const colCollapse = () => {
    let hiddenHeaders = [];
    if (headers && Array.isArray(headers)) {
      headers.forEach(({ key, value }) => {
        if (expandedCols?.includes(key)) {
          hiddenHeaders.push({ [key]: false });
        }
      });
    } else if (Array.isArray(expandedCols)) {
      expandedCols.forEach((key) => {
        hiddenHeaders.push({ [key]: false });
      });
    }

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

  return (
    <div className="materialReactExpandableTable engagementAllocationsTable darkHeader">
      {nodes?.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={false}
          // enableExpanding
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
            columnPinning: { right: ["total"] },
          }}
          state={{ columnVisibility: { ...hiddenColumns } }}
          defaultColumn={{ minSize: 40, maxSize: 180, size: 40 }}
          enableStickyHeader
          muiTableContainerProps={{
            sx: {
              maxHeight: "50vh",
              width: "100%",
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
        />
      ) : null}
    </div>
  );
}
