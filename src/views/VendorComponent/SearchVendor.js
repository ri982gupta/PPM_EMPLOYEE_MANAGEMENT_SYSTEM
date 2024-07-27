import React, { useState, useEffect, useRef } from "react";
import "./Search.scss";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import SearchDefaultTable from "./SearchDefaultTable";
import DatePicker from "react-datepicker";
import moment from "moment/moment";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import InitialParentVendorTabs from "./IntialParentVendorTabs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";

function SearchVendor({ urlState, buttonState, setButtonState, setUrlState }) {
  const [searching, setSearching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [VendorName, setVendorName] = useState([]);
  const [date, SetDate] = useState(null);
  const tableDataView = "vendorSearchTable";
  const [data, SetData] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const abortController = useRef(null);
  const [loaderState, setLoaderState] = useState(false);
  const [vendorStatusOptions, setVendorStatusOptions] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedVendorid, setSelectedVendorId] = useState(-1);
  const [custVisible, setCustVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([{}]);
  let flag = 3;
  const vendorSelectBox = "VendorSelect";
  const [idString, setIdString] = useState("");
  useEffect(() => {
    const selectedCust = JSON.parse(localStorage.getItem("selectedCust"));
    const idList = selectedCust?.map((item) => item.name);
    let idStrings = idList?.join(",");
    setIdString(idStrings);
  }, [custVisible]);

  const ref = useRef([]);
  const initialValue = {
    VendoreName: "",
    country: "-1",
    operator: -1,
    date: null,
    Status: "-1",
  };

  const HelpPDFName = "VMG_Search_Ver_1.0.pdf";
  const Headername = "Vendor Search Help";

  const [formData, setFormData] = useState(initialValue);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };

  // useEffect(() => {
  //   const materialTableElement = document.getElementsByClassName("pageTitle");

  //   if (materialTableElement) {
  //     const offsetTop = materialTableElement[0].offsetTop;
  //     const newMaxHeight = Math.max(100, window.innerHeight - offsetTop);
  //     console.log(newMaxHeight, "newMaxHeightnewMaxHeight");

  //     setIsSetMaxHeight(false);
  //     setMaxHeight(newMaxHeight);
  //     if(isSetMaxHeight){
  //       setTimeout(()=>{
  //         setMaxHeight()
  //       },1000)
  //     }

  //   } else {
  //     console.log('row else block');
  //   }
  // }, [maxHeight]);
  const materialTableElement = document.getElementsByClassName("pageTitle");

  const maxHeight = useDynamicMaxHeight(materialTableElement, "fixedcreate");

  const [routes, setRoutes] = useState([]);
  let textContent = "Vendors";
  let currentScreenName = ["Vendors", "VMG Search"];

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
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
    });
  };

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  useEffect(() => {
    axios({
      url: baseUrl + `/VendorMS/vendor/getVendorStatus`,
    })
      .then((resp) => {
        let data = resp.data?.slice(0, 2);
        setVendorStatusOptions(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleClick = async () => {
    GlobalCancel(ref);
    if (
      (formData.operator == "ge" && formData.date == null) ||
      (formData.operator == "le" && formData.date == null) ||
      (formData.operator == "eq" && formData.date == null)
    ) {
      let valid = GlobalValidation(ref);

      if (valid) {
        {
          setValidationMessage(true);
        }
        return;
      }
      setSearching(false);
    } else {
      setValidationMessage(false);
      setLoaderState(false);
      abortController.current = new AbortController();
      await axios({
        method: "post",
        url: baseUrl + `/VendorMS/vendor/getVendoreSearchDtls`,
        signal: abortController.current.signal,
        data: {
          VendoreName: selectedVendorid == -1 ? "-1" : idString,
          country: formData.country == "" ? -1 : formData.country,
          operator: formData.operator,
          date:
            formData.operator == "-1"
              ? null
              : formData.date == null
              ? ""
              : formData.date,
          Status: formData.Status,
        },
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        const data = response.data;
        const Headerdata = [
          {
            vendorId: "Vendor ID",
            vendor_name: "Vendor Name",
            contactName: "Contact Name",
            phone: "Phone",
            email: "Email",
            contryName: "Country",
            nxtRvwDt: "Next Review Date",
            signedDt: "Contract Signed Date",
            expireDt: "Contract Expires Date",
            website: "Website",
            Action: "Action",
          },
        ];
        let data1 = ["vendor_name", "Action"];
        let linkRoutes = ["/vendor/vendorDoc/:id", "/vendor/reviews/:id"];
        setLinkColumns(data1);
        setLinkColumnsRoutes(linkRoutes);
        if (formData.operator == "-1") {
          SetDate();
        }
        const sortedData = data.sort(function (a, b) {
          const isNaA = a.contryName === "NA";
          const isNaB = b.contryName === "NA";
          if (isNaA && !isNaB) {
            return -1; // a comes before b
          } else if (!isNaA && isNaB) {
            return 1; // b comes before a
          } else {
            const nameA = a.vendorId.toUpperCase();
            const nameB = b.vendor_name.toUpperCase();
            if (nameA < nameB) {
              return -1; // a comes before b
            } else if (nameA > nameB) {
              return 1; // b comes before a
            } else {
              return 0; // names are equal
            }
          }
        });
        SetData(Headerdata.concat(sortedData));
        setSearching(true);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        //setLoaderState(false);
        setTimeout(() => {
          setLoaderState(false);
        }, 1000);
      });
    }
  };

  useEffect(() => {}, [data]);

  const baseUrl = environment.baseUrl;
  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            e.country_name == "NM" ? "" : countries.push(countryObj);
          });
        setCountry(countries);
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };
  const loggedUserId = localStorage.getItem("resId");

  const getVendorneName = () => {
    axios
      .get(baseUrl + `/VendorMS/vendor/getVendorNames`)
      .then(function (response) {
        var response = response.data;
        let states = [];
        response?.forEach((e) => {
          let stateObj = {
            label: e.name,
            value: e.name,
          };
          states.push(stateObj);
        });
        states.sort((a, b) => a.label.localeCompare(b.label));

        setVendorName(states);
        setSelectedState(states);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getMenus();
    getCountries();
    getVendorneName();
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
  const practice = [
    { id: "-1", value: "<Please Select>" },
    { id: "le", value: "≤" },
    { id: "ge", value: "≥" },
    { id: "eq", value: "=" },
  ];
  const onChangePractice = (e) => {
    const { id, name, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const DateChange = (e) => {
    SetDate(e);
    let formattedFromDate = moment(e).format("YYYY-MM-DD");
    setFormData({ ...formData, date: formattedFromDate });
  };

  const ArrowRenderer = ({ expanded }) => (
    <>
      {" "}
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const handleClear = () => {
    setFormData((prev) => ({ ...prev, VendoreName: "" }));
  };
  const handleChange1 = (e) => {
    setSelectedVendorId(e.target.value);
    const { id, name, value } = e.target;
    if (name == "customerIds" && value == "select") {
      setCustVisible(true);
    }
  };

  return (
    <div>
      <div className="pageTitle">
        <div className="childOne">
          <div className="tabsProject">
            <InitialParentVendorTabs
              buttonState={buttonState}
              setButtonState={setButtonState}
              setUrlState={setUrlState}
            />
          </div>
        </div>
        <div className="childTwo">
          <h2>VMG Search</h2>
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
      <div className="col-md-12  mt-2">
        {validationMessage ? (
          <div className="statusMsg error">
            {" "}
            <span>
              {" "}
              <IoWarningOutline /> Please select the valid values for
              highlighted fields{" "}
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="group mb-3 customCard ">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="VendorName">
                  Vendors
                  <span className="required error-text ml-1"> *</span>{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className={
                      idString == "" &&
                      selectedVendorid == "select" &&
                      validationMessage
                        ? "error-block cancel text"
                        : "cancel text"
                    }
                    name="customerIds"
                    id="customerIds"
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
              <div className="form-group row">
                <label className="col-5">Country </label>
                <span className="col-1 p-0">:</span>
                <span className="col-6">
                  <MultiSelect
                    id="country"
                    ArrowRenderer={ArrowRenderer}
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    disabled={false}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<< All>>",
                    }}
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
                    valueRenderer={(selected) => {
                      if (selected.length === 0) {
                        return "Select";
                      } else {
                        return `${selected.length} selected`;
                      }
                    }}
                  />
                </span>
              </div>
            </div>
            <div className=" col-md-6 mb-2">
              <div className="form-group row">
                <div className="col-3">
                  <label>Next Review Date </label>
                </div>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div className="form-group row">
                    <div className="col-6 p-0 ">
                      <select
                        id="operator"
                        name="operator"
                        onChange={onChangePractice}
                      >
                        <option value="-1">
                          &lt;&lt;Please Select&gt;&gt;
                        </option>
                        <option value="le">≤</option>
                        <option value="ge">≥</option>
                        <option value="eq">=</option>
                      </select>
                    </div>

                    {formData.operator == "-1" ? (
                      <div className="col-6 ">
                        <div
                          className="datepicker"
                          ref={(ele) => {
                            ref.current[0] = ele;
                          }}
                          style={{ position: "relative", zIndex: "999" }}
                        >
                          <DatePicker
                            className="disableField"
                            selected={date}
                            id="date"
                            dateFormat="dd-MMM-yyyy"
                            value=""
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            onChange={(e) => DateChange(e)}
                            placeholderText="Date"
                            disabled={true}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {formData.operator == "le" ? (
                      <div className="col-6 ">
                        <div
                          className="datepicker"
                          ref={(ele) => {
                            ref.current[0] = ele;
                          }}
                          style={{ position: "relative", zIndex: "999" }}
                        >
                          <DatePicker
                            selected={date}
                            dateFormat="dd-MMM-yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            onChange={(e) => DateChange(e)}
                            placeholderText="Date"
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {formData.operator == "ge" ? (
                      <div className="col-6 ">
                        <div
                          className="datepicker"
                          ref={(ele) => {
                            ref.current[0] = ele;
                          }}
                          style={{ position: "relative", zIndex: "999" }}
                        >
                          <DatePicker
                            selected={date}
                            dateFormat="dd-MMM-yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            onChange={(e) => DateChange(e)}
                            placeholderText="Date"
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    {formData.operator == "eq" ? (
                      <div className="col-6 ">
                        <div
                          className="datepicker"
                          ref={(ele) => {
                            ref.current[0] = ele;
                          }}
                          style={{ position: "relative", zIndex: "999" }}
                        >
                          <DatePicker
                            selected={date}
                            dateFormat="dd-MMM-yyyy"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            onChange={(e) => DateChange(e)}
                            placeholderText="Date"
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5 ">
                  Vendor Status &nbsp;
                  {/* <span className="required error-text">*</span> */}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 " id="status">
                  <select
                    id="statusId"
                    className="text cancel "
                    onChange={(e) =>
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["Status"]: e.target.value,
                      }))
                    }
                    name="vendorStatus"
                  >
                    <option key="-1" value="-1">
                      &lt;&lt;ALL&gt;&gt;
                    </option>
                    {vendorStatusOptions.map((option) => (
                      <option
                        key={option.id}
                        value={option.id}
                        selected={formData?.Status === option.id}
                      >
                        {option.lkup_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      <SelectCustDialogBox
        // dataAccess={dataAccess}
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        flag={flag}
        vendorSelectBox={vendorSelectBox}
      />
      {searching ? (
        <div className="darkHeader vendor-VMG-search-table">
          <SearchDefaultTable
            data={data}
            SetData={SetData}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            loaderState={loaderState}
            handleAbort={handleAbort}
            maxHeight={maxHeight}
            tableDataView={tableDataView}
          />
        </div>
      ) : (
        " "
      )}
    </div>
  );
}
export default SearchVendor;
