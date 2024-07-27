import React,{ useState, useEffect} from 'react'
import { getTableData } from "./BillingReportTable";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
function ResourceList() {
  const [dataAr, setDataAr] = useState([]);


  useEffect(() => {
   
    let tdata=getTableData();
   
    //console.log('ski1',tdata);
    setDataAr(tdata);

  }, []);
  return (
    <div>
       <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Resource List</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
   <div className="group customCard">
  {/* <h2>Resource List</h2> */}
  <div className="group-content row">
    {/* <div className="col-md-12">
      <table className="table table-hover table-bordered" id="resourceList">
        <thead>
          <tr>
            <th>Resource</th>
            <th>Start Date</th>
            <th>Exit Date</th>
            <th>Job title</th>
            <th>Location</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td />
            <td />
            <td />
            <td />
            <td />
            <td />
          </tr>
        </tbody>
      </table>
    </div> */}

<div className="col-md-12">
          <FlatPrimeReactTable data={dataAr}/>
    </div>
  </div>
</div>
</div>

  )
}

export default ResourceList