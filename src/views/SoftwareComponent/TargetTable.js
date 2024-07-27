import React from "react";
import { Fragment, useState, useEffect, createRef } from "react";
import { FiChevronRight } from "react-icons/fi";
import TargetTableData from "./TargetTableData.json";
import {
  FaAngleRight,
  FaAngleLeft,
  FaChevronCircleLeft,
  FaChevronCircleRight,
} from "react-icons/fa";
import { CModal } from "@coreui/react";
import { makeStyles } from "@material-ui/core";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { FiRotateCcw } from "react-icons/fi";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { FaAngleDown } from "react-icons/fa";
import axios from "axios";
import { environment } from "../../environments/environment";
import { BiReset } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import ExcelJS from "exceljs";

import { MdOutlineEditNote } from "react-icons/md";

import DisplayPopUpEditNote from "./DisplayPopUpEditNote";
import { RiFileExcel2Line } from "react-icons/ri";

function tableRendere({
  selectedSe,
  reportId,
  selectedSE,
  setSelectedSE,
  buttonAction,
  setData,
  data,
  hirarchy,
  accessData,
  tableData,
  loader,
  setTableData,
  headerData,
  setHeaderData,
  fdate,
  setLoader,
  setErrorMessage,
  getData1,
}) {
  const [openPopup, setOpenPopup] = useState(false);
  const [rowData, setRowData] = useState({});
  const [seOptions, setSeOptions] = useState([]);
  const [expanded, setexpanded] = useState([]);
  const [targetCatId, setTargetCatId] = useState([]);
  const [coloumnArray, setColoumnArray] = useState([]);
  const [colexpanded, setcolexpanded] = useState([]);
  let coltoggler = 0;
  const popupValue = "TargetTable";
  const [wirteData, setWriteData] = useState();
  const loggedUserId = localStorage.getItem("resId");
  const [serTargetData, setSerTargetData] = useState([]);
  const [serviceTargetTableData, setServiceTargetTableData] = useState(null);
  const [serviceTargetTableData1, setServiceTargetTableData1] = useState(null);
  const [serTargetDataKeys, setSerTargetDataKeys] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [serTargetObj, setSerTargetObj] = useState({});
  const [targetId, setTargetId] = useState({});
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

  const baseUrl = environment.baseUrl;
  const [targetData, setTargetData] = useState([]);

  const [targetObj, setTargetObj] = useState({});

  // ----------------Method start-------------------------
  const onTargetEnter = (e, i) => {
    const { value, id } = e.target;
    setTargetData((prevState) => {
      prevState[i][id] = value;
      return [...prevState];
    });
  };

  const str = `'${tableData.GetSalesSWTargets}'`;

  const formattedData = `'${tableData.GetSalesSWTargets}'`;

  const arr = str?.slice(1, -1)?.split(",");
  const filteredKeysArray = arr?.filter(
    (key) =>
      key !== "id" &&
      key !== "execStatus" &&
      key !== "count" &&
      key !== "isActive" &&
      key !== "isEdit" &&
      key !== "keyAttr" &&
      key !== "lvl" &&
      key !== "parentAttr" &&
      key !== "targetCat" &&
      key !== "targetCatId" &&
      key !== "executive"
  );

  const seDropDown = () => {
    axios
      .get(
        baseUrl +
          `/CommonMS/master/getSalesRoleAcess?loggedUserId=${loggedUserId}`
      )
      .then((res) => {
        const data = res.data;
        setSeOptions(data[0].is_create);
      });
  };
  useEffect(() => {
    seDropDown();
  }, []);

  //----------------------call-----------------------------------
  const [datawrite, setDatawrite] = useState();
  const getVendorList = () => {
    axios
      .get(
        baseUrl +
          `/SalesMS/software/getSalesWriteAccess?loggedUserId=${loggedUserId}`
      )
      .then((res) => {
        const data = res.data;

        setWriteData(data[0].result);
        setDatawrite(data[0].result);
      });
  };
  useEffect(() => {
    getVendorList();
  }, [datawrite]);

  const saveTargetDetails = () => {
    // const modifiedData = serTargetObj.length === 0;
    // if (modifiedData) {

    axios
      .post(
        baseUrl +
          `/SalesMS/software/saveSWTargets?loggedUserId=${loggedUserId}&reportRunId=${serTargetData.reportRunId}`,
        serTargetObj
      )
      .then((resp) => {
        getData1();
      })
      .catch((err) => {
        // Handle error
        console.log(err);
      });
    // // } else {
    // //   // ...
    // //   setErrorMessage(true);
    // //   setTimeout(() => {
    // //     setErrorMessage(false);
    // //   }, 3000);
    // }
  };

  // ----------------table renderer-------------------------
  const clickExpandcols = (quartr) => {
    setcolexpanded((prevState) => {
      return prevState.includes(quartr)
        ? prevState.filter((item) => item !== quartr)
        : [...prevState, quartr];
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
  const onSerTargetEnter = (e, i) => {
    const { value, id } = e.target;
    const newData = [...prevState.data];
    newData[i][keys] = value;
    setSerTargetData({ ...serTargetData, data: newData });
  };

  let inputdata = "0";
  const upddateSertargetData = (
    e,
    pAtt,
    i,
    executive,
    targetCat,
    targetCatId,
    keyAttr
  ) => {
    let toBeUpdatedSerTarget = { ...serTargetData };
    let data = toBeUpdatedSerTarget.data;
    const { value, id } = e.target;
    inputdata = value;
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
    // Clone the object at the specified index
    const updatedData = { ...data[i] };
    updatedData[id] = value;

    // Update the object at the specified index in the original data array
    data[i] = updatedData;
    const keysData =
      "id,executive,execStatus,lvl,count,targetCat,targetCatId,name,isEdit,keyAttr,parentAttr,isActive,2023_Q2_target,2022_07_01_target,2022_08_01_target,2022_09_01_target,2023_Q3_target,2022_10_01_target,2022_11_01_target,2022_12_01_target,2023_Q4_target,2023_01_01_target,2023_02_01_target,2023_03_01_target,2024_Q1_target,2023_04_01_target,2023_05_01_target,2023_06_01_target,total_target,";
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
    let currIndexKeys = Object.keys(data[i]);
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
    const exeSumIndex = data.findIndex((element) => element.keyAttr === pAtt);
    if (quarChecker === "quar") {
      let total = 0;
      Object.keys(data[i]).forEach((d) => {
        if (d.includes("Q")) {
          total = total + parseInt(data[i][d]);
        }
      });
      data[i]["total_target"] = total;
      let execName = data[i]["executive"];
      let topCount = data
        .filter((d) => d.executive == execName)
        .filter((d, i) => i > 0)
        .map((d) => d[id])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let totalTargetsubCountCust = data
        .filter((d) => d.executive == execName)
        .filter((d, i) => i > 0)
        .map((d) => d["total_target"])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let summaryQuarterCount = data
        .filter((d) => d.lvl == 2)
        .map((d) => d[id])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let totalTargetTopCount = data
        .filter((d) => d.lvl == 2)
        .map((d) => d["total_target"])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      data[exeSumIndex][id] = topCount;
      data[exeSumIndex]["total_target"] = totalTargetsubCountCust;
      data[1]["total_target"] = totalTargetTopCount;
      data[1][id] = summaryQuarterCount;

      var monVal = Math.floor(value / 3);
      data[i][finalKey[0]] = monVal;
      data[i][finalKey[1]] = monVal;
      data[i][finalKey[2]] = monVal + (value % 3);

      let monthOneSummaryCount = data
        .filter((d) => d.lvl == 2)
        .map((d) => d[finalKey[0]])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let monthTwoSummaryCount = data
        .filter((d) => d.lvl == 2)
        .map((d) => d[finalKey[1]])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let monthThreeSummaryCount = data
        .filter((d) => d.lvl == 2)
        .map((d) => d[finalKey[2]])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

      data[1][finalKey[0]] = monthOneSummaryCount;
      data[1][finalKey[1]] = monthTwoSummaryCount;
      data[1][finalKey[2]] = monthThreeSummaryCount;

      let monthOneTopCount = data
        .filter((d) => d.executive == execName)
        .filter((d, i) => i > 0)
        .map((d) => d[finalKey[0]])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let monthTwoTopCount = data
        .filter((d) => d.executive == execName)
        .filter((d, i) => i > 0)
        .map((d) => d[finalKey[1]])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let monthThreeTopCount = data
        .filter((d) => d.executive == execName)
        .filter((d, i) => i > 0)
        .map((d) => d[finalKey[2]])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

      data[exeSumIndex][finalKey[0]] = monthOneTopCount;
      data[exeSumIndex][finalKey[1]] = monthTwoTopCount;
      data[exeSumIndex][finalKey[2]] = monthThreeTopCount;
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
      Object.keys(data[i]).forEach((d) => {
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
            Qualtertotal = Qualtertotal + parseInt(data[i][d]);
          }
        }
        if (d.includes(quarters)) {
          quaterId = d;
        }
      });
      data[i][quaterId] = Qualtertotal;

      let total = 0;
      Object.keys(data[i]).forEach((d) => {
        if (d.includes("Q")) {
          total = total + parseInt(data[i][d]);
        }
      });
      data[i]["total_target"] = total;
      let execName = data[i]["executive"];
      let splitedExecName = data[i]["executive"].split("^&");

      let montopCount = data
        .filter((d) => d.executive == execName)
        .filter((d, i) => i > 0)
        .map((d) => d[id])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let montotalTargetTopCount = data
        .filter((d) => d.lvl == 2)
        .map((d) => d["total_target"])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let montotalTargetsubCount = data
        .filter((d) => d.executive?.includes(splitedExecName[0]))
        .filter((d) => d.lvl > 2)
        .map((d) => d["total_target"])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let montotalTargetsubCountCust = data
        .filter((d) => d.executive == execName)
        .filter((d, i) => i > 0)
        .map((d) => d["total_target"])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
      let monsummaryQuarterCount = data
        .filter((d) => d.lvl == 2)
        .map((d) => d[id])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

      data[exeSumIndex][id] = montopCount;
      data[exeSumIndex]["total_target"] = montotalTargetsubCountCust;
      data[1]["total_target"] = montotalTargetTopCount;
      data[1][id] = monsummaryQuarterCount;

      data[1][quaterId] = data
        .filter((d) => d.lvl == 2)
        .map((d) => d[quaterId])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

      data[exeSumIndex][quaterId] = data
        .filter((d) => d.executive == execName)
        .filter((d, i) => i > 0)
        .map((d) => d[quaterId])
        .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);

      let arr = data;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]["executive"] == splitedExecName[0] + "^&  ") {
          arr[i]["total_target"] = montotalTargetsubCount;
        }
      }
      console.log(arr);
    }
    const newState = { ...serTargetData, data: data };
    setSerTargetData({ ...serTargetData, data: data });
    //============To Post The data ==================
    const targetDataArray = [];
    const parts = targetCatId.split("-");

    // Find the part that starts with a number
    let targetCatId1 = "";
    for (const part of parts) {
      if (!isNaN(parseInt(part))) {
        targetCatId1 = part;
        break;
      }
    }
    const createTargetData = (month, value) => ({
      executiveId: executive,
      month,
      typ: "target",
      val: parseInt(value),
      targetCatId: parseInt(targetCatId1),
      reportRunId: serTargetData.reportRunId,
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
    // setSerTargetObj({ ...serTargetObj, data: targetDataArray });
    setSerTargetObj((prevState) => {
      // Check if prevState is defined and has a "data" property
      if (prevState && prevState.data) {
        // Concatenate the existing "data" array with targetDataArray
        prevState.data = [...prevState.data, ...targetDataArray];
        return prevState;
      } else {
        // If prevState is not defined or doesn't have a "data" property, create a new object
        return { data: [...targetDataArray] };
      }
    });
  };

  const onSerTargetUpdate = (
    e,
    pAtt,
    i,
    executive,
    targetCat,
    targetCatId,
    keyAttr
  ) => {
    upddateSertargetData(
      e,
      pAtt,
      i,
      executive,
      targetCat,
      targetCatId,
      keyAttr
    );
  };

  useEffect(() => {
    setSerTargetData(JSON.parse(JSON.stringify(tableData)));
  }, [tableData]);

  const [table, settable] = useState([]);

  useEffect(() => {
    const nonIntegersvals = ["executive", "name"];
    const expandableCols = ["total_target"];
    const horizontalcolexpands = ["target", "call"];
    let headspanner = "";
    // toggler =
    //   data["lvl"] === 2 || data["lvl"] === 3
    //     ? toggler
    //     : expanded.includes(data.executive)
    //     ? 1
    //     : 0;
    const setTargetDataTemp = { ...serTargetData };
    const table1 =
      Object.keys(setTargetDataTemp).length > 0 &&
      setTargetDataTemp?.data?.map((data, i) => {
        let table = [];
        const conditions = [
          "id",
          "execStatus",
          "count",
          "isActive",
          "isEdit",
          "keyAttr",
          "lvl",
          "parentAttr",
          "targetCat",
          "targetCatId",
          "executive",
        ];
        const keysArray = filteredKeysArray;
        keysArray.forEach((keys) => {
          if (keys.includes("Q")) {
            coltoggler = colexpanded.includes(keys.split("_")[1]) ? 1 : 0;
          }
          table.push(
            data.id < 0 ? (
              <th
                className={
                  (keys.split("_")[3] === "targetFirstTh"
                    ? ""
                    : keys.split("_")[2]) + " targetth targetFirstTh"
                }
                key={keys}
                colSpan={data[keys]?.split("^&")[2]}
                rowSpan={data[keys]?.split("^&")[1]}
                style={{
                  display:
                    coltoggler === 0 &&
                    horizontalcolexpands?.some((item) =>
                      keys?.includes(item)
                    ) &&
                    !(keys?.includes("Q") || keys?.includes("total"))
                      ? "none"
                      : "",
                  textAlign: "center",
                }}
                title={data[keys].split("^")[0]}
              >
                {data.id === -2 && data[keys]?.includes("Quart") ? (
                  <span
                    onClick={() => {
                      clickExpandcols(keys.split("_")[1]);
                    }}
                  >
                    {colexpanded.includes(keys.split("_")[1]) ? (
                      <div title={data[keys].split("^")[0]}>
                        <FaChevronCircleLeft
                          size={"0.8em"}
                          title="Hide Details"
                          style={{ cursor: "pointer", float: "right" }}
                        />
                        {data[keys].split("^")[0]}
                      </div>
                    ) : (
                      <div title={data[keys].split("^")[0]}>
                        <FaChevronCircleRight
                          size={"0.8em"}
                          title="Show Details"
                          style={{ cursor: "pointer", float: "right" }}
                        />
                        {data[keys].split("^")[0]}
                      </div>
                    )}
                  </span>
                ) : (
                  <span> {data[keys]?.split("^")[0]}</span>
                )}
              </th>
            ) : (
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
                    : keys.includes("lvl" != 2)
                    ? "summer"
                    : "winter"
                }
                title={data[keys]}
                style={{
                  display:
                    coltoggler === 0 &&
                    horizontalcolexpands.some((item) => keys.includes(item)) &&
                    !(keys.includes("Q") || keys.includes("total"))
                      ? "none"
                      : "",
                  // textAlign: keys.split("_")[1] % 2 !== 0 ? "end": ""
                  textAlign: typeof data[keys] === "number" ? "right" : "",
                }}
              >
                {nonIntegersvals.includes(keys) ? (
                  <Fragment>
                    {data["lvl"] == 2 || data["name"] === "summary" ? (
                      <td
                        className="ellipsis oddd summaryTraget"
                        data-toggle="tooltip"
                        style={{ fontWeight: "bold" }}
                        title={data[keys].toLocaleString("en-IN")}
                      >
                        {isNaN(parseFloat(data[keys]))
                          ? data[keys]
                          : parseFloat(data[keys]).toLocaleString("en-US")}
                      </td>
                    ) : (
                      <div>
                        <span>{icons[data["execStatus"]]}</span>{" "}
                        {/* <span>{data[keys]}</span> */}
                        {data.keyAttr !== "summary" && (
                          <MdOutlineEditNote
                            style={{ float: "right", cursor: "pointer" }}
                            title="Notes"
                            size={"1.5em"}
                            onClick={() => {
                              setOpenPopup(true);
                              setRowData(data);
                            }}
                          />
                        )}
                        <span
                          className="reddd"
                          style={{ fontWeight: "bold" }}
                          title={data[keys].toLocaleString("en-IN")}
                        >
                          {isNaN(parseFloat(data[keys]))
                            ? data[keys]
                            : parseFloat(data[keys]).toLocaleString("en-US")}
                        </span>
                      </div>
                    )}
                  </Fragment>
                ) : (
                  <Fragment>
                    {data.lvl === 2 &&
                    keys !== "total_target" &&
                    accessData === 1000 ? (
                      <input
                        type="text"
                        id={keys}
                        // defaultValue={
                        //   data[keys].match(/\d+/)
                        //     ? parseInt(data[keys]).toLocaleString("en-IN")
                        //     : data[keys]
                        // }

                        value={serTargetData.data[i][keys]}
                        onChange={(e) => {
                          const inputValue =
                            e.target.value.trim() === "" ? "0" : e.target.value;
                          const newData = [...serTargetData.data]; // Create a copy of the data array
                          newData[i][keys] = inputValue; // Update the specific value
                          setSerTargetData({ ...serTargetData, data: newData });
                          setTargetId(data.targetCatId);
                          // Update the state
                        }}
                        onBlur={(e) => {
                          onSerTargetUpdate(
                            e,
                            data.parentAttr,
                            i,
                            data.id,
                            data.targetCatId,
                            // data.targetCat,
                            data.keyAttr
                          );
                          onSerTargetEnter(e, i);
                          setTargetId(data.targetCatId);
                        }}
                        style={{ textAlign: "right" }}
                      ></input>
                    ) : (
                      <span>
                        {" "}
                        {isNaN(parseFloat(data[keys]))
                          ? data[keys]
                          : parseFloat(data[keys]).toLocaleString("en-US")}
                      </span>
                    )}
                  </Fragment>
                )}
              </td>
            )
          );
          headspanner = keys;
        });
        return <tr key={data.id}>{table} </tr>;
      });
    settable(table1);
  }, [serTargetData, colexpanded]);

  useEffect(() => {
    console.log(serTargetData);
  }, [serTargetData]);

  useEffect(() => {}, [table]);
  const resetClickHandler = () => {
    let emptyClassList = document.getElementsByClassName("empty");
    for (let i = 0; i < emptyClassList.length; i++) {
      let splitData = emptyClassList[i].id.split("__");
      let row = parseInt(splitData[1]);
      let col = splitData[2];
      emptyClassList[i].value = serTargetData.data[row][col];
    }
    setSerTargetData(tableData);
    setSerTargetObj([]);
  };
  const [openSave, setOpenSave] = useState(false);
  function SavePopup(props) {
    const { openSave, setOpenSave, saveTargetDetails } = props;
    return (
      <div className="reviewLogDeletePopUp">
        <CModal size="sm" visible={openSave} onClose={() => setOpenSave(false)}>
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Save Targets</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            Targets will change with new values provided, Are you sure ?
            <div className="row" style={{ marginTop: "10px" }}>
              <button
                style={{ marginLeft: "95px" }}
                type="submit"
                className="btn btn-primary col-2"
                onClick={() => {
                  saveTargetDetails();
                  setOpenSave(false);
                }}
              >
                <span style={{ paddingLeft: "6px" }}>Yes</span>
              </button>
              <button
                style={{ marginLeft: "20px" }}
                type="submit"
                className="btn btn-primary col-2"
                onClick={() => {
                  setOpenSave(false);
                }}
              >
                <span style={{ paddingLeft: "6px" }}>No</span>
              </button>
            </div>
          </CModalBody>
        </CModal>
      </div>
    );
  }

  // Define a custom sorting function to sort based on quarters

  const handleOnExport = () => {
    const excludeProperties = [
      "id",
      "execStatus",
      "lvl",
      "count",
      "isEdit",
      "keyAttr",
      "parentAttr",
      "isActive",
    ];
    const data = tableData.data;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SalesTarget");

    const dynamicDateKeys = Object.keys(data[0]).filter((key) =>
      key.includes("_target")
    );

    const order = [
      "Q1",
      "04",
      "05",
      "06",
      "Q2",
      "07",
      "08",
      "09",
      "Q3",
      "10",
      "11",
      "12",
      "Q4",
      "01",
      "02",
      "03",
    ];

    const sortedDynamicDateKeys = dynamicDateKeys.sort((a, b) => {
      const [aPart1, aPart2] = a.split("_")[1].split("-");
      const [bPart1, bPart2] = b.split("_")[1].split("-");
      const aIndex = order.indexOf(aPart1) * 100 + order.indexOf(aPart2);
      const bIndex = order.indexOf(bPart1) * 100 + order.indexOf(bPart2);
      return aIndex - bIndex;
    });

    const totalTargetIndex = sortedDynamicDateKeys.indexOf("total_target");

    if (totalTargetIndex !== -1) {
      sortedDynamicDateKeys.splice(totalTargetIndex, 1);
      sortedDynamicDateKeys.push("total_target");
    }

    const headerRow = worksheet.addRow([
      "Sales Executive",
      ...sortedDynamicDateKeys,
    ]);

    // Add data rows
    // Add data rows
    for (let i = 1; i < data.length; i++) {
      const rowData = data[i];
      const filteredItem = Object.fromEntries(
        Object.entries(rowData).filter(
          ([key]) => !excludeProperties.includes(key)
        )
      );

      const values = [
        filteredItem.name,
        ...sortedDynamicDateKeys.map((dateKey) => filteredItem[dateKey]),
      ];

      const row = worksheet.addRow(values);

      // Adjust alignment for all columns except the first one (index 1)
      for (
        let colIndex = 2;
        colIndex <= sortedDynamicDateKeys.length + 1;
        colIndex++
      ) {
        const column = worksheet.getColumn(colIndex);
        column.alignment = { horizontal: "right" };
      }
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
    <div className="col-lg-12 col-md-12 col-sm-12  customCard">
      <div className="col-lg-12 col-md-12 col-sm-12 no-padding targetTablePrnt scrollit ">
        <RiFileExcel2Line
          size="1.5em"
          title="Export to Excel"
          style={{
            color: "green",
            float: "right",
            marginTop: "24px",
            fontSize: "16px",
          }}
          cursor="pointer"
          onClick={handleOnExport}
        />
        <span>
          <b style={{ color: "#297ab0", fontSize: "15px" }}>Targets</b>
        </span>

        <div
          className="mainTargetTable darkHeader"
          style={{ width: "94%", maxHeight: "400px", overflow: "auto" }}
        >
          <table
            className="table table-bordered table-striped targetTable scrollit "
            style={{ width: "auto" }}
          >
            <thead>{table}</thead>
          </table>
        </div>
      </div>
      <div className="col-md-12 col-sm-12 col-xs-12 no-padding center">
        <div className="clearfix" style={{ height: "25px" }}></div>

        {buttonAction && accessData === 1000 ? (
          <div className="col-md-12 col-sm-12 col-xs-12 no-padding btn-container center my-3 mb-2">
            {/* <div className="clearfix" style={{ height: '25px' }}></div> */}

            <button
              type="button"
              className="btn btn-primary"
              // onClick={saveTargetDetails}
              onClick={() => setOpenSave(true)}
            >
              <FaSave />
              Save{" "}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              // onClick={getInsideSalesProgressDetails}
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
        {/* <button type="button" className="btn btn-primary" onClick={getInsideSalesProgressDetails} ><BiReset />Reset </button> */}
      </div>
      {openPopup ? (
        <DisplayPopUpEditNote
          openPopup={openPopup}
          accessData={accessData}
          setOpenPopup={setOpenPopup}
          Vdata={tableData}
          rowData={rowData}
          popupValue={popupValue}
        />
      ) : (
        ""
      )}
      {openSave ? (
        <SavePopup
          openSave={openSave}
          setOpenSave={setOpenSave}
          saveTargetDetails={saveTargetDetails}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default tableRendere;
