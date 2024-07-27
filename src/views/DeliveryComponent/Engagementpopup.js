import React, { useEffect, useState } from "react";
import { environment } from "../../environments/environment";
import { CModal } from '@coreui/react'
import { CModalBody } from '@coreui/react'
import { CModalHeader } from '@coreui/react'
import { CModalTitle } from '@coreui/react'
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";

function EngagementPopup(props) {

    const { popup, setPopup, setSearchdata } = props
    const baseUrl = environment.baseUrl;
    const [customersData, setCustomerData] = useState([])
    const [selectedCustomer,setselectedCustomer] = useState([]);
    const [allCustomersSelected,setallCustomersSelected] = useState(false)
    const [selectedCustomersDisplay,setselectedCustomersDisplay] = useState([])
    const [selectedCustomersData, setSelectedCustomersData] = useState([])
    const [search,setSearch] = useState("")  


    const AllCustomers = () => {
        !allCustomersSelected ?
        setselectedSE(prevState => {
            const customerId = prevState.map(item => item.id)
            const newArray = customersData.filter(item => !(customerId.includes(item.id)))
            return [...prevState,...newArray]
        }) :
        setselectedSE(prevState => {
            const customerId = customersData.map(item => item.id)
            const newArray = prevState.filter(item => !(customerId.includes(item.id)))
            return newArray
        })
        setallCustomersSelected(prevState => !prevState)
    }

    const getCustomersData = () => {
        axios({
            url: baseUrl + `/ProjectMS/Engagement/customerdata`,
        }).then((resp) => {
            setCustomerData(resp.data);
        });
    };
    useEffect(() => { getCustomersData() }, [])
    useEffect(()=>{
        setselectedCustomersDisplay(()=>{
            return selectedCustomer.filter((item)=>{return item.Name.toLowerCase().includes(search)}).map((item)=>{return(CustomerElement(item))})
        })
    },[selectedCustomer,search])

    return (
        <div>
            <CModal visible={popup} size="xl" className=" ui-dialog" onClose={() => setPopup(false)} style={{ border: "0px" }}>
                <CModalHeader >
                    <CModalTitle>
                        <h6>  Select Customers</h6>
                    </CModalTitle>
                </CModalHeader>
                <CModalBody >
                    <div>
                        <div className="group mb-5 ">
                            <div className="group-content row">
                                <div className=" col-md-4 mb-2">
                                    <div className="form-group row"><label className="col-5" htmlFor="search">Search</label><span className="col-1">:</span>
                                        <div className="col-6"><input type="text" className="form-control" id="search" placeholder /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="group mb-5 ">
                            <div className="group-content row">
                                <div className=" col-md-4">
                                    <div className="form-check form-check-inline"><input className="form-check-input" type="checkbox" name="selectedItems" id="selecteditems" /><label className="form-check-label" htmlFor="selecteditems">Selected Items :</label></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            {/* <SelectedItems selectedSEDisp={selectedSEDisp} /> */}
                        </div>
                        <div className="group mb-5 ">
                            <div className="group-content row">
                                <div className=" col-md-4">
                                    <div className="form-check form-check-inline"><input className="form-check-input" type="checkbox" name="allcustomers" id="allcustomers" onChange={AllCustomers} checked={allCustomersSelected} /><label className="form-check-label" htmlFor="All Customers">All Customers</label></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </CModalBody>
            </CModal>
        </div>
    )
}
export default EngagementPopup