import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaCaretDown,
  FaPlus,
  FaSave,
  FaSearch,
  FaCircle,
} from "react-icons/fa";
import {
  CCollapse,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { getTableData } from "./ResourceRequestTable";
import axios from "axios";
import { environment } from "../../environments/environment";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import DatePicker from "react-datepicker";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Draggable from "react-draggable";
import moment from "moment";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { IoWarningOutline } from "react-icons/io5";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import "./ResourceRequest.scss";
import { BiCheck } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

const StagePopUp = (props) => {
  const {
    popUp,
    setPopUp,
    setNonMatching,
    customerFnc,
    nonMatching,
    setCustomerProspectId,
  } = props;
  const loggedUserId = localStorage.getItem("resId");
  const [prospect, setProspect] = useState([]);
  const baseUrl = environment.baseUrl;
  const ref3 = useRef([]);
  const [validmsgprospect, setvalidMsgProspect] = useState(false);
  const [prospectValue, setProspectVavlue] = useState(nonMatching);
  //

  const CustomerAndProspectID = () => {
    axios({
      url: baseUrl + `/fullfilmentms/Resourcerequest/CustomerAndProspectID`,
    }).then((res) => {
      setCustomerProspectId(res.data);
    });
  };

  function myFunctions(event) {
    setProspectVavlue(event.target.value);
  }

  const createProspect = () => {
    let valid = GlobalValidation(ref3);
    if (valid) {
      {
        setvalidMsgProspect(true);
      }
      return;
    }

    axios({
      method: "post",
      url: baseUrl + `/fullfilmentms/Resourcerequest/createProspect`,
      data: {
        name: nonMatching,
        loggedUserId: loggedUserId,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const GetData = response.data.data;
      setProspect(GetData);
      CustomerAndProspectID();
      setPopUp(false);
      customerFnc();
    });
  };
  useEffect(() => {
    if (popUp) {
      ref3.current[0].focus();
    }
  }, [popUp]);

  return (
    <div>
      <CModal
        visible={popUp}
        key={popUp}
        size="sm"
        className="ui-dialog"
        onClose={() => setPopUp(false)}
        backdrop={"static"}
      >
        <CModalHeader className="">
          <CModalTitle>
            <span className="">Confirmation</span>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {validmsgprospect ? (
            <div className="statusMsg error">
              {" "}
              <span>
                {" "}
                <IoWarningOutline /> Please enter Prospect name{" "}
              </span>
            </div>
          ) : (
            ""
          )}
          <div className="group-content row">
            <div className="form-group row mb-2">
              <label className="col-5">
                Prospect Name<span className="error-text">*</span>
              </label>
              <span className="col-1 p-0">:</span>
              <span
                className="col-6 textfield"
                ref={(ele) => {
                  ref3.current[0] = ele;
                }}
              >
                <input
                  type="Text"
                  autoFocus
                  id="checkPoint"
                  value={nonMatching}
                  onChange={(e) => setNonMatching(e.target.value)}
                  onFocus={(e) => setNonMatching(e.target.value)}
                />
              </span>
            </div>
            <div className="btn-container center my-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  createProspect();
                }}
              >
                <FaSave />
                Create
              </button>
            </div>
          </div>
        </CModalBody>
      </CModal>
    </div>
  );
};

