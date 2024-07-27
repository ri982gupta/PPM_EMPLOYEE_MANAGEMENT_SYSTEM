import React, { useState, useEffect } from "react";
import axios from "axios";
// import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { environment } from "../../environments/environment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";

function CutomerRoles({ resDtl }) {
  const baseUrl = environment.baseUrl;
  const [dateFlag, setdateFlag] = useState(0);

  const [custRoles, SetCustRoles] = useState([]);
  useEffect(() => {
    getTraining();
  }, [resDtl]);

  const getTraining = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getResAccountRoleDtls?rid=${resDtl}&dateFlag=${dateFlag}`,
    }).then(function (response) {
      const GetData = response.data;
      let dataHeader = [
        {
          customer: "Customer",
          role_types: "Roles",
        },
      ];
      let fData = [...dataHeader, ...GetData];
      console.log(fData);
      SetCustRoles(fData);

      // console.log(resp)
    });
  };
  console.log(custRoles);
  let rows = 5;
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
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "customer" ? customer : col == "role_types" ? roleTypes : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  useEffect(() => {
    custRoles[0] && setHeaderData(JSON.parse(JSON.stringify(custRoles[0])));
  }, [custRoles]);
  return (
    <div>
      <div className="group mb-3 customCard">
        <h2>Customer Roles</h2>
        <div className="group mb-3 customCard ">
          <div className="col-md-12">
            {/* <table className="table table-bordered serviceTable" role="grid">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Customer</th>
                  <th style={{ textAlign: "center" }}>Roles</th>
                </tr>
              </thead>
              <tbody ></tbody>
            </table> */}
            <div className="col-md-12 mt-1">
              <CellRendererPrimeReactDataTable
                data={custRoles}
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

export default CutomerRoles;
