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
    name,
    id,
    value,
  } = props;

  const [item, setItem] = useState([]);

  useEffect(() => {}, [item]);
  useEffect(() => {}, [riskDetails]);

  const loggedUserName = localStorage.getItem("resName");
  const loggedUserId = localStorage.getItem("resId");

  {
    return (
      <>
        <div className="autoComplete-container">
          {value == "UpdateBillingRate" ? (
            <ReactSearchAutocomplete
              items={riskDetails}
              type="Text"
              autocom
              name={name}
              inputSearchString={loggedUserName}
              id={id}
              className="err"
              riskDetails={riskDetails}
              getData={getData}
              // placeholder={loggedUserName}
              onChange={(e) => {
                onChangeHandler(e);
              }}
              // setSelectEmployee={setSelectEmployee}
              onSelect={(e) => {
                setFormData((prevProps) => ({ ...prevProps, [name]: e.id }));
              }}
              showIcon={false}
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
                autocomplete="off"
                inputSearchString={loggedUserName}
                id={id}
                className="err"
                riskDetails={riskDetails}
                getData={getData}
                onChange={(e) => {
                  onChangeHandler(e);
                }}
                // setSelectEmployee={setSelectEmployee}
                onSelect={(e) => {
                  setFormData((prevProps) => ({ ...prevProps, [name]: e.id }));
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
