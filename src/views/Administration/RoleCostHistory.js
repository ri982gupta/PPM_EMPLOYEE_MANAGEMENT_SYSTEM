import React, { useState, useEffect } from "react";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import "./Rolecost.scss";

export default function RoleCostHistory({
  open,
  setOpen,
  formData,
  roleHistoryId,
  displayedCountryName
}) {
  const [historyData, setHistoryData] = useState([]);
  const baseUrl = environment.baseUrl;
  useEffect(() => {
    const getRoleHistoryData = () => {
      axios({
        method: "get",
        url:
          baseUrl +
          `/administrationms/roleCosts/getRolecostsHistory?Country=${formData.country}&roleTypeId=${roleHistoryId?.role_type_id}`,
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        setHistoryData(response.data);
      });
    };

    getRoleHistoryData();
  }, [formData.country, roleHistoryId?.role_type_id]);

  // Group history data by the 'name' key
  const groupedData = historyData.reduce((acc, item) => {
    acc[item.name] = acc[item.name] || [];
    acc[item.name].push(item);
    return acc;
  }, {});
  const isMultipleTables = Object.keys(groupedData).length > 1;
  const modalSize = isMultipleTables ? "xl" : "xl";
  return (
    <CModal visible={open} onClose={() => setOpen(false)} size={modalSize}>
      <CModalHeader>
        <CModalTitle>
          Cost History of "{roleHistoryId["Role Type"]}" for {displayedCountryName}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="RoleCostpopuptable darkHeader">
        <div className="row">
          {Object.entries(groupedData).map(([name, data]) => (
            <div key={name} className="col-md-3 mb-4">
              <div>
                <div style={{ color: "#02277f" }}>{name}</div>
                <table className="table table-bordered">
                  <thead>
                    <tr className="sticky-header">
                      <th>Avg Cost/Hr ($)</th>
                      <th>Start Month</th>
                      <th>End Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .sort(
                        (a, b) =>
                          new Date(b.start_date) - new Date(a.start_date)
                      )
                      .map((item) => (
                        <tr
                          key={item.start_date}
                          className={
                            item.end_date === null ? (
                              <span
                                style={{ backgroundColor: "d2efc9" }}
                              ></span>
                            ) : (
                              ""
                            )
                          }
                        >
                          <td style={{textAlign:'right'}}>{item.cost}</td>
                          <td>{moment(item.start_date).format("MMM-YYYY")}</td>
                          <td>
                            {item.end_date == null
                              ? " "
                              : moment(item.end_date).format("MMM-YYYY")}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </CModalBody>
    </CModal>
  );
}
