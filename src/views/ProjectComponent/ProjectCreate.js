import React, { useEffect, useRef, useState } from "react";
import { RiProfileLine } from "react-icons/ri";
import {
  AiFillDelete,
  AiFillWarning,
  AiOutlineDoubleLeft,
} from "react-icons/ai";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { VscSave } from "react-icons/vsc";
import { ImCross } from "react-icons/im";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import axios from "axios";
import { environment } from "../../environments/environment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { Transfer } from "antd";
import moment from "moment/moment";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { useLocation, useNavigate } from "react-router-dom";
import "antd/dist/antd.min.css";
import DatePicker from "react-datepicker";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { BiCheck } from "react-icons/bi";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function ProjectCreate({ urlState }) {
 
  const baseUrl = environment.baseUrl;
  const loggedUserId = localStorage.getItem("resId");
  const [displayRowEdit, setDisplayRowEdit] = useState(1);
  const location = useLocation();
  const [documentRender, setdocumentRender] = useState(null);
  const [date, SetDate] = useState();
  const [endDate, SetEndDate] = useState();
  const [category, setcategory] = useState([]);
  const [department, setDepartment] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [email, setEmail] = useState([]);
  const [name, setName] = useState([]);
  const [division, setDivision] = useState([]);
  const [enguagement, setEnguagement] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [holiday, setHoliday] = useState([]);
  const [week, setWeek] = useState([]);
  const [supervisor, setSupervisor] = useState([]);
  const [resource, setResource] = useState([]);
  const [resource1, setResource1] = useState([]);
  const [resource2, setResource2] = useState([]);
  const [resource3, setResource3] = useState([]);
  const [contract, setContract] = useState([]);
  const [phase, setPhase] = useState([]);
  const [type, setType] = useState([]);
  const [ponumber, setponumber] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [successfulmessage, setSuccessfulmessage] = useState(false);
  const [enguagementType, setEnguagementType] = useState([]);
  const [service, setService] = useState([]);
  const [effort, setEffort] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  // const initialTargetKeys = service
  //   .filter((item) => Number(item.id) > 1)
  //   .map((item) => item.id);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [projectNamesArr, setProjectNamesArr] = useState();
  const [uniqueMessage, setUniqueMessage] = useState(false);
  const [docType, setDocType] = useState({
    docType: "",
  });


  const [routes, setRoutes] = useState([]);
  let currentScreenName = ["Projects", "Create Project"];
  let textContent = "Delivery";
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



  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);
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
  const [mail, setMail] = useState("");
  const ref = useRef([]);

  const initialValue = {
    projectCode: "",
    projectName: "",
    customerId: "",
    holidayCalendarId: "",
    weekCalendarId: "",
    approvingCostCenterId: "",
    typProjectCatId: "",
    typContractTermsCatId: "",
    typSchedulingModeId: "",
    typTimeEntryModeId: "",
    isBillable: "1",
    isOpenForTime: "1",
    isOpenForExpenses: "1",
    plannedStartDt: "",
    plannedEndDt: "",
    isPrjStatus: "0",
    size: "",
    UnitOfMeasure: "",
    isTaskPlanUpload: "0",
    currencyId: "",
    isUsageReq: "1",
    isUtilizationReq: "1",
    preliminaryStartDt: "",
    preliminaryEndDt: "",
    projectHealthId: "498",
    prjHealthUpdatedDate: "",
    projectdivisionId: "0",
    projectPhase: "",
    source: "PPM",
    isDeliverable: "",
    sfEngTypeId: "",
    serviceOfferingId: "",
    businessUnit: "",
    divisionId: "",
    engagementId: "",
    teamLocationId: "",
    effortTypeId: "",
    projectExecMethodId: "",
    value: "",
    loggedId: "",
    deliveryManager: "",
    primaryManger: "",
    projectRequestor: "",
    projectApproval: "",
    facilitator: "",
    pcqaType: "",
    clientEmail: "",
    PoNumber: "",
  };
  const [formData, setFormData] = useState(initialValue);

  const getProjectNamesArray = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectNameandId`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectNamesArr(resp);
      })
      .catch(function (error) {});
  };

  const projectCategoryFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getAllProjectCategorys`,
    }).then((res) => {
      let custom = res.data;
      setcategory(custom);
      effortTypeFnc();
    });
  };

  const departmentFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getAllDepartments`,
    }).then((res) => {
      let custom = res.data;
      setDepartment(custom);
    });
  };

  const customerFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getCustomers`,
    }).then((res) => {
      let custom = res.data;
      setCustomer(custom);
    });
  };
  const emailFnc = (value) => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/ProjectScopeChange/getCustomerEmail?cid=${value}`,
    }).then((res) => {
      let custom = res.data;
      let email = custom[0].customer_emails;
      setEmail(email);
    });
  };

  const divisionFnc = (value) => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/ProjectScopeChange/getDivisionsById?cid=${value}`,
    }).then((res) => {
      let custom = res.data;

      setDivision(custom);
      // enguagementFnc();
    });
  };
  const enguagementFnc = (value) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getEngagementsById?Did=${value}`,
    }).then((res) => {
      let custom = res.data;
      setEnguagement(custom);
    });
  };

  const currencyFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getLkupTypes`,
    }).then((res) => {
      let custom = res.data;
      setCurrency(custom);
    });
  };
  const holidayCalenderFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getHolidayCalendars`,
    }).then((res) => {
      let custom = res.data;
      setHoliday(custom);
    });
  };
  const WeekCalenderFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getWeekCalendars`,
    }).then((res) => {
      let custom = res.data;
      setWeek(custom);
    });
  };

  const getSupervisor = (value) => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/ProjectScopeChange/getSupervisor?UseId=${value}`,
    }).then((res) => {
      let user = res.data.resorseId;
      let cust = res.data.name;
      setSupervisor(cust);
      setFormData((prevProps) => ({
        ...prevProps,
        projectApproval: user,
      }));
    });
  };

  const resourceFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    })
      .then((res) => {
        let manger = res.data;
        setResource(manger);
        setResource1(manger);
        setResource2(manger);
        setResource3(manger);
      })
      .catch((error) => {});
  };
  const navigate = useNavigate();

  const conractTermsFnc = (value) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getContractTeamsById?eid=${value}`,
    })
      .then((res) => {
        let data = res.data;
        setContract(data);
      })
      .catch((error) => {});
  };

  const engagementTypeFnc = (value) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getEngagementTypeById?eid=${value}`,
    })
      .then((res) => {
        let data = res.data;
        setEnguagementType(data);
      })
      .catch((error) => {});
  };

  const ServiceOfferingFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getserviceOfferings`,
    })
      .then((res) => {
        let serv = res.data;
        setService(
          res.data.map((res) => ({
            key: res.id,
            title: res.offering_name,
          }))
        );
      })
      .catch((error) => {});
  };

  const effortTypeFnc = (value) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getEffortTypesById?pcid=${value}`,
    })
      .then((res) => {
        let data = res.data;
        setEffort(data);
      })
      .catch((error) => {});
  };

  const projectPhaseFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getProjectPhases`,
    }).then((res) => {
      let data = res.data;
      setPhase(data);
    });
  };
  const projectTypesFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getProjectTypes`,
    }).then((res) => {
      let data = res.data;
      setType(data);
    });
  };
  const poNumberFnc = (eid) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getPoNumberByEnguagementId?eid=${eid}`,
    }).then((res) => {
      let data = res.data;
      setponumber(data);
    });
  };
  const handleCancel = (e) => {
    let ele = document.getElementsByClassName("cancel");

    GlobalCancel(ref);

    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";

      if (ele[index].classList.contains("reactsearchautocomplete")) {
        ele[index].children[0].children[0].children[0].children[1]?.click();
      }
    }
    setValidationMessage(false);
    setUniqueMessage(false);
  };
  const handleClick = () => {
    let valid = GlobalValidation(ref);

    if (valid) {
      {
        setSuccessfulmessage(false);
        setValidationMessage(true);
      }
      return;
    }
    let someDataa = projectNamesArr.some((d) => d.name == formData.projectName);

    if (someDataa) {
      let ele = document.getElementsByClassName("unique");
      for (let index = 0; index < ele.length; index++) {
        ele[index].classList.add("error-block");
      }

      setUniqueMessage(true);
      setValidationMessage(false);

      return;
    }

    axios
      .postForm(
        baseUrl +
          `/ProjectMS/ProjectScopeChange/projectCreate?ObjectTypeId=3&loggedUserId=512&commitMessage=createFolder`,
        {
          file: selectedFile,
          model: JSON.stringify({
            projectCode: formData.projectCode,
            projectName: formData.projectName,
            customerId: formData.customerId,
            holidayCalendarId: formData.holidayCalendarId,
            weekCalendarId: formData.weekCalendarId,
            approvingCostCenterId: enguagementType[0]?.id,
            typProjectCatId: formData.typProjectCatId,
            typContractTermsCatId: contract[0]?.id,
            typSchedulingModeId: formData.typSchedulingModeId,
            typTimeEntryModeId: formData.typTimeEntryModeId,
            isBillable: formData.isBillable,
            isOpenForTime: formData.isOpenForTime,
            isOpenForExpenses: formData.isOpenForExpenses,
            plannedStartDt: formData.plannedStartDt,
            plannedEndDt: formData.plannedEndDt,
            isPrjStatus: formData.isPrjStatus,
            size: formData.size,
            UnitOfMeasure: formData.UnitOfMeasure,
            isTaskPlanUpload: formData.isTaskPlanUpload,
            currencyId: formData.currencyId,
            isUsageReq: formData.isUsageReq,
            isUtilizationReq: formData.isUtilizationReq,
            preliminaryStartDt: formData.preliminaryStartDt,
            preliminaryEndDt: formData.preliminaryEndDt,
            projectHealthId: formData.projectHealthId,
            prjHealthUpdatedDate: formData.prjHealthUpdatedDate,
            projectdivisionId: formData.projectdivisionId,
            projectPhase: formData.projectPhase,
            source: formData.source,
            isDeliverable: formData.isDeliverable,
            sfEngTypeId: formData.sfEngTypeId,
            serviceOfferingId: formData.serviceOfferingId,
            businessUnit: formData.businessUnit,
            divisionId: formData.divisionId,
            engagementId: formData.engagementId,
            teamLocationId: formData.teamLocationId,
            effortTypeId: formData.effortTypeId,
            projectExecMethodId: formData.projectExecMethodId,
            value: formData.value,
            loggedId: loggedUserId,
            deliveryManager: formData.deliveryManager,
            primaryManger: formData.primaryManger,
            projectRequestor: formData.projectRequestor,
            projectApproval: formData.projectApproval,
            facilitator: formData.facilitator, //need to change
            pcqaType: formData.pcqaType,
            clientEmail: email,
            PoNumber: formData.PoNumber,
            docType: docType.docType,
          }),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        const data = response.data;
        setValidationMessage(false);
        setSuccessfulmessage(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          setSuccessfulmessage(false);
          navigate(`/project/Overview/:${data.projectId.id}`);
          // window.location.reload();
        }, 1000);
        // navigate(`/project/Overview/:${data.projectId.id}`);
      });
  };
  useEffect(() => {
    projectCategoryFnc();
    departmentFnc();
    customerFnc();
    //divisionFnc();
    holidayCalenderFnc();
    WeekCalenderFnc();
    resourceFnc();
    currencyFnc();
    projectPhaseFnc();
    projectTypesFnc();
    //conractTermsFnc();
    ServiceOfferingFnc();
    getProjectNamesArray();
    // effortTypeFnc();
  }, []);
  const DisplayFnc = () => {
    setDisplayRowEdit((prev) => prev + 1);
  };
  const DeleteFnc = () => {
    for (let i = 0; i < displayRowEdit; i++) {}
  };

  const onFileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    displayDocumentRender();
  }, [displayRowEdit]);

  const displayDocumentRender = () => {
    let data = [];

    for (let i = 0; i < displayRowEdit; i++) {
      data.push(i);
    }
    setdocumentRender(() => {
      return data.map((d) => {
        return (
          <div className="group-content row">
            <div className="form-group col-md-4 mb-2">
              <label htmlFor="name">Contract Document Type </label>
              <select
                className="cancel"
                id="docType"
                onChange={(e) => {
                  const { value, id } = e.target;
                  setDocType({ ...docType, [id]: value });
                }}
              >
                <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                <option value={"386"}>Email</option>
                <option value={"387"}>Others</option>
                <option value={"385"}>PO</option>
                <option value={"384"}>SOW</option>
              </select>
            </div>
            <div className="form-group col-md-4 mb-2">
              <label htmlFor="name">Upload Contract Document </label>
              {/* <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Project Code"
                required
              /> */}
              <input
                className="fileUpload form-control cancel"
                type="file"
                name="file"
                id="file"
                onChange={onFileChangeHandler}
                // accept=".jpg,.jpeg,.xlsx,.pdf,.docx,.txt"
              />
            </div>
            <div
              className="form-group col-md-4 mb-2"
              style={{ marginTop: "17px", fontSize: "20px" }}
            >
              <AiFillDelete
                onClick={() => setDisplayRowEdit((prev) => prev - 1)}
              />
            </div>
          </div>
        );
      });
    });
  };

  const getCode = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, projectCode: value });
  };
  const getclientEmail = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, clientEmail: value });
  };
  const getCode1 = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, value: value });
  };
  const getCode2 = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, size: value });
  };
  const getName = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, projectName: value });
  };
  const getProjectId = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, [id]: value });
    effortTypeFnc(value);
  };
  const buChange = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, [id]: value });
    // effortTypeFnc(value);
  };
  const getCustomerId = (e) => {
    const { value, id } = e.target;

    setFormData({ ...formData, [id]: value });
    //setFormData({ ...formData, ["divisionId"]: "" });
    setDivision([]);
    divisionFnc(value);
    emailFnc(value);
  };
  const getCustomer = (e) => {
    const { value, id } = e.target;

    setFormData({ ...formData, [id]: value });
    // setFormData({ ...formData, ["divisionId"]: "" });
    setEnguagement([]);
    enguagementFnc(value);
  };
  const getDivisionId = (e) => {
    const { value, id } = e.target;

    setFormData({ ...formData, [id]: value });
    //setFormData({ ...formData, ["divisionId"]: "" });
    engagementTypeFnc(value);
    conractTermsFnc(value);
    poNumberFnc(value);
  };
  const getUnitsOfMeasureId = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const getcurrencyId = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const getEffortId = (e) => {
    const { value, id } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleClearDeliveryManager = (edit) => {
    setFormData((prevProps) => ({ ...prevProps, deliveryManager: "" }));
  };
  const handleClearPrimaryManager = (edit) => {
    setFormData((prevProps) => ({ ...prevProps, primaryManger: "" }));
  };
  const handleClearProjectRequester = (edit) => {
    setFormData((prevProps) => ({ ...prevProps, projectRequestor: "" }));
  };
  const handleClearProjectApprover = (edit) => {
    setFormData((prevProps) => ({ ...prevProps, projectApproval: "" }));
  };

  return (
    <div>
      <>
        {successfulmessage ? (
          <div className="statusMsg success">
            {" "}
            <BiCheck /> Project Created Successfully{" "}
          </div>
        ) : (
          ""
        )}
        {validationMessage ? (
          <div className="statusMsg error cancel">
            {" "}
            <AiFillWarning /> Please select the valid values for highlighted
            fields{" "}
          </div>
        ) : (
          ""
        )}
        {uniqueMessage ? (
          <div className="statusMsg error">
            {" "}
            <AiFillWarning />
            Please select the valid values for highlighted fields
          </div>
        ) : (
          ""
        )}
      </>
      {/* <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Create Project</h2>
        </div>
        <div className="childThree"></div>
      </div> */}
      {/* <ScreenBreadcrumbs
        routes={routes}
        currentScreenName={currentScreenName}
      /> */}

      {/* <div className="helpBtn" style={{ float: "right", paddingTop: "5px" }}>
        <GlobalHelp pdfname={HelpPDFName} name={HelpHeader} />
      </div> */}
      <div className="group mb-5 customCard">
        <h2>Project Details</h2>
        <div className="group-content row">
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Project Code <span className="error-text unique">&nbsp;*</span>
            </label>
            <div
              className="textfield"
              ref={(ele) => {
                ref.current[0] = ele;
              }}
            >
              <input
                type="text"
                className="unique cancel"
                id="projectCode"
                name="projectCode"
                placeholder="Project Code"
                onKeyDown={(event) => {
                  if (
                    event.code === "Space" &&
                    event.target.value.trim() === ""
                  ) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/^\s+/g, ""); // Remove leading spaces
                  e.target.value = value; // Update the input value
                  getCode(e);
                }}
              />
            </div>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Project Name<span className="error-text unique">&nbsp;*</span>{" "}
            </label>
            <div
              className="textfield"
              ref={(ele) => {
                ref.current[1] = ele;
              }}
            >
              <input
                type="text"
                className=" unique cancel"
                id="projectName"
                placeholder="Project Name"
                required
                onKeyDown={(event) => {
                  if (
                    event.code === "Space" &&
                    event.target.value.trim() === ""
                  ) {
                    event.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/^\s+/g, ""); // Remove spaces
                  e.target.value = value; // Update the input value
                  getName(e);
                }}
              />
            </div>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="typProjectCatId">
              Project Category <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel  "
              id="typProjectCatId"
              onChange={(e) => {
                getProjectId(e);
              }}
              ref={(ele) => {
                ref.current[2] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {category.map((Item) => (
                <option value={Item.id}> {Item.project_category_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Business Unit <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="businessUnit"
              onChange={(e) => {
                buChange(e);
              }}
              ref={(ele) => {
                ref.current[3] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {department.map((Item) => (
                <option value={Item.id}> {Item.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Customer <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="customerId"
              onChange={(e) => getCustomerId(e)}
              ref={(ele) => {
                ref.current[4] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {customer.map((Item) => (
                <option value={Item.id}> {Item.full_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Division <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="divisionId"
              onChange={(e) => getCustomer(e)}
              ref={(ele) => {
                ref.current[5] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {division.map((Item) => (
                <option value={Item.id}> {Item.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Engagement Name <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="engagementId"
              onChange={(e) => getDivisionId(e)}
              ref={(ele) => {
                ref.current[6] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {enguagement.map((Item) => (
                <option value={Item.id}> {Item.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Engagement Type <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel disableField"
              id="approvingCostCenterId"
              disabled
              onChange={(e) => getcurrencyId(e)}
              ref={(ele) => {
                ref.current[7] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {enguagementType.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.lkup_name == enguagementType[0]?.lkup_name
                      ? true
                      : false
                  }
                >
                  {" "}
                  {Item.lkup_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Contract Terms <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel disableField"
              id="typContractTermsCatId"
              disabled
              onChange={(e) => getcurrencyId(e)}
              ref={(ele) => {
                ref.current[8] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {contract.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.lkup_name == contract[0]?.lkup_name ? true : false
                  }
                >
                  {" "}
                  {Item.lkup_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">Effort Type</label>
            <select
              className="text cancel"
              id="effortTypeId"
              onChange={(e) => {
                getEffortId(e);
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {effort.map((Item) => (
                <option value={Item.id}> {Item.effort_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Execution Methodology <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="projectExecMethodId"
              onChange={(e) => {
                getEffortId(e);
              }}
              ref={(ele) => {
                ref.current[9] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option value={365}>Agile</option>
              <option value={366}>Waterfall</option>
              <option value={367}>Iterative</option>
              <option value={368}>Other</option>
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Project Phase <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="projectPhase"
              onChange={(e) => getcurrencyId(e)}
              ref={(ele) => {
                ref.current[10] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {phase.map((Item) => (
                <option value={Item.id}> {Item.lkup_name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4 ">
            <div className="row">
              <div className=" form-group col-md-6">
                <label htmlFor="name">Project Scope</label>
                <input
                  type="text"
                  className="text cancel"
                  id="value"
                  defaultValue={"0"}
                  required
                  onChange={(e) => {
                    const input = e.target.value;
                    const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                    if (!regex.test(input)) {
                      e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                    }

                    getCode1(e);
                  }}
                />
              </div>
              <div className=" form-group col-md-6">
                <label htmlFor="name">Unit of Measurement</label>
                <select
                  className="text cancel"
                  id="UnitOfMeasure"
                  onChange={(e) => getUnitsOfMeasureId(e)}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value={243}>FP</option>
                  <option value={244}>UCP</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Currency <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="currencyId"
              onChange={(e) => getcurrencyId(e)}
              ref={(ele) => {
                ref.current[11] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {currency.map((Item) => (
                <option value={Item.id}> {Item.description}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">Revenue</label>
            <input
              type="text"
              className="text cancel"
              id="size"
              defaultValue={"0.00"}
              required
              onChange={(e) => {
                const input = e.target.value;
                const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                if (!regex.test(input)) {
                  e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                }

                getCode2(e);
              }}
            />
          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="name">
                  Deliverables <span className="error-text">&nbsp;*</span>
                </label>
                <select
                  className="text cancel"
                  id="isDeliverable"
                  onChange={(e) => getcurrencyId(e)}
                  ref={(ele) => {
                    ref.current[12] = ele;
                  }}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value={"Yes"}>Yes</option>
                  <option value={"No"}>No</option>
                </select>
              </div>
              <div className="form-group col-md-6 ">
                <label htmlFor="name">
                  Team Location <span className="error-text">&nbsp;*</span>
                </label>
                <select
                  className="text cancel"
                  id="teamLocationId"
                  onChange={(e) => getcurrencyId(e)}
                  ref={(ele) => {
                    ref.current[13] = ele;
                  }}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value={364}>Blended Shore</option>
                  <option value={361}>Client Site</option>
                  <option value={363}>Off Shore</option>
                  <option value={362}>Onsite</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="row">
              <div className="form-group col-md-6 mb-2">
                <label htmlFor="name">PO Number</label>
                <select
                  className="cancel"
                  id="PoNumber"
                  onChange={(e) => getcurrencyId(e)}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  {ponumber.map((Item) => (
                    <option value={Item.id}> {Item.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-6 mb-2">
                <label htmlFor="name">SF Engagement Type</label>
                <select
                  className="text cancel"
                  id="sfEngTypeId"
                  onChange={(e) => getcurrencyId(e)}
                >
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value={1357}>New Persuit</option>
                  <option value={1358}>Stream</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="group mb-5 customCard">
        <h2>Schedule</h2>
        <div className="group-content row">
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Preliminary Start Date <span className="error-text">&nbsp;*</span>
            </label>
            <div
              className="datepicker cancel"
              //id="plannedStartDt"
              ref={(ele) => {
                ref.current[14] = ele;
              }}
            >
              <DatePicker
                id="plannedStartDt"
                className="cancel"
                selected={date}
                dateFormat="dd-MMM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onChange={(e) => {
                  SetDate(e);
                  setFormData((prev) => ({
                    ...prev,
                    ["plannedStartDt"]: moment(e).format("yyyy-MM-DD"),
                  }));
                  // setMonth(e);
                }}
                placeholderText="Preliminary Start Date"
                //disabled={disable}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
              />
            </div>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Preliminary End Date <span className="error-text">&nbsp;*</span>{" "}
            </label>
            <div
              className="datepicker cancel"
              ref={(ele) => {
                ref.current[15] = ele;
              }}
              // id="plannedEndDt"
            >
              <DatePicker
                className="cancel "
                id="plannedEndDt"
                selected={endDate}
                dateFormat="dd-MMM-yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                onChange={(e) => {
                  SetEndDate(e);
                  setFormData((prev) => ({
                    ...prev,
                    ["plannedEndDt"]: moment(e).format("yyyy-MM-DD"),
                  }));
                  // setMonth(e);
                }}
                minDate={date}
                placeholderText="Preliminary End Date"
                //disabled={disable}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
              />
            </div>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Time Entry Mode <span className="error-text">&nbsp;*</span>{" "}
            </label>
            <select
              className="text cancel"
              id="typTimeEntryModeId"
              onChange={(e) => getcurrencyId(e)}
              ref={(ele) => {
                ref.current[16] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option value={19}>Project Level</option>
              <option value={20}>Task Level</option>
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              Scheduling Mode <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="typSchedulingModeId"
              onChange={(e) => getcurrencyId(e)}
              ref={(ele) => {
                ref.current[17] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option value={30}>Days</option>
              <option value={31}>Hours</option>
              <option value={29}>Weeks</option>
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              {" "}
              Holiday Calendar <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="holidayCalendarId"
              onChange={(e) => getcurrencyId(e)}
              ref={(ele) => {
                ref.current[18] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {holiday.map((Item) => (
                <option value={Item.id}> {Item.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="name">
              {" "}
              Week Calendar <span className="error-text">&nbsp;*</span>
            </label>
            <select
              className="text cancel"
              id="weekCalendarId"
              onChange={(e) => getcurrencyId(e)}
              ref={(ele) => {
                ref.current[19] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {week.map((Item) => (
                <option value={Item.id}> {Item.calendar_name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="group mb-5 customCard">
            <h2>Key Contact </h2>
            <div className="group-content row">
              <div className=" col-md-12 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="name">
                    Delivery Manager <span className="error-text">&nbsp;*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    {/* <div className="autoComplete-container">
                      <RiskAutoComplete
                        resource={resource}
                        // setState={setState}
                        resourceFnc={resourceFnc}
                        setFormData={setFormData}
                        onChange={(e) => handleChange(e)}
                        //editedData={editedData}
                      />
                    </div> */}
                    <div
                      className="autoComplete-container react  cancel  reactsearchautocomplete"
                      ref={(ele) => {
                        ref.current[20] = ele;
                      }}
                    >
                      <ReactSearchAutocomplete
                        items={resource}
                        type="Text"
                        name="resource"
                        id="deliveryManager"
                        className="err text cancel nochange"
                        fuseOptions={{ keys: ["id", "name"] }}
                        resultStringKeyName="name"
                        placeholder="Type minimum 3 characters to get the list"
                        resource={resource}
                        onClear={handleClearDeliveryManager}
                        resourceFnc={resourceFnc}
                        onSelect={(e) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            deliveryManager: e.id,
                          }));
                        }}
                        showIcon={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-12 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="name">
                    Primary Manager <span className="error-text">&nbsp;*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <div
                      className="autoComplete-container react cancel  reactsearchautocomplete"
                      ref={(ele) => {
                        ref.current[21] = ele;
                      }}
                    >
                      <ReactSearchAutocomplete
                        items={resource}
                        type="Text"
                        name="resource"
                        id="primaryManger"
                        className="err text cancel nochange"
                        fuseOptions={{ keys: ["id", "name"] }}
                        resultStringKeyName="name"
                        placeholder="Type minimum 3 characters to get the list"
                        resource1={resource1}
                        onClear={handleClearPrimaryManager}
                        resourceFnc={resourceFnc}
                        onSelect={(e) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            primaryManger: e.id,
                            projectRequestor: e.id,
                          }));
                          setName((prevProps) => ({
                            ...prevProps,
                            projectRequestor: e.name,
                          }));
                          getSupervisor(e.id);
                        }}
                        showIcon={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-12 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="name">
                    Project Requestor{" "}
                    <span className="error-text">&nbsp;*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <div
                      className="autoComplete-container cancel  reactsearchautocomplete"
                      ref={(ele) => {
                        ref.current[22] = ele;
                      }}
                    >
                      <ReactSearchAutocomplete
                        items={resource2}
                        type="Text"
                        name="resource"
                        id="projectRequestor"
                        className="err text cancel"
                        fuseOptions={{ keys: ["id", "name"] }}
                        resultStringKeyName="name"
                        inputSearchString={name.projectRequestor}
                        resource2={resource2}
                        onClear={handleClearProjectRequester}
                        resourceFnc={resourceFnc}
                        onSelect={(e) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            projectRequestor: e.id,
                          }));
                        }}
                        showIcon={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-12 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="name">
                    Project Approver <span className="error-text">&nbsp;*</span>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-6">
                    <div
                      className="autoComplete-container cancel  reactsearchautocomplete "
                      id="auto"
                      ref={(ele) => {
                        ref.current[23] = ele;
                      }}
                    >
                      <ReactSearchAutocomplete
                        items={resource3}
                        type="Text"
                        name="resource"
                        id="projectApproval"
                        className="err "
                        fuseOptions={{ keys: ["id", "name"] }}
                        resultStringKeyName="name"
                        inputSearchString={supervisor}
                        resource={resource}
                        onClear={handleClearProjectApprover}
                        resourceFnc={resource3}
                        onSelect={(e) => {
                          setFormData((prevProps) => ({
                            ...prevProps,
                            projectApproval: e.id,
                          }));
                        }}
                        showIcon={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="group mb-0 customCard">
            <h2> Services Offered</h2>
            <div className="group-content row">
              {/* <div class="col-5">
                                                                <select name="myselect" id="myselect" size="4" multiple>
                                                                        <option>1</option>
                                                                        <option>2</option>
                                                                        <option>3</option>
                                                                        <option>4</option>
                                                                </select>

                                                        </div>
                                                        <div className="col-2 my-3">
                                                                <button className="col-9 btn btn-secondary mb-1" ><AiOutlineDoubleLeft /></button>
                                                                <button className="col-9 btn btn-secondary"><AiOutlineDoubleRight /></button></div>
                                                        <div class="col-5">

                                                                <select name="myselect" id="myselect" size="4" multiple>
                                                                        <option>1</option>
                                                                        <option>2</option>
                                                                        <option>3</option>
                                                                        <option>4</option>
                                                                </select>

                                                        </div> */}
              <div
                className="transfer"
                ref={(ele) => {
                  ref.current[24] = ele;
                }}
              >
                {/* <Transfer
                  listStyle={{ width: 180, height: 150 }}
                  dataSource={service}
                  targetKeys={targetKeys}
                  selectedKeys={selectedKeys}
                  onChange={(nextTargetKeys) => {
                    setTargetKeys(nextTargetKeys);
                    let filteredCountry = [];
                    nextTargetKeys.forEach((d) => {
                      // //console.log(d.value)
                      filteredCountry.push(d);
                      //console.log(d, "line no-----");
                    });
                    setFormData((prevVal) => ({
                      ...prevVal,
                      ["serviceOfferingId"]: filteredCountry.toString(),
                    }));
                  }}
                  onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
                    setSelectedKeys([
                      ...sourceSelectedKeys,
                      ...targetSelectedKeys,
                    ]);
                  }}
                  render={(item) => item.title}
                /> */}
                {service.length === 0 ? (
                  <div>No data available.</div>
                ) : (
                  <Transfer
                    listStyle={{ width: 180, height: 150 }}
                    dataSource={service}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={(nextTargetKeys) => {
                      setTargetKeys(nextTargetKeys);
                      let filteredCountry = [];
                      nextTargetKeys.forEach((d) => {
                        filteredCountry.push(d);
                      });
                      setFormData((prevVal) => ({
                        ...prevVal,
                        ["serviceOfferingId"]: filteredCountry.toString(),
                      }));
                    }}
                    onSelectChange={(
                      sourceSelectedKeys,
                      targetSelectedKeys
                    ) => {
                      setSelectedKeys([
                        ...sourceSelectedKeys,
                        ...targetSelectedKeys,
                      ]);
                    }}
                    render={(item) => item.title}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {contract[0]?.id == "25" ||
        contract[0]?.id == "26" ||
        contract[0]?.id == "27" ||
        contract[0]?.id == "28" ||
        contract[0]?.id == "606" ||
        contract[0]?.id == "752" ? (
          <div className="col-md-4">
            <div className="group mb-5 customCard">
              <h2>
                <RiProfileLine /> PCQA
              </h2>
              <div className="group-content row">
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5 " htmlFor="deliveryManager ">
                      Facilitator
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6 ">
                      <div
                        className="autoComplete-container"
                        ref={(ele) => {
                          if (
                            contract[0]?.id == "25" ||
                            contract[0]?.id == "26" ||
                            contract[0]?.id == "27" ||
                            contract[0]?.id == "28" ||
                            contract[0]?.id == "606" ||
                            contract[0]?.id == "752"
                          ) {
                            ref.current[24] = ele;
                          }
                        }}
                      >
                        <ReactSearchAutocomplete
                          items={resource2}
                          type="Text"
                          name="resource"
                          id="facilitator"
                          className="err cancel"
                          fuseOptions={{ keys: ["id", "name"] }}
                          resultStringKeyName="name"
                          placeholder="Type minimum 3 characters to get the list"
                          resource2={resource2}
                          resourceFnc={resourceFnc}
                          onSelect={(e) => {
                            setFormData((prevProps) => ({
                              ...prevProps,
                              facilitator: e.id,
                            }));
                          }}
                          showIcon={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5 " htmlFor="primaryManager  ">
                      Client Email
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control disableField"
                        id="clientEmail "
                        required
                        placeholder="Client Email"
                        Value={(() => {
                          const defaultValue = email === "" ? " " : email;
                          return defaultValue;
                        })()}
                        onChange={(e) => {
                          getclientEmail(e);
                          setMail(e);
                        }}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5 " htmlFor="projectRequestor ">
                      Project Type <span className="error-text">&nbsp;*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6 ">
                      <select
                        className="text cancel"
                        id="pcqaType"
                        onChange={(e) => getcurrencyId(e)}
                        ref={(ele) => {
                          ref.current[25] = ele;
                        }}
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        {type.map((Item) => (
                          <option value={Item.id}> {Item.lkup_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="group mb-5 customCard">
        <h2>Documents </h2>
        {/* {displayRowEdit.map((d) => (
          <li>{d}</li>
        ))} */}
        {documentRender}
        {/* {displayRowEdit.length > 0
          ? displayRowEdit.map((d) => {
              return (
                <div className="group-content row">
                  <div className="form-group col-md-4 mb-2">
                    <label htmlFor="name">Contract Document Type </label>
                    <select className="" id="divison">
                      <option value={1}>A</option>
                      <option value={2}>B</option>
                      <option value={3}>C</option>
                    </select>
                  </div>
                  <div className="form-group col-md-4 mb-2">
                    <label htmlFor="name">Upload Contract Document </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Project Code "
                      required
                    />
                  </div>
                </div>
              );
            })
          : ""} */}
        <div className="col-md-12 col-sm-12 col-xs-12 my-2 btn-container center">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              DisplayFnc();
            }}
          >
            {" "}
            <MdOutlinePlaylistAdd />
            Add{" "}
          </button>
        </div>
      </div>
      <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
        <button
          className="btn btn-primary"
          type="submit"
          onClick={() => handleClick()}
        >
          <VscSave /> Save
        </button>
        <button
          className="btn btn-secondary"
          // onClick={() => {
          //   handleCancel();
          //   handleRefresh();
          // }}
          onClick={() => {
            navigate(`/project/create`, {
              state: { btnState: "create" },
            });
            window.location.reload();
          }}
          // onClick={refreshAndNavigate}
        >
          <ImCross /> Cancel
        </button>
      </div>
    </div>
  );
}

export default ProjectCreate;
