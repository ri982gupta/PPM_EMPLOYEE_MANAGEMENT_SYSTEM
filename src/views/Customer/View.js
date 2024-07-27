import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
// import "primeflex/primeflex.css";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import moment from "moment";
import InvoicingSearchTable from "../InvoiceComponent/InvoicingSearchTable";
import Loader from "../Loader/Loader";
import { environment } from "../../environments/environment";
import { FilterMatchMode } from "primereact/api";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { IoWarningOutline } from "react-icons/io5";

function View() {
  const [invoicecycles, setInvoiceCycles] = useState([]);
  const [contractterms, setContractTerms] = useState([]);
  const [timesheet, settimesheet] = useState([]);
  const [invsts, setinvsts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const loggedUserId = localStorage.getItem("resId");
  const [tableData, setTableData] = useState([]);
  const [searchApi, setSearchApi] = useState([]);
  const [filterVal, setFilterVal] = useState("");
  const [timesheetDisable, setTimesheetDisable] = useState("");
  const [searchstringvalue, setSearchstringvalue] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const ref = useRef([]);
  const abortController = useRef(null);

  const initialValue = {
    searchstring: "",
    contractterms: "",
    invoiceNo: "",
    invoicecycle: "",
    timesheetstatus: "-1",
    fromDate: "",
    toDate: "",
    invoiceStatus: "",
    datefrom: "",
    dateto: "",
  };
  const [formData, setFormData] = useState(initialValue);
  const [date, SetDate] = useState();
  const [todate, SettoDate] = useState();
  const [dateTo, SetDateTo] = useState();
  const [datefrom, SetDatefrom] = useState();
  const [displaystate, SetDisplaystate] = useState(false);
  const [loaderState, setLoaderState] = useState(false);
  const [selectcontractterms, setSelectContractTerms] = useState([]);
  const [selecttimesheet, setSelecttimesheet] = useState([]);
  const [selectinvsts, setSelectinvsts] = useState([]);
  const [invstsdisable, setinvstsDisable] = useState([]);

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const baseUrl = environment.baseUrl;

  const getContractterms = () => {
    axios
      .get(baseUrl + `/customersms/Customersearch/getInvoicecontractterms`)
      .then((Response) => {
        let countries = [];
        let fdata = Response.data;
        fdata.length > 0 &&
          fdata.forEach((e) => {
            let contractobj = {
              label: e.lkup_name,
              value: e.id,
            };
            countries.push(contractobj);
          });
        setContractTerms(countries);
      });
  };
  const getTimeSheetStatus = () => {
    axios
      .get(baseUrl + `/customersms/Customersearch/getTimeSheetStatus`)
      .then((Response) => {
        let time = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let timeobj = {
              label: e.lkup_name,
              value: e.id,
            };
            time.push(timeobj);
          });
        settimesheet(time);
      });
  };

  const getInvoiceStatus = () => {
    axios
      .get(baseUrl + `/customersms/Customersearch/getinvoiceStatus`)
      .then((Response) => {
        let inv = [];
        let fdata = Response.data;
        fdata.length > 0 &&
          fdata.forEach((e) => {
            let invobj = {
              label: e.lkup_name,
              value: e.id,
            };
            inv.push(invobj);
          });
        setinvsts(inv);
        // setSelectinvsts(inv);
      });
  };
  const getinvoiceCycle = () => {
    axios
      .get(baseUrl + `/customersms/Customersearch/getInvoiceCycle`)
      .then((Response) => {
        let tdata = Response.data;
        const sortedcities = tdata.sort(function (a, b) {
          var nameA = a.lkup_name.toUpperCase();

          var nameB = b.lkup_name.toUpperCase();

          if (nameA < nameB) {
            return -1; //nameA comes first
          }

          if (nameA > nameB) {
            return 1; // nameB comes first
          }

          return 0; // names must be equal
        });
        setInvoiceCycles(sortedcities);
      });
  };

  const getInvoiceTable = () => {
    const loaderTime = setTimeout(() => {
      setLoaderState(true);
    }, 2000);
    setLoaderState(false);
    axios({
      method: "post",
      url: baseUrl + `/VendorMS/invoice/getinvoiceTable`,
      data: {
        searchString: formData.searchstring == "" ? -1 : formData.searchstring,
        fromDt: formData.datefrom == "" ? -1 : formData.datefrom,
        toDt: formData.dateto == "" ? -1 : formData.dateto,
        invoiceStatus:
          formData.invoiceStatus == "" ? -1 : formData.invoiceStatus,
        terms: formData.contractterms == "" ? -1 : formData.contractterms,
        invoiceNo: formData.invoiceNo == "" ? -1 : formData.invoiceNo,
        billingStatus:
          formData.billingStatus == "" ? -1 : formData.billingStatus,
        billingFromDt: formData.fromDate == "" ? -1 : formData.fromDate,
        billingToDt: formData.toDate == "" ? -1 : formData.toDate,
        invoiceCycle:
          formData.invoicecycle == "" ? null : formData.invoicecycle,
        UserId: loggedUserId,
      },

      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        const data = response.data.data;
        setTableData(data);
        setSearchApi(data);
        setLoaderState(false);
        clearTimeout(loaderTime);
        SetDisplaystate(true);

        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((error) => {});
  };
  const handleClick = (e) => {
    GlobalCancel(ref);

    if (formData.fromDate === "" || formData.toDate === "") {
      let valid = GlobalValidation(ref);

      if (valid) {
        {
          setValidationMessage(true);
          return;
        }
      }
    } else {
      setValidationMessage(false);
      getInvoiceTable();
      // setLoaderState(true);
      // abortController.current = new AbortController();
    }
  };
  const handleClickInvoice = (e) => {
    GlobalCancel(ref);
    // if (formData.datefrom === "" || formData.dateto === "") {
    //   let valid = GlobalValidation(ref);

    //   if (valid) {
    //     {
    //       setValidationMessage(true);
    //       return;
    //     }
    //   }
    // } else {
    //   setValidationMessage(false);
    getInvoiceTable();
    // setLoaderState(true);
    // abortController.current = new AbortController();

    // SetDisplaystate(true);
    // }
  };
  const handleClickTimesheet = (e) => {
    getInvoiceTable();
    // setLoaderState(true);
    // abortController.current = new AbortController();

    // SetDisplaystate(true);
  };
  useEffect(() => {
    getContractterms();
    getinvoiceCycle();
    getTimeSheetStatus();
    getInvoiceStatus();
  }, []);

  const handleFilter = (e) => {
    setFormData((prevVal) => ({
      ...prevVal,
      ["searchstring"]: e.target.value,
    }));
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };
  console.log(invstsdisable);

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Search Invoice</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      {validationMessage && timesheetDisable > 0 ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Please select highlighted field values{" "}
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader">
          <h2>Search Filters</h2>
          <div className="helpBtn"></div>
          <div className="saveBtn"></div>
          &nbsp;
          <div
            onClick={() => {
              setVisible(!visible);
              visible
                ? setCheveronIcon(FaChevronCircleUp)
                : setCheveronIcon(FaChevronCircleDown);
            }}
          >
            <span>{cheveronIcon}</span>
          </div>
        </div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-12 mb-2">
              <div className="form-group row">
                <label className="col-4" htmlFor="searchstring">
                  <b>Search String</b>
                  <i style={{ fontSize: "11px" }}>
                    (Customer/Division/Proj Name/Proj Code/PO#){" "}
                  </i>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-7">
                  <input
                    type="text"
                    className="col-12 cancel"
                    id="searchstring"
                    placeholder
                    required
                    onChange={(e) => handleFilter(e)}
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="contractterms">
                  Contract Terms
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="contractterms"
                    options={contractterms}
                    hasSelectAll={true}
                    value={selectcontractterms}
                    valueRenderer={(selected) => {
                      if (selected.length === 0) {
                        return "<< Please Select >>";
                      } else {
                        return `${selected.length} selected`;
                      }
                    }}
                    // valueRenderer={ContractValueRenderer}
                    disabled={false}
                    onChange={(e) => {
                      setSelectContractTerms(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["contractterms"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="invoice">
                  Invoice #{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    className="cancel"
                    id="invoiceNo"
                    placeholder
                    required
                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["invoiceNo"]: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="invoicecycle">
                  Invoice Cycle
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="cancel"
                    name="invoicecycle"
                    id="invoicecycle"
                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["invoicecycle"]: e.target.value,
                      }));
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {invoicecycles?.map((Item) => (
                      <option key={Item.id} value={Item.id}>
                        {Item.lkup_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="timesheetstatus">
                  Timesheet Status{" "}
                </label>
                <span className="col-1 p-0">:</span>

                <div className="col-6 ">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="timesheetstatus"
                    options={timesheet}
                    hasSelectAll={true}
                    disabled={invstsdisable > 0 ? true : false}
                    value={selecttimesheet}
                    valueRenderer={(selected) => {
                      if (selected.length === 0) {
                        return "<< Please Select >>";
                      } else {
                        return `${selected.length} selected`;
                      }
                    }}
                    className="disableField"
                    onChange={(e) => {
                      setSelecttimesheet(e);
                      let filteredtimesheet = [];
                      e.forEach((d) => {
                        filteredtimesheet.push(d.value);
                      });

                      setTimesheetDisable(filteredtimesheet.length);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["timesheetstatus"]: filteredtimesheet.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="fromdate">
                  From Date{" "}
                  {timesheetDisable > 0 ? (
                    <span className="error-text">*</span>
                  ) : (
                    ""
                  )}
                </label>
                <span className="col-1 p-0">:</span>
                {timesheetDisable > 0 ? (
                  <div
                    className="col-6 datepicker"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <DatePicker
                      name="fromDate"
                      id="fromDate"
                      selected={date}
                      disabled={invstsdisable > 0 ? true : false}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(e) => {
                        SetDate(e);
                        setFormData((prev) => ({
                          ...prev,
                          ["fromDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                      }}
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                {timesheetDisable <= 0 ? (
                  <div className="col-6">
                    <DatePicker
                      name="fromDate"
                      id="fromDate"
                      selected={date}
                      disabled={invstsdisable > 0 ? true : false}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(e) => {
                        SetDate(e);
                        setFormData((prev) => ({
                          ...prev,
                          ["fromDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                      }}
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="todate ">
                  To Date{" "}
                  {timesheetDisable > 0 ? (
                    <span className="error-text">*</span>
                  ) : (
                    ""
                  )}
                </label>
                <span className="col-1 p-0">:</span>
                {timesheetDisable > 0 ? (
                  <div
                    className="col-6 datepicker"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <DatePicker
                      name="toDate"
                      id="toDate"
                      disabled={invstsdisable > 0 ? true : false}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={todate}
                      minDate={date}
                      onChange={(e) => {
                        SettoDate(e);
                        setFormData((prev) => ({
                          ...prev,
                          ["toDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        // setMonth(e);
                      }}
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                {timesheetDisable <= 0 ? (
                  <div className="col-6">
                    <DatePicker
                      name="toDate"
                      id="toDate"
                      disabled={invstsdisable > 0 ? true : false}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      selected={todate}
                      minDate={date}
                      onChange={(e) => {
                        SettoDate(e);
                        setFormData((prev) => ({
                          ...prev,
                          ["toDate"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        // setMonth(e);
                      }}
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="invoicestatus">
                  Invoice Status
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="invoiceStatus"
                    options={invsts}
                    hasSelectAll={true}
                    className="disableField"
                    disabled={timesheetDisable > 0 ? true : false}
                    // disabled={timesheetDisable.length > 0 ? true : false}
                    value={selectinvsts}
                    valueRenderer={(selected) => {
                      if (selected.length === 0) {
                        return "<< Please Select >>";
                      } else {
                        return `${selected.length} selected`;
                      }
                    }}
                    // valueRenderer={InvoiceValueRenderer}
                    onChange={(e) => {
                      setSelectinvsts(e);
                      let filteredinv = [];
                      e.forEach((d) => {
                        filteredinv.push(d.value);
                      });
                      setinvstsDisable(filteredinv.length);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["invoiceStatus"]: filteredinv.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="fromdate">
                  From Date{" "}
                </label>
                <span className="col-1 p-0">:</span>
                {invstsdisable > 0 ? (
                  <div
                    className="col-6 datepicker"
                    // ref={(ele) => {
                    //   ref.current[0] = ele;
                    // }}
                  >
                    <DatePicker
                      name="datefrom"
                      id="datefrom"
                      disabled={timesheetDisable > 0 ? true : false}
                      selected={datefrom}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(e) => {
                        SetDatefrom(e);
                        setFormData((prev) => ({
                          ...prev,
                          ["datefrom"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        // setMonth(e);
                      }}
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                {invstsdisable <= 0 ? (
                  <div className="col-6">
                    <DatePicker
                      name="datefrom"
                      id="datefrom"
                      className="invoicedisable"
                      disabled={timesheetDisable > 0 ? true : false}
                      selected={datefrom}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(e) => {
                        SetDatefrom(e);
                        setFormData((prev) => ({
                          ...prev,
                          ["datefrom"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        // setMonth(e);
                      }}
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="todate ">
                  To Date{" "}
                </label>
                <span className="col-1 p-0">:</span>
                {invstsdisable > 0 ? (
                  <div
                    className="col-6 datepicker"
                    // ref={(ele) => {
                    //   ref.current[1] = ele;
                    // }}
                  >
                    <DatePicker
                      name="dateto"
                      id="dateto"
                      className="invoicedisable"
                      disabled={timesheetDisable > 0 ? true : false}
                      selected={dateTo}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(e) => {
                        SetDateTo(e);
                        setFormData((prev) => ({
                          ...prev,
                          ["dateto"]: moment(e).format("yyyy-MM-DD"),
                        }));
                      }}
                      minDate={datefrom}
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
                {invstsdisable <= 0 ? (
                  <div className="col-6">
                    <DatePicker
                      name="dateto"
                      id="dateto"
                      disabled={timesheetDisable > 0 ? true : false}
                      selected={dateTo}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      onChange={(e) => {
                        SetDateTo(e);
                        setFormData((prev) => ({
                          ...prev,
                          ["dateto"]: moment(e).format("yyyy-MM-DD"),
                        }));
                        // setMonth(e);
                      }}
                      minDate={datefrom}
                      dateFormat="dd-MMM-yyyy"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              {invstsdisable > 0 ? (
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => {
                    handleClickInvoice();
                    SetDisplaystate(false);
                  }}
                >
                  <FaSearch />
                  Search
                </button>
              ) : timesheetDisable > 0 ? (
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => {
                    handleClick();
                    SetDisplaystate(false);
                  }}
                >
                  <FaSearch />
                  Search
                </button>
              ) : timesheetDisable <= 0 && invstsdisable <= 0 ? (
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => {
                    handleClickTimesheet();
                    SetDisplaystate(false);
                  }}
                >
                  <FaSearch />
                  Search
                </button>
              ) : null}
            </div>
          </div>
        </CCollapse>
      </div>

      <div className="col-md-12">
        {loaderState ? (
          <div className="loaderBlock">
            <Loader handleAbort={handleAbort} />
          </div>
        ) : (
          ""
        )}
        {displaystate === true ? (
          <InvoicingSearchTable
            tableData={tableData}
            setTableData={setTableData}
            formData={formData}
            loaderState={loaderState}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default View;
