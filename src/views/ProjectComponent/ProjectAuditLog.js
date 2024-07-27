import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import { Link } from "react-router-dom";

import IQAChart from "./IQAChart";
import QCRChart from "./QCRChart";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import { FilterMatchMode, FilterOperator } from "primereact/api";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import './ProjectAuditLog.scss'
function ProjectAuditLog(props) {
  const [tableData, setTableData] = useState([]);
  const [openIQA, setOpenIQA] = useState(false);
  const [openQCR, setOpenQCR] = useState(false);
  const [uid, setUid] = useState(0);
  const [graphData, setGraphData] = useState([]);
  const [dat, setDat] = useState("");
  const [Auditname, setAuditname] = useState("");

  const [prjName, setPrjName] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [data2, setData2] = useState([]);
  const {
    projectId,
    grp4Items,
    urlState,
    setUrlState,
    btnState,
    setbtnState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp6Items,
  } = props;
  const baseUrl = environment.baseUrl;
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });
  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -86) + "px"
  );
  /// pagination
  const downloadEmployeeData = (data) => {
    const docUrl =
      baseUrl +
      `/VendorMS/vendor/downloadFile?documentId=${data?.documentId}&svnRevision=${data?.svn_revision}`;

    axios({
      url: docUrl,
      method: "GET",
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data.filename); //or any other extension
      document.body.appendChild(link);
      link.click();
    });
  };

  useEffect(() => {
    downloadEmployeeData();
  }, []);

  const onChangePractice = (e) => {
    const { value } = e.target;
    setGetData(value);
  };

  /// end-pagination

  // breadcrumbs --
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Monitoring", "Audit Log"];
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
      // console.log(sortedSubMenus);
      setData2(sortedSubMenus);

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
        `/CommonMS/security/authorize?url=/project/auditLog/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
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
  const getTableData = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/Audit/getAuditLogDetails?projectId=${projectId}`,
    })
      .then((res) => {
        setTableData(res.data);
      })
      .then((error) => {});
  };

  useEffect(() => {
    getTableData();
    getProjectName();
    getProjectOverviewData();
  }, []);

  const clickHanlderQCR = (id, pastAuditType) => {
    setOpenQCR(true);
    setUid(id);
    setAuditname(pastAuditType);
  };

  const clickHanlderIQA = (id, pastAuditType) => {
    setDat(pastAuditType);
    setOpenIQA(true);
    setUid(id);
  };
  const getGraphData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getGraphDetails?gid=${uid}`,
    })
      .then((response) => {
        let resp = response.data;
        setGraphData(resp);
        setUid(0);
      })
      .then((error) => {});
  };
  const AuditType = (data) => {
    return <> {data.auditType}</>;
  };
  const PlannedDate = (data) => {
    return (
      <>
        {" "}
        {data.plandStartDate === null
          ? ""
          : moment(data.plandStartDate).format("DD-MMM-yyyy")}
      </>
    );
  };
  const Reports = (data) => {
    return (
      <>
        {data.documentId == null ? (
          <HiOutlineDocumentText
            className="disableField"
            size={"2em"}
            disabled
          />
        ) : (
          <a>
            <HiOutlineDocumentText
              onClick={() => {
                downloadEmployeeData(data);
              }}
              size={"2em"}
              style={{ color: "#2e88c5" }}
            />
          </a>
        )}
      </>
    );
  };
  const Trend = (data) => {
    return (
      <>
        {data.pastAuditType === 477 ? (
          <b>
            <Link
              style={{
                textDecoration: "underline",
              }}
              onClick={() => {
                clickHanlderQCR(data.id, data.pastAuditType);
              }}
            >
              {data.Result + "%"}
            </Link>
          </b>
        ) : (
          <b>
            <Link
              style={{
                textDecoration: "underline",
              }}
              onClick={() => {
                clickHanlderIQA(data.id, data.pastAuditType);
              }}
            >
              {data.Result}
            </Link>
          </b>
        )}
      </>
    );
  };
  const ScheduledDate = (data) => {
    return (
      <>
        {data.scheduledDate === null
          ? ""
          : moment(data.scheduledDate).format("DD-MMM-yyyy")}
      </>
    );
  };
  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header="Last Audit Details"
          colSpan={6}
          style={{ textAlign: "center" }}
        />
        <Column header="Schedule Details" colSpan={1} />
      </Row>
      <Row>
        <Column
          sortable
          header="Audit Type"
          field="pastAuditType"
          body={AuditType}
        />
        <Column
          sortable
          header="Planned Date"
          field="plandStartDate"
          body={PlannedDate}
        />
        <Column sortable header="Auditor Name" field="auditName" />
        <Column sortable header="Trend" field="Result" />
        <Column sortable header="Reports" field="documentId" />
        <Column sortable header="Audit Status" field="status" />
        <Column sortable header="Date" field="scheduledDate" />
      </Row>
    </ColumnGroup>
  );

  // const onGlobalFilterChange = (event) => {
  //   const value = event.target.value;
  //   let _filters = { ...filters };
  //   _filters["global"].value = value;
  //   console.log(filters);

  //   setFilters(_filters);
  // };
  const [globalFilter, setGlobalFilter] = useState("");

  const onGlobalFilterChange = (event) => {
    setGlobalFilter(event.target.value);
  };
  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";
    return (
      <div style={{ marginLeft: "85%" }}>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            style={{ float: "right" }}
            value={globalFilter}
            onChange={(e) => onGlobalFilterChange(e)}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();
  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  return (
    <div>
      <div className="col-md-12">
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
            <h2>Audit Log</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>

      <div className="customercard darkHeader mt-2 DeliveryProjectsMonitoringAuditLog">
        <DataTable
          className="primeReactDataTable invoicingSearchTable " ////customerEngament
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          rowsPerPageOptions={[10, 25, 50]}
          value={filteredData}
          paginator
          rows={25}
          header={header}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          selection={selectedCustomer}
          onSelectionChange={(e) => setSelectedCustomer(e.value)}
          dataKey="id"
          showGridlines
          stateStorage="session"
          stateKey="dt-state-demo-local"
          responsiveLayout="scroll"
          emptyMessage="No Records found."
          headerColumnGroup={headerGroup}
        >
          <Column header="Audit Type" field="pastAuditType" body={AuditType} />
          <Column
            header="Planned Date"
            field="plandStartDate"
            body={PlannedDate}
          />
          <Column header="Auditor Name" field="auditName" />
          <Column header="Trend" field="Result" body={Trend} align="right" />
          <Column
            header="Reports"
            field="documentId"
            body={Reports}
            align="center"
          />
          <Column header="Audit Status" field="status" />
          <Column header="Date" body={ScheduledDate} />
        </DataTable>
      </div>
      {openIQA ? (
        <IQAChart
          getGraphData={getGraphData}
          openIQA={openIQA}
          setOpenIQA={setOpenIQA}
          graphData={graphData}
          setGraphData={setGraphData}
          dat={dat}
        />
      ) : (
        ""
      )}
      {openQCR ? (
        <QCRChart
          getGraphData={getGraphData}
          openQCR={openQCR}
          setOpenQCR={setOpenQCR}
          graphData={graphData}
          setGraphData={setGraphData}
          Auditname={Auditname}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default ProjectAuditLog;
