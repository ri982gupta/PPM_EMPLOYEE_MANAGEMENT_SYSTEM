import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MultiSelect } from "react-multi-select-component";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";

function LoginHistoryFilters(props) {
  const { formData, setFormData, screenFilters, searchHandler, validator } =
    props;

  const [selectedScreens, setSelectedScreens] = useState(screenFilters);

  const [warnMsg, setWarnMsg] = useState("");

  const ref = useRef([]);

  useEffect(() => {
    setSelectedScreens(screenFilters);
  }, [screenFilters]);

  const customValueRenderer = (selected, _options) => {
    return selected.length === selectedScreens.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };

  const preSearchHandler = () => {
    let valid = GlobalValidation(ref);

    if (valid) {
      setWarnMsg(
        <div className="statusMsg error">
          <AiFillWarning />
          <span>Please Select Mandatory Fields.</span>
        </div>
      );
      return;
    }

    setWarnMsg("");

    searchHandler();
  };

  return (
    <div className="col-md-12 customCard">
      {/* {validator ? (
        <div className="errMsg">
          <span>Please Select Mandatory Fields.</span>
        </div>
      ) : (
        ""
      )} */}
      {warnMsg}
      {/* <div class="row g-3 align-items-center col-md-12 "> */}

      <div class="group-content row">
        <div class="col-md-3 mb-2">
          <div class="form-group row">
            <label class="col-5" for="BuIds">
              Screens <span style={{ color: "red" }}>*</span>
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
                id="screenNames"
                options={screenFilters}
                className={``}
                hasSelectAll={true}
                valueRenderer={customValueRenderer}
                value={formData.screen}
                disabled={false}
                onChange={(e) => {
                  setSelectedScreens(e);
                  // setSelectedCountry(e)
                  // let filteredCountry = [];
                  // e.forEach(d => {
                  //   filteredCountry.push(d.value);
                  // })
                  setFormData((prevVal) => ({ ...prevVal, ["screen"]: e }));
                }}
                labelledBy={"countries"}
              />
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-2">
          <div class="form-group row">
            <label class="col-5" for="BuIds">
              From Date
            </label>
            <span class="col-1 p-0">:</span>
            <div class="col-6">
              {" "}
              <DatePicker
                dateFormat="dd-MMM-yyyy"
                //maxDate={new Date()}
                // minDate={startDate}
                selected={formData.fromDate}
                maxDate={formData.toDate}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onKeyPress={(e) => {
                  e.preventDefault();
                }}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, ["fromDate"]: value }));
                }}
              />
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-2">
          <div class="form-group row">
            <label class="col-5" for="BuIds">
              To Date
            </label>
            <span class="col-1 p-0">:</span>
            <div class="col-6">
              <DatePicker
                dateFormat="dd-MMM-yyyy"
                //maxDate={new Date()}
                // minDate={startDate}
                selected={formData.toDate}
                maxDate={formData.toDate}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, ["toDate"]: value }));
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
              preSearchHandler();
            }}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginHistoryFilters;
