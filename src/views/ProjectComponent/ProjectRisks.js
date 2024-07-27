import React, { useState, useEffect } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import {
  MdOutlinePlaylistAdd,
  MdOutlineEdit,
  MdOutlineDelete,
} from "react-icons/md";
import RiskPopup from "./RisksPopup";
import axios from "axios";
import { environment } from "../../environments/environment";
import { AiFillEdit } from "react-icons/ai";
import { CCollapse } from "@coreui/react";
import RiskAutoComplete from "./RiskAutocomplete";
import Loader from "../Loader/Loader";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "ag-grid-community";
import moment from "moment";
import { BiCheck } from "react-icons/bi";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function ProjectRisks(props) {
  const {
    projectId,
    grp4Items,
    urlState,
    btnState,
    setbtnState,
    grp1Items,
    setUrlState,
    grp2Items,
    grp3Items,
    grp6Items,
  } = props;
  const dataObject = grp4Items.find((item) => item.display_name === "Risks");
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [editmsg, setEditmsg] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [risktype, setRiskType] = useState([]);
  const [risksource, setRiskSource] = useState([]);
  const [riskimpact, setRiskImpact] = useState([]);
  const [probabilityofoccurrence, setProbabilityOfOccurrence] = useState([]);
  const [riskstatus, setRiskStatus] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filterVal, setFilterVal] = useState("");
  const [searchApi, setSearchApi] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [editedData, setEditedData] = useState([]);
  const [type, setType] = useState("add");
  const [riskDetails, setRiskDetails] = useState([]);
  const [projectRiskDetails, setProjectRiskDetails] = useState([]);
  const searchdata = {
    projectid: projectId,
    risk_type: null,
    risk_source: null,
    risk_impact: null,
    occurence_prob_id: null,
    risk_status: null,
    assigned_to: null,
    created_by_name: null,
    risk_name: null,
    is_risk_occured: null,
    last_updated: null,
    last_updated_by_id: null,
  };
  const [searching, setSearching] = useState("");
  const [userName, setUsername] = useState([]);
  const [formData, setFormData] = useState(searchdata);
  const [edit, setEdit] = useState([]);
  const [editId, setEditId] = useState();
  const [loader, setLoader] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [prjName, setPrjName] = useState([]);

  const loggedUserId = localStorage.getItem("resId");
  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate");

  //// -------breadcrumbs-----

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Risks"];
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
      console.log(sortedSubMenus);
      //   setData2(sortedSubMenus);
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
        `/CommonMS/security/authorize?url=/projectRisk/view/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  useEffect(() => {}, [projectData]);
  useEffect(() => {}, [editedData]);

  const rows = 25;
  const getRiskDetails = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getDetails`,
    })
      .then(function (response) {
        var response = response.data;
        setProjectRiskDetails(response);
      })
      .catch(function (response) {});
  };

  useEffect(() => {}, [projectRiskDetails]);
  useEffect(() => {}, [riskDetails]);

  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + "/ProjectMS/risks/getAssignedData",
    }).then(function (response) {
      var res = response.data;
      setRiskDetails(res);
    });
  };
  useEffect(() => {
    getRiskDetails();
    getRiskType();
    getRiskSource();
    getRiskImpact();
    getProbabilityOfOccurrence();
    getRiskStatus();
    getData();
    getProjectOverviewData();
    getProjectName();
  }, []);

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = () => {
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/risks/getRiskTableData`,
      data: formData,
    })
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["S_No"] = i + 1;
        }
        let dataHeaders = [
          {
            S_No: "S.No",
            risk_name: "Risk Name",
            risk_type: "Risk Type",
            risk_source: "Risk Source",
            risk_impact: "Risk Impact",
            occurence_prob_name: "Probability Of Occurrence",
            risk_value: "Risk Value ",
            assigned_to: " Assigned To",
            is_risk_occured: "Risk Occured",
            risk_status: "Risk Status",
            risk_occured_date: "Occurred Date",
            mitigation_date: "Mitigation Date",
            created_by_name: "Created By",
            Action: "Action",
          },
        ];

        let tableData = ["Action"];
        setLinkColumns(tableData);

        setTableData(dataHeaders.concat(GetData));
        setSearchApi(res.data);
        setEdit(res.data);

        setLoader(false);
        setTimeout(() => {
          setLoader(false);
        }, 100);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .then((error) => {});
  };

  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectData(resp);
      })
      .catch(function (response) {});
  };

  const getProjectName = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectName?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setPrjName(resp);
      })
      .catch(function (response) {});
  };

  const LinkTemplate = (tableData) => {
    return (
      <div align="center">
        {grp4Items[3].is_write == true ? (
          <div>
            <AiFillEdit
              title="edit"
              color="orange"
              cursor="pointer"
              type="edit"
              size="1.2em"
              onClick={() => {
                setEditedData(tableData);
                setEditId(tableData.id);
                setOpenPopup(true);
                setType("edit");
              }}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const Align = (data) => {
    return (
      <div align="center" title={data.S_No}>
        {data.S_No}
      </div>
    );
  };
  const Align2 = (data) => {
    return (
      <div align="center" title={data.risk_value}>
        {data.risk_value}
      </div>
    );
  };

  const OccuredDate = (data) => {
    return (
      <div
        align="center"
        className="ellipsis"
        title={moment(data.risk_occured_date).format("DD-MMM-yyyy")}
      >
        {" "}
        {data.risk_occured_date == null
          ? ""
          : moment(data.risk_occured_date).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const MitigationDate = (data) => {
    return (
      <div
        align="center"
        className="ellipsis"
        title={moment(data.mitigation_date).format("DD-MMM-yyyy")}
      >
        {data.mitigation_date == null
          ? ""
          : moment(data.mitigation_date).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const RiskOccured = (data) => {
    return (
      <div data-toggle="tooltip" title={data.is_risk_occured}>
        {data.is_risk_occured == true ? (
          <span title="Yes"> Yes</span>
        ) : (
          <span title="No"> No</span>
        )}
      </div>
    );
  };

  const RiskName = (data) => {
    return (
      <div data-toggle="tooltip" title={data.risk_name}>
        {data.risk_name}
      </div>
    );
  };
  const RiskType = (data) => {
    return (
      <div data-toggle="tooltip" title={data.risk_type}>
        {data.risk_type}
      </div>
    );
  };
  const RiskSource = (data) => {
    return (
      <div data-toggle="tooltip" title={data.risk_source}>
        {data.risk_source}
      </div>
    );
  };
  const RiskImpact = (data) => {
    return (
      <div data-toggle="tooltip" title={data.risk_impact}>
        {data.risk_impact}
      </div>
    );
  };
  const Occurance = (data) => {
    return (
      <div data-toggle="tooltip" title={data.occurence_prob_name}>
        {data.occurence_prob_name}
      </div>
    );
  };
  const RiskStatus = (data) => {
    return (
      <div data-toggle="tooltip" title={data.risk_status}>
        {data.risk_status}
      </div>
    );
  };
  const CreatedBy = (data) => {
    return (
      <div data-toggle="tooltip" title={data.created_by_name}>
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
          col == "Action"
            ? LinkTemplate
            : col == "S_No"
            ? Align
            : col == "risk_value"
            ? Align2
            : col == "risk_occured_date"
            ? OccuredDate
            : col == "mitigation_date"
            ? MitigationDate
            : col == "is_risk_occured"
            ? RiskOccured
            : col == "risk_name"
            ? RiskName
            : col == "risk_type"
            ? RiskType
            : col == "risk_source"
            ? RiskSource
            : col == "risk_impact"
            ? RiskImpact
            : col == "occurence_prob_name"
            ? Occurance
            : col == "risk_status"
            ? RiskStatus
            : col == "created_by_name" && CreatedBy
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    tableData[0] && setHeaderData(JSON.parse(JSON.stringify(tableData[0])));
  }, [tableData]);

  const getRiskType = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getRiskType`,
    }).then((res) => {
      var risktype = res.data;
      setRiskType(risktype);
    });
  };

  const getRiskSource = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getRiskSource`,
    }).then((res) => {
      var risksource = res.data;
      setRiskSource(risksource);
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

  const getProbabilityOfOccurrence = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getProbabilityOfOccurrence`,
    }).then((res) => {
      var probabilityofoccurrence = res.data;
      setProbabilityOfOccurrence(probabilityofoccurrence);
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value == "null" ? null : value }));
  };

  const handleClick = () => {
    getTableData();
  };
  const handleClear = () => {
    setFormData((prev) => ({ ...prev, assigned_to: null }));
  };

  return (
    <>
      <div>
        {addmsg ? (
          <div className="statusMsg success">
            <BiCheck />
            {"Risk added Successfully"}
          </div>
        ) : (
          ""
        )}
        {editmsg ? (
          <div className="statusMsg success">
            <BiCheck />
            {"Risk edited Successfully"}
          </div>
        ) : (
          ""
        )}
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

        <div className=" col-mid-12 customCard">
          <CCollapse visible={!visible}>
            <div className="group-content row ">
              <div className=" col-md-3 ">
                <div className="form-group row" id="risk_type">
                  <label className="col-5">Risk Type</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="risk_type"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      {risktype.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className=" col-md-3  " id="risk_source">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Type-select">
                    Risk Source
                  </label>
                  <label className="col-1 p-0 ">:</label>
                  <label className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="risk_source"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      {risksource.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="col-md-3  " id="risk_impact">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Type-select">
                    Risk Impact
                  </label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="risk_impact"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      {riskimpact.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group row mb-2" id="occurence_prob_id">
                  <label className="col-5">Probability Of Occurrence</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="occurence_prob_id"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      {probabilityofoccurrence.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="col-md-3 " id="risk_name">
                <div className="form-group row mb-2">
                  <label className="col-5">Risk Name</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <input
                      type="Text"
                      name="Risk Name To"
                      id="risk_name"
                      onChange={(e) => {
                        const { id, value } = e.target;
                        setFormData((prev) => ({
                          ...prev,
                          ["risk_name"]: value == "" ? null : value,
                        }));
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="col-md-3 " id="is_risk_occured">
                <div className="form-group row">
                  <label className="col-5">Risk Occurred</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="is_risk_occured"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      <option value="1" id="1">
                        {" "}
                        Yes{" "}
                      </option>
                      <option value="0" id="0">
                        {" "}
                        No{" "}
                      </option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="col-md-3 " id="risk_status">
                <div className="form-group row">
                  <label className="col-5">Risk Status</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6">
                    <select
                      class="col-md-12 p0"
                      id="risk_status"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                      {riskstatus.map((Item) => (
                        <option value={Item.id}> {Item.lkup_name}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row" id="assigned_to">
                  <label className="col-5 form-label">Assigned To</label>
                  <label className="col-1 p-0">:</label>
                  <div className="col-6">
                    <div className="autoComplete-container">
                      <RiskAutoComplete
                        id="assigned_to"
                        name="assigned_to"
                        riskDetails={riskDetails}
                        setUsername={setUsername}
                        getData={getData}
                        setFormData={setFormData}
                        onChange={(e) => {
                          const { id, value } = e.target;
                          setFormData((prev) => ({
                            ...prev,
                            ["assigned_to"]: id == "" ? null : id,
                          }));
                        }}
                        editedData={editedData}
                        onClear={handleClear}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3 " id="created_by_name">
                <div className="form-group row">
                  <label className="col-5">Created By</label>
                  <label className="col-1 p-0">:</label>
                  <label className="col-6 ">
                    <input
                      type="Text"
                      name="created_by_name"
                      id="created_by_name"
                      onChange={(e) => {
                        const { id, value } = e.target;
                        setFormData((prev) => ({
                          ...prev,
                          ["created_by_name"]: value == "" ? null : value,
                        }));
                      }}
                    />
                  </label>
                </div>
              </div>

              <div class="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
                <button
                  type="button"
                  className="btn btn-primary"
                  value={searching}
                  onClick={() => handleClick()}
                >
                  <FaSearch /> Search{" "}
                </button>{" "}
              </div>
            </div>
          </CCollapse>
          {loader ? <Loader /> : ""}
        </div>
        <div className="body col-xs-12 col-sm-12 col-md-12 col-lg-12 customCard">
          <div className="">
            <div class="col-md-12 no-padding">
              <CellRendererPrimeReactDataTable
                projectRsikMaxHeight={maxHeight1}
                CustomersFileName="ProjectRisk"
                data={tableData}
                linkColumns={linkColumns}
                linkColumnsRoutes={linkColumnsRoutes}
                dynamicColumns={dynamicColumns}
                headerData={headerData}
                setHeaderData={setHeaderData}
                rows={rows}
              />
              {dataObject?.is_write == true ? (
                <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setOpenPopup(true);
                      setType("add");
                    }}
                  >
                    <FaPlus />
                    Add
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          {openPopup ? (
            <RiskPopup
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              projectRiskDetails={projectRiskDetails}
              type={type}
              getTableData={getTableData}
              editId={editId}
              addmsg={addmsg}
              setAddmsg={setAddmsg}
              editmsg={editmsg}
              setEditmsg={setEditmsg}
              setEditedData={setEditedData}
              editedData={editedData}
              projectId={projectId}
              tableData={tableData}
              projectData={projectData}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectRisks;
