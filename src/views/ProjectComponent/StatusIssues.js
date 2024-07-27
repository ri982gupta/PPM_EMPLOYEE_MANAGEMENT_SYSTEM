import React from "react";
import { environment } from "../../environments/environment";
import "./Project.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";

function StatusIssues(props) {
  const { pid } = props;
  const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const baseUrl = environment.baseUrl;

  ////////----------------------------Getting Issue Data--------------------------////////

  const getData = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/issue?pid=${pid}`)
      // axios.get( `http://localhost:8090/ProjectMS/project/issue?pid=${pid}`)
      .then((res) => {
        let headerData = [
          {
            issueName: "Issue Name",
            criticality: "Criticality",
            status: "Status",
            dueDate: "Due Date",
            issueSource: "Issue Source",
            assignedTo: "Assigned To",
            rcaDone: "RCA Done",
            createdBy: "Created By",
            comments: "Comments",
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

  ////////--------------------------Getting Issue Data END------------------------////////

  const commentChanges = (data) => (
    <div className="ellipsis" title={data.comments}>
      {data.comments}
    </div>
  );

  const issueNameChanges = (data) => (
    <div className="ellipsis" title={data.issueName}>
      {data.issueName}
    </div>
  );

  const assignedToChanges = (data) => (
    <div className="ellipsis" title={data.assignedTo}>
      {data.assignedTo}
    </div>
  );

  const createdByChanges = (data) => (
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
          col === "comments"
            ? commentChanges
            : null || col === "issueName"
            ? issueNameChanges
            : null || col === "assignedTo"
            ? assignedToChanges
            : null || col === "createdBy"
            ? createdByChanges
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
export default StatusIssues;
