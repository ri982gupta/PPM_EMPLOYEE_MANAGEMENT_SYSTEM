import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import { CCollapse } from "@coreui/react";
import SelectSEDialogBox from "../SelectSE/SelectSEDialogBox";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import Loader from "../Loader/Loader";
import { createContext, useContext } from "react";
import SelectSESalesDialogBox from "./SelectSESalesDialogBox";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { useLocation } from "react-router-dom";
import { BiCheck } from "react-icons/bi";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { useSelector } from "react-redux";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

export default function ReviewSearchFilters({
  setTargetReviewsData,
  setTableFlag,
}) {
  const [grpId, setGrpId] = useState([]);
  const [bulkids, SetBulkIds] = useState(true);
  const isIndividualChecked =
    localStorage.getItem("isIndividualCheckedLocal") === null
      ? false
      : JSON.parse(localStorage.getItem("isIndividualCheckedLocal"));
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
  const [accessData, setAccessData] = useState([]);

  const [dropDown, setDropDown] = useState([]);
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

  const loggedUserId = localStorage.getItem("resId");

  const [custData, setcustData] = useState([]);
  const [item, setItem] = useState([]);
  const [visible, setVisible] = useState(false);
  const [custVisible, setCustVisible] = useState(false);
  const [selectedSE, setselectedSE] = useState(" <<All SE >>");
  const [errorMsg, setErrorMsg] = useState(false);
  const baseUrl = environment.baseUrl;
  const [date, setDate] = useState(new Date());
  const handleChange = (date) => setDate(date);
  const [loader, setLoader] = useState(false);
  const [salesEx, setSalesEx] = useState(-2);
  console.log(accessData);
  const [salesfullAccess, setSalesfullAccess] = useState([]);

  const [salesExecutiveDropdown, setsalesExecutiveDropdown] = useState([]);
  const [selectesFOwnerDivison, setselectesFOwnerDivison] = useState([]);
  const [sFOwnerDivisionsDropdown, setSFOwnerDivisionsDropdown] = useState([]);
  const [searching, setsearching] = useState(false);
  const [selectedItems, setSelectedItems] = useState([{}]);
  const [visiblepopup, setVisiblepopup] = useState(false);
  const Customer = selectedItems?.map((d) => d?.id).toString();

  const ValueContext = createContext("SalesReviews");

  const value = useContext(ValueContext);

  const [customersValue, setCustomersValue] = useState("-1");

  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonPopup1, setButtonPopup1] = useState(false);

  const [runId, setRunId] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(date.getMonth() - 3);
    return date;
  });
  const [viewSelector, setViewSelector] = useState(true);
  const defaultDate = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    return firstDate.toLocaleDateString("en-CA");
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
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const ref = useRef([]);
  const abortController = useRef(null);

  const selectedEngCust = JSON?.parse(localStorage.getItem("selectedEngCust"))
    ?.map((d) => d.id)
    ?.toString();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const pageurl = "http://10.11.12.149:3000/#/pmo/targetReviews";
  const page_Name = "Sales";
  const [filterData, setFilterData] = useState([]);
  const [editmsg, setEditAddmsg] = useState(false);
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
  const [reviewsDataPayload, setReviewsDataPayload] = useState({
    from: moment(defaultDate()).format("yyyy-MM-DD"),
    executives: "-2",
    isActive: "true",
    isIndividual: "false",
    duration: "4",
    divisions: "105,110,109,103,2,1,104,99",
    viewby: "summary",
    customers: "-1" ? -1 : selectedEngCust,
    key: Date.now(),
  });

  useEffect(() => {
    setReviewsDataPayload(() => {
      if (id != null) {
        return {
          from: filterData.from,
          executives: filterData.executives,
          isActive: filterData.isActive,
          isIndividual: filterData.isIndividual,
          duration: filterData.duration,
          divisions: filterData.divisions,
          viewby: filterData.viewby,
          customers: filterData.customers,
          key: filterData.key,
        };
      } else {
        return {
          from: moment(defaultDate()).format("yyyy-MM-DD"),
          executives: "-2",
          isActive: "true",
          isIndividual: "false",
          duration: "4",
          divisions: "105,110,109,103,2,1,104,99",
          viewby: "summary",
          customers: "-1" ? -1 : selectedEngCust,
          key: Date.now(),
        };
      }
    });
  }, [filterData]);
  useEffect(() => {
    if (id != null) {
      const updatedValues = sFOwnerDivisionsDropdown.filter(
        (values) =>
          +reviewsDataPayload.divisions?.includes(parseInt(values.value))
      );

      const progressDataDivisions = reviewsDataPayload.divisions;
      const divisionsToFilter = progressDataDivisions
        ? progressDataDivisions.split(",").map(Number)
        : [];

      const updateDivisionsdata = updatedValues.filter((values) =>
        divisionsToFilter.includes(values.value)
      );
      if (filterData.from !== undefined && filterData.from !== "") {
        const updatequarter = new Date(filterData.from);
        updatequarter.setMonth(updatequarter.getMonth() - 3);
        updatequarter.setFullYear(updatequarter.getFullYear() + 1);
        setStartDate(updatequarter);
      }
      const updateSE =
        reviewsDataPayload.executives == "-2"
          ? "<< ALL SE >>"
          : reviewsDataPayload.executives == "-1"
          ? "<< Active SE>>"
          : reviewsDataPayload.executives == "-3"
          ? "<< InActive SE >>"
          : " << Please select>>";
      setselectedSE(updateSE);
      setselectesFOwnerDivison(updateDivisionsdata);
    }
  }, [
    id,
    reviewsDataPayload.divisions,
    sFOwnerDivisionsDropdown,
    filterData.from,
  ]);
  useEffect(() => {
    if (id != null) {
      setTimeout(() => {
        reviewSearchValidator();
      }, 3000);
    }
  }, [id, reviewsDataPayload.divisions, sFOwnerDivisionsDropdown]);

  useEffect(() => {}, [item], [Customer], [reviewsDataPayload.serarchVals]);

  //------------------------methods----------------------------------

  const onFilterChange = ({ id, value }) => {
    setReviewsDataPayload((prevState) => {
      return { ...prevState, [id]: value };
    });
    if (id === "executives" && value === "1") {
      setVisiblepopup(true);
    }
  };

  const reviewSearchValidator = () => {
    setLoader(false);
    let filteredData = ref.current.filter((d) => d != null);
    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid == true) {
      setLoader(false);
      setsearching(false);
      setErrorMsg(true);
    }
    if (valid) {
      return;
    }
    setTimeout(() => {
      setLoader(false);
    }, 5000);
    reviewsDataPayload.executives === "0" ||
    (reviewsDataPayload.executives === "1" &&
      (localStorage.getItem("selectedSELocal") === null ||
        localStorage.getItem("selectedSELocal") === undefined ||
        localStorage.getItem("selectedSELocal") === "[]")) ||
    (reviewsDataPayload.customers === "1" &&
      (localStorage.getItem("selectedEngCust") === null ||
        localStorage.getItem("selectedEngCust") === undefined ||
        localStorage.getItem("selectedEngCust") === "[]"))
      ? setErrorMsg(true)
      : getTargetReviewsData();
  };

  // -----------------------calls----------------------------------
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

  const getSFOwnerDivisionsDropdown = () => {
    axios
      .get(baseUrl + `/SalesMS/MasterController/SFOwnerDivisions`)
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          return {
            value: item.id,
            label: item.owner_Division,
          };
        });
        setSFOwnerDivisionsDropdown(dropdownOptions);
        if (id == null) {
          setselectesFOwnerDivison(dropdownOptions);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );
  console.log(SelectSEData);
  const getTargetReviewsData = () => {
    let valid = GlobalValidation(ref);

    setsearching(true);
    setTableFlag(false);
    setErrorMsg(false);
    let SelectSEData1 = SelectSEData.slice(0, -1);
    reviewsDataPayload["executives"] =
      reviewsDataPayload.executives == "1"
        ? SelectSEData1
        : reviewsDataPayload.executives;
    reviewsDataPayload.customers === "1"
      ? (reviewsDataPayload.customers = String(
          JSON.parse(localStorage.getItem("selectedEngCust")).map((item) => {
            return item.id;
          })
        ))
      : "";

    reviewsDataPayload["from"] = moment(reviewsDataPayload["from"]).format(
      "yyyy-MM-DD"
    );
    reviewsDataPayload["customers"] =
      customersValue != "-1" && buttonPopup1 ? selectedEngCust : customersValue;

    abortController.current = new AbortController();

    Object.keys(reviewsDataPayload).forEach((d) => {
      delete reviewsDataPayload[""];
    });
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/reviews/getReviewData`,
      data: reviewsDataPayload,
      signal: abortController.current.signal,
    })
      .then((resp) => {
        const data = resp.data;
        setTargetReviewsData(data);
        if (data.serviceTargets?.length > 0) {
          setTableFlag(true);
          setsearching(false);
          setLoader(false);
          clearTimeout(loaderTime);

          !valid && setVisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log();
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const [hirarchy, setHirarchy] = useState([]);

  const hirarchyAccess = () => {
    axios

      .get(
        baseUrl +
          `/ProjectMS/project/getHirarchyAccesss?loggedUserId=${loggedUserId}`
      )

      .then((resp) => {
        const data = resp.data;
        console.log(data);
        setHirarchy(data);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  //// -------breadcrumbs-----

  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["Target Reviews"];
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
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/pmo/targetReviews";
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
        .subMenus.find((subMenu) => subMenu.display_name === "Reviews");
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
  useEffect(() => {
    hirarchyAccess();
  }, []);
  // -----------------------------useEffect---------------------------------

  useEffect(() => {
    getsalesExecutiveDropdown();
    getSFOwnerDivisionsDropdown();
  }, []);

  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    if (id === "customers") {
      if (value === "select") {
        setCustVisible(true);
        setCustomersValue("select");
      } else {
        setCustomersValue("-1");
      }
    }
    setcustData();
    setReviewsDataPayload((prev) => {
      return { ...reviewsDataPayload, [name]: value };
    });
  };
  const HelpPDFName = "Target Reviews.pdf";
  const Headername = "Target Reviews Help";
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
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Target Reviews</h2>
          </div>
          <div className="childThree toggleBtns">
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
        <CCollapse visible={!visible}>
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
                    {accessData == 1000 ||
                    accessData == 500 ||
                    salesfullAccess == 920 ? (
                      <select
                        id="executives"
                        className="col-md-12 col-sm-12 col-xs-12 text"
                        value={dropDown}
                        onChange={(e) => {
                          onFilterChange(e.target);
                          setselectedSE(
                            e.target.options[e.target.selectedIndex].text
                          );
                          setSalesEx(e.target.value);
                          setDropDown(e.target.value);
                        }}
                        ref={(ele) => {
                          ref.current[0] = ele;
                        }}
                      >
                        {/* <option value="">{"<< Please select>> "}</option> */}
                        {salesExecutiveDropdown}
                      </select>
                    ) : (
                      <select
                        id="executives"
                        className="col-md-12 col-sm-12 col-xs-12 text"
                        value={dropDown}
                        onChange={(e) => {
                          onFilterChange(e.target);
                          setselectedSE(
                            e.target.options[e.target.selectedIndex].text
                          );
                          setSalesEx(e.target.value);
                          setDropDown(e.target.value);
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
                  From Quarter
                  <span className="required error-text ml-1"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6" style={{ height: "23px" }}>
                  <DatePicker
                    selected={startDate}
                    onChange={(e) => {
                      setStartDate(e);
                      const date = new Date(e.getTime());
                      date.setFullYear(date.getFullYear() - 1);
                      date.setMonth(date.getMonth() + 3);
                      onFilterChange({
                        id: "from",
                        value: date.toLocaleDateString("en-CA"),
                      });
                    }}
                    dateFormat="yyyy-QQQ"
                    showQuarterYearPicker
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
                    value={reviewsDataPayload.duration}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4" selected>
                      4
                    </option>
                  </select>
                </span>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="csl">
                  Sales Division&nbsp;
                  <span className="error-text">*</span>{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      options={sFOwnerDivisionsDropdown}
                      hasSelectAll={true}
                      isLoading={false}
                      disableSearch={false}
                      value={selectesFOwnerDivison}
                      disabled={false}
                      onChange={(s) => {
                        setselectesFOwnerDivison(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "divisions",
                          value: selected.toString(),
                        });
                      }}
                      valueRenderer={generateDropdownLabel}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-2 " id="execSelDiv">
              <div className="clearfix" style={{ height: "10px" }}></div>
              <div className="form-group row">
                <label className="col-5">
                  Customer<span className="required error-text ml-1"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6" style={{ height: "23px" }}>
                  <select
                    id="customers"
                    className="col-md-12 col-sm-12 col-xs-12  onLoadEmpty"
                    onChange={(e) => {
                      handleChange1(e);
                    }}
                  >
                    {selectedItems?.length + "selected"}
                    <option value={-1}>{"<< All >> "}</option>
                    <option value="select">Select</option>
                  </select>
                </span>
              </div>
            </div>
            {viewSelector && (
              <div className="col-md-12 no-padding section">
                <div
                  className="seFooter"
                  style={{
                    borderTop: "1px solid #CCC",
                    marginTop: "0px",
                    marginBottom: "15px",
                  }}
                >
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
            )}
            <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center Search">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={reviewSearchValidator}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
        {loader ? <Loader handleAbort={handleAbort} /> : ""}
        <SelectSESalesDialogBox
          visible={custVisible}
          setVisible={setCustVisible}
          value={value}
          buttonPopup1={buttonPopup1}
          setButtonPopup1={setButtonPopup1}
        />
        <SelectSEDialogBox
          visible={visiblepopup}
          setGrpId={setGrpId}
          salesfullAccess={salesfullAccess}
          accessData={accessData}
          setVisible={setVisiblepopup}
        />
      </div>
    </div>
  );
}
