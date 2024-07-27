import React, { useEffect, useState } from 'react'

function LoginHistoryDisplayData(props) {
    const { loginHistoryData, setScreenTracker, getResourcesLoginHistory,
        resourceLoginHisState, setResourceLoginHisState } = props;

    const [displayData, setDisplayData] = useState(null)

    let columns = [
        "user_id",
        "resource_name",
        "View_And_Upload",
        "Role_View",
        "Role_Approvals",
        "Role_Grid",
    ]

    let columnsEmp = [
        "User Id",
        "Resource Name",
        "View And Upload",
        "Role View",
        "Role Approvals",
        "Role Grid",
    ]

    const [columnsData, setColumnsData] = useState(null)

    useEffect(() => {
        headerData();
    }, [loginHistoryData])

    useEffect(() => {
        displayDataFnc();
    }, [columnsData])


    const headerData = async () => {


        if (loginHistoryData?.length > 0) {
            let data = loginHistoryData[0];
            let keys = Object.keys(data);

            for (let i = 0; i < keys.length; i++) {
                switch (keys[i]) {
                    case "user_id":
                        keys[i] = "User Id"
                        break;
                    case "resource_name":
                        keys[i] = "Resource Name"
                        break;
                    default:
                        keys[i] = keys[i].replaceAll("_", " ");
                        break;
                }
            }


            setColumnsData(keys);
        } else {
            setColumnsData(columnsEmp);
        }

    }

    const onClickHandler = (element, inEle, index, inInd) => {

        if (resourceLoginHisState.state == true && resourceLoginHisState.rowAndColumnIndex == index + "" + inInd) {

            setResourceLoginHisState((prev => ({ ...prev, ["state"]: false, ["rowAndColumnIndex"]: null })))
            // setResourceLoginHisState((prev => ({...prev,["rowAndColumnIndex"] : null}) ))
            // return;
        } else {

            setResourceLoginHisState((prev => ({ ...prev, ["state"]: true, ["rowAndColumnIndex"]: index + "" + inInd })))
            // setResourceLoginHisState((prev => ({...prev,["rowAndColumnIndex"] : index+""+inInd}) ))

            const data = {
                screen_name: inEle,
                user_id: element.user_id,
            };
            getResourcesLoginHistory(data);
        }
    }

    const displayDataFnc = () => {

        let cData = columns;

        setDisplayData(() => {
            return loginHistoryData.map((element, index) => {
                if (index > 0) {
                    let tabData = []
                    cData.forEach((inEle, inInd) => {
                        if (element[inEle] !== undefined) {
                            if (inEle == "user_id" || inEle == "resource_name") {
                                tabData.push(<td  >{element[inEle]}</td>);
                            } else {
                                tabData.push(
                                    <td align="right">
                                        <span
                                            className="pointerCursor"
                                            style={{ color: "blue" }}
                                            onClick={() => { onClickHandler(element, inEle, index, inInd) }}
                                        >
                                            {element[inEle]}
                                        </span>
                                    </td>
                                );
                            }
                        }
                    });
                    return <tr key={index} >{tabData}</tr>
                }
            })
        })
    }


    return (
        <div className='col-md-12 mt-2 customCard'>
            <table style={{ "width": "100%" }} className="table table-bordered table-striped" >
                <tbody>
                    <tr>
                        {columnsData?.map((ele, ind) => {
                            return <th key={ind} >{ele}</th>;
                        })}
                    </tr>
                    {displayData}
                </tbody>
            </table>
        </div>
    )
}

export default LoginHistoryDisplayData