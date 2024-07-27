import React, { useEffect, useRef } from "react";
import { useState } from "react";
import ExpensesMyRequest from "./ExpensesMyRequests";
import ExpensesTeamRequest from "./ExpensesTeamRequest";
import ExpensesMyApprovalRequests from "./ExpensesMyApprovalRequests";
import axios from "axios";
import { environment } from "../../environments/environment";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function ProjectExpenses(props) {
  const projectId = props.projectId;
  const {
    grp3Items,
    urlState,
    setUrlState,
    bottonstate,
    setButtonState,
    grp1Items,
    grp2Items,
    grp4Items,
    grp6Items,
  } = props;
  const dataObject = grp3Items.find((item) => item.display_name === "Expenses");
  const baseUrl = environment.baseUrl;
  const [btnState, setbtnState] = useState("My Approval Requests");
  const [projectName, setProjectName] = useState([]);
  const [data2, setData2] = useState([]);
  // breadcrumbs --
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects",  "Financials", "Expenses"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const getData1 = resp.data;
      const deliveryItem = getData1[7]; // Assuming "Delivery" item is at index 7

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
   //   console.log(sortedSubMenus);
      setData2(sortedSubMenus);
      
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
        `/CommonMS/security/authorize?url=/project/projectExpenses/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  const getProjectName = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectName?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectName(resp);
      })
      .catch(function (response) {});
  };

  useEffect(() => {
    getProjectName();
  }, []);

  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
  };
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            {/* <h2>{projectName}</h2> */}
            <ul className="tabsContainer">
              <li>
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        bottonstate === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp2Items[0]?.display_name != undefined ? (
                  <span>{grp2Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        bottonstate === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp3Items[0]?.display_name != undefined ? (
                  <span>{grp3Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        bottonstate === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp4Items[0]?.display_name != undefined ? (
                  <span>{grp4Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        bottonstate === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp6Items[0]?.display_name != undefined ? (
                  <span>{grp6Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp6Items.slice(1).map((button) => (
                    <li
                      className={
                        bottonstate === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
          <div className="childTwo">
            <h2>Expenses</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div>
        <div className="tabs">
          <button
            className={
              btnState === "My Requests"
                ? "buttonDisplayClick"
                : "buttonDisplay"
            }
            onClick={() => {
              setbtnState("My Requests");
            }}
          >
            My Requests
          </button>
          <button
            className={
              btnState === "Team Requests"
                ? "buttonDisplayClick"
                : "buttonDisplay"
            }
            onClick={() => {
              setbtnState("Team Requests");
            }}
          >
            Team Requests
          </button>
          <button
            className={
              btnState === "My Approval Requests"
                ? "buttonDisplayClick"
                : "buttonDisplay"
            }
            onClick={() => {
              setbtnState("My Approval Requests");
            }}
          >
            My Approval Requests
          </button>
        </div>
        {btnState === "My Requests" ? (
          <ExpensesMyRequest maxHeight1 = {maxHeight1} projectId={projectId} handleAbort={handleAbort} />
        ) : (
          ""
        )}
        {btnState === "Team Requests" ? (
          <ExpensesTeamRequest
          maxHeight1 = {maxHeight1}
            projectId={projectId}
            handleAbort={handleAbort}
          />
        ) : (
          ""
        )}
        {btnState === "My Approval Requests" ? (
          <ExpensesMyApprovalRequests
          maxHeight1 = {maxHeight1}
            projectId={projectId}
            handleAbort={handleAbort}
            grp3Items={grp3Items}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default ProjectExpenses;
