import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

function RiskAutoComplete(props) {
  const {
    riskDetails,
    getData,
    setFormData,
    editedData,
    formEditData,
    onChangeHandler,
    refArr,
    setUsername,
    name,
    id,
    value,
    onClear,
    inputSearchString,
  } = props;
  const [item, setItem] = useState([]);

  useEffect(() => {}, [item]);

  const handleClear = (edit) => {
    setFormData((prevProps) => ({ ...prevProps, [name]: "" }));
  };
  useEffect(() => {}, [riskDetails]);
  {
    return (
      <>
        <div className="autoComplete-container">
          {value == "UpdateBillingRate" ? (
            <ReactSearchAutocomplete
              items={riskDetails}
              type="Text"
              name={name}
              inputSearchString={formEditData?.assigned_to}
              id={id}
              className="err"
              riskDetails={riskDetails}
              getData={getData}
              onClear={onClear}
              placeholder="Type minimum 3 characters"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              // setSelectEmployee={setSelectEmployee}
              onSelect={(e) => {
                setFormData((prevProps) => ({ ...prevProps, [name]: e.id }));
              }}
              showIcon={false}
            />
          ) : value == "EngagementS" ? (
            <ReactSearchAutocomplete
              items={riskDetails}
              type="Text"
              name={name}
              inputSearchString={formEditData?.assigned_to}
              id={id}
              className="err"
              riskDetails={riskDetails}
              getData={getData}
              onClear={handleClear}
              placeholder="Type minimum 3 characters"
              onChange={(e) => {
                onChangeHandler(e);
              }}
              // setSelectEmployee={setSelectEmployee}
              onSelect={(e) => {
                setFormData((prevProps) => ({ ...prevProps, [name]: e.id }));
              }}
              showIcon={false}
              showNoResults={true}
              showNoResultsText="<<ALL>>"
            />
          ) : (
            <div
              className="auto autocomplete"
              id="auto"
              ref={(ele) => {
                if (refArr != undefined) {
                  refArr.current[0] = ele;
                }
              }}
            >
              <ReactSearchAutocomplete
                items={riskDetails}
                type="Text"
                name={name}
                placeholder="Type minimum 3 characters"
                inputSearchString={inputSearchString}
                id={id}
                className="err"
                onClear={onClear}
                riskDetails={riskDetails}
                getData={getData}
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                // setSelectEmployee={setSelectEmployee}
                onSelect={(e) => {
                  setFormData((prevProps) => ({ ...prevProps, [name]: e.id }));
                  console.log("e-param>", e);
                  setUsername(e.name);
                }}
                showIcon={false}
              />
            </div>
          )}
        </div>
        <span>{item.name}</span>
      </>
    );
  }
}
export default RiskAutoComplete;
