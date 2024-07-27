import React, { useState, useEffect, useRef } from "react";
import "./Search.scss";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import InitialParentVendorTabs from "./IntialParentVendorTabs";
import { DataTable } from "primereact/datatable";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import Utils from "../../Utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import './ReviewsVendor.scss'
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";


function ReviewsVendor({ urlState, buttonState, setButtonState, setUrlState }) {
  const [searching, setSearching] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [VendorName, setVendorName] = useState([]);
  const [data, SetData] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const abortController = useRef(null);
  const [vendorStatusOptions, setVendorStatusOptions] = useState([]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [skillType, setSkillType] = useState(-1);
  const [colSpan, setColSpan] = useState(3);
  const [colSpanResourceCount, setColSpanResourceCount] = useState(2);
  const vendorSelectBox = "VendorSelect";
  const [custVisible, setCustVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([{}]);
  const [selectedVendorid, setSelectedVendorId] = useState(-1);
  let flag = 3;
  const [loaderState, setLoaderState] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [headerData1, setHeaderData1] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    vendor_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    contryName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    vendorId: { value: null, matchMode: FilterMatchMode.CONTAINS },
    website: { value: null, matchMode: FilterMatchMode.CONTAINS },
    contactName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    phone: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nxtRvwDt: { value: null, matchMode: FilterMatchMode.CONTAINS },
    signedDt: { value: null, matchMode: FilterMatchMode.CONTAINS },
    expireDt: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -92) + "px"
  );
  useEffect(() => {
    setFilters({
      global: filtersData["contains"],
    });
  }, [headerData]);
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);

  const [idString, setIdString] = useState("");
  const [resourcesList, setResourcesList] = useState([]);
  const [resourceTable, setResourceTable] = useState(false);
  const [globalFilterValueTwo, setGlobalFilterValueTwo] = useState("");
  const [filtersTwo, setFiltersTwo] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    resource_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    skills: { value: null, matchMode: FilterMatchMode.CONTAINS },
    department: { value: null, matchMode: FilterMatchMode.CONTAINS },
    start_date: { value: null, matchMode: FilterMatchMode.CONTAINS },
    employee_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
    skill_type: { value: null, matchMode: FilterMatchMode.CONTAINS },
    supervisor: { value: null, matchMode: FilterMatchMode.CONTAINS },
    contract_type: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const filtersData1 = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  useEffect(() => {
    setFiltersTwo({
      global: filtersData1["contains"],
    });
  }, [headerData1]);
  useEffect(() => {
    resourcesList[0] &&
      setHeaderData1(JSON.parse(JSON.stringify(resourcesList[0])));
  }, [resourcesList]);

  const ref = useRef([]);
  const initialValue = {
    VendoreName: "",
    country: "-1",
    Status: "1444",
    skillType: "-1",
  };
  const [formData, setFormData] = useState(initialValue);
  const [resourceStatus, setResourceStatus] = useState(1444);
  const HelpPDFName = "VMG_Search_Ver_1.0.pdf";
  const Headername = "Vendor Search Help";
  const [routes, setRoutes] = useState([]);
  let textContent = "Vendors";
  let currentScreenName = ["Vendors", "VMG Reviews"];
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

  useEffect(() => {
    axios({
      url: baseUrl + `/VendorMS/vendor/getVendorStatus`,
    })
      .then((resp) => {
        let data = resp.data?.slice(0, 2);
        data.unshift({
          lkup_name: "<< ALL >>",
          id: -1,
          lkup_type_group_id: 0,
        });
        setVendorStatusOptions(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const selectedCust = JSON.parse(localStorage.getItem("selectedCust"));
    const idList = selectedCust?.map((item) => item.name);
    Utils.Log(idList);
    let idStrings = idList?.join(",");
    setIdString(idStrings);
  }, [custVisible]);

  const handleChange1 = (e) => {
    setSelectedVendorId(e.target.value);
    const { id, name, value } = e.target;
    if (name == "customerIds" && value == "select") {
      setCustVisible(true);
    }
  };

  const handleClick = async () => {
    setResourceTable(false);

    let valid = GlobalValidation(ref);

    if (valid || (idString == "" && selectedVendorid == "select")) {
      {
        setValidationMessage(true);
      }
      return;
    }

    setSearching(false);
    setValidationMessage(false);
    setLoaderState(false);
    abortController.current = new AbortController();
    const requestBody = {
      VendoreName: selectedVendorid == -1 ? "-1" : idString,
      country: formData.country == "" ? -1 : formData.country,
      Status: formData.Status,
      skillType: formData.skillType,
    };

    await axios
      .post(baseUrl + `/VendorMS/vendor/getVendorReviewDtls`, requestBody)
      .then((response) => {
        const data = response.data;
        data.sort((a, b) => a.vendorId.localeCompare(b.vendorId));
        SetData(data);
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
    if (formData.skillType == 1310) {
      setSkillType(1310);
      setColSpan(1);
    } else if (formData.skillType == 1311) {
      setSkillType(1311);
      setColSpan(1);
    } else if (formData.skillType == -1) {
      setSkillType(-1);
      setColSpan(3);
    } else if (formData.skillType == 1459) {
      setSkillType(1459);
      setColSpan(1);
    }

    // if (formData.Status == -1) {
    //   // setColSpanResourceCount(2);
    //   setResourceStatus(-1);
    // } else if (formData.Status == 1444) {
    //   // setColSpanResourceCount(1);
    //   setResourceStatus(1444);
    // } else if (formData.Status == 1445) {
    //   // setColSpanResourceCount(1);
    //   setResourceStatus(1445);
    // }
  };

  useEffect(() => {
    axios
      .get(baseUrl + `/VendorMS/vendor/skillTypes`)
      .then((res) => {
        let skillTypesList = res.data?.slice(0, 3);
        console.log(skillTypesList);
        setSkillTypes(skillTypesList);
      })
      .catch((error) => console.log(error));
  }, []);

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

  useEffect(() => {
    getMenus();
    getCountries();
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

  const columnGroupHeader = (
    <ColumnGroup>
      <Row>
        <Column header="Vendor Id" rowSpan={2} />
        <Column header="Vendor Name" rowSpan={2} />
        <Column header="Contact Name" rowSpan={2} />
        <Column header="Phone" rowSpan={2} />
        <Column header="Email" rowSpan={2} />
        <Column header="Country" rowSpan={2} />
        <Column header="Skill Types" colSpan={colSpan} />
        <Column header="Resource Count" colSpan={colSpanResourceCount} />
        <Column header="Contract Signed Date" rowSpan={2} />
        <Column header="Contract Expire Date" rowSpan={2} />
        <Column header="Website" rowSpan={2} />
        <Column header="Is Insured" rowSpan={2} />
        <Column header="Is licensed" rowSpan={2} />
        <Column header="Conversion Eligibility" rowSpan={2} />
      </Row>
      <Row>
        {(skillType == 1310 || skillType == -1) && (
          <Column header="Core" field="core" />
        )}
        {(skillType == 1311 || skillType == -1) && (
          <Column header="Non Core" field="non_core" />
        )}
        {(skillType == 1459 || skillType == -1) && (
          <Column header="Unclassified" field="Unclassified" />
        )}

        {/* {(resourceStatus == -1 || resourceStatus == 1444) && ( */}
        <Column header="Active" field="active" />
        {/* )} */}

        {/* {(resourceStatus == -1 || resourceStatus == 1445) && ( */}
        <Column header="Inactive" field="inactive" />
        {/* )} */}
      </Row>
    </ColumnGroup>
  );

  const websiteFunc = (rowData) => {
    const handleClick = (e) => {
      e.preventDefault();
      const isAbsoluteURL =
        rowData.website.includes("http://") ||
        rowData.website.includes("https://");
      const absoluteURL = isAbsoluteURL
        ? rowData.website
        : `http://${rowData.website}`;
      window.open(absoluteURL, "_blank");
    };

    return (
      <a
        data-toggle="tooltip"
        className="linkSty ellipsis"
        href={`${rowData.website}`}
        title={rowData.website}
        onClick={handleClick}
      >
        {rowData.website}
      </a>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onGlobalFilterChangeTwo = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFiltersTwo(_filters);
    setGlobalFilterValueTwo(value);
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const headerMapping = {
        vendorId: "Vendor Id",
        vendor_name: "Vendor Name",
        contactName: "Contact Name",
        phone: "Phone",
        email: "Email",
        countryName: "Country",
        core: "Core",
        non_core: "Non Core",
        Unclassified: "Unclassified",
        resource_count: "Resource Count",
        signedDt: "Contract Signed Date",
        expireDt: "Contract Expire Date",
        website: "Website",
      };

      const headerMappingTwo = {
        vendorId: "Vendor Id",
        vendor_name: "Vendor Name",
        contactName: "Contact Name",
        phone: "Phone",
        email: "Email",
        countryName: "Country",
        resource_count: "Resource Count",
        signedDt: "Contract Signed Date",
        expireDt: "Contract Expire Date",
        website: "Website",
      };

      let keys = Object.keys(headerMappingTwo);
      let val = Object.values(headerMappingTwo);
      let index = keys.indexOf("countryName");

      if (data[0]?.hasOwnProperty("core")) {
        keys.splice(index + 1, 0, "core");
        val.splice(index + 1, 0, "Core");
      } else if (data[0]?.hasOwnProperty("non_core")) {
        keys.splice(index + 1, 0, "non_core");
        val.splice(index + 1, 0, "Non Core");
      } else if (data[0]?.hasOwnProperty("Unclassified")) {
        keys.splice(index + 1, 0, "Unclassified");
        val.splice(index + 1, 0, "Unclassified");
      }

      const newObject = {};
      for (let i = 0; i < keys.length; i++) {
        newObject[keys[i]] = val[i];
      }
      let headers;
      let transformedData = [];
      if (skillType !== -1) {
        headers = Object.values(newObject);
        transformedData = data.map((item) => {
          const transformedItem = {};
          for (const key in item) {
            if (item.hasOwnProperty(key) && newObject[key]) {
              transformedItem[newObject[key]] = item[key];
            }
          }
          return transformedItem;
        });
      } else {
        headers = Object.values(headerMapping);
        transformedData = data.map((item) => {
          const transformedItem = {};
          for (const key in item) {
            if (item.hasOwnProperty(key) && headerMapping[key]) {
              transformedItem[headerMapping[key]] = item[key];
            }
          }
          return transformedItem;
        });
      }
      const boldHeaderStyle = { font: { bold: true } };
      const worksheet = xlsx.utils.json_to_sheet(transformedData, {
        header: headers,
        s: boldHeaderStyle,
      });
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "VendorReviews");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(data, fileName);
      }
    });
  };

  const exportExcelTwo = () => {
    import("xlsx").then((xlsx) => {
      const headerMapping = {
        employee_number: "Employee ID",
        resource_name: "Resource Name",
        start_date: "DOJ",
        skills: "Skills",
        department: "Department",
        supervisor: "Supervisor",
        contract_type: "Contract Type",
        skill_type: "Skill Type",
      };

      const headers = Object.values(headerMapping);
      const transformedData = resourcesList.map((item) => {
        const transformedItem = {};
        for (const key in item) {
          if (item.hasOwnProperty(key) && headerMapping[key]) {
            transformedItem[headerMapping[key]] = item[key];
          }
        }
        return transformedItem;
      });

      const boldHeaderStyle = { font: { bold: true } };
      const worksheet = xlsx.utils.json_to_sheet(transformedData, {
        header: headers,
        s: boldHeaderStyle,
      });
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "VendorResources");
    });
  };

  const renderHeader = () => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
        <div className="exportBtn ml-2 me-2">
          <span
            className="pi pi-file-excel excel"
            onClick={exportExcel}
            title="Export to Excel"
          />
        </div>
      </div>
    );
  };

  const renderHeaderTwo = () => {
    return (
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="me-3 VMG-table-info-heading">
            <label>{VendorName}</label>
          </div>
        </div>
        <div className="flex align-items-center justify-content-end gap-2">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValueTwo}
              onChange={onGlobalFilterChangeTwo}
              placeholder="Keyword Search"
            />
          </span>
          <div className="exportBtn ml-2 me-2">
            <span
              className="pi pi-file-excel excel"
              onClick={exportExcelTwo}
              title="Export to Excel"
            />
          </div>
        </div>
      </div>
    );
  };

  const header = renderHeader();
  const headerTwo = renderHeaderTwo();
  const [rstatus, setRstatus] = useState(formData?.Status);

  const getVendorResourceDetails = (rowData, skillType, resourceStatus) => {
    setResourceTable(true);
    setVendorName(rowData.vendor_name);
    const requestBody = {
      VendoreId: rowData.id,
      country: formData.country,
      Status: formData?.Status,
      skillType: skillType,
      ResourceStatus: resourceStatus,
    };

    axios
      .post(baseUrl + `/VendorMS/vendor/getVendorResourceDtls`, requestBody)
      .then((res) => {
        let data = res.data;

        if (data.length > 1) {
          setResourcesList(data.slice(1));
          setTimeout(() => {
            window.scrollTo({
              top: 500,
              behavior: "smooth",
            });
          }, 100);
        } else {
          setResourcesList([]);
        }
      })
      .catch((error) => console.log(error));
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
          <h2>VMG Reviews</h2>
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
      <div className="col-md-12 ">
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
                  Vendor Name
                  <span className="required error-text ml-1"> *</span>{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    // className="cancel text"
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
                    // ref={(ele) => {
                    //   ref.current[0] = ele;
                    // }}
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
                <label className="col-5">
                  Country<span className="required error-text ml-1"> *</span>{" "}
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
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
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5 ">Vendor Status &nbsp;</label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 " id="status">
                  <select
                    id="statusId"
                    className="text cancel "
                    // onChange={
                    //   ((e) =>
                    //     setFormData((prevVal) => ({
                    //       ...prevVal,
                    //       ["Status"]: e.target.value,
                    //     })),
                    //   setResourceStatus(e.target.value))
                    // }

                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        Status: e.target.value,
                      }));
                    }}
                    value={formData?.Status}
                    name="vendorStatus"
                  >
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

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5 ">Skill Types &nbsp;</label>
                <span className="col-1 p-0">:</span>
                <div className="col-6 " id="skills">
                  <select
                    id="skillId"
                    className="text cancel "
                    onChange={(e) =>
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["skillType"]: e.target.value,
                      }))
                    }
                    name="skillTypes"
                  >
                    <option key="" value={-1}>
                      {"<<ALL>>"}
                    </option>
                    {skillTypes.map((option) => (
                      <option
                        key={option.id}
                        value={option.id}
                        selected={formData?.skill === option.id}
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
        <div className="darkHeader  VMG-review-table">
          <DataTable
            value={data}
            showGridlines
            headerColumnGroup={columnGroupHeader}
            stripedRows
            paginator
            rows={20}
            currentPageReportTemplate="View {first} - {last} of {totalRecords} "
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            rowsPerPageOptions={[10, 20, 50]}
            className="primeReactDataTable VMG-Reviews-screen-table"
            emptyMessage="No Data Found"
            header={header}
            filters={filters}
            globalFilterFields={[
              "vendor_name",
              "phone",
              "signedDt",
              "nxtRvwDt",
              "email",
              "expireDt",
              "contactName",
              "contryName",
              "vendorId",
              "website",
              "is_insured",
              "is_licensed",
              "conversion_eligibility",
            ]}
          >
            <Column
              feild="vendorId"
              filter
              body={(rowData) => (
                <div className="ellipsis" title={rowData.vendorId}>
                  {rowData.vendorId}
                </div>
              )}
            />
            <Column
              filter
              feild="vendor_name"
              body={(rowData) => (
                <Link
                  data-toggle="tooltip"
                  className="linkSty ellipsis"
                  target="_blank"
                  to={`/vendor/vendorDoc/:${rowData.id}`}
                  title={rowData.vendor_name}
                >
                  {rowData.vendor_name}
                </Link>
              )}
            />
            <Column
              feild="contactName"
              filter
              body={(rowData) => (
                <div className="ellipsis" title={rowData.contactName}>
                  {rowData.contactName}
                </div>
              )}
            />
            <Column
              feild="phone"
              filter
              body={(rowData) => (
                <div className="ellipsis" title={rowData.phone}>
                  {rowData.phone}
                </div>
              )}
            />
            <Column
              feild="email"
              filter
              body={(rowData) => (
                <div className="ellipsis" title={rowData.email}>
                  {rowData.email}
                </div>
              )}
            />
            <Column
              feild="contryName"
              filter
              body={(rowData) => (
                <div
                  className="ellipsis"
                  align="center"
                  title={rowData.contryName}
                >
                  {rowData.contryName}
                </div>
              )}
            />
            {(skillType == 1310 || skillType == -1) && (
              <Column
                field="core"
                body={(rowData) => (
                  <div
                    className="linkSty"
                    align="right"
                    style={{ textDecoration: "underline" }}
                    title={rowData.core}
                    onClick={() => getVendorResourceDetails(rowData, 1310, -1)}
                  >
                    {rowData.core}
                  </div>
                )}
              />
            )}
            {(skillType == 1311 || skillType == -1) && (
              <Column
                field="non_core"
                body={(rowData) => (
                  <div
                    className="linkSty"
                    align="right"
                    style={{ textDecoration: "underline" }}
                    title={rowData.non_core}
                    onClick={() => getVendorResourceDetails(rowData, 1311, -1)}
                  >
                    {rowData.non_core}
                  </div>
                )}
              />
            )}
            {(skillType == 1459 || skillType == -1) && (
              <Column
                field="Unclassified"
                body={(rowData) => (
                  <div
                    className="linkSty"
                    align="right"
                    style={{ textDecoration: "underline" }}
                    title={rowData.Unclassified}
                    onClick={() => getVendorResourceDetails(rowData, 1459, -1)}
                  >
                    {rowData.Unclassified}
                  </div>
                )}
              />
            )}
            <Column
              feild="Active"
              body={(rowData) => (
                <div
                  align="right"
                  className="linkSty"
                  style={{ textDecoration: "underline" }}
                  title={rowData.active}
                  onClick={() => {
                    getVendorResourceDetails(rowData, -1, 1);
                  }}
                >
                  {rowData.active}
                </div>
              )}
            />
            <Column
              feild="Inactive"
              body={(rowData) => (
                <div
                  align="right"
                  className="linkSty"
                  style={{ textDecoration: "underline" }}
                  title={rowData.inactive}
                  onClick={() => {
                    getVendorResourceDetails(rowData, -1, 0);
                  }}
                >
                  {rowData.inactive}
                </div>
              )}
            />
            <Column
              feild="signedDt"
              filter
              body={(rowData) => (
                <div
                  className="ellipsis"
                  align="center"
                  title={rowData.signedDt}
                >
                  {rowData.signedDt}
                </div>
              )}
            />
            <Column
              feild="expireDt"
              filter
              body={(rowData) => (
                <div
                  className="ellipsis"
                  align="center"
                  title={rowData.expireDt}
                >
                  {rowData.expireDt}
                </div>
              )}
            />
            <Column
              feild="website"
              filter
              body={(rowData) => websiteFunc(rowData)}
            />
            <Column
              field="is_insured"
              filter
              body={(rowData) => (
                <div
                  className="ellipsis"
                  title={rowData.is_insured == "true" ? "Yes" : "No"}
                >
                  {rowData?.is_insured === "true" ? "Yes" : "No"}
                </div>
              )}
            />

            <Column
              field="is_licensed"
              filter
              body={(rowData) => (
                <div
                  className="ellipsis"
                  title={rowData.is_licensed == "true" ? "Yes" : "No"}
                >
                  {rowData.is_licensed === "true" ? "Yes" : "No"}
                </div>
              )}
            />
            <Column
              field="conversion_eligibility"
              filter
              body={(rowData) => (
                <div
                  className="ellipsis"
                  title={rowData.conversion_eligibility}
                >
                  {rowData.conversion_eligibility}
                </div>
              )}
            />
          </DataTable>
        </div>
      ) : (
        " "
      )}
      {resourceTable ? (
        <div className="darkHeader VMG-review-second-table mt-5">
          <DataTable
            value={resourcesList}
            stripedRows
            showGridlines
            paginator
            rows={20}
            currentPageReportTemplate="View {first} - {last} of {totalRecords} "
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            rowsPerPageOptions={[10, 20, 50]}
            className="primeReactDataTable"
            emptyMessage="No Data Found"
            header={headerTwo}
            filters={filtersTwo}
            globalFilterFields={[
              "skill_type",
              "skills",
              "resource_name",
              "supervisor",
              "employee_number",
              "start_date",
              "contract_type",
              "department",
            ]}
          >
            <Column
              field="employee_number"
              header="Employee ID"
              align={"center"}
              body={(rowData) => (
                <div title={rowData.employee_number}>
                  {rowData.employee_number}
                </div>
              )}
            />
            <Column
              field="resource_name"
              header="Resource Name"
              body={(rowData) => (
                <div className="ellipsis" title={rowData.resource_name}>
                  <Link
                    to={`/resource/profile/:${rowData.resource_id}`}
                    target="_blank"
                  >
                    {console.log(rowData, "rowData")}
                    {rowData.resource_name}
                  </Link>
                </div>
              )}
            />
            <Column
              field="start_date"
              header="DOJ"
              align={"center"}
              body={(rowData) => (
                <div className="ellipsis" title={rowData.start_date}>
                  {rowData.start_date}
                </div>
              )}
            />
            <Column
              field="skills"
              header="Skills"
              body={(rowData) => (
                <div className="ellipsis" title={rowData.skills}>
                  {rowData.skills}
                </div>
              )}
            />
            <Column
              field="department"
              header="Department"
              body={(rowData) => (
                <div className="ellipsis" title={rowData.department}>
                  {rowData.department}
                </div>
              )}
            />
            <Column
              field="supervisor"
              header="Supervisor"
              body={(rowData) => (
                <div className="ellipsis" title={rowData.supervisor}>
                  {rowData.supervisor}
                </div>
              )}
            />
            <Column
              field="contract_type"
              header="Contract Type"
              body={(rowData) => (
                <div className="ellipsis" title={rowData.contract_type}>
                  {rowData.contract_type}
                </div>
              )}
            />
            <Column
              field="skill_type"
              header="Skill Type"
              body={(rowData) => (
                <div className="ellipsis" title={rowData.skill_type}>
                  {rowData.skill_type}
                </div>
              )}
            />
            <Column
              field="laptop_allocated"
              header="Laptop Allocated"
              body={(rowData) => (
                <div className="ellipsis" title={rowData.laptop_allocated}>
                  {rowData.laptop_allocated}
                </div>
              )}
            />
            <Column
              field="conversion_eligibility"
              header="Conversion Eligibility"
              body={(rowData) => (
                <div
                  className="ellipsis"
                  title={rowData.conversion_eligibility}
                >
                  {rowData.conversion_eligibility}
                </div>
              )}
            />
            <Column
              field="LinkedIN_Id"
              header="LinkedIn Id"
              body={(rowData) => (
                <div className="ellipsis" title={rowData.LinkedIN_Id}>
                  {rowData.LinkedIN_Id}
                </div>
              )}
            />
            <Column
              field="bill_rate_at_CB"
              header="Bill Rate at CB"
              body={(rowData) => (
                <div className="ellipsis align right colWidth" title={rowData.bill_rate_at_CB}>
                  {rowData.bill_rate_at_CB}
                </div>
              )}
            />
            <Column
              field="cost_rate_at_CB"
              header="Cost Rate at CB"
              body={(rowData) => (
                <div className="ellipsis align right colWidth" title={rowData.cost_rate_at_CB}>
                  {rowData.cost_rate_at_CB}
                </div>
              )}
            />
            <Column
              field="gm_perc_on_CB"
              header="GM% on CB"
              body={(rowData) => (
                <div className="ellipsis align right colWidth" title={rowData.gm_perc_on_CB}>
                  {rowData.gm_perc_on_CB}
                </div>
              )}
            />
          </DataTable>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default ReviewsVendor;
