import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { FaSave } from "react-icons/fa";
import { Close } from "@mui/icons-material";
import { BiCheck } from "react-icons/bi";
import { AiFillCloseCircle } from "react-icons/ai";
import DatePicker from "react-datepicker";
import { AiOutlinePlusSquare, AiOutlineSave } from "react-icons/ai";
import moment from "moment";
import { AiFillSave } from "react-icons/ai";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { environment } from "../../environments/environment";
import axios from "axios";
import { VscGlobe } from 'react-icons/vsc';
export default function StakeHolderProject(props) {
    const { projectId } = props;
    const baseUrl = environment.baseUrl;
    const loggedUserName = localStorage.getItem("resName");
    const loggedUserId = localStorage.getItem("resId");
    const [products, setProducts] = useState(null);
    const [roles, SetRoles] = useState([]);
    const [riskDetails, setRiskDetails] = useState([])
    const [formEditData, setFormEditData] = useState([{}])
    console.log(formEditData)
    const [displayRowEdit, setDisplayRowEdit] = useState(false);
    const [date, SetDate] = useState([]);
    const [editmsg, setEditAddmsg] = useState(false);
    const [statuses] = useState(['stack']);
    console.log(statuses)
    console.log(projectId)
    ////--------------getting of  table data
    const getStakeHoldersDetails = () => {
        axios({
            url:
                `http://localhost:8090/ProjectMS/stakeholders/getStakeHolderDetails?ObjectId=${projectId}`,
        }).then((resp) => {
            const GetData = resp.data;
            for (let i = 0; i < GetData.length; i++) {
                GetData[i]["date_created"] =GetData[i]["date_created"] == null ? "": moment(GetData[i]["date_created"]).format("DD-MMM-YYYY");
                GetData[i]["FromDate"] =GetData[i]["FromDate"] == null ? "": moment(GetData[i]["FromDate"]).format("DD-MMM-YYYY");
                GetData[i]["ToDate"] =GetData[i]["ToDate"] == null ? "": moment(GetData[i]["ToDate"]).format("DD-MMM-YYYY");
                GetData[i]["AssignmentType"] =GetData[i]["AssignmentType"] == null ? "":(GetData[i]["AssignmentType"])== true ? "Manual" : "System";
            }
            setProducts(GetData);
            
        });
    };
    console.log(products)

    ////------getting of first column dropdown
    const getRoles = () => {
        axios({
            url:  `http://localhost:8090/ProjectMS/stakeholders/getRoles`,
        }).then((resp) => {
            SetRoles(resp.data);
        });
    };
    console.log(roles)
    ////------grtting of second column Autocomplete
    const getData = () => {
        axios({
            method: "get",
            url:`http://localhost:8090/ProjectMS/risks/getAssignedData`,
        }).then(function (response) {
            var res = response.data
            setRiskDetails(res)
        })
    }
    console.log(riskDetails)
    ////-----getting of fromDate and ToDate 
    const getFromDateToDate = () => {
        axios({
            url:
            
                `http://localhost:8090/ProjectMS/stakeholders/getFromAndToDates?ObjectId=${projectId}`,
        }).then((resp) => {
            SetDate(resp.data);
        });
    };
    console.log(date);
    //-----------
    const getProjectId = (e) => {
        const { value, id } = e.target
        setFormEditData({ ...formEditData, [id]: value })
        console.log(formEditData)
    }
    const addRowEditFnc = () => {
        setProducts([{}, ...products])
        setDisplayRowEdit(true);
    };
    const [addmsg, setAddmsg] = useState(false);

    const [editId, setEditId] = useState(null);
    console.log(editId)
    console.log(formEditData)
    useEffect(() => {
        getStakeHoldersDetails();
        getRoles();
        getData();
        getFromDateToDate();
    }, []);
    const onRowEditComplete = (e) => {
        
        let _products = [...products];
        let { newData, index } = e;
        _products[index] = newData;
        console.log(newData)
        console.log(formEditData)
        setProducts(_products);
        console.log(editId)
       const putdata=()=>{
        console.log("inline-----put method")
        var  data = {
            id:editId,
            LastUpdatedBy: loggedUserName,
            LastUpdatedById: loggedUserId,
            Version: "1",
            AssignedBy: loggedUserId,
            IsActive: "1",
            CreatedBy: loggedUserName,
            ObjectTypeCode: "Resource",
            IsResolved: "1",
            IsManualAssignment: "1",
            ObjectId: projectId,
            ObjectTypeRoleTypeId: formEditData.Role,
            UserId: formEditData.UserId,
            FromDate:formEditData.FromDate,
            ToDate: formEditData.ToDate,
            object_type_id:2,
            role_type_id:formEditData.Role
          };
          axios({
            method: "post",
            url:
              `http://localhost:8090/ProjectMS/stakeholders/postDetailsinBaseDomainobjectroles`,
            data: data,
          }).then((error) => {
            console.log("success", error);
            setDisplayRowEdit(false);
            getStakeHoldersDetails();
            setEditAddmsg(true);
            setTimeout(() => {
                setEditAddmsg(false);
            }, 3000);
            console.log(editId)
          });
        }
///////---------post data
const postdata=()=>{
    console.log("inline-----post method")
    var  data = {
        LastUpdatedBy: loggedUserName,
        LastUpdatedById: loggedUserId,
        Version: "1",
        AssignedBy: loggedUserId,
        IsActive: "1",
        CreatedBy: loggedUserName,
        ObjectTypeCode: "Resource",
        IsResolved: "1",
        IsManualAssignment: "1",
        ObjectId: projectId,
        ObjectTypeRoleTypeId: formEditData.Role,
        UserId: formEditData.UserId,
        FromDate:formEditData.FromDate,
        ToDate: formEditData.ToDate,
        object_type_id:2,
        role_type_id:643
      };
      axios({
        method: "post",
        url:
          `http://localhost:8090/ProjectMS/stakeholders/postDetailsinBaseDomainobjectroles`,
        data: data,
      }).then((error) => {
        console.log("success", error);
        setDisplayRowEdit(false);
        getStakeHoldersDetails();
        setAddmsg(true);
            setTimeout(() => {
                setAddmsg(false);
            }, 3000);
        console.log(id)
      });
    }
    {newData.id ? putdata(): postdata()}
    };
    const statusEditor = (options) => {
        return (<>
            <select id="Role" onChange={(e) => { getProjectId(e) }}>
                {roles.map((Item) => (
                    <option value={Item.id} key={Item.id}>{Item.display_name}
                    </option>
                ))}
            </select>
        </>)
    };
    const Roledata = (rowData) => {
        console.log(rowData)
        setEditId(rowData.id);
        return <>
            <InputText
                id="Role"
                value={rowData.Role}
                onChange={(e) => getProjectId(e, "ObjectTypeRoleTypeId")}
                type="text"
                className="form-control"
                required
            />
        </>
    };
    const textAutoEditor = (options) => {
        return (<>
            <div className='autoComplete-container' >
                <ReactSearchAutocomplete
                    items={riskDetails}
                    type="Text"
                    name="User"
                    id="User"
                    riskDetails={riskDetails}
                    getData={getData}
                    className="AutoComplete"
                    onSelect={(e) => {
                        setFormEditData((prevProps) => ({
                            ...prevProps,
                            "UserId": e.id,
                        }));
                        console.log(e.id)
                    }}
                    showIcon={false}
                />
            </div>
        </>)
    };
    const statusBodyTemplateAutoCom = (rowData) => {
        return <InputText value={rowData.User}  type="text" required />
    };
    const [FromDate, setFromDate] = useState();
    const textFromDateEditor = (options) => {
        return (<>
            <DatePicker
                name="FromDate"
                selected={FromDate}
                id="FromDate"
                autoComplete='off'
                dateFormat="dd-MMM-yyyy"
                onChange={(e) => {
                    setFormEditData((prev) => ({
                        ...prev,
                        ["FromDate"]: moment(e).format("yyyy-MM-DD"),
                    }));
                    setFromDate(e);
                }}
            />
        </>)
    };
    const [ToDate, setToDate] = useState();
    const textToDateEditor = (options) => {
        return (<>
            <DatePicker
                name="ToDate"
                selected={ToDate}
                id="ToDate"
                autoComplete='off'
                dateFormat="dd-MMM-yyyy"
                onChange={(e) => {
                    setFormEditData((prev) => ({
                        ...prev,
                        ["ToDate"]: moment(e).format("yyyy-MM-DD"),
                    }));
                    setToDate(e);
                }}
            />
        </>)
    };
    return (
        <>
        {addmsg ? <div className='statusMsg success'>
                <span className='errMsg'><BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp; Saved successfully</span></div> : ""}
        {editmsg ? <div className='statusMsg success'>
                <span className='errMsg'><BiCheck size="1.4em"strokeWidth={{ width: "100px" }} /> &nbsp; Update successfully</span></div> : ""}
        <button>
                <AiOutlinePlusSquare title={"Add"} size={"1.4em"} onClick={(e) => { addRowEditFnc();}} /></button>
            <div className="card p-fluid">
                <DataTable value={products} editMode="row" dataKey="id" paginate row={5} onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="Role" header="Role" body={Roledata} editor={(options) => statusEditor(options)}  style={{ width: '20%' }}></Column>
                    <Column field="User" header="User" body={statusBodyTemplateAutoCom} editor={(options) => textAutoEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="FromDate" header="FromDate" editor={(options) => textFromDateEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="ToDate" header="ToDate" editor={(options) => textToDateEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="AssignmentType" header="Assignment Type" style={{ width: '20%' }}></Column>
                    <Column field="assignedBy" header="Assigned By" style={{ width: '20%' }}></Column>
                    <Column field="date_created" header="Assigned Date" style={{ width: '20%' }}></Column>
                    <Column field="IsActive" header="IsActive" style={{ width: '20%' }}></Column>
                    <Column rowEditor header="Action" headerStyle={{ width: '20%' }}></Column>
                </DataTable>
            </div>

           
        </>
    );
}
