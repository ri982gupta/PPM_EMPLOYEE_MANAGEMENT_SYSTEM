import { useState, useEffect, useRef } from "react";
import {
  CCollapse,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { ColumnGroup } from "primereact/columngroup";

import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";

import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";
import Loader from "../../Loader/Loader";
import { Column } from "ag-grid-community";
import axios from "axios";
import { environment } from "../../../environments/environment";
import { BiRefresh } from "react-icons/bi";
import GlobalValidation from "../../ValidationComponent/GlobalValidation";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";

export default function FixedPriceOpenDataTable(props) {
  const {
    linkId,
    firstTableData,
    projectInfoTab,
    setUpdatedata,
    formData,
    updateddata,
    setProjectinfoTab,
    setLoader,
    isMatchedId,
    isMatchedDMId,
    isMatchedFMId,
    setHidewholetables,
    getGraph,
    getDataBsedGrpah,
    setAddmsg,
    setValidationMessage,
    storegrpahname,
    resourceInfo,
    setResourceInfo,
    billDetailsCount,
    reviewerAction,
    getResourceInfo,
    headerData,
    initailSumOfBillingAmount,
    totalApprovedHrs,
    setTotalApprovedHrs,
  } = props;
  const [visibleA, setVisibleA] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  var GetData;
  const initialValue1 = {};
  const [tabledata, settabledata] = useState(initialValue1);
  const [visibleB, setVisibleB] = useState(false);
  const [cheveronIconB, setCheveronIconB] = useState(FaChevronCircleDown);
  const [cheveronIconA, setCheveronIconA] = useState(FaChevronCircleDown);
  const [nodes, setNodes] = useState(resourceInfo);
  const [NetBillingAmount, setNetBillingAmount] = useState(
    projectInfoTab[0]?.NetBiliingAmount
  );
  const [NetBillingPercentage, setNetBillingPercentage] = useState(
    projectInfoTab[0]?.NetBiliingAmount
  );
  const baseUrl = environment.baseUrl;
  const [sumOfBillAmounts, setSumofBillAmounts] = useState(
    nodes.reduce((acc, node) => {
      // Convert the "billAmount" string to a number and add it to the accumulator
      return acc + parseFloat(node.billTotHours * node.finalBillRate);
    }, 0)
  );
  // const [totalApprovedHrs, setTotalApprovedHrs] = useState(nodes.reduce((acc, node) => {
  //   // Convert the "billAmount" string to a number and add it to the accumulator
  //   return acc + parseFloat(node.wrkApprvHours);
  // }, 0));
  const billingMonth1 = formData.billingMonth;
  const lastDateOfMonth2 = moment(billingMonth1)
    .endOf("month")
    .format("YYYY-MM-DD");
  const loggedUserId = localStorage.getItem("resId");
  const dateStr = formData.billingMonth;
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  const [totalProjectValue, setTotalProjectValue] = useState(
    projectInfoTab[0]?.TotalProjectVal ? projectInfoTab[0].TotalProjectVal : 0
  );
  const [revenueAccured, setRevenueAccured] = useState(
    projectInfoTab[0]?.RevenueAccuredtillDate
      ? projectInfoTab[0].RevenueAccuredtillDate
      : 0
  );
  const [remainingBudget, setRemainingBudget] = useState(
    projectInfoTab[0]?.bal_amount ? projectInfoTab[0].bal_amount : 0
  );
  const [projectCompletion, setProjectCompletion] = useState(
    projectInfoTab[0]?.projectCompletion
      ? projectInfoTab[0].projectCompletion
      : 0
  );
  const [billingAmount, setBillingAmount] = useState(
    projectInfoTab[0]?.Billingamount != null
      ? projectInfoTab[0].Billingamount
      : initailSumOfBillingAmount
  );
  const [billingAction, setBillingAction] = useState(
    projectInfoTab[0]?.Billingaction
  );
  const [selectaplydis, setSelectaplydis] = useState(
    projectInfoTab[0]?.has_discount == true ? "Yes" : "No"
  );
  const [selectdistype, setSelectdistype] = useState(
    projectInfoTab[0]?.discountType
  );
  const [discAmount, setDiscAmount] = useState(
    projectInfoTab[0]?.discountAmount
  );
  useEffect(() => {
    setTotalProjectValue(
      projectInfoTab[0]?.TotalProjectVal ? projectInfoTab[0].TotalProjectVal : 0
    );
    setRevenueAccured(
      projectInfoTab[0]?.RevenueAccuredtillDate
        ? projectInfoTab[0].RevenueAccuredtillDate
        : 0
    );
    setRemainingBudget(
      projectInfoTab[0]?.bal_amount ? projectInfoTab[0].bal_amount : 0
    );
    setProjectCompletion(
      projectInfoTab[0]?.projectCompletion
        ? projectInfoTab[0].projectCompletion
        : 0
    );
    setBillingAmount(
      projectInfoTab[0]?.Billingamount != null
        ? projectInfoTab[0].Billingamount
        : initailSumOfBillingAmount
    );
    setBillingAction(projectInfoTab[0]?.Billingaction);
    setSelectaplydis(projectInfoTab[0]?.has_discount == true ? "Yes" : "No");
    setSelectdistype(projectInfoTab[0]?.discountType);
    setDiscAmount(projectInfoTab[0]?.discountAmount);
    setIsRefresh(false);
  }, [projectInfoTab]);

  useEffect(() => {
    setSumofBillAmounts(
      nodes.reduce((acc, node) => {
        return acc + parseFloat(node.billTotHours * node.finalBillRate);
      }, 0)
    );
    // setBillingAmount(
    //   projectInfoTab[0]?.Billingamount != null
    //     ? projectInfoTab[0].Billingamount
    //     : (resourceInfo.reduce((acc, node) => {
    //       return acc + parseFloat(node.billTotHours * node.finalBillRate);
    //     }, 0))
    // );
  }, []);

  useEffect(() => {
    if (storegrpahname === "In PM Review") {
      // sumOfBillAmounts =
      setSumofBillAmounts(
        nodes.reduce((acc, node) => {
          // Convert the "billAmount" string to a number and add it to the accumulator
          return acc + parseFloat(node.billTotHours * node.finalBillRate);
        }, 0)
      );
      // if (selectdistype === "Amount") {
      //   setNetBillingAmount(
      //     sumOfBillAmounts - (selectaplydis == "Yes" ? discAmount : 0)
      //   );
      // } else if (selectdistype === "Percentage") {
      //   setNetBillingPercentage(
      //     (sumOfBillAmounts *
      //       (100 - (selectaplydis == "Yes" ? discAmount : 0))) /
      //       100
      //   );
      // }
      // setBillingAmount("");
      // } else {
      //   setSumofBillAmounts(parseFloat(billingAmount)); // Calculate sumOfBillAmounts when billingAmount changes
    }
    if (selectdistype === "Amount") {
      setNetBillingAmount(
        billingAmount - (selectaplydis == "Yes" ? discAmount : 0)
      );
    } else if (selectdistype === "Percentage") {
      setNetBillingPercentage(
        (billingAmount * (100 - (selectaplydis == "Yes" ? discAmount : 0))) /
          100
      );
    }
  }, [billingAmount]);

  const getProjectinfo = () => {
    axios
      .get(baseUrl + `/timeandexpensesms/getProjectInfo?id=${linkId}`)
      .then((res) => {
        const GetData = res.data;
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["has_discount"] =
            GetData[i]["has_discount"] == true ? 1 : 0;
        }
        setProjectinfoTab(GetData);
        setTimeout(() => {
          setLoader(false);
        }, 1000);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
  };

  // =========Search Filters Code=============
  const filtersData = {
    contains: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
  const [filters1, setFilters1] = useState({
    global: filtersData["contains"],
  });

  useEffect(() => {
    setFilters1({
      global: filtersData["contains"],
    });
  }, [headerData]);

  const [globalFilterValue1, setGlobalFilterValue1] = useState("");

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };

    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <span></span>
        <span className="p-input-icon-left tableGsearch">
          <i className="pi pi-search" />
          <InputText
            defaultValue={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
            style={{ textAlign: "center", verticalAlign: "middle" }}
          />
        </span>
      </div>
    );
  };

  const header1 = renderHeader1();
  // =============================== END of Filter code ==================================

  useEffect(() => {
    settabledata(nodes);
  }, [nodes]);
  // useEffect(() => {
  //   settabledata(refreshResourceInfo);
  //   setNodes(refreshResourceInfo);
  // }, [refreshResourceInfo]);
  useEffect(() => {
    setVisibleA(false);
    setVisibleB(false);
    setCheveronIconA(FaChevronCircleDown);
    setCheveronIconB(FaChevronCircleDown);
  }, [linkId]);
  useEffect(() => {
    setNodes(resourceInfo);
  }, [resourceInfo]);

  // useEffect(() => {
  //   setTotalApprovedHrs(nodes.reduce((acc, node) => {
  //     // Convert the "billAmount" string to a number and add it to the accumulator
  //     return acc + parseFloat(node.wrkApprvHours);
  //   }, 0))
  // }, [billingAmount]);

  const wrk_Ot_Hours = (rowData) => {
    const handleChange = (e, billOtHours, id) => {
      const newAllowExtraWkndHours = e.target.value;
      const parsedBillTotHours = parseFloat(rowData.billTotHours);
      // Check if newAllowExtraWkndHours is empty or not a valid number
      if (newAllowExtraWkndHours === "" || isNaN(newAllowExtraWkndHours)) {
        // Set newAllowExtraWkndHours to 0 if it's empty or not a valid number
        const parsedAllowExtraWkndHours = 0;
        const newTotalAmount =
          parsedAllowExtraWkndHours - rowData.billOtHours + parsedBillTotHours;
        const updatedResourceInfo = nodes.map((element) => {
          if (element.id === rowData.id) {
            return {
              ...element,
              billOtHours: newAllowExtraWkndHours,
              billTotHours: newTotalAmount.toFixed(2),
              // unbillHours: newAllowExtraWkndHours * -1,
            };
          } else {
            return element;
          }
        });
        setNodes(updatedResourceInfo);
      } else {
        // Perform calculations with the parsed value when it's not empty
        const parsedAllowExtraWkndHours = parseFloat(newAllowExtraWkndHours);
        const newTotalAmount =
          parsedAllowExtraWkndHours - rowData.billOtHours + parsedBillTotHours;
        const updatedResourceInfo = nodes.map((element) => {
          if (element.id === rowData.id) {
            return {
              ...element,
              billOtHours: newAllowExtraWkndHours,
              billTotHours: newTotalAmount.toFixed(2),
            };
          } else {
            return element;
          }
        });
        setNodes(updatedResourceInfo);
      }
    };

    const handleKeyPress = (e) => {
      const keyCode = e.keyCode || e.which;
      const keyValue = String.fromCharCode(keyCode);
      const regex = /^[0-9]*$/; // only allow digits
      if (!regex.test(keyValue)) {
        e.preventDefault();
      }
    };
    return (
      <>
        <input
          type="text"
          id="billOtHours"
          name="billOtHours"
          defaultValue={rowData.billOtHours}
          title={rowData.billOtHours}
          onChange={(e) => {
            handleChange(e);
          }}
          disabled={
            (isMatchedId == false ||
              !(
                storegrpahname == "In PM Review" ||
                storegrpahname == "DM Rejected" ||
                storegrpahname == "Finance Rejected"
              )) &&
            (isMatchedDMId == false ||
              !(
                storegrpahname == "In DM Review" ||
                storegrpahname == "Finance Rejected"
              ))
          }
          onKeyPress={handleKeyPress}
        />
      </>
    );
  };
  const final_Bill_Ratel = (rowData) => {
    const handleChange = (event) => {
      const { value, id } = event.target;
      setUpdatedata((prev) => ({ ...prev, [id]: value }));
      // Parse newAllowExtraWkndHours and check if it's a valid number
      const newAllowExtraWkndHours = parseFloat(value);
      const newAllowExtraWkndHoursAmt = isNaN(newAllowExtraWkndHours)
        ? 0
        : newAllowExtraWkndHours * 123;
      const updatedResourceInfo = nodes.map((element) => {
        if (element.id === rowData.id) {
          return {
            ...element,
            finalBillRate: isNaN(newAllowExtraWkndHours)
              ? ""
              : newAllowExtraWkndHours *
                (isNaN(
                  billingAmount /
                    (projectInfoTab[0]?.Billingamount != null
                      ? projectInfoTab[0].Billingamount
                      : 0)
                )
                  ? 1
                  : billingAmount /
                    (projectInfoTab[0]?.Billingamount != null
                      ? projectInfoTab[0].Billingamount
                      : 0)
                ).toFixed(4),
            // billAmount: newAllowExtraWkndHours * rowData.billTotHours,
            billAmount: (
              newAllowExtraWkndHours *
              (isNaN(
                billingAmount /
                  (projectInfoTab[0]?.Billingamount != null
                    ? projectInfoTab[0].Billingamount
                    : 0)
              )
                ? 1
                : billingAmount /
                  (projectInfoTab[0]?.Billingamount != null
                    ? projectInfoTab[0].Billingamount
                    : 0)) *
              rowData.billTotHours
            ).toFixed(2),
          };
        } else {
          return element;
        }
      });
      setNodes(updatedResourceInfo);
    };

    const handleKeyPress = (e) => {
      const keyCode = e.keyCode || e.which;
      const keyValue = String.fromCharCode(keyCode);
      const regex = /^[0-9]*$/; // only allow digits
      if (!regex.test(keyValue)) {
        e.preventDefault();
      }
    };
    return (
      <>
        <input
          type="text"
          id="finalBillRate"
          name="finalBillRate"
          value={rowData.finalBillRate}
          title={rowData.finalBillRate}
          onChange={handleChange}
          disabled={true}
          onKeyPress={handleKeyPress}
        />
      </>
    );
  };
  const billTotHoursToFixed = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.billTotHours}
      >
        {rowData.billTotHours}
      </div>
    );
  };

  const wrkOtHourssFixed = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.wrkOtHours}
      >
        {rowData.wrkOtHours}
      </div>
    );
  };
  const bill_Amount = (rowData) => {
    const currencySymbol =
      rowData.currency === "&#36"
        ? "$"
        : rowData.currency === "&#8377"
        ? "₹"
        : "£";
    const billAmountData = isNaN(
      parseFloat(rowData.billTotHours) * parseFloat(rowData.finalBillRate)
    )
      ? 0
      : parseFloat(rowData.billTotHours) * parseFloat(rowData.finalBillRate);
    return (
      <span>
        {currencySymbol}
        {billAmountData.toFixed(2)}
      </span>
    );
  };

  function myFunctions(e) {
    const { value, id } = e.target;
    if (isMatchedFMId == true && storegrpahname == "In Finance Review") {
      projectInfoTab((prev) => ({ ...prev, fin_comments: value }));
    } else {
      projectInfoTab((prev) => ({ ...prev, comments: value }));
    }
  }
  const Comments = (rowData) => {
    const handleChange = (e, id) => {
      const newComments = e.target.value;
      // Create a copy of the resourceInfo array
      const updatedResourceInfo = [...resourceInfo];
      // Find the index of the row you are editing based on the id
      const rowIndex = updatedResourceInfo.findIndex(
        (element) => element.id === id
      );
      // Update the comments for the specific row
      if (rowIndex !== -1) {
        updatedResourceInfo[rowIndex].comments = newComments;
        setNodes(updatedResourceInfo);
      }
    };
    const comments = rowData.comments === "null" ? "" : rowData.comments;
    return (
      <div
        className={
          (isMatchedId === false ||
            !(
              storegrpahname === "In PM Review" ||
              storegrpahname === "DM Rejected" ||
              storegrpahname === "Finance Rejected"
            )) &&
          (isMatchedDMId === false ||
            !(
              storegrpahname === "In DM Review" ||
              storegrpahname === "Finance Rejected"
            ))
            ? "disabledFieldStyles"
            : ""
        }
      >
        <textarea
          className="textarea"
          type="text"
          id="comments"
          name="comments"
          title={comments}
          defaultValue={comments}
          rows={1}
          disabled={
            (isMatchedId === false ||
              !(
                storegrpahname === "In PM Review" ||
                storegrpahname === "DM Rejected" ||
                storegrpahname === "Finance Rejected"
              )) &&
            (isMatchedDMId === false ||
              !(
                storegrpahname === "In DM Review" ||
                storegrpahname === "Finance Rejected"
              ))
          }
          onChange={(e) => {
            handleChange(e, rowData.id); // Pass the id to identify the row
          }}
        />
      </div>
    );
  };

  const std_Bill_Rate = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.stdBillRate}
      >
        {rowData.stdBillRate}
      </div>
    );
  };

  const allocTypeNameTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.allocTypeName}
      >
        {rowData.allocTypeName}
      </div>
    );
  };

  const roleNameTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.roleName}
      >
        {rowData.roleName}
      </div>
    );
  };
  const resourceTooltip = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={rowData.resource}
      >
        {rowData.resource}
      </div>
    );
  };
  const alloc_Hours = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.allocHours}
      >
        {rowData.allocHours}
      </div>
    );
  };

  const leave_Hours = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.leaveHours}
      >
        {rowData.leaveHours}
      </div>
    );
  };

  const wrk_Std_Hours = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.wrkStdHours}
      >
        {rowData.wrkStdHours}
      </div>
    );
  };

  const wrk_Apprv_Hours = (rowData) => {
    return (
      <div
        className="ellipsis"
        align="right"
        data-toggle="tooltip"
        title={rowData.wrkApprvHours}
      >
        {rowData.wrkApprvHours}
      </div>
    );
  };
  const wrkStdHours = (rowData) => {
    return (
      <>
        <input
          type="text"
          title={rowData.wrkApprvHours}
          disabled
          value={rowData.wrkApprvHours}
        />
      </>
    );
  };
  const unbillHours = (rowData) => {
    const unBilledHours = (rowData.wrkStdHours - rowData.billTotHours).toFixed(
      2
    );
    return (
      <div
        className="ellipsis"
        align="left"
        data-toggle="tooltip"
        title={unBilledHours}
      >
        {unBilledHours}
      </div>
    );
  };

  useEffect(() => {
    getProjectinfo();
  }, [linkId]);

  const ref = useRef([]);
  const resourceHandleClick = () => {
    setVisibleA(!visibleA);
    visibleA
      ? setCheveronIconA(FaChevronCircleDown)
      : setCheveronIconA(FaChevronCircleUp);
  };

  const financeHandleClick = () => {
    setVisibleB(!visibleB);
    visibleB
      ? setCheveronIconB(FaChevronCircleDown)
      : setCheveronIconB(FaChevronCircleUp);
  };
  const handleSaveClick = () => {
    let valid = GlobalValidation(ref);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (
      isMatchedId == true &&
      projectInfoTab[0]?.status == "In DM Review" &&
      billingAction == ""
    ) {
      if (valid) {
        {
          setCheveronIconB(FaChevronCircleUp);
          setVisibleB(true);
          setValidationMessage(true);
          setTimeout(() => {
            setValidationMessage(false);
          }, 3000);
        }
        return;
      }
    }

    setLoader(false);
    setHidewholetables(false);
    const discountAmount = Number(updateddata.discount_amount);
    const formattedAmount = discountAmount;
    const billingAmounts = Number(updateddata.billingAmount);
    const BillingAmount = billingAmounts;
    const hasDiscountType =
      projectInfoTab[0]?.has_discount == true ||
      projectInfoTab[0]?.has_discount == 1
        ? 1
        : 0;
    let billingTsDtls = [];
    let obj = [];
    Object.keys(tabledata).forEach((ele) => {
      if (ele != "bill_action") {
        obj = {
          id: tabledata[ele].id ? tabledata[ele].id : 0,
          resourceId: tabledata[ele].resourceId ? tabledata[ele].resourceId : 0,
          billingTsId: tabledata[ele].billingTsId,
          projectRoleId: tabledata[ele].projectRoleId,
          projectRoleRateId: tabledata[ele].projectRoleRateId,
          roleName: tabledata[ele].roleName,
          resource: tabledata[ele].resource,
          allocType: tabledata[ele].allocType ? tabledata[ele].allocType : 0,
          allocTypeName: tabledata[ele].allocTypeName,
          allocHours: tabledata[ele].allocHours,
          wrkStdHours: tabledata[ele].wrkStdHours,
          wrkOtHours: tabledata[ele].wrkOtHours,
          leaveHours: tabledata[ele].leaveHours,
          wrkApprvHours: tabledata[ele].wrkApprvHours,
          stdBillRate: tabledata[ele].stdBillRate,
          billStdHours: tabledata[ele].billStdHours,
          billOtHours: tabledata[ele].billOtHours,
          billTotHours:
            tabledata[ele].billStdHours +
            parseInt(tabledata[ele].billOtHours, 10),
          unbillHours:
            tabledata[ele].billOtHours == 0 || tabledata[ele].billOtHours == ""
              ? 0
              : -tabledata[ele].billOtHours,
          finalBillRate:
            billingAmount == ""
              ? ""
              : billingAmount == 0
              ? 0
              : projectInfoTab[0]?.Billingamount == null
              ? (
                  tabledata[ele].finalBillRate *
                  (billingAmount / sumOfBillAmounts)
                ).toFixed(4)
              : (billingAmount / totalApprovedHrs).toFixed(4),
          billAmount:
            billingAmount == ""
              ? ""
              : billingAmount == 0
              ? 0
              : (
                  tabledata[ele].wrkApprvHours *
                  (projectInfoTab[0]?.Billingamount == null
                    ? tabledata[ele].finalBillRate *
                      (billingAmount / sumOfBillAmounts)
                    : billingAmount / totalApprovedHrs)
                ).toFixed(2),
          roleSite: tabledata[ele].roleSite,
          comments: tabledata[ele].comments,
          isDirty: tabledata[ele].isDirty ? "1" : "0",
          currency: tabledata[ele].currency,
        };
      }

      const isEmptyObject = Object.values(obj).every((value, index) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === 0
        ) {
          return true;
        } else {
          return false;
        }
      });
      if (!isEmptyObject) {
        billingTsDtls.push(obj);
      }
    });
    axios({
      method: "post",
      url: baseUrl + `/timeandexpensesms/saveBillingDetails`,
      data: {
        id: projectInfoTab[0]?.id,
        projectId: projectInfoTab[0]?.projectId,
        billingScheduleId: projectInfoTab[0]?.billing_schedule_id,
        status:
          updateddata.status == ""
            ? projectInfoTab[0]?.status
            : updateddata.status,
        fromDate: formData.billingMonth,
        toDate: formData.billingMonth ? lastDateOfMonth2 : "",
        billAction:
          updateddata.bill_action == ""
            ? projectInfoTab[0]?.Billingaction
            : updateddata.bill_action,
        billingAmount: parseInt(billingAmount)
          ? parseInt(billingAmount)
          : billingAmount == ""
          ? projectInfoTab[0]?.billingAmount == null
            ? sumOfBillAmounts
            : projectInfoTab[0]?.billingAmount
          : 0,
        hasDiscount:
          updateddata.has_discount == ""
            ? hasDiscountType
            : updateddata.has_discount == "Yes"
            ? 1
            : 0,
        discountType: selectaplydis == "Yes" ? selectdistype : null,
        discountAmount:
          selectaplydis == "Yes"
            ? selectdistype === "Amount"
              ? discAmount
              : selectdistype === "Percentage"
              ? billingAmount - NetBillingPercentage
              : 0
            : 0,
        net_billAmount:
          selectdistype === "Amount"
            ? NetBillingAmount
            : selectdistype === "Percentage"
            ? NetBillingPercentage
            : billingAmount == ""
            ? projectInfoTab[0]?.billingAmount == null
              ? sumOfBillAmounts
              : projectInfoTab[0]?.billingAmount
            : billingAmount,
        invoiceAmount: projectInfoTab[0]?.invoice_amount,
        createdOn: new Date(),
        comments: projectInfoTab[0]?.comments,
        history: projectInfoTab[0]?.history,
        pctComplete: projectCompletion == null ? 0 : projectCompletion,
        finComments: projectInfoTab[0]?.fin_comments,
        accAmount: revenueAccured == null ? 0 : revenueAccured,
        balAmount: remainingBudget == null ? 0 : remainingBudget,
        totPrjVal: totalProjectValue == null ? 0 : totalProjectValue,
        billingMonth: formData.billingMonth,
        customerId:
          formData.customerId == "" ? loggedUserId : formData.customerId,
        billMonth: formData.billingMonth,
        mgrIds: loggedUserId,
        billingTsDtls: billingTsDtls,
        refreshDate: isRefresh
          ? moment(new Date()).format("yyyy-MM-DD")
          : projectInfoTab[0]?.refreshDate,
      },
    }).then((error) => {
      getGraph();
      getDataBsedGrpah(error.data, storegrpahname);
      getResourceInfo();
      setAddmsg(true);
      setValidationMessage(false);
      setTimeout(() => {
        setAddmsg(false);
        setLoader(false);
      }, 3000);
      axios({
        method: "post",
        // url: "http://localhost:9000/timeandexpensesms/billingTsApprovals/saveHistory",
        url: baseUrl + `/timeandexpensesms/billingTsApprovals/saveHistory`,
        data: {
          billingTsId: projectInfoTab[0]?.id,
          projectId: projectInfoTab[0]?.projectId,
          status: projectInfoTab[0]?.status,
          approverId: loggedUserId,
        },
      })
        .then((res) => {
          console.log("History Added Successfully:", res.data);
        })
        .catch((error) => {
          console.log("Error :" + error);
        });
    });
  };
  const ReadMore = ({ children }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };

    const displayText = text ? (isReadMore ? text.slice(0, 50) : text) : "";
    return (
      <p className="col-md-12 text">
        {displayText ? (
          <>
            <div className="form-group row">
              <label className="col-5" htmlFor="text-input-inline">
                Comments History:
              </label>
            </div>
            <br />
            <span
              dangerouslySetInnerHTML={{
                __html: displayText == null ? "" : displayText,
              }}
            />
            <br />
            <span onClick={toggleReadMore} className="read-or-hide">
              {isReadMore ? (
                <span className="toggleStyle" style={{ color: "#0096D7" }}>
                  Read More...
                </span>
              ) : (
                <span className="toggleStyle" style={{ color: "#0096D7" }}>
                  Hide <i className="fa fa-eye-slash" aria-hidden="true"></i>
                </span>
              )}
            </span>
          </>
        ) : (
          <div className="form-group row">
            <label className="col-5" htmlFor="text-input-inline">
              Comments History
            </label>
          </div>
        )}
      </p>
    );
  };
  const [loaderRefresh, setLoaderRefersh] = useState(false);
  const handleRefreshData = () => {
    axios({
      method: "get",
      url:
        baseUrl +
        `/timeandexpensesms/getUpdatedResourceInfo?BillingTsId=${linkId}`,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        GetData = res.data;
        let totalApprdHrs = res.data.reduce((acc, node) => {
          return acc + parseFloat(node.wrkApprvHours);
        }, 0);
        setTotalApprovedHrs(
          res.data.reduce((acc, node) => {
            return acc + parseFloat(node.wrkApprvHours);
          }, 0)
        );
        for (let i = 0; i < GetData.length; i++) {
          GetData[i]["stdBillRate"] =
            GetData[i]["stdBillRate"] == null
              ? ""
              : GetData[i]["stdBillRate"].toFixed(2);

          GetData[i]["allocHours"] =
            GetData[i]["allocHours"] == null
              ? ""
              : GetData[i]["allocHours"].toFixed(2);

          GetData[i]["leaveHours"] =
            GetData[i]["leaveHours"] == null
              ? ""
              : GetData[i]["leaveHours"].toFixed(2);

          GetData[i]["wrkStdHours"] =
            GetData[i]["wrkStdHours"] == null
              ? ""
              : GetData[i]["wrkStdHours"].toFixed(2);

          GetData[i]["wrkOtHours"] =
            GetData[i]["wrkOtHours"] == null
              ? ""
              : GetData[i]["wrkOtHours"].toFixed(2);

          GetData[i]["wrkApprvHours"] =
            GetData[i]["wrkApprvHours"] == null
              ? ""
              : GetData[i]["wrkApprvHours"].toFixed(2);

          GetData[i]["billTotHours"] =
            GetData[i]["billTotHours"] == null
              ? ""
              : GetData[i]["billTotHours"].toFixed(2);

          GetData[i]["finalBillRate"] =
            GetData[i]["finalBillRate"] == null
              ? ""
              : (
                  billingAmount / (totalApprdHrs == 0 ? 1 : totalApprdHrs)
                ).toFixed(4);

          GetData[i]["billAmount"] =
            GetData[i]["billAmount"] == null
              ? ""
              : (
                  GetData[i]["wrkApprvHours"] *
                  (billingAmount / (totalApprdHrs == 0 ? 1 : totalApprdHrs))
                ).toFixed(2);

          GetData[i]["billOtHours"] =
            GetData[i]["billOtHours"] == null
              ? ""
              : GetData[i]["billOtHours"].toFixed(2);
        }
        setNodes(GetData);
        // setRefreshResourceInfo(GetData);
      })
      .catch((error) => {
        console.log("Error :" + error);
      });
    setLoaderRefersh(true);
    setIsRefresh(true);
    setTimeout(() => {
      setLoaderRefersh(false);
    }, 1000);

    //RefreshData Saving
    const discountAmount = Number(updateddata.discount_amount);
    const formattedAmount = discountAmount;

    const billingAmounts = Number(updateddata.billAmount);
    const BillingAmount = billingAmounts;
    const hasDiscountType =
      projectInfoTab[0]?.has_discount == true ||
      projectInfoTab[0]?.has_discount == 1
        ? 1
        : 0;
    let billingTsDtls = [];
    let obj = [];
    Object.keys(tabledata).forEach((ele) => {
      if (ele != "bill_action") {
        obj = {
          id: tabledata[ele].id ? tabledata[ele].id : 0,
          resourceId: tabledata[ele].resourceId ? tabledata[ele].resourceId : 0,
          billingTsId: tabledata[ele].billingTsId,
          projectRoleId: tabledata[ele].projectRoleId,
          projectRoleRateId: tabledata[ele].projectRoleRateId,
          roleName: tabledata[ele].roleName,
          resource: tabledata[ele].resource,
          allocType: tabledata[ele].allocType ? tabledata[ele].allocType : 0,
          allocTypeName: tabledata[ele].allocTypeName,
          allocHours: tabledata[ele].allocHours,
          wrkStdHours: tabledata[ele].wrkStdHours,
          wrkOtHours: tabledata[ele].wrkOtHours,
          leaveHours: tabledata[ele].leaveHours,
          wrkApprvHours: tabledata[ele].wrkApprvHours,
          stdBillRate: tabledata[ele].stdBillRate,
          billStdHours: tabledata[ele].billStdHours,
          billOtHours: tabledata[ele].billOtHours,
          billTotHours:
            tabledata[ele].billStdHours +
            parseInt(tabledata[ele].billOtHours, 10),
          unbillHours:
            tabledata[ele].billOtHours == 0 || tabledata[ele].billOtHours == ""
              ? 0
              : -tabledata[ele].billOtHours,
          finalBillRate: tabledata[ele].finalBillRate,
          billAmount:
            tabledata[ele].billTotHours * tabledata[ele].finalBillRate,
          roleSite: tabledata[ele].roleSite,
          comments: tabledata[ele].comments,
          isDirty: tabledata[ele].isDirty ? "1" : "0",
          currency: tabledata[ele].currency,
        };
      }
      const isEmptyObject = Object.values(obj).every((value, index) => {
        if (value === null || value === undefined || value === "") {
          return true;
        } else {
          return false;
        }
      });
      if (!isEmptyObject) {
        billingTsDtls.push(obj);
      }
    });
    // axios({
    //   method: "post",
    //   url: baseUrl + `/timeandexpensesms/saveBillingDetails`,
    //   data: {
    //     id: projectInfoTab[0]?.id,
    //     projectId: projectInfoTab[0]?.projectId,
    //     billingScheduleId: projectInfoTab[0]?.billing_schedule_id,
    //     status:
    //       updateddata.status == ""
    //         ? projectInfoTab[0]?.status
    //         : updateddata.status,
    //     fromDate: formData.billingMonth,
    //     toDate: formData.billingMonth ? lastDateOfMonth2 : "",
    //     billAction:
    //       updateddata.bill_action == ""
    //         ? projectInfoTab[0]?.Billingaction
    //         : updateddata.bill_action,
    //     billingAmount: billingAmount ? billingAmount : 0,
    //     hasDiscount:
    //       updateddata.has_discount == ""
    //         ? hasDiscountType
    //         : updateddata.has_discount == "Yes"
    //         ? 1
    //         : 0,
    //     discountType: selectaplydis == "Yes" ? selectdistype : null,
    //     discountAmount:
    //       selectaplydis == "Yes"
    //         ? selectdistype === "Amount"
    //           ? discAmount
    //           : selectdistype === "Percentage"
    //           ? billingAmount - NetBillingPercentage
    //           : 0
    //         : 0,
    //     net_billAmount:
    //       selectdistype === "Amount"
    //         ? NetBillingAmount
    //         : selectdistype === "Percentage"
    //         ? NetBillingPercentage
    //         : billingAmount,
    //     invoiceAmount: projectInfoTab[0]?.invoice_amount,
    //     createdOn: new Date(),
    //     comments: projectInfoTab[0]?.comments,
    //     history: projectInfoTab[0]?.history,
    //     pctComplete: projectCompletion == null ? 0 : projectCompletion,
    //     finComments: projectInfoTab[0]?.fin_comments,
    //     accAmount: revenueAccured == null ? 0 : revenueAccured,
    //     balAmount: remainingBudget == null ? 0 : remainingBudget,
    //     totPrjVal: totalProjectValue == null ? 0 : totalProjectValue,
    //     billingMonth: formData.billingMonth,
    //     customerId:
    //       formData.customerId == "" ? loggedUserId : formData.customerId,
    //     billMonth: formData.billingMonth,
    //     mgrIds: loggedUserId,
    //     // },
    //     billingTsDtls,
    //     refreshDate: projectInfoTab[0]?.refreshDate,
    //   },
    // }).then((error) => {
    //   getResourceInfo();
    //   getProjectinfo();
    // });
  };

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header="Resource Information"
          colSpan={4}
          style={{ textAlign: "center" }}
        />

        <Column header="Hours" colSpan={5} />
        <Column header="Billing Hours" colSpan={3} />
        <Column header="Billing Amount" colSpan={3} />
        <Column
          field="roleSite"
          rowSpan={2}
          header="Comment"
          body={Comments}
        ></Column>
      </Row>

      <Row>
        <Column
          field="allocTypeName"
          header="Allocation"
          body={allocTypeNameTooltip}
        ></Column>
        <Column field="roleName" header="Role" body={roleNameTooltip}></Column>
        <Column
          field="resource"
          header="Resource"
          body={resourceTooltip}
        ></Column>
        <Column field="stdBillRate" header="Rate" body={std_Bill_Rate}></Column>
        <Column
          field="allocHours"
          header="Allocated"
          body={alloc_Hours}
        ></Column>
        <Column
          field="leaveHours"
          header="Vacation"
          body={leave_Hours}
        ></Column>
        <Column
          field="wrkStdHours"
          header="Actual"
          body={wrk_Std_Hours}
        ></Column>
        <Column field="wrkOtHours" header="OT" body={wrkOtHourssFixed}></Column>
        <Column
          field="wrkApprvHours"
          header="Approved"
          body={wrk_Apprv_Hours}
        ></Column>
        <Column field="wrkStdHours" header="Actual" body={wrkStdHours}></Column>
        <Column field="billOtHours" header="OT" body={wrk_Ot_Hours}></Column>
        <Column
          field="billTotHours"
          header="Total"
          body={billTotHoursToFixed}
        ></Column>
        <Column header="Unbilled" body={unbillHours}></Column>
        <Column
          field="finalBillRate"
          header="Rate"
          body={final_Bill_Ratel}
        ></Column>
        <Column field="billAmount" header="Amount" body={bill_Amount}></Column>
      </Row>
      <Row>
        <Column colSpan={12}></Column>
        <Column header="Discount Amount :" colSpan={2}></Column>
        {selectdistype == "Amount" ? (
          <Column header={projectInfoTab[0]?.discountAmount}></Column>
        ) : (
          <Column header={projectInfoTab[0]?.discountAmount}></Column>
        )}
        <Column></Column>
      </Row>
      <Row>
        <Column colSpan={12}></Column>
        <Column header="Net Billing Amount:" colSpan={2}></Column>
        {selectdistype == "Amount" ? (
          <Column header={NetBillingAmount}></Column>
        ) : (
          <Column header={NetBillingPercentage}></Column>
        )}
        <Column></Column>
      </Row>
    </ColumnGroup>
  );

  const headerGroup1 = (
    <ColumnGroup>
      <Row>
        <Column
          header="Resource Information"
          colSpan={4}
          style={{ textAlign: "center" }}
        />
        <Column header="Hours" colSpan={5} />
        <Column header="Billing Hours" colSpan={3} />
        <Column header="Billing Amount" colSpan={3} />
        <Column
          field="comments"
          rowSpan={2}
          header="Comments"
          body={Comments}
        ></Column>
      </Row>

      <Row>
        <Column
          field="allocTypeName"
          bosdy={allocTypeNameTooltip}
          header="Allocation"
          style={{ width: "200px" }}
        ></Column>
        <Column
          field="roleName"
          header="Role"
          body={roleNameTooltip}
          style={{ width: "200px" }}
        ></Column>
        <Column
          field="resource"
          header="Resource"
          bosy={resourceTooltip}
          style={{ width: "200px" }}
        ></Column>
        <Column field="stdBillRate" header="Rate" body={std_Bill_Rate}></Column>
        <Column
          field="allocHours"
          header="Allocated"
          body={alloc_Hours}
        ></Column>
        <Column
          field="leaveHours"
          header="Vacation"
          body={leave_Hours}
        ></Column>
        <Column
          field="wrkStdHours"
          header="Actual"
          body={wrk_Std_Hours}
        ></Column>
        <Column field="wrkOtHours" header="OT" body={wrkOtHourssFixed}></Column>
        <Column
          field="wrkApprvHours"
          header="Approved"
          body={wrk_Apprv_Hours}
        ></Column>
        <Column field="wrkStdHours" header="Actual" body={wrkStdHours}></Column>
        <Column field="billOtHours" header="OT" body={wrk_Ot_Hours}></Column>
        <Column
          field="billTotHours"
          header="Total"
          body={billTotHoursToFixed}
        ></Column>
        <Column header="Unbilled" body={unbillHours}></Column>
        <Column
          field="finalBillRate"
          header="Rate"
          body={final_Bill_Ratel}
        ></Column>
        <Column field="billAmount" header="Amount" body={bill_Amount}></Column>
      </Row>
    </ColumnGroup>
  );

  return (
    <>
      <div>
        {isMatchedId == false ||
        !(
          (
            storegrpahname == "In PM Review" ||
            storegrpahname == "DM Rejected" ||
            storegrpahname === "Finance Rejected"
          )
          //   ))
          //   &&
          // (isMatchedDMId == false ||
          //   !(
          //     storegrpahname == "In DM Review" ||
          //     storegrpahname == "Finance Rejected"
        ) ? (
          ""
        ) : (
          <div
            onClick={handleRefreshData}
            style={{
              float: "right",
              color: "#15a7ea",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            <span
              className="col-6"
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "black",
              }}
            >
              <BiRefresh style={{ fontSize: "20px" }} />
            </span>
            Refresh Data
          </div>
        )}
        <div className="group mb-1 customCard">
          <div className="col-md-12 collapseHeader">
            <h2>
              <Link onClick={() => resourceHandleClick()}>
                Resource Information
              </Link>
            </h2>
            <div onClick={() => resourceHandleClick()}>
              <span className="chevron-icon">{cheveronIconA}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={visibleA}>
          {loaderRefresh ? <Loader /> : ""}

          <div>
            <div className="group mb-3 customCard darkHeader">
              {selectaplydis == "Yes" ? (
                <DataTable
                  className="primeReactDataTable invoicingSearchTable"
                  value={nodes}
                  paginator
                  rows={10}
                  showGridlines
                  headerColumnGroup={headerGroup}
                  filters={filters1}
                  header={header1}
                >
                  <Column
                    field="allocTypeName"
                    body={allocTypeNameTooltip}
                    style={{ width: "200px" }}
                  ></Column>
                  <Column field="roleName" body={roleNameTooltip}></Column>
                  <Column field="resource" body={resourceTooltip}></Column>
                  <Column field="stdBillRate" body={std_Bill_Rate}></Column>
                  <Column field="allocHours" body={alloc_Hours}></Column>
                  <Column field="leaveHours" body={leave_Hours}></Column>
                  <Column field="wrkStdHours" body={wrk_Std_Hours}></Column>
                  <Column field="wrkOtHours" body={wrkOtHourssFixed}></Column>
                  <Column field="wrkApprvHours" body={wrk_Apprv_Hours}></Column>
                  <Column field="wrkStdHours" body={wrkStdHours}></Column>
                  <Column field="billOtHours" body={wrk_Ot_Hours}></Column>
                  <Column
                    field="billTotHours"
                    body={billTotHoursToFixed}
                  ></Column>
                  <Column body={unbillHours}></Column>
                  <Column
                    field="finalBillRate"
                    body={final_Bill_Ratel}
                  ></Column>
                  <Column field="billAmount" body={bill_Amount}></Column>
                  <Column field="comments" body={Comments}></Column>
                </DataTable>
              ) : (
                <DataTable
                  className="primeReactDataTable invoicingSearchTable"
                  value={nodes}
                  paginator
                  rows={10}
                  showGridlines
                  headerColumnGroup={headerGroup1}
                  filters={filters1}
                  header={header1}
                >
                  <Column
                    field="allocTypeName"
                    body={allocTypeNameTooltip}
                  ></Column>
                  <Column field="roleName" body={roleNameTooltip}></Column>
                  <Column field="resource" body={resourceTooltip}></Column>
                  <Column field="stdBillRate" body={std_Bill_Rate}></Column>
                  <Column field="allocHours" body={alloc_Hours}></Column>
                  <Column field="leaveHours" body={leave_Hours}></Column>
                  <Column field="wrkStdHours" body={wrk_Std_Hours}></Column>
                  <Column field="wrkOtHours" body={wrkOtHourssFixed}></Column>
                  <Column field="wrkApprvHours" body={wrk_Apprv_Hours}></Column>
                  <Column field="wrkStdHours" body={wrkStdHours}></Column>
                  <Column field="billOtHours" body={wrk_Ot_Hours}></Column>
                  <Column
                    field="billTotHours"
                    body={billTotHoursToFixed}
                  ></Column>
                  <Column body={unbillHours}></Column>
                  <Column
                    field="finalBillRate"
                    body={final_Bill_Ratel}
                  ></Column>
                  <Column field="billAmount" body={bill_Amount}></Column>
                  <Column field="comments" body={Comments}></Column>
                </DataTable>
              )}
            </div>
          </div>
        </CCollapse>
      </div>
      {/*  */}
      <div className="fixedPriceClassName">
        <div className="group mb-1 customCard">
          <div className="col-md-12 collapseHeader">
            <h2>
              <Link onClick={() => financeHandleClick()}>
                Financial Information
              </Link>
            </h2>
            <div onClick={() => financeHandleClick()}>
              <span className="chevron-icon">{cheveronIconB}</span>
            </div>
          </div>
        </div>
        <CCollapse visible={visibleB}>
          <div>
            <div className="group-content row mx-2">
              <div className=" col-md-12 mb-2">
                {projectInfoTab.map((list) => (
                  <div className="group-content row">
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="text-input-inline">
                          Total Project Value
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <input
                            type="text"
                            id="total_project_value"
                            name="total_project_value"
                            onKeyDown={(e) => {
                              const isNumericKey = /^[0-9]$/.test(e.key);
                              if (!isNumericKey && e.key !== "Backspace") {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const { value, id } = e.target;
                              setTotalProjectValue(value);
                              setUpdatedata((prev) => ({
                                ...prev,
                                [id]: value,
                              }));
                              // settabledata((prev) => ({
                              //   ...prev,
                              //   [id]: value,
                              // }));
                            }}
                            disabled={
                              isMatchedId == false ||
                              !(
                                storegrpahname == "In PM Review" ||
                                storegrpahname == "DM Rejected" ||
                                storegrpahname === "Finance Rejected"
                              )
                              //   &&
                              // (isMatchedDMId == false ||
                              //   !(
                              //     storegrpahname == "In DM Review" ||
                              //     storegrpahname == "Finance Rejected"
                              //   ))
                            }
                            value={totalProjectValue}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="text-input-inline">
                          Revenue Accrued Till Date
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <input
                            type="text"
                            id="revenue_accured"
                            name="revenue_accured"
                            onKeyDown={(e) => {
                              const isNumericKey = /^[0-9]$/.test(e.key);
                              if (!isNumericKey && e.key !== "Backspace") {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const { value, id } = e.target;
                              setRevenueAccured(value);
                              setUpdatedata((prev) => ({
                                ...prev,
                                [id]: value,
                              }));
                              // settabledata((prev) => ({
                              //   ...prev,
                              //   [id]: value,
                              // }));
                            }}
                            disabled={
                              isMatchedId == false ||
                              !(
                                storegrpahname == "In PM Review" ||
                                storegrpahname == "DM Rejected" ||
                                storegrpahname === "Finance Rejected"
                              )
                              //    &&
                              // (isMatchedDMId == false ||
                              //   !(
                              //     storegrpahname == "In DM Review" ||
                              //     storegrpahname == "Finance Rejected"
                              //   ))
                            }
                            value={revenueAccured}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="text-input-inline">
                          Remaining Budget
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <input
                            type="text"
                            id="remaining_budget"
                            name="remaining_budget"
                            onKeyDown={(e) => {
                              const isNumericKey = /^[0-9]$/.test(e.key);
                              if (!isNumericKey && e.key !== "Backspace") {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const { value, id } = e.target;
                              setRemainingBudget(value);
                              setUpdatedata((prev) => ({
                                ...prev,
                                [id]: value,
                              }));
                              // settabledata((prev) => ({
                              //   ...prev,
                              //   [id]: value,
                              // }));
                            }}
                            disabled={
                              isMatchedId == false ||
                              !(
                                storegrpahname == "In PM Review" ||
                                storegrpahname == "DM Rejected" ||
                                storegrpahname === "Finance Rejected"
                              )
                              //   &&
                              // (isMatchedDMId == false ||
                              //   !(
                              //     storegrpahname == "In DM Review" ||
                              //     storegrpahname == "Finance Rejected"
                              //   ))
                            }
                            value={remainingBudget}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="text-input-inline">
                          Project Completion (%)
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <input
                            type="text"
                            id="project_completion"
                            name="project_completion"
                            onKeyDown={(e) => {
                              const isNumericKey = /^[0-9]$/.test(e.key);
                              if (!isNumericKey && e.key !== "Backspace") {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const { value, id } = e.target;
                              setProjectCompletion(value);
                              setUpdatedata((prev) => ({
                                ...prev,
                                [id]: value,
                              }));
                              // settabledata((prev) => ({
                              //   ...prev,
                              //   [id]: value,
                              // }));
                            }}
                            disabled={
                              isMatchedId == false ||
                              !(
                                storegrpahname == "In PM Review" ||
                                storegrpahname == "DM Rejected" ||
                                storegrpahname === "Finance Rejected"
                              )
                              //   &&
                              // (isMatchedDMId == false ||
                              //   !(
                              //     storegrpahname == "In DM Review" ||
                              //     storegrpahname == "Finance Rejected"
                              //   ))
                            }
                            value={projectCompletion}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="text-input-inline">
                          Billing Amount
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <input
                            type="text"
                            id="billing_amount"
                            name="billing_amount"
                            onKeyDown={(e) => {
                              const isNumericKey = /^[0-9]$/.test(e.key);
                              if (!isNumericKey && e.key !== "Backspace") {
                                e.preventDefault();
                              }
                            }}
                            onChange={(e) => {
                              const { value, id } = e.target;
                              // setBillingAmount(value);
                              if (value == "") {
                                setBillingAmount(""); // Set to an empty string
                              } else {
                                setBillingAmount(value);
                              }
                              setUpdatedata((prev) => ({
                                ...prev,
                                [id]: value,
                              }));
                            }}
                            disabled={
                              isMatchedId == false ||
                              !(
                                storegrpahname == "In PM Review" ||
                                storegrpahname == "DM Rejected" ||
                                storegrpahname === "Finance Rejected"
                              )
                              //   &&
                              // (isMatchedDMId == false ||
                              //   !(
                              //     storegrpahname == "In DM Review" ||
                              //     storegrpahname == "Finance Rejected"
                              //   ))
                            }
                            value={billingAmount}
                            // projectInfoTab[0]?.Billingamount != null
                            // ? billingAmount
                            // :initailSumOfBillingAmount}
                            defaultValue={initailSumOfBillingAmount}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="duration">
                          Billing Action &nbsp;
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <select
                            ref={(ele) => {
                              ref.current[0] = ele;
                            }}
                            className="text cancel"
                            id="bill_action"
                            onChange={(e) => {
                              const { value, id } = e.target;
                              setBillingAction(value);
                              setUpdatedata((prev) => ({
                                ...prev,
                                [id]: value,
                              }));
                              // settabledata((prev) => ({
                              //   ...prev,
                              //   [id]: value,
                              // }));
                            }}
                            value={billingAction}
                            disabled={
                              (isMatchedId == false ||
                                !(
                                  storegrpahname == "In PM Review" ||
                                  storegrpahname == "DM Rejected" ||
                                  storegrpahname === "Finance Rejected"
                                )) &&
                              (isMatchedDMId == false ||
                                !(
                                  storegrpahname == "In DM Review" ||
                                  storegrpahname == "Finance Rejected"
                                ))
                            }
                          >
                            <option value="">
                              {" "}
                              &lt;&lt;Please Select&gt;&gt;
                            </option>
                            <option value="Bill To Customer">
                              Bill To Customer
                            </option>
                            <option value="Accure Only">Accure Only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="text-input-inline">
                          Apply Discounts
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <select
                            id="has_discount"
                            name="has_discount"
                            onChange={(e) => {
                              const { value, id } = e.target;
                              setSelectaplydis(value);
                              setUpdatedata((prev) => ({
                                ...prev,
                                [id]: value,
                              }));
                              // settabledata((prev) => ({
                              //   ...prev,
                              //   [id]: value,
                              // }));
                            }}
                            value={selectaplydis}
                            disabled={
                              (isMatchedId == false ||
                                !(
                                  storegrpahname == "In PM Review" ||
                                  storegrpahname == "DM Rejected" ||
                                  storegrpahname === "Finance Rejected"
                                )) &&
                              (isMatchedDMId == false ||
                                !(
                                  storegrpahname == "In DM Review" ||
                                  storegrpahname == "Finance Rejected"
                                ))
                            }
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="text-input-inline">
                          Discounts Type
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <select
                            id="discount_type"
                            onChange={(e) => {
                              const { value, id } = e.target;
                              setSelectdistype(value);
                              setUpdatedata((prev) => ({
                                ...prev,
                                [id]: value,
                              }));
                              // settabledata((prev) => ({
                              //   ...prev,
                              //   [id]: value,
                              // }));
                            }}
                            value={selectdistype}
                            disabled={
                              (isMatchedId == false ||
                                !(
                                  storegrpahname == "In PM Review" ||
                                  storegrpahname == "DM Rejected" ||
                                  storegrpahname === "Finance Rejected"
                                )) &&
                              (isMatchedDMId == false ||
                                !(
                                  storegrpahname == "In DM Review" ||
                                  storegrpahname == "Finance Rejected"
                                ))
                                ? true
                                : !(selectaplydis === "Yes")
                            }
                          >
                            <option value="null">{"<<Please Select>>"}</option>
                            <option value="Percentage">Percentage</option>
                            <option value="Amount">Amount</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className=" col-md-4 mb-2">
                      <div className="form-group row">
                        <label className="col-5" htmlFor="text-input-inline">
                          Discount Amount
                        </label>
                        <span className="col-1">:</span>
                        <div className="col-6">
                          <input
                            type="text"
                            id="discount_amount"
                            name="discount_amount"
                            onChange={(e) => {
                              const { value, id } = e.target;
                              setDiscAmount(value);
                              setUpdatedata((prev) => ({
                                ...prev,
                                [id]: value,
                              }));
                              // settabledata((prev) => ({
                              //   ...prev,
                              //   [id]: value,
                              // }));
                            }}
                            onKeyDown={(e) => {
                              const isNumericKey = /^[0-9]$/.test(e.key);
                              if (!isNumericKey && e.key !== "Backspace") {
                                e.preventDefault();
                              }
                            }}
                            disabled={
                              (isMatchedId == false ||
                                !(
                                  storegrpahname == "In PM Review" ||
                                  storegrpahname == "DM Rejected" ||
                                  storegrpahname === "Finance Rejected"
                                )) &&
                              (isMatchedDMId == false ||
                                !(
                                  storegrpahname == "In DM Review" ||
                                  storegrpahname == "Finance Rejected"
                                ))
                                ? true
                                : !(
                                    selectdistype === "Amount" ||
                                    selectdistype === "Percentage"
                                  ) || selectaplydis === "No"
                            }
                            value={discAmount}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-md-12">
                        <ReadMore>
                          {projectInfoTab[0].comments === "null" ||
                          projectInfoTab[0].comments === null ||
                          projectInfoTab[0].comments === ""
                            ? ""
                            : projectInfoTab[0].comments}
                        </ReadMore>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-5" htmlFor="text-input-inline">
                        Comments
                      </label>
                      {/* <span className="col-1">:</span> */}
                      <div
                        className={
                          (isMatchedId == false ||
                            !(
                              storegrpahname == "In PM Review" ||
                              storegrpahname == "DM Rejected" ||
                              storegrpahname === "Finance Rejected"
                            )) &&
                          (isMatchedDMId == false ||
                            !(
                              storegrpahname == "In DM Review" ||
                              storegrpahname == "Finance Rejected"
                            )) &&
                          (isMatchedFMId == false ||
                            !(storegrpahname == "In Finance Review"))
                            ? "disabledFieldStyles"
                            : ""
                        }
                      >
                        <textarea
                          className="textarea"
                          type="text"
                          name="comments"
                          id="comments"
                          style={{
                            position: "relative",
                            minHeight: "40px",
                          }}
                          onChange={(e) => myFunctions(e)}
                          disabled={
                            (isMatchedId == false ||
                              !(
                                storegrpahname == "In PM Review" ||
                                storegrpahname == "DM Rejected" ||
                                storegrpahname === "Finance Rejected"
                              )) &&
                            (isMatchedDMId == false ||
                              !(
                                storegrpahname == "In DM Review" ||
                                storegrpahname == "Finance Rejected"
                              )) &&
                            (isMatchedFMId == false ||
                              !(storegrpahname == "In Finance Review"))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  // </div>
                ))}
              </div>
            </div>
          </div>
        </CCollapse>
        {(isMatchedId == false ||
          !(
            storegrpahname == "In PM Review" ||
            storegrpahname == "DM Rejected" ||
            storegrpahname == "Finance Rejected"
          )) &&
        (isMatchedDMId == false ||
          !(
            storegrpahname == "In DM Review" ||
            storegrpahname == "Finance Rejected" ||
            storegrpahname == "Finance Rejected"
          )) &&
        (isMatchedFMId == false || !(storegrpahname == "In Finance Review")) ? (
          ""
        ) : (
          <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
            <button className="btn btn-primary " onClick={handleSaveClick}>
              <SaveIcon />
              Save
            </button>
          </div>
        )}
        {/* <div className='className="col-md-12 col-sm-12 col-xs-12 btn-container center my-3'>
          <button className="btn btn-primary " onClick={handleSaveClick}>
            <SaveIcon />
            Cancel
          </button>
        </div> */}
      </div>
    </>
  );
}
