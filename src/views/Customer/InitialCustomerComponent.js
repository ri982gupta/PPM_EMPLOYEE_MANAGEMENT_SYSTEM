import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Column } from "primereact/column";
import CustomerCreate from "./CustomerCreate";
import axios from "axios";
import { environment } from "../../environments/environment";
import VendorOpen from "../VendorComponent/VendorOpen";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { FilterMatchMode } from "primereact/api";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight"; 
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaCircle,
  FaSearch,
} from "react-icons/fa";
import jsPDF from "jspdf";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import CustomerSearchTable from "./CustomerSearchTable";
import { CCollapse } from "@coreui/react";
import { MultiSelect } from "react-multi-select-component";
import { useRef } from "react";
import { AiFillWarning } from "react-icons/ai";
import moment from "moment";
import "./InitialCustomerComponent.scss"


function InitialCustomerComponent() {
  const ref = useRef([]);
  const [validationmessage, setValidationMessage] = useState(false);
  const [buttonState, setButtonState] = useState("Search");
  const [urlState, setUrlState] = useState("/search/customerSearch");
  const [indChange, setIndChange] = useState(null);
  const [custStatus, setCustStatus] = useState(161);
  const [salesTeri, setSalesTeri] = useState(null);
  const [engComp, setEngComp] = useState(null);
  const [buttonValue, setButtonValue] = useState("Customer");
  const baseUrl = environment.baseUrl;
  const [selectType, setSelectType] = useState("");
  const [csl, setCsl] = useState([]);
  const [selectedCsl, setSelectedCsl] = useState("-1");
  const [delivery, setDelivery] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState("-1");
  const [accountExecutive, setAccountExecutive] = useState([]);
  const [selectedAccountExecutive, setSelectedAccountExecutive] =
    useState("-1");
  const [accountOwner, setAccountOwner] = useState([]);
  const [selectedAccountOwner, setSelectedAccountOwner] = useState("-1");
  const [permission, setPermission] = useState([]);
  const getMenusNew = () => {
    axios
      .get(
        baseUrl +
          `/CommonMS/master/getBenchMtericsMenus?loggedUserId=${loggedUserId}&Cont=customer`
      )
      .then((resp) => {
        const getData = resp.data;
        setPermission(getData);
      });
  };
  useEffect(() => {
    getMenusNew();
  }, []);

  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [getidfullname, setGetiffullname] = useState([]);
  const searchdata = {
    IndustryId: null,
    StatusId: null,
    SalesTerritory: null,
    full_name: null,
    EngCompany: null,
    ViewBy: null,
    selVal: "",
  };
  const [details, setDetails] = useState(searchdata);
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);

  let textContent = "Customers";
  let currentScreenName = ["Customer Search"];

  const materialTableElement = document.getElementsByClassName(
    "childTwo"
  );

  const custSrchDyMaxHeight =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;

    console.log(custSrchDyMaxHeight, "maxHeight1");

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
    getUrlPath();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Financial Plan & Review"
        ),
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
        `/CommonMS/security/authorize?url=${urlState}&userId=${loggedUserId}`,
    }).then((res) => {});
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
  const generateDropdownLabel = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);

    if (selectedValues.length === allValues.length) {
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSelectType(value);
    if (id == "ViewBy" && value == "CSL") {
      setSelectedCsl(csl.filter((ele) => ele.value !== 999));
    }
    if (id == "ViewBy" && value == "DP") {
      setSelectedDelivery(delivery.filter((ele) => ele.value !== 999));
    }
    if (id == "ViewBy" && value == "AE") {
      setSelectedAccountExecutive(
        accountExecutive.filter((ele) => ele.id !== 999)
      );
    }
    if (id == "ViewBy" && value == "AC") {
      setSelectedAccountOwner(accountOwner.filter((ele) => ele.value !== 999));
    }

    setDetails((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  let rows = 25;

  const [exportData, setExportData] = useState([]);
  useEffect(() => {
    let imp = ["XLS", "PDF", "PRINT"];
    setExportData(imp);
    let ctmFlts = {
      id: "filterTable",
      type: "select",
      data: {
        0: "All",
        1: "Active",
      },
      align: "right",
      filterTable: "",
    };
  }, []);

  const [isShow, setIsShow] = useState(false);
  const [data, setData] = useState([{}]);

  const getTableData = () => {
    let valid = GlobalValidation(ref);

    if (valid === true) {
      setValidationMessage(true);
      setTimeout(() => {
        setValidationMessage(false);
      }, 3000);
      setIsShow(false);
      return;
    } else {
      axios({
        method: "post",
        url: baseUrl + `/customersms/Customersearch/postwholedata`,
        data: {
          IndustryId: indChange == "null" ? null : indChange,
          StatusId: custStatus == "null" ? null : custStatus,
          SalesTerritory: salesTeri == "null" ? null : salesTeri,
          full_name: details.full_name,
          EngCompany: engComp == "null" ? null : engComp,
          ViewBy: selectType,
          selVal:
            selectType === "CSL"
              ? selectedCsl.map((item) => item.value).toString() ===
                csl.map((item) => item.value).toString()
                ? -1
                : selectedCsl.map((item) => item.value).toString()
              : selectType === "DP"
              ? selectedDelivery.map((item) => item.value).toString() ===
                delivery.map((item) => item.value).toString()
                ? -1
                : selectedDelivery.map((item) => item.value).toString()
              : selectType === "AE"
              ? selectedAccountExecutive
                  .map((item) => item.value)
                  .toString() ===
                accountExecutive.map((item) => item.value).toString()
                ? -1
                : selectedAccountExecutive.map((item) => item.value).toString()
              : selectType === "AC"
              ? selectedAccountOwner.map((item) => item.value).toString() ===
                accountOwner.map((item) => item.value).toString()
                ? -1
                : selectedAccountOwner.map((item) => item.value).toString()
              : "",
        },
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          const data = res.data;
          const Headerdata = [
            {
              "Customer Name": "Customer Name",
              "Eng Company": "Eng.Company",
              "Industry Type": "Industry Type",
              "Sales Territory": "Sales Territory",
              "Customer Status": "Customer Status",
              lastCreatedDt: "Last QBR Date",
              Website: "Website",
            },
          ];
          let data1 = ["Customer Name", "Website"];
          let linkRoutes = ["customer/dashboard/:id", <a href="Website"></a>];
          setLinkColumns(data1);
          setLinkColumnsRoutes(linkRoutes);
          setData(Headerdata.concat(data));
          setVisible(!visible);
          visible
            ? setCheveronIcon(FaChevronCircleUp)
            : setCheveronIcon(FaChevronCircleDown);
          setValidationMessage(false);
          setTimeout(() => {
            setValidationMessage(false);
          }, 3000);
        })
        .catch((error) => {});
    }
  };

  const handleClick = () => {
    setIsShow(true);
    getTableData();
  };

  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "10px" }}>
          {data.qbr_status == "NA" ? (
            <FaCircle style={{ color: "gray" }} title="QBR Not Required" />
          ) : data.qbr_status == 1 ? (
            <FaCircle style={{ color: "green" }} title="QBR Completed" />
          ) : data.qbr_status == 0 ? (
            <FaCircle style={{ color: "red" }} title=" Completed" />
          ) : (
            ""
          )}
        </div>
        <div className="ellipsis">
          <Link
            target="_blank"
            to={rou[0] + ":" + data[rou[1]]}
            data-toggle="tooltip"
            title={data["Customer Name"]}
            style={{ cursor: "pointer" }}
          >
            {data[linkColumns[0]]}
          </Link>
        </div>
      </div>
    );
  };

  const customerstatus = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Customer Status"]}
      >
        {data["Customer Status"]}
      </div>
    );
  };
  const engagementCompany = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Eng Company"]}
      >
        {data["Eng Company"]}
      </div>
    );
  };

  const salesterritory = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Sales Territory"]}
      >
        {data["Sales Territory"]}
      </div>
    );
  };

  const industrytype = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={data["Industry Type"]}
      >
        {data["Industry Type"]}
      </div>
    );
  };
  const QBRlastDate = (data) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        style={{ textAlign: "center" }}
        title={
          data["lastCreatedDt"] == "NA"
            ? "NA"
            : moment(data["lastCreatedDt"]).format("DD-MMM-yyyy")
        }
      >
        {data["lastCreatedDt"] == "NA"
          ? "NA"
          : moment(data["lastCreatedDt"]).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const changeReqDateTT = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip">
        {data.Website === "N/A" ||
        data.Website === "na" ||
        data.Website === "n/a" ? (
          <span>{data.Website}</span>
        ) : (
          <a
            href={data.Website}
            target="_blank"
            rel="noopener noreferrer"
            title={data.Website}
            style={{ cursor: "pointer" }}
          >
            <span>{data.Website}</span>
          </a>
        )}
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "Customer Name"
            ? LinkTemplate
            : col == "Eng Company"
            ? engagementCompany
            : col == "lastCreatedDt"
            ? QBRlastDate
            : col == "Website"
            ? changeReqDateTT
            : col == "Customer Status"
            ? customerstatus
            : col == "Sales Territory"
            ? salesterritory
            : col == "Industry Type"
            ? industrytype
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });
  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customersearch/getid`,
    })
      .then((res) => {
        let manger = res.data;
        setGetiffullname(manger);
      })
      .catch((error) => {});
  };
  const handleClear = () => {
    setDetails((prevProps) => ({ ...prevProps, full_name: null }));
  };
  const [salesterritories, setSalesTerritories] = useState([]);
  const handleSalesTerritories = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customersearch/getsalesterritory`,
    })
      .then((res) => {
        let manger = res.data;
        setSalesTerritories(res.data);
      })
      .catch((error) => {});
  };
  const [industryType, setIndustryType] = useState([]);
  const handleIndustryType = () => {
    axios({
      method: "get",
      url: baseUrl + `/customersms/Customersearch/getIndusdetails`,
    })
      .then((res) => {
        let manger = res.data;
        setIndustryType(manger);
      })
      .catch((error) => {});
  };
  const [customer, setCustomer] = useState([]);
  const getCustomers = () => {
    axios({
      url: baseUrl + `/customersms/Customersearch/getcustomer`,
    }).then((resp) => {
      setCustomer(resp.data);
    });
  };

  const [engCompany, setEngCompany] = useState([]);
  const handleEngCompany = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getEngagementCompanay`,
    }).then((res) => {
      let compay = res.data;
      const filteredData = compay.filter(
        (item) =>
          item.id !== 10 && item.id !== 11 && item.id !== 12 && item.id !== 13
      );
      setEngCompany(filteredData);
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
      custom.push({ label: "UnAssigned", id: 999 });
      setCsl(custom);
      setSelectedCsl(custom.filter((ele) => ele.value !== 999));
      let filteredCsl = [];
      custom.forEach((data) => {
        if (data.value !== 0 && data.value !== 999) {
          filteredCsl.push(data.value);
        }
      });
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
        deliver.push({ label: "UnAssigned", id: 999 });
        setDelivery(deliver);
        setSelectedDelivery(deliver.filter((ele) => ele.value != 0));
        let filteredDelivery = [];
        deliver.forEach((data) => {
          if (data.value != 0) {
            filteredDelivery.push(data.value);
          }
        });
      });
  };

  const getAccountExecutive = () => {
    axios({
      method: "get",
      url: baseUrl + `/SalesMS/sales/getSalesExecutive`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let dpObj = {
            label: e.Name,
            value: e.id,
          };
          custom.push(dpObj);
        });
      custom.push({ label: "UnAssigned", id: 999 });
      setAccountExecutive(custom);
      setSelectedAccountExecutive(custom);
    });
  };

  const getAccountOwner = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Engagement/getAccountOwner`,
    }).then((res) => {
      let custom = [];

      let data = res.data;
      data.length > 0 &&
        data.forEach((e) => {
          let dpObj = {
            label: e.Name,
            value: e.account_owner_id,
          };
          custom.push(dpObj);
        });
      custom.push({ label: "UnAssigned", value: 999 });
      setAccountOwner(custom);
      setSelectedAccountOwner(custom);
    });
  };

  //======================filter API
  const searchdatas = {
    IndustryId: null,
    StatusId: null,
    SalesTerritory: null,
    full_name: null,
    EngCompany: null,
    ViewBy: null,
    selVal: "",
  };
  const [storefilterdata, setstorefilterdata] = useState(searchdatas);
  const getFilterdata = () => {
    axios({
      method: "post",
      url: baseUrl + `/customersms/Customersearch/postwholedata`,
      data: details,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const data = res.data;
      })
      .catch((error) => {});
  };
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const clearFilter1 = () => {
    initFilters1();
  };
  const initFilters1 = () => {
    setGlobalFilterValue1("");
  };
  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  const [filters1, setFilters1] = useState({
    full_name: filtersData["contains"],
  });
  const onGlobalFilterChange2 = (e) => {
    const { id, value } = e.target;
    getFilterdata();

    setDetails((prev) => {
      return { ...prev, [id]: value == " " ? null : value };
    });

    let _filters1 = { ...filters1 };
    _filters1["full_name"].value = value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
    setstorefilterdata((prevProps) => ({
      ...prevProps,
      full_name: e.value,
    }));
  };
  useEffect(() => {
    setFilters1({
      full_name: filtersData["contains"],
    });
  }, [headerData]);
  const exportPdf = () => {
    print();
  };
  const [mainData, setMainData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  useEffect(() => {
    setMainData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  useEffect(() => {
    if (buttonState === "Search") {
      setVisible(false);
      setCheveronIcon(FaChevronCircleUp);
    }
  }, [buttonState]);

  useEffect(() => {
    if (mainData.length > 0) {
      setHeaderData(mainData[0]);
      setBodyData(mainData.splice(1));

      let dtt = [];
      let headDt = mainData[0];

      Object.keys(headDt).forEach((d) => {
        d != "StatusId" &&
          // ? dtt.push({ title: "cus", dataKey: d })
          dtt.push({ title: headDt[d], dataKey: d });
      });

      setExportColumns(dtt);
    }
  }, [mainData]);

  const print = () => {
    const pdf = new jsPDF("p", "pt", "a4");
    const columns = exportColumns.map((d) => d.title);
    let rows = [];

    for (let i = 1; i < data.length; i++) {
      let temp = exportColumns.map((d) => data[i][d["dataKey"]]);

      rows.push(temp);
    }
    const columnWidths = [90, 90, 90, 100, 130];
    pdf.text(235, 40, "PPM :: Customer Search");
    pdf.autoTable(columns, rows, {
      startY: 65,
      theme: "grid",
      styles: {
        font: "times",
        halign: "center",
        cellPadding: 3.5,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: "normal",
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        fillColor: [166, 204, 247],
      },
      alternateRowStyles: {
        fillColor: [212, 212, 212],
        textColor: [0, 0, 0],
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      rowStyles: {
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      tableLineColor: [0, 0, 0],
      columnStyles: {
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
      },
    });
    pdf.save("Customer Search");
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data1 = new Blob([buffer], { type: EXCEL_TYPE });
        module.default.saveAs(data1, fileName + EXCEL_EXTENSION);
      }
    });
  };
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const headers = Object.keys(data[0]);
      const uniqueHeaders = [...new Set(headers)]; // Remove duplicates
      const worksheetData = data.map((item) =>
        uniqueHeaders.map((header) => item[header])
      );
      const worksheet = xlsx.utils.json_to_sheet(worksheetData, {
        skipHeader: true,
      });
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "Customer Search");
    });
  };

  useEffect(() => {
    getData();
    handleSalesTerritories();
    handleIndustryType();
    // getTableData();
    getCustomers();
    getFilterdata();
    handleEngCompany();
    handleCsl();
    getDeliveryPartners();
    getAccountExecutive();
    getAccountOwner();
  }, []);
  return (
    <div>
      {buttonState == "Search" && (
        <div>
          {validationmessage ? (
            <div className="statusMsg error">
              {" "}
              <AiFillWarning /> Please select valid values for highlighted
              fields
            </div>
          ) : (
            ""
          )}
          <div className="col-md-12">
            <div className="pageTitle">
              <div className="childOne">
                <div className="tabsProject">
                  {permission
                    // .slice()
                    // .sort((a, b) =>
                    //   a.display_name.localeCompare(b.display_name)
                    // )
                    .map((button) => (
                      <button
                        key={button.id}
                        className={
                          buttonState === button.display_name.toString()
                            ? "buttonDisplayClick"
                            : "buttonDisplay"
                        }
                        onClick={() => {
                          setButtonState(button.display_name.toString());
                          setUrlState(
                            button.url_path.toString().replace(/::/g, "/")
                          );
                        }}
                      >
                        {/* clg */}

                        {button.display_name}
                      </button>
                    ))}
                </div>
              </div>
              <div className="childTwo">
                <h2>Customer Search</h2>
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
            <div className="group mb-3 customCard">
              <CCollapse visible={!visible}>
                <div className="group-content row">
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="full_name">
                        Customer Name
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <div className="autocomplete">
                          <div className="autoComplete-container">
                            <ReactSearchAutocomplete
                              items={customer}
                              type="Text"
                              name="full_name"
                              id="full_name"
                              customer={customer}
                              className="AutoComplete"
                              onClear={handleClear}
                              onSelect={(e) => {
                                setDetails((prevProps) => ({
                                  ...prevProps,
                                  full_name: e.name,
                                }));
                              }}
                              showIcon={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="EngCompany">
                        Eng.Company
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <select
                          className="text cancel"
                          name="EngCompany"
                          id="EngCompany"
                          onChange={(e) => setEngComp(e.target.value)}
                        >
                          <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                          {engCompany
                            .sort((a, b) => a.Company.localeCompare(b.Company))
                            .map((Item) => (
                              <option value={Item.id}>{Item.Company}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="industrytype">
                        Industry Type
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <select
                          className="text cancel"
                          id="IndustryId"
                          name="IndustryId"
                          onChange={(e) => setIndChange(e.target.value)}
                        >
                          <option value="null"> &lt;&lt; ALL &gt;&gt;</option>
                          {industryType.map((Item) => (
                            <option value={Item.id}>{Item.lkup_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="salesterritory">
                        Sales Territory
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <select
                          className="text cancel"
                          name="SalesTerritory"
                          id="SalesTerritory"
                          onChange={(e) => setSalesTeri(e.target.value)}
                        >
                          <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                          {salesterritories.map((Item) => (
                            <option value={Item.id}>{Item.full_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="customerstatus">
                        Customer Status
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <select
                          className="text cancel"
                          name="StatusId"
                          id="StatusId"
                          onChange={(e) => setCustStatus(e.target.value)}
                        >
                          <option value="null"> &lt;&lt;ALL&gt;&gt;</option>
                          <option value={161} selected>
                            Active
                          </option>
                          <option value={162}>InActive</option>
                          <option value={160}>New</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-3 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="ViewBy">
                        View By&nbsp;
                      </label>
                      <span className="col-1 p-0">:</span>
                      <div className="col-6">
                        <select
                          className="cancel text"
                          name="ViewBy"
                          id="ViewBy"
                          onChange={handleChange}
                        >
                          <option value="">&lt;&lt;ALL&gt;&gt;</option>
                          <option value="CSL">CSL</option>
                          <option value="DP">Delivery Partner</option>
                          <option value="AE">Account Executive</option>
                          <option value="AC">Account Owner</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {selectType == "CSL" ? (
                    <div className=" col-md-3 mb-2">
                      <div className="form-group row">
                        <label
                          className="col-5"
                          style={{ fontSize: "14px" }}
                          htmlFor="CSL"
                        >
                          CSL&nbsp;
                          <span className="col-1 p-0 error-text">*</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div
                          className="col-6 multiselect"
                          ref={(ele) => {
                            ref.current[0] = ele;
                          }}
                        >
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            // id="CSL"
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
                              setDetails((prevVal) => ({
                                ...prevVal,
                                ["selVal"]:
                                  filteredCustomer.toString() ==
                                  csl.map((item) => item.value).join(",")
                                    ? "-1"
                                    : filteredCustomer.toString(),
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
                        <label
                          className="col-5"
                          style={{ fontSize: "14px" }}
                          htmlFor="DP"
                        >
                          Delivery Partner&nbsp;
                          <span className="col-1 p-0 error-text">*</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div
                          className="col-6 multiselect"
                          ref={(ele) => {
                            ref.current[1] = ele;
                          }}
                        >
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            // id="DP"
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
                              setDetails((prevVal) => ({
                                ...prevVal,
                                ["selVal"]:
                                  filteredDelivery.toString() ==
                                  delivery.map((item) => item.value).join(",")
                                    ? "-1"
                                    : filteredDelivery.toString(),
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {selectType == "AE" ? (
                    <div className=" col-md-3 mb-2">
                      <div className="form-group row">
                        <label
                          className="col-5 ellipsis"
                          style={{ fontSize: "14px" }}
                          htmlFor="AE"
                        >
                          Account Executive&nbsp;
                          <span className="col-1 p-0 error-text">*</span>
                        </label>
                        <span className="col-1 p-0">:</span>
                        <div
                          className="col-6 multiselect"
                          ref={(ele) => {
                            ref.current[2] = ele;
                          }}
                        >
                          <MultiSelect
                            ArrowRenderer={ArrowRenderer}
                            id="AE"
                            options={accountExecutive}
                            hasSelectAll={true}
                            value={selectedAccountExecutive}
                            valueRenderer={generateDropdownLabel}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            disabled={false}
                            onChange={(e) => {
                              setSelectedAccountExecutive(e);
                              let filteredCountry = [];
                              e.forEach((d) => {
                                filteredCountry.push(d.value);
                              });
                              setDetails((prevVal) => ({
                                ...prevVal,
                                ["selVal"]:
                                  filteredCountry.toString() ==
                                  accountExecutive
                                    .map((item) => item.value)
                                    .join(",")
                                    ? "-1"
                                    : filteredCountry.toString(),
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {selectType == "AC" ? (
                    <div className=" col-md-3 mb-2">
                      <div className="form-group row">
                        <label
                          className="col-5 ellipsis"
                          style={{ fontSize: "14px" }}
                          htmlFor="AC"
                        >
                          Account Owner&nbsp;
                          <span className="col-1 p-0 error-text">*</span>
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
                            id="AC"
                            options={accountOwner}
                            hasSelectAll={true}
                            value={selectedAccountOwner}
                            valueRenderer={generateDropdownLabel}
                            shouldToggleOnHover={false}
                            disableSearch={false}
                            disabled={false}
                            onChange={(e) => {
                              setSelectedAccountOwner(e);
                              let filteredCountry = [];
                              e.forEach((d) => {
                                filteredCountry.push(d.value);
                              });
                              setDetails((prevVal) => ({
                                ...prevVal,
                                ["selVal"]:
                                  filteredCountry.toString() ==
                                  accountOwner
                                    .map((item) => item.value)
                                    .join(",")
                                    ? "-1"
                                    : filteredCountry.toString(),
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleClick}
                    >
                      <FaSearch />
                      Search{" "}
                    </button>
                  </div>
                </div>
              </CCollapse>
            </div>
          </div>
          {isShow == true ? (
            <div className="group mb-3 customCard customer-search-table-wrapper">
              <CustomerSearchTable
                data={data}
                custSrchDyMaxHeight = {custSrchDyMaxHeight}
                linkColumns={linkColumns}
                linkColumnsRoutes={linkColumnsRoutes}
                dynamicColumns={dynamicColumns}
                headerData={headerData}
                setHeaderData={setHeaderData}
                exportData={exportData}
                rows={rows}
                fileName="PPM Customer Search"
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
      {/* {permission[0]?.display_name != undefined ? (
          <button
            className={
              buttonState === "search" ? "buttonDisplayClick" : "buttonDisplay"
            }
            onClick={() => {
              setButtonState("search");
            }}
          >
            {permission[0]?.display_name}
          </button>
        ) : (
          ""
        )}

        {permission[1]?.display_name != undefined ? (
          <button
            className={
              buttonState === "create" ? "buttonDisplayClick" : "buttonDisplay"
            }
            onClick={() => {
              setButtonState("create");
            }}
          >
            {permission[1]?.display_name}
          </button>
        ) : (
          ""
        )}

        {permission[2]?.display_name != undefined ? (
          <button
            className={
              buttonState === "open" ? "buttonDisplayClick" : "buttonDisplay"
            }
            onClick={() => {
              setButtonState("open");
            }}
          >
            {permission[2]?.display_name}
          </button>
        ) : (
          ""
        )} */}

      {/* {buttonState === "Search" && <Search urlState={urlState} />} */}
      {buttonState === "Create" && (
        <CustomerCreate
          urlState={urlState}
          permission={permission}
          buttonState={buttonState}
          setButtonState={setButtonState}
          setUrlState={setUrlState}
        />
      )}
      {buttonState === "Open" && (
        <VendorOpen
          buttonValue={buttonValue}
          urlState={urlState}
          setUrlState={setUrlState}
          buttonState={buttonState}
          permission={permission}
          setButtonState={setButtonState}
        />
      )}
    </div>
  );
}

export default InitialCustomerComponent;
