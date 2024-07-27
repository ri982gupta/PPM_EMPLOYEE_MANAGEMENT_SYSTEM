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
import ServicesPopup from "./ServicesPopup";


function Services() {
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
    let rows = 10;

    const serviceName = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.service_name}>{data.service_name}</div>) }
    const serviceDescription = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.service_description}>{data.service_description}</div>) }
    const calculator = (data) => { return (<div className="ellipsis" data-toggle="tooltip" title={data.calculator}>{data.calculator}</div>) }


    const getData = () => {
        axios.get(
            baseUrl +
            `/invoicems/invoice/getservices`)
            .then(res => {
                const GetData = res.data;
                for (let i = 0; i < GetData.length; i++) {

                    GetData[i]["SNo"] = i + 1
                }

                let dataHeaders = [{
                    // SNo: "S.No", 
                    service_name: "Service Name", service_description: "Service Description", calculator: "Calculator", Action: "Action"
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
                    {<AiFillEdit color="orange" cursor="pointer" type="edit" data-toggle="tooltip" title={"Edit row"} size="1.2em" onClick={() => { setEditedData(data); setEditId(data.id); setButtonPopup(true); setType("edit") }} align="center" />}   &nbsp;
                </div>
            </>
        );
    };
    const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
        return (
            <Column
                style={{ width: "100px" }}
                sortable
                key={col}
                body={

                    col == "service_name" && serviceName ||
                    col == "service_description" && serviceDescription ||
                    col == "calculator" && calculator ||

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
                <span className='errMsg'><BiCheck size="1.4em" strokeWidth={{ width: "100px" }} /> &nbsp;Invoice Service saved successfully</span></div> : ""}
            <div>
                <div className='col-md-12' >
                    <div className="pageTitle">
                        <div className="childOne"></div>
                        <div className="childTwo">
                            <h2>Services</h2>
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
                            <button onClick={() => { setButtonPopup(true); setType("add") }} className="btn btn-primary mt-2 mb-2" ><MdOutlinePlaylistAdd />Add Services</button></div>
                    </div>
                    {buttonPopup ? <ServicesPopup
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
export default Services;