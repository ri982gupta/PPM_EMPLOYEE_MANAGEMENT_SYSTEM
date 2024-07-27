import React, { useState, useEffect } from "react";
import { CModal, CModalBody, CModalHeader } from "@coreui/react";
import { ImCross } from "react-icons/im";
import { TfiSave } from "react-icons/tfi";
import axios from "axios";
import { environment } from "../../environments/environment";

const CustomerRoleEditPopup = (props) => {
  const {
    rolePopup,
    setRolePopup,
    updatedRowData,
    customerRoleTypeId,
    getCustomersRoles,
    setCustRolePopEditMsg,
  } = props;
  const baseUrl = environment.baseUrl;

  const [edited, setEdited] = useState(false);

  const countries = ["Canada", "Germany", "India", "Jordan", "UAE", "UK", "US"];

  const [billingRates, setBillingRates] = useState({});
  const [costs, setCosts] = useState({});
  const [dataChanged, setDataChanged] = useState({});

  const handleBillingRateChange = (country, value) => {
    setBillingRates((prevState) => ({
      ...prevState,
      [country]: value,
    }));
    setDataChanged((prevState) => ({
      ...prevState,
      [country]: true,
    }));
  };

  const handleCostChange = (country, value) => {
    setCosts((prevState) => ({
      ...prevState,
      [country]: value,
    }));
    setDataChanged((prevState) => ({
      ...prevState,
      [country]: true,
    }));
  };

  const saveData = () => {
    const dataToSend = [];

    countries.forEach((country) => {
      if (dataChanged[country]) {
        const billingRate = parseFloat(billingRates[country] || 0);
        const cost = parseFloat(costs[country] || 0);

        const countryData = updatedRowData.find(
          (data) => data.country_name === country
        );

        if (countryData) {
          dataToSend.push({
            customerRoleTypeId: customerRoleTypeId,
            countryId: countryData.countryid,
            cost: cost,
            rate: billingRate,
          });
        }
      }
    });

    axios
      .post(baseUrl + "/customersms/Customers/saveRoleCost", dataToSend)
      .then((response) => {
        setRolePopup(false);
        setCustRolePopEditMsg(true);
        setTimeout(() => {
          setCustRolePopEditMsg(false);
        }, 3000);
        getCustomersRoles();
        setEdited(true);
      });
  };

  useEffect(() => {
    if (updatedRowData) {
      const billingRatesData = {};
      const costsData = {};

      updatedRowData.forEach((data) => {
        const { country_name, rate, cost } = data;
        if (countries.includes(country_name)) {
          billingRatesData[country_name] = rate === 0 ? 0 : rate || "";
          costsData[country_name] = cost === 0 ? 0 : cost || "";
        }
      });

      setBillingRates(billingRatesData);
      setCosts(costsData);
    }
  }, [updatedRowData]);

  return (
    <div>
      {edited ? (
        <div className="statusMsg success">
          <span>
            <BiCheck />
            Role updated successfully
          </span>
        </div>
      ) : (
        ""
      )}
      <CModal
        alignment="center"
        backdrop="static"
        visible={rolePopup}
        size="xs"
        className="ui-dialog"
        onClose={() => setRolePopup(false)}
      >
        <CModalHeader className=""></CModalHeader>
        <CModalBody>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Country
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Billing Rate/Hr
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Cost/Hr
                </th>
              </tr>
            </thead>
            <tbody style={{ border: "1px solid #ccc" }}>
              {countries.map((country) => (
                <tr key={country} style={{ borderBottom: "1px solid #ccc" }}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px", // Add padding for the country cell
                      textAlign: "left",
                    }}
                  >
                    {country}
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #ccc",
                      borderRight: "1px solid #ccc",
                      padding: "8px",
                    }}
                  >
                    <input
                      type="text"
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px", // Add padding for the input field
                        width: "100%",
                      }}
                      maxLength={15}
                      onKeyDown={(e) =>
                        e.keyCode &&
                        (e.keyCode <= 47 || e.keyCode >= 58) &&
                        e.keyCode != 8 &&
                        e.preventDefault()
                      }
                      value={billingRates[country] || ""}
                      onChange={(e) =>
                        handleBillingRateChange(country, e.target.value)
                      }
                    />
                  </td>
                  <td
                    style={{
                      borderLeft: "1px solid #ccc",
                      borderRight: "1px solid #ccc",
                      padding: "8px",
                    }}
                  >
                    <input
                      type="text"
                      style={{
                        border: "1px solid #ddd",
                        padding: "4px", // Add padding for the input field
                        width: "100%",
                      }}
                      maxLength={15}
                      onKeyDown={(e) =>
                        e.keyCode &&
                        (e.keyCode <= 47 || e.keyCode >= 58) &&
                        e.keyCode != 8 &&
                        e.preventDefault()
                      }
                      value={costs[country] || ""}
                      onChange={(e) =>
                        handleCostChange(country, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="btn-container center my-2">
            <button className="btn btn-primary" title="Save" onClick={saveData}>
              <TfiSave /> Save
            </button>
            <button
              className="btn btn-secondary"
              title="Cancel"
              onClick={() => {
                setRolePopup(false);
              }}
            >
              <ImCross /> Cancel{" "}
            </button>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default CustomerRoleEditPopup;
