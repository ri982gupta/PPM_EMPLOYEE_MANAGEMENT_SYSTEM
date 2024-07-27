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


function ServicesPopup(props) {
    const { buttonPopup, setButtonPopup, getData, setAddmsg, editedData, editId, type } = props;
    const [id, setid] = useState(0);
    const [formEditData, setFormEditData] = useState(editedData)
    const ref = useRef([]);
    const [validationMessage, setValidationMessage] = useState(false);
    const baseUrl = environment.baseUrl
    const handleEditClick = () => {
        let valid = GlobalValidation(ref);
        if (valid) {
            setValidationMessage(true);
            return;
        }
        axios({
            method: "post",
            url:
                baseUrl +
                `/invoicems/invoice/postserviceDetails`,
            data: {

                "id": editId,
                "serviceName": formEditData.service_name,
                "serviceDescription": formEditData.service_description,
                "calculator": formEditData.calculator == null ? " " : formEditData.calculator
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

    const handleSaveClick = () => {
        let valid = GlobalValidation(ref);
        console.log(valid);

        if (valid) {
            setValidationMessage(true);

            return;
        }
        axios({
            method: "post",
            url:
                baseUrl +
                `/invoicems/invoice/postserviceDetails`,
            data: {

                "id": editId,
                "serviceName": formEditData.service_name,
                "serviceDescription": formEditData.service_description,
                "calculator": formEditData.calculator == null ? " " : formEditData.calculator



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
            <CModal size="xs" visible={buttonPopup} onClose={() => { setButtonPopup(false) }} backdrop={'static'}>
                <CModalHeader className='hgt22'>
                    <CModalTitle>
                        <div className="ft16" >Services</div>
                        {/* <div className="ft16" >Bank Details </div> */}
                    </CModalTitle>
                </CModalHeader>

                <CModalBody >
                    <div className='col-md-12' >
                        {validationMessage ? <div className='statusMsg error' ><span className='error-block'>
                            <AiFillWarning /> &nbsp;Please select valid values for highlighted fields</span></div> : ""}
                        <div>
                            <label htmlFor="">
                                Service Name&nbsp;<span className="error-text">*</span>
                            </label>
                            <div className="textfield"


                                ref={(ele) => {
                                    ref.current[0] = ele;
                                }}
                            >
                                {type == "add" ?

                                    <input type="text"
                                        id="service_name"
                                        name="service_name"
                                        placeholder="Service Name"
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["service_name"]: e.target.value
                                        }))}
                                        autoFocus
                                    >
                                    </input> :
                                    <input type="text"
                                        id="service_name"
                                        name="service_name"
                                        defaultValue={editedData.service_name}
                                        placeholder="Service Name"
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["service_name"]: e.target.value
                                        }))}
                                    >

                                    </input>
                                }
                            </div>
                        </div>
                    </div>

                    <div className='col-md-12' >
                        <div>
                            <label className="mt-1" htmlFor="">
                                Service Description&nbsp;<span className="error-text">*</span>
                            </label>
                            <div className="textfield"


                                ref={(ele) => {
                                    ref.current[1] = ele;
                                }}
                            >
                                {type == "add" ?

                                    <textarea type="text" placeholder="Service Description"
                                        maxLength={1000} rows="8" cols={180}
                                        id="service_description"
                                        name="service_description"
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["service_description"]: e.target.value
                                        }))}

                                    >
                                    </textarea> :
                                    <textarea type="text"
                                        placeholder="Service Description" maxLength={1000} rows="8" cols={180}
                                        id="service_description"
                                        name="service_description"
                                        defaultValue={editedData.service_description}
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["service_description"]: e.target.value
                                        }))}
                                    >

                                    </textarea>
                                }
                            </div>
                        </div>
                    </div>


                    <div className='col-md-12' >
                        <div>
                            <label htmlFor="">
                                Calculator
                            </label>
                            <div className=""

                            >
                                {type == "add" ?

                                    <input type="text"
                                        placeholder="Calculator"
                                        id="calculator"
                                        name="calculator"
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["calculator"]: e.target.value
                                        }))}
                                    ></input> :
                                    <input type="text"
                                        placeholder="Calculator"
                                        id="calculator"
                                        name="calculator"
                                        defaultValue={editedData.calculator}
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["calculator"]: e.target.value
                                        }))}

                                    ></input>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
                        {type == "add" ?
                            <button className="btn btn-primary" onClick={handleSaveClick} ><SaveIcon />Save</button> :
                            <button className="btn btn-primary" onClick={handleEditClick}><SaveIcon />Save</button>
                        }
                        <button className="btn btn-primary" onClick={() => { setButtonPopup(false) }}><VscChromeClose />Cancel</button>
                    </div>
                </CModalBody >
            </CModal>
        </div>
    )

}
export default ServicesPopup;