import React, { useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { useEffect } from "react";
import { environment } from "../../environments/environment";
import moment from "moment";
import ResourceOverviewDisplayTable from "./ResourceOverviewTable";
import { Column } from "ag-grid-community";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { GoPerson } from "react-icons/go";
import { VscChecklist } from "react-icons/vsc";
import Loader from "../Loader/Loader";
import ResourceOverviewEditableTable from "./ResourceOverviewEditableTable";
import { BiCheck } from "react-icons/bi";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import ErrorLogTable from "../Administration/ErrorLogsTable";
import { AiFillWarning } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";

function ResourceOverview(props) {
  const {
    permission,
    urlState,
    buttonState,
    setButtonState,
    setUrlState,
    permissionNew,
  } = props;
  // console.log(permission[1].is_write, "permission");
  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  // const [startDate, setStartDate] = useState();

  const HelpPDFName = "RMGResourceOverview.pdf";
  const HelpHeader = "Resource overview Help";

  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [data, setData] = useState([]);
  const [employeedata, setEmployeeData] = useState([]);
  const [id, setId] = useState([]);
  const [loader, setLoader] = useState(false);
  const [resid, setresid] = useState([]);
  const [resourcname, setResourceName] = useState([]);
  const [resCategory, setResCategory] = useState([]);
  console.log(resCategory);
  const [resourcedata, setResourcedata] = useState([]);
  const [resourceid, setResourceId] = useState(0);
  const [bodyData, setBodyData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [employeeid, setEmployeeId] = useState("");
  const [dispay, setDisplay] = useState(false);
  const baseUrl = environment.baseUrl;
  let rows = 25;
  const [searching, setsearching] = useState(false);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  // let date1 = moment(startDate).format("yyyy-MM-DD");
  const [column, setColumn] = useState([]);
  const [col, setCol] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [displayTableState, setDisplayTableState] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [empTable, setEmpTable] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [saveactionmessage, setSaveActionMessage] = useState(false);
  const [headerdate, setHeaderDate] = useState([]);
  const [totaldata, setTotaldata] = useState([]);
  useEffect(() => { }, [totaldata]);
  const tempElement = document.createElement("div");
  tempElement.innerHTML = totaldata;
  const extractedText = tempElement.textContent.trim();
  const ref = useRef([]);
  const graphRef = useRef(null);
  const [graphKey, setGraphKey] = useState(0);
  useEffect(() => {
    if (graphKey && graphRef.current) {
      graphRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [graphKey]);
  const graphRef1 = useRef(null);
  const [graphKey1, setGraphKey1] = useState(0);
  useEffect(() => {
    if (graphKey1 && graphRef1.current) {
      graphRef1.current.scrollIntoView({ behavior: "instant" });
    }
  }, [graphKey1]);

  const abortController = useRef(null);
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const filterMondays = (date) => {
    return date.getDay() === 6;
  };
  const getCurrentSaturday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + 6; // Add 6 instead of subtracting
    return new Date(now.setDate(diff));
  };

  const defaultDate = getCurrentSaturday();
  const [date, SetDate] = useState(defaultDate);
  const initialValue = {
    BuIds: "170,211,123,82,168,207,212,18,213,49,149,208",
    CountryIds: "-1",
    StartDate: moment(date).format("yyyy-MM-DD"),
    Duration: "4",
    resType: "0",
  };
  const today = new Date();
  const lastFriday = new Date(
    today.getTime() - ((today.getDay() + 1) % 7) * 24 * 60 * 60 * 1000
  );

  const pageurl = "http://10.11.12.149:3000/#/rmg/bench";
  const page_Name = "Resource Overview";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const SavedSearchId = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);

  const FilterData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/FiltersData?saved_search_id=${SavedSearchId === null ? 0 : SavedSearchId
        }`,
    }).then(function (res) {
      const getData = res.data;
      setFilterData(getData);
      console.log(getData + "in line 881...");
    });
  };

  useEffect(() => {
    FilterData();
  }, []);
  const [formData, setFormData] = useState({
    BuIds: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    CountryIds: "-1",
    StartDate: moment(date).format("yyyy-MM-DD"),
    Duration: "4",
    resType: "0",
  });
  const cat = { id: resid, rmg_bench_type_id: "" };
  const [categoryData, setCategoryData] = useState(cat);
  const [actioncategory, setActioncategory] = useState();

  useEffect(() => {
    GetEmployees();
  }, [id, headerdate]);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCategoryData((prev) => ({ ...prev, [id]: value }));
    axios
      .post(baseUrl + `/fullfilmentms/resourceoverview/updateResourceAlloc`, {
        id: resid,
        rmg_bench_type_id: value,
      })
      .then((response) => {
        axios
          .post(
            baseUrl +
            `/fullfilmentms/resourceoverview/updateRMGResAllocActionItem?resourceId=${resid}`
          )
          .then((response) => {
            setAddmsg(true);
            setLoader(true);
            setTimeout(() => {
              setAddmsg(false);
              setLoader(false);
            }, 4000);
            GetEmployees();
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //=====================
  const Getcategory = (e) => {
    axios({
      method: "get",
      url: baseUrl + `/fullfilmentms/resourceoverview/actionitemtypes`,
    }).then((res) => {
      var category = res.data;
      setActioncategory(category);
    });
  };
  useEffect(() => {
    Getcategory();
  }, []);

  //===================Getting ResourceId================
  const getResourceid = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/defectphases/getresourceid?id=${loggedUserId}`,
    }).then(function (response) {
      var res = response.data;
      setResourceId(res);
    });
  };
  useEffect(() => {
    getResourceid();
  }, [resourceid]);
  //================
  const handleClick = async () => {
    setEmpTable(false);
    setColumn([]);
    setTableData([]);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + `/fullfilmentms/resourceoverview/getResourceTrendingData`,
      data: {
        // departments:
        //   formData.BuIds == "170,211,123,82,168,207,212,18,213,49,149,208,0" ? "-1" : formData.BuIds,
        departments:
          formData.BuIds === "170,211,123,82,168,207,212,18,213,49,149,208,0" ||
            formData.BuIds === ""
            ? "-1"
            : formData.BuIds,

        country: formData.CountryIds == "" ? "-1" : formData.CountryIds,
        from: formData.StartDate,
        duration: formData.Duration,
        resType: formData.resType,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const data = response.data;
      axios({
        method: "get",
        url:
          baseUrl +
          `/fullfilmentms/resourceoverview/getheaders?ReportRunId=${data.reportRunId}`,
      }).then((res1) => {
        let header = res1.data.val;
        let splt = header?.replaceAll("'", "");
        let st = splt?.split(",");
        setCol(st);
        let newArray = st?.map((element) => element.trim());
        setColumn(newArray);
        setClicked(true);
      });

      setTableData(data);
      setLoader(false);
      clearTimeout(loaderTime);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
    setDisplayTableState(true);
  };

  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getDepartments`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        // data.push({ value: 243, label: "Tier2" });
        data.push({ value: 999, label: "Non-Revenue Units" });

        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.label,
              value: e.value,
            };
            // e.label == "Tier2" ? "" :
            countries.push(countryObj);
          });
        setBusiness(countries);
        setSelectedBusiness(countries.filter((option) => option.value !== 999));

        // setSelectedBusiness(countries);
      })
      .catch((error) => console.log(error));
  };

  //-------------Getting Country-------------

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;

        // data.push({ id: 0, country_name: "<<Others>>" });
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };

            countries.push(countryObj);
          });
        setCountry(countries);
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getBusinessUnit();
    getCountries();
  }, []);

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  useEffect(() => {
    if (clicked && column.length === 0 && tableData) {
      let newArray = col.map((element) => element.trim());
      setColumn(newArray);
    }
  }, [clicked, tableData, formData.Duration]);

  const onClickHandler = (a, b) => {
    // setEmpTable(false)
    setDisplay(false);
    setLoader(false);
    const temp = {};
    temp["a"] = a;
    temp["b"] = b;
    // GetEmployees(temp)
    // setDisplayTableState(true);
    // setEmpTable(true)
    // setEmpTable(true)

    // setGraphKey((prevKey) => prevKey + 1);
  };

  const GetEmployees = () => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/fullfilmentms/resourceoverview/getRMGHcDetailsView?kpi=${id}&weekDt=${headerdate}&sessKey=${tableData.sessKey}&reportRunId=${tableData.reportRunId}`,
    })
      .then((response) => {
        const GetData = response.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["resDOJ"] =
            GetData[i]["resDOJ"] == null
              ? ""
              : moment(GetData[i]["resDOJ"]).format("DD-MMM-YYYY");
          GetData[i]["actionItemDate"] =
            GetData[i]["actionItemDate"] == null
              ? ""
              : moment(GetData[i]["actionItemDate"]).format("DD-MMM-YYYY");
          GetData[i]["actionItemEffDt"] =
            GetData[i]["actionItemEffDt"] == null
              ? ""
              : moment(GetData[i]["actionItemEffDt"]).format("DD-MMM-YYYY");
          GetData[i]["rollOfDate"] =
            GetData[i]["rollOfDate"] == null
              ? ""
              : moment(GetData[i]["rollOfDate"]).format("DD-MMM-YYYY");
          GetData[i]["aging"] =
            GetData[i]["aging"] == 0 ? "NA" : GetData[i]["aging"];
        }
        let headerData = [
          {
            employee_number: "Emp ID",
            resName: "Emp Name",
            resDOJ: "DOJ",
            resCategory: "Res Cat",
            practice: "Practice",
            subPractice: "SubPractice",
            supervisor: "Supervisor",
            projects: "Projects",
            resAlloc: "Allocs",
            rollOfDate: "Roll of Date",
            aging: "Ageing",
            workLocation: "Work Location",
            designation: "Designation",
            resEmail: "Email",
            restType: "Res Type",
            skillName: "Skills",
            actionItem: "Action   Item",
            actionItemDate: "Action Item Date",
            actionItemEffDt: "Action Item Eff Dt",
          },
        ];
        let hData = [];
        let bData = [];
        for (let index = 0; index < GetData.length; index++) {
          if (index == 0) {
            hData.push(GetData[index]);
          } else {
            bData.push(GetData[index]);
          }
        }
        setBodyData(bData);
        const sorting = headerData.concat(bData);
        const sortedEmpNumber = GetData.sort(function (a, b) {
          var nameA = a.employee_number.toUpperCase();
          var nameB = b.employee_number.toUpperCase();
          if (nameA < nameB) {
            return -1; //nameA comes first
          }
          if (nameA > nameB) {
            return 1; // nameB comes first
          }
          return 0; // names must be equal
        });
        setEmpTable(true);
        setEmployeeData(headerData.concat(sortedEmpNumber));
        setGraphKey((prevKey) => prevKey + 1);
        setLoader(false);
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch(function (error) {
        setLoader(false);
      });
  };

  const EmpId = (employeedata) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "center" }}
        data-toggle="tooltip"
        title={employeedata.employee_number}
      >
        {employeedata.employee_number}
      </div>
    );
  };
  const EmpName = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.resName}
      >
        {employeedata.resName}
      </div>
    );
  };
  const DOJ = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.resDOJ}
      >
        {employeedata.resDOJ}
      </div>
    );
  };
  const ResCAt = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.resCategory}
      >
        {employeedata.resAlloc >= employeedata.resNetCap
          ? "Fully Allocated"
          : employeedata.resCategory}
      </div>
    );
  };
  const Practice = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.practice}
      >
        {employeedata.practice}
      </div>
    );
  };
  const SubPractice = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.subPractice}
      >
        {employeedata.subPractice}
      </div>
    );
  };
  const Supervisor = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.supervisor}
      >
        {employeedata.supervisor}
      </div>
    );
  };
  const Projects = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.projects}
      >
        {employeedata.projects}
      </div>
    );
  };

  const Allocs = (employeedata) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right" }}
        data-toggle="tooltip"
        title={employeedata.resAlloc}
      >
        {employeedata.resAlloc}
      </div>
    );
  };
  const Aging = (employeedata) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right" }}
        data-toggle="tooltip"
        title={employeedata.aging}
      >
        {employeedata.aging}
      </div>
    );
  };
  const WorkLocation = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.workLocation}
      >
        {employeedata.workLocation}
      </div>
    );
  };
  const RollOfDate = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        style={{ textAlign: "center" }}
        title={employeedata.rollOfDate}
      >
        {employeedata.rollOfDate}
      </div>
    );
  };
  const Designation = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.designation}
      >
        {employeedata.designation}
      </div>
    );
  };
  const ResEmail = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.resEmail}
      >
        {employeedata.resEmail}
      </div>
    );
  };
  const RestType = (employeedata) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "center" }}
        data-toggle="tooltip"
        title={employeedata.restType}
      >
        {employeedata.restType}
      </div>
    );
  };
  const SkillName = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={employeedata.skillName}
      >
        {employeedata.skillName}
      </div>
    );
  };

  const ActionItem = (employeedata) => {
    return (
      <div
        className="ellipsis"
        // style={{ width: '50px !important' }}
        data-toggle="tooltip"
        title={employeedata.actionItem}
      >
        {employeedata.actionItem}
      </div>
    );
  };

  const ActionItemDate = (employeedata) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        style={{ textAlign: "center" }}
        title={employeedata.actionItemDate}
      >
        {employeedata.actionItemDate}
      </div>
    );
  };
  const ActionItemEffDt = (employeedata) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "center" }}
        data-toggle="tooltip"
        title={employeedata.actionItemEffDt}
      >
        {employeedata.actionItemEffDt}
      </div>
    );
  };

  const LinkTemplate = (employeedata) => {
    let rou = linkColumns[0];
    return (
      <>
        <div>
          {employeedata.isInNotice == 1 ? (
            <div className="rollOffTableIcon green ellipsis">
              <img
                src={fte_notice}
                alt="(fte_notice_icon)"
                style={{ height: "12px" }}
                title="Employee in notice period"
              />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                />
              </a>{" "}
              &nbsp;
              <span title={employeedata.resName}>{employeedata.resName}</span>
            </div>
          ) : employeedata.restType == "CN Employee" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                />
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resName}>
                {employeedata.resName}
              </span>
            </div>
          ) : employeedata.restType == "Employed - Full Time" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                />
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resName}>
                {employeedata.resName}
              </span>
            </div>
          ) : employeedata.restType == "Gardening Leave" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                />
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resName}>
                {employeedata.resName}
              </span>
            </div>
          ) : employeedata.restType == "Maternity Leave" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                />
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resName}>
                {employeedata.resName}
              </span>
            </div>
          ) : employeedata.restType == "Contractor" ? (
            <div
              className="rollOffTableIcon amber ellipsis"
              title="Active Contractor"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                />
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resName}>
                {employeedata.resName}
              </span>
            </div>
          ) : employeedata.restType == "UK Employee" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                />
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resName}>
                {employeedata.resName}
              </span>
            </div>
          ) : employeedata.restType == "Sub-Contractor" ? (
            <div
              className="rollOffTableIcon amber ellipsis"
              title="Active Contractor"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                />
              </a>{" "}
              &nbsp;
              <span title={employeedata.resName}>{employeedata.resName}</span>
            </div>
          ) : employeedata.restType == "US Employee" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                />
              </a>{" "}
              &nbsp;
              <span title={employeedata.resName}>{employeedata.resName}</span>
            </div>
          ) : employeedata.restType == "DE Employee" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  handleClick1(employeedata.resId);
                  setDisplay(true);
                  setresid(employeedata.resId);
                  setResourceName(employeedata.resName);
                  setResCategory(employeedata.resCategory);
                }}
              >
                <VscChecklist size="1.4em" title="Action Items" />
              </a>{" "}
              &nbsp;
              <span title={employeedata.resName}>{employeedata.resName}</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          // col == "SNo" ? SnoAlign :

          (col == "resName" && LinkTemplate) ||
          (col == "employee_number" && EmpId) ||
          (col == "resDOJ" && DOJ) ||
          (col == "resCategory" && ResCAt) ||
          (col == "practice" && Practice) ||
          (col == "resAlloc" && Allocs) ||
          (col == "aging" && Aging) ||
          (col == "workLocation" && WorkLocation) ||
          (col == "rollOfDate" && RollOfDate) ||
          (col == "designation" && Designation) ||
          (col == "resEmail" && ResEmail) ||
          (col == "restType" && RestType) ||
          (col == "skillName" && SkillName) ||
          (col == "actionItem" && ActionItem) ||
          (col == "actionItemDate" && ActionItemDate) ||
          (col == "actionItemEffDt" && ActionItemEffDt) ||
          (col == "subPractice" && SubPractice) ||
          (col == "supervisor" && Supervisor) ||
          (col == "projects" && Projects)
          //
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  useEffect(() => {
    employeedata[0] &&
      setHeaderData(JSON.parse(JSON.stringify(employeedata[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, [employeedata]);

  //=======================Editable Table Api==========================
  const handleClick1 = (id) => {
    setLoader(false);
    const idString = JSON.stringify(id);
    setEmployeeId(id);
    axios({
      method: "get",
      url:
        baseUrl +
        `/fullfilmentms/resourceoverview/ActionTable?resource_id=${idString}`,
      //  baseUrl + `/fullfilmentms/resourceoverview/getresourceactions?resIds=${resid}&fromDt=2020-01-01&toDt=2020-01-01`,
    }).then((response) => {
      let GetData = response.data;
      setResourcedata(GetData);
      setLoader(false);
      setGraphKey1((prevKey) => prevKey + 1);
      setValidationMessage(false);
    });
  };
  //============================================================================
  const [routes, setRoutes] = useState([]);
  let textContent = "Fullfilment";
  let currentScreenName = ["Bench Metrics", "Trending"];
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
        `/CommonMS/security/authorize?url=/rmg/dashboard&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  return (
    <div>
      <div className="col-md-12">
        {editmsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck size="1.4em" /> &nbsp; Search created successfully.
            </span>
          </div>
        ) : (
          ""
        )}
        <div className="pageTitle">
          <div className="childOne">
            <div className="tabsProject">
              <ul className="tabsContainer">
                <button
                  className={
                    buttonState === "Bench Report"
                      ? "buttonDisplayClick"
                      : "buttonDisplay"
                  }
                  onClick={() => {
                    setButtonState("Bench Report");
                    setUrlState(
                      permission[3]?.display_name.url_path
                        ?.toString()
                        ?.replace(/::/g, "/")
                    );
                  }}
                >
                  Bench Report
                </button>{" "}
              </ul>
              <ul className="tabsContainer">
                <li>
                  <span>Deployment</span>
                  <ul>
                    {permissionNew.map((button) => (
                      <li
                        className={
                          buttonState === button.display_name
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState(button.display_name);
                          console.log(button.display_name);
                          setUrlState(
                            button.url_path?.toString()?.replace(/::/g, "/")
                          );
                        }}
                      >
                        {button.display_name}
                      </li>
                    ))}
                  </ul>
                </li>{" "}
              </ul>
              <ul className="tabsContainer">
                <button
                  className={
                    buttonState === "Roll Offs"
                      ? "buttonDisplayClick"
                      : "buttonDisplay"
                  }
                  onClick={() => {
                    setButtonState("Roll Offs");
                    setUrlState(
                      permission[3]?.display_name.url_path
                        ?.toString()
                        ?.replace(/::/g, "/")
                    );
                  }}
                >
                  <span>{"Roll Off"}</span>
                </button>{" "}
              </ul>
            </div>
          </div>
          <div className="childTwo">
            <h2>Trending</h2>
          </div>
          <div className="childThree toggleBtns">
            <div>
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
              <div className="saveBtn">
                <SavedSearchGlobal
                  setEditAddmsg={setEditAddmsg}
                  pageurl={pageurl}
                  page_Name={page_Name}
                  payload={formData}
                />
              </div>
            </div>
            <GlobalHelp pdfname={HelpPDFName} name={HelpHeader} />
          </div>{" "}
        </div>
      </div>

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="BuIds">
                  Business Unit
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="BuIds"
                    value={selectedBusiness}
                    options={business}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<<Please Select>>",
                    }}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedBusiness(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["BuIds"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Country
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 multiselect">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="CountryIds"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<<Please Select>>",
                    }}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["CountryIds"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="startweek">
                  Start Week&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 datepicker">
                  <DatePicker
                    name="StartDate"
                    minDate={lastFriday}
                    id="StartDate"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    selected={date}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        ["StartDate"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      SetDate(e);
                    }}
                    filterDate={filterMondays}
                    dateFormat="dd-MMM-yyyy"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 ">
                  <select
                    className="text"
                    id="Duration"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4" selected>
                      4
                    </option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resType">
                  Res. Type
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="resType"
                    name="resType"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="all"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="1">Employee</option>
                    <option value="2">Contractors</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              {searching ? (
                <button
                  className="btn btn-primary"
                  type="button"
                  style={{ pointerEvents: "none" }}
                >
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {loader ? <Loader handleAbort={handleAbort} /> : ""}
                </button>
              ) : (
                <button
                  className="btn btn-primary "
                  onClick={() => {
                    handleClick(), setDisplay(false), setEmpTable(false);
                  }}
                >
                  <FaSearch />
                  Search
                </button>
              )}
            </div>
          </div>
        </CCollapse>
      </div>
      {displayTableState && (
        <ResourceOverviewDisplayTable
          tableData={tableData}
          column={column}
          onClickHandler={onClickHandler}
          setEmpTable={setEmpTable}
          setId={setId}
          id={id}
          setHeaderDate={setHeaderDate}
          setTotaldata={setTotaldata}
        />
      )}

      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {empTable && (
        <div ref={graphRef} key={graphKey} className="resourceOverviewEmp">
          <b style={{ color: "#297ab0", fontSize: "15px" }}>
            {extractedText} Details{" "}
          </b>
          <br />
          <ErrorLogTable
            data={employeedata}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            rows={rows}
            exportData={exportData}
            fileName="Resource Overview"
          />
        </div>
      )}
      <br />
      {dispay && (
        <div className="col-md-12" ref={graphRef1} key={graphKey1}>
          {saveactionmessage ? (
            <div className="statusMsg success">
              <BiCheck />
              {"Action Item Saved Successfully"}
            </div>
          ) : (
            ""
          )}
          {addmsg ? (
            <div className="statusMsg success">
              <BiCheck />
              {"Updated Successfully"}
            </div>
          ) : (
            ""
          )}
          {deleteMessage ? (
            <div className="statusMsg success">
              <span className="errMsg">
                <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;
                Action Item Deleted successfully
              </span>
            </div>
          ) : (
            ""
          )}
          {validationmessage ? (
            <div className="statusMsg error">
              <AiFillWarning />
              {"Please provide valid values for highlighted values"}
            </div>
          ) : (
            ""
          )}
          <div class="actionItemStyles">
            <div class="row">
              <div class="col-md-4">
                <label style={{ color: "#2e88c5" }}>
                  Action Items ({resourcname})
                </label>
              </div>
              <div class="col-md-4">
                <div className="form-group row">
                  <div className="col-6">
                    <label style={{ float: "right", color: "#2e88c5" }}>
                      Resource Alloc Category :
                    </label>
                  </div>
                  <div className="col-6">
                    <select
                      id="ResourceAllocCategory"
                      onChange={(e) => handleChange(e)}
                    >
                      {actioncategory?.map((item) => (
                        <option
                          value={item.id}
                          key={item.id}
                          selected={item.lkup_name == resCategory}
                        >
                          {item.lkup_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="resourceOverviewEmp">
            <ResourceOverviewEditableTable
              resid={resid}
              resourcedata={resourcedata}
              setResourcedata={setResourcedata}
              setResourceName={setResourceName}
              handleClick1={handleClick1}
              setDeleteMessage={setDeleteMessage}
              setSaveActionMessage={setSaveActionMessage}
              employeeid={employeeid}
              setValidationMessage={setValidationMessage}
              searching={searching}
              validationmessage={validationmessage}
              setsearching={setsearching}
              permission={permission}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceOverview;
