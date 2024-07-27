import { Fragment } from "react";
import { useState, useRef } from "react";
import ProgressReport from "./ProgressReport";
import ChartRenderer from "./ChartRenderer";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";

export default function TableRenderer({
  pipeLineTrendingData,
  reportRunId,
  setmonthlyResourceData,
  monthlyResourceData,
  popDate,
  viewDataNew,
  refresh,
  setRefresh,
  setProgressReportData,
  progressReportData,
  typeSelector,
}) {
  const [execId, setExecId] = useState("");
  const [execName, setexecName] = useState("");
  const [popUpDate, setPopUpDate] = useState([]);
  const ref = useRef(null);

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

  let xAxis = [];

  const yServCreated = {};
  const ySwCreated = {};
  const yServClosed = {};
  const ySwClosed = {};

  const ySwSevenFive = {};
  const ySwFifty = {};
  const ySwTwoFive = {};
  const ySwLessTwoFive = {};

  const yServSevenFive = {};
  const yServFifty = {};
  const yServTwoFive = {};
  const yServLessTwoFive = {};

  const heads = pipeLineTrendingData.map((data) => {
    const conditions = ["Count", "execStatus", "id", "isActive"];
    let header = [];

    if (!(data.id in yServCreated)) {
      yServCreated[data.id] = [];
    }
    if (!(data.id in ySwCreated)) {
      ySwCreated[data.id] = [];
    }
    if (!(data.id in yServClosed)) {
      yServClosed[data.id] = [];
    }
    if (!(data.id in ySwClosed)) {
      ySwClosed[data.id] = [];
    }

    if (!(data.id in ySwSevenFive)) {
      ySwSevenFive[data.id] = [];
    }
    if (!(data.id in ySwFifty)) {
      ySwFifty[data.id] = [];
    }
    if (!(data.id in ySwTwoFive)) {
      ySwTwoFive[data.id] = [];
    }
    if (!(data.id in ySwLessTwoFive)) {
      ySwLessTwoFive[data.id] = [];
    }

    if (!(data.id in yServSevenFive)) {
      yServSevenFive[data.id] = [];
    }
    if (!(data.id in yServFifty)) {
      yServFifty[data.id] = [];
    }
    if (!(data.id in yServTwoFive)) {
      yServTwoFive[data.id] = [];
    }
    if (!(data.id in yServLessTwoFive)) {
      yServLessTwoFive[data.id] = [];
    }

    for (const keys in data) {
      let keysplitArray = keys?.split("_");
      let kValue = keysplitArray[keysplitArray.length - 1];
      let monthLoop = keysplitArray[0];
      let arrKey = data.id;
      let val = data[keys];
      let monthVal =
        keysplitArray[0] + "-" + keysplitArray[1] + "-" + keysplitArray[2];

      if (
        !xAxis.includes(monthVal) &&
        data.id == "0" &&
        monthLoop != "total" &&
        monthLoop != "asofnow" &&
        keysplitArray.includes("serviceClosed")
      ) {
        xAxis.push(
          new Date(monthVal).toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
          })
        );
      }

      switch (kValue) {
        case "serviceClosed":
          if (monthLoop != "total" && monthLoop != "asofnow") {
            if (data.id >= 0) yServClosed[arrKey].push(parseFloat(val));
          }
          break;
        case "softClosed":
          if (monthLoop != "total" && monthLoop != "asofnow") {
            if (data.id >= 0) ySwClosed[arrKey].push(parseFloat(val));
          }
          break;
        case "serviceCreated":
          if (monthLoop != "total" && monthLoop != "asofnow") {
            if (data.id >= 0) yServCreated[arrKey].push(parseFloat(val));
          }
          break;
        case "softCreated":
          if (monthLoop != "total" && monthLoop != "asofnow") {
            if (data.id >= 0) ySwCreated[arrKey].push(parseFloat(val));
          }
          break;

        case "serviceSevenFive":
          if (monthLoop != "total") {
            if (data.id >= 0) yServSevenFive[arrKey].push(parseFloat(val));
          }

          break;
        case "serviceFifty":
          if (monthLoop != "total") {
            if (data.id >= 0) yServFifty[arrKey].push(parseFloat(val));
          }

          break;
        case "serviceTwoFive":
          if (monthLoop != "total") {
            if (data.id >= 0) yServTwoFive[arrKey].push(parseFloat(val));
          }

          break;
        case "serviceLessTwoFive":
          if (monthLoop != "total") {
            if (data.id >= 0) yServLessTwoFive[arrKey].push(parseFloat(val));
          }
          break;

        case "softSevenFive":
          if (monthLoop != "total") {
            if (data.id >= 0) ySwSevenFive[arrKey].push(parseFloat(val));
          }

          break;
        case "softFifty":
          if (monthLoop != "total") {
            if (data.id >= 0) ySwFifty[arrKey].push(parseFloat(val));
          }

          break;
        case "softTwoFive":
          if (monthLoop != "total") {
            if (data.id >= 0) ySwTwoFive[arrKey].push(parseFloat(val));
          }

          break;
        case "softLessTwoFive":
          if (monthLoop != "total") {
            if (data.id >= 0) ySwLessTwoFive[arrKey].push(parseFloat(val));
          }
          break;
      }

      data[keys] !== null &&
        !conditions.some((el) => keys.includes(el)) &&
        header.push(
          data.id < 0 ? (
            <th
              className={keys?.split("_")[0] + " pipeth"}
              key={keys}
              colSpan={data[keys]?.split("^&")[2]}
              rowSpan={data[keys]?.split("^&")[1]}
            >
              {data[keys]?.split("^&")[0]}
            </th>
          ) : (
            <td
              className={
                (keys.includes("service") ? "service" : "software") +
                " pipetd " +
                keys?.split("_")[0]
              }
              key={keys}
              colSpan={data[keys]?.split("^&")[2]}
              rowSpan={data[keys]?.split("^&")[1]}
              style={{ backgroundColor: data.id === "0" ? "#EADDCA" : "" }}
              title={data[keys]}
            >
              {keys !== "executive" ? (
                <Fragment>
                  <span title={parseInt(data[keys]).toLocaleString("en-US")}>
                    {parseInt(data[keys]?.split("^&")[0]).toLocaleString(
                      "en-US"
                    )}
                  </span>
                  <span
                    title={data[keys]}
                    className={
                      data[keys + "Count"]?.split("^&")[0] ? "linkSty" : ""
                    }
                    onClick={
                      data[keys + "Count"]?.split("^&")[0]
                        ? () => {
                            setProgressReportData(
                              keys + "^" + data["id"] + "^" + data["executive"]
                            );
                            setExecId("");
                            setPopUpDate();
                            setRefresh(true);
                          }
                        : "No Data found"
                    }
                  >
                    ({data[keys + "Count"]?.split("^&")[0]})
                  </span>
                </Fragment>
              ) : (
                <Fragment>
                  <span>{icons[data["execStatus"]]}</span>
                  <span
                    className="linkSty"
                    onClick={() => {
                      setExecId(data["id"]);
                      setexecName(data["executive"]);
                      setProgressReportData("");

                      setRefresh(true);

                      window.scrollTo({ top: 3000, behavior: "smooth" });
                    }}
                  >
                    {data[keys]?.split("^&")[0]}
                  </span>
                </Fragment>
              )}
            </td>
          )
        );
    }

    return <tr key={data.id}>{header}</tr>;
  });

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 no-padding darkHeader customCard">
      <div
        className="col-lg-12 col-md-12 col-sm-12 no-padding scrollit"
        style={{ maxHeight: "calc(100vh - 114px)" }}
      >
        <table className="table table-bordered table-striped pipelinetable ">
          <thead>{heads}</thead>
        </table>
      </div>

      {progressReportData !== "" && refresh === true ? (
        <ProgressReport
          progressReportData={progressReportData}
          reportRunId={reportRunId}
          setmonthlyResourceData={setmonthlyResourceData}
          monthlyResourceData={monthlyResourceData}
          viewDataNew={viewDataNew}
          typeSelector={typeSelector}
          popUpDate={popUpDate}
          popDate={popDate}
        />
      ) : (
        ""
      )}

      {execId !== "" && refresh == true ? (
        <ChartRenderer
          yServCreated={yServCreated}
          ySwCreated={ySwCreated}
          yServClosed={yServClosed}
          ySwClosed={ySwClosed}
          ySwSevenFive={ySwSevenFive}
          ySwFifty={ySwFifty}
          ySwTwoFive={ySwTwoFive}
          ySwLessTwoFive={ySwLessTwoFive}
          yServSevenFive={yServSevenFive}
          yServFifty={yServFifty}
          yServTwoFive={yServTwoFive}
          yServLessTwoFive={yServLessTwoFive}
          execKey={execId}
          xAxis={xAxis}
          execName={execName}
          ref ={ref}
        />
      ) : (
        ""
      )}
    </div>
  );
}
