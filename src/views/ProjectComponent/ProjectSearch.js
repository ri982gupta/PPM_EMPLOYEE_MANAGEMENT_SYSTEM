import React, { useEffect, useRef, useState } from "react";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import Loader from "../Loader/Loader";

import ProjectSearchTable from "./ProjectSearchTable";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { environment } from "../../environments/environment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { SlExclamation } from "react-icons/sl";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";


function ProjectSearch({ urlState, setVisible, visible, setCheveronIcon, maxHeight1, fileName  }) {
  const loggedUserId = localStorage.getItem("resId");

  const [loader, setLoader] = useState(false);
  const [searching, setSearching] = useState(false);
  const [business, setBusiness] = useState([]);
  // const [customer, setCustomer] = useState([]);
  const [manger, setManger] = useState([]);
  const [contract, setContract] = useState([]);
  const [SelectdContract, setSelectdContract] = useState([]);
  const [item, setItem] = useState([]);
  const [facilitator, setFacilitator] = useState([]);
  const [projectStage, setProjectStage] = useState([]);
  const [enguagementType, setEnguagementType] = useState([]);
  const [data, setData] = useState([{}]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [linkColumns, setLinkColumns] = useState([]);
  const [flag, setFlag] = useState(false);
  const [linkColumnsRoutes, setLinkColumnsRoutes] = useState([]);
  const baseUrl = environment.baseUrl;
  const abortController = useRef(null);
  const HelpPDFName = "SearchProject.pdf";
  const Headername = "Project Search Help";
  const [custVisible, setCustVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([{}]);
  const customer = selectedItems?.map((d) => d?.id).toString();
  const selectedCust = JSON.parse(localStorage.getItem("selectedCust"))
    ?.map((d) => d.id)
    ?.toString();
  console.log(selectedBusiness.map((item) => item.value).toString());

  const handleCust = (e) => {
    const { id, name, value } = e.target;
    if (value === "select") {
      setCustVisible(true);
    }
    setFormData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const initialValue = {
    projectName: "",
    manager: "",
    primaryBu: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    customer: -1,
    projectSource: "null",
    projectStage: 1,
    po: null,
    teamLocation: null,
    engagementType: null,
    contractTeams: "28,27,752,606,26,25,750",
    FTE: 0,
    currentAllocation: 1,
    PCQAFacilitaor: null,
    teamsize: 0,
  };
  const [formData, setFormData] = useState(initialValue);
  const autoValues = {
    projectId: null,
    resId: -1,
    isAll: 1,
  };
  const [value, setValue] = useState(autoValues);
  const handleClick = () => {
    setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    abortController.current = new AbortController();

    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/getProjectSearch`,
      signal: abortController.current.signal,

      data: {
        projectName: formData.projectName === "" ? "" : formData.projectName,
        manager: formData.manager,
        // primaryBu: formData.primaryBu,
        primaryBu:
          formData.primaryBu ===
            "170,211,123,82,168,207,212,18,213,49,149,208,243,999"
            ? "-1"
            : formData.primaryBu,
        customer:
          formData.customer == "select" ? selectedCust : formData.customer,
        projectSource: formData.projectSource,
        projectStage: formData.projectStage,
        po: formData.po,
        teamLocation: formData.teamLocation,
        engagementType: formData.engagementType,
        contractTeams: formData.contractTeams,
        FTE: formData.FTE,
        currentAllocation: formData.currentAllocation,
        PCQAFacilitaor: formData.PCQAFacilitaor,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const data = response.data;

      data.sort((a, b) => {
        const nameA = a.project_code.toUpperCase();
        const nameB = b.project_code.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      if (formData.teamsize == 1 && formData.FTE == 0) {
        setFlag(false);

        let dataHeader = [
          {
            project_code: "Code",
            project_name: "Project Name",
            prj_manager: "Project Manager",
            sales_executive: "Sales Executive",
            // prj_stage: "Project Stage",
            business_unit: "Primary BU",
            // po_number: "PO#",
            customer: "Customer",
            planned_start_dt: "Pln St Dt",
            planned_end_dt: "Pln End Dt",
            actual_start_dt: "Act St Dt",
            actual_end_dt: "Act End Dt",
            // team_size: "Team Size",
          },
        ];
        setData(dataHeader.concat(data));
        clearTimeout(loaderTime);
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        // }, 100);
      } else if (formData.teamsize == 1 && formData.FTE == 1) {
        setFlag(true);
        let dataHeader1 = [
          {
            contractor_onsite: "Contractor",
            employee_offshore: "Employee",
          },
        ];
        let dataHeader = [
          {
            project_code: "Code",
            project_name: "Project Name",
            prj_manager: "Project Manager",
            sales_executive: "Sales Executive",
            // prj_stage: "Project Stage",
            business_unit: "Primary BU",
            // po_number: "PO#",
            customer: "Customer",
            planned_start_dt: "Pln St Dt",
            planned_end_dt: "Pln End Dt",
            actual_start_dt: "Act St Dt",
            actual_end_dt: "Act End Dt",
            contractor_onsite: "Onsite",
            contractor_offshore: "Offshore",
            employee_onsite: "Onsite",
            employee_offshore: "Offshore",
            // team_size: "Team Size",
          },
        ];
        setData(dataHeader.concat(data));
        clearTimeout(loaderTime);
      } else if (formData.teamsize == 0 && formData.FTE == 1) {
        setFlag(true);

        let dataHeader = [
          {
            project_code: "Code",
            project_name: "Project Name",
            prj_manager: "Project Manager",
            sales_executive: "Sales Executive",
            // prj_stage: "Project Stage",
            business_unit: "Primary BU",
            // po_number: "PO#",
            customer: "Customer",
            planned_start_dt: "Pln St Dt",
            planned_end_dt: "Pln End Dt",
            actual_start_dt: "Act St Dt",
            actual_end_dt: "Act End Dt",
            contractor_onsite: "Onsite",
            contractor_offshore: "Offshore",
            employee_onsite: "Onsite",
            employee_offshore: "Offshore",
          },
        ];
        setData(dataHeader.concat(data));
        clearTimeout(loaderTime);
      } else {
        let dataHeader = [
          {
            project_code: "Code",
            project_name: "Project Name",
            prj_manager: "Project Manager",
            sales_executive: "Sales Executive",
            // prj_stage: "Project Stage",
            business_unit: "Primary BU",
            // po_number: "PO#",
            customer: "Customer",
            planned_start_dt: "Pln St Dt",
            planned_end_dt: "Pln End Dt",
            actual_start_dt: "Act St Dt",
            actual_end_dt: "Act End Dt",
          },
        ];
        setData(dataHeader.concat(data));
        clearTimeout(loaderTime);
      }
      let data1 = ["project_name"];
      let linkRoutes = ["/project/Overview/:project_id"];
      setLinkColumns(data1);
      setLoader(false);
      setLinkColumnsRoutes(linkRoutes);
      setSearching(true);
    });
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
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

        setSelectedBusiness(defaultSelected);
      })
      .catch((error) => console.log(error));
  };
  const getcontractTerms = () => {
    axios
      .get(baseUrl + `/ProjectMS/ProjectScopeChange/getContractTerms`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.lkup_name,
              value: e.id,
            };
            countries.push(countryObj);
          });
        setContract(countries);

        let defaultSelected = JSON.parse(JSON.stringify(countries)).filter(
          (d) => d.label.includes("Non-billable") == false
        );

        setSelectdContract(defaultSelected);
      })
      .catch((error) => console.log(error));
  };
  const customerFnc = (ids) => {
    // const string = ids.join(", ");
    let string = "";

    if (Array.isArray(ids)) {
      string = ids.join(", ");
    }

    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getAllCustomers?buid=${formData.primaryBu}`,
    }).then((res) => {
      let custom = res.data;
      // setCustomer(custom);
    });
  };

  const fcqaFacilitatorFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    })
      .then((res) => {
        let manger = res.data;
        setFacilitator(manger);
      })
      .catch((error) => { });
  };
  const projectStageFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getProjectStage`,
    })
      .then((res) => {
        let data = res.data;
        setProjectStage(data);
      })
      .catch((error) => { });
  };
  const enguagementTypeFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getEnguagementType`,
    })
      .then((res) => {
        let data = res.data;
        setEnguagementType(data);
      })
      .catch((error) => { });
  };
  const managerFnc = () => {
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/project/getResListForAutoCmplt`,
      data: {
        projectId: null,
        resId: "",
        isAll: 1,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      var data = response.data;
      console.log(data);
      data.push({ id: "-1", ResName: "<<ALL>>" });
      data.push({ id: Number(loggedUserId) + 1, ResName: "<<My Projects>>" });
      setManger(data);
    });
  };
  useEffect(() => {
    getBusinessUnit();
    customerFnc();
    fcqaFacilitatorFnc();
    projectStageFnc();
    enguagementTypeFnc();
    managerFnc();
    getcontractTerms();
  }, []);
  useEffect(() => {
    customerFnc();
  }, [formData.primaryBu]);

  console.log(manger, "manger:::::::::::::");
  const [project, setProject] = useState([]);
  const [projectname, setProjectName] = useState("");
  const getName = () => {
    axios
      .get(baseUrl + `/ProjectMS/Audit/getProjectNameandId`)
      .then((response) => {
        var resp = response.data;
        resp.push({ id: "-1", name: "<<ALL>>" });
        setProject(resp);
      });
    // const { value, id } = e.target;
    // setFormData({ ...formData, projectName: value });
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

  const handleClear = () => {
    setFormData((prev) => ({ ...prev, manager: null }));
  };
  const handleClear2 = () => {
    setFormData((prev) => ({ ...prev, PCQAFacilitaor: null }));
  };
  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Project Search"];

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
    getName();
  }, []);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const getData1 = resp.data;
      const deliveryItem = getData1[7]; // Assuming "Delivery" item is at index 7

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
    <div className="Project-Search-screen-margin">
      <div className="col-md-12"></div>
      <div className="group customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectname">
                  Project Name
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div
                    className="autoComplete-container react  reactsearchautocomplete"
                    id="autocomplete reactautocomplete"
                  >
                    <ReactSearchAutocomplete
                      items={project}
                      type="Text"
                      // inputSearchString={projectname}
                      name="Project"
                      id="Project"
                      className="err cancel"
                      onClear={() => {
                        setFormData((prevProps) => ({
                          ...prevProps,
                          projectName: "",
                        }));
                      }}
                      placeholder="Type minimum 3 characters"
                      fuseOptions={{ keys: ["id", "name"] }}
                      resultStringKeyName="name"
                      onSelect={(e) => {
                        setFormData((prevProps) => ({
                          ...prevProps,
                          Project: e.id,
                          projectName: e.name,
                        }));
                      }}
                      showIcon={false}
                    />
                    <span> {item.name}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="manager">
                  Project Manager
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div className="autoComplete-container">
                    <ReactSearchAutocomplete
                      items={manger}
                      type="Text"
                      name="manager"
                      id="manager"
                      className="err"
                      fuseOptions={{ keys: ["id", "ResName"] }}
                      resultStringKeyName="ResName"
                      // placeholder="Type minimum 3 characters to get the list"
                      resource={manger}
                      managerFnc={managerFnc}
                      onSelect={(e) => {
                        setFormData((prevProps) => ({
                          ...prevProps,
                          manager: e.id,
                        }));
                      }}
                      showIcon={false}
                      onClear={handleClear}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="primaryBu">
                  Business Unit
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="primaryBu"
                    options={business}
                    hasSelectAll={true}
                    value={selectedBusiness}
                    ArrowRenderer={ArrowRenderer}
                    disabled={false}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<<Please Select>>",
                    }}
                    onChange={(e) => {
                      setSelectedBusiness(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["primaryBu"]: filteredCountry.toString(),
                      }));
                      {
                        filteredCountry == "" &&
                          setFormData((prevVal) => ({
                            ...prevVal,
                            ["customer"]: filteredCountry.toString(),
                          }));
                      }
                      customerFnc(filteredCountry);
                    }}
                    valueRenderer={generateDropdownLabel}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="Customer">
                  Customer{" "}
                  <span className="required">
                    &nbsp;<span className="required error-text">*</span>
                  </span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    id="customer"
                    name="customer"
                    onChange={handleCust}
                    // defaultValue={-1}
                    value={formData.customer}
                  >
                    {selectedItems.length + "selected"}
                    <option value="-1">&lt;&lt; ALL &gt;&gt;</option>
                    <option value="0">Active Customers</option>
                    <option value="select">Select</option>
                    {formData.primaryBu == "" && (
                      <option value="">&lt;&lt; Please Select &gt;&gt;</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectsource">
                  Project Source
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="projectSource"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      setFormData({ ...formData, [id]: value });
                    }}
                  >
                    <option value="null">&lt;&lt;ALL&gt;&gt;</option>
                    <option value="PPM">PPM</option>
                    <option value="Projector">Projector</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5 " htmlFor="engagementtype">
                  Engagement Type
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="engagementType"
                    // onChange={(e) => {
                    //   const { value, id } = e.target;
                    //   setFormData({ ...formData, [id]: value });
                    // }}
                    onChange={(e) => {
                      const { value, id } = e.target;
                      const selectedValue = value === "All" ? null : value;
                      setFormData({ ...formData, [id]: selectedValue });
                    }}
                  >
                    <option value="All"> &lt;&lt;ALL&gt;&gt;</option>
                    {enguagementType.map((Item) => (
                      <option value={Item.id}> {Item.lkup_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="contractterms">
                  Contract Terms
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="contractTeams"
                    options={contract}
                    hasSelectAll={true}
                    ArrowRenderer={ArrowRenderer}
                    value={SelectdContract}
                    disabled={false}
                    overrideStrings={{
                      selectAllFiltered: "Select All",
                      selectSomeItems: "<<Please Select>>",
                    }}
                    onChange={(e) => {
                      setSelectdContract(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["contractTeams"]: filteredCountry.toString(),
                      }));
                    }}
                    valueRenderer={generateDropdownLabel}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5 " htmlFor="currentallocation">
                  Current Allocation
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    id="currentAllocation"
                    onChange={(e) => {
                      const { value, id } = e.target;
                      const selectedValue = value === "null" ? -1 : value;
                      setFormData({ ...formData, [id]: selectedValue });
                    }}
                  >
                    <option value="null">&lt;&lt;ALL&gt;&gt;</option>
                    <option value="1" selected="selected">
                      Active
                    </option>
                    <option value="2">InActive</option>
                    <option value="3">No Allocation</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="facilitator">
                  PCQA Facilitator
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <div className="autoComplete-container">
                    <ReactSearchAutocomplete
                      items={facilitator}
                      type="Text"
                      name="PCQAFacilitaor"
                      id="PCQAFacilitaor"
                      className="err"
                      fuseOptions={{ keys: ["id", "name"] }}
                      resultStringKeyName="name"
                      // placeholder="Type minimum 3 characters to get the list"
                      resource={facilitator}
                      fcqaFacilitatorFnc={fcqaFacilitatorFnc}
                      onSelect={(e) => {
                        setFormData((prevProps) => ({
                          ...prevProps,
                          PCQAFacilitaor: e.id,
                        }));
                      }}
                      showIcon={false}
                      onClear={handleClear2}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
        {loader ? <Loader handleAbort={handleAbort} /> : ""}
      </div>
      <div className="col-md-12">
        <div
          className="statusMsg
                    warning"
          style={{ fontStyle: "italic", color: "#746d26", fontSize: "12px" }}
        >
          <SlExclamation />
          Note: Values for projector projects are for Jan-17 to +6 months from
          current month.
        </div>
      </div>
      {searching ? (
        <ProjectSearchTable
          maxHeight1 = {maxHeight1}
          fileName = {fileName}
          formData={formData}
          data={data}
          linkColumns={linkColumns}
          linkColumnsRoutes={linkColumnsRoutes}
          flag={flag}
        />
      ) : (
        " "
      )}
      <SelectCustDialogBox
        visible={custVisible}
        setVisible={setCustVisible}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
      // flag={flag}
      // dataAccess={dataAccess}
      />
    </div>
  );
}

export default ProjectSearch;
