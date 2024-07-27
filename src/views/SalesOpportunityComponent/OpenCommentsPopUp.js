import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";

const OpenCommentsPopUp = (props) => {
  const { setPopUp, popUp, commentId } = props;
  const [commentsData, setCommentsData] = useState([]);
  const baseUrl = environment.baseUrl;

  const getDealHubComments = () => {
    axios({
      url:
        baseUrl +
        `/SalesMS/sales/getAllCommentsOfOpportunity?participantId=${commentId}`,
    }).then((res) => {
      let dataa = res.data;
      setCommentsData(dataa);
    });
  };

  useEffect(() => {
    commentId == "" ? "" : getDealHubComments();
  }, [commentId]);

  return (
    <div>
      <CModal
        alignment="center"
        backdrop="static"
        visible={popUp}
        size="lg"
        className="ui-dialog"
        onClose={() => {
          setPopUp(false);
        }}
      >
        <CModalHeader className="">
          <CModalTitle>
            <span className="">Overall Comments</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <DataTable
            value={commentsData}
            className="primeReactDataTable darkHeader"
            editMode="row"
            rows={25}
            showGridlines
            dataKey="id"
            emptyMessage="No Data Found"
            paginator
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 15, 25, 50]}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            currentPageReportTemplate="View {first} - {last} of {totalRecords} "
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
          >
            <Column
              field="role"
              header="Role"
              body={(rowData) => {
                return (
                  <div className="ellipsis" title={rowData.role}>
                    {rowData.role}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="owner"
              header="Resource Name"
              body={(rowData) => {
                return (
                  <div className="ellipsis" title={rowData.owner}>
                    {rowData.owner}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="comments"
              header="Comments"
              style={{ cursor: "pointer" }}
              body={(rowData) => {
                return (
                  <div className="ellipsis" title={rowData.comments}>
                    {rowData.comments}
                  </div>
                );
              }}
            ></Column>
            <Column
              field="date"
              header="Date"
              sortable
              body={(rowData) => {
                return (
                  <div
                    title={moment(rowData.date).format("DD-MMM-yyyy")}
                    style={{ textAlign: "center" }}
                  >
                    {moment(rowData.date).format("DD-MMM-yyyy")}
                  </div>
                );
              }}
            ></Column>
          </DataTable>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default OpenCommentsPopUp;
