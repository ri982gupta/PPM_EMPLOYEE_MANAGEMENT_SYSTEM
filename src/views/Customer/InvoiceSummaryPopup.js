import React, { useState, useEffect, useRef } from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";

import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Draggable from "react-draggable";
const InvoiceSummaryPopup = (props) => {
  const { invSummaryPopUp, setInvSummaryPopUp, customerId } = props;

  const [tableData, setTableData] = useState([]);
  const baseUrl = environment.baseUrl;

  useEffect(() => {
    getTableData();
  }, []);

  const getTableData = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/customersms/Customers/getInvoiceSummary?cid=${customerId}`,
    }).then((res) => {
      setTableData(res.data);
    });
  };
  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="" colSpan={5} />
        <Column
          header="Invoice Amount"
          colSpan={5}
          style={{ textAlign: "center" }}
        />
      </Row>
      <Row>
        <Column header="Invoice Number" field="num" />
        <Column header="Date" field="Date" />
        <Column header="Invoice Period" field="InvoicePeriod" />
        <Column header="Status" field="Status" />
        <Column header="Project" field="Project" />
        <Column header="Timesheet" field="Timesheet" />
        <Column header="Expenses" field="Expenses" />
        <Column header="Milestones" field="Milestones" />
        <Column header="Tax" field="Tax" />
        <Column header="Total" field="Total" />
      </Row>
    </ColumnGroup>
  );

  return (
    <div>
      <Draggable>
        <CModal
          alignment="center"
          backdrop="static"
          size="xl"
          visible={invSummaryPopUp}
          onClose={() => {
            setInvSummaryPopUp(false);
          }}
        >
          <CModalHeader className="" style={{ cursor: "all-scroll" }}>
            <CModalTitle>
              <span className="ft16">Invoice Summary</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="group-content row">
              <div className="col-md-12 row mb-2">
                <DataTable
                  className="primeReactDataTable invoicingSearchTable customerEngament"
                  paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                  currentPageReportTemplate="{first} to {last} of {totalRecords}"
                  rowsPerPageOptions={[10, 25, 50]}
                  value={tableData}
                  paginator
                  rows={10}
                  onFilter={(e) => setFilters(e.filters)}
                  onSelectionChange={(e) => setSelectedCustomer(e.value)}
                  dataKey="id"
                  showGridlines
                  stateStorage="session"
                  stateKey="dt-state-demo-local"
                  responsiveLayout="scroll"
                  emptyMessage="No records to view"
                  headerColumnGroup={headerGroup}
                >
                  <Column header="Invoice Number" field="num" />
                  <Column header="Date" field="Date" />
                  <Column header="Invoice Period" field="InvoicePeriod" />
                  <Column header="Status" field="Status" />
                  <Column header="Project" field="Project" />
                  <Column header="Timesheet" field="Timesheet" />
                  <Column header="Expenses" field="Expenses" />
                  <Column header="Milestones" field="Milestones" />
                  <Column header="Tax" field="Tax" />
                  <Column header="Total" field="Total" />
                </DataTable>
              </div>
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
};

export default InvoiceSummaryPopup;
