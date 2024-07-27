import React from "react";
import { environment } from "../../environments/environment";
import "./Project.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";

function StatusScope(props) {
  const { pid } = props;
  const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const baseUrl = environment.baseUrl;

  ////////----------------------------Getting Scope Data--------------------------////////

  const getData = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/scopechanges?pid=${pid}`)
      // axios.get(`http://localhost:8090/ProjectMS/project/scopechanges?pid=${pid}`)
      .then((res) => {
        let headerData = [
          {
            description: "Description of Change",
            change_req_date: "Change Request Date",
            financial_impact: "Financial Impact",
          },
        ];
        const GetData = res.data;
        console.log(GetData);
        let fData = [...headerData, ...GetData];
        console.log(fData);
        setData(fData);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData();
  }, []);

  ////////--------------------------Getting Scope Data END------------------------////////

  const descriptionChanges = (data) => (
    <div className="ellipsis" title={data.description}>
      {data.description}
    </div>
  );
  const FinancialChanges = (data) => (
    <div className="ellipsis" title={data.financial_impact}>
      {data.financial_impact}
    </div>
  );
  const dateChange = (data) => (
    <div className="ellipsis" style={{textAlign:"center"}}>
      {data.change_req_date}
    </div>
  );

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    console.log(col);
    return (
      <Column
        sortable
        key={col}
        body={col === "description" ? descriptionChanges : col=="financial_impact"? FinancialChanges:col=="change_req_date"?dateChange:null}
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
export default StatusScope;
