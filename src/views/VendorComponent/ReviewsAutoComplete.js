import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function AutoComplete(props) {
  const { employeesDetails, setState, autoCompleteValidation } = props;
  const [item, setItem] = useState([]);

  const handleClear = () => {
    setState((prevProps) => ({ ...prevProps, reviewedBy: "" }));
  };
  useEffect(() => {}, [item]);
  useEffect(() => {}, [employeesDetails]);
  {
    return (
      <>
        <div className="autoComplete-container">
          <ReactSearchAutocomplete
            items={employeesDetails}
            type="Text"
            name="reviewedBy"
            id="reviewedBy"
            className="error AutoComplete"
            employeesDetails={employeesDetails}
            onSelect={(e) => {
              setState((prevProps) => ({ ...prevProps, reviewedBy: e.id }));
            }}
            showIcon={false}
            onClear={handleClear}
            placeholder="Enter Resource Name"
          />
        </div>
        <span>{item.name}</span>
      </>
    );
  }
}
export default AutoComplete;
