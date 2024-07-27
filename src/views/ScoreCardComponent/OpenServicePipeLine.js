import { element } from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { AiFillDownCircle } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa";

function OpenServicePipeLine(props) {
  const { openOpptys } = props;
  const displayTableData = useRef([]);
  const [dispData, setDispData] = useState(null);

  useEffect(() => {
    displayTableData.current.push(
      <th style={{ textAlign: "center", fontSize: "13px" }}>Sales Executive</th>
    );
    filterSubHeading();
  }, []);

  const handleDisplaySubData = (e, d) => {
    let clsNm = d.lvl + 1 + "_" + d.sales_executive;
    let elements = document.getElementsByClassName(clsNm);
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].classList.contains("displayRow")) {
        elements[i].classList.remove("displayRow");
      } else {
        elements[i].classList.add("displayRow");
      }
    }
  };

  const filterSubHeading = async () => {
    let subHeader = [];
    let openOpptysTmp = [];
    openOpptys.map((d, index) => {
      if (d.id == -1) {
      } else if (
        d.lvl == 1 &&
        (openOpptys[index - 1].lvl == 0 || openOpptys[index - 1].lvl == 2)
      ) {
        openOpptysTmp.push(d);
        openOpptysTmp.push(openOpptys[0]);
      } else {
        openOpptysTmp.push(d);
      }
    });

    setDispData(() => {
      let headerTitles = [
        "sales_executive",
        "oppt_name",
        "resource_amount",
        "oppt_prob",
      ];
      let subHeaderTitles = [
        "Customer",
        "Opportunity",
        "Practice",
        "R. Type",
        "R. Amount",
        "Oppt Amount",
        "Close Date",
        "Prob%",
        "Stage",
        "Next Step",
      ];
      let subHeaderTitlesKeys = [];
      return openOpptysTmp.map((d, index) => {
        let tdData = [];
        if (d.lvl == 1) {
          headerTitles.forEach((element, headerIndex) => {
            console.log(element, "***************");
            let val = d[element].includes("^&")
              ? d[element].split("^&")
              : d[element];
            tdData.push(
              <td
                style={{ textAlign: d[element].includes("^&") && "right" }}
                colSpan={element == "sales_executive" ? 4 : 3}
              >
                {d[element].includes("^&") ? (
                  "$" + parseInt(val[0]).toLocaleString("en-US") + " " + val[1]
                ) : (
                  <span>
                    <span className="mr-1">
                      <FaCaretDown />
                    </span>
                    {val}
                  </span>
                )}
              </td>
            );
          });
        } else if (d.lvl == 2) {
          subHeaderTitlesKeys.forEach((element, subDataIndex) => {
            tdData.push(
              <td
                className={
                  element == "customer"
                    ? "customer"
                    : element == "oppt_name"
                    ? "oppt"
                    : ""
                }
                data-toggle="tooltip"
                title={d[element]}
                colSpan={element == "oppt_closed_dt" ? 2 : ""}
                style={{
                  textAlign:
                    (element == "resource_amount" ||
                      element == "oppt_amount" ||
                      element == "oppt_prob") &&
                    "right",
                }}
              >
                {element == "resource_amount" || element == "oppt_amount"
                  ? "$" + parseInt(d[element]).toLocaleString("en-US")
                  : d[element]}
              </td>
              // <td colSpan={element == "oppt_closed_dt" ? 2 : ""}>{d[element]}</td>
            );
          });
        } else if (d.lvl == 0) {
          subHeaderTitles.forEach((element, subHeaderIndex) => {
            tdData.push(
              <th
                style={{ textAlign: "center", fontSize: "13px" }}
                colSpan={element == "Close Date" ? 2 : ""}
              >
                {element}
              </th>
            );
            if (index < 2) {
              subHeaderTitlesKeys.push(
                Object.keys(d).find((key) => d[key] == element)
              );
            }
          });
        }
        return (
          <tr
            key={d.lvl}
            onClick={(e) => {
              handleDisplaySubData(e, d);
            }}
            className={` ${d.lvl == 1 ? "trLvl0" : ""} ${
              d.lvl == 0
                ? "displayRow  " +
                  openOpptysTmp[index + 1].lvl +
                  "_" +
                  openOpptysTmp[index + 1].sales_executive
                : d.lvl == 2
                ? "displayRow " + d.lvl + "_" + d.sales_executive
                : ""
            } `}
          >
            {tdData}
          </tr>
        );
      });
    });
  };

  return (
    <div className="mt-2 col-md-12 no-padding customCard card graph darkHeader">
      <div className="group-content row">
        <h6 className="subHeading">Open Service Pipeline</h6>
      </div>
      <div className="pl-2 pr-2">
        {dispData != null ? (
          <table style={{ width: "100%" }} className="table table-bordered ">
            <thead style={{ fontSize: "13px" }}>
              <tr style={{ width: "100%" }}>
                <th
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    fontSize: "13px",
                    minWidth: "300px",
                  }}
                >
                  Sales Executive
                </th>
                <th
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    fontSize: "13px",
                    minWidth: "300px",
                  }}
                >
                  High
                </th>
                <th
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    fontSize: "13px",
                    minWidth: "300px",
                  }}
                >
                  Medium
                </th>
                <th
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    fontSize: "13px",
                    minWidth: "300px",
                  }}
                >
                  Others
                </th>
              </tr>
              {dispData}
            </thead>
          </table>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default OpenServicePipeLine;
