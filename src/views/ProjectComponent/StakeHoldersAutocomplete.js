import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'


function AutoComplete(props) {
    const { userDetails, setState, onChange } = props;
    const [item, setItem] = useState([]);

    const onChangeRowEdit = (e) => {
        const { id, value } = e.target;
        setState((prevProps) => ({ ...prevProps, [id]: value }));
    };
    const formatResult = (item) => {
        return (
          <div className="result-wrapper">
            <span className="result-span">{item.ResName} (<span>{item.employeeNumber}</span>)</span>
          </div>
        );
      };

    useEffect(() => {
    }, [item])
    useEffect(() => { }, [userDetails])
  
    {
        return (
            <>
                <div className="Auto col-md-12">
                    <header className="Auto-header">
                        <div style={{ borderradius: "0px" }} >
                            <ReactSearchAutocomplete
                                items={userDetails}
                                type="Text"
                                name="User"
                                id="User"
                                userDetails={userDetails}
                                fuseOptions={{ keys: ["id", "ResName","employeeNumber"] }}
                                onSelect={(e) => { setState((prevProps) => ({ ...prevProps, "User": e.id })); }}
                                resultStringKeyName={"ResName"}
                                onChange={(e) => { onChangeRowEdit(e); }}
                                formatResult={formatResult}
                                showIcon={false}
                                showClear={false}
                                styling={{
                                    height: "23px",
                                    width: "100%",
                                    border: "1px solid ",
                                    borderRadius: "4px",
                                    backgroundColor: "white",
                                    boxShadow: "none",
                                    hoverBackgroundColor: "e4e4e4",
                                    color: "e4e4e4",
                                    fontSize: "12px",
                                    fontFamily: "'Roboto',sans-serif",
                                    placeholderColor: "white",
                                    clearIconMargin: "3px 8px 0 0",
                                    zIndex: 2,
                                }}
                            />
                        </div>
                    </header>
                </div>
                <span style={{ display: 'block', textAlign: 'left' }}>{item.id}</span>
                <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
                </>
        )
    }
}
export default AutoComplete;