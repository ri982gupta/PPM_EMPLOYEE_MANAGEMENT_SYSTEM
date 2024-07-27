import React from "react";
import Attainment from "./Attainment.json";
import { Fragment, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import AttainmentDetailsTable from "./AttainmentDetailsTable";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import "./AttainmentTable.scss";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

import ExcelJS from "exceljs";
const AttainmentTable = ({ attainmentData, display }) => {
  const [type, setType] = useState("");
  const [execName, setexecName] = useState("");
  const [attinmentDtlsData, setAttinmentDtlsData] = useState("");
  const [displayTable, setDisplayTable] = useState(false);

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
  // ----------------Method start-------------------------

  // ----------------table renderer-------------------------

  const attainmentTableData = attainmentData.data.map((data) => {
    const conditions = ["id", "isActive", "execStatus", "supervisor"];
    let header = [];
    let checks = attainmentData.attainmentData;
    const keyArr = checks.split(",");

    for (let ia = 0; ia < keyArr.length; ia++) {
      let keys = keyArr[ia];

      data[keys] !== null &&
        !conditions.some((el) => keys.includes(el)) &&
        header.push(
          data.id < 0 ? (
            <th
              className={" attainth "}
              key={keys}
              colSpan={data[keys].split("^&")[2]}
              rowSpan={data[keys].split("^&")[1]}
              title={data[keys].split("^&1")[0]}
            >
              {keys !== "executive" ? (
                <Fragment>
                  <span>{data[keys].split("^&")[0]}</span>
                </Fragment>
              ) : (
                <Fragment>
                  {data[keys].split("^&")[0]}
                  <div className="cpContainer">
                    <i className="cp" title="Country">
                      C
                    </i>
                    <span>Country</span>
                    <i className="cp ml-2" title="Practice">
                      P
                    </i>
                    <span>Practice</span>
                  </div>
                </Fragment>
              )}
            </th>
          ) : (
            ""
          )
        );
    }
    return <tr key={data.id}>{header}</tr>;
  });
  const attainmentTableDataBody = attainmentData.data.map((data) => {
    const conditions = ["id", "isActive", "execStatus", "supervisor"];

    let body = [];

    let checks = attainmentData.attainmentData;
    const keyArr = checks.split(",");

    for (let ia = 0; ia < keyArr.length; ia++) {
      let keys = keyArr[ia];

      data[keys] !== null &&
        !conditions.some((el) => keys.includes(el)) &&
        body.push(
          data.id >= 0 ? (
            <td
              className={keys.split("_")[0] + " attaintd " + keys.split("_")[1]}
              key={keys}
              colSpan={data[keys].split("^&")[2]}
              rowSpan={data[keys].split("^&")[1]}
              title={data[keys]}
            >
              {keys !== "executive" ? (
                <Fragment>
                  <span title={parseInt(data[keys]).toLocaleString("en-US")}>
                    {parseInt(data[keys]).toLocaleString("en-US")}
                  </span>
                </Fragment>
              ) : (
                <Fragment>
                  {display == "country" ? (
                    <>
                      <span className="executiveName">
                        {icons[data["execStatus"]]} {data[keys].split("^&")[0]}
                      </span>
                      <span className="cpContainer">
                        <span
                          className="iconsty"
                          onClick={() => {
                            setType("practice");
                            setexecName(data["executive"]);
                            setAttinmentDtlsData(data["id"]);
                            setDisplayTable(true);
                          }}
                        >
                          <i className="cp" title="practice">
                            P
                          </i>
                        </span>
                      </span>
                    </>
                  ) : display == "practice" ? (
                    <>
                      <span className="executiveName">
                        {icons[data["execStatus"]]} {data[keys].split("^&")[0]}
                      </span>
                      <span className="cpContainer">
                        <span
                          className="iconsty"
                          onClick={() => {
                            setType("country");
                            setexecName(data["executive"]);
                            setAttinmentDtlsData(data["id"]);
                            setDisplayTable(true);
                          }}
                        >
                          <i className="cp" title="country">
                            C
                          </i>
                        </span>
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="executiveName">
                        {icons[data["execStatus"]]}
                        <span>{data[keys].split("^&")[0]}</span>
                      </div>
                      <div className="cpContainer">
                        <span
                          className="iconsty"
                          onClick={() => {
                            setType("country");
                            setexecName(data["executive"]);

                            setAttinmentDtlsData(data["id"]);
                            setDisplayTable(true);
                          }}
                        >
                          <i className="cp" title="Country">
                            C
                          </i>
                        </span>
                        <span
                          className="iconsty"
                          onClick={() => {
                            setType("practice");
                            setexecName(data["executive"]);
                            setAttinmentDtlsData(data["id"]);
                            setDisplayTable(true);
                          }}
                        >
                          <i className="cp" title="Practice">
                            P
                          </i>
                        </span>
                      </div>
                    </>
                  )}
                </Fragment>
              )}
              {keys.includes("total_service_attainPer") ||
              keys.includes("total_software_attainPer") ||
              keys.includes("software_attainPer") ||
              keys.includes("service_attainPer") ||
              keys.includes("service_attainPer") ||
              keys.includes("software_attainPer") ||
              keys.includes("software_attainPer") ||
              keys.includes("service_attainPer") ||
              keys.includes("software_attainPer") ||
              keys.includes("service_attainPer") ? (
                <Fragment>
                  <span> %</span>
                </Fragment>
              ) : (
                ""
              )}
            </td>
          ) : (
            ""
          )
        );
    }
    return <tr key={data.id}>{body}</tr>;
  });

  const exportExcel = () => {
    let desiredColumnOrder = [];
    let cols = [];
    cols = attainmentData.attainmentData.replaceAll("'", "");
    desiredColumnOrder = cols.split(",");

    const wantedValues = attainmentData.data.map((item) => {
      const obj = {};
      desiredColumnOrder.forEach((col) => {
        if (col !== "execStatus" && col !== "id" && col !== "lvl") {
          const value = item[col];
          if (typeof value === "string") {
            const [extractedValue, ,] = value.split("^&"); // Extract the value from the key metadata
            obj[col] = extractedValue; // Assign the extracted value to the corresponding column
          } else {
            obj[col] = value;
          }
        }
      });
      return obj;
    }); // Create an array of objects where each object represents a row

    const rows = wantedValues.map((item) => {
      const row = [];
      desiredColumnOrder.forEach((col) => {
        if (
          col !== "isActive" &&
          col !== "id" &&
          col !== "helpText" &&
          col !== "lvl" &&
          col !== "execStatus"
        ) {
          row.push(item[col]);
        }
      });
      return row;
    });

    const workbook = new ExcelJS.Workbook(); // Create a new ExcelJS workbook
    const worksheet = workbook.addWorksheet("Sales Attainment"); // Add a worksheet

    // Add data rows

    rows.forEach((item) => {
      const row = worksheet.addRow(Object.values(item));
    });

    const boldRow = [1];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "SalesAttainment.xlsx");
    });
  };
  const materialTableElement = document.getElementsByClassName(
    "table table-bordered table-striped htmlTable AttainmentDynamicHeight"
  );
  const maxHeight = useDynamicMaxHeight(materialTableElement);

  return (
    <div>
      <div className="exportBtn ml-3 mb-1 align right ">
        <span>
          <RiFileExcel2Line
            size="1.5em"
            title="Export to Excel"
            style={{ color: "green", float: "right" }}
            cursor="pointer"
            onClick={exportExcel}
          />
        </span>
      </div>
      <div className="col-lg-12 col-md-12 col-sm-12 ">
        <div
          className="col-lg-12 col-md-12 col-sm-12 no-padding attainTablePrnt scrollit darkHeader toHead"
          // style={{ maxHeight: "calc(100vh - 140px)" }}

          style={{ maxHeight: `${maxHeight - 5}px` }}
        >
          <table
            className="table table-bordered table-striped htmlTable AttainmentDynamicHeight"
            cellPadding={0}
            cellSpacing={0}
          >
            <thead>{attainmentTableData}</thead>
            <tbody>{attainmentTableDataBody}</tbody>
          </table>
        </div>

        {displayTable && (
          <AttainmentDetailsTable
            attinmentDtlsData={attinmentDtlsData}
            reportRunId={attainmentData.reportRunId}
            execName={execName}
            type={type}
          />
        )}
      </div>
    </div>
  );
};

export default AttainmentTable;
