import React, { useState, useEffect } from "react";
import axios from "axios";
// import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { environment } from "../../environments/environment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";

function ProjectRoles({ resDtl }) {
  const baseUrl = environment.baseUrl;

  const [prjRoles, SetPrjRoles] = useState([]);
  useEffect(() => {
    getProjectRoles();
  }, [resDtl]);
  const getProjectRoles = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getResPrjRoleDetails?rid=${resDtl}&dateFlag=0`,
    }).then(function (response) {
      const GetData = response.data;

      let dataHeader = [
        {
          customer: "Customer",
          projectName: "Project Name",
          role_types: "Roles",
        },
      ];

      let data = ["projectName"];
      let linkRoutes = ["/project/Overview/:projectId"];
      setLinkColumns(data);
      setLinkColumnsRoutes(linkRoutes);
      let fData = [...dataHeader, ...GetData];
      console.log(fData);
      SetPrjRoles(fData);

      // console.log(resp)
    });
  };
  console.log(prjRoles);
  let rows = 5;
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const customer = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data["customer"]}>
        {data["customer"]}
      </div>
    );
  };
  const roleTypes = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["role_types"]}
      >
        {data["role_types"]}
      </div>
    );
  };
  const projectName = (data) => {
    console.log("in line 91------------");
    console.log(data);
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          data-toggle="tooltip"
          title={data.projectName}
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
          col == "customer"
            ? customer
            : col == "role_types"
            ? roleTypes
            : col == "projectName"
            ? projectName
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  useEffect(() => {
    prjRoles[0] && setHeaderData(JSON.parse(JSON.stringify(prjRoles[0])));
  }, [prjRoles]);
  return (
    <div>
      <div className="group mb-3 customCard">
        <h2>Project Roles</h2>
        <div className="group mb-3 customCard">
          <div className="col-md-12">
            <div className="col-md-12 mt-1">
              <CellRendererPrimeReactDataTable
                data={prjRoles}
                rows={rows}
                dynamicColumns={dynamicColumns}
                headerData={headerData}
                setHeaderData={setHeaderData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectRoles;
