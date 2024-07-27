import React, { useState, useEffect, useRef } from "react";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaSearch,
  FaCheck,
  FaComments,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import { BiCheck } from "react-icons/bi";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";
import RiskAutoComplete from "../ProjectComponent/RiskAutocomplete";
import axios from "axios";
import { environment } from "../../environments/environment";
import { FaSave } from "react-icons/fa";
import { FaUndo } from "react-icons/fa";
import Loader from "../Loader/Loader";
import { ImCross } from "react-icons/im";
import Popover from "@mui/material/Popover";
import "./ShiftAllowances.scss";
import { FaCaretDown } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import GlobalValidation from "../ValidationComponent/GlobalValidation";
import { CCollapse } from "@coreui/react";
import { AiFillWarning } from "react-icons/ai";
import ShiftAllowncesPopup from "./Expenses/Shiftallowancespopup";
import ShiftAllowncesTable from "./ShiftAllowncesTable";
import ShiftAllowncesDataTable from "./ShiftAllowncesDataTable";
import ShiftAllowanceRejectPopup from "./Expenses/ShiftAllowanceRejectPopup";
import GlobalHelp from "../PrimeReactTableComponent/GlobalHelp";
import { config } from "@react-spring/web";
import { IoWarningOutline } from "react-icons/io5";

