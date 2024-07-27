import React, { useEffect } from "react";
import { AiOutlinePlusSquare, AiOutlineSave } from "react-icons/ai";
import { VscCircleSlash } from "react-icons/vsc";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ProjectEvents() {
    const [displayTable, setDisplayTable] = useState(null)
    const [editedValue, setEditedValue] = useState(-1)
    const [displayRowEdit, setDisplayRowEdit] = useState(false);

    const addRowFnc = () => {
        setDisplayRowEdit(true);
    }

    const closeEditedRowFnc = () => {
        setDisplayRowEdit(prev => false);
        setEditedValue(-1);
    }

    const editHandler = (element, index) => {
        console.log(element)
        setEditedValue(index);
    }

    const onChangeRowEdit = (e) => {
        const { id, value } = e.target;
        setState((prevProps) => ({ ...prevProps, [id]: value }));
    }

    useEffect(() => {
        displayTableFnc();
    }, [])

    useEffect(() => {
        displayTableFnc();
    }, [displayRowEdit])
    let tabHeaders = [
        "Event",
        "Date",
        "Comments"
    ]
    const displayTableFnc = () => {

        setDisplayTable(() => {
            let data = roleGridCostData;
            let fData = [];
            if (displayRowEdit) {
                fData = [{ ...tabHeaders }, ...data];
            } else {
                fData = roleGridCostData;
            }

            return fData.length === 0 ? <tr>
                <td colSpan={17} align="center" >No Records Found</td>
            </tr> : fData.map((element, index) => {
                let tabData = [];
                if ((displayRowEdit && index === 0) || (editedValue !== -1 && editedValue === index)) {
                    if (editedValue !== -1) {
                        Object.assign(initialValue, element);
                    }
                    tabHeaders.forEach((inEle, inInd) => {
                        if (inEle === "action") {
                            tabData.push(<td><AiFillSave title={"Save"} className='pointerCursor' onClick={(e) => { validateValues() }} /><AiFillCloseCircle title={"Cancel"} className='pointerCursor' onClick={(e) => { closeEditedRowFnc() }} /></td>)
                        } else if (inEle == "Date") {
                            tabData.push(<td ><DatePicker input id={inEle} onChange={(e) => { onChangeRowEdit(e); }} type="text" /></td>);
                        } else {
                            tabData.push(<td id={inEle}>{element[inEle]}</td>);
                        }
                    })
                } else {
                    tabHeaders.forEach((inEle, inInd) => {
                        if (inEle == "action") {
                            tabData.push(<td>
                                <div align="center">
                                    <span>
                                        <AiFillEdit title={"Edit"} className='pointerCursor' onClick={(e) => { editHandler(element, index) }} />
                                    </span>
                                    <span>
                                        <AiFillDelete title={"Delete"} className='pointerCursor' onClick={(e) => { roleGridCostDeleteHandler(element) }} />
                                    </span>
                                </div></td>)
                        } else if (inEle == "Date") {
                            tabData.push(<td >{element[inEle] == "" ? null : moment(element[inEle]).format('yyyy-MMM-DD')}</td>);
                        } else {
                            tabData.push(<td>{element[inEle]}</td>);
                        }
                    })
                }
                return <tr key={index} >{tabData}</tr>
            })
        })

    }

    return (
        <div className="customCard">
            <div className="table">
                <table className='table table-bordered table-striped'>
                    <tbody>
                        <tr>
                            <th className="pointerCursor" onClick={() => sorting("Event")}>Event</th>
                            <th className="pointerCursor" onClick={() => sorting("Date")}>Date</th>
                            <th className="pointerCursor" onClick={() => sorting("Comments")}>Comments</th>
                        </tr>
                        {displayTable}
                    </tbody>
                </table>
                <td className='col-md-4' style={{ height: "27px", width: "40%" }}>
                    <AiOutlinePlusSquare size={'1.4em'} style={{ height: "20px" }} title={"Add new row"} onClick={(e) => { addRowFnc() }}  ></AiOutlinePlusSquare >&nbsp;
                    <AiOutlineSave size={'1.4em'} style={{ height: "20px" }} title={"save"}  ></AiOutlineSave>&nbsp;
                    <VscCircleSlash size={'1.4em'} style={{ height: "20px" }} title={"Cancel row editing"} onClick={(e) => { closeEditedRowFnc() }}  ></VscCircleSlash>
                </td>
            </div>
        </div>
    )
}
export default ProjectEvents;