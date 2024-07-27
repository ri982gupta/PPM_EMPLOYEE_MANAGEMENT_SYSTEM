import React, { useRef, useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import axios from "axios";
import { environment } from "../../environments/environment";
import { Link } from "react-router-dom";
import { GoGraph, GoThreeBars } from "react-icons/go";
import AutoComplete from "./VendorOpenAuto";
import Loader from "../Loader/Loader";
import "./VendorOpen.scss";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { FaSearch } from "react-icons/fa";
import InitialParentVendorTabs from "./IntialParentVendorTabs";

function VendorOpen(props) {
  const initialValues = {
    vendor_name: "",
    id: "",
  };

  const {
    buttonValue,
    urlState,
    permission,
    setUrlState,
    buttonState,
    setButtonState,
  } = props;
  console.log(buttonValue);
  let HelpPDFName;
  let Headername;

  // const [buttonStateName, setButtonStateName] = useState("Customers");
  // const [buttonStateSrnName, setButtonStateSrnName] = useState(["Customer Open"]);

  // switch (buttonValue) {
  //   case "Expense":
  //     setButtonStateSrnName(["Expenses", "Expense Search History"]);
  //     setButtonStateName("Time & Expenses");
  //     break;
  //   case "Project":
  //     setButtonStateSrnName(["Projects", "Project Search History"]);
  //     setButtonStateName("Delivery");
  //     break;
  //   case "Customer":
  //     setButtonStateSrnName(["Customers", "Customer Search History"]);
  //     setButtonStateName("Customers");
  //     break;
  //   case "Vendor":
  //     setButtonStateSrnName(["Vendor Search History"]);
  //     setButtonStateName("Vendors");
  //     break;
  //   case "Engagement":
  //     setButtonStateSrnName(["Engagements", "Engagement Search History"]);
  //     setButtonStateName("Delivery");
  //     break;
  //   default:
  //     // Handle the default case if needed
  //     break;
  // }
  console.log(buttonValue);

  let container = document.createElement("div");

  const [aid, setAid] = useState(1);
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

  const lastDataId = latestData[latestData.length - 1]?.id;
  console.log(lastDataId, ".........");
  const [accessLatest, setAccessLatest] = useState([]);
  const [autoCompleteValidation, setAutoCompleteValidation] = useState("");
  const [searching, setsearching] = useState(false);
  const abortController = useRef(null);

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
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      console.log(data, "data");
      const updatedMenuDataCustomer = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Financial Plan & Review"
        ),
      }));
      const updatedMenuData = updatedMenuDataCustomer.map((category) => ({
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
  console.log(aid);
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
  } else if (buttonValue == "Vendor") {
    HelpPDFName = "OpenVMG.pdf";
    Headername = "Vendor Open Help";
  }
  console.log(validationmessage);
  let currentScreenName = [];
  let textContent = "";

  if (buttonValue === "Expense") {
    currentScreenName = ["Expenses", "Expense Search History"];
    textContent = "Time & Expenses";
  } else if (buttonValue === "Project") {
    currentScreenName = ["Projects", "Project Search History"];
    textContent = "Delivery";
  } else if (buttonValue === "Customer") {
    currentScreenName = ["Customer Search History"];
    textContent = "Customers";
  } else if (buttonValue === "Vendor") {
    currentScreenName = ["Vendors", "Vendor Search History"];
    textContent = "Vendors";
  } else if (buttonValue === "Engagement") {
    currentScreenName = ["Engagements", "Engagement Search History"];
    textContent = "Delivery";
  }
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          {buttonValue == "Customer" && (
            <div className="childOne ">
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
                      setUrlState(
                        button.url_path.toString().replace(/::/g, "/")
                      );
                    }}
                  >
                    {/* clg */}

                    {button.display_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {buttonValue == "Vendor" && (
            <div className="childOne ">
            <div className="tabsProject">
            <InitialParentVendorTabs buttonState ={buttonState} setButtonState={setButtonState}
              setUrlState={setUrlState} />
              </div>
              </div>
          )}

          <div className="childTwo">
            <h2> {`${buttonValue} Search History`}</h2>
          </div>
          <div className="childThree">
            <div
              className="helpBtn"
              style={{ float: "right", paddingTop: "5px" }}
            >
              <GlobalHelp pdfname={HelpPDFName} name={Headername} />
            </div>
          </div>
        </div>
      </div>
      {/* {buttonValue == "Expense"
        ? ((currentScreenName = ["Expenses", "Expense Search History"]),
          (textContent = "Time & Expenses"))
        : buttonValue == "Project"
        ? ((currentScreenName = ["Projects", "Project Search History"]),
          (textContent = "Delivery"))
        : buttonValue == "Customer"
        ? ((currentScreenName = ["Customers", "Customer Search History"]),
          (textContent = "Customers"))
        : buttonValue == "Vendor"
        ? ((currentScreenName = ["Vendor Search History"]),
          (textContent = "Vendors"))
        : buttonValue == "Engagement"
        ? ((currentScreenName = ["Engagements", "Engagement Search History"]),
          (textContent = "Delivery"))
        : ""} */}
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
                                ? "₹ "
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
                                  {" د.إ "}
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
              {aid == 0 ? (
                <div className="statusMsg error col-12 mb-2">
                  <span>
                    <IoWarningOutline />
                    &nbsp;
                    {`Sorry! You don't have permission to view the  ${buttonValue}`}
                  </span>
                </div>
              ) : (
                ""
              )}
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
                    {buttonValue == "Expense" ? "Expense Stack" : buttonValue}
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
                      aid={aid}
                      setAid={setAid}
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
  );
}

export default VendorOpen;
