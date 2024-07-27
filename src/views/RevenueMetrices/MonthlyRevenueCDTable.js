import React, { useState, useEffect, useRef } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton } from "@mui/material";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import "./MonthlyRevenueCDTable.scss";
import "./MonthlyPRMaterialTable.scss";

export default function MonthlyRevenueCDTable(props) {
  const {
    data,
    expandedCols,
    colExpandState,
    selectedDuration,
    shouldRenderTable,
    tableKey,
  } = props;
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    getData();
  }, [data.tableData]);
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

    if (data?.columns?.includes("'")) {
      columns = data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.columns;
    }

    let colArr = columns?.split(",");

    let unWantedColsArray = ["lvl", "id", "keyAttr", "customerId", "customer"];
    let filteredHeadersArray = colArr?.filter(
      (d) => !unWantedColsArray.includes(d)
    );
    let newHeaders = [];
    let hiddenHeaders = [];

    const obj = {};

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();

      let firstData = tableData[0];

      obj[colVal] = firstData[colVal];
    }
    let headerArray = Object.entries(obj);
    let unWantedCols = ["lvl", "id", "keyAttr", "customerId", "customer"];
    let filteredHeaders = headerArray.filter(
      (d) => !unWantedCols.includes(d[0])
    );

    filteredHeaders.map(([key, value]) => {
      console.log(expandedCols.includes(key), "inline77");
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    filteredHeadersArray?.forEach((key, index) => {
      const value = obj[key];
      const isSpecialKey =
        key.includes("csl") ||
        key.includes("dp") ||
        key.includes("acc_exe") ||
        key.includes("acc_own");
      {
        newHeaders.push({
          accessorKey: key,
          enableColumnActions: false,
          enableHiding: true,
          Header: ({ column }) => (
            <div
              className={isSpecialKey == true ? "headStyle" : ""}
              title={value.split("^&")[0]}
            >
              {selectedDuration === "12"
                ? [
                    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21,
                    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
                    37, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
                    53, 54, 55, 56, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68,
                    69, 70, 71, 72, 73,
                  ].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "11"
                ? [
                    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21,
                    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37,
                    38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
                    53, 54, 55, 56, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
                  ].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "10"
                ? [
                    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21,
                    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37,
                    38, 39, 41, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
                    54, 55, 56, 57, 58, 59, 60, 61,
                  ].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "9"
                ? [
                    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21,
                    22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37,
                    38, 39, 40, 41, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53,
                    54, 55,
                  ].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "8"
                ? [
                    5, 6, 7, 8, 9, 10, 11, 13, 15, 14, 16, 17, 18, 19, 20, 21,
                    22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                    38, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49,
                  ].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "7"
                ? [
                    5, 6, 7, 8, 9, 10, 13, 12, 14, 15, 16, 17, 18, 19, 20, 21,
                    22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 37, 38,
                    39, 40, 41, 42, 43,
                  ].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "6"
                ? [
                    5, 6, 7, 8, 9, 11, 13, 12, 14, 15, 16, 17, 18, 19, 20, 22,
                    23, 24, 25, 26, 27, 28, 29, 30, 31, 33, 34, 35, 36, 37, 38,
                    39, 40, 41, 42, 43,
                  ].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "5"
                ? [
                    5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 16, 19, 20, 21, 22,
                    23, 24, 25, 26, 28, 29, 30, 31,
                  ].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "4"
                ? [
                    5, 6, 7, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 23,
                    24, 25,
                  ].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "3"
                ? [5, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : selectedDuration === "2"
                ? [5, 7, 8, 10, 11, 13, 14, 15, 16, 18, 19].includes(index)
                  ? ""
                  : key.includes("pl")
                  ? "Planned Revenue"
                  : key.includes("ar")
                  ? "Actual Revenue"
                  : key.includes("rr")
                  ? "Recognized Revenue"
                  : value.split("^&")[0]
                : value.split("^&")[0]}

              {key == colExpandState[2] ? (
                <span className={`expandIcon ${expandClass}`}>
                  <IconButton
                    className="expandIcon"
                    onClick={() => {
                      setColumnExpFlag((prev) => !prev);
                    }}
                  >
                    {colExpFlag && !shouldRenderTable ? (
                      <AiFillLeftCircle />
                    ) : (
                      <AiFillRightCircle />
                    )}
                  </IconButton>
                </span>
              ) : null}
            </div>
          ),
        });
      }
    });

    setColumns(newHeaders);

    let values = [];

    if (Array.isArray(tableData) && tableData.length > 0) {
      values = tableData.filter((_, index) => index !== 0);
    }
    console.log(values, "values");

    function formatValuesWithCommas(data) {
      for (let i = 0; i < data.length; i++) {
        const keys = Object.keys(data[i]);
        for (const key of keys) {
          if (
            key.includes("csl") ||
            key.includes("dp") ||
            key.includes("acc_exe") ||
            key.includes("acc_own")
          ) {
            // console.log("cslfirst");
            data[i][key] = (
              <span className="bodyStyle" title={data[i][key]}>
                {data[i][key]}
              </span>
            );
          }

          if (
            key.includes("arval") ||
            key.includes("rrval") ||
            key.includes("plval") ||
            key.includes("arRevDelta") ||
            key.includes("plRevDelta") ||
            key.includes("rrRevDelta")
          ) {
            if (!isNaN(data[i][key])) {
              // Check if the value is negative
              const isNegative = data[i][key] < 0;
              const isPositive = data[i][key] > 0;

              data[i][key] = Number(data[i][key]).toLocaleString();

              if (key.includes("Delta")) {
                if (isNegative) {
                  data[i][key] = (
                    <span className="delta dispStyle" title={data[i][key]}>
                      {data[i][key]}
                    </span>
                  );
                }
                if (isPositive) {
                  data[i][key] = (
                    <span className="delta dispGreen" title={data[i][key]}>
                      {data[i][key]}
                    </span>
                  );
                } else {
                  data[i][key] = (
                    <span className="delta" title={data[i][key]}>
                      {data[i][key]}
                    </span>
                  );
                }
              } else if (
                key.includes("arval") ||
                key.includes("rrval") ||
                key.includes("plval")
              ) {
                if (isNegative) {
                  data[i][key] = (
                    <span className="plRev dispStyle" title={data[i][key]}>
                      {data[i][key]}
                    </span>
                  );
                } else {
                  data[i][key] = (
                    <span className="plRev" title={data[i][key]}>
                      {data[i][key]}
                    </span>
                  );
                }
              }
            }
          }
        }
      }
    }

    formatValuesWithCommas(values);

    setNodes(jsonToTree(values, { children: "subRows" }));
  };

  useEffect(() => {
    colExpFlag ? expandT() : expandF();
  }, [colExpFlag]);
  const expandT = () => {
    count++;
    getData();
    setHiddenColumns({});
  };

  const expandF = () => {
    getData();
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
  const stylesForDuration12 = {
    "& th:nth-child(2)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(3)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(4)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(5)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(28)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(51)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(74)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(24)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(47)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(70)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };

  const stylesForDuration11 = {
    "& th:nth-child(2)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(3)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(4)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(5)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(26)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(47)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(68)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(22)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(43)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(64)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration10 = {
    "& th:nth-child(2)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(3)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(4)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(5)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(24)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(43)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(62)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(20)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(39)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(58)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration9 = {
    "& th:nth-child(22)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(39)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(56)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(18)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(35)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(52)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration8 = {
    "& th:nth-child(28)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(51)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(74)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(24)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(47)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(70)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration7 = {
    "& th:nth-child(18)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(31)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(44)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(14)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(27)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(40)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration6 = {
    "& th:nth-child(16)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(29)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(46)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(12)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(23)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(34)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration5 = {
    "& th:nth-child(14)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(23)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(32)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(10)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(19)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(28)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration4 = {
    "& th:nth-child(12)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(19)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(26)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(8)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(15)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(22)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration3 = {
    "& th:nth-child(2)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(3)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(4)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(5)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(10)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(15)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(20)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(6)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(11)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(16)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration2 = {
    "& th:nth-child(2)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(3)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(4)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(5)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(8)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(11)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(14)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(4)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(7)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(10)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  const stylesForDuration1 = {
    "& th:nth-child(2)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(3)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(4)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(5)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(6)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(7)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(8)": {
      borderRight: colExpFlag ? "1px solid #ccc" : "none",
    },
    "& th:nth-child(2)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(3)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
    "& th:nth-child(4)": {
      borderRight: colExpFlag ? "" : "1px solid #ccc",
    },
  };
  return (
    <div className="materialReactExpandableTable revenueCDTable">
      <div>
        {columns?.length && shouldRenderTable ? (
          <MaterialReactTable
            key={tableKey}
            columns={columns}
            data={nodes}
            enableRowVirtualization={true}
            enablePagination={false}
            enableGlobalFilter={false}
            enableDensityToggle={false}
            enableFullScreenToggle={false}
            enableHiding={false}
            enableColumnFilters={false}
            enableBottomToolbar={false}
            enableTopToolbar={false}
            enableColumnActions={false}
            enableSorting={false}
            initialState={{
              showGlobalFilter: false,
              expanded: false,
              density: "compact",
              columnVisibility: { ...hiddenColumns },
            }}
            state={{ columnVisibility: { ...hiddenColumns } }}
            paginateExpandedRows={false}
            muiTableContainerProps={{
              sx: { width: "auto", maxWidth: "fit-content", maxHeight: "73vh" },
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
                  maxWidth: "150px",
                },
              },
            }}
            muiTableHeadProps={{
              sx: {
                "& th": {
                  borderTop: "1px solid #ccc",
                  background: "#f4f4f4",
                  padding: "0 5px",
                  paddingLeft: "28px",
                },
                "& th:first-of-type": {
                  borderLeft: "1px solid #f4f4f4",
                  minWidth: "100px",
                },
                ...(selectedDuration === "12"
                  ? stylesForDuration12
                  : selectedDuration === "11"
                  ? stylesForDuration11
                  : selectedDuration === "10"
                  ? stylesForDuration10
                  : selectedDuration === "9"
                  ? stylesForDuration9
                  : selectedDuration === "8"
                  ? stylesForDuration8
                  : selectedDuration === "7"
                  ? stylesForDuration7
                  : selectedDuration === "6"
                  ? stylesForDuration6
                  : selectedDuration === "5"
                  ? stylesForDuration5
                  : selectedDuration === "4"
                  ? stylesForDuration4
                  : selectedDuration === "3"
                  ? stylesForDuration3
                  : selectedDuration === "2"
                  ? stylesForDuration2
                  : selectedDuration === "1"
                  ? stylesForDuration1
                  : ""),
              },
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
