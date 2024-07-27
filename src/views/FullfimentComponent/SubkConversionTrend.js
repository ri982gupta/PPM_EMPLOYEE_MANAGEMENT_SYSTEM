import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import { AiFillWarning } from "react-icons/ai";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Loader from "../Loader/Loader";
import SubkConversionTable from "./SubkConversionTable";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { BiCheck } from "react-icons/bi";

function SubkConversionTrend() {
  const baseUrl = environment.baseUrl;
  const selectRef = useRef(null);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectType, setSelectType] = useState("BusinessUnit");
  const [project, setProject] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [validationmessage, setValidationMessage] = useState(false);
  const [item, setItem] = useState([]);
  const [loader, setLoader] = useState(false);
  const [csl, setCsl] = useState([]);
  const [selectedCsl, setSelectedCsl] = useState([]);
  const [delivery, setDelivery] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState([]);
  const [tableopen, setTableOpen] = useState(false);
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth() - 4, 1);
  console.log(firstDay);
  const [month, setMonth] = useState(moment(moment().startOf("month"))._d);

  var maxDate = new Date();
  var year = maxDate.getFullYear();
  var month1 = maxDate.getMonth();
  var minDate = new Date(year, month1 - 11);
  var maxDate = new Date(year, month1 + 11);

  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [searching, setsearching] = useState(false);
  console.log(searching);
  const [open, setOpen] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [displayTable, setDisplayTable] = useState(null);
  const [tabHeaders, setTabHeaders] = useState([]);
  const [tableTitle, srtTableTitle] = useState();
  const [custVisible, setCustVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const ref = useRef([]);
  const abortController = useRef(null);

  const [duration, setDuration] = useState([]);

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const initialValue = {
    month: moment(new Date()).startOf("month").format("YYYY-MM-DD"),
    duration: "1",
    countries: "6,5,3,8,7,1,2",
    searchType: "BusinessUnit",
    busUnits: "BusinessUnit",
    isExport: "0",
    UserId: "512",
  };
  const [formData, setFormData] = useState(initialValue);
  const getAbsoluteMonths = (momentDate) => {
    let mont = Number(moment(momentDate).format("MM"));
    let yea = Number(moment(momentDate).format("YYYY"));
    return mont + yea * 12;
  };

  const calculateDuration = (e) => {
    let startMonths = getAbsoluteMonths(e);
    let endMonths = getAbsoluteMonths(moment());
    let monthDifference = endMonths - startMonths;
    monthDifference += 1;
    let dr = [];
    for (let i = 1; i <= monthDifference; i++) {
      dr.push(i);
    }
    setDuration(dr);
  };

  useEffect(() => {
    calculateDuration(month);
  }, []);

  const getBusinessUnit = () => {
    axios.get(baseUrl + `/CostMS/cost/getDepartments`).then((Response) => {
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
      let filteredDeptData = [];
      countries.push({ value: 999, label: "Non-Revenue Units" });
      countries.forEach((data) => {
        if (data.value != 0) {
          filteredDeptData.push(data.value);
        }
      });
      setSelectedBusiness(countries.filter((ele) => ele.value != 0));
      setFormData((prevVal) => ({
        ...prevVal,
        ["busUnits"]: filteredDeptData.toString(),
      }));
    });
  };

  const getCountries = () => {
    axios.get(baseUrl + `/CostMS/cost/getCountries`).then((Response) => {
      let countries = [];
      let data = Response.data;
      data.length > 0 &&
        data.forEach((e) => {
          let countryObj = {
            label: e.country_name,
            value: e.id,
          };
          if (e.country_name !== "NM") {
            countries.push(countryObj);
          }
        });
      setCountry(countries);
      let filteredDeptData = [];
      countries.forEach((data) => {
        if (data.value != 0) {
          filteredDeptData.push(data.value);
        }
      });
      setSelectedCountry(countries);
      setFormData((prevVal) => ({
        ...prevVal,
        ["countries"]: filteredDeptData.toString(),
      }));
    });
  };

  const getDeliveryPartners = () => {
    axios
      .get(baseUrl + `/administrationms/subkconversiontrend/getdeliverypartner`)
      .then((Response) => {
        let deliver = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let deliverObj = {
              label: e.PersonName,
              value: e.id,
            };
            deliver.push(deliverObj);
          });
        setDelivery(deliver);
        setSelectedDelivery(deliver.filter((ele) => ele.value != 0));
        let filteredDelivery = [];
        deliver.forEach((data) => {
          if (data.value != 0) {
            filteredDelivery.push(data.value);
          }
        });
        setFormData((prevVal) => ({
          ...prevVal,
          ["DP"]: filteredDelivery.toString(),
        }));
      });
  };

  const getProjectdata = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectNameandId`,
    }).then(function (response) {
      var resp = response.data;
      setProject(resp);
    });
  };

  const handleCsl = () => {
    const loggedUserId = localStorage.getItem("resId");
    axios({
      method: "get",
      url:
        baseUrl +
        `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`,
    }).then((res) => {
      let custom = [];
      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let cslObj = {
            label: e.PersonName,
            value: e.id,
          };
          custom.push(cslObj);
        });
      setCsl(custom);
      setSelectedCsl(custom.filter((ele) => ele.value != 0));
      let filteredCsl = [];
      custom.forEach((data) => {
        if (data.value != 0) {
          filteredCsl.push(data.value);
        }
      });
      setFormData((prevVal) => ({
        ...prevVal,
        ["csl"]: filteredCsl.toString(),
      }));
    });
  };

  useEffect(() => {
    getBusinessUnit();
    getCountries();
    getProjectdata();
    handleCsl();
    getDeliveryPartners();
  }, [item]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setOpen(false);
    setSelectType(value);
    setFormData({ ...formData, [id]: value });
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    if (name == "Customer" && value === "select") {
      setCustVisible(true);
    }
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    if (data.length > 0) {
      let headers = Object.keys(data[0])
        .filter((d) => d != "id" && d != "lvl")
        .sort();
      headers.splice(0, 0, headers.splice(headers.length - 2, 1)[0]);

      setTabHeaders(headers);
    }
  }, [data]);

  const GetFteHCResDtls = (val) => {
    axios({
      method: "post",
      url: baseUrl + `/administrationms/subkconversiontrend/GetFteHCResDtls`,
      data: {
        FromDate: formData.month,
        Duration: formData.duration,
        CountryIds: formData.countries,
        searchType: formData.searchType,
        serarchVals:
          val.b == 0
            ? data
                .filter((d) => d.id > 0)
                .map((d) => d.id > 0 && d.id)
                .toString()
            : val.b,
        isExport: 0,
        UserId: 0,
        colVal: val.a,
      },
    }).then((response) => {
      var response = response.data;
      let Headerdata = [
        {
          employee_number: "Emp ID",
          resource_name: "Name",
          start_date: "DOJ",
          department: "Department",
          projects: "Projects",
          customer: "Customers",
          supervisor: "Supervisor",
          prjMgr: "Project Manager",
          csl: "CSL",
          dp: "DP",
          allocation_start_dt: "Alloc Start Date",
          allocation_end_dt: "Alloc End Date",
        },
      ];
      let hData = [];
      let bData = [];
      for (let index = 0; index < response.length; index++) {
        if (index == 0) {
          hData.push(response[index]);
        } else {
          bData.push(response[index]);
        }
      }
      setData1(Headerdata.concat(bData));
      setLoader(false);
      setTimeout(() => {
        setRefresh(false);
        setOpen(true);
        setLoader(false);
      }, 1000);
      setHeaderData(hData);
      setBodyData(bData);
    });
  };

  const [myCol, setMyCol] = useState("");
  const [myCol1, setMyCol1] = useState("");

  const onclickHandler = (a, b) => {
    setTableOpen(true);
    setRefresh(false);
    const temp = {};
    temp["a"] = a;
    temp["b"] = b;
    setMyCol(a);
    setMyCol1(b);
    GetFteHCResDtls(temp);
    srtTableTitle(a);
  };

  useEffect(() => {
    console.log(myCol);
  }, [myCol, myCol1]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const displayTableFnc = () => {
    setDisplayTable(() => {
      return data.map((element, index) => {
        let tabData = [];
        tabHeaders.forEach((inEle, inInd) => {
          if (index === 0) {
            let value = ("" + element[inEle]).includes("^&1")
              ? element[inEle].replaceAll("^&1", " ")
              : element[inEle];
            tabData.push(
              <th
                key={inInd}
                style={{
                  textAlign: "center",
                  backgroundColor: "#eeeeee",
                }}
                title={element[inEle]}
              >
                {value}
              </th>
            );
          } else {
            if (index === 1) {
              tabData.push(
                <td align={inInd > 0 ? "right" : "left"}>
                  <b>
                    {inEle == "avarage" ? (
                      <span
                        onClick={() => {
                          inInd > 0 && element[inEle] != 0
                            ? onclickHandler(inEle, element.id)
                            : null;
                        }}
                        title={element[inEle]}
                      >
                        {element[inEle]}
                      </span>
                    ) : (
                      <span
                        style={{
                          cursor:
                            inInd > 0 && element[inEle] != 0 ? "pointer" : "",
                          color:
                            inInd != 0 && element[inEle] != 0 ? "#2e88c5" : "",
                          textDecoration:
                            inInd != 0 && element[inEle] != 0
                              ? "underline"
                              : null,
                        }}
                        onClick={() => {
                          inInd > 0 && element[inEle] != 0
                            ? onclickHandler(inEle, element.id)
                            : null;
                        }}
                        title={element[inEle]}
                      >
                        {element[inEle]}
                      </span>
                    )}
                  </b>
                </td>
              );
            } else {
              tabData.push(
                <td align={inInd > 0 ? "right" : "left"}>
                  {inEle == "avarage" ? (
                    <span
                      onClick={() => {
                        inInd > 0 && element[inEle] != 0
                          ? onclickHandler(inEle, element.id)
                          : null;
                      }}
                      title={element[inEle]}
                    >
                      {element[inEle]}
                    </span>
                  ) : (
                    <span
                      style={{
                        cursor:
                          inInd > 0 && element[inEle] != 0 ? "pointer" : "",
                        color:
                          inInd != 0 && element[inEle] != 0 ? "#2e88c5" : "",
                        textDecoration:
                          inInd != 0 && element[inEle] != 0 ? "underline" : "",
                      }}
                      onClick={() => {
                        inInd > 0 && element[inEle] != 0
                          ? onclickHandler(inEle, element.id)
                          : null;
                      }}
                      title={element[inEle]}
                    >
                      {element[inEle]}
                    </span>
                  )}
                </td>
              );
            }
          }
        });
        return (
          <tr
            style={{ backgroundColor: index === 1 ? "#f5d5a7 " : "#d8eaeac4" }}
            key={index}
          >
            {tabData}
          </tr>
        );
      });
    });
  };

  useEffect(() => {
    displayTableFnc();
  }, [tabHeaders]);

  const [selectedItems, setSelectedItems] = useState([{}]);
  const Customer = selectedItems?.map((d) => d?.id).toString();

  useEffect(() => {}, [item], [Customer], [formData.serarchVals]);

  const [columns, setColumns] = useState([]);
  console.log(columns);
  const [details, setDetails] = useState([]);
  console.log(details);

  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();

  const handleClick = () => {
    setTableOpen(false);
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid == true) {
      setValidationMessage(true);
    }
    if (valid) {
      return;
    }

    setsearching(true);
    setLoader(false);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/administrationms/subkconversiontrend/getFteHCount`,
      signal: abortController.current.signal,

      data: {
        FromDate: moment(formData.month).startOf("month").format("YYYY-MM-DD"),
        Duration: formData.duration,
        CountryIds: formData.countries,
        searchType: formData.searchType,
        serarchVals:
          selectType == "BusinessUnit"
            ? formData.busUnits
            : selectType == "DP"
            ? formData.DP
            : selectType == "CSL"
            ? formData.csl
            : selectType == "Project"
            ? formData.Project
            : selectType == "Customer" && formData.Customer == 0
            ? 0
            : selectType == "Customer" && formData.Customer == -1
            ? -1
            : selectedCust,
        isExport: 0,
        UserId: 512,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const data = response.data;
      setData(data);
      !valid && setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      let detail = response.data;
      setDetails(detail);

      axios({
        method: "get",
      }).then((res1) => {
        let header = res1.data.val;
        let splt = header.replaceAll('"', "");
        let st = splt.replaceAll("`", "");
        let columnArray = st.split(",");
        let colArr = columnArray
          .map((d) => d.replaceAll("'", ""))
          .filter((d) => d != "id");

        setColumns(colArr);
      });
      setsearching(false);
      setValidationMessage(false);
      setLoader(false);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    });
  };

  useEffect(() => {
    console.log(selectType);
  }, [selectType]);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Vendors";
  let currentScreenName = ["Subk Conversion Trend"];
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
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

