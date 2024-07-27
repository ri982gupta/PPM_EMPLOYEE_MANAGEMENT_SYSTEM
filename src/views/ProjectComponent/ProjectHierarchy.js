import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import ProjectHierarchyTree from "./ProjectHierarchyTree";
import DatePicker from "react-datepicker";
import CompetencyTable from "./ProjectHierarchySideTable";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
function ProjectHierarchy(props) {
  const {
    projectId,
    grp1Items,
    urlState,
    btnState,
    setbtnState,
    grp2Items,
    grp3Items,
    grp4Items,
    grp6Items,
  } = props;
  const dataObject = grp1Items.find(
    (item) => item.display_name === "Hierarchy"
  );
  const [projectName, setProjectName] = useState([]);
  const baseUrl = environment.baseUrl;
  const [searching, setSearching] = useState(false);
  const [hierarchydata, setHierarchyData] = useState([]);
  const [data2, setData2] = useState([]);
  const [hierarchyCount, setHierarchyCount] = useState(0);

  const [state, setState] = useState("All");
  const [searchinghierarchy, setSearchingHierarchy] = useState(false);
  const [date, SetDate] = useState(new Date());
  const [flag, setFlag] = useState(false);
  const [tableData, setTableData] = useState([]);
  console.log(state);
  console.log("flag", flag);

  const [intialvalues, setInitialvalues] = useState({
    typ: "roles",
    prjId: projectId,
    dat: "0000-00-00",
    state: state,
  });
  const [formData, setFormData] = useState(intialvalues);
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Projects", "Project", "Project Hierarchy"];
  let textContent = "Delivery";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

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

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/project/hierarchy/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const Display = () => {
    setSearching(true);
  };

  useEffect(() => {
    getResourcehierarchy();
    getProjectName();
  }, [state]);
  const getResourcehierarchy = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/project/getProjectHierarchy?typ=${formData.typ}&prjId=${formData.prjId}&dat=${formData.dat}&state=${state}`,
    }).then(function (response) {
      let dd = response.data;
      for (const project of dd) {
        if (project.id === "-1" && project.parent === "#") {
          const cleanedText = project.text.replace(/<\/?[^>]+(>|$)/g, "");

          project.text = cleanedText;
        }
      }
      setHierarchyData(dd);
      setHierarchyCount((prev) => prev + 1);
      setSearchingHierarchy(true);
    });
  };
  const getProjectName = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/getProjectHierarchyName?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectName(resp);
      })
      .catch(function (response) {});
  };

  console.log("-------" + projectName);

  return (
    <>
      <div className="pageTitle">
        <div className="childOne">
          {/* <h2>{projectName.projectName}</h2> */}
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
                      btnState === button.display_name
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
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
          <h2>Project Hierarchy </h2>
        </div>
        <div className="childThree"></div>
      </div>

      <div
        className="col-md-12 mt-2 p-1 customCard card "
        style={{ backgroundColor: "#f4f4f4" }}
      >
        <span
          style={{
            alignSelf: "flex-end",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          <label className="mr-1" style={{ fontWeight: "bold" }}>
            {" "}
            Date :
          </label>
          <DatePicker
            className="hierCalender"
            dropdownMode="select"
            disabledKeyboardNavigation
            showMonthDropdown
            showYearDropdown
            selected={date}
            dateFormat="dd-MMM-yyyy"
            onChange={(date) => SetDate(date)}
            style={{ width: "70px" }}
          />
        </span>
      </div>
      <div className="col-md-12 group-content mr-0 ml-1 row">
        <div
          className="col-md-6 group mb-3 "
          style={{ backgroundColor: "#eeeeee38" }}
        >
          <div
            className="col-md-12"
            style={{
              borderBottom: "1px solid grey",
              background: "#f1eeee",
              height: "36px",
            }}
          >
            <label style={{ float: "right", paddingTop: "7px" }}>
              Edit
              <select
                style={{ marginLeft: "10px" }}
                id="status"
                onChange={(e) => {
                  console.log(e.target.value);
                  setState(e.target.value);
                  getResourcehierarchy();
                }}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
              </select>
            </label>
            <div className="childTwo">
              <h2
                style={{
                  textAlign: "center",
                  color: "#297AB0",
                  fontSize: "14px",
                  paddingTop: "7px",
                }}
              >
                Project Hierarchy
              </h2>
            </div>
          </div>

          {searchinghierarchy == true ? (
            <ProjectHierarchyTree
              defaultExpandedRows={String(-1)}
              data={hierarchydata}
              setFlag={setFlag}
              flag={flag}
              setTableData={setTableData}
              projectName={projectName}
              hierarchyCount={hierarchyCount}
            />
          ) : (
            ""
          )}
        </div>
        {console.log(hierarchydata)}
        <div
          className="col-md-6 group mb-3 customCard card"
          // style={{ backgroundColor: "#f4f4f4", minHeight: "70vh" }}
        >
          <div className="childTwo">
            <h2
              style={{
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                // color: "#297AB0",
              }}
            >
              Competencies
            </h2>
          </div>
          {flag ? <CompetencyTable tableData={tableData} /> : null}
        </div>
      </div>
    </>
  );
}

export default ProjectHierarchy;
