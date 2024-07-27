import React, { useState, useEffect } from "react";
import { NPSSurveyQuestionsData } from "./NPSSurveyQuestionsData";
import DataTable from "react-data-table-component";
import NPSSurveyDataTable from "./NPSSurveyDataTable";
import axios from "axios";
import { environment } from "../../environments/environment";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function NPSSurveyQuestions() {
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;

  const [routes, setRoutes] = useState([]);
  let textContent = "Governance";
  let currentScreenName = ["NPS Survey Questions"];
  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

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
        `/CommonMS/security/authorize?url=/pcqa/csatNPVSurveyQuestions&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  return (
    <>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>NPS Survey Questions</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <NPSSurveyDataTable maxHeight1 = {maxHeight1}/>

    </>
  );
}

export default NPSSurveyQuestions;
