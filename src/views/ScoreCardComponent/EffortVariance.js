import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ScoreCard.scss";
export default function EffortVariance({ effortvar }) {
  const [table, settable] = useState([]);

  useEffect(() => {
    const table =
      effortvar?.length > 0 &&
      effortvar.map((data) => {
        const conditions = [
          "id",
          "prj_status",
          "ct_term",
          "ct_title",
          "prj_compltn",
          "pln_efforts",
          "eac_efforts",
          "pln_gm",
          "eac_gm",
          "critical_risks",
          "high_risks",
        ];
        let tableData = [];
        const keysArray = [
          "project_name",
          "prj_pm_name",
          "var_efforts",
          "var_gm",
        ];
        let num_gm = Number(data.var_gm);
        let num_effort = Number(data.var_efforts);
        keysArray.forEach((keys) => {
          console.log(typeof data[keys], "-----type of data keys");
          !conditions.includes(keys) &&
            tableData.push(
              data.id < 0 ? (
                <th
                  key={keys}
                  style={{ textAlign: "center", position: "sticky", top: 0 }}
                >
                  {data[keys]}
                </th>
              ) : keys == "project_name" ? (
                <td
                  className="ellipsis"
                  data-toggle="tooltip"
                  style={{ minWidth: "150px" }}
                >
                  <div className=" phTableLegends" style={{ fontSize: "13px" }}>
                    {data.var_gm <= 5 && data.var_efforts <= 5 ? (
                      <div className="legendContainer align left">
                        <div className="legend green">
                          <div className="legendCircle" title="Risk"></div>
                          <div className="legendTxt"></div>
                        </div>
                      </div>
                    ) : data.var_gm >= 10 || data.var_efforts >= 10 ? (
                      <div className="legendContainer align left">
                        <div className="legend red">
                          <div className="legendCircle" title="Risk"></div>
                          <div className="legendTxt"></div>
                        </div>
                      </div>
                    ) : (
                      <div className="legendContainer align left">
                        <div className="legend amber">
                          <div className="legendCircle" title="Risk"></div>
                          <div className="legendTxt"></div>
                        </div>
                      </div>
                    )}
                    <Link
                      style={{
                        whiteSpace: "nowrap !important",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      data-toggle="tooltip"
                      title={data[keys]}
                      to={`/project/Overview/:${data.id}`}
                      target="_blank"
                    >
                      {data[keys]}
                    </Link>
                  </div>
                </td>
              ) : keys == "var_efforts" ? (
                <td style={{ fontSize: "13px" }}>
                  {data.var_efforts <= 5 ? (
                    <div style={{ color: "green", textAlign: "right" }}>
                      {num_effort.toFixed(2)}
                    </div>
                  ) : data.var_efforts >= 10 ? (
                    <div style={{ color: "red", textAlign: "right" }}>
                      {num_effort.toFixed(2)}
                    </div>
                  ) : (
                    <div style={{ color: "#ffbf00", textAlign: "right" }}>
                      {num_effort.toFixed(2)}
                    </div>
                  )}
                </td>
              ) : keys == "var_gm" ? (
                <td>
                  {data.var_gm <= 5 ? (
                    <div
                      className="mr-1"
                      style={{ color: "green", textAlign: "right" }}
                    >
                      {num_gm.toFixed(2)}
                      {console.log(typeof Number(data.var_gm), "#####type")}
                    </div>
                  ) : data.var_gm >= 10 ? (
                    <div style={{ color: "red", textAlign: "right" }}>
                      {num_gm.toFixed(2)}
                    </div>
                  ) : (
                    <div style={{ color: "#ffbf00", textAlign: "right" }}>
                      {num_gm.toFixed(2)}
                    </div>
                  )}
                </td>
              ) : (
                <td
                  key={keys}
                  className="ellipsis"
                  data-toggle="tooltip"
                  style={{ minWidth: "120px" }}
                  title={data[keys]}
                >
                  {data[keys]}
                </td>
              )
            );
        });
        return (
          <tr key={data.id} style={{ fontSize: "13px" }}>
            {tableData}
          </tr>
        );
      });
    settable(table);
  }, [effortvar]);

  return (
    <div className="col-md-12  customCard card graph darkHeader">
      <div className="group-content row">
        <div className="legendContainer">
          <span className="font-weight-bold">Efforts/GM Variance :</span>
          <div className="legend green">
            <div className="legendTxt t">10 or Above 10</div>
          </div>
          <div className="legend amber">
            <div className="legendTxt t">Btw 5 and 10 </div>
          </div>
          <div className="legend red">
            <div className="legendTxt t">5 or below 5</div>
          </div>
          <div className="legendContainer">
            <span className="font-weight-bold">Risk :</span>

            <div className="legend red">
              <div className="legendCircle "></div>
              <div className="legendTxt">Critical above 1 or High above 5</div>
            </div>
            <div className="legend amber">
              <div className="legendCircle"></div>
              <div className="legendTxt">2-5 High or 1 Critical </div>
            </div>
            <div className="legend green">
              <div className="legendCircle "></div>
              <div className="legendTxt">No Critical and High below 2 </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="col-8 pl-2 pr-2 darkHeader"
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        <table className="table table-bordered softSummry csattable">
          <thead style={{ fontSize: "13px" }}>{table}</thead>
        </table>
      </div>
    </div>
  );
}
