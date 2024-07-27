import React, { useState, useEffect, useMemo } from "react";
import MaterialReactTable from "material-react-table";
import { Button, IconButton } from "@mui/material";

import { AiFillRightCircle } from "react-icons/ai";
import { AiFillWarning } from "react-icons/ai";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { GoPerson } from "react-icons/go";
import { Link } from "react-router-dom";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import "./CapacityPlanCalenderTable.scss"

function CapacityPlanTotalResCalender(props) {
  const {
    data,
    calenderPayload,
    colExpandState,
    formData,
    setFormData,
    value,
    month,
    setMonth,
  } = props;
  const [linkId, setLinkId] = useState([]);
  const [name, setName] = useState();
  const [nodes, setNodes] = useState([]);
  const [columns, setColumns] = useState(null);
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [actionPopup, setActionPopup] = useState(false);
  const [hierarchyPopUp, setHierarchyPopUp] = useState(false);
  const [hierarchyid, setHierarchyId] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const icons = {
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
    subkActive: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Active Contractor"
      />
    ),
  };
  const numberWithCommas = (x) => {
    return x?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    numberWithCommas(getData());
  }, [data]);


  useEffect(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, []);

  // console.log(calenderPayload, "calenderpayload")
  const getData = () => {
    let tableData = data.tableData;
    let columns = null;
    // console.log(tableData);
    if (data?.columns?.includes("'")) {
      columns = data?.columns?.replaceAll("'", "");
    } else {
      columns = data?.columns;
    }

    let dd = columns?.split(",");
    // let Indicators = ["course_1"];
    let colArr = null;

    if (dd != undefined) {
      colArr = [...dd];
    }

    let newHeaders = [];
    let hiddenHeaders = [];

    const obj = {};
    // console.log(colArr);
    for (let i = 0; i < colArr?.length; i++) {
      let colVal = colArr[i].trim();

      let firstData = tableData[0];
      obj[colVal] = firstData[colVal];
    }

    let headerArray = Object.entries(obj);
    // console.log(headerArray);
    let unWantedCols = ["Id", "action_items"];
    // console.log(headerArray, "headerArray");
    let filteredHeaders = headerArray.filter(
      (d) => !unWantedCols.includes(d[0])
    );
    setHeaders(filteredHeaders);
    // console.log(filteredHeaders, "filteredHeaders");
    // filteredHeaders.map(([key, value]) => {
    //     if (expandedCols.includes(key)) {
    //         hiddenHeaders.push({ [key]: false });
    //     }
    // });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));

    let C = tableData?.filter((d) => d.Id == -1);
    // console.log(C, "cccccccccccccccccccccccccccccccccccc");
    filteredHeaders.map(([key, value], index) => {
      let A = value?.replace("<br>", "");
      // console.log(A, key, value);
      newHeaders.push({
        accessorKey: key,
        header: value,
        enableColumnActions: false,
        enableHiding: true,
        rowspan: 5,

        Header: ({ column }) => (
          <div
            className={
              key.includes("AcGM") ||
                key.includes("NAcGM") ||
                key.includes("NAvgCost") ||
                key.includes("AvgCost")
                ? "md" && "mixer"
                : key?.includes("_L") || key.includes("_N")
                  ? "disabledDates"
                  : key?.includes("Revenue") ||
                    key?.includes("Cost") ||
                    key?.includes("course_1") ||
                    key?.includes("Name") ||
                    key?.includes("emp_cadre") ||
                    key?.includes("BusinessUnit") ||
                    key?.includes("Supervisor") ||
                    key?.includes("manager") ||
                    key?.includes("capacity") ||
                    key?.includes("billAppr") ||
                    key?.includes("billApprNet") ||
                    key?.includes("Total") ||
                    key?.includes("Avg") ||
                    key?.includes("GM") ||
                    key?.includes("Role") ||
                    key?.includes("Rate")
                    ? "mixer"
                    : key.includes("_W") ? "WeekendDates" : ""
            }
            title={value}
          >
            {/* {console.log(value, "headervalue")} */}
            {/* {value?.includes("<br>")
                            ? value.replace("<br>", " ")
                            : value == undefined
                                ? "Avg"
                                : value}{" "} */}
            {/* {key == colExpandState[2] ? (
                            <IconButton
                                className="expandIcon"
                                onClick={() => {
                                    setColumnExpFlag((prev) => !prev);
                                }}
                            >
                                <AiFillRightCircle />
                            </IconButton>
                        ) : null} */}
            {value}
          </div>
        ),
      });
    });
    let subHeaders =
      C && Object.entries(C[0])?.filter((d) => !unWantedCols?.includes(d[0]));
    {
      // console.log(newHeaders, "newHeaders");
    }

    newHeaders.map((data) => {
      // console.log(data);
      let i = newHeaders.indexOf(data);

      subHeaders.map(([key, value], index) => {
        // console.log(subHeaders, "subHeaders");
        if (key == data.accessorKey) {
          // console.log(key, "key matched!");
          // console.log(data.accessorKey, "data.accessorKey");
          // console.log(value, "vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
          let obj = {
            id: key,
            header: (
              <div
                className={key.includes("_L") || key.includes("_N") ? "disabledDates" : key.includes("_W") ? "WeekendDates" : ""}
                title={value}
              >
                {/* {console.log(value, "value")} */}
                {value == null || value == 0
                  ? null
                  : // : key == "undefined" || key == null
                  // ? "Avg"
                  value}
              </div>
            ),
            accessorKey: key,

            Cell: ({ cell }) => {
              return (
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {cell.column.id == "Name" && cell.row.original != null ? (
                    <>
                      {/* {console.log(cell.row.original.Name, "cell.row.original.Name in line 232")} */}

                      <span title={cell.getValue().split("_")[0]}>
                        {/* {console.log(calenderPayload.Src == "res" && cell.row.original.Name != "Total" && cell.getValue(), "cell.row.original.Name")} */}
                        {icons[cell.row.original.Name.split("_")[1]]}{" "}
                        {cell.row.original.Name == "Total" ? (
                          <b className="align right"> Total</b>
                        ) : cell.row.original.Name == "Avg" ? (
                          <b className="align right"> Avg</b>
                        ) :
                          (calenderPayload?.Src == "res" &&
                            cell.row.original.Name != "Total")
                            ? (
                              // console.log(calenderPayload, "hello in condition"),
                              <Link
                                to={`/project/capacityPlan/:${cell.row.original.Id}`}
                                target="_blank"
                              >
                                {/* {console.log(cell.row.original.Name, "cell.row.original.Name")} */}
                                {cell.getValue().split("_")[0]}
                              </Link>
                            ) : (
                              // <Link
                              //     onClick={(e) => {
                              //         setAnchorEl(e.currentTarget);

                              //         setActionPopup(true),
                              //             setLinkId(cell.row.original.Id);
                              //         setName(cell.row.original.Name.split("_")[0]);
                              //     }}
                              // >
                              cell.getValue().split("_")[0]
                              // </Link>
                            )}
                      </span>
                    </>
                  ) : cell.column.id == "course_1" &&
                    cell.row.original.Name != "Total" &&
                    cell.row.original.Name != "Avg" &&
                    cell.row.original != null ? (
                    <>
                      {cell.getValue() == "1" ? (
                        <>
                          <span
                            className="green legendCircle"
                            title={"ISMS Certified"}
                          ></span>
                          {cell.row.original.action_items == 1 &&
                            cell.row.original != null ? (
                            <span
                              className="exclamation orange"
                              title={"Action Items Exist"}
                            >
                              <AiFillWarning />
                            </span>
                          ) : (
                            <span
                              className="exclamation gray"
                              title={"No Action Items"}
                            >
                              <AiFillWarning />
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span
                            className="red legendCircle"
                            title={"ISMS Not Certified"}
                          ></span>
                          {cell.row.original.action_items == 0 &&
                            cell.row.original != null ? (
                            <span
                              className="exclamation gray"
                              title={"No Action Items"}
                            >
                              <AiFillWarning />
                            </span>
                          ) : (
                            <span
                              className="exclamation orange"
                              title={"Action Items Exist"}
                            >
                              <AiFillWarning />
                            </span>
                          )}
                        </>
                      )}
                    </>
                  ) : cell.column.id == "Supervisor" &&
                    cell.row.original.Name != "Total" &&
                    cell.row.original.Name != "Avg" &&
                    cell.row.original != null ? (
                    <>
                      <span
                        className="hierarchyIcon"
                        onClick={() => {
                          // console.log("clicked");
                          setHierarchyPopUp(true);
                          setHierarchyId(cell.row.original.Id);
                        }}
                        title={"Hierarchy"}
                      >
                        <VscTypeHierarchySub />
                      </span>
                      <span title={cell.getValue()?.split("_")[0]}>
                        {"" + cell.getValue() != "" && cell.getValue() != null
                          ? cell.getValue()?.split("_")[0]
                          : ""}
                      </span>
                    </>
                  ) :
                    cell.getValue() == "0_holday" ||
                      cell.getValue() == "0.00_holday" ? (
                      <span
                        className="blueHoliday align right"
                        title={cell.getValue().split("_")[0]}
                      >
                        {cell.getValue().split("_")[0]}
                      </span>
                    ) :
                      cell.getValue() != null &&
                        cell.getValue().split("_")[1] == "leave" || cell.getValue() == "0.00_leave_AV" ? (
                        <span
                          className="pinkLeave align right"
                          title={cell.getValue().split("_")[0]}
                        >
                          {cell.getValue().split("_")[0]}
                        </span>
                      ) : cell.getValue() != null &&
                        cell.getValue().includes("0.00") ? (
                        <span
                          className=" align right "
                          title={cell.getValue().split("_")[0]}
                        >
                          {cell.getValue().split("_")[0]}
                        </span>
                      ) : (cell.getValue() != null && key.includes("_L")) ||
                        key.includes("_W") ? (
                        <span className="disabledDates" title={cell.getValue()}>
                          {cell.getValue()}
                        </span>
                      ) : key.includes("Revenue") ? (
                        // || key.includes("Cost")) && cell.row.original.Id != 999
                        <>
                          <div class="align right" title={cell.getValue()}>
                            $ {numberWithCommas(cell.getValue())}
                          </div>
                        </>
                      ) : cell.getValue() != null &&
                        (key.includes("GM") || key.includes("billApprNet")) ? (
                        <>
                          <div class="align right" title={cell.getValue()}>
                            {numberWithCommas(cell.getValue())} %
                          </div>
                        </>
                      ) : cell.column.id == "Name" ||
                        cell.column.id == "course_1" ||
                        cell.column.id == "Supervisor" ||
                        cell.column.id == "manager" ||
                        cell.column.id == "BusinessUnit" ? (
                        <span title={cell.getValue()}>{cell.getValue()}</span>
                      ) : cell.getValue() != null &&
                        cell.column.id == "emp_cadre" ? (
                        <div class="align center " title={cell.getValue()}>
                          {" "}
                          {cell.getValue()}
                        </div>
                      ) :

                        key.includes("Role") ?
                          <div className="align left" style={{
                            whiteSpace: "nowrap ",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "120px"
                          }} title={cell.getValue()}> {cell.getValue()}</div> :
                          (

                            <div className={cell.row.original.Name == "Total" ? "totalRow align right" : "align right"} title={cell.getValue()}>
                              {" "}
                              {cell.getValue()}
                            </div>
                          )
                  }
                </div >
              );
            },
          };

          newHeaders[i].columns = [obj];
        } else {
          // console.log("key not matched");
        }
      });
    });

    setColumns(newHeaders);

    let values = [];

    let B = tableData?.filter((d) => d.Id !== -1 && d.Id !== -2);

    setNodes(B);
  };

  useEffect(() => {
    colExpFlag ? setHiddenColumns({}) : colCollapse();
  }, [colExpFlag]);

  const colCollapse = () => {
    let hiddenHeaders = [];
    // refactor this
    // headers.map(([key, value]) => {
    //     if (expandedCols.includes(key)) {
    //         hiddenHeaders.push({ [key]: false });
    //     }
    // });

    setHiddenColumns(Object.assign({}, ...hiddenHeaders));
  };
  const handleClose = () => {
    setAnchorEl(false);
  };
  return (
    <div className="materialReactExpandableTable capacityPlanCalenderTable darkHeader">
      {nodes?.length ? (
        <MaterialReactTable
          columns={columns}
          data={nodes}
          // enableExpandAll={true} //hide expand all double arrow in column header
          // enableExpanding
          enablePagination={false}
          //enableRowVirtualization
          enableGlobalFilter={true}
          // enableGlobalFilterModes={searchFilter}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableHiding={false}
          enableColumnFilters={false}
          enableBottomToolbar={false}
          enableTopToolbar={true}
          enableColumnActions={false}
          enableSorting={false}
          filterFromLeafRows //apply filtering to all rows instead of just parent rows
          initialState={{
            showGlobalFilter: true,
            expanded: false,
            density: "compact",
            columnVisibility: { ...hiddenColumns },
          }} //expand all rows by default
          state={{ columnVisibility: { ...hiddenColumns } }}
          //paginateExpandedRows={false} //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
          defaultColumn={{ minSize: 30, maxSize: 1000, size: 30 }} //units are in px
          // enableStickyHeader
          muiSearchTextFieldProps={{
            // placeholder: "Search all users",
            // sx: { minWidth: "300px" },
            variant: "outlined",
          }}
          muiTableContainerProps={{
            sx: { maxHeight: "50vh" }, //give the table a max height
          }}
          muiTableBodyProps={{
            sx: {
              "&": {
                borderRight: "1px solid #ccc",
                borderBottom: "1px solid #ccc",
              },
              "& td:first-of-type": {
                borderLeft: "1px solid #ccc",
                minWidth: "100px",
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
                minWidth: "100px",
              },
            },
          }}
        />
      ) : null}
    </div>
  );
}

export default CapacityPlanTotalResCalender;
