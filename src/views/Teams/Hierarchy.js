import React, { useEffect, useRef } from "react";
import "../../App.scss";
import HierarchyTable from "./HierarchyTable";
import { useState } from "react";
import { CCollapse } from "@coreui/react";
import Loader from "../Loader/Loader";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
  FaCheck,
  FaPlus,
  FaSave,
  FaTree,
  FaSitemap,
} from "react-icons/fa";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import TeamsProjectHierarchyTree from "./TeamsProjectHierarchyTree";
import ProjectHierarchy from "./TeamsProjectHierarchy";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { environment } from "../../environments/environment";
import MarginAnalysisHierarchy from "../RevenueMetrices/MarginAnalysisHierarchy";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import CSL from "../../assets/images/TeamsHierarImg/CSL.png";
import CSLHead from "../../assets/images/TeamsHierarImg/CSLHead.png";
import DP from "../../assets/images/TeamsHierarImg/DP.png";
import AW from "../../assets/images/TeamsHierarImg/AW.png";
import { AiFillWarning } from "react-icons/ai";
import AE from "../../assets/images/TeamsHierarImg/AE.png";
import ACSL from "../../assets/images/TeamsHierarImg/ACSL.png";
import DPHead from "../../assets/images/TeamsHierarImg/DPHead.png";
import TP from "../../assets/images/TeamsHierarImg/TP.png";
import PC from "../../assets/images/TeamsHierarImg/PC.png";
import SQA from "../../assets/images/TeamsHierarImg/SQA.png";
import AccountHierarTable from "./AccountHierarTable";
import AdminHierarchy from "./AdminHierarchy";
import "./TeamsHierarchyTable.scss";
import TeamsProjectHierarchy from "./TeamsProjectHierarchy";

