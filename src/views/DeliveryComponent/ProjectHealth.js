import React from "react";
import { ImSearch } from "react-icons/im";
import "../../App.scss";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CCollapse, CListGroup } from "@coreui/react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
// import { FaSearch } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { ColumnGroup } from "primereact/columngroup";
import Loader from "../Loader/Loader";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaInfoCircle,
  FaCaretDown,
  FaSearch,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { environment } from "../../environments/environment";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { MultiSelect } from "react-multi-select-component";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import { Link, useLocation } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Row } from "primereact/row";
import { DataTable } from "primereact/datatable";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { AiFillWarning } from "react-icons/ai";
import { color, setOptions } from "highcharts";
import { fontWeight } from "@mui/system";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { BiCheck } from "react-icons/bi";
import "./ProjectHealth.scss";
import ExcelJS from "exceljs";

function getAllNames(inputString) {
  const regex = /(\d+)\^\^([^,]+)/g;
  let match;
  const resultList = [];

  while ((match = regex.exec(inputString)) !== null) {
    const id = match[1];
    const value = match[2].trim();
    resultList.push({ id, value });
  }

  return resultList;
}

function ProjectHealth() {
  const abortController = useRef(null);

  //===================
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const [postDataDetails, setPostDataDetails] = useState([]);
  const [projectnames, setProjectnames] = useState([]);
  const [pid, setPid] = useState([]);
  const [pmId, setPmId] = useState([]);
  const [update, setUpdate] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  // Function to handle column sorting

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 106) + "px"
  );

  const onSort = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
    // Sort your data based on the selected field and order
    const sortedData = [...data].sort((a, b) => {
      const valueA = a[e.sortField];
      const valueB = b[e.sortField];
      if (valueA < valueB) return e.sortOrder === 1 ? -1 : 1;
      if (valueA > valueB) return e.sortOrder === 1 ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };
  const [sortAscending, setSortAscending] = useState(true);

  const handleSort = (field, ascending) => {
    // Implement your sorting logic here
    // You can toggle the sortAscending state variable
    setSortAscending(!ascending);

    // Use the updated sortAscending variable as needed for sorting or further actions
    // For example, you can use it to update your data array based on the sorting direction.
  };

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header={<div>Project Name</div>}
          rowSpan={2}
          sortable
          field="project_name"
          sortAscending={sortAscending}
          onSort={handleSort}
        />
        <Column
          header="Primary Manager"
          rowSpan={2}
          sortable
          field="prj_pm_name"
          sortAscending={sortAscending}
          onSort={handleSort}
        />
        <Column
          header="Notify PM"
          rowSpan={2}
          sortable
          field="notify_pms"
          sortAscending={sortAscending}
          onSort={handleSort}
        />
        <Column
          header={
            <>
              <div>{"Comp(%)"}</div>
              <FaInfoCircle
                style={{ fontSize: "10px" }}
                className="tableInfoIcon"
                title="Project Completed (%) = Actual Hours divided by Planned Hours"
                field="prj_compltn"
                sortAscending={sortAscending}
                onSort={handleSort}
              />
            </>
          }
          sortable
          rowSpan={2}
        />
        <Column
          header="Terms"
          rowSpan={2}
          sortable
          field="ct_term"
          sortAscending={sortAscending}
          onSort={handleSort}
        />
        <Column
          header={
            <>
              {"Count"}
              <FaInfoCircle
                style={{ fontSize: "10px" }}
                className="tableInfoIcon"
                title="This the Resource Count and the data is populated based on the resources 
                allocated for that particular day"
                field="res_count"
                sortAscending={sortAscending}
                onSort={handleSort}
              />
            </>
          }
          rowSpan={2}
          sortable
        />
        <Column header={<div>Efforts(Hrs) </div>} colSpan={3} />
        <Column header={<div>GM(%)</div>} colSpan={3} />
        <Column header={<div>Risks</div>} colSpan={4} />
        <Column header="Audit Details" colSpan={2} />
        <Column header="CSAT Details" colSpan={2} />
      </Row>

      <Row>
        <Column
          header={
            <>
              {"Plan"}
              <FaInfoCircle
                style={{ fontSize: "10px" }}
                className="tableInfoIcon"
                title="Number of days * Daily Allocated Hours"
              />
            </>
          }
          sortable
          field="pln_efforts"
          body={(rowData) => {
            const backgroundColor = rowData.count > 100 ? "pink" : "green"; // Change the condition as needed

            return <div style={{ backgroundColor }}>{rowData.pln_efforts}</div>;
          }}
        />
        <Column
          header={
            <>
              {"EAC"}
              <FaInfoCircle
                style={{ fontSize: "10px" }}
                className="tableInfoIcon"
                title="Planned Hours+ Actual Hours- Planned hours Till date"
              />
            </>
          }
          field="eac_efforts"
          sortable
        />
        <Column
          header={
            <>
              {"Var(%)"}
              <FaInfoCircle
                style={{ fontSize: "10px" }}
                className="tableInfoIcon"
                title="[(Planned Hours-EAC Effort Hours)/Planned Hours] *100"
              />
            </>
          }
          sortable
          field="var_efforts"
        />
        <Column
          header={
            <>
              {"Plan"}
              <FaInfoCircle
                style={{ fontSize: "10px" }}
                className="tableInfoIcon"
                title="[(Planned Revenue- Planned RDC- ODC)/Planned Revenue] *100"
              />
            </>
          }
          field="pln_gm"
          sortable
        />
        <Column
          header={
            <>
              {"EAC"}
              <FaInfoCircle
                style={{ fontSize: "10px" }}
                className="tableInfoIcon"
                title="[(EAC Revenue – EAC RDC- ODC)/EAC Revenue] *100"
              />
            </>
          }
          sortable
          field="eac_gm"
        />
        <Column
          header={
            <>
              {"Var(%)"}
              <FaInfoCircle
                style={{ fontSize: "10px" }}
                className="tableInfoIcon"
                title="[(Planned GM – EAC GM)/Planned GM] *100"
              />
            </>
          }
          sortable
          field="var_gm"
        />

        <Column field="critical_risks" header="Crt" sortable></Column>
        <Column field="high_risks" header="High" sortable></Column>
        <Column field="med_risks" header="Med" sortable></Column>
        <Column field="low_risks" header="Low" sortable></Column>
        <Column field="audit_date" header="Month" sortable></Column>
        <Column field="audit_result" header="Res" sortable></Column>
        <Column field="csat_date" header="Month" sortable></Column>
        <Column field="csat_result" header="Score" sortable></Column>
      </Row>
    </ColumnGroup>
  );
  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  const [filters1, setFilters1] = useState({
    global: filtersData["contains"],
  });

  const [mainData, setMainData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);

  useEffect(() => {
    if (mainData.length > 0) {
      setHeaderData(mainData[0]);
      setBodyData(mainData.splice(1));
    }
  }, [mainData]);
  useEffect(() => {
    setFilters1({
      global: filtersData["contains"],
    });
  }, [headerData]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const formatNumber = (number) => {
    if (number == null) {
      return "";
    }
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const exportExcel = () => {
    const excludeProperties = [
      "audit_Type",
      "impact_id",
      "notify_pm",
      "prj_id",
      "prj_pm_id",
      "sno",
      "ct_title",
      "prj_status",
    ];
    const keyMapping = {
      project_name: "ProjectName",
      prj_pm_name: "PrimaryManager",
      notify_pms: "NotifyPM",
      prj_compltn: "Comp",
      ct_term: "Terms",
      res_count: "Count",
      pln_efforts: "Plans",
      eac_efforts: "EACs",
      var_efforts: "Vars",
      pln_gm: "Plan",
      eac_gm: "Eac",
      var_gm: "Var",
      critical_risks: "Critical",
      high_risks: "High",
      med_risks: "Medium",
      low_risks: "Low",
      audit_date: "Month",
      audit_result: "Res",
      csat_date: "Month",
      csat_result: "Score",
    };
    const headerRow1 = Object.keys(keyMapping);
    const filteredData = data.map((item) => {
      const filteredItem = Object.fromEntries(
        Object.entries(item).filter(([key]) => !excludeProperties.includes(key))
      );
      return filteredItem;
    });
    const dataRows = filteredData.map((item) => {
      return headerRow1.map((key, index) => {
        const mappedValue = item[key];
        if (mappedValue !== null && mappedValue !== undefined) {
          let cleanedValue = mappedValue;
          if (index === 2 && typeof mappedValue === "string") {
            cleanedValue = mappedValue.replace(/\^\^|\d+/g, "");
          }
          return cleanedValue;
        } else {
          return "";
        }
      });
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Project Health");
    const toTitleCase = (str) =>
      str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    const formattedHeaderRow1 = headerRow1.map((key) => {
      if (key === "audit_date") {
        return "Audit Details";
      } else if (key === "prj_pm_name") {
        return "PrimaryManager";
      } else if (key === "notify_pms") {
        return "NotifyPM";
      } else if (key === "prj_compltn") {
        return "Comp(%)";
      } else if (key === "ct_term") {
        return "Terms";
      } else if (key === "res_count") {
        return "Count";
      } else if (key === "pln_efforts") {
        return "Efforts(Hrs)";
      } else if (key === "eac_efforts") {
        return "";
      } else if (key === "var_efforts") {
        return "";
      } else if (key === "pln_gm") {
        return "GM(%)";
      } else if (key === "eac_gm") {
        return "";
      } else if (key === "var_gm") {
        return "";
      } else if (key === "critical_risks") {
        return "Risks";
      } else if (key === "high_risks") {
        return "";
      } else if (key === "med_risks") {
        return "";
      } else if (key === "low_risks") {
        return "";
      } else if (key === "audit_result") {
        return "";
      } else if (key === "csat_date") {
        return "CSAT Details";
      } else if (key === "csat_result") {
        return "";
      }
      return toTitleCase(key.replace(/_/g, " "));
    });
    const headerRow = worksheet.addRow(formattedHeaderRow1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    const specificHeaders = [
      "Plan",
      "EAC",
      "Var(%)",
      "Plan",
      "EAC",
      "Var(%)",
      "Crt",
      "High",
      "Med",
      "Low",
      "Month",
      "Res",
      "Month",
      "Score",
    ];
    const specificHeaderRow = worksheet.addRow([]);
    specificHeaderRow.splice(7, 0, ...specificHeaders);
    specificHeaderRow.eachCell((cell) => {
      cell.font = { bold: true };
    });
    dataRows.forEach((row) => {
      worksheet.addRow(row);
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "ProjectHealth.xlsx");
    });
  };

  const renderHeader = () => {
    return (
      <div className="col-md-12 flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
        <span>
          <i
            style={{
              fontSize: "20px",
              marginTop: "5px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
            class="pi pi-file-excel exportBtn"
            onClick={exportExcel}
            data-pr-tooltip="XLS"
            title="Export to Excel"
          ></i>
        </span>
      </div>
    );
  };
  const header = renderHeader();
  const rows = 25;
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [practiceData, setPracticeData] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState([]);
  const [practices, setPractices] = useState("");
  const [practiceData1, setPracticeData1] = useState([]);
  const [selectedPractice1, setSelectedPractice1] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);

  const [practices1, setPractices1] = useState();
  const [bussinessUnit, setBussinessUnit] = useState([]);

  const [selectedBussinessUnit, setSelectedBussinessUnit] = useState([]);
  const selectedData = selectedBussinessUnit;
  const [loading, setLoading] = useState(false);
  const [contractTermsId, setContractTermsId] = useState("28,26,25");

  const selectedDataVales = selectedData.map((item) => item.value);
  const numbers = selectedDataVales;
  const numbersString = numbers.join(",");
  const [businessUnit, setBusinessUnit] = useState("");

  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [visible, setVisible] = useState(false);
  const [auditTypes, setAuditTypes] = useState(484);
  const [displayState, setDisplayState] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [selectOpt, setselectOpt] = useState([]);
  const [notifyPmData, setNotifyPmData] = useState([]);

  const allocTypes = [
    // {value:"null",label:"ALL"},
    { value: "1145", label: "Projects With Allocations" },
    { value: "1146", label: "Projects Without Allocations" },
    { value: "1147", label: "Complete(Last 90 Days)" },
  ];
  const [selectedDepartments, setSelectedDepartments] = useState([
    { value: "1145", label: "Projects With Allocations" },
    { value: "1146", label: "Projects Without Allocations" },
  ]);

  const fullAccessBu = [
    { label: "DACS", value: 1 },
    { label: "IM&A", value: 3 },
    { label: "QA&TA", value: 4 },
    { label: "SSG", value: 5 },
    { label: "Prolifics Products", value: 6 },
  ];
  const [fullselectedBU, setFullselectedBU] = useState([
    { label: "DACS", value: 1 },
    { label: "IM&A", value: 3 },
    { label: "QA&TA", value: 4 },
    { label: "SSG", value: 5 },
    { label: "Prolifics Products", value: 6 },
  ]);

  const [filterVal, setFilterVal] = useState("");
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoadingState(false);
  };
  const contractTerms = [
    { value: "28", label: "Billable: Billable: Managed Services (BMS)" },
    { value: "27", label: "Billable: Not to Exceed (BNE)" },
    { value: "752", label: "Billable: Opportunity (BO)" },
    { value: "606", label: "Billable: Staff Aug (BSA)" },
    { value: "26", label: "Billable: Time and Materials (BTM)" },
    { value: "25", label: "Billable: Fixed Price (FP)" },
    { value: "1024", label: "Non-billable: Innovation (NB-I)" },
    { value: "612", label: "Non-billable: Client Prep (NB-CP)" },
    { value: "608", label: "Non-billable: Enablement (NB-E)" },
    { value: "609", label: "Non-billable: Non-Utilized (NB-NU)" },
    { value: "610", label: "Non-billable: Shadow (NB-S)" },
    { value: "611", label: "Non-billable: Utilized (NB-U)" },
    { value: "750", label: "Software Resale (SR)" },
  ];
  const [selectedContractTerm, setSelectedContractTerm] = useState([
    { value: "28", label: "Billable: Billable: Managed Services (BMS)" },
    { value: "26", label: "Billable: Time and Materials (BTM)" },
    { value: "25", label: "Billable: Fixed Price (FP)" },
  ]);
  const [searchdataPs, setSearchdataPs] = useState("1145,1146");
  const [searchDataC, setSeachDataC] = useState("6,5,3,8,7,1,2,0");

  const [customersData, setCustomersData] = useState([]);
  const [customersDataNull, setCustomersDataNull] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [selectedCustomersNull, setSelectedCustomersNull] = useState([]);
  const [customer, setCustomer] = useState(
    "128283684,116612093,123894900,63975211,1551287,94389335,93991408,1551294,94455985,129937850,76951255,112914302,54142249,1552214,132397598,109428419,94455988,1552593,36504344,1551362,1551376,26087285,116648754,94854626,114461301,97387326,1551399,1551909,94854623,24192899,1551980,1551910,128598943,128467119,94389332,1551929,59706234,82291358,1551944,2853559,1551521,1551952,125931702,63266772,1552011,94854630,112674610,1552012,130225404,1552737,55697033,111974038,118769156,132397596,4511021,3667922,127640293,96188256,111034788,1552059,94389337,1552068,90339052,85615658,97121507,85546349,129404696,2540692,13177220,117718253,97386586,94455984,1552145,1551986,1552149,1552150,94720314,1551965,2838049,85945151,3284412,97387329,92460160,128226785,125322705,63162798,67129169,41019114,1551753,76951256,95324519,1551877,29304173,1552226,1552189,94455982,94921283,76751379,1552198,38904085,119173217,21664192,1552217,1842057,36244913,96055886,1552240,1552252,76751371,112674609,1956839,97387333,52636336,42255432,120584753,1552276,132397597,41317099,69963531,1552292,1552293,94854625,106471491,1552849,96188257,97926363,1552295,94455981,72223410,24275141,98815571,87271863,2853561,1552344,1552345,117682329,118004584,1552363,94389333,3039808,1552359,132397594,94854627,97653997,98214365,128264227,58638638,112573879,90138245,90138244,90138246,90138243,90138241,97386610,128333765,90339053,1552400,1552375,92659540,29433193,80685749,106003070,114529861,130225403,128699085,1760934,43889231,97121510,1552430,111602229,94389334,124522210,41317098,52300271,121428211,98815570,1552454,99417583,132397595,1552486,1552690,1552313,56952600,1552475,132066226,130723112,97387330,97320365,119409379,123522147,67530124,112275294,97121508,1552531,1552539,1552541,14791169,91467597,1552545,26377379,130723113,122385399,76951259,1552564,2623413"
  );
  const [customerNull, setCustomerNull] = useState(
    "128283684,123894900,63975211,94389335,1551294,76951255,112914302,1552214,132397598,109428419,94455988,1552593,36504344,1551362,116648754,114461301,97387326,1551399,24192899,1551980,1551910,128598943,94389332,1551929,82291358,1551944,2853559,1551521,1551952,125931702,63266772,1552011,94854630,1552012,1552737,111974038,132397596,4511021,3667922,127640293,96188256,1552059,90339052,85615658,85546349,129404696,13177220,1552149,1552150,2838049,85945151,3284412,97387329,125322705,63162798,67129169,41019114,76951256,1551877,29304173,1552189,94921283,76751379,1552198,1842057,36244913,96055886,1552240,1552252,76751371,97387333,120584753,1552276,132397597,41317099,1552293,106471491,96188257,97926363,94455981,24275141,98815571,87271863,1552363,94389333,1552359,132397594,98214365,128264227,58638638,112573879,90138245,90138246,90138241,97386610,90339053,1552375,92659540,29433193,80685749,106003070,114529861,130225403,128699085,43889231,1552430,111602229,94389334,41317098,52300271,121428211,98815570,1552454,99417583,132397595,1552690,56952600,130723112,97320365,1552539,1552541,14791169,91467597,1552545,26377379,2623413"
  );
  const [searchApi, setSearchApi] = useState([]);

  const [data, setData] = useState([{}]);
  const notifyPms = data[0]?.notify_pms?.split("^^");
  let flag = 1;
  const ref = useRef([]);
  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [nullBusiness, setNullBusiness] = useState(
    "18,82,123,207,208,211,212,243"
  );
  const [bus, setBus] = useState("18,82,123,207,208,211,212,243");
  const [nullSelectedBusiness, setNullSelectedBusiness] = useState([]);

  const selectedDataNull = nullSelectedBusiness;

  const selectedDataValesNull = selectedDataNull.map((item) => item.value);
  const numbersNull = selectedDataValesNull;
  const numbersStringsNull = numbersNull.join(",");
  //========================================================
  const pageurl = "http://10.11.12.149:3000/#/executive/practiceDashboard";
  const page_Name = "Delivery Dashboard";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [dataAccess, setDataAccess] = useState([]);
  const getMenus = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const modifiedUrlPath = "/executive/practiceDashboard";
        getUrlPath(modifiedUrlPath);
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
        let getData = resp.data.map((menu) => {
          if (menu.subMenus) {
            menu.subMenus = menu.subMenus.filter(
              (subMenu) =>
                subMenu.display_name !== "Monthly Revenue Trend" &&
                subMenu.display_name !== "Revenue & Margin Variance" &&
                subMenu.display_name !== "Rev. Projections" &&
                subMenu.display_name !== "Project Timesheet (Deprecated)" &&
                subMenu.display_name !== "Financial Plan & Review"
            );
          }
          return menu;
        });
        // setData2(getData);

        getData.forEach((item) => {
          if (item.display_name === textContent) {
            setRoutes([item]);
            sessionStorage.setItem("displayName", item.display_name);
          }
        });
        const revenueForcastSubMenu = getData
          .find((item) => item.display_name === "Delivery")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Project Health"
          );

        const accessLevel = revenueForcastSubMenu
          ? revenueForcastSubMenu.userRoles.includes("690")
            ? 690
            : revenueForcastSubMenu.userRoles.includes("641")
            ? 641
            : revenueForcastSubMenu.userRoles.includes("932")
            ? 932
            : revenueForcastSubMenu.userRoles.includes("46")
            ? 46
            : revenueForcastSubMenu.userRoles.includes("126")
            ? 126
            : revenueForcastSubMenu.userRoles.includes("919")
            ? 919
            : revenueForcastSubMenu.userRoles.includes("686")
            ? 686
            : revenueForcastSubMenu.userRoles.includes("930")
            ? 930
            : revenueForcastSubMenu.userRoles.includes("307") && 307
          : null;

        setDataAccess(accessLevel);

        if (accessLevel == 932 || accessLevel == 126 || accessLevel == 919) {
        }
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
  useEffect(() => {
    getMenus();
  }, []);
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

  useEffect(() => {
    FilterData();
  }, [id]);
  const [formData, setFormData] = useState({});

  const [routes, setRoutes] = useState([]);
  const [acessLevel, setAccessLevel] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Project Health"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  useEffect(() => {}, [selectedPractice[0]?.value]);

  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          practiceId: filterData.practiceId,
          buId: filterData.buId,
          customer: filterData?.customer,
          BU: filterData.BU,
          projectStatus: filterData.projectStatus,
          countryId: filterData.countryId,
          auditType: +filterData.auditType,
          ViewBy: filterData.ViewBy,
          riskImpact: filterData.riskImpact,
          riskOperator: filterData.riskOperator,
        };
      } else {
        return {
          practiceId: "1,3,4,5,6",
          buId: "170,211,123,82,168,207,212,18,213,49,149,208,243",
          customer:
            "128283684,116612093,123894900,63975211,1551287,94389335,93991408,1551294,94455985,129937850,76951255,112914302,54142249,1552214,132397598,109428419,94455988,1552593,36504344,1551362,1551376,26087285,116648754,94854626,114461301,97387326,1551399,1551909,94854623,24192899,1551980,1551910,128598943,128467119,94389332,1551929,59706234,82291358,1551944,2853559,1551521,1551952,125931702,63266772,1552011,94854630,112674610,1552012,130225404,1552737,55697033,111974038,118769156,132397596,4511021,3667922,127640293,96188256,111034788,1552059,94389337,1552068,90339052,85615658,97121507,85546349,129404696,2540692,13177220,117718253,97386586,94455984,1552145,1551986,1552149,1552150,94720314,1551965,2838049,85945151,3284412,97387329,92460160,128226785,125322705,63162798,67129169,41019114,1551753,76951256,95324519,1551877,29304173,1552226,1552189,94455982,94921283,76751379,1552198,38904085,119173217,21664192,1552217,1842057,36244913,96055886,1552240,1552252,76751371,112674609,1956839,97387333,52636336,42255432,120584753,1552276,132397597,41317099,69963531,1552292,1552293,94854625,106471491,1552849,96188257,97926363,1552295,94455981,72223410,24275141,98815571,87271863,2853561,1552344,1552345,117682329,118004584,1552363,94389333,3039808,1552359,132397594,94854627,97653997,98214365,128264227,58638638,112573879,90138245,90138244,90138246,90138243,90138241,97386610,128333765,90339053,1552400,1552375,92659540,29433193,80685749,106003070,114529861,130225403,128699085,1760934,43889231,97121510,1552430,111602229,94389334,124522210,41317098,52300271,121428211,98815570,1552454,99417583,132397595,1552486,1552690,1552313,56952600,1552475,132066226,130723112,97387330,97320365,119409379,123522147,67530124,112275294,97121508,1552531,1552539,1552541,14791169,91467597,1552545,26377379,130723113,122385399,76951259,1552564,2623413",
          BU: "28,26,25",
          projectStatus: "1145,1146",
          countryId: "6,5,3,8,7,1,2,0",
          auditType: 484,
          ViewBy: "1",
          riskImpact: "5",
          riskOperator: "ge",
        };
      }
    });
  }, [filterData]);

  useEffect(() => {
    if (id != null) {
      const updatePractice = practiceData.filter((values) =>
        filterData?.practiceId?.includes(values.value)
      );
      const updatePracticeaccess = fullAccessBu.filter((values) =>
        filterData?.practiceId?.includes(values.value)
      );

      setFullselectedBU(updatePracticeaccess);

      const updateBuids = bussinessUnit.filter(
        (values) => +filterData?.buId?.includes(values.value)
      );
      const updateCustomer = customersData.filter(
        (values) => +filterData?.customer?.includes(values.value)
      );
      const updatecontractTerms = contractTerms.filter((values) =>
        formData.BU?.includes(values.value)
      );

      const updatecountry = country.filter((values) =>
        formData.countryId?.includes(values.value)
      );

      const updateStatus = allocTypes.filter((values) =>
        formData.projectStatus?.includes(values.value)
      );

      setSelectedDepartments(updateStatus);
      setSelectedCountry(updatecountry);
      setSelectedBussinessUnit(updateBuids);
      setSelectedPractice(updatePractice);
      setSelectedCustomers(updateCustomer);
      setSelectedCustomersNull(updateCustomer);

      setSelectedContractTerm(updatecontractTerms);
    }
  }, [
    // fullAccessBu,
    id,
    formData.practiceId,
    formData?.buId,
    formData.countryId,
    formData.customer,
    formData.BU,
    formData.projectStatus,
    filterData?.buId,
    filterData?.customer,
    filterData?.practiceId,
    customersData,
    // practiceData,
    // allocTypes,
    // country,
    bussinessUnit,
    // contractTerms,
  ]);

  useEffect(() => {
    // practice1();
    // practice2();
    getCountries();
  }, []);

  // useEffect(() => {
  //   bussinessUnits();
  // }, [selectedPractice[0]?.value, id]);

  // useEffect(() => {
  //   if (id != null) {
  //     bussinessUnits();
  //   }
  // }, [filterData.buId, id]);

  useEffect(() => {
    if (id == null) {
      CustomerPracticeR();
    }
  }, [selectedBussinessUnit]);

  useEffect(() => {
    if (id !== null) {
      CustomerPracticeRSavedSearch();
    }
  }, [filterData?.buId]);

  useEffect(() => {
    // buPracticeNull();
  }, [selectedPractice1]);

  useEffect(() => {
    if (id !== null) {
      setTimeout(() => {
        handleClickSavedSearch();
      }, 4000);
    }
  }, [filterData]);

  const handleClick = () => {
    let valid = GlobalValidation(ref);

    if (valid == true) {
      setValidationMessage(true);
    }

    if (valid) {
      return;
    }

    // setLoading(false)
    setValidationMessage(false);

    getData();
    // setIsShow(true);
  };
  //=============For Saved Search============
  const handleClickSavedSearch = () => {
    let valid = GlobalValidation(ref);

    if (valid == true) {
      setValidationMessage(true);
    }

    if (valid) {
      return;
    }

    // setLoading(false)
    setValidationMessage(false);

    getData1();
    // setIsShow(true);
  };

  const getData1 = () => {
    setDisplayState(true);
    setLoadingState(true);
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/getPracticeDashboard`,
      data: {
        buId: filterData.buId,
        practiceId: filterData.practiceId,
        customerId: filterData.customer,
        // customerId: selectedCustomer,
        contractTermId: filterData.BU,
        countryId: filterData.countryId,
        prjStatus: filterData.projectStatus,
        toDt: "2023-6-30",
        auditType: +filterData.auditType,
        ViewBy: formData.ViewBy,
        riskImpact: formData.riskImpact,
        riskOperator: formData.riskOperator,
      },
      headers: { "Content-Type": "application/json" },
      // signal: abortController.current.signal,
    }).then((response) => {
      const data = response.data;
      const countryIds = [];
      data.forEach((e) => {
        let countryName = {
          id: e.id,
          value: e.notify_pms,
        };
        countryIds.push(countryName);

        setNotifyPmData(countryIds);
      });
      setData(data);
      setSearchApi(data);
      setTimeout(() => {
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setIsShow(true);
        setLoadingState(false);
      }, 4000);
    });
    setDisplayState(false);
    setLoading(false);
  };

  //============================
  const getData = () => {
    const loaderTime = setTimeout(() => {
      setLoadingState(true);
    }, 2000);
    setDisplayState(true);

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/getPracticeDashboard`,
      data: {
        buId: formData.buId,
        practiceId: formData.practiceId,
        customerId: formData.customer,
        // customerId: selectedCustomer,
        contractTermId: formData.BU,
        countryId: formData.countryId,
        prjStatus: formData.projectStatus,
        toDt: "2023-6-30",
        auditType: +formData.auditType,
        ViewBy: formData.ViewBy,
        riskImpact: formData.riskImpact,
        riskOperator: formData.riskOperator,
      },
      headers: { "Content-Type": "application/json" },
      // signal: abortController.current.signal,
    }).then((response) => {
      const data = response.data;
      const countryIds = [];
      data.forEach((e) => {
        let countryName = {
          id: e.id,
          value: e.notify_pms,
        };
        countryIds.push(countryName);

        setNotifyPmData(countryIds);
      });

      setData(data);
      setSearchApi(data);
      setLoadingState(false);
      clearTimeout(loaderTime);

      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      setIsShow(true);
    });
    setDisplayState(false);
    setLoading(false);
  };

  const getCountries = () => {
    axios
      .get(baseUrl + `/dashboardsms/Dashboard/getCountry`)
      .then((Response) => {
        let countries = [];
        countries.push({ value: 0, label: "Others" });
        let data = Response.data;

        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            countries.push(countryObj);
          });

        //////////------------------------//////////
        setCountry(countries);
        if (id == null) {
          setSelectedCountry(countries);
        }
      })
      .catch((error) => console.log(error));
  };
  const userPractice = () => {
    axios
      .get(
        dataAccess == 126 || dataAccess == 932 || dataAccess == 919
          ? baseUrl + `/ProjectMS/project/getallPractices`
          : baseUrl +
              `/ProjectMS/project/userPractice?loggedUserId=${loggedUserId}`
      )
      .then((res) => {
        const data = res.data;

        let custom = [];

        data.forEach((e) => {
          let dpObj = {
            label: e.group_name,
            value: e.id,
          };
          custom.push(dpObj);
          setPracticeData(custom);
          if (id == null) {
            setSelectedPractice(custom);
          }
        });
      });
  };
  useEffect(() => {
    userPractice();
  }, []);

  const CustomerPracticeR = () => {
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/getCustomersByPractice`,
      data: { buId: numbersString },
    })
      .then((res) => {
        const data = res.data;
        let custom = [];

        data.forEach((e) => {
          let dpObj = {
            label: e.label,
            value: e.id,
          };
          custom.push(dpObj);
        });

        setCustomersData(custom);
        if (id == null) {
          setSelectedCustomers(custom);
        }
      })
      .catch((error) => {});
  };
  //============ For Saved Search===============
  const CustomerPracticeRSavedSearch = () => {
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/getCustomersByPractice`,
      data: { buId: filterData?.buId },
    })
      .then((res) => {
        const data = res.data;
        let custom = [];

        data.forEach((e) => {
          let dpObj = {
            label: e.label,
            value: e.id,
          };
          custom.push(dpObj);
        });

        setCustomersData(custom);
        if (id == null) {
          setSelectedCustomers(custom);
        }
      })
      .catch((error) => {});
  };
  //==============================================
  useEffect(() => {
    postData();
  }, [pid, pmId, projectnames]);

  const byByPractice = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/project/getBUbyPractice?projectId=${selectedPractice
          .map((item) => item.value)
          .join(" ")}`,
    })
      .then((res) => {
        const data = res.data;
        let custom = [];

        data.forEach((e) => {
          let dpObj = {
            label: e.name,
            value: e.id,
          };
          custom.push(dpObj);
        });

        setBussinessUnit(custom);
        if (id === null) {
          setSelectedBussinessUnit(custom);
        }
      })
      .catch((error) => {});
  };
  //===============For Saved Search=====

  const bUByPractice = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/project/getBUbyPractice?projectId=${filterData?.practiceId}`,
    })
      .then((res) => {
        const data = res.data;
        let custom = [];

        data.forEach((e) => {
          let dpObj = {
            label: e.name,
            value: e.id,
          };
          custom.push(dpObj);
        });

        setBussinessUnit(custom);
        if (id === null) {
          setSelectedBussinessUnit(custom);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (id !== null) {
      bUByPractice();
    }
  }, [filterData.practiceId]);
  useEffect(() => {
    if (id == null) {
      byByPractice();
    }
  }, [selectedPractice[0]?.value]);
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) =>
        a[col]?.toLowerCase() > b[col]?.toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...data].sort((a, b) =>
        a[col]?.toLowerCase() < b[col]?.toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("ASC");
    }
  };
  const postData = () => {
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/updateNotifyPm`,
      data: {
        id: pid,
        notifyPm: pmId,
      },
    }).then((res) => {
      const data = res.data;
      const data1 = res?.data?.status?.projectName;
      setProjectnames(data1);

      setPostDataDetails(data);

      setUpdate(true);

      setTimeout(() => {
        setUpdate(false);
      }, 8000);
    });
  };

  const handleFilter = (e) => {
    if (e.target.value == "") {
      setData(searchApi);
    } else {
      const filterResult = searchApi.filter(
        (item) =>
          item.project_name
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.prj_pm_name
            ?.toLowerCase()
            .includes(e.target.value.toLowerCase()) ||
          item.ct_term?.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setData(filterResult);
    }
    setFilterVal(e.target.value);
  };
  const sortnum = (col) => {
    if (order === "DSC") {
      const sorted = [...data].sort((x, y) =>
        // true values first

        x[col] === y[col] ? 0 : x[col] ? -1 : 1
      );
      setData(sorted);
      setOrder("ASC");
    }
    if (order === "ASC") {
      const sorted = [...data].sort((x, y) =>
        x[col] === y[col] ? 0 : x[col] ? 1 : -1
      );
      setData(sorted);
      setOrder("DSC");
    }
  };

  const template = (data) => {
    return (
      <div>
        {acessLevel == "100" ? (
          <div style={{ cursor: "not-allowed" }}>
            {" "}
            <select
              onChange={(e) => {
                setPid(data.prj_id);

                setPmId(e.target.value);
                postData();
              }}
              style={{ pointerEvents: "none" }}
            >
              {getAllNames(data.notify_pms)?.map((val) => (
                <option defaultValue={data[0]} value={val.id}>
                  {val.value}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            {data.notify_pms === null ? (
              ""
            ) : (
              <select
                onChange={(e) => {
                  setPid(data.prj_id);

                  setPmId(e.target.value);
                  postData();
                }}
              >
                {getAllNames(data.notify_pms)?.map((val) => (
                  <option defaultValue={data[0]} value={val.id}>
                    {val.value}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>
    );
  };

  const score = (data) => {
    return <div style={{ textAlign: "right" }}>{data.csat_result}</div>;
  };
  const [getPageData, setGetPageData] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const auditPerPage = getPageData;
  const pagesVisited = pageNumber * auditPerPage;
  let howMany = parseInt(pagesVisited) + parseInt(auditPerPage);
  const displayIssues = data
    .slice(pagesVisited, howMany)

    .map((item, index) => {
      return data.length > 0 ? (
        <tr>
          <td>
            <div className="col-md-12 row">
              <div className="col-md-1">
                {item.var_gm <= 5 ? (
                  <div className="legendContainer align left">
                    <div className="legend green">
                      <div className="legendCircle" title="Risk"></div>
                      <div className="legendTxt"></div>
                    </div>
                  </div>
                ) : item.var_gm >= 10 ? (
                  <div className="legendContainer align left">
                    <div className="legend red">
                      <div className="legendCircle" title="Risk"></div>
                      <div className="legendTxt"></div>
                    </div>
                  </div>
                ) : (
                  <div className="legendContainer align left">
                    <div className="legend amber">
                      <div className="legendCircle" title="Risk"></div>
                      <div className="legendTxt"></div>
                    </div>
                  </div>
                )}
              </div>{" "}
              <div className="col-md-10 ellipsisHealth ">
                <Link
                  style={{ color: "#495057", textDecoration: "underLine" }}
                  title={item.project_name}
                  to={`/project/Overview/:${item.prj_id}`}
                  target="_blank"
                >
                  <span
                    style={{ color: "#495057", textDecoration: "underLine" }}
                  >
                    {item.project_name}
                  </span>
                </Link>
              </div>
            </div>
          </td>
          <td>
            <span title={item.prj_pm_name}>{item.prj_pm_name}</span>
          </td>

          <td>{/* {item.notify_pms} */}</td>
          <td
            style={{ textAlign: "right", backgroundColor: "red" }}
            title={item.prj_compltn}
          >
            {item.prj_compltn}
          </td>
          <td style={{ textAlign: "right" }} title={item.ct_term}>
            {item.ct_term}
          </td>
          <td style={{ textAlign: "right" }} title={item.res_count}>
            {item.res_count}
          </td>
          <td style={{ textAlign: "right" }} title={item.pln_efforts}>
            {item.pln_efforts}
          </td>
          <td style={{ textAlign: "right" }} title={item.eac_efforts}>
            {item.eac_efforts}
          </td>
          <td style={{ textAlign: "right" }} title={item.var_efforts}>
            {item.var_efforts <= 5 ? (
              <div style={{ color: "green" }}>{item.var_efforts}</div>
            ) : item.var_efforts >= 10 ? (
              <div style={{ color: "red" }}>{item.var_efforts}</div>
            ) : (
              <div style={{ color: "#ffbf00" }}>{item.var_efforts}</div>
            )}
          </td>
          <td style={{ textAlign: "right" }} title={item.pln_gm}>
            {item.pln_gm}
          </td>
          <td style={{ textAlign: "right" }} title={item.eac_gm}>
            {item.eac_gm}
          </td>
          <td style={{ textAlign: "right" }} title={item.var_gm}>
            {item.var_gm <= 5 ? (
              <div style={{ color: "green" }}>{item.var_gm}</div>
            ) : item.var_gm >= 10 ? (
              <div style={{ color: "red" }}>{item.var_gm}</div>
            ) : (
              <div style={{ color: "#ffbf00" }}>{item.var_gm}</div>
            )}
          </td>
          <td style={{ textAlign: "right" }} title={item.critical_risks}>
            {item.critical_risks <= 5 ? (
              <div style={{ color: "green" }}>{item.critical_risks}</div>
            ) : item.critical_risks >= 10 ? (
              <div style={{ color: "red" }}>{item.critical_risks}</div>
            ) : (
              <div style={{ color: "#ffbf00" }}>{item.critical_risks}</div>
            )}
          </td>
          <td style={{ textAlign: "right" }} title={item.high_risks}>
            {item.high_risks <= 5 ? (
              <div style={{ color: "green" }}>{item.high_risks}</div>
            ) : item.high_risks >= 10 ? (
              <div style={{ color: "red" }}>{item.high_risks}</div>
            ) : (
              <div style={{ color: "#ffbf00" }}>{item.high_risks}</div>
            )}
          </td>
          <td style={{ textAlign: "right" }} title={item.med_risks}>
            {item.med_risks}
          </td>
          <td style={{ textAlign: "right" }} title={item.low_risks}>
            {item.low_risks}
          </td>
          <td title={item.audit_date}>{item.audit_date}</td>
          <td title={item.audit_result}>{item.audit_result}</td>
          <td title={item.csat_date}>{item.csat_date}</td>
          <td title={item.csat_result}>{item.csat_result}</td>
        </tr>
      ) : (
        <td colSpan="10" align="center">
          No records found
        </td>
      );
    }, []);

  const pageCount = Math.ceil(data.length / auditPerPage);
  const totalRows = data.length;
  const firstrow = pageNumber * auditPerPage + 1;
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const onChangePractice = (e) => {
    const { value } = e.target;
    setGetPageData(value);
  };
  const critical = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f4f8ff"; // Change the condition as needed

    return (
      <div>
        {data.critical_risks <= 5 ? (
          <div
            title={data.critical_risks}
            // style={{ color: "green", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "green",
            }}
          >
            {data.critical_risks}
          </div>
        ) : data.critical_risks >= 10 ? (
          <div
            title={data.critical_risks}
            // style={{ color: "red", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "red",
            }}
          >
            {data.critical_risks}
          </div>
        ) : (
          <div
            title={data.critical_risks}
            // style={{ color: "#ffbf00", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "#ffbf00",
            }}
          >
            {data.critical_risks}
          </div>
        )}
      </div>
    );
  };
  const high = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f4f8ff"; // Change the condition as needed

    return (
      <div>
        {data.high_risks <= 5 ? (
          <div
            title={data.high_risks}
            // style={{ color: "green", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "green",
            }}
          >
            {data.high_risks}
          </div>
        ) : data.high_risks >= 10 ? (
          <div
            title={data.high_risks}
            // style={{ color: "red", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "red",
            }}
          >
            {data.high_risks}
          </div>
        ) : (
          <div
            title={data.high_risks}
            // style={{ color: "#ffbf00", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "#ffbf00",
            }}
          >
            {data.high_risks}
          </div>
        )}
      </div>
    );
  };
  const meduim = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f4f8ff"; // Change the condition as needed

    return (
      <div
        title={data.med_risks}
        // style={{ textAlign: "right" }}
        style={{
          textAlign: "right",
          backgroundColor,
          height: "28px",
          paddingTop: "3px",
        }}
      >
        {data.med_risks}
      </div>
    );
  };
  const low = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f4f8ff"; // Change the condition as needed

    return (
      <div
        title={data.low_risks}
        // style={{ textAlign: "right" }}
        style={{
          textAlign: "right",
          backgroundColor,
          height: "28px",
          paddingTop: "3px",
        }}
      >
        {data.low_risks}
      </div>
    );
  };
  const terms = (data) => {
    return <div title={data.ct_title}>{data.ct_term}</div>;
  };
  const varGm = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f2feff"; // Change the condition as needed

    return (
      <div>
        {data.var_gm <= 5 ? (
          <div
            title={data.var_gm}
            // style={{ color: "green", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "green",
            }}
          >
            {data.var_gm}
          </div>
        ) : data.var_gm >= 10 ? (
          <div
            title={data.var_gm}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "red",
            }}
            // style={{ color: "red", textAlign: "right" }}
          >
            {data.var_gm}
          </div>
        ) : (
          <div
            title={data.var_gm}
            // style={{ color: "#ffbf00", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "#ffbf00",
            }}
          >
            {data.var_gm}
          </div>
        )}
      </div>
    );
  };
  const varColor = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f2f9f1"; // Change the condition as needed

    return (
      <div>
        {data.var_efforts <= 5 ? (
          <div
            title={data.var_efforts}
            // style={{ color: "green", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "green",
            }}
          >
            {data.var_efforts}
          </div>
        ) : data.var_efforts >= 10 ? (
          <div
            title={data.var_efforts}
            // style={{ color: "red", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "red",
            }}
          >
            {data.var_efforts}
          </div>
        ) : (
          <div
            title={data.var_efforts}
            // style={{ color: "#ffbf00", textAlign: "right" }}
            style={{
              textAlign: "right",
              backgroundColor,
              height: "28px",
              paddingTop: "3px",
              color: "#ffbf00",
            }}
          >
            {data.var_efforts}
          </div>
        )}
      </div>
    );
  };
  const comp = (data) => {
    return (
      <div title={data.prj_compltn} style={{ textAlign: "right" }}>
        {data.prj_compltn}
      </div>
    );
  };
  const count = (data) => {
    return (
      <div title={data.res_count} style={{ textAlign: "right" }}>
        {data.res_count}
      </div>
    );
  };

  //function to define row class name for background color
  // Define the function to conditionally set the row class
  const rowClass = (rowData) => {
    // Add your condition here
    // For example, let's highlight rows where age is greater than 35

    return rowData.prj_compltn >= "100"
      ? "highlighted-row"
      : "nonHighlighted-row";
  };
  const efforsClass = (rowData) => {
    return rowData.prj_compltn >= "100" ? "red" : "pink";
  };
  const eac = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f2f9f1"; // Change the condition as needed

    return (
      <div
        title={Math.floor(data.eac_efforts).toLocaleString("en-US") + ".00"}
        // style={{ textAlign: "right" }}
        style={{
          textAlign: "right",
          backgroundColor,
          height: "28px",
          paddingTop: "3px",
        }}
      >
        {/* {data.eac_efforts?.toFixed(2).replace(/\.\d+$/, ".00")} */}
        {Math.floor(data.eac_efforts).toLocaleString("en-US")}.00
      </div>
    );
  };
  const gm = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f2f9f1"; // Change the condition as needed

    return (
      <div
        title={Math.floor(data.pln_efforts).toLocaleString("en-US") + ".00"}
        style={{
          textAlign: "right",
          backgroundColor,
          height: "28px",
          paddingTop: "3px",
        }}
        // style={{ backgroundColor }}
        // className={className}
      >
        {Math.floor(data.pln_efforts).toLocaleString("en-US")}.00
      </div>
    );
  };

  const eac1 = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f2feff"; // Change the condition as needed

    const formattedValue = parseFloat(data.eac_gm).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <div
        title={formattedValue}
        style={{
          textAlign: "right",
          backgroundColor,
          height: "28px",
          paddingTop: "3px",
        }}
      >
        {data.eac_gm === null ? "" : formattedValue}
      </div>
    );
  };
  const gm1 = (data) => {
    const backgroundColor = data.prj_compltn >= "100" ? "#fff4fa" : "#f2feff"; // Change the condition as needed

    return (
      <div
        title={data.pln_gm}
        style={{
          textAlign: "right",
          backgroundColor,
          height: "28px",
          paddingTop: "3px",
        }}
        // style={{ textAlign: "right" }}
      >
        {data.pln_gm}
      </div>
    );
  };
  const pManager = (data) => {
    return (
      <div className="ellipsis" title={data.prj_pm_name}>
        {data.prj_pm_name}
      </div>
    );
  };

  const Legend = (data) => {
    let legendElement = null;

    if (data.var_efforts > 10 || data.var_gm > 10) {
      legendElement = (
        <div
          className="legendContainer align left"
          style={{ marginRight: "10px" }}
        >
          <div className="legend red">
            <div className="legendCircle" title="Risk"></div>
            <div className="legendTxt">
              <Link
                title={data.project_name}
                to={`/project/Overview/:${data.prj_id}`}
                target="_blank"
              >
                <span style={{ textDecoration: "underLine" }}>
                  {data.project_name}
                </span>
              </Link>
            </div>
          </div>
        </div>
      );
    } else if (
      (data.var_efforts >= 5 && data.var_efforts <= 10) ||
      (data.var_gm >= 5 && data.var_gm <= 10)
    ) {
      legendElement = (
        <div className="legendContainer align left">
          <div className="legend amber">
            <div className="legendCircle" title="Risk"></div>
            <div className="legendTxt">
              <Link
                title={data.project_name}
                to={`/project/Overview/:${data.prj_id}`}
                target="_blank"
              >
                <span style={{ textDecoration: "underLine" }}>
                  {data.project_name}
                </span>
              </Link>
            </div>
          </div>
        </div>
      );
    } else {
      legendElement = (
        <div className="legendContainer align left">
          <div className="legend green">
            <div className="legendCircle" title="Risk"></div>
            <div className="legendTxt">
              <Link
                title={data.project_name}
                to={`/project/Overview/:${data.prj_id}`}
                target="_blank"
              >
                <span style={{ textDecoration: "underLine" }}>
                  {data.project_name}
                </span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        {legendElement}
        {/* <p style={{ color }}>
          
          <Link
            title={data.project_name}
            to={`/project/Overview/:${data.prj_id}`}
            target="_blank"
          >
            {data.project_name}
        </p> */}
      </>
    );
  };

  const HelpPDFName = "ProjectHealth.pdf";
  const Headername = "Project Health help";

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    const allValues = allOptions.map((item) => item.value);

    if (
      selectedValues.length !== 0 &&
      selectedValues.length === allValues.length
    ) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  return (
    <div>
      {validationMessage ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Please select the valid values for highlighted
            fields{" "}
          </span>
        </div>
      ) : (
        ""
      )}
      {update ? (
        <div className="statusMsg success">
          <span>NotifyPM updated successfully for {projectnames}</span>
        </div>
      ) : (
        ""
      )}
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Search created successfully.
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Project Health</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      <div className="group customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            {dataAccess == 932 || dataAccess == 919 || dataAccess == 126 ? (
              <div className=" col-md-4 mb-2 className">
                <div className="form-group row multiselect">
                  <label className="col-5" htmlFor="practice">
                    Practice <span className=" error-text"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className=" multiselect col-6"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      id="practiceId"
                      options={fullAccessBu}
                      hasSelectAll={true}
                      value={fullselectedBU}
                      disabled={false}
                      onChange={(e) => {
                        setFullselectedBU(e);
                        let filterPractice = [];
                        e.forEach((d) => {
                          filterPractice.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["practiceId"]: filterPractice.toString(),
                        }));
                        setPractices(filterPractice.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className=" col-md-4 mb-2 className">
                <div className="form-group row multiselect">
                  <label className="col-5" htmlFor="practice">
                    Practice <span className=" error-text"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className=" multiselect col-6"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      id="practiceId"
                      options={practiceData}
                      hasSelectAll={true}
                      value={selectedPractice}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedPractice(e);
                        let filterPractice = [];
                        e.forEach((d) => {
                          filterPractice.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["practiceId"]: filterPractice.toString(),
                        }));
                        setPractices(filterPractice.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="bu">
                  BU <span className=" error-text"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className=" multiselect col-6"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="buId"
                    options={bussinessUnit}
                    hasSelectAll={true}
                    value={selectedBussinessUnit}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedBussinessUnit(e);
                      let filterB = [];
                      e.forEach((d) => {
                        filterB.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["buId"]: filterB.toString(),
                      }));
                      setBusinessUnit(filterB.toString());
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customer">
                  Customer <span className=" error-text"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="multiselect col-6"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="customer"
                    options={customersData}
                    hasSelectAll={true}
                    value={selectedCustomers}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCustomers(e);
                      let filterB = [];
                      e.forEach((d) => {
                        filterB.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["customer"]: filterB.toString(),
                      }));
                      setCustomer(filterB.toString());
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="contractTerms">
                  Contract Terms
                  <span className=" error-text"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className=" multiselect col-6"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="BU"
                    options={contractTerms}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedContractTerm}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedContractTerm(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });
                      setContractTermsId(filteredValues.toString());
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["BU"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Country <span className=" error-text"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="multiselect col-6"
                  ref={(ele) => {
                    ref.current[4] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="countryId"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["countryId"]: filteredCountry.toString(),
                      }));
                      setSeachDataC(filteredCountry.toString());
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectStatus">
                  Allocations
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className=" multiselect col-6"
                  // ref={(ele) => {
                  //   ref.current[4] = ele;
                  // }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="projectStatus"
                    options={allocTypes}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedDepartments}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedDepartments(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["projectStatus"]: filteredValues.toString(),
                      }));
                      setSearchdataPs(filteredValues.toString());
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="auditType">
                  Audit Type
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="auditType"
                    onChange={(e) => {
                      setAuditTypes(e.target.value);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["auditType"]: e.target.value,
                      }));
                    }}
                    value={formData.auditType}
                  >
                    <option value="484"> &lt;&lt;ALL &gt;&gt;</option>
                    <option value="1285">CMMI</option>
                    <option value="478">IQA</option>
                    <option value="1272">ISMS</option>
                    <option value="1284">ISO</option>
                    <option value="477">QCR</option>
                  </select>
                </div>
              </div>
            </div>

            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="prjStatus">
                  Project Status
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="prjStatus"
                    onChange={(e) => {
                      const selectedStatus = e.target.value;
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["ViewBy"]: selectedStatus,
                      }));
                    }}
                    value={formData.ViewBy}
                  >
                    <option value="-1"> &lt;&lt;ALL &gt;&gt;</option>
                    <option value="1">Active</option>
                    <option value="2">InActive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="riskImpact">
                  Risk Impact
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-3">
                  <select
                    id="operator"
                    onChange={(e) => {
                      const selectedOperator = e.target.value;
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["riskOperator"]: selectedOperator,
                      }));
                    }}
                    value={formData.riskOperator}
                  >
                    <option value="ge">&ge;</option>
                    <option value="le">&le;</option>
                    <option value="g">&gt;</option>
                    <option value="l">&lt;</option>
                    <option value="eq">=</option>
                  </select>
                </div>
                <div className="col-3">
                  <select
                    id="prjStatus"
                    onChange={(e) => {
                      const selectedRiskImpact = e.target.value;
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["riskImpact"]: selectedRiskImpact,
                      }));
                    }}
                    value={formData.riskImpact}
                  >
                    <option value="1">{"1"}</option>
                    <option value="2">{"2"}</option>
                    <option value="3">{"3"}</option>
                    <option value="4">{"4"}</option>
                    <option value="5">{"5"}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <center>
            <button
              type="button"
              className="btn btn-primary mb-3"
              title="Search"
              onClick={() => {
                handleClick();
                setIsShow(false);
              }}
            >
              <FaSearch /> Search{" "}
            </button>
          </center>
        </CCollapse>

        <div></div>
        <div className="group customCard">
          {isShow == true ? (
            <div>
              <div className="legendContainer">
                <span className="font-weight-bold">Efforts/GM Variance :</span>
                <div className="legend red">
                  <div className="legendTxt t">10 or Above 10</div>
                </div>
                <div className="legend amber">
                  <div className="legendTxt t">Btw 5 and 10 </div>
                </div>
                <div className="legend green">
                  <div className="legendTxt t">5 or below 5</div>
                </div>
                <div className="legendContainer">
                  <span className="font-weight-bold">Risk :</span>

                  <div className="legend red">
                    <div className="legendCircle " title="New"></div>
                    <div className="legendTxt">
                      Critical above 1 or High above 5
                    </div>
                  </div>
                  <div className="legend amber">
                    <div className="legendCircle" title="In Progress"></div>
                    <div className="legendTxt">2-5 High or 1 Critical </div>
                  </div>
                  <div className="legend green">
                    <div className="legendCircle " title="Completed"></div>
                    <div className="legendTxt">
                      No Critical and High below 2{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="primeReactTable projectHealthTable darkHeader toHead ">
                <DataTable
                  value={data}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSort}
                  editMode="row"
                  dataKey="id"
                  onFilter={(e) => setFilters(e.filters)}
                  rows={25}
                  rowsPerPageOptions={[10, 25, 50]}
                  filters={filters}
                  header={header}
                  showGridlines
                  paginator
                  paginationPerPage={5}
                  headerColumnGroup={headerGroup}
                  paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                  currentPageReportTemplate="{first} to {last} of {totalRecords}"
                  responsiveLayout="scroll"
                  rowClassName={rowClass}
                >
                  <Column
                    field="project_name"
                    header={() => {
                      return (
                        <div style={{ backgroundColor: "pink" }}>
                          project_name
                        </div>
                      );
                    }}
                    sortable
                    // header="Project Name"
                    body={Legend}
                  ></Column>
                  <Column
                    field="prj_pm_name"
                    header="Primary Manager"
                    body={pManager}
                    sortable
                  ></Column>
                  <Column
                    field="notify_pms"
                    header="Notify PM"
                    body={template}
                  ></Column>
                  <Column
                    // rowClassName={rowClass}
                    field="prj_compltn"
                    style={{ alignItems: "center" }}
                    body={comp}
                    header="Comp(%)"
                  ></Column>
                  <Column field="ct_term" header="Terms" body={terms}></Column>
                  <Column
                    field="res_count"
                    header="Count"
                    body={count}
                  ></Column>
                  <Column
                    field="pln_efforts"
                    // className={efforsClass}
                    header="Plan"
                    body={gm}
                    // className="pln_efforts"
                    // style={{ backgroundColor: "#f2f9f1" }}
                  ></Column>
                  <Column
                    field="eac_efforts"
                    header="EAC"
                    className="complete"
                    body={eac}
                    // style={{ backgroundColor: "#f2f9f1" }}
                  ></Column>
                  <Column
                    field="var_efforts"
                    // style={{ backgroundColor: "#f2f9f1" }}
                    className="complete"
                    header={<>"Var(%)"</>}
                    body={varColor}
                  ></Column>
                  <Column
                    field="pln_gm"
                    header="Plan"
                    body={gm1}
                    className="gmRows"
                    // style={{ backgroundColor: "#f2feff" }}
                  ></Column>
                  <Column
                    field="eac_gm"
                    header="EAC"
                    className="gmRows"
                    body={eac1}
                    // style={{ backgroundColor: "#f2feff" }}
                  ></Column>
                  <Column
                    field="var_gm"
                    className="gmRows"
                    header={<>"Var(%)"</>}
                    body={varGm}
                    // style={{ backgroundColor: "#f2feff" }}
                  ></Column>
                  <Column
                    field="critical_risks"
                    header="Crt"
                    body={critical}
                    className="riskRows"
                    // style={{ backgroundColor: "#f4f8ff" }}
                  ></Column>
                  <Column
                    field="high_risks"
                    header="High"
                    body={high}
                    // style={{ backgroundColor: "#f4f8ff" }}
                    className="riskRows"
                  ></Column>
                  <Column
                    field="med_risks"
                    header="Med"
                    body={meduim}
                    // style={{ backgroundColor: "#f4f8ff" }}
                    className="riskRows"
                  ></Column>
                  <Column
                    field="low_risks"
                    header="Low"
                    body={low}
                    // style={{ backgroundColor: "#f4f8ff" }}
                    className="riskRows"
                  ></Column>
                  <Column
                    field="audit_date"
                    header="Month"
                    style={{ textAlign: "right" }}
                  ></Column>
                  <Column
                    field="audit_result"
                    header="Res"
                    style={{ textAlign: "right" }}
                  ></Column>
                  <Column
                    field="csat_date"
                    header="Month"
                    style={{ textAlign: "right" }}
                  ></Column>
                  <Column
                    field="csat_result"
                    header="Score"
                    style={{ textAlign: "right" }}
                    body={score}
                  ></Column>
                </DataTable>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {loadingState ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}
export default ProjectHealth;
