import React, { useEffect, useState } from "react";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { environment } from "../../environments/environment";
import axios from "axios";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import DatePicker from "react-datepicker";

import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useRef } from "react";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaCircle,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import moment from "moment";
import ProjectsTable from "./ProjectsTable";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
function Projects(props) {
  const {
    customerId,
    urlState,
    buttonState,
    setButtonState,
    setUrlState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
  } = props;
  const [data, setData] = useState([{}]);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [loader, setLoader] = useState(false);

  const baseUrl = environment.baseUrl;
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [customFilters, setcustomFilters] = useState({});
  const [customFilterValue, setCustomFilterValue] = useState(1);
  const abortController = useRef(null);
  const [sortedData, setSortedData] = useState([]);

  function sortDataByName(data) {
    const sortedData = [...data]; // create a copy of the original array
    sortedData.sort((a, b) => {
      const nameA = a.prj_health ? a.prj_health.toUpperCase() : "";
      const nameB = b.prj_health ? b.prj_health.toUpperCase() : "";
      if (nameA < nameB) {
        return -1;
      }
      if (nameA < nameB) {
        return 1;
      }
      return 0;
    });
    return sortedData;
  }
  const oneYearAgo = moment().subtract(1, "years").format("YYYY-MM-DD");
  console.log(oneYearAgo);
  const [StartDt, setStartDt] = useState(new Date());

  const materialTableElement = document.getElementsByClassName(
    "childTwo"
  );

  const custProjDyMaxHeight =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  console.log(custProjDyMaxHeight, "maxHeight1");

  useEffect(() => {
    const oneYearAgo = moment().subtract(1, "years").toDate();
    setStartDt(oneYearAgo);
  }, []);
  const [details, setDetails] = useState({
    customerId: customerId,
    Status: -1,
    ProjectName: -1,
    ProjectManager: -1,
    StartDate: oneYearAgo,
    EndDate: null,
    ContractTerms: -1,
  });
  const [manager, setManager] = useState([]);
  console.log(manager);
  const [project, setProject] = useState([]);
  console.log(details.ProjectName);
  console.log(project);

  const getManagerdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/dashboardsms/allocationDashboard/getManagers`,
    }).then(function (response) {
      var resp = response.data;
      setManager(resp);
    });
  };
  const getName = () => {
    axios
      .get(
        baseUrl +
        `/ProjectMS/Audit/getProjectNamesWithCustomerId?customerId=${customerId}`
      )
      .then((response) => {
        var resp = response.data;
        resp.push({ id: "-1", name: "<<ALL>>" });
        setProject(resp);
      });
  };

  const getData = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/customersms/Customers/CustProjects_dtls`,
      data: {
        customerId: customerId,
        prjStatus: details.Status,
        ProjectName: details.ProjectName,
        ProjectManager: details.ProjectManager,
        StartDate: details.StartDate,
        EndDate: details.EndDate,
        ContractTerms: details.ContractTerms,
      },
      signal: abortController.current.signal,
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const data = response.data;

      let dataHeader = [
        {
          prj_health: "Health",
          project_code: "Project Code",
          project_name: "Project",
          contract_terms: "Contract Terms",
          business_unit: "Business Unit",
          prj_manager: "Primary Manager",
          prj_stage: "Status",
          planned_start_dt: "Planned Start",
          planned_end_dt: "Planned End",
          actual_start_dt: "Actual Start",
          actual_end_dt: "Actual End",
        },
      ];
      const sortedData = sortDataByName(data);

      let data1 = ["project_name"];
      let linkRoutes = ["/project/Overview/:project_id"];
      setLinkColumns(data1);
      setLinkColumnsRoutes(linkRoutes);
      setData(dataHeader.concat(sortedData));
      clearTimeout(loaderTime);
      setLoader(false);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };
  const getFirstData = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/customersms/Customers/CustProjects`,
      data: {
        customerId: customerId,
        prjStatus: 1,
      },
      signal: abortController.current.signal,
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const data = response.data;

      let dataHeader = [
        {
          prj_health: "Health",
          project_code: "Project Code",
          project_name: "Project",
          contract_terms: "Contract Terms",
          business_unit: "Business Unit",
          prj_manager: "Primary Manager",
          prj_stage: "Status",
          planned_start_dt: "Planned Start",
          planned_end_dt: "Planned End",
          actual_start_dt: "Actual Start",
          actual_end_dt: "Actual End",
        },
      ];
      const sortedData = sortDataByName(data);

      let data1 = ["project_name"];
      let linkRoutes = ["/project/Overview/:project_id"];
      setLinkColumns(data1);
      setLinkColumnsRoutes(linkRoutes);
      setData(dataHeader.concat(sortedData));
      clearTimeout(loaderTime);
      setLoader(false);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };
  useEffect(() => { }, [customFilterValue]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  const primaryManagerToolTip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.prj_manager}>
        {data.prj_manager}
      </div>
    );
  };
  const legends = (data) => {
    return (
      <div className="legendContainer align center">
        {data.prj_health == "Serious Issues" ? (
          <div className="legend red">
            <div className="legendCircle " title="Serious Issues"></div>
          </div>
        ) : data.prj_health == "Potential Issues" ? (
          <div className="legend amber">
            <div className="legendCircle " title="Potential Issues"></div>
          </div>
        ) : data.prj_health == null ? (
          <div className="legend black">
            <div className="legendCircle " title="Not Available"></div>
          </div>
        ) : data.prj_health == "On Schedule" ? (
          <div className="legend green">
            <div className="legendCircle " title="On Schedule"></div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };
  const prjStatusToolTip = (data) => {
    return <div title={data.prj_stage}>{data.prj_stage}</div>;
  };
  const bussinessUnitToolTip = (data) => {
    return (
      <div className="ellipsis" title={data.business_unit}>
        {data.business_unit}
      </div>
    );
  };
  const ContractTermsToolTip = (data) => {
    return <div title={data.contract_terms}>{data.contract_terms}</div>;
  };
  const projectCodetooltip = (data) => {
    return (
      <div
        className="ellipsis"
        title={data.project_code}
        style={{ width: "116px" }}
      >
        {data.project_code}
      </div>
    );
  };
  const plannnedDtAlign = (data) => {
    return (
      <div className="align center" title={data.planned_start_dt}>
        {data.planned_start_dt}
      </div>
    );
  };
  const actualStartDtAlign = (data) => {
    return (
      <div className="align center" title={data.actual_start_dt}>
        {data.actual_start_dt}
      </div>
    );
  };
  const actualEndDtAlign = (data) => {
    return (
      <div className="align center" title={data.actual_end_dt}>
        {data.actual_end_dt}
      </div>
    );
  };
  const plannnedEndDtAlign = (data) => {
    return (
      <div className="align center" title={data.planned_end_dt}>
        {data.planned_end_dt}
      </div>
    );
  };

  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          title={data.project_name}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "actual_end_dt"
            ? actualEndDtAlign
            : col == "actual_start_dt"
              ? actualStartDtAlign
              : col == "prj_stage"
                ? prjStatusToolTip
                : col == "business_unit"
                  ? bussinessUnitToolTip
                  : col == "contract_terms"
                    ? ContractTermsToolTip
                    : col == "project_code"
                      ? projectCodetooltip
                      : col == "project_name"
                        ? LinkTemplate
                        : col == "prj_manager"
                          ? primaryManagerToolTip
                          : col == "planned_end_dt"
                            ? plannnedEndDtAlign
                            : col == "planned_start_dt"
                              ? plannnedDtAlign
                              : col == "prj_health" && legends
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    let ctmFlts = {
      id: "filterTable",
      type: "select",
      data: {
        1: "Active",
        0: "All",
      },
      align: "right",
      filterTable: "",
    };
    setcustomFilters(ctmFlts);
  }, []);

  const loggedUserId = localStorage.getItem("resId");
  const [EndDt, setEndDt] = useState("");

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Planning", "Projects"];
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
    getManagerdata();
    getName();
    // getFirstData();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Financial Plan & Review"
        ),
      }));
      updatedMenuData.forEach((item) => {
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
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const [visible, setVisible] = useState(false);
  const [contract, setContract] = useState([]);

  const handleContract = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getContractTerms`,
    }).then((res) => {
      let contact = res.data;
      setContract(contact);
    });
  };
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [id]: value };
    });
  };

  useEffect(() => {
    handleContract();
  }, []);
  return (
    <div className="customer-project-screen-margin">
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <ul className="tabsContainer">
              <li>
                {/* {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )} */}
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
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
                {/* <span>Planning</span> */}
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
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
                {/* <span>Monitoring</span> */}
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
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
                {/* <span>Financials</span> */}
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
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
            <h2>Projects</h2>
          </div>
          <div className="childThree toggleBtns">
            <button
              className="searchFilterButton btn btn-primary"
              onClick={() => {
                setVisible(!visible);

                visible
                  ? setCheveronIcon(FaChevronCircleUp)
                  : setCheveronIcon(FaChevronCircleDown);
              }}
            >
              Search Filters
              <span className="serchFilterText">{cheveronIcon}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <div className="group mb-3 customCard">
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="ProjectName">
                    Project Name
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div className="autocomplete">
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={project}
                          type="Text"
                          name="ProjectName"
                          id="ProjectName"
                          className="err cancel"
                          onClear={() => {
                            setDetails((prevProps) => ({
                              ...prevProps,
                              ProjectName: -1,
                            }));
                          }}
                          placeholder="Type minimum 3 characters"
                          fuseOptions={{ keys: ["id", "name"] }}
                          resultStringKeyName="name"
                          onSelect={(e) => {
                            setDetails((prevProps) => ({
                              ...prevProps,
                              ProjectName: e.id,
                            }));
                          }}
                          showIcon={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="ProjectManager">
                    Project Manager
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div className="autocomplete">
                      <div className="autoComplete-container">
                        <ReactSearchAutocomplete
                          items={manager}
                          type="Text"
                          name="ProjectManager"
                          id="ProjectManager"
                          manager={manager}
                          className="AutoComplete"
                          onClear={() => {
                            setDetails((prevProps) => ({
                              ...prevProps,
                              ProjectManager: -1,
                            }));
                          }}
                          onSelect={(e) => {
                            setDetails((prevProps) => ({
                              ...prevProps,
                              ProjectManager: parseInt(e.id, 10) - 1,
                            }));
                          }}
                          showIcon={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="industrytype">
                    Planned Start Date
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="datepicker col-6">
                    <DatePicker
                      name="StartDate"
                      selected={StartDt}
                      id="StartDate"
                      className="err cancel"
                      dateFormat="dd-MMM-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(e) => {
                        setDetails((prev) => ({
                          ...prev,
                          ["StartDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        setStartDt(e);
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      autoComplete="false"
                    />
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="industrytype">
                    Planned End Date
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="datepicker col-6">
                    <DatePicker
                      name="EndDate"
                      id="EndDate"
                      className="err cancel"
                      selected={EndDt}
                      dateFormat="dd-MMM-yyyy"
                      showMonthDropdown
                      showYearDropdown
                      minDate={StartDt ? StartDt : undefined}
                      dropdownMode="select"
                      onChange={(e) => {
                        setDetails((prev) => ({
                          ...prev,
                          ["EndDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        setEndDt(e);
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      autoComplete="false"
                    />
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="industrytype">
                    Contract Terms
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      className="cancel"
                      name="ContractTerms"
                      id="ContractTerms"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="-1"> &lt;&lt; ALL&gt;&gt;</option>
                      {contract.map((Item, index) => (
                        <option key={index} value={Item.id}>
                          {Item.lkup_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="industrytype">
                    Project Status
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select id="Status" onChange={(e) => handleChange(e)}>
                      <option value="-1">&lt;&lt;ALL&gt;&gt;</option>
                      <option value="1">Active</option>
                      <option value="2">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={getData}
                >
                  <FaSearch />
                  Search{" "}
                </button>
              </div>
            </div>
          </CCollapse>
        </div>
      </div>

      {loader ? <Loader handleAbort={handleAbort} /> : ""}

      <ProjectsTable
        data={data}
        custProjDyMaxHeight={custProjDyMaxHeight}
        linkColumns={linkColumns}
        linkColumnsRoutes={linkColumnsRoutes}
        headerData={headerData}
        rows={25}
        setHeaderData={setHeaderData}
        dynamicColumns={dynamicColumns}
        customFilters={customFilters}
        customFilterValue={customFilterValue}
        setCustomFilterValue={setCustomFilterValue}
      />
    </div>
  );
}

export default Projects;
