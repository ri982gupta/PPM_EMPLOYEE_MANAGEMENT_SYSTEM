import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { TfiSave } from "react-icons/tfi";
import { ImCross } from "react-icons/im";
import { AiFillWarning } from "react-icons/ai";
import moment from "moment";
import { environment } from "../../environments/environment";
import "./CapacityPlan.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import CapacityPlanOverAllocationpopup from "./CapacityPlanOverAllocationpopup";

function CapacityPlanResourceList(props) {
  const {
    tableData,
    Data,
    setAddErrMsg,
    setErrData,
    addErrMsg,
    projectId,
    setSearchResource,
    loggedUserId,
    getTableData,
    setEditMessage,
    setAddMessage,
    setAddResMessage,
    setDailyhrsRange,
    setEditResMessage,
    validateproject,
    setValidateproject,
    dailyhrsRange,
    // grp2Items,
  } = props;
  // console.log(grp2Items);
  const baseUrl = environment.baseUrl;

  const [selectedRows, setSelectedRows] = useState([]);
  const [tableDisable, setTableDisable] = useState(false);
  const [disable, setDisable] = useState(true);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [startDate, setStartDate] = useState(Data.plannedStartDt);
  const [endDate, setEndDate] = useState(Data.plannedEndDt);
  const [saveOverAlloc, setSaveOverAlloc] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [holiday, setholiday] = useState({});
  const [confirmSave, setConfirmSave] = useState(false);
  const [overAllocation, setOverAllocation] = useState(false);
  const initialValue = {
    id: "",
    projectRoleId: Data.id,
    resourceId: tableData.resourceData[0]?.resourceId,
    allocationTypeId: "187",
    effortHours: "0",
    dailyHours: "0",
    hourlyRate: "0",
    hourlyCost: tableData.resHourlyCost[0]?.cost,
    countryId: "3",
    baselineVersionId: null,
    statusId: "474",
    comments: "",
    ss: "",
    isprojectTask: null,
    fromDate: Data.plannedStartDt,
    toDate: Data.plannedEndDt,
    isDelete: "",
    createdById: loggedUserId,
    lastUpdatedById: loggedUserId,
    ProjectId: projectId,
    baseUrl: baseUrl,
  };
  const [formData, setFormData] = useState(initialValue);
  const [allocation, setAllocation] = useState([]);
  console.log(Data, "data in res");
  const scrollToRef = useRef(null);
  const [validation, setValidation] = useState(false);

  const combined_data = [
    { ...tableData.resourceData[0], ...tableData.resHourlyCost[0], ...Data },
  ];
  console.log(combined_data, "----tabledata");

  useEffect(() => {
    setSelectedRowsData((prev) => selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    getAllocationDropdown();
  }, []);

  useEffect(() => {
    if (dailyhrsRange || addErrMsg) {
      window.scrollTo({
        top: scrollToRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [dailyhrsRange, addErrMsg]);
  const getAllocationDropdown = () => {
    axios({
      method: "get",
      url: baseUrl + `/ProjectMS/CapacityPlan/getAllocationDropdown`,
    }).then(function (response) {
      var res = response.data;
      setAllocation(res);
    });
  };

  const getHolidays = () => {
    console.log(tableData);
    axios({
      method: "get",
      url:
        baseUrl +
        `/ProjectMS/CapacityPlan/getHolidays?resId=${tableData.resourceData[0]?.resourceId}&frmDt=${combined_data[0]?.plannedStartDt}&toDt=${combined_data[0]?.plannedEndDt}`,
    }).then(function (response) {
      var res = response.data;
      setholiday(res);
    });
  };

  const handleSelection = (e) => {
    setSelectedRows(e?.value);
    getHolidays();
    console.log("table selected");
    console.log(e.value, "e.value");
    if (e.value) {
      setDisable(false);
    }
  };

  const handleResource = (rowData) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={rowData.resource}>
        {rowData.resource}
      </div>
    );
  };
  const handleDesignation = (rowData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={rowData.designation}
      >
        {rowData.designation}
      </div>
    );
  };
  const handleBunit = (rowData) => {
    return (
      <div
        className="ellipsis"
        data-toggle="tooltip"
        title={rowData.businessUnit}
      >
        {rowData.businessUnit}
      </div>
    );
  };
  const handleLocation = (rowData) => {
    return (
      <div className="ellipsis" data-toggle="tooltip" title={rowData.location}>
        {rowData.location}
      </div>
    );
  };

  const fromDate = (rowData) => {
    return selectedRows
      .map((d) => d.resourceId)
      .includes(rowData.resourceId) ? (
      <div className="datepicker">
        <DatePicker
          showMonthDropdown
          showYearDropdown
          name="fromDt"
          id="fromDt"
          selected={moment(startDate)._d}
          // value={moment(rowData.plannedStartDt)._d}

          dateFormat="dd-MMM-yyyy"
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              ["fromDate"]: moment(e).format("yyyy-MM-DD"),
            }));
            console.log(e);
            setStartDate(moment(e).format("yyyy-MM-DD"));
            setDisable(false);
            // setIsModified(true);
          }}
          // showMonthDropdown
          // showYearDropdown
          // dropdownMode="select"
          minDate={moment(rowData.plannedStartDt)._d}
          maxDate={moment(formData.toDate)._d}
          onKeyDown={(e) => {
            e.preventDefault();
            // if (e.keyCode != 8) {
            //     e.preventDefault();
            // }
          }}
        />
      </div>
    ) : (
      <div
        data-toggle="tooltip"
        title={moment(rowData.plannedStartDt).format("DD-MMM-YYYY")}
      >
        {moment(rowData.plannedStartDt).format("DD-MMM-yyyy")}
      </div>
    );
  };

  const toDate = (rowData) => {
    return selectedRows
      .map((d) => d.resourceId)
      .includes(rowData.resourceId) ? (
      <div className="datepicker">
        <DatePicker
          showMonthDropdown
          showYearDropdown
          name="toDate"
          id="toDate"
          selected={moment(endDate)._d}
          dateFormat="dd-MMM-yyyy"
          // showMonthDropdown
          // showYearDropdown
          // dropdownMode="select"
          minDate={moment(formData.fromDate)._d}
          maxDate={moment(rowData.plannedEndDt)._d}
          onKeyDown={(e) => {
            e.preventDefault();
            if (e.keyCode != 8) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              ["toDate"]: moment(e).format("yyyy-MM-DD"),
            }));
            console.log(e);
            setEndDate(moment(e).format("yyyy-MM-DD"));
            setDisable(false);
            // setIsModified(true);
          }}
        />
      </div>
    ) : (
      <div
        data-toggle="tooltip"
        title={moment(rowData.plannedEndDt).format("DD-MMM-YYYY")}
      >
        {moment(rowData.plannedEndDt).format("DD-MMM-yyyy")}
      </div>
    );
  };
  const availPercentage = (rowData) => {
    return (
      <div
        style={{
          color: rowData.availPercentage < 0 && "red",
          textAlign: "right",
        }}
        data-toggle="tooltip"
        title={rowData.availPercentage}
      >
        {rowData.availPercentage}
      </div>
    );
  };
  const freeHours = (rowData) => {
    return (
      <div
        style={{ color: rowData.freeHours < 0 && "red", textAlign: "right" }}
        data-toggle="tooltip"
        title={rowData.freeHours}
      >
        {rowData.freeHours}
      </div>
    );
  };

  const handleCost = (rowData) => {
    return (
      <div
        style={{ textAlign: "right" }}
        data-toggle="tooltip"
        title={rowData.cost}
      >
        {rowData.cost == null || rowData.cost == 0 ? 0 : rowData.cost}
      </div>
    );
  };
  const hourRate = (rowData) => {
    return selectedRows
      .map((d) => d.resourceId)
      .includes(rowData.resourceId) ? (
      <div>
        <input
          type="text"
          id="hourRate"
          defaultValue="0"
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              ["hourlyRate"]: e.target.value,
            }));
            console.log(e.target.value);
            // onchange(e, rowData)
          }}
        />
      </div>
    ) : (
      <div
        style={{ textAlign: "right" }}
        data-toggle="tooltip"
        title={rowData.hourRate}
      >
        {rowData.hourRate}
      </div>
    );
  };

  const dailyAllocationHrs = (rowData) => {
    console.log(isModified, "isModified");
    return selectedRows
      .map((d) => d.resourceId)
      .includes(rowData.resourceId) ? (
      <div ref={scrollToRef}>
        <input
          className={`error${
            validation && (rowData.revenue == null || rowData.revenue == "")
              ? " error-block"
              : ""
          }`}
          type="text"
          id="revenue"
          defaultValue={
            rowData.revenue == null || rowData.revenue == ""
              ? 0
              : rowData.revenue
          }
          onChange={(e) => {
            const inputValue = e.target.value;
            const isValueValid = inputValue <= 24;

            setFormData((prev) => ({
              ...prev,
              ["dailyHours"]: e.target.value,
            }));
            console.log(e.target.value);
            setIsModified(true);
            // onchange(e, rowData)
            if (isValueValid) {
              const d0 = getJSDateObj(formData.fromDate);
              const d1 = getJSDateObj(formData.toDate);
              const workDays = getWorkingDays(d0, d1);
              var days = workDays - holiday.holidays;
              setFormData((prev) => ({
                ...prev,
                ["effortHours"]: e.target.value * days,
              }));
            } else {
              setDailyhrsRange(true);
              setTimeout(() => {
                setDailyhrsRange(false);
              }, 3000);
              e.target.value = "";
            }
          }}
        />
      </div>
    ) : (
      <div style={{ textAlign: "right" }} data-toggle="tooltip" title="0">
        {rowData.revenue == null || rowData.revenue == "" ? 0 : rowData.revenue}
      </div>
    );
  };
  const allocationHrs = (rowData) => {
    return (
      <div style={{ textAlign: "right" }} data-toggle="tooltip" title="0">
        0
      </div>
    );
  };
  const allocationType = (rowData) => {
    return selectedRows
      .map((d) => d.resourceId)
      .includes(rowData.resourceId) ? (
      <div>
        <select
          className="col-md-12 p0"
          name="allocation"
          id="allocation"
          defaultValue="187"
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              ["allocationTypeId"]: e.target.value,
            }));
            console.log(e.target.value);

            // handleChange(e.target?.id);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* <option value="0" > &lt;&lt;Please Select&gt;&gt;</option> */}
          {allocation.map((Item) => (
            <option
              value={Item.id}
              selected={
                Item.id == rowData.subrows[0]?.allocation_type_id ? true : false
              }
            >
              {" "}
              {Item.lkup_name}
            </option>
          ))}
        </select>
      </div>
    ) : (
      // rowData.subrows[0]?.allocationType
      ""
    );
  };
  console.log(holiday, "-- holiday");

  const onchange = (e, rowData) => {
    const index = selectedRowsData.findIndex(
      (selectedRowData) => selectedRowData.id === rowData.id
    );
    const updatedSelectedRowsData = [...selectedRowsData];
    updatedSelectedRowsData[index] = {
      ...updatedSelectedRowsData[index],
      cslId: e.id,
    };
    setSelectedRowsData(updatedSelectedRowsData);
  };

  const handleCalculate = () => {
    const d0 = getJSDateObj(formData.fromDate);
    const d1 = getJSDateObj(formData.toDate);
    const sDate = `${d0.getFullYear()}-${d0.getMonth() + 1}-${d0.getDate()}`;
    const eDate = `${d1.getFullYear()}-${d1.getMonth() + 1}-${d1.getDate()}`;

    const workDays = getWorkingDays(d0, d1);
    console.log(
      holiday.holidays,
      formData.dailyHours,
      combined_data[0].freeHours,
      "workDays"
    );
    var days = workDays - holiday.holidays;
    let setEffhrs = days * formData.dailyHours;
    // setFormData(prev => ({ ...prev, ["effortHours"]: formData.dailyHours * days }))

    console.log(days, "days");
    let isOverallocated = setEffhrs > combined_data[0].freeHours ? 1 : 0;
    console.log(isOverallocated);
    return isOverallocated;
    // == 1 ? setOverAllocation(true) : setOverAllocation(false)
  };

  function getWorkingDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    let workingDays = 0;

    while (start <= end) {
      // Check if the current day is a weekend (Saturday or Sunday)
      if (start.getDay() !== 0 && start.getDay() !== 6) {
        // Increment the working days counter
        workingDays++;
      }

      // Move to the next day
      start.setDate(start.getDate() + 1);
    }

    return workingDays;
  }

  function getJSDateObj(dateStr) {
    // Split the date string into year, month, and day
    const [year, month, day] = dateStr.split("-").map(Number);

    // Create a new Date object with the provided year, month (zero-based), and day
    const dateObj = new Date(year, month - 1, day);

    return dateObj;
  }



  function FormDataCheck(Data, formData) {
    console.log(Data, formData);

    // Find subrows with the same resourceId as formData
    const matchingSubrows = Data.subrows.filter((subrow) => {
      return subrow.resource_id == formData.resourceId;
    });

    if (matchingSubrows.length > 0) {
      const formDataFromDate = new Date(formData.fromDate);
      const formDataToDate = new Date(formData.toDate);

      // Check for date range overlap with matching subrows
      const isDateOverlap = matchingSubrows.some((subrow) => {
        const subrowFromDt = new Date(subrow.from_dt);
        const subrowToDt = new Date(subrow.to_dt);
        console.log(subrowFromDt, subrowToDt);
        return (
          formDataFromDate <= subrowToDt && formDataToDate >= subrowFromDt
        );
      });

      if (isDateOverlap) {
        // Show an error message or take appropriate action
        console.log(
          formDataFromDate,
          formDataToDate,
          'Date range overlaps with existing data. Show error message.'
        );
        return true;
      } else {
        // Perform the save action
        console.log('Date range does not overlap. Proceed with save.');
        return false;
      }
    } else {
      // Perform the save action
      console.log('Resource not present. Proceed with save.');
      return false;
    }
  }







  const handleSaveButtonClick = () => {
    sendSelectedRowsData(null, null, true, false);
  };

  const sendSelectedRowsData = (e, rowData, shouldSendRequest, confirmSave) => {
    console.log(isModified);
    // console.log(cslId);
    console.log(formData, "post data");
    let isFormDataPresent = FormDataCheck(Data, formData);

    const isOverallocated = handleCalculate(); // Check overallocation

    if (isOverallocated && !confirmSave) {
      setOverAllocation(true);
      // Set overAllocation state to show the popup
      return; // Exit the function without saving
    }
    if (
      formData.dailyHours == 0 ||
      formData.dailyHours == null ||
      formData.dailyHours == ""
    )
      setValidation(true);

    if (isModified == false) {
      setErrorMessage(
        <div>
          <AiFillWarning style={{ marginTop: "-3px" }} />
          &nbsp;Please provide highlighted values
        </div>
      );

      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return;
    }

    if (isFormDataPresent) {
      setErrData((prevState) => {
        return {
          ...prevState,
          ["resName"]: tableData.resourceData[0]?.resource,
          ["roleType"]: combined_data[0]?.roleType,
          ["fromDate"]: formData.fromDate,
          ["toDate"]: formData.toDate,
        };
      })
      setAddErrMsg(true);
      setTimeout(() => {
        setAddErrMsg(false);
      }, 5000);
      return;

    }
    if (shouldSendRequest || confirmSave) {
      axios({
        method: "post",
        url: baseUrl + `/ProjectMS/CapacityPlan/saveInnerTabResource`,

        data: formData,
      }).then((response) => {
        console.log(response);
        response.data.status == "Saved Successfully"
          ? setAddResMessage(true)
          : setEditResMessage(true);
        getTableData();
        // setValidateproject(false);
        setTimeout(() => {
          setAddResMessage(false);
          setEditResMessage(false);
        }, 2000);
      });
    }
  };

  return (
    <>
      {errorMessage && <div className="statusMsg error">{errorMessage}</div>}

      <div className="tableHeader">
        <div className="leftSection">
          <h2>Resource List</h2>
        </div>
      </div>
      <div
        className="p-fluid capacityPlanResTable darkHeader"
        style={{ marginTop: "-2px" }}
      >
        <DataTable
          value={combined_data}
          className="primeReactDataTable"
          selectionMode="checkbox"
          selection={selectedRows}
          editMode="row"
          rows={10}
          showGridlines
          dataKey="id"
          disabled={tableDisable}
          onSelectionChange={(e) => handleSelection(e)}
          emptyMessage="No Data Found"
        >
          {/* {grp2Items[1]?.is_write == true && ( */}
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem", padding: "0px 22px" }}
          ></Column>
          {/* )} */}

          <Column
            field="resource"
            header="Resource"
            body={handleResource}
          ></Column>
          <Column
            field="designation"
            header="Designation"
            body={handleDesignation}
          ></Column>
          <Column
            field="businessUnit"
            header="Business Unit"
            body={handleBunit}
          ></Column>
          <Column
            field="location"
            header="Location"
            body={handleLocation}
          ></Column>
          <Column
            field="plannedStartDt"
            header="From Date"
            body={fromDate}
            onChange={(e) => onchange(e, rowData)}
          ></Column>
          <Column
            field="plannedEndDt"
            header="To Date"
            body={toDate}
            // onChange={(e) => onchange(e, rowData)}
          ></Column>
          <Column
            field="availPercentage"
            header="Available %"
            body={availPercentage}
          ></Column>
          <Column
            field="freeHours"
            header="Available Hrs"
            body={freeHours}
          ></Column>
          <Column
            field="hourRate"
            header="Hourly Rate"
            body={hourRate}
            // onChange={(e) => onchange(e, rowData)}
          ></Column>
          <Column field="cost" header="Hourly Cost" body={handleCost}></Column>
          <Column
            field="revenue"
            header="Daily Allocation Hrs"
            body={dailyAllocationHrs}
            // onChange={(e) => onchange(e, rowData)}
          ></Column>
          <Column
            field="revenue"
            header="Allocation Hrs"
            body={allocationHrs}
          ></Column>
          <Column
            field=""
            header="Allocation Type"
            body={allocationType}
          ></Column>
        </DataTable>
        {/* {grp2Items[1]?.is_write == true ? ( */}
        <div className="col-12 my-3 align center">
          <button
            className="btn btn-primary mr-2"
            onClick={handleSaveButtonClick}
            data-toggle="tooltip"
            title="Save"
          >
            <TfiSave /> Save
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearchResource(false);
            }}
            data-toggle="tooltip"
            title="Cancel "
          >
            <ImCross />
            Cancel
          </button>
        </div>
        {/* ) : (
          ""
        )} */}
      </div>
      {overAllocation && (
        <CapacityPlanOverAllocationpopup
          data={tableData}
          sendSelectedRowsData={sendSelectedRowsData}
          overAllocation={overAllocation}
          setConfirmSave={setConfirmSave}
          setOverAllocation={setOverAllocation}
          setSaveOverAlloc={setSaveOverAlloc}
        />
      )}
    </>
  );
}
export default CapacityPlanResourceList;
