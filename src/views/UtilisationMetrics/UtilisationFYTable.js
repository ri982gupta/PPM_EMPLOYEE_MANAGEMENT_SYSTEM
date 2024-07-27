import { CCollapse } from "@coreui/react";
import React from "react";
import { useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

function UtilisationFYTable() {

    const [visible, setVisible] = useState(false)
    const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleRight)


    return (
        <div>
            <div className="group mb-3 customCard">
                <div className="col-md-12 no-padding">
                    <lable><AiOutlineInfoCircle />    Values are of Actual Utilization for past quarters and Planned Utilization for future quarters</lable>
                    <div className="col-md-6">
                        <table id="details" className="table table-bordered table-striped" role="grid">
                            <thead>
                                <tr>
                                    <th className="ellipsis tooltip-ex">BU/Resource &nbsp;&nbsp;
                                        <span
                                            onClick={() => {
                                                setVisible(!visible)
                                                visible
                                                    ? setCheveronIcon(FaChevronCircleRight)
                                                    : setCheveronIcon(FaChevronCircleLeft)
                                            }}><span>{cheveronIcon}</span>
                                        </span></th>
                                    <CCollapse visible={visible}>
                                        <th className="ellipsis tooltip-ex"><td >Cadre</td></th>
                                        <th className="ellipsis tooltip-ex"><td>Supervisor</td></th>
                                    </CCollapse>
                                    <th className="ellipsis tooltip-ex">YTD</th>
                                    <th className="ellipsis tooltip-ex">2023-Q1</th>
                                    <th className="ellipsis tooltip-ex">2023-Q2</th>
                                    <th className="ellipsis tooltip-ex">2023-Q3</th>
                                    <th className="ellipsis tooltip-ex">QTD (23-Q4)</th>
                                    <th className="ellipsis tooltip-ex">+30 Days</th>
                                    <th className="ellipsis tooltip-ex">+60 Days</th>
                                    <th className="ellipsis tooltip-ex">Average</th>
                                </tr>
                            </thead>
                            <tbody>
                                <td colSpan={10} align="center">No records to display</td>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UtilisationFYTable;