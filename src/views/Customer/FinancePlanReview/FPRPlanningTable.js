import React, { useEffect, useState } from "react";
import MaterialReactTable from "material-react-table";
import { v4 as uuidv4 } from "uuid";
import { Button } from "bootstrap";
import { Box, IconButton } from "@mui/material";
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import { Input } from "antd";
import FPRGoalsandNotes from "./FPRGoalsandNotes";
// import { FaInfoCircle } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Column } from "primereact/column";
import moment from "moment";

import axios from "axios";
import { environment } from "../../../environments/environment";
import { RiFileExcel2Line } from "react-icons/ri";
import { VscSave } from "react-icons/vsc";
import { BiReset } from "react-icons/bi";
import { Link } from "react-router-dom";
import PlRevTable from "./PlRevTable";
import useDynamicMaxHeight from "../../PrimeReactTableComponent/useDynamicMaxHeight";

export const FPRPlanningTable = (props) => {
  const {
    tableData,
    reportRunId,
    servicesPayload,
    goalsPopup,
    setGoalsPopup,
    loggedUserId,
    handleSaveClick,
    validationMs,
    exportExcel,
  } = props;
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [initialHiddenCols, setInitialHiddenCols] = useState({});
  const [hiddenColumns, setHiddenColumns] = useState({});
  const [initialHiddenColsTwo, setInitialHiddenColsTwo] = useState({});
  const [colExpFlag, setColumnExpFlag] = useState(false);
  const [colExpFlagOne, setColumnExpFlagOne] = useState(false);
  const [colExpFlagTwo, setColumnExpFlagTwo] = useState(false);
  const [colExpFlagThree, setColumnExpFlagThree] = useState(false);
  const [colExpFlagFour, setColumnExpFlagFour] = useState(false);
  const [updatedRowId, setUpdatedRowId] = useState([]);
  const [resetFlag, setResetFlag] = useState(true);
  const [backupData, setBackupData] = useState([]);
  const [newMonth, setNewMonth] = useState([]);
  const [dataPR, setDataPR] = useState([{}]);
  let row = 25;
  const [newHeaderData, setNewHeaderData] = useState([]);
  const [newTableData, setNewTableData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [goalData, setGoalData] = useState();
  const [noteData, setNoteData] = useState();
  const [rowData, setRowData] = useState();
  const [mainCustomerRecords, setMainCustomerRecords] = useState({});
  const [countryRecords, setCountryRecords] = useState({});
  const [showPRFlag, setShowPRFlag] = useState(false);
  const baseUrl = environment.baseUrl;

  const [classify, setClassify] = useState([
    { value: "1097", label: "Key" },
    { value: "1098", label: "Strategic" },
    { value: "1099", label: "Growth" },
    { value: "1100", label: "Invest" },
    { value: "1101", label: "Others" },
  ]);

  const [colId, setColumnId] = useState("");
  const [fprCompareDataCopy, setFprCompareDataCopy] = useState();
  // ===================useEffect start=====================
  const materialTableElement = document.getElementsByClassName(
    "materialReactExpandableTable darkHeader toHead timesheetTable planningTable PAC-FPR-Table"
  );

  const maxHeight = useDynamicMaxHeight(materialTableElement) - 120;

  useEffect(() => {
    if (tableData) {
      tableData.slice(3)?.forEach((object) => {
        Object.keys(object).forEach((item) => {
          let value = object[item];
          if (item.includes("_") && item != "is_prospect") {
            object[item] = parseFloat(value);
          }
        });
      });
      const newFprCompareDataCopy = JSON.parse(JSON.stringify(tableData));
      setFprCompareDataCopy(newFprCompareDataCopy);
    }
  }, [tableData]);

  useEffect(() => {
    if (fprCompareDataCopy) {
      const copyData = [...fprCompareDataCopy];
      // console.log(copyData, "copyData");
      setRows(copyData?.slice(3));
      defineColumns();
    }
  }, [fprCompareDataCopy, resetFlag, mainCustomerRecords, open]);

  useEffect(() => {
    if (colId != "") {
      if (
        (colExpFlag == false && colId == "customer") ||
        (colId?.includes("Q1") && colExpFlagOne == true) ||
        (colId?.includes("Q2") && colExpFlagTwo == true) ||
        (colId?.includes("Q3") && colExpFlagThree == true) ||
        (colId?.includes("Q4") && colExpFlagFour == true)
      ) {
        expandT();
      } else {
        expandF();
      }
      defineColumnsTwo();
    }
  }, [
    colExpFlag,
    colExpFlagOne,
    colExpFlagTwo,
    colExpFlagThree,
    colExpFlagFour,
    resetFlag,
    fprCompareDataCopy,
  ]);

  const expandT = () => {
    count++;
    let finalHiddenCols = {};
    if (colId == "customer") {
      let filteredKeys = Object.keys(initialHiddenCols).filter((key) => {
        return (
          key != "salesPartner" && key != "delPartner" && key != "CSLPartner"
        );
      });
      filteredKeys.forEach((key) => {
        finalHiddenCols[key] = initialHiddenCols[key];
      });
      setInitialHiddenCols(finalHiddenCols);
    } else {
      let parts = colId.split("_");
      parts.pop();
      let resultString = parts.join("_");
      let filteredKeys = Object.keys(initialHiddenCols).filter(
        (key) => !key.includes(resultString)
      );
      filteredKeys.forEach((key) => {
        finalHiddenCols[key] = initialHiddenCols[key];
      });
      setInitialHiddenCols(finalHiddenCols);
    }
  };
  const expandF = () => {
    countNw++;
    let finalHiddenCols = {};
    let tempHiddenCols = {};
    if (colId == "customer") {
      count++;
      finalHiddenCols = { ...initialHiddenColsTwo, ...initialHiddenCols };
      setInitialHiddenCols(finalHiddenCols);
    } else {
      let parts = colId.split("_");
      parts.pop();
      let resultString = parts.join("_");
      let filteredKeys = Object.keys(hiddenColumns).filter((key) =>
        key.includes(resultString)
      );
      filteredKeys.forEach((key) => {
        tempHiddenCols[key] = hiddenColumns[key];
      });
      finalHiddenCols = { ...initialHiddenCols, ...tempHiddenCols };
      setInitialHiddenCols(finalHiddenCols);
    }
  };

  const getGoalsandNotes = (data) => {
    setRowData(data);
    const postData = {
      customerId: data.id,
      countryId: data.countryId,
      plan: servicesPayload.viewtype,
      month: servicesPayload.quarter,
      duration: servicesPayload.duration,
      pageReq: "",
      isp: 0,
    };

    axios({
      method: "POST",
      url: baseUrl + `/customersms/financialPlanandReview/getAccountGoals`,
      data: postData,
    }).then((response) => {
      //   let goalData = response.data.goals?.filter((d) => d.id != -1);
      setGoalsPopup(true);
      setGoalData(response.data.goals);
      setNoteData(response.data.notes);
    });
  };

  // // =====================useEffect end=========================
  const handleChange = (rowData, field, value) => {
    let accountPlan = [];
    const updatedData = [...fprCompareDataCopy];
    const rowIndex = updatedData.findIndex(
      (item) => item.id == rowData.id && item.countryId == rowData.countryId
    );
    updatedData[rowIndex] = {
      ...rowData,
      [field]: value == "<< Please Select >>" ? null : value,
    };
    setFprCompareDataCopy(updatedData);

    let customerId = rowData.id;
    let countryId = rowData.countryId;
    let cData = {
      customerId: customerId,
      countryId: countryId,
      classification: value == "<< Please Select >>" ? null : value,
      isp: "0",
      plan: accountPlan,
    };
    setCountryRecords((prevVal) => {
      let objCopy = mainCustomerRecords.hasOwnProperty(customerId)
        ? { ...prevVal }
        : {};
      objCopy[countryId] = cData;
      setMainCustomerRecords((prev) => {
        let dataCopy = { ...prev };
        !mainCustomerRecords?.hasOwnProperty(customerId)
          ? (dataCopy[customerId] = objCopy)
          : (dataCopy[customerId][countryId] = objCopy[countryId]);
        // console.log(dataCopy, 'dataCopy');
        return dataCopy;
      });
      return objCopy;
    });
  };

  const numberWithCommas = (x) => {
    //console.log(typeof x);
    var number = String(x);
    // console.log(typeof number);
    //console.log(number.includes(".") ? number : "");
    if (number.includes(".") == true) {
      var decimalNumbers = number;
      var num = Number(decimalNumbers);
      let FdN = num != null && num?.toFixed(2);
      let final = FdN.split(".");
      final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");
      //console.log(
      // final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ","),
      //final
      //);
      return final.join(".");
    } else {
      return (
        number != null && number?.replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",")
      );
    }
  };
  const handleInputBlur = (col, cell, index, focusedValue) => {
    let accountPlan = [];
    let customerId = cell.row.original.id;
    let classificationId = cell.row.original.classId;
    let countryId = cell.row.original.countryId;
    let colName = col.split("^&")[0];
    const parts = colName.split("_");
    const lastPartWithUnderscore = parts.slice(-1)[0]; // Get the last part
    const result = `_${lastPartWithUnderscore}`;
    const tempType = result;
    const partsRev = colName.split("_"); // Split the string by "_"
    const resultCol = partsRev.slice(0, -1).join("_");
    const totalEstGm =
      fprCompareDataCopy[3][resultCol + "_rev"] *
      fprCompareDataCopy[3][resultCol + "_gm"];
    const oldIndividualTotal =
      fprCompareDataCopy[index][resultCol + "_rev"] *
      fprCompareDataCopy[index][resultCol + "_gm"];
    const pervVal = fprCompareDataCopy[index][colName];
    const updatedType = tempType == "_rev" ? "revenue" : "GM";

    setFprCompareDataCopy((prevState) => {
      const dataCopy = [...prevState];
      dataCopy[index][colName] =
        focusedValue != "" ? parseFloat(focusedValue) : 0;

      dataCopy[3][colName] =
        focusedValue !== ""
          ? dataCopy[3][colName] + (dataCopy[index][colName] - pervVal)
          : 0;

      // console.log(totalEstGm, "totalEstGm");
      // console.log(oldIndividualTotal, "oldIndividualTotal");
      const newIndividualTotal =
        dataCopy[index][resultCol + "_rev"] *
        dataCopy[index][resultCol + "_gm"];
      // console.log(newIndividualTotal, "newIndividualTotal");
      let finalGm = totalEstGm + (newIndividualTotal - oldIndividualTotal);
      const currentTotalRev =
        tempType == "_rev"
          ? dataCopy[3][colName]
          : dataCopy[3][resultCol + "_rev"];
      // console.log(currentTotalRev, 'currentTotalRev');
      finalGm = finalGm / currentTotalRev;
      // console.log(finalGm, 'finalGm');

      dataCopy[3][resultCol + "_gm"] = focusedValue !== "" ? finalGm : 0;

      let firstMonth, secMonth, ThirdMonth;
      firstMonth = col.includes("Q1")
        ? "_04_01"
        : col.includes("Q2")
        ? "_07_01"
        : col.includes("Q3")
        ? "_10_01"
        : col.includes("Q4") && "_01_01";
      secMonth = col.includes("Q1")
        ? "_05_01"
        : col.includes("Q2")
        ? "_08_01"
        : col.includes("Q3")
        ? "_11_01"
        : col.includes("Q4") && "_02_01";
      ThirdMonth = col.includes("Q1")
        ? "_06_01"
        : col.includes("Q2")
        ? "_09_01"
        : col.includes("Q3")
        ? "_12_01"
        : col.includes("Q4") && "_03_01";

      let tempYr = col.split("_")[0];
      let firstMonthVal, secMonthVal, ThirdMonthVal;
      if (colName.includes("Q")) {
        tempYr = col.includes("Q4") ? tempYr : parseFloat(tempYr) - 1;
        firstMonthVal = tempYr + firstMonth + tempType;
        secMonthVal = tempYr + secMonth + tempType;
        ThirdMonthVal = tempYr + ThirdMonth + tempType;

        let addVal = Math.floor(parseInt(focusedValue) / 3);
        dataCopy[index][firstMonthVal] =
          focusedValue != ""
            ? tempType == "_rev"
              ? addVal
              : dataCopy[index][colName]
            : 0;
        dataCopy[3][firstMonthVal] =
          focusedValue != ""
            ? tempType == "_rev"
              ? dataCopy[3][firstMonthVal] + addVal
              : dataCopy[3][colName]
            : 0;

        dataCopy[index][secMonthVal] =
          focusedValue != ""
            ? tempType == "_rev"
              ? addVal
              : dataCopy[index][colName]
            : 0;
        dataCopy[3][secMonthVal] =
          focusedValue != ""
            ? tempType == "_rev"
              ? dataCopy[3][secMonthVal] + addVal
              : dataCopy[3][colName]
            : 0;

        dataCopy[index][ThirdMonthVal] =
          focusedValue != ""
            ? tempType == "_rev"
              ? parseFloat(focusedValue) - addVal * 2
              : dataCopy[index][colName]
            : 0;
        dataCopy[3][ThirdMonthVal] =
          focusedValue != ""
            ? tempType == "_rev"
              ? dataCopy[3][ThirdMonthVal] +
                (parseFloat(focusedValue) - addVal * 2)
              : dataCopy[3][colName]
            : 0;
        let planArrQ = [];
        for (let i = 0; i < 3; i++) {
          const monthColName =
            i == 0
              ? firstMonthVal
              : i == 1
              ? secMonthVal
              : i == 2
              ? ThirdMonthVal
              : "";
          const month =
            i == 0 ? firstMonth : i == 1 ? secMonth : i == 2 ? ThirdMonth : "";
          const monthVal =
            i == 0
              ? dataCopy[index][firstMonthVal]
              : i == 1
              ? dataCopy[index][secMonthVal]
              : i == 2
              ? dataCopy[index][ThirdMonthVal]
              : "";
          const obj = {
            date: tempYr + month,
            type: updatedType,
            qrtr: tempYr + firstMonth,
            val: monthVal,
          };
          const hasExist =
            tableData[index][monthColName] == obj.val ? true : false;
          if (!hasExist) {
            if (mainCustomerRecords?.hasOwnProperty(customerId)) {
              if (mainCustomerRecords[customerId].hasOwnProperty(countryId)) {
                planArrQ = mainCustomerRecords[customerId][countryId].plan;
                const indexFindQ = planArrQ.findIndex(
                  (item) =>
                    item.date === obj.date &&
                    item.qrtr === obj.qrtr &&
                    item.type === obj.type
                );
                // console.log(indexFindQ, 'index');
                indexFindQ == -1
                  ? planArrQ.push(obj)
                  : (planArrQ[indexFindQ] = obj);
              } else {
                planArrQ.push(obj);
              }
            } else {
              planArrQ.push(obj);
            }
          }
        }
        accountPlan = [...planArrQ];
        // console.log(accountPlan, 'accountPlanqt');
      } else {
        const quartName = col.split("^&")[1];
        const parts = colName.split("_"); // Split the string by "_"
        const resultMonth = parts.slice(0, -1).join("_");
        const resultYr = colName.split("_")[0];
        const qrtrMonth = quartName.includes("Q1")
          ? "_04_01"
          : quartName.includes("Q2")
          ? "_07_01"
          : quartName.includes("Q3")
          ? "_10_01"
          : quartName.includes("Q4") && "_01_01";

        firstMonthVal = tempYr + firstMonth + tempType;
        secMonthVal = tempYr + secMonth + tempType;
        ThirdMonthVal = tempYr + ThirdMonth + tempType;
        const resQrtrValIndex =
          (dataCopy[index][firstMonthVal] +
            dataCopy[index][secMonthVal] +
            dataCopy[index][secMonthVal]) /
          3;
        const resQrtrValSum =
          (dataCopy[3][firstMonthVal] +
            dataCopy[3][secMonthVal] +
            dataCopy[3][secMonthVal]) /
          3;

        let findQ = quartName + tempType;
        // console.log(findQ, 'findQ');
        dataCopy[index][findQ] =
          focusedValue !== ""
            ? tempType == "_rev"
              ? dataCopy[index][findQ] + (dataCopy[index][colName] - pervVal)
              : resQrtrValIndex
            : 0;
        dataCopy[3][findQ] =
          focusedValue !== ""
            ? tempType == "_rev"
              ? dataCopy[3][findQ] + (dataCopy[index][colName] - pervVal)
              : resQrtrValSum
            : 0;
        // console.log(resultMonth + tempType, "month");
        // console.log(dataCopy[index][resultMonth + tempType], 'value');
        const obj = {
          date: resultMonth,
          type: updatedType,
          qrtr: resultYr + qrtrMonth,
          val: dataCopy[index][resultMonth + tempType],
        };
        if (mainCustomerRecords.hasOwnProperty(customerId)) {
          if (mainCustomerRecords[customerId].hasOwnProperty(countryId)) {
            let planArr = JSON.parse(
              JSON.stringify(mainCustomerRecords[customerId][countryId].plan)
            );
            const indexFind = planArr.findIndex(
              (item) => item.date === resultMonth
            );
            // console.log(indexFind, 'index');
            indexFind == -1 ? planArr.push(obj) : (planArr[indexFind] = obj);
            // console.log(planArr, 'planArr');
            accountPlan = [...planArr];
          } else {
            accountPlan.push(obj);
          }
        } else {
          accountPlan.push(obj);
        }
      }
      let allQrtr = [];
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].header.includes("Q")) {
          allQrtr.push(columns[i].header);
        }
      }
      // console.log(allQrtr, 'allQrtr');
      let qrtrOne = allQrtr[0] + "_gm";
      let qrtrTwo = allQrtr[1] + "_gm";
      let qrtrThree = allQrtr[2] + "_gm";
      let qrtrFour = allQrtr[3] + "_gm";
      // console.log(qrtrOne, 'qrtrOne');
      if (tempType == "_rev") {
        dataCopy[index]["total" + tempType] =
          focusedValue != ""
            ? dataCopy[index]["total_rev"] +
              (dataCopy[index][colName] - pervVal)
            : 0;
        dataCopy[3]["total" + tempType] =
          focusedValue != ""
            ? dataCopy[3]["total_rev"] + (dataCopy[index][colName] - pervVal)
            : 0;
      }
      const totalQrtrIndexGm =
        dataCopy[index][qrtrOne] +
        dataCopy[index][qrtrTwo] +
        dataCopy[index][qrtrThree] +
        dataCopy[index][qrtrFour];
      const totalQrtrSumGm =
        dataCopy[3][qrtrOne] +
        dataCopy[3][qrtrTwo] +
        dataCopy[3][qrtrThree] +
        dataCopy[3][qrtrFour];
      const resQrtsIndexGm = totalQrtrIndexGm != 0 ? totalQrtrIndexGm / 4 : 0;
      const resQrtsSumGm = totalQrtrSumGm != 0 ? totalQrtrSumGm / 4 : 0;

      dataCopy[index]["total_gm"] =
        focusedValue != "" ? Math.floor(resQrtsIndexGm) : 0;
      dataCopy[3]["total_gm"] =
        focusedValue != "" ? Math.floor(resQrtsSumGm) : 0;

      return dataCopy;
    });

    let cData = {
      customerId: customerId,
      countryId: countryId,
      classification: classificationId,
      isp: "0",
      plan: accountPlan,
    };
    // console.log(mainCustomerRecords, 'mainCustomerRecords');
    setCountryRecords((prevVal) => {
      let objCopy = {};
      mainCustomerRecords?.hasOwnProperty(customerId)
        ? (objCopy = { ...prevVal })
        : (objCopy[countryId] = cData);
      setMainCustomerRecords((prev) => {
        let dataCopy = { ...prev };
        !mainCustomerRecords?.hasOwnProperty(customerId)
          ? (dataCopy[customerId] = objCopy)
          : (dataCopy[customerId][countryId] = objCopy[countryId]);
        // console.log(dataCopy, 'dataCopyonblur');
        return dataCopy;
      });
      return objCopy;
    });
  };
  console.log(showPRFlag);
  console.log(month, year);
  var count = 0;
  var countNw = 0;
  const defineColumns = () => {
    var resetValue = true;
    const updatedInitialHiddenCols = {};
    const fprCompareDataCopyNw = [...fprCompareDataCopy];
    const columnsDetails = fprCompareDataCopyNw?.slice(0, 4);
    const headerObj = columnsDetails[1];
    const myHeaderMap = new Map();
    for (const key in headerObj) {
      if (
        headerObj[key]?.toString().includes("^") &&
        !key.includes("client") &&
        !key.includes("engPartner")
      )
        myHeaderMap.set(key, headerObj[key]);
    }

    const levelThreeSubH = columnsDetails[2];
    const updatedColumns = [];
    const goalsButtonCol = {
      id: uuidv4(),
      header: "Goals",
      accessorKey: "Goals",
      Header: ({ column }) => <div className="mixerCustom">Goals</div>,
      enableEditing: false,
      Cell: ({ cell }) => (
        <>
          {cell.row.original?.customer != "Summary" ? (
            <button
              className="btn "
              style={{
                fontWeight: "bold",
                backgroundColor:
                  cell.row.original.btnCls == "green" ? "#92c564" : "#428bca",
              }}
              onClick={() => {
                getGoalsandNotes(cell.row.original);
              }}
            >
              Goals
            </button>
          ) : (
            ""
          )}
        </>
      ),
    };
    updatedColumns.push(goalsButtonCol);
    let hiddenHeaders = [];
    let initialHiddenHeaders = [];
    myHeaderMap.forEach((value, key) => {
      if (key.includes("_")) {
        const searchKeyArray = key.split("_");
        searchKeyArray.pop();
        const searchKey = searchKeyArray.join("_");
        const filteredSubHeadKeys = Object.keys(levelThreeSubH).filter((k) =>
          k.includes(searchKey)
        );
        const levelThreeCols = [];
        filteredSubHeadKeys.forEach((subhead) => {
          const searchValue = value.split("^&");
          const searchKey = subhead.split("_");
          let lastPart = searchValue[searchValue.length - 1];
          let lastPartTwo = searchKey[searchKey.length - 1];
          let subheadNw = subhead + "^&" + lastPart;
          !subhead.toString().includes("Q") &&
          !subhead.toString().includes("total")
            ? initialHiddenHeaders.push({ [subheadNw]: false })
            : "";
          if (
            (lastPartTwo == "rev" || lastPartTwo == "gm") &&
            !subhead.includes("total")
          ) {
            let colObj = {
              id: subheadNw,
              header: levelThreeSubH[subhead],
              accessorKey: subhead,
              enableHiding: true,
              enableEditing: true,
              enableRowActions: true,
              Cell: ({ cell }) => {
                return <div>{numberWithCommas(cell.getValue())}</div>;
              },
              Edit: ({ cell, column, table }) => {
                const [editedValue, setEditedValue] = useState();
                const handleInputChange = (value) => {
                  setEditedValue(value);
                };

                return (
                  <span
                    className={
                      key.includes("_")
                        ? key.split("_")[0] == "total"
                          ? " total"
                          : key.split("_")[1][1] % 2 == 0
                          ? " odd"
                          : "even"
                        : ""
                    }
                  >
                    <input
                      type="number"
                      value={resetValue ? cell.getValue() : editedValue}
                      onChange={(e) => {
                        resetValue = false;
                        handleInputChange(e.target.value);
                      }}
                      onBlur={(e) => {
                        resetValue = false;
                        let index = tableData.findIndex(
                          (item) =>
                            item.id === cell.row.original.id &&
                            item.countryId == cell.row.original.countryId
                        );
                        // console.log(index, 'index');
                        const colN = column.id.split("^&")[0];
                        // console.log(colN, 'colN');
                        // console.log(fprCompareDataCopy[index][colN], 'value');
                        // console.log(e.target.value, 'editedvalue');
                        fprCompareDataCopy[index][colN] !=
                        parseFloat(e.target.value)
                          ? handleInputBlur(
                              column.id,
                              cell,
                              index,
                              e.target.value
                            )
                          : console.log("same");
                      }}
                      // autoFocus
                    />
                  </span>
                );
              },
            };
            levelThreeCols.push(colObj);
          } else {
            let colObj = {
              id: subheadNw,
              header: levelThreeSubH[subhead],
              accessorKey: subhead,
              enableHiding: true,
              enableEditing: false,
              enableSorting: true,
              sortingFn: (rowB, rowA, columnId) => {
                return rowA.id != "0" && rowB.id != "1"
                  ? rowB.getValue(columnId) - rowA.getValue(columnId)
                  : "";
              },
              Cell: ({ cell }) => {
                return (
                  <div
                    title={numberWithCommas(cell.getValue())}
                    className={
                      key.includes("_")
                        ? key.split("_")[0] == "total"
                          ? " total"
                          : key.split("_")[1][1] % 2 == 0
                          ? " odd"
                          : "even"
                        : ""
                    }
                  >
                    {!cell.column.id.includes("_cm") &&
                    !cell.column.id.includes("total") &&
                    cell.getValue() != 0 &&
                    cell.row.original.id != 0 ? (
                      <Link
                        data-toggle="tooltip"
                        title={numberWithCommas(cell.getValue())}
                        // to={`/vendor/vendorDoc/:${}`}
                        // to={`/vendor/vendorDoc/:${cell.row.original.vendorId}`}
                        onClick={() => {
                          // console.log(key.split("_")[1], "key.split[2]");
                          getAccountPlanRevenue(
                            cell.row.original,
                            cell.column.id
                          );
                          setShowPRFlag(true);
                        }}
                        // target="_blank"
                      >
                        {/* {numberWithCommas(cell.getValue())} */}
                        {cell?.getValue()?.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </Link>
                    ) : (
                      // numberWithCommas(cell.getValue())
                      cell
                        ?.getValue()
                        ?.toLocaleString("en-IN", { maximumFractionDigits: 2 })
                    )}
                  </div>
                );
              },
            };
            levelThreeCols.push(colObj);
          }
          // levelThreeCols.push(colObj);
        });
        const mainCol = {
          id: key,
          header: value.split("^&")[0],
          accessorKey: key,
          columns: levelThreeCols,
          Header: ({ column }) => (
            <div>
              <span className="">{value.split("^&")[0]}</span>
              {/* {value}{" "} */}
              {key.toString().includes("Q") ? (
                <span>
                  <IconButton
                    onClick={() => {
                      column.id.includes("Q1")
                        ? setColumnExpFlagOne((prev) => !prev)
                        : column.id.includes("Q2")
                        ? setColumnExpFlagTwo((prev) => !prev)
                        : column.id.includes("Q3")
                        ? setColumnExpFlagThree((prev) => !prev)
                        : column.id.includes("Q4")
                        ? setColumnExpFlagFour((prev) => !prev)
                        : "";
                      setColumnId(column.id);
                    }}
                  >
                    <AiFillRightCircle size="0.7em"/>
                  </IconButton>
                </span>
              ) : null}
            </div>
          ),
          enableEditing: true,
        };
        updatedColumns.push(mainCol);
      } else {
        if (
          key == "salesPartner" ||
          key == "CSLPartner" ||
          key == "delPartner"
        ) {
          hiddenHeaders.push({ [key]: false });
        }

        let colObj = {
          id: key,
          header: value.split("^&")[0],
          accessorKey: key,
          enableColumnActions: false,
          enableHiding: true,
          enableEditing: key == "class",
          Header: ({ column }) => (
            <div className="mixerCustom">
              <span
                className={
                  key == "salesPartner" ||
                  key == "CSLPartner" ||
                  key == "delPartner"
                    ? "expandable-column"
                    : ""
                }
              >
                {value.split("^&")[0]}
              </span>
              {key == "customer" ? (
                <span>
                  <IconButton
                    onClick={() => {
                      setColumnExpFlag((prev) => !prev);
                      setColumnId(column.id);
                    }}
                  >
                    <AiFillLeftCircle size="0.7em"/>
                  </IconButton>
                </span>
              ) : null}
            </div>
          ),
          Edit: ({ cell, column, table }) => {
            return (
              <select
                id="classId"
                name="classId"
                onChange={(e) => {
                  handleChange(cell.row.original, "classId", e.target.value);
                }}
                className=" text cancel ellipsis"

                // required
              >
                <option>&lt;&lt; Please Select &gt;&gt;</option>
                {/* <option value="1097">Key</option>
                <option value="1098">Strategic</option>
                <option value="1099">Growth</option>
                <option value="1100">Invest</option>
                <option value="1101">Others</option> */}
                {classify.map((Item) => (
                  <option
                    value={Item.value}
                    selected={
                      cell.row.original.classId == Item.value ? true : false
                    }
                  >
                    {" "}
                    {Item.label}
                  </option>
                ))}
              </select>
            );
          },
          enableSorting: true,
          sortingFn: (rowB, rowA, columnId) => {
            return rowA.id != "0" && rowB.id != "1"
              ? rowA.getValue(columnId).localeCompare(rowB.getValue(columnId))
              : "";
          },
          Cell: ({ cell }) => (
            <div
              className={
                key == "salesPartner" ||
                key == "CSLPartner" ||
                key == "delPartner"
                  ? "expandable-column ellipsis"
                  : "ellipsis"
              }
              title={cell.getValue()}
            >
              {cell.column.id == "class" && cell.row.original.id == 0
                ? ""
                : cell.getValue()}
            </div>
          ),
        };
        updatedColumns.push(colObj);
      }
    });

    setColumns(updatedColumns);
    if (resetFlag) {
      setInitialHiddenCols(Object.assign({}, ...initialHiddenHeaders));

      setInitialHiddenColsTwo(Object.assign({}, ...hiddenHeaders));
      setHiddenColumns(
        Object.assign({}, ...hiddenHeaders, ...initialHiddenHeaders)
      );
      setResetFlag(false);
    }
  };

  const defineColumnsTwo = () => {
    let expandClass = "";
    if (
      (colExpFlag == true ||
        colExpFlagOne == true ||
        colExpFlagTwo == true ||
        colExpFlagThree == true ||
        colExpFlagFour == true) &&
      count > 0
    ) {
      expandClass = "expanded";
    } else {
      expandClass = "";
    }

    setColumns((prevData) => {
      const updatedColumnsTwo = [...prevData];
      const index = updatedColumnsTwo.findIndex(
        (obj) => obj.accessorKey === colId
      );
      const updatedObject =
        colId == "customer"
          ? {
              ...updatedColumnsTwo[index],
              Header: ({ column }) => (
                <div>
                  <span className="mixerCustom">
                    {updatedColumnsTwo[index].header}
                  </span>
                  <span className={`expandIcon ${expandClass}`}>
                    <IconButton
                      onClick={() => {
                        setColumnExpFlag((prev) => !prev);
                        setColumnId(column.id);
                      }}
                    >
                      <AiFillLeftCircle size="0.7em" />
                    </IconButton>
                  </span>
                </div>
              ),
              // Cell: ({ cell }) => (
              //   <div title={cell.getValue()}>{cell.getValue()}</div>
              // ),
            }
          : {
              ...updatedColumnsTwo[index],
              Header: ({ column }) => (
                <div>
                  <span className="">{updatedColumnsTwo[index].header}</span>
                  <span className={`expandIcon ${expandClass}`}>
                    <IconButton
                      onClick={() => {
                        column.id.includes("Q1")
                          ? setColumnExpFlagOne((prev) => !prev)
                          : column.id.includes("Q2")
                          ? setColumnExpFlagTwo((prev) => !prev)
                          : column.id.includes("Q3")
                          ? setColumnExpFlagThree((prev) => !prev)
                          : column.id.includes("Q4")
                          ? setColumnExpFlagFour((prev) => !prev)
                          : "";
                        setColumnId(column.id);
                      }}
                    >
                      <AiFillRightCircle size="0.7em"/>
                    </IconButton>
                  </span>
                </div>
              ),
              // Cell: ({ cell }) => (
              //   <div title={cell.getValue()}>{cell.getValue()}</div>
              // ),
            };
      updatedColumnsTwo[index] = { ...updatedObject };
      return updatedColumnsTwo;
    });
  };

  const handleReset = () => {
    const newFprCompareDataCopyTwo = JSON.parse(JSON.stringify(tableData));
    setFprCompareDataCopy(newFprCompareDataCopyTwo);
    setMainCustomerRecords({});
  };
  const setValidation = (v) => {
    validationMs(v);
  };
  const handleSave = () => {
    // console.log(tableData, 'tableData');
    // console.log(fprCompareDataCopy, 'fprCompareDataCopy');
    let isEmpty = true;
    for (let key in mainCustomerRecords) {
      for (let obj in mainCustomerRecords[key]) {
        const rowIndex = tableData.findIndex(
          (item) => item.id == key && item.countryId == obj
        );
        if (
          mainCustomerRecords[key][obj].plan.length != 0 ||
          tableData[rowIndex]["classId"] !=
            mainCustomerRecords[key][obj].classification
        ) {
          isEmpty = false;
          break;
        }
      }
    }
    if (!isEmpty) {
      setValidation("save");
      const dataArr = [];
      const dataObj = {};
      let finalObj = {};
      Object.keys(mainCustomerRecords).forEach((obj) => {
        let allDataArr = [];
        let allDataObj = {};
        Object.keys(mainCustomerRecords[obj]).forEach((key) => {
          allDataArr.push(mainCustomerRecords[obj][key]);
        });
        allDataObj["allData"] = allDataArr;
        // console.log(allDataObj, 'allDataObj');
        dataArr.push(allDataObj);
      });
      dataObj["data"] = dataArr;
      finalObj["saveData"] = dataObj;
      // console.log(finalObj, 'finalObj');
      axios({
        method: "post",
        url: `http://10.11.12.149:8090/customersms//financialPlanandReview/saveAccountPlan`,
        // url: `http://localhost:8097/customersms//financialPlanandReview/saveAccountPlan`,

        data: finalObj,
      })
        .then((response) => {
          // console.log(response, "responsesahid");
          // handleSaveClick();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setValidation("noChange");
    }
    setMainCustomerRecords({});
  };
  const cleanNumericValue = (value) => {
    // Remove commas from the value and convert it to an integer
    return parseInt(value.replace(/,/g, ""), 10);
  };
  const getAccountPlanRevenue = (row, key) => {
    // let month = key.split("_").slice(0, 3);
    // month = month.join("-");
    // Extracting year using regular expression

    // const yearRegex = /(\d{4})_/;
    // const yearMatch = key.match(yearRegex);
    // const year = yearMatch ? yearMatch[1] : null;
    let monthNew;
    // const quarterMonth = key.split('_')[1];
    // switch (quarterMonth) {
    //   case 'Q1':
    //     monthNew 'January';
    //     break;
    //   case 'Q2':
    //     monthNew 'April';
    //     break;
    //   case 'Q3':
    //     monthNew 'July';
    //     break;
    //   case 'Q4':
    //     monthNew 'October';
    //     break;
    //   default:
    //     monthNew ''; // Handle invalid key data
    // }
    let year;
    const quarter = key.split("_")[1];

    switch (quarter) {
      case "Q1":
        year = "2024-04-01";
        monthNew = "April";
        break;
      case "Q2":
        year = "2024-07-01";
        monthNew = "July";

        break;
      case "Q3":
        year = "2024-10-01";
        monthNew = "October";

        break;
      case "Q4":
        year = "2024-01-01";
        monthNew = "January";

        break;
      default:
        year = null; // Handle invalid quarter
    }

    console.log("Year:", year);
    console.log("Year:", monthNew);
    setNewMonth(monthNew);
    console.log(row);
    console.log(key);
    const newKeyVal = key.split("_")[2];
    console.log(newKeyVal.split("^"[1]));
    const NewmeasureType = key.split("_")[2].split("^")[0];
    const date1 = new Date(key.split("_")[0], key.split("_")[1] - 1, 1);
    console.log(date1);
    // const NewQuarter = key.split("_")[1];
    // switch (NewQuarter) {
    //   case "Q1":
    //     return "January";
    //   case "Q2":
    //     return "April";
    //   case "Q3":
    //     return "July";
    //   case "Q4":
    //     return "October";
    //   default:
    //     return "";
    // }
    // Get the month name from the Date object
    // setMonth(date.toLocaleString("default", { month: "short" }));
    let month = key.split("_").slice(0, 3);

    month = month.join("-");

    const date = new Date(key.split("_")[0], key.split("_")[1] - 1, 1);
    console.log(date);
    // Get the month name from the Date object
    setMonth(date.toLocaleString("default", { month: "short" }));
    setYear(key.split("_")[0]);
    const postData = {
      month: year,
      customerId: row.id,
      countryId: row.countryId,
      reportRunId: reportRunId,
      userType: row.userType,
      cslId:
        row.CSLPartnerId == null || row.CSLPartnerId == ""
          ? 0
          : row.CSLPartnerId,
      measureType: NewmeasureType,
      isQrtr: "1",
      option: "ntView",
    };

    axios({
      method: "POST",
      url:
        baseUrl + `/customersms/financialPlanandReview/getAccountPlanRevenue`,
      data: postData,
    }).then((response) => {
      const data1 = response.data;
      const NewData = response.data.filter((key) => key.id !== "-1");
      const headers = Object.values(NewData[0]).filter((key) => key !== -1);
      console.log(headers);
      setNewHeaderData(headers);
      console.log(data1.slice(1));
      setNewTableData(NewData.slice(1));

      const GetData = response.data?.filter((d) => d.id != -1);

      let dataHeader;
      if (NewmeasureType == "plRev" || NewmeasureType == "recRev") {
        dataHeader = [
          {
            project: "Project",
            start_dt: "Start Date",
            end_dt: "End Date",
            customer: "Account",
            country: "Country",
          },
        ];
      } else {
        dataHeader = [
          {
            opportunity: "Opportunity",
            created_dt: "Created Date",
            closed_dt: "Closed Date",
            customer: "Account",
            country: "Country",
            probability: "Probability",
            amount: "Amount",
          },
        ];
      }

      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["csl"] =
          GetData[i]["csl"] == null
            ? ""
            : moment(GetData[i]["csl"]).format("DD-MMM-yyyy");

        GetData[i]["start_dt"] =
          GetData[i]["start_dt"] == null
            ? ""
            : moment(GetData[i]["start_dt"]).format("DD-MMM-yyyy");
      }

      let data = ["project"];
      let linkRoutes = ["/project/Overview/:id"];
      setLinkColumns(data);
      setLinkColumnsRoutes(linkRoutes);

      let fData = [...dataHeader, ...GetData];
      setDataPR(fData);
      setShowPRFlag(true);
    });
  };

  console.log(month);

  useEffect(() => {
    dataPR[0] && setHeaderData(JSON.parse(JSON.stringify(dataPR[0])));
  }, [dataPR]);
  const probTemplate = (data) => {
    return (
      <>
        <div style={{ textAlign: "right" }}>
          {data.probability} {"%"}
        </div>
      </>
    );
  };
  // const amountTemplate = (data) => {
  //   return (
  //     <>
  //       <div style={{ textAlign: "right" }}>
  //         {"$"} {data.amount}
  //       </div>
  //     </>
  //   );
  // };
  const amountTemplate = (data) => {
    let formattedAmount = String(data.amount).split(".")[0];

    // Add commas for every three digits
    formattedAmount = formattedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ textAlign: "left" }}>{"$"}</div>
        <div style={{ textAlign: "right" }}>
          {/* {data.amount.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })} */}
          {formattedAmount}
        </div>
      </div>
    );
  };
  const accountTemp = (data) => {
    return <div style={{ textAlign: "center" }}>{data.customer}</div>;
  };
  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          data-toggle="tooltip"
          title={data.project}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "project"
            ? LinkTemplate
            : col == "probability"
            ? probTemplate
            : col == "amount"
            ? amountTemplate
            : col == "customer"
            ? accountTemp
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  return (
    <>
      {rows && (
        <div
          className="materialReactExpandableTable darkHeader toHead timesheetTable planningTable PAC-FPR-Table"
          style={{ padding: "0px 0px" }}
        >
          {tableData.length > 0 && reportRunId != 0 && (
            // (viewTable || planTable || actualTable || compareTable) &&
            <>
              <div className="FPR-screen-note">
                <span>
                  <IoMdInformationCircleOutline />
                  {/* <i className="icon-information-white"></i> */}
                  For updating DP/CSL information, navigate to Customer Edit
                  screen
                </span>
              </div>
              <div className="FPR-Excel-icon-container">
                <RiFileExcel2Line
                  size="1.5em"
                  title="Export to Excel"
                  style={{ color: "green" }}
                  cursor="pointer"
                  onClick={() => {
                    exportExcel();
                  }}
                />
              </div>
            </>
          )}
          {rows.length > 1 ? (
            <MaterialReactTable
              enableExpanding={false}
              enableStickyHeader
              enablePagination={true}
              enableBottomToolbar={true}
              enableColumnFilterModes={false}
              enableDensityToggle={false}
              enableColumnActions={false}
              enableHiding={false}
              enableGlobalFilter={true}
              enableFullScreenToggle={false}
              filterFromLeafRows //apply filtering to all rows instead of just parent rows
              //expand all rows by default

              // defaultColumn={{ minSize: 10, maxSize: 100, size: 10 }} //units are in px
              localization={{
                noRecordsToDisplay: (
                  <span style={{ fontWeight: "bold" }}>No records found</span>
                ),
              }}
              // muiTableContainerProps={{
              //     sx: {
              //         maxHeight: rows.length === 0 ? "30vh" : "60vh", // Adjust the maxHeight value as needed
              //         width: "auto",
              //         maxWidth: "fit-content",
              //         marginBottom: "10px",
              //     },
              // }}
              muiTableContainerProps={{
                sx: {
                  maxHeight: `${maxHeight}px`,
                },
              }}
              columns={columns}
              initialState={{
                pagination: { pageSize: 25 },
                showGlobalFilter: true,
                expanded: false,
                density: "compact",
                columnVisibility: {
                  ...initialHiddenCols,
                },
                enablePinning: true,
              }}
              state={{
                columnVisibility: {
                  ...initialHiddenCols,
                },
              }}
              muiSearchTextFieldProps={{
                placeholder: `Search `,
                sx: { minWidth: "200px" },
                variant: "outlined",
              }}
              data={rows}
              editingMode="table"
              enableEditing={(row, column) => row.original.id != 0}
            />
          ) : (
            <MaterialReactTable
              enableExpanding={false}
              enableStickyHeader
              enablePagination={true}
              enableBottomToolbar={true}
              enableColumnFilterModes={false}
              enableDensityToggle={false}
              enableColumnActions={false}
              enableHiding={false}
              // enableFilters={false}
              enableGlobalFilter={true}
              enableFullScreenToggle={false}
              filterFromLeafRows //apply filtering to all rows instead of just parent rows
              //expand all rows by default

              // defaultColumn={{ minSize: 10, maxSize: 100, size: 10 }} //units are in px
              localization={{
                noRecordsToDisplay: (
                  <span style={{ fontWeight: "bold" }}>No records found</span>
                ),
              }}
              // muiTableContainerProps={{
              //     sx: {
              //         maxHeight: rows.length === 0 ? "30vh" : "60vh", // Adjust the maxHeight value as needed
              //         width: "auto",
              //         maxWidth: "fit-content",
              //         marginBottom: "10px",
              //     },
              // }}
              muiTableContainerProps={{
                sx: {
                  maxHeight: `${maxHeight}px`,
                },
              }}
              columns={columns}
              initialState={{
                pagination: { pageSize: 25 },
                showGlobalFilter: true,
                expanded: false,
                density: "compact",
                columnVisibility: {
                  ...initialHiddenCols,
                },
                enablePinning: true,
              }}
              state={{
                columnVisibility: {
                  ...initialHiddenCols,
                },
              }}
              muiSearchTextFieldProps={{
                placeholder: `Search `,
                sx: { minWidth: "200px" },
                variant: "outlined",
              }}
              data={[]}
              editingMode="table"
              enableEditing={(row, column) => row.original.id != 0}
            />
          )}
        </div>
      )}

      {goalsPopup && (
        <FPRGoalsandNotes
          goalsPopup={goalsPopup}
          setGoalsPopup={setGoalsPopup}
          goalData={goalData}
          setGoalData={setGoalData}
          noteData={noteData}
          servicesPayload={servicesPayload}
          setNoteData={setNoteData}
          rowData={rowData}
          loggedUserId={loggedUserId}
        />
      )}
      {showPRFlag && (
        <div>
          <span>
            Planned Revenue For {newMonth}-{year}
          </span>
          <div className="darkHeader toHead secondTable">
            <PlRevTable
              data={dataPR}
              rows={row}
              linkColumns={linkColumns}
              linkColumnsRoutes={linkColumnsRoutes}
              dynamicColumns={dynamicColumns}
              headerData={headerData}
              newHeaderData={newHeaderData}
              newTableData={newTableData}
              servicesPayload={servicesPayload}
              setHeaderData={setHeaderData}
            />
          </div>
        </div>
      )}
      <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center mt-2">
        <button
          className="btn btn-primary"
          type="submit"
          onClick={() => {
            handleSave();
          }}
        >
          <VscSave />
          Save
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            handleReset();
          }}
        >
          <BiReset /> Reset
        </button>
      </div>
    </>
  );
};
