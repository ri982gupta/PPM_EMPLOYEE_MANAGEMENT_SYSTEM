import axios from "axios";
import React, { useEffect, useState } from "react";
import { VscSave } from "react-icons/vsc";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { ImCross } from "react-icons/im";
import CustomersDivisionEdit from "./CustomersDivisionEdit";
import CustomersStakeholdersEdit from "./CustomersStakeholdersEdit";
import CustomersInternalStakeholdersEdit from "./CustomersInternalStakeholdersEdit";
import CustomerRolesEdit from "./CustomerRolesEdit";
import { BiCheck, BiPencil } from "react-icons/bi";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import PONumberPopup from "../DeliveryComponent/PONumberPopup";
import CustomerEmailEditPopup from "./CustomerEmailEditPopup";
import { useRef } from "react";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import InvoiceSummaryPopup from "./InvoiceSummaryPopup";
import { AiFillWarning } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import Loader from "../Loader/Loader";

function CustomerEdit(props) {
  const {
    customerId,
    customerData,
    buttonState,
    setButtonState,
    urlState,
    setUrlState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
  } = props;
  const [backUpData, setBackUpData] = useState({});

  useEffect(() => {
    if (customerData.length > 0) {
      setBackUpData(JSON.parse(JSON.stringify(customerData[0])));
    }
  }, [customerData]);
  const [finalState1, setFinalState1] = useState({
    customerEmail: customerData[0]?.customeremail,
  });

  const [addList1, setAddList1] = useState([{}]);

  const handleAddEmail = () => {
    let data1 = finalState1;
    data1[Object.keys(data1).length] = onChangeState1["customerEmails"];
    setAddList1([...addList1, { customerEmails: "" }]);
  };

  const [dispalyEmail, setDisplayEmail] = useState([]);
  const [size, setSize] = useState([]);
  const ref = useRef([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [message, setMessage] = useState(false);
  var maxDate = new Date();
  var year = maxDate.getFullYear();
  var month1 = maxDate.getMonth();
  var maxDate = new Date(year, month1 + 11);
  const baseUrl = environment.baseUrl;

  const [salesTerritories, setSalesTerritories] = useState([]);
  const [projectcategory, setProjectCategory] = useState([]);
  const [industryType, setIndustryType] = useState([]);
  const [classification, setClassification] = useState([]);
  const [invSummaryPopUp, setInvSummaryPopUp] = useState(false);
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
  const [cCountryId, setcCountryId] = useState([]);
  const [invoiceCycle, setInvoiceCycle] = useState([]);
  const [paymentTerm, setPaymentTerm] = useState([]);
  const [invoiceTime, setInvoiceTime] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [invoiceCulture, setInvoiceCulture] = useState([]);
  const [invoiceTemplate, setInvoiceTemplate] = useState([]);
  const [clickButtonPopUp, setClickButtonPopUp] = useState(false);
  const [rolesValidationMsg, setRolesValidationMsg] = useState(false);
  const [updatedRole, setUpdatedRole] = useState("Primary Project Manager");
  const [finalTableMsg, setFinalTableMsg] = useState(false);
  const [custRolePopEditMsg, setCustRolePopEditMsg] = useState(false);
  const [addMessage, setAddMessage] = useState(false);
  const [csAddMessage, setCsAddMessage] = useState(false);
  const [addIntStakeMessage, setAddIntStakeMessage] = useState(false);
  const [projCatId, setProjCatId] = useState([]);
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const [username, setUsername] = useState("");

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const [effectiveDate, SetEffectiveDate] = useState("");
  let emailString = Object.values(finalState1).toString();
  if (emailString.startsWith(",")) {
    emailString = emailString.substring(1); // Remove the first character (the comma)
  }

  useEffect(() => {
    const conStart =
      customerData[0]?.month == null
        ? ""
        : customerData[0]?.month == ""
          ? ""
          : moment(customerData[0]?.month).toDate();
    SetEffectiveDate(conStart);
  }, []);

  const intialOnChangeState1 = {
    customerEmails: "",
  };

  const [details, setDetails] = useState({
    id: customerId,
    typCustStatusId: customerData[0]?.typCustStatusId,
    size: customerData[0]?.size,
    salesPersonId: customerData[0]?.salesId,
    clientpartnerId: customerData[0]?.clientpartnerId,
    engagementPartnerId: customerData[0]?.engagementpartnerId,
    cslHeadId: customerData[0]?.cslHeadId,
    cslId: customerData[0]?.cslId,
    acslId: customerData[0]?.AssociateCSLId,
    deliveryPartnerHeadId: customerData[0]?.deliverypartnerHeadId,
    deliveryPartnerId: customerData[0]?.deliverypartnerId,
    talentPartnerId: customerData[0]?.TalentPartnerId,
    projectCoordinatorId: customerData[0]?.projectCoordinatorId,
    sqaId: customerData[0]?.SQAId,
    clId: customerData[0]?.competencyLeadId,
    cCountryId: customerData[0]?.cCountryId,
    classificationId: customerData[0]?.classificationId,
    phone: customerData[0]?.phone,
    fax: customerData[0]?.fax,
    sfAccountLink: customerData[0]?.sfAccountLink,
    website: customerData[0]?.website,
    customerEmails: customerData[0]?.customeremail,
    custReferenceable: customerData[0]?.custReferenceable,
    accountOwnerId: customerData[0]?.account_owner_id,
    isNewCustomer: customerData[0]?.is_new_customer == false ? 0 : 1,
    month: customerData[0]?.month == null ? "" : customerData[0]?.month,
    CiInvoiceForId: customerData[0]?.CiInvoiceForId,
    invoiceCycleId: customerData[0]?.invoiceCycleId,
    paymentTermsId: customerData[0]?.paymentTermsId,
    invoiceTimeId: customerData[0]?.invoiceTimeId,
    CiCurrencyId: customerData[0]?.CiCurrencyId,
    isExpenseBillable: customerData[0]?.expenseBillable == "Yes" ? 1 : 0,
    invoiceCultureId: customerData[0]?.invoiceCultureId,
    ciDiscountPercent: customerData[0]?.ciDiscountPercent,
    invoiceTemplateId: customerData[0]?.invoiceTemplateId,
    custReferenceNotes: customerData[0]?.custReferenceNotes,
    isQbr: customerData[0]?.isQbr,
  });
  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Overview", "Edit"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  useEffect(() => {
    setTimeout(() => {
      document.getElementsByClassName("pageTitle")[0]?.click();
      setLoader(false);
    }, 1000);
    getMenus();
    getUrlPath();
  }, []);

  const getMenus = () => {
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

  const getProjectCatIds = () => {
    axios
      .get(
        baseUrl +
        `/customersms/Customers/getProjCatIds?customerId=${customerId}`
      )
      .then((Response) => {
        let data = Response.data;
        setProjCatId(data);
      });
  };

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setOnChangeState1((prev) => ({ ...prev, [id]: value }));

    setDetails((prev) => {
      return { ...prev, [id]: value };
    });
  };

  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    onChangeState2[id] = value;
    details[(id, name)] = value;
  };

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

  const handleSize = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getSize`,
    }).then((res) => {
      let manger = res.data;
      setSize(manger);
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

  const handleProjectCategory = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getAllProjectCategorys`,
    }).then((res) => {
      let manger = res.data;
      setProjectCategory(manger);
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

  const getcCountryId = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`,
    }).then((resp) => {
      let data = resp.data;
      let filterdata = data.filter((item) => item.id != 4);
      setcCountryId(filterdata);
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

  const handleClassification = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getClassification`,
    }).then((res) => {
      let manger = res.data;
      setClassification(manger);
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

  const handlePaymentTerm = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getPaymentTerms`,
    }).then((res) => {
      let payterm = res.data;
      setPaymentTerm(payterm);
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

  useEffect(() => {
    handleSize();
    handleSalesTerritories();
    handleProjectCategory();
    handleIndustryType();
    resourceFnc();
    getcCountryId();
    handleClassification();
    handleInvoiceCycle();
    handlePaymentTerm();
    handleInvoiceTime();
    handleCurrency();
    handleInvoiceCulture();
    handleInvoiceTemplate();
    getProjectCatIds();
  }, []);
  useEffect(() => { }, [customerData]);

  const handlePostDetails = () => {
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidationMessage(true);
        setTimeout(() => {
          setValidationMessage(false);
        }, 5000);
      }
      return;
    }

    let finalObj = details;

    finalObj["customerEmails"] = emailString;

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Engagement/putEngagementsCusDetails`,
      data: [details],
    }).then(function (res) {
      const data = res.data;
      setMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setMessage(false);
        setButtonState("Dashboard");
      }, 1000);
      window.location.reload();
    });
  };

  const handleCancel = (e) => {
    window.location.reload();

    let ele = document.getElementsByClassName("cancel");

    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";

      ele[index].value =
        Object.keys(backUpData).length > 0 ? backUpData[ele[index].id] : "";

      if (ele[index].classList.contains("reactautocomplete")) {
        ele[
          index
        ].children[0].children[0].children[0].children[0].children[0].children[1]?.click();
      }
    }
  };

  const handleClear2 = () => {
    setDetails((prev) => ({ ...prev, cslHead: "" }));
  };

  const handleClear3 = () => {
    setDetails((prev) => ({ ...prev, cslId: "" }));
  };

  const handleClear4 = () => {
    setDetails((prev) => ({ ...prev, acslId: "" }));
  };

  const handleClear5 = () => {
    setDetails((prev) => ({ ...prev, deliveryPartnerHeadId: "" }));
  };

  const handleClear6 = () => {
    setDetails((prev) => ({ ...prev, deliveryPartnerId: "" }));
  };

  const handleClear7 = () => {
    setDetails((prev) => ({ ...prev, talentPartnerId: "" }));
  };

  const handleClear8 = () => {
    setDetails((prev) => ({ ...prev, projectCoordinatorId: "" }));
  };

  const handleClear9 = () => {
    setDetails((prev) => ({ ...prev, sqaId: "" }));
  };

  const handleClear10 = () => {
    setDetails((prev) => ({ ...prev, clId: "" }));
  };

  const handleClear11 = () => {
    setDetails((prev) => ({ ...prev, accountOwnerId: "" }));
  };
  const intialOnChangeState2 = {
    customerEmails: "",
  };

  const [onChangeState1, setOnChangeState1] = useState(intialOnChangeState1);
  const [onChangeState2, setOnChangeState2] = useState(intialOnChangeState2);

  const [finalState, setFinalState] = useState({});
  const [addList, setAddList] = useState([]);

  const handleAdd = () => {
    let data = finalState;
    data[Object.keys(data).length] = onChangeState1["customerEmails"];
    setFinalState(data);
    setAddList([...addList, { customerEmails: "" }]);
  };

  useEffect(() => { }, [addList]);

  const handleOpen = () => {
    let temp = finalState;

    if (details.customerEmails != "") {
      let pNo = details.customerEmails.includes(",")
        ? details.customerEmails.split(",")
        : details.customerEmails;

      if (details.customerEmails.includes(",")) {
        pNo.forEach((ele) => {
          temp[Object.keys(temp).length] = ele;
        });
      } else {
        temp[Object.keys(temp).length] = pNo;
      }

      setFinalState(() => temp);
    }

    setClickButtonPopUp(true);
  };

  useEffect(() => {
    if (rolesValidationMsg) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [rolesValidationMsg]);

  useEffect(() => {
    if (finalTableMsg) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [finalTableMsg]);

  useEffect(() => {
    if (custRolePopEditMsg) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [custRolePopEditMsg]);

  useEffect(() => {
    if (addMessage) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [addMessage]);
  useEffect(() => {
    if (csAddMessage) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [csAddMessage]);

  useEffect(() => {
    if (addIntStakeMessage) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [addIntStakeMessage]);

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <ul className="tabsContainer">
              <li>
                {/* {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )} */}
                {grp1Items[0]?.display_name != undefined ? (
                  <span>{grp1Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                <ul>
                  {grp1Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp2Items[0]?.display_name != undefined ? (
                  <span>{grp2Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Planning</span> */}
                <ul>
                  {grp2Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp3Items[0]?.display_name != undefined ? (
                  <span>{grp3Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Monitoring</span> */}
                <ul>
                  {grp3Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>{" "}
              <li>
                {grp4Items[0]?.display_name != undefined ? (
                  <span>{grp4Items[0]?.display_name}</span>
                ) : (
                  ""
                )}
                {/* <span>Financials</span> */}
                <ul>
                  {grp4Items.slice(1).map((button) => (
                    <li
                      className={
                        buttonState === button.display_name
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setButtonState(button.display_name);
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/")
                        );
                      }}
                    >
                      {button.display_name}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
          <div className="childTwo">
            <h2>Edit</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {message ? (
        <div className="statusMsg success">
          <span>
            <BiCheck />
            Customer {customerData[0].customerName} updated successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {validationMessage ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Please select the valid values for highlighted
            fields{" "}
          </span>
        </div>
      ) : (
        ""
      )}
      {rolesValidationMsg ? (
        <>
          <div className="statusMsg error">
            <span>
              <AiFillWarning />
              Role {updatedRole} is already exist for the customer{" "}
              {customerData[0].customerName}
            </span>
          </div>
        </>
      ) : (
        ""
      )}
      {finalTableMsg ? (
        <>
          <div className="statusMsg success">
            <span>
              <BiCheck />
              Role updated successfully
            </span>
          </div>
        </>
      ) : (
        ""
      )}
      {custRolePopEditMsg ? (
        <>
          <div className="statusMsg success">
            <span>
              <BiCheck />
              Details Saved Successfully
            </span>
          </div>
        </>
      ) : (
        ""
      )}
      {addMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Division saved successfully."}
        </div>
      ) : (
        ""
      )}
      {csAddMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Customer stakeholder saved successfully"}
        </div>
      ) : (
        ""
      )}
      {addIntStakeMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Internal Stakeholder saved successfully."}
        </div>
      ) : (
        ""
      )}
      {customerData.map((list) => (
        <div className="mb-3 mt-2 container-fluid   customCard cancel">
          <div className="group-content row">
            <div className="col-md-9">
              <div className="row">
                <div className="form-group col-md-8 mb-2">
                  <label htmlFor="fullName">
                    Customer Name <span className="error-text">*</span>
                  </label>
                  <div className="textfield">
                    <input
                      type="text"
                      className="err text disableField"
                      name="fullName"
                      id="fullName"
                      defaultValue={list.customerName}
                      disabled
                    />
                  </div>
                </div>
                <div className="form-group col-md-4 mb-2">
                  <label htmlFor="typCustStatusId">
                    Customer Status&nbsp;<span className="error-text">*</span>
                  </label>
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    className="text cancel"
                    name="typCustStatusId"
                    id="typCustStatusId"
                    onChange={handleChange}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    <option
                      value={160}
                      selected={
                        customerData[0]?.typCustStatusId == 160 ? 160 : ""
                      }
                    >
                      New
                    </option>
                    <option
                      value={161}
                      selected={
                        customerData[0]?.typCustStatusId == 161 ? 161 : ""
                      }
                    >
                      Active
                    </option>
                    <option
                      value={162}
                      selected={
                        customerData[0]?.typCustStatusId == 162 ? 162 : ""
                      }
                    >
                      InActive
                    </option>
                  </select>
                </div>
                <div className="form-group col-md-4 mb-2">
                  <label htmlFor="size">Size</label>
                  <select
                    className="cancel"
                    name="size"
                    id="size"
                    onChange={handleChange}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {size.map((Item, index) => (
                      <option
                        key={index}
                        value={Item.id}
                        selected={
                          Item.id == customerData[0]?.size
                            ? customerData[0]?.size
                            : ""
                        }
                      >
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
                    className="err  text disableField"
                    name="salesTerritoryId"
                    id="salesTerritoryId"
                    disabled="disableField"
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {salesTerritories.map((Item, index) => (
                      <option
                        key={index}
                        value={Item.id}
                        selected={
                          Item.full_name == customerData[0]?.salesterritory
                            ? customerData[0]?.salesterritory
                            : ""
                        }
                      >
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
                    className="err text disableField"
                    id="typIndustryId"
                    name="typIndustryId"
                    disabled="disableField"
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {industryType.map((Item, index) => (
                      <option
                        key={index}
                        value={Item.id}
                        selected={
                          Item.lkup_name == customerData[0]?.IndustryType
                            ? customerData[0]?.IndustryType
                            : ""
                        }
                      >
                        {Item.lkup_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="typProjCatId">
                Project Category&nbsp;<span className="error-text">*</span>
              </label>
              <select
                className="err  text disableField auto text "
                name="typProjCatId"
                id="typProjCatId"
                disabled="disableField"
                multiple="multiple"
                size={5}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>

                {projectcategory
                  .sort((a, b) =>
                    a.project_category_name.localeCompare(
                      b.project_category_name
                    )
                  )
                  .map((category) => {
                    const isSelected = projCatId.some(
                      (item) =>
                        item.project_category_name ===
                        category.project_category_name
                    );
                    if (isSelected) {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.project_category_name}
                        </option>
                      );
                    }

                    return null;
                  })}
              </select>
            </div>

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="salesPersonId">
                Sales Executive&nbsp;<span className="error-text">*</span>
              </label>
              <div
                className="autoComplete-container react  cancel  reactsearchautocomplete"
                ref={(ele) => {
                  ref.current[1] = ele;
                }}
              >
                <ReactSearchAutocomplete
                  items={resource}
                  type="Text"
                  name="salesPersonId"
                  id="salesPersonId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  resource={resource}
                  resourceFnc={resourceFnc}
                  placeholder="press space for resource list"
                  onSelect={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      salesPersonId: e.id,
                    }));
                  }}
                  showIcon={false}
                  inputSearchString={
                    customerData[0]?.name == null
                      ? ""
                      : customerData[0]?.name == ""
                        ? ""
                        : customerData[0]?.name
                  }
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
                  ref.current[2] = ele;
                }}
              >
                <DatePicker
                  name="month"
                  id="month"
                  className="cancel"
                  selected={
                    effectiveDate == null
                      ? ""
                      : effectiveDate == ""
                        ? ""
                        : effectiveDate == undefined
                          ? ""
                          : effectiveDate
                  }
                  minDate={
                    customerData[0]?.month == null
                      ? ""
                      : customerData[0]?.month == ""
                        ? ""
                        : new Date(
                          moment(customerData[0]?.month).format("MMM-yyyy")
                        )
                  }
                  onChange={(e) => {
                    SetEffectiveDate(e);
                    setDetails((prev) => ({
                      ...prev,
                      month: moment(e).format("yyyy-MM-DD"),
                    }));
                  }}
                  placeholderText="month"
                  dateFormat="MMM-yyyy"
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showMonthYearPicker
                />
              </div>
            </div>

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="clientpartnerId">Client Partner</label>
              <div className="autoComplete-container  ">
                <ReactSearchAutocomplete
                  items={resource1}
                  type="Text"
                  name="clientpartnerId"
                  id="clientpartnerId"
                  className="err "
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  resource1={resource1}
                  placeholder="press space for resource list"
                  inputSearchString={
                    customerData[0]?.clientpartner == null
                      ? ""
                      : customerData[0]?.clientpartner == ""
                        ? ""
                        : customerData[0]?.clientpartner
                  }
                  onSelect={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      clientpartnerId: e.id,
                    }));
                  }}
                  showIcon={false}
                />
              </div>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="engagementPartnerId">Engagement Partner</label>
              <div className="autoComplete-container">
                <ReactSearchAutocomplete
                  items={resource2}
                  type="Text"
                  name="engagementPartnerId"
                  id="engagementPartnerId"
                  className="err "
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  placeholder="press space for resource list"
                  inputSearchString={
                    customerData[0]?.engagementpartner == null
                      ? ""
                      : customerData[0]?.engagementpartner == ""
                        ? ""
                        : customerData[0]?.engagementpartner
                  }
                  resourceFnc={resourceFnc}
                  onSelect={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      engagementPartnerId: e.id,
                    }));
                  }}
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
                  setUsername={setUsername}
                  type="Text"
                  name="cslHeadId"
                  id="cslHeadId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.cslHead == null
                      ? ""
                      : customerData[0]?.cslHead == ""
                        ? ""
                        : customerData[0]?.cslHead
                  }
                  placeholder="press space for resource list"
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      cslHeadId: e.id,
                    }));
                  }}
                  onClear={handleClear2}
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
                  setUsername={setUsername}
                  getData={resourceFnc}
                  type="Text"
                  name="cslId"
                  id="cslId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  placeholder="press space for resource list"
                  inputSearchString={
                    customerData[0]?.cslName == null
                      ? ""
                      : customerData[0]?.cslName == ""
                        ? ""
                        : customerData[0]?.cslName
                  }
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      cslId: e.id,
                    }));
                  }}
                  onClear={handleClear3}
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
                  setUsername={setUsername}
                  getData={resourceFnc}
                  type="Text"
                  name="acslId"
                  id="acslId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.AssociateCSL == null
                      ? ""
                      : customerData[0]?.AssociateCSL == ""
                        ? ""
                        : customerData[0]?.AssociateCSL
                  }
                  placeholder="press space for resource list"
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      acslId: e.id,
                    }));
                  }}
                  onClear={handleClear4}
                  showIcon={false}
                />
              </div>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="deliveryPartnerHeadId">
                Delivery Partner Head
              </label>
              <div className="autoComplete-container cancel  reactautocomplete">
                <RiskAutoComplete
                  riskDetails={resource7}
                  setFormData={setDetails}
                  getData={resourceFnc}
                  setUsername={setUsername}
                  type="Text"
                  name="deliveryPartnerHeadId"
                  id="deliveryPartnerHeadId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.deliverypartnerHead == null
                      ? ""
                      : customerData[0]?.deliverypartnerHead == ""
                        ? ""
                        : customerData[0]?.deliverypartnerHead
                  }
                  placeholder="press space for resource list"
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      deliveryPartnerHeadId: e.id,
                    }));
                  }}
                  onClear={handleClear5}
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
                  setUsername={setUsername}
                  type="Text"
                  name="deliveryPartnerId"
                  id="deliveryPartnerId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.deliverypartner == null
                      ? ""
                      : customerData[0]?.deliverypartner == ""
                        ? ""
                        : customerData[0]?.deliverypartner
                  }
                  placeholder="press space for resource list"
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      deliveryPartnerId: e.id,
                    }));
                  }}
                  onClear={handleClear6}
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
                  setUsername={setUsername}
                  getData={resourceFnc}
                  type="Text"
                  name="talentPartnerId"
                  id="talentPartnerId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.TalentPartner == null
                      ? ""
                      : customerData[0]?.TalentPartner == ""
                        ? ""
                        : customerData[0]?.TalentPartner
                  }
                  placeholder="press space for resource list"
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      talentPartnerId: e.id,
                    }));
                  }}
                  onClear={handleClear7}
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
                  setUsername={setUsername}
                  type="Text"
                  name="projectCoordinatorId"
                  id="projectCoordinatorId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.projectCoordinator == null
                      ? ""
                      : customerData[0]?.projectCoordinator == ""
                        ? ""
                        : customerData[0]?.projectCoordinator
                  }
                  placeholder="press space for resource list"
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      projectCoordinatorId: e.id,
                    }));
                  }}
                  onClear={handleClear8}
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
                  setUsername={setUsername}
                  type="Text"
                  name="sqaId"
                  id="sqaId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.SQA == null
                      ? ""
                      : customerData[0]?.SQA == ""
                        ? ""
                        : customerData[0]?.SQA
                  }
                  placeholder="press space for resource list"
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      sqaId: e.id,
                    }));
                  }}
                  onClear={handleClear9}
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
                  setUsername={setUsername}
                  type="Text"
                  name="clId"
                  id="clId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.competencyLead == null
                      ? ""
                      : customerData[0]?.competencyLead == ""
                        ? ""
                        : customerData[0]?.competencyLead
                  }
                  placeholder="press space for resource list"
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      clId: e.id,
                    }));
                  }}
                  onClear={handleClear10}
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
                  <option
                    key={index}
                    value={Item.id}
                    selected={
                      Item.country_name == customerData[0]?.country_name
                        ? customerData[0]?.country_name
                        : ""
                    }
                  >
                    {Item.country_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="classificationId">Classification</label>
              <select
                name="classificationId"
                className="cancel"
                id="classificationId"
                onChange={handleChange}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                {classification.map((Item, index) => (
                  <option
                    key={index}
                    value={Item.id}
                    selected={
                      Item.lkup_name == customerData[0]?.classification
                        ? customerData[0]?.classification
                        : ""
                    }
                  >
                    {Item.lkup_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                className="text cancel"
                id="phone"
                defaultValue={list.phone}
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
                className="text cancel"
                id="fax"
                name="fax"
                defaultValue={customerData[0]?.fax}
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
              <label htmlFor="sfAccountLink">SF Account Link</label>
              <input
                type="text"
                name="sfAccountLink"
                className="text cancel"
                id="sfAccountLink"
                defaultValue={list.sfAccountLink}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                name="website"
                className="text cancel"
                id="website"
                defaultValue={list.website}
                required
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
                    value={emailString}
                    disabled
                    onChange={handleChange1}
                  />
                </div>
                <div className="col-md-1">
                  <BiPencil
                    cursor="pointer"
                    color="black"
                    style={{ background: "#abaeaf" }}
                    onClick={() => {
                      handleOpen();
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
                selected={
                  customerData[0]?.custReferenceable == null
                    ? ""
                    : customerData[0]?.custReferenceable
                }
                onChange={handleChange}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                <option
                  value={1}
                  selected={
                    customerData[0]?.custReferenceable == "1"
                      ? "1"
                      : customerData[0]?.custReferenceable == null
                        ? ""
                        : ""
                  }
                >
                  Yes
                </option>
                <option
                  value={0}
                  selected={
                    customerData[0]?.custReferenceable == "0"
                      ? "0"
                      : customerData[0]?.custReferenceable == null
                        ? ""
                        : ""
                  }
                  onChange={handleChange}
                >
                  No
                </option>
              </select>
            </div>
            {details.custReferenceable == 0 ? (
              <div className="form-group col-md-3 mb-2">
                <label htmlFor="custReferenceNotes">
                  If no, why not? <span className="error-text">*</span>
                </label>
                <div
                  className="textfield cancel"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  <textarea
                    type="text"
                    className="cancel"
                    name="custReferenceNotes"
                    id="custReferenceNotes"
                    rows={3}
                    required
                    placeholder="why not?"
                    defaultValue={customerData[0]?.custReferenceNotes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="accountOwnerId">Account Owner</label>
              <div className="autoComplete-container cancel  reactautocomplete">
                <RiskAutoComplete
                  riskDetails={resource14}
                  setFormData={setDetails}
                  getData={resourceFnc}
                  setUsername={setUsername}
                  type="Text"
                  name="accountOwnerId"
                  id="accountOwnerId"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  placeholder="Type minimum 3 characters to get the list"
                  onChangeHandler={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      accountOwnerId: e.id,
                    }));
                  }}
                  onClear={handleClear11}
                  inputSearchString={
                    customerData[0]?.accountowner == null
                      ? ""
                      : customerData[0]?.accountowner == ""
                        ? ""
                        : customerData[0]?.accountowner
                  }
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
                  checked={details.isNewCustomer == 1}
                  onChange={handleNewCustomerChange}
                />
                <label className="form-check-label " htmlFor="isNewCustomerYes">
                  Yes
                </label>
              </div>
              <div className="form-check form-check-inline ">
                <input
                  className="form-check-input "
                  type="radio"
                  value="0"
                  name="isNewCustomer"
                  id="isNewCustomerNo"
                  checked={details.isNewCustomer == 0}
                  onChange={handleExistingCustomerChange}
                />
                <label className="form-check-label " htmlFor="isNewCustomerNo">
                  No
                </label>
              </div>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="isQbr">Is QBR required?</label>
              <div>
                <select
                  id="isQbr"
                  name="isQbr"
                  className="cancel"
                  onChange={handleChange}
                >
                  <option
                    value="0"
                    selected={customerData[0]?.isQbr == 0 ? 0 : ""}
                  >
                    NA
                  </option>
                  <option
                    value="1"
                    selected={customerData[0]?.isQbr == 1 ? 1 : ""}
                  >
                    Quarter
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}{" "}
      {customerData.map((list) => (
        <div className="mb-3 mt-2 container-fluid   customCard cancel">
          <h2>Invoicing Details</h2>
          <div className="group-content row">
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="CiInvoiceForId">Create Invoice For</label>
              <select
                id="CiInvoiceForId"
                name="CiInvoiceForId"
                className="cancel"
                onChange={handleChange}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                <option
                  value="650"
                  selected={
                    customerData[0]?.invoiceFor == "Customer" ? 650 : ""
                  }
                >
                  Customer
                </option>
                <option
                  value="651"
                  selected={
                    customerData[0]?.invoiceFor == "Division" ? 651 : ""
                  }
                >
                  Division
                </option>
                <option
                  value="652"
                  selected={customerData[0]?.invoiceFor == "Project" ? 652 : ""}
                >
                  Project
                </option>
              </select>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="invoiceCycleId">Invoice Cycle</label>
              <select
                id="invoiceCycleId"
                className="cancel"
                onChange={handleChange}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                {invoiceCycle.map((Item, index) => (
                  <option
                    key={index}
                    value={Item.id}
                    selected={
                      Item.invoiceCycle == customerData[0]?.invoiceCycle
                        ? customerData[0]?.invoiceCycle
                        : ""
                    }
                  >
                    {Item.invoiceCycle}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group col-md-2 mb-2">
              <label htmlFor="paymentTermsId">Payment Terms</label>
              <select
                id="paymentTermsId"
                className="cancel"
                onChange={handleChange}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                {paymentTerm.map((Item, index) => (
                  <option
                    key={index}
                    value={Item.id}
                    selected={
                      Item.paymentTerms == customerData[0]?.paymentTerms
                        ? customerData[0]?.paymentTerms
                        : ""
                    }
                  >
                    {Item.paymentTerms}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-2 mb-2">
              <label htmlFor="invoiceTimeId">Invoice Time</label>
              <select
                id="invoiceTimeId"
                className="cancel"
                onChange={handleChange}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                {invoiceTime.map((Item, index) => (
                  <option
                    key={index}
                    value={Item.id}
                    selected={
                      Item.invoiceTime == customerData[0]?.invoiceTime
                        ? customerData[0]?.invoiceTime
                        : ""
                    }
                  >
                    {Item.invoiceTime}
                  </option>
                ))}
              </select>
            </div>
            <div className=" col-md-2">
              <label htmlFor="isExpenseBillable">Expense Billable </label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input cancel"
                  type="radio"
                  name="isExpenseBillable"
                  value="1"
                  id="isExpenseBillable"
                  checked={details.isExpenseBillable == 1}
                  onChange={handleIsBillableChange}
                />
                <label className="form-check-label" htmlFor="yes">
                  Yes
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input cancel"
                  type="radio"
                  name="isExpenseBillable"
                  value="0"
                  id="isExpenseBillable"
                  checked={details.isExpenseBillable == 0}
                  onChange={handleNoBillableChange}
                />
                <label className="form-check-label" htmlFor="No">
                  No
                </label>
              </div>
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="ciDiscountPercent">Discount (%)</label>
              <input
                type="text"
                className="text cancel"
                id="ciDiscountPercent"
                placeholder
                required
                defaultValue={
                  list.ciDiscountPercent == null
                    ? ""
                    : list.ciDiscountPercent == ""
                      ? ""
                      : list.ciDiscountPercent.toFixed(2)
                }
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="CiCurrencyId">Currency</label>
              <select
                id="CiCurrencyId"
                onChange={handleChange}
                className="cancel"
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                {currency.map((Item, index) => (
                  <option
                    key={index}
                    value={Item.id}
                    selected={
                      Item.currency == customerData[0]?.description
                        ? customerData[0]?.description
                        : ""
                    }
                  >
                    {Item.currency}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-2 mb-2">
              <label htmlFor="invoiceCultureId">Invoice Culture</label>
              <select
                id="invoiceCultureId"
                className="cancel"
                onChange={handleChange}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                {invoiceCulture.map((Item, index) => (
                  <option
                    key={index}
                    value={Item.id}
                    selected={
                      Item.invoiceTime == customerData[0]?.invoiceCulture
                        ? customerData[0]?.invoiceCulture
                        : ""
                    }
                  >
                    {Item.invoiceTime}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-2 mb-2">
              <label htmlFor="invoiceTemplateId">Invoice Template</label>
              <select
                name="invoiceTemplateId"
                id="invoiceTemplateId"
                onChange={handleChange}
                className="cancel"
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>

                {invoiceTemplate.map((Item, index) => (
                  <option
                    key={index}
                    value={Item.id}
                    selected={
                      Item.invoiceTemplate == customerData[0]?.invoiceTemplate
                        ? customerData[0]?.invoiceTemplate
                        : ""
                    }
                  >
                    {Item.invoiceTemplate}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary ml-2"
              onClick={() => {
                setInvSummaryPopUp(true);
              }}
            >
              Invoice Summary
            </button>
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
              onClick={() => {
                handleCancel();
              }}
            >
              <ImCross fontSize={"11px"} /> Cancel
            </button>
          </div>
          <div>
            {clickButtonPopUp ? (
              <CustomerEmailEditPopup
                clickButtonPopUp={clickButtonPopUp}
                setClickButtonPopUp={setClickButtonPopUp}
                customerData={customerData}
                setDisplayEmail={setDisplayEmail}
                details={details}
                setDetails={setDetails}
                handleChange={handleChange}
                handleAdd={handleAdd}
                finalState={finalState}
                addList={addList}
                setAddList={setAddList}
                setAddList1={setAddList1}
                addList1={addList1}
                setFinalState1={setFinalState1}
                handleAddEmail={handleAddEmail}
                finalState1={finalState1}
                handleChange1={handleChange1}
              />
            ) : (
              ""
            )}
          </div>
          {invSummaryPopUp ? (
            <InvoiceSummaryPopup
              invSummaryPopUp={invSummaryPopUp}
              setInvSummaryPopUp={setInvSummaryPopUp}
              customerId={customerId}
            />
          ) : (
            ""
          )}

          <>
            <CustomersDivisionEdit
              customerId={customerId}
              setAddMessage={setAddMessage}
            />
            <CustomersStakeholdersEdit
              customerId={customerId}
              setCsAddMessage={setCsAddMessage}
            />
            <CustomersInternalStakeholdersEdit
              customerId={customerId}
              setAddIntStakeMessage={setAddIntStakeMessage}
            />
            <CustomerRolesEdit
              customerId={customerId}
              cCountryId={cCountryId}
              customerData={customerData}
              rolesValidationMsg={rolesValidationMsg}
              setRolesValidationMsg={setRolesValidationMsg}
              updatedRole={updatedRole}
              setUpdatedRole={setUpdatedRole}
              finalTableMsg={finalTableMsg}
              setFinalTableMsg={setFinalTableMsg}
              setCustRolePopEditMsg={setCustRolePopEditMsg}
            />
          </>
        </div>
      ))}
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}

export default CustomerEdit;
