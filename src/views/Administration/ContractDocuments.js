import React, { useState, useEffect } from "react";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { getTableData } from "./ContractDocumentTable";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
function ContractDocuments() {
   
    const [tableData, setTableData] = useState([]);
  const [dataAr, setDataAr] = useState([]);

  useEffect(() => {

    let tdata = getTableData();

    console.log('ski1', tdata);
    setDataAr(tdata);

  }, []);
  return (
    <div><div className="col-md-12">
    <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
            <h2>Project Contract Documents</h2>
        </div>
        <div className="childThree"></div>
    </div>
</div>
<div className="col-md-12">
        <FlatPrimeReactTable data={dataAr} />

      </div>
</div>
  )
}

export default ContractDocuments