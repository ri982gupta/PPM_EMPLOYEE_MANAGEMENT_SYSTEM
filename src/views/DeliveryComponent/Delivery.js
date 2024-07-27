import React from "react";
import EngagementOpen from "./EngagementOpen";
import DeliveryCreate from "./DeliveryCreate";
import VendorOpen from "../VendorComponent/VendorOpen";
import AutoComplete from "../VendorComponent/VendorOpenAuto";
import { BiSearch } from "react-icons/bi";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { useState } from "react";
import "../VendorComponent/VendorOpen.scss";
import { Link } from "react-router-dom";
import { GoGraph, GoThreeBars } from "react-icons/go";
import { IoWarningOutline } from "react-icons/io5";
import axios from "axios";
import { environment } from "../../environments/environment";
import EngagementSearch from "./EngagementSearch";
import DeliveryDashboard from "./DeliveryDashboard";
import EnguagementsProjects from "./EnagementsProjects";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import { useEffect } from "react";
const CreateHelpPDFName = "CreateEngagement.pdf";
const CreateHeadername = "Engagement Create Help";

const SearchHelpPDFName = "SearchEngagement.pdf";
const SearchHeadername = "Engagement Search Help";

const HelpPDFName = "Eng.pdf";
const Headername = "Engagement Open Help";
import {
  FaChevronCircleUp,
  FaChevronCircleDown,
  FaSearch,
} from "react-icons/fa";

function Delivery() {
  const [validationmessage, setValidationMessage] = useState(false);
  const [aid, setAid] = useState(1);
  const [autoCompleteValidation, setAutoCompleteValidation] = useState("");
  const [engagementData, setEngagementData] = useState([]);

  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [accessLevel, setAccessLevel] = useState(false);

  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);

  const [btnState, setbtnState] = useState("Open");
  const [engagementTableData, setEngagementTableData] = useState([]);
  const [data, setData] = useState([]);
  const [access, setAccess] = useState([]);
  let data1;
  const [buttonValue, setButtonValue] = useState("Engagement");
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [permission, setPermission] = useState([]);
  const [routes, setRoutes] = useState([]);

  let textContent = "Delivery";
  let currentScreenName = ["Engagements  > Engagement Search History"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;

  const getMenus = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const getData = resp.data;
        const deliveryItem = getData[7]; // Assuming "Delivery" item is at index 7

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
        getData.forEach((item) => {
          if (item.display_name === textContent) {
            setRoutes([item]);
            sessionStorage.setItem("displayName", item.display_name);
          }
        });

        const engagementSearchSubMenu = getData
          .find((item) => item.display_name === "Delivery")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Engagement Search"
          );

        // Extract the access_level value
        const accessLevel = engagementSearchSubMenu
          ? engagementSearchSubMenu.access_level
          : null;
      });
  };
  useEffect(() => {
    getMenus();
  }, []);

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
        getUrlPathEngOpen();
      })
      .catch(function (response) {});
  };
  useEffect(() => {
    getEngagementTableData();
  }, []);
  const getUrlPathEngOpen = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/search/userEngagementHistory&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  useEffect(() => {
    if (btnState === "Search") {
      setVisible(false);
      setCheveronIcon(FaChevronCircleUp);
    }
  }, [btnState]);

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
      }).then((success) => {
        console.log(success);
      });
    }
  };
  const handleSearchButtonClick = () => {
    setAccessLevel(true);
    setTimeout(() => {
      setAccessLevel(false);
    }, 1000);
  };

  const menus = () => {
    axios({
      method: "GET",
      url:
        baseUrl +
        `/CommonMS/master/getBenchMtericsMenus?loggedUserId=${loggedUserId}&Cont=engagement`,
    }).then((res) => {
      // const data = res.data;
      const data = res.data;
      setPermission(data);
    });
  };
  const getEngagementData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getEngagementNameandId`,
    })
      .then(function (response) {
        var resp = response.data;
        setEngagementData(resp);
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
      axios({
        method: "post",
        url: baseUrl + `/VendorMS/vendor/updateUserSearchHistory`,
        data: {
          userId: loggedUserId,
          objectId: vendorId,
        },
      }).then((success) => {
        console.log(success);
      });
    }
  };

  useEffect(() => {
    menus();
    getEngagementData();
  }, []);
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne">
            <div className="tabsProject" style={{ margin: "3px" }}>
              {permission.map((button) => (
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
                  {/* clg */}

                  {button.display_name}
                </button>
              ))}
            </div>
          </div>
          {btnState == "Open" ? (
            <>
              <div className="childTwo">
                <h2> {`${buttonValue} Search History`}</h2>
              </div>

              <div className="childThree toggleBtns">
                <GlobalHelp pdfname={HelpPDFName} name={Headername} />
              </div>
            </>
          ) : btnState === "Create" ? (
            <>
              <div className="childTwo">
                {data1 === undefined ? (
                  <h2>Create Engagement</h2>
                ) : (
                  <h2>Engagements</h2>
                )}
              </div>

              <div className="childThree toggleBtns">
                <GlobalHelp
                  pdfname={CreateHelpPDFName}
                  name={CreateHeadername}
                />
              </div>
            </>
          ) : btnState === "Search" ? (
            <>
              <div className="childTwo">
                <h2>Engagement Search</h2>
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
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* {btnState === "open" ? <EngagementOpen /> : ""} */}
      {btnState === "Create" ? <DeliveryCreate /> : ""}
      {btnState === "Open" && (
        <>
          <div className="col-6 my-2 no-padding">
            {engagementTableData.length > 0 || data.length > 0 ? (
              <div className="body body-bg col-xs-12 col-sm-12 col-md-12 col-lg-12 customCard">
                <div className="form-group cvu darkHeader">
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
                                    {
                                      accessLatest.length > 0
                                        ? handleProjectSelect(list.id)
                                        : console.log("lisrr");
                                    }
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

                      {buttonValue == "Engagement" && (
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
                      )}

                      {/* ---------------------------------- */}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // </div>
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
                      // vendorListData={vendorListData}
                      setAutoCompleteData={setAutoCompleteData}
                      handleSelect={handleSelect}
                      buttonValue={buttonValue}
                      // projectData={projectData}
                      setAccess={setAccess}
                      aid={aid}
                      setAid={setAid}
                      autoCompleteValidation={autoCompleteValidation}
                      handleEngagementSelect={handleEngagementSelect}
                      engagementData={engagementData}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {btnState === "Search" ? (
        <EngagementSearch
          maxHeight1 = {maxHeight1}
          setCheveronIcon={setCheveronIcon}
          visible={visible}
          setVisible={setVisible}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default Delivery;
