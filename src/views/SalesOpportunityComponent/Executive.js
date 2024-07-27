import React, { useEffect } from "react";
import { useState } from "react";
import {
  FaAngleDown,
  FaAngleLeft,
  FaAngleRight,
  FaCircle,
  FaComment,
} from "react-icons/fa";
import SfPRTable from "./SfPRTable";
import SfDocuments from "./SfDocuments";
import {
  OPEN,
  IN_PROGRESS,
  SIGNED_OFF,
  CLOSED,
  ON_HOLD,
} from "./LukUpConstantsDealHub.js";
import { environment } from "../../environments/environment.js";
import axios from "axios";
import { HiDocument } from "react-icons/hi2";
import { ReactComponent as ListCheckSolid } from "./ListCheckSolid.svg";
import OpenCommentsPopUp from "./OpenCommentsPopUp.js";
import DealHubOpportunityPopUp from "./DealhubOpportunityPopUp.js";

export default function Executive(props) {
  const {
    tableData,
    rrId,
    checkedDhub,
    versPopup,
    setVersPopup,
    setCheckedDhub,
    dataVar,
    newDataVar,
  } = props;
  const [showTable, setShowTable] = useState(true);
  const [open, setOpen] = useState([]);
  const [expanded, setexpanded] = useState([]);
  const [colexpanded, setcolexpanded] = useState([]);
  const [salesOppoId, setSalesOppoId] = useState("");
  const [type, setType] = useState("");
  const [oppoName, setOppoName] = useState("");
  const [opportunityId, setOpportunityId] = useState([]);
  const [opportunityName, setOpportunityName] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [commentId, setCommentId] = useState([]);
  const baseUrl = environment.baseUrl;
  const cols = tableData?.columns?.replace(/'|\s/g, "");
  const columnsArray = cols.split(",");
  const nameIndex = columnsArray.indexOf("opportunity");
  const dhubIndex = columnsArray.indexOf("dhub");
  columnsArray.splice(nameIndex + 1, 0, columnsArray.splice(dhubIndex, 1)[0]);

  const rearrangedCols = columnsArray.join(",");
  const array = rearrangedCols?.split(",");
  const newArray = dataVar?.map((item) => {
    let k = JSON.parse(JSON.stringify(item, array, 4));
    return k;
  });

  const allExecutives = newArray
    ?.filter((item) => item.lvl === 1)
    .map((item) => item.name);
  const prosicon = {
    1: <FaCircle style={{ color: "purple" }} />,
    0: <FaCircle style={{ color: "green" }} />,
  };
  const fetchData = () => {
    axios
      .get(baseUrl + `/SalesMS/sales/getsfoppt?reportRunId=${rrId}`)
      .then(function (response) {
        const data = response.data;
        newDataVar(data);
      });
  };
  const clickExpand = (exec) => {
    if (exec === "Summary") {
      setexpanded((prevState) => {
        return prevState.length === allExecutives.length ? [] : allExecutives;
      });
    } else {
      setexpanded((prevState) => {
        return prevState.includes(exec)
          ? prevState.filter((item) => item != exec)
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

  // useEffect(() => {
  //   const allcust = newArray
  //     .filter((item) => item.lvl === 1)
  //     .map((item) => item.name);
  //   setOpen(allcust);
  // }, []);

  // useEffect(() => {
  //   const data = open?.[0];
  //   setexpanded([data]);
  // }, [open]);

  let toggler = 0;
  let coltoggler = 0;
  const conditions = [
    "id",
    "lvl",
    "isProspect",
    "pr_id",
    "practice",
    "opp_id",
    "executive",
    "service_type",
    "offering_name",
    "dhub_closed_date",
    "description",
    "add_to_call",
    "primary_competitor",
    "is_global_delivery_included",
    "opp_csl",
    "opp_dp",
    "dhub_id",
    "dhub_status_id",
  ];
  const expandableCols = [
    "opp_type",
    "opportunity",
    "stage",
    "probability",
    "primary_competency",
    "closedDate",
    "next_step",
    "icims_record_id",
    "consultant",
    "country",
    "customer",
    "dhub",
  ];

  const tableHead = newArray?.map((row) => {
    const rowArray = [];
    toggler =
      row["lvl"] == 2 ? toggler : expanded.includes(row.executive) ? 1 : 0;

    for (const key in row) {
      if (key.includes("Q")) {
        coltoggler = colexpanded.includes(key.split("_")[1]) ? 1 : 0;
      }
      !conditions.includes(key) &&
        (expanded.length > 0 ? true : !expandableCols.includes(key)) &&
        rowArray.push(
          row.id < 0 ? (
            <th
              className={
                key == "customer"
                  ? "expandedRow customer"
                  : key == "opportunity"
                  ? "expandedRow opportunity"
                  : ""
              }
              key={key}
              style={{
                display:
                  coltoggler === 0 &&
                  key.includes("sf") &&
                  !(key.includes("Q") || key.includes("total"))
                    ? "none"
                    : "",
              }}
              title={row[key].split("^&")[0]}
            >
              {row[key] ===
              "__iconCust__ Customer __iconProsp__ Prospect^&2^&1" ? (
                <React.Fragment>
                  <span>
                    <FaCircle
                      style={{
                        color: "#539a71",
                        marginTop: "-2px",
                        marginLeft: "15px",
                      }}
                    />
                    {row[key].split("_")[4]}
                    <FaCircle style={{ color: "#9567c2", marginTop: "-2px" }} />
                    {row[key].split("_")[8].replace("^&2^&1", "")}
                  </span>
                </React.Fragment>
              ) : (
                ""
              )}

              {row[key] !=
                "__iconCust__ Customer __iconProsp__ Prospect^&2^&1" &&
                row[key]?.split("^&")[0]}
              {row.id === -2 && row[key].includes("Quart") && (
                <span
                  onClick={() => {
                    clickExpandcols(key.split("_")[1]);
                  }}
                >
                  {colexpanded.includes(key.split("_")[1]) ? (
                    <FaAngleLeft
                      title="Hide Details "
                      style={{ cursor: "pointer" }}
                    />
                  ) : (
                    <FaAngleRight
                      title="Show Details"
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </span>
              )}
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

  const tableBody = newArray
    ?.filter((row) => row.lvl !== -1 && row.lvl !== -2)
    .map((row) => {
      const rowArray = [];
      const dhubClosedDate = new Date(row["dhub_closed_date"]);
      const closedDate = new Date(row["closedDate"]);
      const todayDate = new Date();
      const dhubStatusIdColor = row["dhub_status_id"];
      const newCommentIds = row["dhub"];
      toggler =
        row["lvl"] == 2 ? toggler : expanded.includes(row.executive) ? 1 : 0;

      for (const key in row) {
        if (key.includes("Q")) {
          coltoggler = colexpanded.includes(key.split("_")[1]) ? 1 : 0;
        }
        !conditions.includes(key) &&
          (expanded.length > 0 ? true : !expandableCols.includes(key)) &&
          rowArray.push(
            <td
              className={
                key.includes("Q")
                  ? key.split("_")[1][1] % 2 == 0
                    ? "even"
                    : "odd"
                  : key.includes("total")
                  ? "total"
                  : key.includes("0")
                  ? key.split("_")[1] % 2 == 0
                    ? "innereven"
                    : "innerodd"
                  : key == "amount" && row["lvl"] === 1
                  ? "amount bgColor"
                  : (row["lvl"] === 3 ||
                      // row["lvl"] === 1 ||
                      row["lvl"] === 0) &&
                    key == "customer"
                  ? "customer"
                  : (row["lvl"] === 3 ||
                      // row["lvl"] === 1 ||
                      row["lvl"] === 0) &&
                    key == "opportunity"
                  ? "opportunity"
                  : row["lvl"] === 3
                  ? "expandedRow"
                  : (row["lvl"] === 1 && key == "name") ||
                    (key == "dhub" && row["lvl"] === 1) ||
                    (key == "opp_type" && row["lvl"] === 1) ||
                    (key == "stage" && row["lvl"] === 1) ||
                    (key == "primary_competency" && row["lvl"] === 1) ||
                    (key == "probability" && row["lvl"] === 1) ||
                    (key == "closedDate" && row["lvl"] === 1) ||
                    (key == "next_step" && row["lvl"] === 1) ||
                    (key == "icims_record_id" && row["lvl"] === 1) ||
                    (key == "consultant" && row["lvl"] === 1) ||
                    (key == "country" && row["lvl"] === 1)
                  ? "bgColor"
                  : row["lvl"] === 1 && key == "customer"
                  ? "bgColor customer-sticky"
                  : row["lvl"] === 1 && key == "opportunity"
                  ? "bgColor opper-sticky"
                  : ""
              }
              key={key}
              style={{
                display:
                  (toggler === 0 && row["lvl"] === 3) ||
                  (coltoggler === 0 &&
                    key.includes("sf") &&
                    !(key.includes("Q") || key.includes("total")))
                    ? "none"
                    : "",
              }}
              expandedRow
            >
              <div>
                {key === "name" && row["lvl"] < 2 && (
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
                {key === "opportunity" && row["lvl"] == 3 ? (
                  <>
                    <a
                      href={`http://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttp%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F${row["opp_id"]}%252Fview`}
                      target="_blank"
                      title={row[key]}
                      className="ellipsis"
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
                      <HiDocument
                        style={{ transform: "scale(1.3)" }}
                        className="dhDocIcon"
                      />
                    </i>
                  </>
                ) : key === "dhub" && row["lvl"] > 2 ? (
                  <div>
                    {row[key] === "1" ? (
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked
                          className="disabledCheckbox"
                        />
                        <span
                          style={{
                            marginLeft: "5px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          <ListCheckSolid
                            title={
                              dhubStatusIdColor === ON_HOLD
                                ? "Action Item - On hold"
                                : dhubStatusIdColor === OPEN
                                ? "Action Item - Open"
                                : dhubStatusIdColor === CLOSED
                                ? "Action Item - Closed"
                                : dhubStatusIdColor === SIGNED_OFF
                                ? "Action Item-Signed Off"
                                : dhubStatusIdColor === IN_PROGRESS
                                ? "Action Item - In-progress"
                                : todayDate > closedDate
                                ? "todayDate > closedDate"
                                : dhubClosedDate > closedDate
                                ? "dhubClosedDate > closedDate"
                                : ""
                            }
                            className={
                              dhubStatusIdColor === ON_HOLD
                                ? "dhUserIconOrange"
                                : dhubStatusIdColor === OPEN
                                ? "dhUserIconBlack"
                                : dhubStatusIdColor === CLOSED
                                ? "dhUserIconGreen"
                                : dhubStatusIdColor === SIGNED_OFF
                                ? "dhUserIconPink"
                                : dhubStatusIdColor === IN_PROGRESS
                                ? "dhUserIconBlue"
                                : todayDate > closedDate ||
                                  dhubClosedDate > closedDate
                                ? "dhUserIconRed"
                                : ""
                            }
                            onClick={() => {
                              setOpportunityName(row["name"]);
                              setOpportunityId(() => {
                                const newId = row["opp_id"];
                                return newId;
                              });
                              setVersPopup(true);
                            }}
                          />
                        </span>
                        {"  "}
                        <span className="commentData">
                          {newCommentIds == "1" && (
                            <FaComment
                              title="Show Comments"
                              onClick={() => {
                                setCommentId(row["dhub_id"]);

                                setPopUp(true);
                              }}
                            />
                          )}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={checkedDhub}
                          onChange={() => {
                            setOpportunityName(row["name"]);
                            setOpportunityId(() => {
                              const newId = row["opp_id"];
                              return newId;
                            });
                            setVersPopup(true);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : key === "dhub" && row["lvl"] <= 2 ? (
                  <div style={{ margin: "auto" }}>
                    <span></span>
                  </div>
                ) : key == "customer" && row["lvl"] == 3 ? (
                  <span>
                    <span>{prosicon[row["isProspect"]]}</span> {row[key]}
                  </span>
                ) : key == "closedDate" && row["lvl"] == 3 ? (
                  <div
                    title={row[key]}
                    style={{ textAlign: "center", margin: "auto" }}
                  >
                    <span>{row[key]}</span>
                  </div>
                ) : (
                  <span
                    className={
                      key === "amount"
                        ? "amt"
                        : row[key] === "Summary"
                        ? "summary"
                        : ""
                    }
                    title={row[key]}
                  >
                    {key === "probability" && row[key] > 0
                      ? `${row[key]}%`
                      : key === "amount" || key.includes("_sf")
                      ? Math.round(row[key]).toLocaleString("en-US")
                      : row[key]}
                  </span>
                )}
              </div>
            </td>
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
      {showTable && (
        <div
          className="opportunityTable opportunityExecTable darkHeader toHead"
          style={{ overflow: "auto", maxHeight: "620px" }}
        >
          <table
            className="table table-bordered htmlTable"
            cellPadding={0}
            cellSpacing={0}
          >
            <thead>{tableHead}</thead>
            <tbody>{tableBody}</tbody>
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
      {versPopup && (
        <DealHubOpportunityPopUp
          versPopup={versPopup}
          setVersPopup={setVersPopup}
          opportunityId={opportunityId}
          setCheckedDhub={setCheckedDhub}
          opportunityName={opportunityName}
          fetchData={fetchData}
          dataVar={dataVar}
          rrId={rrId}
        />
      )}
      {popUp && (
        <OpenCommentsPopUp
          popUp={popUp}
          setPopUp={setPopUp}
          commentId={commentId}
        />
      )}
    </div>
  );
}
