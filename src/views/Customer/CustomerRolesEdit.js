import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { environment } from "../../environments/environment";
import { ImCross } from "react-icons/im";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import CustomerRoleEditPopup from "./CustomerRoleEditPopup";
import CustomerRoleDeletePopup from "./CustomerRoleDeletePopup";
import { FaPlus, FaSave } from "react-icons/fa";

const CustomerRolesEdit = (props) => {
  const {
    cCountryId,
    setRolesValidationMsg,
    setUpdatedRole,
    setFinalTableMsg,
    setCustRolePopEditMsg,
  } = props;
  const baseUrl = environment.baseUrl;
  const [currency, setCurrency] = useState([]);
  const [customerDatarole, setCustomerDatarole] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [valid, setValid] = useState(false);
  const loggedUserId = localStorage.getItem("resId");
  const [rolesDropdown, setRolesDropdown] = useState([]);
  const [customerEditRoles, setCustomerEditRoles] = useState([]);
  const [products1, setProducts1] = useState([]);
  const [saveButton, setSaveButton] = useState(false);
  const [roles, setRoles] = useState("14");
  const [countryData, setCountryData] = useState(false);
  const [rolePopup, setRolePopup] = useState(false);
  const [roleDeletePopup, setRoleDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [updatedRowData, setUpdatedRowData] = useState("");
  const [customerRoleTypeId, setCustomerRoleTypeId] = useState("");
  const [tableKey, setTableKey] = useState(0);
  const [addDropdown, setAddDropdown] = useState(false);
  const [backupData, setBackupData] = useState([]);
  const [rolesIdsByCustomerIds, setRolesIdsByCustomerIds] = useState([]);

  const DeleteRole = () => {
    axios({
      method: "delete",
      url:
        baseUrl + `/customersms/Customers/deleteEditRoles?roleId=${deleteId}`,
    }).then((error) => {
      setRoleDeletePopup(false);
      getCustomersRoles();
      getRolesIds();
      Reset();
    });
  };

  const removeFirstRowIfEmpty = (prod) => {
    Object.keys(prod).forEach((d) => {
      if (["", null, undefined, " "].includes(prod[d])) {
        setProducts1(products1.slice(1));
        setValid((prev) => !prev);
        return;
      }
    });
  };

  const getRolesIds = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/roleTypeIdsByCustomerId?customerId=${props.customerId}`,
    }).then(function (response) {
      let resp = response.data;
      setRolesIdsByCustomerIds(resp);
    });
  };
  useEffect(() => {
    getRolesIds();
  }, []);

  const getCustomersRoles = () => {
    if (props.customerId != 0) {
      axios({
        method: "get",
        url:
          baseUrl +
          `/customersms/Customers/getCustomersroles?cid=${props.customerId}`,
      }).then(function (response) {
        let resp = response.data;
        setProducts1(resp);
        setTableKey((prevKey) => prevKey + 1);

        let desp = [...new Set(resp.map((d) => d.display_name))];

        let dt = [];

        for (let i = 0; i < desp.length; i++) {
          let obj = {};
          obj["display_name"] = desp[i];

          // Add the customer_role_type_id property to the obj object
          let customerRoleTypeIds = resp
            .filter((d) => d.display_name === desp[i])
            .map((d) => d.customer_role_type_id)
            .join(",");

          obj["customer_role_type_id"] = customerRoleTypeIds;

          let countriesData = JSON.parse(JSON.stringify(resp)).filter(
            (d) => d.display_name === desp[i]
          );

          let countriesNames = [
            "",
            "Canada",
            "Germany",
            "India",
            "Jordan",
            "UAE",
            "UK",
            "US",
          ];

          let sortedData = [];

          for (let j = 0; j < countriesNames.length; j++) {
            let obj = {
              display_name: "",
              cost: "",
              rate: "",
              country_name: "",
              countryid: "",
              customer_role_type_id: "",
            };

            if (
              countriesData.some(
                (d) => d["country_name"] === countriesNames[j]
              ) === false
            ) {
              obj["country_name"] = countriesNames[j];
              sortedData.push(obj);
            } else {
              for (let k = 0; k < countriesData.length; k++) {
                if (
                  countriesNames[j].includes(countriesData[k]["country_name"])
                ) {
                  sortedData.push(countriesData[k]);
                }
              }
            }
          }

          obj["data"] = sortedData;
          dt.push(obj);
        }

        setCustomerDatarole([...dt]);
        setBackupData([...dt]);
      });
    }
  };

  const handleCurrency = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getCurrency`,
    }).then((res) => {
      let curre = res.data;
      setCurrency(curre);
    });
  };

  const renderRowActions = (rowData) => {
    return (
      <>
        <div>
          <AiFillEdit
            color="orange"
            cursor="pointer"
            title="Edit"
            onClick={() => {
              setRolePopup(true);
              setCustomerRoleTypeId(
                rowData.customer_role_type_id.split(",")[0]
              );

              const updatedRowData = rowData?.data?.map((item) => {
                if (item.country_name) {
                  const countryData = cCountryId.find(
                    (data) => data.country_name === item.country_name
                  );
                  if (countryData) {
                    return { ...item, countryid: countryData.id };
                  }
                }
                return item;
              });
              setUpdatedRowData(updatedRowData);
            }}
          />
          <AiFillDelete
            color="orange"
            cursor="pointer"
            title="Delete Row"
            onClick={() => {
              setRoleDeletePopup(true);
              setDeleteId(rowData.customer_role_type_id.split(",")[0]);
            }}
          />
        </div>
      </>
    );
  };

  const getRolesDropDown = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getRolesDropDown`,
    }).then((res) => {
      let curre = res.data;
      setRolesDropdown(curre);
    });
  };
  useEffect(() => {
    getCustomersRoles();
    handleCurrency();
    getRolesDropDown();
  }, [props.customerId]);

  const postCustomerEditRoles = () => {
    setCountryData(false);

    let someDataa = rolesIdsByCustomerIds.some((d) => roles.includes(d));
    if (someDataa) {
      setRolesValidationMsg(true);
      setTimeout(() => {
        setRolesValidationMsg(false);
      }, 3000);
      setCustomerDatarole(backupData);
      setButtonDisabled(true);
      setValid(false);
      setSaveButton(true);
      return;
    } else {
    }

    axios({
      method: "post",
      url: baseUrl + `/customersms/Customers/saveRoles`,
      data: {
        customerId: props.customerId,
        roleType: roles,
      },
    }).then((res) => {
      getCustomersRoles();
      getRolesIds();
      let curre = res.data;
      setFinalTableMsg(true);
      setTimeout(() => {
        setFinalTableMsg(false);
      }, 3000);
      setUpdatedRole("Primary Project Manager");
      setRolesValidationMsg(false);
      setCustomerEditRoles(curre);
      setCountryData(true);
      Reset();
    });
  };

  const Reset = () => {
    setCustomerDatarole(backupData);
    setButtonDisabled(true);
    setValid(false);
    setSaveButton(true);
  };

  const addHandler1 = () => {
    setRoles("14");
    if (!valid) {
      setValid(true);
      setButtonDisabled(false);
    }
    const newRow = {
      display_name: "",
      Action: 0,
    };

    setCustomerDatarole((prevTaskResources) => [...prevTaskResources, newRow]);
  };

  const representativeBody = (rowData) => {
    return (
      <span>
        <table class="table table-bordered table-striped">
          <tbody>
            <tr>
              {rowData?.data?.map((ele, index) => {
                return <th className="antiquewhite"> {ele.country_name}</th>;
              })}
            </tr>

            <tr>
              {rowData?.data?.map((ele, index) => {
                return (
                  <>
                    {index === 0 ? (
                      <td>
                        <b>Billing</b>
                        <br />
                        <b>Rate/Hr</b>
                      </td>
                    ) : (
                      <td>{ele.rate}</td>
                    )}
                  </>
                );
              })}
            </tr>
            <tr>
              {rowData?.data?.map((ele, index) => {
                return (
                  <>
                    {index === 0 ? (
                      <td>
                        <b>Cost/Hr</b>
                      </td>
                    ) : (
                      <td>{ele.cost}</td>
                    )}
                  </>
                );
              })}
            </tr>
          </tbody>
        </table>
      </span>
    );
  };

  return (
    <>
      <div>
        <div className="customCard card graph mt-2 mb-2 darkHeader">
          <div className="group mb-1 customCard">
            <div
              className="col-md-12  collapseHeader px-3"
              style={{ backgroundColor: "#f4f4f4" }}
            >
              <h2 style={{ backgroundColor: "#f4f4f4" }}>Roles</h2>
            </div>
          </div>

          <DataTable
            className="primeReactDataTable eventsTable  Roles"  ////customerEngament
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            rowsPerPageOptions={[10, 25, 50]}
            value={customerDatarole}
            paginator
            editMode="row"
            rows={25}
            showGridlines
            highlightOnHover
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 15, 25, 50]}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            key={tableKey}
          >
            <Column
              key={"display_name"}
              field="display_name"
              header="Role"
              alignHeader={"center"}
              body={(options) =>
                addDropdown && options.display_name == "" ? (
                  <select
                    onChange={(e) => {
                      let a;
                      setRoles(e.target.value),
                        rolesDropdown.map((item) => {
                          if (item.id == e.target.value) {
                            setUpdatedRole(item.display_name);
                            a = item.display_name;
                          }
                        });
                    }}
                  >
                    {rolesDropdown.map((item, index) => (
                      <option key={item.id} value={item.id}>
                        {item.display_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>{options.display_name}</>
                )
              }
              editor={(options) => initialRowHandler(options)}
              style={{ width: "40%" }}
            ></Column>
            <Column
              field="Country"
              header="Country"
              body={representativeBody}
              alignHeader={"center"}
            >
              country
            </Column>
            <Column
              field={""}
              key={"Action"}
              header="Action"
              body={(rowData) => {
                if (addDropdown && rowData.display_name === "") {
                  return ""; // Empty value when addDropdown is true and display_name is empty
                } else {
                  return renderRowActions(rowData); // Call the renderRowActions function
                }
              }}
              headerStyle={{ width: "100px", backgroundColor: "#eeecec" }}
              bodyStyle={{ textAlign: "center" }}
            />
          </DataTable>
        </div>
      </div>
      <div className="form-group col-md-2 btn-container-events center my-3">
        <button
          className="btn btn-primary"
          disabled={valid}
          title={"Add new row"}
          onClick={() => {
            setAddDropdown(true);
            addHandler1();
          }}
        >
          <FaPlus /> Add
        </button>
        <button
          className="btn btn-primary"
          disabled={buttonDisabled}
          title={"Save row"}
          onClick={() => {
            setAddDropdown(false);
            postCustomerEditRoles();
          }}
        >
          <FaSave /> Save
        </button>
        <button
          className="btn btn-secondary"
          disabled={buttonDisabled}
          title={"Cancel row editing"}
          onClick={() => {
            setAddDropdown(false);
            Reset();
          }}
        >
          <ImCross fontSize={"11px"} /> Cancel
        </button>
      </div>
      {rolePopup ? (
        <CustomerRoleEditPopup
          rolePopup={rolePopup}
          setRolePopup={setRolePopup}
          customerRoleTypeId={customerRoleTypeId}
          updatedRowData={updatedRowData}
          getCustomersRoles={getCustomersRoles}
          setCustRolePopEditMsg={setCustRolePopEditMsg}
        />
      ) : (
        ""
      )}

      {roleDeletePopup ? (
        <CustomerRoleDeletePopup
          roleDeletePopup={roleDeletePopup}
          setRoleDeletePopup={setRoleDeletePopup}
          DeleteRole={DeleteRole}
          deleteId={deleteId}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default CustomerRolesEdit;
