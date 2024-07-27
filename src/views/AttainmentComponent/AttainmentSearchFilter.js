import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaInfoCircle,
  FaSearch,
} from "react-icons/fa";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import SelectSEDialogBox from "../SelectSE/SelectSEDialogBox";
import { CCollapse } from "@coreui/react";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import Loader from "../Loader/Loader";
import { useRef } from "react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { parseISO } from "date-fns";
import { useSelector } from "react-redux";

export default function AttainmentSearchFilter({
  setAttainmentData,
  setTableFlag,
  setDisplay,
}) {
  const HelpPDFName = "Revenue Attainment Metrics.pdf";
  const Headername = "Revenue Attainment Metrics Help";
  const [salesfullAccess, setSalesfullAccess] = useState([]);

  const baseUrl = environment.baseUrl;
  const localSE =
    localStorage.getItem("selectedSELocal") === null
      ? []
      : JSON.parse(localStorage.getItem("selectedSELocal"));
  const [filterData, setFilterData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const pageurl = "http://10.11.12.149:3000/#/pmo/salesAttainment";
  const page_Name = "Sales";
  const [editmsg, setEditAddmsg] = useState(false);
  // const isIndividualChecked = useSelector(
  //   (state) => state.selectedSEState.isIndividualChecked
  // );
  const isIndividualChecked =
    localStorage.getItem("isIndividualCheckedLocal") === null
      ? false
      : JSON.parse(localStorage.getItem("isIndividualCheckedLocal"));
  const FilterData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/FiltersData?saved_search_id=${
          id === null ? 0 : id
        }`,
    }).then(function (res) {
      const getData = res.data;
      setFilterData(getData);
    });
  };
  useEffect(() => {
    FilterData();
  }, []);

  const [searching, setsearching] = useState(false);

  console.log(searching, "searching");
  const [salesExecutiveDropdown, setsalesExecutiveDropdown] = useState([]);
  const [viewSelector, setViewSelector] = useState(-1);
  const [selectedSE, setselectedSE] = useState("<< All SE >>");
  const [selectedSEVal, setSelectedSEVal] = useState(-2);

  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [visibleCol, setvisibleCol] = useState(false);
  const [division, setDivision] = useState([]);
  const [SelectdDivision, setSelectdDivision] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);

  const ref = useRef([]);
  const [startDate, setStartDate] = useState(new Date());
  const abortController = useRef(null);
  const nextYearDate = moment(startDate).clone().add(1, "year").toDate();
  const year = moment(startDate).format("yyyy-MM-DD").split("-")[0];
  const month = 4;
  const dd = moment({ year, month: month - 1 })
    .startOf("month")
    .format("YYYY-MM-DD");

  const [stDate, setStDate] = useState(dd);

  const [attainmentDataPayload, setAttainmentDataPayload] = useState({
    // executives: -2,
    // isActive: "true",
    // isIndividual: "false",
    // from: stDate,
    // duration: "4",
    // showBy: "-1",
    // practices: "-1",
    // countries: "-1",
    // selectExecs: "",
    // Divisions: "-1",
  });
  useEffect(() => {
    setAttainmentDataPayload(() => {
      if (id != null) {
        return {
          executives: filterData?.executives,
          isActive: filterData?.isActive,
          isIndividual: filterData?.isIndividual,
          from: filterData?.from,
          duration: filterData?.duration,
          showBy: filterData?.showBy,
          practices: filterData?.practices,
          countries: filterData?.countries,
          selectExecs: filterData?.selectExecs,
          Divisions: filterData?.Divisions,
        };
      } else {
        return {
          executives: -2,
          isActive: "true",
          isIndividual: "false",
          from: stDate,
          duration: "4",
          showBy: "-1",
          practices: "-1",
          countries: "-1",
          selectExecs: "",
          Divisions: "-1",
        };
      }
    });
  }, [filterData]);

  useEffect(() => {
    if (id != null) {
      const updateDivisions = division.filter((values) =>
        attainmentDataPayload.Divisions?.includes(parseInt(values.value))
      );
      const progressDataDivisions = attainmentDataPayload.Divisions;

      const divisionsToFilter = progressDataDivisions
        ? progressDataDivisions.split(",").map(Number)
        : [];
      const updateDivisionsdata = updateDivisions.filter((values) =>
        divisionsToFilter.includes(values.value)
      );
      const updateselector = filterData.showBy;

      if (filterData?.from !== undefined && filterData.from !== "") {
        const updatedate = filterData.from;

        // setStartDate2(parseISO(updatedate));
        setStartDate(parseISO(updatedate));
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
      const sevalue = attainmentDataPayload.executives;
      if (filterData.executives?.length > 3) {
        setSelectedSEVal("1");
      } else {
        setSelectedSEVal(sevalue);
      }
      if (filterData?.Divisions == "-1") {
        setSelectdDivision(division);
      } else {
        setSelectdDivision(updateDivisionsdata);
      }
      setViewSelector(updateselector);
    }
  }, [id, division, attainmentDataPayload.Divisions, filterData?.Divisions]);

  useEffect(() => {
    if (id != null) {
      setTimeout(() => {
        getAttainmentDataSavedSearch();
      }, 2000);
    }
  }, [id, attainmentDataPayload]);
  useEffect(() => {
    getsalesExecutiveDropdown();
    // getSFOwnerDivisionsDropdown()
    getOwnerDivision();
  }, []);

  useEffect(() => {
    // let startEle = document.getElementById("startDate");
    // console.log("in line 64-----");
    // console.log(startDate);
    // console.log(startEle.value);
    // setTimeout(() => {
    //   startEle.value = "FY " + startEle.value;
    // }, 100);
    // console.log(startEle.value);
    // let subValue = ref.current[1].children[0].children[0].children[0];
    // // subValue.innerHTML = "FY " + subValue.value;
    // console.log(subValue.value);
    // subValue.value = "abhsdj"
    // let inputValue2 = document.querySelector(
    //   ".react-datepicker__input-container"
    // ).value;
    // document.getElementById("output").innerHTML =
    //   "Input Value 1: " + inputValue1 + " Input Value 2: " + inputValue2;
    // let a = document.getElementsByClassName(
    //   "react-datepicker__input-container"
    // )[0]?.children[0];
    // console.log(a);
    // a.value = "FY" + moment(startDate).format("yyyy");
    // console.log(a);
  }, [startDate]);

  //// -------breadcrumbs-----
  const loggedUserId = localStorage.getItem("resId");
  const seId = localStorage.getItem("seId");
  console.log(seId);

  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["Revenue Attainment Metrics"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
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
  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/pmo/salesAttainment";
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
          (subMenu) => subMenu.display_name === "Revenue Attainment Metrics"
        );
      setAccessData(projectStatusReportSubMenu.access_level);
    });
  };

  const getUrlPath = (modifiedUrlPath) => {
    console.log(modifiedUrlPath);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };
  //------------------------methods----------------------------------

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const DateChange = ({ id, value }) => {
    const year = moment(value).format("yyyy-MM-DD").split("-")[0];

    // const month = moment(new Date())
    //   .format("yyyy-MM-DD")

    //   .split("-")[1];
    const month = 4;
    const dd = moment({ year, month: month - 1 })
      .startOf("month")
      .format("YYYY-MM-DD");
    setStDate(dd);
    setAttainmentDataPayload((prevState) => {
      return { ...prevState, [id]: moment(dd).format("yyyy-MM-DD") };
    });
    if (id === "executives" && value === "1") {
      setVisible(true);
    }
  };
  const onFilterChange = ({ id, value }) => {
    if (id === "executives" && value === "1") {
      setVisible(true);
    }
    setAttainmentDataPayload((prevState) => {
      return { ...prevState, [id]: value };
    });
  };
  // const onChange1 = ({ id, value, eventPhase }) => {
  //   console.log(id + " " + value, " " + eventPhase);
  //   setAttainmentDataPayload((prevState) => {
  //     return { ...prevState, [id]: eventPhase };
  //   });
  //   if (id === "executives" && value === "1") {
  //     setVisible(true);
  //   }
  // };
  const [hirarchy, setHirarchy] = useState([]);
  const [accessData, setAccessData] = useState([]);

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

      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    hirarchyAccess();
  }, []);
  const attainmentSearchValidator = () => {
    setsearching(false);
    let valid = GlobalValidation(ref);

    // if (valid) {
    //   return;
    // }
    // !valid && setvisibleCol(!visibleCol);

    if (
      attainmentDataPayload.executives === "" ||
      attainmentDataPayload.Divisions === "" ||
      (attainmentDataPayload.executives === "1" &&
        (localStorage.getItem("selectedSELocal") === null ||
          localStorage.getItem("selectedSELocal") === undefined ||
          localStorage.getItem("selectedSELocal") === "[]"))
    ) {
      // let valid = GlobalValidation(ref);

      if (valid) {
        {
          setValidationMessage(true);
        }
        return;
      } else {
        setValidationMessage(false);
      }
    } else {
      getAttainmentData();
    }
  };

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
        setSelectdDivision(countries);
      })
      .catch((error) => console.log(error));
  };
  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );
  console.log(SelectSEData);
  const getAttainmentData = () => {
    let valid = GlobalValidation(ref);

    const loaderTime = setTimeout(() => {
      setsearching(true);
    }, 2000);

    abortController.current = new AbortController();

    setTableFlag(false);
    attainmentDataPayload.executives =
      attainmentDataPayload?.executives == "1"
        ? SelectSEData
        : attainmentDataPayload?.executives;
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/attainment/getAttainmentData`,
      data: attainmentDataPayload,
      signal: abortController.current.signal,
    })
      .then((resp) => {
        const data = resp.data;
        setsearching(false);
        clearTimeout(loaderTime);
        setAttainmentData(data);

        if (data.data.length > 0) {
          setTableFlag(true);
          setsearching(false);
        }
        !valid && setvisibleCol(!visibleCol);
        visibleCol
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setDisplay(viewSelector);
        setValidationMessage(false);
        setsearching(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // setAttainmentData(ReviewsData)
  };

  const getAttainmentDataSavedSearch = () => {
    let valid = GlobalValidation(ref);
    setsearching(true);
    abortController.current = new AbortController();

    setTableFlag(false);
    attainmentDataPayload.executives =
      attainmentDataPayload?.executives == "1"
        ? SelectSEData
        : attainmentDataPayload?.executives;
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/attainment/getAttainmentData`,
      data: attainmentDataPayload,
      signal: abortController.current.signal,
    })
      .then((resp) => {
        const data = resp.data;
        setsearching(false);

        setAttainmentData(data);

        if (data.data.length > 0) {
          setTableFlag(true);
          setsearching(false);
        }
        !valid && setvisibleCol(!visibleCol);
        visibleCol
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setDisplay(viewSelector);
        setValidationMessage(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // setAttainmentData(ReviewsData)
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };
  // -----------------------------useEffect---------------------------------

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
    <div>
      <div>
        {validationMessage ? (
          <div className="statusMsg error">
            {" "}
            <AiFillWarning /> Please select the valid values for highlighted
            fields{" "}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Revenue Attainment Metrics</h2>
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
            <span className="saveBtn">
              <SavedSearchGlobal
                className="btnAttainMent btnAttain"
                setEditAddmsg={setEditAddmsg}
                pageurl={pageurl}
                page_Name={page_Name}
                payload={attainmentDataPayload}
              />
            </span>
          </div>

          <GlobalHelp pdfname={HelpPDFName} name={Headername} />
        </div>
      </div>

      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Search created successfully.
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="group mb-3 customCard ">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visibleCol}>
          <div className="group-content row">
            <div className="col-4 mb-2" id="execSelDiv">
              <div className="form-group row">
                <label className="col-5">
                  Sales Executive <span className="error-text">&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6 textfield">
                  {accessData == 1000 ||
                  accessData == 500 ||
                  salesfullAccess == 920 ? (
                    <select
                      id="executives"
                      className="text"
                      value={selectedSEVal}
                      onChange={(e) => {
                        onFilterChange(e.target);

                        setSelectedSEVal(e.target.value);
                        setselectedSE(
                          e.target.options[e.target.selectedIndex].text
                        );
                        setAttainmentDataPayload((prevVal) => ({
                          ...prevVal,
                          ["executives"]: e.target.value,
                        }));
                      }}
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <option value={""}>{"<< Please select>> "}</option>
                      {salesExecutiveDropdown}
                    </select>
                  ) : (
                    <select
                      id="executives"
                      className="text"
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
                      <option value={""}>{"<< Please select>> "}</option>
                      <option value="1">Select SE</option>
                    </select>
                  )}
                </span>
              </div>
            </div>

            <div className="col-4 mb-2">
              <div className="form-group row" id="week-picker-wrapper">
                <label className="col-5">
                  Financial Year<span className="error-text">&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 datepickerAttainment ">
                  <div
                    className="datepicker attainTableDate after"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <DatePicker
                      id="startDate"
                      selected={nextYearDate}
                      onChange={(e) => {
                        setStartDate(e);
                        DateChange({
                          id: "from",
                          value: e.toLocaleDateString("en-CA"),
                        });
                      }}
                      dateFormat={"'FY' yyyy"}
                      showYearPicker
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-4 mb-2">
              <div className="form-group row">
                <label className="col-5">
                  Quarters<span className="error-text">&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 " style={{ height: "23px" }}>
                  <select
                    id="duration"
                    name="duration"
                    //className="col-md-12 col-sm-12 col-xs-12 "
                    selected="4"
                    onChange={(e) => {
                      onFilterChange(e.target);
                    }}
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                    value={attainmentDataPayload?.duration}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4" selected>
                      4
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-4 mb-2">
              <div className="form-group row">
                <label className="col-5">
                  Target Type{" "}
                  <FaInfoCircle
                    className="infoIcon"
                    title="For Services type only"
                  />
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6 ">
                  <select
                    id="showBy"
                    name="division"
                    // className="col-md-12 col-sm-12 col-xs-12 "
                    onChange={(e) => {
                      setViewSelector(e.target.value);
                      if (e.target.value == "country") {
                        setAttainmentDataPayload((prevState) => {
                          return { ...prevState, ["countries"]: "6" };
                        });
                      } else {
                        setAttainmentDataPayload((prevState) => {
                          return { ...prevState, ["countries"]: "-1" };
                        });
                      }
                      if (e.target.value == "practice") {
                        setAttainmentDataPayload((prevState) => {
                          return { ...prevState, ["practices"]: "1" };
                        });
                      } else {
                        setAttainmentDataPayload((prevState) => {
                          return { ...prevState, ["practices"]: "-1" };
                        });
                      }

                      onFilterChange(e.target);
                    }}
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                    value={attainmentDataPayload?.showBy}
                  >
                    <option id={1} value={"country"}>
                      {"Country"}
                    </option>
                    <option id={-1} value={"-1"}>
                      {"Organization"}
                    </option>
                    <option id={0} value={"practice"}>
                      {"Practice"}
                    </option>
                  </select>
                </span>
              </div>
            </div>
            <div className="col-4 mb-2">
              <div className="form-group row">
                <label className="col-5">
                  Sales Division<span className="error-text">&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="Divisions"
                    options={division}
                    hasSelectAll={true}
                    value={SelectdDivision}
                    disabled={false}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<< All>>",
                    }}
                    onChange={(e) => {
                      setSelectdDivision(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setAttainmentDataPayload((prevVal) => ({
                        ...prevVal,
                        ["Divisions"]: filteredCountry.toString(),
                      }));
                    }}
                    valueRenderer={generateDropdownLabel}
                  />
                </span>
              </div>
            </div>
            {viewSelector === "practice" && (
              <div className="col-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Practice</label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      id="practices"
                      name="practices"
                      // className="col-md-12 col-sm-12 col-xs-12 "
                      onChange={(e) => {
                        console.log(e.target);
                        const { value, id } = e.target;
                        setAttainmentDataPayload((prevState) => {
                          return { ...prevState, [id]: value };
                        });
                      }}
                      value={attainmentDataPayload?.practices}
                    >
                      <option value={1} id={1}>
                        {"DACS"}
                      </option>
                      <option value={3} id={3}>
                        {"IM&A"}
                      </option>
                      <option value={4} id={4}>
                        {"QA&TA"}
                      </option>
                      <option value={6} id={6}>
                        {"Prolifics Products"}
                      </option>
                      <option value={999} id={999}>
                        {"Others"}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {viewSelector === "country" && (
              <div className="col-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">Country</label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      id="countries"
                      name="countries"
                      // className="col-md-12 col-sm-12 col-xs-12 "
                      onChange={(e) => {
                        const { value, id } = e.target;
                        setAttainmentDataPayload((prevState) => {
                          return { ...prevState, [id]: value };
                        });
                      }}
                      value={attainmentDataPayload?.countries}
                    >
                      <option value="6">Canada</option>
                      <option value="5">Germany</option>
                      <option value="3">India</option>
                      <option value="8">Jordan</option>
                      <option value="4">Others</option>
                      <option value="7">UAE</option>
                      <option value="1">UK</option>
                      <option value="2">US</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="col-12 ">
              <div className="seFooter">
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
            </div>

            <div className="col-md-12 no-padding section"></div>

            <div className="col-md-12 col-sm-12 col-xs-12 my-2 search btn-container center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={attainmentSearchValidator}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
        {searching ? <Loader handleAbort={handleAbort} /> : ""}
      </div>

      <SelectSEDialogBox
        visible={visible}
        setVisible={setVisible}
        accessData={accessData}
        salesfullAccess={salesfullAccess}
      />
    </div>
  );
}
