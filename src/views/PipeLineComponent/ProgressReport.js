import axios from "axios";
import { useEffect, useState } from "react";
import { environment } from "../../environments/environment";
import { FaCircle } from "react-icons/fa";
import React from "react";
import { Link } from "react-router-dom";

// import { concat } from "core-js/core/array";

export default function ProgressReport({
  progressReportData,
  reportRunId,
  monthlyResourceData,
  setmonthlyResourceData,
  popUpDate,
  popDate,
  typeSelector,
}) {
  const d = progressReportData.split("^")[0];

  const parts = d?.split("_"); // Split the string by underscores

  // Reconstruct the date in the desired format
  const date11 = `${parts[0]}-${parts[1]}-${parts[2]}`;

  const data22 =
    date11 == "total-serviceCreated-undefined" ||
    "total-serviceClosed-undefined" ||
    "total-softwareCreated-undefined" ||
    "total-softwareClosed-undefined"
      ? popDate
      : date11;

  const baseUrl = environment.baseUrl;
  const objectkey = progressReportData.split("^")[0];
  const executiveId = progressReportData.split("^")[1];
  const executiveName = progressReportData.split("^")[2];
  let asofnowPercentSelector =
    objectkey.split("_")[objectkey.split("_").length - 1];
  typeSelector = objectkey.split("_")[0];

  const prosicon = {
    1: <FaCircle style={{ color: "#9567c2" }} />,
    0: <FaCircle style={{ color: "#539a71" }} />,
  };
  const monthlyDataPayload = {
    ExecutiveId: parseInt(executiveId),
    SelMonth:
      typeSelector === "asofnow" || typeSelector == "total"
        ? "2023-03-01"
        : date11,

    ReportId: reportRunId,
    optType: objectkey.includes("Closed") ? "Closed" : "Created",
    optCat: objectkey.includes("soft") ? "Software" : "Services",
    target: typeSelector === "asofnow" || typeSelector == "total" ? 1 : 0,
    optProb: asofnowPercentSelector.replace("soft", "").replace("service", ""),
    asOfNow: typeSelector === "asofnow" ? 1 : 0,
  };

  //----------------------call-----------------------------------
  const getmonthlyResourceData = () => {
    axios({
      method: "GET",
      url:
        baseUrl +
        `/SalesMS/pipeLineTrending/getMonthlySalesResourceDataNew?executiveId=${parseInt(
          executiveId
        )}&reportRunId=${reportRunId}&dateVal=${
          typeSelector === "asofnow" || typeSelector == "total"
            ? popDate
            : date11
        }&optType=${
          objectkey.includes("Closed") ? "Closed" : "Created"
        }&optCat=${
          objectkey.includes("soft") ? "Software" : "Services"
        }&target=${
          typeSelector === "asofnow" || typeSelector == "total" ? 1 : 0
        }&optProb=${asofnowPercentSelector
          .replace("soft", "")
          .replace("service", "")}&asOfNow=${
          typeSelector === "asofnow" ? 1 : 0
        }`,
    }).then((resp) => {
      const data = resp.data;
      const array = [
        "id",
        "opportunity",
        "customer",
        "isProspect",
        "country",
        "closeDate",
        "amount",
        "probability",
        "grossMargin",
      ];
      const newArray = data.map((item) => {
        // let k = JSON.parse(JSON.stringify(item, array, 4));
        return JSON.parse(JSON.stringify(item, array, 4));
      });
      setmonthlyResourceData(newArray);
    });
  };
  // const getmonthlyResourceData = () => {
  //   axios
  //     .post(
  //       baseUrl + `/ProjectMS/project/getPiplineSubData`,
  //       monthlyDataPayload
  //     )
  //     .then((resp) => {
  //       const data = resp.data;
  //       const array = [
  //         "id",
  //         "opportunity",
  //         "customer",
  //         "isProspect",
  //         "country",
  //         "closeDate",
  //         "amount",
  //         "probability",
  //         "grossMargin",
  //       ];
  //       const newArray = data.map((item) => {
  //         // let k = JSON.parse(JSON.stringify(item, array, 4));
  //         return JSON.parse(JSON.stringify(item, array, 4));
  //       });
  //       setmonthlyResourceData(newArray);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  //----------------------useEffect----------------------

  useEffect(() => {
    getmonthlyResourceData();
    document.getElementById("prgReport").scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, [progressReportData]);

  //---------------------------logic-----------------------------

  let asofnowPercentage = "";

  const monthsNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = objectkey.split("_")[0];
  const month = monthsNames[parseInt(objectkey.split("_")[1])];

  let typeName;

  {
    objectkey.split("_")[3] == "serviceClosed" ? "service Closed" : "";
  }
  switch (objectkey.split("_")[3]) {
    case "softCreated":
      typeName = "Software Created";
      break;
    case "serviceCreated":
      typeName = "Service Created";
      break;
    case "serviceClosed":
      typeName = "Service Closed";
      break;
    case "softClosed":
      typeName = "Software Closed";
      break;
    default:
      typeName = objectkey.includes("soft")
        ? "Software Created"
        : "Services Created";
  }

  switch (asofnowPercentSelector) {
    case "serviceSevenFive":
      asofnowPercentage = "(75-99)";
      break;
    case "serviceFifty":
      asofnowPercentage = "(50-74)";
      break;
    case "serviceTwoFive":
      asofnowPercentage = "(25-49)";
      break;
    case "serviceLessTwoFive":
      asofnowPercentage = "(<25)";
      break;
    case "softSevenFive":
      asofnowPercentage = "(75-99)";
      break;
    case "softFifty":
      asofnowPercentage = "(50-74)";
      break;
    case "softTwoFive":
      asofnowPercentage = "(25-49)";
      break;
    case "softLessTwoFive":
      asofnowPercentage = "(<25)";
      break;
    default:
      typeName = progressReportData.includes("soft")
        ? "Software Created"
        : "Services Created";
  }
  const handleClick = () => {
    (window.location.href =
      "https://d300000000qxieam.lightning.force.com/lightning/r/Opportunity/0068Z00001VHCDxQAP/view"),
      "_blank";
  };
  const data1 = "__iconCust__ Customer __iconProsp__ Prospect";

  const tablerender = monthlyResourceData?.map((data) => {
    let header = [];

    for (const keys in data) {
      keys !== "id" &&
        keys !== "isProspect" &&
        header.push(
          data.id < 0 ? (
            <th
              className="childTableHead"
              style={{ textAlign: "center" }}
              key={keys}
            >
              <div className="circle red">
                {/* <FaCircle style={{ color: "#9567c2" }} /> */}
              </div>

              {data[keys] === "__iconCust__ Customer __iconProsp__ Prospect" ? (
                <React.Fragment>
                  <FaCircle style={{ color: "#539a71", marginTop: "-2px" }} />
                  {data[keys].split("_")[4]}
                  <FaCircle
                    style={{ color: "#9567c2", marginTop: "-2px" }}
                  />{" "}
                  {data[keys].split("_")[8]}
                </React.Fragment>
              ) : (
                <React.Fragment>{data[keys]}</React.Fragment>
              )}
            </th>
          ) : (
            <td key={keys} className={keys} title={data[keys]}>
              {keys == "opportunity" ? (
                <div>
                  <a
                    href="https://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttps%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F0061W00001UtIfyQAF%252Fview"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* {data[keys]} */}
                    <span title={data[keys]}>{`${data[keys].slice(
                      0,
                      50
                    )}...`}</span>
                  </a>
                </div>
              ) : (
                ""
              )}
              {keys == "amount"
                ? parseInt(data[keys]).toLocaleString("en-US")
                : keys == "grossMargin"
                ? Math.round(data[keys])
                : ""}
              {keys == "customer" ||
              keys == "country" ||
              keys == "closeDate" ||
              keys == "probability"
                ? data[keys]
                : ""}
              {/* {keys == "grossMargin" ? (
                <span>{Math.round(data[keys])}</span>
              ) : (
                ""
              )} */}
              {keys === "customer" && data["customer"] !== " " && (
                <span
                  title={data}
                  style={{
                    float: "left",
                    marginTop: "-2px",
                    marginRight: "6px",
                  }}
                >
                  {prosicon[data["isProspect"]]}
                </span>
              )}
            </td>
          )
        );
    }
    return <tr key={data.id}>{header}</tr>;
  });
  // console.log(tablerender.length);
  return (
    <div
      id="prgReport"
      className="col-lg-12 col-md-12 col-sm-12 mt10 no-padding"
    >
      <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
        <b>
          {typeSelector === "asofnow" ? (
            <>
              Total Progress {asofnowPercentage} of{" "}
              <span
                className="proName"
                style={{ color: "#297ab0", fontSize: "14px" }}
              >
                {executiveName}{" "}
              </span>{" "}
              As Of Now
            </>
          ) : (
            <>
              Progress of <span>{executiveName}</span>{" "}
              {month + "-" + year == "undefined-total"
                ? ""
                : month + "-" + year}
            </>
          )}
        </b>
      </div>
      <div className="col-lg-12 col-md-12 col-sm-12 no-padding">
        {/* <b>{typeName}</b> */}
        <b>
          {/* {typeName} */}
          {objectkey.split("_")[3] == "serviceClosed"
            ? "Service Closed"
            : objectkey.split("_")[3] == "serviceCreated"
            ? "Service Created"
            : objectkey.split("_")[3] == "softClosed"
            ? "Software Closed"
            : objectkey.split("_")[3] == "softCreated"
            ? "Software Created"
            : objectkey.split("_")[1] == "serviceSevenFive"
            ? "Service Created"
            : objectkey.split("_")[1] == "serviceFifty"
            ? "Service Created"
            : objectkey.split("_")[1] == "serviceTwoFive"
            ? "Service Created"
            : objectkey.split("_")[1] == "serviceLessTwoFive"
            ? "Service Created"
            : objectkey.split("_")[1] == "softSevenFive"
            ? "Software Created"
            : objectkey.split("_")[1] == "softFifty"
            ? "Software Created"
            : objectkey.split("_")[1] == "softTwoFive"
            ? "Software Created"
            : objectkey.split("_")[1] == "softLessTwoFive"
            ? "Software Created"
            : ""}
        </b>
      </div>
      <span></span>
      {tablerender?.length > 1 ? (
        <div className="darkHeader">
          <table
            className="table table-bordered table-striped progresstable customCard card graph"
            style={{ width: "auto", margin: "0px auto", float: "left" }}
          >
            <thead className="graph">{tablerender}</thead>
          </table>
        </div>
      ) : (
        // " No Progress Found"
        <div style={{ marginTop: "10px" }}>No Progress Found</div>
      )}
    </div>
  );
}
