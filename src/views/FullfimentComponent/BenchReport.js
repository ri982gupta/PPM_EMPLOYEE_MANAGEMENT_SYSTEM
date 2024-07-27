import React, { useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
// import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import { useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import BenchReportSummaryTable from "./BenchReportSummaryTable";
import Loader from "../Loader/Loader";
import { useLocation } from "react-router-dom";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { BiCheck } from "react-icons/bi";
import fte_active from "../../assets/images/empstatusIcon/fte_active.png";
import fte_inactive from "../../assets/images/empstatusIcon/fte_inactive.png";
import fte_notice from "../../assets/images/empstatusIcon/fte_notice.png";
import subk_active from "../../assets/images/empstatusIcon/subk_active.png";
import subk_inactive from "../../assets/images/empstatusIcon/subk_inactive.png";
import subk_notice from "../../assets/images/empstatusIcon/subk_notice.png";
import { RiFileExcel2Line } from "react-icons/ri";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import ErrorLogTable from "../Administration/ErrorLogsTable";
import { VscChecklist } from "react-icons/vsc";
import { GoPerson } from "react-icons/go";
import ResourceOverviewEditableTable from "./ResourceOverviewEditableTable";
import BenchReportEditableTable from "./BenchReportEditableTable";
import "./BenchReport.scss";
import { AiFillWarning } from "react-icons/ai";
import ExcelJS from "exceljs";
import BenchReportSecondtTable from "./BenchReportSecondTable";

function BenchReport() {
  const [startDate, setStartDate] = useState(new Date());
  const [Addmsg, setAddmsg] = useState(false);
  const loggedUserId = localStorage.getItem("resId");
  const loggedUser = loggedUserId;
  const HelpPDFName = "RMGBenchReport.pdf";
  const HelpHeader = "Bench Report Help";
  let date1 = moment(startDate).format("yyyy-MM-DD");
  const [resourcedata, setResourcedata] = useState([]);
  const [resid, setresid] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [dispay, setDisplay] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [saveactionmessage, setSaveActionMessage] = useState(false);
  const [engCountry, setEngCountry] = useState([]);
  const [setEngSelectCountry, setEngSelectedCountry] = useState([]);
  const [searching, setsearching] = useState(false);
  const [date, SetDate] = useState(getLastSaturday(new Date()));
  const [previousSaturday, setPreviousSaturday] = useState(
    getSaturdayOfPreviousWeek(date)
  );

  function getLastSaturday(date) {
    const day = date.getDay();
    const daysToSaturday = day === 6 ? 1 : day + 1;
    const lastSaturday = new Date(date);
    lastSaturday.setDate(date.getDate() - daysToSaturday);
    return lastSaturday;
  }
  const [open, setOpen] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [resourcname, setResourceName] = useState([]);
  const [loader, setLoader] = useState(false);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [displayTable, setDisplayTable] = useState([]);
  const [tabHeaders, setTabHeaders] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [typeid, setTypeID] = useState([]);
  const [tableDisplay, setTableDisplay] = useState(false);
  const [elementId, setElementId] = useState([]);
  const [employeeid, setEmployeeId] = useState("");
  const [validationmessage, setValidationMessage] = useState(false);
  const [validationmessagesum, setValidationMessagesum] = useState(false);

  const pageurl = "http://10.11.12.149:3000/#/rmg/bench";
  const page_Name = "Bench Report";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const [heading, setHeading] = useState([]);
  function getSaturdayOfPreviousWeek(selectedDate) {
    const dayInMilliseconds = 1000 * 60 * 60 * 24;
    const selectedDayOfWeek = selectedDate.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6

    // Calculate the number of days to subtract to reach the previous Saturday
    const daysToSubtract = ((selectedDayOfWeek + 1) % 7) + 1;

    // Calculate the milliseconds for the previous Saturday
    const previousSaturdayMillis =
      selectedDate.getTime() - daysToSubtract * dayInMilliseconds;

    const previousSaturday = new Date(previousSaturdayMillis);
    return previousSaturday;
  }
  useEffect(() => {
    const displayTableCopyHead = displayTable;
    const displayTableCopyBody = displayTable;

    const headerData = displayTableCopyHead.slice(0, 2);
    const bodyData = displayTableCopyBody.splice(2);

    setTableHeader(headerData);
    setTableBody(bodyData);
  }, [displayTable]);
  const [searchDataB, setSearchDataB] = useState(
    "170,211,123,82,168,207,212,18,213,49,149,208,243"
  );
  const FilterData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/FiltersData?saved_search_id=${
          id === null ? 0 : id
        }`,
    }).then(function (res) {
      const getData = res.data;
      setFilterData(getData);
    });
  };
  const ref = useRef([]);

  useEffect(() => {
    FilterData();
  }, []);

  const [formData, setFormData] = useState({
    BuIds: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    CountryIds: "6,5,3,8,7,1,2,999",
    EngCountryIds: "-1",
    FromDate: moment(date).format("yyyy-MM-DD"),
    Duration: "1",
    sessKey: "44524751691400245360",
    isExport: "0",
    resType: "all",
    isChecked: "true",
  });
  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          BuIds: filterData.BuIds,
          CountryIds: filterData.CountryIds,
          EngCountryIds: filterData.EngCountryIds,
          FromDate: filterData.FromDate,
          Duration: filterData.Duration,
          sessKey: filterData.sessKey,
          isExport: filterData.isExport,
          resType: filterData.resType,
          isChecked: filterData.isChecked,
        };
      } else {
        return {
          BuIds: "170,211,123,82,168,207,212,18,213,49,149,208,243",
          CountryIds: "6,5,3,8,7,1,2,999",
          EngCountryIds: "-1",
          FromDate: moment(date).format("yyyy-MM-DD"),
          Duration: "1",
          sessKey: "44524751691400245360",
          isExport: "0",
          resType: "all",
          isChecked: "true",
        };
      }
    });
  }, [filterData]);
  useEffect(() => {
    data1[0] && setHeaderData(JSON.parse(JSON.stringify(data1[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, [data1]);
  useEffect(() => {
    if (id != null) {
      const updatebusiness = business.filter((values) =>
        formData.BuIds?.includes(values.value)
      );

      const updatereslocation = country.filter((values) =>
        formData.CountryIds?.includes(values.value)
      );

      const updateengCountry = engCountry.filter((values) =>
        formData.EngCountryIds?.includes(values.value)
      );
      setEngSelectedCountry(updateengCountry);
      setSelectedCountry(updatereslocation);
      setSelectedBusiness(updatebusiness);
    }
  }, [id, business, country, engCountry]);

  useEffect(() => {
    if (id != null) {
      setTimeout(() => {
        handleClick();
      }, 3000);
    }
  }, [id, formData]);

  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getDepartments`)
      .then((Response) => {
        let departments = Response.data;
        departments.push({ value: 0, label: "Non-Revenue Units" });

        setBusiness(departments);
        setSelectedBusiness(departments.filter((ele) => ele.value != 0));
        let filteredDeptData = [];
        departments.forEach((data) => {
          if (data.value != 0) {
            filteredDeptData.push(data.value);
          }
        });
      })
      .catch((error) => console.log(error));
  };

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.push({ id: 0, country_name: "<<Others>>" });
        data.length > 0 &&
          data.forEach((e) => {
            if (e.id !== 4) {
              let countryObj = {
                label: e.country_name,
                value: e.id,
              };

              countries.push(countryObj);
            }
          });
        setCountry(countries);
        if (id == null) {
          setSelectedCountry(countries);
        }
      })
      .catch((error) => console.log(error));
  };

  const getEngCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.push({ id: 0, country_name: "<<Others>>" });
        data.length > 0 &&
          data.forEach((e) => {
            if (e.id !== 4) {
              let countryObj = {
                label: e.country_name,
                value: e.id,
              };
              countries.push(countryObj);
            }
          });
        setEngCountry(countries);
        if (id == null) {
          setEngSelectedCountry(countries);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleClick1 = (id) => {
    setEmployeeId(id);
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/allocationDashboard/getActionItemDetails?rid=${id}`,
    }).then((response) => {
      let GetData = response.data;
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["completed_dt"] =
          GetData[i]["completed_dt"] == null
            ? ""
            : moment(GetData[i]["completed_dt"]).format("DD-MMM-YYYY");

        GetData[i]["effective_dt"] =
          GetData[i]["effective_dt"] == null
            ? ""
            : moment(GetData[i]["effective_dt"]).format("DD-MMM-YYYY");

        GetData[i]["created_dt"] =
          GetData[i]["created_dt"] == null
            ? ""
            : moment(GetData[i]["created_dt"]).format("DD-MMM-YYYY");
      }

      setResourcedata(GetData);
      window.scrollTo({ top: 1500, behavior: "smooth" });

      setGraphKey1((prevKey) => prevKey + 1);
      setValidationMessage(false);
    });
  };
  const [excelData, setExcelData] = useState([]);
  const getData = (temp, element) => {
    const SummaryData = element.name;
    setLoaderState(true);
    let loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    let t = temp.a;
    axios({
      method: "post",
      url: baseUrl + `/fullfilmentms/rolloffs/getBenchReportSummary`,
      data: {
        BuIds: temp.b,
        CountryIds: "-1",
        Typ: temp.a,
        isExport: "0",
        isChecked: formData.isChecked,
        UserId: loggedUserId,
      },
    })
      .then((response) => {
        setLoader(false);
        clearTimeout(loaderTime);
        var response = response.data;
        setHeading(
          SummaryData +
            " -" +
            (headName == "cogs"
              ? " COGS"
              : headName == "over"
              ? " OVRH"
              : headName == "total"
              ? " Total Resources"
              : headName == "fullAlloc"
              ? " Fully Allocated Resources"
              : headName == "bench"
              ? " Complete Bench"
              : headName == "noAlloc"
              ? " No Allocation"
              : headName == "nonDepl"
              ? " Non Deployable"
              : headName == "futAlloc"
              ? " Future Allocated"
              : headName == "blocked"
              ? " Blocked Resources"
              : headName == "backfill"
              ? " Backfill"
              : headName == "training"
              ? " Training"
              : headName == "compBench"
              ? " Complete Bench"
              : headName == "nBCat2"
              ? " Non Billable (8 <= hrs < 20)"
              : headName == "nBCat3"
              ? " Non Billable (20 <= hrs < 40)"
              : headName == "nBFTE"
              ? " Non Billable (FTE)"
              : headName == "nBTotal"
              ? " Non Billable (Total)"
              : headName == "pBCat1"
              ? " Partially Billable (< 8 hrs)"
              : headName == "pBCat2"
              ? " Partially Billable (8 <= hrs < 20)"
              : headName == "pBCat3"
              ? " Partially Billable (20 <= hrs < 40)"
              : headName == "pBFTE"
              ? " Partially Billable (FTE)"
              : headName == "pBTotal"
              ? " Partially Billable (Total)"
              : headName == "nBCat1"
              ? " Non Billable (8 <= hrs < 20)"
              : headName == "innovCat1"
              ? " Innovation Billable (< 8 hrs)"
              : headName == "innovCat2"
              ? " Innovation Billable (8 <= hrs < 20)"
              : headName == "innovCat3"
              ? " Innovation Billable (20 <= hrs < 40)"
              : headName == "innovFTE"
              ? " Innovation Billable (FTE)"
              : headName == "innovTotal"
              ? " Innovation Billable (Total)"
              : "")
        );
        let Headerdata = [
          {
            empId: "Emp. Id",
            resource: "Resource",
            designation: "Designation",
            department: "Department",
            customer: "Customer",
            LoB: "LOB Category",
            cadre_code: "Cadre",
            skillGrps: "Skill Group",
            Skill: "Skill",
            emp_citizenship: "Citizenship",
            nectCap: "Net Cap. Hrs",
            billHrs: "Billable Hrs",
            availHrs: "Available Hrs",
            projected: "Availability%",
            aging: "Ageing",
            nbHrs: "Non Bill Hrs",
            supervisor: "Supervisor",
            actionItem: "Action Item",
            actionDt: "Action Item Date",
            actionEffDt: "Action Item Eff. Date",
            futureAllocDate: "Future Alloc Date",
          },
        ];
        let ExcelHeaderdata = [
          {
            empId: "Emp Id",
            resource: "Resource",
            designation: "Designation",
            department: "Department",
            LoB: "LoB Category",
            cadre_code: "Cadre",
            skillGrps: "Skill Group",
            Skill: "Skill",
            emp_citizenship: "Citizenship",
            projected: "Availability%",
            status: "Status",
            resAllocType: "Res.Alloc. Type",
            actionDt: "Action Item Date",
            actionEffDt: "Action Item Effective Date",
            actionItem: "Action Item",
            supervisor: "Supervisor",
            aging: "Ageing",
            customer: "Customer",
            nectCap: "Net Cap. Hrs",
            billHrs: "Billable Hrs",
            availHrs: "Available Hrs",
            nbHrs: "Non Bill Hrs",
            // futureAllocDate: "Future Alloc Date",
          },
        ];
        if (
          t !== "bench" &&
          t !== "noAlloc_count" &&
          t != "nonDepl_count" &&
          t != "futAlloc_count" &&
          t != "blocked_count" &&
          t != "backfill_count" &&
          t != "training_count" &&
          t != "compBench_count"
        ) {
          // Remove "Aging" and "futureAllocDate" properties from the first object in the array
          delete Headerdata[0].aging;
          delete Headerdata[0].futureAllocDate;
        }

        let hData = [];
        let bData = [];
        for (let index = 0; index < response.length; index++) {
          if (index == 0) {
            hData.push(response[index]);
            bData.push(response[index]);
          } else {
            bData.push(response[index]);
          }
        }
        setExcelData(ExcelHeaderdata.concat(bData));
        setData1(Headerdata.concat(bData));
        setOpen(true);
        // Scroll down by 200 pixels

        setLoaderState(false);
        setHeaderData(hData);
        setLoader(false);
        window.scrollTo({ top: 1500, behavior: "smooth" }); // Scroll to the bottom of the page
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {}, [data1]);
  const LinkTemplate = (employeedata) => {
    let rou = linkColumns[0];
    return (
      <>
        <div>
          {employeedata.empStatus == "fteActive" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
              style={{ width: "150px" }}
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  setResourceName(employeedata.resource);
                  setresid(employeedata.id);
                  setDisplay(true);
                  handleClick1(employeedata.id);
                }}
              >
                {formData.isChecked == false ? (
                  ""
                ) : (
                  <VscChecklist
                    size="1.4em"
                    title="Action Items"
                    cursor="pointer"
                  />
                )}
                {/* <VscChecklist
                  size="1.4em"
                  title="Action Items"
                  cursor="pointer"
                /> */}
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resource}>
                {employeedata.resource}
              </span>
            </div>
          ) : employeedata.empStatus == "subkActive" ? (
            <div
              className="rollOffTableIcon amber ellipsis"
              title="Active Contractor"
              style={{ width: "200px" }}
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  setResourceName(employeedata.resource);
                  setresid(employeedata.id);
                  setDisplay(true);
                  handleClick1(employeedata.id);
                }}
              >
                {formData.isChecked == false ? (
                  ""
                ) : (
                  <VscChecklist
                    size="1.4em"
                    title="Action Items"
                    cursor="pointer"
                  />
                )}
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resource}>
                {employeedata.resource}
              </span>
            </div>
          ) : employeedata.empStatus === "fteInactive" &&
            ![
              "Non Deployable",
              "Blocked",
              "No Allocation",
              "Future Allocated",
            ].includes(employeedata.resAllocType) ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Active Employee"
            >
              <img
                // src={fte_notice}
                // alt="(fte_notice_icon)"
                src={fte_inactive}
                alt="(fte_inactive_icon)"
                style={{ height: "12px" }}
                title="Ex-Employee"
              />
              <a
                onClick={(e) => {
                  setResourceName(employeedata.resource);
                  setresid(employeedata.id);
                  setDisplay(true);
                  handleClick1(employeedata.id);
                }}
              >
                {formData.isChecked == false ? (
                  ""
                ) : (
                  <VscChecklist
                    size="1.4em"
                    title="Action Items"
                    cursor="pointer"
                  />
                )}
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resource}>
                {employeedata.resource}
              </span>
            </div>
          ) : employeedata.empStatus == "fteNotice" ? (
            <div
              className="rollOffTableIcon green ellipsis"
              title="Employee in notice period"
            >
              {/* <GoPerson className="icon" /> */}
              <img
                src={fte_notice}
                alt="(fte_notice_icon)"
                style={{ height: "12px", marginRight: "10px" }}
                title="Employee in notice period"
              />
              <a
                onClick={(e) => {
                  setResourceName(employeedata.resource);
                  setresid(employeedata.id);
                  setDisplay(true);
                  handleClick1(employeedata.id);
                }}
              >
                {formData.isChecked == false ? (
                  ""
                ) : (
                  <VscChecklist
                    size="1.4em"
                    title="Action Items"
                    cursor="pointer"
                  />
                )}
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resource}>
                {employeedata.resource}
              </span>
            </div>
          ) : employeedata.empStatus == "Bench" ? (
            <div
              className="rollOffTableIcon white ellipsis"
              title="Active Employee"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  setDisplay(true);
                  handleClick1(employeedata.id);
                  setresid(employeedata.id);
                  setResourceName(employeedata.resource);
                }}
              >
                {formData.isChecked == false ? (
                  ""
                ) : (
                  <VscChecklist
                    size="1.4em"
                    title="Action Items"
                    cursor="pointer"
                  />
                )}
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resource}>
                {employeedata.resource}
              </span>
            </div>
          ) : employeedata.empStatus == "subkInactive" &&
            ![
              "Non Deployable",
              "Blocked",
              "No Allocation",
              "Future Allocated",
            ] ? (
            <div
              className="rollOffTableIcon blueRed ellipsis"
              title="Active Contractor"
            >
              <GoPerson className="icon" />
              <a
                onClick={(e) => {
                  setResourceName(employeedata.resource);
                  setresid(employeedata.id);
                  setDisplay(true);
                  handleClick1(employeedata.id);
                }}
              >
                {formData.isChecked == false ? (
                  ""
                ) : (
                  <VscChecklist
                    size="1.4em"
                    title="Action Items"
                    cursor="pointer"
                  />
                )}
              </a>{" "}
              &nbsp;
              <span title={employeedata.resource}>{employeedata.resource}</span>
            </div>
          ) : employeedata.empStatus === "fteInactive" &&
            [
              "Non Deployable",
              "Blocked",
              "No Allocation",
              "Future Allocated",
              "Training",
            ].includes(employeedata.resAllocType) ? (
            <div className="rollOffTableIcon white ellipsis" title="Employee">
              <img
                src={fte_inactive}
                alt="(fte_inactive_icon)"
                style={{ height: "16px", width: "16px", margin: "3px" }}
                title="Ex-Employee"
              />
              <a
                onClick={(e) => {
                  setDisplay(true);
                  handleClick1(employeedata.id);
                  setresid(employeedata.id);
                  setResourceName(employeedata.resource);
                }}
              >
                {formData.isChecked == false ? (
                  ""
                ) : (
                  <VscChecklist
                    size="1.4em"
                    title="Action Items"
                    cursor="pointer"
                  />
                )}
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resource}>
                {employeedata.resource}
              </span>
            </div>
          ) : employeedata.empStatus === "subkInactive" &&
            [
              "Non Deployable",
              "Blocked",
              "No Allocation",
              "Future Allocated",
            ].includes(employeedata.resAllocType) ? (
            <div className="rollOffTableIcon white ellipsis" title="Employee">
              <img
                src={subk_inactive}
                alt="(fte_notice_icon)"
                style={{ height: "16px", width: "16px", margin: "3px" }}
                title="Ex-Contractor"
              />
              <a
                onClick={(e) => {
                  setDisplay(true);
                  handleClick1(employeedata.id);
                  setresid(employeedata.id);
                  setResourceName(employeedata.resource);
                }}
              >
                {formData.isChecked == false ? (
                  ""
                ) : (
                  <VscChecklist
                    size="1.4em"
                    title="Action Items"
                    cursor="pointer"
                  />
                )}
              </a>{" "}
              &nbsp;
              <span className="ellipsis" title={employeedata.resource}>
                {employeedata.resource}
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  };

  const Actiondate = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        style={{ width: "80px", textAlign: "center" }}
        title={moment(data.actionDt).format("DD-MMM-YYYY")}
      >
        {moment(data.actionDt).format("DD-MMM-YYYY") == "Invalid date"
          ? ""
          : moment(data.actionDt).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const EffectiveDate = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        style={{ width: "125px", textAlign: "center" }}
        title={moment(data.actionEffDt).format("DD-MMM-YYYY")}
      >
        {moment(data.actionEffDt).format("DD-MMM-YYYY") == "Invalid date"
          ? ""
          : moment(data.actionEffDt).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const futureAllocDate = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        style={{ width: "80px", textAlign: "center" }}
        title={moment(data.futureAllocDate).format("DD-MMM-YYYY")}
      >
        {moment(data.futureAllocDate).format("DD-MMM-YYYY") == "Invalid date"
          ? ""
          : moment(data.futureAllocDate).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const Designation = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.designation}>
        {data.designation}
      </div>
    );
  };

  const empId = (data) => {
    console.log(data);
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        style={{ width: "70px" }}
        title={data.empId}
      >
        {data.empId}
      </div>
    );
  };

  const Department = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.department}>
        {data.department}
      </div>
    );
  };

  const Customer = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.customer}>
        {data.customer}
      </div>
    );
  };

  const LoB = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.LoB}>
        {data.LoB}
      </div>
    );
  };

  const Cadre_code = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "center" }}
        data-toggle="tooltip"
        title={data.cadre_code}
      >
        {data.cadre_code}
      </div>
    );
  };

  const SkillGrps = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.skillGrps}>
        {data.skillGrps}
      </div>
    );
  };

  const Skill = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.Skill}>
        {data.Skill}
      </div>
    );
  };

  const Emp_citizenship = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data.emp_citizenship}
      >
        {data.emp_citizenship}
      </div>
    );
  };

  const NectCap = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right", width: "80px" }}
        data-toggle="tooltip"
        title={data.nectCap}
      >
        {data.nectCap}
      </div>
    );
  };

  const BillHrs = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right" }}
        data-toggle="tooltip"
        title={data.billHrs}
      >
        {data.billHrs}
      </div>
    );
  };

  const AvailHrs = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right" }}
        data-toggle="tooltip"
        title={data.availHrs}
      >
        {data.availHrs}
      </div>
    );
  };
  const Projected = (data) => {
    // Assuming data.projected is a number like 100
    const percentage = data.projected + "%";

    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right" }}
        data-toggle="tooltip"
        title={percentage}
      >
        {percentage}
      </div>
    );
  };

  const Aging = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right" }}
        data-toggle="tooltip"
        title={data.aging}
      >
        {data.aging}
      </div>
    );
  };

  const NbHrs = (data) => {
    return (
      <div
        className="ellipsis"
        style={{ textAlign: "right", width: "80px" }}
        data-toggle="tooltip"
        title={data.nbHrs}
      >
        {data.nbHrs}
      </div>
    );
  };

  const Supervisor = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.supervisor}>
        {data.supervisor}
      </div>
    );
  };

  const ActionItem = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.actionItem}>
        {data.actionItem}
      </div>
    );
  };
  let headName = "";
  const onclickHandler = (a, b, element) => {
    headName = a.split("_")[0];

    const temp = {};
    if (
      a.split("_")[0] == "cogs" ||
      a.split("_")[0] == "over" ||
      a.split("_")[0] == "total" ||
      a.split("_")[0] == "bench"
    ) {
      if (a.split("_")[0] == "over") {
        temp["a"] = "ovrh";
      } else {
        temp["a"] = a.split("_")[0];
      }
    } else {
      temp["a"] = a;
    }

    temp["b"] = b;
    getData(temp, element);
    setDisplay(false);
    setOpen(false);
  };

  const order = [
    "id",
    "name",
    "cogs_count",
    "over_head_count",
    "total",
    "fullAlloc_count",
    "bench",
    "noAlloc_count",
    "nonDepl_count",
    "futAlloc_count",
    "blocked_count",
    "backfill_count",
    "training_count",
    "compBench_count",
    "nBCat1_count",
    "nBCat2_count",
    "nBCat3_count",
    "nBFTE_count",
    "nBTotal_count",

    // "count",
    "pBCat1_count",
    "pBCat2_count",
    "pBCat3_count",
    "pBFTE_count",
    "pBTotal_count",

    "innovCat1_count",
    "innovCat2_count",
    "innovCat3_count",
    "innovFTE_count",
    "innovTotal_count",
  ];
  const [showSummryTable, setShowSummaryTable] = useState(false);

  const handleClick = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setValidationMessagesum(true);
        setTimeout(() => {
          setValidationMessagesum(false);
        }, 3000);
      }
      return;
    }
    // setsearching(true);

    let loaderTimeout = setTimeout(() => {
      setLoader(true);
    }, 2000);

    axios({
      method: "post",
      url: baseUrl + `/fullfilmentms/rolloffs/getBenchReport`,
      data: {
        BuIds: searchDataB,
        CountryIds: formData.CountryIds,
        EngCountryIds: formData.EngCountryIds,
        FromDate: formData.FromDate,
        Duration: formData.Duration,
        isExport: 0,
        resType: formData.resType,
        isChecked: formData.isChecked,
        UserId: loggedUserId,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const data = response.data.map((obj) => {
        const newObj = {};
        order.forEach((key) => {
          if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
          }
        });
        return newObj;
      });
      const originalData = data;
      setData(originalData);
      setLoaderState(false);
      setLoader(false);
      setShowSummaryTable(true);
      clearTimeout(loaderTimeout);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
    setsearching(false);
    setValidationMessagesum(false);
  };

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  useEffect(() => {
    getBusinessUnit();
    getCountries();
    getEngCountries();
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
  const [tableHeader, setTableHeader] = useState([]);
  const [tableBody, setTableBody] = useState([]);
  console.log(tableBody);
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "empId" && empId) ||
          (col == "resource" && LinkTemplate) ||
          (col == "actionDt" && Actiondate) ||
          (col == "actionEffDt" && EffectiveDate) ||
          (col == "designation" && Designation) ||
          (col == "department" && Department) ||
          (col == "customer" && Customer) ||
          (col == "LoB" && LoB) ||
          (col == "cadre_code" && Cadre_code) ||
          (col == "skillGrps" && SkillGrps) ||
          (col == "Skill" && Skill) ||
          (col == "emp_citizenship" && Emp_citizenship) ||
          (col == "nectCap" && NectCap) ||
          (col == "billHrs" && BillHrs) ||
          (col == "availHrs" && AvailHrs) ||
          (col == "projected" && Projected) ||
          (col == "aging" && Aging) ||
          (col == "nbHrs" && NbHrs) ||
          (col == "supervisor" && Supervisor) ||
          (col == "actionItem" && ActionItem) ||
          (col == "futureAllocDate" && futureAllocDate)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  useEffect(() => {
    data1[0] && setHeaderData(JSON.parse(JSON.stringify(data1[0])));
  }, [data1]);

  useEffect(() => {
    if (data.length > 0) {
      let headers = Object.keys(data[0]).filter((d) => d != "id" && d != "lvl");
      setTabHeaders(headers);
    }
  }, [data]);

  useEffect(() => {
    displayTableFnc();
  }, [tabHeaders]);

  let tabHeader = [
    "empId",
    "resource",
    "designation",
    "department",
    "customer",
    "LoB",
    "cadre_code",
    "skillGrps",
    "Skill",
    "emp_citizenship",
    "nectCap",
    "billHrs",
    "availHrs",
    "projected",
    "nbHrs",
    "supervisor",
    "actionItem",
    "actionDt",
    "actionEffDt",
  ];
  const displayTableFnc = () => {
    setDisplayTable(() => {
      return data.map((element, index) => {
        let tabData = [];
        tabHeaders.forEach((inEle, inInd) => {
          if (index === 0) {
            let value = ("" + element[inEle]).includes("^&")
              ? element[inEle].split("^&")
              : element[inEle];
            let rowSpanValue = value ? value[1] : "";
            let colSpanValue = value ? value[2] : "";
            if (value) {
              console.log(value[0]);
              tabData.push(
                <th
                  style={{ textAlign: "center" }}
                  colSpan={colSpanValue}
                  rowSpan={rowSpanValue}
                  key={inInd}
                >
                  {value[0]}
                </th>
              );
            }
          } else {
            if (index === 1) {
              if (element[inEle]) {
                tabData.push(
                  <th
                    align={inInd > 0 ? "right" : "left"}
                    style={{ textAlign: "center" }}
                  >
                    <span>{element[inEle]}</span>
                  </th>
                );
              }
            } else {
              const HeadCount = ["total", "over_head_count", "cogs_count"];
              const FullyAllocated = ["fullAlloc_count", "bench"];
              const BenchZeroAllocation = [
                "noAlloc_count",
                "nonDepl_count",
                "futAlloc_count",
                "blocked_count",
                "backfill_count",
                "training_count",
                "compBench_count",
              ];
              const NBL = [
                "nBCat1_count",
                "nBCat2_count",
                "nBCat3_count",
                "nBFTE_count",
                "nBTotal_count",
              ];
              const Partial = [
                "pBCat1_count",
                "pBCat2_count",
                "pBCat3_count",
                "pBFTE_count",
                "pBTotal_count",
              ];
              const Innovation = [
                "innovCat1_count",
                "innovCat2_count",
                "innovCat3_count",
                "innovFTE_count",
                "innovTotal_count",
              ];

              let className = HeadCount.includes(inEle)
                ? "lightTurquoise"
                : FullyAllocated.includes(inEle)
                ? "lightBlue"
                : BenchZeroAllocation.includes(inEle)
                ? "lightPink"
                : NBL.includes(inEle)
                ? "lemonGreen"
                : Partial.includes(inEle)
                ? "lightYellow"
                : Innovation.includes(inEle)
                ? "skyBlue"
                : "";
              const number = element[inEle];
              console.log(number);
              const roundedNumber =
                inEle == "name" ? number : Math.round(number);
              console.log(tabData);
              {
                data[2].id == 9999 ? (
                  <tr>
                    <td align="center">No Records To View</td>
                  </tr>
                ) : (
                  ""
                );
              }

              {
                data[2].id !== 9999
                  ? tabData.push(
                      <td align={inInd > 0 ? "right" : "center"}>
                        <span
                          className={className}
                          style={{
                            cursor:
                              inInd > 0 && element[inEle] != 0 ? "pointer" : "",
                            color:
                              inInd != 0 && element[inEle] != 0
                                ? "#2e88c5"
                                : "",
                          }}
                          onMouseOver={(e) => {
                            e.target.style.textDecoration =
                              inInd > 0 && element[inEle] != 0
                                ? "underline"
                                : "none"; // Apply underline when hovering based on condition
                          }}
                          onMouseOut={(e) => {
                            e.target.style.textDecoration = "none"; // Remove underline on mouse out
                          }}
                          onClick={() => {
                            inInd > 0 && element[inEle] != 0
                              ? onclickHandler(
                                  inEle,
                                  element.id == 0 ? "-1" : element.id,
                                  element,
                                  setTypeID(inEle),
                                  setElementId(element.id),
                                  setTableDisplay(true)
                                )
                              : "";
                          }}
                        >
                          {inEle == "bench"
                            ? roundedNumber + " %"
                            : roundedNumber.toLocaleString()}
                        </span>
                      </td>
                    )
                  : "";
              }
            }
          }
        });
        return <tr key={index}>{tabData}</tr>;
      });
    });
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Fullfilment";
  let currentScreenName = ["Bench Metrics"];

  useEffect(() => {
    getMenus();
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
        }
      });
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

  function handleChange(e) {
    setChecked(e.target.checked);
    setFormData({ ...formData, ["isChecked"]: e.target.checked });
  }

  const handleDateChange = (event) => {
    const newSelectedDate = new Date(event);

    const newPreviousSaturday = getLastSaturday(newSelectedDate);
    newSelectedDate.getDay() == 6
      ? SetDate(newSelectedDate)
      : SetDate(newPreviousSaturday);
    // SetDate(e);
    setFormData((prev) => ({
      ...prev,
      ["FromDate"]: moment(
        newSelectedDate.getDay() == 6 ? newSelectedDate : newPreviousSaturday
      ).format("yyyy-MM-DD"),
    }));
  };
  const handleOnExport = () => {
    const excludeProperties = ["id"];
    const headerRow1 = [
      "Business Unit",
      "COGS",
      "OVRH",
      "Total",
      "Fully Allocated",
      "Deployable Bench %",
      "No Alloc",
      "Non Depl",
      "Future Alloc",
      "Blocked",
      "Backfill",
      "Training",
      "Total",
      "1 <= hrs < 8",
      "8 <= hrs < 20",
      ">= 20 hrs",
      "FTE",
      "Total",
      "1 <= hrs < 8",
      "8 <= hrs < 20",
      "20 <= hrs < 40",
      "FTE",
      "Total",
      "1 <= hrs < 8",
      "8 <= hrs < 20",
      "20 <= hrs < 40",
      "FTE",
      "Total",
    ];

    const filteredData = data.slice(2).filter((item, index) => index !== 1);

    const dataRows = filteredData.map((item) => {
      const filteredItem = Object.fromEntries(
        Object.entries(item).filter(([key]) => !excludeProperties.includes(key))
      );
      return Object.values(filteredItem);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BenchReportConsolidated");
    const headerRow = worksheet.addRow(headerRow1);

    for (let i = 0; i < dataRows.length; i++) {
      const row = worksheet.addRow(dataRows[i]);
    }

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "BenchReportConsolidated.xlsx");
    });
  };
  console.log(tableHeader);
  return (
    <div>
      {validationmessagesum ? (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please provide valid values for highlighted values"}
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Bench Report</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <ScreenBreadcrumbs
        routes={routes}
        currentScreenName={currentScreenName}
      />
      {loader ? <Loader handleAbort={handleAbort} /> : ""}

      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Search created successfully.
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader">
          <h2>Search Filters</h2>
          <div className="helpBtn">
            <GlobalHelp pdfname={HelpPDFName} name={HelpHeader} />
          </div>
          <div className="saveBtn">
            <SavedSearchGlobal
              setEditAddmsg={setEditAddmsg}
              pageurl={pageurl}
              page_Name={page_Name}
              payload={formData}
            />
          </div>
          &nbsp;
          <div
            onClick={() => {
              setVisible(!visible);
              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            <span>{cheveronIcon}</span>
          </div>
        </div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="BuIds">
                  Business Unit&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      id="BuIds"
                      ArrowRenderer={ArrowRenderer}
                      value={selectedBusiness}
                      valueRenderer={generateDropdownLabel}
                      options={business}
                      hasSelectAll={true}
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
                        setSearchDataB(filteredValues.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="CountryIds">
                  Res. Location&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <MultiSelect
                      id="CountryIds"
                      options={country}
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      hasSelectAll={true}
                      value={selectedCountry}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      disabled={false}
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
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-6" htmlFor="EngCountryIds">
                  Engagement Location
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-5">
                  <MultiSelect
                    id="EngCountryIds"
                    options={engCountry}
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    hasSelectAll={true}
                    value={setEngSelectCountry}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    onChange={(e) => {
                      const selectedValues = e.map((option) => option.value);
                      setEngSelectedCountry(e);
                      if (selectedValues.length === engCountry.length) {
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["EngCountryIds"]: "-1",
                        }));
                      } else {
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["EngCountryIds"]: selectedValues.toString(),
                        }));
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="week">
                  Week&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    name="FromDate"
                    value={date}
                    id="FromDate"
                    selected={date}
                    showYearDropdown
                    showMonthDropdown
                    onChange={(e) => {
                      handleDateChange(e);
                    }}
                    dateFormat="dd-MMM-yy"
                    placeholderText=""
                    dropdownMode="select"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Duration">
                  Duration&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="Duration"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                    value={formData.Duration}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resType">
                  Res. Type&nbsp;<span className="error-text">*</span>
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
                    value={formData.resType}
                  >
                    <option value="all"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="fte">Employee</option>
                    <option value="subk">Contractors</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-6" htmlFor="Duration">
                  Resources with &gt;1 FTE Allocations
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-5">
                  <input
                    type="checkbox"
                    id="myCheckbox"
                    name="myCheckbox"
                    checked={formData.isChecked}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                type="submit"
                className="btn btn-primary"
                title="Search"
                onClick={() => {
                  handleClick(),
                    setDisplay(false),
                    setOpen(false),
                    setDisplay(false);
                  setShowSummaryTable(false);
                  setValidationMessage(false);
                }}
              >
                <FaSearch />
                Search
              </button>
              {/* )} */}
            </div>
          </div>
        </CCollapse>
      </div>

      {showSummryTable == true ? (
        <>
          {" "}
          <div className="mt-2">
            <RiFileExcel2Line
              size="1.5em"
              title="Export to Excel"
              style={{ color: "green", float: "right" }}
              cursor="pointer"
              onClick={handleOnExport}
            />{" "}
          </div>
          <div className="benchReportTable darkHeader toHead">
            <table
              className="table table-bordered htmlTable"
              cellPadding={0}
              cellSpacing={0}
              style={{ marginTop: "7px" }}
            >
              <thead>{tableHeader}</thead>
              {/* <tbody>
                {tableBody.length === 1 ? (
                  <tr>
                    <td style={{ textAlign: "center" }} colSpan={28}>
                      No Data Found
                    </td>
                  </tr>
                ) : (
                  tableBody
                )}
              </tbody> */}
              <tbody>
                {tableBody.length === 1 ? (
                  <td
                    style={{ textAlign: "center", background: "#b3bdc7 " }}
                    colSpan="28"
                  >
                    {" No Data Found"}
                  </td>
                ) : (
                  tableBody
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        ""
      )}

      <div>
        {open == true ? (
          <>
            <div>
              <b style={{ color: "#297AB0", fontSize: "15px" }}>{heading}</b>
              <BenchReportSecondtTable
                headerData={headerData}
                data={data1}
                excelData={excelData}
                rows={20}
                loaderState={loaderState}
                setLoaderState={setLoaderState}
                dynamicColumns={dynamicColumns}
                setHeaderData={setHeaderData}
                exportData={exportData}
                fileName="Bench Report"
              />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      {validationmessage ? (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please provide valid values for highlighted values"}
        </div>
      ) : (
        ""
      )}

      {Addmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp;Action Item saved successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {deleteMessage ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp;Action Item Deleted successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {dispay && (
        <div className="resourceOverviewEmp">
          <b style={{ color: "#297AB0", fontSize: "15px" }}>
            {"Action Items (" + resourcname + ")"}
          </b>

          <BenchReportEditableTable
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
            setLoader={setLoader}
            setAddmsg={setAddmsg}
          />
        </div>
      )}
    </div>
  );
}

export default BenchReport;
