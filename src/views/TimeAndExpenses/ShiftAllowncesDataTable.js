import { Column } from "ag-grid-community";
import React from "react";
import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { useEffect } from "react";
import { Checkbox } from "primereact/checkbox";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { IconButton } from "@mui/material";

import ExcelJS from "exceljs";
import Loader from "../Loader/Loader";
import { seriesType } from "highcharts";
import useDynamicMaxHeight from "../PrimeReactTableComponent/useDynamicMaxHeight";
import "./ShiftAllowancesDataTable.scss";

function ShiftAllowncesDataTable(props) {
  const {
    data,
    setData,
    globalFilterValue,
    setGlobalFilterValue,
    bodyData,
    prevComments,
    fileName,
    dataAccess,
    column,
    setEmpallowStatus,
    setSelectedData,
    tableDataNew,
    loggedUserId,
    loader,
    open,
    selectedData,
    state,
    checkedData,
    setCheckedData,
    setStatusComments,
    roles,
    configAccessFinanceprop,
    configAccessAdminprop,
    configAccessHrprop,
    setPrevComments,
    setAnchorEl,
    permissions,
  } = props;
  const [nodes, setNodes] = useState();
  // const [checkedData, setCheckedData] = useState([]);
  const [headerData, setHeaderData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [checkboxSelect, setCheckboxSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isCheckedList, setIsCheckedList] = useState([]);
  console.log(nodes);
  useEffect(() => {
    setNodes(data);
  }, [data]);

  const [statusId, setStatusId] = useState([]);

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  // const [globalFilterValue, setGlobalFilterValue] = useState("");
  const materialTableElement = document.getElementsByClassName(
    "shiftAllowanceTable darkHeader"
  );
  const maxHeight = useDynamicMaxHeight(materialTableElement, "fixedcreate");
  document.documentElement.style.setProperty(
    "--dynamic-value",
    `${maxHeight - 146}px`
  );

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  // const onGlobalFilterChange = (e) => {
  //   const value = e.target.value;
  //   let _filters = { ...filters };

  //   _filters["global"].value = value;

  //   setFilters(_filters);
  //   // setGlobalFilterValue("");
  // };
  useEffect(() => {
    setCheckedData([]);
    // setStatusComments("");
    // setNodes([]);
  }, [data, globalFilterValue]);
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };
  console.log(column, data[0]);
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], { type: EXCEL_TYPE });
        module.default.saveAs(data, fileName + EXCEL_EXTENSION);
      }
    });
  };
  const exportExcel = () => {
    const desiredColumns = [
      "empId",
      "empName",
      "customers",
      "projects",
      "res_ww",
      "allow_days",
      "allow_amt",
      "allow_extra_hours",
      "allow_extra_hours_amt",
      "allow_wknd_hours",
      "allow_wknd_amt",
      "allow_ocall_hours",
      "allow_ocall_amt",
      "allow_total_amt",
      "allowance_status",
      "comments",
      "prevcomments",
    ];
    import("xlsx").then((xlsx) => {
      const worksheetData = tableDataNew.map((item) =>
        desiredColumns.map((column) => item[column])
      );

      const dataRows = worksheetData.map((item) => Object.values(item));
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(fileName);

      for (let i = 0; i < dataRows.length; i++) {
        const row = worksheet.addRow(dataRows[i]);
      }

      const boldRow = [1];
      boldRow.forEach((index) => {
        const row = worksheet.getRow(index);
        row.font = { bold: true };
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
      });

      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, fileName);
    });
  };

  // const exportExcel = () => {
  //   console.log(tableDataNew[0]);
  //   import("xlsx").then((xlsx) => {
  //     const headers = Object.keys(tableDataNew[0]);
  //     const uniqueHeaders = [...new Set(headers)];
  //     const worksheetData = tableDataNew.map(
  //       (item) => uniqueHeaders.map((header) => item[header])
  //       // item
  //     );
  //     const dataRows = worksheetData.map((item) => Object.values(item));
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet(fileName);
  //     console.log(workbook);
  //     for (let i = 0; i < dataRows.length; i++) {
  //       const row = worksheet.addRow(dataRows[i]);
  //     }
  //     const boldRow = [1];
  //     boldRow.forEach((index) => {
  //       const row = worksheet.getRow(index);
  //       row.font = { bold: true };
  //     });
  //     workbook.xlsx.writeBuffer().then((buffer) => {
  //       const blob = new Blob([buffer], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       });
  //       saveAs(blob, fileName);
  //     });
  //     // const worksheet = xlsx.utils.aoa_to_sheet(worksheetData, {
  //     //   skipHeader: true,
  //     // });
  //     // const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
  //     const excelBuffer = xlsx.write(workbook, {
  //       bookType: "xlsx",
  //       type: "array",
  //     });
  //     saveAsExcelFile(excelBuffer, fileName);
  //   });
  // };

  // const exportExcel = () => {
  //   import("xlsx").then((xlsx) => {
  //     const headers = Object.keys(data[0]);
  //     console.log(headers);
  //     const uniqueHeaders = [...new Set(headers)];
  //     const worksheetData = data.map((item) =>
  //       uniqueHeaders.map((header) => {
  //         const value = item[header];
  //         return value;
  //       })
  //     );

  //     const dataRows = worksheetData.map((item) => Object.values(item));

  //     const workbook = new ExcelJS.Workbook();

  //     const worksheet = workbook.addWorksheet(fileName);
  //     for (let i = 0; i < dataRows.length; i++) {
  //       const row = worksheet.addRow(dataRows[i]);
  //     }
  //     const boldRow = [1];
  //     boldRow.forEach((index) => {
  //       const row = worksheet.getRow(index);
  //       row.font = { bold: true };
  //     });
  //     workbook.xlsx.writeBuffer().then((buffer) => {
  //       const blob = new Blob([buffer], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       });
  //       saveAs(blob, fileName);
  //     });
  //   });
  // };
  const [exportData, setExportData] = useState([]);
  useEffect(() => {
    let imp = ["XLS"];
    setExportData(imp);
  }, []);

  const nameHeader = (
    <div className="shiftAllowanceExpandIcon">
      <span>Name</span>
      <IconButton onClick={() => setExpanded(!expanded)}>
        {expanded ? <BiChevronLeft /> : <BiChevronRight />}
      </IconButton>
    </div>
  );
  const renderHeader = () => {
    return (
      <div className="col-md-12 flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
        <span>
          <i
            style={{ fontSize: "20px", marginTop: "5px", marginLeft: "10px" }}
            class="pi pi-file-excel exportBtn"
            onClick={exportExcel}
            data-pr-tooltip="XLS"
            title="Export to Excel"
          ></i>
        </span>
      </div>
    );
  };
  const header = renderHeader();

  // const header1 = renderHeader1();

  const empid = (rowData) => {
    return <span>{rowData.empId}</span>;
  };
  const empName = (rowData) => {
    return (
      <div className="ellipsis" title={rowData.empName}>
        <span>{rowData.empName}</span>
      </div>
    );
  };
  const customers = (rowData) => {
    return (
      <div className="ellipsis" title={rowData.customers}>
        <span>{rowData.customers}</span>
      </div>
    );
  };
  const projects = (rowData) => {
    return (
      <div className="ellipsis" title={rowData.projects}>
        <span>{rowData.projects}</span>
      </div>
    );
  };
  const res_ww = (rowData) => {
    return (
      <div className="ellipsis" title={rowData.res_ww}>
        <span>{rowData.res_ww}</span>
      </div>
    );
  };
  const allow_days = (rowData) => {
    return (
      <div
        className="ellipsis"
        title={rowData.allow_days}
        style={{ textAlign: "right" }}
      >
        <span>{rowData.allow_days}</span>
      </div>
    );
  };
  const allow_amt = (rowData) => {
    return (
      <div className="ellipsis" title={rowData.allow_amt}>
        <span>
          {
            // rowData.allow_amt.toLocaleString()
            new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(rowData.allow_amt)
          }
        </span>
      </div>
    );
  };

  let extraHoursAmt = 0;

  // bodyExtraHours
  const bodyExtraHours = (rowData) => {
    // const formattedNumber = rowData.allow_extra_hours.toFixed(1);

    const handleChange = (event) => {
      const newAllowExtraHours = event?.target?.value;
      const newAllowExtraHoursAmt = newAllowExtraHours * 125;

      setNodes((prevState) => {
        const nodesCopy = [...prevState];
        const index = nodesCopy.findIndex(
          (element) => element.id == rowData.id
        );
        nodesCopy[index].allow_extra_hours = newAllowExtraHours;
        nodesCopy[index].allow_extra_hours_amt = newAllowExtraHoursAmt;

        return nodesCopy;
      });

      //   data[index].allow_total_amt = parseInt(data[index].allow_total_amt) + parseInt(newAllowExtraHoursAmt);
    };
    const nodesCopy = nodes;
    const index = nodesCopy?.findIndex((element) => element.id == rowData.id);
    const node = nodes[index];

    return (
      <div className="shiftAllowenceExtraHrs">
        <input
          id="allow_extra_hours"
          value={parseInt(node.allow_extra_hours).toFixed(0)}
          type="number"
          style={{ textAlign: "right" }}
          // dir="rtl"
          onChange={handleChange}
          // className="form-control"
          required
        />
      </div>
    );
  };

  const allow_extra_hours_amt = (rowData, newAllowExtraHoursAmt) => {
    return (
      <div style={{ textAlign: "right" }} defaultValue={newAllowExtraHoursAmt}>
        {
          // rowData.allow_extra_hours_amt
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(rowData.allow_extra_hours_amt)
        }
      </div>
    );
    //   <Tooltip title={rowData.allow_extra_hours_amt}><span defaultValue={newAllowExtraHoursAmt}>
    //   {rowData.allow_extra_hours_amt}
    // </span></Tooltip>
  };
  const allow_wknd_hours = (rowData) => {
    const handleChange = (event) => {
      const newAllowExtraWkndHours = event.target.value;
      const newAllowExtraWkndHoursAmt = newAllowExtraWkndHours * 125;
      // data.map(element => {
      //     element.id == rowData.id ? element.allow_wknd_amt = newAllowExtraWkndHoursAmt : rowData.allow_wknd_amt
      // });
      const index = data.findIndex((element) => element.id == rowData.id);
      data[index].allow_wknd_amt = newAllowExtraWkndHoursAmt;
      // data[index].allow_total_amt = parseInt(data[index].allow_total_amt) + parseInt(newAllowExtraWkndHoursAmt);
      // setNodes([...data]);

      setNodes((prevState) => {
        const nodesCopy = [...prevState];
        const index = nodesCopy.findIndex(
          (element) => element.id == rowData.id
        );
        nodesCopy[index].allow_wknd_hours = newAllowExtraWkndHours;
        // nodesCopy[index].allow_extra_hours_amt = newAllowExtraHoursAmt;
        nodesCopy[index].allow_total_amt = parseInt(
          nodesCopy[index].allow_total_amt
        );

        return nodesCopy;
      });
    };
    const nodesCopy = nodes;
    const index = nodesCopy?.findIndex((element) => element.id == rowData.id);
    const node = nodes[index];
    return (
      <>
        <input
          type="number"
          // dir="rtl"
          style={{ textAlign: "right" }}
          value={parseInt(node.allow_wknd_hours).toFixed(0)}
          onChange={handleChange}
        />
      </>
    );
  };
  const allow_wknd_amt = (rowData) => {
    return <div style={{ textAlign: "right" }}>{rowData.allow_wknd_amt}</div>;
    // <Tooltip title={rowData.allow_wknd_amt}><span>{rowData.allow_wknd_amt}</span></Tooltip>;
  };
  const allow_ocall_hours = (rowData) => {
    const handleChange = (e) => {
      const newOncallHrs = e.target.value;
      //   const index = data.findIndex((element) => element.id == rowData.id);
      //   data[index].allow_ocall_hours = newOncallHrs;
      //   setNodes([...data]);
      // };
      setNodes((prevState) => {
        const nodesCopy = [...prevState];
        const index = nodesCopy.findIndex(
          (element) => element.id == rowData.id
        );
        nodesCopy[index].allow_ocall_hours = newOncallHrs;
        // // nodesCopy[index].allow_extra_hours_amt = newAllowExtraHoursAmt;
        // nodesCopy[index].allow_total_amt = parseInt(
        //   nodesCopy[index].allow_total_amt
        // );

        return nodesCopy;
      });
    };
    const nodesCopy = nodes;
    const index = nodesCopy?.findIndex((element) => element.id == rowData.id);
    const node = nodes[index];
    return (
      <>
        <input
          type="number"
          // dir="rtl"
          style={{ textAlign: "right" }}
          value={parseInt(node.allow_ocall_hours).toFixed(0)}
          onChange={handleChange}
        />
      </>
    );
  };
  const allow_ocall_amt = (rowData) => {
    console.log(parseInt(rowData.allow_ocall_amt).toFixed(0));
    const handleChange = (e) => {
      const newOncallAmnt = e.target.value;
      const index = data.findIndex((element) => element.id == rowData.id);
      data[index].allow_ocall_amt = newOncallAmnt;
      console.log(data[index].allow_ocall_amt);
      //   setNodes([...data]);
      // };
      setNodes((prevState) => {
        const nodesCopy = [...prevState];
        const index = nodesCopy.findIndex(
          (element) => element.id == rowData.id
        );
        nodesCopy[index].allow_ocall_amt = newOncallAmnt;
        // // nodesCopy[index].allow_extra_hours_amt = newAllowExtraHoursAmt;
        // nodesCopy[index].allow_total_amt = parseInt(
        //   nodesCopy[index].allow_total_amt
        // );

        return nodesCopy;
      });
    };
    const nodesCopy = nodes;
    const index = nodesCopy?.findIndex((element) => element.id == rowData.id);
    const node = nodes[index];
    return (
      <>
        <input
          type="number"
          // dir="rtl"
          style={{ textAlign: "right" }}
          value={parseInt(node.allow_ocall_amt).toFixed(0)}
          onChange={handleChange}
        />
      </>
    );
  };
  const allow_total_amt = (rowData) => {
    const final_total_Amount =
      parseInt(
        rowData.allow_amt == NaN ||
          rowData.allow_amt == "" ||
          rowData.allow_amt == undefined
          ? "0"
          : rowData.allow_amt
      ) +
      parseInt(
        rowData.allow_ocall_amt == NaN ||
          rowData.allow_ocall_amt == undefined ||
          rowData.allow_ocall_amt == ""
          ? "0"
          : rowData.allow_ocall_amt
      ) +
      parseInt(
        rowData.allow_wknd_amt == NaN ||
          rowData.allow_wknd_amt == undefined ||
          rowData.allow_wknd_amt == ""
          ? "0"
          : rowData.allow_wknd_amt
      ) +
      parseInt(
        rowData.allow_extra_hours_amt == NaN ||
          rowData.allow_extra_hours_amt == undefined ||
          rowData.allow_extra_hours_amt == ""
          ? "0"
          : rowData.allow_extra_hours_amt
      );

    return (
      <div style={{ textAlign: "right" }}>
        {/* {+final_total_Amount.toLocaleString() == NaN
          ? ""
          : +final_total_Amount.toLocaleString()} */}
        {final_total_Amount.toLocaleString()}
      </div>
    );
  };
  const comments = (rowData) => {
    return (
      <>
        <input
          type="text"
          onChange={(e) => {
            setStatusComments(e.target.value);
            console.log(e.target.value);
          }}
        />
      </>
    );
  };
  console.log(dataAccess);
  const prevcomments = (rowData) => {
    return (
      <div style={{ textAlign: "center" }}>
        <i
          type="button"
          className="pi pi-comments"
          style={{ fontSize: "1rem" }}
          onClick={(e) => {
            setPrevComments(rowData.prevcomments);
            console.log(rowData.prevcomments);
            // setAnchorEl(true);
            {
              rowData.prevcomments == null
                ? setAnchorEl(null)
                : setAnchorEl(e.currentTarget);
            }
          }}
        />
      </div>
    );
  };
  console.log(selectedData);
  //     // const obj={};
  //     // obj["resource_id"] =ele
  //     // obj["extra_hours"]=

  //     // })
  //     axios({
  //         method: "post",
  //         url:
  //             baseUrl +
  //             `/timeandexpensesms/ShiftAllownces/postShiftAllownces`,
  //         data: {
  const onSelectionChange = (e) => {
    const selectedIds = e.value;

    // Check the approval status of the selected items
    const areAllSelectedItemsApproved = selectedIds.every(
      (id) => data.find((item) => item.id === id)?.approvalStatus === "Approved"
    );
    console.log(approvalStatus, areAllSelectedItemsApproved);
    // Update the checkbox selection state
    setCheckboxSelect(areAllSelectedItemsApproved);

    // Update the selected data state
    setSelectedData(data.filter((row) => selectedIds.includes(row.id)));
  };

  console.log(dataAccess);
  const checkboxSelectionHandler = (e) => {
    setEmpallowStatus(e.data.allowance_status_id);
    return configAccessFinanceprop == "finConfig" ||
      configAccessHrprop == "hrConfig" ||
      configAccessAdminprop == "adminConfig" ||
      (dataAccess == 46 && e.data.allowance_status_id == 1292) ||
      (dataAccess == 690 && e.data.allowance_status_id != 1292) ||
      (dataAccess == 690 && e.data.allowance_status_id == 1293) ||
      (dataAccess == 900 && e.data.allowance_status_id == 1293) ||
      (dataAccess == 900 && e.data.allowance_status_id == 1292) ||
      loggedUserId == 512 ||
      e.data.allowance_status_id == 1300
      ? true
      : false;
  };
  const isCheckboxDisabled = (rowData) => {
    const acceptedStatuses = [1300];
    return acceptedStatuses?.includes(rowData.allowance_status_id);
  };
  console.log(checkedData);

  const headerCheckbox = (
    <input
      type="checkbox"
      onChange={(e) => {
        console.log(e.target.checked);

        setCheckedData((prevcheckedData) => {
          const allProductIds = data
            .filter((product) => !isCheckboxDisabled(product))
            .map((product) => product.uniqueKey)
            .filter((id) => id !== undefined);
          console.log(e.target.checked);

          return e.target.checked ? allProductIds : [];
        });
        // setSelectedData(
        //   e.target.checked
        //     ? data
        //         .filter((product) => !isCheckboxDisabled(product))
        //         .map((product) => product.status)
        //     : []
        // );
      }}
      checked={
        checkedData.length > 0 &&
        checkedData.length ===
          data
            .filter((product) => !isCheckboxDisabled(product))
            .map((product) => product.uniqueKey)
            .filter((id) => id !== undefined).length
      }
      disabled={data.length === 0}
    />
  );
  console.log(checkedData, selectedData);

  const checkboxBodyTemplate = (rowData) => {
    console.log(
      configAccessFinanceprop,
      dataAccess,
      rowData.allowance_status_id
    );
    console.log(dataAccess, rowData.allowance_status_id);
    const isCheckboxEnabled =
      (!(
        configAccessFinanceprop === "finConfig" &&
        dataAccess == 46 &&
        rowData.allowance_status_id == 1292
      ) &&
        configAccessFinanceprop === "finConfig" &&
        dataAccess == 46 &&
        rowData.allowance_status_id !== 1292 &&
        rowData.allowance_status_id !== 1293 &&
        rowData.allowance_status_id !== 1297 &&
        rowData.allowance_status_id !== 1299 &&
        rowData.allowance_status_id !== 1300) ||
      (configAccessHrprop === "hrConfig" &&
        rowData.allowance_status_id !== 1292 &&
        rowData.allowance_status_id !== 1293 &&
        rowData.allowance_status_id !== 1295 &&
        rowData.allowance_status_id !== 1300) ||
      (dataAccess == 46 && rowData.allowance_status_id == 1292) ||
      (configAccessAdminprop === "adminConfig" &&
        rowData.allowance_status_id !== 1300) ||
      (dataAccess == 1000 &&
        rowData.allowance_status_id != 1295 &&
        rowData.allowance_status_id != 1297 &&
        rowData.allowance_status_id != 1299 &&
        rowData.allowance_status_id != 1300) ||
      (dataAccess == 2000 &&
        rowData.allowance_status_id != 1295 &&
        rowData.allowance_status_id != 1297 &&
        rowData.allowance_status_id != 1299 &&
        rowData.allowance_status_id != 1300) ||
      (dataAccess == 900 &&
        rowData.allowance_status_id != 1295 &&
        // rowData.allowance_status_id !== 1292 &&
        dataAccess == 900 &&
        rowData.allowance_status_id !== 1297 &&
        dataAccess == 900 &&
        rowData.allowance_status_id !== 1299 &&
        dataAccess == 900 &&
        rowData.allowance_status_id !== 1300) ||
      // (dataAccess === 46 && rowData.allowance_status_id === 1292) ||
      (dataAccess === 690 &&
        rowData.allowance_status_id !== 1292 &&
        rowData.allowance_status_id !== 1297 &&
        rowData.allowance_status_id !== 1295 &&
        rowData.allowance_status_id !== 1300 &&
        rowData.allowance_status_id !== 1299) ||
      // (dataAccess === 900 && rowData.allowance_status_id === 1293) ||
      (dataAccess == 46 &&
        rowData.allowance_status_id != 1292 &&
        rowData.allowance_status_id != 1293 &&
        rowData.allowance_status_id != 1295 &&
        rowData.allowance_status_id != 1297 &&
        rowData.allowance_status_id != 1299 &&
        rowData.allowance_status_id != 1300);
    // (dataAccess ==690 && rowData.allowance_status_id)
    loggedUserId === 512;
    // || rowData.allowance_status_id != 1300;

    return (
      <input
        type="checkbox"
        onChange={(e) => {
          if (!isCheckboxDisabled(rowData)) {
            setCheckedData((prevcheckedData) => {
              const isSelected = prevcheckedData.some(
                (id) => id === rowData.uniqueKey
              );

              let updatedSelection;

              if (isSelected) {
                console.log("Deselecting", rowData.id);
                updatedSelection = prevcheckedData.filter(
                  (id) => id !== rowData.uniqueKey
                );
              } else {
                console.log("Selecting", rowData.uniqueKey);
                updatedSelection = [...prevcheckedData, rowData.uniqueKey];
              }

              setSelectedData(
                data.filter((row) => updatedSelection.includes(row.uniqueKey))
              );

              return updatedSelection;
            });
          }
        }}
        checked={
          checkedData.includes(rowData.uniqueKey) &&
          !isCheckboxDisabled(rowData)
        }
        disabled={!isCheckboxEnabled}
      />
    );
  };

  return (
    <div className=" shiftAllowanceTable darkHeader">
      {open && state && (
        <div className="group mb-3 customCard  ">
          {nodes && (
            <DataTable
              value={nodes}
              paginator
              rows={25}
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 15, 25, 50]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
              currentPageReportTemplate="View {first} - {last} of {totalRecords} "
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              rowsPerPageOptions={[10, 25, 50]}
              header={header}
              selection={selectedItems}
              onSelectionChange={onSelectionChange}
              checked={checkboxSelect}
              filters={filters}
              disabled={isCheckboxDisabled}
              showGridlines
              // isDataSelectable={checkboxSelectionHandler}
              responsiveLayout="scroll"
            >
              {/* <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        }  */}
              <Column
                header={headerCheckbox}
                body={checkboxBodyTemplate}
                headerStyle={{ width: "3rem" }}
                style={{ textAlign: "center" }}
              ></Column>

              <Column field="empId" header="Emp ID" body={empid}></Column>
              {/* <Column field="empName" header="Name" body={empName}></Column> */}
              <Column field="empName" header={nameHeader} />
              <Column
                field="customers"
                header="Customers(DP)"
                body={customers}
                style={{ display: expanded ? "table-cell" : "none" }}
              ></Column>
              <Column
                field="projects"
                header="Projects(PM)"
                body={projects}
                style={{ display: expanded ? "table-cell" : "none" }}
              ></Column>
              <Column field="res_ww" header="WW" body={res_ww}></Column>
              <Column
                field="allow_days"
                header="No. Of Days"
                body={allow_days}
              ></Column>
              <Column
                field="allow_amt"
                header="Allow. Amt"
                body={allow_amt}
              ></Column>
              <Column
                field="allow_extra_hours"
                header="Ext. Hrs"
                body={bodyExtraHours}
                // editor={(options) => textEditorAllowExtraHours(options)}
              ></Column>
              <Column
                field="allow_extra_hours_amt"
                header="Ext. Hrs Amt"
                body={allow_extra_hours_amt}
              ></Column>
              <Column
                field="allow_wknd_hours"
                header="Week End Hrs"
                body={allow_wknd_hours}
              ></Column>
              <Column
                field="allow_wknd_amt"
                header="Week End Amt"
                body={allow_wknd_amt}
              ></Column>
              <Column
                field="allow_ocall_hours"
                header="Oncall Hrs"
                body={allow_ocall_hours}
              ></Column>
              <Column
                field="allow_ocall_amt"
                header="Oncall Amt"
                body={allow_ocall_amt}
              ></Column>
              <Column
                field="allow_total_amt"
                header="Tot. Amt"
                body={allow_total_amt}
              ></Column>
              <Column
                field="allowance_status"
                header="Status"
                // body={allow_total_amt}
              ></Column>
              <Column
                field="comments"
                header=" Comments"
                body={comments}
              ></Column>
              <Column
                field="prevcomments"
                header="History"
                body={prevcomments}
              ></Column>
            </DataTable>
          )}
        </div>
      )}
    </div>
  );
}

export default ShiftAllowncesDataTable;
