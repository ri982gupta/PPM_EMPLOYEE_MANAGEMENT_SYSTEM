import React, { useState, useEffect } from "react";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { environment } from "../../environments/environment";
import axios from "axios";
import moment from "moment";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";

function TrainingDetails(props) {
  const { resDtlHierarchy, routes, textContent, maxHeight1 } = props;
  const [training, setTraining] = useState([]);
  const [dateFlag1, setdateFlag1] = useState("0");
  const [headerData, setHeaderData] = useState([]);
  const baseUrl = environment.baseUrl;

  let currentScreenName = ["Insights", "Training Details"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  let rows = 25;
  const Linkcourse = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data["course"]}>
        {data["course"]}
      </div>
    );
  };
  const LinkregistrationDate = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        align="center"
        title={data["registrationDate"]}
      >
        {data["registrationDate"]}
      </div>
    );
  };
  const LinkcompletionDate = (data) => {
    return (
      <div
        className="ellipsis"
        align="center"
        data-toggle="tooltip"
        title={data["completionDate"]}
      >
        {data["completionDate"]}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "course"
            ? Linkcourse
            : col == "registrationDate"
            ? LinkregistrationDate
            : col == "completionDate"
            ? LinkcompletionDate
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    training[0] && setHeaderData(JSON.parse(JSON.stringify(training[0])));
  }, [training]);

  const getTraining = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getUserTrainingDtls?rid=${resDtlHierarchy}&dateFlag=${dateFlag1}`,
    }).then(function (response) {
      const GetData = response.data;
      let dataHeader = [
        {
          course: "Course Name",
          registrationDate: "Registration Date",
          completionDate: "Completion Date",
        },
      ];
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["registrationDate"] =
          GetData[i]["registrationDate"] == null
            ? "NA"
            : moment(GetData[i]["registrationDate"])
                .subtract(1, "days")
                .format("DD-MMM-yyyy");
        GetData[i]["completionDate"] =
          GetData[i]["completionDate"] == null
            ? "NA"
            : moment(GetData[i]["completionDate"])
                .subtract(1, "days")
                .format("DD-MMM-yyyy");
      }
      let fData = [...dataHeader, ...GetData];
      console.log(fData);

      setTraining(fData);
    });
  };

  useEffect(() => {
    getTraining();
  }, []);
  useEffect(() => {
    getTraining();
  }, [resDtlHierarchy, dateFlag1]);

  const handleChange = (e) => {
    setdateFlag1(e.currentTarget.id);
    console.log(e.currentTarget.id);
  };
  const HelpPDFName = "ResourceProfileTeams.pdf";
  const Header = "Resource Profile Help";
  return (
    <div className="col-md-12">
      <div className="col-md-12 mt-2">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="0"
            id="0"
            value="0"
            checked={dateFlag1 === "0"}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="country-select">Current</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="-1"
            id="-1"
            checked={dateFlag1 === "-1"}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="country-select">Past</label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name=""
            id=""
            checked={dateFlag1 == ""}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="country-select">All</label>
        </div>
        <div className="col-md-12 mt-1">
          <CellRendererPrimeReactDataTable
            data={training}
            rows={rows}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            CustomersFileName = "Teams insights Training Details"
            TeamsInsightsTrainingMaxHgt = {maxHeight1}
          />
          {/* <FlatPrimeReactTable data={training} rows={rows} /> */}
        </div>
      </div>
    </div>
  );
}

export default TrainingDetails;
