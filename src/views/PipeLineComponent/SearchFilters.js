import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import {
  FaSearch,
  FaCaretDown,
  FaChevronCircleUp,
  FaChevronCircleDown,
} from "react-icons/fa";
import { environment } from "../../environments/environment";
import SelectSEDialogBox from "../SelectSE/SelectSEDialogBox";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import moment from "moment";
import Loader from "../Loader/Loader";
import { CCollapse } from "@coreui/react";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { useLocation } from "react-router-dom";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { useDispatch } from "react-redux";
import {
  setReportRunIdRedux,
  updatedSalesExectiveId,
} from "../../reducers/SelectedSEReducer";
import { useSelector } from "react-redux";
import { a } from "@react-spring/web";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";

let postdata = {
  executives: "",
  from: "",
  duration: "",
  viewby: "se",
  cslIds: "",
  Divisions: "",
};

export default function SearchFilters({
  setpipeLineTrendingData,
  setreportRunId,
  setmonthlyResourceData,
  monthlyResourceData,
  popDate,
  refresh,
  setRefresh,
  setPopDate,
  pipelinePermission,
  setProgressReportData,
  progressReportData,
  setExecId,
  execId,
  typeSelector,
}) {
  const [salesData, setSalesData] = useState([]);
  const [dataAccess, setDataAccess] = useState([]);
  const [count, setCount] = useState(0);
  const [grpId, setGrpId] = useState([]);
  const [bulkids, SetBulkIds] = useState(true);
  const [selectedSEVal, setSelectedSEVal] = useState(-2);
  const [loader, setLoader] = useState(false);
  const [salesEx, setSalesEx] = useState("-2");
  const dispatch = useDispatch();
  const [salesfullAccess, setSalesfullAccess] = useState([]);

  const [accessData, setAccessData] = useState([]);

  const localSE =
    localStorage.getItem("selectedSELocal") === null
      ? []
      : JSON.parse(localStorage.getItem("selectedSELocal"));
  const isIndividualChecked =
    localStorage.getItem("isIndividualCheckedLocal") === null
      ? false
      : JSON.parse(localStorage.getItem("isIndividualCheckedLocal"));
  const data = JSON.parse(localStorage.getItem("selectedSELocal"));

  const [hirarchy, setHirarchy] = useState([]);
  const isSalesPresentThenId = localSE.findIndex((obj) => obj.key);
  const [salesexecutiveid, setsalesExecutiveId] = useState("");
  const [Salesexecutivename, setsalesExecutiveName] = useState("");
  // const [salesindividualid, setSalesIndividualId] = useState(0);
  const [salesindividualName, setSalesIndividualName] = useState("");
  useEffect(() => {
    if (isSalesPresentThenId !== -1) {
      const salesId = localSE[isSalesPresentThenId].id;
      const salespersonname = localSE[isSalesPresentThenId].text + ` & Team`;
      if (salesEx == 1) {
        setsalesExecutiveName(salespersonname);
        setsalesExecutiveId(salesId);
      }
    }
  }, [isSalesPresentThenId, salesEx]); // Run this effect only when isSalesPresentThenId changes

  useEffect(() => {
    dispatch(updatedSalesExectiveId(salesEx));
  }, [salesEx]);
  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
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

  useEffect(() => {}, [count]);
  const [salesData1, setSalesData1] = useState([]);
  const s1 = () => {
    return 123;
  };
  const transformedData = transformObjects(data);
  // const unique2 = transformedData.filter((obj, index) => {
  //   return (
  //     index === arr2.findIndex((o) => obj.id === o.id && obj.salesPersonName === o.name)
  //   );
  // });
  // console.log(unique2);
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

  // Flatten the array if grpid is an array of arrays
  const flattenedIds = updatedIds.flat();

  const salesPersonNames =
    // filteredData.map((item) => item.salesPersonName);
    filteredData.map((item) => {
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

  var s2 = s1();

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

  const seData = () => {
    let data = JSON.parse(localStorage.getItem("selectedSELocal"));
    let custom = [];
    let daata = [];
    data?.forEach((e) => {
      let cslObj = {
        label: e.id,
      };
      custom.push(cslObj);
      daata.push(e.id);
    });
    setSalesData(custom);
    setSalesData1(daata);
  };

  const idStrings = data?.map((item) => String(item.id));
  const idString = idStrings?.join(",");

  const baseUrl = environment.baseUrl;
  const [searching, setsearching] = useState(false);
  const [durations, setDurations] = useState(6);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [visible, setVisible] = useState(false);
  const [visibleC, setVisibleC] = useState(false);
  const [csl, setCsl] = useState([]);
  const [viewData, setViewData] = useState("se");

  const abortController = useRef(null);
  const [dates, setDates] = useState([]);
  const controller = new AbortController();
  // const [formData, setFormData] = useState([]);
  const initialvalue = {
    // indTypes: "",
    month: "",
    Duration: "",
  };
  const [formData, setFormData] = useState(initialvalue);
  const [date, setDate] = useState(() => {
    const date1 = new Date();
    const year = date1.getFullYear();
    const month = date1.getMonth() - 5;
    return new Date(year, month, 1);
  });
  const ref = useRef([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [searchdata, setSearchdata] = useState(-1);

  const handleChangeDate = (date1) => setDate(date1);
  const [salesindividualid, setSalesIndividualId] = useState(0);

  const [ddivision, setDdivisions] = useState([]);
  const [selectdDivision, setSelectdDivision] = useState([]);
  const [viewSelector, setViewSelector] = useState(true);
  const [attainmentDataPayload, setAttainmentDataPayload] = useState(-1);
  const [salesExecutiveDropdown, setsalesExecutiveDropdown] = useState([]);
  const [cslMultiselectDropdown, setcslMultiselectDropdown] = useState([]);
  const [selectedCSL, setselectedCSL] = useState([]);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [month, setMonth] = useState(moment(moment().subtract(5, "months"))._d);
  const [months, setMonths] = useState(
    moment(moment(dates).format("yyyy-mm-dd"))
  );

  const [datePick, setDatePick] = useState("2023-05-01");
  const loggedUserId = localStorage.getItem("resId");

  const getAbsoluteMonths = (momentDate) => {
    let mont = Number(moment(momentDate).format("MM"));
    let yea = Number(moment(momentDate).format("YYYY"));
    return mont + yea * 12;
  };
  const [duration, setDuration] = useState();
  var maxDate = new Date();
  var year = maxDate.getFullYear();
  var month1 = maxDate.getMonth();
  var minDate = new Date(month1);
  var maxDate = new Date(year, month1 + 11);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const pageurl = "http://10.11.12.149:3000/#/pmo/mSalesProgress";
  const page_Name = "Sales";
  const [editmsg, setEditAddmsg] = useState(false);

  const [filterData, setFilterData] = useState([]);

  //// -------breadcrumbs-----

  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["Pipeline Trending"];
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
      const modifiedUrlPath = "/pmo/mSalesProgress";
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
          (subMenu) => subMenu.display_name === "Pipeline Trending"
        );
      setAccessData(projectStatusReportSubMenu.access_level);
      const accessLevel = projectStatusReportSubMenu
        ?projectStatusReportSubMenu.userRoles.includes("919")
          ? 919
          : projectStatusReportSubMenu.userRoles.includes("690") &&
          projectStatusReportSubMenu.userRoles.includes("641")
          ? 600
          : projectStatusReportSubMenu.userRoles.includes("690")
          ? 690
          : projectStatusReportSubMenu.userRoles.includes("641")
          ? 641
          : projectStatusReportSubMenu.userRoles.includes("932")
          ? 932
          : projectStatusReportSubMenu.userRoles.includes("46")
          ? 46
          : projectStatusReportSubMenu.userRoles.includes("126")
          ? 126
          :  projectStatusReportSubMenu.userRoles.includes("686")
          ? 686
          : projectStatusReportSubMenu.userRoles.includes("930")
          ? 930
          : projectStatusReportSubMenu.userRoles.includes("307") && 307
        : null;
      setDataAccess(accessLevel);
      setsummaryDatagetPayload({
        ...summaryDatagetPayload,

        executives:
          accessLevel == 690 ||
          accessLevel == 641 ||
          accessLevel == 690 ||
          accessLevel == 930
            ? ""
            : -2,
      });
      if (accessLevel == 600 || accessLevel == 641) {
        // const loggedUser = loggedUserId;
        axios({
          method: "get",
          url:
            baseUrl +
            `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`,
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
      } else {
        // const loggedUser = loggedUserId;
        axios({
          method: "get",
          url:
            baseUrl +
            `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`,
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
      }
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

  const FilterData = () => {
    // console.log(e?.id + "in  line 876..");
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

  const formattedFromDate = moment(filterData.from).format(
    "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)"
  );
  // useEffect(() => {
  //   setMonth(() => {
  //     console.log(filterData?.from);
  //     if (id != null) {
  //       return {
  //         from: formattedFromDate,
  //       };
  //     } else {
  //       return {
  //         from: month,
  //       };
  //     }
  //   });
  // }, [filterData]);
  const [summaryDatagetPayload, setsummaryDatagetPayload] = useState({
    executives: "",
    from: month,
    duration: durations,
    viewby: "se",
    cslIds: searchdata,
    Divisions: attainmentDataPayload,
  });

  useEffect(() => {
    setsummaryDatagetPayload(() => {
      if (id != null) {
        return {
          executives: filterData.executives,
          from: filterData.from,
          duration: filterData.duration,
          viewby: filterData.viewby,
          cslIds: filterData.cslIds,
          Divisions: filterData.Divisions,
        };
      } else {
        return {
          executives: -2,
          from: month,
          duration: durations,
          viewby: "se",
          cslIds: searchdata,
          Divisions: attainmentDataPayload,
        };
      }
    });
  }, [filterData]);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  const [errorMsg, setErrorMsg] = useState(false);
  const [selectedSE, setselectedSE] = useState("<< All SE >>");

  const divisions = [
    { value: "1", label: "Germany" },
    { value: "2", label: "North America" },
    { value: "3", label: "Others" },
    { value: "4", label: "UK" },
    { value: "5", label: "UK Testing" },
    { value: "6", label: "Un Assigned" },
  ];
  const [selectedDivisions, setSelectedDivisions] = useState(divisions);
  const [division, setDiviosions] = useState(-1);
  //------------------------methods----------------------------------

  const onFilterChange = ({ id, value }) => {
    setsummaryDatagetPayload((prevState) => {
      return { ...prevState, [id]: value };
    });
    if (id === "executives" && value == "1") {
      setVisible(true);
    }
  };

  // const handleCsl = () => {
  //   // const loggedUser = loggedUserId;
  //   axios({
  //     method: "get",
  //     url:
  //       baseUrl +
  //       `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`,
  //   }).then((res) => {
  //     let custom = [];
  //     let data = res.data;
  //     data.length > 0 &&
  //       data.forEach((e) => {
  //         let cslObj = {
  //           label: e.PersonName,
  //           value: e.id,
  //         };
  //         custom.push(cslObj);
  //       });
  //     setCsl(custom);
  //     setSelectedCsl(custom);
  //   });
  // };
  const calculateDuration = (e) => {
    let startMonths = getAbsoluteMonths(e);
    let endMonths = getAbsoluteMonths(moment());
    let monthDifference = endMonths - startMonths;
    monthDifference += 1;
    let dr = [];
    // for (let i = 1; i <= monthDifference; i++) {
    //   dr.push(i);
    // }
    for (let i = 1; i <= monthDifference; i++) {
      i < 13 && dr.push(i);
    }
    setDuration(dr);
  };

  useEffect(() => {
    calculateDuration(month);
    // handleCsl();
    seData();
  }, []);
  let payload = {
    // executives: salesEx == 1 ? salesindividualid : salesEx,
    executives: salesEx == 1 ? SelectSEData : salesEx,
    from: datePick,
    duration: durations,
    viewby: viewData,
    cslIds:
      dataAccess == 641 || dataAccess == 600
        ? Number(loggedUserId) + 1
        : searchdata,
    divisions: attainmentDataPayload == "" ? -1 : attainmentDataPayload,
  };
  const pipelineTrendingSearchValidator = () => {
    // setShowDetails(false);
    // let payload = viewDataPayload;
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid == true) {
      setsearching(false);
      setErrorMsg(true);
    }

    if (valid) {
      // setValidator(true);
      setErrorMsg(true);
      return;
    }

    if (payload.viewby == "se") {
      payload.executives == "" ||
      (payload.executives == "1" &&
        (localStorage.getItem("selectedSELocal") == null ||
          localStorage.getItem("selectedSELocal") == undefined ||
          localStorage.getItem("selectedSELocal") == "[]"))
        ? setErrorMsg(true)
        : !valid && setVisibleC(!visibleC);
      getpipeLineTrendingData();
      setmonthlyResourceData();
      setProgressReportData("");
      typeSelector = "";
    } else if (payload.viewby == "csl") {
      payload.cslIds.length == 0
        ? setErrorMsg(true)
        : !valid && setVisibleC(!visibleC);
      getpipeLineTrendingData();
      setmonthlyResourceData();
      setProgressReportData("");
      typeSelector = "";
    }
  };

  // -----------------------calls----------------------------------

  const getsalesExecutiveDropdown = () => {
    axios
      .get(baseUrl + "/SalesMS/MasterController/salesExecutiveData")
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data
          .filter((item) => item.isActive == 1)
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

  const getcslMultiselectDropdown = () => {
    // const loggedUser = "19042";
    axios
      .get(
        baseUrl +
          `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`
      )
      .then((resp) => {
        const data = resp.data;
        const dropdownOptions = data.map((item) => {
          return (obj = {
            value: item.id,
            label: item.PersonName,
          });
          // return obj;
        });
        setcslMultiselectDropdown(dropdownOptions);
        setselectedCSL(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getpipeLineTrendingData = () => {
    let filterData = ref.current.filter((d) => d != null);
    ref.current = filterData;
    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidationMessage(true);
        setErrorMsg(true);
      }
      return;
    }
    // !valid && setVisibleC(!visibleC);

    // setValidationMessage(false)

    abortController.current = new AbortController();

    setValidationMessage(false);

    // setvalid(true);
    setErrorMsg(false);
    summaryDatagetPayload.executives == "1"
      ? (summaryDatagetPayload.executives = String(
          JSON.parse(localStorage.getItem("selectedSELocal")).map((item) => {
            return item.id;
          })
        ))
      : "";
    const loaderTime = setTimeout(() => {
      setsearching(true);
    }, 2000);
    axios({
      signal: controller.signal,
      method: "post",
      url: baseUrl + `/SalesMS/pipeLineTrending/pipeLineTrendingData`,
      data: payload,
      signal: abortController.current.signal,
    })
      .then((resp) => {
        const data = resp.data.data;
        // const array = resp.data.data.split(",");
        const array = resp.data.columnNames.split(",");
        const newArray = data.map((item) => {
          let k = JSON.parse(JSON.stringify(item, array, 4));
          return k;
        });
        setpipeLineTrendingData(newArray);
        setreportRunId(resp.data.reportRunId);
        setsearching(false);
        clearTimeout(loaderTime);
        !valid && setVisibleC(!visibleC);
        visibleC
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        // setsearching(true);
        //   setLoader(true)
        //   setTimeout(() => {
        //     setLoader(false)
        //   }, 400);
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
        setDdivisions(countries);
        setSelectdDivision(countries);
      })
      .catch((error) => console.log(error));
  };
  // -----------------------------useEffect---------------------------------

  useEffect(() => {
    getsalesExecutiveDropdown();
    getcslMultiselectDropdown();
    getOwnerDivision();
  }, []);
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const commaSeparatedNames = salesPersonNames.join(",");
  const salesPersonNamesBulk =
    // filteredData.map((item) => item.salesPersonName);
    filteredData.map((item) => {
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

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const HelpPDFName = "PipelineTrending.pdf";
  const Headername = "Pipeline Trending Help";
  return (
    <div>
      <div class="col-md-12">
        <div class="pageTitle">
          <div class="childOne"></div>
          <div class="childTwo">
            <h2>Pipeline Trending</h2>
          </div>
          <div className="childThree toggleBtns">
          <button
                className="searchFilterButton btn btn-primary"
                onClick={() => {
                  setVisibleC(!visibleC);
 
                  visibleC
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
      <div className="group mb-3 customCard">
        <CCollapse visible={!visibleC}>
          <div className="group-content row">
            <div className="col-md-3 mb-2">
              <div className="clearfix" style={{ height: "10px" }}></div>
              <div className="form-group row">
                <label className="col-5">View By</label>
                <span className="col-1 p-0">:</span>
                <span className="col-6">
                  <select
                    id="viewby"
                    className="col-md-12 col-sm-12 col-xs-12  onLoadEmpty"
                    // defaultValue={"se"}
                    // value={summaryDatagetPayload.viewby}
                    onChange={(e) => {
                      e.target.value === "csl"
                        ? setViewSelector(false)
                        : setViewSelector(true);
                      // onFilterChange(e.target);
                      setViewData(e.target.value);
                      // postdata.executives = e.target.value;
                    }}
                  >
                    <option value="se">Executive</option>
                    <option value="csl">CSL</option>
                  </select>
                </span>
              </div>
            </div>

            {viewSelector && viewData == "se" ? (
              <div className="col-md-3 mb-2" id="execSelDiv">
                <div className="clearfix" style={{ height: "10px" }}></div>
                <div className="form-group row">
                  <label className="col-5">
                    Sales Executive <span style={{ color: "red" }}>*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span span className="col-6 " style={{ height: "23px" }}>
                    {accessData == 1000 ||
                    accessData == 500 ||
                    salesfullAccess == 920 ? (
                      <select
                        ref={(ele) => {
                          ref.current[viewData == "se" ? 0 : ""] = ele;
                        }}
                        id="executives"
                        className="text"
                        value={selectedSEVal}
                        onChange={(e) => {
                          onFilterChange(e.target);
                          setSelectedSEVal(e.target.value);

                          setselectedSE(
                            e.target.options[e.target.selectedIndex].text
                          );
                          setSalesEx(e.target.value);
                        }}
                      >
                        <option value="">{"<<Please select >>"}</option>
                        {salesExecutiveDropdown}
                      </select>
                    ) : (
                      <select
                        ref={(ele) => {
                          ref.current[viewData == "se" ? 0 : ""] = ele;
                        }}
                        id="executives"
                        className="text"
                        value={selectedSEVal}
                        onChange={(e) => {
                          onFilterChange(e.target);
                          setSelectedSEVal(e.target.value);

                          setselectedSE(
                            e.target.options[e.target.selectedIndex].text
                          );
                          setSalesEx(e.target.value);
                        }}
                      >
                        <option value="null">{"<< Please select>> "}</option>
                        <option value="1">Select SE</option>
                      </select>
                    )}
                  </span>
                </div>
              </div>
            ) : (
              ""
            )}

            {!viewSelector && (
              <div className="col-md-3 mb-2" id="CSLDiv">
                <div className="clearfix" style={{ height: "10px" }}></div>
                <div className="form-group row">
                  <label className="col-4">
                    CSL <span style={{ color: "red" }}>*</span>
                  </label>
                  <span className="col-1 p-0 ">:</span>
                  <div className="col-6">
                    <div
                      style={{ height: "23px" }}
                      className="multiselect"
                      ref={(ele) => {
                        ref.current[viewData == "csl" ? 0 : ""] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="cslRes"
                        name="cslRes"
                        options={csl}
                        hasSelectAll={true}
                        value={selectedCsl}
                        shouldToggleOnHover={false}
                        valueRenderer={generateDropdownLabel}
                        disableSearch={false}
                        selected={selectedCsl}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedCsl(e);
                          let filteredCsl = [];
                          e.forEach((d) => {
                            filteredCsl.push(d.value);
                          });

                          setSearchdata(filteredCsl.toString(), "xxx");

                          // setSearchdata((prevVal) => ({
                          //   ...prevVal,
                          //   ["skillGroup"]: filteredCsl.toString(),
                          // }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="col-md-3 mb-2">
              <div className="clearfix" style={{ height: "10px" }}></div>
              <div className="form-group row" id="week-picker-wrapper">
                <label className="col-5">
                  Month <span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    name="month"
                    id="StartDt"
                    // value={month}
                    minDate={minDate}
                    selected={month}
                    onChange={(e) => {
                      const selectedDate = new Date(e);
                      setCount((prev) => prev + 1);

                      setDatePick(moment(selectedDate).format("yyyy-MM-DD"));
                      setPopDate(moment(selectedDate).format("yyyy-MM-DD"));
                      setDates(moment(e).format("yyyy-MM-DD"));
                      calculateDuration(e);
                      setFormData((prev) => ({
                        ...prev,
                        month: moment(e).format("yyyy-MM-DD"),
                      }));
                      setMonth(e);
                      setMonths(e);
                    }}
                    dateFormat="MMM-yyyy"
                    maxDate={new Date()}
                    // onKeyDown={(e) => {
                    //   e.preventDefault();
                    // }}
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-2">
              <div className="clearfix" style={{ height: "10px" }}></div>
              <div className="form-group row">
                <label className="col-5">
                  Duration <span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    // selected="6"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                    className="text"
                    id="Duration"
                    // defaultValue="6"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });

                      setDurations(e.target.value);
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {duration?.map((d) => (
                      <option selected={count == 0 ? true : false} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="clearfix" style={{ height: "10px" }}></div>
              <div className="form-group row">
                <label className="col-5">Sales Division</label>
                <span className="col-1 p-0">:</span>
                <span className="col-6" style={{ height: "23px" }}>
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="Divisions"
                      options={ddivision}
                      hasSelectAll={true}
                      value={selectdDivision}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(e) => {
                        setSelectdDivision(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        // setAttainmentDataPayload((prevVal) => ({
                        //   ...prevVal,
                        //   ["Divisions"]: filteredCountry.toString(),
                        // }));
                        setAttainmentDataPayload(
                          filteredCountry.toString(),
                          "xxx"
                        );
                      }}
                    />
                  </div>
                </span>
              </div>
            </div>

            {viewSelector && (
              <div className="col-md-12 no-padding section">
                {/* <div className="clearfix" style={{ height: '20px' }}></div> */}
                <div
                  className="seFooter"
                  style={{ borderTop: "1px solid #CCC" }}
                >
                  {/* <div className="clearfix" style={{ height: '5px' }}></div> */}
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
                  {/* <div className="clearfix " style={{ height: '5px' }}></div> */}
                </div>
              </div>
            )}

            <div
              className="col-md-12 col-sm-12 col-xs-12 no-padding center"
              style={{ marginBottom: "15px" }}
            >
              {searching ? (
                // <button className="btn btn-primary" type="button" disabled></button>
                ""
              ) : (
                <center>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      // pipelineTrendingSearchValidator();
                      getpipeLineTrendingData();
                      setRefresh(false);
                      // setExecId("");
                    }}
                    // onClick={pipelineTrendingSearchValidator}
                    style={{ boxShadow: "none" }}
                  >
                    <FaSearch /> Search{" "}
                  </button>
                </center>
              )}
            </div>

            <SelectSEDialogBox
              visible={visible}
              salesfullAccess={salesfullAccess}
              setVisible={setVisible}
              accessData={accessData}
              dataAccess={dataAccess}
              setGrpId={setGrpId}
              SetBulkIds={SetBulkIds}
            />
          </div>
        </CCollapse>
        {searching && <Loader handleAbort={handleAbort} />}
      </div>
    </div>
  );
}
