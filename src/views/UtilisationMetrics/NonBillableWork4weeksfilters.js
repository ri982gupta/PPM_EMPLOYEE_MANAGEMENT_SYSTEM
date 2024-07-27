import React, { useEffect, useRef, useState } from "react";

import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
  FaCheck,
  FaPlus,
  FaSave,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import Loader from "../Loader/Loader";
import axios from "axios";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import NonBillableCollapsibleTable from "./NonBillableCollapsibleTable";
import { RiFileExcel2Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import { GrCircleInformation } from "react-icons/gr";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import moment from "moment";
import ExcelJS from "exceljs";
import { BsInfoCircle } from "react-icons/bs";

function NonBillableWork4Weeks() {
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [loader, setLoader] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedDeptid, setSelectedDeptId] = useState([]);
  const [deptId, setdeptId] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [country, setCountry] = useState([]);
  const [searchDataC, setSeachDataC] = useState("6,5,3,8,7,1,2,0");
  const [contractTermsId, setContractTermsId] = useState(
    "188,189,191,804,805,1031"
  );

  const [searchDataB, setSearchDataB] = useState(
    "170,211,123,82,168,207,212,18,213,49,149,208,243"
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
  const [buValues, setBuValues] = useState([]);
  const [selectBuValues, setSelectBuValues] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectCountry, setSelectCountry] = useState([]);
  const [tabData, setTabData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [details, setDetails] = useState([]);
  const [allocTypeId, setAllocTypeId] = useState("188,189,191,804,805,1031");
  const [validationmessage, setValidationMessage] = useState(false);
  const [displaytable, setDisplayTable] = useState(false);
  const ref = useRef([]);
  const loggedUserId = localStorage.getItem("resId");
  ///////////////////////////////////////
  const tableData1 = details || [];
  const filteredRows = [];
  const patternToExclude = /^(\d{2}-[A-Za-z]{3}-\d{2}\^&\d\^&\d)$/;
  tableData1.forEach((item) => {
    for (const key in item) {
      if (
        key.endsWith("_wk") &&
        parseFloat(item[key]) > 0 &&
        item.resource !== "Resource"
      ) {
        const resource = item.resource;
        const week = key.replace(/_wk$/, "");
        const hours = item[key];
        filteredRows.push({
          department: item.department,
          filteredResources: resource,
          project: item.project,
          name: item.name,
          emp_cadre: item.emp_cadre,
          supervisor: item.supervisor,
          filteredDates: formatDate(week),
          filteredHours: hours,
        });
      } else {
      }
    }
  });
  function formatDate(week) {
    const parts = week.split("_");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${year}-${month}-${day}`;
  }
  /////////////////////////////////////////////////
  const filteredHours = [];
  tableData1.forEach((item) => {
    if (item.id !== "0") {
      for (const key in item) {
        if (
          key.endsWith("_wk") &&
          parseFloat(item[key]) > 0 &&
          !patternToExclude.test(item[key])
        ) {
          filteredHours.push(item[key]);
        }
      }
    }
  });
  ///////////////////////////////////////////////////////
  const filteredResources = [];

  tableData1.forEach((item) => {
    for (const key in item) {
      if (key.endsWith("_wk") && parseFloat(item[key]) > 0) {
        // Extract the resource name from the key (assuming resource name doesn't contain "_wk").
        const resource = item.resource;
        if (resource && resource !== "Resource") {
          filteredResources.push(resource);
        }
      }
    }
  });

  const [routes, setRoutes] = useState([]);
  let textContent = "Utilisation Metrics";
  let currentScreenName = ["NB Work - 4 Prev. Weeks"];
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
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/operational/nonBillWork";
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
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => {
        let getData = res.data;
        console.log(getData);
      })
      .catch((error) => {});
  };
  const getBuValue = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getDepartments`)
      .then((res) => {
        const data = res.data;
        const getBUval = data.map((e) => {
          return {
            value: e.value,
            label: e.label,
          };
        });
        setBuValues(getBUval);
        setSelectBuValues(getBUval);
      })
      .catch((err) => {});
  };

  const handleCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((res) => {
        const countryData = res.data;
        const getCounData = countryData.map((e) => {
          return {
            value: e.id,
            label: e.country_name,
          };
        });
        setCountries(getCounData);
        setSelectCountry(getCounData);
      })
      .catch((err) => {});
  };

  const allocData = [
    { value: 188, label: "Non Billable Shadow" },
    { value: 189, label: "Non Billable Enablement" },
    { value: 191, label: "Non Billable Utilized" },
    { value: 804, label: "Billable Client Prep" },
    { value: 805, label: "Non Billable Non Utilized" },
    { value: 1031, label: "Non-billable Innov" },
  ];
  const [selectAllocData, setSelectAllocData] = useState(allocData);
  const getCountries = () => {
    axios
      .get(baseUrl + `/dashboardsms/Dashboard/getCountry`)
      .then((Response) => {
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
  const bussinessUnitDepartment = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });
    let departments = resp.data;
    departments.push({ value: 999, label: "Non-Revenue Units" });
    setdeptId(departments);
    setSelectedDeptId(departments.filter((ele) => ele.value != 999));
    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 999) {
        filteredDeptData.push(data.value);
      }
    });
  };
  const [tableData, setTableData] = useState([]);
  const currentDate = moment(new Date()).format("yyyy-MM-DD");
  const handleClick = () => {
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
    !valid && setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
    axios({
      method: "post",
      url:
        baseUrl +
        `/timeandexpensesms/getNonBillable/getNonBillableWorks?buIds=${searchDataB}&country=${searchDataC}&allocTypeIds=${contractTermsId}&curDt=${currentDate}&isExport=0&userId=${loggedUserId}`,
      // "http://localhost:8090/timeandexpensesms/getNonBillable/getNonBillableWorks?buIds=170,211,123,82,168,207,212,18,213,49,149,208,243&countryIds=6,5,3,8,7,1,2,0&allocTypeIds=188,189,191,804,805,1031&curDt=2023-03-15&isExport=0&userId=512",
    }).then((res) => {
      let detail = res.data.tableData;
      let cols = res.data.columns?.replaceAll("'", "").split(",");
      setDetails(detail);
      setTableData(res.data);
      setDisplayTable(true);
      setColumns(cols);
      setValidationMessage(false);
      setLoader(false);
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
  useEffect(() => {
    handleCountries();
    getBuValue();
    bussinessUnitDepartment();
    getCountries();
  }, []);
  const handleOnExport = () => {
    const customHeaders = {
      department: "Department",
      filteredResources: "Resource",
      project: "Project",
      name: "Project Code",
      emp_cadre: "Cadre",
      supervisor: "Supervisor",
      filteredDates: "Week",
      filteredHours: "Hours",
    };
    const columnOrder = [
      "department",
      "filteredResources",
      "project",
      "name",
      "emp_cadre",
      "supervisor",
      "filteredDates",
      "filteredHours",
    ];
    const excludeProperties = Object.keys(customHeaders);
    const dataRows = filteredRows
      .filter(
        (item) =>
          item.filteredResources !== "" &&
          // item.emp_cadre !== "" &&
          item.project !== "" &&
          item.supervisor !== "" &&
          parseFloat(item.filteredHours) > 0 // Include rows where filteredHours > 0
      )
      .map((item) => {
        return columnOrder.map((column) => {
          if (column === "name") {
            const matches = item.name.match(/\((P[^)]+)\)/);
            const matchesProejct = item.name;
            return matches ? matches[1] : matchesProejct;
          } else if (column === "filteredDates") {
            return item.filteredDates;
          } else if (column === "filteredHours") {
            return item.filteredHours;
          } else if (column === "filteredResources") {
            return item.filteredResources;
          } else {
            return item[column];
          }
        });
      });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("NonBillableWork");
    const headerRow = columnOrder.map((column) => customHeaders[column]);
    worksheet.addRow(headerRow);

    for (const dataRow of dataRows) {
      worksheet.addRow(dataRow);
    }

    const boldRow = [1];
    boldRow.forEach((index) => {
      const row = worksheet.getRow(index);
      row.font = { bold: true };
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "NonBillableWork.xlsx");
    });
  };

  const HelpPDFName = "NonBillableWorkoperational.pdf";
  const Headername = "Non Billable Work Help";
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
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
            <h2>NB Work - 4 Prev. Weeks</h2>
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
      </div>

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="businessunit">
                  Business Unit
                  <span className=" error-text ml-1">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      id="buId"
                      ArrowRenderer={ArrowRenderer}
                      options={deptId}
                      hasSelectAll={true}
                      value={selectedDeptid}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      onChange={(e) => {
                        setSelectedDeptId(e);
                        let filterB = [];
                        e.forEach((d) => {
                          filterB.push(d.value);
                        });
                        setSearchDataB(filterB.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Country <span className=" error-text ml-1">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[1] = ele;
                    }}
                  >
                    <MultiSelect
                      id="countryId"
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
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

                        setSeachDataC(filteredCountry.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="alloctype">
                  Alloc. Type <span className=" error-text ml-1">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                  >
                    <MultiSelect
                      id="BU"
                      options={allocData}
                      valueRenderer={generateDropdownLabel}
                      ArrowRenderer={ArrowRenderer}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectAllocData}
                      disabled={false}
                      onChange={(s) => {
                        setSelectAllocData(s);
                        let filteredValues = [];
                        s.forEach((d) => {
                          filteredValues.push(d.value);
                        });
                        setContractTermsId(filteredValues.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleClick();
                  setDisplayTable(false);
                }}
              >
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </CCollapse>
        {loader ? <Loader handleAbort={handleAbort} /> : ""}
      </div>

      <div>
        <div>
          {displaytable ? (
            <div>
              <div align="right">
                <label style={{ color: "#9d7c42", fontStyle: "italic" }}>
                  {" "}
                  <BsInfoCircle style={{ marginTop: "-5px" }} />
                  <i>All numbers are in hours</i>
                </label>
              </div>
              <div className="mb-2" align="right">
                <RiFileExcel2Line
                  size="1.5em"
                  title="Export to Excel"
                  style={{ color: "green", float: "right" }}
                  cursor="pointer"
                  onClick={handleOnExport}
                />
                <br />
              </div>
              <div
                className="col-md-12 EngagementDetails "
                style={{ marginTop: "-20px" }}
              >
                <NonBillableCollapsibleTable
                  data={tableData}
                  expandedCols={["emp_cadre", "supervisor"]}
                  colExpandState={["0", "0", "name"]}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default NonBillableWork4Weeks;
