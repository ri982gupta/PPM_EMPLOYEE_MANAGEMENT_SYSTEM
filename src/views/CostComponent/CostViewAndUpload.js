import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import UploadExcelSheet from "./UploadExcelSheet";
import { environment } from "../../environments/environment";
import { GrFormView } from "react-icons/gr";
import { IconButton } from "@mui/material";
import {
  FaCaretDown,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSave,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import CostLoginHistory from "./CostLoginHistory";
import { AiFillWarning, AiOutlineHistory } from "react-icons/ai";
import CostChangeHistory from "./CostChangeHistory";
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { AiFillCloseCircle } from "react-icons/ai";
import { signal } from "@preact/signals";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdModeEditOutline,
} from "react-icons/md";
import "./CostCss.scss";
import Loader from "../Loader/Loader";
import { CCollapse } from "@coreui/react";
import { AiOutlineWarning } from "react-icons/ai";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { FileUpload } from "@mui/icons-material";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoCalculator } from "react-icons/io5";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
const userInputCostValue = signal("");
const updatedCostOrNot = signal(false);
const borderColor = signal("");

function CostViewAndUpload(props) {
  const {
    formData,
    country,
    departments,
    selectedDepartments,
    filtersData,
    setfiltersData,
    date,
    setDate,
    setSelectedDepartments,
  } = props;

  const baseUrl = environment.baseUrl;

  let url = window.location.href;

  const loggedUserId = localStorage.getItem("resId");
  const [visible, setVisible] = useState(false);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  // const [resourceCostData, setResourceCostData] = useState(null);
  const [excelUploadPopUp, setExcelUploadPopUp] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const viewAllState = useRef(false);
  const viewAllStateArr = useRef([]);
  const maskId = useRef("");
  const [resourceCostRespData, setResourceCostRespData] = useState();
  const [costLoginHistoryPopUp, setCostLoginHistoryPopUp] = useState(false);
  const [costLoginHistoryData, setCostLoginHistoryData] = useState([]);
  const [costChangeHistoryPopUp, setCostChangeHistoryPopUp] = useState(false);
  const [costHistoryChangeData, setCostHistoryChangeData] = useState([]);
  const textInputRef = useRef("show");
  const textInputRefId = useRef("");
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [gridComputedState, setGridComputedState] = useState(false);
  const [statusMessage, setStatusMessage] = useState(false);
  const [loaderTimer, setLoaderTimer] = useState(false);
  const [getData, setGetData] = useState(0);

  const abortController = useRef([]);
  const ref = useRef([]);
  const editedCheck = {};
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchValue, setSearchValue] = useState("");
  // const [displayTable, setDisplayTable] = useState(false);

  const handleChangeDate = (date) => setDate(date);
  const materialTableElement = document.getElementsByClassName("childOne");

  const maxHeight1 =
    useDynamicMaxHeight(materialTableElement, "fixedcreate") - 46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 - 74) + "px"
  );
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getResourcesCostData = async (data) => {
    const loaderTime = setTimeout(() => {
      setLoaderTimer(true);
    }, 2000);
    filtersData["fromDate"] = moment(date)
      .startOf("month")
      .format("YYYY-MM-DD");
    filtersData["toDate"] = moment(date).endOf("month").format("YYYY-MM-DD");
    if (data !== undefined && data.includes("Calculate")) {
      abortController.current = new AbortController();
      const computedData = await axios({
        method: "POST",
        url: baseUrl + `/CostMS/cost/computedCost`,

        signal: abortController.current.signal,
        data: filtersData,
      });
    }
    abortController.current = new AbortController();
    filtersData["search"] = searchValue;

    const responseData = await axios({
      method: "POST",
      url: baseUrl + `/CostMS/cost/resourcesCostData`,

      signal: abortController.current.signal,
      data: filtersData,
    });
    let resp = responseData.data;
    // resourceCostRespData.current = resp;
    setResourceCostRespData(resp);
    setGetData(resp.length);
    setLoaderTimer(false);
    clearTimeout(loaderTime);
    handleTableView();
    let valid = GlobalValidation(ref);
    !valid && setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
  };

  const getComputedCostData = async (data) => {
    const loaderTime = setTimeout(() => {
      setLoaderTimer(true);
    }, 2000);
    abortController.current = new AbortController();
    const computedData = await axios({
      method: "POST",
      url: baseUrl + `/CostMS/cost/computedCost`,

      signal: abortController.current.signal,
      data: filtersData,
    });
    let resp = responseData.data;
    resourceCostRespData.current = resp;
    setGetData(resp.length);
    setLoaderTimer(false);
    clearTimeout(loaderTime);
    handleTableView();
  };

  const onKeyPress = (e) => {
    var code = e.which ? e.which : e.keyCode;
    if (code == 8 || code == 46 || code == 37 || code == 39) {
      return e.key;
    } else if (code < 48 || code > 57) {
      return e.preventDefault();
    } else return e.key;
  };
  const [pageOptions, setPageOptions] = useState("25");

  const itemsPerPage = pageOptions;
  const [currentPage, setCurrentPage] = useState("");
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const pageCount = Math.ceil(resourceCostRespData?.length / itemsPerPage);
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min(
    (currentPage + 1) * itemsPerPage,
    resourceCostRespData?.length
  );
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredRows = resourceCostRespData?.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    )
  );
  const paginatedRows = filteredRows?.slice(startIndex, endIndex);
  const paginationButtons = [];
  for (let i = 0; i < pageCount; i++) {
    paginationButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={i === currentPage ? "active" : ""}
      >
        {i}
      </button>
    );
  }
  const hasNextPage = currentPage < pageCount - 1;
  const hasPrevPage = currentPage > 0;
  const handlePrevPage = () => {
    if (hasPrevPage) {
      handlePageChange(Math.max(currentPage - 1, 0));
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      handlePageChange(Math.min(currentPage + 1, pageCount - 1));
    }
  };

  const paginationOptionsHandler = (e) => {
    const { id, value } = e.target;
    setPageOptions(value);
  };
  const handleTableView = () => {
    // setResourceCostData(() => {
    let tableDataKeys = [
      "eNum",
      "eName",
      "designation",
      "dName",
      "cName",
      "cVal",
      "actual_cost",
      "computedCost",
      "effectiveFrom",
    ];

    const sortedRows = resourceCostRespData?.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortOrder === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      } else {
        return sortOrder === "asc"
          ? aValue?.localeCompare(bValue)
          : bValue?.localeCompare(aValue);
      }
    });

    const finalMap = paginatedRows?.map((ele, index) => {
      let tabData = [];
      tableDataKeys.forEach((element, keyIndex) => {
        if (element == "cVal") {
          tabData.push(
            textInputRef.current === "show" ? (
              <td id={ele.eNum} align="right">
                {viewAllState.current == false && maskId.current == ""
                  ? "*******"
                  : maskId.current == ele.eNum ||
                    (viewAllState.current == true &&
                      viewAllStateArr.current?.indexOf(ele.eNum) != -1)
                  ? ele[element]
                  : "*******"}
              </td>
            ) : textInputRefId.current === ele.eNum ? (
              <td>
                <input
                  type="text"
                  className={borderColor.current}
                  onKeyPress={(e) => {
                    return onKeyPress(e);
                  }}
                  defaultValue={ele[element]}
                  onChange={(e) => {
                    onCostChangeHandler(e);
                  }}
                />
              </td>
            ) : (
              <td>*******</td>
            )
          );
        } else if (tableDataKeys.length - 1 == keyIndex) {
          tabData.push(
            <td align="center">{moment(ele[element]).format("DD-MMM-yyyy")}</td>
          );

          tabData.push(
            <td align="center">
              <span>
                <IconButton
                  title="View"
                  style={{ height: "1px" }}
                  onClick={(e) => {
                    HandleViewButton(e, ele.eNum, ele[element]);
                  }}
                >
                  <GrFormView />
                </IconButton>
              </span>
              {(textInputRef.current === "textInput" &&
                textInputRefId.current === ele.eNum) == false ? (
                <span className="edit-btn" style={{ marginLeft: "-10px" }}>
                  <IconButton
                    title="Edit"
                    style={{ height: "1px" }}
                    onClick={(e) => {
                      onUpdateHandler(ele, ele["cVal"], index);
                    }}
                  >
                    <MdModeEditOutline style={{ fontSize: "16px" }} />
                  </IconButton>
                </span>
              ) : (
                ""
              )}
              {textInputRef.current === "textInput" &&
              textInputRefId.current === ele.eNum ? (
                <span className="save-btn" style={{ marginLeft: "-10px" }}>
                  <IconButton
                    title="Save"
                    style={{ height: "1px" }}
                    onClick={(e) => {
                      onUpdateHandler(ele, ele["cVal"]);
                    }}
                  >
                    <FaSave style={{ fontSize: "16px" }} />
                  </IconButton>
                </span>
              ) : (
                ""
              )}
              <span className="history-btn" style={{ marginLeft: "-10px" }}>
                <IconButton
                  title="Cost History"
                  style={{ height: "1px" }}
                  onClick={(e) => {
                    handleCostChangeHistory(ele);
                  }}
                >
                  <AiOutlineHistory style={{ fontSize: "16px" }} />
                </IconButton>
              </span>
              {textInputRef.current === "textInput" &&
              textInputRefId.current === ele.eNum ? (
                <span className="close-btn" style={{ marginLeft: "-10px" }}>
                  <IconButton
                    title="Close"
                    style={{ height: "1px" }}
                    onClick={() => {
                      onCloseHandler();
                    }}
                  >
                    <AiFillCloseCircle style={{ fontSize: "16px" }} />
                  </IconButton>
                </span>
              ) : (
                ""
              )}
            </td>
          );
        } else if (element === "cVal" || element === "computedCost") {
          let cost = parseFloat(ele[element]).toFixed(2);
          tabData.push(
            <td>
              <span> $</span>{" "}
              <span style={{ float: "right" }}>
                {cost === "" + null ? "-" : cost}
              </span>
            </td>
          );
        } else if (element === "actual_cost") {
          let cost = parseFloat(ele["actual_cost"]).toFixed(2);
          tabData.push(
            <td>
              <span> $</span> <span style={{ float: "right" }}>{cost}</span>
            </td>
          );
        } else {
          tabData.push(
            <td>
              <span className="ellipsis">{ele[element]}</span>
            </td>
          );
        }
      });
      return <tr key={index}>{tabData}</tr>;
    });
    return finalMap;
    // });
  };
  const resourceCostData = handleTableView();

  const HandleViewButton = (e, id, originalValue) => {
    if (maskId.current == id) {
      maskId.current = "";
      stop();
      handleTableView();
      return;
    } else if (viewAllStateArr.current.length > 0) {
      viewAllStateArr.current = viewAllStateArr.current.filter((d) => d != id);
      restart();
    } else {
      maskId.current = id;
      restart();
    }
    handleTableView();
  };

  const onCostChangeHandler = (e) => {
    userInputCostValue.value = e.target.value;
  };

  const FilterChangeHandler = (e) => {
    const { id, value } = e.target;
    setfiltersData((prevVal) => ({ ...prevVal, [id]: value }));
  };

  const getIpAddress = async () => {
    await fetch("https://geolocation-db.com/json/")
      .then((response) => {
        return response.json();
      }, "jsonp")
      .then((res) => {
        loginHistoryTracks(res.IPv4);
      })
      .catch((err) => console.log(err));
  };

  const loginHistoryTracks = (ipAddress) => {
    const loginTrackData = {};

    let urlData = url.split("#");

    loginTrackData["ipAddress"] = ipAddress;
    loginTrackData["userId"] = loggedUserId;
    loginTrackData["url"] = urlData[1];

    axios({
      method: "POST",
      url: baseUrl + "/CostMS/cost/saveLoginTracks",
      data: loginTrackData,
    }).then((resp) => {});
  };

  const onUpdateHandler = async (ele, value, index) => {
    if (editedCheck[index] == undefined) {
      editedCheck[index] = "update";
    }

    let id = ele.eNum;
    if (textInputRef.current === "show") {
      textInputRef.current = "textInput";
      textInputRefId.current = id;
    } else {
      if (
        userInputCostValue.value != ele.cVal &&
        userInputCostValue.value != ""
      ) {
        borderColor.current = "";
        ele["cVal"] = userInputCostValue.value;
        ele["secretKey"] = formData.secretKey;
        ele["resourceId"] = formData.resourceId;
        const response = await updateCostValue(ele);
        if (response) {
          setConfirmationMsg(
            <div className="col-md-12 successMsg  statusMsg success">
              <span>Values Updated Successfully.</span>
            </div>
          );
          setTimeout(() => {
            borderColor.current = "";
            setConfirmationMsg("");
          }, 2000);
          textInputRef.current = "show";
          textInputRefId.current = "";
          getResourcesCostData();
        }
      } else {
        borderColor.current = "statusMsg error";
        setConfirmationMsg(
          <div className="col-md-12 statusMsg error">
            <AiFillWarning />{" "}
            <span>Please Enter the valid values for highlighted fields</span>
          </div>
        );
        setTimeout(() => {
          borderColor.current = "";
          setConfirmationMsg("");
        }, 2000);
      }
    }

    handleTableView();
  };

  const onCloseHandler = () => {
    textInputRef.current = "show";
    textInputRefId.current = "";
    handleTableView();
  };

  const updateCostValue = async (data) => {
    const resp = await axios({
      method: "post",
      url: baseUrl + `/CostMS/cost/updateResourceCost`,
      data: data,
      headers: { "Content-Type": "application/json" },
    });
    updatedCostOrNot.value = resp.data.type;
    return resp.data.type;
  };

  const handleCostChangeHistory = (data) => {
    const objData = {
      resourceId: data.eNum,
      secretKey: formData.secretKey,
    };
    axios({
      method: "POST",
      url: baseUrl + `/CostMS/cost/getCostHistory`,
      data: objData,
    }).then((resp) => {
      setCostHistoryChangeData(resp.data);
      setCostChangeHistoryPopUp(true);
    });
  };

  useLayoutEffect(() => {}, [selectedDepartments]);
  useEffect(() => {
    handleViewAll2();
  }, [handlePageChange, handleNextPage, handleNextPage]);
  useEffect(() => {
    let filterDeptData = [];
    selectedDepartments.forEach((data) => {
      filterDeptData.push(data.value);
    });
    filtersData["businessUnit"] =
      "170,211,123,82,168,207,212,18,213,49,149,208,243,999";
    getResourcesCostData();
    sessionStorage.setItem(
      "breadCrumbs",
      JSON.stringify({
        routes: "",
        currentScreenName: "",
        textContent: "",
      })
    );
  }, []);

  const [seconds, setSeconds] = useState(30);
  const [minutes, setMinutes] = useState(0);
  const [displayTimer, setDisplayTimer] = useState("hide");

  var timer;

  useEffect(() => {
    timer = setInterval(() => {
      setSeconds((prevVal) => prevVal - 1);
      if (seconds === 0) {
        setMinutes((prevVal) => prevVal + 1);
      }
    }, 1000);

    if (seconds === 0) {
      setDisplayTimer("hide");
      maskId.current = "";
      viewAllState.current = false;
      handleTableView();
      return () => clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [seconds]);

  const restart = () => {
    setDisplayTimer("show");
    setSeconds(30);
    setMinutes(0);
  };

  const stop = () => {
    setDisplayTimer("hide");
    clearInterval(timer);
  };

  const uploadExcelSheet = async () => {
    let link = baseUrl + "/CostMS/cost/upload";
    const data = await axios.post(link, excelFile, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const handleViewAll = () => {
    if (paginatedRows == null || paginatedRows.length == 0) {
      return;
    }

    viewAllState.current = viewAllState.current === true ? false : true;
    if (viewAllState.current) {
      let showAllArr = [];
      resourceCostRespData?.forEach((d) => {
        showAllArr.push(d.eNum);
      });
      let filteredArr = showAllArr.filter((d) => d != maskId.current);
      viewAllStateArr.current = filteredArr;
      restart();
      handleTableView();
      return;
    } else {
      viewAllStateArr.current = [];
      stop();
      handleTableView();
      return;
    }
  };

  const handleViewAll2 = () => {
    if (paginatedRows == null || paginatedRows.length == 0) {
      return;
    }

    if (viewAllState.current) {
    } else {
      viewAllStateArr.current = [];
      // stop();
      handleTableView();
      return;
    }
  };

  const HandleCostLoginHistory = () => {
    getCostLoginHistory();
  };

  const getCostLoginHistory = async () => {
    const responseData = await axios({
      method: "GET",
      url: baseUrl + `/CostMS/cost/getCostLoginTracks`,
    });

    setCostLoginHistoryData(responseData.data);
    setCostLoginHistoryPopUp(true);
  };

  const searchClickHandler = (e) => {
    filtersData["fromDate"] = moment(date)
      .subtract(filtersData.duration - 1, "months")
      .startOf("month")
      .format("yyyy-MM-DD");
    filtersData["toDate"] = moment(date).endOf("month").format("yyyy-MM-DD");

    let valid = GlobalValidation(ref);

    if (valid) {
      setStatusMessage(true);
      setTimeout(() => {
        setStatusMessage(false);
      }, 3000);
      return;
    }
    getResourcesCostData();
  };

  useEffect(() => {}, [stateValue]);

  useEffect(() => {
    getIpAddress();
  }, []);

  const calculateHandler = () => {
    if (resourceCostData == null || resourceCostData.length == 0) {
      return;
    }

    setStateValue("Calculate");
    getResourcesCostData("Calculate");
  };

  const computeGridHandler = () => {
    if (resourceCostData == null || resourceCostData.length == 0) {
      return;
    }

    const loaderTime = setTimeout(() => {
      setLoaderTimer(true);
    }, 2000);
    const data = {};

    data["secretKey"] = formData.secretKey;
    data["loggedUserId"] = loggedUserId;

    axios({
      method: "POST",
      url: baseUrl + `/CostMS/cost/computeGrid`,
      data: data,
    }).then((resp) => {
      setLoaderTimer(false);
      clearTimeout(loaderTime);
      setGridComputedState(true);
      setTimeout(() => {
        setGridComputedState(false);
      }, 2000);
    });
  };

  const customValueRenderer = (selected, _options) => {
    return selected.length === departments.length
      ? "<< ALL >>"
      : selected.length === 0
      ? "<< Please Select >>"
      : selected.map((label) => {
          return selected.length > 1 ? label.label + "," : label.label;
        });
  };

  const onChangePractice = (e) => {
    const { value, id } = e.target;
    setGetData(value);
  };
  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoaderTimer(false);
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
  return (
    <div className="col-md-12">
      {loaderTimer ? <Loader handleAbort={handleAbort} /> : ""}
      <div className="col-md-12">
        {gridComputedState && (
          <div className="p6 col-md-12 successMsg">
            {"Grid Computed Successfully...."}
          </div>
        )}
        {statusMessage && (
          <div className="p6 col-md-12 statusMsg error">
            <AiOutlineWarning className="confirmMsgIcon" />
            {"Please select the valid values for highlighted fields"}
          </div>
        )}
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>View/Upload</h2>
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
        <div className="gropu customCard">
          <CCollapse visible={!visible}>
            <div class="group-content row mb-2">
              <div class="col-md-4 mb-2">
                <div class="form-group row">
                  <label class="col-5" for="BuIds">
                    Country<span className="required error-text ml-1">*</span>
                  </label>
                  <span class="col-1 p-0">:</span>
                  <div class="col-6">
                    {" "}
                    <select
                      id="country"
                      onChange={(e) => FilterChangeHandler(e)}
                    >
                      {country.map((data) => (
                        <option
                          value={data.id}
                          selected={data.country_name == "India" ? true : false}
                        >
                          {data.country_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div class="col-md-4 mb-2">
                <div class="form-group row">
                  <label class="col-5" for="BuIds">
                    Business Unit
                    <span className="required error-text ml-1">*</span>
                  </label>
                  <span class="col-1 p-0">:</span>
                  <div
                    class="col-6 multiselect"
                    ref={(ele) => {
                      ref.current[0] = ele;
                    }}
                  >
                    <MultiSelect
                      ArrowRenderer={ArrowRenderer}
                      id="businessUnit"
                      options={departments}
                      hasSelectAll={true}
                      isLoading={false}
                      shouldToggleOnHover={false}
                      disableSearch={false}
                      valueRenderer={customValueRenderer}
                      value={selectedDepartments}
                      disabled={false}
                      onChange={(s) => {
                        setSelectedDepartments(s);
                        let filteredDeptData = [];
                        s?.forEach((element) => {
                          filteredDeptData.push(element.value);
                        });
                        filtersData.businessUnit = filteredDeptData.toString();
                      }}
                    />
                  </div>
                </div>
              </div>

              <div class="col-md-4 mb-2">
                <div class="form-group row">
                  <label class="col-5" for="BuIds">
                    Month<span className="required error-text ml-1">*</span>
                  </label>
                  <span class="col-1 p-0">:</span>
                  <div class="col-6">
                    <DatePicker
                      id="month"
                      selected={date}
                      onChange={(e) => {
                        handleChangeDate(e);
                      }}
                      maxDate={new Date()}
                      dateFormat="MMM-yyyy"
                      showMonthYearPicker
                    />
                  </div>
                </div>
              </div>

              <div class="col-md-12 d-flex justify-content-center my-3 ">
                <button
                  type="submit"
                  class="btn btn-primary"
                  title="Search"
                  onClick={() => {
                    searchClickHandler();
                  }}
                >
                  <FaSearch /> Search
                </button>
              </div>
            </div>
          </CCollapse>

          {confirmationMsg}
          <div className="maskTimer-btn-container mt-3">
            <div className="d-flex flex-row-reverse justify-content-between search-field-btn-wrapper">
              <div className="search-field-container">
                {" "}
                <span className="p-input-icon-left tableGsearch">
                  <i className="pi pi-search"></i>
                  <input
                    className="p-inputtext p-component"
                    type="text"
                    placeholder="keyword Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  ></input>
                </span>
              </div>
              <div className="calc-view-upload-btn-container">
                {" "}
                <button
                  className="btn btn-primary calculator-icon"
                  onClick={() => {
                    calculateHandler();
                  }}
                >
                  <IoCalculator /> Calculate
                </button>
                <button
                  className="btn btn-primary view-all-icon"
                  onClick={() => {
                    handleViewAll();
                  }}
                >
                  <MdOutlineRemoveRedEye />
                  View All
                </button>
                <button
                  className="btn btn-primary "
                  onClick={() => {
                    setExcelUploadPopUp(true);
                    setStateValue("Upload");
                  }}
                >
                  <FileUpload /> Upload
                </button>
                {displayTimer === "show" ? (
                  <div className=" maskTimer">
                    <label>Mask Time :</label>
                    <span>
                      {minutes < 10 ? "0" + minutes : minutes}:
                      {seconds < 10 ? "0" + seconds : seconds}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <div id="viewAndUpload" className="col-md-12 tableStyle">
            <table
              id="viewAndUploadTable"
              style={{ width: "100%" }}
              className="table table-bordered table-striped View-Upload-screen-table  darkHeader"
            >
              <thead>
                <tr className="headerSticky " align="center">
                  <th
                    onClick={() => handleSort("eNum")}
                    className={
                      sortColumn === "eNum" ? `sorted ${sortOrder}` : ""
                    }
                  >
                    Resource Id
                    <span className="sort-icons">
                      {sortColumn === "eNum" && sortOrder === "asc" && (
                        <>
                          &nbsp;
                          <FaSortAmountUp />
                        </>
                      )}
                      {sortColumn === "eNum" && sortOrder === "desc" && (
                        <>
                          &nbsp;
                          <FaSortAmountDown />
                        </>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("eName")}
                    className={
                      sortColumn === "eName" ? `sorted ${sortOrder}` : ""
                    }
                  >
                    Resource Name
                    <span className="sort-icons">
                      {sortColumn === "eName" && sortOrder === "asc" && (
                        <>
                          &nbsp;
                          <FaSortAmountUp />
                        </>
                      )}
                      {sortColumn === "eName" && sortOrder === "desc" && (
                        <>
                          &nbsp;
                          <FaSortAmountDown />
                        </>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("designation")}
                    className={
                      sortColumn === "designation" ? `sorted ${sortOrder}` : ""
                    }
                  >
                    Role Type
                    <span className="sort-icons">
                      {sortColumn === "designation" && sortOrder === "asc" && (
                        <>
                          &nbsp;
                          <FaSortAmountUp />
                        </>
                      )}
                      {sortColumn === "designation" && sortOrder === "desc" && (
                        <>
                          &nbsp;
                          <FaSortAmountDown />
                        </>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("dName")}
                    className={
                      sortColumn === "dName" ? `sorted ${sortOrder}` : ""
                    }
                  >
                    Business Unit
                    <span className="sort-icons">
                      {sortColumn === "dName" && sortOrder === "asc" && (
                        <>
                          &nbsp;
                          <FaSortAmountUp />
                        </>
                      )}
                      {sortColumn === "dName" && sortOrder === "desc" && (
                        <>
                          &nbsp;
                          <FaSortAmountDown />
                        </>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("cName")}
                    className={
                      sortColumn === "cName" ? `sorted ${sortOrder}` : ""
                    }
                  >
                    Country
                    <span className="sort-icons">
                      {sortColumn === "cName" && sortOrder === "asc" && (
                        <>
                          &nbsp;
                          <FaSortAmountUp />
                        </>
                      )}
                      {sortColumn === "cName" && sortOrder === "desc" && (
                        <>
                          &nbsp;
                          <FaSortAmountDown />
                        </>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("cVal")}
                    className={
                      sortColumn === "cVal" ? `sorted ${sortOrder}` : ""
                    }
                  >
                    Actual Salary ($)
                    <span className="sort-icons">
                      {sortColumn === "cVal" && sortOrder === "asc" && (
                        <>
                          &nbsp;
                          <FaSortAmountUp />
                        </>
                      )}
                      {sortColumn === "cVal" && sortOrder === "desc" && (
                        <>
                          &nbsp;
                          <FaSortAmountDown />
                        </>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("actual_cost")}
                    className={
                      sortColumn === "actual_cost" ? `sorted ${sortOrder}` : ""
                    }
                  >
                    Actual Cost ($)
                    <span className="sort-icons">
                      {sortColumn === "actual_cost" && sortOrder === "asc" && (
                        <>
                          &nbsp;
                          <FaSortAmountUp />
                        </>
                      )}
                      {sortColumn === "actual_cost" && sortOrder === "desc" && (
                        <>
                          &nbsp;
                          <FaSortAmountDown />
                        </>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("computedCost")}
                    className={
                      sortColumn === "computedCost" ? `sorted ${sortOrder}` : ""
                    }
                  >
                    Role Cost
                    <span className="sort-icons">
                      {sortColumn === "computedCost" && sortOrder === "asc" && (
                        <>
                          &nbsp;
                          <FaSortAmountUp />
                        </>
                      )}
                      {sortColumn === "computedCost" && sortOrder === "desc" && (
                        <>
                          &nbsp;
                          <FaSortAmountDown />
                        </>
                      )}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSort("effectiveFrom")}
                    className={
                      sortColumn === "effectiveFrom"
                        ? `sorted ${sortOrder}`
                        : ""
                    }
                  >
                    Effective From
                    <span className="sort-icons">
                      {sortColumn === "effectiveFrom" && sortOrder === "asc" && (
                        <>
                          &nbsp;
                          <FaSortAmountUp />
                        </>
                      )}
                      {sortColumn === "effectiveFrom" && sortOrder === "desc" && (
                        <>
                          &nbsp;
                          <FaSortAmountDown />
                        </>
                      )}
                    </span>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows?.length != 0 ? (
                  handleTableView()
                ) : (
                  <tr>
                    <td colSpan="10">No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="View-Upload-screen-table-pagination">
          <div className="span-wrapper">
            <span className="pageOptions">
              <select
                id="pageOptions"
                onChange={(e) => paginationOptionsHandler(e)}
              >
                <option value="10">10</option>
                <option selected value="25">
                  25
                </option>
                <option value="50">50</option>
              </select>
            </span>
            <span>{startItem} </span>
            <span> to </span>
            <span>{endItem}</span>
            <span>
              {""} of {""}
            </span>{" "}
            <span>
              {resourceCostRespData?.length}
              {""}
            </span>
            {""}
            <span className="arrowStyle">
              <span className="arrowStyle2">
                <RxDoubleArrowLeft
                  size={"1.3em"}
                  onClick={() => handlePageChange(0)}
                  className={`cursor ${hasPrevPage ? "enable" : "disabled"}`}
                />
                <MdKeyboardArrowLeft
                  size={"1.3em"}
                  onClick={handlePrevPage}
                  className={`cursor ${hasPrevPage ? "enable" : "disabled"}`}
                />
                <MdKeyboardArrowRight
                  size={"1.3em"}
                  onClick={handleNextPage}
                  className={`cursor ${hasNextPage ? "enable" : "disabled"}`}
                />
                <RxDoubleArrowRight
                  size={"1.3em"}
                  onClick={() => handlePageChange(pageCount - 1)}
                  className={`cursor ${hasNextPage ? "enable" : "disabled"}`}
                />
              </span>
            </span>
          </div>
        </div>
        {excelUploadPopUp ? (
          <>
            <UploadExcelSheet
              excelUploadPopUp={excelUploadPopUp}
              setExcelUploadPopUp={setExcelUploadPopUp}
              excelFile={excelFile}
              setExcelFile={setExcelFile}
              uploadExcelSheet={uploadExcelSheet}
              getResourcesCostData={getResourcesCostData}
              formData={formData}
              date={date}
              stateValue={stateValue}
              setLoaderTimer={setLoaderTimer}
              getComputedCostData={getComputedCostData}
              setStateValue={setStateValue}
            />
          </>
        ) : (
          ""
        )}

        {costLoginHistoryPopUp ? (
          <CostLoginHistory
            costLoginHistoryPopUp={costLoginHistoryPopUp}
            setCostLoginHistoryPopUp={setCostLoginHistoryPopUp}
            costLoginHistoryData={costLoginHistoryData}
          />
        ) : (
          ""
        )}

        {costChangeHistoryPopUp ? (
          <CostChangeHistory
            costChangeHistoryPopUp={costChangeHistoryPopUp}
            setCostChangeHistoryPopUp={setCostChangeHistoryPopUp}
            costHistoryChangeData={costHistoryChangeData}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default CostViewAndUpload;
