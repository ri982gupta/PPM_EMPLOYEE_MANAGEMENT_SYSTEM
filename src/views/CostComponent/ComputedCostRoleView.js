import { element } from 'prop-types';
import React, { useEffect, useState } from 'react'

function ComputedCostRoleView(props) {
    const { roleWiseViewState, columnData } = props;

    const [tableData, setTableData] = useState([]);
    const [displayTable, setDisplayTable] = useState(null)
    const [headerData, setHeaderData] = useState([])

    useEffect(() => {
        roleWiseViewState !== undefined && setTableData(JSON.parse(JSON.stringify(roleWiseViewState)));
    }, [roleWiseViewState])

    useEffect(() => {
        displayTableData();
        displayHeaderData();
    }, [tableData])



    const displayTableData = () => {
        setDisplayTable(() => {
            return tableData?.map((element, index) => {
                let tabData = [];
                Object.keys(element).forEach((inEle, inInd) => {
                    if (inEle.includes("id") === false) {

                        if(element[inEle] === null){
                            tabData.push(<td className='ellpss' title={""} >{""}</td>);    
                        }else if((inEle.includes("Cadre")) || (inEle.includes("Role Type"))){
                            tabData.push(<td className='ellpss' title={element[inEle]} >{element[inEle]}</td>);    
                        }else{
                            tabData.push(<td className='ellpss' title={element[inEle]} align="right" ><span style={{ float : "left" }} >{"$"}</span><span align = "right">{element[inEle]}</span></td>);
                        }

                        // tabData.push(<td className='ellpss' title={element[inEle]} >
                        //         <div>
                        //             if(element[inEle] !== null && (inEle.includes("Cadre")===false) && (inEle.includes("Role Type")===false)){

                        //             } && <span align="left" >{"$"}</span>}<span align="right">{element[inEle] === null ? "" : element[inEle]}</span>
                        //         </div>
                        //     </td>);
                    }
                })
                return <tr>{tabData}</tr>
            })
        })
    }

    const displayHeaderData = () => {
        setHeaderData(() => {
            return columnData.map((element, index) => {
                let headData = [];
                Object.keys(element).forEach((inEle, inInd) => {

                    if (index === 0 ) {
                        headData.push(<th className="ellpss" title={element[inEle]} >{element[inEle]}</th>)
                    } 
                    // else if (index === 1 && (inInd === 0 || inInd === 1)) {
                    //     // headData.push(<th>{element[inEle]}</th>)
                    // } else {
                    //     headData.push(<th className='ellpss' title={element[inEle]} >{element[inEle]}</th>)
                    // }
                })
                return <tr className='headerSticky'>{headData}</tr>
            })
        })
    }


    return (
        <div >
            <div className='col-md-12 mt-2' style={{ overflow : "auto",maxHeight:"450px" }}>
                <table className='table table-bordered table-striped pipelinetable'>
                    <tbody>
                        {headerData}
                        {displayTable}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ComputedCostRoleView