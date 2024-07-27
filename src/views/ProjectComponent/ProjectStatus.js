import React from "react";
import { environment } from "../../environments/environment";
import "./Project.scss";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { SlExclamation } from "react-icons/sl";
import { useState, useEffect } from "react";
import axios from "axios";
import { CCollapse } from "@coreui/react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import StatusKpi from "./StatusKpi";
import Loader from "../Loader/Loader";
import StatusAccomplishment from "./StatusAccomplishment";
import StatusPlannedActivities from "./StatusPlannedActivities";
import StatusRisk from "./StatusRisk";
import StatusIssues from "./StatusIssues";
import StatusDependencies from "./StatusDependencies";
import StatusScope from "./StatusScope";
import StatusEvents from "./StatusEvents";
import "./ProjectStatus.scss";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function ProjectStatus(props) {
  const {
    projectId,
    urlState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
    grp6Items,
    btnState,
    setUrlState,
    setbtnState,
  } = props;
  const [visibleA, setVisibleA] = useState(true);
  const [visibleB, setVisibleB] = useState(true);
  const [visibleC, setVisibleC] = useState(true);
  const [visibleD, setVisibleD] = useState(true);
  const [visibleE, setVisibleE] = useState(true);
  const [visibleF, setVisibleF] = useState(true);
  const [cheveronIconA, setCheveronIconA] = useState(FaChevronCircleDown);
  const [cheveronIconB, setCheveronIconB] = useState(FaChevronCircleDown);
  const [cheveronIconC, setCheveronIconC] = useState(FaChevronCircleDown);
  const [cheveronIconD, setCheveronIconD] = useState(FaChevronCircleDown);
  const [cheveronIconE, setCheveronIconE] = useState(FaChevronCircleDown);
  const [cheveronIconF, setCheveronIconF] = useState(FaChevronCircleDown);
  const [loader, setLoader] = useState(false);
  const [n, setN] = useState();
  const pid = projectId;

  // breadcrumbs --
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Global Dashboard"];
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
        `/CommonMS/security/authorize?url=/executive/globalDashboard&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  ////////----------------------------Getting Project Info--------------------------////////
  const [Data, setData] = useState([{}]);
  const [sd, setSd] = useState("");
  console.log(sd);
  const [ed, setEd] = useState("");
  console.log(ed);
  const baseUrl = environment.baseUrl;
  const getData = () => {
    // setLoader(true);
    axios
      .get(baseUrl + `/ProjectMS/project/projectinfo?ProjectId=${projectId}`)
      .then((res) => {
        const GetData = res.data;
        setData(GetData);
        setLoader(false);
        console.log(res.data);
        setSd(res.data[0].planned_start_dt);
        setEd(res.data[0].planned_end_dt);
      })
      .catch((error) => { });
  };
  useEffect(() => {
    getData();
  }, [ed]);
  ////////--------------------------Getting Project Info END------------------------////////

  ////////--------------------------Getting Project Code----------------------------////////
  const [projectCode, setProjectCode] = useState([{}]);
  console.log(projectCode.projectCode);
  const getProjectCode = () => {
    axios
      .get(baseUrl + `/ProjectMS/project/projectCode?ProjectId=${projectId}`)
      .then((res) => {
        const GetData = res.data;
        setProjectCode(GetData);
      })
      .catch((error) => { });
  };
  useEffect(() => {
    getProjectCode();
  }, []);

  console.log(n + "line no 7");
  return (
    <div>
      {loader ? <Loader /> : ""}
      {/* ---------------------------------Title------------------------------- */}

      <div className="pageTitle">
        <div className="childOne">
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
                      // setUrlState(
                      //   button.url_path.toString().replace(/::/g, "/")
                      // );
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
                      // setUrlState(
                      //   button.url_path.toString().replace(/::/g, "/")
                      // );
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
                      // setUrlState(
                      //   button.url_path.toString().replace(/::/g, "/")
                      // );
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
                      // setUrlState(
                      //   button.url_path.toString().replace(/::/g, "/")
                      // );
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
          <h2>Global Dashboard</h2>
        </div>
        <div className="childThree"></div>
      </div>

      <div className="row">
        <div className=" my-3">
          <button className="btn btn-primary float-end ">
            <FaCloudDownloadAlt /> Download as PDF
          </button>
        </div>

        <div className="col-md-12 no-padding " id="fullPrjInfo">
          {Data.map((Details) => (
            <div className="projGlance">
              <div className="row">
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Project Name</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="pname">
                        {Details.project_name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Business Unit</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="bunit">
                        {Details.business_unit}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Customer</label>
                      <span className="col-1  p0">:</span>
                      <span className="col-7 " id="cmer">
                        {Details.customer}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Sub Practice</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="spractice">
                        {Details.sub_practice}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Architect</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="troles">
                        {Details.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">
                        Project Manager
                      </label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7" id="prjManager">
                        {Details.prj_manager}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4 no-padding">
                        Delivery Manager
                      </label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7" id="delManager">
                        {Details.del_manager}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Unit Head</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7" id="uhead">
                        {Details.unit_head}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Current Phase</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="currPhase">
                        {Details.curr_phase}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Billing Model</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="bilModel">
                        {Details.cont_terms}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Project Type</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="pType">
                        {Details.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">
                        Execution Methodology
                      </label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="emethods">
                        {Details.prj_exe}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Start Date</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="sDate">
                        {Details.planned_start_dt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">
                        End Date- Contracted
                      </label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="eDate">
                        {Details.planned_end_dt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">
                        End Date- Estimated
                      </label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="eeDate">
                        {Details.est_planned_end_dt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">% Complete</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7" id="pComplete">
                        {Details.pComplete}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">
                        Billable Utilization %
                      </label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="bUtil">
                        {Details.billable_utilized}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4 no-padding">Planned FTE</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="pFte">
                        {Details.planned_team_size}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">Actual FTE</label>
                      <span className="col-1 p0">:</span>
                      <span className="col-7 " id="aFte">
                        {Details.actual_team_size}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group">
                    <div className="row">
                      <label className="col-4  no-padding">
                        Expense Billable
                      </label>
                      <span className="col-1">:</span>
                      <span className="col-7" id="eBillable">
                        {Details.ebillable}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <br />

        {/* --------------------------------------------------Warning-Box----------------------------------------------- */}
        {Data.map((Details) => (
          <div className="col-md-12 my-1">
            <div
              className="statusMsg
                    warning"
            >
              <span className="bold">
                <SlExclamation />
              </span>
              Note: Values in the table are between
              <span className="">{Details.planned_start_dt}</span> and{" "}
              <span className=""> {Details.planned_end_dt}</span> except
              contracted value.
            </div>
          </div>
        ))}

        {/* --------------------------------------------------KPI-Table----------------------------------------------- */}
        <div className="col-md-12">
          <StatusKpi pid={pid} sd={sd} ed={ed} />
        </div>

        {/* ------------------------------------------------Collapse-Start--------------------------------------------- */}

        <div className="group mb-1 customCard ">
          <div
            className="col-md-12 collapseHeader"
            onClick={() => {
              setVisibleA(!visibleA);
              visibleA
                ? setCheveronIconA(FaChevronCircleUp)
                : setCheveronIconA(FaChevronCircleDown);
            }}
          >
            <h2 className="chevron-icon">
              Accomplishments and Planned Activities
            </h2>
            <div
              onClick={() => {
                setVisibleA(!visibleA);
                visibleA
                  ? setCheveronIconA(FaChevronCircleUp)
                  : setCheveronIconA(FaChevronCircleDown);
              }}
            >
              <span className="chevron-icon">{cheveronIconA}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleA}>
          <div className="row">
            <div className="col-md-6">
              <StatusAccomplishment pid={pid} />
            </div>

            <div className="col-md-6">
              <StatusPlannedActivities pid={pid} />
            </div>
          </div>
        </CCollapse>
        <div className="group mb-1 customCard">
          <div
            className="col-md-12 collapseHeader"
            onClick={() => {
              setVisibleB(!visibleB);
              visibleB
                ? setCheveronIconB(FaChevronCircleUp)
                : setCheveronIconB(FaChevronCircleDown);
            }}
          >
            <h2 className="chevron-icon">Risks</h2>
            <div
              onClick={() => {
                setVisibleB(!visibleB);
                visibleB
                  ? setCheveronIconB(FaChevronCircleUp)
                  : setCheveronIconB(FaChevronCircleDown);
              }}
            >
              <span className="chevron-icon">{cheveronIconB}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleB}>
          <StatusRisk pid={pid} />
        </CCollapse>

        <div className="group mb-1 customCard">
          <div
            onClick={() => {
              setVisibleC(!visibleC);
              visibleC
                ? setCheveronIconC(FaChevronCircleUp)
                : setCheveronIconC(FaChevronCircleDown);
            }}
            className="col-md-12 collapseHeader"
          >
            <h2 className="chevron-icon">Issues</h2>
            <div
              onClick={() => {
                setVisibleC(!visibleC);
                visibleC
                  ? setCheveronIconC(FaChevronCircleUp)
                  : setCheveronIconC(FaChevronCircleDown);
              }}
            >
              <span className="chevron-icon">{cheveronIconC}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleC}>
          <StatusIssues pid={pid} />
        </CCollapse>

        <div className="group mb-1 customCard">
          <div
            className="col-md-12 collapseHeader"
            onClick={() => {
              setVisibleD(!visibleD);
              visibleD
                ? setCheveronIconD(FaChevronCircleUp)
                : setCheveronIconD(FaChevronCircleDown);
            }}
          >
            <h2 className="chevron-icon">Dependencies</h2>
            <div
              onClick={() => {
                setVisibleD(!visibleD);
                visibleD
                  ? setCheveronIconD(FaChevronCircleUp)
                  : setCheveronIconD(FaChevronCircleDown);
              }}
            >
              <span className="chevron-icon">{cheveronIconD}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleD}>
          <StatusDependencies pid={pid} />
        </CCollapse>

        <div className="group mb-1 customCard">
          <div
            className="col-md-12 collapseHeader"
            onClick={() => {
              setVisibleE(!visibleE);
              visibleE
                ? setCheveronIconE(FaChevronCircleUp)
                : setCheveronIconE(FaChevronCircleDown);
            }}
          >
            <h2 className="chevron-icon">Scope Change History and Indicator</h2>
            <div
              onClick={() => {
                setVisibleE(!visibleE);
                visibleE
                  ? setCheveronIconE(FaChevronCircleUp)
                  : setCheveronIconE(FaChevronCircleDown);
              }}
            >
              <span className="chevron-icon">{cheveronIconE}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleE}>
          <StatusScope pid={pid} />
        </CCollapse>

        <div className="group mb-1 customCard">
          <div
            className="col-md-12 collapseHeader"
            onClick={() => {
              setVisibleF(!visibleF);
              visibleF
                ? setCheveronIconF(FaChevronCircleUp)
                : setCheveronIconF(FaChevronCircleDown);
            }}
          >
            <h2 className="chevron-icon">Events</h2>
            <div
              onClick={() => {
                setVisibleF(!visibleF);
                visibleF
                  ? setCheveronIconF(FaChevronCircleUp)
                  : setCheveronIconF(FaChevronCircleDown);
              }}
            >
              <span className="chevron-icon">{cheveronIconF}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={!visibleF}>
          <StatusEvents pid={pid} />
        </CCollapse>

        {/* ------------------------------------------------Collapse-END--------------------------------------------- */}
      </div>
    </div>
  );
}
export default ProjectStatus;
