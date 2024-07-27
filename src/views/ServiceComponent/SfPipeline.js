import Sfpipeline from "./SfPipeline.json";
import {
  FaChevronCircleRight,
  FaChevronCircleLeft,
  FaCaretDown,
  FaCaretRight,
  FaCircle,
  FaTimes,
} from "react-icons/fa";
import { useState,  useRef, forwardRef } from "react";
import { useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { MdDescription } from "react-icons/md";
import SfpipelineDocument from "./SfpipelineDocument";
import "./ViewTable.scss";
import { Row } from "antd";

function SfPipeline({ reportRunId, summval, onCloseTable}, ref ) {
  const tableRef = useRef(null);
  const baseUrl = environment.baseUrl;
  const [showTable, setShowTable] = useState(true);
  const [table, setTable] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState("");

  const [Sfpipeline, setSfpipeline] = useState([]);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [ref, Sfpipeline, selectedOpportunity]);

  const getserviceData = () => {
    axios
      .post(`${baseUrl}/SalesMS/services/getSFPipeLineData`, {
        reportRunId: reportRunId,
        summval:
          summval === null || summval === "" || summval === undefined
            ? "none"
            : summval,
      })
      .then((resp) => {
        const data = resp.data.data;
        const array = resp.data.serviceSfPipeline.split(",");
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });
        setSfpipeline(newArray);
      })
      .catch((err) => {});
  };

  const closeTable = () => {
    setShowTable(false);
    onCloseTable();
  };

  const prosicon = {
    1: <FaCircle size={"0.8em"} style={{ color: "purple" }} />,
    0: <FaCircle size={"0.8em"} style={{ color: "green" }} />,
  };

  const [expanded, setexpanded] = useState([]);
  const allExecutives = Sfpipeline.filter((item) => item.lvl === 1).map(
    (item) => item.executive
  );
  const [type, setType] = useState("");
  const [salesOppoId, setSalesOppoId] = useState("");
  const [colexpanded, setcolexpanded] = useState([]);
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

  const clickExpandcols = (quartr) => {
    setcolexpanded((prevState) => {
      return prevState.includes(quartr)
        ? prevState.filter((item) => item !== quartr)
        : [...prevState, quartr];
    });
  };

  let toggler = 0;
  let coltoggler = 0;
  const conditions = [
    "id",
    "isProspect",
    "lvl",
    "opp_id",
    "practice",
    "customer_id",
    "customer",
    "country_id",
    "account_owner_id",
    "account_owner",
    "pr_id",
  ];
  // const conditions = ["id","executive","practice","country","customer","opportunity","closedDate","amount","probability","country_id","account_owner_id","account_owner"
  // "isProspect","lvl","pr_id","opp_id"]
  const expandableCols = [
    "opportunity",
    "closedDate",
    "probability",
    "country",
  ];

  const tdArray = [];
  const thArray = [];

  Sfpipeline.forEach((row) => {
    const rowArray = [];
    let cust;

    toggler =
      row["lvl"] === 2 ? toggler : expanded.includes(row.executive) ? 1 : 0;

    for (const key in row) {
      if (key.includes("Q")) {
        coltoggler = colexpanded.includes(key.split("_")[1]) ? 1 : 0;
      }

      if (
        !conditions.includes(key) &&
        (expanded.length > 0 ? true : !expandableCols.includes(key))
      ) {
        if (row.id < 0) {
          thArray.push(
            <th
              key={key}
              style={{
                textAlign: "center",
                display:
                  coltoggler === 0 &&
                  key.includes("sf") &&
                  !(key.includes("Q") || key.includes("total"))
                    ? "none"
                    : "",
              }}
            >
              {typeof row[key] === "string" && row[key].includes("^&")
                ? row[key].split("^&")[0]
                : row[key]}
              {row.id === -2 &&
                typeof row[key] === "string" &&
                row[key].includes("Quart") && (
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
          );
        } else {
          rowArray.push(
            <td
              className={
                key.includes("Q")
                  ? key.split("_")[1][1] % 2 === 0
                    ? "even"
                    : "odd"
                  : key.includes("total")
                  ? "total"
                  : key.includes("0")
                  ? key.split("_")[1] % 2 === 0
                    ? "innereven"
                    : "innerodd"
                  : key === "amount" && row["lvl"] === 1 
                  ? "amountCollapse1"
                  : key === "probability" && row["lvl"] === 1 
                  ? "probCollapse1"
                  : key === "probability"
                  ? "probCollapse"
                  : key === "closedDate" && row["lvl"] === 1 
                  ? "closedDateCollapse1"
                  : key === "opportunity" && row["lvl"] === 1 
                  ? "opportunityCollapse1"
                  : key === "country" && row["lvl"] === 1 
                  ? "countryCollapse1"
                  : "" 
              }
              key={key}
              style={{
                display:
                  (toggler === 0 && row["lvl"] === 2) ||
                  (coltoggler === 0 &&
                    key.includes("sf") &&
                    !(key.includes("Q") || key.includes("total")))
                    ? "none"
                    : "",
              }}
            >
              {key === "executive" && row["lvl"] < 2 && (
                <span  className={
                  key === "executive"  && row["lvl"] === 2
                    ? "collapsedRow2"
                    : "" || row["lvl"] === 3
                    ? "collapsedRow3"
                    : ""
                }>
                  <span onClick={() => clickExpand(row.executive)}>
                    {expanded.includes(row.executive) ||
                    expanded.length === allExecutives.length ? (
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
                </span>
              )}
              {key === "customer" && row["customer"] !== " " && (
                <span>{prosicon[row["isProspect"]]}</span>
              )}
              {key === "executive" && row["lvl"] === 2 ? (
                <span title={row["customer"]} className="collapsedRow">
                  {prosicon[row["isProspect"]]}
                  {row["customer"]}{" "}
                </span>
              ) : row["lvl"] === 3 && key === "opportunity" ? (
                <span title={row[key]}>{row["pr_id"]}</span>
              ) : row["lvl"] === 3 &&
                (key === "executive" ||
                  key === "probability" ||
                  key === "closedDate") ? null : key === "opportunity" &&
                row["customer_id"] !== 0 ? (
                <span title={row[key]}>
                  <a
                    href={`http://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttp%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F${row["opp_id"]}%252Fview`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {row[key]}
                  </a>
                  <MdDescription
                    title="Notes"
                    style={{ float: "right", color: "grey", cursor: "pointer" }}
                    size={"1.2em"}
                    onClick={() => {
                      setType(row["opp_id"]);
                      setSalesOppoId(row["id"]);
                      setTable(true);
                      setSelectedOpportunity(row["opportunity"]);
                    }}
                  />
                </span>
              ) : (
                <span title={row[key]}>
                  {key === "probability" && row[key] > 0 ? (
                    <span
                      style={{ paddingLeft: "45px" }}
                    >{`${row[key]}%`}</span>
                  ) : key === "executive" ? (
                    row[key]
                  ) : key === "closedDate" ? (
                    <span style={{ paddingLeft: "40px" }}>{row[key]}</span>
                  ) : key === "probability" ? (
                    row[key]
                  ) : key === "opportunity" ? (
                    row[key]
                  ) : key === "country" ? (
                    <span style={{ paddingLeft: "42px" }}>{row[key]}</span>
                  ): key === "amount" ? (
                    <span style={{float:'right' }}>{Math.round(row[key]).toLocaleString()}</span>
                  )
                   : (
                   <span > {Math.round(row[key]).toLocaleString()}</span>
                  )}
                </span>
              )}
            </td>
          );
        }
      }
    }

    if (row.id >= 0) {
      const isLvl3RowVisible =
        row.lvl === 3 && expanded.includes(row.executive);
      tdArray.push(
        <tr
          key={
            row.id +
            row.practice +
            row.country +
            row.executive +
            row.pr_id +
            row.opp_id
          }
          style={{
            display: isLvl3RowVisible || row.lvl !== 3 ? "" : "none",
          }}
        >
          {rowArray}
        </tr>
      );
    }
  });

  useEffect(() => {
    getserviceData();
  }, [reportRunId]);

  return (
    <>
      {showTable && (
        <div ref={ref} className="">
          
          <div
            className="col-md-10 mt-4 "
            style={{ backgroundColor: "#f4f4f4" }}
          >
            <div
              className="table-header  "
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid #ccc",
                // padding: "10px",
                borderRadius: "1px",
                backgroundColor: "#f4f4f4",
                width: "100%",
              }}
            >
              <h
                style={{
                  color: "#2e88c5",
                  fontSize: "17px",
                  margin: 0,
                  paddingLeft: "10px",
                  fontWeight: "700",
                }}
              >
                Sf Pipeline
              </h>
              <div>
                <button
                  className=""
                  onClick={closeTable}
                  style={{
                    display: "flex",
                    borderColor: "lightgrey",
                    height: "18px",
                    borderRadius: "4px",
                    padding: "0px 4px 16px 4px !important",
                    width: "100%",
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div></div>
            <div className="sfPipelineTable darkHeader toHead">
              <table
                style={{ width: "100%" }}
                className="table table-bordered htmlTable"
                cellPadding={0}
                cellSpacing={0}
              >
                <thead>
                  <tr>{thArray}</tr>
                </thead>
                <tbody>{tdArray}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {table && (
        <div>
          <div class="" style={{ padding: "5px !important" }}>
            <span style={{ fontSize: "14px", fontWeight: "bolder" }}>
              Sf Documents For{" "}
            </span>
            <span
              style={{
                color: "#297ab0",
                fontSize: "15px",
                fontWeight: "bolder",
              }}
            >
              {selectedOpportunity}
            </span>
          </div>
          <SfpipelineDocument type={type} />
        </div>
      )}
    </>
  );
}
export default forwardRef(SfPipeline);