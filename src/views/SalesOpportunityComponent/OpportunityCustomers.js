import React from "react";
import { useState, useEffect } from "react";
import { FaAngleDown, FaAngleRight, FaCircle, FaComment } from "react-icons/fa";
import SfDocuments from "./SfDocuments";
import SfPRTable from "./SfPRTable";
import "./SalesOpportunity.scss";
import { ReactComponent as ListCheckSolid } from "./ListCheckSolid.svg";
import DealHubOpportunityPopUp from "./DealhubOpportunityPopUp";
import axios from "axios";
import { environment } from "../../environments/environment";
import { HiDocument } from "react-icons/hi2";
import OpenCommentsPopUp from "./OpenCommentsPopUp";
import {
  OPEN,
  IN_PROGRESS,
  SIGNED_OFF,
  CLOSED,
  ON_HOLD,
} from "./LukUpConstantsDealHub.js";
import moment from "moment";
import { MdNoteAlt } from "react-icons/md";

export default function OpportunityCustomers(props) {
  const {
    tableData,
    rrId,
    checkedDhub,
    versPopup,
    setVersPopup,
    setCheckedDhub,
    dataVar,
    newDataVar,
    formData,
    handleClick,
  } = props;
  const baseUrl = environment.baseUrl;
  const [expanded, setExpanded] = useState([]);
  const [salesOppoId, setSalesOppoId] = useState("");
  const [type, setType] = useState("");
  const [oppoName, setOppoName] = useState("");
  const [opportunityName, setOpportunityName] = useState([]);
  const [opportunityId, setOpportunityId] = useState([]);
  const [commentId, setCommentId] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [open, setOpen] = useState([]);

  const fetchData = () => {
    axios
      .get(baseUrl + `/SalesMS/sales/getsfoppt?reportRunId=${rrId}`)
      .then(function (response) {
        const data = response.data;
        newDataVar(data);
      });
  };

  const prosicon = {
    1: <FaCircle style={{ color: "purple" }} title="Prospect" />,
    0: <FaCircle style={{ color: "green" }} title="Customer" />,
  };

  const allcust = tableData.sfBuckets
    .filter((item) => item.lvl === 1)
    .map((item) => item.name);

  const cols = tableData?.columns?.replace(/'|\s/g, "");
  const columnsArray = cols.split(",");
  const nameIndex = columnsArray.indexOf("name");
  const dhubIndex = columnsArray.indexOf("dhub");

  columnsArray.splice(nameIndex + 1, 0, columnsArray.splice(dhubIndex, 1)[0]);

  const rearrangedCols = columnsArray.join(",");

  // const array = rearrangedCols?.split(",");
  const array = [
    "id",
    "name",
    "executive",
    "dhub",
    "customer",
    "opportunity",
    // "opp_type",
    "stage",
    // "primary_competency",
    // "practice",
    "amount",
    "probability",
    "closedDate",
    // "next_step",
    // "icims_record_id",
    // "consultant",
    // "country",
    "isProspect",
    "lvl",
    "pr_id",
    "opp_id",
    "service_type",
    "offering_name",
    "add_to_call",
    "primary_competitor",
    "description",
    "is_global_delivery_included",
    "opp_csl",
    "opp_dp",
    "dhub_closed_date",
    "dhub_status_id",
    "dhub_id",
    "dhub_effort_hrs",
    "dhub_actual_hrs",
    "dhub_assign_dt",
  ];
  if (formData.viewBy === "dhparticipants") {
    const index = array.indexOf("probability");
    array.splice(index + 1, 0, "role_name");
  }

  const newArray = dataVar?.map((item) => {
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
          ? prevState.filter((item) => item !== cust)
          : [...prevState, cust];
      });
    }
  };

  useEffect(() => {
    const allcust = newArray
      .filter((item) => item.lvl === 1)
      .map((item) => item.name);
    setOpen(allcust);
  }, []);

  useEffect(() => {
    const data = open?.[0];
    setExpanded([data]);
  }, [open]);

  const conditions = [
    "id",
    "opportunity",
    "isProspect",
    "lvl",
    "pr_id",
    "opp_id",
    "primary_competitor",
    "opp_csl",
    "dhub_status_id",
    // "service_type",
    "is_global_delivery_included",
    "offering_name",
    "dhub_closed_date",
    "description",
    "add_to_call",
    "opp_dp",
    "dhub_id",
    "customer",
  ];
  const expandableCols = [
    "executive",
    "opp_type",
    "stage",
    "primary_competency",
    "practice",
    "probability",
    "closedDate",
    "next_step",
    "icims_record_id",
    "consultant",
    "country",
    "customer",
    "customer_id",
    "dhub",
    "service_type",
    "dhub_effort_hrs",
    "dhub_actual_hrs",
    "dhub_assign_dt",
    "role_name",
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
              className="ellipsistd1 "
              title={data[key].split("^&")[0]}
            >
              {typeof data[key] === "string" && data[key].includes("^&")
                ? data[key].split("^&")[0]
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
      const dhubClosedDate = new Date(data["dhub_closed_date"]);
      const closedDate = new Date(data["closedDate"]);
      const todayDate = new Date();
      const dhubStatusIdColor = data["dhub_status_id"];
      const newCommentIds = data["dhub"];
      const probability = data["probability"];
      toggler =
        data["lvl"] === 3 ? toggler : expanded.includes(data.name) ? 1 : 0;

      for (const key in data) {
        !conditions.includes(key) &&
          (expanded.length > 0 ? true : !expandableCols.includes(key)) &&
          header.push(
            <td
              key={key}
              style={{
                textAlign: "center",
                display:
                  (toggler === 0 && data["lvl"] === 3) ||
                  (key.includes("sf") &&
                    !(key.includes("Q") || key.includes("total")))
                    ? "none"
                    : "",
              }}
            >
              <div>
                {key === "name" && data["lvl"] < 2 && (
                  <>
                    <span onClick={() => clickExpand(data.name)}>
                      {expanded.includes(data.name) ||
                      expanded.length === allcust.length ? (
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
                {key === "name" &&
                  formData.viewBy === "cust" &&
                  data[key] != "Summary" &&
                  data["lvl"] <= 2 && (
                    <span>{prosicon[data["isProspect"]]}</span>
                  )}
                {key === "customer" && data["lvl"] === 2 ? (
                  <span
                    title={data["customer"]}
                    style={{ paddingLeft: "40px" }}
                  >
                    {data["customer"]}
                  </span>
                ) : key === "name" && data["lvl"] > 2 ? (
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
                      <HiDocument
                        style={{ transform: "scale(1.3)" }}
                        className="dhDocIcon"
                      />
                    </i>
                  </span>
                ) : key === "dhub" && data["lvl"] > 2 ? (
                  <div>
                    {data[key] === "1" || data["probability"] === "100" ? (
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        {/* <input
                          type="checkbox"
                          checked={data["probability"] !== "100"}
                          className="disabledCheckbox"
                        /> */}
                        <span
                          style={{
                            marginLeft: "5px",
                            fontSize: "12px",
                            marginTop: "2px",
                            cursor: "pointer",
                          }}
                        >
                          {(data["probability"] === "100" &&
                            data["dhub_status_id"] !== "1454") ||
                          (data["probability"] === "0" &&
                            data["dhub_status_id"] !== "1500") ||
                          data["dhub"] === "0" ? (
                            ""
                          ) : (
                            <ListCheckSolid
                              title={
                                probability === "0"
                                  ? "Action Item - Closed Lost"
                                  : probability === "100"
                                  ? "Action Item - Closed Won"
                                  : dhubStatusIdColor === ON_HOLD
                                  ? "Action Item - On hold"
                                  : // : dhubStatusIdColor === OPEN
                                  // ? "Action Item - Open"
                                  dhubStatusIdColor === CLOSED
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
                                probability === "0"
                                  ? "dhUserIconRed"
                                  : probability === "100"
                                  ? "dhUserIconGreen"
                                  : dhubStatusIdColor === ON_HOLD
                                  ? "dhUserIconOrange"
                                  : // : dhubStatusIdColor === OPEN
                                  // ? "dhUserIconBlack"
                                  dhubStatusIdColor === CLOSED
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
                                setOpportunityName(data["name"]);
                                setOpportunityId(() => {
                                  const newId = data["opp_id"];
                                  return newId;
                                });
                                setVersPopup(true);
                              }}
                            />
                          )}
                        </span>
                        {"  "}
                        <span className="commentData">
                          {newCommentIds == "1" && (
                            <MdNoteAlt
                              title="Show Comments"
                              onClick={() => {
                                setCommentId(data["dhub_id"]);

                                setPopUp(true);
                              }}
                            />
                          )}
                        </span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {/* <input
                          type="checkbox"
                          checked={checkedDhub}
                          onChange={() => {
                            setOpportunityName(data["name"]);
                            setOpportunityId(() => {
                              const newId = data["opp_id"];
                              return newId;
                            });
                            setVersPopup(true);
                          }}
                        /> */}
                      </div>
                    )}
                  </div>
                ) : key === "dhub" && data["lvl"] <= 2 ? (
                  <div style={{ margin: "auto" }}>
                    <span></span>
                  </div>
                ) : key === "closedDate" && data["lvl"] > 2 ? (
                  <div style={{ margin: "auto" }}>
                    <span title={moment(data[key]).format("DD-MMM-YYYY")}>
                      {moment(data[key]).format("DD-MMM-YYYY")}
                    </span>
                  </div>
                ) : key === "dhub_assign_dt" && data["lvl"] > 2 ? (
                  <div style={{ margin: "auto" }}>
                    <span title={moment(data[key]).format("DD-MMM-YYYY")}>
                      {moment(data[key]).format("DD-MMM-YYYY")}
                    </span>
                  </div>
                ) : key === "dhub_effort_hrs" && data["lvl"] > 2 ? (
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <span title={data[key]}>{data[key]}</span>
                  </div>
                ) : key === "dhub_actual_hrs" && data["lvl"] > 2 ? (
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <span title={data[key]}>{data[key]}</span>
                  </div>
                ) : key === "probability" && data["lvl"] > 2 ? (
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <span title={`${data[key]}%`}>{`${data[key]}%`}</span>
                  </div>
                ) : key === "service_type" && data["lvl"] !== 3 ? (
                  <div style={{ margin: "auto" }}>
                    <span
                      title={
                        data[key] === "0" ||
                        data[key] === "Project - Fixed Price" ||
                        data[key] === "Project - T&M" ||
                        data[key] === "Project Based" ||
                        data[key] === "Staff Augmentation" ||
                        data[key] === "Managed Services" ||
                        data[key] === "Workshop" ||
                        data[key] === "Training" ||
                        data[key] === "<< Unassigned >>"
                          ? ""
                          : data[key]
                      }
                    >
                      {data[key] === "0" ||
                      data[key] === "Project - Fixed Price" ||
                      data[key] === "Project - T&M" ||
                      data[key] === "Project Based" ||
                      data[key] === "Staff Augmentation" ||
                      data[key] === "Managed Services" ||
                      data[key] === "Workshop" ||
                      data[key] === "Training" ||
                      data[key] === "<< Unassigned >>"
                        ? ""
                        : data[key]}
                    </span>
                  </div>
                ) : (
                  <span
                    className={
                      key === "amount"
                        ? "amt"
                        : data[key] === "Summary"
                        ? "summary"
                        : ""
                    }
                    title={
                      key === "amount"
                        ? Math.round(data[key]).toLocaleString("en-US")
                        : data[key]
                    }
                  >
                    <div>
                      {key === "amount"
                        ? Math.round(data[key]).toLocaleString("en-US")
                        : data[key]}
                    </div>
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
          className={
            data["lvl"] === 1 || data["name"] == "Summary" ? "darkHeader1" : ""
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
            <span style={{ fontSize: "13px", margin: 0, color: "#2e88c5" }}>
              Sf Pipeline
            </span>
          </th>
        </tr>
      </div>
      <div
        className="col-lg-12 col-md-12 col-sm-12 no-padding scrollit darkHeader toHead "
        style={{ overflow: "auto", maxHeight: "635px" }}
      >
        <table className="table table-bordered opportunityTable">
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
          handleClick={handleClick}
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
