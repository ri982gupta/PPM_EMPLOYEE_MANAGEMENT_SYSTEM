import axios from "axios";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { BiSearch } from "react-icons/bi";
import Loader from "../Loader/Loader";
import { IoWarningOutline } from "react-icons/io5";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { MultiSelect } from "react-multi-select-component";
import { environment } from "../../environments/environment";
// import ProjectInvoiceDetailsTable from "./ProjectInvoiceDetailsTable";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Link } from "react-router-dom";
import { Column } from "primereact/column";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
function Projectinvoicedetails(props) {
  const [loader, setLoader] = useState(false);
  const baseUrl = environment.baseUrl;
  const [validationMessage, setValidationMessage] = useState(false);
  const [durationOptions, setDurationOptions] = useState([1]);
  const [selectedDuration, setSelectedDuration] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [invoiceStatusData, setInvoiceStatusData] = useState([]);
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projectInvoiceDetails, setProjectInvoiceDetails] = useState([{}]);
  const [isShow, setIsShow] = useState(false);
  // const [month, setMonth] = useState(moment(moment().startOf("from"))._d);

  const [hideproject, setHideproject] = useState(true);
  const today = new Date();
  const first_day = new Date(today.getFullYear(), today.getMonth(), 1);
  //console.log(first_day);
  //console.log(moment(first_day).format("yyyy-MM-DD"));
  const initialValue = {
    viewType: 1,
    from: moment(first_day).format("yyyy-MM-DD"),
    duration: 1,
    invStage: -1,
    customers: -1,
    projects:
      selectedProjects == "" || selectedProjects == [] ? -1 : selectedProjects,
    reportId: 29,
  };
  const [formData, setFormData] = useState(initialValue);
  //console.log(formData.from.length);
  //console.log(formData.from);
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

  const getAbsoluteMonths = (momentDate) => {
    let mont = Number(moment(momentDate).format("MM"));
    //console.log(mont);
    let yea = Number(moment(momentDate).format("YYYY"));
    //console.log(yea);
    return mont + yea * 12;
  };
  const [duration, setDuration] = useState([]);
  //console.log(duration);
  const calculateDuration = (e) => {
    let startMonths = getAbsoluteMonths(e);
    //console.log(startMonths);
    let endMonths = getAbsoluteMonths(moment());
    //console.log(endMonths);
    let monthDifference = endMonths - startMonths;
    //console.log(monthDifference);
    monthDifference += 1;
    let dr = [];
    for (let i = 1; i <= monthDifference; i++) {
      dr.push(i);
      //console.log(dr);
    }
    //console.log(dr);
    setDuration(dr);
  };
  // useEffect(() => {
  //   calculateDuration(month);
  // }, []);
  const [customerInvoiceDetails, setCustomerInvoiceDetails] = useState([]);
  //-------getting invoice status
  const getInvoiceStatusData = () => {
    axios
      .get(baseUrl + `/CostMS/projectInvoice/projectInvoiceStatus`)
      .then((resp) => {
        let InvoiceSales = [];
        let data = resp.data;
        //console.log(data);
        data.length > 0 &&
          data.forEach((e) => {
            let salesObj = {
              label: e.label,
              value: e.value,
            };
            //console.log(salesObj);
            InvoiceSales.push(salesObj);
            //console.log(InvoiceSales, "-----InvoiceSales");
          });
        setInvoiceStatusData(InvoiceSales);
        setSelectedInvoiceStatus(InvoiceSales);
      });
  };
  //console.log(invoiceStatusData);
  const getCustomersData = () => {
    axios({
      url: baseUrl + `/CostMS/projectInvoice/customers`,
    }).then((resp) => {
      setCustomers(resp.data);
    });
  };
  //console.log(customers);
  //console.log(selectedCustomers);
  const getCustomersByProjectsData = () => {
    //console.log(selectedCustomers);
    axios({
      url:
        baseUrl +
        `/CostMS/projectInvoice/projectsByCustomers?customerId=${selectedCustomers[0]?.value}`,
    }).then((resp) => {
      let Storeproject = [];
      let data = resp.data;
      //console.log(data);
      data.length > 0 &&
        data.forEach((e) => {
          let salesObj = {
            label: e.label,
            value: e.value,
          };
          //console.log(salesObj);
          Storeproject.push(salesObj);
          //console.log(Storeproject, "-----Storeproject");
        });
      setProjectData(Storeproject);
      //console.log(projectData);
      setSelectedProjects(Storeproject);
      //console.log(selectedProjects);
      setOpen(false);
    });
  };
  //console.log(projectData);
  //--------for getting project table
  const getProjectInvoiceDetails = () => {
    setLoader(true);

    setTimeout(() => {
      setLoader(false);
    }, 100);
    if (formData.customers.length > 0) {
      //console.log("inline---------------if");
      formData["projects"] = selectedProjects.map((d) => d.value).toString();
      //console.log(formData);
      //console.log(selectedProjects.map((d) => d.value).toString());
    }

    axios({
      method: "POST",
      url: baseUrl + `/CostMS/projectInvoice/getProjectInvoiceDetails`,

      data: formData,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const data = res.data;
        //console.log(data);
        data.sort((a, b) => new Date(b.invMonth) - new Date(a.invMonth));
        //console.log(data);
        const Headerdata = [
          {
            invMonth: "Inv.Date",
            invoiceName: "Inv.Name",
            project: "Project",
            customer: "Customer ",
            salesExec: "Sakes Exec",
            total: "Total($)",
            discount: "Discount($)",
            netInv: "Net Inv($)",
            invStatus: "Status",
            plannedRev: "PL.Rev($)",
            resDirectCost: "Res.Cost($)",
            recRevenue: "Rec.Rev($)",
            grossMargin: "Gross Margin",
            grossMarginPerc: "Gross Margin(%)",
          },
        ];

        // let data1 = [""];
        // let linkRoutes = [""];
        // setLinkColumns(data1);
        // setLinkColumnsRoutes(linkRoutes);
        let hData = [];
        let bData = [];
        for (let index = 0; index < data.length; index++) {
          if (index == 0) {
            hData.push(data[index]);
          } else {
            bData.push(data[index]);
          }
        }
        setProjectInvoiceDetails(Headerdata.concat(bData));
        //console.log(projectInvoiceDetails);
        setOpen(false);
        setValidationMessage(false);
        setLoader(false);
      })
      .catch((error) => {
        //console.log("Error :" + error);
      });
  };
  const [headerData, setHeaderData] = useState([]);
  useEffect(() => {
    projectInvoiceDetails[0] &&
      setHeaderData(JSON.parse(JSON.stringify(projectInvoiceDetails[0])));
  }, [projectInvoiceDetails]);
  useEffect(() => {
    customerInvoiceDetails[0] &&
      setHeaderData(JSON.parse(JSON.stringify(customerInvoiceDetails[0])));
  }, [customerInvoiceDetails]);
  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link
          target="_blank"
          to={rou[0] + ":" + data[rou[1]]}
          data-toggle="tooltip"
        >
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };
  const changeReqDateTT = (data) => {
    return (
      <div data-toggle="tooltip" title={data.invMonth}>
        {data.invMonth}
      </div>
    );
  };
  const invName = (data) => {
    return (
      <div data-toggle="tooltip" title={data.invoiceName}>
        {data.invoiceName}
      </div>
    );
  };
  const projecttool = (data) => {
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data.project}>
        {data.project}
      </div>
    );
  };
  const customertool = (data) => {
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data.customer}>
        {data.customer}
      </div>
    );
  };
  const salesExectool = (data) => {
    return (
      <div data-toggle="tooltip" title={data.salesExec}>
        {data.salesExec}
      </div>
    );
  };

  const discounttool = (data) => {
    return (
      <div data-toggle="tooltip" align="right" title={data.discount}>
        {data.discount}
      </div>
    );
  };
  const netInvtool = (data) => {
    return (
      <div data-toggle="tooltip" align="right" title={data.netInv}>
        {data.netInv}
      </div>
    );
  };
  const invStatustool = (data) => {
    return (
      <div data-toggle="tooltip" align="right" title={data.invStatus}>
        {data.invStatus}
      </div>
    );
  };
  const plannedRevtool = (data) => {
    const formattedNumber = data.plannedRev
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
      <div data-toggle="tooltip" align="right" title={formattedNumber}>
        {formattedNumber}
      </div>
    );
  };
  const totaltool = (data) => {
    const formattedNumber = data.total
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
      <div data-toggle="tooltip" align="right" title={formattedNumber}>
        {formattedNumber}
      </div>
    );
  };
  const resDirectCosttool = (data) => {
    const formattedNumber = data.resDirectCost
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
      <div data-toggle="tooltip" align="right" title={formattedNumber}>
        {formattedNumber}
      </div>
    );
  };
  const recRevenuetool = (data) => {
    const formattedNumber = data?.recRevenue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
      <div data-toggle="tooltip" align="right" title={formattedNumber}>
        {formattedNumber}
      </div>
    );
  };
  const grossMargintool = (data) => {
    const formattedNumber = data.grossMargin
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //console.log("inline------------10" + formattedNumber);
    return (
      <div data-toggle="tooltip" align="right" title={formattedNumber}>
        {formattedNumber}
      </div>
    );
  };

  const grossMarginPerctool = (data) => {
    //console.log(data.grossMarginPerc);
    return (
      <div data-toggle="tooltip" align="right" title={data.grossMarginPerc}>
        {data.grossMarginPerc}
      </div>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == ""
            ? LinkTemplate
            : col == "invMonth"
            ? changeReqDateTT
            : col == "invoiceName"
            ? invName
            : col == "project"
            ? projecttool
            : col == "customer"
            ? customertool
            : col == "salesExec"
            ? salesExectool
            : col == "total"
            ? totaltool
            : col == "discount"
            ? discounttool
            : col == "netInv"
            ? netInvtool
            : col == "invStatus"
            ? invStatustool
            : col == "plannedRev"
            ? plannedRevtool
            : col == "resDirectCost"
            ? resDirectCosttool
            : col == "recRevenue"
            ? recRevenuetool
            : col == "grossMargin"
            ? grossMargintool
            : col == "grossMarginPerc"
            ? grossMarginPerctool
            : ""
        }
        field={col}
        header={headerData[col]}
      />
    );
  });

  //---------for getting customer table
  const getCustomerInvoiceDetails = () => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 100);
    axios({
      method: "POST",
      url: baseUrl + `/CostMS/projectInvoice/getProjectInvoiceDetails`,

      data: formData,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        const data = res.data;
        //console.log(data);
        data.sort((a, b) => new Date(b.invMonth) - new Date(a.invMonth));
        //console.log(data);
        for (let i = 0; i < data.length; i++) {
          data[i]["recRevenue"] =
            data[i]["recRevenue"] == null ? 0 : data[i]["recRevenue"];
          data[i]["grossMarginPerc"] =
            data[i]["grossMarginPerc"] == null ? 0 : data[i]["grossMarginPerc"];
        }
        const Headerdata = [
          {
            invMonth: "Inv.Mon",
            customer: "Customer ",
            salesExec: "Sales Exec",
            total: "Total($)",
            discount: "Discount($)",
            netInv: "Net Inv($)",
            plannedRev: "PL.Rev($)",
            resDirectCost: "Res.Cost($)",
            recRevenue: "Res.Rev($)",
            grossMargin: "Gross Margin",
            grossMarginPerc: "Gross Margin(%)",
          },
        ];

        let hData = [];
        let bData = [];
        for (let index = 0; index < data.length; index++) {
          if (index == 0) {
            hData.push(data[index]);
          } else {
            bData.push(data[index]);
          }
        }
        setCustomerInvoiceDetails(Headerdata.concat(bData));
        //console.log(customerInvoiceDetails);
        setOpen(false);
        setValidationMessage(false);
      })
      .catch((error) => {
        //console.log("Error :" + error);
      });
  };
  //console.log(headerData);
  //console.log(customerInvoiceDetails);
  useEffect(() => {
    getCustomersByProjectsData();
  }, [selectedCustomers]);
  const [opencus, setOpencus] = useState(false);
  const searchClickHandler = () => {
    //console.log(formData);
    let valid = GlobalValidation(ref);
    //console.log("inline-------10-----" + GlobalValidation(ref));
    if (valid) {
      {
        setValidationMessage(true);
        // setsearching(false);
      }
      return;
    }
    if (hideproject == "1") {
      //console.log("useEffect------------------3");
      //console.log(hideproject);
      getProjectInvoiceDetails();
      setIsShow(true);
    } else {
      //console.log("useEffect------------------4");
      //console.log(hideproject);
      getCustomerInvoiceDetails();
      setOpencus(true);
    }
  };
  //console.log(formData);
  const [open, setOpen] = useState(false);
  const onFilterChange = ({ id, value }) => {
    // //console.log(id + " " + value)
    setFormData((prevState) => {
      return { ...prevState, [id]: value };
    });
    setHideproject(value);
    setOpen(false);
  };
  useEffect(() => {
    getProjectInvoiceDetails();
    getCustomerInvoiceDetails();
  }, [hideproject]);

  //console.log(hideproject);
  useEffect(() => {
    getInvoiceStatusData();
    getCustomersData();
  }, []);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  let rows = 10;
  const [exportData, setExportData] = useState([]);
  useEffect(() => {
    let imp = ["XLS"];
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
  var maxDate = new Date();
  var year = maxDate.getFullYear();
  var month1 = maxDate.getMonth();
  var minDate = new Date(year, month1 - 11);
  var maxDate = new Date(year, month1 + 11);

  const durationdate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const ref = useRef([]);

  const handleMonthChange = (selectedMonth) => {
    setSelectedMonth(selectedMonth);
    setFormData((prevVal) => ({
      ...prevVal,
      ["from"]: moment(selectedMonth).format("yyyy-MM-DD"),
    }));
    const currentMonth = new Date();
    const monthsDiff =
      (currentMonth.getFullYear() - selectedMonth.getFullYear()) * 12 +
      (currentMonth.getMonth() - selectedMonth.getMonth());

    // Generate an array of duration options based on monthsDiff
    const options = [];
    for (let i = 1; i <= monthsDiff + 1; i++) {
      options.push(i);
    }

    setDurationOptions(options);
    setSelectedDuration(""); // Reset to an empty string or initial value
  };
  useEffect(() => {
    console.log(selectedDuration);
  }, [selectedDuration]);
  const currentYear = new Date().getFullYear();
  const minDate1 = new Date(currentYear, 0, 1);
  return (
    <div>
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
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Invoice Details</h2>
          </div>
          <div className="childThree"></div>
        </div>
      </div>
      <div className="group  customCard">
        <h2>Search Filters</h2>
        <div className="group-content row">
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="viewType">
                View By &nbsp;<span style={{ color: "red" }}>*</span>
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <select
                  id="viewType"
                  name="viewType"
                  onChange={(e) => {
                    onFilterChange(e.target);
                  }}
                >
                  <option value="1">Projects</option>
                  <option value="2">Customers</option>
                </select>
              </div>
            </div>
          </div>
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="startMonth">
                Start Month &nbsp;<span style={{ color: "red" }}>*</span>
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <DatePicker
                  name="from"
                  id="from"
                  selected={selectedMonth}
                  onChange={handleMonthChange}
                  dateFormat="MMM yyyy"
                  maxDate={new Date()}
                  minDate={minDate1}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showMonthYearPicker
                />
              </div>
            </div>
          </div>
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="duration">
                Duration &nbsp;
                <span className="error-text" style={{ color: "red" }}>
                  *
                </span>
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <div>
                  <select
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                    className="error enteredDetails cancel text"
                    id="duration"
                    name="duration"
                    value={selectedDuration}
                    onChange={(e) => {
                      setSelectedDuration(e.target.value);
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["duration"]: e.target.value,
                      }));
                    }}
                  >
                    <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                    {durationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" value="null" htmlFor="invoiceStatus">
                Invoice Status&nbsp;<span style={{ color: "red" }}>*</span>
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <div
                  className="multiselect"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    id="invStage"
                    options={invoiceStatusData}
                    ArrowRenderer={ArrowRenderer}
                    hasSelectAll={true}
                    selected={selectedInvoiceStatus}
                    disableSearch={false}
                    value={selectedInvoiceStatus}
                    disabled={false}
                    valueRenderer={generateDropdownLabel}
                    onChange={(e) => {
                      setSelectedInvoiceStatus(e);
                      //console.log(e);
                      let filteredinvStage = [];
                      e.forEach((d) => {
                        filteredinvStage.push(d.value);
                        //console.log(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["invStage"]: filteredinvStage.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="customer">
                Customer
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                {/* <div
                  className="multiselect"
                  ref={(ele) => {
                    ref.current[2] = ele;
                  }}
                > */}
                <MultiSelect
                  id="customers"
                  options={customers}
                  ArrowRenderer={ArrowRenderer}
                  valueRenderer={generateDropdownLabel}
                  hasSelectAll={true}
                  value={selectedCustomers}
                  disableSearch={false}
                  shouldToggleOnHover={false}
                  selected={selectedCustomers}
                  disabled={false}
                  onChange={(e) => {
                    setSelectedCustomers(e);
                    //console.log(e);
                    let filteredCustomer = [];
                    e.forEach((d) => {
                      filteredCustomer.push(d.value);
                      //console.log(d.value);
                    });
                    setFormData((prevVal) => ({
                      ...prevVal,
                      ["customers"]: filteredCustomer.toString(),
                    }));
                  }}
                />
                {/* </div> */}
              </div>
            </div>
          </div>
          {hideproject == "1" ? (
            <div className=" col-md-4">
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="project">
                  Project
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  {/* <div
                    className="multiselect"
                    ref={(ele) => {
                      ref.current[3] = ele;
                    }}
                  > */}
                  <MultiSelect
                    id="projects"
                    options={projectData}
                    hasSelectAll={true}
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={(selected) => {
                      if (selected.length === 0) {
                        return "Select";
                      } else {
                        return `${selected.length} selected`;
                      }
                    }}
                    selected={selectedProjects}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedProjects}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedProjects(e);
                      //console.log(e);
                      let filteredCustomer = [];
                      e.forEach((d) => {
                        filteredCustomer.push(d.value);
                        //console.log(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["acct"]: filteredCustomer.toString(),
                      }));
                    }}
                  />
                </div>
                {/* </div> */}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="col-12" align="center">
          <button className="btn btn-primary" onClick={searchClickHandler}>
            <BiSearch />
            Search
          </button>
        </div>
        <div className="col-12"></div>
      </div>
      <div>
        {/* {loader ? <Loader /> : ""} */}
        {loader ? <Loader handleAbort={handleAbort} /> : ""}

        {hideproject == "1" && isShow == true ? (
          <CellRendererPrimeReactDataTable
            data={projectInvoiceDetails}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            exportData={exportData}
            rows={rows}
            fileName="PPM Project Invoice Details"
          />
        ) : (
          ""
        )}
      </div>
      <div>
        {/* {loader ? <Loader /> : ""} */}
        {hideproject == "2" && opencus == true ? (
          <CellRendererPrimeReactDataTable
            data={customerInvoiceDetails}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            exportData={exportData}
            rows={rows}
            fileName="PPM Project Invoice Details"
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Projectinvoicedetails;
