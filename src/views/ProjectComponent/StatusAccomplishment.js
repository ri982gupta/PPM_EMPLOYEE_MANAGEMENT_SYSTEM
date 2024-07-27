import React from "react";
import { environment } from "../../environments/environment";
import "./Project.scss";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import { useState, useEffect } from "react";
import axios from "axios";
import { Column } from "primereact/column";
import moment from "moment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";

function StatusAccomplishment(props) {
  const { pid } = props;
  const [data, setData] = useState([{}]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const baseUrl = environment.baseUrl;

  ////////////////////////////Date-Filtering/////////////////////////////

  const dates = {
    fromDate: moment().startOf("week").add("days", 1).format("YYYY-MM-DD"),
    toDate: moment().startOf("week").add("days", 7).format("YYYY-MM-DD"),
  };
  console.log(moment().format("YYYY-MM-DD"));
  const [dt, setDt] = useState(dates);

  const addHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate).add("days", 7).format("YYYY-MM-DD"),
    }));

    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).add("days", 7).format("YYYY-MM-DD"),
    }));
  };

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
  ////////////////////////////////////////////////////////////////////////

  ////////----------------------------Getting Accomplishment Data--------------------------////////

  const getData = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/Accomplishments/getProjectDateAccomplishments?fromDate=${dt.fromDate}&toDate=${dt.toDate}&pid=${pid}`
      )
      .then((res) => {
        let headerData = [{ accomplishment: "Accomplishments" }];
        const GetData = res.data;
        // setData(headerData.concat(GetData));
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
    <div className="ellipsis" title={data.accomplishment}>
      {data.accomplishment}
    </div>
  );

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    console.log(col);
    return (
      <Column
        sortable
        key={col}
        body={col == "accomplishment" ? RiskValueChange : null}
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  ////////--------------------------Getting Accomplishment Data END------------------------////////

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
export default StatusAccomplishment;
