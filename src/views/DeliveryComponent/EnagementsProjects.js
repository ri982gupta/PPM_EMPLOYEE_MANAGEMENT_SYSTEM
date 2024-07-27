import React, { useEffect, useState } from "react";
import "./EnguagementsProjects.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { environment } from "../../environments/environment";
import EngagementProjectsTable from "./EngagementProjectsTable";

function EnguagementsProjects(props) {
  const [data, SetData] = useState([]);
  const {
    engagementId,
    urlState,
    setUrlState,
    setbtnState,
    tabsAccess,
    btnState,
  } = props;
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Engagement Search", "Engagements"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  console.log(data);

  let rows = 25;

  //// Getting the getEngagementProjects ///////

  const getEngagementProjects = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/Engagement/getEngagementProjects?cid=${engagementId}`
      )
      .then((Response) => {
        const GetData = Response.data;
        console.log(data);
        const Headerdata = [
          {
            project_code: "Project Code",
            project_name: "Project",
            contract_terms: "Contract Terms",
            business_unit: "BU",
            prj_manager: "Primary Manager",
            prj_stage: "Status",
            planned_start_dt: "Planned Start",
            planned_end_dt: "Planned End",
            actual_start_dt: "Actual Start",
            actual_end_dt: "Actual End",
          },
        ];

        let linkData = ["project_name"];
        let linkRoutes = ["../project/Overview/:project_id"];
        setLinkColumns(linkData);
        setLinkColumnsRoutes(linkRoutes);
        GetData.sort((a, b) => (a.project_code > b.project_code ? 1 : -1));
        let fData = [...Headerdata, ...GetData];
        console.log(fData);

        SetData(fData);

        console.log(Response.data, "line no---40");
      })
      .catch((error) => console.log("Error :" + error));
  };

  useEffect(() => {
    getEngagementProjects();
    getUrlPath();
    getMenus();
  }, []);
  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const deliveryItem = data[7]; // Assuming "Delivery" item is at index 7

      const desiredOrder = [
        "Engagements",
        "Projects",
        "Engagement Allocations",
        "Project Health",
        "Project Status Report",
      ];

      const sortedSubMenus = deliveryItem.subMenus.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.display_name);
        const indexB = desiredOrder.indexOf(b.display_name);
        return indexA - indexB;
      });
      deliveryItem.subMenus = sortedSubMenus;
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/customer/engagementProjects/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  return (
    <div>
      <div className="pageTitle">
        <div className="childOne">
          <div className="tabsProject">
            {tabsAccess.map((button) => (
              <button
                key={button.id}
                className={
                  btnState === button.display_name.toString()
                    ? "buttonDisplayClick"
                    : "buttonDisplay"
                }
                onClick={() => {
                  setbtnState(button.display_name);
                  setUrlState(
                    button.url_path.toString().replace(/::/g, "/") + "/"
                  );
                }}
              >
                {button.display_name}
              </button>
            ))}
          </div>
        </div>
        <div className="childTwo">
          <h2>Overview</h2>
        </div>
        <div className="childThree"></div>
      </div>
      <div className="group mb-3 customCard">
        <div class="col-md-12 no-padding ">
          <EngagementProjectsTable
            data={data}
            rows={rows}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
          />
        </div>
      </div>
    </div>
  );
}
export default EnguagementsProjects;
