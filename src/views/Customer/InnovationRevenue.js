import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import Loader from "../Loader/Loader";

function InnovationRevenue() {
  const [visible, setVisible] = useState(false);
  const [searching, setsearching] = useState(false);
  const [endDate, setEndDate] = useState();
  const [loaderState, setLoaderState] = useState(false);

  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Innovation Revenue</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
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
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customers">
                  Themes<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="BuIds"
                    options={""}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={""}
                    valueRenderer={""}
                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="custstatus">
                  Solutions<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="BuIds"
                    options={""}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={""}
                    valueRenderer={""}
                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="accountexecutive">
                  Quarter<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>

                <div className="col-6">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText={"Date"}
                    selectsStart
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="csl">
                  Stage<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="BuIds"
                    options={""}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={""}
                    valueRenderer={""}
                    disabled={false}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="deliverypartner">
                  Sales Executive<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select className="" id="currency">
                    <option value="All"> &lt;&lt;Please Select&gt;&gt;</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-1">
              {loaderState ? (
                <div className="loaderBlock">
                  <Loader />
                </div>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  title="Search"
                  // onClick={postData}
                >
                  <FaSearch />
                  Search
                </button>
              )}
            </div>
          </div>
        </CCollapse>
      </div>
    </div>
  );
}

export default InnovationRevenue;
