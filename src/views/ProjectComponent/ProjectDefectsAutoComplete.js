import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete"

function AutoComplete(props) {
    const { assigneTo, state, reportedBy, handleAssigneToChange, setAssign, manager, setManager, handleManager } = props;
    const [item, setItem] = useState([])
    console.log(assigneTo)
    useEffect(() => {
    }, [item,assigneTo])
    useEffect(() => { }, [assigneTo])
    useEffect(() => { }, [reportedBy])
    useEffect(() => { }, [manager])

    return (
        <>
            <div >
                {
                    state == 'defect' ?
                        <ReactSearchAutocomplete
                            items={assigneTo}
                            type="Text"
                            name="assigned_to"
                            id="assigned_to"
                            className="err"
                            assigneTo={assigneTo}
                            handleAssigneToChange={handleAssigneToChange}
                            fuseOptions={{ keys: ["id", "ResName"] }}
                            resultStringKeyName="ResName"
                            onSelect={(e) => { setAssign((prevProps) => ({ ...prevProps, "assigned_to": e.id })); }}
                            showIcon={false}
                        /> :
                        <ReactSearchAutocomplete
                            items={manager}
                            type="Text"
                            name="manager"
                            id="manager"
                            className="err"
                            fuseOptions={{ keys: ["id", "ResName"] }}
                            resultStringKeyName="ResName"
                            manager={manager}
                            handleManager={handleManager}
                            onSelect={(e) => { setManager((prevProps) => ({ ...prevProps, "manager": e.id })); }}
                            showIcon={false}
                        />
                }



            </div>
            <span >{item.name}</span>
        </>
    )
}

export default AutoComplete;