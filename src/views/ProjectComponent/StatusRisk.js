import React from "react";
import { environment } from "../../environments/environment";
import "./Project.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";

function StatusRisk(props) {
  const { pid } = props;
  const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const baseUrl = environment.baseUrl;

  ////////----------------------------Getting Risk Data--------------------------////////

  const getData = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/risks?pid=${pid}`)
      // axios.get(`http://localhost:8090/ProjectMS/project/risks?pid=${pid}`)
      .then((res) => {
        const GetData = res.data;
        let headerData = [
          {
            riskName: "Risk Name",
            riskType: "Risk Type",
            riskSource: "Risk Source",
            riskImpact: "Risk Impact",
            probabOcc: "Probability of Occurrence",
            riskValue: "Risk Value",
            assignedTo: "Assigned To",
            riskOccurred: "Risk Occurred",
            riskStatus: "Risk Status",
            occuredDate: "Occurred Date",
            createdBy: "Created By",
          },
        ];
        let fData = [...headerData, ...GetData];
        console.log(fData);
        setData(fData);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData();
  }, []);

  const RiskValueChange = (data) => (
    <div className="ellipsis" style={{ textAlign: "right" }}>
      {data.riskValue}
    </div>
  );

  const RiskNameChange = (data) => (
    <div className="ellipsis" title={data.riskName}>
      {data.riskName}
    </div>
  );

  const AssingedToChange = (data) => (
    <div className="ellipsis" title={data.assignedTo}>
      {data.assignedTo}
    </div>
  );

  const CreatedByChange = (data) => (
    <div className="ellipsis" title={data.createdBy}>
      {data.createdBy}
    </div>
  );

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    console.log(col);
    return (
      <Column
        sortable
        key={col}
        body={
          col == "riskValue"
            ? RiskValueChange
            : null || col == "riskName"
            ? RiskNameChange
            : null || col == "assignedTo"
            ? AssingedToChange
            : null || col == "createdBy"
            ? CreatedByChange
            : null
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  ////////--------------------------Getting Risk Data END------------------------////////

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
export default StatusRisk;
