import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Column } from "primereact/column";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import Loader from "../Loader/Loader";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

const DisplayTable = (props) => {
  const { data, handleAbort, sortedAndHeader, maxHeight1 } = props;
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, [data]);

  const cslToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.csl}
      >
        {data.csl}
      </div>
    );
  };
  const resNameToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.resName}
      >
        {data.resName}
      </div>
    );
  };
  const rescustomerToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.customer}
      >
        {data.customer}
      </div>
    );
  };
  const dpToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.dp}
      >
        {data.dp}
      </div>
    );
  };
  const engNameToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.engName}
      >
        {data.engName}
      </div>
    );
  };
  const projectToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.project}
      >
        {data.project}
      </div>
    );
  };

  const emailToolip = (data) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={data.emailId}
      >
        {data.emailId}
      </div>
    );
  };
  const resStDtAlign = (data) => {
    return (
      <div align="center" data-toggle="tooltip" title={data.resStDt}>
        {data.resStDt}
      </div>
    );
  };
  const resEndDtAlign = (data) => {
    return (
      <div align="center" data-toggle="tooltip" title={data.resEndDt}>
        {data.resEndDt}
      </div>
    );
  };
  const resindustryAlign = (data) => {
    return (
      <div data-toggle="tooltip" title={data.industry}>
        {data.industry}
      </div>
    );
  };
  const rescontractTermsAlign = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data.contractTerms}
      >
        {data.contractTerms}
      </div>
    );
  };
  const resresLocationAlign = (data) => {
    return (
      <div data-toggle="tooltip" title={data.resLocation}>
        {data.resLocation}
      </div>
    );
  };
  const monthDtAlign = (data) => {
    return (
      <div align="center" data-toggle="tooltip" title={data.month}>
        {data.month}
      </div>
    );
  };
  // const revenueAlign = (data) => {
  //   var nf = new Intl.NumberFormat();
  //   return (
  //     <div
  //       align="right"
  //       data-toggle="tooltip"
  //       title={nf.format(parseInt(data.revenue))}
  //     >
  //       {nf.format(parseInt(data.revenue))}
  //     </div>
  //   );
  // };
  const revenueAlign = (data) => {
    var nf = new Intl.NumberFormat();
    const roundedRevenue = Math.round(parseFloat(data.revenue)); // Parse as float and round
    return (
      <div
        align="right"
        data-toggle="tooltip"
        title={nf.format(roundedRevenue)}
      >
        {nf.format(roundedRevenue)}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "resName"
            ? resNameToolip
            : col == "customer"
              ? rescustomerToolip
              : col == "csl"
                ? cslToolip
                : col == "revenue"
                  ? revenueAlign
                  : col == "dp"
                    ? dpToolip
                    : col == "engName"
                      ? engNameToolip
                      : col == "project"
                        ? projectToolip
                        : col == "resStDt"
                          ? resStDtAlign
                          : col == "emailId"
                            ? emailToolip
                            : col == "resEndDt"
                              ? resEndDtAlign
                              : col == "industry"
                                ? resindustryAlign
                                : col == "contractTerms"
                                  ? rescontractTermsAlign
                                  : col == "resLocation"
                                    ? resresLocationAlign
                                    : col == "month" && monthDtAlign
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  // const sortedData = [...data]; // Copy the data array
  // const headerRow = sortedData[0]; // Get the header row
  // const dataRows = sortedData.slice(1); // Get the data rows

  // dataRows.sort((a, b) => a.customer.localeCompare(b.customer));

  // const sortedAndHeader = [headerRow, ...dataRows];
  // useEffect(() => {}, [sortedAndHeader]);

  return (
    <div>
      <CellRendererPrimeReactDataTable
        CustomersFileName = "AdministrationGMAReport"
        AdministrationGMADyMaxHt = {maxHeight1}
        fileName={" PPM GMA Report"}
        data={sortedAndHeader}
        dynamicColumns={dynamicColumns}
        headerData={headerData}
        setHeaderData={setHeaderData}
        exportData={exportData}
        rows={25}
      />
    </div>
  );
};
function GMAReport({ urlPath, visible, setVisible, setCheveronIcon, maxHeight1}) {
  const [measure, setMeasure] = useState([]);
  const [month, setMonth] = useState(new Date());
  const baseUrl = environment.baseUrl;
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [date, SetDate] = useState();
  const [loaderState, setLoaderState] = useState(false);
  const [durationOptions, setDurationOptions] = useState(12);

  const [addVisisble, setAddVisible] = useState(false);
  const ref = useRef([]);
  var d = new Date();
  var year = d.getFullYear();
  var month1 = d.getMonth();
  var day = d.getDate();
  var c = new Date(year + 1, month1);
  var E = new Date(year - 5, month1);

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Hammer Tool", "Report", "GMA Report"];
  let textContent = "Administration";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({ routes: routes, currentScreenName: currentScreenName, textContent: textContent })
  );

  const abortController = useRef(null);
  const [selectedDuration, setSelectedDuration] = useState("");

  const initialValue = {
    month: "",
    duration: "",
    businessUnit: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    measure: "",
    location: "6,5,3,8,4,7,1,2",
  };
  const [formData, setFormData] = useState(initialValue);
  const effortTypeFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/administrationms/HammerTool/getMeasures`,
    })
      .then((res) => {
        let data = res.data;

        setMeasure(data);
      })
      .catch((error) => { });
  };
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
              subMenu.display_name !== "Role Costs" &&
              subMenu.display_name !== "Upload Role Costs" &&
              subMenu.display_name !== "Contract Documents"
          );
        }
        return menu;
      });

      getData.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name)

        }
      });
    }
    )
  }

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
            countries.push(countryObj);
          });
        setCountry(countries);
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };

  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getDepartments`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.label,
              value: e.value,
            };
            countries.push(countryObj);
          });
        setBusiness(countries);
        setSelectedBusiness(countries);
      })
      .catch((error) => console.log(error));
  };

  const handleClick = () => {
    GlobalCancel(ref);
    //setLoaderState(true);
    const searchInput = document.getElementById("searchInput"); // Replace 'searchInput' with the actual ID of your search input field
    console.log(searchInput);
    if (searchInput) {
      searchInput.value = ""; // Clear the search input value
    }

    if (
      formData.month == "" ||
      selectedDuration == "" ||
      formData.businessUnit == "" ||
      formData.measure == "" ||
      formData.location == ""
    ) {
      let valid = GlobalValidation(ref);

      if (valid) {
        {
          setValidationMessage(true);
        }
        // return;
      }
    } else {
      setValidationMessage(false);
      setLoaderState(true);
      abortController.current = new AbortController();

      axios({
        method: "post",
        url: baseUrl + `/administrationms/HammerTool/getGmaReport`,
        signal: abortController.current.signal,

        data: {
          month: formData.month,
          duration: selectedDuration,
          businessUnit: formData.businessUnit,
          measure: formData.measure,
          location: formData.location,
        },
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        const data = response.data;
        const Headerdata = [
          {
            customer: "Customer",
            project: "Project",
            engName: "Eng Name",
            engCompany: "Eng Company",
            contractTerms: "Contract Terms",
            csl: "CSL",
            dp: "DP",
            industry: "Industry",
            resName: "Res Name",
            emailId: "Email Id",
            resLocation: "Res Location",
            resStDt: "Res StDt",
            resEndDt: "Res EndDt",
            month: "Month",
            revenue: data[0].revenue,
          },
        ];
        let hData = [];
        let bData = [];
        let rData = [];

        data.map((element, index) => {
          if (index == 0) {
            hData.push(response.data[index]);
          } else {
            response.data.map((element) => {
              if (element == "id") {
                rData.push(element);
              }
            });
            bData.push(response.data[index]);
          }
        });
        setData(Headerdata.concat(bData));

        //setLoaderState(true)

        // setLoaderState(false);
      });
      setTimeout(() => {
        setLoaderState(false);
        setSearching(true);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      }, 7000);
    }
  };
  const sortedData = [...data]; // Copy the data array
  const headerRow = sortedData[0]; // Get the header row
  const dataRows = sortedData.slice(1); // Get the data rows

  dataRows.sort((a, b) => a.customer.localeCompare(b.customer));

  const sortedAndHeader = [headerRow, ...dataRows];
  console.log(sortedAndHeader);

  // useEffect(() => {}, [sortedAndHeader]);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };
  useEffect(() => {
    effortTypeFnc();
    getCountries();
    getBusinessUnit();
    getMenus()
  }, []);

  const getMesureId = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, [id]: value });
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
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const handleMonthChange = (selectedMonth) => {
    setSelectedDuration("");

    const currentMonth = new Date();
    const monthsDiff =
      (selectedMonth.getFullYear() - currentMonth.getFullYear()) * 12 +
      (selectedMonth.getMonth() - currentMonth.getMonth());

    if (monthsDiff < 0) {
      setDurationOptions(12);
    } else {
      setDurationOptions(12 - monthsDiff);
    }
    setFormData((prev) => ({
      ...prev,
      ["month"]: moment(selectedMonth).format("yyyy-MM-DD"),
    }));
    SetDate(selectedMonth);

    // setMonth(selectedMonth);
  };
  return (
    <div>
      <div>
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
        <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Month&nbsp;<span className="error-text"> *</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div
                      className="datepicker"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <DatePicker
                        name="month"
                        id="month"
                        selected={date}
                        maxDate={c}
                        n
                        onChange={handleMonthChange}
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
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="duration">
                    Duration&nbsp; <span className="error-text"> *</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <select
                      className="error enteredDetails cancel text"
                      id="duration"
                      name="duration"
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                      {[...Array(durationOptions)].map((_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Business Unit&nbsp;<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <MultiSelect
                      id="businessUnit"
                      ArrowRenderer={ArrowRenderer}
                      options={business}
                      hasSelectAll={true}
                      valueRenderer={generateDropdownLabel}
                      //shouldToggleOnHover={false}
                      value={selectedBusiness}
                      //disableSearch={false}
                      disabled={false}
                      // overrideStrings={{
                      //     selectAllFiltered: "Select All",
                      //     selectSomeItems: "<< All>>",
                      // }}
                      onChange={(e) => {
                        setSelectedBusiness(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["businessUnit"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Measures&nbsp;<span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      className="text"
                      id="measure"
                      onChange={(e) => getMesureId(e)}
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                    >
                      <option value=""> &lt;&lt;Please Select&gt;&gt;</option>

                      <option value="638"> Planned Revenue</option>
                      <option value="965"> Actual Revenue</option>
                      <option value="639"> Recognized Revenue</option>
                      <option value="640"> Resource Direct Cost</option>
                      <option value="641"> Other Direct Cost</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className=" col-md-4 mb-2">
                <div className="form-group row">
                  <label className="col-5">
                    Res. Location&nbsp;<span className="error-text">*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[4] = ele;
                    }}
                  >
                    <MultiSelect
                      id="location"
                      options={country}
                      hasSelectAll={true}
                      value={selectedCountry}
                      disabled={false}
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      // overrideStrings={{
                      //     selectAllFiltered: "Select All",
                      //     selectSomeItems: "<< All>>",
                      // }}
                      onChange={(e) => {
                        setSelectedCountry(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["location"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12 btn-container center mb-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  title="Search"
                  onClick={() => handleClick()}
                >
                  <FaSearch />
                  Search
                </button>
              </div>
            </div>
          </CCollapse>
        </div>
        {/* {addVisisble &&
             <>
               <div className='group-content row mb-2'>
              <div class="form-group row ">
                <div className='col-md-3 mt-3'>
                  <label className='col-3'>Show <select className='col-2'
                    onChange={(e) => { onChangePractice(e) }}
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select> entries
                  </label>
                </div>
                <div className='col-md-7'></div>
                <div className='col-md-2 mt-2'>
                  <div class="col-5" ><label>Search:<input type="search" class="" placeholder=""
                    value={""} aria-controls="project_id" onChange={(e) => handleFilter(e)}
                  /></label>
                  </div>
                </div>
              </div>
              
              </div>
              <FlatPrimeReactTable data={data} />
              </>
              } */}
      </div>
      {loaderState ? (
        <div className="loaderBlock">
          <Loader handleAbort={handleAbort} />
        </div>
      ) : (
        ""
      )}
      {searching ? (
        <DisplayTable
          data={data}
          sortedAndHeader={sortedAndHeader}
          loaderState={loaderState}
          handleAbort={handleAbort}
          maxHeight1 = {maxHeight1}
        />
      ) : (
        " "
      )}
    </div>
  );
}

export default GMAReport;
