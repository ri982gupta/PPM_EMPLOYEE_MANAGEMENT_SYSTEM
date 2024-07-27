import React, { useState, useEffect } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { environment } from "../../environments/environment";
import moment from "moment";
import axios from "axios";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import AllocationDashboardActionTable from "./AllocationDashboardActionTable";
import "./DashboardAllocationTable.scss";

function DashboardPopup(props) {
  const { openPopup, setOpenPopup, resid, resName } = props;
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  let rows = 5;
  const baseUrl = environment.baseUrl;

  useEffect(() => {
    getActionItemDetails();
  }, []);
  const align = (data) => {
    return (
      <div className="dashboardAllocationTable ">
        <div
          className="ellipsis"
          style={{ textAlign: "left", maxWidth: "400px", fontSize: "13px" }}
          data-toggle="tooltip"
          title={data.comments}
        >
          {data.comments}
        </div>
      </div>
    );
  };
  const created_dt = (data) => {
    return (
      <div className="dashboardAllocationTable mr-0">
        <div className="date" style={{ textAlign: "center" }}>
          {data.created_dt}
        </div>
      </div>
    );
  };
  const effective_dt = (data) => {
    return (
      <div className="dashboardAllocationTable mr-0">
        <div className="date" style={{ textAlign: "center" }}>
          {data.effective_dt}
        </div>
      </div>
    );
  };
  const completed_dt = (data) => {
    return (
      <div className="dashboardAllocationTable mr-0">
        <div className="date" style={{ textAlign: "center" }}>
          {data.completed_dt}
        </div>
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "comments"
            ? align
            : col == "created_dt"
            ? created_dt
            : col == "effective_dt"
            ? effective_dt
            : col == "completed_dt" && completed_dt
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const getActionItemDetails = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/allocationDashboard/getActionItemDetails?rid=${resid}`,
    }).then(function (response) {
      // var resp = response.data;
      // setData(resp);
      const GetData = response.data;
      let dataHeader = [
        {
          created_dt: "Entry Dt",
          entryby: "Entry By",
          lkup_name: "Category",
          effective_dt: "Effective Dt",
          completed_dt: "Completed Dt",
          comments: "Comments",
        },
      ];

      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["created_dt"] =
          GetData[i]["created_dt"] == null
            ? ""
            : moment(GetData[i]["created_dt"]).format("DD-MMM-yyyy");
        GetData[i]["completed_dt"] =
          GetData[i]["completed_dt"] == null
            ? ""
            : moment(GetData[i]["completed_dt"]).format("DD-MMM-yyyy");
        GetData[i]["effective_dt"] =
          GetData[i]["effective_dt"] == null
            ? ""
            : moment(GetData[i]["effective_dt"]).format("DD-MMM-yyyy");
      }

      let fData = [...dataHeader, ...GetData];
      setData(fData);
    });
  };

  return (
    <div>
      {/* <Draggable> */}
      <CModal
        visible={openPopup}
        size="xl"
        className="ui-dialog"
        onClose={() => setOpenPopup(false)}
        backdrop={"static"}
      >
        <CModalHeader className="">
          <CModalTitle>
            <span className="">Action Items of {resName}</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <AllocationDashboardActionTable
            data={data}
            rows={rows}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
          />
        </CModalBody>
      </CModal>
      {/* </Draggable> */}
    </div>
  );
}

export default DashboardPopup;
