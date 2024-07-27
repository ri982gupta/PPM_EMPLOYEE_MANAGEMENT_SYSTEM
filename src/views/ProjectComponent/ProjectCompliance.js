import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { ImSearch } from "react-icons/im";
import { SlExclamation } from "react-icons/sl";
import { VscSave } from "react-icons/vsc";
import { FaCheck, FaSave } from "react-icons/fa";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import DatePicker from "react-datepicker";
import axios from "axios";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import AutoComplete from "./IssuesAutocomplete";
import moment from "moment";
import { environment } from "../../environments/environment";
import { AiFillWarning } from "react-icons/ai";
import FirstTable from "./ProjectCompailanceFirstTable";
import Loader from "../Loader/Loader";
import { BiCheck } from "react-icons/bi";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { Column } from "ag-grid-community";
import { DataTable } from "primereact/datatable";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";

function ProjectCompliance(props) {
  const {
    projectId,
    grp6Items,
    urlState,
    setUrlState,
    setbtnState,
    btnState,
    grp1Items,
    grp2Items,
    grp3Items,
    grp4Items,
  } = props;
  console.log(grp6Items[1].is_write);
  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  const baseUrl = environment.baseUrl;
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  );
  const [managersname, setManagersName] = useState([]);
  const [reviewdonebynames, setReviewDoneByNames] = useState([]);
  const [reviewDate, setReviewDate] = useState(null);
  const [projectData, setProjectData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [comments, setComments] = useState([]);
  const [prjtype, setPrjType] = useState([]);
  const [compliancetable, setComplianceTable] = useState([]);
  const [selecttype, setSelectType] = useState([]);
  const [dropdowns, setDropDowns] = useState([]);
  const [newDate, setNewDate] = useState(new Date());
  const [enableSave, setEnableSave] = useState(false);
  const [enableCopyBtn, setEnableCopyBtn] = useState(false);
  const [validationMessage, setValidationMessage] = useState(false);
  const [validationMessageforcopy, setValidationMessageForCopy] =
    useState(false);
  const [submitdatamessage, setSubmitDataMessage] = useState(false);
  const [copymessage, setCopyMessage] = useState(false);
  let date = moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
  const formattedDate = moment(newDate).format("YYYY-MM-DD HH:mm:ss");
  const [previousmonthdate, setPreviousMonthdate] = useState([]);
  const [loader, setLoader] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [savesubmitmsg, setSaveSubmitMsg] = useState(false);
  const initialValue1 = {};
  const initialValue = {};
  const initialValue2 = {};
  const initialValue3 = {};
  const initialValue4 = {};
  const [pcqracomments, setPcqaComments] = useState(initialValue1);
  const [pmcomments, setPmComments] = useState(initialValue3);
  const [weightagedata, setWeightageData] = useState(initialValue4);
  console.log(weightagedata);
  const [dropdowndata, setDropdownData] = useState(initialValue);
  const [managerid, SetManagerId] = useState([]);
  const [reviewbyid, setRewviewById] = useState([]);
  const [efforthrs, SetEffortHrs] = useState([]);
  const [copyPrevMonth, setcopyPrevMonth] = useState(false);
  const [copyPrevMonthIsvisible, setcopyPrevMonthIsvisible] = useState(true);
  const [pcqasubmitdata, setPcqasubmitData] = useState(false);
  const [pmsubmitdata, setPmSubmitData] = useState(false);
  const [warnMsg, setWarnMsg] = useState(false);
  const [pcqa, setpcqa] = useState(false);
  const [pcqaCompl, setpcqaCompl] = useState(false);
  const [saveBtn, setsaveBtn] = useState(false);
  const [submitBtn, setsubmitBtn] = useState(false);
  const [pm, setpm] = useState(true);
  const [weightage, setWeightage] = useState(initialValue2);
  const [currentMonth1, setCurrentMonth1] = useState(new Date().getMonth());
  const [hideButton, setHideButton] = useState(true);
  const currentMonth = currentDate.getMonth() + 1;
  const [data2, setData2] = useState([]);
  const hideButtonclick = () => {
    const selectedMonth = parseInt(date.split("-")[1]);
    const isCurrentMonth = currentMonth === selectedMonth;
    setHideButton(isCurrentMonth);
  };

  const abortController = useRef(null);
  const enableDisableButtons = () => {
    if (
      compliancetable == undefined ||
      compliancetable == "undefined" ||
      compliancetable.length == 0 ||
      (!compliancetable[0]?.is_pcqa_submit && !compliancetable[0]?.is_pm_submit)
    ) {
      if (isUserManager) {
        setpcqa(true);
        setpcqaCompl(true);
        setsaveBtn(true);
        setsubmitBtn(true);
        setpm(true);
      } else {
        setpm(true);
        setpcqa(false);
        setpcqaCompl(false);
        setsubmitBtn(false);
        if (copyPrevMonthIsvisible) {
          setcopyPrevMonth(true);
        }
      }
    } else if (
      compliancetable[0]?.is_pcqa_submit &&
      !compliancetable[0]?.is_pm_submit
    ) {
      if (isUserManager) {
        setpcqa(true);
        setpcqaCompl(true);
        setsaveBtn(true);
        setsubmitBtn(true);
        setpm(true);
      } else {
        setpm(false);
        setpcqa(false);
        setpcqaCompl(false);
        setsaveBtn(false);
        setsubmitBtn(false);
        if (copyPrevMonthIsvisible) {
          setcopyPrevMonth(true);
        }
      }
    } else if (
      compliancetable[0]?.is_pcqa_submit &&
      compliancetable[0]?.is_pm_submit
    ) {
      if (isUserManager) {
        setpcqa(false);
        setpcqaCompl(false);
        setpm(false);
        setsaveBtn(false);
        setsubmitBtn(false);
      } else {
        setpm(false);
        setpcqa(true);
        setpcqaCompl(true);
        setsaveBtn(true);
        setsubmitBtn(true);
        if (copyPrevMonthIsvisible) {
          setcopyPrevMonth(true);
        }
      }
    } else if (
      !compliancetable[0]?.is_pcqa_submit &&
      compliancetable[0]?.is_pm_submit
    ) {
      if (isUserManager) {
        setpcqa(false);
        setpcqaCompl(false);
        setpm(false);
        setsaveBtn(false);
        setsubmitBtn(false);
      } else {
        setpm(false);
        setpcqa(false);
        setpcqaCompl(false);
        setsaveBtn(false);
        setsubmitBtn(false);
        if (copyPrevMonthIsvisible) {
          setcopyPrevMonth(true);
        }
      }
      if (
        !isUserManager &&
        compliancetable[0]?.is_pcqa_submit == true &&
        compliancetable[0]?.is_pm_submit == false
      ) {
        setsaveBtn(true);
      }
      if (isUserManager && compliancetable.length === 0) {
        setEnableSave(true);
        setpcqa(true);
      }
    }
  };
  //=========================
  useEffect(() => {
    const parse = {
      month: new Date().toISOString(), // Example: Set the month to the current date
    };
    const getCurrentMonthFirstDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const firstDate = new Date(year, month - 1, 1);
      return firstDate;
    };

    const currMonthFirstDate = getCurrentMonthFirstDate();
    const firstDayOfSelMonth = new Date(parse.month);
    const today = new Date();
    const dateSplit = today.toISOString().split("-");

    if (firstDayOfSelMonth < currMonthFirstDate) {
      setEnableSave(false);
      setEnableCopyBtn(false);
    } else if (today > currMonthFirstDate) {
      const enableDays = {
        fromDate: 5,
        toDate: 30,
      };

      if (
        parseInt(dateSplit[2]) >= enableDays.fromDate &&
        parseInt(dateSplit[2]) <= enableDays.toDate
      ) {
        setEnableSave(true);
      } else {
        setEnableSave(false);
      }

      if (compliancetable.length === 0) {
        setEnableCopyBtn(true);
      } else {
        setEnableCopyBtn(false);
      }
    }

    const enableSaveGlobal = 0; // Manually set enableSaveGlobal to 0
    if (compliancetable.length === 0) {
      setEnableSave(true);
    }
  }, []);

  //===============

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  const ref = useRef([]);

  const filterDates = (date) => {
    const selectedMonth = moment(date).startOf("month");
    const currentMonth = moment(currentDate).startOf("month");
    return selectedMonth.isSame(currentMonth, "month");
  };

  const [selectedDate1, setSelectedDate1] = useState(
    compliancetable[0]?.audit_date
      ? moment(compliancetable[0]?.audit_date, "YYYY-MM-DD").toDate()
      : null
  );
  const handleDateChange1 = (date) => {
    const updateDate = [...compliancetable];
    updateDate.forEach((item) => {
      item.audit_date = date;
    });
    setSelectedDate1(date);
  };

  const disablePreviousMonths = (date) => {
    const selectedMonth = moment(date).startOf("month");
    const currentMonth = moment(currentDate).startOf("month");
    return selectedMonth.isBefore(currentMonth, "month");
  };

  const disableFutureMonths = (date) => {
    const selectedMonth = moment(date).startOf("month");
    const currentMonth = moment(currentDate).startOf("month");
    return selectedMonth.isAfter(currentMonth, "month");
  };

  //=======================
  const targetCounts = {};
  const targetSums = {};
  let sum = 0;
  let sumCounts = 0;
  let selectedTargetCount = 0;
  console.log(weightage);
  console.log(compliancetable?.[0]);
  console.log(comments);
  console.log(targetCounts);
  // useEffect(() => {
  //   if (comments.audit_check_point_id) {
  //     const auditCheckPointId = comments.audit_check_point_id.toString();
  //     const updatedWeightage = { ...weightage };

  //     if (updatedWeightage[auditCheckPointId]) {
  //       updatedWeightage[auditCheckPointId].rowDataId =
  //         comments.audit_check_point_id;
  //       updatedWeightage[auditCheckPointId].targetValue =
  //         comments.compliance_val.toString();
  //       updatedWeightage[auditCheckPointId].fieldValue = parseInt(
  //         comments.weightage
  //       );
  //     } else {
  //       updatedWeightage[auditCheckPointId] = {
  //         rowDataId: comments.audit_check_point_id,
  //         targetValue: comments.compliance_val.toString(),
  //         fieldValue: parseInt(comments.weightage),
  //       };
  //     }

  //     setWeightage(updatedWeightage);
  //   }
  // }, [comments, setWeightage]);

  // comments.forEach((comment) => {
  //   const auditCheckPointId = comment.audit_check_point_id.toString();
  //   const weightageData = weightage[auditCheckPointId];

  //   if (weightageData) {
  //     weightageData.rowDataId = comment.audit_check_point_id;
  //     weightageData.fieldValue = parseInt(comment.weightage);
  //     weightageData.targetValue = comment.compliance_val.toString();
  //   } else {
  //     weightage[auditCheckPointId] = {
  //       rowDataId: comment.audit_check_point_id,
  //       fieldValue: parseInt(comment.weightage),
  //       targetValue: comment.compliance_val.toString(),
  //     };
  //   }
  // });

  ///////////////////////////

  useEffect(() => {
    if (comments.length === 0) {
      // Comments data is not available yet, exit early
      return;
    }

    const updatedWeightage = {};

    comments.forEach((comment) => {
      const auditCheckPointId = comment.audit_check_point_id.toString();
      const weightageValue = parseInt(comment.weightage);

      updatedWeightage[auditCheckPointId] = {
        rowDataId: comment.audit_check_point_id,
        fieldValue: isNaN(weightageValue) ? 0 : weightageValue,
        targetValue: comment.compliance_val.toString(),
      };
    });

    setWeightage(updatedWeightage);
  }, [comments]);

  ///////////////////////////////////////////////////////////
  console.log(weightage);

  Object.values(weightage).forEach((value) => {
    const targetValue = value.targetValue;
    const valueFieldValue = value.fieldValue;

    if (["1205", "1206", "1207"].includes(targetValue)) {
      if (targetValue in targetCounts) {
        targetCounts[targetValue]++;
      } else {
        targetCounts[targetValue] = 1;
      }

      if (targetValue in targetSums) {
        targetSums[targetValue] += valueFieldValue;
      } else {
        targetSums[targetValue] = valueFieldValue;
      }
    }
  });

  const targetValuesToSum = ["1205", "1206", "1207"];
  targetValuesToSum.forEach((targetValue) => {
    if (targetValue in targetSums) {
      sum += targetSums[targetValue];
    }
  });

  selectedTargetCount = Object.keys(targetCounts).filter((key) =>
    targetValuesToSum.includes(key)
  ).length;

  sumCounts = Object.values(targetCounts).reduce((acc, count) => {
    if (
      count !== targetCounts["123"] &&
      count !== targetCounts["1208"] &&
      count !== targetCounts["1209"]
    ) {
      return acc + count;
    }
    return acc;
  }, 0);
  //=======================================================

  const [score, setScore] = useState(0);
  const [adherence, setAdherence] = useState(0);
  const [statusColor, setStatusColor] = useState("");
  const [statusText, setStatusText] = useState("");

  console.log(weightagedata);
  console.log(comments);

  // const complianceValues = [1205, 1206, 1207];
  // const weightages = {};

  // complianceValues.forEach((complianceVal) => {
  //   const weightage = comments
  //     .filter((comment) => comment.compliance_val === complianceVal)
  //     .map((comment) => comment.weightage);

  //   weightages[complianceVal] = weightage;
  // });

  // console.log(weightages);

  // let totalCount = 0;
  // let sum1 = 0;

  // complianceValues.forEach((complianceValue) => {
  //   const weightageValues = weightages[complianceValue] || [];
  //   totalCount += weightageValues.length;
  //   sum1 += weightageValues.reduce(
  //     (total, value) => total + parseInt(value),
  //     0
  //   );
  // });
  // let sum1205 = 0;
  // let sum1206 = 0;
  // let sum1207 = 0;

  // weightagedata[1205]?.forEach((value) => {
  //   sum1205 += parseInt(value);
  // });

  // weightages[1206]?.forEach((value) => {
  //   sum1206 += parseInt(value);
  // });

  // weightages[1207]?.forEach((value) => {
  //   sum1207 += parseInt(value);
  // });

  // console.log("Sum for 1205:", sum1205);
  // console.log("Sum for 1206:", sum1206);
  // console.log("Sum for 1207:", sum1207);
  // console.log("Total count:", totalCount);
  // console.log("Sum of values:", sum1);
  // console.log(sum1["1205"]);

  const calculateComplianceScore = () => {
    const fImpl = targetCounts["1205"] || 0;
    const pImpl = targetCounts["1206"] || 0;
    const nImpl = targetCounts["1207"] || 0;

    const obj = {
      fullImpl: targetSums["1205"] || 0,
      partImpl: targetSums["1206"] || 0,
      notImpl: targetSums["1207"] || 0,
      // notyet: targetSums["1208"] || 0,
      // notavilable: targetSums["1209"] || 0
    };

    const implSum = sumCounts;
    const numerator =
      parseInt(fImpl) * obj.fullImpl * 5 + parseInt(pImpl) * obj.partImpl * 3;
    const add =
      parseInt(obj.fullImpl) + parseInt(obj.partImpl) + parseInt(obj.notImpl);
    // +
    // parseInt(obj.notyet + parseInt(obj.notavilable));
    const denominator = parseInt(implSum) * parseInt(add);
    const calculatedScore =
      numerator / denominator === Infinity ? 5 : numerator / denominator;
    const calculatedAdherence =
      calculatedScore === Infinity ? 100 : (calculatedScore / 5) * 100;

    console.log(add);
    console.log("Numerator:", numerator);
    console.log("Denominator:", denominator);
    console.log("calculatedAdherence:", calculatedAdherence);
    console.log("calculatedScore:", calculatedScore);
    console.log("implSum:", implSum);
    console.log("targetCounts:", targetCounts);
    console.log("targetSums:", targetSums);

    console.log("calculatedAdherence:", calculatedAdherence);
    console.log("calculatedScore:", calculatedScore);
    const formattedAdherence = calculatedAdherence.toFixed(2);
    const formattedScore = calculatedScore.toFixed(2);
    setScore(formattedScore);
    setAdherence(calculatedAdherence);
    let calculatedStatusColor = "";
    let calculatedStatusText = "";
    if (calculatedAdherence > 80) {
      calculatedStatusColor = "Green";
      calculatedStatusText = 1211;
    } else if (calculatedAdherence >= 70 && calculatedAdherence < 80) {
      calculatedStatusColor = "Amber";
      calculatedStatusText = 1212;
    } else if (calculatedAdherence < 70) {
      calculatedStatusColor = "Red";
      calculatedStatusText = 1213;
    } else if (isNaN(adherence)) {
      calculatedStatusColor = "Red";
      calculatedStatusText = 1213;
    }
    // console.log(calculatedAdherence + "in line 394...");
    // console.log(calculatedStatusColor + "in line 395....");
    setStatusColor(calculatedStatusColor);
    setStatusText(calculatedStatusText);
    // console.log(statusColor);
    // console.log(statusText);
    // console.log(adherence);
    // console.log(score);
    // console.log(formattedAdherence);
    const updateadherence = [...compliancetable];
    updateadherence.forEach((item) => {
      item.process_adherence = formattedAdherence;
    });

    const updateweightedscore = [...compliancetable];
    updateweightedscore.forEach((item) => {
      item.weighted_score = formattedScore;
    });

    const updatestatus = [...compliancetable];
    updatestatus.forEach((item) => {
      item.status = calculatedStatusText;
    });

    const updatestatusname = [...compliancetable];
    updatestatusname.forEach((item) => {
      item.status_name = calculatedStatusColor;
    });
  };

  useEffect(() => {
    calculateComplianceScore();
  }, []);

  //mbjscfskd----------------------------------------------
  const CompliancData = {
    FullyImplemented: compliancetable[0]?.full_impl_compl
      ? compliancetable[0]?.full_impl_compl
      : 0,
    PartiallyImplemented: compliancetable[0]?.parti_impl_compl
      ? compliancetable[0]?.parti_impl_compl
      : 0,
    NotImplemented: compliancetable[0]?.not_impl_compl
      ? compliancetable[0]?.not_impl_compl
      : 0,
    NotYetImplemented: compliancetable[0]?.not_yet_compl
      ? compliancetable[0]?.not_yet_compl
      : 0,
    NotApplicable: compliancetable[0]?.not_appl_compl
      ? compliancetable[0]?.not_appl_compl
      : 0,
  };
  const oldInitail = {
    // id: "",
    // value: "",
  };
  const newInitail = {
    // id: "",
    // value: "",
  };
  const [oldData, setoldData] = useState(oldInitail);
  const [newData, setnewData] = useState(newInitail);
  // sdjfhsjk ------------------------------
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  // --------------------Getting Project names in Header------------------
  const getProjectOverviewData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/Audit/projectOverviewDetails?projectId=${projectId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setProjectData(resp);
      })
      .catch(function (response) { });
  };
  // ------------------------------------------------For Projects ManagersName--------------------------------------------------------------------------
  const getProjectMgrsByProject = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/QCR/getProjectMgrsByProject?object_id=${projectId}`,
    }).then(function (response) {
      var res = response.data;
      setManagersName(res);
    });
  };

  // ------------------For Projects ReviewNames----------------
  const isUserManager =
    managersname.length > 0 &&
    managersname.some((managersname) => managersname.userid == loggedUserId);

  useEffect(() => {
    getProjectMgrsByProject();
    handleClicktable1();
  }, [isUserManager]);
  const getReviewDonenames = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/QCR/ReviewDoneBy`,
    }).then(function (response) {
      var res = response.data;
      setReviewDoneByNames(res);
    });
  };

  //----------------For ComplianceTabledata-----------------------

  const handleClicktable1 = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/QCR/getComplianceTabledata?project_id=${projectId}&audit_month=${date}`,
    }).then(function (response1) {
      const Getdata = response1.data.map((item) => ({
        ...item,
        // process_adherence: `${item.process_adherence.toFixed(2)} %`,
        weighted_score: `${item.weighted_score.toFixed(2)}`,
        status_name: `${item.status_name == "N/A" ? "" : item.status_name}`,
      }));
      setComplianceTable(Getdata);

      axios({
        method: "get",
        url:
          baseUrl +
          `/ProjectMS/QCR/getComments?project_audit_dtl_id=${Getdata[0]?.id == undefined ? 0 : Getdata[0]?.id
          }`,
      }).then(function (response2) {
        if (response2.data.length == 0) {
          setComments((prevComments) => []);
        }
        const commentsData = response2.data;

        for (let i = 0; i < commentsData.length; i++) {
          if (commentsData[i].remarks === null) {
            commentsData[i].remarks = ""; // Update remarks to an empty string
          }
        }

        setComments(commentsData);
      });
    });
  };
  const commentsdata = () => { };
  const handleCancel = (e) => {
    let ele = document.getElementsByClassName("cancel");

    GlobalCancel(ref);

    for (let index = 0; index < ele.length; index++) {
      ele[index].value = "";

      if (ele[index].classList.contains("reactsearchautocomplete")) {
        ele[index].children[0].children[0].children[0].children[1]?.click();
      }
    }
  };
  //------------------------------------------
  const handelsearch = () => {
    setValidationMessage(false);
    setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/QCR/getProjecttype?id=${projectId}`,
    }).then(function (resposne) {
      const data = resposne.data;
      setPrjType(data);
      setWarnMsg(true);
      axios({
        method: "post",
        url:
          baseUrl +
          `/ProjectMS/QCR/getTabledata?prjtype=${data[0].pcqa_type}&prjPhase=-1&selMonth=${date}`,
      }).then(function (res) {
        const getdata = res.data;
        setTableData(getdata);
      });
    });
  };

  useEffect(() => {
    getReviewDonenames();
    getProjectOverviewData();
    handelsearch();
    handleClicktable1();
    getDropdowns();
    commentsdata();
    previousMonth();
    enableDisableButtons();
  }, []);
  //------------------------DropDowns for ComplianceTabledata------------------------
  const getDropdowns = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/QCR/ComplianceDropDowns`,
    }).then(function (res) {
      var response = res.data;
      setDropDowns(response);
    });
  };
  const handleKeyDown = (event) => {
    const alphanumericRegex = /^[0-9a-zA-Z]+$/;

    if (!alphanumericRegex.test(event.key)) {
      event.preventDefault();
    }
  };
  const handleSelectChange = (selectedValue) => {
    const selectedOption = parseInt(selectedValue);

    const updatedComplianceTable = [...compliancetable];
    updatedComplianceTable[0] = {
      ...updatedComplianceTable[0],
      audit_state: selectedOption,
    };
    setSelectType(selectedOption);
    setComplianceTable(updatedComplianceTable);
  };

  const [isPreviousMonth, setIsPreviousMonth] = useState(false);
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const previousMonth = currentMonth - 1;

    setIsPreviousMonth(date === previousMonth);
  }, []);
  //----------------------------------------Posting The Data To The Table-----------------------------------
  console.log(dropdowndata);
  const Save = async (rowData) => {
    let valid = GlobalValidation(ref);

    if (valid) {
      setValidationMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setValidationMessageForCopy(false);
      setSubmitDataMessage(false);

      // setTimeout(() => {
      //   setValidationMessage(false);
      // }, 3000);

      return;
    }

    const processAdherence = parseFloat(
      compliancetable[0]?.process_adherence == null
        ? 0.0
        : compliancetable[0]?.process_adherence
    );

    setLoader(true);
    const datecreated = moment(compliancetable[0]?.date_created).format(
      "YYYY-MM-DD HH:mm:ss"
    );
    console.log(processAdherence);
    try {
      const response = await axios({
        method: "post",
        url: baseUrl + `/ProjectMS/QCR/UpdateProjectAudit`,
        data: {
          id: compliancetable[0]?.id,
          project_id: projectId,
          audit_date: moment(compliancetable[0]?.audit_date).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          audit_month:
            compliancetable[0]?.audit_month == null
              ? date
              : compliancetable[0]?.audit_month,
          is_pcqa_submit:
            compliancetable[0]?.is_pcqa_submit === true
              ? 1
              : compliancetable[0]?.is_pcqa_submit === false
                ? 0
                : compliancetable[0]?.is_pcqa_submit === null
                  ? 0
                  : 0,
          is_pm_submit:
            compliancetable[0]?.is_pm_submit === true
              ? 1
              : compliancetable[0]?.is_pm_submit === false
                ? 0
                : compliancetable[0]?.is_pm_submit === null
                  ? 0
                  : 0,
          audit_state:
            compliancetable[0]?.audit_state == null
              ? selecttype
              : compliancetable[0]?.audit_state,
          prj_mgr_id:
            compliancetable[0]?.prj_mgr_id == null
              ? managerid
              : compliancetable[0]?.prj_mgr_id,
          review_by_id:
            compliancetable[0]?.review_by_id == null
              ? reviewbyid
              : compliancetable[0]?.review_by_id,
          effort_hrs:
            compliancetable[0]?.effort_hrs == null
              ? efforthrs
              : compliancetable[0]?.effort_hrs,
          proj_state_id:
            compliancetable[0]?.proj_state_id == null
              ? 1814
              : compliancetable[0]?.proj_state_id,
          full_impl_compl:
            targetCounts["1205"] == null ? 0 : targetCounts["1205"],
          parti_impl_compl:
            targetCounts["1206"] == null ? 0 : targetCounts["1206"],
          not_impl_compl:
            targetCounts["1207"] == null ? 0 : targetCounts["1207"],
          not_yet_compl:
            compliancetable[0]?.not_yet_compl == null
              ? 0
              : compliancetable[0]?.not_yet_compl,
          not_appl_compl:
            compliancetable[0]?.not_appl_compl == null
              ? 0
              : compliancetable[0]?.not_appl_compl,
          weighted_score:
            compliancetable[0]?.weighted_score == null
              ? 0.0
              : compliancetable[0]?.weighted_score,
          process_adherence: processAdherence,
          status:
            compliancetable[0]?.status == null
              ? 1214
              : compliancetable[0]?.status,
          date_created: datecreated == null ? formattedDate : datecreated,
          last_updated: formattedDate,
        },
      }).then(async function (response) {
        const saveddata = response.data;
        // let data = [];
        const data = [];

        const processComment = (ele) => {
          const rowComment = comments.find(
            (comment) => comment.audit_check_point_id === +ele
          );
          console.log(rowComment?.weightage);
          console.log(weightagedata[+ele]?.fieldValue);
          const obj = {};
          obj["project_audit_dtl_id"] =
            compliancetable[0]?.id == null
              ? response?.data?.qcrdomain?.id
              : compliancetable[0]?.id;
          obj["audit_check_point_id"] = +ele;
          obj["compliance_val"] =
            dropdowndata[ele] === null || dropdowndata[ele] === undefined
              ? rowComment.compliance_val
              : parseInt(dropdowndata[ele]);
          obj["weightage"] =
            weightagedata[+ele]?.fieldValue === null ||
              weightagedata[+ele]?.fieldValue == undefined ||
              weightagedata[+ele]?.fieldValue == ""
              ? rowComment?.weightage
              : weightagedata[+ele]?.fieldValue;
          obj["remarks"] =
            pcqracomments[ele] === undefined
              ? rowComment?.remarks
              : pcqracomments[ele];
          obj["pm_remarks"] = pmcomments[ele] ?? "";
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

        Object.keys(pmcomments).forEach((ele) => {
          if (!pcqracomments[ele]) {
            processComment(ele);
          }
        });

        const res = await axios({
          method: "post",
          url: baseUrl + `/ProjectMS/QCR/UpdateData`,
          data: data,
        });
        handelsearch();
        handleClicktable1();
        setLoader(false);
        setAddmsg(true);
        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(() => {
          setAddmsg(false);
          setLoader(false);
        }, 3000);
      });
    } catch (error) {
      setLoader(false);
    }
  };
  //=====================================

  useEffect(() => {
    if (compliancetable.length === 0 && !isUserManager) {
      setPcqasubmitData(true);
      // setPmSubmitData(false);
    } else if (compliancetable.length === 0 && isUserManager) {
      setPmSubmitData(true);
      setPcqasubmitData(false);
    } else if (compliancetable[0]?.is_pcqa_submit == true && isUserManager) {
      // setPcqasubmitData(false);
      setPmSubmitData(true);
      setPcqasubmitData(true);
    }
  }, [compliancetable, isUserManager]);
  console.log(compliancetable);
  const submit = () => {
    if (compliancetable.length == 0) {
      setSubmitDataMessage(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setValidationMessage(false);
    } else {
      const processAdherence = parseFloat(
        compliancetable[0]?.process_adherence == null
          ? 0.0
          : compliancetable[0]?.process_adherence
      );
      console.log(processAdherence);
      console.log(compliancetable[0]?.weighted_score);
      // setLoader(true);
      const datecreated = moment(compliancetable[0]?.date_created).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      console.log(compliancetable);
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/QCR/UpdateProjectAudit`,
        data: {
          id: compliancetable[0]?.id,
          project_id: projectId,
          audit_date: moment(compliancetable[0]?.audit_date).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          audit_month:
            compliancetable[0]?.audit_month == null
              ? date
              : compliancetable[0]?.audit_month,
          is_pcqa_submit:
            pcqasubmitdata === true
              ? 1
              : pcqasubmitdata === false
                ? 0
                : pcqasubmitdata,

          is_pm_submit:
            pmsubmitdata === true
              ? 1
              : pmsubmitdata === false
                ? 0
                : pmsubmitdata,

          audit_state:
            compliancetable[0]?.audit_state == null
              ? selecttype
              : compliancetable[0]?.audit_state,
          prj_mgr_id:
            compliancetable[0]?.prj_mgr_id == null
              ? managerid
              : compliancetable[0]?.prj_mgr_id,
          review_by_id:
            compliancetable[0]?.review_by_id == null
              ? reviewbyid
              : compliancetable[0]?.review_by_id,
          effort_hrs:
            compliancetable[0]?.effort_hrs == null
              ? efforthrs
              : compliancetable[0]?.effort_hrs,
          proj_state_id:
            compliancetable[0]?.proj_state_id == null
              ? 1814
              : compliancetable[0]?.proj_state_id,
          full_impl_compl:
            targetCounts["1205"] == null ? 0 : targetCounts["1205"],
          parti_impl_compl:
            targetCounts["1206"] == null ? 0 : targetCounts["1206"],
          not_impl_compl:
            targetCounts["1207"] == null ? 0 : targetCounts["1207"],
          not_yet_compl:
            targetCounts["1208"] == null ? 0 : targetCounts["1208"],
          not_appl_compl:
            targetCounts["1209"] == null ? 0 : targetCounts["1209"],
          weighted_score:
            compliancetable[0]?.weighted_score == null
              ? 0.0
              : compliancetable[0]?.weighted_score,
          process_adherence: processAdherence,
          status:
            compliancetable[0]?.status == null
              ? 1214
              : compliancetable[0]?.status,
          date_created: datecreated == null ? formattedDate : datecreated,
          last_updated: formattedDate,
        },
      }).then(function (response) {
        handelsearch();
        handleClicktable1();
        setLoader(false);
        setSaveSubmitMsg(true);
        window.scrollTo({ top: 0, behavior: "smooth" });

        setValidationMessageForCopy(false);
        setCopyMessage(false);

        setTimeout(() => {
          setSaveSubmitMsg(false);
          setLoader(false);
        }, 3000);
      });
    }
    // });
  };
  //-------------------------------------copyPrevMonthPrjAuditChkLists---------------------

  const previousMonth = () => {
    axios({
      method: "get",
      url:
        baseUrl + `/ProjectMS/QCR/getRecentAuditDate?project_id=${projectId}`,
    }).then(function (res) {
      const response = res.data[0];
      setPreviousMonthdate(response);
    });
  };

  const Copydata = () => {
    axios({
      method: "post",
      url:
        baseUrl +
        `/ProjectMS/QCR/copyPrevMonthPrjAuditChkLists?prjId=${projectId}&cpMonth=${date}`,
    }).then(function (res) {
      const response = res.data;

      if (response[0]?.dataExists == false) {
        setValidationMessageForCopy(true);
        window.scrollTo({ top: 0, behavior: "smooth" });

        setValidationMessage(false);
        setSubmitDataMessage(false);
      } else {
        setValidationMessageForCopy(false);
        axios({
          method: "get",
          url:
            baseUrl +
            `/ProjectMS/QCR/getComplianceTabledata?project_id=${projectId}&audit_month=${previousmonthdate.recent_audit_month}`,
        }).then(function (response1) {
          const Getdata = response1.data.map((item) => ({
            ...item,
            process_adherence: `${item.process_adherence.toFixed(2)} %`,
            weighted_score: `${item.weighted_score.toFixed(2)}`,
            status_name: `${item.status_name == "N/A" ? "" : item.status_name}`,
          }));
          setComplianceTable(Getdata);

          axios({
            method: "get",
            url:
              baseUrl +
              `/ProjectMS/QCR/getComments?project_audit_dtl_id=${Getdata[0]?.id}`,
          }).then(function (response2) {
            const commentsData = response2.data;
            setCopyMessage(true);
            setTimeout(() => {
              setCopyMessage(false);
            }, 3000);

            setComments(commentsData);
          });
        });
      }
    });
  };

  // breadcrumbs --

  const [routes, setRoutes] = useState([]);
  let textContent = "Delivery";
  let currentScreenName = ["Projects", "Compliance", "QCR"];
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
      // console.log(sortedSubMenus);
      setData2(sortedSubMenus);

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
        `/CommonMS/security/authorize?url=/project/auditCheckList&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  //==============================================================
  const [dropdownValues, setDropdownValues] = useState({});
  const [previousOption, setPreviousOption] = useState("");

  const [finalComments, setFinalComments] = useState([]);

  comments?.map((data) => {
    tableData?.map((value) => {
      if (data.audit_check_point_id == value.id) {
        value["compliance_val"] = data.compliance_val;
        value["remarks_id"] = data.id;
        value["pm_remarks"] = data.pm_remarks;
        value["project_audit_dtl_id"] = data.project_audit_dtl_id;
        value["remarks"] = data.remarks;
        value["weightage"] = data.weightage;
      }
    });
  });

  const onChangeSetDate = (e, rowData) => {
    setDropdownData((prev) => ({
      ...prev,
      [rowData.id]: e?.target?.value,
    }));
  };
  let previousValues = [];

  useEffect(() => {
    calculateComplianceScore();
  }, []);

  const handalChange = (e, rowData, decrementOption) => {
    console.log(compliancetable[0]?.audit_state);
    let fieldValue;

    if (compliancetable[0]?.audit_state === 1184) {
      fieldValue = rowData.initiation_weightage;
    } else if (compliancetable[0]?.audit_state === 1185) {
      fieldValue = rowData.steady_state_weightage;
    } else if (compliancetable[0]?.audit_state === 1186) {
      fieldValue = rowData.closure_weightage;
    } else {
      fieldValue = 0;
    }
    // setWeightageData((prev) => {
    //   const updatedData = { ...prev };
    //   updatedData[rowData.id] = {
    //     rowDataId: rowData.id,
    //     fieldValue: fieldValue,
    //     targetValue: e.target.value,
    //   };
    //   return updatedData;
    // });

    console.log(fieldValue);

    if (compliancetable[0]?.audit_state === 1184) {
      fieldValue = rowData.initiation_weightage;
    } else if (compliancetable[0]?.audit_state === 1185) {
      fieldValue = rowData.steady_state_weightage;
    } else if (compliancetable[0]?.audit_state === 1186) {
      fieldValue = rowData.closure_weightage;
    } else {
      fieldValue = 0;
    }
    previousValues.push(fieldValue);

    // setWeightage((prev) => {
    //   const updatedWeightage = { ...prev };
    //   if (fieldValue === prev[rowData.id]?.fieldValue) {
    //     delete updatedWeightage[rowData.id];
    //   } else {
    //     updatedWeightage[rowData.id] = {
    //       rowDataId: rowData.id,
    //       fieldValue: fieldValue,
    //       targetValue: e.target.value,
    //     };
    //   }
    //   return updatedWeightage;
    // });
    setWeightageData((prevData) => {
      const updatedData = {
        ...prevData,
        [rowData.id]: {
          rowDataId: rowData.id,
          fieldValue: fieldValue,
          targetValue: e.target.value,
        },
      };

      setWeightage((prevWeightage) => ({
        ...prevWeightage,
        ...updatedData,
      }));

      return updatedData;
    });

    console.log(JSON.stringify(weightage) + "in OnChange....");

    setDropdownData((prev) => ({
      ...prev,
      [rowData.id]: e?.target?.value,
    }));

    const updatedComplianceTable = [...compliancetable];
    setValidationMessage(false);
    if (e?.target?.value == "1205") {
      const fullyImplemented = updatedComplianceTable[0]?.full_impl_compl || 0;

      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        full_impl_compl: fullyImplemented + 1,
      };
    }

    if (e?.target?.value == "1206") {
      const partiallyImplemented =
        updatedComplianceTable[0]?.parti_impl_compl || 0;
      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        parti_impl_compl: partiallyImplemented + 1,
      };
    }

    if (e?.target?.value === "1207") {
      const notImplemented = updatedComplianceTable[0]?.not_impl_compl || 0;
      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        not_impl_compl: notImplemented + 1,
      };
    }

    if (e?.target?.value == "1208") {
      const notYet = updatedComplianceTable[0]?.not_yet_compl || 0;
      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        not_yet_compl: notYet + 1,
      };
    }

    if (e?.target?.value == "1209") {
      const notApplicable = updatedComplianceTable[0]?.not_appl_compl || 0;
      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        not_appl_compl: notApplicable + 1,
      };
    }
    if (decrementOption == "1205") {
      const fullyImplemented = updatedComplianceTable[0]?.full_impl_compl || 0;
      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        full_impl_compl: fullyImplemented - 1,
      };
    }

    if (decrementOption == "1206") {
      const partiallyImplemented =
        updatedComplianceTable[0]?.parti_impl_compl || 0;
      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        parti_impl_compl: partiallyImplemented - 1,
      };
    }

    if (decrementOption == "1207") {
      const notImplemented = updatedComplianceTable[0]?.not_impl_compl || 0;
      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        not_impl_compl: notImplemented - 1,
      };
    }

    if (decrementOption == "1208") {
      const notYet = updatedComplianceTable[0]?.not_yet_compl || 0;
      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        not_yet_compl: notYet - 1,
      };
    }

    if (decrementOption == "1209") {
      const notApplicable = updatedComplianceTable[0]?.not_appl_compl || 0;
      updatedComplianceTable[0] = {
        ...updatedComplianceTable[0],
        not_appl_compl: notApplicable - 1,
      };
    }

    updatedComplianceTable[0] = {
      ...updatedComplianceTable[0],
      [rowData.id]: e.target.value,
    };
    setComplianceTable(updatedComplianceTable);
    console.log(compliancetable[0] + "in line 1916.....");
  };
  console.log(compliancetable[0] + "in line 1918.....");

  useEffect(() => {
    calculateComplianceScore();
  }, [weightage]);

  const handlechangeComments = (e, rowData) => {
    setPcqaComments((prev) => ({
      ...prev,
      [rowData.id]: e,
    }));
  };

  const handlechangePMComments = (e, rowData) => {
    setPmComments((prev) => ({
      ...prev,
      [rowData.id]: e,
    }));
  };

  const renderSNo = (rowData, column) => {
    const index = tableData.indexOf(rowData);
    const sNo = index + 1;
    return <span title={sNo}>{sNo}</span>;
  };

  const getFieldBasedOnType = (rowData) => {
    if (compliancetable[0]?.audit_state === 1184) {
      return (
        <div title={rowData.initiation_weightage}>
          {rowData.initiation_weightage}
        </div>
      );
    } else if (compliancetable[0]?.audit_state === 1185) {
      return (
        <div title={rowData.steady_state_weightage}>
          {rowData.steady_state_weightage}
        </div>
      );
    } else if (compliancetable[0]?.audit_state === 1186) {
      return (
        <div title={rowData.closure_weightage}>{rowData.closure_weightage}</div>
      );
    } else if (selecttype === 1184) {
      return (
        <div title={rowData.initiation_weightage}>
          {rowData.initiation_weightage}
        </div>
      );
    } else if (selecttype === 1185) {
      return (
        <div title={rowData.steady_state_weightage}>
          {rowData.steady_state_weightage}
        </div>
      );
    } else if (selecttype === 1186) {
      return (
        <div title={rowData.closure_weightage}>{rowData.closure_weightage}</div>
      );
    } else if (selecttype === "null") {
      return <div title="0">0</div>;
    }
    return <div title="0">0</div>;
  };

  const ComplianceBodyTemplate = (rowData, getFieldBasedOnType) => {
    return (
      <>
        {compliancetable.length === 0 && grp6Items[1].is_write === true ? (
          <select
            id="lkup_name"
            className="cancel"
            name="lkup_name"
            onFocus={(e) => {
              setPreviousOption(e.target.value, rowData.compliance_val);
            }}
            onChange={(e) => {
              if (
                Array.isArray(compliancetable) &&
                compliancetable.length === 0
              ) {
                setValidationMessage(true);
                const newData = {
                  ...dropdownValues,
                  [rowData.id]: "null" || rowData.compliance_val,
                };
                setDropdownValues(newData);
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                setValidationMessage(false);
                const data = rowData.id;
                // onChangeSetDate(e, rowData)
                handalChange(e, rowData, previousOption);
                const newValue = e.target.value;
                setPreviousOption(newValue);
                const newData = {
                  ...dropdownValues,
                  [rowData.id]: newValue,
                };

                setDropdownValues(newData);
              }
            }}
            value={dropdownValues[rowData.id] || "123"}
            disabled={
              compliancetable[0]?.is_pcqa_submit === true ||
              (isUserManager && compliancetable.length === 0) ||
              pcqaCompl === true
            }
            style={{
              cursor:
                compliancetable[0]?.is_pcqa_submit || pcqaCompl === true
                  ? "not-allowed"
                  : "auto",
              backgroundColor:
                compliancetable[0]?.is_pcqa_submit || pcqaCompl === true
                  ? "#eee"
                  : "white",
              opacity:
                compliancetable[0]?.is_pcqa_submit || pcqaCompl === true
                  ? 1
                  : "inherit",
              color:
                compliancetable[0]?.is_pcqa_submit || pcqaCompl === true
                  ? "#999"
                  : "inherit",
            }}
          >
            <option value="123">&lt;&lt;Please Select&gt;&gt;</option>
            {dropdowns?.map((Item) => (
              <option key={Item.id} value={Item.id}>
                {Item.lkup_name}
              </option>
            ))}
          </select>
        ) : (
          <select disabled>
            <option>{"<<Please Select>>"}</option>
          </select>
        )}

        <select
          id="lkup_name"
          className="cancel"
          name="lkup_name"
          onFocus={(e) => {
            setPreviousOption(e.target.value, rowData.compliance_val);
          }}
          onChange={(e) => {
            if (
              // selecttype === 123 ||
              Array.isArray(compliancetable) &&
              compliancetable.length === 0
            ) {
              setValidationMessage(true);
              const newData = {
                ...dropdownValues,
                [rowData.id]: "null" || rowData.compliance_val,
              };
              setDropdownValues(newData);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              setValidationMessage(false);
              const data = rowData.id;
              // onChangeSetDate(e, rowData)
              handalChange(e, rowData, previousOption);
              const newValue = e.target.value;
              setPreviousOption(newValue);
              const newData = {
                ...dropdownValues,
                [rowData.id]: newValue,
              };

              setDropdownValues(newData);
            }
          }}
          value={dropdownValues[rowData.id] || rowData.compliance_val}
          disabled={
            compliancetable[0]?.is_pcqa_submit === true ||
            (isUserManager && compliancetable.length === 0) ||
            pcqaCompl == true
          }
          style={{
            cursor:
              compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
                ? "no-drop"
                : "auto",
            backgroundColor:
              compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
                ? "#eee"
                : "white",
            opacity:
              compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
                ? 1
                : "inherit",
            color:
              compliancetable[0]?.is_pcqa_submit || pcqaCompl == true
                ? "#999"
                : "inherit",
          }}
        >
          <option value="123">&lt;&lt;Please Select&gt;&gt;</option>
          {dropdowns?.map((Item, index) => (
            <option key={index} value={Item.id}>
              {Item.lkup_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  const pcqaBody = (rowData) => {
    console.log(rowData.remarks + "in line 2144...");
    return (
      <>
        {compliancetable.length === 0 && grp6Items[1].is_write === true ? (
          <textarea
            id="remarks"
            name="remarks"
            placeholder="PCQA Remarks"
            type="text"
            value={rowData?.remarks == null ? "" : rowData?.remarks}
            onChange={(e) => handlechangeComments(e.target.value, rowData)}
            disabled={
              compliancetable[0]?.is_pcqa_submit ||
              (isUserManager && compliancetable.length === 0) ||
              pcqa === true
            }
            style={{
              cursor:
                compliancetable[0]?.is_pcqa_submit ||
                  (isUserManager && compliancetable.length === 0) ||
                  pcqa === true
                  ? "no-drop"
                  : "auto",
              backgroundColor:
                compliancetable[0]?.is_pcqa_submit ||
                  (isUserManager && compliancetable.length === 0) ||
                  pcqa === true
                  ? "#eee"
                  : "white",
              opacity:
                compliancetable[0]?.is_pcqa_submit ||
                  (isUserManager && compliancetable.length === 0) ||
                  pcqa === true
                  ? 1
                  : "inherit",
              color:
                compliancetable[0]?.is_pcqa_submit ||
                  (isUserManager && compliancetable.length === 0) ||
                  pcqa === true
                  ? "#999"
                  : "inherit",
            }}
          ></textarea>
        ) : (
          <textarea
            disabled
            placeholder="PCQA Remarks"
            style={{ cursor: "not-allowed" }}
          ></textarea>
        )}

        <textarea
          id="remarks"
          name="remarks"
          placeholder="PCQA Remarks"
          type="text"
          defaultValue={rowData?.remarks == "null" ? "" : rowData?.remarks}
          onChange={(e) => handlechangeComments(e.target.value, rowData)}
          disabled={
            compliancetable[0]?.is_pcqa_submit ||
            (isUserManager && compliancetable.length === 0) ||
            pcqa == true
          }
          style={{
            cursor:
              compliancetable[0]?.is_pcqa_submit ||
                (isUserManager && compliancetable.length === 0) ||
                pcqa == true
                ? "no-drop"
                : "auto",
            backgroundColor:
              compliancetable[0]?.is_pcqa_submit ||
                (isUserManager && compliancetable.length === 0) ||
                pcqa == true
                ? "#eee"
                : "white",
            opacity:
              compliancetable[0]?.is_pcqa_submit ||
                (isUserManager && compliancetable.length === 0) ||
                pcqa == true
                ? 1
                : "inherit",
            color:
              compliancetable[0]?.is_pcqa_submit ||
                (isUserManager && compliancetable.length === 0) ||
                pcqa == true
                ? "#999"
                : "inherit",
          }}
        ></textarea>
      </>
    );
  };

  const pmaBody = (rowData) => {
    return (
      <>
        {compliancetable.length == 0 && (
          <textarea
            value={compliancetable.length == 0 ? "" : rowData.pm_remarks}
            disabled={
              !isUserManager ||
              compliancetable.length == 0 ||
              compliancetable[0]?.is_pcqa_submit === false ||
              (compliancetable[0]?.is_pcqa_submit == true &&
                compliancetable[0]?.is_pm_submit == true)
            }
            style={{
              cursor:
                !isUserManager ||
                  compliancetable.length == 0 ||
                  compliancetable[0]?.is_pcqa_submit === false ||
                  (compliancetable[0]?.is_pcqa_submit == true &&
                    compliancetable[0]?.is_pm_submit == true)
                  ? "no-drop"
                  : "auto",
              backgroundColor:
                !isUserManager ||
                  compliancetable.length == 0 ||
                  compliancetable[0]?.is_pcqa_submit === false ||
                  (compliancetable[0]?.is_pcqa_submit == true &&
                    compliancetable[0]?.is_pm_submit == true)
                  ? "#eee"
                  : "white",
              opacity:
                !isUserManager ||
                  compliancetable.length == 0 ||
                  compliancetable[0]?.is_pcqa_submit === false ||
                  (compliancetable[0]?.is_pcqa_submit == true &&
                    compliancetable[0]?.is_pm_submit == true)
                  ? 1
                  : "inherit",
              color:
                !isUserManager ||
                  compliancetable.length == 0 ||
                  compliancetable[0]?.is_pcqa_submit === false ||
                  (compliancetable[0]?.is_pcqa_submit == true &&
                    compliancetable[0]?.is_pm_submit == true)
                  ? "#999"
                  : "inherit",
            }}
            onChange={(e) => {
              handlechangePMComments(e.target.value, rowData);
            }}
            type="text"
            placeholder="PM Remarks"
          ></textarea>
        )}
        <textarea
          defaultValue={rowData.pm_remarks}
          disabled={
            !isUserManager ||
            compliancetable.length == 0 ||
            compliancetable[0]?.is_pcqa_submit === false ||
            (compliancetable[0]?.is_pcqa_submit == true &&
              compliancetable[0]?.is_pm_submit == true)
          }
          style={{
            cursor:
              !isUserManager ||
                compliancetable.length == 0 ||
                compliancetable[0]?.is_pcqa_submit === false ||
                (compliancetable[0]?.is_pcqa_submit == true &&
                  compliancetable[0]?.is_pm_submit == true)
                ? "no-drop"
                : "auto",
            backgroundColor:
              !isUserManager ||
                compliancetable.length == 0 ||
                compliancetable[0]?.is_pcqa_submit === false ||
                (compliancetable[0]?.is_pcqa_submit == true &&
                  compliancetable[0]?.is_pm_submit == true)
                ? "#eee"
                : "white",
            opacity:
              !isUserManager ||
                compliancetable.length == 0 ||
                compliancetable[0]?.is_pcqa_submit === false ||
                (compliancetable[0]?.is_pcqa_submit == true &&
                  compliancetable[0]?.is_pm_submit == true)
                ? 1
                : "inherit",
            color:
              !isUserManager ||
                compliancetable.length == 0 ||
                compliancetable[0]?.is_pcqa_submit === false ||
                (compliancetable[0]?.is_pcqa_submit == true &&
                  compliancetable[0]?.is_pm_submit == true)
                ? "#999"
                : "inherit",
          }}
          onChange={(e) => {
            handlechangePMComments(e.target.value, rowData);
          }}
          type="text"
          placeholder="PM Remarks"
        ></textarea>
      </>
    );
  };

  const auditBody = (rowData) => {
    return (
      <div title={rowData.check_point} className="ellipsis">
        {rowData.check_point}
      </div>
    );
  };
  const phaseBody = (rowData) => {
    return (
      <div title={rowData.proj_phase} className="ellipsis">
        {rowData.proj_phase}
      </div>
    );
  };
  const isoBody = (rowData) => {
    return (
      <div title={rowData.iso_details} className="ellipsis">
        {rowData.iso_details}
      </div>
    );
  };

  //====================================
  return (
    <div>
      {validationMessage == true ? (
        <div className="statusMsg error">
          <span className="error-block">
            <AiFillWarning /> &nbsp; Please select valid values for highlighted
            fields
          </span>
        </div>
      ) : (
        ""
      )}
      {validationMessageforcopy == true ? (
        <div className="statusMsg error">
          <span className="error-block">
            <AiFillWarning /> &nbsp;Data copy failed/No Data for previous
            results. Please try again.
          </span>
        </div>
      ) : (
        ""
      )}
      {submitdatamessage == true ? (
        <div className="statusMsg error">
          <span className="error-block">
            <AiFillWarning /> &nbsp;Data submitting failed. Please try again.
          </span>
        </div>
      ) : (
        ""
      )}
      {copymessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Data Copied successfully"}
        </div>
      ) : (
        ""
      )}
      {addmsg ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Data saved Successfully"}
        </div>
      ) : (
        ""
      )}
      {savesubmitmsg ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Data submitted successfully"}
        </div>
      ) : (
        ""
      )}
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
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
        <div className="childTwo">
          <h2>Quality Compliance Review</h2>
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

      {(warnMsg && prjtype[0]?.pcqa_type == undefined) || null ? (
        <div className="statusMsg error">
          <AiFillWarning size="1.4em" />
          <span>
            No Project Type selected, please update project type for Audit Check
            List
          </span>
        </div>
      ) : (
        <div className="group mb-3 customCard">
          <div className="group-content row">
            <div className=" col-md-5 mb-0">
              <CCollapse visible={!visible}>
                <div className="row mb-2">
                  <label className="col-3">
                    Audit Month <div className="error-text">*</div>
                  </label>
                  <span className="col-1">:</span>
                  <div className="col-4">
                    <div className="col-12">
                      <div className="datepicker ">
                        <DatePicker
                          showMonthYearPicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="MMMM-yyyy"
                          maxDate={new Date()}
                        />
                      </div>
                    </div>
                  </div>
                  {/* -------------------------------------------------Search Button---------------------------------------------- */}
                  <button
                    className="btn btn-primary col-2"
                    type="submit"
                    onClickCapture={() => {
                      hideButtonclick();
                      handelsearch();
                      handleClicktable1();
                      setValidationMessage(false);
                      commentsdata();
                      // handleCancel();
                      setSubmitDataMessage(false);
                      setValidationMessageForCopy(false);
                    }}
                  // onClick={handelsearch}
                  >
                    <ImSearch /> Search
                  </button>
                </div>
              </CCollapse>
            </div>
            {/* --------------------------------------------------Warning-Box----------------------------------------------- */}
            <div className="statusMsg warning">
              <span className="bold">
                <SlExclamation />
              </span>
              &nbsp; Audit Details can be updated between 5 to 30 dates of every
              month.
            </div>
            {/* ---------------------------------------------Save & Submit Button------------------------------------------- */}
            {grp6Items[1].is_write == false ? (
              ""
            ) : (
              <div className="col-12">
                <div className="btn-container right my-3">
                  {hideButton == true ? (
                    <>
                      <button
                        className="btn btn-primary"
                        type="submit"
                        onClick={Copydata}
                        // disabled={copyPrevMonth == true}
                        style={{
                          // cursor: copyPrevMonth == true ? 'no-drop' : 'auto',
                          // opacity: copyPrevMonth == true ? 1 : 'inherit',
                          display:
                            (compliancetable[0]?.is_pcqa_submit &&
                              compliancetable[0]?.is_pm_submit == true) ||
                              (compliancetable[0]?.is_pcqa_submit == 0 &&
                                compliancetable.length > 0) ||
                              compliancetable[0]?.is_pcqa_submit == 1 ||
                              (isUserManager && compliancetable.length === 0)
                              ? "none"
                              : "flex",
                        }}
                      >
                        <FaSave />
                        Copy From Previous Results
                      </button>
                      <button
                        className="btn btn-primary"
                        type="submit"
                        id="saveBtn"
                        onClick={
                          !(
                            !isUserManager &&
                            compliancetable[0]?.is_pcqa_submit &&
                            !compliancetable[0]?.is_pm_submit
                          ) ||
                            (!compliancetable[0]?.is_pcqa_submit &&
                              !compliancetable[0]?.is_pm_submit)
                            ? Save
                            : undefined
                        }
                        disabled={
                          saveBtn ||
                          (compliancetable[0]?.is_pcqa_submit == true &&
                            compliancetable[0]?.is_pm_submit == true)
                        }
                        style={{
                          cursor:
                            (saveBtn &&
                              compliancetable[0]?.is_pcqa_submit &&
                              compliancetable[0]?.is_pm_submit) ||
                              (!isUserManager &&
                                compliancetable[0]?.is_pcqa_submit &&
                                !compliancetable[0]?.is_pm_submit) ||
                              (isUserManager && compliancetable.length === 0) ||
                              (compliancetable[0]?.is_pcqa_submit == true &&
                                compliancetable[0]?.is_pm_submit == true)
                              ? "no-drop"
                              : "auto",
                          opacity: saveBtn
                            ? 1 ||
                            (compliancetable[0]?.is_pcqa_submit == true &&
                              compliancetable[0]?.is_pm_submit == true)
                            : "inherit",
                        }}
                      >
                        <FaSave />
                        Save
                      </button>
                      <button
                        className="btn btn-primary"
                        type="submit"
                        id="submitBtn"
                        disabled={
                          submitBtn ||
                          (compliancetable[0]?.is_pcqa_submit == true &&
                            compliancetable[0]?.is_pm_submit == true)
                        }
                        style={{
                          cursor:
                            submitBtn == true ||
                              (compliancetable[0]?.is_pcqa_submit &&
                                compliancetable[0]?.is_pm_submit == true) ||
                              (isUserManager && compliancetable.length === 0) ||
                              (compliancetable[0]?.is_pcqa_submit == true &&
                                compliancetable[0]?.is_pm_submit == true)
                              ? "no-drop"
                              : "auto",
                          opacity:
                            submitBtn == true
                              ? 1 ||
                              (compliancetable[0]?.is_pcqa_submit == true &&
                                compliancetable[0]?.is_pm_submit == true)
                              : "inherit",
                        }}
                        onClick={submit}
                      >
                        <FaCheck />
                        Submit
                      </button>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            {/* : ""} */}
            {/* --------------------------------------------------------------------------------------------------------------------- */}
            {grp6Items[1].is_write == false ? (
              ""
            ) : (
              <div className="col-8 offset-2">
                <div className="row">
                  <div className=" col-6 mb-2">
                    <div className="  row">
                      <label className="col-5" htmlFor="dateOfReview">
                        Date of Review&nbsp;
                        <div className="error-text">*</div>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <div className="datepicker error">
                          {!!compliancetable[0]?.is_pcqa_submit ||
                            (isUserManager && compliancetable.length === 0) ||
                            pcqa == true ? (
                            <DatePicker
                              selected={
                                compliancetable[0]?.audit_date
                                  ? moment(
                                    compliancetable[0]?.audit_date,
                                    "YYYY-MM-DD"
                                  ).toDate()
                                  : selectedDate1
                              }
                              dateFormat="dd-MMM-yyyy"
                              showMonthDropdown
                              showYearDropdown
                              disabled={true}
                              dropdownMode="select"
                              minDate={moment().startOf("month").toDate()}
                              maxDate={moment().endOf("month").toDate()}
                              filterDate={filterDates}
                              onChange={handleDateChange1}
                              shouldDisableMonth={disablePreviousMonths}
                              shouldDisableYear={disablePreviousMonths}
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                            />
                          ) : (
                            <div
                              className="datepicker cancel"
                              ref={(ele) => {
                                ref.current[0] = ele;
                              }}
                            >
                              <DatePicker
                                selected={
                                  compliancetable[0]?.audit_date
                                    ? moment(
                                      compliancetable[0]?.audit_date,
                                      "YYYY-MM-DD"
                                    ).toDate()
                                    : selectedDate1
                                }
                                dateFormat="dd-MMM-yyyy"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                minDate={moment().startOf("month").toDate()}
                                maxDate={moment().endOf("month").toDate()}
                                filterDate={filterDates}
                                onChange={handleDateChange1}
                                shouldDisableMonth={disablePreviousMonths}
                                shouldDisableYear={disablePreviousMonths}
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 mb-2">
                    <div className="  row">
                      <label className="col-5" htmlFor="projectManager ">
                        Project Manager&nbsp;
                        <div className="error-text">*</div>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <div>
                          {!!compliancetable[0]?.is_pcqa_submit ||
                            (isUserManager && compliancetable.length === 0) ||
                            pcqa == true ? (
                            <input
                              items={managersname}
                              type="Text"
                              showIcon={false}
                              defaultValue={compliancetable[0]?.prj_mgr_name}
                              placeholder="Type/Press space to get the list"
                              onKeyDown={handleKeyDown}
                              disabled={true}
                            />
                          ) : (
                            <div
                              className="autoComplete-container react  cancel  reactsearchautocomplete"
                              ref={(ele) => {
                                ref.current[1] = ele;
                              }}
                            >
                              <ReactSearchAutocomplete
                                className="wrapperauto"
                                items={managersname}
                                type="Text"
                                showIcon={false}
                                inputSearchString={
                                  compliancetable[0]?.prj_mgr_name
                                }
                                placeholder="Type/Press space to get the list"
                                onKeyDown={handleKeyDown}
                                onSelect={(e) => {
                                  SetManagerId(e.id);
                                  const updatemanager = [...compliancetable];
                                  updatemanager.forEach((item) => {
                                    item.prj_mgr_id = e.id;
                                  });
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 mb-2">
                    <div className="row">
                      <label className="col-5" htmlFor="reviewDoneBy">
                        Review Done By&nbsp;
                        <div className="error-text">*</div>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        <div className="autoComplete-container error">
                          {!!compliancetable[0]?.is_pcqa_submit ||
                            (isUserManager && compliancetable.length === 0) ||
                            pcqa == true ? (
                            <input
                              type="Text"
                              items={reviewdonebynames}
                              showIcon={false}
                              defaultValue={compliancetable[0]?.review_by_name}
                              placeholder="Type/Press space to get the list"
                              disabled={true}
                            />
                          ) : (
                            <div
                              className="autoComplete-container react  cancel  reactsearchautocomplete"
                              ref={(ele) => {
                                ref.current[2] = ele;
                              }}
                            >
                              <ReactSearchAutocomplete
                                items={reviewdonebynames}
                                type="Text"
                                showIcon={false}
                                inputSearchString={
                                  compliancetable[0]?.review_by_name
                                }
                                placeholder="Type/Press space to get the list"
                                onSelect={(e) => {
                                  setRewviewById(e.id);
                                  const updatereviewby = [...compliancetable];
                                  updatereviewby.forEach((item) => {
                                    item.review_by_id = e.id;
                                  });
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 mb-2">
                    <div className="  row">
                      <label className="col-5" htmlFor="effortSpent">
                        Effort spent for Review (person hours)
                        <span style={{ color: "red" }}>&nbsp;*</span>
                      </label>
                      <span className="col-1">:</span>
                      <div className="col-6">
                        {!!compliancetable[0]?.is_pcqa_submit ||
                          (isUserManager && compliancetable.length === 0) ||
                          (isUserManager && compliancetable.length === 0) ||
                          pcqa == true ? (
                          <input
                            type="text"
                            disabled={
                              compliancetable[0]?.is_pcqa_submit || pcqa == true
                            }
                            className="form-control"
                            id="effortSpent "
                            required
                            value={compliancetable[0]?.effort_hrs}
                          />
                        ) : (
                          <div
                            className="textfield cancel"
                            ref={(ele) => {
                              ref.current[3] = ele;
                            }}
                          >
                            <input
                              type="text"
                              className="form-control error"
                              id="effortSpent "
                              required
                              value={compliancetable[0]?.effort_hrs}
                              onChange={(e) => {
                                SetEffortHrs(e.target.value);
                                const updateefforthours = [...compliancetable];
                                updateefforthours.forEach((item) => {
                                  item.effort_hrs = e.target.value;
                                });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="col-md-8 offset-2 mb-2 darkHeader">
              <table className="table table-striped table-bordered htmlTable   ">
                <thead>
                  <tr>
                    <th style={{ width: "60%", textAlign: "center" }}>Type</th>
                    <th style={{ width: "40%", textAlign: "center" }}>
                      Compliance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ height: "34px" }}>State</td>
                    <td>
                      <div className="col-6">
                        {/* {!!compliancetable[0]?.is_pcqa_submit == true ?
                                                        <select id="state" value={compliancetable[0]?.audit_state} disabled={true} onChange={(event) => handleSelectChange(event.target.value)} >
                                                            <option value>&lt;&lt; Please Select &gt;&gt;</option>
                                                            <option value="1184" >Initiation</option>
                                                            <option value="1185">Steady State</option>
                                                            <option value="1186">Closure</option>
                                                        </select> : */}
                        {grp6Items[1].is_write == false ? (
                          <select disabled>
                            <option value>&lt;&lt;Please Select&gt;&gt;</option>
                          </select>
                        ) : (
                          <select
                            id="state"
                            value={
                              compliancetable[0]?.audit_state == undefined
                                ? ""
                                : compliancetable[0]?.audit_state
                            }
                            onChange={(event) =>
                              handleSelectChange(event.target.value)
                            }
                            className={`error  ${validationMessage === true ? "error-block" : ""
                              }`}
                            disabled={
                              !!compliancetable[0]?.is_pcqa_submit == true ||
                              (isUserManager == true &&
                                compliancetable[0]?.is_pcqa_submit &&
                                compliancetable[0]?.is_pm_submit == false) ||
                              (isUserManager && compliancetable.length === 0)
                            }
                          >
                            <option value>&lt;&lt;Please Select&gt;&gt;</option>
                            <option value="1184">Initiation</option>
                            <option value="1185">Steady State</option>
                            <option value="1186">Closure</option>
                          </select>
                        )}

                        {/* } */}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Fully Implemented</td>
                    <td>
                      {compliancetable[0]?.full_impl_compl
                        ? compliancetable[0]?.full_impl_compl
                        : 0}
                      {/* {targetCounts["1205"] ? targetCounts["1205"] : 0} */}
                    </td>
                  </tr>
                  <tr>
                    <td>Partially Implemented</td>
                    <td>
                      {compliancetable[0]?.parti_impl_compl
                        ? compliancetable[0]?.parti_impl_compl
                        : 0}
                      {/* {targetCounts["1206"] ? targetCounts["1206"] : 0} */}
                    </td>
                  </tr>
                  <tr>
                    <td>Not Implemented</td>
                    <td>
                      {compliancetable[0]?.not_impl_compl
                        ? compliancetable[0]?.not_impl_compl
                        : 0}
                      {/* {targetCounts["1207"] ? targetCounts["1207"] : 0} */}
                    </td>
                  </tr>
                  <tr>
                    <td>Not Yet</td>
                    <td>
                      {compliancetable[0]?.not_yet_compl
                        ? compliancetable[0]?.not_yet_compl
                        : 0}
                      {/* {targetCounts["1208"] ? targetCounts["1208"] : 0} */}
                    </td>
                  </tr>
                  <tr>
                    <td>Not Applicable</td>
                    <td>
                      {compliancetable[0]?.not_appl_compl
                        ? compliancetable[0]?.not_appl_compl
                        : 0}
                      {/* {targetCounts["1209"] ? targetCounts["1209"] : 0} */}
                    </td>
                  </tr>
                  <tr>
                    <td>Weighted score </td>
                    <td>
                      {isNaN(compliancetable[0]?.weighted_score)
                        ? "0 %"
                        : compliancetable[0]?.weighted_score}
                    </td>
                  </tr>
                  <tr>
                    <td>Overall Process Adherence</td>
                    <td>
                      {isNaN(compliancetable[0]?.process_adherence)
                        ? "0 %"
                        : `${compliancetable[0]?.process_adherence} %`}
                    </td>
                  </tr>

                  <tr>
                    <td>Status </td>
                    <td
                      style={{
                        backgroundColor:
                          compliancetable[0]?.status === 1211
                            ? "#00cc66"
                            : compliancetable[0]?.status === 1213
                              ? "#FF0000"
                              : compliancetable[0]?.status === 1214
                                ? ""
                                : compliancetable[0]?.status === 1212
                                  ? "#ffd400"
                                  : "",
                      }}
                    >
                      {compliancetable[0]?.status_name
                        ? compliancetable[0]?.status_name
                        : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="darkHeader">
            <DataTable
              value={tableData}
              showGridlines
              emptyMessage="No Records To View"
              scrollDirection="both"
              scrollHeight="400px"
              // scrollable
              frozen
              // paginator
              rows={10}
              className="primeReactDataTable " ///customerEngament
            // paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            // currentPageReportTemplate="{first} to {last} of {totalRecords}"
            // rowsPerPageOptions={[10, 25, 50]} //------------->
            >
              <Column
                header="S.No"
                field="SNo"
                body={renderSNo}
                title={"SNo"}
                alignHeader={"center"}
                headerStyle={{ width: "5%", minWidth: "8rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
              <Column
                field="proj_phase"
                header="Phase"
                body={phaseBody}
                frozen
              />
              <Column
                field="check_point"
                header="Audit Checkpoints"
                body={auditBody}
              />
              <Column
                frozen
                field=""
                header="Compliance"
                filter={true}
                body={ComplianceBodyTemplate}
                headerStyle={{ width: "11%", minWidth: "8rem" }}
              />
              <Column
                field=""
                body={getFieldBasedOnType}
                header="Weightage"
                headerStyle={{ width: "6%", minWidth: "8rem" }}
              />

              <Column
                field="iso_details"
                header="ISO 9001:2015"
                body={isoBody}
              />
              <Column
                field="remarks"
                header="PCQA Remarks"
                body={pcqaBody}
                disabled={compliancetable[0]?.is_pcqa_submit === true}
              />
              <Column
                field="pm_remarks"
                header="PM Remarks"
                body={pmaBody}
                disabled={compliancetable[0]?.is_pcqa_submit === true}
              />
            </DataTable>
          </div>

          {/* <FirstTable
            tableData={tableData}
            selecttype={selecttype}
            dropdowns={dropdowns}
            setoldData={setoldData}
            setnewData={setnewData}
            CompliancData={CompliancData}
            setComplianceTable={setComplianceTable}
            compliancetable={compliancetable}
            newData={newData}
            setValidationMessage={setValidationMessage}
            validationMessage={validationMessage}
            comments={comments}
            setTableData={setTableData}
            setComments={setComments}
            setPcqaComments={setPcqaComments}
            pcqracomments={pcqracomments}
            setDropdownData={setDropdownData}
            dropdowndata={dropdowndata}
            calculateComplianceScore={calculateComplianceScore}
            loggedUserId={loggedUserId}
            managersname={managersname}
            isUserManager={isUserManager}
            pcqaCompl={pcqaCompl}
            pcqa={pcqa}
            setWeightage={setWeightage}
            setPmComments={setPmComments}
            pmcomments={pmcomments}
            weightage={weightage}
            setWeightageData={setWeightageData}
            weightagedata={weightagedata}
          /> */}
        </div>
      )}
    </div>
  );
}
export default ProjectCompliance;
