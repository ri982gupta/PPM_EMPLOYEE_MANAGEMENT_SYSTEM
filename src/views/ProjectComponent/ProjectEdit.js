import React, { useRef, useState } from "react";
import { RiProfileLine } from "react-icons/ri";
import { BiCheck, BiLineChart } from "react-icons/bi";
import { VscSave } from "react-icons/vsc";
import { ImCross } from "react-icons/im";
import {
  AiFillDelete,
  AiFillWarning,
  AiOutlineDoubleLeft,
} from "react-icons/ai";
import { AiOutlineDoubleRight } from "react-icons/ai";
import { useEffect } from "react";
import axios from "axios";
import { environment } from "../../environments/environment";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import moment from "moment";
import { Transfer } from "antd";
import "antd/dist/antd.min.css";
import "./ProjectEdit.scss";

import DatePicker from "react-datepicker";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { useLocation, useNavigate } from "react-router-dom";
import { CModal } from "@coreui/react";
import { CModalBody } from "@coreui/react";
import { CModalHeader } from "@coreui/react";
import Draggable from "react-draggable";
import { CCollapse, CModalTitle } from "@coreui/react";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaSave,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa";
import { SpeakerNotesOffRounded } from "@material-ui/icons";
import Loader from "../Loader/Loader";
import Project from "./Project";
const StagePopUp = (props) => {
  const {
    popup,
    setPopup,
    setEditedData,
    handleDateUpdate,
    handleNo,

    popUpValue,
    setStgValue,
    stgValue,
  } = props;

  const baseUrl = environment.baseUrl;

  return (
    <div>
      <Draggable>
        <CModal
          visible={popup}
          size="xs"
          className="ui-dialog"
          onClose={() => setPopup(false)}
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className=""></span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {popUpValue == 2 ? (
              <h6>
                All the Allocations and Assignments of the resources from the
                date of completion till Project completion date, will be
                deleted. Do you want to continue?
              </h6>
            ) : (
              <h6>
                Do you want to delete all allocations and Assignments of the
                resources from today? Selecting NO will update project stage
                leaving Allocations and Assignments as-is.
              </h6>
            )}
            <div className="btn-container center my-2">
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleDateUpdate();
                  setPopup(false);
                  setStgValue(popUpValue);
                }}
              >
                <FaCheckCircle />
                Yes
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (popUpValue === 2) {
                    setPopup(false);
                  } else {
                    handleNo();
                    setPopup(false);
                    setStgValue(popUpValue);
                  }
                }}
              >
                <FaTimesCircle /> No
              </button>

              {popUpValue == 2 ? (
                ""
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setPopup(false);
                  }}
                >
                  <FaTimes /> Cancel{" "}
                </button>
              )}
            </div>
          </CModalBody>
        </CModal>
      </Draggable>
    </div>
  );
};

