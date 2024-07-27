import React from "react"
import { environment } from '../../environments/environment';
import { AiFillDelete, AiFillEdit, AiFillWarning, AiOutlineFileSearch } from "react-icons/ai";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "ag-grid-community";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import HeaderPopup from "./HeaderPopup";
import { BiCheck } from "react-icons/bi";
import Loader from "../Loader/Loader";
import BankDetailsPopup from "./BankDetailsPopup";
import ErrorLogTable from "../Administration/ErrorLogsTable";
function BankDetails() {
    let rows = 10;
    const [data, setData] = useState([{}]);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [headerData, setHeaderData] = useState([]);
    const [linkColumns, setLinkColumns] = useState([]);
    const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
    const [type, setType] = useState("add")
    const [editedData, setEditedData] = useState([]);
    const [editId, setEditId] = useState()
    const [addmsg, setAddmsg] = useState(false);
    const [loader, setLoader] = useState(false)
    const baseUrl = environment.baseUrl

    const accountNumber = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.account_number}>{data.account_number}</div>) }
    const bankname = (data) => { return (<div className="ellipsis" style={{width:"100%"}} data-toggle="tooltip" title={data.bank_name}>{data.bank_name}</div>) }
    const branchname = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.branch_location}>{data.branch_location}</div>) }
    const ifscCode = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.ifsc_code}>{data.ifsc_code}</div>) }
    // const Footer = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.footer_content}>{data.footer_content}</div>) }


    const getData = () => {
        axios.get(
            baseUrl +
            `/invoicems/invoice/getbankdeatils`)
            // axios.get(``)
            .then(res => {
                const GetData = res.data;
                for (let i = 0; i < GetData.length; i++) {

                    GetData[i]["SNo"] = i + 1
                }

                let dataHeaders = [{
                    // SNo: "S.No", 
                    account_number: "Account Number", bank_name: "Bank Name", branch_location: "Branch Name", ifsc_code: "IFSC Code", Action: "Action"
                }]
                let data = ["Action"];
                setLinkColumns(data);
                setData(dataHeaders.concat(GetData));
                setLoader(true)
                setTimeout(() => {
                    setLoader(false)
                }, 100);
            })
            .catch(error => {

            })
    }
    useEffect(() => {
        getData();
    }, [])

    const LinkTemplate = (data) => {

        let rou = linkColumns[0];
        return (
            <>
                <div align="center">
                    {<AiFillEdit color="orange" cursor="pointer" data-toggle="tooltip" title={"Edit row"} type="edit" size="1.2em" onClick={() => { setEditedData(data); setEditId(data.id); setButtonPopup(true); setType("edit") }} align="center" />}   &nbsp;
                </div>
            </>
        );
    };
    const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
        return (
            <Column
                sortable
                key={col}
                body={
                    // col == "SNo" ? SnoAlign :
                    col == "account_number" && accountNumber ||
                    col == "branch_location" && branchname ||
                    col == "bank_name" && bankname ||
                    col == "ifsc_code" && ifscCode ||
                    col == "Action" && LinkTemplate

                }
                field={col}
                header={headerData[col]}
            />
        );
    });
    useEffect(() => {
        data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
    }, [data]);

    return (
        <div>
            {addmsg ? <div className='statusMsg success'>
                <span className='errMsg'><BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;Bank Details saved Successfully</span></div> : ""}
            <div>
                <div className='col-md-12' >
                    <div className="pageTitle">
                        <div className="childOne"></div>
                        <div className="childTwo">
                            <h2>Bank Details</h2>
                        </div>
                        <div className="childThree"></div>
                    </div>
                    {loader ? <Loader /> : ""}
                    <br />
                    <ErrorLogTable
                        data={data}
                        linkColumns={linkColumns}
                        linkColumnsRoutes={linkColumnsRoutes}
                        dynamicColumns={dynamicColumns}
                        headerData={headerData}
                        setHeaderData={setHeaderData}
                        rows={rows}
                    />
                    <div className="row">
                        <div className="col-md-12 btn-container center ">
                            <button onClick={() => { setButtonPopup(true); setType("add") }} className="btn btn-primary mt-2 mb-2" ><MdOutlinePlaylistAdd />Add Bank Details</button></div>
                    </div>
                    {buttonPopup ? <BankDetailsPopup
                        type={type}
                        getData={getData}
                        data={data}
                        editId={editId}
                        editedData={editedData}
                        setAddmsg={setAddmsg}
                        buttonPopup={buttonPopup} setButtonPopup={setButtonPopup} /> : ""}
                </div>
            </div>

        </div>
    )
}
export default BankDetails;