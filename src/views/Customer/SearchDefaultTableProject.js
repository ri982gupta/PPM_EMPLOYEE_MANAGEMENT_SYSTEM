import React, { useState, useEffect } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import jsPDF from "jspdf";
import { CModal } from "@coreui/react";
import { makeStyles } from "@material-ui/core";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
// import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { CModalTitle } from "@coreui/react";
import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
import { AiOutlineFileSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import { CCollapse, CListGroup } from "@coreui/react";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import { AiOutlineLeftSquare, AiOutlineRightSquare } from "react-icons/ai";
import { environment } from "../../environments/environment";
import { SlExclamation } from "react-icons/sl";
import Loader from "../Loader/Loader";
// import StatusPlannedActivities from "../ProjectComponent/StatusPlannedActivities";
import ProjectStatusPlannedActivities from "../ProjectComponent/ProjectStatusPlannedActivities";
import ProjectStatusAccomplishments from "../ProjectComponent/ProjectStatusAccomplishments";
// import StatusAccomplishment from "../ProjectComponent/StatusAccomplishment";
import { FaDownload, FaChevronCircleRight } from "react-icons/fa";
import axios from "axios";
import './SearchDefaultTableProject.scss'
// import "./Search.scss";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaCaretDown,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import moment from "moment/moment";
import { Column } from "primereact/column";
// import ProjectStatusCellRenderTable from "./ProjectStatusCellRenderTable";
// import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
function SearchDefaultTable(props) {
  const {
    data,
    SetData,
    pid,
    deptarr,
    deleteid,
    setDeleteId,
    checkboxSelect,
    setCheckboxSelect,
    handleClick,
    searchapidata,
    displayState,
    setDisplayState,
    linkColumns,
    linkColumnsRoutes,
    maxHeight1
  } = props;
  const baseUrl = environment.baseUrl;

  const [mainData, setMainData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -148) + "px"
  );


  useEffect(() => {
    if (data.length > 0) {
      setHeaderData(data[0]);
      // setHeaderData(data.splice(1));

      let dtt = [];
      let headDt = data[0];

      Object.keys(headDt).forEach((d) => {
        d != "StatusId" &&
          // ? dtt.push({ title: "cus", dataKey: d })
          dtt.push({ title: headDt[d], dataKey: d });
      });

      setExportColumns(dtt);
    }
  }, [data]);

  const [filterVal, setFilterVal] = useState("");
  const rows = 25;
  const [open, setOpen] = useState(false);
  const [displayTable, setDisplayTable] = useState(null);
  const [order, setOrder] = useState("ASC");
  const [getData, setGetData] = useState(10);
  const [currentItem, setCurrentItem] = useState(0);
  const [pageCount, setpageCount] = useState(1);
  const [itemOffSet, setItemOffSet] = useState(0);
  const [diaplayStateView, setDisplayStateView] = useState([]);
  const itemPerPage = getData;
  const [link, setLink] = useState([]);
  const [display, setDisplay] = useState(false);
  const id = "12";
  const [projectId, setPRojectId] = useState();
  // const projectId = data.id;
  const [visibleA, setVisibleA] = useState(true);
  const [visibleB, setVisibleB] = useState(true);
  const [cheveronIconB, setCheveronIconB] = useState(FaChevronCircleDown);
  const [visibleD, setVisibleD] = useState(true);
  const [cheveronIconD, setCheveronIconD] = useState(FaChevronCircleDown);
  const [cheveronIconA, setCheveronIconA] = useState(FaChevronCircleDown);
  const [visibleC, setVisibleC] = useState(true);
  const [cheveronIconC, setCheveronIconC] = useState(FaChevronCircleDown);
  const [visibleE, setVisibleE] = useState(true);
  const [cheveronIconE, setCheveronIconE] = useState(FaChevronCircleDown);
  const [visibleF, setVisibleF] = useState(true);
  const [cheveronIconF, setCheveronIconF] = useState(FaChevronCircleDown);
  const [finalRow, setFinalRow] = useState(itemPerPage);
  const [dataRisks, setDataRisks] = useState([]);
  var nf = new Intl.NumberFormat();
  const [pdfData, setPdfData] = useState([]);
  const handleChange = (e) => {
    setCheckboxSelect(e.value);
  };
  const [dataAccomplish, setDataAccomplish] = useState([]);
  const [dataActivities, setDataActivities] = useState([]);
  const [dataIssues, setDataIssues] = useState([]);
  const [dataDependency, setDataDependency] = useState([]);
  const [dataScope, setDataScope] = useState([]);
  const [dataEvent, setDataEvent] = useState([]);
  const [dataKpi, setDataKpi] = useState([]);
  const totalRows = data.length;

  const Firstrow = itemOffSet + 1;
  const [datainfo, setDatainfo] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const dates = {
    fromDate: moment().format("YYYY-MM-DD"),
    toDate: moment().add("days", 6).format("YYYY-MM-DD"),
  };

  const [key, setKey] = useState("");
  useEffect(() => {
    setKey(projectId ? projectId : "");
  }, [projectId]);

  const [key1, setKey1] = useState("");
  useEffect(() => {
    setKey1(projectId ? projectId : "");
  }, [projectId]);

  const datesPlaned = {
    fromDatePlan: moment().startOf("week").add("days", 8).format("YYYY-MM-DD"),
    toDatePlan: moment().startOf("week").add("days", 14).format("YYYY-MM-DD"),
  };
  const [dt, setDt] = useState(dates);
  const [dtP, setDtP] = useState(datesPlaned);
  const viewHandler = (id) => {
    setPRojectId(id);
  };
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();
  useEffect(() => {
    getDetailsInfo();
    getDataRisks();
    // getDataActivities();
    getDataIssues();
    getDataDependency();
    getDataScope();
    getDataEvents();
    getDataKpi();
    // getDataAccomplishments();
  }, [projectId]);

  const getDetailsInfo = (props) => {
    // axios.get(`/ProjectMS/project/projectinfo?ProjectId=${1826476}`)
    setDisplayStateView(true);
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/project/projectinfo?ProjectId=${projectId}`,
    })
      .then((res) => {
        const GetData = res.data;
        data.length > 0 && setDatainfo(GetData);
        setDisplayState(true);
        setDisplayStateView(false);
        // setLoader(true)
        // setTimeout(() => {
        //     setLoader(false)
        // }, 100);
      })
      .catch((error) => {});
  };

  require("jspdf-autotable");

  const exportPdf = () => {
    if (checkboxSelect && checkboxSelect.length > 0) {
      print();
    } else {
      // Add your validation or error handling logic here
      setOpen(true);
    }
    // print();
  };

  const print = () => {
    const pdf = new jsPDF("p", "pt", "a4");
    // Name
    // Manager
    // Bussiness Unit
    // Customer
    // Delivery Manager
    // Billing Model
    // Project Type
    // Exec Meth
    // Pln St Date
    // Pln End date
    // Status
    // Team Size
    const columns = [
      { header: "Name", dataKey: "project_name" },
      { header: "Manager", dataKey: "prj_manager" },
      { header: "Business Unit", dataKey: "business_unit" },
      { header: "Delivery Manager", dataKey: "del_manager" },
      { header: "Billing Model", dataKey: "ct_title" },
      { header: "Project Type", dataKey: "category" },
      { header: "Exec Meth", dataKey: "prj_exe" },
      { header: "Pln St Date", dataKey: "planned_start_dt" },
      { header: "Pln End date", dataKey: "pln_end_dt" },
      { header: "Status", dataKey: "prj_status" },
      { header: "Team Size", dataKey: "team_size" },
      // { header: "", dataKey: "category" },

      // { header: "Category", dataKey: "category" },
      // { header: "Project Stage", dataKey: "prj_stage" },
      // { header: "Team Size", dataKey: "team_size" },
      // Add more column definitions as needed
    ];

    let rows = checkboxSelect.map((d) => {
      return {
        project_name: d.project_name,
        prj_manager: d.prj_manager,
        business_unit: d.business_unit,
        del_manager: d.del_manager,
        ct_title: d.ct_title,
        category: d.category,
        prj_exe: d.prj_exe,
        planned_start_dt: d.planned_start_dt,
        pln_end_dt: d.pln_end_dt,
        prj_status: d.prj_status,
        team_size: d.team_size,

        // Add more data keys as needed
      };
    });

    const columnWidths = [
      30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
    ]; // Set the widths of the columns here

    pdf.text(235, 40, "Project Status Report");
    pdf.autoTable(columns, rows, {
      startY: 65,
      theme: "grid",
      styles: {
        // Styles configuration
      },
      headStyles: {
        // Header styles configuration
      },
      alternateRowStyles: {
        // Alternate row styles configuration
      },
      rowStyles: {
        // Row styles configuration
      },
      tableLineColor: [0, 0, 0],
      columnStyles: {
        // Column styles configuration
      },
    });

    pdf.save("Project Status Report");
  };

  const getDataRisks = () => {
    setDisplayStateView(true);

    // axios.get(`/ProjectMS/project/risks?pid=${1826476}`)
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/project/risks?pid=${projectId}`,
    })
      .then((res) => {
        const GetData = res.data;
        let headerData = [
          {
            riskName: "Risk Name",
            riskType: "Risk Type",
            riskSource: "Risk Source",
            riskImpact: "Risk Impact",
            probabOcc: "Probability of Occurrence",
            riskValue: "Risk Value",
            assignedTo: "Assigned To",
            riskOccurred: "Risk Occurred",
            riskStatus: "Risk Status",
            occuredDate: "Occurred Date",
            createdBy: "Created By",
          },
        ];
        setDataRisks(headerData.concat(GetData));
        setDisplayStateView(false);
      })
      .catch((error) => {});
  };

  const getDataIssues = () => {
    // axios.get(`/ProjectMS/project/issue?pid=1826476`)
    setDisplayStateView(true);

    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/project/issue?pid=${projectId}`,
    })
      .then((res) => {
        let headerData = [
          {
            issueName: "Issue Name",
            criticality: "Criticality",
            status: "Status",
            dueDate: "Due Date",
            issueSource: "Issue Source",
            assignedTo: "Assigned To",
            rcaDone: "RCA Done",
            createdBy: "Created By",
            comments: "Comments",
          },
        ];
        const GetData = res.data;
        setDataIssues(headerData.concat(GetData));
        setDisplayStateView(false);
      })
      .catch((error) => {});
  };

  const getDataDependency = () => {
    // axios.get(`/ProjectMS/project/dependency?pid=${1826476}`)
    setDisplayStateView(true);

    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/project/dependency?pid=${projectId}`,
    })
      .then((res) => {
        let headerData = [
          {
            dependency: "Dependency / Constraints",
            type: "Type",
            priority: "Priority",
            raisedBy: "Raised By",
            raisedDate: "Raised Date",
            targetDate: "Target Date",
            assignedTo: "Assigned To",
            phaseAffected: "Phase / Area affected",
            Status: "Status",
          },
        ];
        const GetData = res.data;
        setDataDependency(headerData.concat(GetData));
        setDisplayStateView(false);
      })
      .catch((error) => {});
  };

  const getDataScope = () => {
    // axios.get( `/ProjectMS/project/scopechanges?pid=${1826476}`)
    setDisplayStateView(true);

    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/project/scopechanges?pid=${projectId}`,
    })
      .then((res) => {
        let headerData = [
          {
            description: "Description of Change",
            change_req_date: "Change Requested Date",
            financial_impact: "Financial Impact",
          },
        ];
        const GetData = res.data;

        setDataScope(headerData.concat(GetData));
        setDisplayStateView(false);
      })
      .catch((error) => {});
  };

  const getDataEvents = () => {
    setDisplayStateView(true);

    // axios.get(`/ProjectMS/project/events?pid=${1826476}`)
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/project/events?pid=${projectId}`,
    })
      .then((res) => {
        let headerData = [
          { event: "Events", date: "Date", comments: "Comments" },
        ];
        const GetData = res.data;
        setDataEvent(headerData.concat(GetData));
        setDisplayStateView(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  useEffect(() => {}, [data.id]);
  const ProjectStatusReportDetailsss = () => {};

  const LinkTemplate = (data) => {
    // let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        {/* <Link target="_blank" to={rou[0] + ":" + data[rou[1]]}>
          {data[linkColumns[0]]}
        </Link> */}
        <div style={{ marginLeft: "15%" }}>
          <button
            className="btn btn-primary"
            //   onClick = (data) => {}
            // onClick={ getDetailsInfo}
            onClick={() => {
              setDisplayState(true);
              viewHandler(data.id);
              setVisibleA(true);
              setVisibleC(true);
              setVisibleD(true);
              setVisibleE(true);
              setVisibleF(true);
              setVisibleB(true);

              setDisplay(true);
              // setDt("");
              // setPRojectId(deleteid);
              // setDeleteId();
              setTimeout(() => {
                window.scrollTo({ top: 450, behavior: "smooth" });
              }, 1000);
            }}
          >
            View
          </button>
        </div>
        {/* </div> */}
      </>
    );
  };

  const LinkTemplateAction = (data) => {
    // let rou = linkColumnsRoutes[1]?.split(":");
    return (
      <>
        <div style={{ textAlign: "center" }}>
          <input type="checkbox"></input>
        </div>
      </>
    );
  };
  const LinkTemplateCheck = (data) => {
    return (
      <>
        {/* <div> */}
        {data.prj_health === "On Schedule" ? (
          <div align="center" style={{ marginLeft: "45%" }}>
            <div className="legendContainer" align="center">
              <div className="legend  green" title="On Schedule">
                <div className="legendCircle"></div>
                <div className="legendTxt"></div>
              </div>
            </div>
          </div>
        ) : data.prj_health == "Serious Issues" ? (
          <div
            className="legendContainer"
            align="center"
            style={{ marginLeft: "45%" }}
          >
            <div className="legend red">
              <div className="legendCircle" title="Serious Issues"></div>
              <div className="legendTxt"></div>
            </div>
          </div>
        ) : data.prj_health === null ? (
          <div
            className="legendContainer"
            align="center"
            style={{ marginLeft: "45%" }}
          >
            <div className="legend black">
              <div className="legendCircle" title="No Health Info"></div>
              <div className="legendTxt"></div>
            </div>
          </div>
        ) : (
          data.prj_health === "Potential Issues" && (
            <div
              className="legendContainer"
              align="center"
              style={{ marginLeft: "45%" }}
            >
              <div className="legend amber">
                <div className="legendCircle" title="Potential Issues"></div>
                <div className="legendTxt"></div>
              </div>
            </div>
          )
        )}
      </>
    );
  };

  const LinkTemplateLink = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");

    setLink(data.id);
    link;
    return (
      <>
        <Link
          title={data.project_name}
          to={`/project/Overview/:${data.id}`}
          target="_blank"
        >
          {data.project_name}
        </Link>
      </>
    );
  };
  const LinkTemplateManager = (data) => {
    return <span title={data.prj_manager}>{data.prj_manager}</span>;
  };
  const LinkTemplateBu = (data) => {
    return <span title={data.business_unit}>{data.business_unit}</span>;
  };
  const LinkTemplateCus = (data) => {
    return <span title={data.customer}>{data.customer}</span>;
  };
  const LinkTemplateMg = (data) => {
    return <span title={data.del_manager}>{data.del_manager}</span>;
  };
  const LinkBillingPtype = (data) => {
    return <span title={data.category}>{data.category}</span>;
  };
  const LinkBillingMeth = (data) => {
    return <span title={data.prj_exe}>{data.prj_exe}</span>;
  };
  const LinkBillingStdate = (data) => {
    return <span title={data.planned_start_dt}> {data.planned_start_dt}</span>;
  };
  const EndDateStatus = (data) => {
    return <span title={data.prj_status}>{data.prj_status}</span>;
  };
  const LinkBillingModel = (data) => {
    return (
      <div title={data.ct_title} tyle={{ textAlign: "center" }}>
        {data.ct_title}
      </div>
    );
  };
  const LinkTeamSize = (data) => {
    return (
      <div title={data.team_size} style={{ textAlign: "right" }}>
        {data.team_size}
      </div>
    );
  };
  const EndDate = (data) => {
    return (
      <div title={data.planned_end_dt} style={{ textAlign: "right" }}>
        {data.planned_end_dt}
      </div>
    );
  };
  const Manager = (data) => {
    return <div title={data.prj_manager}>{data.prj_manager}</div>;
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "Analytics"
            ? LinkTemplate
            : col == "checkbox"
            ? LinkTemplateAction
            : col == "project_name"
            ? LinkTemplateLink
            : col == "prj_health"
            ? LinkTemplateCheck
            : col == "ct_title"
            ? LinkBillingModel
            : col == "team_size"
            ? LinkTeamSize
            : col == "pln_end_dt"
            ? EndDate
            : col == "prj_manager" && Manager
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  const addHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate).add("days", 8).format("YYYY-MM-DD"),
    }));

    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).add("days", 8).format("YYYY-MM-DD"),
    }));
  };

  const subtracHandler = () => {
    setDt((prev) => ({
      ...prev,
      ["fromDate"]: moment(dt.fromDate)
        .subtract("days", 7)
        .format("YYYY-MM-DD"),
    }));

    setDt((prev) => ({
      ...prev,
      ["toDate"]: moment(dt.toDate).subtract("days", 7).format("YYYY-MM-DD"),
    }));
  };

  const addHandlerPlan = () => {
    setDtP((prev) => ({
      ...prev,
      ["fromDatePlan"]: moment(dtP.fromDatePlan)
        .add("days", 8)
        .format("YYYY-MM-DD"),
    }));

    setDtP((prev) => ({
      ...prev,
      ["toDatePlan"]: moment(dtP.fromDatePlan)
        .add("days", 8)
        .format("YYYY-MM-DD"),
    }));
  };

  const subtracHandlerPlan = () => {
    setDtP((prev) => ({
      ...prev,
      ["fromDatePlan"]: moment(dtP.fromDatePlan)
        .subtract("days", 8)
        .format("YYYY-MM-DD"),
    }));

    setDtP((prev) => ({
      ...prev,
      ["toDatePlan"]: moment(dtP.toDatePlan)
        .subtract("days", 8)
        .format("YYYY-MM-DD"),
    }));
  };

  const getDataKpi = () => {
    setDisplayStateView(true);

    // axios.get(`/ProjectMS/project/kpidata?ProjectId=${1826476}&fromDate=01-Feb-2017&toDate=31-Dec-2018`)
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/project/kpidata?ProjectId=${projectId}&fromDate=2009-02-01&toDate=2024-12-31`,
    })
      .then((res) => {
        const GetData = res.data;

        setDataKpi(GetData);
        setDisplayStateView(false);

        setTimeout(() => {
          //    setLoader(false)
        }, 100);
      })
      .catch((error) => {});
  };

  // Assuming the data is stored in an array called 'data'
  const updatedData = data.filter((item, index) => index !== 0);

  // 'updatedData' will contain the data with the element at index 0 removed

  function PdfPopup({ open, setOpen }) {
    return (
      <div className="reviewLogDeletePopUp">
        <CModal
          size="sm"
          visible={open}
          // className="reviewLogDeletePopUp"
          onClose={() => setOpen(false)}
        >
          <CModalHeader className="">
            <CModalTitle>
              {/* <span className="">Save Targets</span> */}
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            Please select atleast one project
            <div className="row" style={{ marginTop: "10px" }}>
              <button
                style={{ marginLeft: "95px" }}
                type="Ok"
                className="btn btn-primary col-2"
                onClick={() => {
                  setOpen(false);
                }}
              >
                {/* <i className="fa fa-plus" aria-hidden="true"></i> */}
                <span style={{ paddingLeft: "6px" }}>Ok</span>
              </button>
            </div>
          </CModalBody>
        </CModal>
        {/* </Draggable> */}
      </div>
    );
  }

  return (
    <div>
      <div className="legendContainer">
        <span className="font-weight-bold">Project Health : </span>

        <div className="legend green">
          <div className="legendCircle "></div>
          <div className="legendTxt">On Schedule</div>
        </div>
        <div className="legend amber">
          <div className="legendCircle center"></div>
          <div className="legendTxt">Potential Issues </div>
        </div>
        <div className="legend red">
          <div className="legendCircle "></div>
          <div className="legendTxt">Serious Issues </div>
        </div>
        <div className="legend black">
          <div className="legendCircle "></div>
          <div className="legendTxt">No Health Info </div>
        </div>
      </div>
      <div>
        <div></div>
        <button
          className="btn btn-primary"
          style={{ marginLeft: "88%", marginBottom: "0.5%" }}
          onClick={exportPdf}
        >
          <FaDownload />
          Download as PDF
        </button>
        <div className="group customCard projectStatusReport">
          {/* <CellRendererPrimeReactDataTable
            data={updatedData}
            rows={rows}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
          /> */}

          <DataTable
            className="darkHeader" /////customerEngament
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            value={updatedData}
            paginator
            selection={checkboxSelect}
            filters={filters}
            rows={25}
            rowsPerPageOptions={[10, 25, 50]}
            // tableStyle={{ minWidth: "50rem" }}
            selectAll={true}
            // rows={10}
            showGridlines
            pagination
            paginationPerPage={5}
            header={header}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            responsiveLayout="scroll"
            onSelectionChange={(e) => handleChange(e)}
          >
            <Column
              // selectionMode="multiple"
              alignHeader={"center"}
              style={{ textAlign: "center" }}
              selectionMode={data?.length > 0 ? "multiple" : ""}
            />
            <Column
              field="Analytics"
              header=" Analytics"
              body={LinkTemplate}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="Health"
              header=" Health"
              body={LinkTemplateCheck}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="Name"
              header=" Name"
              body={LinkTemplateLink}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="prj_manager"
              header=" Manager"
              body={LinkTemplateManager}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="Business Unit"
              header=" Business Unit"
              body={LinkTemplateBu}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="Customer"
              header=" Customer"
              body={LinkTemplateCus}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="Delivery Manager"
              header=" Delivery Manager"
              body={LinkTemplateMg}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="Billing Model"
              header=" Billing Model"
              body={LinkBillingModel}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="Project Type"
              header=" Project Type"
              body={LinkBillingPtype}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="Exec Meth"
              header=" Exec Meth"
              body={LinkBillingMeth}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="Pln St Date"
              header=" Pln St Date"
              body={LinkBillingStdate}
              alignHeader={"center"}
              sortable
            ></Column>
            <Column
              field="End date"
              header=" Pln End date"
              body={EndDate}
              alignHeader={"center"}
              style={{ textAlign: "left" }}
              sortable
            ></Column>
            <Column
              field="Status"
              header=" Status"
              body={EndDateStatus}
              alignHeader={"center"}
              style={{ textAlign: "left" }}
              sortable
            ></Column>
            <Column
              // field="Team Size"
              header=" Team Size"
              body={LinkTeamSize}
              alignHeader={"center"}
            ></Column>
          </DataTable>
        </div>
        <div>
          {displayState ? (
            <div>
              <div>
                {datainfo.map((item) => (
                  <div
                    style={{ textAlign: "center", backgroundColor: "#eeeeee" }}
                  >
                    <span
                      style={{
                        color: "#2e88c5",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                      {item.project_name}
                    </span>
                  </div>
                ))}
                {datainfo.map((item) => (
                  <div>
                    <div className="projGlance">
                      <div className="row mx-2">
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Project Name
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="pname">
                                {item.project_name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Business Unit
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="bunit">
                                {item.business_unit}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Customer
                              </label>
                              <span className="col-1  p0">:</span>
                              <span className="col-5 " id="cmer">
                                {item.customer}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Sub Practice
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="spractice">
                                {item.sub_practice}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Architect
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="troles">
                                {item.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Project Manager
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5" id="prjManager">
                                {item.prj_manager}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5 no-padding">
                                Delivery Manager
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5" id="delManager">
                                {item.del_manager}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Unit Head
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5" id="uhead">
                                {}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Current Phase
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="currPhase">
                                {item.curr_phase}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Billing Model
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="bilModel">
                                {item.cont_terms}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Project Type
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="pType">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Execution Methodology
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="emethods">
                                {item.prj_exe}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Start Date
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="sDate">
                                {item.planned_start_dt}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                End Date- Contracted
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="eDate">
                                {/* {item.planned_end_dt} */}
                                {moment(item.planned_end_dt).format(
                                  "DD-MMM-YYYY"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                End Date- Estimated
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="eeDate">
                                {/* {item.est_planned_end_dt} */}
                                {moment(item.est_planned_end_dt).format(
                                  "DD-MMM-YYYY"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                % Complete
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5" id="pComplete">
                                {item.pComplete}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Billable Utilization %
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="bUtil">
                                {item.billable_utilized}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5 no-padding">
                                Planned FTE
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="pFte">
                                {item.planned_team_size}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Actual FTE
                              </label>
                              <span className="col-1 p0">:</span>
                              <span className="col-5 " id="aFte">
                                {item.actual_team_size}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <div className="row">
                              <label className="col-5  no-padding">
                                Expense Billable
                              </label>
                              <span className="col-1">:</span>
                              <span className="col-5" id="eBillable">
                                {item.ebillable}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <br />
              <div>
                {datainfo.map((Details) => (
                  <div
                    style={{ border: "1ps solid #f8e6c3" }}
                    className="group-content"
                  >
                    <div
                      className="alert alert-warning"
                      style={{
                        fontSize: "11px",
                        backgroundColor: "#ffffff",
                        paddingLeft: "5px",
                        paddingBottom: "5px",
                        paddingTop: "5px",
                        marginBottom: "0px",
                      }}
                      // style={fontSize: 11px; background-color: #ffffff; padding-left: 0px; padding-bottom: 0px}
                    >
                      <SlExclamation />
                      <strong style={{ marginLeft: "10px" }}>
                        <em class="icon-information-white"></em>
                      </strong>
                      Note: Values in the table are between
                      {/* <span id="frmDtSpan">01-Feb-2017</span> */}
                      <span className="Warning">
                        {" "}
                        {Details.planned_start_dt}{" "}
                      </span>
                      and
                      {/* <span id="toDtSpan">31-Dec-2018</span> */}
                      <span className="Warning">
                        {" "}
                        {Details.planned_end_dt}{" "}
                      </span>{" "}
                      except contracted value.
                    </div>
                  </div>
                ))}
              </div>
              <br></br>
              {/* <ProjectStatusReportDetails/> */}
              <div className="darkHeader">
                {/* {display ? <Loader /> : ""} */}
                <table className="table table-striped table-bordered  display">
                  <thead>
                    <tr>
                      <th width="5%" height="10px">
                        {dataKpi?.map((Details) =>
                          Details.var_dc < -6 ||
                          Details.var_dur < -6 ||
                          Details.var_efforts < -6 ||
                          Details.var_margin < -6 ||
                          Details.var_oc < -6 ||
                          Details.var_rev < -6 ? (
                            <div className="projectStatus">
                              {/* <span className="circle red" title="Atleast one indicator is red"></span>
                                <span className="circle"></span>
                                <span className="circle"></span> */}
                              <div>
                                <div className="legendContainer" align="center">
                                  <div
                                    className="legend red"
                                    title="Atleast one indicator is red"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance > -4%"
                                    className="legend"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // < div className="projectStatus" >
                            //     <span className="circle"></span>
                            //     <span className="circle"></span>
                            //     <span className="circle green" title="All indicators are green or Just one indicator is yellow and others are being green"></span>
                            // </div>
                            <div>
                              <div className="legendContainer" align="center">
                                <div className="legend">
                                  <div className="legendCircle"></div>
                                  <div className="legendTxt"></div>
                                </div>
                                <div className="legend">
                                  <div className="legendCircle"></div>
                                  <div className="legendTxt"></div>
                                </div>
                                <div
                                  data-toggle="tooltip"
                                  // title="vatiance > -4%"
                                  className="legend green"
                                  title="All indicators are green or Just one indicator is yellow and others are being green"
                                >
                                  <div className="legendCircle"></div>
                                  <div className="legendTxt"></div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </th>

                      <th width="15%" style={{ textAlign: "center" }}>
                        KPI
                      </th>
                      <th width="8%" style={{ textAlign: "center" }}>
                        Contracted Value
                      </th>
                      <th width="13%">Latest Total Planned (LTP)</th>
                      <th width="11%">Planned to Date (PTD)</th>
                      <th width="11%">Actual to Date (ATD)</th>
                      <th width="13%">Estimate To Complete (ETC)</th>
                      <th width="13%">Estimate At Completion (EAC)</th>
                      <th width="12%">Variance At Completion(%)</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      {dataKpi.map((Details) => (
                        <>
                          <td width="5%">
                            {Details.var_efforts > -4 ? (
                              // <>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance > -4%"
                              //     className="circle green"
                              //   ></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance > -4%"
                                    className="legend  green"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_efforts < -6 ? (
                              // <>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance < -6%"
                              //     className="circle red"
                              //   ></div>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              // </>
                              <div>
                                <div
                                  className="legendContainer"
                                  align="center"
                                  title="vatiance < -6%"
                                >
                                  <div className="legend red ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance > -4%"
                                    className="legend"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_efforts <= -4 &&
                            Details.var_efforts >= -6 ? (
                              // <>
                              //   <div className="circle"></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance >= -6% and vatiance =< -4%"
                              //     className="circle yellow"
                              //   ></div>
                              //   <div className="circle"></div>
                              // </>
                              <div className="legendContainer" align="center">
                                <div
                                  title="vatiance >= -6% and vatiance =< -4%"
                                  className="legend  green"
                                >
                                  <div className="legendCircle"></div>
                                  <div className="legendTxt"></div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                          <td width="8%">Efforts (Hrs)</td>
                          <td width="13%" id="cont_efforts">
                            <span style={{ float: "right" }}>
                              {/* {Details.cont_efforts} */}
                              {nf.format(parseInt(Details.cont_efforts))}
                            </span>
                          </td>
                          <td width="13%" id="pln_efforts">
                            <span style={{ float: "right" }}>
                              {/* {Details.pln_efforts} */}
                              {nf.format(parseInt(Details.pln_efforts))}
                            </span>
                          </td>
                          <td width="11%" id="ptd_efforts">
                            <span style={{ float: "right" }}>
                              {/* {Details.ptd_efforts} */}
                              {nf.format(parseInt(Details.ptd_efforts))}
                            </span>
                          </td>
                          <td width="11%" id="atd_efforts">
                            <span style={{ float: "right" }}>
                              {nf.format(parseInt(Details.atd_efforts))}
                              {/* {Details.atd_efforts} */}
                            </span>
                          </td>
                          <td width="13%" id="etc_efforts">
                            <span style={{ float: "right" }}>
                              {nf.format(parseInt(Details.etc_efforts))}
                              {/* {Details.etc_efforts} */}
                            </span>
                          </td>
                          <td width="13%" id="eac_efforts">
                            <span style={{ float: "right" }}>
                              {nf.format(parseInt(Details.eac_efforts))}
                              {/* {Details.eac_efforts} */}
                            </span>
                          </td>
                          <td width="12%" id="var_efforts">
                            <span style={{ float: "right" }}>
                              {nf.format(parseInt(Details.var_efforts))}

                              {/* {Details.var_efforts} */}
                            </span>
                          </td>
                        </>
                      ))}
                    </tr>
                    <tr>
                      {dataKpi.map((Details) => (
                        <>
                          <td>
                            {Details.var_rev > -4 ? (
                              // <>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance > -4%"
                              //     className="circle green"
                              //   ></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance > -4%"
                                    className="legend  green"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_rev < -6 ? (
                              // <>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance < -6%"
                              //     className="circle red"
                              //   ></div>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance < -6%"
                                    className="legend red "
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_rev <= -4 && Details.var_rev >= -6 ? (
                              // <>
                              //   <div className="circle"></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance >= -6% and vatiance =< -4%"
                              //     className="circle yellow"
                              //   ></div>
                              //   <div className="circle"></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance >= -6% and vatiance =< -4%"
                                    className="legend amber "
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>Revenue</td>
                          <td id="cont_rev">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.cont_rev} */}${" "}
                              {nf.format(parseInt(Details.cont_rev))}
                            </span>
                          </td>
                          <td id="pln_rev">
                            <span style={{ float: "right" }}>
                              {" "}
                              $ {nf.format(parseInt(Details.pln_rev))}
                              {/* $ {Details.pln_rev} */}
                            </span>
                          </td>
                          <td id="ptd_rev">
                            <span style={{ float: "right" }}>
                              {" "}
                              $ {nf.format(parseInt(Details.ptd_rev))}
                              {/* $ {Details.ptd_rev} */}
                            </span>
                          </td>
                          <td id="atd_rev">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.atd_rev} */}${" "}
                              {nf.format(parseInt(Details.atd_rev))}
                            </span>
                          </td>
                          <td id="etc_rev">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.etc_rev} */}${" "}
                              {nf.format(parseInt(Details.etc_rev))}
                            </span>
                          </td>
                          <td id="eac_rev">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.eac_rev} */}${" "}
                              {nf.format(parseInt(Details.eac_rev))}
                            </span>
                          </td>
                          <td id="var_rev">
                            <span style={{ float: "right" }}>
                              {/* {Details.var_rev} */}${" "}
                              {nf.format(parseInt(Details.var_rev))}
                            </span>
                          </td>
                        </>
                      ))}
                    </tr>
                    <tr>
                      {dataKpi.map((Details) => (
                        <>
                          <td>
                            {Details.var_dc > -4 ? (
                              // <>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance > -4%"
                              //     className="circle green"
                              //   ></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance > -4%"
                                    className="legend  green"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_dc < -6 ? (
                              // <>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance < -6%"
                              //     className="circle red"
                              //   ></div>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance < -6%"
                                    className="legend red"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_dc <= -4 && Details.var_dc >= -6 ? (
                              // <>
                              //   <div className="circle"></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance >= -6% and vatiance =< -4%"
                              //     className="circle yellow"
                              //   ></div>
                              //   <div className="circle"></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance >= -6% and vatiance =< -4%"
                                    className="legend amber"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>Resource Direct Cost</td>
                          <td id="cont_dc">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.cont_dc} */}${" "}
                              {nf.format(parseInt(Details.cont_dc))}
                            </span>
                          </td>
                          <td id="pln_dc">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.pln_dc} */}${" "}
                              {nf.format(parseInt(Details.pln_dc))}
                            </span>
                          </td>
                          <td id="ptd_dc">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.ptd_dc} */}${" "}
                              {nf.format(parseInt(Details.pln_dc))}
                            </span>
                          </td>
                          <td id="atd_dc">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.atd_dc} */}${" "}
                              {nf.format(parseInt(Details.atd_dc))}
                            </span>
                          </td>
                          <td id="etc_dc">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.etc_dc} */}${" "}
                              {nf.format(parseInt(Details.etc_dc))}
                            </span>
                          </td>
                          <td id="eac_dc">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.eac_dc} */}${" "}
                              {nf.format(parseInt(Details.eac_dc))}
                            </span>
                          </td>
                          <td id="var_dc">
                            <span style={{ float: "right" }}>
                              {/* {Details.var_dc} */}${" "}
                              {nf.format(parseInt(Details.var_dc))}
                            </span>
                          </td>
                        </>
                      ))}
                    </tr>
                    <tr>
                      {dataKpi.map((Details) => (
                        <>
                          <td>
                            {Details.var_oc > -4 ? (
                              // <>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance > -4%"
                              //     className="circle green"
                              //   ></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance > -4%"
                                    className="legend  green"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_oc < -6 ? (
                              // <>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance < -6%"
                              //     className="circle red"
                              //   ></div>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance < -6%"
                                    className="legend red "
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_oc <= -4 && Details.var_oc >= -6 ? (
                              // <>
                              //   <div className="circle"></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance >= -6% and vatiance =< -4%"
                              //     className="circle yellow"
                              //   ></div>
                              //   <div className="circle"></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance >= -6% and vatiance =< -4%"
                                    className="legend amber "
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>Other Direct Cost</td>
                          <td id="cont_oc">
                            {" "}
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.cont_oc} */}${" "}
                              {nf.format(parseInt(Details.cont_oc))}
                            </span>
                          </td>
                          <td id="pln_oc">
                            {" "}
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.pln_oc} */}${" "}
                              {nf.format(parseInt(Details.pln_oc))}
                            </span>
                          </td>
                          <td id="ptd_oc">
                            {" "}
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.ptd_oc} */}${" "}
                              {nf.format(parseInt(Details.ptd_oc))}
                            </span>
                          </td>
                          <td id="atd_oc">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.atd_oc} */}${" "}
                              {nf.format(parseInt(Details.atd_oc))}
                            </span>
                          </td>
                          <td id="etc_oc">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.etc_oc} */}${" "}
                              {nf.format(parseInt(Details.etc_oc))}
                            </span>
                          </td>
                          <td id="eac_oc">
                            <span style={{ float: "right" }}>
                              {" "}
                              {/* $ {Details.eac_oc} */}${" "}
                              {nf.format(parseInt(Details.eac_oc))}
                            </span>
                          </td>
                          <td id="var_oc">
                            <span style={{ float: "right" }}>
                              {/* {Details.var_oc} */}${" "}
                              {nf.format(parseInt(Details.var_oc))}
                            </span>
                          </td>
                        </>
                      ))}
                    </tr>
                    <tr>
                      {dataKpi.map((Details) => (
                        <>
                          <td>
                            {Details.var_margin > -4 ? (
                              // <>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance > -4%"
                              //     className="circle green"
                              //   ></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance > -4%"
                                    className="legend  green"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_margin < -6 ? (
                              // <>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance < -6%"
                              //     className="circle red"
                              //   ></div>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance < -6%"
                                    className="legend red "
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_margin <= -4 &&
                            Details.var_margin >= -6 ? (
                              // <>
                              //   <div className="circle"></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance >= -6% and vatiance =< -4%"
                              //     className="circle yellow"
                              //   ></div>
                              //   <div className="circle"></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance >= -6% and vatiance =< -4%"
                                    className="legend yellow "
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>Project Margin (%)</td>
                          <td id="cont_margin">
                            <span style={{ float: "right" }}>
                              {/* {Details.cont_margin} */}
                              {nf.format(parseInt(Details.cont_margin))}
                            </span>
                          </td>
                          <td id="pln_margin">
                            <span style={{ float: "right" }}>
                              {/* {Details.pln_margin} */}
                              {nf.format(parseInt(Details.pln_margin))}
                            </span>
                          </td>
                          <td id="ptd_margin">
                            <span style={{ float: "right" }}>
                              {/* {Details.ptd_margin} */}
                              {nf.format(parseInt(Details.ptd_margin))}
                            </span>
                          </td>
                          <td id="atd_margin">
                            <span style={{ float: "right" }}>
                              {/* {Details.atd_margin} */}
                              {nf.format(parseInt(Details.atd_margin))}
                            </span>
                          </td>
                          <td id="etc_margin">
                            <span style={{ float: "right" }}>
                              {/* {Details.etc_margin} */}
                              {nf.format(parseInt(Details.etc_margin))}
                            </span>
                          </td>
                          <td id="eac_margin">
                            <span style={{ float: "right" }}>
                              {/* {Details.eac_margin} */}
                              {nf.format(parseInt(Details.eac_margin))}
                            </span>
                          </td>
                          <td id="var_margin">
                            <span style={{ float: "right" }}>
                              {/* {Details.var_margin} */}
                              {nf.format(parseInt(Details.var_margin))}
                            </span>
                          </td>
                        </>
                      ))}
                    </tr>
                    <tr>
                      {dataKpi.map((Details) => (
                        <>
                          <td>
                            {Details.var_dur > -4 ? (
                              // <>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance > -4%"
                              //     className="circle green"
                              //   ></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance > -4%"
                                    className="legend  green"
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_dur < -6 ? (
                              // <>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance < -6%"
                              //     className="circle red"
                              //   ></div>
                              //   <div className="circle "></div>
                              //   <div className="circle "></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance < -6%"
                                    className="legend red "
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {Details.var_dur <= -4 && Details.var_dur >= -6 ? (
                              // <>
                              //   <div className="circle"></div>
                              //   <div
                              //     data-toggle="tooltip"
                              //     title="vatiance >= -6% and vatiance =< -4%"
                              //     className="circle yellow"
                              //   ></div>
                              //   <div className="circle"></div>
                              // </>
                              <div>
                                <div className="legendContainer" align="center">
                                  <div className="legend  ">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div
                                    data-toggle="tooltip"
                                    title="vatiance >= -6% and vatiance =< -4%"
                                    className="legend yellow "
                                  >
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                  <div className="legend">
                                    <div className="legendCircle"></div>
                                    <div className="legendTxt"></div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>Duration (Days)</td>
                          <td id="cont_dur">
                            <span style={{ float: "right" }}>
                              {/* {Details.cont_dur} */}
                              {nf.format(parseInt(Details.cont_dur))}
                            </span>
                          </td>
                          <td id="pln_dur">
                            <span style={{ float: "right" }}>
                              {nf.format(parseInt(Details.pln_dur))}
                            </span>
                          </td>
                          <td id="ptd_dur">
                            <span style={{ float: "right" }}>
                              {/* {Details.ptd_dur} */}
                              {nf.format(parseInt(Details.ptd_dur))}
                            </span>
                          </td>
                          <td id="atd_dur">
                            <span style={{ float: "right" }}>
                              {Details.atd_dur}
                            </span>
                          </td>
                          <td id="etc_dur">
                            <span style={{ float: "right" }}>
                              {Details.etc_dur}
                            </span>
                          </td>
                          <td id="eac_dur">
                            <span style={{ float: "right" }}>
                              {Details.eac_dur}
                            </span>
                          </td>
                          <td id="var_dur">
                            <span style={{ float: "right" }}>
                              {Details.var_dur}
                            </span>
                          </td>
                        </>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <br></br>
              <br></br>

              <div
                className="group mb-1 customCard"
                style={{
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.23)",
                  cursor: "pointer",
                }}
              >
                <div className="col-md-12 collapseHeader">
                  {/* <div
                    onClick={() => {
                      setVisibleA(!visibleA);
                      visibleA
                        ? setCheveronIconA(FaChevronCircleUp)
                        : setCheveronIconA(FaChevronCircleDown);
                    }}
                  >
                    <span>{cheveronIconA}</span>
                  </div> */}
                  <div
                    className="row col-md-12"
                    style={{
                      backgroundColor: "#f4f4f4",
                      marginLeft: "0px",
                      marginTop: "4px",
                    }}
                    onClick={() => {
                      setVisibleA(!visibleA);
                      visibleA
                        ? setCheveronIconA(FaChevronCircleUp)
                        : setCheveronIconA(FaChevronCircleDown);
                    }}
                  >
                    <div className="col-md-6">
                      <h2 style={{ backgroundColor: "#f4f4f4" }}>
                        Accomplishments and Planned Activities
                      </h2>
                    </div>{" "}
                    <div className="col-md-6 px-0">
                      <span style={{ float: "right", marginTop: "7px" }}>
                        {/* {cheveronIconA} */}
                        <div style={{ color: "#2e88c5" }}> {cheveronIconA}</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <CCollapse visible={!visibleA}>
                <div key={key} className="row">
                  <div className="col-md-6">
                    <ProjectStatusAccomplishments projectId={projectId} />
                  </div>

                  <div className="col-md-6">
                    <ProjectStatusPlannedActivities projectId={projectId} />
                  </div>
                </div>
              </CCollapse>

              <div
                className="group mb-1 customCard"
                style={{
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.23)",
                  cursor: "pointer",
                }}
              >
                <div className="col-md-12 collapseHeader">
                  <div
                    className="row col-md-12"
                    style={{
                      backgroundColor: "#f4f4f4",
                      marginLeft: "0px",
                      marginTop: "4px",
                    }}
                    onClick={() => {
                      setVisibleB(!visibleB);
                      visibleB
                        ? setCheveronIconB(FaChevronCircleUp)
                        : setCheveronIconB(FaChevronCircleDown);
                    }}
                  >
                    <div className="col-md-6">
                      <h2 style={{ backgroundColor: "#f4f4f4" }}>Risks</h2>
                    </div>{" "}
                    <div className="col-md-6 px-0">
                      <span style={{ float: "right", marginTop: "7px" }}>
                        {/* {cheveronIconB} */}
                        <div style={{ color: "#2e88c5" }}> {cheveronIconB}</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CCollapse visible={!visibleB}>
                {/* <ProjectStatusRisk id={id} /> */}
                <div>
                  <FlatPrimeReactTable data={dataRisks} rows={rows} />
                </div>
              </CCollapse>

              <div
                className="group mb-1 customCard"
                style={{
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.23)",
                  cursor: "pointer",
                }}
              >
                <div className="col-md-12 collapseHeader">
                  <div
                    className="row col-md-12"
                    style={{
                      backgroundColor: "#f4f4f4",
                      marginLeft: "0px",
                      marginTop: "4px",
                    }}
                    onClick={() => {
                      setVisibleC(!visibleC);
                      visibleC
                        ? setCheveronIconC(FaChevronCircleUp)
                        : setCheveronIconC(FaChevronCircleDown);
                    }}
                  >
                    <div className="col-md-6">
                      <h2 style={{ backgroundColor: "#f4f4f4" }}>Issues</h2>
                    </div>{" "}
                    <div className="col-md-6 px-0">
                      <span style={{ float: "right", marginTop: "7px" }}>
                        {/* {cheveronIconC} */}
                        <div style={{ color: "#2e88c5" }}> {cheveronIconC}</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CCollapse visible={!visibleC}>
                {/* <ProjectStatusIssues /> */}
                <div className="prohectStatusReports">
                  {" "}
                  <FlatPrimeReactTable data={dataIssues} rows={rows} />
                </div>
              </CCollapse>
              <div
                className="group mb-1 customCard"
                style={{
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.23)",
                  cursor: "pointer",
                }}
              >
                <div className="col-md-12 collapseHeader">
                  <div
                    className="row col-md-12"
                    style={{
                      backgroundColor: "#f4f4f4",
                      marginLeft: "0px",
                      marginTop: "4px",
                    }}
                    onClick={() => {
                      setVisibleD(!visibleD);
                      visibleD
                        ? setCheveronIconD(FaChevronCircleUp)
                        : setCheveronIconD(FaChevronCircleDown);
                    }}
                  >
                    <div className="col-md-6">
                      <h2 style={{ backgroundColor: "#f4f4f4" }}>
                        Dependencies
                      </h2>
                    </div>{" "}
                    <div className="col-md-6 px-0">
                      <span style={{ float: "right", marginTop: "7px" }}>
                        <div style={{ color: "#2e88c5" }}>{cheveronIconD}</div>
                      </span>
                    </div>{" "}
                  </div>
                </div>
              </div>
              <CCollapse visible={!visibleD}>
                {/* <ProjectStatusDependency /> */}
                <FlatPrimeReactTable data={dataDependency} rows={rows} />
              </CCollapse>
              <div
                className="group mb-1 customCard"
                style={{
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.23)",
                  cursor: "pointer",
                }}
              >
                <div className="col-md-12 collapseHeader">
                  <div
                    className="row col-md-12"
                    style={{
                      backgroundColor: "#f4f4f4",
                      marginLeft: "0px",
                      marginTop: "4px",
                    }}
                    onClick={() => {
                      setVisibleE(!visibleE);
                      visibleE
                        ? setCheveronIconE(FaChevronCircleUp)
                        : setCheveronIconE(FaChevronCircleDown);
                    }}
                  >
                    <div className="col-md-6">
                      <h2 style={{ backgroundColor: "#f4f4f4" }}>
                        Scope Change History and Indicator
                      </h2>
                    </div>{" "}
                    <div className="col-md-6 px-0">
                      <span style={{ float: "right", marginTop: "7px" }}>
                        {/* {cheveronIconE} */}
                        <div style={{ color: "#2e88c5" }}> {cheveronIconE}</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CCollapse visible={!visibleE}>
                {/* <ProjectStatusScope /> */}
                <div>
                  {/* <FlatPrimeReactTable data={dataScope} /> */}
                  <FlatPrimeReactTable data={dataScope} rows={rows} />
                </div>
              </CCollapse>
              <div
                className="group mb-1 customCard"
                style={{
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.23)",
                  cursor: "pointer",
                }}
              >
                <div className="col-md-12 collapseHeader">
                  <div
                    className="row col-md-12"
                    style={{
                      backgroundColor: "#f4f4f4",
                      marginLeft: "0px",
                      marginTop: "4px",
                    }}
                    // style={{ backgroundColor: "#f4f4f4" }}
                    onClick={() => {
                      setVisibleF(!visibleF);
                      visibleF
                        ? setCheveronIconF(FaChevronCircleUp)
                        : setCheveronIconF(FaChevronCircleDown);
                    }}
                  >
                    <div className="col-md-6">
                      <h2 style={{ backgroundColor: "#f4f4f4" }}>Events</h2>
                    </div>{" "}
                    <div className="col-md-6 px-0">
                      <span style={{ float: "right", marginTop: "7px" }}>
                        <div style={{ color: "#2e88c5" }}> {cheveronIconF}</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CCollapse visible={!visibleF}>
                {/* <ProjectStatusEvents /> */}
                <FlatPrimeReactTable data={dataEvent} rows={rows} />
              </CCollapse>
            </div>
          ) : (
            ""
          )}
          {/* <ProjectStatusReportDetails/> */}
          {open && <PdfPopup open={open} setOpen={setOpen} />}
        </div>
      </div>
    </div>
  );
}

export default SearchDefaultTable;
