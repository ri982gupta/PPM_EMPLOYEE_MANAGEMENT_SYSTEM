import React, { useState, useEffect } from "react";
//import VendorPerformanceMaterialTable from "./VendorPerformanceMaterialTable";
import VendorPerformanceTopMaterialTable from "./VendorPerformanceTopMaterialTable";

function VendorPerformanceTable(props) {
  // console.log(performanceData);

  const {
    performanceData,
    isOn,
    formData,
    tableDisplayView,
    open,
    openNw,
    countname,
    subKGmAnalysis,
    vendorId,
  } = props;
  console.log(performanceData, "performanceData");

  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    let imp = ["XLS"];
    setExportData(imp);
  }, [performanceData]);
  var countNw = 0;
  let tableData = performanceData?.tableData;
  if (tableData) {
    for (let i = 0; i < tableData?.length; i++) {
      if (tableData[i].lvl == 1) {
        countNw++;
      }
    }
  }
  return (
    <div>
      <VendorPerformanceTopMaterialTable
        data={performanceData}
        expandedCols={["supervisor", "emp_cadre"]}
        colExpandState={["0", "0", "name"]}
        rFormData={formData}
        exportData={exportData}
        countNw={countNw}
        isOn={isOn}
        subKGmAnalysis={subKGmAnalysis}
        openNw={openNw}
        tableDisplayView={tableDisplayView}
        countname={countname}
        vendorId={vendorId}
      />
    </div>
  );
}

export default VendorPerformanceTable;
