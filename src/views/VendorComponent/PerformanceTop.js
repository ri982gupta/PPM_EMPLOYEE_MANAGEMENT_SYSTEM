import React from "react";
import VendorPerformanceMaterialTable from "./VendorPerformanceMaterialTable";
import VendorPerformanceTopMaterialTable from "./VendorPerformanceTopMaterialTable";

const PerformanceTop = (performanceData) => {
  console.log(performanceData);
  return (
    <div>
      <VendorPerformanceTopMaterialTable
        data={performanceData}
        expandedCols={["supervisor", "emp_cadre"]}
        colExpandState={["0", "0", "name"]}
      />
    </div>
  );
};

export default PerformanceTop;
