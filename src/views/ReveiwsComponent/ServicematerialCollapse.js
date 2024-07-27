import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { FaCircle } from "react-icons/fa";
import "./ServicematerialCollapse.scss";
import { Link } from "react-router-dom";

export default function ServicematerialCollapse(props) {
  const { data, expandedCols, colExpandState } = props;

  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [expandIconStyle, setExpandIconStyle] = useState({});

  const prosicon = {
    1: <FaCircle style={{ color: "purple" }} />,

    0: <FaCircle style={{ color: "green" }} />,
  };

  const numberWithCommas = (x) => {
    var number = String(x);
    if (number.includes(".") == true) {
      var decimalNumbers = number;
      var num = Number(decimalNumbers);
      let FdN = num != null && num?.toFixed();
      let final = FdN.split(".");
      final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");

      return final.join(".");
    } else {
      return (
        number != null && number?.replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",")
      );
    }
  };

  let btn = document.getElementsByClassName(
    "MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium"
  );

  useEffect(() => {
    for (let i = 0; i < btn.length; i++) {
      btn[i].addEventListener("click", function () {
        setExpandIconStyle({});

        setTimeout(() => {
          columnSetter();
        }, 0);
      });
    }
  }, [nodes]);

  useEffect(() => {
    getData();
  }, [data]);

  const columnSetter = () => {
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
      "oppurtunity",
      "opp_type",
      "isProspect",
      "lvl",
      "opp_id",
      "keyAtr",
    ];

    let filteredHeaders = headerArray.filter(
      (d) => !unWantedCols.includes(d[0])
    );
    // ======================================================================================
    setHeaders(filteredHeaders);

    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let filteredHeader = [];
    let iconsData = document.getElementsByClassName(
      "MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium"
    );

    let fIconsData = [];

    if (iconsData.length > 0) {
      for (let i = 0; i < iconsData.length; i++) {
        if (i > 1 && iconsData[i].classList.contains("Mui-disabled") == false) {
          fIconsData.push(
            iconsData[i].children[0].style.transform == "rotate(0deg)"
              ? true
              : false
          );
        }
      }
    }

    if (fIconsData.includes(false)) {
      filteredHeader = filteredHeaders;
    } else {
      filteredHeader.push(filteredHeaders[0]);
      filteredHeader.push(filteredHeaders[filteredHeaders.length - 1]);
    }

    filteredHeader[0] != undefined &&
      filteredHeader?.map(([key, value], index) => {
        newHeaders.push({
          accessorKey: key,
          header: value,
          enableColumnActions: false,
          enableHiding: true,

          Header: ({ column }) => (
            <div
              className={
                key.includes("customer") ||
                key.includes("country") ||
                key.includes("closedDate") ||
                key.includes("probability") ||
                key.includes("stage")
                  ? "expcollapse"
                  : ""
              }
              style={{
                textAlign: key === "probability" ? "right" : "",
              }}
            >
              {value ==
              "0___iconCust__ Customer __iconProsp__ Prospect^&2^&1" ? (
                <>
                  {" "}
                  <span className="mr-1"> {prosicon[0]}</span>
                  <span>{value.split("__")[2]}</span>
                  <span className="mr-1">{prosicon[1]}</span>
                  <span>{value.split("__")[4].split("^&")[0]}</span>
                </>
              ) : (
                value?.split("^&")[0]
              )}
            </div>
          ),
          Cell: ({ cell, row }) => {
            let lcValue = null;
            let spVal = null;

            if (key == "customer") {
              spVal = cell.getValue().split("_");
            } else {
              lcValue =
                key == "executive"
                  ? cell.getValue()
                  : numberWithCommas(cell.getValue());
            }

            return (
              <div
                className={
                  key.includes("customer") ||
                  key.includes("country") ||
                  key.includes("closedDate") ||
                  key.includes("probability") ||
                  key.includes("stage")
                    ? "expcollapse"
                    : ""
                }
                title={
                  cell.getValue().includes("_")
                    ? cell.getValue().split("_")[1]
                    : cell.getValue()
                }
                style={{
                  textAlign: key === "probability" ? "right" : "",
                }}
              >
                {key == "customer" ? (
                  spVal[1] == " " ? (
                    ""
                  ) : (
                    <>
                      <span>{prosicon[spVal[0]]}</span>
                      <span>{"  " + spVal[1]}</span>
                    </>
                  )
                ) : parseInt(row.original.lvl) === 2 && key == "executive" ? (
                  <a
                    href="https://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttps%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F0061W00001UtIfyQAF%252Fview"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-toggle="tooltip"
                    title={lcValue}
                  >
                    {lcValue}
                  </a>
                ) : parseInt(row.original.lvl) === 3 && key == "executive" ? (
                  <span title={row.original.pr_id}> {row.original.pr_id}</span>
                ) : (
                  lcValue
                )}
              </div>
            );
          },
        });
      });

    setColumns(newHeaders);
  };

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
      "oppurtunity",
      "opp_type",
      "isProspect",
      "lvl",
      "opp_id",
      "keyAtr",
    ];

    let filteredHeaders = headerArray.filter(
      (d) => !unWantedCols.includes(d[0])
    );
    // ======================================================================================
    setHeaders(filteredHeaders);

    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let filteredHeader = [];

    filteredHeader = filteredHeaders;

    filteredHeader[0] != undefined &&
      filteredHeader?.map(([key, value], index) => {
        newHeaders.push({
          accessorKey: key,
          enableColumnActions: false,
          enableHiding: true,

          Header: ({ column }) => (
            <div
              className={
                key.includes("customer") ||
                key.includes("country") ||
                key.includes("closedDate") ||
                key.includes("probability") ||
                key.includes("stage")
                  ? "expcollapse"
                  : ""
              }
              style={{
                textAlign: key === "probability" ? "right" : "",
              }}
            >
              {value == "__iconCust__ Customer __iconProsp__ Prospect^&2^&1" ? (
                <>
                  {" "}
                  <span className="mr-1"> {prosicon[0]}</span>
                  <span title={value.split("__")[2]}>
                    {value.split("__")[2]}
                  </span>
                  <span className="mr-1">{prosicon[1]}</span>
                  <span title={value.split("__")[4].split("^&")[0]}>
                    {value.split("__")[4].split("^&")[0]}
                  </span>
                </>
              ) : (
                <span title={value?.split("^&")[0]}>
                  {value?.split("^&")[0]}
                </span>
              )}
            </div>
          ),
          Cell: ({ cell, row }) => {
            let lcValue = null;
            let spVal = null;
            let subrowsExcutive = null;

            if (key == "customer") {
              spVal = cell.getValue().split("_");
            } else {
              if (key == "executive") {
                subrowsExcutive = row.original.subRows?.map(
                  (d) => d.opportunity
                );
                lcValue = cell.getValue();
              } else {
                lcValue = numberWithCommas(cell.getValue());
              }
            }

            return (
              <div
                className={
                  key.includes("customer") ||
                  key.includes("country") ||
                  key.includes("closedDate") ||
                  key.includes("probability") ||
                  key.includes("stage")
                    ? "expcollapse"
                    : ""
                }
                title={
                  cell.getValue().includes("_")
                    ? cell.getValue().split("_")[1]
                    : cell.getValue()
                }
                style={{
                  textAlign: key === "probability" ? "right" : "",
                }}
              >
                {key == "customer" ? (
                  spVal[1] == " " ? (
                    ""
                  ) : (
                    <>
                      <span>{prosicon[spVal[0]]}</span>
                      <span>{"  " + spVal[1]}</span>
                    </>
                  )
                ) : parseInt(row.original.lvl) > 1 && key == "executive" ? (
                  <a
                    href="https://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttps%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F0061W00001UtIfyQAF%252Fview"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-toggle="tooltip"
                    title={lcValue}
                  >
                    {lcValue}
                  </a>
                ) : (
                  lcValue
                )}
              </div>
            );
          },
        });
      });

    setColumns(newHeaders);

    let values = [];
    let minusOneRow = [];

    // above minusonerow for getting one wanted row wch was being automatically sliced

    tableData?.map((d) => (d.id !== -1 ? values.push(d) : minusOneRow.push(d)));

    for (let i = 0; i < values.length; i++) {
      values[i]["customer"] =
        values[i]["isProspect"] + "_" + values[i]["customer"];
    }

    values.forEach((e) => {
      e["keyAttr"] == "summary" ? (e["parentId"] = null) : "";
    });

    // ===============for slicing unwanted rows=====================
    let tempData = jsonToTree(values, { children: "subRows" });

    let finalData = tempData.filter((d) => d.id >= 0);
    // [...tempData.slice(2, tempData.length)];

    setNodes(finalData);

    // =================================================================================
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
    <div className="materialReactExpandableTable serviceMaterialTable">
      {nodes.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          expandProp
          autoResetExpanded={true}
          enableExpanding
          enablePagination={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableSorting={false}
          initialState={{
            expanded: {
              1: true, // set the first row to be expanded by default
            },
          }}
          // expanded={{
          //   [data[0]?.id]: true // set the first row to be expanded by default
          // }}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          defaultColumn={{ minSize: 40, maxSize: 1000, size: 40 }} //units are in px
          muiTableBodyProps={{
            sx: {
              "&": {
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              },
              "& td:first-child": {
                borderLeft: "1px solid #ccc",
              },
              "& td": {
                borderRight: "1px solid #ccc",
                height: "22px",
                padding: "0px 5px",
              },
              "& td:nth-child(3)": {
                width: "130px",
              },
              "& td:nth-child(1) button": {
                padding: "0px",
                height: "23px",
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
              ".expcollapse": {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              "& th:first-child": {
                borderLeft: "1px solid #ccc",
              },
              "& th:nth-child(3)": {
                maxWidth: "130px",
              },
            },
          }}
        />
      ) : null}
    </div>
  );
}
