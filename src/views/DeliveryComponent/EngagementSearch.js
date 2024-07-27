import React, { useLayoutEffect, useRef } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { useState, createContext, useContext } from "react";
import { useEffect } from "react";
import "./EngagementSearch.scss";
import axios from "axios";
import { environment } from "../../environments/environment";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { CCollapse } from "@coreui/react";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import { AiFillWarning } from "react-icons/ai";
import { AiOutlineUserAdd } from "react-icons/ai";
import Loader from "../Loader/Loader";
import { Column } from "primereact/column";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import EngagementSearchTable from "./EngagementSearchTable";
import { Link } from "react-router-dom";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";

function EngagementSearch({ setCheveronIcon, visible, setVisible, maxHeight1 }) {
  const loggedUserId = localStorage.getItem("resId");
  const ValueContext = createContext("EngagementS");
  const value = useContext(ValueContext);
  // const [visible, setVisible] = useState(false);
  // const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [ContractTerms, setContractTerms] = useState([]);
  const [CostCenter, setCostCenter] = useState([]);
  const [EngCompany, setEngCompany] = useState([]);
  const [selectedEngCompany, setSelectedEngCompany] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [tabledata, SetTableData] = useState([]);
  const baseUrl = environment.baseUrl;
  const [item, setItem] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchTableData, setSearchTableData] = useState([]);
  const [riskDetails, setRiskDetails] = useState([]);
  const [salesExecutive, setsalesExecutive] = useState();
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [custVisible, setCustVisible] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [initialLength, setInitialLength] = useState(0);
  const abortController = useRef(null);
  const HelpPDFName = "SearchEngagement.pdf";
  const Headername = "Engagement Search Help";
  const ref = useRef([]);
  const [dataAccess, setDataAccess] = useState([]);
  const [data2, setData2] = useState([]);

  let rows = 25;
  const initialValue = {
    engagementName: "",
    engCompany: "",
    costCenter: "",
    customer: "",
    salesExecutive: "",
    contractTerms: "",
    startDate: "",
    endDate: "",
  };
  const [searchdata, setSearchdata] = useState(initialValue);
  const [selectedItems, setSelectedItems] = useState([{}]);
  const CustomerValue = selectedItems?.map((d) => d?.id).toString();
  useEffect(() => {}, [item], [CustomerValue], [searchdata.customer]);
  const handleInputchange = (event) => {
    event.preventDefault;
    const { id, value } = event.target;
    setSearchdata((prevProps) => ({ ...prevProps, [id]: value }));
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setSearching(false);
  };
  const selectedEngCust = JSON?.parse(localStorage.getItem("selectedEngCust"))
    ?.map((d) => d.id)
    ?.toString();

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Engagements >  Engagement Search"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const getMenus = () => {
    // setMenusData

    axios
      .get(baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`)
      .then((resp) => {
        const getData = resp.data;
        setData2(getData);
        const UrlEngagement = "/engagement/engagementSearch";
        getUrlPath(UrlEngagement);

        const deliveryItem = getData[7]; // Assuming "Delivery" item is at index 7

        const desiredOrder = [
          "Engagements",
          "Projects",
          "Engagement Allocations",
          "Project Health",
          "Project Status Report",
        ];

        const sortedSubMenus = deliveryItem.subMenus.sort((a, b) => {
          const indexA = desiredOrder.indexOf(a.display_name);
          const indexB = desiredOrder.indexOf(b.display_name);
          return indexA - indexB;
        });
        deliveryItem.subMenus = sortedSubMenus;
        getData.forEach((item) => {
          if (item.display_name === textContent) {
            setRoutes([item]);
            sessionStorage.setItem("displayName", item.display_name);
          }
        });

        const engagementSearchSubMenu = getData
          .find((item) => item.display_name === "Delivery")
          .subMenus.find(
            (subMenu) => subMenu.display_name === "Engagement Search"
          );

        // Extract the access_level value
        const accessLevel = engagementSearchSubMenu
          ? engagementSearchSubMenu.access_level
          : null;

        setDataAccess(accessLevel);
      });
  };
  useEffect(() => {
    getMenus();
  }, []);
  const getUrlPath = (modifiedUrl) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrl}&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const handleSearch = async () => {
    SetTableData([]);
    if (selectedEngCust?.length == 0 || selectedEngCust == undefined) {
      let ele = document.getElementsByClassName("error");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-text");
      }
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      return;
    } else {
      let ele = document.getElementsByClassName("error");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.remove("error-text");
      }
      setValidationMessage(false);
    }
    const loaderTime = setTimeout(() => {
      setSearching(true);
    }, 2000);

    abortController.current = new AbortController();

    await axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Engagement/tabledata`,
      signal: abortController.current.signal,
      data: {
        engagementName: searchdata.engagementName,
        engagementId: "",
        customer: selectedEngCust,
        salesExecutive: searchdata.salesExecutive,
        contractTerms: searchdata.contractTerms,
        costCenter: searchdata.costCenter,
        startDate: searchdata.startDate,
        endDate: searchdata.endDate,
        engCompany: searchdata.engCompany,
      },
      headers: { "Content-Type": "application/json" },
    }).then((resp) => {
      let tabledata = resp.data;

      let header = [
        {
          EngagementName: "Engagement Name",
          "Business Unit": "Business Unit",
          Customer: "Customer",
          "Cost Center": "Cost Center",
          Manager: "Manager",
          "Sales Executive": "Sales Executive",
          "Contract Terms": "Contract Terms",
          "Start Date": "Start Date",
          "End Date": "End Date",
          "Engagement Company": "Engagement Company",
          Status: "Status",
        },
      ];

      let data = ["EngagementName"];

      let linkRoutes = ["/engagement/Dashboard/:id"];
      setLinkColumns(data);
      setLinkColumnsRoutes(linkRoutes);

      const tableData = tabledata.sort((a, b) =>
        a.EngagementName.localeCompare(b.EngagementName)
      );
      SetTableData(header.concat(tableData));
      clearTimeout(loaderTime);
      setSearching(false);
      setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
      setSearchTableData(resp.data);
    });
  };

  useEffect(() => {}, [tabledata]);

  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setRiskDetails(res);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const getContractTerms = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/ContractTerms`,
    })
      .then(function (response) {
        var resp = response.data;
        setContractTerms(resp);
      })
      .catch(function (response) {});
  };

  const getCostCenter = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/CostCenter`,
    })
      .then(function (response) {
        var resp = response.data;
        const filteredData = resp.filter(
          (d) =>
            !(
              d.name === "00X: Delivery" ||
              d.name === "000: Delivery" ||
              d.name === "Entire Organization"
            )
        );
        filteredData.push({ id: -1, name: "<<ALL>>" });
        setCostCenter(filteredData);
      })
      .catch(function (response) {});
  };
  const getEngCompany = () => {
    axios({
      url: baseUrl + `/ProjectMS/Engagement/EngCompany`,
    }).then((resp) => {
      setEngCompany(resp.data);
      setSelectedEngCompany(resp.data);
    });
  };
  const getCustomers = () => {
    axios
      .get(
        dataAccess === 100
          ? baseUrl +
              `/CommonMS/master/getCustomersList?loggedUserId=${loggedUserId}`
          : baseUrl + `/ProjectMS/Engagement/customerdata`
      )

      .then((resp) => {
        const data = resp.data;
        localStorage.setItem("selectedEngCust", JSON.stringify(data));
        setInitialLength(
          JSON.parse(localStorage.getItem("selectedEngCust"))?.length
        );
      })
      .catch((resp) => {});
  };

  useEffect(() => {
    if (dataAccess === 100) {
      getCustomers();
    }
  }, [dataAccess]);

  useEffect(() => {}, [
    ContractTerms,
    EngCompany,
    CostCenter,
    selectedEngCompany,
    tabledata,
  ]);

  useEffect(() => {
    setInitialLength(
      JSON.parse(localStorage.getItem("selectedEngCust"))?.length
    );
  }, [custVisible]);

  useEffect(() => {
    getContractTerms(), getCostCenter(), getEngCompany();
  }, []);

  const LinkTemplate = (data) => {
    return (
      <>
        <Link
          to={`/engagement/Dashboard/:${data.id}`}
          style={{ textDecoration: "underline", color: "accent" }}
          target="_blank"
          data-toggle="tooltip"
          title={data.EngagementName}
        >
          {data.EngagementName}
        </Link>
      </>
    );
  };

  const BusinessUnit = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Business Unit"]}
      >
        {data["Business Unit"]}
      </div>
    );
  };
  const Customer = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.Customer}>
        {data.Customer}
      </div>
    );
  };
  const Cost_Center = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Cost Center"]}
      >
        {data["Cost Center"]}
      </div>
    );
  };
  const Manager = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.Manager}>
        {data.Manager}
      </div>
    );
  };
  const SalesExecutive = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Sales Executive"]}
      >
        {data["Sales Executive"]}
      </div>
    );
  };
  const Contract_Terms = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Contract Terms"]}
      >
        {data["Contract Terms"]}
      </div>
    );
  };
  const StartDate = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Start Date"]}
      >
        {data["Start Date"]}
      </div>
    );
  };
  const EndDate = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data["End Date"]}>
        {data["End Date"]}
      </div>
    );
  };
  const EngagementCompany = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Engagement Company"]}
      >
        {data["Engagement Company"]}
      </div>
    );
  };
  const Status = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.Status}>
        {data.Status == true ? "Active" : "InActive"}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          (col == "EngagementName" && LinkTemplate) ||
          (col == "Business Unit" && BusinessUnit) ||
          (col == "Customer" && Customer) ||
          (col == "Cost Center" && Cost_Center) ||
          (col == "Manager" && Manager) ||
          (col == "Sales Executive" && SalesExecutive) ||
          (col == "Contract Terms" && Contract_Terms) ||
          (col == "Start Date" && StartDate) ||
          (col == "End Date" && EndDate) ||
          (col == "Engagement Company" && EngagementCompany) ||
          (col == "Status" && Status)
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  useEffect(() => {
    let imp = ["XLS"];
    setExportData(imp);
  }, []);

  let CustomerLength = JSON.parse(
    localStorage.getItem("selectedEngCust")
  )?.length;

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
      <div className="col-md-12">
        {validationMessage ? (
          <div className="statusMsg error">
            <AiFillWarning />{" "}
            {"Please select the valid values for highlighted fields"}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row ">
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="engagementName">
                  Engagement Name
                </label>
                <span className="col-1 ">:</span>
                <div className="col-6">
                  <input
                    type="text"
                    id="engagementName"
                    placeholder=""
                    onChange={handleInputchange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5 " htmlFor="customer">
                  Customer <span className="error-text ml-1">*</span>
                </label>
                <span className="col-1 ">:</span>
                <div
                  className="col-6 textfield"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                  onChange={handleInputchange}
                  onClick={() => setCustVisible(true)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <div className="poBtn textfield ">
                    <AiOutlineUserAdd className="error" />
                    <span
                      type="text"
                      name="customer"
                      id="customer"
                      className="error"
                    >
                      {/* {initialLength + " selected"} */}
                      {initialLength == undefined
                        ? "Select Customers"
                        : initialLength + " selected"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5 " htmlFor="salesExecutive">
                  Sales Executive
                </label>
                <span className="col-1 ">:</span>
                <div className="col-6 ">
                  <div className="autoComplete-container">
                    <ReactSearchAutocomplete
                      items={riskDetails}
                      type="Text"
                      name="salesExecutive"
                      id="salesExecutive"
                      riskDetails={riskDetails}
                      getData={getData}
                      onClear={(e) => {
                        setSearchdata((prevProps) => ({
                          ...prevProps,
                          ["salesExecutive"]: "",
                        }));
                      }}
                      placeholder="Type minimum 3 characters"
                      onSelect={(e) => {
                        setSearchdata((prevProps) => ({
                          ...prevProps,
                          ["salesExecutive"]: e.id,
                        }));
                      }}
                      showIcon={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="costCenter">
                  Cost Center
                </label>
                <span className="col-1 ">:</span>
                <div className="col-6">
                  <div autoComplete-container reactautocomplete>
                    <RiskAutoComplete
                      value={value}
                      name="costCenter"
                      id="costCenter"
                      riskDetails={CostCenter}
                      setFormData={setSearchdata}
                      onChange={handleInputchange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="contractTerms">
                  Contract Terms
                </label>
                <span className="col-1 ">:</span>
                <div className="col-6">
                  <select
                    id="contractTerms"
                    name="contractTerms "
                    onChange={handleInputchange}
                  >
                    <option value=""> &lt;&lt;ALL&gt;&gt;</option>
                    {ContractTerms.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.lkup_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="startDate">
                  Start Date
                </label>
                <span className="col-1 ">:</span>
                <div className="col-6">
                  <DatePicker
                    name="startDate"
                    id="startDate"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    selected={startDate}
                    dateFormat="dd-MMM-yyyy"
                    maxDate={endDate}
                    onChange={(e) => {
                      setSearchdata((prev) => ({
                        ...prev,
                        ["startDate"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setStartDate(e);
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 8 || e.keyCode === 46) {
                        setSearchdata((prev) => ({
                          ...prev,
                          ["startDate"]: null,
                        }));
                        setStartDate(null);
                      } else {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="endDate">
                  End Date
                </label>
                <span className="col-1 ">:</span>
                <div className="col-6">
                  <DatePicker
                    name="endDate"
                    id="endDate"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    selected={endDate}
                    dateFormat="dd-MMM-yyyy"
                    minDate={startDate}
                    onChange={(e) => {
                      setSearchdata((prev) => ({
                        ...prev,
                        ["endDate"]: moment(e).format("yyyy-MM-DD"),
                      }));
                      setEndDate(e);
                    }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 8 || e.keyCode === 46) {
                        setSearchdata((prev) => ({
                          ...prev,
                          ["endDate"]: null,
                        }));
                        setEndDate(null);
                      } else {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="engCompany">
                  Eng.Company:
                </label>
                <span className="col-1 ">:</span>
                <div className="col-6">
                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="engCompany"
                    options={EngCompany}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedEngCompany}
                    selected={selectedEngCompany}
                    valueRenderer={generateDropdownLabel}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedEngCompany(e);
                      let filteredEngCompany = [];
                      e.forEach((d) => {
                        filteredEngCompany.push(d.value);
                      });
                      setSearchdata((prevVal) => ({
                        ...prevVal,
                        ["engCompany"]: filteredEngCompany.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSearch}
              >
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      {searching ? <Loader handleAbort={handleAbort} /> : ""}
      {validationMessage == true ? (
        ""
      ) : (
        <EngagementSearchTable
        maxHeight1 = {maxHeight1}
          data={tabledata}
          rows={rows}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          dynamicColumns={dynamicColumns}
          headerData={headerData}
          setHeaderData={setHeaderData}
          exportData={exportData}
        />
      )}
      <SelectCustDialogBox
        visible={custVisible}
        setVisible={setCustVisible}
        value={value}
        setInitialLength={setInitialLength}
      />
    </div>
  );
}
export default EngagementSearch;
