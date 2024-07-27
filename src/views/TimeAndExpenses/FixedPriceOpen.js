import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "primereact/column";
import DatePicker from "react-datepicker";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { BiSearch } from "react-icons/bi";
import Loader from "../Loader/Loader";
import FixedPriceOpenFirstTable from "./Expenses/FixedPriceOpenFirstTable";
import FixedPriceOpenCss from "./FixedPriceOpen.scss";
import { BiCheck } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";

function FixedPriceOpen() {
  const baseUrl = environment.baseUrl;
  var date = new Date();
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const BillingFirstDate = moment(startDate).format("yyyy-MM-DD");
  let rows = 10;
  const [endDate, setEndDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const BillingMonthdate = moment(new Date()).format("yyyy-MM-DD");
  const newBillingMonthdate = moment(new Date()).format("yyyy-MM-DD");
  const [newyear, newmonth] = newBillingMonthdate.split("-");
  const newformattedDate = `${newmonth}-${newyear}`;
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const BillingLastDate = moment(lastDayOfMonth).format("yyyy-MM-DD");
  const [formData, setFormData] = useState([
    {
      billingMonth: startDate,
    },
  ]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [customer, setCustomer] = useState([]);
  const [showSecTable, setShowSecTable] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [dataAccess, setDataAccess] = useState([]);

  const abortController = useRef(null);

  const [loader, setLoader] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [graphData, setGraphData] = useState([{}]);
  const [showtable, setShowtable] = useState(false);
  const [storeFirstTab, setStorefirstTab] = useState([]);
  const [isSQA, setIsSQA] = useState([]);
  // const billingMonth = storeFirstTab[0]?.billingMonth;
  // const lastDateOfMonth1 = moment(billingMonth)
  //   .endOf("month")
  //   .format("YYYY-MM-DD");
  // formData.billingMonth;
  const billingMonth1 = formData.billingMonth;
  const lastDateOfMonth2 = moment(billingMonth1)
    .endOf("month")
    .format("YYYY-MM-DD");
  const [firstTabledata, setFirstTabledata] = useState([]);
  const [PMReview, setPMReview] = useState([]);
  const [DMReview, setDMReview] = useState([]);
  const [FMReview, setFMReview] = useState([]);
  const [EMReview, setEMReview] = useState([]);
  const [routes, setRoutes] = useState([]);
  let textContent = "Time & Expenses";
  let currentScreenName = ["Fixed Price - Open"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const loggedUserId = localStorage.getItem("resId");
  const billingMonthDate = formData.billingMonth || BillingMonthdate;
  const [year, month] = billingMonthDate.split("-");
  const formattedDate = `${month}-${year}`;
  let flag = 1;
  const handleClick = () => {
    setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
    setLoader(false);
    setShowtable(false);
    setIsShow(true);
    getGraph();
  };

  const getGraph = () => {
    var GetData = [];
    axios
      .get(baseUrl + `/timeandexpensesms/getEMid?id=${loggedUserId}`)
      .then((res) => {
        if (res.data) {
          GetData = res.data;
        } else {
          GetData.push((role_type_id = 0));
        }
        setEMReview(GetData);
        if (
          ["104335943", "1798", "126606014"].includes(loggedUserId) ||
          GetData[0]?.role_type_id == 919
        ) {
          axios({
            method: "post",
            url: baseUrl + `/timeandexpensesms/projectBillingList`,
            data: {
              billMnth:
                formattedDate == undefined ? newformattedDate : formattedDate,
              tsName: "",
              term: "monthly",
              customerId:
                formData.customerId == undefined || formData.customerId == ""
                  ? 0
                  : formData.customerId,
              startDate: formData.billingMonth
                ? formData.billingMonth
                : BillingFirstDate,
              endDate: formData.billingMonth
                ? lastDateOfMonth2
                : BillingLastDate,
              userId: loggedUserId,
            },
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => {
              const data = res.data;
              setStorefirstTab(res.data.billingtslist);
              setIsSQA(res.data.isSQA);
              setGraphData(data);
              getDataBsedGrpah(data, "In PM Review");
              setTimeout(() => {
                setLoader(false);
              }, 1000);
            })
            .catch((error) => {
              console.log("Error :" + error);
            });
        } else {
          axios({
            method: "post",
            url: baseUrl + `/timeandexpensesms/myProjectBillingList`,
            data: {
              billingMonth:
                formattedDate == undefined ? newformattedDate : formattedDate,
              billingtslist: "",
              userLogged: loggedUserId,
              tsId: "",
              tsName: "",
              term: "monthly",
              customerId:
                formData.customerId == undefined ||
                formData.customerId == "" ||
                formData.customerId == "null"
                  ? 0
                  : formData.customerId,
              startDate: formData.billingMonth
                ? formData.billingMonth
                : BillingFirstDate,
              endDate: formData.billingMonth
                ? lastDateOfMonth2
                : BillingLastDate,
              userId: loggedUserId,
            },
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => {
              const data = res.data;
              setStorefirstTab(res.data.billingtslist);
              setIsSQA(res.data.isSQA);
              setGraphData(data);
              getDataBsedGrpah(data, "In PM Review");
              setTimeout(() => {
                setLoader(false);
              }, 1000);
            })
            .catch((error) => {
              console.log("Error :" + error);
            });
        }
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };

  useEffect(() => {
    // getExecutiveManagementId();
    getGraph();
    getMenus();
  }, []);

  // useEffect(() => {
  //   getGraph();
  // }, [EMReview])

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/billingTimesheet/myProjectBillingList";
      getUrlPath(modifiedUrlPath);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) =>
            submenu.display_name !== "Shift Allownaces" &&
            //  submenu.display_name !== "Fill Timesheets" &&
            submenu.display_name !== "Project Timesheet (Deprecated)"
        ),
      }));
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });

      const TMExpensesSubMenu = data
        .find((item) => item.display_name === "Time & Expenses")
        .subMenus.find(
          (subMenu) => subMenu.display_name === "Fixed Price - Open"
        );

      // Extract the access_level value
      const accessLevel = TMExpensesSubMenu
        ? TMExpensesSubMenu.userRoles.includes("690") &&
          TMExpensesSubMenu.userRoles.includes("641")
          ? 600
          : TMExpensesSubMenu.userRoles.includes("690")
          ? 690
          : TMExpensesSubMenu.userRoles.includes("641")
          ? 641
          : TMExpensesSubMenu.userRoles.includes("930")
          ? 930
          : TMExpensesSubMenu.userRoles.includes("46") && 46
        : null;
      setDataAccess(accessLevel);
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    //  console.log(modifiedUrlPath);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };
  // console.log(dataAccess);
  const getCustomers = () => {
    axios(
      dataAccess == 641 ||
        dataAccess == 690 ||
        dataAccess == 930 ||
        dataAccess == 600
        ? baseUrl +
            // `/CommonMS/master/getCustomersList?loggedUserId=${loggedUserId}`
            `/ProjectMS/project/getCustomersOverAll?loggedUserId=${
              Number(loggedUserId) + 1
            }`
        : flag == 1
        ? baseUrl + `/ProjectMS/Engagement/getCustomerName`
        : baseUrl + `/ProjectMS/Engagement/getCustomerName`
    ).then((resp) => {
      let custom = resp.data;
      // console.log(custom);
      // const filteredData = custom.filter((item) => item.id !== 81084541);
      setCustomer(custom);
    });
  };

  useEffect(() => {
    if (
      dataAccess == 641 ||
      dataAccess == 690 ||
      dataAccess == 930 ||
      dataAccess == 46
    ) {
      getCustomers();
    }
  }, [dataAccess]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    if (value != null) {
      setFormData((prev) => ({ ...prev, [id]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: 0 }));
    }
  };
  useEffect(() => {
    getCustomers();
  }, []);

  const [storegrpahname, setStoregrpahname] = useState([]);
  const [visibleTable, setVisibleTable] = useState(false);
  const [firstTableData, setFirstTableData] = useState([{}]);
  const [isDM, setIsDM] = useState(false);
  let isMatchedDM = false;
  for (const review of DMReview) {
    if (review.deliveryMgrId && review.deliveryMgrId.includes(",")) {
      const deliveryMgrId = review.deliveryMgrId.split(",");
      if (deliveryMgrId.includes(loggedUserId.toString())) {
        isMatchedDM = true;
        break;
      }
    }
  }
  useEffect(() => {
    if (isMatchedDM) {
      setIsDM(isMatchedDM);
    } else {
      setIsDM(isMatchedDM);
    }
  }, [isMatchedDM]);

  const getDataBsedGrpah = (data, name) => {
    setShowtable(true);
    setShowSecTable(false);
    setStoregrpahname(name);
    axios({
      method: "post",
      url: baseUrl + `/timeandexpensesms/getFirstTable`,
      data: {
        tsId: 0,
        isSQA:
          ["104335943", "1798", "126606014"].includes(loggedUserId) ||
          EMReview[0]?.role_type_id == 919
            ? false
            : isSQA.length > 0
            ? isSQA
            : data.isSQA,
        status: name,
        tsName: "",
        customerId:
          formData.customerId == undefined || formData.customerId == ""
            ? 0
            : formData.customerId,
        term: "monthly",
        startDate: formData.billingMonth
          ? formData.billingMonth
          : BillingFirstDate,
        endDate: formData.billingMonth ? lastDateOfMonth2 : BillingLastDate,
        billMonth: formData.billingMonth
          ? formData.billingMonth
          : BillingFirstDate,
        isDM: isDM,
        isAdmin:
          ["104335943", "1798", "126606014"].includes(loggedUserId) ||
          EMReview[0]?.role_type_id == 919
            ? true
            : false,
        loggedId: loggedUserId,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          data[i]["is_dirty"] =
            data[i]["is_dirty"] == null
              ? "No"
              : moment(data[i]["is_dirty"]).format("DD-MMM-YYYY");
          data[i]["refreshDate"] =
            data[i]["refreshDate"] == null
              ? "NA"
              : moment(data[i]["refreshDate"]).format("DD-MMM-YYYY");

          const billingPeriod = data[i]["billingPeriod"];
          if (billingPeriod) {
            const [startDate, endDate] = billingPeriod.split(" to ");
            const formattedStartDate = moment(startDate).format("DD-MMM-YY");
            const formattedEndDate = moment(endDate).format("DD-MMM-YY");
            data[i][
              "billingPeriod"
            ] = `${formattedStartDate} to ${formattedEndDate}`;
          }
        }

        setFirstTableData(data);
        setVisibleTable(true);
        setTimeout(() => {
          setLoader(false);
        }, 1000);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };

  const HelpPDFName = "FixedPriceOpen.pdf";
  const Headername = "Fixed-price Open Help";
  return (
    <div>
      {addmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" strokeWidth={{ width: "100px" }} />{" "}
            &nbsp;Billing timesheet details saved successfully
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
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Fixed Price-Open</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customerId">
                  Customer<span style={{ color: "red" }}></span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text cancel"
                    id="customerId"
                    name="customerId"
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="null">{"<<Please Select>>"}</option>
                    {customer.map((Item) => (
                      <option value={Item.id}>{Item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  Month<span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    selected={startDate}
                    name="billingMonth"
                    id="billingMonth"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        ["billingMonth"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setStartDate(e);
                    }}
                    dateFormat="MMM-yyyy"
                    maxDate={new Date()}
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleClick}
              >
                <FaSearch />
                Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      {/* {graphData?.billingtslist?.length > 0 ? ( */}
      <>
        {/* <div className="flowChart">
          <div className="tCircle">
            <div className="label">DM Review</div>
            <div className="circle">
              <div className="text">
                {graphData.billingtslist.map((data, index) => {
                  return (
                    <a
                      key={index}
                      className={`${
                        data.dmReview === 0 ? "count zero" : "count"
                      }`}
                      data-count="1"
                      onClick={(e) => {
                        {
                          data.dmReview === 0
                            ? ""
                            : getDataBsedGrpah(data, "In DM Review");
                        }
                      }}
                    >
                      {data.dmReview}
                    </a>
                  );
                })}
              </div>
            </div>
            <div className="tvline">&nbsp;</div>
          </div>
          <div className="tCircle">
            <div className="label">DM Rejected</div>
            <div className="circle">
              <div className="text">
                {graphData.billingtslist.map((data, index) => (
                  <a
                    key={index}
                    className={`${
                      data.dmRejected == 0 ? "count zero" : "count"
                    }`}
                    data-count="1"
                    onClick={() => {
                      {
                        data.dmRejected == 0
                          ? ""
                          : getDataBsedGrpah(data, "DM Rejected");
                      }
                    }}
                  >
                    {data.dmRejected}
                  </a>
                ))}
              </div>
            </div>

            <div className="tvline">&nbsp;</div>
          </div>

          <div style={{ clear: "both" }}></div>

          <hr id="tline" size="1" />

          <div className="bCircle">
            <div className="bvline">&nbsp;</div>

            <div className="circle">
              <div className="text">
                {graphData.billingtslist.map((data, index) => (
                  <a
                    key={index}
                    className={`${data.pmReview == 0 ? "count zero" : "count"}`}
                    data-count="1"
                    onClick={() => {
                      {
                        data.pmReview == 0
                          ? ""
                          : getDataBsedGrpah(data, "In PM Review");
                      }
                    }}
                  >
                    {data.pmReview}
                  </a>
                ))}
              </div>
            </div>
            <div className="label">PM Review</div>
          </div>

          <div className="bCircle">
           

            <div className="bvline">&nbsp;</div>

            <div className="circle">
              <div className="text">
                {graphData.billingtslist.map((data, index) => (
                  <a
                    key={index}
                    className={`${
                      data.finReview == 0 ? "count zero" : "count"
                    }`}
                    data-count="1"
                    onClick={() => {
                      {
                        data.finReview == 0
                          ? ""
                          : getDataBsedGrpah(data, "In Finance Review");
                      }
                    }}
                  >
                    {data.finReview}
                  </a>
                ))}
              </div>
            </div>
            <div className="label">Finance Review</div>
          </div>
          <div className="bCircle">
            <div className="bvline">&nbsp;</div>
            <div className="circle">
              <div className="text">
                {graphData.billingtslist.map((data, index) => (
                  <a
                    key={index}
                    className={`${
                      data.finRejected == 0 ? "count zero" : "count"
                    }`}
                    data-count="1"
                    onClick={() => {
                      {
                        data.finRejected == 0
                          ? ""
                          : getDataBsedGrpah(data, "Finance Rejected");
                      }
                    }}
                  >
                    {data.finRejected}
                  </a>
                ))}
              </div>
            </div>
            <div className="label">Finance Rejected</div>
          </div>
          <div className="bCircle">
            <div className="bvline">&nbsp;</div>
            <div className="circle">
              <div className="text">
                {graphData.billingtslist.map((data, index) => (
                  <a
                    key={index}
                    className={`${
                      data.finAccepted == 0 ? "count zero" : "count"
                    }`}
                    data-count="1"
                    onClick={() => {
                      {
                        data.finAccepted == 0
                          ? ""
                          : getDataBsedGrpah(data, "Finance Accepted");
                      }
                    }}
                  >
                    {data.finAccepted}
                  </a>
                ))}
              </div>
            </div>
            <div className="label">Finance Accepted</div>
          </div>
        </div> */}
        <div className="flowBox">
          <div className="flowContainer">
            <div className="flowItem">
              <div className="flowItemHeader">PM Review</div>
              <div className="flowItemContent">
                {graphData?.billingtslist?.length > 0 ? (
                  graphData.billingtslist.map((data, index) => (
                    <a
                      key={index}
                      className={`${
                        data.pmReview == 0 ? "count zero" : "count"
                      }`}
                      data-count="1"
                      onClick={() => {
                        {
                          data.pmReview == 0
                            ? ""
                            : getDataBsedGrpah(graphData, "In PM Review");
                        }
                      }}
                    >
                      {data.pmReview}
                    </a>
                  ))
                ) : (
                  <a className={"count zero"} data-count="1">
                    {0}
                  </a>
                )}
              </div>
            </div>
            <div className="flowItem">
              <div className="flowItemHeader">DM Review</div>
              <div className="flowItemContent">
                {graphData?.billingtslist?.length > 0 ? (
                  graphData.billingtslist.map((data, index) => {
                    return (
                      <a
                        key={index}
                        className={`${
                          data.dmReview === 0 ? "count zero" : "count"
                        }`}
                        data-count="1"
                        onClick={(e) => {
                          {
                            data.dmReview === 0
                              ? ""
                              : getDataBsedGrpah(graphData, "In DM Review");
                          }
                        }}
                      >
                        {data.dmReview}
                      </a>
                    );
                  })
                ) : (
                  <a className={"count zero"} data-count="1">
                    {0}
                  </a>
                )}
              </div>
            </div>
            <div className="flowItem">
              <div className="flowItemHeader">DM Rejected</div>
              <div className="flowItemContent">
                {graphData?.billingtslist?.length > 0 ? (
                  graphData.billingtslist.map((data, index) => (
                    <a
                      key={index}
                      className={`${
                        data.dmRejected == 0 ? "count zero" : "count"
                      }`}
                      data-count="1"
                      onClick={() => {
                        {
                          data.dmRejected == 0
                            ? ""
                            : getDataBsedGrpah(graphData, "DM Rejected");
                        }
                      }}
                    >
                      {data.dmRejected}
                    </a>
                  ))
                ) : (
                  <a className={"count zero"} data-count="1">
                    {0}
                  </a>
                )}
              </div>
            </div>
            <div className="flowItem">
              <div className="flowItemHeader">Finance Review</div>
              <div className="flowItemContent">
                {graphData?.billingtslist?.length > 0 ? (
                  graphData.billingtslist.map((data, index) => (
                    <a
                      key={index}
                      className={`${
                        data.finReview == 0 ? "count zero" : "count"
                      }`}
                      data-count="1"
                      onClick={() => {
                        {
                          data.finReview == 0
                            ? ""
                            : getDataBsedGrpah(graphData, "In Finance Review");
                        }
                      }}
                    >
                      {data.finReview}
                    </a>
                  ))
                ) : (
                  <a className={"count zero"} data-count="1">
                    {0}
                  </a>
                )}
              </div>
            </div>
            <div className="flowItem">
              <div className="flowItemHeader">Finance Rejected</div>
              <div className="flowItemContent">
                {graphData?.billingtslist?.length > 0 ? (
                  graphData.billingtslist.map((data, index) => (
                    <a
                      key={index}
                      className={`${
                        data.finRejected == 0 ? "count zero" : "count"
                      }`}
                      data-count="1"
                      onClick={() => {
                        {
                          data.finRejected == 0
                            ? ""
                            : getDataBsedGrpah(graphData, "Finance Rejected");
                        }
                      }}
                    >
                      {data.finRejected}
                    </a>
                  ))
                ) : (
                  <a className={"count zero"} data-count="1">
                    {0}
                  </a>
                )}
              </div>
            </div>
            <div className="flowItem">
              <div className="flowItemHeader">Finance Accepted</div>
              <div className="flowItemContent">
                {graphData?.billingtslist?.length > 0 ? (
                  graphData.billingtslist.map((data, index) => (
                    <a
                      key={index}
                      className={`${
                        data.finAccepted == 0 ? "count zero" : "count"
                      }`}
                      data-count="1"
                      onClick={() => {
                        {
                          data.finAccepted == 0
                            ? ""
                            : getDataBsedGrpah(graphData, "Finance Accepted");
                        }
                      }}
                    >
                      {data.finAccepted}
                    </a>
                  ))
                ) : (
                  <a className={"count zero"} data-count="1">
                    {0}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
      {/* ) : (
        ""
      )} */}
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
      {showtable == true ? (
        <FixedPriceOpenFirstTable
          formData={formData}
          setStorefirstTab={setStorefirstTab}
          storeFirstTab={storeFirstTab}
          firstTabledata={firstTabledata}
          storegrpahname={storegrpahname}
          showtable={showtable}
          visibleTable={visibleTable}
          setVisibleTable={setVisibleTable}
          setFirstTabledata={setFirstTabledata}
          setFirstTableData={setFirstTableData}
          firstTableData={firstTableData}
          showSecTable={showSecTable}
          setShowSecTable={setShowSecTable}
          getGraph={getGraph}
          getDataBsedGrpah={getDataBsedGrpah}
          PMReview={PMReview}
          setPMReview={setPMReview}
          DMReview={DMReview}
          setDMReview={setDMReview}
          FMReview={FMReview}
          setFMReview={setFMReview}
          EMReview={EMReview}
          isSQA={isSQA}
          isDM={isDM}
          setAddmsg={setAddmsg}
          // addmsg={addmsg}
          setValidationMessage={setValidationMessage}
          // isAdmin={isAdmin}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default FixedPriceOpen;
