import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { environment } from "../../../environments/environment";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { BiCheck, BiSave } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import moment from "moment";
import ErrorLogGlobalValidation from "../../Administration/Errorlogvalidation";
import { IoWarningOutline } from "react-icons/io5";

function ExpensesAdd({ urlState }) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [currency, setCurrency] = useState([]);
  const [currencyId, setCurrencyId] = useState([]);
  const [usd, setUsd] = useState([]);
  const [localVal, setLocalVal] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [tableDisable, setTableDisable] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const ref = useRef([]);
  const [message, setMessage] = useState(false);
  const [currencyName, setCurrencyName] = useState("");
  const [saveButton, setSaveButton] = useState(true);
  const [dateCheck, setDateCheck] = useState(false);
  const [usdCheck, setUsdCheck] = useState(false);
  const [localCheck, setLocalCheck] = useState(false);
  const [saveCheck, setSaveCheck] = useState(true);
  const [tableDataChange, setTableDataChange] = useState(false);

  const baseUrl = environment.baseUrl;

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Time & Expenses";
  let currentScreenName = ["Expenses", "Add Foreign Exchange Rates"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);

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
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/projectExpense/foreignXchangeVal/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
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

  useEffect(() => {
    const name = currency
      .filter((c) => c.id == currencyId)
      .map((c) => c.currency);
    setCurrencyName(name[0]);
  }, [currencyId]);

  const getDates = (startDate, endDate) => {
    const dates = [];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toLocaleDateString("en-CA");
      dates.push(dateString);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const handleExchangeTab = () => {
    let valid = ErrorLogGlobalValidation(ref);
    if (valid) {
      {
        setValidationMessage(true);
        setTimeout(() => {
          setValidationMessage(false);
        }, 3000);
      }
      return;
    }
    if (endDate.getTime() < startDate.getTime()) {
      setDateCheck(true);
      setTimeout(() => {
        setDateCheck(false);
      }, 3000);
      return;
    }
    if (isNaN(usd)) {
      setUsdCheck(true);
      setTimeout(() => {
        setUsdCheck(false);
      }, 3000);
      return;
    }
    if (isNaN(localVal)) {
      setLocalCheck(true);
      setTimeout(() => {
        setLocalCheck(false);
      }, 3000);
      return;
    }

    setDates(getDates(startDate, endDate));
    setShowTable(true);
  };

  useEffect(() => {
    handleCurrency();
  }, []);

  const handleUSD = (e) => {
    setUsd(e.target.value);
  };

  const handleLOCAL = (e) => {
    setLocalVal(e.target.value);
  };

  const tableData = dates.map((d, i) => {
    return {
      id: i + 1,
      date: moment(d).format("DD-MMM-YYYY"),
      usdofvalue: usd,
      usdinvalue: localVal,
    };
  });

  const handleSelection = (e) => {
    console.log(e.value);
    setSelectedRows(e.value);
  };

  const inputOne = (rowData) => {
    return selectedRows.map((d) => d.id).includes(rowData.id) && saveButton ? (
      <input
        type="text"
        id="usd"
        defaultValue={rowData.usdofvalue}
        onChange={(e) => onchange(e, rowData)}
      />
    ) : (
      rowData.usdofvalue
    );
  };

  const inputTwo = (rowData) => {
    return selectedRows.map((d) => d.id).includes(rowData.id) && saveButton ? (
      <input
        type="text"
        id="local"
        defaultValue={rowData.usdinvalue}
        onChange={(e) => onchange(e, rowData)}
      />
    ) : (
      <div align="right" style={{ placeContent: "end" }}>
        {rowData.usdinvalue}
      </div>
    );
  };

  useEffect(() => {
    setSelectedRowsData((prev) => selectedRows);
  }, [selectedRows]);

  const onchange = (e, rowData) => {
    const index = selectedRowsData.findIndex(
      (selectedRowData) => selectedRowData.id === rowData.id
    );

    const updatedSelectedRowsData = [...selectedRowsData];
    updatedSelectedRowsData[index] = {
      ...updatedSelectedRowsData[index],
      usdofvalue:
        e.target.id === "usd"
          ? e.target.value
          : updatedSelectedRowsData[index].usdofvalue,
      usdinvalue:
        e.target.id === "local"
          ? e.target.value
          : updatedSelectedRowsData[index].usdinvalue,
    };
    setSelectedRowsData(updatedSelectedRowsData);
  };

  const closeTable = (e) => {
    setShowTable(false);
  };

  useEffect(() => {
    if (selectedRows.length > 0) {
      setSaveCheck(false);
    }
    console.log("selected rows: ", selectedRows);
  }, [selectedRows]);

  const sendSelectedRowsData = () => {
    let ele = document.getElementsByClassName("cancel");
    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";

      if (ele[index].classList.contains("reactautocomplete")) {
        ele[
          index
        ].children[0].children[0].children[0].children[0].children[0].children[1].click();
      }
    }

    console.log(selectedRowsData);
    const formattedData = selectedRowsData.map((rowData) => ({
      currencyId: currencyId,
      date: moment(rowData.date).format("YYYY-MM-DD"),
      value_of_usd: rowData.usdofvalue,
      value_in_usd: rowData.usdinvalue,
    }));
    console.log("formated data: ", formattedData);
    axios
      .post(`${baseUrl}/timeandexpensesms/addExpenses`, formattedData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log(res.status);
        console.log(res);
        if (res.status == 200) {
          setTableDisable(true);
          setSaveButton(false);
          setMessage(true);
          setSaveCheck(false);
          var checkboxes = document.getElementsByClassName(
            "p-checkbox-box p-component p-highlight"
          );
          checkboxes[0].setAttribute("class", "p-checkbox-box p-component");
          setTimeout(() => {
            setMessage(false);
          }, 3000);
          setTableDataChange(true);
        }
      })
      .catch((er) => console.log(er));
  };

  let updatedTableData = tableData.map((d) => {
    let selectedRow = selectedRowsData.find((row) => row.id === d.id);
    if (selectedRow) {
      return {
        ...d,
        usdofvalue: selectedRow.usdofvalue,
        usdinvalue: selectedRow.usdinvalue,
      };
    } else {
      return d;
    }
  });

  useEffect(() => {
    if (tableDisable) {
      setStartDate();
      setEndDate();
      console.log("first: ", tableDisable);
    }
  }, [tableDisable]);

  const isSelectable = () => {
    return tableDisable ? false : true;
  };

  return (
    <div>
      {validationMessage ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Please provide the valid values for required
            fields fields{" "}
          </span>
        </div>
      ) : (
        ""
      )}
      {message ? (
        <div className="statusMsg success">
          <span>
            <BiCheck />
            Foreign Exchange Rates For {currencyName} Saved Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {dateCheck ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Please select End Date Greater Than Begin Date{" "}
          </span>
        </div>
      ) : (
        ""
      )}
      {usdCheck ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> USD to Local is Invalid{" "}
          </span>
        </div>
      ) : (
        ""
      )}
      {localCheck ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Local to USD is Invalid{" "}
          </span>
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
                    className="text cancel"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    onChange={(e) => {
                      setCurrencyId(e.target.value);
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
                  Begin Date<span>&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="datepicker position-relative z-3"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <DatePicker
                      dateFormat="dd-MMM-yyyy"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      onKeyDown={(e) => e.preventDefault()}
                      placeholderText={"Begin Date"}
                      selectsStart
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  End Date<span>&nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="datepicker"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <DatePicker
                      dateFormat="dd-MMM-yyyy"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      onKeyDown={(e) => e.preventDefault()}
                      placeholderText={"End Date"}
                      selectsStart
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name">
                  USD to Local<span> &nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="textfield"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <input
                      type="text"
                      className="form-control cancel"
                      id="name"
                      placeholder=""
                      required
                      onChange={handleUSD}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="name">
                  Local to USD<span> &nbsp;*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="textfield"
                    ref={(ele) => {
                      ref.current[4] = ele;
                    }}
                  >
                    <input
                      type="text"
                      className="form-control cancel"
                      id="name"
                      placeholder=""
                      required
                      onChange={handleLOCAL}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                type="button"
                className="btn btn-primary"
                title="Search"
                onClick={handleExchangeTab}
              >
                <FaPlus /> Add{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showTable ? (
        <div className="darkHeader">
          <div className="expensesAdd">
            <DataTable
              value={tableDataChange ? updatedTableData : tableData}
              showGridlines
              scrollable
              scrollHeight="400px"
              selectionMode="checkbox"
              selection={selectedRows}
              onSelectionChange={(e) => handleSelection(e)}
              dataKey="id"
              isDataSelectable={isSelectable}
            >
              <Column
                selectionMode="multiple"
                className={tableDisable ? "not-allowed" : ""}
              ></Column>
              <Column field="date" header="Date"></Column>
              <Column
                field="usdofvalue"
                header="USD to Local"
                body={inputOne}
                bodyClassName="text-right"
              ></Column>
              <Column
                field="usdinvalue"
                header="Local to USD"
                body={inputTwo}
                bodyClassName="text-right"
              ></Column>
            </DataTable>
          </div>

          <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
            <button
              className="btn btn-primary"
              disabled={saveCheck}
              onClick={sendSelectedRowsData}
            >
              <BiSave /> Save
            </button>
            <button className="btn btn-secondary" onClick={closeTable}>
              <span className="logo">
                <ImCross /> Close
              </span>
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ExpensesAdd;
