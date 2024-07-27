import React, { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import ResourceHrsTable from "./ResourceHrsTable";
import axios from "axios";
import { environment } from "../../environments/environment";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { FaHistory, FaSave } from "react-icons/fa";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import "./SubkTimesheetTable.scss";
import { Popover, Button } from "@mui/material";
import { Checkbox } from "primereact/checkbox";

function SubkTimesheetTable(props) {
  const {
    tableData,
    formData,
    columnState,
    searchHandle1,
    setTableData,
    setAddmsg,
  } = props;
  const [dispResdata, setDispResData] = useState(false);
  const [resData, setResData] = useState([]);
  const [resId, setResId] = useState();
  const baseUrl = environment.baseUrl;
  const [headerData, setHeaderData] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [commentsData, setCommentsData] = useState([]);
  const [validationMsg, setValidationMessage] = useState(false);
  const dispatch = useDispatch();
  const [checkboxSelect, setCheckboxSelect] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [postData, setPostData] = useState([]);
  const [statusId, setStatusId] = useState("");
  const [prevResourceId, setPrevResourceId] = useState([]);

  const handleStatusChange = (newValue, resourceIds) => {
    // Ensure resourceIds is an array
    if (!Array.isArray(resourceIds)) {
      // If not an array, create an array with the single value
      resourceIds = [resourceIds];
    }
    setPostData((prevPostData) => {
      let updatedData = [...prevPostData];

      resourceIds.forEach((resourceId) => {
        const resourceIndex = updatedData.findIndex(
          (item) => item.resource_id === resourceId
        );

        if (resourceIndex !== -1) {
          updatedData = updatedData.map((item, index) => {
            if (index === resourceIndex) {
              return { ...item, status_id: newValue };
            }
            return item;
          });
        } else {
          updatedData.push({ resource_id: resourceId, status_id: newValue });
        }
      });

      return updatedData;
    });
  };

  const handleChange = (event) => {
    setCheckboxSelect(event.value);
    const latestResourceId = event.value?.reduce((latest, item) => {
      // Check if item has resource_id and it is greater than the current latest resource_id
      return item.resource_id;
    }, null);
    const selectedAllResourceIds = event.value.map((item) => item.resource_id);
    if (event.type == "checkbox") {
      setStatusId(latestResourceId);
    } else if (event.type == "all") {
      setStatusId(selectedAllResourceIds);
    }
    if (event.type === "checkbox" || event.type == "all") {
      const selectedResourceIds = event.value.map((item) => item.resource_id);
      if (selectedResourceIds.length > 0) {
        const clickedResourceId = event.value?.resource_id;
        if (selectedResourceIds.includes(parseInt(clickedResourceId))) {
          setPopoverOpen(false);
        } else {
          setAnchorEl(event.originalEvent.target);
          setPopoverOpen(true);
        }
      } else {
        // Close the popover if no checkboxes are selected
        setPopoverOpen(false);
      }
    }
  };

  const saveApprovals = () => {
    let data = [];
    checkboxSelect.forEach((item) => {
      if (item.resource_id !== 0) {
        const obj = {};
        obj["resId"] = item.resource_id;
        const postDataItem = postData.find(
          (postDataItem) =>
            postDataItem.resource_id === item.resource_id &&
            postDataItem.resource_id !== 0
        );
        if (postDataItem) {
          obj["Invoice_status_id"] = postDataItem.status_id;
        } else {
          obj["Invoice_status_id"] = "";
        }
        obj["Approval_dt"] = moment(new Date()).format("YYYY-MM-DD");
        obj["Approver_id"] = +loggedUserId;
        obj["month"] = moment(formData?.FromDt).format("YYYY-MM-DD");
        obj["Invoice_hrs"] = 0;
        data.push(obj);
      }
    });
    axios({
      method: "post",
      url: baseUrl + `/VendorMS/subkTimesheet/saveApprovals`,
      data: data,
    }).then((resp) => {
      setAddmsg(true);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
      setTimeout(() => {
        setAddmsg(false);
        setCheckboxSelect([]);
        setStatusId("");
        searchHandle1();
        ResHrsDetails(prevResourceId, formData.FromDt);
      }, 3000);
    });
  };

  const getComments = (id) => {
    const [year, month] = formData?.FromDt.split("-");
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const endDate = `${year}-${month}-${lastDayOfMonth}`;
    axios({
      url: baseUrl + `/VendorMS/subkTimesheet/getCommentsHistory`,
      method: "post",
      data: {
        resource_id: +id,
        start_date: formData?.FromDt,
        end_date: endDate,
      },
    })
      .then((res) => {
        const data = res.data;
        setCommentsData(data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  const CommentsPopup = () => {
    const updateby = (data) => {
      return (
        <div title={data.updated_by_name} className="ellipsis">
          {data.updated_by_name}
        </div>
      );
    };

    const updatebydate = (data) => {
      return (
        <div
          title={moment(data.updated_by_dt).format("DD-MMM-yy")}
          className="ellipsis"
          style={{ textAlign: "center" }}
        >
          {moment(data.updated_by_dt).format("DD-MMM-yy")}
        </div>
      );
    };

    const comments = (data) => {
      if (!data.comments || data.comments.trim() === "") {
        return null; // Return null if Comments is null or empty
      }
      const comments = data.comments;
      const text = comments.split(":").pop().trim();

      return (
        <div title={text} className="ellipsis ">
          {text}
        </div>
      );
    };
    return (
      <CModal
        visible={popUp}
        size="m"
        backdrop={"static"}
        onClose={() => setPopUp(false)}
      >
        <CModalHeader className="" style={{ cursor: "all-scroll" }}>
          <CModalTitle>History</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <DataTable
            value={commentsData}
            pagination
            paginator
            className="primeReactDataTable darkHeader"
            rows={10}
            showGridlines
            rowsPerPageOptions={[10, 25, 50]}
            emptyMessage="No Data Found"
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          >
            <Column
              header="Updated By"
              field="updated_by_name"
              body={updateby}
              sortable
            />
            <Column
              header="Updated on"
              field="updated_by_dt"
              body={updatebydate}
              sortable
            />
            <Column
              header="Comments"
              field="comments"
              body={comments}
              sortable
            />
          </DataTable>
        </CModalBody>
      </CModal>
    );
  };

  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    setFilters({
      global: filtersData["contains"],
    });
  }, [headerData]);
  useEffect(() => {
    tableData[0] && setHeaderData(JSON.parse(JSON.stringify(tableData[0])));
  }, [tableData]);

  const exportExcel = async () => {
    const exceljs = await import("exceljs");
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("data");
    const excludedProperties = ["resource_id", "billrate", "status"];
    const customSortOrder = [
      "emp_id",
      "resource",
      "Vendor",
      "Customer",
      "cost",
      "RRcost",
      "RecRevenue",
      "Total_ActualHrs",
      "Total_ApprovedHrs",
      "Total_InvoicebleHrs",
      "Comments",
      "Invoice_Status",
    ];
    const getHeaderDisplayName = (header) => {
      const headerMappings = {
        emp_id: "Emp Id",
        resource: "Resource",
        Vendor: "Vendor",
        Customer: "Customer",
        cost: "Cost",
        RRcost: "RR Cost",
        RecRevenue: "Recognized",
        Total_ActualHrs: "Total Actual Hours",
        Total_ApprovedHrs: "Toal Approved Hours",
        Total_InvoicebleHrs: "Total Invoiceble Hours",
        Comments: "Comments",
        Invoice_Status: "Status",
      };
      return headerMappings[header] || header;
    };

    const extractLastComment = (comments) => {
      if (!comments) {
        return ""; // Return an empty string if comments are null
      }
      const lastComment = comments?.split("<br />").pop(); // Get the last item after splitting by '<br />'
      const parts = lastComment?.split(": ");
      return parts.length > 1 ? parts.slice(2).join(": ") : "";
    };

    if (tableData.length > 0) {
      const headers = Object.keys(tableData[0])
        .filter((header) => !excludedProperties.includes(header))
        .sort(
          (a, b) => customSortOrder.indexOf(a) - customSortOrder.indexOf(b)
        );
      const headerDisplayNames = headers.map(getHeaderDisplayName);
      worksheet.addRow(headerDisplayNames).font = { bold: true };
      tableData.forEach((rowData) => {
        const values = headers.map((header) => {
          if (header === "Comments") {
            return extractLastComment(rowData[header]);
          } else {
            return rowData[header];
          }
        });
        worksheet.addRow(values);
      });
    }
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "Subk Timesheets.xlsx");
    });
  };
  const renderHeader = () => {
    return (
      <div className="primeTableSearch execel-and-search-btn">
        <InputText
          className="globalFilter"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
        <div className="exportBtn">
          <span
            size="2em"
            title="Export to Excel"
            className="pi pi-file-excel excel"
            // style={{ color: "green" }}
            cursor="pointer"
            onClick={exportExcel}
          />
        </div>
      </div>
    );
  };
  const header = renderHeader();
  const ResHrsDetails = (data, date) => {
    setValidationMessage(false);
    setDispResData(false);
    setResId(data.resource_id);
    axios({
      method: "post",
      url: baseUrl + `/VendorMS/subkTimesheet/getResourceTimeSheetData`,
      data: {
        resId: data.resource_id,
        month: date,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        var resp = response.data;
        resp.forEach((item) => {
          if (item.id === 999 || item.id === 9) {
            item.name = "";
          }
        });

        setResData(resp);
        setDispResData(true);
        dispatch(updateResourceComments(""));
        setTimeout(() => {
          window.scrollTo({
            top: 500,
            behavior: "smooth", // This adds a smooth scrolling effect, optional
          });
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      if (dispResdata) {
        window.scrollTo({
          top: 700,
          behavior: "smooth",
        });
      }
    }, 1000);
  }, [dispResdata]);

  const handleRosource = (data) => {
    return (
      <div className="ellipsis">
        <span
          data-toggle="tooltip"
          title={data.resource}
          className={data.resource === "Summary" ? "TimeSheetSummary" : ""}
          style={{
            cursor: data.resource !== "Summary" ? "pointer" : "",
            color: data.resource !== "Summary" ? "#2e88c5" : "",
          }}
          onClick={(e) => {
            setPrevResourceId(data);
            ResHrsDetails(data, formData.FromDt);
            setPopUp(false);
          }}
        >
          {data.resource}
        </span>
      </div>
    );
  };
  const handleVendor = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.Vendor}>
        {data.Vendor}
      </div>
    );
  };

  const handleCustomer = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.Customer}>
        {data.Customer}
      </div>
    );
  };
  const handlecost = (data) => {
    const costAsNumber = parseFloat(data.cost);
    const formattedCost = costAsNumber.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <div
        className="ellipsis right"
        data-toggle="tooltip"
        title={formattedCost == "NaN" ? "" : formattedCost}
        style={{ textAlign: "right" }}
      >
        {formattedCost == "NaN" ? "" : formattedCost}
      </div>
    );
  };

  const handleRRcost = (data) => {
    const costAsNumber = parseFloat(data.RRcost);
    const formattedCost = costAsNumber.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <div
        className="ellipsis right"
        data-toggle="tooltip"
        title={formattedCost == "NaN" ? "" : formattedCost}
        style={{ textAlign: "right" }}
      >
        {formattedCost == "NaN" ? "" : formattedCost}
      </div>
    );
  };

  const handleRecRevenue = (data) => {
    const costAsNumber = parseFloat(data.RecRevenue);
    const formattedCost = costAsNumber.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <div
        className="ellipsis right"
        data-toggle="tooltip"
        title={formattedCost == "NaN" ? "" : formattedCost}
        style={{ textAlign: "right" }}
      >
        {formattedCost == "NaN" ? "" : formattedCost}
      </div>
    );
  };
  const handlebillrate = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.billrate}>
        {data.billrate}
      </div>
    );
  };
  const handleActualdHrs = (data) => {
    const totalActualHrs =
      data.Total_ActualHrs != null ? parseFloat(data.Total_ActualHrs) : 0;
    const formattedCost = totalActualHrs.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return (
      <div
        data-toggle="tooltip"
        title={formattedCost}
        style={{ textAlign: "right" }}
      >
        {formattedCost}
      </div>
    );
  };
  const handleApprovedHrs = (data) => {
    const costAsNumber =
      data.Total_ApprovedHrs != null ? parseFloat(data.Total_ApprovedHrs) : 0;
    const formattedCost = costAsNumber.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <div
        data-toggle="tooltip"
        title={formattedCost}
        style={{ textAlign: "right" }}
      >
        {formattedCost}
      </div>
    );
  };
  const handleInvoicebleHrs = (data) => {
    const costAsNumber =
      data.Total_InvoicebleHrs != null
        ? parseFloat(data.Total_InvoicebleHrs)
        : 0;
    const formattedCost = costAsNumber.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return (
      <div
        data-toggle="tooltip"
        title={formattedCost}
        style={{ textAlign: "right" }}
      >
        {formattedCost}
      </div>
    );
  };

  const handleComments = (data) => {
    if (!data.Comments || data.Comments.trim() === "") {
      return null;
    }
    const cleanedComments = data.Comments.replace(/<b>|<\/b>/g, "");
    const commentsArray = cleanedComments.split("<br />");
    const testingData = commentsArray
      .map((comment) => {
        const parts = comment.split(": ");
        return parts.length > 2 ? parts.slice(2).join(": ") : "";
      })
      .filter((item) => item !== "");
    return (
      <>
        <div className="ellipsis row">
          <span className="col-8 subkComments" title={testingData}>
            {testingData}
          </span>
          <FaHistory
            className="HistoryIconSubk col-4"
            title="History"
            onClick={() => {
              const id = data.resource_id;
              getComments(id);
              setPopUp(true);
            }}
          />
        </div>
      </>
    );
  };

  const empId = (data) => {
    return (
      <div title={data.emp_id} className="ellipsis">
        {data.emp_id}
      </div>
    );
  };
  const [check, setCheck] = useState([]);
  let rowClassName = "HideCheckox";
  useEffect(() => {}, [tableData]);

  const determineRowClassName = (rowData) => {
    if (rowData.status === "no") {
      return "disabledSubkCheckbox";
    } else if (rowData.Invoice_Status === "Approved") {
      return "HideCheckbox";
    } else {
      return "";
    }
  };

  return (
    <div>
      {" "}
      <div className="darkHeader ">
        <DataTable
          value={tableData}
          showGridlines
          rowsPerPageOptions={[10, 25, 50]}
          paginator
          className="primeReactDataTable SubkTimeSheet"
          rows={25}
          emptyMessage={<center>No Data found.</center>}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          header={header}
          tableStyle={{ minWidth: "80rem" }}
          filters={filters}
          globalFilterFields={[
            "Vendor",
            "Customer",
            "Total_ApprovedHrs",
            "resource",
            "Comments",
            "cost",
            "billrate",
            "RRcost",
            "RecRevenue",
          ]}
          rowClassName={(rowData) => determineRowClassName(rowData)}
          selectionMode="checkbox"
          selection={checkboxSelect}
          // onSelect={"checkbox"}
          onSelectionChange={(e) => {
            if (e.type == "checkbox" || e.type == "all") {
              handleChange(e);
            }
          }}
        >
          <Column selectionMode="multiple"></Column>
          <Column
            header="Emp Id"
            field="emp_id"
            body={empId}
            // headerStyle={{ textAlign: "center" }}
            sortable
            // style={{ minWidth: "94px" }}
          />
          <Column
            field="resource"
            header="Resource"
            body={handleRosource}
            // style={{ minWidth: "130px", textAlign: "center" }}
            sortable
          />
          <Column
            field="Vendor"
            header="Vendor"
            body={handleVendor}
            sortable
            // style={{ minWidth: "130px", textAlign: "center" }}
          />
          <Column
            field="Customer"
            header="Customer"
            body={handleCustomer}
            // style={{ minWidth: "145px", textAlign: "center" }}
            sortable
          />
          <Column
            field="cost"
            header="Cost ($)  "
            body={handlecost}
            style={{ minWidth: "95px", textAlign: "center" }}
            sortable
            // style={{ minWidth: "70px", textAlign: "center" }}
          />
          {(columnState == "RRcost" || columnState == "-1") && (
            <Column
              field="RRcost"
              header="RR Cost ($)"
              body={handleRRcost}
              style={{ minWidth: "100px", textAlign: "center" }}
              sortable
            />
          )}
          {(columnState == "RecRevenue" || columnState == "-1") && (
            <Column
              field="RecRevenue"
              header="Recognized ($)"
              body={handleRecRevenue}
              style={{ minWidth: "125px", textAlign: "center" }}
              sortable
            />
          )}
          {/* <Column
            field="billrate"
            header="Billrate"
            body={handlebillrate}
            style={{ minWidth: "80px", textAlign: "center" }}
            sortable
          /> */}

          {(columnState == "act" || columnState == "-1") && (
            <Column
              field="Total_ActualHrs"
              header="Total Actual Hours"
              body={handleActualdHrs}
              style={{ minWidth: "123px", textAlign: "center" }}
              sortable
            />
          )}

          {(columnState === "apr" || columnState == "-1") && (
            <Column
              field="Total_ApprovedHrs"
              header="Total Approved Hours"
              body={handleApprovedHrs}
              sortable
              style={{ minWidth: "123px", textAlign: "center" }}
            />
          )}
          {(columnState === "inv" || columnState == "-1") && (
            <Column
              field="Total_InvoicebleHrs"
              header="Total Invoiceable Hours"
              body={handleInvoicebleHrs}
              sortable
              style={{ minWidth: "140px", textAlign: "center" }}
            />
          )}
          <Column
            feild="Comments"
            header="Comments"
            body={handleComments}
            sortable
          />
        </DataTable>
        <div className="col-md-12 btn-container center ">
          <button
            className="btn btn-primary mt-2 mb-2"
            value="Approved"
            onClick={(e) => {
              saveApprovals(e);
            }}
            disabled={checkboxSelect?.length == 0}
            style={{
              cursor: checkboxSelect?.length === 0 ? "no-drop" : "",
              opacity: checkboxSelect?.length === 0 ? 0.5 : 1,
            }}
          >
            <FaSave />
            Save
          </button>
        </div>
      </div>
      {dispResdata && (
        <ResourceHrsTable
          tableData={resData}
          resId={resId}
          payloadData={formData}
          ResHrsDetails={ResHrsDetails}
          searchHandle1={searchHandle1}
          setValidationMessage={setValidationMessage}
          validationMsg={validationMsg}
        />
      )}
      {popUp && <CommentsPopup />}
      <div>
        <Popover
          className="approvalBtns"
          open={isPopoverOpen}
          anchorEl={anchorEl}
          onClose={() => setPopoverOpen(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <div>
            <Button
              variant="contained"
              color="success"
              size="small"
              value="1472"
              style={{ fontSize: "10px" }}
              onClick={(e) => {
                handleStatusChange(e.target.value, statusId);
                setPopoverOpen(false);
              }}
            >
              Approve &#10004;
            </Button>
            <br />
            <Button
              variant="contained"
              color="error"
              size="small"
              value="1473"
              style={{ fontSize: "10px", width: "82px" }}
              onClick={(e) => {
                // handleReject();
                handleStatusChange(e.target.value, statusId);
                setPopoverOpen(false);
              }}
            >
              Reject &#10006;
            </Button>
          </div>
        </Popover>
      </div>
    </div>
  );
}
export default SubkTimesheetTable;
