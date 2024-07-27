import React, { useState, useEffect } from "react";
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
import "./RevenueForecastBuCustomer.scss";
import RevenueForecastInfoPopUp from "./RevenueForecastInfoPopUp";
import { Link } from "react-router-dom";

export default function RevenueForecastBuCustomer(props) {
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
    fteNotice: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px" }}
        title="Employee in notice period"
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
  const { data, expandedCols, colExpandState, isOn } = props;
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [object, setObject] = useState({});
  const [infoPopUp, setInfoPopUp] = useState(false);
  const [iconName, setIconName] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

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
            {key}
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
                      <div title={value}>{value}</div>
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
                            {(cell.row.original.lvl == "2" &&
                              cell.row.original.name != "Summary") ||
                            (cell.row.original.lvl == "2" &&
                              cell.row.original.name == "Summary") ? (
                              cell.row.original.lvl == "2" &&
                              cell.row.original.resTyp.split("^&^&")[0] ==
                                "FTE" ? (
                                <div>
                                  {cell.row.original.resTyp.split("^&^&")[0]}
                                </div>
                              ) : cell.row.original.lvl == "2" &&
                                cell.row.original.resTyp.split("^&^&")[0] ==
                                  "Contractor" ? (
                                <div className="align right">
                                  {cell.row.original.resTyp.split("^&^&")[0]}
                                </div>
                              ) : (
                                <>
                                  {
                                    icons[
                                      cell.row.original.resTyp.split("^&^&")[2]
                                    ]
                                  }

                                  <Link
                                    to={`/resource/profile/:${
                                      cell.row.original.resTyp.split("^&^&")[3]
                                    }`}
                                    target="_blank"
                                  >
                                    {cell.row.original.resTyp.split("^&^&")[0]}
                                  </Link>
                                </>
                              )
                            ) : (
                              <b>{cell.getValue().split("^&")[0]}</b>
                            )}
                          </span>
                        </>
                      ) : cell.getValue() != null &&
                        (key.includes("Revenue") || key.includes("Cost")) ? (
                        <>
                          <div title={numberWithCommas(cell.getValue())}>
                            <span>
                              $
                              {cell.row.original.lvl == "2" ? (
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
                      ) : cell.getValue() != null &&
                        (key.includes("GM") || key.includes("Perc")) ? (
                        <>
                          {cell.row.original.lvl == "2" ? (
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
                      ) : cell.row.original.lvl == "2" ? (
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
                    <div title={value}>{value}</div>
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
                          {(cell.row.original.lvl == "2" &&
                            cell.row.original.name != "Summary") ||
                          (cell.row.original.lvl == "2" &&
                            cell.row.original.name == "Summary") ? (
                            cell.row.original.lvl == "2" &&
                            cell.row.original.resTyp.split("^&^&")[0] ==
                              "FTE" ? (
                              <span
                                style={{
                                  color: "rgba(66, 144, 99, 0.9)",
                                  float: "right",
                                }}
                              >
                                {cell.row.original.resTyp.split("^&^&")[0]}
                              </span>
                            ) : cell.row.original.lvl == "2" &&
                              cell.row.original.resTyp.split("^&^&")[0] ==
                                "Contractor" ? (
                              <span
                                style={{
                                  color: "#f88f2e",
                                  float: "right",
                                }}
                              >
                                {cell.row.original.resTyp.split("^&^&")[0]}
                              </span>
                            ) : (
                              <>
                                {
                                  icons[
                                    cell.row.original.resTyp.split("^&^&")[2]
                                  ]
                                }

                                <Link
                                  to={`/resource/profile/:${
                                    cell.row.original.resTyp.split("^&^&")[3]
                                  }`}
                                  target="_blank"
                                >
                                  {cell.row.original.resTyp.split("^&^&")[0]}
                                </Link>
                              </>
                            )
                          ) : (
                            <b>{cell.getValue().split("^&")[0]}</b>
                          )}
                        </span>
                      </>
                    ) : cell.row.original.lvl == "2" ? (
                      <div
                        className="align right"
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(cell.getValue())}
                      </div>
                    ) : (
                      <b
                        className="align right"
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

    setNodes(jsonToTree(values, { children: "subRows" }));
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
    <div className="materialReactExpandableTable revenueForecastBuCustomer darkHeader">
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
          enableColumnActions={false}
          enableTopToolbar={false}
          enableSorting={false}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            columnPinning: { right: ["total"] },
            pagination: { pageSize: 30 },
          }} //expand all rows by default
          state={{ columnVisibility: { ...hiddenColumns } }}
          //paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
          defaultColumn={{ minSize: 110, maxSize: 1000, size: 110 }} //units are in px
           muiTablePaginationProps={{
            labelRowsPerPage: false,
          }}
          muiTableContainerProps={{
            sx: {
              "&": {
                maxHeight: "40vh",
              },
            },
          }}
          muiTableBodyProps={{
            sx: {
              "&": {
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              },
              "& td:first-of-type": {
                borderLeft: "1px solid #ccc",
              },
              "& td": {
                // borderTop: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                height: "22px",
                padding: "0px 5px",
                maxWidth: "150px",
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
              "& th:first-of-type": {
                borderLeft: "1px solid #ccc",
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