function Hierarchy() {
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [loader, setLoader] = useState(false);
  const [searching, setSearching] = useState(false);
  const HelpPDFName = "Hierarchies.pdf";
  const Header = "Hierarchy Help";
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const resourceId = parseInt(loggedUserId) + 1;
  const [routes, setRoutes] = useState([]);
  let textContent = "Teams";
  let currentScreenName = ["Stakeholder Mapping"];
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
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/executive/hierarchy";
      getUrlPath(modifiedUrlPath);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Profile") {
            return {
              ...submenu,
              display_name: "Insights",
            };
          }

          return submenu;
        }),
      }));
      updatedMenuData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  const getUrlPath = (modifiedUrlPath) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };

  const ref = useRef([]);
  const [viewBy, setViewBy] = useState("csl");
  const [selectedType, setSelectedType] = useState("csl");
  const [projectHierarchy, setProjectHierarchy] = useState([]);
  const [data, setData] = useState([]);
  const [accountHieFirstTable, setAccountHieFirstTable] = useState([]);

  const [accountHierarchy, setAccountHierarchy] = useState([]);
  const [dpList, setDpList] = useState([]);
  const [selectedDpList, setSelectedDpList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [selectedcustomerList, setSelectedCustomerList] = useState([]);
  const [acchieCustlist, setAcchieCustlist] = useState([]);
  const [selectedacchieCustlist, setSelectedacchieCustlist] = useState([]);
  const [proHieCust, setProHieCust] = useState([]);
  const [selectedproHieCust, setSelectedproHieCust] = useState([]);
  const [cslList, setCslList] = useState([]);
  const [selectedCslList, setSelectedCslList] = useState([]);
  const [activeProjectsByCustomer, setActiveProjectsByCustomer] = useState([]);
  const [showcslproject, setShowcslproject] = useState(false);
  const [showacchieDataTable, setShowacchieDataTable] = useState(false);
  const [state, setState] = useState("All");
  const [stateAcctHierarchy, setStateAcctHierarchy] = useState("All");
  const [hierarchydata, setHierarchyData] = useState([]);
  const [hierarchyCount, setHierarchyCount] = useState(0);
  const [searchinghierarchy, setSearchingHierarchy] = useState(false);
  const [tableVisibility, setTableVisibility] = useState(false);
  const [visi, setVisi] = useState(false);

  const initialValue = {
    viewBy: "",
    csl: -1,
    dp: -1,
    prj: "",
    acct: -1,
  };
  const [formData, setFormData] = useState(initialValue);
  const abortController = useRef(null);
  useEffect(() => {}, [hierarchydata]);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  {
    /*-------------------------Getting Csl List----------------------f---*/
  }
  const getCustomerCSLList = async () => {
    const resp = await axios({
      url: baseUrl + `/teamms/Hierarchy/getCustomerCSLList`,
    });
    let terms = [];
    let data = resp.data;
    data.length > 0 &&
      data.forEach((e) => {
        let termsObj = {
          label: e.PersonName,
          value: e.id,
        };
        terms.push(termsObj);
        setCslList(terms);
        setSelectedCslList(terms);
      });
  };

  {
    /*-------------------------Getting Delivery Partner List-------------------------*/
  }
  const getCustomerDelParatnerList = async () => {
    const resp = await axios({
      url:
        baseUrl +
        `/revenuemetricsms/RevenueMarginAnalysis/getCustomerDelParatnerList`,
    });
    let terms = [];
    let data = resp.data;
    data.length > 0 &&
      data.forEach((e) => {
        let termsObj = {
          label: e.PersonName,
          value: e.id,
        };
        terms.push(termsObj);
        setDpList(terms);
        setSelectedDpList(terms);
      });
  };
  {
    /*-------------------------Getting Customer List-------------------------*/
  }
  const getCustomerList = async () => {
    const resp = await axios({
      url: baseUrl + `/teamms/Hierarchy/customersList`,
    });
    let terms = [];
    let data = resp.data;
    data.length > 0 &&
      data.forEach((e) => {
        let termsObj = {
          label: e.full_name,
          value: e.id,
        };
        terms.push(termsObj);
        setCustomerList(terms);
        setSelectedCustomerList(terms);
      });
  };

  const getaccHierarchyCustlist = async () => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
    const resp = await axios({
      // url: baseUrl + `/teamms/Hierarchy/accHierarchyCustlist`,
      url: baseUrl + `/teamms/Hierarchy/accHierarchyCustlist`,
    });
    let terms1 = [];
    let data = resp.data;
    data.length > 0 &&
      data.forEach((e) => {
        let termsObj1 = {
          label: e.name,
          value: e.id,
        };
        terms1.push(termsObj1);
        setAcchieCustlist(terms1);
        setSelectedacchieCustlist(terms1);
      });
  };

  const getCustomerByDPList = async () => {
    const resp = await axios({
      url:
        // baseUrl + `/teamms/Hierarchy/customerByDPList?dps=-1&res=${resourceId}`,
        baseUrl + `/teamms/Hierarchy/customerByDPList?dps=-1&res=${resourceId}`,
    });
    let terms = [];
    let data = resp.data;
    data.length > 0 &&
      data.forEach((e) => {
        let termsObj = {
          label: e.name,
          value: e.id,
        };
        terms.push(termsObj);
        setProHieCust(terms);
        setSelectedproHieCust(terms);
      });
  };

  const [searchProjecthierarchy, setSearchProjectHierarchy] = useState(false);
  const selectedValues = selectedproHieCust.map((item) => item.value).join(",");

  const getProjectHierarchy = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    axios({
      method: "post",
      url: baseUrl + `/teamms/Hierarchy/getProjectHierarchy`,

      data: {
        viewBy: viewBy,
        dplList: formData?.dp,
        customer: selectedValues,
        UserId: resourceId,
      },
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      const data = res.data;
      setProjectHierarchy(data);
      setSearchProjectHierarchy(true);
      clearTimeout(loaderTime);
      setLoader(false);
      setVisible(!visible);
      setVisi(false);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };
  // CSL Hierarchy --click for project---for project display
  const getPartnerAccountHierarchy = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    axios({
      method: "post",
      // url: baseUrl + `/teamms/Hierarchy/getPartnerAccountHierarchy`,
      url: baseUrl + `/teamms/Hierarchy/getPartnerAccountHierarchy`,

      data: {
        viewBy: viewBy,
        cslList: formData.csl,
      },
      headers: { "Content-Type": "application/json" },
    }).then((resp) => {
      const getData = resp.data;
      setData(getData);
      setSearching(true);
      clearTimeout(loaderTime);
      // setLoader(false);
      setVisible(!visible);
      setVisi(false);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };
  ///dp List
  const getPartnerAccountHierarchyDp = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    axios({
      method: "post",
      // url: baseUrl + `/teamms/Hierarchy/getPartnerAccountHierarchy`,
      url: baseUrl + `/teamms/Hierarchy/getPartnerAccountHierarchy`,

      data: {
        viewBy: viewBy,
        dpList: formData.dp,
      },
      headers: { "Content-Type": "application/json" },
    }).then((resp) => {
      const getData = resp.data;
      setData(getData);
      setSearching(true);
      clearTimeout(loaderTime);
      // setLoader(false);
      setVisible(!visible);
      setVisi(false);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };

  useEffect(() => {}, [data]);
  if (data.tableData && data.tableData.length > 0) {
    const keys = Object.keys(data.tableData[0]);
    data.columns = "'partner_name,account,role'";
  }
  const [showacchieTable, setShowacchieTable] = useState(false);
  const getAccountHierarchy = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    axios({
      method: "post",
      url: baseUrl + `/teamms/Hierarchy/getAccountHierarchy`,

      data: {
        viewBy: viewBy,
        dplList: formData.dp,
        customer: formData.acct,
      },
      headers: { "Content-Type": "application/json" },
    }).then((resp) => {
      const getData = resp.data;
      setData(getData);
      setShowacchieTable(true);
      clearTimeout(loaderTime);
      setLoader(false);
      setVisible(!visible);
      setVisi(false);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };
  const [nodeClicked, setNodeClicked] = useState("");
  const handleNodeClicked = (value) => {
    setNodeClicked(value);
  };
  const [searchAdminHierarchy, setSearchAdminHierarchy] = useState(false);
  const [projectNameSuggest, setProjectNameSuggest] = useState(
    data?.tableData?.[2]?.account || ""
  );

  useEffect(() => {
    setProjectNameSuggest(data?.tableData?.[2]?.account || "");
  }, [data]);

  const [warnMsg, setWarnMsg] = useState("");

  const handleSearch = () => {
    setVisi(true);

    setTableVisibility(true);
    let valid = GlobalValidation(ref);

    if (valid) {
      setWarnMsg(
        <div className="col-md-12 statusMsg error">
          <AiFillWarning />
          <span>Please select valid values for highlighted fields</span>
        </div>
      );
      setShowcslproject(false);
      setSearching(false);
      setShowprojectHie(false);
      setShowacctHieTable(false);
      setSearchProjectHierarchy(false);
      setSearchingHierarchy(false);
      setShowcslHieTable(false);
      setShowacchieTable(false);
      setShowacchieDataTable(false);

      return;
    }
    setState("All");
    setWarnMsg("");
    if (selectedType == "csl") {
      setSearchingHierarchy(false);
      setShowcslHieTable(false);
      setShowprojectHie(false);
      setShowacchieTable(false);
      setShowacchieDataTable(false);
      setSearchAdminHierarchy(false);
      getPartnerAccountHierarchy();
    } else if (selectedType == "dp") {
      getPartnerAccountHierarchyDp();
      setSearchingHierarchy(false);
      setShowcslHieTable(false);
      setShowprojectHie(false);

      setShowacchieTable(false);
      setShowacchieDataTable(false);
      setSearchAdminHierarchy(false);
    } else if (selectedType == "prj") {
      getProjectHierarchy();
      setSearchingHierarchy(false);
      setSearchAdminHierarchy(false);
      setShowacchieTable(false);
      setShowcslHieTable(false);
      setShowacchieDataTable(false);
    } else if (selectedType == "acct") {
      getAccountHierarchy();
      setSearchingHierarchy(false);
      setSearchAdminHierarchy(false);
      setShowcslHieTable(false);
      setShowprojectHie(false);
    } else if (selectedType == "admin") {
      setSearchAdminHierarchy(true);
      setSearchingHierarchy(false);
      setShowacchieTable(false);
      setShowacchieDataTable(false);
      setShowcslHieTable(false);
      setShowprojectHie(false);
    }
    setShowcslproject(false);
    setSearching(false);
    setShowprojectHie(false);
    setShowacctHieTable(false);
    setSearchProjectHierarchy(false);
    setShowacchieTable(false);
    setShowacchieDataTable(false);
  };
  useEffect(() => {
    // delivery partner list dropdown
    getCustomerDelParatnerList();
    // csl list dropdown
    getCustomerCSLList();
    // project hierarchy customer list
    getCustomerByDPList();
    // Account hierarchy customer list
    getaccHierarchyCustlist();
  }, []);
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  // Project Hierarchy All and Active
  const [projectId, setProjectId] = useState([]);
  const [showprojectHie, setShowprojectHie] = useState(false);
  const [showacctHieTable, setShowacctHieTable] = useState(false);
  const [showcslHieTable, setShowcslHieTable] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [projRolesTreeId, setProjRolesTreeId] = useState(null);
  const getPrjRolesTree = (id) => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    axios({
      method: "post",
      url: baseUrl + `/teamms/Hierarchy/prjRolesTree`,

      data: {
        typ: "roles",
        prjId: id,
        dat: "0000-00-00",
        status: state,
      },
      headers: { "Content-Type": "application/json" },
    }).then((resp) => {
      const getData = resp.data;
      for (const project of getData) {
        if (project.id === "-1" && project.parent === "#") {
          const cleanedText = project.text.replace(/<\/?[^>]+(>|$)/g, "");
          project.text = cleanedText;
        }
      }

      setProjRolesTreeId(id);
      setHierarchyData(getData);
      setTimeout(() => {
        document.body.click();
      }, 20);
      setHierarchyCount((prev) => prev + 1);
      setSearchingHierarchy(true);
      setShowcslHieTable(true);
      clearTimeout(loaderTime);
      setLoader(false);
      setVisibility(true);
    });
  };

  useEffect(() => {
    if (projRolesTreeId != null) getPrjRolesTree(projRolesTreeId);
  }, [state, projRolesTreeId]);

  useEffect(() => {
    if (
      Array.isArray(activeProjectsByCustomer) &&
      activeProjectsByCustomer.length > 0
    ) {
      setShowcslHieTable(true);
      getPrjRolesTree(activeProjectsByCustomer[0].id);
    }
  }, [activeProjectsByCustomer]);

  const [hieprojectId, setHieProjectId] = useState(projRolesTreeId);

  const getPrjRolesTreAccHie = (id, value) => {
    const result =
      id === undefined
        ? hieprojectId
        : hieprojectId === null || id === null
        ? projRolesTreeId
        : id;

    // Use the 'result' variable where needed.

    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    axios({
      method: "post",
      url: baseUrl + `/teamms/Hierarchy/prjRolesTree`,

      data: {
        typ: "roles",
        prjId: result,
        dat: "0000-00-00",
        status: value == undefined ? stateAcctHierarchy : value,
      },
      headers: { "Content-Type": "application/json" },
    }).then((resp) => {
      const getData = resp.data;
      for (const project of getData) {
        if (project.id === "-1" && project.parent === "#") {
          const cleanedText = project.text.replace(/<\/?[^>]+(>|$)/g, "");
          project.text = cleanedText;
        }
      }
      setHierarchyData(getData);
      setTimeout(() => {
        document.body.click();
      }, 20);
      setHierarchyCount((prev) => prev + 1);
      setSearchingHierarchy(true);
      setShowacctHieTable(true);
      clearTimeout(loaderTime);
      setLoader(false);
    });
  };
  const projectLinks = (rowData) => {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          title={rowData.label}
          to={`/project/Overview/:${rowData.id}`}
          target="_blank"
          className="ellipsis"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flexGrow: 1,
            width: "90%",
          }}
        >
          {rowData.label}
        </Link>

        <FaSitemap
          title="Project Hierarchy"
          style={{
            cursor: "pointer",
          }}
          onClick={(e) => {
            getPrjRolesTreAccHie(rowData.id);
            setHieProjectId(rowData.id);
          }}
        />
      </div>
    );
  };

  const projectLinksCsl = (rowData) => {
    useEffect(() => {}, [rowData.id]);

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          title={rowData.label}
          to={`/project/Overview/:${rowData.id}`}
          target="_blank"
          className="ellipsis"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flexGrow: 1,
            width: "90%",
          }}
        >
          {rowData.label}
        </Link>
        <FaSitemap
          style={{
            cursor: "pointer",
          }}
          onClick={(e) => {
            getPrjRolesTree(rowData.id);
            setProjectId(rowData?.id);
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    getPrjRolesTree();
  }, [projectId, state]);

  useEffect(() => {
    setTableVisibility(false);
    // setState("All");
  }, [viewBy]);
  return (
    <div>
      {warnMsg}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Stakeholder Mapping</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={Header} />
          </div>
        </div>
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="Date">
                  View By <span className="error-text">&nbsp;&nbsp;*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    id="viewby-select"
                    onChange={(e) => {
                      setViewBy(e.target.value);
                      setSelectedType(e.target.value);
                    }}
                  >
                    <option value="csl">CSL Hierarchy</option>
                    <option value="dp">DP Hierarchy</option>
                    <option value="prj">Project Hierarchy</option>
                    <option value="acct">Account Hierarchy</option>
                    <option value="admin">Admin Hierarchy</option>
                  </select>
                </div>
              </div>
            </div>
            {selectedType == "csl" ? (
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="Date">
                    CSL<span style={{ color: "red" }}>*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <div
                      className=" multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        id="csl"
                        ArrowRenderer={ArrowRenderer}
                        options={cslList}
                        hasSelectAll={true}
                        isLoading={false}
                        selected={selectedCslList}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedCslList}
                        disabled={false}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return <>&lt;&lt;Please Select&gt;&gt;</>;
                          } else if (selected.length === cslList.length) {
                            return <>&lt;&lt;ALL&gt;&gt;</>;
                          }
                        }}
                        onChange={(s) => {
                          setSelectedCslList(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["csl"]: filteredValues.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedType == "dp" ? (
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="Date">
                    Delivery Partner <span style={{ color: "red" }}>*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <div
                      className=" multiselect"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        id="dp"
                        options={dpList}
                        ArrowRenderer={ArrowRenderer}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedDpList}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedDpList(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["dp"]: filteredValues.toString(),
                          }));
                        }}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return <>&lt;&lt;Please Select&gt;&gt;</>;
                          } else if (selected.length === dpList.length) {
                            return <>&lt;&lt;ALL&gt;&gt;</>;
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedType == "prj" ? (
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="Date">
                    Customer <span style={{ color: "red" }}>*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <div
                      className=" multiselect"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <MultiSelect
                        id="prj"
                        options={proHieCust}
                        ArrowRenderer={ArrowRenderer}
                        hasSelectAll={true}
                        isLoading={false}
                        selected={selectedproHieCust}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedproHieCust}
                        disabled={false}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return <>&lt;&lt;Select&gt;&gt;</>;
                          } else {
                            return `${selected.length} selected`;
                          }
                        }}
                        onChange={(s) => {
                          setSelectedproHieCust(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["prj"]: filteredValues.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedType == "acct" ? (
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="Date">
                    Customer<span style={{ color: "red" }}>*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <div
                      className=" multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        id="acct"
                        options={acchieCustlist}
                        ArrowRenderer={ArrowRenderer}
                        hasSelectAll={true}
                        isLoading={false}
                        selected={selectedacchieCustlist}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedacchieCustlist}
                        disabled={false}
                        valueRenderer={(selected) => {
                          if (selected.length === 0) {
                            return <>&lt;&lt;Select&gt;&gt;</>;
                          } else {
                            return `${selected.length} selected`;
                          }
                        }}
                        onChange={(e) => {
                          setSelectedacchieCustlist(e);
                          let filteredCustomer = [];
                          e.forEach((d) => {
                            filteredCustomer.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["acct"]: filteredCustomer.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn-container center my-1">
            <button className="btn btn-primary" onClick={handleSearch}>
              <FaSearch />
              Search
            </button>
          </div>
        </CCollapse>
        {loader ? <Loader handleAbort={handleAbort} /> : ""}
      </div>
      {tableVisibility && visibility && (
        <>
          {/*  CSL Project show and Dp  */}

          <div className="col-md-12">
            <div className="row">
              {searching ? (
                <>
                  <div className="roleTableLegends">
                    <span title="Customer Successful Lead Head">
                      <img src={CSLHead} />
                      CSL Head
                    </span>
                    <span title="Customer Successful Lead">
                      <img src={CSL} />
                      CSL
                    </span>
                    <span title="Associate Customer Successful Lead">
                      <img src={ACSL} />
                      ACSL
                    </span>
                    <span title="Delivery Partner Head">
                      <img src={DPHead} />
                      DP Head
                    </span>
                    <span title="Delivery Partner">
                      <img src={DP} />
                      DP
                    </span>
                    <span title="Talent Partner">
                      <img src={TP} />
                      TP
                    </span>
                    <span title="Project Coordinator">
                      <img src={PC} />
                      PC
                    </span>
                    <span title="Software Quality Assurance">
                      <img src={SQA} />
                      SQA
                    </span>
                    <span title="Account Executive">
                      <img src={AE} />
                      AE
                    </span>
                    <span title="Account Owner">
                      <img src={AW} />
                      AW
                    </span>
                  </div>
                  <div style={{ maxWidth: "45%" }}>
                    <HierarchyTable
                      data={data}
                      setActiveProjectsByCustomer={setActiveProjectsByCustomer}
                      // setShowacchieDataTable={setShowacchieDataTable}
                      setShowcslproject={setShowcslproject}
                      activeProjectsByCustomer={activeProjectsByCustomer}
                      expandedCols={[]}
                      setShowcslHieTable={setShowcslHieTable}
                      colExpandState={[]}
                      setProjectNameSuggest={setProjectNameSuggest}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
              {showcslproject == true ? (
                <div className="roleProject darkHeader">
                  <DataTable
                    value={activeProjectsByCustomer}
                    editMode="row"
                    showGridlines
                    stripedRows
                    scrollHeight="calc(100vh - 147px)"
                    responsiveLayout="scroll"
                  >
                    <Column
                      header={` Projects - ${projectNameSuggest} `}
                      alignHeader={"center"}
                      body={projectLinksCsl}
                    ></Column>
                  </DataTable>
                </div>
              ) : (
                ""
              )}
              {!visi && viewBy != "acct" && showcslproject ? (
                <div className="HierarchyTreeTableContainer">
                  <div
                    style={{
                      backgroundColor: "#eeeeee38",
                      border: "1px solid #ddd",
                    }}
                  >
                    <div
                      className="col-md-12"
                      style={{
                        borderBottom: "1px solid grey",
                        background: "#4e68a5",
                        height: "32px",
                        padding: "10px",
                      }}
                    >
                      <label style={{ float: "right", paddingTop: "5px" }}>
                        <select
                          style={{ marginLeft: "10px" }}
                          id="status"
                          onChange={(e) => {
                            setState(e.target.value);
                            getPrjRolesTree(projRolesTreeId);
                          }}
                        >
                          <option value="All" selected>
                            All
                          </option>
                          <option value="Active">Active</option>
                        </select>
                      </label>
                      <div className="childTwo">
                        <h3
                          style={{
                            textAlign: "center",
                            color: "#ffff",
                            fontSize: "14px",
                            paddingTop: "7px",
                          }}
                        >
                          Project Hierarchy
                        </h3>
                      </div>
                    </div>
                    {showcslHieTable == true &&
                    searchinghierarchy &&
                    activeProjectsByCustomer.length > 0 ? (
                      // hierarchydata.length > 1
                      <TeamsProjectHierarchyTree
                        defaultExpandedRows={String(-1)}
                        data={hierarchydata}
                        hierarchyCount={hierarchyCount}
                      />
                    ) : (
                      "No results found"
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="col-md-12">
            {viewBy == "prj" && (
              <TeamsProjectHierarchy
                projectHierarchy={projectHierarchy}
                setShowprojectHie={setShowprojectHie}
                showprojectHie={showprojectHie}
                searchProjecthierarchy={searchProjecthierarchy}
                visi={visi}
                setState={setState}
                state={state}
              />
            )}
            {viewBy == "admin" && (
              <div className="col-md-4">
                <div className="row">
                  {searchAdminHierarchy == true ? (
                    <AdminHierarchy setNodeClicked={handleNodeClicked} />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
          </div>

          {/*  show account hierarchy tables */}
          <div className="col-md-12">
            <div className="row">
              {showacchieTable ? (
                <>
                  <div className="roleTableLegends">
                    <span title="Customer Successful Lead Head">
                      <img src={CSLHead} />
                      CSL Head
                    </span>
                    <span title="Customer Successful Lead">
                      <img src={CSL} />
                      CSL
                    </span>
                    <span title="Associate Customer Successful Lead">
                      <img src={ACSL} />
                      ACSL
                    </span>
                    <span title="Delivery Partner Head">
                      <img src={DPHead} />
                      DP Head
                    </span>
                    <span title="Delivery Partner">
                      <img src={DP} />
                      DP
                    </span>
                    <span title="Talent Partner">
                      <img src={TP} />
                      TP
                    </span>
                    <span title="Project Coordinator">
                      <img src={PC} />
                      PC
                    </span>
                    <span title="Software Quality Assurance">
                      <img src={SQA} />
                      SQA
                    </span>
                    <span title="Account Executive">
                      <img src={AE} />
                      AE
                    </span>
                    <span title="Account Owner">
                      <img src={AW} />
                      AW
                    </span>
                  </div>

                  <div style={{ maxWidth: "45%" }}>
                    <AccountHierarTable
                      data={data}
                      setActiveProjectsByCustomer={setActiveProjectsByCustomer}
                      setShowacchieDataTable={setShowacchieDataTable}
                      activeProjectsByCustomer={activeProjectsByCustomer}
                      expandedCols={[]}
                      setShowacctHieTable={setShowacctHieTable}
                      colExpandState={[]}
                      setAccountHieFirstTable={setAccountHieFirstTable}
                      setProjectNameSuggest={setProjectNameSuggest}
                    />
                  </div>
                </>
              ) : (
                ""
              )}

              {showacchieDataTable == true ? (
                <>
                  <div className="roleProject darkHeader">
                    <DataTable
                      value={activeProjectsByCustomer}
                      editMode="row"
                      showGridlines
                      stripedRows
                      scrollHeight="calc(100vh - 147px)"
                      responsiveLayout="scroll"
                    >
                      <Column
                        header={` Projects - ${projectNameSuggest} `}
                        alignHeader={"center"}
                        body={projectLinks}
                      ></Column>
                    </DataTable>
                  </div>
                </>
              ) : (
                ""
              )}
              {!visi && showacchieDataTable && viewBy == "acct" ? (
                <div className="HierarchyTreeTableContainer">
                  <div
                    className=""
                    style={{
                      backgroundColor: "#eeeeee38",
                      border: "1px solid #ddd",
                    }}
                  >
                    <div
                      className="col-md-12"
                      style={{
                        borderBottom: "1px solid grey",
                        background: "#4e68a5",
                        height: "32px",
                        padding: "10px",
                      }}
                    >
                      <label style={{ float: "right", paddingTop: "5px" }}>
                        <select
                          style={{ marginLeft: "10px" }}
                          id="status"
                          onChange={(e) => {
                            setStateAcctHierarchy(e.target.value);
                            getPrjRolesTreAccHie(hieprojectId, e.target.value);
                          }}
                        >
                          <option value="All" selected>
                            All
                          </option>
                          <option value="Active">Active</option>
                        </select>
                      </label>
                      <div className="childTwo">
                        <h2
                          style={{
                            textAlign: "center",
                            color: "#ffff",
                            fontSize: "14px",
                            paddingTop: "7px",
                          }}
                        >
                          Project Hierarchy
                        </h2>
                      </div>
                    </div>
                    {searchinghierarchy == true &&
                    activeProjectsByCustomer.length > 0 ? (
                      // &&
                      // hierarchydata.length > 1
                      <TeamsProjectHierarchyTree
                        defaultExpandedRows={String(-1)}
                        data={hierarchydata}
                        hierarchyCount={hierarchyCount}
                      />
                    ) : (
                      "No results found"
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Hierarchy;
