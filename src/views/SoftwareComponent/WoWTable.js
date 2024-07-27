import { Fragment, useEffect, useRef, useState } from "react";
import ViewDetailsTable from "./DetailsTable";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import WOWChart from "./WoWChart";
import { MdOutlineEditNote } from "react-icons/md";
import axios from "axios";
import { environment } from "../../environments/environment";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import WowDisplayPopUp from "./WowDisplayPopUp";
import Loader from "../Loader/Loader";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";

export default function WoWTable({ WOW, wowtype, wowDate, setWOwDate }) {
  const baseUrl = environment.baseUrl;
  const allWeek = WOW.filter((item) => item.lvl === 1).map((item) => {
    return { week: item.weekno, date: item.date };
  });
  const allexec = WOW.filter((item) => item.lvl === 1).map(
    (item) => item.executive
  );

  const [vendorDropdown, setvendorDropdown] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [rowData, setRowData] = useState({});
  const [sFOwnerDivisionsDropdown, setSFOwnerDivisionsDropdown] = useState([]);
  const [executive, setexecutive] = useState("");
  const [expanded, setexpanded] = useState([]);
  const [expandedexec, setexpandedexec] = useState([]);
  const [viewDetailsData, setviewDetailsData] = useState([]);
  const [weekselected, setweekselected] = useState("");
  const [exid, setexid] = useState("");
  const [loader, setLoader] = useState(false);
  const clickExpand = (week) => {
    if (week === "Week") {
      setexpanded((prevState) => {
        return prevState.length === allWeek.length
          ? []
          : allWeek.map((item) => item.week);
      });
    } else {
      setexpanded((prevState) => {
        return prevState.includes(week)
          ? prevState.filter((item) => item !== week)
          : [...prevState, week];
      });
    }
  };
  const clickExpandexec = (exec) => {
    if (exec === "Sales Executive") {
      setexpandedexec((prevState) => {
        return prevState.length === allexec.length ? [] : allexec;
      });
    } else {
      setexpandedexec((prevState) => {
        return prevState.includes(exec)
          ? prevState.filter((item) => item !== exec)
          : [...prevState, exec];
      });
    }
  };

  let toggler = 0;
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

  const getvendor = () => {
    axios
      .get(baseUrl + "/CommonMS/master/getSalesVendors")
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        setvendorDropdown(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSFOwnerDivisionsDropdown = () => {
    axios
      .get(baseUrl + `/SalesMS/MasterController/SFOwnerDivisions`)
      .then((resp) => {
        const data = resp.data;
        setSFOwnerDivisionsDropdown(() => String(data.map((item) => item.id)));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const viewDetailsDataPayload = {
    mode: "view",
    from: "2023-07-01",
    vendors: vendorDropdown,
    divisions: sFOwnerDivisionsDropdown,
    executives: exid,
    type: "wow",
    detail: "true",
    saveSE: "false",
    reportRunId: "205010",
    optType: -1,
    quarter: -1,
    status: -1,
    duration2: -1,
    measures: -1,
    monthsel: -1,
    viewByTime: -1,
    fyear: -1,
    customers: -1,
    prospects: -1,
    practices: -1,
    countries: -1,
    customerType: -1,
    summary: -1,
    showBy: "week",
    aelocation: -1,
    engComp: -1,
    Divisions: -1,
    accOwner: -1,
    newCust: -1,
    accType: -1,
  };

  const getviewDetailsData = () => {
    setLoader(false);
    axios
      .post(
        baseUrl + `/SalesMS/software/getSalesSoftwareDataDetails`,
        viewDetailsDataPayload
      )
      .then((resp) => {
        const data = resp.data.data;
        setLoader(false);
        const array = [
          "id",
          "executive_division",
          "execStatus",
          "supervisor",
          "customerId",
          "customer",
          "isProspect",
          "oppId",
          "sfOppId",
          "opportunity",
          "vendor",
          "probability",
          "closeDate",
          "oppAmount",
          "calls",
          "upside",
          "closedAmount",
          "week",
          "comments",
          "lvl",
          "count",
          "isEdit",
          "isDeleted",
          "keyAttr",
          "parentAttr",
          "add_to_call",
          "isActive",
        ];
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });

        setviewDetailsData(newArray);
        setreportRunId(resp.data.reportRunId);

        window.scrollTo({
          top: 600,
          behavior: "smooth", // This adds a smooth scrolling effect, optional
        });
      })
      .catch((resp) => {});
  };

  const openPipeline = [];
  const calls = [];
  const closedAmount = [];
  const upside = [];
  const target = [];
  const xAxis = [];

  const weekheads = WOW.map((data) => {
    if (executive === data.executive && data.id > 0) {
      openPipeline.push(parseInt(data.oppAmount));
      calls.push(parseInt(data.calls));
      closedAmount.push(parseInt(data.closedAmount));
      upside.push(parseInt(data.upside));
      target.push(parseInt(data.target));
      xAxis.push(data.weekno);
    }
    const conditions = [
      "lvl",
      "execStatus",
      "id",
      "count",
      "date",
      "supervisor",
    ];
    const nonIntegers = ["weekno", "executive", "executive"];
    const expandableCols = ["executive"];
    let header = [];

    toggler =
      data["lvl"] === 2 ? toggler : expanded.includes(data.weekno) ? 1 : 0;

    for (const keys in data) {
      !conditions.includes(keys) &&
        (expanded.length > 0 ? true : !expandableCols.includes(keys)) &&
        header.push(
          data.id < 0 ? (
            <th
              className={keys + " pipeth wowFirstTh"}
              key={keys}
              title={data[keys]}
            >
              <span
                onClick={() => {
                  clickExpand(data.weekno);
                }}
                title={data[keys]}
              >
                {keys === "weekno" &&
                  (expanded.length === allWeek.length ? (
                    <FaCaretDown
                      style={{ cursor: "pointer" }}
                      title="Collapse all"
                    />
                  ) : (
                    <FaCaretRight
                      style={{ cursor: "pointer" }}
                      title="Expand all"
                    />
                  ))}
              </span>
              {data[keys]}
            </th>
          ) : (
            <td
              className="wowdata"
              key={keys}
              title={data[keys]}
              style={{
                display: toggler === 0 && data["lvl"] === 2 ? "none" : "",
                textAlign:
                  keys === "calls" ||
                  keys === "closedAmount" ||
                  keys === "gap" ||
                  keys === "oppAmount" ||
                  keys === "target" ||
                  keys === "upside"
                    ? "end"
                    : "",
              }}
            >
              {nonIntegers.includes(keys) ? (
                <Fragment>
                  {keys === "executive" && (
                    <span>{icons[data["execStatus"]]}</span>
                  )}
                  &nbsp;
                  <span
                    className="expanddata"
                    onClick={() => {
                      clickExpand(data.weekno);
                    }}
                  >
                    {data["lvl"] === 1 &&
                      keys === "weekno" &&
                      (expanded.includes(data.weekno) ? (
                        <FaCaretDown
                          style={{ cursor: "pointer" }}
                          title="Collapse"
                        />
                      ) : (
                        <FaCaretRight
                          style={{ cursor: "pointer" }}
                          title="Expand"
                        />
                      ))}
                  </span>
                  {(keys === "weekno" || keys === "executive") &&
                  data["lvl"] === 2 ? (
                    ""
                  ) : (
                    <span>{data[keys]}</span>
                  )}
                  {keys === "executive" &&
                    data["lvl"] === 2 &&
                    data["executive"] !== "" && (
                      // <d>
                      <span
                        className="linkSty"
                        onClick={() => {
                          setexecutive(data.executive);
                          setweekselected({
                            quat: data.weekno,
                            date: data.date,
                          });
                          setexid(data.id);
                        }}
                      >
                        {data[keys]}

                        <MdOutlineEditNote
                          style={{ float: "right", cursor: "pointer" }}
                          size={"1.5em"}
                          title="Notes"
                          onClick={() => {
                            setOpenPopup(true);
                            setRowData(data);
                          }}
                        />
                      </span>
                    )}
                  {keys == "executive" &&
                    data["lvl"] === 1 &&
                    data["executive"] !== "" && (
                      <MdOutlineEditNote
                        style={{ float: "right", cursor: "pointer" }}
                        size={"1.5em"}
                        title="Notes"
                        onClick={() => {
                          setexecutive(data.executive);
                          setweekselected({
                            quat: data.weekno,
                            date: data.date,
                          });
                          setexid(data.id);
                          {
                            data[keys];
                          }
                        }}
                      />
                    )}
                </Fragment>
              ) : (
                <Fragment>
                  <span>{parseInt(data[keys]).toLocaleString("en-US")}</span>
                  &nbsp;
                </Fragment>
              )}
            </td>
          )
        );
    }

    return (
      <tr
        className="wowtableData"
        // style={{ backgroundColor: "red" }}
        style={{ backgroundColor: data.executive ? "" : "#d4e7fb" }}
        key={data.id + data.weekno + data.date + data.executive}
      >
        {header}
      </tr>
    );
  });

  const execheads = WOW.map((data) => {
    const conditions = [
      "lvl",
      "execStatus",
      "id",
      "count",
      "date",
      "supervisor",
    ];
    const nonIntegers = ["weekno", "executive", "executive"];
    const expandableCols = ["weekno"];
    let header = [];

    toggler =
      data["lvl"] === 2
        ? toggler
        : expandedexec.includes(data.executive)
        ? 1
        : 0;

    for (const keys in data) {
      !conditions.includes(keys) &&
        (expandedexec.length > 0 ? true : !expandableCols.includes(keys)) &&
        header.push(
          data.id < 0 ? (
            <th
              className={keys + " pipeth wowFirstTh"}
              key={keys}
              title={data[keys]}
            >
              <span
                onClick={() => {
                  clickExpandexec(data.executive);
                }}
                title={data[keys]}
              >
                {keys === "executive" &&
                  (expandedexec.length === allexec.length ? (
                    <FaCaretDown
                      style={{ cursor: "pointer" }}
                      title="Collapse"
                    />
                  ) : (
                    <FaCaretRight
                      style={{ cursor: "pointer" }}
                      title="Expand"
                    />
                  ))}
              </span>
              {data[keys]}
            </th>
          ) : (
            <td
              key={keys}
              title={data[keys]}
              style={{
                display: toggler === 0 && data["lvl"] === 2 ? "none" : "",
                textAlign:
                  keys === "calls" ||
                  keys === "closedAmount" ||
                  keys === "gap" ||
                  keys === "oppAmount" ||
                  keys === "target" ||
                  keys === "upside"
                    ? "end"
                    : "",
              }}
            >
              {nonIntegers.includes(keys) ? (
                <Fragment>
                  {keys === "executive" && data["lvl"] !== 2 && (
                    <span>
                      {" "}
                      &nbsp;
                      <span>
                        <MdOutlineEditNote
                          style={{ float: "right", cursor: "pointer" }}
                          size={"1.5em"}
                          title="Notes"
                          onClick={() => {
                            setOpenPopup(true);
                            setRowData(data);
                          }}
                        />
                      </span>
                    </span>
                  )}
                  <span> </span>
                  <span
                    onClick={() => {
                      clickExpandexec(data.executive);
                    }}
                    title={data[keys]}
                  >
                    {/* Check for specific conditions and render appropriate icons */}
                    {data["lvl"] === 1 && keys === "executive" && (
                      <Fragment>
                        {expandedexec.includes(data.executive) ? (
                          <FaCaretDown
                            style={{ cursor: "pointer" }}
                            title="Collapse"
                          />
                        ) : (
                          <FaCaretRight
                            style={{ cursor: "pointer" }}
                            title="Expand"
                          />
                        )}
                        &nbsp;
                        <span>{icons[data["execStatus"]]}</span>
                      </Fragment>
                    )}
                  </span>{" "}
                  &nbsp;
                  {keys === "executive" && data["lvl"] === 2 ? (
                    ""
                  ) : (
                    <span>
                      <span title={data[keys]}>{data[keys]}</span>
                    </span>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  <span>{parseInt(data[keys]).toLocaleString("en-US")}</span>
                  &nbsp;
                </Fragment>
              )}
            </td>
          )
        );
    }

    return (
      <tr
        className={data.lvl == 1 ? "pink" : "red"}
        style={{ backgroundColor: data.executive ? "" : "#d4e7fb" }}
        key={data.id + data.weekno + data.date + data.executive}
      >
        {header}
      </tr>
    );
  });
  const heads = wowtype === "week" ? weekheads : execheads;

  const yAxisAmt = [];
  yAxisAmt.push({
    name: "Open Pipeline",
    data: openPipeline,
    description: openPipeline,
  });
  yAxisAmt.push({
    name: "Calls",
    data: calls,
    description: calls,
  });
  yAxisAmt.push({
    name: "Closed Amount",
    data: closedAmount,
    description: closedAmount,
  });
  yAxisAmt.push({
    name: "Upside",
    data: upside,
    description: upside,
  });
  yAxisAmt.push({
    name: "Target",
    data: target,
    description: target,
  });

  useEffect(() => {
    getviewDetailsData();
    setLoader(false);
  }, [weekselected, executive, exid]);

  useEffect(() => {
    getvendor();
    getSFOwnerDivisionsDropdown();
  }, []);
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(WOW);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "SalesSoftware");
    });
  };
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };
  const handleOnExport = () => {
    const excludeProperties = ["date", "lvl", "count", "execStatus", "id"];

    const columnHeaders = [
      "Week",
      "Sales Executive",
      "Supervisor",
      "Target ($)",
      "Open Pipeline ($)",
      "Calls ($)",
      "Upside ($)",
      "Gap ($)",
      "Closed Amt ($)",
    ];

    const headerRow1 = columnHeaders;

    const filteredData = WOW?.slice(1)
      .filter((item) => item.executive != "")
      .map((item) => {
        const filteredItem = Object.fromEntries(
          Object.entries(item).filter(
            ([key]) => !excludeProperties.includes(key)
          )
        );
        if (filteredItem["weekno"]) {
          const dateParts = filteredItem["weekno"].split("-");
          if (dateParts.length === 3) {
            const day = dateParts[0];
            const month = dateParts[1];
            const year = dateParts[2]; // Get the last 2 digits of the year
            filteredItem["weekno"] = `${day}-${month}-${year}`;
          }
        }

        return filteredItem;
      });

    // Sort the data by "weekno" in descending order
    filteredData.sort((a, b) => {
      const weekA = new Date(b.weekno);
      const weekB = new Date(a.weekno);
      return weekA - weekB;
    });

    const dataRows = filteredData.map((item) => Object.values(item));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SalesSoftware");
    const headerRow = worksheet.addRow(headerRow1);
    const rightAlignColumns = [3, 4, 5, 6, 7, 8]; // Adjust these indices accordingly

    for (let i = 0; i < dataRows.length; i++) {
      const row = worksheet.addRow(dataRows[i]);

      // Adjust alignment for specific columns
      for (let colIndex = 1; colIndex <= headerRow1.length; colIndex++) {
        const column = worksheet.getColumn(colIndex);
        if (rightAlignColumns.includes(colIndex - 1)) {
          column.alignment = { horizontal: "right" };
        }
      }
    }

    // for (let i = 0; i < dataRows.length; i++) {
    //   const row = worksheet.addRow(dataRows[i]);
    // }

    const boldRow = [1];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "SalesSoftware.xlsx");
    });
  };
  //=============Sales Export Data=======================

  const handleOnExport1 = () => {
    const excludeProperties = ["date", "lvl", "count", "execStatus", "id"];

    const columnHeaders = [
      "Sales Executive",
      "Supervisor",
      "Week",
      "Target ($)",
      "Open Pipeline ($)",
      "Calls ($)",
      "Upside ($)",
      "Gap ($)",
      "Closed Amt ($)",
    ];

    const filteredData = WOW?.slice(1)
      .filter((item) => item.executive != "" && item.lvl !== 1)
      .map((item) => {
        const filteredItem = Object.fromEntries(
          Object.entries(item).filter(
            ([key]) => !excludeProperties.includes(key)
          )
        );
        if (filteredItem["weekno"]) {
          const dateParts = filteredItem["weekno"].split("-");
          if (dateParts.length === 3) {
            const day = dateParts[0];
            const month = dateParts[1];
            const year = dateParts[2]; // Get the last 2 digits of the year
            filteredItem["weekno"] = `${day}-${month}-${year}`;
          }
        }

        return filteredItem;
      });
    filteredData.sort((a, b) => {
      // Compare the "executive" properties in alphabetical order
      const executiveA = a.executive?.toLowerCase(); // Convert to lowercase for case-insensitive sorting
      const executiveB = b.executive?.toLowerCase();

      if (executiveA < executiveB) {
        return -1;
      }
      if (executiveA > executiveB) {
        return 1;
      }

      // If "executive" is equal, sort by "weekno" in descending order
      const weekA = new Date(b.weekno);
      const weekB = new Date(a.weekno);

      if (weekA < weekB) {
        return -1;
      }
      if (weekA > weekB) {
        return 1;
      }

      return 0;
    });

    const dataRows = filteredData.map((item) => [
      item["executive"],
      item["supervisor"],
      item["weekno"],
      item["target"],
      item["oppAmount"],
      item["calls"],
      item["upside"],
      item["gap"],
      item["closedAmount"],
    ]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SalesSoftware");
    const headerRow = worksheet.addRow(columnHeaders);

    const rightAlignColumns = [3, 4, 5, 6, 7, 8, 9]; // Adjust these indices accordingly

    for (let i = 0; i < dataRows.length; i++) {
      const row = worksheet.addRow(dataRows[i]);

      // Adjust alignment for specific columns
      for (let colIndex = 1; colIndex <= columnHeaders.length; colIndex++) {
        const column = worksheet.getColumn(colIndex);
        if (rightAlignColumns.includes(colIndex - 1)) {
          column.alignment = { horizontal: "right" };
        }
      }
    }

    const boldRow = [1];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "SalesSoftware.xlsx");
    });
  };

  // Call the function to start the export

  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  return (
    <div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}

      <div className="col-lg-12 col-md-12 col-sm-12 customCard">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            // getviewDetailsData();
            // getviewDetailsData();
            // setTimeout(() => {
            //   setLoader(false);
            // }, 4000);
          }}
        >
          {" "}
          Refresh SF Data{" "}
        </button>
        <div className="col-md-12 clearfix" style={{ height: "10px" }}></div>
        <div>
          <span>
            <span style={{ color: "#9d7c42", fontStyle: "italic" }}>
              <BsFillExclamationCircleFill />
              <span>
                {" "}
                Note : Snapshot for the week is created every monday at 07:30 PM
                IST and Last day{" "}
                <span>
                  {" "}
                  {wowtype === "week" ? (
                    <RiFileExcel2Line
                      size="1.5em"
                      title="Export to Excel"
                      style={{
                        color: "green",
                        marginLeft: "4%",
                        fontSize: "16px",
                      }}
                      cursor="pointer"
                      onClick={handleOnExport}
                    />
                  ) : (
                    <RiFileExcel2Line
                      size="1.5em"
                      title="Export to Excel"
                      style={{
                        color: "green",
                        marginLeft: "4%",
                        fontSize: "16px",
                      }}
                      cursor="pointer"
                      onClick={handleOnExport1}
                    />
                  )}
                </span>{" "}
                <div>of the quarter updated to reflect final actuals.</div>
              </span>
            </span>

            <span style={{ color: "#9d7c42", fontStyle: "italic" }}>
              <BsFillExclamationCircleFill />
              Note : Data was accurate from FY 2021-Q2
            </span>
          </span>
        </div>
        <div className="col-md-12 clearfix" style={{ height: "10px" }}></div>
        <div
          className="darkHeader"
          style={{
            maxWidth: "fit-content",
            paddingRight: "0px !important",
            maxHeight: "400px",
            overflowY: "scroll",
          }}
        >
          {WOW.length > 2 ? (
            <table
              className="table table-bordered table-striped  "
              style={{ width: "auto" }}
            >
              <thead>{heads}</thead>
            </table>
          ) : (
            <table
              className="table table-bordered table-striped firstViewTable "
              style={{ width: "auto" }}
            >
              {" "}
              <thead>
                <th title="Week">Week</th>
                <th> Target ($)</th>
                <th>Open Pipeline ($)</th>
                <th>Calls ($)</th>
                <th> Upside ($)</th>
                <th>Gap ($)</th>
                <th>Closed Amt ($)</th>
              </thead>
              <tbody>
                {/* <div style={{ marginRight: "45%" }}>No Data Found</div> */}
                <td></td>
                <td></td>
                <td></td>
                <td>No Data Found</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tbody>
            </table>
          )}
        </div>
      </div>
      {wowtype === "week" && xAxis.length != 0 ? (
        <WOWChart
          yAxisAmt={yAxisAmt}
          xAxis={xAxis}
          executive={executive}
          WOW={WOW}
        />
      ) : (
        ""
      )}
      {viewDetailsData.length > 0 && wowtype === "week" && (
        <ViewDetailsTable
          viewDetailsData={viewDetailsData}
          srchQuat={weekselected}
          executive={executive}
        />
      )}
      {openPopup ? (
        <WowDisplayPopUp
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          WOW={WOW}
          rowData={rowData}
        />
      ) : (
        ""
      )}
    </div>
  );
}
