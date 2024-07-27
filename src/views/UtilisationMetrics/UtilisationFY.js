import React, { useState, useEffect, useRef } from "react";
import { CCollapse } from "@coreui/react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import Loader from "../Loader/Loader";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { environment } from "../../environments/environment";
import UtilizationFyCollapsibleTable from "./UtilizationFyCollapsibleTable";
import { RiFileExcel2Line } from "react-icons/ri";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import * as XLSX from "xlsx";
import { AiFillWarning } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { FaCaretDown } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import SavedSearchGlobal from "../PrimeReactTableComponent/SavedSearchGlobal";
import { BiCheck } from "react-icons/bi";
// import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import ExcelJS from "exceljs";
function UtilisationFY() {
  // const loggedUserId=512
  const loggedUserId = localStorage.getItem("resId");
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [loader, setLoader] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [business, setBusiness] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [allocType, setAllocType] = useState([]);
  const [selectedAllocType, setSelectedAllocType] = useState([]);
  const [validationmessage, setValidationMessage] = useState(false);

  const abortController = useRef(null);

  const [tableData, setTableData] = useState([]);
  const [details, setDetails] = useState([]);
  const [columns, setColumns] = useState([]);

  const ref = useRef([]);
  const initialValue = {
    BuIds: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    CountryIds: "6,5,3,8,7,1,2",
    resType: "fte",
    lkup_name: "-1",
  };

  const pageurl = "http://10.11.12.149:3000/#/operational/staffUtilization";
  const page_Name = "Staff Utilization";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [editmsg, setEditAddmsg] = useState(false);
  const [filterData, setFilterData] = useState([]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Utilisation Metrics";
  let currentScreenName = ["Utilisation - FY"];
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
      const modifiedUrlPath = "/operational/staffUtilization";
      getUrlPath(modifiedUrlPath);

      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
    });
  };
  const getUrlPath = (modifiedUrlPath) => {
    console.log(modifiedUrlPath, "inlne294-------------------------");
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {})
      .catch((error) => {});
  };
  const FilterData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/dashboardsms/savedsearch/FiltersData?saved_search_id=${
          id === null ? 0 : id
        }`,
    }).then(function (res) {
      const getData = res.data;
      setFilterData(getData);
    });
  };

  useEffect(() => {
    FilterData();
  }, []);
  const [formData, setFormData] = useState({
    // BuIds: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    // CountryIds: "6,5,3,8,7,1,2",
    // resType: "fte",
    // lkup_name: "-1",
  });

  useEffect(() => {
    setFormData(() => {
      if (id != null) {
        return {
          BuIds: filterData.buIds || filterData.BuIds,
          CountryIds: filterData.countryIds || filterData.CountryIds,
          resType: filterData.type || filterData.resType,
          lkup_name: filterData.allocType || filterData.lkup_name,
        };
      } else {
        return {
          BuIds: "170,211,123,82,168,207,212,18,213,49,149,208,243",
          CountryIds: "6,5,3,8,7,1,2",
          resType: "fte",
          lkup_name: "-1",
        };
      }
    });
  }, [filterData]);
  useEffect(() => {
    if (id != null) {
      const updatebuids = business.filter((values) =>
        filterData.BuIds?.includes(values.value)
      );

      const updateCountry = country.filter((values) =>
        filterData.CountryIds?.includes(values.value)
      );

      const updateallocType = allocType.filter((values) =>
        formData.lkup_name?.includes(values.value)
      );
      if (formData.lkup_name == "-1") {
        setSelectedAllocType(allocType);
      } else {
        setSelectedAllocType(updateallocType);
      }
      setSelectedCountry(updateCountry);
      setSelectedBusiness(updatebuids);
    }
  }, [
    id,
    business,
    allocType,
    country,
    filterData?.BuIds,
    filterData.CountryIds,
  ]);

  useEffect(() => {
    if (id != null) {
      setTimeout(() => {
        handleSearch();
      }, 3000);
    }
  }, [formData]);

  const handleSearch = () => {
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setValidationMessage(true);
        setTimeout(() => {
          setValidationMessage(false);
        }, 3000);
      }
      return;
    }
    getTableData();
  };

  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getDepartments`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.push({ value: 999, label: "Non-Revenue Units" });
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.label,
              value: e.value,
            };
            countries.push(countryObj);
          });
        setBusiness(countries);
        let defaultSelected = JSON.parse(JSON.stringify(countries)).filter(
          (d) => d.label.includes("Non-Revenue Units") == false
        );
        if (id == null) {
          setSelectedBusiness(defaultSelected);
        }
      })
      .catch((error) => console.log(error));
  };
  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        // data.push({ id: 0, country_name: "<<Others>>" });
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            {
              e.country_name == "NM" ? "" : countries.push(countryObj);
            }
          });
        setCountry(countries);
        if (id == null) {
          setSelectedCountry(countries);
        }
      })
      .catch((error) => console.log(error));
  };

  const getAllocTypes = () => {
    axios
      .get(baseUrl + `/UtilityMS/getAllocType`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        // data.push({ id: 0, lkup_name: "<<Others>>" });
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.lkup_name,
              value: e.id,
            };
            countries.push(countryObj);
          });
        setAllocType(countries);
        if (id == null) {
          setSelectedAllocType(countries);
        }
      })
      .catch((error) => console.log(error));
  };

  const getTableData = () => {
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setLoader(false);

    abortController.current = new AbortController();
    axios({
      method: "post",
      url:
        baseUrl +
        `/UtilityMS/getUtilizationFyc?buIds=${formData.BuIds}&countryIds=${formData.CountryIds}&type=${formData.resType}&allocType=${formData.lkup_name}&isExport=0&UserId=${loggedUserId}`,
      signal: abortController.current.signal,
    })
      .then((res) => {
        let detail = res.data;
        setDetails(detail);

        axios({
          method: "get",
          url:
            baseUrl + `/UtilityMS/getColumnsData?reportRunId=${loggedUserId}`,
        }).then((res1) => {
          let header = res1.data.val;
          setColumns(header);

          const obj = {};
          obj["columns"] = header;
          obj["tableData"] = detail;

          setTableData(obj);
          setLoader(false);
          clearTimeout(loaderTime);
          setSearching(true);
          setValidationMessage(false);
          let valid = GlobalValidation(ref);
          !valid && setVisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
        });
      })
      .then((error) => {
        console.log("success", error);
      });
  };

  useEffect(() => {
    getBusinessUnit();
    getCountries();
    getAllocTypes();
    getTableData();
  }, []);

  useEffect(() => {
    if (id === null) {
      setTimeout(() => {
        handleSearch();
      }, 2000);
    }
  }, [business, country]);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  // ================
  const handleOnExport = () => {
    const excludeProperties = [
      "lvl",
      "departmentId",
      "count",
      "keyAttr",
      "parentId",
      "empStatus",
      "id",
    ];
    const headerRow1 = Object.keys(details[0])
      .filter((key) => !excludeProperties.includes(key))
      .map((key) => {
        const val = details[0][key].split("^&");
        return { key, displayValue: val[0] };
      });
    const dateBasedHeaders = headerRow1
      .filter((item) => item.key.match(/^\d{4}_\d{2}_\d{2}_/))
      .map((item) => item.key);
    dateBasedHeaders.sort();
    const customOrder = [
      "name",
      "emp_cadre",
      "supervisor",
      "ytd",
      ...dateBasedHeaders,
      "qtd",
      "nxt30_days",
      "nxt60_days",
      "average",
    ];
    const sortedHeaderRow1 = customOrder.map((key) => {
      const foundItem = headerRow1.find((item) => item.key === key);
      return foundItem ? foundItem.displayValue : "";
    });
    const filteredData = details.slice(1).map((item) => {
      const filteredItem = Object.fromEntries(
        Object.entries(item).filter(([key]) => !excludeProperties.includes(key))
      );
      return filteredItem;
    });
    const addSpacesBasedOnIndex = (index, value, item, key) => {
      return key === "name" &&
        item.resource.length > 0 &&
        item.supervisor.length > 0
        ? `    ${value}`
        : value;
    };
    const dataRows = filteredData.map((item, index) => {
      return customOrder.map((key) =>
        addSpacesBasedOnIndex(index, item[key] ? item[key] : "", item, key)
      );
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("UtilizationFY Report");
    const headerRow = worksheet.addRow(sortedHeaderRow1);
    for (let i = 0; i < dataRows.length; i++) {
      const row = worksheet.addRow(dataRows[i]);
    }
    const boldRow = [1];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "UtilizationFY Report.xlsx");
    });
  };

  //===================

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  const HelpPDFName = "SegmentationFinancials.pdf";
  const Headername = "Segmentation Help";

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
      {editmsg ? (
        <div className="statusMsg success">
          <span className="errMsg">
            <BiCheck size="1.4em" /> &nbsp; Search created successfully.
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Utilisation - FY</h2>
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
            <div className="saveBtn">
              <SavedSearchGlobal
                setEditAddmsg={setEditAddmsg}
                pageurl={pageurl}
                page_Name={page_Name}
                payload={formData}
              />
            </div>
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>
        </div>
      </div>

      {loader ? <Loader handleAbort={handleAbort} /> : ""}

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 ">
              <div className="form-group row">
                <label className="col-5" htmlFor="searchType">
                  BU&nbsp;
                  <span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1 ">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="BuIds"
                    value={selectedBusiness}
                    options={business}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    valueRenderer={generateDropdownLabel}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<<Please Select>>",
                    }}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedBusiness(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["BuIds"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 ">
              <div className="form-group row">
                <label className="col-5 " htmlFor="resType">
                  Country&nbsp;
                  <span className="col-1 p-0 error-text">*</span>
                </label>
                <span className="col-1 ">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="CountryIds"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    valueRenderer={generateDropdownLabel}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<<Please Select>>",
                    }}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["CountryIds"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 ">
              <div className="form-group row">
                <label className="col-5" htmlFor="resLocation">
                  Res. Type
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="resType"
                    name="resType"
                    defaultValue="fte"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                    value={formData.resType}
                  >
                    <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>
                    <option value="fte">Employee</option>
                    <option value="subk">Contractors</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 ">
              <div className="form-group row">
                <label className="col-5" htmlFor="duration">
                  Alloc. Type{" "}
                </label>
                <span className="col-1 ">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="lkup_name"
                    options={allocType}
                    hasSelectAll={true}
                    value={selectedAllocType}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    disabled={false}
                    valueRenderer={generateDropdownLabel}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<<Please Select>>",
                    }}
                    onChange={(e) => {
                      setSelectedAllocType(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["lkup_name"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/*                                          Search                                   */}
          <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 ">
            <button
              className="btn btn-primary"
              type="submit"
              onClick={() => {
                handleSearch();
                setSearching(false);
              }}
            >
              <FaSearch /> Search
            </button>
          </div>
        </CCollapse>
      </div>
      {searching == true ? (
        <>
          <div className="col-md-12 clearfix" style={{ height: "5px" }}>
            <div>
              <span>
                <span style={{ color: "#9d7c42", fontStyle: "italic" }}>
                  <BsInfoCircle style={{ marginTop: "-5px" }} /> Values are of
                  Actual Utilization for past quarters and Planned Utilization
                  for future quarters
                </span>
              </span>
            </div>
          </div>

          <div align="right">
            <RiFileExcel2Line
              size="1.5em"
              title="Export to Excel"
              style={{ color: "green", float: "right" }}
              cursor="pointer"
              onClick={handleOnExport}
            />
            <br />
          </div>
          <div>
            <UtilizationFyCollapsibleTable
              data={tableData}
              expandedCols={["emp_cadre", "supervisor"]}
              colExpandState={["0", "0", "name"]}
            />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
export default UtilisationFY;
