import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
function VendorPerformance() {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Subk GM Analysis</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="group mb-3 customCard">
        <h2>Search Filters</h2>
        <div className="group-content row">
          <div className=" col-md-3 mb-2">
            <div className="form-group row">
              <label className="col-5" htmlFor="month">
                Month
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                />
              </div>
            </div>
          </div>
          <div className=" col-md-3 mb-2">
            <div className="form-group row">
              <label className="col-5" htmlFor="duration">
                Duration
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                <select id="duration">
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="MEX">Mexico</option>
                </select>
              </div>
            </div>
          </div>
          <div className=" col-md-3 mb-2">
            <div className="form-group row">
              <label className="col-5" htmlFor="country-select">
                Country
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                <MultiSelect
                  id="customerstatus"
                  options={[]}
                  hasSelectAll={true}
                  isLoading={false}
                  shouldToggleOnHover={false}
                  disableSearch={false}
                  disabled={false}
                />
              </div>
            </div>
          </div>
          <div className=" col-md-3 mb-2">
            <div className="form-group row">
              <label className="col-5" htmlFor="viewby">
                View By
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                <select id="viewby">
                  <option value="USA">United States</option>
                  <option value="CAN">Canada</option>
                  <option value="MEX">Mexico</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
        <button type="submit" className="btn btn-primary">
          Search{" "}
        </button>
      </div>
    </div>
  );
}

export default VendorPerformance;
