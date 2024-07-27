import React, { useState } from "react";
import { useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { FaCircle, FaGithub } from "react-icons/fa";
import "../Innovation/InnovationRevenue.scss";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { useEffect } from "react";

export default function InnovationRevenueMaterialTbale(props) {
  const { results, expandedCols, colExpandState, cols } = props;
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [nodes, setNodes] = useState([]);
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

  const columns = useMemo(
    () => [
      {
        header: "Theme / Solution / Project",
        accessorKey: "name",
        enableSorting: false,
        id: "name",
        accessorKey: "name",
        enableSorting: false,
        Cell: ({ cell }) => {
          const item = cell.row.original;
          const isLvl3 = item.lvl === "3";
          if (isLvl3) {
            const names = item?.name;
            const items = names.split("@^");
            const uniqueNamesMap = new Map();
            const itemsWithDetails = items.map((item) => {
              const idMatch = item.match(/id:(\d+),/);
              const nameMatch = item.match(/name:(.*?)(?:,|$)/);
              const gitMatch = item.match(/git:(.*?)(?:"|$)/);
              if (idMatch && nameMatch && gitMatch) {
                const id = idMatch[1].trim();
                const name = nameMatch[1].trim();
                const git = gitMatch[1].trim();
                if (uniqueNamesMap.has(name)) {
                  return null;
                }
                uniqueNamesMap.set(name, { id, name, git });
                return { id, name, git };
              }
              return null;
            });
            let uniqueNamesSet = new Set();
            itemsWithDetails.forEach((item) => {
              const itemName = item?.name !== null ? item?.name : ""; // Set to empty string if name is null
              if (uniqueNamesSet.has(itemName)) {
                item.name = "";
              } else {
                uniqueNamesSet.add(itemName);
              }
            });

            const childItems = Array.from(uniqueNamesMap.values()).map(
              (i, index) => (
                <div key={i.id}>
                  <a
                    href={`#/project/Overview/:${i.id}`}
                    target="_blank"
                    title={i.name}
                    className="ellipsis lvl3"
                    style={{
                      textOverflow: "ellipsis",
                      display: "inline-block",
                      maxWidth: "245px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {i.name}
                  </a>{" "}
                  {i.git !== "" && (
                    <a
                      href={i.git}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open GitLab URL"
                      style={{
                        backgroundColor: "none",
                        color: "black",
                      }}
                    >
                      <FaGithub
                        style={{
                          float: "right",
                          cursor: "pointer",
                          color: "black",
                        }}
                      />
                    </a>
                  )}
                </div>
              )
            );

            return (
              <div
                className={
                  childItems == ""
                    ? "RemoveEmptyBorderTop"
                    : "RemoveEmptyBorderBottom"
                }
                style={{ textAlign: "left", paddingLeft: "40px" }}
              >
                {childItems.length > 0 && (
                  <React.Fragment>{childItems}</React.Fragment>
                )}
              </div>
            );
          } else {
            const cellValue = cell.getValue();
            return (
              <div
                className={
                  item.lvl === "2" ? "custom-class-for-lvl-2 ellipsis" : ""
                }
                title={cellValue}
              >
                {cellValue}
              </div>
            );
          }
        },
      },
      {
        Header: "Opportunity",
        id: "opportunity",
        accessorKey: "opportunity",
        enableSorting: false,
        Cell: ({ cell }) => {
          return (
            <div>
              <a
                href="https://login.salesforce.com/?ec=302&startURL=%2F0061W00001TjL0aQAF"
                target="_blank"
                rel="noopener noreferrer"
                title={cell.row.original.opportunity}
              >
                {cell.row.original.opportunity}
              </a>
            </div>
          );
        },
      },
      {
        header: "Customer / Prospect",
        accessorKey: "customer",
        enableSorting: false,
        id: "customer",
        accessorKey: "customer",
        Cell: ({ cell }) => {
          const item = cell.row.original;
          return (
            <div
              className={item.lvl == "3" ? "lvl3withoutlink" : ""}
              title={item.customer}
            >
              {item?.customer !== "" && (
                <>
                  {item?.isProspect === "No" ? (
                    <FaCircle
                      style={{ color: "#539a71", marginRight: "5px" }}
                    />
                  ) : (
                    <FaCircle
                      style={{ color: "#9567c2", marginRight: "5px" }}
                    />
                  )}
                </>
              )}
              {item?.customer}
            </div>
          );
        },
      },
      {
        header: "Executive",
        accessorKey: "executive",
        enableSorting: false,
        id: "executive",
        accessorKey: "executive",
        Cell: ({ cell }) => {
          const item = cell.row.original;
          return (
            <span title={item.executive}>
              {icons[item?.empStatus]} &nbsp;
              {item.executive}
            </span>
          );
        },
      },
      {
        header: "Solution Director",
        accessorKey: "director",
        enableSorting: false,
        Cell: ({ cell }) => {
          const item = cell.row.original;
          return <span title={item.director}>{item.director}</span>;
        },
      },
      {
        header: "Stage",
        accessorKey: "oppStage",
        enableSorting: false,
        Cell: ({ cell }) => {
          const item = cell.row.original;
          return <span title={item.oppStage}>{item.oppStage}</span>;
        },
      },
      {
        header: "Prob %",
        accessorKey: "probability",
        enableSorting: false,
        Cell: ({ cell }) => {
          const item = cell.row.original;

          return (
            <div style={{ textAlign: "right" }}>
              <span title={item.probability}>{item.probability}</span>
            </div>
          );
        },
      },
      {
        header: "Amount($)",
        accessor: "amount",
        enableSorting: false,
        Cell: ({ cell }) => {
          const item = cell.row.original;
          const formattedAmount =
            typeof parseFloat(item.amount) === "number"
              ? parseFloat(item.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })
              : item.amount;
          return (
            <div style={{ textAlign: "right" }}>
              <span title={formattedAmount}>{formattedAmount}</span>
            </div>
          );
        },
      },
    ],
    [hiddenColumns]
  );

  useEffect(() => {
    getData();
  }, [results]);

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

  const getData = () => {
    let tableData = results;
    let columns = null;
    let colArr = cols?.split(",");
    let newHeaders = [];
    let hiddenHeaders = [];
    const obj = {};
    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();
      let firstData = tableData[0];
      obj[colVal] = {
        value: firstData[colVal],
        rowgroup: true, // Add the rowgroup property
      };
    }

    let headerArray = Object.entries(obj);
    let unWantedCols = [
      "id",
      "lvl",
      "themeId",
      "count",
      "keyAttr",
      "parentId",
      "solutionId",
      "departmentId",
      "customerId",
      "projectId",
      "uniqueId",
      "sfOppId",
    ];
    let colArrr = headerArray.filter((d) => !unWantedCols.includes(d[0]));

    let filteredHeaders = headerArray.filter(
      (d) => !unWantedCols.includes(d[0])
    );
    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      } else {
        hiddenHeaders.push({ [key]: true });
      }
    });
    // setHiddenColumns(Object.assign({}, ...hiddenHeaders));
    let minusOneRow = tableData?.filter((d) => d.id == -1);
    let subHeaders = minusOneRow && Object.entries(minusOneRow[0]);
    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let subArray = [];
      subHeaders.map(([key, value], index) => {
        let obj = {
          id: key,
          header: "name",
          accessorKey: "name",
          Cell: ({ cell, row }) => {
            return <div title={cell.getValue()}>{cell.getValue()}</div>;
          },
        };
        newHeaders[i].columns = [obj];
      });
    });
    let values = [];
    tableData?.map((d) => values.push(d));
    let tempData = jsonToTree(values, { children: "subRows" });
    setNodes(tempData.slice(1, tempData.length));
  };

  const [expandedRowCount, setExpandedRowCount] = useState(0);
  const [expandedRowCount1, setExpandedRowCount1] = useState(0);
  const [hasCorrectStyle, setHasCorrectStyle] = useState(false);
  const [expandCountForAll, setExpandCountForAll] = useState(0);
  const [iconstrue, setIconTrue] = useState(false);
  const handleBodyClick = (event) => {
    const hasMuiSvgIconClass =
      event.target.classList.contains("MuiSvgIcon-root") &&
      event.target.classList.contains("MuiSvgIcon-fontSizeMedium");
    const hasPathElement =
      event.target.tagName.toLowerCase() === "path" &&
      event.target.getAttribute("d") ===
        "m18 13-1.41-1.41L12 16.17l-4.59-4.58L6 13l6 6z";
    setIconTrue(hasMuiSvgIconClass || hasPathElement);
    const collapseSpans = document.querySelectorAll(
      'span[aria-label="Collapse"]'
    );
    setExpandedRowCount(collapseSpans.length);
    const expandSpan = document.querySelector('span[aria-label="Expand all"]');
    const collapseSpan = document.querySelector(
      'span[aria-label="Collapse all"]'
    );
    if (expandSpan) {
      const spanStyle = expandSpan.getAttribute("style");
      const hasUndesiredRotation =
        spanStyle ===
        "transform: rotate(-180deg); transition: transform 150ms ease 0s;";
      setHasCorrectStyle(hasUndesiredRotation);
    } else if (collapseSpan) {
      const spanStyle = collapseSpan.getAttribute("style");
      const hasUndesiredRotation =
        spanStyle ===
        "transform: rotate(-180deg); transition: transform 150ms ease 0s;";
      setHasCorrectStyle(!hasUndesiredRotation);
    }
  };

  document.body.addEventListener("click", handleBodyClick);

  useEffect(() => {
    const updatedHiddenColumns = { ...hiddenColumns };

    const areHiddenColumnsCorrect = expandedCols.every((key) => {
      return updatedHiddenColumns[key] === hasCorrectStyle;
    });

    if (!areHiddenColumnsCorrect) {
      expandedCols.forEach((key) => {
        updatedHiddenColumns[key] = hasCorrectStyle;
      });

      setHiddenColumns(updatedHiddenColumns);
    }
  }, [hasCorrectStyle]);
  return (
    <div className="materialReactExpandableTable InnovationRevenue darkHeader toHead ">
      <MaterialReactTable
        enableExpandAll={true}
        columns={columns}
        enableColumnActions={false}
        enableTopToolbar={false}
        enableBottomToolbar={false}
        enablePagination={false}
        data={nodes}
        enableExpanding
        enableStickyHeader={true}
        enableStickyFooter={true}
        enableColumnResizing={true}
        initialState={{
          expanded: false,
          density: "compact",
          columnVisibility: { ...hiddenColumns },
        }}
        state={{ columnVisibility: { ...hiddenColumns } }}
        muiExpandButtonProps={(row, table) => ({
          onClick: (event, cell) => {
            if (row.row.original.lvl === "2") {
              const isExpanded = !row.row.getIsExpanded();
              const updatedHiddenColumns = { ...hiddenColumns };
              setExpandedRowCount((prevExpandedRowCount) => {
                const newCount = isExpanded
                  ? prevExpandedRowCount + 1
                  : prevExpandedRowCount - 1;
                if (newCount > 0) {
                  expandedCols.forEach((key) => {
                    updatedHiddenColumns[key] = true;
                  });
                } else {
                  expandedCols.forEach((key) => {
                    updatedHiddenColumns[key] = false;
                  });
                }
                setHiddenColumns(updatedHiddenColumns);
                return newCount;
              });
            }
          },
        })}
        muiTableBodyCellProps={{
          sx: {
            width: "100%",
          },
        }}
        muiTableBodyProps={{
          sx: {
            "&": {
              borderRight: "1px solid #ccc",
              borderBottom: "1px solid #ccc",
            },
            "& td": {
              borderTop: "1px solid #ccc",
              borderRight: "1px solid #ccc",
              fontSize: "12px",
            },
            "& td:nth-of-type(2)": {
              minWidth: "280px",
              maxWidth: "280px",
            },
            "& tr": {
              backgroundColor: (theme) => ({
                backgroundColor: theme.palette.primary.main,
              }),
              "&:first-of-type td": {
                // background: "#D4E7FB",
              },
            },
            "& tr.lvl2Row": {
              backgroundColor: "#D4E7FB",
            },
          },
        }}
        muiTableHeadProps={{
          sx: {
            "& th": {
              borderTop: "1px solid #ccc",
              borderRight: "1px solid #ccc",
              background: "#f4f4f4 ",
              fontSize: "12px",
            },
          },
        }}
      />
    </div>
  );
}