function ShiftAllownces() {
  const [endDate, setEndDate] = useState(new Date());
  const [value, onChange] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [empallowStatus, setEmpallowStatus] = useState([]);
  const [cheveronIcon, setCheveronIcon] = useState(FaChevronCircleUp);
  const baseUrl = environment.baseUrl;
  const [state, setState] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [loader, setLoader] = useState(false);
  const projectmsbaseUrl = environment.projectmsbaseUrl;
  const [selectType, setSelectType] = useState("cust");
  const [message, setMessage] = useState(false);
  const [rejectMsg, setRejectMsg] = useState(false);
  const [riskDetails, setRiskDetails] = useState([]);
  const [validationMessage, setValidationMessage] = useState(false);
  const [selectionValidation, setSelectionValidation] = useState(false);
  const [formData, setFormData] = useState({
    assigned_to: "",
    custIds: "",
    value: "",
    id: "",
  });
  // const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedData, setSelectedData] = useState([]);
  const currentDate = new Date();

  const currentDate1 = new Date();
  const oneMonthAgo = new Date();

  oneMonthAgo.setMonth(currentDate1.getMonth());
  const [startDate, setStartDate] = useState(
    oneMonthAgo.setMonth(currentDate1.getMonth() - 1)
  );
  const [checkedData, setCheckedData] = useState([]);

  // Set the date to the first day of the current month
  currentDate.setDate(1);
  // Subtract one month to get the first day of the previous month
  currentDate.setMonth(currentDate.getMonth() - 1);

  // Format the date as you need (e.g., YYYY-MM-DD)
  const formattedDateNew = currentDate.toISOString().split("T")[0];
  console.log(formattedDateNew);
  const [Customer, setCustomers] = useState([]);
  const [tableDataNew, setTableDataNew] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [Data2, setData2] = useState([]);

  const [selectedData2, setSelectedData2] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState();
  const [column, setColumn] = useState([]);
  const [statusComments, setStatusComments] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedAllocType, setSelectedAllocType] = useState([]);
  const [selectedViewType, setSelectedViewType] = useState([]);
  const [viewType, setViewType] = useState([]);
  const [userid, setUserid] = useState();
  const [resRolesId, setResRolesid] = useState([]);

  const loggedUserId = localStorage.getItem("resId");
  const loggedUserName = localStorage.getItem("resName");
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString("default", { month: "short" });
  const day = currentDate.getDate();

  const formattedDate = `${year}-${month}-${day}`;

  const [addVisisble, setAddVisible] = useState(false);
  const [data, setData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [prevComments, setPrevComments] = useState("");
  const [AllocType, setAllocType] = useState([]);
  const [Month, setMonth] = useState();
  const [Status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const ref = useRef([]);
  const [configAccessAdmin, setConfigAccessAdmin] = useState([]);
  const [configAccessHr, setConfigAccessHr] = useState([]);
  const [configAccessFinance, setConfigAccessFinance] = useState([]);
  const [configAccessAdminprop, setConfigAccessAdminprop] = useState([]);
  const [configAccessHrprop, setConfigAccessHrprop] = useState([]);
  const [configAccessFinanceprop, setConfigAccessFinanceprop] = useState([]);
  const [extraamount, setExtraAmount] = useState({ extHrs: "" });
  const [buttonPopup, setButtonPopup] = useState(false);
  const [userName, setUsername] = useState([]);
  const [rejectbuttonPopup, setRejectButtonPopup] = useState(false);
  const [filterVal, setFilterVal] = useState("");
  const [searching, setSearching] = useState("");
  const [searchApi, setSearchApi] = useState([]);
  const [dataAccess, setDataAccess] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  let textContent = "Time & Expenses";
  let currentScreenName = ["Shift Allowances"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  const abortController = useRef(null);

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoadingState(false);
  };
  console.log(configAccessFinance, configAccessHr, configAccessAdmin);
  // useEffect(() => {
  //   getConfigsHr();
  //   getConfigsFinance();
  //   getConfigsAdmin();
  // }, [configAccessFinance, configAccessHr, configAccessAdmin]);
  console.log(selectedData);

  const handleSearch = async (inputValue) => {
    // Debounce search with a delay of 300ms
    setSearchTerm(inputValue);
    getMenus(); // Fetch data with updated search term
  };
  console.log(buttonPopup);
  const configs = () => {
    const request1 = axios.get(
      baseUrl +
        `/timeandexpensesms/ShiftAllownces/getConfigs?constant=ALLOWANCE_HR_APPROVERS`
    );
    const request2 = axios.get(
      baseUrl +
        `/timeandexpensesms/ShiftAllownces/getConfigs?constant=ALLOWANCE_FINANCE_APPROVERS`
    );
    const request3 = axios.get(
      baseUrl +
        `/timeandexpensesms/ShiftAllownces/getConfigs?constant=ALLOWANCE_ADMIN`
    );
    Promise.all([request1, request2, request3]).then((responses) => {
      // Extract data from responses

      const responseData1 = responses[0].data[0].val;
      const responseData2 = responses[1].data[0].val;
      const responseData3 = responses[2].data[0].val;

      setConfigAccessHr(
        responseData1?.includes(loggedUserId) ||
          responseData2?.includes(loggedUserId) ||
          responseData3?.includes(loggedUserId) ||
          loggedUserId == 512
          ? axios
              .get(baseUrl + `/revenuemetricsms/metrics/customers`)
              .then((resp) => {
                let cust = [];
                let data = resp.data;

                data.length > 0 &&
                  data.forEach((e) => {
                    let customerObj = {
                      label: e.name,
                      value: e.id,
                    };
                    cust.push(customerObj);
                  });
                setCustomers(cust);
                // setSelectedCustomer(cust);
              })
          : axios({
              method: "get",
              url:
                baseUrl +
                `/timeandexpensesms/ShiftAllownces/getuserroleid?user_id=${loggedUserId}`,
            }).then(function (response) {
              var res = response.data;

              setResRolesid(res[0]["role_type_id"].split(","));

              let hh = res[0]["role_type_id"];
              axios({
                method: "get",
                url:
                  baseUrl +
                  `/timeandexpensesms/ShiftAllownces/getuserId?id=${loggedUserId}`,
              }).then(function (response) {
                var res = response.data;
                setUserid(response.data);
                axios
                  .post(
                    baseUrl +
                      `/timeandexpensesms/ShiftAllownces/getcustomerprojectname?resId=${res}&resRoles=${hh}`
                  )
                  .then((res) => {
                    let cust = [];
                    let data = res.data;
                    data.length > 0 &&
                      data.forEach((e) => {
                        let customerObj = {
                          label: e.name,
                          value: e.id,
                        };
                        cust.push(customerObj);
                      });
                    setCustomers(cust);
                    // setSelectedCustomer(cust);
                  })
                  .catch((error) => console.log(error));
              });
            })
      );
      setConfigAccessFinance(
        responseData1?.includes(loggedUserId) ||
          responseData2?.includes(loggedUserId) ||
          responseData3?.includes(loggedUserId) ||
          loggedUserId == 512
          ? axios
              .get(baseUrl + `/revenuemetricsms/metrics/customers`)
              .then((resp) => {
                let cust = [];
                let data = resp.data;
                data.length > 0 &&
                  data.forEach((e) => {
                    let customerObj = {
                      label: e.name,
                      value: e.id,
                    };
                    cust.push(customerObj);
                  });
                setCustomers(cust);
                // setSelectedCustomer(cust);
              })
          : axios({
              method: "get",
              url:
                baseUrl +
                `/timeandexpensesms/ShiftAllownces/getuserroleid?user_id=${loggedUserId}`,
            }).then(function (response) {
              var res = response.data;
              setResRolesid(res[0]["role_type_id"].split(","));
              let hh = res[0]["role_type_id"];
              axios({
                method: "get",
                url:
                  baseUrl +
                  `/timeandexpensesms/ShiftAllownces/getuserId?id=${loggedUserId}`,
              }).then(function (response) {
                var res = response.data;
                setUserid(response.data);
                axios
                  .post(
                    baseUrl +
                      `/timeandexpensesms/ShiftAllownces/getcustomerprojectname?resId=${res}&resRoles=${hh}`
                  )
                  .then((res) => {
                    let cust = [];
                    let data = res.data;
                    data.length > 0 &&
                      data.forEach((e) => {
                        let customerObj = {
                          label: e.name,
                          value: e.id,
                        };
                        cust.push(customerObj);
                      });
                    setCustomers(cust);
                    // setSelectedCustomer(cust);
                  })
                  .catch((error) => console.log(error));
              });
            })
      );
      setConfigAccessAdmin(
        responseData1?.includes(loggedUserId) ||
          responseData2?.includes(loggedUserId) ||
          responseData3?.includes(loggedUserId) ||
          loggedUserId == 512
          ? axios
              .get(baseUrl + `/revenuemetricsms/metrics/customers`)
              .then((resp) => {
                let cust = [];
                let data = resp.data;
                data.length > 0 &&
                  data.forEach((e) => {
                    let customerObj = {
                      label: e.name,
                      value: e.id,
                    };
                    cust.push(customerObj);
                  });
                setCustomers(cust);
                // setSelectedCustomer(cust);
              })
          : axios({
              method: "get",
              url:
                baseUrl +
                `/timeandexpensesms/ShiftAllownces/getuserroleid?user_id=${loggedUserId}`,
            }).then(function (response) {
              var res = response.data;
              setResRolesid(res[0]["role_type_id"].split(","));
              let hh = res[0]["role_type_id"];
              axios({
                method: "get",
                url:
                  baseUrl +
                  `/timeandexpensesms/ShiftAllownces/getuserId?id=${loggedUserId}`,
              }).then(function (response) {
                var res = response.data;
                setUserid(response.data);
                axios
                  .post(
                    baseUrl +
                      `/timeandexpensesms/ShiftAllownces/getcustomerprojectname?resId=${res}&resRoles=${hh}`
                  )
                  .then((res) => {
                    let cust = [];
                    let data = res.data;
                    data.length > 0 &&
                      data.forEach((e) => {
                        let customerObj = {
                          label: e.name,
                          value: e.id,
                        };
                        cust.push(customerObj);
                      });
                    setCustomers(cust);
                    // setSelectedCustomer(cust);
                  })
                  .catch((error) => console.log(error));
              });
            })
      );
    });
  };

  useEffect(() => {
    configs();
  }, []);

  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const modifiedUrlPath = "/expense/viewShiftAllowances";
      getUrlPath(modifiedUrlPath);
      const marginSubMenu = data
        .find((item) => item.display_name === "Time & Expenses")

        .subMenus.find(
          (subMenu) => subMenu.display_name === "Shift Allowances"
        );
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) => submenu.display_name !== "Lock Timesheets"
        ),
      }));
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
          sessionStorage.setItem("displayName", item.display_name);
        }
      });
      const accessLevel =
        marginSubMenu.userRoles.includes("14") &&
        marginSubMenu.userRoles.includes("46") &&
        marginSubMenu.userRoles.includes("690")
          ? 900
          : marginSubMenu.userRoles.includes("14") &&
            marginSubMenu.userRoles.includes("690")
          ? 1000
          : marginSubMenu.userRoles.includes("46") &&
            marginSubMenu.userRoles.includes("690")
          ? 2000
          : marginSubMenu.userRoles.includes("690")
          ? 690
          : marginSubMenu.userRoles.includes("46")
          ? 46
          : marginSubMenu.userRoles.includes("14") &&
            marginSubMenu.userRoles.includes("46") &&
            marginSubMenu.userRoles.includes("126")
          ? 800
          : marginSubMenu.userRoles.includes("14") &&
            marginSubMenu.userRoles.includes("46")
          ? 500
          : null;
      setDataAccess(accessLevel);
      console.log(accessLevel);
    });
  };

  const getConfigsHr = () => {
    axios({
      method: "GET",
      url:
        baseUrl +
        `/timeandexpensesms/ShiftAllownces/getConfigs?constant=ALLOWANCE_HR_APPROVERS`,
    }).then((resp) => {
      setConfigAccessHrprop(
        resp.data[0].val.includes(loggedUserId) && "hrConfig"
      );
    });
  };
  const getConfigsFinance = () => {
    axios({
      method: "GET",
      url:
        baseUrl +
        `/timeandexpensesms/ShiftAllownces/getConfigs?constant=ALLOWANCE_FINANCE_APPROVERS`,
    }).then((resp) => {
      setConfigAccessFinanceprop(
        resp.data[0].val.includes(loggedUserId) && "finConfig"
      );
    });
  };
  const getConfigsAdmin = () => {
    axios({
      method: "GET",
      url:
        baseUrl +
        `/timeandexpensesms/ShiftAllownces/getConfigs?constant=ALLOWANCE_ADMIN`,
    }).then((resp) => {
      setConfigAccessAdminprop(
        resp.data[0].val.includes(loggedUserId) && "adminConfig"
      );
    });
  };
  useEffect(() => {
    getConfigsAdmin();
    getConfigsFinance();
    getConfigsHr();
  }, []);
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
  useEffect(() => {
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
  const generateDropdownLabel1 = (selectedOptions, allOptions) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    const allValues = allOptions.map((item) => item.value);
    console.log(selectedValues.length, allValues.length);
    if (selectedValues.length > 0) {
      //
      return "<< ALL >>";
    } else {
      return selectedOptions.map((option) => option.label).join(", ");
    }
  };

  const initialData = {
    extra_hours: "",
    // "extra_hours_amount": "",
    weekend_hours: "",
    // "weekend_amount": "",
    oncall_hours: "",
    oncall_amount: "",
    // "total_amount": "",
    comments: statusComments,
  };
  const [tableData, setTableData] = useState(initialData);

  const initialValue = {
    AllocType: "",
    Status: "",
    startDate: formattedDateNew,
    Customer: "",
    viewType: "cust",
  };
  const [searchdata, setSearchdata] = useState(initialValue);

  const isChecked = false;

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setTableData((prev) => {
      return { ...prev, [name]: value };
    });
    setSelectType(value);
    // isChecked(true);
  };

  useEffect(() => {}, [selectType]);

  const onChangeHandler = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [e.target.id]: value }));

    // setId();
  };
  //-------------ViewType---------------

  const getViewType = () => {
    let types = [];
    types.push(
      { value: "cust", label: "Customer/Project" },
      { value: "res", label: "Resource" }
    );
    setViewType(types);
    setSelectedViewType(types.filter((ele) => ele.value != 0));
    let filteredType = [];
    types.forEach((data) => {
      if (data.value != 0) {
        filteredType.push(data.value);
      }
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["viewType"]: filteredType.toString(),
    }));
  };

  //----Resource Name---------------
  const getData = (e) => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/risks/getAssignedData`,
    }).then(function (response) {
      var res = response.data;
      setRiskDetails(res);
      // setAssignedId(response.data.id)
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let cust = [];
    Customer.forEach((d) => {
      cust.push(d.value);
    });
  }, [Customer]);

  useEffect(() => {
    let cust1 = [];
    Data2.forEach((d) => {
      cust1.push(d.value);
    });
  }, [Data2]);

  useEffect(() => {
    // getCustomers();
    // getProjects();
    // getuserId();
    getAllocType();
    getStatus();
    getViewType();
  }, []);

  useEffect(() => {
    getProjects();
  }, [selectedCustomer, selectedData2]);

  const getProjects = (e) => {
    const paydata1 = {
      custIds: "",
    };

    paydata1["custIds"] = selectedCustomer.map((d) => d.value).toString();

    axios({
      method: "post",
      url: baseUrl + `/timeandexpensesms/ShiftAllownces/getprojectname`,

      data: paydata1,
      //  {

      //   "custIds": selectedData2.map(d => d.value).toString(),
      //   "userId": loggedUserId

      // },
    })
      .then((res) => {
        let pro = [];

        let data = res.data;
        console.log(data);
        data.length > 0 &&
          data.forEach((e) => {
            let projectObj = {
              label: e.name,
              value: e.id,
            };
            pro.push(projectObj);
          });

        setProjects(pro);
        setSelectedProjects(pro);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    let pro = [];
    projects.forEach((d) => {
      pro.push(d.value);
    });
  }, [projects]);

  const handleClose = () => {
    setAnchorEl(false);
  };
  //---------------Getting Alloc Type----------------

  const getAllocType = () => {
    let types = [];
    types.push(
      { value: 1, label: "Billable" },
      { value: 2, label: "Non Billable" }
    );
    setAllocType(types);
    setSelectedAllocType(types.filter((ele) => ele.value != 0));
    let filteredType = [];
    types.forEach((data) => {
      if (data.value != 0) {
        filteredType.push(data.value);
      }
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["AllocType"]: filteredType.toString(),
    }));
  };

  //---------Getting Status-----------

  const getStatus = () => {
    let Status = [];
    Status.push(
      { value: 1292, label: "New" },
      { value: 1293, label: "PM Approved" },
      { value: 1295, label: "DP Approved" },
      { value: 1297, label: "Finance Approved" },
      { value: 1299, label: "HR Approved" },
      { value: 1300, label: "Paid" },
      { value: 1301, label: "Rejected" }
    );
    setStatus(Status);
    // setSelectedStatus(Status.filter((ele) => ele.value != 0));
    let filteredStatus = [];
    Status.forEach((data) => {
      if (data.value != 0) {
        filteredStatus.push(data.value);
      }
    });
    setSearchdata((prevVal) => ({
      ...prevVal,
      ["Status"]: filteredStatus.toString(),
    }));
  };

  //------------Get Allowance Data-------------------
  const handleClick = () => {
    setAddVisible(true);
    setValidationMessage(false);
    setStatusComments("");

    let valid = GlobalValidation(ref);
    if (valid) {
      setMessage(true);

      setTimeout(() => {
        setMessage(false);
      }, 3000);
      return;
    }
    let allStatus = searchdata.Status;

    let date = searchdata.startDate;

    const payData = {
      accessType: "-1",
      viewBy: selectType,
      customers: "",
      projects: "",
      fromDt: date,
      allowStates: allStatus,
      allocStates: "",
      resId: 0,
    };

    if (selectType == "res") {
      payData["resId"] = formData.assigned_to;
    } else if (loggedUserId == 4452475) {
      payData["customers"] = selectedData2.map((d) => d.value).toString();
      payData["projects"] = selectedProjects.map((d) => d.value).toString();
    } else {
      payData["customers"] = selectedCustomer.map((d) => d.value).toString();
      payData["projects"] = selectedProjects.map((d) => d.value).toString();
    }
    setVisible(!visible);
    visible
      ? setCheveronIcon(FaChevronCircleUp)
      : setCheveronIcon(FaChevronCircleDown);
    setTimeout(() => {
      setLoader(true);
    }, 3000);
    setLoadingState(true);
    setState(false);
    axios({
      method: "post",
      url: baseUrl + `/timeandexpensesms/ShiftAllownces/gettabledata`,
      // url: `http://localhost:8090/timeandexpensesms/ShiftAllownces/gettabledata`,
      data: payData,
    })
      .then(function (response) {
        var response = response.data;
        const uniqueKeyResponse = response.map((item, index) => ({
          ...item,
          uniqueKey: index,
        }));

        console.log(uniqueKeyResponse);
        setColumn(uniqueKeyResponse[0]);
        console.log("vvv");
        let newArr = uniqueKeyResponse.filter(function (e) {
          return e.id > 0;
        });

        setData(newArr);
        setTableDataNew(uniqueKeyResponse);
        setStatusComments("");
        setSearchApi(newArr);
        setLoader(false);
        setOpen(true);
        setLoadingState(false);
        setState(true);

        setSelectedData([]);
        handleSearchButtonClick();

        setTimeout(() => {}, 3000);
      })
      .catch(function (response) {});
  };
  console.log(statusComments);
  //--------------Approve Action ------------------------------
  let data1;
  const handleApprove = (e) => {
    setCheckedData([]);
    const initialAllowanceStatusId = e[0]?.allowance_status_id;
    for (let i = 0; i < e.length; i++) {
      for (let j = 0; j < Status.length; j++) {
        if (
          e[i]?.allowance_status_id == Status[j].value &&
          e[i]?.allowance_status_id != 1300 &&
          e[i]?.allowance_status_id != 1301
        ) {
          e[i].allowance_status_id = Status[j + 1].value;
          e[i].allowance_status = Status[j + 1].label;
          break;
        }
      }
      // allowanceState: e[i].allowance_status_id,
    }
    const approvalsList = [];
    for (let i = 0; i < e.length; i++) {
      let pmAppId =
        e[i]?.allowance_status_id == 1293 ? Number(loggedUserId) + 1 : null;
      let dpAppId =
        e[i]?.allowance_status_id == 1295 ? Number(loggedUserId) + 1 : null;
      let hrAppId =
        e[i]?.allowance_status_id == 1297 ? Number(loggedUserId) + 1 : null;
      let financeAppId =
        e[i]?.allowance_status_id == 1299 ? Number(loggedUserId) + 1 : null;
      let isOver = e[i]?.is_overridden == "0" ? false : true;
      let comments =
        e[i]?.allowance_status_id == 1293
          ? "<br /><b>PM -> " +
            loggedUserName +
            "</b> : <b>" +
            formattedDate +
            " (Approved) </b> :" +
            statusComments
          : e[i]?.allowance_status_id == 1295
          ? "<br /><b>DP -> " +
            loggedUserName +
            "</b> : <b>" +
            formattedDate +
            " (Approved) </b> :" +
            statusComments
          : e[i]?.allowance_status_id == 1297
          ? "<br /><b>Finance -> " +
            loggedUserName +
            "</b> : <b>" +
            formattedDate +
            " (Approved) </b> :" +
            statusComments
          : e[i]?.allowance_status_id == 1299
          ? "<br /><b>HR -> " +
            loggedUserName +
            "</b> : <b>" +
            formattedDate +
            " (Approved) </b> :" +
            statusComments
          : "";
      approvalsList.push({
        extraHrs: e[i]?.allow_extra_hours,
        extraHrsAmt: e[i]?.allow_extra_hours_amt,
        weekEndHrs: e[i]?.allow_wknd_hours,
        weekEndAmt: e[i]?.allow_wknd_amt,
        onCallHrs: e[i]?.allow_ocall_hours,
        onCallAmt: e[i]?.allow_ocall_amt,
        comments: comments,
        resId: e[i]?.id,
        month: searchdata.startDate,
        ww: e[i]?.res_ww,
        isOverridden: "0",
        allowanceState: initialAllowanceStatusId,
      });
    }
    axios({
      method: "post",
      url: baseUrl + `/timeandexpensesms/ShiftAllownces/processAllowance`,
      // data: e,
      data: {
        type: "approve",
        loggedUser: loggedUserId,
        saveData: approvalsList,
      },
    }).then((error) => {
      console.log("success", error);
      setSelectedData([]);
      setCheckedData([]);
      //setButtonDisabled(true);
      setSuccessMsg(true);

      setTimeout(() => {
        setSuccessMsg(false);
        setRejectMsg(false);
      }, 2000);

      setButtonPopup(false);
      console.log(" state reset.");

      console.log("Checkbox state reset.");
    });
  };
  // --------------Reject Handler for shift allowances--------------------------------
  useEffect(() => {
    console.log(checkedData);
  }, [checkedData]);
  // --------------Reject Handler for shift allowances--------------------------------
  const handleSearchButtonClick = () => {
    // Reset the state to the default values
    setGlobalFilterValue(""); // Reset global filter value to an empty string
  };

  const handleReject = (e) => {
    const rejectsList = [];
    for (let i = 0; i < e.length; i++) {
      let pmAppId = e[i].allowance_status_id == 1292 ? userid : null;
      let dpAppId = e[i].allowance_status_id == 1293 ? userid : null;
      let hrAppId = e[i].allowance_status_id == 1295 ? userid : null;
      let financeAppId = e[i].allowance_status_id == 1297 ? userid : null;
      let isOver = e[i].is_overridden == "0" ? false : true;
      let comments =
        e[i].allowance_status_id == 1292
          ? "<br /><b>PM -> " +
            loggedUserName +
            "</b> : <b>" +
            formattedDate +
            " (Rejected) </b> :" +
            e[i].comments
          : e[i].allowance_status_id == 1293
          ? "<br /><b>DP -> " +
            loggedUserName +
            "</b> : <b>" +
            formattedDate +
            " (Rejected) </b> :" +
            e[i].comments
          : e[i].allowance_status_id == 1295
          ? "<br /><b>Finance -> " +
            loggedUserName +
            "</b> : <b>" +
            formattedDate +
            " (Rejected) </b> :" +
            e[i].comments
          : e[i].allowance_status_id == 1297
          ? "<br /><b>HR -> " +
            loggedUserName +
            "</b> : <b>" +
            formattedDate +
            " (Rejected) </b> :" +
            e[i].comments
          : "";
      e[i].allowance_status = "New";
      rejectsList.push({
        resourceId: e[i].id,
        workingwindow: e[i].res_ww,
        date: searchdata.startDate,
        resourceShiftAllowance: {
          allowanceAmount: e[i].allow_amt,
          extraHours: e[i].allow_extra_hours,
          extraHoursAmount: e[i].allow_extra_hours_amt,
          weekendHours: e[i].allow_wknd_hours,
          weekendAmount: e[i].allow_wknd_amt,
          oncallHours: e[i].allow_ocall_hours,
          oncallAmount: e[i].allow_ocall_amt,
          totalAmount: e[i].allow_total_amt,
          allowanceStatus: 1292,
          comments: comments,
          pmApproverId: pmAppId,
          dpApproverId: dpAppId,
          financeApproverId: hrAppId,
          hrApproverId: financeAppId,
          isOverridden: isOver,
        },
      });
    }
    axios({
      method: "post",
      url: baseUrl + `/timeandexpensesms/ShiftAllownces/postShiftAllownces`,
      // url: `http://localhost:8090/timeandexpensesms/ShiftAllownces/postShiftAllownces`,
      data: rejectsList,
    }).then((error) => {
      console.log("success", error);

      handleClick();
      setRejectButtonPopup(false);
      setSelectedData([]);
    });
  };
  //-------------------Previous Comments popover----------------
  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <FaCaretDown className="chevronIcon" />
      ) : (
        <FaCaretDown className="chevronIcon" />
      )}
    </>
  );
  function Popup(props) {
    const { anchorEl, handleClose, prevComments } = props;

    const open = Boolean(anchorEl);
    const id = open ? "" : undefined;
    const regex = /<b>(.*?)<\/b> : <b>(.*?)<\/b>/g;
    let matches;
    const uniqueEntries = new Map();

    // Loop through matches and add to Map
    while ((matches = regex?.exec(prevComments)) !== null) {
      const category = matches[1];
      const displayText = `${matches[1]} : ${matches[2]}`;

      // Check if category is not already in the Map or if the date is newer
      if (
        !uniqueEntries?.has(category) ||
        matches[2] > uniqueEntries?.get(category)
      ) {
        uniqueEntries.set(category, displayText);
      }
    }

    const filterComments = (prevComments) => {
      const uniqueComments = Array.from(
        new Set(prevComments?.split("<br /><br />"))
      )
        .filter((comment) => comment.trim() !== "")
        .join("<br /><br />");
      return uniqueComments;
    };
    const commentArray = prevComments
      .split(/<br\s*\/?>/g) // Split by <br> tags
      .filter((comment) => comment.trim() !== ""); // Filter out empty strings

    // Extract and display the latest comment for each person
    const latestComments = commentArray.reduce((acc, comment) => {
      const [, name, date, approval] =
        /<b>(.*?)<\/b>.*?<b>(.*?)<\/b>.*?:(.*?)$/.exec(comment) || [];

      if (name && date && approval) {
        acc[name] = `<b>${name}</b> : ${date} :${approval}`;
      }

      return acc;
    }, {});

    const commentList = Object.values(latestComments).map((comment, index) => (
      <li key={index} dangerouslySetInnerHTML={{ __html: comment }} />
    ));

    // Convert Map values to array for rendering
    const displayTextArray = Array?.from(uniqueEntries.values());
    return (
      <div classname="Shiftallowances">
        <Popover
          classname="Shiftallowances"
          id={id}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div>
            <DialogContent>
              <div>
                {/* {displayTextArray.map((text, index) => (
                  <p key={index}>{text}</p>
                ))} */}
                {/* <p>{filterComments(employee.prevcomments)}</p> */}
                {/* <li dangerouslySetInnerHTML={{ __html: formattedComments }} /> */}
                <ul>{commentList}</ul>
              </div>
            </DialogContent>
          </div>
        </Popover>
      </div>
    );
  }
  const HelpPDFName = "ShiftAllowanceExpenses.pdf";
  const Headername = "Shift Allowances Help";
  return (
    <div>
      {message ? (
        <div className="statusMsg error">
          <span>
            <IoWarningOutline /> Please select the valid values for highlighted
            fields
          </span>
        </div>
      ) : (
        ""
      )}
      {successMsg && (
        <div className="statusMsg success">
          <span>
            <BiCheck
              size="1.4em"
              color="green"
              strokeWidth={{ width: "100px" }}
            />{" "}
            Alllowance Approved successfully
          </span>
        </div>
      )}
      {rejectMsg && (
        <div className="statusMsg success">
          <span>
            <BiCheck
              size="1.4em"
              color="green"
              strokeWidth={{ width: "100px" }}
            />{" "}
            Alllowance Rejected successfully
          </span>
        </div>
      )}
      {validationMessage ? (
        <div className="statusMsg error">
          <span className="error-block">
            <AiFillWarning /> &nbsp; Please Select Mandatory Fields
          </span>
        </div>
      ) : (
        ""
      )}
      {selectionValidation ? (
        <div className="statusMsg error">
          <span className="error-block">
            <AiFillWarning /> &nbsp; Please Select Atleast One Resource
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="col-md-12">
        <div className="pageTitle">
          <div className="childOne"></div>
          <div className="childTwo">
            <h2>Shift Allowances</h2>
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
          </div>
        </div>
      </div>

      <div className="group mb-3 customCard">
        <CCollapse visible={!visible}>
          <div className="group-content row">
            <div className="col-md-3 mb-2">
              <div className="form-group row">
                <label className="col-5" htmlFor="email-input">
                  View By <span className="error-text">*</span>
                </label>
                <span className="col-1 p-0">:</span>
                <div className="col-6">
                  <select
                    id="select"
                    defaultValue={"Customer/Project"}
                    name="SelectType"
                    onChange={handleChange}
                  >
                    <option value="cust">Customer/Project</option>
                    <option value="res">Resource</option>
                  </select>
                </div>
              </div>
            </div>

            {selectType == "cust" ? (
              <>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="email-input">
                      Customer<span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[0] = ele;
                      }}
                    >
                      <MultiSelect
                        id="Customer"
                        options={Customer}
                        ArrowRenderer={ArrowRenderer}
                        hasSelectAll={true}
                        isLoading={false}
                        onInputChange={handleSearch}
                        virtualized
                        valueRenderer={generateDropdownLabel}
                        value={selectedCustomer}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        selected={selectedCustomer}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedCustomer(e);
                          let filteredCustomer = [];
                          e.forEach((d) => {
                            filteredCustomer.push(d.value);
                          });

                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["Customer"]: filteredCustomer.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="email-input">
                      Project<span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[1] = ele;
                      }}
                    >
                      <MultiSelect
                        className="multiselect"
                        id="Projects"
                        ArrowRenderer={ArrowRenderer}
                        valueRenderer={generateDropdownLabel1}
                        options={projects}
                        hasSelectAll={true}
                        isLoading={false}
                        shouldToggleOnHover={false}
                        disableSearch={false}
                        value={selectedProjects}
                        selected={selectedProjects}
                        //   valueRenderer={customValueRenderer}

                        //   value={selectedRoleTypes}

                        disabled={false}
                        onChange={(e) => {
                          setSelectedProjects(e);
                          let filteredProjects = [];
                          e.forEach((d) => {
                            filteredProjects.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["Projects"]: filteredProjects.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="email-input">
                      Alloc Type <span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <MultiSelect
                        id="typeId"
                        ArrowRenderer={ArrowRenderer}
                        options={AllocType}
                        hasSelectAll={true}
                        valueRenderer={generateDropdownLabel}
                        value={selectedAllocType}
                        disabled={false}
                        onChange={(e) => {
                          setSelectedAllocType(e);
                          let filteredType = [];
                          e.forEach((d) => {
                            filteredType.push(d.value);
                          });
                          setSearchdata((prevVal) => ({
                            ...prevVal,
                            ["AllocType"]: filteredType.toString(),
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="email-input">
                      Month <span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <DatePicker
                        dateFormat="MMM-yyyy"
                        selected={startDate}
                        id="startDate"
                        name="startDate"
                        onChange={(e) => {
                          setSearchdata((prev) => ({
                            ...prev,
                            ["startDate"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setStartDate(e);
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        showMonthYearPicker
                        maxDate={oneMonthAgo}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="country-select">
                      Status <span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[2] = ele;
                      }}
                    >
                      <MultiSelect
                        className="multiselect"
                        id="Status"
                        ArrowRenderer={ArrowRenderer}
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
              </>
            ) : (
              // ------------------------Resources---------------------------
              <>
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="email-input">
                      Month<span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div className="col-6">
                      <DatePicker
                        dateFormat="MMM-yyyy"
                        selected={startDate}
                        id="startDate"
                        name="startDate"
                        onChange={(e) => {
                          setSearchdata((prev) => ({
                            ...prev,
                            ["startDate"]: moment(e).format("yyyy-MM-DD"),
                          }));
                          setStartDate(e);
                        }}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                        showMonthYearPicker
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="email-input">
                      Resource Name<span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 reactautocomplete"
                      ref={(ele) => {
                        ref.current[6] = ele;
                      }}
                    >
                      <RiskAutoComplete
                        name="assigned_to"
                        id="assigned_to"
                        riskDetails={riskDetails}
                        // setState={setState}
                        setUsername={setUsername}
                        getData={getData}
                        setFormData={setFormData}
                        onChangeHandler={onChangeHandler}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="email-input">
                      Status <span className="error-text">*</span>
                    </label>
                    <span className="col-1 p-0">:</span>
                    <div
                      className="col-6 multiselect"
                      ref={(ele) => {
                        ref.current[7] = ele;
                      }}
                    >
                      <MultiSelect
                        className="multiselect"
                        id="Status"
                        options={Status}
                        hasSelectAll={true}
                        value={selectedStatus}
                        ArrowRenderer={ArrowRenderer}
                        disabled={false}
                        valueRenderer={generateDropdownLabel}
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
              </>
            )}

            <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
              <button
                type="button"
                className="btn btn-primary"
                title="Search"
                value={searching}
                onClick={() => {
                  handleClick();
                }}

                // onClick={() => setAddVisible(true)}
              >
                <FaSearch /> Search{" "}
              </button>
            </div>
          </div>
        </CCollapse>
      </div>

      {open && state && (
        <>
          {data && (
            <ShiftAllowncesDataTable
              data={data}
              loggedUserId={loggedUserId}
              checkedData={checkedData}
              setCheckedData={setCheckedData}
              column={column}
              loader={loader}
              globalFilterValue={globalFilterValue}
              setGlobalFilterValue={setGlobalFilterValue}
              roles={resRolesId}
              tableDataNew={tableDataNew}
              fileName="shift Allowance"
              open={open}
              state={state}
              setEmpallowStatus={setEmpallowStatus}
              configAccessFinanceprop={configAccessFinanceprop}
              configAccessAdminprop={configAccessAdminprop}
              configAccessHrprop={configAccessHrprop}
              prevComments={prevComments}
              setStatusComments={setStatusComments}
              bodyData={bodyData}
              setPrevComments={setPrevComments}
              setAnchorEl={setAnchorEl}
              buttonPopup={buttonPopup}
              dataAccess={dataAccess}
              setButtonPopup={setButtonPopup}
              setSelectedData={setSelectedData}
              selectedData={selectedData}
            />
          )}

          <div className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (selectedData?.length > 0) {
                  setButtonPopup(true);
                  setSelectionValidation(false);
                } else {
                  setSelectionValidation(true);
                  setTimeout(() => {
                    setSelectionValidation(false);
                  }, 3000);
                }
              }}
            >
              <FaSave /> Approve
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (selectedData.length > 0) {
                  setRejectButtonPopup(true);
                  setSelectionValidation(false);
                } else {
                  setSelectionValidation(true);
                  setTimeout(() => {
                    setSelectionValidation(false);
                  }, 3000);
                }
              }}
            >
              <FaUndo /> Reject
            </button>
          </div>
        </>
      )}

      {(anchorEl && prevComments != null) ||
      prevComments != "" ||
      prevComments != undefined ||
      prevComments != [] ? (
        <Popup
          handleClose={handleClose}
          anchorEl={anchorEl}
          prevComments={prevComments}
        />
      ) : (
        ""
      )}

      {buttonPopup ? (
        <ShiftAllowncesPopup
          handleApprove={handleApprove}
          buttonPopup={buttonPopup}
          setButtonPopup={setButtonPopup}
          selectedData={selectedData}
          setSuccessMsg={setSuccessMsg}
        />
      ) : (
        ""
      )}
      {rejectbuttonPopup ? (
        <ShiftAllowanceRejectPopup
          handleReject={handleReject}
          rejectbuttonPopup={rejectbuttonPopup}
          setRejectButtonPopup={setRejectButtonPopup}
          selectedData={selectedData}
          setRejectMsg={setRejectMsg}
        />
      ) : (
        ""
      )}
      {loadingState ? <Loader handleAbort={handleAbort} /> : ""}
    </div>
  );
}

export default ShiftAllownces;
