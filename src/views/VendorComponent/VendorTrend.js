import React, { useEffect, useRef, useState } from "react";
import ParentVendorTabs from "./ParentVendorTabs";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { MultiSelect } from "react-multi-select-component";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import VendorTrendTable from "./VendorTrendTable";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import Loader from "../Loader/Loader";

export default function VendorTrend(props) {
  const { btnState, setbtnState, setUrlState } = props;
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const ref = useRef([]);
  const [date, setDate] = useState(new Date());
  const [viewby, setViewBy] = useState("CSL");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const [showtable, setShowtable] = useState(false);
  const [validtaionmsg, setValidationMsg] = useState(false);
  const [csl, setCsl] = useState([]);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [dp, setDp] = useState([]);
  const [selectedDp, setSelectedDp] = useState([]);

  const [formData, setFormData] = useState({
    From: moment(date).format("YYYY-MM-DD"),
    Duration: 12,
    CountryIds: "-1",
    serType: "CSl",
    serValue: "-1",
  });
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);
    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
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
            countries.push(countryObj);
          });
        setCountry(countries);
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };

  //==========CSL and DP API========================================

  const handleCsl = () => {
    const loggedUser = "0";
    axios({
      method: "get",
      url:
        baseUrl +
        `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUser}`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let cslObj = {
            label: e.PersonName,
            value: e.id,
          };
          custom.push(cslObj);
        });

      setCsl(custom);
      setSelectedCsl(custom);
    });
  };
  const handleDp = () => {
    const loggedUser = "0";
    axios({
      method: "get",
      url: baseUrl + `/CommonMS/master/getDPDropDownData?userId=${loggedUser}`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let dpObj = {
            label: e.PersonName,
            value: e.id,
          };
          custom.push(dpObj);
        });

      setDp(custom);
      setSelectedDp(custom);
    });
  };

  useEffect(() => {
    getCountries();
    handleDp();
    handleCsl();
  }, []);
  const getData = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMsg(true);
      return;
    }
    setValidationMsg(false);
    setShowtable(false);
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      url: baseUrl + `/VendorMS/vendor/getVendorTrendData`,
      method: "post",
      signal: abortController.current.signal,
      data: {
        From: moment(date).startOf("month").format("YYYY-MM-DD"),
        Duration: +formData.Duration,
        CountryIds: formData.CountryIds,
        serType: formData.serType,
        serValue: formData.serValue,
      },
    })
      .then(function (response) {
        const tableData = response.data;
        clearTimeout(loaderTime);
        setLoader(false);
        setData(tableData);
        setShowtable(true);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch(function (error) {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div>
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {validtaionmsg ? (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please Select Mandatory Fields"}
        </div>
      ) : (
        ""
      )}{" "}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <ParentVendorTabs
              btnState={btnState}
              setbtnState={setbtnState}
              setUrlState={setUrlState}
            />
          </div>
          <div className="childTwo">
            <h2>Trend</h2>
          </div>
          <div className="childThree toggleBtns">
            <div>
              <p className="searchFilterHeading">Search Filters</p>
              <span
                onClick={() => {
                  setVisible(!visible);
                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                {cheveronIcon}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="group  customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row mt-2">
            <div className="col-md-3 mb-2">
              <div className="row">
                <label className="col-5 ">View By </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="summary"
                    name="summary"
                    value={viewby}
                    onChange={(e) => {
                      setViewBy(e.target.value);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["serType"]: e.target.value,
                      }));
                    }}
                  >
                    <option value="CSL">CSL</option>
                    <option value="DP">DP</option>
                  </select>
                </div>
              </div>
            </div>
            {viewby === "CSL" ? (
              <div className="col-md-3 mb-2">
                <div className="row">
                  <label className="col-5">CSL </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className=" multiselect col-6"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      id="csl"
                      options={csl}
                      hasSelectAll={true}
                      value={selectedCsl}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      selected={selectedCsl}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedCsl(e);
                        let filteredCustomer = [];
                        e.forEach((d) => {
                          filteredCustomer.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["serValue"]: filteredCustomer.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            {viewby === "DP" ? (
              <div className="col-md-3">
                <div className="row">
                  <label className="col-5">DP</label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className=" multiselect col-6"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      id="Dp"
                      options={dp}
                      hasSelectAll={true}
                      value={selectedDp}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      selected={selectedDp}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedDp(e);
                        let filteredCustomer = [];
                        e.forEach((d) => {
                          filteredCustomer.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["serValue"]: filteredCustomer.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="col-md-3 mb-2">
              <div className="row">
                <label className="col-5">
                  From
                  <span className="required error-text ml-1"> *</span>{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 ">
                  <DatePicker
                    id="from"
                    selected={moment(date)._d}
                    onChange={(e) => {
                      setDate(e);
                    }}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-2 ">
              <div className="row">
                <label className="col-md-5">
                  Duration
                  <span className="required error-text ml-1"> *</span>{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="duration"
                    name="duration"
                    className="col-md-12 col-sm-12 col-xs-12 "
                    value={formData.Duration}
                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["Duration"]: e.target.value,
                      }));
                    }}
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

            <div className="col-md-3 mb-2 ">
              <div className="row">
                <label className="col-5 ">
                  Res Location
                  <span className="required error-text ml-1"> *</span>{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                  id="countryids"
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["CountryIds"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
            <button
              className="btn btn-primary"
              onClick={() => {
                getData();
              }}
            >
              <FaSearch />
              Search
            </button>
          </div>
        </CCollapse>
        <br />
        {showtable && (
          <div className="col-md-12 EngagementDetails">
            <VendorTrendTable
              data={data}
              formData={formData}
              setLoader={setLoader}
              abortController={abortController}
            />
          </div>
        )}
      </div>
    </div>
  );
}
