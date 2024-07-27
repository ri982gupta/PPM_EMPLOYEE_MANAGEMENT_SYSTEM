import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import "../../App.scss";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import Invoicedeletepopup from "./Invoicedeletepopup";

function DisplayTable(props) {
  const { setTableData, tableData } = props;
  console.log(props.tableData);
  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="" rowSpan={2} />
        <Column header="BU" rowSpan={2} />
        <Column header="Customer" rowSpan={2} />
        <Column header="Division" rowSpan={2} />
        <Column header="Engagement" rowSpan={2} />
        <Column header="Project Name" rowSpan={2} />
        <Column header=" Contract Terms" rowSpan={2} />
        <Column header=" Project Stage" rowSpan={2} />
        <Column header="PO#" rowSpan={2} />

        <Column
          header="Invoice Details"
          colSpan={6}
          style={{ textAlign: "center" }}
        />
        <Column header="Total Amount" rowSpan={2} />
        <Column header="Billing Details" colSpan={5} />
      </Row>

      <Row>
        <Column header="Invoice#" field="invoiceNumber" />
        <Column header=" Invoice Name" field="invoiceName" />
        <Column header="Created Date" field="invoiceDateCreated" />
        <Column header="Period" field="invoicePeriod" />
        <Column header="Status" field="invoiceStatus" />
        <Column header="Cur." field="invoiceCurrency" />
        <Column header="Billing Status" field="billingStatus" />
        <Column header="Timesheet Amt" field="billingTimesheetAmount" />
        <Column header="Project Discount" field="projectDiscount" />
        <Column header=" Expenses Amt" field="billingExpenseAmount" />
        <Column header="  Milestones Amt" field="billingMilestoneAmount" />
      </Row>

      {/* <Row>
       
      </Row> */}
    </ColumnGroup>
  );

  const LinkTemplate = (data) => {
    return (
      <Link
        target="_blank"
        to={`/invoice/create?invoiceId:${data.id}`}
        // to={rou[0] + ":" + data[rou[1]]}
        style={{ textDecoration: "none" }}
        onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        title={data.invoiceNumber}
      >
        {data.invoiceNumber}
      </Link>
    );
  };
  const clickHanlderIQA = (invoiceId) => {
    setOpenIQA(true);
    setUid(invoiceId);
  };
  const [openIQA, setOpenIQA] = useState(false);
  const [uid, setUid] = useState(0);
  const DeleteIcon = (data) => {
    return (
      <td>
        {data.invoiceStatus === "Draft" ? (
          <AiFillDelete
            style={{ cursor: "pointer" }}
            title="Delete Row"
            className="tableDelete"
            onClick={() => {
              clickHanlderIQA(data.invoiceId);
            }}
            disabled
          />
        ) : (
          ""
        )}
      </td>
    );
  };
  // const [filters, setFilters] = useState({
  //   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //   name: {
  //     operator: FilterOperator.AND,
  //     constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  //   },
  //   "country.name": {
  //     operator: FilterOperator.AND,
  //     constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  //   },
  //   representative: { value: null, matchMode: FilterMatchMode.IN },
  //   status: {
  //     operator: FilterOperator.OR,
  //     constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  //   },
  // });
  // const [selectedCustomer, setSelectedCustomer] = useState(null);
  // console.log(tableData, "data-------------------");
  // const onGlobalFilterChange = (event) => {
  //   const value = event.target.value;
  //   let _filters = { ...filters };

  //   _filters["global"].value = value;

  //   setFilters(_filters);
  // };

  // const renderHeader = () => {
  //   const value = filters["global"] ? filters["global"].value : "";

  //   return (
  //     <div style={{ marginLeft: "85%" }}>
  //       <span className="p-input-icon-left">
  //         <i className="pi pi-search" />
  //         <InputText
  //           type="search"
  //           style={{ float: "right" }}
  //           value={value || ""}
  //           onChange={(e) => onGlobalFilterChange(e)}
  //           placeholder="Global Search"
  //         />
  //       </span>
  //     </div>
  //   );
  // };
  // const header = renderHeader();

  return (
    <div className="primeReactDataTable">
      <DataTable
        value={tableData}
        paginator
        rows={10}
        // header={header}
        // filters={filters}
        // onFilter={(e) => setFilters(e.filters)}
        // selection={selectedCustomer}
        // onSelectionChange={(e) => setSelectedCustomer(e.value)}
        // selectionMode="single"
        // dataKey="id"
        // stateStorage="session"
        // stateKey="dt-state-demo-local"
        emptyMessage="No Records found."
        // tableStyle={{ minWidth: "50rem" }}
        headerColumnGroup={headerGroup}
        //   footerColumnGroup={footerGroup}
        // tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="" body={DeleteIcon} />
        <Column field="BU" />
        <Column field="customer" />
        <Column field="division" />
        <Column field="customer" />
        <Column field="engagement" />
        <Column field="projectName" />
        <Column field="contractTerms" />
        <Column field="prjStage" />
        <Column field="poNumber" />
        <Column field="invoiceNumber" body={LinkTemplate} />
        <Column field="invoiceName" />
        <Column field="invoiceDateCreated" />
        <Column field="invoicePeriod" />
        <Column field="invoiceStatus" />
        <Column field="invoiceCurrency" />
        <Column field="billingStatus" />
        <Column field="billingTimesheetAmount" />
        <Column field="projectDiscount" />
        <Column field="billingExpenseAmount" />
        <Column field="billingMilestoneAmount" />
        <Column />
      </DataTable>

      <div
        style={{ backgroundColor: "#ffffff", fontSize: "11px" }}
        className="alert alert-warning"
      >
        <FaInfoCircle />
        &nbsp; Please select project and its Timesheet, Expenses and Milestones
        for Invoice.
        <br />
        <FaInfoCircle />
        &nbsp;You can select Timesheet Amount, Expenses Amount and Milestones
        Amount shows up on click of Timesheet Amount, Expenses Amount and
        Milestones Amount.
        <br />
        <FaInfoCircle />
        &nbsp; Only selected Timesheet, Expenses and Milestones will be
        considered for invoice generation.
      </div>
      {openIQA ? (
        <Invoicedeletepopup openIQA={openIQA} setOpenIQA={setOpenIQA} />
      ) : (
        ""
      )}
    </div>
  );
}
export default DisplayTable;
