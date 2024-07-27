import { React, useEffect, useState, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import { Column } from "primereact/column";
import { environment } from "../../environments/environment";
import axios from "axios";
import DatePicker from "react-datepicker";
import moment from "moment";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { ColumnGroup } from "primereact/columngroup";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Row } from "primereact/row";
import RoleCostView from "./RoleCostRoleView";
import { AiFillWarning } from "react-icons/ai";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import Loader from "../Loader/Loader";
import { RiFileExcel2Line } from "react-icons/ri";
import ExcelJS from "exceljs";

import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function RoleCosts() {
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [visible, setVisible] = useState(false);
  const [country, setCountry] = useState([]);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [resvalue, setResValue] = useState([{}]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searching, setSearching] = useState(false);
  const baseUrl = environment.baseUrl;
  const [validator, setValidator] = useState(false);
  const [loader, setLoader] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [displayedCountryName, setDisplayedCountryName] = useState("India");
  const [columns, setColumns] = useState([]);
  const ref = useRef([]);

  let currentScreenName = ["Role Costs"];
  let textContent = "Administration";

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 116) + "px"
  );

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
      let getData = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Roles Permissions" &&
              subMenu.display_name !== "Sales Permissions" &&
              subMenu.display_name !== "Jobs Daily Status" &&
              subMenu.display_name !== "Error Logs" &&
              subMenu.id != 27 &&
              subMenu.display_name !== "Tracker" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents"
          );
        }
        return menu;
      });

      getData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };

  useEffect(() => {
    getMenus();
  }, []);

  var d = new Date();
  var year = d.getFullYear();
  var month1 = d.getMonth();
  var day = d.getDate();
  var max = new Date(year, month1);
  var month = 0; // 0 represents January
  var day1 = 1; // 1 represents the first day of the month
  var min = new Date(year, month1, day1);
  var mindate = new Date(year, month, day1);
  const initialValue = {
    resBusinessUnit: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    action: "view",
    country: "3",
    month: moment(new Date()).startOf("month").format("YYYY-MM-DD"),
    countryName: "India",
  };
  const [formData, setFormData] = useState(initialValue);
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [details, setDetails] = useState({});
  const [data, setData] = useState({});

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "country.name": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });

  const getPageviewcountdetails = (dt) => {
    axios({
      method: "post",
      url: baseUrl + `/administrationms/roleCosts/getviewDetails`,

      data: {
        Country: formData.country,
        Bu: formData.resBusinessUnit,
        loggedUser: loggedUserId,
        RoleTypeId: 0,
        history: false,
      },
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        let detail = res.data.tableData?.map((item) => {
          // Check if the item has a decimal property and round it to 2 decimal places
          if (item.decimalValue !== undefined) {
            item.decimalValue = parseFloat(item.decimalValue).toFixed(2);
          }
          return item;
        });
        setDetails(detail);
        setData(res.data);
        setLoader(false);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        setSearching(true);
      })
      .then((error) => {});
  };

  const getResourceView = () => {
    axios({
      url:
        baseUrl +
        `/administrationms/roleCosts/getResource?Country=${formData?.country}&Bu=${formData?.resBusinessUnit}&monthStartDate=${formData?.month}`,
    }).then((resp) => {
      setResValue(resp.data);
    });
  };

  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.options[e.target.selectedIndex].text;
    setFormData((prevVal) => ({
      ...prevVal,
      ["country"]: e.target.value,
      ["countryName"]: selectedCountryName,
    }));
  };

  const handleClick = () => {
    // getPageviewcountdetails();
    GlobalCancel(ref);

    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidator(true);
      }
      return;
    }
    setValidator(false);
    // setLoader(true);
    setSearching(false);
    setTimeout(() => {
      setLoader(true);
      // Use another setTimeout to fetch data after 2 seconds
      setTimeout(() => {
        getPageviewcountdetails();
      }, 1000); // 2-second delay for data fetching
    }, 1000);

    // setSearching(true);
    if (formData.action == "resview") {
      getResourceView();
    }
    setDisplayedCountryName(formData.countryName);
  };
  const getBusinessUnit = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments.push({ value: 999, label: "Non-Revenue Units" });
    setBusiness(departments);
    setSelectedBusiness(departments.filter((ele) => ele.value != 999));
    let filteredDeptData = [];
    departments?.forEach((data) => {
      if (data.value != 0) {
        filteredDeptData.push(data.value);
      }
    });
  };
  const getCountries = () => {
    axios({
      url: baseUrl + `/revenuemetricsms/headCountAndTrend/getCountries`,
    }).then((resp) => {
      setCountry(resp.data);
    });
  };
  useEffect(() => {
    getCountries();
    getBusinessUnit();
    getResourceView();
  }, []);
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const onSort = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
    const sortedData = [...resvalue].sort((a, b) => {
      const valueA = a[e.sortField];
      const valueB = b[e.sortField];
      if (valueA < valueB) return e.sortOrder === 1 ? -1 : 1;
      if (valueA > valueB) return e.sortOrder === 1 ? 1 : -1;
      return 0;
    });
    setResValue(sortedData);
  };
  const [sortAscending, setSortAscending] = useState(true);

  const handleSort = (ascending) => {
    setSortAscending(!ascending);
  };
  const propertyOrder = [
    "verIndication",
    "Resource Name",
    "Department",
    "Role Type",
    "Designation",
    "Cadre",
    "Bill Rate",
    "Cost",
    "ComptedCost",
    "startDate",
    "endDate",
    "Verified By",
    "verifiedDate",
  ];
  const excludeProperties = ["id"];

  const additionalKeys =
    resvalue.length > 0
      ? Object.keys(resvalue[0]).filter(
          (key) => !propertyOrder.includes(key) && key !== "id"
        )
      : [];

  const headerColumns = [
    { header: "Verif. Health", field: "verIndication", rowSpan: 2 },
    { header: "Resource Name", field: "Resource Name", rowSpan: 2 },
    { header: "Department", field: "Department", rowSpan: 2 },
    { header: "Role Type", field: "Role Type", rowSpan: 2 },
    { header: "Designation", field: "Designation", rowSpan: 2 },
    { header: "Cadre", field: "Cadre", rowSpan: 2 },
    { header: "Bill Rate", field: "Bill Rate", rowSpan: 2 },
    {
      header: "Cost",
      colSpan: 5,
      field: "Cost",
      style: { textAlign: "center" },
    },
    { header: "Verified Date", field: "verifiedDate", rowSpan: 2 },
  ];

  if (additionalKeys.length > 0) {
    additionalKeys.forEach((key) => {
      headerColumns.push({
        header: key,
        field: key,
        rowSpan: 2,
      });
    });
  }
  const costColumns = [
    { header: "Avg Cost/Hr", field: "Cost", title: "projectName" },
    { header: "Computed Cost", field: "ComptedCost" },
    { header: "Start Month", field: "startDate" },
    { header: "End Month", field: "endDate" },
    { header: "Verified By", field: "Verified By" },
  ];

  const headerGroup = (
    <ColumnGroup>
      <Row>
        {headerColumns.map((column) => (
          <Column
            key={column.field}
            header={column.header}
            field={column.field}
            rowSpan={column.rowSpan}
            colSpan={column.colSpan}
            style={column.style}
            sortable
            sortAscending={sortAscending}
            onSort={handleSort}
          />
        ))}
      </Row>

      <Row>
        {costColumns.map((column) => (
          <Column
            key={column.field}
            header={column.header}
            field={column.field}
            title={column.title}
            sortable
            sortAscending={sortAscending}
            onSort={handleSort}
          />
        ))}
      </Row>
    </ColumnGroup>
  );

  const exportExcel = () => {
    const filteredData = resvalue.map((item) =>
      Object.fromEntries(
        Object.entries(item).filter(([key]) => !excludeProperties.includes(key))
      )
    );
    const dataRows = filteredData.map((item) =>
      propertyOrder.map((prop) => item[prop])
    );
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("RoleCostsResourceView");
    worksheet.addRow(propertyOrder).font = { bold: true };

    for (let i = 0; i < dataRows.length; i++) {
      worksheet.addRow(dataRows[i]);
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "RoleCostsResourceView.xlsx");
    });
  };

  const onGlobalFilterChange = (event) => {
    const value = event.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
  };
  const renderHeader = () => {
    const value = filters["global"] ? filters["global"].value : "";

    return (
      <>
        {" "}
        <div className="execel-search-container">
          <span className="p-input-icon-left ">
            <i className="pi pi-search" />
            <InputText
              type="search"
              value={value || ""}
              onChange={(e) => onGlobalFilterChange(e)}
              placeholder="Global Search"
            />
          </span>
          <span className="excel-icon-container">
            <RiFileExcel2Line
              size="1.5em"
              title="Export to Excel"
              cursor="pointer"
              onClick={exportExcel}
            />
          </span>
        </div>
      </>
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };
  const header = renderHeader();
  const loggedUserId = localStorage.getItem("resId");

  const LinkTemplate = (data) => {
    let legendElement = null;

    if (data.Cost == null && data.ComptedCost == null) {
      legendElement = (
        <div className="legendContainer align center">
          <div className="legend black">
            <div className="legendCircle" title="Old Cost">
              <div className="legendTxt"></div>
            </div>
          </div>
        </div>
      );
    } else {
      legendElement = (
        <div className="legendContainer align center">
          <div className="legend red">
            <div className="legendCircle" title="Unverified">
              {/* <div className="legendCircle" align="center"></div> */}
              <div className="legendTxt"></div>
            </div>
          </div>
        </div>
      );
    }
    return <div className="ellipsis">{legendElement}</div>;
  };

  const endDateValues = resvalue.map((item) => item.endDate);
  const areAllEndDatesNull = endDateValues.every((endDate) => endDate === null);

  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const handleDateChange = (selectedDate) => {
    setFormData((prev) => ({
      ...prev,
      month: moment(selectedDate).format("YYYY-MM-DD"),
    }));
  };

  const handleMonthChange = (selectedMonth) => {
    const selectedYear = selectedMonth.getFullYear();
    const newSelectedDate = new Date(selectedYear, selectedMonth.getMonth(), 1);

    setFormData((prev) => ({
      ...prev,
      month: moment(newSelectedDate).format("YYYY-MM-DD"),
    }));
  };
  return (
    <div>
      {validator ? (
        <div className="statusMsg error">
          <AiFillWarning /> &nbsp; Please select valid values for highlighted
          fields
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Role Costs</h2>
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
            <GlobalHelp />
          </div>
        </div>
      </div>

      <div class="group customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div class="group-content row mb-2">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resType">
                  Action&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="action"
                    onChange={(e) => {
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["action"]: e.target.value,
                      }));
                      setSearching(false);
                    }}
                  >
                    <option value="view">{"Role-View"}</option>
                    <option value="resview">{"Resource-View"}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-2">
              <div class="form-group row">
                <label class="col-5" for="BuIds">
                  Res.Location
                </label>
                <span class="col-1 p-0">:</span>
                <div class="col-6">
                  <select
                    id="country"
                    onChange={handleCountryChange}
                    style={{ width: "100%" }}
                  >
                    {country
                      .slice()
                      .sort((a, b) =>
                        a.countryName.localeCompare(b.countryName)
                      )
                      .map((data) => (
                        <option
                          key={data.id}
                          value={data.id}
                          selected={data.countryName === formData.countryName}
                        >
                          {data.countryName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resBusinessUnit">
                  Business Unit&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <MultiSelect
                    id="resBusinessUnit"
                    ArrowRenderer={ArrowRenderer}
                    options={business}
                    hasSelectAll={true}
                    // isLoading={false}
                    // shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedBusiness}
                    valueRenderer={generateDropdownLabel}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedBusiness(s);
                      let filteredValues = [];
                      s?.forEach((d) => {
                        filteredValues.push(d.value);
                      });

                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["resBusinessUnit"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            {formData.action == "resview" && (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5">Month</label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div className="datepicker">
                      <DatePicker
                        name="month"
                        id="month"
                        selected={
                          formData.month ? new Date(formData.month) : null
                        }
                        onChange={handleDateChange}
                        onSelect={handleMonthChange}
                        dateFormat="MMM-yyyy"
                        showMonthYearPicker
                        placeholderText="Start Month"
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="col-md-12 col-sm-12 col-xs-12  btn-container center my-0">
              <button
                type="submit"
                className="btn btn-primary"
                title="Search"
                onClick={() => handleClick()}
              >
                <FaSearch />
                Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
        {searching == true && formData.action == "resview" ? (
          <>
            <h2 className="countryTitle">
              Role Costs for {displayedCountryName}{" "}
            </h2>
            <div className="darkHeader role-cost-resource-view-table">
              <DataTable
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                rowsPerPageOptions={[10, 25, 50]}
                className="primeReactDataTable"
                value={resvalue}
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={onSort}
                paginator
                rows={25}
                header={header}
                filters={filters}
                onFilter={(e) => setFilters(e.filters)}
                selection={selectedCustomer}
                onSelectionChange={(e) => setSelectedCustomer(e.value)}
                selectionMode="single"
                dataKey="id"
                showGridlines
                stateStorage="session"
                stateKey="dt-state-demo-local"
                emptyMessage="No Records To View."
                // tableStyle={{ minWidth: "50rem" }}
                // tableStyle={{ minWidth: "auto", width: "auto" }}
                headerColumnGroup={headerGroup}
              >
                {[...propertyOrder, ...additionalKeys].map((key) => {
                  return (
                    <Column
                      key={key}
                      field={key}
                      body={
                        key === "verIndication"
                          ? LinkTemplate
                          : key === "Bill Rate" ||
                            key === "Cost" ||
                            key === "ComptedCost"
                          ? (rowData) => (
                              <span title={rowData[key]}>
                                <span style={{ float: "left" }}>
                                  {rowData[key] ? "$" : ""}
                                </span>{" "}
                                {rowData[key]}
                              </span>
                            )
                          : null
                      }
                    />
                  );
                })}
              </DataTable>
            </div>
          </>
        ) : (
          ""
        )}
        {loader ? <Loader handleAbort={handleAbort} /> : ""}

        {searching == true && formData.action == "view" ? (
          <div>
            {/* <span className="countryTitle">
              Role Costs for{" "}
              <span className="country">{formData.countryName}</span>
            </span> */}
            <RoleCostView
              displayedCountryName={displayedCountryName}
              data={data}
              formData={formData}
              setDetails={setDetails}
              setData={setData}
              details={details}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default RoleCosts;
