import React, { useState, useEffect } from "react";
import ActionComponent from "../PrimeReactTableComponent/ActionComponent";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaPlus,
} from "react-icons/fa";
import { getExpenseTableData } from "./Companyjson";
import { getContractEditTableData } from "./Companyjson";

function ExpenseTypes() {
  let emptyData = {
    companyName: "",
    companyId: "",
    currency: "",
  };
  const [inputData, setInputData] = useState(emptyData);
  const [employeeData, setEmployeeData] = useState([]);
  const [displayOnEdit, setDisplayOnEdit] = useState();
  const [displayOnView, setDisplayOnView] = useState();
  const [editingRows, setEditingRows] = useState();
  const [editData, setEditData] = useState([]);

  useEffect(() => {
    getapiData();
  }, []);
  const getapiData = async () => {
    const data = getExpenseTableData();
    const editData = getContractEditTableData();
    setEmployeeData(data);
    setEditData(editData);
  };

  const currencySelectItems = [
    { label: "Rupees(INR)", value: "NY" },
    { label: "US Dollar(USD)", value: "RM" },
    { label: "EURO", value: "LDN" },
  ];

  // const renderFooter = (rowData) => {
  //   return (
  //     <div>
  //       <Button label="Save" onClick={saveInput}></Button>
  //     </div>
  //   );
  // };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <i
          className="pi pi-eye me-2"
          style={{ backgroundColor: "orange" }}
          onClick={() => {
            viewBodyTemplate(rowData);
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
  };

  const onRowEditChange = (e) => {
    setEditingRows(e.data);
  };
  const handleRowEditInit = (e) => {
    console.log("handlerowedit", e);
    setEditingRows(e.data);
  };
  const handleRowEditSave = (e) => {
    console.log("handleroweditsave", e);
  };
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        // onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };
  const GiBodyTemplate = (rowData) => {
    return (
      <input
        type="text"
        defaultValue={rowData.GlItem}
        disabled={displayOnView}
      />
    );
  };
  return (
    <div>
      <div className="col-md-6 mt-2">
        <ActionComponent
          data={employeeData}
          actionBodyTemplate={actionBodyTemplate}
        />
      </div>

      <div>
        <Dialog
          header={displayOnEdit ? "Edit Contract Terms" : "View Contract Terms"}
          visible={displayOnEdit || displayOnView}
          onHide={() => {
            setDisplayOnEdit(false);
            setDisplayOnView(false);
          }}
          style={{
            width: "50vw",
            backgroundColor: "transparent",
          }}
          overlayStyle={{ backgroundColor: "transparent" }}
          modal={true}
        >
          <div className="group mb-5 customCard">
            <div className="group-content row mb-2">
              <div className="col-md-12 mb-2">
                <div className="form-group row">
                  <label className="col-4" htmlFor="text-input-inline">
                    ACCOUNTING INTEGRATION MAPPING
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-7">
                    <p className="col-7" id="text-input-inline">
                      Certifications
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mb-2 card">
                <DataTable
                  value={editData}
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
                    field="mapping"
                    header="Mapping"
                    // editor={(options) => textEditor(options)}
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="GlItem"
                    header="GL Item / Account No."
                    body={GiBodyTemplate}
                    style={{ width: "20%" }}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default ExpenseTypes;
