import React, { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { FaHistory } from "react-icons/fa";
import DynamicTables from "./RoleCostHistory";
import "./Rolecost.scss";

export default function RoleCostView(props) {
  const { formData, data, details, displayedCountryName } = props;
  const [columns, setColumns] = useState(null);
  const [open, setOpen] = useState(false);
  const [roleHistoryId, setRoleHistoryId] = useState();

  useEffect(() => {}, [columns]);

  useEffect(() => {
    defineColumns();
  }, [data]);
  const handleHistoryIconChange = (row) => {
    const roundedCost = row.Cost?.toFixed(2);
    const roundedPrevCost = row.prevCost?.toFixed(2);
    const roundedComputedCost = row.ComputedCost?.toFixed(2);
    const roundedBillRate = row.BillRate?.toFixed(2);
    setRoleHistoryId({
      ...row,
      Cost: roundedCost,
      prevCost: roundedPrevCost,
      ComputedCost: roundedComputedCost,
      BillRate: roundedBillRate,
    });

    setOpen(true);
  };

  const defineColumns = () => {
    const subHeaders = {
      "Recent Cost": "Cost",
      "Previous Cost": "prevCost",
      "Avg cost %": "prevCostPer",
      "Computed Cost": "ComputedCost",
      "Bill Rate": "BillRate",
    };

    const subHeaderKeys = Object.keys(subHeaders);

    const columnsString = data?.columns;
    const columnsArray = columnsString?.split(",");

    const headers = [];
    columnsArray?.forEach((column) => {
      const set = null;
      if (column.includes("_") && !column.includes("role")) {
        column = column.replaceAll("'", "");
        const headSubHead = column.split("_");
        headSubHead.pop();
        if (headSubHead.length > 1) {
          const joinedHeader = headSubHead.join(" ");
          headers.push(joinedHeader);
        } else headers.push(headSubHead[0]);
      } else {
        column.includes("Role Type") || column.includes("Cadre")
          ? headers.push(column)
          : "";
      }
    });
    const uniqueHeaders = new Set(headers);

    const newColumns = [];
    uniqueHeaders.forEach((header) => {
      const accessorKeyFromHeaderArray = header.split(" ");
      const accessorKeyFromHeader = accessorKeyFromHeaderArray.join("_");
      let newObject = null;
      if (header !== "Role Type" && header !== "Cadre") {
        const subHeaderColumns = [];
        subHeaderKeys.forEach((subHeaderKey) => {
          let colObj = {
            id: accessorKeyFromHeader + "_" + subHeaders[subHeaderKey],
            header: subHeaderKey,
            accessorKey: accessorKeyFromHeader + "_" + subHeaders[subHeaderKey],
            Cell: ({ row }) => {
              const value =
                row.original[
                  accessorKeyFromHeader + "_" + subHeaders[subHeaderKey]
                ];
              const formattedValue =
                (subHeaderKey === "Recent Cost" ||
                  subHeaderKey === "Previous Cost" ||
                  subHeaderKey === "Computed Cost") &&
                typeof value === "number" ? (
                  <>
                    <span style={{ float: "left" }}>
                      {" "}
                      {value == " " ||
                      value == null ||
                      value == "null" ||
                      value == undefined ||
                      value == "undefined"
                        ? ""
                        : "$"}{" "}
                    </span>
                    <span className="roleViewStyle"> {value}</span>
                  </>
                ) : (
                  <>
                    <span style={{ float: "left" }}>
                      {" "}
                      {value == " " ||
                      value == null ||
                      value == "null" ||
                      value == undefined ||
                      value == "undefined"
                        ? ""
                        : ""}{" "}
                    </span>
                    <span className="roleViewStyle">
                      {typeof value === "string"
                        ? Number(value).toFixed(2)
                        : value}
                    </span>
                  </>
                );
              return <div>{formattedValue}</div>;
            },
          };
          subHeaderColumns.push(colObj);
        });
        newObject = {
          id: header,
          header: header,
          columns: subHeaderColumns,
        };
      } else {
        newObject = {
          id: header,
          header: header,
          accessorKey: header == "Role Type" ? header : accessorKeyFromHeader,
          Cell: ({ row }) => {
            if (header === "Role Type") {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      marginLeft: "4px",
                      width: "90%",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                    title={row.original["Role Type"]}
                  >
                    {row.original["Role Type"]}
                  </span>{" "}
                  <span>
                    <FaHistory
                      style={{ cursor: "pointer" }}
                      onClick={() => handleHistoryIconChange(row.original)}
                    />
                  </span>
                </div>
              );
            }

            if (header === "Cadre") {
              return (
                <div>
                  <span
                    style={{ marginLeft: "4px" }}
                    title={row.original?.Cadre}
                  >
                    {row.original?.Cadre}{" "}
                  </span>
                </div>
              );
            }
          },
        };
      }

      newColumns.push(newObject);
    });
    setColumns(newColumns);
  };
  {
  }

  return (
    <>
      <div className="darkHeader tableStyle materialReactExpandableTable Role-Costs-for-country-table">
        <div className="col-md-12">
          <h2 className="countryTitle">
            {" "}
            Role Costs for {displayedCountryName}
          </h2>
        </div>
        {columns && (
          <MaterialReactTable
            localization={{
              noRecordsToDisplay: <label>No records found</label>,
            }}
            columns={columns}
            data={details.length > 1 ? details : []}
            enablePagination={true}
            enableGlobalFilter={true}
            enableDensityToggle={false}
            enableFullScreenToggle={false}
            enableHiding={false}
            enableColumnFilters={false}
            enableBottomToolbar={true}
            enableTopToolbar={true}
            enableColumnActions={false}
            enableSorting={true}
            initialState={{
              density: "compact",
              pagination: { pageSize: 25 },
              showGlobalFilter: true,
            }}
            filterFromLeafRows
            enablePinning={false}
            muiSearchTextFieldProps={{
              variant: "outlined",
            }}
            muiTableBodyProps={{
              sx: {
                "&": {},
                "& td": {
                  fontFamily: "Source Sans Pro",
                  borderRight: "1px solid #ccc",
                  height: "22px",
                  fontSize: "13px",
                  paddingTop: "0px",
                  paddingBottom: "0px",
                },
              },
            }}
            muiTableHeadProps={{
              sx: {
                "& th": {
                  fontFamily: "Source Sans Pro",
                  borderTop: "1px solid #ccc",
                  borderRight: "1px solid #ccc",
                  background: "#f4f4f4 ",
                  fontSize: "13px",
                  padding: "0px 8px",
                },
              },
            }}
          />
        )}
      </div>
      {open ? (
        <DynamicTables
          data={details}
          open={open}
          setOpen={setOpen}
          formData={formData}
          roleHistoryId={roleHistoryId}
          displayedCountryName={displayedCountryName}
        />
      ) : (
        ""
      )}
    </>
  );
}
