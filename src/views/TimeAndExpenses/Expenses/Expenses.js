import React, { useState, useEffect, useRef } from "react";
import VendorOpen from "../../VendorComponent/VendorOpen";
import ExpensesAdd from "./ExpensesAdd";
import ExpensesCreate from "./ExpensesCreate";
import ExpensesOpen from "./ExpensesOpen";
import NewExpensesOpen from "./NewExpensesOpen";
import ExpensesSearch from "./ExpensesSearch";
import ExpensesTypes from "./ExpensesTypes";
import ExpensesView from "./ExpensesView";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { environment } from "../../../environments/environment";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { updateExpenseButtonState } from "../../../reducers/SelectedSEReducer";
import ExpenseStackView from "./ExpenseStackView";
import "./NewExpensesOpen.scss";
import Loader from "../../Loader/Loader";
import ScreenBreadcrumbs from "../../Common/ScreenBreadcrumbs";
import AutoComplete from "../../VendorComponent/VendorOpenAuto";
import GlobalHelp from "../../PrimeReactTableComponent/GlobalHelp";
import { BiSearch } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";

// import { environment } from "../../environments/environment";
import { Link } from "react-router-dom";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import moment from "moment";
import useDynamicMaxHeight from "../../PrimeReactTableComponent/useDynamicMaxHeight";

