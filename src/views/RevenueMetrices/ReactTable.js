import React, { useEffect, useState } from "react";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { FaInfoCircle, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import RevenueForecastInfoPopUp from "./RevenueForecastInfoPopUp.js";
import "./ReactTable.scss";

function ReactTable(props) {
  const { dataProp } = props;
  const tableData = props.dataProp;
  const data = tableData.tableData;
  const [expandedRows, setExpandedRows] = useState([]);
  const [infoPopUp, setInfoPopUp] = useState(false);
  const [iconName, setIconName] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const colArr = tableData?.columns?.replaceAll("'", "");
  let columns = colArr.split(",");
  columns = columns.filter(
    (column) =>
      ![
        "id",
        "resTyp",
        "lvl",
        "region_id",
        "revType",
        "department_id",
        "department_grp_id",
        "resbillType",
        "keyAttr",
        "keyterm",
        "rtype",
        "capacity",
        "billAppr",
        "billApprNet",
        "resource_type",
        "country_id",
        "",
        "customer_id",
      ].includes(column)
  );

  const icons = {
    fteActive: "icon-employee",
    subkActive: "icon-contractor",
    fteInactive: "icon-employee-inactive",
    fteNotice: "icon-employee-notice",
    subk0: "icon-contractor-inactive",
    subk2: "icon-contractor-notice",
  };

  const handleExpand = (rowId) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(rowId)
        ? prevExpandedRows.filter((id) => id !== rowId)
        : [...prevExpandedRows, rowId]
    );
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

  let values = [];
  data.map((d) => (d.id !== 999 ? values.push(d) : ""));
  let convertedJsonToTree = jsonToTree(values, {
    children: "subRows",
  });

  const formatCellValue = (value, row) => {
    const parsedValue = Number(value);
    return !isNaN(parsedValue) &&
      (row.subRows.length === 0 || row.subRows.length === 0) ? (
      <span title={new Intl.NumberFormat("en-US").format(parsedValue)}>
        {new Intl.NumberFormat("en-US").format(parsedValue)}
      </span>
    ) : !isNaN(parsedValue) && row.subRows.length > 0 ? (
      <b title={new Intl.NumberFormat("en-US").format(parsedValue)}>
        {new Intl.NumberFormat("en-US").format(parsedValue)}
      </b>
    ) : (
      <b title={value}>{value}</b>
    );
  };

  const handleAnchorClick = (id) => {
    const profileId = id?.split("^&^&")[3];

    if (profileId) {
      const url = `/#/resource/profile/:${profileId}`;
      window.open(url, "_blank");
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const renderRows = (rows, level = 0) => {
    const sortedRows = rows.slice().sort((a, b) => {
      if (!sortColumn || a.name === "Summary" || b.name === "Summary") return 0;

      const aValue = a[sortColumn]?.split("^")[0];
      const bValue = b[sortColumn]?.split("^")[0];

      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortOrder === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      } else {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

    console.log(sortedRows);

    return sortedRows.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        <tr className={"level" + row.lvl}>
          {columns?.map((column, columnIndex) => (
            <td key={columnIndex}>
              <div className="d-flex flex-row">
                {column === "name" && row.subRows.length > 0 && (
                  <span onClick={() => handleExpand(row.uniqueId)}>
                    {expandedRows.includes(row.uniqueId) ? (
                      <MdOutlineExpandLess className="pointer" />
                    ) : (
                      <MdOutlineExpandMore className="pointer" />
                    )}
                  </span>
                )}

                {column === "name" &&
                (row.subRows.length === 0 || row.subRows.length === 0) ? (
                  <div
                    className={`employee_status ${
                      icons[row.resTyp?.split("^&^&")[2]]
                    }`}
                    title={
                      row.resTyp.split("^&^&")[2] === "fteActive"
                        ? "Active Employee"
                        : row.resTyp.split("^&^&")[2] === "subkActive"
                        ? "Active Contractor"
                        : row.resTyp.split("^&^&")[2] === "fteInactive"
                        ? "EX-Employee"
                        : row.resTyp.split("^&^&")[2] === "fteNotice"
                        ? "Employee in Notice Period"
                        : row.resTyp.split("^&^&")[2] === "subk0"
                        ? "EX-Contractor"
                        : row.resTyp.split("^&^&")[2] === "subk2"
                        ? "Contractor in Notice Period"
                        : ""
                    }
                  >
                    {row.subRows.length === 0 &&
                    row.resTyp?.split("^")[0] !== "Contractor" &&
                    row.resTyp?.split("^")[0] !== "FTE" ? (
                      <a
                        onClick={() => handleAnchorClick(row.resTyp)}
                        title={row.resTyp?.split("^")[0]}
                      >
                        {row.resTyp?.split("^")[0]}
                      </a>
                    ) : (
                      <span
                        className={
                          row.resTyp?.split("^")[0] === "Contractor"
                            ? "orange right"
                            : row.resTyp?.split("^")[0] === "FTE"
                            ? "green right"
                            : ""
                        }
                        title={row.resTyp?.split("^")[0]}
                      >
                        {row.resTyp?.split("^")[0]}
                      </span>
                    )}
                  </div>
                ) : (
                  column === "name" && (
                    <b title={row[column]?.split("^")[0]}>
                      {row[column]?.split("^")[0]}
                    </b>
                  )
                )}
                <span className="ResourcePadding ellipsis">
                  {(column.includes("Revenue") || column.includes("Cost")) &&
                    (row.subRows.length > 0 ? <b> {"$"}</b> : "$")}
                  {!column.includes("name") &&
                    formatCellValue(row[column]?.split("^")[0], row)}
                  {(column.includes("Perc") || column.includes("GM")) &&
                    (row.subRows.length > 0 ? <b> {"%"}</b> : "%")}
                </span>
              </div>
            </td>
          ))}
        </tr>
        {expandedRows.includes(row.uniqueId) &&
          row.subRows.length > 0 &&
          renderRows(row.subRows, level + 1)}
      </React.Fragment>
    ));
  };

  const getHeaderRows = () => {
    const [headerRows, setHeaderRows] = useState(
      convertedJsonToTree.slice(0, 2)
    );

    const handleKeys = (keys, substring) => {
      const filteredKeys = columns.filter((key) => key.includes(substring));

      if (filteredKeys.length > 1) {
        const updatedHeaders = [...headerRows];

        filteredKeys.slice(1).forEach((key) => {
          updatedHeaders[0][key] = "";
        });

        setHeaderRows(updatedHeaders);
      }
    };

    useEffect(() => {
      handleKeys(columns, "Cost");
      handleKeys(columns, "GM");
      handleKeys(columns, "Revenue");
    }, []);

    return headerRows.map((headerRow, rowIndex) => (
      <tr key={rowIndex}>
        {columns.map((column, columnIndex) => {
          const cellValue = headerRow[column]?.split("^")[0];
          const isEmpty = cellValue === "";

          if (!isEmpty) {
            const remainingColumns = columns.slice(columnIndex + 1);
            const emptyColumnCount = remainingColumns.findIndex(
              (nextColumn) =>
                headerRow[nextColumn]?.split("^")[0].trim() !== "" ||
                headerRow[nextColumn]?.split("^")[0].trim() ===
                  headerRow[column]?.split("^")[0].trim()
            );

            const colSpan =
              emptyColumnCount >= 0
                ? emptyColumnCount + 1
                : remainingColumns.length + 1;

            return (
              <th
                key={columnIndex}
                colSpan={colSpan}
                rowSpan={
                  column?.includes("name") || column?.includes("rcount") ? 2 : 1
                }
                onClick={() => handleSort(column)}
                className={sortColumn === column ? `sorted ${sortOrder}` : ""}
              >
                <div className="align center">
                  {cellValue}
                  {rowIndex === 0 &&
                    !column.includes("name") &&
                    !column.includes("rcount") && (
                      <FaInfoCircle
                        className="tableInfoIcon"
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setIconName(cellValue);
                          setInfoPopUp(true);
                        }}
                      ></FaInfoCircle>
                    )}
                  <span className="sort-icons">
                    {sortColumn === column && sortOrder === "asc" && (
                      <>
                        &nbsp;
                        <FaSortAmountUp />
                      </>
                    )}
                    {sortColumn === column && sortOrder === "desc" && (
                      <>
                        &nbsp;
                        <FaSortAmountDown />
                      </>
                    )}
                  </span>
                </div>
              </th>
            );
          } else {
            return null;
          }
        })}
      </tr>
    ));
  };

  return (
    <div className="darkHeader MRF-summary-by-region-table-BUview">
      <table>
        <thead>{getHeaderRows()}</thead>
        <tbody>{renderRows(convertedJsonToTree?.slice(2))}</tbody>
      </table>
      {infoPopUp && (
        <RevenueForecastInfoPopUp
          infoPopUp={infoPopUp}
          setInfoPopUp={setInfoPopUp}
          iconName={iconName}
          setIconName={setIconName}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      )}
    </div>
  );
}

export default ReactTable;
