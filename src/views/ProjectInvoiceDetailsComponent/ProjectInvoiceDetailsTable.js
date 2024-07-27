import React, { useEffect, useState } from 'react'

function ProjectInvoiceDetailsTable(props) {
    const { projectInvoiceDetails } = props
    const [displayTable, setDisplayTable] = useState(null)

    useEffect(() => {
        displayTableData();
    }, [projectInvoiceDetails])

    const displayTableData = () => {
        setDisplayTable(() => {
            return projectInvoiceDetails?.map((element, index) => {
                let tabData = [];
                Object.keys(element).forEach((inEle, inInd) => {
                    // if (inEle.includes("id") === false) {

                    // if(element[inEle] === null){
                    //     tabData.push(<td className='ellpss' title={""} >{""}</td>);    
                    // }else if((inEle.includes("Cadre")) || (inEle.includes("Role Type"))){
                    tabData.push(<td className='ellpss' title={element[inEle]} >{element[inEle]}</td>);
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
                })
                return <tr>{tabData}</tr>
            })
        })
    }

    return (
        <div className=' customCard'>
            <div className='col-md-12 mt-2' style={{ overflow: "auto", maxHeight: "450px" }}>
                <table className='table table-bordered table-striped pipelinetable'>
                    <tbody>
                        {displayTable}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProjectInvoiceDetailsTable