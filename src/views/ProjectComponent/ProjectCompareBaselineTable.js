import moment from 'moment';
import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { FaChevronCircleRight, FaChevronCircleUp, FaChevronCircleDown } from "react-icons/fa";
import ProjectCompareBaseline from './ProjectCompareBaseline';
import { ImCross } from 'react-icons/im';
import { BiRadioCircleMarked } from 'react-icons/bi';
import { BiRadioCircle } from 'react-icons/bi';

function ProjectCompareBaselineTable(props) {
    const { data, excludedCols, displayColumns, iconState, columns, rowExpand } = props;
    const [displayTableData, setDisplayTableData] = useState([]);
    const [tableData, setTableData] = useState(null);
    const [displayCols, setDisplayCols] = useState(false);
    const [visible, setVisible] = useState(false)
    let [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleRight)
    console.log(visible)

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
        console.log(index)
        let i = index + 1;
        while (true) {
            if (ref.current[i]?.attributes.level.nodeValue == 0) {
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
    console.log(tableData)
    const displayData = () => {
        setDisplayTableData(() => {
            return tableData?.map((element, index) => {
                let tabData = [];
                columns.forEach((inEle, inInd) => {
                    console.log(inEle)
                    let ele = "" + element[inEle.trim()] == null ? " " : element[inEle.trim()];
                    let labelCheck = null;
                    let labelCheckArr = null;
                    let label = null;
                    if (ele?.includes("^",)) {
                        labelCheck = ele.replaceAll("&", "");
                        // labelCheckArr = labelCheck;
                        labelCheckArr = labelCheck?.split("^");

                        label = labelCheckArr[0];
                    }

                    let headerCell = labelCheckArr != null ? labelCheckArr[0] : ele;

                    let data = null;

                    if (headerCell?.includes("{")) {
                        let a = headerCell;
                        a = a.replaceAll("{", '{"').replaceAll("}", '"}')
                            .replaceAll("::", '":"');

                        data = JSON.parse(a);
                        console.log(data)

                    }
                    { console.log(displayColumns) }

                    (displayCols == false
                        ? displayColumns.includes(inEle) == false
                        : true) &&
                        tabData.push(
                            element.id < 0 ? (
                                <th
                                    style={{ textAlign: "center", backgroundColor: "rgb(230 229 229)", cursor: "pointer" }}
                                    className="ellipsis baseline"

                                    title={labelCheckArr != null ? labelCheckArr[0] : ele.replace(/[[\]{}]/g, '')
                                        .split(",")
                                        .map((item) => item.replace(/::/g, ' : ').trim())
                                        .join("\n")
                                    }
                                    rowSpan={labelCheckArr != null && labelCheckArr[1]}
                                >
                                    {headerCell.includes("{")
                                        ? data.map((d, index) => {
                                            console.log("in line 134-----");
                                            console.log(d);
                                            return (
                                                <span style={{ textAlign: "center" }} key={index}>
                                                    {Object.keys(d).map((ele) => (
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <strong className="col-4" style={{ textAlign: "end", cursor: "pointer" }}>{ele}</strong>
                                                            <strong className="col-1">:</strong>
                                                            <span className="col-5" style={{ fontWeight: "normal", textAlign: "left" }}>
                                                                {d[ele]}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </span>
                                            );
                                        })
                                        : headerCell}

                                    <span
                                        onClick={() => {
                                            setDisplayCols((prev) => !prev);
                                        }}
                                    >
                                        {index == iconState[0] &&
                                            inInd == iconState[1] &&
                                            inEle == iconState[2] &&
                                            <FaChevronCircleRight />} {" "}
                                    </span>
                                </th>
                            ) : (
                                <td
                                    className={`ellpss baseline`}
                                    style={{fontSize:"13px",textAlign:"left"}}
                                    title={labelCheckArr != null ? labelCheckArr[0] : ele}
                                >
                                    {
                                        <>
                                            <>

                                                {inEle == "col" && element["lvl"] == 0 && tableData[index + 1]?.lvl == 1 &&
                                                    (
                                                        <span
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                displayRowExpand(index)
                                                                console.log(visible)
                                                                setVisible(true)
                                                                visible == true ?
                                                                    <FaChevronCircleDown />
                                                                    :
                                                                    <FaChevronCircleRight />

                                                                // setCheveronIcon(FaChevronCircleDown):setCheveronIcon(FaChevronCircleRight) 
                                                            }}
                                                        >
                                                            {cheveronIcon}{" "}
                                                        </span>



                                                    )}
                                                {inEle == "col" && element["lvl"] == 0 && tableData[index + 1]?.lvl == 2 &&
                                                    (
                                                        <span
                                                            onClick={() => {
                                                                displayRowExpand(index);
                                                            }}
                                                            style={{ cursor: "pointer" }}          >


                                                            <FaChevronCircleRight />{" "}
                                                        </span>
                                                    )}
                                            </>
                                            {ele?.includes("{")
                                                ? data.map((d, index) => {
                                                    console.log("in line 134-----");
                                                    console.log(d);
                                                    return (
                                                        <span style={{ textAlign: "center" }} key={index}>
                                                            {Object.keys(d).map((ele) => (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <strong className="col-4" style={{ textAlign: "end", cursor: "pointer" }}>{ele}</strong>
                                                                    <strong className="col-1">:</strong>
                                                                    <span className="col-5" style={{ fontWeight: "normal", textAlign: "left" }}>
                                                                        {d[ele]}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </span>
                                                    );
                                                })
                                                : labelCheckArr != null ? labelCheckArr[0] :
                                                    (ele == "Planned Cost" || ele == "Planned Effort" || ele == "Planned Start Date" || ele == "Task Plan" || ele == "Planned End Date" || ele == "Number of Project Change Requests"
                                                        || ele == "Agile" || element["lvl"] == 2) ?
                                                        (ele == "Task Plan" || ele == "Agile") ?
                                                            <span style={{ cursor: "pointer" }}><BiRadioCircle /> &nbsp;{ele}</span> :
                                                            <span style={{ cursor: "pointer" }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<BiRadioCircle /> &nbsp;{ele}</span>
                                                        : ele}

                                        </>
                                    }
                                </td>
                            )
                        );
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
                                className={`${element["lvl"] > 0 && "displayNone"}`}
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
        <div> <div style={{ height: "auto", overflowX: "scroll", }}>
            <table className="table table-bordered table-hover table-responsive ">
                <tbody>
                    {displayTableData}
                </tbody>
            </table>
        </div>
        </div>
    )
}

export default ProjectCompareBaselineTable