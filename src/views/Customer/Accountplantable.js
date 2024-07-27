import { Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { useEffect } from "react";
import "./Accountplantable.scss";

function Accountplantable(props) {
  const { tableData, column, actual, selectType, column1, column2, compare } =
    props;
  const [displayData, setDisplayData] = useState();
  const numberWithCommas = (x) => {
    return x?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    displayDataFnc();
  }, [tableData]);
  const displayDataFnc = () => {
    setDisplayData(() => {
      return (tableData?.tableData || []).map((element, index) => {
        const tabData = column.map((inEle, inInd) => {
          const isHeader = element.id === -1;
          const modifiedValue = (element[inEle] || "")?.includes("^&1")
            ? element[inEle].replaceAll("^&1", "")
            : element[inEle];

          return isHeader ? (
            <th key={inInd} style={{ textAlign: "center" }}>
              {modifiedValue}
            </th>
          ) : element.id == 2 ? (
            <td
              key={inInd}
              style={{
                textAlign: inInd === 0 ? "left" : "right",
                backgroundColor:
                  inInd === 1 || inInd === 3
                    ? "#F3D6D6"
                    : inInd === 2 || inInd === 4
                    ? "#BFF5F5"
                    : "none",
              }}
            >
              {modifiedValue.includes("GM")
                ? modifiedValue
                : modifiedValue + " %"}
            </td>
          ) : (
            <td
              key={inInd}
              style={{
                textAlign: inInd === 0 ? "left" : "right",
                backgroundColor:
                  inInd === 1 || inInd === 3
                    ? "#F3D6D6"
                    : inInd === 2 || inInd === 4
                    ? "#BFF5F5"
                    : "none",
              }}
            >
              {numberWithCommas(modifiedValue)}
            </td>
          );
        });

        return <tr key={index}>{tabData}</tr>;
      });
    });
  };


  useEffect(() => {
    setDisplayData(null); // reset displayData state to null
  }, [selectType]);

  //--------------------------------------------------------
  useEffect(() => {
    displayDataFnc1();
  }, [actual]);
  const [displayData1, setDisplayData1] = useState();
  const displayDataFnc1 = () => {
    setDisplayData1(() => {
      return (actual?.tableData || []).map((element, index) => {
        const tabData = column1?.map((inEle, inInd) => {
          if (typeof element[inEle] !== "string") {
            return null; // Skip non-string values
          }
          const isHeader = element.id === -1;
          let clsNm = null;

          if (inEle.includes("_")) {

            let fullVal = actual?.tableData[0][inEle];
            let spltVal = fullVal?.split("^")[0];
            let yrSpltVl = spltVal?.split("-")[1];
            let finalSplt = yrSpltVl?.split("")[1];
            clsNm = finalSplt % 2 == 0 ? "even" : "odd";
          }


          const modifiedValue = element[inEle]?.includes("^&1")
            ? element[inEle].replaceAll("^&1", "")
            : element[inEle];

          return isHeader ? (
            <th key={inInd} style={{ textAlign: "center" }}>
              {modifiedValue}
            </th>
          ) : // <td key={inInd}>
          //   <div className={clsNm}> {modifiedValue}</div>
          // </td>

          element.id == 2 ? (
            <td
              key={inInd}
              style={{ textAlign: inInd === 1 ? "left" : "right" }}
            >
              <div className={clsNm}>
                {modifiedValue.includes("GM")
                  ? modifiedValue
                  : modifiedValue + " %"}{" "}
              </div>
            </td>
          ) : (
            <td
              key={inInd}
              style={{ textAlign: inInd === 1 ? "left" : "right" }}
            >
              <div className={clsNm}>{numberWithCommas(modifiedValue)}</div>
            </td>
          );
        });
        return <tr key={index}>{tabData}</tr>;
      });

    });
  };


  useEffect(() => {
    setDisplayData1(); // reset displayData1 state to null
  }, [selectType]);


  //-----------------------Compare--------------------------

  useEffect(() => {
    displayDataFnc2();
  }, [compare]);
  const [displayData2, setDisplayData2] = useState();
  const displayDataFnc2 = () => {

    setDisplayData2(() => {
      return compare?.tableData?.map((element, index) => {
        let tabData = [];
        column2?.forEach((inEle, inInd) => {
          let temp = element[inEle];
          let data = null;
          let row = 1;
          let col = 1;
          if (temp?.includes("^&")) {
            data = element[inEle].split("^&");
            row = data[1];
            col = data[2];
          }
          const backgroundColor =
            index > 0 &&
            inInd > 0 &&
            (Math.floor(inInd / 2) % 2 === 0
              ? inInd % 2 === 0
                ? "#F3D6D6"
                : "#BFF5F5"
              : inInd % 2 === 0
              ? "#BFF5F5"
              : "#F3D6D6");
          if (temp) {
            const modifiedTemp = temp
              .replaceAll("^&1^&2", "")
              .replaceAll("^&1^&1", "")
              .replaceAll("^&2^&1", "");

            element.id == -1 || element.id == -2
              ? tabData.push(
                  <th
                    style={{ textAlign: "center" }}
                    colSpan={col}
                    rowSpan={row}
                  >
                    {modifiedTemp}
                  </th>
                )
              : tabData.push(
                  element.id == 2 ? (
                    <td
                      align="left"
                      style={{
                        backgroundColor,
                        textAlign: inInd === 0 ? "left" : "right",
                      }}
                      colSpan={col}
                      rowSpan={row}
                    >
                      {modifiedTemp.includes("GM")
                        ? modifiedTemp
                        : modifiedTemp + " %"}
                    </td>
                  ) : (
                    <td
                      align="left"
                      style={{
                        backgroundColor,
                        textAlign: inInd === 0 ? "left" : "right",
                      }}
                      colSpan={col}
                      rowSpan={row}
                    >
                      {numberWithCommas(modifiedTemp)}
                    </td>
                  )
                );
          }


        });

        return <tr key={index}>{tabData}</tr>;
      });
    });
  };

  useEffect(() => {
    setDisplayData2(null);
  }, [selectType]);
  return (
    <div className="accountPlanTable darkHeader">
      {selectType === "plan" && (
        <table className="table table-bordered table-striped">
          <thead>{displayData}</thead>
        </table>
      )}

      {selectType === "actual" && (
        <table className="table table-bordered table-striped">
          <thead>{displayData1}</thead>
        </table>
      )}

      {selectType === "compare" && (
        <table className="table table-bordered table-striped">
          <thead>{displayData2}</thead>
        </table>
      )}
    </div>
  );
}
export default Accountplantable;
