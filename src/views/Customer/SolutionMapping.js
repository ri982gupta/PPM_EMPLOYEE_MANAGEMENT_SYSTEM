import React, { useRef, useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSave,
  FaSearch,
} from "react-icons/fa";
import { environment } from "../../environments/environment";
import { CCollapse } from "@coreui/react";
import axios from "axios";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import SelectCustDialogBox from "../Customer/SelectCustDialogBox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BiCheck, BiLinkExternal } from "react-icons/bi";
import Loader from "../Loader/Loader";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { AiFillWarning } from "react-icons/ai";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { InputText } from "primereact/inputtext";
import { useSelector } from "react-redux";

function SolutionMapping() {
  const baseUrl = environment.baseUrl;
  const [dataAr, setDataAr] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [selectedDeptid, setSelectedDeptId] = useState([]);
  const [deptId, setdeptId] = useState([]);
  const [searchDataB, setSearchDataB] = useState(
    "170,211,123,82,168,207,212,18,213,49,149,208,243"
  );
  const [selectSalesExe, setSelectSalesExe] = useState([]);
  const [salesExe, setSalesExe] = useState([]);
  const [searchDataEx, setSearchDataEx] = useState("-1");
  const [activeCustomers, setActiveCustomers] = useState([]);
  const [tableVal, setTableVal] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);
  const [searching, setSearching] = useState(false);
  const [custVisible, setCustVisible] = useState(false);
  const [solution, setSolution] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [soulData, setSoulData] = useState();
  const initialValue = {};
  const initialValue3 = {};
  const [checkData, setCheckData] = useState(initialValue);
  const initialValue1 = {
    projectId: "",
    solutionId: "",
    gitLabURL: "",
    isArchived: 0,
    created_by_id: loggedUserId,
    date_created: "",
    last_updated: "",
    last_updated_by_id: null,
  };
  const [loader, setLoader] = useState(false);
  const abortController = useRef(null);
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };
  const [validationmessage, setValidationMessage] = useState(false);
  const [modificationmsg, setModificationsMsg] = useState(false);
  const ref = useRef([]);
  const [successfulmessage, setSuccessfulmessage] = useState(false);
  const [backUpData, setBackUpData] = useState({});
  const [customerId, setCustomerId] = useState("-1");
  const [proStatusId, setProStatusId] = useState("-1");
  const [headerData, setHeaderData] = useState([]);
  const [dropdownValues, setDropdownValues] = useState({});
  const [previousOption, setPreviousOption] = useState("");
  const [dropdowndata, setDropdownData] = useState(initialValue3);
  const initialValue2 = {};
  const initialValue4 = {};
  const [pcqracomments, setPcqaComments] = useState(initialValue2);
  const [isArchived, setIsArchived] = useState(initialValue4);
  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [filters1, setFilters1] = useState({
    global: filtersData["contains"],
  });
  useEffect(() => {
    setFilters1({
      global: filtersData["contains"],
    });
  }, [headerData]);
  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };
  useEffect(() => {
    tableVal[0] && setHeaderData(JSON.parse(JSON.stringify(tableVal[0])));
  }, [tableVal]);

  const [routes, setRoutes] = useState([]);
  let textContent = "Innovation";
  let currentScreenName = ["Solution Mapping"];
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
      const urlPathValue = resp.data[5].subMenus[1].url_path;
      const modifiedUrlPath = urlPathValue.replace(/::/g, "/");
      getUrlPath(modifiedUrlPath);

      let data = resp.data.map((menu) => {
        if (menu.subMenus) {
          menu.subMenus = menu.subMenus.filter(
            (subMenu) =>
              subMenu.display_name !== "Project Timesheet (Deprecated)" &&
              subMenu.display_name !== "Invoice Details" &&
              subMenu.display_name !== "Accounting" &&
              subMenu.display_name !== "Upload" &&
              subMenu.display_name !== "Practice Calls [Deprecated]"
          );
        }
        return menu;
      });

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
      .then((res) => {})
      .catch((error) => {});
  };
  const renderHeader1 = () => {
    return (
      <div className="flex  flex-row-reverse">
        <span className="p-input-icon-left tableGsearch">
          <i className="pi pi-search" />
          <InputText
            defaultValue={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };
  const header1 = renderHeader1();
  const bussinessUnitDepartment = () => {
    axios.get(baseUrl + `/CostMS/cost/getDepartments`).then((res) => {
      const data = res.data;
      let custom = [];
      data.push({ value: 999, label: "Non-Revenue Units" });
      data.length > 0 &&
        data.forEach((e) => {
          let dpObj = {
            label: e.label,
            value: e.value,
          };
          custom.push(dpObj);
        });
      setdeptId(custom);
      setSelectedDeptId(custom.filter((option) => option.value !== 999));
    });
  };
  //=============For Active Customers==================================
  useEffect(() => {
    getActiveCustomers();
  }, [searchDataB]);
  const getActiveCustomers = () => {
    axios
      .get(
        baseUrl +
          `/revenuemetricsms/projections/geActiveCustomerList?BuIds=${searchDataB}`
      )
      .then((res) => {
        let customersObj = [];

        let customers = res.data;
        customers.length > 0 &&
          customers.forEach((e) => {
            let custObj = {
              label: e.fullName,
              value: e.id,
            };
            customersObj.push(custObj);
          });
        let activeCustomerValues = customersObj.map((customer) =>
          customer.value.toString()
        );
        setActiveCustomers(activeCustomerValues);
      });
  };
  //=========================================

  const getExe = () => {
    axios.get(baseUrl + `/timeandexpensesms/getExecutiveName`).then((res) => {
      const exData = res.data;
      let getExe = [];
      exData.length > 0 &&
        exData.forEach((e) => {
          let exObj = {
            label: e.Executive_name,
            value: e.id,
          };
          getExe.push(exObj);
        });
      getExe.sort((a, b) => a.label.localeCompare(b.label));
      setSalesExe(getExe);
      setSelectSalesExe(getExe);
    });
  };
  const SelectSEData = useSelector(
    (state) => state.selectedSEState.directSETreeData
  );
  let alldp1;
  const dpArray = searchDataEx.split(",");
  alldp1 = dpArray?.length === salesExe?.length ? "-1" : searchDataEx;

  const custid = String(
    JSON.parse(localStorage.getItem("selectedCust"))?.map((item) => {
      return item.id;
    })
  );

  const getSolutionTable = () => {
    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidationMessage(true);
        setModificationsMsg(false);
      }
      return;
    }
    setValidationMessage(false);
    setSearching(false);

    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    const customerIds =
      customerId === "1"
        ? custid
        : customerId === "0"
        ? activeCustomers.toString()
        : customerId;
    axios({
      method: "get",
      url:
        baseUrl +
        `/timeandexpensesms/getProjectSolutions?prjStatus=${proStatusId}&buIds=${searchDataB}&executiveIds=${alldp1}&customerIds=${customerIds}`,
    }).then((res) => {
      const getData = res.data;
      for (let i = 0; i < getData.length; i++) {
        getData[i]["Sno"] = i + 1;
      }
      let resultsTab = [...getData];
      setTableVal(resultsTab);
      setDuplicateData(resultsTab);
      setRecords(resultsTab);
      setTimeout(() => {
        clearTimeout(loaderTime);
        setLoader(false);
        setSearching(true);

        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      }, 1000);
    });
  };
  //============================

  const getSolutionTable1 = () => {
    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setValidationMessage(true);
        setModificationsMsg(false);
      }
      return;
    }
    setValidationMessage(false);

    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);

    const customerIds =
      customerId === "1"
        ? custid
        : customerId === "0"
        ? activeCustomers.toString()
        : customerId;
    axios({
      method: "get",
      url:
        baseUrl +
        `/timeandexpensesms/getProjectSolutions?prjStatus=${proStatusId}&buIds=${searchDataB}&executiveIds=${alldp1}&customerIds=${customerIds}`,
    }).then((res) => {
      const getData = res.data;
      for (let i = 0; i < getData.length; i++) {
        getData[i]["Sno"] = i + 1;
      }
      let resultsTab = [...getData];
      setTableVal(resultsTab);
      setDuplicateData(resultsTab);
      setRecords(resultsTab);
      setTimeout(() => {
        clearTimeout(loaderTime);
        setLoader(false);
        setSearching(true);
      }, 1000);
    });
  };

  //==========================
  const getSolution = () => {
    axios.get(baseUrl + `/timeandexpensesms/getSolutionList`).then((res) => {
      const getSol = res.data;
      setSolution(getSol);
    });
  };

  const handleChange = ({ id, value }) => {
    if (id === "customers" && value === "1") {
      setCustVisible(true);
    }
  };

  const representPro = (rowData) => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2" title={rowData.project}>
          {rowData.project}
        </span>
      </React.Fragment>
    );
  };

  const representManeger = (rowData) => {
    const cleanedPrjMgr = rowData?.prjMgr?.replace(/\^\^/g, "");

    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2" title={cleanedPrjMgr}>
          {cleanedPrjMgr}
        </span>
      </React.Fragment>
    );
  };

  const representExecutive = (rowData) => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2" title={rowData.executive}>
          {rowData.executive}
        </span>
      </React.Fragment>
    );
  };

  const representCustomer = (rowData) => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2" title={rowData.customer}>
          {rowData.customer}
        </span>
      </React.Fragment>
    );
  };

  const representSoluton = (rowData) => {
    return (
      <React.Fragment>
        <span className="vertical-align-middle ml-2">
          <select
            name="solutionId"
            id={rowData.projectId}
            title={rowData.solution}
            onFocus={(e) => {
              setPreviousOption(e.target.value, rowData.compliance_val);
            }}
            onChange={(e) => {
              const solutionId =
                e?.target?.value == "null" ? null : e?.target?.value;
              const projectid = rowData.projectId;
              // Update the tableVal array
              const updatedTableVal = tableVal.map((item) => {
                if (item.projectId === projectid) {
                  // If the project IDs match, update the solutionId
                  return {
                    ...item,
                    solutionId: +solutionId == 0 ? null : +solutionId,
                  };
                }
                return item;
              });
              // Update the state with the new array
              setTableVal(updatedTableVal);
              updateCheckData(solutionId, projectid);
              setDropdownData((prev) => ({
                ...prev,
                [rowData.projectId]: e?.target?.value,
              }));
              const newValue = e.target.value;
              setPreviousOption(newValue);
              const newData = {
                ...dropdownValues,
                [rowData.projectId]: newValue,
              };
              setDropdownValues(newData);
              setSoulData(e.target.value);
            }}
            value={rowData.solutionId} // Set the value from state
          >
            <option value="null">&lt;&lt; Please Select &gt;&gt;</option>
            {solution.map((e) => {
              return (
                <option value={e.id} selected={rowData.solutionId == e.id}>
                  {e.solution_name}
                </option>
              );
            })}
          </select>
        </span>
      </React.Fragment>
    );
  };

  const representGit = (rowData) => {
    const handleKeyDown = (e) => {
      const currentValue =
        pcqracomments[rowData.projectId] ?? rowData.gitLabURL;
      const words = currentValue.split(/\s+/);
      words.pop();
      const newValue = words.join(" ");
    };
    return (
      <div>
        <span className="vertical-align-middle ml-2">
          <input
            className="cancel"
            type="text"
            id="gitLabURL"
            name="gitLabURL"
            title={rowData.gitLabURL}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              const newGitLabURL = e.target.value;
              const projectid = rowData.projectId;
              handlechangeComments(e.target.value, rowData);
              const updatedTableVal = tableVal.map((item) => {
                if (item.projectId === projectid) {
                  // If the project IDs match, update the gitLabURL
                  return {
                    ...item,
                    gitLabURL: newGitLabURL,
                  };
                }
                return item;
              });

              // Update the state with the new array
              setTableVal(updatedTableVal);
            }}
            value={rowData?.gitLabURL}
          />

          {rowData.gitLabURL ? (
            <a
              href={`http://${rowData.gitLabURL}`}
              target="_blank"
              title="GitLab URL"
            >
              {" "}
              <BiLinkExternal title="GitLab URL" />
            </a>
          ) : (
            <BiLinkExternal
              title="GitLab URL"
              style={{ color: "#0090d2", cursor: "pointer" }}
            />
          )}
        </span>
      </div>
    );
  };

  const handlechangeComments = (value, rowData) => {
    // If the value is an empty string and the backspace key was pressed, clear the input
    setPcqaComments((prev) => ({
      ...prev,
      [rowData?.projectId]: value,
    }));
  };

  const handlechangeChecked = (isChecked, rowData) => {
    const data = isChecked ? 1 : 0;
    setIsArchived((prev) => ({
      ...prev,
      [rowData.projectId]: data,
    }));
  };

  const updateCheckData = (solutionId, projectid, gitUrlData, isChecked) => {
    const updatedComplianceTable = [...tableVal];

    setCheckData((prevData) => ({
      ...prevData,
      [projectid]: {
        ...prevData[projectid],
        solutionId: solutionId,
        gitUrlData: gitUrlData,
        projectid: projectid,
        isChecked: isChecked,
      },
    }));
  };

  const representArchive = (rowData) => {
    // const projectId = rowData?.projectId;
    // if (projectId && isArchived.hasOwnProperty(projectId)) {
    //   rowData.isArchived = isArchived[projectId];
    // }
    // const isProjectArchived =
    //   projectId && isArchived.hasOwnProperty(projectId)
    //     ? isArchived[projectId]
    //     : 0;
    return (
      <div>
        <span className="vertical-align-middle ml-2">
          <input
            type="checkbox"
            id={rowData.projectId}
            onChange={(e) => {
              const isChecked = e.target.checked;
              handlechangeChecked(isChecked, rowData);
              const updatedTableVal = tableVal.map((item) => {
                if (item.projectId === rowData.projectId) {
                  return {
                    ...item,
                    isArchived: isChecked ? 1 : 0,
                  };
                }
                return item;
              });
              setTableVal(updatedTableVal);
            }}
            checked={rowData?.isArchived === 1}
          />
        </span>
      </div>
    );
  };
  const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      const obj1 = arr1[i];
      const obj2 = arr2[i];
      const fieldsToCheck = ["solutionId", "isArchived", "gitLabURL"];
      for (const key of fieldsToCheck) {
        if (obj1[key] !== obj2[key]) {
          return false;
        }
      }
    }
    return true;
  };
  const saveData = () => {
    if (areArraysEqual(duplicateData, tableVal)) {
      setModificationsMsg(true);
      setValidationMessage(false);
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        setModificationsMsg(false);
      }, 3000);

      return; // Stop further execution
    }
    setModificationsMsg(false);
    const data = [];
    const processComment = (ele) => {
      const rowComment = tableVal.find((comment) => comment.projectId === +ele);
      const obj = {
        projectId: +ele,
        solutionId:
          dropdowndata[ele] === "null"
            ? null
            : dropdowndata[ele] == null || isNaN(+dropdowndata[ele])
            ? rowComment?.solutionId
            : +dropdowndata[ele],

        gitLabURL:
          pcqracomments[ele] === undefined || pcqracomments[ele] === "null"
            ? rowComment?.gitLabURL == null || rowComment?.gitLabURL == "null"
              ? ""
              : rowComment?.gitLabURL
            : pcqracomments[ele],
        isArchived: isNaN(+isArchived[ele])
          ? rowComment?.isArchived == false
            ? 0
            : 1
          : +isArchived[ele],
        created_by_id: +loggedUserId,
        last_updated_by_id: +loggedUserId,
      };

      data.push(obj);
    };
    Object.keys(pcqracomments).forEach((ele) => {
      processComment(ele);
    });
    Object.keys(dropdowndata).forEach((ele) => {
      if (!pcqracomments[ele]) {
        processComment(ele);
      }
    });
    Object.keys(isArchived).forEach((ele) => {
      processComment(ele);
    });

    axios({
      method: "post",
      url: baseUrl + `/timeandexpensesms/saveMapping`,
      data: data,
    }).then(function (res) {
      setSuccessfulmessage(true);
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth", // 'auto' or 'smooth'
      });
      getSolutionTable1();
      setTimeout(() => {
        setSuccessfulmessage(false);
      }, 3000);
      setPcqaComments(initialValue2);
      setIsArchived(initialValue4);
      setDropdownData(initialValue3);
    });
  };
  const handleReset = () => {
    setTableVal((prevTableVal) => {
      return prevTableVal.map((tableObj) => {
        const duplicateObj = duplicateData.find(
          (dupObj) => dupObj.projectId === tableObj.projectId
        );
        if (duplicateObj) {
          tableObj.solutionId = duplicateObj.solutionId;
          tableObj.isArchived = duplicateObj.isArchived;

          tableObj.gitLabURL = duplicateObj.gitLabURL;
        }

        return tableObj;
      });
    });
  };

  useEffect(() => {
    if (tableVal.length > 0) {
      setBackUpData(JSON.parse(JSON.stringify(tableVal[0])));
    }
  }, [tableVal]);
  useEffect(() => {
    getSolution();
    bussinessUnitDepartment();
    getExe();
    setDataAr("Table values..............................", tableVal);
  }, []);

  useEffect(() => {}, [checkData]);

  const [records, setRecords] = useState([]);
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

      <>
        {successfulmessage ? (
          <div className="statusMsg success">
            {" "}
            <span className="errMsg">
              <BiCheck size="1.4em" /> &nbsp; Mapping saved successfully
            </span>
          </div>
        ) : (
          ""
        )}
        {modificationmsg ? (
          <div className="statusMsg error">
            <span className="error-block">
              <AiFillWarning /> &nbsp; No modifications to save
            </span>
          </div>
        ) : (
          ""
        )}
      </>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Solution Mapping</h2>
          </div>
          <div className="childThree toggleBtns">
            <div>
              <p className="searchFilterHeading">Search Filters</p>
              <span
                onClick={() => {
                  setVisible(!visible);
                  visible
                    ? setCheveronIcon(FaChevronCircleUp)
                    : setCheveronIcon(FaChevronCircleDown);
                }}
              >
                {cheveronIcon}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="bu">
                  BU<span style={{ color: "red" }}>*</span>{" "}
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
                      name="buId"
                      options={deptId}
                      hasSelectAll={true}
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      // isLoading={false}
                      // shouldToggleOnHover={false}
                      // disableSearch={false}
                      value={selectedDeptid}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedDeptId(s);
                        let filterB = [];
                        s.forEach((d) => {
                          filterB.push(d.value);
                        });

                        setSearchDataB(filterB.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="customer">
                  Customer <span style={{ color: "red" }}>*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="customers"
                    name="customers"
                    className="col-md-12 col-sm-12 col-xs-12  onLoadEmpty"
                    onChange={(e) => {
                      handleChange(e.target);
                      setCustomerId(e.target.value);
                    }}
                  >
                    <option value={-1}>{"<< All >> "}</option>
                    <option value={0}>{"Active Customers"}</option>
                    <option value={1}>{"Select"}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="projectstatus">
                  Project Status
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="projectstatus"
                    name="projectstatus"
                    onChange={(e) => {
                      handleChange(e.target);
                      setProStatusId(e.target.value);
                    }}
                  >
                    <option value={-1}>{"<< All >> "}</option>
                    <option value={0}>{"New"}</option>
                    <option value={1}>{"In Progress"}</option>
                    <option value={2}>{"Completed"}</option>
                    <option value={3}>{"Withdrawn"}</option>
                    <option value={4}>{"On Hold"}</option>
                    <option value={5}>{"Opportunity"}</option>
                    <option value={6}>{"Pending Invoice"}</option>
                    <option value={1108}>{"Invalid"}</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="country-select">
                  Sales Executive <span style={{ color: "red" }}>*</span>
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
                      id="salesExecutiveId"
                      name="salesExecutiveId"
                      options={salesExe}
                      ArrowRenderer={ArrowRenderer}
                      valueRenderer={generateDropdownLabel}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      value={selectSalesExe}
                      disabled={false}
                      onChange={(e) => {
                        setSelectSalesExe(e);
                        let filterExe = [];
                        e.forEach((d) => {
                          filterExe.push(d.value);
                        });

                        setSearchDataEx(filterExe.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  getSolutionTable();
                  setModificationsMsg(false);
                }}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
          {loader ? <Loader handleAbort={handleAbort} /> : ""}
        </CCollapse>
      </div>
      <div>
        {searching ? (
          <div>
            <div className="col-md-12  darkHeader">
              <DataTable
                className="solutionMappingTable primeReactDataTable"
                value={tableVal}
                paginator
                header={header1}
                filters={filters1}
                rows={15}
                showGridlines
                rowsPerPageOptions={[15, 25, 50]}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                sortOrder={2}
                responsiveLayout="scroll"
                emptyMessage={<center>No Records found.</center>}
              >
                <Column field="Sno" header="S.No" align="center"></Column>
                <Column
                  field="project"
                  header="Project"
                  body={representPro}
                ></Column>
                <Column
                  field="prjMgr"
                  header="Project Manager"
                  body={representManeger}
                ></Column>
                <Column
                  field="executive"
                  header="Executive"
                  body={representExecutive}
                ></Column>
                <Column
                  field="customer"
                  header="Customer"
                  body={representCustomer}
                ></Column>
                <column
                  field="solutionId"
                  header="Solution"
                  body={representSoluton}
                ></column>
                <column
                  field="gitLabURL"
                  header="GitLab URL"
                  body={representGit}
                ></column>
                <Column
                  field="isArchived"
                  header="Archive"
                  body={representArchive}
                  align="center"
                ></Column>
              </DataTable>
            </div>
            <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={() => {
                  saveData();
                }}
              >
                <FaSave /> Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  handleReset();
                }}
              >
                <BsArrowCounterclockwise />
                Reset
              </button>
            </div>
          </div>
        ) : (
          " "
        )}
      </div>
      <SelectCustDialogBox visible={custVisible} setVisible={setCustVisible} />
    </div>
  );
}

export default SolutionMapping;
