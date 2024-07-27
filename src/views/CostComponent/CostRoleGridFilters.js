import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";

function CostRoleGridFilters(props) {
  const {
    countries,
    practices,
    cadres,
    setAddRoleGrid,
    addRoleGrid,
    addRoleGridData,
    formData,
    setFormData,
    onChangeFilters,
    filtersClickHandler,
  } = props;

  return (
    <>
      <div class="group-content row">
        <div class="col-md-3 mb-2">
          <div class="form-group row">
            <label class="col-5" for="BuIds">
              Practice <span style={{ color: "red" }}>{"*"}</span>
            </label>
            <span class="col-1 p-0">:</span>
            <div class="col-6">
              {" "}
              <select id="practice" onChange={(e) => onChangeFilters(e)}>
                <option key="" value="">
                  {"<<Please Select>>"}
                </option>
                {practices.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.groupName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-2">
          <div class="form-group row">
            <label class="col-5" for="BuIds">
              Country <span style={{ color: "red" }}>{"*"}</span>
            </label>
            <span class="col-1 p-0">:</span>
            <div class="col-6">
              <select id="country" onChange={(e) => onChangeFilters(e)}>
                <option key="" value="">
                  {"<<Please Select>>"}
                </option>
                {countries.map((data) => (
                  <option key={data.id} value={data.id}>
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
              Cadre <span style={{ color: "red" }}>{"*"}</span>
            </label>
            <span class="col-1 p-0">:</span>
            <div class="col-6">
              {" "}
              <select id="cadre" onChange={(e) => onChangeFilters(e)}>
                <option key="" value="">
                  {"<<Please Select>>"}
                </option>
                {cadres.map((data) => (
                  <option key={data.id} value={data.cadre_code}>
                    {data.cadre_code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div class="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
          <button
            type="submit"
            class="btn btn-primary"
            title="Search"
            onClick={() => {
              filtersClickHandler();
            }}
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
}

export default CostRoleGridFilters;
