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

function HeaderFooter() {
    const baseUrl = environment.baseUrl
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
    let rows = 10;
    useEffect(() => { }, [editedData])

    const SnoAlign = (data) => { return <div align="center">{data.SNo}</div> }
    const Title = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.title}>{data.title}</div>) }
    const Header = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.header_content}>{data.header_content}</div>) }
    const Footer = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.footer_contentClear}>{data.footer_contentClear}</div>) }


    const getData = () => {
        axios.get(
            baseUrl +
            `/invoicems/invoice/getheaderfooter`)
            // axios.get(``)
            .then(res => {
                const GetData = res.data;
                for (let i = 0; i < GetData.length; i++) {

                    GetData[i]["SNo"] = i + 1
                    GetData[i]["header_contentClear"] = GetData[i]["header_content"]
                        .replace(/<\/?[^>]+(>|$)/g, "");
                    GetData[i]["footer_contentClear"] = GetData[i]["footer_content"]
                        .replace(/<\/?[^>]+(>|$)/g, "");


                }

                let dataHeaders = [{
                    // SNo: "S.No", 
                    title: "Template Title", header_contentClear: "Header Content", footer_contentClear: "Footer Content", Action: "Action"
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
                <div >
                    {<AiFillEdit color="orange" cursor="pointer" type="edit" size="1.2em" data-toggle="tooltip" title={"Edit row"} onClick={() => { setEditedData(data); setEditId(data.id); setButtonPopup(true); setType("edit") }} align="center" />}   &nbsp;
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
                    col == "SNo" ? SnoAlign :
                        col == "title" && Title ||
                        col == "header_content" && Header ||
                        col == "footer_content" && Footer ||
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
                <span className='errMsg'><BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;Header & Footer saved successfully</span></div> : ""}
            <div className='col-md-12' >
                <div className="pageTitle">
                    <div className="childOne"></div>
                    <div className="childTwo">
                        <h2>Header & Footer</h2>
                    </div>
                    <div className="childThree"></div>
                </div>
                {loader ? <Loader /> : ""}
                <br />
                <CellRendererPrimeReactDataTable
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
                        <button onClick={() => { setButtonPopup(true); setType("add") }} className="btn btn-primary mt-2 mb-2" ><MdOutlinePlaylistAdd />Add Header & Footer</button></div>
                </div>
                {buttonPopup ? <HeaderPopup
                    type={type}
                    getData={getData}
                    data={data}
                    editId={editId}
                    editedData={editedData}
                    setAddmsg={setAddmsg}
                    buttonPopup={buttonPopup} setButtonPopup={setButtonPopup} /> : ""}
            </div>
        </div>

    )

}
export default HeaderFooter;