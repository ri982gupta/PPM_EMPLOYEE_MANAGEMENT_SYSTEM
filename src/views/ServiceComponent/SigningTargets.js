import React from "react";
import { signal } from "@preact/signals";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { MdOutlineEditNote } from "react-icons/md";
import DisplayPopup from "./DisplayPopup";

import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { environment } from "../../environments/environment";
import { FaSave } from "react-icons/fa";
import { FiRotateCcw } from "react-icons/fi";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";
import "./SigningTargets.scss";
import SFButtons from "./SFButtons";

function SigningTargets(props) {
  const {
    serviceData,
    reportRunId,
    accessData,
    coloumnArray,
    serviceDataCall,
    setMessageSgng,
    setMessage1,
    setshowSFpipeline,
    showSFpipeline,
    componentSelector,
    setRefreshButton,
    refreshButton
  } = props;
  const [displaySigningTargets, setDisplaySigningTargets] = useState(null);
  const [displaySigningTargets1, setDisplaySigningTargets1] = useState(null);
  const [signingTargetsData, setSigningTargetsData] = useState(
    JSON.parse(JSON.stringify(serviceData))
  );
  const [signingTargetsDataTemp, setSigningTargetsDataTemp] = useState(
    JSON.parse(JSON.stringify(serviceData))
  );
  let columnArray = coloumnArray?.filter(
    (d) => d?.includes("sgtarget") || d?.includes("executive")
  );
  // ["executive", "2023_Q1_sgtarget", "2023_Q2_sgtarget", "2023_Q3_sgtarget", "2023_Q4_sgtarget", "total_sgtarget"]
  const [saveSalesTargets, setSaveSalesTargets] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [rowData1, setRowData1] = useState({});

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

  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  // const baseUrl = "http://localhost:8090"

  useEffect(() => {
    setSigningTargetsData(JSON.parse(JSON.stringify(serviceData)));
  }, [serviceData, reportRunId, coloumnArray]);

  useEffect(() => {
    displayTableHandlerBody();
    displayTableHandlerHeader();
  }, [signingTargetsData]);

  useEffect(() => {}, [saveSalesTargets]);

  const displayTableHandlerHeader = () => {
    setDisplaySigningTargets1(() => {
      return signingTargetsData.map((data, index) => {
        let tabData = [];
        columnArray?.forEach((inEle, inIndex) => {
          if (data.id === -2) {
            tabData.push(
              <th>
                {data[inEle] !== undefined && data[inEle].split("^&1")[0]}
              </th>
            );
          }
        });
        return <tr>{tabData}</tr>;
      });
    });
  };

  const displayTableHandlerBody = () => {
    setDisplaySigningTargets(() => {
      return signingTargetsData.map((data, index) => {
        if (data.lvl === 999) {
          // Special case for LVL 999, only display executive in the center.
          return (
            <tr key={index}>
              <td
                style={{ textAlign: "center", backgroundColor: "white" }}
                colSpan={columnArray.length}
                className="trLvl0"
              >
                {data.executive}
              </td>
            </tr>
          );
        }
        let tabData = [];
        columnArray?.forEach((inEle, inIndex) => {
          if (data.id === 0) {
            tabData.push(
              inIndex === 0 ? (
                <td className="trLvl0">{data[inEle]}</td>
              ) : (
                <td className="trLvl0" align="right">
                  {data[inEle] !== null
                    ? parseInt(data[inEle]).toLocaleString("en-US")
                    : ""}
                </td>
              )
            );
          } else if (data[inEle] !== "Summary" && inIndex === 0) {
            tabData.push(
              <td className="trLvl1" title={data[inEle]}>
                <div>
                  {icons[data["execStatus"]]} <span>{data[inEle]}</span>
                  <MdOutlineEditNote
                    title="Notes"
                    style={{ float: "right", cursor: "pointer" }}
                    size={"1.5em"}
                    onClick={() => {
                      setOpenPopup(true);
                      setRowData1(data);
                    }}
                  />
                </div>
              </td>
            );
          } else {
            tabData.push(
              inIndex === 0 || inIndex === columnArray.length - 1 ? (
                <td
                  className={
                    inIndex === columnArray.length - 1
                      ? "summaryTotalColor"
                      : "trLvl1"
                  }
                >
                  {data[inEle] !== null
                    ? parseInt(data[inEle]).toLocaleString("en-US")
                    : ""}
                </td>
              ) : (
                <td className={inIndex % 2 === 0 ? "evenColor" : "oddColor"}>
                  {accessData === 1000 ? (
                    <input
                      className="textStyle"
                      id={data.id + "__" + index + "__" + inEle}
                      type="text"
                      style={{ textAlign: "right", fontSize: "12px" }}
                      onKeyPress={(e) => {
                        onKeyPress(e);
                      }}
                      onChange={(e) => {
                        onChangeHandler(
                          e,
                          data,
                          inEle,
                          index,
                          data.id + "__" + index + "__" + inEle
                        );
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          e.target.value = "0";
                          onChangeHandler(
                            e,
                            data,
                            inEle,
                            index,
                            data.id + "__" + index + "__" + inEle
                          );
                        }
                        calculateTotalHandler();
                      }}
                      defaultValue={
                        data[inEle].match(/\d+/)
                          ? parseInt(data[inEle]).toLocaleString("en-IN")
                          : data[inEle]
                      }
                    />
                  ) : (
                    <span>
                      {data[inEle].match(/\d+/)
                        ? parseInt(data[inEle]).toLocaleString("en-IN")
                        : data[inEle]}
                    </span>
                  )}
                </td>
              )
            );
          }
        });
        return data.id !== -2 ? <tr>{tabData}</tr> : null;
      });
    });
  };

  const onKeyPress = (e) => {
    var code = e.which ? e.which : e.keyCode;
    if (code == 8 || code == 46 || code == 37 || code == 39) {
      return e.key;
    } else if (code < 48 || code > 57) {
      return e.preventDefault();
    } else return e.key;
  };

  const calculateTotalHandler = () => {
    signingTargetsData.forEach((data, index) => {
      columnArray.forEach((ele, inInd) => {
        if (data.id === 0) {
          switch (ele) {
            case columnArray[1]:
              data[columnArray[1]] = summaryColumnTotal(columnArray[1]);
              break;

            case columnArray[2]:
              data[columnArray[2]] = summaryColumnTotal(columnArray[2]);
              break;

            case columnArray[3]:
              data[columnArray[3]] = summaryColumnTotal(columnArray[3]);
              break;

            case columnArray[4]:
              data[columnArray[4]] = summaryColumnTotal(columnArray[4]);
              break;

            case columnArray[5]:
              data[columnArray[5]] = rowTotal(data);
              break;

            default:
              break;
          }
        } else if (data.id > 0) {
          switch (ele) {
            case columnArray[5]:
              data[columnArray[5]] = rowTotal(data);
              break;

            default:
              break;
          }
        }
      });
    });
    displayTableHandlerBody();
  };

  const summaryColumnTotal = (keyName) => {
    var sum = 0;
    signingTargetsData.forEach((element, calInd) => {
      if (element.id > 0) {
        sum = sum + parseInt(element[keyName]);
      }
    });
    return sum;
  };

  const rowTotal = (rowData) => {
    var sum = 0;
    columnArray.forEach((element, calInd) => {
      if (calInd > 0 && calInd < columnArray.length - 1) {
        sum = sum + parseInt(rowData[element]);
      }
    });
    return sum;
  };

  const onChangeHandler = (e, data, inEle, index, elementId) => {
    let ele = document.getElementById(elementId).classList;
    const formattedValue = e.target.value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    e.target.value = formattedValue;
    if (serviceData[index][inEle] !== e.target.value) {
      !ele.contains("empty") && ele.add("empty");
    } else {
      ele.contains("empty") && ele.remove("empty");
    }
    let tempSalesData = saveSalesTargets;
    const obj = { executiveId: "", month: "", typ: "", val: "", comments: "" };
    obj["executiveId"] = data.id;
    let monthArr = inEle.split("_");

    let monthNum = "";
    if (monthArr[1] === "Q1") {
      monthNum = "04";
      monthArr[0] = (parseInt(monthArr[0]) - 1).toString();
    } else if (monthArr[1] === "Q2") {
      monthNum = "07";
      monthArr[0] = (parseInt(monthArr[0]) - 1).toString();
    } else if (monthArr[1] === "Q3") {
      monthNum = "10";
      monthArr[0] = (parseInt(monthArr[0]) - 1).toString();
    } else if (monthArr[1] === "Q4") {
      monthNum = "01";
    }
    let month = monthArr[0] + "-" + monthNum + "-" + "01";
    obj["month"] = month;
    obj["typ"] = monthArr[2];
    obj["val"] = e.target.value.replace(/,/g, "");
    let val = tempSalesData.some(
      (datas) =>
        datas.executiveId === obj.executiveId &&
        datas.month === obj.month &&
        datas.typ === obj.typ
    );
    if (val) {
      tempSalesData.forEach((data, index1) => {
        if (
          data.executiveId === obj.executiveId &&
          data.month === obj.month &&
          data.typ === obj.typ
        ) {
          data["val"] = e.target.value.replace(/,/g, "");
        }
      });
    } else {
      tempSalesData.push(obj);
    }
    setSaveSalesTargets(tempSalesData);

    data[inEle] = e.target.value.replace(/,/g, "");
  };

  const saveSalesTargetsAxiosCall = () => {
    let saveSalesTargetData = saveSalesTargets;
    const finalData = {};

    saveSalesTargetData.forEach((element, index) => {
      finalData[index] = element;
    });

    axios({
      method: "POST",
      url:
        baseUrl +
        `/SalesMS/services/saveSalesSigningTargets?loggedUserId=${loggedUserId}&reportRunId=${reportRunId}`,
      data: finalData,
    }).then((resp) => {
      setMessageSgng(true);
      setTimeout(() => {
        setMessageSgng(false);
      }, 3000);
      serviceDataCall.current();
    });
  };

  const saveClickHandler = () => {
    let emptyClassList = document.getElementsByClassName("empty");
    if (emptyClassList.length > 0) {
      saveSalesTargetsAxiosCall();
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
      // emptyClassList[i].value = serviceData[splitData[1]][splitData[2]];
      const originalValue = serviceData[splitData[1]][splitData[2]];
      emptyClassList[i].value = originalValue.match(/\d+/)
        ? parseInt(originalValue).toLocaleString("en-IN")
        : originalValue;
    }
    setSigningTargetsData(JSON.parse(JSON.stringify(serviceData)));
    displayTableHandlerBody();
    setSaveSalesTargets([]);
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

    const filteredData = serviceData
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
            paddingRight: "610px",
            fontSize: "17px",
            color: "#297ab0",
          }}
        >
          Signings Targets
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
      <div className="scrollit mt-1">
        <div className="signingTargetsTable darkHeader toHead">
          <table
            className="table table-bordered htmlTable"
            cellPadding={0}
            cellSpacing={0}
          >
            <thead>{displaySigningTargets1}</thead>
            <tbody>{displaySigningTargets}</tbody>
          </table>
        </div>
      </div>
      {accessData === 1000 ? (
        <div className="col-lg-12 col-md-12 col-sm-12 btn-container center my-3 mb-2">
          <button
            className="btn btn-primary"
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
            Reset
          </button>
        </div>
      ) : (
        ""
      )}
      {openPopup ? (
        <DisplayPopup
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          Vdata={serviceData}
          rowData={rowData1}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default SigningTargets;
