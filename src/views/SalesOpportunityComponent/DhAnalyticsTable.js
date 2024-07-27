import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import "./SalesOpportunity.scss";

const DhAnalyticsTable = (props) => {
  const { data } = props;

  const [expandedRows, setExpandedRows] = useState(() => {
    const initialExpandedRows = {};
    data.dhOppt.slice(2).forEach((item, rowIndex) => {
      if (item.lvl <= 1) {
        initialExpandedRows[rowIndex] = true;
      }
    });
    return initialExpandedRows;
  });

  const excludedColumns = ["id", "type_id", "lvl", "owner_name_copy", -2];

  const totalColumns = [
    "total_assigned",
    "total_won",
    "total_lost",
    "total_active",
  ];

  const columnsOrder = data.columns.split(",");

  const opptKeys = columnsOrder.filter((key) => key in data.dhOppt[0]);

  const headers = [
    ...new Set(
      ["name", ...opptKeys]
        .filter(
          (key) => !excludedColumns.includes(key) && !totalColumns.includes(key)
        )
        .concat(totalColumns)
    ),
  ];

  const toggleRow = (index) => {
    setExpandedRows({
      ...expandedRows,
      [index]: !expandedRows[index],
    });
  };

  const isRowExpanded = (index) => {
    return expandedRows[index];
  };
  const rowData = headers.map((header) => data.dhOppt[0][header]);
  const rowData1 = headers.map((header) => data.dhOppt[1][header]);

  const modifiedRowData = rowData.map((value) =>
    value?.includes("^&Q")
      ? value?.split("^&")[4]
      : value?.includes("Owner^&")
      ? "Owner"
      : value?.includes("Total^&")
      ? value.split("^&")[3]
      : value
  );

  const modifiedRowData1 = rowData1.map((value) =>
    value?.includes("^&") ? value?.split("^&")[0] : value
  );
  const nonNullHeaders = modifiedRowData.filter((header) => header !== null);
  const nonNullHeaders1 = modifiedRowData1.filter((header) => header !== null);

  return (
    <div
      className="col-lg-12 col-md-12 col-sm-12 no-padding scrollit darkHeader toHead"
      style={{ overflow: "auto", maxHeight: "635px" }}
    >
      <table className="table table-bordered opportunityTable tableSummary">
        <thead className="stickyHeader">
          <tr className="">
            {nonNullHeaders.map((value, colIndex) => (
              <th
                rowSpan={value.includes("Owner") ? "2" : "1"}
                colSpan={
                  value.includes("_Q") ? "4" : value.includes("Total") ? "4" : 1
                }
                key={colIndex}
                title={value}
              >
                {value}
              </th>
            ))}
          </tr>
          <tr>
            {nonNullHeaders1.map((header, colIndex) => (
              <th key={colIndex} title={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.dhOppt.slice(2).map((item, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {item.lvl <= 1 && (
                <tr>
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className={
                        header.toLowerCase().includes("total") && item.lvl == 1
                          ? "totalStyle"
                          : (header.toLowerCase().includes("_01_01") &&
                              item.lvl == 1) ||
                            (header.toLowerCase().includes("_07_01") &&
                              item.lvl == 1)
                          ? "evenColor"
                          : (header.toLowerCase().includes("_10_01") &&
                              item.lvl == 1) ||
                            (header.toLowerCase().includes("_04_01") &&
                              item.lvl == 1)
                          ? "oddColor"
                          : (header.toLowerCase().includes("_01_01") &&
                              item.lvl == 0) ||
                            (header.toLowerCase().includes("_07_01") &&
                              item.lvl == 0)
                          ? "innerevenColor"
                          : (header.toLowerCase().includes("_10_01") &&
                              item.lvl == 0) ||
                            (header.toLowerCase().includes("_04_01") &&
                              item.lvl == 0)
                          ? "inneroddColor"
                          : header.toLowerCase().includes("total") &&
                            item.lvl == 0
                          ? "innertotalStyle"
                          : header == "name" && item.lvl == 1
                          ? "lvl1Name"
                          : item[header]
                      }
                      title={
                        !isNaN(item[header])
                          ? item[header]?.includes("^&2^&1")
                            ? Number(
                                item[header]?.split("^&")[0]
                              ).toLocaleString()
                            : (Number(item[header]).toLocaleString("en-US") ==
                                "0" &&
                                item.lvl == 1) ||
                              (item.lvl == 0 && item.name == "Summary")
                            ? ""
                            : (Number(item[header]).toLocaleString("en-US") ==
                                "0" &&
                                item.name == "Average Deal Size") ||
                              (Number(item[header]).toLocaleString("en-US") ==
                                "0" &&
                                item.name == "Actual Hours") ||
                              (Number(item[header]).toLocaleString("en-US") ==
                                "0" &&
                                item.name == "Estimated Hours") ||
                              (Number(item[header]).toLocaleString("en-US") ==
                                "0" &&
                                item.name == "Average Elapsed Time")
                            ? "-"
                            : Number(item[header]).toLocaleString("en-US")
                          : item[header]?.includes("^&2^&1")
                          ? item[header]?.split("^&")[0]
                          : item[header] == "0"
                          ? ""
                          : item[header]
                      }
                    >
                      {colIndex === 0 && item.lvl === 1 && (
                        <span onClick={() => toggleRow(rowIndex)}>
                          {isRowExpanded(rowIndex) ? (
                            <FaAngleDown
                              title="Collapse"
                              style={{ cursor: "pointer" }}
                            />
                          ) : (
                            <FaAngleRight
                              title="Expand"
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </span>
                      )}
                      {!isNaN(item[header])
                        ? item[header]?.includes("^&2^&1")
                          ? Number(
                              item[header]?.split("^&")[0]
                            ).toLocaleString()
                          : (Number(item[header]).toLocaleString("en-US") ==
                              "0" &&
                              item.lvl == 1) ||
                            (item.lvl == 0 && item.name == "Summary")
                          ? ""
                          : (Number(item[header]).toLocaleString("en-US") ==
                              "0" &&
                              item.name == "Average Deal Size") ||
                            (Number(item[header]).toLocaleString("en-US") ==
                              "0" &&
                              item.name == "Actual Hours") ||
                            (Number(item[header]).toLocaleString("en-US") ==
                              "0" &&
                              item.name == "Estimated Hours") ||
                            (Number(item[header]).toLocaleString("en-US") ==
                              "0" &&
                              item.name == "Average Elapsed Time")
                          ? "-"
                          : Number(item[header]).toLocaleString("en-US")
                        : item[header]?.includes("^&2^&1")
                        ? item[header]?.split("^&")[0]
                        : item[header] == "0"
                        ? ""
                        : item[header]}
                      {colIndex === 0 &&
                        (item.name.includes("Average Deal Size") ? (
                          <span className="alignRight">($)</span>
                        ) : item.name.includes("Opportunity Amount") ? (
                          <span className="alignRight">($)</span>
                        ) : item.name.includes("Actual Hours") ? (
                          <span className="alignRight">(hrs.)</span>
                        ) : item.name.includes("Estimated Hours") ? (
                          <span className="alignRight">(hrs.)</span>
                        ) : item.name.includes("Average Elapsed Time") ? (
                          <span className="alignRight">(days)</span>
                        ) : (
                          ""
                        ))}
                    </td>
                  ))}
                </tr>
              )}

              {isRowExpanded(rowIndex) &&
                data.dhOppt
                  .slice(2)
                  .filter(
                    (lvl2Item) =>
                      lvl2Item.lvl === 2 &&
                      lvl2Item.owner_name_copy === item.owner_name_copy
                  )
                  .map((lvl2Item, lvl2Index) => (
                    <tr key={`lvl2_${lvl2Index}`}>
                      {headers.map((header, colIndex) => (
                        <td
                          className={
                            header.toLowerCase().includes("total")
                              ? "innertotalStyle"
                              : header.toLowerCase().includes("_01_01") ||
                                header.toLowerCase().includes("_07_01")
                              ? "innerevenColor"
                              : header.toLowerCase().includes("_10_01") ||
                                header.toLowerCase().includes("_04_01")
                              ? "inneroddColor"
                              : header === "name"
                              ? "nameStyle"
                              : item[header]
                          }
                          key={colIndex}
                          title={
                            !isNaN(lvl2Item[header])
                              ? lvl2Item[header]?.includes("^&2^&1")
                                ? Number(
                                    lvl2Item[header]?.split("^&")[0]
                                  ).toLocaleString("en-US")
                                : (Number(lvl2Item[header]).toLocaleString(
                                    "en-US"
                                  ) == "0" &&
                                    lvl2Item.name == "Average Deal Size") ||
                                  (Number(lvl2Item[header]).toLocaleString(
                                    "en-US"
                                  ) == "0" &&
                                    lvl2Item.name == "Actual Hours") ||
                                  (Number(lvl2Item[header]).toLocaleString(
                                    "en-US"
                                  ) == "0" &&
                                    lvl2Item.name == "Estimated Hours") ||
                                  (Number(lvl2Item[header]).toLocaleString(
                                    "en-US"
                                  ) == "0" &&
                                    lvl2Item.name == "Average Elapsed Time")
                                ? "-"
                                : Number(lvl2Item[header]).toLocaleString(
                                    "en-US"
                                  )
                              : lvl2Item[header]?.includes("^&2^&1")
                              ? lvl2Item[header]?.split("^&")[0]
                              : lvl2Item[header]
                          }
                        >
                          {!isNaN(lvl2Item[header])
                            ? lvl2Item[header]?.includes("^&2^&1")
                              ? Number(
                                  lvl2Item[header]?.split("^&")[0]
                                ).toLocaleString("en-US")
                              : (Number(lvl2Item[header]).toLocaleString(
                                  "en-US"
                                ) == "0" &&
                                  lvl2Item.name == "Average Deal Size") ||
                                (Number(lvl2Item[header]).toLocaleString(
                                  "en-US"
                                ) == "0" &&
                                  lvl2Item.name == "Actual Hours") ||
                                (Number(lvl2Item[header]).toLocaleString(
                                  "en-US"
                                ) == "0" &&
                                  lvl2Item.name == "Estimated Hours") ||
                                (Number(lvl2Item[header]).toLocaleString(
                                  "en-US"
                                ) == "0" &&
                                  lvl2Item.name == "Average Elapsed Time")
                              ? "-"
                              : Number(lvl2Item[header]).toLocaleString("en-US")
                            : lvl2Item[header]?.includes("^&2^&1")
                            ? lvl2Item[header]?.split("^&")[0]
                            : lvl2Item[header]}
                          {colIndex === 0 &&
                            (lvl2Item.name.includes("Average Deal Size") ? (
                              <span className="alignRight">($)</span>
                            ) : lvl2Item.name.includes("Opportunity Amount") ? (
                              <span className="alignRight">($)</span>
                            ) : lvl2Item.name.includes("Actual Hours") ? (
                              <span className="alignRight">(hrs.)</span>
                            ) : lvl2Item.name.includes("Estimated Hours") ? (
                              <span className="alignRight">(hrs.)</span>
                            ) : lvl2Item.name.includes(
                                "Average Elapsed Time"
                              ) ? (
                              <span className="alignRight">(days)</span>
                            ) : (
                              ""
                            ))}
                        </td>
                      ))}
                    </tr>
                  ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DhAnalyticsTable;
