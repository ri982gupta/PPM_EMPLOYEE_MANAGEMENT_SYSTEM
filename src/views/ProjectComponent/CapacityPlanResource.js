import React, { useEffect, useState } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import axios from "axios";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import CapacityPlanResourceList from "./CapacityPlanResourceList";
import { useRef } from "react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";

function CapacityPlanResource(props) {
  const {
    data,
    setSearchResource, setAddErrMsg, setErrData, addErrMsg,
    loggedUserId, projectId,
    getTableData,
    setEditMessage,
    setErrorMsg,
    dailyhrsRange,
    setDailyhrsRange,
    setAddMessage,
    setAddResMessage,
    validateproject,
    setValidateproject,
    errorMsg,
    setEditResMessage,
    grp2Items,
  } = props;
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [dateFlag, setdateFlag] = useState("0");
  const [item, setItem] = useState([]);
  const [resid, setResid] = useState("null");
  const baseUrl = environment.baseUrl;
  const [autocompleteData, setAutocompleteData] = useState([]);
  const [resTableData, setResTableData] = useState([]);
  const [displayTable, setDisplayTable] = useState(false);
  const [busUnit, setBusUnit] = useState([]);
  const ref = useRef([]);

  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/CapacityPlan/getAssignedDataIsActive`,
    }).then(function (response) {
      var res = response.data;
      setAutocompleteData(res);
    });
  };
  useEffect(() => { }, [autocompleteData, item]);
  useEffect(() => {
    getBusinessUnit();
    getData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    if (errorMsg) window.scrollTo(0, 0);
  }, [errorMsg]);

  const getBusinessUnit = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/CapacityPlan/getBusinessUnitDropdown`,
    }).then(function (response) {
      var res = response.data;
      setBusUnit(res);
    });
  };

  const handleChange = (e) => {
    setdateFlag(e.target.value);
  };
  const handleClear = () => {
    setResid("null");
  };
  const handleSearch = () => {
    let valid = GlobalValidation(ref);
    console.log(valid);

    if (valid == true) {
      setErrorMsg(true);
      setTimeout(() => {
        setErrorMsg(false);
      }, 4000);
    }
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/CapacityPlan/GetRoleResourcesAvailability`,
      data: {
        resid: resid.toString(),
        fromDt: data.plannedStartDt,
        endDt: data.plannedEndDt,
      },
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp);
        setResTableData(resp);
        setDisplayTable(true);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  // useEffect(() => {
  //     if (errorMsg) {

  //         window.scrollTo({ top: scrollToRef.current.offsetTop, behavior: 'smooth' });
  //     }
  // }, [errorMsg]);
  return (
    <div>
      <div className="col-md-12 customCard mt-2">
        <div className="col-md-12 collapseHeader">
          <h2>Search Resource - {data?.roleType}</h2>
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
          <div>
            {/* <div className="group-content row"> */}
            <div className=" col-md-3 ml-1">
              <div className=" form-group row">
                <div
                  className="col-6"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                >
                  <input
                    className="form-check-input"
                    htmlFor="yes"
                    type="radio"
                    value="0"
                    name="Resource"
                    id="Resource"
                    checked={dateFlag == "0" ? true : false}
                  />
                  &nbsp;
                  <span className="form-check-label">
                    Resource Search
                  </span>{" "}
                </div>
                {/* <div className='col-6' onChange={(e) => { handleChange(e) }}>
                                        <input className="form-check-input" htmlFor="no" type="radio" name="Skill" id="Skill" value="1"
                                            checked={dateFlag == "1" ? true : false}
                                        />&nbsp;
                                        <span className="form-check-label">Skill Search</span>
                                    </div> */}
              </div>
            </div>
            {/* </div> */}

            <div className="col-6 mb-1">
              {dateFlag == "0" ? (
                <div className="form-group row">
                  <label className="col-2">
                    Resource <span className="error-text ml-1">*</span>
                  </label>
                  <label className="col-1 p-0">:</label>
                  <div
                    className="col-4 autocomplete"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <div className="autoComplete-container ">
                      <ReactSearchAutocomplete
                        items={autocompleteData}
                        type="Text"
                        name="resourceId"
                        id="resourceId"
                        className="error AutoComplete"
                        onSelect={(e) => {
                          setResid(e.id);
                        }}
                        showIcon={false}
                        onClear={handleClear}
                        placeholder="Type minimum 3 characters"
                      />
                      <span> {item.name}</span>
                    </div>
                  </div>
                  <div className="col">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        handleSearch();
                      }}
                    >
                      <FaSearch />
                      Search
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group-content row">
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="bu">
                        Business Unit <span className="error-text ml-1">*</span>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          className="error  col-md-12 p0"
                          name="busUnit"
                          id="busUnit"
                          onChange={(e) => handleChange(e)}
                        >
                          <option value="0">
                            {" "}
                            &lt;&lt;Please Select&gt;&gt;
                          </option>
                          {busUnit.map((Item) => (
                            <option value={Item.id}> {Item.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="type">
                        Type <span className="error-text ml-1">*</span>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          className="error  col-md-12 p0"
                          name="type"
                          id="type"
                          onChange={(e) => handleChange(e)}
                        >
                          <option value="null">
                            {" "}
                            &lt;&lt;Please Select&gt;&gt;
                          </option>
                          <option value="all"> All</option>
                          <option value="customer"> Customer</option>
                          <option value="supervisor"> Supervisor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row"></div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row"></div>
                  </div>
                  {console.log(data.plannedEndDt, data.plannedStartDt, "dates")}

                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="fromDt">
                        From Date <span className="error-text ml-1">*</span>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <DatePicker
                          name="fromDt"
                          id="fromDt"
                          selected={moment(data.plannedStartDt)._d}
                          dateFormat="yyyy-MMM-dd"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          minDate={moment(data.plannedStartDt)._d}
                          maxDate={moment(data.plannedEndDt)._d}
                          onKeyDown={(e) => {
                            e.preventDefault();
                            if (e.keyCode != 8) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="toDate">
                        To Date <span className="error-text ml-1">*</span>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control"
                          id="toDate"
                          placeholder
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="skillgroup">
                        Skill Group <span className="error-text ml-1">*</span>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control"
                          id="skillgroup"
                          placeholder
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>{" "}
          {displayTable ? (
            <CapacityPlanResourceList
              tableData={resTableData}
              Data={data}
              projectId={projectId}
              setAddErrMsg={setAddErrMsg}
              addErrMsg={addErrMsg}
              setErrData={setErrData}
              setSearchResource={setSearchResource}
              loggedUserId={loggedUserId}
              getTableData={getTableData}
              setEditMessage={setEditMessage}
              setAddMessage={setAddMessage}
              setAddResMessage={setAddResMessage}
              validateproject={validateproject}
              setValidateproject={setValidateproject}
              dailyhrsRange={dailyhrsRange}
              setDailyhrsRange={setDailyhrsRange}
              setEditResMessage={setEditResMessage}
              grp2Items={grp2Items}
            />
          ) : (
            ""
          )}
        </CCollapse>
      </div>
    </div>
  );
}

export default CapacityPlanResource;
