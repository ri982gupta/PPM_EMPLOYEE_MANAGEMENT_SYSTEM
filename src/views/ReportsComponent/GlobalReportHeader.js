import React, { useState } from 'react'

function GlobalReportHeader(props) {

    const initialVal = {
        "reportName" : ""
    };

    console.log("in line 9--------");
    console.log(props)

    // initialVal["reportName"] = props

    // const [reportName, setreportName] = useState(initialVal)

  return initialVal;
}

export default GlobalReportHeader();