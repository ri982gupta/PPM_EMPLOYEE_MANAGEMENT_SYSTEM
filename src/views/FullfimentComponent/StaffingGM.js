import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
// import {
//   FaChevronCircleDown,
//   FaChevronCircleUp,
//   FaSearch,
//   FaCheck,
// } from "react-icons/fa";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaCaretDown,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import { CCollapse } from "@coreui/react";
import { getTableData } from "./StaffingGMTable";
import { environment } from "../../environments/environment";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import ExcelJS from "exceljs";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import { IoWarningOutline } from "react-icons/io5";
import moment from "moment";
import './StaffingGM.scss'
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function StaffingGM() {
  const [selectedItems, setSelectedItems] = useState([{}]);
  const [custVisible, setCustVisible] = useState(false);
  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"));
  const idList = selectedCust?.map((item) => item.id);
  console.log(selectedCust);
  const idString = idList?.join(",");
  const [selectedVendorid, setSelectedVendorId] = useState(-1);
  console.log(selectedVendorid);
  const initialValue = {
    fromDate: "2024-01-11",
    bu: "170,211,123,82,168,207,212,18,213,49,149,208,243,999",
    countries: "-1",
    duration: "2",
    contractTermsIds: "-1",
    vendorIds: -1,
  };

  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [dataAr, setDataAr] = useState([]);
  const [formData, setFormData] = useState(initialValue);

  let flag = 3;
  const tableDisplayView = "VendorPerformanceFilter";
  const vendorSelectBox = "VendorSelect";
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [overallAverage, setOverallAverage] = useState([]);
  const [bussinessUnit, setBusinessUnit] = useState([]);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState([]);
  const loggedUserId = localStorage.getItem("resId");

  const [contractTerms, setContractTerms] = useState([]);
  const [selectedContractTerms, setSelectedContractTerms] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const [tableData, setTableData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [month, setMonth] = useState("2023-11-11");
  const [duration, setDuration] = useState("2");

  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const [routes, setRoutes] = useState([]);
  let textContent = "Fullfilment";
  let currentScreenName = ["SubK GM% Trend"];

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -79) + "px"
  );

  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  useEffect(() => {
    let tdata = getTableData();
    setDataAr(tdata);
  }, []);
  const handleChange1 = (e) => {
    console.log(e.target.value);
    setSelectedVendorId(e.target.value);
    const { id, name, value } = e.target;
    if (name == "customerIds" && value == "select") {
      setFormData((prev) => {
        return { ...prev, [name]: value };
      });
      setCustVisible(true);
    }
    setcustData();
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  useEffect(() => {
    tableData[0] && setHeaderData(JSON.parse(JSON.stringify(tableData[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, [tableData]);
  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        const countries = Response.data.map((countryObject, index) => {
          return {
            label: countryObject.country_name,
            value: countryObject.id,
          };
        });

        setCountry(countries);
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };

  const getBusinessUnit = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments.push({ value: 0, label: "Non-Revenue Units" });
    setBusinessUnit(departments);
    setSelectedBusinessUnit(departments.filter((ele) => ele.value != 0));
    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 0) {
        filteredDeptData.push(data.value);
      }
    });
  };

  const getContractTerms = async () => {
    const resp = await axios({
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getContractTerms`,
    });

    const contractTermsData = resp.data.map((contractTermObject, index) => {
      return {
        label: contractTermObject.lkup_name,
        value: contractTermObject.id,
      };
    });

    setContractTerms(contractTermsData);
    setSelectedContractTerms(contractTermsData);
  };

  useEffect(() => {
    getCountries();
    getBusinessUnit();
    getContractTerms();
  }, []);

  const customValueRenderer = (selected, _options) => {
    return selected.length === country.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };

  const businessValueRenderer = (selected, _options) => {
    return selected.length === bussinessUnit.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };

  const contractTermsRenderer = (selected, _options) => {
    return selected.length === contractTerms.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
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
  const calculateOverallAverage = (data) => {
    const totalGMPercentage = data.reduce(
      (sum, entry) => sum + entry["GM %"],
      0
    );
    const overallAverage = totalGMPercentage / data.length;

    // Round to two decimal places
    return overallAverage.toFixed(2);
  };

  console.log(Math.round(overallAverage));
  const searchh = () => {
    console.log("---");
    if (
      Object.values(formData).includes("") ||
      (selectedVendorid == "select" && selectedCust.length == 0)
    ) {
      setIsError(true);
    } else {
      setIsError(false);
      setIsLoading(true);

      axios
        .post(baseUrl + `/fullfilmentms/staffingGMPercent/getStaffingGM`, {
          fromDate: formData.fromDate,
          bu: formData.bu,
          countries: formData.countries,
          duration: formData.duration,
          contractTermsIds: formData.contractTermsIds,
          vendorIds: selectedVendorid == -1 ? -1 : idString,
        })
        .then(
          (res) => {
            setTimeout(() => {
              setIsLoading(false);
              setTableData(res.data);
              setVisible(!visible);
              setOpen(true);
              const calculatedOverallAverage = calculateOverallAverage(
                res.data
              );
              setOverallAverage(calculatedOverallAverage);
            }, 2000);
          },

          (error) => {
            setIsLoading(false);
          }
        );
    }
  };

  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  const [filters1, setFilters1] = useState({
    global: filtersData["contains"],
  });

  useEffect(() => {
    setFilters1({
      global: filtersData["contains"],
    });
  }, [headerData]);

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const headers = [
        "EmpId",
        "Resource",
        "Customer",
        "Project",
        "Role Name",
        "Role Start Date",
        "Role End Date",
        "Department",
        "Client Rate",
        "Pay Rate",
        "GM %",
      ];

      const worksheetData = tableData.map((item) =>
        headers.map((header) => {
          const value = item[header];

          if (header === "Client Rate") {
            // Format "Client Rate" to two decimal places
            return parseFloat(value).toFixed(2);
          } else if (header === "Pay Rate") {
            // Format "Client Rate" to two decimal places
            return parseFloat(value).toFixed(2);
          } else if (header === "scheduledDate" && moment(value).isValid()) {
            return moment(value).format("DD-MMM-YYYY");
          } else {
            return value;
          }
        })
      );

      const dataRows = [headers, ...worksheetData].map((item) =>
        Object.values(item)
      );

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("SubK_GM%_Trend");

      for (let i = 0; i < dataRows.length; i++) {
        const row = worksheet.addRow(dataRows[i]);
      }

      const boldRow = [1];

      boldRow.forEach((index) => {
        const row = worksheet.getRow(index);
        row.font = { bold: true };
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "SubK_GM%_Trend");
      });
    });
  };

  const handleAbort = () => {
    setIsLoading(false);
  };

  const renderHeader = () => {
    return (
      // <div className="flex  flex-row-reverse">
      //   <div className="exportBtn ml-3">
      //     <span className="p-input-icon-left tableGsearch">
      //       <i className="pi pi-search" />
      //       <InputText
      //         defaultValue={globalFilterValue1}
      //         onChange={onGlobalFilterChange1}
      //         placeholder="Keyword Search"
      //       />
      //     </span>

      //     <span>
      //       <i
      //         class="pi pi-file-excel "
      //         onClick={exportExcel}
      //         data-pr-tooltip="XLS"
      //         title="Export to Excel"
      //       ></i>
      //     </span>
      //   </div>
      // </div>
      <div className="d-flex justify-content-between align-items-end">
        <p style={{ fontSize: "14px", fontWeight: "bold", color: "#0090D2" }}>
          Average GM%{""}:{Math.round(overallAverage)}
        </p>
        <p
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#0090D2",
            marginLeft: "10%",
          }}
        >
          Subk GM % Trend
        </p>
        {/* Existing code */}
        <div className="exportBtn ml-3">
          <span className="p-input-icon-left tableGsearch">
            <i className="pi pi-search" />
            <InputText
              defaultValue={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              placeholder="Keyword Search"
            />
          </span>

          <span>
            <i
              className="pi pi-file-excel"
              onClick={exportExcel}
              data-pr-tooltip="XLS"
              title="Export to Excel"
            ></i>
          </span>
        </div>
      </div>
    );
  };
  const header = renderHeader();
  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.map((submenu) => {
          if (submenu.display_name === "Staffing GM %[Deprecated]") {
            return {
              ...submenu,
              display_name: "Subk GM% Trend",
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
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/vmg/vendorperformance&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  useEffect(() => {
    getMenus();
  }, []);
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Subk GM % Trend</h2>
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
      </div>
      <div style={{ "background-color": "#F2DEDE" }}>
        {isError ? (
          <span style={{ color: "#B94A48" }}>
            <IoWarningOutline />
            please select highlighted value
          </span>
        ) : null}
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>

        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="bu">
                  BU&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    style={
                      isError && formData.bu.length == 0
                        ? { border: "solid red 1px" }
                        : null
                    }
                  >
                    <MultiSelect
                      id="Bu"
                      options={bussinessUnit}
                      ArrowRenderer={ArrowRenderer}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedBusinessUnit}
                      valueRenderer={businessValueRenderer}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedBusinessUnit(s);
                        const selectedBusinessUnitValues = s.map(
                          (buObject) => buObject.value
                        );
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["bu"]: selectedBusinessUnitValues.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="bu">
                  Vendors&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div style={isError ? { border: "solid red 1px" } : null}>
                    <select
                      className="cancel Text"
                      name="customerIds"
                      id="customerIds"
                      onChange={handleChange1}
                    >
                      {selectedItems.length + "selected"}
                      <option value={-1} selected>
                        {" "}
                        &lt;&lt;ALL&gt;&gt;
                      </option>
                      {/* <option value={0}>Active Customers</option> */}
                      <option value="select">Select</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Country&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>

                <div className="col-6">
                  <div
                    style={
                      isError && formData.countries.length == 0
                        ? { border: "solid red 1px" }
                        : null
                    }
                  >
                    <MultiSelect
                      id="country"
                      options={country}
                      ArrowRenderer={ArrowRenderer}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedCountry}
                      valueRenderer={customValueRenderer}
                      onChange={(e) => {
                        setSelectedCountry(e);
                        const selectedCountryValues = e.map(
                          (countryObject) => countryObject.value
                        );
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["countries"]: selectedCountryValues.toString(),
                        }));
                      }}
                      disabled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="contractTerms">
                  Contract Terms<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    style={
                      isError && formData.contractTermsIds.length == 0
                        ? { border: "solid red 1px" }
                        : null
                    }
                  >
                    <MultiSelect
                      id="contractTerms"
                      options={contractTerms}
                      ArrowRenderer={ArrowRenderer}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedContractTerms}
                      valueRenderer={contractTermsRenderer}
                      onChange={(e) => {
                        setSelectedContractTerms(e);
                        const selectedContractTermValues = e.map(
                          (contractObject) => contractObject.value
                        );
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["contractTermsIds"]:
                            selectedContractTermValues.toString(),
                        }));
                      }}
                      disabled={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="month">
                  Month&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["fromDate"]: moment(date)
                          .format("YYYY-MM-DD")
                          .toString(),
                      }));
                    }}
                    dateFormat="MMM-yyyy"
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    defaultValue="2"
                    id="duration"
                    onChange={(e) => {
                      setDuration(e.target.value);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["duration"]: e.target.value.toString(),
                      }));
                    }}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="1">7</option>
                    <option value="2">8</option>
                    <option value="3">9</option>
                    <option value="4">10</option>
                    <option value="5">11</option>
                    <option value="6">12</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button className="btn btn-primary " onClick={searchh}>
                Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      <div className="col-md-12">
        {isLoading ? (
          <div className="loaderBlock">
            <Loader handleAbort={handleAbort} />
          </div>
        ) : (
          open && (
            <div className="darkHeader fullfilmentSubKConvertionTrend">
              <DataTable
                className="primeReactDataTable invoicingSearchTable" ////customerEngament
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                rowsPerPageOptions={[10, 20, 30, 50, 100]}
                value={tableData}
                paginator
                rows={20}
                header={header}
                filters={filters1}
                selectionMode="single"
                dataKey="id"
                showGridlines
                emptyMessage="No Records To View."
                style={{ width: "100%" }}
              >
                {/* <Column field="product" body={LinkTemplate} /> */}
                <Column field="EmpId" header="EmpId" sortable />
                <Column field="Resource" header="Resource" sortable />
                <Column field="Customer" header="Customer" sortable />
                <Column
                  field="Project"
                  header="Project"
                  body={(data) => (
                    <Link
                      target="_blank"
                      to={"/project/Overview/:" + data["ProjectId"]}
                      title={data.Project}
                    >
                      {data.Project}
                    </Link>
                  )}
                  sortable
                />
                <Column field="Role Name" header="Role Name" sortable />
                <Column
                  field="Role Start Date"
                  header="Role Start Date"
                  sortable
                  body={(data) => (
                    <span>
                      {moment(data["Role Start Date"]).format("DD-MMM-YYYY")}
                    </span>
                  )}
                />
                <Column
                  field="Role End Date"
                  header="Role End Date"
                  sortable
                  body={(data) => (
                    <span>
                      {moment(data["Role End Date"]).format("DD-MMM-YYYY")}
                    </span>
                  )}
                />
                <Column
                  field="Department"
                  header="Department"
                  sortable
                  body={(data) => <span>{data["Department"]}</span>}
                />
                <Column
                  field="Client Rate"
                  header="Client Rate"
                  sortable
                  body={(data) => (
                    <span style={{ float: "right" }}>
                      {data["Client Rate"].toFixed(2)}
                    </span>
                  )}
                />
                <Column
                  field="Pay Rate"
                  header="Pay Rate"
                  sortable
                  body={(data) => (
                    <span style={{ float: "right" }}>
                      {data["Pay Rate"].toFixed(2)}
                    </span>
                  )}
                />
                <Column
                  field="GM %"
                  header="GM %"
                  sortable
                  body={(data) => (
                    <span style={{ float: "right" }}>
                      {data["GM %"].toFixed(2)}
                    </span>
                  )}
                />
              </DataTable>
            </div>
          )
        )}
        <SelectCustDialogBox
          // dataAccess={dataAccess}
          visible={custVisible}
          setVisible={setCustVisible}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
          flag={flag}
          vendorSelectBox={vendorSelectBox}
        />
      </div>
    </div>
  );
}

export default StaffingGM;
