import React, { useState } from "react";
import DatePicker from "react-datepicker";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { CCollapse } from "@coreui/react";
import { useEffect } from "react";
import { BiCheck, BiRefresh } from "react-icons/bi";
import { environment } from "../../environments/environment";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import Loader from "../Loader/Loader";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
import OpportunityTable from "./OpportunityTable";
import OpportunityCustomers from "./OpportunityCustomers";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import CompetencyTable from "./CompetencyTable";
import OpportunityConsultant from "./OpportunityConsultant";
import Executive from "./Executive";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import DealHubOpportunityTable from "./DealHubOpportunityTable";
import "../../App.scss";
import DhAnalyticsTable from "./DhAnalyticsTable";

function Opportunities() {
  const [loaderState, setLoaderState] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    date.setMonth(date.getMonth() - 3);
    return date;
  });

  const today = new Date();
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31);

  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [Type, setType] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [searching, setsearching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleTable, setVisibleTable] = useState(false);
  const [changeDHview, setChangeDHview] = useState(1);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [accessLevel, setAccessLevel] = useState([]);
  const [updatedValue, setUpdatedValue] = useState([]);
  const defaultDate = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const firstDate = new Date(now.getFullYear(), quarter * 3, 1);
    return firstDate.toLocaleDateString("en-CA");
  };
  const [custVisible, setCustVisible] = useState(false);
  let flag = 2;
  let rows = 25;
  const abortController = useRef(null);
  const ref = useRef([]);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };
  const [successvalidationmessage, setSuccessvalidationmessage] =
    useState(false);
  const HelpPDFName = "Salesforce Opportunities.pdf";
  const header = "Sales Opportunities Help";
  const baseUrl = environment.baseUrl;
  const [rrId, setRrId] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [dataVar, newDataVar] = useState([]);
  const [versPopup, setVersPopup] = useState(false);
  const [checkedDhub, setCheckedDhub] = useState(false);
  const [customerState, setCustomerState] = useState(false);
  const [refreshButton, setRefreshButton] = useState();
  const [sFOwnerDivisionsDropdown, setSFOwnerDivisionsDropdown] = useState([]);
  const [selectesFOwnerDivison, setselectesFOwnerDivison] = useState([]);
  const [oppoStage, setoppoStage] = useState([]);
  const [oppoSelectedStage, setoppoSelectedStage] = useState([]);
  const getStages = () => {
    const stages = [
      { label: "Active", value: "active" },
      { label: "Closed Won", value: "closedwon" },
      { label: "Closed Lost", value: "closedlost" },
    ];
    const stages1 = [{ label: "Active", value: "active" }];
    setoppoStage(stages);
    setoppoSelectedStage(formData.dhOppt === "4" ? stages : stages1);
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
        setselectesFOwnerDivison(dropdownOptions);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //-----------breadcrumbs------------
  const [routes, setRoutes] = useState([]);
  let textContent = "Sales";
  let currentScreenName = ["Salesforce Opportunities"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const getserviceSFData = () => {
    setVisibleTable(false);
    const loaderTime = setTimeout(() => {
      setLoaderState(true);
    }, 2000);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/SalesMS/salesforce/refreshSalesForceData`,
      signal: abortController.current.signal,
      data: {
        reportRunId: "" + rrId,
        for: "",
      },
    })
      .then((resp) => {
        const data = resp.data.status;
        setLoaderState(false);
        setRefreshButton(data);
        clearTimeout(loaderTime);
        setVisibleTable(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (refreshButton == "success") {
      handleClick();
      setRefreshButton("");
    }
  }, [refreshButton]);

  useEffect(() => {
    getMenus();
    getSFOwnerDivisionsDropdown();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      const modifiedUrlPath = "/sales/sfOpportunities";
      getUrlPath(modifiedUrlPath);
      const Opportunities = resp.data
        .find((item) => item.display_name === "Sales")

        .subMenus.find((subMenu) => subMenu.display_name === "Opportunities");
      setAccessLevel(Opportunities.access_level);
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
  const [formData, setFormData] = useState({
    from: moment(defaultDate()).format("yyyy-MM-DD"),
    customers: "-1",
    duration: "1",
    tags: "-1",
    probability: ">=25",
    viewBy: "",
    prLoc: "-1",
    countries: "-1",
    oppType: "0",
    consultants: "-1",
    dhOppt: "1",
    division: "-1",
    statusid: "",
  });
  useEffect(() => {
    getStages();
  }, [formData.dhOppt]);
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      viewBy: prevFormData.dhOppt === "5" ? "dhowner" : "oppt",
      statusid: prevFormData.dhOppt === "4" ? "-1" : "active",
    }));
  }, [formData.dhOppt]);
  const selectedValue = formData.from.includes("01-01")
    ? "1"
    : formData.from.includes("10-01")
    ? "2"
    : formData.from.includes("07-01")
    ? "3"
    : formData.from.includes("04-01")
    ? "4"
    : formData.duration;
  console.log(formData.from, "date");
  const selectOptions =
    formData.dhOppt === "5" ? (
      <>
        <option value="dhowner">DH Owner</option>
        <option value="cust">Customer</option>
        <option value="csl">CSL</option>
        <option value="ctype">Contract Type</option>
        <option value="dhparticipants">DH Participant</option>
        {/* <option value="exec">Executive</option> */}
      </>
    ) : formData.dhOppt === "4" ? (
      <>
        <option value="oppt">DH Owner</option>
      </>
    ) : (
      <>
        <option value="oppt">Opportunity</option>
        {/* <option value="cust">Customer</option> */}
      </>
    );
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [consultant, setConsultant] = useState([]);
  const [selectedConsultant, setSelectedConsultant] = useState([]);
  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          from: filterData.from,
          customers: filterData.customers == -1 ? -1 : updatedValue.toString(),
          duration: filterData.duration,
          tags: filterData.tags,
          probability: filterData.probability,
          viewBy: filterData.viewBy,
          prLoc: filterData.prLoc,
          countries: filterData.countries,
          oppType: filterData.oppType,
          consultants: filterData.consultants,
          dhOppt: filterData.dhOppt,
          division: filterData.division,
        };
      } else {
        return {
          from: moment(defaultDate()).format("yyyy-MM-DD"),
          customers: "-1",
          duration: "1",
          tags: "-1",
          probability: ">=25",
          viewBy: "oppt",
          prLoc: "-1",
          countries: "-1",
          oppType: "0",
          consultants: "-1",
          dhOppt: "1",
          division: "-1",
          statusid: "active",
        };
      }
    });
  }, [filterData]);
  useEffect(() => {
    if (id != null) {
      const updatebusiness = business.filter((values) =>
        formData.tags?.includes(values.label)
      );

      const updatecountry = country.filter((values) =>
        formData.countries?.includes(values.value)
      );

      const updatedivision = sFOwnerDivisionsDropdown.filter((values) =>
        formData.division?.includes(values.value)
      );

      const updatetype = Type.filter((values) =>
        formData.prLoc?.includes(values.value)
      );

      const updateconsultant = consultant.filter((values) =>
        formData.consultants?.includes(values.value)
      );
      if (filterData.from !== undefined && filterData.from !== "") {
        const updatequarter = new Date(filterData.from);
        updatequarter.setMonth(updatequarter.getMonth() - 3);
        updatequarter.setFullYear(updatequarter.getFullYear() + 1);
        setStartDate(updatequarter);
      }
      const updateopttype = filterData.oppType;
      setSelectedType(updatetype);
      setSelectedConsultant(updateconsultant);
      setSelectedCountry(updatecountry);
      setSelectedBusiness(updatebusiness);
      setselectesFOwnerDivison(updatedivision);
    }
  }, [
    id,
    business,
    formData.tags,
    country,
    formData.countries,
    consultant,
    formData.consultants,
    formData.division,
  ]);

  const [selectedItems, setSelectedItems] = useState([{}]);
  const Customer = selectedItems?.map((d) => d?.id).toString();
  useEffect(() => {}, [Customer], [filterData.customers]);
  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();

  const handleChange1 = (e) => {
    const { name, value, id } = e.target;
    if (name == "Customer" && value === "select") {
      setCustVisible(true);
      setFormData((prev) => {
        return { ...prev, customers: value };
      });
    } else if (name == "Customer") {
      setFormData((prev) => {
        return { ...prev, customers: value };
      });
    } else {
      setFormData((prev) => {
        return { ...prev, [id]: value };
      });
    }
  };

  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/SalesMS/sales/getSalesOpportunitiesTags`)
      .then((Response) => {
        let business = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let businessobj = {
              value: e.tag_value,
              label: e.tag_name,
            };
            business.push(businessobj);
          });
        setBusiness(business);
        setSelectedBusiness(business);
      });
  };
  const getConsultants = () => {
    axios
      .get(baseUrl + `/SalesMS/sales/getSalesOpportunitiesConsultants`)
      .then((Response) => {
        let consultant = [];
        let data = Response.data;

        data.length > 0 &&
          data.forEach((e) => {
            let consultantobj = {
              value: e.consultant_name,
              label: e.consultant_name,
            };
            consultant.push(consultantobj);
          });
        setConsultant(consultant);
        setSelectedConsultant(consultant);
      });
  };

  const getCountries = () => {
    axios.get(baseUrl + `/CostMS/cost/getCountries`).then((Response) => {
      let countries = [];
      let data = Response.data;
      data.push({ id: 0, country_name: "Others" });
      data.length > 0 &&
        data.forEach((e) => {
          let countryObj = {
            label: e.country_name,
            value: e.id,
          };
          e.country_name == "NM" ? "" : countries.push(countryObj);
        });
      setCountry(countries);
      if (id == null) {
        setSelectedCountry(countries);
      }
    });
  };

  const getType = () => {
    let types = [];
    types.push(
      { value: "Offshore", label: "Offshore" },
      { value: "Onshore", label: "Onshore" },
      { value: "Landed", label: "Landed" }
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
  const handleClick = async () => {
    setChangeDHview("");
    setVisibleTable(false);
    setsearching(false);
    return new Promise((resolve, reject) => {
      const loaderTime = setTimeout(() => {
        setLoaderState(true);
      }, 2000);

      setTimeout(() => {
        let filteredData = ref.current.filter((d) => d != null);
        ref.current = filteredData;

        let valid = GlobalValidation(ref);

        if (valid) {
          setSuccessvalidationmessage(true);
          setLoaderState(false);
          resolve();
          return;
        }

        setVisibleTable(false);

        const abortController = new AbortController();
        axios({
          method: "post",
          url:
            baseUrl + `/SalesMS/sales/getSfOppts?loggedUserId=${loggedUserId}`,
          data: {
            from: moment(formData.from).format("yyyy-MM-DD"),
            customers: formData.customers == -1 ? -1 : selectedCust,
            duration:
              formData.dhOppt === "4" ? selectedValue : formData.duration,
            tags:
              formData.tags == business.map((item) => item.label).join(",")
                ? "-1"
                : formData.tags,
            dhOppt: formData.dhOppt,
            probability: formData.dhOppt === "5" ? "-1" : formData.probability,
            viewBy: formData.viewBy,
            prLoc:
              formData.prLoc == "Offshore,Onshore,Landed"
                ? "-1"
                : formData.prLoc,
            countries:
              formData.countries == "6,5,3,8,7,1,2,0"
                ? "-1"
                : formData.countries,
            oppType: formData.oppType,
            consultants:
              formData.consultants ==
              consultant.map((item) => item.label).join(",")
                ? "-1"
                : formData.consultants,
            division:
              formData.division == "109,105,110,103,2,111,1,104,99"
                ? "-1"
                : formData.division,
            statusid:
              formData.dhOppt === "1"
                ? "-1"
                : formData.statusid === "active,closedwon,closedlost"
                ? "-1"
                : formData.statusid,
          },
          signal: abortController.signal,
        })
          .then((response) => {
            formData.dhOppt == 1 || formData.dhOppt == 5
              ? setChangeDHview(1)
              : setChangeDHview(0);
            formData.viewBy == "cust" ||
            formData.viewBy == "dhowner" ||
            formData.viewBy == "ctype" ||
            formData.viewBy == "csl" ||
            formData.viewBy == "dhparticipants"
              ? setCustomerState(true)
              : setCustomerState(false);
            const responseData = response.data;
            formData.dhOppt == 1 || formData.dhOppt == 5 || formData.dhOppt == 4
              ? setData(responseData)
              : formData.dhOppt == 3
              ? setData(responseData.mydhOppt)
              : setData(responseData.dhOppt);
            newDataVar(responseData?.sfBuckets);
            setRrId(responseData.reportrunId);
            setLoaderState(false);
            setsearching(true);
            setVisibleTable(true);
            setSuccessvalidationmessage(false);
            setLoaderState(false);
            clearTimeout(loaderTime);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      }, 2000);
    });
  };

  const handleSearch = async () => {
    try {
      await handleClick();
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    } catch (error) {
      console.error("Error in handleSearch:", error);
    }
  };

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const onFilterChange = ({ id, value }) => {
    setFormData((prevState) => {
      return { ...prevState, [id]: value };
    });
  };
  useEffect(() => {
    getBusinessUnit();
    getCountries();
    getType();
    getConsultants();
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
    <div>
      {successvalidationmessage ? (
        <div className="statusMsg error">
          <span>
            <AiFillWarning /> Please select the valid values for highlighted
            fields
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Salesforce Opportunities</h2>
          </div>

          <div className="childThree toggleBtns">
            <div>
              {searching == true && (
                <h2
                  onClick={() => {
                    getserviceSFData();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src="ia_support_icons/refresh.png"
                    width="25"
                    height="20"
                    style={{ borderRadius: "17px" }}
                    alt="Refresh Icon"
                  />
                </h2>
              )}
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
            </div>
            <GlobalHelp pdfname={HelpPDFName} name={header} />
          </div>
        </div>
      </div>

      <div className="group customCard">
        <div className="col-md-12 collapseHeader"></div>
        {editmsg ? (
          <div className="statusMsg success">
            <span className="errMsg">
              <BiCheck size="1.4em" /> &nbsp; Search created successfully.
            </span>
          </div>
        ) : (
          ""
        )}

        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Account">
                  View By
                  <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    defaultValue={1}
                    className="text"
                    id="dhOppt"
                    name="dhOppt"
                    value={formData.dhOppt}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setVisibleTable(false);
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value={1}> All Oppt.</option>
                    <option value={2}> DH Oppt.</option>
                    <option value={3}> My DH Oppt.</option>
                    <option value={5}> DH Summary</option>
                    <option value={4}> DH Analytics</option>
                  </select>
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5 ellipsis" htmlFor="OpportunityType">
                  Opportunity Type
                  <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="oppType"
                    name="oppType"
                    value={formData.oppType}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="0">Services</option>
                    <option value="1">Software + Hardware</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="FromQuarter">
                  From Quarter <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6" style={{ height: "23px" }}>
                  <DatePicker
                    className="disabledFieldLook"
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
                    dateFormat="'FY' yyyy-QQQ"
                    showQuarterYearPicker
                    maxDate={formData.dhOppt === "4" ? lastDayOfYear : ""}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration
                  <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="duration"
                    value={selectedValue}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                    disabled={formData.dhOppt === "4"}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Account">
                  Account
                  <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    defaultValue={"-1"}
                    className="text"
                    id="Customer"
                    name="Customer"
                    onChange={handleChange1}
                  >
                    {selectedItems.length + "selected"}
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    <option value={-1}> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="select"> &lt;&lt;Select&gt;&gt;</option>
                  </select>
                </div>
              </div>
            </div>
            {formData.dhOppt === "1" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="probability">
                    Probability
                    <span className="required error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      className="text"
                      id="probability"
                      name="probability"
                      onChange={(e) => {
                        const { value, id } = e.target;
                        setFormData({ ...formData, [id]: value });
                      }}
                      value={formData.probability}
                    >
                      <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>
                      <option value="<25">&lt;25%</option>
                      <option value=">=25" selected>
                        &gt;=25%
                      </option>
                      <option value="<50">&lt;50%</option>
                      <option value=">=50">&gt;=50%</option>
                      <option value=">=75">&gt;=75%</option>
                      <option value="=100">=100%</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="countries">
                  Country
                  <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="countries"
                      options={country}
                      hasSelectAll={true}
                      value={selectedCountry}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      disabled={false}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => {
                        setSelectedCountry(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["countries"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="prLoc">
                  PR Location
                  <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="prLoc"
                      options={Type.sort((a, b) =>
                        a.label.localeCompare(b.label)
                      )}
                      hasSelectAll={true}
                      value={selectedType}
                      disabled={false}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => {
                        setSelectedType(e);
                        let filteredType = [];
                        e.forEach((d) => {
                          filteredType.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["prLoc"]: filteredType.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="viewBy">
                  Summary By
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    defaultValue={"oppt"}
                    className="text"
                    id="viewBy"
                    name="viewBy"
                    onChange={(e) => {
                      setVisibleTable(false);
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                    value={formData.viewBy}
                  >
                    {/* <option value="comp">Competency</option>
                    <option value="consl">Consultant</option> */}
                    {/* <option value="cust">Customer</option>
                    <option value="csl">CSL</option>
                    <option value="ctype">Contract Type</option>
                    <option value="dhowner">DH Owner</option>
                    <option value="dhparticipants">DH Participant</option> */}
                    {/* <option value="exec">Executive</option> */}
                    {/* <option value="oppt">Opportunity</option> */}
                    {selectOptions}
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5">
                  Sales Division
                  <span className="required error-text ml-1"> *</span>
                </label>
                <span className="col-1 p-0">:</span>
                <span
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[5] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="division"
                    options={sFOwnerDivisionsDropdown}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectesFOwnerDivison}
                    valueRenderer={generateDropdownLabel}
                    disabled={false}
                    onChange={(e) => {
                      setselectesFOwnerDivison(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["division"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </span>
              </div>
            </div>

            {formData.dhOppt === "1" ? (
              ""
            ) : (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    DealHub Status
                    <span className="required error-text ml-1"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <span
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[6] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="statusid"
                      name="statusid"
                      options={oppoStage}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={oppoSelectedStage}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => {
                        setoppoSelectedStage(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["statusid"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </span>
                </div>
              </div>
            )}

            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                type="submit"
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
        </CCollapse>
      </div>
      <SelectCustDialogBox
        flag={flag}
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        setUpdatedValue={setUpdatedValue}
      />

      {searching && visibleTable && formData.viewBy == "oppt" ? (
        <>
          {changeDHview === 1 && customerState === false ? (
            <OpportunityTable
              data={data}
              setData={setData}
              rrId={rrId}
              searching={searching}
              setsearching={setsearching}
              visible={visible}
              accessLevel={accessLevel}
              dataVar={dataVar}
              newDataVar={newDataVar}
              // valid={valid}
              setVisible={setVisible}
              setCheveronIcon={setCheveronIcon}
              FaChevronCircleUp={FaChevronCircleUp}
              FaChevronCircleDown={FaChevronCircleDown}
              versPopup={versPopup}
              setVersPopup={setVersPopup}
              checkedDhub={checkedDhub}
              setCheckedDhub={setCheckedDhub}
              handleClick={handleClick}
            />
          ) : changeDHview === 0 && formData.dhOppt !== "4" ? (
            <DealHubOpportunityTable
              data={data}
              headerData={headerData}
              setHeaderData={setHeaderData}
              rows={rows}
              versPopup={versPopup}
              setVersPopup={setVersPopup}
              checkedDhub={checkedDhub}
              setCheckedDhub={setCheckedDhub}
              dataVar={dataVar}
              newDataVar={newDataVar}
              rrId={rrId}
              handleClick={handleClick}
            />
          ) : changeDHview === 0 &&
            formData.dhOppt === "4" &&
            customerState === false ? (
            <DhAnalyticsTable data={data} />
          ) : (
            ""
          )}
        </>
      ) : searching && visibleTable && formData.viewBy == "comp" ? (
        <CompetencyTable
          tableData={data}
          rrId={rrId}
          searching={searching}
          visible={visible}
        />
      ) : searching &&
        visibleTable &&
        (formData.viewBy == "cust" ||
          formData.viewBy == "dhowner" ||
          formData.viewBy == "ctype" ||
          formData.viewBy == "csl" ||
          formData.viewBy == "dhparticipants") ? (
        <>
          {changeDHview === 1 && customerState ? (
            <OpportunityCustomers
              tableData={data}
              rrId={rrId}
              visible={visible}
              checkedDhub={checkedDhub}
              versPopup={versPopup}
              setVersPopup={setVersPopup}
              setCheckedDhub={setCheckedDhub}
              dataVar={dataVar}
              newDataVar={newDataVar}
              formData={formData}
              handleClick={handleClick}
            />
          ) : changeDHview === 0 ? (
            <DealHubOpportunityTable
              data={data}
              headerData={headerData}
              setHeaderData={setHeaderData}
              rows={rows}
              versPopup={versPopup}
              setVersPopup={setVersPopup}
              checkedDhub={checkedDhub}
              setCheckedDhub={setCheckedDhub}
              dataVar={dataVar}
              newDataVar={newDataVar}
              rrId={rrId}
              handleClick={handleClick}
            />
          ) : (
            ""
          )}
        </>
      ) : searching && visibleTable && formData.viewBy == "consl" ? (
        <OpportunityConsultant tableData={data} rrId={rrId} visible={visible} />
      ) : searching && visibleTable && formData.viewBy == "exec" ? (
        <>
          {changeDHview === 1 ? (
            <Executive
              tableData={data}
              rrId={rrId}
              visible={visible}
              checkedDhub={checkedDhub}
              versPopup={versPopup}
              setVersPopup={setVersPopup}
              setCheckedDhub={setCheckedDhub}
              dataVar={dataVar}
              newDataVar={newDataVar}
            />
          ) : changeDHview === 0 ? (
            <DealHubOpportunityTable
              data={data}
              headerData={headerData}
              setHeaderData={setHeaderData}
              rows={rows}
              versPopup={versPopup}
              setVersPopup={setVersPopup}
              checkedDhub={checkedDhub}
              setCheckedDhub={setCheckedDhub}
              dataVar={dataVar}
              newDataVar={newDataVar}
              rrId={rrId}
              handleClick={handleClick}
            />
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
      {loaderState ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}
export default Opportunities;
