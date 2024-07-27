import React, { useState, useEffect } from "react";
import ResourceHierarchy from "../ResourceProfile/ResourceHierarchy.js";
import { InputText } from "primereact/inputtext";

import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

function ConstCenters() {
  return (
    <div>
      <div className="group mb-5 customCard">
        <div className="group-content row mb-2">
          <div className="col-md-4 mb-2">
            <div className="form-group row">
            <div className="col-5">
              <button type="button" className="btn btn-primary" title="Search">
                New Cost Center{" "}
              </button>
            </div>
            <div className="col-5">
              <button type="button" className="btn btn-primary" title="Search">
                Edit Cost Center{" "}
              </button>
            </div>
            </div>
           
          </div>
          <div className="col-md-4">
         
          </div>
          <div className="col-md-4"></div>

          <div className="col-md-4 mb-2">
            <div className="form-group row">
              <label className="col-4" htmlFor="name">
                Search
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-7">
                <InputText
                  id="companyName"
                  // value={inputData.companyName}
                  // onChange={(e) => onInputChange(e, "companyName")}
                  type="text"
                  className="form-control"
                  placeholder="Enter Company name"
                  required
                />
              </div>
            </div>
          </div>
          <div className="col-8"></div>
          <div className="col-1"></div>

          <div className="col-md-4 mb-2">
            <ResourceHierarchy />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConstCenters;
