import React, { useState } from "react";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import PrimeReactSampleTable from "./PrimeReactSampleTable";
import ProjectInvoiceDetailsFilters from "./ProjectInvoiceDetailsFilters";
// import SampleComponent from "./SampleComponent";


function ProjectInvoiceDetails() {
  const [data, setData] = useState([]);

  console.log("in linee 9");
  console.log(data);

  return (
    <div>
      <ProjectInvoiceDetailsFilters setData={setData} />
      {/* <SampleComponent /> */}
      {/* <PrimeReactSampleTable data={data} /> */}
      <FlatPrimeReactTable data={data} />
    </div>
  );
}

export default ProjectInvoiceDetails;
