import React from "react";
import { environment } from "../../environments/environment";
import "./Project.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";

function StatusEvents(props) {
  const { pid } = props;
  const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const baseUrl = environment.baseUrl;

  ////////----------------------------Getting Event Data--------------------------////////
  const getData = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/events?pid=${pid}`)
      // axios.get(`http://localhost:8090/ProjectMS/project/events?pid=${pid}`)
      .then((res) => {
        let headerData = [
          { event: "Event", date: "Date", comments: "Comments" },
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

  const dateChange = (data) => (
    <div className="ellipsis" style={{ textAlign: "center" }}>
      {data.date}
    </div>
  );

  const eventChange = (data) => (
    <div className="ellipsis" title={data.event}>
      {data.event}
    </div>
  );

  const commentsChange = (data) => (
    <div className="ellipsis" title={data.comments}>
      {data.comments}
    </div>
  );

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    console.log(col);
    return (
      <Column
        sortable
        key={col}
        body={
          col == "date"
            ? dateChange
            : null || col == "event"
            ? eventChange
            : null || col == "comments"
            ? commentsChange
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

  ////////--------------------------Getting Event Data END------------------------////////
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
export default StatusEvents;
