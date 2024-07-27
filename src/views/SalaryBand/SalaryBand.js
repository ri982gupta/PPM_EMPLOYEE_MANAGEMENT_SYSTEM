import { CCollapse } from "@coreui/react";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import axios from "axios";
import { environment } from "../../environments/environment";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import SalaryBandTable from "./SalaryBandTable";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
function SalaryBand() {
  const loggedUserId = localStorage.getItem("resId");
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [resLocation, setResLocation] = useState([{}]);
  const [selectedResLocation, setSelectedResLocation] = useState([]);
  const [month, setMonth] = useState(new Date());
  const [roletype, setRoleType] = useState([{}]);
  const [selectedRoleType, setSelectedRoleTypes] = useState([]);
  const [popUp, SetPopUp] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [loaderTimer, setLoaderTimer] = useState(false);
  const ref = useRef([]);
  const abortController = useRef([]);
  const [routes, setRoutes] = useState([]);
  let textContent = "Cost";
  let currentScreenName = ["Salary Band"];
  const initialValue = {
    departments: "170,211,123,82,168,207,212,18,213,49,149,208,243,999",
    resLocation: "6,5,3,8,7,1,2",
    month: moment(new Date()).startOf("month").format("YYYY-MM-DD"),
    roletype:
      "117,143,142,493,418,531,539,565,701,192,503,754,752,490,917,495,144,388,504,385,385,533,729,658,244,732,765,723,755,389,918,722,753,390,391,391,386,303,392,919,920,532,536,667,393,651,646,128,713,730,771,152,394,498,751,756,821,921,537,176,93,396,397,399,398,400,400,362,387,89,527,528,491,401,48,301,489,496,91,98,494,132,727,757,819,492,463,428,428,46,85,746,776,750,922,506,173,500,129,731,760,377,699,923,220,395,403,505,147,668,404,497,148,534,501,187,378,721,740,306,234,728,725,161,499,405,405,296,341,406,724,307,307,237,702,759,758,174,502,199,105,105,402,84,407,409",
  };
  const [formData, setFormData] = useState(initialValue);
  const baseUrl = environment.baseUrl;
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  useEffect(() => {
    getMenus();
    sessionStorage.setItem(
      "breadCrumbs",
      JSON.stringify({
        routes: routes,
        currentScreenName: currentScreenName,
        textContent: textContent,
      })
    );
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
        }
      });
    });
  };
  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments.push({ value: 999, label: "Non-Revenue Units" });
    setSelectedDepartments(departments.filter((ele) => ele.value >= 0));

    let dept = [];
    let deptId = [];
    departments.length > 0 &&
      departments.forEach((e) => {
        if (e.value >= 0) {
          let filteredDeptData = { label: e.label, value: e.value };
          dept.push(filteredDeptData);
          deptId.push(filteredDeptData.value);
        }
      });
    setDepartments(dept);
    setSelectedDepartments(dept);
  };

  const getResLocation = () => {
    axios({
      method: "get",
      url: baseUrl + `/revenuemetricsms/metrics/getreslocation`,
    }).then(function (response) {
      let ResLocation = response.data;
      setResLocation(response.data);
      setSelectedResLocation(ResLocation.filter((ele) => ele.value >= 0));
      let filteredlocationData = [];
      ResLocation.forEach((data) => {
        if (data.value >= 0) {
          filteredlocationData.push(data.value);
        }
      });
    });
  };

  const getRoleTypes = () => {
    axios({
      url: baseUrl + `/CostMS/SalaryBand/roleTypes`,
    }).then((response) => {
      let RoleType = response.data;
      setRoleType(response.data);
      setSelectedRoleTypes(RoleType.filter((ele) => ele.value >= 0));
      let filteredroleTypes = [];
      RoleType.forEach((data) => {
        if (data.value >= 0) {
          filteredroleTypes.push(data.value);
        }
      });
    });
  };

  const getSearch = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMessage(true);
      return;
    } else {
      const loaderTime = setTimeout(() => {
        setLoaderTimer(true);
      }, 2000);
      setValidationMessage(false);
      abortController.current = new AbortController();
      axios({
        method: "post",
        url: baseUrl + `/CostMS/SalaryBand/getData`,
        signal: abortController.current.signal,
        data: {
          country: formData.resLocation,
          department: formData.departments,
          roletype: formData.roletype,
          month: formData.month,
        },
      }).then((response) => {
        setLoaderTimer(false);
        clearTimeout(loaderTime);
        setTableData(response.data);
        let valid = GlobalValidation(ref);
        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      });
    }
  };

  useEffect(() => {
    getDepartments();
    getResLocation();
    getRoleTypes();
  }, []);

  useEffect(() => {
    axios({
      method: "post",
      url: baseUrl + `/CostMS/SalaryBand/getData`,
      signal: abortController.current.signal,
      data: {
        country: formData.resLocation,
        department: formData.departments,
        roletype: formData.roletype,
        month: formData.month,
      },
    }).then((response) => {
      setLoaderTimer(false);
      setTableData(response.data);
      let valid = GlobalValidation(ref);
      !valid && setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  }, []);

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };
  return (
    <div className="col-md-12">
      {validationMessage ? (
        <div className="statusMsg error">
          <AiFillWarning />
          {"Please select the valid values for highlighted fields"}
        </div>
      ) : (
        ""
      )}
      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Salary Band</h2>
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

      <div className="gropu mb-3 customCard">
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="department">
                  Department<span className="required error-text ml-1">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="departments"
                    options={departments}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedDepartments}
                    selected={selectedDepartments}
                    valueRenderer={generateDropdownLabel}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedDepartments(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["departments"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Location">
                  Country<span className="required error-text ml-1">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="resLocation"
                    options={resLocation}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    value={selectedResLocation}
                    selected={selectedResLocation}
                    valueRenderer={generateDropdownLabel}
                    onChange={(e) => {
                      setSelectedResLocation(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["resLocation"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Role Type">
                  Role Type<span className="required error-text ml-1">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="roletype"
                    options={roletype}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    selected={selectedRoleType}
                    value={selectedRoleType}
                    valueRenderer={generateDropdownLabel}
                    onChange={(e) => {
                      setSelectedRoleTypes(e);
                      let filteredroles = [];
                      e.forEach((d) => {
                        filteredroles.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["roletype"]: filteredroles.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="month">
                  Month<span className="required error-text ml-1">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 datepicker"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  <DatePicker
                    id="month"
                    selected={month}
                    onChange={(e) => {
                      setMonth(e);
                      setFormData((prev) => ({
                        ...prev,
                        ["month"]: moment(e).format("YYYY-MM-DD"),
                      }));
                    }}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-1">
              <button
                type="submit"
                className="btn btn-primary center"
                onClick={() => {
                  getSearch();
                }}
              >
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      <div className="col-md-12">
        <SalaryBandTable
          popUp={popUp}
          SetPopUp={SetPopUp}
          tableData={tableData}
          setTableData={setTableData}
          getSearch={getSearch}
          resLocation={resLocation}
          setResLocation={setResLocation}
          departments={departments}
          setDepartments={setDepartments}
          roletype={roletype}
          formData={formData}
          setLoaderTimer={setLoaderTimer}
          loaderTimer={loaderTimer}
          abortController={abortController}
        />
      </div>
    </div>
  );
}

export default SalaryBand;
