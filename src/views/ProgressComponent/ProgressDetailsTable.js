import ProgressDetailsTableJson from "./ProgressDetailsTable.json";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { environment } from "../../environments/environment";
import { FaAngleDown, FaAngleLeft, FaCircle } from "react-icons/fa";

export default function ProgressDetailsTable({
  execName,
  progressDtlsData,
  reportRunId,
  tableClasName,
  MyKey,
}) {
  const baseUrl = environment.baseUrl;
  const [progressDetailsData, setProgressDetailsData] = useState({});

  const progressDataPayload = {
    executiveId: "" + progressDtlsData,
    type:
      MyKey == "softClosed"
        ? "Closed"
        : MyKey == "serviceClosed"
        ? "Closed"
        : MyKey == "softCreated"
        ? "Created"
        : MyKey == "serviceCreated"
        ? "Created"
        : MyKey == "oddsHighService"
        ? "High Odds"
        : MyKey == "oddsHighSoft"
        ? "High Odds"
        : MyKey == "oddsAllSoft"
        ? "All Odds"
        : MyKey == "oddsAllService"
        ? "All Odds"
        : MyKey == "serviceWon"
        ? "Won"
        : MyKey == "softWon"
        ? "Won"
        : MyKey == "executive"
        ? "executive"
        : "",
    reportRunId: "" + reportRunId,
    case:
      MyKey.indexOf("softClosed") !== -1
        ? "software"
        : MyKey.indexOf("serviceClosed") !== -1
        ? "services"
        : MyKey.indexOf("serviceCreated") !== -1
        ? "services"
        : MyKey.indexOf("softCreated") !== -1
        ? "software"
        : MyKey.indexOf("oddsHighService") !== -1
        ? "ServicesQuarter"
        : MyKey.indexOf("oddsHighSoft") !== -1
        ? "SoftwareQuarter"
        : MyKey.indexOf("oddsAllSoft") !== -1
        ? "SoftwareQuarter"
        : MyKey.indexOf("oddsAllService") !== -1
        ? "ServicesQuarter"
        : MyKey.indexOf("serviceWon") !== -1
        ? "ServicesQuarter"
        : MyKey.indexOf("softWon") !== -1
        ? "SoftwareQuarter"
        : MyKey == "executive"
        ? "executive"
        : "",
  };

  const prosicon = {
    1: <FaCircle style={{ color: "#9567c2", marginTop: "-2px" }} />,
    0: <FaCircle style={{ color: "#539a71", marginTop: "-2px" }} />,
  };

  //----------------------call-----------------------------------

  const getProgressDetailsData = () => {
    axios
      .post(
        baseUrl + `/SalesMS/salesProgress/getSalesProgressDetails`,
        progressDataPayload
      )
      .then((resp) => {
        const data = resp.data;

        setProgressDetailsData(data);
      })
      .catch((err) => {});
  };

  //----------------------useEffect----------------------

  useEffect(() => {
    getProgressDetailsData();
  }, [execName, MyKey]);

  useEffect(() => {
    setTimeout(() => {
      addingClsName();
    }, 500);
  }, [execName, progressDtlsData, reportRunId, tableClasName, MyKey]);

  const addingClsName = () => {
    let tdData =
      document.getElementsByClassName("dummy")[0].children[0].children;
    let clName = ["even", "odd"];
    let val = 0;
    for (let i = 1; i < tdData.length; i++) {
      let tdData1 =
        document.getElementsByClassName("dummy")[0].children[0].children;
      let rowSPn = tdData[i].children[0].getAttribute("rowspan");
      if (rowSPn != null) {
        val = val == 0 ? 1 : 0;
        for (let j = i; j < parseInt(i) + parseInt(rowSPn); j++) {}
      }
    }
  };

  //---------------------------logic-----------------------------

  const progressDetailsTableData = progressDetailsData.data?.map(
    (data, index) => {
      const conditions = ["id", "isProspect", "count"];
      let header = [];
      let checks = MyKey.includes("soft")
        ? "id,opportunity,count,customer,isProspect,vendor,closeDate,amount,probability"
        : MyKey.includes("service")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey.includes("oddsHighService")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey.includes("oddsHighSoft")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey.includes("oddsAllSoft")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey.includes("oddsAllService")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey == "executive"
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : "";

      const keyArr = checks.split(",");

      for (let ia = 0; ia < keyArr.length; ia++) {
        let keys = keyArr[ia];
        if (
          ia === 0 &&
          data.type !== progressDetailsData.data[index - 1]?.type
        ) {
          const rowCount = progressDetailsData.data.filter(
            (d) => d.type === data.type
          ).length;

          header.push(
            <td
              className=""
              key={`type_${data.id}_${index}`}
              rowSpan={rowCount}
            >
              {data.type}
            </td>
          );
        }

        data[keys] !== null &&
          !conditions.includes(keys) &&
          header.push(
            data.id < 1 ? (
              <th
                className={keys.split("_")[0] + ""}
                colSpan={data[keys] && data[keys].split("^&")[2]}
                rowSpan={data[keys] && data[keys].split("^&")[1]}
              >
                {data[keys] ===
                "__iconCust__ Customer __iconProsp__ Prospect" ? (
                  <>
                    <span>
                      {prosicon[0]}
                      {data[keys].split("_")[4]}
                      {""}
                      {prosicon[1]} {data[keys].split("_")[8]}
                    </span>
                  </>
                ) : data[keys] === "Country /<br>Vendor" ? (
                  data[keys].split(" /<br>")[0] +
                  "/" +
                  data[keys].split(" /<br>")[1]
                ) : (
                  data[keys]
                )}
              </th>
            ) 
            : ""
          );
      }
      return <tr key={`${data.id}_${index}`}>{header}</tr>;
    }
  );

  const progressDetailsTableData2 = progressDetailsData.data?.map(
    (data, index) => {
      const conditions = ["id", "isProspect", "count"];
      let header = [];
      let checks = MyKey.includes("soft")
        ? "id,opportunity,count,customer,isProspect,vendor,closeDate,amount,probability"
        : MyKey.includes("service")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey.includes("oddsHighService")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey.includes("oddsHighSoft")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey.includes("oddsAllSoft")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey.includes("oddsAllService")
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : MyKey == "executive"
        ? "id,opportunity,count,customer,isProspect,country,closeDate,amount,probability"
        : "";

      const keyArr = checks.split(",");

      for (let ia = 0; ia < keyArr.length; ia++) {
        let keys = keyArr[ia];
        if (
          ia === 0 &&
          data.type !== progressDetailsData.data[index - 1]?.type
        ) {
          const rowCount = progressDetailsData.data.filter(
            (d) => d.type === data.type
          ).length;

          header.push(
            <td
              className=""
              key={`type_${data.id}_${index}`}
              rowSpan={rowCount}
            >
              {data.type}
            </td>
          );
        }

        data[keys] !== null &&
          !conditions.includes(keys) &&
          header.push(
            data.id > 0 ? 
             (
              <td
                className={keys.split("_")[0] + "" + keys.split("_")[1]}
                key={keys}
                colSpan={data[keys] && data[keys].split("^&")[2]}
                rowSpan={data[keys] && data[keys].split("^&")[1]}
              >
                {data[keys] === "Country /<br>Vendor" ? (
                  <span>{data[keys]}</span>
                ) : (
                  ""
                )}

                {keys === "amount" ? (
                  <Fragment>
                    <span>{parseInt(data[keys]).toLocaleString("en-US")}</span>
                  </Fragment>
                ) : (
                  <Fragment>
                    {keys === "opportunity" ? (
                      <span
                        className="ellipsis"
                        data-toggle="tooltip"
                        title={data[keys]}
                        key={keys}
                        style={{ maxWidth: "150px !important" }}
                      >
                        <a
                          href="https://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttps%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F0061W00001UtIfyQAF%252Fview"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-toggle="tooltip"
                          title={data[keys]}
                        >
                          {data[keys]}
                        </a>
                        {keys === "customer" && data["customer"] !== " " && (
                          <span style={{ float: "left", marginRight: "5px" }}>
                            {prosicon[data["isProspect"]]}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="" title={data[keys]}>
                        {data[keys]?.length > 20
                          ? data[keys].substring(0, 20) + "..."
                          : data[keys]}
                        {keys === "customer" && data["customer"] !== " " && (
                          <span style={{ float: "left", marginRight: "5px" }}>
                            {prosicon[data["isProspect"]]}
                          </span>
                        )}
                      </span>
                    )}
                  </Fragment>
                )}
              </td>
            )
            : ""
          );
      }
      return <tr key={`${data.id}_${index}`}>{header}</tr>;
    }
  );

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 mt10 no-padding darkHeader">
      <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
        <b>Progress of {execName} </b>
      </div>
      &nbsp;
      {progressDetailsTableData?.length > 1 ? (
        <table
          className={`table table-bordered table-striped  ${tableClasName} `}
        >
          <thead>{progressDetailsTableData}</thead>
          <tbody>{progressDetailsTableData2}</tbody>
        </table>
      ) : (
        <div>No Progress Found</div>
      )}
    </div>
  );
}
