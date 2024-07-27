import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BiCheck, BiSave } from "react-icons/bi";
import { RiProfileLine } from "react-icons/ri";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { MdAddCircleOutline } from "react-icons/md";
import { ImCross } from "react-icons/im";
import PONumberPopup from "./PONumberPopup";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { AiFillWarning } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { FaSave } from "react-icons/fa";
import SalesExecutivePopUp from "./SalesExecutivePopUp";

function DeliveryCreate(props) {
  const {
    flag,
    customerName,
    customerId,
    data,
    engagementId,
    data1,
    btnState,

    setbtnState,
    tabsAccess,
  } = props;
  console.log(btnState);
  const loggedUserId = localStorage.getItem("resId");
  const HelpPDFName = "CreateEngagement.pdf";
  const HelpHeader = "Engagement Create Help";
  const baseUrl = environment.baseUrl;
  const [customer, setCustomer] = useState([]);
  const [division, setDivision] = useState([]);
  const [divisionSpare, setDivisionSpare] = useState([]);
  const [divisionspar, setDivisionspar] = useState([]);
  const [engagementType, setEngagementType] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [contract, setContract] = useState([]);
  const [costContract, setCostContract] = useState([]);
  const [paymentTerm, setPaymentTerm] = useState([]);
  const [invoiceCycle, setInvoiceCycle] = useState([]);
  const [invoiceCulture, setInvoiceCulture] = useState([]);
  const [invoiceTemplate, setInvoiceTemplate] = useState([]);
  const [invoiceTime, setInvoiceTime] = useState([]);
  const [engCompany, setEngCompany] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [addList, setAddList] = useState([]);
  const [resource, setResource] = useState([]);
  const [postDetails, setPostDetails] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [successfulmessage, setSuccessfulmessage] = useState(false);
  const [EndDt, setEndDt] = useState();

  const [StartDt, setStartDt] = useState();
  const [engDetails, setEngDetails] = useState([]);
  const [divisioneng, setDivisioneng] = useState([]);
  const [engdata, setEngData] = useState([[]]);
  const [cName, setCName] = useState("");
  const [sName, setSName] = useState("");
  const [aName, setAName] = useState("");
  const [coName, setCoName] = useState("");
  const [zName, setZName] = useState("");
  const [detailsCusId, setDetailsCusId] = useState([]);
  const [filename, setFileName] = useState([]);
  const [uniqueMessage, setUniqueMessage] = useState(false);

  const intialOnChangeState = {
    poNumber: "",
  };

  const ref = useRef([]);

  const [onChangeState, setOnChangeState] = useState(intialOnChangeState);
  const [finalState, setFinalState] = useState({});
  const [backUpData, setBackUpData] = useState({});

  const handleAdd = () => {
    let data = finalState;
    data[Object.keys(data).length] = onChangeState["poNumber"];
    setFinalState(data);
    setAddList([...addList, { poNumber: "" }]);
  };

  useEffect(() => {}, [addList, customerId]);
  const getUrlPathEngCreate = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/engagement/create&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getUrlPathEngEdit = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/customer/engagementEdit/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  useEffect(() => {
    if (btnState == "Edit") {
      getUrlPathEngEdit();
    } else {
      getUrlPathEngCreate();
    }
  }, [btnState]);

  const [details, setDetails] = useState(() => {
    if (btnState !== "Edit") {
      return {
        name: "",
        customer: flag == 1 ? customerId : "",
        division: "",
        startDt: "",
        endDt: "",
        manager: "",
        executive: "",
        status: "1",
        currency: "",
        sfOpportunityLink: "",
        valueAddedTasks: "",
        industrySolutionId: "",
        poNumber: "",
        engagementCode: "",
        company: "",
        bccEmails: "",
        attn: "",
        paymentTermsId: "",
        invoiceCycleId: "",
        invoiceCultureId: "",
        ccEmails: "",
        invoiceTemplateId: "",
        invoiceTimeId: "",
        billingInstructions: "",
        clientMessage: "",
        engagementModelId: "",
        costContractTermId: "",
        emailTemplateId: "",
        toEmails: "",
        contractTermId: "",
        percentage: "0",
        country: "4",
        loggedId: loggedUserId,
      };
    } else {
      return {
        EngagementId: engagementId,
        name: data1[0]?.tname,
        customer: data1[0]?.CustomerId,
        division: data1[0]?.DivisionId,
        startDt: data1[0]?.startDt,
        endDt: data1[0]?.endDt,
        manager: data1[0]?.ManagerId,
        executive: data1[0]?.executive,
        status: data1[0]?.StatusId == true ? 1 : 0,
        currency: data1[0]?.CurrencyId,
        sfOpportunityLink: data1[0]?.sfopportunityLink,
        valueAddedTasks: data1[0]?.valueAddedTasks,
        industrySolutionId: data1[0]?.industrySolutionId,
        poNumber: data1[0]?.poNumber,
        engagementCode: data1[0]?.code,
        company: data1[0]?.CompanyId,
        bccEmails: data1[0]?.bccEmails,
        attn: data1[0]?.attn,
        paymentTermsId: data1[0]?.paymentTermsId,
        invoiceCycleId: data1[0]?.invoiceCycleId,
        invoiceCultureId: data1[0]?.invoiceCultureId,
        ccEmails: data1[0]?.ccEmails,
        invoiceTemplateId: data1[0]?.invoiceTemplateId,
        invoiceTimeId: data1[0]?.invoiceTimeId,
        billingInstructions: data1[0]?.billingInstructions,
        clientMessage: data1[0]?.clientMessage,
        engagementModelId: data1[0]?.engagementModelId,
        costContractTermId: data1[0]?.costContractTermId,
        emailTemplateId: data1[0]?.emailTemplateId,
        toEmails: data1[0]?.toEmails,
        contractTermId: data1[0]?.contractTermId,
        percentage: data1[0]?.percentage ? "0" : "0",
        country: data1[0]?.countryId,
        loggedId: loggedUserId,
      };
    }
  });

  const [initialValue, setInitialValue] = useState(
    data !== undefined ? data1[0]?.executive : ""
  );
  const [updatedValue, setUpdatedValue] = useState(
    data !== undefined ? details.executive : ""
  );
  const [visibleSEPU, setVisibleSEPU] = useState(false);

  const [isReplace, setIsReplace] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    initialValue != updatedValue ? setVisibleSEPU(true) : setVisibleSEPU(false);
  }, []);

  const handleCancel = (e) => {
    {
      flag === 1 ? setIsShow(false) : null;
    }
    GlobalCancel(ref);
    setValidationMessage(false);
    setSuccessfulmessage(false);
    let ele = document.getElementsByClassName("cancel");
    for (const item of ele) {
      item.value = "";
    }
  };

  const getEngagements = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getEngagements`,
    }).then((res) => {
      let resp = res.data;
      setFileName(resp);
    });
  };

  const handleCustomer = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getCustomerName`,
    }).then((res) => {
      let custom = res.data;
      const filteredData = custom.filter((item) => item.id !== 81084541);
      setCustomer(filteredData);
    });
  };

  const handleDivision = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getDivisionId`,
    }).then((res) => {
      let divson = res.data;
      setDivisionSpare(divson);
      setDivisionspar(divson);
      setDetailsCusId(details?.customer);
    });
  };

  const Divisionengagement = () => {
    if (customerId != undefined) {
      axios({
        method: "get",
        url: baseUrl + `/ProjectMS/Engagement/getDivision?cid=${customerId}`,
      }).then((res) => {
        let div = res.data;
        setDivisioneng(div);
      });
    }
  };

  {
    details == null || details == "" ? null : "";
  }

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

  const handleIndustry = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getIndustrySolution`,
    }).then((res) => {
      let indus = res.data;
      setIndustry(indus);
    });
  };

  const handleContract = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getContractTerms`,
    }).then((res) => {
      let contact = res.data;
      setContract(contact);
    });
  };

  const handleCostContract = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getContractTerms`,
    }).then((res) => {
      let contact = res.data;
      setCostContract(contact);
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
      const filteredData = compay.filter(
        (item) =>
          item.id !== 10 && item.id !== 11 && item.id !== 12 && item.id !== 13
      );
      setEngCompany(filteredData);
    });
  };

  const resourceFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then((res) => {
      let manger = res.data;
      setResource(manger);
    });
  };

  const navigate = useNavigate();

  const handlePostDetails = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setSuccessfulmessage(false);
        setValidationMessage(true);
      }
      return;
    }
    if (valid) {
      return;
    }
    let customerNamesArr = filename.filter((d) => d !== null);
    let someDataa = customerNamesArr.some((d) => d.name == details?.name);
    if (btnState != "Edit") {
      if (someDataa) {
        let ele = document.getElementsByClassName("unique");
        for (let index = 0; index < ele.length; index++) {
          ele[index].classList.add("error-block");
        }
        setUniqueMessage(true);
        setSuccessfulmessage(false);
        setValidationMessage(false);
        setTimeout(() => {
          setUniqueMessage(false);
        }, 3000);
        return;
      }
    }

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Engagement/postEngagementsDetails`,
      data: details,
    }).then(function (res) {
      setPostDetails(res.data);
      setSuccessfulmessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setSuccessfulmessage(false);
      }, 3000);
      setValidationMessage(false);
      if (btnState != "Edit") {
        navigate(`/engagement/Dashboard/:${res.data.EngagementId}`);
      } else {
        window.location.reload();
      }
    });
  };

  const handleOpen = () => {
    let temp = finalState;

    if (details.poNumber != "") {
      let pNo = details.poNumber.includes(",")
        ? details.poNumber.split(",")
        : details.poNumber;

      if (details.poNumber.includes(",")) {
        pNo.forEach((ele) => {
          temp[Object.keys(temp).length] = ele;
        });
      } else {
        temp[Object.keys(temp).length] = pNo;
      }

      setFinalState(() => temp);
    }

    setButtonPopup(true);
  };

  useEffect(() => {
    if (details.customer != undefined) {
      let data = divisionSpare.filter((d) => d.customerId == details.customer);
      setDivision(data);
    }
  }, [divisionSpare]);

  const [selectedValue, setSelectedValue] = useState("");
  const handleChangeCustom = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleChange = (e) => {
    setSelectedValue("");
    const { id, name, value } = e.target;
    setOnChangeState((prev) => ({ ...prev, [id]: value }));
    let data = divisionSpare.filter((d) => d.customerId == value);
    setDivision(data);

    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
    let tempDivision = divisionSpare;
    let customer_id = details.division;
    let fDivision = tempDivision.filter((d) => d.customerId == customer_id);
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setCName(engDetails[0]?.city);
    setSName(engDetails[0]?.state);
    setAName(engDetails[0]?.address);
    setCoName(engDetails[0]?.country);
    setZName(engDetails[0]?.zipcode);

    setDetails((prev) => {
      return { ...prev, [name]: value };
    });

    if (value != "") {
      getAddressDetailsApi(value);
    }
  };

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Engagements > Create Engagement"];
  let currentScreenName1 = ["Engagement Search", "Engagements"];

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName:
        btnState == "Edit" ? currentScreenName1 : currentScreenName,
      textContent: textContent,
    })
  );
  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const deliveryItem = data[7]; // Assuming "Delivery" item is at index 7

      const desiredOrder = [
        "Engagements",
        "Projects",
        "Engagement Allocations",
        "Project Health",
        "Project Status Report",
      ];

      const sortedSubMenus = deliveryItem.subMenus.sort((a, b) => {
        const indexA = desiredOrder.indexOf(a.display_name);
        const indexB = desiredOrder.indexOf(b.display_name);
        return indexA - indexB;
      });
      deliveryItem.subMenus = sortedSubMenus;
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  const getAddressDetailsApi = (value) => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/Engagement/getAddressDetails?divisionId=${value}`,
    }).then((res) => {
      let delta = res.data;
      setEngDetails(delta);
      setEngData(res.data);
    });
  };

  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [email3, setEmail3] = useState("");
  const [isValid1, setIsValid1] = useState(true);
  const [isValid2, setIsValid2] = useState(true);
  const [isValid3, setIsValid3] = useState(true);

  const handleChange2 = (e) => {
    const { id, name, value } = e.target;
    if (id === "toEmails") {
      if (value === "") {
        setIsValid1(true);
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValid1(emailRegex.test(value));
      }
      setEmail1(value);
    }

    if (id === "bccEmails") {
      if (value === "") {
        setIsValid2(true);
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValid2(emailRegex.test(value));
      }
      setEmail2(value);
    }
    if (id === "ccEmails") {
      if (value === "") {
        setIsValid3(true);
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsValid3(emailRegex.test(value));
      }
      setEmail3(value);
    }

    setOnChangeState((prev) => ({ ...prev, [id]: value }));
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    handleCustomer();
    handleDivision();
    Divisionengagement();
    handleEngagementType();
    handleIndustry();
    handleContract();
    handlePaymentTerm();
    handleInvoiceCycle();
    handleInvoiceCulture();
    handleInvoiceTemplate();
    handleInvoiceTime();
    handleCurrency();
    handleEngCompany();
    resourceFnc();
    getEngagements();
    handleCostContract();
  }, []);

  useEffect(() => {}, [postDetails, engDetails]);

  useEffect(() => {
    if (data !== undefined && data.length > 0) {
      setDetails(data[0]);
      setBackUpData(JSON.parse(JSON.stringify(data[0])));
    }
  }, [data]);

  useEffect(() => {
    if (details.division != "") {
      getAddressDetailsApi(details.division);
    }
  }, []);

  const [buttonPopup, setButtonPopup] = useState(false);

  const CustomDatePickerInput = ({ value, onClick }) => {
    const restrictedPlaceholder = "";

    return (
      <input
        type="text"
        className=""
        value={value}
        placeholder={restrictedPlaceholder}
        readOnly
        onClick={onClick}
      />
    );
  };

  const handleEndDtChange = (e) => {
    const selectedDate = e ? moment(e).format("yyyy-MM-DD") : "";

    // Compare the dates
    if (selectedDate < details.startDt) {
      setDetails((prev) => ({
        ...prev,
        endDt: details.startDt, // Set endDt to the value of startDt
      }));
      setEndDt(new Date(details.startDt)); // Update the state with the new date value
    } else {
      setDetails((prev) => ({
        ...prev,
        endDt: selectedDate,
      }));
      setEndDt(e);
    }
  };

  return (
    <div>
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select the valid values for highlighted
          fields{" "}
        </div>
      ) : (
        ""
      )}
      {uniqueMessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Engagement Name already exist with this name
        </div>
      ) : (
        ""
      )}
      {data !== undefined ? (
        <>
          {successfulmessage ? (
            <div className="statusMsg success">
              Engagement Updated Successfully
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        <>
          {successfulmessage ? (
            <div className="statusMsg success">
              Engagement Created Successfully
            </div>
          ) : (
            ""
          )}
        </>
      )}
      {flag !== 1 && data !== undefined ? (
        <div className="pageTitle">
          <div className="childOne">
            {data === undefined ? (
              ""
            ) : (
              <div className="tabsProject" style={{ margin: "3px" }}>
                {tabsAccess.map((button) => (
                  <button
                    key={button.id}
                    className={
                      btnState === button.display_name.toString()
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name);
                    }}
                  >
                    {button.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="childTwo">
            {data !== undefined ? <h2>Engagements</h2> : ""}
          </div>
          <div className="childThree"></div>
        </div>
      ) : (
        ""
      )}

      <div className="customCard  mt-2 mb-2">
        <div className="mb-3  container-fluid   customCard">
          <h2>
            <RiProfileLine /> Basic Information
          </h2>
          <div className="row ">
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="engagementCode">
                Engagement Code&nbsp;<span className="error-text">*</span>
              </label>
              {data !== undefined ? (
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <input
                    className="err text disableField"
                    type="text"
                    name="engagementCode"
                    id="engagementCode"
                    defaultValue={details?.engagementCode}
                    onChange={handleChange2}
                    style={{ cursor: "not-allowed" }}
                    required
                    disabled
                  />
                </div>
              ) : (
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <input
                    className=" text cancel "
                    type="text"
                    name="engagementCode"
                    id="engagementCode"
                    defaultValue={details?.engagementCode}
                    onChange={handleChange2}
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details?.engagementCode)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              )}
            </div>

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="name">
                Name&nbsp;<span className="error-text">*</span>
              </label>
              {data !== undefined ? (
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <input
                    type="text"
                    className="err text"
                    id="name"
                    defaultValue={details?.name}
                    onChange={handleChange2}
                    name="name"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.name)
                        event.preventDefault();
                    }}
                  />
                </div>
              ) : (
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <input
                    type="text"
                    className="unique text cancel"
                    id="name"
                    defaultValue={details?.name}
                    onChange={handleChange2}
                    name="name"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.name)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              )}
            </div>

            {flag == 1 ? (
              <div className="form-group col-md-3 mb-2">
                <label htmlFor="customer_id">
                  Customer Name&nbsp;<span className="error-text">*</span>
                </label>

                <input
                  disabled
                  type="text"
                  className="form-control"
                  name="customer"
                  id="customer"
                  value={customerName}
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                ></input>
              </div>
            ) : (
              <>
                {data !== undefined ? (
                  <div className="form-group col-md-3 mb-2">
                    <label htmlFor="customer">
                      Customer Name&nbsp;<span className="error-text">*</span>
                    </label>
                    <select
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                      className=" disableField"
                      name="customer"
                      id="customer"
                      disabled
                      onChange={handleChange}
                      defaultValue={details?.customer}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {customer?.map((Item) => (
                        <option
                          key={Item.id}
                          selected={Item.id == details.customer ? true : false}
                          value={Item.id}
                        >
                          {Item.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-group col-md-3 mb-2">
                    <label htmlFor="customer">
                      Customer Name&nbsp;<span className="error-text">*</span>
                    </label>
                    <select
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                      className="err cancel text "
                      name="customer"
                      id="customer"
                      onChange={handleChange}
                      defaultValue={details?.customer}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {customer?.map((Item) => (
                        <option
                          key={Item.id}
                          selected={Item.id == details.customer ? true : false}
                          value={Item.id}
                        >
                          {Item.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="division">
                Division&nbsp;<span className="error-text">*</span>
              </label>

              {flag == 1 ? (
                <select
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                  className="cancel text"
                  name="division"
                  id="division"
                  onChange={handleChange1}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>

                  {divisioneng?.map((Item) => (
                    <option key={Item.id} value={Item.id}>
                      {Item.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  {data !== undefined && data.length > 0 ? (
                    <select
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                      className={data != undefined ? "" : "err cancel text"}
                      name="division"
                      id="division"
                      onChange={handleChange1}
                      defaultValue={details?.division}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {division?.map((Item) => (
                        <option
                          key={Item.id}
                          selected={Item.id == details.division ? true : false}
                          value={Item.id}
                        >
                          {Item.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                      className={data != undefined ? "" : "err cancel text"}
                      name="division"
                      id="division"
                      onChange={handleChange1}
                      defaultValue={details?.division}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {division?.map((Item) => (
                        <option
                          key={Item.id}
                          value={Item.id}
                          selected={Item.id == details.division ? true : false}
                        >
                          {Item.name}
                        </option>
                      ))}
                    </select>
                  )}
                </>
              )}
            </div>
            <div className="col-md-3">
              <div className="row">
                <div className="form-group col-md-6 ">
                  <label htmlFor="startDate">Start Date</label>
                  <DatePicker
                    name="startDt"
                    selected={
                      details.startDt ? new Date(details.startDt) : null
                    }
                    defaultValue={details.startDt != "" ? details.startDt : ""}
                    id="start_dt"
                    className="err cancel nochange"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd-MMM-yyyy"
                    onChange={(e) => {
                      const selectedDate = e
                        ? moment(e).format("yyyy-MM-DD")
                        : "";
                      setDetails((prev) => ({
                        ...prev,
                        ["startDt"]: selectedDate,
                      }));
                      setStartDt(e);
                    }}
                    autoComplete="false"
                    customInput={<CustomDatePickerInput />}
                  />
                </div>
                <div className="form-group col-md-6 ">
                  <label htmlFor="end_dt">End Date</label>
                  <DatePicker
                    name="endDt"
                    selected={details.endDt ? new Date(details.endDt) : null}
                    id="end_dt"
                    className="err cancel nochange"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd-MMM-yyyy"
                    minDate={StartDt ? StartDt : undefined}
                    onChange={handleEndDtChange}
                    autoComplete="false"
                    customInput={<CustomDatePickerInput />}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="manager">
                Manager&nbsp;<span className="error-text">*</span>
              </label>
              {data !== undefined ? (
                <div
                  className="autoComplete-container react  autocomplete"
                  ref={(ele) => {
                    ref.current[4] = ele;
                  }}
                >
                  <div>
                    <ReactSearchAutocomplete
                      items={resource}
                      type="Text"
                      name="manager"
                      id="manager_id"
                      className="err cancel nochange"
                      fuseOptions={{ keys: ["id", "name"] }}
                      resultStringKeyName="name"
                      resource={resource}
                      resourceFnc={resourceFnc}
                      placeholder=""
                      onSelect={(e) => {
                        setDetails((prevProps) => ({
                          ...prevProps,
                          ["manager"]: e.id,
                        }));
                      }}
                      showIcon={false}
                      inputSearchString={data1[0]?.firstName}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="autoComplete-container react  autocomplete"
                  ref={(ele) => {
                    ref.current[4] = ele;
                  }}
                >
                  <div>
                    <ReactSearchAutocomplete
                      items={resource}
                      type="Text"
                      name="manager"
                      id="manager_id"
                      className="err cancel nochange"
                      fuseOptions={{ keys: ["id", "name"] }}
                      resultStringKeyName="name"
                      resource={resource}
                      resourceFnc={resourceFnc}
                      placeholder=""
                      onSelect={(e) => {
                        setDetails((prevProps) => ({
                          ...prevProps,
                          ["manager"]: e.id,
                        }));
                      }}
                      showIcon={false}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="salesExecutive">
                Sales Executive&nbsp;<span className="error-text">*</span>
              </label>
              {data !== undefined ? (
                <div
                  className="autoComplete-container react  autocomplete"
                  ref={(ele) => {
                    ref.current[5] = ele;
                  }}
                >
                  <div>
                    <ReactSearchAutocomplete
                      items={resource}
                      type="Text"
                      name="executive"
                      id="executive_id"
                      className="err cancel"
                      fuseOptions={{ keys: ["id", "name"] }}
                      resultStringKeyName="name"
                      placeholder=""
                      onSelect={(e) => {
                        setUpdatedValue(e.id);
                        setDetails((prevProps) => ({
                          ...prevProps,
                          executive: e.id,
                        }));
                        setVisibleSEPU(true);
                      }}
                      showIcon={false}
                      inputSearchString={data1[0]?.execFirstName}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="autoComplete-container react  autocomplete"
                  ref={(ele) => {
                    ref.current[5] = ele;
                  }}
                >
                  <div>
                    <ReactSearchAutocomplete
                      items={resource}
                      type="Text"
                      name="executive"
                      id="executive_id"
                      className="err cancel"
                      fuseOptions={{ keys: ["id", "name"] }}
                      resultStringKeyName="name"
                      placeholder=""
                      onSelect={(e) => {
                        setInitialValue(e.id);
                        setDetails((prevProps) => ({
                          ...prevProps,
                          executive: e.id,
                        }));
                      }}
                      showIcon={false}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="engagement_model_id">
                Engagement Type&nbsp;<span className="error-text">*</span>
              </label>
              <div
                className="textfield"
                ref={(ele) => {
                  ref.current[6] = ele;
                }}
              >
                <select
                  className={data != undefined ? "" : "cancel"}
                  name="engagementModelId"
                  id="engagementModelId"
                  onChange={handleChange2}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  {engagementType?.map((Item) => (
                    <option
                      key={Item.lkup_type_group_id}
                      selected={
                        Item.id == details.engagementModelId ? true : false
                      }
                      value={Item.id}
                    >
                      {Item.engagementType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="companyCostCenter">Cost Center</label>
              <>
                <span className="companyCostCenter " id="companyCostCenter">
                  <div
                    className="poBtn disableField"
                    style={{ cursor: "not-allowed" }}
                  >
                    <MdAddCircleOutline style={{ color: "black" }} />
                    <span
                      className="companyCostCenter"
                      style={{ color: "black" }}
                    >
                      Select Cost Center
                    </span>
                  </div>
                </span>
              </>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="engagement_status_id">
                Status&nbsp;<span className="error-text">*</span>
              </label>
              <div
                className="textfield"
                ref={(ele) => {
                  ref.current[7] = ele;
                }}
              >
                {flag == 1 ? (
                  <select
                    name="status"
                    id="engagement_status_id"
                    className="cancel"
                    onChange={handleChange2}
                    value={details.status}
                  >
                    <option value="1" selected={details.status == "1"}>
                      Active
                    </option>
                    <option value="0">In-Active</option>
                  </select>
                ) : (
                  <select
                    name="status"
                    id="Status"
                    className={data != undefined ? "" : "cancel"}
                    onChange={handleChange2}
                    defaultValue={details?.status == true ? "1" : "0"}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    <option value="1">Active</option>
                    <option value="0">In-Active</option>
                  </select>
                )}
              </div>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="currency_id">
                Currency&nbsp;<span className="error-text">*</span>
              </label>
              <div
                className="textfield"
                ref={(ele) => {
                  ref.current[8] = ele;
                }}
              >
                <select
                  className={data != undefined ? "" : "cancel"}
                  name="currency"
                  id="CurrencyId"
                  onChange={handleChange2}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  {currency
                    .sort((a, b) => a.currency.localeCompare(b.currency))
                    .map((Item) => (
                      <option
                        key={Item.lkup_type_group_id}
                        selected={Item.id == details.currency ? true : false}
                        value={Item.id}
                      >
                        {Item.currency}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="sfopportunity_link">
                Salesforce Oppurtunity Link
              </label>
              {data !== undefined ? (
                <div>
                  <input
                    type="text"
                    className=""
                    id="sfopportunity_link"
                    defaultValue={details?.sfOpportunityLink}
                    onChange={handleChange2}
                    name="sfOpportunityLink"
                  />
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    className="cancel"
                    id="sfopportunity_link"
                    onChange={handleChange2}
                    name="sfOpportunityLink"
                  />
                </div>
              )}
            </div>
            <div className="form-group col-md-3 mb-3">
              <label htmlFor="poNumber">PO Number </label>
              <div
                className="poBtn"
                type="text"
                id="poNumber"
                name="poNumber"
                onClick={() => {
                  handleOpen();
                }}
                style={{ cursor: "pointer" }}
              >
                <MdAddCircleOutline />
                <span className=""> Add/Edit PO Number</span>
              </div>
            </div>
            <div className="form-group col-md-3 mb-3">
              <label htmlFor="company_id">
                Eng.Company&nbsp;<span className="error-text">*</span>
              </label>
              <div
                className="textfield"
                ref={(ele) => {
                  ref.current[9] = ele;
                }}
              >
                <select
                  className={data != undefined ? "" : "cancel"}
                  name="company"
                  id="CompanyId"
                  onChange={handleChange2}
                  defaultValue={details?.company}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  {engCompany
                    .sort((a, b) => a.Company.localeCompare(b.Company))
                    .map((Item) => (
                      <option
                        key={Item.id}
                        selected={Item.id == details.company ? true : false}
                        value={Item.id}
                      >
                        {Item.Company}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="customCard  mt-2 mb-2">
        <div className="group mb-3 container-fluid   customCard">
          <h2>
            <RiProfileLine /> Industry and Capability Compliance
          </h2>
          <div className="group-content row">
            <div className="col-md-3">
              <label htmlFor="industry_solution_id">Industry Solution</label>
              <select
                className={data != undefined ? "" : "cancel"}
                name="industrySolutionId"
                id="industrySolutionId"
                onChange={handleChange2}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                {industry?.map((Item) => (
                  <option
                    key={Item.lkup_type_group_id}
                    selected={
                      Item.id == details.industrySolutionId ? true : false
                    }
                    value={Item.id}
                  >
                    {Item.industrySolution}
                  </option>
                ))}
              </select>
            </div>
            <div className=" col-md-3">
              <label htmlFor="message-textareavalueAddTasks">
                Value Add Tasks
              </label>
              <textarea
                className={data != undefined ? "" : "cancel"}
                id="valueAddedTasks"
                placeholder=""
                rows={2}
                required
                defaultValue={
                  details.valueAddedTasks == null
                    ? "-"
                    : details.valueAddedTasks
                }
                onChange={handleChange2}
                name="valueAddedTasks"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="customCard  mt-2 mb-2">
        <div className="group mb-3 container-fluid   customCard">
          <h2>
            <RiProfileLine /> Billing Information
          </h2>
          <div className="row">
            <div
              className="col-md-3 "
              style={{ marginRight: "10px", marginLeft: "5px" }}
            >
              <h2>Bill to Details</h2>

              <div className="group-content row">
                <div className="mb-2 col-md-12">
                  <div className="form-group row">
                    <label className="col-md-5" htmlFor="name">
                      Attn.
                    </label>
                    <span className="col-1 ">:</span>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className={data != undefined ? "" : "cancel"}
                        id="attnId"
                        onChange={handleChange2}
                        name="attn"
                        defaultValue={btnState == "Edit" ? details?.attn : ""}
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
                      {engdata.map((item) => (
                        <p
                          className="col-6 "
                          id="address"
                          title={details.addressLine}
                        >
                          {item.address}
                          {aName}
                        </p>
                      ))}
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
                      {engdata.map((item) => (
                        <p className="col-6" id="city">
                          {details.city}
                          {item.city} {cName}
                        </p>
                      ))}
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
                      {engdata.map((item) => (
                        <p className="col-6" id="state">
                          {details.state}
                          {item.state} {sName}
                        </p>
                      ))}
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
                      {engdata.map((item) => (
                        <p className="col-6" id="zip_code">
                          {details.zipcode}
                          {item.zipcode} {zName}
                        </p>
                      ))}
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
                      {engdata.map((item) => (
                        <p
                          className="col-6"
                          id="country_id"
                          value={details.country}
                        >
                          {item.country} {coName}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8 " style={{ width: "73%" }}>
              <h2>Invoice Details</h2>
              <div className="row">
                <div className="col-md-5 mt-2">
                  <div className=" row ">
                    <div className=" col-md-12">
                      <div className="frmo-group row mb-2">
                        <label
                          className="col-5"
                          htmlFor="Payment Terms -select"
                        >
                          Payment Terms&nbsp;
                          <span className="error-text">*</span>
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <select
                            className={
                              data != undefined
                                ? ""
                                : "cancel error enteredDetails text"
                            }
                            name="paymentTermsId"
                            id="paymentTermsId"
                            onChange={(e) => handleChange2(e)}
                            ref={(ele) => {
                              ref.current[10] = ele;
                            }}
                          >
                            <option value="">
                              {" "}
                              &lt;&lt;Please Select&gt;&gt;
                            </option>
                            {paymentTerm?.map((Item) => (
                              <option
                                key={Item.lkup_type_group_id}
                                selected={
                                  Item.id == details.paymentTermsId
                                    ? true
                                    : false
                                }
                                value={Item.id}
                              >
                                {Item.paymentTerms}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" row ">
                    <div className="col-md-12">
                      <div className="frmo-group row mb-2">
                        <label
                          className="col-5"
                          htmlFor="Invoice Cycle -select"
                        >
                          Invoice Cycle&nbsp;
                          <span className="error-text">*</span>
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <div className="d-flex">
                            {details.invoiceCycleId === "754" && (
                              <div className="mr-2">
                                <select
                                  className={
                                    data != undefined
                                      ? ""
                                      : "cancel error enteredDetails text"
                                  }
                                  name="invoiceCycleId"
                                  id="invoiceCycleId"
                                  onChange={(e) => handleChange2(e)}
                                  ref={(ele) => {
                                    ref.current[11] = ele;
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
                                  className={
                                    data != undefined
                                      ? ""
                                      : "cancel error enteredDetails text"
                                  }
                                  value={selectedValue}
                                  onChange={(e) => handleChangeCustom(e)}
                                  ref={(ele) => {
                                    ref.current[11] = ele;
                                  }}
                                >
                                  <option value="">
                                    {"<<Please Select>>"}
                                  </option>
                                  {[...Array(31)].map((_, index) => (
                                    <option
                                      key={index + 1}
                                      value={index + 1}
                                      selected={
                                        index + 1 ===
                                        parseInt(details.invoiceCycleId)
                                      }
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
                              className={
                                data != undefined
                                  ? ""
                                  : "cancel error enteredDetails text"
                              }
                              name="invoiceCycleId"
                              id="invoiceCycleId"
                              onChange={(e) => handleChange2(e)}
                              ref={(ele) => {
                                ref.current[11] = ele;
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
                        <label
                          className="col-5"
                          htmlFor="Invoice Culture -select"
                        >
                          Invoice Culture&nbsp;
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <select
                            className={
                              data != undefined
                                ? ""
                                : "cancel error enteredDetails text"
                            }
                            name="invoiceCultureId"
                            id="invoiceCultureId"
                            onChange={(e) => handleChange2(e)}
                          >
                            <option value="">
                              {" "}
                              &lt;&lt;Please Select&gt;&gt;
                            </option>
                            {invoiceCulture?.map((Item) => (
                              <option
                                key={Item.lkup_type_group_id}
                                selected={
                                  Item.id == details.invoiceCultureId
                                    ? true
                                    : false
                                }
                                value={Item.id}
                              >
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
                        <label
                          className="col-5"
                          htmlFor="Invoice Template -select"
                        >
                          Invoice Template
                        </label>
                        <span className="col-1 ">:</span>
                        <div className="col-6">
                          <select
                            className={
                              data != undefined
                                ? ""
                                : "cancel error enteredDetails text"
                            }
                            name="invoiceTemplateId"
                            id="invoiceTemplateId"
                            onChange={(e) => handleChange2(e)}
                          >
                            <option value="">
                              {" "}
                              &lt;&lt;Please Select&gt;&gt;
                            </option>
                            {invoiceTemplate?.map((Item) => (
                              <option
                                key={Item.lkup_type_group_id}
                                selected={
                                  Item.id == details.invoiceTemplateId
                                    ? true
                                    : false
                                }
                                value={Item.id}
                              >
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
                        <label
                          className="col-5"
                          htmlFor="Invoice Time  -select"
                        >
                          Invoice Time&nbsp;
                          <span className="error-text">*</span>
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <select
                            className={
                              data != undefined
                                ? ""
                                : "cancel error enteredDetails text"
                            }
                            name="invoiceTimeId"
                            id="invoiceTimeId"
                            onChange={(e) => handleChange2(e)}
                            ref={(ele) => {
                              ref.current[12] = ele;
                            }}
                          >
                            <option value="">
                              {" "}
                              &lt;&lt;Please Select&gt;&gt;
                            </option>
                            {invoiceTime?.map((Item) => (
                              <option
                                key={Item.lkup_type_group_id}
                                selected={
                                  Item.id == details.invoiceTimeId
                                    ? true
                                    : false
                                }
                                value={Item.id}
                              >
                                {Item.invoiceTime}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-7 mt-2">
                  <div className="mb-2 row ">
                    <div className="form-group col-md-12">
                      <label htmlFor="message-textarea">
                        Billing Instructions
                      </label>
                      <textarea
                        className={data != undefined ? "" : "cancel"}
                        id="billingInstructions"
                        placeholder=""
                        rows={2}
                        required
                        defaultValue={
                          details.billingInstructions == null
                            ? "-"
                            : details.billingInstructions
                        }
                        onChange={handleChange2}
                        name="billingInstructions"
                      />
                    </div>
                  </div>
                  <div className="mb-2 row ">
                    <div className="form-group col-md-12">
                      <label htmlFor="message-textarea">Client Message</label>
                      <textarea
                        className={data != undefined ? "" : "cancel"}
                        id="clientMessage"
                        placeholder=""
                        rows={2}
                        required
                        defaultValue={
                          details.clientMessage == null
                            ? "-"
                            : details.clientMessage
                        }
                        onChange={handleChange2}
                        name="clientMessage"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div
              className="col-md-3  mt-2"
              style={{
                marginRight: "10px",
                marginLeft: "5px",
                height: "200px",
              }}
            >
              <div className="group-content row ">
                <h2>Contract</h2>
                <div className=" row ">
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-6" htmlFor="Contract Terms -select">
                        Contract Terms&nbsp;
                        <span className="error-text">*</span>
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-5">
                        <select
                          className={
                            data != undefined
                              ? ""
                              : "cancel error enteredDetails text"
                          }
                          name="contractTermId"
                          id="contractTermId"
                          onChange={(e) => handleChange2(e)}
                          ref={(ele) => {
                            ref.current[13] = ele;
                          }}
                        >
                          <option value="">
                            &lt;&lt;Please Select&gt;&gt;
                          </option>
                          {contract
                            ?.filter((Item) => Item.contractTerm !== "")
                            .map((Item) => (
                              <option
                                key={Item.lkup_type_group_id}
                                selected={
                                  Item.id == details.contractTermId
                                    ? true
                                    : false
                                }
                                value={Item.id}
                              >
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
                        className="col-6"
                        htmlFor="Cost Contract Terms-select"
                      >
                        Cost Contract Terms&nbsp;
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-5">
                        <select
                          className={
                            data != undefined
                              ? ""
                              : "cancel error enteredDetails text"
                          }
                          name="costContractTermId"
                          id="costContractTermId"
                          onChange={(e) => handleChange2(e)}
                        >
                          <option value="">
                            &lt;&lt;Please Select&gt;&gt;
                          </option>

                          {costContract && costContract.length > 0 ? (
                            costContract?.map((Item) => (
                              <option
                                key={Item.lkup_type_group_id}
                                selected={
                                  Item.id == details.costContractTermId
                                    ? true
                                    : false
                                }
                                value={Item.id}
                              >
                                {Item.contractTerm}
                              </option>
                            ))
                          ) : (
                            <option value="">
                              No contract terms available
                            </option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-md-3 group mb-3 container-fluid   customCard  mt-2"
              style={{ marginRight: "10px", marginLeft: "5px" }}
            >
              <div className="group-content row ">
                <h2>Tax Structure</h2>
                <div className=" row ">
                  <div className="mb-2 col-md-12 ">
                    <div className="form-group row">
                      <label className="col-4" htmlFor="Tax Type 1">
                        Tax Type 1
                      </label>
                      <span className="col-1 ">:</span>
                      {data !== undefined ? (
                        <div className="col-3">
                          <input
                            type="text"
                            className=""
                            id="percentage"
                            onChange={handleChange2}
                            name="percentage"
                            required
                          />
                        </div>
                      ) : (
                        <div className="col-3">
                          <input
                            type="text"
                            className="cancel"
                            id="percentage"
                            onChange={handleChange2}
                            name="percentage"
                            required
                          />
                        </div>
                      )}
                      <div className="col-3 row">
                        <input
                          type="text"
                          className="cancel"
                          id="percentage"
                          onChange={handleChange2}
                          name="percentage"
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <span className="col-1">%</span>
                    </div>
                  </div>
                </div>
                <div className=" row ">
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-4" htmlFor="Tax Type 2">
                        Tax Type 2
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-3 ">
                        <input
                          type="text"
                          className=""
                          id="percentage"
                          onChange={handleChange2}
                          name="percentage"
                          required
                          style={{ cursor: "not-allowed" }}
                        />
                      </div>
                      <div className="col-3 row">
                        <input
                          type="text"
                          className="cancel"
                          id="percentage"
                          onChange={handleChange2}
                          name="percentage"
                          placeholder="0.00"
                          required
                          style={{ cursor: "not-allowed" }}
                        />
                      </div>
                      <span className="col-1 ">%</span>
                    </div>
                  </div>
                </div>
                <div className=" row ">
                  <div className="mb-2 col-md-12 ">
                    <div className="form-group row">
                      <label className="col-4" htmlFor="Tax Type 3">
                        Tax Type 3
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-3">
                        <input
                          type="text"
                          className=""
                          id="percentage"
                          onChange={handleChange2}
                          name="percentage"
                          required
                          style={{ cursor: "not-allowed" }}
                        />
                      </div>
                      <div className="col-3 row">
                        <input
                          type="text"
                          className="cancel"
                          id="percentage"
                          onChange={handleChange2}
                          name="percentage"
                          placeholder="0.00"
                          required
                          style={{ cursor: "not-allowed" }}
                        />
                      </div>
                      <span className="col-1 ">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-md-4 group mb-2 container-fluid  deliryVeryCreatePanl customCard
             mt-2"
              style={{ width: "47%" }}
            >
              <div className="group-content row ">
                <h2>Mailing Details</h2>
                <div className=" row ">
                  <div className="mb-2 col-md-12 ">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="To">
                        To
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        {data !== undefined ? (
                          <div>
                            <input
                              type="text"
                              className="text"
                              id="to_emails"
                              defaultValue={details?.toEmails}
                              onChange={handleChange2}
                              name="toEmails"
                              required
                            />
                          </div>
                        ) : (
                          <div>
                            <input
                              type="text"
                              value={email1}
                              onChange={handleChange2}
                              className={
                                isValid1
                                  ? "col-12 cancel"
                                  : "error-block col-12"
                              }
                              setIsValid1={true}
                              id="toEmails"
                              name="toEmails"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row ">
                  <div className="mb-2 col-md-12 ">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="CC">
                        CC
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        {data !== undefined ? (
                          <div>
                            <input
                              type="text"
                              className="text"
                              id="cc_emails"
                              defaultValue={details?.ccEmails}
                              onChange={handleChange2}
                              name="ccEmails"
                              required
                            />
                          </div>
                        ) : (
                          <div>
                            <input
                              type="text"
                              value={email3}
                              onChange={handleChange2}
                              className={
                                isValid3
                                  ? " col-12 cancel"
                                  : "error-block col-12"
                              }
                              setIsValid3={true}
                              id="ccEmails"
                              name="ccEmails"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" row ">
                  <div className="mb-2 col-md-12 ">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="BCC">
                        BCC
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        {data !== undefined ? (
                          <div>
                            <input
                              type="text"
                              className="text"
                              id="bcc_emails"
                              defaultValue={details?.bccEmails}
                              onChange={handleChange2}
                              name="bccEmails"
                              required
                            />
                          </div>
                        ) : (
                          <div>
                            <input
                              type="text"
                              value={email2}
                              onChange={handleChange2}
                              className={
                                isValid2
                                  ? "col-12 cancel"
                                  : "error-block col-12"
                              }
                              setIsValid2={true}
                              id="bccEmails"
                              name="bccEmails"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" row ">
                  <div className="mb-2 col-md-12">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Email Template-select">
                        Email Template
                      </label>
                      <span className="col-1 ">:</span>
                      <div className="col-6">
                        <select
                          name="emailTemplateId"
                          id="email_template_id"
                          className="cancel"
                          onChange={handleChange2}
                        >
                          <option value="">
                            {" "}
                            &lt;&lt;Please Select&gt;&gt;{" "}
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
      <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
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
          onClick={() => {
            handleCancel();
          }}
        >
          <ImCross fontSize={"11px"} /> Cancel
        </button>
      </div>
      {initialValue != updatedValue ? (
        <SalesExecutivePopUp
          visibleSEPU={visibleSEPU}
          setVisibleSEPU={setVisibleSEPU}
          isReplace={isReplace}
          setIsReplace={setIsReplace}
          isAdd={isAdd}
          setIsAdd={setIsAdd}
          setDetails={setDetails}
        />
      ) : (
        ""
      )}

      {buttonPopup ? (
        <PONumberPopup
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          handleChange2={handleChange2}
          handleAdd={handleAdd}
          addList={addList}
          setAddList={setAddList}
          finalState={finalState}
          details={details}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default DeliveryCreate;
