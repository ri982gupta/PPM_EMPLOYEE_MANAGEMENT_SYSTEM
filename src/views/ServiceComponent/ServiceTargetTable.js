// import ServiceTargetData from './TargetData.json';
import { FaSave } from "react-icons/fa";
import {
  FaChevronCircleRight,
  FaChevronCircleLeft,
  FaCaretDown,
  FaCaretRight,
  FaCircle,
} from "react-icons/fa";
import { environment } from "../../environments/environment";
import { Fragment, useState, useEffect } from "react";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import axios from "axios";
import { MdOutlineEditNote } from "react-icons/md";
import { FiRotateCcw } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import "./ServiceTargetTable.scss";
import SFButtons from "./SFButtons";
import TargetDisplayPopup from "./TargetDisplayPopup";

const ServiceTargetTable = ({
  serviceData,
  coloumnArray,
  reportRunId,
  setMessage,
  accessData,
  setMessage1,
  hirarchy,
  setshowSFpipeline,
  showSFpipeline,
  componentSelector,
  setRefreshButton,
  refreshButton,
}) => {
  const baseUrl = environment.baseUrl;
  const [serTargetData, setSerTargetData] = useState([]);
  const [serTargetDataKeys, setSerTargetDataKeys] = useState([]);
  const [serTargetObj, setSerTargetObj] = useState([]);
  const [expanded, setexpanded] = useState([]);
  const [colexpanded, setcolexpanded] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [rowData, setRowData] = useState({});
  const loggedUserId = localStorage.getItem("resId");
  const [serviceTargetTableData, setServiceTargetTableData] = useState(null);
  const [serviceTargetTableData1, setServiceTargetTableData1] = useState(null);

  const allexe = serTargetData
    ?.filter((item) => item.lvl === 1)
    .map((item) => item.executive);

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

  //  useEffect(() => {
  //       let temp = JSON.parse(JSON.stringify(serviceData.slice(0, 250)));
  //       setSerTargetData(temp);
  //       setSerTargetDataKeys(coloumnArray)
  //   }, [serviceData, coloumnArray])

  useEffect(() => {
    setSerTargetData(JSON.parse(JSON.stringify(serviceData)));
    setSerTargetDataKeys(coloumnArray);
  }, [serviceData, coloumnArray]);

  useEffect(() => {
    tableDisplayHandlerHeader();
    tableDisplayHandler();
  }, [serTargetData, expanded]);

  useEffect(() => {
    setexpanded([]);
    setcolexpanded([]);
  }, [serviceData]);

  const prosicon = {
    1: <FaCircle size={"0.8em"} style={{ color: "purple" }} />,
    0: <FaCircle size={"0.8em"} style={{ color: "green" }} />,
  };

  const onSerTargetEnter = (e, i) => {
    const { value, id } = e.target;
    setSerTargetData((prevState) => {
      const newState = [...prevState];
      newState[i][id] = value;
      return newState;
    });
  };
  console.log(accessData);
  const onSerTargetUpdate = (e, pAtt, i, executive, practiceId, countryId) => {
    const { value, id } = e.target;
    const quarGrp = e.target.getAttribute("data-qua");
    const year = id.split("_")[0];
    const quarter = id.split("_")[1];
    const quarChecker =
      quarter === "Q1" ||
      quarter === "Q2" ||
      quarter === "Q3" ||
      quarter === "Q4"
        ? "quar"
        : "month";

    const keysData =
      "id,executive,execStatus,supervisor,practiceId,practice,countryId,country,lvl,count,isEdit,keyAttr,parentAttr,isActive,2023_Q2_target,2022_07_01_target,2022_08_01_target,2022_09_01_target,2023_Q3_target,2022_10_01_target,2022_11_01_target,2022_12_01_target,2023_Q4_target,2023_01_01_target,2023_02_01_target,2023_03_01_target,2024_Q1_target,2023_04_01_target,2023_05_01_target,2023_06_01_target,total_target,";
    const keysDataArr = keysData?.split(",");
    const searchIndex = keysDataArr.findIndex((data) => data === id);
    let splitId = id.split("_");
    let months = null;

    switch (splitId[1]) {
      case "Q1":
        months = [4, 5, 6];
        break;
      case "Q2":
        months = [7, 8, 9];
        break;

      case "Q3":
        months = [10, 11, 12];
        break;

      case "Q4":
        months = [1, 2, 3];
        break;

      default:
        break;
    }

    let currIndexKeys = Object.keys(serTargetData[i]);

    let finalKey = [];

    if (months != null) {
      for (let i = 0; i < months.length; i++) {
        if (("" + months[i]).length == 1) {
          months[i] = "_0" + months[i] + "_01_" + splitId[2];
        }
      }

      months.map((ele) => {
        let ky = currIndexKeys.filter((d) => d.includes(ele));
        finalKey.push(ky);
      });
    }

    setSerTargetData((prevState) => {
      const exeSumIndex = prevState.findIndex(
        (element) => element.keyAttr === pAtt
      );

      if (quarChecker === "quar") {
        // row Total
        let total = 0;
        Object.keys(prevState[i]).forEach((d) => {
          if (d.includes("Q")) {
            total = total + parseInt(prevState[i][d]);
          }
        });
        prevState[i]["total_target"] = total;

        let execName = prevState[i]["executive"];
        let splitedExecName = prevState[i]["executive"].split("^&");
        let topCount = prevState
          .filter((d) => d.executive == execName)
          .filter((d, i) => i > 0)
          .map((d) => d[id])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let topCount1 = prevState
          .filter((d) => d.executive.includes(splitedExecName[0]))
          .filter((d) => d.lvl > 2)
          .map((d) => d[id])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let totalTargetTopCount = prevState
          .filter((d) => d.lvl == 3)
          .map((d) => d["total_target"])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let totalTargetsubCount = prevState
          .filter((d) => d.executive.includes(splitedExecName[0]))
          .filter((d) => d.lvl > 2)
          .map((d) => d["total_target"])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let totalTargetsubCountCust = prevState
          .filter((d) => d.executive == execName)
          .filter((d, i) => i > 0)
          .map((d) => d["total_target"])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let summaryQuarterCount = prevState
          .filter((d) => d.lvl == 3)
          .map((d) => d[id])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

        // for 3 months summation

        var monVal = Math.floor(value / 3);
        prevState[i][finalKey[0]] = monVal;
        prevState[i][finalKey[1]] = monVal;
        prevState[i][finalKey[2]] = monVal + (value % 3);

        let monthOneSummaryCount = prevState
          .filter((d) => d.lvl == 3)
          .map((d) => d[finalKey[0]])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let monthTwoSummaryCount = prevState
          .filter((d) => d.lvl == 3)
          .map((d) => d[finalKey[1]])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let monthThreeSummaryCount = prevState
          .filter((d) => d.lvl == 3)
          .map((d) => d[finalKey[2]])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

        prevState[1][finalKey[0]] = monthOneSummaryCount;
        prevState[1][finalKey[1]] = monthTwoSummaryCount;
        prevState[1][finalKey[2]] = monthThreeSummaryCount;

        let monthOneTopCount = prevState
          .filter((d) => d.executive == execName)
          .filter((d, i) => i > 0)
          .map((d) => d[finalKey[0]])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let monthTwoTopCount = prevState
          .filter((d) => d.executive == execName)
          .filter((d, i) => i > 0)
          .map((d) => d[finalKey[1]])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let monthThreeTopCount = prevState
          .filter((d) => d.executive == execName)
          .filter((d, i) => i > 0)
          .map((d) => d[finalKey[2]])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

        prevState[exeSumIndex][finalKey[0]] = monthOneTopCount;
        prevState[exeSumIndex][finalKey[1]] = monthTwoTopCount;
        prevState[exeSumIndex][finalKey[2]] = monthThreeTopCount;

        // lvl2 quarter count
        prevState[exeSumIndex][id] = topCount;
        prevState[1]["total_target"] = totalTargetTopCount;
        prevState[1][id] = summaryQuarterCount;

        // finalKey
        // summary for all executives
        let monthOneTopCount1 = prevState
          .filter((d) => d.executive.includes(splitedExecName[0]))
          .filter((d) => d.lvl > 2)
          .map((d) => d[finalKey[0]])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let monthTwoTopCount1 = prevState
          .filter((d) => d.executive.includes(splitedExecName[0]))
          .filter((d) => d.lvl > 2)
          .map((d) => d[finalKey[1]])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let monthThreeTopCount1 = prevState
          .filter((d) => d.executive.includes(splitedExecName[0]))
          .filter((d) => d.lvl > 2)
          .map((d) => d[finalKey[2]])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

        let arr = prevState;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i]["executive"] == splitedExecName[0] + "^&  ") {
            arr[i][id] = topCount1;
            arr[i]["total_target"] = totalTargetsubCount;
            arr[i][finalKey[0]] = monthOneTopCount1;
            arr[i][finalKey[1]] = monthTwoTopCount1;
            arr[i][finalKey[2]] = monthThreeTopCount1;
          }
        }

        prevState[exeSumIndex]["total_target"] = totalTargetsubCountCust;
      } else if (quarChecker === "month") {
        let q1months = [4, 5, 6];
        let q2months = [7, 8, 9];
        let q3months = [10, 11, 12];
        let q4months = [1, 2, 3];
        let date = null;
        let q = e.target.id;
        let array = q.split("_");
        let month = array[1];

        let quarters;

        if (q1months.includes(+month)) {
          quarters = "Q1";
          date = q1months;
        } else if (q2months.includes(+month)) {
          quarters = "Q2";
          date = q2months;
        } else if (q3months.includes(+month)) {
          quarters = "Q3";
          date = q3months;
        } else if (q4months.includes(+month)) {
          quarters = "Q4";
          date = q4months;
        }

        let Qualtertotal = 0;
        let quaterId = null;
        Object.keys(prevState[i]).forEach((d) => {
          if (
            (d.includes(0) ||
              d.includes(1) ||
              d.includes(2) ||
              d.includes(3) ||
              d.includes(4) ||
              d.includes(5) ||
              d.includes(6) ||
              d.includes(7) ||
              d.includes(8) ||
              d.includes(9)) &&
            !d.includes("Q")
          ) {
            let array = d.split("_");
            let valueAtIndex1 = array[1];
            let result = valueAtIndex1.startsWith(0)
              ? valueAtIndex1.substring(1)
              : valueAtIndex1;
            if (result != null && date?.includes(+result)) {
              Qualtertotal = Qualtertotal + parseInt(prevState[i][d]);
            }
          }
          if (d.includes(quarters)) {
            quaterId = d;
          }
        });
        prevState[i][quaterId] = Qualtertotal;

        let total = 0;
        Object.keys(prevState[i]).forEach((d) => {
          if (d.includes("Q")) {
            total = total + parseInt(prevState[i][d]);
          }
        });

        prevState[i]["total_target"] = total;
        let execName = prevState[i]["executive"];
        let splitedExecName = prevState[i]["executive"].split("^&");

        let montopCount = prevState
          .filter((d) => d.executive == execName)
          .filter((d, i) => i > 0)
          .map((d) => d[id])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let montopCount1 = prevState
          .filter((d) => d.executive.includes(splitedExecName[0]))
          .filter((d) => d.lvl > 2)
          .map((d) => d[id])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let montotalTargetTopCount = prevState
          .filter((d) => d.lvl == 3)
          .map((d) => d["total_target"])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let montotalTargetsubCount = prevState
          .filter((d) => d.executive.includes(splitedExecName[0]))
          .filter((d) => d.lvl > 2)
          .map((d) => d["total_target"])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let montotalTargetsubCountCust = prevState
          .filter((d) => d.executive == execName)
          .filter((d, i) => i > 0)
          .map((d) => d["total_target"])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let monsummaryQuarterCount = prevState
          .filter((d) => d.lvl == 3)
          .map((d) => d[id])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

        prevState[exeSumIndex][id] = montopCount;
        prevState[exeSumIndex]["total_target"] = montotalTargetsubCountCust;
        prevState[1]["total_target"] = montotalTargetTopCount;
        prevState[1][id] = monsummaryQuarterCount;

        prevState[1][quaterId] = prevState
          .filter((d) => d.lvl == 3)
          .map((d) => d[quaterId])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        let monQuartTopCount1 = prevState
          .filter((d) => d.executive.includes(splitedExecName[0]))
          .filter((d) => d.lvl > 2)
          .map((d) => d[quaterId])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
        prevState[exeSumIndex][quaterId] = prevState
          .filter((d) => d.executive == execName)
          .filter((d, i) => i > 0)
          .map((d) => d[quaterId])
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

        let arr = prevState;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i]["executive"] == splitedExecName[0] + "^&  ") {
            arr[i][id] = montopCount1;
            arr[i]["total_target"] = montotalTargetsubCount;
            arr[i][quaterId] = monQuartTopCount1;
          }
        }
      }
      return [...prevState];
    });

    const targetDataArray = [];

    const createTargetData = (month, value) => ({
      executiveId: "" + executive,
      customerId: "undefined",
      prospectId: "",
      practiceId: "" + practiceId,
      countryId: "" + countryId,
      month,
      typ: "target",
      val: parseInt(value),
      comments: "",
      isOverridden: false,
    });

    if (quarChecker === "quar") {
      const monthsMap = {
        Q1: [
          `${parseInt(year) - 1}-04-01`,
          `${parseInt(year) - 1}-05-01`,
          `${parseInt(year) - 1}-06-01`,
        ],
        Q2: [
          `${parseInt(year) - 1}-07-01`,
          `${parseInt(year) - 1}-08-01`,
          `${parseInt(year) - 1}-09-01`,
        ],
        Q3: [
          `${parseInt(year) - 1}-10-01`,
          `${parseInt(year) - 1}-11-01`,
          `${parseInt(year) - 1}-12-01`,
        ],
        Q4: [
          `${parseInt(year)}-01-01`,
          `${parseInt(year)}-02-01`,
          `${parseInt(year)}-03-01`,
        ],
      };
      const months = monthsMap[quarter];
      const valuePerMonth = Math.floor(value / 3);

      months.forEach((month, index) => {
        const targetValue =
          valuePerMonth + (index === months.length - 1 ? value % 3 : 0);
        targetDataArray.push(createTargetData(month, targetValue));
      });
    } else if (quarChecker === "month") {
      const month = year + "_" + id.split("_")[1] + "_01";
      targetDataArray.push(createTargetData(month, value));
    }
    setSerTargetObj((prevState) => {
      return [...prevState, ...targetDataArray];
    });
  };

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

  //----------------------call-----------------------------------
  const clickExpandcols = (quartr) => {
    setcolexpanded((prevState) => {
      return prevState?.includes(quartr)
        ? prevState?.filter((item) => item !== quartr)
        : [...prevState, quartr];
    });
  };

  const saveSerTargetDetails = () => {
    const modifiedData = serTargetObj.some((item) => item.val !== 0);
    if (modifiedData) {
      axios
        .post(
          baseUrl +
            `/SalesMS/services/saveSalesTargets?loggedUserId=${loggedUserId}&reportRunId=${reportRunId}`,
          serTargetObj
        )
        .then((resp) => {
          setMessage(true);
          setTimeout(() => {
            setMessage(false);
          }, 3000);
        })
        .catch((err) => {
          // Handle error
        });
    } else {
      setMessage1(true);
      setTimeout(() => {
        setMessage1(false);
      }, 3000);
    }
  };

  const resetClickHandler = () => {
    let emptyClassList = document.getElementsByClassName("empty");
    for (let i = 0; i < emptyClassList.length; i++) {
      let splitData = emptyClassList[i].id.split("__");
      let row = parseInt(splitData[1]);
      let col = splitData[2];
      emptyClassList[i].value = serTargetData[row][col];
    }
    setSerTargetData(serviceData);
    setSerTargetObj([]);
  };

  useEffect(() => {
    tableDisplayHandlerHeader();
    tableDisplayHandler();
  }, [colexpanded]);

  // ----------------table renderer-------------------------

  const tableDisplayHandlerHeader = () => {
    setServiceTargetTableData1(() => {
      return serTargetData?.map((data, i) => {
        let headspanner = "";
        const conditions = [
          "id",
          "count",
          "countryId",
          "execStatus",
          "isEdit",
          "keyAttr",
          "lvl",
          "parentAttr",
          "practiceId",
          "supervisor",
        ];
        const nonIntegersvals = ["executive", "country", "total_target"];
        const expandableCols = ["country"];
        const horizontalcolexpands = ["target"];

        let header = [];
        toggler =
          data["lvl"] === 2 || data["lvl"] === 3
            ? toggler
            : expanded.includes(data.executive)
            ? 1
            : 0;

        for (const keys in data) {
          if (keys.includes("Q")) {
            coltoggler = colexpanded.includes(keys.split("_")[1]) ? 1 : 0;
          }

          !conditions.includes(keys) &&
            (expanded.length > 0 ? true : !expandableCols.includes(keys)) &&
            header.push(
              data.id < 0 && (
                <th
                  key={keys}
                  style={{
                    textAlign: "center",
                    display:
                      coltoggler === 0 &&
                      horizontalcolexpands?.some((item) =>
                        keys?.includes(item)
                      ) &&
                      !(keys?.includes("Q") || keys?.includes("total"))
                        ? "none"
                        : "",
                  }}
                >
                  {data[keys]?.split("^&")[0]}
                  {data.id === -2 && data[keys]?.includes("Quart") && (
                    <span
                      onClick={() => {
                        clickExpandcols(keys.split("_")[1]);
                      }}
                    >
                      {colexpanded.includes(keys.split("_")[1]) ? (
                        <FaChevronCircleLeft
                          size={"0.8em"}
                          title="Hide Details"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                        />
                      ) : (
                        <FaChevronCircleRight
                          size={"0.8em"}
                          title="Show Details"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                        />
                      )}
                    </span>
                  )}
                </th>
              )
            );
          headspanner = keys;
        }
        return (
          <tr key={data.keyAttr + data.executive + data.countryId}>{header}</tr>
        );
      });
    });
  };

  const tableDisplayHandler = () => {
    setServiceTargetTableData(() => {
      return serTargetData?.map((data, i) => {
        let headspanner = "";
        const conditions = [
          "id",
          "count",
          "countryId",
          "execStatus",
          "isEdit",
          "keyAttr",
          "lvl",
          "parentAttr",
          "practiceId",
          "supervisor",
        ];
        const nonIntegersvals = ["executive", "country", "total_target"];
        const expandableCols = ["country"];
        const horizontalcolexpands = ["target"];

        let header = [];
        toggler =
          data["lvl"] === 2 || data["lvl"] === 3
            ? toggler
            : expanded.includes(data.executive)
            ? 1
            : 0;

        for (const keys in data) {
          if (keys.includes("Q")) {
            coltoggler = colexpanded.includes(keys.split("_")[1]) ? 1 : 0;
          }
          !conditions.includes(keys) &&
            (expanded.length > 0 ? true : !expandableCols.includes(keys)) &&
            header.push(
              <td
                key={keys}
                className={
                  keys.includes("executive")
                    ? "executive"
                    : keys.includes("Q")
                    ? keys.split("_")[1][1] % 2 == 0
                      ? "even"
                      : "odd"
                    : keys.includes("total")
                    ? "total"
                    : keys.includes("0")
                    ? keys.split("_")[1] % 2 == 0
                      ? "innereven"
                      : "innerodd"
                    : ""
                }
                style={{
                  display:
                    (toggler === 0 &&
                      (data["lvl"] === 2 || data["lvl"] === 3)) ||
                    (coltoggler === 0 &&
                      horizontalcolexpands.some((item) =>
                        keys.includes(item)
                      ) &&
                      !(keys.includes("Q") || keys.includes("total")))
                      ? "none"
                      : "",
                }}
              >
                {nonIntegersvals.includes(keys) ? (
                  <Fragment>
                    <span
                      onClick={() => {
                        clickRowExpand(data.executive);
                      }}
                    >
                      {(data["lvl"] === 1 || data["lvl"] === 0) &&
                        keys === "executive" &&
                        (expanded.includes(data.executive) ||
                        (data.executive === "Summary" &&
                          expanded.length === allexe.length) ? (
                          <FaCaretDown
                            size={"1.2em"}
                            title="Collapse"
                            style={{ cursor: "pointer", color: "#428bca" }}
                          />
                        ) : (
                          <FaCaretRight
                            size={"1.2em"}
                            title="Expand"
                            style={{ cursor: "pointer", color: "#428bca" }}
                          />
                        ))}
                    </span>

                    {keys === "executive" ? (
                      data["lvl"] === 2 || data["lvl"] === 3 ? (
                        <div
                          style={{
                            paddingLeft: data["lvl"] === 3 ? "30px" : "",
                          }}
                        >
                          {data["lvl"] === 3 && <span>{prosicon[0]}</span>}

                          <span
                            className={
                              (keys === "executive" && data["lvl"] === 2) ||
                              data["lvl"] === 3
                                ? "collapsedRow"
                                : ""
                            }
                            title={data[keys]?.split("^&")[1]}
                            style={{
                              fontWeight: data["lvl"] === 3 ? " " : "normal",
                              paddingRight:
                                data["lvl"] === 3 ? "60px" : "110px",
                            }}
                          >
                            {("" + data[keys]).includes("^&")
                              ? data[keys]?.split("^&")[1]
                              : data[keys]}
                          </span>
                        </div>
                      ) : (
                        <div>
                          {icons[data["execStatus"]]}
                          <span
                            title={
                              ("" + data[keys]).includes("^&")
                                ? data[keys]?.split("^&")[0]
                                : data[keys]
                            }
                          >
                            {("" + data[keys]).includes("^&")
                              ? data[keys]?.split("^&")[0]
                              : data[keys]}
                          </span>

                          <span title="Notes">
                            {keys == "executive" &&
                            data[keys] !== "Summary" &&
                            data[keys] != "<< Unassigned >>" ? (
                              <MdOutlineEditNote
                                style={{ float: "right", cursor: "pointer" }}
                                size={"1.5em"}
                                onClick={() => {
                                  setOpenPopup(true);
                                  setRowData(data);
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                      )
                    ) : data["lvl"] === 1 ? (
                      <span
                        className={
                          keys === "country" && data["lvl"] === 1
                            ? "countryName"
                            : ""
                        }
                      >
                        {isNaN(parseFloat(data[keys]))
                          ? data[keys]
                          : parseFloat(data[keys]).toLocaleString("en-US")}
                      </span>
                    ) : (
                      <span>
                        {isNaN(parseFloat(data[keys]))
                          ? data[keys]
                          : parseFloat(data[keys]).toLocaleString("en-US")}
                      </span>
                    )}
                  </Fragment>
                ) : (
                  <Fragment>
                    {data["lvl"] === 3 && accessData === 1000 ? (
                      <input
                        type="number"
                        id={keys}
                        value={serTargetData[i][keys]}
                        onChange={(e) => {
                          if (e.target.value === "") {
                            e.target.value = "0";
                            onSerTargetUpdate(
                              e,
                              data.parentAttr,
                              i,
                              data.id,
                              data.practiceId,
                              data.countryId
                            );
                          }
                          onSerTargetEnter(e, i);
                        }}
                        onBlur={(e) => {
                          onSerTargetUpdate(
                            e,
                            data.parentAttr,
                            i,
                            data.id,
                            data.practiceId,
                            data.countryId
                          );
                        }}
                      ></input>
                    ) : (
                      <span>
                        {data[keys] === " "
                          ? ""
                          : parseInt(data[keys]).toLocaleString("en-US")}{" "}
                      </span>
                    )}
                  </Fragment>
                )}
              </td>
            );
          headspanner = keys;
        }
        return data.id !== -2 ? (
          <tr key={data.keyAttr + data.executive + data.countryId}>{header}</tr>
        ) : null;
      });
    });
  };

  const handleOnExport = () => {
    console.log("inline sales Target");
    const excludeProperties = [
      "id",
      "customerId",
      "supervisor",
      "isProspect",
      "practiceId",
      "countryId",
      "execStatus",
      "lvl",
      "count",
      "isEdit",
      "keyAttr",
      "parentAttr",
      "isActive",
    ];

    const headerRow1 = Object.keys(serviceData[0])
      .filter((key) => !excludeProperties.includes(key))
      .map((key) => {
        if (key === "customer") {
          const val = serviceData[0][key].split("^&");
          let dVal = val[0].includes("__") ? val[0].split("__") : [];
          return dVal[2] + dVal[4];
        }
        const val = serviceData[0][key].split("^&");
        return val[0];
      });

    const filteredData = serviceData.slice(1).map((item) => {
      const filteredItem = Object.fromEntries(
        Object.entries(item)
          .filter(([key]) => key !== "id")
          .map(([key, value]) => {
            if (key === "executive") {
              value = value.replace("^&", " - ");
            }
            return [key, value];
          })
      );
      return filteredItem;
    });

    const dataRows = filteredData.map((item) => Object.values(item));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SalesTarget");
    const headerRow = worksheet.addRow(headerRow1);

    for (let i = 0; i < dataRows.length; i++) {
      const row = worksheet.addRow(dataRows[i]);
    }
    const boldRow = [1];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "SalesTarget.xlsx");
    });
  };

  return (
    <div>
      <div className="">
        <RiFileExcel2Line
          size="1.5em"
          title="Export to Excel"
          style={{ color: "green", float: "right" }}
          cursor="pointer"
          onClick={handleOnExport}
        />
        <b
          style={{
            float: "right",
            paddingRight: "640px",
            fontSize: "17px",
            color: "#297ab0",
          }}
        >
          Targets
        </b>
        {serviceData.length > 0 && (
          <SFButtons
            reportRunId={reportRunId}
            showSFpipeline={showSFpipeline}
            setshowSFpipeline={setshowSFpipeline}
            componentSelector={componentSelector}
            setRefreshButton={setRefreshButton}
            refreshButton={refreshButton}
          />
        )}
      </div>

      <div className="serviceCompTargetTable darkHeader toHead">
        <table
          className="table table-bordered htmlTable"
          cellPadding={0}
          cellSpacing={0}
        >
          <thead>{serviceTargetTableData1}</thead>
          <tbody>{serviceTargetTableData}</tbody>
        </table>
      </div>

      {accessData === 1000 ? (
        <div className="btn-container center my-3 mb-2">
          {/* <div className="clearfix" style={{ height: '25px' }}></div> */}
          <button
            type="button"
            className="btn btn-primary"
            style={{
              width: "80px",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={saveSerTargetDetails}
          >
            <FaSave />
            Save{" "}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              width: "80px",
              fontWeight: "bold",
              color: "white",
            }}
            onClick={() => {
              resetClickHandler();
            }}
          >
            <FiRotateCcw style={{ color: "white" }} />
            Reset{" "}
          </button>
        </div>
      ) : (
        ""
      )}
      {openPopup ? (
        <TargetDisplayPopup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          Vdata={serviceData}
          accessData={accessData}
          rowData={rowData}
        />
      ) : (
        ""
      )}
    </div>
  );
};
export default ServiceTargetTable;
