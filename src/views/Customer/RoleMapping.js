import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import moment from "moment";
import { Column } from "primereact/column";
import { MultiSelect } from "react-multi-select-component";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCaretDown,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { environment } from "../../environments/environment";
import axios from "axios";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Loader from "../Loader/Loader";
import { BiCheck, BiReset, BiSave } from "react-icons/bi";
import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { IoWarningOutline } from "react-icons/io5";
import { AiFillWarning } from "react-icons/ai";
import "../Customer/Rolemapping.scss";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import InputSixComponent from "./CustomerRoleEffectiveDate";
import * as XLSX from "xlsx";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function RoleMapping() {
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const baseUrl = environment.baseUrl;
  const [customer, setCustomer] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState([]);
  const [resource, setResource] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [loaderState, setLoaderState] = useState(false);
  const [searching, setsearching] = useState(false);
  const [delivery, setDelivery] = useState([]);
  const [selectDelivery, setSelectedDelivery] = useState([]);
  const [tableData, setTableData] = useState([{}]);
  const [previousTableData, setPreviousTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const Ids = selectedRowsData.map((item) => item.id).join(",");
  const [cslId1, setCslId1] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [tableDisable, setTableDisable] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [custVisible, setCustVisible] = useState(false);
  const [custData, setcustData] = useState([]);
  const [item, setItem] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const ref = useRef([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [accountOwner, setAccountOwner] = useState([]);
  const [selectedAccountOwner, setSelectedAccountOwner] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [disable, setDisable] = useState(true);
  const [proposal, setProposal] = useState(false);
  const abortController = useRef(null);
  const [reset, setReset] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [dropCslId, setDropCslId] = useState([]);
  const [dpIds, setDpIds] = useState([]);
  let flag = 1;
  const HelpPDFName = "MappingCustomer.pdf";
  const HelpHeader = "Customer Mapping";
  const initialValue = {
    CustIds: "",
    CustStatus: "active",
    AeId: "",
    CslId: "-1",
    DpId: "-1",
    awId: "",
  };
  const [formData, setFormData] = useState(initialValue);
  const [salesTeri, setSalesTeri] = useState(-1);
  const [custStatus, setCustStatus] = useState(161);



  const loggedUserId = localStorage.getItem("resId");

  const [routes, setRoutes] = useState([]);
  let textContent = "Customers";
  let currentScreenName = ["Role Mapping"];

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 110) + "px"
  );

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
      const modifiedUrlPath = "/customer/mapping";
      getUrlPath(modifiedUrlPath);
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
  const getUrlPath = (modifiedUrlPath) => {
    console.log(modifiedUrlPath);
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=${modifiedUrlPath}&userId=${loggedUserId}`,
    })
      .then((res) => { })
      .catch((error) => { });
  };

  const exportExcel = () => {
    let dataInTable = [];
    for (let i = 0; i < tableData.length; i++) {
      const obj = {};

      const labels = {
        name: "Customer",
        cslName: "CSL",
        dpName: "Delivery Partner",
        salesExeName: "Account Executive",
        effectiveMonth: "Effective Start Month",
        accountOwnerName: "Account Owner",
      };

      const keys = Object.keys(labels);
      let modifiedValues = [];

      for (let i = 0; i < keys.length; i++) {
        modifiedValues.push(labels[keys[i]]);
      }

      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        if (key === "effectiveMonth") {
          const dateValue = tableData[i][key];
          const formattedDate = dateValue ? formatDate(dateValue) : "";
          obj[labels[key]] = formattedDate;
        } else {
          obj[labels[key]] = tableData[i][key];
        }
      }

      dataInTable.push(obj);
    }

    var wb = XLSX.utils.book_new(dataInTable),
      ws = XLSX.utils.json_to_sheet(dataInTable);

    XLSX.utils.book_append_sheet(wb, ws, "RoleMappingReport.xlsx");

    XLSX.writeFile(wb, "RoleMappingReport.xlsx");
  };

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    const formattedDate = `${("0" + date.getDate()).slice(
      -2
    )}-${date.toLocaleString("default", {
      month: "short",
    })}-${date.getFullYear()}`;
    return formattedDate;
  };

  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();
  const getcustData = () => {
    axios
      .get(baseUrl + `/CommonMS/master/geActiveCustomerList`)
      .then((resp) => {
        let customers = [];

        let data = resp.data;

        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.fullName,
              value: e.id,
            };

            customers.push(countryObj);
          });
        setCustomer(customers);
        setSelectCustomer(customers);
      });
  };

  const getcustData1 = () => {
    axios
      .get(baseUrl + `/CommonMS/master/geActiveCustomerList`)
      .then((resp) => {
        const data = resp.data;
        setcustData(data);
      })
      .catch((resp) => { });
  };

  useEffect(() => {
    getcustData1();
  }, [item]);

  const handleChange1 = (e) => {
    const { id, name, value } = e.target;
    if (name == "Select Customer" && value === "select") {
      setCustVisible(true);
      GlobalCancel(ref);
    }
    setcustData();
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const [selectedItems, setSelectedItems] = useState([{}]);
  const Customer = selectedItems?.map((d) => d?.id).toString();

  useEffect(() => { }, [item], [Customer], [formData.serarchVals]);

  const handleCsl = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/SalesMS/MasterController/getCslDropDownData?userId=${loggedUserId}`,
    }).then((Response) => {
      let departments = [];
      let deptIds = [];
      let data = Response.data;
      data.push({ id: 0, PersonName: "UnAssigned" });
      data.length > 0 &&
        data.forEach((e) => {
          let countryObj = {
            label: e.PersonName,
            value: e.id,
          };
          departments.push(countryObj);
          deptIds.push(countryObj.value);
        });
      setCountry(departments);
      setSelectedCountry(departments);
      const formattedString = deptIds.join(",");
      setDropCslId(formattedString);
    });
  };

  const handleClear = (e, rowData) => {
    const updatedSelectedRowsData = selectedRowsData.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, cslId: null };
      }
      return row;
    });

    setSelectedRowsData(updatedSelectedRowsData);
    setDisable(true);
    setIsModified(true);
  };

  const handleClear1 = (e, rowData) => {
    const updatedSelectedRowsData = selectedRowsData.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, dpId: null };
      }
      return row;
    });

    setSelectedRowsData(updatedSelectedRowsData);
    setDisable(true);
    setIsModified(true);
  };

  const handleClear2 = (e, rowData) => {
    const updatedSelectedRowsData = selectedRowsData.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, salesPersonId: null };
      }
      return row;
    });

    setSelectedRowsData(updatedSelectedRowsData);
    setDisable(true);
    setIsModified(true);
  };

  const handleClear3 = (e, rowData) => {
    const updatedSelectedRowsData = selectedRowsData.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, accountOwnerId: null };
      }
      return row;
    });

    setSelectedRowsData(updatedSelectedRowsData);
    setDisable(true);
    setIsModified(true);
  };

  const getDeliveryPartners = () => {
    axios
      .get(baseUrl + `/administrationms/subkconversiontrend/getdeliverypartner`)
      .then((Response) => {
        let deliver = [];
        let deliveryId = [];
        let data = Response.data;
        data.push({ id: 0, PersonName: "UnAssigned" });
        data.length > 0 &&
          data.forEach((e) => {
            let deliverObj = { label: e.PersonName, value: e.id };
            deliver.push(deliverObj);
            deliveryId.push(deliverObj.value);
          });
        setDelivery(deliver);
        setSelectedDelivery(deliver);
        const formattedDelIds = deliveryId.join(",");
        setDpIds(formattedDelIds);
      });
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


  const resourceFnc = async () => {
    await axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then((res) => {
      let manger = res.data;
      setResource(manger);
    });
  };

  const [issueDetails, setIssueDetails] = useState([]);
  const getData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
    });
  };

  useEffect(() => {
    getcustData();
    resourceFnc();
    handleCsl();
    getDeliveryPartners();
    getData();
    getAccountOwner();
    handleSalesTerritories();
  }, []);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="primeTableSearch">
        <InputText
          className="globalFilter"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />

        <i
          class="pi pi-file-excel exportBtn"
          onClick={exportExcel}
          data-pr-tooltip="XLS"
          title="Export to Excel"
        ></i>
      </div>
    );
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderState(false);
  };

  var data = {
    CustIds: selectedCust,
    CustStatus: formData.CustStatus,
    AeId: formData.AeId,
    CslId: formData.CslId == dropCslId ? "-1" : formData.CslId,
    DpId: formData.DpId == dpIds ? "-1" : formData.DpId,
    awId: formData.awId,
    Sales_terr: salesTeri == "null" ? null : salesTeri,
    status_id: custStatus == "null" ? null : custStatus,
  };

  const [xlData, setXlData] = useState([]);

  const postData = () => {
    let filteredData = ref.current.filter((d) => d != null);

    ref.current = filteredData;

    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidationMessage(true);
        setsearching(false);
        setTimeout(() => {
          setValidationMessage(false);
        }, 3000);
      }
      return;
    }

    setLoaderState(false);
    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/customersms/Customers/getRoleMapping`,
      signal: abortController.current.signal,
      data,
    }).then((res) => {
      const GetData = res.data;
      for (let i = 0; i < GetData.length; i++) {
        GetData[i]["cslName"] =
          GetData[i]["cslName"] == "" ? "" : GetData[i]["cslName"];

        GetData[i]["dpName"] =
          GetData[i]["dpName"] == "" ? "" : GetData[i]["dpName"];

        GetData[i]["salesExeName"] =
          GetData[i]["salesExeName"] == "" ? "" : GetData[i]["salesExeName"];

        GetData[i]["accountOwnerName"] =
          GetData[i]["accountOwnerName"] == ""
            ? ""
            : GetData[i]["accountOwnerName"];

        GetData[i]["effectiveMonth"] =
          GetData[i]["effectiveMonth"] === ""
            ? ""
            : moment(GetData[i]["effectiveMonth"]).format("YYYY-MM-DD");
      }
      let Headerdata = [
        {
          name: "Customer",
          cslName: "CSL",
          dpName: "Delivery Partner",
          salesExeName: "Account Executive",
          effectiveMonth: "Effective Start Month",
          accountOwnerName: "Account Owner",
        },
      ];

      setXlData(Headerdata.concat(GetData));
      setTableData(GetData);
      setPreviousTableData(GetData);
      setLoaderState(false);
      setsearching(true);
      setTableKey((prevKey) => prevKey + 1);

      setTimeout(() => {
        setLoaderState(false);
      }, 1000);
      !valid && setVisible(!visible);
      visible
        ? setCheveronIcon(FaChevronCircleUp)
        : setCheveronIcon(FaChevronCircleDown);
    });
  };

  const handleSelection = (e) => {
    setSelectedRows(e.value);
    if (e.value) {
      setDisable(false);
    }
  };

  useEffect(() => {
    setSelectedRowsData((prev) => selectedRows);
  }, [selectedRows]);

  const onchange = (e, rowData) => {
    const index = selectedRowsData.findIndex(
      (selectedRowData) => selectedRowData.id === rowData.id
    );
    const updatedSelectedRowsData = [...selectedRowsData];
    updatedSelectedRowsData[index] = {
      ...updatedSelectedRowsData[index],
      cslId: e.id,
    };
    setSelectedRowsData(updatedSelectedRowsData);
  };

  const onchange1 = (e, rowData) => {
    const index = selectedRowsData.findIndex(
      (selectedRowData) => selectedRowData.id === rowData.id
    );
    const updatedSelectedRowsData = [...selectedRowsData];
    updatedSelectedRowsData[index] = {
      ...updatedSelectedRowsData[index],
      dpId: e.id,
    };
    setSelectedRowsData(updatedSelectedRowsData);
  };

  const onchange2 = (e, rowData) => {
    const index = selectedRowsData.findIndex(
      (selectedRowData) => selectedRowData.id === rowData.id
    );
    const updatedSelectedRowsData = [...selectedRowsData];
    updatedSelectedRowsData[index] = {
      ...updatedSelectedRowsData[index],
      salesPersonId: e.id,
    };
    setSelectedRowsData(updatedSelectedRowsData);
  };

  const onchange3 = (e, rowData) => {
    const index = selectedRowsData.findIndex(
      (selectedRowData) => selectedRowData.id === rowData.id
    );
    const updatedSelectedRowsData = [...selectedRowsData];
    updatedSelectedRowsData[index] = {
      ...updatedSelectedRowsData[index],
      accountOwnerId: e.id,
    };
    setSelectedRowsData(updatedSelectedRowsData);
  };

  const onchangeDate = (e, rowData) => {
    const index = selectedRowsData.findIndex(
      (selectedRowData) => selectedRowData.id === rowData.id
    );

    const updatedSelectedRowsData = [...selectedRowsData];
    updatedSelectedRowsData[index] = {
      ...updatedSelectedRowsData[index],
      effectiveMonth: moment(e).format("yyyy-MM-DD"),
    };
    setSelectedRowsData(updatedSelectedRowsData);
  };

  const sendSelectedRowsData = () => {
    if (isModified == false) {
      setErrorMessage(
        <div>
          <AiFillWarning style={{ marginTop: "-3px" }} />
          &nbsp;No Modifications found to save
        </div>
      );

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }
    const formattedData = selectedRowsData.map((rowData) => ({
      id: rowData.id,
      cslId: rowData.cslId,
      deliveryPartnerId: rowData.dpId,

      salesPersonId: rowData.salesPersonId,

      awId: rowData.accountOwnerId,

      effectiveMonth: rowData.effectiveMonth,
      loggedId: loggedUserId,
    }));

    axios({
      method: "post",
      url: baseUrl + `/customersms/Customers/putRoleMapping`,
      data: formattedData,
    }).then((res) => {
      if (res.status == 200) {
        axios
          .post(
            baseUrl +
            `/customersms/Customers/updateCustomerStakeholdersToProject`,
            { CustIds: Ids }
          )
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
        setTableDisable(true);
        setProposal(true);
        setIsModified(false);
        setErrorMessage(false);
        setTimeout(() => {
          setErrorMessage(false);
        }, 2000);
        setTimeout(() => {
          setProposal(false);
        }, 3000);
        postData();
      }
    });
  };

  const header = renderHeader();

  const handleReset = () => {
    setSelectedRows([]);
    setTableDisable(false);
  };

  useEffect(() => {
    if (tableDisable) {
      setSelectedRows([]);
      setTableDisable(false);
      postData();
    }
  }, [tableDisable]);
  const inputOne = (rowData) => {
    return selectedRows.map((d) => d.id).includes(rowData.id) ? (
      <Link
        title={rowData.name}
        to={`/search/customerSearch/customer/dashboard/:${rowData.id}`}
        target="_blank"
      >
        {rowData.name}
      </Link>
    ) : (
      <Link
        title={rowData.name}
        to={`/search/customerSearch/customer/dashboard/:${rowData.id}`}
        target="_blank"
      >
        {rowData.name}
      </Link>
    );
  };

  const inputTwo = (rowData) => {
    return selectedRows.map((d) => d.id).includes(rowData.id) ? (
      <div className="autoComplete-container cancel">
        <ReactSearchAutocomplete
          className="cancel"
          items={resource}
          id="cslId"
          name="cslId"
          inputSearchString={rowData.cslName == null ? "" : rowData.cslName}
          onSelect={(e) => {
            onchange(e, rowData);
            setDisable(false);
            setIsModified(true);
          }}
          onClear={(e) => handleClear(e, rowData)}
          placeholder="Type to Search"
          showIcon={false}
        />
      </div>
    ) : (
      <input
        className="cursor-not-allowed"
        type="text"
        title={rowData.cslName}
        placeholder="Type to Search"
        value={rowData.cslName}
        readOnly
        onFocus={(event) => event.target.blur()}
      />
    );
  };

  const inputThree = (rowData) => {
    return selectedRows.map((d) => d.id).includes(rowData.id) ? (
      <div className="autoComplete-container">
        <ReactSearchAutocomplete
          className="cancel"
          items={resource}
          id="deliveryPartnerId"
          name="deliveryPartnerId"
          inputSearchString={rowData.dpName == null ? "" : rowData.dpName}
          onSelect={(e) => {
            onchange1(e, rowData);
            setDisable(false);
            setIsModified(true);
          }}
          onClear={(e) => handleClear1(e, rowData)}
          placeholder="Type to Search"
          showIcon={false}
        />
      </div>
    ) : (
      <input
        className="cursor-not-allowed"
        type="text"
        title={rowData.dpName}
        placeholder="Type to Search"
        value={rowData.dpName}
        readOnly
        onFocus={(event) => event.target.blur()}
      />
    );
  };

  const inputFour = (rowData) => {
    setCslId1(rowData.cslid);
    return selectedRows.map((d) => d.id).includes(rowData.id) ? (
      <div className="autoComplete-container">
        <ReactSearchAutocomplete
          className="cancel"
          items={resource}
          id="salesPersonId"
          name="salesPersonId"
          inputSearchString={
            rowData.salesExeName == null ? "" : rowData.salesExeName
          }
          onSelect={(e) => {
            onchange2(e, rowData);

            setDisable(false);
            setIsModified(true);
          }}
          onClear={(e) => handleClear2(e, rowData)}
          placeholder="Type to Search"
          showIcon={false}
        />
      </div>
    ) : (
      <input
        className="cursor-not-allowed"
        type="text"
        title={rowData.salesExeName}
        placeholder="Type to Search"
        value={rowData.salesExeName}
        readOnly
        onFocus={(event) => event.target.blur()}
      />
    );
  };
  const inputFive = (rowData) => {
    setReset(rowData);
    return selectedRows.map((d) => d.id).includes(rowData.id) ? (
      <div className="autoComplete-container">
        <ReactSearchAutocomplete
          className="cancel"
          items={resource}
          id="awId"
          name="awId"
          inputSearchString={
            rowData.accountOwnerName == null ? "" : rowData.accountOwnerName
          }
          onSelect={(e) => {
            onchange3(e, rowData);
            setDisable(false);
            setIsModified(true);
          }}
          onClear={(e) => handleClear3(e, rowData)}
          showIcon={false}
          placeholder="Type to Search"
        />
      </div>
    ) : (
      <input
        className="cursor-not-allowed"
        type="text"
        title={rowData.accountOwnerName}
        placeholder="Type to Search"
        value={rowData.accountOwnerName}
        readOnly
        onFocus={(event) => event.target.blur()}
      />
    );
  };

  const AnotherComponent = (rowData) => {
    return selectedRows.map((d) => d.id).includes(rowData.id) ? (
      <div className="datepicker">
        <InputSixComponent
          rowData={rowData}
          name="month"
          id="month"
          className="cancel"
          setDisable={setDisable}
          setIsModified={setIsModified}
          onchangeDate={onchangeDate}
          dateFormat="MMM-yyyy"
          placeholderText="Select Month"
          showMonthYearPicker
        />
      </div>
    ) : (
      <input
        className="cursor-not-allowed"
        type="text"
        title={
          rowData.effectiveMonth == ""
            ? ""
            : moment(rowData.effectiveMonth).format("MMM-yyyy")
        }
        placeholder="Select Month"
        value={
          rowData.effectiveMonth == ""
            ? ""
            : moment(rowData.effectiveMonth).format("MMM-yyyy")
        }
        readOnly
        onFocus={(event) => event.target.blur()}
      />
    );
  };

  const Action = (rowData) => {
    return selectedRows.map((d) => d.id).includes(rowData.id) ? (
      <>
        <BiSave
          className=""
          size="1.5em"
          title="Save"
          color="blue"
          onClick={sendSelectedRowsData}
          cursor="pointer"
        />
      </>
    ) : (
      <div class="cursor-not-allowed">
        <BiSave color="#666" size="1.5em" />
      </div>
    );
  };

  <InputText
    value={globalFilter}
    onChange={(e) => setGlobalFilter(e.target.value)}
    placeholder="Search"
  />;

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );

  const handleClearAe = () => {
    setFormData((prev) => ({ ...prev, AeId: "" }));
  };
  const handleClearAo = () => {
    setFormData((prev) => ({ ...prev, awId: "" }));
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
      {errorMessage && <div className="statusMsg error">{errorMessage}</div>}
      {validationMessage ? (
        <div className="statusMsg error">
          {" "}
          <span>
            {" "}
            <IoWarningOutline /> Please select the valid values for highlighted
            fields{" "}
          </span>
        </div>
      ) : (
        ""
      )}
      {proposal ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Proposal saved successfully."}
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Role Mapping</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={HelpHeader} />
          </div>
        </div>
      </div>

      <div className="group mb-2 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customers">
                  Customers&nbsp;<span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    className="text cancel"
                    name="Select Customer"
                    id="searchType"
                    onChange={handleChange1}
                  >
                    {selectedItems.length + "selected"}
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>

                    <option value="select">Select Customer</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="custstatus">
                  Allocation Status
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="CustStatus"
                    name="CustStatus"
                    defaultValue={"active"}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="-1">&lt;&lt;All&gt;&gt;</option>
                    <option value="active">Having Allocations</option>
                    <option value="inactive">No Allocations</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-6" htmlFor="accountexecutive">
                  Account Executive{" "}
                </label>
                <span className="col-1 p-0">:</span>

                <div className="col-5 autoComplete-container">
                  <ReactSearchAutocomplete
                    className=""
                    items={resource}
                    type="Text"
                    name="AeId"
                    id="AeId"
                    disabled
                    fuseOptions={{ keys: ["id", "name"] }}
                    resultStringKeyName="name"
                    resource={resource}
                    placeholder="Type minimum 3 characters"
                    resourceFnc={resourceFnc}
                    onSelect={(e) => {
                      setFormData((prevProps) => ({
                        ...prevProps,
                        AeId: e.id,
                      }));
                    }}
                    onClear={handleClearAe}
                    showIcon={false}
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="csl">
                  CSL&nbsp;<span className="error-text">*</span>
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
                      ArrowRenderer={ArrowRenderer}
                      id="CslId"
                      options={country}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectedCountry}
                      valueRenderer={generateDropdownLabel}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedCountry(s);
                        let filteredCountry = [];
                        s.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["CslId"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="deliverypartner">
                  Delivery Partner&nbsp;<span className="error-text">*</span>
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
                      ArrowRenderer={ArrowRenderer}
                      id="DpId"
                      options={delivery}
                      hasSelectAll={true}
                      isLoading={false}
                      value={selectDelivery}
                      valueRenderer={generateDropdownLabel}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      disabled={false}
                      onChange={(e) => {
                        setSelectedDelivery(e);
                        let filteredCountry = [];
                        e.forEach((d) => {
                          filteredCountry.push(d.value);
                        });
                        setFormData((prevVal) => ({
                          ...prevVal,
                          ["DpId"]: filteredCountry.toString(),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="accountexecutive">
                  Account Owner{" "}
                </label>
                <span className="col-1 p-0">:</span>

                <div className="col-6 autoComplete-container">

                  <MultiSelect
                    ArrowRenderer={ArrowRenderer}
                    id="awId"
                    options={accountOwner}
                    hasSelectAll={true}
                    isLoading={false}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedAccountOwner}
                    valueRenderer={generateDropdownLabel}
                    disabled={false}
                    onChange={(s) => {
                      setSelectedAccountOwner(s);
                      let filteredValues = [];
                      s.forEach((d) => {
                        filteredValues.push(d.value);
                      });

                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["awId"]: filteredValues.toString(),
                      }));
                      setValidationMessage(false);
                    }}
                  />


                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-6" htmlFor="salesterritory">
                  Sales Territory
                </label>
                <span className="col-1 p-0">:</span>

                <div className="col-5">
                  <select
                    className="text cancel"
                    name="SalesTerritory"
                    id="SalesTerritory"
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      // console.log(`Selected value: ${selectedValue}`);
                      setSalesTeri(selectedValue);
                    }}
                  >
                    <option value="-1"> &lt;&lt;ALL&gt;&gt;</option>
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


            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center">
              {loaderState ? (
                <Loader handleAbort={handleAbort} />
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  title="Search"
                  onClick={() => {
                    postData();
                    setSelectedRows([]);
                    setTableDisable(false);
                  }}
                >
                  <FaSearch />
                  Search
                </button>
              )}
            </div>
          </div>
        </CCollapse>
      </div>
      <div></div>

      {searching && (
        <div
          className="p-fluid roleMappingTable darkHeader"
          style={{ marginTop: "-2px" }}
        >
          <DataTable
            value={tableData}
            className="primeReactDataTable"
            selectionMode="checkbox"
            selection={selectedRows}
            editMode="row"
            rows={25}
            showGridlines
            paginator
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 15, 25, 50]}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            dataKey="id"
            disabled={tableDisable}
            onSelectionChange={(e) => handleSelection(e)}
            filters={filters}
            header={header}
            emptyMessage="No Data Found"
            currentPageReportTemplate="View {first} - {last} of {totalRecords} "
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            rowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
            key={tableKey}
          >
            <Column
              selectionMode="multiple"
              align={"center"}
              headerStyle={{ width: "1rem", padding: "0px 60px" }}
              body={(rowData) => null}
            ></Column>

            <Column
              field="name"
              header="Customer"
              body={inputOne}
              sortable
            ></Column>
            <Column
              field="cslName"
              header="CSL"
              body={inputTwo}
              sortable
            ></Column>
            <Column
              field="dpName"
              header="Delivery Partner"
              body={inputThree}
              sortable
              onChange={(e) => onchange(e, rowData)}
            ></Column>
            <Column
              field="salesExeName"
              header="Account Executive"
              body={inputFour}
              sortable
              onChange={(e) => onchange(e, rowData)}
            ></Column>
            <Column
              field="effectiveMonth"
              header="Effective Start Month"
              body={AnotherComponent}
              sortable
              onChange={(e) => onchange(e, rowData)}
            ></Column>
            <Column
              field="accountOwnerName"
              header="Account Owner"
              body={inputFive}
              sortable
              onChange={(e) => onchange(e, rowData)}
            ></Column>

            {
              <Column
                header={() => {
                  return (
                    <div style={{ marginLeft: "-2%", width: "107%" }}>
                      Action Item
                    </div>
                  );
                }}
                field="action"
                body={Action}
                headerStyle={{ width: "80px" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
            }
          </DataTable>
        </div>
      )}
      <div className="btn-container center  mt-2">
        {searching == true && tableData.length > 0 ? (
          <button
            className="btn btn-primary"
            type="submit"
            onClick={() => {
              sendSelectedRowsData();
            }}
          >
            <BiSave title="Save" />
            Save
          </button>
        ) : (
          ""
        )}
        {searching == true && tableData.length > 0 ? (
          <button
            className="btn btn-primary"
            type="Reset"
            onClick={(e) => handleReset(e)}
          >
            <BiReset title="Reset" />
            Reset
          </button>
        ) : (
          ""
        )}
      </div>
      <SelectCustDialogBox
        flag={flag}
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
      />
    </div>
  );
}

export default RoleMapping;
