import React, { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import moment from "moment";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import DisplayStar from "../ResourceSkillsComponent/DisplayStar";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";

function SkillDetails({ resDtl, textContent, routes, maxHeight1  }) {
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState([]);

  const baseUrl = environment.baseUrl;
  let rows = 25;
  let currentScreenName = ["Insights", "Skills Details"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const Dispstar = (data) => {
    return (
      <span>
        {" "}
        <DisplayStar skillRating={data.skill_rating_id} />
      </span>
    );
  };
  const Linkgroup_name = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["group_name"]}
      >
        {data["group_name"]}
      </div>
    );
  };
  const Linkdisplay_name = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["display_name"]}
      >
        {data["display_name"]}
      </div>
    );
  };
  const Linkskill_category = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["skill_category"]}
      >
        {data["skill_category"]}
      </div>
    );
  };
  const Linkexperience = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        align="right"
        title={data["experience"]}
      >
        {data["experience"]}
      </div>
    );
  };

  const Linklast_used = (data) => {
    return (
      <div
        className="ellipsis"
        align="center"
        data-toggle="tooltip"
        title={data["last_used"]}
      >
        {data["last_used"]}
      </div>
    );
  };
  const Linkskill_status = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["skill_status"]}
      >
        {data["skill_status"]}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "skill_rating_id"
            ? Dispstar
            : col == "group_name"
            ? Linkgroup_name
            : col == "display_name"
            ? Linkdisplay_name
            : col == "skill_category"
            ? Linkskill_category
            : col == "experience"
            ? Linkexperience
            : col == "last_used"
            ? Linklast_used
            : col == "skill_status"
            ? Linkskill_status
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

  const getEmployeeSkillData = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getSkillDetails?rid=${resDtl}`,
    }).then(function (response) {
      const GetData = response.data;
      let dataHeader = [
        {
          group_name: "Skill Group",
          display_name: "Skill",
          skill_category: "Type",
          experience: "Exp (Months)",
          skill_rating_id: "Rating",
          last_used: "Last Used",
          skill_status: "Status",
        },
      ];
      console.log(GetData);
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["experience"] =
          GetData[i]["experience"] == null ? "NA" : GetData[i]["experience"];

        GetData[i]["last_used"] =
          GetData[i]["last_used"] == null
            ? "NA"
            : moment(GetData[i]["last_used"]).format("DD-MMM-yyyy");

        GetData[i]["skill_status"] =
          GetData[i]["skill_status"] == 1 ? " Approved" : "Requested";
      }

      let fData = [...dataHeader, ...GetData];
      console.log(fData);

      setData(fData);
    });
  };
  useEffect(() => {
    getEmployeeSkillData();
  }, [resDtl]);
  const HelpPDFName = "ResourceProfileTeams.pdf";
  const Header = "Resource Profile Help";
  return (
    <div className="col-md-12">
      <div className="col-md-12 mt-1">
        <CellRendererPrimeReactDataTable
          data={data}
          rows={rows}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          CustomersFileName = "Teams insights Skill Details"
          TeamsInsightsSkillDetMaxHgt = {maxHeight1}
        />
      </div>
    </div>
  );
}

export default SkillDetails;
