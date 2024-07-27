import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";

import { environment } from "../../environments/environment";

function ParentVendorTabs({ btnState, setbtnState, setUrlState }) {
  const [access, setAccess] = useState([]);
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const url = window.location.href;
  const projectArr = url.split(":");
  const projectsId = projectArr[projectArr.length - 1];
  console.log(projectArr[3]);
  // /CommonMS/master/getTabMenus?ProjectId=117&loggedUserId=4452475&type=vendor&subType=vmg
  const getAccess = (a) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/master/getTabMenus?ProjectId=${projectsId}&loggedUserId=${loggedUserId}&type=vendor&subType=vmg`,
    })
      .then(function (response) {
        var resp = response.data;
        const updatedResp = resp.map((item) => {
          if (item.display_name === "Performance") {
            return { ...item, display_name: "Subk GM Analysis" };
          }
          return item;
        });
        // setResp(updatedResp);
        // resp.push({ id: "-1", name: "<<ALL>>" });
        updatedResp.push({
          display_name: "Trend",
          is_delete: true,
          is_write: true,
          parent_id: 978,
          userRoles: "307,657,687,695",
          url_path: "::vmg::Trend",
          id: 0,
          grp: 60,
          sort_order: 6,
          is_enabled: true,
          is_read: true,
        });
        setAccess(updatedResp);
      })
      .catch(function (response) {});
  };
  useEffect(() => {
    getAccess();
  }, []);
  console.log(access);
  return (
    <div className="tabsProject">
      {access.map((button) =>
        button.display_name == "Resources" ? (
          <div>
            {
              <ul className="tabsContainer">
                <li>
                  {<span>Resources</span>}
                  <ul>
                    <li
                      className={
                        btnState === "Current Resources"
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState("Current Resources");
                        console.log(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      Current
                    </li>
                    <li
                      className={
                        btnState === "DateRange Resources"
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState("DateRange Resources");
                        console.log(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      Date Range
                    </li>
                    <li
                      className={
                        btnState === "viewAll Resources"
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setbtnState("viewAll Resources");
                        console.log(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      View All
                    </li>
                  </ul>
                </li>
              </ul>
            }
          </div>
        ) : (
          <button
            key={button.id}
            className={
              btnState === button.display_name.toString()
                ? "buttonDisplayClick"
                : "buttonDisplay"
            }
            onClick={() => {
              setbtnState(button.display_name.toString());
              console.log(button.display_name);
              setUrlState(button.url_path.toString().replace(/::/g, "/"));
            }}
          >
            {button.display_name}
          </button>
        )
      )}
    </div>
    // <div className="tabsProject">
    //   <button
    //     className={
    //       btnState === "Dashboard" ? "buttonDisplayClick" : "buttonDisplay"
    //     }
    //     onClick={() => {
    //       setbtnState("Dashboard");
    //       setUrlState("/vmg/dashboard/");
    //     }}
    //   >
    //     Dashboard
    //   </button>
    //   <button
    //     className={btnState === "Edit" ? "buttonDisplayClick" : "buttonDisplay"}
    //     onClick={() => {
    //       setbtnState("Edit");
    //       setUrlState("/vmg/info");
    //     }}
    //   >
    //     Edit
    //   </button>
    //   <button
    //     className={
    //       btnState === "Documents" ? "buttonDisplayClick" : "buttonDisplay"
    //     }
    //     onClick={() => {
    //       setbtnState("Documents");
    //       setUrlState("/vmg/documents/");
    //     }}
    //   >
    //     Documents
    //   </button>
    //   <button
    //     className={
    //       btnState === "Resourses" ? "buttonDisplayClick" : "buttonDisplay"
    //     }
    //     onClick={() => {
    //       setbtnState("Resourses");
    //       setUrlState("/vmg/resources");
    //     }}
    //   >
    //     Resources
    //   </button>
    //   <button
    //     className={
    //       btnState === "Reviews" ? "buttonDisplayClick" : "buttonDisplay"
    //     }
    //     onClick={() => {
    //       setbtnState("Reviews");
    //       setUrlState("/vmg/reviews");
    //     }}
    //   >
    //     Reviews
    //   </button>
    //   <button
    //     className={
    //       btnState === "Performance" ? "buttonDisplayClick" : "buttonDisplay"
    //     }
    //     onClick={() => {
    //       setbtnState("Performance");
    //       setUrlState("/vmg/performance");
    //     }}
    //   >
    //     Performance
    //   </button>
    // </div>
  );
}

export default ParentVendorTabs;
