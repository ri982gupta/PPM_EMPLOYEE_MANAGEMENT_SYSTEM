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
import { MdAddBox } from "react-icons/md";
import { BiPencil } from "react-icons/bi";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import EmailPopUp from "./EmailPopUP";
import PONumberPopup from "../DeliveryComponent/PONumberPopup";
import CustomerEmailEditPopup from "./CustomerEmailEditPopup";

function Edit(props) {
  const { customerId, customerData } = props;
  const [dispalyEmail, setDisplayEmail] = useState([]);
  const [size, setSize] = useState([]);
  var date = new Date();
  // var firstDay = new Date(date.getFullYear(), date.getMonth() - 4, 1);

  var maxDate = new Date();
  var year = maxDate.getFullYear();
  var month1 = maxDate.getMonth();
  var minDate = new Date(year, month1, 1);
  var maxDate = new Date(year, month1 + 11);
  const baseUrl = environment.baseUrl;
  const [month, setMonth] = useState(
    customerData[0]?.effective_start_month === ""
      ? null
      : moment(customerData[0]?.effective_start_month).toDate()
  );
  // const [customerData, setCustomerData] = useState([]);
  const [salesTerritories, setSalesTerritories] = useState([]);
  const [projectcategory, setProjectCategory] = useState([]);
  const [industryType, setIndustryType] = useState([]);
  const [classification, setClassification] = useState([]);

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

  const [effectiveDate, SetEffectiveDate] = useState("");

  useEffect(() => {
    const conStart =
      customerData[0]?.effective_start_month == null
        ? ""
        : customerData[0]?.effective_start_month == ""
        ? ""
        : moment(customerData[0]?.effective_start_month).toDate();
    SetEffectiveDate(conStart);
  }, []);

  const intialOnChangeState1 = {
    customerEmails: "",
  };
  // };
  const [onChangeState1, setOnChangeState1] = useState(intialOnChangeState1);

  const nextMonthStartDate = moment()
    .startOf("month")
    .add(1, "month")
    .startOf("month");

  // Format the start date of the next month as "YYYY-MM-DD"
  const nextMonthStartDateFormatted = nextMonthStartDate.format("YYYY-MM-DD");

  const [details, setDetails] = useState({
    id: customerId,
    typCustStatusId: customerData[0]?.typCustStatusId,
    size: customerData[0]?.size,
    salesPersonId: customerData[0]?.salesId,
    clientPartnerId: customerData[0]?.clientpartnerId,
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
    cCountryId: customerData[0]?.countryId,
    typClassificationId: customerData[0]?.classificationId,
    phone: customerData[0]?.phone,
    fax: customerData[0]?.fax,
    sfAccountLink: customerData[0]?.sf_account_link,
    website: customerData[0]?.website,
    customerEmails: customerData[0]?.customeremail,
    custReferenceable: customerData[0]?.cust_referenceable,
    accountOwnerId: customerData[0]?.account_owner_id,
    isNewCustomer: customerData[0]?.is_new_customer == false ? 0 : 1,
    month:
      customerData[0]?.effective_start_month == null
        ? ""
        : customerData[0]?.effective_start_month,
    CiInvoiceForId: customerData[0]?.invoiceForId,
    invoiceCycleId: customerData[0]?.invoiceCycleId,
    paymentTermsId: customerData[0]?.paymentTermsId,
    invoiceTimeId: customerData[0]?.invoiceTimeId,
    CiCurrencyId: customerData[0]?.currencyId,
    isExpenseBillable: customerData[0]?.expenseBillable == "yes" ? 1 : 0,
    invoiceCultureId: customerData[0]?.invoiceCultureId,
    ciDiscountPercent: customerData[0]?.discountPercent,
    invoiceTemplateId: customerData[0]?.template_id,
  });

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [id]: value };
    });
  };

  const handleChange1 = (e) => {
    const { id, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      customerEmails: value,
    }));
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
    })
      .then((res) => {
        let manger = res.data;
        setSize(manger);
      })
      .catch((error) => {});
  };

  const handleSalesTerritories = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getSalesTerritories`,
    })
      .then((res) => {
        let manger = res.data;
        setSalesTerritories(manger);
      })
      .catch((error) => {});
  };

  const handleProjectCategory = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getAllProjectCategorys`,
    })
      .then((res) => {
        let manger = res.data;
        setProjectCategory(manger);
      })
      .catch((error) => {});
  };

  const handleIndustryType = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getIndustryType`,
    })
      .then((res) => {
        let manger = res.data;
        setIndustryType(manger);
      })
      .catch((error) => {});
  };

  const getcCountryId = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`,
    }).then((resp) => {
      setcCountryId(resp.data);
    });
  };

  const resourceFnc = async () => {
    await axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    })
      .then((res) => {
        let manger = res.data;
        let data = [];

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
      })
      .catch((error) => {});
  };

  const handleClassification = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getClassification`,
    })
      .then((res) => {
        let manger = res.data;
        setClassification(manger);
      })
      .catch((error) => {});
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
    // setTimeout(() => {
    //   document.getElementsByClassName("pageTitle")[0]?.click();
    // }, 100);

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
  }, []);

  const handlePostDetails = () => {
    // let valid = GlobalValidation(ref);
    // if (valid) {
    //   {
    //     setSuccessvalidationmessage(true);
    //   }
    //   return;
    // }

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Engagement/putEngagementsCusDetails`,
      data: [details],
    }).then(function (res) {
      const data = res.data;
      window.open(
        `/#/search/customerSearch/customer/dashboard/:${customerId}`
        // `_self`
      );
    });
  };
  const handleCancel = (e) => {
    let ele = document.getElementsByClassName("cancel");

    // GlobalCancel(ref);
    // setSuccessvalidationmessage(false);

    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";

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

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Edit</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {customerData.map((list) => (
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

                    // ref={(ele) => {
                    //   ref.current[0] = ele;
                    // }}
                  >
                    <input
                      type="text"
                      className="err text disableField"
                      name="fullName"
                      id="fullName"
                      defaultValue={list.customerName}
                      disabled

                      // onMouseEnter={handleChange}
                      //onChange={handleChange2}
                      // defaultValue={
                      //   onChangeState.fullName != undefined
                      //     ? onChangeState.fullName
                      //     : ""
                      // }
                    />
                  </div>
                </div>
                <div className="form-group col-md-4 mb-2">
                  <label htmlFor="typCustStatusId">
                    Customer Status&nbsp;<span className="error-text">*</span>
                  </label>
                  <select
                    // ref={(ele) => {
                    //   ref.current[1] = ele;
                    // }}
                    className="text"
                    name="typCustStatusId"
                    id="typCustStatusId"
                    // defaultValue={list.typCustStatusId}
                    // selected={customerData[0]?.customerstatus}
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
                    className=""
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
                    // ref={(ele) => {
                    //   ref.current[2] = ele;
                    // }}
                    className="err  text disableField"
                    name="salesTerritoryId"
                    id="salesTerritoryId"
                    disabled="disableField"
                    //onChange={handleChange}
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
                    // ref={(ele) => {
                    //   ref.current[3] = ele;
                    // }}
                    className="err text disableField"
                    id="typIndustryId"
                    name="typIndustryId"
                    disabled="disableField"
                    //onChange={handleChange}
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
                // ref={(ele) => {
                //   ref.current[4] = ele;
                // }}
                className="err  text disableField auto text "
                name="typProjCatId"
                id="typProjCatId"
                disabled="disableField"
                //onChange={handleChange}
                multiple="multiple"
                size={5}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                {/* {projectcategory.map((Item, index) => (
                  <option
                    key={index}
                    value={Item.id}
                    selected={
                      Item.project_category_name ==
                      customerData[0]?.projectcategory
                        ? customerData[0]?.projectcategory
                        : ""
                    }
                  >
                    {Item.project_category_name}
                  </option>
                ))} */}
                {projectcategory.map((Item, index) => {
                  if (
                    Item.project_category_name ===
                    customerData[0]?.projectcategory
                  ) {
                    return (
                      <option
                        key={index}
                        value={Item.id}
                        selected={
                          Item.project_category_name ===
                          customerData[0]?.projectcategory
                        }
                      >
                        {Item.project_category_name}
                      </option>
                    );
                  } else {
                    return null;
                  }
                })}
              </select>
            </div>

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="salesPersonId">
                Sales Executive&nbsp;<span className="error-text">*</span>
              </label>
              <div className=" autoComplete-container">
                <ReactSearchAutocomplete
                  items={resource}
                  type="Text"
                  name="salesPersonId"
                  id="salesPersonId"
                  className="err "
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
                    customerData[0]?.name == null ? "" : customerData[0]?.name
                  }
                />
              </div>
            </div>

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="Month">
                Effective Month&nbsp;<span className="error-text">*</span>
              </label>
              <div className="datepicker">
                <DatePicker
                  name="month"
                  id="month"
                  className=""
                  selected={effectiveDate == null ? "" : effectiveDate}
                  // minDate={minDate}
                  minDate={
                    effectiveDate == null
                      ? ""
                      : effectiveDate == ""
                      ? ""
                      : new Date(
                          effectiveDate.getFullYear(),
                          effectiveDate.getMonth() + 1
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
                  Value={
                    customerData[0]?.effective_start_month == null
                      ? ""
                      : moment(customerData[0]?.effective_start_month).format(
                          "MMM-YYYY"
                        )
                  }
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
              <div className="autoComplete-container  ">
                <ReactSearchAutocomplete
                  items={resource1}
                  type="Text"
                  name="clientPartnerId"
                  id="clientPartnerId"
                  className="err "
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  resource1={resource1}
                  placeholder="press space for resource list"
                  inputSearchString={
                    customerData[0]?.clientpartner == null
                      ? ""
                      : customerData[0]?.clientpartner
                  }
                  onSelect={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      clientPartnerId: e.id,
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
                      : customerData[0]?.engagementpartner
                  }
                  //resource1={resource1}
                  resourceFnc={resourceFnc}
                  //placeholder=""=""
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
                  // items={resource4}
                  riskDetails={resource4}
                  setFormData={setDetails}
                  getData={resourceFnc}
                  type="Text"
                  name="cslHeadId"
                  id="cslHeadId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.cslHead == null
                      ? ""
                      : customerData[0]?.cslHead
                  }
                  placeholder="press space for resource list"
                  // resourceFnc={resourceFnc}
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
                  // items={resource5}
                  riskDetails={resource5}
                  setFormData={setDetails}
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
                      : customerData[0]?.cslName
                  }
                  //resource1={resource1}
                  // resourceFnc={resourceFnc}
                  //placeholder=""=""
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
                  // items={resource6}
                  riskDetails={resource6}
                  setFormData={setDetails}
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
                      : customerData[0]?.AssociateCSL
                  }
                  placeholder="press space for resource list"
                  //resource1={resource1}
                  // resourceFnc={resourceFnc}
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
                  // items={resource7}
                  riskDetails={resource7}
                  setFormData={setDetails}
                  getData={resourceFnc}
                  type="Text"
                  name="deliveryPartnerHeadId"
                  id="deliveryPartnerHeadId"
                  className="err cancel"
                  //resource1={resource1}
                  // resourceFnc={resourceFnc}
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.deliverypartnerHead == null
                      ? ""
                      : customerData[0]?.deliverypartnerHead
                  }
                  //placeholder=""=""
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
                  // items={resource8}
                  riskDetails={resource8}
                  setFormData={setDetails}
                  getData={resourceFnc}
                  type="Text"
                  name="deliveryPartnerId"
                  id="deliveryPartnerId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.deliverypartner == null
                      ? ""
                      : customerData[0]?.deliverypartner
                  }
                  placeholder="press space for resource list"
                  //resource1={resource1}
                  // resourceFnc={resourceFnc}
                  //placeholder=""=""
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
                  // items={resource9}
                  riskDetails={resource9}
                  setFormData={setDetails}
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
                      : customerData[0]?.TalentPartner
                  }
                  placeholder="press space for resource list"
                  //resource1={resource1}
                  // resourceFnc={resourceFnc}
                  //placeholder=""=""
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
                  // items={resource10}
                  riskDetails={resource10}
                  setFormData={setDetails}
                  getData={resourceFnc}
                  type="Text"
                  name="projectCoordinatorId"
                  id="projectCoordinatorId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.projectCoordinator == null
                      ? ""
                      : customerData[0]?.projectCoordinator
                  }
                  placeholder="press space for resource list"
                  //resource1={resource1}
                  // resourceFnc={resourceFnc}
                  //placeholder=""=""
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
                  // items={resource11}
                  riskDetails={resource11}
                  setFormData={setDetails}
                  getData={resourceFnc}
                  type="Text"
                  name="sqaId"
                  id="sqaId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.SQA == null ? "" : customerData[0]?.SQA
                  }
                  //resource1={resource1}
                  // resourceFnc={resourceFnc}
                  //placeholder=""=""
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
                  // items={resource3}
                  riskDetails={resource3}
                  setFormData={setDetails}
                  getData={resourceFnc}
                  type="Text"
                  name="clId"
                  id="clId"
                  className="err cancel"
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  inputSearchString={
                    customerData[0]?.competencyLead == null
                      ? ""
                      : customerData[0]?.competencyLead
                  }
                  placeholder="press space for resource list"
                  //resource1={resource1}
                  // resourceFnc={resourceFnc}
                  //placeholder=""=""
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
                className=""
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
              <label htmlFor="typClassificationId">Classification</label>
              <select
                name="typClassificationId"
                className=""
                id="typClassificationId"
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
              <label htmlFor="phone">phone</label>
              <input
                type="text"
                name="phone"
                className="form-control "
                id="phone"
                defaultValue={list.phone}
                //placeholder=""=""
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
                className="form-control "
                id="fax"
                //placeholder=""=""
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
                className="form-control "
                id="sfAccountLink"
                defaultValue={list.sf_account_link}
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                name="website"
                className="form-control "
                id="website"
                defaultValue={list.website}
                //placeholder=""=""
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
                    // defaultValue={list.customeremail + dispalyEmail}
                    disabled
                    value={details.customerEmails + dispalyEmail}
                    // onChange={handleChange}
                  />
                </div>
                <div className="col-md-1">
                  <button className="btn">
                    <BiPencil
                      onClick={() => {
                        setClickButtonPopUp(true);
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="custReferenceable">
                Is this customer referenceable?
              </label>
              <select
                id="custReferenceable"
                className=""
                name="custReferenceable"
                selected={
                  customerData[0]?.cust_referenceable == null
                    ? ""
                    : customerData[0]?.cust_referenceable
                }
                onChange={handleChange}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                <option
                  value={1}
                  selected={
                    customerData[0]?.cust_referenceable == "1"
                      ? 1
                      : customerData[0]?.cust_referenceable == null
                      ? ""
                      : ""
                  }
                >
                  Yes
                </option>
                <option
                  value={0}
                  selected={
                    customerData[0]?.cust_referenceable == "0"
                      ? 0
                      : customerData[0]?.cust_referenceable == null
                      ? ""
                      : ""
                  }
                  onChange={handleChange}
                >
                  No
                </option>
              </select>
            </div>

            <div className="form-group col-md-3 mb-2">
              <label htmlFor="accountOwnerId">Account Owner</label>
              <div className="autoComplete-container   reactautocomplete">
                <ReactSearchAutocomplete
                  items={resource14}
                  // setFormData={setDetails}
                  // getData={resourceFnc}
                  // value="0"
                  type="Text"
                  name="accountOwnerId"
                  id="accountOwnerId"
                  // className="err cancel"
                  //fuseOptions={{ keys: ["id", "name"] }}
                  //resultStringKeyName="name"
                  //resource1={resource1}
                  // resourceFnc={resourceFnc}
                  fuseOptions={{ keys: ["id", "name"] }}
                  resultStringKeyName="name"
                  // resource={resource}
                  resourceFnc={resourceFnc}
                  placeholder="Type minimum 3 characters to get the list"
                  //placeholder=""=""
                  onSelect={(e) => {
                    setDetails((prevProps) => ({
                      ...prevProps,
                      accountOwnerId: e.id,
                    }));
                  }}
                  inputSearchString={
                    customerData[0]?.accountowner == null
                      ? ""
                      : customerData[0]?.accountowner
                  }
                  // onClear={handleClear14}
                  showIcon={false}
                />
              </div>
            </div>

            <div className="col-md-3">
              <label htmlFor="isNewCustomer">New Logo</label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input "
                  type="radio"
                  value="1"
                  name="isNewCustomer"
                  id="isNewCustomerYes"
                  // onChange={handleChange}
                  checked={details.isNewCustomer == 1}
                  onChange={handleNewCustomerChange}
                  // checked={customerData[0]?.is_new_customer === true}
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
                  // onChange={handleChange}
                  checked={details.isNewCustomer == 0}
                  onChange={handleExistingCustomerChange}
                  // checked={customerData[0]?.is_new_customer === false}
                />
                <label className="form-check-label " htmlFor="isNewCustomerNo">
                  No
                </label>
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
              <label htmlFor="invoiceForId">Create Invoice For</label>
              <select
                id="CiInvoiceForId"
                name="CiInvoiceForId"
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
              <select id="invoiceCycleId" onChange={handleChange}>
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
              <select id="paymentTermsId" onChange={handleChange}>
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
              <select id="invoiceTimeId" onChange={handleChange}>
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
                  className="form-check-input"
                  type="radio"
                  name="isExpenseBillable"
                  value="1"
                  id="isExpenseBillable"
                  // onChange={handleChange}
                  checked={details.isExpenseBillable == 1}
                  onChange={handleIsBillableChange}
                  // checked={
                  //   customerData[0]?.expenseBillable == "yes" ? true : false
                  // }
                />
                <label className="form-check-label" htmlFor="yes">
                  Yes
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="isExpenseBillable"
                  value="0"
                  id="isExpenseBillable"
                  // onChange={handleChange}
                  checked={details.isExpenseBillable == 0}
                  onChange={handleNoBillableChange}
                  // checked={
                  //   customerData[0]?.expenseBillable == "No" ? true : false
                  // }
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
                className="form-control"
                id="ciDiscountPercent"
                placeholder
                required
                defaultValue={
                  list.discountPercent == null
                    ? ""
                    : list.discountPercent == ""
                    ? ""
                    : list.discountPercent.toFixed(2)
                }
                onChange={handleChange}
              />
            </div>
            <div className="form-group col-md-3 mb-2">
              <label htmlFor="CiCurrencyId">Currency</label>
              <select id="CiCurrencyId" onChange={handleChange}>
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
              <select id="invoiceCultureId" onChange={handleChange}>
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
              <select id="invoiceTemplateId" onChange={handleChange}>
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

          <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
            <button
              className="btn btn-primary"
              type="submit"
              onClick={() => {
                handlePostDetails();
              }}
            >
              <VscSave /> Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                handleCancel();
              }}
            >
              <ImCross /> Cancel
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
              />
            ) : (
              ""
            )}
          </div>

          <>
            <CustomersDivisionEdit customerId={customerId} />
            <CustomersStakeholdersEdit customerId={customerId} />
            <CustomersInternalStakeholdersEdit customerId={customerId} />
            <CustomerRolesEdit
              customerId={customerId}
              cCountryId={cCountryId}
            />
          </>
        </div>
      ))}
    </div>
  );
}

export default Edit;
