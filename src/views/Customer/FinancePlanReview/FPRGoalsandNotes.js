import React from "react";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import { CModalTitle } from "@coreui/react";
import { environment } from "../../../environments/environment";
import moment from "moment";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Row } from "primereact/row";
import { ColumnGroup } from "primereact/columngroup";
// import { v4 as uuidv4 } from "uuid";
import { FaPencilAlt, FaPlus } from "react-icons/fa";
import { RiDeleteBinFill, RiSave3Line } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { FcCancel } from "react-icons/fc";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Column } from "primereact/column";
import { Popover, Button, Select, MenuItem } from "@mui/material";
import ReactDOM from "react-dom";

import MaterialReactTable from "material-react-table";
import PlRevTable from "./PlRevTable";
import DataTable from "react-data-table-component";
import { FaCaretDown, FaSave } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { BiReset } from "react-icons/bi";
// import "./FPRGoalsAndNotes.scss"

function FPRGoalsandNotes(props) {
    const {
        servicesPayload,
        goalData,
        setGoalData,
        noteData,
        setNoteData,
        goalsPopup,
        setGoalsPopup,
        rowData,
        loggedUserId,
    } = props;
    const baseUrl = environment.baseUrl;

    console.log(servicesPayload, "noteData");

    const [btnState, setbtnState] = useState("Goals");
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editableId, setEditableId] = useState();
    const [deleteNoteId, setDeleteNoteId] = useState();
    const [noteValue, setNoteValue] = useState("");
    const [noteTitleValue, setNoteTitleValue] = useState("");
    const [deletePopup, setDeletePopup] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [displaySigningTargets, setDisplaySigningTargets] = useState(null);
    const [displaySigningTargets1, setDisplaySigningTargets1] = useState(null);
    let columnArray =
        goalData && Object.keys(goalData[0]).filter((key) => key !== "id");
    console.log(columnArray, "--columnArray");
    const [practices, setPractices] = useState([
        {
            value: 1,
            label: "DACS",
        },
        {
            value: 3,
            label: "IM&A",
        },
        {
            value: 4,
            label: "QA&TA",
        },
        {
            value: 6,
            label: "Prolifics Products",
        },
    ]);
    const [selectedPractices, setSelectedPractices] = useState(practices);
    const [serviceOfferings, setServiceOfferings] = useState([
        {
            value: 1102,
            label: "Consulting",
        },
        {
            value: 1103,
            label: "Engineering",
        },
        {
            value: 1104,
            label: "Managed Services",
        },
    ]);
    const [selectedServiceOfferings, setSelectedServiceOfferings] =
        useState(serviceOfferings);

    const ArrowRenderer = ({ expanded }) => (
        <>
            {expanded ? (
                <FaCaretDown className="chevronIcon" />
            ) : (
                <FaCaretDown className="chevronIcon" />
            )}
        </>
    );

    const customValueRenderer = (selected, _options) => {
        return selected?.length == practices?.length
            ? "<< ALL >>"
            : selected?.length === 0
                ? "<< Please Select >>"
                : selected?.map((label) => {
                    return selected?.length >= 1 ? label?.label + "," : label?.label;
                });
    };
    const customValueRendererTwo = (selected, _options) => {
        return selected?.length == serviceOfferings?.length
            ? "<< ALL >>"
            : selected?.length === 0
                ? "<< Please Select >>"
                : selected?.map((label) => {
                    return selected?.length >= 1 ? label?.label + "," : label?.label;
                });
    };

    useEffect(() => {
        displayTableHandlerBody();
        displayTableHandlerHeader();
    }, [goalData]);

    const displayTableHandlerHeader = () => {
        setDisplaySigningTargets1(() => {
            return goalData?.map((data, index) => {
                let tabData = [];
                columnArray?.forEach((inEle, inIndex) => {
                    if (data.id === -1) {
                        tabData.push(
                            <th>
                                {data[inEle] !== undefined && data[inEle].split("^&1")[0]}
                            </th>
                        );
                    }
                });
                return <tr>{tabData}</tr>;
            });
        });
    };
    const displayTableHandlerBody = () => {
        setDisplaySigningTargets(() => {
            return goalData
                ?.filter((d) => d.id != -1)
                .map((data, index) => {
                    console.log(data);
                    const tabData = columnArray?.map((inEle, inIndex) => {
                        if (servicesPayload.viewtype == "plan") {
                            if (data.id == 1 || data.id == 2) {
                                return (
                                    <td key={inIndex}>
                                        {data[inEle] !== undefined && data[inEle].split("^&1")[0]}
                                    </td>
                                );
                            }
                            if (data.id == 4 || data.id == 3) {
                                if (columnArray[inIndex] == "name") {
                                    return (
                                        <td key={inIndex}>
                                            {data[inEle] !== undefined && data[inEle].split("^&1")[0]}
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td key={`${inIndex}_textarea`}>
                                            <MultiSelect
                                                ArrowRenderer={ArrowRenderer}
                                                id="practices"
                                                options={data.id == 3 ? serviceOfferings : practices}
                                                hasSelectAll={true}
                                                value={
                                                    data.id == 3
                                                        ? selectedServiceOfferings
                                                        : selectedPractices
                                                }
                                                disabled={false}
                                                valueRenderer={
                                                    data.id == 3
                                                        ? customValueRendererTwo
                                                        : customValueRenderer
                                                }
                                                onChange={(s) => {
                                                    data.id == 3
                                                        ? setSelectedServiceOfferings(s)
                                                        : setSelectedPractices(s);
                                                }}
                                            />
                                        </td>
                                    );
                                }
                            }
                            console.log(columnArray[inIndex]);
                            if (data.id == 5) {
                                console.log(data[inEle]);
                                if (columnArray[inIndex] == "name") {
                                    return (
                                        <td key={inIndex}>
                                            {data[inEle] !== undefined && data[inEle].split("^&1")[0]}
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td key={`${inIndex}_textarea`}>
                                            <textarea
                                                className="textStyle"
                                                id={data.id + "__" + index + "__" + inEle}
                                                type="text"
                                                style={{ textAlign: "right", fontSize: "12px" }}
                                                onKeyPress={(e) => {
                                                    onKeyPress(e);
                                                }}
                                                defaultValue={data[inEle]}
                                            />
                                        </td>
                                    );
                                }
                            }
                            return null;
                        } else {
                            return (
                                <td key={inIndex}>
                                    {data[inEle] !== undefined && data[inEle].split("^&1")[0]}
                                </td>
                            );
                        }
                    });

                    return <tr key={index}>{tabData}</tr>;
                });
        });
    };

    const editorToolBar = {
        toolbar: [
            [
                { header: [false, 1, 2, 3, 4, 5, 6] },
                // {tooltip:["ee"]},
                // { size: [] },
                { font: [] },
                { color: [] },
                { bold: { tooltip: "Bold (Ctrl+B)" } },
                "italic",
                "underline",
                { list: "ordered", tooltip: "Numbered List" },
                { list: "bullet" },
                { script: "sub" },
                { script: "super" },
                { indent: "-1" },
                { indent: "+1" },
                { align: null },
                { align: "center" },
                { align: "right" },
                "strike",
                "link",
                "code-block",
                "clean",
            ],
        ],
    };

    const handleSaveNote = (saveType) => {
        console.log(rowData, "rowData");
        console.log(servicesPayload, "servicesPayload");
        const createDate = {
            noteTitle: noteTitleValue,
            loggedId: 512,
        };
        const editDate = {
            noteId: "",
            notes: "",
        };
        const cData = {
            type: servicesPayload.viewtype,
            month: servicesPayload.quarter,
            duration: servicesPayload.duration,
            customerId: rowData.id,
            countryId: rowData.countryId,
            isp: 0,
        };
        const postData =
            saveType == "create"
                ? { ...createDate, ...cData }
                : { ...editDate, ...cData };
        if (saveType == "create") {
            console.log(postData, "postData");
            setNoteTitleValue("");

            axios({
                method: "post",
                url: baseUrl + `/customersms//financialPlanandReview/saveAccountNotes`,
                data: postData,
            })
                .then((res) => {
                    console.log(res, "res");
                    let resNote = res.data.status.noteObj;
                    let updatedTempNoteData = [...noteData, resNote];
                    console.log(updatedTempNoteData, "updatedTempNoteData");
                    setNoteData(updatedTempNoteData);
                })
                .catch((error) => { });
        }
    };

    const deleteNote = () => {
        console.log(deleteNoteId, "editableId");
        const deletData = {
            noteId: deleteNoteId,
            type: servicesPayload.viewtype,
            month: servicesPayload.quarter,
            duration: servicesPayload.duration,
            customerId: rowData.id,
            // loggedId: 512,
        };
        console.log(deletData, "deletData");
        axios({
            method: "post",
            url: baseUrl + `/customersms//financialPlanandReview/deleteAccountNotes`,
            data: deletData,
        })
            .then((res) => {
                console.log(res, "res");
            })
            .catch((error) => { });
    };

    function DeletePopup(props) {
        const { deletePopup, setDeletePopup } = props;
        return (
            <div>
                <CModal
                    visible={deletePopup}
                    size="xs"
                    className="ui-dialog"
                    onClose={() => setDeletePopup(false)}
                >
                    <CModalHeader className="">
                        <CModalTitle>
                            <span className="">Delete Confirmation</span>
                        </CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <h6>Are you sure you want to delete Issue ?</h6>
                        <div className="btn-container center my-2">
                            <button
                                type="delete"
                                className="btn btn-primary"
                                onClick={() => {
                                    deleteNote();
                                }}
                            >
                                <AiFillDelete /> Delete{" "}
                            </button>{" "}
                            &nbsp; &nbsp;
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setDeletePopup(false);
                                }}
                            >
                                {" "}
                                <ImCross /> Cancel{" "}
                            </button>
                        </div>
                    </CModalBody>
                </CModal>
            </div>
        );
    }

    function NotePopover(props) {
        return <div>sahid</div>;
    }
    console.log(editableId, "editableId");

    const addTooltipToBoldButton = () => {
        // Get the existing bold button
        const boldButton = document.querySelector(".ql-bold");

        // Check if the bold button exists
        console.log(boldButton, "boldButton");
        if (boldButton) {
            // Create a tooltip element
            const tooltip = document.createElement("div");
            tooltip.innerHTML = "Bold Text"; // Customize the tooltip content
            tooltip.className = "custom-tooltip"; // Add a custom class for styling

            // Append the tooltip to the bold button

            // Show/hide the tooltip on mouseover/mouseout
            boldButton.addEventListener("mouseover", () => {
                boldButton.appendChild(tooltip);
                tooltip.style.display = "block";
            });

            boldButton.addEventListener("mouseout", () => {
                tooltip.style.display = "none";
            });
        }
    };

    useEffect(() => {
        // Call the function to add the tooltip to the bold button
        if (btnState == "Notes") {
            setEditMode(false);
            setNoteTitleValue("");
            // addTooltipToBoldButton();
        }
    }, [btnState]);

    return (
        <div>
            <CModal
                visible={goalsPopup}
                size="lg"
                className="ui-dialog"
                onClose={() => setGoalsPopup(false)}
                backdrop={"static"}
            >
                <CModalHeader className="">
                    <CModalTitle>
                        <span className="">Goals of </span>
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="tabs">
                        <button
                            className={
                                btnState == "Goals" ? "buttonDisplayClick" : "buttonDisplay"
                            }
                            onClick={() => {
                                setbtnState("Goals");
                            }}
                        >
                            Goals
                        </button>
                        <button
                            className={
                                btnState === "Notes" ? "buttonDisplayClick" : "buttonDisplay"
                            }
                            onClick={() => {
                                setbtnState("Notes");
                            }}
                        >
                            Notes
                        </button>
                    </div>
                    {btnState == "Goals" && goalData ? (
                        <div>
                            <div className=" darkHeader toHead">
                                <table
                                    className="table table-bordered htmlTable"
                                    cellPadding={0}
                                    cellSpacing={0}
                                >
                                    <thead>{displaySigningTargets1}</thead>
                                    <tbody>{displaySigningTargets}</tbody>
                                </table>
                            </div>

                            <div
                                className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn-container center "
                                style={{ gap: "7px" }}
                            >
                                <button
                                    className="btn btn-primary"
                                    name="save"
                                    id="save"
                                    type="save"
                                //  onClick={handleSave}
                                >
                                    <FaSave />
                                    Save
                                </button>
                                <button
                                    className="btn btn-primary"
                                    id="cancel"
                                    type="reset"
                                //  onClick={handleCancel}
                                >
                                    <BiReset title="Reset" />
                                    Reset
                                </button>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                    {btnState == "Notes" ? (
                        <div>
                            <div>
                                <div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Notes title goes here"
                                            value={noteTitleValue}
                                            onChange={(e) => {
                                                setNoteTitleValue(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={() => {
                                            noteTitleValue != ""
                                                ? handleSaveNote("create")
                                                : console.log("please enter value");
                                        }}
                                    >
                                        <FaPlus></FaPlus>
                                        Add
                                    </button>
                                </div>
                                <div>
                                    <ul>
                                        {noteData.map((item) => (
                                            <li
                                                key={item.id}
                                                className="popover"
                                                onMouseEnter={(e) => {
                                                    setShowPopover((prev) => !prev);
                                                    setEditableId(item.id);
                                                }}
                                                onMouseLeave={(e) => {
                                                    setShowPopover((prev) => !prev);
                                                    setEditableId("");
                                                }}
                                            >
                                                <span>
                                                    <div className="legendContainer">
                                                        <div className="legend blue">
                                                            <div className="legendCircle"></div>
                                                            {editMode && item.id == editableId ? (
                                                                <span>
                                                                    <input
                                                                        type="text"
                                                                        defaultValue={item.noteTitle}
                                                                    />
                                                                </span>
                                                            ) : (
                                                                <span className="legendTxt ">
                                                                    {item.noteTitle}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </span>
                                                <span>
                                                    {editMode && item.id == editableId ? (
                                                        <>
                                                            <RiSave3Line
                                                                onClick={(e) => {
                                                                    setEditMode((prev) => !prev);
                                                                }}
                                                            />
                                                            <FcCancel
                                                                onClick={() => {
                                                                    setEditMode((prev) => !prev);
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaPencilAlt
                                                                onClick={(e) => {
                                                                    setEditableId(item.id);
                                                                    setEditMode((prev) => !prev);
                                                                }}
                                                            />
                                                            <RiDeleteBinFill
                                                                onClick={(e) => {
                                                                    setDeletePopup(true);
                                                                    setDeleteNoteId(item.id);
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </span>
                                                {showPopover && item.id == editableId ? (
                                                    <NotePopover />
                                                ) : (
                                                    ""
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    {deletePopup ? (
                                        <DeletePopup
                                            deletePopup={deletePopup}
                                            setDeletePopup={setDeletePopup}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>

                            <div>
                                <ReactQuill
                                    className=""
                                    theme="snow"
                                    // value={value}
                                    name="description"
                                    id="editor-container"
                                    // onChange={(e) => {
                                    //   setValue(e);
                                    //   setFormData((prev) => ({
                                    //     ...prev,
                                    //     ["description"]: value,
                                    //   }));
                                    // }}
                                    modules={editorToolBar}
                                />
                                <div></div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}
                </CModalBody>
            </CModal>
        </div>
    );
}

export default FPRGoalsandNotes;
