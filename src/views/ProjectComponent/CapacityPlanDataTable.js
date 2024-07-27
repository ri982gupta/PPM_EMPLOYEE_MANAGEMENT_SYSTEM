import React, { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
// import { getTableData } from "./CSATSurveyQuestionsData";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import "primeflex/primeflex.css";
import DatePicker from "react-datepicker";
import { environment } from "../../environments/environment";
import axios from "axios";
import moment from "moment";
import {
  MdOutlineAdd,
  MdOutlineCancelPresentation,
  MdOutlinePlaylistAdd,
} from "react-icons/md";
import {
  AiFillDelete,
  AiFillEdit,
  AiFillWarning,
  AiOutlineLeftSquare,
  AiOutlinePlusSquare,
  AiOutlineRightSquare,
} from "react-icons/ai";
import { ImCross } from "react-icons/im";
import "./CapacityPlan.scss";
import { TfiSave } from "react-icons/tfi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import CapacityPlanResource from "./CapacityPlanResource";
import CapacityPlanDeletePopup from "./CapacityPlanDeletePopup";
import { GoCalendar } from "react-icons/go";
import CapacityPlanTotalResCalender from "./CapacityPlanTotalResCalender";
import CapactityPlanEditableTable from "./CapactityPlanEditableTable";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import "./CapacityPlanDataTable.scss"

function CapacityPlanDataTable(props) {
  const {
    Data,
    errorMsg,
    setAddErrMsg,
    setErrData,
    addErrMsg,
    setCalenderPayload,
    calenderPayload,
    calenderTableData,
    dispCalender,
    setDispCalender,
    projectData,
    setTableData,
    projectId,
    loggedUserId,
    getTableData,
    setStatus,
    setDeleteMessage,
    setEditMessage,
    setAddMessage,
    setAddResMessage,
    setEditResMessage,
    setDeleteResourceMessage,
    dailyhrsRange,
    setDailyhrsRange,
    setErrorMsg,
    validateproject,
    setValidateproject,
    setDupRoleName,
    setDupliRole,
    grp2Items,
    setIsReloadedTableData
  } = props;
  // const [Data, setData] = useState([]);
  const [subRowData, setSubRowData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const [flag, setFlag] = useState(false);
  const dataObject = grp2Items?.find(
    (item) => item?.display_name === "Capacity Plan"
  );
  const [buttonDisabled, setButtonDisabled] = useState(true);
  // const [validateproject, setValidateproject] = useState(false);
  const [country, setCountry] = useState([]);
  const [subrows, setSubrows] = useState([]);
  const dates = {
    fromDate: moment().startOf("month").format("YYYY-MM-DD"),
    toDate: moment().startOf("month").add("month", 0).format("YYYY-MM-DD"),
  };
  const [dt, setDt] = useState(dates);
  const [month, setMonth] = useState(moment(dt.toDate).toDate());

  const [confirminnermsg, setConfirminnerMsg] = useState("");
  const [costFalg, setCostFlag] = useState(false);
  const [costRowData, setCostRowData] = useState([]);
  // console.log(costRowData)
  const [totalEffortHours, setTotalEffortHours] = useState(0);
  const [totalallochrs, setTotalAllocHrs] = useState(0);
  const [searchResource, setSearchResource] = useState(false);
  const [resName, setResName] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [uid, setUid] = useState(0);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [deleteData, setDeleteData] = useState([]);
  const [allocType, setAllocType] = useState([]);
  const [roleRateCost, setRoleRateCost] = useState([]);
  const [roleDisp, setRoleDisp] = useState("");
  const [valid, setValid] = useState(false);
  const [role, setRole] = useState([]);
  const [selectedObjForCapPlanEdit, setSelectedObjForCapPlanEdit] = useState({});
  const [showCapacityPlanEditable, setShowCapacityPlanEditable] = useState(false);
  const [capacityPlanEditableTableData, setCapacityPlanEditableTableData] = useState([]);

  const editedRef = useRef({});

  let container = document.createElement("div");
  container.innerHTML = projectData[0]?.currency;

  const [finalData, setFinalData] = useState(Data);
  const [finalDataCopy, setFinalDataCopy] = useState(Data);
  const [uniqueMessage, setUniqueMessage] = useState(false);
  const baseUrl = environment.baseUrl;
  const materialTableElement = document.getElementsByClassName(
    "childOne"
  );
  const maxHeight1 = useDynamicMaxHeight(materialTableElement, "fixedcreate") -46;
  document.documentElement.style.setProperty(
    "--dynamic-value",
    String(maxHeight1 -207) + "px"
  );
  useEffect(() => {
    let sum1 = 0;
    let sum2 = 0;
    Data.forEach((row) => {
      sum1 += row.effortHours;
      sum2 += row.roleAllochrs;
    });
    setTotalEffortHours(sum1);
    setTotalAllocHrs(sum2);

    // setTimeout(() => {
    //   console.log("in line 154-----")
    //   domManpi();
    // }, 500);
  }, []);

  const numberWithCommas = (x) => {
    var number = String(x);

    if (number.includes(".")) {
      var decimalNumbers = number;
      var num = Number(decimalNumbers);
      let FdN = num != null && num.toFixed(2);
      let final = FdN.split(".");
      final[0] = final[0].replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",");
      return final.join(".");
    } else {
      // Add ".00" to non-decimal values
      return number != null
        ? number.replace(/(?<=\d)(?=(\d{3})+(?!\d|\.))/g, ",") + ".00"
        : "";
    }
  };

  // const domManpi = () => {
  //   let dt = document.getElementsByClassName("p-datatable-tbody")[0].children;
  //   let ele = dt[dt.length - 1];
  //   let innerChilds = ele.children;
  //   let celTd = innerChilds[innerChilds.length - 2];
  //   celTd?.removeChild(celTd.lastElementChild);
  // };

  const domManpi = () => {
    let paginator = document.getElementsByClassName(
      "p-paginator-element p-link"
    );
    editing();
    for (let i = 0; i < paginator.length; i++) {
      paginator[i].addEventListener(
        "click",

        function (params) {
          // alert("hello");
          editing();
        },

        true
      );
    }
  };

  const editing = () => {
    let editableEle = null;
    setTimeout(() => {
      let dt = document.getElementsByClassName("p-datatable-tbody")[0].children;
      console.log("in line 177");
      let ele = dt[dt.length - 1];
      let lastBeforeEle = dt[dt.length - 2];
      let innerChilds = ele.children;
      let lastBeforeEleInnerChilds = lastBeforeEle.children;

      if (innerChilds[4]?.innerText == "") {
        console.log("in line 213-------");
        let celTd = innerChilds[innerChilds.length - 2];
        editableEle = celTd.lastElementChild;
        celTd?.removeChild(celTd.lastElementChild);
      }
    }, 500);
  };

  const Reset = () => {
    // console.log("clicked on cancel");
    document.getElementsByClassName("p-row-editor-cancel p-link")[0]?.click();
    setValidateproject(false);
    setValid(false);
    setButtonDisabled(true);
  };

  const Save = () => {
    document
      .getElementsByClassName("p-row-editor-save-icon pi pi-fw pi-check")[0]
      ?.click();

    // console.log("saved");
  };

  useEffect(() => {
    getAllocationDropdown();
    getRoleData();
    getCountries();
    // if (costFalg == true) {
    //   getRoleCountryRate(costRowData)

    // }
  }, []);

  const getAllocationDropdown = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/CapacityPlan/getAllocationDropdown`,
    }).then(function (response) {
      var resp = response.data;
      setAllocType(resp);
    });
  };

  const getRoleCountryRate = (rowData, e) => {
    // console.log(costRowData, "getRoleCountryRate")
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/CapacityPlan/getRoleCountryRate?roleTypeId=${rowData}&customerId=${projectData[0]?.customer_id}&countryId=${e}&currencyId=${projectData[0]?.currency_id}`,
    }).then(function (response) {
      var resp = response.data;
      console.log("in line 261--------");
      editedRef.current["hourCost"] = resp[0]?.cost;
      editedRef.current["hourRate"] = 0;

      // document.getElementsByName("hourRate" + rowData.rowData.id?.toString())[0].value = 0;
      console.log(editedRef.current, resp[0]?.cost);

      setRoleRateCost(resp);
    });
  };

  const getRoleData = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/stakeholders/getRoles`,
    }).then(function (response) {
      let type = [];
      let data = response.data;
      data.length > 0 &&
        data.forEach((e) => {
          let TypeObj = {
            label: e.display_name,
            value: e.id,
          };
          type.push(TypeObj);
        });

      setRole(data);
    });
  };

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
        setCountry(data);
      })
      .catch((error) => console.log(error));
  };

  const subtractHandler = () => {
    const newFromDate = moment()
      .subtract(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");
    setCalenderPayload((prevPayload) => ({
      ...prevPayload,
      FromDt: newFromDate,
    }));

    const newToDate = moment(dt.toDate)
      .subtract("month", 1)
      .format("YYYY-MM-DD");
  };
  // console.log(Data, "--------data")

  const addCalenderHandler = () => {
    const newFromDate = moment(calenderPayload.FromDt)
      .add(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");

    const newToDate = moment(dt.toDate).add("month", 1).format("YYYY-MM-DD");

    setCalenderPayload((prevPayload) => ({
      ...prevPayload,
      FromDt: newFromDate,
    }));
    // setMonth(moment(newToDate).toDate());
  };

  const addHandler = () => {
    // console.log("row added")
    // let daa = document.getElementsByClassName(
    //     "p-paginator-first p-paginator-element p-link"
    // )[0];

    // daa.click();
    if (!valid) {
      // setClicked(true)
      // setCancelClicked(false);
      // setSaveClicked(false);
      setValid(true);
      setButtonDisabled(false);
    }
    console.log(projectData, "in add");
    // debugger;
    console.log(projectData[0]?.plandStartDate);
    // debugger
    const data = {
      // expand: "",
      roleType: "",
      // resIcon: "",
      busUnit: "",
      country: "",
      countryId: "",
      hourRate: 0,
      hourCost: roleRateCost[0]?.cost == undefined ? 0 : roleRateCost[0]?.cost,
      plannedStartDt: moment(projectData[0]?.plandStartDate)._d,
      plannedEndDt: moment(projectData[0]?.plandEndDate)._d,
      effortHours: 0.0,
      allocHrs: "",
    };
    let dt = [];
    dt.push(data);
    // console.log("in line 291");
    // setProducts([...dt, ...products]);

    setTableData([...dt, ...Data]);
    // console.log("in line 293");
  };

  let count = Data.length;

  // console.log(count);

  const allowExpansion = (rowData) => {
    return (
      // <span className="col-2">
      rowData.subrows?.length >= 0
      // </span>
    );
  };

  let headerGroup = (
    <ColumnGroup>
      <Row>
        <Column />
        <Column header="Role & Resource" alignHeader={"center"} />
        <Column />
        <Column header="Business Unit" alignHeader={"center"} />
        <Column header="Country" alignHeader={"center"} />
        <Column header="Work Location" alignHeader={"center"} />
        <Column header="Billing Rate/Hr" alignHeader={"center"} />
        <Column header="Cost/Hr" alignHeader={"center"} />
        <Column header="From Date" alignHeader={"center"} />
        <Column header="To Date" alignHeader={"center"} />
        <Column header="Demand Hrs" alignHeader={"center"} />
        <Column header="Alloc Hrs" alignHeader={"center"} />
        <Column header="Daily Alloc Hrs" alignHeader={"center"} />
        <Column header="Alloc Type" alignHeader={"center"} />
        <Column header="Approval Status" alignHeader={"center"} />
        <Column header="Actions" alignHeader={"center"} />
        <Column />
      </Row>
      <Row />
    </ColumnGroup>
  );

  let sideArrow = document.getElementsByClassName(
    "p-paginator-next p-paginator-element p-link"
  );
  let sideDoubleArrow = document.getElementsByClassName(
    "p-paginator-last p-paginator-element p-link"
  );
  const removeFirstRowIfEmpty = (prod) => {
    Object.keys(prod)?.forEach((d) => {
      if (["", null, undefined, " "].includes(prod[d])) {
        // alert("hello");
        setTableData(Data.slice(1));
        setValid((prev) => !prev);
        return;
      }
    });
  };

  useEffect(() => {
    // if (Data[0]?.roleType != "") {
    //   domManpi();
    // }

    // console.log("in line 376");
    // console.log(products);
    let prod = Data[0];
    sideArrow[0]?.addEventListener("click", function () {
      removeFirstRowIfEmpty(prod);
    });

    sideDoubleArrow[0]?.addEventListener("click", function () {
      // alert("hello double");
      removeFirstRowIfEmpty(prod);
    });

    if (Data[0]?.roleType == "") {
      document.getElementsByClassName("p-row-editor-init p-link")[0]?.click();

      setTimeout(() => {
        document
          .getElementsByClassName("p-row-editor-cancel p-link")[0]
          ?.addEventListener(
            "click",
            function (e) {
              if (Data[0]?.roleType == "") {
                setTableData(Data.slice(1, Data.length));
                setButtonDisabled(true);
                setValid(false);
                setValidateproject(false);
              }
            },

            true
          );
      }, 200);
    }
    // setTimeout(() => {
    //   console.log("in line 471------")
    //   domManpi(Data);
    // }, 251);
    // else {
    //   setTimeout(() => {
    //     console.log("in line 476------")

    //     domManpi();
    //   }, 500);
    // }
  }, [Data]);

  const onRowEditComplete = (e) => {
    // console.log(e, "data in line 512");
    let _products = [...Data];
    let newData = e;
    // _products[index] = newData;
    // console.log(newData, "newdata");
    // console.log(formEditData)
    setTableData(_products);
    // getRoleCountryRate(e.newData)
    console.log(newData.id, "--newdata");
    postData(e.newData);
    ///////---------post data

    {
      newData.id != "" ? console.log("put") : console.log("post");
    }
  };

  const postData = (rowData) => {
    let checkData = {
      // id: rowData.id == "" || rowData.id == null ? "" : rowData.id,
      roleTypeId:
        rowData.roleTypeId == "" || rowData.roleTypeId == null
          ? "345"
          : rowData.roleTypeId,
      plannedStartDt: moment(rowData.plannedStartDt).format("yyyy-MM-DD"),
      plannedEndDt: moment(rowData.plannedEndDt).format("yyyy-MM-DD"),
      countryId: rowData?.countryId,
      hourRate:
        typeof editedRef.current.hourRate == "object"
          ? editedRef.current.hourRate.value
          : typeof editedRef.current.hourRate == "string"
            ? editedRef.current.hourRate
            : rowData.hourRate,
      hourcost:
        editedRef.current.hourCost == ""
          ? roleRateCost[0]?.cost
          : typeof editedRef.current.hourCost == "object"
            ? editedRef.current.hourCost.value
            : roleRateCost[0]?.cost == 0 ||
              roleRateCost[0]?.cost == "" ||
              editedRef.current.hourCost == 0 ||
              editedRef.current.hourCost != ""
              ? editedRef.current.hourCost
              : roleRateCost[0]?.cost,
      effortHours: rowData.effortHours,
    };

    console.log(
      rowData.hourRate,
      checkData,

      editedRef.current.hourRate.value,
      editedRef.current.hourCost,
      typeof editedRef.current.hourRate,
      editedRef.current.hourCost.value,
      editedRef.current.hourRate,
      "checkdata"
    );
    console.log(
      rowData.countryId == "",
      roleRateCost[0]?.cost == "",
      typeof editedRef.current.hourCost == "object"
        ? editedRef.current.hourCost.value == 0
        : editedRef.current.hourCost == 0,
      roleRateCost[0]?.cost == 0,

      rowData.effortHours == "",
      "validations"
    );

    if (
      rowData.countryId == "" ||
      // roleRateCost[0]?.cost == "" ||
      (typeof editedRef.current.hourCost == "object"
        ? editedRef.current.hourCost.value == 0
        : editedRef.current.hourCost == 0) ||
      // roleRateCost[0]?.cost == 0 ||
      //  rowData.hourCost == 0 ||
      rowData.effortHours == ""
    ) {
      setValidateproject(true);
      setTimeout(() => {
        setValidateproject(false);
      }, 2000);

      return;
    } else {
      let bool = null;

      Data.map((ele, index) => {
        // console.log(index+"index");

        let arr = [];

        Object.keys(checkData).map((inEle) => {
          ele[inEle] == checkData[inEle] ? arr.push(true) : arr.push(false);

          // console.log(ele[inEle] + "---" + a[inEle]);
        });

        // console.log("index----" + index);
        // console.log(arr);
        if (arr.includes(false) == false) {
          bool = true;
          return;
        }
      });

      console.log(bool);
      if (bool) {
        // console.log(rowData.roleType, projectData[0]?.projectName, "---consoledata")
        setDupRoleName(rowData?.roleType);
        setDupliRole(true);
        setTimeout(() => {
          setDupliRole(false);
        }, 5000);
        return;
      }

      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/CapacityPlan/saveProjectRoleDetail`,

        data: {
          id: rowData.id == "" || rowData.id == null ? "" : rowData.id,
          projectId: projectId,
          RoleTypeId:
            rowData.roleTypeId == "" || rowData.roleTypeId == null
              ? "345"
              : rowData.roleTypeId,
          RoleName: "",
          description: "",
          IsRoleBillable: "1",
          ProjectRolecol: "",
          BaseLineVersionId: null,
          RoleSite: null,
          LobId: null,
          PlannedStartDate:
            rowData.plannedStartDt == ""
              ? ""
              : moment(rowData.plannedStartDt).format("yyyy-MM-DD"),
          PlannedEndDate:
            rowData.plannedStartDt == ""
              ? ""
              : moment(rowData.plannedEndDt).format("yyyy-MM-DD"),
          countryId: rowData?.countryId,
          hourRate:
            typeof editedRef.current.hourRate == "object"
              ? editedRef.current.hourRate.value
              : typeof editedRef.current.hourRate == "string"
                ? editedRef.current.hourRate
                : rowData.hourRate,

          // hourRate: typeof editedRef.current.hourRate != "number" || typeof editedRef.current.hourRate != "string" ? rowData.hourRate : editedRef.current.hourRate,
          hourcost:
            editedRef.current.hourCost == ""
              ? roleRateCost[0]?.cost
              : typeof editedRef.current.hourCost == "object"
                ? editedRef.current.hourCost.value
                : roleRateCost[0]?.cost == 0 ||
                  roleRateCost[0]?.cost == "" ||
                  editedRef.current.hourCost == 0 ||
                  editedRef.current.hourCost != ""
                  ? editedRef.current.hourCost
                  : roleRateCost[0]?.cost,
          projectoruid: "",
          // "dateCreated":"2023-06-01",
          // "lastUpdated":"2023-06-01",
          createdById: loggedUserId,
          lastUpdatedById: loggedUserId,
          locationId: null,
          actualStartDate: "",
          actualEndDate: "",
          effortHours: rowData.effortHours,
          CostCenterId: null,
        },
      }).then((response) => {
        console.log(response);
        response.data.status == "Saved Successfully"
          ? setAddMessage(true)
          : setEditMessage(true);
        getTableData();
        setValidateproject(false);
        setTimeout(() => {
          setAddMessage(false);
          setEditMessage(false);
        }, 1000);
      });

      setButtonDisabled(true);
      setValid(false);
    }
  };

  const textEditorRoleType = (rowData) => {
    console.log(rowData, "textEditorRoleType called");

    return (
      <>
        <select
          id="roleType"
          name="roleType"
          onChange={(e) => {
            getRoleCountryRate(e.target.value, rowData?.rowData?.countryId);

            rowData.editorCallback(e.target.value);
            role.map((a) => {
              if (a.id == e.target.value) {
                rowData["rowData"]["roleType"] = a.display_name;
                rowData["rowData"]["roleTypeId"] = e.target.value;
              }
            });
            console.log(
              roleRateCost[0]?.cost,
              rowData.rowData.roleType,
              rowData.rowData.roleTypeId,
              e.target.value,
              "roleRateCost[0]?.cost"
            );
          }}
        >
          {/* <option value="">{"<<Please Select>>"}</option> */}
          {role?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == rowData.rowData.roleTypeId ? true : false}
            >
              {Item.id == rowData.rowData.roleTypeId &&
                console.log(Item.id, "itemid")}
              {Item.display_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  const textEditorCountry = (rowData) => {
    // debugger;
    console.log(rowData.rowData.countryId, "---country rowData");

    return (
      <>
        <select
          id="countryId"
          className={`error${validateproject && !rowData.country ? " error-block" : ""
            }`}
          name="country"
          onChange={(e) => {
            // debugger;
            getRoleCountryRate(rowData?.rowData?.roleTypeId, e.target.value); // Call the API with the updated rowData

            rowData.editorCallback(e.target.value);
            setCostFlag(true);

            // console.log(document.getElementsByName("hourRate" + rowData.rowData.id?.toString())[0].value = 0, "document.getElementsByName")
            // document.getElementsByName("hourRate" + rowData.rowData.id?.toString())[0].value = 0;
            // document.getElementsByName(
            //   "hourCost" + rowData.rowData.id?.toString()
            // )[0].value = roleRateCost[0]?.cost;

            country.map((a) => {
              if (a.id == e.target.value) {
                // debugger;
                rowData["rowData"]["country"] = a.country_name;
                rowData["rowData"]["countryId"] = e.target.value;

                // console.log(rowData);
              }
            });
            console.log(roleRateCost[0]?.cost, "roleRateCost[0]?.cost");

            // console.log(rowData);
          }}
        >
          {/* {console.log(country, "country")} */}
          <option value="">{"<<Please Select>>"}</option>
          {country?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={Item.id == rowData.rowData.countryId ? true : false}
            >
              {Item.country_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  useEffect(() => {
    setFinalData(finalDataCopy);
  }, [finalDataCopy]);

  const textEditorHourRate = (rowData) => {
    console.log(
      document.getElementsByName("hourRate" + rowData.rowData.id?.toString())[0]
        ?.value,
      "docman"
    );
    console.log(
      rowData.rowData.hourRate,
      editedRef.current.hourRate,
      "---hourrate"
    );
    return (
      <>
        <input
          // className={`error ${validateproject && !rowData.rowData.hourRate
          //     ? "error-block"
          //     : ""
          //     }`}
          //value={value}
          name={"hourRate" + rowData.rowData.id?.toString()}
          ref={(ele) => {
            console.log("in line 798------");
            console.log(ele);
            console.log(rowData.rowData.hourRate);
            if (ele?.value != null) {
              // editedRef.current["hourCost"] = resp[0].cost;
              ele.value =
                document.getElementsByName(
                  "hourRate" + rowData.rowData.id?.toString()
                )[0]?.value == undefined
                  ? rowData.rowData.hourRate
                  : editedRef.current.hourRate == 0
                    ? 0
                    : rowData.rowData.hourRate == 0 ||
                      rowData.rowData.hourRate == null
                      ? 0
                      : rowData.rowData.hourRate;
              console.log("in line 809-------");
              console.log(ele.value);
              editedRef.current[ele.id] = ele;
              console.log(editedRef.current);
            }
            console.log(ele?.value);
          }}
          type="number"
          //defaultValue={products.rowData.dependency_name}
          // value={document.getElementsByName("hourRate" + rowData.rowData.id?.toString())[0]?.value == 0 ? 0 : rowData.rowData.hourRate == 0 || rowData.rowData.hourRate == null ? 0 : rowData.rowData.hourRate}
          id="hourRate"
          onChange={(e) => {
            // rowData.editorCallback(e.target.value);
            editedRef.current["hourRate"] = e.target.value;
          }}
        />
      </>
    );
  };

  useEffect(() => {
    console.log("in line 784---------");
    console.log(editedRef);
  }, [roleRateCost]);

  const textEditorHourCost = (rowData, cost) => {
    // setRowId(products.rowData.id);
    console.warn(rowData, "hourcost");
    return (
      <>
        <input
          className={`error ${validateproject && !rowData.rowData.hourCost ? "error-block" : ""
            }`}
          type="number"
          //defaultValue={products.rowData.dependency_name}
          // value={
          //   ["", null, undefined].includes(roleRateCost[0]?.cost)
          //     ? rowData.rowData.hourCost
          //     : roleRateCost[0]?.cost == undefined
          //       ? 0
          //       :
          //       roleRateCost[0]?.cost
          // }

          ref={(ele) => {
            console.log("in line 798------");
            console.log(ele);
            console.log(rowData.rowData.hourCost);
            if (ele?.value != null) {
              ele.value = ["", null, undefined].includes(roleRateCost[0]?.cost)
                ? rowData.rowData.hourCost
                : // : rowData.rowData.hourCost != 0
                //   ? rowData.rowData.hourCost
                roleRateCost[0]?.cost;
              console.log("in line 809-------");
              console.log(ele.value);
              editedRef.current[ele.id] = ele;
              console.log(editedRef.current);
            }
            console.log(ele?.value);
          }}
          id="hourCost"
          name={"hourCost" + rowData.rowData.id?.toString()}
          onChange={(e) => {
            // rowData.editorCallback(e.target.value);
            editedRef.current["hourCost"] = e.target.value;
            console.log(e.target.value, "hourcost e.target.value");
          }}
        />
      </>
    );
  };

  const textEditoreffortHours = (rowData) => {
    // setRowId(products.rowData.id);
    return (
      <>
        <input
          className={`error ${validateproject && !rowData.rowData.effortHours ? "error-block" : ""
            }`}
          type="number"
          //defaultValue={products.rowData.dependency_name}
          value={rowData.rowData.effortHours}
          id="effortHours"
          onChange={(e) => {
            rowData.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };
  const textEditorplannedStartDt = (rowData, options) => {
    // console.log(options);
    console.log(
      projectData,
      rowData.rowData.plannedStartDt,
      "rowData for datepicker"
    );
    return (
      rowData.rowData.plannedStartDt != "" && (
        <DatePicker
          name="plannedStartDt"
          selected={
            rowData.rowData.plannedStartDt == null
              ? moment(projectData[0]?.plandStartDate)._d
              : moment(rowData.rowData.plannedStartDt)._d
          }
          id="plannedStartDt"
          value={
            rowData.rowData.plannedStartDt == null
              ? moment(projectData[0]?.plandStartDate)._d
              : moment(rowData.rowData.plannedStartDt)._d
          }
          dateFormat="dd-MMM-yyyy"
          minDate={
            // rowData.rowData.plannedStartDt == null ?
            moment(projectData[0]?.plandStartDate)._d
            // : moment(rowData.rowData.plannedStartDt)._d
          }
          maxDate={
            // rowData.rowData.plandEndDate == null?
            moment(projectData[0]?.plandEndDate)._d
            // : moment(rowData.rowData.plannedEndDt)._d
          }
          onChange={(e) => {
            rowData.editorCallback(moment(e).format("DD-MMM-yyyy"));
            //         setFormEditData((prev) => ({
            //             ...prev,
            //             ["plannedStartDt"]: moment(e).format("yyyy-MM-DD"),
            //         })
            //         );
          }}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />
      )
    );
  };

  const textEditorplannedEndDt = (rowData, options) => {
    // console.log(options);
    console.log(
      rowData.rowData.plannedEndDt,
      rowData.rowData.plandEndDate,
      "rowData for datepicker"
    );
    return (
      rowData.rowData.plannedEndDt != "" && (
        <DatePicker
          name="plannedEndDt"
          selected={
            rowData.rowData.plannedEndDt == null
              ? moment(projectData[0]?.plandEndDate)._d
              : moment(rowData.rowData.plannedEndDt)._d
          }
          id="plannedEndDt"
          value={
            rowData.rowData.plannedEndDt == null
              ? moment(projectData[0]?.plandEndDate)._d
              : moment(rowData.rowData.plannedEndDt)._d
          }
          dateFormat="dd-MMM-yyyy"
          minDate={
            // rowData.rowData.plannedStartDt == null ?
            moment(projectData[0]?.plandStartDate)._d
            // : moment(rowData.rowData.plannedStartDt)._d
          }
          maxDate={
            // rowData.rowData.plannedEndDt == null ?
            moment(projectData[0]?.plandEndDate)._d
            // : moment(rowData.rowData.plannedEndDt)._d
          }
          onChange={(e) => {
            console.log(moment(e).format("DD-MMM-yyyy"));
            rowData.editorCallback(moment(e).format("DD-MMM-yyyy"));
            //         setFormEditData((prev) => ({
            //             ...prev,
            //             ["plannedStartDt"]: moment(e).format("yyyy-MM-DD"),
            //         })
            //         );
          }}
          onKeyDown={(e) => {
            e.preventDefault();
          }}
        />
      )
    );
  };

  const handleplannedStartDt = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={moment(data.plannedStartDt).format("DD-MMM-YYYY")}
      >
        {data.plannedStartDt == "" || data.plannedStartDt == null
          ? ""
          : moment(data.plannedStartDt).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const handleplannedEndDt = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={moment(data.plannedEndDt).format("DD-MMM-YYYY")}
      >
        {data.plannedEndDt == "" || data.plannedEndDt == null
          ? ""
          : moment(data.plannedEndDt).format("DD-MMM-YYYY")}
      </div>
    );
  };

  const handleRoleType = (data) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={data.roleType}>
        {data.count == undefined ? "" : data.roleType + "(" + data.count + ")"}{" "}
      </div>
    );
  };
  const handleBunit = (data) => {
    return <div></div>;
  };
  const handleCountry = (data) => {
    return (
      <div data-toggle="tooltip" title={data.country}>
        {data.country}
      </div>
    );
  };
  const handleLocation = (data) => {
    return <div></div>;
  };
  const handlehourRate = (data) => {
    // debugger;
    // console.log(data, "in hanldehourrate")
    return (
      <div
        data-toggle="tooltip"
        title={
          data.hourRate == 0 || data.hourRate == null
            ? container.textContent + " " + numberWithCommas(0)
            : data.hourRate == ""
              ? container.textContent + " " + numberWithCommas(0)
              : data.hourRate == " "
                ? ""
                : container.textContent + " " + numberWithCommas(data.hourRate)
        }
        style={{ textAlign: "right" }}
      >
        {" "}
        {data.hourRate == 0 || data.hourRate == null
          ? container.textContent + " " + numberWithCommas(0)
          : data.hourRate == ""
            ? container.textContent + " " + numberWithCommas(0)
            : data.hourRate == " "
              ? ""
              : container.textContent + " " + numberWithCommas(data.hourRate)}
      </div>
    );
  };
  const handlehourCost = (data) => {
    // console.log(data.hourCost, "data.hourCost")
    return (
      <div
        data-toggle="tooltip"
        title={
          data.hourCost == null
            ? ""
            : data.hourCost == 0
              ? container.textContent + " " + numberWithCommas(0)
              : container.textContent + " " + numberWithCommas(data.hourCost)
        }
        style={{ textAlign: "right" }}
      >
        {data.hourCost == null
          ? 0
          : data.hourCost == 0
            ? container.textContent + " " + numberWithCommas(0)
            : container.textContent + " " + numberWithCommas(data.hourCost)}
      </div>
    );
  };
  const handleEffortHours = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={numberWithCommas(data.effortHours)}
        style={{ textAlign: "right" }}
      // className={data.effortHours == "" ? "colTotal" : ""}
      >
        {data.effortHours == "" ||
          data.effortHours == 0 ||
          data.effortHours == null
          ? numberWithCommas(0)
          : numberWithCommas(data.effortHours)}
      </div>
    );
  };

  const handleAllocHrs = (data) => {
    // console.log(data.allocHrs, "data.allocHrs")

    return (
      <div
        data-toggle="tooltip"
        title={
          data.roleAllochrs == 0 || data.roleAllochrs == null
            ? numberWithCommas(0)
            : // : data.roleAllochrs == null
            //   ? numberWithCommas(totalallochrs)
            numberWithCommas(data.roleAllochrs)
        }
        style={{ textAlign: "right" }}
      // className={data.roleAllochrs == null ? "colTotal" : ""}
      >
        {data.roleAllochrs == 0 || data.roleAllochrs == null
          ? numberWithCommas(0)
          : // : data.roleAllochrs == null
          //   ? numberWithCommas(totalallochrs)
          numberWithCommas(data.roleAllochrs)}
      </div>
    );
  };
  const handleDailyAllocHrs = (data) => {
    return <div></div>;
  };
  const handleAllocType = (data) => {
    return <div></div>;
  };
  const handleStatus = (data) => {
    return <div></div>;
  };
  const handleBody = (data) => {
    // console.log();
    let today = new Date();
    let formattedDate = moment(today).format("yyyy-MM-DD");
    const isDisable = formattedDate > data.plannedEndDt;
    return (
      <div align="center">
        {data.resIcon == "" || grp2Items[1]?.is_write == false ? (
          ""
        ) : (
          <BsFillPersonPlusFill
            size={"1.2em"}
            color="orange"
            title="Add Resource"
            style={{
              cursor: isDisable ? "no-drop" : "pointer",
              opacity: isDisable && "0.35",
            }}
            onClick={() => {
              setSearchResource(true);
              setResName(data);
            }}
          />
        )}
        {/* {console.log(data.plannedEndDt, formattedDate)} */}
      </div>
    );
  };

  const roleDeleteHandler = (data) => {
    // console.log(data.id, "--id");
    setDeletePopup(true);
    setUid(data.id);
    setDeleteData(data);
  };
  const resourceDeleteHandler = (data) => {
    setDeletePopup(true);
    setUid(data.id);
    setDeleteData(data);
  };

  const handleAction = (data) => {
    return data.action == " " ? (
      ""
    ) : (
      <>
        {/* {console.log(data, "role")} */}
        {/* <AiFillEdit size={"1.0em"} color="orange" onClick={() => { onRowEditComplete(data) }} />&nbsp; */}
        <GoCalendar
          color="orange"
          style={{ cursor: "pointer" }}
          title="Assigned hrs"
          onClick={(e) => {
            setDispCalender(true);
            setCalenderPayload((prev) => ({
              ...prev,
              ["Src"]: "role",
              ["ObjectId"]: data.id,
            }));
            setRoleDisp(data.roleType);
          }}
        />

        {grp2Items[1]?.is_write == true ? (
          <AiFillDelete
            size={"1.0em"}
            title="Delete"
            style={{ cursor: "pointer" }}
            color="orange"
            onClick={() => {
              // console.log("delete clicked", data)
              roleDeleteHandler(data);
            }}
          />
        ) : (
          ""
        )}
      </>
    );
  };
  
  const handleResource = (data) => {
    console.log("venkat");
    setIsReloadedTableData(false)
    return (
      <div data-toggle="tooltip" title={data.resource} onClick={() => { handleResourceClick(data) }}>
        {data.resource}
      </div>
    );
  };
  const handleResourceClick = (data) => {
    axios.get( `http://10.11.12.125:8060/ProjectMS/CapacityPlan/getCapacityPlanNewSubTable?userId=${data.id}`
    ).then((res) => {
      console.log(res.data, "capacityHours")
      setCapacityPlanEditableTableData(res.data);
      setSelectedObjForCapPlanEdit(data)
      setShowCapacityPlanEditable(true)
      window.scrollTo(0, document.body.scrollHeight);
    },(error)=>{
      console.log(error, "capacityHours");
    })
  }
  const handleDescription = (data) => {
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data.description}>
        {data.description}
      </div>
    );
  };
  const handleSubCountry = (data) => {
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data.country}>
        {data.country}
      </div>
    );
  };
  const handleWorkLocation = (data) => {
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data.name}>
        {data.name}
      </div>
    );
  };
  // console.log(container.textContent, "in line 941")
  const handlebillingRate = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={data.billingRate}
        style={{ textAlign: "right" }}
      >
        {container.textContent + " " + numberWithCommas(data.billingRate)}
      </div>
    );
  };
  const handleCost = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={data.cost}
        style={{ textAlign: "right" }}
      >
        {container.textContent + " " + numberWithCommas(data.cost)}
      </div>
    );
  };
  const handleEfforthours = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={data.effort_hours}
        style={{ textAlign: "right" }}
      >
        {numberWithCommas(data.effort_hours)}
      </div>
    );
  };
  const handleDailyhrs = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={data.daily_hours}
        style={{ textAlign: "right" }}
      >
        {numberWithCommas(data.daily_hours)}
      </div>
    );
  };
  const handleSubAllocType = (data) => {
    return (
      <div
        data-toggle="tooltip"
        className="ellipsis"
        title={data.allocationType}
      >
        {data.allocationType}
      </div>
    );
  };
  const handleSubStatus = (data) => {
    setApprovalStatus(data.status);
    return (
      <div data-toggle="tooltip" className="ellipsis" title={data.status}>
        {data.status}
      </div>
    );
  };
  const handleFromDate = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={moment(data.from_dt).format("DD-MMM-YYYY")}
      >
        {moment(data.from_dt).format("DD-MMM-YYYY")}
      </div>
    );
  };
  const handleToDate = (data) => {
    return (
      <div
        data-toggle="tooltip"
        title={moment(data.to_dt).format("DD-MMM-YYYY")}
      >
        {moment(data.to_dt).format("DD-MMM-YYYY")}
      </div>
    );
  };

  const handleSubAction = (data) => {
    let today = new Date();
    let formattedDate = moment(today).format("yyyy-MM-DD");
    let isDisable = formattedDate > data.to_dt;
    // console.log(data, isDisable, "isDisable")
    return (
      <>
        {/* {console.log(data.id, "resource")} */}
        {/* <AiFillEdit size={"1.0em"} color="orange" />&nbsp; */}
        <GoCalendar
          color="orange"
          title="Assigned hrs"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            setDispCalender(true);
            setCalenderPayload((prev) => ({
              ...prev,
              ["Src"]: "res",
              ["ObjectId"]: data.resource_id,
            }));
            setRoleDisp(data.resource);
          }}
        />
        {!isDisable && grp2Items[1]?.is_write == true ? (
          <AiFillDelete
            style={{ cursor: "pointer" }}
            title="Delete row"
            size={"1.0em"}
            color="orange"
            onClick={() => {
              resourceDeleteHandler(data);
            }}
          />
        ) : null}
      </>
    );
  };

  const textEditorbillingRate = (rowData) => {
    return (
      <>
        <input
          // className={`error ${validateproject && !rowData.rowData.hourRate
          //     ? "error-block"
          //     : ""
          //     }`}
          disabled
          type="text"
          //defaultValue={products.rowData.dependency_name}
          value={rowData.rowData.billingRate}
          id="billingRate"
          onChange={(e) => {
            rowData.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const textEditorfromDt = (rowData, options) => {
    return (
      <DatePicker
        name="from_dt"
        selected={moment(rowData.rowData.from_dt)._d}
        id="from_dt"
        value={moment(rowData.rowData.from_dt)._d}
        dateFormat="dd-MMM-yyyy"
        disabled
        onChange={(e) => {
          rowData.editorCallback(moment(e).format("DD-MMM-yyyy"));
          //         setFormEditData((prev) => ({
          //             ...prev,
          //             ["plannedStartDt"]: moment(e).format("yyyy-MM-DD"),
          //         })
          //         );
        }}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
      />
    );
  };

  const textEditortoDt = (rowData, options) => {
    console.log(expandedRows, "---subrowdatepicker");
    return (
      <DatePicker
        name="to_dt"
        selected={moment(rowData.rowData.to_dt)._d}
        id="to_dt"
        value={moment(rowData.rowData.to_dt)._d}
        dateFormat="dd-MMM-yyyy"
        minDate={moment(expandedRows[0]?.plannedStartDt)._d}
        maxDate={moment(expandedRows[0]?.plannedEndDt)._d}
        onChange={(e) => {
          rowData.editorCallback(moment(e).format("yyyy-MM-DD"));
          // setEditFormData((prev) => ({
          //     ...prev,
          //     ["toDate"]: moment(e).format("yyyy-MM-DD"),
          // })
          // );
        }}
        portalId="root-portal"
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        shouldCloseOnBlur={false}
        shouldCloseOnSelect={false}
      />
    );
  };

  const textEditorDailyhrs = (rowData) => {
    return (
      <>
        <input
          // className={`error ${validateproject && !rowData.rowData.hourRate
          //     ? "error-block"
          //     : ""
          //     }`}
          type="text"
          disabled
          //defaultValue={products.rowData.dependency_name}
          value={rowData.rowData.daily_hours}
          id="daily_hours"
          onChange={(e) => {
            rowData.editorCallback(e.target.value);
          }}
        />
      </>
    );
  };

  const textEditorAllocationType = (rowData) => {
    return (
      <>
        <select
          id="allocationType"
          className={`error${validateproject && !rowData.country ? " error-block" : ""
            }`}
          name="allocationType"
          disabled
          onChange={(e) => {
            // console.log(e.target.value);
            rowData.editorCallback(e.target.value);
            allocType.map((a) => {
              if (a.id == e.target.value) {
                rowData["rowData"]["allocationType"] = a.lkup_name;
                rowData["rowData"]["allocation_type_id"] = e.target.value;
                // console.log(rowData);
              }
            });
          }}
        >
          {/* {console.log(allocType, "allocType")} */}
          <option value="">{"<<Please Select>>"}</option>
          {allocType?.map((Item, index) => (
            <option
              key={index}
              value={Item.id}
              selected={
                Item.id == rowData.rowData.allocation_type_id ? true : false
              }
            >
              {Item.lkup_name}
            </option>
          ))}
        </select>
      </>
    );
  };

  const onInnerRowEditComplete = (e) => {
    // console.log(e, "data in line 512");
    let _products = [...subrows];
    let newData = e;
    // _products[index] = newData;
    // console.log(newData, "newdata");
    // console.log(formEditData)
    // setTableData(_products);
    // console.log(e.newData, "--newdata");
    putInnerData(e.newData);
  };

  const putInnerData = (rowData) => {
    // console.log(rowData, typeof (rowData.roleType), typeof (rowData.hourRate), "rowdata");

    if (rowData.toDate == "") {
      setValidateproject(true);
    } else {
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/CapacityPlan/saveInnerTabResource`,

        data: {
          id: rowData.id,
          projectRoleId: rowData.project_role_id,
          resourceId: rowData.resource_id,
          allocationTypeId: rowData.allocation_type_id,
          effortHours: rowData.effort_hours,
          dailyHours: rowData.daily_hours,
          hourlyRate: rowData.billingRate,
          hourlyCost: rowData.cost,
          countryId: rowData.country_id,
          baselineVersionId: null,
          statusId: rowData.status_id,
          comments: "",
          ss: "",
          isprojectTask: null,
          fromDate: rowData.from_dt,
          toDate: rowData.to_dt,
          isDelete: "",
          createdById: loggedUserId,
          lastUpdatedById: loggedUserId,
        },
      }).then((response) => {
        console.log(response);
        response.data.status == "Saved Successfully"
          ? setAddMessage(true)
          : setEditMessage(true);
        getTableData();
        setValidateproject(false);
        setTimeout(() => {
          setAddMessage(false);
          setEditMessage(false);
        }, 1000);
      });
    }
  };

  let rowExpansionTemplate = (data) => {
    setSubrows(data.subrows);
    return (
      <div className="project-role-list-inner-table">
        {/* {console.log(data.subrows)} */}
        <div className="innerTable">
          <DataTable
            value={data.subrows}
            responsiveLayout="scroll"
            onRowEditComplete={onInnerRowEditComplete}
            header={null}
            editMode="row"
            dataKey="id"
            className="p-grid innercapacityPlanTable "
            pagination
            paginator
            rows={5}
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 15, 25, 50]}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
          >
            <Column />
            <Column
              field="resource"
              header={data.resource}
              body={handleResource}
            />
            <Column />
            <Column
              field="description"
              header={data.description}
              body={handleDescription}
            />
            <Column
              field="country"
              header={data.country}
              body={handleSubCountry}
            />
            <Column field="name" header={data.name} body={handleWorkLocation} />
            <Column
              field="billingRate"
              header={data.billingRate}
              body={handlebillingRate}
              editor={(options) => textEditorbillingRate(options)}
            />
            <Column field="cost" header={data.cost} body={handleCost} />
            <Column
              field="from_dt"
              header={data.from_dt}
              body={handleFromDate}
              editor={(options) => textEditorfromDt(options)}
            />
            <Column
              field="to_dt"
              header={data.to_dt}
              body={handleToDate}
              editor={(options) => textEditortoDt(options)}
            />

            <Column />
            <Column
              field="effort_hours"
              header={data.effort_hours}
              body={handleEfforthours}
            />
            <Column
              field="daily_hours"
              header={data.daily_hours}
              body={handleDailyhrs}
              editor={(options) => textEditorDailyhrs(options)}
            />
            <Column
              field="allocationType"
              header={data.allocationType}
              body={handleSubAllocType}
              editor={(options) => textEditorAllocationType(options)}
            />
            <Column
              field="status"
              header={data.status}
              body={handleSubStatus}
            />
            {grp2Items[1]?.is_write == true ? (
              <Column rowEditor />
            ) : (
              <Column
                rowEditor
                style={{ cursor: "not-allowed", pointerEvents: "none" }}
              />
            )}
            <Column body={handleSubAction} />
          </DataTable>
          <>{setSubRowData(Data?.subrows)}</>
          {/* <>{console.log(subRowData)}</> */}
        </div>
      </div>
    );
  };
  return (
    <React.Fragment>
      {uniqueMessage ? (
        <div className="statusMsg error">
          {" "}
          <AiFillWarning /> Please Give Unique Name
        </div>
      ) : (
        ""
      )}
      {console.log(expandedRows, Data, "expandedRows")}
      <div className="p-fluid primeReactTable capacityPlanTable darkHeader toHead">
        <DataTable
          value={Data}
          showGridlines
          editMode="row"
          headerColumnGroup={headerGroup}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          onRowEditComplete={onRowEditComplete}
          rowExpansionTemplate={rowExpansionTemplate}
          pagination
          paginator
          rows={10}
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 15, 25, 50]}
          paginationComponentOptions={{
            rowsPerPageText: "Records per page:",
            rangeSeparatorText: "out of",
          }}
        >
          <Column feild="expand" expander={allowExpansion} />
          <Column
            field="roleType"
            header={Data.roleType}
            body={handleRoleType}
            editor={(options) => textEditorRoleType(options)}
          />
          <Column feild="resIcon" body={handleBody} />
          <Column feild="busUnit" body={handleBunit} />
          <Column
            field="country"
            header={Data.country}
            body={handleCountry}
            editor={(options) => textEditorCountry(options)}
          />
          <Column body={handleLocation} style={{ width: "112px" }} />
          <Column
            field="hourRate"
            header={Data.hourRate}
            body={handlehourRate}
            editor={(options) => textEditorHourRate(options)}
          />
          <Column
            field="hourCost"
            header={Data.hourCost}
            body={handlehourCost}
            editor={(options) => textEditorHourCost(options, Data.hourCost)}
          />
          <Column
            field="plannedStartDt"
            header={Data.plannedStartDt}
            body={handleplannedStartDt}
            editor={(options) => textEditorplannedStartDt(options)}
          />
          <Column
            field="plannedEndDt"
            header={Data.plannedEndDt}
            body={handleplannedEndDt}
            editor={(options) => textEditorplannedEndDt(options)}
          />
          <Column
            field="effortHours"
            header={Data.effortHours}
            body={handleEffortHours}
            editor={(options) => textEditoreffortHours(options)}
          />
          <Column
            field="allocHrs"
            header={Data.roleAllochrs}
            body={handleAllocHrs}
          />
          <Column body={handleDailyAllocHrs} />
          <Column body={handleAllocType} />
          <Column body={handleStatus} />
          {grp2Items[1]?.is_write == true ? (
            <Column rowEditor />
          ) : (
            <Column
              rowEditor
              style={{ pointerEvents: "none", cursor: "not-allowed" }}
            />
          )}
          <Column body={handleAction} />
        </DataTable>
        <div className="capacityPlanTableBottom">
          <div>
            {dataObject?.is_write == true ? (
              <div className="btn-container-events center">
                <button
                  className="btn btn-primary p-1"
                  data-toggle="tooltip"
                  disabled={valid}
                  title="Add new row"
                  onClick={() => {
                    addHandler();
                  }}
                  variant="contained"
                >
                  <MdOutlineAdd size="1.2em" /> Add
                </button>

                <button
                  className="btn btn-primary"
                  disabled={buttonDisabled}
                  onClick={() => {
                    Save();
                  }}
                  data-toggle="tooltip"
                  title="Save row"
                >
                  <TfiSave size={"0.7em"} />
                  <span className="ml-1"> Save </span>
                </button>

                <button
                  className="btn btn-primary p-1"
                  disabled={buttonDisabled}
                  onClick={() => {
                    setFlag(false);
                    Reset();
                  }}
                  data-toggle="tooltip"
                  title="Cancel row editing"
                  variant="contained"
                >
                  <ImCross size={"0.6em"} />
                  <span className="ml-1">Cancel</span>
                </button>
              </div>
            ) : (
              <div className="btn-container-events center">
                <button
                  className="btn btn-primary p-1"
                  data-toggle="tooltip"
                  disabled
                  title="Add new row"
                  onClick={() => {
                    addHandler();
                  }}
                  variant="contained"
                >
                  <MdOutlineAdd size="1.2em" /> Add
                </button>

                <button
                  className="btn btn-primary p-1"
                  disabled
                  onClick={() => {
                    Save();
                  }}
                  data-toggle="tooltip"
                  title="Save row"
                >
                  <TfiSave size={"0.7em"} />
                  <span className="ml-1"> Save </span>
                </button>

                <button
                  className="btn btn-primary p-1"
                  disabled
                  onClick={() => {
                    setFlag(false);
                    Reset();
                  }}
                  data-toggle="tooltip"
                  title="Cancel row editing"
                  variant="contained"
                >
                  <ImCross size={"0.6em"} />
                  <span className="ml-1">Cancel</span>
                </button>
              </div>
            )}
            <div>
              Total Demand hrs:
              <strong>{numberWithCommas(totalEffortHours)}</strong>
            </div>
          </div>
          <div className="p-1">
            Total Allocation hrs:{" "}
            <strong>{numberWithCommas(totalallochrs)}</strong>
          </div>
        </div>
      </div>

      {searchResource ? (
        <CapacityPlanResource
          setErrorMsg={setErrorMsg}
          addErrMsg={addErrMsg}
          setAddErrMsg={setAddErrMsg}
          setErrData={setErrData}
          data={resName}
          projectId={projectId}
          errorMsg={errorMsg}
          setSearchResource={setSearchResource}
          loggedUserId={loggedUserId}
          getTableData={getTableData}
          setEditMessage={setEditMessage}
          setAddMessage={setAddMessage}
          setAddResMessage={setAddResMessage}
          setEditResMessage={setEditResMessage}
          validateproject={validateproject}
          setValidateproject={setValidateproject}
          dailyhrsRange={dailyhrsRange}
          setDailyhrsRange={setDailyhrsRange}
          grp2Items={grp2Items}
        />
      ) : (
        ""
      )}
      {deletePopup ? (
        <CapacityPlanDeletePopup
          // deleteIssue={deleteIssue}
          getTableData={getTableData}
          setStatus={setStatus}
          approvalStatus={approvalStatus}
          addErrMsg={addErrMsg}
          setAddErrMsg={setAddErrMsg}
          setDeleteResourceMessage={setDeleteResourceMessage}
          setDeleteMessage={setDeleteMessage}
          setUid={setUid}
          uid={uid}
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
          deleteData={deleteData}
        />
      ) : (
        ""
      )}
      {dispCalender && (
        <div className="mt-2">
          <div className="collapseHeader revForcast">
            <div className="leftSection">
              <label style={{ minWidth: "fit-content" }}>
                {calenderPayload.Src == "prj"
                  ? projectData[0].projectName
                  : roleDisp}
              </label>
              <select
                name="Typ"
                id="Typ"
                value={calenderPayload.Typ}
                onChange={(e) =>
                  setCalenderPayload((prev) => ({
                    ...prev,
                    ["Typ"]: e.target.value,
                  }))
                }
              >
                <option value="allocations">Allocation Hrs</option>
                <option value="assigned">Assigned Hrs</option>
                <option value="actualHrs">Actual Hrs</option>
                <option value="approvedHrs">Approved Hrs</option>
                <option value="unapprovedHrs">Unapproved Hrs</option>
                <option value="unassigned">Allocation - Assigned Hrs</option>
              </select>
              <select
                name="AllocType"
                id="AllocType"
                value={calenderPayload.AllocType}
                onChange={(e) =>
                  setCalenderPayload((prev) => ({
                    ...prev,
                    ["AllocType"]: e.target.value,
                  }))
                }
              >
                <option value="all">&lt;&lt; ALL &gt;&gt;</option>
                <option value="billable">Billable</option>
                <option value="nonBillUtil">Non Billable Utilized</option>
                <option value="nonBillShad">Non Billable Shadow</option>
                <option value="nonBillEnb">Non Billable Enabled</option>
                <option value="nonBillCliPrep">Non Billable Client Prep</option>
                <option value="nonBillNonUtil">
                  Non Billable Non Utilized
                </option>
                <option value="nonBillInnov">Non-billable Innovation</option>
              </select>
            </div>
            <div className="rightSection">
              <label>Avg :</label>
              <select id="Avg">
                <option value="ge">&#8805;</option>
                <option value="le">&#8804;</option>
                <option value="gt">&#62;</option>
                <option value="lt">&#60;</option>
                <option value="eq">&#9868;</option>
              </select>
              <input
                id="avgtextvalue"
                name="avgtextvalue"
                defaultValue={0}
                onChange={(e) =>
                  setCalenderPayload((prev) => ({
                    ...prev,
                    ["avgtextvalue"]: e.target.value,
                  }))
                }
              />
              %
              <span className="ml-2 chevronContainer">
                <AiOutlineLeftSquare
                  cursor="pointer"
                  size={"2em"}
                  onClick={subtractHandler}
                />
                <span>{moment(calenderPayload.FromDt).format("MMM-YYYY")}</span>
                <AiOutlineRightSquare
                  cursor="pointer"
                  size={"2em"}
                  onClick={addCalenderHandler}
                />
              </span>
              <MdOutlineCancelPresentation
                size={"1.8em"}
                onClick={() => {
                  setDispCalender(false);
                }}
              />
            </div>
          </div>
          <CapacityPlanTotalResCalender
            data={calenderTableData}
            calenderPayload={calenderPayload}
          />

        </div>
      )}
      {showCapacityPlanEditable && (
        <CapactityPlanEditableTable
          tableData={capacityPlanEditableTableData}
          selectedObjForCapPlanEdit = {selectedObjForCapPlanEdit}
          handleResourceClick = {handleResourceClick}
          setIsReloadedTableData = {setIsReloadedTableData}
        />
      )}

    </React.Fragment>


  );
}

export default CapacityPlanDataTable;
