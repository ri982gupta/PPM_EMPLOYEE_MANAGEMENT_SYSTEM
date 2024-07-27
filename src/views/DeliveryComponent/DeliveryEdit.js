import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiSave } from "react-icons/bi";
import { RiProfileLine } from "react-icons/ri";
import { environment } from '../../environments/environment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Item from "antd/lib/list/Item";


function DeliveryEdit(props) {
    console.log(props);
    const baseUrl = environment.baseUrl;

    const [customer, setCustomer] = useState([])
    const [division, setDivision] = useState([])
    const [engagementType, setEngagementType] = useState([])
    const [industry, setIndustry] = useState([])
    const [contract, setContract] = useState([])
    const [paymentTerm, setPaymentTerm] = useState([])
    const [invoiceCycle, setInvoiceCycle] = useState([])
    const [invoiceCulture, setInvoiceCulture] = useState([])
    const [invoiceTemplate, setInvoiceTemplate] = useState([])
    const [invoiceTime, setInvoiceTime] = useState([])
    const [engCompany,setEngCompany] = useState([])
    const [currency,setCurrency]= useState([])
   const [validation, setValidation] = useState(false)
    const { engagementsId } = props;
    const [data, setData ]=useState([{}])

    console.log(engagementsId);

    const getInfo = () => {
        axios.get(baseUrl + `/ProjectMS/DeliveryDashboard/dashboardinfo?CustomerId=${engagementsId}`).then((response) =>{
            const GetInfo = response.data;
                setData(GetInfo);
        })
        .catch((response)=>{})
    }

console.log(data)


    const [details, setDetails] = useState({
        engagementCode: "", name: "", customerName: "", division: "", startDate: "", endDate: "", manager: "",
        salesExecutive: "", engagementType: "", costCenter: "", status: "", currency: "",
        salesforceOpportuintyLink: "", poNumber: "", engCompany: "", industrySolution: "",
        valueAddTasks: "", attn: "", addressLine: "", city: "", state: "", zip: "", country: "", paymentTerms: "",
        invoiceCycle: "", invoiceCulture: "", invoiceTemplate: "", invoiceTime: "", contractTerms: "",
        costContractTerms: "", taxType1: "", taxType2: "", taxType3: "", to: "", cc: "", bcc: "", emailtemplate: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails((prev) => {
            return { ...prev, [name]: value };
        });
        console.log(details)
    };

    const handleCustomer = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getCustomerName`
        }).then(res => {
            let custom = res.data;
            setCustomer(custom);
        })
    })

    const handleDivision = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getDivisionId`
        }).then(res => {
            let divson = res.data;
            setDivision(divson);
        })
    })

    const handleEngagementType = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getEngagementType`
        }).then(res => {
            let engtype = res.data;
            setEngagementType(engtype);
        })
    })

    const handleIndustry = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getIndustrySolution`
        }).then(res => {
            let indus = res.data;
            setIndustry(indus);
        })
    })

    const handleContract = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getContractTerms`
        }).then(res => {
            let contact = res.data;
            setContract(contact);
        })
    })

    const handlePaymentTerm = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getPaymentTerms`
        }).then(res => {
            let payterm = res.data;
            setPaymentTerm(payterm);
        })
    })

    const handleInvoiceCycle = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getInvoiceCycle`
        }).then(res => {
            let invcycle = res.data;
            setInvoiceCycle(invcycle);
        })
    })

    const handleInvoiceCulture = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getInvoiceCulture`
        }).then(res => {
            let inculture = res.data;
            setInvoiceCulture(inculture);
        })
    })

    const handleInvoiceTemplate = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getInvoiceTemplate`
        }).then(res => {
            let invtemp = res.data;
            setInvoiceTemplate(invtemp);
        })
    })

    const handleInvoiceTime = (() => {
        axios({
            method: "get",
            url: baseUrl + `/ProjectMS/Engagement/getInvoiceTime`
        }).then(res => {
            let intime = res.data;
            setInvoiceTime(intime);
        })
    })

    const handleCurrency =(() => {
        axios({
            method:"get",
            url: baseUrl +`/ProjectMS/Engagement/getCurrency`
        }).then(res => {
            let curre = res.data;
            setCurrency(curre);
        })
    })
            
    const handleEngCompany =(() => {
        axios({
            method:"get",
            url: baseUrl + `/ProjectMS/Engagement/getEngagementCompanay`
        }).then(res => {
            let compay =  res.data;
            setEngCompany(compay);
        })
    })


    const ValidationHandle = () => {
        if(data.code.length === 0){
           setValidation(true);
            return;
        }
    }


    useEffect(() => {
        getInfo();
        handleCustomer();
        handleDivision();
        handleEngagementType();
        handleIndustry();
        handleContract();
        handlePaymentTerm();
        handleInvoiceCycle();
        handleInvoiceCulture();
        handleInvoiceTemplate();
        handleInvoiceTime();
        handleCurrency();
        handleEngCompany();
    },[engagementsId]);

    return (
        <div>
             {validation ? <div className='errMsg'><span>Please Select Mandatory Fields</span></div> : ""}
            <div className="pageTitle">
                <div className="childOne"></div>
                <div className="childTwo">
                    <h2>Engagements</h2>
                </div>
                <div className="childThree"></div>
            </div>

    {data.map((GetData)=>(
            <div className="mb-3 mt-2 container-fluid   customCard">
                <h2><RiProfileLine /> Basic Information</h2>
                <div className="row mb-2">
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="engagementCode">Engagement Code *</label>
                        <input
                            disabled
                            type="text"
                            className="form-control"
                            id="engagementCode"
                            placeholder
                            required
                          defaultValue={GetData.code}
                        ></input>
                    </div>
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="name">Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder
                            required
                            defaultValue={GetData.tname}
                        />
                    </div>
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="customerName">Customer Name</label>
                        <select disabled className="" id="customerName" onChange={(e) => handleCustomer(e)}>
                            <option >{GetData.Customer}</option>
                        </select>
                    </div>
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="divison">Divison</label>
                        <select className="" id="divison" 
                        onChange={(e) => handleDivision(e)}>
                        <option key="" value="null">{"<<Please Select>>"}</option>
                        <option value="" selected={GetData.division}> {GetData.division} </option>
                        

                            {/* {division.map((Item) =>
                                <option value={Item.id}> {Item.name}</option>)} */}

                        </select>
                    </div>
                    <div className="col-md-3">
                        <div className="row">
                            <div className="form-group col-md-6 ">
                                <label htmlFor="startDate">Start Date</label>
                                <DatePicker
                                    name="startDate"
                                    // selected={GetData.startDt === "" ?"" : new Date(GetData.startDt)}
                                    id="startDate" 
                                    className="err cancel nochange"
                                    dateFormat="dd-MMM-yyyy"
                                    
                                    onChange={(e) => {
                                        setDetails(prev => ({ ...prev, ["startDate"]: (moment(e).format("yyyy-MM-DD")) }));
                                        console.log(e);
                                    }} onKeyDown={(e) => { e.preventDefault(); }} autoComplete="false" 
                                />
                                
                            </div>
                            <div className="form-group col-md-6 ">
                                <label htmlFor="endDate">End Date</label>
                                <DatePicker
                                    name="endDate"
                                    // selected={GetData?.endDt === "" ?"" : new Date(GetData.endDt)}
                                    id="endDate" className="err cancel nochange"
                                    dateFormat="dd-MMM-yyyy"
                                    onChange={(e) => {
                                        setDetails(prev => ({ ...prev, ["endDt"]: (moment(e).format("yyyy-MM-DD")) }));
                                        console.log(e);
                                    }} onKeyDown={(e) => { e.preventDefault(); }} autoComplete="false" 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="manager">Manager *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="manager"
                            placeholder
                            required
                            defaultValue={GetData.firstName}
                        />
                    </div>
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="salesExecutive">Sales Executive *</label>
                        <input
                            type="text"
                            className="form-control"
                            id="salesExecutive"
                            placeholder
                            required
                            defaultValue={GetData.execFirstName}
                        />
                    </div>
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="engagementType">Engagement Type *</label>
                        <select className="" id="engagementType" onChange={(e) => handleEngagementType(e)}>
                            <option key="" value="null">{"<<Please Select>>"}</option>
                            {/* <option>{GetData.engagementType == "New" ? "<<Please Select>>" : GetData.engagementType}</option> */}
                            {engagementType.map((Item) =>
                                <option value={Item.id} selected={GetData.engagementType === Item.engagementType} >{Item.engagementType}</option>)}

                        </select>
                    </div>
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="costCenter">Cost Center</label>
                        <input
                            type="text"
                            className="form-control"
                            id="costCenter"
                            placeholder
                            defaultValue={GetData.costCenterId}
                        />
                    </div>
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="status">Status *</label>
                        <select className="" id="status" >
                            <option value="">&lt;&lt; Please Select &gt;&gt;</option>
                            <option value="1" selected={GetData.Status === true ? "1" : "0"}>Active</option>
                            <option value="0" selected={GetData.Status === true ? "1" : "1"}>Inctive</option> 
                        </select>
                    </div>
                    <div className="form-group col-md-3 mb-2">
                        <label htmlFor="currency">Currency *</label>
                        <select className="" id="currency" onChange={(e) => handleCurrency(e)} >
                        <option key="" value="null">{"<<Please Select>>"}</option>                         
                            {currency.map((Item) => 
                                <option value={Item.id} selected={GetData.currency === Item.currency}>{Item.currency}</option>)}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="salesForceOppurtunityLink">
                            Salesforce Oppurtunity Link
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="salesForceOppurtunityLink"
                            placeholder
                            defaultValue={GetData.sfopportunityLink}
                        />
                    </div>
                    <div className="form-group col-md-3 mb-3">
                        <label htmlFor="poNumber">PO Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="poNumber"
                            placeholder
                            defaultValue={GetData.poNumber}
                        />
                    </div>
                    <div className="form-group col-md-3 mb-3">
                        <label htmlFor="engCompany">Eng.Company *</label>
                        <select className="" id="engCompany" onChange={(e) => handleEngCompany(e)}>
                        <option key="" value="null">{"<<Please Select>>"}</option>     
                            {engCompany.map((Item) =>
                             <option value={Item.id} selected={GetData.engCompanyName === Item.Company}>{Item.Company}</option>)}
                        </select>
                    </div>
                </div>
            </div>
))}

{data.map((GetData)=>(
            <div className="group mb-3 container-fluid   customCard">
                <h2><RiProfileLine /> Industry and Capability Compliance</h2>
                <div className="group-content row">
                    <div className="col-md-3">
                        <label htmlFor="engCompany">Industry Solution</label>
                        <select className="" id="industrySolution" onChange={(e) => handleIndustry(e)}>
                        <option key="" value="null">{"<<Please Select>>"}</option>  
                            {industry.map((Item) =>
                                <option value={Item.id} selected={GetData.industrySolutionsVal === Item.industrySolution}>{Item.industrySolution}</option>)}
                        </select>
                    </div>
                    <div className=" col-md-3">
                        <label htmlFor="message-textareavalueAddTasks">
                            Value Add Tasks
                        </label>
                        <textarea
                            className="form-control"
                            id="valueAddTasks"
                            placeholder=""
                            rows={2}
                            required
                            defaultValue={GetData.valueAddedTasks}
                        />
                    </div>
                </div>
            </div>
))}

{data.map((GetData)=>(
            <div className="group mb-3 container-fluid   customCard">
                <h2><RiProfileLine /> Billing Information</h2>
                <div className="row">
                    <div className="col-md-4">

                        <h2>Bill to Details</h2>

                        <div className="group-content row">
                            <div className="mb-2 col-md-12">
                                <div className="form-group row">
                                    <label className="col-md-5" for="name">
                                        Attn. 
                                    </label>
                                    <span className="col-1 ">:</span>
                                    <div className="col-md-6">
                                        <input type="text" className="form-control" id="name" value={GetData.attn} />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 col-md-12">
                                <div className="form-group row">
                                    <label className="col-5" for="name-input-inline">
                                        Address Line
                                    </label>
                                    <span className="col-1 ">:</span>
                                    <div className="col-6">
                                        <p className="col-6" id="name-input-inline">{GetData.addressLine}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 col-md-12">
                                <div className="form-group row">
                                    <label className="col-5" for="name-input-inline">
                                        City
                                    </label>
                                    <span className="col-1 ">:</span>
                                    <div className="col-6">
                                        <p className="col-6" id="name-input-inline">{GetData.city}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 col-md-12">
                                <div className="form-group row">
                                    <label className="col-5" for="name-input-inline">
                                        State/Province
                                    </label>
                                    <span className="col-1 ">:</span>
                                    <div className="col-6">
                                        <p className="col-6" id="name-input-inline">{GetData.state}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 col-md-12">
                                <div className="form-group row">
                                    <label className="col-5" for="name-input-inline">
                                        ZIP/Postal Code
                                    </label>
                                    <span className="col-1 ">:</span>
                                    <div className="col-6">
                                        <p className="col-6" id="name-input-inline">{GetData.zipCode}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-2 col-md-12">
                                <div className="form-group row">
                                    <label className="col-5" for="name-input-inline">
                                        Country
                                    </label>
                                    <span className="col-1 ">:</span>
                                    <div className="col-6">
                                        <p className="col-6" id="name-input-inline">{GetData.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>




                    <div className="col-md-8">

                        <h2>Invoice Details</h2>
                        <div className="row">
                            <div className="col-md-5 mt-2">
                                <div className=" row ">
                                    <div className=" col-md-12">
                                        <div className="frmo-group row mb-2">
                                            <label className="col-5" htmlFor="Payment Terms -select"> Payment Terms * </label>
                                            <span className="col-1">:</span>
                                            <div className="col-6">
                                                <select className="" id="Payment Terms -select" onChange={(e) => handlePaymentTerm(e)}>
                                                <option key="" value="null">{"<<Please Select>>"}</option>  
                                                    {paymentTerm.map((Item) =>
                                                        <option value={Item.lkup_type_group_id} selected={GetData.paymentTerms === Item.paymentTerms}>{Item.paymentTerms}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" row ">
                                    <div className=" col-md-12 ">
                                        <div className="frmo-group row mb-2">
                                            <label className="col-5" htmlFor="Invoice Cycle -select"> Invoice Cycle * </label>
                                            <span className="col-1">:</span>
                                            <div className="col-6">
                                                <select className="" id="Invoice Cycle -select" onChange={(e) => handleInvoiceCycle(e)}>
                                                <option key="" value="null">{"<<Please Select>>"}</option>
                                                    {invoiceCycle.map((Item) =>
                                                        <option value={Item.lkup_type_group_id} selected={GetData.invoiceCycle === Item.invoiceCycle}>{Item.invoiceCycle}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" row ">
                                    <div className=" col-md-12 ">
                                        <div className="form-group row mb-2">
                                            <label className="col-5" htmlFor="Invoice Culture -select">
                                                Invoice Culture
                                            </label>
                                            <span className="col-1 ">:</span>
                                            <div className="col-6">
                                                <select className="" id="Invoice Culture -select" onChange={(e) => handleInvoiceCulture(e)}>
                                                <option key="" value="null">{"<<Please Select>>"}</option>
                                                    {invoiceCulture.map((Item) =>
                                                        <option value={Item.lkup_type_group_id} selected={GetData.invoiceCulture === Item.invoiceTime}>{Item.invoiceTime}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" row ">
                                    <div className=" col-md-12 ">
                                        <div className="form-group row mb-2">
                                            <label className="col-5" htmlFor="Invoice Template -select"> Invoice Template
                                            </label>
                                            <span className="col-1 ">:</span>
                                            <div className="col-6">
                                                <select className="" id="Invoice Template -select" onChange={(e) => handleInvoiceTemplate(e)} >
                                                <option key="" value="null">{"<<Please Select>>"}</option>
                                                    {invoiceTemplate.map((Item) =>
                                                        <option value={Item.lkup_type_group_id} selected={GetData.invoiceTemplate === Item.invoiceTemplate}>{Item.invoiceTemplate}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=" row ">
                                    <div className=" col-md-12 ">
                                        <div className="form-group row mb-2">
                                            <label className="col-5" htmlFor="Invoice Time  -select">
                                                Invoice Time *
                                            </label>
                                            <span className="col-1">:</span>
                                            <div className="col-6">
                                                <select className="" id="Invoice Time  -select" onChange={(e) => handleInvoiceTime(e)}>
                                                <option key="" value="null">{"<<Please Select>>"}</option>
                                                    {invoiceTime.map((Item) =>
                                                        <option value={Item.lkup_type_group_id} selected={GetData.invoiceTime === Item.invoiceTime}>{Item.invoiceTime}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-7 mt-2">

                                <div className="mb-2 row ">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="message-textarea">Billing Instructions</label>
                                        <textarea className="form-control" id="Billing Instructions" placeholder="" rows={2} required defaultValue={""} value={GetData.billingInstructions}/>
                                    </div>
                                </div>
                                <div className="mb-2 row ">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="message-textarea">Client Message</label>
                                        <textarea className="form-control" id="Client Message" placeholder="" rows={2} required defaultValue={""} 
                                        value={GetData.clientMessage}/>
                                    </div>
                                </div>


                            </div>
                        </div>

                    </div>
                </div>



                <div className="row">
                    <div className="col-md-4 group mb-3 container-fluid   customCard">
                        <div className="group-content row ">
                            <h2>Contract</h2>
                            <div className=" row ">
                                <div className="mb-2 col-md-12">
                                    <div className="form-group row">
                                        <label className="col-5" htmlFor="Contract Terms -select"> Contract Terms * </label>
                                        <span className="col-1 ">:</span>
                                        <div className="col-6">
                                            <select className="" id="Contract Terms -select" onChange={(e) => handleContract(e)}>
                                            <option key="" value="null">{"<<Please Select>>"}</option>
                                                {contract.map((Item) =>
                                                    <option value={Item.lkup_type_group_id} selected={GetData.contractTerms === Item.contractTerm}>{Item.contractTerm}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" row ">
                                <div className="mb-2 col-md-12">
                                    <div className="form-group row">
                                        <label className="col-5" htmlFor="Cost Contract Terms-select"> Cost Contract Terms</label>
                                        <span className="col-1 ">:</span>
                                        <div className="col-6">
                                            <select className="" id="Cost Contract Terms-select" onChange={(e) => handleContract(e)}>
                                            <option key="" value="null">{"<<Please Select>>"}</option>
                                                {contract.map((Item) =>
                                                    <option value={Item.lkup_type_group_id} selected={GetData.costContractTerms === Item.contractTerm}>{Item.contractTerm}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3 group mb-3 container-fluid   customCard">
                        <div className="group-content row ">
                            <h2>Tax Structure</h2>
                            <div className=" row ">
                                <div className="mb-2 col-md-12 ">
                                    <div className="form-group row">
                                        <label className="col-5" htmlFor="Tax Type 1">
                                            Tax Type 1
                                        </label>
                                        <span className="col-1 ">:</span>
                                        <div className="col-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Attn."
                                                placeholder
                                            />
                                        </div>
                                        <div className="col-3 row">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Attn."
                                                placeholder
                                            />
                                        </div>
                                        <span className="col-1">%</span>
                                    </div>
                                </div>
                            </div>
                            <div className=" row ">
                                <div className="mb-2 col-md-12">
                                    <div className="form-group row">
                                        <label className="col-5" htmlFor="Tax Type 2">
                                            Tax Type 2
                                        </label>
                                        <span className="col-1">:</span>
                                        <div className="col-3 ">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Attn."
                                                placeholder
                                            />
                                        </div>
                                        <div className="col-3 row">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Attn."
                                                placeholder
                                            />
                                        </div>
                                        <span className="col-1 ">%</span>
                                    </div>
                                </div>
                            </div>
                            <div className=" row ">
                                <div className="mb-2 col-md-12 ">
                                    <div className="form-group row">
                                        <label className="col-5" htmlFor="Tax Type 3">
                                            Tax Type 3
                                        </label>
                                        <span className="col-1 ">:</span>
                                        <div className="col-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Attn."
                                                placeholder
                                            />
                                        </div>
                                        <div className="col-3 row">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Attn."
                                                placeholder
                                            />
                                        </div>
                                        <span className="col-1 ">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 group mb-3 container-fluid   customCard">
                        <div className="group-content row ">
                            <h2>Mailing Details</h2>
                            <div className=" row ">
                                <div className="mb-2 col-md-12 ">
                                    <div className="form-group row">
                                        <label className="col-5" htmlFor="To">
                                            To
                                        </label>
                                        <span className="col-1 ">:</span>
                                        <div className="col-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Attn."
                                                placeholder
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="mb-2 col-md-12 ">
                                    <div className="form-group row">
                                        <label className="col-5" htmlFor="CC">
                                            CC
                                        </label>
                                        <span className="col-1 ">:</span>
                                        <div className="col-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Attn."
                                                placeholder
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" row ">
                                <div className="mb-2 col-md-12 ">
                                    <div className="form-group row">
                                        <label className="col-5" htmlFor="BCC">
                                            BCC
                                        </label>
                                        <span className="col-1 ">:</span>
                                        <div className="col-6">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Attn."
                                                placeholder
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" row ">
                                <div className="mb-2 col-md-12">
                                    <div className="form-group row">
                                        <label className="col-5" htmlFor="Email Template-select">
                                            Email Template
                                        </label>
                                        <span className="col-1 ">:</span>
                                        <div className="col-6">
                                            <select className="" id="Email Template-select">
                                                <option value="All"> &lt;&lt;Please Select&gt;&gt;</option>
                                                <option value={1}>A</option>
                                                <option value={2}>B</option>
                                                <option value={3}>C</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

))}

            <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
                <button className="btn btn-primary" type="submit" onClick={ValidationHandle}><BiSave /> Save</button>
                <button className="btn btn-secondary"><span className="logo">x</span> Cancel</button>
            </div>
        </div>

        
    );
}

export default DeliveryEdit;