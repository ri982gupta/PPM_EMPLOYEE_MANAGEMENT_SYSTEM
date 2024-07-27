import React, { useState } from "react";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaCircle,
  FaDochub,
} from "react-icons/fa";
import SfPRTable from "./SfPRTable";
import SfDocuments from "./SfDocuments";

const CompetencyTable = (props) => {
  const { tableData, rrId, searching } = props;
  const [expanded, setexpanded] = useState([]);
  const [type, setType] = useState("");
  const [salesOppoId, setSalesOppoId] = useState("");
  const [oppoName, setOppoName] = useState("");

  const cols = tableData?.columns?.replace(/'|\s/g, "");

  const array = cols?.split(",");

  const newArray = tableData?.sfBuckets?.map((item) => {
    let k = JSON.parse(JSON.stringify(item, array, 4));
    return k;
  });

  const allExecutives = newArray
    .filter((item) => item.lvl === 1)
    .map((item) => item.executive);
  const clickExpand = (exec) => {
    if (exec === "Summary") {
      setexpanded((prevState) => {
        return prevState.length === allExecutives.length ? [] : allExecutives;
      });
    } else {
      setexpanded((prevState) => {
        return prevState.includes(exec)
          ? prevState.filter((item) => item !== exec)
          : [...prevState, exec];
      });
    }
  };

  let toggler = 0;

  const prosicon = {
    1: <FaCircle style={{ color: "purple" }} />,
    0: <FaCircle style={{ color: "green" }} />,
  };

  const conditions = [
    "id",
    "lvl",
    "isProspect",
    "pr_id",
    "opp_id",
    "primary_competency",
    "customer",
    "opportunity",
  ];
  const expandableCols = [
    "opp_type",
    "stage",
    "practice",
    "probability",
    "closedDate",
    "next_step",
    "icims_record_id",
    "consultant",
    "country",
    "customer",
    "executive",
    "opportunity",
  ];

  const CompTableHeader = newArray?.map((row) => {
    const rowArray = [];
    toggler =
      row["lvl"] === 3 ? toggler : expanded.includes(row.executive) ? 1 : 0;

    for (const key in row) {
      !conditions.includes(key) &&
        (expanded.length > 0 ? true : !expandableCols.includes(key)) &&
        rowArray.push(
          row.id < 0 ? (
            <th
              key={key}
              style={{
                display:
                  key.includes("sf") &&
                  !(key.includes("Q") || key.includes("total"))
                    ? "none"
                    : "",
                position: "sticky",
                top: 0,
                zIndex: 2,
              }}
            >
              {row[key]?.split("^&")[0]}
            </th>
          ) : (
            ""
          )
        );
    }

    return (
      <tr key={row.country + row.executive + row.pr_id + row.opp_id}>
        {rowArray}
      </tr>
    );
  });

  const CompTableData = newArray?.map((row) => {
    const rowArray = [];
    toggler =
      row["lvl"] === 3 ? toggler : expanded.includes(row.executive) ? 1 : 0;

    for (const key in row) {
      !conditions.includes(key) &&
        (expanded.length > 0 ? true : !expandableCols.includes(key)) &&
        rowArray.push(
          row.id < 0 ? (
            ""
          ) : (
            <td
              className={key == "amount" ? "amount" : ""}
              key={key}
              style={{
                display:
                  (toggler === 0 && row["lvl"] >= 2) ||
                  (key.includes("sf") &&
                    !(key.includes("Q") || key.includes("total")))
                    ? "none"
                    : "",
              }}
            >
              <div>
                {key === "name" && row["lvl"] < 2 && (
                  <>
                    <span onClick={() => clickExpand(row.executive)}>
                      {expanded.includes(row.executive) ||
                      expanded.length === allExecutives.length ? (
                        <FaAngleDown
                          title="Collapse"
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <FaAngleRight
                          title="Expand"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </span>
                  </>
                )}
                {key === "name" && row["lvl"] == 2 && (
                  <>
                    <span onClick={() => clickExpand(row.name)}>
                      {expanded.includes(row.name) ||
                      expanded.length === allExecutives.length ? (
                        <FaAngleDown
                          title="Collapse"
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <FaAngleRight
                          title="Expand"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </span>
                  </>
                )}
                {key === "name" && row["lvl"] === 2 && (
                  <span>{prosicon[row["isProspect"]]}</span>
                )}
                {key === "name" && row["lvl"] > 2 ? (
                  <span className="expandedRow" title={row[key]}>
                    <a
                      href={`http://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttp%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F${row["opp_id"]}%252Fview`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {row[key]}
                    </a>
                    <i
                      className="cp float-right"
                      title="View SF Docs"
                      style={{ cursor: "pointer", float: "right" }}
                      onClick={() => {
                        setType(row["opp_id"]);
                        setSalesOppoId(row["id"]);
                        setOppoName(row["opportunity"]);
                      }}
                    >
                      <FaDochub />
                    </i>
                  </span>
                ) : (
                  <span
                  className={key === "amount" 
                  ? "amt" 
                  : row[key] ===  "Summary"
                  ? "summary"
                  : ""}
                    title={row[key]}
                  >
                    {key === "probability" && row[key] > 0 ? (
                      `${row[key]}%`
                    ) : key === "amount" ? (
                      Math.round(row[key]).toLocaleString()
                    ) : key === "next_step" ? (
                      <div className="">{row[key]}</div>
                    ) : (
                      row[key]
                    )}
                  </span>
                )}
              </div>
            </td>
          )
        );
    }

    return (
      <tr key={row.country + row.executive + row.pr_id + row.opp_id}>
        {rowArray}
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
      {searching && (
        <div
          className="col-lg-12 col-md-12 col-sm-12 no-padding darkHeader toHead"
          style={{ overflow: "auto", maxHeight: "300px" }}
        >
          <table className="table table-bordered htmlTable opportunityTable ">
            <thead>{CompTableHeader}</thead>
            <tbody>{CompTableData}</tbody>
          </table>
        </div>
      )}
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
};

export default CompetencyTable;
