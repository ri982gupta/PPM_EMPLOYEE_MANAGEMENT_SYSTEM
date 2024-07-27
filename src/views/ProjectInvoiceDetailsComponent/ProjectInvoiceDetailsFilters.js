import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { MultiSelect } from "react-multi-select-component";
import { environment } from "../../environments/environment";
import ProjectInvoiceDetailsTable from "./ProjectInvoiceDetailsTable";

function ProjectInvoiceDetailsFilters(props) {
  const { setData } = props;

  const dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const baseUrl = environment.baseUrl;

  const [invoiceStatusData, setInvoiceStatusData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projectInvoiceDetails, setProjectInvoiceDetails] = useState([]);

  const initialValue = {
    viewType: 1,
    from: "2022-04-01",
    duration: 1,
    invStage: -1,
    customers: -1,
    projects: -1,
    reportId: 29,
  };
  const [formData, setFormData] = useState(initialValue);

  useEffect(() => {
    getInvoiceStatusData();
    getCustomersData();
    getProjectInvoiceDetails();
  }, []);

  useEffect(() => {
    setData(projectInvoiceDetails);
  }, [projectInvoiceDetails]);

  const getInvoiceStatusData = () => {
    axios({
      url: baseUrl + `/CostMS/projectInvoice/projectInvoiceStatus`,
    }).then((resp) => {
      setInvoiceStatusData(resp.data);
    });
  };

  const getCustomersData = () => {
    axios({
      url: baseUrl + `/CostMS/projectInvoice/customers`,
    }).then((resp) => {
      setCustomers(resp.data);
    });
  };

  const getCustomersByProjectsData = () => {
    console.log(selectedCustomers);
    axios({
      url:
        baseUrl +
        `/CostMS/projectInvoice/projectsByCustomers?customerId=${selectedCustomers[0]?.value}`,
    }).then((resp) => {
      setProjectData(resp.data);
    });
  };

  const getProjectInvoiceDetails = () => {
    axios({
      method: "POST",
      url: baseUrl + `/CostMS/projectInvoice/getProjectInvoiceDetails`,
      data: formData,
    }).then((resp) => {
      setProjectInvoiceDetails(resp.data);
    });
  };

  useEffect(() => {
    getCustomersByProjectsData();
  }, [selectedCustomers]);

  const searchClickHandler = () => {
    console.log(formData);
    getProjectInvoiceDetails();
  };

  return (
    <div>
      <div className="group  customCard">
        <h2>Search Filters</h2>
        <div className="group-content row">
          <div className=" col-md-4">
            <div className="form-group row mb-2">
              <label className="col-5" htmlFor="viewBy">
                View By *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <select id="viewType">
                  <option value={1}>{"Projects"}</option>
                  <option value={2}>{"Customers"}</option>
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
                  id="from"
                  selected={new Date()}
                  onChange={(e) => {
                    console.log(e);
                    //   handleChangeDate(e);
                  }}
                  maxDate={new Date()}
                  dateFormat="MMM-yyyy"
                  showMonthYearPicker
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
                <select
                  id="duration"
                  onChange={(e) => {
                    console.log(e.target.value);
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
              <label className="col-5" htmlFor="invoiceStatus">
                Invoice Status *
              </label>
              <span className="col-1">:</span>
              <div className="col-6">
                <MultiSelect
                  id="invStage"
                  options={invoiceStatusData}
                  hasSelectAll={true}
                  isLoading={false}
                  shouldToggleOnHover={false}
                  disableSearch={false}
                  value={[]}
                  disabled={false}
                  onChange={(s) => {
                    // setSelectedDepartments(s);
                    // let filteredDeptData = [];
                    // s?.forEach((element) => {
                    //     filteredDeptData.push(element.value);
                    // });
                    // filtersData.businessUnit = filteredDeptData.toString();
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
                  isLoading={false}
                  shouldToggleOnHover={false}
                  disableSearch={false}
                  value={selectedCustomers}
                  disabled={false}
                  onChange={(s) => {
                    setSelectedCustomers(s);
                    // setSelectedDepartments(s);
                    // let filteredDeptData = [];
                    // s?.forEach((element) => {
                    //     filteredDeptData.push(element.value);
                    // });
                    // filtersData.businessUnit = filteredDeptData.toString();
                  }}
                />
              </div>
            </div>
          </div>
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
                  isLoading={false}
                  shouldToggleOnHover={false}
                  disableSearch={false}
                  value={[]}
                  disabled={false}
                  onChange={(s) => {
                    setSelectedProjects(s);
                    // let filteredDeptData = [];
                    // s?.forEach((element) => {
                    //     filteredDeptData.push(element.value);
                    // });
                    // filtersData.businessUnit = filteredDeptData.toString();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12" align="center">
          <button className="btn btn-primary" onClick={searchClickHandler}>
            Search
          </button>
        </div>
        <div className="col-12">
          {/* <ProjectInvoiceDetailsTable
            projectInvoiceDetails={projectInvoiceDetails}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default ProjectInvoiceDetailsFilters;
