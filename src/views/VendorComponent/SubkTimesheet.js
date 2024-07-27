import React, { useEffect, useRef, useState } from "react";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import { CCollapse } from "@coreui/react";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import VendorManagementFilters from "./VendorManagementFilters";
import SubkTimesheetTable from "./SubkTimesheetTable";
import Loader from "../Loader/Loader";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { BiCheck } from "react-icons/bi";

function SubkTimsheet(props) {
  const { manageTabs, setManageTabs } = props;
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [selectedVendorid, setSelectedVendorId] = useState(-1);
  const vendorSelectBox = "VendorSelect";
  const [custVisible, setCustVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([{}]);
  const [visible, setVisible] = useState(false);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [vendorStatusOptions, setVendorStatusOptions] = useState([]);
  const [contarctorNames, setContarctorNames] = useState([]);
  const [selectedContractornames, setSelectedContractorNames] = useState([]);
  const [date, setDate] = useState(new Date());
  const [tableData, setTableData] = useState([]);
  const [dispTable, setDispTable] = useState(false);
  const [searching, setsearching] = useState(false);
  const loggedUserId = localStorage.getItem("resId");
  const [columnState, setColumnState] = useState("-1");
  const [routes, setRoutes] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [contractterms, setContractTerms] = useState([]);
  const [selectcontractterms, setSelectContractTerms] = useState([]);
  const dispatch = useDispatch();
  let textContent = "Vendors";
  let currentScreenName = [" Subk Timesheet"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const ref = useRef([]);
  const abortController = useRef(null);
  let flag = 3;
  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"));
  const idList = selectedCust?.map((item) => item.id);
  const idString = idList?.join(",");
  const initialValue = {
    vendorId: "",
    country: "1,2,3,4,5,6,7",
    vendorStatus: "",
    subkIds: "",
    measures: "-1",
    FromDt: moment(date).startOf("month").format("yyyy-MM-DD"),
    contTerms: "-1",
  };
  const [formData, setFormData] = useState(initialValue);
  const baseUrl = environment.baseUrl;
  const customValueRenderer = (selected, _options) => {
    return selected.length === country.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    const allValues = allOptions.map((item) => item.value);

    if (
      selectedValues.length !== 0 &&
      selectedValues.length === allValues.length
    ) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

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
        const valuesToRemove = [611, 610, 609, 608, 612, 607, 1024];
        countries = countries.filter(
          (country) => !valuesToRemove.includes(country.value)
        );
        countries.sort((a, b) => a.label.localeCompare(b.label));
        setContractTerms(countries);
        setSelectContractTerms(countries);
      });
  };

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      //   const modifiedUrlPath = "/vmg/vmg";
      //   getUrlPath(modifiedUrlPath);

      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
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
      //   return updatedMenuData;
    });
  };

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)

      .then((Response) => {
        let countries = [];

        let data = Response.data;
        data.length > 0 &&
          data?.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            countries.push(countryObj);
          });
        setCountry(countries.filter((e) => e.value != 4));
        setSelectedCountry(countries.filter((e) => e.value != 4));
      })
      .catch((error) => console.log(error));
  };

  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/VendorMS/vendor/vendorContarctors`,
    }).then(function (response) {
      let countries = [];
      var res = response.data;
      res.length > 0 &&
        res.forEach((e) => {
          let countryObj = {
            label: e.name,
            value: Number(e.id) + 1,
          };
          countries.push(countryObj);
        });
      countries.sort((a, b) => a.label.localeCompare(b.label));
      setContarctorNames(countries);
      setSelectedContractorNames(countries);
    });
  };

  const getVendorStatusOptions = () => {
    axios({
      url: baseUrl + `/VendorMS/vendor/getVendorStatus`,
    }).then((resp) => {
      resp.data.unshift({
        lkup_name: "<< ALL >>",
        id: -1,
        lkup_type_group_id: 0,
      });
      setVendorStatusOptions(resp.data);
      setFormData((prevVal) => ({
        ...prevVal,
        ["vendorStatus"]: resp.data[0].id,
      }));
    });
  };
  useEffect(() => {
    getMenus();
    getCountries();

    getContractterms();
    getData();
    getVendorStatusOptions();
  }, []);

  useEffect(() => {
    let countryList = [];
    country.forEach((d) => {
      countryList.push(d.value);
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["country"]: countryList.toString(),
    }));
  }, [country]);

  const handleChange1 = (e) => {
    setSelectedVendorId(e.target.value);
    const { id, name, value } = e.target;
    if (name == "vendorId" && value == "select") {
      // setFormData((prev) => {
      //   return { ...prev, [name]: value };
      // });
      setCustVisible(true);
    }
  };

  const searchHandle = () => {
    let valid = GlobalValidation(ref);
    if (valid || (idString == "" && selectedVendorid == "select")) {
      {
        setValidationMessage(true);
      }
      return;
    }
    setValidationMessage(false);
    setDispTable(false);
    setTableData([]);
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setsearching(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + `/VendorMS/subkTimesheet/getTimeSheetDetails`,
      signal: abortController.current.signal,
      data: {
        vendorId: selectedVendorid == -1 ? -1 : idString,
        country: formData.country,
        vendorStatus: formData.vendorStatus,
        subkIds:
          formData.subkIds === ""
            ? -1
            : formData.subkIds.length == 14687
            ? -1
            : formData.subkIds,
        measures: formData.measures,
        FromDt: formData.FromDt,
        contTerms:
          formData?.contTerms == "28,27,752,606,26,25,750"
            ? "-1"
            : formData?.contTerms,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        var resp = response.data;
        resp.sort((a, b) => {
          if (a.resource === "Summary") return -1; // "Summary" comes first
          if (b.resource === "Summary") return 1; // "Summary" comes first
          return a.resource.localeCompare(b.resource); // Sort alphabetically for other resources
        });
        // resp.sort((a, b) => a.resource.localeCompare(b.resource));
        setDispTable(true);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        if (resp.length > 1) {
          setTableData(resp);
        }
        if (formData.measures == "-1") {
          setColumnState("-1");
        } else if (formData.measures == "apr") {
          setColumnState("apr");
        } else if (formData.measures == "act") {
          setColumnState("act");
        } else if (formData.measures == "inv") {
          setColumnState("inv");
        } else if (formData.measures == "RRcost") {
          setColumnState("RRcost");
        } else if (formData.measures == "RecRevenue") {
          setColumnState("RecRevenue");
        }
        clearTimeout(loaderTime);
        setsearching(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  //==========Again get Data after Saving===============
  const searchHandle1 = () => {
    abortController.current = new AbortController();
    const loaderTime = setTimeout(() => {
      setsearching(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + `/VendorMS/subkTimesheet/getTimeSheetDetails`,
      signal: abortController.current.signal,
      data: {
        vendorId: selectedVendorid == -1 ? -1 : idString,
        country: formData.country,
        vendorStatus: formData.vendorStatus,
        subkIds:
          formData.subkIds === ""
            ? -1
            : formData.subkIds.length == 14687
            ? -1
            : formData.subkIds,
        measures: formData.measures,
        FromDt: formData.FromDt,
        contTerms:
          formData.contTerms ==
          "28,27,752,606,26,25,1024,607,612,608,609,610,611,750"
            ? "-1"
            : formData.contTerms,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      var resp = response.data;
      // resp.sort((a, b) => a.resource.localeCompare(b.resource));
      resp.sort((a, b) => {
        if (a.resource === "Summary") return -1; // "Summary" comes first
        if (b.resource === "Summary") return 1; // "Summary" comes first
        return a.resource.localeCompare(b.resource); // Sort alphabetically for other resources
      });
      setDispTable(true);
      if (resp.length > 1) {
        setTableData(resp);
      }
      if (formData.measures == "-1") {
        setColumnState("-1");
      } else if (formData.measures == "apr") {
        setColumnState("apr");
      } else if (formData.measures == "act") {
        setColumnState("act");
      } else if (formData.measures == "inv") {
        setColumnState("inv");
      } else if (formData.measures == "RRcost") {
        setColumnState("RRcost");
      } else if (formData.measures == "RecRevenue") {
        setColumnState("RecRevenue");
      }
      clearTimeout(loaderTime);
      setsearching(false);
    });
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
  };

  return (
    <div>
      <div className="pageTitle">
        <div className="childOne">
          <div className="tabsProject">
            <button
              className={
                manageTabs === "SubkManagement"
                  ? "buttonDisplayClick"
                  : "buttonDisplay"
              }
              onClick={() => {
                setManageTabs("SubkManagement");
              }}
            >
              Subk Management
            </button>
            <button
              className={
                manageTabs === "Timesheet"
                  ? "buttonDisplayClick"
                  : "buttonDisplay"
              }
              onClick={() => {
                setManageTabs("Timesheet");
              }}
            >
              Subk Timesheets
            </button>
          </div>
        </div>
        <div className="childTwo">
          <h2>Subk Timesheets</h2>
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
        </div>
      </div>
      <div class="group customCard">
        <div className="col-md-12 collapseHeader"></div>
        {validationMessage ? (
          <div className="statusMsg error">
            <IoWarningOutline />
            {"Please select valid values for highlighted fields"}
          </div>
        ) : (
          ""
        )}
        {addmsg ? (
          <div className="statusMsg success">
            {" "}
            <span className="errMsg">
              <BiCheck size="1.4em" /> &nbsp; Timesheet Saved Successfully
            </span>
          </div>
        ) : (
          ""
        )}
        <CCollapse visible={!visible}>
          <div class="group-content row ">
            <>
              <div className="form-group row mt-2">
                <div className="col-md-3 mb-2 ">
                  <div className=" form-group row">
                    <label className="col-5 ">
                      Vendor Name&nbsp;
                      <span className="required error-text">*</span>{" "}
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6 multiselect" id="Vendors">
                      <select
                        className={
                          validationMessage &&
                          selectedVendorid == "select" &&
                          idString == ""
                            ? "error-block cancel Text"
                            : "cancel Text"
                        }
                        name="vendorId"
                        id="vendorId"
                        onChange={handleChange1}
                      >
                        {selectedItems.length + "selected"}
                        <option value={-1} selected>
                          {" "}
                          &lt;&lt;ALL&gt;&gt;
                        </option>
                        <option value="select">Select</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row ">
                    <label className="col-5  ">
                      Country &nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                      id="countryids"
                    >
                      <MultiSelect
                        id="country"
                        ArrowRenderer={ArrowRenderer}
                        options={country}
                        hasSelectAll={true}
                        value={selectedCountry}
                        disabled={false}
                        valueRenderer={customValueRenderer}
                        onChange={(e) => {
                          setSelectedCountry(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["country"]: filteredCountry.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2 ">
                  <div className="form-group row">
                    <label className="col-5 ">Vendor Status &nbsp;</label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6 " id="status">
                      <select
                        id="statusId"
                        onChange={(e) => {
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["vendorStatus"]: e.target.value,
                          }));
                        }}
                        className="text cancel "
                        ref={(ele) => {
                          ref.current[1] = ele;
                        }}
                        name="vendorStatus"
                      >
                        {vendorStatusOptions.map((option) => (
                          <option
                            key={option.id}
                            value={option.id}
                            selected={formData?.vendorStatus === option.id}
                          >
                            {option.lkup_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2 ">
                  <div className="form-group row">
                    <label className="col-5 ">
                      Resource
                      <span className="required error-text ml-1"> *</span>{" "}
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                      id="subkIds"
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="subkIds"
                        options={contarctorNames}
                        hasSelectAll={true}
                        value={selectedContractornames}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        selected={selectedContractornames}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedContractorNames(e);
                          let filteredCustomer = [];
                          e.forEach((d) => {
                            filteredCustomer.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["subkIds"]: filteredCustomer.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5 ">Measures </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <select
                        id="measures"
                        name="measures"
                        defaultValue={"approved"}
                        onChange={(e) => {
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["measures"]: e.target.value,
                          }));
                        }}
                      >
                        <option value="-1">&lt;&lt;ALL&gt;&gt;</option>
                        <option value="apr">Approved</option>
                        <option value="inv">Invoiceable</option>
                        <option value="act">Actual</option>
                        {/* <option value="cost">Cost</option> */}
                        <option value="RRcost">RR Cost</option>
                        <option value="RecRevenue">Recognized</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5">Month </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6 ">
                      <DatePicker
                        id="FromDt"
                        maxDate={moment(new Date())._d}
                        onChange={(e) => {
                          setDate(e);
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["FromDt"]: moment(e).format("yyyy-MM-DD"),
                          }));
                        }}
                        selected={moment(date)._d}
                        dateFormat="MMM-yyyy"
                        showMonthYearPicker
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2 ">
                  <div className="form-group row">
                    <label className="col-5 ">
                      Contract Terms &nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                      id="subkIds"
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="contTerms"
                        options={contractterms}
                        value={selectcontractterms}
                        hasSelectAll={true}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setSelectContractTerms(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["contTerms"]: filteredCountry.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 " align="center">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    searchHandle();
                  }}
                >
                  <FaSearch />
                  Search
                </button>
              </div>
            </>
          </div>
        </CCollapse>
        {searching ? <Loader handleAbort={handleAbort} /> : ""}
        <SelectCustDialogBox
          visible={custVisible}
          setVisible={setCustVisible}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          flag={flag}
          vendorSelectBox={vendorSelectBox}
        />
        {dispTable && (
          <SubkTimesheetTable
            tableData={tableData}
            setTableData={setTableData}
            formData={formData}
            setsearching={setsearching}
            columnState={columnState}
            searchHandle1={searchHandle1}
            setAddmsg={setAddmsg}
          />
        )}
        {manageTabs == "SubkManagement" && (
          <VendorManagementFilters
            urlState={urlState}
            buttonState={buttonState}
            setButtonState={setButtonState}
            setUrlState={setUrlState}
            manageTabs={manageTabs}
            setManageTabs={setManageTabs}
          />
        )}
      </div>
    </div>
  );
}
export default SubkTimsheet;
