import React, { useState, useEffect } from "react";
import ActionComponent from "../PrimeReactTableComponent/ActionComponent";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaPlus,
  FaSave,
} from "react-icons/fa";
import { getCompanyTableData } from "./Companyjson";
import { getCompanyEditTableData } from "./Companyjson";

function Company() {
  let emptyData = {
    companyName: "",
    companyId: "",
    currency: "",
  };
  const [inputData, setInputData] = useState(emptyData);
  const [inputArr, setInputArr] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [displayOnEdit, setDisplayOnEdit] = useState();
  const [displayOnAdd, setDisplayOnAdd] = useState();
  const [displayOnView, setDisplayOnView] = useState();
  const [checked, setChecked] = useState(false);
  const [isEdit, setIsEdit] = useState(null);
  const [toggle, setToggle] = useState(true);
  const [addEditData, setAddEditData] = useState([]);
  const [editingRows, setEditingRows] = useState();

  useEffect(() => {
    getapiData();
  }, []);
  const getapiData = async () => {
    const data = getCompanyTableData();
    const tdata = getCompanyEditTableData();
    console.log("data", data);
    setEmployeeData(data);
    setAddEditData(tdata);
  };

  const currencySelectItems = [
    { label: "Rupees(INR)", value: "NY" },
    { label: "US Dollar(USD)", value: "RM" },
    { label: "EURO", value: "LDN" },
  ];

  const renderFooter = (rowData) => {
    return (
      <div>
        <button
          type="button"
          className="btn btn-primary"
          title="Search"
          onClick={saveInput}
        >
          <FaSave /> Save{" "}
        </button>
      </div>
    );
  };

  const onAddCompany = () => {
    setInputData(emptyData);
    setDisplayOnAdd(true);
    // setDisplayOnEdit(false);
    // setDisplayOnView(false);
  };

  const onInputChange = (e, name) => {
    const value = e.target.value;
    console.log("val", value);
    const _inputData = { ...inputData };
    _inputData[`${name}`] = value;
    setInputData(_inputData);
  };

  const saveInput = () => {
    // if (!inputData) {
    //   alert("Please Enter Data");
    // }
    if (inputData && !toggle) {
      setEmployeeData(
        employeeData.map((e) => {
          if (e.id == isEdit) {
            return {
              ...e,
              companyName: inputData.companyName,
              id: inputData.companyId,
              currency: inputData.currency,
            };
          }
          return e;
        })
      );
      setIsEdit(null);
      setDisplayOnEdit(false);
      setInputData("");
    } else {
      const allInputData = {
        id: new Date().getTime().toString(),
        ...inputData,
      };
      // setInputArr([...inputArr, allInputData]);
      setEmployeeData([...employeeData, allInputData]);
      setDisplayOnAdd(false);
      setInputData(emptyData);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <i
          className="pi pi-eye me-2"
          style={{ backgroundColor: "orange" }}
          onClick={() => {
            // setDisplayOnView(true);
            //   setValue1(rowData.longDesc)
            viewBodyTemplate(rowData);
          }}
        ></i>
        <i
          className="pi pi-pencil"
          style={{ backgroundColor: "orange" }}
          onClick={() => {
            // setDisplayOnEdit(true);
            //   setValue1(rowData.longDesc);
            editBodyTemplate(rowData);
          }}
        ></i>
      </>
    );
  };

  const viewBodyTemplate = (rowData) => {
    let viewData = employeeData.find((ele) => {
      return ele.id == rowData.id;
    });
    setDisplayOnView(true);
    setInputData(viewData);
  };

  const editBodyTemplate = (rowData) => {
    let editData = employeeData.find((ele) => {
      return ele.id == rowData.id;
    });
    setDisplayOnEdit(true);
    setInputData(editData);
    setIsEdit(rowData.id);
    setToggle(false);
    console.log("data1", editData);
  };

  const GiBodyTemplate = (rowData) => {
    return (
      <input
        type="text"
        defaultValue={rowData.GLAccount}
        disabled={displayOnView}
      />
    );
  };
  const CostBodyTemplate = (rowData) => {
    return (
      <input
        type="text"
        defaultValue={rowData.costCenter}
        disabled={displayOnView}
      />
    );
  };

  const companyBodyTemplate = (rowData) => {
    return (
      <select id="currency">
        <option value="USA">US Dollar(USD)</option>
        <option value="CAN">Indian Rupee(INR)</option>
        <option value="MEX">EURO</option>
      </select>
    );
  };

  const onRowEditChange = (e) => {
    setEditingRows(e.data);
  };
  return (
    <div>
      <div className="col-md-12 col-sm-12 col-xs-12 no-padding center mb-2">
        <button
          onClick={onAddCompany}
          type="button"
          className="btn btn-primary"
          title="Search"
          style={{ margin: "3px" }}
        >
          <FaPlus /> Add Company{" "}
        </button>
      </div>
      <div className="col-md-6 mt-2">
        <ActionComponent
          data={employeeData}
          actionBodyTemplate={actionBodyTemplate}
        />
      </div>

      <div>
        <Dialog
          header={
            displayOnEdit
              ? "Edit Company"
              : displayOnAdd
              ? "Add Company"
              : "View Company"
          }
          visible={displayOnEdit || displayOnAdd || displayOnView}
          onHide={() => {
            setDisplayOnEdit(false);
            setDisplayOnAdd(false);
            setDisplayOnView(false);
          }}
          style={{
            width: "50vw",
            backgroundColor: "transparent",
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
          modal={true}
          footer={displayOnView ? "" : renderFooter()}
        >
          <div className="group mb-5 customCard">
            <div className="group-content row mb-2">
              <div className="col-md-7 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="name">
                    Company Name
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <InputText
                      id="companyName"
                      value={inputData.companyName}
                      onChange={(e) => onInputChange(e, "companyName")}
                      type="text"
                      className="form-control"
                      placeholder="Enter Company name"
                      required
                      disabled={displayOnView}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-5 mb-2">
                <div className="form-group row">
                  <div className="col-2"></div>
                  <div className="col-2">
                    {/* <input
                        type="checkbox"
                        className="form-control"
                        id="name"
                        placeholder="Enter Company Name"
                        required
                      /> */}
                    <Checkbox
                      disabled={displayOnView}
                      onChange={(e) => setChecked(e.checked)}
                      checked={checked}
                    ></Checkbox>
                  </div>
                  <label className="col-8" htmlFor="name">
                    Master Company
                  </label>
                  {/* <span className="col-1 p-0">:</span> */}
                </div>
              </div>
              <div className="col-md-7 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="name">
                    Company ID
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <InputText
                      id="companyId"
                      value={inputData.companyId}
                      onChange={(e) => onInputChange(e, "companyId")}
                      type="text"
                      className="form-control"
                      placeholder="Enter Company name"
                      required
                      disabled={displayOnView}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-5"></div>
              <div className="col-md-7 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="country-select">
                    Currency<span style={{ color: "red" }}>*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    {/* <select id="currency">
                        <option value="USA">US Dollar(USD)</option>
                        <option value="CAN">Indian Rupee(INR)</option>
                        <option value="MEX">EURO</option>
                      </select> */}

                    <Dropdown
                      id="currency"
                      value={inputData.currency}
                      options={currencySelectItems}
                      onChange={(e) => onInputChange(e, "currency")}
                      placeholder="Select a Currency"
                      disabled={displayOnView}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-5"></div>

              <div className="col-md-12 mb-2 card">
                <TabView>
                  <TabPanel header="Header I">
                    {displayOnView ? "" :    <div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        title=""
                        Add
                        // onClick={saveInput}
                      >
                        <FaPlus /> Add{" "}
                      </button>
                    </div>}
                 
                    <DataTable
                      value={addEditData}
                      editMode="row"
                      dataKey="id"
                      editingRows={editingRows}
                      onRowEditChange={onRowEditChange}
                      // onRowEditComplete={onRowEditComplete2}
                      responsiveLayout="scroll"
                      // onRowEditInit={handleRowEditInit}
                      // onRowEditSave={handleRowEditSave}
                    >
                      <Column
                        field="companyName"
                        header="Company Name"
                        body={companyBodyTemplate}
                        style={{ width: "20%" }}
                      ></Column>
                      <Column
                        field="costCenter"
                        header="Cost Center"
                        body={CostBodyTemplate}
                        style={{ width: "20%" }}
                      ></Column>
                      <Column
                        field="GLAccount"
                        header="G/L Account"
                        body={GiBodyTemplate}
                        style={{ width: "20%" }}
                      ></Column>
                    </DataTable>
                  </TabPanel>
                  <TabPanel header="Header II">
                    <div className="col-md-12 mb-2 card">
                      <DataTable
                        value={addEditData}
                        editMode="row"
                        dataKey="id"
                        editingRows={editingRows}
                        onRowEditChange={onRowEditChange}
                        // onRowEditComplete={onRowEditComplete2}
                        responsiveLayout="scroll"
                        // onRowEditInit={handleRowEditInit}
                        // onRowEditSave={handleRowEditSave}
                      >
                        <Column
                          field="companyName"
                          header="Company Name"
                          style={{ width: "20%" }}
                        ></Column>
                        <Column
                          field="costCenter"
                          header="Cost Center"
                          body={CostBodyTemplate}
                          style={{ width: "20%" }}
                        ></Column>
                        <Column
                          field="GLAccount"
                          header="G/L Account"
                          body={GiBodyTemplate}
                          style={{ width: "20%" }}
                        ></Column>
                      </DataTable>
                    </div>
                  </TabPanel>
                </TabView>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default Company;
