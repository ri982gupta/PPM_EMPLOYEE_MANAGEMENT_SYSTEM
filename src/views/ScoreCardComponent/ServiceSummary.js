import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleRight, FaCircle } from "react-icons/fa";

export default function ServiceSummary({ softdata }) {
  const [expanded, setexpanded] = useState([]);
  let onclickchanger = "obj";
  const allExecutives = softdata.prjRecRev
    ?.filter((item) => item.lvl == 1)
    .map((item) => item[onclickchanger]);
  let toggler = 0;
  const [table, settable] = useState([]);
  const prosicon = {
    1: <FaCircle style={{ color: "purple" }} />,
    0: <FaCircle style={{ color: "green" }} />,
  };
  const clickExpand = (exec) => {
    if (exec == "Total") {
      setexpanded((prevState) => {
        return prevState.length == allExecutives.length ? [] : allExecutives;
      });
    } else {
      setexpanded((prevState) => {
        return prevState.includes(exec)
          ? prevState.filter((item) => item !== exec)
          : [...prevState, exec];
      });
    }
  };

  useEffect(() => {
    const table =
      Object.keys(softdata).length > 0 &&
      softdata.prjRecRev.map((data) => {
        // console.log(softdata, "----service data")
        let tableData = [];

        const keysArray = [
          "obj",
          "target",
          "revenue",
          "planned",
          "upside",
          "total",
        ];
        const numericals = ["revenue", "planned", "upside", "total"];

        // data.includes("target") && keysArray.push("target")
        // let toggler = (expanded.includes(data[onclickchanger]) && data["lvl"] !== 2) ? 1 : 0;

        toggler =
          data["lvl"] == 2
            ? toggler
            : expanded.includes(data[onclickchanger])
            ? 1
            : 0;

        keysArray.forEach((keys) => {
          // keys == "obj" && console.log("in line 13" + data[keys])
          data[keys] !== undefined &&
            tableData.push(
              data.id < 0 ? (
                data[keys] == "Customer/__iconPrj__Proj/__iconOpt__Oppt" ? (
                  <th
                    key={keys}
                    style={{ textAlign: "center", position: "sticky", top: 0 }}
                  >
                    Customer /<span className="mr-1"> {prosicon[0]}</span> Proj
                    / <span className="mr-1">{prosicon[1]}</span> Oppt
                  </th>
                ) : (
                  // <th key={keys} style={{ textAlign: "center", position: "sticky", top: 0 }}><span>{data[keys].split("__")[0]}</span><span className="mr-1"> {prosicon[0]}</span><span>{data[keys].split("__")[2]}</span> <span className="mr-1">{prosicon[1]}</span><span>{data[keys].split("__")[4]}</span></th> :
                  <th
                    key={keys}
                    style={{ textAlign: "center", position: "sticky", top: 0 }}
                  >
                    {data[keys]}
                  </th>
                )
              ) : // keys == "obj" && data[keys] == null ? <td key={keys}> null </td> :
              keys != "obj" ? (
                <td
                  style={{ textAlign: "right" }}
                  data-toggle="tooltip"
                  title={parseInt(data[keys]).toLocaleString("en-US")}
                >
                  {"$" +
                    (data[keys] !== ""
                      ? parseInt(data[keys]).toLocaleString("en-US")
                      : "0")}
                </td>
              ) : (
                <td
                  className="ellipsis"
                  data-toggle="tooltip"
                  title={data[keys]}
                  key={keys}
                  style={{
                    display: toggler == 0 && data["lvl"] == 2 ? "none" : "",
                  }}
                >
                  {keys == onclickchanger && data["lvl"] < 2 ? (
                    <>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          clickExpand(data[onclickchanger]);
                          console.log("expanded");
                        }}
                      >
                        {expanded.includes(data[onclickchanger]) ||
                        expanded.length == allExecutives.length ? (
                          <FaAngleDown />
                        ) : (
                          <FaAngleRight />
                        )}
                      </span>
                    </>
                  ) : data["project"] != "" || data["project"] != null ? (
                    <span> {prosicon[0]} </span>
                  ) : (
                    ""
                  )}
                  {data[keys]}
                </td>
              )
            );
        });
        return (
          <tr
            key={data.id}
            style={{ display: data["lvl"] == 2 && toggler == 0 ? "none" : "" }}
          >
            {tableData}
          </tr>
        );
      });
    settable(table);
  }, [softdata?.prjRecRev, expanded]);

  return (
    <div className="col-md-12 darkHeader">
      <h6 className="subHeading">Services</h6>
      {/* {console.log(softdata, "-----data in service table")} */}
      <div className="col-md-12 softSummry">
        <table className="table table-bordered serviceTable">
          <thead style={{ fontSize: "13px" }}>{table}</thead>
        </table>
      </div>
    </div>
  );
}
