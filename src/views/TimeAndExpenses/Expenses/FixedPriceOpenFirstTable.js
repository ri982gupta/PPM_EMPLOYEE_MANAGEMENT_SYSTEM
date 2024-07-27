import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
} from "react-icons/fa";
import Loader from "../../Loader/Loader";
import FixedPriceOpenSecondTable from "./FixedPriceOpenSecondTable";
import { Link } from "react-router-dom";
import { Column } from "primereact/column";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { ColumnGroup } from "primereact/columngroup";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";
import CellRendererPrimeReactDataTable from "../../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { BiSearch } from "react-icons/bi";
import { FilterMatchMode } from "primereact/api";
import { environment } from "../../../environments/environment";
export default function FixedPriceOpenFirstTable(props) {
  const {
    data,
    storeFirstTab,
    setStorefirstTab,
    formData,
    storegrpahname,
    firstTabledata,
    showtable,
    visibleTable,
    setVisibleTable,
    firstTableData,
    setFirstTableData,
    showSecTable,
    setShowSecTable,
    getGraph,
    getDataBsedGrpah,
    PMReview,
    setPMReview,
    DMReview,
    setDMReview,
    FMReview,
    setFMReview,
    EMReview,
    isSQA,
    isDM,
    setAddmsg,
    setValidationMessage,
    // isAdmin
  } = props;
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  // const firstDateOfMonth = new Date(storeFirstTab.billingMonth);
  var date = new Date();
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const BillingFirstDate = moment(startDate).format("yyyy-MM-DD");
  // const lastDateOfMonth = new Date(
  //   firstDateOfMonth.getFullYear(),
  //   firstDateOfMonth.getMonth() + 1,
  //   0
  // );
  // const BillingLastDate = moment(lastDateOfMonth).format("yyyy-MM-DD");
  const [linkId, setLinkId] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [loader, setLoader] = useState(false);
  const billingMonth1 = formData.billingMonth;
  const lastDateOfMonth1 = moment(billingMonth1)
    .endOf("month")
    .format("YYYY-MM-DD");
  const [resourceInfo, setResourceInfo] = useState([]);
  const [initailSumOfBillingAmount, setInitailSumOfBillingAmount] = useState(0);
  const [totalApprovedHrs, setTotalApprovedHrs] = useState(0);
  var GetData;
  var billDetailsCount;
  var reviewerAction;
  const [projectInfo, setProjectInfo] = useState([]);
  const getResourceInfo = () => {
    axios({
      method: "post",
      // url: `http://localhost:8090/timeandexpensesms/getResourceInfo?BillingTsId=${linkId}`,
      url: baseUrl + `/timeandexpensesms/projectBilling`,
      data: {
        billId: linkId,
        isActive: 1,
        isAdmin: ["104335943", "1798", "126606014"].includes(loggedUserId)
          ? true
          : false,
        billMon: billingMonth1,
        isRefresh: 0,
        isDirty: false,
        usrId: loggedUserId,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        GetData = res.data.PpmBillingTsDtl;
        setInitailSumOfBillingAmount(
          res.data.PpmBillingTsDtl.reduce((acc, node) => {
            return acc + parseFloat(node.billTotHours * node.finalBillRate);
          }, 0)
        );
        setTotalApprovedHrs(
          res.data.PpmBillingTsDtl.reduce((acc, node) => {
            return acc + parseFloat(node.wrkApprvHours);
          }, 0)
        );
        setProjectInfo(res.data.tsInfo);
        billDetailsCount = res.data.BillDtlCnt;
        reviewerAction = res.data.reviewerAction;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["stdBillRate"] =
            GetData[i]["stdBillRate"] == null
              ? ""
              : GetData[i]["stdBillRate"].toFixed(2);

          GetData[i]["allocHours"] =
            GetData[i]["allocHours"] == null
              ? ""
              : GetData[i]["allocHours"].toFixed(2);

          GetData[i]["leaveHours"] =
            GetData[i]["leaveHours"] == null
              ? ""
              : GetData[i]["leaveHours"].toFixed(2);

          GetData[i]["wrkStdHours"] =
            GetData[i]["wrkStdHours"] == null
              ? ""
              : GetData[i]["wrkStdHours"].toFixed(2);

          GetData[i]["wrkOtHours"] =
            GetData[i]["wrkOtHours"] == null
              ? ""
              : GetData[i]["wrkOtHours"].toFixed(2);

          GetData[i]["wrkApprvHours"] =
            GetData[i]["wrkApprvHours"] == null
              ? ""
              : GetData[i]["wrkApprvHours"].toFixed(2);

          GetData[i]["billTotHours"] =
            GetData[i]["billTotHours"] == null
              ? ""
              : GetData[i]["billTotHours"].toFixed(2);

          GetData[i]["finalBillRate"] =
            GetData[i]["finalBillRate"] == null
              ? ""
              : GetData[i]["finalBillRate"].toFixed(2);

          GetData[i]["billAmount"] =
            GetData[i]["billAmount"] == null
              ? ""
              : GetData[i]["billAmount"].toFixed(2);

          GetData[i]["billOtHours"] =
            GetData[i]["billOtHours"] == null
              ? ""
              : GetData[i]["billOtHours"].toFixed(2);
        }

        setResourceInfo(GetData);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };

  const getFirstTable = () => {
    axios({
      method: "post",
      url: baseUrl + `/timeandexpensesms/getFirstTable`,
      data: {
        tsId: 0,
        isSQA:
          ["104335943", "1798", "126606014"].includes(loggedUserId) ||
          EMReview[0]?.role_type_id == 919
            ? false
            : isSQA,
        status: storegrpahname,
        tsName: "",
        customerId:
          formData.customerId == undefined ||
          formData.customerId == "" ||
          formData.customerId == "null"
            ? 0
            : formData.customerId,
        term: "monthly",
        startDate: formData.billingMonth
          ? formData.billingMonth
          : BillingFirstDate,
        // endDate: formData.billingMonth ? lastDateOfMonth1 : BillingLastDate,
        endDate: lastDateOfMonth1,
        billMonth: formData.billingMonth
          ? formData.billingMonth
          : BillingFirstDate,
        isDM: isDM,
        isAdmin:
          ["104335943", "1798", "126606014"].includes(loggedUserId) ||
          EMReview[0]?.role_type_id == 919
            ? true
            : false,
        loggedId: loggedUserId,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          data[i]["is_dirty"] =
            data[i]["is_dirty"] == null
              ? "No"
              : moment(data[i]["is_dirty"]).format("DD-MMM-YYYY");
          data[i]["refreshDate"] =
            data[i]["refreshDate"] == null
              ? "NA"
              : moment(data[i]["refreshDate"]).format("DD-MMM-YYYY");
          // data[i]["billingPeriod"]= data[i]["billingPeriod"] == null ? "" : moment(data[i]["billingPeriod"]).format("DD-MMM-YYYY");

          const billingPeriod = data[i]["billingPeriod"];
          if (billingPeriod) {
            const [startDate, endDate] = billingPeriod.split(" to ");
            const formattedStartDate = moment(startDate).format("DD-MMM-YY");
            const formattedEndDate = moment(endDate).format("DD-MMM-YY");
            data[i][
              "billingPeriod"
            ] = `${formattedStartDate} to ${formattedEndDate}`;
          }
        }

        let data1 = ["projectName", "billingTsId"];
        let linkRoutes = [""];
        setLinkColumns(data1);
        setLinkColumnsRoutes(linkRoutes);
        setFirstTableData(data);
        setTimeout(() => {
          setLoader(false);
        }, 1000);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  const abortController = useRef(null);
  const [projectInfoTab, setProjectinfoTab] = useState([]);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const getProjectinfo = () => {
    axios
      .get(baseUrl + `/timeandexpensesms/getProjectInfo?id=${linkId}`)
      .then((res) => {
        const GetData = res.data;
        setProjectinfoTab(GetData);
        setTimeout(() => {
          setLoader(false);
        }, 1000);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  //////////////////gettingProjectmanagerId
  const getProjectManagerID = () => {
    axios
      .get(
        baseUrl +
          `/timeandexpensesms/getPMid?id=${projectInfoTab[0]?.projectId}`
      )
      .then((res) => {
        const GetData = res.data;
        setPMReview(GetData);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  //////////////////gettingdeliveryManagerId
  const getDeliveryManagerID = () => {
    axios
      .get(
        baseUrl +
          `/timeandexpensesms/getDMid?id=${projectInfoTab[0]?.projectId}`
      )
      .then((res) => {
        const GetData = res.data;
        setDMReview(GetData);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  //////////////////gettingFinanceManagerId
  const getFinanceManagerID = () => {
    axios
      .get(baseUrl + `/timeandexpensesms/getFMid?id=${loggedUserId}`)
      .then((res) => {
        const GetData = res.data;
        setFMReview(GetData);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };
  useEffect(() => {
    firstTableData[0] &&
      setHeaderData(JSON.parse(JSON.stringify(firstTableData[0])));
  }, [firstTableData]);

  // =========Search Filters Code=============

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
      <div className="flex justify-content-between">
        <span></span>
        <span className="p-input-icon-left tableGsearch">
          <i className="pi pi-search" />
          <InputText
            defaultValue={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
            style={{ textAlign: "center", verticalAlign: "middle" }}
          />
        </span>
      </div>
    );
  };

  const header1 = renderHeader1();

  // =============================== END of Filter code ==================================

  const handleClick = (billingTsId, linkIds, name) => {
    window.scrollTo({ top: 10000, behavior: "smooth" });
    getFirstTable();
    setShowSecTable(true);
    setLinkId(billingTsId);
    setLoader(false);
    getProjectinfo();
    getResourceInfo();
    getProjectManagerID();
    getDeliveryManagerID();
    getFinanceManagerID();
  };
  const linkColumn = linkColumns[0];
  const link = firstTableData[linkColumn];
  const projectNameLink = (rowData) => {
    const linkIds = rowData.billingTsId;
    return (
      <Link
        title={rowData.projectName}
        onClick={(e) => handleClick(linkIds, link, e)}
      >
        {rowData.projectName}
      </Link>
    );
  };
  const customerNameTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.customerName}
      >
        {rowData.customerName}
      </div>
    );
  };
  const statusTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.status}
      >
        {rowData.status}
      </div>
    );
  };

  const billingPeriodTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.billingPeriod}
      >
        {rowData.billingPeriod}
      </div>
    );
  };

  const allocatedHrsTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.allocatedHrs}
      >
        {rowData.allocatedHrs}
      </div>
    );
  };

  const vacationHrsTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.vacationHrs}
      >
        {rowData.vacationHrs}
      </div>
    );
  };
  const actualHrsTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.actualHrs}
      >
        {rowData.actualHrs}
      </div>
    );
  };
  const otHrsTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.otHrs}
      >
        {rowData.otHrs}
      </div>
    );
  };
  const approvedHrsTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.approvedHrs}
      >
        {rowData.approvedHrs}
      </div>
    );
  };

  const actualBillHrsTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.actualBillHrs}
      >
        {rowData.actualBillHrs}
      </div>
    );
  };
  const otBillHrsTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.otBillHrs}
      >
        {rowData.otBillHrs}
      </div>
    );
  };
  const totalBillHrsTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.actualBillHrs + rowData.otBillHrs}
      >
        {rowData.actualBillHrs + rowData.otBillHrs}
      </div>
    );
  };
  const unbillHrsTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.unbillHrs}
      >
        {rowData.unbillHrs}
      </div>
    );
  };

  const billingAmountTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.billingAmount}
      >
        {rowData.billingAmount}
      </div>
    );
  };
  const discountAmountTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.discountAmount}
      >
        {rowData.discountAmount}
      </div>
    );
  };

  const netBillAmountTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.netBillAmount}
      >
        {rowData.netBillAmount}
      </div>
    );
  };
  const is_dirtyTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.is_dirty}
      >
        {rowData.is_dirty}
      </div>
    );
  };
  const refreshDateTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.refreshDate}
      >
        {rowData.refreshDate}
      </div>
    );
  };

  // useEffect(() => {
  //   getFirstTable();
  //   getProjectinfo();
  //   getResourceInfo();
  //   getProjectManagerID();
  //   getDeliveryManagerID();
  //   getFinanceManagerID();
  // }, [linkId]);

  useEffect(() => {
    getProjectinfo();
    getResourceInfo();
    getProjectManagerID();
    getDeliveryManagerID();
    getFinanceManagerID();
  }, [projectInfoTab[0]?.projectId]);

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Customer" style={{ textAlign: "center" }} rowSpan={2} />
        <Column header="Projects" style={{ textAlign: "center" }} rowSpan={2} />
        <Column header="Status" style={{ textAlign: "center" }} rowSpan={2} />
        <Column
          header="Billing Period"
          style={{ textAlign: "center" }}
          rowSpan={2}
        />
        <Column colSpan={5} header="Hours"></Column>
        <Column colSpan={3} header="Billing Hours"></Column>
        <Column colSpan={4} header="Billing Amount"></Column>
        <Column header="Is Data Modified" rowSpan={2}></Column>
        <Column header="Refresh Date" rowSpan={2}></Column>
      </Row>
      <Row>
        <Column header="Allocated"></Column>
        <Column header="Vocation"></Column>
        <Column header="Actual"></Column>
        <Column header="OT"></Column>
        <Column header="Approved"></Column>
        <Column header="Actual"></Column>
        <Column header="OT"></Column>
        <Column header="Total"></Column>
        <Column header="Unbilled"></Column>
        <Column header="Amount"></Column>
        <Column header="Discount Amount"></Column>
        <Column header="Net Amount"></Column>
      </Row>
    </ColumnGroup>
  );
  return (
    <>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader">
          <h2>
            {storegrpahname == "In PM Review" ||
            storegrpahname == "In DM Review" ||
            storegrpahname == "In Finance Review"
              ? storegrpahname.slice(3)
              : storegrpahname}{" "}
            Projects
          </h2>
        </div>
        <div className="darkHeader">
          {/* {loader ? <Loader handleAbort={handleAbort} /> : ""} */}
          {visibleTable && (
            <DataTable
              className="primeReactDataTable invoicingSearchTable"
              value={firstTableData}
              paginator
              rows={20}
              showGridlines
              headerColumnGroup={headerGroup}
              filters={filters1}
              header={header1}
            >
              <Column field="customerName" body={customerNameTooltip}></Column>
              <Column field="projectName" body={projectNameLink}></Column>
              <Column field="status" body={statusTooltip}></Column>
              <Column
                field="billingPeriod"
                body={billingPeriodTooltip}
              ></Column>
              <Column field="allocatedHrs" body={allocatedHrsTooltip}></Column>
              <Column field="vacationHrs" body={vacationHrsTooltip}></Column>
              <Column field="actualHrs" body={actualHrsTooltip}></Column>
              <Column field="otHrs" body={otHrsTooltip}></Column>
              <Column field="approvedHrs" body={approvedHrsTooltip}></Column>
              <Column
                field="actualBillHrs"
                body={actualBillHrsTooltip}
              ></Column>
              <Column field="otBillHrs" body={otBillHrsTooltip}></Column>
              <Column field="totalBillHrs" body={totalBillHrsTooltip}></Column>
              <Column field="unbillHrs" body={unbillHrsTooltip}></Column>
              <Column
                field="billingAmount"
                body={billingAmountTooltip}
              ></Column>
              <Column
                field="discountAmount"
                body={discountAmountTooltip}
              ></Column>
              <Column
                field="netBillAmount"
                body={netBillAmountTooltip}
              ></Column>
              <Column field="is_dirty" body={is_dirtyTooltip}></Column>
              <Column field="refreshDate" body={refreshDateTooltip}></Column>
            </DataTable>
          )}
        </div>
      </div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {showSecTable == true ? (
        <FixedPriceOpenSecondTable
          firstTableData={firstTableData}
          setProjectinfoTab={setProjectinfoTab}
          projectInfoTab={projectInfoTab}
          projectInfo={projectInfo}
          linkId={linkId}
          formData={formData}
          setLoader={setLoader}
          PMReview={PMReview}
          DMReview={DMReview}
          storegrpahname={storegrpahname}
          FMReview={FMReview}
          getGraph={getGraph}
          getDataBsedGrpah={getDataBsedGrpah}
          setAddmsg={setAddmsg}
          // addmsg={addmsg}
          setValidationMessage={setValidationMessage}
          resourceInfo={resourceInfo}
          setResourceInfo={setResourceInfo}
          billDetailsCount={billDetailsCount}
          reviewerAction={reviewerAction}
          getResourceInfo={getResourceInfo}
          headerData={headerData}
          initailSumOfBillingAmount={initailSumOfBillingAmount}
          totalApprovedHrs={totalApprovedHrs}
          setTotalApprovedHrs={setTotalApprovedHrs}
        />
      ) : (
        ""
      )}
    </>
  );
}
