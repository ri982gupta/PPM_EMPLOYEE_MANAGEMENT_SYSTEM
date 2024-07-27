import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { environment } from "../../../environments/environment";
import moment from "moment";
import GlobalValidation from "../../ValidationComponent/GlobalValidation";
import CellRendererPrimeReactDataTable from "../../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { AiFillWarning } from "react-icons/ai";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import Loader from "../../Loader/Loader";

function ExpensesView({ urlState }) {
  const [startDate, setStartDate] = useState("");
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const [endDate, setEndDate] = useState();
  const [employeeData, setEmployeeData] = useState([]);
  let [currency, setCurrency] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [details, setDetails] = useState({
    currancyId: "",
    startDate: "",
    endDate: "",
  });
  let [currancyId, setCurrancyId] = useState([]);
  const [searching, setSearching] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [vendorNamesArr, setVendorNamesArr] = useState();
  let rows = 4;
  const tableStyle = { border: "1px solid silver", borderRadius: "3px" };
  const baseUrl = environment.baseUrl;

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Time & Expenses";
  let currentScreenName = ["Expenses", "View Foreign Exchange Rates"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const getMenus = () => {
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
    getMenus();
    getCurrency();
    getUrlPath();
  }, []);
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/projectExpense/viewForeignExchangeRate/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getapiData = async () => {
    setSearching(true);

    const response = await axios.get(
      `${baseUrl}/timeandexpensesms/expenses/getforex?id=${currancyId}&startDate=${moment(
        startDate
      ).format("yyyy-MM-DD")}&endDate=${moment(endDate).format("yyyy-MM-DD")}`
    );

    const data = await response.data;
    let headerData = [
      {
        description: "Currency",
        currency_date: "Date",
        value_of_usd: "USD to Local",
        value_in_usd: "Local to USD",
      },
    ];
    setTimeout(() => {
      setSearching(false);
      //let fData = [...headerData, ...data];

      setEmployeeData(data);
      setValidationMessage(false);
    }, 1000);

    for (let i = 0; i < data.length; i++) {
      data[i]["currency_date"] =
        data[i]["currency_date"] == null
          ? ""
          : moment(data[i]["currency_date"]).format("DD-MMM-yyyy");
    }
    setLoader(false);
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const getCurrency = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getCurrency`,
    }).then((res) => {
      let curre = res.data;
      setCurrency(curre);
    });
  };
  const changeHandler = () => {
    let valid = GlobalValidation(ref);

    if (valid == true) {
      setValidationMessage(true);
    }
    abortController.current = new AbortController();
    if (valid) {
      return;
    }
    setLoader(false);
    getapiData();
  };
  const ref = useRef([]);
  const LinkTemplate = (data) => {
    return (
      <>
        <div style={{ float: "left" }}>{data.value_of_usd}</div>
      </>
    );
  };

  const LinkTemplateAction = (data) => {
    return (
      <>
        <div style={{ float: "left" }}>{data.value_in_usd}</div>
      </>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "value_of_usd"
            ? LinkTemplate
            : col == "value_in_usd" && LinkTemplateAction
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  console.log("data", employeeData);
  return (
    <div>
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please Select Highlighted field values
        </div>
      ) : (
        ""
      )}
      <div>
        <div className="group mb-3 customCard">
          <div className="group-content row">
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country-select">
                  Currency<span style={{ color: "red" }}>&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="country-select"
                    className="text"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    onChange={(e) => {
                      setCurrancyId(e.target.value);
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {currency.map((data) =>
                      data.currency === "US Dollar(USD)" ? (
                        ""
                      ) : (
                        <option value={data.id}>{data.currency}</option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  Begin Date<span style={{ color: "red" }}>&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 datepicker"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <DatePicker
                    dropdownMode="select"
                    dateFormat="dd-MMM-yyyy"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText={"Begin Date"}
                    showMonthDropdown
                    showYearDropdown
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  End Date<span style={{ color: "red" }}>&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 datepicker"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <DatePicker
                    dropdownMode="select"
                    dateFormat="dd-MMM-yyyy"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText={"End Date"}
                    showMonthDropdown
                    showYearDropdown
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 no-padding center mb-2">
              {
                <div className="col-md-12 col-sm-12 col-xs-12 btn-container center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    title="Search"
                    onClick={(e) => {
                      changeHandler();
                    }}
                  >
                    <BiSearch /> Search
                  </button>
                </div>
              }
              {loader ? <Loader handleAbort={handleAbort} /> : ""}
            </div>
            <div className="darkHeader">
              <div className="col-md-12 ">
                <DataTable
                  value={employeeData}
                  showGridlines
                  paginator
                  rows={25}
                  sortMode="multiple"
                  style={tableStyle}
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column
                    field="description"
                    header="Currency"
                    align="center"
                    sortable
                    style={{ width: "25%" }}
                  ></Column>
                  <Column
                    field="currency_date"
                    header="Date"
                    align="center"
                    sortable
                    style={{ width: "25%" }}
                  ></Column>
                  <Column
                    field="value_of_usd"
                    header="USD to Local"
                    align="center"
                    sortable
                    style={{ width: "25%" }}
                  ></Column>
                  <Column
                    field="value_in_usd"
                    header="Local to USD"
                    align="center"
                    sortable
                    style={{ width: "25%" }}
                  ></Column>
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpensesView;
