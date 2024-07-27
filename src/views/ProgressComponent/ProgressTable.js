import React from "react";
import { Fragment, useState } from "react";
import { FiChevronRight } from "react-icons/fi";

import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import ProgressDetailsTable from "./ProgressDetailsTable";
import "./ProgressTable.scss";
import useDynamicMaxHeight from '../PrimeReactTableComponent/useDynamicMaxHeight'

const ProgressTable = ({ progressData }) => {
  const [execName, setexecName] = useState("");
  const [key, setKey] = useState("");

  const [progressDtlsData, setProgressDtlsData] = useState("");

  const [tableClasName, setTableClasName] = useState("");

  const [tableVal, setTableVal] = useState(false);
  const [allPageLoad, setAllPageLoad] = useState(false);

  // ----------------Method start-------------------------
  const progressDataPayload2 = {
    executiveId: "114598022",
    type: "Won",
    reportRunId: "26678",
    case: "SoftwareQuarter",
  };

  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Ex-Employee"
      />
    ),
    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Active Employee"
      />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Ex-Contractor"
      />
    ),
    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Active Contractor"
      />
    ),
    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px", marginTop: "-5px" }}
        title="Contractor in notice period"
      />
    ),
  };

  // ----------------table renderer-------------------------

  const progressTableData = progressData.data.map((data, index) => {
    const conditions = [
      "id",
      "isActive",
      "serviceClosedCount",
      "softClosedCount",
      "serviceCreatedCount",
      "softCreatedCount",
      "oddsHighServiceCount",
      "oddsHighSoftCount",
      "oddsAllServiceCount",
      "oddsAllSoftCount",
      "serviceWonCount",
      "softWonCount",
      "execStatus",
    ];
    let header = [];
    let checks =
      "id,executive,execStatus,serviceClosed,serviceClosedCount,softClosed,softClosedCount,serviceCreated,serviceCreatedCount,softCreated,softCreatedCount,oddsHighService,oddsHighServiceCount,oddsHighSoft,oddsHighSoftCount,oddsAllService,oddsAllServiceCount,oddsAllSoft,oddsAllSoftCount,serviceWon,serviceWonCount,softWon,softWonCount,isActive";
    const keyArr = checks.split(",");

    for (let ia = 0; ia < keyArr.length; ia++) {
      let keys = keyArr[ia];
      data[keys] !== null &&
        !conditions.some((el) => keys.includes(el)) &&
        header.push(
          data.id < 0 ? (
            <th
              className={keys.split("_")[0] + " progressth"}
              key={keys}
              colSpan={data[keys].split("^&")[2]}
              rowSpan={data[keys].split("^&")[1]}
            >
              {data[keys].split("^&")[0]}
            </th>
          ) : (
            <td
              className={
                data[keys] === "Summary"
                  ? "summary"
                  : keys.split("_")[0] + " progresstd "
              }
              key={keys}
              colSpan={data[keys].split("^&")[2]}
              rowSpan={data[keys].split("^&")[1]}
              title={data[keys]}
            >
              {keys !== "executive" ? (
                <Fragment>
                  <span title={parseInt(data[keys]).toLocaleString("en-US")}>
                    {parseInt(data[keys]).toLocaleString("en-US")}{" "}
                  </span>
                  {console.log(data["type"])}(
                  <span
                    className="linkSty"
                    onClick={() => {
                      window.scrollTo({ top: 1500, behavior: "smooth" });
                      setTableVal(false);
                      setProgressDtlsData("");
                      setexecName(data["executive"]);
                      setProgressDtlsData(data["id"]);
                      console.log(data);
                      setKey(keys);
                      setTableVal(true);
                      setTableClasName("dummy1");
                    }}
                  >
                    {data[keys + "Count"]?.split("^&")[0]}
                    {console.log(">>>>>>>>", keys)}
                  </span>
                  )
                </Fragment>
              ) : keys == "executive" && data["executive"] != "Summary" ? (
                <Fragment>
                  <span>{icons[data["execStatus"]]}</span>{" "}
                  <span
                    className="linkSty"
                    onClick={() => {
                      window.scrollTo({ top: 1500, behavior: "smooth" });
                      setTableVal(false);
                      setexecName(data["executive"]);
                      setProgressDtlsData(data["id"]);
                      setKey(keys);
                      setTableVal(true);
                      setAllPageLoad(true);
                      setTableClasName("dummy");
                    }}
                  >
                    {data[keys].split("^&")[0]}
                  </span>
                </Fragment>
              ) : (
                data[keys].split("^&")[0]
              )}
            </td>
          )
        );
    }

    return <tr key={data.id}>{header}</tr>;
  });
  const materialTableElement = document.getElementsByClassName('table table-bordered table-striped progressTable');
  const maxHeight = useDynamicMaxHeight(materialTableElement);

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 darkHeader toHead">
      <div
        className="col-lg-12 col-md-12 col-sm-12 no-padding progressTablePrnt scrollit"
        // style={{ maxHeight: "calc(100vh - 114px)" }}
        style={{ maxHeight: `${maxHeight}px` }}

      >
        <table className="table table-bordered table-striped progressTable">
          <thead>{progressTableData}</thead>
        </table>
      </div>

      {(tableVal || allPageLoad) && (
        <ProgressDetailsTable
          execName={execName}
          progressDtlsData={progressDtlsData}
          reportRunId={progressData.reportRunId}
          tableClasName={tableClasName}
          MyKey={key}
        />
      )}
    </div>
  );
};

export default ProgressTable;
