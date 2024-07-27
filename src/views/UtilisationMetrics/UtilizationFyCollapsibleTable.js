import React, { useState, useEffect } from "react";
import MaterialReactTable from "material-react-table";
import { Button, IconButton } from "@mui/material";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { AiFillRightCircle, AiOutlineInfoCircle } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import UtilizationFYPopUp from "./UtilizationFYPopUp";
import { CListGroup } from "@coreui/react";
// C:\PPM_Rewrite\PPMRewrite_Local\PPMRewrite_React\src\views\UtilisationMetrics\UtilizationFyCollapsibleTable.js
import { AiFillLeftCircle } from "react-icons/ai";
import { BiChevronRight } from "react-icons/bi";
import "./BillableUtilizationTrendCollapsibleTable.scss";
// import "./../RevenueMetrices/RevenueIndustrySecondTable.scss";
// import "./../RevenueMetrices/MonthlyPRMaterialTable.scss";
// import "./../RevenueMetrices/MonthlyForecastRevenueCalenderTable.scss";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

export default function UtilizationFyCollapsibleTable(props) {
  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Employee"
      />
    ),
    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Active Employee"
      />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px" }}
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Contractor"
      />
    ),
    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Active Contractor"
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

  const { data, expandedCols, colExpandState } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  //console.log(anchorEl);
  const handleClose = () => {
    setAnchorEl(false);
  };
  const [iconName, setIconName] = useState();

  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);

  const [showPopup, setShowPopup] = useState(false);

  const materialTableElement = document.getElementsByClassName(
    "materialReactExpandableTable billableUtilTrendTable darkHeader"
  );
  const maxHeight = useDynamicMaxHeight(materialTableElement, "fixedcreate");

  useEffect(() => {}, [showPopup]);

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
    let tableData = data.tableData;
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

    let unWantedCols = [
      "id",
      "department",
      "resource",
      "departmentId",
      "empStatus",
      "lvl",
      "count",
      "keyAttr",
    ];

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

    filteredHeaders.map(([key, value], index) => {
      newHeaders.push({
        accessorKey: key,
        header: value.includes("^&") ? value.split("^&")[0] : value,
        enableColumnActions: false,
        enableHiding: true,
        // Header: ({ column }) => (
        //   <>
        //     {value.includes("^&") ? value.split("^&")[0] : value}{" "}
        //     {key == colExpandState[2] ? (
        //       <IconButton
        //         className="expandIcon"
        //         onClick={() => {
        //           setColumnExpFlag((prev) => !prev);
        //         }}
        //       >
        //         <AiFillRightCircle
        //         // size={"em"}
        //         />
        //       </IconButton>
        //     )
        //     :
        //      key.includes("qrtr") ? ("") : key.includes("emp_cadre") ? ("") : key.includes("supervisor") ? ("")
        //      :
        //      (<FaInfoCircle
        //       // onClick={() => {
        //       //   //console.log("onClick")
        //       // }}
        //       onClick={() => setShowPopup((prev) => !prev)}
        //        >
        //       <FaInfoCircle />{" "} </FaInfoCircle>
        //     )
        //     }
        //   </>
        // ),
        Header: ({ column }) => (
          <>
            {value.includes("^&") ? value.split("^&")[0] : value}{" "}
            {key === colExpandState[2] ? (
              <span className={`expandIcon ${expandClass}`}>
                <IconButton
                  onClick={() => {
                    setColumnExpFlag((prev) => !prev);
                  }}
                >
                  <BiChevronRight />
                </IconButton>
              </span>
            ) : key.includes("qrtr") ||
              key.includes("emp_cadre") ||
              key.includes("supervisor") ? (
              ""
            ) : (
              <div
                style={{
                  display: "inline-block",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <FaInfoCircle
                  className="tableInfoIcon"
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                    setIconName(key);
                    setShowPopup(true);
                    //console.log("Info button clicked");
                  }}
                  // style={{ color: 'black' }}
                />
              </div>
            )}
          </>
        ),

        // Cell: ({ cell }) => {
        //   const cellValue = cell.getValue() !== null ? cell.getValue() : "";
        //   const nameWithoutSpecialChars = cellValue.replace(
        //     /\^&\d+\^&\d+/g,
        //     ""
        //   );
        //   return (
        //     <div
        //       className={cell.column.id === "name" ? "" : "align right"}
        //       style={{
        //         whiteSpace: "nowrap",
        //         overflow: "hidden",
        //         textOverflow: "ellipsis",
        //       }}
        //       title={cell.getValue()}
        //     >
        //       {cell.column.id === "name" &&
        //       cell.row.original.parentId !== null ? (
        //         <div className="hExpandedTxt">
        //           {icons[cell.row.original["empStatus"]]}{" "}
        //           <span>{cell.getValue()}</span>
        //         </div>
        //       ) : cell.column.id === "emp_cadre" ? (
        //         cell.getValue()
        //       ) : cell.column.id === "supervisor" ? (
        //         cell.getValue()
        //       ) : cell.row.original.lvl === 2 ? (
        //         cell.getValue()
        //       ) : (
        //         <strong>{cell.getValue()}</strong>
        //       )}
        //       {cell.column.id === "name" ||
        //       cell.column.id === "emp_cadre" ||
        //       cell.column.id === "supervisor"
        //         ? ""
        //         : "%"}
        //     </div>
        //   );
        // },
        Cell: ({ cell }) => {
          const cellValue = cell.getValue() !== null ? cell.getValue() : "";
          const nameWithoutSpecialChars = cellValue.replace(
            /\^&\d+\^&\d+/g,
            ""
          );
          // console.log(nameWithoutSpecialChars);
          const isNullValue = cell.column.name === null;
          // console.log(isNullValue);
          // console.log(cell.column.id);
          return (
            <div
              className={
                cell.column.id === "name"
                  ? ""
                  : cell.column.id === "ytd"
                  ? "ytdColor ytd"
                  : cell.column.id.includes("_01_01_qrtr")
                  ? "QuarterColor quarter"
                  : cell.column.id.includes("_04_01_qrtr")
                  ? "QuarterColor quarter"
                  : cell.column.id.includes("_07_01_qrtr")
                  ? "ytdColor ytd"
                  : cell.column.id === "qtd"
                  ? "QuarterColor quarter"
                  : cell.column.id === "nxt30_days"
                  ? "ytdColor ytd"
                  : cell.column.id === "nxt60_days"
                  ? "QuarterColor quarter"
                  : cell.column.id === "average"
                  ? "ytdColor ytd"
                  : "align right"
                  ? cell.column.id === "emp_cadre"
                  : "align left"
              }
              title={isNullValue ? "" : nameWithoutSpecialChars}
            >
              {cell.column.id === "name" &&
              cell.row.original.parentId !== null ? (
                <div className="hExpandedTxt">
                  {icons[cell.row.original["empStatus"]]}{" "}
                  <span>{isNullValue ? "" : nameWithoutSpecialChars}</span>
                </div>
              ) : cell.column.id == "name" && cell.column.lvl == 0 ? (
                <div className="gery">{cell.row.original}</div>
              ) : cell.column.id === "emp_cadre" ? (
                isNullValue ? (
                  ""
                ) : (
                  nameWithoutSpecialChars
                )
              ) : cell.column.id === "supervisor" ? (
                isNullValue ? (
                  ""
                ) : (
                  nameWithoutSpecialChars
                )
              ) : cell.row.original.lvl === 2 ? (
                isNullValue ? (
                  ""
                ) : (
                  nameWithoutSpecialChars
                )
              ) : isNullValue ? (
                ""
              ) : (
                nameWithoutSpecialChars
              )}
              {cell.column.id === "name" ||
              cell.column.id === "emp_cadre" ||
              cell.column.id === "supervisor" ||
              cell.row.original.id === 9999
                ? ""
                : "%"}
            </div>
          );
        },
      });
    });

    //console.log("in line 97-------");
    //console.log(newHeaders);

    setColumns(newHeaders);

    let values = [];
    tableData?.map((d) => (d.id !== -1 ? values.push(d) : ""));

    //console.log("in line 94--------");
    //console.log(tableData);
    //console.log(values);

    setNodes(jsonToTree(values, { children: "subRows" }));

    //console.log(jsonToTree(values, { children: "subRows" }), "nodes");

    //   setColumns(resp.data.tableData);
    // });
  };

  // useEffect(() => {
  //   colExpFlag ? setHiddenColumns({}) : colCollapse();
  // }, [colExpFlag]);
  useEffect(() => {
    colExpFlag ? expandT() : expandF();
    // getData();
  }, [colExpFlag]);

  const expandT = () => {
    count++;
    getData();
    setHiddenColumns({});
  };

  const expandF = () => {
    getData();
  };
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
    //console.log(flatArray, "flatArray in json to tree");
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
    Object.values(dictionary).forEach((obj) => {
      if (typeof obj[options.id] === "undefined") {
        tree.push(...obj[children]);
      }
    });
    return tree;
  };

  return (
    <div className="materialReactExpandableTable billableUtilTrendTable darkHeader">
      {columns?.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={true} //hide expand all double arrow in column header
          enableExpanding
          enablePagination={false}
          //enableRowVirtualization
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableSorting={false}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
          }} //expand all rows by default
          state={{ columnVisibility: { ...hiddenColumns } }}
          defaultColumn={{ minSize: 40, maxSize: 250, size: 40 }} //
          enableStickyHeader
          muiTableContainerProps={{
            sx: {
              maxHeight: `${maxHeight - 1}px`,
            },
          }}
          muiTableBodyProps={{
            sx: {
              "&": {},
              "& td": {
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
                borderTop: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                background: "#f4f4f4 ",
                fontSize: "13px",
                fontWeight: "bold",
              },
            },
          }}
        />
      ) : null}
      {anchorEl && (
        <UtilizationFYPopUp
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          iconName={iconName}
          setIconName={setIconName}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}
