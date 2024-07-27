import React, { useState, useEffect } from "react";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Link } from "react-router-dom";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
function ProjectDetails({
  resDtl,
  resper,
  textContent,
  routes,
  selecredResId,
  maxHeight1
}) {
  const [dateFlag, setdateFlag] = useState("0");
  console.log(dateFlag);
  const [data, setData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [headerData, setHeaderData] = useState([]);

  const baseUrl = environment.baseUrl;

  let rows = 25;
  let currentScreenName = ["Insights", "Resource Allocation"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const LinkTemplate = (data) => {
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
  const LinkfromDate = (data) => {
    return (
      <div
        className="ellipsis"
        align="center"
        data-toggle="tooltip"
        title={data["fromDate"]}
      >
        {data["fromDate"]}
      </div>
    );
  };
  const LinktoDate = (data) => {
    return (
      <div
        className="ellipsis"
        align="center"
        data-toggle="tooltip"
        title={data["toDate"]}
      >
        {data["toDate"]}
      </div>
    );
  };
  const LinkallocType = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data["allocType"]}>
        {data["allocType"]}
      </div>
    );
  };
  const LinknoOfHrs = (data) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={data["noOfHrs"]}
      >
        {data["noOfHrs"]}
      </div>
    );
  };
  const LinkDailyHours = (data) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={data["DailyHours"]}
      >
        {data["DailyHours"]}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "projectName"
            ? LinkTemplate
            : col == "fromDate"
            ? LinkfromDate
            : col == "toDate"
            ? LinktoDate
            : col == "allocType"
            ? LinkallocType
            : col == "noOfHrs"
            ? LinknoOfHrs
            : col == "DailyHours"
            ? LinkDailyHours
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const getResProjectDtls = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getResProjectDtls?rid=${resDtl}&dateFlag=${dateFlag}`,
    }).then(function (res) {
      const GetData = res.data;
      let dataHeader = [
        {
          projectName: "Project Name",
          fromDate: "From Date",
          customer: "Customer",
          role_type: "Roles",
          toDate: "To Date",
          allocType: "Alloc Type",
          noOfHrs: "Hours",
          DailyHours: "Daily Hours",
        },
      ];

      // console.log(data)
      // setProjectDtls(res);
      // console.log(res)
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["fromDate"] =
          GetData[i]["fromDate"] == null
            ? ""
            : moment(GetData[i]["fromDate"]).format("DD-MMM-yyyy");
        GetData[i]["toDate"] =
          GetData[i]["toDate"] == null
            ? ""
            : moment(GetData[i]["toDate"]).format("DD-MMM-yyyy");
      }

      let data = ["projectName"];
      let linkRoutes = ["/project/Overview/:projectId"];
      setLinkColumns(data);
      setLinkColumnsRoutes(linkRoutes);

      let fData = [...dataHeader, ...GetData];
      console.log(fData);
      setData(fData);
    });
  };
  useEffect(() => {
    getResProjectDtls();
  }, [dateFlag, resper]);

  const handleRadioChange = (e) => {
    console.log(e.target.id, "--radio");
    setdateFlag(e.currentTarget.id);
  };
  const HelpPDFName = "ResourceProfileTeams.pdf";
  const Header = "Resource Profile Help";
  return (
    <div>
      <div className="col-md-12">
        {/* <div className="group mb-3 customCard"> */}
        <div className="col-md-12 mb-2 mt-2">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              // name="0"
              id="0"
              checked={dateFlag == "0"}
              onChange={(e) => handleRadioChange(e)}
            />

            <label htmlFor="country-select">Current+Future</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="-1"
              id="-1"
              checked={dateFlag === "-1"}
              onChange={(e) => handleRadioChange(e)}
            />
            <label htmlFor="past">Past</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name=""
              id=""
              checked={dateFlag === ""}
              onChange={(e) => handleRadioChange(e)}
            />
            <label htmlFor="all">All</label>
          </div>
        </div>

        <div className="col-md-12">
          <CellRendererPrimeReactDataTable
            data={data}
            rows={rows}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            CustomersFileName = "Teams insights Resource Allocation"
            TeamsInsightsMaxHgt = {maxHeight1}
          />

          {/* <FlatPrimeReactTable data={data} rows={rows} /> */}
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default ProjectDetails;
