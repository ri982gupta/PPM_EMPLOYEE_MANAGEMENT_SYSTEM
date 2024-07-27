import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { CCollapse } from "@coreui/react";
import { AiFillWarning } from "react-icons/ai";
import Loader from "../Loader/Loader";
import { MultiSelect } from "react-multi-select-component";
import SelectSEDialogBox from "../SelectSE/SelectSEDialogBox";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { BiCheck } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { parseISO, format } from "date-fns";
import { useSelector } from "react-redux";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";

export default function AttainmentSearchFilter({
  setProgressData,
  setTableFlag,
}) {
  const baseUrl = environment.baseUrl;
  const pageurl = "http://10.11.12.149:3000/#/pmo/salesProgress";
  const page_Name = "Sales";
  const [editmsg, setEditAddmsg] = useState(false);
  const location = useLocation();
  const [grpId, setGrpId] = useState([]);
  const [salesfullAccess, setSalesfullAccess] = useState([]);

  const [bulkids, SetBulkIds] = useState(true);
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [filterData, setFilterData] = useState([]);
  const [visibleCol, setvisibleCol] = useState(false);

  const isIndividualChecked =
    localStorage.getItem("isIndividualCheckedLocal") === null
      ? false
      : JSON.parse(localStorage.getItem("isIndividualCheckedLocal"));

  //// -------breadcrumbs-----
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["Weekly Pipeline Progress"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const [selectedSEVal, setSelectedSEVal] = useState(-2);

  useEffect(() => {
    getMenus();
  }, []);
  const [hirarchy, setHirarchy] = useState([]);

  const hirarchyAccess = () => {
    axios

      .get(
        baseUrl +
          `/ProjectMS/project/getHirarchyAccesss?loggedUserId=${loggedUserId}`
      )

      .then((resp) => {
        const data = resp.data;
        setHirarchy(data);
      })

      .catch((err) => {});
  };
  useEffect(() => {
    hirarchyAccess();
  }, []);
  const userRoles = () => {
    // axios.get({
    //   `/timeandexpensesms/ShiftAllownces/getuserroleid?user_id=${loggedUserId}`
    // )}.then((response)=>{
    axios({
      method: "GET",
      url:
        baseUrl +
        `/timeandexpensesms/ShiftAllownces/getuserroleid?user_id=${loggedUserId}`,
    }).then((resp) => {
      const data = resp.data;
      console.log(data[0].role_type_id.includes("920") && 920);
      const salesAccess = data[0].role_type_id.includes("920") && 920;
      setSalesfullAccess(salesAccess);
    });
  };
  useEffect(() => {
    userRoles();
  }, []);
  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/pmo/salesProgress";
      getUrlPath(modifiedUrlPath);

      let data = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Project Timesheet (Deprecated)" &&
              subMenu.display_name !== "Invoice Details" &&
              subMenu.display_name !== "Accounting" &&
              subMenu.display_name !== "Upload" &&
              subMenu.display_name !== "Practice Calls [Deprecated]"
          );
        }
        return menu;
      });

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
      const projectStatusReportSubMenu = data
        .find((item) => item.display_name === "Sales")
        .subMenus.find(
          (subMenu) => subMenu.display_name === "Weekly Pipeline Progress"
        );
      setAccessData(projectStatusReportSubMenu.access_level);
    });
  };

  const getUrlPath = (modifiedUrlPath) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
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
    });
  };

  useEffect(() => {
    FilterData();
  }, []);

  const [salesExecutiveDropdown, setsalesExecutiveDropdown] = useState([]);
  const [selectedSE, setselectedSE] = useState("<< All SE >>");
  const [visible, setVisible] = useState(false);
  const [division, setDivision] = useState([]);
  const [SelectdDivision, setSelectdDivision] = useState([]);
  const [accessData, setAccessData] = useState([]);

  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const ref = useRef([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const localSE =
    localStorage.getItem("selectedSELocal") === null
      ? []
      : JSON.parse(localStorage.getItem("selectedSELocal"));
  function transformObjects(data) {
    return localSE.map((item) => {
      if (Array.isArray(item)) {
        const [obj] = item;
        if (
          obj &&
          obj.id &&
          obj.text &&
          obj.type === "fte1" &&
          obj.parent === "id"
        ) {
          return {
            salesPersonName: obj.text,
            type: obj.type,
            id: parseInt(obj.id),
            status: JSON.parse(obj.li_attr).sestatus || "empActive",
          };
        }
      }
      return item;
    });
  }
  const transformedData = transformObjects();

  const filteredData = transformedData
    .filter((obj, index) => {
      return index === transformedData.findIndex((o) => obj.id === o.id);
    })
    .filter((item) => !Array.isArray(item) || item.length === 0);

  const idArray = transformedData.map((item) => item.id);
  const filteredIds = idArray.filter((id) => typeof id === "number");
  const updatedIds = filteredIds.map((id) =>
    id === "1717" || "3887" || "3887" || "3977" || "4895" || "4872942"
      ? grpId
      : id
  );
  const flattenedIds = updatedIds.flat();
  const salesPersonNames = filteredData.map((item) => {
    if (
      (item.salesPersonName && item.salesPersonName === "Kirsten Craft") ||
      "Sarat Addanki" ||
      "Satyanarayana Bolli" ||
      "Supervisor Orphans" ||
      "Michelle Shuler"
    ) {
      return `${item.salesPersonName}`;
    }
    return item.salesPersonName;
  });

  const commaSeparatedNames = salesPersonNames.join(",");
  const salesPersonNamesBulk = filteredData.map((item) => {
    if (
      item.salesPersonName === "Kirsten Craft" &&
      "Sarat Addanki" &&
      "Satyanarayana Bolli" &&
      "Supervisor Orphans" &&
      "Michelle Shuler"
    ) {
      return `${item.salesPersonName} & team`;
    }
    return item.salesPersonName;
  });

  const commaSeparatedNamesBulk = salesPersonNamesBulk.join(",");
  const salesPersonIds = filteredData.map((item) => item.id);
  const commaSeparatedIds = salesPersonIds.join(",");
  const abortController = useRef(null);

  const [searching, setsearching] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    // const currentDate = new Date();
    // const year = currentDate.getFullYear() + 1;
    // const month = currentDate.getMonth() + 1 - 5;
    // return new Date(year, month, 1);
    return new Date(2024, 6, 1);
  });

  const filterMondays = (date) => {
    return date.getDay() === 1;
  };
  const getPreviousMonday = (date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const now = new Date(2023, 6, 31);

  const startDate3 = getPreviousMonday(now);

  const formattedStartDate = startDate3.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });
  const initialSelectedDate = new Date();
  initialSelectedDate.setFullYear(2023, 8, 25); // 8 for September (0-based index), 25 for the day

  const [startDate2, setStartDate2] = useState(initialSelectedDate);

  const [progressDataPayload, setProgressDataPayload] = useState({});

  useEffect(() => {
    setProgressDataPayload(() => {
      if (id != null) {
        return {
          executives: filterData?.executives,
          isActive: filterData?.isActive,
          isIndividual: filterData?.isIndividual,
          from: filterData?.from,
          duration: filterData?.duration,
          quarter: filterData?.quarter,
          selectExecs: filterData?.selectExecs,
          Divisions: filterData?.Divisions,
        };
      } else {
        return {
          executives: "-2",
          isActive: "true",
          isIndividual: "false",
          from: "2023-09-25",
          duration: "2",
          quarter: "2023-10-01",
          selectExecs: "",
          Divisions: "-1",
        };
      }
    });
  }, [filterData]);

  useEffect(() => {
    if (id != null) {
      const updateDivisions = division.filter(
        (values) => +filterData.Divisions?.includes(parseInt(values.value))
      );

      const progressDataDivisions = filterData.Divisions;
      const divisionsToFilter = progressDataDivisions
        ? progressDataDivisions.split(",").map(Number)
        : [];

      const updateDivisionsdata = updateDivisions.filter((values) =>
        divisionsToFilter.includes(values.value)
      );

      const updateSE = filterData?.executives;
      if (filterData?.executives?.length > 3) {
        setSelectedSEVal(1);
      } else {
        setSelectedSEVal(updateSE);
      }
      if (filterData.Divisions == "-1") {
        setSelectdDivision(division);
      } else {
        setSelectdDivision(updateDivisionsdata);
      }

      if (filterData?.from !== undefined && filterData.from !== "") {
        const updatedate = filterData.from;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedate)) {
          return;
        }
        const formattedDate = format(parseISO(updatedate), "yyyy-MM-dd");
        const parsedDate = parseISO(formattedDate);
        setStartDate2(parsedDate);
      }
      if (filterData.quarter !== undefined && filterData.quarter !== "") {
        const moment = require("moment");

        const updatequarter = filterData?.quarter;
        const quarterStartDate = moment(updatequarter).startOf("quarter");
        const addinst = `${quarterStartDate.format(
          "ddd MMM DD YYYY"
        )} 00:00:00 GMT+0530 (India Standard Time)`;
        const FinalDate = moment(addinst).toDate();
        const oneYearLater = moment(FinalDate).add(1, "year").toDate();
        const fourMonthsAgo = moment(oneYearLater)
          .subtract(3, "months")
          .toDate();
        setStartDate(fourMonthsAgo);
      }
      if (filterData.executives === "-1") {
        const dataExActive = "<< Active SE >>";
        setselectedSE(dataExActive);
      } else if (filterData.executives === "-3") {
        const dataExInactive = "<< InActive SE >>";
        setselectedSE(dataExInactive);
      } else if (filterData.executives === "1") {
        const dataSelectSe = "<< Select SE >>";
        setselectedSE(dataSelectSe);
      } else if (filterData.executives === "-2") {
        const dataAllSe = "<< All SE >>";
        setselectedSE(dataAllSe);
      } else if (filterData?.executives?.length > 3) {
        const dataAllSe = "<< Select SE >>";
        setselectedSE(dataAllSe);
      }
    }
  }, [
    id,
    division,
    filterData.Divisions,
    filterData?.from,
    filterData?.duration,
    filterData.duedate,
    filterData.from,
  ]);

  // //------------------------methods----------------------------------

  const onFilterChange = ({ id, value }) => {
    setProgressDataPayload((prevState) => {
      return { ...prevState, [id]: value };
    });
    if (id === "executives" && value === "1") {
      setVisible(true);
    }
  };

  const getOwnerDivision = () => {
    axios
      .get(baseUrl + `/SalesMS/attainment/getOwnerDivision`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.owner_division,
              value: e.id,
            };
            countries.push(countryObj);
          });
        setDivision(countries);
        if (id == null) {
          setSelectdDivision(countries);
        }
      })
      .catch((error) => console.log(error));
  };

  const progressSearchValidator = () => {
    let payload = progressDataPayload;

    let filteredData = ref.current.filter((d) => d != null);
    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid == true) {
      setsearching(false);

      setErrorMsg(true);
    }
    if (valid) {
      return;
    }

    // setvisibleCol(!visibleCol);

    payload.executives === "0" ||
      (payload.executives === "1" &&
        (localStorage.getItem("selectedSELocal") === null ||
          localStorage.getItem("selectedSELocal") === undefined ||
          localStorage.getItem("selectedSELocal") === "[]"))
      ? setErrorMsg(true)
      : getProgressData(payload);
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day === 1;
  };
  useEffect(() => {
    if (id != null) {
      setTimeout(() => {
        progressSearchValidatorSavedSearch();
      }, 4000);
    }
  }, [filterData]);

  // -----------------------calls----------------------------------

  const getsalesExecutiveDropdown = () => {
    axios
      .get(baseUrl + "/SalesMS/MasterController/salesExecutiveData")
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data
          .filter((item) => item.isActive === 1)
          .map((item) => {
            return (
              <option key={item.id} value={item.val}>
                {item.lkupName}
              </option>
            );
          });
        setsalesExecutiveDropdown(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );
  const getProgressData = () => {
    let valid = GlobalValidation(ref);

    setTableFlag(false);
    let payload = null;
    payload = progressDataPayload;
    const loaderTime = setTimeout(() => {
      setsearching(true);
    }, 2000);
    abortController.current = new AbortController();

    setErrorMsg(false);
    payload["executives"] =
      payload.executives == "1" ? SelectSEData : payload.executives;
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/salesProgress/getSalesProgress`,
      data: payload,
      signal: abortController.current.signal,
    })
      .then((resp) => {
        const data = resp.data;
        setProgressData(data);
        clearTimeout(loaderTime);
        if (data.data.length > 0) {
          setTableFlag(true);
          setsearching(false);
          clearTimeout(loaderTime);
          !valid && setvisibleCol(!visibleCol);
          visibleCol
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //-------------Saved Search API--------------------

  const getProgressDataSavedSearch = () => {
    let valid = GlobalValidation(ref);

    setTableFlag(false);
    const payload = {
      executives: filterData?.executives,
      isActive: filterData?.isActive,
      isIndividual: filterData?.isIndividual,
      from: filterData?.from,
      duration: filterData?.duration,
      quarter: filterData?.quarter,
      selectExecs: filterData?.selectExecs,
      Divisions: filterData?.Divisions,
    };

    setsearching(true);

    abortController.current = new AbortController();
    setErrorMsg(false);
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/salesProgress/getSalesProgress`,
      data: payload,
      signal: abortController.current.signal,
    })
      .then((resp) => {
        const data = resp.data;
        setProgressData(data);
        if (data.data.length > 0) {
          setTableFlag(true);
          setsearching(false);

          !valid && setvisibleCol(!visibleCol);
          visibleCol
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const progressSearchValidatorSavedSearch = () => {
    const payload = {
      executives: filterData?.executives,
      isActive: filterData?.isActive,
      isIndividual: filterData?.isIndividual,
      from: filterData?.from,
      duration: filterData?.duration,
      quarter: filterData?.quarter,
      selectExecs: filterData?.selectExecs,
      Divisions: filterData?.Divisions,
    };

    let filteredData = ref.current.filter((d) => d != null);
    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid == true) {
      setsearching(false);

      setErrorMsg(true);
    }
    if (valid) {
      return;
    }

    // setvisibleCol(!visibleCol);

    payload.executives === "0" ||
      (payload.executives === "1" &&
        (localStorage.getItem("selectedSELocal") === null ||
          localStorage.getItem("selectedSELocal") === undefined ||
          localStorage.getItem("selectedSELocal") === "[]"))
      ? setErrorMsg(true)
      : getProgressDataSavedSearch(payload);
  };
  // -----------------------------useEffect---------------------------------

  useEffect(() => {
    getsalesExecutiveDropdown();
    getOwnerDivision();
  }, []);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
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

  const HelpPDFName = "Weekly Pipeline Progress.pdf";
  const Headername = "Weekly Pipeline Progress Help";
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Weekly Pipeline Progress</h2>
          </div>
          <div className="childThree toggleBtns">
            <div>
            <button
                className="searchFilterButton btn btn-primary"
                onClick={() => {
                  setvisibleCol(!visibleCol);
 
                  visibleCol
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                Search Filters
                <span className="serchFilterText">{cheveronIcon}</span>
              </button>
              <span className="saveBtn">
                <SavedSearchGlobal
                  setEditAddmsg={setEditAddmsg}
                  pageurl={pageurl}
                  page_Name={page_Name}
                  payload={progressDataPayload}
                />
              </span>
            </div>
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
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
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Search created successfully.
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="group customCard">
        <CCollapse visible={!visibleCol}>
          <div className="group-content row">
            <div className="col-md-3 col-sm-10 col-xs-12 seDiv" id="execSelDiv">
              <div className="form-group row">
                <label className="col-5">
                  Sales Executive
                  <span className="required error-text ml-1"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6 ">
                  <div>
                    {}{" "}
                    {accessData == 500 ||
                    accessData == 1000 ||
                    salesfullAccess == 920 ? (
                      <select
                        id="executives"
                        className="col-md-12 col-sm-12 col-xs-12 text"
                        value={selectedSEVal}
                        onChange={(e) => {
                          onFilterChange(e.target);
                          setSelectedSEVal(e.target.value);
                          setselectedSE(
                            e.target.options[e.target.selectedIndex].text
                          );
                        }}
                        ref={(ele) => {
                          ref.current[0] = ele;
                        }}
                      >
                        <option value="">{"<< Please select>> "}</option>
                        {salesExecutiveDropdown}
                      </select>
                    ) : (
                      <select
                        id="executives"
                        className="col-md-12 col-sm-12 col-xs-12 text"
                        value={selectedSEVal}
                        onChange={(e) => {
                          onFilterChange(e.target);
                          setSelectedSEVal(e.target.value);
                          setselectedSE(
                            e.target.options[e.target.selectedIndex].text
                          );
                        }}
                        ref={(ele) => {
                          ref.current[0] = ele;
                        }}
                      >
                        <option value="">{"<< Please select>> "}</option>
                        <option value="1">Select SE</option>
                      </select>
                    )}
                  </div>
                </span>
              </div>
            </div>

            <div className="col-md-3 col-sm-10 col-xs-12 seDiv">
              <div className="form-group row" id="week-picker-wrapper">
                <label className="col-5">
                  Start Week<span className="required error-text ml-1"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6" style={{ height: "23px" }}>
                  <DatePicker
                    className="from"
                    id="from"
                    selected={startDate2}
                    onChange={(e) => {
                      setProgressDataPayload((prev) => ({
                        ...prev,
                        ["from"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setStartDate2(e);
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    filterDate={filterMondays}
                    dateFormat="dd-MMM-yy"
                  />
                </span>
              </div>
            </div>

            <div className="col-md-3 col-sm-10 col-xs-12 seDiv">
              <div className="form-group row">
                <label className="col-5">
                  Duration<span className="required error-text ml-1"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6" style={{ height: "23px" }}>
                  <select
                    id="duration"
                    name="duration"
                    className="col-md-12 col-sm-12 col-xs-12 "
                    onChange={(e) => {
                      onFilterChange(e.target);
                    }}
                    value={progressDataPayload?.duration}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </span>
              </div>
            </div>

            <div className="col-md-3 col-sm-10 col-xs-12 seDiv">
              <div className="form-group row" id="week-picker-wrapper">
                <label className="col-5">
                  Quarter<span className="required error-text ml-1"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6" style={{ height: "23px" }}>
                  <DatePicker
                    selected={startDate}
                    onChange={(e) => {
                      let selectMonth = moment(e).format("MM");

                      let customMonth = null;
                      if (parseInt(selectMonth) == 1) {
                        customMonth = moment(e)
                          .subtract(1, "years")
                          .add(3, "months")
                          .format("yyyy-MM-DD");
                      } else if (parseInt(selectMonth) == 4) {
                        customMonth = moment(e)
                          .subtract(1, "years")
                          .add(3, "months")
                          .format("yyyy-MM-DD");
                      } else if (parseInt(selectMonth) == 7) {
                        customMonth = moment(e)
                          .subtract(1, "years")
                          .add(3, "months")
                          .format("yyyy-MM-DD");
                      } else if (parseInt(selectMonth) == 10) {
                        customMonth = moment(e)
                          .subtract(9, "months")
                          .format("yyyy-MM-DD");
                      }

                      setStartDate(moment(e)._d);
                      onFilterChange({
                        id: "quarter",
                        value: moment(customMonth).format("yyyy-MM-DD"),
                      });
                    }}
                    dateFormat="'FY' yyyy-QQQ"
                    showQuarterYearPicker
                  />
                </span>
              </div>
            </div>

            <div className="group-content row">
              <div
                className="col-md-3 col-sm-10 col-xs-12 seDiv"
                id="execSelDiv"
              >
                <div className="form-group row">
                  <label className="col-5">
                    {" "}
                    Sales Division{" "}
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">&nbsp;:</span>
                  <span
                    className="col-6 "
                    style={{ paddingLeft: "13px", paddingRight: "0px" }}
                  >
                    <div
                      className=" multiselect"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        valueRenderer={generateDropdownLabel}
                        id="Divisions"
                        options={division}
                        hasSelectAll={true}
                        value={SelectdDivision}
                        disabled={false}
                        overrideStrings={{
                          selectAllFiltered: "Select All",
                          selectSomeItems: "<<Please Select>>",
                        }}
                        onChange={(e) => {
                          setSelectdDivision(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setProgressDataPayload((prevVal) => ({
                            ...prevVal,
                            ["Divisions"]: filteredCountry.toString(),
                          }));
                        }}
                      />
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-12 no-padding section">
              <div className="seFooter" style={{ borderTop: "1px solid #CCC" }}>
                <span className="selectedSE">
                  <b>Selected SE : </b>
                  <span className="dynText">
                    {selectedSE === "<< Select SE >>"
                      ? localSE.map((item, index) => (
                          <span key={item.id}>
                            {isIndividualChecked
                              ? item.salesPersonName
                                ? item.salesPersonName
                                : item.text
                              : item.salesPersonName
                              ? item.salesPersonName
                              : item.text + ` & Team`}
                            {index === localSE.length - 1 ? "" : ", "}
                          </span>
                        ))
                      : selectedSE}
                  </span>
                </span>
              </div>
              <div className=" btn-container center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={progressSearchValidator}
                >
                  <FaSearch /> Search
                </button>
              </div>
            </div>
            {searching ? <Loader handleAbort={handleAbort} /> : ""}
          </div>
        </CCollapse>
      </div>
      <SelectSEDialogBox
        accessData={accessData}
        visible={visible}
        salesfullAccess={salesfullAccess}
        setVisible={setVisible}
        setGrpId={setGrpId}
      />
    </div>
  );
}
