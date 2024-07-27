import React, { useState, useEffect, useRef } from "react";
// import VendorOpen from "../VendorComponent/VendorOpen";
import ProjectCreate from "./ProjectCreate";
import ProjectSearch from "./ProjectSearch";
import ProjectReviews from "./ProjectReviews";
import AutoComplete from "../VendorComponent/VendorOpenAuto";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { GoGraph, GoThreeBars } from "react-icons/go";
import { Link } from "react-router-dom";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { environment } from "../../environments/environment";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
// import './Parent.scss';
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
} from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";

function InitialParentProject() {
  const [btnState, setbtnState] = useState("Open");
  const [buttonValue, setButtonValue] = useState("Project");
  // const [btnState, setbtnState] = useState(() => {
  //   // Retrieve the last selected tab from localStorage on component mount
  const [tabButtons, setTabButtons] = useState([]);
  const [urlState, setUrlState] = useState("");

  const [permission, setPermission] = useState([]);

  const initialValues = {
    vendor_name: "",
    id: "",
  };

  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);

  let container = document.createElement("div");

  //   return localStorage.getItem("selectedIntialParentProjectTab") || "Open";
  const [access, setAccess] = useState([]);
  const [data, setData] = useState([]);
  const [projectTableData, setProjectTableData] = useState([]);
  const baseUrl = environment.baseUrl;
  const [vendorListData, setVendorListData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [customerTableData, setCustomerTableData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [engagementTableData, setEngagementTableData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [expenseTableData, setExpenseTableData] = useState([]);
  const [accessLevel, setAccessLevel] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const [state, setState] = useState({
    userId: "",
    ObjectTypeId: "",
    ObjectId: "",
    VisitedOn: "",
  });
  const [vendorId, setVendorId] = useState(-1);
  const [projectId, setProjectId] = useState(-1);
  const [engagementId, setEngagementId] = useState(-1);
  const [customerId, setCustomerId] = useState(-1);
  const [expenseId, setExpenseId] = useState(-1);
  const [validationmessage, setValidationMessage] = useState(false);
  const [latestData, setLatestData] = useState([]);
  const [routes, setRoutes] = useState([]);
  let textContent1 = "Time & Expenses";
  let currentScreenName1 = ["Expenses", "Expense Search History"];
  let textContent2 = "Customers";
  let currentScreenName2 = ["Customers", "Customer Search History"];
  let textContent3 = "Delivery";
  let currentScreenName3 = ["Projects", "Project Search History"];
  let textContent4 = "Delivery";
  let currentScreenName4 = ["Engagements", "Engagement Search History"];
  let textContent5 = "Vendors";
  let currentScreenName5 = ["Vendor Search History"];
  const lastDataId = latestData[latestData.length - 1]?.id;
  console.log(lastDataId, ".........");
  const [accessLatest, setAccessLatest] = useState([]);
  const [autoCompleteValidation, setAutoCompleteValidation] = useState("");
  const [searching, setsearching] = useState(false);
  const abortController = useRef(null);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Project Open"];

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  useEffect(() => {}, [
    vendorListData,
    projectData,
    engagementData,
    expenseData,
  ]);
  console.log(filteredData);
  useEffect(() => {}, [autoCompleteData]);
  useEffect(() => {}, [state]);
  useEffect(() => {}, [
    vendorId,
    projectId,
    engagementId,
    customerId,
    expenseId,
    lastDataId,
  ]);
  console.log(validationmessage);
  useEffect(() => {
    // getLatestApis();
    // getAccess();
  }, []);

  useEffect(() => {
    if (btnState === "Search") {
      setVisible(false);
      setCheveronIcon(FaChevronCircleUp);
    }
  }, [btnState]);

  useEffect(() => {
    if (btnState === "Reviews") {
      setVisible(false);
      setCheveronIcon(FaChevronCircleUp);
    }
  }, [btnState]);

  const fetchdata = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/VendorMS/vendor/getVendorList?userid=${loggedUserId}&objecttypeid=15`,
    })
      .then(function (response) {
        var response = response.data;
        setData(response);
        setVendorDataList(response);
      })
      .catch(function (response) {});
  };

  const getdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/VendorMS/vendor/getVendorsNameandId`,
    })
      .then(function (response) {
        var resp = response.data;
        setVendorListData(resp);
      })
      .catch(function (response) {});
  };

  const handleSelect = (vendorId) => {
    let data = document.getElementsByClassName("err");
    if (vendorId == null) {
      if (autoCompleteData.id == null) {
        setAutoCompleteValidation("1px solid rgb(183 1 1) !important");
        setValidationMessage(true);
        return;
      } else {
        setValidationMessage(false);
      }
      {
        <Link
          title="Search"
          to={`/vendor/vendorDoc/:${autoCompleteData.id}`}
          target="_blank"
        ></Link>;
      }
      console.log(autoCompleteData.id);
      axios({
        method: "post",
        url: baseUrl + `/VendorMS/vendor/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: autoCompleteData.id,
        },
        headers: { "Content-Type": "application/json" },
      }).then((success) => {
        console.log(success);
      });
    } else {
      console.log(vendorId);

      axios({
        method: "post",
        url: baseUrl + `/VendorMS/vendor/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: vendorId,
        },
        // headers: { "Content-Type": "application/json" },
      }).then((success) => {
        console.log(success);
      });
    }
  };

  //----------------breadcrumbs--------------
  console.log(autoCompleteData.id);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const getData1 = resp.data;
      const deliveryItem = getData1[7]; // Assuming "Delivery" item is at index 7

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
        if (item.display_name === textContent1 && buttonValue == "Expense") {
          setRoutes([item]);
        } else if (
          item.display_name === textContent2 &&
          buttonValue == "Customer"
        ) {
          setRoutes([item]);
        } else if (
          item.display_name === textContent3 &&
          buttonValue == "Project"
        ) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        } else if (
          item.display_name === textContent4 &&
          buttonValue == "Engagement"
        ) {
          setRoutes([item]);
        } else if (
          item.display_name === textContent5 &&
          buttonValue == "Vendor"
        ) {
          setRoutes([item]);
        }
      });
    });
  };
  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);
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
  /// Project open api calls
  ////Project table data

  useEffect(() => {
    switch (buttonValue) {
      case "Project":
        getProjectTableData();
        getProjectdata();
        break;
      case "Engagement":
        getEngagementTableData();
        getEngagementData();
        break;
      case "Vendor":
        fetchdata();
        getdata();
        break;
      case "Customer":
        getCustomerTableData();
        getCustomerdata();
        break;
      case "Expense":
        getExpenseTableData();
        getExpenseData();
      default:
        break;
    }
  }, [buttonValue]);

  ///customer open api calls
  const getCustomerTableData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/customersms/Customers/getCustomerList?userid=${loggedUserId}&objecttypeid=2`,
    })
      .then((res) => {
        setCustomerTableData(res.data);
      })
      .then((error) => {
        console.log("success", error);
      });
  };
  // const getLatestApis = () => {
  //   axios({
  //     method: "get",
  //     url:
  //       baseUrl +
  //       `/ProjectMS/project/getLatestProjects?loggedUserId=${loggedUserId}`,
  //   })
  //     .then((res) => {
  //       setLatestData(res.data);
  //     })
  //     .then((error) => {
  //       console.log("success", error);
  //     });
  // };

  const getAccess = (objId) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/project/getProjectAccess?objId=${objId}&loggedUserId=${loggedUserId}`,
    })
      .then((response) => {
        const resp = response.data;
        // resp.push({ id: "-1", name: "<<ALL>>" });
        setAccessLatest(resp);
      })
      .catch((error) => {});
  };

  const getCustomerdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customers/getCustomers`,
    }).then(function (response) {
      var resp = response.data;
      setCustomerData(resp);
    });
  };

  const handleCustomerSelect = (vendorId) => {
    console.log("customer select");
    if (vendorId == null) {
      let data = document.getElementsByClassName("err");
      if (autoCompleteData.id == null) {
        setAutoCompleteValidation("1px solid rgb(183 1 1) !important");
        setValidationMessage(true);
        return;
      } else {
        setValidationMessage(false);
      }
      <Link
        title="Search"
        to={`customer/dashboard/:${autoCompleteData.id}`}
        target="_blank"
      ></Link>;
      axios({
        method: "post",
        url: baseUrl + `/customersms/Customers/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: autoCompleteData.id,
        },
        headers: { "Content-Type": "application/json" },
      }).then((success) => {});
    } else {
      axios({
        method: "post",
        url: baseUrl + `/customersms/Customers/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: vendorId,
        },
        headers: { "Content-Type": "application/json" },
      }).then((success) => {});
    }
  };
  //// customers - end

  const getProjectTableData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        // `/ProjectMS/Audit/getProjectList?userid=${loggedUserId}&objecttypeid=3`,
        `/ProjectMS/Audit/getProjectList?userid=${loggedUserId}&objecttypeid=3`,
    })
      .then((res) => {
        setProjectTableData(res.data);
      })
      .then((error) => {
        console.log("success", error);
      });
  };
  ////

  ////Project data
  const getProjectdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectNameandId`,
    }).then(function (response) {
      var resp = response.data;
      setProjectData(resp);
    });
  };

  ///project search history
  const handleProjectSelect = (vendorId) => {
    let data = document.getElementsByClassName("err");
    if (vendorId == null) {
      if (autoCompleteData.id == null) {
        setAutoCompleteValidation("1px solid rgb(183 1 1) !important");
        setValidationMessage(true);
        return;
      } else {
        setValidationMessage(false);
      }
      <Link
        title="Search"
        to={`/project/Overview/:${autoCompleteData.id}`}
        target="_blank"
      ></Link>;
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/Audit/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: autoCompleteData.id,
        },
        headers: { "Content-Type": "application/json" },
      }).then((success) => {});
    } else {
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/Audit/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: vendorId,
        },
        // headers: { "Content-Type": "application/json" },
      }).then((success) => {});
    }
  };

  // localStorage.setItem(
  //   "breadCrumbs",
  //   JSON.stringify({ routes: routes, currentScreenName: currentScreenName3 })
  // );

  // ------EngagementOpen-------------------------------------
  // const [data1, setData1] = useState([]);

  const getEngagementTableData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Engagement/getEngagementList?userid=${loggedUserId}&objecttypeid=14`,
    })
      .then(function (response) {
        var response = response.data;
        setEngagementTableData(response);
      })
      .catch(function (response) {});
  };

  const getEngagementData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getEngagementNameandId`,
    })
      .then(function (response) {
        var resp = response.data;
        setEngagementData(resp);
        console.log(engagementData);
      })
      .catch(function (response) {});
  };

  const handleEngagementSelect = (vendorId) => {
    let data = document.getElementsByClassName("err");
    if (vendorId == null) {
      if (autoCompleteData.id == null) {
        setAutoCompleteValidation("1px solid rgb(183 1 1) !important");
        setValidationMessage(true);
        return;
      } else {
        setValidationMessage(false);
      }
      {
        <Link
          title="Search"
          to={`/engagement/Dashboard/:${autoCompleteData.id}`}
          target="_blank"
        ></Link>;
      }
      console.log(autoCompleteData.id);
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/Engagement/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: autoCompleteData.id,
        },
        headers: { "Content-Type": "application/json" },
      }).then((success) => {
        console.log(success);
      });
    } else {
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/Engagement/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: vendorId,
        },
        // headers: { "Content-Type": "application/json" },
      }).then((success) => {
        console.log(success);
      });
    }
  };
  // ---------------Expense-------------------------------

  const getExpenseTableData = () => {
    setsearching(false);
    abortController.current = new AbortController();

    axios({
      method: "get",
      url:
        baseUrl +
        `/timeandexpensesms/ExpenseOpen/gettabledata?userid=${loggedUserId}`,
      signal: abortController.current.signal,

      // `http://localhost:8090/timeandexpensesms/ExpenseOpen/gettabledata?userid=${loggedUserId}`,
    })
      .then(function (response) {
        var response = response.data;
        setExpenseTableData(response);
        setTimeout(() => {
          setsearching(false);
        }, 3000);
      })
      .catch(function (response) {});
  };

  const getExpenseData = () => {
    axios({
      method: "get",
      url: baseUrl + `/timeandexpensesms/ExpenseOpen/getSearchdata`,
      // `http://localhost:8090/timeandexpensesms/ExpenseOpen/getSearchdata`,
    })
      .then(function (response) {
        var resp = response.data;
        resp.push({ id: "-1", name: "<<ALL>>" });
        setExpenseData(resp);
      })
      .catch(function (response) {});
  };

  const handleExpenseSelect = (vendorId) => {
    let data = document.getElementsByClassName("err");
    if (vendorId == null) {
      if (autoCompleteData.id == null) {
        setAutoCompleteValidation("1px solid rgb(183 1 1) !important");
        setValidationMessage(true);
        return;
      } else {
        setValidationMessage(false);
      }
      {
        <Link
          title="Search"
          to={`/engagement/Dashboard/:${autoCompleteData.id}`}
          target="_blank"
        ></Link>;
      }
      console.log(autoCompleteData.id);
      axios({
        method: "post",
        url: baseUrl + `/timeandexpensesms/ExpenseOpen/updateUserSearchHistory`,
        // `http://localhost:8090/timeandexpensesms/ExpenseOpen/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: autoCompleteData.id,
        },
        headers: { "Content-Type": "application/json" },
      }).then((success) => {
        console.log(success);
      });
    } else {
      axios({
        method: "post",
        url: baseUrl + `/timeandexpensesms/ExpenseOpen/updateUserSearchHistory`,
        // `http://localhost:8090/timeandexpensesms/ExpenseOpen/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: vendorId,
        },
        // headers: { "Content-Type": "application/json" },
      }).then((success) => {
        console.log(success);
      });
    }
  };
  console.log(access.length);
  const handleSearchButtonClick = () => {
    // Set accessLevel to true immediately
    setAccessLevel(true);

    // Set accessLevel to false after 1000 milliseconds (1 second)
    setTimeout(() => {
      setAccessLevel(false);
    }, 1000);
  };
  // -------------------------------------------
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  let HelpPDFName;
  let Headername;
  const SearchHelpPDFName = "SearchProject.pdf";
  const SearchHeadername = "Project Search Help";
  const CreateHelpPDFName = "CreateProjects.pdf";
  const CreateHeadername = "Project Create";
  const ReviewsHelpPDFName = "ReviewProject.pdf";
  const ReviewsHeadername = "Project Review Help";

  if (buttonValue === "Project") {
    HelpPDFName = "OpenProject.pdf";
    Headername = "Project Open Help";
  } else if (buttonValue === "Engagement") {
    HelpPDFName = "Eng.pdf";
    Headername = "Engagement Open Help";
  } else if (buttonValue === "Customer") {
    HelpPDFName = "OpenCustomer.pdf";
    Headername = "Customer Open Help";
  } else if (buttonValue === "Expense") {
    HelpPDFName = "expense.pdf";
    Headername = "Expense Open Help";
  } else {
    buttonValue == "Vendor";
    HelpPDFName = "OpenVMG.pdf";
    Headername = "Vendor Open Help";
  }
  console.log(validationmessage);

  const menus = () => {
    axios({
      method: "GET",

      url:
        baseUrl +
        `/CommonMS/master/getBenchMtericsMenus?loggedUserId=${loggedUserId}&Cont=project`,
    }).then((res) => {
      const data = res.data;
      console.log(data);
      const filteredObjects = data;
      setPermission(filteredObjects);
      console.log(data);
    });
  };

  useEffect(() => {
    menus();
  }, []);

  const renderDisplayNames = (permission) => {
    return (
      <div>
        {permission.map((item) => (
          <div key={item.id}>{item.display_name}</div>
        ))}
      </div>
    );
  };

  const initialData = permission;

  const [data1, setData1] = useState(initialData);
  const [showDisplayNames, setShowDisplayNames] = useState(false);
  const toggleDisplayNames = () => {
    setShowDisplayNames((prevState) => !prevState);
  };
  console.log(permission);
  console.log(btnState);
  const getUrlPath1 = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${baseUrl}/CommonMS/security/authorize?url=/search/userHistory&userId=${loggedUserId}`,
      });
      console.log(response, "urlResponse");
    } catch (error) {
      console.error(error);
    }
  };

  const getUrlPathEngOpen = async () => {
    try {
      const response = await axios({
        method: "get",
        url: `${baseUrl}/CommonMS/security/authorize?url=/search/userEngagementHistory&userId=${loggedUserId}`,
      });
      console.log(response, "urlResponse");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (btnState === "Open" && projectTableData) {
      getUrlPath1();
    } else if (buttonValue === "Engagement" && engagementTableData) {
      getUrlPathEngOpen();
    }
  }, [btnState, buttonValue]);
  console.log(engagementTableData);
  return (
    <div>
      {/* <div className="pageTitle"> */}
      <div className="tabsProject">
        {btnState == "Open" ? (
          <div className="col-md-12">
            <div className="pageTitle">
              <div className="childOne">
                {permission.map((button) => (
                  <button
                    key={button.id}
                    className={
                      btnState === button.display_name.toString()
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name.toString());
                      console.log(button.display_name);
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {button.display_name}
                  </button>
                ))}
              </div>
              <div className="childTwo">
                <h2> {`${buttonValue} Search History`}</h2>
              </div>
              <div className="childThree toggleBtns">
                <GlobalHelp pdfname={HelpPDFName} name={Headername} />
              </div>
            </div>
          </div>
        ) : btnState == "Search" ? (
          <div className="col-md-12">
            <div className="pageTitle">
              <div className="childOne">
                {permission.map((button) => (
                  <button
                    key={button.id}
                    className={
                      btnState === button.display_name.toString()
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name.toString());
                      console.log(button.display_name);
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {button.display_name}
                  </button>
                ))}
              </div>
              <div className="childTwo ">
                <h2>Project Search</h2>
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

                <GlobalHelp
                  pdfname={SearchHelpPDFName}
                  name={SearchHeadername}
                />
              </div>
            </div>
          </div>
        ) : btnState == "Reviews" ? (
          <div className="col-md-12">
            <div className="pageTitle">
              <div className="childOne">
                {/* <h2>Project Reviews</h2> */}
                {permission.map((button) => (
                  <button
                    key={button.id}
                    className={
                      btnState === button.display_name.toString()
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name.toString());
                      console.log(button.display_name);
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {button.display_name}
                  </button>
                ))}
              </div>
              <div className="childTwo">
                <h2>Project Reviews</h2>
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

                <GlobalHelp
                  pdfname={ReviewsHelpPDFName}
                  name={ReviewsHeadername}
                />
              </div>
            </div>
          </div>
        ) : btnState == "Create" ? (
          <div className="col-md-12">
            <div className="pageTitle">
              <div className="childOne">
                {/* <h2>Create Project</h2> */}
                {permission.map((button) => (
                  <button
                    key={button.id}
                    className={
                      btnState === button.display_name.toString()
                        ? "buttonDisplayClick"
                        : "buttonDisplay"
                    }
                    onClick={() => {
                      setbtnState(button.display_name.toString());
                      console.log(button.display_name);
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {button.display_name}
                  </button>
                ))}
              </div>
              <div className="childTwo">
                <h2>Create Project</h2>
              </div>
              <div className="childThree toggleBtns">
                <GlobalHelp
                  pdfname={CreateHelpPDFName}
                  name={CreateHeadername}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* </div> */}
      {btnState === "Open" && (
        <div>
          {/* {buttonValue == "Expense" ? (
            <ScreenBreadcrumbs
              routes={routes}
              currentScreenName={currentScreenName1}
            />
          ) : buttonValue == "Project" ? (
            <ScreenBreadcrumbs
              routes={routes}
              currentScreenName={currentScreenName3}
            />
          ) : buttonValue == "Customer" ? (
            <ScreenBreadcrumbs
              routes={routes}
              currentScreenName={currentScreenName2}
            />
          ) : buttonValue == "Vendor" ? (
            <ScreenBreadcrumbs
              routes={routes}
              currentScreenName={currentScreenName5}
            />
          ) : buttonValue == "Engagement" ? (
            <ScreenBreadcrumbs
              routes={routes}
              currentScreenName={currentScreenName4}
            />
          ) : (
            ""
          )} */}
          {/* {buttonValue == "Project" && ( */}

          <div className="body body-bg col-xs-12 col-sm-12 col-md-12 col-lg-12 customCard">
            <div className="form-group cvu darkHeader">
              <div className="col-6 my-2 no-padding">
                {/* {console.log(projectTableData)} */}
                {projectTableData.length > 0 ||
                customerTableData.length > 0 ||
                engagementTableData.length > 0 ||
                data.length > 0 ||
                expenseTableData.length > 0 ? (
                  <table
                    id="details"
                    className="col-12 table table-bordered  openTable " /////customerEngament
                  >
                    <thead>
                      <tr>
                        {buttonValue == "Expense" ? (
                          <th
                            colSpan={4}
                            className="tableheading"
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <h6
                              className="text-center m-0"
                              style={{ color: "#187fde", fontSize: "15px" }}
                            >
                              {`Recent ${buttonValue} Searches`}
                            </h6>
                          </th>
                        ) : (
                          <th
                            colSpan={2}
                            className="tableheading"
                            style={{ backgroundColor: "#eeeeee" }}
                          >
                            <h6
                              className="text-center m-0"
                              style={{ color: "#187fde", fontSize: "15px" }}
                            >
                              {`Recent ${buttonValue} Searches`}
                            </h6>
                          </th>
                        )}
                      </tr>
                      {buttonValue == "Expense" ? (
                        <tr>
                          <th>
                            <h6
                              className="text-center m-0"
                              style={{ fontSize: "13px" }}
                            >
                              <b>Expense</b>
                            </h6>
                          </th>
                          <th>
                            <h6
                              className="text-center m-0"
                              style={{ fontSize: "13px" }}
                            >
                              <b>Created By</b>
                            </h6>
                          </th>
                          <th>
                            <h6
                              className="text-center m-0"
                              style={{ fontSize: "13px" }}
                            >
                              <b>Net Amount</b>
                            </h6>
                          </th>
                          <th>
                            <h6
                              className="text-center m-0"
                              style={{ fontSize: "13px" }}
                            >
                              <b>Status</b>
                            </h6>
                          </th>
                        </tr>
                      ) : (
                        <tr>
                          <th style={{ backgroundColor: "#eeeeee" }}>
                            <h6
                              className="text-center m-0"
                              style={{ fontSize: "13px" }}
                            >
                              {buttonValue}
                            </h6>
                          </th>
                          <th style={{ backgroundColor: "#eeeeee" }}>
                            <h6
                              className="text-center m-0"
                              style={{ fontSize: "13px" }}
                            >
                              Actions
                            </h6>
                          </th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {buttonValue == "Project" ? (
                        <>
                          {projectTableData.map((list) => (
                            <tr>
                              <td value={list.id}>
                                <span
                                  onClick={() => {
                                    handleProjectSelect(list.id);
                                  }}
                                >
                                  <Link
                                    data-toggle="tooltip"
                                    title="Go To Project Overview"
                                    to={`/project/Overview/:${list.id}`}
                                    target="_blank"
                                  >
                                    {list.project_name}
                                  </Link>
                                </span>
                              </td>
                              <td>
                                <center>
                                  <span
                                    onClick={() => {
                                      handleProjectSelect(list.id);
                                      setValidationMessage(false);
                                    }}
                                  >
                                    <Link
                                      data-toggle="tooltip"
                                      title="View Capacity Plan"
                                      to={`/project/capacityPlan/:${list.id}`}
                                      target="_blank"
                                    >
                                      <GoGraph />
                                    </Link>
                                  </span>
                                  &nbsp;&nbsp;
                                  <span
                                    onClick={() => {
                                      handleProjectSelect(list.id);
                                      setValidationMessage(false);
                                    }}
                                  >
                                    <Link
                                      data-toggle="tooltip"
                                      title="View Task Plan"
                                      to={`/project/taskPlan/:${list.id}`}
                                      target="_blank"
                                    >
                                      <GoThreeBars />
                                    </Link>
                                  </span>
                                </center>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <>
                          {data.map((data) => (
                            <tr>
                              <td value={data.id}>
                                <span
                                  onClick={() => {
                                    handleSelect(data.id);
                                    setValidationMessage(false);
                                  }}
                                >
                                  <Link
                                    data-toggle="tooltip"
                                    title="Go to VMG Dashboard"
                                    to={`/vendor/vendorDoc/:${data.id}`}
                                    target="_blank"
                                  >
                                    {" "}
                                    {data.vendor_name}
                                  </Link>
                                </span>
                              </td>
                              <td align="center">
                                <span
                                  onClick={() => {
                                    handleSelect(data.id);
                                    setValidationMessage(false);
                                  }}
                                >
                                  <Link
                                    to={`/vendor/reviews/:${data.id}`}
                                    target="_blank"
                                  >
                                    {"View Reviews"}
                                  </Link>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}

                      {/* -----------------------------------engagement open */}

                      {buttonValue == "Engagement" ? (
                        <>
                          {engagementTableData.map((list) => (
                            <tr>
                              <td value={list.id}>
                                <span
                                  onClick={() => {
                                    handleEngagementSelect(list.id);
                                    setValidationMessage(false);
                                  }}
                                >
                                  <Link
                                    // className="hover-underline-animation"
                                    data-toggle="tooltip"
                                    title="Go To Engagement Overview"
                                    to={`/engagement/Dashboard/:${list.id}`}
                                    target="_blank"
                                  >
                                    {list.name}
                                  </Link>
                                </span>
                              </td>
                              <td align="center">
                                <span
                                  onClick={() => {
                                    handleEngagementSelect(list.id);
                                    setValidationMessage(false);
                                  }}
                                />
                                <Link
                                  data-toggle="tooltip"
                                  title="Go to Engagement Overview"
                                  to={`/engagement/Dashboard/:${list.id}`}
                                  target="_blank"
                                >
                                  {" "}
                                  {data.name}
                                </Link>
                                <span
                                  onClick={() => {
                                    handleEngagementSelect(list.id);
                                    setValidationMessage(false);
                                  }}
                                >
                                  <Link
                                    // className="hover-underline-animation"
                                    to={`/engagement/projects/:${list.id}`}
                                    target="_blank"
                                  >
                                    {"View Projects"}
                                  </Link>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <>
                          {customerTableData.map((data) => (
                            <tr>
                              <td value={data.id}>
                                <span
                                  onClick={() => {
                                    handleCustomerSelect(data.id);
                                    setValidationMessage(false);
                                    localStorage.setItem(
                                      "customerButtonState",
                                      "Dashboard"
                                    );
                                  }}
                                >
                                  <Link
                                    data-toggle="tooltip"
                                    title="Go to Customer Dashboard"
                                    to={`customer/dashboard/:${data.id}`}
                                    target="_blank"
                                  >
                                    {" "}
                                    {data.full_name}
                                  </Link>
                                </span>
                              </td>
                              <td align="center">
                                <span
                                  onClick={() => {
                                    handleSelect(data.id);
                                    setValidationMessage(false);
                                  }}
                                >
                                  <Link
                                    to={`/customer/engagement/:${data.id}`}
                                    target="_blank"
                                  >
                                    {"View Engagements"}
                                  </Link>
                                </span>
                              </td>
                            </tr>
                          ))}
                        </>
                      )}
                      {buttonValue == "Expense" ? (
                        <>
                          {console.log(expenseTableData)}
                          {expenseTableData.map((list) => (
                            <tr>
                              <td value={list.id}>
                                <span
                                  onClick={() => {
                                    handleExpenseSelect(list.id);
                                    setValidationMessage(false);
                                  }}
                                >
                                  <Link
                                    data-toggle="tooltip"
                                    title="Go To Expense Stack"
                                    to={`/expense/Create/${list.id}`}
                                    target="_blank"
                                  >
                                    {list.Expense}
                                  </Link>
                                </span>
                              </td>
                              <td>
                                <span>{list.createdBy}</span>
                              </td>
                              <td align="right">
                                <span>
                                  {list.Currency == "&#8377"
                                    ? "? "
                                    : list.Currency == "&#36"
                                    ? "$ "
                                    : list.Currency == "&#163"
                                    ? "£ "
                                    : list.Currency == "&#128"
                                    ? "€ "
                                    : list.Currency == "C&#36"
                                    ? "C$ "
                                    : list.Currency == "&#107;&#110;"
                                    ? "kn "
                                    : list.Currency == "Bds&#36"
                                    ? "Bds$ "
                                    : list.Currency == "Jordan"
                                    ? "Jordan "
                                    : list.Currency == "ASUD"
                                    ? "ASUD "
                                    : ""}
                                  {list.NetAmount == "null" ? (
                                    " "
                                  ) : list.Currency == "&#1583;.&#1573;" ? (
                                    <>
                                      {parseFloat(list.NetAmount).toFixed(2)}
                                      {" ?.? "}
                                    </>
                                  ) : (
                                    parseFloat(list.NetAmount).toFixed(2)
                                  )}
                                </span>
                              </td>
                              <td>
                                <span>{list.Status}</span>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        ""
                      )}
                      {/* ---------------------------------- */}
                    </tbody>
                  </table>
                ) : (
                  ""
                )}

                <div className="body col-xs-12 col-sm-12 col-md-12 col-lg-12  mt-3  no-padding">
                  {validationmessage ? (
                    <div className="statusMsg error col-12 mb-2">
                      <span>
                        <IoWarningOutline />
                        &nbsp;{`Please select any ${buttonValue}`}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* {accessLevel ? (
                <div className="statusMsg error col-12 mb-2">
                  <span>
                    <IoWarningOutline />
                    &nbsp;{`Not authorized to any ${buttonValue}`}
                  </span>
                </div>
              ) : (
                ""
              )} */}
                  {autoCompleteData.id == undefined && accessLevel == true ? (
                    <div className="statusMsg error col-12 mb-2">
                      <span>
                        <IoWarningOutline />
                        &nbsp;{`Please select any ${buttonValue} `}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className=" group-content  err">
                    {/* <div className="col-4 "> */}
                    <div className="row ">
                      {/* <div className="col-2 p-0"></div> */}
                      <div
                        className={
                          buttonValue == "Expense" ? "col-3 h6" : "col-2 h6"
                        }
                        style={{ fontSize: "13px" }}
                      >
                        {buttonValue == "Expense"
                          ? "Expense Stack"
                          : buttonValue}
                        {buttonValue == "Expense" ? (
                          <span className="required error-text ml-1">* </span>
                        ) : (
                          ""
                        )}
                        :
                      </div>
                      <div
                        className="col-6 autoComplete-container"
                        id="autoComplete"
                        style={{ fontSize: "12px" }}
                      >
                        <AutoComplete
                          vendorListData={vendorListData}
                          setAutoCompleteData={setAutoCompleteData}
                          handleSelect={handleSelect}
                          buttonValue={buttonValue}
                          projectData={projectData}
                          setAccess={setAccess}
                          customerData={customerData}
                          filteredData={filteredData}
                          setFilteredData={setFilteredData}
                          autoCompleteValidation={autoCompleteValidation}
                          handleEngagementSelect={handleEngagementSelect}
                          engagementData={engagementData}
                          expenseData={expenseData}
                          handleExpenseSelect={handleExpenseSelect}
                        />
                      </div>

                      <div className="err col-2">
                        {access.length > 0 ? (
                          <Link
                            title="Search"
                            to={
                              buttonValue == "Project"
                                ? `/project/Overview/:${autoCompleteData.id}`
                                : buttonValue == "Engagement"
                                ? `/engagement/Dashboard/:${autoCompleteData.id}`
                                : buttonValue == "Customer"
                                ? `customer/dashboard/:${autoCompleteData.id}`
                                : buttonValue == "Expense"
                                ? `/expense/Create/${autoCompleteData.id}`
                                : `/vendor/vendorDoc/:${autoCompleteData.id}`
                            }
                            target="_blank"
                          >
                            <button
                              className="btn btn-primary "
                              onClick={() => {
                                buttonValue == "Project"
                                  ? handleProjectSelect()
                                  : buttonValue == "Engagement"
                                  ? handleEngagementSelect()
                                  : buttonValue == "Vendor"
                                  ? handleSelect()
                                  : buttonValue == "Expense"
                                  ? handleExpenseSelect()
                                  : handleCustomerSelect();
                              }}
                            >
                              <BiSearch /> Search
                            </button>
                          </Link>
                        ) : (
                          <button
                            className="btn btn-primary "
                            onClick={() => {
                              handleSearchButtonClick();
                            }}
                          >
                            <BiSearch /> Search
                          </button>
                        )}
                        {/* {autoCompleteData.id == undefined ? (
                      <button
                        title="Search"
                        className="btn btn-primary"
                        style={{ fontSize: "12px" }}
                        onClick={() => {
                          buttonValue == "Project"
                            ? handleProjectSelect()
                            : buttonValue == "Engagement"
                            ? handleEngagementSelect()
                            : buttonValue == "Vendor"
                            ? handleSelect()
                            : buttonValue == "Expense"
                            ? handleExpenseSelect()
                            : handleCustomerSelect();
                        }}
                      >
                        <FaSearch /> Search
                      </button>
                    ) : (
                      <Link
                        title="Search"
                        to={
                          buttonValue == "Project"
                            ? `/project/Overview/:${autoCompleteData.id}`
                            : buttonValue == "Engagement"
                            ? `/engagement/Dashboard/:${autoCompleteData.id}`
                            : buttonValue == "Customer"
                            ? `customer/dashboard/:${autoCompleteData.id}`
                            : buttonValue == "Expense"
                            ? `/expense/Create/:${autoCompleteData.id}`
                            : `/vendor/vendorDoc/:${autoCompleteData.id}`
                        }
                        target="_blank"
                      >
                        <button
                          className="btn btn-primary "
                          onClick={() => {
                            buttonValue == "Project"
                              ? handleProjectSelect()
                              : buttonValue == "Engagement"
                              ? handleEngagementSelect()
                              : buttonValue == "Vendor"
                              ? handleSelect()
                              : buttonValue == "Expense"
                              ? handleExpenseSelect()
                              : handleCustomerSelect();
                          }}
                        >
                          <BiSearch /> Search
                        </button>
                      </Link>
                    )} */}
                      </div>
                    </div>
                    {/* <div className="col-1"></div> */}

                    {/* </div> */}
                  </div>
                </div>
              </div>
              {searching ? <Loader handleAbort={handleAbort} /> : ""}
            </div>
          </div>
        </div>
      )}

      {/* {btnState === "Open" && (
        <VendorOpen buttonValue={buttonValue} urlState={urlState} />
      )} */}
      {btnState === "Create" && (
        <ProjectCreate buttonValue={buttonValue} urlState={urlState} />
      )}
      {btnState === "Search" && (
        <ProjectSearch
          maxHeight1 = {maxHeight1}
          fileName = "ProjectSearch"
          urlState={urlState}
          setVisible={setVisible}
          visible={visible}
          setCheveronIcon={setCheveronIcon}
        />
      )}
      {btnState === "Reviews" && (
        <ProjectReviews
        maxHeight1 = {maxHeight1}
          urlState={urlState}
          setVisible={setVisible}
          visible={visible}
          setCheveronIcon={setCheveronIcon}
        />
      )}
    </div>
  );
}

export default InitialParentProject;
