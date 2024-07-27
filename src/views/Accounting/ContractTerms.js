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
import { environment } from "../../environments/environment";
import { BiCheck } from "react-icons/bi";
import { getCompanyTableData } from "./Companyjson";
import { getContractTableData } from "./Companyjson";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaPlus,
  FaSave
} from "react-icons/fa";

function ContractTerms() {
  let emptyData = {
    lkup_name: "",
    id: "",
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
  const [editingRows, setEditingRows] = useState();
  const [editData, setEditData] = useState([]);

  const [userDetails, setUserDetails] = useState([]);
  ///----------
  const getapiData = async () => {
    const datas = getCompanyTableData;
    console.log(datas)
    setEmployeeData(datas);
    console.log(employeeData)

    const editDatas = getContractTableData;
    console.log(editDatas)
    setEditData(editDatas);
    console.log(editData)
  };

  const currencySelectItems = [
    { label: "Rupees(INR)", value: "NY" },
    { label: "US Dollar(USD)", value: "RM" },
    { label: "EURO", value: "LDN" },
  ];

  const renderFooter = (rowData) => {
    return (
      <div>
        <button type="button" style={{marginLeft:'242px'}}className="btn btn-primary" title="Search" onClick={saveInput}>
          <FaSave /> Save{" "}
        </button>
      </div>
    );
  };

  const onInputChange = (e, name) => {
    const value = e.target.value;
    console.log("val", value);
    const _inputData = { ...inputData };
    _inputData[`${name}`] = value;
    setInputData(_inputData);
  };
const[storelkupname,setStorelkupname]=useState([])
  const saveInput = () => {
    console.log("inline------10")
    if (inputData && !toggle) {
      console.log(inputData)
      console.log(employeeData)

      console.log("inline------11")
      setEmployeeData(
        employeeData.map((e) => {
          console.log("inline------12")
          if (e.id == isEdit) {
            return {
              ...e,
              lkup_name: inputData.lkup_name,
              id:inputData.id
            };
          }
          return e;
        })
      );
      setIsEdit(null);
      setDisplayOnEdit(false);
      setInputData("");
    } else {
      console.log("inline------14")

      const allInputData = {
        id: new Date().getTime().toString(), ...inputData,
      };
      console.log(allInputData)

      // setInputArr([...inputArr, allInputData]);
      setEmployeeData([...employeeData, allInputData]);
      setDisplayOnAdd(false);
      setInputData(emptyData);
    }
  };

  const actionBodyTemplate = (rowData) => {
    console.log(rowData)

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
  };
const[storelkupnamedai,setStorelkupnamedai]=useState([])
  const editBodyTemplate = (rowData) => {
    let editData = employeeData.find((ele) => {
      console.log(employeeData)
      return ele.id == rowData.id;
    });
    setDisplayOnEdit(true);
    setInputData(editData);
    setIsEdit(rowData.id);
    setToggle(false);
    console.log("data1", editData);
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
  
  

  let emptyDatas = {
    gl_account: ""
  };

  const [inputDatas, setInputDatas] = useState(emptyDatas);

  const onInputChangedata = (e, name) => {
    const value = e.target.value;
    console.log("val", value);
    const _inputData = { ...inputDatas };
    _inputData[`${name}`] = value;
    setInputDatas(_inputData);

  };

  const GiBodyTemplate = (rowData) => {
    console.log(rowData)
    return <input type="text" placeholder="xxxxx"
      defaultValue={rowData.gl_account} disabled={displayOnView} />;
  };
  useEffect(() => {
    getapiData();
  }, []);
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
          footer={displayOnEdit ? renderFooter() : ''}
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
                    Flexible              
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-12 mb-2">
                <div className="form-group row">
                  <div className="col-1">
                    <Checkbox
                      disabled={displayOnView}
                      onChange={(e) => setChecked(e.checked)}
                      checked={checked}
                    ></Checkbox>
                  </div>
                  <label className="col-3" htmlFor="name">
                    Is Billable
                  </label>
                </div>
              </div>
              <div className="col-md-12 mb-2 card">
                <DataTable
                  value={editData}

                  editMode="row"
                  dataKey="id"
                  editingRows={editingRows}
                  onRowEditChange={onRowEditChange}
                  responsiveLayout="scroll"
                >
                  <Column
                    field="lkup_name"
                    header="Mapping"
                    style={{ width: "20%" }}
                  ></Column>
                  <Column
                    field="gl_account"
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

export default ContractTerms;