function ProjectEdit({
  targetDisplayName,
  btnState,
  setbtnState,
  urlState,

  grp1Items,
  grp2Items,
  grp3Items,
  grp4Items,
  grp6Items,
}) {
  const location = useLocation();
  let props1 = location?.state;
  // const { projectId } = props;
  let projecteditUrl = window.location.href.split(":");
  let projectId = projecteditUrl[projecteditUrl.length - 1];

  const loggedUserId = localStorage.getItem("resId");

  const baseUrl = environment.baseUrl;
  const [category, setcategory] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [week, setWeek] = useState([]);
  const [holiday, setHoliday] = useState([]);
  const [phase, setPhase] = useState([]);
  const [projectData, setProjectData] = useState([]);

  const [type, setType] = useState([]);
  const [resource, setResource] = useState([]);
  const [division, setDivision] = useState([]);
  const [contract, setContract] = useState([]);
  const [enguagementType, setEnguagementType] = useState([]);
  const [effort, setEffort] = useState([]);
  const [riskFactor, setRiskFactor] = useState([]);

  const [prjName, setPrjName] = useState([]);
  const [enguagement, setEnguagement] = useState([]);
  const [efforts, setEfforts] = useState({
    priliminaryEfforts: "",
    contractedEfforts: "",
  });

  const [grossMargin, setGrossMargin] = useState([]);
  const [gM, setGM] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [revenue, setRevenue] = useState({
    revenue: "",
    contractedRevenue: "",
  });

  const [directCost, setDirectCost] = useState({
    priliminaryRDC: "",
    ContractRDC: "",
  });
  const [directSpareCost, setDirectSpareCost] = useState([]);
  const [otherCost, setOtherCost] = useState({
    priliminaryOtherCost: "",
    contarctOtherCost: "",
  });

  const [resultPreGrossMargin, setresultPreGrossMargin] = useState(0);
  const [resultGM, setResultGM] = useState(0);
  const [ponumber, setPonumber] = useState([]);
  const [contractResult, setContractResult] = useState(0);
  const [contractGMResult, setContractGMResult] = useState(0);
  const [service, setService] = useState([]);
  const [plnFTE, SetPlnFTE] = useState([]);
  const [conFTE, SetConFTE] = useState([]);
  const [projectMngr, setProjectMngr] = useState([]);
  const [deliveryMngr, setDeliveryMngr] = useState([]);
  const [projectApprover, setProjectApprover] = useState([]);
  const [projectRequester, setProjectRequester] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [businessUnit, setBusinessUnit] = useState([]);
  let container = document.createElement("div");
  var radioButton = document.getElementById("yes");
  const [conStartDate, SetConStartDate] = useState("");
  const [conEndDate, SetConEndDate] = useState("");

  const [planStartDate, SetPlanStartDate] = useState();
  const [planEndDate, SetPlanEndDate] = useState();
  const [actStartDate, SetActStartDate] = useState();
  const [validationMessage, setValidationMessage] = useState(false);
  const [successfulmessage, setSuccessfulmessage] = useState(false);
  const [currency, setCurrency] = useState([]);
  const [conDateDiff, setConDateDiff] = useState("");
  const [plnDateDiff, setPlnDateDiff] = useState("");
  const [actEndDate, SetActEndDate] = useState("");
  const [popup, setPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef([]);
  const [popUpValue, setPopUpValue] = useState("");
  const [stgValue, setStgValue] = useState("");
  const abortController = useRef(null);

  const getProjectOverviewData = () => {
    setProjectData([]);
    abortController.current = new AbortController();
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        const resp = response.data;
        setOpen(false);
        setTimeout(() => {
          setOpen(false);
          setProjectData(resp);
        }, 1000);

        effortTypeFnc(resp[0].projCat);
        divisionFnc(resp[0].customer_id);
        setStgValue(resp[0].is_prj_status);
        enguagementFnc(resp[0].division_id);
        conractTermsFnc(resp[0].engagementId);
        engagementTypeFnc(resp[0].engagementId);
        poNumberFnc(resp[0].engagementId);
        getKpitableData(resp[0].projectName);
        setTimeout(() => {
          document.body.click();
        }, 2000);
      })
      .catch(function (response) {
        console.log(response);
      });
  };
  useEffect(() => {
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
  const projectCategoryFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getAllProjectCategorys`,
    }).then((res) => {
      let custom = res.data;
      setcategory(custom);
    });
  };
  const getBusinessUnit = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getBusinessUnit?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setBusinessUnit(resp);
      })
      .catch(function (response) {
        console.log(response);
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
  const WeekCalenderFnc = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getWeekCalendars`,
    }).then((res) => {
      let custom = res.data;
      setWeek(custom);
    });
  };
  const divisionFnc = (custId) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getDivisionsById?cid=${custId}`,
    }).then((res) => {
      let custom = res.data;
      setDivision(custom);
    });
  };
  const enguagementFnc = (divisionId) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getEngagementsById?Did=${divisionId}`,
    }).then((res) => {
      let custom = res.data;
      setEnguagement(custom);
    });
  };
  const engagementTypeFnc = (enguagementId) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getEngagementTypeById?eid=${enguagementId}`,
    })
      .then((res) => {
        let data = res.data;
        setEnguagementType(data);
      })
      .catch((error) => {
        console.log("error :" + error);
      });
  };
  const conractTermsFnc = (enguagementId) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getContractTeamsById?eid=${enguagementId}`,
    })
      .then((res) => {
        let data = res.data;
        setContract(data);
      })
      .catch((error) => {
        console.log("error :" + error);
      });
  };

  const getProjectMngr = () => {
    setProjectMngr([]);
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectManager?objectid=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectMngr(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getProjectApprover = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/Audit/getProjectApprover?objectid=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectApprover(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };
  const getProjectRequester = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/Audit/getProjectRequester?objectid=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectRequester(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };
  const getDeliveryMngr = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/Audit/getDeliveryManager?objectid=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setDeliveryMngr(resp);
      })
      .catch(function (response) {
        console.log(response);
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
  const projectPhaseFnc = () => {
    setPhase([]);
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getProjectPhases`,
    }).then((res) => {
      let data = res.data;
      setPhase(data);
    });
  };
  const projectTypesFnc = () => {
    setType([]);
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/getProjectTypes`,
    }).then((res) => {
      let data = res.data;
      setType(data);
    });
  };
  const getOtherCost = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getOtherCost?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        if (resp.length > 0) {
          setOtherCost({
            priliminaryOtherCost: resp[0].value,
            contarctOtherCost: resp[1].value,
          });
        }
      })
      .catch(function (response) {
        console.log(response);
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
      })
      .catch((error) => {
        console.log("error :" + error);
      });
  };

  const getRiskFactor = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/getRiskFactorCharacteristics?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setRiskFactor(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getProjectName = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getProjectName?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setPrjName(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getRevenue = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getRevenue?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        if (resp.length > 0) {
          setRevenue({
            revenue: resp[0].value || "",
            contractedRevenue: resp[1]?.value || "",
          });
        }
        let spare = {
          revenue: resp[0].value,
          contractedRevenue: resp[1].value,
        };
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getKpitableData = (name) => {
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/Audit/getProjectKpidata`,
      data: {
        businessUnitId: null,
        custName: null,
        prjName: name,
        prjId: projectId,
        prjComplexity: null,
        prjStage: null,
        source: null,
        gm: null,
      },
    })
      .then((res) => {
        let data = res.data;
        setKpiData(res.data);
      })
      .then((error) => {
        // console.log("success", error);
      });
  };

  const getEfforts = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getEfforts?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;

        if (resp.length > 0) {
          setEfforts({
            priliminaryEfforts: resp[0].value,
            contractedEfforts: resp[1].value,
          });
        }
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getGrossMargin = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getGrossMargin?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setGrossMargin(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const getGM = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getGM?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setGM(resp);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const effortTypeFnc = (catId) => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/ProjectScopeChange/getEffortTypesById?pcid=${catId}`,
    })
      .then((res) => {
        let data = res.data;
        setEffort(data);
      })
      .catch((error) => {
        console.log("error :" + error);
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
      .catch((error) => {
        console.log("error :" + error);
      });
  };

  const getDirectCost = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/Audit/getDirectCost?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        if (resp.length > 0) {
          setDirectCost({
            priliminaryRDC: resp[0].value,
            ContractRDC: resp[1].value,
          });
        }
        let spare = {
          priliminaryRDC: resp[0].value,
          ContractRDC: resp[1].value,
        };

        setDirectSpareCost(JSON.parse(JSON.stringify(spare)));
      })
      .catch(function (response) {
        console.log(response);
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

      setPonumber(data);
    });
  };

  const getholiday = async (startdt, endDt, calId) => {
    try {
      const response = await axios({
        method: "get",
        url:
          baseUrl +
          `/ProjectMS/ProjectScopeChange/getHolidays?fromDate=${startdt}&toDate=${endDt}&calendarId=${calId}`,
      });

      const data = response.data.holidays;
      return data; // Return the data
    } catch (error) {
      console.error("Error fetching holidays:", error);
      throw error; // Re-throw the error for handling at the calling code
    }
  };

  function compareObjects(obj1, obj2) {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
    if (obj1Keys.length !== obj2Keys.length) {
      return false;
    }
    for (let key of obj1Keys) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }
  const navigate = useNavigate();
  const handleClick = () => {
    abortController.current = new AbortController();
    let valid = GlobalValidation(ref);
    if (valid) {
      {
        setSuccessfulmessage(false);
        setValidationMessage(true);
      }
      return;
    }
    setOpen(false);
    axios({
      method: "post",
      url: baseUrl + `/ProjectMS/ProjectScopeChange/projectEdit`,
      signal: abortController.current.signal,
      data: {
        projectId: projectData[0]?.id,
        ProjectScope: projectData[0]?.projectScopeId,
        revenue: revenue.revenue,

        facilitator: projectData[0]?.facilitatorID,

        PcqaType: projectData[0]?.pcqa_type,

        subPractice: projectData[0]?.subPractice,

        divisionId: projectData[0].division_id,
        engagementId: projectData[0].engagementId,
        EngagementType: enguagementType[0]?.id,
        effortTypeId: projectData[0].effort_type_id,
        teamLocationId: projectData[0].team_location_id,
        customerId: projectData[0].customer_id,
        isPrjStatus: projectData[0]?.is_prj_status,
        projectPhase: projectData[0]?.project_phase,
        projectHealthId: projectData[0]?.project_health_id,
        PoNumber: projectData[0]?.poNumberId,
        SfEngTypeId: projectData[0]?.sf_eng_type_id,
        BusinessCase: projectData[0]?.business_case,
        PrjHealthComments: projectData[0]?.prj_health_comments,
        primaryManger: projectMngr[0]?.id,
        servicesOfferedId: projectData[0]?.servicesOfferedId,
        expenseBillable: projectData[0]?.expenseBillable,
        PrjCrgId: projectData[0]?.pcrgsId,
        clientEmail: projectData[0]?.clientEmail,
        complexityId: projectData[0]?.tech_complexity_id,
        domSpecChallengeId: projectData[0]?.dom_spec_challenge_id,
        skillResAvailId: projectData[0]?.skill_res_avail_id,
        depThirdPartySysId: projectData[0]?.dep_third_party_sys_id,
        devEnvAvailId: projectData[0]?.dev_env_avail_id,
        custEnvId: projectData[0]?.cust_env_id,
        profitabilityId: projectData[0]?.profitability_id,
        contStartDate: projectData[0]?.contStartDate,
        contEndDate: projectData[0]?.contEndDate,
        plannedStartDt: projectData[0]?.plandStartDate,
        plannedEndDt: projectData[0]?.plandEndDate,
        actStartDate: projectData[0]?.actStartDate,
        actEndDate: actEndDate,

        loggedId: loggedUserId,

        holidayCalendarId: projectData[0].holiday_calendar_id,
        weekelyCalenderId: projectData[0].week_calendar_id,
        projectExecMethodId: projectData[0].project_exec_method_id,

        projectCode: projectData[0].projectCode,
        projectName: projectData[0].projectName,
        projectdivisionId: "0",
        typContractTermsCatId: contract[0]?.id,
        typProjectCatId: projectData[0].projCat,
        deliverables: projectData[0]?.deliverables,
        projectStage: projectData[0]?.is_prj_status,
        typSchedulingModeId: projectData[0].typ_scheduling_mode_id,
        typTimeEntryModeId: projectData[0].typ_time_entry_mode_id,
        priliminaryFte: projectData[0].fte,
        priliminaryGM: resultGM,
        priliminaryGrossMargin: resultPreGrossMargin,
        priliminaryRDC: directCost.priliminaryRDC,
        priliminaryOtherCost: otherCost.priliminaryOtherCost,
        priliminaryEfforts: efforts.priliminaryEfforts,
        contractedRevenue: revenue.contractedRevenue,
        ContractGM: contractResult,
        ContractGrossMargin: contractGMResult,
        contarctOtherCost: otherCost.contarctOtherCost,
        ContractRDC: directCost.ContractRDC,
        contractFte: kpiData[0]?.contracted_fte,
        contractedEfforts: efforts.contractedEfforts,
        unitOfMeasurement: projectData[0]?.unit_of_measure,
      },
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      const data = response.data;

      setOpen(false);
      setValidationMessage(false);
      setSuccessfulmessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setSuccessfulmessage(false);

        try {
          // navigate(`/project/Overview/:${data.projectId}`);
          setbtnState("Project Overview");
          // window.location.reload();
        } catch (error) {
          console.error("Navigation error:", error);
        }
      }, 2000);
    });
  };

  const calContractGrossMargin = (value) => {
    let total =
      (directCost.ContractRDC == "" ? 0.0 : directCost.ContractRDC) +
      (otherCost.contarctOtherCost == "" ? 0.0 : otherCost.contarctOtherCost);
    let contractGross = revenue.contractedRevenue - total;
    setContractResult(contractGross ? contractGross.toFixed(2) : value);
  };

  const calGrossMargin = (value) => {
    const preliminaryRDC = parseFloat(directCost.priliminaryRDC) || 0;
    const preliminaryOtherCost =
      parseFloat(otherCost.priliminaryOtherCost) || 0;
    const total = preliminaryRDC + preliminaryOtherCost;
    const priliminaryGross = revenue.revenue - total;
    setresultPreGrossMargin(
      priliminaryGross ? priliminaryGross.toFixed(2) : value
    );
  };

  const calGM = (value) => {
    let total =
      (directCost.priliminaryRDC == "" ? 0 : directCost.priliminaryRDC) +
      (otherCost.priliminaryOtherCost == ""
        ? 0
        : otherCost.priliminaryOtherCost);
    let prilimainaryGross = revenue.revenue - total;
    let prilimainaryGM = (prilimainaryGross / revenue.revenue) * 100;
    setResultGM(prilimainaryGM ? prilimainaryGM.toFixed(2) : value);
  };

  const calContractGM = (value) => {
    const total =
      (directCost.ContractRDC == "" ? 0 : directCost.ContractRDC) +
      (otherCost.contarctOtherCost == "" ? 0 : otherCost.contarctOtherCost);
    let contractGross = revenue.contractedRevenue - total;
    let contractGM = (contractGross / revenue.contractedRevenue) * 100;
    setContractGMResult(contractGM ? contractGM.toFixed(2) : value);
  };

  useEffect(
    () => {
      getProjectOverviewData();
      projectCategoryFnc();
      customerFnc();
      WeekCalenderFnc();
      holidayCalenderFnc();
      projectPhaseFnc();
      projectTypesFnc();
      resourceFnc();
      effortTypeFnc();
      getRiskFactor();
      getProjectName();

      getEfforts();
      getRevenue();
      getDirectCost();
      getOtherCost();
      ServiceOfferingFnc();
      getGrossMargin();
      getGM();
      getProjectMngr();
      getDeliveryMngr();
      getProjectApprover();
      getProjectRequester();
      getBusinessUnit();
      currencyFnc();
    },
    [],
    enguagementType[0]?.id
  );

  useEffect(() => {
    const formatDate = (date, defaultValue) => {
      return date?.trim() === "" ? defaultValue : date;
    };

    const calculateDateDifference = (startDate, endDate) => {
      const start = moment(startDate);
      const end = moment(endDate);
      const daysDiff = end.diff(start, "days") + 1; // Add 1 to include both start and end dates
      let weekdays = 0;
      for (let i = 0; i < daysDiff; i++) {
        const currentDate = start.clone().add(i, "days");
        // Check if the current day is not Saturday (6) or Sunday (0)
        if (currentDate.day() !== 0 && currentDate.day() !== 6) {
          weekdays++;
        }
      }

      return weekdays;
    };

    const a1 = formatDate(
      projectData[0]?.contStartDate,
      projectData[0]?.contStartDate
    );
    const b1 = formatDate(
      projectData[0]?.contEndDate,
      projectData[0]?.contEndDate
    );

    const plnStartDt = formatDate(
      projectData[0]?.plandStartDate,
      projectData[0]?.plandStartDate
    );
    const plnEndDt = formatDate(
      projectData[0]?.plandEndDate,
      projectData[0]?.plandEndDate
    );
    const fetchData = async () => {
      try {
        const conClnId = await getholiday(
          projectData[0]?.contStartDate,
          projectData[0]?.contEndDate,
          projectData[0]?.holiday_calendar_id
        );

        const plnClnId = await getholiday(
          projectData[0]?.plandStartDate,
          projectData[0]?.plandEndDate,
          projectData[0]?.holiday_calendar_id
        );

        const diffInDays = calculateDateDifference(plnStartDt, plnEndDt);
        setPlnDateDiff(diffInDays - plnClnId);
        let chDays = diffInDays - plnClnId;
        let cFte = kpiData[0]?.planned_hours / (chDays * 8);
        SetConFTE(cFte.toFixed(2));
        const diff = calculateDateDifference(a1, b1);
        setConDateDiff(diff - plnClnId);
        let phDays = diff - plnClnId;
        let pFte = efforts.contractedEfforts / (phDays * 8);

        SetPlnFTE(pFte.toFixed(2));
      } catch (error) {
        // Handle errors here
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();
  }, [
    projectData,
    projectData[0]?.contStartDate,
    projectData[0]?.contEndDate,
    projectData[0]?.plandStartDate,
    projectData[0]?.plandEndDate,
    projectData[0]?.holiday_calendar_id,
    efforts.contractedEfforts,
    kpiData[0]?.planned_hours,
  ]);

  useEffect(() => {
    calGM();
    calGrossMargin();
  }, [directCost, revenue, otherCost, projectId]);

  useEffect(() => {
    calContractGM();
    calContractGrossMargin();
  }, [directCost, otherCost, revenue]);

  const updateProjectData = (id, value) => {
    setProjectData((ps) => {
      const newArr = [...ps];
      newArr[0][id] = value;
      return newArr;
    });
  };

  const onChange = (e) => {
    const { value, id } = e.target;
    setPopUpValue(value);

    switch (id) {
      case "division_id":
        enguagementFnc(value);

        break;
      case "engagementId":
        engagementTypeFnc(value);
        conractTermsFnc(value);
        poNumberFnc(value);

        break;
      case "effort_type_id":
        break;
      case "customer_id":
        divisionFnc(value);

        break;

      default:
        break;
    }

    updateProjectData(id, value);
  };

  const onChangeStg = (e) => {
    const { value, id } = e.target;
    setPopUpValue(value);

    switch (id) {
      case "isPrjStatus":
        if (
          [2, 4, 6].includes(e.target.length) ||
          (e.target.length === 5 && value === "1")
        ) {
          setPopup(false);
          setStgValue(value);
        } else if ([1, 2, 3, 4].includes(Number(value))) {
          setPopup(true);
        }
        updateProjectData("is_prj_status", value);
        // This line is common to both conditions
        break;
      default:
        break;
    }

    if (popup) {
      updateProjectData(id, value);
    }
  };

  function handleExpenseBillableChange(event) {
    setProjectData((ps) => {
      const newArr = [...ps];

      newArr[0]["expenseBillable"] = true;

      return newArr;
    });
  }

  function handleNoExpenseBillableChange(event) {
    setProjectData((ps) => {
      const newArr = [...ps];

      newArr[0]["expenseBillable"] = false;

      return newArr;
    });
  }

  var data = 100;
  const onchangeForAll = (e) => {
    const { name, id, value } = e.target;

    if (id === "revenue") {
      setRevenue((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    } else if (id === "priliminaryRDC") {
      setDirectCost((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    } else if (id === "priliminaryOtherCost") {
      setOtherCost((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    } else if (id === "contractedRevenue") {
      setRevenue((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    } else if (id === "contarctOtherCost") {
      setOtherCost((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    } else if (id === "ContractRDC") {
      setDirectCost((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    } else if (id === "priliminaryFte") {
      setProjectData((ps) => {
        const newArr = [...ps];
        newArr[0]["fte"] = value;
        return newArr;
      });
    } else if (id === "contractFte") {
      setKpiData((prev) => ({ ...prev, ["contracted_fte"]: e.target.value }));
    } else if (id === "priliminaryEfforts") {
      setEfforts((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    } else if (id === "contractedEfforts") {
      setEfforts((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    }
  };

  const onChangetext = (e) => {
    const { value, id } = e.target;
    setProjectData((ps) => {
      const newArr = [...ps];
      newArr[0][id] = value;
      return newArr;
    });
  };

  useEffect(() => {
    const conStart = moment(projectData[0]?.contStartDate).toDate();
    SetConStartDate(conStart);
    const conEnd = moment(projectData[0]?.contEndDate).toDate();
    SetConEndDate(conEnd);
    const plnStart = moment(projectData[0]?.plandStartDate).toDate();
    SetPlanStartDate(plnStart);
    const plnEnd = moment(projectData[0]?.plandEndDate).toDate();
    SetPlanEndDate(plnEnd);

    if (projectData[0]?.actStartDate != null) {
      const actStart = moment(projectData[0]?.actStartDate).toDate();
      SetActStartDate(actStart);
    }

    if (projectData[0]?.servicesOfferedId) {
      const serviceIds = (projectData[0]?.servicesOfferedId || "")
        .split(",")
        .map((item) => parseInt(item.trim(), 10))
        .filter((item) => !isNaN(item));
      setTargetKeys(serviceIds);
    }
  }, [projectData]);

  const handleDateUpdate = () => {
    const date = new Date();
    const formattedDate = moment(date).format("YYYY-MM-DD");
    SetActEndDate(formattedDate);
  };
  const handleNo = () => {
    SetActEndDate(null);
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setOpen(false);
  };

  return (
    <div>
      <>
        {successfulmessage ? (
          <div className="statusMsg success">
            {" "}
            <BiCheck /> Project Updated Successfully{" "}
          </div>
        ) : (
          ""
        )}
        {validationMessage ? (
          <div className="statusMsg error">
            {" "}
            <AiFillWarning /> Please select the valid values for highlighted
            fields{" "}
          </div>
        ) : (
          ""
        )}
      </>

      <div className="pageTitle">
        <div className="childOne">
          {/* <h2>{projectData[0]?.projectName}</h2> */}
          {projectData.map((list) => (
            <div className="col-md-12">
              <div className="pageTitle">
                <div className="childOne">
                  <ul className="tabsContainer">
                    <li>
                      {grp1Items[0]?.display_name != undefined ? (
                        <span>{grp1Items[0]?.display_name}</span>
                      ) : (
                        ""
                      )}
                      <ul>
                        {grp1Items.slice(1).map((button) => (
                          <li
                            className={
                              btnState === button.display_name
                                ? "buttonDisplayClick"
                                : "buttonDisplay"
                            }
                            onClick={() => {
                              setbtnState(button.display_name);
                              setUrlState(
                                button.url_path.toString().replace(/::/g, "/")
                              );
                            }}
                          >
                            {button.display_name}
                          </li>
                        ))}
                      </ul>
                    </li>{" "}
                    <li>
                      {grp2Items[0]?.display_name != undefined ? (
                        <span>{grp2Items[0]?.display_name}</span>
                      ) : (
                        ""
                      )}
                      <ul>
                        {grp2Items.slice(1).map((button) => (
                          <li
                            className={
                              btnState === button.display_name
                                ? "buttonDisplayClick"
                                : "buttonDisplay"
                            }
                            onClick={() => {
                              setbtnState(button.display_name);
                              setUrlState(
                                button.url_path.toString().replace(/::/g, "/")
                              );
                            }}
                          >
                            {button.display_name}
                          </li>
                        ))}
                      </ul>
                    </li>{" "}
                    <li>
                      {grp3Items[0]?.display_name != undefined ? (
                        <span>{grp3Items[0]?.display_name}</span>
                      ) : (
                        ""
                      )}
                      <ul>
                        {grp3Items.slice(1).map((button) => (
                          <li
                            className={
                              btnState === button.display_name
                                ? "buttonDisplayClick"
                                : "buttonDisplay"
                            }
                            onClick={() => {
                              setbtnState(button.display_name);
                              setUrlState(
                                button.url_path.toString().replace(/::/g, "/")
                              );
                            }}
                          >
                            {button.display_name}
                          </li>
                        ))}
                      </ul>
                    </li>{" "}
                    <li>
                      {grp4Items[0]?.display_name != undefined ? (
                        <span>{grp4Items[0]?.display_name}</span>
                      ) : (
                        ""
                      )}
                      <ul>
                        {grp4Items.slice(1).map((button) => (
                          <li
                            className={
                              btnState === button.display_name
                                ? "buttonDisplayClick"
                                : "buttonDisplay"
                            }
                            onClick={() => {
                              setbtnState(button.display_name);
                              setUrlState(
                                button.url_path.toString().replace(/::/g, "/")
                              );
                            }}
                          >
                            {button.display_name}
                          </li>
                        ))}
                      </ul>
                    </li>{" "}
                    <li>
                      {grp6Items[0]?.display_name != undefined ? (
                        <span>{grp6Items[0]?.display_name}</span>
                      ) : (
                        ""
                      )}
                      <ul>
                        {grp6Items.slice(1).map((button) => (
                          <li
                            className={
                              btnState === button.display_name
                                ? "buttonDisplayClick"
                                : "buttonDisplay"
                            }
                            onClick={() => {
                              setbtnState(button.display_name);
                              setUrlState(
                                button.url_path.toString().replace(/::/g, "/")
                              );
                            }}
                          >
                            {button.display_name}
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="childTwo">
          <h2>
            {/* {list.projectName} */}
            Edit {/* ({list.projectCode}) */}
          </h2>
        </div>
        {/* <div>
          <h2 style={{ marginTop: "15px" }}></h2>
        </div> */}
        <div className="childThree"></div>
      </div>
      <div className="group mb-3 customCard">
        <div className="group-content row">
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="projectCode">
              Project Code <span className="error-text">&nbsp;*</span>
            </label>
            <div
              className="textfield"
              ref={(ele) => {
                ref.current[0] = ele;
              }}
            >
              <input
                type="text"
                disabled
                className="form-control disableField"
                id="projectCode"
                placeholder
                required
                defaultValue={projectData[0]?.projectCode}
              />
            </div>
          </div>
          <div className="form-group col-md-4 mb-2">
            <label htmlFor="projectName">
              Project Name <span className="error-text">&nbsp;*</span>
            </label>
            <div
              className="textfield"
              ref={(ele) => {
                ref.current[1] = ele;
              }}
            >
              <input
                type="text"
                disabled={
                  projectData[0]?.projectStage == "Completed" ? true : false
                }
                className="form-control disableField "
                id="projectName"
                placeholder
                required
                onChange={(e) => {
                  const value = e.target.value.replace(/^\s+/g, ""); // Remove spaces
                  e.target.value = value; // Update the input value
                  onChangetext(e);
                }}
                value={projectData[0]?.projectName}
              />
            </div>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="businessUnit">
              Business Unit <span className="error-text">&nbsp;*</span>
            </label>
            <div
              className="textfield"
              ref={(ele) => {
                ref.current[2] = ele;
              }}
            >
              <input
                type="text"
                className="form-control Done disableField"
                id="UnitOfMeasure"
                value={businessUnit[0]?.bussinessUnit}
                placeholder
                disabled
                required
              />
            </div>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="customer">
              Customer <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="customer_id"
              className="disableField text"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              ref={(ele) => {
                ref.current[3] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {customer.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.id == projectData[0]?.customer_id ? true : false
                  }
                >
                  {" "}
                  {Item.full_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="division">
              Division <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="division_id"
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              onChange={(e) => onChange(e)}
              className="text"
              ref={(ele) => {
                ref.current[4] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {division.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.id == projectData[0]?.division_id ? true : false
                  }
                >
                  {" "}
                  {Item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="subPractice">Sub Practice</label>
            <input
              type="text"
              className="form-control"
              id="subPractice"
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              value={
                projectData[0]?.subPractice == null
                  ? ""
                  : projectData[0]?.subPractice
              }
              onChange={(e) => onChangetext(e)}
            />
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="engagementName">
              Engagement Name <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="engagementId"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              className="text"
              ref={(ele) => {
                ref.current[5] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {enguagement.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.id == projectData[0]?.engagementId ? true : false
                  }
                >
                  {" "}
                  {Item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="engagementType">
              Engagement Type <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="engagement_model_id"
              disabled
              defaultValue={projectData[0]?.engagementType}
              className="text"
              ref={(ele) => {
                ref.current[6] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {enguagementType.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.id == projectData[0]?.engagement_model_id ||
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
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="contractTerms">
              Contract Terms <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="contract"
              defaultValue={projectData[0]?.contractTerms}
              disabled
              className="text"
              ref={(ele) => {
                ref.current[7] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {contract.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.id == projectData[0]?.contract ||
                    Item.lkup_name == contract[0]?.lkup_name
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
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="executionMethodology">Execution Methodology</label>
            <select
              id="project_exec_method_id"
              className="disableField"
              disabled={
                projectData[0]?.executionMethodology == null ? false : true
              }
              onChange={(e) => onChange(e)}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option
                value={365}
                selected={
                  projectData[0]?.executionMethodology == "Agile" ? 365 : ""
                }
              >
                Agile
              </option>
              <option
                value={366}
                selected={
                  projectData[0]?.executionMethodology == "Waterfall" ? 366 : ""
                }
              >
                Waterfall
              </option>
              <option
                value={367}
                selected={
                  projectData[0]?.executionMethodology == "Iterative" ? 367 : ""
                }
              >
                Iterative
              </option>
              <option
                value={368}
                selected={
                  projectData[0]?.executionMethodology == "Other" ? 368 : ""
                }
              >
                Other
              </option>
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="effortType">Effort Type</label>
            <select
              id="effort_type_id"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {effort.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.effort_name == projectData[0]?.effortType
                      ? true
                      : false
                  }
                >
                  {" "}
                  {Item.effort_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="currency">
              Currency <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="currency_id"
              onChange={(e) => onChange(e)}
              disabled
              className="text"
              ref={(ele) => {
                ref.current[8] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              currency_id
              {currency.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.id == projectData[0]?.currency_id ? true : false
                  }
                >
                  {" "}
                  {Item.description}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="schedulingMode">
              Scheduling Mode <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="typ_scheduling_mode_id"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              className="text"
              ref={(ele) => {
                ref.current[9] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option
                value={30}
                selected={projectData[0]?.schedulingMode == "Days" ? 30 : ""}
              >
                Days
              </option>
              <option
                value={31}
                selected={projectData[0]?.schedulingMode == "Hours" ? 31 : ""}
              >
                Hours
              </option>
              <option
                value={29}
                selected={projectData[0]?.schedulingMode == "Weeks" ? 29 : ""}
              >
                Weeks
              </option>
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="timeEntryMode ">
              Time Entry Mode <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="typ_time_entry_mode_id"
              className="disableField text"
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              onChange={(e) => onChange(e)}
              ref={(ele) => {
                ref.current[10] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option
                value={19}
                selected={
                  projectData[0]?.timeEntryMode == "Project Level" ? 19 : ""
                }
              >
                Project Level
              </option>
              <option
                value={20}
                selected={
                  projectData[0]?.timeEntryMode == "Task Level" ? 20 : ""
                }
              >
                Task Level
              </option>
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="teamLocation ">
              Team Location <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="team_location_id"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              className="text"
              ref={(ele) => {
                ref.current[11] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option
                value={364}
                selected={
                  projectData[0]?.teamLocation == "Blended Shore" ? 364 : ""
                }
              >
                Blended Shore
              </option>
              <option
                value={361}
                selected={
                  projectData[0]?.teamLocation == "Client Site" ? 361 : ""
                }
              >
                Client Site
              </option>
              <option
                value={363}
                selected={
                  projectData[0]?.teamLocation == "Off Shore" ? 363 : ""
                }
              >
                Off Shore
              </option>
              <option
                value={362}
                selected={projectData[0]?.teamLocation == "Onsite" ? 362 : ""}
              >
                Onsite
              </option>
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="projectScope">Project Scope </label>
            <div>
              <input
                type="text"
                disabled={
                  projectData[0]?.projectStage == "Completed" ? true : false
                }
                className="form-control"
                id="projectScopeId"
                placeholder
                value={
                  projectData[0]?.projectScopeId == " "
                    ? 0
                    : projectData[0]?.projectScopeId
                }
                onChange={(e) => {
                  const input = e.target.value;
                  const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                  if (!regex.test(input)) {
                    e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                  }
                  onChangetext(e);
                }}
              />
            </div>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="unit_of_measure">Unit of Measurement</label>
            <select
              id="unit_of_measure"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option
                value="243"
                selected={
                  projectData[0]?.unit_of_measure == "243" ? true : false
                }
              >
                {" "}
                FP
              </option>
              <option
                value="244"
                selected={
                  projectData[0]?.unit_of_measure == "244" ? true : false
                }
              >
                UCP
              </option>
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="expenseBillable">Expense Billable</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                disabled={projectData[0]?.projectStage === "Completed"}
                id="expenseBillableYes"
                name="expenseBillable"
                value="true"
                checked={projectData[0]?.expenseBillable === true}
                onChange={handleExpenseBillableChange}
              />
              <label className="form-check-label" htmlFor="expenseBillableYes">
                Yes
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                disabled={projectData[0]?.projectStage === "Completed"}
                id="expenseBillableNo"
                name="expenseBillable"
                value="false"
                checked={projectData[0]?.expenseBillable === false}
                onChange={handleNoExpenseBillableChange}
              />
              <label className="form-check-label" htmlFor="expenseBillableNo">
                No
              </label>
            </div>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="weekCalendar">
              Week Calendar <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="week_calendar_id"
              className="disableField text"
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              onChange={(e) => onChange(e)}
              ref={(ele) => {
                ref.current[12] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {week.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.calendar_name == projectData[0]?.weekCalendar
                      ? true
                      : false
                  }
                >
                  {" "}
                  {Item.calendar_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="holidayCalendar">
              Holiday Calendar <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="holiday_calendar_id"
              className="disableField text"
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              onChange={(e) => onChange(e)}
              ref={(ele) => {
                ref.current[13] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {holiday.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.name == projectData[0]?.holidayCalendar ? true : false
                  }
                >
                  {" "}
                  {Item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="projectCategory">
              Project Category <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="projCat"
              className="disableField text"
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              onChange={(e) => onChange(e)}
              ref={(ele) => {
                ref.current[14] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {category.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.project_category_name ==
                    projectData[0]?.projectCategory
                      ? true
                      : false
                  }
                >
                  {" "}
                  {Item.project_category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="projectStage">
              Project Stage <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="isPrjStatus"
              onChange={(e) => onChangeStg(e)}
              className="text"
              value={stgValue}
              ref={(ele) => {
                ref.current[15] = ele;
              }}
            >
              {projectData[0]?.projectStage === "New" ? (
                <>
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value="0">New</option>
                  <option value="5">Opportunity</option>
                  <option value="1">In Progress</option>
                </>
              ) : projectData[0]?.projectStage === "In Progress" ? (
                <>
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value="1">In Progress</option>
                  <option value="3">Withdrawn</option>
                  <option value="4">On Hold</option>
                  <option value="2">Completed</option>
                </>
              ) : projectData[0]?.projectStage === "On Hold" ? (
                <>
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value="1">In Progress</option>
                  <option value="3">Withdrawn</option>
                  <option value="4">On Hold</option>
                  <option value="2">Completed</option>
                </>
              ) : projectData[0]?.projectStage === "Opportunity" ? (
                <>
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value="5">Opportunity</option>
                  <option value="1">In Progress</option>
                  <option value="3">Withdrawn</option>
                  <option value="4">On Hold</option>
                  <option value="2">Completed</option>
                </>
              ) : projectData[0]?.projectStage === "Completed" ? (
                <>
                  <option value="1" name="inprogress">
                    In Progress
                  </option>
                  <option value="2">Completed</option>
                </>
              ) : projectData[0]?.projectStage === "Withdrawn" ? (
                <>
                  <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                  <option value="1">In Progress</option>
                  <option value="3">Withdrawn</option>
                  <option value="4">On Hold</option>
                  <option value="2">Completed</option>
                </>
              ) : (
                <option value="2"></option>
              )}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="projectPhase">
              Project Phase <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="project_phase"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              className="text"
              ref={(ele) => {
                ref.current[16] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              {phase.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.lkup_name == projectData[0]?.projectPhase
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
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="projectHealth">
              Project Health <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="project_health_id"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              className="text"
              ref={(ele) => {
                ref.current[17] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option
                value="498"
                selected={
                  projectData[0]?.projectHealth == "On Schedule" ? "498" : ""
                }
              >
                On Schedule
              </option>
              <option
                value="499"
                selected={
                  projectData[0]?.projectHealth == "Potential Issues"
                    ? "499"
                    : ""
                }
              >
                Potential issues
              </option>
              <option
                value="500"
                selected={
                  projectData[0]?.projectHealth == "Serious Issues" ? "500" : ""
                }
              >
                Serious issues
              </option>
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="deliverables">
              Deliverables <span className="error-text">&nbsp;*</span>
            </label>
            <select
              id="deliverables"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              className="text"
              ref={(ele) => {
                ref.current[18] = ele;
              }}
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option
                value="Yes"
                selected={projectData[0]?.deliverables == "Yes" ? "Yes" : ""}
              >
                Yes
              </option>
              <option
                value="NO"
                selected={projectData[0]?.deliverables == "No" ? "No" : ""}
              >
                No
              </option>
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="poNumber">PO Number</label>
            <select
              id="poNumberId"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
              Value={projectData[0]?.poNumber}
            >
              <option value="null"> &lt;&lt;Please Select&gt;&gt;</option>
              {ponumber.map((Item) => (
                <option
                  value={Item.id}
                  selected={
                    Item.id == projectData[0]?.poNumberId ? true : false
                  }
                >
                  {" "}
                  {Item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-2 mb-2">
            <label htmlFor="sfEnagagementType">SF Enagagement Type</label>
            <select
              id="sf_eng_type_id"
              onChange={(e) => onChange(e)}
              disabled={
                projectData[0]?.projectStage == "Completed" ? true : false
              }
            >
              <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
              <option
                value={1357}
                selected={
                  projectData[0]?.sfEngagementType == "New Persuit" ? "2" : ""
                }
              >
                New Persuit
              </option>
              <option
                value={1358}
                selected={
                  projectData[0]?.sfEngagementType == "Stream" ? "3" : ""
                }
              >
                Stream
              </option>
            </select>
          </div>

          <div className="form-group col-md-6 mb-1">
            <label htmlFor="projectDescription">
              Project Description / Business Case{" "}
              <span className="error-text">&nbsp;*</span>
            </label>
            <div
              className="textfield"
              ref={(ele) => {
                ref.current[19] = ele;
              }}
            >
              <>
                <textarea
                  className="form-control"
                  id="business_case"
                  disabled={
                    projectData[0]?.projectStage == "Completed" ? true : false
                  }
                  placeholder
                  rows={3}
                  required
                  value={projectData[0]?.business_case}
                  onChange={(e) => onChangetext(e)}
                />
              </>
            </div>
          </div>
          <div className="form-group col-md-6 mb-1">
            <label htmlFor="projectHealthComments">
              Project Health Comments
              <span className="error-text">&nbsp;*</span>
            </label>
            <div
              className="textfield"
              ref={(ele) => {
                ref.current[20] = ele;
              }}
            >
              <textarea
                className="form-control"
                id="prj_health_comments"
                disabled={
                  projectData[0]?.projectStage == "Completed" ? true : false
                }
                placeholder
                rows={3}
                required
                value={projectData[0]?.prj_health_comments}
                onChange={(e) => onChangetext(e)}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 group mb-2 container-fluid   customCard">
            <div className="group mb-0 customCard">
              <h2>
                <RiProfileLine /> Stake Holders
              </h2>
              <div className="group-content row">
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="deliveryManager ">
                      Delivery Manager{" "}
                      <span className="error-text">&nbsp;*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <div>
                        <input
                          type="text"
                          className="form-control disableField"
                          disabled
                          id="DeliveryManager "
                          required
                          Value={deliveryMngr[0]?.DeliveryManager}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="primaryManager ">
                      Primary Manager<span className="error-text">&nbsp;*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <div
                        className={`autoComplete-container ${
                          projectData[0]?.projectStage == "Completed"
                            ? "disabledFieldStyles"
                            : ""
                        }  reactsearchautocomplete`}
                        ref={(ele) => {
                          ref.current[21] = ele;
                        }}
                      >
                        <ReactSearchAutocomplete
                          items={resource}
                          type="Text"
                          name="resource"
                          id="primaryManger"
                          //className="err nochange"
                          fuseOptions={{
                            keys: ["id", "name"],
                            includeScore: false,
                            threshold: 0.3,
                          }}
                          resultStringKeyName="name"
                          placeholder="Type minimum 3 characters to get the list"
                          // resource={resource}
                          // resourceFnc={resourceFnc}
                          inputSearchString={
                            resource.find(
                              (item) => item.userId === projectMngr[0]?.user_id
                            )?.name
                          }
                          onSelect={(e) => {
                            setProjectMngr((ps) => {
                              const newArr = [...ps];

                              newArr[0]["id"] = e.id;

                              return newArr;
                            });
                          }}
                          showIcon={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="projectRequestor ">
                      Project Requestor{" "}
                      <span className="error-text">&nbsp;*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <div>
                        <input
                          type="text"
                          className="form-control disableField"
                          disabled
                          id="DeliveryManager "
                          required
                          Value={projectRequester[0]?.ProjectRequester}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="projectApprover ">
                      Project Approver{" "}
                      <span className="error-text">&nbsp;*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <div>
                        <input
                          type="text"
                          className="form-control disableField"
                          // disabled
                          disabled
                          id="DeliveryManager "
                          required
                          Value={projectApprover[0]?.ProjectApprover}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 ">
            <div className="group mb-0 customCard">
              <h2>
                <RiProfileLine /> Services Offered
              </h2>
              <div className="group-content row">
                <div
                  className="transferTable"
                  ref={(ele) => {
                    ref.current[22] = ele;
                  }}
                >
                  <Transfer
                    className="transferTable"
                    dataSource={service}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    onChange={(nextTargetKeys) => {
                      console.log(nextTargetKeys);
                      setTargetKeys(nextTargetKeys);
                      let filteredCountry = [];
                      nextTargetKeys.forEach((d) => {
                        filteredCountry.push(d);
                      });
                      setProjectData((ps) => {
                        const newArr = [...ps];

                        newArr[0]["servicesOfferedId"] =
                          filteredCountry.toString();

                        return newArr;
                      });
                      console.log(filteredCountry);
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
                    disabled={
                      projectData[0]?.projectStage == "Completed" ? true : false
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {projectData[0]?.contract == "25" ||
          contract[0]?.id == "25" ||
          projectData[0]?.contract == "26" ||
          contract[0]?.id == "26" ||
          projectData[0]?.contract == "27" ||
          contract[0]?.id == "278" ||
          projectData[0]?.contract == "28" ||
          contract[0]?.id == "28" ||
          projectData[0]?.contract == "606" ||
          contract[0]?.id == "606" ||
          contract[0]?.id == "752" ||
          projectData[0]?.contract == "752" ? (
            <div className="col-md-4 group mb-2 container-fluid   customCard">
              <div className="group mb-0 customCard">
                <h2>
                  <RiProfileLine /> PCQA
                </h2>
                <div className="group-content row">
                  <div className=" col-md-12 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="deliveryManager ">
                        Facilitator
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <div
                          className={`autoComplete-container ${
                            projectData[0]?.projectStage == "Completed"
                              ? "disabledFieldStyles"
                              : ""
                          }  reactsearchautocomplete`}
                          // ref={(ele) => {
                          //   ref.current[23] = ele;
                          // }}
                        >
                          <ReactSearchAutocomplete
                            items={resource}
                            type="Text"
                            name="resource"
                            id="facilitatorID"
                            // className="err nochange"
                            fuseOptions={{
                              keys: ["id", "name"],
                              includeScore: false,
                              threshold: 0.3,
                            }}
                            resultStringKeyName="name"
                            placeholder="Type minimum 3 characters to get the list"
                            inputSearchString={
                              resource.find(
                                (item) =>
                                  item.id === projectData[0]?.facilitatorID
                              )?.name
                            }
                            // resource={resource}
                            // resourceFnc={resourceFnc}
                            onSelect={(e) => {
                              console.log(e);
                              setProjectData((ps) => {
                                const newArr = [...ps];

                                newArr[0]["facilitatorID"] = e.id;

                                return newArr;
                              });
                            }}
                            showIcon={false}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-12 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="primaryManager  ">
                        Client Email
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <input
                          type="text"
                          className="form-control disableField"
                          disabled
                          id="clientEmail "
                          required
                          defaultValue={projectData[0]?.clientEmail}
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" col-md-12 mb-2">
                    <div className="form-group row">
                      <label className="col-5" htmlFor="projectRequestor ">
                        Project Type <span className="error-text">&nbsp;*</span>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <select
                          id="pcqa_type"
                          onChange={(e) => onChange(e)}
                          disabled={
                            projectData[0]?.projectStage == "Completed"
                              ? true
                              : false
                          }
                          className="text"
                          ref={(ele) => {
                            ref.current[24] = ele;
                          }}
                        >
                          <option value="">
                            {" "}
                            &lt;&lt;Please Select&gt;&gt;
                          </option>
                          {type.map((Item) => (
                            <option
                              value={Item.id}
                              selected={
                                Item.lkup_name == projectData[0]?.projectType
                                  ? true
                                  : false
                              }
                            >
                              {Item.lkup_name}
                            </option>
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

        <div className="row">
          <div className="group mb-0 col-md-4 customCard">
            <h2>
              {" "}
              <BiLineChart /> Risk Factor Characteristics
            </h2>
            {projectData[0]?.projCat == 17 ||
            projectData[0]?.projCat == 18 ||
            projectData[0]?.projCat == 19 ? (
              <div className="group-content row">
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="technicalComplexity">
                      Technical Complexity
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="tech_complexity_id"
                        onChange={(e) => onChange(e)}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        <option
                          value="357"
                          selected={
                            projectData[0]?.techComplexity == "High Risk"
                              ? "357"
                              : ""
                          }
                        >
                          High Risk
                        </option>
                        <option
                          value="359"
                          selected={
                            projectData[0]?.techComplexity == "Low Risk"
                              ? "359"
                              : ""
                          }
                        >
                          Low Risk
                        </option>
                        <option
                          value="358"
                          selected={
                            projectData[0]?.techComplexity == "Moderate Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Moderate Risk
                        </option>
                        <option
                          value="360"
                          selected={
                            projectData[0]?.techComplexity == "N/A" ? "360" : ""
                          }
                        >
                          N/A
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="domainSpecificChallenges">
                      Domain Specific Challenges
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="dom_spec_challenge_id"
                        onChange={(e) => onChange(e)}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        <option
                          value="357"
                          selected={
                            projectData[0]?.domSpecChallenge == "High Risk"
                              ? "357"
                              : ""
                          }
                        >
                          High Risk
                        </option>
                        <option
                          value="359"
                          selected={
                            projectData[0]?.domSpecChallenge == "Low Risk"
                              ? "359"
                              : ""
                          }
                        >
                          Low Risk
                        </option>
                        <option
                          value="358"
                          selected={
                            projectData[0]?.domSpecChallenge == "Moderate Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Moderate Risk
                        </option>
                        <option
                          value="360"
                          selected={
                            projectData[0]?.domSpecChallenge == "N/A"
                              ? "360"
                              : ""
                          }
                        >
                          N/A
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label
                      className="col-5"
                      htmlFor="skilledResourcesAvailability"
                    >
                      Skilled Resources Availability
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="skill_res_avail_id"
                        onChange={(e) => onChange(e)}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        <option
                          value="357"
                          selected={
                            projectData[0]?.skillResAvail == "High Risk"
                              ? "357"
                              : ""
                          }
                        >
                          High Risk
                        </option>
                        <option
                          value="359"
                          selected={
                            projectData[0]?.skillResAvail == "Low Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Low Risk
                        </option>
                        <option
                          value="358"
                          selected={
                            projectData[0]?.skillResAvail == "Moderate Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Moderate Risk
                        </option>
                        <option
                          value="360"
                          selected={
                            projectData[0]?.skillResAvail == "N/A" ? "360" : ""
                          }
                        >
                          N/A
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="depdThirdPartySystems">
                      Dependencies On Third Party Systems
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="dep_third_party_sys_id"
                        onChange={(e) => onChange(e)}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        <option
                          value="357"
                          selected={
                            projectData[0]?.depThirdPartySys == "High Risk"
                              ? "357"
                              : ""
                          }
                        >
                          High Risk
                        </option>
                        <option
                          value="359"
                          selected={
                            projectData[0]?.depThirdPartySys == "Low Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Low Risk
                        </option>
                        <option
                          value="358"
                          selected={
                            projectData[0]?.depThirdPartySys == "Moderate Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Moderate Risk
                        </option>
                        <option
                          value="360"
                          selected={
                            projectData[0]?.depThirdPartySys == "N/A"
                              ? "360"
                              : ""
                          }
                        >
                          N/A
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label
                      className="col-5"
                      htmlFor="devpEnvironmentAvailability"
                    >
                      Development Environment Availability
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="dev_env_avail_id"
                        onChange={(e) => onChange(e)}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        <option
                          value="357"
                          selected={
                            projectData[0]?.devEnvAvail == "High Risk"
                              ? "357"
                              : ""
                          }
                        >
                          High Risk
                        </option>
                        <option
                          value="359"
                          selected={
                            projectData[0]?.devEnvAvail == "Low Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Low Risk
                        </option>
                        <option
                          value="358"
                          selected={
                            projectData[0]?.devEnvAvail == "Moderate Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Moderate Risk
                        </option>
                        <option
                          value="360"
                          selected={
                            projectData[0]?.devEnvAvail == "N/A" ? "360" : ""
                          }
                        >
                          N/A
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="custEnvId">
                      Dependencies on customer/Customer Environment
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="cust_env_id"
                        onChange={(e) => onChange(e)}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        <option
                          value="357"
                          selected={
                            projectData[0]?.custEnv == "High Risk" ? "357" : ""
                          }
                        >
                          High Risk
                        </option>
                        <option
                          value="359"
                          selected={
                            projectData[0]?.custEnv == "Low Risk" ? "358" : ""
                          }
                        >
                          Low Risk
                        </option>
                        <option
                          value="358"
                          selected={
                            projectData[0]?.custEnv == "Moderate Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Moderate Risk
                        </option>
                        <option
                          value="360"
                          selected={
                            projectData[0]?.custEnv == "N/A" ? "360" : ""
                          }
                        >
                          N/A
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className=" col-md-12 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="profitabilityId">
                      Margin/Profitability
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="profitability_id"
                        onChange={(e) => onChange(e)}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                      >
                        <option value=""> &lt;&lt;Please Select&gt;&gt;</option>
                        <option
                          value="357"
                          selected={
                            projectData[0]?.profitability == "High Risk"
                              ? "357"
                              : ""
                          }
                        >
                          High Risk
                        </option>
                        <option
                          value="359"
                          selected={
                            projectData[0]?.profitability == "Low Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Low Risk
                        </option>
                        <option
                          value="358"
                          selected={
                            projectData[0]?.profitability == "Moderate Risk"
                              ? "358"
                              : ""
                          }
                        >
                          Moderate Risk
                        </option>
                        <option
                          value="360"
                          selected={
                            projectData[0]?.profitability == "N/A" ? "360" : ""
                          }
                        >
                          N/A
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="group mb-0 col-md-8 customCard">
            <h2>
              {" "}
              <RiProfileLine /> Project KPIs
            </h2>
            <table className="table table-striped table-bordered  display">
              <thead>
                <tr>
                  <th width="15%">KPI</th>
                  <th width="8%">Preliminary</th>
                  <th width="13%">Contracted</th>
                  <th width="11%">Planned</th>
                  <th width="11%">Actual</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td width="8%">Schedule</td>
                  <td width="13%" id="cont_efforts">
                    {projectData[0]?.preStartDate == null
                      ? " "
                      : moment(projectData[0]?.preStartDate).format(
                          "DD-MMM-yyyy"
                        )}
                    to
                    {projectData[0]?.preEndDate == null
                      ? " "
                      : moment(projectData[0]?.preEndDate).format(
                          "DD-MMM-yyyy"
                        )}
                  </td>
                  <td width="13%" id="pln_efforts">
                    <div className="group-content row">
                      <DatePicker
                        id="contStartDate"
                        className=""
                        selected={conStartDate}
                        dateFormat="dd-MMM-yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        Value={projectData[0]?.contStartDate}
                        onChange={(e) => {
                          SetConStartDate(e);
                          setProjectData((ps) => {
                            const newArr = [...ps];
                            newArr[0]["contStartDate"] =
                              moment(e).format("yyyy-MM-DD");
                            return newArr;
                          });
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                      <DatePicker
                        id="contEndDate"
                        className=""
                        selected={conEndDate}
                        dateFormat="dd-MMM-yyyy"
                        showMonthDropdown
                        Value={projectData[0]?.contEndDate}
                        showYearDropdown
                        dropdownMode="select"
                        onChange={(e) => {
                          SetConEndDate(e);
                          setProjectData((ps) => {
                            const newArr = [...ps];

                            newArr[0]["contEndDate"] =
                              moment(e).format("yyyy-MM-DD");

                            return newArr;
                          });
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                  </td>
                  <td width="11%" id="ptd_efforts">
                    <div className="group-content row">
                      <DatePicker
                        id="plandStartDate"
                        className=""
                        selected={planStartDate}
                        dateFormat="dd-MMM-yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        onChange={(e) => {
                          SetPlanStartDate(e);
                          setProjectData((ps) => {
                            const newArr = [...ps];

                            newArr[0]["plandStartDate"] =
                              moment(e).format("yyyy-MM-DD");

                            return newArr;
                          });
                        }}
                        maxDate={planStartDate}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                      <DatePicker
                        id="plandEndDate"
                        className=""
                        selected={planEndDate}
                        dateFormat="dd-MMM-yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        onChange={(e) => {
                          SetPlanEndDate(e);
                          setProjectData((ps) => {
                            const newArr = [...ps];

                            newArr[0]["plandEndDate"] =
                              moment(e).format("yyyy-MM-DD");

                            return newArr;
                          });
                        }}
                        minDate={planEndDate}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div className="group-content row">
                      <DatePicker
                        id="actStartDate"
                        type="text"
                        selected={actStartDate}
                        dateFormat="dd-MMM-yyyy"
                        showMonthDropdown
                        showYearDropdown
                        placeholderText={
                          actStartDate === undefined ? "Actual Start Date" : ""
                        }
                        onChange={(e) => {
                          SetActStartDate(e);
                          setProjectData((ps) => {
                            const newArr = [...ps];

                            newArr[0]["actStartDate"] =
                              moment(e).format("yyyy-MM-DD");

                            return newArr;
                          });
                        }}
                        maxDate={actStartDate}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />

                      <input
                        className="col-6 disableField"
                        type="text"
                        disabled
                        placeholder="Actual End Date"
                        Value={
                          actEndDate === ""
                            ? projectData[0]?.actEndDate === null ||
                              projectData[0]?.actEndDate === undefined
                              ? ""
                              : moment(projectData[0]?.actEndDate).format(
                                  "DD-MMM-yyyy"
                                )
                            : actEndDate === null
                            ? ""
                            : moment(actEndDate).format("DD-MMM-yyyy")
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Duration (Days)</td>
                  <td id="cont_rev">
                    <div>
                      <input
                        className="disableField"
                        type="text"
                        disabled
                        defaultValue={kpiData[0]?.preliminary_duration}
                      />
                    </div>
                  </td>
                  <td id="pln_rev">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        Value={conDateDiff}
                      />
                    </div>
                  </td>
                  <td id="ptd_rev">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        Value={plnDateDiff}
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        className="disableField"
                        type="text"
                        disabled
                        Value={kpiData[0]?.actual_duration}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    FTE{" "}
                    <FaInfoCircle
                      className=""
                      title="FTE=Effort/(Duration*8)"
                    />
                  </td>
                  <td id="cont_dc">
                    <div>
                      <input
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        id="priliminaryFte"
                        className="cancel"
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        type="text"
                        value={
                          projectData[0]?.fte == null ? 0 : projectData[0]?.fte
                        }
                      />
                    </div>
                  </td>
                  <td id="pln_dc">
                    <div>
                      <input
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        className="disableField cancel"
                        id="contractFte"
                        type="text"
                        disabled
                        value={
                          // kpiData[0]?.contracted_fte == null
                          //   ? 0
                          //   : kpiData[0]?.contracted_fte
                          plnFTE
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dc">
                    <div>
                      <input
                        className="disableField"
                        type="text"
                        disabled
                        value={
                          // kpiData[0]?.planned_fte == null
                          //   ? 0
                          //   : kpiData[0]?.planned_fte
                          conFTE
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        className="disableField cancel"
                        type="text"
                        disabled
                        value={
                          kpiData[0]?.actual_fte == null
                            ? 0
                            : (kpiData[0]?.actual_fte + 0.01).toFixed(2)
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Effort (Hrs)</td>
                  <td id="cont_oc">
                    <div
                      className="cancel"
                      ref={(ele) => {
                        ref.current[25] = ele;
                      }}
                    >
                      <input
                        className="cancel"
                        id="priliminaryEfforts"
                        type="text"
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        Value={
                          typeof efforts.priliminaryEfforts === "number"
                            ? efforts.priliminaryEfforts.toFixed(2)
                            : efforts.priliminaryEfforts === ""
                            ? "0.00"
                            : efforts.priliminaryEfforts === null
                            ? "N/A"
                            : efforts.priliminaryEfforts
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_oc">
                    <div
                      className="cancel"
                      ref={(ele) => {
                        ref.current[26] = ele;
                      }}
                    >
                      <input
                        id="contractedEfforts"
                        className="cancel"
                        type="text"
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        Value={
                          typeof efforts.contractedEfforts === "number"
                            ? efforts.contractedEfforts.toFixed(2)
                            : efforts.contractedEfforts === ""
                            ? "0.00"
                            : efforts.contractedEfforts === null
                            ? "N/A"
                            : efforts.contractedEfforts
                        }
                      />
                    </div>
                  </td>
                  <td id="atd_oc">
                    <div>
                      <input
                        className="disableField cancel"
                        type="text"
                        disabled
                        Value={
                          kpiData[0]?.planned_hours == null
                            ? 0
                            : kpiData[0]?.planned_hours?.toLocaleString("en-IN")
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        className="disableField cancel"
                        type="text"
                        disabled
                        Value={
                          kpiData[0]?.actual_hours == null
                            ? 0
                            : kpiData[0]?.actual_hours?.toLocaleString("en-IN")
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Revenue</td>
                  <td id="revenue">
                    <div
                      className="cancel"
                      ref={(ele) => {
                        ref.current[27] = ele;
                      }}
                    >
                      <input
                        id="revenue"
                        // className="cancel"
                        type="text"
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        Value={
                          typeof revenue.revenue === "number"
                            ? revenue.revenue.toFixed(2)
                            : revenue.revenue === ""
                            ? "0.00"
                            : revenue.revenue === null
                            ? "N/A"
                            : revenue.revenue
                        }
                      />
                    </div>
                  </td>
                  <td id="pln_margin">
                    <div
                      className="cancel"
                      ref={(ele) => {
                        ref.current[28] = ele;
                      }}
                    >
                      <input
                        id="contractedRevenue"
                        className="cancel"
                        type="text"
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        Value={
                          typeof revenue.contractedRevenue === "number"
                            ? revenue.contractedRevenue.toFixed(2)
                            : revenue.contractedRevenue === ""
                            ? "0.00"
                            : revenue.contractedRevenue === null
                            ? "N/A"
                            : revenue.contractedRevenue
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_margin">
                    <div>
                      <input
                        className="disableField"
                        type="text"
                        disabled
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        value={
                          kpiData[0]?.planned_revenue == "" ||
                          kpiData[0]?.planned_revenue == null
                            ? 0
                            : kpiData[0]?.planned_revenue?.toLocaleString(
                                "en-IN"
                              )
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        className="disableField"
                        type="text"
                        disabled
                        value={
                          kpiData[0]?.actual_revenue == null
                            ? 0
                            : kpiData[0]?.actual_revenue?.toLocaleString(
                                "en-IN"
                              )
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Resource Direct Cost</td>
                  <td id="cont_dur">
                    <div
                      className="cancel"
                      ref={(ele) => {
                        ref.current[29] = ele;
                      }}
                    >
                      <input
                        className="cancel"
                        id="priliminaryRDC"
                        name="priliminaryRDC"
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        type="text"
                        Value={
                          typeof directCost.priliminaryRDC === "number"
                            ? directCost.priliminaryRDC.toFixed(2)
                            : directCost.priliminaryRDC === ""
                            ? "0.00"
                            : directCost.priliminaryRDC === null
                            ? "N/A"
                            : directCost.priliminaryRDC
                        }
                      />
                    </div>
                  </td>
                  <td id="pln_dur">
                    <div
                      className="cancel"
                      ref={(ele) => {
                        ref.current[30] = ele;
                      }}
                    >
                      <input
                        id="ContractRDC"
                        type="text"
                        className="cancel"
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        Value={
                          typeof directCost.ContractRDC === "number"
                            ? directCost.ContractRDC.toFixed(2)
                            : directCost.ContractRDC === ""
                            ? "0.00"
                            : directCost.ContractRDC === null
                            ? "N/A"
                            : directCost.ContractRDC
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        className="disableField cancel"
                        type="text"
                        disabled
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        Value={
                          kpiData[0]?.planned_direct_cost == null
                            ? 0
                            : kpiData[0]?.planned_direct_cost?.toLocaleString(
                                "en-IN"
                              )
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        className="disableField"
                        type="text"
                        disabled
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        value={
                          kpiData[0]?.actual_direct_cost == null
                            ? 0
                            : kpiData[0]?.actual_direct_cost?.toLocaleString(
                                "en-IN"
                              )
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Other Cost</td>
                  <td id="cont_dur">
                    <div
                      className="cancel"
                      ref={(ele) => {
                        ref.current[31] = ele;
                      }}
                    >
                      <input
                        id="priliminaryOtherCost"
                        className="cancel"
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        type="text"
                        Value={
                          typeof otherCost.priliminaryOtherCost === "number"
                            ? otherCost.priliminaryOtherCost.toFixed(2)
                            : otherCost.priliminaryOtherCost === ""
                            ? "0.00"
                            : otherCost.priliminaryOtherCost === null
                            ? "N/A"
                            : otherCost.priliminaryOtherCost
                        }
                      />
                    </div>
                  </td>
                  <td id="pln_dur">
                    <div
                      className="cancel"
                      ref={(ele) => {
                        ref.current[32] = ele;
                      }}
                    >
                      <input
                        id="contarctOtherCost"
                        className="cancel"
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        disabled={
                          projectData[0]?.projectStage == "Completed"
                            ? true
                            : false
                        }
                        type="text"
                        Value={
                          typeof otherCost.contarctOtherCost === "number"
                            ? otherCost.contarctOtherCost.toFixed(2)
                            : otherCost.contarctOtherCost === ""
                            ? "0.00"
                            : otherCost.contarctOtherCost === null
                            ? "N/A"
                            : otherCost.contarctOtherCost
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        value={
                          kpiData[0]?.planned_other_cost == null
                            ? 0
                            : kpiData[0]?.planned_other_cost?.toLocaleString(
                                "en-IN"
                              )
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        className="disableField"
                        type="text"
                        disabled
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        value={
                          kpiData[0]?.actual_other_cost == null
                            ? 0
                            : kpiData[0]?.actual_other_cost?.toLocaleString(
                                "en-IN"
                              )
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    Gross Margin{" "}
                    <FaInfoCircle
                      className=""
                      title="GrossMargin=Revenue-(RDC+OC)"
                    />
                  </td>
                  <td id="cont_dur">
                    <div>
                      <input
                        disabled
                        className="disableField"
                        type="text"
                        onChange={(e) => {
                          const input = e.target.value;
                          const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers

                          if (!regex.test(input)) {
                            e.target.value = input.replace(/[^0-9.]/g, ""); // Remove non-numeric characters
                          }
                          onchangeForAll(e);
                        }}
                        value={resultPreGrossMargin}
                      />
                    </div>
                  </td>
                  <td id="pln_dur">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        value={contractResult}
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        value={
                          kpiData[0]?.planned_revenue == null
                            ? container.textContent + " " + 0
                            : container.textContent +
                              " " +
                              (
                                kpiData[0]?.planned_revenue -
                                (kpiData[0]?.planned_direct_cost +
                                  kpiData[0]?.planned_other_cost)
                              )?.toLocaleString("en-IN")
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        value={
                          kpiData[0]?.actual_revenue == null
                            ? container.textContent + " " + 0
                            : container.textContent +
                              " " +
                              (
                                kpiData[0]?.actual_revenue -
                                (kpiData[0]?.actual_direct_cost +
                                  kpiData[0]?.actual_other_cost)
                              )?.toLocaleString("en-IN")
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    GM %{" "}
                    <FaInfoCircle
                      className=""
                      title="GM %=(Revenue-(RDC+OC)/Revenue)*100"
                    />
                  </td>
                  <td id="cont_dur">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        value={resultGM}
                      />
                    </div>
                  </td>
                  <td id="pln_dur">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        value={contractGMResult}
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        value={
                          kpiData[0]?.planned_revenue == null
                            ? "NA"
                            : (
                                Math.round(
                                  (((kpiData[0]?.planned_revenue -
                                    (kpiData[0]?.planned_direct_cost +
                                      kpiData[0]?.planned_other_cost)) *
                                    100) /
                                    kpiData[0]?.planned_revenue) *
                                    100
                                ) / 100
                              )?.toLocaleString("en-IN")
                        }
                      />
                    </div>
                  </td>
                  <td id="ptd_dur">
                    <div>
                      <input
                        type="text"
                        className="disableField"
                        disabled
                        value={
                          kpiData[0]?.actual_revenue == null
                            ? "NA"
                            : (
                                Math.round(
                                  (((kpiData[0]?.actual_revenue -
                                    (kpiData[0]?.actual_direct_cost +
                                      kpiData[0]?.actual_other_cost)) *
                                    100) /
                                    kpiData[0]?.actual_revenue) *
                                    100
                                ) / 100
                              )?.toLocaleString("en-IN")
                        }
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ///////////////////////////////////Save & Cancel///////////////////////////////////// */}
        <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-2">
          <button
            className="btn btn-primary"
            type="submit"
            onClick={() => handleClick()}
          >
            <FaSave /> Save
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              getProjectOverviewData();
              getProjectMngr();
              getEfforts();
              getRevenue();
              getDirectCost();
              getOtherCost();
            }}
          >
            <ImCross fontSize={"11px"} /> Cancel
          </button>
        </div>
      </div>
      {open ? <Loader handleAbort={handleAbort} /> : ""}

      {popup ? (
        <StagePopUp
          popup={popup}
          setPopup={setPopup}
          handleDateUpdate={handleDateUpdate}
          handleNo={handleNo}
          popUpValue={popUpValue}
          setStgValue={setStgValue}
          stgValue={stgValue}
        />
      ) : (
        ""
      )}
    </div>
  );
}
export default ProjectEdit;
