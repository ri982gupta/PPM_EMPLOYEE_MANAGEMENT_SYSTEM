import React, { useEffect, useRef, useState } from "react";
import { FaCircle, FaComment, FaDochub, FaInfoCircle } from "react-icons/fa";
import { HiDocument } from "react-icons/hi2";
import SfPRTable from "./SfPRTable";
import SfDocuments from "./SfDocuments";
import DealHubOpportunityPopUp from "./DealhubOpportunityPopUp";
import moment from "moment";
import axios from "axios";
import { environment } from "../../environments/environment";
import "./DealhubOpportunityPopUp.scss";
import { IoPersonAdd } from "react-icons/io5";
import { Column } from "primereact/column";
import { ReactComponent as ListCheckSolid } from "./ListCheckSolid.svg";
import Loader from "../Loader/Loader";
import { MdNoteAlt } from "react-icons/md";

import {
  OPEN,
  IN_PROGRESS,
  SIGNED_OFF,
  CLOSED,
  ON_HOLD,
  OWNER,
  SCOPING,
  SOLUTION,
  ESTIMATION,
  SUPPORT,
} from "./LukUpConstantsDealHub.js";
import OpenCommentsPopUp from "./OpenCommentsPopUp.js";

function OpportunityTable(props) {
  const {
    data,
    rrId,
    dataVar,
    newDataVar,
    versPopup,
    setVersPopup,
    checkedDhub,
    setCheckedDhub,
    handleClick,
  } = props;
  const [type, setType] = useState("");
  const [salesOppoId, setSalesOppoId] = useState("");
  const [salesExecutiveId, setSalesExecutiveId] = useState("");
  const dataCols = {
    columns:
      "id,customer,executive,opportunity,stage,amount,probability,closedDate,opp_type,next_step,icims_record_id,consultant,country,isProspect,lvl,pr_id,opp_id,name,dhub,service_type,offering_name,add_to_call,primary_competitor,description,is_global_delivery_included,opp_csl,opp_dp,dhub_closed_date,dhub_status_id,dhub_id,primary_competency,practice",
  };

  const columnsArray = dataCols?.columns?.split(",");

  const opportunityIndex = columnsArray.indexOf("opportunity");

  if (opportunityIndex !== -1) {
    columnsArray.splice(opportunityIndex + 1, 0, "dhub");
  }

  const modifiedCols = columnsArray.join(",");

  const array = modifiedCols?.split(",");
  const [oppoName, setOppoName] = useState("");
  const loggedUserId = localStorage.getItem("resId");
  const today = new Date();
  const formattedToday = moment(today).format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(formattedToday);
  const newArray = dataVar?.map((item) => {
    let k = JSON.parse(JSON.stringify(item, array, 4));
    return k;
  });
  const baseUrl = environment.baseUrl;
  const [tableHeaders, setTableHeaders] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [opportunityId, setOpportunityId] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [open, setOpen] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const abortController = useRef(null);
  const [popUp, setPopUp] = useState(false);
  const [commentId, setCommentId] = useState([]);

  const fetchData = () => {
    axios
      .get(baseUrl + `/SalesMS/sales/getsfoppt?reportRunId=${rrId}`)
      .then(function (response) {
        const data = response.data;
        newDataVar(data);
      });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    commentsData[0] &&
      setHeaderData(JSON.parse(JSON.stringify(commentsData[0])));
  }, [commentsData]);

  const roleName = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.role}>
        {data.role}
      </div>
    );
  };

  const ownerName = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.owner}>
        {data.owner}
      </div>
    );
  };

  const commentss = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.comments}>
        {data.comments}
      </div>
    );
  };

  const dateCol = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.date}>
        {data.date}
      </div>
    );
  };

  const [opportunityName, setOpportunityName] = useState([]);
  const handleSort = (columnName) => {
    if (sortColumn === columnName) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const sortTableData = (data) => {
    if (sortColumn) {
      data.sort((a, b) => {
        const columnA = String(a[sortColumn]);
        const columnB = String(b[sortColumn]);

        if (a.customer === "Summary" || b.customer === "Summary") {
          return 0;
        }

        if (sortDirection === "asc") {
          return columnA.localeCompare(columnB);
        } else {
          return columnB.localeCompare(columnA);
        }
      });
    }
    return data;
  };

  const updateTableData = () => {
    const sortedData = sortTableData(newArray);
    displayTableData(sortedData);
  };
  useEffect(() => {}, [dataVar]);

  useEffect(() => {
    displayTableData();
  }, [data, dataVar, sortColumn, sortDirection, searchQuery]);

  useEffect(() => {
    updateTableData();
  }, [sortColumn, sortDirection]);

  const displayTableData = () => {
    const headers = [];
    const rows = [];

    newArray?.forEach((objData, index) => {
      const tabData = [];
      Object.keys(objData).forEach((key) => {
        let unWantedCols = [
          "id",
          "lvl",
          "isProspect",
          "pr_id",
          "opp_id",
          "name",
          "customer_id",
          "description",
          "is_global_delivery_included",
          "offering_name",
          "opp_csl",
          "opp_dp",
          "primary_competitor",
          "service_type",
          "add_to_call",
          "dhub_closed_date",
          "dhub_status_id",
          "dhub_id",
        ];
        if (objData.id === -2 && unWantedCols.indexOf(key) === -1) {
          let val = objData[key]?.split("^&");
          let dVal = val[0].includes("__") ? val[0].split("__") : [];
          headers.push(
            <th
              style={{
                textAlign: "center",
                position: "sticky",
                top: 0,
                background: "white",
                zIndex: 1,
                cursor: "pointer",
              }}
              className="fs10"
              onClick={() => handleSort(array[index])}
            >
              {dVal.length > 0 ? (
                <div
                  style={{ fontSize: "12px", textAlign: "center" }}
                  title="Customer Prospect"
                >
                  <span>
                    <FaCircle style={{ color: "green" }} />
                    <span>{dVal[2]}</span>
                    <br />
                  </span>
                  <span>
                    <FaCircle style={{ color: "purple" }} />
                    <span>{dVal[4]}</span>
                  </span>
                </div>
              ) : (
                <span
                  className="ellipsistd"
                  style={{ fontSize: "12px" }}
                  title={val[0]}
                >
                  {val[0]}
                </span>
              )}
            </th>
          );
        } else if (objData.id === -1 && unWantedCols.indexOf(key) === -1) {
          objData[key] &&
            tabData.push(
              <th className="fs10" style={{ fontSize: "12px" }}>
                {objData[key]}
              </th>
            );
        } else if (objData.id === 0 && unWantedCols.indexOf(key) === -1) {
          tabData.push(
            <td
              className={objData[key] === "Summary" ? "summary" : "fs10 trLvl0"}
              title={objData[key]}
              style={{
                fontSize: "12px",
                backgroundColor: "",
              }}
            >
              {key.includes("amount") ? (
                <div className="fs10 elipsis">
                  <div
                    style={{ textAlign: "right" }}
                    className="fs10 "
                    title={Math.round(objData[key]).toLocaleString("en-US")}
                  >
                    {/* <span style={{ float: "inline-start" }}>$</span> */}
                    <b> {Math.round(objData[key]).toLocaleString("en-US")}</b>
                  </div>
                </div>
              ) : (
                <b> {objData[key]}</b>
              )}
            </td>
          );
        } else if (objData.id > 0 && unWantedCols.indexOf(key) === -1) {
          // const dealHubId = objData["dhub"];
          const dhubClosedDate = new Date(objData["dhub_closed_date"]);
          const closedDate = new Date(objData["closedDate"]);
          const todayDate = new Date();
          const probability = objData["probability"];
          // const rowStyle =
          //   dhubClosedDate > closedDate && dealHubId === "1"
          //     ? { backgroundColor: "#dc575794" }
          //     : todayDate > closedDate && dealHubId === "1"
          //     ? { backgroundColor: "#dc575794" }
          //     : {};
          const dhubStatusIdColor = objData["dhub_status_id"];
          const newCommentIds = objData["dhub"];
          tabData.push(
            <td>
              {key.includes("customer") ? (
                <div className="fs10 ellipsistd">
                  {objData.isProspect === 1 ? (
                    <FaCircle style={{ color: "purple" }} title="Prospect" />
                  ) : (
                    <FaCircle style={{ color: "green" }} title="Customer" />
                  )}
                  <span
                    style={{ marginLeft: "5px", fontSize: "12px" }}
                    className="fs10 "
                    title={objData[key]}
                  >
                    {objData[key]}
                  </span>
                </div>
              ) : key.includes("amount") ? (
                <div className="" style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "12px",
                    }}
                    className=""
                    title={Math.round(objData[key]).toLocaleString("en-US")}
                  >
                    {/* <span style={{ float: "inline-start" }}>$</span> */}
                    {Math.round(objData[key]).toLocaleString("en-US")}
                  </span>
                </div>
              ) : key.includes("probability") ? (
                <div className="fs10 elipsis">
                  <span
                    style={{ marginLeft: "5px", fontSize: "12px" }}
                    className="fs10 "
                    title={objData[key] + "%"}
                  >
                    {objData[key]}
                    {"%"}
                  </span>
                </div>
              ) : key.includes("closedDate") ? (
                <div className="fs10 elipsis" style={{ textAlign: "center" }}>
                  <span
                    style={{ fontSize: "12px" }}
                    className="fs10 "
                    title={objData[key]}
                  >
                    {objData[key]}
                  </span>
                </div>
              ) : key.includes("dhub") ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  {objData[key] === "1" || objData["probability"] === "100" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "54px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={objData["probability"] !== "100"}
                        className="disabledCheckbox"
                      />
                      <span
                        style={{
                          marginLeft: "5px",
                          fontSize: "12px",
                          marginTop: "-2px",
                          cursor: "pointer",
                        }}
                      >
                        {(objData["probability"] === "100" &&
                          objData["dhub_status_id"] !== "1454") ||
                        (objData["probability"] === "0" &&
                          objData["dhub_status_id"] !== "1500") ||
                        objData["dhub"] === "0" ? (
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
                              setOpportunityName(objData["name"]);
                              setOpportunityId(() => {
                                const newId = objData["opp_id"];
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
                              setCommentId(objData["dhub_id"]);

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
                          setOpportunityName(objData["name"]);
                          setSalesExecutiveId(objData["id"]);
                          setOpportunityId(() => {
                            const newId = objData["opp_id"];
                            return newId;
                          });
                          setVersPopup(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : key.includes("opportunity") ? (
                <div className="col-md-12 ml-1 row">
                  <div
                    className="col-md-9"
                    style={{
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    <a
                      href={`http://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttp%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F${objData["opp_id"]}%252Fview`}
                      target="_blank"
                      rel="noopener noreferrer"
                      objData-toggle="tooltip"
                      title={objData[key]}
                    >
                      {objData[key]}
                    </a>
                  </div>
                  <div className="col-md-3">
                    <i
                      className="cp float-right"
                      title="View SF Docs"
                      style={{ cursor: "pointer", float: "right" }}
                      onClick={() => {
                        setType(objData["opp_id"]);
                        setSalesOppoId(objData["id"]);
                        setOppoName(objData["opportunity"]);
                      }}
                    >
                      <HiDocument
                        style={{ transform: "scale(1.3)" }}
                        className="dhDocIcon"
                      />
                    </i>
                  </div>
                </div>
              ) : (
                <div
                  className="fs10 ellipsistd"
                  style={{ fontSize: "12px" }}
                  title={objData[key]}
                >
                  {objData[key]}
                </div>
              )}
            </td>
          );
        }
      });
      const uniqueKey = `row_${index}`;

      if (
        searchQuery &&
        Object.values(objData).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        rows.push(<tr key={uniqueKey}>{tabData}</tr>);
      } else if (!searchQuery) {
        rows.push(<tr key={uniqueKey}>{tabData}</tr>);
      }
    });

    setTableHeaders(headers);
    setTableRows(rows);
  };

  return (
    <>
      <div className="dealHubHeading ">
        <div className="p-1" style={{ float: "right" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <h2 style={{ marginLeft: "157px" }}>SF Pipeline</h2>
      </div>
      <div
        className="col-lg-12 col-md-12 col-sm-12 no-padding scrollit darkHeader toHead"
        style={{ overflow: "auto", maxHeight: "calc(105vh - 189px)" }}
      >
        <table className="table table-bordered table-striped scrollit sales-opertunity-html-table">
          <thead>
            <tr>{tableHeaders}</tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>

      {salesOppoId && (
        <div className="col-md-12 mt-3">
          <span>
            <span style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
              <b> SF URL -</b>
            </span>{" "}
            https://na87.lightning.force.com/lightning/r/Opportunity/{type}/view
          </span>
        </div>
      )}

      {salesOppoId && (
        <div className="col-md-12 mt-3">
          <span style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
            <b>SF PR Pipeline - {oppoName}</b>
          </span>
        </div>
      )}

      {salesOppoId && (
        <SfPRTable salesOppoId={salesOppoId} reportRunId={rrId} type={type} />
      )}

      {salesOppoId && (
        <div className="col-md-12 mt-2">
          <span style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
            <b>SF Documents - {oppoName}</b>
          </span>
        </div>
      )}
      {versPopup && (
        <DealHubOpportunityPopUp
          versPopup={versPopup}
          setVersPopup={setVersPopup}
          opportunityId={opportunityId}
          setCheckedDhub={setCheckedDhub}
          opportunityName={opportunityName}
          fetchData={fetchData}
          displayTableData={displayTableData}
          dataVar={dataVar}
          rrId={rrId}
          salesExecutiveId={salesExecutiveId}
          handleClick={handleClick}
        />
      )}

      {salesOppoId && <SfDocuments type={type} />}
      {open ? <Loader handleAbort={handleAbort} /> : ""}
      {popUp && (
        <OpenCommentsPopUp
          popUp={popUp}
          setPopUp={setPopUp}
          commentId={commentId}
        />
      )}
    </>
  );
}
export default OpportunityTable;
