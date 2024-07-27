import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { environment } from '../../environments/environment';
import axios from 'axios';
import { CModalHeader, CModalTitle } from '@coreui/react'
import { CModalBody } from '@coreui/react'
import { CButton } from "@coreui/react";
import { CModal } from "@coreui/react";
import Draggable from "react-draggable";
import ReactQuill from "react-quill";
import SaveIcon from '@mui/icons-material/Save';
import { MdOutlineCancel } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";


function BankDetailsPopup(props) {
    const { buttonPopup, setButtonPopup, getData, setAddmsg, editedData, editId, type } = props;
    const [id, setid] = useState(0);
    const [formEditData, setFormEditData] = useState(editedData)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ref = useRef([]);
    const [validationMessage, setValidationMessage] = useState(false);
    const baseUrl = environment.baseUrl

    const handleKeyDown = (event) => {
        // Regular expression pattern to match alphanumeric characters
        const alphanumericAndSpaceRegex = /^[0-9a-zA-Z\s]+$/;

        if (!alphanumericAndSpaceRegex.test(event.key)) {
            // If the pressed key is not alphanumeric, prevent it from being entered in the input field
            event.preventDefault();
        };
        if (event.key === 'Enter') {
            console.log('Enter key pressed');
        }
    };

    const handleEditClick = () => {
        console.log(formEditData.account_number)
        let valid = GlobalValidation(ref);
        console.log(valid);

        if (valid) {
            setValidationMessage(true);

            // setTimeout(() => {
            //     // setValidationMessage(false);
            // }, 3000);

            return;
        }
        axios({
            method: "post",
            url:
                baseUrl +
                `/invoicems/invoice/postbankDetails`,
            data: {

                "id": editId,
                "accountNumber": formEditData.account_number,
                "bankName": formEditData.bank_name,
                "branchLocation": formEditData.branch_location,
                "bankAddress": formEditData.bank_address,
                "accountType": formEditData.account_type,
                "ifscCode": formEditData.ifsc_code



            }
        }).then(error => {

            getData();
            console.log("success", error);
            setid();
            setButtonPopup(false);
            setAddmsg(true);

            setTimeout(() => {
                setAddmsg(false);
            }, 3000);


        });
    }

    //--------------

    const handleSaveClick = () => {

        let valid = GlobalValidation(ref);
        console.log(valid);

        if (valid) {
            setValidationMessage(true);

            // setTimeout(() => {
            //     // setValidationMessage(false);
            // }, 3000);

            return;
        }
        console.log(formEditData.account_number)
        axios({
            method: "post",
            url:
                baseUrl +
                `/invoicems/invoice/postbankDetails`,
            data: {

                "id": null,
                "accountNumber": formEditData.account_number,
                "bankName": formEditData.bank_name,
                "branchLocation": formEditData.branch_location,
                "bankAddress": formEditData.bank_address,
                "accountType": formEditData.account_type,
                "ifscCode": formEditData.ifsc_code
            }
        }).then(error => {
            getData();
            console.log("success", error);
            setid();
            setButtonPopup(false);
            setAddmsg(true);

            setTimeout(() => {
                setAddmsg(false);
            }, 3000);


        });
    }

    return (
        <div>
            <CModal size="lg" visible={buttonPopup} onClose={() => { setButtonPopup(false) }} backdrop={'static'} >
                <CModalHeader className='hgt22'>
                    <CModalTitle>
                        <div className="ft16" >Bank Details</div>
                        {/* <div className="ft16" >Bank Details </div> */}
                    </CModalTitle>
                </CModalHeader>

                <CModalBody>
                    <div className='col-md-12' >
                        {validationMessage ? <div className='statusMsg error' ><span className='error-block'>
                            <AiFillWarning /> &nbsp;Please select valid values for highlighted fields</span></div> : ""}
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="">
                                    Account Number&nbsp;<span className="error-text">*</span>
                                </label>
                                <div className="textfield"
                                    ref={(ele) => {
                                        ref.current[0] = ele;
                                    }}
                                >
                                    {type == "add" ?
                                        <input
                                            type="text"
                                            id="account_number"
                                            name="account_number"
                                            onKeyDown={handleKeyDown}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["account_number"]: e.target.value
                                            }))}
                                            autoFocus


                                        >
                                        </input> :
                                        <input
                                            type="text"
                                            id="account_number"
                                            name="account_number"
                                            onKeyDown={handleKeyDown}
                                            defaultValue={editedData.account_number}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["account_number"]: e.target.value
                                            }))}
                                        >
                                        </input>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="">
                                    Account Type&nbsp;<span className="error-text">*</span>
                                </label>
                                <div className=" textfield"


                                    ref={(ele) => {
                                        ref.current[1] = ele;
                                    }}
                                >
                                    {type == "add" ?
                                        <input
                                            type="text"
                                            id="account_type"
                                            name="account_type"
                                            onKeyDown={handleKeyDown}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["account_type"]: e.target.value
                                            }))}
                                        >
                                        </input> :

                                        <input
                                            type="text"
                                            id="account_type"
                                            name="account_type"
                                            onKeyDown={handleKeyDown}
                                            defaultValue={editedData.account_type}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["account_type"]: e.target.value
                                            }))}
                                        >
                                        </input>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="row">

                            <div className="col-md-4">
                                <label className="mt-1" htmlFor="">
                                    Bank Name&nbsp;<span className="error-text">*</span>
                                </label>
                                <div className=" textfield"


                                    ref={(ele) => {
                                        ref.current[2] = ele;
                                    }}
                                >
                                    {type == "add" ?
                                        <input
                                            type="text"
                                            id="bank_name"
                                            name="bank_name"
                                            onKeyDown={handleKeyDown}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["bank_name"]: e.target.value
                                            }))}
                                        >
                                        </input> :

                                        <input
                                            type="text"
                                            id="bank_name"
                                            name="bank_name"
                                            onKeyDown={handleKeyDown}
                                            defaultValue={editedData.bank_name}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["bank_name"]: e.target.value
                                            }))}
                                        >
                                        </input>}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="mt-1" htmlFor="">
                                    Branch Name&nbsp;<span className="error-text">*</span>
                                </label>
                                <div className=" textfield"


                                    ref={(ele) => {
                                        ref.current[3] = ele;
                                    }}
                                >
                                    {type == "add" ?
                                        <input
                                            type="text"
                                            id="branch_location"
                                            name="branch_location"
                                            onKeyDown={handleKeyDown}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["branch_location"]: e.target.value
                                            }))}
                                        >
                                        </input> :

                                        <input
                                            type="text"
                                            id="branch_location"
                                            name="branch_location"
                                            onKeyDown={handleKeyDown}
                                            defaultValue={editedData.branch_location}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["branch_location"]: e.target.value
                                            }))}
                                        >
                                        </input>}
                                </div>
                            </div>

                            <div className="col-md-4">
                                <label className="mt-1" htmlFor="">
                                    IFSC Code&nbsp;<span className="error-text">*</span>
                                </label>
                                <div className=" textfield"


                                    ref={(ele) => {
                                        ref.current[4] = ele;
                                    }}
                                >
                                    {type == "add" ?
                                        <input
                                            type="text"
                                            id="ifsc_code"
                                            name="ifsc_code"
                                            onKeyDown={handleKeyDown}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["ifsc_code"]: e.target.value
                                            }))}
                                        >
                                        </input> :

                                        <input
                                            type="text"
                                            id="ifsc_code"
                                            name="ifsc_code"
                                            onKeyDown={handleKeyDown}
                                            defaultValue={editedData.ifsc_code}
                                            onChange={(e) => setFormEditData(prev => ({
                                                ...prev,
                                                ["ifsc_code"]: e.target.value
                                            }))}
                                        >
                                        </input>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="mt-1">
                            <label htmlFor="">
                                Action&nbsp;<span className="error-text">*</span>
                            </label>
                            <div className=" textfield"


                                ref={(ele) => {
                                    ref.current[5] = ele;
                                }}
                            >
                                {type == "add" ?
                                    <input
                                        type="text"
                                        id="bank_address"
                                        name="bank_address"
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["bank_address"]: e.target.value
                                        }))}
                                    >
                                    </input> :

                                    <input
                                        type="text"
                                        id="bank_address"
                                        name="bank_address"
                                        onKeyDown={handleKeyDown}
                                        defaultValue={editedData.bank_address}
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["bank_address"]: e.target.value
                                        }))}
                                    >
                                    </input>}
                            </div>
                        </div>
                    </div>

                    <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
                        {type == "add" ?
                            <button className="btn btn-primary" onClick={handleSaveClick}><SaveIcon />Save</button> :
                            <button className="btn btn-primary" onClick={handleEditClick}><SaveIcon />Save</button>
                        }
                        <button className="btn btn-primary" onClick={() => { setButtonPopup(false) }}><VscChromeClose />Cancel</button>
                    </div>
                </CModalBody>
            </CModal>


        </div>
    )
}
export default BankDetailsPopup;