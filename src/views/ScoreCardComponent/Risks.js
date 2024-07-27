import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "./Risks.scss";
import { Link } from "react-router-dom";

export default function Risks({ risk }) {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredData = risk.slice(1).filter((item) => {
    if (selectedStatus === "All") {
      return true;
    } else {
      return item.risk_status === selectedStatus;
    }
  });
  console.log(filteredData, "filteredData");

  return (
    <div className="col-md-12 darkHeader customCard card graph">
      <div className="col-md-12 scorecard-project-risk-drop-down mt-2">
        <h6 className="subHeading">Project Risks</h6>
        <div>
          <span>Risk Status :</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Accepted">Accepted</option>
            <option value="Identified">Identified</option>
            <option value="Mitigated">Mitigated</option>
          </select>
        </div>
      </div>
      <div className="darkHeader scorecard-project-risk-table">
        <DataTable
          value={filteredData}
          className="primeReactDataTable"
          showGridlines
          emptyMessage="No Data Found"
        >
          <Column
            field="customer"
            header="Customer"
            body={(rowData) => (
              <span title={rowData.customer}>{rowData.customer}</span>
            )}
          />
          <Column
            field="project"
            header="Project"
            body={(rowData) => {
              return (
                <>
                  <Link
                    title={rowData.project}
                    to={`/project/Overview/:${rowData.obj_id}`}
                    target="_blank"
                  >
                    {rowData.project}
                  </Link>
                </>
              );
            }}
          />
          <Column
            field="risk_name"
            header="Risk Name"
            body={(rowData) => (
              <span title={rowData.risk_name}>{rowData.risk_name}</span>
            )}
          />
          <Column
            field="risk_type"
            header="Risk Type"
            body={(rowData) => (
              <span title={rowData.risk_type}>{rowData.risk_type}</span>
            )}
          />
          <Column
            field="risk_source"
            header="Risk Source"
            body={(rowData) => (
              <span title={rowData.risk_source}>{rowData.risk_source}</span>
            )}
          />
          <Column
            field="risk_impact"
            header="Risk Impact"
            body={(rowData) => (
              <span title={rowData.risk_impact}>{rowData.risk_impact}</span>
            )}
          />
          <Column
            field="risk_prob_occurance"
            header="Prob. of Occ."
            body={(rowData) => (
              <span title={rowData.risk_prob_occurance}>
                {rowData.risk_prob_occurance}
              </span>
            )}
          />
          <Column
            field="risk_value"
            header="Risk Value"
            style={{ textAlign: "right" }}
            body={(rowData) => (
              <span title={rowData.risk_value}>{rowData.risk_value}</span>
            )}
          />

          <Column
            field="assigned_to"
            header="Assigned To"
            body={(rowData) => (
              <span title={rowData.assigned_to}>{rowData.assigned_to}</span>
            )}
          />
          <Column
            field="risk_occured"
            header="Risk Occurred"
            body={(rowData) => (
              <span title={rowData.risk_occured}>{rowData.risk_occured}</span>
            )}
          />
          <Column
            field="risk_status"
            header="Risk Status"
            body={(rowData) => (
              <span title={rowData.risk_status}>{rowData.risk_status}</span>
            )}
          />
          <Column
            field="risk_occured_dt"
            header="Occurred Dt."
            body={(rowData) => (
              <span title={rowData.risk_occured_dt}>
                {rowData.risk_occured_dt}
              </span>
            )}
          />
          <Column
            field="mitigation_dt"
            header="Mitigation Dt."
            body={(rowData) => (
              <span title={rowData.mitigation_dt}>{rowData.mitigation_dt}</span>
            )}
          />
          <Column
            field="created_by"
            header="Created By"
            body={(rowData) => (
              <span title={rowData.created_by}>{rowData.created_by}</span>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
}
