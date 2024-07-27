import React, { useState } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { CCollapse } from '@coreui/react';
import { AiOutlineInfoCircle } from "react-icons/ai"



function NonBillableWorkTable(props) {

    const [visible, setVisible] = useState(false)
    const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleRight)
    
    console.log(props.data)
    const tableData = props.data

    console.log(tableData);

    return (





        <div>
            <div className="group mb-3 customCard">
                <div className="col-md-12 no-padding ">
                    <div className=" col-md-12 Warning1"><lable ><AiOutlineInfoCircle />All numbers are in hours</lable></div>
                    <div className="col-md-6">
                        <table id="details" className="table table-bordered table-striped" role="grid">
                            <thead>
                                <tr>
                                    <th className="ellipsis tooltip-ex">BU/Resource/Project &nbsp;&nbsp;
                                        <span
                                            onClick={() => {
                                                setVisible(!visible)
                                                visible
                                                    ? setCheveronIcon(FaChevronCircleRight)
                                                    : setCheveronIcon(FaChevronCircleLeft)
                                            }}><span>{cheveronIcon}</span>
                                        </span></th>
                                    <CCollapse  visible={visible}>
                                        <th className="ellipsis tooltip-ex"><tr>Cadre</tr></th>
                                        <th className="ellipsis tooltip-ex"><tr>Supervisor</tr></th>
                                    </CCollapse>
                                    
                                    <th className="ellipsis tooltip-ex">12-Dec-2022</th>
                                    <th className="ellipsis tooltip-ex">19-Dec-2022</th>
                                    <th className="ellipsis tooltip-ex">26-Dec-2022</th>
                                    <th className="ellipsis tooltip-ex">02-Jan-2022</th>
                                    <th className="ellipsis tooltip-ex">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.length > 0 && tableData.map((item, index)=>{
                                    return (
                                        <tr>
                                        <td >{item.name}</td>
                                        <CCollapse  visible={visible}>
                                        <td>{item.emp_cadre}</td>
                                        <td>{item.supervisor}</td>
                                        </CCollapse>
                                        <td>{item["2023_02_06_3_wk"]}</td>
                                        <td>{item["2023_01_23_1_wk"]}</td>
                                        <td>{item["2023_01_30_2_wk"]}</td>
                                        <td>{item["2023_02_06_3_wk"]}</td>
                                        <td>{item.total}</td>
                                        </tr>
                                    )
                                })}
                                {/* colSpan={8} align="center" */}
                                
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default NonBillableWorkTable;