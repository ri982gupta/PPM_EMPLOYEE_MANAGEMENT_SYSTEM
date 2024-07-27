import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AiFillEdit } from "react-icons/ai";
import { AiFillSave } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { environment } from "../../../environments/environment";
import "react-datepicker/dist/react-datepicker.css";
import { AiFillWarning } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import { Pagination } from "@mui/lab";
import { MdOutlineAdd } from "react-icons/md";
import { TfiSave } from "react-icons/tfi";
import { ImCross } from "react-icons/im";
import Loader from "../../Loader/Loader";
import "./ExpenseTypes.scss";
import { FaPlus, FaSave } from "react-icons/fa";

function ExpenseTypes({ urlState, maxHeight1 }) {
  const [respData, setRespData] = useState([]);
  const [state, setState] = useState();
  const [SupervisorValue, setSupervisorValue] = useState("");
  const [PMValue, setPMValue] = useState();
  const [HRValue, setHRValue] = useState();
  const [ITValue, setITValue] = useState();
  const [LDValue, setLDValue] = useState();
  const [FinanceValue, setFinanceValue] = useState();
  const [ProjectValue, setProjectValue] = useState();
  const [BUValue, setBUValue] = useState();
  const [OrgValue, setOrgValue] = useState();
  const [attachmentValue, setattachmentValue] = useState();
  const [addMessage, setAddMessage] = useState(false);
  const [editMessage, setEditMessage] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [valid, setValid] = useState(false);
  const [displayTable, setDisplayTable] = useState(null);
  const [editedValue, setEditedValue] = useState(-1);
  const [displayRowEdit, setDisplayRowEdit] = useState(false);
  const baseUrl = environment.baseUrl;
  const [validationMsg, setValidationMsg] = useState(false);
  const [PageMessageValidation, setPageMessageValidation] = useState(false);
  const [validateExpenselevels, setValidateExpenselevels] = useState(false);

  const [lkupNameValue, setLkupNameValue] = useState("");
  const [ActiveValue, setActiveValue] = useState("");
  const [Supervisordisable, setSupervisordisable] = useState("");
  const [PMDisable, setPMdisable] = useState("");
  const [loader, setLoader] = useState(false);

  const initialPage = 1;
  const abortController = useRef(null);

  const [currentPage, setCurrentPage] = useState(initialPage);

  const loggedUserId = localStorage.getItem("resId");
  const [routes, setRoutes] = useState([]);
  const [dataAccess, setDataAccess] = useState([]);

  let textContent = "Time & Expenses";
  let currentScreenName = ["Expenses", "Add Expense Types"];
  sessionStorage.setItem(
    "breadCrumbs",
    JSON.stringify({
      routes: routes,
      currentScreenName: currentScreenName,
      textContent: textContent,
    })
  );
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -52) + "px"
  );
  const [getData, setGetData] = useState(19);
  const [currentItem, setCurrentItem] = useState(0);
  const [pageCount, setpageCount] = useState(1);
  const [itemOffSet, setItemOffSet] = useState(0);
  const itemPerPage = getData;
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(itemPerPage);
  const [finalRow, setFinalRow] = useState(itemPerPage);
  const totalRows = respData.length;
  const Firstrow = itemOffSet + 1;
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    setItemOffSet(startIndex);
    setStartIndex(startIndex);
    setEndIndex(endIndex);
  }, [currentPage, itemPerPage]);
  const handlePageClick = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const newOffSet = (currentPage - 1) * itemPerPage;
    setItemOffSet(newOffSet);
  }, [currentPage, itemPerPage]);

  useEffect(() => {
    const endOffset = itemOffSet + itemPerPage;
    const length = respData.slice(itemOffSet, endOffset);

    if (endOffset > totalRows) {
      setFinalRow(totalRows);
    } else {
      setFinalRow(endOffset);
    }
    setCurrentItem(length);
    setpageCount(Math.ceil(respData.length / itemPerPage));
    displayTableFnc(length);
  }, [respData, itemOffSet, itemPerPage, getData, pageCount]);

  /////breadcrumbs
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
            // submenu.display_name !== "Lock Timesheets" &&
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

  useEffect(() => {
    getMenus();
    getUrlPath();
  }, []);
  const getUrlPath = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/CommonMS/security/authorize?url=/projectExpense/expenseTypes/&userId=${loggedUserId}`,
    }).then((res) => {
      console.log(res, "urlResponse");
    });
  };
  const getDocumentsPermission = () => {
    axios({
      method: "GET",
      url:
        baseUrl +
        // `/CommonMS/master/getMenus?loggedUserId=${loggedUserId}`,
        `/CommonMS/master/getBenchMtericsMenus?loggedUserId=${loggedUserId}&Cont=Expense`,
    }).then((resp) => {
      let data = resp.data;
      data.forEach((item) => {
        if (item.display_name === textContent) {
          setRoutes([item]);
        }
      });

      const ExpenseSubMenu = data.find(
        (item) => item.display_name === "Expense Types"
      );
      // .subMenus.find((subMenu) => subMenu.display_name === "Fixed Price - Create");

      const accessLevel = ExpenseSubMenu ? ExpenseSubMenu.access_level : null;
      setDataAccess(accessLevel);
    });
  };
  useEffect(() => {
    getDocumentsPermission();
  }, []);

  ///////////axios for getting Details in to the table/////////////////////
  const getStakeHoldersDetails = () => {
    setLoader(false);
    abortController.current = new AbortController();

    axios({
      method: "get",
      url: baseUrl + `/timeandexpensesms/ExpenseTypes/getData`,
      signal: abortController.current.signal,
    }).then((resp) => {
      setRespData(resp.data);
      setLoader(false);
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    });
  };

  const handleAbort = () => {
    abortController.current && abortController.current.abort();
    setLoader(false);
  };

  useEffect(() => {
    getStakeHoldersDetails();
  }, []);

  useEffect(() => {
    displayTableFnc();
  }, [
    ProjectValue,
    BUValue,
    SupervisorValue,
    lkupNameValue,
    PMValue,
    ITValue,
    HRValue,
    LDValue,
    FinanceValue,
    OrgValue,
    attachmentValue,
    ActiveValue,
  ]);
  useEffect(() => {
    displayTableFnc();
  }, [displayRowEdit, respData, editedValue]);
  const initialData = []; // Empty array for initial data

  const addRowEditFnc = () => {
    setDisplayRowEdit(true);
    if (!valid) {
      setValid(true);
      setButtonDisabled(false);
    }
    setCurrentPage(initialPage); // Update currentPage to initialPage value

    // Reset the state variables for input fields to empty values
    setLkupNameValue("");
    setSupervisorValue("");
    setPMValue("");
    setHRValue("");
    setITValue("");
    setLDValue("");
    setFinanceValue("");
    setProjectValue("");
    setBUValue("");
    setOrgValue("");
    setattachmentValue("");
    setActiveValue("");

    setRespData([...initialData, ...respData]);

    // Reset the pagination state variables
    setItemOffSet(0);
    setStartIndex(0);
    setEndIndex(itemPerPage);
    setFinalRow(itemPerPage);
  };

  // ...

  useEffect(() => {
    const endOffset = itemOffSet + itemPerPage;
    const length = respData.slice(itemOffSet, endOffset);

    if (endOffset > totalRows) {
      setFinalRow(totalRows);
    } else {
      setFinalRow(endOffset);
    }
    setCurrentItem(length);
    setpageCount(Math.ceil(respData.length / itemPerPage));
    displayTableFnc(length);
  }, [respData, itemOffSet, itemPerPage, pageCount]);

  const closeEditedRowFnc = () => {
    setDisplayRowEdit((prev) => false);
    setEditedValue(-1);
    setValidationMsg(false);
    setPageMessageValidation(false);
    setValidateExpenselevels(false);
    setValid(false);
    setButtonDisabled(true);
  };

  const editHandler = (element, index) => {
    setEditedValue(index);
    setState(element);
    setValid(true);
    setButtonDisabled(false);
  };
  let tabHeaders = [
    "lkupName",
    "Supervisor",
    "PM",
    "IT",
    "HR",
    "LD",
    "Finance",
    "Project",
    "BU",
    "Org",
    "attachment",
    "isActive",
    "action",
  ];
  function getTitle(value) {
    if (value === 1) {
      return " Approval is required";
    } else if (value === 0) {
      return " Approval is not required";
    } else if (value == true) {
      return "True";
    } else if (value === false) {
      return " False";
    } else {
      return value;
    }
  }

  const displayTableFnc = () => {
    setDisplayTable(() => {
      let data = respData;

      let fData = [];
      if (displayRowEdit) {
        fData = [{ ...tabHeaders }, ...data];
      } else {
        fData = respData;
      }

      const currentData = fData.slice(startIndex, endIndex);
      return currentData.length === 0 ? (
        <tr>
          <td colSpan={17} align="center">
            No Records Found
          </td>
        </tr>
      ) : (
        currentData.map((element, index) => {
          let tabData = [];
          if (
            (displayRowEdit && index === 0) ||
            (editedValue !== -1 && editedValue === index)
          ) {
            tabHeaders.forEach((inEle, inInd) => {
              if (inEle === "action") {
                tabData.push(
                  <td
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <AiFillSave
                      title={"Save"}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        saveExpenseTypes();
                      }}
                    />{" "}
                    &nbsp;
                    <AiFillCloseCircle
                      title={"Cancel"}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        closeEditedRowFnc();
                      }}
                    />
                  </td>
                );
              } else if (inEle === "lkupName") {
                tabData.push(
                  <td>
                    <input
                      id={inEle}
                      type="text"
                      className="textBxBrdrRd inputCss validateErr "
                      defaultValue={element["lkupName"]}
                      onChange={(e) => {
                        setLkupNameValue(() => ({
                          ["lkupName"]: e.target.value,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "Supervisor") {
                tabData.push(
                  <td
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      className="textBxBrdrRd inputCss validateErr disabledIcon"
                      defaultChecked={element["Supervisor"] == 1 ? true : false}
                      disabled={
                        PMValue?.PM == undefined && element["PM"] == 1
                          ? true
                          : PMDisable == true
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        setSupervisordisable(e.target.checked);
                        setSupervisorValue(() => ({
                          ["Supervisor"]: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "PM") {
                tabData.push(
                  <td
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      disabled={
                        SupervisorValue?.Supervisor == undefined &&
                        element["Supervisor"] == 1
                          ? true
                          : Supervisordisable == true
                          ? true
                          : false
                      }
                      className="textBxBrdrRd inputCss validateErr disabledIcon"
                      defaultChecked={element["PM"] == 1 ? true : false}
                      onChange={(e) => {
                        setPMdisable(e.target.checked);
                        setPMValue(() => ({
                          ["PM"]: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "IT") {
                tabData.push(
                  <td
                    id={inEle}
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultChecked={element["IT"] == 1 ? true : false}
                      onChange={(e) => {
                        setITValue(() => ({
                          ["IT"]: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "HR") {
                tabData.push(
                  <td
                    id={inEle}
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultChecked={element["HR"] == 1 ? true : false}
                      onChange={(e) => {
                        setHRValue(() => ({
                          ["HR"]: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "LD") {
                tabData.push(
                  <td
                    id={inEle}
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultChecked={element["LD"] == 1 ? true : false}
                      onChange={(e) => {
                        setLDValue(() => ({
                          ["LD"]: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "Finance") {
                tabData.push(
                  <td
                    id={inEle}
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultChecked={element["Finance"] == 1 ? true : false}
                      onChange={(e) => {
                        setFinanceValue(() => ({
                          ["Finance"]: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "Project") {
                tabData.push(
                  <td
                    id={inEle}
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultChecked={element["Project"] == 1 ? true : false}
                      onChange={(e) => {
                        setProjectValue((prevValue) => ({
                          ...prevValue,
                          Project: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "BU") {
                tabData.push(
                  <td
                    id={inEle}
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultChecked={element["BU"] === 1 ? true : false}
                      onChange={(e) => {
                        setBUValue(() => ({
                          ["BU"]: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "Org") {
                tabData.push(
                  <td
                    id={inEle}
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultChecked={element["Org"] == 1 ? true : false}
                      onChange={(e) => {
                        setOrgValue(() => ({
                          ["Org"]: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "attachment") {
                tabData.push(
                  <td
                    id={inEle}
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <input
                      type="checkbox"
                      id={inEle}
                      className="textBxBrdrRd inputCss editableSelectHeight validateErr"
                      defaultChecked={element["attachment"] == 1 ? true : false}
                      onChange={(e) => {
                        setattachmentValue(() => ({
                          ["attachment"]: e.target.checked,
                        }));
                      }}
                    />
                  </td>
                );
              } else if (inEle === "isActive") {
                tabData.push(
                  <td
                    id={inEle}
                    key={inInd}
                    style={{
                      textAlign: "center",
                    }}
                    title={element[inEle]}
                  >
                    <select
                      id={inEle}
                      onChange={(e) => {
                        setActiveValue(e.target.value);
                      }}
                    >
                      <option value="1" selected={element["isActive"] == true}>
                        True
                      </option>
                      <option value="0" selected={element["isActive"] == false}>
                        False
                      </option>
                    </select>
                  </td>
                );
              } else {
                tabData.push(<td id={inEle}> {element[inEle]}</td>);
              }
            });
          } else {
            tabHeaders.forEach((inEle, inInd) => {
              if (inEle == "action") {
                {
                  // dataAccess === 1000 &&
                  tabData.push(
                    <td>
                      <div align="center">
                        <span>
                          <AiFillEdit
                            style={{ cursor: "pointer" }}
                            title={"Edit"}
                            className="pointerCursor"
                            onClick={(e) => {
                              editHandler(element, index);
                            }}
                          />
                        </span>
                      </div>
                    </td>
                  );
                }
              } else {
                tabData.push(
                  <td
                    align={inInd > 11 ? "left" : inInd > 0 ? "center" : "left"}
                    title={getTitle(element[inEle])}
                  >
                    {(() => {
                      switch (element[inEle]) {
                        case 1:
                          return "YES";
                        case 0:
                          return "X";
                        case true:
                          return "True";
                        case false:
                          return "False";
                        default:
                          return String(element[inEle]).trim();
                      }
                    })()}
                  </td>
                );
              }
            });
          }
          return <tr key={index}>{tabData}</tr>;
        })
      );
    });
  };

  const saveExpenseTypes = () => {
    const data = {
      id: state?.id,
      lkup_name:
        lkupNameValue?.lkupName == undefined
          ? state?.lkupName
          : lkupNameValue?.lkupName,
      is_active:
        ActiveValue == undefined || ActiveValue == "" || ActiveValue == null
          ? state?.isActive == true
            ? 1
            : 0
          : ActiveValue == true
          ? 1
          : 0,
      is_attachment:
        attachmentValue?.attachment == undefined
          ? state?.attachment
          : attachmentValue?.attachment === true
          ? 1
          : 0,
      sort_order: 1,
      is_bu:
        BUValue?.BU == undefined ? state?.BU : BUValue?.BU === true ? 1 : 0,
      is_org:
        OrgValue?.Org == undefined
          ? state?.Org
          : OrgValue?.Org === true
          ? 1
          : 0,
      is_project:
        ProjectValue?.Project == undefined
          ? state?.Project
          : ProjectValue?.Project === true
          ? 1
          : 0,
      is_editable: 1,
      Supervisor:
        SupervisorValue?.Supervisor == undefined
          ? state?.Supervisor
          : SupervisorValue?.Supervisor == true
          ? 1
          : 0,
      Finance:
        FinanceValue?.Finance == undefined
          ? state?.Finance
          : FinanceValue?.Finance == true
          ? 1
          : 0,
      PM: PMValue?.PM == undefined ? state?.PM : PMValue?.PM === true ? 1 : 0,
      IT: ITValue?.IT == undefined ? state?.IT : ITValue?.IT === true ? 1 : 0,
      HR: HRValue?.HR == undefined ? state?.HR : HRValue?.HR === true ? 1 : 0,
      LD: LDValue?.LD == undefined ? state?.LD : LDValue?.LD === true ? 1 : 0,
    };

    if ([undefined, ""].includes(data.lkup_name)) {
      setValidationMsg(true);
      return;
    }

    let secondValidation = [
      data.Supervisor,
      data.Finance,
      data.PM,
      data.IT,
      data.HR,
      data.LD,
    ];

    if (secondValidation.includes(1) == false) {
      setPageMessageValidation(true);
      setValidationMsg(false);

      return;
    }

    let thirdValidation = [data.is_bu, data.is_org, data.is_project];

    if (thirdValidation.includes(1) == false) {
      setValidateExpenselevels(true);
      setPageMessageValidation(false);
      setValidationMsg(false);
      return;
    }

    if (editedValue !== -1) {
      axios({
        method: "post",
        url: baseUrl + `/timeandexpensesms/ExpenseTypes/postingdata`,
        data: data,
      }).then((response) => {
        getStakeHoldersDetails();
        setDisplayRowEdit(false);
        setValidationMsg(false);
        setPageMessageValidation(false);
        setEditMessage(true);
        setTimeout(() => {
          setEditMessage(false);
        }, 3000);
        setEditedValue(-1);
        setValidateExpenselevels(false);
        setValid(false);
        setButtonDisabled(true);
        setLkupNameValue("");
        setattachmentValue("");
        setBUValue("");
        setOrgValue("");
        setProjectValue("");
        setSupervisorValue("");
        setFinanceValue();
        setPMValue();
        setITValue();
        setHRValue();
        setLDValue();
        setPMdisable();
        setSupervisordisable("");
        setState();
      });
    }
    if (displayRowEdit == true) {
      axios({
        method: "post",
        url: baseUrl + `/timeandexpensesms/ExpenseTypes/postingdata`,

        data: {
          lkup_name: lkupNameValue?.lkupName,
          is_active: ActiveValue == "" ? 1 : ActiveValue,
          is_attachment: attachmentValue?.attachment === true ? 1 : 0,
          sort_order: 1,
          is_bu: BUValue?.BU === true ? 1 : 0,
          is_org: OrgValue?.Org === true ? 1 : 0,
          is_project: ProjectValue?.Project === true ? 1 : 0,
          is_editable: 1,
          Supervisor: SupervisorValue?.Supervisor === true ? 1 : 0,
          Finance: FinanceValue?.Finance == true ? 1 : 0,
          PM: PMValue?.PM === true ? 1 : 0,
          IT: ITValue?.IT === true ? 1 : 0,
          HR: HRValue?.HR === true ? 1 : 0,
          LD: LDValue?.LD === true ? 1 : 0,
        },
      }).then((response) => {
        getStakeHoldersDetails();
        setDisplayRowEdit(false);
        setEditedValue(-1);
        setValidationMsg(false);
        setValidateExpenselevels(false);
        setAddMessage(true);
        setTimeout(() => {
          setAddMessage(false);
        }, 3000);
        setValid(false);
        setButtonDisabled(true);
        setLkupNameValue("");
        setActiveValue("");
        setattachmentValue("");
        setBUValue("");
        setOrgValue("");
        setProjectValue("");
        setSupervisorValue("");
        setFinanceValue("");
        setPMValue("");
        setITValue("");
        setHRValue("");
        setLDValue("");
        setPageMessageValidation(false);
        setPMdisable("");
        setSupervisordisable("");
      });
    }
  };

  return (
    <div>
      {addMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Expenses Saved Successfully"}
        </div>
      ) : (
        ""
      )}
      {editMessage ? (
        <div className="statusMsg success">
          <BiCheck />
          {"Expenses Updated Successfully"}
        </div>
      ) : (
        ""
      )}
      {validationMsg ? (
        <div className="statusMsg error">
          <span>
            <AiFillWarning />
            &nbsp;
            {"Please provide Expense Name"}
          </span>
        </div>
      ) : (
        ""
      )}
      {PageMessageValidation ? (
        <div className="statusMsg error">
          <span>
            <AiFillWarning />
            &nbsp;
            {"Please provide atleast one WorkFlow"}
          </span>
        </div>
      ) : (
        ""
      )}
      {validateExpenselevels ? (
        <div className="statusMsg error">
          <span>
            <AiFillWarning />
            &nbsp;
            {"Please provide atleast one Expense Type Levels"}
          </span>
        </div>
      ) : (
        ""
      )}

      <div className=" customCard ">
        <div className="col-md-12 collapseHeader"></div>
        <div className="darkHeader">
          <div className="col-md-12 no-padding Expense-All-Types">
            {loader ? <Loader handleAbort={handleAbort} /> : ""}
            <table className="table table-bordered table-striped expenseTypeTable primeReactDataTable">
              <thead>
                <tr>
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    Expense
                  </th>
                  <th colSpan={6} style={{ textAlign: "center" }}>
                    Workflow Approvals
                  </th>
                  <th colSpan={3} style={{ textAlign: "center" }}>
                    Expense Type Levels
                  </th>
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    Attachment
                  </th>
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    Is Active
                  </th>
                  <th rowSpan={2} style={{ textAlign: "center" }}>
                    Action
                  </th>
                </tr>
                <tr>
                  <th className="pointerCursor" style={{ textAlign: "center" }}>
                    Supervisor
                  </th>
                  <th className="pointerCursor" style={{ textAlign: "center" }}>
                    PM
                  </th>
                  <th className="pointerCursor" style={{ textAlign: "center" }}>
                    IT
                  </th>
                  <th className="pointerCursor" style={{ textAlign: "center" }}>
                    HR
                  </th>
                  <th className="pointerCursor" style={{ textAlign: "center" }}>
                    L&D
                  </th>
                  <th className="pointerCursor" style={{ textAlign: "center" }}>
                    Finance
                  </th>
                  <th className="pointerCursor" style={{ textAlign: "center" }}>
                    Project
                  </th>
                  <th className="pointerCursor" style={{ textAlign: "center" }}>
                    BU
                  </th>
                  <th className="pointerCursor" style={{ textAlign: "center" }}>
                    Org
                  </th>
                </tr>
              </thead>
              <tbody>{displayTable}</tbody>
            </table>
          </div>
        </div>
        <div className="pagination-and-btn-container-events-wrapper">
        <div
          className="pagination-btn" >
          <label style={{ align: "left" }}>
            <Pagination
              count={Math.ceil(respData.length / itemPerPage)}
              page={currentPage}
              onChange={handlePageClick}
              showFirstButton
              showLastButton
            />
          </label>
          </div>
          <div className="btn-container-events">
            <button
              className="btn btn-primary"
              disabled={valid}
              title={"Add new row"}
              onClick={(e) => {
                addRowEditFnc();
              }}
            >
              <FaPlus /> Add
            </button>
            <button
              className="btn btn-primary"
              disabled={buttonDisabled}
              title={"Save row"}
              onClick={() => {
                saveExpenseTypes();
              }}
            >
              <FaSave /> Save
            </button>
            <button
              className="btn btn-secondary"
              title={"Cancel row editing"}
              disabled={buttonDisabled}
              onClick={(e) => {
                closeEditedRowFnc();
              }}
            >
              <ImCross fontSize={"11px"} /> Cancel
            </button>
          </div>
        
        </div>
        {/* {dataAccess == 1000 && ( */}
      
        {/* )} */}
      </div>
    </div>
  );
}

export default ExpenseTypes;
