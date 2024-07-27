import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
function ResourceEntryReport() {
  const [startDate, setStartDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Resource Entry Report</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader">
          <h2>Search Filters</h2>

          <div
            onClick={() => {
              setVisible(!visible);

              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            <span>{cheveronIcon}</span>
          </div>
        </div>
        {/* <h2>Resource Entry Report</h2> */}
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-4 mb-2 row">
              <label className="col-3" htmlFor="selectPicker">
                Select Picker
              </label>
              <div className="form-check form-check-inline col-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="choice"
                  id="yes"
                />
                <label className="form-check-label" htmlFor="yes">
                  Yes
                </label>
              </div>
              <div className="form-check form-check-inline col-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="choice"
                  id="no"
                />
                <label className="form-check-label" htmlFor="no">
                  No
                </label>
              </div>
            </div>
            <div className="col-md-3 mb-2 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="fromDate">
                  From Date
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="toDate">
                  To Date
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="department">
                  Deprtment
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="roles"
                    options={[]}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    //   valueRenderer={customValueRenderer}

                    //   value={selectedRoleTypes}

                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customer">
                  Customer
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="roles"
                    options={[]}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    //   valueRenderer={customValueRenderer}

                    //   value={selectedRoleTypes}

                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="project">
                  Project
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="roles"
                    options={[]}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    //   valueRenderer={customValueRenderer}

                    //   value={selectedRoleTypes}

                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button className="btn btn-primary ">Search</button>
            </div>
          </div>
        </CCollapse>
      </div>
    </div>
  );
}

export default ResourceEntryReport;
