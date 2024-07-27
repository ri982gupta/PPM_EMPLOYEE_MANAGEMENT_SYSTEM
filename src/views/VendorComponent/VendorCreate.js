import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import "./VendorCss.scss";
import { environment } from "../../environments/environment";
import { VscSave } from "react-icons/vsc";
import { ImCross } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import { AiFillWarning } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Loader from "../Loader/Loader";
import moment from "moment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import InitialParentVendorTabs from "./IntialParentVendorTabs";
import ParentVendorTabs from "./ParentVendorTabs";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function VendorCreate(props) {
  const {
    vendorData,
    setbtnState,
    setConfirmationMessage,
    Data,
    // getVendorData,
    getData,

    urlState,
    buttonState,
    setButtonState,
    setUrlState,
    btnState,
  } = props;
  const HelpPDFName = "CreateVMG.pdf";
  const [responseData, setResponseData] = useState([]);
  const HelpHeader = "VMG Create Help";
  const [countryId, setcountryId] = useState([]);
  const [states, setStates] = useState([]);
  const [finalstates, setFinalStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [finalcities, setFinalCities] = useState([]);
  const [business, setBusiness] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [successfulmessage, setSuccessfulmessage] = useState(false);
  const [backUpData, setBackUpData] = useState({});
  const [vendorNamesArr, setVendorNamesArr] = useState();
  const baseUrl = environment.baseUrl;
  const [successMsg, setSuccessMsg] = useState(false);
  const [loader, setLoader] = useState(false);
  const [key, setKey] = useState(0);
  const [selectedFile, setSelectedFile] = useState([]);
  const [overAlldaata, setOverAlldaata] = useState([]);
  const [vendorStatusOptions, setVendorStatusOptions] = useState([]);

  const [details, setDetails] = useState({
    vendorId: "",
    vendorName: "",
    contactName: "",
    phone: "",
    email: "",
    mailingAddress: "",
    cityId: "",
    stateId: "",
    zipCode: "",
    countryId: "",
    sponsoreName: "",
    overAllRating: "",
    nextReviewDt: "",
    contractSignedDt: "",
    contractExpireDt: "",
    contractReviewDt: "",
    approvalDt: "",
    website: "",
    fax: "",
    descriptionNote: "",
    serviceDtls: "",
    companyEstablishedDt: "",
    location: "",
    businessId: "<<Please Select>>",
    isInsured: "<<Please Select>>",
    isLicensed: "<<Please Select>>",
    gstNum: "",
    licenseNum: "",
    bankName: "",
    beneficiaryName: "",
    accountNumber: "",
    ifscCode: "",
    bankAddress: "",
    documentId: null,
    vendorStatus: "",
    conversionEligibility: "",
    comments: ""
  });

  const loggedUserId = localStorage.getItem("resId");
  console.log(responseData?.id, responseData);
  const [routes, setRoutes] = useState([]);
  let textContent = "Vendors";
  let currentScreenName =
    vendorData == undefined
      ? ["Vendors", "Create Vendor"]
      : ["Vendors", "Edit Vendor"];
  console.log(details);
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDetails((prev) => {
      return { ...prev, [name]: value };
    });

  };

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Management") {
            return {
              ...submenu,
              display_name: "Subk Management",
            };
          }
          if (submenu.display_name === "Performance") {
            return {
              ...submenu,
              display_name: "Subk GM Analysis",
            };
          }
          return submenu;
        }),
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
  {
    /*-------------------*/
  }
  const getVendorNamesArray = () => {
    axios({
      method: "get",
      url: baseUrl + `/VendorMS/vendor/getVendorNames`,
    })
      .then(function (response) {
        let resp = response.data;
        setVendorNamesArr(resp);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  {
    /*-------------------*/
  }

  const getBusinessType = () => {
    axios({
      method: "get",
      url: baseUrl + `/VendorMS/vendor/getBusinessType`,
    })
      .then(function (response) {
        let resp = response.data;
        setBusiness(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };
  const created = 1;
  /////////////////////////////////////////Handle-Submit///////////////////////////////////////
  const ref = useRef([]);

  const [uniqueMessage, setUniqueMessage] = useState(false);

  const navigate = useNavigate(null);
  // console.log(selectedFile);

  const handleSubmit = (e) => {

    setSuccessMsg(false);
    setLoader(false);
    let valid = GlobalValidation(ref);
    if (valid == true) {
      setValidationMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
    }
    if (valid) {
      return;
    }

    let someDataa = vendorNamesArr.some((d) => d.name == details.vendorName);
    if (vendorData == undefined) {
      if (someDataa) {
        let ele = document.getElementsByClassName("unique");
        for (let index = 0; index < ele.length; index++) {
          ele[index].classList.add("error-block");
        }
        setUniqueMessage(true);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page

        setValidationMessage(false);
        setTimeout(() => {
          setUniqueMessage(false);
        }, 3000);
        return;
      }
    }

    console.log(someDataa, uniqueMessage);

    details["nextReviewDt"] =
      details.nextReviewDt == "" ? null : details.nextReviewDt;
    details["contractSignedDt"] =
      details.contractSignedDt == "" ? null : details.contractSignedDt;
    details["contractExpireDt"] =
      details.contractExpireDt == "" ? null : details.contractExpireDt;
    details["contractReviewDt"] =
      details.contractReviewDt == "" ? null : details.contractReviewDt;
    details["approvalDt"] =
      details.approvalDt == "" ? null : details.approvalDt;
    details["companyEstablishedDt"] =
      details.companyEstablishedDt == "" ? null : details.companyEstablishedDt;
    // console.log(details.comments = details.conversion_eligibility=="No"? "No"")
    let DetailsNw = { ...details };
    delete DetailsNw.businessId;
    delete DetailsNw.serviceDtls;
    delete DetailsNw.sponsoreName;
    DetailsNw.buisnessType = details.businessId;
    DetailsNw.serviceDtls = details.serviceDtls;
    DetailsNw.sponsoreName = details.sponsoreName;

    // axios({
    //   // method: "post",
    //   // url: baseUrl + `/VendorMS/vendor/postvendordata`,
    //   // data: DetailsNw,
    // })
    axios
      .postForm(
        baseUrl +
        `/VendorMS/vendor/createFolder1?commitMessage=Test&fileRevision=1.0&loggedUserId=${loggedUserId}&isUpdate=0`,
        {
          file: selectedFile,
          model: JSON.stringify(DetailsNw),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setResponseData(res.data);
        setValidationMessage(false);
        // getVendorData();
        let name = res.data.vendorName;
        let vId = res.data.id;
        navigate(`/vendor/vendorDoc/:${vId}`);

        if (!setbtnState) {
          navigate(`/vendor/vendorDoc/:${vId}`, {
            state: { successMessage: `Vendor ${name} successfully Created.` },
            name: name,
          });
        } else {
          getData();
          setbtnState("Dashboard");
          vendorData[0] = details;
        }
        setConfirmationMessage(true);
        setSuccessfulmessage(true);
        setValidationMessage(false);
        // getVendorData();
        setSuccessMsg(true);
        setTimeout(() => {
          setConfirmationMessage(false);
          setLoader(true);
        }, 2000);
        // navigate(`/vendor/vendorDoc/:${vId}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /////////////////////////////////////////Handle-Cancel///////////////////////////////////////
  const handleCancel = () => {
    GlobalCancel(ref);
    setSuccessfulmessage(false);
    setValidationMessage(false);
    let ele = document.getElementsByClassName("cancel");
    for (let index = 0; index < ele.length; index++) {
      if (ele[index].id == "stateId") {
        let tempStatesNew = states;
        let countryIdN = backUpData.countryId;
        let fStates = tempStatesNew.filter((d) => d.countryId == countryIdN);
        setFinalStates(fStates);
        setDetails((prev) => ({ ...prev, ["stateId"]: backUpData.stateId }));
      } else if (ele[index].id == "cityId") {
        let tempCityNew = cities;
        let stateIdN = backUpData.stateId;
        let fCities = tempCityNew.filter((d) => d.stateId == stateIdN);
        setFinalCities(fCities);
        setDetails((prev) => ({ ...prev, ["cityId"]: backUpData.cityId }));
      } else if (ele[index].id == "businessId") {
        setDetails((prev) => ({
          ...prev,
          ["businessId"]: backUpData.businessId,
        }));
      } else {
        ele[index].value =
          Object.keys(backUpData).length > 0 ? backUpData[ele[index].id] : "";
      }
    }
    if (vendorData !== undefined && vendorData.length > 0) {
      // setDetails((prev) => ({ ...prev, ["mailingAddress"]: "" }));
      // setDetails((prev) => ({ ...prev, ["descriptionNote"]: "" }));
      // // setDetails((prev) => ({ ...prev, ["serviceDetls"]: "" }));
      // setDetails((prev) => ({ ...prev, ["sponsoreName"]: null }));
      // setDetails((prev) => ({ ...prev, ["bankAddress"]: "" }));

      setDetails((prev) => ({
        ...prev,
        ["mailingAddress"]: backUpData.mailingAddress,
      }));
      setDetails((prev) => ({
        ...prev,
        ["descriptionNote"]: backUpData.descriptionNote,
      }));
      setDetails((prev) => ({
        ...prev,
        ["sponsoreName"]: backUpData.sponsoreName,
      }));
      setDetails((prev) => ({
        ...prev,
        ["bankAddress"]: backUpData.bankAddress,
      }));
      setDetails((prev) => ({
        ...prev,
        ["nextReviewDt"]: backUpData.nextReviewDt,
      }));
      setDetails((prev) => ({
        ...prev,
        ["serviceDtls"]: backUpData.serviceDtls,
      }));
      setDetails((prev) => ({
        ...prev,
        ["contractSignedDt"]: backUpData.contractSignedDt,
      }));
      setDetails((prev) => ({
        ...prev,
        ["contractReviewDt"]: backUpData.contractReviewDt,
      }));
      setDetails((prev) => ({
        ...prev,
        ["contractExpireDt"]: backUpData.contractExpireDt,
      }));
      setDetails((prev) => ({
        ...prev,
        ["approvalDt"]: backUpData.approvalDt,
      }));
      setDetails((prev) => ({
        ...prev,
        ["companyEstablishedDt"]: backUpData.companyEstablishedDt,
      }));
      setDetails((prev) => ({
        ...prev,
        ["businessId"]: backUpData.businessId,
      }));
      setDetails((prev) => ({
        ...prev,
        ["vendorStatus"]: backUpData.vendorStatus,
      }));
    } else {
      setDetails((prev) => ({ ...prev, ["mailingAddress"]: "" }));
      setDetails((prev) => ({ ...prev, ["descriptionNote"]: "" }));
      setDetails((prev) => ({ ...prev, ["serviceDtls"]: "" }));
      setDetails((prev) => ({ ...prev, ["sponsoreName"]: "" }));
      setDetails((prev) => ({ ...prev, ["bankAddress"]: "" }));
      setDetails((prev) => ({ ...prev, ["nextReviewDt"]: "" }));
      setDetails((prev) => ({ ...prev, ["contractSignedDt"]: "" }));
      setDetails((prev) => ({ ...prev, ["contractReviewDt"]: "" }));
      setDetails((prev) => ({ ...prev, ["contractExpireDt"]: "" }));
      setDetails((prev) => ({ ...prev, ["approvalDt"]: "" }));
      setDetails((prev) => ({ ...prev, ["companyEstablishedDt"]: "" }));
    }
  };
  useEffect(() => {
    getcountryId();
    getStates();
    getCities();
    getBusinessType();
    getVendorNamesArray();
    getMenus();
    getUrlPath();
  }, []);

  useEffect(() => {
    if (vendorData !== undefined && vendorData.length > 0) {
      setDetails(vendorData[0]);
      setBackUpData(JSON.parse(JSON.stringify(vendorData[0])));
      getStates();
      getCities();
      getBusinessType();
      //const navigate = useNavigate();
    }
  }, [vendorData]);

  //////////////////////////////////////Document-Hiding//////////////////////////////////////
  const Document = () => {
    if (vendorData !== undefined) {
      return <></>;
    } else {
      return (
        <div className="customCard">
          <h2>Documents</h2>
          <div className="group-content">
            <div className="form-group row">
              <div className="col-md-3 mb-1">
                <div className="form-group">
                  <label>Upload Document</label>

                  <input type="file" id="myfile" name="myfile" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  //////////////////////////////////////Country-State-City//////////////////////////////////////
  useLayoutEffect(
    () => {
      let tempStates = states;
      let countryId = details.countryId;
      let fStates = tempStates.filter((d) => d.countryId == countryId);
      setFinalStates(fStates);

      let tempCities = cities;
      let stateId = details.stateId;
      let fCountries = tempCities.filter((d) => d.stateId == stateId);
      setFinalCities(fCountries);
    },
    [states, cities],
    []
  );

  const getcountryId = () => {
    axios({
      url: baseUrl + `/CostMS/cost/getCountries`,
      //url: `http://localhost:8061/CostMS/cost/getCountries`
    }).then((resp) => {
      setcountryId(resp.data);
    });
  };

  const getStates = () => {
    axios({
      url: baseUrl + `/VendorMS/vendor/states`,
    }).then((resp) => {
      setStates(resp.data.filter((d) => d.state != "Others"));
    });
  };
  const getCities = () => {
    axios({
      url: baseUrl + `/VendorMS/vendor/cities`,
    }).then((resp) => {
      setCities(resp.data.filter((d) => d.city != "Others"));
      console.log(resp.data.filter((d) => d.city != "Others"));
    });
  };

  const getVendorStatusOptions = () => {
    axios({
      url: baseUrl + `/VendorMS/vendor/getVendorStatus`,
    }).then((resp) => {
      setVendorStatusOptions(resp.data);
    });
  };

  const handleDropdownChange = (event) => {
    const selectedId = parseInt(event.target.value);
    const selected = vendorStatusOptions.find(
      (option) => option.id === selectedId
    );
    setSelectedOption(selectedId);
  };

  const countryHandler = (e) => {
    let statesData = JSON.parse(JSON.stringify(states));
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
    setFinalCities([]);
    const { id, value } = e.target;
    setDetails((prev) => ({ ...prev, [id]: value }));
  };
  console.log(details.contractReviewDt, new Date(details.contractReviewDt));
  const stateHandler = (e) => {
    let citiesData = JSON.parse(JSON.stringify(cities));
    let fData = citiesData.filter((d) => d.stateId == e.target.value);

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
    const { id, value } = e.target;
    setDetails((prev) => ({ ...prev, [id]: value }));
  };
  const getNewVendorDetailsforRating = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/VendorMS/vendor/newvendorDataDetails`,
    }).then((resp) => {
      let data = resp.data;
      setOverAlldaata(data[0].over_all_rating);
      console.log(data[0].over_all_rating);
    });
  };
  useEffect(() => {
    getNewVendorDetailsforRating();
    getVendorStatusOptions();
  }, []);

  /////////////////////////////////////-------------------------------///////////////////////////////////////
  return (
    <div>
      {successMsg && (
        <div className="statusMsg success">Vendor Updated Successfully</div>
      )}
      {vendorData !== undefined ? (
        <>
          {successfulmessage ? (
            <div className="statusMsg success">Vendor Updated Successfully</div>
          ) : (
            ""
          )}
        </>
      ) : (
        <>
          {successfulmessage ? (
            <div className="statusMsg success">Vendor Added Successfully</div>
          ) : (
            ""
          )}
        </>
      )}
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select the valid values for highlighted
          fields
        </div>
      ) : (
        ""
      )}
      {uniqueMessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please give unique Vendor Id and Vendor Name
        </div>
      ) : (
        ""
      )}

      {/* ///////////////////////////////////Title///////////////////////////////////// */}

      <div className="pageTitle">
        <div className="childOne">
          <div className="tabsProject">
            {vendorData === undefined ? (
              <InitialParentVendorTabs
                buttonState={buttonState}
                setButtonState={setButtonState}
                setUrlState={setUrlState}
              />
            ) : (
              <ParentVendorTabs
                btnState={btnState}
                setbtnState={setbtnState}
                setUrlState={setUrlState}
              />
            )}
          </div>
        </div>
        <div className="childTwo">
          {vendorData === undefined ? (
            <h2>Create Vendor</h2>
          ) : (
            <h2>Edit Vendor</h2>
          )}
        </div>
        <div className="childThree toggleBtns">
          <div></div>
          <GlobalHelp pdfname={HelpPDFName} name={HelpHeader} />
        </div>
      </div>

      <div>
        {/* ///////////////////////////////////Vendor-Info///////////////////////////////////// */}
        <div className="form customCard">
          <h2>Vendor Info</h2>

          <div className="group-content">
            <div className="row" id="myForm">
              <div className="col-md-3 mb-1">
                <label>
                  Vendor Id&nbsp;<span className="required error-text">*</span>
                </label>

                {vendorData !== undefined ? (
                  <div
                    className="textfield"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <input
                      type="text"
                      className="err cancel text disableField"
                      id="vendorId"
                      defaultValue={details?.vendorId}
                      onChange={handleChange}
                      name="vendorId"
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
                      type="text"
                      className="unique cancel text"
                      id="vendorId"
                      defaultValue={details?.vendorId}
                      onChange={handleChange}
                      onKeyDown={(event) => {
                        if (event.code == "Space" && !details.vendorId)
                          event.preventDefault();
                      }}
                      name="vendorId"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="col-md-3 mb-1">
                <label>
                  Vendor Name&nbsp;
                  <span className="required error-text">*</span>
                </label>
                {vendorData !== undefined ? (
                  <div
                    className="textfield"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <input
                      type="text"
                      className="err text cancel disableField"
                      id="vendorName"
                      defaultValue={details?.vendorName}
                      onChange={handleChange}
                      name="vendorName"
                      style={{ cursor: "not-allowed" }}
                      required
                      disabled
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
                      id="vendorName"
                      defaultValue={details?.vendorName}
                      onChange={handleChange}
                      name="vendorName"
                      onKeyDown={(event) => {
                        if (event.code == "Space" && !details.vendorName)
                          event.preventDefault();
                      }}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="col-md-3 mb-1">
                <label>
                  Contact Name&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <input
                    type="text"
                    className="err text cancel"
                    id="contactName"
                    defaultValue={details?.contactName}
                    onChange={handleChange}
                    name="contactName"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.contactName)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  Phone&nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  <input
                    type="text"
                    className="err text cancel"
                    id="phone"
                    defaultValue={details?.phone}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      e.key == " ";
                    }}
                    onKeyDown={(e) =>
                      e.keyCode &&
                      (e.keyCode <= 47 || e.keyCode >= 58) &&
                      e.keyCode != 8 &&
                      e.preventDefault()
                    }
                    name="phone"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 mb-1">
                <label>
                  Email&nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[4] = ele;
                  }}
                >
                  <input
                    type="text"
                    className="err text cancel"
                    id="email"
                    defaultValue={details?.email}
                    onChange={handleChange}
                    name="email"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.email)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  Country&nbsp;<span className="required error-text">*</span>
                </label>
                <div>
                  <select
                    id="countryId"
                    className="text cancel "
                    onChange={(e) => {
                      countryHandler(e);
                    }}
                    ref={(ele) => {
                      ref.current[5] = ele;
                    }}
                  >
                    <option key="" value="">
                      {"<<Please Select>>"}
                    </option>
                    {countryId
                      .sort((a, b) => {
                        return b.country_name - a.country_name;
                      })
                      .map((data) => (
                        <option
                          key={data.id}
                          id="enteredDetails countryId"
                          value={data.id}
                          selected={
                            details?.countryId == data.id ? true : false
                          }
                        >
                          {data.country_name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3 mb-1">
                <label>
                  State&nbsp;<span className="required error-text">*</span>
                </label>
                <div>
                  <select
                    id="stateId"
                    name="stateID"
                    className="text cancel "
                    onChange={(e) => {
                      stateHandler(e);
                    }}
                    ref={(ele) => {
                      ref.current[6] = ele;
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
                      .map((data1) => (
                        <option
                          key={data1.country}
                          id="stateId"
                          value={data1.id}
                          selected={details?.stateId == data1.id ? true : false}
                          defaultValue={details?.stateId}
                        >
                          {data1.state}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3 mb-1">
                <label>
                  City&nbsp;<span className="required error-text">*</span>
                </label>
                <div>
                  <select
                    id="cityId"
                    name="cityId"
                    className=" cancel text "
                    onChange={cityIdHandler}
                    ref={(ele) => {
                      ref.current[7] = ele;
                    }}
                    required
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
                          id="cityId"
                          selected={details?.cityId == data2.id ? true : false}
                          value={data2.id}
                        >
                          {data2.city}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 mb-1">
                <label>
                  ZIP/Postal Code&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[8] = ele;
                  }}
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    id="zipCode"
                    defaultValue={details?.zipCode}
                    className="err text cancel"
                    name="zipCode"
                    required
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.zipCode)
                        event.preventDefault();
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3 mb-1">
                <label>
                  Vendor Status&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div>
                  <select
                    id="statusId"
                    className="text cancel "
                    onChange={handleChange}
                    ref={(ele) => {
                      ref.current[13] = ele;
                    }}
                    name="vendorStatus"
                  >
                    <option key="" value="">
                      {"<<Please Select>>"}
                    </option>
                    {vendorStatusOptions.map((option) => (
                      <option
                        key={option.id}
                        value={option.id}
                        selected={details?.vendorStatus === option.id}
                      >
                        {option.lkup_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>Sponsor Name</label>

                <input
                  type="text"
                  onChange={handleChange}
                  id="sponsoreName"
                  defaultValue={
                    details.sponsoreName == null ? "-" : details.sponsoreName
                    // details.sponserName
                  }
                  className="text cancel"
                  name="sponsoreName"
                  required
                />
              </div>
              <div className="col-md-3 mb-1">
                <label>Over All Rating</label>
                {vendorData !== undefined ? (
                  <input
                    type="text"
                    onChange={handleChange}
                    id="overAllRating"
                    defaultValue={
                      details?.overAllRating == null
                        ? overAlldaata
                        : details?.overAllRating
                    }
                    className="text  disableField"
                    name="overAllRating"
                    style={{ cursor: "not-allowed" }}
                    required
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    onChange={handleChange}
                    id="overAllRating"
                    defaultValue={
                      details?.overAllRating == null
                        ? overAlldaata
                        : details?.overAllRating
                    }
                    className="text "
                    name="overAllRating"
                    required
                  />
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 mb-1">
                <label>
                  Next Review Date&nbsp;
                  <span className="required error-text">*</span>
                </label>
                {vendorData !== undefined ? (
                  <div
                    className="datepicker"
                    ref={(ele) => {
                      ref.current[9] = ele;
                    }}
                  >
                    <DatePicker
                      name="nextReviewDt"
                      selected={
                        details?.nextReviewDt === ""
                          ? null
                          : new Date(details?.nextReviewDt)
                      }
                      id="nextReviewDt"
                      className="err cancel nochange disableField"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dateFormat="dd-MMM-yyyy"
                      onChange={(e) => {
                        setDetails((prev) => ({
                          ...prev,
                          ["nextReviewDt"]: moment(e).format("yyyy-MM-DD"),
                        }));
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      autocomplete="false"
                      disabled
                    />
                  </div>
                ) : (
                  <div
                    className="datepicker"
                    ref={(ele) => {
                      ref.current[9] = ele;
                    }}
                  >
                    <DatePicker
                      name="nextReviewDt"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={
                        details.nextReviewDt === ""
                          ? null
                          : new Date(details.nextReviewDt)
                      }
                      id="nextReviewDt"
                      className="err cancel"
                      dateFormat="dd-MMM-yyyy"
                      onChange={(e) => {
                        setDetails((prev) => ({
                          ...prev,
                          ["nextReviewDt"]: moment(e).format("yyyy-MM-DD"),
                        }));
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      autocomplete="false"
                    />
                  </div>
                )}
              </div>
              <div className="col-md-3 mb-1">
                <label>
                  Contract Signed Date&nbsp;
                  <span className="required error-text">*</span>
                </label>
                {vendorData !== undefined ? (
                  <div
                    className="datepicker"
                    ref={(ele) => {
                      ref.current[10] = ele;
                    }}
                  >
                    <DatePicker
                      name="contractSignedDt"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={
                        details.contractSignedDt === ""
                          ? null
                          : new Date(details.contractSignedDt)
                      }
                      id="contractSignedDt"
                      className="err cancel nochange disableField"
                      dateFormat="dd-MMM-yyyy"
                      onChange={(e) => {
                        setDetails((prev) => ({
                          ...prev,
                          ["contractSignedDt"]: moment(e).format("yyyy-MM-DD"),
                        }));
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      style={{ cursor: "not-allowed" }}
                      disabled
                    />{" "}
                  </div>
                ) : (
                  <div
                    className="datepicker"
                    ref={(ele) => {
                      ref.current[10] = ele;
                    }}
                  >
                    <DatePicker
                      name="contractSignedDt"
                      selected={
                        details.contractSignedDt === ""
                          ? null
                          : new Date(details.contractSignedDt)
                      }
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      id="contractSignedDt"
                      className="err cancel"
                      dateFormat="dd-MMM-yyyy"
                      onChange={(e) => {
                        setDetails((prev) => ({
                          ...prev,
                          ["contractSignedDt"]: moment(e).format("yyyy-MM-DD"),
                        }));
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="col-md-3 mb-1">
                <label>
                  Contract Expires Date&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div
                  className="datepicker"
                  ref={(ele) => {
                    ref.current[11] = ele;
                  }}
                >
                  <DatePicker
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    name="contractExpireDt"
                    selected={
                      details.contractExpireDt === ""
                        ? ""
                        : new Date(details.contractExpireDt)
                    }
                    id="contractExpireDt"
                    className="err cancel"
                    dateFormat="dd-MMM-yyyy"
                    onChange={(e) => {
                      setDetails((prev) => ({
                        ...prev,
                        ["contractExpireDt"]: moment(e).format("yyyy-MM-DD"),
                      }));
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </div>
              </div>
              <div className="col-md-3 mb-1">
                <label>Contract Review Date</label>
                {/* <DatePicker
                  name="contractReviewDt"
                  id="contractReviewDt"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  selected={
                    details.contractReviewDt === ""
                      ? null
                      : new Date(details.contractReviewDt)
                  }
                  dateFormat="dd-MMM-yyyy"
                  className=" cancel"
                  onChange={(e) => {
                    setDetails((prev) => ({
                      ...prev,
                      ["contractReviewDt"]: moment(e).format("yyyy-MM-DD"),
                    }));
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                /> */}
                <DatePicker
                  name="contractReviewDt"
                  id="contractReviewDt"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  selected={
                    details.contractReviewDt
                      ? new Date(details.contractReviewDt)
                      : null
                  }
                  dateFormat="dd-MMM-yyyy"
                  className="cancel"
                  onChange={(e) => {
                    setDetails((prev) => ({
                      ...prev,
                      ["contractReviewDt"]: moment(e).format("yyyy-MM-DD"),
                    }));
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 mb-1">
                <label>Approval Date</label>
                {vendorData !== undefined ? (
                  <DatePicker
                    name="approvalDt"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    id="approvalDt"
                    selected={
                      details.approvalDt ? new Date(details.approvalDt) : null
                    }
                    dateFormat="dd-MMM-yyyy"
                    className=" cancel nochange disableField"
                    onChange={(e) => {
                      setDetails((prev) => ({
                        ...prev,
                        ["approvalDt"]: moment(e).format("yyyy-MM-DD"),
                      }));
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    style={{ cursor: "not-allowed" }}
                    disabled
                  />
                ) : (
                  <DatePicker
                    name="approvalDt"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    id="approvalDt"
                    selected={
                      details.approvalDt === ""
                        ? null
                        : new Date(details.approvalDt)
                    }
                    dateFormat="dd-MMM-yyyy"
                    className=" cancel"
                    onChange={(e) => {
                      setDetails((prev) => ({
                        ...prev,
                        ["approvalDt"]: moment(e).format("yyyy-MM-DD"),
                      }));
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                )}
              </div>
              <div className="col-md-3 mb-1">
                <label>
                  Website&nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[12] = ele;
                  }}
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    defaultValue={details.website}
                    className="err text cancel"
                    id="website"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.website)
                        event.preventDefault();
                    }}
                    name="website"
                    required
                  />
                </div>
              </div>
              <div className="col-md-3 mb-1">
                <label>Fax Number</label>
                <input
                  type="text"
                  id="fax"
                  onChange={handleChange}
                  defaultValue={details.fax == null ? "-" : details.fax}
                  className="text cancel"
                  name="fax"
                  required
                />
              </div>
              <div className="col-md-3 mb-1">
                <label>Mailing Address</label>
                {/* <input type="text-area" id="mailingAddress" onChange={handleChange} defaultValue={details.mailingAddress} className='area cancel' name="mailingAddress" required /> */}
                <div className="textfield">
                  <textarea
                    className="cancel"
                    onChange={handleChange}
                    name="mailingAddress"
                    id="mailingAddress"
                    placeholder=""
                    rows={2}
                    required
                    defaultValue={
                      details.mailingAddress == null
                        ? "-"
                        : details.mailingAddress
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 mb-1">
                <label>Description & Notes</label>
                {/* <input type="text-area" id="descriptionNote" onChange={handleChange} defaultValue={details.descriptionNote} className='area cancel' name="descriptionNote" required /> */}
                <textarea
                  className="cancel"
                  onChange={handleChange}
                  name="descriptionNote"
                  id="descriptionNote"
                  placeholder=""
                  rows={2}
                  required
                  defaultValue={
                    details.descriptionNote == null
                      ? "-"
                      : details.descriptionNote
                  }
                />
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  Conversion Eligibility&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div className="textfield"
                  ref={(ele) => {
                    ref.current[13] = ele;
                  }}>
                  <select
                    id="conversionEligibility"
                    name="conversionEligibility"
                    className="text cancel"
                    defaultValue="details.conversionEligibility"
                    onChange={handleChange}
                    required

                  >
                    <option value="" selected={details.conversionEligibility == "" && ""}>&lt;&lt;Please Select&gt;&gt;</option>
                    <option value="Yes" selected={details.conversionEligibility == "Yes" ? "Yes" : "No"}>Yes</option>
                    <option value="No" selected={details.conversionEligibility == "No" ? "No" : "Yes"}>No</option>
                  </select>
                </div>
              </div>
              {/* {console.log(details.conversion_eligibility, "details.conversion_eligibility")} */}
              {details.conversionEligibility === "Yes" && (
                <div className="col-md-3 mb-1">
                  <label>
                    Comments&nbsp;
                    <span className="required error-text">*</span>
                  </label>
                  <div className="textfield" ref={(ele) => ref.current[14] = ele}>
                    <textarea
                      id="comments"
                      name="comments"
                      className="text cancel"
                      onChange={handleChange}
                      value={details.comments}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ///////////////////////////////////Company Details///////////////////////////////////// */}
        <div className="form customCard">
          <h2>Company Details</h2>

          <div className="group-content">
            <div className="row">
              <div className="col-md-3 mb-1">
                <label>
                  Location&nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[15] = ele;
                  }}
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    defaultValue={details.location}
                    className="err text cancel"
                    id="location"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.location)
                        event.preventDefault();
                    }}
                    name="location"
                    required
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  Company Established Date&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div
                  className="datepicker"
                  ref={(ele) => {
                    ref.current[16] = ele;
                  }}
                >
                  <DatePicker
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    name="companyEstablishedDt"
                    className="err cancel"
                    selected={
                      details.companyEstablishedDt === ""
                        ? ""
                        : new Date(details.companyEstablishedDt)
                    }
                    dateFormat="dd-MMM-yyyy"
                    id="companyEstablishedDt"
                    onChange={(e) => {
                      setDetails((prev) => ({
                        ...prev,
                        ["companyEstablishedDt"]:
                          moment(e).format("yyyy-MM-DD"),
                      }));
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  Business Type&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div>
                  <select
                    id="businessId"
                    name="businessId"
                    onChange={handleChange}
                    //defaultValue="details.buisnessType"
                    className=" text cancel"
                    ref={(ele) => {
                      ref.current[17] = ele;
                    }}
                    required
                  >
                    <option
                      value=""
                      selected={
                        details.businessId == null || details.businessId == ""
                      }
                    >
                      &lt;&lt; Please Select &gt;&gt;
                    </option>
                    {business.map((Item) => (
                      <option
                        value={Item.id}
                        selected={Item.id == details.businessId ? true : false}
                      >
                        {" "}
                        {Item.lkup_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  Is Insured&nbsp;<span className="required error-text">*</span>
                </label>
                <div>
                  <select
                    id="isInsured"
                    name="isInsured"
                    onChange={handleChange}
                    defaultValue="details.isInsured"
                    className=" text cancel"
                    ref={(ele) => {
                      ref.current[18] = ele;
                    }}
                    required
                  >
                    <option value="">&lt;&lt; Please Select &gt;&gt;</option>
                    <option
                      value="0"
                      selected={details.isInsured == false ? "0" : "1"}
                    >
                      No
                    </option>
                    <option
                      value="1"
                      selected={details.isInsured == true ? "1" : "0"}
                    >
                      Yes
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3 mb-1">
                <label>
                  Is Licensed&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div>
                  <select
                    id="isLicensed"
                    name="isLicensed"
                    onChange={handleChange}
                    defaultValue="details.isLicensed"
                    className=" text cancel"
                    ref={(ele) => {
                      ref.current[19] = ele;
                    }}
                    required
                  >
                    <option value="">&lt;&lt; Please Select &gt;&gt;</option>
                    <option
                      value="1"
                      selected={details.isLicensed == true ? "1" : "0"}
                    >
                      Yes
                    </option>
                    <option
                      value="0"
                      selected={details.isLicensed == false ? "0" : "1"}
                    >
                      No
                    </option>
                  </select>
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  GST NO&nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[20] = ele;
                  }}
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    defaultValue={details.gstNum == null ? "-" : details.gstNum}
                    className="text cancel"
                    name="gstNum"
                    id="gstNum"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.gstNum)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  License No&nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[21] = ele;
                  }}
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    defaultValue={details.licenseNum}
                    className="err text cancel"
                    id="licenseNum"
                    name="licenseNum"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.licenseNum)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>Services/Goods Details</label>
                {/* <input type="text-area" onChange={handleChange} defaultValue={details.serviceDtls} className='area cancel' id="serviceDtls" name="serviceDtls" required /> */}
                <textarea
                  className=" cancel"
                  id="serviceDtls"
                  name="serviceDtls"
                  placeholder=""
                  rows={2}
                  required
                  onChange={handleChange}
                  value={
                    details.serviceDtls == null ? "-" : details.serviceDtls
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* ///////////////////////////////////Bank Details///////////////////////////////////// */}
        <div className="form customCard">
          <h2>Bank Details</h2>

          <div className="group-content">
            <div className="row">
              <div className="col-md-3 mb-1">
                <label>
                  Bank Name&nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[22] = ele;
                  }}
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    defaultValue={details.bankName}
                    className="err text cancel"
                    id="bankName"
                    name="bankName"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.bankName)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  Benefeciary Name&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[23] = ele;
                  }}
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    defaultValue={details.beneficiaryName}
                    className="err text cancel"
                    id="beneficiaryName"
                    name="beneficiaryName"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.beneficiaryName)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  Account Number&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[24] = ele;
                  }}
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    defaultValue={details.accountNumber}
                    className="err text cancel"
                    id="accountNumber"
                    name="accountNumber"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.accountNumber)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1">
                <label>
                  IFSC Code&nbsp;<span className="required error-text">*</span>
                </label>
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[25] = ele;
                  }}
                >
                  <input
                    type="text"
                    onChange={handleChange}
                    defaultValue={details.ifscCode}
                    className="err text cancel"
                    id="ifscCode"
                    name="ifscCode"
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.ifscCode)
                        event.preventDefault();
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-3 mb-1">
                <label>
                  Bank Address&nbsp;
                  <span className="required error-text">*</span>
                </label>
                {/* <input type="text-area" onChange={handleChange} defaultValue={details.bankAddress} className='err area cancel' id="bankAddress"
                 name="bankAddress" required /> */}
                <div
                  className="textfield"
                  ref={(ele) => {
                    ref.current[26] = ele;
                  }}
                >
                  <textarea
                    className=" cancel"
                    id="bankAddress"
                    onChange={handleChange}
                    placeholder=""
                    rows={2}
                    name="bankAddress"
                    required
                    defaultValue={details.bankAddress}
                    onKeyDown={(event) => {
                      if (event.code == "Space" && !details.bankAddress)
                        event.preventDefault();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ///////////////////////////////////Documents///////////////////////////////////// */}
        <div className="form customCard">
          <h2>Documents</h2>
          <label style={{ marginLeft: "10px" }}>
            Upload Documents&nbsp;
            {/* <span className="required error-text">*</span> */}
          </label>
          <div className="group-content">
            <div className="row">
              <div className="form col-md-12">
                <input
                  style={{ outline: "1px solid #cdcdcd" }}
                  type="file"
                  accept=".jpg,.jpeg,.xlsx,.pdf,.docx,.txt"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                  }}
                />
                <label className="documenttypes">
                  <p className="error-text">
                    Supported types jpg,jpeg,xlsx,docx,txt,pdf & Max file size
                    is 10MB
                  </p>
                </label>
                {/* <Document /> */}
              </div>
            </div>
          </div>
        </div>
        {/* ///////////////////////////////////Save & Cancel///////////////////////////////////// */}
        <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-1">
          <button
            className="btn btn-primary"
            type="submit"
            onClick={() => {
              handleSubmit();
            }}
          >
            <VscSave />
            Save
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
        {loader ? <Loader /> : ""}
        {/* ////////////////////////////////////////End////////////////////////////////////////// */}
      </div>
    </div>
  );
}

export default VendorCreate;
