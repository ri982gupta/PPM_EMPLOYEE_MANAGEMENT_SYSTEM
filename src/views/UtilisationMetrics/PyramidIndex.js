import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { environment } from "../../environments/environment";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { AiFillWarning } from "react-icons/ai";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import PyramidIndexTable from "./PyramidIndexTable";
import Loader from "../Loader/Loader";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
// import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function PyramidIndex() {
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [view, setView] = useState("BU");
  const [validationmessage, setValidationMessage] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [csl, setCsl] = useState([]);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [dp, setDp] = useState([]);
  const [selectedDp, setSelectedDp] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  console.log(selectedCountry);
  const [tableData, setTableData] = useState([{}]);
  const [HeaderData, setHeaderData] = useState();
  const [displayTableState, setDisplayTableState] = useState(false);
  const [BUValue, setBUValue] = useState("");
  const [CustValue, setCustValue] = useState("");
  const [visible1, setVisible1] = useState(false);
  const [loader, setLoader] = useState(false);
  const ref = useRef([]);
  const abortController = useRef(null);
  const baseUrl = environment.baseUrl;
  let [diablingCustomer, setDiablingCustomer] = useState(true);
  let [diablingProject, setDiablingProject] = useState(true);
  const initialValue = {
    BU: "-1",
    CSL: "-1",
    DP: "-1",
    account: "-1", //Customer
    project: "-1",
    country: "1,2,3,5,6,7,8",
  };
  const [multiRole, setMultiRole] = useState("");
  const [searchdata, setSearchdata] = useState(initialValue);
  console.log(searchdata);
  const loggedUserId = localStorage.getItem("resId");
  const [dataAccess, setDataAccess] = useState([]);
  const [data2, setData2] = useState([]);
  const [routes, setRoutes] = useState([]);
  let textContent = "Utilisation Metrics";
  let currentScreenName = ["Pyramid Index"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const [options, setOptions] = useState([]);
  console.log(selectedDepartments);
  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/pmo/resourcePyramidIndex&userId=${loggedUserId}`,
    }).then((res) => {});
  };
  const getMenus = () => {
    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        let getData = resp.data.map((menu) => {
          if (menu.subMenus) {
            menu.subMenus = menu.subMenus.filter(
              (subMenu) =>
                subMenu.display_name !== "Monthly Revenue Trend" &&
                subMenu.display_name !== "Revenue & Margin Variance" &&
                subMenu.display_name !== "Rev. Projections" &&
                subMenu.display_name !== "Project Timesheet (Deprecated)" &&
                subMenu.display_name !== "Financial Plan & Review" &&
                // subMenu.display_name !== "Billable Utilization Trend" &&
                // subMenu.display_name !== "Utilisation - FY" &&
                // subMenu.display_name !== "NB Work - 4  Prev. Weeks" &&
                subMenu.display_name !== "Practice Calls [Deprecated]"
            );
          }
          return menu;
        });
        setData2(getData);
        const UsersData = getData
          .find((item) => item.display_name === "Utilisation Metrics")
          ?.subMenus.find(
            (subMenu) => subMenu?.display_name === "Pyramid Index"
          )?.userRoles;
        const updatedOptions = [];
        const hasCSLRole = UsersData?.includes("641");
        const hasDPRole = UsersData?.includes("690");
        if (!hasCSLRole && !hasDPRole) {
          updatedOptions.push({ label: "Bussiness Unit", value: "BU" });
          updatedOptions.push({ label: "CSL", value: "CSL" });
          updatedOptions.push({ label: "DP", value: "DP" });
        }
        hasCSLRole ? updatedOptions.push({ label: "CSL", value: "CSL" }) : "";
        hasDPRole ? updatedOptions.push({ label: "DP", value: "DP" }) : "";

        setOptions(updatedOptions);
        setSelectedOption(updatedOptions[0].value);

        getData.forEach((item) => {
          if (item.display_name === textContent) {
            setRoutes([item]);
            sessionStorage.setItem("displayName", item.display_name);
          }
        });
        const pyramidIndexSubMenu = getData
          .find((item) => item.display_name === "Utilisation Metrics")
          .subMenus.find((subMenu) => subMenu.display_name === "Pyramid Index");
        const accessLevel =
          pyramidIndexSubMenu.userRoles === "641"
            ? 641
            : pyramidIndexSubMenu.userRoles === "690"
            ? 690
            : pyramidIndexSubMenu.userRoles.includes("641") &&
              pyramidIndexSubMenu.userRoles.includes("690")
            ? "620"
            : null;

        console.log("Access Level:", accessLevel);

        setDataAccess(accessLevel);
        getCsl(accessLevel);
        getDP(accessLevel);
      });
  };

  console.log(multiRole == 641, 690 ? "daddy" : "sissy");
  console.log(multiRole == "641,690" ? "mummy" : "franu");
  const handleViewBy = (e) => {
    const { name, value } = e.target;
    GlobalCancel(ref);
    setView(value);
    setSearchdata(initialValue);
    setSelectedDepartments([]);
    setSelectedCsl([]);
    setSelectedDp([]);
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

  {
    /*----------------Getting BU---------------- */
  }

  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`, //13
    });

    let departments = resp.data;
    departments = departments.filter((ele) => ele.value >= 0);
    setDepartments(departments);
    let filteredDeptData = [];

    departments.forEach((data) => {
      filteredDeptData.push(data.value);
    });
  };

  {
    /*----------------Getting CSL---------------- */
  }
  console.log(dataAccess);
  useEffect(() => {}, [dataAccess]);
  const getCsl = (a) => {
    console.log(a);
    axios
      .get(
        a == 641 || a == 620
          ? baseUrl + `/CommonMS/master/getCSLDPAE?loggedUserId=${loggedUserId}`
          : baseUrl + `/UtilityMS/PyramidIndex/GetCustomerCslList`
      )
      .then((resp) => {
        let csl = [];
        let data = resp.data;

        data.length > 0 &&
          data.forEach((e) => {
            let obj = {
              label: e.PersonName,
              value: e.id,
            };
            csl.push(obj);
          });
        dataAccess == 641 || dataAccess == 620
          ? ""
          : csl.push({ label: "UnAssigned", value: 999 });
        setCsl(csl);
      });
  };

  {
    /*----------------Getting DP---------------- */
  }
  const getDP = (b) => {
    axios
      .get(
        b == 620 || b == 690
          ? baseUrl + `/CommonMS/master/getDP?loggedUserId=${loggedUserId}`
          : baseUrl + `/UtilityMS/PyramidIndex/getCustomerDelParatnerList`
      )
      .then((resp) => {
        let dp = [];
        let data = resp.data;
        console.log("data>>", data);
        data.length > 0 &&
          data.forEach((e) => {
            let obj = {
              label: e.PersonName,
              value: e.id,
            };
            dp.push(obj);
          });
        dataAccess == 690 || dataAccess == 620
          ? ""
          : dp.push({ label: "UnAssigned", value: 999 });
        setDp(dp);
      });
  };

  useEffect(() => {
    if (dataAccess == 641 || dataAccess == 690) {
      getCsl();
      getDP();
    }
  }, [dataAccess]);
  {
    /*----------------Getting Customers---------------- */
  }

  useEffect(() => {
    axios
      .get(baseUrl + `/UtilityMS/PyramidIndex/getCustomers?buId=${BUValue.ff}`)
      .then((resp) => {
        let customers = resp.data;
        customers = customers.filter(
          (ele) => ele.value >= 0 && ele.value != null
        );
        setCustomers(customers);
        let filteredCustData = [];

        customers.forEach((data) => {
          filteredCustData.push(data.value);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [BUValue]);

  {
    /*----------------Getting Projects---------------- */
  }

  useEffect(() => {
    axios
      .get(
        baseUrl +
          `/UtilityMS/PyramidIndex/getProjects?custId=${CustValue.cc}&buId=${BUValue.ff}`
      )
      .then((resp) => {
        let projects = resp.data;
        projects = projects.filter((ele) => ele.value >= 0);
        setProjects(projects);
        let filteredProjData = [];

        projects.forEach((data) => {
          filteredProjData.push(data.value);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [CustValue]);

  {
    /*-------------------------Getting Countries-------------------------*/
  }
  const getCountries = () => {
    axios
      .get(baseUrl + `/revenuemetricsms/headCountAndTrend/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;

        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.countryName,
              value: e.id,
            };
            countries.push(countryObj);
          });

        //////////--Alphabetical Sorting--//////////
        const sortedcities = countries.sort(function (a, b) {
          var nameA = a.label.toUpperCase();
          var nameB = b.label.toUpperCase();
          if (nameA < nameB) {
            return -1; //nameA comes first
          }
          if (nameA > nameB) {
            return 1; // nameB comes first
          }
          return 0; // names must be equal
        });
        //////////------------------------//////////

        setCountry(sortedcities);
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    let countryList = [];
    country.forEach((d) => {
      countryList.push(d.value);
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["country"]: countryList.toString(),
    }));
  }, [country]);

  {
    /*/////////////////////--------Search Button--------/////////////////////*/
  }
  const handleSearch = (e) => {
    let valid = GlobalValidation(ref);

    if (valid == true) {
      setValidationMessage(true);
      setLoader(false);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
    }

    if (valid) {
      return;
    }

    setLoader(false);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url:
        baseUrl +
        `/UtilityMS/PyramidIndex/GetPyramidIndexHeader?projectIds=${
          searchdata.project == "" ? -1 : searchdata.project
        }&unitId=${searchdata.BU}&accountIds=${
          searchdata.account == "" ? -1 : searchdata.account
        }&CSLIDS=${searchdata.CSL}&DPIDS=${searchdata.DP}`,
    })
      .then((res) => {
        let GetData = res.data;
        console.log(GetData, "Updated Data");
        console.log("Inside GetPyramidIndexHeader axios call.....");
        const sortedData = GetData.sort((a, b) => {
          if (a.value === "Cadre") {
            return -1; // "Cadre" should come first
          }
          if (b.value === "Cadre") {
            return 1; // "Cadre" should come first
          }
          if (a.value === "Ideal") {
            return -1; // "Ideal" should come next
          }
          if (b.value === "Ideal") {
            return 1; // "Ideal" should come next
          }
          return a.value.localeCompare(b.value); // sort by "value" in alphabetical order
        });
        setHeaderData(sortedData);
      })
      .catch((error) => {
        console.log(error);
      });

    axios({
      method: "post",
      url:
        baseUrl +
        `/UtilityMS/PyramidIndex/GetPyramidIndex?projectIds=${
          searchdata.project == "" ? -1 : searchdata.project
        }&unitId=${searchdata.BU}&accountIds=${
          searchdata.account == "" ? -1 : searchdata.account
        }&CSLIDS=${searchdata.CSL}&DPIDS=${searchdata.DP}&countryIds=${
          searchdata.country.length == 0 ? "1,2,3,5,6,7,8" : searchdata.country
        }`,
      signal: abortController.current.signal,
    })
      .then((res) => {
        console.log(res.data, "Table Data");
        let GetData = res.data;

        GetData.map((d) => {
          if (d.cadre == "Pyramid Alignment Index") {
            Object.keys(d).forEach((ele) => {
              if (ele.includes("count") && d[ele] == 0) {
                d[ele] = "";
              }
            });
          }
        });
        console.log("Inside GetPyramidIndex axios call.....");

        setTableData(GetData);
        setDisplayTableState(true);
        setVisible1(true);
        setLoader(false);
        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  {
    /*////////////////////////////--------Abort Call and UseEffects---------///////////////////////////// */
  }
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  useEffect(() => {
    getDepartments();
    getCsl();
    getDP();
  }, [tableData]);

  useEffect(() => {
    getCountries();
  }, []);

  const HelpPDFName = "PyramidIndex.pdf";
  const Headername = "Pyramid Index Help";

  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);

    const allValues = allOptions.map((item) => item.value);

    if (
      selectedValues.length != 0 &&
      selectedValues.length === allValues.length
    ) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  console.log(options);
  const [selectedOption, setSelectedOption] = useState(
    options ? options[0]?.value : ""
  );

  const handleSelectChange = (event) => {
    const resetPropertiesMap = {
      BU: {
        CSL: -1,
        DP: -1,
        BU: selectedDepartments
          .filter((item) => item.value !== undefined)
          .map((item) => item.value)
          .join(","),
      },
      CSL: {
        BU: -1,
        account: -1,
        DP: -1,
        CSL: selectedCsl
          .filter((item) => item.value !== undefined)
          .map((item) => item.value)
          .join(","),
      },
      DP: {
        BU: -1,
        account: -1,
        CSL: -1,
        DP: selectedDp
          .filter((item) => item.value !== undefined)
          .map((item) => item.value)
          .join(","),
      },
    };

    if (resetPropertiesMap.hasOwnProperty(event.target.value)) {
      setSearchdata((prev) => ({
        ...prev,
        ...resetPropertiesMap[event.target.value],
      }));
    }

    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    console.log(selectedOption);
  }, [selectedOption]);
  console.log(dataAccess);
  return (
    <div>
      {/* /////////////////////////Validation Message////////////////////////// */}
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}

      {/* ///////////////////////////////////Title///////////////////////////////////// */}

      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Pyramid Index</h2>
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

      <div>
        <div className="group mb-3 customCard">
          <div className="col-md-12 collapseHeader"></div>
          <CCollapse visible={!visible}>
            <div className="group-content row">
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="ViewBy">
                    View By
                  </label>
                  <span className="col-1">:</span>
                  <div className="multiselect col-6">
                    {/* <select
                      id="ViewBy"
                      name="ViewBy"
                      onChange={handleViewByNew}
                    >
                      {options}
                    </select> */}
                    <select
                      defaultValue={options ? options[0]?.value : ""}
                      id="ViewBy"
                      name="ViewBy"
                      onChange={handleSelectChange}
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {selectedOption == "BU" && (
                <>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="BU">
                        BU
                      </label>
                      <span className="col-1">:</span>
                      <div
                        className="multiselect col-6"
                        ref={(ele) => {
                          ref.current[0] = ele;
                        }}
                      >
                        <MultiSelect
                          ArrowRenderer={ArrowRenderer}
                          id="BU"
                          options={departments}
                          hasSelectAll={true}
                          isLoading={false}
                          shouldToggleOnHover={false}
                          disableSearch={false}
                          value={selectedDepartments}
                          disabled={false}
                          onChange={(s) => {
                            if (s.length != 1) {
                              setDiablingCustomer(true);
                              setDiablingProject(true);
                              setSelectedCustomers([]);
                              setSelectedProjects([]);
                              setBUValue("");
                              setSearchdata((prevVal) => ({
                                ...prevVal,
                                ["account"]: -1,
                              }));
                              setSearchdata((prevVal) => ({
                                ...prevVal,
                                ["project"]: -1,
                              }));
                            } else {
                              setDiablingCustomer(false);
                              let ff = [];
                              s.forEach((d) => {
                                ff.push(d.value);
                              });
                              setBUValue((prevVal) => ({
                                ...prevVal,
                                ff,
                              }));
                            }
                            setSelectedDepartments(s);
                            let filteredValues = [];
                            s.forEach((d) => {
                              filteredValues.push(d.value);
                            });

                            setSearchdata((prevVal) => ({
                              ...prevVal,
                              ["BU"]: filteredValues.toString(),
                            }));
                          }}
                          valueRenderer={generateDropdownLabel}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Customer">
                        Customer
                      </label>
                      <span className="col-1">:</span>
                      <div className="multiselect col-6 ">
                        <MultiSelect
                          ArrowRenderer={ArrowRenderer}
                          id="Customer"
                          className={`multiselect  ${
                            diablingCustomer ? "disableField" : ""
                          }`}
                          options={customers}
                          hasSelectAll={true}
                          isLoading={false}
                          shouldToggleOnHover={false}
                          disableSearch={false}
                          value={selectedCustomers}
                          disabled={diablingCustomer}
                          onChange={(s) => {
                            if (s.length != 1) {
                              console.log(">>>>>>>>>>>>");
                              setSearchdata((prev) => {
                                return { ...prev, project: -1 };
                              });
                              setCustValue("");
                              setDiablingProject(true);
                              setSelectedProjects([]);
                            } else {
                              let cc = [];
                              s.forEach((d) => {
                                cc.push(d.value);
                              });
                              setCustValue((prevVal) => ({
                                ...prevVal,
                                cc,
                              }));
                              setDiablingProject(false);
                            }
                            setSelectedCustomers(s);
                            let filteredValues = [];
                            s.forEach((d) => {
                              filteredValues.push(d.value);
                            });

                            setSearchdata((prevVal) => ({
                              ...prevVal,
                              ["account"]: filteredValues.toString(),
                            }));
                          }}
                          valueRenderer={generateDropdownLabel}
                        />
                      </div>
                    </div>
                  </div>

                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="Project">
                        Project
                      </label>
                      <span className="col-1">:</span>
                      <div className="multiselect col-6">
                        <MultiSelect
                          ArrowRenderer={ArrowRenderer}
                          id="project"
                          className={`multiselect  ${
                            diablingProject ? "disableField" : ""
                          }`}
                          options={projects}
                          hasSelectAll={true}
                          isLoading={false}
                          shouldToggleOnHover={false}
                          disableSearch={false}
                          value={selectedProjects}
                          disabled={diablingProject}
                          onChange={(s) => {
                            setSelectedProjects(s);
                            let filteredValues = [];
                            s.forEach((d) => {
                              filteredValues.push(d.value);
                            });

                            setSearchdata((prevVal) => ({
                              ...prevVal,
                              ["project"]: filteredValues.toString(),
                            }));
                          }}
                          valueRenderer={generateDropdownLabel}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {selectedOption == "CSL" && (
                // <div className=" col-md-3 mb-2">
                <div className=" col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="CSL">
                      CSL
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="CSL"
                        options={csl}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedCsl}
                        valueRenderer={generateDropdownLabel}
                        onChange={(s) => {
                          setSelectedCsl(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["CSL"]: filteredValues.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {
                selectedOption == "DP" && (
                  // <div className=" col-md-3 mb-2">
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="DP">
                        DP
                      </label>
                      <span className="col-1">:</span>
                      <div
                        className="multiselect col-6"
                        ref={(ele) => {
                          ref.current[0] = ele;
                        }}
                      >
                        <MultiSelect
                          ArrowRenderer={ArrowRenderer}
                          id="DP"
                          options={dp}
                          hasSelectAll={true}
                          isLoading={false}
                          shouldToggleOnHover={false}
                          disableSearch={false}
                          value={selectedDp}
                          onChange={(s) => {
                            setSelectedDp(s);
                            let filteredValues = [];
                            s.forEach((d) => {
                              filteredValues.push(d.value);
                            });

                            setSearchdata((prevVal) => ({
                              ...prevVal,
                              ["DP"]: filteredValues.toString(),
                            }));
                          }}
                          valueRenderer={generateDropdownLabel}
                        />
                      </div>
                    </div>
                  </div>
                )
                // </div>
              }
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Country">
                    Country
                  </label>
                  <span className="col-1">:</span>
                  <div className="multiselect col-6">
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="country"
                      options={country}
                      hasSelectAll={true}
                      value={selectedCountry}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedCountry(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setSearchdata((prevVal) => ({
                          ...prevVal,
                          ["country"]: filteredCountry.toString(),
                        }));
                      }}
                      valueRenderer={generateDropdownLabel}
                    />
                  </div>
                </div>
              </div>
              {/* ---------------------Search Button-------------------- */}
              <div className="col-12 btn-container center mb-2">
                <button
                  type="submit"
                  onClick={handleSearch}
                  className="btn btn-primary"
                >
                  <FaSearch /> Search
                </button>

                {loader ? <Loader handleAbort={handleAbort} /> : ""}
              </div>
            </div>
          </CCollapse>
          {visible1 ? (
            <PyramidIndexTable data={tableData} Header={HeaderData} />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
export default PyramidIndex;
