import React from "react";
import { useState } from "react";
import { FaAngleDown, FaAngleRight, FaCircle } from "react-icons/fa";
import SfDocuments from "./SfDocuments";
import SfPRTable from "./SfPRTable";
import { FaDochub } from "react-icons/fa";

export default function OpportunityConsultant({ tableData, rrId }) {
  const [expanded, setExpanded] = useState([]);
  const [salesOppoId, setSalesOppoId] = useState("");
  const [type, setType] = useState("");
  const [oppoName, setOppoName] = useState("");

  const prosicon = {
    1: <FaCircle style={{ color: "purple" }} title="Prospect" />,
    0: <FaCircle style={{ color: "green" }} title="Customer" />,
  };

  const allcust = tableData.sfBuckets
    .filter((item) => item.lvl === 1)
    .map((item) => item.name);
  const cols = tableData?.columns?.replace(/'|\s/g, "");
  const array = cols?.split(",");

  const newArray = tableData?.sfBuckets?.map((item) => {
    let k = JSON.parse(JSON.stringify(item, array, 4));
    return k;
  });
  const clickExpand = (cust) => {
    if (cust === "Summary") {
      setExpanded((prevState) => {
        return prevState.length === allcust.length ? [] : allcust;
      });
    } else {
      setExpanded((prevState) => {
        return prevState.includes(cust)
          ? prevState.filter((item) => item != cust)
          : [...prevState, cust];
      });
    }
  };

  const conditions = [
    "id",
    "opportunity",
    "isProspect",
    "lvl",
    "pr_id",
    "opp_id",
    "consultant",
  ];
  const expandableCols = [
    "executive",
    "customer",
    "opp_type",
    "stage",
    "primary_competency",
    "practice",
    "probability",
    "closedDate",
    "next_step",
    "icims_record_id",
    "country",
  ];
  let toggler = 0;

  const tableHeaders = newArray?.map((data) => {
    const header = [];
    toggler =
      data["lvl"] === 3 ? toggler : expanded.includes(data.name) ? 1 : 0;
    for (const key in data) {
      !conditions.includes(key) &&
        (expanded.length > 0 ? true : !expandableCols.includes(key)) &&
        header.push(
          data.id < 0 ? (
            <th
              key={key}
              className="ellipsistd1"
              style={{ textAlign: "center" }}
              title={data[key].split("^&")[0]}
            >
              {data[key] ===
              "__iconCust__ Customer __iconProsp__ Prospect^&2^&1" ? (
                <React.Fragment>
                  <span>
                    <FaCircle
                      style={{
                        color: "#539a71",
                        marginTop: "-2px",
                        marginLeft: "15px",
                      }}
                      title="Customer "
                    />
                    {data[key].split("_")[4]}
                    <FaCircle
                      style={{
                        color: "#9567c2",
                        marginTop: "-2px",
                      }}
                      title=" Prospect"
                    />
                    {data[key].split("_")[8].replace("^&2^&1", "")}
                  </span>
                </React.Fragment>
              ) : (
                ""
              )}

              {typeof data[key] === "string" &&
              data[key].includes("^&") &&
              data[key].includes("^&")
                ? data[key] !=
                    "__iconCust__ Customer __iconProsp__ Prospect^&2^&1" &&
                  data[key].split("^&")[0]
                : data[key]}
              {data.id === -2 && typeof data[key] === "string" && <span></span>}
            </th>
          ) : (
            ""
          )
        );
    }

    return (
      <tr
        key={
          data.id +
          data.opp_id +
          data.practice +
          data.country +
          data.executive +
          data.pr_id
        }
      >
        {header}
      </tr>
    );
  });

  const tableBody = newArray
    ?.filter((data) => data.lvl !== -1 && data.lvl !== -2)
    .map((data) => {
      const header = [];
      toggler =
        data["lvl"] === 3 ? toggler : expanded.includes(data.name) ? 1 : 0;
      for (const key in data) {
        !conditions.includes(key) &&
          (expanded.length > 0 ? true : !expandableCols.includes(key)) &&
          header.push(
            <td
              key={key}
              style={{
                display: toggler == 0 && data["lvl"] == 3 ? "none" : "",
              }}
            >
              <div>
                {key === "name" && data["lvl"] < 2 && (
                  <>
                    <span onClick={() => clickExpand(data.name)}>
                      {expanded.includes(data.name) ||
                      expanded.length == allcust.length ? (
                        <>
                          <FaAngleDown
                            title="Collapse"
                            style={{ cursor: "pointer" }}
                          />
                        </>
                      ) : (
                        <>
                          <FaAngleRight
                            title="Expand"
                            style={{ cursor: "pointer" }}
                          />
                        </>
                      )}
                    </span>
                  </>
                )}

                {key === "name" && data["lvl"] == 3 ? (
                  <span className="expandedRow" title={data[key]}>
                    <a
                      href={`http://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttp%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F${data["opp_id"]}%252Fview`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data[key]}
                    </a>
                    <i
                      className="cp float-right"
                      title="View SF Docs"
                      style={{ cursor: "pointer", float: "right" }}
                      onClick={() => {
                        setType(data["opp_id"]);
                        setSalesOppoId(data["id"]);
                        setOppoName(data["opportunity"]);
                      }}
                    >
                      <FaDochub />
                    </i>
                  </span>
                ) : key == "customer" && data["lvl"] == 3 ? (
                  <span>
                    <span>{prosicon[data["isProspect"]]}</span> {data[key]}
                  </span>
                ) : key === "closedDate" && data["lvl"] == 3 ? (
                  <div style={{ margin: "auto" }}>
                    <span title={data[key]}>{data[key]}</span>
                  </div>
                ) : (
                  <span
                    className={key === "amount" 
                    ? "amt" 
                    : data[key] ===  "Summary"
                    ? "summary"
                    : ""}
                    title={data[key]}
                  >
                    {key === "probability" && data[key] > 0
                      ? `${data[key]}%`
                      : key === "amount"
                      ? Math.round(data[key]).toLocaleString("en-US")
                      : data[key]
                      }
                  </span>
                )}
              </div>
            </td>
          );
      }

      return (
        <tr
          key={
            data.id +
            data.opp_id +
            data.practice +
            data.country +
            data.executive +
            data.pr_id
          }
        >
          {header}
        </tr>
      );
    });

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 customCard ">
      <div
        className="col-md-12"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "1px",
          backgroundColor: " rgb(236, 235, 235)",
          width: "100%",
        }}
      >
        <tr>
          <th>
            <span style={{ color: "#2e88c5", fontSize: "13px", margin: 0 }}>
              Sf Pipeline
            </span>
          </th>
        </tr>
      </div>
      <div
        className="col-lg-12 col-md-12 col-sm-12 no-padding attainTablePrnt scrollit darkHeader"
        style={{ overflow: "auto", maxHeight: "350px" }}
      >
        <table className="table table-bordered htmlTable opportunityTable ">
          <thead>{tableHeaders}</thead>
          <tbody>{tableBody}</tbody>
        </table>
      </div>
      {salesOppoId && (
        <div className="col-md-12 mt-3">
          <span>
            <span style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
              <b> Sf URL -</b>
            </span>{" "}
            https://na87.lightning.force.com/lightning/r/Opportunity/{type}/view
          </span>
        </div>
      )}

      {salesOppoId && (
        <div className="col-md-12 mt-3">
          <span style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
            <b>Sf PR Pipeline - {oppoName}</b>
          </span>
        </div>
      )}

      {salesOppoId && (
        <SfPRTable salesOppoId={salesOppoId} reportRunId={rrId} type={type} />
      )}

      {salesOppoId && (
        <div className="col-md-12 mt-2">
          <span style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
            <b>Sf Documents - {oppoName}</b>
          </span>
        </div>
      )}

      {salesOppoId && <SfDocuments type={type} />}
    </div>
  );
}
