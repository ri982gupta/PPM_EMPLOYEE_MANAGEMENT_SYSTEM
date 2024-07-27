import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import SelectSEDialogBox from "../SelectSE/SelectSEDialogBox";
// import { FaSearch } from "react-icons/fa";
import { environment } from "../../environments/environment";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse, CListGroup } from "@coreui/react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import Loader from "../Loader/Loader";
import moment from "moment";
import { AiFillWarning } from "react-icons/ai";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { BiRefresh } from "react-icons/bi";
import { useSelector } from "react-redux";

export default function ScoreCardSearchFilter({
  setScoreCardData,
  setqbrList,
  scoreCradPermission,
  setrisk,
  setcsat,
  setHistoricalTrendData,
  setShowHistoricalTrend,
  setcardSelector,
  scoreCardDataPayload,
  setscoreCardDataPayload,
}) {
  //-------------------------------------------------------------------------------------------------------

  const handleOnSelect = (item) => {
    // the item selected
    console.log(item);
  };

  //--------------------------------------------const variable declarations-----------------------------------------------------------
  const [selectedSE, setselectedSE] = useState("<< All SE >>");
  const [bulkids, SetBulkIds] = useState(true);
  const [dataAccess, setDataAccess] = useState([]);
  // let quter;
  // quter = (new Date()).getMonth;
  const [salesEx, setSalesEx] = useState(-2);

  var d = new Date();
  console.log(d, "no===================106");
  var year = d.getFullYear();
  var month1 = d.getMonth();
  var c = new Date(year + 1, month1 + 3);
  console.log(c, "-----date");
  let newDate = moment(c).format("DD-MM-yyyy");
  const [startDate, setStartDate] = useState(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear() + 1;
    const month = currentDate.getMonth() + 1 - 7;
    return new Date(year, month, 1);
  });

  const currentQuarter = moment(new Date())
    .add(1, "years")
    .subtract(6, "months")
    .format("yyyy-MM-DD");

  console.log(new Date(), currentQuarter, "--currentQuarter");

  const [selectedSEVal, setSelectedSEVal] = useState(-2);
  const [salesfullAccess, setSalesfullAccess] = useState([]);

  const [duration, setduration] = useState([1]);
  const [visiblepopup, setVisiblepopup] = useState(false);
  const [viewBy, setViewBy] = useState("se");
  const [salesExecutiveDropdown, setsalesExecutiveDropdown] = useState([]);
  const measuresDropdownObject = [
    { value: 8, label: "CSAT" },
    { value: 3, label: "Customer Category & Top Projects" },
    { value: 7, label: "Open Service Pipeline" },
    { value: 6, label: "Progress of Services/Software" },
    { value: 10, label: "QBR" },
    { value: 5, label: "Realised, Planned By Location & Resoure Type" },
    { value: 4, label: "Realised Revenue By Contract Terms" },
    { value: 9, label: "Risks" },
    { value: 1, label: "Summary" },
    {
      value: 2,
      label:
        "Target, Realised, Planned, Calls and Variance By Location & Practice",
    },
  ];
  const [measuresDropdown, setmeasuresDropdown] = useState(
    measuresDropdownObject
  );
  // const [scoreCardDataPayload, setscoreCardDataPayload] = useState({
  //     "executives": "-2",
  //     "isActive": true,
  //     "measures": "-1",
  //     "isSearch": true,
  //     "from": "2023-04-01",
  //     "duration": 1,
  //     "type": "cu",
  //     "viewby": "se",
  //     "cslIds": -1,
  //     "dpIds": -1,
  //     "customerId": -1,
  //     "isIndividual": false,
  //     "key": 4452475,
  //     "opptyActType": "-1"
  // })
  const [errorMsg, seterrorMsg] = useState(false);
  const [loader, setLoader] = useState(false);
  const [item, setItem] = useState([]);
  const [grpId, setGrpId] = useState([]);

  const [dispSF, setDispSF] = useState(false);
  const [cslMultiselectDropdown, setcslMultiselectDropdown] = useState([]);
  const [selectedCSL, setselectedCSL] = useState([]);
  const [dpMultiselectDropdown, setdpMultiselectDropdown] = useState([]);
  const [selectedDP, setselectedDP] = useState([]);
  const [customerAutocomplete, setcustomerAutocomplete] = useState([]);
  const [selectedCustomer, setselectedCustomer] = useState([]);

  const [customer, setCustomer] = useState([]);
  const localSE =
    localStorage.getItem("selectedSELocal") === null
      ? []
      : JSON.parse(localStorage.getItem("selectedSELocal"));
  const isIndividualChecked =
    localStorage.getItem("isIndividualCheckedLocal") === null
      ? false
      : JSON.parse(localStorage.getItem("isIndividualCheckedLocal"));
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
  console.log(filteredData);
  console.log(transformedData);
  const idArray = transformedData.map((item) => item.id);
  const filteredIds = idArray.filter((id) => typeof id === "number");
  console.log(filteredIds, "love");
  const updatedIds = filteredIds.map((id) =>
    id === "1717" || "3887" || "3887" || "3977" || "4895" || "4872942"
      ? grpId
      : id
  );

  // Flatten the array if grpid is an array of arrays
  const flattenedIds = updatedIds.flat();
  console.log(flattenedIds, "mmmm");
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
  console.log(transformedData, "zzzzzzzzz");
  const [reportRunId, setreportRunId] = useState("");
  const [accessData, setAccessData] = useState([]);

  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const ref = useRef([]);
  const abortController = useRef(null);
  const [searching, setsearching] = useState(false);
  const [sFOwnerDivisionsDropdown, setSFOwnerDivisionsDropdown] = useState([]);
  const [divExecutive, setDivExecutive] = useState([]);
  const [selectesFOwnerDivison, setselectesFOwnerDivison] = useState([]);
  const [division, setDivision] = useState("");
  const [sediv, setSediv] = useState("initial");
  console.log(startDate, "start");

  //// -------breadcrumbs-----
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["Scorecard"];
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
      const modifiedUrlPath = "/pmo/salesScoreCard";
      getUrlPath(modifiedUrlPath);

      const getData = resp.data;
      const revenueForcastSubMenu = getData
        .find((item) => item.display_name === "Sales")
        .subMenus.find((subMenu) => subMenu.display_name === "Scorecard");
      console.log(revenueForcastSubMenu.accessLevel);
      setAccessData(revenueForcastSubMenu.access_level);
      const accessLevel = revenueForcastSubMenu
        ? revenueForcastSubMenu.userRoles.includes("919")
          ? 919
          : revenueForcastSubMenu.userRoles.includes("690") &&
            revenueForcastSubMenu.userRoles.includes("641")
          ? 600
          : revenueForcastSubMenu.userRoles.includes("690")
          ? 690
          : revenueForcastSubMenu.userRoles.includes("641")
          ? 641
          : revenueForcastSubMenu.userRoles.includes("932")
          ? 932
          : revenueForcastSubMenu.userRoles.includes("46")
          ? 46
          : revenueForcastSubMenu.userRoles.includes("126")
          ? 126
          : revenueForcastSubMenu.userRoles.includes("686")
          ? 686
          : revenueForcastSubMenu.userRoles.includes("909")
          ? 909
          : revenueForcastSubMenu.userRoles.includes("307") && 307
        : null;

      setDataAccess(accessLevel);
      if (
        accessLevel == 690 ||
        accessLevel == 641 ||
        accessLevel == 909 ||
        accessLevel == 600
      ) {
        axios({
          method: "get",
          url:
            baseUrl +
            `/dashboardsms/allocationDashboard/getCustomers?loggedUserId=${loggedUserId}`,
        }).then(function (response) {
          var resp = response.data;
          setCustomer(resp);
        });
      } else {
        axios({
          method: "get",
          url: baseUrl + `/customersms/Customers/getCustomers`,
        }).then(function (response) {
          var resp = response.data;
          setCustomer(resp);
        });
      }
      axios
        .get(
          accessLevel == 641 || accessLevel == 600
            ? baseUrl +
                `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`
            : // `/CommonMS/master/getCSLDPAE?loggedUserId=${loggedUserId}

              baseUrl +
                `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`
        )
        .then((resp) => {
          const data = resp.data;
          let custom = [];
          const seenPersonNames = new Set();

          // const dropdownOptions = data.map((item) => {
          //   let obj = {
          //     value: item.id,
          //     label: item.PersonName,
          //   };
          //   return obj;
          // });
          data.forEach((e) => {
            if (!seenPersonNames.has(e.PersonName)) {
              let cslObj = {
                label: e.PersonName,
                value: e.id,
              };
              custom.push(cslObj);
              seenPersonNames.add(e.PersonName);
            }
          });
          setcslMultiselectDropdown(custom);
          setselectedCSL(custom);
        })
        .catch((err) => {
          console.log(err);
        });
      axios
        .get(
          baseUrl + `/CommonMS/master/getDPDropDownData?userId=${loggedUserId}`
        )
        .then((resp) => {
          const data = resp.data;
          let custom = [];
          const seenPersonNames = new Set();
          data.forEach((e) => {
            if (!seenPersonNames.has(e.PersonName)) {
              let cslObj = {
                label: e.PersonName,
                value: e.id,
              };
              custom.push(cslObj);
              seenPersonNames.add(e.PersonName);
            }
          });
          // const dropdownOptions = data.map((item) => {
          //   let obj = {
          //     value: item.id,
          //     label: item.PersonName,
          //   };
          //   return obj;
          // });
          setdpMultiselectDropdown(custom);
          setselectedDP(custom);
        })
        .catch((err) => {
          console.log(err);
        });
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
  //------------------------methods----------------------------------

  const onFilterChange = ({ id, value }) => {
    console.log(id + " " + value);

    console.log(viewBy, "viewBy----");
    console.log(
      selectesFOwnerDivison,
      selectesFOwnerDivison.length,
      selectesFOwnerDivison.length + parseInt(1),
      "selectesFOwnerDivison.length",
      sFOwnerDivisionsDropdown.length,
      "sFOwnerDivisionsDropdown.length"
    );
    setscoreCardDataPayload((prevState) => {
      return { ...prevState, [id]: value };
    });
    if (id === "executives" && value === "1") {
      setVisiblepopup(true);
    }
    switch (value) {
      case "ne":
        setscoreCardDataPayload((prevState) => {
          return { ...prevState, ["from"]: "2024-04-01" };
        });
        break;
      case "tr":
        setscoreCardDataPayload((prevState) => {
          return { ...prevState, ["from"]: "2023-10-01" };
        });
        break;

      case "se":
        setscoreCardDataPayload((prevState) => {
          return {
            ...prevState,
            ["cslIds"]: -1,
            ["customerId"]: -1,
            ["executives"]: value,
          };
        });
        break;

      case "csl":
        setscoreCardDataPayload((prevState) => {
          return {
            ...prevState,
            ["dpIds"]: -1,
            ["customerId"]: -1,
            ["executives"]: -1,
          };
        });
        break;

      case "dp":
        setscoreCardDataPayload((prevState) => {
          return {
            ...prevState,
            ["executives"]: -1,
            ["cslIds"]: -1,
            ["customerId"]: -1,
          };
        });
        break;

      case "cust":
        setscoreCardDataPayload((prevState) => {
          return { ...prevState, ["cslIds"]: -1, ["dpIds"]: -1 };
        });
        break;

      case "Divisions":
        console.log(
          selectesFOwnerDivison.length,
          "selectesFOwnerDivison.length",
          sFOwnerDivisionsDropdown.length,
          "sFOwnerDivisionsDropdown.length"
        );
        // if (sFOwnerDivisionsDropdown.length == (selectesFOwnerDivison.length + parseInt(1))) {
        //     setscoreCardDataPayload((prevState) => {
        //         return { ...prevState, ["Divisions"]: -1, ["viewby"]: "se", ["executives"]: -2 }
        //     })
        // }
        // else {
        // setSediv("Divisions")
        setscoreCardDataPayload((prevState) => {
          return { ...prevState, ["viewby"]: "se" };
        });

        // }

        break;

      default:
        break;
    }
  };
  console.log(division, "division state");
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
  useEffect(() => {
    hirarchyAccess();
  }, []);
  // -----------------------calls----------------------------------

  const baseUrl = environment.baseUrl;
  useEffect(() => {}, [item]);

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

  // const getcslMultiselectDropdown = () => {
  //   // const loggedUser = "19042";
  //   axios
  //     .get(
  //       dataAccess == 641
  //         ? baseUrl +
  //             `/CommonMS/master/getCSLDPAE?loggedUserId=139715925
  //       `
  //         : baseUrl +
  //             `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`
  //     )
  //     .then((resp) => {
  //       const data = resp.data;
  //       const dropdownOptions = data.map((item) => {
  //         let obj = {
  //           value: item.id,
  //           label: item.PersonName,
  //         };
  //         return obj;
  //       });
  //       setcslMultiselectDropdown(dropdownOptions);
  //       setselectedCSL(dropdownOptions);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const getdpMultiselectDropdown = () => {
  //   // const loggedUser = "19042";
  //   axios
  //     .get(
  //       dataAccess == 690
  //         ? baseUrl + `/CommonMS/master/getDP?loggedUserId=${loggedUserId}`
  //         : baseUrl +
  //             `/CommonMS/master/getDPDropDownData?userId=${loggedUserId}`
  //     )
  //     .then((resp) => {
  //       const data = resp.data;
  //       const dropdownOptions = data.map((item) => {
  //         let obj = {
  //           value: item.id,
  //           label: item.PersonName,
  //         };
  //         return obj;
  //       });
  //       setdpMultiselectDropdown(dropdownOptions);
  //       setselectedDP(dropdownOptions);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const getcustomerSearch = () => {
  //     console.log("here")
  //     axios.get(baseUrl + `/CommonMS/master/getFilterCustomers?isAll=false&isLimitedAccess=false&cslUser=0&isActive=true&term=`)
  //         .then((resp) => {
  //             const data = resp.data;
  //             const dropdownOptions = data.map((item) => {
  //                 let obj = {
  //                     value: item.id,
  //                     label: item.full_name
  //                 }
  //                 return obj
  //             })
  //             setcustomerAutocomplete(dropdownOptions)
  //             setselectedCustomer(dropdownOptions)
  //         })
  //         .catch((err) => {
  //             console.log(err)
  //         })
  // }

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
        setselectesFOwnerDivison(dropdownOptions);
        setscoreCardDataPayload((prevState) => {
          return {
            ...prevState,
            ["Divisions"]: -1,
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const getCustomerdata = () => {
  //   axios({
  //     method: "get",
  //     url: baseUrl + `/customersms/Customers/getCustomers`,
  //   }).then(function (response) {
  //     var resp = response.data;
  //     setCustomer(resp);
  //   });
  // };

  const getExecutivesForOwnerDivision = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/SalesMS/scoreCard/getExecutivesForOwnerDivision?divid=${division}`,
    })
      .then(function (response) {
        let resp = response.data;
        console.log(resp, "response");
        setDivExecutive(resp);
        //    setPrjName(resp)
      })
      .catch(function (response) {
        console.log(response);
      });
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

  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );
  const getscoreCardData = async () => {
    console.log(scoreCardDataPayload, "--scoreCardDataPayload");
    console.log(scoreCardDataPayload.measures, "---measures");
    setScoreCardData({});
    setcsat([]);
    setrisk([]);
    setqbrList([]);
    abortController.current = new AbortController();
    // setTimeout(() => {
    //   setsearching(true);
    // }, 2000);
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);
    console.log(valid);

    if (valid == true) {
      setsearching(false);
      seterrorMsg(true);

      setTimeout(() => {
        seterrorMsg(false);
      }, 2000);
    }

    if (valid) {
      return;
    }
    // setLoader(true);

    // !valid && setVisible(!visible);

    let payload = null;
    payload = scoreCardDataPayload;
    // ---------------------popup payload-------------------------------------------
    // payload.executives === "1"
    //   ? flattenedIds.join(",") == ""
    //     ? filteredIds.join(",")
    //     : flattenedIds.join(",")
    //   : salesEx,
    payload["executives"] =
      payload.executives == "1"
        ? SelectSEData
        : payload["viewby"] != "se"
        ? -1
        : salesEx;
    // (payload.executives = String(
    //     JSON.parse(localStorage.getItem("selectedSE")).map((item) => {
    //       return item.id;
    //     })
    //   ))

    // ------------------------------------------------------------------------------------
    console.log("in line 304---");

    scoreCardDataPayload["executives"] =
      scoreCardDataPayload["Divisions"] == -1 &&
      scoreCardDataPayload["executives"] == -2 &&
      (sediv == "Divisions" || sediv == "initial")
        ? -2
        : scoreCardDataPayload["Divisions"] == -1 &&
          scoreCardDataPayload["executives"] != -2 &&
          sediv != "Divisions"
        ? scoreCardDataPayload["executives"]
        : divExecutive;

    console.log(scoreCardDataPayload, sediv, divExecutive, "after");

    const loaderTime = setTimeout(() => {
      setsearching(true);
    }, 2000);

    await axios({
      method: "post",
      url: baseUrl + `/SalesMS/scoreCard/scoreCardData`,
      data: payload,
      signal: abortController.current.signal,
    })
      .then((resp) => {
        const data = resp.data;
        setreportRunId(resp.data.reportRunId);
        setScoreCardData(data);
        scoreCardDataPayload.type === "tr"
          ? (setShowHistoricalTrend(true), setScoreCardData(data))
          : setShowHistoricalTrend(false);
        // setcardSelector(scoreCardDataPayload.measures);
        clearTimeout(loaderTime);
        setsearching(false);
        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);

        setDispSF(true);
      })
      .catch((err) => {
        console.log(err);
      });
    // axios
    //   .get(baseUrl + `/SalesMS/scoreCard/getScoreCardCSATProjects`)
    //   .then((resp) => {
    //     const data = resp.data;
    //     setcsat(data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // axios
    //   .get(baseUrl + `/SalesMS/scoreCard/getScoreCardTProjectRisks`)
    //   .then((resp) => {
    //     const data = resp.data;
    //     setrisk(data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    // axios
    //   .get(baseUrl + `/SalesMS/scoreCard/getScoreCardProjectsQBRList`)
    //   .then((resp) => {
    //     const data = resp.data;
    //     setqbrList(data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  const getserviceData = () => {
    setsearching(false);

    axios
      .post(baseUrl + `/SalesMS/salesforce/refreshSalesForceData`, {
        reportRunId: "" + reportRunId,
        for: "",
      })
      .then((resp) => {
        const data = resp.data.data;
        console.log(data);
        // setTimeout(() => {
        // setsearching(true);
        // }, 4000);
        // setTimeout(() => {
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        getscoreCardData();
        setsearching(false);
        // }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(accessData);
  // -----------------------------useEffect---------------------------------

  useEffect(() => {
    getsalesExecutiveDropdown();
    // getcslMultiselectDropdown();
    // getdpMultiselectDropdown();
    // getcustomerSearch()
    getSFOwnerDivisionsDropdown();
    // getCustomerdata();
  }, []);
  useEffect(() => {
    getExecutivesForOwnerDivision();
  }, [division]);

  const handleClear = () => {
    setscoreCardDataPayload((prev) => ({ ...prev, customerId: "-1" }));
  };
  const HelpPDFName = "Scorecard.pdf";
  const Headername = "Scorecard Help";
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Scorecard</h2>
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
            {dispSF && (
              <h2 onClick={getserviceData} style={{ cursor: "pointer" }}>
                Sf <BiRefresh />
              </h2>
            )}{" "}
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

      <div className="group mb-3  customCard">
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5">Type </label>
                <span className="col-1 p-0">:</span>

                <span className="col-6">
                  <select
                    id="type"
                    className="col-md-12 col-sm-12 col-xs-12  onLoadEmpty"
                    onChange={(e) => {
                      onFilterChange(e.target);
                    }}
                  >
                    <option value="cu">Current Quarter</option>
                    <option value="tr">Historical Trend</option>
                    <option value="ne">Next Quarter</option>
                  </select>
                </span>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5">View By </label>
                <span className="col-1 p-0">:</span>

                <span className="col-6">
                  <div id="viewby">
                    <select
                      id="viewby"
                      className="col-md-12 col-sm-12 col-xs-12  onLoadEmpty"
                      onChange={(e) => {
                        onFilterChange(e.target);
                        setViewBy(e.target.value);
                        e.target.value == "Divisions" && setSediv("Divisions");
                      }}
                    >
                      <option value="se">Executive</option>
                      {dataAccess == 641 ||
                      dataAccess == 126 ||
                      dataAccess == 919 ||
                      dataAccess == 600 ? (
                        <option value="csl">CSL</option>
                      ) : (
                        ""
                      )}
                      {dataAccess == 690 ||
                      dataAccess == 126 ||
                      dataAccess == 919 ||
                      dataAccess == 600 ? (
                        <option value="dp">DP</option>
                      ) : (
                        ""
                      )}
                      <option value="cust">Customer</option>
                      <option value="Divisions">Sales Division</option>
                    </select>
                  </div>
                </span>
              </div>
            </div>
            {/* <div className="col-md-3 col-sm-10 col-xs-12 seDiv" id="execSelDiv">
                {/* <div className="clearfix" style={{ height: '10px' }}></div> 
                <div className="form-group pui-require">
                    <label className="col-md-5 col-sm-5 col-xs-5 no-padding">Type</label>
                    <span className="col-xs-1 bold">:</span>
                    <span className="col-md-5 col-sm-5 col-xs-5 no-padding" style={{ height: '23px' }}>
                        <select id="type" className="col-md-12 col-sm-12 col-xs-12  onLoadEmpty" onChange={(e) => { onFilterChange(e.target) }}>
                            <option value="cu">Current Quarter</option>
                            <option value="ne">Next Quarter</option>
                            <option value="tr">Historical Trend</option>

                        </select>
                    </span>
                </div>
            </div> */}

            {/* <div className="col-md-3 col-sm-10 col-xs-12 seDiv" id="execSelDiv">
                <div className="clearfix" style={{ height: '10px' }}></div>
                <div className="form-group pui-require">
                    <label className="col-md-5 col-sm-5 col-xs-5 no-padding">View By</label>
                    <span className="col-xs-1 bold">:</span>
                    <span className="col-md-5 col-sm-5 col-xs-5 no-padding" style={{ height: '23px' }}>
                        <select id="viewby" className="col-md-12 col-sm-12 col-xs-12  onLoadEmpty" onChange={(e) => { onFilterChange(e.target) }}>
                            <option value="se">Executive</option>
                            <option value="csl">CSL</option>
                            <option value="dp">DP</option>
                            <option value="cust">Customer</option>
                        </select>
                    </span>
                </div>
            </div> */}

            {
              viewBy === "se" && (
                <div className=" col-md-3 mb-2">
                  {/* <div className="clearfix" style={{ height: "10px" }}></div> */}

                  <div className="form-group row">
                    <label className="col-5">
                      Sales Executive{" "}
                      <span className="required error-text ml-1"> *</span>
                    </label>
                    <span className="col-1 p-0">:</span>

                    <span className="col-6">
                      <div id="executives">
                        {accessData == 1000 ||
                        accessData == 500 ||
                        salesfullAccess == 920 ? (
                          <select
                            id="executives"
                            className="col-md-12 col-sm-12 col-xs-12  text onLoadEmpty"
                            value={
                              selectedSEVal
                              // scoreCardDataPayload.executives > 5
                              //   ? "1"
                              //   : scoreCardDataPayload.executives
                            }
                            onChange={(e) => {
                              onFilterChange(e.target);
                              setselectedSE(
                                e.target.options[e.target.selectedIndex].text
                              );
                              setSelectedSEVal(e.target.value);

                              setSalesEx(e.target.value);
                              console.log(
                                e.target.options[e.target.selectedIndex].text,
                                "se value"
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
                            className="col-md-12 col-sm-12 col-xs-12  text onLoadEmpty"
                            value={
                              selectedSEVal
                              // scoreCardDataPayload.executives > 5
                              //   ? "1"
                              //   : scoreCardDataPayload.executives
                            }
                            onChange={(e) => {
                              onFilterChange(e.target);
                              setselectedSE(
                                e.target.options[e.target.selectedIndex].text
                              );
                              setSelectedSEVal(e.target.value);

                              setSalesEx(e.target.value);
                              console.log(
                                e.target.options[e.target.selectedIndex].text,
                                "se value"
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
              )
              // : (
              //   <div className="col-md-3 mb-2" id="execSelDiv">
              //     {/* <div className="clearfix" style={{ height: "10px" }}></div> */}

              //     <div className="form-group row">
              //       <label className="col-5">
              //         Sales Executive <span className="error-text">&nbsp;*</span>
              //       </label>

              //       <span className="col-1 p-0">:</span>

              //       <span className="col-6 textfield">
              //         <select
              //           id="executives"
              //           className="text"
              //           value={scoreCardDataPayload.executives}
              //           onChange={(e) => {
              //             console.log(e);

              //             onFilterChange(e.target);

              //             console.log(e.target);

              //             setselectedSE(
              //               e.target.options[e.target.selectedIndex].text
              //             );
              //           }}
              //           ref={(ele) => {
              //             ref.current[0] = ele;
              //           }}
              //         >
              //           <option value={0}>{"<< Please select>> "}</option>

              //           <option value={1}>{"<< Select SE>> "}</option>
              //         </select>
              //       </span>
              //     </div>
              //   </div>
              // )}
            }

            {viewBy === "csl" && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    CSL<span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                    id="CSL"
                  >
                    {/* <div id="CSL"> */}
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      options={cslMultiselectDropdown}
                      hasSelectAll={true}
                      isLoading={false}
                      valueRenderer={generateDropdownLabel}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedCSL}
                      disabled={false}
                      onChange={(s) => {
                        setselectedCSL(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "cslIds",
                          value: selected.toString(),
                        });
                      }}
                    />
                    {/* </div> */}
                  </div>
                </div>
              </div>
            )}
            {/* </div> <div className="col-md-3 col-sm-10 col-xs-12 no-padding" id="CSLDiv">
                <div className="clearfix" style={{ height: '10px' }}></div>
                <div className="form-group pui-require">
                    <label className="col-md-5 col-sm-5 col-xs-5  no-padding">CSL</label>
                    <span className="col-xs-1 bold ">:</span>
                    <span className={`col-md-5 col-sm-5 col-xs-5 no-padding ${errorMsg && 'alert alert-danger'}`} style={{ height: '23px' }}>
                        <MultiSelect
                            options={cslMultiselectDropdown}
                            hasSelectAll={true}
                            isLoading={false}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            value={selectedCSL}
                            disabled={false}
                            onChange={(s) => {
                                setselectedCSL(s);
                                let selected = s.map((item) => {
                                    return item.value
                                })
                                onFilterChange({ id: "cslIds", value: selected.toString() })
                            }}
                        />
                    </span>
                </div>
            </div>} */}

            {viewBy === "dp" && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    DP <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>

                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    {/* <div id="DP"> */}
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      options={dpMultiselectDropdown}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedDP}
                      disabled={false}
                      onChange={(s) => {
                        setselectedDP(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "dpIds",
                          value: selected.toString(),
                        });
                      }}
                    />
                    {/* </div> */}
                  </div>
                </div>
              </div>
            )}
            {/*  <div className="col-md-3 col-sm-10 col-xs-12 no-padding" id="CSLDiv">
                <div className="clearfix" style={{ height: '10px' }}></div>
                <div className="form-group pui-require">
                    <label className="col-md-5 col-sm-5 col-xs-5  no-padding">DP</label>
                    <span className="col-xs-1 bold ">:</span>
                    <span className={`col-md-5 col-sm-5 col-xs-5 no-padding ${errorMsg && 'alert alert-danger'}`} style={{ height: '23px' }}>
                        <MultiSelect
                            options={dpMultiselectDropdown}
                            hasSelectAll={true}
                            isLoading={false}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            value={selectedDP}
                            disabled={false}
                            onChange={(s) => {
                                setselectedDP(s);
                                let selected = s.map((item) => {
                                    return item.value
                                })
                                onFilterChange({ id: "cslIds", value: selected.toString() })
                            }}
                        />
                    </span>
                </div>
            </div>} */}

            {viewBy === "cust" && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Customer{" "}
                    <span className="required error-text ml-1"> *</span>{" "}
                  </label>
                  <span className="col-1 p-0">:</span>

                  <div
                    className="col-6 autocomplete"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                    id="Customer"
                  >
                    {/* <div id="Customer"> */}
                    <div className="autoComplete-container">
                      <ReactSearchAutocomplete
                        items={customer}
                        type="Text"
                        name="customerId"
                        id="customerId"
                        className="AutoComplete"
                        onSelect={(s) => {
                          setscoreCardDataPayload((prevProps) => ({
                            ...prevProps,
                            customerId: s.id,
                          }));
                          // setselectedCustomer(s);
                          // let selected = s.map((item) => {
                          //     return item.value
                          // })
                          // onFilterChange({
                          //     id: "customerId", value: selected.toString()
                          //     //  value: a[0].value === undefined ? -1 : a[0].value
                          // })
                        }}
                        showIcon={false}
                        onClear={handleClear}
                        placeholder="Type minimum 3 characters"
                      />
                      <span> {item.name}</span>
                    </div>
                    {/* <MultiSelect
                                        ArrowRenderer={ArrowRenderer}

                                        options={customerAutocomplete}
                                        hasSelectAll={true}
                                        isLoading={false}
                                        shouldToggleOnHover={false}
                                        disableSearch={false}
                                        value={selectedCustomer}
                                        disabled={false}
                                        onChange={(s) => {
                                            // let a = s[s.length - 1] === undefined ? [] : [s[s.length - 1]]
                                            setselectedCustomer(s);
                                            let selected = s.map((item) => {
                                                return item.value
                                            })
                                            console.log(s.length)
                                            onFilterChange({
                                                id: "customerId", value: selected.toString()
                                                //  value: a[0].value === undefined ? -1 : a[0].value
                                            })
                                        }}
                                    /> */}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            )}
            {/* <div className="col-md-3 col-sm-10 col-xs-12 no-padding" id="CSLDiv">
                <div className="clearfix" style={{ height: '10px' }}></div>
                <div className="form-group pui-require">
                    <label className="col-md-5 col-sm-5 col-xs-5  no-padding">Customer</label>
                    <span className="col-xs-1 bold">:</span>
                    <span className={`col-md-5 col-sm-5 col-xs-5 no-padding ${errorMsg && 'alert alert-danger'}`} style={{ height: '23px' }}>
                        <MultiSelect
                            options={customerAutocomplete}
                            hasSelectAll={false}
                            isLoading={false}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            value={selectedCustomer}
                            disabled={false}
                            onChange={(s) => {
                                let a = s[s.length - 1] === undefined ? [] : [s[s.length - 1]]
                                setselectedCustomer(a);
                                console.log(s.length)
                                onFilterChange({ id: "customerId", value: a[0].value === undefined ? -1 : a[0].value })
                            }}
                        />
                    </span>
                </div>
            </div>} */}

            {viewBy === "Divisions" && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Sales Division{" "}
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>

                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[4] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      options={sFOwnerDivisionsDropdown}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectesFOwnerDivison}
                      disabled={false}
                      onChange={(s) => {
                        setselectesFOwnerDivison(s);
                        let selected =
                          s.length == sFOwnerDivisionsDropdown.length
                            ? -1
                            : s.map((item) => {
                                return item.value;
                              });
                        setDivision(selected.toString());
                        onFilterChange({
                          id: "Divisions",
                          value: selected.toString(),
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {scoreCardDataPayload.type !== "tr" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Measures{" "}
                    <span className="required error-text ml-1"> *</span>{" "}
                  </label>
                  <span className="col-1 p-0">:</span>

                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[5] = ele;
                    }}
                    id="Measures"
                  >
                    {/* <div id="Measures"> */}
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      options={measuresDropdownObject}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={measuresDropdown}
                      disabled={false}
                      onChange={(s) => {
                        setmeasuresDropdown(s);
                        let selected = s.map((item) => {
                          return item.value;
                        });
                        onFilterChange({
                          id: "measures",
                          value: selected.toString(),
                        });
                        setcardSelector(selected.toString());
                      }}
                    />
                    {/* </div> */}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5">
                      From Quarter{" "}
                      <span className="required error-text ml-1"> *</span>{" "}
                    </label>
                    <span className="col-1 p-0">:</span>

                    <span
                      className="col-6 datepicker"
                      ref={(ele) => {
                        ref.current[5] = ele;
                      }}
                    >
                      {/* <div id="From Quarter"> */}
                      <DatePicker
                        selected={startDate}
                        maxDate={moment(currentQuarter)
                          .endOf("quarter")
                          .toDate()}
                        onChange={(e) => {
                          console.log(
                            moment(currentQuarter).endOf("quarter").toDate(),

                            moment(e).format("yyyy-MM-DD"),
                            "quarter selected"
                          );
                          let quarter =
                            parseInt(moment(e).format("YYYY-MM-DD")) -
                            parseInt(3);

                          let selectMonth = moment(e).format("MM");
                          // console.log(quarter, moment(e).format("MM"), selectMonth, "selectMonth")

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

                          console.log("in line 777");
                          console.log(customMonth);

                          setStartDate(moment(e)._d);
                          onFilterChange({
                            id: "from",
                            value: moment(customMonth).format("yyyy-MM-DD"),
                          });

                          // setduration([]);
                          let selectedYear = moment(e).format("yyyy");
                          let currentYear = new Date().getFullYear();
                          console.log(
                            selectedYear,
                            currentYear,
                            parseInt(moment(customMonth).format("MM")),
                            "current year"
                          );
                          if (
                            selectedYear == currentYear &&
                            parseInt(moment(customMonth).format("MM")) == 1
                          ) {
                            setduration([1, 2, 3]);
                            console.log([1, 2, 3]);
                          } else if (
                            selectedYear == currentYear + parseInt(1) &&
                            parseInt(moment(customMonth).format("MM")) == 4
                          ) {
                            setduration([1, 2]);
                            console.log([1, 2]);
                          } else if (
                            selectedYear == currentYear &&
                            parseInt(moment(customMonth).format("MM")) == 10
                          ) {
                            setduration([1, 2, 3, 4]);
                            console.log([1, 2, 3, 4]);
                          } else if (
                            selectedYear == currentYear &&
                            parseInt(moment(customMonth).format("MM")) == 7
                          ) {
                            setduration([1, 2, 3, 4]);
                            console.log([1, 2, 3, 4]);
                          } else if (
                            selectedYear == currentYear + parseInt(1) &&
                            parseInt(moment(customMonth).format("MM")) == 7
                          ) {
                            setduration([1]);
                          } else {
                            setduration([1, 2, 3, 4]);
                            console.log([1, 2, 3, 4]);
                          }

                          // for (let index = 1; index <= selectMonth; index++) {
                          //     console.log(index);
                          //     setduration(prevState => [...prevState, index]);
                          // }
                        }}
                        dateFormat="yyyy, QQQ"
                        showQuarterYearPicker
                        // maxDate={new Date()}
                      />
                      {/* </div> */}
                    </span>
                  </div>
                </div>
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5">Duration </label>
                    <span className="col-1 p-0">:</span>

                    <span className="col-6">
                      <div id="From Quarter">
                        <select
                          id="duration"
                          name="duration"
                          className="col-md-12 col-sm-12 col-xs-12 "
                          defaultValue={"1"}
                          onChange={(e) => {
                            onFilterChange(e.target);
                          }}
                        >
                          {duration.map((item) => {
                            return <option value={item}>{item}</option>;
                          })}
                        </select>
                      </div>
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* <div className="col-md-3 col-sm-10 col-xs-12 seDiv">
              <div className="clearfix" style={{ height: '10px' }}></div>
             <div className="form-group pui-require">
                 <label className="col-md-5 col-sm-5 col-xs-5  no-padding">Measures</label>
                <span className="col-xs-1 bold">:</span>
                   <span className={`col-md-5 col-sm-5 col-xs-5 no-padding ${errorMsg && 'alert alert-danger'}`} style={{ height: '23px' }}>
                     <MultiSelect
                          options={measuresDropdownObject}
                            hasSelectAll={true}
                            isLoading={false}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            value={measuresDropdown}
                            disabled={false}
                            onChange={(s) => {
                                setmeasuresDropdown(s);
                                let selected = s.map  ((item) => {
                                     return item.value
                                 })
                                 onFilterChange({ id: "measures", value: selected.toString() })
                            }}
                        />
                    </span>
                </div>
            </div>
                :
                <>
                    <div className="col-md-3 col-sm-10 col-xs-12 seDiv" id="execSelDiv">
                        <div className="clearfix" style={{ height: '10px' }}></div>
                        <div className="form-group pui-require">
                         <label className="col-md-5 col-sm-5 col-xs-5 no-padding">From Quarter </label>
                             <span className="col-xs-1 bold">:</span>
                           <span className={`col-md-5 col-sm-5 col-xs-5 no-padding ${errorMsg && 'alert alert-danger'}`} style={{ height: '23px' }}>
                              <DatePicker
                                  selected={startDate}
                                  onChange={(e) => {
                                      console.log(e)
                                      setStartDate(e)
                                      onFilterChange({ id: "from", value: e.toLocaleDateString('en-CA') })
                                         let months;
                                         months = (new Date) - e;
                                        let maxdur = Math.ceil(months / (1000 * 60 * 60 * 24 * 30 * 4)) > 4 ? 4 : Math.ceil(months / (1000 * 60 * 60 * 24 * 30 * 4));
                                         setduration([])
                                         for (let index = 1; index <= maxdur; index++) {
                                             setduration(prevState => [...prevState, index]);
                                         }
                                     }}
                                     dateFormat="yyyy, QQQ"
                                     showQuarterYearPicker
                                     maxDate={new Date()}
                                 />
                             </span>
                         </div>
                     </div>

                    <div className="col-md-3 col-sm-10 col-xs-12 seDiv">
                        <div className="clearfix" style={{ height: '12px' }}></div>
                        <div className="form-group pui-require">
                            <label className="col-md-5 col-sm-5 col-xs-5 no-padding">Duration</label>
                            <span className="col-xs-1 bold">:</span>
                            <span className="col-md-5 col-sm-5 col-xs-5 no-padding" style={{ height: '23px' }}>
                                <select id="duration" name="duration" className="col-md-12 col-sm-12 col-xs-12 " defaultValue={"1"} onChange={(e) => { onFilterChange(e.target) }}>
                                    {duration.map((item) => {
                                        return <option value={item}>{item}</option>
                                    })}
                                </select>
                            </span>
                        </div>
                    </div>
                } */}
            {viewBy === "se" && (
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

            {/* <div className="col-md-12 no-padding section">
                            <div className="seFooter" style={{ borderTop: "1px solid #CCC" }}></div>
                        </div> */}

            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center">
              {/* <div className="clearfix" style={{ height: '25px' }}></div> */}
              {/* {searching ?
                                <button className="btn btn-primary" type="button" disabled >
                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button> : */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={getscoreCardData}
              >
                <FaSearch /> Search{" "}
              </button>
              {/* } */}
            </div>
            <SelectSEDialogBox
              visible={visiblepopup}
              setVisible={setVisiblepopup}
              setGrpId={setGrpId}
              salesfullAccess={salesfullAccess}
            />
          </div>
        </CCollapse>
        {searching ? <Loader handleAbort={handleAbort} /> : ""}
      </div>
    </div>
  );
}
