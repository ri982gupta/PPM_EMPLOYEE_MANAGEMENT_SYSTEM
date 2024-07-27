import React, { useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import ComputedCostRoleView from "./ComputedCostRoleView";
import { AiFillWarning } from "react-icons/ai";

function CostApprovalFilters(props) {
  const {
    country,
    departments,
    selectedDepartments,
    setSelectedDepartments,
    roleTypes,
    selectedRoleTypes,
    setSelectedRoleTypes,
    costApprovalButtonHandler,
    formData,
    setFormData,
    type,
    roleWiseViewAxios,
    roleWiseViewState,
    columnData,
    validator,
  } = props;

  const [warnMsg, setWarnMsg] = useState("");

  const ref = useRef([]);

  const ref1 = useRef([]);

  const FilterChangeHandler = (e) => {
    const { id, value } = e.target;
    setFormData((prevVal) => ({ ...prevVal, [id]: value }));
  };

  useEffect(() => {}, [formData]);

  useEffect(() => {}, [selectedDepartments]);

  const roleWiseView = () => {
    let refLc = ref.current.filter((d) => d != undefined);

    ref1.current = refLc;

    let valid = GlobalValidation(ref1);

    if (valid) {
      // validator;
      setWarnMsg(
        <div className="col-md-12 statusMsg error">
          <AiFillWarning />
          <span>Please Select Mandatory Fields</span>
        </div>
      );
      return;
    }

    setWarnMsg("");

    roleWiseViewAxios();
  };

  const preCostApprovalButtonHandler = () => {
    let refLc = ref.current.filter((d) => d != undefined);

    ref1.current = refLc;

    let valid = GlobalValidation(ref1);

    if (valid) {
      setWarnMsg(
        <div className="col-md-12 statusMsg error">
          <AiFillWarning />
          <span>Please Select Mandatory Fields</span>
        </div>
      );
      return;
    }

    setWarnMsg("");

    costApprovalButtonHandler();
  };

  const customValueRenderer = (selected, _options) => {
    return selected.length === departments.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };

  return (
    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 customCard">
      {/* {validator ? (
        <div className="col-md-12 statusMsg error">
          <span>Please Select Mandatory Fields</span>
        </div>
      ) : (
        ""
      )} */}

      {warnMsg}

      <div class="group-content row">
        {type !== "roleWiseView" ? (
          <div class="col-md-3 mb-2">
            <div class="form-group row">
              <label class="col-5" for="BuIds">
                Role Types<span style={{ color: "red" }}>*</span>
              </label>
              <span class="col-1 p-0">:</span>
              <div
                class="col-6 multiselect"
                ref={(ele) => {
                  ref.current[0] = ele;
                }}
              >
                {" "}
                <MultiSelect
                  id="roleTypes"
                  options={roleTypes}
                  hasSelectAll={true}
                  isLoading={false}
                  shouldToggleOnHover={false}
                  disableSearch={false}
                  valueRenderer={customValueRenderer}
                  value={selectedRoleTypes}
                  disabled={false}
                  onChange={(s) => {
                    setSelectedRoleTypes(s);
                    let filteredValues = [];
                    s.forEach((d) => {
                      filteredValues.push(d.value);
                    });

                    setFormData((prevVal) => ({
                      ...prevVal,
                      ["roleType"]: filteredValues.toString(),
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div class="col-md-3 mb-2">
          <div class="form-group row">
            <label class="col-5" for="BuIds">
              Country <span style={{ color: "red" }}>*</span>
            </label>
            <span class="col-1 p-0">:</span>
            <div class="col-6">
              {" "}
              <select
                id="country"
                onChange={(e) => FilterChangeHandler(e)}
                style={{ width: "100%" }}
              >
                {country.map((data) => (
                  <option
                    key={data.id}
                    value={data.id}
                    selected={data.country_name == "India" ? true : false}
                  >
                    {data.country_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-2">
          <div class="form-group row">
            <label class="col-5" for="BuIds">
              Business Unit <span style={{ color: "red" }}>*</span>
            </label>
            <span class="col-1 p-0">:</span>
            <div
              class="col-6 multiselect"
              ref={(ele) => {
                ref.current[1] = ele;
              }}
            >
              <MultiSelect
                id="businessUnit"
                options={departments}
                hasSelectAll={true}
                isLoading={false}
                shouldToggleOnHover={false}
                disableSearch={false}
                valueRenderer={customValueRenderer}
                value={selectedDepartments}
                disabled={false}
                onChange={(s) => {
                  setSelectedDepartments(s);
                  let filteredValues = [];
                  s.forEach((d) => {
                    filteredValues.push(d.value);
                  });

                  setFormData((prevVal) => ({
                    ...prevVal,
                    ["departments"]: filteredValues.toString(),
                  }));
                }}
              />
            </div>
          </div>
        </div>

        <div class="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
          <button
            type="submit"
            class="btn btn-primary"
            title="Search"
            onClick={() => {
              type === "roleWiseView"
                ? roleWiseView()
                : preCostApprovalButtonHandler();
            }}
          >
            Search
          </button>
        </div>
      </div>

      {type === "roleWiseView" && columnData.length > 0 && (
        <ComputedCostRoleView
          roleWiseViewState={roleWiseViewState}
          columnData={columnData}
        />
      )}
    </div>
  );
}

export default CostApprovalFilters;
