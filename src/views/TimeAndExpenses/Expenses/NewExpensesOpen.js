import React, { useRef, useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import axios from "axios";
import "./NewExpensesOpen.scss";
import { environment } from "../../../environments/environment";
import Loader from "../../Loader/Loader";
import ScreenBreadcrumbs from "../../Common/ScreenBreadcrumbs";
import AutoComplete from "../../VendorComponent/VendorOpenAuto";
import GlobalHelp from "../../PrimeReactTableComponent/GlobalHelp";
// import { environment } from "../../environments/environment";
import { Link } from "react-router-dom";
import { GoGraph, GoThreeBars } from "react-icons/go";
// import AutoComplete from "./VendorOpenAuto";
// import Loader from "../Loader/Loader";
// import "./VendorOpen.scss";
// import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
// import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import { FaSearch } from "react-icons/fa";

function NewExpensesOpen(props) {
  const initialValues = {
    vendor_name: "",
    id: "",
  };

  const { buttonValue } = props;
  let container = document.createElement("div");

  // console.log(buttonValue)
  const [access, setAccess] = useState([]);
  const [data, setData] = useState([]);
  const [projectTableData, setProjectTableData] = useState([]);
  const baseUrl = environment.baseUrl;
  const [vendorListData, setVendorListData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [expenseLength, setExpensesLength] = useState([]);
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
      })
      .catch(function (response) {});
  };
  console.log(expenseLength);
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

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

      data.forEach((item) => {
        if (item.display_name === textContent1 && buttonValue == "Expense") {
          setRoutes([item]);
        }
      });
    });
  };
  useEffect(() => {
    getMenus();
  }, []);

  /// Project open api calls
  ////Project table data

  useEffect(() => {
    getExpenseTableData();
    getExpenseData();
  }, [buttonValue]);

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

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2> {`${buttonValue} Search History`}</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {buttonValue == "Expense" ? (
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
      )}
      {/* {buttonValue == "Project" && ( */}
      <div className="helpBtn" style={{ float: "right", paddingTop: "5px" }}>
        <GlobalHelp pdfname={HelpPDFName} name={Headername} />
      </div>

      <div className="body body-bg col-xs-12 col-sm-12 col-md-12 col-lg-12 customCard ">
        <div className="form-group cvu darkHeader">
          <div className="col-6 my-2 no-padding">
            {/* {console.log(projectTableData)} */}
            {projectTableData.length > 0 ||
            customerTableData.length > 0 ||
            engagementTableData.length > 0 ||
            expenseTableData.length > 0 ? (
              <table
                id="details"
                className="col-12 table table-bordered  openTable " ////customerEngament
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
              {accessLevel ? (
                <div className="statusMsg error col-12 mb-2">
                  <span>
                    <IoWarningOutline />
                    &nbsp;{`Not authorized to any ${buttonValue}`}
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
                      customerData={customerData}
                      filteredData={filteredData}
                      setFilteredData={setFilteredData}
                      setExpensesLength={setExpensesLength}
                      autoCompleteValidation={autoCompleteValidation}
                      // handleEngagementSelect={handleEngagementSelect}
                      engagementData={engagementData}
                      expenseData={expenseData}
                      handleExpenseSelect={handleExpenseSelect}
                    />
                  </div>

                  <div className="err col-2">
                    {expenseLength > 0 ? (
                      <Link
                        title="Search"
                        to={
                          buttonValue == "Expense" &&
                          `/expense/Create/${autoCompleteData.id}`
                        }
                        target="_blank"
                      >
                        <button
                          className="btn btn-primary "
                          onClick={() => {
                            buttonValue == "Expense" && handleExpenseSelect();
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          {searching ? <Loader handleAbort={handleAbort} /> : ""}
        </div>
      </div>
    </div>
  );
}

export default NewExpensesOpen;
