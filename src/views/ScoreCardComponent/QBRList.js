import ScoreCard from "./ScoreCard.json";
import React, { useEffect, useRef, useState, Fragment } from "react";
import DownloadForOfflineRoundedIcon from "@mui/icons-material/DownloadForOfflineRounded";

export default function QBRListData({ qbrList }) {
  const serviceTableData = qbrList.map((data) => {
    const conditions = [
      "customer_id",
      "id",
      "obj_id",
      "id",
      "customer_id",
      "id",
    ];
    let header = [];
    const keysArray = [
      "customer",
      "qbr_date",
      "qbr_presenter",
      "qbr_participants",
      "qbr_cust_participants",
      "qbr_present_date",
      "qbr_notes",
      "file",
    ];

    // let checks= targetReviewsData.serviceTargetsKeyVal
    // const servicekeyArr = checks.split(',');
    //  for (let ia = 0;ia < servicekeyArr.length;ia++) {
    //   let keys = servicekeyArr[ia];

    // for (const keys in data) {
    keysArray.forEach((keys) => {
      // console.log(!data.id.includes(-1) == false)
      data[keys] !== null
        ? !conditions.some((el) => keys.includes(el)) &&
          header.push(
            data.id < 0 ? (
              <th
                className={"serviceth"}
                key={keys}
                style={{ textAlign: "center" }}
                colSpan={data[keys].split("^&")[2]}
                rowSpan={data[keys].split("^&")[1]}
              >
                {data[keys].split("^&")[0]}
              </th>
            ) : (
              // !data.id.includes(-1) == false ? <td>No Data Found</td> :
              <td
                // className={keys.split("_")[0] + " servicetd"}
                // className={keys == "qbr_notes" && "ellipsis"}
                key={keys}
                colSpan={data[keys].split("^&")[2]}
                rowSpan={data[keys].split("^&")[1]}
              >
                {/* {keys !== "name"
                  ?
                  <Fragment>
                    <span>{(parseInt(data[keys])).toLocaleString('en-US')}</span>
                  </Fragment>
                  : */}
                {keys == "file" &&
                (data["file"] != null || data["file"] != "") ? (
                  <div
                    align="center"
                    data-toggle="tooltip"
                    title="Download Document"
                  >
                    <DownloadForOfflineRoundedIcon
                      style={{ color: "#86b558" }}
                    />
                  </div>
                ) : (
                  <Fragment>
                    <span>{data[keys]}</span>
                    {/* <span>{data[keys]}</span> */}
                  </Fragment>
                )}
                {/* } */}
              </td>
            )
          )
        : "";
    });
    return (
      <>
        <tr key={data.id}>{header}</tr>
        {/* <tr><td colSpan={8} align="center">No Data Found</td></tr> */}
      </>
    );
  });

  return (
    <div className="col-md-12  border-box no-padding csattable customCard card graph darkHeader">
      <div className="group-content">
        <div className="col-lg-12 col-md-12 col-sm-12 no-padding ">
          <h6 className="subHeading">Customer QBR List</h6>
        </div>
        <table className="table table-bordered  ">
          <thead style={{ fontSize: "13px" }}>{serviceTableData}</thead>
        </table>
      </div>
    </div>
  );
}