function ResourceRequest() {
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [dataAr, setDataAr] = useState([]);
  const [business, setBusiness] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [countryResLocation, setCountryResLocation] = useState([]);
  const [selectedCountryResLocation, setSelectedCountryResLoc] = useState([]);
  const [issueDetails, setIssueDetails] = useState([]);
  const [location, setLocation] = useState([]);
  const loggedUserId = localStorage.getItem("resId");
  const [stage, setStage] = useState([]);
  const [fncDate, setFncDate] = useState([]);
  const [tabStage, setTabStage] = useState([]);
  const [selectedStage, setSelectedStage] = useState([]);
  const [tableData, setTableData] = useState([{}]);
  const [rowId, setRowId] = useState([]);
  const [resourcePoId, setresourcePoId] = useState([]);
  const [reqBu, setReqBu] = useState([]);
  const [resource, setResource] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [date, SetDate] = useState(new Date());
  const [displayState, setDisplayState] = useState("view");
  const [displayTable, setDisplayTable] = useState(false);
  const [month, setMonth] = useState(new Date());
  const [employeeId, setEmployeeId] = useState([]);
  const [pocId, setPocId] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [validationMessage, setValidationMessage] = useState(false);
  const [validationMessage1, setValidationMessage1] = useState(false);
  const [resId, setResId] = useState([]);
  const [cusId, setCusId] = useState([]);
  const [userId, setUserId] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [nonMatching, setNonMatching] = useState("");
  const loggedUserName = localStorage.getItem("resName");
  const [successfullymsg, setSccessfullyMsg] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [cancelClicked, setCancelClicked] = useState(true);
  const [customerProspectId, setCustomerProspectId] = useState([]);
  const [headerData, setHeaderData] = useState([]);

  useEffect(() => {
    tableData[0] && setHeaderData(JSON.parse(JSON.stringify(tableData[0])));
  }, [tableData]);
  const handelSelect = (e) => {
    setCusId({
      id: e.id,
      label: e.label,
    });
  };
  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    // customer: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // reqDept: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // rrqId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() => {
    setFilters({
      global: filtersData["contains"],
    });
  }, [headerData]);

  useEffect(() => {}, [tableData]);

  //==================table Height=================
  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 84) + "px"
  );
  document.documentElement.style.setProperty(
    "--dynamic-value1",
    String(maxHeight1 - 118) + "px"
  );

  //==============================================

  const autoCompleteRef = useRef(null);
  const [showValue, setShowValue] = useState(true);
  const ref = useRef([]);
  const ref1 = useRef([]);
  const componentRef = useRef(null);
  const errorBlock = (ref1) => {
    const finalRes = [];
    const addingClass = (ele, value) => {
      if (value === "") {
        finalRes?.push(true);
      } else {
        ele?.classList?.remove("error-block");
        finalRes?.push(false);
      }
      return finalRes;
    };
    const data = ref1.current;
    for (let i = 0; i < data.length; i++) {
      let parentClassList = data[i]?.classList;

      if (parentClassList?.contains("textfield")) {
        let addingBorder = data[i]?.children[0];
        addingClass(addingBorder, addingBorder?.value);
      } else if (parentClassList?.contains("autoComplete-container")) {
        let addingBorder = data[i].children[0].children[0];
        let addingBorder1 = data[i].children[0].children[0];
        let value = addingBorder.children[0].children[0].value;
        addingClass(addingBorder1, value);
      }
    }
    return finalRes;
  };
  const [editingRows, setEditingRows] = useState({});

  const onRowEditComplete = (e) => {
    let _tableData = [...tableData];
    let { newData, index } = e;
    _tableData[index] = newData;
    setTableData(_tableData);
    handleAddClick(e.newData);
  };

  const initialValue = {
    id: null,
    departmentId: "",
    customerId: "",
    isProspect: "",
    requestedPocId: "",
    rrqId: " ",
    proposedResourceId: "",
    proposedDate: "",
    stageId: "",
    requestedSkills: "",
    requestedCountryId: "",
    SfaUrl: "",
    comments: "",
    createdById: "",
  };
  const [formData, setFormData] = useState(initialValue);

  const values = {
    reqBuIds: "170,211,123,82,168,207,212,18,213,49,149,208,243",
    reqLocIds: "6,5,3,8,7,1,2",
    stages: "1160,1161,1163,1164,1167",
    resType: -1,
    resLocIds: "6,5,3,8,7,1,2",
    action: "view",
  };
  const [setData, setSetData] = useState(values);
  const baseUrl = environment.baseUrl;
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
        setLocation(data);
        setSelectedCountry(countries);
      })
      .catch((error) => console.log(error));
  };

  const getCountriesResLoc = () => {
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
        setCountryResLocation(countries);
        setLocation(data);
        setSelectedCountryResLoc(countries);
      })
      .catch((error) => console.log(error));
  };
  const getBusinessUnit = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getDepartments`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.label,
              value: e.value,
            };
            countries.push(countryObj);
          });
        setBusiness(countries);
        setReqBu(data);
        setSelectedBusiness(countries);
      })
      .catch((error) => console.log(error));
  };
  const getStates = () => {
    axios
      .get(baseUrl + `/ProjectMS/ProjectScopeChange/getStages`)
      .then((Response) => {
        let countries = [];
        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.lkup_name,
              value: e.id,
              supp: e.val,
            };
            countries.push(countryObj);
          });
        setStage(countries);
        setTabStage(data);
        let defaultSelected = JSON.parse(JSON.stringify(countries)).filter(
          (d) => d.supp.includes("inactive") == false
        );
        setSelectedStage(defaultSelected);
      })
      .catch((error) => console.log(error));
  };
  const resourceFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    })
      .then((res) => {
        let manger = res.data;
        setResource(manger);
      })
      .catch((error) => {});
  };
  const customerFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/fullfilmentms/Resourcerequest/getCustomerAndProspect`,
    })
      .then((res) => {
        let manger = res.data;
        setCustomer(manger);
      })
      .catch((error) => {});
  };

  // useEffect(() => {
  //   handleClick();
  // }, []);

  const handleClick = () => {
    GlobalCancel(ref);
    setDisplayState(setData.action);
    setValidationMessage1(false);

    if (
      setData.reqBuIds == "" ||
      setData.reqLocIds == "" ||
      setData.stages == "" ||
      setData.resType == "" ||
      setData.resLocIds == ""
    ) {
      let valid = GlobalValidation(ref);

      if (valid) {
        {
          setValidationMessage(true);
        }
        return;
      }
      setDisplayTable(false);
    } else {
      setValidationMessage(false);
      axios({
        method: "post",
        url:
          // `http://localhost:8090/fullfilmentms/Resourcerequest/getRmgProposals`,
          baseUrl + `/fullfilmentms/Resourcerequest/getRmgProposals`,
        data: {
          reqBuIds: setData.reqBuIds,
          reqLocIds: setData.reqLocIds,
          stages: setData.stages,
          resType: setData.resType,
          duration: null,
          from: null,
          resLocIds: setData.resLocIds,
        },
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        const GetData = response.data.data;
        const sortedData = GetData.sort((a, b) => b.id - a.id); // Sort by id in descending order
        const formattedData = sortedData.map((item) => {
          return {
            ...item,
            date:
              item?.date == null ? "" : moment(item?.date).format("DD-MMM-YY"),
            isProspect: item.isProspect === "No" ? 0 : 1,
            requestedCountryId: item.reqCountryId, // Rename reqCountryId to requestedCountryId
            sfa_url:
              item.sfa_url === "null" ? "" : item.sfa_url ? item.sfa_url : "",
            skill: item.skill === "null" ? "" : item.skill ? item.skill : "",
          };
        });
        setTableData(formattedData);
        setDisplayTable(true);
        setEmployeeId("");
        setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
        window.scrollTo({
          top: 500,
          behavior: "smooth",
        });
      });
    }
  };

  const handleClick1 = () => {
    GlobalCancel(ref);
    setDisplayState(setData.action);
    setValidationMessage1(false);

    if (
      setData.reqBuIds == "" ||
      setData.reqLocIds == "" ||
      setData.stages == "" ||
      setData.resType == "" ||
      setData.resLocIds == ""
    ) {
      let valid = GlobalValidation(ref);
      if (valid) {
        {
          setValidationMessage(true);
        }
        return;
      }
    } else {
      setValidationMessage(false);
      setValidationMessage1(false);
      axios({
        method: "post",
        url: baseUrl + `/fullfilmentms/Resourcerequest/getRmgProposals`,
        data: {
          reqBuIds: setData.reqBuIds,
          reqLocIds: setData.reqLocIds,
          stages: setData.stages,
          resType: setData.resType,
          duration: null,
          from: null,
          resLocIds: setData.resLocIds,
        },
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        const GetData = response.data.data;
        const sortedData = GetData.sort((a, b) => b.id - a.id); // Sort by id in descending order
        const formattedData = sortedData.map((item) => {
          return {
            ...item,
            date:
              item?.date == null ? "" : moment(item?.date).format("DD-MMM-YY"),
            isProspect: item.isProspect === "No" ? 0 : 1,
            requestedCountryId: item.reqCountryId, // Rename reqCountryId to requestedCountryId
            sfa_url:
              item.sfa_url === "null" ? "" : item.sfa_url ? item.sfa_url : "",
            skill: item.skill === "null" ? "" : item.skill ? item.skill : "",
          };
        });

        setTableData(formattedData);
        setEmployeeId("");
        window.scrollTo({
          top: 0,
          behavior: "smooth", // This adds a smooth scrolling effect, optional
        });
      });
    }
  };

  const removeValue1 = () => {
    const inputRef = componentRef.current;
    if (inputRef && inputRef.value !== undefined) {
      inputRef.value = "";
    }
  };
  const setOnChange = (e) => {
    const { value, id } = e.target;
    setSetData({ ...setData, [id]: value });
  };
  const getUser = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setIssueDetails(res);
    });
  };

  // useEffect(() => {
  let sideSaveICon = document.getElementsByClassName(
    "p-row-editor-save p-link"
  );
  let sideEditIcon = document.getElementsByClassName(
    "p-row-editor-cancel p-link"
  );
  let sidePencilicon = document.getElementsByClassName(
    "p-row-editor-init-icon pi pi-fw pi-pencil"
  );
  for (let i = 0; i < sideSaveICon.length; i++) {
    sideSaveICon[i].setAttribute("title", "Save");
  }
  for (let i = 0; i < sideEditIcon.length; i++) {
    sideEditIcon[i].setAttribute("title", "Cancel");
  }
  for (let i = 0; i < sidePencilicon.length; i++) {
    sidePencilicon[i].setAttribute("title", "Edit");
  }

  let sideEditIcons = document.getElementsByClassName(
    "p-row-editor-cancel p-link"
  );

  function handleClickOnce() {
    handleClick1();
  }

  Array.from(sideEditIcons).forEach((icon) => {
    let hasEventListener = false;

    icon.addEventListener("click", function () {
      if (!hasEventListener) {
        hasEventListener = true;
        handleClickOnce();
      }
    });
  });

  useEffect(() => {
    let prod = tableData[0];
    if (tableData[0]?.departmentId == "") {
      const icon = document.getElementsByClassName(
        "p-row-editor-init p-link"
      )[0];
      icon?.setAttribute("title", "Edit selected row");
      icon?.click();
      setTimeout(() => {
        const saveIcon = document?.getElementsByClassName(
          "p-row-editor-save p-link"
        )[0];
        saveIcon?.setAttribute("title", "Save row");
        const cancelIcon = document?.getElementsByClassName(
          "p-row-editor-cancel p-link"
        )[0];
        cancelIcon?.setAttribute("title", "Cancel row editing");
        cancelIcon?.addEventListener(
          "click",
          function (e) {
            if (tableData[0]?.departmentId == "") {
              setTableData(tableData.slice(1, tableData.length));
              setEmployeeId(""),
                setUserId(""),
                SetDate(new Date()),
                setCancelClicked(true);
              setClicked(false);
              setValidationMessage(false);
              setValidationMessage1(false);
              handleClick1();
            }
          },
          true
        );
      }, 200);
    }
  }, [tableData]);

  const handleAddClick = (tableData) => {
    tableData["customer"] =
      nonMatching == undefined || nonMatching == ""
        ? tableData["customer"]
        : nonMatching;
    tableData["customerId"] =
      customerProspectId[0]?.id === undefined
        ? cusId?.id
          ? cusId?.id
          : tableData["customerId"]
        : customerProspectId[0]?.id;
    let newUserId = +loggedUserId + 1;
    tableData["poc"] =
      tableData["poc"] == undefined ? loggedUserName : tableData["poc"];
    tableData["pocId"] =
      tableData["pocId"] == undefined ? newUserId : tableData["pocId"];

    tableData["requestedCountryId"] === ""
      ? 6
      : tableData["requestedCountryId"];

    if (tableData["customerId"] == customerProspectId[0]?.id) {
      tableData["isProspect"] = 1;
    }
    if (
      tableData.customerId == "" ||
      tableData.rrqId == "" ||
      tableData?.resId == undefined ||
      tableData?.resId == ""
      // ||
      // tableData?.res == undefined ||
      // tableData?.res == ""
    ) {
      setValidationMessage1(true);

      // let valid = errorBlock(ref1);
      // console.log(valid);
      // if (valid[0] == true && valid[1] == true) {
      //   setValidationMessage1(true);
      //   setValidationMessage(true);
      // } else if (valid[0] == false && valid[1] == true) {
      //   setValidationMessage(true);
      //   setValidationMessage1(false);
      // } else if (valid[0] == true && valid[1] == false) {
      //   setValidationMessage1(true);
      //   setValidationMessage(false);
      //   console.log(tableData, "601...");
      // }
      //  else if (
      //   tableData.customerId == "" ||
      //   tableData.rrqId == "" ||
      //   tableData?.resId == undefined ||
      //   tableData?.resId == "" ||
      //   tableData?.res == undefined ||
      //   tableData.res == ""
      // ) {
      //   setValidationMessage1(true);
      // }
      if (!clicked) {
        setTableData(tableData?.slice(1, tableData.length));
      }
      return;
    } else {
      setValidationMessage1(false);
      setValidationMessage(false);
      axios({
        method: "post",
        url:
          // `http://localhost:8090/fullfilmentms/Resourcerequest/postRmgProposals`,
          baseUrl + `/fullfilmentms/Resourcerequest/postRmgProposals`,
        data: {
          id: tableData.id,
          departmentId: tableData.reqDeptId,
          customerId: tableData.customerId,
          isProspect: tableData.isProspect,
          requestedPocId:
            tableData.pocId == null ? loggedUserId : tableData.pocId,
          rrqId: tableData.rrqId,
          proposedResourceId: tableData.resId,
          proposedDate: moment(tableData.date).format("yyyy-MM-DD"),
          stageId: tableData.stageId == "" ? 1167 : tableData.stageId,
          requestedSkills: tableData.skill,
          requestedCountryId:
            // tableData.id == ""
            // ? tableData.requestedCountryId
            tableData.requestedCountryId == ""
              ? 6
              : tableData.requestedCountryId,
          // ? tableData.requestedCountryId == ""
          //   ? 6
          //   : tableData.requestedCountryId
          // : tableData.requestedCountryId
          SfaUrl: tableData.sfa_url,
          comments: tableData.comments,
          createdById: loggedUserId,
        },
      }).then((response) => {
        setEmployeeId("");
        setCustomerProspectId("");
        setCusId("");
        setNonMatching("");
        handleClick1();
        window.scroll({
          top: 0,
          behavior: "smooth",
        });
        setSccessfullyMsg(true);
        setTimeout(() => {
          setSccessfullyMsg(false);
        }, 1000);
        setClicked(false);
        setCancelClicked(true);
      });
    }
  };

  useEffect(() => {
    getBusinessUnit();
    getCountries();
    getCountriesResLoc();
    getStates();
    getUser();
    resourceFnc();
    customerFnc();
    let tdata = getTableData();
    setDataAr(tdata);
  }, []);

  useEffect(() => {}, [resourcePoId]);

  const exportExcel = async () => {
    const exceljs = await import("exceljs");
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("data");

    const excludedProperties = [
      "id",
      "isDuplicate",
      "customerId",
      "pocId",
      "requestedCountryId",
      "reqCountryId",
      "reqDeptId",
      "resId",
      "stageId",
      "isProspect",
    ];
    const customSortOrder = [
      "reqDept",
      "customer",
      "isProspect",
      "poc",
      "rrqId",
      "empId",
      "res",
      "dept",
      "country_name",
      "date",
      "stage",
      "skill",
      "reqCountry",
      "sfa_url",
      "comments",
    ];

    const getHeaderDisplayName = (header) => {
      const headerMappings = {
        reqCountry: "Req. Location",
        country_name: "Resource Location",
        reqDept: "Req.BU",
        res: "Resource Proposed",
        comments: "Action Items",
        customer: "Customer/Prospect",
        sfa_url: "SFA URL",
        poc: "Req.BU SPOC",
        rrqId: "RRQ ID",
        empId: "Emp ID",
        dept: "Resource BU",
        date: "Proposed On",
        stage: "Stage",
        skill: "Req.Skills",
      };
      return headerMappings[header] || header;
    };

    if (tableData.length > 0) {
      const headers = Object.keys(tableData[0])
        .filter((header) => !excludedProperties.includes(header))
        .sort(
          (a, b) => customSortOrder.indexOf(a) - customSortOrder.indexOf(b)
        );
      const headerDisplayNames = headers.map(getHeaderDisplayName);

      worksheet.addRow(headerDisplayNames).font = { bold: true };

      tableData.forEach((rowData) => {
        const values = headers.map((header) => rowData[header]);
        worksheet.addRow(values);
      });
    }

    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), "Resource Proposal.xlsx");
    });
  };

  const textEditor12 = (tableData) => {
    return (
      <InputText
        type="text"
        value={
          tableData.rowData.sfa_url == "null" ? "" : tableData.rowData.sfa_url
        }
        id="SfaUrl"
        onChange={(e) => {
          tableData.editorCallback(e.target.value);
        }}
      ></InputText>
    );
  };
  const reqSkillFnc = (tableData) => {
    setPocId(tableData.rowData.pocId);
    return (
      <InputText
        type="text"
        title={tableData.rowData.skill}
        value={tableData.rowData.skill == "null" ? "" : tableData.rowData.skill}
        ref={componentRef}
        id="requestedSkills"
        onChange={(e) => {
          tableData.editorCallback(e.target.value);
        }}
      ></InputText>
    );
  };

  const textEditor13 = (tableData) => {
    return (
      <InputText
        type="text"
        title={
          tableData.rowData.comments == "null" ? "" : tableData.rowData.comments
        }
        value={
          tableData.rowData.comments == "null" ? "" : tableData.rowData.comments
        }
        id="comments"
        onChange={(e) => tableData.editorCallback(e.target.value)}
      ></InputText>
    );
  };

  const rrqIdFnc = (tableData) => {
    return (
      <div
        className="textfield"
        ref={(ele) => {
          ref1.current[1] = ele;
        }}
      >
        <InputText
          className={
            validationMessage1 == true && tableData.rowData.rrqId == ""
              ? "error-block "
              : "removevalue"
          }
          type="text"
          title={tableData.rowData.rrqId}
          value={tableData.rowData.rrqId}
          ref={componentRef}
          id="rrqId"
          onChange={(e) => {
            tableData.editorCallback(e.target.value);
          }}
        ></InputText>
      </div>
    );
  };
  const empIdFnc = (tableData) => {
    return (
      <div
        // className="autoComplete-container"
        className={
          validationMessage1 == true &&
          (tableData.rowData.resId == undefined ||
            tableData.rowData.resId == "")
            ? "autoComplete-container error-block"
            : "autoComplete-container"
        }
        // ref={handleRefCallback}
      >
        <ReactSearchAutocomplete
          items={resource}
          type="Text"
          name="resource"
          id="proposdResourceId"
          className="err cancel nochange"
          dropdownClassName="custom-dropdown-class"
          fuseOptions={{ keys: ["id", "name", "employee_number"] }}
          resultStringKeyName="employee_number"
          inputSearchString={tableData.rowData.empId}
          placeholder="Type minimum 3 characters to get the list"
          resource={resource}
          resourceFnc={resourceFnc}
          onClear={() => {
            tableData.rowData.resId = "";
          }}
          onSelect={(e) => {
            let inputString = e.name;
            let extractedName = inputString.split("(")[0].trim();
            tableData.rowData.resId = e.id;
            tableData.rowData.res = inputString;
            setResId(e);
            axios({
              method: "get",
              url:
                baseUrl +
                `/fullfilmentms/Resourcerequest/getEmpdeatils?rid=${e.id}`,
            })
              .then((res) => {
                let manger = res.data;

                setEmployeeId(manger);
              })
              .catch((error) => {});
          }}
          showIcon={false}
        />
      </div>
    );
  };

  const addProperty = () => {
    setPopUp(true);
  };

  const inputField =
    autoCompleteRef?.current?.querySelector(".sc-hLBbgP input");
  const dataName = inputField?.value;

  useEffect(() => {
    setNonMatching(dataName);
  }, [dataName]);

  const handleRefCallback = (element) => {
    autoCompleteRef.current = element;
    ref1.current[0] = element;
  };

  const formatResult = (item) => {
    return (
      <div className="result-wrapper">
        <div className="legendContainer">
          <div
            className={item.isProspect === 1 ? "legend-purple" : "legend green"}
          >
            <div className="legendCircle"></div>
          </div>
          <span className="legendTxt">{item.label}</span>
        </div>
      </div>
    );
  };
  const prospect = (tableData) => {
    setRowId(tableData.rowData.id);
    setresourcePoId(tableData.rowData.pocId);
    return (
      <div
        className={
          validationMessage1 == true && tableData.rowData.customerId == ""
            ? // (tableData.rowData.customer == "" ||
              //   tableData.rowData.customer === undefined)
              "autoComplete-container error-block"
            : "autoComplete-container"
        }
        ref={handleRefCallback}
      >
        <ReactSearchAutocomplete
          title={"sdg"}
          items={customer}
          type="Text"
          name="customer"
          id="customerId"
          className="err cancel nochange"
          fuseOptions={{
            keys: ["id", "label"],
            includeScore: false,
            threshold: 0.3,
          }}
          formatResult={formatResult}
          resultStringKeyName="label"
          placeholder="Type minimum 3 characters to get the list"
          resource={customer}
          inputSearchString={
            tableData.rowData.customer == null ? "" : tableData.rowData.customer
          }
          onClear={() => {
            setCusId({
              id: "",
              label: "",
              isProspect: "",
            });
            tableData.rowData.customerId = "";
            tableData.rowData.customer = "";
            setNonMatching("");
          }}
          resourceFnc={customerFnc}
          onSelect={(e) => {
            setCusId({
              id: e.id,
              label: e.label,
              isProspect: e.isProspect,
            });
            tableData.rowData.isProspect = e.isProspect;
            // tableData.rowData.customer = e.label;
          }}
          showIcon={false}
          showNoResultsText={
            <buttion
              onClick={() => addProperty()}
              style={{ cursor: "pointer" }}
            >
              Add this as a new Prospect
            </buttion>
          }
        />
      </div>
    );
  };

  const textEditor1 = (tableData) => {
    return (
      <>
        <select
          className="cancel"
          name="size"
          id="reqDeptId"
          onChange={(e) => {
            tableData.editorCallback(e.target.value);
            reqBu.map((a) => {
              if (a.value == e.target.value) {
                tableData["rowData"]["reqDept"] = a.label;
                tableData["rowData"]["reqDeptId"] = e.target.value;
              }
            });
          }}
        >
          <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
          {reqBu.map((Item, index) => (
            <option
              key={index}
              value={Item.value}
              selected={
                Item?.label === tableData.rowData.reqDept ? true : false
              }
            >
              {Item.label}
            </option>
          ))}
        </select>
      </>
    );
  };
  const stageFnc = (tableData) => {
    return (
      <>
        <select
          className="cancel"
          name="size"
          id="stageId"
          onChange={(e) => {
            tableData.editorCallback(e.target.value);
            tabStage.map((a) => {
              if (a.id == e.target.value) {
                tableData["rowData"]["stage"] = a.lkup_name;
                tableData["rowData"]["stageId"] = e.target.value;
              }
            });
          }}
        >
          {/* <option value=""> &lt;&lt;Please Select&gt;&gt;</option> */}
          {tabStage.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == tableData.rowData.stageId ? true : false}
            >
              {Item.lkup_name}
            </option>
          ))}
        </select>
      </>
    );
  };
  const proposedOnFnc = (tableData, options) => {
    setFncDate(tableData.rowData.date);
    return (
      <div className="datepicker">
        <DatePicker
          name="month"
          id="proposedDate"
          className=""
          selected={date}
          dropdownMode="select"
          maxDate={new Date()}
          onChange={(e) => {
            SetDate(e);
            tableData.editorCallback(moment(e).format("DD-MMM-yy"));
            setFormData((prev) => ({
              ...prev,
              ["proposedDate"]: moment(e).format("yyyy-MM-DD"),
            }));
          }}
          dateFormat="dd-MMM-yy"
          showYearDropdown
          showMonthDropdown
          placeholderText={fncDate}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />
      </div>
    );
  };

  const ResourceBu = (tableData) => {
    return (
      <div>
        <input
          value={
            employeeId[0]?.department == null ||
            employeeId[0]?.department == undefined
              ? tableData.rowData.dept
              : employeeId[0]?.department
          }
          disabled
          type="text"
        />
      </div>
    );
  };
  const resLocation = (tableData) => {
    return (
      <div>
        <input
          value={
            employeeId[0]?.country_name == null ||
            employeeId[0]?.country_name == undefined
              ? tableData.rowData.reqCountry
              : employeeId[0]?.country_name
          }
          disabled
          type="text"
        />
      </div>
    );
  };
  const ResourceProposedFnc = (tableData, options) => {
    return (
      <div
        // className="autoComplete-container"
        className={
          validationMessage1 == true &&
          (tableData.rowData.res == undefined || tableData.rowData.res == "")
            ? "autoComplete-container error-block"
            : "autoComplete-container"
        }
        // ref={handleRefCallback}
      >
        <ReactSearchAutocomplete
          items={resource}
          type="Text"
          name="resource"
          id="proposedResourceId"
          className="err cancel nochange"
          fuseOptions={{ keys: ["id", "name"] }}
          resultStringKeyName="name"
          placeholder="Type minimum 3 characters to get the list"
          resource={resource}
          resourceFnc={resourceFnc}
          inputSearchString={
            tableData.rowData.res == null || tableData.rowData.res == ""
              ? employeeId[0]?.ResName
              : tableData.rowData.res
          }
          onClear={() => {
            tableData.rowData.res = "";
          }}
          onSelect={(e) => {
            tableData.rowData.resId = e.id;
            tableData.rowData.empId = e.employee_number;
            setFormData((prevProps) => ({
              ...prevProps,
              proposedResourceId: e.id,
            }));
            setResId(e);
            axios({
              method: "get",
              url:
                baseUrl +
                `/fullfilmentms/Resourcerequest/getEmpdeatils?rid=${e.id}`,
            })
              .then((res) => {
                let manger = res.data;
                setEmployeeId(manger);
              })
              .catch((error) => {});

            setEmployeeId(e.id);
            // employeeDetailsFnc();
          }}
          showIcon={false}
        />
      </div>
    );
  };
  const reqLocationFnc = (tableData, options) => {
    return (
      <>
        <select
          id="requestedCountryId"
          className="cancel"
          name="size"
          // id="size"
          onChange={(e) => {
            tableData.editorCallback(e.target.value);
            location.map((a) => {
              if (a.id == e.target.value) {
                tableData["rowData"]["reqCountry"] = a.country_name;
                tableData["rowData"]["requestedCountryId"] = e.target.value;
              }
            });
          }}
        >
          {/* <option value=""> &lt;&lt;Please Select&gt;&gt;</option> */}
          {location?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={
                Item.id == tableData.rowData.requestedCountryId ? true : false
              }
            >
              {Item.country_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  const addHandler = () => {
    setValidationMessage1(false);
    setValidationMessage(false);
    const data = {
      id: "",
      departmentId: "",
      customerId: "",
      requestedPocId: "",
      rrqId: "",
      proposedResourceId: "",
      proposedDate: "",
      stageId: "",
      requestedSkills: "",
      requestedCountryId: "",
      SfaUrl: "",
      comments: "",
    };
    let dt = [];
    dt.push(data);
    setTableData([...dt, ...tableData]);
    setCancelClicked(false);
    setClicked(true);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="primeTableSearch legend-execel-and-search-btn">
        <div className="legend">
          <div className="legendTxt">
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "pink", // Change to your desired color
                marginRight: "5px",
              }}
            ></span>
            <span className="legend-text">
              This Resource may have another proposal(s) in the active status
            </span>
          </div>
        </div>
        <div className="execel-and-search-btn">
          <InputText
            className="globalFilter"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
          <div className="exportBtn">
            <span
              size="2em"
              title="Export to Excel"
              className="pi pi-file-excel excel"
              // style={{ color: "green" }}
              cursor="pointer"
              onClick={exportExcel}
            />
          </div>
        </div>
      </div>
    );
  };
  const header = renderHeader();
  const HelpPDFName = "Resourceproposal.pdf";
  const Headername = "Resource Proposal Help";

  const [routes, setRoutes] = useState([]);
  let textContent = "Fullfilment";
  let currentScreenName = ["Resource Request"];
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
      const modifiedUrlPath = "/rmg/proposal";
      getUrlPath(modifiedUrlPath);

      let data = resp.data;
      const request = data
        .find((item) => item.display_name === "Fullfilment")

        .subMenus.find(
          (subMenu) => subMenu.display_name === "Resource Request"
        );

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

  const handleBodyCustomerProspect = (data) => {
    return (
      <>
        <input
          id="customer"
          title={data.customer}
          value={data.customer}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyReq = (data) => {
    return (
      <>
        <input
          id="reqDept"
          title={data.reqDept}
          value={data.reqDept}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyPoc = (data) => {
    return (
      <>
        <input
          id="poc"
          title={data.poc}
          value={data.poc}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const textEditorPOC = (products) => {
    return (
      <div className="autoComplete-container">
        {/* <ReactSearchAutocomplete
          items={issueDetails}
          type="Text"
          name="Userid"
          id="Userid"
          // styling={{di}}
          styling={{ cursor: "disabled" }}
          dropdownClassName="custom-dropdown-class"
          fuseOptions={{ keys: ["id", "name", "employee_number"] }}
          resultStringKeyName="name"
          className="err cancel nochange"
          issueDetails={issueDetails}
          inputSearchString={
            products.rowData.poc == null ? loggedUserName : products.rowData.poc
          }
          getUser={getUser}
          //   onSelect={handleAddFormChange}
          onSelect={(e) => {
            products.editorCallback(e.name);
            setUserId({
              id: e.id,
              label: e.name,
            });
          }}
          showIcon={false}
        /> */}
        <input
          type="Text"
          name="Userid"
          id="Userid"
          title={
            products.rowData.poc == null ? loggedUserName : products.rowData.poc
          }
          disabled
          value={
            products.rowData.poc == null ? loggedUserName : products.rowData.poc
          }
        />
      </div>
    );
  };
  const handleBodyRrq = (data) => {
    return (
      <>
        <input
          id="rrqId"
          title={data.rrqId}
          value={data.rrqId}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyEmp = (data) => {
    return (
      <>
        <input
          id="empId"
          title={data.empId}
          value={data.empId}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyResourceApproval = (data) => {
    return (
      <>
        <input
          id="res"
          title={data.res}
          value={data.res}
          // className="ellipsis rowClassName"
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyDept = (data) => {
    return (
      <>
        <input
          id="dept"
          title={data.dept}
          value={data?.dept}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyLocation = (data) => {
    return (
      <>
        <input
          id="country_name"
          title={data.country_name}
          value={data.country_name}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyDate = (data) => {
    return (
      <>
        <input
          id="date"
          title={data.date}
          value={data.date}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyStage = (data) => {
    return (
      <>
        <input
          id="stage"
          title={data.stage}
          value={data.stage}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodySkill = (data) => {
    return (
      <>
        <input
          id="skill"
          title={data.skill}
          value={data.skill === "null" ? "" : data.skill}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyReqLocation = (data) => {
    return (
      <>
        <input
          id="reqCountry"
          title={data.reqCountry}
          value={data.reqCountry}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodySfaUrl = (data) => {
    return (
      <>
        <input
          id="sfa_url"
          title={data.sfa_url}
          value={data.sfa_url == "null" ? "" : data.sfa_url}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyComments = (data) => {
    return (
      <>
        <input
          id="comments"
          title={data.comments}
          value={data.comments}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };

  const handleBodyCustom = (data) => {
    return (
      <>
        <input
          id="customer"
          title={data.customer}
          value={data.customer}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyReqBu = (data) => {
    return (
      <>
        <input
          id="reqDept"
          title={data.reqDept}
          value={data.reqDept}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyReqBy = (data) => {
    return (
      <>
        <input
          id="poc"
          title={data.poc}
          value={data.poc}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyRrqId = (data) => {
    return (
      <>
        <input
          id="rrqId"
          title={data.rrqId}
          value={data.rrqId}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyEmpId = (data) => {
    return (
      <>
        <input
          id="empId"
          title={data.empId}
          value={data.empId}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyRes = (data) => {
    return (
      <>
        <input
          id="res"
          title={data.res}
          value={data.res}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyResBu = (data) => {
    return (
      <>
        <input
          id="dept"
          title={data.dept}
          value={data.dept}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyCust = (data) => {
    return (
      <>
        <input
          id="country_name"
          title={data.country_name}
          value={data.country_name}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyProposedOn = (data) => {
    return (
      <>
        <input
          id="date"
          title={data.date}
          value={data.date}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodystage = (data) => {
    return (
      <>
        <input
          id="stage"
          title={data.stage}
          value={data.stage}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyskill = (data) => {
    return (
      <>
        <input
          id="skill"
          title={data.skill}
          value={data.skill}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyReqlocation = (data) => {
    return (
      <>
        <input
          id="reqCountry"
          title={data.reqCountry}
          value={data.reqCountry}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyUrl = (data) => {
    return (
      <>
        <input
          id="sfa_url"
          title={data.sfa_url}
          value={data.sfa_url}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
  };
  const handleBodyComment = (data) => {
    return (
      <>
        <input
          id="comments"
          title={data.comments}
          value={data.comments}
          className={
            data?.isDuplicate == "duplicateRow"
              ? "duplicate-row ellipsis"
              : "ellipsis"
          }
          type="text"
          disabled
        />
      </>
    );
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

  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();
  };

  const Reset = () => {
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setEmployeeId("");
    setCancelClicked(true);
    setClicked(false);
    setValidationMessage1(false);
    setValidationMessage(false);
    // setTableData(tableData.slice(1, tableData.length));
  };

  return (
    <div>
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Resource Request</h2>
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
            <GlobalHelp pdfname={HelpPDFName} name={Headername} />
          </div>{" "}
        </div>
      </div>

      <div className="col-md-12  mt-2">
        {validationMessage || validationMessage1 ? (
          <div className="statusMsg error">
            {" "}
            <span>
              {" "}
              <IoWarningOutline /> Please select the valid values for
              highlighted fields{" "}
            </span>
          </div>
        ) : (
          ""
        )}

        {successfullymsg && (
          <div>
            <div className="statusMsg success">
              <span className="errMsg">
                <BiCheck size="1.4em" /> &nbsp; Proposal saved successfully
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="group mb-3 customCard">
        <div className="col-md-12 collapseHeader"></div>
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="reqBU">
                  Req. BU <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[0] = ele;
                  }}
                >
                  <MultiSelect
                    id="businessUnit"
                    options={business}
                    ArrowRenderer={ArrowRenderer}
                    hasSelectAll={true}
                    value={selectedBusiness}
                    valueRenderer={generateDropdownLabel}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedBusiness(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setSetData((prevVal) => ({
                        ...prevVal,
                        ["reqBuIds"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="reqLocation">
                  Req. Location <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[1] = ele;
                  }}
                >
                  <MultiSelect
                    id="location"
                    options={country}
                    hasSelectAll={true}
                    value={selectedCountry}
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    disabled={false}
                    onChange={(e) => {
                      setSelectedCountry(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setSetData((prevVal) => ({
                        ...prevVal,
                        ["reqLocIds"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="stage">
                  Stage
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <MultiSelect
                    id="location"
                    options={stage}
                    hasSelectAll={true}
                    value={selectedStage}
                    disabled={false}
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    onChange={(e) => {
                      setSelectedStage(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setSetData((prevVal) => ({
                        ...prevVal,
                        ["stages"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resType">
                  Res Type <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    ref={(ele) => {
                      ref.current[2] = ele;
                    }}
                    id="resType"
                    onChange={(e) => setOnChange(e)}
                  >
                    <option value="-1"> &lt;&lt; ALL &gt;&gt;</option>
                    <option value="fte"> Employees</option>
                    <option value="subk"> Contractors</option>
                  </select>
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="resLocation">
                  Res. Location <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div
                  className="col-6 multiselect"
                  ref={(ele) => {
                    ref.current[3] = ele;
                  }}
                >
                  <MultiSelect
                    id="location"
                    options={countryResLocation}
                    hasSelectAll={true}
                    value={selectedCountryResLocation}
                    disabled={false}
                    ArrowRenderer={ArrowRenderer}
                    valueRenderer={generateDropdownLabel}
                    onChange={(e) => {
                      setSelectedCountryResLoc(e);
                      let filteredCountry = [];
                      e.forEach((d) => {
                        filteredCountry.push(d.value);
                      });
                      setSetData((prevVal) => ({
                        ...prevVal,
                        ["resLocIds"]: filteredCountry.toString(),
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
            <div className=" col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="action">
                  Action <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    className="text"
                    id="action"
                    onChange={(e) => setOnChange(e)}
                  >
                    <option value="view" selected={"View"}>
                      {" "}
                      View
                    </option>
                    <option value="edit"> Edit</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
              <button
                className="btn btn-primary "
                onClick={() => handleClick()}
              >
                <FaSearch />
                Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>

      <>
        {popUp == true ? (
          <StagePopUp
            popUp={popUp}
            setPopUp={setPopUp}
            nonMatching={nonMatching}
            setNonMatching={setNonMatching}
            customerFnc={customerFnc}
            setCustomerProspectId={setCustomerProspectId}
          />
        ) : (
          ""
        )}

        {displayState == "view" && displayTable && (
          <div className="col-md-12 fullfillments-ResourceRequest-view">
            <DataTable
              value={tableData}
              className="primeReactDataTable darkHeader toHead Resource-Request-Editable-Table"
              editMode="row"
              showGridlines
              // scrollable={true}
              emptyMessage="No Data Found"
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords}"
              // scrollHeight="400px"
              paginator
              rows={25}
              rowsPerPageOptions={[10, 25, 50]}
              // scrollWidth="100%"
              header={header}
              filters={filters}
            >
              <Column
                field="customer"
                sortable
                header={
                  <div>
                    <div
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "green",
                        marginRight: "5px",
                      }}
                    ></div>
                    Customer
                    <br />
                    <div
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "purple",
                        marginRight: "5px",
                      }}
                    ></div>
                    Prospect
                  </div>
                }
                body={handleBodyCustom}
                style={{ justifyContent: "center", maxWidth: "111px" }}
              ></Column>

              <Column
                field="reqDept"
                header="Req.BU"
                sortable
                body={handleBodyReqBu}
                style={{ justifyContent: "center", maxWidth: "90px" }}
              ></Column>
              <Column
                field="poc"
                header="Requested By"
                body={handleBodyReqBy}
                sortable
                style={{ justifyContent: "center", maxWidth: "95px" }}
              ></Column>
              <Column
                field="rrqId"
                header="RRQ ID"
                editor={(options) => rrqIdFnc(options)}
                body={handleBodyRrqId}
                sortable
                style={{ justifyContent: "center", maxWidth: "70px" }}
              ></Column>
              <Column
                field="empId"
                header="Emp ID"
                body={handleBodyEmpId}
                sortable
                style={{ justifyContent: "center", maxWidth: "70px" }}
              ></Column>
              <Column
                field="res"
                header="Resource Proposed"
                body={handleBodyRes}
                sortable
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  maxWidth: "90px",
                }}
              ></Column>
              <Column
                field="dept"
                header="Resource BU"
                body={handleBodyResBu}
                sortable
                style={{ justifyContent: "center", maxWidth: "85px" }}
              ></Column>
              <Column
                field="country_name"
                header="Res. Location"
                body={handleBodyCust}
                sortable
                style={{ justifyContent: "center", maxWidth: "80px" }}
              ></Column>
              <Column
                field="date"
                header="Proposed On	"
                body={handleBodyProposedOn}
                sortable
                style={{ justifyContent: "center", maxWidth: "85px" }}
              ></Column>
              <Column
                field="stage"
                header="Stage"
                body={handleBodystage}
                sortable
                style={{ justifyContent: "center", maxWidth: "80px" }}
              ></Column>
              <Column
                field="skill"
                header="Req. Skills"
                body={handleBodyskill}
                sortable
                style={{ justifyContent: "center", maxWidth: "85px" }}
              ></Column>
              <Column
                field="reqCountry"
                header="Req. Location	"
                body={handleBodyReqlocation}
                sortable
                style={{ justifyContent: "center", maxWidth: "90px" }}
              ></Column>
              <Column
                field="sfa_url"
                header="SFA URL"
                body={handleBodyUrl}
                sortable
                style={{ justifyContent: "center", maxWidth: "87px" }}
              ></Column>
              <Column
                field="comments"
                header="Action Item"
                body={handleBodyComment}
                sortable
                style={{ justifyContent: "center", maxWidth: "100px" }}
              ></Column>
            </DataTable>
          </div>
        )}
        {displayState == "edit" && displayTable && (
          <div>
            <div className="fullfillments-ResourceRequest-edit">
              <DataTable
                value={tableData}
                className="primeReactDataTable darkHeader toHead Resource-Request-Editable-Table"
                editMode="row"
                onRowEditComplete={onRowEditComplete}
                showGridlines
                emptyMessage="No Data Found"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                paginator
                rows={25}
                rowsPerPageOptions={[10, 25, 50]}
                // scrollable={true}
                // scrollHeight="400px"
                // scrollWidth="100%"
                editingRows={Object.keys(editingRows).map((index) =>
                  Number(index)
                )}
                dataKey="id"
                header={header}
                stateStorage="session"
                stateKey="dt-state-demo-local"
                filters={filters}
              >
                <Column
                  field="customer"
                  header={
                    <div>
                      <div
                        style={{
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "green",
                          marginRight: "5px",
                        }}
                      ></div>
                      <span>Customer</span>
                      <br />
                      <div
                        style={{
                          display: "inline-block",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "purple",
                          marginRight: "5px",
                        }}
                      ></div>
                      <span>Prospect</span>
                    </div>
                  }
                  editor={(options) => prospect(options)}
                  body={handleBodyCustomerProspect}
                  style={{ justifyContent: "center", maxWidth: "100px" }}
                ></Column>

                <Column
                  field="reqDept"
                  header="Req.BU"
                  editor={(options) => textEditor1(options)}
                  body={handleBodyReq}
                  style={{ justifyContent: "center", maxWidth: "90px" }}
                ></Column>
                <Column
                  field="poc"
                  header="Requested By"
                  editor={(options) => textEditorPOC(options)}
                  body={handleBodyPoc}
                  style={{ justifyContent: "center", maxWidth: "100px" }}
                ></Column>
                <Column
                  field="rrqId"
                  header="RRQ ID"
                  editor={(options) => rrqIdFnc(options)}
                  body={handleBodyRrq}
                  style={{ justifyContent: "center", maxWidth: "75px" }}
                ></Column>
                <Column
                  field="empId"
                  header="Emp ID"
                  editor={(options) => empIdFnc(options)}
                  body={handleBodyEmp}
                  style={{ justifyContent: "center", maxWidth: "70px" }}
                ></Column>
                <Column
                  field="res"
                  header="Resource Proposed"
                  editor={(options) => ResourceProposedFnc(options)}
                  body={handleBodyResourceApproval}
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    maxWidth: "90px",
                  }}
                ></Column>
                <Column
                  field="dept"
                  header="Resource BU"
                  editor={(options) => ResourceBu(options)}
                  body={handleBodyDept}
                  style={{ justifyContent: "center", maxWidth: "90px" }}
                ></Column>
                <Column
                  field="country_name"
                  header="Res. Location"
                  body={handleBodyLocation}
                  editor={(options) => resLocation(options)}
                  style={{ justifyContent: "center", maxWidth: "80px" }}
                ></Column>
                <Column
                  field="date"
                  header="Proposed On"
                  editor={(options) => proposedOnFnc(options)}
                  body={handleBodyDate}
                  style={{ justifyContent: "center", maxWidth: "80px" }}
                ></Column>
                <Column
                  field="stage"
                  header="Stage"
                  editor={(options) => stageFnc(options)}
                  body={handleBodyStage}
                  style={{ justifyContent: "center", maxWidth: "80px" }}
                ></Column>
                <Column
                  field="skill"
                  header="Req. Skills"
                  editor={(options) => reqSkillFnc(options)}
                  body={handleBodySkill}
                  style={{ justifyContent: "center", maxWidth: "90px" }}
                ></Column>
                <Column
                  field="reqCountry"
                  header="Req. Location	"
                  editor={(options) => reqLocationFnc(options)}
                  body={handleBodyReqLocation}
                  style={{ justifyContent: "center", maxWidth: "80px" }}
                ></Column>
                <Column
                  field="sfa_url"
                  header="SFA URL"
                  editor={(options) => textEditor12(options)}
                  body={handleBodySfaUrl}
                  style={{ justifyContent: "center", maxWidth: "90px" }}
                  filterFunction={(value, filter) => {
                    if (!filter) {
                      return true;
                    }
                    const filterOptions = filter.split(" ");
                    return filterOptions.every((option) => {
                      if (
                        option.startsWith &&
                        !value.startsWith(option.startsWith)
                      ) {
                        return false;
                      }

                      if (option.endsWith && !value.endsWith(option.endsWith)) {
                        return false;
                      }

                      if (option.contains && !value.includes(option.contains)) {
                        return false;
                      }

                      return true;
                    });
                  }}
                ></Column>
                <Column
                  field="comments"
                  header="Action Item"
                  editor={(options) => textEditor13(options)}
                  body={handleBodyComments}
                  style={{ justifyContent: "center", maxWidth: "100px" }}
                  filterFunction={(value, filter) => {
                    if (!filter) {
                      return true;
                    }
                    const filterOptions = filter.split(" ");
                    return filterOptions.every((option) => {
                      if (
                        option.startsWith &&
                        !value.startsWith(option.startsWith)
                      ) {
                        return false;
                      }

                      if (option.endsWith && !value.endsWith(option.endsWith)) {
                        return false;
                      }

                      if (option.contains && !value.includes(option.contains)) {
                        return false;
                      }

                      return true;
                    });
                  }}
                ></Column>
                <Column
                  field="Actions"
                  header="Actions"
                  // rowEditor
                  title="Edit selected item"
                  rowEditor={() => {
                    return <div>{"Edit"}</div>;
                  }}
                  style={{ justifyContent: "center", maxWidth: "50px" }}
                ></Column>
              </DataTable>
            </div>
            <div className="d-flex d-grid gap-2 ">
            
                <button
                  className="btn btn-primary "
                  title={"Add new row"}
                  disabled={clicked}
                  onClick={() => {
                    addHandler();
                    setShowValue(false);
                  }}
                >
                  <FaPlus />
                  Add
                </button>

                <button
                  className="btn btn-secondary"
                  disabled={cancelClicked}
                  title={"Cancel row editing"}
                  onClick={() => {
                    Reset();
                  }}
                >
                  <ImCross fontSize={"11px"} /> Cancel
                </button>
              
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default ResourceRequest;
