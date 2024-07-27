import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { environment } from "../../environments/environment";
import { AiFillWarning } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { FaPlus, FaSave } from "react-icons/fa";

function CustomersDivisionEdit(props) {
  const { customerId, setAddMessage } = props;
  const [products1, setProducts1] = useState([]);
  const [rowId, setRowId] = useState([]);
  const [validateproject, setValidateproject] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [valid, setValid] = useState(false);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const componentRef = useRef(null);
  const loggedUserId = localStorage.getItem("resId");
  const [countryId, setcountryId] = useState([]);
  const [stateId, setStateId] = useState([]);
  const [cityId, setCityId] = useState([]);
  const [finalstates, setFinalStates] = useState([]);
  const [finalcities, setFinalCities] = useState([]);

  const initialValue = {
    loggedId: loggedUserId,
    name: "",
    address: "",
    country_id: "",
    state_id: "",
    city_id: "",
    zip_code: "",
    contact: "",
    customerId: customerId,
  };
  const [formData, setFormData] = useState(initialValue);

  let sideArrow = document.getElementsByClassName(
    "p-paginator-next p-paginator-element p-link"
  );
  let sideDoubleArrow = document.getElementsByClassName(
    "p-paginator-last p-paginator-element p-link"
  );

  useEffect(() => {}, [formData]);

  useLayoutEffect(() => {
    let tempStates = stateId;
    let fStates = tempStates.filter((d) => d.countryId == countryId);
    setFinalStates(fStates);

    let tempCities = cityId;
    let fCountries = tempCities.filter((d) => d.stateId == stateId);
    setFinalCities(fCountries);
  }, [stateId, cityId]);

  const getcountryId = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`,
    }).then((resp) => {
      const filteredData = resp.data.filter(
        (item) => item.description !== "NM"
      );
      setcountryId(filteredData);
    });
  };

  const getStates = () => {
    axios({
      url: baseUrl + `/VendorMS/vendor/states`,
    }).then((resp) => {
      setStateId(resp.data);
    });
  };

  const getCities = () => {
    axios({
      url: baseUrl + `/VendorMS/vendor/cities`,
    }).then((resp) => {
      setCityId(resp.data);
    });
  };

  useEffect(() => {
    getcountryId();
    getStates();
    getCities();
  }, []);

  const countryHandler = (e) => {
    let statesData = JSON.parse(JSON.stringify(stateId));

    let fData = statesData
      .filter((d) => d.countryId == e.target.value)
      .sort((a, b) => {
        b.state - a.state;
      });

    //////////--Alphabetical Sorting--//////////
    const sortedstate = fData.sort(function (a, b) {
      var nameA = a.state.toUpperCase();
      var nameB = b.state.toUpperCase();
      if (nameA < nameB) {
        return -1; //nameA comes first
      }
      if (nameA > nameB) {
        return 1; // nameB comes first
      }
      return 0; // names must be equal
    });
    //////////----------------------//////////

    setFinalStates(sortedstate);
    const { id, name, value } = e.target;
  };

  const stateHandler = (e) => {
    let citiesData = JSON.parse(JSON.stringify(cityId));
    let fData = citiesData.filter((d) => d.stateId == e.target.value);

    //////////--Alphabetical Sorting--//////////
    const sortedcities = fData.sort(function (a, b) {
      var nameA = a.city.toUpperCase();
      var nameB = b.city.toUpperCase();
      if (nameA < nameB) {
        return -1; //nameA comes first
      }
      if (nameA > nameB) {
        return 1; // nameB comes first
      }
      return 0; // names must be equal
    });

    setFinalCities(sortedcities);
  };

  const onRowEditComplete = (e) => {
    let _products1 = [...products1];
    let { newData, index } = e;
    _products1[index] = newData;
    setProducts1(_products1);
    postData(e.newData);
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

  useEffect(() => {
    let prod = products1[0];
    sideArrow[0]?.addEventListener("click", function () {
      removeFirstRowIfEmpty(prod);
    });

    sideDoubleArrow[0]?.addEventListener("click", function () {
      removeFirstRowIfEmpty(prod);
    });

    if (products1[0]?.name == "") {
      const icon = document.getElementsByClassName(
        "p-row-editor-init p-link"
      )[0];
      icon.setAttribute("title", "Edit selected row");
      icon.click();
      setTimeout(() => {
        const saveIcon = document.getElementsByClassName(
          "p-row-editor-save p-link"
        )[0];
        saveIcon.setAttribute("title", "Save row");
        const cancelIcon = document.getElementsByClassName(
          "p-row-editor-cancel p-link"
        )[0];
        cancelIcon.setAttribute("title", "Cancel row editing");
        cancelIcon?.addEventListener(
          "click",
          function (e) {
            if (products1[0]?.name == "") {
              setProducts1(products1.slice(1, products1.length));
              setButtonDisabled(true);
              setValidateproject(false);
              setValid(false);
              componentRef.current.forceUpdate();
            }
          },
          true
        );
      }, 200);
    }
  }, [products1]);

  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
  };

  const Reset = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setValidateproject(false);
  };

  const textEditorEventName = (products1) => {
    setRowId(products1.rowData.id);
    return (
      <>
        <input
          className={`error ${
            validateproject && !products1.rowData.name ? "error-block" : ""
          }`}
          id="name"
          type="text"
          value={products1.rowData.name}
          onChange={(e) => {
            products1.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const statusbodyEvents = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="name"
          title={rowData.name}
          value={rowData.name}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorAddress = (products1) => {
    return (
      <>
        <input
          className={`error ${
            validateproject && !products1.rowData.address ? "error-block" : ""
          }`}
          id="address"
          type="text"
          value={products1.rowData.address}
          onChange={(e) => {
            products1.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const statusbodyAddress = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="address"
          title={rowData.address}
          value={rowData.address}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorCountry = (products1) => {
    return (
      <>
        <select
          className={`error ${
            validateproject && !products1.country_name ? "error-block" : ""
          }`}
          id="country_id"
          name="countryId"
          onChange={(e) => {
            countryHandler(e);
            products1.editorCallback(e.target.value);
            countryId.map((a) => {
              if (a.id == e.target.value) {
                products1["rowData"]["countryId"] = a.country_name;
                products1["rowData"]["country_id"] = e.target.value;
              }
            });
          }}
        >
          <option value="">{"<<Please Select>>"}</option>
          {countryId?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == products1.rowData.country_id ? true : false}
            >
              {Item.country_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  const statusbodyCountry = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="country_name"
          title={rowData.country_name}
          value={rowData.country_name}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorState = (products1, rowData) => {
    return (
      <>
        <select
          className={`error ${
            validateproject && !products1.rowData.state ? "error-block" : ""
          }`}
          id="state_id"
          name="stateId"
          onChange={(e) => {
            stateHandler(e);
            products1.editorCallback(e.target.value);

            stateId.map((a) => {
              if (a.id == e.target.value) {
                products1["rowData"]["stateId"] = a.state;
                products1["rowData"]["state_id"] = e.target.value;
              }
            });
          }}
        >
          <option value="">{"<<Please Select>>"}</option>
          {finalstates?.map((Item, index) => (
            <option key={index} value={Item.id} selected={products1?.value}>
              {Item.state}
            </option>
          ))}
        </select>
      </>
    );
  };

  const statusbodyState = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="state"
          title={rowData.state}
          value={rowData.state}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorCity = (products1) => {
    return (
      <>
        <select
          className={`error ${
            validateproject && !products1.rowData.city ? "error-block" : ""
          }`}
          id="city_id"
          name="cityId"
          onChange={(e) => {
            products1.editorCallback(e.target.value);

            finalcities.map((a) => {
              if (a.id == e.target.value) {
                products1["rowData"]["cityId"] = a.city;
                products1["rowData"]["city_id"] = e.target.value;
              }
            });
          }}
        >
          <option value="">{"<<Please Select>>"}</option>
          {finalcities?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == products1.rowData.city_id ? true : false}
            >
              {Item.city}
            </option>
          ))}
        </select>
      </>
    );
  };

  const statusbodyCity = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="city"
          title={rowData.city}
          value={rowData.city}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };
  const textEditorZipCode = (products1) => {
    return (
      <>
        <input
          className={`error ${
            validateproject && !products1.rowData.city ? "error-block" : ""
          }`}
          id="city"
          type="text"
          value={products1.rowData.zipCode}
          onChange={(e) => {
            products1.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const statusbodyZipCode = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="zip_code"
          title={rowData.zip_code}
          value={rowData.zip_code}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };

  const textEditorContact = (products1) => {
    return (
      <>
        <input
          className={`error ${
            validateproject && !products1.rowData.contact ? "error-block" : ""
          }`}
          id="contact"
          type="text"
          value={products1.rowData.contact}
          onChange={(e) => {
            products1.editorCallback(e.target.value);
          }}
          maxLength={15}
          onKeyDown={(e) =>
            e.keyCode &&
            (e.keyCode <= 47 || e.keyCode >= 58) &&
            e.keyCode != 8 &&
            e.preventDefault()
          }
        />
      </>
    );
  };

  const statusbodyContact = (rowData) => {
    return (
      <>
        <input
          className="ellipsis"
          id="contact"
          title={rowData.contact}
          value={rowData.contact}
          type="text"
          autoComplete="off"
          required
          disabled
        />
      </>
    );
  };
  const getData = () => {
    abortController.current = new AbortController();
    axios({
      url:
        baseUrl +
        `/customersms/Customers/getCustomerEditDivision?cid=${customerId}`,
      signal: abortController.current.signal,
    }).then((resp) => {
      let GetData = resp.data;
      setProducts1(() => GetData);
      setTimeout(() => {}, 1000);
    });
  };

  const postData = (rowData) => {
    let data;
    if (
      rowData.name == "" ||
      rowData.address == "" ||
      rowData.countryId == "" ||
      rowData.stateId == "" ||
      rowData.cityId == "" ||
      rowData.zipCode == "" ||
      rowData.contact == ""
    ) {
      setValidateproject(true);
    } else {
      if (rowData.id == "" || null) {
        data = {
          id: rowData.id,
          loggedId: loggedUserId,
          Name: rowData.name,
          address: rowData.address,
          countryId: rowData.country_id,
          stateId: rowData.state_id,
          cityId: rowData.city_id,
          zipCode: rowData.zip_code,
          contact: rowData.contact,
          customerId: customerId,
        };
      } else {
        data = {
          id: rowData.id,
          loggedId: loggedUserId,
          Name: rowData.name,
          address: rowData.address,
          countryId: rowData.country_id,
          stateId: rowData.state_id,
          cityId: rowData.city_id,
          zipCode: rowData.zip_code,
          contact: rowData.contact,
          customerId: customerId,
        };
      }

      axios({
        method: "post",
        url: baseUrl + `/customersms/Customers/postCustomersEditdivision`,
        data: data,
      }).then((response) => {
        getData();
        setValidateproject(false);
        setAddMessage(true);
        setTimeout(() => {
          setAddMessage(false);
        }, 3000);
      });
      setButtonDisabled(true);
      setValid(false);
    }
  };

  const addHandler = () => {
    let daa1 = document.getElementsByClassName(
      "p-paginator-first p-paginator-element p-link"
    )[0];

    daa1.click();

    if (!valid) {
      setValid(true);
      setButtonDisabled(false);
    }

    const data = {
      loggedId: loggedUserId,
      name: "",
      address: "",
      country_name: "",
      state: "",
      city: "",
      zip_code: "",
      contact: "",
      customerId: customerId,
    };
    let dt = [];
    dt.push(data);
    setProducts1([...dt, ...products1]);
  };

  useEffect(() => {
    getData();
  }, []);
  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Bill to Address" colSpan={8} />
      </Row>
      <Row>
        <Column field="name" header="Name" style={{ width: "180px" }}></Column>
        <Column
          field="address"
          header="Address"
          style={{ width: "180px" }}
        ></Column>
        <Column
          field="country_name"
          header="Country"
          style={{ width: "180px" }}
        ></Column>
        <Column
          field="state"
          header="State/Province"
          style={{ width: "180px" }}
        ></Column>
        <Column field="city" header="City" style={{ width: "180px" }}></Column>
        <Column
          field="zip_code"
          header="ZIP/Postal Code"
          style={{ width: "180px" }}
        ></Column>
        <Column
          field="contact"
          header="Contact Number"
          style={{ width: "180px" }}
        ></Column>
        <Column field="Actions" header="Actions" style={{ width: "100px" }} />
      </Row>
    </ColumnGroup>
  );

  return (
    <>
      {validateproject ? (
        <div className="statusMsg error">
          <span>
            <AiFillWarning />
            &nbsp;
            {"Please provide valid values for highlighted values"}
          </span>
        </div>
      ) : (
        ""
      )}

      <div>
        <div className="customCard card graph mt-2 mb-2">
          <div className="group mb-0 customCard">
            <div
              className="col-md-12  collapseHeader px-3"
              style={{ backgroundColor: "#f4f4f4" }}
            >
              <h2 style={{ backgroundColor: "#f4f4f4" }}>Divisions</h2>
            </div>
          </div>
          <div className=" p-fluid darkHeader mb-2">
            <DataTable
              className="primeReactDataTable projDependenciesTable"
              value={products1}
              editMode="row"
              rows={25}
              showGridlines
              paginator
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 15, 25, 50]}
              rowHover
              onRowEditComplete={onRowEditComplete}
              tableStyle={{ minWidth: "auto", width: "auto" }}
              filterDisplay="row"
              currentPageReportTemplate="View {first} - {last} of {totalRecords} "
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
              emptyMessage="No Data Found"
              rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
              headerColumnGroup={headerGroup}
            >
              <Column
                field="name"
                header={<span>Name</span>}
                body={statusbodyEvents}
                editor={(options) => textEditorEventName(options)}
              ></Column>
              <Column
                field="address"
                header={<span>Address</span>}
                body={statusbodyAddress}
                editor={(options) => textEditorAddress(options)}
              ></Column>
              <Column
                field="country_name"
                header={<span>Country</span>}
                body={statusbodyCountry}
                editor={(options) => textEditorCountry(options)}
              ></Column>
              <Column
                field="state"
                header={<span>State/Province</span>}
                body={statusbodyState}
                editor={(options) => textEditorState(options)}
              ></Column>
              <Column
                field="city"
                header={<span>City</span>}
                body={statusbodyCity}
                editor={(options) => textEditorCity(options)}
              ></Column>
              <Column
                field="zip_code"
                header={<span>ZIP/Postal Code</span>}
                body={statusbodyZipCode}
                editor={(options) => textEditorZipCode(options)}
              ></Column>
              <Column
                field="contact"
                header={<span>Contact Number</span>}
                body={statusbodyContact}
                editor={(options) => textEditorContact(options)}
              ></Column>
              <Column
                field="Actions"
                header="Actions"
                rowEditor
                bodyStyle={{ textAlign: "center" }}
              />
            </DataTable>
          </div>
        </div>
      </div>
      <div className="form-group col-md-2 btn-container-events center my-3">
        <button
          className="btn btn-primary"
          disabled={valid}
          title={"Add new row"}
          onClick={addHandler}
        >
          <FaPlus /> Add
        </button>
        <button
          className="btn btn-primary"
          disabled={buttonDisabled}
          title={"Save row"}
          onClick={() => {
            Save();
          }}
        >
          <FaSave /> Save
        </button>
        <button
          className="btn btn-secondary"
          disabled={buttonDisabled}
          title={"Cancel row editing"}
          onClick={() => {
            Reset();
          }}
        >
          <ImCross fontSize={"11px"} /> Cancel
        </button>
      </div>
    </>
  );
}
export default CustomersDivisionEdit;
