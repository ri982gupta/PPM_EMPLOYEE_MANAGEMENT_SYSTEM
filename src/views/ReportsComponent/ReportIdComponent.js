import axios from "axios";
import moment from "moment";
import { Column } from "primereact/column";
import React from "react";
import { BiChevronRight } from "react-icons/bi";

import { useState, useEffect, useRef } from "react";
import CellRendererPrimeReactDataTable from "../PrimeReactTableComponent/CellRendererPrimeReactDataTable";
import MaterialReactReportsTable from "./MaterialReactReportsTable";
import "./ReportIdComponent.scss";
import { environment } from "../../environments/environment";
import Loader from "../Loader/Loader";
import { FaHome } from "react-icons/fa";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MultiSelect } from "primereact/multiselect";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { BiError } from "react-icons/bi";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
} from "react-icons/fa";
import { CCollapse } from "@coreui/react";
import { Popover } from "react-bootstrap";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import MaterialReactTable from "material-react-table";
import { number } from "prop-types";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";

function ReportIdComponent(props) {
  let url = window.location.href;
  const loggedUserId = localStorage.getItem("resId");

  const initialOptions = {};
  const [initialOptionsState, setInitialOptionsState] =
    useState(initialOptions);
  const optionValObj = {};
  const [optionVals, setOptionVals] = useState(optionValObj);
  const [headerData, setHeaderData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [reportId, setReportId] = useState(0);
  const [filtersData, setFiltersData] = useState([]);
  const [renderFilters, setRenderFilters] = useState(null);
  const [reportsHeader, setreportsHeader] = useState(null);
  const [emptyData, setEmptyData] = useState(false);
  const baseUrl = environment.baseUrl;
  const initialValue = {};
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState(initialValue);
  const [reportName, setReportName] = useState([]);
  const [loaderNw, setLoaderNw] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loaderTime, setLoaderTime] = useState();
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const [listReports, setListReports] = useState([]);
  const ref = useRef([]);
  const filterRef = useRef([]);
  const [data, setData] = useState([]);
  const [projectResourceData, setProjectResourceData] = useState([]);
  const [displayState, setDisplayState] = useState(false);
  const [displayStateTwo, setDisplayStateTwo] = useState(false);
  const [displayStateThree, setDisplayStateThree] = useState(false);
  const [checked, setChecked] = useState([true, false]);
  const [responseData, setResponseDate] = useState(null);
  const [validation, setValidation] = useState(false);
  const [resourcesNames, setResourcesNames] = useState([]);
  const [resourceNw, setResourceNameBackup] = useState([]);
  const [checkDisable, setCheckDisable] = useState(false);
  const [checkMul, setCheckMul] = useState(false);
  const [checkDrop, setCheckDrop] = useState(false);
  const [checkBu, setcheckBu] = useState(false);
  const [filterName, setFName] = useState("");

  const materialTableElement = document.getElementsByClassName("childOne");
  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;

  const abortController = useRef(null);
  useEffect(() => {
    data[0] && setHeaderData(JSON.parse(JSON.stringify(data[0])));
  }, [data]);
  const [showPopover, setShowPopover] = useState(false);

  const handleNameClick = () => {
    setShowPopover(!showPopover);
  };

  const closePopover = () => {
    setShowPopover(false);
  };
  const dropdownRef = useRef(null);

  // Use useEffect to add a click event listener to the document when the component mounts
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closePopover();
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    getResourcesNames();
    let rId = url.split("/");
    setReportId(rId[rId.length - 1]);
  }, []);

  useEffect(() => {
    if (reportId == 14) {
      getData();
    }
  }, [reportId]);
  useEffect(() => {
    let imp = ["XLS", "PDF"];
    setExportData(imp);
  }, []);
  useEffect(() => {
    if (reportId != 0) {
      getReportName();
      getFilterBasedOnReportId();
    }
  }, [reportId]);
  useEffect(() => {
    multiselectVals();
    renderFiltersFnc();
  }, [filtersData, resourcesNames, reportName, resourceNw, formData]);

  useEffect(() => {
    if (reportId == 25) {
      multiselectVals();
      renderFiltersFnc();
    }
  }, [checkDisable, formData.resourcebu]);
  useEffect(() => {
    if (reportId == 21 || reportId == 25 || reportId == 9 || reportId == 16) {
      multiselectVals();
      renderFiltersFnc();
    }
  }, [checkMul, checkDrop, checkBu]);

  useEffect(() => {
    let optionsArr = [];
    if (responseData != null) {
      for (let i = 0; i < responseData.length; i++) {
        let optionsArrN = [];
        if (filterName == "contterms" || filterName == "month") {
          optionsArrN[0] = responseData[i].id;
          optionsArrN[1] = responseData[i].full_name;
        } else if (filterName == "customerprj") {
          optionsArrN[0] = responseData[i].id;
          optionsArrN[1] = responseData[i].project_name;
        } else if (
          filterName == "projectrpt" ||
          filterName == "department" ||
          filterName == "customer" ||
          filterName == "project"
        ) {
          optionsArrN[0] = responseData[i].value;
          optionsArrN[1] = responseData[i].text;
        }

        optionsArr.push(optionsArrN);
      }

      filterName == "month" || filterName == "contterms"
        ? (filtersData[2].values = optionsArr)
        : filterName == "customerprj" || filterName == "department"
        ? (filtersData[3].values = optionsArr)
        : filterName == "projectrpt"
        ? (filtersData[4].values = optionsArr)
        : filterName == "customer"
        ? reportId == 9
          ? (filtersData[4].values = optionsArr)
          : (filtersData[3].values = optionsArr)
        : filterName == "project" && (filtersData[4].values = optionsArr);

      if (reportId == 25 && filterName == "projectrpt") {
        let optionsDataNw = optionsArr;
        let optionsArrNw = [];
        if (optionsDataNw != null) {
          for (let i = 0; i < optionsDataNw.length; i++) {
            let optionsObj = {};
            optionsObj["code"] = optionsDataNw[i][0];
            optionsObj["name"] = optionsDataNw[i][1];
            optionsArrNw.push(optionsObj);
          }
          formData["resourcebu"] = optionsArrNw;
        }
      }

      renderFiltersFnc();
    }
  }, [responseData]);

  useEffect(() => {
    setreportsHeader(() => {
      return (
        <div>
          {reportId == 11 ? (
            <div align="center">
              <h4>
                {reportName} for {formData.month}
              </h4>
            </div>
          ) : reportId == 12 ? (
            <div align="center">
              <h4>
                {reportName} for the period{" "}
                {formData.timePeriod == "238"
                  ? formData.frmDt
                  : moment(formData.frmDt, "YYYY-MM-DD")
                      .format("DD-MMM-YY")
                      .replace(/\b[a-z]/g, (letter) =>
                        letter.toUpperCase()
                      )}{" "}
                to{" "}
                {formData.timePeriod == "238"
                  ? formData.toDt
                  : moment(formData.toDt, "YYYY-MM-DD")
                      .format("DD-MMM-YY")
                      .replace(/\b[a-z]/g, (letter) =>
                        letter.toUpperCase()
                      )}{" "}
              </h4>
            </div>
          ) : reportId == 25 ? (
            <div align="center">
              <h4>
                {reportName} for {formData.month}
              </h4>
            </div>
          ) : reportId == 16 ? (
            <div align="center">
              <h4>Billing Efforts</h4>
            </div>
          ) : (
            <div align="center">
              <h4>{reportName}</h4>
            </div>
          )}
          {reportId == 20 || reportId == 9 ? (
            <div className="legendContainer">
              <div className="legend blueNW">
                <div className="legendCircle"></div>
                <div className="legendTxt"> Weekend</div>
              </div>
            </div>
          ) : reportId == 33 ? (
            <div className="alert-note">
              <div className="alert-day-note">
                <span className="information-icon">
                  <IoMdInformationCircleOutline />{" "}
                </span>
                <span>
                  Note: Days considered as Alloc Start Dt to Alloc End Dt
                  (Excluding Weekends).
                </span>
              </div>
              <div className="alert-percent-note">
                <span className="information-icon">
                  <IoMdInformationCircleOutline />
                </span>
                <span> Note: Utilized % considered as</span>
              </div>
              <div className="alert-note-y-n">
                <span>
                  Yes : If Billable Approved Timesheets are 50% or above of
                  Resource Capacity, for previous 12 months.
                </span>
                <span>
                  No : If Billable Approved Timesheets are less than 50% of
                  Resource Capacity, for previous 12 months.
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      );
    });
  }, [reportName, data, projectResourceData]);
  const getReportData = () => {
    axios
      .get(baseUrl + `/reportms/report/getReportListing?userId=${loggedUserId}`)
      .then((resp) => {
        let data = resp.data;
        setListReports(data);
      });
  };
  useEffect(() => {
    getReportData();
  }, []);
  const getReportName = () => {
    axios({
      method: "get",
      url: baseUrl + `/reportms/report/getReportName?reportId=${reportId}`,
    })
      .then(function (response) {
        let resp = response.data;
        setReportName(resp);
        resp.forEach((item) => {
          if (item.display_name === textContent) {
            setRoutes([item]);
            sessionStorage.setItem("displayName", item.display_name);
          }
        });
      })
      .catch(function (response) {});
  };

  const getResourcesNames = () => {
    axios({
      method: "get",
      url: baseUrl + "/ProjectMS/risks/getAssignedData",
    }).then(function (response) {
      let res = response.data;
      let allData = [
        { employee_number: "", id: "-1", name: "<<ALL>>", userId: "" },
      ];
      let finalData = [...res, ...allData];
      setResourcesNames(finalData);
      setResourceNameBackup(res);
    });
  };

  const getFilterBasedOnReportId = () => {
    let loaderTime = setTimeout(() => {
      setLoaderNw(true);
    }, 2000);
    axios({
      method: "post",
      url: baseUrl + `/reportms/report/getfiltersData`,
      data: {
        notifyReportId: reportId,
        userId: loggedUserId,
      },
    }).then((response) => {
      setLoaderNw(false);
      clearTimeout(loaderTime);
      setDisplayStateThree(true);
      let rData = response.data;
      let customOrder =
        reportId == 9
          ? [0, 1, 3, 5, 2, 4]
          : reportId == 16
          ? [0, 1, 3, 2, 4]
          : reportId == 32
          ? [6, 7, 0, 1, 2, 3, 4, 5, 8]
          : reportId == 25
          ? [5, 0, 2, 3, 6, 1, 4]
          : reportId == 12
          ? [2, 0, 1]
          : "";
      let reArrangeArray =
        customOrder != "" ? customOrder.map((index) => rData[index]) : rData;
      setFiltersData(reArrangeArray);
    });
  };

  const multiselectVals = () => {
    for (let i = 0; i < filtersData.length; i++) {
      let filterType = filtersData[i].filterType;
      let optionsData = filtersData[i].values;

      let optionsArr = [];
      if (optionsData != null) {
        for (let j = 0; j < optionsData.length; j++) {
          let optionsObj = {};
          optionsObj["code"] = optionsData[j][0];
          optionsObj["name"] = optionsData[j][1];
          optionsArr.push(optionsObj);
        }
      }

      let key = filtersData[i]["FName"];

      switch (filterType) {
        case "Date Picker":
          formData[filtersData[i]["FName"]] =
            formData[filtersData[i]["FName"]] == undefined
              ? "" + moment().format("yyyy-MM-DD")
              : moment(formData[filtersData[i]["FName"]]).format("yyyy-MM-DD");
          break;

        case "Month Picker":
          if (reportId == 25) {
            formData[filtersData[i]["FName"]] =
              formData[filtersData[i]["FName"]] == undefined
                ? ""
                : moment(formData[filtersData[i]["FName"]]).format("MMMM yyyy");
          } else {
            formData[filtersData[i]["FName"]] =
              formData[filtersData[i]["FName"]] == undefined
                ? "" + moment().format("MMMM yyyy")
                : moment(formData[filtersData[i]["FName"]]).format("MMMM yyyy");
          }
          break;

        case "Week Picker":
          formData[filtersData[i]["FName"]] =
            formData[filtersData[i]["FName"]] == undefined
              ? "" + moment().format("yyyy-MM-DD")
              : moment(formData[filtersData[i]["FName"]]).format("yyyy-MM-DD");
          break;
        case "Radio":
          formData[filtersData[i]["FName"]] =
            formData[filtersData[i]["FName"]] == undefined
              ? "date"
              : formData[filtersData[i]["FName"]];

          break;

        case "Multi Dropdown":
          let valueArr = [];
          let optionsData = filtersData[i]["values"];
          if (optionsData != null) {
            for (let i = 0; i < optionsData.length; i++) {
              let optionsObj = {};
              optionsObj["code"] = optionsData[i][0];
              optionsObj["name"] = optionsData[i][1];
              valueArr.push(optionsObj);
            }

            formData[filtersData[i]["FName"]] =
              formData[filtersData[i]["FName"]] == undefined
                ? valueArr
                : formData[filtersData[i]["FName"]];
          }

          break;
        case "AutoComplete":
          let rName = formData[filtersData[i]["FName"]];
          let riName = resourcesNames[resourcesNames.length - 1];

          formData[filtersData[i]["FName"]] =
            formData[filtersData[i]["FName"]] == undefined ? riName : rName;

          break;
        case "Drop Down":
          if (reportId == 32 && filtersData[i]["FName"] == "source") {
            formData[filtersData[i]["FName"]] =
              formData[filtersData[i]["FName"]] == undefined
                ? optionsArr.length > 0 &&
                  optionsArr.map((d) => d.label).toString()
                : formData[filtersData[i]["FName"]].toString();
          } else {
            formData[filtersData[i]["FName"]] =
              formData[filtersData[i]["FName"]] == undefined
                ? ""
                : formData[filtersData[i]["FName"]].toString();
          }

          break;

        default:
          break;
      }
    }
  };

  // ........done later

  const dropDownHandler = (e, ele, optionsArr) => {
    if (reportId == 32 && ele["FName"] == "source") {
      let dgd = JSON.parse(JSON.stringify(optionsArr)).filter(
        (d) => d.value == e.target.value
      );

      let value = null;

      if (dgd.length == 0) {
        value = JSON.parse(JSON.stringify(optionsArr))
          .map((d) => d.label)
          .toString();
      } else {
        value = dgd[0]["label"];
      }

      setFormData((prev) => ({
        ...prev,
        [ele.FName]: value,
      }));
    } else if (reportId == 12) {
      if (e.target.value == 238) {
        filtersData[1].FilterName = "From Month";
        filtersData[1].filterType = "Month Picker";
        filtersData[2].FilterName = "To Month";
        filtersData[2].filterType = "Month Picker";
      } else if (e.target.value == 239) {
        filtersData[1].FilterName = "From Week";
        filtersData[1].filterType = "Week Picker";
        filtersData[2].FilterName = "To Week";
        filtersData[2].filterType = "Week Picker";
      } else if (e.target.value == 240) {
        filtersData[1].FilterName = "From Date";
        filtersData[1].filterType = "Date Picker";
        filtersData[2].FilterName = "To Date";
        filtersData[2].filterType = "Date Picker";
      } else {
        filtersData[1].FilterName = "From Date";
        filtersData[1].filterType = "DateEmpty Picker";
        filtersData[2].FilterName = "To Date";
        filtersData[2].filterType = "DateEmpty Picker";
      }
      setFormData((prev) => ({
        ...prev,
        [ele.FName]: e.target.value,
      }));
      renderFiltersFnc();
    } else if (reportId == 25) {
      formData[ele.FName] = e.target.value;
    } else {
      setFormData((prev) => ({
        ...prev,
        [ele.FName]: e.target.value,
      }));
    }
  };

  const onChangeRadioButtonHandler = (e, ele) => {
    let val = e.target.value;
    let locCheck = checked;
    if (val == "date") {
      locCheck[0] = true;
      locCheck[1] = false;
      setChecked(locCheck);

      filtersData[0].FilterName = "From Date";
      filtersData[0].filterType = "Date Picker";
      filtersData[1].FilterName = "To Date";
      filtersData[1].filterType = "Date Picker";

      setFormData((prev) => ({
        ...prev,
        [ele.FName]: val,
      }));
    } else {
      locCheck[0] = false;
      locCheck[1] = true;

      filtersData[0].FilterName = "From Month";
      filtersData[0].filterType = "Month Picker";
      filtersData[1].FilterName = "To Month";
      filtersData[1].filterType = "Month Picker";

      setChecked(locCheck);
      setFormData((prev) => ({
        ...prev,
        [ele.FName]: val,
      }));
    }
    renderFiltersFnc();
  };

  const getDataOnChange = (fName) => {
    setFName(fName);
    const tempData = JSON.parse(JSON.stringify(formData));
    Object.keys(tempData).forEach((d) => {
      if (
        [
          "contterms",
          "projectrpt",
          "department",
          "customer",
          "project",
        ].includes(d)
      ) {
        tempData[d] != ""
          ? (tempData[d] = tempData[d]?.map((d) => d?.code).toString())
          : "";
      } else if (["month"].includes(d)) {
        const inputDate = new Date(`${tempData.month} 1`);
        if (!isNaN(inputDate.getTime())) {
          const year = inputDate.getFullYear();
          const month = (inputDate.getMonth() + 1).toString().padStart(2, "0");
          const lastDayOfMonth = new Date(
            year,
            inputDate.getMonth() + 1,
            0
          ).getDate();
          const formattedDate = `${year}-${month}-${lastDayOfMonth
            .toString()
            .padStart(2, "0")}`;
          tempData[d] = formattedDate;
        }
      }
    });
    tempData["userId"] = loggedUserId;
    tempData["type"] = fName;
    if (fName == "month" || fName == "contterms") {
      axios({
        method: "get",
        url:
          baseUrl +
          `/reportms/report/getCustOnContTermsMonthFilter?conttermID=${tempData.contterms}&plannedEndDt=${tempData.month}`,
      })
        .then((response) => {
          let rData = response.data;
          setResponseDate(rData);
        })
        .catch((error) => console.log(error));
    } else if (fName == "customerprj") {
      axios({
        method: "get",
        url:
          baseUrl +
          `/reportms/report/getProjectsByContTermsMonthCustomer?conttermID=${tempData.contterms}&plannedEndDt=${tempData.month}&custId=${tempData.customerprj}`,
      })
        .then((response) => {
          let rData = response.data;
          setResponseDate(rData);
        })
        .catch((error) => console.log(error));
    } else if (fName == "projectrpt") {
      axios({
        method: "get",
        url:
          baseUrl +
          `/reportms/report/getResourceBusinessUnits?projs=${tempData[fName]}`,
      })
        .then((response) => {
          let rData = response.data;
          setResponseDate(rData);
        })
        .catch((error) => console.log(error));
    } else if (fName == "project") {
      axios({
        method: "post",
        url: baseUrl + `/reportms/report/getRESProjects`,
        data: {
          userId: tempData["userId"],
          prjIds: tempData[fName].length == 0 ? null : tempData[fName],
        },
      })
        .then((response) => {
          let rData = response.data;
          setResponseDate(rData);
        })
        .catch((error) => console.log(error));
    } else if (fName == "department") {
      axios({
        method: "get",
        url:
          baseUrl +
          `/reportms/report/getCustomers?userId=${tempData.userId}&deptIds=${
            tempData.department.length == 0 ? null : tempData.department
          }`,
      })
        .then((response) => {
          let rData = response.data;
          setResponseDate(rData);
        })
        .catch((error) => console.log(error));
    } else if (fName == "customer") {
      tempData[fName] =
        tempData[fName].length == 0
          ? tempData[fName]
          : tempData[fName].split(",");
      tempData[fName] = tempData[fName].map(function (str) {
        return parseInt(str);
      });
      axios({
        method: "post",
        url: baseUrl + `/reportms/report/getProjects`,
        data: {
          type: tempData.type,
          Ids: tempData[fName],
          userId: null,
        },
      })
        .then((response) => {
          let rData = response.data;
          setResponseDate(rData);
        })
        .catch((error) => console.log(error));
    }
  };

  var fDate, tDate;
  const onChangeDatePickerHandler = (e, fName, fType) => {
    if (fType == "Date Picker" || fType == "Week Picker") {
      formData[fName] = moment(e.$d).format("yyyy-MM-DD");
    } else {
      formData[fName] = moment(e.$d).format("MMMM yyyy");
    }

    if (fName == "frmDt" || fName == "frmMonth" || fName == "startMonth") {
      fDate = new Date(e);
    } else if (fName == "toDt" || fName == "toMonth" || fName == "endMonth") {
      tDate = new Date(e);
    }
  };

  const shouldDisableDate = (fName, filterNameN) => (date) => {
    if (filterNameN.includes("Week")) {
      let wdate = new Date(date);
      let found = wdate.getDay();
      if (fName == "frmDt" && tDate != undefined) {
        return date >= tDate || found != 1;
      } else if (fName == "toDt" && fDate != undefined) {
        return date < fDate || found != 5;
      } else {
        if (fName == "frmDt") {
          return found != 1;
        } else {
          return found != 5;
        }
      }
    } else {
      if (fName == "frmDt" && tDate != undefined) {
        return date >= tDate;
      } else if (fName == "toDt" && fDate != undefined) {
        return date < fDate;
      }
    }
  };
  const currentDate = new Date();
  const shouldDisableMonth = (fName) => (month) => {
    if (reportId == 29) {
      if (fName == "startMonth" && tDate != undefined) {
        return month > tDate;
      } else if (fName == "endMonth" && fDate != undefined) {
        return month < fDate;
      } else if (
        fName == "actualsMonth" &&
        (tDate != undefined || fDate != undefined)
      ) {
        return month < fDate || month > tDate;
      }
    } else {
      if ((fName == "frmDt" || fName == "frmMonth") && tDate != undefined) {
        return month >= tDate;
      } else if (
        (fName == "toDt" || fName == "toMonth") &&
        fDate != undefined
      ) {
        let fDateN = fDate.getMonth() - 1;
        let fDateY = fDate.getYear();
        let monthN = new Date(month);
        let monthNw = monthN.getMonth();
        if (reportId == 21) {
          return fDateN == -1
            ? month < fDate &&
                !(monthN.getYear() == fDateY - 1 && monthNw == 11)
            : (month < fDate && monthN.getYear() != fDateY) ||
                (monthNw < fDateN && monthN.getYear() == fDateY);
        } else {
          // return fDateN == -1
          //   ? (month < fDate &&
          //     !(monthN.getYear() == fDateY - 1 && monthNw == 11)) ||
          //   month > currentDate
          //   : (month < fDate && monthN.getYear() != fDateY) ||
          //   (monthNw < fDateN && monthN.getYear() == fDateY) ||
          //   month > currentDate;
          return month < fDate || month > currentDate;
        }
      } else {
        if (reportId != 21) {
          return month > currentDate;
        }
      }
    }
  };

  const handleOnSearch = (string, result) => {
    let fixedValue = [
      { employee_number: "", id: "-1", name: "<<ALL>>", userId: "" },
    ];
    const filteredItems = resourcesNames
      .slice(0, -1)
      .filter((item) => item.name.toLowerCase().includes(string.toLowerCase()));

    const allData = [...fixedValue, ...filteredItems];
    setResourceNameBackup(allData);
  };

  // console.log(filtersData, "filtersData");
  // console.log(reportId, "reportId");
  // console.log(formData, "formdata");
  const itemTemplate = (option) => {
    return (
      <div className="ellipsis" title={option.name}>
        {option.name}
      </div>
    );
  };
  const renderFiltersFnc = () => {
    setRenderFilters(() => {
      return filtersData?.map((ele, index) => {
        let filterType = ele.filterType;
        let filterName = ele.FilterName;
        let optionsData = ele.values;
        let optionsArr = [];
        let inputString = "";

        if (optionsData != null) {
          for (let i = 0; i < optionsData.length; i++) {
            let optionsObj = {};
            optionsObj["code"] = optionsData[i][0];
            optionsObj["name"] = optionsData[i][1];
            optionsArr.push(optionsObj);
          }
        }
        setInitialOptionsState((prev) => ({
          ...prev,
          [ele.FName]: optionsArr,
        }));
        if (reportId == 32 && filterType == "AutoComplete") {
          let rNameN = formData[ele.FName];
          inputString = rNameN?.name;
        }

        return (
          <div key={index} className="col-md-3 mb-2 ">
            <div className="form-group row">
              <label className="col-5" htmlFor="fromMonth">
                {ele.FilterName}
                {ele.FName != "BusinessUnits" ? (
                  <span className="error-text">*</span>
                ) : (
                  ""
                )}
              </label>
              <span className="col-1 p-0">:</span>
              <div className="col-6">
                {filterType == "Date Picker" ? (
                  <div
                    id={ele.FName}
                    key={`DatePicker${ele.FName}`}
                    className={`muidatepicker   adv ${ele.FName} `}
                    ref={(e) => {
                      ref.current = ref?.current?.filter((d) => {
                        const hasMuiDatePickerClass =
                          d?.className?.includes("muidatepicker");
                        const hasFilterNameClass = d?.className?.includes(
                          ele.FName
                        );
                        return !hasMuiDatePickerClass || !hasFilterNameClass;
                      });
                      ref.current.push(e);
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{
                            "& > div": {},
                            "& > div > div, & > div > div > div, & .MuiCalendarPicker-root":
                              {},
                            "& .MuiTypography-caption": {
                              width: 20,
                              margin: 0,
                            },
                            "& .PrivatePickersSlideTransition-root": {
                              minHeight: 20 * 6,
                            },
                            '& .PrivatePickersSlideTransition-root [role="row"]':
                              {
                                margin: 0,
                              },
                            "& .MuiPickersDay-dayWithMargin": {
                              margin: 0,
                            },
                            "& .MuiPickersDay-root": {
                              width: 20,
                              height: 20,
                            },
                          }}
                          format="DD-MMM-YYYY"
                          slotProps={{
                            textField: {
                              placeholder: filterName,
                              readOnly: true,
                            },
                            MuiPickersCalendar: {
                              sx: {
                                height: "400px", // Adjust the height as needed
                              },
                            },
                          }}
                          valueDefault={null}
                          shouldDisableDate={shouldDisableDate(
                            ele.FName,
                            filterName
                          )}
                          onChange={(e) => {
                            onChangeDatePickerHandler(
                              e,
                              ele.FName,
                              ele.filterType
                            );
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                ) : filterType == "Week Picker" ? (
                  <div
                    id={ele.FName}
                    key={`WeekPicker${ele.FName}`}
                    className={`muidatepicker  dateCalenderHieght adv ${ele.FName} `}
                    ref={(e) => {
                      ref.current = ref?.current?.filter((d) => {
                        const hasMuiDatePickerClass =
                          d?.className?.includes("muidatepicker");
                        const hasFilterNameClass = d?.className?.includes(
                          ele.FName
                        );
                        return !hasMuiDatePickerClass || !hasFilterNameClass;
                      });
                      ref.current.push(e);
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoItem>
                        <DatePicker
                          sx={{
                            "& > div": {},
                            "& > div > div, & > div > div > div, & .MuiCalendarPicker-root":
                              {},
                            "& .MuiTypography-caption": {
                              width: 20,
                              margin: 0,
                            },
                            "& .PrivatePickersSlideTransition-root": {
                              minHeight: 20 * 6,
                            },
                            '& .PrivatePickersSlideTransition-root [role="row"]':
                              {
                                margin: 0,
                              },
                            "& .MuiPickersDay-dayWithMargin": {
                              margin: 0,
                            },
                            "& .MuiPickersDay-root": {
                              width: 20,
                              height: 20,
                            },
                          }}
                          format="DD-MMM-YYYY"
                          slotProps={{
                            textField: {
                              placeholder: filterName,
                              readOnly: true,
                            },
                          }}
                          valueDefault={null}
                          shouldDisableDate={shouldDisableDate(
                            ele.FName,
                            filterName
                          )}
                          onChange={(e) => {
                            onChangeDatePickerHandler(
                              e,
                              ele.FName,
                              ele.filterType
                            );
                          }}
                        />
                      </DemoItem>
                    </LocalizationProvider>
                  </div>
                ) : filterType == "Month Picker" ? (
                  <div
                    id={ele.FName}
                    key={`MonthPicker${ele.FName}`}
                    className={`muidatepicker  monthCalenderHieghtadv adv ${ele.FName} `}
                    ref={(e) => {
                      ref.current = ref?.current?.filter((d) => {
                        const hasMuiDatePickerClass =
                          d?.className?.includes("muidatepicker");
                        const hasFilterNameClass = d?.className?.includes(
                          ele.FName
                        );
                        return !hasMuiDatePickerClass || !hasFilterNameClass;
                      });
                      ref.current.push(e);
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoItem>
                        <DatePicker
                          views={["year", "month"]}
                          openTo="month"
                          sx={{
                            "& > div": {},
                            "& > div > div, & > div > div > div, & .MuiCalendarPicker-root":
                              {
                                height: 10,
                              },
                            "& .MuiTypography-caption": {
                              width: 20,
                              margin: 0,
                            },
                            "& .PrivatePickersSlideTransition-root": {
                              minHeight: 20 * 6,
                            },
                            '& .PrivatePickersSlideTransition-root [role="row"]':
                              {
                                margin: 0,
                              },
                            "& .MuiPickersDay-dayWithMargin": {
                              margin: 0,
                            },
                            "& .MuiPickersDay-root": {
                              width: 20,
                              height: 20,
                            },
                          }}
                          format="MMMM YYYY"
                          valueDefault={null}
                          shouldDisableMonth={
                            reportId != 11 &&
                            reportId != 31 &&
                            reportId != 25 &&
                            reportId != 22 &&
                            reportId != 24
                              ? shouldDisableMonth(ele.FName)
                              : ""
                          }
                          slotProps={{
                            textField: {
                              placeholder: filterName,
                              readOnly: true,
                            },
                          }}
                          onChange={(e) => {
                            onChangeDatePickerHandler(
                              e,
                              ele.FName,
                              ele.filterType
                            );
                            if (reportId == 25) {
                              formData["contterms"]?.length > 0 &&
                                (setCheckDisable(true),
                                setCheckMul(true),
                                getDataOnChange(ele.FName));
                            }
                          }}
                        />
                      </DemoItem>
                    </LocalizationProvider>
                  </div>
                ) : filterType == "DateEmpty Picker" && reportId == 12 ? (
                  <div
                    id={ele.FName}
                    key={`DateEmptyPicker${ele.FName}`}
                    className={`muidatepicker   adv ${ele.FName} `}
                    ref={(e) => {
                      ref.current = ref?.current?.filter((d) => {
                        const hasMuiDatePickerClass =
                          d?.className?.includes("muidatepicker");
                        const hasFilterNameClass = d?.className?.includes(
                          ele.FName
                        );
                        return !hasMuiDatePickerClass || !hasFilterNameClass;
                      });
                      ref.current.push(e);
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          sx={{
                            "& > div": {},
                            "& > div > div, & > div > div > div, & .MuiCalendarPicker-root":
                              {},
                            "& .MuiTypography-caption": {
                              width: 20,
                              margin: 0,
                            },
                            "& .PrivatePickersSlideTransition-root": {
                              minHeight: 20 * 6,
                            },
                            '& .PrivatePickersSlideTransition-root [role="row"]':
                              {
                                margin: 0,
                              },
                            "& .MuiPickersDay-dayWithMargin": {
                              margin: 0,
                            },
                            "& .MuiPickersDay-root": {
                              width: 20,
                              height: 20,
                            },
                          }}
                          format="DD-MMM-YYYY"
                          slotProps={{
                            textField: {
                              placeholder: filterName,
                              readOnly: true,
                            },
                            MuiPickersCalendar: {
                              sx: {
                                height: "400px", // Adjust the height as needed
                              },
                            },
                          }}
                          valueDefault={null}
                          shouldDisableDate={shouldDisableDate(
                            ele.FName,
                            filterName
                          )}
                          onChange={(e) => {
                            onChangeDatePickerHandler(
                              e,
                              ele.FName,
                              ele.filterType
                            );
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                ) : filterType == "Drop Down" ? (
                  <>
                    <select
                      id={ele.FName}
                      className="text"
                      ref={(e) => {
                        ref.current.push(e);
                      }}
                      onChange={(e) => {
                        dropDownHandler(e, ele, optionsArr);
                        if (reportId == 25 && ele.FName == "customerprj") {
                          setCheckMul(false);
                          setCheckDrop(true);
                          setcheckBu(false);
                          e.target.value != "" && getDataOnChange(ele.FName);
                        }

                        renderFiltersFnc();
                      }}
                      disabled={
                        reportId == 25 && checkDisable == false ? true : false
                      }
                    >
                      <option value="" selected={checkMul}>
                        {"<<Please Select>>"}
                      </option>
                      {optionsArr.map((ele, index) => {
                        return (
                          <option key={index} value={ele.code}>
                            {ele.name}
                          </option>
                        );
                      })}
                    </select>
                  </>
                ) : filterType == "Multi Dropdown" ? (
                  <div
                    className="primemultiselect"
                    ref={(e) => {
                      ref.current.push(e);
                    }}
                  >
                    <MultiSelect
                      filter
                      value={
                        reportId == 21 &&
                        ele.FName == "customer" &&
                        checkMul == true
                          ? []
                          : reportId == 9 &&
                            ele.FName == "customer" &&
                            checkMul == true
                          ? []
                          : (reportId == 9 || reportId == 16) &&
                            ele.FName == "project" &&
                            checkDrop == true
                          ? []
                          : reportId == 16 &&
                            ele.FName == "resource" &&
                            checkMul == true
                          ? []
                          : reportId == 25 &&
                            ele.FName == "projectrpt" &&
                            checkDrop == true
                          ? []
                          : reportId == 25 &&
                            ele.FName == "resourcebu" &&
                            checkBu == false
                          ? []
                          : formData[ele.FName]
                      }
                      hasSelectAll={true}
                      onChange={(e) => {
                        formData[ele.FName] = e.value;
                        if (reportId == 25) {
                          if (ele.FName == "contterms") {
                            setCheckMul(true);
                            formData.month != "Invalid date" &&
                            formData.month != ""
                              ? e.value != ""
                                ? (setCheckDisable(true),
                                  getDataOnChange(ele.FName))
                                : setCheckDisable(false)
                              : "";
                          } else if (ele.FName == "projectrpt") {
                            setCheckDrop(false);
                            e.value != ""
                              ? (setcheckBu(true), getDataOnChange(ele.FName))
                              : setcheckBu(false);
                          }
                        } else if (reportId == 21) {
                          ele.FName == "department"
                            ? (setCheckMul(true), getDataOnChange(ele.FName))
                            : ele.FName == "customer" && setCheckMul(false);
                        } else if (reportId == 9) {
                          if (ele.FName == "department") {
                            setCheckMul(true);
                            getDataOnChange(ele.FName);
                          } else if (ele.FName == "customer") {
                            setCheckMul(false);
                            setCheckDrop(true);
                            getDataOnChange(ele.FName);
                          } else {
                            setCheckDrop(false);
                          }
                        } else if (reportId == 16) {
                          if (ele.FName == "customer") {
                            setCheckDrop(true);
                            getDataOnChange(ele.FName);
                          } else if (ele.FName == "project") {
                            setCheckDrop(false);
                            setCheckMul(true);
                            getDataOnChange(ele.FName);
                          } else {
                            setCheckMul(false);
                          }
                        }
                        renderFiltersFnc();
                      }}
                      options={optionsArr}
                      optionLabel="name"
                      placeholder="<<Please Select>>"
                      maxSelectedLabels={2}
                      virtualScrollerOptions={{ itemSize: 30 }}
                      disabled={
                        reportId == 25
                          ? (formData["customerprj"] == "" &&
                              ele.FName == "projectrpt") ||
                            (checkBu == false && ele.FName == "resourcebu")
                            ? true
                            : false
                          : ""
                      }
                      className="w-full md:w-20rem"
                      itemTemplate={itemTemplate}
                    />
                  </div>
                ) : filterType == "Radio" ? (
                  <div
                    className="radioContainer"
                    onChange={(e) => {
                      onChangeRadioButtonHandler(e, ele);
                    }}
                  >
                    <div className="radioOption">
                      <input
                        checked={checked[0]}
                        type="radio"
                        value="date"
                        name="Date"
                      />{" "}
                      Date
                    </div>
                    <div className="radioOption">
                      <input
                        checked={checked[1]}
                        type="radio"
                        value="month"
                        name="Month"
                      />{" "}
                      Month
                    </div>
                  </div>
                ) : filterType == "AutoComplete" ? (
                  <div
                    className="autoComplete-container react  autocomplete"
                    ref={(e) => {
                      ref.current.push(e);
                    }}
                  >
                    <div>
                      <ReactSearchAutocomplete
                        items={resourceNw}
                        id="rNameId"
                        name="rNameId"
                        type="text"
                        className="err cancel nochange"
                        inputSearchString={inputString}
                        onSelect={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            [ele.FName]: e,
                          }));
                        }}
                        fuseOptions={{
                          minMatchCharLength: 1,
                          keys: ["id", "name"],
                        }}
                        resultStringKeyName="name"
                        maxResults={1000}
                        onSearch={handleOnSearch}
                        showNoResults={false}
                        showClear={false}
                        showIcon={false}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        );
      });
    });
  };

  const onClickHandler = () => {
    getData();
  };

  const getData = () => {
    multiselectVals();
    filterRef.current = ref.current.filter((d) => d != null);
    let valid = GlobalValidation(filterRef);
    if (valid) {
      setValidation(
        <div className="statusMsg error">
          <span>
            <BiError />
          </span>
          Please select the valid values for highlighted fields
        </div>
      );

      setTimeout(() => {
        setValidation("");
      }, 3000);

      return;
    }
    setValidation("");

    let loaderTimeOut = setTimeout(() => {
      setLoader(true);
    }, 2000);

    let tempFormData = JSON.parse(JSON.stringify(formData));

    Object.keys(tempFormData).forEach((d) => {
      if (
        [
          //"customer",
          "department",
          "project",
          "BusinessUnits",
          "projectSource",
          "resource",
          "country",
          "appWFlow",
          "expFor",
          "expType",
          "patWFlow",
          "contterms",
          "measures",
          "projectrpt",
          "resourcebu",
          //"source",
        ].includes(d) ||
        (["customer"].includes(d) && reportId != 33)
      ) {
        tempFormData[d] = tempFormData[d].map((d) => d.code).toString();
      } else if (["source"].includes(d)) {
        tempFormData[d] = tempFormData[d].map((d) => d.name).toString();
      } else if (["Resource"].includes(d)) {
        tempFormData[d] = tempFormData[d].id;
      }
    });

    tempFormData["userId"] = loggedUserId;
    tempFormData["notify_report_id"] = reportId;
    tempFormData["is_notification"] = 0;

    setDisplayState(false);
    setDisplayStateTwo(false);
    abortController.current = new AbortController();
    axios({
      method: "post",
      url: baseUrl + `/reportms/report/saveFilters`,
      data: tempFormData,
      signal: abortController.current.signal,
    }).then((response) => {
      clearTimeout(loaderTimeOut);
      let Data = response.data;
      setVisible(!visible);
      setCheveronIcon(FaChevronCircleDown);
      // console.log(Data, 'Dataaa')
      let tabData = Data.tableData;
      if (Object.keys(tabData[1]).length === 0) {
        tabData = tabData.slice(0, -1);
        setEmptyData(true);
      }
      for (let i = 0; i < tabData.length; i++) {
        const obj = tabData[i];

        Object.keys(obj).forEach((d) => {
          if ([null, "null", undefined].includes(obj[d])) {
            obj[d] = d == "Project Type" ? "-" : "";
          }
        });
      }

      let ndHead = [];
      if (reportId == 20 || reportId == 9) {
        const object = {};
        Object.keys(tabData[0]).forEach((d) => {
          let unWanted = ["level", "children", "colorLevel", "isWeekend"];
          if (unWanted.includes(d) == false) {
            object[d] = d;
          }
        });
        ndHead.push(object);

        let finalTabData = [];
        for (let i = 0; i < tabData.length; i++) {
          let EmpId = tabData[i]["Resource"];
          let Resource = tabData[i]["Project"];
          let Project = tabData[i]["Department"];
          let Department = tabData[i]["Primary PM"];
          let PrimaryPM = tabData[i]["Emp Id"];

          tabData[i]["Emp Id"] = EmpId;
          tabData[i]["Resource"] = Resource;
          tabData[i]["Project"] = Project;
          tabData[i]["Department"] = Department;
          tabData[i]["Primary PM"] = PrimaryPM;
        }

        tabData = tabData.slice(1);
      } else if (reportId == 9) {
        const object = {};
        Object.keys(tabData[0]).forEach((d) => {
          let unWanted = ["level", "children", "colorLevel", "isWeekend"];
          if (unWanted.includes(d) == false) {
            object[d] = d;
          }
        });
        ndHead.push(object);
        tabData = tabData.slice(1);
      } else if (reportId == 23) {
        const filteredHeaders = tabData[0];
        delete filteredHeaders["S.No"];
        delete filteredHeaders["Others"];
        delete filteredHeaders["GM (True)"];
        delete filteredHeaders["Cost (True)"];
        delete filteredHeaders["Available"];
        delete filteredHeaders["Available"];
        delete filteredHeaders["Net Capacity"];

        ndHead.push(filteredHeaders);
        tabData = tabData.slice(2);
      }

      reportId != 23 &&
      reportId != 20 &&
      reportId != 9 &&
      reportId != 25 &&
      reportId != 12
        ? (tabData = tabData.slice(0, 1).concat(tabData.slice(2)))
        : "";

      let finalTablData = [...ndHead, ...tabData];

      let pResourceData = { ...Data };
      if (reportId == 25 || reportId == 12) {
        setDisplayStateTwo(true);
        setProjectResourceData(pResourceData);
      } else {
        finalTablData?.slice(1).forEach((object) => {
          Object.keys(object).forEach((item) => {
            if (
              (reportId == 32 && item == "Expense Date") ||
              (reportId == 23 &&
                (item == "Alloc End Dt" ||
                  item == "Alloc St Dt" ||
                  item == "Next Alloc Dt"))
            ) {
              let value = object[item];
              if (value != "") {
                object[item] = moment(value, "YYYY-MM-DD")
                  .format("DD-MMM-YY")
                  .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
              }
            }
          });
        });

        setData(finalTablData);
        setDisplayState(true);
      }
    });
  };
  const numberWithCommas = (x, field) => {
    var number = String(x);
    if (number.includes(".") == true) {
      var decimalNumbers = number;
      var num = Number(decimalNumbers);
      let FdN =
        num != null && (field == "Gross Capacity" || field == "Net Capacity")
          ? num?.toFixed(2)
          : num?.toFixed(2);
      let final = FdN.split(".");
      final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");
      return final.join(".");
    } else {
      return (
        number != null && number?.replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",")
      );
    }
  };

  const generateBodyWithTooltip = (field, isWeekendCol) => (data) => {
    const isDate = moment(data[field], moment.ISO_8601, true).isValid();
    let isOnlyDigits = /^-?[0-9]*\.?[0-9]*$/.test(data[field]);

    return (
      <div
        className={
          isOnlyDigits == true &&
          field != "Emp ID" &&
          field != "Emp Id" &&
          field != "Type" &&
          field != "S.No" &&
          field != "Location"
            ? "numberCol"
            : field == "S.No"
            ? "dateCol"
            : isDate == true &&
              field != "Emp ID" &&
              field != "Emp Id" &&
              field != "S.No" &&
              field != "Location" &&
              field != "Type"
            ? "dateCol"
            : ""
        }
      >
        <div className={isWeekendCol == true ? "custom-column-class" : ""}>
          <div
            className="ellipsis"
            title={
              isOnlyDigits == true &&
              field != "Emp ID" &&
              field != "Emp Id" &&
              field != "Type" &&
              field != "S.No" &&
              field != "Location"
                ? numberWithCommas(data[field], field)
                : data[field]
            }
          >
            {isOnlyDigits == true &&
            field != "Emp ID" &&
            field != "Emp Id" &&
            field != "Type" &&
            field != "S.No" &&
            field != "Location"
              ? numberWithCommas(data[field], field)
              : data[field]}
          </div>
        </div>
      </div>
    );
  };

  const dynamicColumns = Object.keys(headerData)?.map((col, i) => {
    let isCurrentDateWeekend;
    if (reportId == 20 || reportId == 9) {
      const regex = /\d/;
      const isDigit = regex.test(col);
      if (isDigit) {
        const dateObject = moment(col, "DD-MMM-YYYY").toDate();
        const dayOfWeek = dateObject.getDay();
        isCurrentDateWeekend =
          dayOfWeek === 0 || dayOfWeek === 6 ? true : false;
      }
    }
    let body;
    body = generateBodyWithTooltip(col, isCurrentDateWeekend);
    return isCurrentDateWeekend == true && (reportId == 20 || reportId == 9) ? (
      <Column
        sortable
        key={col}
        field={col}
        body={body}
        header={<div className="custom-header-class">{headerData[col]}</div>}
        title="Edit"
      />
    ) : (
      <Column
        sortable
        key={col}
        field={col}
        body={body}
        header={headerData[col]}
        title="Edit"
      />
    );
  });
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
    setLoaderNw(false);
  };

  return (
    <>
      <div>
        <div className="col-md-12 mb-3">
          <div className="pageTitle">
            <div className=" col-md-12 childOne">
              <div className="reports-breadcrum">
                <span>
                  <Link
                    className="breadcrumbHomeIcon"
                    to={`/#/resource/dashboard`}
                  >
                    <FaHome />
                  </Link>{" "}
                  <div></div>
                </span>
                <span style={{ color: "#8a93a2" }}>
                  {" "}
                  <BiChevronRight />
                </span>
                <span
                  className="drop-down-link"
                  onClick={handleNameClick}
                  ref={dropdownRef}
                >
                  <Link to="#">Reports</Link>

                  {showPopover && (
                    <div className="repots-dropdown-menu">
                      <ul>
                        {listReports.map((report) => (
                          <li key={report.report_id}>
                            <Link
                              to={`/report/getReport/reportId/${report.report_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {report.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </span>
                <span style={{ color: "#8a93a2" }}>
                  {" "}
                  <BiChevronRight />
                </span>

                <span style={{ color: "#8a93a2" }}>{reportName}</span>
              </div>
            </div>
            <div className="childTwo">
              <h2>{reportName}</h2>
            </div>
            <div className="childThree reportsFilter-btn">
              <div className="col-md-12 collapseHeader to-remove-border-bottom">
                {reportId != 14 ? (
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
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>

        {validation}
        <div className="customCard  reportsunderline">
          {loaderNw ? <Loader handleAbort={handleAbort} /> : ""}
          {displayStateThree == true && reportId != 14 ? (
            <>
              <CCollapse visible={!visible}>
                <div className="group-content row  ">
                  <div className="form-group row mt-2">{renderFilters}</div>
                  {["14"].includes(reportId) == false ? (
                    <div className="col-12" align="center">
                      <button
                        className="btn btn-primary my-2"
                        onClick={() => {
                          onClickHandler();
                        }}
                      >
                        <BiSearch />
                        <span>Search</span>
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </CCollapse>
            </>
          ) : (
            ""
          )}
          {loader ? <Loader handleAbort={handleAbort} /> : ""}
          {displayState ? (
            <CellRendererPrimeReactDataTable
              fileName={
                reportId == 11
                  ? reportName[0] + " " + "for" + " " + formData.month
                  : reportName[0]
              }
              CustomersFileName={reportName}
              reportsMaxHeight={maxHeight1}
              data={data}
              dynamicColumns={dynamicColumns}
              headerData={headerData}
              setHeaderData={setHeaderData}
              exportData={exportData}
              rows={25}
              reportsHeader={reportsHeader}
              setLoader={setLoader}
              reportId={reportId}
              reportName={reportName}
              emptyData={emptyData}
            />
          ) : (
            ""
          )}
          {displayStateTwo ? (
            <MaterialReactReportsTable
              reportIdNw={reportId}
              setLoader={setLoader}
              reportsData={projectResourceData}
              reportsHeader={reportsHeader}
              fileName={reportName[0]}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default ReportIdComponent;
