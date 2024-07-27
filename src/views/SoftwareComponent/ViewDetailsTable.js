import { Fragment, useState } from "react";
import VTP from "./VTP.json";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";

export default function ViewDetailsTable({
  viewDetailsData,
  srchQuat,
  executive,
}) {
  const [expanded, setexpanded] = useState([]);
  const allcust = viewDetailsData
    .filter((item) => item.lvl === 1)
    .map((item) => item.customer);
  const clickExpand = (cust) => {
    if (cust === "Summary") {
      setexpanded((prevState) => {
        return prevState.length === allcust.length ? [] : allcust;
      });
    } else {
      setexpanded((prevState) => {
        return prevState.includes(cust)
          ? prevState.filter((item) => item !== cust)
          : [...prevState, cust];
      });
    }
  };

  let toggler = 0;
  const icons = {
    fte0: (
      <img
        src={fte_inactive}
        alt="(fte_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Employee"
      />
    ),
    fte1: (
      <img
        src={fte_active}
        alt="(fte_active_icon)"
        style={{ height: "12px" }}
        title="Active Employee"
      />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        style={{ height: "12px" }}
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        style={{ height: "12px" }}
        title="Ex-Contractor"
      />
    ),
    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        style={{ height: "12px" }}
        title="Active Contractor"
      />
    ),
    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        style={{ height: "12px" }}
        title="Contractor in notice period"
      />
    ),
  };

  const heads = viewDetailsData.map((data) => {
    const conditions = [
      "lvl",
      "execStatus",
      "customerId",
      "oppId",
      "sfOppId",
      "id",
      "isActive",
      "executive_division",
      "supervisor",
      "isProspect",
      "count",
      "isEdit",
      "isDeleted",
      "keyAttr",
      "parentAttr",
      "add_to_call",
    ];
    const Integersvals = ["oppAmount", "calls", "upside", "closedAmount"];
    const expandableCols = [
      "opportunity",
      "vendor",
      "probability",
      "closeDate",
      "opportunity",
      // "week",
      // "comments",
    ];
    let header = [];
    toggler =
      data["lvl"] === 2 || data["lvl"] === 3
        ? toggler
        : expanded.includes(data.customer)
        ? 1
        : 0;

    for (const keys in data) {
      !conditions.some((el) => keys.includes(el)) &&
        (expanded.length > 0 ? true : !expandableCols.includes(keys)) &&
        header.push(
          data.id < 0 ? (
            <th className={keys + " pipeth wowFirstTh"} key={keys}>
              {data[keys]}
            </th>
          ) : (
            <td
              key={keys}
              style={{
                display:
                  toggler === 0 && (data["lvl"] === 2 || data["lvl"] === 3)
                    ? "none"
                    : "",
              }}
            >
              {Integersvals.includes(keys) ? (
                <Fragment>
                  <span>
                    {data[keys] === " "
                      ? ""
                      : parseInt(data[keys]).toLocaleString("en-US")}
                  </span>
                  &nbsp;
                </Fragment>
              ) : (
                <Fragment>
                  <span
                    onClick={() => {
                      clickExpand(data.customer);
                    }}
                  >
                    {(data["lvl"] === 1 || data["lvl"] === 0) &&
                      keys === "customer" &&
                      (expanded.includes(data.customer) ||
                      (data.customer === "Summary" &&
                        expanded.length === allcust.length) ? (
                        <FaCaretDown
                          style={{ cursor: "pointer" }}
                          title="Collapse all"
                        />
                      ) : (
                        <FaCaretRight
                          style={{ cursor: "pointer" }}
                          title="Expand all"
                        />
                      ))}
                  </span>

                  {keys === "customer" &&
                    (data["lvl"] === 2 || data["lvl"] === 3 ? (
                      data["lvl"] === 2 && (
                        <span>
                          <FaCircle
                            style={{
                              color:
                                data["isProspect"] === 1 ? "purple" : "green",
                            }}
                          />
                          {data[keys].split("^&")[1]}
                        </span>
                      )
                    ) : (
                      <span>
                        {icons[data["execStatus"]]}
                        {data[keys]}
                      </span>
                    ))}
                  {keys !== "customer" && (
                    <span className="linkSty">{data[keys]}</span>
                  )}
                </Fragment>
              )}
            </td>
          )
        );
    }

    return (
      <tr
        className={data.executive == " " ? "pink" : "red wowFirstTh"}
        key={data.id + data.oppId + data.customerId + data.sfOppId}
      >
        {header}
      </tr>
    );
  });

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 customCard">
      Details of SE : {executive == -1 ? "ALL" : executive} for :
      <span>2024-Q2</span>
      {srchQuat.quat}
      <div className="darkHeader">
        <table className="table table-bordered table-striped ">
          <thead>{heads}</thead>
        </table>
      </div>
    </div>
  );
}
