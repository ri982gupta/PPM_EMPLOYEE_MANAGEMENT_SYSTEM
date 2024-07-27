import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import { environment } from "../../environments/environment";
import ProjectInvoiceDetailsTable from "./ProjectInvoiceDetailsTable";
import FlatPrimeReactTable from "../PrimeReactTableComponent/FlatPrimeReactTable";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import { Link } from "react-router-dom";
import { Column } from "primereact/column";
function ProjectInvoiceDetailsFilters(props) {
  // const { setData } = props;

  const dates = [1, 2, 3];
  const baseUrl = environment.baseUrl;
  const [invoiceStatusData, setInvoiceStatusData] = useState([]);
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projectInvoiceDetails, setProjectInvoiceDetails] = useState([{}]);
  const [isShow, setIsShow] = useState("Projects");
  const [month, setMonth] = useState(new Date());
  console.log(month)
  const [hideproject, setHideproject] = useState(true)
  const initialValue = {
    viewType: 1,
    from: "2023-03-01",
    duration: 1,
    invStage: -1,
    customers: -1,
    projects: -1,
    reportId: 29,
  };
  const [formData, setFormData] = useState(initialValue);
  console.log(formData)
  console.log(formData.duration)
  const [customerInvoiceDetails, setCustomerInvoiceDetails] = useState([])
  //-------getting invoice status
  const getInvoiceStatusData = () => {
    axios.get(baseUrl + `/CostMS/projectInvoice/projectInvoiceStatus`,
    ).then((resp) => {
      let InvoiceSales = [];
      let data = resp.data
      console.log(data)
      data.length > 0 &&
        data.forEach((e) => {
          let salesObj = {
            label: e.label,
            value: e.value,
          };
          console.log(salesObj)
          InvoiceSales.push(salesObj);
          console.log(InvoiceSales, "-----InvoiceSales")
        })
      setInvoiceStatusData(InvoiceSales);
      setSelectedInvoiceStatus(InvoiceSales)
    });
  };
  console.log(invoiceStatusData)
  const getCustomersData = () => {
    axios({
      url: baseUrl + `/CostMS/projectInvoice/customers`,
    }).then((resp) => {
      setCustomers(resp.data);
    });
  };
  console.log(customers)
  console.log(selectedCustomers);
  const getCustomersByProjectsData = () => {
    console.log(selectedCustomers);
    axios({
      url:
        baseUrl +
        `/CostMS/projectInvoice/projectsByCustomers?customerId=${selectedCustomers[0]?.value}`,
    }).then((resp) => {
      let Storeproject = [];
      let data = resp.data
      console.log(data)
      data.length > 0 &&
        data.forEach((e) => {
          let salesObj = {
            label: e.label,
            value: e.value,
          };
          console.log(salesObj)
          Storeproject.push(salesObj);
          console.log(Storeproject, "-----Storeproject")
        })
      setProjectData(Storeproject);
      console.log(projectData);
      setSelectedProjects(Storeproject)
      console.log(selectedProjects);
    });
  };
  console.log(projectData)
  //--------for getting project table
  const getProjectInvoiceDetails = () => {
    axios({
      method: "POST",
      url: baseUrl + `/CostMS/projectInvoice/getProjectInvoiceDetails`,
      data: formData,
      headers: { "Content-Type": "application/json" },
    }).then(res => {
      const data = res.data;
      console.log(data)
      const Headerdata = [{
        invMonth: "Inv.Date", invoiceName: "Inv.Name", project: "Project", customer: "Customer ", salesExec: "Sakes Exec",
        total: "Total($)", discount: "Discount($)", netInv: "Net Inv($)", invStatus: "Status", plannedRev: "PL.Rev($)",
        resDirectCost: "Res.Cost($)", recRevenue: "Rec.Rev($)", grossMargin: "Gross Margin", grossMarginPerc: "Gross Margin(%)",
      }]
      let data1 = [""];
      let linkRoutes = [""];
      setLinkColumns(data1);
      setLinkColumnsRoutes(linkRoutes);
      setProjectInvoiceDetails(Headerdata.concat(data));
      console.log(projectInvoiceDetails)
    })
      .catch(error => {
        console.log("Error :" + error);
      })
  };
  const [headerData, setHeaderData] = useState([]);
  useEffect(() => {
    projectInvoiceDetails[0] && setHeaderData(JSON.parse(JSON.stringify(projectInvoiceDetails[0])));
  }, [projectInvoiceDetails]);
  useEffect(() => {
    customerInvoiceDetails[0] && setHeaderData(JSON.parse(JSON.stringify(customerInvoiceDetails[0])));
  }, [customerInvoiceDetails]);
  const LinkTemplate = (data) => {
    let rou = linkColumnsRoutes[0]?.split(":");
    return (
      <>
        <Link target="_blank" to={rou[0] + ":" + data[rou[1]]} data-toggle="tooltip">
          {data[linkColumns[0]]}
        </Link>
      </>
    );
  };
  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    return (
      <Column
        sortable
        key={col}
        body={
          col == "" ? LinkTemplate : ""}
        field={col}
        header={headerData[col]}
      />
    );
  });
  //---------for getting customer table
  const getCustomerInvoiceDetails = () => {
    axios({
      method: "POST",
      url: baseUrl + `/CostMS/projectInvoice/getProjectInvoiceDetails`,
      data: formData,
      headers: { "Content-Type": "application/json" },
    }).then(res => {
      const data = res.data;
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        data[i]["recRevenue"] = data[i]["recRevenue"] == null ? 0 : data[i]["recRevenue"];
        data[i]["grossMarginPerc"] = data[i]["grossMarginPerc"] == null ? 0 : data[i]["grossMarginPerc"];
      }
      const Headerdata = [{
        invMonth: "Inv.Mon", customer: "Customer ", salesExec: "Sales Exec", total: "Total($)", discount: "Discount($)",
        netInv: "Net Inv($)", plannedRev: "PL.Rev($)", resDirectCost: "Res.Cost($)", recRevenue: "Res.Rev($)",
        grossMargin: "Gross Margin", grossMarginPerc: "Gross Margin(%)",
      }]
      setCustomerInvoiceDetails(Headerdata.concat(data));
      console.log(customerInvoiceDetails)
    })
      .catch(error => {
        console.log("Error :" + error);
      })
  };
  console.log(headerData)
  console.log(customerInvoiceDetails)
  useEffect(() => {
    getCustomersByProjectsData();
  }, [selectedCustomers]);

  const searchClickHandler = () => {
    console.log(formData);

    if (hideproject == "1") {
      console.log("useEffect------------------3")
      console.log(hideproject)
      getProjectInvoiceDetails();
      setIsShow(true);
    }
    else {
      console.log("useEffect------------------4")
      console.log(hideproject)
      getCustomerInvoiceDetails();
      setIsShow(true);
    }
  };
  console.log(formData)
  const onFilterChange = ({ id, value }) => {

    // console.log(id + " " + value)
    setFormData((prevState) => {
      return { ...prevState, [id]: value }
    })
    setHideproject(value)

  }
  useEffect(() => {
    getProjectInvoiceDetails();
    getCustomerInvoiceDetails();
  }, [hideproject])

  console.log(hideproject)
  useEffect(() => {
    getInvoiceStatusData();
    getCustomersData();
  }, []);
  const [linkColumns, setLinkColumns] = useState([]);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  let rows = 10;
  const [exportData, setExportData] = useState([]);
  useEffect(() => {
    let imp = ["XLS"]
    setExportData(imp);
    let ctmFlts = {
      "id": "filterTable",
      "type": "select",
      "data": {
        "0": "All",
        "1": "Active"
      },
      "align": "right",
      "filterTable": ""
    }

  }, [])

  return (
    <div>
      <div className="group  customCard">
        <h2>Search Filters</h2>
        <div className="group-content row">
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="viewType">
                View By *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <select id="viewType" name="viewType" onChange={(e) => { onFilterChange(e.target) }} >
                  <option value="1">Projects</option>
                  <option value="2">Customers</option>
                </select>
              </div>
            </div>
          </div>
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="startMonth">
                Start Month *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <DatePicker
                  name="from"
                  id="from"
                  selected={month}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      ["from"]: moment(e).format("yyyy-MM-DD"),
                    }));
                    setMonth(e);
                  }}
                  dateFormat="MMM-yyyy"
                  showMonthYearPicker
                  maxDate={new Date()}
                  show
                />
              </div>
            </div>
          </div>
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="duration">
                Duration
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <select className="text" id="duration" onChange={(e) => {
                  const { value, id } = e.target
                  setFormData({ ...formData, [id]: value })
                }}
                >
                  {dates.map((d, index) => (
                    <option key={index} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" value="null" htmlFor="invoiceStatus">
                Invoice Status *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <MultiSelect
                  id="invStage"
                  options={invoiceStatusData}
                  hasSelectAll={true}
                  selected={selectedInvoiceStatus}
                  disableSearch={false}
                  value={selectedInvoiceStatus}
                  disabled={false}
                  overrideStrings={{
                    selectAllFiltered: "Select All",
                    selectSomeItems: "<< Please select>>",
                  }}
                  onChange={(e) => {
                    setSelectedInvoiceStatus(e);
                    console.log(e)
                    let filteredinvStage = [];
                    e.forEach((d) => {
                      filteredinvStage.push(d.value);
                      console.log(d.value)
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
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="customer">
                Customer *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <MultiSelect
                  id="customers"
                  options={customers}
                  hasSelectAll={true}
                  value={selectedCustomers}
                  disableSearch={false}
                  selected={selectedCustomers}
                  disabled={false}
                  onChange={(e) => {
                    setSelectedCustomers(e);
                    console.log(e)
                    let filteredCustomer = [];
                    e.forEach((d) => {
                      filteredCustomer.push(d.value);
                      console.log(d.value)
                    });
                    setFormData((prevVal) => ({
                      ...prevVal,
                      ["customers"]: filteredCustomer.toString(),
                    }));
                  }}
                />
              </div>
            </div>
          </div>
          {hideproject == "1" ?
            <div className=" col-md-4">
              <div className="form-group row mb-2">
                <label className="col-5" htmlFor="project">
                  Project *
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="projects"
                    options={projectData}
                    hasSelectAll={true}
                    selected={selectedProjects}
                    shouldToggleOnHover={false}
                    disableSearch={false}
                    value={selectedProjects}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedProjects(e);
                      console.log(e)
                      let filteredCustomer = [];
                      e.forEach((d) => {
                        filteredCustomer.push(d.value);
                        console.log(d.value)
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["projects"]: filteredCustomer.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div> : ""}
        </div>
        <div className="col-12" align="center">
          <button className="btn btn-primary" onClick={searchClickHandler}>
            Search
          </button>
        </div>
        <div className="col-12">
        </div>
      </div>
      {isShow == true ?
        <>
          {hideproject == "1" ?
            <CellRendererPrimeReactDataTable
              data={projectInvoiceDetails}
              linkColumns={linkColumns}
              linkColumnsRoutes={linkColumnsRoutes}
              dynamicColumns={dynamicColumns}
              headerData={headerData}
              setHeaderData={setHeaderData}
              exportData={exportData}
              rows={rows}
            />
            :
            <CellRendererPrimeReactDataTable
            data={customerInvoiceDetails}
            linkColumns={linkColumns}
            linkColumnsRoutes={linkColumnsRoutes}
            dynamicColumns={dynamicColumns}
            headerData={headerData}
            setHeaderData={setHeaderData}
            exportData={exportData}
            rows={rows}
          />
          }

        </>
        : ""}
    </div>
  );
}

export default ProjectInvoiceDetailsFilters;
