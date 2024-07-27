import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Csat({ scoreCardData }) {
  const [table, settable] = useState([]);

  useEffect(() => {
    const table1 =
      Object.keys(scoreCardData).length > 0 &&
      scoreCardData.map((data) => {
        let tableData = [];
        const keysArray = [
          "customer",
          "customer_email",
          "project",
          "project_mgr",
          "csat_month_dt",
          "csat_initiated_dt",
          "proj_st_dt",
          "proj_end_dt",
          "status",
          "survey_res",
        ];
        keysArray.forEach((keys) => {
          tableData.push(
            data.id < 0 ? (
              <th key={keys} style={{ textAlign: "center", fontSize: "13px" }}>
                {data[keys]}
              </th>
            ) : keys == "project" ? (
              <td className="ellipsis" data-toggle="tooltip">
                <Link
                  data-toggle="tooltip"
                  title={data[keys]}
                  to={`/project/Overview/:${data.obj_id}`}
                  target="_blank"
                >
                  {data[keys]}
                </Link>
              </td>
            ) : (
              <td
                key={keys}
                className="ellipsis"
                data-toggle="tooltip"
                style={{
                  fontSize: "13px",
                  textAlign: keys === "survey_res" ? "right" : "left",
                }}
                title={data[keys]}
              >
                {data[keys]}
              </td>
            )
          );
        });
        return <tr key={data.id}>{tableData}</tr>;
      });
    settable(table1);
  }, [scoreCardData]);

  return (
    <div className="col-md-12  customCard card graph darkHeader">
      <div className="group-content row">
        <h6 className="subHeading">Customer CSAT Project List</h6>
      </div>
      <div
        className="col-12 pl-2 pr-2"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        <table className="table table-bordered csattable ">
          <thead>{table}</thead>
        </table>
      </div>
    </div>
  );
}
