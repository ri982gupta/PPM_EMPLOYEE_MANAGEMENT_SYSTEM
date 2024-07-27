import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiProfileLine } from "react-icons/ri";
import { environment } from "../../environments/environment";
import { Link } from "react-router-dom";
import moment from "moment";
import { TiTick } from "react-icons/ti";
import { AiFillStar } from "react-icons/ai";
import { TbBattery2 } from "react-icons/tb";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function ProjectOverview(props) {
  const baseUrl = environment.baseUrl;

  const { projectId, grp1Items, urlState } = props;
  console.log(grp1Items);
  const dataObject = grp1Items.find(
    (item) => item.display_name === "Project Overview"
  );
  console.log(dataObject?.is_write, "****");
  const [prjName, setPrjName] = useState("");
  const [projectData, setProjectData] = useState([]);
  const [businessUnit, setBusinessUnit] = useState([]);
  const [projectMngr, setProjectMngr] = useState([]);
  const [deliveryMngr, setDeliveryMngr] = useState([]);
  const [riskFactor, setRiskFactor] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [efforts, setEfforts] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [directCost, setDirectCost] = useState([]);
  const [otherCost, setOtherCost] = useState([]);
  console.log(kpiData);

  let container = document.createElement("div");

  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Projects", "Open", "Project", "Overview"];
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
        `/CommonMS/security/authorize?url=/project/overview&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  useEffect(() => {
    getMenus();
  }, []);

  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setProjectData(resp);
        //    setPrjName(resp)
      })
      .catch(function (response) {
        console.log(response);
      });
  };
  container.innerHTML = projectData[0]?.currency;

  const getBusinessUnit = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getBusinessUnit?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setBusinessUnit(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getProjectName = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectName?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setPrjName(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getProjectMngr = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectManager?objectid=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setProjectMngr(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getDeliveryMngr = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/Audit/getDeliveryManager?objectid=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setDeliveryMngr(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getRiskFactor = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/getRiskFactorCharacteristics?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setRiskFactor(resp);
      })
      .catch(function (response) {
        console.log(response);
        getUrlPath();
      });
  };

  const getEfforts = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getEfforts?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setEfforts(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getRevenue = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getRevenue?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setRevenue(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getDirectCost = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getDirectCost?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setDirectCost(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getOtherCost = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getOtherCost?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setOtherCost(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };
  useEffect(() => {
    getProjectOverviewData();
    getBusinessUnit();
    getProjectMngr();
    getDeliveryMngr();
    getRiskFactor();
    getProjectName();
    getKpitableData();
    getEfforts();
    getRevenue();
    getDirectCost();
    getOtherCost();
  }, [projectId]);

  console.log(projectData);

  const getKpitableData = () => {
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Audit/getProjectKpidata`,
      data: {
        businessUnitId: null,
        custName: null,
        prjName: prjName,
        prjId: projectId,
        prjComplexity: null,
        prjStage: null,
        source: null,
        gm: null,
      },
    })
      .then((res) => {
        setKpiData(res.data);
        console.log(res.data);
      })
      .then((error) => {
        console.log("success", error);
      });
  };

  return (
    <div>
      {/* {projectId} */}
      {console.log(projectId)}

      <div>
        {projectData.map((list) => (
          <div className="col-md-12">
            <div className="pageTitle">
              <div className="childOne">
                <h2>
                  {list.projectName}
                  {/* ({list.projectCode}) */}
                </h2>
              </div>
              <div className="childTwo">
                <h2>Overview</h2>
              </div>
              <div className="childThree"></div>
            </div>
          </div>
        ))}

        {projectData.map((list) => (
          <div className="customCard mb-0">
            <div className="group container-fluid grayBg">
              <div className="group-content row">
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Project Code
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.projectCode}
                      >
                        {list.projectCode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Project Name
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7 ">
                      <p
                        data-toggle="tooltip"
                        title={list.projectName}
                        style={{ fontSize: "13px" }}
                      >
                        {list.projectName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Project Category
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7 ">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.projectCategory}
                      >
                        {list.projectCategory}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      PO Number
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7 ">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.poNumber}
                      >
                        {list.poNumber == null ? "" : list.poNumber}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Customer
                    </label>
                    <span className="col-1 p-0">:</span>
                    {dataObject?.is_write == true ? (
                      <div className="col-7 ">
                        <p
                          className=" ellipsis tooltip-ex"
                          data-toggle="tooltip"
                          title={list.customer}
                        >
                          <Link
                            to={`/search/customerSearch/customer/dashboard/:${list.customer_id}`}
                            target="_blank"
                          >
                            {" "}
                            {list.customer}
                          </Link>
                        </p>
                      </div>
                    ) : (
                      <div className="col-7 ">
                        <p
                          className=" ellipsis tooltip-ex"
                          data-toggle="tooltip"
                          title={list.customer}
                        >
                          {list.customer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Division
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.division}
                      >
                        {list.division == null ? "" : list.division}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Engagement Type
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.engagementType}
                      >
                        {list.engagementType == null
                          ? "NA"
                          : list.engagementType}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Engagement Name
                    </label>
                    <span className="col-1 p-0">:</span>
                    {dataObject?.is_write === true ? (
                      <div className="col-7 ">
                        <p
                          className=" ellipsis tooltip-ex"
                          data-toggle="tooltip"
                          title={list.engagementName}
                        >
                          <Link
                            to={`/engagement/Dashboard/:${list.engagementId}`}
                            target="_blank"
                          >
                            {" "}
                            {list.engagementName}
                          </Link>
                        </p>
                      </div>
                    ) : (
                      <div className="col-7 ">
                        <p
                          className=" ellipsis tooltip-ex"
                          data-toggle="tooltip"
                          title={list.engagementName}
                        >
                          {list.engagementName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Engagement Company
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7 ">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.engagementCompany}
                      >
                        {list.engagementCompany}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Contract Terms
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7 ">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.contractTerms}
                      >
                        {list.contractTerms}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Effort Type
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7 ">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.effortType}
                      >
                        {list.effortType == null ? "NA" : list.effortType}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Execution Methodology
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.executionMethodology}
                      >
                        {list.executionMethodology}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Project Phase
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7 ">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.projectPhase}
                      >
                        {list.projectPhase}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Project Complexity
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex "
                        data-toggle="tooltip"
                        title={list.projectComplexity}
                      >
                        {list.complexity_id == 0 ? "" : list.projectComplexity}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Project Stage
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.projectStage}
                      >
                        {list.projectStage}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Scheduling Mode
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.schedulingMode}
                      >
                        {list.schedulingMode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Expenses Billable
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.expenseBillable}
                      >
                        {list.expenseBillable == 1 ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  {/* {container.innerHTML = list.currency} */}
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Currency
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.currency}
                      >
                        {container.textContent}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Time Entry Mode
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.timeEntryMode}
                      >
                        {list.timeEntryMode}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Project Scope
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.projectScope}
                      >
                        {list.projectScope}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Week Calendar
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.weekCalendar}
                      >
                        {list.weekCalendar}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Holiday Calendar
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.holidayCalendar}
                      >
                        {list.holidayCalendar}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Team Location
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.teamLocation}
                      >
                        {list.teamLocation == null ? "NA" : list.teamLocation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Project Manager
                    </label>
                    <span className="col-1 p-0">:</span>
                    {projectMngr.map((list) => (
                      <div className="col-7">
                        <p
                          className=" ellipsis tooltip-ex"
                          data-toggle="tooltip"
                          title={list.ProjectManager}
                        >
                          {list.ProjectManager == null ||
                          list.ProjectManager == ""
                            ? "-"
                            : list.ProjectManager}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Delivery Manager
                    </label>
                    <span className="col-1 p-0">:</span>
                    {deliveryMngr.map((list) => (
                      <div className="col-7">
                        <p
                          className=" ellipsis tooltip-ex"
                          data-toggle="tooltip"
                          title={list.DeliveryManager}
                        >
                          {deliveryMngr.length == 0 ||
                          list.DeliveryManager == " "
                            ? "-"
                            : list.DeliveryManager}
                        </p>
                      </div>
                    ))}
                  </div>
                  {console.log(deliveryMngr.length)}
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Deliverables
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.deliverables}
                      >
                        {list.deliverables}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Sub Practice
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.subPractice}
                      >
                        {list.subPractice}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      SF Engagement Type
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7 ">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.sfEngagementType}
                      >
                        {list.sfEngagementType}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Project Health
                    </label>
                    <span className="col-1 p-0">:</span>
                    {list.project_health_id == 498 ? (
                      <div className="col-7 ">
                        <p
                          className=" ellipsis tooltip-ex projectHealth green"
                          data-toggle="tooltip"
                          title={list.projectHealth}
                        >
                          <TiTick size={"1.5em"} />
                          {list.projectHealth}{" "}
                        </p>
                      </div>
                    ) : list.project_health_id == 499 ? (
                      <div className="col-7 ">
                        <p
                          className=" ellipsis tooltip-ex projectHealth amber"
                          data-toggle="tooltip"
                          title={list.projectHealth}
                        >
                          <AiFillStar size={"1.5em"} />
                          {list.projectHealth}{" "}
                        </p>
                      </div>
                    ) : list.project_health_id == 500 ? (
                      <div className="col-7 ">
                        <p
                          className=" ellipsis tooltip-ex projectHealth red"
                          data-toggle="tooltip"
                          title={list.projectHealth}
                        >
                          <TbBattery2 size={"1.5em"} />
                          {list.projectHealth}{" "}
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="name-input-inline">
                      Facilitator
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-7">
                      <p
                        className=" ellipsis tooltip-ex"
                        data-toggle="tooltip"
                        title={list.facilitator}
                      >
                        {list.facilitator}
                      </p>
                    </div>
                  </div>
                </div>
                {list.contract == 25 ||
                list.contract == 26 ||
                list.contract == 27 ||
                list.contract == 28 ||
                list.contract == 606 ||
                list.contract == 752 ? (
                  <>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-4" htmlFor="name-input-inline">
                          Client Email
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-7">
                          <p className=" ellipsis tooltip-ex">
                            {list.clientEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-4" htmlFor="name-input-inline">
                          Project Type
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div className="col-7 ">
                          <p className=" ellipsis tooltip-ex">
                            {list.projectType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="group container-fluid">
          <div className="group-content row">
            {businessUnit.map((list) => (
              <div className="col-md-7 mb-2 mt-2 p-0">
                <label htmlFor="name-input-inline">Business Unit</label>
                <div className="grayBg">
                  <p>{list.bussinessUnit}</p>
                </div>
              </div>
            ))}
            {projectData.map((list) => (
              <>
                <div className="col-md-5 mt-2">
                  <label htmlFor="name-input-inline">Services Offered</label>
                  <div className="grayBg">
                    <p>{list.servicesOffered}</p>
                  </div>
                </div>
                <div className="col-md-7 mb-2 mt-2 p-0">
                  <label htmlFor="name-input-inline">
                    Project Description/Business Case
                  </label>
                  <div className="grayBg">
                    <p>{list.business_case}</p>
                  </div>
                </div>
                <div className="col-md-5 mt-2 ">
                  <label htmlFor="name-input-inline">Health Comments</label>
                  <div className="grayBg">
                    <p>{list.prj_health_comments}</p>
                  </div>
                </div>
                <div className="col-md-7 mb-2 p-0">
                  <div className="form-group row">
                    <label className="col-3 ml-1" htmlFor="name-input-inline">
                      SF Engagement Type &nbsp;:
                    </label>
                    {/* <span className="col-1">:</span> */}
                    <p
                      className="col-7 ellipsis tooltip-ex"
                      data-toggle="tooltip"
                      title={list.sfEngagementType}
                    >
                      {list.sfEngagementType}
                    </p>
                  </div>
                  <div className="col-12  mb-2 p-0">
                    <div class="col-12 p-0">
                      <table id="table-fields" class="table">
                        <tbody className="table_Body">
                          <tr>
                            <th colSpan={5} style={{ color: "#187fde" }}>
                              <RiProfileLine /> Project KPI's
                            </th>
                          </tr>
                          <tr>
                            <th>
                              <center>KPI</center>
                            </th>
                            <th>
                              <center>Preliminary</center>
                            </th>
                            <th>
                              <center>Contracted</center>
                            </th>
                            <th>
                              <center>Planned</center>
                            </th>
                            <th>
                              <center>Actual</center>
                            </th>
                          </tr>

                          <tr>
                            <td>Schedule</td>
                            <td>
                              {list.preStartDate == null
                                ? "-"
                                : moment(list.preStartDate).format(
                                    "DD-MMM-yyyy"
                                  )}{" "}
                              to{" "}
                              {list.preEndDate == null
                                ? "-"
                                : moment(list.preEndDate).format("DD-MMM-yyyy")}
                            </td>
                            <td>
                              {list.contStartDate == null
                                ? "-"
                                : moment(list.contStartDate).format(
                                    "DD-MMM-yyyy"
                                  )}{" "}
                              to{" "}
                              {list.contEndDate == null
                                ? "-"
                                : moment(list.contEndDate).format(
                                    "DD-MMM-yyyy"
                                  )}
                            </td>
                            <td>
                              {list.plandStartDate == null
                                ? "-"
                                : moment(list.plandStartDate).format(
                                    "DD-MMM-yyyy"
                                  )}{" "}
                              to{" "}
                              {list.plandEndDate == null
                                ? "-"
                                : moment(list.plandEndDate).format(
                                    "DD-MMM-yyyy"
                                  )}
                            </td>
                            <td>
                              {list.actStartDate == null
                                ? "NA"
                                : moment(list.actStartDate).format(
                                    "DD-MMM-yyyy"
                                  )}{" "}
                              to{" "}
                              {list.actEndDate == null
                                ? "-"
                                : moment(list.actEndDate).format("DD-MMM-yyyy")}
                            </td>
                          </tr>
                          {kpiData.map((data) => (
                            <>
                              {console.log(
                                data.planned_hours?.toLocaleString("en-US")
                              )}
                              <tr>
                                <td>Duration (Days)</td>
                                <td className="text-right">
                                  {data.preliminary_duration}
                                </td>
                                <td className="text-right">
                                  {data.contracted_duration}
                                </td>
                                <td className="text-right">
                                  {data.planned_duration}
                                </td>
                                <td className="text-right">
                                  {data.actual_duration}
                                </td>
                              </tr>
                              <tr>
                                <td>FTE</td>
                                <td className="text-right">
                                  {data.preliminary_fte == null
                                    ? "-"
                                    : Math.round(projectData[0]?.fte)}
                                </td>
                                <td className="text-right">
                                  {data.contracted_fte}
                                </td>
                                <td className="text-right">
                                  {data.planned_fte}
                                </td>
                                <td className="text-right">
                                  {data.employee_offshore == null
                                    ? 0
                                    : data.employee_offshore}
                                </td>
                              </tr>
                              <tr>
                                <td>Efforts(Hrs)</td>
                                <td className="text-right">
                                  {efforts[0]?.value == null
                                    ? 0
                                    : efforts[0]?.value?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {efforts[0]?.value == null
                                    ? 0
                                    : efforts[1]?.value?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {data.planned_hours == null
                                    ? 0
                                    : data.planned_hours?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {data.actual_hours == null
                                    ? 0
                                    : data.actual_hours?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                              </tr>
                              <tr>
                                <td>Revenue</td>
                                <td className="text-right">
                                  {revenue[0]?.value == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      revenue[0]?.value?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {revenue[1]?.value == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      revenue[1]?.value?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {data.planned_revenue == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      data.planned_revenue?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {data.actual_revenue == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      data.actual_revenue?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                              </tr>

                              <tr>
                                <td>Resource Direct Cost</td>
                                <td className="text-right">
                                  {directCost[0]?.value == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      directCost[0]?.value?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {directCost[1]?.value == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      directCost[1]?.value?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {data.planned_direct_cost == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      data.planned_direct_cost?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {data.actual_direct_cost == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      data.actual_direct_cost?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                              </tr>
                              <tr>
                                <td>Other Cost</td>
                                <td className="text-right">
                                  {otherCost[0]?.value == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      otherCost[0]?.value?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {otherCost[1]?.value == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      otherCost[1]?.value?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {data.planned_other_cost == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      data.planned_other_cost?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                                <td className="text-right">
                                  {data.actual_other_cost == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      data.actual_other_cost?.toLocaleString(
                                        "en-IN"
                                      )}
                                </td>
                              </tr>

                              <tr>
                                <td>Gross Margin</td>
                                <td className="text-right">
                                  {revenue[0]?.value == null ||
                                  directCost[0]?.value == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      (
                                        revenue[0]?.value -
                                        (directCost[0]?.value +
                                          otherCost[0]?.value)
                                      )?.toLocaleString("en-IN")}
                                </td>
                                <td className="text-right">
                                  {revenue[1]?.value == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      (
                                        revenue[1]?.value -
                                        (directCost[1]?.value +
                                          otherCost[1]?.value)
                                      )?.toLocaleString("en-IN")}
                                </td>
                                <td className="text-right">
                                  {data.planned_revenue == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      (
                                        data.planned_revenue -
                                        (data.planned_direct_cost +
                                          data.planned_other_cost)
                                      )?.toLocaleString("en-IN")}
                                </td>
                                <td className="text-right">
                                  {data.actual_revenue == null
                                    ? container.textContent + " " + 0
                                    : container.textContent +
                                      " " +
                                      (
                                        data.actual_revenue -
                                        (data.actual_direct_cost +
                                          data.actual_other_cost)
                                      )?.toLocaleString("en-IN")}
                                </td>
                              </tr>
                              <tr>
                                <td>GM%</td>
                                <td className="text-right">
                                  {revenue[0]?.value == null ||
                                  directCost[0]?.value == 0 ||
                                  directCost[0]?.value == null
                                    ? 0.0
                                    : (
                                        Math.round(
                                          (((revenue[0]?.value -
                                            (directCost[0]?.value +
                                              otherCost[0]?.value)) *
                                            100) /
                                            revenue[0]?.value) *
                                            100
                                        ) / 100
                                      )?.toLocaleString("en-IN")}
                                </td>
                                <td className="text-right">
                                  {revenue[1]?.value == null ||
                                  directCost[1]?.value == 0 ||
                                  directCost[1]?.value == null
                                    ? 0
                                    : (
                                        Math.round(
                                          (((revenue[1]?.value -
                                            (directCost[1]?.value +
                                              otherCost[1]?.value)) *
                                            100) /
                                            revenue[1]?.value) *
                                            100
                                        ) / 100
                                      )?.toLocaleString("en-IN")}
                                </td>
                                <td className="text-right">
                                  {data.planned_revenue == null ||
                                    (
                                      Math.round(
                                        (((data.planned_revenue -
                                          (data.planned_direct_cost +
                                            data.planned_other_cost)) *
                                          100) /
                                          data.planned_revenue) *
                                          100
                                      ) / 100
                                    )?.toLocaleString("en-IN")}
                                </td>
                                <td className="text-right">
                                  {data.actual_revenue == null
                                    ? "NA"
                                    : (
                                        Math.round(
                                          (((data.actual_revenue -
                                            (data.actual_direct_cost +
                                              data.actual_other_cost)) *
                                            100) /
                                            data.actual_revenue) *
                                            100
                                        ) / 100
                                      )?.toLocaleString("en-IN")}
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {list.projCat == 17 ||
                list.projCat == 18 ||
                list.projCat == 19 ? (
                  <div className=" col-md-5 mt-5 pt-2">
                    <div className="customCard p-0">
                      <table
                        className="table table-bordered table-striped"
                        role="grid"
                      >
                        <tbody>
                          <tr>
                            {/* <div className='col-md-12 ' > */}

                            <th style={{ color: "#187fde" }}>
                              <RiProfileLine />
                              <span className="ml-1">
                                Risk Factor Characteristics
                              </span>
                            </th>

                            {/* </div> */}
                          </tr>
                          {/* </thead> */}
                          {/* <tbody> */}
                          <tr>
                            <td className="p-0">
                              {riskFactor.map((list) => (
                                <div className="group mb-1 container-fluid">
                                  <div className="group-content row ">
                                    <div className=" col-md-12 mb-2">
                                      <div className="form-group row">
                                        <label
                                          className="col-7"
                                          htmlFor="name-input-inline"
                                        >
                                          Technical Complexity
                                        </label>
                                        <span className="col-1 p-0">:</span>
                                        <div className="col-4">
                                          <lable>{list.techComplexity}</lable>
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" col-md-12 mb-2">
                                      <div className="form-group row">
                                        <label
                                          className="col-7"
                                          htmlFor="name-input-inline"
                                        >
                                          Domain Specific Challenges
                                        </label>
                                        <span className="col-1 p-0">:</span>
                                        <div className="col-4">
                                          <p>{list.domSpecChallenge}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" col-md-12 mb-2">
                                      <div className="form-group row">
                                        <label
                                          className="col-7"
                                          htmlFor="name-input-inline"
                                        >
                                          Skilled Resources Availability
                                        </label>
                                        <span className="col-1 p-0">:</span>
                                        <div className="col-4">
                                          <p>{list.skillResAvail}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" col-md-12 mb-2">
                                      <div className="form-group row">
                                        <label
                                          className="col-7"
                                          htmlFor="name-input-inline"
                                        >
                                          Dependencies on Third Party Systems
                                        </label>
                                        <span className="col-1 p-0">:</span>
                                        <div className="col-4">
                                          <p>{list.depThirdPartySys}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" col-md-12 mb-2">
                                      <div className="form-group row">
                                        <label
                                          className="col-7"
                                          htmlFor="name-input-inline"
                                        >
                                          Development Environment Availability
                                        </label>
                                        <span className="col-1 p-0">:</span>
                                        <div className="col-4">
                                          <p>{list.devEnvAvail}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" col-md-12 mb-2">
                                      <div className="form-group row">
                                        <label
                                          className="col-7"
                                          htmlFor="name-input-inline"
                                        >
                                          Dependencies on customer/Customer
                                          Environment
                                        </label>
                                        <span className="col-1 p-0">:</span>
                                        <div className="col-4">
                                          <p>{list.custEnv}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className=" col-md-12 mb-2">
                                      <div className="form-group row">
                                        <label
                                          className="col-7"
                                          htmlFor="name-input-inline"
                                        >
                                          Margin/Profitability
                                        </label>
                                        <span className="col-1 p-0">:</span>
                                        <div className="col-4">
                                          <p>{list.profitability}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectOverview;
