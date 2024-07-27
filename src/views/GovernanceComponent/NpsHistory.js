import React from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

function NpsHistory({ openPopup, setOpenPopup, id, countData }) {
  console.log(countData);
  return (
    <div>
      <CModal
        visible={openPopup}
        size="xl"
        // className="ui-dialog"
        onClose={() => setOpenPopup(false)}
      >
        <CModalHeader className="" style={{ cursor: "all-scroll" }}>
          <CModalTitle>
            <span className=""> Customer Survey History Details</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="darkHeader">
            <DataTable
              value={countData}
              showGridlines
              className="primeReactDataTable"
              emptyMessage="No Records To View"
              paginator
              rows={25}
              paginationPerPage={5}
              paginationRowsPerPageOptions={[10, 25, 50]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
              currentPageReportTemplate="View {first} - {last} of {totalRecords} "
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              rowsPerPageOptions={[10, 25, 50]}
            >
              <Column field="custMgr" header="Project Manager" />
              <Column field="customer_emails" header="Client Email" />
              <Column field="surveydate" header="Survey Date" />
              <Column field="npv" header="NPS" />
              <Column field="npv_stat_txt" header="Status" />
            </DataTable>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
}
export default NpsHistory;
