import React, { useState, useEffect, useRef } from "react";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { environment } from "../../environments/environment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import CompetencyDefaultTable from "./CompetencyDefaultTable";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import GlobalCancel from "../ValidationComponent/GlobalCancel";
import { AiFillWarning } from "react-icons/ai";
import {
  FaSearch,
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
} from "react-icons/fa";
import Loader from "../Loader/Loader";
import { CCollapse } from "@coreui/react";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import ScreenBreadcrumbs from "../Common/ScreenBreadcrumbs";
//Test

function Competency() {
  let prescription = {
    prescriptionDate: new Date(), // Today
    prescriptionExpirationDate: -90, // Days to add
  };

  let date = new Date(
    new Date(prescription.prescriptionDate).setDate(
      prescription.prescriptionDate.getDate() +
        prescription.prescriptionExpirationDate
    )
  ).toDateString();

  const [ToDate, setToDate] = useState(new Date());
  const [FromDate, setFromDate] = useState(
    new Date(prescription.prescriptionDate).setDate(
      prescription.prescriptionDate.getDate() +
        prescription.prescriptionExpirationDate
    )
  );
  const HelpPDFName = "CompetencyDashboard.pdf";
  const HelpHeader = "Competency Dashboard Help";
  const ref = useRef([]);
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const abortController = useRef(null);
  const [loader, setLoader] = useState(false);
  const [selectType, setSelectType] = useState("Skill");
  const [skillGroup, setSkillGroup] = useState([]);
  const [selectedSkillGroup, setSelectedSkillGroup] = useState([]);
  const [skillType, setSkillType] = useState([]);
  const [skillTypeSpare, setSkillTypeSpare] = useState([]);
  const [skillTypeSpae, setSkillTypeSpae] = useState([]);
  const [selectedSkillType, setSelectedSkillType] = useState([]);
  const [Type, setType] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [Status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [country, setCountry] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [training, setTraining] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState([]);
  const [SupervisorRating, setSupervisorRating] = useState([]);
  const [selectedSupervisorRating, setSelectedSupervisorRating] = useState([]);
  const [data, setData] = useState([]);

  const [skillData, setSkillData] = useState();
  const [validationmessage, setValidationMessage] = useState(false);

  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate");

  ///////////////////////////////////////////////////////////
  const FromDateChangeHandler = (value, e) => {
    setFromDate(value);
    let frmdate = value;
    let currdate = new Date();

    frmdate > currdate ? setToDate(frmdate) : setToDate(currdate);
  };
  const ToDateChangeHandler = (value) => {
    setToDate(value);
  };
  let formattedFromDate = moment(FromDate).format("YYYY-MM-DD");
  let toDateFromDate = moment(ToDate).format("YYYY-MM-DD");
  ///////////////////////////////////////////////////////////////////////

  const baseUrl = environment.baseUrl;
  const initialValue = {
    BU: "",
    Country: "",
    skillGroup: "",
    training: "",
    skillId: "",
    typeId: "",
    Status: "",
    SupervisorRating: "",
    experience: "-1",
    ToDate: moment(ToDate).format("yyyy-MM-DD"),
    FromDate: moment(date).format("yyyy-MM-DD"),
  };
  const [searchdata, setSearchdata] = useState(initialValue);
  let alldepartments;
  let allcountries;

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  let textContent = "Dashboards";
  let currentScreenName = ["Competency Dashboard"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  {
    /*--------------------------Handel Search-------------------------- */
  }

  let allSkills =
    selectedSkillGroup.length == skillGroup.length ? "-1" : searchdata.skillId;

  const handleSearch = () => {
    abortController.current = new AbortController();
    setLoader(false);
    if (selectType == "Skill") {
      let filteredData = ref.current.filter((d) => d != null);

      ref.current = filteredData;

      let valid = GlobalValidation(ref);

      if (valid == true) {
        setLoader(false);
        setValidationMessage(true);
      }

      if (valid) {
        return;
      }

      {
        /*--------------------------Skill Handel-------------------------- */
      }

      axios({
        method: "post",
        url:
          baseUrl +
          `/dashboardsms/Dashboard/getSkillData?skillId=${allSkills}&typeId=${searchdata.typeId}&statusId=${searchdata.Status}&countryId=${searchdata.Country}&skillRatingId=${searchdata.SupervisorRating}&experience=${searchdata.experience}`,
        headers: { "Content-Type": "application/json" },
        signal: abortController.current.signal,
      }).then((response) => {
        let headerData = [
          {
            sno: "S.No.",
            empId: "Emp Id",
            resourceName: "Resource",
            resDept: "Business Unit",
            resCountry: "Country",
            skillGrp: "Skill Group",
            skillName: "Skill",
            skillCategory: "Type",
            skillStatus: "Status",
            createdOn: "Created On",
            selfRating: "Self Rating",
            skillRating: "Supervisor Rating",
            comments: "Comments",
            reviewedBy: "Reviewed By",
            reviewedOn: "Reviewed On",
            skillExp: "Exp(In Months)",
          },
        ];
        setData(headerData.concat(response.data));
        setValidationMessage(false);

        !valid && setVisible(!visible);
        visible
          ? setCheveronIcon(FaChevronCircleUp)
          : setCheveronIcon(FaChevronCircleDown);
      });
    }

    if (selectType == "Certificate") {
      let filteredData = ref.current.filter((d) => d != null);

      ref.current = filteredData;

      let valid = GlobalValidation(ref);

      if (valid == true) {
        setLoader(false);
        setValidationMessage(true);
      }

      if (valid) {
        return;
      }

      {
        /*--------------------------Certificate Handel-------------------------- */
      }
      alldepartments = searchdata.BU;
      allcountries = searchdata.Country;
      const loaderTime = setTimeout(() => {
        setLoader(true);
      }, 2000);

      axios({
        method: "post",
        url:
          baseUrl +
          `/dashboardsms/Dashboard/getCertificateData?BU=${alldepartments}&Country=${allcountries}`,
        headers: { "Content-Type": "application/json" },
        signal: abortController.current.signal,
      }).then((response) => {
        setLoader(false);
        clearTimeout(loaderTime);
        let headerData = [
          {
            sno: "S.No.",
            empId: "Emp Id",
            resName: "Resource",
            resDept: "Business Unit",
            resCountry: "Country",
            certName: "Certificate",
            certCustomer: "Certified From",
            certDate: "Certified On",
            certExpire: "Expires On",
            certApprove: "Approved On",
          },
        ];
        setData(headerData.concat(response.data));
        setValidationMessage(false);
      });
    }

    if (selectType == "Training") {
      let filteredData = ref.current.filter((d) => d != null);

      ref.current = filteredData;

      let valid = GlobalValidation(ref);

      if (valid == true) {
        setLoader(false);
        setValidationMessage(true);
      }

      if (valid) {
        return;
      }
      {
        /*--------------------------Training Handel-------------------------- */
      }
      const TrainingArr = searchdata.training.split(",");
      let allTrainings =
        TrainingArr.length === training.length ? "0" : searchdata.training;
      alldepartments = searchdata.BU;
      allcountries = searchdata.Country;
      const loaderTime = setTimeout(() => {
        setLoader(true);
      }, 2000);

      axios({
        method: "post",
        url:
          baseUrl +
          `/dashboardsms/Dashboard/getTrainingData?buId=${alldepartments}&trainingId=${allTrainings}&countryId=${allcountries}&fromDt=${formattedFromDate}&toDt=${toDateFromDate}`,
        headers: { "Content-Type": "application/json" },
        signal: abortController.current.signal,
      }).then((response) => {
        setLoader(false);
        clearTimeout(loaderTime);
        let headerData = [
          {
            sno: "S.No.",
            empId: "Emp Id",
            resName: "Resource",
            resDept: "Business Unit",
            resCountry: "Country",
            projects: "Projects",
            skills: "Skills",
            resCourse: "Training",
            traingType: "Training Type",
            courseStatus: "Status",
            startDate: "Started On",
            cmpltDate: "Completed On",
            courseScore: "Score",
            courseTime: "Training Time(Minute)",
          },
        ];
        setValidationMessage(false);
        setData(headerData.concat(response.data));
        setLoader(false);
      });
    }
  };

  {
    /*--------------------------Handel Change-------------------------- */
  }
  const handleChange = (e) => {
    const { id, value } = e.target;
    setSelectType(value);
    GlobalCancel(ref);
    setValidationMessage(false);
  };

  useEffect(() => {}, [selectType]);

  useEffect(() => {
    getDepartments();
    getCountries();
  }, [selectType]);

  const getMenus = () => {
    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/executive/competencyDashboard";
      getUrlPath(modifiedUrlPath);
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Custom Dashboard"
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
      .then((res) => {})
      .catch((error) => {});
  };

  //////////--Alphabetical Sorting--//////////

  const sortingData = (data) => {
    const sortedstate = data.sort(function (a, b) {
      var nameA = a.label.toUpperCase();
      var nameB = b.label.toUpperCase();
      if (nameA < nameB) {
        return -1; //nameA comes first
      }
      if (nameA > nameB) {
        return 1; // nameB comes first
      }
      return 0; // names must be equal
    });

    return sortedstate;
  };

  //////////----------------------//////////

  {
    /*-------------------------Getting Skill Group-------------------------*/
  }
  const getSkillGroup = () => {
    axios
      .get(baseUrl + `/dashboardsms/Dashboard/getSkillGroups`)

      .then((Response) => {
        let skillGroup = [];

        let data = Response.data;

        data = sortingData(data);

        // data = sortedstate
        data.length > 0 &&
          data.forEach((e) => {
            let skillGroupObj = {
              label: e.label,
              value: e.value,
            };
            skillGroup.push(skillGroupObj);
          });
        setSkillGroup(skillGroup);
        // setSelectedSkillGroup(skillGroup);
      });
  };

  useEffect(() => {
    let skillGroupList = [];
    skillGroup.forEach((d) => {
      skillGroupList.push(d.value);
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["skillGroup"]: skillGroupList.toString(),
    }));
  }, [skillGroup]);

  {
    /*-------------------------Getting Skill-------------------------*/
  }
  const getSkillType = () => {
    axios
      .get(baseUrl + `/dashboardsms/Dashboard/getSkillType`)

      .then((Response) => {
        let skillType = [];

        let data = Response.data;

        setSkillData(data);
        data.length > 0 &&
          data.forEach((e) => {
            let skillTypeObj = {
              label: e.display_name,
              value: e.id,
              skillGroupId: e.skill_group_id,
            };
            skillType.push(skillTypeObj);
          });
        // setSkillType(skillType);

        skillType = sortingData(skillType);

        setSkillTypeSpare(skillType);
        setSkillTypeSpae(skillType);
        // setSelectedSkillType(skillType);
      });
  };

  useEffect(() => {
    let skillTypeList = [];
    skillType.forEach((d) => {
      skillTypeList.push(d.value);
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["skillId"]:
        skillTypeList.toString().split(",").length == 184
          ? -1
          : skillTypeList.toString(),
    }));
  }, [skillType]);

  {
    /*-------------------------Getting Skill Type-------------------------*/
  }

  const getType = () => {
    let types = [];
    types.push(
      { value: 0, label: "Primary" },
      { value: 1, label: "Secondary" },
      { value: 2, label: "Others" }
    );
    setType(types);
    setSelectedType(types.filter((ele) => ele.value >= 0));
    let filteredType = [];
    types.forEach((data) => {
      if (data.value >= 0) {
        filteredType.push(data.value);
      }
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["typeId"]: filteredType.toString(),
    }));
  };

  {
    /*-------------------------Getting Status-------------------------*/
  }

  const getStatus = () => {
    let Status = [];
    Status.push(
      { value: 0, label: "Requested" },
      { value: 1, label: "Approved" },
      { value: 2, label: "Rejected" }
    );
    setSelectedStatus(Status);
    setStatus(Status);

    setSelectedStatus(Status.filter((ele) => ele.value >= 0));
    let filteredStatus = [];
    Status.forEach((data) => {
      if (data.value >= 0) {
        filteredStatus.push(data.value);
      }
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["Status"]: filteredStatus.toString(),
    }));
  };

  {
    /*-------------------------Getting Supervisor Rating-------------------------*/
  }

  const getSupervisorRating = () => {
    let SupervisorRating = [];
    SupervisorRating.push(
      { value: 1, label: "Poor" },
      { value: 2, label: "Weak" },
      { value: 3, label: "Average" },
      { value: 4, label: "Good" },
      { value: 5, label: "Excellent" }
    );
    setSupervisorRating(SupervisorRating);
    setSelectedSupervisorRating(
      SupervisorRating.filter((ele) => ele.value != 0)
    );
    let filteredSupervisorRating = [];
    SupervisorRating.forEach((data) => {
      if (data.value != 0) {
        filteredSupervisorRating.push(data.value);
      }
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["SupervisorRating"]: filteredSupervisorRating.toString(),
    }));
  };

  {
    /*-------------------------Getting Training Names-------------------------*/
  }
  const getTraining = () => {
    axios
      .get(baseUrl + `/dashboardsms/Dashboard/getTraining`)

      .then((Response) => {
        let training = [];

        let data = Response.data;
        data.length > 0 &&
          data.forEach((e) => {
            let trainingObj = {
              label: e.label,
              value: e.id,
            };
            training.push(trainingObj);
          });
        setTraining(training);
        setSelectedTraining(training);
      });
  };

  useEffect(() => {
    let trainingList = [];
    training.forEach((d) => {
      trainingList.push(d.value);
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["training"]: trainingList.toString(),
    }));
  }, [training]);

  {
    /*-------------------------Getting Countries-------------------------*/
  }
  const getCountries = () => {
    axios
      // .get(baseUrl + `/CostMS/cost/getCountries`)
      .get(baseUrl + `/dashboardsms/Dashboard/getCountry`)
      .then((Response) => {
        let countries = [];
        countries.push({ value: 0, label: "Others" });
        let data = Response.data;

        data.length > 0 &&
          data.forEach((e) => {
            let countryObj = {
              label: e.country_name,
              value: e.id,
            };
            countries.push(countryObj);
          });

        //////////--Alphabetical Sorting--//////////
        const sortedcities = countries.sort(function (a, b) {
          var nameA = a.label.toUpperCase();
          var nameB = b.label.toUpperCase();
          if (nameA < nameB) {
            return -1; //nameA comes first
          }
          if (nameA > nameB) {
            return 1; // nameB comes first
          }
          return 0; // names must be equal
        });
        //////////------------------------//////////
        setCountry(sortedcities);
        setSelectedCountry(countries);
      });
  };

  useEffect(() => {
    let countryList = [];
    country.forEach((d) => {
      countryList.push(d.value);
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["Country"]: countryList.toString(),
    }));
  }, [country]);

  {
    /*-------------------------Getting Buisness Unit-------------------------*/
  }
  const getDepartments = async () => {
    const resp = await axios({
      //url: baseUrl + `/CostMS/cost/getDepartments`,
      url: baseUrl + `/dashboardsms/Dashboard/getBU`,
    });

    let departments = resp.data;
    departments.push({ value: 999, label: "Non-Revenue Units" });
    setDepartments(departments);
    setSelectedDepartments(departments.filter((ele) => ele.value != 999));
    let filteredDeptData = [];
    departments.forEach((data) => {
      if (data.value != 0 && data.value != 999) {
        filteredDeptData.push(data.value);
      }
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["BU"]: filteredDeptData.toString(),
    }));
  };

  {
    /*-----------------------------Handle Abort--------------------------- */
  }
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  useEffect(() => {}, [data]);
  useEffect(() => {
    getDepartments();
    getCountries();
    getTraining();
    getSkillGroup();
    getSkillType();
    getType();
    getStatus();
    getSupervisorRating();
    getMenus();
  }, []);
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

      <div className="pageTitle">
        <div className="childOne"></div>
        <div className="childTwo">
          <h2>Competency Dashboard</h2>
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

      <div className="group mb-1 customCard">
        <div className="col-md-12 collapseHeader"></div>

        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className=" col-md-4 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="SelectType">
                  Select Type&nbsp;
                  <span className="required error-text">*</span>
                </label>
                <span className="col-1">:</span>
                <div className="col-6">
                  <select
                    defaultValue={"Skill"}
                    id="SelectType"
                    name="SelectType"
                    onChange={handleChange}
                  >
                    <option value="Certificate">Certificate</option>
                    <option value="Skill">Skill</option>
                    <option value="Training">Training</option>
                  </select>
                </div>
              </div>
            </div>

            {selectType == "Skill" ? (
              <>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="skillGroup">
                      Skill Group&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="skillGroup"
                        options={skillGroup}
                        hasSelectAll={true}
                        value={selectedSkillGroup}
                        disabled={false}
                        valueRenderer={generateDropdownLabel}
                        onChange={(e) => {
                          let skillsArr = [];
                          for (let index = 0; index < e.length; index++) {
                            let skillId = e[index]["value"];
                            let skillAr = skillTypeSpare.filter(
                              (d) => d.skillGroupId == skillId
                            );

                            let temp = skillsArr;
                            skillsArr = [...skillsArr, ...skillAr];
                          }

                          skillsArr = sortingData(skillsArr);

                          setSkillType(skillsArr);
                          setSelectedSkillType(skillsArr);

                          setSelectedSkillGroup(e);
                          let filteredSkillGroup = [];
                          e.forEach((m) => {
                            filteredSkillGroup.push(m.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["skillGroup"]: filteredSkillGroup.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="skillId">
                      Skill&nbsp;<span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="skillId"
                        options={skillType}
                        hasSelectAll={true}
                        value={selectedSkillType}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedSkillType(e);
                          let filteredSkillType = [];
                          e.forEach((d) => {
                            filteredSkillType.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["skillId"]: filteredSkillType.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Status">
                      Status&nbsp;<span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="Status"
                        options={Status}
                        hasSelectAll={true}
                        value={selectedStatus}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedStatus(e);
                          let filteredStatus = [];
                          e.forEach((d) => {
                            filteredStatus.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["Status"]: filteredStatus.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="typeId">
                      Type&nbsp;<span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="typeId"
                        options={Type}
                        hasSelectAll={true}
                        value={selectedType}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedType(e);
                          let filteredType = [];
                          e.forEach((d) => {
                            filteredType.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["typeId"]: filteredType.toString(),
                          }));
                        }}
                        valueRenderer={generateDropdownLabel}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Country">
                      Country&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[4] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="Country"
                        options={country}
                        hasSelectAll={true}
                        value={selectedCountry}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedCountry(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["Country"]: filteredCountry.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="SupervisorRating">
                      Supervisor Rating&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[5] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="SupervisorRating"
                        options={SupervisorRating}
                        hasSelectAll={true}
                        value={selectedSupervisorRating}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedSupervisorRating(e);
                          let filteredSupervisorRating = [];
                          e.forEach((d) => {
                            filteredSupervisorRating.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["SupervisorRating"]:
                              filteredSupervisorRating.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="experience">
                      Experience
                    </label>
                    <span className="col-1">:</span>
                    <div className="col-6">
                      <select
                        id="experience"
                        onChange={(e) => {
                          const { id, value } = e.target;
                          setSearchdata((prev) => {
                            return { ...prev, [id]: value };
                          });
                        }}
                      >
                        <option value="-1">&lt;&lt;All&gt;&gt;</option>
                        <option value="24">0-2 Years</option>
                        <option value="60">2-5 Years</option>
                        <option value="120">5-10 Years</option>
                        <option value="121">&gt;10 Years</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : selectType == "Training" ? (
              <>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="BU">
                      BU&nbsp;<span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="BU"
                        options={departments}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedDepartments}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedDepartments(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["BU"]: filteredValues.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Training">
                      Training&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="training"
                        options={training}
                        hasSelectAll={true}
                        value={selectedTraining}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedTraining(e);
                          let filteredTraining = [];
                          e.forEach((d) => {
                            filteredTraining.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["training"]: filteredTraining.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Country">
                      Country&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="Country"
                        options={country}
                        hasSelectAll={true}
                        value={selectedCountry}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedCountry(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["Country"]: filteredCountry.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="FromDate">
                      From Date&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="datepicker col-6"
                      ref={(ele) => {
                        ref.current[3] = ele;
                      }}
                    >
                      <DatePicker
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        name="FromDate"
                        selected={FromDate}
                        id="FromDate"
                        dateFormat="dd-MMM-yyyy"
                        onChange={(e) => {
                          setSearchdata((prev) => ({
                            ...prev,
                            ["FromDate"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setFromDate(e);
                          FromDateChangeHandler(e);
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="ToDate">
                      To Date&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="datepicker col-6"
                      ref={(ele) => {
                        ref.current[4] = ele;
                      }}
                    >
                      <DatePicker
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        name="ToDate"
                        selected={ToDate}
                        minDate={FromDate}
                        id="ToDate"
                        dateFormat="dd-MMM-yyyy"
                        onChange={(e) => {
                          setSearchdata((prev) => ({
                            ...prev,
                            ["ToDate"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setToDate(e);
                          ToDateChangeHandler(e);
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="BU">
                      BU&nbsp;<span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="BU"
                        options={departments}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedDepartments}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(s) => {
                          setSelectedDepartments(s);
                          let filteredValues = [];
                          s.forEach((d) => {
                            filteredValues.push(d.value);
                          });

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["BU"]: filteredValues.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className=" col-md-4 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="Country">
                      Country&nbsp;
                      <span className="required error-text">*</span>
                    </label>
                    <span className="col-1">:</span>
                    <div
                      className="multiselect col-6"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        ArrowRenderer={ArrowRenderer}
                        id="Country"
                        options={country}
                        hasSelectAll={true}
                        value={selectedCountry}
                        valueRenderer={generateDropdownLabel}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedCountry(e);
                          let filteredCountry = [];
                          e.forEach((d) => {
                            filteredCountry.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["Country"]: filteredCountry.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ---------------------Search Button-------------------- */}
            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-1">
              <button
                type="submit"
                onClick={handleSearch}
                className="btn btn-primary"
              >
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </CCollapse>
      </div>
      <CompetencyDefaultTable
        data={data}
        CustomersFileName="CompetencyDashboard"
        competencyMaxDynaHeigjht={maxHeight1}
      />
      {loader ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}

export default Competency;
