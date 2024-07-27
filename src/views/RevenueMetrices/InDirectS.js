import { useEffect, useState } from "react";


export default function InDirectSE(params) {

    const {employeeElement,selectedSE,data,showInactive,search} = params;
 
    const [indirectseList,setindirectseList] = useState([])

    
    useEffect(()=>{
        setindirectseList(() => data.filter((item => item.status !== (showInactive ? "" : "empInactive"))).filter((item)=>{ return item.salesPersonName.toLowerCase().includes(search)}).map((item)=>{return(employeeElement(item))}))
    },[selectedSE,showInactive,data,search])


    return(
        <div className="option col-md-3">
           {indirectseList.length === 0 && <div className="col-md-12" id="noExecDiv">No Customers found</div>}       
            {indirectseList}
        </div>
    );
}