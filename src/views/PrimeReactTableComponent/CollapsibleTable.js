import React, { useEffect, useRef, useState } from "react";

import { FaChevronCircleRight } from "react-icons/fa";
// import { FaChevronCircleRight } from "react-icons/fa";

function CollapsibleTable(props) {
  const { data, excludedCols, displayColumns, iconState, columns } = props;

  const [tableData, setTableData] = useState(null);

  const [displayTableData, setDisplayTableData] = useState([]);

  const [displayCols, setDisplayCols] = useState(false);

  const ref = useRef([]);

  useEffect(() => {
    // hideColumns();
    setTableData(data);
  }, [data]);

  useEffect(() => {
    displayData();
  }, [tableData]);

  useEffect(() => {
    hideColumns();
  }, [displayCols]);

  const hideColumns = async () => {
    let filterData = JSON.parse(JSON.stringify(data));

    for (let i = 0; i < filterData.length; i++) {
      let indexObj = filterData[i];

      Object.keys(indexObj).forEach((inEle, inInd) => {
        if (displayColumns.includes(inEle.trim()) && displayCols == false) {
          delete indexObj[inEle];
        }
      });
    }

    setTableData(filterData);

    displayData();
  };

  const displayRowExpand = (index) => {
    let diplayableRows = [];

    // ref.current[index]

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

  const displayData = () => {
    setDisplayTableData(() => {
      return tableData?.map((element, index) => {
        let tabData = [];

        columns.forEach((inEle, inInd) => {
          // if (inEle.includes("id") === false) {

          // if(element[inEle] === null){
          //     tabData.push(<td className='ellpss' title={""} >{""}</td>);
          // }else if((inEle.includes("Cadre")) || (inEle.includes("Role Type"))){

          let ele = "" + element[inEle.trim()];

          let labelCheck = null;

          let labelCheckArr = null;

          let label = null;

          if (ele.includes("^")) {
            labelCheck = ele.replaceAll("&", "");

            // labelCheckArr = labelCheck;

            labelCheckArr = labelCheck?.split("^");

            label = labelCheckArr[0];
          }

          (displayCols == false
            ? displayColumns.includes(inEle) == false
            : true) &&
            tabData.push(
              element.id < 0 ? (
                <th
                  className="ellpss"
                  title={labelCheckArr != null ? labelCheckArr[0] : ele}
                  rowSpan={labelCheckArr != null && labelCheckArr[1]}
                  // colSpan={labelCheckArr != null && labelCheckArr[2]}
                >
                  {labelCheckArr != null ? labelCheckArr[0] : ele}
                  <span
                    onClick={() => {
                      setDisplayCols((prev) => !prev);
                    }}
                  >
                    {index == iconState[0] &&
                      inInd == iconState[1] &&
                      inEle == iconState[2] && <FaChevronCircleRight />}
                  </span>
                </th>
              ) : (
                <td
                  className={`ellpss `}
                  title={labelCheckArr != null ? labelCheckArr[0] : ele}
                  // rowSpan={labelCheckArr != null && labelCheckArr[1]}
                  // colSpan={labelCheckArr != null && labelCheckArr[2]}
                  // style={{ display: element["lvl"] == 2 ? "none" : "" }}
                >
                  {
                    <>
                      <>
                        {inEle == "name" && element["lvl"] == 1 && (
                          <span
                            onClick={() => {
                              displayRowExpand(index);
                            }}
                          >
                            <FaChevronCircleRight />
                          </span>
                        )}
                      </>
                      {labelCheckArr != null ? labelCheckArr[0] : ele}
                    </>
                  }
                </td>
              )
            );
          // }else{
          //     tabData.push(<td className='ellpss' title={element[inEle]} align="right" ><span style={{ float : "left" }} >{"$"}</span><span align = "right">{element[inEle]}</span></td>);
          // }

          // tabData.push(<td className='ellpss' title={element[inEle]} >
          //         <div>
          //             if(element[inEle] !== null && (inEle.includes("Cadre")===false) && (inEle.includes("Role Type")===false)){

          //             } && <span align="left" >{"$"}</span>}<span align="right">{element[inEle] === null ? "" : element[inEle]}</span>
          //         </div>
          //     </td>);
          // }
        });

        return (
          <>
            {
              <tr
                key={index}
                level={element["lvl"]}
                ref={(ele) => {
                  ref.current[index] = ele;
                }}
                className={`${element["lvl"] > 1 && "displayNone"}`}
              >
                {tabData}
              </tr>
            }
          </>
        );
      });
    });
  };

  return (
    <div style={{ height: "1500px", overflow: "auto", maxHeight: "650px" }}>
      <table className="table table-bordered table-hover table-responsive ">
        {/* thead */}
        <tbody>{displayTableData}</tbody>
      </table>
    </div>
  );
}

export default CollapsibleTable;
