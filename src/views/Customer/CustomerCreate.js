import axios from "axios";
import React, { useState } from "react";
import { useEffect, useLayoutEffect } from "react";
import { BiCheck, BiSave } from "react-icons/bi";
import { RiProfileLine } from "react-icons/ri";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { MdAddBox, MdAddCircleOutline } from "react-icons/md";
import { useRef } from "react";
import PONumberPopup from "../DeliveryComponent/PONumberPopup";
import EmailPopUp from "./EmailPopUP";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { VscSave } from "react-icons/vsc";
import { ImCross } from "react-icons/im";
import { Navigate, useNavigate } from "react-router-dom";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { AiFillWarning } from "react-icons/ai";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { FaSave } from "react-icons/fa";

function CustomerCreate(props) {
  const { urlState, permission, buttonState, setButtonState, setUrlState } =
    props;
  const [logged, setlogged] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [engagementType, setEngagementType] = useState([]);
  const [contract, setContract] = useState([]);
  const [paymentTerm, setPaymentTerm] = useState([]);
  const [invoiceCycle, setInvoiceCycle] = useState([]);
  const [invoiceCulture, setInvoiceCulture] = useState([]);
  const [invoiceTemplate, setInvoiceTemplate] = useState([]);
  const [invoiceTime, setInvoiceTime] = useState([]);
  const [engCompany, setEngCompany] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [contractModel, setContractModel] = useState([]);
  const [projectcategory, setProjectCategory] = useState([]);
  const [resource, setResource] = useState([]);
  const [resource1, setResource1] = useState([]);
  const [resource2, setResource2] = useState([]);
  const [resource3, setResource3] = useState([]);
  const [resource4, setResource4] = useState([]);
  const [resource5, setResource5] = useState([]);
  const [resource6, setResource6] = useState([]);
  const [resource7, setResource7] = useState([]);
  const [resource8, setResource8] = useState([]);
  const [resource9, setResource9] = useState([]);
  const [resource10, setResource10] = useState([]);
  const [resource11, setResource11] = useState([]);
  const [resource12, setResource12] = useState([]);
  const [resource13, setResource13] = useState([]);
  const [resource14, setResource14] = useState([]);
  const navigate = useNavigate();
  const [month, setMonth] = useState();

  const [salesTerritories, setSalesTerritories] = useState([]);
  const [classification, setClassification] = useState([]);
  const [industryType, setIndustryType] = useState([]);
  const [size, setSize] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [addList, setAddList] = useState([{}]);
  const [addList1, setAddList1] = useState([{}]);
  const [data, setData] = useState();
  const [zip, setZip] = useState();
  const [countryId, setcountryId] = useState([]);
  const [cCountryId, setcCountryId] = useState([]);
  const [sName, setSName] = useState([]);
  const [cCName, setCCName] = useState();
  const [states, setStates] = useState([]);
  const [finalstates, setFinalStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [finalcities, setFinalCities] = useState([]);
  const [EndDt, setEndDt] = useState();
  const [StartDt, setStartDt] = useState();
  const [postDetails, setPostDetails] = useState([]);
  const [clickButtonPopUp, setClickButtonPopUp] = useState(false);
  const [successvalidationmessage, setSuccessvalidationmessage] =
    useState(false);
  const [message, setMessage] = useState(false);
  const [displayCountry, setDisplayCountry] = useState();
  const [displayTextEmails, setDisplayTextEmails] = useState([]);
  const [cust, setCust] = useState(0);
  const [uniqueMessage, setUniqueMessage] = useState(false);
  const intialOnChangeState = {
    poNumber: "",
  };
  const intialOnChangeState1 = {
    customerEmails: "",
  };
  const [finalState, setFinalState] = useState({});
  const [finalState1, setFinalState1] = useState({});
  const [onChangeState, setOnChangeState] = useState(intialOnChangeState);
  const [onChangeState1, setOnChangeState1] = useState(intialOnChangeState1);
  const [selectedValue, setSelectedValue] = useState("");
  const [userName, setUsername] = useState([]);
  const handleChangeCustom = (e) => {
    setSelectedValue(e.target.value);
  };

  const [details, setDetails] = useState({
    loggedId: loggedUserId,
    fullName: "",
    salesPersonId: "",
    cslId: "",
    cslHeadId: "",
    acslId: "",
    salesTerritoryId: "",
    typProjCatId: "",
    typIndustryId: "",
    typCustStatusId: "",
    website: "http://",
    sfAccountLink: "http://",
    phone: "",
    fax: "",
    size: "",
    custReferenceable: "",
    typClassificationId: "",
    cCountryId: "",
    countryId: "",
    clientPartnerId: "",
    clId: "",
    deliveryPartnerId: "",
    deliveryPartnerHeadId: "",
    engagementPartnerId: "",
    customerEmails: "",
    talentPartnerId: "",
    projectCoordinatorId: "",
    sqaId: "",
    accountOwnerId: "",
    isNewCustomer: "0",
    dName: "",
    address: "",
    contact: "",
    dStateId: "",
    dCityId: "",
    zipCode: "",
    eName: "",
    engagementCode: "",
    engagementModelId: "",
    startDt: "",
    endDt: "",
    managerId: "",
    executiveId: "",
    companyCostCenterId: "",
    engagementStatusId: "1",
    eCurrency: "",
    sow: "",
    sfOpportunityLink: "",
    contModelId: "",
    eState: "",
    eCity: "",
    attn: "",
    paymentTermsId: "",
    invoiceCycleId: "",
    invoiceCultureId: "",
    invoiceTemplateId: "",
    invoiceTimeId: "",
    billingInstructions: "",
    clientMessage: "",
    contractTermId: "",
    costContractTermId: "",
    revenueRecognitionId: "",
    customerDiscount: "",
    emailTemplateId: "",
    toEmails: "",
    ccEmails: "",
    bccEmails: "",
    ciInvoiceForId: "652",
    ciCurrencyId: "",
    isExpenseBillable: "1",
    ciDiscountPercent: "",
    poNumber: "",
    resourceId: "",
    month: "",
    companyId: "",
    isQbr: "0",
  });
  const getloggeduser = () => {
    axios
      .get(baseUrl + `/ProjectMS/Audit/getloggeduser?loggedId=${loggedUserId}`)
      .then((Response) => {
        let data = Response.data;
        setlogged(data);
        setDetails((prev) => ({ ...prev, resourceId: data }));
      });
  };
  const getAllCustomers = () => {
    axios
      .get(baseUrl + `/customersms/Customers/getAllCustomers`)
      .then((Response) => {
        let data = Response.data;
        setAllCustomers(data);
      });
  };

  const getAbsoluteMonths = (momentDate) => {
    let mont = Number(moment(momentDate).format("MM"));
    let yea = Number(moment(momentDate).format("YYYY"));
    return mont + yea * 12;
  };

  const calculateDuration = (e) => {
    let startMonths = getAbsoluteMonths(e);
    let endMonths = getAbsoluteMonths(moment());
    let monthDifference = endMonths - startMonths;
    monthDifference += 1;
    let dr = [];
    for (let i = 1; i <= monthDifference; i++) {
      dr.push(i);
    }
  };

  useEffect(() => {
    calculateDuration(month);
  }, []);

  const handleAdd = () => {
    let data = finalState;
    data[Object.keys(data).length] = onChangeState["poNumber"];
    setFinalState(data);
    setAddList([...addList, { poNumber: "" }]);
  };

  const handleAddEmail = () => {
    let data1 = finalState1;
    data1[Object.keys(data1).length] = onChangeState1["customerEmails"];
    // setFinalState1(data1);
    setAddList1([...addList1, { customerEmails: "" }]);
  };

  useEffect(() => {}, [addList1]);

  const handleChange = (e) => {
    const { id, name, value } = e.target;

    onChangeState[id] = value;

    setDetails((prev) => {
      return { ...prev, [id]: value };
    });

    setZip(details.zipCode == "" ? "" : details.zipCode);
    setData(details.address == "" ? "" : details.address);
  };

  const handleChange5 = (e) => {
    const { id, options } = e.target;

    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value)
      .join(","); // Join the selected values with a comma

    setDetails((prev) => ({
      ...prev,
      [id]: selectedValues,
    }));
  };

  const handleChange4 = (e) => {
    const { id, name, value } = e.target;
    details[(id, name)] = value;
  };
  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    onChangeState1[id] = value;
    details[(id, name)] = value;
  };

  const handleChange2 = (e) => {
    const { id, name, value } = e.target;
    details[(id, name)] = value;
  };

  //////////////////////////////////////Country-State-City//////////////////////////////////////

  useLayoutEffect(() => {
    let tempStates = states;
    let countryId = details.countryId;
    let fStates = tempStates.filter((d) => d.countryId == countryId);
    setFinalStates(fStates);

    let tempCities = cities;
    let stateId = details.stateId;
    let fCountries = tempCities.filter((d) => d.stateId == stateId);
    setFinalCities(fCountries);
  }, [states, cities]);

  const getcountryId = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`,
    }).then((resp) => {
      const filteredData = resp.data.filter(
        (item) => item.country_name !== "NM"
      );
      setcountryId(filteredData);
    });
  };

  const getcCountryId = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`,
    }).then((resp) => {
      const filteredData = resp.data.filter(
        (item) => item.country_name !== "NM"
      );
      setcCountryId(filteredData);
    });
  };

  const getStates = () => {
    axios({
      url: baseUrl + `/VendorMS/vendor/states`,
    }).then((resp) => {
      setStates(resp.data);
    });
  };

  const getCities = () => {
    axios({
      url: baseUrl + `/VendorMS/vendor/cities`,
    }).then((resp) => {
      setCities(resp.data);
    });
  };

  const [cName, setCName] = useState([]);
  const countryHandler = (e) => {
    let statesData = JSON.parse(JSON.stringify(states));
    let countryData = JSON.parse(JSON.stringify(countryId));
    // setCName((prev) => ({ ...prev, ["country_name"]: value }));
    // setCName(e.target.value);
    // setCName(countryId);
    {
      countryData.map((s) => {
        if (s.id == e.target.value) {
          setCName(s.country_name);
        }
      });
    }

    let fData = statesData
      .filter((d) => d.countryId == e.target.value)
      .sort((a, b) => {
        b.state - a.state;
      });

    //////////--Alphabetical Sorting--//////////
    const sortedstate = fData.sort(function (a, b) {
      var nameA = a.state.toUpperCase();
      var nameB = b.state.toUpperCase();
      if (nameA < nameB) {
        return -1; //nameA comes first
      }
      if (nameA > nameB) {
        return 1; // nameB comes first
      }
      return 0; // names must be equal
    });
    //////////----------------------//////////

    setFinalStates(sortedstate);
    const { id, name, value } = e.target;
    setDetails((prev) => ({ ...prev, [id]: value }));
    setDisplayCountry(details.countryId);
  };

  const stateHandler = (e) => {
    let citiesData = JSON.parse(JSON.stringify(cities));
    let Finalcities = JSON.parse(JSON.stringify(finalstates));
    let fData = citiesData.filter((d) => d.stateId == e.target.value);
    {
      Finalcities.map((d) => {
        if (d.id == e.target.value) {
          setSName(d.state);
          setDetails((prev) => ({ ...prev, eState: d.state }));
        }
      });
    }

    //////////--Alphabetical Sorting--//////////
    const sortedcities = fData.sort(function (a, b) {
      var nameA = a.city.toUpperCase();
      var nameB = b.city.toUpperCase();
      if (nameA < nameB) {
        return -1; //nameA comes first
      }
      if (nameA > nameB) {
        return 1; // nameB comes first
      }
      return 0; // names must be equal
    });
    //////////------------------------//////////

    setFinalCities(sortedcities);
    const { id, value } = e.target;
    setDetails((prev) => ({ ...prev, [id]: value }));
  };
  const cityIdHandler = (e) => {
    let citiesData = JSON.parse(JSON.stringify(cities));
    {
      citiesData.map((c) => {
        if (c.id == e.target.value) {
          setCCName(c.city);
          setDetails((prev) => ({ ...prev, eCity: c.city }));
        }
      });
    }
    const { id, value } = e.target;
    setDetails((prev) => ({ ...prev, [id]: value }));
  };

  const handleContractModel = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getContractModel`,
    }).then((res) => {
      let custom = res.data;
      setContractModel(custom);
    });
  };

  const handleEngagementType = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getEngagementType`,
    }).then((res) => {
      let engtype = res.data;
      const filteredData = engtype.filter(
        (item) => item.id !== 356 && item.id !== 355
      );
      setEngagementType(filteredData);
    });
  };

  const handleContract = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getContractTerms`,
    }).then((res) => {
      let contact = res.data;
      const filterData1 = contact.filter((item) => item.id !== 612);
      setContract(filterData1);
    });
  };

  const handlePaymentTerm = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getPaymentTerms`,
    }).then((res) => {
      let payterm = res.data;
      setPaymentTerm(payterm);
    });
  };

  const handleInvoiceCycle = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getInvoiceCycle`,
    }).then((res) => {
      let invcycle = res.data;
      setInvoiceCycle(invcycle);
    });
  };

  const handleInvoiceCulture = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getInvoiceCulture`,
    }).then((res) => {
      let inculture = res.data;
      setInvoiceCulture(inculture);
    });
  };

  const handleInvoiceTemplate = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getInvoiceTemplate`,
    }).then((res) => {
      let invtemp = res.data;
      setInvoiceTemplate(invtemp);
    });
  };

  const handleInvoiceTime = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getInvoiceTime`,
    }).then((res) => {
      let intime = res.data;
      setInvoiceTime(intime);
    });
  };

  const handleCurrency = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getCurrency`,
    }).then((res) => {
      let curre = res.data;
      setCurrency(curre);
    });
  };

  const handleEngCompany = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getEngagementCompanay`,
    }).then((res) => {
      let compay = res.data;
      const filterData = compay.filter(
        (item) =>
          item.id !== 13 && item.id !== 12 && item.id !== 11 && item.id !== 10
      );
      setEngCompany(filterData);
    });
  };

  const handleProjectCategory = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getAllProjectCategorys`,
    }).then((res) => {
      let manger = res.data;
      setProjectCategory(manger);
    });
  };

  const resourceFnc = async () => {
    await axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then((res) => {
      let manger = res.data;

      setResource(manger);
      setResource1(manger);
      setResource2(manger);
      setResource3(manger);
      setResource4(manger);
      setResource5(manger);
      setResource6(manger);
      setResource7(manger);
      setResource8(manger);
      setResource9(manger);
      setResource10(manger);
      setResource11(manger);
      setResource12(manger);
      setResource13(manger);
      setResource14(manger);
    });
  };
  const handleSalesTerritories = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getSalesTerritories`,
    }).then((res) => {
      let manger = res.data;
      setSalesTerritories(manger);
    });
  };

  const handleClassification = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getClassification`,
    }).then((res) => {
      let manger = res.data;
      setClassification(manger);
    });
  };

  const handleIndustryType = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getIndustryType`,
    }).then((res) => {
      let manger = res.data;
      setIndustryType(manger);
    });
  };

  const handleSize = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getSize`,
    }).then((res) => {
      let manger = res.data;
      setSize(manger);
    });
  };

  const getid = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getcustomerid`,
    }).then((res) => {
      let cust = res.data;
      setCust(cust);
    });
  };

  useEffect(() => {}, [cust], [cName]);

  const handlePostDetails = () => {
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setSuccessvalidationmessage(true);
      }
      return;
    }

    let customerNamesArr = allCustomers.filter((d) => d !== null);
    let someDataa = customerNamesArr.some(
      (d) => d.full_name == details.fullName
    );

    if (someDataa) {
      let ele = document.getElementsByClassName("unique");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }

      setUniqueMessage(true);
      setSuccessvalidationmessage(false);
      setTimeout(() => {
        setUniqueMessage(false);
      }, 3000);
      return;
    }

    let finalObj = details;

    finalObj["customerEmails"] = Object.values(finalState1).toString();
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Engagement/postEngagementsCusDetails`,
      data: details,
    }).then(function (res) {
      var resp = res.data;
      setPostDetails(resp);
      setMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSuccessvalidationmessage(false);
      setTimeout(() => {
        setMessage(false);

        window.open(
          `/#/search/customerSearch/customer/dashboard/:${resp.status.id}`,
          `_self`
        );
      }, 1000);
    });
  };
  const ref = useRef([]);

  const handleCancel1 = () => {
    let ele = document.getElementsByClassName("cancel");
    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";

      if (ele[index].classList.contains("reactautocomplete")) {
        ele[
          index
        ].children[0].children[0].children[0].children[0].children[0].children[1]?.click();
      }
    }
  };
  const handleCancel = (e) => {
    let ele = document.getElementsByClassName("cancel");

    GlobalCancel(ref);
    setSuccessvalidationmessage(false);

    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";

      if (ele[index].classList.contains("reactautocomplete")) {
        ele[
          index
        ].children[0].children[0].children[0].children[0].children[0].children[1]?.click();
      }
    }
  };

  const clickHanlderPopUp = () => {
    setButtonPopup(true);
  };
  const clickButtonHandlerPopUp = () => {
    setClickButtonPopUp(true);
  };

  useEffect(() => {
    handleEngagementType();
    handleContract();
    getloggeduser();
    getcountryId();
    getStates();
    getCities();
    getAllCustomers();
    getcCountryId();
    getid();
  }, []);

  useEffect(() => {
    handleProjectCategory();
    handleSalesTerritories();
    handleClassification();
    handleIndustryType();
    handleSize();
  }, []);

  useEffect(() => {
    resourceFnc();
  }, []);

  useEffect(() => {
    handlePaymentTerm();
    handleInvoiceCycle();
    handleInvoiceCulture();
    handleInvoiceTemplate();
    handleInvoiceTime();
  }, []);

  useEffect(() => {
    handleCurrency();
    handleEngCompany();
    handleContractModel();
  }, []);

  useEffect(() => {}, [postDetails]);

  const handleNewCustomerChange = (e) => {
    setDetails((prev) => ({ ...prev, ["isNewCustomer"]: "1" }));
  };

  const handleExistingCustomerChange = (e) => {
    setDetails((prev) => ({ ...prev, ["isNewCustomer"]: "0" }));
  };

  const handleIsBillableChange = (e) => {
    setDetails((prev) => ({ ...prev, ["isExpenseBillable"]: "1" }));
  };

  const handleNoBillableChange = (e) => {
    setDetails((prev) => ({ ...prev, ["isExpenseBillable"]: "0" }));
  };

  const handleClear = () => {
    setDetails((prev) => ({ ...prev, salesPersonId: "" }));
  };

  const handleClear1 = () => {
    setDetails((prev) => ({ ...prev, clientPartnerId: "" }));
  };

  const handleClear2 = () => {
    setDetails((prev) => ({ ...prev, engagementPartnerId: "" }));
  };

  const handleClear3 = () => {
    setDetails((prev) => ({ ...prev, clId: "" }));
  };

  const handleClear4 = () => {
    setDetails((prev) => ({ ...prev, cslHeadId: "" }));
  };

  const handleClear5 = () => {
    setDetails((prev) => ({ ...prev, cslId: "" }));
  };

  const handleClear6 = () => {
    setDetails((prev) => ({ ...prev, acslId: "" }));
  };

  const handleClear7 = () => {
    setDetails((prev) => ({ ...prev, deliveryPartnerHeadId: "" }));
  };

  const handleClear8 = () => {
    setDetails((prev) => ({ ...prev, deliveryPartnerId: "" }));
  };

  const handleClear9 = () => {
    setDetails((prev) => ({ ...prev, talentPartnerId: "" }));
  };

  const handleClear10 = () => {
    setDetails((prev) => ({ ...prev, projectCoordinatorId: "" }));
  };

  const handleClear11 = () => {
    setDetails((prev) => ({ ...prev, sqaId: "" }));
  };

  const handleClear12 = () => {
    setDetails((prev) => ({ ...prev, managerId: "" }));
  };

  const handleClear13 = () => {
    setDetails((prev) => ({ ...prev, executiveId: "" }));
  };

  const handleClear14 = () => {
    setDetails((prev) => ({ ...prev, accountOwnerId: "" }));
  };
  const onChangeHandler = (e) => {
    setDetails((prevProps) => ({
      ...prevProps,
      salesPersonId: e.id,
    }));
  };
  const onChangeHandler1 = (e) => {
    setDetails((prevProps) => ({
      ...prevProps,
      clientPartnerId: e.id,
    }));
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Create Customer"];
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
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Financial Plan & Review"
        ),
      }));
      updatedMenuData.forEach((item) => {
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
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <div className="tabsProject">
              {permission.map((button) => (
                <button
                  key={button.id}
                  className={
                    buttonState === button.display_name.toString()
                      ? "buttonDisplayClick"
                      : "buttonDisplay"
                  }
                  onClick={() => {
                    setButtonState(button.display_name.toString());
                    setUrlState(button.url_path.toString().replace(/::/g, "/"));
                  }}
                >
                  {/* clg */}

                  {button.display_name}
                </button>
              ))}
            </div>
          </div>
          <div className="childTwo">
            <h2>Create Customer</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {message ? (
        <div className="statusMsg success">
          <span>
            <BiCheck />
            customer created successfully
          </span>
        </div>
      ) : (
        ""
      )}
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
      {uniqueMessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Customer is already exist with this name
        </div>
      ) : (
        ""
      )}
      <div className="mb-3 mt-2 container-fluid   customCard cancel">
        <div className="group-content row">
          <div className="col-md-9">
            <div className="row">
              <div className="form-group col-md-8 mb-2">
                <label htmlFor="fullName">
                  Customer Name <span className="error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <input
                    type="text"
                    className="unique cancel"
                    name="fullName"
                    id="fullName"
                    onChange={handleChange2}
                  />
                </div>
              </div>
              <div className="form-group col-md-4 mb-2">
                <label htmlFor="typCustStatusId">
                  Customer Status&nbsp;<span className="error-text">*</span>
                </label>
                <select
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                  className="text cancel"
                  name="typCustStatusId"
                  id="typCustStatusId"
                  onChange={handleChange}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value={160}>New</option>
                  <option value={161}>Active</option>
                  <option value={162}>InActive</option>
                </select>
              </div>
              <div className="form-group col-md-4 mb-2">
                <label htmlFor="size">Size</label>
                <select
                  className="cancel"
                  name="size"
                  id="size"
                  onChange={handleChange4}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  {size.map((Item, index) => (
                    <option key={index} value={Item.id}>
                      {Item.lkup_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-4 mb-2">
                <label htmlFor="salesTerritoryId">
                  Sales Territory&nbsp;<span className="error-text">*</span>
                </label>
                <select
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                  className="text cancel"
                  name="salesTerritoryId"
                  id="salesTerritoryId"
                  onChange={handleChange}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  {salesTerritories
                    .sort((a, b) => a.full_name.localeCompare(b.full_name))
                    .map((Item, index) => (
                      <option key={index} value={Item.id}>
                        {Item.full_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group col-md-4 mb-2">
                <label htmlFor="typIndustryId">
                  Industry type&nbsp;<span className="error-text">*</span>
                </label>
                <select
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                  className="text cancel"
                  id="typIndustryId"
                  name="typIndustryId"
                  onChange={handleChange}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  {industryType
                    .sort((a, b) => a.lkup_name.localeCompare(b.lkup_name))
                    .map((Item, index) => (
                      <option key={index} value={Item.id}>
                        {Item.lkup_name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-group col-md-3 mb-2">
            <label htmlFor="typProjCatId" class="srk">
              Project Category&nbsp;<span className="error-text">*</span>
            </label>
            <select
              ref={(ele) => {
                ref.current[4] = ele;
              }}
              className="auto text  cancel"
              name="typProjCatId"
              id="typProjCatId"
              onChange={handleChange}
              multiple
              // size={5}
              // value={details.typProjCatId}
            >
              {projectcategory.map((Item, index) => (
                <option key={index} value={Item.id}>
                  {Item.project_category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-3 mb-2">
            <label htmlFor="salesPersonId">
              Sales Executive&nbsp;<span className="error-text">*</span>
            </label>
            <div
              className="autoComplete-container cancel  reactautocomplete"
              ref={(ele) => {
                ref.current[5] = ele;
              }}
            >
              <RiskAutoComplete
                riskDetails={resource}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="salesPersonId"
                id="salesPersonId"
                placeholder="Type minimum 3 characters to get the list"
                onClear={handleClear}
                setUsername={setUsername}
                onChangeHandler={onChangeHandler}
              />
            </div>
          </div>

          <div className="form-group col-md-3 mb-2">
            <label htmlFor="Month">
              Effective Month&nbsp;<span className="error-text">*</span>
            </label>
            <div
              className="datepicker"
              ref={(ele) => {
                ref.current[6] = ele;
              }}
            >
              <DatePicker
                name="month"
                id="month"
                className="cancel"
                placeholderText="month"
                selected={month}
                // showMonthDropdown
                // showYearDropdown
                onChange={(e) => {
                  calculateDuration(e);
                  setDetails((prev) => ({
                    ...prev,
                    ["month"]: moment(e).format("yyyy-MM-DD"),
                  }));
                  setMonth(e);
                }}
                dateFormat="MMM-yyyy"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                showMonthYearPicker
              />
            </div>
          </div>

          <div className="form-group col-md-3 mb-2">
            <label htmlFor="clientPartnerId">Client Partner</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource1}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="clientPartnerId"
                id="clientPartnerId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={onChangeHandler1}
                onClear={handleClear1}
                setUsername={setUsername}
                showIcon={false}
              />
            </div>
          </div>

          <div className="form-group col-md-3 mb-2">
            <label htmlFor="engagementPartnerId">Engagement Partner</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource2}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="engagementPartnerId"
                id="engagementPartnerId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    engagementPartnerId: e.id,
                  }));
                }}
                setUsername={setUsername}
                onClear={handleClear2}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="clId">Competency Lead</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource3}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="clId"
                id="clId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    clId: e.id,
                  }));
                }}
                setUsername={setUsername}
                onClear={handleClear3}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="cslHeadId">CSL Head</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource4}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="cslHeadId"
                id="cslHeadId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    cslHeadId: e.id,
                  }));
                }}
                setUsername={setUsername}
                onClear={handleClear4}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="cslId">CSL</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource5}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="cslId"
                id="cslId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    cslId: e.id,
                  }));
                }}
                setUsername={setUsername}
                onClear={handleClear5}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="acslId">Associate CSL</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource6}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="acslId"
                id="acslId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    acslId: e.id,
                  }));
                }}
                setUsername={setUsername}
                onClear={handleClear6}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="deliveryPartnerHeadId">Delivery Partner Head</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource7}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="deliveryPartnerHeadId"
                id="deliveryPartnerHeadId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    deliveryPartnerHeadId: e.id,
                  }));
                }}
                onClear={handleClear7}
                setUsername={setUsername}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="deliveryPartnerId">Delivery Partner</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource8}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="deliveryPartnerId"
                id="deliveryPartnerId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    deliveryPartnerId: e.id,
                  }));
                }}
                onClear={handleClear8}
                setUsername={setUsername}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="talentPartnerId">Talent Partner</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource9}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="talentPartnerId"
                id="talentPartnerId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    talentPartnerId: e.id,
                  }));
                }}
                onClear={handleClear9}
                setUsername={setUsername}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="projectCoordinatorId">Project co-ordinator</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource10}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="projectCoordinatorId"
                id="projectCoordinatorId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    projectCoordinatorId: e.id,
                  }));
                }}
                onClear={handleClear10}
                setUsername={setUsername}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="sqaId">SQA</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource11}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="sqaId"
                id="sqaId"
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    sqaId: e.id,
                  }));
                }}
                onClear={handleClear11}
                setUsername={setUsername}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="cCountryId">Country</label>

            <select
              name="cCountryId"
              className="cancel"
              id="cCountryId"
              onChange={(e) => handleChange(e)}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {cCountryId.map((Item, index) => (
                <option key={index} value={Item.id}>
                  {Item.country_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="typClassificationId">Classification</label>
            <select
              name="typClassificationId"
              className="cancel"
              id="typClassificationId"
              onChange={handleChange}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {classification.map((Item, index) => (
                <option key={index} value={Item.id}>
                  {Item.lkup_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="ciDiscountPercent">Discount (%)</label>
            <input
              type="text"
              className=" cancel"
              id="ciDiscountPercent"
              name="ciDiscountPercent"
              maxLength={6}
              onKeyDown={(e) =>
                e.keyCode &&
                (e.keyCode <= 47 || e.keyCode >= 58) &&
                e.keyCode != 8 &&
                e.preventDefault()
              }
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="currencyId">Customer Currency</label>
            <select
              className="cancel"
              id="ciCurrencyId"
              name="ciCurrencyId"
              onChange={handleChange}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {currency.map((Item, index) => (
                <option key={index} value={Item.id}>
                  {Item.currency}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              name="website"
              className=" cancel"
              id="website"
              required
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              className=" cancel"
              id="phone"
              maxLength={15}
              onKeyDown={(e) =>
                e.keyCode &&
                (e.keyCode <= 47 || e.keyCode >= 58) &&
                e.keyCode != 8 &&
                e.preventDefault()
              }
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="fax">Fax Number</label>
            <input
              type="text"
              className=" cancel"
              id="fax"
              name="fax"
              maxLength={15}
              onKeyDown={(e) =>
                e.keyCode &&
                (e.keyCode <= 47 || e.keyCode >= 58) &&
                e.keyCode != 8 &&
                e.preventDefault()
              }
              onChange={handleChange}
            />
          </div>
          <div className=" col-md-3">
            <label htmlFor="isExpenseBillable">Expense Billable</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input cancel"
                type="radio"
                value="1"
                name="isExpenseBillable"
                id="isExpenseBillable"
                onChange={handleIsBillableChange}
                checked={details["isExpenseBillable"] === "1"}
              />
              <label className="form-check-label cancel" htmlFor="yes">
                Yes
              </label>
            </div>
            <div className="form-check form-check-inline cancel">
              <input
                className="form-check-input cancel"
                type="radio"
                value="0"
                name="isExpenseBillable"
                id="isExpenseBillable"
                onChange={handleNoBillableChange}
                checked={details["isExpenseBillable"] === "0"}
              />
              <label className="form-check-label cancel" htmlFor="no">
                No
              </label>
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="sfAccountLink">SF Account Link</label>
            <input
              type="text"
              name="sfAccountLink"
              className=" cancel"
              id="sfAccountLink"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="customerEmails">Customer Email</label>
            <div className="row">
              <div className="col-md-10">
                <input
                  type="text"
                  name="customerEmails"
                  className="disableField"
                  id="customerEmails"
                  value={Object.values(finalState1).toString()}
                  disabled
                  onChange={handleChange1}
                />
              </div>
              <div className="col-md-1">
                <MdAddBox
                  cursor="pointer"
                  onClick={() => {
                    clickButtonHandlerPopUp();
                  }}
                />
              </div>
            </div>
          </div>

          <div className="form-group col-md-3 mb-2">
            <label htmlFor="custReferenceable">
              Is this customer referenceable?
            </label>
            <select
              id="custReferenceable"
              className="cancel"
              name="custReferenceable"
              onChange={handleChange}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option value={1}>Yes</option>
              <option value={2}>No</option>
            </select>
          </div>

          <div className="form-group col-md-3 mb-2">
            <label htmlFor="accountOwnerId">Account Owner</label>
            <div className="autoComplete-container cancel  reactautocomplete">
              <RiskAutoComplete
                riskDetails={resource14}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="accountOwnerId"
                id="accountOwnerId"
                // className="err cancel"
                //fuseOptions={{ keys: ["id", "name"] }}
                //resultStringKeyName="name"
                //resource1={resource1}
                // resourceFnc={resourceFnc}
                placeholder="Type minimum 3 characters to get the list"
                //placeholder=""=""
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    accountOwnerId: e.id,
                  }));
                }}
                onClear={handleClear14}
                setUsername={setUsername}
                showIcon={false}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label htmlFor="isNewCustomer">New Logo</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input cancel"
                type="radio"
                value="1"
                name="isNewCustomer"
                id="isNewCustomerYes"
                checked={details["isNewCustomer"] === "1"}
                onChange={handleNewCustomerChange}
              />
              <label
                className="form-check-label cancel"
                htmlFor="isNewCustomerYes"
              >
                Yes
              </label>
            </div>
            <div className="form-check form-check-inline cancel">
              <input
                className="form-check-input cancel"
                type="radio"
                value="0"
                name="isNewCustomer"
                id="isNewCustomerNo"
                checked={details["isNewCustomer"] === "0"}
                onChange={handleExistingCustomerChange}
              />
              <label
                className="form-check-label cancel"
                htmlFor="isNewCustomerNo"
              >
                No
              </label>
            </div>
          </div>

          <div className="form-group col-md-3 mb-2">
            <label htmlFor="isQbr">Last QBR Date</label>
            <div>
              <select
                id="isQbr"
                name="isQbr"
                className="cancel"
                onChange={handleChange}
              >
                <option value="0">NA</option>
                <option value="1">Quarter</option>
              </select>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="mb-3 mt-2 container-fluid   customCard">
        <h2>Divisions</h2>
        <div className="group-content row">
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="dName">
              Name&nbsp;<span className="error-text">*</span>
            </label>
            <div
              className="textfield"
              ref={(ele) => {
                ref.current[7] = ele;
              }}
            >
              <input
                type="text"
                className="cancel"
                id="dName"
                name="dName"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="address">
              Address Line&nbsp;<span className="error-text">*</span>
            </label>
            <div
              className="textfield"
              ref={(ele) => {
                ref.current[8] = ele;
              }}
            >
              <input
                type="text"
                className="cancel"
                id="address"
                name="address"
                required
                onChange={(e) => {
                  handleChange1(e);
                }}
              />
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <label>
              Country&nbsp;<span className="error-text">*</span>
            </label>
            <div>
              <select
                ref={(ele) => {
                  ref.current[9] = ele;
                }}
                id="countryId"
                name="countryId"
                style={{ width: "100%", height: "25px" }}
                className="text err cancel"
                onChange={(e) => {
                  countryHandler(e);
                }}
              >
                <option key="" value="">
                  {"<<Please Select>>"}
                </option>
                {countryId
                  .sort((a, b) => {
                    return b.country_name - a.country_name;
                  })
                  .map((data, index) => (
                    <option
                      key={data.id}
                      id="countryId"
                      value={data.id}
                      selected={details?.countryId == data.id ? true : false}
                    >
                      {data.country_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <label>
              State/Province&nbsp;<span className="error-text">*</span>
            </label>
            <div>
              <select
                ref={(ele) => {
                  ref.current[10] = ele;
                }}
                id="dStateId"
                name="dStateId"
                style={{ width: "100%", height: "25px" }}
                className="text err cancel"
                onChange={(e) => {
                  stateHandler(e);
                }}
                required
              >
                <option key="" value="">
                  {"<<Please Select>>"}
                </option>
                {finalstates
                  .sort((a, b) => {
                    return b.stateId - a.stateId;
                  })
                  .map((data1, index) => (
                    <option
                      key={data1.country}
                      id="dStateId"
                      value={data1.id}
                      // selected={details?.stateId == data1.id ? true : false}
                      defaultValue={details?.stateId}
                    >
                      {data1.state}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="col-md-3 mb-2">
            <label>
              City&nbsp;<span className="error-text">*</span>
            </label>
            <div>
              <select
                ref={(ele) => {
                  ref.current[11] = ele;
                }}
                id="dCityId"
                name="dCityId"
                style={{ width: "100%", height: "25px" }}
                className="text cancel err"
                onChange={cityIdHandler}
              >
                <option key="" value="">
                  {"<<Please Select>>"}
                </option>
                {finalcities
                  .sort((a, b) => {
                    return b.cityId - a.cityId;
                  })
                  .map((data2) => (
                    <option
                      key={data2.state}
                      id="dCityId"
                      // selected={details?.cityId == data2.id ? true : false}
                      value={data2.id}
                    >
                      {data2.city == "" ? "" : data2.city}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="zippostalcode">ZIP/Postal Code</label>
            <input
              name="zipCode"
              type="text"
              className="cancel"
              id="zipCode"
              //placeholder=""=""
              maxLength={12}
              // onChange={handleChange}
              // onChange={(e) => {
              //   handleChange1(e);
              // }}
              // onKeyDown={(e) => {
              //   e.preventDefault();
              // }}

              onKeyDown={(e) =>
                e.keyCode &&
                (e.keyCode <= 47 || e.keyCode >= 58) &&
                e.keyCode != 8 &&
                e.preventDefault()
              }
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="contactnumber">Contact Number</label>
            <input
              name="contact"
              type="text"
              className="cancel"
              id="contact"
              //placeholder=""
              maxLength={20}
              onKeyDown={(e) =>
                e.keyCode &&
                (e.keyCode <= 47 || e.keyCode >= 58) &&
                e.keyCode != 8 &&
                e.preventDefault()
              }
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="mb-3 mt-2 container-fluid   customCard">
        <h2>Engagement</h2>
        <div className="group-content row">
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="engagementCode">
              Code&nbsp;<span className="error-text">*</span>
            </label>
            <div
              className="textfield cancel"
              ref={(ele) => {
                ref.current[12] = ele;
              }}
            >
              <input
                name="engagementCode"
                type="text"
                className="cancel"
                id="engagementCode"
                //placeholder=""
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="name">
              Name&nbsp;<span className="error-text">*</span>
            </label>
            <div
              className="textfield cancel"
              ref={(ele) => {
                ref.current[13] = ele;
              }}
            >
              <input
                name="eName"
                type="text"
                className="cancel"
                id="eName"
                //placeholder=""
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="engagementModelId">
              Engagement Type&nbsp;<span className="error-text">*</span>
            </label>
            <select
              ref={(ele) => {
                ref.current[14] = ele;
              }}
              className="text cancel"
              id="engagementModelId"
              name="engagementModelId"
              onChange={handleChange}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {engagementType.map((Item, index) => (
                <option key={index} value={Item.id}>
                  {Item.engagementType}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="startDt">
              Start Date&nbsp;<span className="error-text">*</span>
            </label>
            <div
              className="datepicker"
              ref={(ele) => {
                ref.current[15] = ele;
              }}
            >
              <DatePicker
                name="startDt"
                selected={StartDt}
                id="startDt"
                className="err cancel"
                dateFormat="dd-MMM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onChange={(e) => {
                  setDetails((prev) => ({
                    ...prev,
                    ["startDt"]: moment(e).format("yyyy-MM-DD"),
                  }));
                  setStartDt(e);
                }}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                autoComplete="false"
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="endDt">End Date</label>
            <DatePicker
              name="endDt"
              // selected={EndDt}
              selected={details.endDt === "" ? "" : new Date(details.endDt)}
              id="endDt"
              className="err cancel"
              dateFormat="dd-MMM-yyyy"
              showMonthDropdown
              showYearDropdown
              minDate={StartDt ? StartDt : undefined}
              dropdownMode="select"
              onChange={(e) => {
                setDetails((prev) => ({
                  ...prev,
                  ["endDt"]: moment(e).format("yyyy-MM-DD"),
                }));
                setEndDt(e);
              }}
              autoComplete="false"
            />
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="manager ">
              Manager&nbsp;<span className="error-text">*</span>
            </label>
            <div
              className="autoComplete-container cancel  reactautocomplete"
              ref={(ele) => {
                ref.current[16] = ele;
              }}
            >
              <RiskAutoComplete
                riskDetails={resource12}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="managerId"
                id="managerId"
                //fuseOptions={{ keys: ["id", "name"] }}
                //resultStringKeyName="name"
                //resource1={resource1}
                // resourceFnc={resourceFnc}
                placeholder="Type minimum 3 characters to get the list"
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    managerId: e.id,
                  }));
                }}
                onClear={handleClear12}
                setUsername={setUsername}
                showIcon={false}
              />
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="executive ">
              Sales Executive&nbsp;<span className="error-text">*</span>
            </label>
            <div
              className="autoComplete-container cancel  reactautocomplete"
              ref={(ele) => {
                ref.current[17] = ele;
              }}
            >
              <RiskAutoComplete
                riskDetails={resource13}
                setFormData={setDetails}
                getData={resourceFnc}
                value="0"
                type="Text"
                name="executiveId"
                id="executiveId"
                // className="error AutoComplete cancel"
                //fuseOptions={{ keys: ["id", "name"] }}
                //resultStringKeyName="name"
                //resource1={resource1}
                // resourceFnc={resourceFnc}
                placeholder="Type minimum 3 characters to get the list"
                // //placeholder=""=""
                onChangeHandler={(e) => {
                  setDetails((prevProps) => ({
                    ...prevProps,
                    executiveId: e.id,
                  }));
                }}
                onClear={handleClear13}
                setUsername={setUsername}
                showIcon={false}
              />
              {/* </div> */}
            </div>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="contModelId">Contract Model</label>
            <select
              className="cancel"
              name="contModelId"
              id="contModelId"
              onChange={(e) => handleChange(e)}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {contractModel
                .sort((a, b) => a.lkup_name.localeCompare(b.lkup_name))
                .map((Item, index) => (
                  <option key={index} value={Item.id}>
                    {Item.lkup_name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="companyCostCenter">Cost Center </label>
            <>
              <span className="companyCostCenter" id="companyCostCenterId">
                <div className="poBtn" style={{ cursor: "pointer" }}>
                  <MdAddCircleOutline />
                  <span className="companyCostCenter">Select Cost Center</span>
                </div>
              </span>
            </>
            {/* <input
              type="text"
              name="companyCostCenterId"
              className="cancel"
              id="companyCostCenterId"
              //placeholder=""
              required
              onChange={handleChange}
            /> */}
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="status">Status</label>
            <select
              className=""
              id="engagementStatusId"
              name="engagementStatusId"
              onChange={handleChange}
            >
              {/* <option value=""> &lt;&lt;Please Select&gt;&gt;</option> */}
              <option value="1" selected>
                Active
              </option>
              <option value="2">InActive</option>
            </select>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="currency">
              Currency&nbsp;<span className="error-text">*</span>
            </label>
            <select
              className="text cancel"
              id="eCurrency"
              name="eCurrency"
              onChange={(e) => handleChange(e)}
              ref={(ele) => {
                ref.current[18] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {currency.map((Item, index) => (
                <option key={index} value={Item.id}>
                  {Item.currency}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="sow">SOW</label>
            <input
              type="text"
              name="sow"
              className="cancel"
              id="sow"
              //placeholder=""
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="sfOpportunityLink">
              Salesforce Opportunity Link
            </label>
            <input
              type="text"
              name="sfOpportunityLink"
              className="cancel"
              id="sfOpportunityLink"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-3 mb-2">
            <label htmlFor="poNumber">PO Number</label>
            <div className="poBtn" id="poNumber">
              <MdAddCircleOutline />
              <span
                className="poNumber"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  clickHanlderPopUp();
                }}
              >
                Add/Edit PO Number
              </span>
            </div>
          </div>

          <div className="form-group col-md-3 mb-2">
            <label htmlFor="companyId">
              Eng.Company&nbsp;<span className="error-text">*</span>
            </label>
            <select
              className="text cancel"
              name="companyId"
              id="companyId"
              onChange={(e) => handleChange(e)}
              ref={(ele) => {
                ref.current[19] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {engCompany
                .sort((a, b) => a.Company.localeCompare(b.Company))
                .map((Item, index) => (
                  <option key={index} value={Item.id}>
                    {" "}
                    {Item.Company}
                  </option>
                ))}
            </select>
          </div>
          <div className="group mb-3 container-fluid   customCard">
            <h2>
              <RiProfileLine /> Billing Information
            </h2>
            <div className="row cancel">
              <div className="col-md-4">
                <h2>Bill to Details</h2>
                <div className="group-content row">
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-md-5" htmlFor="name">
                        Attn.
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        <input
                          type="text"
                          className=" cancel"
                          id="attn"
                          name="attn"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="name-input-inline">
                        Address Line
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        <p className="col-6" id="name-input-inline">
                          {data}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="name-input-inline">
                        City
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        <p className="col-12" id="name-input-inline">
                          {cCName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="name-input-inline">
                        State/Province
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        <p className="col-12" id="name-input-inline">
                          {sName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="name-input-inline">
                        ZIP/Postal Code
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        <p className="col-6" id="name-input-inline">
                          {zip}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="name-input-inline">
                        Country
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        <p className="col-6" id="name-input-inline">
                          {cName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <h2>Invoice Details</h2>
                <div className="row cancel">
                  <div className="col-md-6 mt-2">
                    <div className=" row ">
                      <div className=" col-md-12">
                        <div className="frmo-group row mb-2">
                          <label className="col-5" htmlFor="paymentTermsId">
                            {" "}
                            Payment Terms&nbsp;
                            <span className="error-text">*</span>
                          </label>
                          <span className="col-1">:</span>
                          <div className="col-6">
                            <select
                              ref={(ele) => {
                                ref.current[20] = ele;
                              }}
                              className="text cancel"
                              name="paymentTermsId"
                              id="paymentTermsId"
                              onChange={(e) => handleChange(e)}
                            >
                              <option value="">
                                {" "}
                                &lt;&lt;Please Select&gt;&gt;
                              </option>
                              {paymentTerm.map((Item, index) => (
                                <option key={index} value={Item.id}>
                                  {Item.paymentTerms}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" row ">
                      <div className=" col-md-12 ">
                        <div className="frmo-group row mb-2">
                          <label className="col-5" htmlFor="invoiceCycleId">
                            {" "}
                            Invoice Cycle&nbsp;
                            <span className="error-text">*</span>
                          </label>
                          <span className="col-1">:</span>
                          <div className="col-6">
                            <div className="d-flex">
                              {details.invoiceCycleId === "754" && (
                                <div className="mr-2">
                                  <select
                                    className="error enteredDetails cancel text"
                                    name="invoiceCycleId"
                                    id="invoiceCycleId"
                                    onChange={(e) => handleChange(e)}
                                    ref={(ele) => {
                                      ref.current[21] = ele;
                                    }}
                                  >
                                    <option value="">
                                      &lt;&lt;Please Select&gt;&gt;
                                    </option>
                                    {invoiceCycle?.map((Item) => (
                                      <option
                                        key={Item.lkup_type_group_id}
                                        selected={
                                          Item.id == details.invoiceCycleId
                                            ? true
                                            : false
                                        }
                                        value={Item.id}
                                      >
                                        {Item.invoiceCycle}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              {details.invoiceCycleId === "754" && (
                                <div>
                                  <select
                                    className="error enteredDetails cancel text"
                                    // name="custom"
                                    // id="custom"
                                    // value={details.invoiceCycleId}
                                    value={selectedValue}
                                    onChange={(e) => handleChangeCustom(e)}
                                    ref={(ele) => {
                                      ref.current[21] = ele;
                                    }}
                                  >
                                    <option value="">
                                      {"<<Please Select>>"}
                                    </option>
                                    {[...Array(31)].map((_, index) => (
                                      <option
                                        key={index + 1}
                                        value={index + 1}
                                        // selected={
                                        //   index + 1 ===
                                        //   parseInt(details.invoiceCycleId)
                                        // }
                                      >
                                        {index + 1}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                            {details.invoiceCycleId !== "754" && (
                              <select
                                className="error enteredDetails cancel text"
                                name="invoiceCycleId"
                                id="invoiceCycleId"
                                onChange={(e) => handleChange(e)}
                                ref={(ele) => {
                                  ref.current[21] = ele;
                                }}
                              >
                                <option value="">
                                  &lt;&lt;Please Select&gt;&gt;
                                </option>
                                {invoiceCycle?.map((Item) => (
                                  <option
                                    key={Item.lkup_type_group_id}
                                    selected={
                                      Item.id == details.invoiceCycleId
                                        ? true
                                        : false
                                    }
                                    value={Item.id}
                                  >
                                    {Item.invoiceCycle}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" row ">
                      <div className=" col-md-12 ">
                        <div className="form-group row mb-2">
                          <label className="col-5" htmlFor="invoiceCultureId">
                            Invoice Culture&nbsp;
                            <span className="error-text">*</span>
                          </label>
                          <span className="col-1 ">:</span>
                          <div className="col-6">
                            <select
                              ref={(ele) => {
                                ref.current[22] = ele;
                              }}
                              className="text cancel"
                              name="invoiceCultureId"
                              id="invoiceCultureId"
                              onChange={(e) => handleChange(e)}
                            >
                              <option value="">
                                {" "}
                                &lt;&lt;Please Select&gt;&gt;
                              </option>
                              {invoiceCulture.map((Item, index) => (
                                <option key={index} value={Item.id}>
                                  {Item.invoiceTime}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" row ">
                      <div className=" col-md-12 ">
                        <div className="form-group row mb-2">
                          <label className="col-5" htmlFor="templateId">
                            {" "}
                            Invoice Template&nbsp;
                            <span className="error-text">*</span>
                          </label>
                          <span className="col-1 ">:</span>
                          <div className="col-6">
                            <select
                              ref={(ele) => {
                                ref.current[23] = ele;
                              }}
                              className="text cancel"
                              name="invoiceTemplateId"
                              id="invoiceTemplateId"
                              onChange={(e) => handleChange(e)}
                            >
                              <option value="">
                                {" "}
                                &lt;&lt;Please Select&gt;&gt;
                              </option>
                              {invoiceTemplate.map((Item, index) => (
                                <option key={index} value={Item.id}>
                                  {Item.invoiceTemplate}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" row ">
                      <div className=" col-md-12 ">
                        <div className="form-group row mb-2">
                          <label className="col-5" htmlFor="timeId">
                            Invoice Time&nbsp;
                            <span className="error-text">*</span>
                          </label>
                          <span className="col-1">:</span>
                          <div className="col-6">
                            <select
                              ref={(ele) => {
                                ref.current[24] = ele;
                              }}
                              className="text cancel"
                              name="invoiceTimeId"
                              id="invoiceTimeId"
                              onChange={(e) => handleChange(e)}
                            >
                              <option value="">
                                {" "}
                                &lt;&lt;Please Select&gt;&gt;
                              </option>
                              {invoiceTime.map((Item, index) => (
                                <option key={index} value={Item.id}>
                                  {Item.invoiceTime}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="row ">
                      <div className="col-md-12 mt-2">
                        <label htmlFor="billingInstructions">
                          Billing Instructions
                        </label>
                        <textarea
                          type="text"
                          className="cancel"
                          name="billingInstructions"
                          id="billingInstructions"
                          rows={3}
                          required
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row ">
                      <div className="form-group col-md-12">
                        <label htmlFor="clientMessage">Client Message</label>
                        <textarea
                          className="cancel"
                          name="clientMessage"
                          id="clientMessage"
                          //placeholder=""=""
                          rows={2}
                          required
                          defaultValue={""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 group mb-3 container-fluid   customCard">
                <div className="group-content row ">
                  <h2>Contract</h2>
                  <div className=" row ">
                    <div className="mb-2 col-md-12">
                      <div className="form-group row">
                        <label
                          className="col-5"
                          htmlFor="Contract Terms -select"
                        >
                          {" "}
                          Contract Terms&nbsp;
                          <span className="error-text">*</span>
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <select
                            ref={(ele) => {
                              ref.current[25] = ele;
                            }}
                            className="text cancel"
                            name="contractTermId"
                            id="contractTermId"
                            onChange={(e) => handleChange(e)}
                          >
                            <option value="">
                              {" "}
                              &lt;&lt;Please Select&gt;&gt;
                            </option>
                            {contract.map((Item, index) => (
                              <option key={index} value={Item.id}>
                                {Item.contractTerm}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" row ">
                    <div className="mb-2 col-md-12">
                      <div className="form-group row">
                        <label
                          className="col-5"
                          htmlFor="Cost Contract Terms-select"
                        >
                          {" "}
                          Cost Contract Terms
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <select
                            className="cancel"
                            name="costContractTermId"
                            id="costContractTermId"
                            onChange={(e) => handleChange(e)}
                          >
                            <option value="">
                              {" "}
                              &lt;&lt;Please Select&gt;&gt;
                            </option>
                            {contract.map((Item, index) => (
                              <option key={index} value={Item.id}>
                                {Item.contractTerm}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" row ">
                    <div className="mb-2 col-md-12">
                      <div className="form-group row">
                        <label
                          className="col-5"
                          htmlFor="Revenue Recognization -select"
                        >
                          {" "}
                          Revenue Recognization{" "}
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <select
                            className="cancel"
                            name="revenueRecognitionId"
                            id="revenueRecognitionId"
                            onChange={handleChange}
                          >
                            <option value="">
                              {" "}
                              &lt;&lt;Please Select&gt;&gt;
                            </option>
                            <option value={1}>Revenue Recognization 1</option>
                            <option value={2}>Revenue Recognization 2</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" row ">
                    <div className="mb-2 col-md-12">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="customerDiscount">
                          {" "}
                          Discount (%)
                        </label>
                        <span className="col-1 ">:</span>

                        <div className="col-6">
                          <input
                            type="text"
                            className="cancel"
                            name="customerDiscount"
                            id="customerDiscount"
                            maxLength={6}
                            onKeyDown={(e) =>
                              e.keyCode &&
                              (e.keyCode <= 47 || e.keyCode >= 58) &&
                              e.keyCode != 8 &&
                              e.preventDefault()
                            }
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4 group mb-3 container-fluid   customCard">
                <div className="group-content row ">
                  <h2>Tax Structure</h2>
                  <div className=" row ">
                    <div className="mb-2 col-md-12 ">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="percentage">
                          Tax Type 1
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-2">
                          <input
                            type="text"
                            name="percentage"
                            className="cancel"
                            id="percentage"
                          />
                        </div>
                        <div className="col-2 row">
                          <input
                            type="text"
                            className="cancel"
                            id="percentage"
                            name="percentage"
                          />
                        </div>
                        <span class="col-2 ml-2 row">%</span>
                      </div>
                    </div>
                  </div>
                  <div className=" row ">
                    <div className="mb-2 col-md-12">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="percentage">
                          Tax Type 2
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-2 ">
                          <input
                            type="text"
                            name="percentage"
                            className="cancel"
                            id="percentage"
                          />
                        </div>
                        <div className="col-2 row">
                          <input
                            type="text"
                            className=" cancel"
                            id="percentage"
                            name="percentage"
                          />
                        </div>
                        <span className="col-2 ml-2 row">%</span>
                      </div>
                    </div>
                  </div>
                  <div className=" row ">
                    <div className="mb-2 col-md-12 ">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="percentage">
                          Tax Type 3
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-2">
                          <input
                            type="text"
                            name="percentage"
                            className=" cancel"
                            id="percentage"
                          />
                        </div>
                        <div className="col-2 row">
                          <input
                            type="text"
                            className=" cancel"
                            id="percentage"
                            name="percentage"
                          />
                        </div>
                        <span className="col-2 ml-2 row">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 group mb-3 container-fluid   customCard">
                <div className="group-content row">
                  <h2>Mailing Details</h2>
                  <div className=" row ">
                    <div className="mb-2 col-md-12 ">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="toEmails">
                          To
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <input
                            type="text"
                            name="toEmails"
                            className="cancel"
                            id="toEmails"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row ">
                    <div className="mb-2 col-md-12 ">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="ccEmails">
                          CC
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <input
                            type="text"
                            name="ccEmails"
                            className="cancel"
                            id="ccEmails"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" row ">
                    <div className="mb-2 col-md-12 ">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="bccEmails">
                          BCC
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <input
                            type="text"
                            name="bccEmails"
                            className="cancel"
                            id="bccEmails"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" row ">
                    <div className="mb-2 col-md-12">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="emailTemplateId">
                          Email Template
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <select
                            className="cancel"
                            id="emailTemplateId"
                            name="emailTemplateId"
                            onChange={handleChange}
                          >
                            <option value="">
                              {" "}
                              &lt;&lt;Please Select&gt;&gt;
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
        <button
          className="btn btn-primary"
          type="submit"
          onClick={() => {
            handlePostDetails();
          }}
        >
          <FaSave /> Save
        </button>
        <button
          className="btn btn-secondary"
          // onClick={() => {
          //   handleCancel2();
          // }}
          onClick={() => {
            navigate(`/customer/create`, {
              state: { btnState: "create" },
            });
            window.location.reload();
          }}
        >
          <ImCross fontSize={"11px"} />
          Cancel
        </button>
      </div>
      {buttonPopup ? (
        <PONumberPopup
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          handleChange2={handleChange}
          handleAdd={handleAdd}
          addList={addList}
          setAddList={setAddList}
          finalState={finalState}
        />
      ) : (
        ""
      )}
      {clickButtonPopUp ? (
        <EmailPopUp
          clickButtonPopUp={clickButtonPopUp}
          setClickButtonPopUp={setClickButtonPopUp}
          handleChange1={handleChange1}
          handleAddEmail={handleAddEmail}
          addList1={addList1}
          setAddList1={setAddList1}
          finalState1={finalState1}
          details={details}
          setDetails={setDetails}
          setDisplayTextEmails={setDisplayTextEmails}
          displayTextEmails={displayTextEmails}
          setFinalState1={setFinalState1}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default CustomerCreate;
