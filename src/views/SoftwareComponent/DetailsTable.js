import { Fragment, useState } from "react";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import {
  FaAngleRight,
  FaCaretDown,
  FaCaretRight,
  FaDochub,
} from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import React from "react";
import { RiDeleteBin5Fill, RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import DocumentTable from "./DocumentTable";
import { MdDescription } from "react-icons/md";
import { useRef } from "react";
import Loader from "../Loader/Loader";
import axios from "axios";
import { environment } from "../../environments/environment";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function ViewDetailsTable({
  viewDetailsData,
  srchQuat,
  executive,
  SalesExecutive,
  filterExectiveName,
  filtertrue,
  getviewDetailsData,
  setCust,
  cust,
}) {
  const allcust = viewDetailsData
    .filter((item) => item.lvl === 1)
    .map((item) => item.customer);

  const expandData = useSelector((state) => state.selectedSEState.actionData);
  useEffect(() => {
    const data = cust?.[0];
    setexpanded([data]);
  }, [cust]);

  const [expanded, setexpanded] = useState([]);
  const prosicon = {
    1: <FaCircle style={{ color: "#9567c2" }} />,
    0: <FaCircle style={{ color: "#539a71" }} />,
  };

  const FilterName = filterExectiveName[0]?.label;
  const [docId, setDocId] = useState([]);
  const baseUrl = environment.baseUrl;
  const [open, setOpen] = useState(false);
  const [oppoName, setOppoName] = useState("");

  const [sfDocs, setSfDocs] = useState([]);
  const [docDisplay, setDocDisplay] = useState(false);
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setOpen(false);
  };
  const getSfDocuments = (id) => {
    const loaderTime = setTimeout(() => {
      setOpen(true);
    }, 2000);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/SalesMS/sales/getSFOppDocs`,
      data: {
        oppId: id,
      },
    }).then((resp) => {
      const data = resp.data;
      setSfDocs(data.data);
      setDocDisplay(true);
      setOpen(false);
      clearTimeout(loaderTime);
      window.scrollTo({ top: 1500, behavior: "smooth" });
    });
  };

  const deleteOpportunity = (id) => {
    setOpen(false);
    axios({
      method: "delete",
      url: baseUrl + `/SalesMS/software/deleteOpportunity?id=${id}`,
    }).then((resp) => {
      getviewDetailsData();
      setOpen(false);
    });
  };

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
    const Integersvals = ["upside", "oppAmount", "calls", "closedAmount"];
    const exexitives = ["executive"];
    const expandableCols = [
      "opportunity",
      "vendor",
      "probability",
      "closeDate",
      "week",
      "comments",
    ];
    const expandOpp = ["opportunity"];
    let header = [];

    toggler =
      data["lvl"] === 2 || data["lvl"] === 3
        ? toggler
        : expanded?.includes(data.customer)
        ? 1
        : 0;
    for (const keys in data) {
      !conditions?.includes(keys) &&
        (expanded?.length > 0 ? true : !expandableCols?.includes(keys)) &&
        header.push(
          data.id < 0 ? (
            <th
              className={keys + " pipeth "}
              key={keys}
              style={{ textAlign: keys === "opportunity" ? "center" : "" }}
            >
              {data[keys] ===
              "Sales Executive /<br>__iconCust__ Customer __iconProsp__ Prospect" ? (
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <span
                    title={`${data[keys].split("/")[0]}/ ${
                      data[keys].split("_")[4]
                    } ${data[keys].split("_")[8]}`}
                  >
                    {data[keys].split("/")[0]}
                  </span>{" "}
                  /
                  <FaCircle
                    style={{
                      color: "#539a71",
                    }}
                  />
                  {data[keys].split("_")[4]}
                  <FaCircle
                    style={{ color: "#9567c2", marginLeft: "5px" }}
                  />{" "}
                  {data[keys].split("_")[8]}
                </div>
              ) : (
                ""
              )}

              {Integersvals.includes(keys) ? (
                <React.Fragment>
                  <div
                    title={
                      data[keys] === "Amount ($)"
                        ? "Pipeline ($)"
                        : data[keys] === "Closed Amt ($)"
                        ? "Closed ($)"
                        : data[keys].split("/")[0]
                    }
                  >
                    {data[keys] === "Amount ($)"
                      ? "Pipeline ($)"
                      : data[keys] === "Closed Amt ($)"
                      ? "Closed ($)"
                      : data[keys].split("/")[0]}
                  </div>
                  {data[keys].split("_")[4]}
                  {data[keys].split("_")[8]}
                </React.Fragment>
              ) : (
                ""
              )}
              {expandOpp.includes(keys) ? (
                <Fragment>
                  {keys === "opportunity" ? (
                    <div title={`${data[keys].split("<br>")[0]} Add to Call`}>
                      {data[keys].split("<br>")[0]}
                      <br />
                      <FaCircle style={{ color: "#539a71" }} /> Add to Call
                    </div>
                  ) : (
                    <div title={data[keys]}>{data[keys]}</div>
                  )}
                </Fragment>
              ) : (
                ""
              )}

              {expandableCols.includes(keys) && keys !== "opportunity" ? (
                <Fragment>
                  <div title={data[keys]}>{data[keys]}</div>
                </Fragment>
              ) : (
                ""
              )}
            </th>
          ) : (
            <td
              key={keys}
              style={{
                display:
                  toggler === 0 && (data["lvl"] === 2 || data["lvl"] === 3)
                    ? "none"
                    : "",
                textAlign:
                  keys === "calls" ||
                  keys === "closedAmount" ||
                  keys === "gap" ||
                  keys === "oppAmount" ||
                  keys === "target" ||
                  keys === "upside" ||
                  keys === "probability"
                    ? "end"
                    : "",
              }}
              title={data[keys]}
            >
              {Integersvals.includes(keys) ? (
                <Fragment>
                  <span
                    title={parseInt(data[keys]).toLocaleString("en-US")}
                    style={{ textAlign: "end" }}
                  >
                    {data[keys] === " "
                      ? data[keys]
                      : parseInt(data[keys]).toLocaleString("en-US") === "NaN"
                      ? " "
                      : parseInt(data[keys]).toLocaleString("en-US")}
                  </span>
                  &nbsp;
                </Fragment>
              ) : (
                <Fragment>
                  <span
                    onClick={() => {
                      clickExpand(data?.customer);
                    }}
                  >
                    {(data["lvl"] === 1 || data["lvl"] === 0) &&
                      keys === "customer" &&
                      (expanded?.includes(data.customer) ||
                      (data.customer === "Summary" &&
                        expanded?.length === allcust?.length) ? (
                        <FaCaretDown
                          FaCaretDown
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
                  {data[keys] ===
                  "__iconCust__ Customer __iconProsp__ Prospect" ? (
                    <React.Fragment>
                      <FaCircle
                        style={{ color: "#539a71", marginTop: "-2px" }}
                      />
                      {data[keys].split("_")[4]}
                      <FaCircle
                        style={{ color: "#9567c2", marginTop: "-2px" }}
                      />{" "}
                      {data[keys].split("_")[8]}
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                  {keys === "customer" &&
                    (data["lvl"] === 2 || data["lvl"] === 3 ? (
                      data["lvl"] === 2 && (
                        <span
                          style={{ paddingLeft: "20px", fontWeight: "100" }}
                        >
                          <FaCircle
                            style={{
                              color:
                                data["isProspect"] === 1 ? "#9567c2" : "green",
                            }}
                          />
                          &nbsp;
                          {data[keys].split("^&")[1]}
                        </span>
                      )
                    ) : (
                      <span style={{ textAlign: "end" }}>
                        {icons[data["execStatus"]]} &nbsp;
                        {data[keys]}
                      </span>
                    ))}
                </Fragment>
              )}
              {expandableCols.includes(keys) && keys !== "opportunity" ? (
                <Fragment>
                  {keys === "probability" && data["lvl"] == 3
                    ? `${data[keys]} %`
                    : data[keys]}
                </Fragment>
              ) : (
                " "
              )}
              {expandOpp.includes(keys) ? (
                <Fragment>
                  {data["opportunity"] === " " ? (
                    <span></span>
                  ) : (
                    <span>
                      {data["add_to_call"] === "1" &&
                      data["isProspect"] !== "1" ? (
                        <FaCircle
                          style={{
                            color: data["isProspect"] === "1" ? "" : "green",
                          }}
                        />
                      ) : (
                        ""
                      )}
                      &nbsp;
                      <a
                        href={`http://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttp%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F${data["sfOppId"]}%252Fview`}
                        target="_blank"
                        title={data[keys]}
                      >
                        {data[keys]}
                      </a>
                      <i
                        className="cp float-right"
                        title="View SF Docs"
                        style={{
                          cursor: "pointer",
                          float: "right",
                        }}
                        onClick={() => {
                          getSfDocuments(data.sfOppId);
                          setDocId(data?.sfOppId);
                          setOppoName(data.opportunity);
                        }}
                      >
                        <MdDescription />
                      </i>
                      <i
                        title="Delete opportunity"
                        onClick={() => {
                          deleteOpportunity(data.oppId);
                        }}
                      >
                        {data["isDeleted"] === "1" ? (
                          <RiDeleteBin5Fill
                            style={{
                              cursor: "pointer",
                              float: "right",
                              marginTop: "5px",
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </i>
                    </span>
                  )}
                </Fragment>
              ) : (
                " "
              )}
            </td>
          )
        );
    }

    return (
      <tr
        className={data.opportunity == " " && data.lvl === 1 ? "pink" : "red "}
        key={data.id + data.oppId + data.customerId + data.sfOppId}
      >
        {header}
      </tr>
    );
  });

  const handleOnExport = () => {
    const customColumnOrder = [
      // { key: "executive_division", headers: ["Division"] },
      { key: "customer", headers: ["Sales Executive", "Customer"] },
      { key: "supervisor", headers: ["Supervisor"] },
      { key: "opportunity", headers: ["Opportunity Add To Call"] },
      // { key: "isDeleted", headers: ["Deletable"] },
      { key: "vendor", headers: ["Vendor"] },
      { key: "probability", headers: ["Prob %"] },
      { key: "closeDate", headers: ["Close Date"] },
      { key: "oppAmount", headers: ["Pipeline ($)"] },
      { key: "calls", headers: ["Call ($)"] },
      { key: "upside", headers: ["Upside ($)"] },
      { key: "closedAmount", headers: ["Closed ($)"] },
      { key: "week", headers: ["Week Updated"] },
      { key: "comments", headers: ["Comments"] },
    ];

    const dataKeys = Object.keys(viewDetailsData[0]);
    const keyValues = {};
    customColumnOrder.forEach(({ key }) => {
      keyValues[key] = viewDetailsData.slice(1).map((item) => {
        const value = item[key]; // Handle empty values if necessary
        return value?.split("^&"); // Split the value based on the delimiter "^&"
      });
    });

    // Combine the split values with the corresponding headers
    const customColumnHeaders = customColumnOrder
      .map(({ key, headers }) => {
        if (key === "customer") {
          return headers.map((header, index) => ({
            key: key,
            header: header,
            values: keyValues[key].map((value) => value[index]),
          }));
        } else {
          return { key: key, header: headers[0] };
        }
      })
      .flat();
    const filteredData = viewDetailsData
      .slice(1)
      .filter(
        (item) => item.lvl !== 1 && item.lvl !== 2 && item.opportunity != ""
      )
      .map((item) => {
        const filteredItem = Object.fromEntries(
          Object.entries(item).filter(([key]) => dataKeys.includes(key))
        );
        if (
          filteredItem["oppAmount"] === "" ||
          filteredItem["oppAmount"] === "0.00"
        ) {
          filteredItem["oppAmount"] = 0;
        }
        if (filteredItem["calls"] === " " || filteredItem["calls"] === "0.00") {
          filteredItem["calls"] = 0;
        }
        if (filteredItem["upside"] === "" || filteredItem["upside"] == "0.00") {
          filteredItem["upside"] = 0;
        }
        if (
          filteredItem["closedAmount"] === " " ||
          filteredItem["closedAmount"] === "0.00"
        ) {
          filteredItem["closedAmount"] = 0;
        }
        if (filteredItem["isDeleted"] === "0") {
          filteredItem["isDeleted"] = "No";
        }
        if (filteredItem["isDeleted"] === "1") {
          filteredItem["isDeleted"] = "Yes";
        }

        return filteredItem;
      });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SalesSoftware");
    const headerRow = worksheet.addRow(
      customColumnHeaders.map(({ header }) => header)
    );

    for (let i = 0; i < customColumnHeaders.length; i++) {
      const key = customColumnHeaders[i].key;
      if (key === "customer") {
        const values = customColumnHeaders[i].values;
        worksheet.getColumn(i + 1).values = [
          headerRow.getCell(i + 1).value,
          ...values,
        ];
      } else {
        const values = filteredData.map((item) => item[key]);
        worksheet.getColumn(i + 1).values = [
          headerRow.getCell(i + 1).value,
          ...values,
        ];
      }
    }
    const leftAlignedColumns = [
      "oppAmount",
      "calls",
      "upside",
      "closedAmount",
      "probability",
    ];
    leftAlignedColumns.forEach((key) => {
      const columnIndex = customColumnHeaders.findIndex(
        (header) => header.key === key
      );
      if (columnIndex !== -1) {
        const column = worksheet.getColumn(columnIndex + 1);
        column.alignment = { horizontal: "right" };
      }
    });
    const boldRow = [1];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "SalesSoftware.xlsx");
    });
  };

  return (
    <div className="col-lg-12 col-md-12 col-sm-12 customCard">
      {open ? <Loader handleAbort={handleAbort} /> : ""}
      {FilterName !== undefined &&
        filterExectiveName?.length == 1 &&
        filtertrue == true && (
          <div className="" style={{ display: "flex", alignItems: "center" }}>
            <span style={{ margin: "0 5px" }}>
              Calls Summary of &nbsp;
              <b style={{ color: "#297ab0", fontSize: "15px" }}>{FilterName}</b>
            </span>
            <span style={{ margin: "0 3px" }}>for :</span>
            <span>
              <b style={{ color: "#297ab0", fontSize: "15px" }}>{FilterName}</b>
            </span>
            <span style={{ margin: "0 3px" }}>for :</span>
            <span>
              <b style={{ color: "#297ab0", fontSize: "15px" }}>
                {srchQuat?.quat}{" "}
              </b>
            </span>
          </div>
        )}
      {filtertrue &&
        (filterExectiveName?.length > 1 ||
          filterExectiveName?.length === 0) && (
          <div className="" style={{ display: "flex", alignItems: "center" }}>
            <span style={{ margin: "0 5px" }}>
              Calls Summary of Selected Executives for :&nbsp;
              <b style={{ color: "#297ab0", fontSize: "15px" }}>
                {srchQuat?.quat}
              </b>
            </span>{" "}
          </div>
        )}

      <div className="d-flex align-items-center justify-content-between mb-2">
        {filtertrue == false && (
          <div>
            <p>
              Details of SE :{" "}
              <b style={{ color: "#297ab0", fontSize: "15px" }}>{"<<ALL>>"}</b>{" "}
              for :{" "}
              <b style={{ color: "#297ab0", fontSize: "15px" }}>
                {srchQuat?.quat}
              </b>
            </p>
            <p className="d-flex align-items-center">
              <span
                style={{ color: "#ffcfcf" }}
                className="fa fa-circle me-1"
                title="Leave"
              >
                <FaCircle fontSize={"10px"} />
              </span>
              These opportunities can be deleted
            </p>
          </div>
        )}
      </div>
      <div style={{ float: "right" }}>
        <RiFileExcel2Line
          size="1.5em"
          title="Export to Excel"
          style={{
            color: "green",
            fontSize: "16px",
          }}
          cursor="pointer"
          onClick={handleOnExport}
        />
      </div>
      <div
        className="darkHeader"
        style={{
          // maxWidth: "fit-content",
          paddingRight: "0px !important",
          maxHeight: "400px",
          overflowY: "scroll",
          width: "100%",
        }}
      >
        <table
          className="table table-bordered viewSecondTable"
          style={{ width: "100%" }}
        >
          <thead>{heads}</thead>
        </table>
      </div>
      {docDisplay && (
        <div className="col-md-12 mt-2">
          <span>
            <b style={{ color: "black" }}> Sf Documents -</b>
            <b style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
              {oppoName}
            </b>
          </span>
        </div>
      )}
      {docDisplay == true ? (
        <DocumentTable docId={docId} sfDocs={sfDocs} />
      ) : (
        ""
      )}
    </div>
  );
}
