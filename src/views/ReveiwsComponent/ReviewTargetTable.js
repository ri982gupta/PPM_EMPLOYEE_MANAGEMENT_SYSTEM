import React, { useState, useRef } from "react";
import ReviewsData from "./ReviewsData.json";
import axios from "axios";
import { Fragment } from "react";
import { FiChevronRight } from "react-icons/fi";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { FaInfoCircle } from "react-icons/fa";
import ServicematerialCollapse from "./ServicematerialCollapse";
import { environment } from "../../environments/environment";
import { textAlign } from "@mui/system";
import "./ReviewTargetTable.scss";
import ReviewsPopover from "./ReviewsPopover";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";

const ReviewTargetTable = ({ targetReviewsData }) => {
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [show, setShow] = React.useState("0");
  const [qYear, setYear] = useState();
  const [type1, setType] = useState("mdTable");
  const [details, setDetails] = useState([]);

  const [heading, setheading] = useState("");
  var nf = new Intl.NumberFormat();
  const [anchorEl, setAnchorEl] = useState(null);

  const [popOverText, setPopOverText] = useState("");
  const handleClose = () => {
    setAnchorEl(false);
  };
  const icons = {
    fte0: (
      <img src={fte_inactive} alt="(fte_inactive_icon)" title="Ex-Employee" />
    ),
    fte1: (
      <img src={fte_active} alt="(fte_active_icon)" title="Active Employee" />
    ),
    fte2: (
      <img
        src={fte_notice}
        alt="(fte_notice_icon)"
        title="Employee in notice period"
      />
    ),
    subk0: (
      <img
        src={subk_inactive}
        alt="(subk_inactive_icon)"
        title="Ex-Contractor"
      />
    ),
    subk1: (
      <img
        src={subk_active}
        alt="(subk_active_icon)"
        title="Active Contractor"
      />
    ),
    subk2: (
      <img
        src={subk_notice}
        alt="(subk_notice_icon)"
        title="Contractor in notice period"
      />
    ),
  };
  // ----------------Method start-------------------------

  const expCollapse = (event) => {
    setShow(!show);
    displayRowExpand(event);
  };

  const servicessigning = (type, date, isPrRequired, index, typ) => {
    if (typ == "smTable") {
      if (index <= 0) {
        return;
      }
    } else if (typ == "mdTable") {
      if (index > 0 && index < 5) {
        return;
      }
    }

    let year = date?.split("_")[0];

    const quart = date?.split("_")[1];
    year =
      quart === "Q4"
        ? year + "-01-01"
        : quart === "Q1"
        ? year - 1 + "-04-01"
        : quart === "Q2"
        ? year - 1 + "-07-01"
        : quart === "Q3"
        ? year - 1 + "-10-01"
        : "" + "total";
    setYear(year);

    axios({
      method: "post",
      url: baseUrl + `/SalesMS/reviews/getReviewsPipeLineData`,
      data: {
        year: year,
        type: type,
        reportRunId: targetReviewsData.reportRunId,
        isPrRequired: isPrRequired,
      },
    }).then((res) => {
      let detail = res.data;
      let cols = res.data.columns?.replaceAll("'", "").split(",");

      for (let i = 0; i < detail.tableData.length; i++) {
        if (detail.tableData[i]["lvl"] > 1) {
          {
            detail.tableData[i]["executive"] =
              detail.tableData[i]["opportunity"];
          }
        }
      }

      setTableData(detail);
      setVisible(true);
    });
  };

  // ----------------Method end-------------------------

  const signingsTableData = targetReviewsData.signingsTargets.map(
    (data, index) => {
      const conditions = ["helpText", "id"];
      let header = [];
      let checks = targetReviewsData.signingsTargetsKeyVal;
      const singingkeyArr = checks.split(",");
      for (let ia = 0; ia < singingkeyArr.length; ia++) {
        let keys = singingkeyArr[ia];
        data[keys] !== null &&
          !conditions.some((el) => keys.includes(el)) &&
          header.push(
            data.id < 0 ? (
              <th className={"signtd"} key={keys}>
                <span>{data[keys].split("^&")[0]}</span>
              </th>
            ) : (
              <td className={
                keys.includes("Q")
                ? keys.split("_")[1][1] % 2 == 0
                  ? "even"
                  : "odd"
                :
                keys.split("_")[0] + " signth"}
               key={keys}>
                {keys !== "name" && data[keys] != 0 ? (
                  <Fragment>
                    {data.id !== 1 && data.id !== 8 ? (
                      <a
                        title={nf.format(data[keys])}
                        onClick={() => {
                          let quarter =
                            targetReviewsData.signingsTargets[0][
                              singingkeyArr[ia]
                            ];
                          let name =
                            targetReviewsData.signingsTargets[index]["name"];

                          let helpText =
                            targetReviewsData.signingsTargets[index][
                              "helpText"
                            ];

                          setheading(
                            quarter.split("^")[0] +
                              " " +
                              name +
                              " " +
                              "(" +
                              helpText +
                              ")"
                          );
                          setType("smTable");
                          servicessigning(data?.id, keys, 0, index, "smTable");
                        }}
                      >
                        {nf.format(data[keys])}
                      </a>
                    ) : (
                      <span title={nf.format(data[keys])}>
                        {nf.format(data[keys])}
                      </span>
                    )}
                  </Fragment>
                ) : (
                  <Fragment>
                    <span title={data[keys]}>{data[keys]}</span>
                    {keys == "name" && data[keys] !== "SE/SE Team^&1^&1" ? (
                      <FaInfoCircle
                        className="tableInfoIcon "
                        onClick={(e) => {
                          setPopOverText(data.helpText);
                          setAnchorEl(e.currentTarget);
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </Fragment>
                )}
              </td>
            )
          );
      }
      return <tr key={data.id}>{header}</tr>;
    }
  );

  // for  Services Revenue Recognition
  const serviceData = targetReviewsData.serviceTargets;

  const serviceTableData = serviceData.map((data, index) => {
    const conditions = ["helpText", "id"];
    let header = [];

    let checks = targetReviewsData.serviceTargetsKeyVal;
    const servicekeyArr = checks.split(",");
    for (let ia = 0; ia < servicekeyArr.length; ia++) {
      let keys = servicekeyArr[ia];

      data[keys] !== null &&
        !conditions.some((el) => keys.includes(el)) &&
        header.push(
          data.id < 0 ? (
            <th className={"serviceth"} key={keys}>
              {data[keys].split("^&")[0]}
            </th>
          ) : (
            <td 
              className={
                keys.includes("Q")
                ? keys.split("_")[1][1] % 2 == 0
                  ? "even"
                  : "odd"
                : keys.split("_")[0] + " servicetd"} 
              key={keys}>
              {keys !== "name" && data[keys] != 0 ? (
                <Fragment>
                  {data.id !== 1 &&
                  data.id !== 3 &&
                  data.id !== 4 &&
                  data.id !== 5 &&
                  data.id !== 12 ? (
                    <a
                      title={nf.format(data[keys])}
                      onClick={() => {
                        setType("mdTable");
                        servicessigning(data?.id, keys, 1, index, "mdTable");
                      }}
                    >
                      {nf.format(data[keys])}
                    </a>
                  ) : (
                    <span>{nf.format(data[keys])}</span>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  <span title={data[keys]}>{data[keys]}</span>
                  {keys == "name" &&
                  data[keys] !== "SE/SE Team^&1^&1" &&
                  data[keys] != 0 ? (
                    <FaInfoCircle
                      className="tableInfoIcon "
                      onClick={(e) => {
                        setPopOverText(data.helpText);
                        setAnchorEl(e.currentTarget);
                      }}
                    />
                  ) : (
                    ""
                  )}
                </Fragment>
              )}
            </td>
          )
        );
    }
    return <tr key={data.id}>{header}</tr>;
  });

  // for  Software [Targets vs Actuals]

  const ref = useRef([]);

  const displayRowExpand = (index) => {
    let diplayableRows = [];

    let i = index + 1;
    while (true) {
      if (ref.current[i].attributes.level.nodeValue == 1) {
        return;
      }
      if (ref.current[i].classList.contains("displayNone")) {
        ref.current[i].classList.remove("displayNone");
      } else {
        ref.current[i].classList.add("displayNone");
      }
      i = i + 1;
    }
  };

  const softwareData = targetReviewsData.swTargets;

  const softwareTableData = softwareData.map((data, index) => {
    const conditions = ["helpText", "id", "targetCatId", "lvl"];
    let header = [];
    let checks = targetReviewsData.swTargetsKeyVal;
    const softwarekeyArr = checks.split(",");
    for (let ia = 0; ia < softwarekeyArr.length; ia++) {
      let keys = softwarekeyArr[ia];
      // for (const keys in data) {
      data[keys] !== null &&
        !conditions.some((el) => keys.includes(el)) &&
        header.push(
          data.id < 0 ? (
            <th className={"pipeth"} key={keys}>
              {data[keys].split("^&")[0]}
            </th>
          ) : (
            <td 
            className={
              keys.includes("Q")
              ? keys.split("_")[1][1] % 2 == 0
                ? "even"
                : "odd"
              : ""} 
            key={keys} lvl={data["lvl"]} sort={ia}>
              <Fragment>
                {data.lvl === "1" &&
                  (data[keys] === "Closed Amount" ||
                  data[keys] === "Unclosed Calls" ||
                  data[keys] === "Upside" ||
                  data[keys] === "Other Pipeline" ? (
                    <FiChevronRight
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        expCollapse(index);
                      }}
                    />
                  ) : (
                    ""
                  ))}
                {keys !== "name" ? (
                  <Fragment>
                    <span title={nf.format(data[keys])}>
                      {nf.format(data[keys])}
                    </span>
                  </Fragment>
                ) : (
                  ""
                )}
                {keys == "name" && data.lvl !== "1" ? (
                  <Fragment>
                    <span className="ml-3" title={data[keys].split(";")[3]}>
                      {data[keys].split(";")[3]}
                    </span>
                  </Fragment>
                ) : keys == "name" && data.lvl === "1" ? (
                  <Fragment>
                    <span title={data[keys]}>{data[keys]}</span>
                  </Fragment>
                ) : (
                  ""
                )}
                {keys == "name" && data[keys] !== "SE/SE Team^&1^&1" ? (
                  <FaInfoCircle
                    className="tableInfoIcon "
                    onClick={(e) => {
                      setPopOverText(data.helpText);
                      setAnchorEl(e.currentTarget);
                    }}
                  />
                ) : (
                  ""
                )}
              </Fragment>
            </td>
          )
        );
    }
    return (
      <tr
        key={data.id}
        id={data.id}
        ref={(ele) => {
          ref.current[index] = ele;
        }}
        className={`${data["lvl"] > 1 && "displayNone"}`}
        level={data.lvl}
      >
        {header}
      </tr>
    );
  });

  // for  Software Details By Owner
  const swTargetsByOwnerData = targetReviewsData.swTargetsByOwner;

  const swTargetsByOwnerTableData = swTargetsByOwnerData
    .filter((x) => x.id !== -4)
    .filter((x) => x.id !== -5)
    .map((data) => {
      const conditions = [
        "helpText",
        "id",
        "isActive",
        "lvl",
        "execStatus",
        "targetcatId",
      ];
      let header = [];
      let checks = targetReviewsData.swTargetsByOwnerKeyVal;
      const swTargetkeyArr = checks.split(",");
      for (let ia = 0; ia < swTargetkeyArr.length; ia++) {
        let keys = swTargetkeyArr[ia];
        data[keys] !== null &&
          !conditions.includes(keys) &&
          header.push(
            data.id < 0 ? (
              <th
                className={"signtd"}
                key={keys}
                colSpan={data[keys].split("^&")[2]}
                rowSpan={data[keys].split("^&")[1]}
                title={data[keys].split("^&")[0]}
              >
                {/*  last table col spacing */}
                <div>{data[keys].split("^&")[0]}</div>
              </th>
            ) : (
              <td
                className={
                  keys.includes("Q")
                    ? keys.split("_")[1][1] % 2 == 0
                      ? "even"
                      : "odd"
                    : keys.includes("total")
                    ? "total"
                    :""
                }
                title={nf.format(data[keys])}
                key={keys}
              >
                {keys !== "name" ? (
                  <Fragment>
                    <span title={data[keys]}>{nf.format(data[keys])}</span>
                  </Fragment>
                ) : (
                  <Fragment>
                    <span className="imgTxt" title={data[keys].split("^&")[0]}>
                      {icons[data["execStatus"]]} {data[keys].split("^&")[0]}
                    </span>
                  </Fragment>
                )}
              </td>
            )
          );
      }
      return <tr key={data.id}>{header}</tr>;
    });

  const exportExcel = () => {
    let desiredColumnOrder = [];
    let cols = [];
    cols = targetReviewsData.swTargetsByOwnerKeyVal.replaceAll("'", "");
    desiredColumnOrder = cols.split(",");
    const wantedValues = targetReviewsData.swTargetsByOwner.map((item) => {
      const obj = {};
      desiredColumnOrder.forEach((col) => {
        if (
          col !== "isActive" &&
          col !== "id" &&
          col !== "helpText" &&
          col !== "lvl" && 
          col !== "execStatus" &&
          col !== "targetCatId"
        ) {
          const value = item[col];
          if (typeof value === "string") {
            const [extractedValue, ,] = value.split("^&"); 
            obj[col] = extractedValue; 
          } else {
            obj[col] = value;
          }
        }
      });
      return obj;
    });

    const rows = wantedValues.map((item) => {
      const row = [];
      desiredColumnOrder.forEach((col) => {
        if (
          col !== "isActive" &&
          col !== "id" &&
          col !== "helpText" &&
          col !== "lvl" && 
          col !== "execStatus" &&
          col !== "targetCatId"
        ) {
          row.push(item[col]);
        }
      });
      return row;
    });

    const workbook = new ExcelJS.Workbook(); // Create a new ExcelJS workbook
    const worksheet = workbook.addWorksheet("Data"); // Add a worksheet

    // Add data rows
    wantedValues.slice(1).forEach((item) => {
      const row = worksheet.addRow(Object.values(item));
    });

    const boldRow = [1, 2];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });
    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "Target Reviews.xlsx");
    });
  };

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 darkHeader customCard">
      <div className="row">
        <div className="col-6 no-padding tagetTableFirst ">
          <p className="strongTxt">Services Signings [Targets vs Actuals]</p>
          <table className="table table-bordered table-striped htmlTable signingsFirstTable">
            <thead>{signingsTableData}</thead>
          </table>
          <p className="strongTxt">
            Services Revenue Recognition [Targets vs Actuals]
          </p>
          <table className="table table-bordered table-striped htmlTable servicesTable">
            <thead>{serviceTableData}</thead>
          </table>
          <p className="strongTxt">Software [Targets vs Actuals]</p>
          <table className="table table-bordered table-striped htmlTable softwareTable">
            <thead>{softwareTableData}</thead>
          </table>
        </div>
        <div className="col-6 ">
          {visible && (
            <>
              <div>
                <p className="strongTxt">Services {heading} </p>
              </div>
              <ServicematerialCollapse
                data={tableData}
                expandedCols={[]}
                colExpandState={[]}
              />
            </>
          )}
        </div>
        <div className="col-12 no-padding  ">
          <div className="col-12 row pr-0 mr-0">
            <div className="col-11 ">
              <p className="strongTxt">Software Details By Owner</p>
            </div>
            <div className="col-1 pr-0 mr-0" align="right">
              <RiFileExcel2Line
                size="1.5em"
                title="Export to Excel"
                style={{ color: "green" }}
                cursor="pointer"
                onClick={exportExcel}
              />
            </div>
          </div>
          <div className="swTargetTable">
            <table className="table table-bordered table-striped htmlTable">
              <thead>{swTargetsByOwnerTableData}</thead>
            </table>
          </div>
        </div>

        {anchorEl && (
          <ReviewsPopover
            anchorEl={anchorEl}
            handleClose={handleClose}
            popOverText={popOverText}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewTargetTable;
