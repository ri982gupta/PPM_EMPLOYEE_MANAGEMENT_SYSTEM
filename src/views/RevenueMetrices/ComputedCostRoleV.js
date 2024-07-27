import { element } from 'prop-types';
import React, { useEffect, useState } from 'react'
import { FaAngleRight,FaAngleDown,FaAngleLeft } from "react-icons/fa";


function ComputedCostRoleView(props) {
    const [Vdata,onclickchanger,expandableCols] = props
    
    const [expanded,setexpanded] = useState([]);
    const allExecutives = Vdata.filter(item => item.lvl === 1).map(item => item[onclickchanger] );

    const [colexpanded,setcolexpanded] = useState([]);

    const clickExpand = (exec) => {
        if (exec === "Summary") {
            setexpanded(prevState => {
                return prevState.length === allExecutives.length ? [] : allExecutives
            })
        }
        else{
            setexpanded(prevState => {
                return prevState.includes(exec) ? prevState.filter(item => item !== exec) : [...prevState,exec]
            })
        }
    };

    const clickExpandcols = (quartr) => {
        setcolexpanded(prevState => {
            return prevState.includes(quartr) ? prevState.filter(item => item !== quartr) : [...prevState,quartr]
        })
    };
    
    let toggler = 0;
    let coltoggler = 0;
    let headspanner = ""
    const horizontalcolexpands = ["target","call","custForecast","sf","pl","rr","attperc"]
    const conditions = ["id","customerId","execStatus","supervisor","practiceId","countryId","isProspect","lvl","count","isEdit","keyAttr","parentAttr"];

    console.log(Vdata)
    const tableData = Vdata.map((row)=>{
        const rowArray = [];


        toggler = (row["lvl"] === 2 || row["lvl"] === 3 ) ? toggler : (expanded.includes(row[onclickchanger]) ? 1 : 0);

        for (const key in row) {

           
            if (key.includes("Q")) {
                coltoggler =  colexpanded.includes(key.split("_")[1]) ? 1 : 0;
            }
            
            !conditions.includes(key) && (expanded.length > 0 ? true : !expandableCols.includes(key)) &&
            rowArray.push
            (
                row.id < 0 
                ?
                ((row.id === -2 && (key.includes("total") ? (key.split("_")[0] !== (headspanner.split("_")[0])) : (key.split("_")[1] !== headspanner.split("_")[1]) || key.includes("executive")|| key.includes("country") || key.includes("customer"))) || row.id === -1) && (row[key] !== "") &&   
                    <th 
                        key={key}
                        rowSpan={row[key].split("^&")[1] }
                        colSpan={row[key].split("^&")[2] }
                        style={{display:(coltoggler === 0 && ((horizontalcolexpands.some((item)=>key.includes(item))) && !(key.includes("Q") || key.includes("total")))) ? "none" : ""}}
                        >
                        {row[key].split("^&")[0]}
                        {row.id === -2 && row[key].includes("Quart") && <span onClick={()=>{clickExpandcols(key.split("_")[1])}}>{colexpanded.includes(key.split("_")[1]) ? <FaAngleLeft/> : <FaAngleRight/>}</span>}
                    </th>
                :
                <td key={key} style={{display:(( toggler === 0 && (row["lvl"] === 2 || row["lvl"] === 3)) || (coltoggler === 0 && ((horizontalcolexpands.some((item)=>key.includes(item))) && !(key.includes("Q") || key.includes("total"))))) ? "none" : ""}}
                >
                    
                    {key === onclickchanger && row["lvl"] < 2 &&
                        <>
                            <span onClick={()=>clickExpand(row[onclickchanger])}>{(expanded.includes(row[onclickchanger]) || expanded.length === allExecutives.length ) ? <FaAngleDown/> : <FaAngleRight/> }</span> 
                            <span>{icons[row["execStatus"]]}</span>
                        </>
                    }
                    {(key === "customer" && row["customer"] !== "  " && row["customer"] !== "Summary") && <span>{prosicon[row["isProspect"]]}</span>}
                    {key === onclickchanger && row["lvl"] === 2
                    ? row[key].split("^&")[1]
                    : 
                    (key === onclickchanger || key === "country") && row["lvl"] === 3
                    ? ""
                    : row[key]}

                </td>
            
            );
            headspanner = key;
        }
        return (<tr key={row.customerId+row.countryId+row.parentAttr+row.executive+row.practiceId+row.practice+row.keyAttr+row.lvl+row.count+row.supervisor+row.execStatus+row.id}>{rowArray}</tr>);
    })

    // const { roleWiseViewState, columnData } = props;

    // const [tableData, setTableData] = useState([]);
    // const [displayTable, setDisplayTable] = useState(null)
    // const [headerData, setHeaderData] = useState([])

    // useEffect(() => {
    //     roleWiseViewState !== undefined && setTableData(JSON.parse(JSON.stringify(roleWiseViewState)));
    // }, [roleWiseViewState])

    // useEffect(() => {
    //     displayTableData();
    //     displayHeaderData();
    // }, [tableData])



    // const displayTableData = () => {
    //     let tabData = [1,2,3];
    //     setDisplayTable(() => {
    //         return tableData?.map((element, index) => {
    //             let tabData = [1,2,3];
    //             // Object.keys(element).forEach((inEle, inInd) => {
    //             //     if (inEle.includes("id") === false) {

    //             //         if(element[inEle] === null){
    //             //             tabData.push(<td className='ellpss' title={""} >{""}</td>);    
    //             //         }else if((inEle.includes("Cadre")) || (inEle.includes("Role Type"))){
    //             //             tabData.push(<td className='ellpss' title={element[inEle]} >{element[inEle]}</td>);    
    //             //         }else{
    //             //             tabData.push(<td className='ellpss' title={element[inEle]} align="right" ><span style={{ float : "left" }} >{"$"}</span><span align = "right">{element[inEle]}</span></td>);
    //             //         }

    //             //         // tabData.push(<td className='ellpss' title={element[inEle]} >
    //             //         //         <div>
    //             //         //             if(element[inEle] !== null && (inEle.includes("Cadre")===false) && (inEle.includes("Role Type")===false)){

    //             //         //             } && <span align="left" >{"$"}</span>}<span align="right">{element[inEle] === null ? "" : element[inEle]}</span>
    //             //         //         </div>
    //             //         //     </td>);
    //             //     }
    //             // })
    //             return <tr>{tabData}</tr>
    //         })
    //     })
    // }

    // const displayHeaderData = () => {
    //     setHeaderData(() => {
    //         return columnData.map((element, index) => {
    //             let headData = [Project/Customers,Jan,Feb];
    //             // Object.keys(element).forEach((inEle, inInd) => {

    //             //     if (index === 0 ) {
    //             //         headData.push(<th className="ellpss" title={element[inEle]} >{element[inEle]}</th>)
    //             //     } 
    //             //     // else if (index === 1 && (inInd === 0 || inInd === 1)) {
    //             //     //     // headData.push(<th>{element[inEle]}</th>)
    //             //     // } else {
    //             //     //     headData.push(<th className='ellpss' title={element[inEle]} >{element[inEle]}</th>)
    //             //     // }
    //             // })
    //             return <tr className='headerSticky'>{headData}</tr>
    //         })
    //     })
    // }


    return (
        <div >
            <div className='col-md-12 mt-2' style={{ overflow : "auto",maxHeight:"450px" }}>
                <table className='table table-bordered table-striped pipelinetable'>
                    <tbody>
                        {/* {headerData}
                        {displayTable} */}
                        {tableData}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ComputedCostRoleView