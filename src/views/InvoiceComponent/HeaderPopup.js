import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { environment } from '../../environments/environment';
import axios from 'axios';
import { CModalHeader, CModalTitle } from '@coreui/react'
import { CModalBody } from '@coreui/react'
import { CButton } from "@coreui/react";
import { CModal } from "@coreui/react";
import Draggable from "react-draggable";
import ReactQuill, { Quill } from "react-quill";
import SaveIcon from '@mui/icons-material/Save';
import { MdOutlineCancel } from "react-icons/md";
import { VscChromeClose } from "react-icons/vsc";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
var Block = Quill.import('blots/block');
Block.tagname = "a";
Quill.register(Block);

function HeaderPopup(props) {
    const baseUrl = environment.baseUrl
    const { buttonPopup, setButtonPopup, getData, setAddmsg, editedData, editId, type } = props;
    const [value, setValue] = useState("");
    const [id, setid] = useState(0);
    const [formEditData, setFormEditData] = useState(editedData)
    const ref = useRef([]);
    const [validationMessage, setValidationMessage] = useState(false);
    const editorToolBar = {
        toolbar: [
            [

                { header: [false, 1, 2, 3, 4, 5, 6] },
                // {tooltip:["ee"]},
                // { size: [] },
                { font: [] },
                { color: [] },
                { 'bold': { tooltip: "Bold (Ctrl+B)" } }, 'italic', 'underline', { 'list': 'ordered' }, { 'list': 'bullet' },
                { 'script': 'sub' }, { 'script': 'super' },
                { 'indent': '-1' }, { 'indent': '+1' }, { 'align': null }, { 'align': 'center' }, { 'align': 'right' },
                'strike',
                'link',
                'code-block', 'clean',

            ],


        ],
        clipboard: {
            matchVisual: false,
        }
    }

    const handleEditClick = () => {

        let adddata = document.getElementsByClassName("error");
        for (let i = 0; i < adddata.length; i++) {
            if (adddata[i].value == "" || adddata[i].value == "null" || adddata[i].value == "All" || adddata[i].value == undefined ||adddata[i].value == null) {
                adddata[i].classList.add("error-block");
                setValidationMessage(true);
            }
            else {
                adddata[i].classList.remove("error-block")
                setValidationMessage(false);
            }
        }
      
        
        let title = formEditData.title
        let header = formEditData.header_content
        let footer = formEditData.footer_content

        if (Object.values({ title, header, footer }).includes("")) {
            setValidationMessage(true);
            return;
        }

        let valid = GlobalValidation(ref);

        console.log(valid);
        if (valid) {
            setValidationMessage(true);

            // setTimeout(() => {
            //     setValidationMessage(false);
            // }, 3000);

            return;
        }
        console.log(formEditData)
        axios({
            method: "post",
            url: baseUrl + `/invoicems/invoice/postheaderfooterDetails`,
            data: {
                "id": editId,
                "title": formEditData.title,
                "headerContent": formEditData.header_content,
                "footerContent": formEditData.footer_content
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

    //Save Click------------
    const handleSaveClick = () => {
        let adddata = document.getElementsByClassName("error");
        for (let i = 0; i < adddata.length; i++) {
            if (adddata[i].value == "" || adddata[i].value == null || adddata[i].value == "All" || adddata[i].value == undefined ||adddata[i].value == "null") {
                adddata[i].classList.add("error-block");
                setValidationMessage(true);
            }
            else {
                adddata[i].classList.remove("error-block")
                setValidationMessage(false);
            }
        }

        let title = formEditData.title
        let header = formEditData.header_content
        let footer = formEditData.footer_content

        if (Object.values({ title, header, footer }).includes("")) {
            setValidationMessage(true);
            return;
        }

        let valid = GlobalValidation(ref);

        console.log(valid);
        if (valid) {
            setValidationMessage(true);

            // setTimeout(() => {
            //     setValidationMessage(false);
            // }, 3000);

            return;
        }
        console.log(formEditData)
        axios({
            method: "post",
            url: baseUrl + `/invoicems/invoice/postheaderfooterDetails`,
            data: {
                "id": null,
                "title": formEditData.title,
                "headerContent": formEditData.header_content,
                "footerContent": formEditData.footer_content
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
                        <span className='ft16' >Header & Footer</span>
                    </CModalTitle>
                </CModalHeader>
                {validationMessage ? <div className='statusMsg error' ><span className='error-block'>
                    <AiFillWarning /> &nbsp;Please select valid values for highlighted fields</span></div> : ""}
                <CModalBody>

                    <div className='col-md-12' >
                        <div>
                            <label htmlFor="">
                                Title<span className="error-text">*</span>
                            </label>
                            <div className="textfield error"


                                ref={(ele) => {
                                    ref.current[0] = ele;
                                }}
                            >
                                {type == "add" ?

                                    <input type="text"
                                        id="title"
                                        name="title"
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["title"]: e.target.value
                                        }))}
                                    >
                                    </input> :
                                    <input type="text"
                                        id="title"
                                        name="title"
                                        defaultValue={editedData.title}
                                        onChange={(e) => setFormEditData(prev => ({
                                            ...prev,
                                            ["title"]: e.target.value
                                        }))}
                                    >

                                    </input>
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className=" mt-1" htmlFor="">
                            Header Content<span className="error-text">*</span>
                        </label>
                        <div className=" error"
                            // ref={(ele) => {
                            //     ref.current[1] = ele;
                            // }}
                        >
                            {type == "add" ?
                                <div>
                                    <ReactQuill
                                        theme="snow"
                                        name="header_content"
                                        id="header_content"
                                        // id="editor-container"
                                        onChange={(e) => { setValue(e); setFormEditData(prev => ({ ...prev, ["header_content"]: value })); }}
                                        // modules={editorToolBar}
                                        modules={editorToolBar}

                                    /></div> :
                                <ReactQuill
                                    theme="snow"
                                    // value={value}
                                    name="header_content"
                                    id="header_content"
                                    // id="editor-container"
                                    modules={editorToolBar}
                                    onChange={(e) => { setValue(e); setFormEditData(prev => ({ ...prev, ["header_content"]: value })); }}
                                    defaultValue={editedData.header_content == undefined || null ? "" : editedData.header_content}
                                />
                            }
                        </div>
                    </div>

                    <div>
                        <label className=" mt-1" htmlFor="">
                            Footer Content<span className="error-text ">*</span>
                        </label>
                        <div className="error"
                            // ref={(ele) => {
                            //     ref.current[2] = ele;
                            // }}
                        >
                            {type == "add" ?
                            <div> 
                                <ReactQuill
                                    theme="snow"
                                    // value={value}
                                    name="footer_content"
                                    id="footer_content"
                                    // id="editor-container"
                                    onChange={(e) => { setValue(e); setFormEditData(prev => ({ ...prev, ["footer_content"]: value })); }}
                                    modules={editorToolBar}
                                /> 
                                </div>
                                :
                                <ReactQuill
                                    theme="snow"
                                    // value={value}
                                    name="footer_content"
                                    id="footer_content"
                                    // id="editor-container"
                                    onChange={(e) => { setValue(e); setFormEditData(prev => ({ ...prev, ["footer_content"]: value })); }}
                                    defaultValue={editedData.footer_content == undefined || null ? "" : editedData.footer_content}
                                    modules={editorToolBar}
                                />
                            }
                        </div>

                    </div>

                    <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
                        {type == "add" ?
                            <button type="button" className="btn btn-primary" onClick={handleSaveClick}>
                                <SaveIcon />Save</button> :
                            <button type="button" className="btn btn-primary" onClick={handleEditClick} >
                                <SaveIcon />Save</button>
                        }
                        <button type="button" className="btn btn-primary" onClick={() => { setButtonPopup(false) }}><VscChromeClose />Cancel</button>
                    </div>

                </CModalBody>
            </CModal>



        </div>
    )

}

export default HeaderPopup;