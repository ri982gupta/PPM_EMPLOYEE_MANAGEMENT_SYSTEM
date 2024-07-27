import React, { useState, useEffect } from "react";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { environment } from "../../environments/environment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";

import axios from "axios";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
function ReporteeDetails({ resDtl, textContent, routes,  maxHeight1 }) {
  console.log(resDtl);
  const [reporteeDetails, setReporteeDetails] = useState([]);
  const baseUrl = environment.baseUrl;
  const [data, setData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  let rows = 25;
  let currentScreenName = ["Insights", "Reportee Details"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const LinkTemplate = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data["empName"]}>
        {data["empName"]}
      </div>
    );
  };
  const LinkName = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data["name"]}>
        {data["name"]}
      </div>
    );
  };
  const LinkLongTitle = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["long_title"]}
      >
        {data["long_title"]}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "empName"
            ? LinkTemplate
            : col == "name"
            ? LinkName
            : col == "long_title"
            ? LinkLongTitle
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  const getReporteeDetails = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getReporteeDtls?rid=${resDtl}`,
    }).then(function (response) {
      const GetData = response.data;
      let dataHeader = [
        {
          empName: "Employee Name",
          name: "Business Unit",
          long_title: "Designation",
        },
      ];
      let fData = [...dataHeader, ...GetData];
      console.log(fData);
      setData(fData);
      setLinkColumns(data);
    });
  };
  console.log(reporteeDetails);
  useEffect(() => {
    getReporteeDetails();
  }, [resDtl]);
  const HelpPDFName = "ResourceProfileTeams.pdf";
  const Header = "Resource Profile Help";
  return (
    <div>
      <div className="col-md-12">
        <div className="col-md-12 mt-1">
          <CellRendererPrimeReactDataTable
            data={data}
            rows={rows}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            CustomersFileName = "Teams insights Reportee Details"
            TeamsInsightsReporteeDetMaxHgt = {maxHeight1}
          />
        </div>
      </div>
    </div>
  );
}

export default ReporteeDetails;
