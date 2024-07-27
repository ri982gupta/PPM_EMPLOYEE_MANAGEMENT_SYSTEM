import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'


/// autocomplete for assigned to field
function AutoComplete(props) {
    const { issueDetails, getData, setFormData } = props;
    const [item, setItem] = useState([]);
    const inputRef = useRef(null);
    useEffect(() => {
        console.log(item);
    }, [item])

    const handleClear = () => {
        setFormData(prev => ({ ...prev, "assignedto": null }))
    }
    

    useEffect(() => { }, [issueDetails])
    {
        return (
            <>
                <div className="autoComplete-container ">
                        <span className="auto" id="auto">
                                <ReactSearchAutocomplete
                                    items={issueDetails}
                                    type="Text"
                                    ref={inputRef}
                                    name="assignedto"
                                    id="assignedto"
                                    issueDetails={issueDetails}
                                    getData={getData}
                                    className="AutoComplete"
                                    // onSearch={handleSearch}
                                    // setSelectEmployee={setSelectEmployee} 
                                    // onFocus={handleFocus}
                                    onSelect={(e) => { setFormData((prevProps) => ({ ...prevProps, "assignedto": e.id })); console.log(e) }}
                                    onClear={handleClear}
                                    showIcon={false}
                                />
                        </span>
                </div>
                <span >{item.name}</span>
            </>
        )
    }
}
export default AutoComplete;

