import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";

const BenchReportSummaryTable = (props) => {
  const { data1, loaderState, setLoaderState } = props;
  // console.log(data1);
  // const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [bodyData, setBodyData] = useState([]);
  const [searchApiData, setSearchApiData] = useState([]);
  let rows = 10;
  // const initialData = {
  //   BuIds: "170",
  //   CountryIds: "-1",
  //   Typ: "bench",
  //   sessKey: "5121677046610477",
  //   isExport: 0,
  // };
  // const getData = () => {
  //   axios({
  //     method: "post",
  //     url: `http://localhost:8090/fullfilmentms/rolloffs/getBenchReportSummary`,
  //     data: initialData,
  //   }).then((response) => {
  //     let Headerdata = [
  //       {
  //         empId: "Emp. Id",
  //         resource: "Resource",
  //         designation: "Designation",
  //         department: "Department",
  //         customer: "Customer",
  //         LoB: "LoB Category",
  //         cadre_code: "Cadre",
  //         skillGrps: "Skill Group",
  //         Skill: "Skill",
  //         emp_citizenship: "Citizenship",
  //         nectCap: "Net Cap. Hrs",
  //         billHrs: "Billable Hrs",
  //         availHrs: "Available Hrs",
  //         projected: "Availability%",
  //         nbHrs: "Non Bill Hrs",
  //         supervisor: "supervisor",
  //         actionItem: "Action Item",
  //         actionDt: "Action Item Date",
  //         actionEffDt: "Action Effect Date",
  //       },
  //     ];
  //     let dat = response.data;
  //     console.log(dat);
  //     let hData = [];
  //     let bData = [];
  //     for (let index = 0; index < response.length; index++) {
  //       if (index == 0) {
  //         hData.push(response[index]);
  //       } else {
  //         bData.push(response[index]);
  //       }
  //     }
  //     setData(Headerdata.concat(dat));
  //     setBodyData(bData);
  //     setSearchApiData(bData);
  //     setData(dat);
  //     // setLoader(true);
  //     setTimeout(() => {
  //       setLoader(false);
  //     }, 1000);
  //   });
  // };
  // useEffect(() => {
  //   getData();
  // }, []);
  return (
    <div>
      {/* {loader ? <Loader /> : ""} */}
      <FlatPrimeReactTable data={data1} rows={rows} />
    </div>
  );
};

export default BenchReportSummaryTable;
