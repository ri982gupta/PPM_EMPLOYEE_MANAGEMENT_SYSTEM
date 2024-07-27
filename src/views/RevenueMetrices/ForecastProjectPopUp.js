import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import "./MonthlyForecastRevenueCalenderTable.scss";
import { Link } from "react-router-dom";

export default function ForecastProjectPopUp(props) {
  const {
    data,
    expandedCols,
    colExpandState,
    formData,
    setFormData,
    linkId,
    resourcedata,
  } = props;
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [ProjectLinkId, setProjectLinkId] = useState(null);

  useEffect(() => {
    getData();
  }, [data]);

  const getData = () => {
    let tableData = data.tableData;
    let projectId = tableData
      ?.filter((d) => d.Id !== -1 && d.Id !== -2 && d.Id !== 999)
      .map((d) => d.Id);

    setProjectLinkId(projectId && projectId.length > 0 ? projectId[0] : null);

    let columns = null;

    if (data?.columns?.includes("'")) {
      columns = data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.columns;
    }

    let dd = columns?.split(",");
    let colArr = null;

    if (dd != undefined) {
      colArr = [...dd];
    }

    let newHeaders = [];
    let hiddenHeaders = [];

    const obj = {};

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();

      let firstData = tableData[0];
      obj[colVal] = firstData[colVal];
    }

    let headerArray = Object.entries(obj);

    let unWantedCols = ["Id", "Rate", "Cost"];

    let filteredHeaders = headerArray.filter(
      (d) => !unWantedCols.includes(d[0])
    );
    setHeaders(filteredHeaders);

    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });
    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let C = tableData?.filter((d) => d.Id == -1);

    filteredHeaders.map(([key, value], index) => {
      newHeaders.push({
        accessorKey: key,
        header: value,
        enableColumnActions: false,
        enableHiding: true,
        rowspan: 5,
        Header: ({ column }) => (
          <div
            className={
              key.includes("_L") || key?.includes("_N")
                ? "disabledDatesColumn"
                : key.includes("Name")
                ? "project mixer"
                : (resourcedata?.resourcecapType === "allocations" ||
                    resourcedata?.resourcecapType === "assigned" ||
                    resourcedata?.resourcecapType === "unassigned") &&
                  key.includes("Role")
                ? "role mixer"
                : key.includes("Name") || key.includes("Total")
                ? "mixer"
                : "datesColumn"
            }
          >
            {value}{" "}
          </div>
        ),
      });
    });
    let subHeaders =
      C && Object.entries(C[0])?.filter((d) => !unWantedCols?.includes(d[0]));

    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      subHeaders.map(([key, value], index) => {
        if (key == data.accessorKey) {
          let obj = {
            id: key,
            header: (
              <div
                className={
                  key.includes("_L") || key?.includes("_N")
                    ? "disabledDatesColumn"
                    : key.includes("_W")
                    ? "datesColumn"
                    : value == "" || value == null || value == undefined
                    ? ""
                    : "datesColumn"
                }
                title={value}
              >
                {" "}
                {value == null || value == 0 ? "" : value}
              </div>
            ),
            accessorKey: key,
            enableSorting: true,
            sortingFn: (rowB, rowA, columnId) => {
              const isRowTotal = (row) => row.original.Name === "Total";
              const commonSorting = () => {
                if (isRowTotal(rowA) || isRowTotal(rowB)) {
                  return 0;
                }
                const valueA = (rowB.getValue(columnId) || "").toLowerCase();
                const valueB = (rowA.getValue(columnId) || "").toLowerCase();
                console.log(rowB);
                if (
                  /^\d{4}_\d{2}_\d{2}$/.test(columnId) ||
                  columnId == "Revenue" ||
                  columnId == "Total"
                ) {
                  return (
                    (rowB.getValue(columnId) &&
                    rowB.getValue(columnId).includes("_holiday")
                      ? rowB.getValue(columnId).split("_")[0]
                      : rowB.getValue(columnId) || 0) -
                    (rowA.getValue(columnId) &&
                    rowA.getValue(columnId).includes("_holiday")
                      ? rowA.getValue(columnId).split("_")[0]
                      : rowA.getValue(columnId) || 0)
                  );
                } else {
                  return valueA.localeCompare(valueB);
                }
              };

              if (columnId) {
                return isRowTotal(rowA) || isRowTotal(rowB)
                  ? 0
                  : commonSorting();
              }
            },
            Cell: ({ cell }) => {
              return (
                <>
                  {cell.column.id == "Name" && cell.row.original != null ? (
                    <>
                      {cell.row.original.Name == "Total" ? (
                        "Total"
                      ) : (
                        <Link
                          title={cell.getValue().split("_")[0]}
                          to={`/project/capacityPlan/:${
                            projectId && projectId.length > 0
                              ? projectId[0]
                              : null
                          }`}
                          target="_blank"
                        >
                          {cell.getValue().split("_")[0]}
                        </Link>
                      )}
                    </>
                  ) : cell.getValue() != null &&
                    cell.getValue().split("_")[1] == "leave" ? (
                    <span
                      className="datesColumn pink align right "
                      title={cell.getValue().split("_")[0]}
                    >
                      {cell.getValue().split("_")[0]}
                    </span>
                  ) : cell.getValue() == "0_holday" ||
                    cell.getValue() == "0.00_holday" ? (
                    <span
                      className="datesColumn blue align right "
                      title={cell.getValue().split("_")[0]}
                    >
                      {cell.getValue().split("_")[0]}
                    </span>
                  ) : (cell.getValue() != null && key.includes("_L")) ||
                    key.includes("_W") ||
                    key.includes("_N") ? (
                    <span
                      className="disabledDatesColumn   align right"
                      title={cell.getValue()}
                    >
                      {cell.getValue()}
                    </span>
                  ) : key.includes("Role") && cell.getValue() != null ? (
                    <div className="role" title={cell.getValue()}>
                      {cell.getValue()}
                    </div>
                  ) : key.includes("_L") ? (
                    <div class="disabledDatesColumn" title={cell.getValue()}>
                      {" "}
                      {cell.getValue()}
                    </div>
                  ) : key.includes("_W") ? (
                    <div class="disabledDatesColumn " title={cell.getValue()}>
                      {" "}
                      {cell.getValue()}
                    </div>
                  ) : (
                    <div
                      className="datesColumn align right"
                      title={cell.getValue()}
                    >
                      {cell.getValue()}
                    </div>
                  )}
                </>
              );
            },
          };

          newHeaders[i].columns = [obj];
        }
      });
    });

    setColumns(newHeaders);

    let values = [];

    let B = tableData?.filter((d) => d.Id !== -1 && d.Id !== -2);

    setNodes(B);
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

  return (
    <div className="materialReactExpandableTable calenderTable allocationsCalenderTable darkHeader">
      {nodes?.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          // enableExpandAll={true} //hide expand all double arrow in column header
          // enableExpanding
          enablePagination={false}
          //enableRowVirtualization
          enableGlobalFilter={true}
          // enableGlobalFilterModes={searchFilter}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableColumnFilters={false}
          enableBottomToolbar={false}
          enableTopToolbar={true}
          enableColumnActions={false}
          // enableSorting={false}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          initialState={{
            showGlobalFilter: true,
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
          }} //expand all rows by default
          state={{ columnVisibility: { ...hiddenColumns } }}
          //paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
          defaultColumn={{ minSize: 40, maxSize: 1000, size: 40 }} //units are in px
          enableStickyHeader
          muiSearchTextFieldProps={{
            // placeholder: "Search all users",
            // sx: { minWidth: "300px" },
            variant: "outlined",
          }}
          muiTableContainerProps={{
            sx: { maxHeight: "50vh" }, //give the table a max height
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
              "tr:nth-of-type(2) th": {
                zIndex: "auto",
              },
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
