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
import "./InvoicingSearchTable.scss";

function InvoicingSearchTable(props) {
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
        style={{
          whiteSpace: "nowrap !important",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        data-toggle="tooltip"
        title={data.invoiceNumber}
        to={`/invoice/create?invoiceId:${data.id}`}
        target="_blank"
      >
        {" "}
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

  const Milestones = (data) => {
    return (
      <>
        {data.billingMilestoneAmount === null
          ? "0.00"
          : data.billingMilestoneAmount?.toLocaleString("en-US") + ".00"}
      </>
    );
  };
  const TotalAmount = (data) => {
    return (
      <>
        {" "}
        {data.invoiceTotalAmt === 0
          ? "0.00"
          : data.invoiceTotalAmt?.toLocaleString("en-US")}
      </>
    );
  };

  const projectDiscount = (data) => {
    return <>{data.projectDiscount == 0 ? "0.00" : data.projectDiscount}</>;
  };
  const TimeSheet = (data) => {
    return (
      <>
        {data.billingTimesheetAmount == null
          ? "0.00"
          : data.billingTimesheetAmount?.toLocaleString("en-US") + ".00"}
      </>
    );
  };
  const BillingExpensiveAmount = (data) => {
    return (
      <>
        {data.billingExpenses == null ? "0.00" : data.billingExpenses + ".00"}
      </>
    );
  };
  const Currency = (data) => {
    return <> {data.invoiceCurrency === "&#8377" ? "₹" : "$"}</>;
  };
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

  return (
    <div>
      <DataTable
        className="primeReactDataTable invoicingSearchTable"
        value={tableData}
        paginator
        rows={10}
        showGridlines
        responsiveLayout="scroll"
        emptyMessage="No Records found."
        headerColumnGroup={headerGroup}
      >
        <Column field="" body={DeleteIcon} />
        <Column field="BU" />
        <Column field="customer" />
        <Column field="division" />
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
        <Column body={Currency} />
        <Column body={TotalAmount} />
        <Column field="billingStatus" />
        <Column body={TimeSheet} />

        <Column body={projectDiscount} />
        <Column body={BillingExpensiveAmount} />
        <Column body={Milestones} />
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
export default InvoicingSearchTable;
