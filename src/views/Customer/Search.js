import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Column } from "primereact/column";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import { BiSearch } from "react-icons/bi";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Loader from "../Loader/Loader";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import jsPDF from "jspdf";

import CustomerSearchTable from "./CustomerSearchTable";
import { CCollapse } from "@coreui/react";
import { environment } from "../../environments/environment";
// import CustomerSearchTable from "./CustomerSearchTable";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
require("jspdf-autotable");
function Search({ urlState }) {
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [getidfullname, setGetiffullname] = useState([]);
  const baseUrl = environment.baseUrl;
  const [selectType, setSelectType] = useState("");
  const searchdata = {
    IndustryId: null,
    StatusId: null,
    SalesTerritory: null,
    full_name: null,
  };
  const [details, setDetails] = useState(searchdata);
  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Customer Search"];
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
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;

      data.forEach((item) => {
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
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setDetails((prev) => ({ ...prev, [id]: value == "null" ? null : value }));
  };
  let rows = 25;
  const handleChangedata = (e) => {
    const { id, name, value } = e.target;
    setDetails((prev) => ({ ...prev, [id]: value == "null" ? null : value }));
  };
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
  const handleClick = () => {
    setLoader(false);
    setIsShow(true);
    setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
    getTableData();
  };
  const [loader, setLoader] = useState(false);

  const getTableData = () => {
    axios({
      method: "post",
      url: baseUrl + `/customersms/Customersearch/postwholedata`,
      data: details,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const data = res.data;
        const Headerdata = [
          {
            "Customer Name": "Customer Name",
            "Industry Type": "Industry Type",
            "Sales Territory": "Sales Territory",
            "Customer Status": "Customer Status",
            Website: "Website",
          },
        ];
        let data1 = ["Customer Name", "Website"];
        let linkRoutes = ["customer/dashboard/:id", <a href="Website"></a>];
        setLinkColumns(data1);
        setLinkColumnsRoutes(linkRoutes);
        setData(Headerdata.concat(data));
        setTimeout(() => {
          setLoader(false);
        }, 100);
      })
      .catch((error) => { });
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
      <>
        <Link
          target="_blank"
          className="ellipsis"
          to={rou[0] + ":" + data[rou[1]]}
          data-toggle="tooltip"
          title={data["Customer Name"]}
        >
          {data[linkColumns[0]]}
        </Link>
      </>
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
  const changeReqDateTT = (data) => {
    return (
      <div>
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
      .catch((error) => { });
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
      .catch((error) => { });
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
      .catch((error) => { });
  };
  const [customer, setCustomer] = useState([]);
  const getCustomers = () => {
    axios({
      url: baseUrl + `/customersms/Customersearch/getcustomer`,
    }).then((resp) => {
      setCustomer(resp.data);
    });
  };
  //======================filter API
  const searchdatas = {
    IndustryId: null,
    StatusId: null,
    SalesTerritory: null,
    full_name: null,
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
      .catch((error) => { });
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
    getTableData();
    getCustomers();
    getFilterdata();
  }, []);
  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
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

        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="full_name">
                  Customer Name{" "}
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
                            full_name: e.id,
                          }));
                        }}
                        // defaultValue={globalFilterValue1}
                        // onChange={onGlobalFilterChange2}
                        showIcon={false}
                      />
                      {/* <input
                        type="text"
                        id="full_name"
                        onChange={onGlobalFilterChange2}
                        onClear={handleClear}
                      /> */}
                    </div>
                  </div>
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
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="null"> &lt;&lt;All&gt;&gt;</option>
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
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="null"> &lt;&lt;All&gt;&gt;</option>
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
                    onChange={(e) => handleChange(e)}
                  >
                    <option value="null"> &lt;&lt;All&gt;&gt;</option>
                    <option value={161}>Active</option>
                    <option value={162}>InActive</option>
                    <option value={160}>New</option>
                  </select>
                </div>
              </div>
            </div>
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
      {isShow == true ? (
        <div className="group mb-3 customCard">
          {loader ? <Loader /> : ""}

          <CustomerSearchTable
            data={data}
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
  );
}
export default Search;
