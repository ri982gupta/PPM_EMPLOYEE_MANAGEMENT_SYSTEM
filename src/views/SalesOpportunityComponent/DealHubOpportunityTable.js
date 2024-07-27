import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { InputText } from "primereact/inputtext";
import "./DealhubOpportunityPopUp.scss";
import { FaCircle } from "react-icons/fa";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import { ReactComponent as ListCheckSolid } from "./ListCheckSolid.svg";
import DealHubOpportunityPopUp from "./DealhubOpportunityPopUp";
import {
  IN_PROGRESS,
  SIGNED_OFF,
  CLOSED,
  ON_HOLD,
} from "./LukUpConstantsDealHub.js";
import OpenCommentsPopUp from "./OpenCommentsPopUp.js";
import { HiDocument } from "react-icons/hi2";
import SfPRTable from "./SfPRTable";
import SfDocuments from "./SfDocuments";
import { MdNoteAlt } from "react-icons/md";

require("jspdf-autotable");

function DealHubOpportunityTable(props) {
  const {
    data,
    rows,
    value,
    dynamicColumns,
    headerData,
    setHeaderData,
    setCheckedData,
    setSelectedIds,
    checkboxSelect,
    setCheckboxSelect,
    selectedIds,
    dataObject,
    versPopup,
    setVersPopup,
    checkedDhub,
    setCheckedDhub,
    dataVar,
    newDataVar,
    rrId,
    handleClick,
  } = props;
  const [TableData, displayTableData] = useState([]);
  const [type, setType] = useState("");
  const [salesOppoId, setSalesOppoId] = useState("");

  const fetchData = () => {
    axios
      .get(baseUrl + `/SalesMS/sales/getsfoppt?reportRunId=${rrId}`)
      .then(function (response) {
        const data = response.data;
        newDataVar(data);
      });
  };

  const [mainData, setMainData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [commentId, setCommentId] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const baseUrl = environment.baseUrl;
  const [opportunityId, setOpportunityId] = useState([]);
  const [opportunityName, setOpportunityName] = useState([]);

  useEffect(() => {
    if (checkboxSelect && checkboxSelect.length > 0) {
      const selectedIds = checkboxSelect.map((item) => item.id);
    }
  }, [checkboxSelect]);

  const dt = useRef(null);
  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  useEffect(() => {
    if (mainData.length > 0) {
      setHeaderData(mainData[0]);
      setBodyData(mainData.splice(1));

      let dtt = [];
      let headDt = mainData[0];

      Object.keys(headDt).forEach((d) => {
        d != "StatusId" && dtt.push({ title: headDt[d], dataKey: d });
      });

      setExportColumns(dtt);
    }
  }, [mainData]);

  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  const [filters1, setFilters1] = useState({
    global: filtersData["contains"],
  });

  useEffect(() => {
    setFilters1({
      global: filtersData["contains"],
    });
  }, [headerData]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <div className="flex  flex-row-reverse">
        <span className="p-input-icon-left tableGsearch" style={{ top }}>
          <i className="pi pi-search" />
          <InputText
            defaultValue={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const renderRowActions = (data) => {
    const handleCommentClick = () => {
      setCommentId(data?.dhub_id);
    };

    const handleCommentClickIcon = () => {
      setVersPopup(true);

      setOpportunityId(data?.opportunity_id);
      setOpportunityName(data?.opportunity_name);
    };

    return (
      <>
        <MdNoteAlt
          title="Show Comments"
          style={{
            color: "orange",
            cursor: "pointer",
            fontSize: "17px",
            marginRight: "5px",
          }}
          onClick={() => {
            handleCommentClick();
            setPopUp(true);
          }}
        />
        <ListCheckSolid
          title={
            data?.dhub_status_id === ON_HOLD
              ? "Action Item - On hold"
              : data?.dhub_status_id === CLOSED
              ? "Action Item - Closed"
              : data?.dhub_status_id === SIGNED_OFF
              ? "Action Item-Signed Off"
              : data?.dhub_status_id === "1500"
              ? "Action Item- Closed Lost"
              : data?.dhub_status_id === IN_PROGRESS
              ? "Action Item - In-progress"
              : ""
          }
          className={
            data?.dhub_status_id === ON_HOLD
              ? "dhUserIconOrange"
              : data?.dhub_status_id === CLOSED
              ? "dhUserIconGreen"
              : data?.dhub_status_id === SIGNED_OFF
              ? "dhUserIconPink"
              : data?.dhub_status_id === "1500"
              ? "dhUserIconRed"
              : data?.dhub_status_id === IN_PROGRESS
              ? "dhUserIconBlue"
              : ""
          }
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleCommentClickIcon();
          }}
        />
      </>
    );
  };

  const header1 = renderHeader1();
  const emptyMessage = "No Records found.";

  const CircleHeader = ({ color, title, color1, title1 }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ marginRight: "5px" }}>
        <FaCircle style={{ color }} title={title} />
      </div>
      <div>{title}</div>
      <div style={{ marginRight: "5px" }}>
        <FaCircle style={{ color: "green" }} title={title1} />
      </div>
      <div>{title1}</div>
    </div>
  );

  return (
    <div className="darkHeader dealhubDetailTable">
      <div className="dealHubHeading">
        <h2>DealHub Details</h2>
      </div>
      {Object.keys(headerData).length > 0 && (
        <>
          <DataTable
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink "
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            rowsPerPageOptions={[10, 25, 50]}
            paginationrowsperpageoptions={[5, 15, 25, 50]}
            paginationcomponentoptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            value={bodyData}
            paginator
            showGridlines
            rows={rows}
            dataKey="id"
            filters={filters1}
            selectionMode="checkbox"
            selection={checkboxSelect}
            responsiveLayout="scroll"
            header={header1}
            // onSelectionChange={(e) => handleChange(e)}
            className=" primeReactDataTable checkboxselect Deal-Hub-Detail-Table" ////customerEngament
          >
            <Column
              field="customer_name"
              header={
                <CircleHeader
                  color="purple"
                  color1="green"
                  title="Prospect"
                  title1="Customer"
                />
              }
              sortable
              body={(data) => {
                return (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginRight: "5px" }}>
                      {data?.is_prospect === "1" ? (
                        <FaCircle
                          style={{ color: "purple" }}
                          title="Prospect"
                        />
                      ) : data?.is_prospect === "0" ? (
                        <FaCircle style={{ color: "green" }} title="Customer" />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="ellipsis" title={data.customer_name}>
                      {data.customer_name}
                    </div>
                  </div>
                );
              }}
            />

            <Column
              field="account_executive"
              header="Account Executive"
              sortable
              body={(data) => {
                return (
                  <div className="ellipsis" title={data.account_executive}>
                    {data.account_executive}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="opportunity_name"
              header="Opportunity Name"
              sortable
              body={(data) => {
                return (
                  <div className="row">
                    <div className="col-md-9">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          overflow: "hidden",
                          minWidth: "120px",
                        }}
                      >
                        <a
                          href={`http://d300000000qxieam.my.salesforce.com/?ec=302&startURL=%2Fvisualforce%2Fsession%3Furl%3Dhttp%253A%252F%252Fd300000000qxieam.lightning.force.com%252Flightning%252Fr%252FOpportunity%252F${data.opportunity_id}%252Fview`}
                          target="_blank"
                          title={data.opportunity_name}
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {data.opportunity_name}
                        </a>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div style={{ alignItems: "center" }}>
                        <HiDocument
                          style={{ transform: "scale(1.3)", cursor: "pointer" }}
                          title="View SF Docs"
                          className="dhDocIcon"
                          onClick={() => {
                            setType(data.opportunity_id);
                            setSalesOppoId(data.opportunity_id);
                            setOpportunityName(data.opportunity_name);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              }}
            ></Column>

            <Column
              key={"comments"}
              field="comments"
              header="Action"
              style={{ textAlign: "center" }}
              body={(data) => {
                return renderRowActions(data);
              }}
            />
            <Column
              field="stage"
              header="Stage"
              sortable
              body={(data) => {
                return (
                  <div className="ellipsis" title={data.stage}>
                    {data.stage}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="contract_type"
              header="Contract Type"
              sortable
              body={(data) => {
                return (
                  <div className="ellipsis" title={data.contract_type}>
                    {data.contract_type}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="probability"
              header="Probability (%)"
              style={{ textAlign: "right" }}
              sortable
              body={(data) => {
                return (
                  <div className="ellipsis" title={data.probability}>
                    {data.probability}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="amount"
              header="Amount ($)"
              style={{ textAlign: "right" }}
              sortable
              body={(data) => {
                const formattedAmount = Number(data.amount);

                if (!isNaN(formattedAmount)) {
                  return (
                    <div
                      className="ellipsis"
                      title={formattedAmount.toLocaleString("en-US")}
                    >
                      {formattedAmount.toLocaleString("en-US")}
                    </div>
                  );
                } else {
                  return (
                    <div className="ellipsis" title="Invalid Amount">
                      Invalid Amount
                    </div>
                  );
                }
              }}
            ></Column>
            <Column
              field="owner_name"
              header="DealHub Owner"
              sortable
              body={(data) => {
                return (
                  <div className="ellipsis" title={data.owner_name}>
                    {data.owner_name}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="dhub_status"
              header="DealHub Status"
              sortable
              body={(data) => {
                return (
                  <div className="ellipsis" title={data.dhub_status}>
                    {data.dhub_status}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="total_effort_hours"
              header="DealHub Estimated Hours"
              sortable
              body={(data) => {
                return (
                  <div
                    className="ellipsis"
                    title={data.total_effort_hours}
                    style={{ float: "right" }}
                  >
                    {data.total_effort_hours}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="total_actual_hours"
              header="DealHub Actual Hours"
              sortable
              body={(data) => {
                return (
                  <div
                    className="ellipsis"
                    title={data.total_actual_hours}
                    style={{ float: "right" }}
                  >
                    {data.total_actual_hours}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="assign_dt"
              style={{ textAlign: "center" }}
              header="DealHub Assigned Date"
              sortable
              body={(data) => {
                return (
                  <div
                    className="ellipsis"
                    title={moment(data.assign_dt).format("DD-MMM-yyyy")}
                  >
                    {moment(data.assign_dt).format("DD-MMM-yyyy")}
                  </div>
                );
              }}
            ></Column>
            {/* <Column
              field="dhub_closed_date"
              header="DealHub Closed Date"
              sortable
              body={(data) => {
                return (
                  <div
                    className="ellipsis"
                    style={{ textAlign: "center" }}
                    title={
                      data.dhub_closed_date == null ||
                      data.dhub_closed_date == ""
                        ? ""
                        : moment(data.dhub_closed_date).format("DD-MMM-yyyy")
                    }
                  >
                    {data.dhub_closed_date == null ||
                    data.dhub_closed_date == ""
                      ? ""
                      : moment(data.dhub_closed_date).format("DD-MMM-yyyy")}
                  </div>
                );
              }}
            ></Column> */}
            <Column
              field="opportunity_close_date"
              header="Projected Closed Date"
              sortable
              body={(data) => {
                return (
                  <div
                    className="ellipsis"
                    style={{ textAlign: "center" }}
                    title={
                      data.opportunity_close_date == null ||
                      data.opportunity_close_date == ""
                        ? "NA"
                        : moment(data.opportunity_close_date).format(
                            "DD-MMM-yyyy"
                          )
                    }
                  >
                    {data.opportunity_close_date == null ||
                    data.opportunity_close_date == ""
                      ? "NA"
                      : moment(data.opportunity_close_date).format(
                          "DD-MMM-yyyy"
                        )}
                  </div>
                );
              }}
            ></Column>
          </DataTable>
        </>
      )}
      {salesOppoId && (
        <div className="col-md-12 mt-3">
          <span>
            <span style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
              <b> SF URL -</b>
            </span>{" "}
            https://na87.lightning.force.com/lightning/r/Opportunity/{type}/view
          </span>
        </div>
      )}

      {salesOppoId && (
        <div className="col-md-12 mt-3">
          <span style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
            <b>SF PR Pipeline - {opportunityName}</b>
          </span>
        </div>
      )}

      {salesOppoId && (
        <SfPRTable salesOppoId={salesOppoId} reportRunId={rrId} type={type} />
      )}

      {salesOppoId && (
        <div className="col-md-12 mt-2">
          <span style={{ color: "rgb(46, 136, 197)", fontSize: "13px" }}>
            <b>SF Documents - {opportunityName}</b>
          </span>
        </div>
      )}
      {salesOppoId && <SfDocuments type={type} />}
      {popUp && (
        <OpenCommentsPopUp
          popUp={popUp}
          setPopUp={setPopUp}
          commentId={commentId}
        />
      )}
      {versPopup && (
        <DealHubOpportunityPopUp
          versPopup={versPopup}
          setVersPopup={setVersPopup}
          opportunityId={opportunityId}
          setCheckedDhub={setCheckedDhub}
          dataVar={dataVar}
          rrId={rrId}
          fetchData={fetchData}
          opportunityName={opportunityName}
          displayTableData={displayTableData}
          handleClick={handleClick}
        />
      )}
    </div>
  );
}

export default DealHubOpportunityTable;
