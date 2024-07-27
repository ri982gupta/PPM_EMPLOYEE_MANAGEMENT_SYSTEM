import React, { useState, useEffect, useRef } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton } from "@mui/material";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { AiFillRightCircle } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import "./RevenueForecastBuTable.scss";
import RevenueForecastInfoPopUp from "./RevenueForecastInfoPopUp";
import { Link } from "react-router-dom";
import useDynamicMaxHeight from '../PrimeReactTableComponent/useDynamicMaxHeight'

export default function RevenueForecastBuTable(props) {
  const icons = {
    Employee: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Employee"
      />
    ),
    Contractor: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Contractor"
      />
    ),
    fteActive: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Active Employee"
      />
    ),
    fteInactive: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Ex-Employee"
      />
    ),
    fteNotice: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px" }}
        title="Employee in notice period"
      />
    ),

    subkActive: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Active Contractor"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Ex-Contractor"
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
  const { data, expandedCols, colExpandState, setTimeOnSearch, timeOnSearch ,isOn} =
    props;

  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [object, setObject] = useState({});
  const [infoPopUp, setInfoPopUp] = useState(false);
  const [iconName, setIconName] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const materialTableElement = document.getElementsByClassName('materialReactExpandableTable revenueForecastBuTable summary-by-region-table darkHeader');

  const maxHeight = useDynamicMaxHeight(materialTableElement);

  const numberWithCommas = (x) => {
    var number = String(x);
    if (number.includes(".")) {
      if (number.includes(".00")) {
        var number = parseFloat(x);
        return number?.toLocaleString();
      } else {
        var decimalNumbers = number;
        var num = Number(decimalNumbers);
        let FdN = num != null && num?.toFixed(2);
        let final = FdN.split(".");
        final[0] = final[0]?.replace(/(\d)(?=(\d{2})+\d$)/g, "$1,");
        final[1] = final[1]?.replace(/(\d{3})(?=\d)/g, "$1,");

        return final.join(".");
      }
    } else {
      var number = parseFloat(x);
      return number?.toLocaleString();
    }
  };
  useEffect(() => {
    numberWithCommas(getData());
  }, [data]);

  useEffect(() => {
    setHeaders(object);
    setObject(object);
  }, [object]);

  const getData = () => {
    let tableData = data?.tableData;
    let columns = null;
    if (data?.columns?.includes("'")) {
      columns = data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.columns;
    }

    let colArr = columns?.split(",");

    let newHeaders = [];
    let hiddenHeaders = [];
    const obj1 = {};

    const obj = {};

    //iterate objects and remove "^&"

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();

      let firstData = tableData[0];

      obj[colVal] = firstData[colVal];
    }

    let headerArray = Object.entries(obj);

    let unWantedCols = [];

    let filteredHeaders = headerArray.filter(
      ([key, value]) => typeof value === "string" && value.includes("^&")
    );
    filteredHeaders.forEach((d) => (obj1[d[1].split("^&")[0]] = d[0]));

    let newObject = Object.entries(obj1);

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));
    let minusOneRow = tableData?.filter((d) => d.id == -1);
    newObject?.map(([key, value], index) => {
      newHeaders.push({
        accessorKey: value,
        header: key,
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => (
          <div
            className={
              value.includes("name")
                ? "mixer"
                : value.includes("rcount")
                ? "mixer"
                : ""
            }
            title={key}
          >
            {key}{" "}
            {value == colExpandState[2] ? (
              <IconButton
                onClick={() => {
                  setColumnExpFlag((prev) => !prev);
                }}
              >
                <AiFillRightCircle />
              </IconButton>
            ) : value.includes("name") || value.includes("rcount") ? (
              ""
            ) : (
              <FaInfoCircle
                className="tableInfoIcon"
                onClick={(e) => {
                  setAnchorEl(e.currentTarget);
                  setIconName(key);
                  setInfoPopUp(true);
                }}
              >
                {""}
              </FaInfoCircle>
            )}
          </div>
        ),
      });
    });

    let subHeaders = minusOneRow ? Object.entries(minusOneRow[0]) : null;

    subHeaders?.sort();

    const revenueOrder = [
      "Revenue",
      "AssRevenue",
      "ActRevenue",
      "ApprRevenue",
      "RecRevenue",
      "AvgCost",
      "NAvgCost",
      "RRCost",
      "NRRCost",
      "TrueCost",
      "AcGM",
      "NAcGM",
      "RRGM",
      "NRRGM",
      "TcGM",
    ];
    if (subHeaders !== null) {
      subHeaders = subHeaders.sort((a, b) => {
        const indexA = revenueOrder.indexOf(a[0]);
        const indexB = revenueOrder.indexOf(b[0]);
        return indexA - indexB;
      });
    }

    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let subArray = [];
      subHeaders.map(([key, value], index) => {
        let subkey = key.includes("GM")
          ? "GM"
          : key.includes("capacity") || key.includes("gross")
          ? "capacity"
          : key.includes("allocations")
          ? "allocations"
          : key.includes("billAlloc")
          ? "billAlloc"
          : key.includes("billAct")
          ? "billAct"
          : key.includes("billAss")
          ? "billAss"
          : key.includes("billAppr")
          ? "billAppr"
          : key.includes("Cost")
          ? "Cost"
          : key.includes("Revenue")
          ? "Revenue"
          : null;

        if (subkey != null) {
          if (data.accessorKey.includes(subkey)) {
            {
              let obj = {
                id: key,
                header:
                  value == null || value == 0 ? (
                    ""
                  ) : (
                    <div className="center-align">
                      <div title={value}> {value}</div>
                    </div>
                  ),
                accessorKey: key,
                Cell: ({ cell }) => {
                  return (
                    <span
                      className={
                        "lvl-" +
                        cell.row.original.lvl +
                        " " +
                        (cell.row.original.name === "Summary"
                          ? "summary"
                          : "") +
                        (cell.row.index % 2 === 0 ? " odd" : " even")
                      }
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {cell.column.id == "name" && cell.row.original != null ? (
                        <>
                          <span title={cell.getValue().split("^&")[0]}>
                            {(cell.row.original.lvl == "3" &&
                              cell.row.original.keyterm == "practiceRes") ||
                            (cell.row.original.lvl == "4" &&
                              cell.row.original.keyterm == "countryRes") ||
                            (cell.row.original.lvl == "5" &&
                              cell.row.original.keyterm == "deptRes") ? (
                              <>
                                {icons[cell.row.original["resource_type"]]}{" "}
                                <Link
                                  to={`/resource/profile/:${
                                    cell.getValue().split("^&")[3]
                                  }`}
                                  target="_blank"
                                >
                                  {cell.getValue().split("^&")[0]}
                                </Link>
                              </>
                            ) : (cell.row.original.lvl == "6" &&
                                cell.row.original.name != "Summary") ||
                              (cell.row.original.lvl == "5" &&
                                cell.row.original.keyterm == "PracticeRes") ||
                              (cell.row.original.lvl == "4" &&
                                cell.row.original.keyterm == "RevTypRes") ||
                              (cell.row.original.lvl == "3" &&
                                cell.row.original.keyterm == "regionRes") ? (
                              <>
                                {
                                  icons[
                                    cell.row.original.resTyp.split("^&^&")[2]
                                  ]
                                }{" "}
                                <Link
                                  to={`/resource/profile/:${
                                    cell.getValue().split("^&")[3]
                                  }`}
                                  target="_blank"
                                >
                                  {cell.getValue().split("^&")[0]}
                                </Link>
                              </>
                            ) : (
                              <>{cell.getValue().split("^&")[0]}</>
                            )}
                          </span>
                        </>
                      ) : (cell.getValue() != null || cell.getValue() != " ") &&
                        (key.includes("Revenue") || key.includes("Cost")) ? (
                        <>
                          <div title={numberWithCommas(cell.getValue())}>
                            <span>
                              $
                              {cell.row.original.keyterm.includes("Res") ? (
                                <div style={{ float: "right" }}>
                                  {numberWithCommas(cell.getValue())}
                                </div>
                              ) : (
                                <b style={{ float: "right" }}>
                                  {numberWithCommas(cell.getValue())}
                                </b>
                              )}
                            </span>
                          </div>
                        </>
                      ) : (cell.getValue() != null || cell.getValue() != " ") &&
                        (key.includes("GM") || key.includes("Perc")) ? (
                        <>
                          {cell.row.original.keyterm.includes("Res") ? (
                            <div
                              class="align right"
                              title={numberWithCommas(cell.getValue())}
                            >
                              {numberWithCommas(cell.getValue())} %
                            </div>
                          ) : (
                            <b
                              class="align right"
                              title={numberWithCommas(cell.getValue())}
                            >
                              {numberWithCommas(cell.getValue())} %
                            </b>
                          )}
                        </>
                      ) : cell.row.original.keyterm.includes("Res") ? (
                        <div
                          class="align right"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </div>
                      ) : (
                        <b
                          class="align right"
                          title={numberWithCommas(cell.getValue())}
                        >
                          {numberWithCommas(cell.getValue())}
                        </b>
                      )}
                    </span>
                  );
                },
              };
              subArray.push(obj);

              newHeaders[i].columns = subArray;
            }
          }
        } else {
          if (data.accessorKey.includes(key)) {
            let obj = {
              id: key,
              header:
                value == null || value == 0 ? (
                  ""
                ) : (
                  <div
                    className={
                      value.includes(null) ||
                      (value.includes("") && "nullCol" && "center-align")
                    }
                  >
                    <div title={value}> {value}</div>
                  </div>
                ),
              accessorKey: key,
              Cell: ({ cell }) => {
                return (
                  <span
                    className={
                      "lvl-" +
                      cell.row.original.lvl +
                      " " +
                      (cell.row.original.name === "Summary" ? "summary" : "") +
                      (cell.row.index % 2 === 0 ? " odd" : " even")
                    }
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cell.column.id == "name" && cell.row.original != null ? (
                      <>
                        <span title={cell.getValue().split("^&")[0]}>
                          {(cell.row.original.lvl == "3" &&
                            cell.row.original.keyterm == "practiceRes") ||
                          (cell.row.original.lvl == "4" &&
                            cell.row.original.keyterm == "countryRes") ||
                          (cell.row.original.lvl == "5" &&
                            cell.row.original.keyterm == "deptRes") ? (
                            <>
                              {icons[cell.row.original["resource_type"]]}{" "}
                              <Link
                                to={`/resource/profile/:${
                                  cell.row.original.keyAttr.split("-res")[1]
                                }`}
                                target="_blank"
                              >
                                {cell.getValue().split("^&")[0]}
                              </Link>
                            </>
                          ) : (cell.row.original.lvl == "6" &&
                              cell.row.original.name != "Summary") ||
                            (cell.row.original.lvl == "5" &&
                              cell.row.original.keyterm == "PracticeRes") ||
                            (cell.row.original.lvl == "4" &&
                              cell.row.original.keyterm == "RevTypRes") ||
                            (cell.row.original.lvl == "3" &&
                              cell.row.original.keyterm == "regionRes") ? (
                            <>
                              {icons[cell.row.original.resTyp.split("^&^&")[2]]}{" "}
                              <Link
                                to={`/resource/profile/:${
                                  cell.row.original.keyAttr.split("-res")[1]
                                }`}
                                target="_blank"
                              >
                                {cell.getValue().split("^&")[0]}
                              </Link>
                            </>
                          ) : cell.row.original.keyterm.includes("Res") ? (
                            <div>{cell.getValue().split("^&")[0]}</div>
                          ) : (
                            <b>{cell.getValue().split("^&")[0]}</b>
                          )}
                        </span>
                      </>
                    ) : cell.row.original.keyterm.includes("Res") ? (
                      <div
                        class="align right"
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(cell.getValue())}
                      </div>
                    ) : (
                      <b
                        class="align right"
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(cell.getValue())}
                      </b>
                    )}
                  </span>
                );
              },
            };
            newHeaders[i].columns = [obj];
          }
        }
      });
    });

    setColumns(newHeaders);
    let values = [];
    tableData?.map((d) => (d.id != -1 && d.id != -2 ? values.push(d) : ""));

    let convertedJsonToTree = jsonToTree(values, { children: "subRows" });

    let finalData = convertedJsonToTree.filter(
      (d) => (d.lvl > 1 && d.subRows.length == 0) == false
    );

    setNodes(finalData);
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

  const rowVirtualizerInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="materialReactExpandableTable revenueForecastBuTable summary-by-region-table darkHeader ">
      {nodes.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={false} //hide expand all double arrow in column header
          enableExpanding
          enablePagination={isOn}
          paginateExpandedRows={true}
          enableBottomToolbar={isOn}
          enableRowVirtualization={true}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableSorting={false}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            columnPinning: { right: ["total"] },
            pagination: { pageSize: 30 },
          }}
          // state={{ isLoading, columnVisibility: { ...hiddenColumns } }}
          //paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
          defaultColumn={{ minSize: 110, maxSize: 1000, size: 110 }} //units are in px
          muiTablePaginationProps={{
            labelRowsPerPage: false,
          }}
          muiTableContainerProps={{
            sx: {
              
                maxHeight: `${maxHeight}px`,
              
            },
          }}
          muiTableBodyProps={{
            sx: {
              "&": {
                // borderBottom: "1px solid #ccc",
              },
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
                fontSize: "11px",
              },
            },
          }}
        />
      ) : null}
      {infoPopUp ? (
        <RevenueForecastInfoPopUp
          infoPopUp={infoPopUp}
          setInfoPopUp={setInfoPopUp}
          iconName={iconName}
          setIconName={setIconName}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
        />
      ) : (
        ""
      )}
    </div>
  );
}