function Expenses(props) {
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");

  const expenseButtonState = useSelector(
    (state) => state.selectedSEState.expenseButtonState
  );
  const [dataAccess, setDataAccess] = useState([]);
  const [btnState, setbtnState] = useState(expenseButtonState);
  const [buttonValue, setButtonValue] = useState("Expense");
  const [permission, setPermission] = useState([]);
  const dispatch = useDispatch();
  const state = useLocation();
  let url = window.location.href;
  const [Id, setId] = useState(0);
  const loggedUserName = localStorage.getItem("resName");
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [visible, setVisible] = useState(false);
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [stackIdData, setStackIdData] = useState([]);
  const [tableLoader, setTableLoader] = useState();
  const today = moment().toDate();
  const [startDate, setStartDate] = useState(
    today.getDay() === 1 ? today : moment().startOf("isoWeek").toDate()
  );

  const [iconState, setIconState] = useState("right");

  const [displayTableBody, setDisplayTableBody] = useState(false);

  const navigate = useNavigate();

  const [stackName, setStackName] = useState("");

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 79) + "px"
  );

  useEffect(() => {
    if (id !== undefined) {
      axios
        .get(
          baseUrl + `/timeandexpensesms/projectExpense/stackName?stackId=${id}`
        )
        .then((res) => {
          setStackName(res.data);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoader(true);
      setTableLoader(true);
    }, 2000);

    if (id !== undefined) {
      axios
        .get(
          baseUrl +
            `/timeandexpensesms/projectExpense/create?stackId=${id}&userId=${loggedUserId}`
        )
        .then((res) => {
          setStartDate(
            moment(res.data[0].expense_date).startOf("week").add(1, "days")._d
          );
          setStackIdData(res.data);
        })
        .catch((error) => console.log(error));
      setDisplayTableBody(true);
      setIconState("down");
      setLoader(false);
      setTableLoader(false);
    }
  }, []);

  const getMenus = () => {
    // setMenusData

    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        let getData = resp.data;

        const revenueForcastSubMenu = getData
          .find((item) => item.display_name === "Time & Expenses")
          .subMenus.find((subMenu) => subMenu.display_name === "Expenses");

        const accessLevel = revenueForcastSubMenu
          ? revenueForcastSubMenu.userRoles.includes("690")
            ? 690
            : revenueForcastSubMenu.userRoles.includes("641")
            ? 641
            : revenueForcastSubMenu.userRoles.includes("932")
            ? 932
            : revenueForcastSubMenu.userRoles.includes("46")
            ? 46
            : revenueForcastSubMenu.userRoles.includes("126")
            ? 126
            : revenueForcastSubMenu.userRoles.includes("919")
            ? 919
            : revenueForcastSubMenu.userRoles.includes("686")
            ? 686
            : revenueForcastSubMenu.userRoles.includes("930")
            ? 930
            : revenueForcastSubMenu.userRoles.includes("307") && 307
          : null;
        axios({
          method: "GET",
          url:
            baseUrl +
            `/CommonMS/master/getBenchMtericsMenus?loggedUserId=${loggedUserId}&Cont=Expense`,
        }).then((res) => {
          // const data = res.data;
          const data = res.data;
          // .filter((item) => {
          //   return (
          //     item.display_name !== "View Foreign Exchange Rates" &&
          //     item.display_name !== "Add Foreign Exchange Value"
          //   );
          // });

          const filteredData = data.filter(
            (item) => item.display_name != "Expense Types"
          );
          {
            accessLevel == 126
              ? setPermission(filteredData)
              : setPermission(data);
          }
          // setPermission(data);
        });
        setDataAccess(accessLevel);
      });
  };

  useEffect(() => {
    // menus();
    getMenus();
  }, []);

  const initialValues = {
    vendor_name: "",
    id: "",
  };

  let container = document.createElement("div");

  const [access, setAccess] = useState([]);
  const [data, setData] = useState([]);
  const [projectTableData, setProjectTableData] = useState([]);
  const [vendorListData, setVendorListData] = useState([]);
  const [projectData, setProjectData] = useState([]);
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

  const [state1, setState] = useState({
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
  const [accessLatest, setAccessLatest] = useState([]);
  const [autoCompleteValidation, setAutoCompleteValidation] = useState("");
  const [searching, setsearching] = useState(false);

  useEffect(() => {}, [
    vendorListData,
    projectData,
    engagementData,
    expenseData,
  ]);
  useEffect(() => {}, [autoCompleteData]);
  useEffect(() => {}, [state1]);
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

  // const menus = () => {

  const getMenusNew = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) =>
            submenu.display_name !== "Shift Allownaces" &&
            // submenu.display_name !== "Fill Timesheets" &&
            submenu.display_name !== "Project Timesheet (Deprecated)"
        ),
      }));
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  useEffect(() => {
    getMenusNew();
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

  //   axios({
  //     method: "GET",

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

  //     url:

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
  //       baseUrl +
  const handleAbortNew = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  const CreateHelpPDFName = "CreateExpenseType.pdf";
  const CreateHelpHeader = "Create Expense Report : Draft Help";
  const SearchHelpPDFName = "SearchExpense.pdf";
  const SearchHeadername = "Search Expense Help";

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
  let currentScreenName = [];
  let textContent = "";

  if (buttonValue === "Expense") {
    currentScreenName = ["Expenses", "Expense Search History"];
    textContent = "Time & Expenses";
  } else if (buttonValue === "Project") {
    currentScreenName = ["Projects", "Project Search History"];
    textContent = "Delivery";
  } else if (buttonValue === "Customers") {
    currentScreenName = ["Customers", "Customer Search History"];
    textContent = "Customers";
  } else if (buttonValue === "Vendor") {
    currentScreenName = ["Vendor Search History"];
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

  useEffect(() => {
    let stat = state?.state;
    console.log(state);
    if (url.includes("Create")) {
      setbtnState("Create");
    }
    let expenseArr = url.split(":");
    setId(expenseArr[expenseArr.length - 1]);
    stat?.btnState != undefined && setbtnState(stat?.btnState);
  }, []);

  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
  };
  const [urlState, setUrlState] = useState("/search/userExpenseHistory/");
  const [paymentUsers, setPaymentUsers] = useState([]);
  const [isClassicView, setIsClassicView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          baseUrl + `/ProjectMS/projectExpenses/paymentUsers`
        );
        const paymentUsers = response.data;
        setPaymentUsers(paymentUsers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  console.log(permission);
  return (
    <div className="col-md-12">
      {btnState != "Search" ? (
        <div className="pageTitle">
          <div className="childOne">
            <div className="tabsProject">
              {permission.map((button) => {
                if (
                  button.display_name !== "Add Foreign Exchange Value" &&
                  button.display_name !== "View Foreign Exchange Rates"
                ) {
                  return (
                    <button
                      key={button.id}
                      className={
                        btnState === button.display_name.toString()
                          ? "buttonDisplayClick"
                          : "buttonDisplay"
                      }
                      onClick={() => {
                        setUrlState(
                          button.url_path.toString().replace(/::/g, "/") + "/"
                        );
                        navigate("/search/userExpenseHistory");
                        setTimeout(() => {
                          setbtnState(button.display_name.toString());
                          setUrlState(
                            button.url_path.toString().replace(/::/g, "/") + "/"
                          );
                        }, 100);
                        dispatch(
                          updateExpenseButtonState(
                            button.display_name.toString()
                          )
                        );
                        if (button.display_name.toString() == "Create") {
                          window.location.reload();
                        }
                      }}
                    >
                      {button.display_name}
                    </button>
                  );
                } else {
                  return null;
                }
              })}
              <ul className="tabsContainer">
                <li>
                  <span>Foreign Exchange</span>
                  <ul>
                    {permission.map((button) => {
                      if (
                        button.display_name !== "Create" &&
                        button.display_name !== "Open" &&
                        button.display_name !== "Search" &&
                        button.display_name !== "Expense Types"
                      ) {
                        return (
                          <li
                            key={button.id}
                            className={
                              btnState === button.display_name.toString()
                                ? "buttonDisplayClick"
                                : "buttonDisplay"
                            }
                            onClick={() => {
                              setUrlState(
                                button.url_path.toString().replace(/::/g, "/") +
                                  "/"
                              );
                              navigate("/search/userExpenseHistory");
                              setTimeout(() => {
                                setbtnState(button.display_name.toString());
                                setUrlState(
                                  button.url_path
                                    .toString()
                                    .replace(/::/g, "/") + "/"
                                );
                              }, 100);
                              dispatch(
                                updateExpenseButtonState(
                                  button.display_name.toString()
                                )
                              );
                            }}
                          >
                            {button.display_name}
                          </li>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div className="childTwo">
            {btnState === "Open" ? (
              <h2> {`${buttonValue} Search History`}</h2>
            ) : btnState === "Create" && id == undefined ? (
              <h2>Create Expense Report : Draft</h2>
            ) : btnState === "Create" && id != undefined ? (
              <h2>
                {stackIdData[0]?.approvalStatus} Expense Report : {stackName}
              </h2>
            ) : btnState === "Expense Types" ? (
              <h2>Add Expense Types</h2>
            ) : btnState === "Add Foreign Exchange Value" ? (
              <h2>Add Foreign Exchange Rates</h2>
            ) : btnState === "View Foreign Exchange Rates" ? (
              <h2>View Foreign Exchange Rates</h2>
            ) : (
              ""
            )}
          </div>

          <div className="childThree toggleBtns">
            {btnState === "Open" ? (
              <GlobalHelp pdfname={HelpPDFName} name={Headername} />
            ) : btnState === "Create" ? (
              <GlobalHelp pdfname={CreateHelpPDFName} name={CreateHelpHeader} />
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {btnState === "Open" ? (
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
            {searching ? <Loader handleAbort={handleAbortNew} /> : ""}
          </div>
        </div>
      ) : (
        ""
      )}
      {btnState === "Create" ? (
        <ExpensesCreate
          handleAbort={handleAbort}
          setbtnState={setbtnState}
          btnState={btnState}
          id={id}
          setCheveronIcon={setCheveronIcon}
          setVisible={setVisible}
          visible={visible}
          cheveronIcon={cheveronIcon}
          loader={loader}
          setLoader={setLoader}
          stackIdData={stackIdData}
          setStackIdData={setStackIdData}
          tableLoader={tableLoader}
          startDate={startDate}
          iconState={iconState}
          displayTableBody={displayTableBody}
          setIconState={setIconState}
          setDisplayTableBody={setDisplayTableBody}
          setStartDate={setStartDate}
          setTableLoader={setTableLoader}
        />
      ) : (
        ""
      )}
      {btnState === "Search" ? (
        paymentUsers.includes(parseInt(loggedUserId)) || isClassicView ? (
          <>
            <div className="pageTitle">
              <div className="childOne">
                <div className="tabsProject">
                  {permission.map((button) => {
                    if (
                      button.display_name !== "Add Foreign Exchange Value" &&
                      button.display_name !== "View Foreign Exchange Rates"
                    ) {
                      return (
                        <button
                          key={button.id}
                          className={
                            btnState === button.display_name.toString()
                              ? "buttonDisplayClick"
                              : "buttonDisplay"
                          }
                          onClick={() => {
                            setUrlState(
                              button.url_path.toString().replace(/::/g, "/") +
                                "/"
                            );
                            navigate("/search/userExpenseHistory");
                            setTimeout(() => {
                              setbtnState(button.display_name.toString());
                              setUrlState(
                                button.url_path.toString().replace(/::/g, "/") +
                                  "/"
                              );
                            }, 100);
                            dispatch(
                              updateExpenseButtonState(
                                button.display_name.toString()
                              )
                            );
                            if (button.display_name.toString() == "Create") {
                              window.location.reload();
                            }
                          }}
                        >
                          {button.display_name}
                        </button>
                      );
                    } else {
                      return null;
                    }
                  })}
                  <ul className="tabsContainer">
                    <li>
                      <span>Foreign Exchange</span>
                      <ul>
                        {permission.map((button) => {
                          if (
                            button.display_name !== "Create" &&
                            button.display_name !== "Open" &&
                            button.display_name !== "Search" &&
                            button.display_name !== "Expense Types"
                          ) {
                            return (
                              <li
                                key={button.id}
                                className={
                                  btnState === button.display_name.toString()
                                    ? "buttonDisplayClick"
                                    : "buttonDisplay"
                                }
                                onClick={() => {
                                  setUrlState(
                                    button.url_path
                                      .toString()
                                      .replace(/::/g, "/") + "/"
                                  );
                                  navigate("/search/userExpenseHistory");
                                  setTimeout(() => {
                                    setbtnState(button.display_name.toString());
                                    setUrlState(
                                      button.url_path
                                        .toString()
                                        .replace(/::/g, "/") + "/"
                                    );
                                  }, 100);
                                  dispatch(
                                    updateExpenseButtonState(
                                      button.display_name.toString()
                                    )
                                  );
                                }}
                              >
                                {button.display_name}
                              </li>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="childTwo">
                {paymentUsers.includes(parseInt(loggedUserId)) ||
                isClassicView ? (
                  <h2>Search Expense</h2>
                ) : (
                  <h2>Expense Report of {loggedUserName}</h2>
                )}
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
            <div className="col-md-12">
              {" "}
              <ExpensesSearch
                handleAbort={handleAbort}
                setbtnState={setbtnState}
                paymentUsers={paymentUsers}
                urlState={urlState}
                setCheveronIcon={setCheveronIcon}
                setVisible={setVisible}
                visible={visible}
                maxHeight1={maxHeight1}
              />
            </div>
          </>
        ) : (
          <ExpenseStackView setIsClassicView={setIsClassicView} />
        )
      ) : (
        ""
      )}

      {btnState === "Expense Types" ? (
        <ExpensesTypes urlState={urlState} maxHeight1={maxHeight1} />
      ) : (
        ""
      )}
      {btnState === "Add Foreign Exchange Value" ? (
        <ExpensesAdd urlState={urlState} />
      ) : (
        ""
      )}
      {btnState === "View Foreign Exchange Rates" ? (
        <ExpensesView urlState={urlState} />
      ) : (
        ""
      )}
    </div>
  );
}
export default Expenses;
