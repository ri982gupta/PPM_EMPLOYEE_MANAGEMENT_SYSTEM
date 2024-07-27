import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import moment from "moment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import MaterialReactCollapisbleTable from "../PrimeReactTableComponent/MaterialReactCollapisbleTable";
import { AiFillWarning } from "react-icons/ai";
import InnovationDashboardTable from "./InnovationDashboardTable";
import MonthlyForecastRevenueCalenderTable from "../RevenueMetrices/MonthlyForecastRevenueCalenderTable";
import VendorPerformanceTopMaterialTable from "../VendorComponent/VendorPerformanceTopMaterialTable";
import InnovationMaterialTable from "./InnovationMaterialTable";
function InnovationDashboard() {
  const [startDate, setStartDate] = useState(new Date());
  const [value, onChange] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [Type, setType] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [searching, setsearching] = useState(false);
  const [details, setDetails] = useState([]);
  const [columns, setColumns] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const loggedUserId = localStorage.getItem("resId");

  const baseUrl = environment.baseUrl;

  const ref = useRef([]);

  const initialValue = {
    countryIds: "6,5,3,8,7,1,2",
    StartDt: moment(new Date()).format("yyyy-MM-DD"),
    duration: "2",
    measures: "Alloc,Act,rdc",
    userId: loggedUserId,
  };

  const [state, setState] = useState(initialValue);
  const [tableData, setTableData] = useState([]);

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)

      .then((Response) => {
        let countries = [];

        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            {
              e.country_name == "NM" ? "" : countries.push(countryObj);
            }
          });
        setCountry(countries);
        setSelectedCountry(countries);
      });
  };

  const getType = () => {
    let types = [];
    types.push(
      { value: "Alloc", label: "Allocations" },
      { value: "Act", label: "Actuals" },
      { value: "rdc", label: "RDC" }
    );
    setType(types);
    setSelectedType(types.filter((ele) => ele.value >= ""));
    let filteredType = [];
    types.forEach((data) => {
      if (data.value >= "") {
        filteredType.push(data.value);
      }
    });
  };

  const customValueRenderer = (selected, _options) => {
    return selected.length === country.length
      ? // selected.length === departments.length
        "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };

  const getTableData = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setValidationMessage(true);
      }
      return;
    }
    if (valid) {
      return;
    }
    setsearching(true);
    axios({
      method: "post",
      // url: `http://localhost:8090/UtilityMS/getInnovationInvestment?countryIds=${state.countryIds}&month=${state.StartDt}&duration=${state.duration}&measures=${state.measures}`,
      url: baseUrl + `/UtilityMS/getInnovationInvestment`,
      // url: `http://localhost:8090/UtilityMS/getInnovationInvestment`,

      // data: {
      //   countryIds: "6,5,3,8,7,1,2",
      //   month: "2023-03-13",
      //   duration: "2",
      //   measures: "Alloc,Act,rdc",
      //   UserId: "512",
      // },
      data: {
        countryIds: state.countryIds,
        month: state.StartDt,
        duration: state.duration,
        measures: state.measures,
        userId: loggedUserId,
      },
    }).then((res) => {
      let detail = res.data.tableData;
      let cols = res.data.columns?.replaceAll("'", "").split(",");
      setDetails(detail);
      setTableData(res.data);
      setColumns(cols);
      setValidationMessage(false);
      setTimeout(() => {
        setsearching(false);
      }, 1000);
    });
  };

  useEffect(() => {
    getCountries();
    getType();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <div>
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Innovation Investment</h2>
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
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Country&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <MultiSelect
                    id="countryIds"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    disabled={false}
                    valueRenderer={customValueRenderer}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setState((prevVal) => ({
                        ...prevVal,
                        ["countryIds"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="startweek">
                  Start Week&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    className="StartDt"
                    selected={startDate}
                    onChange={(e) => {
                      setState((prev) => ({
                        ...prev,
                        ["StartDt"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setStartDate(e);
                    }}
                    dateFormat="dd-MMM-yyyy"
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Duration">
                  Duration
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="duration"
                    name="duration"
                    defaultValue={2}
                    onChange={handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="measures">
                  Measures
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="measures"
                    options={Type}
                    hasSelectAll={true}
                    value={selectedType}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedType(e);
                      let filteredType = [];
                      e.forEach((d) => {
                        filteredType.push(d.value);
                      });
                      setState((prevVal) => ({
                        ...prevVal,
                        ["measures"]: filteredType.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={getTableData}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
          {searching ? <Loader setsearching={setsearching} /> : ""}
        </CCollapse>

        <div className="col-md-12">
          {/* MaterialReactCollapisbleTable */}
          {/* InnovationDashboardTable */}
          <InnovationMaterialTable
            data={tableData}
            expandedCols={["supervisor", "emp_cadre"]}
            colExpandState={["0", "0", "name"]}
          />
        </div>
      </div>
    </div>
  );
}

export default InnovationDashboard;
