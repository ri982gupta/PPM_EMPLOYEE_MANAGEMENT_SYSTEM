import React from "react";
import { environment } from "../../environments/environment";
import "./Project.scss";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import { Column } from "primereact/column";
import moment from "moment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";

function StatusPlannedActivities(props) {
  const { projectId } = props;
  const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const baseUrl = environment.baseUrl;

  ////////////////////////////Date-Filtering/////////////////////////////

  const dates = {
    fromDate: moment().startOf("week").add("days", 8).format("YYYY-MM-DD"),
    toDate: moment().startOf("week").add("days", 14).format("YYYY-MM-DD"),
  };
  const [dt, setDt] = useState(dates);
  console.log(dt.fromDate);
  console.log(dt.toDate);

  const addHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate).add("days", 7).format("YYYY-MM-DD"),
    }));

    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.fromDate).add("days", 13).format("YYYY-MM-DD"),
    }));
  };
  console.log(dt.toDate);

  const subtracHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate)
        .subtract("days", 7)
        .format("YYYY-MM-DD"),
    }));

    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).subtract("days", 7).format("YYYY-MM-DD"),
    }));
  };

  console.log(dt.fromDate);
  console.log(dt.toDate);
  ////////////////////////////////////////////////////////////////////////
  // const date = strtotime(dt.toDate);
  // const Finaldate = strtotime("+7 day", date);
  // console.log(first)

  ////////----------------------------Getting plannedactivities Data--------------------------////////

  const getData = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/project/getProjectDatePlannedActivities?pid=${projectId}&createdDate=${dt.fromDate}&modifiedDate=${dt.toDate}`
      )
      .then((res) => {
        const GetData = res.data;
        let headerData = [{ planned_activity: "Planned Activity" }];
        let fData = [...headerData, ...GetData];
        console.log(fData);
        setData(fData);
      })
      .catch((error) => {});
  };
  useEffect(() => {
    getData();
  }, [dt]);

  const RiskValueChange = (data) => (
    <div className="ellipsis" title={data.planned_activity}>
      {data.planned_activity}
    </div>
  );

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    console.log(col);
    return (
      <Column
        sortable
        key={col}
        body={col == "planned_activity" ? RiskValueChange : null}
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  ////////--------------------------Getting plannedactivities Data END------------------------////////

  return (
    <div>
      <div>
        <strong>
          {moment(dt.fromDate).format("DD-MMM-YYYY")} to{" "}
          {moment(dt.toDate).format("DD-MMM-YYYY")}
        </strong>
        <span style={{ float: "right" }}>
          <AiOutlineLeftSquare
            cursor="pointer"
            size={"2em"}
            onClick={subtracHandler}
          ></AiOutlineLeftSquare>
          <AiOutlineRightSquare
            cursor="pointer"
            size={"2em"}
            onClick={addHandler}
          ></AiOutlineRightSquare>
        </span>
      </div>
      <br />

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
export default StatusPlannedActivities;
