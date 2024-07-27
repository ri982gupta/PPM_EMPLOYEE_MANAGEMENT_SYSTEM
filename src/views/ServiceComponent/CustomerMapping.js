import customerMappingjsonData from "./CustomerMapping.json";
import { FaSave } from "react-icons/fa";
import { environment } from "../../environments/environment";
import { Fragment, useState, useEffect, createRef } from "react";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import {
  FaAngleDown,
  FaAngleLeft,
  FaCircle,
  FaAngleRight,
} from "react-icons/fa";
import axios from "axios";

const CustomerMapping = (props) => {
  const { serviceData, reportRunId, coloumnArray, serviceDataCall } = props;

  const [customerTargetData, setcustomerTargetData] = useState([]);
  const [customerTargetDataKeys, setcustomerTargetDataKeys] = useState([]);
  const [expanded, setexpanded] = useState([]);

  const allexe = customerTargetData
    ?.filter((item) => item.lvl === 1)
    .map((item) => item.practice);
  const [colexpanded, setcolexpanded] = useState([]);
  let toggler = 0;
  let coltoggler = 0;
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
  // ----------------Method start-------------------------

  useEffect(() => {
    setcustomerTargetData(serviceData);
    setcustomerTargetDataKeys(coloumnArray);
  }, [serviceData, coloumnArray]);

  const clickRowExpand = (exe) => {
    if (exe === "Summary") {
      setexpanded((prevState) => {
        return prevState.length === allexe.length ? [] : allexe;
      });
    } else {
      setexpanded((prevState) => {
        return prevState.includes(exe)
          ? prevState.filter((item) => item !== exe)
          : [...prevState, exe];
      });
    }
  };

  const clickExpandcols = (quartr) => {
    setcolexpanded((prevState) => {
      return prevState.includes(quartr)
        ? prevState.filter((item) => item !== quartr)
        : [...prevState, quartr];
    });
  };
  //----------------------call-----------------------------------

  const saveCustMappingDetails = () => {
    axios
      .post(
        baseUrl +
          `/SalesMS/services/saveSalesCustomerMapping?loggedUserId=55543&reportRunId=` +
          reportRunId,
        serTargetObj
      )
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // ----------------table renderer-------------------------
  const serviceTargetTableData = customerTargetData?.map((data, i) => {
    const conditions = [
      "count",
      "countryId",
      "customerId",
      "id",
      "isEdit",
      "isProspect",
      "keyAttr",
      "lvl",
      "parentAttr",
      "practiceId",
    ];
    const nonIntegersvals = [
      "practice",
      "country",
      "customer",
      "total_target",
      "total_custForecast",
    ];
    const expandableCols = ["customer"];
    const horizontalcolexpands = [
      "target",
      "call",
      "custForecast",
      "sf",
      "pl",
      "rr",
      "attperc",
    ];
    let headspanner = "";

    let header = [];
    toggler =
      data["lvl"] === 2 || data["lvl"] === 3
        ? toggler
        : expanded.includes(data.practice)
        ? 1
        : 0;

    for (const keys in data) {
      if (keys.includes("Q")) {
        coltoggler = colexpanded.includes(keys.split("_")[1]) ? 1 : 0;
      }
      data?.id < 0 && console.log(keys);

      data[keys] !== null &&
        !conditions.includes(keys) &&
        (expanded.length > 0 ? true : !expandableCols.includes(keys)) &&
        header.push(
          data.id < 0 ? (
            // ((data.id === -2 || data.id === -1 && (keys.includes("total") ? (keys.split("_")[0] !== (headspanner.split("_")[0])) : (keys.split("_")[1] !== headspanner.split("_")[1]) || keys.includes("executive") || keys.includes("country") || keys.includes("customer"))) || data.id === -1) && (data[keys] !== "") &&
            // <th
            //     className={"targetth " + data[keys].split("^&")[3]}
            //     key={keys}
            //     rowSpan={data[keys].split("^&")[1]}
            //     colSpan={data[keys].split("^&")[2]}
            //     style={{ display: (coltoggler === 0 && ((horizontalcolexpands.some((item) => keys.includes(item))) && !(keys.includes("Q") || keys.includes("total")))) ? "none" : "" }}
            // >
            //     {data[keys].split("^&")[0]}
            //     {data.id === -2 && data[keys].includes("Quart") && <span onClick={() => { clickExpandcols(keys.split("_")[1]) }}>{colexpanded.includes(keys.split("_")[1]) ? <FaAngleLeft /> : <FaAngleRight />}</span>}
            // </th>

            <th
              className={"targetth " + data[keys].split("^&")[3]}
              key={keys}
              style={{
                display:
                  coltoggler === 0 &&
                  (keys.includes("target") || keys.includes("custForecast")) &&
                  !(keys.includes("Q") || keys.includes("total"))
                    ? "none"
                    : "",
              }}
              // colSpan={data[keys].split("^&")[2]}
              // rowSpan={data[keys].split("^&")[1]}
            >
              {data[keys].split("^&")[0]}
              {data.id === -2 && data[keys].includes("Quart") && (
                <span
                  onClick={() => {
                    clickExpandcols(keys.split("_")[1]);
                  }}
                >
                  {colexpanded.includes(keys.split("_")[1]) ? (
                    <FaAngleLeft />
                  ) : (
                    <FaAngleRight />
                  )}
                </span>
              )}
            </th>
          ) : (
            <td
              key={keys}
              data-lvl={data.lvl}
              data-qua={customerTargetData[0][keys]?.split("^&")[4]}
              className={"custMaptd " + keys.split("_")[1] + " " + keys}
              style={{
                display:
                  (toggler === 0 && (data["lvl"] === 2 || data["lvl"] === 3)) ||
                  (coltoggler === 0 &&
                    (keys.includes("target") ||
                      keys.includes("custForecast")) &&
                    !(keys.includes("Q") || keys.includes("total")))
                    ? "none"
                    : "",
              }}
            >
              {nonIntegersvals.includes(keys) ? (
                <Fragment>
                  <span
                    onClick={() => {
                      clickRowExpand(data.practice);
                    }}
                  >
                    {(data["lvl"] === 1 || data["lvl"] === 0) &&
                      keys === "practice" &&
                      (expanded.includes(data.practice) ||
                      (data.practice === "Summary" &&
                        expanded?.length === allexe?.length) ? (
                        <FaAngleDown />
                      ) : (
                        <FaAngleRight />
                      ))}
                  </span>

                  {keys === "practice" ? (
                    data["lvl"] === 2 || data["lvl"] === 3 ? (
                      <span>{data[keys].split("^&")[1]}</span>
                    ) : (
                      <span>
                        {icons[data["practice"]]} {data[keys].split("^&")[0]}
                      </span>
                    )
                  ) : (
                    <span>{data[keys]}</span>
                  )}
                </Fragment>
              ) : (
                <Fragment>
                  {data["lvl"] === 3 ? (
                    <input
                      type="number"
                      id={keys}
                      value={data[keys]}
                      // onChange={(e) => { onSerTargetEnter(e, i) }}
                      // onBlur={(e) => { onSerTargetUpdate(e, data.parentAttr, i, data.id,data.practiceId,data.countryId) }}
                    ></input>
                  ) : (
                    <span>
                      {data[keys] === " "
                        ? ""
                        : parseInt(data[keys]).toLocaleString("en-US")}
                    </span>
                  )}
                </Fragment>
              )}
            </td>
            // <td key={keys}
            //     className={
            //         (keys.includes("executive") ? "executive" : keys.includes("Q") ? keys.split("_")[1][1] % 2 == 0 ? "even" : "odd" : keys.includes("total") ? "total"
            //             : keys.includes("0") ? keys.split("_")[1] % 2 == 0 ? "innereven" : "innerodd" : "")

            //     }
            //     style={{ display: (toggler === 0 && (data["lvl"] === 2 || data["lvl"] === 3)) || (coltoggler === 0 && ((horizontalcolexpands.some((item) => keys.includes(item))) && !(keys.includes("Q") || keys.includes("total")))) ? "none" : "" }}>
            //     {nonIntegersvals.includes(keys)
            //         ?
            //         <Fragment>
            //             <span onClick={() => { clickRowExpand(data.executive) }}>{((data["lvl"] === 1 || data["lvl"] === 0) && keys === "executive") && ((expanded.includes(data.executive) || (data.executive === "Summary" && (expanded.length === allexe.length))) ? <FaAngleDown /> : <FaAngleRight />)}</span>

            //             {keys === "executive" ?
            //                 (
            //                     (data["lvl"] === 2 || data["lvl"] === 3)
            //                         ?
            //                         (<span>{data[keys].split("^&")[1]}</span>)

            //                         :
            //                         <span>{icons[data["execStatus"]]} {data[keys].split("^&")[0]}</span>
            //                 )
            //                 :

            //                 <span>{data[keys]}</span>
            //             }
            //             {/* {keys == "total_target" ?
            //                 <span>{(data[keys] === " " ? "" : (parseInt(data[keys])).toLocaleString('en-US'))}</span> : ""} */}

            //         </Fragment>
            //         :
            //         <Fragment>
            //             {(data["lvl"] === 3)
            //                 ?
            //                 <input type="number" id={keys} value={data[keys]} data-qua={serTargetData[0][keys].split("^&")[4]}
            //                     onChange={(e) => { onSerTargetEnter(e, i) }}
            //                     onBlur={(e) => { onSerTargetUpdate(e, data.parentAttr, i, data.id, data.practiceId, data.countryId) }}
            //                 ></input>
            //                 :

            //                 <span>{(data[keys] === " " ? "" : (parseInt(data[keys])).toLocaleString('en-US'))}</span>
            //             }

            //         </Fragment>

            //     }
            //     {nonIntegersvals.includes(keys)
            //         ?
            //         <Fragment>
            //             {/* {keys === "country" && <span>{data[keys]}</span>} */}
            //             {keys === "executive" && data[keys] !== "Summary" ? <MdOutlineEditNote style={{ float: "right" }} size={"1.5em"} onClick={() => { setOpenPopup(true); setRowData(data); console.log(data) }} /> : ""}
            //         </Fragment> : ""}
            // </td>
          )
        );
      headspanner = keys;
    }
    return (
      <tr
        key={data.keyAttr + data.practice + data.customer}
        data-lvl={data.lvl}
      >
        {header}
      </tr>
    );
  });

  return (
    <div className="col-lg-12 col-md-12 col-sm-12  customCard">
      <div className="col-lg-12 col-md-12 col-sm-12 no-padding custMapTablePrnt scrollit darkHeader">
        <table className="table table-bordered  ">
          <tbody>{serviceTargetTableData}</tbody>
        </table>
      </div>
      <div className="col-md-12 col-sm-12 col-xs-12 no-padding center">
        {/* <button type="button" className="btn btn-primary" onClick={saveCustMappingDetails}><FaSave /> Save </button> */}
        {/* <button type="button" className="btn btn-primary"  ><BiReset />Reset </button> */}
      </div>
    </div>
  );
};

export default CustomerMapping;
