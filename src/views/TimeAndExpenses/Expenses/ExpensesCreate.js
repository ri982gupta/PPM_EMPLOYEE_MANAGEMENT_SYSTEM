import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaSave } from "react-icons/fa";
import { environment } from "../../../environments/environment";
import moment from "moment";
import ExpensesCreateTable from "./ExpensesCreateTable";
import { BiTrash, BiPlus } from "react-icons/bi";
import {
  AiFillCaretDown,
  AiFillCaretRight,
  AiFillDelete,
} from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import AddExpensePopup from "./AddExpensePopup";
import { ImCross } from "react-icons/im";
import { TiTick } from "react-icons/ti";
import GlobalHelp from "../../PrimeReactTableComponent/GlobalHelp";
import ExpensesTypePopUp from "./ExpensesTypePopUp";
import { BsFillCircleFill } from "react-icons/bs";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { SlExclamation, SlPaperClip } from "react-icons/sl";
import { BiCheck } from "react-icons/bi";
import { IoWarningOutline } from "react-icons/io5";
import { CModal, CModalBody, CModalHeader, CModalTitle } from "@coreui/react";
import Loader from "../../Loader/Loader";
import { useParams, useNavigate, Link } from "react-router-dom";
import { RiMenuAddLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { updateExpenseButtonState } from "../../../reducers/SelectedSEReducer";
//import "./ExpensesTypePopUp.scss";

function ExpensesCreate(props) {
  const {
    id,
    setCheveronIcon,
    setVisible,
    visible,
    cheveronIcon,
    loader,
    stackIdData,
    setStackIdData,
    tableLoader,
    startDate,
    iconState,
    displayTableBody,
    setTableLoader,
    setLoader,
    setIconState,
    setDisplayTableBody,
    setStartDate,
  } = props;

  const [currencyOptionsData, setCurrencyOptionsData] = useState([]);

  const [projectRenderData, setProjectRenderData] = useState(null);

  const [dates, setDates] = useState([]);

  const [projectData, setProjectData] = useState([]);

  const [expenseTypePopupState, setExpenseTypePopupState] = useState(false);

  const [expenseTypeOptions, setExpenseTypeOptions] = useState({});

  const [expenseTypeRenderData, setExpenseTypeRenderData] = useState(null);

  const [expenseTypesValues, setExpenseTypesValues] = useState([]);

  const [expenseFor, setExpenseFor] = useState("3");

  const [expenseTypeId, setExpenseTypeId] = useState("");
  const [country, setCountry] = useState([]);

  const [selectedExpenseTypes, setSelectedExpenseTypes] = useState([]);

  const [cities, setCities] = useState([]);

  const [carTypes, setCarTypes] = useState([]);
  const [rates, setRates] = useState({});

  const [paidBy, setPaidBy] = useState([]);

  const [airportList, setAirportList] = useState([]);

  const [projectId, setProjectId] = useState();

  const [mobileType, setMobileType] = useState([]);
  const [currencyCode, setCurrencyCode] = useState("&#8377");
  const [amountStatusDisplay, setAmountStatusDisplay] = useState(null);
  const [expInfo, setExpInfo] = useState([]);
  const [expDate, setExpDate] = useState(null);
  const [isProjectSelected, setIsProjectSelected] = useState(true);
  const [message, setMessage] = useState(false);
  const [expenseData, setExpenseData] = useState({});
  const [expDocList, setExpDocList] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("&#8377");
  const [expCurrencySymbol, setExpCurrencySymbol] = useState("&#8377");
  const [expenseId, setExpenseId] = useState();
  const [valueOfUSD, setValueOfUSD] = useState(1);
  const [stackCurrency, setStackCurrency] = useState("448");
  const [expCurrency, setExpCurrency] = useState("448");
  const [userRoles, setUserRoles] = useState([]);

  const loggedUserId = localStorage.getItem("resId");
  const handleAbort = props.handleAbort;
  const setbtnState = props.setbtnState;
  const urlState = props.urlState;
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [routes, setRoutes] = useState([]);
  let textContent = "Time & Expenses";
  let currentScreenName = ["Expenses", "Create Expense Report"];
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
    getUserRoles();
  }, []);
  const getMenus = () => {
    // setMenusData

    axios({
      method: "GET",
      url: baseUrl + `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
    }).then((resp) => {
      let data = resp.data;
      const updatedMenuData = data.map((category) => ({
        ...category,
        subMenus: category.subMenus.filter(
          (submenu) =>
            submenu.display_name !== "Shift Allownaces" &&
            // submenu.display_name !== "Fill Timesheets" &&
            submenu.display_name !== "Project Timesheet (Deprecated)"
        ),
      }));
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
        `/CommonMS/security/authorize?url=/projectExpense/create/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };

  const getUserRoles = () => {
    axios
      .get(
        baseUrl +
          `/timeandexpensesms/projectExpense/userRoles?userId=${loggedUserId}`
      )
      .then((res) => {
        let roleTypeIds = res?.data?.map((item) => item.roleTypeId);
        setUserRoles(roleTypeIds);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (id !== undefined && stackIdData?.length > 0) {
      const expIdList = stackIdData?.map((it) => it.id);
      if (expIdList.length > 0) {
        expIdList.forEach((expId) => {
          axios
            .get(
              baseUrl +
                `/timeandexpensesms/projectExpense/expenseDocuments?expenseId=${expId}`
            )
            .then((res) => {
              setDocuments((prev) => [...prev, res.data]);
              setProjectId(() => stackIdData[0]?.object_id);
            })
            .catch((error) => console.log(error));
        });
      }
    }
  }, [stackIdData]);

  const [paymentUsers, setPaymentUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          baseUrl + `/ProjectMS/projectExpenses/paymentUsers`
        );
        const paymentUsers = response.data;
        setPaymentUsers(paymentUsers);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const expTypList = stackIdData?.map((it) => {
      return {
        id: it.expense_type_id,
        lkup_name: it.name == null ? it.lkup_name : it.name,
      };
    });

    const uniqueExpenseTypes = new Map();
    expTypList.forEach((item) => {
      const key = `${item.id}-${item.lkup_name}`;
      if (!uniqueExpenseTypes.has(key)) {
        uniqueExpenseTypes.set(key, item);
      }
    });

    const uniqueExpTypList = Array.from(uniqueExpenseTypes.values());

    setSelectedExpenseTypes(uniqueExpTypList);

    const expInfoList = stackIdData?.map((prev) => {
      return {
        ...prev,
        //stackId:id,
        name: prev.name == null ? prev.lkup_name : prev.name,
        date: prev.expense_date,
        prjId: prev.object_id,
        expTypId: prev.expense_type_id,
        expAmt: prev.amount,
        paidBy: prev.paid_by,
        currency: prev.currency_type_id,
        description: prev.description,
        location: prev.location_id,
        id: prev.id,
        isActive: prev.is_active,
        note: prev.note,
        noOfMiles: prev.no_of_miles,
        rate: prev.rate,
        rental: prev.rental,
        charge: prev.charge,
        fuelAmount: prev.fuel_amount,
        carType: prev.car_type_id,
        tollCharge: prev.toll_charge,
        parking: prev.parking_fee,
        peopleAttnd: prev.people_attended,
        guestAttnd: prev.guests_attended,
        empAttnd: prev.emp_attended,
        noOfNights: prev.no_of_nights,
        subLocation: prev.city_id,
        restOfWorld: prev.rest_of_world,
        origin: prev.origin_city_id,
        destination: prev.destination_city_id,
        ticketFare: prev.ticket_fare,
        addCharges: prev.additional_charge,
        travelType: prev.type_travel_id,
        tripType: prev.type_trip_id,
        mobileType: prev.type_id,
        statusId: prev.status_id,
      };
    });
    setExpInfo(expInfoList);
    setFiles(documents);
    setExpCurrencySymbol(() => {
      let container = document.createElement("div");
      container.innerHTML = currencyOptionsData?.find(
        (item) => item.id == stackIdData[0]?.currency_type_id
      )?.currencyCode;
      return container.innerHTML;
    });
    if (id != undefined) {
      let stackCur = stackIdData[0]?.currency_id;
      let expCur = stackIdData[0]?.currency_type_id;
      setStackCurrency(stackCur);
      setExpCurrency(expCur);
    }
  }, [stackIdData, currencyOptionsData]);

  const initilaValue = {
    fromDate: "",
    toDate: "",
  };

  const expenseForOptions = [
    { id: 3, value: "Project" },
    { id: 7, value: "Business Unit" },
  ];

  const [formData, setFormData] = useState(initilaValue);
  const HelpPDFName = "CreateExpenseType.pdf";
  const HelpHeader = "Create Expense Report : Draft Help";
  const baseUrl = environment.baseUrl;

  const [weekData, setWeekData] = useState({});

  useEffect(() => {
    currencyOptions();
    getProjects();
  }, [expenseFor]);

  useEffect(async () => {
    const endDt = moment(startDate)
      .startOf("week")
      .add(6, "days")
      .format("DD-MMM-yyyy");
    const loaderTime = setTimeout(() => {
      setLoader(true);
    }, 2000);
    setTableLoader(false);
    await axios
      .get(
        baseUrl +
          `/timeandexpensesms/projectExpense/getWeekDays?lastDay=${endDt}`
      )
      .then((res) => {
        let strtDt = res.data?.days[0];
        let endDt = res.data?.days[res.data.days.length - 1];

        setFormData((prev) => ({ ...prev, ["fromDate"]: strtDt }));

        setFormData((prev) => ({
          ...prev,
          ["toDate"]: moment(endDt).endOf("day"),
        }));
        setWeekData(res.data);
        setRates(res.data.rates);
        setLoader(false);
        clearTimeout(loaderTime);
        setTableLoader(true);
      })
      .catch((error) => console.log(error));
  }, [startDate]);

  const currencyOptions = () => {
    axios
      .get(baseUrl + "/ProjectMS/Engagement/getCurrency")
      .then((resp) => {
        setCurrencyOptionsData(resp.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getCountries();
    getCities();
    getCarTypes();
    getPaidBy();
    getAirportList();
    getMobileType();
  }, []);

  useEffect(() => {
    setCurrencySymbol(() => {
      let container = document.createElement("div");
      container.innerHTML = currencyOptionsData?.find(
        (it) => it.id == stackCurrency
      )?.currencyCode;
      return container.innerHTML;
    });
  }, [stackCurrency, stackIdData, currencyCode, currencyOptionsData]);

  const getCountries = () => {
    axios
      .get(baseUrl + `/CostMS/cost/getCountries`)
      .then((res) => {
        setCountry(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getCities = () => {
    axios
      .post(baseUrl + `/timeandexpensesms/projectExpense/getCities?objectId=3`)
      .then((res) => {
        const data = res.data;
        const transformedData = data.map((cityObj) => ({
          name: cityObj.city,
          value: cityObj.id.toString(),
        }));
        setCities(transformedData);
      })
      .catch((error) => console.log(error));
  };

  const getCarTypes = () => {
    axios
      .post(baseUrl + `/timeandexpensesms/projectExpense/carType`)
      .then((res) => {
        setCarTypes(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getPaidBy = () => {
    axios
      .post(baseUrl + `/timeandexpensesms/projectExpense/paidBy`)
      .then((res) => {
        setPaidBy(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getAirportList = () => {
    axios
      .post(baseUrl + `/timeandexpensesms/projectExpense/airportList`)
      .then((res) => {
        const data = res.data;
        const transformedData = data.map((cityObj) => ({
          name: cityObj.name,
          value: cityObj.id.toString(),
        }));
        setAirportList(transformedData);
      })
      .catch((error) => console.log(error));
  };

  const getMobileType = () => {
    axios
      .post(baseUrl + `/timeandexpensesms/projectExpense/mobileType`)
      .then((res) => {
        setMobileType(res.data);
      })
      .catch((error) => console.log(error));
  };

  const getProjects = () => {
    const loggedUserId = localStorage.getItem("resId");
    let type = "businessUnit";
    if (expenseFor == 3) {
      type = "projects";
    }
    axios
      .get(
        baseUrl +
          `/timeandexpensesms/projectExpense/getProjects?userId=${loggedUserId}&type=${type}`
      )
      .then((resp) => {
        let projDt = resp.data;
        setProjectData(projDt);
      });
  };

  useEffect(() => {
    if (id === undefined) {
      if (formData["project"] != undefined) {
        getProjectData(formData["project"]);
      }
    }
    if (id !== undefined) {
      getProjectData(stackIdData[0]?.object_id);
    }
  }, [formData, id]);

  const getProjectData = (prjId) => {
    axios
      .post(
        baseUrl +
          `/timeandexpensesms/projectExpense/getExpenseTypesPopUp/?prjId=${prjId}&expLvlType=${expenseFor}`
      )
      .then((res) => {
        setExpenseTypeOptions(res.data);
      })
      .catch((error) => console.log(error));
  };

  const colorOfApproval = (rowData) => {
    if (rowData.includes("Submitted")) {
      return "#ccc";
    } else if (
      rowData.includes("PM Approved") ||
      rowData.includes("Pending") ||
      rowData.includes("IT Approved") ||
      rowData.includes("HR Approved")
    ) {
      return "#CDE6FE";
    } else if (rowData.includes("PM Rejected")) {
      return "#e54c53";
    } else if (rowData.includes("Paid")) {
      return "#D9FBB3";
    } else if (rowData.includes("Approved To Pay")) {
      return "#0080ff";
    } else if (
      rowData.includes("FM Rejected") ||
      rowData.includes("IT Rejected") ||
      rowData.includes("HR Rejected")
    ) {
      return "#e54c53";
    } else {
      return "";
    }
  };

  const [expensesTypePopup, setExpensesTypePopup] = useState(false);

  const toggleIcon = () => {
    setIconState(iconState === "right" ? "down" : "right");
  };

  const [selectAll, setSelectAll] = useState(false);

  const [isValuesChecked, setIsValuesChecked] = useState({});

  useEffect(() => {
    const initialIsValuesChecked = {};

    expenseTypeOptions.expenses?.map((obj) => {
      initialIsValuesChecked[obj.id] = false;
    });

    setIsValuesChecked(initialIsValuesChecked);
  }, [expenseTypeOptions]);

  useEffect(() => {
    if (displayTableBody == true) {
      sampleFunc();
    }
  }, [
    displayTableBody,
    expInfo,
    dates,
    iconState,
    currencyCode,
    rates,
    stackIdData,
    currencySymbol,
    valueOfUSD,
  ]);

  useEffect(() => {
    if (displayTableBody == false) {
      setExpCurrency(stackCurrency);
    }
    if (
      rates &&
      rates[moment(startDate).format("YYYY-MM-DD")] &&
      rates[moment(startDate).format("YYYY-MM-DD")][expCurrency] &&
      rates[moment(startDate).format("YYYY-MM-DD")][stackCurrency] &&
      currencyOptionsData.length > 0 &&
      expCurrency != stackCurrency
    ) {
      let val = 1;

      if (
        rates[moment(startDate).format("YYYY-MM-DD")][expCurrency][
          "valueInUSD"
        ] !== undefined
      ) {
        let usdCost =
          val *
          rates[moment(startDate).format("YYYY-MM-DD")][expCurrency][
            "valueInUSD"
          ];
        if (
          rates[moment(startDate).format("YYYY-MM-DD")][stackCurrency][
            "valueOfUSD"
          ] !== undefined
        ) {
          val =
            usdCost *
            rates[moment(startDate).format("YYYY-MM-DD")][stackCurrency][
              "valueOfUSD"
            ];
          setValueOfUSD(val);
        } else {
          console.error(
            `valueOfUSD is undefined for stackCurrency ${stackCurrency}`
          );
        }
      } else {
        console.error(`valueInUSD is undefined for expCurrency ${expCurrency}`);
      }
    } else {
      setValueOfUSD(1);
    }
  }, [stackCurrency, expCurrency, startDate, rates, currencyOptionsData]);

  const columnSum = (d) => {
    return expInfo
      .filter((item) => item.date == moment(d).format("YYYY-MM-DD"))
      .map((i) => parseFloat(i.expAmt))
      .reduce((acc, cur) => acc + cur, 0) > 0
      ? `${currencySymbol} ${(
          expInfo
            .filter((item) => item.date == moment(d).format("YYYY-MM-DD"))
            .map((i) => parseFloat(i.expAmt))
            .reduce((acc, cur) => acc + cur, 0) * valueOfUSD
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "";
  };

  const rowSum = (ele) => {
    return expInfo
      .filter((item) => item.name == ele.lkup_name)
      .map((i) => parseFloat(i.expAmt))
      .reduce((acc, cur) => acc + cur, 0) > 0
      ? `${currencySymbol}  ${parseFloat(
          expInfo
            .filter((item) => item.name == ele.lkup_name)
            .map((i) => parseFloat(i.expAmt))
            .reduce((acc, cur) => acc + cur, 0) * valueOfUSD
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "";
  };

  const totalSum = () => {
    return (
      expInfo
        .map((item) => parseFloat(item.expAmt))
        .reduce((acc, cur) => acc + cur, 0) *
        valueOfUSD >
        0 &&
      `${currencySymbol} ${(
        expInfo
          .map((item) => parseFloat(item.expAmt))
          .reduce((acc, cur) => acc + cur, 0) * valueOfUSD
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    );
  };

  const [isExpenseBillable, setIsExpenseBillable] = useState(null);

  const sampleFunc = () => {
    setProjectRenderData(() => {
      return (
        <>
          <tr>
            <td>
              <div>
                <div className="expandArrow">
                  <input
                    type="checkbox"
                    defaultChecked={isProjectSelected}
                    disabled={
                      id !== undefined && stackIdData[0]?.status_id !== 634
                    }
                    onChange={(event) => {
                      setIsProjectSelected(event.currentTarget.checked);
                    }}
                  />
                  <span onClick={toggleIcon}>
                    {iconState === "right" ? (
                      <AiFillCaretRight />
                    ) : (
                      <AiFillCaretDown />
                    )}
                  </span>
                </div>
                <div className="expType">
                  {id == undefined ? (
                    <>
                      {expenseFor == 11 ? (
                        <span title="Prolifics">Prolifics</span>
                      ) : (
                        <span
                          title={
                            projectData?.find(
                              (item) => item.id == formData.project
                            )?.name
                          }
                        >
                          {
                            projectData?.find(
                              (item) => item.id == formData.project
                            )?.name
                          }
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {stackIdData[0]?.object_id == -1 ? (
                        <span title="Prolifics">Prolifics</span>
                      ) : (
                        <span
                          title={
                            projectData?.find(
                              (item) => stackIdData[0]?.object_id == item.id
                            )?.name !== undefined
                              ? projectData?.find(
                                  (item) => stackIdData[0]?.object_id == item.id
                                )?.name
                              : "Finance"
                          }
                        >
                          {projectData?.find(
                            (item) => stackIdData[0]?.object_id == item.id
                          )?.name !== undefined
                            ? projectData?.find(
                                (item) => stackIdData[0]?.object_id == item.id
                              )?.name
                            : "Finance"}
                        </span>
                      )}
                    </>
                  )}
                  {id == undefined || stackIdData[0]?.status_id == 634 ? (
                    <button
                      className="btn"
                      onClick={() => {
                        setExpenseTypePopupState(() => true);
                      }}
                    >
                      <BiPlus />
                      Add Expense
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </td>

            {dates.map((d) => (
              <td>
                <div style={{ textAlign: "center" }}>
                  {expInfo.length > 0 && <strong>{columnSum(d)}</strong>}
                </div>
              </td>
            ))}
            <td style={{ textAlign: "right" }}>
              <strong>{totalSum()}</strong>
            </td>
          </tr>
        </>
      );
    });
  };

  const [projectSelectMsg, setProjectSelectMsg] = useState(false);
  const [addButtonDisable, setAddButtonDisable] = useState(false);

  const addHandler = () => {
    if (formData.project == undefined) {
      setProjectSelectMsg(true);
      setTimeout(() => {
        setProjectSelectMsg(false);
      }, 3000);
      return;
    }
    setDisplayTableBody(true);
    sampleFunc();
    if (formData.project !== undefined) {
      setAddButtonDisable(true);
    }
  };

  const addSameExpenseType = (expTypeId) => {
    const expenseTypeIndex = selectedExpenseTypes.findIndex(
      (item) => item.id === expTypeId
    );

    if (expenseTypeIndex === -1) {
      console.error("Expense type not found.");
      return;
    }

    const existingExpenses = selectedExpenseTypes.filter(
      (item) =>
        item.id.toString().startsWith(expTypeId) && item.id !== expTypeId
    );

    const nextExpenseNumber = existingExpenses.length + 1;
    const newExpense = {
      id: `${expTypeId}_${nextExpenseNumber}`,
      lkup_name: `${selectedExpenseTypes[expenseTypeIndex].lkup_name} Expense ${nextExpenseNumber}`,
    };

    selectedExpenseTypes.splice(
      expenseTypeIndex + nextExpenseNumber,
      0,
      newExpense
    );

    setSelectedExpenseTypes([...selectedExpenseTypes]);
  };

  const [expName, setExpName] = useState("");

  const [fileMap, setFileMap] = useState({});

  const inputFieldColor = (d, expTyd) => {
    let status = [];
    status.push(
      stackIdData?.find(
        (item) =>
          item.expense_type_id == expTyd &&
          item.expense_date == moment(d).format("YYYY-MM-DD")
      )?.approvalStatus
    );
    return colorOfApproval(status);
  };

  const [selectedElement, setSelectedElement] = useState({});

  useEffect(() => {
    setExpenseTypeRenderData(() => {
      return (
        <>
          {selectedExpenseTypes.length > 0 ? (
            selectedExpenseTypes?.map((ele) => {
              const hasNumber = /\d+$/.test(ele.lkup_name);
              return (
                <tr>
                  <td>
                    <div className="innerRows justify-content-between">
                      <span>{ele.lkup_name}</span>
                      {!hasNumber &&
                        (id === undefined ||
                          stackIdData[0]?.status_id === 634) && (
                          <BiPlus
                            style={{ cursor: "pointer" }}
                            title="Add another expense"
                            onClick={() => {
                              addSameExpenseType(ele.id);
                            }}
                          />
                        )}

                      {id == undefined || stackIdData[0]?.status_id == 634 ? (
                        <BiTrash
                          style={{ cursor: "pointer" }}
                          title="Delete Expense"
                          onClick={() => {
                            setSelectedElement(ele);
                            setExpenseDelPopup(true);
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </td>

                  {dates.map((d) => (
                    <td key={d}>
                      <div className="inputFields">
                        <span>
                          {expInfo.length > 0
                            ? expInfo.some(
                                (i) => i.date == moment(d).format("YYYY-MM-DD")
                              )
                              ? expCurrencySymbol
                              : currencySymbol
                            : currencySymbol}
                        </span>
                        <input
                          type="text"
                          id={ele.id}
                          readOnly
                          style={{
                            textAlign: "right",
                            backgroundColor: `${inputFieldColor(d, ele.id)}`,
                          }}
                          value={
                            expInfo.find(
                              (item) =>
                                item.expTypId == ele.id &&
                                item.name == ele.lkup_name &&
                                item.date == moment(d).format("YYYY-MM-DD")
                            )?.expAmt > 0
                              ? expInfo
                                  .find(
                                    (item) =>
                                      item.expTypId == ele.id &&
                                      item.name == ele.lkup_name &&
                                      item.date ==
                                        moment(d).format("YYYY-MM-DD")
                                  )
                                  ?.expAmt.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                              : ""
                          }
                          onClick={(event) => {
                            let extpd = "" + ele.id;
                            setExpensesTypePopup(true);
                            setExpenseTypeId(extpd);
                            setExpDate(d);
                            if (id == undefined) {
                              setProjectId(formData.project);
                            }
                            setIsExpenseBillable(
                              () =>
                                projectData.find(
                                  (item) => item.id == formData.project
                                )?.expenseBillable
                            );
                            setExpName(ele.lkup_name);
                            if (
                              expInfo.some(
                                (item) =>
                                  item.expTypId == ele.id &&
                                  item.name == ele.lkup_name &&
                                  item.date == moment(d).format("YYYY-MM-DD")
                              )
                            ) {
                              const obj = expInfo.find(
                                (item) =>
                                  item.expTypId == ele.id &&
                                  item.name == ele.lkup_name &&
                                  item.date == moment(d).format("YYYY-MM-DD")
                              );
                              setExpenseData(obj);
                              setExpenseId(obj.id);
                            }
                          }}
                          onChange={(e) => {
                            setExpInfo((prevExpInfo) => {
                              const updatedExpInfo = [...prevExpInfo];
                              const dateToFind = moment(d).format("YYYY-MM-DD");
                              const expTypeIdToFind = ele.id;
                              const objIndex = updatedExpInfo.findIndex(
                                (it) =>
                                  it.date == dateToFind &&
                                  it.expTypId == expTypeIdToFind
                              );
                              updatedExpInfo[objIndex].expAmt = e.target.value;
                              return updatedExpInfo;
                            });
                          }}
                          onKeyDown={(e) => {
                            const key = e.key;
                            const isNumber = /^[0-9]$/.test(key);
                            const isDecimal = key === ".";
                            const isAllowedKey = [
                              "Backspace",
                              "Delete",
                              "ArrowLeft",
                              "ArrowRight",
                            ].includes(key);

                            if (!isNumber && !isDecimal && !isAllowedKey) {
                              e.preventDefault();
                            }
                          }}
                          disabled={
                            moment(d).isBefore(
                              moment(noteDate(), "DD-MMMM-YYYY") &&
                                id === undefined
                            ) ||
                            (id !== undefined &&
                              !expInfo.some(
                                (item) =>
                                  item.expTypId == ele.id &&
                                  item.date == moment(d).format("YYYY-MM-DD")
                              ) &&
                              stackIdData[0]?.status_id !== 634)
                          }
                        />
                        {expInfo.some(
                          (item) =>
                            item.expTypId == ele.id &&
                            item.date == moment(d).format("YYYY-MM-DD")
                        ) &&
                          id !== undefined &&
                          documents
                            .flatMap((it) => it)
                            .some(
                              (i) =>
                                i.expense_id ==
                                expInfo.find(
                                  (item) =>
                                    item.expTypId == ele.id &&
                                    item.date ==
                                      moment(d).format("YYYY-MM-DD") &&
                                    item.name == ele.lkup_name
                                )?.id
                            ) && (
                            <SlPaperClip
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setDocumentPopup(true);
                                let expId = expInfo.find(
                                  (item) =>
                                    item.expTypId == ele.id &&
                                    item.date ==
                                      moment(d).format("YYYY-MM-DD") &&
                                    item.name == ele.lkup_name
                                ).id;
                                let docList = documents
                                  .flatMap((iz) => iz)
                                  .filter((it) => it.expense_id == expId);
                                setExpDocList(docList);
                              }}
                            />
                          )}
                      </div>
                    </td>
                  ))}
                  <td style={{ textAlign: "right" }}>
                    <strong className="text-center m-0">
                      {expInfo.length > 0 && <span>{rowSum(ele)}</span>}
                    </strong>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={dates.length + 2}
                className="text-center"
                style={{ backgroundColor: "#EEEEEE" }}
              >
                No Expenses
              </td>
            </tr>
          )}
        </>
      );
    });
  }, [
    selectedExpenseTypes,
    currencyCode,
    expInfo,
    dates,
    currencySymbol,
    expCurrencySymbol,
    stackIdData,
    expenseData,
    valueOfUSD,
  ]);

  const onChangeHandler = (e) => {
    setFormData((prev) => {
      return {
        ...prev,
        project: e.target.value,
      };
    });
  };

  const [stackAdvance, setStackAdvance] = useState(0.0);

  const [stackDesc, setStackDesc] = useState("");

  const [netAmount, setNetAmount] = useState(0.0);

  useEffect(() => {
    const nt =
      valueOfUSD *
        expInfo
          .map((item) => parseFloat(item.expAmt))
          .reduce((acc, cur) => acc + cur, 0) -
      parseFloat(stackAdvance);
    setNetAmount(parseFloat(nt));
  }, [stackAdvance, expInfo]);

  useEffect(() => {
    setAmountStatusDisplay(() => {
      return (
        <>
          <table className="amtTbl Net_table">
            <tbody>
              <tr style={{ backgroundColor: "#e6ecff", border: "0px" }}>
                <td>
                  <strong>Total</strong>
                </td>
                <td>: {currencySymbol}</td>
                <td>
                  <strong style={{ float: "right" }}>
                    {!isNaN(
                      expInfo
                        .map((item) => parseFloat(item.expAmt))
                        .reduce((acc, cur) => acc + cur, 0) * valueOfUSD
                    )
                      ? (
                          expInfo
                            .map((item) => parseFloat(item.expAmt))
                            .reduce((acc, cur) => acc + cur, 0) * valueOfUSD
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}
                  </strong>
                </td>
              </tr>
              <tr style={{ backgroundColor: "#ffffe6" }}>
                <td>
                  <strong>Advance</strong>
                </td>
                <td>: {currencySymbol}</td>
                <td style={{ paddingRight: "0.25%" }}>
                  <input
                    type="text"
                    style={{ textAlign: "right" }}
                    defaultValue="0.00"
                    onChange={(e) => setStackAdvance(e.target.value)}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const isNumber = /^[0-9]$/.test(key);
                      const isDecimal = key === ".";
                      const isAllowedKey = [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                      ].includes(key);

                      if (!isNumber && !isDecimal && !isAllowedKey) {
                        e.preventDefault();
                      }
                    }}
                  />
                </td>
              </tr>
              <tr style={{ backgroundColor: "#ffe6f3" }}>
                <td>
                  <strong>Net</strong>
                </td>
                <td>: {currencySymbol}</td>
                <td>
                  <strong style={{ float: "right" }}>
                    {!isNaN(valueOfUSD) &&
                    !isNaN(parseFloat(stackAdvance || 0)) &&
                    !isNaN(
                      expInfo
                        .map((item) => parseFloat(item.expAmt))
                        .reduce((acc, cur) => acc + cur, 0)
                    )
                      ? (
                          valueOfUSD *
                            expInfo
                              .map((item) => parseFloat(item.expAmt))
                              .reduce((acc, cur) => acc + cur, 0) -
                          parseFloat(stackAdvance || 0)
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      );
    });
  }, [currencyCode, expInfo, stackAdvance, currencySymbol, valueOfUSD]);

  useEffect(() => {
    if (expensesTypePopup === false) {
      if (Object.keys(expenseData).length === 0) {
        return;
      }
      const existingItemIndex = expInfo.findIndex(
        (item) =>
          item.expTypId == expenseData.expTypId &&
          item.date == expenseData.date &&
          item.name == expName
      );

      if (existingItemIndex !== -1) {
        setExpInfo((prev) => {
          const updatedExpInfo = [...prev];
          updatedExpInfo[existingItemIndex] = { ...expenseData };
          return updatedExpInfo;
        });
      } else {
        setExpInfo((prev) => [...prev, { ...expenseData }]);
      }
    }
  }, [expensesTypePopup, expenseData]);

  const [files, setFiles] = useState([]);

  const [isExpProvided, setIsExpProvided] = useState(false);

  const [savedExpense, setSavedExpense] = useState({});

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSaved) {
      setTimeout(() => {
        navigate(`/expense/Create/${savedExpense.expenseStackId}`);
        window.location.reload();
      }, 100);
    }
    if (isSubmitted) {
      if (paymentUsers.includes(parseInt(loggedUserId))) {
        dispatch(updateExpenseButtonState("Search"));
        navigate(`/search/userExpenseHistory`);
        setbtnState("Search");
      } else {
        setTimeout(() => {
          navigate(`/stackView`);
        }, 2000);
      }
    }
  }, [isSaved, isSubmitted]);

  const [stackSaveFail, setStackSaveFail] = useState(false);

  const [saveLoader, setSaveLoader] = useState(false);

  const [filesMissing, setFileMissing] = useState(false);

  const [submitMsg, setSubmitMsg] = useState(false);

  const saveProjectExpenses = (isSubmitState) => {
    const finalExpInfo = expInfo.filter((it) => it.expAmt > 0);
    var finalData = {};
    if (finalExpInfo.length > 0) {
      finalData = {
        isSubmit: isSubmitState,
        stackId: id !== undefined ? id : "",
        expLvlType: expenseFor,
        stackDesc: stackDesc,
        stackAdvance: stackAdvance,
        netAmount: netAmount,
        stackCurrency: stackCurrency,
        tripId: tripId,
        redirectToCreate: false,
        expInfo: finalExpInfo,
        fileMap: fileMap,
      };

      if (isSubmitState == 1 && id == undefined) {
        finalData.stackId = savedExpense.expenseStackId;
      }

      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i], files[i].name);
      }

      formData.append("parseParams", JSON.stringify(finalData));

      if (isSubmitState === 1) {
        if (files.length > 0 || documents.length > 0) {
          // Proceed with the API call
          const setLoader = setTimeout(() => {
            setSaveLoader(true);
          }, 2000);
          axios
            .post(
              baseUrl +
                `/timeandexpensesms/projectExpense/save?userId=${loggedUserId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              console.log(res);
              setSavedExpense(res.data);
              setSubmitMsg(true);
              setTimeout(() => {
                setSubmitMsg(false);
              }, 3000);
              setTimeout(() => {
                setIsSubmitted(true);
              }, 3000);
              clearTimeout(setLoader);
              setSaveLoader(false);
            })
            .catch((error) => {
              setSaveLoader(false);
              setStackSaveFail(true);
              setTimeout(() => {
                setStackSaveFail(false);
              }, 3000);
            });
        } else {
          setFileMissing(true);
          setTimeout(() => {
            setFileMissing(false);
          }, 3000);
        }
      } else if (isSubmitState === 0) {
        // Proceed with the API call
        const setLoader = setTimeout(() => {
          setSaveLoader(true);
        }, 2000);
        axios
          .post(
            baseUrl +
              `/timeandexpensesms/projectExpense/save?userId=${loggedUserId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((res) => {
            console.log(res);
            setSavedExpense(res.data);
            setMessage(true);
            setTimeout(() => {
              setMessage(false);
            }, 3000);
            setIsSaved(true);
            clearTimeout(setLoader);
            setSaveLoader(false);
          })
          .catch((error) => {
            setSaveLoader(false);
            setStackSaveFail(true);
            setTimeout(() => {
              setStackSaveFail(false);
            }, 3000);
          });
      }
    } else {
      setIsExpProvided(true);
      setTimeout(() => {
        setIsExpProvided(false);
      }, 3000);
    }
  };

  const [tripId, setTripId] = useState(null);
  const [tripData, setTripData] = useState([]);

  const handleTripInput = (inputValue) => {
    const resId = parseInt(loggedUserId) + 1;
    axios
      .get(
        baseUrl +
          `/timeandexpensesms/projectExpense/tripId?searchStr=${inputValue}&resId=${resId}`
      )
      .then((res) => {
        const data = res.data;
        const transformedData = data.map((trip) => ({
          name: trip.label,
          id: trip.id,
        }));
        setTripData(transformedData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSearch = (value) => {
    const trimmedValue = value.trim();
    handleTripInput(trimmedValue);
  };

  const handleSelect = (item) => {
    setTripId(item.id);
  };

  const noteDate = () => {
    const today = moment();
    const sixMonthsAgo = today.subtract(6, "months").add(4, "days");
    return sixMonthsAgo.format("DD-MMM-YYYY");
  };

  const [deleteMsg, setDeleteMsg] = useState(false);
  const [deleteMsgSuccess, setDeleteMsgSuccess] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [expenseDelPopup, setExpenseDelPopup] = useState(false);

  const ExpenseDeleteConfirmPopup = () => {
    const removeFiles = () => {
      const newFileMap = { ...fileMap };
      const filesToDelete = [];

      Object.keys(newFileMap).forEach((key) => {
        const keyList = key.split("_");
        let expenseTypIdKey = keyList[1];
        if (keyList.length > 3) {
          expenseTypIdKey = `${keyList[1]}_${keyList[2]}`;
        }
        //const [projectIdKey, expenseTypIdKey, dateKey] = key.split("_");

        if (expenseTypIdKey == selectedElement.id) {
          filesToDelete.push(...newFileMap[key]);
          delete newFileMap[key];
        }
      });

      const newFiles = files.filter(
        (file) => !filesToDelete.includes(file.name)
      );

      setFileMap(newFileMap);
      setFiles(newFiles);
    };

    const deleteExpenses = () => {
      const expIds = stackIdData
        ?.filter((i) => i.expense_type_id == selectedElement.id)
        .map((it) => it.id);
      const requestBody = {
        stackId: id,
        Ids: expIds,
        adv: stackAdvance,
        net: netAmount,
      };
      axios
        .post(
          baseUrl + `/timeandexpensesms/projectExpense/deleteExpenses`,
          requestBody
        )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.log(error));
    };

    return (
      <>
        <CModal
          visible={expenseDelPopup}
          style={{ width: "400px" }}
          onClose={() => setExpenseDelPopup(false)}
          backdrop={"static"}
          alignment="center"
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Delete Confirmation</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <span>Are you sure you want to permanently remove this item?</span>
            <hr />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (
                    id !== undefined &&
                    stackIdData
                      .map((it) => it.expense_type_id)
                      .includes(selectedElement.id)
                  ) {
                    deleteExpenses();
                    setStackIdData((prev) =>
                      prev.filter(
                        (item) => item.expense_type_id != selectedElement?.id
                      )
                    );
                    const expIds = stackIdData.map((it) => it.id);
                    if (expIds.length == 1) {
                      setTimeout(() => {
                        setDeleteMsgSuccess(true);
                        setTimeout(() => {
                          setDeleteMsgSuccess(false);
                        }, 3000);
                        navigate("/search/userExpenseHistory");
                        setbtnState("Create");
                        window.location.reload();
                      }, 100);
                    }
                    setSelectedExpenseTypes((prev) =>
                      prev.filter(
                        (item) => item.lkup_name !== selectedElement.lkup_name
                      )
                    );
                    setExpInfo((prev) =>
                      prev.filter((item) => item.expTypId != selectedElement.id)
                    );
                    setExpenseData({});
                    removeFiles();
                    // if (id !== undefined) {
                    //   setExpInfo([]);
                    // }
                    setIsValuesChecked((prev) => ({
                      ...prev,
                      [selectedElement.id]: false,
                    }));
                    setExpenseDelPopup(false);
                  } else {
                    setSelectedExpenseTypes((prev) =>
                      prev.filter(
                        (item) => item.lkup_name !== selectedElement.lkup_name
                      )
                    );
                    setExpInfo((prev) =>
                      prev.filter((item) => item.expTypId != selectedElement.id)
                    );
                    setExpenseData({});
                    removeFiles();
                    // if (id !== undefined) {
                    //   setExpInfo([]);
                    // }
                    setIsValuesChecked((prev) => ({
                      ...prev,
                      [selectedElement.id]: false,
                    }));
                    setExpenseDelPopup(false);
                    setDeleteMsgSuccess(true);
                    setTimeout(() => {
                      setDeleteMsgSuccess(false);
                    }, 3000);
                  }
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => setExpenseDelPopup(false)}
              >
                No
              </button>
            </div>
          </CModalBody>
        </CModal>
      </>
    );
  };

  const DeleteConfirmPopup = () => {
    const deleteExpenses = () => {
      const requestBody = {
        stackId: id,
        Ids: stackIdData.map((it) => it.id),
        adv: stackAdvance,
        net: netAmount,
      };
      axios
        .post(
          baseUrl + `/timeandexpensesms/projectExpense/deleteExpenses`,
          requestBody
        )
        .then((res) => {
          console.log(res);
        })
        .catch((error) => console.log(error));
    };
    return (
      <>
        <CModal
          visible={deletePopup}
          style={{ width: "400px" }}
          onClose={() => setDeletePopup(false)}
          backdrop={"static"}
          alignment="center"
        >
          <CModalHeader className="">
            <CModalTitle>
              <span className="">Delete Confirmation</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {id == undefined ? (
              <span>Are you sure you want to remove selected projects ?</span>
            ) : (
              <span>Are you sure you want to remove selected Expense ?</span>
            )}
            <hr />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (id !== undefined) {
                    deleteExpenses();
                    setTimeout(() => {
                      navigate("/search/userExpenseHistory");
                      setbtnState("Create");
                      window.location.reload();
                    }, 2000);
                  }
                  setProjectRenderData(null);
                  setExpenseTypeRenderData(null);
                  setDisplayTableBody(false);
                  setDeleteMsgSuccess(true);
                  setExpInfo([]);
                  setSelectedExpenseTypes([]);
                  setTimeout(() => {
                    setDeleteMsgSuccess(false);
                  }, 3000);
                  setDeletePopup(false);
                  setIsProjectSelected(false);
                  setStackAdvance(0);
                  setIsValuesChecked({});
                  setExpInfo([]);
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => setDeletePopup(false)}
              >
                No
              </button>
            </div>
          </CModalBody>
        </CModal>
      </>
    );
  };

  const [documentPopup, setDocumentPopup] = useState(false);

  const DocumentPopup = () => {
    const downloadExpensePdf = async (docId, svnRevision, fileName) => {
      try {
        const response = await axios.get(
          baseUrl +
            `/CommonMS/document/downloadFile?documentId=${docId}&svnRevision=${svnRevision}`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    return (
      <>
        <CModal
          visible={documentPopup}
          style={{ width: "300px", height: "200px" }}
          onClose={() => setDocumentPopup(false)}
          backdrop={"static"}
          alignment="center"
        >
          <CModalHeader>
            <CModalTitle>
              <span>Attached Documents</span>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {expDocList.map((it) => (
              <div
                className="mt-2"
                style={{ width: "250px", border: "1px solid silver" }}
                key={it.id}
              >
                <span
                  className="linkSty ellipsis"
                  title={it.file_name}
                  onClick={() =>
                    downloadExpensePdf(
                      it.document_id,
                      it.svn_revision,
                      it.file_name
                    )
                  }
                >
                  {it.file_name}
                </span>
              </div>
            ))}
          </CModalBody>
        </CModal>
      </>
    );
  };

  return (
    <div>
      {message ? (
        <div className="statusMsg success">
          <span>
            <BiCheck style={{ marginTop: "-2px" }} />
            Expense(s) Saved Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {submitMsg ? (
        <div className="statusMsg success">
          <span>
            <BiCheck style={{ marginTop: "-2px" }} />
            Expense(s) Submitted Successfully
          </span>
        </div>
      ) : (
        ""
      )}
      {deleteMsg ? (
        <div className="statusMsg error">
          <span>
            <IoWarningOutline style={{ marginTop: "-2px" }} /> Please select
            project(s) to delete
          </span>
        </div>
      ) : (
        ""
      )}
      {filesMissing ? (
        <div className="statusMsg error">
          <span>
            <IoWarningOutline style={{ marginTop: "-2px" }} /> Receipts are
            missing for some expenses. Please add receipts to Submit.
          </span>
        </div>
      ) : (
        ""
      )}
      {stackSaveFail ? (
        <div className="statusMsg error">
          <span>
            <IoWarningOutline style={{ marginTop: "-2px" }} /> Expense save
            failed.
          </span>
        </div>
      ) : (
        ""
      )}
      {isExpProvided ? (
        <div className="statusMsg error">
          <span>
            <IoWarningOutline style={{ marginTop: "-2px" }} /> Please provide at
            least one expense
          </span>
        </div>
      ) : (
        ""
      )}
      {projectSelectMsg ? (
        <div className="statusMsg error">
          <span>
            <IoWarningOutline style={{ marginTop: "-2px" }} /> Please select a
            project
          </span>
        </div>
      ) : (
        ""
      )}
      {deleteMsgSuccess ? (
        <div className="statusMsg success">
          <span>
            <BiCheck style={{ marginTop: "-2px" }} />
            {"Expense deleted Successfully"}
          </span>
        </div>
      ) : (
        ""
      )}

      <div className="group mb-3 customCard">
        <div className="group-content row">
          <div className="col-md-12 roleTableLegends">
            <span style={{ margin: "0px 0px" }}>
              <BsFillCircleFill size={12} color="#cccccc" />
              Submitted
            </span>
            <span style={{ margin: "0px 6px" }}>
              <BsFillCircleFill size={12} color="#e54c53" />
              Rejected
            </span>
            <span style={{ margin: "0px 6px" }}>
              <BsFillCircleFill size={12} color="#CDE6FE" />
              Approved
            </span>
            <span style={{ margin: "0px 6px" }}>
              <BsFillCircleFill size={12} color="#0080ff" />
              Approved To Pay
            </span>
            <span style={{ margin: "0px 6px" }}>
              <BsFillCircleFill size={12} color="#D9FBB3" />
              Paid
            </span>
            <span style={{ margin: "0px 6px" }}>
              <BsFillCircleFill size={12} color="#009933" />
              Received
            </span>
          </div>

          {(id == undefined || stackIdData[0]?.status_id == 634) && (
            <>
              <div className="col-md-3 mb-2">
                <div className="form-group row ">
                  <label className="col-5" htmlFor="email-input">
                    Date
                  </label>
                  <span className="col-1 p-0 p-0">:</span>
                  <div className="col-6">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholderText={"Billing Start Date"}
                      dateFormat="dd-MMM-yyyy"
                      minDate={new Date(noteDate())}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="country-select">
                    Expense For
                  </label>
                  <span className="col-1 p-0 p-0">:</span>
                  <div className="col-6">
                    <select
                      id="country-select"
                      onChange={(e) => {
                        setExpenseFor(e.target.value);
                      }}
                      onBlur={() => {
                        if (expenseFor == 7) {
                          setFormData((prev) => {
                            return {
                              ...prev,
                              project: projectData[0]?.id,
                            };
                          });
                        }
                        if (expenseFor == 11) {
                          setFormData((prev) => {
                            return {
                              ...prev,
                              project: -1,
                            };
                          });
                        }
                      }}
                    >
                      {expenseForOptions.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.value}
                        </option>
                      ))}
                      {userRoles.includes(481) && (
                        <option value={11}>Organization</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              {expenseFor == 3 && (
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="country-select">
                      Project<span style={{ color: "red" }}>*</span>
                    </label>
                    <span className="col-1 p-0 p-0">:</span>
                    <div className="col-6">
                      <select
                        id="projects"
                        onChange={(e) => {
                          onChangeHandler(e);
                        }}
                        disabled={displayTableBody && expenseFor !== 3}
                        style={{
                          backgroundColor: projectSelectMsg ? "#F2DEDE" : "",
                        }}
                      >
                        <option value="">&lt;&lt;Please Select&gt;&gt;</option>
                        {projectData?.map((d, index) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {expenseFor == 7 && (
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="country-select">
                      Business Unit<span style={{ color: "red" }}>*</span>
                    </label>
                    <span className="col-1 p-0 p-0">:</span>
                    <div className="col-6">
                      <select
                        id="projects"
                        disabled={expenseFor == 7}
                        style={{
                          backgroundColor: projectSelectMsg ? "#F2DEDE" : "",
                        }}
                      >
                        {projectData?.map((d, index) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {expenseFor == 11 && (
                <div className="col-md-3 mb-2">
                  <div className="form-group row">
                    <label className="col-5" htmlFor="country-select">
                      Organization<span style={{ color: "red" }}>*</span>
                    </label>
                    <span className="col-1 p-0 p-0">:</span>
                    <div className="col-6">
                      <select
                        id="projects"
                        disabled={expenseFor == 11}
                        style={{
                          backgroundColor: projectSelectMsg ? "#F2DEDE" : "",
                        }}
                      >
                        <option value={-1}>Prolifics</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-md-3 mb-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="country-select">
                    Currency
                  </label>
                  <span className="col-1 p-0 p-0">:</span>
                  <div className="col-6">
                    <select
                      onChange={(e) => {
                        setCurrencyCode(
                          () =>
                            currencyOptionsData.find(
                              (i) => i.id == e.target.value
                            ).currencyCode
                        );
                        setStackCurrency(e.target.value);
                      }}
                    >
                      {currencyOptionsData.map((d) => (
                        <option value={d.id} selected={d.id == stackCurrency}>
                          {d.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2 mt-2">
                <div className="form-group row">
                  <label className="col-5" htmlFor="name">
                    Trip
                  </label>
                  <span className="col-1 p-0 p-0">:</span>
                  <div className="col-6 autoComplete-container">
                    <ReactSearchAutocomplete
                      name="Trip"
                      id="tripId"
                      placeholder="Type/Press Space"
                      className="AutoComplete "
                      type="Text"
                      items={tripData}
                      showIcon={false}
                      onSearch={handleSearch}
                      onSelect={handleSelect}
                      labelKey="label"
                      valueKey="id"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-2 mt-2">
                <div className="form-group row">
                  <label
                    className="col-5 align-self-start"
                    htmlFor="message-textarea"
                  >
                    Stack Description
                  </label>
                  <span className="col-1 p-0 p-0">:</span>
                  <div className="col-6">
                    <textarea
                      style={{ resize: "none" }}
                      rows={2}
                      className="form-control"
                      id="message-textarea"
                      placeholder="Please Enter Description"
                      required
                      onChange={(e) => setStackDesc(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {id == undefined && (
          <div className="d-flex align-items-center justify-content-center">
            <div>
              <button
                onClick={() => {
                  addHandler();
                }}
                type="button"
                className="btn btn-primary"
                title="Search"
                disabled={addButtonDisable}
              >
                <RiMenuAddLine /> Add{" "}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        {id == undefined ? (
          <div
            style={{
              border: " 1px solid #fff",
              borderRadius: "5px",
              margin: " 5px 0",
              padding: "2px",
              borderColor: "#d7ae09",
              color: "#d7ae09",
              alignItems: "center",
              gap: "2px",
              fontSize: "13px",
            }}
          >
            <span className="bold">
              <SlExclamation
                style={{ marginLeft: "15px", marginRight: "15px" }}
              />{" "}
              Note : &nbsp;
            </span>
            <span>You can add expense from {noteDate()}</span>
          </div>
        ) : (
          <div
            style={{
              border: " 1px solid #fff",
              borderRadius: "5px",
              margin: " 5px 0",
              padding: "2px",
              borderColor: "#d7ae09",
              color: "#d7ae09",
              alignItems: "center",
              gap: "2px",
              fontSize: "13px",
            }}
          >
            <span className="bold">
              <SlExclamation
                style={{ marginLeft: "15px", marginRight: "15px" }}
              />{" "}
              Note : &nbsp;
            </span>
            <span>Changes can't be made once submitted.</span>
          </div>
        )}

        {loader ? (
          <Loader handleAbort={() => setLoader(false)} />
        ) : (
          <div className="group-content row">
            <div className="col-md-12">
              {tableLoader && (
                <ExpensesCreateTable
                  formData={formData}
                  setFormData={setFormData}
                  projectRenderData={projectRenderData}
                  dates={dates}
                  setDates={setDates}
                  expenseTypeRenderData={expenseTypeRenderData}
                  iconState={iconState}
                  setIconState={setIconState}
                  setRates={setRates}
                  setWeekData={setWeekData}
                  setLoader={setLoader}
                  loader={loader}
                  id={id}
                  stackIdData={stackIdData}
                />
              )}

              {expenseTypePopupState && (
                <AddExpensePopup
                  expenseTypePopupState={expenseTypePopupState}
                  setExpenseTypePopupState={setExpenseTypePopupState}
                  expenseTypeOptions={expenseTypeOptions}
                  formData={formData}
                  setFormData={setFormData}
                  dates={dates}
                  setExpenseTypeRenderData={setExpenseTypeRenderData}
                  expenseTypesValues={expenseTypesValues}
                  setExpenseTypesValues={setExpenseTypesValues}
                  setExpensesTypePopup={setExpensesTypePopup}
                  expensesTypePopup={expensesTypePopup}
                  setExpenseTypeId={setExpenseTypeId}
                  setSelectedExpenseTypes={setSelectedExpenseTypes}
                  selectedExpenseTypes={selectedExpenseTypes}
                  iconState={iconState}
                  setIconState={setIconState}
                  isValuesChecked={isValuesChecked}
                  setIsValuesChecked={setIsValuesChecked}
                  selectAll={selectAll}
                  setSelectAll={setSelectAll}
                />
              )}
              {expensesTypePopup && (
                <ExpensesTypePopUp
                  expensesTypePopup={expensesTypePopup}
                  setExpensesTypePopup={setExpensesTypePopup}
                  expenseTypeId={expenseTypeId}
                  currencyOptionsData={currencyOptionsData}
                  country={country}
                  cities={cities}
                  carTypes={carTypes}
                  paidBy={paidBy}
                  airportList={airportList}
                  mobileType={mobileType}
                  expDate={expDate}
                  setExpenseData={setExpenseData}
                  expenseData={expenseData}
                  expInfo={expInfo}
                  projectId={projectId}
                  expName={expName}
                  setFileMap={setFileMap}
                  fileMap={fileMap}
                  setRates={setRates}
                  setFiles={setFiles}
                  isExpenseBillable={isExpenseBillable}
                  expCurrencySymbol={expCurrencySymbol}
                  setExpCurrencySymbol={setExpCurrencySymbol}
                  files={files}
                  id={id}
                  currencyCode={currencyCode}
                  expenseId={expenseId}
                  documents={documents}
                  setDocuments={setDocuments}
                  setExpCurrency={setExpCurrency}
                />
              )}
              {displayTableBody && tableLoader
                ? id !== undefined
                  ? stackIdData.length > 0
                    ? amountStatusDisplay
                    : ""
                  : amountStatusDisplay
                : ""}
              {(id == undefined || stackIdData[0]?.status_id == 634) &&
              tableLoader ? (
                <div className=" form-group col-md-12 col-sm-12 col-xs-12 btn-container center my-3 mb-1">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => {
                      saveProjectExpenses(0);
                    }}
                  >
                    <FaSave />
                    Save
                  </button>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={() => {
                      saveProjectExpenses(1);
                    }}
                  >
                    <BiCheck />
                    Submit
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      if (isProjectSelected) {
                        setDeletePopup(true);
                      } else {
                        setDeleteMsg(true);
                        setTimeout(() => {
                          setDeleteMsg(false);
                        }, 3000);
                      }
                    }}
                  >
                    <ImCross size={"11px"} /> Delete
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
      {saveLoader ? <Loader handleAbort={() => setSaveLoader(false)} /> : ""}
      {deletePopup && <DeleteConfirmPopup />}
      {documentPopup && <DocumentPopup />}
      {expenseDelPopup && <ExpenseDeleteConfirmPopup />}
    </div>
  );
}

export default ExpensesCreate;
