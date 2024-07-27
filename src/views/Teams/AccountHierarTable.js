import React, { useState, useEffect, useRef } from "react";
import MaterialReactTable from "material-react-table";
import { IconButton } from "@mui/material";
import { AiFillRightCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { environment } from "../../environments/environment";
import CSL from "../../assets/images/TeamsHierarImg/CSL.png";
import CSLHead from "../../assets/images/TeamsHierarImg/CSLHead.png";
import DP from "../../assets/images/TeamsHierarImg/DP.png";
import AW from "../../assets/images/TeamsHierarImg/AW.png";
import AE from "../../assets/images/TeamsHierarImg/AE.png";
import ACSL from "../../assets/images/TeamsHierarImg/ACSL.png";
import DPHead from "../../assets/images/TeamsHierarImg/DPHead.png";
import TP from "../../assets/images/TeamsHierarImg/TP.png";
import PC from "../../assets/images/TeamsHierarImg/PC.png";
import SQA from "../../assets/images/TeamsHierarImg/SQA.png";
import "./TeamsHierarchyTable.scss";
import Loader from "../Loader/Loader";

import axios from "axios";

function AccountHierarTable(props) {
  const {
    data,
    expandedCols,
    colExpandState,
    staticColumns,
    setActiveProjectsByCustomer,
    activeProjectsByCustomer,
    setShowcslproject,
    setShowacchieDataTable,
    showacchieDataTable,
    setShowacctHieTable,
    setAccountHieFirstTable,
    setProjectNameSuggest,
  } = props;
  useEffect(() => {}, [data]);
  if (data.tableData && data.tableData.length > 0) {
    const keys = Object.keys(data.tableData[0]);
    data.columns = "'account,role'";
  }
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const baseUrl = environment.baseUrl;
  const [loader1, setLoader1] = useState(false);
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader1(false);
  };
  const getActiveProjectsByCustomer = (id) => {
    const undefinedID = id == undefined ? 0 : id;

    const loaderTime = setTimeout(() => {
      setLoader1(true);
    }, 2000);
    setLoader1(false);
    axios
      .get(
        baseUrl +
          `/teamms/Hierarchy/getActiveProjectsByCustomer?CustomerId=${undefinedID}`
      )
      .then((resp) => {
        const getData = resp.data;
        for (const index in getData) {
          const item = getData[index];
          item.label = `${item.project_code} - ${item.label}`;
        }
           setLoader1(false);
        clearTimeout(loaderTime);
        setActiveProjectsByCustomer(getData);
        setAccountHieFirstTable(getData);
        setShowacctHieTable(false);
        setShowacchieDataTable(true);
      });
  };

  useEffect(() => {
    setShowacchieDataTable(true);
    const firstNonNullCustomerId1 = data.tableData.find(
      (item) =>
        item.customer_id !== null &&
        item.customer_id !== undefined &&
        item.customer_id !== 0
    )?.customer_id;
    getActiveProjectsByCustomer(firstNonNullCustomerId1);
  }, [data]);

  useEffect(() => {
    getData();
  }, [data]);
  const getData = () => {
    let tableData = data.tableData;
    function customSort(a, b) {
      if (a.accountwcode === b.accountwcode) {
        if (a.role === "Click For Projects") return 1;
        if (b.role === "Click For Projects") return -1;
      }
      return 0;
    }
    tableData.sort(customSort);
    let columns = null;

    if (data?.columns?.includes("'")) {
      columns = data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.columns;
    }

    if (columns == null) {
      columns = staticColumns;
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
    let filteredHeaders = headerArray;
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
        header: value,
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => {
          return (
            <div>
              {value}
              {key == colExpandState[2] ? (
                <IconButton
                  onClick={() => {
                    setColumnExpFlag((prev) => !prev);
                  }}
                >
                  <AiFillRightCircle />
                </IconButton>
              ) : null}
            </div>
          );
        },

        Cell: ({ cell }) => {
          return (
            <div>
              {cell.column.id === "role" &&
              cell.getValue() === "Click For Projects" ? (
                <Link
                  onClick={(e) => {
                    setProjectNameSuggest(cell.row.original.account);
                    getActiveProjectsByCustomer(cell.row.original.customer_id);
                  }}
                >
                  Click For Projects
                </Link>
              ) : cell.getValue() === "AW" ? (
                <div>
                  <img
                    src={AW}
                    style={{ height: "10px", width: "10px" }}
                    title="Account Owner"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name} (AW)
                  </span>
                </div>
              ) : cell.getValue() === "CSL" ? (
                <div>
                  <img
                    src={CSL}
                    style={{ height: "10px", width: "10px" }}
                    title="CSL"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name} (CSL)
                  </span>
                </div>
              ) : cell.getValue() === "CSL Head" ? (
                <div>
                  <img
                    src={CSLHead}
                    style={{ height: "10px", width: "10px" }}
                    title="CSL Head"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name} (CSL Head)
                  </span>
                </div>
              ) : cell.getValue() === "DP" ? (
                <div>
                  <img
                    src={DP}
                    style={{ height: "10px", width: "10px" }}
                    title="Delivery Partner"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name} (DP)
                  </span>
                </div>
              ) : cell.getValue() === "ACSL" ? (
                <div>
                  <img
                    src={ACSL}
                    style={{ height: "10px", width: "10px" }}
                    title="ACSL"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name} (ACSL)
                  </span>
                </div>
              ) : cell.getValue() === "DP Head" ? (
                <div>
                  <img
                    src={DPHead}
                    style={{ height: "10px", width: "10px" }}
                    title="DP Head"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name} (DP Head)
                  </span>
                </div>
              ) : cell.column.id === "role" && cell.getValue() === "AE" ? (
                <div>
                  <img
                    src={AE}
                    style={{ height: "10px", width: "10px" }}
                    title="Account Executive"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name}(AE)
                  </span>
                </div>
              ) : cell.column.id === "role" && cell.getValue() === "TP" ? (
                <div>
                  <img
                    src={TP}
                    style={{ height: "10px", width: "10px" }}
                    title="TP"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name}(TP)
                  </span>
                </div>
              ) : cell.column.id === "role" && cell.getValue() === "PC" ? (
                <div>
                  <img
                    src={PC}
                    style={{ height: "10px", width: "10px" }}
                    title="PC"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name}(PC)
                  </span>
                </div>
              ) : cell.column.id === "role" && cell.getValue() === "SQA" ? (
                <div>
                  <img
                    src={SQA}
                    style={{ height: "10px", width: "10px" }}
                    title="SQA"
                  />
                  <span
                    className="ellipsis"
                    title={cell.row.original.resource_name}
                  >
                    {cell.row.original.resource_name}(SQA)
                  </span>
                </div>
              ) : cell.column.id === "account" ? (
                cell.row.original.lvl === 1 ? (
                  <div
                    className="cslPartner ellipsis"
                    title={cell.row.original.account}
                  >
                    {cell.row.original.account}
                  </div>
                ) : null
              ) : cell.column.id === "account" ? (
                <div className="ellipsis">
                  {cell.row.original.lvl === 2 &&
                  cell.row.original.resource_name === null &&
                  cell.row.original.role !== "Click For Projects"
                    ? cell.row.original.account
                    : null}
                </div>
              ) : null}
            </div>
          );
        },
      });
    });
    setColumns(newHeaders);
    tableData = tableData.slice(1);

    setColumns(newHeaders);
    let values = [];
    tableData?.map((d) => values.push(d));
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
      id: "id",
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
      const newNode = {
        [children]: [],
        ...node,
      };
      dictionary[nodeId] = newNode;
      dictionary[nodeParentId] = dictionary[nodeParentId] || { [children]: [] };
      dictionary[nodeParentId][children].push(newNode);
    });
    Object.values(dictionary).forEach((obj) => {
      if (typeof obj[options.id] === "undefined") {
        tree.push(...obj[children]);
      }
    });
    return tree;
  };

  return (
    <div className="materialReactExpandableTable headSticky cslPartnerTable darkHeader">
      {columns?.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          enableExpandAll={true}
          enableExpanding
          enablePagination={false}
          enableRowVirtualization={true}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableSorting={false}
          filterFromLeafRows
          initialState={{
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
            columnPinning: { right: ["total"] },
          }}
          state={{ columnVisibility: { ...hiddenColumns } }}
          defaultColumn={{ minSize: 40, maxSize: 1000, size: 40 }}
          muiTableContainerProps={{
            sx: {
              maxHeight: "calc(100vh - 147px)",
              width: "auto",
              maxWidth: "100%",
            },
          }}
          muiTableBodyProps={{
            sx: {
              "&": {
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              },
              "& td:first-of-type": {
                minWidth: "60px",
                maxWidth: "60px",
              },
              "& td": {
                // borderTop: "1px solid #ccc",
                borderRight: "1px solid #ccc",
                height: "22px",
                padding: "0px 5px",
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
                height: "33px",
              },
              "& th:not(:first-of-type)": {
                justifyContent: "center", // Apply justify-content: center to non-first columns
              },
              "& th:first-of-type": {
                minWidth: "60px",
                maxWidth: "60px",
              },
            },
          }}
        />
      ) : null}
      {loader1 ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}
export default AccountHierarTable;
