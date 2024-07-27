import React, { useRef } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import moment from "moment";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight"; 
// import Utils from "../../Utils.js";

function CustomerRisks(props) {
  const {
    customerId,
    setUrlState,
    setButtonState,
    buttonState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
    projectId,
  } = props;
  const [data, setData] = useState([{}]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [risktype, setRiskType] = useState([]);
  const [riskDetails, setRiskDetails] = useState([]);
  const [riskimpact, setRiskImpact] = useState([]);
  const [project, setProject] = useState([]);
  const [riskstatus, setRiskStatus] = useState([]);
  const [probabilityofoccurrence, setProbabilityOfOccurrence] = useState([]);

  const searchdata = {
    customerId: customerId,
    prjId: -1,
    prjStatusId: -1,
    riskImpactId: -1,
    riskType: -1,
    occuranceProbId: -1,
    riskStatusId: -1,
    assignedId: -1,
    viewBy: -1,
  };

  const [formData, setFormData] = useState(searchdata);
  const materialTableElement = document.getElementsByClassName(
    "childTwo"
  );

  const custRiskDyMaxHeight =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;

    console.log(custRiskDyMaxHeight, "maxHeight1");

  const baseUrl = environment.baseUrl;
  let rows = 25;
  const [searching, setsearching] = useState(false);
  const abortController = useRef(null);

  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [username, setUsername] = useState("");

  const loggedUserId = localStorage.getItem("resId");

  const getRiskType = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getRiskType`,
    }).then((res) => {
      var risktype = res.data;
      setRiskType(risktype);
    });
  };

  const getAssignedData = () => {
    axios({
      method: "get",
      url: baseUrl + "/ProjectMS/risks/getAssignedData",
    }).then(function (response) {
      var res = response.data;
      setRiskDetails(res);
    });
  };

  const getRiskImpact = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getRiskImpact`,
    }).then((res) => {
      var riskimpact = res.data;
      setRiskImpact(riskimpact);
    });
  };
  const getProjects = () => {
    axios
      .get(
        baseUrl +
          `/ProjectMS/Audit/getProjectNamesWithCustomerId?customerId=${customerId}`
      )
      .then(function (response) {
        var resp = response.data;
        setProject(resp);
      });
  };

  const getRiskStatus = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getRiskStatus`,
    }).then((res) => {
      var riskstatus = res.data;
      setRiskStatus(riskstatus);
    });
  };

  const getProbabilityOfOccurrence = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getProbabilityOfOccurrence`,
    }).then((res) => {
      var probabilityofoccurrence = res.data;
      setProbabilityOfOccurrence(probabilityofoccurrence);
    });
  };

  useEffect(() => {}, [riskDetails]);

  useEffect(() => {
    getRiskType();
    getAssignedData();
    getRiskImpact();
    getProjects();
    getRiskStatus();
    getProbabilityOfOccurrence();
  }, []);

  const handleClear = () => {
    setFormData((prev) => ({ ...prev, assignedId: -1 }));
  };
  const handleClear1 = () => {
    setFormData((prev) => ({ ...prev, prjId: -1 }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value == "null" ? null : value }));
  };

  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          data-toggle="tooltip"
          title={data.project_code}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };
  const Align = (data) => {
    return (
      <div
        align="right"
        className="ellipsis"
        data-toggle="tooltip"
        title={data.risk_value}
      >
        {data.risk_value}
      </div>
    );
  };

  const alignSno = (data) => {
    return <div align="center">{data.sno}</div>;
  };

  const Toggletooltip = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.risk_name}>
        {data.risk_name}
      </div>
    );
  };
  const probability_of_occurrence = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.probability_of_occurrence}
      >
        {data.probability_of_occurrence}
      </div>
    );
  };
  const risk_type = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.risk_type}>
        {data.risk_type}
      </div>
    );
  };
  const risk_source = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.risk_source}>
        {data.risk_source}
      </div>
    );
  };
  const risk_impact = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.risk_impact}>
        {data.risk_impact}
      </div>
    );
  };
  const AssignedTo = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.AssignedTo}>
        {data.AssignedTo}
      </div>
    );
  };
  const risk_occurred = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.risk_occurred}
      >
        {data.risk_occurred}
      </div>
    );
  };
  const risk_status = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.risk_status}>
        {data.risk_status}
      </div>
    );
  };
  const risk_occured_date = (data) => {
    return (
      <div
        align="center"
        className="ellipsis"
        data-toggle="tooltip"
        title={data.risk_occured_date || "NA"}
      >
        {data.risk_occured_date || "NA"}
      </div>
    );
  };
  const mitigation_date = (data) => {
    return (
      <div
        align="center"
        className="ellipsis"
        data-toggle="tooltip"
        title={data.mitigation_date || "NA"}
      >
        {data.mitigation_date || "NA"}
      </div>
    );
  };
  const created_by_name = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.created_by_name}
      >
        {data.created_by_name}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "project_code"
            ? LinkTemplate
            : col == "risk_value"
            ? Align
            : col == "risk_name"
            ? Toggletooltip
            : col == "sno"
            ? alignSno
            : col == "risk_type"
            ? risk_type
            : col == "risk_source"
            ? risk_source
            : col == "risk_impact"
            ? risk_impact
            : col == "AssignedTo"
            ? AssignedTo
            : col == "risk_occurred"
            ? risk_occurred
            : col == "risk_status"
            ? risk_status
            : col == "risk_occured_date"
            ? risk_occured_date
            : col == "mitigation_date"
            ? mitigation_date
            : col == "created_by_name"
            ? created_by_name
            : col == "probability_of_occurrence" && probability_of_occurrence
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  const getData = () => {
    setsearching(false);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Audit/getCutomersRiskData`,
      data: formData,
      signal: abortController.current.signal,
    }).then((res) => {
      const GetData = res.data;
      let dataHeader = [
        {
          sno: "S.No",
          project_code: "Project Name / Project Code",
          risk_name: "Risk Name",
          risk_type: "Risk Type",
          risk_source: "Risk Source",
          risk_impact: "Risk Impact",
          probability_of_occurrence: "Probability of Occurrence",
          risk_value: "Risk Value",
          AssignedTo: "Assigned To",
          risk_occurred: "Risk Occurred",
          risk_status: "Risk Status",
          risk_occured_date: "Occurred Date",
          mitigation_date: "Mitigation Date",
          created_by_name: "Created By",
        },
      ];

      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["risk_occurred"] =
          GetData[i]["risk_occurred"] == true ? "Yes" : "No";
        GetData[i]["risk_occured_date"] =
          GetData[i]["risk_occured_date"] == null
            ? ""
            : moment(GetData[i]["risk_occured_date"]).format("DD-MMM-yyyy");
        GetData[i]["sno"] = i + 1;
        GetData[i]["mitigation_date"] =
          GetData[i]["mitigation_date"] == null
            ? ""
            : moment(GetData[i]["mitigation_date"]).format("DD-MMM-yyyy");
      }

      let data = ["project_code"];
      let linkRoutes = ["../project/Overview/:project_id"];
      setLinkColumns(data);
      setLinkColumnsRoutes(linkRoutes);

      let fData = [...dataHeader, ...GetData];
      setData(fData);
      setsearching(false);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Monitoring", "Risks"];
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
        `/CommonMS/security/authorize?url=/customer/customerRisks/&userId=${loggedUserId}`,
    }).then((res) => {});
  };
  return (
    <div className="monitor-risks-screen-margin">
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
            <h2>Risks</h2>
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
      <div className="group customCard">
        <div className="col-md-12 collapseHeader"></div>
        <div className="group mb-2 customCard">
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="email-input">
                    Project Name&nbsp;
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div className="autoComplete-container react  reactsearchautocomplete">
                      <ReactSearchAutocomplete
                        items={project}
                        type="Text"
                        name="prjId"
                        id="prjId"
                        className="error AutoComplete"
                        onSelect={(e) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            prjId: e.id,
                          }));
                        }}
                        showIcon={false}
                        onClear={handleClear1}
                        placeholder="Type minimum 3 characters"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="prjStatusId">
                    Project Status
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      className="text cancel"
                      name="prjStatusId"
                      id="prjStatusId"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value={-1}> &lt;&lt;ALL&gt;&gt;</option>
                      <option value={1}>Active</option>
                      <option value={2}>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="riskImpactId">
                    Risk Impact
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="riskImpactId"
                      name="riskImpactId"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value={-1}> &lt;&lt;ALL&gt;&gt;</option>
                      {riskimpact.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row" id="riskType">
                  <label className="col-5">Risk Type</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="riskType"
                      name="riskType"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value={-1}> &lt;&lt;ALL&gt;&gt;</option>
                      {risktype.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row mb-2" id="occuranceProbId">
                  <label className="col-6">Probability Of Occurrence :</label>
                  {/* <label className="col-1 p-0">:</label> */}
                  <label className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="occuranceProbId"
                      name="occuranceProbId"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value={-1}> &lt;&lt;ALL&gt;&gt;</option>
                      {probabilityofoccurrence.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">Risk Status</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="riskStatusId"
                      name="riskStatusId"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value={-1}> &lt;&lt;ALL&gt;&gt;</option>
                      {riskstatus.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row" id="assignedId">
                  <label className="col-5 form-label">Assigned To</label>
                  <label className="col-1 p-0">:</label>
                  <div className="col-6">
                    <div className="autoComplete-container">
                      <RiskAutoComplete
                        id="assignedId"
                        name="assignedId"
                        riskDetails={riskDetails}
                        getData={getAssignedData}
                        setFormData={setFormData}
                        onChange={(e) => {
                          const { id, value } = e.target;
                          setFormData((prev) => ({
                            ...prev,
                            ["assignedId"]: id == "" ? null : id,
                          }));
                        }}
                        setUsername={setUsername}
                        onClear={handleClear}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="viewBy">
                    View By
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      className="text cancel"
                      name="viewBy"
                      id="viewBy"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value={-1}> &lt;&lt;ALL&gt;&gt;</option>
                      <option value={1}>Active</option>
                      <option value={2}>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2 ">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => {
                    getData();
                  }}
                >
                  <FaSearch />
                  Search{" "}
                </button>
              </div>
            </div>
          </CCollapse>
        </div>
      </div>

      {searching ? <Loader handleAbort={handleAbort} /> : ""}

      <CellRendererPrimeReactDataTable
        CustomersFileName = "customerRisks"
        custRiskDyMaxHeight = {custRiskDyMaxHeight}
        data={data}
        rows={rows}
        linkColumns={linkColumns}
        linkColumnsRoutes={linkColumnsRoutes}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
      />
    </div>
  );
}

export default CustomerRisks;
