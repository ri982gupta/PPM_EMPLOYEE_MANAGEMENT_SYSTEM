import React, { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import { FaInfoCircle } from "react-icons/fa";
import RevenueForecastInfoPopUp from "./RevenueForecastInfoPopUp";
import "./MonthlyForecastRevenueTableComponent.scss";

export default function MonthlyForecastRevenueTableComponent(props) {
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
  };
  const { data, expandedCols, colExpandState } = props;

  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [infoPopUp, setInfoPopUp] = useState(false);
  const [iconName, setIconName] = useState();
  const [object, setObject] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const numberWithCommas = (x) => {
    var number = String(x);
    if (number.includes(".") === true) {
      if (number.includes(".00") === true) {
        var decimalNumbers = number;
        var num = Number(decimalNumbers);
        let FdN = num != null && num?.toFixed(0);
        let final = FdN.split(".");
        final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");

        return final.join(".");
      } else {
        var decimalNumbers = number;
        var num = Number(decimalNumbers);
        let FdN = num != null && num?.toFixed(2);
        let final = FdN.split(".");
        final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");

        return final.join(".");
      }
    } else {
      return (
        number != null && number?.replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",")
      );
    }
  };
  useEffect(() => {
    getData();
  }, [data]);
  useEffect(() => {
    setHeaders(object);
    setObject(object);
  }, [object]);
  const getData = () => {
    let tableData =
      data?.utilizationTableData ||
      data?.benchUtilizationTableData ||
      data?.tableData;
    let columns = null;
    if (
      data?.benchUtilizationColumns?.includes("'") ||
      data?.utilizationcolumns?.includes("'") ||
      data?.columns?.includes("'")
    ) {
      columns =
        data?.benchUtilizationColumns?.replaceAll("'", "") ||
        data?.utilizationcolumns?.replaceAll("'", "") ||
        data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.benchUtilizationColumns || data?.utilizationcolumns;
    }

    let colArr = columns?.split(",");

    let newHeaders = [];
    let hiddenHeaders = [];
    const obj1 = {};

    const obj = {};

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();

      let firstData = tableData[0];
      obj[colVal] = firstData[colVal];
    }

    let headerArray = Object.entries(obj);
    let unWantedCols = [];

    let filteredHeaders = headerArray.filter(
      ([key, value]) =>
        (typeof value === "string" && key?.includes("name")) ||
        key?.includes("rcount") ||
        key?.includes("Hrs") ||
        key?.includes("capacityGross") ||
        key?.includes("Revenue") ||
        key?.includes("GM") ||
        key?.includes("Cost")
    );
    filteredHeaders.forEach((d) => (obj1[d[1]?.split("-")[0]] = d[0]));

    let newObject = Object.entries(obj1);

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));
    let minusOneRow = tableData?.filter((d) => d.id == 0);

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

            {value.includes("name") || value.includes("rcount") ? (
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
      "RRCost",
      "NAvgCost",
      "NRRCost",
      "TrueCost",
      "AcGM",
      "RRGM",
      "NAcGM",
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
            let obj = {
              id: key,
              header:
                value == null || value == 0 ? (
                  ""
                ) : (
                  <div className="center-align">
                    {value == "PR (Bill+Ovrh)" ? (
                      <div title={"PR (Role)"}> {"PR (Role)"}</div>
                    ) : value == "RR" ? (
                      <div title={"RR (Role)"}> {"RR (Role)"}</div>
                    ) : (
                      <div title={value}> {value}</div>
                    )}
                  </div>
                ),
              accessorKey: key,
              Cell: ({ cell }) => {
                return (
                  <span>
                    {cell.column.id == "name" ? (
                      <span title={cell.getValue()}>
                        {icons[cell.row.original["name"]]}
                        <b>{cell.getValue()}</b>
                      </span>
                    ) : key.includes("Revenue") || key.includes("Cost") ? (
                      <>
                        <div title={numberWithCommas(cell.getValue())}>
                          <span>
                            $
                            <span style={{ float: "right" }}>
                              {numberWithCommas(cell.getValue())}
                            </span>
                          </span>
                        </div>
                      </>
                    ) : key.includes("GM") ? (
                      <div
                        class="align right"
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(cell.getValue())}%
                      </div>
                    ) : (
                      <div
                        class="align right"
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(cell.getValue())}{" "}
                      </div>
                    )}
                  </span>
                );
              },
            };
            subArray.push(obj);

            newHeaders[i].columns = subArray;
          }
        } else {
          if (data.accessorKey.includes(key)) {
            let obj = {
              id: key,
              header:
                value == null || value == 0 ? (
                  <span className="center-align" title={value}>
                    {value}
                  </span>
                ) : (
                  <div
                    className={
                      value.includes(null) || (value.includes("") && "nullCol")
                    }
                  >
                    {value == "PR (Bill+Ovrh)" ? (
                      <div title={"PR (Role)"}> {"PR (Role)"}</div>
                    ) : value == "RR" ? (
                      <div title={"RR (Role)"}> {"RR (Role)"}</div>
                    ) : (
                      <div title={value}> {value}</div>
                    )}
                  </div>
                ),
              accessorKey: key,
              Cell: ({ cell }) => {
                return (
                  <span>
                    {cell.column.id == "name" ? (
                      <span title={cell.getValue()}>
                        {icons[cell.row.original["name"]]}
                        <b>{cell.getValue()}</b>
                      </span>
                    ) : (
                      <div
                        class="align right"
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(cell.getValue())}
                      </div>
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

    let tempData = jsonToTree(values, { children: "subRows" });
    setNodes(tempData.slice(1, tempData.length));
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
    <div className="materialReactExpandableTable mfrTable darkHeader ">
      {nodes.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          // enableExpandAll={false} //hide expand all double arrow in column header
          // enableExpanding
          enablePagination={false}
          //enableRowVirtualization
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableColumnFilterModes={true}
          enableSorting={false}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          state={{ columnVisibility: { ...hiddenColumns } }}
          defaultColumn={{
            minSize: 40,
            maxSize: 1000,
            size: 40,
          }} //units are in px
          muiSearchTextFieldProps={{
            placeholder: `search`,
            sx: { minWidth: "300px" },
            variant: "standard",
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
              "& td:nth-of-type(even)": {
                backgroundColor: "aliceblue",
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
