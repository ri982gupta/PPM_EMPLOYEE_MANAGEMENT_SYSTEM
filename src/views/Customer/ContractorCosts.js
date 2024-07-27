import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useRef,
} from "react";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { environment } from "../../environments/environment";
import moment from "moment";
import Loader from "../Loader/Loader";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { AiFillWarning } from "react-icons/ai";
import { Column } from "primereact/column";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function ContractorCosts() {
  const [data, setData] = useState([]);
  var date = new Date();
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [visible, setVisible] = useState(false);
  const [searching, setsearching] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const abortController = useRef(null);
  const [exportData, setExportData] = useState([]);
  const [searchData, setSearchData] = useState(false);

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Contractor Costs"];
  let textContent = "Administration";
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
 

  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
    let imp = ["XLS"];
    setExportData(imp);
  }, [data]);
  const ref = useRef([]);

  const baseUrl = environment.baseUrl;
  let rows = 25;
  let alldepartments;
  let allcountries;

  const initialValue = {
    buIds: "",
    country: "",
    startDate: "",
  };
  const [formData, setFormData] = useState(initialValue);
  let formattedStartDate = moment(startDate).format("YYYY-MM-DD");

  const customValueRenderer = (selected, _options) => {
    return selected.length === country.length
      ? "<< ALL >>"
      : selected.length === 0
        ? "<< Please Select >>"
        : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };
  const departmentArray = formData.buIds.split(",");

  alldepartments =
    departmentArray.length === departments.length ? "-1" : formData.buIds;

  const countryArray = formData.country.split(",");

  allcountries =
    countryArray.length === country.length ? "-1" : formData.country;

  ////axios for BusinessUnit//////
  const getDepartments = async () => {
    const resp = await axios({
      url: baseUrl + `/CostMS/cost/getDepartments`,
    });

    let departments = resp.data;
    departments.push({ value: 0, label: "Non-Revenue Units" });
    setDepartments(departments);
    setSelectedDepartments(departments.filter((ele) => ele.value != 0));
    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 0) {
        filteredDeptData.push(data.value);
      }
    });
    setFormData((prevVal) => ({
      ...prevVal,
      ["buIds"]: filteredDeptData.toString(),
    }));
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
        `/CommonMS/security/authorize?url=/admin/contractorCosts&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  ///axios for Customer///////
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
      });
  };

  /////axios for tabledata/////

  const gettabledata = () => {
    let valid = GlobalValidation(ref);

    if (valid) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      return;
    }
    setsearching(true);
    setSearchData(false);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/administrationms/ContratorCosts/gettabledata`,
      signal: abortController.current.signal,

      // url: 'http://localhost:8093/administrationms/ContratorCosts/gettabledata',
      data: {
        buIds: alldepartments,
        countryIds: allcountries,
        fromDate: formattedStartDate,
        salaryDecryptSalt: "",
      },
    }).then((resp) => {
      let tabledata = resp.data;
      // tabledata.forEach((tabledata, index) => { tabledata["S.No"] = index + 1 })
      for (let i = 0; i < tabledata.length; i++) {
        tabledata[i]["SNo"] = i + 1;
      }
      let header = [
        {
          SNo: "S.No",
          "Employee ID": "Employee ID",
          Resource: "Resource",
          Country: "Country",
          Department: "Department",
          "Role Type": "Role Type",
          Designation: "Designation",
          Cadre: "Cadre",
          Cost: "Cost" + " " + "(" + "$" + ")",
        },
      ];
      let data = [...header, ...tabledata];
      setData(data);
      setTimeout(() => {
        setsearching(false);
        setSearchData(true);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      }, 1000);
    });
  };

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

  useEffect(() => {
    getCountries();
    getDepartments();
    getMenus();
    getUrlPath();
    // gettabledata();
  }, []);

  const colData = useRef("");

  const LeftAlign = (data) => {
    return (
      <div align="center" title={data.SNo}>
        {data.SNo}
      </div>
    );
  };

  const CostAlign = (data) => {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ alignSelf: "flex-start" }}>{"$"}</div>
          <div style={{ alignSelf: "flex-end" }} title={data.Cost}>
            {data.Cost}
          </div>
        </div>
      </>
    );
  };
  const Cadre = (data) => {
    return <div title={data.Cadre}>{data.Cadre == "" ? "-" : data.Cadre}</div>;
  };
  const Country = (data) => {
    return (
      <div title={data.Country == "" ? "-" : data.Country} className="ellipsis">
        {data.Country == "" ? "-" : data.Country}
      </div>
    );
  };
  const Department = (data) => {
    return (
      <div
        title={data.Department == "" ? "-" : data.Department}
        className="ellipsis"
      >
        {data.Department == "" ? "-" : data.Department}
      </div>
    );
  };
  const Designation = (data) => {
    return (
      <div
        title={data.Designation == "" ? "-" : data.Designation}
        className="ellipsis"
      >
        {data.Designation == "" ? "-" : data.Designation}
      </div>
    );
  };
  const Resource = (data) => {
    return (
      <div
        title={data.Resource == "" ? "-" : data.Resource}
        className="ellipsis"
      >
        {data.Resource}
      </div>
    );
  };
  const EmployeeID = (data) => {
    return <div title={data["Employee ID"]}>{data["Employee ID"]}</div>;
  };
  const RoleType = (data) => {
    return (
      <div
        title={data["Role Type"] === null ? "-" : data["Role Type"]}
        className="ellipsis"
      >
        {data["Role Type"] === null ? "-" : data["Role Type"]}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "SNo"
            ? LeftAlign
            : col == "Cadre"
              ? Cadre
              : col == "Country"
                ? Country
                : col == "Department"
                  ? Department
                  : col == "Designation"
                    ? Designation
                    : col == "Resource"
                      ? Resource
                      : col == "Employee ID"
                        ? EmployeeID
                        : col == "Role Type"
                          ? RoleType
                          : col == "Cost" && CostAlign
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setsearching(false);
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
  return (
    <div>
      {validationMessage ? (
        <div className="statusMsg error">
          <AiFillWarning />{" "}
          {"Please select the valid values for highlighted fields"}
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Contractor Costs</h2>
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

      <div className="group mb-3 customCard">

      <div className="col-md-12 collapseHeader"></div>
      
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country">
                  Country &nbsp;<span className="required error-text">*</span>
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
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    disabled={false}
                    // valueRenderer={customValueRenderer}
                    valueRenderer={generateDropdownLabel}
                    ArrowRenderer={ArrowRenderer}
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
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="bu">
                  BU &nbsp;<span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    id="buIds"
                    options={departments}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedDepartments}
                    // valueRenderer={customValueRenderer}
                    valueRenderer={generateDropdownLabel}
                    ArrowRenderer={ArrowRenderer}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedDepartments(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });

                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["buIds"]: filteredValues.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="startDate">
                  Month &nbsp;<span className="required error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 datepicker"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                >
                  <DatePicker
                    selected={startDate}
                    name="startDate"
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        ["startDate"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setStartDate(e);
                    }}
                    dateFormat="MMM-yyyy"
                    maxDate={new Date()}
                    showMonthYearPicker
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={gettabledata}
              >
                <FaSearch />
                Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
      </div>

      <div className="col-md-12">
        {searching ? <Loader handleAbort={handleAbort} /> : ""}
        {searchData ? (
          <>
            <span
              className="ft16"
              style={{ color: "#297AB0", align: "center" }}
            >
              <b>
                {" "}
                Contractor Costs for {moment(startDate).format("MMM-YYYY")}
              </b>
            </span>
            <CellRendererPrimeReactDataTable
              CustomersFileName = "administrationContractorCost"
              administrationContractorCostDyMxHt = {maxHeight1}
              fileName={"ContractorCostData.xls"}
              data={data}
              rows={rows}
              dynamicColumns={dynamicColumns}
              headerData={headerData}
              setHeaderData={setHeaderData}
              exportData={exportData}
            />
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ContractorCosts;
