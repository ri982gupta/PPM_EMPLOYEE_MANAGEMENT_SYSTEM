import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
// import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
// import "primeicons/primeicons.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/primereact.css";
// import "primeflex/primeflex.css";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import ProjectSearchCellRenderer from "./ProjectSearchCellRenderer";

import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import ProjectSearchCellRendererNormalTable from "./ProjectSearchCellRendererNormalTable";

function ProjectSearchTable(props) {
  const { formData, data, linkColumns, linkColumnsRoutes, flag, maxHeight1, fileName } = props;
  // const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, [data]);

  const baseUrl = environment.baseUrl;

  // const getData = () => {
  //   axios({
  //     method: "post",
  //     url: `http://localhost:8090/ProjectMS/project/getProjectSearch`,
  //     data: {
  //       projectName: formData.projectName,
  //       manager: formData.manager,
  //       primaryBu: formData.primaryBu,
  //       customer: formData.customer,
  //       projectSource: formData.projectSource,
  //       projectStage: formData.projectStage,
  //       po: formData.po,
  //       teamLocation: formData.teamLocation,
  //       engagementType: formData.engagementType,
  //       contractTeams: formData.contractTeams,
  //       FTE: formData.FTE,
  //       currentAllocation: formData.currentAllocation,
  //       PCQAFacilitaor: formData.PCQAFacilitaor,
  //     },
  //     headers: { "Content-Type": "application/json" },
  //   }).then((response) => {
  //     const data = response.data;
  //     let dataHeader = [
  //       {
  //         project_code: "Code",
  //         project_name: "Project Name",
  //         prj_manager: "Project Manager",
  //         sales_executive: "Sales Executive",
  //         prj_stage: "Project Stage",
  //         business_unit: "Primary_BU",
  //         po_number: "PO#",
  //         customer: "Customer",
  //         planned_start_dt: "Pln St Dt",
  //         planned_end_dt: "Pln End Dt",
  //         actual_start_dt: "Act St Dt",
  //         actual_end_dt: "Act End Dt",
  //         team_size: "Team Size",
  //       },
  //     ];
  //     console.log(data, "line no-------55");
  //     setData(dataHeader.concat(data));
  //     //setData(data);
  //     //setSearching(true);
  //   });
  //   // setTimeout(() => {

  //   //     setLoaderState(false)

  //   // }, 1000);
  // };

  // const getData = () => {
  //     // axios.get(baseUrl + `/customersms/Customers/getEngagementRisks?cid=98214365`)
  //     axios.get(``)
  //         .then(res => {
  //             const GetData = res.data;
  //             let dataHeader = [{
  //                 project_Code: "Code", project_name: "Project Name", Project_manager: "Project Manager", Sales_executive: "Sales Executive", project_stage: "Project Stage",
  //                 Primary_bu: "Primary_BU", po: "PO#", customer: "Customer", pln_st_Dt: "Pln St Dt", pln_end_Dt: "Pln End Dt", act_st_Dt: "Act St Dt",
  //                 act_end_Dt: "Act End Dt", team_size: "Team Size"
  //             }]

  //             setData(dataHeader.concat(GetData));
  //             console.log(data)
  //         })
  //         .catch(error => {
  //             console.log("Error :" + error);
  //         }
  //         )
  // }
  for (let i = 1; i < data.length; i++) {
    // data[i]["Risk_occurred"] = data[i]["Risk_occurred"] == true ? "Yes" : "No"
    // data[i]["risk_occured_date"] = data[i]["risk_occured_date"] == null ? "" : moment("risk_occured_date").format('DD-MMM-yyyy')
    // data[i]["mitigation_date"] = data[i]["mitigation_date"] == null ? "" : moment("mitigation_date").format('DD-MMM-yyyy')
  }

  useEffect(() => {
    // getData();
  }, []);
  const projectManagerToolip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.prj_manager}>
        {data.prj_manager}
      </div>
    );
  };
  const salesExeToolip = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.sales_executive}
      >
        {data.sales_executive}
      </div>
    );
  };
  const primartBuToolip = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.business_unit}
      >
        {data.business_unit}
      </div>
    );
  };
  const customerToolip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.customer}>
        {data.customer}
      </div>
    );
  };
  const codeToolip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.project_code}>
        {data.project_code}
      </div>
    );
  };
  const plnStartAlign = (data) => {
    return (
      <div
        align="center"
        style={{ width: "87px" }}
        title={data.planned_start_dt}
      >
        {data.planned_start_dt}
      </div>
    );
  };
  const plnEndAlign = (data) => {
    return (
      <div align="center" style={{ width: "87px" }} title={data.planned_end_dt}>
        {data.planned_end_dt}
      </div>
    );
  };
  const actStartAlign = (data) => {
    return (
      <div
        align="center"
        style={{ width: "87px" }}
        title={data.actual_start_dt}
      >
        {data.actual_start_dt}
      </div>
    );
  };
  const actEndAlign = (data) => {
    return (
      <div align="center" style={{ width: "87px" }} title={data.actual_end_dt}>
        {data.actual_end_dt}
      </div>
    );
  };
  const teamSizeAlign = (data) => {
    return (
      <div align="right" title={data.team_size}>
        {data.team_size}
      </div>
    );
  };

  const contractOnsite = (data) => {
    return (
      <div align="right" title={data.contractor_onsite}>
        {data.contractor_onsite == null ? 0 : data.contractor_onsite}
      </div>
    );
  };
  const contractOffShore = (data) => {
    return (
      <div align="right" title={data.contractor_offshore}>
        {data.contractor_offshore == null ? 0 : data.contractor_offshore}
      </div>
    );
  };

  const employeeOnsite = (data) => {
    return (
      <div align="right" title={data.employee_onsite}>
        {data.employee_onsite == null ? 0 : data.employee_onsite}
      </div>
    );
  };
  const employeeOffShore = (data) => {
    return (
      <div align="right" title={data.employee_offshore}>
        {data.employee_offshore == null ? 0 : data.employee_offshore}
      </div>
    );
  };
  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          title={data.project_name}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "employee_offshore"
            ? employeeOffShore
            : col == "employee_onsite"
            ? employeeOnsite
            : col == "contractor_offshore"
            ? contractOffShore
            : col == "contractor_onsite"
            ? contractOnsite
            : col == "actual_end_dt"
            ? actEndAlign
            : col == "actual_start_dt"
            ? actStartAlign
            : col == "planned_end_dt"
            ? plnEndAlign
            : col == "planned_start_dt"
            ? plnStartAlign
            : col == "project_code"
            ? codeToolip
            : col == "customer"
            ? customerToolip
            : col == "business_unit"
            ? primartBuToolip
            : col == "sales_executive"
            ? salesExeToolip
            : col == "team_size"
            ? teamSizeAlign
            : col == "prj_manager"
            ? projectManagerToolip
            : col == "project_name" && LinkTemplate
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  // return (
  //   <div>

  //     {/* <CellRendererPrimeReactDataTable
  //       data={data}
  //       dynamicColumns={dynamicColumns}
  //       headerData={headerData}
  //       setHeaderData={setHeaderData}
  //       exportData={exportData}
  //       rows={10}
  //     /> */}

  //   </div>
  // );

  return (
    <div>
      {flag === true ? (
        <ProjectSearchCellRenderer
          data={data}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          exportData={exportData}
          rows={25}
        />
      ) : (
        <ProjectSearchCellRendererNormalTable
          data={data}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          exportData={exportData}
          rows={25}
          fileName = {fileName}
          maxHeight1 = {maxHeight1}
        />
      )}
    </div>
  );
}
export default ProjectSearchTable;
