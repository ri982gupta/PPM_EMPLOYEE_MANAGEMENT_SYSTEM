import moment from 'moment';
import React, { useEffect, useState } from 'react'

function ResourceLoginHistoryData(props) {
    const { resourceLogHisData } = props;

    const [displayData, setDisplayData] = useState(null)

    let tabData = [
        "ip_address",
        "login_date_and_time"
    ]

    useEffect(() => {
        displayDataFnc();
    }, [resourceLogHisData])

    const displayDataFnc = () => {
        setDisplayData(() => {
            return resourceLogHisData?.map((element, index) => {
                let tab = []
                tabData.forEach((inEle, inInd) => {
                    if (inEle === "login_date_and_time") {
                        tab.push(<td>{moment(element[inEle]).format("DD-MMM-yyyy HH:mm")}</td>);
                    } else {
                        tab.push(<td>{element[inEle]}</td>);
                    }
                })
                return <tr key={index} >{tab}</tr>
            })
        })
    }


    return (
        <div id="costLoginHistoryData" className='col-md-12 customCard'>
            <table className='table table-bordered table-striped'>
                <tbody>
                    <tr className="headerSticky">
                        <th>Ip Address</th>
                        <th>Login Date And Time</th>
                    </tr>
                    {displayData}
                </tbody>
            </table>

        </div>
    )
}

export default ResourceLoginHistoryData