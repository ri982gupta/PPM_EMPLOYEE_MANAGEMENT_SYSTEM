import React, { useState, useEffect } from "react";
import ResourceHierarchy from "../ResourceProfile/ResourceHierarchy.js";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

function ResourceCostCenter() {
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [displayOnClick, setDisplayOnClick] = useState();
 

  const renderFooter = (rowData) => {
    return (
      <div>
        <Button label="Ok"></Button>

        {/* <Button label="Save" onClick={() => saveLabel(rowData)}></Button> */}
        {/* <Button label="Save"  ></Button> */}
      </div>
    );
  };

  const onButtonClick = () => {
    setDisplayOnClick(true);
  };
  return (
    <>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Profile</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="group mb-5 customCard">
        <div className="group-content row">
          <div className="col-md-3">
            <h2>Resources</h2>
            <ResourceHierarchy />
          </div>
          <div className="col-md-9">
            <div className="group mb-5 customCard">
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
              <CCollapse visible={!visible}>
                <div className="group-content row">
                  <div className="col-md-8 mb-2">
                    <div className="form-group row">
                      <label className="col-3" htmlFor="text-input-inline">
                        Resource Name
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <span className="col-1">:</span>
                      {/* <label className="col-2" htmlFor="text-input-inline">
                        Search:
                      </label> */}
                      <div className="col-8">
                        <input
                          className="searchbar"
                          type="search"
                          onChange={(e) => handleSearchData(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 no-padding center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      title="Search"
                    >
                      <FaSearch /> Search{" "}
                    </button>
                  </div>
                </div>
              </CCollapse>
            </div>

            <div className="group mb-5 customCard">
              <h2>Resource Details</h2>
              <div className="group-content row">
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Resource Name
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        Bala Siddeswar Peddi
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Designation
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        Associate Lead(L1)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Employment Type
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        Employed-Full Time
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Gender
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        Male
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Email ID
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        Bala.peddi@prolifics.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Citizenship
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        INDIAN
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Business Unit
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        Finance
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Supervisor
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        Amit Mehta
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Gross Capacity
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        8.00 hrs/day
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Joining Date
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        11-Jan-2010
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      End Date
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        NA
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Employee Status
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <p className="col-7" id="text-input-inline">
                        Active
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-4" htmlFor="text-input-inline">
                      Cost Center
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-7">
                      <button
                        type="button"
                        className="btn btn-light"
                        title="Search"
                        onClick={onButtonClick}
                      >
                        <FaPlus /> Select Cost Center{" "}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <Dialog
                    header="Cost Center Directory"
                    visible={displayOnClick}
                    onHide={() => {
                      setDisplayOnClick(false);
                    }}
                    style={{
                      width: "50vw",
                      backgroundColor: "transparent",
                    }}
                    overlayStyle={{ backgroundColor: "transparent" }}
                    modal={true}
                    footer={renderFooter()}
                  >
                    <div className="group mb-5 customCard">
                      <div className="group-content row mb-2">
                        <div className="col-md-12 mb-2">
                          <div className="form-group row">
                            <label className="col-5" htmlFor="name">
                              Search
                            </label>
                            <span className="col-1 p-0">:</span>
                            <div className="col-6">
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

                        <div className="col-md-12 mb-2">
                          <ResourceHierarchy
                          />
                        </div>
                      </div>
                    </div>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResourceCostCenter;
