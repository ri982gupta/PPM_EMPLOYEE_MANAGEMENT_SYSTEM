import React, { useState, useEffect, useRef } from "react";
import MonthlyPRGraph from "./MonthlyPRGraph";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { VscChecklist } from "react-icons/vsc";
import MonthlyPRPopup from "./MonthlyPRPopup";
import moment from "moment/moment";
import axios from "axios";
import "./MonthlyPRMaterialTable.scss";
import MonthlyPRPopOver from "./MonthyPRPopOver";
import { environment } from "../../environments/environment";
import "./ReactTable.scss";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

export default function MonthlyPRMaterialTable(props) {
  const baseUrl = environment.baseUrl;
  const { data, dataAccess } = props;
  const [graph, setGraph] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopOver, setOpenPopOver] = useState(false);
  const [close, setClose] = useState(false);
  const [Pname, setPname] = useState();
  const [actionItems, setActionItems] = useState([]);
  const [actionItem, setActionItem] = useState([]);
  const [customer, setCustomer] = useState();

  const tableContainerRef = useRef();

  // Effect to scroll to the end of the table when it is initially rendered
  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      tableContainer.scrollLeft =
        tableContainer.scrollWidth - tableContainer.clientWidth;
    }
  }, [data]);

  useEffect(() => {
    setGraph(false);
  }, [data]);

  const graphRef = useRef(null);
  const actionRef = useRef(null);
  const [graphKey, setGraphKey] = useState(0);
  const [actionKey, setActionKey] = useState(0);
  useEffect(() => {
    if (graphKey && graphRef.current) {
      graphRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [graphKey]);
  useEffect(() => {
    if (actionKey && actionRef.current) {
      actionRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [actionKey]);

  const onClickHandler = (e) => {
    data.tableData.map((element) => {
      if (
        (element["dispName"].includes(e) && element["lvl"] == 1) ||
        element["lvl"] == 0
      ) {
        setGraph(true);
        setFilterData(element);
        setGraphKey((prevKey) => prevKey + 1);
        setCustomer(element.customer);
      }
    });
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const fday = moment(firstDayOfMonth).format("yyyy-MM-DD");
  const lday = moment(lastDayOfMonth).format("yyyy-MM-DD");
  const eDate = new Date().toLocaleDateString();
  const EntryDate = moment(eDate, "DD/MM/YYYY").format("YYYY-MM-DD");

  const [itemdate, setItemdate] = useState();
  const [pid, setPid] = useState();
  let OverView = true;
  let UserId = localStorage.getItem("resId");
  let User = localStorage.getItem("resName");
  let type = "";
  const updatedActionItem = {};

  const getActionItems = (projetId) => {
    type = "prj";
    let subKey = "";
    OverView = false;
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/PlannedActivities/getAllActionItems?projectId=${projetId}&runDt=${subKey}&OverView=${OverView}&fday=${fday}&lday=${lday}&type=${type}`,
    })
      .then((resp) => {
        const data = resp.data;
        setActionItems(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getActionItemFnc = (projetId, subKey) => {
    (type = "prj"), (OverView = false);
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/PlannedActivities/getActionItems?projectId=${projetId}&runDt=${subKey}&OverView=${OverView}&fday=${fday}&lday=${lday}&type=${type}`,
    })
      .then((resp) => {
        const data = resp.data;
        if (data.length == 0) {
          let comments = "";
          let entryDt = EntryDate;
          let itemdate = subKey;
          let entryBy = User;
          const val = [entryDt, entryBy, itemdate, comments];
          const orderedKeys = ["entryDt", "entryBy", "itemdate", "comments"];
          for (let i = 0; i < orderedKeys.length; i++) {
            updatedActionItem[orderedKeys[i]] = val[i];
          }
          setActionItem([...actionItems, updatedActionItem]);
        } else if (data.length == 1) {
          setActionItem(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    setClose(false);
    setOpenPopOver(false);
    setOpenPopup(false);
  };

  const handleClick = (event) => {
    setOpenPopup(true), setClose(true);
    setPname(event.dispName);
    setPid(event.id);
    getActionItems(event.id);
    setActionKey((prevKey) => prevKey + 1);
  };

  const handleOnClick = (row, column) => {
    setClose(true);
    setOpenPopOver(true);
    setPname(row.dispName);

    let subkey = column.includes("_") ? column.split("_") : "";
    subkey = subkey.slice(0, 3).join("-");
    setItemdate(subkey);
    setPid(row.id);
    getActionItemFnc(row.id, subkey);
  };
  const handleChildRow = (row) => {
    const id = row.projectId;
    if (id) {
      const url = `/#/project/Overview/:${id}`;
      window.open(url, "_blank"); // Open in a new tab
    }
  };
  const tableData = props.data;
  const Data = tableData.tableData;
  const [expandedRows, setExpandedRows] = useState([]);

  const colArr = tableData?.columns?.replaceAll("'", "");

  let columns = colArr?.split(",");

  const handleExpand = (rowId) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(rowId)
        ? prevExpandedRows.filter((id) => id !== rowId)
        : [...prevExpandedRows, rowId]
    );
  };

  const [isExpandAll, setExpandAll] = useState(false);

  const toggleExpandAll = () => {
    setExpandAll(!isExpandAll);
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
        [children]: [], // init a children property
        ...node, // add other propertys
        ...dictionary[nodeId], // children will be replaced if this node already has children property which was set below
      };
      dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] }; // if it's not exist in dictionary, init an object with children property
      dictionary[nodeParentId][children].push(dictionary[nodeId]); // add reference to current node object in parent node object
    });
    Object.values(dictionary).forEach((obj) => {
      if (typeof obj[options.id] === "undefined") {
        tree.push(...obj[children]);
      }
    });
    return tree;
  };

  let values = [];
  Data?.map((d) => (d.id != -3 ? values.push(d) : ""));

  let convertedJsonToTree = jsonToTree(values, {
    children: "subRows",
  });

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);

  const handleSort = (column) => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortOrder("asc");
    }
  };
  const formatCellValue = (value) => {
    const parsedValue = Number(value);
    return !isNaN(parsedValue)
      ? new Intl.NumberFormat("en-US").format(parsedValue)
      : value;
  };

  const getHeaderRows = () => {
    const visibleColumns = isExpandAll
      ? columns
      : columns?.filter((column) => !["csl", "dp", "pm"].includes(column));
    return convertedJsonToTree.slice(0, 2).map((headerRow, rowIndex) => (
      <tr key={rowIndex}>
        {visibleColumns.map((column, columnIndex) => {
          if (rowIndex === 1 && column.includes("dispName")) {
            return null;
          }
          const cellValue =
            typeof headerRow[column] === "string"
              ? headerRow[column].split("^&")[0]
              : headerRow[column];

          const isEmpty = cellValue === "";

          if (!isEmpty) {
            const remainingColumns = visibleColumns.slice(columnIndex + 1);
            const emptyColumnCount = remainingColumns.findIndex(
              (nextColumn) => {
                const nextCellValue = headerRow[nextColumn];
                const isNextCellValueString = typeof nextCellValue === "string";

                return (
                  (isNextCellValueString &&
                    nextCellValue.split("^&")[0].trim() !== "") ||
                  (isNextCellValueString &&
                    cellValue.split("^&")[0].trim() ===
                      nextCellValue.split("^&")[0].trim())
                );
              }
            );

            const colSpan =
              emptyColumnCount >= 0
                ? emptyColumnCount + 1
                : remainingColumns.length + 1;

            return (
              <th
                key={columnIndex}
                colSpan={rowIndex === 0 && colSpan}
                rowSpan={
                  column?.includes("dispName") ||
                  column?.includes("csl") ||
                  column?.includes("dp") ||
                  column?.includes("pm")
                    ? 3
                    : 1
                }
              >
                <div className="Customer-Project-heading-cell">
                  {
                    <div onClick={() => handleSort(column)}>
                      {cellValue}

                      {sortedColumn === column && (
                        <span className="ml-2">
                          {sortOrder === "asc" ? (
                            <FaSortAmountUp />
                          ) : (
                            <FaSortAmountDown />
                          )}
                        </span>
                      )}
                    </div>
                  }
                  {column === "dispName" && (
                    <span className="expand-btn" onClick={toggleExpandAll}>
                      {isExpandAll ? <BiChevronLeft /> : <BiChevronRight />}
                    </span>
                  )}
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
  const renderRows = (rows, level = 0) => {
    const sortedRows = rows.slice().sort((a, b) => {
      if (!sortedColumn || a.dispName === "Summary" || b.dispName === "Summary")
        return 0;

      const aValue = a[sortedColumn]?.split("^")[0];
      const bValue = b[sortedColumn]?.split("^")[0];

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
    const visibleColumns = isExpandAll
      ? columns
      : columns?.filter((column) => !["csl", "dp", "pm"].includes(column));

    return sortedRows.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        {row && row.uniqueId ? (
          <tr className={"level" + row.lvl}>
            {visibleColumns?.map((column, columnIndex) => (
              <td key={columnIndex}>
                <div className="d-flex flex-row ">
                  {column === "dispName" && row.subRows.length > 0 && (
                    <span onClick={() => handleExpand(row.uniqueId)}>
                      {expandedRows.includes(row.uniqueId) ? (
                        <MdOutlineExpandLess className="pointer" />
                      ) : (
                        <MdOutlineExpandMore className="pointer" />
                      )}
                    </span>
                  )}
                  {column === "dispName" && row.dispName === "Summary" ? (
                    <a
                      title="Summary"
                      onClick={(e) => {
                        e.preventDefault();
                        setGraph(true);
                        onClickHandler(row[column]);
                      }}
                    >
                      {row[column]}
                    </a>
                  ) : column === "dispName" &&
                    row.lvl === "1" &&
                    row.subRows.length > 0 ? (
                    <div className="ellipsis">
                      <a title="Action Items" onClick={() => handleClick(row)}>
                        <VscChecklist />
                      </a>
                      <a
                        title={row[column]}
                        onClick={(e) => {
                          e.preventDefault();
                          setGraph(true);
                          onClickHandler(row[column]);
                        }}
                      >
                        {row[column]}
                      </a>
                    </div>
                  ) : column === "dispName" && row.lvl > 1 ? (
                    <div className="ellipsis lvl2firstcolumn">
                      <a title="Action Items" onClick={() => handleClick(row)}>
                        <VscChecklist />
                      </a>
                      <a
                        title={row[column]}
                        onClick={(e) => {
                          handleChildRow(row);
                        }}
                      >
                        {row[column]}
                      </a>
                    </div>
                  ) : (
                    ""
                  )}
                  <span
                    className={
                      "ellipsis " +
                      " " +
                      (column.includes("Delta") &&
                      !column.includes("csl", "dp", "pm", "dispName")
                        ? column.split("_")[3]
                        : column.split("_")[3]) +
                      " " +
                      (column.includes("csl") && "expandedcolumns") +
                      "  " +
                      (column.includes("dp") && "expandedcolumns") +
                      " " +
                      (column.includes("pm") && "expandedcolumns")
                    }
                  >
                    {!column.includes("dispName") &&
                    column.includes("Delta") ? (
                      <span
                        className={
                          row[column] > 0
                            ? "green"
                            : row[column] < 0
                            ? "red"
                            : ""
                        }
                      >
                        {formatCellValue(row[column], row)}
                        {row.projectId != 0 && (
                          <span>
                            <a
                              title="Action Items"
                              onClick={(event) => {
                                handleOnClick(row, column);
                              }}
                            >
                              <VscChecklist />
                            </a>
                          </span>
                        )}
                      </span>
                    ) : !column.includes("dispName") &&
                      (column.includes("csl") ||
                        column.includes("dp") ||
                        column.includes("pm")) &&
                      formatCellValue(row[column], row) === "0" ? (
                      ""
                    ) : (
                      !column.includes("dispName") && (
                        <span title={formatCellValue(row[column], row)}>
                          {formatCellValue(row[column], row)}
                        </span>
                      )
                    )}
                  </span>
                </div>
              </td>
            ))}
          </tr>
        ) : null}

        {row &&
          row.uniqueId &&
          expandedRows &&
          expandedRows.includes(row.uniqueId) &&
          row.subRows &&
          row.subRows.length > 0 &&
          renderRows(row.subRows, level + 1)}
      </React.Fragment>
    ));
  };
  return (
    <div>
      <div
        className="darkHeader Monthly-Pr-Changes-By-Day MRF-summary-by-region-table-BUview"
        ref={tableContainerRef}
      >
        <table>
          <thead>{getHeaderRows()}</thead>
          <tbody>{renderRows(convertedJsonToTree?.slice(2))}</tbody>
        </table>
      </div>

      {graph && (
        <div className="col-12 mt-5" ref={graphRef} key={graphKey}>
          <div className="graph-header">
            <b>{"Revenue Progression For " + customer}</b>
          </div>
          <MonthlyPRGraph filterData={filterData} />
        </div>
      )}

      {openPopOver ? (
        <MonthlyPRPopOver
          setOpenPopOver={setOpenPopOver}
          openPopOver={openPopOver}
          handleClose={handleClose}
          close={close}
          Pname={Pname}
          actionItem={actionItem}
          projetId={pid}
          USerId={UserId}
          ItemDate={itemdate}
          dataAccess={dataAccess}
        />
      ) : (
        ""
      )}
      {openPopup ? (
        <div ref={actionRef} key={actionKey}>
          <MonthlyPRPopup
            setOpenPopup={setOpenPopup}
            openPopup={openPopup}
            handleClose={handleClose}
            close={close}
            Pname={Pname}
            actionItems={actionItems}
          />{" "}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
