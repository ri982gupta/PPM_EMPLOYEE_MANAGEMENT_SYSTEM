import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Box, IconButton } from "@mui/material";
import axios from "axios";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { AiFillRightCircle } from "react-icons/ai";
import { CListGroup } from "@coreui/react";
import { GoPerson } from "react-icons/go";
import "./VendorPerformance.scss";
import VendorPerformanceResourceTable from "./VendorPerformanceResourceTable";
import moment from "moment";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import { displayName } from "react-quill";
import { Block } from "@mui/icons-material";
import { useRef } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import "./VendorPerformanceTopMaterialTable.scss";
import { environment } from "../../environments/environment";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

export default function VendorPerformanceTopMaterialTable(props) {
  const {
    data,
    expandedCols,
    colExpandState,
    rFormData,
    exportData,
    tableDisplayView,
    isOn,
    countNw,
    subKGmAnalysis,
    countname,
    vendorId,
    openNw,
  } = props;

  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [openResource, setOpenResource] = useState(false);
  const [loader, setLoader] = useState(false);
  const [colorFilter, setColorFilter] = useState([]);
  const [responseData, setResponseData] = useState(false);
  const [flag, setFlag] = useState(false);
  const [colAr, setColAr] = useState([]);
  const [columnsOrder, setColumnsOrder] = useState([]);
  const [openResourceNw, setOpenResourceNw] = useState(false);
  const abortController = useRef(null);
  console.log(rFormData, "rFormData");
  const baseUrl = environment.baseUrl;
  const [maxHeight, setMaxHeight] = useState();

  const materialTableElement = document.getElementsByClassName(
    "materialReactExpandableTable VendorPerformanceTop toHead darkHeader"
  );

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  useEffect(() => {
    if (isOn) {
      setMaxHeight(maxHeight1 - 26);
    } else {
      setMaxHeight(maxHeight1);
    }
  }, [maxHeight1, isOn]);
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

  //resoucreworkstate

  let start = rFormData.month;
  let end = moment(start).endOf("month").format("yyyy-MM-DD");
  let country = rFormData.countryIds == "" ? -1 : rFormData.countryIds;

  const initialValue = {
    vendor: -1,
    customer: "0",
    project: "0",
    department: "0",
  };

  const [rdata, setRData] = useState([]);
  const [formData, setFormData] = useState(initialValue);

  const resourseDetailsTable = (event, cell, key) => {
    let parts, resultStart, resultEnd;
    parts = key.split("_");
    parts.pop(); // Remove the last element
    resultStart = parts.join("-");
    resultEnd = moment(resultStart).endOf("month").format("yyyy-MM-DD");

    let end = moment(start).endOf("month").format("yyyy-MM-DD");
    console.log(key, "key");
    setOpenResourceNw(false);
    event.preventDefault();
    console.log(cell, "cell");
    cell.row.original.lvl == 1
      ? (formData.vendor = cell.row.original.vendorId) &&
        (start = resultStart) &&
        (end = resultEnd)
      : cell.row.original.lvl == 2
      ? (formData.vendor = cell.row.original.vendorId) &&
        (formData.customer = cell.row.original.customerId) &&
        (start = resultStart) &&
        (end = resultEnd)
      : cell.row.original.lvl == 3
      ? (formData.vendor = cell.row.original.vendorId) &&
        (formData.customer = cell.row.original.customerId) &&
        (formData.project = cell.row.original.projectId) &&
        (start = resultStart) &&
        (end = resultEnd)
      : cell.row.original.lvl == 4
      ? (formData.vendor = cell.row.original.vendorId) &&
        (formData.customer = cell.row.original.customerId) &&
        (formData.project = cell.row.original.projectId) &&
        (formData.customer = cell.row.original.customerId) &&
        (start = resultStart) &&
        (end = resultEnd)
      : cell.row.original.lvl == 0
      ? (formData.vendor = vendorId == undefined ? -1 : vendorId) &&
        (start = resultStart) &&
        (end = resultEnd)
      : "";

    setOpenResource(true);
    abortController.current = new AbortController();
    // !valid && setVisible(!visible);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url:
        subKGmAnalysis != "subkGmAnalysisScreen"
          ? baseUrl + `/VendorMS/management/getVendManagementResourceDtls`
          : baseUrl + `/VendorMS/management/getSubKGmAnalysisResourceList`,
      signal: abortController.current.signal,
      data: {
        buIds: -1,
        country: country,
        fromDate: start,
        toDate: end,
        lkKey: subKGmAnalysis == "subkGmAnalysisScreen" ? "total_hc" : "",
        skillId: 0,
        isExport: 0,
        vendorId: formData.vendor,
        page: "performance",
        custId: formData.customer,
        projId: formData.project,
        buId: formData.department,
      },

      // headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        var response = response.data;
        setResponseData(response);
        clearTimeout(loaderTime);
        setOpenResourceNw(true);

        let Headerdata = [
          {
            employee_number: "Emp ID",
            resource_name: "Name",
            start_date: "DOJ",
            department: "Dept",
            supervisor: "Supervisor",
            skills: "Skill",
            projects: "Projects",
            bill_allocs: "Billable Allocs",
            bill_rate: "Bill Rate($)",
            pay_rate: "Pay Rate($)",
            gm_perc: "GM%",
            alloc_end_date: "Alloc End Date",
            contract_end_date: "Contract End Date",
            ad_contract_end_date: "AD Expiry Date",
            vendor_name: "Vendor Name",
            contract_type: "Contract Type",
            skill_type: "Skill Type",
          },
        ];
        let hData = [];
        let bData = [];
        for (let index = 0; index < response.length; index++) {
          if (index == 0) {
            hData.push(response[index]);
          } else {
            bData.push(response[index]);
          }
        }
        setRData([]);
        setRData(Headerdata.concat(bData));
        //color sorting

        let firstColor,
          secondColor,
          thirdColor = "",
          count = 0;
        firstColor = bData[0].alloc_contract_date_icon?.split("~")[0];
        secondColor = "";
        for (let index = 0; index < bData.length; index++) {
          let colorFind = bData[index].alloc_contract_date_icon?.split("~")[0];
          if (firstColor != colorFind && count == 0) {
            secondColor = colorFind;
            count++;
          } else if (firstColor != colorFind && secondColor != colorFind) {
            thirdColor = colorFind;
            break;
          }
        }
        const colorFilter = [firstColor, secondColor, thirdColor];
        setColorFilter(colorFilter);
      })
      .catch((e) => {
        console.log(e);
      });
    // setLoader(true);
  };
  useEffect(() => {
    setLoader(false);
  }, [responseData]);

  // const numberWithCommas = (x) => {
  //   return x
  //     ?.toLocaleString(undefined, {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //       useGrouping: true,
  //     })
  //     .replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");
  // };
  const numberWithCommas = (x) => {
    //console.log(typeof x);
    var number = String(x);
    // console.log(typeof number);
    //console.log(number.includes(".") ? number : "");
    if (number.includes(".") == true) {
      var decimalNumbers = number;
      var num = Number(decimalNumbers);
      let FdN = num != null && num?.toFixed(1);
      let final = FdN.split(".");
      final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");
      //console.log(
      // final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ","),
      //final
      //);
      return final.join(".");
    } else {
      return (
        number != null && number?.replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",")
      );
    }
  };
  var count = 0;
  // var columnsorder = null;
  const getData = () => {
    // var countNw = 0;
    //console.log(colExpFlag, 'colExpFlag');
    let expandClass = "";
    //console.log(count, 'count')
    if (colExpFlag == true && count > 0) {
      expandClass = "expanded";
    } else {
      expandClass = "";
    }
    setFlag(true);
    let tableData = data.tableData;

    let columns = null;

    if (data?.vmgPerformance?.includes("'")) {
      columns = data?.vmgPerformance?.replaceAll("'", "");
    } else {
      columns = data?.vmgPerformance;
    }

    // console.log();
    let colArr = columns?.split(",");
    //console.log(colArr, 'colArr');

    let newHeaders = [];
    let hiddenHeaders = [];

    const obj = {};

    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();

      let firstData = tableData[0];
      obj[colVal] = firstData[colVal];
    }

    let headerArray = Object.entries(obj);
    //console.log(headerArray);

    let unWantedCols = [
      "id",
      "department",
      "customer",
      "vendor",
      "country",
      "project",
      "resource",
      "departmentId",
      "customerId",
      "projectId",
      "vendorId",
      "empStatus",
      "lvl",
      "count",
      "keyAttr",
    ];

    let filteredHeaders = headerArray.filter(
      (d) =>
        !unWantedCols.includes(d[0]) &&
        !d[0].includes("billAmt") &&
        !d[0].includes("gm") &&
        !d[0].includes("rcount")
    );
    let colArrr = headerArray.filter((d) => !unWantedCols.includes(d[0]));
    setColAr(colArrr);

    let unWantedColumns = [
      "id",
      "resource",
      "departmentId",
      "customerId",
      "projectId",
      "vendorId",
      "empStatus",
      "lvl",
      "count",
      "keyAttr",
    ];

    setColumnsOrder(headerArray.filter((d) => !unWantedColumns.includes(d[0])));
    // console.log(columnsorder, "columnsorder");
    // let filteredHeaders = headerArray.filter(
    //   ([key, value]) => typeof value === "string" && value.includes("^&")
    // );

    // console.log("in line 69----");
    // console.log(filteredHeaders);

    setHeaders(filteredHeaders);

    filteredHeaders.map(([key, value]) => {
      if (expandedCols.includes(key)) {
        hiddenHeaders.push({ [key]: false });
      }
    });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let minusOneRow = tableData?.filter((d) => d.id == -1);
    // console.log(minusOneRow, "---------minusonerow");
    filteredHeaders.map(([key, value], index) => {
      //console.log(filteredHeaders);
      newHeaders.push({
        id: key,
        accessorKey: key,
        // header: value?.split("^&")[0],
        header: value,
        enableColumnActions: false,
        enableHiding: true,
        Header: ({ column }) => (
          <div
            className={
              key == "name" || key == "emp_cadre" || key == "supervisor"
                ? "mixer"
                : ""
            }
            title={value.split("^&")[0]}
          >
            <span>{value.split("^&")[0]}</span>
            {/* {value}{" "} */}
            {key == colExpandState[2] ? (
              <span className={`expandIcon ${expandClass}`}>
                <IconButton
                  onClick={() => {
                    setColumnExpFlag((prev) => !prev);
                  }}
                >
                  <AiFillRightCircle />
                </IconButton>
              </span>
            ) : null}
          </div>
        ),

        /* Cell: ({cell}) => (
         <div className={cell.column.id == "emp_cadre" && "childRow"}>
            {cell.getValue()}
          </div>
         )*/
      });
    });

    let subHeaders = minusOneRow && Object.entries(minusOneRow[0]);
    subHeaders?.sort();
    // console.log(subHeaders, "subHeaders");
    newHeaders.map((data) => {
      let i = newHeaders.indexOf(data);
      let subArray = [];
      subHeaders?.map(([key, value], index) => {
        let a = /\d/.test(key.split("_")[0]);
        if (
          key.includes("_") &&
          (a == true || (a == false && key.split("_")[0] == "total"))
        ) {
          let subkey = key.includes("action") ? "action" : key.split("_");
          subkey = key.includes("action")
            ? "action"
            : subkey.slice(0, -1).join("_");
          if (data.accessorKey.includes(subkey)) {
            //console.log("key matched!");
            let rcount = key.includes("total") ? key : "";

            let obj = {
              id: key,
              header:
                value == null || value == 0 ? (
                  ""
                ) : (
                  <div
                    className={
                      !key.includes("actionDate") &&
                      !key.includes("actionComments")
                        ? "sm"
                        : key.includes("department") && "nullCol"
                    }
                    title={value}
                  >
                    {value}
                  </div>
                ),
              accessorKey: key,
              enableSorting: true,

              //sorting

              sortingFn: (rowB, rowA, columnId) => {
                return rowA.id != "0" && rowB.id != "1"
                  ? rowB.getValue(columnId) - rowA.getValue(columnId)
                  : "";
              },

              Cell: ({ cell }) => {
                {
                  cell.row.original.resource != "";
                  // console.log(cell.row.original.name, "----res");
                }

                return (
                  <div
                    className={
                      key.includes("_")
                        ? key.split("_")[0] == "total"
                          ? "total"
                          : key.split("_")[1][1] % 2 == 0
                          ? "even"
                          : "odd"
                        : key.includes("emp_cadre") && "sm mixer"
                    }
                  >
                    {cell.column.id == "name" &&
                    cell.row.original != null &&
                    (cell.row.original.name != null ||
                      cell.row.original.name != "Summary") ? (
                      <>
                        {/* {icons[cell.row.original["empStatus"]]} */}
                        {cell.getValue()}
                      </>
                    ) : cell.column.id.includes("rcount") &&
                      cell.column.id != rcount &&
                      cell.getValue() != "0" &&
                      cell.row.original.lvl != "5" ? (
                      <div
                        className={
                          "ellipsis" + " " + key.includes("name")
                            ? "lvl-" + cell.row.original.lvl
                            : ""
                        }
                        data-toggle="tooltip"
                        title={numberWithCommas(cell.getValue())}
                      >
                        <a
                          href=""
                          role="button"
                          onClick={(event) => {
                            resourseDetailsTable(event, cell, key);
                            setTimeout(() => {
                              window.scroll({
                                top: 500,
                                left: 0,
                                behavior: "smooth",
                              });
                            }, 3000);
                          }}
                        >
                          {numberWithCommas(cell.getValue())}
                        </a>
                      </div>
                    ) : cell.row.original.lvl == 5 &&
                      (cell.column.id.includes("cost") ||
                        cell.column.id.includes("gm")) ? (
                      <div
                        className="ellipsis resource lvl"
                        data-toggle="tooltip"
                        title={numberWithCommas(Math.round(cell.getValue()))}
                      >
                        {numberWithCommas(Math.round(cell.getValue()))}
                      </div>
                    ) : cell.row.original.lvl != 5 &&
                      (cell.column.id.includes("cost") ||
                        cell.column.id.includes("gm")) ? (
                      <div
                        className={
                          "ellipsis" + " " + key.includes("name")
                            ? "lvl-" + cell.row.original.lvl
                            : ""
                        }
                        data-toggle="tooltip"
                        title={numberWithCommas(Math.round(cell.getValue()))}
                      >
                        {numberWithCommas(Math.round(cell.getValue()))}
                      </div>
                    ) : cell.row.original.lvl == 0 ? (
                      <div
                        className="ellipsis summary"
                        data-toggle="tooltip"
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(Math.round(cell.getValue()))}
                      </div>
                    ) : cell.row.original.lvl == 5 ? (
                      <div
                        className="ellipsis resource lvl"
                        data-toggle="tooltip"
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(Math.round(cell.getValue()))}
                      </div>
                    ) : (
                      <div
                        className={
                          "ellipsis" + " " + key.includes("name")
                            ? "lvl-" + cell.row.original.lvl
                            : "ellipsis"
                        }
                        data-toggle="tooltip"
                        title={numberWithCommas(cell.getValue())}
                      >
                        {numberWithCommas(Math.round(cell.getValue()))}
                      </div>
                    )}
                  </div>
                );
              },
            };
            subArray.push(obj);
            // console.log(obj["header"], "---line 165")
            // console.log(obj[index]?.filter((d) => d.includes("NB %")), "=====obj")
            newHeaders[i].columns = subArray;
          }
        } else {
          //console.log("key matched!");
          if (key == data.accessorKey) {
            let obj = {
              id: key,
              header: value == null || value == 0 ? "" : <div>{value}</div>,
              accessorKey: key,
              enableSorting: true,
              sortingFn: (rowB, rowA, columnId) => {
                //console.log(rowB, "rowB");
                //console.log(rowA, "rowA");
                //console.log(columnId, "columnId");
                const nameA = rowB.getValue(columnId).toLowerCase();
                const nameB = rowA.getValue(columnId).toLowerCase();
                return columnId == "name" && rowA.id != "0" && rowB.id != "1"
                  ? nameA.localeCompare(nameB)
                  : "";
              },

              Cell: ({ cell }) => {
                //console.log(cell.column.id,"cell.column.id " );
                // { cell.row.original.resource != "" && console.log(cell.row.original.name, "----res") }

                return (
                  <div
                    className={
                      cell.row.original.lvl == 0
                        ? "summary"
                        : cell.row.original.lvl == 1
                        ? cell.column.id == "name"
                          ? "parentRow"
                          : (cell.column.id == "emp_cadre" ||
                              cell.column.id == "supervisor") &&
                            "parentCadre"
                        : cell.row.original.lvl > 1 && cell.row.original.lvl < 6
                        ? cell.column.id == "name"
                          ? "childRow  "
                          : (cell.column.id == "emp_cadre" ||
                              cell.column.id == "supervisor") &&
                            "childCadre"
                        : ""
                    }
                  >
                    {cell.column.id == "name" &&
                    cell.row.original != null &&
                    (cell.row.original.name != null ||
                      cell.row.original.name != "Summary") ? (
                      <>
                        {icons[cell.row.original["empStatus"]]}
                        {/* <div
                          className={
                            key.includes("_")
                              ? key.split("_")[0] == "total"
                                ? "sm total ellipsis"
                                : key.split("_")[1][1] % 2 == 0
                                ? "sm even ellipsis"
                                : "sm odd ellipsis"
                              : "ellipsis"
                          }
                          data-toggle="tooltip"
                          title={cell.getValue()}
                        >
                          {cell.getValue()}
                        </div> */}
                        <div
                          className={
                            key.includes("_")
                              ? key.split("_")[0] == "total"
                                ? "sm total ellipsis"
                                : key.split("_")[1][1] % 2 == 0
                                ? "sm even ellipsis"
                                : "sm odd ellipsis"
                              : "ellipsis" + " " + key.includes("name")
                              ? "lvl-" + cell.row.original.lvl + " ellipsis"
                              : ""
                          }
                          data-toggle="tooltip"
                          title={cell.getValue()}
                        >
                          {/* Content inside the div */}
                          {cell.column.id === "name" &&
                            cell.row.original != null &&
                            (cell.row.original.name != null ||
                              cell.row.original.name !== "Summary") && (
                              <>
                                {/* Check if name and vendor are the same */}
                                {cell.row.original.name ===
                                cell.row.original.vendor ? (
                                  /* If they are the same, display as a link */
                                  // <a
                                  //   href={`some-link/${cell.row.original.name}`}
                                  //   onClick={(event) => {
                                  //     /* Your link click event handling code */
                                  //   }}
                                  // >
                                  //   {icons[cell.row.original["empStatus"]]}
                                  //   {cell.getValue()}
                                  // </a>
                                  <Link
                                    data-toggle="tooltip"
                                    title="Go To Project Overview"
                                    // to={`/vendor/vendorDoc/:${}`}
                                    to={`/vendor/vendorDoc/:${cell.row.original.vendorId}`}
                                    target="_blank"
                                  >
                                    {cell.getValue()}
                                  </Link>
                                ) : (
                                  /* If they are not the same, display as is */
                                  <>
                                    {/* {icons[cell.row.original["empStatus"]]} */}
                                    {cell.getValue()}
                                  </>
                                )}
                              </>
                            )}
                        </div>
                      </>
                    ) : (
                      <div
                        className={
                          "ellipsis" + " " + key.includes("name")
                            ? "lvl-" + cell.row.original.lvl + " ellipsis"
                            : ""
                        }
                        data-toggle="tooltip"
                        title={cell.getValue()}
                      >
                        {cell.getValue()}
                      </div>
                    )}
                  </div>
                );
                // <div>
                //     <p>i&nbsp;{cell.getValue()}</p>

                // </div>
              },
            };
            newHeaders[i].columns = [obj];
          }
        }
      });
    });

    setColumns(newHeaders);
    //console.log(countNw, 'countNw');
    let values = [];
    tableData?.map((d) => (d.id != -2 && d.id != -3 ? values.push(d) : ""));

    //console.log(values, "-------values");
    //console.log(tableData);

    let tempData = jsonToTree(values, { children: "subRows" });
    setNodes(tempData.slice(1, tempData.length));

    console.log(jsonToTree(values, { children: "subRows" }), "nodes");
  };
  useEffect(() => {
    getData();
  }, [data.tableData]);
  const expandT = () => {
    count++;
    getData();
    setHiddenColumns({});
  };
  const expandF = () => {
    getData();
    // colCollapse()
  };

  useEffect(() => {
    colExpFlag ? expandT() : expandF();
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

  //expoprt
  const exportExcel = () => {
    let node = data.tableData;
    const filteredData = node.filter((item) => item.resource !== "");

    console.log(filteredData);
    let desiredColumnOrder = [];
    desiredColumnOrder = columnsOrder;

    const wantedValues = filteredData.slice(1).map((item) => {
      const obj = {};
      desiredColumnOrder.forEach((col) => {
        let colss = col[0];
        const value = item[colss];
        if (typeof value === "string") {
          const [extractedValue, ,] = value.split("^&"); // Extract the value from the key metadata
          obj[colss] = extractedValue; // Assign the extracted value to the corresponding column
        } else {
          obj[colss] = value;
        }
      });
      return obj;
    });

    // Create an array of objects where each object represents a row
    const rows = wantedValues.map((item) => {
      const row = [];
      desiredColumnOrder.forEach((col) => {
        row.push(item[col]);
      });
      return row;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("VendorPerformanceDetails");
    wantedValues.forEach((item) => {
      const row = worksheet.addRow(Object.values(item));
    });
    const boldRow = [1, 2];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "Vendor Performance.xlsx");
    });
  };

  //handle sort
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  return (
    <div>
      <div className="materialReactExpandableTable VendorPerformanceTop toHead darkHeader">
        {columns?.length ? (
          <MaterialReactTable
            columns={columns}
            data={nodes}
            enableExpandAll={true} //hide expand all double arrow in column header
            enableExpanding
            // enablePagination={true}
            paginateExpandedRows={true}
            // enableBottomToolbar={true}
            enableTopToolbar={true}
            enableColumnActions={false}
            enableBottomToolbar={isOn}
            enablePagination={isOn}
            muiTablePaginationProps={{
              rowsPerPageOptions: [25, 50, 100],
              showFirstButton: true,
              showLastButton: true,
              // defaultPageSize: 25, // Set the default value here
            }}
            //enableSorting={false}
            filterFromLeafRows //apply filtering to all rows instead of just parent rows
            initialState={{
              expanded: false,
              density: "compact",
              columnVisibility: { ...hiddenColumns },
              pagination: { pageSize: 25 },

              // enablePinning: true,
              // columnPinning: { left: ["mrt-row-expand", "name"] },
            }} //expand all rows by default
            state={{ columnVisibility: { ...hiddenColumns } }}
            //paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
            defaultColumn={{ minSize: 40, maxSize: 1000, size: 40 }} //units are in px
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
                "& tr:first-of-type td": {
                  background: "#D4E7FB  ",
                },
              },
            }}
            muiTableContainerProps={{
              sx: {
                maxHeight: `${maxHeight}px`,
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
                "& th:nth-of-type(2)": {
                  minWidth: "280px",
                  maxWidth: "280px",
                },
              },
            }}
            renderTopToolbar={({ table }) => (
              <>
                <div class="group customCard">
                  <div className="col-md-12 collapseHeader">
                    <label>
                      No. of {countname}:{countNw}
                    </label>
                    <div className="mb-2 exceliconadjust" align=" right ">
                      <RiFileExcel2Line
                        size="1.5em"
                        title="Export to Excel"
                        style={{ color: "green" }}
                        cursor="pointer"
                        onClick={exportExcel}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            //onOrderChange={(orderBy, orderDirection) => handleSort(orderBy, orderDirection)}
          />
        ) : null}
      </div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {openResource === true && openResourceNw == true ? (
        <div className="vendorPerformanceResourcetable">
          <VendorPerformanceResourceTable
            resourceData={rdata}
            colorFilter={colorFilter}
            rFormData={rFormData}
            tableDisplayView={tableDisplayView}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
