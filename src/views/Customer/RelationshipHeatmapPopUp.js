import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { environment } from '../../environments/environment';
import axios from 'axios';
import { CModalHeader } from '@coreui/react'
import { CModalBody } from '@coreui/react'
import { CModal } from "@coreui/react";
import SaveIcon from '@mui/icons-material/Save';
import { CModalTitle } from "@coreui/react";
import { AiFillDelete, AiFillWarning } from "react-icons/ai";
import GlobalValidation from "../ValidationComponent/GlobalValidation";

function RelationshipHeatmapPopUp(props) {
    const { buttonPopup, setButtonPopup,
        customerId,
        getData,
        editId,
        type,
        editedData,
        formData,
        setAddmsg,
        setEditAddmsg
    } = props;

    const baseUrl = environment.baseUrl
    const ref = useRef([]);
    const [formData1, setFormData1] = useState(formData)
    const [formEditData, setFormEditData] = useState(editedData)
    const [id, setid] = useState(0);
    const [validationMessage, setValidationMessage] = useState(false);
    const [priority, setPriority] = useState([])
    const [relationshipStrength, setRelationshipStrength] = useState([])
    const [engagementLevel, setEngagementLevel] = useState([])


    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData1(prev => ({ ...prev, [id]: value }))
    }



    const getIssueSource = (e) => {

        axios({
            method: "get",
            url:
                baseUrl +
                `/customersms/getPriority`
        })
            .then(res => {
                var priority = res.data;
                setPriority(priority);

            })
    }

    const getRelationshipStrength = (e) => {

        axios({
            method: "get",
            url:
                baseUrl +
                `/customersms/getRelationshipStrength`
        })
            .then(res => {
                var relationshipStrength = res.data;
                setRelationshipStrength(relationshipStrength);

            })
    }


    const getEngagementLevel = (e) => {

        axios({
            method: "get",
            url:
                baseUrl +
                `/customersms/getEngagementLevel`
        })
            .then(res => {
                var engagementLevel = res.data;
                setEngagementLevel(engagementLevel);

            })
    }



    useEffect(() => {
        getIssueSource();
        getRelationshipStrength();
        getEngagementLevel();
    }, [])


    const handleEditClick = () => {
        
        console.log(formEditData, "formEditData");

        let valid = GlobalValidation(ref);
        if (valid) {
            setValidationMessage(true);
            return;
        }


        axios({
            method: "post",
            url:
                baseUrl +
                `/customersms/postRelationHeatMap`,


            data: {

                "id": editId,
                "customerId": customerId,
                "name": formEditData.name,
                "title": formEditData.title,
                "department": formEditData.department,
                "priority": formEditData.priorityid,
                "relationship_strength": formEditData.relationshipid,
                "engagement_level": formEditData.engagementid,
                "role_description": formEditData.role_description,
                "fy_mandate": formEditData.fy_mandate
            }

        }).then(error => {

            getData();
            setid();

        });

        setButtonPopup(false);
        setEditAddmsg(true);

        setTimeout(() => {
            setEditAddmsg(false);
            setValidationMessage(false);
        }, 3000);
    }



    const handleSaveClick = () => {

        console.log(formData1, "formEditData");

        let valid = GlobalValidation(ref);
        if (valid) {
            setValidationMessage(true);

        }
        if (valid) {
            return
        }

        axios({
            method: "post",
            url:
                baseUrl +
                `/customersms/postRelationHeatMap`,
            data: {
                "customerId": customerId,
                "name": formData1.name,
                "title": formData1.title,
                "department": formData1.department,
                "priority": formData1.priority,
                "relationship_strength": formData1.relationship_strength,
                "engagement_level": formData1.engagement_level,
                "role_description": formData1.role_description,
                "fy_mandate": formData1.fy_mandate
            }

        })
            .then(error => {
                getData();

            });

        setid();
        setButtonPopup(false);

        setAddmsg(true);
        setTimeout(() => {
            setAddmsg(false);
            setValidationMessage(false);
        }, 3000);
    }


    return (
        <div>


            <CModal size="xs" visible={buttonPopup} onClose={() => { setButtonPopup(false) }} backdrop={'static'} >
                <CModalHeader className='hgt22' style={{ cursor: "all-scroll" }} >
                    <CModalTitle >
                        {type == "add" ?
                            <span className='ft16' > Add Relationship Heatmap</span> :
                            <span className='ft16' > Edit Relationship Heatmap</span>
                        }
                    </CModalTitle>
                </CModalHeader>
                <CModalBody >
                    <div className='col-md-12' >
                        {validationMessage ? <div className='statusMsg error' ><span className='error-block'>
                            <AiFillWarning /> &nbsp;Please select valid values for highlighted fields</span></div> : ""}

                        <div className="form-group row mb-2">
                            <label className="col-5" htmlFor="">
                                Name&nbsp;<span className="error-text">*</span>
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-6 textfield"
                                ref={(ele) => {
                                    ref.current[0] = ele;
                                }}
                            >
                                {type === "add" ? (
                                    <input
                                        className="text"
                                        type="text"
                                        placeholder="Max 50 characters"
                                        name="name"
                                        id="name"
                                        maxLength={50}
                                        // onKeyDown={(event) => {
                                        //     if (event.code === "Space" && !formData1.name) event.preventDefault();
                                        // }}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                                                setFormData1((prev) => ({ ...prev, name: inputValue }));
                                            }
                                        }}
                                        style={{
                                            borderBottom: formData1.name.length > 50 ? "2px solid red" : "",
                                        }}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Max 50 characters"
                                        name="name"
                                        id="name"
                                        defaultValue={editedData.name}
                                        maxLength={50}
                                        // onKeyDown={(event) => {
                                        //     if (event.code === "Space" && !formData1.name) event.preventDefault();
                                        // }}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                                                setFormEditData((prev) => ({ ...prev, name: inputValue }));
                                            }
                                        }}
                                        style={{
                                            borderBottom: formEditData.name.length > 50 ? "2px solid red" : "",
                                        }}
                                    />
                                )}


                            </div>
                        </div>


                    </div>

                    <div className='col-md-12'>
                        <div className="form-group row mb-2">
                            <label className="col-5">
                                Title&nbsp;<span className="error-text">*</span>
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-6 textfield"
                                ref={(ele) => {
                                    ref.current[1] = ele;
                                }}
                            >
                                {type == "add" ?
                                    <input
                                        type="text"
                                        placeholder="Max 50 characters"
                                        name="title"
                                        id="title"
                                        value={formData1.title}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 50) {
                                                setFormData1(prev => ({ ...prev, ["title"]: e.target.value }));
                                            }
                                        }}
                                        className={`text ${formData1.title && formData1.title.length > 50 ? "error-border" : ""}`}
                                    /> :
                                    <input
                                        type="text"
                                        placeholder="Max 50 characters"
                                        name="title"
                                        id="title"
                                        defaultValue={editedData.title}
                                        value={formEditData.title}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 50) {
                                                setFormEditData(prev => ({ ...prev, ["title"]: e.target.value }));
                                            }
                                        }}
                                        className={`text ${formEditData.title && formEditData.title.length > 50 ? "error-border" : ""}`}
                                    />}
                            </div>
                        </div>
                    </div>


                    <div className='col-md-12' >
                        <div className="form-group row mb-2">
                            <label className="col-5" htmlFor="">
                                Department&nbsp;<span className="error-text">*</span>
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-6 textfield"
                                ref={(ele) => {
                                    ref.current[2] = ele;
                                }}>
                                {type === "add" ? (
                                    <input
                                        type="text"
                                        placeholder="Max 50 characters"
                                        name="department"
                                        id="department"
                                        maxLength="50"
                                        // onKeyDown={(event) => {
                                        //     if (event.code === "Space" && !formData1.department) event.preventDefault();
                                        // }}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                                                setFormData1((prev) => ({ ...prev, department: inputValue }));
                                            }
                                        }}
                                        className={formData1.department.length > 50 ? "error-input" : ""}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Max 50 characters"
                                        name="department"
                                        id="department"
                                        maxLength="50"
                                        // onKeyDown={(event) => {
                                        //     if (event.code === "Space" && !formData1.department) event.preventDefault();
                                        // }}
                                        defaultValue={editedData.department}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                                                setFormEditData((prev) => ({ ...prev, department: inputValue }));
                                            }
                                        }}
                                        className={formEditData.department.length > 50 ? "error-input" : ""}
                                    />
                                )}

                            </div>
                        </div>
                    </div>


                    <div className='col-md-12' >
                        <div className="form-group row mb-2">
                            <label className="col-5" htmlFor="Date">
                                Priority&nbsp;<span className="error-text">*</span>
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-6 textfield"
                            >
                                {type == "add" ?
                                    <>
                                        <select
                                            className="text"
                                            name="priority"
                                            id="priority"
                                            onChange={(e) => handleChange(e)}
                                            ref={(ele) => {
                                                ref.current[3] = ele;
                                            }}
                                        >
                                            <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                                            {priority.map((Item) =>
                                                <option value={Item.id}> {Item.lkup_name}</option>)}

                                        </select>
                                    </>

                                    : <>
                                        <select className='error col-md-12 p0 text '
                                            name="priority"
                                            id="priority"
                                            onChange={(e) => setFormEditData(prev => ({ ...prev, ["priorityid"]: e.target.value }))}
                                            ref={(ele) => {
                                                ref.current[3] = ele;
                                            }}
                                        >
                                            <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                                            {priority.map((Item) =>
                                                <option value={Item.id} selected={Item.id == editedData?.priorityid ? true : false}> {Item.lkup_name}</option>)}
                                        </select>

                                    </>
                                }

                            </div>
                        </div>
                    </div>



                    <div className='col-md-12' >
                        <div className="form-group row mb-2">
                            <label className="col-5" htmlFor="Date">
                                Relationship Strength&nbsp;<span className="error-text">*</span>
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-6 textfield"
                            >
                                {type == "add" ?

                                    <select
                                        name="relationship_strength"
                                        id="relationship_strength"
                                        className="text"
                                        onChange={(e) => handleChange(e)}
                                        ref={(ele) => {
                                            ref.current[4] = ele;
                                        }}
                                    >
                                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                                        {relationshipStrength.map((Item) =>
                                            <option value={Item.id}> {Item.lkup_name}</option>)}

                                    </select>
                                    :

                                    <select className='error col-md-12 p0 text'
                                        name="relationship_strength"
                                        id="relationship_strength"
                                        onChange={(e) => setFormEditData(prev => ({ ...prev, ["relationshipid"]: e.target.value }))}
                                        ref={(ele) => {
                                            ref.current[4] = ele;
                                        }}>
                                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                                        {relationshipStrength.map((Item) =>
                                            <option value={Item.id} selected={Item.id == editedData?.relationshipid ? true : false}> {Item.lkup_name}</option>)}
                                    </select>


                                }


                            </div>
                        </div>
                    </div>


                    <div className='col-md-12' >
                        <div className="form-group row mb-2">
                            <label className="col-5" htmlFor="Date">
                                Engagement Level&nbsp;<span className="error-text">*</span>
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-6 textfield"
                            >

                                {type == "add" ?

                                    <select
                                        name="engagement_level"
                                        id="engagement_level"
                                        className="text"
                                        onChange={(e) => handleChange(e)}
                                        ref={(ele) => {
                                            ref.current[5] = ele;
                                        }}
                                    >
                                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                                        {engagementLevel.map((Item) =>
                                            <option value={Item.id}> {Item.lkup_name}</option>)}

                                    </select>

                                    :

                                    <select className='error col-md-12 p0 text '
                                        name="relationship_strength"
                                        id="relationship_strength"
                                        onChange={(e) => setFormEditData(prev => ({ ...prev, ["engagementid"]: e.target.value }))}
                                        ref={(ele) => {
                                            ref.current[5] = ele;
                                        }}
                                    >
                                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                                        {engagementLevel.map((Item) =>
                                            <option value={Item.id} selected={Item.id == editedData?.engagementid ? true : false}> {Item.lkup_name}</option>)}
                                    </select>

                                }


                            </div>
                        </div>
                    </div>



                    <div className='col-md-12' >
                        <div className="form-group row mb-2">
                            <label className="col-5" htmlFor="">
                                Role Description
                            </label>
                            <div className='col-md-12' >

                                {type == "add" ?
                                    <textarea
                                        type="text"
                                        name="role_description"
                                        id="role_description"
                                        onChange={(e) => setFormData1(prev => ({ ...prev, ["role_description"]: e.target.value }))}
                                    /> :

                                    <textarea
                                        type="text"
                                        name="role_description"
                                        id="role_description"
                                        defaultValue={editedData.role_description}
                                        onChange={(e) => setFormEditData(prev => ({ ...prev, ["role_description"]: e.target.value }))}
                                    />}

                            </div>
                        </div>
                    </div>


                    <div className='col-md-12' >
                        <div className="form-group row mb-2">
                            <label className="col-5" htmlFor="">
                                FY Mandate
                            </label>

                            <div className='col-md-12' >
                                {type == "add" ?
                                    <textarea
                                        type="text"
                                        name="fy_mandate"
                                        id="fy_mandate"
                                        onChange={(e) => setFormData1(prev => ({ ...prev, ["fy_mandate"]: e.target.value }))}
                                    /> :
                                    <textarea
                                        type="text"

                                        name="fy_mandate"
                                        id="fy_mandate"
                                        defaultValue={editedData.fy_mandate}
                                        onChange={(e) => setFormEditData(prev => ({ ...prev, ["fy_mandate"]: e.target.value }))}
                                    />
                                }
                            </div>
                        </div>
                    </div>


                    <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
                        {type == "add" ?
                            <button className="btn btn-primary "
                                onClick={handleSaveClick}


                            ><SaveIcon />Save</button> :
                            <button className="btn btn-primary "

                                onClick={handleEditClick}
                            ><SaveIcon />Save</button>}
                    </div>
                </CModalBody>
            </CModal>

        </div>
    )
}
export default RelationshipHeatmapPopUp;