const modifiedUrlPath = "/vmg/fteCount";
      getUrlPath(modifiedUrlPath);
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

  const getUrlPath = (modifiedUrlPath) => {
    console.log(modifiedUrlPath);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
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

  return (
    <div>
      {validationmessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please select valid values for highlighted fields
        </div>
      ) : (
        ""
      )}

      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Subk Conversion Trend</h2>
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
          </div>{" "}
        </div>
      </div>

      <div className="group mb-3 customCard ">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Month">
                  Start Month&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <DatePicker
                    name="month"
                    id="StartDt"
                    minDate={minDate}
                    selected={month}
                    onChange={(e) => {
                      const elementToChange =
                        document.getElementById("duration");
                      elementToChange.value = 0;
                      calculateDuration(e);
                      setFormData((prev) => ({
                        ...prev,
                        ["month"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setMonth(e);
                    }}
                    dateFormat="MMM-yyyy"
                    maxDate={new Date()}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Duration&nbsp;
                  <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    className="text"
                    id="duration"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="0"> &lt;&lt;Please Select&gt;&gt;</option>
                    {duration.map((d) => (
                      <option value={d} selected={d === 1}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="searchType">
                  {" "}
                  Search Type&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="cancel text"
                    name="searchType"
                    id="searchType"
                    onChange={handleChange}
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    <option value="BusinessUnit" selected>
                      Business Unit
                    </option>
                    <option value="Customer">Customer</option>
                    <option value="Project">Project</option>
                    <option value="CSL">CSL</option>
                    <option value="DP">Delivery Partner</option>
                  </select>
                </div>
              </div>
            </div>
            {selectType == "BusinessUnit" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="busUnits">
                    Business Unit&nbsp;
                    <span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="busUnits"
                      options={business}
                      hasSelectAll={true}
                      value={selectedBusiness}
                      disabled={false}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      valueRenderer={generateDropdownLabel}
                      onChange={(e) => {
                        setSelectedBusiness(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["busUnits"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {selectType == "Customer" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="Customer">
                    Customer&nbsp;
                    <span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <select
                      className="cancel Text"
                      name="Customer"
                      id="Customer"
                      onChange={handleChange1}
                    >
                      {selectedItems.length + "selected"}
                      <option value={-1}> &lt;&lt;All&gt;&gt;</option>
                      <option value={0} selected>
                        Active Customers
                      </option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {selectType == "Project" ? (
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="email-input">
                    Project<span className="error-text ml-1">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div className="col-6">
                    <div
                      className="autoComplete-container react  reactsearchautocomplete"
                      id="autocomplete reactautocomplete"
                      ref={(ele) => {
                        ref.current[4] = ele;
                      }}
                    >
                      <ReactSearchAutocomplete
                        items={project}
                        type="Text"
                        name="Project"
                        id="Project"
                        className="error AutoComplete"
                        onSelect={(e) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            Project: e.id,
                          }));
                        }}
                        showIcon={false}
                        placeholder="Type/Press space to get the list"
                      />
                      <span>{item.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {selectType == "CSL" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="csl">
                    CSL&nbsp;
                    <span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[5] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="csl"
                      options={csl}
                      hasSelectAll={true}
                      value={selectedCsl}
                      shouldToggleOnHover={false}
                      valueRenderer={generateDropdownLabel}
                      disableSearch={false}
                      selected={selectedCsl}
                      disabled={false}
                      isLoading={false}
                      onChange={(e) => {
                        setSelectedCsl(e);
                        let filteredCustomer = [];
                        e.forEach((d) => {
                          filteredCustomer.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["csl"]: filteredCustomer.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {selectType == "DP" ? (
              <div className=" col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="DP">
                    Delivery Partner&nbsp;
                    <span className="error-text">*</span>
                  </label>
                  <span className="col-1 p-0">:</span>
                  <div
                    className="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[6] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="DP"
                      options={delivery}
                      hasSelectAll={true}
                      isLoading={false}
                      valueRenderer={generateDropdownLabel}
                      value={selectedDelivery}
                      selected={selectedDelivery}
                      disabled={false}
                      disableSearch={false}
                      shouldToggleOnHover={false}
                      onChange={(e) => {
                        setSelectedDelivery(e);
                        let filteredDelivery = [];
                        e.forEach((d) => {
                          filteredDelivery.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["DP"]: filteredDelivery.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className=" col-md-3 mb-3">
              <div className="form-group row">
                <label className="col-5" htmlFor="ResLocation">
                  Res. Location&nbsp;
                  <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">&nbsp;&nbsp;&nbsp;:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[7] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="countries"
                    name="ResLocation"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    valueRenderer={generateDropdownLabel}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["countries"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12  btn-container center">
              <button
                type="submit"
                className="btn btn-primary "
                onClick={() => {
                  handleClick();
                }}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
          {loader ? <Loader handleAbort={handleAbort} /> : ""}
          {refresh ? <Loader handleAbort={handleAbort} /> : ""}
        </CCollapse>
      </div>

      <div className="SubkTable">
        <table
          className="table table-bordered customCard   my-2 darkHeader toHead"
          style={{ width: "auto", marginTop: "-11px", float: "left" }}
        >
          <thead>{displayTable}</thead>
        </table>
      </div>

      <SelectCustDialogBox
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
      />

      {open === true && tableopen ? (
        <SubkConversionTable
          myCol={myCol}
          myCol1={myCol1}
          data1={data1}
          refresh={refresh}
          setRefresh={setRefresh}
          headerData={headerData}
          setBodyData={setBodyData}
          bodyDataa={bodyData}
          tableTitle={tableTitle}
          formData={formData}
          rows={5}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default SubkConversionTrend;
