import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaCheck,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import moment from "moment";
import { environment } from "../../environments/environment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { BiCheck } from "react-icons/bi";
import Loader from "../Loader/Loader";
import FixedPriceCreateTable from "./FixedPriceCreateTable";
import { AiFillWarning } from "react-icons/ai";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { ImCross } from "react-icons/im";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function FixedPriceCreate(props) {
  const [checkboxSelect, setCheckboxSelect] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [state, setState] = useState({
    prjId: "",
    TsName: "",
    StartDt: "",
    EndDt: "",
    month: "",
  });
  const [StartDt, setStartDt] = useState();
  const [EndDt, setEndDt] = useState();
  const [BillingCycle, setBillingCycle] = useState("null");
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [data, setData] = useState([]);
  const [addmsg, setAddmsg] = useState(false);
  const [searching, setsearching] = useState(false);
  const [message, setMessage] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [projectvalidation, setProjectValidation] = useState(false);
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(true);
  const abortController = useRef(null);

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Time & Expenses";
  let currentScreenName = ["Fixed Price - Create"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  const baseUrl = environment.baseUrl;
  const ref = useRef([]);
  const value = "FixedPrice-Create";
  let rows = 25;
  const HelpPDFName = "FixedPriceCreateTimesheet.pdf";
  const Header = "Generate Billing Timesheet Help";
  var date = new Date();
  var FromDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const FDate = moment(FromDate).format("yyyy-MM-DD");
  let StartDate =
    StartDt == null ? FDate : moment(StartDt).format("yyyy-MM-DD");
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const lDate = moment(lastDay).format("yyyy-MM-DD");
  let EndDate =
    BillingCycle == "Monthly"
      ? moment(StartDt).endOf("month").format("yyyy-MM-DD")
      : EndDt == null
      ? lDate
      : moment(EndDt).format("yyyy-MM-DD");

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setState((prevProps) => ({ ...prevProps, [name]: value }));
  };

  const [dataAccess, setDataAccess] = useState([]);

  // ----------------------axios for getting details in to the table----------------------------------
  const gettabledata = () => {
    StartDate = moment(StartDt).startOf("month").format("yyyy-MM-DD");
    EndDate = moment(StartDt).endOf("month").format("yyyy-MM-DD");

    setsearching(false);
    abortController.current = new AbortController();

    axios({
      method: "Get",
      url:
        baseUrl +
        `/timeandexpensesms/fixedprice/gettabledata?fromdate=${StartDate}&todate=${EndDate}`,
      signal: abortController.current.signal,
    }).then((resp) => {
      let tabledata = resp.data;
      let header = [
        {
          Department: "Department",
          Customer: "Customer",
          Project: "Project",
          status: "Status",
        },
      ];
      let hData = header.concat(tabledata);
      setData(hData);
      setTimeout(() => {
        setsearching(false);
      }, 1000);
    });
  };

  useEffect(() => {
    gettabledata();
  }, [BillingCycle == "Monthly" && StartDt != null ? StartDt : " "]);

  useEffect(() => {
    gettabledata();
  }, []);

  //axios for creating new timesheet
  const handleCreate = async () => {
    let filteredData = ref.current.filter((d) => d != null);
    ref.current = filteredData;
    let valid = GlobalValidation(ref);
    !valid ? checkedData.length != 0 && setVisible(!visible) : "";

    if (valid) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      return;
    } else if (checkedData.length == 0) {
      setProjectValidation(true);
      setTimeout(() => {
        setProjectValidation(false);
      }, 3000);
      return;
    } else {
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      state["prjId"] = checkedData.toString();
      if (BillingCycle === "Weekly" && state["EndDt"] === "") {
        state["EndDt"] = moment(StartDt).add(6, "days").format("yyyy-MM-DD");
      } else if (BillingCycle === "Bi-Weekly" && state["EndDt"] === "") {
        state["EndDt"] = moment(StartDt).add(13, "days").format("yyyy-MM-DD");
      } else if (state["EndDt"] === "") {
        state["EndDt"] = moment(StartDt).endOf("month").format("yyyy-MM-DD");
      } else {
        state["EndDt"] = state["EndDt"];
      }

      axios({
        method: "post",
        url: baseUrl + `/timeandexpensesms/fixedprice/posttimesheet`,
        data: state,
      }).then((resp) => {
        setMessage(resp.data[0].message.split("-")[1]);
        setAddmsg(true);
        setTimeout(() => {
          setAddmsg(false);
        }, 3000);
        if (message.includes("already exists")) {
          return;
        } else {
          setCheckboxSelect([]);
          setCheckedData([]);
          gettabledata();
        }
      });
    }
  };

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/billingTimesheet/generateBillingTimesheet";
      getUrlPath(modifiedUrlPath);
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
      const TMExpensesSubMenu = data
        .find((item) => item.display_name === "Time & Expenses")
        .subMenus.find(
          (subMenu) => subMenu.display_name === "Fixed Price - Create"
        );

      // Extract the access_level value
      const accessLevel = TMExpensesSubMenu
        ? TMExpensesSubMenu.access_level
        : null;

      setDataAccess(accessLevel);
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };

  useEffect(() => {
    getMenus();
  }, []);
  //axios for deleting the timesheet

  const deletetimesheet = () => {
    state["prjId"] = checkedData;
    let filteredData = ref.current.filter((d) => d != null);
    ref.current = filteredData;
    let valid = GlobalValidation(ref);
    if (valid) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      return;
    } else if (checkedData.length == 0) {
      setProjectValidation(true);
      setTimeout(() => {
        setProjectValidation(false);
      }, 3000);
      return;
    }

    axios({
      method: "delete",
      url:
        baseUrl +
        `/timeandexpensesms/fixedprice/deletetimesheet?fromdate=${StartDate}&project_id=${checkedData}`,
    }).then((resp) => {
      setDeleteMessage(true);
      setTimeout(() => {
        setDeleteMessage(false);
      }, 3000);
      setCheckboxSelect([]);
      setCheckedData([]);
      gettabledata();
    });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };
  return (
    <div>
      <div className="col-md-12">
        {deleteMessage && selectedData.includes("pending") ? (
          <div className="statusMsg error">
            <AiFillWarning />
            {"Cannot delete billing timesheet in pending status"}
          </div>
        ) : deleteMessage ? (
          <div className="statusMsg success">
            <BiCheck
              size="1.4em"
              color="green"
              strokeWidth={{ width: "100px" }}
            />
            &nbsp;
            {"Billing TimeSheet Deleted Successfully"}
          </div>
        ) : projectvalidation ? (
          <div className="statusMsg error">
            <AiFillWarning />
            {"Please Select Project"}
          </div>
        ) : validationMessage ? (
          <div className="statusMsg error">
            <AiFillWarning />
            {"Please select the valid values for highlighted fields"}
          </div>
        ) : addmsg && message.includes("already exists") ? (
          <div className="statusMsg error">
            <AiFillWarning />
            {message}
          </div>
        ) : addmsg ? (
          <div className="statusMsg success">
            <BiCheck
              size="1.4em"
              color="green"
              strokeWidth={{ width: "100px" }}
            />
            &nbsp;
            {message}
          </div>
        ) : (
          ""
        )}

        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Generate Billing Timesheet</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={Header} />
          </div>
        </div>
      </div>
      <div className="group  customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row mb-2">
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="BillingCycle">
                  Billing Cycle
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="BillingCycle"
                    name="BillingCycle"
                    defaultValue={null}
                    onChange={(e) => {
                      setBillingCycle(e.target.value);
                    }}
                  >
                    <option value="null">
                      &lt;&lt; Please Select &gt;&gt;{" "}
                    </option>
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="TsName">
                  Timesheet Name
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <input
                    name="TsName"
                    type="text"
                    id="TsName"
                    placeholder=""
                    required
                    onChange={handleChange}
                    value={state.TsName}
                  />
                </div>
              </div>
            </div>
            {BillingCycle == "Bi-Weekly" ? (
              <>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="StartDt">
                      Billing Start Date&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className=" datepicker col-6"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <DatePicker
                        className="StartDt"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        selected={StartDt}
                        onChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            ["StartDt"]: moment(e).format("yyyy-MM-DD"),
                            ["EndDt"]: moment(StartDt)
                              .add(13, "days")
                              .format("yyyy-MM-DD"),
                          }));
                          setStartDt(e);
                          setIsEndDateEnabled(false);
                        }}
                        placeholderText={"Billing Start Date"}
                        dateFormat="dd-MMM-yyyy"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="EndDt">
                      Billing End Date&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className=" datepicker col-6"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <DatePicker
                        className={
                          StartDt?.length != 0 ? "invoicedisable" : "EndDt"
                        }
                        selected={
                          state.StartDt === ""
                            ? EndDt
                            : moment(StartDt).add(13, "days")._d
                        }
                        onChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            ["EndDt"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setEndDt(e);
                        }}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        placeholderText={"Billing End Date"}
                        dateFormat="dd-MMM-yyyy"
                        disabled={!isEndDateEnabled}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : BillingCycle == "Weekly" ? (
              <>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="StartDt">
                      Billing Start Date&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className=" datepicker col-6"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <DatePicker
                        className="StartDt"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        selected={StartDt}
                        onChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            ["StartDt"]: moment(e).format("yyyy-MM-DD"),
                            ["EndDt"]: moment(StartDt)
                              .add(6, "days")
                              .format("yyyy-MM-DD"),
                          }));
                          setStartDt(e);
                          setIsEndDateEnabled(false);
                        }}
                        placeholderText={"Billing Start Date"}
                        dateFormat="dd-MMM-yyyy"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row ">
                    <label className="col-5" htmlFor="EndDt">
                      Billing End Date&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className=" datepicker col-1 p-0">:</span>
                    <div
                      className="datepicker col-6"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <DatePicker
                        className="EndDt"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        selected={
                          state.StartDt == ""
                            ? EndDt
                            : moment(StartDt).add(6, "days")._d
                        }
                        onChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            ["EndDt"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setEndDt(e);
                        }}
                        placeholderText={"Billing End Date"}
                        dateFormat="dd-MMM-yyyy"
                        disabled={!isEndDateEnabled}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : BillingCycle == "Monthly" ? (
              <>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="StartDt">
                      Month&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className=" datepicker col-6"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <DatePicker
                        className="StartDt"
                        selected={StartDt}
                        onChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            ["StartDt"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setStartDt(e);
                          gettabledata();
                          setIsEndDateEnabled(false);
                        }}
                        placeholderText={"Billing Start Date"}
                        dateFormat="MMM-yyyy"
                        showMonthYearPicker
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="StartDt">
                      Billing Start Date&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="  col-1 p-0">:</span>
                    <div
                      className=" datepicker col-6"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <DatePicker
                        className="StartDt"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        selected={StartDt}
                        minDate={StartDt}
                        onChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            ["StartDt"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setStartDt(e);
                          setIsEndDateEnabled(false);
                        }}
                        placeholderText={"Billing Start Date"}
                        dateFormat="dd-MMM-yyyy"
                      />
                    </div>
                  </div>
                </div>{" "}
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="EndDt">
                      Billing End Date&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="datepicker col-6"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <DatePicker
                        className="EndDt"
                        showMonthDropdown
                        showYearDropdown
                        minDate={EndDt}
                        dropdownMode="select"
                        selected={EndDt}
                        onChange={(e) => {
                          setState((prev) => ({
                            ...prev,
                            ["EndDt"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setEndDt(e);
                        }}
                        placeholderText={"Billing End Date"}
                        dateFormat="dd-MMM-yyyy"
                        {...(BillingCycle != "" ? (
                          <>disabled={!isEndDateEnabled}</>
                        ) : (
                          ""
                        ))}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {dataAccess === 1000 ? (
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2 ">
                <button
                  type="button"
                  className="btn btn-primary"
                  title="Search"
                  onClick={handleCreate}
                >
                  <FaCheck /> Create{" "}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  title="Cancel"
                  onClick={deletetimesheet}
                >
                  <ImCross fontSize={"11px"} /> Cancel{" "}
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </CCollapse>
        <div className="mt-2">
          <FixedPriceCreateTable
            data={data}
            checkedData={checkedData}
            setCheckedData={setCheckedData}
            value={value}
            rows={rows}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            checkboxSelect={checkboxSelect}
            setCheckboxSelect={setCheckboxSelect}
            dataAccess={dataAccess}
            maxHeight={maxHeight1}
            fileName="FixedPriceCreate"
          />
          {searching ? <Loader handleAbort={handleAbort} /> : ""}
        </div>
      </div>
    </div>
  );
}

export default FixedPriceCreate;
