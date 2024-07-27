import Vdata from "./Vdata.json";
import {
  FaChevronCircleRight,
  FaChevronCircleLeft,
  FaCaretDown,
  FaCaretRight,
  FaCircle,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { MdOutlineEditNote } from "react-icons/md";
import DisplayPopup from "./DisplayPopup";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import "./ViewTable.scss";
import SFButtons from "./SFButtons";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

export default function ViewTable({
  Vdata,
  onclickchanger,
  expandableCols,
  ViewBy,
  setshowSFpipeline,
  showSFpipeline,
  reportRunId,
  serviceData,
  componentSelector,
  setRefreshButton,
  refreshButton,
}) {
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
  const prosicon = {
    1: <FaCircle size={"0.8em"} style={{ color: "purple" }} />,
    0: <FaCircle size={"0.8em"} style={{ color: "green" }} />,
  };

  const [expanded, setexpanded] = useState([]);
  const [expandedTwo, setexpandedTwo] = useState([]);
  const allExecutives = Vdata?.filter((item) => item.lvl === 1).map(
    (item) => item[onclickchanger]
  );
  const allExecutivestwo = Vdata?.filter((item) => item.lvl === 2).map(
    (item) => item[onclickchanger]
  );

  const [colexpanded, setcolexpanded] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [rowData, setRowData] = useState({});

  const clickExpand = (exec) => {
    if (exec === "Summary") {
      setexpanded((prevState) => {
        return prevState.length === allExecutives.length &&
          expandedTwo.length === allExecutivestwo.length
          ? []
          : allExecutives;
      });
      setexpandedTwo((prevState) => {
        return prevState.length === allExecutivestwo.length
          ? []
          : allExecutivestwo;
      });
    } else {
      setexpanded((prevState) => {
        return prevState.includes(exec)
          ? prevState.filter((item) => item !== exec)
          : [...prevState, exec];
      });
      if (expandedTwo.length > 0) {
        const exTwo = expandedTwo.filter(
          (element) => !element.split("^&")[0].includes(exec)
        );

        setexpandedTwo(exTwo);
      }
    }
  };
  const clickExpandTwo = (exec) => {
    setexpandedTwo((prevState) => {
      return prevState.includes(exec)
        ? prevState.filter((element) => !element.includes(exec))
        : [...prevState, exec];
    });
  };

  const clickExpandcols = (quartr) => {
    setcolexpanded((prevState) => {
      return prevState.includes(quartr)
        ? prevState.filter((item) => item !== quartr)
        : [...prevState, quartr];
    });
  };

  useEffect(() => {
    setexpanded([]);
    setexpandedTwo([]);
    setcolexpanded([]);
  }, [Vdata]);

  let toggler = 0;
  let togglerNw = 0;
  let coltoggler = 0;
  let headspanner = "";
  const horizontalcolexpands = [
    "target",
    "call",
    "custForecast",
    "sf",
    "pl",
    "rr",
    "sgns",
    "attperc",
    "est",
    "sgtrgt",
  ];
  const conditions = [
    "id",
    "customerId",
    "execStatus",
    "supervisor",
    "salesExecId",
    "salesExec",
    "customerTmp",
    "salesExecStatus",
    "practiceId",
    "countryId",
    "isProspect",
    "lvl",
    "count",
    "isEdit",
    "keyAttr",
    "parentAttr",
  ];

  const tableHead = Vdata?.map((row, index) => {
    const rowArray = [];

    toggler =
      row["lvl"] === 2
        ? toggler
        : expanded.includes(row[onclickchanger])
        ? 1
        : 0;

    if (row["lvl"] === 3) {
      togglerNw = togglerNw;
      toggler = 0;
    } else {
      if (expandedTwo.includes(row[onclickchanger])) {
        togglerNw = 1;
      } else {
        togglerNw = 0;
      }
    }

    for (const key in row) {
      if (key.includes("Q")) {
        coltoggler = colexpanded.includes(key.split("_")[1]) ? 1 : 0;
      }

      !conditions.includes(key) &&
        (expandedTwo.length < 0
          ? true
          : !expandableCols.includes(key) ||
            (expandedTwo.length > 0 && key.includes("Coverage"))
          ? true
          : !expandableCols.includes(key) ||
            (expandedTwo.length > 0 && key.includes("CSL"))
          ? true
          : !expandableCols.includes(key) ||
            (expandedTwo.length > 0 && key.includes("acc_type"))
          ? true
          : !expandableCols.includes(key)) &&
        rowArray.push(
          ((row.id === -2 &&
            (key.includes("total")
              ? key.split("_")[0] !== headspanner.split("_")[0]
              : key.split("_")[1] !== headspanner.split("_")[1] ||
                key.includes("executive") ||
                key.includes("customer") ||
                key.includes("country") ||
                key.includes("CSL"))) ||
            row.id === -1) &&
            row[key] !== "" && (
              <th
                className={
                  key === "CSL"
                    ? "cslStyl"
                    : key === "Coverage"
                    ? "covStyl"
                    : key === "acc_type"
                    ? "accTypeStyl"
                    : ""
                }
                key={`${key}_${index}`}
                rowSpan={row[key]?.split("^&")[1]}
                colSpan={row[key]?.split("^&")[2]}
                style={{
                  textAlign: "center",
                  display:
                    coltoggler === 0 &&
                    horizontalcolexpands.some((item) => key.includes(item)) &&
                    !(key.includes("Q") || key.includes("total")) &&
                    ViewBy != "month"
                      ? "none"
                      : "",
                }}
              >
                {key === "customer" ? (
                  <span>
                    {prosicon[row["isProspect"]]}
                    Customer
                    {prosicon[1]}
                    Prospect <br />
                    Sales Executive
                  </span>
                ) : row[key].includes("Account Owner") ? (
                  <span>
                    AccountOwner /
                    <br />
                    {prosicon[row["isProspect"]]}&nbsp; Customer&nbsp;
                    {prosicon[1]}&nbsp; Prospect
                  </span>
                ) : (
                  <span>
                    {row[key] === "Cust Map ($)" ? (
                      <span>
                        {"Customer"}
                        <br /> {"Targets ($)"}
                      </span>
                    ) : row[key] === "SG Target ($)" ||
                      row[key] === " SG Target ($)" ? (
                      <span>
                        {"Signing"}
                        <br /> {"Targets ($)"}
                      </span>
                    ) : row[key] === "Target ($)" ? (
                      <span>
                        {"Revenue"}
                        <br /> {"Targets ($)"}
                      </span>
                    ) : row[key] === "Sf Rev ($)" ? (
                      <span>
                        {"Sf"}
                        <br /> {"Revenue ($)"}
                      </span>
                    ) : row[key] === "Planned Rev ($)" ? (
                      <span>
                        {"Planned"}
                        <br /> {"Rev ($)"}
                      </span>
                    ) : row[key] === "Recognized Rev ($)" ? (
                      <span>
                        {"Recognized"}
                        <br /> {"Rev ($)"}
                      </span>
                    ) : row[key] === "Estimate Rev ($)" ? (
                      <span>
                        {"Estimate"}
                        <br /> {"Rev ($)"}
                      </span>
                    ) : (
                      row[key].split("^&")[0]
                    )}
                  </span>
                )}

                {row.id === -2 && row[key].includes("Quart") && (
                  <span
                    onClick={() => {
                      clickExpandcols(key.split("_")[1]);
                    }}
                  >
                    {colexpanded.includes(key.split("_")[1]) ? (
                      <FaChevronCircleLeft
                        size={"0.8em"}
                        title="Hide Details"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                      />
                    ) : (
                      <FaChevronCircleRight
                        size={"0.8em"}
                        title="Show Details"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                      />
                    )}
                  </span>
                )}
              </th>
            )
        );
      headspanner = key;
    }
    return (
      <tr
        key={`${row.customerId}_${row.countryId}_${row.parentAttr}_${row.executive}_${row.practiceId}_${row.practice}_${row.keyAttr}_${row.lvl}_${row.count}_${row.supervisor}_${row.execStatus}_${row.id}`}
      >
        {rowArray}
      </tr>
    );
  });

  const tableData = Vdata?.filter(
    (row) => row.lvl !== -1 && row.lvl !== -2
  ).map((row, index) => {
    const rowArray = [];

    function hasProperty(row, propertyName) {
      return propertyName in row;
    }

    let propertyName = "customer";

    let result = hasProperty(row, propertyName);
    if (result == false) {
      if (row["lvl"] === 2) {
        togglerNw = 0;
        toggler = expanded.includes(row[onclickchanger].split("^&")[0]) ? 1 : 0;
      } else if (row["lvl"] === 3) {
        toggler = 0;
        togglerNw = expandedTwo.includes(row[onclickchanger]) ? 1 : 0;
      } else {
        toggler = 0;
        togglerNw = 0;
      }
    } else {
      toggler =
        row["lvl"] === 3
          ? toggler
          : expanded.includes(row[onclickchanger])
          ? 1
          : 0;
    }

    for (const key in row) {
      if (key.includes("Q")) {
        coltoggler = colexpanded.includes(key.split("_")[1]) ? 1 : 0;
      }
      if (row["lvl"] === 999) {
        if (key === "executive") {
          rowArray.push(
            <td
              key={`${key}_${index}`}
              colSpan={Object.keys(row).length - 1}
              style={{
                textAlign: "center",
                backgroundColor: "white",
                fontSize: "14px",
              }}
            >
              {row[key].split("^&")[0]}{" "}
            </td>
          );
        } else if (key === "customer") {
          rowArray.push(
            <td
              key={`${key}_${index}`}
              colSpan={Object.keys(row).length - 1}
              style={{
                textAlign: "center",
                backgroundColor: "white",
                fontSize: "14px",
              }}
            >
              {row[key].split("^&")[1]}{" "}
            </td>
          );
        }
      } else {
        !conditions.includes(key) &&
          (expandedTwo.length < 0
            ? true
            : !expandableCols.includes(key) ||
              (expandedTwo.length > 0 && key.includes("Coverage"))
            ? true
            : !expandableCols.includes(key) ||
              (expandedTwo.length > 0 && key.includes("CSL"))
            ? true
            : !expandableCols.includes(key) ||
              (expandedTwo.length > 0 && key.includes("acc_type"))
            ? true
            : !expandableCols.includes(key)) &&
          rowArray.push(
            <td
              key={`${key}_${index}`}
              className={
                key.includes("executive")
                  ? "executive"
                  : key.includes("Q")
                  ? key.split("_")[1][1] % 2 == 0
                    ? "even"
                    : "odd"
                  : key.includes("total")
                  ? "total"
                  : key.includes("0")
                  ? key.split("_")[1] % 2 == 0
                    ? "innereven"
                    : "innerodd"
                  : key === "CSL" && row["lvl"] === 1
                  ? "cslStyl2"
                  : key === "Coverage" && row["lvl"] === 1
                  ? "covStyl2"
                  : key === "acc_type" && row["lvl"] === 1
                  ? "accTypeStyl2"
                  : key === "CSL"
                  ? "cslStyl"
                  : key === "Coverage"
                  ? "covStyl"
                  : key === "acc_type"
                  ? "accTypeStyl"
                  : ""
              }
              style={{
                display:
                  (toggler === 0 &&
                    togglerNw == 0 &&
                    (row["lvl"] === 2 || row["lvl"] === 3)) ||
                  (coltoggler === 0 &&
                    horizontalcolexpands.some((item) => key.includes(item)) &&
                    !(key.includes("Q") || key.includes("total")) &&
                    ViewBy != "month")
                    ? "none"
                    : "",
              }}
            >
              <div>
                {key === onclickchanger && row["lvl"] < 2 && (
                  <>
                    <span onClick={() => clickExpand(row[onclickchanger])}>
                      {expanded.includes(row[onclickchanger]) ||
                      (expanded.length === allExecutives.length &&
                        expandedTwo.length === allExecutivestwo.length) ? (
                        <FaCaretDown
                          size={"1.2em"}
                          title="Collapse"
                          style={{ cursor: "pointer", color: "#428bca" }}
                        />
                      ) : (
                        <FaCaretRight
                          size={"1.2em"}
                          title="Expand"
                          style={{ cursor: "pointer", color: "#428bca" }}
                        />
                      )}
                    </span>
                    <span>{icons[row["execStatus"]]}</span>
                  </>
                )}
                {key === onclickchanger &&
                (row["lvl"] === 2 || row["lvl"] === 3) ? (
                  <>
                    <span
                      className={
                        key === "executive" && row["lvl"] === 2
                          ? "parentRow"
                          : "" || row["lvl"] === 3
                          ? "collapsedRow"
                          : ""
                      }
                    >
                      {key === "customer" &&
                      row["customer"] !== "  " &&
                      row["customer"] == "Summary"
                        ? prosicon[row["isProspect"]]
                        : "" ||
                          (key === "executive" &&
                            row["customer"] !== "  " &&
                            row["customer"] &&
                            row[key].includes("Account Owner") !== "Summary")
                        ? prosicon[row["isProspect"]]
                        : ""}
                      {key === onclickchanger && row["lvl"] === 0}
                    </span>

                    {/* customer Table */}
                    <>
                      {(key === "customer" && (
                        <>
                          {icons[row["execStatus"]]}{" "}
                          <span
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                            }}
                            title={row[key]?.split("^&")[1]}
                          >
                            {row["customer"]?.split("^&")[1]}
                          </span>
                          <span
                            style={{
                              marginLeft: "auto",
                              cursor: "pointer",
                              float: "right",
                            }}
                          >
                            {" "}
                            {key === "customer" &&
                            row[key] !== "Summary" &&
                            row[key] !== "<< Unassigned >>" ? (
                              <MdOutlineEditNote
                                title="Notes"
                                size={"1.5em"}
                                onClick={() => {
                                  setOpenPopup(true);
                                  setRowData(row);
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </span>
                        </>
                      )) || (
                        <span title={row["customer"]?.split("^&")[0]}>
                          {" "}
                          {key === "executive" &&
                            row["customer"]?.split("^&")[0]}
                        </span>
                      )}
                    </>
                  </>
                ) : (key === onclickchanger || key === "country") &&
                  row["lvl"] === 3 ? (
                  ""
                ) : (
                  <>
                    <span>
                      {key == "customer" &&
                      row["customer"] !== "  " &&
                      row["customer"] !== "Summary"
                        ? prosicon[row["isProspect"]]
                        : ""}
                    </span>
                    <span
                      title={
                        row[key] === " "
                          ? " "
                          : isNaN(row[key])
                          ? row[key]
                          : parseInt(row[key]).toLocaleString("en-US")
                      }
                    >
                      {row[key] === " "
                        ? " "
                        : isNaN(row[key])
                        ? row[key]
                        : parseInt(row[key]).toLocaleString("en-US")}
                    </span>
                    <span>
                      {" "}
                      {key === "executive" &&
                      !row["customerTmp"] &&
                      row[key] !== "Summary" &&
                      row[key] !== "<< Unassigned >>" ? (
                        <MdOutlineEditNote
                          title="Notes"
                          size={"1.5em"}
                          onClick={() => {
                            setOpenPopup(true);
                            setRowData(row);
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </span>{" "}
                  </>
                )}
              </div>

              {/* AccountOwner */}
              <span
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
                className={
                  key === "executive" && row["lvl"] === 2
                    ? "collapsedRow2"
                    : "" || row["lvl"] === 3
                    ? "collapsedRow3"
                    : ""
                }
              >
                {key === "executive" && row["lvl"] === 2 ? (
                  <span
                    style={{ paddingLeft: "22px" }}
                    title={row["salesExec"]}
                  >
                    <span onClick={() => clickExpandTwo(row[onclickchanger])}>
                      {expandedTwo.includes(row[onclickchanger]) ||
                      expandedTwo.length === allExecutivestwo.length ? (
                        <FaCaretDown
                          size={"1.2em"}
                          title="Collapse"
                          style={{ cursor: "pointer", color: "#428bca" }}
                        />
                      ) : (
                        <FaCaretRight
                          size={"1.2em"}
                          title="Expand"
                          style={{ cursor: "pointer", color: "#428bca" }}
                        />
                      )}
                    </span>
                    {row["salesExec"]}
                  </span>
                ) : key === "executive" && row["lvl"] === 3 ? (
                  <>
                    <div style={{ paddingLeft: "38px", fontWeight: "normal" }}>
                      {key === "executive" &&
                      row["lvl"] !== 2 &&
                      row["salesExec"] !== "  " &&
                      !row["customer"] &&
                      row["salesExec"] !== "Summary" &&
                      row["lvl"] !== 2
                        ? prosicon[row["isProspect"]]
                        : null}

                      <span
                        style={{
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        title={row["customerTmp"]}
                      >
                        {row["customerTmp"]}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          cursor: "pointer",
                          float: "right",
                        }}
                      >
                        <span>
                          {row["customerTmp"] && row["lvl"] !== 2 && (
                            <span>
                              {" "}
                              <MdOutlineEditNote
                                size={"1.5em"}
                                title="Notes"
                                onClick={() => {
                                  setOpenPopup(true);
                                  setRowData(row);
                                }}
                              />
                            </span>
                          )}
                        </span>
                      </span>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </span>
            </td>
          );
        headspanner = key;
      }
    }
    return (
      <tr
        key={`${row.customerId}_${row.countryId}_${row.parentAttr}_${row.executive}_${row.practiceId}_${row.practice}_${row.keyAttr}_${row.lvl}_${row.count}_${row.supervisor}_${row.execStatus}_${row.id}`}
      >
        {rowArray}
      </tr>
    );
  });

  const handleOnExport = () => {
    const excludeProperties = [
      "id",
      "customerId",
      "customer",
      "supervisor",
      "isProspect",
      "practiceId",
      "countryId",
      "execStatus",
      "lvl",
      "count",
      "isEdit",
      "keyAttr",
      "parentAttr",
      "isActive",
      "salesExecId",
      "salesExec",
      "salesExecStatus",
    ];
    const headerRow1 = Object.keys(Vdata[0])
      .filter((key) => !excludeProperties.includes(key))
      .map((key) => {
        if (key === "customer") {
          const val = Vdata[0][key].split("^&");
          let dVal = val[0].includes("__") ? val[0].split("__") : [];
          return dVal[2] + dVal[4];
        }
        const val = Vdata[0][key].split("^&");
        return val[0];
      });

    const filteredData = Vdata.slice(1).map((item) => {
      const filteredItem = Object.fromEntries(
        Object.entries(item).filter(([key]) => !excludeProperties.includes(key))
      );
      if (filteredItem.executive) {
        const executiveParts = filteredItem.executive.split("^&");
        if (executiveParts.length > 1) {
          filteredItem.executive = executiveParts[1];
        }
      }
      return filteredItem;
    });

    if (filteredData.length > 0) {
      Object.keys(filteredData[0]).forEach((key) => {
        if (filteredData[0][key] === "Target ($)") {
          filteredData[0][key] = "Revenue Targets($)";
        }
      });
    }
    const dataRows = filteredData.map((item) => Object.values(item));
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SalesView");
    const headerRow = worksheet.addRow(headerRow1);

    for (let i = 0; i < dataRows.length; i++) {
      const row = worksheet.addRow(dataRows[i]);
    }
    const boldRow = [1];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "SalesView.xlsx");
    });
  };

  const materialTableElement = document.getElementsByClassName(
    "serviceViewTable darkHeader toHead"
  );
  console.log(materialTableElement, "materialTableElement");
  const maxHeight = useDynamicMaxHeight(materialTableElement);
  console.log(maxHeight, "maxHeightValue");
  document.documentElement.style.setProperty(
    "--dynamic-value",
    `${maxHeight}px`
  );

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <RiFileExcel2Line
            size="1.5em"
            title="Export to Excel"
            style={{ color: "green", float: "right" }}
            cursor="pointer"
            onClick={handleOnExport}
          />
          {serviceData.length > 0 && (
            <SFButtons
              reportRunId={reportRunId}
              showSFpipeline={showSFpipeline}
              setshowSFpipeline={setshowSFpipeline}
              componentSelector={componentSelector}
              setRefreshButton={setRefreshButton}
              refreshButton={refreshButton}
            />
          )}
        </div>
      </div>

      <div className="serviceViewTable darkHeader toHead">
        <table
          className="table table-bordered htmlTable"
          cellPadding={0}
          cellSpacing={0}
        >
          <thead>{tableHead}</thead>
          <tbody>{tableData}</tbody>
        </table>
      </div>
      {openPopup ? (
        <DisplayPopup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          Vdata={Vdata}
          rowData={rowData}
        />
      ) : (
        ""
      )}
    </div>
  );
}
