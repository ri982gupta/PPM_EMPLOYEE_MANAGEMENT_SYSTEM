import axios from "axios";
import React, { useEffect, useState } from "react";
import { environment } from "../../environments/environment";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { FaCircle, FaSave } from "react-icons/fa";
import { FiRotateCcw } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import Loader from "../Loader/Loader";
import "./CustomerTargets.scss";

function CustomerTargets(props) {
  const {
    serviceData,
    reportRunId,
    coloumnArray,
    serviceDataCall,
    setMessageCust,
    accessData,
    setMessage1,
  } = props;
  const [customerTargetsData, setCustomerTargetsData] = useState(
    JSON.parse(JSON.stringify(serviceData))
  );
  const [displayTable, setDisplayTable] = useState(null);
  const [loader, setLoader] = useState(false);
  const [savesCustTargetData, setSavesCustTargetData] = useState([]);
  const [displayTableHead, setDisplayTableHead] = useState(null);
  let columnsData = [];

  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;

  useEffect(() => {
    setCustomerTargetsData(JSON.parse(JSON.stringify(serviceData)));
  }, [serviceData, reportRunId]);

  useEffect(() => {
    displayTableHeader();
    displayTableData();
  }, [customerTargetsData]);

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

  const onKeyPress = (e) => {
    var code = e.which ? e.which : e.keyCode;
    if (code == 8 || code == 46 || code == 37 || code == 39) {
      return e.key;
    } else if (code < 48 || code > 57) {
      return e.preventDefault();
    } else return e.key;
  };

  const displayTableHeader = () => {
    setDisplayTableHead(() => {
      return customerTargetsData.map((objData, index) => {
        let tabData = [];
        Object.keys(objData).forEach((key, nestedIndex) => {
          let unWantedCols = [
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
            "execStatus",
          ];
          if (objData.id === -2 && unWantedCols.indexOf(key) == -1) {
            let val = objData[key].split("^&");
            let dVal = val[0].includes("__") ? val[0].split("__") : [];
            tabData.push(
              <th
                style={{ position: "sticky" }}
                rowSpan={val[1]}
                colSpan={val[2]}
              >
                {dVal.length > 0 ? (
                  <div>
                    <span>
                      <FaCircle size={"0.8em"} style={{ color: "green" }} />
                      <span>{dVal[2]}</span>
                    </span>
                    <span>
                      <FaCircle size={"0.8em"} style={{ color: "purple" }} />
                      <span>{dVal[4]}</span>
                    </span>
                  </div>
                ) : (
                  val[0]
                )}
              </th>
            );
          } else if (objData.id === -1 && unWantedCols.indexOf(key) == -1) {
            objData[key] && tabData.push(<th>{objData[key]}</th>);
          } else {
          }
        });
        return <tr key={index}>{tabData}</tr>;
      });
    });
  };

  const formatNumberWithCommas = (number) => {
    return number.toLocaleString("en-US");
  };

  const displayTableData = () => {
    setLoader(true);
    setDisplayTable(() => {
      return customerTargetsData.map((objData, index) => {
        if (objData.lvl === 999) {
          // Special case for LVL 999, only display executive in the center.
          return (
            <tr key={index}>
              <td
                style={{
                  textAlign: "center",
                  backgroundColor: "white",
                  fontSize: "14px",
                  color: "black",
                }}
                colSpan={24}
              >
                {objData.executive}
              </td>
            </tr>
          );
        }
        if (objData.lvl === -2 || objData.lvl === -1) {
          // Skip rendering the row for lvl -2 and -1
          return null;
        }
        let tabData = [];
        Object.keys(objData).forEach((key, nestedIndex) => {
          let unWantedCols = [
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
            "execStatus",
          ];

          if (objData.id === 0 && unWantedCols.indexOf(key) == -1) {
            tabData.push(
              <td
                style={{
                  textAlign: !isNaN(parseFloat(objData[key]))
                    ? "right"
                    : "left",
                }}
              >
                {isNaN(parseFloat(objData[key]))
                  ? objData[key]
                  : parseFloat(objData[key]).toLocaleString("en-US")}
              </td>
            );
          } else if (objData.id > 0 && unWantedCols.indexOf(key) == -1) {
            let trLvl1Clr = ["executive", "practice", "country", "customer"];
            tabData.push(
              <td
                className={` ${
                  trLvl1Clr.indexOf(key) != -1
                    ? "trLvl1"
                    : key.includes("total_custForecast")
                    ? "total"
                    : key.includes("custForecast") &&
                      !key.includes("total") &&
                      nestedIndex % 2 == 0
                    ? "innereven"
                    : "innerodd"
                }`}
              >
                {key.includes("custForecast") &&
                !key.includes("total") &&
                accessData === 1000 ? (
                  <input
                    className="textStyle"
                    type="text"
                    id={objData.id + "__" + index + "__" + key}
                    onKeyPress={(e) => {
                      onKeyPress(e);
                    }}
                    onChange={(e) => {
                      onChangeHandler(
                        e,
                        objData,
                        index,
                        key,
                        objData.id + "__" + index + "__" + key
                      );
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        e.target.value = "0";
                        onChangeHandler(
                          e,
                          objData,
                          index,
                          key,
                          objData.id + "__" + index + "__" + key
                        );
                      }
                      onBlurHandler();
                    }}
                    defaultValue={
                      objData[key].match(/\d+/)
                        ? parseInt(objData[key]).toLocaleString("en-IN")
                        : objData[key]
                    }
                  />
                ) : key.includes("customer") ? (
                  <div title={objData[key]}>
                    {objData.isProspect === 1 ? (
                      <FaCircle size={"0.8em"} style={{ color: "purple" }} />
                    ) : (
                      <FaCircle size={"0.8em"} style={{ color: "green" }} />
                    )}
                    <span>{objData[key]}</span>
                  </div>
                ) : key.includes("executive") ? (
                  <div>
                    {objData.executive != "<< Unassigned >>" ? (
                      <>{icons[objData["execStatus"]]}</>
                    ) : (
                      <></>
                    )}
                    <span title={objData[key]}>{objData[key]}</span>
                  </div>
                ) : (
                  <div
                    title={objData[key]}
                    style={{
                      textAlign: !isNaN(parseFloat(objData[key]))
                        ? "right"
                        : "left",
                    }}
                  >
                    {isNaN(parseFloat(objData[key]))
                      ? objData[key]
                      : parseFloat(objData[key]).toLocaleString("en-US")}
                  </div>
                )}
              </td>
            );
          }
        });
        return <tr key={index}>{tabData}</tr>;
      });
    });
    setLoader(false);
  };

  const onChangeHandler = (e, objData, index, key, elementId) => {
    let ele = document.getElementById(elementId).classList;
    const formattedValue = e.target.value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    e.target.value = formattedValue;
    if (serviceData[index][key] !== e.target.value) {
      !ele.contains("empty") && ele.add("empty");
    } else {
      ele.contains("empty") && ele.remove("empty");
    }
    let tempCustData = savesCustTargetData;
    const userObjData = {
      executiveId: "",
      customerId: 0,
      prospectId: 0,
      practiceId: "",
      countryId: "",
      month: "",
      typ: "",
      val: "",
      comments: "",
      isOverridden: "",
    };
    userObjData["executiveId"] = objData.id;
    if (objData.isProspect === 1) {
      userObjData["prospectId"] = objData.customerId;
    } else {
      userObjData["customerId"] = objData.customerId;
    }
    userObjData["practiceId"] = objData.practiceId;
    userObjData["countryId"] = objData.countryId;
    let urMonth = key.split("_");
    userObjData["month"] = urMonth[0] + "-" + urMonth[1] + "-" + urMonth[2];
    //objData["month"] = urMonth[0] + "-" + urMonth[1] + "-" + urMonth[2];
    userObjData["typ"] = "custForecast";
    userObjData["val"] = e.target.value.replace(/,/g, "");
    userObjData["comments"] = "";
    userObjData["isOverridden"] = false;
    let val = tempCustData.some(
      (datas) =>
        datas.executiveId === userObjData.executiveId &&
        //&& datas.prospectId === objData.prospectId
        datas.customerId === userObjData.customerId &&
        datas.practiceId === userObjData.practiceId &&
        datas.countryId === userObjData.countryId &&
        datas.month === userObjData.month
      //&& datas.typ === objData.typ
    );
    if (val) {
      tempCustData.forEach((element, index1) => {
        if (
          element.executiveId === userObjData.executiveId &&
          //&& element.prospectId === objData.prospectId
          element.customerId === userObjData.customerId &&
          element.practiceId === userObjData.practiceId &&
          element.countryId === userObjData.countryId &&
          element.month === userObjData.month
          //&& element.typ === objData.typ
        ) {
          element["val"] = e.target.value.replace(/,/g, "");
        }
      });
    } else {
      tempCustData.push(userObjData);
    }
    setSavesCustTargetData(tempCustData);
    objData[key] = e.target.value.replace(/,/g, "");
  };

  const saveCustomersTargetsAxiosCall = () => {
    let saveCustomerTgrtData = savesCustTargetData;
    const finalData = [];
    saveCustomerTgrtData.forEach((element, index) => {
      finalData[index] = element;
    });

    axios({
      method: "POST",
      url:
        baseUrl +
        `/SalesMS/services/saveSalesCustomerMapping?loggedUserId=${loggedUserId}&reportRunId=${reportRunId}`,
      data: finalData,
    }).then((resp) => {
      setMessageCust(true);
      setTimeout(() => {
        setMessageCust(false);
      }, 8000);
      serviceDataCall.current();
    });
  };

  const onBlurHandler = () => {
    customerTargetsData.forEach((data, index) => {
      Object.keys(data).forEach((key) => {
        if (
          data.id === 0 &&
          key.includes("custForecast") &&
          !key.includes("total")
        ) {
          data[key] = summaryColumnTotal(key);
        } else if (
          data.id >= 0 &&
          key.includes("custForecast") &&
          key.includes("total")
        ) {
          data[key] = rowTotal(key, data);
        }
      });
    });
    displayTableData();
  };

  const summaryColumnTotal = (keyName) => {
    var sum = 0;
    customerTargetsData.forEach((element, calInd) => {
      if (element.id > 0) {
        sum = sum + parseInt(element[keyName]);
      }
    });
    return sum;
  };

  const rowTotal = (key, rowData) => {
    var sum = 0;
    Object.keys(rowData).forEach((element) => {
      if (element.includes("custForecast") && element !== key) {
        sum = sum + parseInt(rowData[element]);
      }
    });
    return sum;
  };

  const saveClickHandler = () => {
    let emptyClassList = document.getElementsByClassName("empty");
    if (emptyClassList.length > 0) {
      saveCustomersTargetsAxiosCall();
    } else {
      setMessage1(true);
      setTimeout(() => {
        setMessage1(false);
      }, 4000);
    }
  };

  const resetClickHandler = () => {
    let emptyClassList = document.getElementsByClassName("empty");
    for (let i = 0; i < emptyClassList.length; i++) {
      let splitData = emptyClassList[i].id.split("__");
      const originalValue = serviceData[splitData[1]][splitData[2]];
      emptyClassList[i].value = originalValue.match(/\d+/)
        ? parseInt(originalValue).toLocaleString("en-IN")
        : originalValue;
    }
    setCustomerTargetsData(JSON.parse(JSON.stringify(serviceData)));
    displayTableData();
    setSavesCustTargetData([]);
  };

  const handleOnExport = () => {
    const excludeProperties = [
      "id",
      "customerId",
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
    const headerRow1 = Object.keys(customerTargetsData[0])
      .filter((key) => !excludeProperties.includes(key))
      .map((key) => {
        if (key === "customer") {
          const val = customerTargetsData[0][key].split("^&");
          let dVal = val[0].includes("__") ? val[0].split("__") : [];
          return dVal[2] + dVal[4];
        }
        const val = customerTargetsData[0][key].split("^&");
        return val[0];
      });

    const filteredData = customerTargetsData
      .slice(1)
      .map((item) => {
        const filteredItem = Object.fromEntries(
          Object.entries(item).filter(
            ([key]) => !excludeProperties.includes(key)
          )
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
    <>
      {loader ? (
        <Loader handleAbort={() => setLoader(false)} />
      ) : (
        <div>
          <RiFileExcel2Line
            size="1.5em"
            title="Export to Excel"
            style={{ color: "green", float: "right", marginBottom: "10px" }}
            cursor="pointer"
            onClick={handleOnExport}
          />

          <div className="customerTargetsTable darkHeader toHead">
            <table
              className="table table-bordered htmlTable"
              cellPadding={0}
              cellSpacing={0}
            >
              <thead>{displayTableHead}</thead>
              <tbody>{displayTable}</tbody>
            </table>
          </div>
          {accessData === 1000 ? (
            <div className="col-lg-12 col-md-12 col-sm-12 btn-container center my-3 mb-2">
              <button
                className="btn btn-primary mr4"
                style={{
                  width: "80px",
                  fontWeight: "bold",
                  color: "white",
                }}
                onClick={() => {
                  saveClickHandler();
                }}
              >
                <FaSave />
                Save
              </button>
              <button
                className="btn btn-primary mr4 "
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
                Reset
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
}

export default CustomerTargets;
