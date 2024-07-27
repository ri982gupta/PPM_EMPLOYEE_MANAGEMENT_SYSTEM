import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SoftwareSummary({ softdata }) {
  const [table, settable] = useState([]);

  useEffect(() => {
    const table =
      Object.keys(softdata).length > 0 &&
      softdata.oppRecRev.map((data) => {
        let tableData = [];
        const keysArray = [
          "customer",
          "project",
          "closedamt",
          "upside",
          "calls",
        ];
        const numericals = ["closedamt", "upside", "calls"];
        keysArray.forEach((keys) => {
          tableData.push(
            data.id < 0 ? (
              keys == "project" ? (
                <th
                  key={keys}
                  style={{ textAlign: "center", position: "sticky", top: 0 }}
                >
                  Opportunity
                </th>
              ) : (
                <th
                  key={keys}
                  style={{ textAlign: "center", position: "sticky", top: 0 }}
                >
                  {data[keys]}
                </th>
              )
            ) : keys != "customer" && keys != "project" ? (
              <td
                className="p-0"
                style={{ textAlign: "right", width: "50px" }}
                data-toggle="tooltip"
                title={parseInt(data[keys]).toLocaleString("en-US")}
              >
                {"$" + parseInt(data[keys]).toLocaleString("en-US")}
              </td>
            ) : keys == "project" ? (
              <td
                className="ellipsis"
                data-toggle="tooltip"
                title={data[keys]}
                key={keys}
                style={{ maxWidth: "150px !important" }}
              >
                {/* {numericals.includes(keys) ? "$" + (parseInt(data[keys])).toLocaleString('en-US') :  */}
                <a
                  href="https://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttps%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F0061W00001UtIfyQAF%252Fview"
                  target="_blank"
                  rel="noopener noreferrer"
                  // style={{ textDecoration: "underline" }}
                  data-toggle="tooltip"
                  title={data[keys]}
                >
                  {data[keys]}
                </a>
              </td>
            ) : (
              <td
                className="ellipsis"
                data-toggle="tooltip"
                title={data[keys]}
                key={keys}
              >
                {data[keys]}
              </td>
            )
          );
          // keys == "project" && <td className="" data-toggle="tooltip" title={data[keys]} key={keys} style={{ width: "500px" }}>{(data[keys])}</td>
        });
        return <tr key={data.id}>{tableData}</tr>;
      });
    settable(table);
  }, [softdata]);

  return (
    <div className="col-md-12 darkHeader">
      <h6 className="subHeading">Software</h6>
      <div className="col-md-12 softSummry">
        <table className="table table-bordered serviceTable">
          <thead style={{ fontSize: "13px" }}>{table}</thead>
        </table>
      </div>
    </div>
  );
}
