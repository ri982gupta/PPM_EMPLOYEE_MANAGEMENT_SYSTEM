import React from "react";
import { environment } from "../../environments/environment";
import "./Project.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";

function StatusDependencies(props) {
  const { pid } = props;
  const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const baseUrl = environment.baseUrl;

  ////////----------------------------Getting Dependency Data--------------------------////////

  const getData = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/dependency?pid=${pid}`)
      //axios.get(`http://localhost:8090/ProjectMS/project/dependency?pid=${pid}`)
      .then((res) => {
        let headerData = [
          {
            dependency: "Dependency / Constraints",
            type: "Type",
            priority: "Priority",
            raisedBy: "Raised By",
            raisedDate: "Raised Date",
            targetDate: "Target Date",
            assignedTo: "Assigned To",
            phaseAffected: "Phase / Area affected",
            Status: "Status",
          },
        ];
        const GetData = res.data;
        let fData = [...headerData, ...GetData];
        console.log(fData);
        setData(fData);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData();
  }, []);

  ////////--------------------------Getting Dependency Data END------------------------////////

  const phaseChanges = (data) => (
    <div className="ellipsis" title={data.phaseAffected}>
      {data.phaseAffected}
    </div>
  );

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    console.log(col);
    return (
      <Column
        sortable
        key={col}
        body={col === "phaseAffected" ? phaseChanges : null}
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  return (
    <div>
      <CellRendererPrimeReactDataTable
        rows={5}
        data={data}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
        exportData={exportData}
      />
    </div>
  );
}
export default StatusDependencies;
