import { signal } from '@preact/signals';
import { element } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineHistory } from "react-icons/ai";
import axios from 'axios';
import { environment } from '../../environments/environment';
import moment from 'moment';


const checkedData = signal([]);

function RoleWiseComputedCostTable(props) {
    const { roleWiseComputedCostData, getRoleWiseComputedCost, setLoader } = props;

    const loggedUserId = localStorage.getItem("resId");
    const baseUrl = environment.baseUrl;



    const [tableData, setTableData] = useState(null)
    const [checkBoxState, setCheckBoxState] = useState(false)
    const [approvalStatusBtn, setApprovalStatusBtn] = useState(true)
    const [succesMsg, setSuccesMsg] = useState(false)
    // const [checkedData, setCheckedData] = useState([])
    let columns = ["check", "roleType", "department", "country_name", "computed_cost"];
    let historyColumns = ["computed_cost", "effective_start_date", "effective_end_date"];
    const approvalBtnRef = useRef(null);

    useEffect(() => {
        RoleWiseTableDataDisplay();
    }, [roleWiseComputedCostData])



    const RoleWiseTableDataDisplay = () => {
        setTableData(() => {
            return roleWiseComputedCostData.length > 0 ? roleWiseComputedCostData.map((data, index) => {
                const roleWiseData = data.roleWiseComputedCost;
                const roleWiseHistoryData = data.roleWiseComputedCostHistory;
                let tabData = [];
                columns.forEach((element, innerIndex) => {
                    switch (element) {
                        case "check":
                            tabData.push(<td align={"center"}>
                                <input type="checkBox" onClick={(e) => { childCheckBoxHandler(e, roleWiseData) }} />
                            </td>)
                            break;

                        case "computed_cost":
                            tabData.push(<td align="right" >{roleWiseData[element]}</td>)
                            break;
                        case "roleType":
                            tabData.push(<td>
                                <span>{roleWiseData[element]}</span>
                                <span align="right">
                                    <AiOutlineHistory title={"Computed Cost History"} style={{ color: "blue", cursor: "pointer" }} onClick={(e) => { HistoryHandler(e, index) }} />
                                </span>
                            </td>)
                            break;
                        default:
                            tabData.push(<td>{roleWiseData[element]}</td>)
                            break;
                    }
                });

                return <>
                    <tr id={index} key={index}>{tabData}</tr>
                    <tr className='hideEle'>
                        <td colSpan={"5"}>
                            <DisplaySubTable roleWiseHistoryData={roleWiseHistoryData} />
                        </td>
                    </tr>
                </>
            }) : <td colSpan={"5"} align="center">{"No Rows to Show"}</td>

        })
    }

    const DisplaySubTable = (props) => {

        const { roleWiseHistoryData } = props

        const subTableData = roleWiseHistoryData.length > 0 ? roleWiseHistoryData.map((element, outerIndex) => {
            let subTabData = [];
            historyColumns.forEach((innerEle, innerIndex) => {
                // if(innerIndex === 0){
                //     subTabData.push(<td>{""}</td>)
                // }
                switch (innerEle) {
                    case "effective_start_date":
                        subTabData.push(<td align="center">{element[innerEle] != null ? moment(element[innerEle]).format("DD-MMM-yyyy") : "N/A"}</td>)
                        break;
                    case "effective_end_date":
                        subTabData.push(<td align="center" >{element[innerEle] != null ? moment(element[innerEle]).format("DD-MMM-yyyy") : "N/A"}</td>)
                        break;

                    default:
                        subTabData.push(<td align="right" >{element[innerEle]}</td>)
                        break;
                }
            })
            return <tr>{subTabData}</tr>
        }) :
            <td colSpan={"5"} align="center">{"No Rows to Show"}</td>

        return (
            <table style={{ width: "90%", marginLeft: "4rem" }} className='table table-bordered table-striped'>
                <tbody>
                    <tr>
                        {/* <td></td> */}
                        <th>Computed Cost</th>
                        <th>Effective From</th>
                        <th>Effective To</th>
                    </tr>
                    {subTableData}
                </tbody>
            </table>
        )
    }

    const HistoryHandler = (e, index) => {
        var cls = document.getElementById(index).nextSibling;
        let clsNames = cls.classList;
        clsNames.contains("hideEle") ? clsNames.remove("hideEle") : clsNames.add("hideEle");
    }



    const childCheckBoxHandler = (e, roleWiseData) => {
        var checkBoxes = document.getElementsByTagName("input");

        //*****************checkbox handler************* */
        let checkBoxesData = [];


        let checkedBoxData = checkedData.value

        for (var i = 0; i < checkBoxes.length; i++) {
            if (checkBoxes[i].type == 'checkbox') {
                i > 0 && checkBoxesData.push(checkBoxes[i].checked);
            }
        }



        const found = checkedBoxData.some(el => el.resource_cost_data_id === roleWiseData.resource_cost_data_id)



        if (e.target.checked && found === false) {
            checkedBoxData.push({
                "department_id": roleWiseData.department_id,
                "role_type_id": roleWiseData.role_type_id,
                "country_id": roleWiseData.country_id,
                "computed_cost": roleWiseData.computed_cost,
                "resource_cost_data_id": roleWiseData.resource_cost_data_id
            });
        } else if (e.target.checked === false && found) {

            let tempCheckBoxData = checkedBoxData.filter(ele => {
                return ele.resource_cost_data_id !== roleWiseData.resource_cost_data_id
            })
            checkedBoxData = tempCheckBoxData;
        }

        //    setCheckedData(checkedBoxData);
        checkedData.value = checkedBoxData;

        var parentCheckBox = document.getElementById("parentCheckBox");
        if (checkBoxesData.includes(false)) {
            parentCheckBox.checked = false;
        } else {
            parentCheckBox.checked = true;
        }

        //*****************checkbox handler completed************* */

        enablingOrDisablingBtn();

    }

    const headerCheckBoxHandler = (e) => {
        var checkBoxes = document.getElementsByTagName("input");
        const data = roleWiseComputedCostData;
        let tempCheckData = []
        if (e.target.checked) {
            for (var i = 0; i < checkBoxes.length; i++) {
                if (checkBoxes[i].type == 'checkbox') {
                    checkBoxes[i].checked = true;
                }
                data[i] !== undefined && tempCheckData.push({
                    "department_id": data[i].roleWiseComputedCost.department_id,
                    "role_type_id": data[i].roleWiseComputedCost.role_type_id,
                    "country_id": data[i].roleWiseComputedCost.country_id,
                    "computed_cost": data[i].roleWiseComputedCost.computed_cost,
                    "resource_cost_data_id": data[i].roleWiseComputedCost.resource_cost_data_id
                })
            }

            checkedData.value = tempCheckData;
        } else {
            for (var i = 0; i < checkBoxes.length; i++) {
                if (checkBoxes[i].type == 'checkbox') {
                    checkBoxes[i].checked = false;
                }
            }
            // setCheckedData([]);
            checkedData.value = [];
        }
        // setCheckBoxState(prevVal => e.target.checked);
        enablingOrDisablingBtn();
    }

    // useEffect(() => {
    //     RoleWiseTableDataDisplay();
    // }, [checkBoxState])

    const approveHandler = () => {
        approveComputedCost();
    }


    const approveComputedCost = () => {

        const data = {
            "computedRoleCostData": checkedData.value,
            "loggedUserId": loggedUserId
        }

        setLoader(true);

        axios({
            method: "POST",
            url: baseUrl + `/CostMS/cost/saveComputedRoleCosts`,
            data: data
        }).then(resp => {
            if (resp.data.status === true) {
                setLoader(false);
                setSuccesMsg(true);
                setTimeout(() => {
                    setSuccesMsg(false);
                }, 3000)
            }
            getRoleWiseComputedCost();
        })
    }

    const enablingOrDisablingBtn = () => {
        let tempCheckedData = checkedData.value;
        tempCheckedData.length > 0 ? setApprovalStatusBtn(false) : setApprovalStatusBtn(true);
        let approvalBtn = approvalBtnRef.current;
        approvalBtn.disabled ? approvalBtn.classList?.add("blockButton") : approvalBtn.classList?.remove("blockButton");
    }





    return (
        <div>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12 mt-1 customCard'>
                {succesMsg ? <div className='successMsg'><span>Approved Successfully.</span></div> : ""}
                <div id="roleApprovals">
                    <table className='table table-bordered table-striped'>
                        <tbody >
                            <tr className='headerSticky'>
                                <th><input id="parentCheckBox" type="checkBox" onClick={headerCheckBoxHandler} /></th>
                                <th>Role Type</th>
                                <th>Department</th>
                                <th>Country</th>
                                <th>Computed Cost</th>
                            </tr>
                            {tableData}
                        </tbody>
                    </table>
                </div>
            </div>
            <div align="center" className=' col-md-12 mt-2'>
                <button ref={approvalBtnRef} className={`btn btn-primary ${approvalStatusBtn ? "disabledIcon" : ""}`} disabled={approvalStatusBtn} onClick={(e) => { approveHandler() }}>Approve</button>
            </div>
        </div>
    )
}

export default RoleWiseComputedCostTable