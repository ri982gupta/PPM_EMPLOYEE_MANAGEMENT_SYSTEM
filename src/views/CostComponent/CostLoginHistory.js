import React, { useEffect, useState } from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalFooter } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { CButton } from "@coreui/react";
import moment from "moment";

function CostLoginHistory(props) {
  const {
    costLoginHistoryPopUp,
    setCostLoginHistoryPopUp,
    costLoginHistoryData,
  } = props;

  const [displayData, setDisplayData] = useState(null);

  useEffect(() => {
    displayTableData();
  }, []);

  const displayTableData = (data) => {
    let displayTableData = data === undefined ? costLoginHistoryData : data;
    setDisplayData(() => {
      return displayTableData.map((d, index) => {
        let columns = ["employee_name", "ip_address", "login_date_and_time"];
        let data = [];
        data.push(<td>{index + 1}</td>);
        columns.forEach((iData, cIndex) => {
          data.push(
            <td>
              {iData === "login_date_and_time"
                ? moment(d[iData]).format("DD-MMM-yyyy HH:mm:ss")
                : d[iData]}
            </td>
          );
        });
        return <tr key={index}>{data}</tr>;
      });
    });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const filteresData = costLoginHistoryData.filter((data, index) => {
      let exits = Object.keys(data).some((key) => {
        let existedVal =
          moment(data[key])._d !== "Invalid date" &&
          moment(data[key]).format("DD-MMM-yyyy HH:mm:ss");
        let finalVal =
          existedVal !== "Invalid date"
            ? value.toLowerCase().includes("" + existedVal)
            : false;
        return (
          data[key].toLowerCase().includes(value.toLowerCase()) || finalVal
        );
      });
      return exits;
    });
    displayTableData(filteresData);
  };

  return (
    <div>
      <CModal
        size="xl"
        visible={costLoginHistoryPopUp}
        onClose={() => setCostLoginHistoryPopUp(false)}
      >
        <CModalHeader>
          <CModalTitle>Cost Login History</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className={""}>{""}</div>
          {displayData != null ? (
            <div className="col-md-12">
              <div
                className="col-md-12 mb-1"
                style={{ marginLeft: "2%" }}
                align="right"
              >
                <input
                  type="search"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </div>
              <table
                className="table table-bordered table-striped"
                style={{ width: "100%" }}
              >
                <tbody>
                  <tr>
                    <th>S No.</th>
                    <th>Employee Name</th>
                    <th>IP Address</th>
                    <th> Login Date And Time</th>
                  </tr>
                  {displayData}
                </tbody>
              </table>
            </div>
          ) : (
            ""
          )}
        </CModalBody>
        {/* <CModalFooter>
                    <CButton color="secondary" onClick={() => setSecretKeyValidationPopUp(false)}>
                        Close
                    </CButton>
                    <CButton onClick={() => { saveSecretKeyData() }} color="primary">Save changes</CButton>
                </CModalFooter> */}
      </CModal>
    </div>
  );
}

export default CostLoginHistory;
