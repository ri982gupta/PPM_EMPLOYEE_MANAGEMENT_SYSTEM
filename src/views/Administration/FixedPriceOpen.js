import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

function FixedPriceOpen() {
  return (
    <div>
      <div className="group mb-3 customCard">
        <h2>Fixed Price - Open</h2>
        <div className="group-content row">
          <div className=" col-md-4 mb-2">
            <div className="form-group row">
              <label className="col-5" htmlFor="Customers">
                Customers
              </label>
              <span className="col-1 p-0 p-0">:</span>
              <div className="col-6">
                <select id="Customers">
                  <option value="">Monthly</option>
                  <option value="">Weekly</option>
                </select>
              </div>
            </div>
          </div>
          <div className=" col-md-4 mb-2">
            <div className="form-group row">
              <label className="col-5" htmlFor="Billing Cycle">
                Billing Cycle<span className="required">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                <select id="Billing Cycle">
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                </select>
              </div>
            </div>
          </div>
          <div className=" col-md-4 mb-2">
            <div className="form-group row">
              <label className="col-5" htmlFor="Month">
                Month<span className="required">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                <DatePicker
                  id="month"
                  dateFormat="MMM-yyyy"
                  showMonthYearPicker
                />
              </div>
            </div>
          </div>{" "}
          <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
            <button type="submit" className="btn btn-primary">
              Search{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FixedPriceOpen;
