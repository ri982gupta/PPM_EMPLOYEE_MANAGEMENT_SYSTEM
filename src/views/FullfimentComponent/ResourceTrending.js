import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import { environment } from "../../environments/environment";
import axios from "axios";
import moment from "moment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";

import ResourceTrendingDisplayTable from "./ResourceTrendingDisplayTable";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { useLocation } from "react-router-dom";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import Loader from "../Loader/Loader";
import { AiFillWarning } from "react-icons/ai";
function ResourceTrending(props) {
  const {
    permission,
    urlState,
    buttonState,
    setButtonState,
    setUrlState,
    permissionNew,
    maxHeight1
  } = props;
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searching, setsearching] = useState(false);
  const baseUrl = environment.baseUrl;
  const [headerData, setHeaderData] = useState([]);
  const [durationn, setDurationn] = useState("");
  const [column, setColumn] = useState([]);
  const [col, setCol] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [displayTableState, setDisplayTableState] = useState(false);
  const [weekDifference, setWeekDifference] = useState([1, 2, 3, 4]);
  const [errorMsg, setErrorMsg] = useState(false);
  const todayy = new Date();
  const [clicked, setClicked] = useState(false);
  const HelpPDFName = "RMGResourceTrending.pdf";
  const HelpHeader = "Resource Trending Help";
  const abortController = useRef(null);
  const [startDate, setStartDate] = useState();
  let fouthsat = "";
  useEffect(() => {
    // Calculate the date for the Saturday of the 5th last week
    const currentDate = new Date();
    const fifthLastSaturday = new Date(currentDate);

    // Calculate the day of the week (0 = Sunday, 6 = Saturday)
    const currentDayOfWeek = currentDate.getDay();
    const daysUntilLastSaturday = (currentDayOfWeek + 1) % 7; // Adding 1 to start from Monday
    const daysToSubtract = 4 * 7 + daysUntilLastSaturday; // 5 weeks + daysUntilLastSaturday

    fifthLastSaturday.setDate(currentDate.getDate() - daysToSubtract);
    fouthsat = fifthLastSaturday;
    setStartDate(fifthLastSaturday);
  }, []);



  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  function getPreviousWeekSaturday(tod) {
    const dayOfWeek = tod.getDay();
    // console.log(dayOfWeek, tod.getDate(), "dayOfWeek")
    const daysSinceSaturday = dayOfWeek >= 5 ? dayOfWeek - 5 : dayOfWeek + 2; // Calculate days since last Saturday

    const lastWeekSaturday = new Date(tod);
    lastWeekSaturday.setDate(tod.getDate() - daysSinceSaturday);

    return lastWeekSaturday;
  }

  const previousWeekSaturday = getPreviousWeekSaturday(todayy);

  const initialValue = {
    BuIds: "170,211,123,82,168,207,212,18,213,49,149,208",
    CountryIds: "-1",
    FromDate: moment(startDate).format("yyyy-MM-DD"),
    Duration: "1",
    resType: "0",
  };
  const pageurl = "http://10.11.12.149:3000/#/rmg/bench";
  const page_Name = "Resource Trending";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const ref = useRef([]);
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
  const FilterData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/FiltersData?saved_search_id=${id === null ? 0 : id
        }`,
    }).then(function (res) {
      const getData = res.data;
      setFilterData(getData);
      console.log(getData + "in line 881...");
    });
  };

  useEffect(() => {
    FilterData();
  }, []);
  const [formData, setFormData] = useState({
    BuIds: "-1",
    CountryIds: "-1",
    FromDate: moment(startDate).format("yyyy-MM-DD"),
    Duration: "4",
    resType: "0",
  });
  console.log("formdate...", startDate);
  let date1 = moment(startDate).format("yyyy-MM-DD");
  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          BuIds: filterData.BuIds,
          CountryIds: filterData.CountryIds,
          FromDate: filterData.FromDate,
          Duration: filterData.Duration,
          resType: filterData.resType,
        };
      } else {
        return {
          BuIds: "-1",
          CountryIds: "-1",
          FromDate: moment(fouthsat).format("yyyy-MM-DD"),
          Duration: filterData.Duration,
          resType: "0",
        };
      }
    });
  }, [filterData]);

  useEffect(() => {
    if (id != null) {
      const updatebusiness = business.filter((values) =>
        formData.BuIds?.includes(values.value)
      );
      const updatecountry = country.filter((values) =>
        formData.CountryIds?.includes(values.value)
      );

      setSelectedBusiness(updatebusiness);
      setSelectedCountry(updatecountry);
      console.log(updatecountry);
    }
  }, [id]);

  const calculateWeekDifference = (date) => {
    const start = moment(date);
    const end = moment(new Date());

    const daysDifference = end.diff(start, "days");
    let weeksDifference = Math.floor(daysDifference / 7);
    // weeksDifference += 1;
    if (weeksDifference > 11) {
      weeksDifference = 11;
    }
    let weekdiff = [];
    for (let i = 1; i <= weeksDifference; i++) {
      weekdiff.push(i);
    }

    setWeekDifference(weekdiff);
    console.log("weeksDifference....", weeksDifference);
  };

  const handleClick = async () => {
    let filterData = ref.current.filter((d) => d != null);
    ref.current = filterData;
    let valid = GlobalValidation(ref);
    console.log(valid);
    if (valid) {
      {
        setValidationMessage(true);
        setErrorMsg(true);
      }
      return;
    }
    setErrorMsg(false);
    setColumn([]);
    setTableData([]);
    setsearching(true);
    setLoader(true);
    await axios({
      method: "post",
      url:
        // `http://localhost:8090/fullfilmentms/resourceTrending/getResourceTrendingData`,
        baseUrl + `/fullfilmentms/resourceTrending/getResourceTrendingData`,
      data: {
        departments: formData.BuIds,
        country: formData.CountryIds,
        from: moment(startDate).format("yyyy-MM-DD"),
        duration: formData.Duration,
        resType: formData.resType,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const data = response.data;
      axios({
        method: "get",
        url:
          baseUrl +
          `/fullfilmentms/resourceTrending/getheaders?ReportRunId=${data.reportRunId}`,
        // `http://localhost:8090/fullfilmentms/resourceTrending/getheaders?ReportRunId=${data.reportRunId}`,
      }).then((res1) => {
        let header = res1.data.val;
        let splt = header.replaceAll("'", "");
        let st = splt.split(",");
        setCol(st);
        let newArray = st.map((element) => element.trim());
        setColumn(newArray);
        setClicked(true);
      });
      //setValidationMessage(false);
      setTableData(data);
      setLoader(false);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      setsearching(false);
    });
    setDisplayTableState(true);
    setLoader(false);
    setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
  };

  console.log(displayTableState);
  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        console.log(data);
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            countries.push(countryObj);
          });
        setCountry(countries);
        if (id == null) {
          setSelectedCountry(countries);
        }
      })
      .catch((error) => console.log(error));
  };
  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getDepartments`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        console.log(data);
        data.push({ value: 999, label: "Non-Revenue Units" });
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.label,
              value: e.value,
            };
            countries.push(countryObj);
          });
        setBusiness(countries);
        if (id == null) {
          setSelectedBusiness(countries);
        }
      })
      .catch((error) => console.log(error));
  };
  console.log("dur,,,", weekDifference);
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  useEffect(() => {
    if (clicked && column.length === 0 && tableData) {
      let newArray = col.map((element) => element.trim());
      setColumn(newArray);
    }
  }, [clicked, tableData, formData.Duration]);

  useEffect(() => {
    getBusinessUnit();
    getCountries();
  }, []);

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Fullfilment";
  let currentScreenName = ["Bench Metrics", "Historical"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/rmg/trending&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);

  // const handleWeekSelect = (weekStartDate) => {
  //   setSelectedWeekStart(weekStartDate);

  //   const startOfWeek = moment(weekStartDate).startOf('isoWeek');
  //   const endOfWeek = moment(weekStartDate).endOf('isoWeek');

  //   setFormData((prev) => ({
  //     ...prev,
  //     ["FromDate"]: startOfWeek.format("yyyy-MM-DD"),
  //     ["ToDate"]: endOfWeek.format("yyyy-MM-DD"),
  //   }));
  // };

  const renderCustomDay = (day, selectedDate, dayInFocus) => {
    const isWeekSelected =
      selectedWeekStart && moment(day).isSame(selectedWeekStart, "isoWeek");

    const isDaySelected =
      selectedDate && moment(day).isSame(selectedDate, "day");

    return (
      <div
        className={`custom-day ${isWeekSelected ? "week-selected" : ""} ${isDaySelected ? "day-selected" : ""
          }`}
        onClick={() => handleWeekSelect(day)}
      >
        {day.getDate()}
      </div>
    );
  };
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <div className="tabsProject">
              <ul className="tabsContainer">
                <button
                  className={
                    buttonState === "Bench Report"
                      ? "buttonDisplayClick"
                      : "buttonDisplay"
                  }
                  onClick={() => {
                    setButtonState("Bench Report");
                    setUrlState(
                      permission[3]?.display_name.url_path
                        ?.toString()
                        ?.replace(/::/g, "/")
                    );
                  }}
                >
                  Bench Report
                </button>{" "}
              </ul>
              <ul className="tabsContainer">
                <li>
                  <span>Deployment</span>
                  <ul>
                    {permissionNew.map((button) => (
                      <li
                        className={
                          buttonState === button.display_name
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState(button.display_name);
                          console.log(button.display_name);
                          setUrlState(
                            button.url_path?.toString()?.replace(/::/g, "/")
                          );
                        }}
                      >
                        {button.display_name}
                      </li>
                    ))}
                  </ul>
                </li>{" "}
              </ul>
              <ul className="tabsContainer">
                <button
                  className={
                    buttonState === "Roll Offs"
                      ? "buttonDisplayClick"
                      : "buttonDisplay"
                  }
                  onClick={() => {
                    setButtonState("Roll Offs");
                    setUrlState(
                      permission[3]?.display_name.url_path
                        ?.toString()
                        ?.replace(/::/g, "/")
                    );
                  }}
                >
                  <span>{"Roll Off"}</span>
                </button>{" "}
              </ul>
            </div>
          </div>
          <div className="childTwo">
            <h2>Historical</h2>
          </div>
          <div className="childThree toggleBtns">
            <div>
              <button
                className="searchFilterButton btn btn-primary"
                onClick={() => {
                  setVisible(!visible);

                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                Search Filters
                <span className="serchFilterText">{cheveronIcon}</span>
              </button>
              <div className="saveBtn">
                <SavedSearchGlobal
                  setEditAddmsg={setEditAddmsg}
                  pageurl={pageurl}
                  page_Name={page_Name}
                  payload={formData}
                />
              </div>
            </div>
            <GlobalHelp pdfname={HelpPDFName} name={HelpHeader} />
          </div>{" "}
        </div>
      </div>

      {errorMsg ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}
      {loader ? <Loader handleAbort={handleAbort} /> : ""}

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="businessUnit">
                  Business Unit
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="BuIds"
                    value={selectedBusiness}
                    options={business}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<<Please Select>>",
                    }}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedBusiness(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["BuIds"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Country
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 multiselect">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    id="CountryIds"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<<Please Select>>",
                    }}
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
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="startweek">
                  Start Week<span style={{ color: "red" }}>&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    selected={startDate}
                    onChange={(date) => {
                      calculateWeekDifference(date);
                      const selectedDate = moment(date);
                      const dayOfWeek = selectedDate.day();
                      setDurationn("");
                      if (dayOfWeek !== 6) {
                        // Check if selected date is not Saturday
                        const lastSaturday = selectedDate.clone().day(-1); // Set to last Saturday (0-based index)

                        // Find the last Saturday of the previous week
                        while (lastSaturday.day() !== 6) {
                          lastSaturday.subtract(1, "day");
                        }

                        setStartDate(lastSaturday.toDate()); // Set the state to the last Saturday

                        setFormData((prev) => ({
                          ...prev,
                          ["FromDate"]: lastSaturday.format("yyyy-MM-DD"),
                        }));
                      } else {
                        setStartDate(selectedDate.toDate());

                        setFormData((prev) => ({
                          ...prev,
                          ["FromDate"]: selectedDate.format("yyyy-MM-DD"),
                        }));
                      }
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    calendarStartDay={6}
                    dateFormat="dd-MMM-yy"
                    maxDate={previousWeekSaturday}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="Duration"
                    onChange={(e) => {
                      setDurationn(e.target.value);
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                    value={durationn}
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <option value="">&lt;&lt; Please Select &gt;&gt;</option>
                    {weekDifference?.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resType">
                  Res. Type
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="resType"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="all"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="1">Employee</option>
                    <option value="2">Contractors</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              {
                <button
                  className="btn btn-primary "
                  onClick={() => handleClick()}
                >
                  <FaSearch />
                  Search
                </button>
              }
            </div>
          </div>
        </CCollapse>
      </div>
      {displayTableState && (
        <ResourceTrendingDisplayTable tableData={tableData} column={column} maxHeight1={maxHeight1} />
      )}
    </div>
  );
}

export default ResourceTrending;
